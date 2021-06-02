
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
            throw new Error(`Function called outside component initialization`);
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
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
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* clsSMTree\libs\oldJsTree.svelte generated by Svelte v3.29.0 */

    function jsTree(a, b) {

    	if (!a.jstree) {
    		var c = 0,
    			d = !1,
    			e = !1,
    			f = !1,
    			g = [],
    			h = a("script:last").attr("src"),
    			i = window.document,
    			j = i.createElement("LI"),
    			k,
    			l;

    		(j.setAttribute("role", "treeitem"), k = i.createElement("I"), k.className = "jstree-icon jstree-ocl", k.setAttribute("role", "presentation"), j.appendChild(k), k = i.createElement("A"), k.className = "jstree-anchor", k.setAttribute("href", "#"), k.setAttribute("tabindex", "-1"), l = i.createElement("I"), l.className = "jstree-icon jstree-themeicon", l.setAttribute("role", "presentation"), k.appendChild(l), j.appendChild(k), k = l = null, a.jstree = {
    			version: "3.2.1",
    			defaults: { plugins: [] },
    			plugins: {},
    			path: h && -1 !== h.indexOf("/")
    			? h.replace(/\/[^\/]+$/, "")
    			: "",
    			idregex: /[\\:&!^|()\[\]<>@*'+~#";.,=\- \/${}%?`]/g,
    			root: "#"
    		}, a.jstree.create = function (b, d) {
    			var e = new a.jstree.core(++c), f = d;

    			return (d = a.extend(!0, {}, a.jstree.defaults, d), f && f.plugins && (d.plugins = f.plugins), a.each(d.plugins, function (a, b) {
    				"core" !== a && (e = e.plugin(b, d[b]));
    			}), a(b).data("jstree", e), e.init(b, d), e);
    		}, a.jstree.destroy = function () {
    			(a(".jstree:jstree").jstree("destroy"), a(i).off(".jstree"));
    		}, a.jstree.core = function (a) {
    			(this._id = a, this._cnt = 0, this._wrk = null, this._data = {
    				core: {
    					themes: { name: !1, dots: !1, icons: !1 },
    					selected: [],
    					last_error: {},
    					working: !1,
    					worker_queue: [],
    					focused: null
    				}
    			});
    		}, a.jstree.reference = function (b) {
    			var c = null, d = null;

    			if ((!b || !b.id || b.tagName && b.nodeType || (b = b.id), !d || !d.length)) try {
    				d = a(b);
    			} catch(e) {
    				
    			}

    			if (!d || !d.length) try {
    				d = a("#" + b.replace(a.jstree.idregex, "\\$&"));
    			} catch(e) {
    				
    			}

    			return (d && d.length && (d = d.closest(".jstree")).length && (d = d.data("jstree"))
    			? c = d
    			: a(".jstree").each(function () {
    					var d = a(this).data("jstree");
    					return d && d._model.data[b] ? (c = d, !1) : void 0;
    				}), c);
    		}, a.fn.jstree = function (c) {
    			var d = "string" == typeof c,
    				e = Array.prototype.slice.call(arguments, 1),
    				f = null;

    			return c !== !0 || this.length
    			? (this.each(function () {
    					var g = a.jstree.reference(this), h = d && g ? g[c] : null;
    					return (f = d && h ? h.apply(g, e) : null, g || d || c !== b && !a.isPlainObject(c) || a.jstree.create(this, c), (g && !d || c === !0) && (f = g || !1), null !== f && f !== b ? !1 : void 0);
    				}), null !== f && f !== b ? f : this)
    			: !1;
    		}, a.expr[":"].jstree = a.expr.createPseudo(function (c) {
    			return function (c) {
    				return a(c).hasClass("jstree") && a(c).data("jstree") !== b;
    			};
    		}), a.jstree.defaults.core = {
    			data: !1,
    			strings: !1,
    			check_callback: !1,
    			error: a.noop,
    			animation: 200,
    			multiple: !0,
    			themes: {
    				name: !1,
    				url: !1,
    				dir: !1,
    				dots: !0,
    				icons: !0,
    				stripes: !1,
    				variant: !1,
    				responsive: !1
    			},
    			expand_selected_onload: !0,
    			worker: !0,
    			force_text: !1,
    			dblclick_toggle: !0
    		}, a.jstree.core.prototype = {
    			plugin(b, c) {
    				var d = a.jstree.plugins[b];

    				return d
    				? (this._data[b] = {}, d.prototype = this, new d(c, this))
    				: this;
    			},
    			init(b, c) {
    				(this._model = {
    					data: {},
    					changed: [],
    					force_full_redraw: !1,
    					redraw_timeout: !1,
    					default_state: {
    						loaded: !0,
    						opened: !1,
    						selected: !1,
    						disabled: !1
    					}
    				}, this._model.data[a.jstree.root] = {
    					id: a.jstree.root,
    					parent: null,
    					parents: [],
    					children: [],
    					children_d: [],
    					state: { loaded: !1 }
    				}, this.element = a(b).addClass("jstree jstree-" + this._id), this.settings = c, this._data.core.ready = !1, this._data.core.loaded = !1, this._data.core.rtl = "rtl" === this.element.css("direction"), this.element[this._data.core.rtl ? "addClass" : "removeClass"]("jstree-rtl"), this.element.attr("role", "tree"), this.settings.core.multiple && this.element.attr("aria-multiselectable", !0), this.element.attr("tabindex") || this.element.attr("tabindex", "0"), this.bind(), this.trigger("init"), this._data.core.original_container_html = this.element.find(" > ul > li").clone(!0), this._data.core.original_container_html.find("li").addBack().contents().filter(function () {
    					return 3 === this.nodeType && (!this.nodeValue || (/^\s+$/).test(this.nodeValue));
    				}).remove(), this.element.html("<ul class='jstree-container-ul jstree-children' role='group'><li id='j" + this._id + "_loading' class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='tree-item'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this.element.attr("aria-activedescendant", "j" + this._id + "_loading"), this._data.core.li_height = this.get_container_ul().children("li").first().height() || 24, this.trigger("loading"), this.load_node(a.jstree.root));
    			},
    			destroy(a) {
    				if (this._wrk) try {
    					(window.URL.revokeObjectURL(this._wrk), this._wrk = null);
    				} catch(b) {
    					
    				}

    				(a || this.element.empty(), this.teardown());
    			},
    			teardown() {
    				(this.unbind(), this.element.removeClass("jstree").removeData("jstree").find("[class^='jstree']").addBack().attr("class", function () {
    					return this.className.replace(/jstree[^ ]*|$/gi, "");
    				}), this.element = null);
    			},
    			bind() {
    				var b = "", c = null, d = 0;

    				this.element.on("dblclick.jstree", function (a) {
    					if (a.target.tagName && "input" === a.target.tagName.toLowerCase()) return !0;

    					if (i.selection && i.selection.empty) i.selection.empty(); else if (window.getSelection) {
    						var b = window.getSelection();

    						try {
    							(b.removeAllRanges(), b.collapse());
    						} catch(c) {
    							
    						}
    					}
    				}).on("mousedown.jstree", a.proxy(
    					function (a) {
    						a.target === this.element[0] && (a.preventDefault(), d = +new Date());
    					},
    					this
    				)).on("mousedown.jstree", ".jstree-ocl", function (a) {
    					a.preventDefault();
    				}).on("click.jstree", ".jstree-ocl", a.proxy(
    					function (a) {
    						this.toggle_node(a.target);
    					},
    					this
    				)).on("dblclick.jstree", ".jstree-anchor", a.proxy(
    					function (a) {
    						return a.target.tagName && "input" === a.target.tagName.toLowerCase()
    						? !0
    						: void (this.settings.core.dblclick_toggle && this.toggle_node(a.target));
    					},
    					this
    				)).on("click.jstree", ".jstree-anchor", a.proxy(
    					function (b) {
    						(b.preventDefault(), b.currentTarget !== i.activeElement && a(b.currentTarget).focus(), this.activate_node(b.currentTarget, b));
    					},
    					this
    				)).on("keydown.jstree", ".jstree-anchor", a.proxy(
    					function (b) {
    						if (b.target.tagName && "input" === b.target.tagName.toLowerCase()) return !0;
    						if (32 !== b.which && 13 !== b.which && (b.shiftKey || b.ctrlKey || b.altKey || b.metaKey)) return !0;
    						var c = null;

    						switch ((this._data.core.rtl && (37 === b.which
    						? b.which = 39
    						: 39 === b.which && (b.which = 37)), b.which)) {
    							case 32:
    								b.ctrlKey && (b.type = "click", a(b.currentTarget).trigger(b));
    								break;
    							case 13:
    								(b.type = "click", a(b.currentTarget).trigger(b));
    								break;
    							case 37:
    								(b.preventDefault(), this.is_open(b.currentTarget)
    								? this.close_node(b.currentTarget)
    								: (c = this.get_parent(b.currentTarget), c && c.id !== a.jstree.root && this.get_node(c, !0).children(".jstree-anchor").focus()));
    								break;
    							case 38:
    								(b.preventDefault(), c = this.get_prev_dom(b.currentTarget), c && c.length && c.children(".jstree-anchor").focus());
    								break;
    							case 39:
    								(b.preventDefault(), this.is_closed(b.currentTarget)
    								? this.open_node(b.currentTarget, function (a) {
    										this.get_node(a, !0).children(".jstree-anchor").focus();
    									})
    								: this.is_open(b.currentTarget) && (c = this.get_node(b.currentTarget, !0).children(".jstree-children")[0], c && a(this._firstChild(c)).children(".jstree-anchor").focus()));
    								break;
    							case 40:
    								(b.preventDefault(), c = this.get_next_dom(b.currentTarget), c && c.length && c.children(".jstree-anchor").focus());
    								break;
    							case 106:
    								this.open_all();
    								break;
    							case 36:
    								(b.preventDefault(), c = this._firstChild(this.get_container_ul()[0]), c && a(c).children(".jstree-anchor").filter(":visible").focus());
    								break;
    							case 35:
    								(b.preventDefault(), this.element.find(".jstree-anchor").filter(":visible").last().focus());
    						}
    					},
    					this
    				)).on("load_node.jstree", a.proxy(
    					function (b, c) {
    						c.status && (c.node.id !== a.jstree.root || this._data.core.loaded || (this._data.core.loaded = !0, this._firstChild(this.get_container_ul()[0]) && this.element.attr("aria-activedescendant", this._firstChild(this.get_container_ul()[0]).id), this.trigger("loaded")), this._data.core.ready || setTimeout(
    							a.proxy(
    								function () {
    									if (this.element && !this.get_container_ul().find(".jstree-loading").length) {
    										if ((this._data.core.ready = !0, this._data.core.selected.length)) {
    											if (this.settings.core.expand_selected_onload) {
    												var b = [], c, d;
    												for ((c = 0, d = this._data.core.selected.length); d > c; c++) b = b.concat(this._model.data[this._data.core.selected[c]].parents);
    												for ((b = a.vakata.array_unique(b), c = 0, d = b.length); d > c; c++) this.open_node(b[c], !1, 0);
    											}

    											this.trigger("changed", {
    												action: "ready",
    												selected: this._data.core.selected
    											});
    										}

    										this.trigger("ready");
    									}
    								},
    								this
    							),
    							0
    						));
    					},
    					this
    				)).on("keypress.jstree", a.proxy(
    					function (d) {
    						if (d.target.tagName && "input" === d.target.tagName.toLowerCase()) return !0;

    						(c && clearTimeout(c), c = setTimeout(
    							function () {
    								b = "";
    							},
    							500
    						));

    						var e = String.fromCharCode(d.which).toLowerCase(),
    							f = this.element.find(".jstree-anchor").filter(":visible"),
    							g = f.index(i.activeElement) || 0,
    							h = !1;

    						if ((b += e, b.length > 1)) {
    							if ((f.slice(g).each(a.proxy(
    								function (c, d) {
    									return 0 === a(d).text().toLowerCase().indexOf(b)
    									? (a(d).focus(), h = !0, !1)
    									: void 0;
    								},
    								this
    							)), h)) return;

    							if ((f.slice(0, g).each(a.proxy(
    								function (c, d) {
    									return 0 === a(d).text().toLowerCase().indexOf(b)
    									? (a(d).focus(), h = !0, !1)
    									: void 0;
    								},
    								this
    							)), h)) return;
    						}

    						if (new RegExp("^" + e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "+$").test(b)) {
    							if ((f.slice(g + 1).each(a.proxy(
    								function (b, c) {
    									return a(c).text().toLowerCase().charAt(0) === e
    									? (a(c).focus(), h = !0, !1)
    									: void 0;
    								},
    								this
    							)), h)) return;

    							if ((f.slice(0, g + 1).each(a.proxy(
    								function (b, c) {
    									return a(c).text().toLowerCase().charAt(0) === e
    									? (a(c).focus(), h = !0, !1)
    									: void 0;
    								},
    								this
    							)), h)) return;
    						}
    					},
    					this
    				)).on("init.jstree", a.proxy(
    					function () {
    						var a = this.settings.core.themes;
    						(this._data.core.themes.dots = a.dots, this._data.core.themes.stripes = a.stripes, this._data.core.themes.icons = a.icons, this.set_theme(a.name || "default", a.url), this.set_theme_variant(a.variant));
    					},
    					this
    				)).on("loading.jstree", a.proxy(
    					function () {
    						(this[this._data.core.themes.dots ? "show_dots" : "hide_dots"](), this[this._data.core.themes.icons
    						? "show_icons"
    						: "hide_icons"](), this[this._data.core.themes.stripes
    						? "show_stripes"
    						: "hide_stripes"]());
    					},
    					this
    				)).on("blur.jstree", ".jstree-anchor", a.proxy(
    					function (b) {
    						(this._data.core.focused = null, a(b.currentTarget).filter(".jstree-hovered").mouseleave(), this.element.attr("tabindex", "0"));
    					},
    					this
    				)).on("focus.jstree", ".jstree-anchor", a.proxy(
    					function (b) {
    						var c = this.get_node(b.currentTarget);
    						(c && c.id && (this._data.core.focused = c.id), this.element.find(".jstree-hovered").not(b.currentTarget).mouseleave(), a(b.currentTarget).mouseenter(), this.element.attr("tabindex", "-1"));
    					},
    					this
    				)).on("focus.jstree", a.proxy(
    					function () {
    						if (+new Date() - d > 500 && !this._data.core.focused) {
    							d = 0;
    							var a = this.get_node(this.element.attr("aria-activedescendant"), !0);
    							a && a.find("> .jstree-anchor").focus();
    						}
    					},
    					this
    				)).on("mouseenter.jstree", ".jstree-anchor", a.proxy(
    					function (a) {
    						this.hover_node(a.currentTarget);
    					},
    					this
    				)).on("mouseleave.jstree", ".jstree-anchor", a.proxy(
    					function (a) {
    						this.dehover_node(a.currentTarget);
    					},
    					this
    				));
    			},
    			unbind() {
    				(this.element.off(".jstree"), a(i).off(".jstree-" + this._id));
    			},
    			trigger(a, b) {
    				(b || (b = {}), b.instance = this, this.element.triggerHandler(a.replace(".jstree", "") + ".jstree", b));
    			},
    			get_container() {
    				return this.element;
    			},
    			get_container_ul() {
    				return this.element.children(".jstree-children").first();
    			},
    			get_string(b) {
    				var c = this.settings.core.strings;
    				return a.isFunction(c) ? c.call(this, b) : c && c[b] ? c[b] : b;
    			},
    			_firstChild(a) {
    				a = a ? a.firstChild : null;
    				while (null !== a && 1 !== a.nodeType) a = a.nextSibling;
    				return a;
    			},
    			_nextSibling(a) {
    				a = a ? a.nextSibling : null;
    				while (null !== a && 1 !== a.nodeType) a = a.nextSibling;
    				return a;
    			},
    			_previousSibling(a) {
    				a = a ? a.previousSibling : null;
    				while (null !== a && 1 !== a.nodeType) a = a.previousSibling;
    				return a;
    			},
    			get_node(b, c) {
    				b && b.id && (b = b.id);
    				var d;

    				try {
    					if (this._model.data[b]) b = this._model.data[b]; else if ("string" == typeof b && this._model.data[b.replace(/^#/, "")]) b = this._model.data[b.replace(/^#/, "")]; else if ("string" == typeof b && (d = a("#" + b.replace(a.jstree.idregex, "\\$&"), this.element)).length && this._model.data[d.closest(".jstree-node").attr("id")]) b = this._model.data[d.closest(".jstree-node").attr("id")]; else if ((d = a(b, this.element)).length && this._model.data[d.closest(".jstree-node").attr("id")]) b = this._model.data[d.closest(".jstree-node").attr("id")]; else {
    						if (!(d = a(b, this.element)).length || !d.hasClass("jstree")) return !1;
    						b = this._model.data[a.jstree.root];
    					}

    					return (c && (b = b.id === a.jstree.root
    					? this.element
    					: a("#" + b.id.replace(a.jstree.idregex, "\\$&"), this.element)), b);
    				} catch(e) {
    					return !1;
    				}
    			},
    			get_path(b, c, d) {
    				if ((b = b.parents ? b : this.get_node(b), !b || b.id === a.jstree.root || !b.parents)) return !1;
    				var e, f, g = [];
    				for ((g.push(d ? b.id : b.text), e = 0, f = b.parents.length); f > e; e++) g.push(d ? b.parents[e] : this.get_text(b.parents[e]));
    				return (g = g.reverse().slice(1), c ? g.join(c) : g);
    			},
    			get_next_dom(b, c) {
    				var d;

    				if ((b = this.get_node(b, !0), b[0] === this.element[0])) {
    					d = this._firstChild(this.get_container_ul()[0]);
    					while (d && 0 === d.offsetHeight) d = this._nextSibling(d);
    					return d ? a(d) : !1;
    				}

    				if (!b || !b.length) return !1;

    				if (c) {
    					d = b[0];
    					do d = this._nextSibling(d); while (d && 0 === d.offsetHeight);
    					return d ? a(d) : !1;
    				}

    				if (b.hasClass("jstree-open")) {
    					d = this._firstChild(b.children(".jstree-children")[0]);
    					while (d && 0 === d.offsetHeight) d = this._nextSibling(d);
    					if (null !== d) return a(d);
    				}

    				d = b[0];
    				do d = this._nextSibling(d); while (d && 0 === d.offsetHeight);

    				return null !== d
    				? a(d)
    				: b.parentsUntil(".jstree", ".jstree-node").nextAll(".jstree-node:visible").first();
    			},
    			get_prev_dom(b, c) {
    				var d;

    				if ((b = this.get_node(b, !0), b[0] === this.element[0])) {
    					d = this.get_container_ul()[0].lastChild;
    					while (d && 0 === d.offsetHeight) d = this._previousSibling(d);
    					return d ? a(d) : !1;
    				}

    				if (!b || !b.length) return !1;

    				if (c) {
    					d = b[0];
    					do d = this._previousSibling(d); while (d && 0 === d.offsetHeight);
    					return d ? a(d) : !1;
    				}

    				d = b[0];
    				do d = this._previousSibling(d); while (d && 0 === d.offsetHeight);

    				if (null !== d) {
    					b = a(d);
    					while (b.hasClass("jstree-open")) b = b.children(".jstree-children").first().children(".jstree-node:visible:last");
    					return b;
    				}

    				return (d = b[0].parentNode.parentNode, d && d.className && -1 !== d.className.indexOf("jstree-node")
    				? a(d)
    				: !1);
    			},
    			get_parent(b) {
    				return (b = this.get_node(b), b && b.id !== a.jstree.root ? b.parent : !1);
    			},
    			get_children_dom(a) {
    				return (a = this.get_node(a, !0), a[0] === this.element[0]
    				? this.get_container_ul().children(".jstree-node")
    				: a && a.length
    					? a.children(".jstree-children").children(".jstree-node")
    					: !1);
    			},
    			is_parent(a) {
    				return (a = this.get_node(a), a && (a.state.loaded === !1 || a.children.length > 0));
    			},
    			is_loaded(a) {
    				return (a = this.get_node(a), a && a.state.loaded);
    			},
    			is_loading(a) {
    				return (a = this.get_node(a), a && a.state && a.state.loading);
    			},
    			is_open(a) {
    				return (a = this.get_node(a), a && a.state.opened);
    			},
    			is_closed(a) {
    				return (a = this.get_node(a), a && this.is_parent(a) && !a.state.opened);
    			},
    			is_leaf(a) {
    				return !this.is_parent(a);
    			},
    			load_node(b, c) {
    				var d, e, f, g, h;
    				if (a.isArray(b)) return (this._load_nodes(b.slice(), c), !0);
    				if ((b = this.get_node(b), !b)) return (c && c.call(this, b, !1), !1);

    				if (b.state.loaded) {
    					for ((b.state.loaded = !1, d = 0, e = b.children_d.length); e > d; d++) {
    						for ((f = 0, g = b.parents.length); g > f; f++) this._model.data[b.parents[f]].children_d = a.vakata.array_remove_item(this._model.data[b.parents[f]].children_d, b.children_d[d]);
    						(this._model.data[b.children_d[d]].state.selected && (h = !0, this._data.core.selected = a.vakata.array_remove_item(this._data.core.selected, b.children_d[d])), delete this._model.data[b.children_d[d]]);
    					}

    					(b.children = [], b.children_d = [], h && this.trigger("changed", {
    						action: "load_node",
    						node: b,
    						selected: this._data.core.selected
    					}));
    				}

    				return (b.state.failed = !1, b.state.loading = !0, this.get_node(b, !0).addClass("jstree-loading").attr("aria-busy", !0), this._load_node(b, a.proxy(
    					function (a) {
    						(b = this._model.data[b.id], b.state.loading = !1, b.state.loaded = a, b.state.failed = !b.state.loaded);
    						var d = this.get_node(b, !0), e = 0, f = 0, g = this._model.data, h = !1;

    						for ((e = 0, f = b.children.length); f > e; e++) if (g[b.children[e]] && !g[b.children[e]].state.hidden) {
    							h = !0;
    							break;
    						}

    						(b.state.loaded && !h && d && d.length && !d.hasClass("jstree-leaf") && d.removeClass("jstree-closed jstree-open").addClass("jstree-leaf"), d.removeClass("jstree-loading").attr("aria-busy", !1), this.trigger("load_node", { node: b, status: a }), c && c.call(this, b, a));
    					},
    					this
    				)), !0);
    			},
    			_load_nodes(a, b, c) {
    				var d = !0,
    					e = function () {
    						this._load_nodes(a, b, !0);
    					},
    					f = this._model.data,
    					g,
    					h,
    					i = [];

    				for ((g = 0, h = a.length); h > g; g++) !f[a[g]] || (f[a[g]].state.loaded || f[a[g]].state.failed) && c || (this.is_loading(a[g]) || this.load_node(a[g], e), d = !1);

    				if (d) {
    					for ((g = 0, h = a.length); h > g; g++) f[a[g]] && f[a[g]].state.loaded && i.push(a[g]);
    					b && !b.done && (b.call(this, i), b.done = !0);
    				}
    			},
    			load_all(b, c) {
    				if ((b || (b = a.jstree.root), b = this.get_node(b), !b)) return !1;
    				var d = [], e = this._model.data, f = e[b.id].children_d, g, h;
    				for ((b.state && !b.state.loaded && d.push(b.id), g = 0, h = f.length); h > g; g++) e[f[g]] && e[f[g]].state && !e[f[g]].state.loaded && d.push(f[g]);

    				d.length
    				? this._load_nodes(d, function () {
    						this.load_all(b, c);
    					})
    				: (c && c.call(this, b), this.trigger("load_all", { node: b }));
    			},
    			_load_node(b, c) {
    				var d = this.settings.core.data, e;

    				return d
    				? a.isFunction(d)
    					? d.call(this, b, a.proxy(
    							function (d) {
    								(d === !1 && c.call(this, !1), this["string" == typeof d
    								? "_append_html_data"
    								: "_append_json_data"](
    									b,
    									"string" == typeof d
    									? a(a.parseHTML(d)).filter(function () {
    											return 3 !== this.nodeType;
    										})
    									: d,
    									function (a) {
    										c.call(this, a);
    									}
    								));
    							},
    							this
    						))
    					: "object" == typeof d
    						? d.url
    							? (d = a.extend(!0, {}, d), a.isFunction(d.url) && (d.url = d.url.call(this, b)), a.isFunction(d.data) && (d.data = d.data.call(this, b)), a.ajax(d).done(a.proxy(
    									function (d, e, f) {
    										var g = f.getResponseHeader("Content-Type");

    										return g && -1 !== g.indexOf("json") || "object" == typeof d
    										? this._append_json_data(b, d, function (a) {
    												c.call(this, a);
    											})
    										: g && -1 !== g.indexOf("html") || "string" == typeof d
    											? this._append_html_data(
    													b,
    													a(a.parseHTML(d)).filter(function () {
    														return 3 !== this.nodeType;
    													}),
    													function (a) {
    														c.call(this, a);
    													}
    												)
    											: (this._data.core.last_error = {
    													error: "ajax",
    													plugin: "core",
    													id: "core_04",
    													reason: "Could not load node",
    													data: JSON.stringify({ id: b.id, xhr: f })
    												}, this.settings.core.error.call(this, this._data.core.last_error), c.call(this, !1));
    									},
    									this
    								)).fail(a.proxy(
    									function (a) {
    										(c.call(this, !1), this._data.core.last_error = {
    											error: "ajax",
    											plugin: "core",
    											id: "core_04",
    											reason: "Could not load node",
    											data: JSON.stringify({ id: b.id, xhr: a })
    										}, this.settings.core.error.call(this, this._data.core.last_error));
    									},
    									this
    								)))
    							: (e = a.isArray(d) || a.isPlainObject(d)
    								? JSON.parse(JSON.stringify(d))
    								: d, b.id === a.jstree.root
    								? this._append_json_data(b, e, function (a) {
    										c.call(this, a);
    									})
    								: (this._data.core.last_error = {
    										error: "nodata",
    										plugin: "core",
    										id: "core_05",
    										reason: "Could not load node",
    										data: JSON.stringify({ id: b.id })
    									}, this.settings.core.error.call(this, this._data.core.last_error), c.call(this, !1)))
    						: "string" == typeof d
    							? b.id === a.jstree.root
    								? this._append_html_data(
    										b,
    										a(a.parseHTML(d)).filter(function () {
    											return 3 !== this.nodeType;
    										}),
    										function (a) {
    											c.call(this, a);
    										}
    									)
    								: (this._data.core.last_error = {
    										error: "nodata",
    										plugin: "core",
    										id: "core_06",
    										reason: "Could not load node",
    										data: JSON.stringify({ id: b.id })
    									}, this.settings.core.error.call(this, this._data.core.last_error), c.call(this, !1))
    							: c.call(this, !1)
    				: b.id === a.jstree.root
    					? this._append_html_data(b, this._data.core.original_container_html.clone(!0), function (a) {
    							c.call(this, a);
    						})
    					: c.call(this, !1);
    			},
    			_node_changed(a) {
    				(a = this.get_node(a), a && this._model.changed.push(a.id));
    			},
    			_append_html_data(b, c, d) {
    				(b = this.get_node(b), b.children = [], b.children_d = []);

    				var e = c.is("ul") ? c.children() : c,
    					f = b.id,
    					g = [],
    					h = [],
    					i = this._model.data,
    					j = i[f],
    					k = this._data.core.selected.length,
    					l,
    					m,
    					n;

    				for ((e.each(a.proxy(
    					function (b, c) {
    						(l = this._parse_model_from_html(a(c), f, j.parents.concat()), l && (g.push(l), h.push(l), i[l].children_d.length && (h = h.concat(i[l].children_d))));
    					},
    					this
    				)), j.children = g, j.children_d = h, m = 0, n = j.parents.length); n > m; m++) i[j.parents[m]].children_d = i[j.parents[m]].children_d.concat(h);

    				(this.trigger("model", { nodes: h, parent: f }), f !== a.jstree.root
    				? (this._node_changed(f), this.redraw())
    				: (this.get_container_ul().children(".jstree-initial-node").remove(), this.redraw(!0)), this._data.core.selected.length !== k && this.trigger("changed", {
    					action: "model",
    					selected: this._data.core.selected
    				}), d.call(this, !0));
    			},
    			_append_json_data(b, c, d, e) {
    				if (null !== this.element) {
    					(b = this.get_node(b), b.children = [], b.children_d = [], c.d && (c = c.d, "string" == typeof c && (c = JSON.parse(c))), a.isArray(c) || (c = [c]));

    					var f = null,
    						g = {
    							df: this._model.default_state,
    							dat: c,
    							par: b.id,
    							m: this._model.data,
    							t_id: this._id,
    							t_cnt: this._cnt,
    							sel: this._data.core.selected
    						},
    						h = function (a, b) {
    							a.data && (a = a.data);

    							var c = a.dat,
    								d = a.par,
    								e = [],
    								f = [],
    								g = [],
    								h = a.df,
    								i = a.t_id,
    								j = a.t_cnt,
    								k = a.m,
    								l = k[d],
    								m = a.sel,
    								n,
    								o,
    								p,
    								q,
    								r = function (a, c, d) {
    									(d = d ? d.concat() : [], c && d.unshift(c));

    									var e = a.id.toString(),
    										f,
    										i,
    										j,
    										l,
    										m = {
    											id: e,
    											text: a.text || "",
    											icon: a.icon !== b ? a.icon : !0,
    											parent: c,
    											parents: d,
    											children: a.children || [],
    											children_d: a.children_d || [],
    											data: a.data,
    											state: {},
    											li_attr: { id: !1 },
    											a_attr: { href: "#" },
    											original: !1
    										};

    									for (f in h) h.hasOwnProperty(f) && (m.state[f] = h[f]);
    									if ((a && a.data && a.data.jstree && a.data.jstree.icon && (m.icon = a.data.jstree.icon), (m.icon === b || null === m.icon || "" === m.icon) && (m.icon = !0), a && a.data && (m.data = a.data, a.data.jstree))) for (f in a.data.jstree) a.data.jstree.hasOwnProperty(f) && (m.state[f] = a.data.jstree[f]);
    									if (a && "object" == typeof a.state) for (f in a.state) a.state.hasOwnProperty(f) && (m.state[f] = a.state[f]);
    									if (a && "object" == typeof a.li_attr) for (f in a.li_attr) a.li_attr.hasOwnProperty(f) && (m.li_attr[f] = a.li_attr[f]);
    									if ((m.li_attr.id || (m.li_attr.id = e), a && "object" == typeof a.a_attr)) for (f in a.a_attr) a.a_attr.hasOwnProperty(f) && (m.a_attr[f] = a.a_attr[f]);
    									for ((a && a.children && a.children === !0 && (m.state.loaded = !1, m.children = [], m.children_d = []), k[m.id] = m, f = 0, i = m.children.length); i > f; f++) (j = r(k[m.children[f]], m.id, d), l = k[j], m.children_d.push(j), l.children_d.length && (m.children_d = m.children_d.concat(l.children_d)));
    									return (delete a.data, delete a.children, k[m.id].original = a, m.state.selected && g.push(m.id), m.id);
    								},
    								s = function (a, c, d) {
    									(d = d ? d.concat() : [], c && d.unshift(c));
    									var e = !1, f, l, m, n, o;
    									do e = "j" + i + "_" + ++j; while (k[e]);

    									o = {
    										id: !1,
    										text: "string" == typeof a ? a : "",
    										icon: "object" == typeof a && a.icon !== b ? a.icon : !0,
    										parent: c,
    										parents: d,
    										children: [],
    										children_d: [],
    										data: null,
    										state: {},
    										li_attr: { id: !1 },
    										a_attr: { href: "#" },
    										original: !1
    									};

    									for (f in h) h.hasOwnProperty(f) && (o.state[f] = h[f]);
    									if ((a && a.id && (o.id = a.id.toString()), a && a.text && (o.text = a.text), a && a.data && a.data.jstree && a.data.jstree.icon && (o.icon = a.data.jstree.icon), (o.icon === b || null === o.icon || "" === o.icon) && (o.icon = !0), a && a.data && (o.data = a.data, a.data.jstree))) for (f in a.data.jstree) a.data.jstree.hasOwnProperty(f) && (o.state[f] = a.data.jstree[f]);
    									if (a && "object" == typeof a.state) for (f in a.state) a.state.hasOwnProperty(f) && (o.state[f] = a.state[f]);
    									if (a && "object" == typeof a.li_attr) for (f in a.li_attr) a.li_attr.hasOwnProperty(f) && (o.li_attr[f] = a.li_attr[f]);
    									if ((o.li_attr.id && !o.id && (o.id = o.li_attr.id.toString()), o.id || (o.id = e), o.li_attr.id || (o.li_attr.id = o.id), a && "object" == typeof a.a_attr)) for (f in a.a_attr) a.a_attr.hasOwnProperty(f) && (o.a_attr[f] = a.a_attr[f]);

    									if (a && a.children && a.children.length) {
    										for ((f = 0, l = a.children.length); l > f; f++) (m = s(a.children[f], o.id, d), n = k[m], o.children.push(m), n.children_d.length && (o.children_d = o.children_d.concat(n.children_d)));
    										o.children_d = o.children_d.concat(o.children);
    									}

    									return (a && a.children && a.children === !0 && (o.state.loaded = !1, o.children = [], o.children_d = []), delete a.data, delete a.children, o.original = a, k[o.id] = o, o.state.selected && g.push(o.id), o.id);
    								};

    							if (c.length && c[0].id !== b && c[0].parent !== b) {
    								for ((o = 0, p = c.length); p > o; o++) (c[o].children || (c[o].children = []), k[c[o].id.toString()] = c[o]);
    								for ((o = 0, p = c.length); p > o; o++) (k[c[o].parent.toString()].children.push(c[o].id.toString()), l.children_d.push(c[o].id.toString()));
    								for ((o = 0, p = l.children.length); p > o; o++) (n = r(k[l.children[o]], d, l.parents.concat()), f.push(n), k[n].children_d.length && (f = f.concat(k[n].children_d)));
    								for ((o = 0, p = l.parents.length); p > o; o++) k[l.parents[o]].children_d = k[l.parents[o]].children_d.concat(f);

    								q = {
    									cnt: j,
    									mod: k,
    									sel: m,
    									par: d,
    									dpc: f,
    									add: g
    								};
    							} else {
    								for ((o = 0, p = c.length); p > o; o++) (n = s(c[o], d, l.parents.concat()), n && (e.push(n), f.push(n), k[n].children_d.length && (f = f.concat(k[n].children_d))));
    								for ((l.children = e, l.children_d = f, o = 0, p = l.parents.length); p > o; o++) k[l.parents[o]].children_d = k[l.parents[o]].children_d.concat(f);

    								q = {
    									cnt: j,
    									mod: k,
    									sel: m,
    									par: d,
    									dpc: f,
    									add: g
    								};
    							}

    							return "undefined" != typeof window && "undefined" != typeof window.document
    							? q
    							: void postMessage(q);
    						},
    						i = function (b, c) {
    							if (null !== this.element) {
    								if ((this._cnt = b.cnt, this._model.data = b.mod, c)) {
    									var e,
    										f,
    										g = b.add,
    										h = b.sel,
    										i = this._data.core.selected.slice(),
    										j = this._model.data;

    									if (h.length !== i.length || a.vakata.array_unique(h.concat(i)).length !== h.length) {
    										for ((e = 0, f = h.length); f > e; e++) -1 === a.inArray(h[e], g) && -1 === a.inArray(h[e], i) && (j[h[e]].state.selected = !1);
    										for ((e = 0, f = i.length); f > e; e++) -1 === a.inArray(i[e], h) && (j[i[e]].state.selected = !0);
    									}
    								}

    								(b.add.length && (this._data.core.selected = this._data.core.selected.concat(b.add)), this.trigger("model", { nodes: b.dpc, parent: b.par }), b.par !== a.jstree.root
    								? (this._node_changed(b.par), this.redraw())
    								: this.redraw(!0), b.add.length && this.trigger("changed", {
    									action: "model",
    									selected: this._data.core.selected
    								}), d.call(this, !0));
    							}
    						};

    					if (this.settings.core.worker && window.Blob && window.URL && window.Worker) try {
    						(null === this._wrk && (this._wrk = window.URL.createObjectURL(new window.Blob(["self.onmessage = " + h.toString()], { type: "text/javascript" }))), !this._data.core.working || e
    						? (this._data.core.working = !0, f = new window.Worker(this._wrk), f.onmessage = a.proxy(
    								function (a) {
    									i.call(this, a.data, !0);

    									try {
    										(f.terminate(), f = null);
    									} catch(b) {
    										
    									}

    									this._data.core.worker_queue.length
    									? this._append_json_data.apply(this, this._data.core.worker_queue.shift())
    									: this._data.core.working = !1;
    								},
    								this
    							), g.par
    							? f.postMessage(g)
    							: this._data.core.worker_queue.length
    								? this._append_json_data.apply(this, this._data.core.worker_queue.shift())
    								: this._data.core.working = !1)
    						: this._data.core.worker_queue.push([b, c, d, !0]));
    					} catch(j) {
    						(i.call(this, h(g), !1), this._data.core.worker_queue.length
    						? this._append_json_data.apply(this, this._data.core.worker_queue.shift())
    						: this._data.core.working = !1);
    					} else i.call(this, h(g), !1);
    				}
    			},
    			_parse_model_from_html(c, d, e) {
    				(e = e ? [].concat(e) : [], d && e.unshift(d));

    				var f,
    					g,
    					h = this._model.data,
    					i = {
    						id: !1,
    						text: !1,
    						icon: !0,
    						parent: d,
    						parents: e,
    						children: [],
    						children_d: [],
    						data: null,
    						state: {},
    						li_attr: { id: !1 },
    						a_attr: { href: "#" },
    						original: !1
    					},
    					j,
    					k,
    					l;

    				for (j in this._model.default_state) this._model.default_state.hasOwnProperty(j) && (i.state[j] = this._model.default_state[j]);

    				if ((k = a.vakata.attributes(c, !0), a.each(k, function (b, c) {
    					return (c = a.trim(c), c.length
    					? (i.li_attr[b] = c, void ("id" === b && (i.id = c.toString())))
    					: !0);
    				}), k = c.children("a").first(), k.length && (k = a.vakata.attributes(k, !0), a.each(k, function (b, c) {
    					(c = a.trim(c), c.length && (i.a_attr[b] = c));
    				})), k = c.children("a").first().length
    				? c.children("a").first().clone()
    				: c.clone(), k.children("ins, i, ul").remove(), k = k.html(), k = a("<div />").html(k), i.text = this.settings.core.force_text ? k.text() : k.html(), k = c.data(), i.data = k ? a.extend(!0, {}, k) : null, i.state.opened = c.hasClass("jstree-open"), i.state.selected = c.children("a").hasClass("jstree-clicked"), i.state.disabled = c.children("a").hasClass("jstree-disabled"), i.data && i.data.jstree)) for (j in i.data.jstree) i.data.jstree.hasOwnProperty(j) && (i.state[j] = i.data.jstree[j]);

    				(k = c.children("a").children(".jstree-themeicon"), k.length && (i.icon = k.hasClass("jstree-themeicon-hidden")
    				? !1
    				: k.attr("rel")), i.state.icon !== b && (i.icon = i.state.icon), (i.icon === b || null === i.icon || "" === i.icon) && (i.icon = !0), k = c.children("ul").children("li"));

    				do l = "j" + this._id + "_" + ++this._cnt; while (h[l]);

    				return (i.id = i.li_attr.id ? i.li_attr.id.toString() : l, k.length
    				? (k.each(a.proxy(
    						function (b, c) {
    							(f = this._parse_model_from_html(a(c), i.id, e), g = this._model.data[f], i.children.push(f), g.children_d.length && (i.children_d = i.children_d.concat(g.children_d)));
    						},
    						this
    					)), i.children_d = i.children_d.concat(i.children))
    				: c.hasClass("jstree-closed") && (i.state.loaded = !1), i.li_attr["class"] && (i.li_attr["class"] = i.li_attr["class"].replace("jstree-closed", "").replace("jstree-open", "")), i.a_attr["class"] && (i.a_attr["class"] = i.a_attr["class"].replace("jstree-clicked", "").replace("jstree-disabled", "")), h[i.id] = i, i.state.selected && this._data.core.selected.push(i.id), i.id);
    			},
    			_parse_model_from_flat_json(a, c, d) {
    				(d = d ? d.concat() : [], c && d.unshift(c));

    				var e = a.id.toString(),
    					f = this._model.data,
    					g = this._model.default_state,
    					h,
    					i,
    					j,
    					k,
    					l = {
    						id: e,
    						text: a.text || "",
    						icon: a.icon !== b ? a.icon : !0,
    						parent: c,
    						parents: d,
    						children: a.children || [],
    						children_d: a.children_d || [],
    						data: a.data,
    						state: {},
    						li_attr: { id: !1 },
    						a_attr: { href: "#" },
    						original: !1
    					};

    				for (h in g) g.hasOwnProperty(h) && (l.state[h] = g[h]);
    				if ((a && a.data && a.data.jstree && a.data.jstree.icon && (l.icon = a.data.jstree.icon), (l.icon === b || null === l.icon || "" === l.icon) && (l.icon = !0), a && a.data && (l.data = a.data, a.data.jstree))) for (h in a.data.jstree) a.data.jstree.hasOwnProperty(h) && (l.state[h] = a.data.jstree[h]);
    				if (a && "object" == typeof a.state) for (h in a.state) a.state.hasOwnProperty(h) && (l.state[h] = a.state[h]);
    				if (a && "object" == typeof a.li_attr) for (h in a.li_attr) a.li_attr.hasOwnProperty(h) && (l.li_attr[h] = a.li_attr[h]);
    				if ((l.li_attr.id || (l.li_attr.id = e), a && "object" == typeof a.a_attr)) for (h in a.a_attr) a.a_attr.hasOwnProperty(h) && (l.a_attr[h] = a.a_attr[h]);
    				for ((a && a.children && a.children === !0 && (l.state.loaded = !1, l.children = [], l.children_d = []), f[l.id] = l, h = 0, i = l.children.length); i > h; h++) (j = this._parse_model_from_flat_json(f[l.children[h]], l.id, d), k = f[j], l.children_d.push(j), k.children_d.length && (l.children_d = l.children_d.concat(k.children_d)));
    				return (delete a.data, delete a.children, f[l.id].original = a, l.state.selected && this._data.core.selected.push(l.id), l.id);
    			},
    			_parse_model_from_json(a, c, d) {
    				(d = d ? d.concat() : [], c && d.unshift(c));

    				var e = !1,
    					f,
    					g,
    					h,
    					i,
    					j = this._model.data,
    					k = this._model.default_state,
    					l;

    				do e = "j" + this._id + "_" + ++this._cnt; while (j[e]);

    				l = {
    					id: !1,
    					text: "string" == typeof a ? a : "",
    					icon: "object" == typeof a && a.icon !== b ? a.icon : !0,
    					parent: c,
    					parents: d,
    					children: [],
    					children_d: [],
    					data: null,
    					state: {},
    					li_attr: { id: !1 },
    					a_attr: { href: "#" },
    					original: !1
    				};

    				for (f in k) k.hasOwnProperty(f) && (l.state[f] = k[f]);
    				if ((a && a.id && (l.id = a.id.toString()), a && a.text && (l.text = a.text), a && a.data && a.data.jstree && a.data.jstree.icon && (l.icon = a.data.jstree.icon), (l.icon === b || null === l.icon || "" === l.icon) && (l.icon = !0), a && a.data && (l.data = a.data, a.data.jstree))) for (f in a.data.jstree) a.data.jstree.hasOwnProperty(f) && (l.state[f] = a.data.jstree[f]);
    				if (a && "object" == typeof a.state) for (f in a.state) a.state.hasOwnProperty(f) && (l.state[f] = a.state[f]);
    				if (a && "object" == typeof a.li_attr) for (f in a.li_attr) a.li_attr.hasOwnProperty(f) && (l.li_attr[f] = a.li_attr[f]);
    				if ((l.li_attr.id && !l.id && (l.id = l.li_attr.id.toString()), l.id || (l.id = e), l.li_attr.id || (l.li_attr.id = l.id), a && "object" == typeof a.a_attr)) for (f in a.a_attr) a.a_attr.hasOwnProperty(f) && (l.a_attr[f] = a.a_attr[f]);

    				if (a && a.children && a.children.length) {
    					for ((f = 0, g = a.children.length); g > f; f++) (h = this._parse_model_from_json(a.children[f], l.id, d), i = j[h], l.children.push(h), i.children_d.length && (l.children_d = l.children_d.concat(i.children_d)));
    					l.children_d = l.children_d.concat(l.children);
    				}

    				return (a && a.children && a.children === !0 && (l.state.loaded = !1, l.children = [], l.children_d = []), delete a.data, delete a.children, l.original = a, j[l.id] = l, l.state.selected && this._data.core.selected.push(l.id), l.id);
    			},
    			_redraw() {
    				var b = this._model.force_full_redraw
    					? this._model.data[a.jstree.root].children.concat([])
    					: this._model.changed.concat([]),
    					c = i.createElement("UL"),
    					d,
    					e,
    					f,
    					g = this._data.core.focused;

    				for ((e = 0, f = b.length); f > e; e++) (d = this.redraw_node(b[e], !0, this._model.force_full_redraw), d && this._model.force_full_redraw && c.appendChild(d));

    				(this._model.force_full_redraw && (c.className = this.get_container_ul()[0].className, c.setAttribute("role", "group"), this.element.empty().append(c)), null !== g && (d = this.get_node(g, !0), d && d.length && d.children(".jstree-anchor")[0] !== i.activeElement
    				? d.children(".jstree-anchor").focus()
    				: this._data.core.focused = null), this._model.force_full_redraw = !1, this._model.changed = [], this.trigger("redraw", { nodes: b }));
    			},
    			redraw(a) {
    				(a && (this._model.force_full_redraw = !0), this._redraw());
    			},
    			draw_children(b) {
    				var c = this.get_node(b), d = !1, e = !1, f = !1, g = i;
    				if (!c) return !1;
    				if (c.id === a.jstree.root) return this.redraw(!0);
    				if ((b = this.get_node(b, !0), !b || !b.length)) return !1;

    				if ((b.children(".jstree-children").remove(), b = b[0], c.children.length && c.state.loaded)) {
    					for ((f = g.createElement("UL"), f.setAttribute("role", "group"), f.className = "jstree-children", d = 0, e = c.children.length); e > d; d++) f.appendChild(this.redraw_node(c.children[d], !0, !0));
    					b.appendChild(f);
    				}
    			},
    			redraw_node(b, c, d, e) {
    				var f = this.get_node(b),
    					g = !1,
    					h = !1,
    					k = !1,
    					l = !1,
    					m = !1,
    					n = !1,
    					o = "",
    					p = i,
    					q = this._model.data,
    					r = !1,
    					t = null,
    					u = 0,
    					v = 0,
    					w = !1,
    					x = !1;

    				if (!f) return !1;
    				if (f.id === a.jstree.root) return this.redraw(!0);

    				if ((c = c || 0 === f.children.length, b = i.querySelector
    				? this.element[0].querySelector("#" + (-1 !== ("0123456789").indexOf(f.id[0])
    					? "\\3" + f.id[0] + " " + f.id.substr(1).replace(a.jstree.idregex, "\\$&")
    					: f.id.replace(a.jstree.idregex, "\\$&")))
    				: i.getElementById(f.id))) (b = a(b), d || (g = b.parent().parent()[0], g === this.element[0] && (g = null), h = b.index()), c || !f.children.length || b.children(".jstree-children").length || (c = !0), c || (k = b.children(".jstree-children")[0]), r = b.children(".jstree-anchor")[0] === i.activeElement, b.remove()); else if ((c = !0, !d)) {
    					if ((g = f.parent !== a.jstree.root
    					? a("#" + f.parent.replace(a.jstree.idregex, "\\$&"), this.element)[0]
    					: null, !(null === g || g && q[f.parent].state.opened))) return !1;

    					h = a.inArray(f.id, null === g
    					? q[a.jstree.root].children
    					: q[f.parent].children);
    				}

    				(b = j.cloneNode(!0), o = "jstree-node ");

    				for (l in f.li_attr) if (f.li_attr.hasOwnProperty(l)) {
    					if ("id" === l) continue;

    					"class" !== l
    					? b.setAttribute(l, f.li_attr[l])
    					: o += f.li_attr[l];
    				}

    				for ((f.a_attr.id || (f.a_attr.id = f.id + "_anchor"), b.setAttribute("aria-selected", !!f.state.selected), b.setAttribute("aria-level", f.parents.length), b.setAttribute("aria-labelledby", f.a_attr.id), f.state.disabled && b.setAttribute("aria-disabled", !0), l = 0, m = f.children.length); m > l; l++) if (!q[f.children[l]].state.hidden) {
    					w = !0;
    					break;
    				}

    				if (null !== f.parent && q[f.parent] && !f.state.hidden && (l = a.inArray(f.id, q[f.parent].children), x = f.id, -1 !== l)) for ((l++, m = q[f.parent].children.length); m > l; l++) if ((q[q[f.parent].children[l]].state.hidden || (x = q[f.parent].children[l]), x !== f.id)) break;

    				(f.state.hidden && (o += " jstree-hidden"), f.state.loaded && !w
    				? o += " jstree-leaf"
    				: (o += f.state.opened && f.state.loaded
    					? " jstree-open"
    					: " jstree-closed", b.setAttribute("aria-expanded", f.state.opened && f.state.loaded)), x === f.id && (o += " jstree-last"), b.id = f.id, b.className = o, o = (f.state.selected ? " jstree-clicked" : "") + (f.state.disabled ? " jstree-disabled" : ""));

    				for (m in f.a_attr) if (f.a_attr.hasOwnProperty(m)) {
    					if ("href" === m && "#" === f.a_attr[m]) continue;

    					"class" !== m
    					? b.childNodes[1].setAttribute(m, f.a_attr[m])
    					: o += " " + f.a_attr[m];
    				}

    				if ((o.length && (b.childNodes[1].className = "jstree-anchor " + o), (f.icon && f.icon !== !0 || f.icon === !1) && (f.icon === !1
    				? b.childNodes[1].childNodes[0].className += " jstree-themeicon-hidden"
    				: -1 === f.icon.indexOf("/") && -1 === f.icon.indexOf(".")
    					? b.childNodes[1].childNodes[0].className += " " + f.icon + " jstree-themeicon-custom"
    					: (b.childNodes[1].childNodes[0].style.backgroundImage = "url(" + f.icon + ")", b.childNodes[1].childNodes[0].style.backgroundPosition = "center center", b.childNodes[1].childNodes[0].style.backgroundSize = "auto", b.childNodes[1].childNodes[0].className += " jstree-themeicon-custom")), this.settings.core.force_text
    				? b.childNodes[1].appendChild(p.createTextNode(f.text))
    				: b.childNodes[1].innerHTML += f.text, c && f.children.length && (f.state.opened || e) && f.state.loaded)) {
    					for ((n = p.createElement("UL"), n.setAttribute("role", "group"), n.className = "jstree-children", l = 0, m = f.children.length); m > l; l++) n.appendChild(this.redraw_node(f.children[l], c, !0));
    					b.appendChild(n);
    				}

    				if ((k && b.appendChild(k), !d)) {
    					for ((g || (g = this.element[0]), l = 0, m = g.childNodes.length); m > l; l++) if (g.childNodes[l] && g.childNodes[l].className && -1 !== g.childNodes[l].className.indexOf("jstree-children")) {
    						t = g.childNodes[l];
    						break;
    					}

    					(t || (t = p.createElement("UL"), t.setAttribute("role", "group"), t.className = "jstree-children", g.appendChild(t)), g = t, h < g.childNodes.length
    					? g.insertBefore(b, g.childNodes[h])
    					: g.appendChild(b), r && (u = this.element[0].scrollTop, v = this.element[0].scrollLeft, b.childNodes[1].focus(), this.element[0].scrollTop = u, this.element[0].scrollLeft = v));
    				}

    				return (f.state.opened && !f.state.loaded && (f.state.opened = !1, setTimeout(
    					a.proxy(
    						function () {
    							this.open_node(f.id, !1, 0);
    						},
    						this
    					),
    					0
    				)), b);
    			},
    			open_node(c, d, e) {
    				var f, g, h, i;

    				if (a.isArray(c)) {
    					for ((c = c.slice(), f = 0, g = c.length); g > f; f++) this.open_node(c[f], d, e);
    					return !0;
    				}

    				return (c = this.get_node(c), c && c.id !== a.jstree.root
    				? (e = e === b ? this.settings.core.animation : e, this.is_closed(c)
    					? this.is_loaded(c)
    						? (h = this.get_node(c, !0), i = this, h.length && (e && h.children(".jstree-children").length && h.children(".jstree-children").stop(!0, !0), c.children.length && !this._firstChild(h.children(".jstree-children")[0]) && this.draw_children(c), e
    							? (this.trigger("before_open", { node: c }), h.children(".jstree-children").css("display", "none").end().removeClass("jstree-closed").addClass("jstree-open").attr("aria-expanded", !0).children(".jstree-children").stop(!0, !0).slideDown(e, function () {
    									(this.style.display = "", i.trigger("after_open", { node: c }));
    								}))
    							: (this.trigger("before_open", { node: c }), h[0].className = h[0].className.replace("jstree-closed", "jstree-open"), h[0].setAttribute("aria-expanded", !0))), c.state.opened = !0, d && d.call(this, c, !0), h.length || this.trigger("before_open", { node: c }), this.trigger("open_node", { node: c }), e && h.length || this.trigger("after_open", { node: c }), !0)
    						: this.is_loading(c)
    							? setTimeout(
    									a.proxy(
    										function () {
    											this.open_node(c, d, e);
    										},
    										this
    									),
    									500
    								)
    							: void this.load_node(c, function (a, b) {
    									return b
    									? this.open_node(a, d, e)
    									: d ? d.call(this, a, !1) : !1;
    								})
    					: (d && d.call(this, c, !1), !1))
    				: !1);
    			},
    			_open_to(b) {
    				if ((b = this.get_node(b), !b || b.id === a.jstree.root)) return !1;
    				var c, d, e = b.parents;
    				for ((c = 0, d = e.length); d > c; c += 1) c !== a.jstree.root && this.open_node(e[c], !1, 0);
    				return a("#" + b.id.replace(a.jstree.idregex, "\\$&"), this.element);
    			},
    			close_node(c, d) {
    				var e, f, g, h;

    				if (a.isArray(c)) {
    					for ((c = c.slice(), e = 0, f = c.length); f > e; e++) this.close_node(c[e], d);
    					return !0;
    				}

    				return (c = this.get_node(c), c && c.id !== a.jstree.root
    				? this.is_closed(c)
    					? !1
    					: (d = d === b ? this.settings.core.animation : d, g = this, h = this.get_node(c, !0), h.length && (d
    						? h.children(".jstree-children").attr("style", "display:block !important").end().removeClass("jstree-open").addClass("jstree-closed").attr("aria-expanded", !1).children(".jstree-children").stop(!0, !0).slideUp(d, function () {
    								(this.style.display = "", h.children(".jstree-children").remove(), g.trigger("after_close", { node: c }));
    							})
    						: (h[0].className = h[0].className.replace("jstree-open", "jstree-closed"), h.attr("aria-expanded", !1).children(".jstree-children").remove())), c.state.opened = !1, this.trigger("close_node", { node: c }), void (d && h.length || this.trigger("after_close", { node: c })))
    				: !1);
    			},
    			toggle_node(b) {
    				var c, d;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.toggle_node(b[c]);
    					return !0;
    				}

    				return this.is_closed(b)
    				? this.open_node(b)
    				: this.is_open(b) ? this.close_node(b) : void 0;
    			},
    			open_all(b, c, d) {
    				if ((b || (b = a.jstree.root), b = this.get_node(b), !b)) return !1;

    				var e = b.id === a.jstree.root
    					? this.get_container_ul()
    					: this.get_node(b, !0),
    					f,
    					g,
    					h;

    				if (!e.length) {
    					for ((f = 0, g = b.children_d.length); g > f; f++) this.is_closed(this._model.data[b.children_d[f]]) && (this._model.data[b.children_d[f]].state.opened = !0);
    					return this.trigger("open_all", { node: b });
    				}

    				(d = d || e, h = this, e = this.is_closed(b)
    				? e.find(".jstree-closed").addBack()
    				: e.find(".jstree-closed"), e.each(function () {
    					h.open_node(
    						this,
    						function (a, b) {
    							b && this.is_parent(a) && this.open_all(a, c, d);
    						},
    						c || 0
    					);
    				}), 0 === d.find(".jstree-closed").length && this.trigger("open_all", { node: this.get_node(d) }));
    			},
    			close_all(b, c) {
    				if ((b || (b = a.jstree.root), b = this.get_node(b), !b)) return !1;

    				var d = b.id === a.jstree.root
    					? this.get_container_ul()
    					: this.get_node(b, !0),
    					e = this,
    					f,
    					g;

    				for ((d.length && (d = this.is_open(b)
    				? d.find(".jstree-open").addBack()
    				: d.find(".jstree-open"), a(d.get().reverse()).each(function () {
    					e.close_node(this, c || 0);
    				})), f = 0, g = b.children_d.length); g > f; f++) this._model.data[b.children_d[f]].state.opened = !1;

    				this.trigger("close_all", { node: b });
    			},
    			is_disabled(a) {
    				return (a = this.get_node(a), a && a.state && a.state.disabled);
    			},
    			enable_node(b) {
    				var c, d;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.enable_node(b[c]);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (b.state.disabled = !1, this.get_node(b, !0).children(".jstree-anchor").removeClass("jstree-disabled").attr("aria-disabled", !1), void this.trigger("enable_node", { node: b }))
    				: !1);
    			},
    			disable_node(b) {
    				var c, d;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.disable_node(b[c]);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (b.state.disabled = !0, this.get_node(b, !0).children(".jstree-anchor").addClass("jstree-disabled").attr("aria-disabled", !0), void this.trigger("disable_node", { node: b }))
    				: !1);
    			},
    			hide_node(b, c) {
    				var d, e;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), d = 0, e = b.length); e > d; d++) this.hide_node(b[d], !0);
    					return (this.redraw(), !0);
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? void (b.state.hidden || (b.state.hidden = !0, this._node_changed(b.parent), c || this.redraw(), this.trigger("hide_node", { node: b })))
    				: !1);
    			},
    			show_node(b, c) {
    				var d, e;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), d = 0, e = b.length); e > d; d++) this.show_node(b[d], !0);
    					return (this.redraw(), !0);
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? void (b.state.hidden && (b.state.hidden = !1, this._node_changed(b.parent), c || this.redraw(), this.trigger("show_node", { node: b })))
    				: !1);
    			},
    			hide_all(b) {
    				var c, d = this._model.data, e = [];
    				for (c in d) d.hasOwnProperty(c) && c !== a.jstree.root && !d[c].state.hidden && (d[c].state.hidden = !0, e.push(c));
    				return (this._model.force_full_redraw = !0, b || this.redraw(), this.trigger("hide_all", { nodes: e }), e);
    			},
    			show_all(b) {
    				var c, d = this._model.data, e = [];
    				for (c in d) d.hasOwnProperty(c) && c !== a.jstree.root && d[c].state.hidden && (d[c].state.hidden = !1, e.push(c));
    				return (this._model.force_full_redraw = !0, b || this.redraw(), this.trigger("show_all", { nodes: e }), e);
    			},
    			activate_node(a, c) {
    				if (this.is_disabled(a)) return !1;

    				if ((c && "object" == typeof c || (c = {}), this._data.core.last_clicked = this._data.core.last_clicked && this._data.core.last_clicked.id !== b
    				? this.get_node(this._data.core.last_clicked.id)
    				: null, this._data.core.last_clicked && !this._data.core.last_clicked.state.selected && (this._data.core.last_clicked = null), !this._data.core.last_clicked && this._data.core.selected.length && (this._data.core.last_clicked = this.get_node(this._data.core.selected[this._data.core.selected.length - 1])), this.settings.core.multiple && (c.metaKey || c.ctrlKey || c.shiftKey) && (!c.shiftKey || this._data.core.last_clicked && this.get_parent(a) && this.get_parent(a) === this._data.core.last_clicked.parent))) if (c.shiftKey) {
    					var d = this.get_node(a).id,
    						e = this._data.core.last_clicked.id,
    						f = this.get_node(this._data.core.last_clicked.parent).children,
    						g = !1,
    						h,
    						i;

    					for ((h = 0, i = f.length); i > h; h += 1) (f[h] === d && (g = !g), f[h] === e && (g = !g), this.is_disabled(f[h]) || !g && f[h] !== d && f[h] !== e
    					? this.deselect_node(f[h], !0, c)
    					: this.select_node(f[h], !0, !1, c));

    					this.trigger("changed", {
    						action: "select_node",
    						node: this.get_node(a),
    						selected: this._data.core.selected,
    						event: c
    					});
    				} else this.is_selected(a)
    				? this.deselect_node(a, !1, c)
    				: this.select_node(a, !1, !1, c); else !this.settings.core.multiple && (c.metaKey || c.ctrlKey || c.shiftKey) && this.is_selected(a)
    				? this.deselect_node(a, !1, c)
    				: (this.deselect_all(!0), this.select_node(a, !1, !1, c), this._data.core.last_clicked = this.get_node(a));

    				this.trigger("activate_node", { node: this.get_node(a), event: c });
    			},
    			hover_node(a) {
    				if ((a = this.get_node(a, !0), !a || !a.length || a.children(".jstree-hovered").length)) return !1;
    				var b = this.element.find(".jstree-hovered"), c = this.element;

    				(b && b.length && this.dehover_node(b), a.children(".jstree-anchor").addClass("jstree-hovered"), this.trigger("hover_node", { node: this.get_node(a) }), setTimeout(
    					function () {
    						c.attr("aria-activedescendant", a[0].id);
    					},
    					0
    				));
    			},
    			dehover_node(a) {
    				return (a = this.get_node(a, !0), a && a.length && a.children(".jstree-hovered").length
    				? (a.children(".jstree-anchor").removeClass("jstree-hovered"), void this.trigger("dehover_node", { node: this.get_node(a) }))
    				: !1);
    			},
    			select_node(b, c, d, e) {
    				var f, g, h;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), g = 0, h = b.length); h > g; g++) this.select_node(b[g], c, d, e);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (f = this.get_node(b, !0), void (b.state.selected || (b.state.selected = !0, this._data.core.selected.push(b.id), d || (f = this._open_to(b)), f && f.length && f.attr("aria-selected", !0).children(".jstree-anchor").addClass("jstree-clicked"), this.trigger("select_node", {
    						node: b,
    						selected: this._data.core.selected,
    						event: e
    					}), c || this.trigger("changed", {
    						action: "select_node",
    						node: b,
    						selected: this._data.core.selected,
    						event: e
    					}))))
    				: !1);
    			},
    			deselect_node(b, c, d) {
    				var e, f, g;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), e = 0, f = b.length); f > e; e++) this.deselect_node(b[e], c, d);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (g = this.get_node(b, !0), void (b.state.selected && (b.state.selected = !1, this._data.core.selected = a.vakata.array_remove_item(this._data.core.selected, b.id), g.length && g.attr("aria-selected", !1).children(".jstree-anchor").removeClass("jstree-clicked"), this.trigger("deselect_node", {
    						node: b,
    						selected: this._data.core.selected,
    						event: d
    					}), c || this.trigger("changed", {
    						action: "deselect_node",
    						node: b,
    						selected: this._data.core.selected,
    						event: d
    					}))))
    				: !1);
    			},
    			select_all(b) {
    				var c = this._data.core.selected.concat([]), d, e;
    				for ((this._data.core.selected = this._model.data[a.jstree.root].children_d.concat(), d = 0, e = this._data.core.selected.length); e > d; d++) this._model.data[this._data.core.selected[d]] && (this._model.data[this._data.core.selected[d]].state.selected = !0);

    				(this.redraw(!0), this.trigger("select_all", { selected: this._data.core.selected }), b || this.trigger("changed", {
    					action: "select_all",
    					selected: this._data.core.selected,
    					old_selection: c
    				}));
    			},
    			deselect_all(a) {
    				var b = this._data.core.selected.concat([]), c, d;
    				for ((c = 0, d = this._data.core.selected.length); d > c; c++) this._model.data[this._data.core.selected[c]] && (this._model.data[this._data.core.selected[c]].state.selected = !1);

    				(this._data.core.selected = [], this.element.find(".jstree-clicked").removeClass("jstree-clicked").parent().attr("aria-selected", !1), this.trigger("deselect_all", {
    					selected: this._data.core.selected,
    					node: b
    				}), a || this.trigger("changed", {
    					action: "deselect_all",
    					selected: this._data.core.selected,
    					old_selection: b
    				}));
    			},
    			is_selected(b) {
    				return (b = this.get_node(b), b && b.id !== a.jstree.root ? b.state.selected : !1);
    			},
    			get_selected(b) {
    				return b
    				? a.map(this._data.core.selected, a.proxy(
    						function (a) {
    							return this.get_node(a);
    						},
    						this
    					))
    				: this._data.core.selected.slice();
    			},
    			get_top_selected(b) {
    				var c = this.get_selected(!0), d = {}, e, f, g, h;
    				for ((e = 0, f = c.length); f > e; e++) d[c[e].id] = c[e];
    				for ((e = 0, f = c.length); f > e; e++) for ((g = 0, h = c[e].children_d.length); h > g; g++) d[c[e].children_d[g]] && delete d[c[e].children_d[g]];
    				c = [];
    				for (e in d) d.hasOwnProperty(e) && c.push(e);

    				return b
    				? a.map(c, a.proxy(
    						function (a) {
    							return this.get_node(a);
    						},
    						this
    					))
    				: c;
    			},
    			get_bottom_selected(b) {
    				var c = this.get_selected(!0), d = [], e, f;
    				for ((e = 0, f = c.length); f > e; e++) c[e].children.length || d.push(c[e].id);

    				return b
    				? a.map(d, a.proxy(
    						function (a) {
    							return this.get_node(a);
    						},
    						this
    					))
    				: d;
    			},
    			get_state() {
    				var b = {
    						core: {
    							open: [],
    							scroll: {
    								left: this.element.scrollLeft(),
    								top: this.element.scrollTop()
    							},
    							selected: []
    						}
    					},
    					c;

    				for (c in this._model.data) this._model.data.hasOwnProperty(c) && c !== a.jstree.root && (this._model.data[c].state.opened && b.core.open.push(c), this._model.data[c].state.selected && b.core.selected.push(c));
    				return b;
    			},
    			set_state(c, d) {
    				if (c) {
    					if (c.core) {
    						var h, i;

    						if (c.core.open) return (a.isArray(c.core.open) && c.core.open.length
    						? this._load_nodes(
    								c.core.open,
    								function (a) {
    									(this.open_node(a, !1, 0), delete c.core.open, this.set_state(c, d));
    								},
    								!0
    							)
    						: (delete c.core.open, this.set_state(c, d)), !1);

    						if (c.core.scroll) return (c.core.scroll && c.core.scroll.left !== b && this.element.scrollLeft(c.core.scroll.left), c.core.scroll && c.core.scroll.top !== b && this.element.scrollTop(c.core.scroll.top), delete c.core.scroll, this.set_state(c, d), !1);

    						if (c.core.selected) return (h = this, this.deselect_all(), a.each(c.core.selected, function (a, b) {
    							h.select_node(b, !1, !0);
    						}), delete c.core.selected, this.set_state(c, d), !1);

    						for (i in c) c.hasOwnProperty(i) && "core" !== i && -1 === a.inArray(i, this.settings.plugins) && delete c[i];
    						if (a.isEmptyObject(c.core)) return (delete c.core, this.set_state(c, d), !1);
    					}

    					return a.isEmptyObject(c)
    					? (c = null, d && d.call(this), this.trigger("set_state"), !1)
    					: !0;
    				}

    				return !1;
    			},
    			refresh(b, c) {
    				(this._data.core.state = c === !0 ? {} : this.get_state(), c && a.isFunction(c) && (this._data.core.state = c.call(this, this._data.core.state)), this._cnt = 0, this._model.data = {}, this._model.data[a.jstree.root] = {
    					id: a.jstree.root,
    					parent: null,
    					parents: [],
    					children: [],
    					children_d: [],
    					state: { loaded: !1 }
    				}, this._data.core.selected = [], this._data.core.last_clicked = null, this._data.core.focused = null);

    				var d = this.get_container_ul()[0].className;

    				(b || (this.element.html("<ul class='" + d + "' role='group'><li class='jstree-initial-node jstree-loading jstree-leaf jstree-last' role='treeitem' id='j" + this._id + "_loading'><i class='jstree-icon jstree-ocl'></i><a class='jstree-anchor' href='#'><i class='jstree-icon jstree-themeicon-hidden'></i>" + this.get_string("Loading ...") + "</a></li></ul>"), this.element.attr("aria-activedescendant", "j" + this._id + "_loading")), this.load_node(a.jstree.root, function (b, c) {
    					(c && (this.get_container_ul()[0].className = d, this._firstChild(this.get_container_ul()[0]) && this.element.attr("aria-activedescendant", this._firstChild(this.get_container_ul()[0]).id), this.set_state(a.extend(!0, {}, this._data.core.state), function () {
    						this.trigger("refresh");
    					})), this._data.core.state = null);
    				}));
    			},
    			refresh_node(b) {
    				if ((b = this.get_node(b), !b || b.id === a.jstree.root)) return !1;
    				var c = [], d = [], e = this._data.core.selected.concat([]);

    				(d.push(b.id), b.state.opened === !0 && c.push(b.id), this.get_node(b, !0).find(".jstree-open").each(function () {
    					c.push(this.id);
    				}), this._load_nodes(d, a.proxy(
    					function (a) {
    						(this.open_node(c, !1, 0), this.select_node(this._data.core.selected), this.trigger("refresh_node", { node: b, nodes: a }));
    					},
    					this
    				)));
    			},
    			set_id(b, c) {
    				if ((b = this.get_node(b), !b || b.id === a.jstree.root)) return !1;
    				var d, e, f = this._model.data;
    				for ((c = c.toString(), f[b.parent].children[a.inArray(b.id, f[b.parent].children)] = c, d = 0, e = b.parents.length); e > d; d++) f[b.parents[d]].children_d[a.inArray(b.id, f[b.parents[d]].children_d)] = c;
    				for ((d = 0, e = b.children.length); e > d; d++) f[b.children[d]].parent = c;
    				for ((d = 0, e = b.children_d.length); e > d; d++) f[b.children_d[d]].parents[a.inArray(b.id, f[b.children_d[d]].parents)] = c;
    				return (d = a.inArray(b.id, this._data.core.selected), -1 !== d && (this._data.core.selected[d] = c), d = this.get_node(b.id, !0), d && (d.attr("id", c).children(".jstree-anchor").attr("id", c + "_anchor").end().attr("aria-labelledby", c + "_anchor"), this.element.attr("aria-activedescendant") === b.id && this.element.attr("aria-activedescendant", c)), delete f[b.id], b.id = c, b.li_attr.id = c, f[c] = b, !0);
    			},
    			get_text(b) {
    				return (b = this.get_node(b), b && b.id !== a.jstree.root ? b.text : !1);
    			},
    			set_text(b, c) {
    				var d, e;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), d = 0, e = b.length); e > d; d++) this.set_text(b[d], c);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (b.text = c, this.get_node(b, !0).length && this.redraw_node(b.id), this.trigger("set_text", { obj: b, text: c }), !0)
    				: !1);
    			},
    			get_json(b, c, d) {
    				if ((b = this.get_node(b || a.jstree.root), !b)) return !1;
    				c && c.flat && !d && (d = []);

    				var e = {
    						id: b.id,
    						text: b.text,
    						icon: this.get_icon(b),
    						li_attr: a.extend(!0, {}, b.li_attr),
    						a_attr: a.extend(!0, {}, b.a_attr),
    						state: {},
    						data: c && c.no_data ? !1 : a.extend(!0, {}, b.data)
    					},
    					f,
    					g;

    				if ((c && c.flat ? e.parent = b.parent : e.children = [], !c || !c.no_state)) for (f in b.state) b.state.hasOwnProperty(f) && (e.state[f] = b.state[f]);

    				if ((c && c.no_id && (delete e.id, e.li_attr && e.li_attr.id && delete e.li_attr.id, e.a_attr && e.a_attr.id && delete e.a_attr.id), c && c.flat && b.id !== a.jstree.root && d.push(e), !c || !c.no_children)) for ((f = 0, g = b.children.length); g > f; f++) c && c.flat
    				? this.get_json(b.children[f], c, d)
    				: e.children.push(this.get_json(b.children[f], c));

    				return c && c.flat
    				? d
    				: b.id === a.jstree.root ? e.children : e;
    			},
    			create_node(c, d, e, f, g) {
    				if ((null === c && (c = a.jstree.root), c = this.get_node(c), !c)) return !1;

    				if ((e = e === b ? "last" : e, !e.toString().match(/^(before|after)$/) && !g && !this.is_loaded(c))) return this.load_node(c, function () {
    					this.create_node(c, d, e, f, !0);
    				});

    				(d || (d = { text: this.get_string("New node") }), "string" == typeof d && (d = { text: d }), d.text === b && (d.text = this.get_string("New node")));
    				var h, i, j, k;

    				switch ((c.id === a.jstree.root && ("before" === e && (e = "first"), "after" === e && (e = "last")), e)) {
    					case "before":
    						(h = this.get_node(c.parent), e = a.inArray(c.id, h.children), c = h);
    						break;
    					case "after":
    						(h = this.get_node(c.parent), e = a.inArray(c.id, h.children) + 1, c = h);
    						break;
    					case "inside":
    					case "first":
    						e = 0;
    						break;
    					case "last":
    						e = c.children.length;
    						break;
    					default:
    						e || (e = 0);
    				}

    				if ((e > c.children.length && (e = c.children.length), d.id || (d.id = !0), !this.check("create_node", d, c, e))) return (this.settings.core.error.call(this, this._data.core.last_error), !1);
    				if ((d.id === !0 && delete d.id, d = this._parse_model_from_json(d, c.id, c.parents.concat()), !d)) return !1;
    				for ((h = this.get_node(d), i = [], i.push(d), i = i.concat(h.children_d), this.trigger("model", { nodes: i, parent: c.id }), c.children_d = c.children_d.concat(i), j = 0, k = c.parents.length); k > j; j++) this._model.data[c.parents[j]].children_d = this._model.data[c.parents[j]].children_d.concat(i);
    				for ((d = h, h = [], j = 0, k = c.children.length); k > j; j++) h[j >= e ? j + 1 : j] = c.children[j];

    				return (h[e] = d.id, c.children = h, this.redraw_node(c, !0), f && f.call(this, this.get_node(d)), this.trigger("create_node", {
    					node: this.get_node(d),
    					parent: c.id,
    					position: e
    				}), d.id);
    			},
    			rename_node(b, c) {
    				var d, e, f;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), d = 0, e = b.length); e > d; d++) this.rename_node(b[d], c);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (f = b.text, this.check("rename_node", b, this.get_parent(b), c)
    					? (this.set_text(b, c), this.trigger("rename_node", { node: b, text: c, old: f }), !0)
    					: (this.settings.core.error.call(this, this._data.core.last_error), !1))
    				: !1);
    			},
    			delete_node(b) {
    				var c, d, e, f, g, h, i, j, k, l, m, n;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.delete_node(b[c]);
    					return !0;
    				}

    				if ((b = this.get_node(b), !b || b.id === a.jstree.root)) return !1;
    				if ((e = this.get_node(b.parent), f = a.inArray(b.id, e.children), l = !1, !this.check("delete_node", b, e, f))) return (this.settings.core.error.call(this, this._data.core.last_error), !1);

    				for ((-1 !== f && (e.children = a.vakata.array_remove(e.children, f)), g = b.children_d.concat([]), g.push(b.id), j = 0, k = g.length); k > j; j++) {
    					for ((h = 0, i = b.parents.length); i > h; h++) (f = a.inArray(g[j], this._model.data[b.parents[h]].children_d), -1 !== f && (this._model.data[b.parents[h]].children_d = a.vakata.array_remove(this._model.data[b.parents[h]].children_d, f)));
    					this._model.data[g[j]].state.selected && (l = !0, f = a.inArray(g[j], this._data.core.selected), -1 !== f && (this._data.core.selected = a.vakata.array_remove(this._data.core.selected, f)));
    				}

    				for ((this.trigger("delete_node", { node: b, parent: e.id }), l && this.trigger("changed", {
    					action: "delete_node",
    					node: b,
    					selected: this._data.core.selected,
    					parent: e.id
    				}), j = 0, k = g.length); k > j; j++) delete this._model.data[g[j]];

    				return (-1 !== a.inArray(this._data.core.focused, g) && (this._data.core.focused = null, m = this.element[0].scrollTop, n = this.element[0].scrollLeft, e.id === a.jstree.root
    				? this.get_node(this._model.data[a.jstree.root].children[0], !0).children(".jstree-anchor").focus()
    				: this.get_node(e, !0).children(".jstree-anchor").focus(), this.element[0].scrollTop = m, this.element[0].scrollLeft = n), this.redraw_node(e, !0), !0);
    			},
    			check(b, c, d, e, f) {
    				(c = c && c.id ? c : this.get_node(c), d = d && d.id ? d : this.get_node(d));

    				var g = b.match(/^move_node|copy_node|create_node$/i) ? d : c,
    					h = this.settings.core.check_callback;

    				return "move_node" !== b && "copy_node" !== b || f && f.is_multi || c.id !== d.id && a.inArray(c.id, d.children) !== e && -1 === a.inArray(d.id, c.children_d)
    				? (g && g.data && (g = g.data), g && g.functions && (g.functions[b] === !1 || g.functions[b] === !0)
    					? (g.functions[b] === !1 && (this._data.core.last_error = {
    							error: "check",
    							plugin: "core",
    							id: "core_02",
    							reason: "Node data prevents function: " + b,
    							data: JSON.stringify({
    								chk: b,
    								pos: e,
    								obj: c && c.id ? c.id : !1,
    								par: d && d.id ? d.id : !1
    							})
    						}), g.functions[b])
    					: h === !1 || a.isFunction(h) && h.call(this, b, c, d, e, f) === !1 || h && h[b] === !1
    						? (this._data.core.last_error = {
    								error: "check",
    								plugin: "core",
    								id: "core_03",
    								reason: "User config for core.check_callback prevents function: " + b,
    								data: JSON.stringify({
    									chk: b,
    									pos: e,
    									obj: c && c.id ? c.id : !1,
    									par: d && d.id ? d.id : !1
    								})
    							}, !1)
    						: !0)
    				: (this._data.core.last_error = {
    						error: "check",
    						plugin: "core",
    						id: "core_01",
    						reason: "Moving parent inside child",
    						data: JSON.stringify({
    							chk: b,
    							pos: e,
    							obj: c && c.id ? c.id : !1,
    							par: d && d.id ? d.id : !1
    						})
    					}, !1);
    			},
    			last_error() {
    				return this._data.core.last_error;
    			},
    			move_node(c, d, e, f, g, h, i) {
    				var j, k, l, m, n, o, p, q, r, s, t, u, v, w;
    				if ((d = this.get_node(d), e = e === b ? 0 : e, !d)) return !1;

    				if (!e.toString().match(/^(before|after)$/) && !g && !this.is_loaded(d)) return this.load_node(d, function () {
    					this.move_node(c, d, e, f, !0, !1, i);
    				});

    				if (a.isArray(c)) {
    					if (1 !== c.length) {
    						for ((j = 0, k = c.length); k > j; j++) (r = this.move_node(c[j], d, e, f, g, !1, i)) && (d = r, e = "after");
    						return (this.redraw(), !0);
    					}

    					c = c[0];
    				}

    				if ((c = c && c.id ? c : this.get_node(c), !c || c.id === a.jstree.root)) return !1;

    				if ((l = (c.parent || a.jstree.root).toString(), n = e.toString().match(/^(before|after)$/) && d.id !== a.jstree.root
    				? this.get_node(d.parent)
    				: d, o = i
    				? i
    				: this._model.data[c.id] ? this : a.jstree.reference(c.id), p = !o || !o._id || this._id !== o._id, m = o && o._id && l && o._model.data[l] && o._model.data[l].children
    				? a.inArray(c.id, o._model.data[l].children)
    				: -1, o && o._id && (c = o._model.data[c.id]), p)) return (r = this.copy_node(c, d, e, f, g, !1, i))
    				? (o && o.delete_node(c), r)
    				: !1;

    				switch ((d.id === a.jstree.root && ("before" === e && (e = "first"), "after" === e && (e = "last")), e)) {
    					case "before":
    						e = a.inArray(d.id, n.children);
    						break;
    					case "after":
    						e = a.inArray(d.id, n.children) + 1;
    						break;
    					case "inside":
    					case "first":
    						e = 0;
    						break;
    					case "last":
    						e = n.children.length;
    						break;
    					default:
    						e || (e = 0);
    				}

    				if ((e > n.children.length && (e = n.children.length), !this.check("move_node", c, n, e, {
    					core: !0,
    					origin: i,
    					is_multi: o && o._id && o._id !== this._id,
    					is_foreign: !o || !o._id
    				}))) return (this.settings.core.error.call(this, this._data.core.last_error), !1);

    				if (c.parent === n.id) {
    					for ((q = n.children.concat(), r = a.inArray(c.id, q), -1 !== r && (q = a.vakata.array_remove(q, r), e > r && e--), r = [], s = 0, t = q.length); t > s; s++) r[s >= e ? s + 1 : s] = q[s];
    					(r[e] = c.id, n.children = r, this._node_changed(n.id), this.redraw(n.id === a.jstree.root));
    				} else {
    					for ((r = c.children_d.concat(), r.push(c.id), s = 0, t = c.parents.length); t > s; s++) {
    						for ((q = [], w = o._model.data[c.parents[s]].children_d, u = 0, v = w.length); v > u; u++) -1 === a.inArray(w[u], r) && q.push(w[u]);
    						o._model.data[c.parents[s]].children_d = q;
    					}

    					for ((o._model.data[l].children = a.vakata.array_remove_item(o._model.data[l].children, c.id), s = 0, t = n.parents.length); t > s; s++) this._model.data[n.parents[s]].children_d = this._model.data[n.parents[s]].children_d.concat(r);
    					for ((q = [], s = 0, t = n.children.length); t > s; s++) q[s >= e ? s + 1 : s] = n.children[s];
    					for ((q[e] = c.id, n.children = q, n.children_d.push(c.id), n.children_d = n.children_d.concat(c.children_d), c.parent = n.id, r = n.parents.concat(), r.unshift(n.id), w = c.parents.length, c.parents = r, r = r.concat(), s = 0, t = c.children_d.length); t > s; s++) (this._model.data[c.children_d[s]].parents = this._model.data[c.children_d[s]].parents.slice(0, -1 * w), Array.prototype.push.apply(this._model.data[c.children_d[s]].parents, r));
    					((l === a.jstree.root || n.id === a.jstree.root) && (this._model.force_full_redraw = !0), this._model.force_full_redraw || (this._node_changed(l), this._node_changed(n.id)), h || this.redraw());
    				}

    				return (f && f.call(this, c, n, e), this.trigger("move_node", {
    					node: c,
    					parent: n.id,
    					position: e,
    					old_parent: l,
    					old_position: m,
    					is_multi: o && o._id && o._id !== this._id,
    					is_foreign: !o || !o._id,
    					old_instance: o,
    					new_instance: this
    				}), c.id);
    			},
    			copy_node(c, d, e, f, g, h, i) {
    				var j, k, l, m, n, o, p, q, r, s, t;
    				if ((d = this.get_node(d), e = e === b ? 0 : e, !d)) return !1;

    				if (!e.toString().match(/^(before|after)$/) && !g && !this.is_loaded(d)) return this.load_node(d, function () {
    					this.copy_node(c, d, e, f, !0, !1, i);
    				});

    				if (a.isArray(c)) {
    					if (1 !== c.length) {
    						for ((j = 0, k = c.length); k > j; j++) (m = this.copy_node(c[j], d, e, f, g, !0, i)) && (d = m, e = "after");
    						return (this.redraw(), !0);
    					}

    					c = c[0];
    				}

    				if ((c = c && c.id ? c : this.get_node(c), !c || c.id === a.jstree.root)) return !1;

    				switch ((q = (c.parent || a.jstree.root).toString(), r = e.toString().match(/^(before|after)$/) && d.id !== a.jstree.root
    				? this.get_node(d.parent)
    				: d, s = i
    				? i
    				: this._model.data[c.id] ? this : a.jstree.reference(c.id), t = !s || !s._id || this._id !== s._id, s && s._id && (c = s._model.data[c.id]), d.id === a.jstree.root && ("before" === e && (e = "first"), "after" === e && (e = "last")), e)) {
    					case "before":
    						e = a.inArray(d.id, r.children);
    						break;
    					case "after":
    						e = a.inArray(d.id, r.children) + 1;
    						break;
    					case "inside":
    					case "first":
    						e = 0;
    						break;
    					case "last":
    						e = r.children.length;
    						break;
    					default:
    						e || (e = 0);
    				}

    				if ((e > r.children.length && (e = r.children.length), !this.check("copy_node", c, r, e, {
    					core: !0,
    					origin: i,
    					is_multi: s && s._id && s._id !== this._id,
    					is_foreign: !s || !s._id
    				}))) return (this.settings.core.error.call(this, this._data.core.last_error), !1);

    				if ((p = s
    				? s.get_json(c, { no_id: !0, no_data: !0, no_state: !0 })
    				: c, !p)) return !1;

    				if ((p.id === !0 && delete p.id, p = this._parse_model_from_json(p, r.id, r.parents.concat()), !p)) return !1;
    				for ((m = this.get_node(p), c && c.state && c.state.loaded === !1 && (m.state.loaded = !1), l = [], l.push(p), l = l.concat(m.children_d), this.trigger("model", { nodes: l, parent: r.id }), n = 0, o = r.parents.length); o > n; n++) this._model.data[r.parents[n]].children_d = this._model.data[r.parents[n]].children_d.concat(l);
    				for ((l = [], n = 0, o = r.children.length); o > n; n++) l[n >= e ? n + 1 : n] = r.children[n];

    				return (l[e] = m.id, r.children = l, r.children_d.push(m.id), r.children_d = r.children_d.concat(m.children_d), r.id === a.jstree.root && (this._model.force_full_redraw = !0), this._model.force_full_redraw || this._node_changed(r.id), h || this.redraw(r.id === a.jstree.root), f && f.call(this, m, r, e), this.trigger("copy_node", {
    					node: m,
    					original: c,
    					parent: r.id,
    					position: e,
    					old_parent: q,
    					old_position: s && s._id && q && s._model.data[q] && s._model.data[q].children
    					? a.inArray(c.id, s._model.data[q].children)
    					: -1,
    					is_multi: s && s._id && s._id !== this._id,
    					is_foreign: !s || !s._id,
    					old_instance: s,
    					new_instance: this
    				}), m.id);
    			},
    			cut(b) {
    				if ((b || (b = this._data.core.selected.concat()), a.isArray(b) || (b = [b]), !b.length)) return !1;
    				var c = [], g, h, i;
    				for ((h = 0, i = b.length); i > h; h++) (g = this.get_node(b[h]), g && g.id && g.id !== a.jstree.root && c.push(g));

    				return c.length
    				? (d = c, f = this, e = "move_node", void this.trigger("cut", { node: b }))
    				: !1;
    			},
    			copy(b) {
    				if ((b || (b = this._data.core.selected.concat()), a.isArray(b) || (b = [b]), !b.length)) return !1;
    				var c = [], g, h, i;
    				for ((h = 0, i = b.length); i > h; h++) (g = this.get_node(b[h]), g && g.id && g.id !== a.jstree.root && c.push(g));

    				return c.length
    				? (d = c, f = this, e = "copy_node", void this.trigger("copy", { node: b }))
    				: !1;
    			},
    			get_buffer() {
    				return { mode: e, node: d, inst: f };
    			},
    			can_paste() {
    				return e !== !1 && d !== !1;
    			},
    			paste(a, b) {
    				return (a = this.get_node(a), a && e && e.match(/^(copy_node|move_node)$/) && d
    				? (this[e](d, a, b, !1, !1, !1, f) && this.trigger("paste", { parent: a.id, node: d, mode: e }), d = !1, e = !1, void (f = !1))
    				: !1);
    			},
    			clear_buffer() {
    				(d = !1, e = !1, f = !1, this.trigger("clear_buffer"));
    			},
    			edit(b, c, d) {
    				var e, f, g, h, i, j, k, l, m, n = !1;

    				return (b = this.get_node(b))
    				? this.settings.core.check_callback === !1
    					? (this._data.core.last_error = {
    							error: "check",
    							plugin: "core",
    							id: "core_07",
    							reason: "Could not edit node because of check_callback"
    						}, this.settings.core.error.call(this, this._data.core.last_error), !1)
    					: (m = b, c = "string" == typeof c ? c : b.text, this.set_text(b, ""), b = this._open_to(b), m.text = c, e = this._data.core.rtl, f = this.element.width(), this._data.core.focused = m.id, g = b.children(".jstree-anchor").focus(), h = a("<span>"), i = c, j = a("<div />", {
    							css: {
    								position: "absolute",
    								top: "-200px",
    								left: e ? "0px" : "-1000px",
    								visibility: "hidden"
    							}
    						}).appendTo("body"), k = a("<input />", {
    							value: i,
    							"class": "jstree-rename-input",
    							css: {
    								padding: "0",
    								border: "1px solid silver",
    								"box-sizing": "border-box",
    								display: "inline-block",
    								height: this._data.core.li_height + "px",
    								lineHeight: this._data.core.li_height + "px",
    								width: "150px"
    							},
    							blur: a.proxy(
    								function (c) {
    									(c.stopImmediatePropagation(), c.preventDefault());

    									var e = h.children(".jstree-rename-input"),
    										f = e.val(),
    										k = this.settings.core.force_text,
    										l;

    									("" === f && (f = i), j.remove(), h.replaceWith(g), h.remove(), i = k ? i : a("<div></div>").append(a.parseHTML(i)).html(), this.set_text(b, i), l = !!this.rename_node(b, k
    									? a("<div></div>").text(f).text()
    									: a("<div></div>").append(a.parseHTML(f)).html()), l || this.set_text(b, i), this._data.core.focused = m.id, setTimeout(
    										a.proxy(
    											function () {
    												var a = this.get_node(m.id, !0);
    												a.length && (this._data.core.focused = m.id, a.children(".jstree-anchor").focus());
    											},
    											this
    										),
    										0
    									), d && d.call(this, m, l, n));
    								},
    								this
    							),
    							keydown(a) {
    								var b = a.which;
    								(27 === b && (n = !0, this.value = i), (27 === b || 13 === b || 37 === b || 38 === b || 39 === b || 40 === b || 32 === b) && a.stopImmediatePropagation(), (27 === b || 13 === b) && (a.preventDefault(), this.blur()));
    							},
    							click(a) {
    								a.stopImmediatePropagation();
    							},
    							mousedown(a) {
    								a.stopImmediatePropagation();
    							},
    							keyup(a) {
    								k.width(Math.min(j.text("pW" + this.value).width(), f));
    							},
    							keypress(a) {
    								return 13 === a.which ? !1 : void 0;
    							}
    						}), l = {
    							fontFamily: g.css("fontFamily") || "",
    							fontSize: g.css("fontSize") || "",
    							fontWeight: g.css("fontWeight") || "",
    							fontStyle: g.css("fontStyle") || "",
    							fontStretch: g.css("fontStretch") || "",
    							fontVariant: g.css("fontVariant") || "",
    							letterSpacing: g.css("letterSpacing") || "",
    							wordSpacing: g.css("wordSpacing") || ""
    						}, h.attr("class", g.attr("class")).append(g.contents().clone()).append(k), g.replaceWith(h), j.css(l), void k.css(l).width(Math.min(j.text("pW" + k[0].value).width(), f))[0].select())
    				: !1;
    			},
    			set_theme(b, c) {
    				if (!b) return !1;

    				if (c === !0) {
    					var d = this.settings.core.themes.dir;
    					(d || (d = a.jstree.path + "/themes"), c = d + "/" + b + "/style.css");
    				}

    				(c && -1 === a.inArray(c, g) && (a("head").append("<link rel=\"stylesheet\" href=\"" + c + "\" type=\"text/css\" />"), g.push(c)), this._data.core.themes.name && this.element.removeClass("jstree-" + this._data.core.themes.name), this._data.core.themes.name = b, this.element.addClass("jstree-" + b), this.element[this.settings.core.themes.responsive
    				? "addClass"
    				: "removeClass"]("jstree-" + b + "-responsive"), this.trigger("set_theme", { theme: b }));
    			},
    			get_theme() {
    				return this._data.core.themes.name;
    			},
    			set_theme_variant(a) {
    				(this._data.core.themes.variant && this.element.removeClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant), this._data.core.themes.variant = a, a && this.element.addClass("jstree-" + this._data.core.themes.name + "-" + this._data.core.themes.variant));
    			},
    			get_theme_variant() {
    				return this._data.core.themes.variant;
    			},
    			show_stripes() {
    				(this._data.core.themes.stripes = !0, this.get_container_ul().addClass("jstree-striped"));
    			},
    			hide_stripes() {
    				(this._data.core.themes.stripes = !1, this.get_container_ul().removeClass("jstree-striped"));
    			},
    			toggle_stripes() {
    				this._data.core.themes.stripes
    				? this.hide_stripes()
    				: this.show_stripes();
    			},
    			show_dots() {
    				(this._data.core.themes.dots = !0, this.get_container_ul().removeClass("jstree-no-dots"));
    			},
    			hide_dots() {
    				(this._data.core.themes.dots = !1, this.get_container_ul().addClass("jstree-no-dots"));
    			},
    			toggle_dots() {
    				this._data.core.themes.dots
    				? this.hide_dots()
    				: this.show_dots();
    			},
    			show_icons() {
    				(this._data.core.themes.icons = !0, this.get_container_ul().removeClass("jstree-no-icons"));
    			},
    			hide_icons() {
    				(this._data.core.themes.icons = !1, this.get_container_ul().addClass("jstree-no-icons"));
    			},
    			toggle_icons() {
    				this._data.core.themes.icons
    				? this.hide_icons()
    				: this.show_icons();
    			},
    			set_icon(c, d) {
    				var e, f, g, h;

    				if (a.isArray(c)) {
    					for ((c = c.slice(), e = 0, f = c.length); f > e; e++) this.set_icon(c[e], d);
    					return !0;
    				}

    				return (c = this.get_node(c), c && c.id !== a.jstree.root
    				? (h = c.icon, c.icon = d === !0 || null === d || d === b || "" === d ? !0 : d, g = this.get_node(c, !0).children(".jstree-anchor").children(".jstree-themeicon"), d === !1
    					? this.hide_icon(c)
    					: d === !0 || null === d || d === b || "" === d
    						? (g.removeClass("jstree-themeicon-custom " + h).css("background", "").removeAttr("rel"), h === !1 && this.show_icon(c))
    						: -1 === d.indexOf("/") && -1 === d.indexOf(".")
    							? (g.removeClass(h).css("background", ""), g.addClass(d + " jstree-themeicon-custom").attr("rel", d), h === !1 && this.show_icon(c))
    							: (g.removeClass(h).css("background", ""), g.addClass("jstree-themeicon-custom").css("background", "url('" + d + "') center center no-repeat").attr("rel", d), h === !1 && this.show_icon(c)), !0)
    				: !1);
    			},
    			get_icon(b) {
    				return (b = this.get_node(b), b && b.id !== a.jstree.root ? b.icon : !1);
    			},
    			hide_icon(b) {
    				var c, d;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.hide_icon(b[c]);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b !== a.jstree.root
    				? (b.icon = !1, this.get_node(b, !0).children(".jstree-anchor").children(".jstree-themeicon").addClass("jstree-themeicon-hidden"), !0)
    				: !1);
    			},
    			show_icon(b) {
    				var c, d, e;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.show_icon(b[c]);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b !== a.jstree.root
    				? (e = this.get_node(b, !0), b.icon = e.length
    					? e.children(".jstree-anchor").children(".jstree-themeicon").attr("rel")
    					: !0, b.icon || (b.icon = !0), e.children(".jstree-anchor").children(".jstree-themeicon").removeClass("jstree-themeicon-hidden"), !0)
    				: !1);
    			}
    		}, a.vakata = {}, a.vakata.attributes = function (b, c) {
    			b = a(b)[0];
    			var d = c ? {} : [];

    			return (b && b.attributes && a.each(b.attributes, function (b, e) {
    				-1 === a.inArray(e.name.toLowerCase(), ["style", "contenteditable", "hasfocus", "tabindex"]) && null !== e.value && "" !== a.trim(e.value) && (c ? d[e.name] = e.value : d.push(e.name));
    			}), d);
    		}, a.vakata.array_unique = function (a) {
    			var c = [], d, f, g = {};
    			for ((d = 0, f = a.length); f > d; d++) g[a[d]] === b && (c.push(a[d]), g[a[d]] = !0);
    			return c;
    		}, a.vakata.array_remove = function (a, b, c) {
    			var d = a.slice((c || b) + 1 || a.length);
    			return (a.length = 0 > b ? a.length + b : b, a.push.apply(a, d), a);
    		}, a.vakata.array_remove_item = function (b, c) {
    			var d = a.inArray(c, b);
    			return -1 !== d ? a.vakata.array_remove(b, d) : b;
    		}, a.jstree.plugins.changed = function (a, b) {
    			var c = [];

    			(this.trigger = function (a, d) {
    				var e, f;

    				if ((d || (d = {}), "changed" === a.replace(".jstree", ""))) {
    					d.changed = { selected: [], deselected: [] };
    					var g = {};
    					for ((e = 0, f = c.length); f > e; e++) g[c[e]] = 1;

    					for ((e = 0, f = d.selected.length); f > e; e++) g[d.selected[e]]
    					? g[d.selected[e]] = 2
    					: d.changed.selected.push(d.selected[e]);

    					for ((e = 0, f = c.length); f > e; e++) 1 === g[c[e]] && d.changed.deselected.push(c[e]);
    					c = d.selected.slice();
    				}

    				b.trigger.call(this, a, d);
    			}, this.refresh = function (a, d) {
    				return (c = [], b.refresh.apply(this, arguments));
    			});
    		});

    		var m = i.createElement("I");

    		(m.className = "jstree-icon jstree-checkbox", m.setAttribute("role", "presentation"), a.jstree.defaults.checkbox = {
    			visible: !0,
    			three_state: !0,
    			whole_node: !0,
    			keep_selected_style: !0,
    			cascade: "",
    			tie_selection: !0
    		}, a.jstree.plugins.checkbox = function (c, d) {
    			(this.bind = function () {
    				(d.bind.call(this), this._data.checkbox.uto = !1, this._data.checkbox.selected = [], this.settings.checkbox.three_state && (this.settings.checkbox.cascade = "up+down+undetermined"), this.element.on("init.jstree", a.proxy(
    					function () {
    						(this._data.checkbox.visible = this.settings.checkbox.visible, this.settings.checkbox.keep_selected_style || this.element.addClass("jstree-checkbox-no-clicked"), this.settings.checkbox.tie_selection && this.element.addClass("jstree-checkbox-selection"));
    					},
    					this
    				)).on("loading.jstree", a.proxy(
    					function () {
    						this[this._data.checkbox.visible
    						? "show_checkboxes"
    						: "hide_checkboxes"]();
    					},
    					this
    				)), -1 !== this.settings.checkbox.cascade.indexOf("undetermined") && this.element.on("changed.jstree uncheck_node.jstree check_node.jstree uncheck_all.jstree check_all.jstree move_node.jstree copy_node.jstree redraw.jstree open_node.jstree", a.proxy(
    					function () {
    						(this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(a.proxy(this._undetermined, this), 50));
    					},
    					this
    				)), this.settings.checkbox.tie_selection || this.element.on("model.jstree", a.proxy(
    					function (a, b) {
    						var c = this._model.data, d = c[b.parent], e = b.nodes, f, g;
    						for ((f = 0, g = e.length); g > f; f++) (c[e[f]].state.checked = c[e[f]].state.checked || c[e[f]].original && c[e[f]].original.state && c[e[f]].original.state.checked, c[e[f]].state.checked && this._data.checkbox.selected.push(e[f]));
    					},
    					this
    				)), (-1 !== this.settings.checkbox.cascade.indexOf("up") || -1 !== this.settings.checkbox.cascade.indexOf("down")) && this.element.on("model.jstree", a.proxy(
    					function (b, c) {
    						var d = this._model.data,
    							e = d[c.parent],
    							f = c.nodes,
    							g = [],
    							h,
    							i,
    							j,
    							k,
    							l,
    							m,
    							n = this.settings.checkbox.cascade,
    							o = this.settings.checkbox.tie_selection;

    						if (-1 !== n.indexOf("down")) if (e.state[o ? "selected" : "checked"]) {
    							for ((i = 0, j = f.length); j > i; i++) d[f[i]].state[o ? "selected" : "checked"] = !0;
    							this._data[o ? "core" : "checkbox"].selected = this._data[o ? "core" : "checkbox"].selected.concat(f);
    						} else for ((i = 0, j = f.length); j > i; i++) if (d[f[i]].state[o ? "selected" : "checked"]) {
    							for ((k = 0, l = d[f[i]].children_d.length); l > k; k++) d[d[f[i]].children_d[k]].state[o ? "selected" : "checked"] = !0;
    							this._data[o ? "core" : "checkbox"].selected = this._data[o ? "core" : "checkbox"].selected.concat(d[f[i]].children_d);
    						}

    						if (-1 !== n.indexOf("up")) {
    							for ((i = 0, j = e.children_d.length); j > i; i++) d[e.children_d[i]].children.length || g.push(d[e.children_d[i]].parent);

    							for ((g = a.vakata.array_unique(g), k = 0, l = g.length); l > k; k++) {
    								e = d[g[k]];

    								while (e && e.id !== a.jstree.root) {
    									for ((h = 0, i = 0, j = e.children.length); j > i; i++) h += d[e.children[i]].state[o ? "selected" : "checked"];
    									if (h !== j) break;
    									(e.state[o ? "selected" : "checked"] = !0, this._data[o ? "core" : "checkbox"].selected.push(e.id), m = this.get_node(e, !0), m && m.length && m.attr("aria-selected", !0).children(".jstree-anchor").addClass(o ? "jstree-clicked" : "jstree-checked"), e = this.get_node(e.parent));
    								}
    							}
    						}

    						this._data[o ? "core" : "checkbox"].selected = a.vakata.array_unique(this._data[o ? "core" : "checkbox"].selected);
    					},
    					this
    				)).on(
    					this.settings.checkbox.tie_selection
    					? "select_node.jstree"
    					: "check_node.jstree",
    					a.proxy(
    						function (b, c) {
    							var d = c.node,
    								e = this._model.data,
    								f = this.get_node(d.parent),
    								g = this.get_node(d, !0),
    								h,
    								i,
    								j,
    								k,
    								l = this.settings.checkbox.cascade,
    								m = this.settings.checkbox.tie_selection;

    							if (-1 !== l.indexOf("down")) for ((this._data[m ? "core" : "checkbox"].selected = a.vakata.array_unique(this._data[m ? "core" : "checkbox"].selected.concat(d.children_d)), h = 0, i = d.children_d.length); i > h; h++) (k = e[d.children_d[h]], k.state[m ? "selected" : "checked"] = !0, k && k.original && k.original.state && k.original.state.undetermined && (k.original.state.undetermined = !1));

    							if (-1 !== l.indexOf("up")) while (f && f.id !== a.jstree.root) {
    								for ((j = 0, h = 0, i = f.children.length); i > h; h++) j += e[f.children[h]].state[m ? "selected" : "checked"];
    								if (j !== i) break;
    								(f.state[m ? "selected" : "checked"] = !0, this._data[m ? "core" : "checkbox"].selected.push(f.id), k = this.get_node(f, !0), k && k.length && k.attr("aria-selected", !0).children(".jstree-anchor").addClass(m ? "jstree-clicked" : "jstree-checked"), f = this.get_node(f.parent));
    							}

    							-1 !== l.indexOf("down") && g.length && g.find(".jstree-anchor").addClass(m ? "jstree-clicked" : "jstree-checked").parent().attr("aria-selected", !0);
    						},
    						this
    					)
    				).on(
    					this.settings.checkbox.tie_selection
    					? "deselect_all.jstree"
    					: "uncheck_all.jstree",
    					a.proxy(
    						function (b, c) {
    							var d = this.get_node(a.jstree.root), e = this._model.data, f, g, h;
    							for ((f = 0, g = d.children_d.length); g > f; f++) (h = e[d.children_d[f]], h && h.original && h.original.state && h.original.state.undetermined && (h.original.state.undetermined = !1));
    						},
    						this
    					)
    				).on(
    					this.settings.checkbox.tie_selection
    					? "deselect_node.jstree"
    					: "uncheck_node.jstree",
    					a.proxy(
    						function (b, c) {
    							var d = c.node,
    								e = this.get_node(d, !0),
    								f,
    								g,
    								h,
    								i = this.settings.checkbox.cascade,
    								j = this.settings.checkbox.tie_selection;

    							if ((d && d.original && d.original.state && d.original.state.undetermined && (d.original.state.undetermined = !1), -1 !== i.indexOf("down"))) for ((f = 0, g = d.children_d.length); g > f; f++) (h = this._model.data[d.children_d[f]], h.state[j ? "selected" : "checked"] = !1, h && h.original && h.original.state && h.original.state.undetermined && (h.original.state.undetermined = !1));
    							if (-1 !== i.indexOf("up")) for ((f = 0, g = d.parents.length); g > f; f++) (h = this._model.data[d.parents[f]], h.state[j ? "selected" : "checked"] = !1, h && h.original && h.original.state && h.original.state.undetermined && (h.original.state.undetermined = !1), h = this.get_node(d.parents[f], !0), h && h.length && h.attr("aria-selected", !1).children(".jstree-anchor").removeClass(j ? "jstree-clicked" : "jstree-checked"));
    							for ((h = [], f = 0, g = this._data[j ? "core" : "checkbox"].selected.length); g > f; f++) -1 !== i.indexOf("down") && -1 !== a.inArray(this._data[j ? "core" : "checkbox"].selected[f], d.children_d) || -1 !== i.indexOf("up") && -1 !== a.inArray(this._data[j ? "core" : "checkbox"].selected[f], d.parents) || h.push(this._data[j ? "core" : "checkbox"].selected[f]);
    							(this._data[j ? "core" : "checkbox"].selected = a.vakata.array_unique(h), -1 !== i.indexOf("down") && e.length && e.find(".jstree-anchor").removeClass(j ? "jstree-clicked" : "jstree-checked").parent().attr("aria-selected", !1));
    						},
    						this
    					)
    				), -1 !== this.settings.checkbox.cascade.indexOf("up") && this.element.on("delete_node.jstree", a.proxy(
    					function (b, c) {
    						var d = this.get_node(c.parent),
    							e = this._model.data,
    							f,
    							g,
    							h,
    							i,
    							j = this.settings.checkbox.tie_selection;

    						while (d && d.id !== a.jstree.root && !d.state[j ? "selected" : "checked"]) {
    							for ((h = 0, f = 0, g = d.children.length); g > f; f++) h += e[d.children[f]].state[j ? "selected" : "checked"];
    							if (!(g > 0 && h === g)) break;
    							(d.state[j ? "selected" : "checked"] = !0, this._data[j ? "core" : "checkbox"].selected.push(d.id), i = this.get_node(d, !0), i && i.length && i.attr("aria-selected", !0).children(".jstree-anchor").addClass(j ? "jstree-clicked" : "jstree-checked"), d = this.get_node(d.parent));
    						}
    					},
    					this
    				)).on("move_node.jstree", a.proxy(
    					function (b, c) {
    						var d = c.is_multi,
    							e = c.old_parent,
    							f = this.get_node(c.parent),
    							g = this._model.data,
    							h,
    							i,
    							j,
    							k,
    							l,
    							m = this.settings.checkbox.tie_selection;

    						if (!d) {
    							h = this.get_node(e);

    							while (h && h.id !== a.jstree.root && !h.state[m ? "selected" : "checked"]) {
    								for ((i = 0, j = 0, k = h.children.length); k > j; j++) i += g[h.children[j]].state[m ? "selected" : "checked"];
    								if (!(k > 0 && i === k)) break;
    								(h.state[m ? "selected" : "checked"] = !0, this._data[m ? "core" : "checkbox"].selected.push(h.id), l = this.get_node(h, !0), l && l.length && l.attr("aria-selected", !0).children(".jstree-anchor").addClass(m ? "jstree-clicked" : "jstree-checked"), h = this.get_node(h.parent));
    							}
    						}

    						h = f;

    						while (h && h.id !== a.jstree.root) {
    							for ((i = 0, j = 0, k = h.children.length); k > j; j++) i += g[h.children[j]].state[m ? "selected" : "checked"];

    							if (i === k) h.state[m ? "selected" : "checked"] || (h.state[m ? "selected" : "checked"] = !0, this._data[m ? "core" : "checkbox"].selected.push(h.id), l = this.get_node(h, !0), l && l.length && l.attr("aria-selected", !0).children(".jstree-anchor").addClass(m ? "jstree-clicked" : "jstree-checked")); else {
    								if (!h.state[m ? "selected" : "checked"]) break;
    								(h.state[m ? "selected" : "checked"] = !1, this._data[m ? "core" : "checkbox"].selected = a.vakata.array_remove_item(this._data[m ? "core" : "checkbox"].selected, h.id), l = this.get_node(h, !0), l && l.length && l.attr("aria-selected", !1).children(".jstree-anchor").removeClass(m ? "jstree-clicked" : "jstree-checked"));
    							}

    							h = this.get_node(h.parent);
    						}
    					},
    					this
    				)));
    			}, this._undetermined = function () {
    				if (null !== this.element) {
    					var c,
    						d,
    						e,
    						f,
    						g = {},
    						h = this._model.data,
    						i = this.settings.checkbox.tie_selection,
    						j = this._data[i ? "core" : "checkbox"].selected,
    						k = [],
    						l = this;

    					for ((c = 0, d = j.length); d > c; c++) if (h[j[c]] && h[j[c]].parents) for ((e = 0, f = h[j[c]].parents.length); f > e; e++) g[h[j[c]].parents[e]] === b && h[j[c]].parents[e] !== a.jstree.root && (g[h[j[c]].parents[e]] = !0, k.push(h[j[c]].parents[e]));

    					for ((this.element.find(".jstree-closed").not(":has(.jstree-children)").each(function () {
    						var i = l.get_node(this), j;

    						if (i.state.loaded) {
    							for ((c = 0, d = i.children_d.length); d > c; c++) if ((j = h[i.children_d[c]], !j.state.loaded && j.original && j.original.state && j.original.state.undetermined && j.original.state.undetermined === !0)) for ((g[j.id] === b && j.id !== a.jstree.root && (g[j.id] = !0, k.push(j.id)), e = 0, f = j.parents.length); f > e; e++) g[j.parents[e]] === b && j.parents[e] !== a.jstree.root && (g[j.parents[e]] = !0, k.push(j.parents[e]));
    						} else if (i.original && i.original.state && i.original.state.undetermined && i.original.state.undetermined === !0) for ((g[i.id] === b && i.id !== a.jstree.root && (g[i.id] = !0, k.push(i.id)), e = 0, f = i.parents.length); f > e; e++) g[i.parents[e]] === b && i.parents[e] !== a.jstree.root && (g[i.parents[e]] = !0, k.push(i.parents[e]));
    					}), this.element.find(".jstree-undetermined").removeClass("jstree-undetermined"), c = 0, d = k.length); d > c; c++) h[k[c]].state[i ? "selected" : "checked"] || (j = this.get_node(k[c], !0), j && j.length && j.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-undetermined"));
    				}
    			}, this.redraw_node = function (b, c, e, f) {
    				if (b = d.redraw_node.apply(this, arguments)) {
    					var g, h, i = null, j = null;

    					for ((g = 0, h = b.childNodes.length); h > g; g++) if (b.childNodes[g] && b.childNodes[g].className && -1 !== b.childNodes[g].className.indexOf("jstree-anchor")) {
    						i = b.childNodes[g];
    						break;
    					}

    					i && (!this.settings.checkbox.tie_selection && this._model.data[b.id].state.checked && (i.className += " jstree-checked"), j = m.cloneNode(!1), this._model.data[b.id].state.checkbox_disabled && (j.className += " jstree-checkbox-disabled"), i.insertBefore(j, i.childNodes[0]));
    				}

    				return (e || -1 === this.settings.checkbox.cascade.indexOf("undetermined") || (this._data.checkbox.uto && clearTimeout(this._data.checkbox.uto), this._data.checkbox.uto = setTimeout(a.proxy(this._undetermined, this), 50)), b);
    			}, this.show_checkboxes = function () {
    				(this._data.core.themes.checkboxes = !0, this.get_container_ul().removeClass("jstree-no-checkboxes"));
    			}, this.hide_checkboxes = function () {
    				(this._data.core.themes.checkboxes = !1, this.get_container_ul().addClass("jstree-no-checkboxes"));
    			}, this.toggle_checkboxes = function () {
    				this._data.core.themes.checkboxes
    				? this.hide_checkboxes()
    				: this.show_checkboxes();
    			}, this.is_undetermined = function (b) {
    				b = this.get_node(b);

    				var c = this.settings.checkbox.cascade,
    					d,
    					e,
    					f = this.settings.checkbox.tie_selection,
    					g = this._data[f ? "core" : "checkbox"].selected,
    					h = this._model.data;

    				if (!b || b.state[f ? "selected" : "checked"] === !0 || -1 === c.indexOf("undetermined") || -1 === c.indexOf("down") && -1 === c.indexOf("up")) return !1;
    				if (!b.state.loaded && b.original.state.undetermined === !0) return !0;
    				for ((d = 0, e = b.children_d.length); e > d; d++) if (-1 !== a.inArray(b.children_d[d], g) || !h[b.children_d[d]].state.loaded && h[b.children_d[d]].original.state.undetermined) return !0;
    				return !1;
    			}, this.disable_checkbox = function (b) {
    				var c, d, e;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.disable_checkbox(b[c]);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (e = this.get_node(b, !0), void (b.state.checkbox_disabled || (b.state.checkbox_disabled = !0, e && e.length && e.children(".jstree-anchor").children(".jstree-checkbox").addClass("jstree-checkbox-disabled"), this.trigger("disable_checkbox", { node: b }))))
    				: !1);
    			}, this.enable_checkbox = function (b) {
    				var c, d, e;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), c = 0, d = b.length); d > c; c++) this.enable_checkbox(b[c]);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (e = this.get_node(b, !0), void (b.state.checkbox_disabled && (b.state.checkbox_disabled = !1, e && e.length && e.children(".jstree-anchor").children(".jstree-checkbox").removeClass("jstree-checkbox-disabled"), this.trigger("enable_checkbox", { node: b }))))
    				: !1);
    			}, this.activate_node = function (b, c) {
    				return a(c.target).hasClass("jstree-checkbox-disabled")
    				? !1
    				: (this.settings.checkbox.tie_selection && (this.settings.checkbox.whole_node || a(c.target).hasClass("jstree-checkbox")) && (c.ctrlKey = !0), this.settings.checkbox.tie_selection || !this.settings.checkbox.whole_node && !a(c.target).hasClass("jstree-checkbox")
    					? d.activate_node.call(this, b, c)
    					: this.is_disabled(b)
    						? !1
    						: (this.is_checked(b)
    							? this.uncheck_node(b, c)
    							: this.check_node(b, c), void this.trigger("activate_node", { node: this.get_node(b) })));
    			}, this.check_node = function (b, c) {
    				if (this.settings.checkbox.tie_selection) return this.select_node(b, !1, !0, c);
    				var d, e, f;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), e = 0, f = b.length); f > e; e++) this.check_node(b[e], c);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (d = this.get_node(b, !0), void (b.state.checked || (b.state.checked = !0, this._data.checkbox.selected.push(b.id), d && d.length && d.children(".jstree-anchor").addClass("jstree-checked"), this.trigger("check_node", {
    						node: b,
    						selected: this._data.checkbox.selected,
    						event: c
    					}))))
    				: !1);
    			}, this.uncheck_node = function (b, c) {
    				if (this.settings.checkbox.tie_selection) return this.deselect_node(b, !1, c);
    				var d, e, f;

    				if (a.isArray(b)) {
    					for ((b = b.slice(), d = 0, e = b.length); e > d; d++) this.uncheck_node(b[d], c);
    					return !0;
    				}

    				return (b = this.get_node(b), b && b.id !== a.jstree.root
    				? (f = this.get_node(b, !0), void (b.state.checked && (b.state.checked = !1, this._data.checkbox.selected = a.vakata.array_remove_item(this._data.checkbox.selected, b.id), f.length && f.children(".jstree-anchor").removeClass("jstree-checked"), this.trigger("uncheck_node", {
    						node: b,
    						selected: this._data.checkbox.selected,
    						event: c
    					}))))
    				: !1);
    			}, this.check_all = function () {
    				if (this.settings.checkbox.tie_selection) return this.select_all();
    				var b = this._data.checkbox.selected.concat([]), c, d;
    				for ((this._data.checkbox.selected = this._model.data[a.jstree.root].children_d.concat(), c = 0, d = this._data.checkbox.selected.length); d > c; c++) this._model.data[this._data.checkbox.selected[c]] && (this._model.data[this._data.checkbox.selected[c]].state.checked = !0);
    				(this.redraw(!0), this.trigger("check_all", { selected: this._data.checkbox.selected }));
    			}, this.uncheck_all = function () {
    				if (this.settings.checkbox.tie_selection) return this.deselect_all();
    				var a = this._data.checkbox.selected.concat([]), b, c;
    				for ((b = 0, c = this._data.checkbox.selected.length); c > b; b++) this._model.data[this._data.checkbox.selected[b]] && (this._model.data[this._data.checkbox.selected[b]].state.checked = !1);

    				(this._data.checkbox.selected = [], this.element.find(".jstree-checked").removeClass("jstree-checked"), this.trigger("uncheck_all", {
    					selected: this._data.checkbox.selected,
    					node: a
    				}));
    			}, this.is_checked = function (b) {
    				return this.settings.checkbox.tie_selection
    				? this.is_selected(b)
    				: (b = this.get_node(b), b && b.id !== a.jstree.root ? b.state.checked : !1);
    			}, this.get_checked = function (b) {
    				return this.settings.checkbox.tie_selection
    				? this.get_selected(b)
    				: b
    					? a.map(this._data.checkbox.selected, a.proxy(
    							function (a) {
    								return this.get_node(a);
    							},
    							this
    						))
    					: this._data.checkbox.selected;
    			}, this.get_top_checked = function (b) {
    				if (this.settings.checkbox.tie_selection) return this.get_top_selected(b);
    				var c = this.get_checked(!0), d = {}, e, f, g, h;
    				for ((e = 0, f = c.length); f > e; e++) d[c[e].id] = c[e];
    				for ((e = 0, f = c.length); f > e; e++) for ((g = 0, h = c[e].children_d.length); h > g; g++) d[c[e].children_d[g]] && delete d[c[e].children_d[g]];
    				c = [];
    				for (e in d) d.hasOwnProperty(e) && c.push(e);

    				return b
    				? a.map(c, a.proxy(
    						function (a) {
    							return this.get_node(a);
    						},
    						this
    					))
    				: c;
    			}, this.get_bottom_checked = function (b) {
    				if (this.settings.checkbox.tie_selection) return this.get_bottom_selected(b);
    				var c = this.get_checked(!0), d = [], e, f;
    				for ((e = 0, f = c.length); f > e; e++) c[e].children.length || d.push(c[e].id);

    				return b
    				? a.map(d, a.proxy(
    						function (a) {
    							return this.get_node(a);
    						},
    						this
    					))
    				: d;
    			}, this.load_node = function (b, c) {
    				var e, f, j;
    				if (!a.isArray(b) && !this.settings.checkbox.tie_selection && (j = this.get_node(b), j && j.state.loaded)) for ((e = 0, f = j.children_d.length); f > e; e++) this._model.data[j.children_d[e]].state.checked && (this._data.checkbox.selected = a.vakata.array_remove_item(this._data.checkbox.selected, j.children_d[e]));
    				return d.load_node.apply(this, arguments);
    			}, this.get_state = function () {
    				var a = d.get_state.apply(this, arguments);

    				return this.settings.checkbox.tie_selection
    				? a
    				: (a.checkbox = this._data.checkbox.selected.slice(), a);
    			}, this.set_state = function (b, c) {
    				var e = d.set_state.apply(this, arguments);

    				if (e && b.checkbox) {
    					if (!this.settings.checkbox.tie_selection) {
    						this.uncheck_all();
    						var f = this;

    						a.each(b.checkbox, function (a, b) {
    							f.check_node(b);
    						});
    					}

    					return (delete b.checkbox, this.set_state(b, c), !1);
    				}

    				return e;
    			}, this.refresh = function (a, b) {
    				return (this.settings.checkbox.tie_selection || (this._data.checkbox.selected = []), d.refresh.apply(this, arguments));
    			});
    		}, a.jstree.defaults.conditionalselect = function () {
    			return !0;
    		}, a.jstree.plugins.conditionalselect = function (a, b) {
    			this.activate_node = function (a, c) {
    				this.settings.conditionalselect.call(this, this.get_node(a), c) && b.activate_node.call(this, a, c);
    			};
    		}, a.jstree.defaults.contextmenu = {
    			select_node: !0,
    			show_at_node: !0,
    			items(b, c) {
    				return {
    					create: {
    						separator_before: !1,
    						separator_after: !0,
    						_disabled: !1,
    						label: "Create",
    						action(b) {
    							var c = a.jstree.reference(b.reference), d = c.get_node(b.reference);

    							c.create_node(d, {}, "last", function (a) {
    								setTimeout(
    									function () {
    										c.edit(a);
    									},
    									0
    								);
    							});
    						}
    					},
    					rename: {
    						separator_before: !1,
    						separator_after: !1,
    						_disabled: !1,
    						label: "Rename",
    						action(b) {
    							var c = a.jstree.reference(b.reference), d = c.get_node(b.reference);
    							c.edit(d);
    						}
    					},
    					remove: {
    						separator_before: !1,
    						icon: !1,
    						separator_after: !1,
    						_disabled: !1,
    						label: "Delete",
    						action(b) {
    							var c = a.jstree.reference(b.reference), d = c.get_node(b.reference);

    							c.is_selected(d)
    							? c.delete_node(c.get_selected())
    							: c.delete_node(d);
    						}
    					},
    					ccp: {
    						separator_before: !0,
    						icon: !1,
    						separator_after: !1,
    						label: "Edit",
    						action: !1,
    						submenu: {
    							cut: {
    								separator_before: !1,
    								separator_after: !1,
    								label: "Cut",
    								action(b) {
    									var c = a.jstree.reference(b.reference),
    										d = c.get_node(b.reference);

    									c.is_selected(d)
    									? c.cut(c.get_top_selected())
    									: c.cut(d);
    								}
    							},
    							copy: {
    								separator_before: !1,
    								icon: !1,
    								separator_after: !1,
    								label: "Copy",
    								action(b) {
    									var c = a.jstree.reference(b.reference),
    										d = c.get_node(b.reference);

    									c.is_selected(d)
    									? c.copy(c.get_top_selected())
    									: c.copy(d);
    								}
    							},
    							paste: {
    								separator_before: !1,
    								icon: !1,
    								_disabled(b) {
    									return !a.jstree.reference(b.reference).can_paste();
    								},
    								separator_after: !1,
    								label: "Paste",
    								action(b) {
    									var c = a.jstree.reference(b.reference),
    										d = c.get_node(b.reference);

    									c.paste(d);
    								}
    							}
    						}
    					}
    				};
    			}
    		}, a.jstree.plugins.contextmenu = function (c, d) {
    			(this.bind = function () {
    				d.bind.call(this);
    				var b = 0, c = null, e, f;

    				(this.element.on("contextmenu.jstree", ".jstree-anchor", a.proxy(
    					function (a, d) {
    						(a.preventDefault(), b = a.ctrlKey ? +new Date() : 0, (d || c) && (b = +new Date() + 10000), c && clearTimeout(c), this.is_loading(a.currentTarget) || this.show_contextmenu(a.currentTarget, a.pageX, a.pageY, a));
    					},
    					this
    				)).on("click.jstree", ".jstree-anchor", a.proxy(
    					function (c) {
    						(this._data.contextmenu.visible && (!b || +new Date() - b > 250) && a.vakata.context.hide(), b = 0);
    					},
    					this
    				)).on("touchstart.jstree", ".jstree-anchor", function (b) {
    					b.originalEvent && b.originalEvent.changedTouches && b.originalEvent.changedTouches[0] && (e = b.pageX, f = b.pageY, c = setTimeout(
    						function () {
    							a(b.currentTarget).trigger("contextmenu", !0);
    						},
    						750
    					));
    				}).on("touchmove.vakata.jstree", function (a) {
    					c && a.originalEvent && a.originalEvent.changedTouches && a.originalEvent.changedTouches[0] && (Math.abs(e - a.pageX) > 50 || Math.abs(f - a.pageY) > 50) && clearTimeout(c);
    				}).on("touchend.vakata.jstree", function (a) {
    					c && clearTimeout(c);
    				}), a(i).on("context_hide.vakata.jstree", a.proxy(
    					function () {
    						this._data.contextmenu.visible = !1;
    					},
    					this
    				)));
    			}, this.teardown = function () {
    				(this._data.contextmenu.visible && a.vakata.context.hide(), d.teardown.call(this));
    			}, this.show_contextmenu = function (c, d, e, f) {
    				if ((c = this.get_node(c), !c || c.id === a.jstree.root)) return !1;

    				var g = this.settings.contextmenu,
    					h = this.get_node(c, !0),
    					i = h.children(".jstree-anchor"),
    					j = !1,
    					k = !1;

    				((g.show_at_node || d === b || e === b) && (j = i.offset(), d = j.left, e = j.top + this._data.core.li_height), this.settings.contextmenu.select_node && !this.is_selected(c) && this.activate_node(c, f), k = g.items, a.isFunction(k) && (k = k.call(this, c, a.proxy(
    					function (a) {
    						this._show_contextmenu(c, d, e, a);
    					},
    					this
    				))), a.isPlainObject(k) && this._show_contextmenu(c, d, e, k));
    			}, this._show_contextmenu = function (b, c, d, e) {
    				var f = this.get_node(b, !0), g = f.children(".jstree-anchor");

    				(a(i).one("context_show.vakata.jstree", a.proxy(
    					function (b, c) {
    						var d = "jstree-contextmenu jstree-" + this.get_theme() + "-contextmenu";
    						a(c.element).addClass(d);
    					},
    					this
    				)), this._data.contextmenu.visible = !0, a.vakata.context.show(g, { x: c, y: d }, e), this.trigger("show_contextmenu", { node: b, x: c, y: d }));
    			});
    		}, (function (a) {
    			var b = !1,
    				c = {
    					element: !1,
    					reference: !1,
    					position_x: 0,
    					position_y: 0,
    					items: [],
    					html: "",
    					is_visible: !1
    				};

    			(a.vakata.context = {
    				settings: { hide_onmouseleave: 0, icons: !0 },
    				_trigger(b) {
    					a(i).triggerHandler("context_" + b + ".vakata", {
    						reference: c.reference,
    						element: c.element,
    						position: { x: c.position_x, y: c.position_y }
    					});
    				},
    				_execute(b) {
    					return (b = c.items[b], b && (!b._disabled || a.isFunction(b._disabled) && !b._disabled({
    						item: b,
    						reference: c.reference,
    						element: c.element
    					})) && b.action
    					? b.action.call(null, {
    							item: b,
    							reference: c.reference,
    							element: c.element,
    							position: { x: c.position_x, y: c.position_y }
    						})
    					: !1);
    				},
    				_parse(b, d) {
    					if (!b) return !1;
    					d || (c.html = "", c.items = []);
    					var e = "", f = !1, g;

    					return (d && (e += "<ul>"), a.each(b, function (b, d) {
    						return d
    						? (c.items.push(d), !f && d.separator_before && (e += "<li class='vakata-context-separator'><a href='#' " + (a.vakata.context.settings.icons
    							? ""
    							: "style=\"margin-left:0px;\"") + ">&#160;</a></li>"), f = !1, e += "<li class='" + (d._class || "") + (d._disabled === !0 || a.isFunction(d._disabled) && d._disabled({
    								item: d,
    								reference: c.reference,
    								element: c.element
    							})
    							? " vakata-contextmenu-disabled "
    							: "") + "' " + (d.shortcut ? " data-shortcut='" + d.shortcut + "' " : "") + ">", e += "<a href='#' rel='" + (c.items.length - 1) + "'>", a.vakata.context.settings.icons && (e += "<i ", d.icon && (e += -1 !== d.icon.indexOf("/") || -1 !== d.icon.indexOf(".")
    							? " style='background:url(\"" + d.icon + "\") center center no-repeat' "
    							: " class='" + d.icon + "' "), e += "></i><span class='vakata-contextmenu-sep'>&#160;</span>"), e += (a.isFunction(d.label)
    							? d.label({
    									item: b,
    									reference: c.reference,
    									element: c.element
    								})
    							: d.label) + (d.shortcut
    							? " <span class=\"vakata-contextmenu-shortcut vakata-contextmenu-shortcut-" + d.shortcut + "\">" + (d.shortcut_label || "") + "</span>"
    							: "") + "</a>", d.submenu && (g = a.vakata.context._parse(d.submenu, !0), g && (e += g)), e += "</li>", void (d.separator_after && (e += "<li class='vakata-context-separator'><a href='#' " + (a.vakata.context.settings.icons
    							? ""
    							: "style=\"margin-left:0px;\"") + ">&#160;</a></li>", f = !0)))
    						: !0;
    					}), e = e.replace(/<li class\='vakata-context-separator'\><\/li\>$/, ""), d && (e += "</ul>"), d || (c.html = e, a.vakata.context._trigger("parse")), e.length > 10 ? e : !1);
    				},
    				_show_submenu(c) {
    					if ((c = a(c), c.length && c.children("ul").length)) {
    						var d = c.children("ul"),
    							e = c.offset().left + c.outerWidth(),
    							f = c.offset().top,
    							g = d.width(),
    							h = d.height(),
    							i = a(window).width() + a(window).scrollLeft(),
    							j = a(window).height() + a(window).scrollTop();

    						(b
    						? c[e - (g + 10 + c.outerWidth()) < 0
    							? "addClass"
    							: "removeClass"]("vakata-context-left")
    						: c[e + g + 10 > i ? "addClass" : "removeClass"]("vakata-context-right"), f + h + 10 > j && d.css("bottom", "-1px"), d.show());
    					}
    				},
    				show(d, e, f) {
    					var g, h, i, j, k, l, m, n, o = !0;

    					switch ((c.element && c.element.length && c.element.width(""), o)) {
    						case !e && !d:
    							return !1;
    						case !!e && !!d:
    							(c.reference = d, c.position_x = e.x, c.position_y = e.y);
    							break;
    						case !e && !!d:
    							(c.reference = d, g = d.offset(), c.position_x = g.left + d.outerHeight(), c.position_y = g.top);
    							break;
    						case !!e && !d:
    							(c.position_x = e.x, c.position_y = e.y);
    					}

    					(d && !f && a(d).data("vakata_contextmenu") && (f = a(d).data("vakata_contextmenu")), a.vakata.context._parse(f) && c.element.html(c.html), c.items.length && (c.element.appendTo("body"), h = c.element, i = c.position_x, j = c.position_y, k = h.width(), l = h.height(), m = a(window).width() + a(window).scrollLeft(), n = a(window).height() + a(window).scrollTop(), b && (i -= h.outerWidth() - a(d).outerWidth(), i < a(window).scrollLeft() + 20 && (i = a(window).scrollLeft() + 20)), i + k + 20 > m && (i = m - (k + 20)), j + l + 20 > n && (j = n - (l + 20)), c.element.css({ left: i, top: j }).show().find("a").first().focus().parent().addClass("vakata-context-hover"), c.is_visible = !0, a.vakata.context._trigger("show")));
    				},
    				hide() {
    					c.is_visible && (c.element.hide().find("ul").hide().end().find(":focus").blur().end().detach(), c.is_visible = !1, a.vakata.context._trigger("hide"));
    				}
    			}, a(function () {
    				b = "rtl" === a("body").css("direction");
    				var d = !1;

    				(c.element = a("<ul class='vakata-context'></ul>"), c.element.on("mouseenter", "li", function (b) {
    					(b.stopImmediatePropagation(), a.contains(this, b.relatedTarget) || (d && clearTimeout(d), c.element.find(".vakata-context-hover").removeClass("vakata-context-hover").end(), a(this).siblings().find("ul").hide().end().end().parentsUntil(".vakata-context", "li").addBack().addClass("vakata-context-hover"), a.vakata.context._show_submenu(this)));
    				}).on("mouseleave", "li", function (b) {
    					a.contains(this, b.relatedTarget) || a(this).find(".vakata-context-hover").addBack().removeClass("vakata-context-hover");
    				}).on("mouseleave", function (b) {
    					(a(this).find(".vakata-context-hover").removeClass("vakata-context-hover"), a.vakata.context.settings.hide_onmouseleave && (d = setTimeout(
    						(function (b) {
    							return function () {
    								a.vakata.context.hide();
    							};
    						})(),
    						a.vakata.context.settings.hide_onmouseleave
    					)));
    				}).on("click", "a", function (b) {
    					(b.preventDefault(), a(this).blur().parent().hasClass("vakata-context-disabled") || a.vakata.context._execute(a(this).attr("rel")) === !1 || a.vakata.context.hide());
    				}).on("keydown", "a", function (b) {
    					var d = null;

    					switch (b.which) {
    						case 13:
    						case 32:
    							(b.type = "mouseup", b.preventDefault(), a(b.currentTarget).trigger(b));
    							break;
    						case 37:
    							c.is_visible && (c.element.find(".vakata-context-hover").last().closest("li").first().find("ul").hide().find(".vakata-context-hover").removeClass("vakata-context-hover").end().end().children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
    							break;
    						case 38:
    							c.is_visible && (d = c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").prevAll("li:not(.vakata-context-separator)").first(), d.length || (d = c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").last()), d.addClass("vakata-context-hover").children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
    							break;
    						case 39:
    							c.is_visible && (c.element.find(".vakata-context-hover").last().children("ul").show().children("li:not(.vakata-context-separator)").removeClass("vakata-context-hover").first().addClass("vakata-context-hover").children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
    							break;
    						case 40:
    							c.is_visible && (d = c.element.find("ul:visible").addBack().last().children(".vakata-context-hover").removeClass("vakata-context-hover").nextAll("li:not(.vakata-context-separator)").first(), d.length || (d = c.element.find("ul:visible").addBack().last().children("li:not(.vakata-context-separator)").first()), d.addClass("vakata-context-hover").children("a").focus(), b.stopImmediatePropagation(), b.preventDefault());
    							break;
    						case 27:
    							(a.vakata.context.hide(), b.preventDefault());
    					}
    				}).on("keydown", function (a) {
    					a.preventDefault();
    					var b = c.element.find(".vakata-contextmenu-shortcut-" + a.which).parent();
    					b.parent().not(".vakata-context-disabled") && b.click();
    				}), a(i).on("mousedown.vakata.jstree", function (b) {
    					c.is_visible && !a.contains(c.element[0], b.target) && a.vakata.context.hide();
    				}).on("context_show.vakata.jstree", function (a, d) {
    					(c.element.find("li:has(ul)").children("a").addClass("vakata-context-parent"), b && c.element.addClass("vakata-context-rtl").css("direction", "rtl"), c.element.find("ul").hide().end());
    				}));
    			}));
    		})(a), a.jstree.defaults.dnd = {
    			copy: !0,
    			open_timeout: 500,
    			is_draggable: !0,
    			check_while_dragging: !0,
    			always_copy: !1,
    			inside_pos: 0,
    			drag_selection: !0,
    			touch: !0,
    			large_drop_target: !1,
    			large_drag_target: !1
    		}, a.jstree.plugins.dnd = function (b, c) {
    			this.bind = function () {
    				(c.bind.call(this), this.element.on(
    					"mousedown.jstree touchstart.jstree",
    					this.settings.dnd.large_drag_target
    					? ".jstree-node"
    					: ".jstree-anchor",
    					a.proxy(
    						function (b) {
    							if (this.settings.dnd.large_drag_target && a(b.target).closest(".jstree-node")[0] !== b.currentTarget) return !0;
    							if ("touchstart" === b.type && (!this.settings.dnd.touch || "selected" === this.settings.dnd.touch && !a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").hasClass("jstree-clicked"))) return !0;

    							var c = this.get_node(b.target),
    								d = this.is_selected(c) && this.settings.dnd.drag_selection
    								? this.get_top_selected().length
    								: 1,
    								e = d > 1
    								? d + " " + this.get_string("nodes")
    								: this.get_text(b.currentTarget);

    							return (this.settings.core.force_text && (e = a.vakata.html.escape(e)), c && c.id && c.id !== a.jstree.root && (1 === b.which || "touchstart" === b.type) && (this.settings.dnd.is_draggable === !0 || a.isFunction(this.settings.dnd.is_draggable) && this.settings.dnd.is_draggable.call(this, d > 1 ? this.get_top_selected(!0) : [c], b))
    							? (this.element.trigger("mousedown.jstree"), a.vakata.dnd.start(
    									b,
    									{
    										jstree: !0,
    										origin: this,
    										obj: this.get_node(c, !0),
    										nodes: d > 1 ? this.get_top_selected() : [c.id]
    									},
    									"<div id=\"jstree-dnd\" class=\"jstree-" + this.get_theme() + " jstree-" + this.get_theme() + "-" + this.get_theme_variant() + " " + (this.settings.core.themes.responsive
    									? " jstree-dnd-responsive"
    									: "") + "\"><i class=\"jstree-icon jstree-er\"></i>" + e + "<ins class=\"jstree-copy\" style=\"display:none;\">+</ins></div>"
    								))
    							: void 0);
    						},
    						this
    					)
    				));
    			};
    		}, a(function () {
    			var b = !1,
    				c = !1,
    				d = !1,
    				e = !1,
    				f = a("<div id=\"jstree-marker\">&#160;</div>").hide();

    			a(i).on("dnd_start.vakata.jstree", function (a, c) {
    				(b = !1, d = !1, c && c.data && c.data.jstree && f.appendTo("body"));
    			}).on("dnd_move.vakata.jstree", function (g, h) {
    				if ((e && clearTimeout(e), h && h.data && h.data.jstree && (!h.event.target.id || "jstree-marker" !== h.event.target.id))) {
    					d = h.event;

    					var i = a.jstree.reference(h.event.target),
    						j = !1,
    						k = !1,
    						l = !1,
    						n,
    						o,
    						p,
    						q,
    						r,
    						s,
    						t,
    						u,
    						v,
    						w,
    						x,
    						y,
    						z,
    						A;

    					if (i && i._data && i._data.dnd) if ((f.attr("class", "jstree-" + i.get_theme() + (i.settings.core.themes.responsive
    					? " jstree-dnd-responsive"
    					: "")), h.helper.children().attr("class", "jstree-" + i.get_theme() + " jstree-" + i.get_theme() + "-" + i.get_theme_variant() + " " + (i.settings.core.themes.responsive
    					? " jstree-dnd-responsive"
    					: "")).find(".jstree-copy").first()[h.data.origin && (h.data.origin.settings.dnd.always_copy || h.data.origin.settings.dnd.copy && (h.event.metaKey || h.event.ctrlKey))
    					? "show"
    					: "hide"](), h.event.target !== i.element[0] && h.event.target !== i.get_container_ul()[0] || 0 !== i.get_container_ul().children().length)) {
    						if ((j = i.settings.dnd.large_drop_target
    						? a(h.event.target).closest(".jstree-node").children(".jstree-anchor")
    						: a(h.event.target).closest(".jstree-anchor"), j && j.length && j.parent().is(".jstree-closed, .jstree-open, .jstree-leaf") && (k = j.offset(), l = h.event.pageY - k.top, p = j.outerHeight(), s = p / 3 > l
    						? ["b", "i", "a"]
    						: l > p - p / 3
    							? ["a", "i", "b"]
    							: l > p / 2 ? ["i", "a", "b"] : ["i", "b", "a"], a.each(s, function (d, g) {
    							switch (g) {
    								case "b":
    									(n = k.left - 6, o = k.top, q = i.get_parent(j), r = j.parent().index());
    									break;
    								case "i":
    									(z = i.settings.dnd.inside_pos, A = i.get_node(j.parent()), n = k.left - 2, o = k.top + p / 2 + 1, q = A.id, r = "first" === z
    									? 0
    									: "last" === z
    										? A.children.length
    										: Math.min(z, A.children.length));
    									break;
    								case "a":
    									(n = k.left - 6, o = k.top + p, q = i.get_parent(j), r = j.parent().index() + 1);
    							}

    							for ((t = !0, u = 0, v = h.data.nodes.length); v > u; u++) if ((w = h.data.origin && (h.data.origin.settings.dnd.always_copy || h.data.origin.settings.dnd.copy && (h.event.metaKey || h.event.ctrlKey))
    							? "copy_node"
    							: "move_node", x = r, "move_node" === w && "a" === g && h.data.origin && h.data.origin === i && q === i.get_parent(h.data.nodes[u]) && (y = i.get_node(q), x > a.inArray(h.data.nodes[u], y.children) && (x -= 1)), t = t && (i && i.settings && i.settings.dnd && i.settings.dnd.check_while_dragging === !1 || i.check(
    								w,
    								h.data.origin && h.data.origin !== i
    								? h.data.origin.get_node(h.data.nodes[u])
    								: h.data.nodes[u],
    								q,
    								x,
    								{
    									dnd: !0,
    									ref: i.get_node(j.parent()),
    									pos: g,
    									origin: h.data.origin,
    									is_multi: h.data.origin && h.data.origin !== i,
    									is_foreign: !h.data.origin
    								}
    							)), !t)) {
    								i && i.last_error && (c = i.last_error());
    								break;
    							}

    							return ("i" === g && j.parent().is(".jstree-closed") && i.settings.dnd.open_timeout && (e = setTimeout(
    								(function (a, b) {
    									return function () {
    										a.open_node(b);
    									};
    								})(i, j),
    								i.settings.dnd.open_timeout
    							)), t
    							? (b = {
    									ins: i,
    									par: q,
    									pos: "i" !== g || "last" !== z || 0 !== r || i.is_loaded(A)
    									? r
    									: "last"
    								}, f.css({ left: n + "px", top: o + "px" }).show(), h.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"), c = {}, s = !0, !1)
    							: void 0);
    						}), s === !0))) return;
    					} else {
    						for ((t = !0, u = 0, v = h.data.nodes.length); v > u; u++) if ((t = t && i.check(
    							h.data.origin && (h.data.origin.settings.dnd.always_copy || h.data.origin.settings.dnd.copy && (h.event.metaKey || h.event.ctrlKey))
    							? "copy_node"
    							: "move_node",
    							h.data.origin && h.data.origin !== i
    							? h.data.origin.get_node(h.data.nodes[u])
    							: h.data.nodes[u],
    							a.jstree.root,
    							"last",
    							{
    								dnd: !0,
    								ref: i.get_node(a.jstree.root),
    								pos: "i",
    								origin: h.data.origin,
    								is_multi: h.data.origin && h.data.origin !== i,
    								is_foreign: !h.data.origin
    							}
    						), !t)) break;

    						if (t) return (b = { ins: i, par: a.jstree.root, pos: "last" }, f.hide(), void h.helper.find(".jstree-icon").first().removeClass("jstree-er").addClass("jstree-ok"));
    					}

    					(b = !1, h.helper.find(".jstree-icon").removeClass("jstree-ok").addClass("jstree-er"), f.hide());
    				}
    			}).on("dnd_scroll.vakata.jstree", function (a, c) {
    				c && c.data && c.data.jstree && (f.hide(), b = !1, d = !1, c.helper.find(".jstree-icon").first().removeClass("jstree-ok").addClass("jstree-er"));
    			}).on("dnd_stop.vakata.jstree", function (g, h) {
    				if ((e && clearTimeout(e), h && h.data && h.data.jstree)) {
    					f.hide().detach();
    					var i, j, k = [];

    					if (b) {
    						for ((i = 0, j = h.data.nodes.length); j > i; i++) k[i] = h.data.origin
    						? h.data.origin.get_node(h.data.nodes[i])
    						: h.data.nodes[i];

    						b.ins[h.data.origin && (h.data.origin.settings.dnd.always_copy || h.data.origin.settings.dnd.copy && (h.event.metaKey || h.event.ctrlKey))
    						? "copy_node"
    						: "move_node"](k, b.par, b.pos, !1, !1, !1, h.data.origin);
    					} else (i = a(h.event.target).closest(".jstree"), i.length && c && c.error && "check" === c.error && (i = i.jstree(!0), i && i.settings.core.error.call(this, c)));

    					(d = !1, b = !1);
    				}
    			}).on("keyup.jstree keydown.jstree", function (b, c) {
    				(c = a.vakata.dnd._get(), c && c.data && c.data.jstree && (c.helper.find(".jstree-copy").first()[c.data.origin && (c.data.origin.settings.dnd.always_copy || c.data.origin.settings.dnd.copy && (b.metaKey || b.ctrlKey))
    				? "show"
    				: "hide"](), d && (d.metaKey = b.metaKey, d.ctrlKey = b.ctrlKey, a.vakata.dnd._trigger("move", d))));
    			});
    		}), (function (a) {
    			a.vakata.html = {
    				div: a("<div />"),
    				escape(b) {
    					return a.vakata.html.div.text(b).html();
    				},
    				strip(b) {
    					return a.vakata.html.div.empty().append(a.parseHTML(b)).text();
    				}
    			};

    			var b = {
    				element: !1,
    				target: !1,
    				is_down: !1,
    				is_drag: !1,
    				helper: !1,
    				helper_w: 0,
    				data: !1,
    				init_x: 0,
    				init_y: 0,
    				scroll_l: 0,
    				scroll_t: 0,
    				scroll_e: !1,
    				scroll_i: !1,
    				is_touch: !1
    			};

    			a.vakata.dnd = {
    				settings: {
    					scroll_speed: 10,
    					scroll_proximity: 20,
    					helper_left: 5,
    					helper_top: 10,
    					threshold: 5,
    					threshold_touch: 50
    				},
    				_trigger(b, c) {
    					var d = a.vakata.dnd._get();
    					(d.event = c, a(i).triggerHandler("dnd_" + b + ".vakata", d));
    				},
    				_get() {
    					return {
    						data: b.data,
    						element: b.element,
    						helper: b.helper
    					};
    				},
    				_clean() {
    					(b.helper && b.helper.remove(), b.scroll_i && (clearInterval(b.scroll_i), b.scroll_i = !1), b = {
    						element: !1,
    						target: !1,
    						is_down: !1,
    						is_drag: !1,
    						helper: !1,
    						helper_w: 0,
    						data: !1,
    						init_x: 0,
    						init_y: 0,
    						scroll_l: 0,
    						scroll_t: 0,
    						scroll_e: !1,
    						scroll_i: !1,
    						is_touch: !1
    					}, a(i).off("mousemove.vakata.jstree touchmove.vakata.jstree", a.vakata.dnd.drag), a(i).off("mouseup.vakata.jstree touchend.vakata.jstree", a.vakata.dnd.stop));
    				},
    				_scroll(c) {
    					if (!b.scroll_e || !b.scroll_l && !b.scroll_t) return (b.scroll_i && (clearInterval(b.scroll_i), b.scroll_i = !1), !1);
    					if (!b.scroll_i) return (b.scroll_i = setInterval(a.vakata.dnd._scroll, 100), !1);
    					if (c === !0) return !1;
    					var d = b.scroll_e.scrollTop(), e = b.scroll_e.scrollLeft();
    					(b.scroll_e.scrollTop(d + b.scroll_t * a.vakata.dnd.settings.scroll_speed), b.scroll_e.scrollLeft(e + b.scroll_l * a.vakata.dnd.settings.scroll_speed), (d !== b.scroll_e.scrollTop() || e !== b.scroll_e.scrollLeft()) && a.vakata.dnd._trigger("scroll", b.scroll_e));
    				},
    				start(c, d, e) {
    					("touchstart" === c.type && c.originalEvent && c.originalEvent.changedTouches && c.originalEvent.changedTouches[0] && (c.pageX = c.originalEvent.changedTouches[0].pageX, c.pageY = c.originalEvent.changedTouches[0].pageY, c.target = i.elementFromPoint(c.originalEvent.changedTouches[0].pageX - window.pageXOffset, c.originalEvent.changedTouches[0].pageY - window.pageYOffset)), b.is_drag && a.vakata.dnd.stop({}));

    					try {
    						(c.currentTarget.unselectable = "on", c.currentTarget.onselectstart = function () {
    							return !1;
    						}, c.currentTarget.style && (c.currentTarget.style.MozUserSelect = "none"));
    					} catch(f) {
    						
    					}

    					return (b.init_x = c.pageX, b.init_y = c.pageY, b.data = d, b.is_down = !0, b.element = c.currentTarget, b.target = c.target, b.is_touch = "touchstart" === c.type, e !== !1 && (b.helper = a("<div id='vakata-dnd'></div>").html(e).css({
    						display: "block",
    						margin: "0",
    						padding: "0",
    						position: "absolute",
    						top: "-2000px",
    						lineHeight: "16px",
    						zIndex: "10000"
    					})), a(i).on("mousemove.vakata.jstree touchmove.vakata.jstree", a.vakata.dnd.drag), a(i).on("mouseup.vakata.jstree touchend.vakata.jstree", a.vakata.dnd.stop), !1);
    				},
    				drag(c) {
    					if (("touchmove" === c.type && c.originalEvent && c.originalEvent.changedTouches && c.originalEvent.changedTouches[0] && (c.pageX = c.originalEvent.changedTouches[0].pageX, c.pageY = c.originalEvent.changedTouches[0].pageY, c.target = i.elementFromPoint(c.originalEvent.changedTouches[0].pageX - window.pageXOffset, c.originalEvent.changedTouches[0].pageY - window.pageYOffset)), b.is_down)) {
    						if (!b.is_drag) {
    							if (!(Math.abs(c.pageX - b.init_x) > (b.is_touch
    							? a.vakata.dnd.settings.threshold_touch
    							: a.vakata.dnd.settings.threshold) || Math.abs(c.pageY - b.init_y) > (b.is_touch
    							? a.vakata.dnd.settings.threshold_touch
    							: a.vakata.dnd.settings.threshold))) return;

    							(b.helper && (b.helper.appendTo("body"), b.helper_w = b.helper.outerWidth()), b.is_drag = !0, a.vakata.dnd._trigger("start", c));
    						}

    						var d = !1,
    							e = !1,
    							f = !1,
    							g = !1,
    							h = !1,
    							j = !1,
    							k = !1,
    							l = !1,
    							m = !1,
    							n = !1;

    						return (b.scroll_t = 0, b.scroll_l = 0, b.scroll_e = !1, a(a(c.target).parentsUntil("body").addBack().get().reverse()).filter(function () {
    							return (/^auto|scroll$/).test(a(this).css("overflow")) && (this.scrollHeight > this.offsetHeight || this.scrollWidth > this.offsetWidth);
    						}).each(function () {
    							var d = a(this), e = d.offset();

    							return (this.scrollHeight > this.offsetHeight && (e.top + d.height() - c.pageY < a.vakata.dnd.settings.scroll_proximity && (b.scroll_t = 1), c.pageY - e.top < a.vakata.dnd.settings.scroll_proximity && (b.scroll_t = -1)), this.scrollWidth > this.offsetWidth && (e.left + d.width() - c.pageX < a.vakata.dnd.settings.scroll_proximity && (b.scroll_l = 1), c.pageX - e.left < a.vakata.dnd.settings.scroll_proximity && (b.scroll_l = -1)), b.scroll_t || b.scroll_l
    							? (b.scroll_e = a(this), !1)
    							: void 0);
    						}), b.scroll_e || (d = a(i), e = a(window), f = d.height(), g = e.height(), h = d.width(), j = e.width(), k = d.scrollTop(), l = d.scrollLeft(), f > g && c.pageY - k < a.vakata.dnd.settings.scroll_proximity && (b.scroll_t = -1), f > g && g - (c.pageY - k) < a.vakata.dnd.settings.scroll_proximity && (b.scroll_t = 1), h > j && c.pageX - l < a.vakata.dnd.settings.scroll_proximity && (b.scroll_l = -1), h > j && j - (c.pageX - l) < a.vakata.dnd.settings.scroll_proximity && (b.scroll_l = 1), (b.scroll_t || b.scroll_l) && (b.scroll_e = d)), b.scroll_e && a.vakata.dnd._scroll(!0), b.helper && (m = parseInt(c.pageY + a.vakata.dnd.settings.helper_top, 10), n = parseInt(c.pageX + a.vakata.dnd.settings.helper_left, 10), f && m + 25 > f && (m = f - 50), h && n + b.helper_w > h && (n = h - (b.helper_w + 2)), b.helper.css({ left: n + "px", top: m + "px" })), a.vakata.dnd._trigger("move", c), !1);
    					}
    				},
    				stop(c) {
    					if (("touchend" === c.type && c.originalEvent && c.originalEvent.changedTouches && c.originalEvent.changedTouches[0] && (c.pageX = c.originalEvent.changedTouches[0].pageX, c.pageY = c.originalEvent.changedTouches[0].pageY, c.target = i.elementFromPoint(c.originalEvent.changedTouches[0].pageX - window.pageXOffset, c.originalEvent.changedTouches[0].pageY - window.pageYOffset)), b.is_drag)) a.vakata.dnd._trigger("stop", c); else if ("touchend" === c.type && c.target === b.target) {
    						var d = setTimeout(
    							function () {
    								a(c.target).click();
    							},
    							100
    						);

    						a(c.target).one("click", function () {
    							d && clearTimeout(d);
    						});
    					}

    					return (a.vakata.dnd._clean(), !1);
    				}
    			};
    		})(a), a.jstree.defaults.massload = null, a.jstree.plugins.massload = function (b, c) {
    			(this.init = function (a, b) {
    				(c.init.call(this, a, b), this._data.massload = {});
    			}, this._load_nodes = function (b, d, e) {
    				var f = this.settings.massload;

    				return e && !a.isEmptyObject(this._data.massload)
    				? c._load_nodes.call(this, b, d, e)
    				: a.isFunction(f)
    					? f.call(this, b, a.proxy(
    							function (a) {
    								if (a) for (var f in a) a.hasOwnProperty(f) && (this._data.massload[f] = a[f]);
    								c._load_nodes.call(this, b, d, e);
    							},
    							this
    						))
    					: "object" == typeof f && f && f.url
    						? (f = a.extend(!0, {}, f), a.isFunction(f.url) && (f.url = f.url.call(this, b)), a.isFunction(f.data) && (f.data = f.data.call(this, b)), a.ajax(f).done(a.proxy(
    								function (a, f, g) {
    									if (a) for (var h in a) a.hasOwnProperty(h) && (this._data.massload[h] = a[h]);
    									c._load_nodes.call(this, b, d, e);
    								},
    								this
    							)).fail(a.proxy(
    								function (a) {
    									c._load_nodes.call(this, b, d, e);
    								},
    								this
    							)))
    						: c._load_nodes.call(this, b, d, e);
    			}, this._load_node = function (b, d) {
    				var e = this._data.massload[b.id];

    				return e
    				? this["string" == typeof e
    					? "_append_html_data"
    					: "_append_json_data"](
    						b,
    						"string" == typeof e
    						? a(a.parseHTML(e)).filter(function () {
    								return 3 !== this.nodeType;
    							})
    						: e,
    						function (a) {
    							(d.call(this, a), delete this._data.massload[b.id]);
    						}
    					)
    				: c._load_node.call(this, b, d);
    			});
    		}, a.jstree.defaults.search = {
    			ajax: !1,
    			fuzzy: !1,
    			case_sensitive: !1,
    			show_only_matches: !1,
    			show_only_matches_children: !1,
    			close_opened_onclear: !0,
    			search_leaves_only: !1,
    			search_callback: !1
    		}, a.jstree.plugins.search = function (c, d) {
    			(this.bind = function () {
    				(d.bind.call(this), this._data.search.str = "", this._data.search.dom = a(), this._data.search.res = [], this._data.search.opn = [], this._data.search.som = !1, this._data.search.smc = !1, this._data.search.hdn = [], this.element.on("search.jstree", a.proxy(
    					function (b, c) {
    						if (this._data.search.som && c.res.length) {
    							var d = this._model.data, e, f, g = [];
    							for ((e = 0, f = c.res.length); f > e; e++) d[c.res[e]] && !d[c.res[e]].state.hidden && (g.push(c.res[e]), g = g.concat(d[c.res[e]].parents), this._data.search.smc && (g = g.concat(d[c.res[e]].children_d)));
    							(g = a.vakata.array_remove_item(a.vakata.array_unique(g), a.jstree.root), this._data.search.hdn = this.hide_all(!0), this.show_node(g));
    						}
    					},
    					this
    				)).on("clear_search.jstree", a.proxy(
    					function (a, b) {
    						this._data.search.som && b.res.length && this.show_node(this._data.search.hdn);
    					},
    					this
    				)));
    			}, this.search = function (c, d, e, f, g, h) {
    				if (c === !1 || "" === a.trim(c.toString())) return this.clear_search();
    				(f = this.get_node(f), f = f && f.id ? f.id : null, c = c.toString());

    				var i = this.settings.search,
    					j = i.ajax ? i.ajax : !1,
    					k = this._model.data,
    					l = null,
    					m = [],
    					n = [],
    					o,
    					p;

    				if ((this._data.search.res.length && !g && this.clear_search(), e === b && (e = i.show_only_matches), h === b && (h = i.show_only_matches_children), !d && j !== !1)) return a.isFunction(j)
    				? j.call(
    						this,
    						c,
    						a.proxy(
    							function (b) {
    								(b && b.d && (b = b.d), this._load_nodes(
    									a.isArray(b) ? a.vakata.array_unique(b) : [],
    									function () {
    										this.search(c, !0, e, f, g);
    									},
    									!0
    								));
    							},
    							this
    						),
    						f
    					)
    				: (j = a.extend({}, j), j.data || (j.data = {}), j.data.str = c, f && (j.data.inside = f), a.ajax(j).fail(a.proxy(
    						function () {
    							(this._data.core.last_error = {
    								error: "ajax",
    								plugin: "search",
    								id: "search_01",
    								reason: "Could not load search parents",
    								data: JSON.stringify(j)
    							}, this.settings.core.error.call(this, this._data.core.last_error));
    						},
    						this
    					)).done(a.proxy(
    						function (b) {
    							(b && b.d && (b = b.d), this._load_nodes(
    								a.isArray(b) ? a.vakata.array_unique(b) : [],
    								function () {
    									this.search(c, !0, e, f, g);
    								},
    								!0
    							));
    						},
    						this
    					)));

    				if ((g || (this._data.search.str = c, this._data.search.dom = a(), this._data.search.res = [], this._data.search.opn = [], this._data.search.som = e, this._data.search.smc = h), l = new a.vakata.search(c,
    				!0,
    				{
    						caseSensitive: i.case_sensitive,
    						fuzzy: i.fuzzy
    					}), a.each(k[f ? f : a.jstree.root].children_d, function (a, b) {
    					var d = k[b];
    					d.text && (!i.search_leaves_only || d.state.loaded && 0 === d.children.length) && (i.search_callback && i.search_callback.call(this, c, d) || !i.search_callback && l.search(d.text).isMatch) && (m.push(b), n = n.concat(d.parents));
    				}), m.length)) {
    					for ((n = a.vakata.array_unique(n), o = 0, p = n.length); p > o; o++) n[o] !== a.jstree.root && k[n[o]] && this.open_node(n[o], null, 0) === !0 && this._data.search.opn.push(n[o]);

    					(g
    					? (this._data.search.dom = this._data.search.dom.add(a(this.element[0].querySelectorAll("#" + a.map(m, function (b) {
    							return -1 !== ("0123456789").indexOf(b[0])
    							? "\\3" + b[0] + " " + b.substr(1).replace(a.jstree.idregex, "\\$&")
    							: b.replace(a.jstree.idregex, "\\$&");
    						}).join(", #")))), this._data.search.res = a.vakata.array_unique(this._data.search.res.concat(m)))
    					: (this._data.search.dom = a(this.element[0].querySelectorAll("#" + a.map(m, function (b) {
    							return -1 !== ("0123456789").indexOf(b[0])
    							? "\\3" + b[0] + " " + b.substr(1).replace(a.jstree.idregex, "\\$&")
    							: b.replace(a.jstree.idregex, "\\$&");
    						}).join(", #"))), this._data.search.res = m), this._data.search.dom.children(".jstree-anchor").addClass("jstree-search"));
    				}

    				this.trigger("search", {
    					nodes: this._data.search.dom,
    					str: c,
    					res: this._data.search.res,
    					show_only_matches: e
    				});
    			}, this.clear_search = function () {
    				(this.settings.search.close_opened_onclear && this.close_node(this._data.search.opn, 0), this.trigger("clear_search", {
    					nodes: this._data.search.dom,
    					str: this._data.search.str,
    					res: this._data.search.res
    				}), this._data.search.res.length && (this._data.search.dom = a(this.element[0].querySelectorAll("#" + a.map(this._data.search.res, function (b) {
    					return -1 !== ("0123456789").indexOf(b[0])
    					? "\\3" + b[0] + " " + b.substr(1).replace(a.jstree.idregex, "\\$&")
    					: b.replace(a.jstree.idregex, "\\$&");
    				}).join(", #"))), this._data.search.dom.children(".jstree-anchor").removeClass("jstree-search")), this._data.search.str = "", this._data.search.res = [], this._data.search.opn = [], this._data.search.dom = a());
    			}, this.redraw_node = function (b, c, e, f) {
    				if ((b = d.redraw_node.apply(this, arguments), b && -1 !== a.inArray(b.id, this._data.search.res))) {
    					var g, h, i = null;

    					for ((g = 0, h = b.childNodes.length); h > g; g++) if (b.childNodes[g] && b.childNodes[g].className && -1 !== b.childNodes[g].className.indexOf("jstree-anchor")) {
    						i = b.childNodes[g];
    						break;
    					}

    					i && (i.className += " jstree-search");
    				}

    				return b;
    			});
    		}, (function (a) {
    			(a.vakata.search = function (b, c, d) {
    				(d = d || {}, d = a.extend({}, a.vakata.search.defaults, d), d.fuzzy !== !1 && (d.fuzzy = !0), b = d.caseSensitive ? b : b.toLowerCase());

    				var e = d.location,
    					f = d.distance,
    					g = d.threshold,
    					h = b.length,
    					i,
    					j,
    					k,
    					l;

    				return (h > 32 && (d.fuzzy = !1), d.fuzzy && (i = 1 << h - 1, j = (function () {
    					var a = {}, c = 0;
    					for (c = 0; h > c; c++) a[b.charAt(c)] = 0;
    					for (c = 0; h > c; c++) a[b.charAt(c)] |= 1 << h - c - 1;
    					return a;
    				})(), k = function (a, b) {
    					var c = a / h, d = Math.abs(e - b);
    					return f ? c + d / f : d ? 1 : c;
    				}), l = function (a) {
    					if ((a = d.caseSensitive ? a : a.toLowerCase(), b === a || -1 !== a.indexOf(b))) return { isMatch: !0, score: 0 };
    					if (!d.fuzzy) return { isMatch: !1, score: 1 };

    					var c,
    						f,
    						l = a.length,
    						m = g,
    						n = a.indexOf(b, e),
    						o,
    						p,
    						q = h + l,
    						r,
    						s,
    						t,
    						u,
    						v,
    						w = 1;

    					for ((-1 !== n && (m = Math.min(k(0, n), m), n = a.lastIndexOf(b, e + h), -1 !== n && (m = Math.min(k(0, n), m))), n = -1, c = 0); h > c; c++) {
    						(o = 0, p = q);
    						while (p > o) (k(c, e + p) <= m ? o = p : q = p, p = Math.floor((q - o) / 2 + o));

    						for ((q = p, s = Math.max(1, e - p + 1), t = Math.min(e + p, l) + h, u = new Array(t + 2), u[t + 1] = (1 << c) - 1, f = t); f >= s; f--) if ((v = j[a.charAt(f - 1)], 0 === c
    						? u[f] = (u[f + 1] << 1 | 1) & v
    						: u[f] = (u[f + 1] << 1 | 1) & v | ((r[f + 1] | r[f]) << 1 | 1) | r[f + 1], u[f] & i && (w = k(c, f - 1), m >= w))) {
    							if ((m = w, n = f - 1, !(n > e))) break;
    							s = Math.max(1, 2 * e - n);
    						}

    						if (k(c + 1, e) > m) break;
    						r = u;
    					}

    					return { isMatch: n >= 0, score: w };
    				}, c === !0 ? { search: l } : l(c));
    			}, a.vakata.search.defaults = {
    				location: 0,
    				distance: 100,
    				threshold: 0.6,
    				fuzzy: !1,
    				caseSensitive: !1
    			});
    		})(a), a.jstree.defaults.sort = function (a, b) {
    			return this.get_text(a) > this.get_text(b) ? 1 : -1;
    		}, a.jstree.plugins.sort = function (b, c) {
    			(this.bind = function () {
    				(c.bind.call(this), this.element.on("model.jstree", a.proxy(
    					function (a, b) {
    						this.sort(b.parent, !0);
    					},
    					this
    				)).on("rename_node.jstree create_node.jstree", a.proxy(
    					function (a, b) {
    						(this.sort(b.parent || b.node.parent, !1), this.redraw_node(b.parent || b.node.parent, !0));
    					},
    					this
    				)).on("move_node.jstree copy_node.jstree", a.proxy(
    					function (a, b) {
    						(this.sort(b.parent, !1), this.redraw_node(b.parent, !0));
    					},
    					this
    				)));
    			}, this.sort = function (b, c) {
    				var d, e;
    				if ((b = this.get_node(b), b && b.children && b.children.length && (b.children.sort(a.proxy(this.settings.sort, this)), c))) for ((d = 0, e = b.children_d.length); e > d; d++) this.sort(b.children_d[d], !1);
    			});
    		});

    		var n = !1;

    		(a.jstree.defaults.state = {
    			key: "jstree",
    			events: "changed.jstree open_node.jstree close_node.jstree check_node.jstree uncheck_node.jstree",
    			ttl: !1,
    			filter: !1
    		}, a.jstree.plugins.state = function (b, c) {
    			(this.bind = function () {
    				c.bind.call(this);

    				var b = a.proxy(
    					function () {
    						(this.element.on(this.settings.state.events, a.proxy(
    							function () {
    								(n && clearTimeout(n), n = setTimeout(
    									a.proxy(
    										function () {
    											this.save_state();
    										},
    										this
    									),
    									100
    								));
    							},
    							this
    						)), this.trigger("state_ready"));
    					},
    					this
    				);

    				this.element.on("ready.jstree", a.proxy(
    					function (a, c) {
    						(this.element.one("restore_state.jstree", b), this.restore_state() || b());
    					},
    					this
    				));
    			}, this.save_state = function () {
    				var b = {
    					state: this.get_state(),
    					ttl: this.settings.state.ttl,
    					sec: +new Date()
    				};

    				a.vakata.storage.set(this.settings.state.key, JSON.stringify(b));
    			}, this.restore_state = function () {
    				var b = a.vakata.storage.get(this.settings.state.key);

    				if (b) try {
    					b = JSON.parse(b);
    				} catch(c) {
    					return !1;
    				}

    				return b && b.ttl && b.sec && +new Date() - b.sec > b.ttl
    				? !1
    				: (b && b.state && (b = b.state), b && a.isFunction(this.settings.state.filter) && (b = this.settings.state.filter.call(this, b)), b
    					? (this.element.one("set_state.jstree", function (c, d) {
    							d.instance.trigger("restore_state", { state: a.extend(!0, {}, b) });
    						}), this.set_state(b), !0)
    					: !1);
    			}, this.clear_state = function () {
    				return a.vakata.storage.del(this.settings.state.key);
    			});
    		}, (function (a, b) {
    			a.vakata.storage = {
    				set(a, b) {
    					return window.localStorage.setItem(a, b);
    				},
    				get(a) {
    					return window.localStorage.getItem(a);
    				},
    				del(a) {
    					return window.localStorage.removeItem(a);
    				}
    			};
    		})(a), a.jstree.defaults.types = { "default": {} }, a.jstree.defaults.types[a.jstree.root] = {}, a.jstree.plugins.types = function (c, d) {
    			(this.init = function (c, e) {
    				var f, g;
    				if (e && e.types && e.types["default"]) for (f in e.types) if ("default" !== f && f !== a.jstree.root && e.types.hasOwnProperty(f)) for (g in e.types["default"]) e.types["default"].hasOwnProperty(g) && e.types[f][g] === b && (e.types[f][g] = e.types["default"][g]);
    				(d.init.call(this, c, e), this._model.data[a.jstree.root].type = a.jstree.root);
    			}, this.refresh = function (b, c) {
    				(d.refresh.call(this, b, c), this._model.data[a.jstree.root].type = a.jstree.root);
    			}, this.bind = function () {
    				(this.element.on("model.jstree", a.proxy(
    					function (c, d) {
    						var e = this._model.data,
    							f = d.nodes,
    							g = this.settings.types,
    							h,
    							i,
    							j = "default";

    						for ((h = 0, i = f.length); i > h; h++) (j = "default", e[f[h]].original && e[f[h]].original.type && g[e[f[h]].original.type] && (j = e[f[h]].original.type), e[f[h]].data && e[f[h]].data.jstree && e[f[h]].data.jstree.type && g[e[f[h]].data.jstree.type] && (j = e[f[h]].data.jstree.type), e[f[h]].type = j, e[f[h]].icon === !0 && g[j].icon !== b && (e[f[h]].icon = g[j].icon));
    						e[a.jstree.root].type = a.jstree.root;
    					},
    					this
    				)), d.bind.call(this));
    			}, this.get_json = function (b, c, e) {
    				var f,
    					g,
    					h = this._model.data,
    					i = c ? a.extend(!0, {}, c, { no_id: !1 }) : {},
    					j = d.get_json.call(this, b, i, e);

    				if (j === !1) return !1;

    				if (a.isArray(j)) for ((f = 0, g = j.length); g > f; f++) (j[f].type = j[f].id && h[j[f].id] && h[j[f].id].type
    				? h[j[f].id].type
    				: "default", c && c.no_id && (delete j[f].id, j[f].li_attr && j[f].li_attr.id && delete j[f].li_attr.id, j[f].a_attr && j[f].a_attr.id && delete j[f].a_attr.id)); else (j.type = j.id && h[j.id] && h[j.id].type
    				? h[j.id].type
    				: "default", c && c.no_id && (j = this._delete_ids(j)));

    				return j;
    			}, this._delete_ids = function (b) {
    				if (a.isArray(b)) {
    					for (var c = 0, d = b.length; d > c; c++) b[c] = this._delete_ids(b[c]);
    					return b;
    				}

    				return (delete b.id, b.li_attr && b.li_attr.id && delete b.li_attr.id, b.a_attr && b.a_attr.id && delete b.a_attr.id, b.children && a.isArray(b.children) && (b.children = this._delete_ids(b.children)), b);
    			}, this.check = function (c, e, f, g, h) {
    				if (d.check.call(this, c, e, f, g, h) === !1) return !1;
    				(e = e && e.id ? e : this.get_node(e), f = f && f.id ? f : this.get_node(f));

    				var i = e && e.id
    					? h && h.origin ? h.origin : a.jstree.reference(e.id)
    					: null,
    					j,
    					k,
    					l,
    					m;

    				switch ((i = i && i._model && i._model.data ? i._model.data : null, c)) {
    					case "create_node":
    					case "move_node":
    					case "copy_node":
    						if ("move_node" !== c || -1 === a.inArray(e.id, f.children)) {
    							if ((j = this.get_rules(f), j.max_children !== b && -1 !== j.max_children && j.max_children === f.children.length)) return (this._data.core.last_error = {
    								error: "check",
    								plugin: "types",
    								id: "types_01",
    								reason: "max_children prevents function: " + c,
    								data: JSON.stringify({
    									chk: c,
    									pos: g,
    									obj: e && e.id ? e.id : !1,
    									par: f && f.id ? f.id : !1
    								})
    							}, !1);

    							if (j.valid_children !== b && -1 !== j.valid_children && -1 === a.inArray(e.type || "default", j.valid_children)) return (this._data.core.last_error = {
    								error: "check",
    								plugin: "types",
    								id: "types_02",
    								reason: "valid_children prevents function: " + c,
    								data: JSON.stringify({
    									chk: c,
    									pos: g,
    									obj: e && e.id ? e.id : !1,
    									par: f && f.id ? f.id : !1
    								})
    							}, !1);

    							if (i && e.children_d && e.parents) {
    								for ((k = 0, l = 0, m = e.children_d.length); m > l; l++) k = Math.max(k, i[e.children_d[l]].parents.length);
    								k = k - e.parents.length + 1;
    							}

    							(0 >= k || k === b) && (k = 1);

    							do {
    								if (j.max_depth !== b && -1 !== j.max_depth && j.max_depth < k) return (this._data.core.last_error = {
    									error: "check",
    									plugin: "types",
    									id: "types_03",
    									reason: "max_depth prevents function: " + c,
    									data: JSON.stringify({
    										chk: c,
    										pos: g,
    										obj: e && e.id ? e.id : !1,
    										par: f && f.id ? f.id : !1
    									})
    								}, !1);

    								(f = this.get_node(f.parent), j = this.get_rules(f), k++);
    							} while (f);
    						}
    				}

    				return !0;
    			}, this.get_rules = function (a) {
    				if ((a = this.get_node(a), !a)) return !1;
    				var c = this.get_type(a, !0);
    				return (c.max_depth === b && (c.max_depth = -1), c.max_children === b && (c.max_children = -1), c.valid_children === b && (c.valid_children = -1), c);
    			}, this.get_type = function (b, c) {
    				return (b = this.get_node(b), b
    				? c
    					? a.extend({ type: b.type }, this.settings.types[b.type])
    					: b.type
    				: !1);
    			}, this.set_type = function (c, d) {
    				var e, f, g, h, i;

    				if (a.isArray(c)) {
    					for ((c = c.slice(), f = 0, g = c.length); g > f; f++) this.set_type(c[f], d);
    					return !0;
    				}

    				return (e = this.settings.types, c = this.get_node(c), e[d] && c
    				? (h = c.type, i = this.get_icon(c), c.type = d, (i === !0 || e[h] && e[h].icon !== b && i === e[h].icon) && this.set_icon(c, e[d].icon !== b ? e[d].icon : !0), !0)
    				: !1);
    			});
    		}, a.jstree.defaults.unique = {
    			case_sensitive: !1,
    			duplicate(a, b) {
    				return a + " (" + b + ")";
    			}
    		}, a.jstree.plugins.unique = function (c, d) {
    			(this.check = function (b, c, e, f, g) {
    				if (d.check.call(this, b, c, e, f, g) === !1) return !1;
    				if ((c = c && c.id ? c : this.get_node(c), e = e && e.id ? e : this.get_node(e), !e || !e.children)) return !0;

    				var h = "rename_node" === b ? f : c.text,
    					i = [],
    					j = this.settings.unique.case_sensitive,
    					k = this._model.data,
    					l,
    					m;

    				for ((l = 0, m = e.children.length); m > l; l++) i.push(j
    				? k[e.children[l]].text
    				: k[e.children[l]].text.toLowerCase());

    				switch ((j || (h = h.toLowerCase()), b)) {
    					case "delete_node":
    						return !0;
    					case "rename_node":
    						return (l = -1 === a.inArray(h, i) || c.text && c.text[j ? "toString" : "toLowerCase"]() === h, l || (this._data.core.last_error = {
    							error: "check",
    							plugin: "unique",
    							id: "unique_01",
    							reason: "Child with name " + h + " already exists. Preventing: " + b,
    							data: JSON.stringify({
    								chk: b,
    								pos: f,
    								obj: c && c.id ? c.id : !1,
    								par: e && e.id ? e.id : !1
    							})
    						}), l);
    					case "create_node":
    						return (l = -1 === a.inArray(h, i), l || (this._data.core.last_error = {
    							error: "check",
    							plugin: "unique",
    							id: "unique_04",
    							reason: "Child with name " + h + " already exists. Preventing: " + b,
    							data: JSON.stringify({
    								chk: b,
    								pos: f,
    								obj: c && c.id ? c.id : !1,
    								par: e && e.id ? e.id : !1
    							})
    						}), l);
    					case "copy_node":
    						return (l = -1 === a.inArray(h, i), l || (this._data.core.last_error = {
    							error: "check",
    							plugin: "unique",
    							id: "unique_02",
    							reason: "Child with name " + h + " already exists. Preventing: " + b,
    							data: JSON.stringify({
    								chk: b,
    								pos: f,
    								obj: c && c.id ? c.id : !1,
    								par: e && e.id ? e.id : !1
    							})
    						}), l);
    					case "move_node":
    						return (l = c.parent === e.id && (!g || !g.is_multi) || -1 === a.inArray(h, i), l || (this._data.core.last_error = {
    							error: "check",
    							plugin: "unique",
    							id: "unique_03",
    							reason: "Child with name " + h + " already exists. Preventing: " + b,
    							data: JSON.stringify({
    								chk: b,
    								pos: f,
    								obj: c && c.id ? c.id : !1,
    								par: e && e.id ? e.id : !1
    							})
    						}), l);
    				}

    				return !0;
    			}, this.create_node = function (c, e, f, g, h) {
    				if (!e || e.text === b) {
    					if ((null === c && (c = a.jstree.root), c = this.get_node(c), !c)) return d.create_node.call(this, c, e, f, g, h);
    					if ((f = f === b ? "last" : f, !f.toString().match(/^(before|after)$/) && !h && !this.is_loaded(c))) return d.create_node.call(this, c, e, f, g, h);
    					e || (e = {});

    					var i,
    						j,
    						k,
    						l,
    						m,
    						n = this._model.data,
    						o = this.settings.unique.case_sensitive,
    						p = this.settings.unique.duplicate;

    					for ((j = i = this.get_string("New node"), k = [], l = 0, m = c.children.length); m > l; l++) k.push(o
    					? n[c.children[l]].text
    					: n[c.children[l]].text.toLowerCase());

    					l = 1;
    					while (-1 !== a.inArray(o ? j : j.toLowerCase(), k)) j = p.call(this, i, ++l).toString();
    					e.text = j;
    				}

    				return d.create_node.call(this, c, e, f, g, h);
    			});
    		});

    		var o = i.createElement("DIV");

    		if ((o.setAttribute("unselectable", "on"), o.setAttribute("role", "presentation"), o.className = "jstree-wholerow", o.innerHTML = "&#160;", a.jstree.plugins.wholerow = function (b, c) {
    			(this.bind = function () {
    				(c.bind.call(this), this.element.on("ready.jstree set_state.jstree", a.proxy(
    					function () {
    						this.hide_dots();
    					},
    					this
    				)).on("init.jstree loading.jstree ready.jstree", a.proxy(
    					function () {
    						this.get_container_ul().addClass("jstree-wholerow-ul");
    					},
    					this
    				)).on("deselect_all.jstree", a.proxy(
    					function (a, b) {
    						this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");
    					},
    					this
    				)).on("changed.jstree", a.proxy(
    					function (a, b) {
    						this.element.find(".jstree-wholerow-clicked").removeClass("jstree-wholerow-clicked");
    						var c = !1, d, e;
    						for ((d = 0, e = b.selected.length); e > d; d++) (c = this.get_node(b.selected[d], !0), c && c.length && c.children(".jstree-wholerow").addClass("jstree-wholerow-clicked"));
    					},
    					this
    				)).on("open_node.jstree", a.proxy(
    					function (a, b) {
    						this.get_node(b.node, !0).find(".jstree-clicked").parent().children(".jstree-wholerow").addClass("jstree-wholerow-clicked");
    					},
    					this
    				)).on("hover_node.jstree dehover_node.jstree", a.proxy(
    					function (a, b) {
    						"hover_node" === a.type && this.is_disabled(b.node) || this.get_node(b.node, !0).children(".jstree-wholerow")["hover_node" === a.type ? "addClass" : "removeClass"]("jstree-wholerow-hovered");
    					},
    					this
    				)).on("contextmenu.jstree", ".jstree-wholerow", a.proxy(
    					function (b) {
    						b.preventDefault();

    						var c = a.Event("contextmenu", {
    							metaKey: b.metaKey,
    							ctrlKey: b.ctrlKey,
    							altKey: b.altKey,
    							shiftKey: b.shiftKey,
    							pageX: b.pageX,
    							pageY: b.pageY
    						});

    						a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c);
    					},
    					this
    				)).on("click.jstree", ".jstree-wholerow", function (b) {
    					b.stopImmediatePropagation();

    					var c = a.Event("click", {
    						metaKey: b.metaKey,
    						ctrlKey: b.ctrlKey,
    						altKey: b.altKey,
    						shiftKey: b.shiftKey
    					});

    					a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus();
    				}).on("click.jstree", ".jstree-leaf > .jstree-ocl", a.proxy(
    					function (b) {
    						b.stopImmediatePropagation();

    						var c = a.Event("click", {
    							metaKey: b.metaKey,
    							ctrlKey: b.ctrlKey,
    							altKey: b.altKey,
    							shiftKey: b.shiftKey
    						});

    						a(b.currentTarget).closest(".jstree-node").children(".jstree-anchor").first().trigger(c).focus();
    					},
    					this
    				)).on("mouseover.jstree", ".jstree-wholerow, .jstree-icon", a.proxy(
    					function (a) {
    						return (a.stopImmediatePropagation(), this.is_disabled(a.currentTarget) || this.hover_node(a.currentTarget), !1);
    					},
    					this
    				)).on("mouseleave.jstree", ".jstree-node", a.proxy(
    					function (a) {
    						this.dehover_node(a.currentTarget);
    					},
    					this
    				)));
    			}, this.teardown = function () {
    				(this.settings.wholerow && this.element.find(".jstree-wholerow").remove(), c.teardown.call(this));
    			}, this.redraw_node = function (b, d, e, f) {
    				if (b = c.redraw_node.apply(this, arguments)) {
    					var g = o.cloneNode(!0);
    					(-1 !== a.inArray(b.id, this._data.core.selected) && (g.className += " jstree-wholerow-clicked"), this._data.core.focused && this._data.core.focused === b.id && (g.className += " jstree-wholerow-hovered"), b.insertBefore(g, b.childNodes[0]));
    				}

    				return b;
    			});
    		}, i.registerElement && Object && Object.create)) {
    			var p = Object.create(HTMLElement.prototype);

    			p.createdCallback = function () {
    				var b = { core: {}, plugins: [] }, c;
    				for (c in a.jstree.plugins) a.jstree.plugins.hasOwnProperty(c) && this.attributes[c] && (b.plugins.push(c), this.getAttribute(c) && JSON.parse(this.getAttribute(c)) && (b[c] = JSON.parse(this.getAttribute(c))));
    				for (c in a.jstree.defaults.core) a.jstree.defaults.core.hasOwnProperty(c) && this.attributes[c] && (b.core[c] = JSON.parse(this.getAttribute(c)) || this.getAttribute(c));
    				a(this).jstree(b);
    			};

    			try {
    				i.registerElement("vakata-jstree", { prototype: p });
    			} catch(q) {
    				
    			}
    		}
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    	  path: basedir,
    	  exports: {},
    	  require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
        }
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var jquery = createCommonjsModule(function (module) {
    /*!
     * jQuery JavaScript Library v3.5.1
     * https://jquery.com/
     *
     * Includes Sizzle.js
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://jquery.org/license
     *
     * Date: 2020-05-04T22:49Z
     */
    ( function( global, factory ) {

    	{

    		// For CommonJS and CommonJS-like environments where a proper `window`
    		// is present, execute the factory and get jQuery.
    		// For environments that do not have a `window` with a `document`
    		// (such as Node.js), expose a factory as module.exports.
    		// This accentuates the need for the creation of a real `window`.
    		// e.g. var jQuery = require("jquery")(window);
    		// See ticket #14549 for more info.
    		module.exports = global.document ?
    			factory( global, true ) :
    			function( w ) {
    				if ( !w.document ) {
    					throw new Error( "jQuery requires a window with a document" );
    				}
    				return factory( w );
    			};
    	}

    // Pass this if window is not defined yet
    } )( typeof window !== "undefined" ? window : commonjsGlobal, function( window, noGlobal ) {

    var arr = [];

    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var flat = arr.flat ? function( array ) {
    	return arr.flat.call( array );
    } : function( array ) {
    	return arr.concat.apply( [], array );
    };


    var push = arr.push;

    var indexOf = arr.indexOf;

    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;

    var ObjectFunctionString = fnToString.call( Object );

    var support = {};

    var isFunction = function isFunction( obj ) {

          // Support: Chrome <=57, Firefox <=52
          // In some browsers, typeof returns "function" for HTML <object> elements
          // (i.e., `typeof document.createElement( "object" ) === "function"`).
          // We don't want to classify *any* DOM node as a function.
          return typeof obj === "function" && typeof obj.nodeType !== "number";
      };


    var isWindow = function isWindow( obj ) {
    		return obj != null && obj === obj.window;
    	};


    var document = window.document;



    	var preservedScriptAttributes = {
    		type: true,
    		src: true,
    		nonce: true,
    		noModule: true
    	};

    	function DOMEval( code, node, doc ) {
    		doc = doc || document;

    		var i, val,
    			script = doc.createElement( "script" );

    		script.text = code;
    		if ( node ) {
    			for ( i in preservedScriptAttributes ) {

    				// Support: Firefox 64+, Edge 18+
    				// Some browsers don't support the "nonce" property on scripts.
    				// On the other hand, just using `getAttribute` is not enough as
    				// the `nonce` attribute is reset to an empty string whenever it
    				// becomes browsing-context connected.
    				// See https://github.com/whatwg/html/issues/2369
    				// See https://html.spec.whatwg.org/#nonce-attributes
    				// The `node.getAttribute` check was added for the sake of
    				// `jQuery.globalEval` so that it can fake a nonce-containing node
    				// via an object.
    				val = node[ i ] || node.getAttribute && node.getAttribute( i );
    				if ( val ) {
    					script.setAttribute( i, val );
    				}
    			}
    		}
    		doc.head.appendChild( script ).parentNode.removeChild( script );
    	}


    function toType( obj ) {
    	if ( obj == null ) {
    		return obj + "";
    	}

    	// Support: Android <=2.3 only (functionish RegExp)
    	return typeof obj === "object" || typeof obj === "function" ?
    		class2type[ toString.call( obj ) ] || "object" :
    		typeof obj;
    }
    /* global Symbol */
    // Defining this global in .eslintrc.json would create a danger of using the global
    // unguarded in another place, it seems safer to define global only for this module



    var
    	version = "3.5.1",

    	// Define a local copy of jQuery
    	jQuery = function( selector, context ) {

    		// The jQuery object is actually just the init constructor 'enhanced'
    		// Need init if jQuery is called (just allow error to be thrown if not included)
    		return new jQuery.fn.init( selector, context );
    	};

    jQuery.fn = jQuery.prototype = {

    	// The current version of jQuery being used
    	jquery: version,

    	constructor: jQuery,

    	// The default length of a jQuery object is 0
    	length: 0,

    	toArray: function() {
    		return slice.call( this );
    	},

    	// Get the Nth element in the matched element set OR
    	// Get the whole matched element set as a clean array
    	get: function( num ) {

    		// Return all the elements in a clean array
    		if ( num == null ) {
    			return slice.call( this );
    		}

    		// Return just the one element from the set
    		return num < 0 ? this[ num + this.length ] : this[ num ];
    	},

    	// Take an array of elements and push it onto the stack
    	// (returning the new matched element set)
    	pushStack: function( elems ) {

    		// Build a new jQuery matched element set
    		var ret = jQuery.merge( this.constructor(), elems );

    		// Add the old object onto the stack (as a reference)
    		ret.prevObject = this;

    		// Return the newly-formed element set
    		return ret;
    	},

    	// Execute a callback for every element in the matched set.
    	each: function( callback ) {
    		return jQuery.each( this, callback );
    	},

    	map: function( callback ) {
    		return this.pushStack( jQuery.map( this, function( elem, i ) {
    			return callback.call( elem, i, elem );
    		} ) );
    	},

    	slice: function() {
    		return this.pushStack( slice.apply( this, arguments ) );
    	},

    	first: function() {
    		return this.eq( 0 );
    	},

    	last: function() {
    		return this.eq( -1 );
    	},

    	even: function() {
    		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    			return ( i + 1 ) % 2;
    		} ) );
    	},

    	odd: function() {
    		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
    			return i % 2;
    		} ) );
    	},

    	eq: function( i ) {
    		var len = this.length,
    			j = +i + ( i < 0 ? len : 0 );
    		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
    	},

    	end: function() {
    		return this.prevObject || this.constructor();
    	},

    	// For internal use only.
    	// Behaves like an Array's method, not like a jQuery method.
    	push: push,
    	sort: arr.sort,
    	splice: arr.splice
    };

    jQuery.extend = jQuery.fn.extend = function() {
    	var options, name, src, copy, copyIsArray, clone,
    		target = arguments[ 0 ] || {},
    		i = 1,
    		length = arguments.length,
    		deep = false;

    	// Handle a deep copy situation
    	if ( typeof target === "boolean" ) {
    		deep = target;

    		// Skip the boolean and the target
    		target = arguments[ i ] || {};
    		i++;
    	}

    	// Handle case when target is a string or something (possible in deep copy)
    	if ( typeof target !== "object" && !isFunction( target ) ) {
    		target = {};
    	}

    	// Extend jQuery itself if only one argument is passed
    	if ( i === length ) {
    		target = this;
    		i--;
    	}

    	for ( ; i < length; i++ ) {

    		// Only deal with non-null/undefined values
    		if ( ( options = arguments[ i ] ) != null ) {

    			// Extend the base object
    			for ( name in options ) {
    				copy = options[ name ];

    				// Prevent Object.prototype pollution
    				// Prevent never-ending loop
    				if ( name === "__proto__" || target === copy ) {
    					continue;
    				}

    				// Recurse if we're merging plain objects or arrays
    				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
    					( copyIsArray = Array.isArray( copy ) ) ) ) {
    					src = target[ name ];

    					// Ensure proper type for the source value
    					if ( copyIsArray && !Array.isArray( src ) ) {
    						clone = [];
    					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
    						clone = {};
    					} else {
    						clone = src;
    					}
    					copyIsArray = false;

    					// Never move original objects, clone them
    					target[ name ] = jQuery.extend( deep, clone, copy );

    				// Don't bring in undefined values
    				} else if ( copy !== undefined ) {
    					target[ name ] = copy;
    				}
    			}
    		}
    	}

    	// Return the modified object
    	return target;
    };

    jQuery.extend( {

    	// Unique for each copy of jQuery on the page
    	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

    	// Assume jQuery is ready without the ready module
    	isReady: true,

    	error: function( msg ) {
    		throw new Error( msg );
    	},

    	noop: function() {},

    	isPlainObject: function( obj ) {
    		var proto, Ctor;

    		// Detect obvious negatives
    		// Use toString instead of jQuery.type to catch host objects
    		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
    			return false;
    		}

    		proto = getProto( obj );

    		// Objects with no prototype (e.g., `Object.create( null )`) are plain
    		if ( !proto ) {
    			return true;
    		}

    		// Objects with prototype are plain iff they were constructed by a global Object function
    		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
    		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
    	},

    	isEmptyObject: function( obj ) {
    		var name;

    		for ( name in obj ) {
    			return false;
    		}
    		return true;
    	},

    	// Evaluates a script in a provided context; falls back to the global one
    	// if not specified.
    	globalEval: function( code, options, doc ) {
    		DOMEval( code, { nonce: options && options.nonce }, doc );
    	},

    	each: function( obj, callback ) {
    		var length, i = 0;

    		if ( isArrayLike( obj ) ) {
    			length = obj.length;
    			for ( ; i < length; i++ ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		} else {
    			for ( i in obj ) {
    				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
    					break;
    				}
    			}
    		}

    		return obj;
    	},

    	// results is for internal usage only
    	makeArray: function( arr, results ) {
    		var ret = results || [];

    		if ( arr != null ) {
    			if ( isArrayLike( Object( arr ) ) ) {
    				jQuery.merge( ret,
    					typeof arr === "string" ?
    					[ arr ] : arr
    				);
    			} else {
    				push.call( ret, arr );
    			}
    		}

    		return ret;
    	},

    	inArray: function( elem, arr, i ) {
    		return arr == null ? -1 : indexOf.call( arr, elem, i );
    	},

    	// Support: Android <=4.0 only, PhantomJS 1 only
    	// push.apply(_, arraylike) throws on ancient WebKit
    	merge: function( first, second ) {
    		var len = +second.length,
    			j = 0,
    			i = first.length;

    		for ( ; j < len; j++ ) {
    			first[ i++ ] = second[ j ];
    		}

    		first.length = i;

    		return first;
    	},

    	grep: function( elems, callback, invert ) {
    		var callbackInverse,
    			matches = [],
    			i = 0,
    			length = elems.length,
    			callbackExpect = !invert;

    		// Go through the array, only saving the items
    		// that pass the validator function
    		for ( ; i < length; i++ ) {
    			callbackInverse = !callback( elems[ i ], i );
    			if ( callbackInverse !== callbackExpect ) {
    				matches.push( elems[ i ] );
    			}
    		}

    		return matches;
    	},

    	// arg is for internal usage only
    	map: function( elems, callback, arg ) {
    		var length, value,
    			i = 0,
    			ret = [];

    		// Go through the array, translating each of the items to their new values
    		if ( isArrayLike( elems ) ) {
    			length = elems.length;
    			for ( ; i < length; i++ ) {
    				value = callback( elems[ i ], i, arg );

    				if ( value != null ) {
    					ret.push( value );
    				}
    			}

    		// Go through every key on the object,
    		} else {
    			for ( i in elems ) {
    				value = callback( elems[ i ], i, arg );

    				if ( value != null ) {
    					ret.push( value );
    				}
    			}
    		}

    		// Flatten any nested arrays
    		return flat( ret );
    	},

    	// A global GUID counter for objects
    	guid: 1,

    	// jQuery.support is not used in Core but other projects attach their
    	// properties to it so it needs to exist.
    	support: support
    } );

    if ( typeof Symbol === "function" ) {
    	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
    }

    // Populate the class2type map
    jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
    function( _i, name ) {
    	class2type[ "[object " + name + "]" ] = name.toLowerCase();
    } );

    function isArrayLike( obj ) {

    	// Support: real iOS 8.2 only (not reproducible in simulator)
    	// `in` check used to prevent JIT error (gh-2145)
    	// hasOwn isn't used here due to false negatives
    	// regarding Nodelist length in IE
    	var length = !!obj && "length" in obj && obj.length,
    		type = toType( obj );

    	if ( isFunction( obj ) || isWindow( obj ) ) {
    		return false;
    	}

    	return type === "array" || length === 0 ||
    		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
    }
    var Sizzle =
    /*!
     * Sizzle CSS Selector Engine v2.3.5
     * https://sizzlejs.com/
     *
     * Copyright JS Foundation and other contributors
     * Released under the MIT license
     * https://js.foundation/
     *
     * Date: 2020-03-14
     */
    ( function( window ) {
    var i,
    	support,
    	Expr,
    	getText,
    	isXML,
    	tokenize,
    	compile,
    	select,
    	outermostContext,
    	sortInput,
    	hasDuplicate,

    	// Local document vars
    	setDocument,
    	document,
    	docElem,
    	documentIsHTML,
    	rbuggyQSA,
    	rbuggyMatches,
    	matches,
    	contains,

    	// Instance-specific data
    	expando = "sizzle" + 1 * new Date(),
    	preferredDoc = window.document,
    	dirruns = 0,
    	done = 0,
    	classCache = createCache(),
    	tokenCache = createCache(),
    	compilerCache = createCache(),
    	nonnativeSelectorCache = createCache(),
    	sortOrder = function( a, b ) {
    		if ( a === b ) {
    			hasDuplicate = true;
    		}
    		return 0;
    	},

    	// Instance methods
    	hasOwn = ( {} ).hasOwnProperty,
    	arr = [],
    	pop = arr.pop,
    	pushNative = arr.push,
    	push = arr.push,
    	slice = arr.slice,

    	// Use a stripped-down indexOf as it's faster than native
    	// https://jsperf.com/thor-indexof-vs-for/5
    	indexOf = function( list, elem ) {
    		var i = 0,
    			len = list.length;
    		for ( ; i < len; i++ ) {
    			if ( list[ i ] === elem ) {
    				return i;
    			}
    		}
    		return -1;
    	},

    	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
    		"ismap|loop|multiple|open|readonly|required|scoped",

    	// Regular expressions

    	// http://www.w3.org/TR/css3-selectors/#whitespace
    	whitespace = "[\\x20\\t\\r\\n\\f]",

    	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
    	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
    		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

    	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

    		// Operator (capture 2)
    		"*([*^$|!~]?=)" + whitespace +

    		// "Attribute values must be CSS identifiers [capture 5]
    		// or strings [capture 3 or capture 4]"
    		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
    		whitespace + "*\\]",

    	pseudos = ":(" + identifier + ")(?:\\((" +

    		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
    		// 1. quoted (capture 3; capture 4 or capture 5)
    		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

    		// 2. simple (capture 6)
    		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

    		// 3. anything else (capture 2)
    		".*" +
    		")\\)|)",

    	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
    	rwhitespace = new RegExp( whitespace + "+", "g" ),
    	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
    		whitespace + "+$", "g" ),

    	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
    	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
    		"*" ),
    	rdescend = new RegExp( whitespace + "|>" ),

    	rpseudo = new RegExp( pseudos ),
    	ridentifier = new RegExp( "^" + identifier + "$" ),

    	matchExpr = {
    		"ID": new RegExp( "^#(" + identifier + ")" ),
    		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
    		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
    		"ATTR": new RegExp( "^" + attributes ),
    		"PSEUDO": new RegExp( "^" + pseudos ),
    		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
    			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
    			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
    		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

    		// For use in libraries implementing .is()
    		// We use this for POS matching in `select`
    		"needsContext": new RegExp( "^" + whitespace +
    			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
    			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
    	},

    	rhtml = /HTML$/i,
    	rinputs = /^(?:input|select|textarea|button)$/i,
    	rheader = /^h\d$/i,

    	rnative = /^[^{]+\{\s*\[native \w/,

    	// Easily-parseable/retrievable ID or TAG or CLASS selectors
    	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    	rsibling = /[+~]/,

    	// CSS escapes
    	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
    	funescape = function( escape, nonHex ) {
    		var high = "0x" + escape.slice( 1 ) - 0x10000;

    		return nonHex ?

    			// Strip the backslash prefix from a non-hex escape sequence
    			nonHex :

    			// Replace a hexadecimal escape sequence with the encoded Unicode code point
    			// Support: IE <=11+
    			// For values outside the Basic Multilingual Plane (BMP), manually construct a
    			// surrogate pair
    			high < 0 ?
    				String.fromCharCode( high + 0x10000 ) :
    				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    	},

    	// CSS string/identifier serialization
    	// https://drafts.csswg.org/cssom/#common-serializing-idioms
    	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
    	fcssescape = function( ch, asCodePoint ) {
    		if ( asCodePoint ) {

    			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
    			if ( ch === "\0" ) {
    				return "\uFFFD";
    			}

    			// Control characters and (dependent upon position) numbers get escaped as code points
    			return ch.slice( 0, -1 ) + "\\" +
    				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
    		}

    		// Other potentially-special ASCII characters get backslash-escaped
    		return "\\" + ch;
    	},

    	// Used for iframes
    	// See setDocument()
    	// Removing the function wrapper causes a "Permission Denied"
    	// error in IE
    	unloadHandler = function() {
    		setDocument();
    	},

    	inDisabledFieldset = addCombinator(
    		function( elem ) {
    			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
    		},
    		{ dir: "parentNode", next: "legend" }
    	);

    // Optimize for push.apply( _, NodeList )
    try {
    	push.apply(
    		( arr = slice.call( preferredDoc.childNodes ) ),
    		preferredDoc.childNodes
    	);

    	// Support: Android<4.0
    	// Detect silently failing push.apply
    	// eslint-disable-next-line no-unused-expressions
    	arr[ preferredDoc.childNodes.length ].nodeType;
    } catch ( e ) {
    	push = { apply: arr.length ?

    		// Leverage slice if possible
    		function( target, els ) {
    			pushNative.apply( target, slice.call( els ) );
    		} :

    		// Support: IE<9
    		// Otherwise append directly
    		function( target, els ) {
    			var j = target.length,
    				i = 0;

    			// Can't trust NodeList.length
    			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
    			target.length = j - 1;
    		}
    	};
    }

    function Sizzle( selector, context, results, seed ) {
    	var m, i, elem, nid, match, groups, newSelector,
    		newContext = context && context.ownerDocument,

    		// nodeType defaults to 9, since context defaults to document
    		nodeType = context ? context.nodeType : 9;

    	results = results || [];

    	// Return early from calls with invalid selector or context
    	if ( typeof selector !== "string" || !selector ||
    		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

    		return results;
    	}

    	// Try to shortcut find operations (as opposed to filters) in HTML documents
    	if ( !seed ) {
    		setDocument( context );
    		context = context || document;

    		if ( documentIsHTML ) {

    			// If the selector is sufficiently simple, try using a "get*By*" DOM method
    			// (excepting DocumentFragment context, where the methods don't exist)
    			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

    				// ID selector
    				if ( ( m = match[ 1 ] ) ) {

    					// Document context
    					if ( nodeType === 9 ) {
    						if ( ( elem = context.getElementById( m ) ) ) {

    							// Support: IE, Opera, Webkit
    							// TODO: identify versions
    							// getElementById can match elements by name instead of ID
    							if ( elem.id === m ) {
    								results.push( elem );
    								return results;
    							}
    						} else {
    							return results;
    						}

    					// Element context
    					} else {

    						// Support: IE, Opera, Webkit
    						// TODO: identify versions
    						// getElementById can match elements by name instead of ID
    						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
    							contains( context, elem ) &&
    							elem.id === m ) {

    							results.push( elem );
    							return results;
    						}
    					}

    				// Type selector
    				} else if ( match[ 2 ] ) {
    					push.apply( results, context.getElementsByTagName( selector ) );
    					return results;

    				// Class selector
    				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
    					context.getElementsByClassName ) {

    					push.apply( results, context.getElementsByClassName( m ) );
    					return results;
    				}
    			}

    			// Take advantage of querySelectorAll
    			if ( support.qsa &&
    				!nonnativeSelectorCache[ selector + " " ] &&
    				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

    				// Support: IE 8 only
    				// Exclude object elements
    				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

    				newSelector = selector;
    				newContext = context;

    				// qSA considers elements outside a scoping root when evaluating child or
    				// descendant combinators, which is not what we want.
    				// In such cases, we work around the behavior by prefixing every selector in the
    				// list with an ID selector referencing the scope context.
    				// The technique has to be used as well when a leading combinator is used
    				// as such selectors are not recognized by querySelectorAll.
    				// Thanks to Andrew Dupont for this technique.
    				if ( nodeType === 1 &&
    					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

    					// Expand context for sibling selectors
    					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
    						context;

    					// We can use :scope instead of the ID hack if the browser
    					// supports it & if we're not changing the context.
    					if ( newContext !== context || !support.scope ) {

    						// Capture the context ID, setting it first if necessary
    						if ( ( nid = context.getAttribute( "id" ) ) ) {
    							nid = nid.replace( rcssescape, fcssescape );
    						} else {
    							context.setAttribute( "id", ( nid = expando ) );
    						}
    					}

    					// Prefix every selector in the list
    					groups = tokenize( selector );
    					i = groups.length;
    					while ( i-- ) {
    						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
    							toSelector( groups[ i ] );
    					}
    					newSelector = groups.join( "," );
    				}

    				try {
    					push.apply( results,
    						newContext.querySelectorAll( newSelector )
    					);
    					return results;
    				} catch ( qsaError ) {
    					nonnativeSelectorCache( selector, true );
    				} finally {
    					if ( nid === expando ) {
    						context.removeAttribute( "id" );
    					}
    				}
    			}
    		}
    	}

    	// All others
    	return select( selector.replace( rtrim, "$1" ), context, results, seed );
    }

    /**
     * Create key-value caches of limited size
     * @returns {function(string, object)} Returns the Object data after storing it on itself with
     *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
     *	deleting the oldest entry
     */
    function createCache() {
    	var keys = [];

    	function cache( key, value ) {

    		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
    		if ( keys.push( key + " " ) > Expr.cacheLength ) {

    			// Only keep the most recent entries
    			delete cache[ keys.shift() ];
    		}
    		return ( cache[ key + " " ] = value );
    	}
    	return cache;
    }

    /**
     * Mark a function for special use by Sizzle
     * @param {Function} fn The function to mark
     */
    function markFunction( fn ) {
    	fn[ expando ] = true;
    	return fn;
    }

    /**
     * Support testing using an element
     * @param {Function} fn Passed the created element and returns a boolean result
     */
    function assert( fn ) {
    	var el = document.createElement( "fieldset" );

    	try {
    		return !!fn( el );
    	} catch ( e ) {
    		return false;
    	} finally {

    		// Remove from its parent by default
    		if ( el.parentNode ) {
    			el.parentNode.removeChild( el );
    		}

    		// release memory in IE
    		el = null;
    	}
    }

    /**
     * Adds the same handler for all of the specified attrs
     * @param {String} attrs Pipe-separated list of attributes
     * @param {Function} handler The method that will be applied
     */
    function addHandle( attrs, handler ) {
    	var arr = attrs.split( "|" ),
    		i = arr.length;

    	while ( i-- ) {
    		Expr.attrHandle[ arr[ i ] ] = handler;
    	}
    }

    /**
     * Checks document order of two siblings
     * @param {Element} a
     * @param {Element} b
     * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
     */
    function siblingCheck( a, b ) {
    	var cur = b && a,
    		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
    			a.sourceIndex - b.sourceIndex;

    	// Use IE sourceIndex if available on both nodes
    	if ( diff ) {
    		return diff;
    	}

    	// Check if b follows a
    	if ( cur ) {
    		while ( ( cur = cur.nextSibling ) ) {
    			if ( cur === b ) {
    				return -1;
    			}
    		}
    	}

    	return a ? 1 : -1;
    }

    /**
     * Returns a function to use in pseudos for input types
     * @param {String} type
     */
    function createInputPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return name === "input" && elem.type === type;
    	};
    }

    /**
     * Returns a function to use in pseudos for buttons
     * @param {String} type
     */
    function createButtonPseudo( type ) {
    	return function( elem ) {
    		var name = elem.nodeName.toLowerCase();
    		return ( name === "input" || name === "button" ) && elem.type === type;
    	};
    }

    /**
     * Returns a function to use in pseudos for :enabled/:disabled
     * @param {Boolean} disabled true for :disabled; false for :enabled
     */
    function createDisabledPseudo( disabled ) {

    	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
    	return function( elem ) {

    		// Only certain elements can match :enabled or :disabled
    		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
    		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
    		if ( "form" in elem ) {

    			// Check for inherited disabledness on relevant non-disabled elements:
    			// * listed form-associated elements in a disabled fieldset
    			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
    			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
    			// * option elements in a disabled optgroup
    			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
    			// All such elements have a "form" property.
    			if ( elem.parentNode && elem.disabled === false ) {

    				// Option elements defer to a parent optgroup if present
    				if ( "label" in elem ) {
    					if ( "label" in elem.parentNode ) {
    						return elem.parentNode.disabled === disabled;
    					} else {
    						return elem.disabled === disabled;
    					}
    				}

    				// Support: IE 6 - 11
    				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
    				return elem.isDisabled === disabled ||

    					// Where there is no isDisabled, check manually
    					/* jshint -W018 */
    					elem.isDisabled !== !disabled &&
    					inDisabledFieldset( elem ) === disabled;
    			}

    			return elem.disabled === disabled;

    		// Try to winnow out elements that can't be disabled before trusting the disabled property.
    		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
    		// even exist on them, let alone have a boolean value.
    		} else if ( "label" in elem ) {
    			return elem.disabled === disabled;
    		}

    		// Remaining elements are neither :enabled nor :disabled
    		return false;
    	};
    }

    /**
     * Returns a function to use in pseudos for positionals
     * @param {Function} fn
     */
    function createPositionalPseudo( fn ) {
    	return markFunction( function( argument ) {
    		argument = +argument;
    		return markFunction( function( seed, matches ) {
    			var j,
    				matchIndexes = fn( [], seed.length, argument ),
    				i = matchIndexes.length;

    			// Match elements found at the specified indexes
    			while ( i-- ) {
    				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
    					seed[ j ] = !( matches[ j ] = seed[ j ] );
    				}
    			}
    		} );
    	} );
    }

    /**
     * Checks a node for validity as a Sizzle context
     * @param {Element|Object=} context
     * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
     */
    function testContext( context ) {
    	return context && typeof context.getElementsByTagName !== "undefined" && context;
    }

    // Expose support vars for convenience
    support = Sizzle.support = {};

    /**
     * Detects XML nodes
     * @param {Element|Object} elem An element or a document
     * @returns {Boolean} True iff elem is a non-HTML XML node
     */
    isXML = Sizzle.isXML = function( elem ) {
    	var namespace = elem.namespaceURI,
    		docElem = ( elem.ownerDocument || elem ).documentElement;

    	// Support: IE <=8
    	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
    	// https://bugs.jquery.com/ticket/4833
    	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
    };

    /**
     * Sets document-related variables once based on the current document
     * @param {Element|Object} [doc] An element or document object to use to set the document
     * @returns {Object} Returns the current document
     */
    setDocument = Sizzle.setDocument = function( node ) {
    	var hasCompare, subWindow,
    		doc = node ? node.ownerDocument || node : preferredDoc;

    	// Return early if doc is invalid or already selected
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
    		return document;
    	}

    	// Update global variables
    	document = doc;
    	docElem = document.documentElement;
    	documentIsHTML = !isXML( document );

    	// Support: IE 9 - 11+, Edge 12 - 18+
    	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( preferredDoc != document &&
    		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

    		// Support: IE 11, Edge
    		if ( subWindow.addEventListener ) {
    			subWindow.addEventListener( "unload", unloadHandler, false );

    		// Support: IE 9 - 10 only
    		} else if ( subWindow.attachEvent ) {
    			subWindow.attachEvent( "onunload", unloadHandler );
    		}
    	}

    	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
    	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
    	// IE/Edge & older browsers don't support the :scope pseudo-class.
    	// Support: Safari 6.0 only
    	// Safari 6.0 supports :scope but it's an alias of :root there.
    	support.scope = assert( function( el ) {
    		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
    		return typeof el.querySelectorAll !== "undefined" &&
    			!el.querySelectorAll( ":scope fieldset div" ).length;
    	} );

    	/* Attributes
    	---------------------------------------------------------------------- */

    	// Support: IE<8
    	// Verify that getAttribute really returns attributes and not properties
    	// (excepting IE8 booleans)
    	support.attributes = assert( function( el ) {
    		el.className = "i";
    		return !el.getAttribute( "className" );
    	} );

    	/* getElement(s)By*
    	---------------------------------------------------------------------- */

    	// Check if getElementsByTagName("*") returns only elements
    	support.getElementsByTagName = assert( function( el ) {
    		el.appendChild( document.createComment( "" ) );
    		return !el.getElementsByTagName( "*" ).length;
    	} );

    	// Support: IE<9
    	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

    	// Support: IE<10
    	// Check if getElementById returns elements by name
    	// The broken getElementById methods don't pick up programmatically-set names,
    	// so use a roundabout getElementsByName test
    	support.getById = assert( function( el ) {
    		docElem.appendChild( el ).id = expando;
    		return !document.getElementsByName || !document.getElementsByName( expando ).length;
    	} );

    	// ID filter and find
    	if ( support.getById ) {
    		Expr.filter[ "ID" ] = function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				return elem.getAttribute( "id" ) === attrId;
    			};
    		};
    		Expr.find[ "ID" ] = function( id, context ) {
    			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    				var elem = context.getElementById( id );
    				return elem ? [ elem ] : [];
    			}
    		};
    	} else {
    		Expr.filter[ "ID" ] =  function( id ) {
    			var attrId = id.replace( runescape, funescape );
    			return function( elem ) {
    				var node = typeof elem.getAttributeNode !== "undefined" &&
    					elem.getAttributeNode( "id" );
    				return node && node.value === attrId;
    			};
    		};

    		// Support: IE 6 - 7 only
    		// getElementById is not reliable as a find shortcut
    		Expr.find[ "ID" ] = function( id, context ) {
    			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
    				var node, i, elems,
    					elem = context.getElementById( id );

    				if ( elem ) {

    					// Verify the id attribute
    					node = elem.getAttributeNode( "id" );
    					if ( node && node.value === id ) {
    						return [ elem ];
    					}

    					// Fall back on getElementsByName
    					elems = context.getElementsByName( id );
    					i = 0;
    					while ( ( elem = elems[ i++ ] ) ) {
    						node = elem.getAttributeNode( "id" );
    						if ( node && node.value === id ) {
    							return [ elem ];
    						}
    					}
    				}

    				return [];
    			}
    		};
    	}

    	// Tag
    	Expr.find[ "TAG" ] = support.getElementsByTagName ?
    		function( tag, context ) {
    			if ( typeof context.getElementsByTagName !== "undefined" ) {
    				return context.getElementsByTagName( tag );

    			// DocumentFragment nodes don't have gEBTN
    			} else if ( support.qsa ) {
    				return context.querySelectorAll( tag );
    			}
    		} :

    		function( tag, context ) {
    			var elem,
    				tmp = [],
    				i = 0,

    				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
    				results = context.getElementsByTagName( tag );

    			// Filter out possible comments
    			if ( tag === "*" ) {
    				while ( ( elem = results[ i++ ] ) ) {
    					if ( elem.nodeType === 1 ) {
    						tmp.push( elem );
    					}
    				}

    				return tmp;
    			}
    			return results;
    		};

    	// Class
    	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
    		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
    			return context.getElementsByClassName( className );
    		}
    	};

    	/* QSA/matchesSelector
    	---------------------------------------------------------------------- */

    	// QSA and matchesSelector support

    	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
    	rbuggyMatches = [];

    	// qSa(:focus) reports false when true (Chrome 21)
    	// We allow this because of a bug in IE8/9 that throws an error
    	// whenever `document.activeElement` is accessed on an iframe
    	// So, we allow :focus to pass through QSA all the time to avoid the IE error
    	// See https://bugs.jquery.com/ticket/13378
    	rbuggyQSA = [];

    	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

    		// Build QSA regex
    		// Regex strategy adopted from Diego Perini
    		assert( function( el ) {

    			var input;

    			// Select is set to empty string on purpose
    			// This is to test IE's treatment of not explicitly
    			// setting a boolean content attribute,
    			// since its presence should be enough
    			// https://bugs.jquery.com/ticket/12359
    			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
    				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
    				"<option selected=''></option></select>";

    			// Support: IE8, Opera 11-12.16
    			// Nothing should be selected when empty strings follow ^= or $= or *=
    			// The test attribute must be unknown in Opera but "safe" for WinRT
    			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
    			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
    				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
    			}

    			// Support: IE8
    			// Boolean attributes and "value" are not treated correctly
    			if ( !el.querySelectorAll( "[selected]" ).length ) {
    				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
    			}

    			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
    			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
    				rbuggyQSA.push( "~=" );
    			}

    			// Support: IE 11+, Edge 15 - 18+
    			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
    			// Adding a temporary attribute to the document before the selection works
    			// around the issue.
    			// Interestingly, IE 10 & older don't seem to have the issue.
    			input = document.createElement( "input" );
    			input.setAttribute( "name", "" );
    			el.appendChild( input );
    			if ( !el.querySelectorAll( "[name='']" ).length ) {
    				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
    					whitespace + "*(?:''|\"\")" );
    			}

    			// Webkit/Opera - :checked should return selected option elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			// IE8 throws error here and will not see later tests
    			if ( !el.querySelectorAll( ":checked" ).length ) {
    				rbuggyQSA.push( ":checked" );
    			}

    			// Support: Safari 8+, iOS 8+
    			// https://bugs.webkit.org/show_bug.cgi?id=136851
    			// In-page `selector#id sibling-combinator selector` fails
    			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
    				rbuggyQSA.push( ".#.+[+~]" );
    			}

    			// Support: Firefox <=3.6 - 5 only
    			// Old Firefox doesn't throw on a badly-escaped identifier.
    			el.querySelectorAll( "\\\f" );
    			rbuggyQSA.push( "[\\r\\n\\f]" );
    		} );

    		assert( function( el ) {
    			el.innerHTML = "<a href='' disabled='disabled'></a>" +
    				"<select disabled='disabled'><option/></select>";

    			// Support: Windows 8 Native Apps
    			// The type and name attributes are restricted during .innerHTML assignment
    			var input = document.createElement( "input" );
    			input.setAttribute( "type", "hidden" );
    			el.appendChild( input ).setAttribute( "name", "D" );

    			// Support: IE8
    			// Enforce case-sensitivity of name attribute
    			if ( el.querySelectorAll( "[name=d]" ).length ) {
    				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
    			}

    			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
    			// IE8 throws error here and will not see later tests
    			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
    				rbuggyQSA.push( ":enabled", ":disabled" );
    			}

    			// Support: IE9-11+
    			// IE's :disabled selector does not pick up the children of disabled fieldsets
    			docElem.appendChild( el ).disabled = true;
    			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
    				rbuggyQSA.push( ":enabled", ":disabled" );
    			}

    			// Support: Opera 10 - 11 only
    			// Opera 10-11 does not throw on post-comma invalid pseudos
    			el.querySelectorAll( "*,:x" );
    			rbuggyQSA.push( ",.*:" );
    		} );
    	}

    	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
    		docElem.webkitMatchesSelector ||
    		docElem.mozMatchesSelector ||
    		docElem.oMatchesSelector ||
    		docElem.msMatchesSelector ) ) ) ) {

    		assert( function( el ) {

    			// Check to see if it's possible to do matchesSelector
    			// on a disconnected node (IE 9)
    			support.disconnectedMatch = matches.call( el, "*" );

    			// This should fail with an exception
    			// Gecko does not error, returns false instead
    			matches.call( el, "[s!='']:x" );
    			rbuggyMatches.push( "!=", pseudos );
    		} );
    	}

    	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
    	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

    	/* Contains
    	---------------------------------------------------------------------- */
    	hasCompare = rnative.test( docElem.compareDocumentPosition );

    	// Element contains another
    	// Purposefully self-exclusive
    	// As in, an element does not contain itself
    	contains = hasCompare || rnative.test( docElem.contains ) ?
    		function( a, b ) {
    			var adown = a.nodeType === 9 ? a.documentElement : a,
    				bup = b && b.parentNode;
    			return a === bup || !!( bup && bup.nodeType === 1 && (
    				adown.contains ?
    					adown.contains( bup ) :
    					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
    			) );
    		} :
    		function( a, b ) {
    			if ( b ) {
    				while ( ( b = b.parentNode ) ) {
    					if ( b === a ) {
    						return true;
    					}
    				}
    			}
    			return false;
    		};

    	/* Sorting
    	---------------------------------------------------------------------- */

    	// Document order sorting
    	sortOrder = hasCompare ?
    	function( a, b ) {

    		// Flag for duplicate removal
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}

    		// Sort on method existence if only one input has compareDocumentPosition
    		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
    		if ( compare ) {
    			return compare;
    		}

    		// Calculate position if both inputs belong to the same document
    		// Support: IE 11+, Edge 17 - 18+
    		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    		// two documents; shallow comparisons work.
    		// eslint-disable-next-line eqeqeq
    		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
    			a.compareDocumentPosition( b ) :

    			// Otherwise we know they are disconnected
    			1;

    		// Disconnected nodes
    		if ( compare & 1 ||
    			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

    			// Choose the first element that is related to our preferred document
    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			// eslint-disable-next-line eqeqeq
    			if ( a == document || a.ownerDocument == preferredDoc &&
    				contains( preferredDoc, a ) ) {
    				return -1;
    			}

    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			// eslint-disable-next-line eqeqeq
    			if ( b == document || b.ownerDocument == preferredDoc &&
    				contains( preferredDoc, b ) ) {
    				return 1;
    			}

    			// Maintain original order
    			return sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;
    		}

    		return compare & 4 ? -1 : 1;
    	} :
    	function( a, b ) {

    		// Exit early if the nodes are identical
    		if ( a === b ) {
    			hasDuplicate = true;
    			return 0;
    		}

    		var cur,
    			i = 0,
    			aup = a.parentNode,
    			bup = b.parentNode,
    			ap = [ a ],
    			bp = [ b ];

    		// Parentless nodes are either documents or disconnected
    		if ( !aup || !bup ) {

    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			/* eslint-disable eqeqeq */
    			return a == document ? -1 :
    				b == document ? 1 :
    				/* eslint-enable eqeqeq */
    				aup ? -1 :
    				bup ? 1 :
    				sortInput ?
    				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
    				0;

    		// If the nodes are siblings, we can do a quick check
    		} else if ( aup === bup ) {
    			return siblingCheck( a, b );
    		}

    		// Otherwise we need full lists of their ancestors for comparison
    		cur = a;
    		while ( ( cur = cur.parentNode ) ) {
    			ap.unshift( cur );
    		}
    		cur = b;
    		while ( ( cur = cur.parentNode ) ) {
    			bp.unshift( cur );
    		}

    		// Walk down the tree looking for a discrepancy
    		while ( ap[ i ] === bp[ i ] ) {
    			i++;
    		}

    		return i ?

    			// Do a sibling check if the nodes have a common ancestor
    			siblingCheck( ap[ i ], bp[ i ] ) :

    			// Otherwise nodes in our document sort first
    			// Support: IE 11+, Edge 17 - 18+
    			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    			// two documents; shallow comparisons work.
    			/* eslint-disable eqeqeq */
    			ap[ i ] == preferredDoc ? -1 :
    			bp[ i ] == preferredDoc ? 1 :
    			/* eslint-enable eqeqeq */
    			0;
    	};

    	return document;
    };

    Sizzle.matches = function( expr, elements ) {
    	return Sizzle( expr, null, null, elements );
    };

    Sizzle.matchesSelector = function( elem, expr ) {
    	setDocument( elem );

    	if ( support.matchesSelector && documentIsHTML &&
    		!nonnativeSelectorCache[ expr + " " ] &&
    		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
    		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

    		try {
    			var ret = matches.call( elem, expr );

    			// IE 9's matchesSelector returns false on disconnected nodes
    			if ( ret || support.disconnectedMatch ||

    				// As well, disconnected nodes are said to be in a document
    				// fragment in IE 9
    				elem.document && elem.document.nodeType !== 11 ) {
    				return ret;
    			}
    		} catch ( e ) {
    			nonnativeSelectorCache( expr, true );
    		}
    	}

    	return Sizzle( expr, document, null, [ elem ] ).length > 0;
    };

    Sizzle.contains = function( context, elem ) {

    	// Set document vars if needed
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( ( context.ownerDocument || context ) != document ) {
    		setDocument( context );
    	}
    	return contains( context, elem );
    };

    Sizzle.attr = function( elem, name ) {

    	// Set document vars if needed
    	// Support: IE 11+, Edge 17 - 18+
    	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    	// two documents; shallow comparisons work.
    	// eslint-disable-next-line eqeqeq
    	if ( ( elem.ownerDocument || elem ) != document ) {
    		setDocument( elem );
    	}

    	var fn = Expr.attrHandle[ name.toLowerCase() ],

    		// Don't get fooled by Object.prototype properties (jQuery #13807)
    		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
    			fn( elem, name, !documentIsHTML ) :
    			undefined;

    	return val !== undefined ?
    		val :
    		support.attributes || !documentIsHTML ?
    			elem.getAttribute( name ) :
    			( val = elem.getAttributeNode( name ) ) && val.specified ?
    				val.value :
    				null;
    };

    Sizzle.escape = function( sel ) {
    	return ( sel + "" ).replace( rcssescape, fcssescape );
    };

    Sizzle.error = function( msg ) {
    	throw new Error( "Syntax error, unrecognized expression: " + msg );
    };

    /**
     * Document sorting and removing duplicates
     * @param {ArrayLike} results
     */
    Sizzle.uniqueSort = function( results ) {
    	var elem,
    		duplicates = [],
    		j = 0,
    		i = 0;

    	// Unless we *know* we can detect duplicates, assume their presence
    	hasDuplicate = !support.detectDuplicates;
    	sortInput = !support.sortStable && results.slice( 0 );
    	results.sort( sortOrder );

    	if ( hasDuplicate ) {
    		while ( ( elem = results[ i++ ] ) ) {
    			if ( elem === results[ i ] ) {
    				j = duplicates.push( i );
    			}
    		}
    		while ( j-- ) {
    			results.splice( duplicates[ j ], 1 );
    		}
    	}

    	// Clear input after sorting to release objects
    	// See https://github.com/jquery/sizzle/pull/225
    	sortInput = null;

    	return results;
    };

    /**
     * Utility function for retrieving the text value of an array of DOM nodes
     * @param {Array|Element} elem
     */
    getText = Sizzle.getText = function( elem ) {
    	var node,
    		ret = "",
    		i = 0,
    		nodeType = elem.nodeType;

    	if ( !nodeType ) {

    		// If no nodeType, this is expected to be an array
    		while ( ( node = elem[ i++ ] ) ) {

    			// Do not traverse comment nodes
    			ret += getText( node );
    		}
    	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

    		// Use textContent for elements
    		// innerText usage removed for consistency of new lines (jQuery #11153)
    		if ( typeof elem.textContent === "string" ) {
    			return elem.textContent;
    		} else {

    			// Traverse its children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				ret += getText( elem );
    			}
    		}
    	} else if ( nodeType === 3 || nodeType === 4 ) {
    		return elem.nodeValue;
    	}

    	// Do not include comment or processing instruction nodes

    	return ret;
    };

    Expr = Sizzle.selectors = {

    	// Can be adjusted by the user
    	cacheLength: 50,

    	createPseudo: markFunction,

    	match: matchExpr,

    	attrHandle: {},

    	find: {},

    	relative: {
    		">": { dir: "parentNode", first: true },
    		" ": { dir: "parentNode" },
    		"+": { dir: "previousSibling", first: true },
    		"~": { dir: "previousSibling" }
    	},

    	preFilter: {
    		"ATTR": function( match ) {
    			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

    			// Move the given value to match[3] whether quoted or unquoted
    			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
    				match[ 5 ] || "" ).replace( runescape, funescape );

    			if ( match[ 2 ] === "~=" ) {
    				match[ 3 ] = " " + match[ 3 ] + " ";
    			}

    			return match.slice( 0, 4 );
    		},

    		"CHILD": function( match ) {

    			/* matches from matchExpr["CHILD"]
    				1 type (only|nth|...)
    				2 what (child|of-type)
    				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
    				4 xn-component of xn+y argument ([+-]?\d*n|)
    				5 sign of xn-component
    				6 x of xn-component
    				7 sign of y-component
    				8 y of y-component
    			*/
    			match[ 1 ] = match[ 1 ].toLowerCase();

    			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

    				// nth-* requires argument
    				if ( !match[ 3 ] ) {
    					Sizzle.error( match[ 0 ] );
    				}

    				// numeric x and y parameters for Expr.filter.CHILD
    				// remember that false/true cast respectively to 0/1
    				match[ 4 ] = +( match[ 4 ] ?
    					match[ 5 ] + ( match[ 6 ] || 1 ) :
    					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
    				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

    				// other types prohibit arguments
    			} else if ( match[ 3 ] ) {
    				Sizzle.error( match[ 0 ] );
    			}

    			return match;
    		},

    		"PSEUDO": function( match ) {
    			var excess,
    				unquoted = !match[ 6 ] && match[ 2 ];

    			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
    				return null;
    			}

    			// Accept quoted arguments as-is
    			if ( match[ 3 ] ) {
    				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

    			// Strip excess characters from unquoted arguments
    			} else if ( unquoted && rpseudo.test( unquoted ) &&

    				// Get excess from tokenize (recursively)
    				( excess = tokenize( unquoted, true ) ) &&

    				// advance to the next closing parenthesis
    				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

    				// excess is a negative index
    				match[ 0 ] = match[ 0 ].slice( 0, excess );
    				match[ 2 ] = unquoted.slice( 0, excess );
    			}

    			// Return only captures needed by the pseudo filter method (type and argument)
    			return match.slice( 0, 3 );
    		}
    	},

    	filter: {

    		"TAG": function( nodeNameSelector ) {
    			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
    			return nodeNameSelector === "*" ?
    				function() {
    					return true;
    				} :
    				function( elem ) {
    					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
    				};
    		},

    		"CLASS": function( className ) {
    			var pattern = classCache[ className + " " ];

    			return pattern ||
    				( pattern = new RegExp( "(^|" + whitespace +
    					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
    						className, function( elem ) {
    							return pattern.test(
    								typeof elem.className === "string" && elem.className ||
    								typeof elem.getAttribute !== "undefined" &&
    									elem.getAttribute( "class" ) ||
    								""
    							);
    				} );
    		},

    		"ATTR": function( name, operator, check ) {
    			return function( elem ) {
    				var result = Sizzle.attr( elem, name );

    				if ( result == null ) {
    					return operator === "!=";
    				}
    				if ( !operator ) {
    					return true;
    				}

    				result += "";

    				/* eslint-disable max-len */

    				return operator === "=" ? result === check :
    					operator === "!=" ? result !== check :
    					operator === "^=" ? check && result.indexOf( check ) === 0 :
    					operator === "*=" ? check && result.indexOf( check ) > -1 :
    					operator === "$=" ? check && result.slice( -check.length ) === check :
    					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
    					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
    					false;
    				/* eslint-enable max-len */

    			};
    		},

    		"CHILD": function( type, what, _argument, first, last ) {
    			var simple = type.slice( 0, 3 ) !== "nth",
    				forward = type.slice( -4 ) !== "last",
    				ofType = what === "of-type";

    			return first === 1 && last === 0 ?

    				// Shortcut for :nth-*(n)
    				function( elem ) {
    					return !!elem.parentNode;
    				} :

    				function( elem, _context, xml ) {
    					var cache, uniqueCache, outerCache, node, nodeIndex, start,
    						dir = simple !== forward ? "nextSibling" : "previousSibling",
    						parent = elem.parentNode,
    						name = ofType && elem.nodeName.toLowerCase(),
    						useCache = !xml && !ofType,
    						diff = false;

    					if ( parent ) {

    						// :(first|last|only)-(child|of-type)
    						if ( simple ) {
    							while ( dir ) {
    								node = elem;
    								while ( ( node = node[ dir ] ) ) {
    									if ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) {

    										return false;
    									}
    								}

    								// Reverse direction for :only-* (if we haven't yet done so)
    								start = dir = type === "only" && !start && "nextSibling";
    							}
    							return true;
    						}

    						start = [ forward ? parent.firstChild : parent.lastChild ];

    						// non-xml :nth-child(...) stores cache data on `parent`
    						if ( forward && useCache ) {

    							// Seek `elem` from a previously-cached index

    							// ...in a gzip-friendly way
    							node = parent;
    							outerCache = node[ expando ] || ( node[ expando ] = {} );

    							// Support: IE <9 only
    							// Defend against cloned attroperties (jQuery gh-1709)
    							uniqueCache = outerCache[ node.uniqueID ] ||
    								( outerCache[ node.uniqueID ] = {} );

    							cache = uniqueCache[ type ] || [];
    							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    							diff = nodeIndex && cache[ 2 ];
    							node = nodeIndex && parent.childNodes[ nodeIndex ];

    							while ( ( node = ++nodeIndex && node && node[ dir ] ||

    								// Fallback to seeking `elem` from the start
    								( diff = nodeIndex = 0 ) || start.pop() ) ) {

    								// When found, cache indexes on `parent` and break
    								if ( node.nodeType === 1 && ++diff && node === elem ) {
    									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
    									break;
    								}
    							}

    						} else {

    							// Use previously-cached element index if available
    							if ( useCache ) {

    								// ...in a gzip-friendly way
    								node = elem;
    								outerCache = node[ expando ] || ( node[ expando ] = {} );

    								// Support: IE <9 only
    								// Defend against cloned attroperties (jQuery gh-1709)
    								uniqueCache = outerCache[ node.uniqueID ] ||
    									( outerCache[ node.uniqueID ] = {} );

    								cache = uniqueCache[ type ] || [];
    								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
    								diff = nodeIndex;
    							}

    							// xml :nth-child(...)
    							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
    							if ( diff === false ) {

    								// Use the same loop as above to seek `elem` from the start
    								while ( ( node = ++nodeIndex && node && node[ dir ] ||
    									( diff = nodeIndex = 0 ) || start.pop() ) ) {

    									if ( ( ofType ?
    										node.nodeName.toLowerCase() === name :
    										node.nodeType === 1 ) &&
    										++diff ) {

    										// Cache the index of each encountered element
    										if ( useCache ) {
    											outerCache = node[ expando ] ||
    												( node[ expando ] = {} );

    											// Support: IE <9 only
    											// Defend against cloned attroperties (jQuery gh-1709)
    											uniqueCache = outerCache[ node.uniqueID ] ||
    												( outerCache[ node.uniqueID ] = {} );

    											uniqueCache[ type ] = [ dirruns, diff ];
    										}

    										if ( node === elem ) {
    											break;
    										}
    									}
    								}
    							}
    						}

    						// Incorporate the offset, then check against cycle size
    						diff -= last;
    						return diff === first || ( diff % first === 0 && diff / first >= 0 );
    					}
    				};
    		},

    		"PSEUDO": function( pseudo, argument ) {

    			// pseudo-class names are case-insensitive
    			// http://www.w3.org/TR/selectors/#pseudo-classes
    			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
    			// Remember that setFilters inherits from pseudos
    			var args,
    				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
    					Sizzle.error( "unsupported pseudo: " + pseudo );

    			// The user may use createPseudo to indicate that
    			// arguments are needed to create the filter function
    			// just as Sizzle does
    			if ( fn[ expando ] ) {
    				return fn( argument );
    			}

    			// But maintain support for old signatures
    			if ( fn.length > 1 ) {
    				args = [ pseudo, pseudo, "", argument ];
    				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
    					markFunction( function( seed, matches ) {
    						var idx,
    							matched = fn( seed, argument ),
    							i = matched.length;
    						while ( i-- ) {
    							idx = indexOf( seed, matched[ i ] );
    							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
    						}
    					} ) :
    					function( elem ) {
    						return fn( elem, 0, args );
    					};
    			}

    			return fn;
    		}
    	},

    	pseudos: {

    		// Potentially complex pseudos
    		"not": markFunction( function( selector ) {

    			// Trim the selector passed to compile
    			// to avoid treating leading and trailing
    			// spaces as combinators
    			var input = [],
    				results = [],
    				matcher = compile( selector.replace( rtrim, "$1" ) );

    			return matcher[ expando ] ?
    				markFunction( function( seed, matches, _context, xml ) {
    					var elem,
    						unmatched = matcher( seed, null, xml, [] ),
    						i = seed.length;

    					// Match elements unmatched by `matcher`
    					while ( i-- ) {
    						if ( ( elem = unmatched[ i ] ) ) {
    							seed[ i ] = !( matches[ i ] = elem );
    						}
    					}
    				} ) :
    				function( elem, _context, xml ) {
    					input[ 0 ] = elem;
    					matcher( input, null, xml, results );

    					// Don't keep the element (issue #299)
    					input[ 0 ] = null;
    					return !results.pop();
    				};
    		} ),

    		"has": markFunction( function( selector ) {
    			return function( elem ) {
    				return Sizzle( selector, elem ).length > 0;
    			};
    		} ),

    		"contains": markFunction( function( text ) {
    			text = text.replace( runescape, funescape );
    			return function( elem ) {
    				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
    			};
    		} ),

    		// "Whether an element is represented by a :lang() selector
    		// is based solely on the element's language value
    		// being equal to the identifier C,
    		// or beginning with the identifier C immediately followed by "-".
    		// The matching of C against the element's language value is performed case-insensitively.
    		// The identifier C does not have to be a valid language name."
    		// http://www.w3.org/TR/selectors/#lang-pseudo
    		"lang": markFunction( function( lang ) {

    			// lang value must be a valid identifier
    			if ( !ridentifier.test( lang || "" ) ) {
    				Sizzle.error( "unsupported lang: " + lang );
    			}
    			lang = lang.replace( runescape, funescape ).toLowerCase();
    			return function( elem ) {
    				var elemLang;
    				do {
    					if ( ( elemLang = documentIsHTML ?
    						elem.lang :
    						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

    						elemLang = elemLang.toLowerCase();
    						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
    					}
    				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
    				return false;
    			};
    		} ),

    		// Miscellaneous
    		"target": function( elem ) {
    			var hash = window.location && window.location.hash;
    			return hash && hash.slice( 1 ) === elem.id;
    		},

    		"root": function( elem ) {
    			return elem === docElem;
    		},

    		"focus": function( elem ) {
    			return elem === document.activeElement &&
    				( !document.hasFocus || document.hasFocus() ) &&
    				!!( elem.type || elem.href || ~elem.tabIndex );
    		},

    		// Boolean properties
    		"enabled": createDisabledPseudo( false ),
    		"disabled": createDisabledPseudo( true ),

    		"checked": function( elem ) {

    			// In CSS3, :checked should return both checked and selected elements
    			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
    			var nodeName = elem.nodeName.toLowerCase();
    			return ( nodeName === "input" && !!elem.checked ) ||
    				( nodeName === "option" && !!elem.selected );
    		},

    		"selected": function( elem ) {

    			// Accessing this property makes selected-by-default
    			// options in Safari work properly
    			if ( elem.parentNode ) {
    				// eslint-disable-next-line no-unused-expressions
    				elem.parentNode.selectedIndex;
    			}

    			return elem.selected === true;
    		},

    		// Contents
    		"empty": function( elem ) {

    			// http://www.w3.org/TR/selectors/#empty-pseudo
    			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
    			//   but not by others (comment: 8; processing instruction: 7; etc.)
    			// nodeType < 6 works because attributes (2) do not appear as children
    			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
    				if ( elem.nodeType < 6 ) {
    					return false;
    				}
    			}
    			return true;
    		},

    		"parent": function( elem ) {
    			return !Expr.pseudos[ "empty" ]( elem );
    		},

    		// Element/input types
    		"header": function( elem ) {
    			return rheader.test( elem.nodeName );
    		},

    		"input": function( elem ) {
    			return rinputs.test( elem.nodeName );
    		},

    		"button": function( elem ) {
    			var name = elem.nodeName.toLowerCase();
    			return name === "input" && elem.type === "button" || name === "button";
    		},

    		"text": function( elem ) {
    			var attr;
    			return elem.nodeName.toLowerCase() === "input" &&
    				elem.type === "text" &&

    				// Support: IE<8
    				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
    				( ( attr = elem.getAttribute( "type" ) ) == null ||
    					attr.toLowerCase() === "text" );
    		},

    		// Position-in-collection
    		"first": createPositionalPseudo( function() {
    			return [ 0 ];
    		} ),

    		"last": createPositionalPseudo( function( _matchIndexes, length ) {
    			return [ length - 1 ];
    		} ),

    		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
    			return [ argument < 0 ? argument + length : argument ];
    		} ),

    		"even": createPositionalPseudo( function( matchIndexes, length ) {
    			var i = 0;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"odd": createPositionalPseudo( function( matchIndexes, length ) {
    			var i = 1;
    			for ( ; i < length; i += 2 ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    			var i = argument < 0 ?
    				argument + length :
    				argument > length ?
    					length :
    					argument;
    			for ( ; --i >= 0; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} ),

    		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
    			var i = argument < 0 ? argument + length : argument;
    			for ( ; ++i < length; ) {
    				matchIndexes.push( i );
    			}
    			return matchIndexes;
    		} )
    	}
    };

    Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

    // Add button/input type pseudos
    for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
    	Expr.pseudos[ i ] = createInputPseudo( i );
    }
    for ( i in { submit: true, reset: true } ) {
    	Expr.pseudos[ i ] = createButtonPseudo( i );
    }

    // Easy API for creating new setFilters
    function setFilters() {}
    setFilters.prototype = Expr.filters = Expr.pseudos;
    Expr.setFilters = new setFilters();

    tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
    	var matched, match, tokens, type,
    		soFar, groups, preFilters,
    		cached = tokenCache[ selector + " " ];

    	if ( cached ) {
    		return parseOnly ? 0 : cached.slice( 0 );
    	}

    	soFar = selector;
    	groups = [];
    	preFilters = Expr.preFilter;

    	while ( soFar ) {

    		// Comma and first run
    		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
    			if ( match ) {

    				// Don't consume trailing commas as valid
    				soFar = soFar.slice( match[ 0 ].length ) || soFar;
    			}
    			groups.push( ( tokens = [] ) );
    		}

    		matched = false;

    		// Combinators
    		if ( ( match = rcombinators.exec( soFar ) ) ) {
    			matched = match.shift();
    			tokens.push( {
    				value: matched,

    				// Cast descendant combinators to space
    				type: match[ 0 ].replace( rtrim, " " )
    			} );
    			soFar = soFar.slice( matched.length );
    		}

    		// Filters
    		for ( type in Expr.filter ) {
    			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
    				( match = preFilters[ type ]( match ) ) ) ) {
    				matched = match.shift();
    				tokens.push( {
    					value: matched,
    					type: type,
    					matches: match
    				} );
    				soFar = soFar.slice( matched.length );
    			}
    		}

    		if ( !matched ) {
    			break;
    		}
    	}

    	// Return the length of the invalid excess
    	// if we're just parsing
    	// Otherwise, throw an error or return tokens
    	return parseOnly ?
    		soFar.length :
    		soFar ?
    			Sizzle.error( selector ) :

    			// Cache the tokens
    			tokenCache( selector, groups ).slice( 0 );
    };

    function toSelector( tokens ) {
    	var i = 0,
    		len = tokens.length,
    		selector = "";
    	for ( ; i < len; i++ ) {
    		selector += tokens[ i ].value;
    	}
    	return selector;
    }

    function addCombinator( matcher, combinator, base ) {
    	var dir = combinator.dir,
    		skip = combinator.next,
    		key = skip || dir,
    		checkNonElements = base && key === "parentNode",
    		doneName = done++;

    	return combinator.first ?

    		// Check against closest ancestor/preceding element
    		function( elem, context, xml ) {
    			while ( ( elem = elem[ dir ] ) ) {
    				if ( elem.nodeType === 1 || checkNonElements ) {
    					return matcher( elem, context, xml );
    				}
    			}
    			return false;
    		} :

    		// Check against all ancestor/preceding elements
    		function( elem, context, xml ) {
    			var oldCache, uniqueCache, outerCache,
    				newCache = [ dirruns, doneName ];

    			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
    			if ( xml ) {
    				while ( ( elem = elem[ dir ] ) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						if ( matcher( elem, context, xml ) ) {
    							return true;
    						}
    					}
    				}
    			} else {
    				while ( ( elem = elem[ dir ] ) ) {
    					if ( elem.nodeType === 1 || checkNonElements ) {
    						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

    						// Support: IE <9 only
    						// Defend against cloned attroperties (jQuery gh-1709)
    						uniqueCache = outerCache[ elem.uniqueID ] ||
    							( outerCache[ elem.uniqueID ] = {} );

    						if ( skip && skip === elem.nodeName.toLowerCase() ) {
    							elem = elem[ dir ] || elem;
    						} else if ( ( oldCache = uniqueCache[ key ] ) &&
    							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

    							// Assign to newCache so results back-propagate to previous elements
    							return ( newCache[ 2 ] = oldCache[ 2 ] );
    						} else {

    							// Reuse newcache so results back-propagate to previous elements
    							uniqueCache[ key ] = newCache;

    							// A match means we're done; a fail means we have to keep checking
    							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
    								return true;
    							}
    						}
    					}
    				}
    			}
    			return false;
    		};
    }

    function elementMatcher( matchers ) {
    	return matchers.length > 1 ?
    		function( elem, context, xml ) {
    			var i = matchers.length;
    			while ( i-- ) {
    				if ( !matchers[ i ]( elem, context, xml ) ) {
    					return false;
    				}
    			}
    			return true;
    		} :
    		matchers[ 0 ];
    }

    function multipleContexts( selector, contexts, results ) {
    	var i = 0,
    		len = contexts.length;
    	for ( ; i < len; i++ ) {
    		Sizzle( selector, contexts[ i ], results );
    	}
    	return results;
    }

    function condense( unmatched, map, filter, context, xml ) {
    	var elem,
    		newUnmatched = [],
    		i = 0,
    		len = unmatched.length,
    		mapped = map != null;

    	for ( ; i < len; i++ ) {
    		if ( ( elem = unmatched[ i ] ) ) {
    			if ( !filter || filter( elem, context, xml ) ) {
    				newUnmatched.push( elem );
    				if ( mapped ) {
    					map.push( i );
    				}
    			}
    		}
    	}

    	return newUnmatched;
    }

    function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
    	if ( postFilter && !postFilter[ expando ] ) {
    		postFilter = setMatcher( postFilter );
    	}
    	if ( postFinder && !postFinder[ expando ] ) {
    		postFinder = setMatcher( postFinder, postSelector );
    	}
    	return markFunction( function( seed, results, context, xml ) {
    		var temp, i, elem,
    			preMap = [],
    			postMap = [],
    			preexisting = results.length,

    			// Get initial elements from seed or context
    			elems = seed || multipleContexts(
    				selector || "*",
    				context.nodeType ? [ context ] : context,
    				[]
    			),

    			// Prefilter to get matcher input, preserving a map for seed-results synchronization
    			matcherIn = preFilter && ( seed || !selector ) ?
    				condense( elems, preMap, preFilter, context, xml ) :
    				elems,

    			matcherOut = matcher ?

    				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
    				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

    					// ...intermediate processing is necessary
    					[] :

    					// ...otherwise use results directly
    					results :
    				matcherIn;

    		// Find primary matches
    		if ( matcher ) {
    			matcher( matcherIn, matcherOut, context, xml );
    		}

    		// Apply postFilter
    		if ( postFilter ) {
    			temp = condense( matcherOut, postMap );
    			postFilter( temp, [], context, xml );

    			// Un-match failing elements by moving them back to matcherIn
    			i = temp.length;
    			while ( i-- ) {
    				if ( ( elem = temp[ i ] ) ) {
    					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
    				}
    			}
    		}

    		if ( seed ) {
    			if ( postFinder || preFilter ) {
    				if ( postFinder ) {

    					// Get the final matcherOut by condensing this intermediate into postFinder contexts
    					temp = [];
    					i = matcherOut.length;
    					while ( i-- ) {
    						if ( ( elem = matcherOut[ i ] ) ) {

    							// Restore matcherIn since elem is not yet a final match
    							temp.push( ( matcherIn[ i ] = elem ) );
    						}
    					}
    					postFinder( null, ( matcherOut = [] ), temp, xml );
    				}

    				// Move matched elements from seed to results to keep them synchronized
    				i = matcherOut.length;
    				while ( i-- ) {
    					if ( ( elem = matcherOut[ i ] ) &&
    						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

    						seed[ temp ] = !( results[ temp ] = elem );
    					}
    				}
    			}

    		// Add elements to results, through postFinder if defined
    		} else {
    			matcherOut = condense(
    				matcherOut === results ?
    					matcherOut.splice( preexisting, matcherOut.length ) :
    					matcherOut
    			);
    			if ( postFinder ) {
    				postFinder( null, results, matcherOut, xml );
    			} else {
    				push.apply( results, matcherOut );
    			}
    		}
    	} );
    }

    function matcherFromTokens( tokens ) {
    	var checkContext, matcher, j,
    		len = tokens.length,
    		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
    		implicitRelative = leadingRelative || Expr.relative[ " " ],
    		i = leadingRelative ? 1 : 0,

    		// The foundational matcher ensures that elements are reachable from top-level context(s)
    		matchContext = addCombinator( function( elem ) {
    			return elem === checkContext;
    		}, implicitRelative, true ),
    		matchAnyContext = addCombinator( function( elem ) {
    			return indexOf( checkContext, elem ) > -1;
    		}, implicitRelative, true ),
    		matchers = [ function( elem, context, xml ) {
    			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
    				( checkContext = context ).nodeType ?
    					matchContext( elem, context, xml ) :
    					matchAnyContext( elem, context, xml ) );

    			// Avoid hanging onto element (issue #299)
    			checkContext = null;
    			return ret;
    		} ];

    	for ( ; i < len; i++ ) {
    		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
    			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
    		} else {
    			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

    			// Return special upon seeing a positional matcher
    			if ( matcher[ expando ] ) {

    				// Find the next relative operator (if any) for proper handling
    				j = ++i;
    				for ( ; j < len; j++ ) {
    					if ( Expr.relative[ tokens[ j ].type ] ) {
    						break;
    					}
    				}
    				return setMatcher(
    					i > 1 && elementMatcher( matchers ),
    					i > 1 && toSelector(

    					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
    					tokens
    						.slice( 0, i - 1 )
    						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
    					).replace( rtrim, "$1" ),
    					matcher,
    					i < j && matcherFromTokens( tokens.slice( i, j ) ),
    					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
    					j < len && toSelector( tokens )
    				);
    			}
    			matchers.push( matcher );
    		}
    	}

    	return elementMatcher( matchers );
    }

    function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
    	var bySet = setMatchers.length > 0,
    		byElement = elementMatchers.length > 0,
    		superMatcher = function( seed, context, xml, results, outermost ) {
    			var elem, j, matcher,
    				matchedCount = 0,
    				i = "0",
    				unmatched = seed && [],
    				setMatched = [],
    				contextBackup = outermostContext,

    				// We must always have either seed elements or outermost context
    				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

    				// Use integer dirruns iff this is the outermost matcher
    				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
    				len = elems.length;

    			if ( outermost ) {

    				// Support: IE 11+, Edge 17 - 18+
    				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    				// two documents; shallow comparisons work.
    				// eslint-disable-next-line eqeqeq
    				outermostContext = context == document || context || outermost;
    			}

    			// Add elements passing elementMatchers directly to results
    			// Support: IE<9, Safari
    			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
    			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
    				if ( byElement && elem ) {
    					j = 0;

    					// Support: IE 11+, Edge 17 - 18+
    					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
    					// two documents; shallow comparisons work.
    					// eslint-disable-next-line eqeqeq
    					if ( !context && elem.ownerDocument != document ) {
    						setDocument( elem );
    						xml = !documentIsHTML;
    					}
    					while ( ( matcher = elementMatchers[ j++ ] ) ) {
    						if ( matcher( elem, context || document, xml ) ) {
    							results.push( elem );
    							break;
    						}
    					}
    					if ( outermost ) {
    						dirruns = dirrunsUnique;
    					}
    				}

    				// Track unmatched elements for set filters
    				if ( bySet ) {

    					// They will have gone through all possible matchers
    					if ( ( elem = !matcher && elem ) ) {
    						matchedCount--;
    					}

    					// Lengthen the array for every element, matched or not
    					if ( seed ) {
    						unmatched.push( elem );
    					}
    				}
    			}

    			// `i` is now the count of elements visited above, and adding it to `matchedCount`
    			// makes the latter nonnegative.
    			matchedCount += i;

    			// Apply set filters to unmatched elements
    			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
    			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
    			// no element matchers and no seed.
    			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
    			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
    			// numerically zero.
    			if ( bySet && i !== matchedCount ) {
    				j = 0;
    				while ( ( matcher = setMatchers[ j++ ] ) ) {
    					matcher( unmatched, setMatched, context, xml );
    				}

    				if ( seed ) {

    					// Reintegrate element matches to eliminate the need for sorting
    					if ( matchedCount > 0 ) {
    						while ( i-- ) {
    							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
    								setMatched[ i ] = pop.call( results );
    							}
    						}
    					}

    					// Discard index placeholder values to get only actual matches
    					setMatched = condense( setMatched );
    				}

    				// Add matches to results
    				push.apply( results, setMatched );

    				// Seedless set matches succeeding multiple successful matchers stipulate sorting
    				if ( outermost && !seed && setMatched.length > 0 &&
    					( matchedCount + setMatchers.length ) > 1 ) {

    					Sizzle.uniqueSort( results );
    				}
    			}

    			// Override manipulation of globals by nested matchers
    			if ( outermost ) {
    				dirruns = dirrunsUnique;
    				outermostContext = contextBackup;
    			}

    			return unmatched;
    		};

    	return bySet ?
    		markFunction( superMatcher ) :
    		superMatcher;
    }

    compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
    	var i,
    		setMatchers = [],
    		elementMatchers = [],
    		cached = compilerCache[ selector + " " ];

    	if ( !cached ) {

    		// Generate a function of recursive functions that can be used to check each element
    		if ( !match ) {
    			match = tokenize( selector );
    		}
    		i = match.length;
    		while ( i-- ) {
    			cached = matcherFromTokens( match[ i ] );
    			if ( cached[ expando ] ) {
    				setMatchers.push( cached );
    			} else {
    				elementMatchers.push( cached );
    			}
    		}

    		// Cache the compiled function
    		cached = compilerCache(
    			selector,
    			matcherFromGroupMatchers( elementMatchers, setMatchers )
    		);

    		// Save selector and tokenization
    		cached.selector = selector;
    	}
    	return cached;
    };

    /**
     * A low-level selection function that works with Sizzle's compiled
     *  selector functions
     * @param {String|Function} selector A selector or a pre-compiled
     *  selector function built with Sizzle.compile
     * @param {Element} context
     * @param {Array} [results]
     * @param {Array} [seed] A set of elements to match against
     */
    select = Sizzle.select = function( selector, context, results, seed ) {
    	var i, tokens, token, type, find,
    		compiled = typeof selector === "function" && selector,
    		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

    	results = results || [];

    	// Try to minimize operations if there is only one selector in the list and no seed
    	// (the latter of which guarantees us context)
    	if ( match.length === 1 ) {

    		// Reduce context if the leading compound selector is an ID
    		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
    		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
    			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

    			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
    				.replace( runescape, funescape ), context ) || [] )[ 0 ];
    			if ( !context ) {
    				return results;

    			// Precompiled matchers will still verify ancestry, so step up a level
    			} else if ( compiled ) {
    				context = context.parentNode;
    			}

    			selector = selector.slice( tokens.shift().value.length );
    		}

    		// Fetch a seed set for right-to-left matching
    		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
    		while ( i-- ) {
    			token = tokens[ i ];

    			// Abort if we hit a combinator
    			if ( Expr.relative[ ( type = token.type ) ] ) {
    				break;
    			}
    			if ( ( find = Expr.find[ type ] ) ) {

    				// Search, expanding context for leading sibling combinators
    				if ( ( seed = find(
    					token.matches[ 0 ].replace( runescape, funescape ),
    					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
    						context
    				) ) ) {

    					// If seed is empty or no tokens remain, we can return early
    					tokens.splice( i, 1 );
    					selector = seed.length && toSelector( tokens );
    					if ( !selector ) {
    						push.apply( results, seed );
    						return results;
    					}

    					break;
    				}
    			}
    		}
    	}

    	// Compile and execute a filtering function if one is not provided
    	// Provide `match` to avoid retokenization if we modified the selector above
    	( compiled || compile( selector, match ) )(
    		seed,
    		context,
    		!documentIsHTML,
    		results,
    		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
    	);
    	return results;
    };

    // One-time assignments

    // Sort stability
    support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

    // Support: Chrome 14-35+
    // Always assume duplicates if they aren't passed to the comparison function
    support.detectDuplicates = !!hasDuplicate;

    // Initialize against the default document
    setDocument();

    // Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
    // Detached nodes confoundingly follow *each other*
    support.sortDetached = assert( function( el ) {

    	// Should return 1, but returns 4 (following)
    	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
    } );

    // Support: IE<8
    // Prevent attribute/property "interpolation"
    // https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
    if ( !assert( function( el ) {
    	el.innerHTML = "<a href='#'></a>";
    	return el.firstChild.getAttribute( "href" ) === "#";
    } ) ) {
    	addHandle( "type|href|height|width", function( elem, name, isXML ) {
    		if ( !isXML ) {
    			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
    		}
    	} );
    }

    // Support: IE<9
    // Use defaultValue in place of getAttribute("value")
    if ( !support.attributes || !assert( function( el ) {
    	el.innerHTML = "<input/>";
    	el.firstChild.setAttribute( "value", "" );
    	return el.firstChild.getAttribute( "value" ) === "";
    } ) ) {
    	addHandle( "value", function( elem, _name, isXML ) {
    		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
    			return elem.defaultValue;
    		}
    	} );
    }

    // Support: IE<9
    // Use getAttributeNode to fetch booleans when getAttribute lies
    if ( !assert( function( el ) {
    	return el.getAttribute( "disabled" ) == null;
    } ) ) {
    	addHandle( booleans, function( elem, name, isXML ) {
    		var val;
    		if ( !isXML ) {
    			return elem[ name ] === true ? name.toLowerCase() :
    				( val = elem.getAttributeNode( name ) ) && val.specified ?
    					val.value :
    					null;
    		}
    	} );
    }

    return Sizzle;

    } )( window );



    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;

    // Deprecated
    jQuery.expr[ ":" ] = jQuery.expr.pseudos;
    jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    jQuery.escapeSelector = Sizzle.escape;




    var dir = function( elem, dir, until ) {
    	var matched = [],
    		truncate = until !== undefined;

    	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
    		if ( elem.nodeType === 1 ) {
    			if ( truncate && jQuery( elem ).is( until ) ) {
    				break;
    			}
    			matched.push( elem );
    		}
    	}
    	return matched;
    };


    var siblings = function( n, elem ) {
    	var matched = [];

    	for ( ; n; n = n.nextSibling ) {
    		if ( n.nodeType === 1 && n !== elem ) {
    			matched.push( n );
    		}
    	}

    	return matched;
    };


    var rneedsContext = jQuery.expr.match.needsContext;



    function nodeName( elem, name ) {

      return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

    }var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



    // Implement the identical functionality for filter and not
    function winnow( elements, qualifier, not ) {
    	if ( isFunction( qualifier ) ) {
    		return jQuery.grep( elements, function( elem, i ) {
    			return !!qualifier.call( elem, i, elem ) !== not;
    		} );
    	}

    	// Single element
    	if ( qualifier.nodeType ) {
    		return jQuery.grep( elements, function( elem ) {
    			return ( elem === qualifier ) !== not;
    		} );
    	}

    	// Arraylike of elements (jQuery, arguments, Array)
    	if ( typeof qualifier !== "string" ) {
    		return jQuery.grep( elements, function( elem ) {
    			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
    		} );
    	}

    	// Filtered directly for both simple and complex selectors
    	return jQuery.filter( qualifier, elements, not );
    }

    jQuery.filter = function( expr, elems, not ) {
    	var elem = elems[ 0 ];

    	if ( not ) {
    		expr = ":not(" + expr + ")";
    	}

    	if ( elems.length === 1 && elem.nodeType === 1 ) {
    		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
    	}

    	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
    		return elem.nodeType === 1;
    	} ) );
    };

    jQuery.fn.extend( {
    	find: function( selector ) {
    		var i, ret,
    			len = this.length,
    			self = this;

    		if ( typeof selector !== "string" ) {
    			return this.pushStack( jQuery( selector ).filter( function() {
    				for ( i = 0; i < len; i++ ) {
    					if ( jQuery.contains( self[ i ], this ) ) {
    						return true;
    					}
    				}
    			} ) );
    		}

    		ret = this.pushStack( [] );

    		for ( i = 0; i < len; i++ ) {
    			jQuery.find( selector, self[ i ], ret );
    		}

    		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
    	},
    	filter: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], false ) );
    	},
    	not: function( selector ) {
    		return this.pushStack( winnow( this, selector || [], true ) );
    	},
    	is: function( selector ) {
    		return !!winnow(
    			this,

    			// If this is a positional/relative selector, check membership in the returned set
    			// so $("p:first").is("p:last") won't return true for a doc with two "p".
    			typeof selector === "string" && rneedsContext.test( selector ) ?
    				jQuery( selector ) :
    				selector || [],
    			false
    		).length;
    	}
    } );


    // Initialize a jQuery object


    // A central reference to the root jQuery(document)
    var rootjQuery,

    	// A simple way to check for HTML strings
    	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
    	// Strict HTML recognition (#11290: must start with <)
    	// Shortcut simple #id case for speed
    	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

    	init = jQuery.fn.init = function( selector, context, root ) {
    		var match, elem;

    		// HANDLE: $(""), $(null), $(undefined), $(false)
    		if ( !selector ) {
    			return this;
    		}

    		// Method init() accepts an alternate rootjQuery
    		// so migrate can support jQuery.sub (gh-2101)
    		root = root || rootjQuery;

    		// Handle HTML strings
    		if ( typeof selector === "string" ) {
    			if ( selector[ 0 ] === "<" &&
    				selector[ selector.length - 1 ] === ">" &&
    				selector.length >= 3 ) {

    				// Assume that strings that start and end with <> are HTML and skip the regex check
    				match = [ null, selector, null ];

    			} else {
    				match = rquickExpr.exec( selector );
    			}

    			// Match html or make sure no context is specified for #id
    			if ( match && ( match[ 1 ] || !context ) ) {

    				// HANDLE: $(html) -> $(array)
    				if ( match[ 1 ] ) {
    					context = context instanceof jQuery ? context[ 0 ] : context;

    					// Option to run scripts is true for back-compat
    					// Intentionally let the error be thrown if parseHTML is not present
    					jQuery.merge( this, jQuery.parseHTML(
    						match[ 1 ],
    						context && context.nodeType ? context.ownerDocument || context : document,
    						true
    					) );

    					// HANDLE: $(html, props)
    					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
    						for ( match in context ) {

    							// Properties of context are called as methods if possible
    							if ( isFunction( this[ match ] ) ) {
    								this[ match ]( context[ match ] );

    							// ...and otherwise set as attributes
    							} else {
    								this.attr( match, context[ match ] );
    							}
    						}
    					}

    					return this;

    				// HANDLE: $(#id)
    				} else {
    					elem = document.getElementById( match[ 2 ] );

    					if ( elem ) {

    						// Inject the element directly into the jQuery object
    						this[ 0 ] = elem;
    						this.length = 1;
    					}
    					return this;
    				}

    			// HANDLE: $(expr, $(...))
    			} else if ( !context || context.jquery ) {
    				return ( context || root ).find( selector );

    			// HANDLE: $(expr, context)
    			// (which is just equivalent to: $(context).find(expr)
    			} else {
    				return this.constructor( context ).find( selector );
    			}

    		// HANDLE: $(DOMElement)
    		} else if ( selector.nodeType ) {
    			this[ 0 ] = selector;
    			this.length = 1;
    			return this;

    		// HANDLE: $(function)
    		// Shortcut for document ready
    		} else if ( isFunction( selector ) ) {
    			return root.ready !== undefined ?
    				root.ready( selector ) :

    				// Execute immediately if ready is not present
    				selector( jQuery );
    		}

    		return jQuery.makeArray( selector, this );
    	};

    // Give the init function the jQuery prototype for later instantiation
    init.prototype = jQuery.fn;

    // Initialize central reference
    rootjQuery = jQuery( document );


    var rparentsprev = /^(?:parents|prev(?:Until|All))/,

    	// Methods guaranteed to produce a unique set when starting from a unique set
    	guaranteedUnique = {
    		children: true,
    		contents: true,
    		next: true,
    		prev: true
    	};

    jQuery.fn.extend( {
    	has: function( target ) {
    		var targets = jQuery( target, this ),
    			l = targets.length;

    		return this.filter( function() {
    			var i = 0;
    			for ( ; i < l; i++ ) {
    				if ( jQuery.contains( this, targets[ i ] ) ) {
    					return true;
    				}
    			}
    		} );
    	},

    	closest: function( selectors, context ) {
    		var cur,
    			i = 0,
    			l = this.length,
    			matched = [],
    			targets = typeof selectors !== "string" && jQuery( selectors );

    		// Positional selectors never match, since there's no _selection_ context
    		if ( !rneedsContext.test( selectors ) ) {
    			for ( ; i < l; i++ ) {
    				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

    					// Always skip document fragments
    					if ( cur.nodeType < 11 && ( targets ?
    						targets.index( cur ) > -1 :

    						// Don't pass non-elements to Sizzle
    						cur.nodeType === 1 &&
    							jQuery.find.matchesSelector( cur, selectors ) ) ) {

    						matched.push( cur );
    						break;
    					}
    				}
    			}
    		}

    		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
    	},

    	// Determine the position of an element within the set
    	index: function( elem ) {

    		// No argument, return index in parent
    		if ( !elem ) {
    			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
    		}

    		// Index in selector
    		if ( typeof elem === "string" ) {
    			return indexOf.call( jQuery( elem ), this[ 0 ] );
    		}

    		// Locate the position of the desired element
    		return indexOf.call( this,

    			// If it receives a jQuery object, the first element is used
    			elem.jquery ? elem[ 0 ] : elem
    		);
    	},

    	add: function( selector, context ) {
    		return this.pushStack(
    			jQuery.uniqueSort(
    				jQuery.merge( this.get(), jQuery( selector, context ) )
    			)
    		);
    	},

    	addBack: function( selector ) {
    		return this.add( selector == null ?
    			this.prevObject : this.prevObject.filter( selector )
    		);
    	}
    } );

    function sibling( cur, dir ) {
    	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
    	return cur;
    }

    jQuery.each( {
    	parent: function( elem ) {
    		var parent = elem.parentNode;
    		return parent && parent.nodeType !== 11 ? parent : null;
    	},
    	parents: function( elem ) {
    		return dir( elem, "parentNode" );
    	},
    	parentsUntil: function( elem, _i, until ) {
    		return dir( elem, "parentNode", until );
    	},
    	next: function( elem ) {
    		return sibling( elem, "nextSibling" );
    	},
    	prev: function( elem ) {
    		return sibling( elem, "previousSibling" );
    	},
    	nextAll: function( elem ) {
    		return dir( elem, "nextSibling" );
    	},
    	prevAll: function( elem ) {
    		return dir( elem, "previousSibling" );
    	},
    	nextUntil: function( elem, _i, until ) {
    		return dir( elem, "nextSibling", until );
    	},
    	prevUntil: function( elem, _i, until ) {
    		return dir( elem, "previousSibling", until );
    	},
    	siblings: function( elem ) {
    		return siblings( ( elem.parentNode || {} ).firstChild, elem );
    	},
    	children: function( elem ) {
    		return siblings( elem.firstChild );
    	},
    	contents: function( elem ) {
    		if ( elem.contentDocument != null &&

    			// Support: IE 11+
    			// <object> elements with no `data` attribute has an object
    			// `contentDocument` with a `null` prototype.
    			getProto( elem.contentDocument ) ) {

    			return elem.contentDocument;
    		}

    		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
    		// Treat the template element as a regular one in browsers that
    		// don't support it.
    		if ( nodeName( elem, "template" ) ) {
    			elem = elem.content || elem;
    		}

    		return jQuery.merge( [], elem.childNodes );
    	}
    }, function( name, fn ) {
    	jQuery.fn[ name ] = function( until, selector ) {
    		var matched = jQuery.map( this, fn, until );

    		if ( name.slice( -5 ) !== "Until" ) {
    			selector = until;
    		}

    		if ( selector && typeof selector === "string" ) {
    			matched = jQuery.filter( selector, matched );
    		}

    		if ( this.length > 1 ) {

    			// Remove duplicates
    			if ( !guaranteedUnique[ name ] ) {
    				jQuery.uniqueSort( matched );
    			}

    			// Reverse order for parents* and prev-derivatives
    			if ( rparentsprev.test( name ) ) {
    				matched.reverse();
    			}
    		}

    		return this.pushStack( matched );
    	};
    } );
    var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



    // Convert String-formatted options into Object-formatted ones
    function createOptions( options ) {
    	var object = {};
    	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
    		object[ flag ] = true;
    	} );
    	return object;
    }

    /*
     * Create a callback list using the following parameters:
     *
     *	options: an optional list of space-separated options that will change how
     *			the callback list behaves or a more traditional option object
     *
     * By default a callback list will act like an event callback list and can be
     * "fired" multiple times.
     *
     * Possible options:
     *
     *	once:			will ensure the callback list can only be fired once (like a Deferred)
     *
     *	memory:			will keep track of previous values and will call any callback added
     *					after the list has been fired right away with the latest "memorized"
     *					values (like a Deferred)
     *
     *	unique:			will ensure a callback can only be added once (no duplicate in the list)
     *
     *	stopOnFalse:	interrupt callings when a callback returns false
     *
     */
    jQuery.Callbacks = function( options ) {

    	// Convert options from String-formatted to Object-formatted if needed
    	// (we check in cache first)
    	options = typeof options === "string" ?
    		createOptions( options ) :
    		jQuery.extend( {}, options );

    	var // Flag to know if list is currently firing
    		firing,

    		// Last fire value for non-forgettable lists
    		memory,

    		// Flag to know if list was already fired
    		fired,

    		// Flag to prevent firing
    		locked,

    		// Actual callback list
    		list = [],

    		// Queue of execution data for repeatable lists
    		queue = [],

    		// Index of currently firing callback (modified by add/remove as needed)
    		firingIndex = -1,

    		// Fire callbacks
    		fire = function() {

    			// Enforce single-firing
    			locked = locked || options.once;

    			// Execute callbacks for all pending executions,
    			// respecting firingIndex overrides and runtime changes
    			fired = firing = true;
    			for ( ; queue.length; firingIndex = -1 ) {
    				memory = queue.shift();
    				while ( ++firingIndex < list.length ) {

    					// Run callback and check for early termination
    					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
    						options.stopOnFalse ) {

    						// Jump to end and forget the data so .add doesn't re-fire
    						firingIndex = list.length;
    						memory = false;
    					}
    				}
    			}

    			// Forget the data if we're done with it
    			if ( !options.memory ) {
    				memory = false;
    			}

    			firing = false;

    			// Clean up if we're done firing for good
    			if ( locked ) {

    				// Keep an empty list if we have data for future add calls
    				if ( memory ) {
    					list = [];

    				// Otherwise, this object is spent
    				} else {
    					list = "";
    				}
    			}
    		},

    		// Actual Callbacks object
    		self = {

    			// Add a callback or a collection of callbacks to the list
    			add: function() {
    				if ( list ) {

    					// If we have memory from a past run, we should fire after adding
    					if ( memory && !firing ) {
    						firingIndex = list.length - 1;
    						queue.push( memory );
    					}

    					( function add( args ) {
    						jQuery.each( args, function( _, arg ) {
    							if ( isFunction( arg ) ) {
    								if ( !options.unique || !self.has( arg ) ) {
    									list.push( arg );
    								}
    							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

    								// Inspect recursively
    								add( arg );
    							}
    						} );
    					} )( arguments );

    					if ( memory && !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},

    			// Remove a callback from the list
    			remove: function() {
    				jQuery.each( arguments, function( _, arg ) {
    					var index;
    					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
    						list.splice( index, 1 );

    						// Handle firing indexes
    						if ( index <= firingIndex ) {
    							firingIndex--;
    						}
    					}
    				} );
    				return this;
    			},

    			// Check if a given callback is in the list.
    			// If no argument is given, return whether or not list has callbacks attached.
    			has: function( fn ) {
    				return fn ?
    					jQuery.inArray( fn, list ) > -1 :
    					list.length > 0;
    			},

    			// Remove all callbacks from the list
    			empty: function() {
    				if ( list ) {
    					list = [];
    				}
    				return this;
    			},

    			// Disable .fire and .add
    			// Abort any current/pending executions
    			// Clear all callbacks and values
    			disable: function() {
    				locked = queue = [];
    				list = memory = "";
    				return this;
    			},
    			disabled: function() {
    				return !list;
    			},

    			// Disable .fire
    			// Also disable .add unless we have memory (since it would have no effect)
    			// Abort any pending executions
    			lock: function() {
    				locked = queue = [];
    				if ( !memory && !firing ) {
    					list = memory = "";
    				}
    				return this;
    			},
    			locked: function() {
    				return !!locked;
    			},

    			// Call all callbacks with the given context and arguments
    			fireWith: function( context, args ) {
    				if ( !locked ) {
    					args = args || [];
    					args = [ context, args.slice ? args.slice() : args ];
    					queue.push( args );
    					if ( !firing ) {
    						fire();
    					}
    				}
    				return this;
    			},

    			// Call all the callbacks with the given arguments
    			fire: function() {
    				self.fireWith( this, arguments );
    				return this;
    			},

    			// To know if the callbacks have already been called at least once
    			fired: function() {
    				return !!fired;
    			}
    		};

    	return self;
    };


    function Identity( v ) {
    	return v;
    }
    function Thrower( ex ) {
    	throw ex;
    }

    function adoptValue( value, resolve, reject, noValue ) {
    	var method;

    	try {

    		// Check for promise aspect first to privilege synchronous behavior
    		if ( value && isFunction( ( method = value.promise ) ) ) {
    			method.call( value ).done( resolve ).fail( reject );

    		// Other thenables
    		} else if ( value && isFunction( ( method = value.then ) ) ) {
    			method.call( value, resolve, reject );

    		// Other non-thenables
    		} else {

    			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
    			// * false: [ value ].slice( 0 ) => resolve( value )
    			// * true: [ value ].slice( 1 ) => resolve()
    			resolve.apply( undefined, [ value ].slice( noValue ) );
    		}

    	// For Promises/A+, convert exceptions into rejections
    	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
    	// Deferred#then to conditionally suppress rejection.
    	} catch ( value ) {

    		// Support: Android 4.0 only
    		// Strict mode functions invoked without .call/.apply get global-object context
    		reject.apply( undefined, [ value ] );
    	}
    }

    jQuery.extend( {

    	Deferred: function( func ) {
    		var tuples = [

    				// action, add listener, callbacks,
    				// ... .then handlers, argument index, [final state]
    				[ "notify", "progress", jQuery.Callbacks( "memory" ),
    					jQuery.Callbacks( "memory" ), 2 ],
    				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
    					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
    				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
    					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
    			],
    			state = "pending",
    			promise = {
    				state: function() {
    					return state;
    				},
    				always: function() {
    					deferred.done( arguments ).fail( arguments );
    					return this;
    				},
    				"catch": function( fn ) {
    					return promise.then( null, fn );
    				},

    				// Keep pipe for back-compat
    				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
    					var fns = arguments;

    					return jQuery.Deferred( function( newDefer ) {
    						jQuery.each( tuples, function( _i, tuple ) {

    							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
    							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

    							// deferred.progress(function() { bind to newDefer or newDefer.notify })
    							// deferred.done(function() { bind to newDefer or newDefer.resolve })
    							// deferred.fail(function() { bind to newDefer or newDefer.reject })
    							deferred[ tuple[ 1 ] ]( function() {
    								var returned = fn && fn.apply( this, arguments );
    								if ( returned && isFunction( returned.promise ) ) {
    									returned.promise()
    										.progress( newDefer.notify )
    										.done( newDefer.resolve )
    										.fail( newDefer.reject );
    								} else {
    									newDefer[ tuple[ 0 ] + "With" ](
    										this,
    										fn ? [ returned ] : arguments
    									);
    								}
    							} );
    						} );
    						fns = null;
    					} ).promise();
    				},
    				then: function( onFulfilled, onRejected, onProgress ) {
    					var maxDepth = 0;
    					function resolve( depth, deferred, handler, special ) {
    						return function() {
    							var that = this,
    								args = arguments,
    								mightThrow = function() {
    									var returned, then;

    									// Support: Promises/A+ section 2.3.3.3.3
    									// https://promisesaplus.com/#point-59
    									// Ignore double-resolution attempts
    									if ( depth < maxDepth ) {
    										return;
    									}

    									returned = handler.apply( that, args );

    									// Support: Promises/A+ section 2.3.1
    									// https://promisesaplus.com/#point-48
    									if ( returned === deferred.promise() ) {
    										throw new TypeError( "Thenable self-resolution" );
    									}

    									// Support: Promises/A+ sections 2.3.3.1, 3.5
    									// https://promisesaplus.com/#point-54
    									// https://promisesaplus.com/#point-75
    									// Retrieve `then` only once
    									then = returned &&

    										// Support: Promises/A+ section 2.3.4
    										// https://promisesaplus.com/#point-64
    										// Only check objects and functions for thenability
    										( typeof returned === "object" ||
    											typeof returned === "function" ) &&
    										returned.then;

    									// Handle a returned thenable
    									if ( isFunction( then ) ) {

    										// Special processors (notify) just wait for resolution
    										if ( special ) {
    											then.call(
    												returned,
    												resolve( maxDepth, deferred, Identity, special ),
    												resolve( maxDepth, deferred, Thrower, special )
    											);

    										// Normal processors (resolve) also hook into progress
    										} else {

    											// ...and disregard older resolution values
    											maxDepth++;

    											then.call(
    												returned,
    												resolve( maxDepth, deferred, Identity, special ),
    												resolve( maxDepth, deferred, Thrower, special ),
    												resolve( maxDepth, deferred, Identity,
    													deferred.notifyWith )
    											);
    										}

    									// Handle all other returned values
    									} else {

    										// Only substitute handlers pass on context
    										// and multiple values (non-spec behavior)
    										if ( handler !== Identity ) {
    											that = undefined;
    											args = [ returned ];
    										}

    										// Process the value(s)
    										// Default process is resolve
    										( special || deferred.resolveWith )( that, args );
    									}
    								},

    								// Only normal processors (resolve) catch and reject exceptions
    								process = special ?
    									mightThrow :
    									function() {
    										try {
    											mightThrow();
    										} catch ( e ) {

    											if ( jQuery.Deferred.exceptionHook ) {
    												jQuery.Deferred.exceptionHook( e,
    													process.stackTrace );
    											}

    											// Support: Promises/A+ section 2.3.3.3.4.1
    											// https://promisesaplus.com/#point-61
    											// Ignore post-resolution exceptions
    											if ( depth + 1 >= maxDepth ) {

    												// Only substitute handlers pass on context
    												// and multiple values (non-spec behavior)
    												if ( handler !== Thrower ) {
    													that = undefined;
    													args = [ e ];
    												}

    												deferred.rejectWith( that, args );
    											}
    										}
    									};

    							// Support: Promises/A+ section 2.3.3.3.1
    							// https://promisesaplus.com/#point-57
    							// Re-resolve promises immediately to dodge false rejection from
    							// subsequent errors
    							if ( depth ) {
    								process();
    							} else {

    								// Call an optional hook to record the stack, in case of exception
    								// since it's otherwise lost when execution goes async
    								if ( jQuery.Deferred.getStackHook ) {
    									process.stackTrace = jQuery.Deferred.getStackHook();
    								}
    								window.setTimeout( process );
    							}
    						};
    					}

    					return jQuery.Deferred( function( newDefer ) {

    						// progress_handlers.add( ... )
    						tuples[ 0 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onProgress ) ?
    									onProgress :
    									Identity,
    								newDefer.notifyWith
    							)
    						);

    						// fulfilled_handlers.add( ... )
    						tuples[ 1 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onFulfilled ) ?
    									onFulfilled :
    									Identity
    							)
    						);

    						// rejected_handlers.add( ... )
    						tuples[ 2 ][ 3 ].add(
    							resolve(
    								0,
    								newDefer,
    								isFunction( onRejected ) ?
    									onRejected :
    									Thrower
    							)
    						);
    					} ).promise();
    				},

    				// Get a promise for this deferred
    				// If obj is provided, the promise aspect is added to the object
    				promise: function( obj ) {
    					return obj != null ? jQuery.extend( obj, promise ) : promise;
    				}
    			},
    			deferred = {};

    		// Add list-specific methods
    		jQuery.each( tuples, function( i, tuple ) {
    			var list = tuple[ 2 ],
    				stateString = tuple[ 5 ];

    			// promise.progress = list.add
    			// promise.done = list.add
    			// promise.fail = list.add
    			promise[ tuple[ 1 ] ] = list.add;

    			// Handle state
    			if ( stateString ) {
    				list.add(
    					function() {

    						// state = "resolved" (i.e., fulfilled)
    						// state = "rejected"
    						state = stateString;
    					},

    					// rejected_callbacks.disable
    					// fulfilled_callbacks.disable
    					tuples[ 3 - i ][ 2 ].disable,

    					// rejected_handlers.disable
    					// fulfilled_handlers.disable
    					tuples[ 3 - i ][ 3 ].disable,

    					// progress_callbacks.lock
    					tuples[ 0 ][ 2 ].lock,

    					// progress_handlers.lock
    					tuples[ 0 ][ 3 ].lock
    				);
    			}

    			// progress_handlers.fire
    			// fulfilled_handlers.fire
    			// rejected_handlers.fire
    			list.add( tuple[ 3 ].fire );

    			// deferred.notify = function() { deferred.notifyWith(...) }
    			// deferred.resolve = function() { deferred.resolveWith(...) }
    			// deferred.reject = function() { deferred.rejectWith(...) }
    			deferred[ tuple[ 0 ] ] = function() {
    				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
    				return this;
    			};

    			// deferred.notifyWith = list.fireWith
    			// deferred.resolveWith = list.fireWith
    			// deferred.rejectWith = list.fireWith
    			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
    		} );

    		// Make the deferred a promise
    		promise.promise( deferred );

    		// Call given func if any
    		if ( func ) {
    			func.call( deferred, deferred );
    		}

    		// All done!
    		return deferred;
    	},

    	// Deferred helper
    	when: function( singleValue ) {
    		var

    			// count of uncompleted subordinates
    			remaining = arguments.length,

    			// count of unprocessed arguments
    			i = remaining,

    			// subordinate fulfillment data
    			resolveContexts = Array( i ),
    			resolveValues = slice.call( arguments ),

    			// the master Deferred
    			master = jQuery.Deferred(),

    			// subordinate callback factory
    			updateFunc = function( i ) {
    				return function( value ) {
    					resolveContexts[ i ] = this;
    					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
    					if ( !( --remaining ) ) {
    						master.resolveWith( resolveContexts, resolveValues );
    					}
    				};
    			};

    		// Single- and empty arguments are adopted like Promise.resolve
    		if ( remaining <= 1 ) {
    			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
    				!remaining );

    			// Use .then() to unwrap secondary thenables (cf. gh-3000)
    			if ( master.state() === "pending" ||
    				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

    				return master.then();
    			}
    		}

    		// Multiple arguments are aggregated like Promise.all array elements
    		while ( i-- ) {
    			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
    		}

    		return master.promise();
    	}
    } );


    // These usually indicate a programmer mistake during development,
    // warn about them ASAP rather than swallowing them by default.
    var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

    jQuery.Deferred.exceptionHook = function( error, stack ) {

    	// Support: IE 8 - 9 only
    	// Console exists when dev tools are open, which can happen at any time
    	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
    		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
    	}
    };




    jQuery.readyException = function( error ) {
    	window.setTimeout( function() {
    		throw error;
    	} );
    };




    // The deferred used on DOM ready
    var readyList = jQuery.Deferred();

    jQuery.fn.ready = function( fn ) {

    	readyList
    		.then( fn )

    		// Wrap jQuery.readyException in a function so that the lookup
    		// happens at the time of error handling instead of callback
    		// registration.
    		.catch( function( error ) {
    			jQuery.readyException( error );
    		} );

    	return this;
    };

    jQuery.extend( {

    	// Is the DOM ready to be used? Set to true once it occurs.
    	isReady: false,

    	// A counter to track how many items to wait for before
    	// the ready event fires. See #6781
    	readyWait: 1,

    	// Handle when the DOM is ready
    	ready: function( wait ) {

    		// Abort if there are pending holds or we're already ready
    		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
    			return;
    		}

    		// Remember that the DOM is ready
    		jQuery.isReady = true;

    		// If a normal DOM Ready event fired, decrement, and wait if need be
    		if ( wait !== true && --jQuery.readyWait > 0 ) {
    			return;
    		}

    		// If there are functions bound, to execute
    		readyList.resolveWith( document, [ jQuery ] );
    	}
    } );

    jQuery.ready.then = readyList.then;

    // The ready event handler and self cleanup method
    function completed() {
    	document.removeEventListener( "DOMContentLoaded", completed );
    	window.removeEventListener( "load", completed );
    	jQuery.ready();
    }

    // Catch cases where $(document).ready() is called
    // after the browser event has already occurred.
    // Support: IE <=9 - 10 only
    // Older IE sometimes signals "interactive" too soon
    if ( document.readyState === "complete" ||
    	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

    	// Handle it asynchronously to allow scripts the opportunity to delay ready
    	window.setTimeout( jQuery.ready );

    } else {

    	// Use the handy event callback
    	document.addEventListener( "DOMContentLoaded", completed );

    	// A fallback to window.onload, that will always work
    	window.addEventListener( "load", completed );
    }




    // Multifunctional method to get and set values of a collection
    // The value/s can optionally be executed if it's a function
    var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
    	var i = 0,
    		len = elems.length,
    		bulk = key == null;

    	// Sets many values
    	if ( toType( key ) === "object" ) {
    		chainable = true;
    		for ( i in key ) {
    			access( elems, fn, i, key[ i ], true, emptyGet, raw );
    		}

    	// Sets one value
    	} else if ( value !== undefined ) {
    		chainable = true;

    		if ( !isFunction( value ) ) {
    			raw = true;
    		}

    		if ( bulk ) {

    			// Bulk operations run against the entire set
    			if ( raw ) {
    				fn.call( elems, value );
    				fn = null;

    			// ...except when executing function values
    			} else {
    				bulk = fn;
    				fn = function( elem, _key, value ) {
    					return bulk.call( jQuery( elem ), value );
    				};
    			}
    		}

    		if ( fn ) {
    			for ( ; i < len; i++ ) {
    				fn(
    					elems[ i ], key, raw ?
    					value :
    					value.call( elems[ i ], i, fn( elems[ i ], key ) )
    				);
    			}
    		}
    	}

    	if ( chainable ) {
    		return elems;
    	}

    	// Gets
    	if ( bulk ) {
    		return fn.call( elems );
    	}

    	return len ? fn( elems[ 0 ], key ) : emptyGet;
    };


    // Matches dashed string for camelizing
    var rmsPrefix = /^-ms-/,
    	rdashAlpha = /-([a-z])/g;

    // Used by camelCase as callback to replace()
    function fcamelCase( _all, letter ) {
    	return letter.toUpperCase();
    }

    // Convert dashed to camelCase; used by the css and data modules
    // Support: IE <=9 - 11, Edge 12 - 15
    // Microsoft forgot to hump their vendor prefix (#9572)
    function camelCase( string ) {
    	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
    }
    var acceptData = function( owner ) {

    	// Accepts only:
    	//  - Node
    	//    - Node.ELEMENT_NODE
    	//    - Node.DOCUMENT_NODE
    	//  - Object
    	//    - Any
    	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
    };




    function Data() {
    	this.expando = jQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.prototype = {

    	cache: function( owner ) {

    		// Check if the owner object already has a cache
    		var value = owner[ this.expando ];

    		// If not, create one
    		if ( !value ) {
    			value = {};

    			// We can accept data for non-element nodes in modern browsers,
    			// but we should not, see #8335.
    			// Always return an empty object.
    			if ( acceptData( owner ) ) {

    				// If it is a node unlikely to be stringify-ed or looped over
    				// use plain assignment
    				if ( owner.nodeType ) {
    					owner[ this.expando ] = value;

    				// Otherwise secure it in a non-enumerable property
    				// configurable must be true to allow the property to be
    				// deleted when data is removed
    				} else {
    					Object.defineProperty( owner, this.expando, {
    						value: value,
    						configurable: true
    					} );
    				}
    			}
    		}

    		return value;
    	},
    	set: function( owner, data, value ) {
    		var prop,
    			cache = this.cache( owner );

    		// Handle: [ owner, key, value ] args
    		// Always use camelCase key (gh-2257)
    		if ( typeof data === "string" ) {
    			cache[ camelCase( data ) ] = value;

    		// Handle: [ owner, { properties } ] args
    		} else {

    			// Copy the properties one-by-one to the cache object
    			for ( prop in data ) {
    				cache[ camelCase( prop ) ] = data[ prop ];
    			}
    		}
    		return cache;
    	},
    	get: function( owner, key ) {
    		return key === undefined ?
    			this.cache( owner ) :

    			// Always use camelCase key (gh-2257)
    			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
    	},
    	access: function( owner, key, value ) {

    		// In cases where either:
    		//
    		//   1. No key was specified
    		//   2. A string key was specified, but no value provided
    		//
    		// Take the "read" path and allow the get method to determine
    		// which value to return, respectively either:
    		//
    		//   1. The entire cache object
    		//   2. The data stored at the key
    		//
    		if ( key === undefined ||
    				( ( key && typeof key === "string" ) && value === undefined ) ) {

    			return this.get( owner, key );
    		}

    		// When the key is not a string, or both a key and value
    		// are specified, set or extend (existing objects) with either:
    		//
    		//   1. An object of properties
    		//   2. A key and value
    		//
    		this.set( owner, key, value );

    		// Since the "set" path can have two possible entry points
    		// return the expected data based on which path was taken[*]
    		return value !== undefined ? value : key;
    	},
    	remove: function( owner, key ) {
    		var i,
    			cache = owner[ this.expando ];

    		if ( cache === undefined ) {
    			return;
    		}

    		if ( key !== undefined ) {

    			// Support array or space separated string of keys
    			if ( Array.isArray( key ) ) {

    				// If key is an array of keys...
    				// We always set camelCase keys, so remove that.
    				key = key.map( camelCase );
    			} else {
    				key = camelCase( key );

    				// If a key with the spaces exists, use it.
    				// Otherwise, create an array by matching non-whitespace
    				key = key in cache ?
    					[ key ] :
    					( key.match( rnothtmlwhite ) || [] );
    			}

    			i = key.length;

    			while ( i-- ) {
    				delete cache[ key[ i ] ];
    			}
    		}

    		// Remove the expando if there's no more data
    		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

    			// Support: Chrome <=35 - 45
    			// Webkit & Blink performance suffers when deleting properties
    			// from DOM nodes, so set to undefined instead
    			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
    			if ( owner.nodeType ) {
    				owner[ this.expando ] = undefined;
    			} else {
    				delete owner[ this.expando ];
    			}
    		}
    	},
    	hasData: function( owner ) {
    		var cache = owner[ this.expando ];
    		return cache !== undefined && !jQuery.isEmptyObject( cache );
    	}
    };
    var dataPriv = new Data();

    var dataUser = new Data();



    //	Implementation Summary
    //
    //	1. Enforce API surface and semantic compatibility with 1.9.x branch
    //	2. Improve the module's maintainability by reducing the storage
    //		paths to a single mechanism.
    //	3. Use the same single mechanism to support "private" and "user" data.
    //	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
    //	5. Avoid exposing implementation details on user objects (eg. expando properties)
    //	6. Provide a clear path for implementation upgrade to WeakMap in 2014

    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    	rmultiDash = /[A-Z]/g;

    function getData( data ) {
    	if ( data === "true" ) {
    		return true;
    	}

    	if ( data === "false" ) {
    		return false;
    	}

    	if ( data === "null" ) {
    		return null;
    	}

    	// Only convert to a number if it doesn't change the string
    	if ( data === +data + "" ) {
    		return +data;
    	}

    	if ( rbrace.test( data ) ) {
    		return JSON.parse( data );
    	}

    	return data;
    }

    function dataAttr( elem, key, data ) {
    	var name;

    	// If nothing was found internally, try to fetch any
    	// data from the HTML5 data-* attribute
    	if ( data === undefined && elem.nodeType === 1 ) {
    		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
    		data = elem.getAttribute( name );

    		if ( typeof data === "string" ) {
    			try {
    				data = getData( data );
    			} catch ( e ) {}

    			// Make sure we set the data so it isn't changed later
    			dataUser.set( elem, key, data );
    		} else {
    			data = undefined;
    		}
    	}
    	return data;
    }

    jQuery.extend( {
    	hasData: function( elem ) {
    		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
    	},

    	data: function( elem, name, data ) {
    		return dataUser.access( elem, name, data );
    	},

    	removeData: function( elem, name ) {
    		dataUser.remove( elem, name );
    	},

    	// TODO: Now that all calls to _data and _removeData have been replaced
    	// with direct calls to dataPriv methods, these can be deprecated.
    	_data: function( elem, name, data ) {
    		return dataPriv.access( elem, name, data );
    	},

    	_removeData: function( elem, name ) {
    		dataPriv.remove( elem, name );
    	}
    } );

    jQuery.fn.extend( {
    	data: function( key, value ) {
    		var i, name, data,
    			elem = this[ 0 ],
    			attrs = elem && elem.attributes;

    		// Gets all values
    		if ( key === undefined ) {
    			if ( this.length ) {
    				data = dataUser.get( elem );

    				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
    					i = attrs.length;
    					while ( i-- ) {

    						// Support: IE 11 only
    						// The attrs elements can be null (#14894)
    						if ( attrs[ i ] ) {
    							name = attrs[ i ].name;
    							if ( name.indexOf( "data-" ) === 0 ) {
    								name = camelCase( name.slice( 5 ) );
    								dataAttr( elem, name, data[ name ] );
    							}
    						}
    					}
    					dataPriv.set( elem, "hasDataAttrs", true );
    				}
    			}

    			return data;
    		}

    		// Sets multiple values
    		if ( typeof key === "object" ) {
    			return this.each( function() {
    				dataUser.set( this, key );
    			} );
    		}

    		return access( this, function( value ) {
    			var data;

    			// The calling jQuery object (element matches) is not empty
    			// (and therefore has an element appears at this[ 0 ]) and the
    			// `value` parameter was not undefined. An empty jQuery object
    			// will result in `undefined` for elem = this[ 0 ] which will
    			// throw an exception if an attempt to read a data cache is made.
    			if ( elem && value === undefined ) {

    				// Attempt to get data from the cache
    				// The key will always be camelCased in Data
    				data = dataUser.get( elem, key );
    				if ( data !== undefined ) {
    					return data;
    				}

    				// Attempt to "discover" the data in
    				// HTML5 custom data-* attrs
    				data = dataAttr( elem, key );
    				if ( data !== undefined ) {
    					return data;
    				}

    				// We tried really hard, but the data doesn't exist.
    				return;
    			}

    			// Set the data...
    			this.each( function() {

    				// We always store the camelCased key
    				dataUser.set( this, key, value );
    			} );
    		}, null, value, arguments.length > 1, null, true );
    	},

    	removeData: function( key ) {
    		return this.each( function() {
    			dataUser.remove( this, key );
    		} );
    	}
    } );


    jQuery.extend( {
    	queue: function( elem, type, data ) {
    		var queue;

    		if ( elem ) {
    			type = ( type || "fx" ) + "queue";
    			queue = dataPriv.get( elem, type );

    			// Speed up dequeue by getting out quickly if this is just a lookup
    			if ( data ) {
    				if ( !queue || Array.isArray( data ) ) {
    					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
    				} else {
    					queue.push( data );
    				}
    			}
    			return queue || [];
    		}
    	},

    	dequeue: function( elem, type ) {
    		type = type || "fx";

    		var queue = jQuery.queue( elem, type ),
    			startLength = queue.length,
    			fn = queue.shift(),
    			hooks = jQuery._queueHooks( elem, type ),
    			next = function() {
    				jQuery.dequeue( elem, type );
    			};

    		// If the fx queue is dequeued, always remove the progress sentinel
    		if ( fn === "inprogress" ) {
    			fn = queue.shift();
    			startLength--;
    		}

    		if ( fn ) {

    			// Add a progress sentinel to prevent the fx queue from being
    			// automatically dequeued
    			if ( type === "fx" ) {
    				queue.unshift( "inprogress" );
    			}

    			// Clear up the last queue stop function
    			delete hooks.stop;
    			fn.call( elem, next, hooks );
    		}

    		if ( !startLength && hooks ) {
    			hooks.empty.fire();
    		}
    	},

    	// Not public - generate a queueHooks object, or return the current one
    	_queueHooks: function( elem, type ) {
    		var key = type + "queueHooks";
    		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
    			empty: jQuery.Callbacks( "once memory" ).add( function() {
    				dataPriv.remove( elem, [ type + "queue", key ] );
    			} )
    		} );
    	}
    } );

    jQuery.fn.extend( {
    	queue: function( type, data ) {
    		var setter = 2;

    		if ( typeof type !== "string" ) {
    			data = type;
    			type = "fx";
    			setter--;
    		}

    		if ( arguments.length < setter ) {
    			return jQuery.queue( this[ 0 ], type );
    		}

    		return data === undefined ?
    			this :
    			this.each( function() {
    				var queue = jQuery.queue( this, type, data );

    				// Ensure a hooks for this queue
    				jQuery._queueHooks( this, type );

    				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
    					jQuery.dequeue( this, type );
    				}
    			} );
    	},
    	dequeue: function( type ) {
    		return this.each( function() {
    			jQuery.dequeue( this, type );
    		} );
    	},
    	clearQueue: function( type ) {
    		return this.queue( type || "fx", [] );
    	},

    	// Get a promise resolved when queues of a certain type
    	// are emptied (fx is the type by default)
    	promise: function( type, obj ) {
    		var tmp,
    			count = 1,
    			defer = jQuery.Deferred(),
    			elements = this,
    			i = this.length,
    			resolve = function() {
    				if ( !( --count ) ) {
    					defer.resolveWith( elements, [ elements ] );
    				}
    			};

    		if ( typeof type !== "string" ) {
    			obj = type;
    			type = undefined;
    		}
    		type = type || "fx";

    		while ( i-- ) {
    			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
    			if ( tmp && tmp.empty ) {
    				count++;
    				tmp.empty.add( resolve );
    			}
    		}
    		resolve();
    		return defer.promise( obj );
    	}
    } );
    var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

    var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


    var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

    var documentElement = document.documentElement;



    	var isAttached = function( elem ) {
    			return jQuery.contains( elem.ownerDocument, elem );
    		},
    		composed = { composed: true };

    	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
    	// Check attachment across shadow DOM boundaries when possible (gh-3504)
    	// Support: iOS 10.0-10.2 only
    	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
    	// leading to errors. We need to check for `getRootNode`.
    	if ( documentElement.getRootNode ) {
    		isAttached = function( elem ) {
    			return jQuery.contains( elem.ownerDocument, elem ) ||
    				elem.getRootNode( composed ) === elem.ownerDocument;
    		};
    	}
    var isHiddenWithinTree = function( elem, el ) {

    		// isHiddenWithinTree might be called from jQuery#filter function;
    		// in that case, element will be second argument
    		elem = el || elem;

    		// Inline style trumps all
    		return elem.style.display === "none" ||
    			elem.style.display === "" &&

    			// Otherwise, check computed style
    			// Support: Firefox <=43 - 45
    			// Disconnected elements can have computed display: none, so first confirm that elem is
    			// in the document.
    			isAttached( elem ) &&

    			jQuery.css( elem, "display" ) === "none";
    	};



    function adjustCSS( elem, prop, valueParts, tween ) {
    	var adjusted, scale,
    		maxIterations = 20,
    		currentValue = tween ?
    			function() {
    				return tween.cur();
    			} :
    			function() {
    				return jQuery.css( elem, prop, "" );
    			},
    		initial = currentValue(),
    		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

    		// Starting value computation is required for potential unit mismatches
    		initialInUnit = elem.nodeType &&
    			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
    			rcssNum.exec( jQuery.css( elem, prop ) );

    	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

    		// Support: Firefox <=54
    		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
    		initial = initial / 2;

    		// Trust units reported by jQuery.css
    		unit = unit || initialInUnit[ 3 ];

    		// Iteratively approximate from a nonzero starting point
    		initialInUnit = +initial || 1;

    		while ( maxIterations-- ) {

    			// Evaluate and update our best guess (doubling guesses that zero out).
    			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
    			jQuery.style( elem, prop, initialInUnit + unit );
    			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
    				maxIterations = 0;
    			}
    			initialInUnit = initialInUnit / scale;

    		}

    		initialInUnit = initialInUnit * 2;
    		jQuery.style( elem, prop, initialInUnit + unit );

    		// Make sure we update the tween properties later on
    		valueParts = valueParts || [];
    	}

    	if ( valueParts ) {
    		initialInUnit = +initialInUnit || +initial || 0;

    		// Apply relative offset (+=/-=) if specified
    		adjusted = valueParts[ 1 ] ?
    			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
    			+valueParts[ 2 ];
    		if ( tween ) {
    			tween.unit = unit;
    			tween.start = initialInUnit;
    			tween.end = adjusted;
    		}
    	}
    	return adjusted;
    }


    var defaultDisplayMap = {};

    function getDefaultDisplay( elem ) {
    	var temp,
    		doc = elem.ownerDocument,
    		nodeName = elem.nodeName,
    		display = defaultDisplayMap[ nodeName ];

    	if ( display ) {
    		return display;
    	}

    	temp = doc.body.appendChild( doc.createElement( nodeName ) );
    	display = jQuery.css( temp, "display" );

    	temp.parentNode.removeChild( temp );

    	if ( display === "none" ) {
    		display = "block";
    	}
    	defaultDisplayMap[ nodeName ] = display;

    	return display;
    }

    function showHide( elements, show ) {
    	var display, elem,
    		values = [],
    		index = 0,
    		length = elements.length;

    	// Determine new display value for elements that need to change
    	for ( ; index < length; index++ ) {
    		elem = elements[ index ];
    		if ( !elem.style ) {
    			continue;
    		}

    		display = elem.style.display;
    		if ( show ) {

    			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
    			// check is required in this first loop unless we have a nonempty display value (either
    			// inline or about-to-be-restored)
    			if ( display === "none" ) {
    				values[ index ] = dataPriv.get( elem, "display" ) || null;
    				if ( !values[ index ] ) {
    					elem.style.display = "";
    				}
    			}
    			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
    				values[ index ] = getDefaultDisplay( elem );
    			}
    		} else {
    			if ( display !== "none" ) {
    				values[ index ] = "none";

    				// Remember what we're overwriting
    				dataPriv.set( elem, "display", display );
    			}
    		}
    	}

    	// Set the display of the elements in a second loop to avoid constant reflow
    	for ( index = 0; index < length; index++ ) {
    		if ( values[ index ] != null ) {
    			elements[ index ].style.display = values[ index ];
    		}
    	}

    	return elements;
    }

    jQuery.fn.extend( {
    	show: function() {
    		return showHide( this, true );
    	},
    	hide: function() {
    		return showHide( this );
    	},
    	toggle: function( state ) {
    		if ( typeof state === "boolean" ) {
    			return state ? this.show() : this.hide();
    		}

    		return this.each( function() {
    			if ( isHiddenWithinTree( this ) ) {
    				jQuery( this ).show();
    			} else {
    				jQuery( this ).hide();
    			}
    		} );
    	}
    } );
    var rcheckableType = ( /^(?:checkbox|radio)$/i );

    var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

    var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



    ( function() {
    	var fragment = document.createDocumentFragment(),
    		div = fragment.appendChild( document.createElement( "div" ) ),
    		input = document.createElement( "input" );

    	// Support: Android 4.0 - 4.3 only
    	// Check state lost if the name is set (#11217)
    	// Support: Windows Web Apps (WWA)
    	// `name` and `type` must use .setAttribute for WWA (#14901)
    	input.setAttribute( "type", "radio" );
    	input.setAttribute( "checked", "checked" );
    	input.setAttribute( "name", "t" );

    	div.appendChild( input );

    	// Support: Android <=4.1 only
    	// Older WebKit doesn't clone checked state correctly in fragments
    	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

    	// Support: IE <=11 only
    	// Make sure textarea (and checkbox) defaultValue is properly cloned
    	div.innerHTML = "<textarea>x</textarea>";
    	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

    	// Support: IE <=9 only
    	// IE <=9 replaces <option> tags with their contents when inserted outside of
    	// the select element.
    	div.innerHTML = "<option></option>";
    	support.option = !!div.lastChild;
    } )();


    // We have to close these tags to support XHTML (#13200)
    var wrapMap = {

    	// XHTML parsers do not magically insert elements in the
    	// same way that tag soup parsers do. So we cannot shorten
    	// this by omitting <tbody> or other required elements.
    	thead: [ 1, "<table>", "</table>" ],
    	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
    	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
    	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

    	_default: [ 0, "", "" ]
    };

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;

    // Support: IE <=9 only
    if ( !support.option ) {
    	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
    }


    function getAll( context, tag ) {

    	// Support: IE <=9 - 11 only
    	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
    	var ret;

    	if ( typeof context.getElementsByTagName !== "undefined" ) {
    		ret = context.getElementsByTagName( tag || "*" );

    	} else if ( typeof context.querySelectorAll !== "undefined" ) {
    		ret = context.querySelectorAll( tag || "*" );

    	} else {
    		ret = [];
    	}

    	if ( tag === undefined || tag && nodeName( context, tag ) ) {
    		return jQuery.merge( [ context ], ret );
    	}

    	return ret;
    }


    // Mark scripts as having already been evaluated
    function setGlobalEval( elems, refElements ) {
    	var i = 0,
    		l = elems.length;

    	for ( ; i < l; i++ ) {
    		dataPriv.set(
    			elems[ i ],
    			"globalEval",
    			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
    		);
    	}
    }


    var rhtml = /<|&#?\w+;/;

    function buildFragment( elems, context, scripts, selection, ignored ) {
    	var elem, tmp, tag, wrap, attached, j,
    		fragment = context.createDocumentFragment(),
    		nodes = [],
    		i = 0,
    		l = elems.length;

    	for ( ; i < l; i++ ) {
    		elem = elems[ i ];

    		if ( elem || elem === 0 ) {

    			// Add nodes directly
    			if ( toType( elem ) === "object" ) {

    				// Support: Android <=4.0 only, PhantomJS 1 only
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

    			// Convert non-html into a text node
    			} else if ( !rhtml.test( elem ) ) {
    				nodes.push( context.createTextNode( elem ) );

    			// Convert html into DOM nodes
    			} else {
    				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

    				// Deserialize a standard representation
    				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
    				wrap = wrapMap[ tag ] || wrapMap._default;
    				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

    				// Descend through wrappers to the right content
    				j = wrap[ 0 ];
    				while ( j-- ) {
    					tmp = tmp.lastChild;
    				}

    				// Support: Android <=4.0 only, PhantomJS 1 only
    				// push.apply(_, arraylike) throws on ancient WebKit
    				jQuery.merge( nodes, tmp.childNodes );

    				// Remember the top-level container
    				tmp = fragment.firstChild;

    				// Ensure the created nodes are orphaned (#12392)
    				tmp.textContent = "";
    			}
    		}
    	}

    	// Remove wrapper from fragment
    	fragment.textContent = "";

    	i = 0;
    	while ( ( elem = nodes[ i++ ] ) ) {

    		// Skip elements already in the context collection (trac-4087)
    		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
    			if ( ignored ) {
    				ignored.push( elem );
    			}
    			continue;
    		}

    		attached = isAttached( elem );

    		// Append to fragment
    		tmp = getAll( fragment.appendChild( elem ), "script" );

    		// Preserve script evaluation history
    		if ( attached ) {
    			setGlobalEval( tmp );
    		}

    		// Capture executables
    		if ( scripts ) {
    			j = 0;
    			while ( ( elem = tmp[ j++ ] ) ) {
    				if ( rscriptType.test( elem.type || "" ) ) {
    					scripts.push( elem );
    				}
    			}
    		}
    	}

    	return fragment;
    }


    var
    	rkeyEvent = /^key/,
    	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
    	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

    function returnTrue() {
    	return true;
    }

    function returnFalse() {
    	return false;
    }

    // Support: IE <=9 - 11+
    // focus() and blur() are asynchronous, except when they are no-op.
    // So expect focus to be synchronous when the element is already active,
    // and blur to be synchronous when the element is not already active.
    // (focus and blur are always synchronous in other supported browsers,
    // this just defines when we can count on it).
    function expectSync( elem, type ) {
    	return ( elem === safeActiveElement() ) === ( type === "focus" );
    }

    // Support: IE <=9 only
    // Accessing document.activeElement can throw unexpectedly
    // https://bugs.jquery.com/ticket/13393
    function safeActiveElement() {
    	try {
    		return document.activeElement;
    	} catch ( err ) { }
    }

    function on( elem, types, selector, data, fn, one ) {
    	var origFn, type;

    	// Types can be a map of types/handlers
    	if ( typeof types === "object" ) {

    		// ( types-Object, selector, data )
    		if ( typeof selector !== "string" ) {

    			// ( types-Object, data )
    			data = data || selector;
    			selector = undefined;
    		}
    		for ( type in types ) {
    			on( elem, type, selector, data, types[ type ], one );
    		}
    		return elem;
    	}

    	if ( data == null && fn == null ) {

    		// ( types, fn )
    		fn = selector;
    		data = selector = undefined;
    	} else if ( fn == null ) {
    		if ( typeof selector === "string" ) {

    			// ( types, selector, fn )
    			fn = data;
    			data = undefined;
    		} else {

    			// ( types, data, fn )
    			fn = data;
    			data = selector;
    			selector = undefined;
    		}
    	}
    	if ( fn === false ) {
    		fn = returnFalse;
    	} else if ( !fn ) {
    		return elem;
    	}

    	if ( one === 1 ) {
    		origFn = fn;
    		fn = function( event ) {

    			// Can use an empty set, since event contains the info
    			jQuery().off( event );
    			return origFn.apply( this, arguments );
    		};

    		// Use same guid so caller can remove using origFn
    		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
    	}
    	return elem.each( function() {
    		jQuery.event.add( this, types, fn, data, selector );
    	} );
    }

    /*
     * Helper functions for managing events -- not part of the public interface.
     * Props to Dean Edwards' addEvent library for many of the ideas.
     */
    jQuery.event = {

    	global: {},

    	add: function( elem, types, handler, data, selector ) {

    		var handleObjIn, eventHandle, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.get( elem );

    		// Only attach events to objects that accept data
    		if ( !acceptData( elem ) ) {
    			return;
    		}

    		// Caller can pass in an object of custom data in lieu of the handler
    		if ( handler.handler ) {
    			handleObjIn = handler;
    			handler = handleObjIn.handler;
    			selector = handleObjIn.selector;
    		}

    		// Ensure that invalid selectors throw exceptions at attach time
    		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
    		if ( selector ) {
    			jQuery.find.matchesSelector( documentElement, selector );
    		}

    		// Make sure that the handler has a unique ID, used to find/remove it later
    		if ( !handler.guid ) {
    			handler.guid = jQuery.guid++;
    		}

    		// Init the element's event structure and main handler, if this is the first
    		if ( !( events = elemData.events ) ) {
    			events = elemData.events = Object.create( null );
    		}
    		if ( !( eventHandle = elemData.handle ) ) {
    			eventHandle = elemData.handle = function( e ) {

    				// Discard the second event of a jQuery.event.trigger() and
    				// when an event is called after a page has unloaded
    				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
    					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
    			};
    		}

    		// Handle multiple events separated by a space
    		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    			// There *must* be a type, no attaching namespace-only handlers
    			if ( !type ) {
    				continue;
    			}

    			// If event changes its type, use the special event handlers for the changed type
    			special = jQuery.event.special[ type ] || {};

    			// If selector defined, determine special event api type, otherwise given type
    			type = ( selector ? special.delegateType : special.bindType ) || type;

    			// Update special based on newly reset type
    			special = jQuery.event.special[ type ] || {};

    			// handleObj is passed to all event handlers
    			handleObj = jQuery.extend( {
    				type: type,
    				origType: origType,
    				data: data,
    				handler: handler,
    				guid: handler.guid,
    				selector: selector,
    				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
    				namespace: namespaces.join( "." )
    			}, handleObjIn );

    			// Init the event handler queue if we're the first
    			if ( !( handlers = events[ type ] ) ) {
    				handlers = events[ type ] = [];
    				handlers.delegateCount = 0;

    				// Only use addEventListener if the special events handler returns false
    				if ( !special.setup ||
    					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

    					if ( elem.addEventListener ) {
    						elem.addEventListener( type, eventHandle );
    					}
    				}
    			}

    			if ( special.add ) {
    				special.add.call( elem, handleObj );

    				if ( !handleObj.handler.guid ) {
    					handleObj.handler.guid = handler.guid;
    				}
    			}

    			// Add to the element's handler list, delegates in front
    			if ( selector ) {
    				handlers.splice( handlers.delegateCount++, 0, handleObj );
    			} else {
    				handlers.push( handleObj );
    			}

    			// Keep track of which events have ever been used, for event optimization
    			jQuery.event.global[ type ] = true;
    		}

    	},

    	// Detach an event or set of events from an element
    	remove: function( elem, types, handler, selector, mappedTypes ) {

    		var j, origCount, tmp,
    			events, t, handleObj,
    			special, handlers, type, namespaces, origType,
    			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

    		if ( !elemData || !( events = elemData.events ) ) {
    			return;
    		}

    		// Once for each type.namespace in types; type may be omitted
    		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
    		t = types.length;
    		while ( t-- ) {
    			tmp = rtypenamespace.exec( types[ t ] ) || [];
    			type = origType = tmp[ 1 ];
    			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

    			// Unbind all events (on this namespace, if provided) for the element
    			if ( !type ) {
    				for ( type in events ) {
    					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
    				}
    				continue;
    			}

    			special = jQuery.event.special[ type ] || {};
    			type = ( selector ? special.delegateType : special.bindType ) || type;
    			handlers = events[ type ] || [];
    			tmp = tmp[ 2 ] &&
    				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

    			// Remove matching events
    			origCount = j = handlers.length;
    			while ( j-- ) {
    				handleObj = handlers[ j ];

    				if ( ( mappedTypes || origType === handleObj.origType ) &&
    					( !handler || handler.guid === handleObj.guid ) &&
    					( !tmp || tmp.test( handleObj.namespace ) ) &&
    					( !selector || selector === handleObj.selector ||
    						selector === "**" && handleObj.selector ) ) {
    					handlers.splice( j, 1 );

    					if ( handleObj.selector ) {
    						handlers.delegateCount--;
    					}
    					if ( special.remove ) {
    						special.remove.call( elem, handleObj );
    					}
    				}
    			}

    			// Remove generic event handler if we removed something and no more handlers exist
    			// (avoids potential for endless recursion during removal of special event handlers)
    			if ( origCount && !handlers.length ) {
    				if ( !special.teardown ||
    					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

    					jQuery.removeEvent( elem, type, elemData.handle );
    				}

    				delete events[ type ];
    			}
    		}

    		// Remove data and the expando if it's no longer used
    		if ( jQuery.isEmptyObject( events ) ) {
    			dataPriv.remove( elem, "handle events" );
    		}
    	},

    	dispatch: function( nativeEvent ) {

    		var i, j, ret, matched, handleObj, handlerQueue,
    			args = new Array( arguments.length ),

    			// Make a writable jQuery.Event from the native event object
    			event = jQuery.event.fix( nativeEvent ),

    			handlers = (
    					dataPriv.get( this, "events" ) || Object.create( null )
    				)[ event.type ] || [],
    			special = jQuery.event.special[ event.type ] || {};

    		// Use the fix-ed jQuery.Event rather than the (read-only) native event
    		args[ 0 ] = event;

    		for ( i = 1; i < arguments.length; i++ ) {
    			args[ i ] = arguments[ i ];
    		}

    		event.delegateTarget = this;

    		// Call the preDispatch hook for the mapped type, and let it bail if desired
    		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
    			return;
    		}

    		// Determine handlers
    		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

    		// Run delegates first; they may want to stop propagation beneath us
    		i = 0;
    		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
    			event.currentTarget = matched.elem;

    			j = 0;
    			while ( ( handleObj = matched.handlers[ j++ ] ) &&
    				!event.isImmediatePropagationStopped() ) {

    				// If the event is namespaced, then each handler is only invoked if it is
    				// specially universal or its namespaces are a superset of the event's.
    				if ( !event.rnamespace || handleObj.namespace === false ||
    					event.rnamespace.test( handleObj.namespace ) ) {

    					event.handleObj = handleObj;
    					event.data = handleObj.data;

    					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
    						handleObj.handler ).apply( matched.elem, args );

    					if ( ret !== undefined ) {
    						if ( ( event.result = ret ) === false ) {
    							event.preventDefault();
    							event.stopPropagation();
    						}
    					}
    				}
    			}
    		}

    		// Call the postDispatch hook for the mapped type
    		if ( special.postDispatch ) {
    			special.postDispatch.call( this, event );
    		}

    		return event.result;
    	},

    	handlers: function( event, handlers ) {
    		var i, handleObj, sel, matchedHandlers, matchedSelectors,
    			handlerQueue = [],
    			delegateCount = handlers.delegateCount,
    			cur = event.target;

    		// Find delegate handlers
    		if ( delegateCount &&

    			// Support: IE <=9
    			// Black-hole SVG <use> instance trees (trac-13180)
    			cur.nodeType &&

    			// Support: Firefox <=42
    			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
    			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
    			// Support: IE 11 only
    			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
    			!( event.type === "click" && event.button >= 1 ) ) {

    			for ( ; cur !== this; cur = cur.parentNode || this ) {

    				// Don't check non-elements (#13208)
    				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
    				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
    					matchedHandlers = [];
    					matchedSelectors = {};
    					for ( i = 0; i < delegateCount; i++ ) {
    						handleObj = handlers[ i ];

    						// Don't conflict with Object.prototype properties (#13203)
    						sel = handleObj.selector + " ";

    						if ( matchedSelectors[ sel ] === undefined ) {
    							matchedSelectors[ sel ] = handleObj.needsContext ?
    								jQuery( sel, this ).index( cur ) > -1 :
    								jQuery.find( sel, this, null, [ cur ] ).length;
    						}
    						if ( matchedSelectors[ sel ] ) {
    							matchedHandlers.push( handleObj );
    						}
    					}
    					if ( matchedHandlers.length ) {
    						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
    					}
    				}
    			}
    		}

    		// Add the remaining (directly-bound) handlers
    		cur = this;
    		if ( delegateCount < handlers.length ) {
    			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
    		}

    		return handlerQueue;
    	},

    	addProp: function( name, hook ) {
    		Object.defineProperty( jQuery.Event.prototype, name, {
    			enumerable: true,
    			configurable: true,

    			get: isFunction( hook ) ?
    				function() {
    					if ( this.originalEvent ) {
    							return hook( this.originalEvent );
    					}
    				} :
    				function() {
    					if ( this.originalEvent ) {
    							return this.originalEvent[ name ];
    					}
    				},

    			set: function( value ) {
    				Object.defineProperty( this, name, {
    					enumerable: true,
    					configurable: true,
    					writable: true,
    					value: value
    				} );
    			}
    		} );
    	},

    	fix: function( originalEvent ) {
    		return originalEvent[ jQuery.expando ] ?
    			originalEvent :
    			new jQuery.Event( originalEvent );
    	},

    	special: {
    		load: {

    			// Prevent triggered image.load events from bubbling to window.load
    			noBubble: true
    		},
    		click: {

    			// Utilize native event to ensure correct state for checkable inputs
    			setup: function( data ) {

    				// For mutual compressibility with _default, replace `this` access with a local var.
    				// `|| data` is dead code meant only to preserve the variable through minification.
    				var el = this || data;

    				// Claim the first handler
    				if ( rcheckableType.test( el.type ) &&
    					el.click && nodeName( el, "input" ) ) {

    					// dataPriv.set( el, "click", ... )
    					leverageNative( el, "click", returnTrue );
    				}

    				// Return false to allow normal processing in the caller
    				return false;
    			},
    			trigger: function( data ) {

    				// For mutual compressibility with _default, replace `this` access with a local var.
    				// `|| data` is dead code meant only to preserve the variable through minification.
    				var el = this || data;

    				// Force setup before triggering a click
    				if ( rcheckableType.test( el.type ) &&
    					el.click && nodeName( el, "input" ) ) {

    					leverageNative( el, "click" );
    				}

    				// Return non-false to allow normal event-path propagation
    				return true;
    			},

    			// For cross-browser consistency, suppress native .click() on links
    			// Also prevent it if we're currently inside a leveraged native-event stack
    			_default: function( event ) {
    				var target = event.target;
    				return rcheckableType.test( target.type ) &&
    					target.click && nodeName( target, "input" ) &&
    					dataPriv.get( target, "click" ) ||
    					nodeName( target, "a" );
    			}
    		},

    		beforeunload: {
    			postDispatch: function( event ) {

    				// Support: Firefox 20+
    				// Firefox doesn't alert if the returnValue field is not set.
    				if ( event.result !== undefined && event.originalEvent ) {
    					event.originalEvent.returnValue = event.result;
    				}
    			}
    		}
    	}
    };

    // Ensure the presence of an event listener that handles manually-triggered
    // synthetic events by interrupting progress until reinvoked in response to
    // *native* events that it fires directly, ensuring that state changes have
    // already occurred before other listeners are invoked.
    function leverageNative( el, type, expectSync ) {

    	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
    	if ( !expectSync ) {
    		if ( dataPriv.get( el, type ) === undefined ) {
    			jQuery.event.add( el, type, returnTrue );
    		}
    		return;
    	}

    	// Register the controller as a special universal handler for all event namespaces
    	dataPriv.set( el, type, false );
    	jQuery.event.add( el, type, {
    		namespace: false,
    		handler: function( event ) {
    			var notAsync, result,
    				saved = dataPriv.get( this, type );

    			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

    				// Interrupt processing of the outer synthetic .trigger()ed event
    				// Saved data should be false in such cases, but might be a leftover capture object
    				// from an async native handler (gh-4350)
    				if ( !saved.length ) {

    					// Store arguments for use when handling the inner native event
    					// There will always be at least one argument (an event object), so this array
    					// will not be confused with a leftover capture object.
    					saved = slice.call( arguments );
    					dataPriv.set( this, type, saved );

    					// Trigger the native event and capture its result
    					// Support: IE <=9 - 11+
    					// focus() and blur() are asynchronous
    					notAsync = expectSync( this, type );
    					this[ type ]();
    					result = dataPriv.get( this, type );
    					if ( saved !== result || notAsync ) {
    						dataPriv.set( this, type, false );
    					} else {
    						result = {};
    					}
    					if ( saved !== result ) {

    						// Cancel the outer synthetic event
    						event.stopImmediatePropagation();
    						event.preventDefault();
    						return result.value;
    					}

    				// If this is an inner synthetic event for an event with a bubbling surrogate
    				// (focus or blur), assume that the surrogate already propagated from triggering the
    				// native event and prevent that from happening again here.
    				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
    				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
    				// less bad than duplication.
    				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
    					event.stopPropagation();
    				}

    			// If this is a native event triggered above, everything is now in order
    			// Fire an inner synthetic event with the original arguments
    			} else if ( saved.length ) {

    				// ...and capture the result
    				dataPriv.set( this, type, {
    					value: jQuery.event.trigger(

    						// Support: IE <=9 - 11+
    						// Extend with the prototype to reset the above stopImmediatePropagation()
    						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
    						saved.slice( 1 ),
    						this
    					)
    				} );

    				// Abort handling of the native event
    				event.stopImmediatePropagation();
    			}
    		}
    	} );
    }

    jQuery.removeEvent = function( elem, type, handle ) {

    	// This "if" is needed for plain objects
    	if ( elem.removeEventListener ) {
    		elem.removeEventListener( type, handle );
    	}
    };

    jQuery.Event = function( src, props ) {

    	// Allow instantiation without the 'new' keyword
    	if ( !( this instanceof jQuery.Event ) ) {
    		return new jQuery.Event( src, props );
    	}

    	// Event object
    	if ( src && src.type ) {
    		this.originalEvent = src;
    		this.type = src.type;

    		// Events bubbling up the document may have been marked as prevented
    		// by a handler lower down the tree; reflect the correct value.
    		this.isDefaultPrevented = src.defaultPrevented ||
    				src.defaultPrevented === undefined &&

    				// Support: Android <=2.3 only
    				src.returnValue === false ?
    			returnTrue :
    			returnFalse;

    		// Create target properties
    		// Support: Safari <=6 - 7 only
    		// Target should not be a text node (#504, #13143)
    		this.target = ( src.target && src.target.nodeType === 3 ) ?
    			src.target.parentNode :
    			src.target;

    		this.currentTarget = src.currentTarget;
    		this.relatedTarget = src.relatedTarget;

    	// Event type
    	} else {
    		this.type = src;
    	}

    	// Put explicitly provided properties onto the event object
    	if ( props ) {
    		jQuery.extend( this, props );
    	}

    	// Create a timestamp if incoming event doesn't have one
    	this.timeStamp = src && src.timeStamp || Date.now();

    	// Mark it as fixed
    	this[ jQuery.expando ] = true;
    };

    // jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
    // https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
    jQuery.Event.prototype = {
    	constructor: jQuery.Event,
    	isDefaultPrevented: returnFalse,
    	isPropagationStopped: returnFalse,
    	isImmediatePropagationStopped: returnFalse,
    	isSimulated: false,

    	preventDefault: function() {
    		var e = this.originalEvent;

    		this.isDefaultPrevented = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.preventDefault();
    		}
    	},
    	stopPropagation: function() {
    		var e = this.originalEvent;

    		this.isPropagationStopped = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.stopPropagation();
    		}
    	},
    	stopImmediatePropagation: function() {
    		var e = this.originalEvent;

    		this.isImmediatePropagationStopped = returnTrue;

    		if ( e && !this.isSimulated ) {
    			e.stopImmediatePropagation();
    		}

    		this.stopPropagation();
    	}
    };

    // Includes all common event props including KeyEvent and MouseEvent specific props
    jQuery.each( {
    	altKey: true,
    	bubbles: true,
    	cancelable: true,
    	changedTouches: true,
    	ctrlKey: true,
    	detail: true,
    	eventPhase: true,
    	metaKey: true,
    	pageX: true,
    	pageY: true,
    	shiftKey: true,
    	view: true,
    	"char": true,
    	code: true,
    	charCode: true,
    	key: true,
    	keyCode: true,
    	button: true,
    	buttons: true,
    	clientX: true,
    	clientY: true,
    	offsetX: true,
    	offsetY: true,
    	pointerId: true,
    	pointerType: true,
    	screenX: true,
    	screenY: true,
    	targetTouches: true,
    	toElement: true,
    	touches: true,

    	which: function( event ) {
    		var button = event.button;

    		// Add which for key events
    		if ( event.which == null && rkeyEvent.test( event.type ) ) {
    			return event.charCode != null ? event.charCode : event.keyCode;
    		}

    		// Add which for click: 1 === left; 2 === middle; 3 === right
    		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
    			if ( button & 1 ) {
    				return 1;
    			}

    			if ( button & 2 ) {
    				return 3;
    			}

    			if ( button & 4 ) {
    				return 2;
    			}

    			return 0;
    		}

    		return event.which;
    	}
    }, jQuery.event.addProp );

    jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
    	jQuery.event.special[ type ] = {

    		// Utilize native event if possible so blur/focus sequence is correct
    		setup: function() {

    			// Claim the first handler
    			// dataPriv.set( this, "focus", ... )
    			// dataPriv.set( this, "blur", ... )
    			leverageNative( this, type, expectSync );

    			// Return false to allow normal processing in the caller
    			return false;
    		},
    		trigger: function() {

    			// Force setup before trigger
    			leverageNative( this, type );

    			// Return non-false to allow normal event-path propagation
    			return true;
    		},

    		delegateType: delegateType
    	};
    } );

    // Create mouseenter/leave events using mouseover/out and event-time checks
    // so that event delegation works in jQuery.
    // Do the same for pointerenter/pointerleave and pointerover/pointerout
    //
    // Support: Safari 7 only
    // Safari sends mouseenter too often; see:
    // https://bugs.chromium.org/p/chromium/issues/detail?id=470258
    // for the description of the bug (it existed in older Chrome versions as well).
    jQuery.each( {
    	mouseenter: "mouseover",
    	mouseleave: "mouseout",
    	pointerenter: "pointerover",
    	pointerleave: "pointerout"
    }, function( orig, fix ) {
    	jQuery.event.special[ orig ] = {
    		delegateType: fix,
    		bindType: fix,

    		handle: function( event ) {
    			var ret,
    				target = this,
    				related = event.relatedTarget,
    				handleObj = event.handleObj;

    			// For mouseenter/leave call the handler if related is outside the target.
    			// NB: No relatedTarget if the mouse left/entered the browser window
    			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
    				event.type = handleObj.origType;
    				ret = handleObj.handler.apply( this, arguments );
    				event.type = fix;
    			}
    			return ret;
    		}
    	};
    } );

    jQuery.fn.extend( {

    	on: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn );
    	},
    	one: function( types, selector, data, fn ) {
    		return on( this, types, selector, data, fn, 1 );
    	},
    	off: function( types, selector, fn ) {
    		var handleObj, type;
    		if ( types && types.preventDefault && types.handleObj ) {

    			// ( event )  dispatched jQuery.Event
    			handleObj = types.handleObj;
    			jQuery( types.delegateTarget ).off(
    				handleObj.namespace ?
    					handleObj.origType + "." + handleObj.namespace :
    					handleObj.origType,
    				handleObj.selector,
    				handleObj.handler
    			);
    			return this;
    		}
    		if ( typeof types === "object" ) {

    			// ( types-object [, selector] )
    			for ( type in types ) {
    				this.off( type, selector, types[ type ] );
    			}
    			return this;
    		}
    		if ( selector === false || typeof selector === "function" ) {

    			// ( types [, fn] )
    			fn = selector;
    			selector = undefined;
    		}
    		if ( fn === false ) {
    			fn = returnFalse;
    		}
    		return this.each( function() {
    			jQuery.event.remove( this, types, fn, selector );
    		} );
    	}
    } );


    var

    	// Support: IE <=10 - 11, Edge 12 - 13 only
    	// In IE/Edge using regex groups here causes severe slowdowns.
    	// See https://connect.microsoft.com/IE/feedback/details/1736512/
    	rnoInnerhtml = /<script|<style|<link/i,

    	// checked="checked" or checked
    	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
    	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

    // Prefer a tbody over its parent table for containing new rows
    function manipulationTarget( elem, content ) {
    	if ( nodeName( elem, "table" ) &&
    		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

    		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
    	}

    	return elem;
    }

    // Replace/restore the type attribute of script elements for safe DOM manipulation
    function disableScript( elem ) {
    	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
    	return elem;
    }
    function restoreScript( elem ) {
    	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
    		elem.type = elem.type.slice( 5 );
    	} else {
    		elem.removeAttribute( "type" );
    	}

    	return elem;
    }

    function cloneCopyEvent( src, dest ) {
    	var i, l, type, pdataOld, udataOld, udataCur, events;

    	if ( dest.nodeType !== 1 ) {
    		return;
    	}

    	// 1. Copy private data: events, handlers, etc.
    	if ( dataPriv.hasData( src ) ) {
    		pdataOld = dataPriv.get( src );
    		events = pdataOld.events;

    		if ( events ) {
    			dataPriv.remove( dest, "handle events" );

    			for ( type in events ) {
    				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
    					jQuery.event.add( dest, type, events[ type ][ i ] );
    				}
    			}
    		}
    	}

    	// 2. Copy user data
    	if ( dataUser.hasData( src ) ) {
    		udataOld = dataUser.access( src );
    		udataCur = jQuery.extend( {}, udataOld );

    		dataUser.set( dest, udataCur );
    	}
    }

    // Fix IE bugs, see support tests
    function fixInput( src, dest ) {
    	var nodeName = dest.nodeName.toLowerCase();

    	// Fails to persist the checked state of a cloned checkbox or radio button.
    	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
    		dest.checked = src.checked;

    	// Fails to return the selected option to the default selected state when cloning options
    	} else if ( nodeName === "input" || nodeName === "textarea" ) {
    		dest.defaultValue = src.defaultValue;
    	}
    }

    function domManip( collection, args, callback, ignored ) {

    	// Flatten any nested arrays
    	args = flat( args );

    	var fragment, first, scripts, hasScripts, node, doc,
    		i = 0,
    		l = collection.length,
    		iNoClone = l - 1,
    		value = args[ 0 ],
    		valueIsFunction = isFunction( value );

    	// We can't cloneNode fragments that contain checked, in WebKit
    	if ( valueIsFunction ||
    			( l > 1 && typeof value === "string" &&
    				!support.checkClone && rchecked.test( value ) ) ) {
    		return collection.each( function( index ) {
    			var self = collection.eq( index );
    			if ( valueIsFunction ) {
    				args[ 0 ] = value.call( this, index, self.html() );
    			}
    			domManip( self, args, callback, ignored );
    		} );
    	}

    	if ( l ) {
    		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
    		first = fragment.firstChild;

    		if ( fragment.childNodes.length === 1 ) {
    			fragment = first;
    		}

    		// Require either new content or an interest in ignored elements to invoke the callback
    		if ( first || ignored ) {
    			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
    			hasScripts = scripts.length;

    			// Use the original fragment for the last item
    			// instead of the first because it can end up
    			// being emptied incorrectly in certain situations (#8070).
    			for ( ; i < l; i++ ) {
    				node = fragment;

    				if ( i !== iNoClone ) {
    					node = jQuery.clone( node, true, true );

    					// Keep references to cloned scripts for later restoration
    					if ( hasScripts ) {

    						// Support: Android <=4.0 only, PhantomJS 1 only
    						// push.apply(_, arraylike) throws on ancient WebKit
    						jQuery.merge( scripts, getAll( node, "script" ) );
    					}
    				}

    				callback.call( collection[ i ], node, i );
    			}

    			if ( hasScripts ) {
    				doc = scripts[ scripts.length - 1 ].ownerDocument;

    				// Reenable scripts
    				jQuery.map( scripts, restoreScript );

    				// Evaluate executable scripts on first document insertion
    				for ( i = 0; i < hasScripts; i++ ) {
    					node = scripts[ i ];
    					if ( rscriptType.test( node.type || "" ) &&
    						!dataPriv.access( node, "globalEval" ) &&
    						jQuery.contains( doc, node ) ) {

    						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

    							// Optional AJAX dependency, but won't run scripts if not present
    							if ( jQuery._evalUrl && !node.noModule ) {
    								jQuery._evalUrl( node.src, {
    									nonce: node.nonce || node.getAttribute( "nonce" )
    								}, doc );
    							}
    						} else {
    							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
    						}
    					}
    				}
    			}
    		}
    	}

    	return collection;
    }

    function remove( elem, selector, keepData ) {
    	var node,
    		nodes = selector ? jQuery.filter( selector, elem ) : elem,
    		i = 0;

    	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
    		if ( !keepData && node.nodeType === 1 ) {
    			jQuery.cleanData( getAll( node ) );
    		}

    		if ( node.parentNode ) {
    			if ( keepData && isAttached( node ) ) {
    				setGlobalEval( getAll( node, "script" ) );
    			}
    			node.parentNode.removeChild( node );
    		}
    	}

    	return elem;
    }

    jQuery.extend( {
    	htmlPrefilter: function( html ) {
    		return html;
    	},

    	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
    		var i, l, srcElements, destElements,
    			clone = elem.cloneNode( true ),
    			inPage = isAttached( elem );

    		// Fix IE cloning issues
    		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
    				!jQuery.isXMLDoc( elem ) ) {

    			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
    			destElements = getAll( clone );
    			srcElements = getAll( elem );

    			for ( i = 0, l = srcElements.length; i < l; i++ ) {
    				fixInput( srcElements[ i ], destElements[ i ] );
    			}
    		}

    		// Copy the events from the original to the clone
    		if ( dataAndEvents ) {
    			if ( deepDataAndEvents ) {
    				srcElements = srcElements || getAll( elem );
    				destElements = destElements || getAll( clone );

    				for ( i = 0, l = srcElements.length; i < l; i++ ) {
    					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
    				}
    			} else {
    				cloneCopyEvent( elem, clone );
    			}
    		}

    		// Preserve script evaluation history
    		destElements = getAll( clone, "script" );
    		if ( destElements.length > 0 ) {
    			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
    		}

    		// Return the cloned set
    		return clone;
    	},

    	cleanData: function( elems ) {
    		var data, elem, type,
    			special = jQuery.event.special,
    			i = 0;

    		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
    			if ( acceptData( elem ) ) {
    				if ( ( data = elem[ dataPriv.expando ] ) ) {
    					if ( data.events ) {
    						for ( type in data.events ) {
    							if ( special[ type ] ) {
    								jQuery.event.remove( elem, type );

    							// This is a shortcut to avoid jQuery.event.remove's overhead
    							} else {
    								jQuery.removeEvent( elem, type, data.handle );
    							}
    						}
    					}

    					// Support: Chrome <=35 - 45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataPriv.expando ] = undefined;
    				}
    				if ( elem[ dataUser.expando ] ) {

    					// Support: Chrome <=35 - 45+
    					// Assign undefined instead of using delete, see Data#remove
    					elem[ dataUser.expando ] = undefined;
    				}
    			}
    		}
    	}
    } );

    jQuery.fn.extend( {
    	detach: function( selector ) {
    		return remove( this, selector, true );
    	},

    	remove: function( selector ) {
    		return remove( this, selector );
    	},

    	text: function( value ) {
    		return access( this, function( value ) {
    			return value === undefined ?
    				jQuery.text( this ) :
    				this.empty().each( function() {
    					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    						this.textContent = value;
    					}
    				} );
    		}, null, value, arguments.length );
    	},

    	append: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.appendChild( elem );
    			}
    		} );
    	},

    	prepend: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
    				var target = manipulationTarget( this, elem );
    				target.insertBefore( elem, target.firstChild );
    			}
    		} );
    	},

    	before: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this );
    			}
    		} );
    	},

    	after: function() {
    		return domManip( this, arguments, function( elem ) {
    			if ( this.parentNode ) {
    				this.parentNode.insertBefore( elem, this.nextSibling );
    			}
    		} );
    	},

    	empty: function() {
    		var elem,
    			i = 0;

    		for ( ; ( elem = this[ i ] ) != null; i++ ) {
    			if ( elem.nodeType === 1 ) {

    				// Prevent memory leaks
    				jQuery.cleanData( getAll( elem, false ) );

    				// Remove any remaining nodes
    				elem.textContent = "";
    			}
    		}

    		return this;
    	},

    	clone: function( dataAndEvents, deepDataAndEvents ) {
    		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
    		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

    		return this.map( function() {
    			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
    		} );
    	},

    	html: function( value ) {
    		return access( this, function( value ) {
    			var elem = this[ 0 ] || {},
    				i = 0,
    				l = this.length;

    			if ( value === undefined && elem.nodeType === 1 ) {
    				return elem.innerHTML;
    			}

    			// See if we can take a shortcut and just use innerHTML
    			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
    				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

    				value = jQuery.htmlPrefilter( value );

    				try {
    					for ( ; i < l; i++ ) {
    						elem = this[ i ] || {};

    						// Remove element nodes and prevent memory leaks
    						if ( elem.nodeType === 1 ) {
    							jQuery.cleanData( getAll( elem, false ) );
    							elem.innerHTML = value;
    						}
    					}

    					elem = 0;

    				// If using innerHTML throws an exception, use the fallback method
    				} catch ( e ) {}
    			}

    			if ( elem ) {
    				this.empty().append( value );
    			}
    		}, null, value, arguments.length );
    	},

    	replaceWith: function() {
    		var ignored = [];

    		// Make the changes, replacing each non-ignored context element with the new content
    		return domManip( this, arguments, function( elem ) {
    			var parent = this.parentNode;

    			if ( jQuery.inArray( this, ignored ) < 0 ) {
    				jQuery.cleanData( getAll( this ) );
    				if ( parent ) {
    					parent.replaceChild( elem, this );
    				}
    			}

    		// Force callback invocation
    		}, ignored );
    	}
    } );

    jQuery.each( {
    	appendTo: "append",
    	prependTo: "prepend",
    	insertBefore: "before",
    	insertAfter: "after",
    	replaceAll: "replaceWith"
    }, function( name, original ) {
    	jQuery.fn[ name ] = function( selector ) {
    		var elems,
    			ret = [],
    			insert = jQuery( selector ),
    			last = insert.length - 1,
    			i = 0;

    		for ( ; i <= last; i++ ) {
    			elems = i === last ? this : this.clone( true );
    			jQuery( insert[ i ] )[ original ]( elems );

    			// Support: Android <=4.0 only, PhantomJS 1 only
    			// .get() because push.apply(_, arraylike) throws on ancient WebKit
    			push.apply( ret, elems.get() );
    		}

    		return this.pushStack( ret );
    	};
    } );
    var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

    var getStyles = function( elem ) {

    		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
    		// IE throws on elements created in popups
    		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
    		var view = elem.ownerDocument.defaultView;

    		if ( !view || !view.opener ) {
    			view = window;
    		}

    		return view.getComputedStyle( elem );
    	};

    var swap = function( elem, options, callback ) {
    	var ret, name,
    		old = {};

    	// Remember the old values, and insert the new ones
    	for ( name in options ) {
    		old[ name ] = elem.style[ name ];
    		elem.style[ name ] = options[ name ];
    	}

    	ret = callback.call( elem );

    	// Revert the old values
    	for ( name in options ) {
    		elem.style[ name ] = old[ name ];
    	}

    	return ret;
    };


    var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



    ( function() {

    	// Executing both pixelPosition & boxSizingReliable tests require only one layout
    	// so they're executed at the same time to save the second computation.
    	function computeStyleTests() {

    		// This is a singleton, we need to execute it only once
    		if ( !div ) {
    			return;
    		}

    		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
    			"margin-top:1px;padding:0;border:0";
    		div.style.cssText =
    			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
    			"margin:auto;border:1px;padding:1px;" +
    			"width:60%;top:1%";
    		documentElement.appendChild( container ).appendChild( div );

    		var divStyle = window.getComputedStyle( div );
    		pixelPositionVal = divStyle.top !== "1%";

    		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
    		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

    		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
    		// Some styles come back with percentage values, even though they shouldn't
    		div.style.right = "60%";
    		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

    		// Support: IE 9 - 11 only
    		// Detect misreporting of content dimensions for box-sizing:border-box elements
    		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

    		// Support: IE 9 only
    		// Detect overflow:scroll screwiness (gh-3699)
    		// Support: Chrome <=64
    		// Don't get tricked when zoom affects offsetWidth (gh-4029)
    		div.style.position = "absolute";
    		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

    		documentElement.removeChild( container );

    		// Nullify the div so it wouldn't be stored in the memory and
    		// it will also be a sign that checks already performed
    		div = null;
    	}

    	function roundPixelMeasures( measure ) {
    		return Math.round( parseFloat( measure ) );
    	}

    	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
    		reliableTrDimensionsVal, reliableMarginLeftVal,
    		container = document.createElement( "div" ),
    		div = document.createElement( "div" );

    	// Finish early in limited (non-browser) environments
    	if ( !div.style ) {
    		return;
    	}

    	// Support: IE <=9 - 11 only
    	// Style of cloned element affects source element cloned (#8908)
    	div.style.backgroundClip = "content-box";
    	div.cloneNode( true ).style.backgroundClip = "";
    	support.clearCloneStyle = div.style.backgroundClip === "content-box";

    	jQuery.extend( support, {
    		boxSizingReliable: function() {
    			computeStyleTests();
    			return boxSizingReliableVal;
    		},
    		pixelBoxStyles: function() {
    			computeStyleTests();
    			return pixelBoxStylesVal;
    		},
    		pixelPosition: function() {
    			computeStyleTests();
    			return pixelPositionVal;
    		},
    		reliableMarginLeft: function() {
    			computeStyleTests();
    			return reliableMarginLeftVal;
    		},
    		scrollboxSize: function() {
    			computeStyleTests();
    			return scrollboxSizeVal;
    		},

    		// Support: IE 9 - 11+, Edge 15 - 18+
    		// IE/Edge misreport `getComputedStyle` of table rows with width/height
    		// set in CSS while `offset*` properties report correct values.
    		// Behavior in IE 9 is more subtle than in newer versions & it passes
    		// some versions of this test; make sure not to make it pass there!
    		reliableTrDimensions: function() {
    			var table, tr, trChild, trStyle;
    			if ( reliableTrDimensionsVal == null ) {
    				table = document.createElement( "table" );
    				tr = document.createElement( "tr" );
    				trChild = document.createElement( "div" );

    				table.style.cssText = "position:absolute;left:-11111px";
    				tr.style.height = "1px";
    				trChild.style.height = "9px";

    				documentElement
    					.appendChild( table )
    					.appendChild( tr )
    					.appendChild( trChild );

    				trStyle = window.getComputedStyle( tr );
    				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

    				documentElement.removeChild( table );
    			}
    			return reliableTrDimensionsVal;
    		}
    	} );
    } )();


    function curCSS( elem, name, computed ) {
    	var width, minWidth, maxWidth, ret,

    		// Support: Firefox 51+
    		// Retrieving style before computed somehow
    		// fixes an issue with getting wrong values
    		// on detached elements
    		style = elem.style;

    	computed = computed || getStyles( elem );

    	// getPropertyValue is needed for:
    	//   .css('filter') (IE 9 only, #12537)
    	//   .css('--customProperty) (#3144)
    	if ( computed ) {
    		ret = computed.getPropertyValue( name ) || computed[ name ];

    		if ( ret === "" && !isAttached( elem ) ) {
    			ret = jQuery.style( elem, name );
    		}

    		// A tribute to the "awesome hack by Dean Edwards"
    		// Android Browser returns percentage for some values,
    		// but width seems to be reliably pixels.
    		// This is against the CSSOM draft spec:
    		// https://drafts.csswg.org/cssom/#resolved-values
    		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

    			// Remember the original values
    			width = style.width;
    			minWidth = style.minWidth;
    			maxWidth = style.maxWidth;

    			// Put in the new values to get a computed value out
    			style.minWidth = style.maxWidth = style.width = ret;
    			ret = computed.width;

    			// Revert the changed values
    			style.width = width;
    			style.minWidth = minWidth;
    			style.maxWidth = maxWidth;
    		}
    	}

    	return ret !== undefined ?

    		// Support: IE <=9 - 11 only
    		// IE returns zIndex value as an integer.
    		ret + "" :
    		ret;
    }


    function addGetHookIf( conditionFn, hookFn ) {

    	// Define the hook, we'll check on the first run if it's really needed.
    	return {
    		get: function() {
    			if ( conditionFn() ) {

    				// Hook not needed (or it's not possible to use it due
    				// to missing dependency), remove it.
    				delete this.get;
    				return;
    			}

    			// Hook needed; redefine it so that the support test is not executed again.
    			return ( this.get = hookFn ).apply( this, arguments );
    		}
    	};
    }


    var cssPrefixes = [ "Webkit", "Moz", "ms" ],
    	emptyStyle = document.createElement( "div" ).style,
    	vendorProps = {};

    // Return a vendor-prefixed property or undefined
    function vendorPropName( name ) {

    	// Check for vendor prefixed names
    	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
    		i = cssPrefixes.length;

    	while ( i-- ) {
    		name = cssPrefixes[ i ] + capName;
    		if ( name in emptyStyle ) {
    			return name;
    		}
    	}
    }

    // Return a potentially-mapped jQuery.cssProps or vendor prefixed property
    function finalPropName( name ) {
    	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

    	if ( final ) {
    		return final;
    	}
    	if ( name in emptyStyle ) {
    		return name;
    	}
    	return vendorProps[ name ] = vendorPropName( name ) || name;
    }


    var

    	// Swappable if display is none or starts with table
    	// except "table", "table-cell", or "table-caption"
    	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
    	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
    	rcustomProp = /^--/,
    	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
    	cssNormalTransform = {
    		letterSpacing: "0",
    		fontWeight: "400"
    	};

    function setPositiveNumber( _elem, value, subtract ) {

    	// Any relative (+/-) values have already been
    	// normalized at this point
    	var matches = rcssNum.exec( value );
    	return matches ?

    		// Guard against undefined "subtract", e.g., when used as in cssHooks
    		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
    		value;
    }

    function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
    	var i = dimension === "width" ? 1 : 0,
    		extra = 0,
    		delta = 0;

    	// Adjustment may not be necessary
    	if ( box === ( isBorderBox ? "border" : "content" ) ) {
    		return 0;
    	}

    	for ( ; i < 4; i += 2 ) {

    		// Both box models exclude margin
    		if ( box === "margin" ) {
    			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
    		}

    		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
    		if ( !isBorderBox ) {

    			// Add padding
    			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

    			// For "border" or "margin", add border
    			if ( box !== "padding" ) {
    				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

    			// But still keep track of it otherwise
    			} else {
    				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}

    		// If we get here with a border-box (content + padding + border), we're seeking "content" or
    		// "padding" or "margin"
    		} else {

    			// For "content", subtract padding
    			if ( box === "content" ) {
    				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
    			}

    			// For "content" or "padding", subtract border
    			if ( box !== "margin" ) {
    				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
    			}
    		}
    	}

    	// Account for positive content-box scroll gutter when requested by providing computedVal
    	if ( !isBorderBox && computedVal >= 0 ) {

    		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
    		// Assuming integer scroll gutter, subtract the rest and round down
    		delta += Math.max( 0, Math.ceil(
    			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    			computedVal -
    			delta -
    			extra -
    			0.5

    		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
    		// Use an explicit zero to avoid NaN (gh-3964)
    		) ) || 0;
    	}

    	return delta;
    }

    function getWidthOrHeight( elem, dimension, extra ) {

    	// Start with computed style
    	var styles = getStyles( elem ),

    		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
    		// Fake content-box until we know it's needed to know the true value.
    		boxSizingNeeded = !support.boxSizingReliable() || extra,
    		isBorderBox = boxSizingNeeded &&
    			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    		valueIsBorderBox = isBorderBox,

    		val = curCSS( elem, dimension, styles ),
    		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

    	// Support: Firefox <=54
    	// Return a confounding non-pixel value or feign ignorance, as appropriate.
    	if ( rnumnonpx.test( val ) ) {
    		if ( !extra ) {
    			return val;
    		}
    		val = "auto";
    	}


    	// Support: IE 9 - 11 only
    	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
    	// In those cases, the computed value can be trusted to be border-box.
    	if ( ( !support.boxSizingReliable() && isBorderBox ||

    		// Support: IE 10 - 11+, Edge 15 - 18+
    		// IE/Edge misreport `getComputedStyle` of table rows with width/height
    		// set in CSS while `offset*` properties report correct values.
    		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
    		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

    		// Fall back to offsetWidth/offsetHeight when value is "auto"
    		// This happens for inline elements with no explicit setting (gh-3571)
    		val === "auto" ||

    		// Support: Android <=4.1 - 4.3 only
    		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
    		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

    		// Make sure the element is visible & connected
    		elem.getClientRects().length ) {

    		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

    		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
    		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
    		// retrieved value as a content box dimension.
    		valueIsBorderBox = offsetProp in elem;
    		if ( valueIsBorderBox ) {
    			val = elem[ offsetProp ];
    		}
    	}

    	// Normalize "" and auto
    	val = parseFloat( val ) || 0;

    	// Adjust for the element's box model
    	return ( val +
    		boxModelAdjustment(
    			elem,
    			dimension,
    			extra || ( isBorderBox ? "border" : "content" ),
    			valueIsBorderBox,
    			styles,

    			// Provide the current computed size to request scroll gutter calculation (gh-3589)
    			val
    		)
    	) + "px";
    }

    jQuery.extend( {

    	// Add in style property hooks for overriding the default
    	// behavior of getting and setting a style property
    	cssHooks: {
    		opacity: {
    			get: function( elem, computed ) {
    				if ( computed ) {

    					// We should always get a number back from opacity
    					var ret = curCSS( elem, "opacity" );
    					return ret === "" ? "1" : ret;
    				}
    			}
    		}
    	},

    	// Don't automatically add "px" to these possibly-unitless properties
    	cssNumber: {
    		"animationIterationCount": true,
    		"columnCount": true,
    		"fillOpacity": true,
    		"flexGrow": true,
    		"flexShrink": true,
    		"fontWeight": true,
    		"gridArea": true,
    		"gridColumn": true,
    		"gridColumnEnd": true,
    		"gridColumnStart": true,
    		"gridRow": true,
    		"gridRowEnd": true,
    		"gridRowStart": true,
    		"lineHeight": true,
    		"opacity": true,
    		"order": true,
    		"orphans": true,
    		"widows": true,
    		"zIndex": true,
    		"zoom": true
    	},

    	// Add in properties whose names you wish to fix before
    	// setting or getting the value
    	cssProps: {},

    	// Get and set the style property on a DOM Node
    	style: function( elem, name, value, extra ) {

    		// Don't set styles on text and comment nodes
    		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
    			return;
    		}

    		// Make sure that we're working with the right name
    		var ret, type, hooks,
    			origName = camelCase( name ),
    			isCustomProp = rcustomProp.test( name ),
    			style = elem.style;

    		// Make sure that we're working with the right name. We don't
    		// want to query the value if it is a CSS custom property
    		// since they are user-defined.
    		if ( !isCustomProp ) {
    			name = finalPropName( origName );
    		}

    		// Gets hook for the prefixed version, then unprefixed version
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    		// Check if we're setting a value
    		if ( value !== undefined ) {
    			type = typeof value;

    			// Convert "+=" or "-=" to relative numbers (#7345)
    			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
    				value = adjustCSS( elem, name, ret );

    				// Fixes bug #9237
    				type = "number";
    			}

    			// Make sure that null and NaN values aren't set (#7116)
    			if ( value == null || value !== value ) {
    				return;
    			}

    			// If a number was passed in, add the unit (except for certain CSS properties)
    			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
    			// "px" to a few hardcoded values.
    			if ( type === "number" && !isCustomProp ) {
    				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
    			}

    			// background-* props affect original clone's values
    			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
    				style[ name ] = "inherit";
    			}

    			// If a hook was provided, use that value, otherwise just set the specified value
    			if ( !hooks || !( "set" in hooks ) ||
    				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

    				if ( isCustomProp ) {
    					style.setProperty( name, value );
    				} else {
    					style[ name ] = value;
    				}
    			}

    		} else {

    			// If a hook was provided get the non-computed value from there
    			if ( hooks && "get" in hooks &&
    				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

    				return ret;
    			}

    			// Otherwise just get the value from the style object
    			return style[ name ];
    		}
    	},

    	css: function( elem, name, extra, styles ) {
    		var val, num, hooks,
    			origName = camelCase( name ),
    			isCustomProp = rcustomProp.test( name );

    		// Make sure that we're working with the right name. We don't
    		// want to modify the value if it is a CSS custom property
    		// since they are user-defined.
    		if ( !isCustomProp ) {
    			name = finalPropName( origName );
    		}

    		// Try prefixed name followed by the unprefixed name
    		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

    		// If a hook was provided get the computed value from there
    		if ( hooks && "get" in hooks ) {
    			val = hooks.get( elem, true, extra );
    		}

    		// Otherwise, if a way to get the computed value exists, use that
    		if ( val === undefined ) {
    			val = curCSS( elem, name, styles );
    		}

    		// Convert "normal" to computed value
    		if ( val === "normal" && name in cssNormalTransform ) {
    			val = cssNormalTransform[ name ];
    		}

    		// Make numeric if forced or a qualifier was provided and val looks numeric
    		if ( extra === "" || extra ) {
    			num = parseFloat( val );
    			return extra === true || isFinite( num ) ? num || 0 : val;
    		}

    		return val;
    	}
    } );

    jQuery.each( [ "height", "width" ], function( _i, dimension ) {
    	jQuery.cssHooks[ dimension ] = {
    		get: function( elem, computed, extra ) {
    			if ( computed ) {

    				// Certain elements can have dimension info if we invisibly show them
    				// but it must have a current display style that would benefit
    				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

    					// Support: Safari 8+
    					// Table columns in Safari have non-zero offsetWidth & zero
    					// getBoundingClientRect().width unless display is changed.
    					// Support: IE <=11 only
    					// Running getBoundingClientRect on a disconnected node
    					// in IE throws an error.
    					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
    						swap( elem, cssShow, function() {
    							return getWidthOrHeight( elem, dimension, extra );
    						} ) :
    						getWidthOrHeight( elem, dimension, extra );
    			}
    		},

    		set: function( elem, value, extra ) {
    			var matches,
    				styles = getStyles( elem ),

    				// Only read styles.position if the test has a chance to fail
    				// to avoid forcing a reflow.
    				scrollboxSizeBuggy = !support.scrollboxSize() &&
    					styles.position === "absolute",

    				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
    				boxSizingNeeded = scrollboxSizeBuggy || extra,
    				isBorderBox = boxSizingNeeded &&
    					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
    				subtract = extra ?
    					boxModelAdjustment(
    						elem,
    						dimension,
    						extra,
    						isBorderBox,
    						styles
    					) :
    					0;

    			// Account for unreliable border-box dimensions by comparing offset* to computed and
    			// faking a content-box to get border and padding (gh-3699)
    			if ( isBorderBox && scrollboxSizeBuggy ) {
    				subtract -= Math.ceil(
    					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
    					parseFloat( styles[ dimension ] ) -
    					boxModelAdjustment( elem, dimension, "border", false, styles ) -
    					0.5
    				);
    			}

    			// Convert to pixels if value adjustment is needed
    			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
    				( matches[ 3 ] || "px" ) !== "px" ) {

    				elem.style[ dimension ] = value;
    				value = jQuery.css( elem, dimension );
    			}

    			return setPositiveNumber( elem, value, subtract );
    		}
    	};
    } );

    jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
    	function( elem, computed ) {
    		if ( computed ) {
    			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
    				elem.getBoundingClientRect().left -
    					swap( elem, { marginLeft: 0 }, function() {
    						return elem.getBoundingClientRect().left;
    					} )
    				) + "px";
    		}
    	}
    );

    // These hooks are used by animate to expand properties
    jQuery.each( {
    	margin: "",
    	padding: "",
    	border: "Width"
    }, function( prefix, suffix ) {
    	jQuery.cssHooks[ prefix + suffix ] = {
    		expand: function( value ) {
    			var i = 0,
    				expanded = {},

    				// Assumes a single number if not a string
    				parts = typeof value === "string" ? value.split( " " ) : [ value ];

    			for ( ; i < 4; i++ ) {
    				expanded[ prefix + cssExpand[ i ] + suffix ] =
    					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
    			}

    			return expanded;
    		}
    	};

    	if ( prefix !== "margin" ) {
    		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
    	}
    } );

    jQuery.fn.extend( {
    	css: function( name, value ) {
    		return access( this, function( elem, name, value ) {
    			var styles, len,
    				map = {},
    				i = 0;

    			if ( Array.isArray( name ) ) {
    				styles = getStyles( elem );
    				len = name.length;

    				for ( ; i < len; i++ ) {
    					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
    				}

    				return map;
    			}

    			return value !== undefined ?
    				jQuery.style( elem, name, value ) :
    				jQuery.css( elem, name );
    		}, name, value, arguments.length > 1 );
    	}
    } );


    function Tween( elem, options, prop, end, easing ) {
    	return new Tween.prototype.init( elem, options, prop, end, easing );
    }
    jQuery.Tween = Tween;

    Tween.prototype = {
    	constructor: Tween,
    	init: function( elem, options, prop, end, easing, unit ) {
    		this.elem = elem;
    		this.prop = prop;
    		this.easing = easing || jQuery.easing._default;
    		this.options = options;
    		this.start = this.now = this.cur();
    		this.end = end;
    		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
    	},
    	cur: function() {
    		var hooks = Tween.propHooks[ this.prop ];

    		return hooks && hooks.get ?
    			hooks.get( this ) :
    			Tween.propHooks._default.get( this );
    	},
    	run: function( percent ) {
    		var eased,
    			hooks = Tween.propHooks[ this.prop ];

    		if ( this.options.duration ) {
    			this.pos = eased = jQuery.easing[ this.easing ](
    				percent, this.options.duration * percent, 0, 1, this.options.duration
    			);
    		} else {
    			this.pos = eased = percent;
    		}
    		this.now = ( this.end - this.start ) * eased + this.start;

    		if ( this.options.step ) {
    			this.options.step.call( this.elem, this.now, this );
    		}

    		if ( hooks && hooks.set ) {
    			hooks.set( this );
    		} else {
    			Tween.propHooks._default.set( this );
    		}
    		return this;
    	}
    };

    Tween.prototype.init.prototype = Tween.prototype;

    Tween.propHooks = {
    	_default: {
    		get: function( tween ) {
    			var result;

    			// Use a property on the element directly when it is not a DOM element,
    			// or when there is no matching style property that exists.
    			if ( tween.elem.nodeType !== 1 ||
    				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
    				return tween.elem[ tween.prop ];
    			}

    			// Passing an empty string as a 3rd parameter to .css will automatically
    			// attempt a parseFloat and fallback to a string if the parse fails.
    			// Simple values such as "10px" are parsed to Float;
    			// complex values such as "rotate(1rad)" are returned as-is.
    			result = jQuery.css( tween.elem, tween.prop, "" );

    			// Empty strings, null, undefined and "auto" are converted to 0.
    			return !result || result === "auto" ? 0 : result;
    		},
    		set: function( tween ) {

    			// Use step hook for back compat.
    			// Use cssHook if its there.
    			// Use .style if available and use plain properties where available.
    			if ( jQuery.fx.step[ tween.prop ] ) {
    				jQuery.fx.step[ tween.prop ]( tween );
    			} else if ( tween.elem.nodeType === 1 && (
    					jQuery.cssHooks[ tween.prop ] ||
    					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
    				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
    			} else {
    				tween.elem[ tween.prop ] = tween.now;
    			}
    		}
    	}
    };

    // Support: IE <=9 only
    // Panic based approach to setting things on disconnected nodes
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
    	set: function( tween ) {
    		if ( tween.elem.nodeType && tween.elem.parentNode ) {
    			tween.elem[ tween.prop ] = tween.now;
    		}
    	}
    };

    jQuery.easing = {
    	linear: function( p ) {
    		return p;
    	},
    	swing: function( p ) {
    		return 0.5 - Math.cos( p * Math.PI ) / 2;
    	},
    	_default: "swing"
    };

    jQuery.fx = Tween.prototype.init;

    // Back compat <1.8 extension point
    jQuery.fx.step = {};




    var
    	fxNow, inProgress,
    	rfxtypes = /^(?:toggle|show|hide)$/,
    	rrun = /queueHooks$/;

    function schedule() {
    	if ( inProgress ) {
    		if ( document.hidden === false && window.requestAnimationFrame ) {
    			window.requestAnimationFrame( schedule );
    		} else {
    			window.setTimeout( schedule, jQuery.fx.interval );
    		}

    		jQuery.fx.tick();
    	}
    }

    // Animations created synchronously will run synchronously
    function createFxNow() {
    	window.setTimeout( function() {
    		fxNow = undefined;
    	} );
    	return ( fxNow = Date.now() );
    }

    // Generate parameters to create a standard animation
    function genFx( type, includeWidth ) {
    	var which,
    		i = 0,
    		attrs = { height: type };

    	// If we include width, step value is 1 to do all cssExpand values,
    	// otherwise step value is 2 to skip over Left and Right
    	includeWidth = includeWidth ? 1 : 0;
    	for ( ; i < 4; i += 2 - includeWidth ) {
    		which = cssExpand[ i ];
    		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
    	}

    	if ( includeWidth ) {
    		attrs.opacity = attrs.width = type;
    	}

    	return attrs;
    }

    function createTween( value, prop, animation ) {
    	var tween,
    		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
    		index = 0,
    		length = collection.length;
    	for ( ; index < length; index++ ) {
    		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

    			// We're done with this property
    			return tween;
    		}
    	}
    }

    function defaultPrefilter( elem, props, opts ) {
    	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
    		isBox = "width" in props || "height" in props,
    		anim = this,
    		orig = {},
    		style = elem.style,
    		hidden = elem.nodeType && isHiddenWithinTree( elem ),
    		dataShow = dataPriv.get( elem, "fxshow" );

    	// Queue-skipping animations hijack the fx hooks
    	if ( !opts.queue ) {
    		hooks = jQuery._queueHooks( elem, "fx" );
    		if ( hooks.unqueued == null ) {
    			hooks.unqueued = 0;
    			oldfire = hooks.empty.fire;
    			hooks.empty.fire = function() {
    				if ( !hooks.unqueued ) {
    					oldfire();
    				}
    			};
    		}
    		hooks.unqueued++;

    		anim.always( function() {

    			// Ensure the complete handler is called before this completes
    			anim.always( function() {
    				hooks.unqueued--;
    				if ( !jQuery.queue( elem, "fx" ).length ) {
    					hooks.empty.fire();
    				}
    			} );
    		} );
    	}

    	// Detect show/hide animations
    	for ( prop in props ) {
    		value = props[ prop ];
    		if ( rfxtypes.test( value ) ) {
    			delete props[ prop ];
    			toggle = toggle || value === "toggle";
    			if ( value === ( hidden ? "hide" : "show" ) ) {

    				// Pretend to be hidden if this is a "show" and
    				// there is still data from a stopped show/hide
    				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
    					hidden = true;

    				// Ignore all other no-op show/hide data
    				} else {
    					continue;
    				}
    			}
    			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
    		}
    	}

    	// Bail out if this is a no-op like .hide().hide()
    	propTween = !jQuery.isEmptyObject( props );
    	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
    		return;
    	}

    	// Restrict "overflow" and "display" styles during box animations
    	if ( isBox && elem.nodeType === 1 ) {

    		// Support: IE <=9 - 11, Edge 12 - 15
    		// Record all 3 overflow attributes because IE does not infer the shorthand
    		// from identically-valued overflowX and overflowY and Edge just mirrors
    		// the overflowX value there.
    		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

    		// Identify a display type, preferring old show/hide data over the CSS cascade
    		restoreDisplay = dataShow && dataShow.display;
    		if ( restoreDisplay == null ) {
    			restoreDisplay = dataPriv.get( elem, "display" );
    		}
    		display = jQuery.css( elem, "display" );
    		if ( display === "none" ) {
    			if ( restoreDisplay ) {
    				display = restoreDisplay;
    			} else {

    				// Get nonempty value(s) by temporarily forcing visibility
    				showHide( [ elem ], true );
    				restoreDisplay = elem.style.display || restoreDisplay;
    				display = jQuery.css( elem, "display" );
    				showHide( [ elem ] );
    			}
    		}

    		// Animate inline elements as inline-block
    		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
    			if ( jQuery.css( elem, "float" ) === "none" ) {

    				// Restore the original display value at the end of pure show/hide animations
    				if ( !propTween ) {
    					anim.done( function() {
    						style.display = restoreDisplay;
    					} );
    					if ( restoreDisplay == null ) {
    						display = style.display;
    						restoreDisplay = display === "none" ? "" : display;
    					}
    				}
    				style.display = "inline-block";
    			}
    		}
    	}

    	if ( opts.overflow ) {
    		style.overflow = "hidden";
    		anim.always( function() {
    			style.overflow = opts.overflow[ 0 ];
    			style.overflowX = opts.overflow[ 1 ];
    			style.overflowY = opts.overflow[ 2 ];
    		} );
    	}

    	// Implement show/hide animations
    	propTween = false;
    	for ( prop in orig ) {

    		// General show/hide setup for this element animation
    		if ( !propTween ) {
    			if ( dataShow ) {
    				if ( "hidden" in dataShow ) {
    					hidden = dataShow.hidden;
    				}
    			} else {
    				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
    			}

    			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
    			if ( toggle ) {
    				dataShow.hidden = !hidden;
    			}

    			// Show elements before animating them
    			if ( hidden ) {
    				showHide( [ elem ], true );
    			}

    			/* eslint-disable no-loop-func */

    			anim.done( function() {

    			/* eslint-enable no-loop-func */

    				// The final step of a "hide" animation is actually hiding the element
    				if ( !hidden ) {
    					showHide( [ elem ] );
    				}
    				dataPriv.remove( elem, "fxshow" );
    				for ( prop in orig ) {
    					jQuery.style( elem, prop, orig[ prop ] );
    				}
    			} );
    		}

    		// Per-property setup
    		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
    		if ( !( prop in dataShow ) ) {
    			dataShow[ prop ] = propTween.start;
    			if ( hidden ) {
    				propTween.end = propTween.start;
    				propTween.start = 0;
    			}
    		}
    	}
    }

    function propFilter( props, specialEasing ) {
    	var index, name, easing, value, hooks;

    	// camelCase, specialEasing and expand cssHook pass
    	for ( index in props ) {
    		name = camelCase( index );
    		easing = specialEasing[ name ];
    		value = props[ index ];
    		if ( Array.isArray( value ) ) {
    			easing = value[ 1 ];
    			value = props[ index ] = value[ 0 ];
    		}

    		if ( index !== name ) {
    			props[ name ] = value;
    			delete props[ index ];
    		}

    		hooks = jQuery.cssHooks[ name ];
    		if ( hooks && "expand" in hooks ) {
    			value = hooks.expand( value );
    			delete props[ name ];

    			// Not quite $.extend, this won't overwrite existing keys.
    			// Reusing 'index' because we have the correct "name"
    			for ( index in value ) {
    				if ( !( index in props ) ) {
    					props[ index ] = value[ index ];
    					specialEasing[ index ] = easing;
    				}
    			}
    		} else {
    			specialEasing[ name ] = easing;
    		}
    	}
    }

    function Animation( elem, properties, options ) {
    	var result,
    		stopped,
    		index = 0,
    		length = Animation.prefilters.length,
    		deferred = jQuery.Deferred().always( function() {

    			// Don't match elem in the :animated selector
    			delete tick.elem;
    		} ),
    		tick = function() {
    			if ( stopped ) {
    				return false;
    			}
    			var currentTime = fxNow || createFxNow(),
    				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

    				// Support: Android 2.3 only
    				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
    				temp = remaining / animation.duration || 0,
    				percent = 1 - temp,
    				index = 0,
    				length = animation.tweens.length;

    			for ( ; index < length; index++ ) {
    				animation.tweens[ index ].run( percent );
    			}

    			deferred.notifyWith( elem, [ animation, percent, remaining ] );

    			// If there's more to do, yield
    			if ( percent < 1 && length ) {
    				return remaining;
    			}

    			// If this was an empty animation, synthesize a final progress notification
    			if ( !length ) {
    				deferred.notifyWith( elem, [ animation, 1, 0 ] );
    			}

    			// Resolve the animation and report its conclusion
    			deferred.resolveWith( elem, [ animation ] );
    			return false;
    		},
    		animation = deferred.promise( {
    			elem: elem,
    			props: jQuery.extend( {}, properties ),
    			opts: jQuery.extend( true, {
    				specialEasing: {},
    				easing: jQuery.easing._default
    			}, options ),
    			originalProperties: properties,
    			originalOptions: options,
    			startTime: fxNow || createFxNow(),
    			duration: options.duration,
    			tweens: [],
    			createTween: function( prop, end ) {
    				var tween = jQuery.Tween( elem, animation.opts, prop, end,
    						animation.opts.specialEasing[ prop ] || animation.opts.easing );
    				animation.tweens.push( tween );
    				return tween;
    			},
    			stop: function( gotoEnd ) {
    				var index = 0,

    					// If we are going to the end, we want to run all the tweens
    					// otherwise we skip this part
    					length = gotoEnd ? animation.tweens.length : 0;
    				if ( stopped ) {
    					return this;
    				}
    				stopped = true;
    				for ( ; index < length; index++ ) {
    					animation.tweens[ index ].run( 1 );
    				}

    				// Resolve when we played the last frame; otherwise, reject
    				if ( gotoEnd ) {
    					deferred.notifyWith( elem, [ animation, 1, 0 ] );
    					deferred.resolveWith( elem, [ animation, gotoEnd ] );
    				} else {
    					deferred.rejectWith( elem, [ animation, gotoEnd ] );
    				}
    				return this;
    			}
    		} ),
    		props = animation.props;

    	propFilter( props, animation.opts.specialEasing );

    	for ( ; index < length; index++ ) {
    		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
    		if ( result ) {
    			if ( isFunction( result.stop ) ) {
    				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
    					result.stop.bind( result );
    			}
    			return result;
    		}
    	}

    	jQuery.map( props, createTween, animation );

    	if ( isFunction( animation.opts.start ) ) {
    		animation.opts.start.call( elem, animation );
    	}

    	// Attach callbacks from options
    	animation
    		.progress( animation.opts.progress )
    		.done( animation.opts.done, animation.opts.complete )
    		.fail( animation.opts.fail )
    		.always( animation.opts.always );

    	jQuery.fx.timer(
    		jQuery.extend( tick, {
    			elem: elem,
    			anim: animation,
    			queue: animation.opts.queue
    		} )
    	);

    	return animation;
    }

    jQuery.Animation = jQuery.extend( Animation, {

    	tweeners: {
    		"*": [ function( prop, value ) {
    			var tween = this.createTween( prop, value );
    			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
    			return tween;
    		} ]
    	},

    	tweener: function( props, callback ) {
    		if ( isFunction( props ) ) {
    			callback = props;
    			props = [ "*" ];
    		} else {
    			props = props.match( rnothtmlwhite );
    		}

    		var prop,
    			index = 0,
    			length = props.length;

    		for ( ; index < length; index++ ) {
    			prop = props[ index ];
    			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
    			Animation.tweeners[ prop ].unshift( callback );
    		}
    	},

    	prefilters: [ defaultPrefilter ],

    	prefilter: function( callback, prepend ) {
    		if ( prepend ) {
    			Animation.prefilters.unshift( callback );
    		} else {
    			Animation.prefilters.push( callback );
    		}
    	}
    } );

    jQuery.speed = function( speed, easing, fn ) {
    	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
    		complete: fn || !fn && easing ||
    			isFunction( speed ) && speed,
    		duration: speed,
    		easing: fn && easing || easing && !isFunction( easing ) && easing
    	};

    	// Go to the end state if fx are off
    	if ( jQuery.fx.off ) {
    		opt.duration = 0;

    	} else {
    		if ( typeof opt.duration !== "number" ) {
    			if ( opt.duration in jQuery.fx.speeds ) {
    				opt.duration = jQuery.fx.speeds[ opt.duration ];

    			} else {
    				opt.duration = jQuery.fx.speeds._default;
    			}
    		}
    	}

    	// Normalize opt.queue - true/undefined/null -> "fx"
    	if ( opt.queue == null || opt.queue === true ) {
    		opt.queue = "fx";
    	}

    	// Queueing
    	opt.old = opt.complete;

    	opt.complete = function() {
    		if ( isFunction( opt.old ) ) {
    			opt.old.call( this );
    		}

    		if ( opt.queue ) {
    			jQuery.dequeue( this, opt.queue );
    		}
    	};

    	return opt;
    };

    jQuery.fn.extend( {
    	fadeTo: function( speed, to, easing, callback ) {

    		// Show any hidden elements after setting opacity to 0
    		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

    			// Animate to the value specified
    			.end().animate( { opacity: to }, speed, easing, callback );
    	},
    	animate: function( prop, speed, easing, callback ) {
    		var empty = jQuery.isEmptyObject( prop ),
    			optall = jQuery.speed( speed, easing, callback ),
    			doAnimation = function() {

    				// Operate on a copy of prop so per-property easing won't be lost
    				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

    				// Empty animations, or finishing resolves immediately
    				if ( empty || dataPriv.get( this, "finish" ) ) {
    					anim.stop( true );
    				}
    			};
    			doAnimation.finish = doAnimation;

    		return empty || optall.queue === false ?
    			this.each( doAnimation ) :
    			this.queue( optall.queue, doAnimation );
    	},
    	stop: function( type, clearQueue, gotoEnd ) {
    		var stopQueue = function( hooks ) {
    			var stop = hooks.stop;
    			delete hooks.stop;
    			stop( gotoEnd );
    		};

    		if ( typeof type !== "string" ) {
    			gotoEnd = clearQueue;
    			clearQueue = type;
    			type = undefined;
    		}
    		if ( clearQueue ) {
    			this.queue( type || "fx", [] );
    		}

    		return this.each( function() {
    			var dequeue = true,
    				index = type != null && type + "queueHooks",
    				timers = jQuery.timers,
    				data = dataPriv.get( this );

    			if ( index ) {
    				if ( data[ index ] && data[ index ].stop ) {
    					stopQueue( data[ index ] );
    				}
    			} else {
    				for ( index in data ) {
    					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
    						stopQueue( data[ index ] );
    					}
    				}
    			}

    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this &&
    					( type == null || timers[ index ].queue === type ) ) {

    					timers[ index ].anim.stop( gotoEnd );
    					dequeue = false;
    					timers.splice( index, 1 );
    				}
    			}

    			// Start the next in the queue if the last step wasn't forced.
    			// Timers currently will call their complete callbacks, which
    			// will dequeue but only if they were gotoEnd.
    			if ( dequeue || !gotoEnd ) {
    				jQuery.dequeue( this, type );
    			}
    		} );
    	},
    	finish: function( type ) {
    		if ( type !== false ) {
    			type = type || "fx";
    		}
    		return this.each( function() {
    			var index,
    				data = dataPriv.get( this ),
    				queue = data[ type + "queue" ],
    				hooks = data[ type + "queueHooks" ],
    				timers = jQuery.timers,
    				length = queue ? queue.length : 0;

    			// Enable finishing flag on private data
    			data.finish = true;

    			// Empty the queue first
    			jQuery.queue( this, type, [] );

    			if ( hooks && hooks.stop ) {
    				hooks.stop.call( this, true );
    			}

    			// Look for any active animations, and finish them
    			for ( index = timers.length; index--; ) {
    				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
    					timers[ index ].anim.stop( true );
    					timers.splice( index, 1 );
    				}
    			}

    			// Look for any animations in the old queue and finish them
    			for ( index = 0; index < length; index++ ) {
    				if ( queue[ index ] && queue[ index ].finish ) {
    					queue[ index ].finish.call( this );
    				}
    			}

    			// Turn off finishing flag
    			delete data.finish;
    		} );
    	}
    } );

    jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
    	var cssFn = jQuery.fn[ name ];
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return speed == null || typeof speed === "boolean" ?
    			cssFn.apply( this, arguments ) :
    			this.animate( genFx( name, true ), speed, easing, callback );
    	};
    } );

    // Generate shortcuts for custom animations
    jQuery.each( {
    	slideDown: genFx( "show" ),
    	slideUp: genFx( "hide" ),
    	slideToggle: genFx( "toggle" ),
    	fadeIn: { opacity: "show" },
    	fadeOut: { opacity: "hide" },
    	fadeToggle: { opacity: "toggle" }
    }, function( name, props ) {
    	jQuery.fn[ name ] = function( speed, easing, callback ) {
    		return this.animate( props, speed, easing, callback );
    	};
    } );

    jQuery.timers = [];
    jQuery.fx.tick = function() {
    	var timer,
    		i = 0,
    		timers = jQuery.timers;

    	fxNow = Date.now();

    	for ( ; i < timers.length; i++ ) {
    		timer = timers[ i ];

    		// Run the timer and safely remove it when done (allowing for external removal)
    		if ( !timer() && timers[ i ] === timer ) {
    			timers.splice( i--, 1 );
    		}
    	}

    	if ( !timers.length ) {
    		jQuery.fx.stop();
    	}
    	fxNow = undefined;
    };

    jQuery.fx.timer = function( timer ) {
    	jQuery.timers.push( timer );
    	jQuery.fx.start();
    };

    jQuery.fx.interval = 13;
    jQuery.fx.start = function() {
    	if ( inProgress ) {
    		return;
    	}

    	inProgress = true;
    	schedule();
    };

    jQuery.fx.stop = function() {
    	inProgress = null;
    };

    jQuery.fx.speeds = {
    	slow: 600,
    	fast: 200,

    	// Default speed
    	_default: 400
    };


    // Based off of the plugin by Clint Helfers, with permission.
    // https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
    jQuery.fn.delay = function( time, type ) {
    	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
    	type = type || "fx";

    	return this.queue( type, function( next, hooks ) {
    		var timeout = window.setTimeout( next, time );
    		hooks.stop = function() {
    			window.clearTimeout( timeout );
    		};
    	} );
    };


    ( function() {
    	var input = document.createElement( "input" ),
    		select = document.createElement( "select" ),
    		opt = select.appendChild( document.createElement( "option" ) );

    	input.type = "checkbox";

    	// Support: Android <=4.3 only
    	// Default value for a checkbox should be "on"
    	support.checkOn = input.value !== "";

    	// Support: IE <=11 only
    	// Must access selectedIndex to make default options select
    	support.optSelected = opt.selected;

    	// Support: IE <=11 only
    	// An input loses its value after becoming a radio
    	input = document.createElement( "input" );
    	input.value = "t";
    	input.type = "radio";
    	support.radioValue = input.value === "t";
    } )();


    var boolHook,
    	attrHandle = jQuery.expr.attrHandle;

    jQuery.fn.extend( {
    	attr: function( name, value ) {
    		return access( this, jQuery.attr, name, value, arguments.length > 1 );
    	},

    	removeAttr: function( name ) {
    		return this.each( function() {
    			jQuery.removeAttr( this, name );
    		} );
    	}
    } );

    jQuery.extend( {
    	attr: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;

    		// Don't get/set attributes on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}

    		// Fallback to prop when attributes are not supported
    		if ( typeof elem.getAttribute === "undefined" ) {
    			return jQuery.prop( elem, name, value );
    		}

    		// Attribute hooks are determined by the lowercase version
    		// Grab necessary hook if one is defined
    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
    			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
    				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
    		}

    		if ( value !== undefined ) {
    			if ( value === null ) {
    				jQuery.removeAttr( elem, name );
    				return;
    			}

    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}

    			elem.setAttribute( name, value + "" );
    			return value;
    		}

    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}

    		ret = jQuery.find.attr( elem, name );

    		// Non-existent attributes return null, we normalize to undefined
    		return ret == null ? undefined : ret;
    	},

    	attrHooks: {
    		type: {
    			set: function( elem, value ) {
    				if ( !support.radioValue && value === "radio" &&
    					nodeName( elem, "input" ) ) {
    					var val = elem.value;
    					elem.setAttribute( "type", value );
    					if ( val ) {
    						elem.value = val;
    					}
    					return value;
    				}
    			}
    		}
    	},

    	removeAttr: function( elem, value ) {
    		var name,
    			i = 0,

    			// Attribute names can contain non-HTML whitespace characters
    			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
    			attrNames = value && value.match( rnothtmlwhite );

    		if ( attrNames && elem.nodeType === 1 ) {
    			while ( ( name = attrNames[ i++ ] ) ) {
    				elem.removeAttribute( name );
    			}
    		}
    	}
    } );

    // Hooks for boolean attributes
    boolHook = {
    	set: function( elem, value, name ) {
    		if ( value === false ) {

    			// Remove boolean attributes when set to false
    			jQuery.removeAttr( elem, name );
    		} else {
    			elem.setAttribute( name, name );
    		}
    		return name;
    	}
    };

    jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
    	var getter = attrHandle[ name ] || jQuery.find.attr;

    	attrHandle[ name ] = function( elem, name, isXML ) {
    		var ret, handle,
    			lowercaseName = name.toLowerCase();

    		if ( !isXML ) {

    			// Avoid an infinite loop by temporarily removing this function from the getter
    			handle = attrHandle[ lowercaseName ];
    			attrHandle[ lowercaseName ] = ret;
    			ret = getter( elem, name, isXML ) != null ?
    				lowercaseName :
    				null;
    			attrHandle[ lowercaseName ] = handle;
    		}
    		return ret;
    	};
    } );




    var rfocusable = /^(?:input|select|textarea|button)$/i,
    	rclickable = /^(?:a|area)$/i;

    jQuery.fn.extend( {
    	prop: function( name, value ) {
    		return access( this, jQuery.prop, name, value, arguments.length > 1 );
    	},

    	removeProp: function( name ) {
    		return this.each( function() {
    			delete this[ jQuery.propFix[ name ] || name ];
    		} );
    	}
    } );

    jQuery.extend( {
    	prop: function( elem, name, value ) {
    		var ret, hooks,
    			nType = elem.nodeType;

    		// Don't get/set properties on text, comment and attribute nodes
    		if ( nType === 3 || nType === 8 || nType === 2 ) {
    			return;
    		}

    		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

    			// Fix name and attach hooks
    			name = jQuery.propFix[ name ] || name;
    			hooks = jQuery.propHooks[ name ];
    		}

    		if ( value !== undefined ) {
    			if ( hooks && "set" in hooks &&
    				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
    				return ret;
    			}

    			return ( elem[ name ] = value );
    		}

    		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
    			return ret;
    		}

    		return elem[ name ];
    	},

    	propHooks: {
    		tabIndex: {
    			get: function( elem ) {

    				// Support: IE <=9 - 11 only
    				// elem.tabIndex doesn't always return the
    				// correct value when it hasn't been explicitly set
    				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
    				// Use proper attribute retrieval(#12072)
    				var tabindex = jQuery.find.attr( elem, "tabindex" );

    				if ( tabindex ) {
    					return parseInt( tabindex, 10 );
    				}

    				if (
    					rfocusable.test( elem.nodeName ) ||
    					rclickable.test( elem.nodeName ) &&
    					elem.href
    				) {
    					return 0;
    				}

    				return -1;
    			}
    		}
    	},

    	propFix: {
    		"for": "htmlFor",
    		"class": "className"
    	}
    } );

    // Support: IE <=11 only
    // Accessing the selectedIndex property
    // forces the browser to respect setting selected
    // on the option
    // The getter ensures a default option is selected
    // when in an optgroup
    // eslint rule "no-unused-expressions" is disabled for this code
    // since it considers such accessions noop
    if ( !support.optSelected ) {
    	jQuery.propHooks.selected = {
    		get: function( elem ) {

    			/* eslint no-unused-expressions: "off" */

    			var parent = elem.parentNode;
    			if ( parent && parent.parentNode ) {
    				parent.parentNode.selectedIndex;
    			}
    			return null;
    		},
    		set: function( elem ) {

    			/* eslint no-unused-expressions: "off" */

    			var parent = elem.parentNode;
    			if ( parent ) {
    				parent.selectedIndex;

    				if ( parent.parentNode ) {
    					parent.parentNode.selectedIndex;
    				}
    			}
    		}
    	};
    }

    jQuery.each( [
    	"tabIndex",
    	"readOnly",
    	"maxLength",
    	"cellSpacing",
    	"cellPadding",
    	"rowSpan",
    	"colSpan",
    	"useMap",
    	"frameBorder",
    	"contentEditable"
    ], function() {
    	jQuery.propFix[ this.toLowerCase() ] = this;
    } );




    	// Strip and collapse whitespace according to HTML spec
    	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
    	function stripAndCollapse( value ) {
    		var tokens = value.match( rnothtmlwhite ) || [];
    		return tokens.join( " " );
    	}


    function getClass( elem ) {
    	return elem.getAttribute && elem.getAttribute( "class" ) || "";
    }

    function classesToArray( value ) {
    	if ( Array.isArray( value ) ) {
    		return value;
    	}
    	if ( typeof value === "string" ) {
    		return value.match( rnothtmlwhite ) || [];
    	}
    	return [];
    }

    jQuery.fn.extend( {
    	addClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;

    		if ( isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}

    		classes = classesToArray( value );

    		if ( classes.length ) {
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );
    				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {
    						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
    							cur += clazz + " ";
    						}
    					}

    					// Only assign if different to avoid unneeded rendering.
    					finalValue = stripAndCollapse( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}

    		return this;
    	},

    	removeClass: function( value ) {
    		var classes, elem, cur, curValue, clazz, j, finalValue,
    			i = 0;

    		if ( isFunction( value ) ) {
    			return this.each( function( j ) {
    				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
    			} );
    		}

    		if ( !arguments.length ) {
    			return this.attr( "class", "" );
    		}

    		classes = classesToArray( value );

    		if ( classes.length ) {
    			while ( ( elem = this[ i++ ] ) ) {
    				curValue = getClass( elem );

    				// This expression is here for better compressibility (see addClass)
    				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

    				if ( cur ) {
    					j = 0;
    					while ( ( clazz = classes[ j++ ] ) ) {

    						// Remove *all* instances
    						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
    							cur = cur.replace( " " + clazz + " ", " " );
    						}
    					}

    					// Only assign if different to avoid unneeded rendering.
    					finalValue = stripAndCollapse( cur );
    					if ( curValue !== finalValue ) {
    						elem.setAttribute( "class", finalValue );
    					}
    				}
    			}
    		}

    		return this;
    	},

    	toggleClass: function( value, stateVal ) {
    		var type = typeof value,
    			isValidValue = type === "string" || Array.isArray( value );

    		if ( typeof stateVal === "boolean" && isValidValue ) {
    			return stateVal ? this.addClass( value ) : this.removeClass( value );
    		}

    		if ( isFunction( value ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).toggleClass(
    					value.call( this, i, getClass( this ), stateVal ),
    					stateVal
    				);
    			} );
    		}

    		return this.each( function() {
    			var className, i, self, classNames;

    			if ( isValidValue ) {

    				// Toggle individual class names
    				i = 0;
    				self = jQuery( this );
    				classNames = classesToArray( value );

    				while ( ( className = classNames[ i++ ] ) ) {

    					// Check each className given, space separated list
    					if ( self.hasClass( className ) ) {
    						self.removeClass( className );
    					} else {
    						self.addClass( className );
    					}
    				}

    			// Toggle whole class name
    			} else if ( value === undefined || type === "boolean" ) {
    				className = getClass( this );
    				if ( className ) {

    					// Store className if set
    					dataPriv.set( this, "__className__", className );
    				}

    				// If the element has a class name or if we're passed `false`,
    				// then remove the whole classname (if there was one, the above saved it).
    				// Otherwise bring back whatever was previously saved (if anything),
    				// falling back to the empty string if nothing was stored.
    				if ( this.setAttribute ) {
    					this.setAttribute( "class",
    						className || value === false ?
    						"" :
    						dataPriv.get( this, "__className__" ) || ""
    					);
    				}
    			}
    		} );
    	},

    	hasClass: function( selector ) {
    		var className, elem,
    			i = 0;

    		className = " " + selector + " ";
    		while ( ( elem = this[ i++ ] ) ) {
    			if ( elem.nodeType === 1 &&
    				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
    					return true;
    			}
    		}

    		return false;
    	}
    } );




    var rreturn = /\r/g;

    jQuery.fn.extend( {
    	val: function( value ) {
    		var hooks, ret, valueIsFunction,
    			elem = this[ 0 ];

    		if ( !arguments.length ) {
    			if ( elem ) {
    				hooks = jQuery.valHooks[ elem.type ] ||
    					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

    				if ( hooks &&
    					"get" in hooks &&
    					( ret = hooks.get( elem, "value" ) ) !== undefined
    				) {
    					return ret;
    				}

    				ret = elem.value;

    				// Handle most common string cases
    				if ( typeof ret === "string" ) {
    					return ret.replace( rreturn, "" );
    				}

    				// Handle cases where value is null/undef or number
    				return ret == null ? "" : ret;
    			}

    			return;
    		}

    		valueIsFunction = isFunction( value );

    		return this.each( function( i ) {
    			var val;

    			if ( this.nodeType !== 1 ) {
    				return;
    			}

    			if ( valueIsFunction ) {
    				val = value.call( this, i, jQuery( this ).val() );
    			} else {
    				val = value;
    			}

    			// Treat null/undefined as ""; convert numbers to string
    			if ( val == null ) {
    				val = "";

    			} else if ( typeof val === "number" ) {
    				val += "";

    			} else if ( Array.isArray( val ) ) {
    				val = jQuery.map( val, function( value ) {
    					return value == null ? "" : value + "";
    				} );
    			}

    			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

    			// If set returns undefined, fall back to normal setting
    			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
    				this.value = val;
    			}
    		} );
    	}
    } );

    jQuery.extend( {
    	valHooks: {
    		option: {
    			get: function( elem ) {

    				var val = jQuery.find.attr( elem, "value" );
    				return val != null ?
    					val :

    					// Support: IE <=10 - 11 only
    					// option.text throws exceptions (#14686, #14858)
    					// Strip and collapse whitespace
    					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
    					stripAndCollapse( jQuery.text( elem ) );
    			}
    		},
    		select: {
    			get: function( elem ) {
    				var value, option, i,
    					options = elem.options,
    					index = elem.selectedIndex,
    					one = elem.type === "select-one",
    					values = one ? null : [],
    					max = one ? index + 1 : options.length;

    				if ( index < 0 ) {
    					i = max;

    				} else {
    					i = one ? index : 0;
    				}

    				// Loop through all the selected options
    				for ( ; i < max; i++ ) {
    					option = options[ i ];

    					// Support: IE <=9 only
    					// IE8-9 doesn't update selected after form reset (#2551)
    					if ( ( option.selected || i === index ) &&

    							// Don't return options that are disabled or in a disabled optgroup
    							!option.disabled &&
    							( !option.parentNode.disabled ||
    								!nodeName( option.parentNode, "optgroup" ) ) ) {

    						// Get the specific value for the option
    						value = jQuery( option ).val();

    						// We don't need an array for one selects
    						if ( one ) {
    							return value;
    						}

    						// Multi-Selects return an array
    						values.push( value );
    					}
    				}

    				return values;
    			},

    			set: function( elem, value ) {
    				var optionSet, option,
    					options = elem.options,
    					values = jQuery.makeArray( value ),
    					i = options.length;

    				while ( i-- ) {
    					option = options[ i ];

    					/* eslint-disable no-cond-assign */

    					if ( option.selected =
    						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
    					) {
    						optionSet = true;
    					}

    					/* eslint-enable no-cond-assign */
    				}

    				// Force browsers to behave consistently when non-matching value is set
    				if ( !optionSet ) {
    					elem.selectedIndex = -1;
    				}
    				return values;
    			}
    		}
    	}
    } );

    // Radios and checkboxes getter/setter
    jQuery.each( [ "radio", "checkbox" ], function() {
    	jQuery.valHooks[ this ] = {
    		set: function( elem, value ) {
    			if ( Array.isArray( value ) ) {
    				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
    			}
    		}
    	};
    	if ( !support.checkOn ) {
    		jQuery.valHooks[ this ].get = function( elem ) {
    			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
    		};
    	}
    } );




    // Return jQuery for attributes-only inclusion


    support.focusin = "onfocusin" in window;


    var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
    	stopPropagationCallback = function( e ) {
    		e.stopPropagation();
    	};

    jQuery.extend( jQuery.event, {

    	trigger: function( event, data, elem, onlyHandlers ) {

    		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
    			eventPath = [ elem || document ],
    			type = hasOwn.call( event, "type" ) ? event.type : event,
    			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

    		cur = lastElement = tmp = elem = elem || document;

    		// Don't do events on text and comment nodes
    		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
    			return;
    		}

    		// focus/blur morphs to focusin/out; ensure we're not firing them right now
    		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
    			return;
    		}

    		if ( type.indexOf( "." ) > -1 ) {

    			// Namespaced trigger; create a regexp to match event type in handle()
    			namespaces = type.split( "." );
    			type = namespaces.shift();
    			namespaces.sort();
    		}
    		ontype = type.indexOf( ":" ) < 0 && "on" + type;

    		// Caller can pass in a jQuery.Event object, Object, or just an event type string
    		event = event[ jQuery.expando ] ?
    			event :
    			new jQuery.Event( type, typeof event === "object" && event );

    		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
    		event.isTrigger = onlyHandlers ? 2 : 3;
    		event.namespace = namespaces.join( "." );
    		event.rnamespace = event.namespace ?
    			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
    			null;

    		// Clean up the event in case it is being reused
    		event.result = undefined;
    		if ( !event.target ) {
    			event.target = elem;
    		}

    		// Clone any incoming data and prepend the event, creating the handler arg list
    		data = data == null ?
    			[ event ] :
    			jQuery.makeArray( data, [ event ] );

    		// Allow special events to draw outside the lines
    		special = jQuery.event.special[ type ] || {};
    		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
    			return;
    		}

    		// Determine event propagation path in advance, per W3C events spec (#9951)
    		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
    		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

    			bubbleType = special.delegateType || type;
    			if ( !rfocusMorph.test( bubbleType + type ) ) {
    				cur = cur.parentNode;
    			}
    			for ( ; cur; cur = cur.parentNode ) {
    				eventPath.push( cur );
    				tmp = cur;
    			}

    			// Only add window if we got to document (e.g., not plain obj or detached DOM)
    			if ( tmp === ( elem.ownerDocument || document ) ) {
    				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
    			}
    		}

    		// Fire handlers on the event path
    		i = 0;
    		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
    			lastElement = cur;
    			event.type = i > 1 ?
    				bubbleType :
    				special.bindType || type;

    			// jQuery handler
    			handle = (
    					dataPriv.get( cur, "events" ) || Object.create( null )
    				)[ event.type ] &&
    				dataPriv.get( cur, "handle" );
    			if ( handle ) {
    				handle.apply( cur, data );
    			}

    			// Native handler
    			handle = ontype && cur[ ontype ];
    			if ( handle && handle.apply && acceptData( cur ) ) {
    				event.result = handle.apply( cur, data );
    				if ( event.result === false ) {
    					event.preventDefault();
    				}
    			}
    		}
    		event.type = type;

    		// If nobody prevented the default action, do it now
    		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

    			if ( ( !special._default ||
    				special._default.apply( eventPath.pop(), data ) === false ) &&
    				acceptData( elem ) ) {

    				// Call a native DOM method on the target with the same name as the event.
    				// Don't do default actions on window, that's where global variables be (#6170)
    				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

    					// Don't re-trigger an onFOO event when we call its FOO() method
    					tmp = elem[ ontype ];

    					if ( tmp ) {
    						elem[ ontype ] = null;
    					}

    					// Prevent re-triggering of the same event, since we already bubbled it above
    					jQuery.event.triggered = type;

    					if ( event.isPropagationStopped() ) {
    						lastElement.addEventListener( type, stopPropagationCallback );
    					}

    					elem[ type ]();

    					if ( event.isPropagationStopped() ) {
    						lastElement.removeEventListener( type, stopPropagationCallback );
    					}

    					jQuery.event.triggered = undefined;

    					if ( tmp ) {
    						elem[ ontype ] = tmp;
    					}
    				}
    			}
    		}

    		return event.result;
    	},

    	// Piggyback on a donor event to simulate a different one
    	// Used only for `focus(in | out)` events
    	simulate: function( type, elem, event ) {
    		var e = jQuery.extend(
    			new jQuery.Event(),
    			event,
    			{
    				type: type,
    				isSimulated: true
    			}
    		);

    		jQuery.event.trigger( e, null, elem );
    	}

    } );

    jQuery.fn.extend( {

    	trigger: function( type, data ) {
    		return this.each( function() {
    			jQuery.event.trigger( type, data, this );
    		} );
    	},
    	triggerHandler: function( type, data ) {
    		var elem = this[ 0 ];
    		if ( elem ) {
    			return jQuery.event.trigger( type, data, elem, true );
    		}
    	}
    } );


    // Support: Firefox <=44
    // Firefox doesn't have focus(in | out) events
    // Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
    //
    // Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
    // focus(in | out) events fire after focus & blur events,
    // which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
    // Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
    if ( !support.focusin ) {
    	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

    		// Attach a single capturing handler on the document while someone wants focusin/focusout
    		var handler = function( event ) {
    			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
    		};

    		jQuery.event.special[ fix ] = {
    			setup: function() {

    				// Handle: regular nodes (via `this.ownerDocument`), window
    				// (via `this.document`) & document (via `this`).
    				var doc = this.ownerDocument || this.document || this,
    					attaches = dataPriv.access( doc, fix );

    				if ( !attaches ) {
    					doc.addEventListener( orig, handler, true );
    				}
    				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
    			},
    			teardown: function() {
    				var doc = this.ownerDocument || this.document || this,
    					attaches = dataPriv.access( doc, fix ) - 1;

    				if ( !attaches ) {
    					doc.removeEventListener( orig, handler, true );
    					dataPriv.remove( doc, fix );

    				} else {
    					dataPriv.access( doc, fix, attaches );
    				}
    			}
    		};
    	} );
    }
    var location = window.location;

    var nonce = { guid: Date.now() };

    var rquery = ( /\?/ );



    // Cross-browser xml parsing
    jQuery.parseXML = function( data ) {
    	var xml;
    	if ( !data || typeof data !== "string" ) {
    		return null;
    	}

    	// Support: IE 9 - 11 only
    	// IE throws on parseFromString with invalid input.
    	try {
    		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
    	} catch ( e ) {
    		xml = undefined;
    	}

    	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
    		jQuery.error( "Invalid XML: " + data );
    	}
    	return xml;
    };


    var
    	rbracket = /\[\]$/,
    	rCRLF = /\r?\n/g,
    	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
    	rsubmittable = /^(?:input|select|textarea|keygen)/i;

    function buildParams( prefix, obj, traditional, add ) {
    	var name;

    	if ( Array.isArray( obj ) ) {

    		// Serialize array item.
    		jQuery.each( obj, function( i, v ) {
    			if ( traditional || rbracket.test( prefix ) ) {

    				// Treat each array item as a scalar.
    				add( prefix, v );

    			} else {

    				// Item is non-scalar (array or object), encode its numeric index.
    				buildParams(
    					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
    					v,
    					traditional,
    					add
    				);
    			}
    		} );

    	} else if ( !traditional && toType( obj ) === "object" ) {

    		// Serialize object item.
    		for ( name in obj ) {
    			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
    		}

    	} else {

    		// Serialize scalar item.
    		add( prefix, obj );
    	}
    }

    // Serialize an array of form elements or a set of
    // key/values into a query string
    jQuery.param = function( a, traditional ) {
    	var prefix,
    		s = [],
    		add = function( key, valueOrFunction ) {

    			// If value is a function, invoke it and use its return value
    			var value = isFunction( valueOrFunction ) ?
    				valueOrFunction() :
    				valueOrFunction;

    			s[ s.length ] = encodeURIComponent( key ) + "=" +
    				encodeURIComponent( value == null ? "" : value );
    		};

    	if ( a == null ) {
    		return "";
    	}

    	// If an array was passed in, assume that it is an array of form elements.
    	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

    		// Serialize the form elements
    		jQuery.each( a, function() {
    			add( this.name, this.value );
    		} );

    	} else {

    		// If traditional, encode the "old" way (the way 1.3.2 or older
    		// did it), otherwise encode params recursively.
    		for ( prefix in a ) {
    			buildParams( prefix, a[ prefix ], traditional, add );
    		}
    	}

    	// Return the resulting serialization
    	return s.join( "&" );
    };

    jQuery.fn.extend( {
    	serialize: function() {
    		return jQuery.param( this.serializeArray() );
    	},
    	serializeArray: function() {
    		return this.map( function() {

    			// Can add propHook for "elements" to filter or add form elements
    			var elements = jQuery.prop( this, "elements" );
    			return elements ? jQuery.makeArray( elements ) : this;
    		} )
    		.filter( function() {
    			var type = this.type;

    			// Use .is( ":disabled" ) so that fieldset[disabled] works
    			return this.name && !jQuery( this ).is( ":disabled" ) &&
    				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
    				( this.checked || !rcheckableType.test( type ) );
    		} )
    		.map( function( _i, elem ) {
    			var val = jQuery( this ).val();

    			if ( val == null ) {
    				return null;
    			}

    			if ( Array.isArray( val ) ) {
    				return jQuery.map( val, function( val ) {
    					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    				} );
    			}

    			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
    		} ).get();
    	}
    } );


    var
    	r20 = /%20/g,
    	rhash = /#.*$/,
    	rantiCache = /([?&])_=[^&]*/,
    	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

    	// #7653, #8125, #8152: local protocol detection
    	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    	rnoContent = /^(?:GET|HEAD)$/,
    	rprotocol = /^\/\//,

    	/* Prefilters
    	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
    	 * 2) These are called:
    	 *    - BEFORE asking for a transport
    	 *    - AFTER param serialization (s.data is a string if s.processData is true)
    	 * 3) key is the dataType
    	 * 4) the catchall symbol "*" can be used
    	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
    	 */
    	prefilters = {},

    	/* Transports bindings
    	 * 1) key is the dataType
    	 * 2) the catchall symbol "*" can be used
    	 * 3) selection will start with transport dataType and THEN go to "*" if needed
    	 */
    	transports = {},

    	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
    	allTypes = "*/".concat( "*" ),

    	// Anchor tag for parsing the document origin
    	originAnchor = document.createElement( "a" );
    	originAnchor.href = location.href;

    // Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
    function addToPrefiltersOrTransports( structure ) {

    	// dataTypeExpression is optional and defaults to "*"
    	return function( dataTypeExpression, func ) {

    		if ( typeof dataTypeExpression !== "string" ) {
    			func = dataTypeExpression;
    			dataTypeExpression = "*";
    		}

    		var dataType,
    			i = 0,
    			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

    		if ( isFunction( func ) ) {

    			// For each dataType in the dataTypeExpression
    			while ( ( dataType = dataTypes[ i++ ] ) ) {

    				// Prepend if requested
    				if ( dataType[ 0 ] === "+" ) {
    					dataType = dataType.slice( 1 ) || "*";
    					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

    				// Otherwise append
    				} else {
    					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
    				}
    			}
    		}
    	};
    }

    // Base inspection function for prefilters and transports
    function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

    	var inspected = {},
    		seekingTransport = ( structure === transports );

    	function inspect( dataType ) {
    		var selected;
    		inspected[ dataType ] = true;
    		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
    			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
    			if ( typeof dataTypeOrTransport === "string" &&
    				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

    				options.dataTypes.unshift( dataTypeOrTransport );
    				inspect( dataTypeOrTransport );
    				return false;
    			} else if ( seekingTransport ) {
    				return !( selected = dataTypeOrTransport );
    			}
    		} );
    		return selected;
    	}

    	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
    }

    // A special extend for ajax options
    // that takes "flat" options (not to be deep extended)
    // Fixes #9887
    function ajaxExtend( target, src ) {
    	var key, deep,
    		flatOptions = jQuery.ajaxSettings.flatOptions || {};

    	for ( key in src ) {
    		if ( src[ key ] !== undefined ) {
    			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
    		}
    	}
    	if ( deep ) {
    		jQuery.extend( true, target, deep );
    	}

    	return target;
    }

    /* Handles responses to an ajax request:
     * - finds the right dataType (mediates between content-type and expected dataType)
     * - returns the corresponding response
     */
    function ajaxHandleResponses( s, jqXHR, responses ) {

    	var ct, type, finalDataType, firstDataType,
    		contents = s.contents,
    		dataTypes = s.dataTypes;

    	// Remove auto dataType and get content-type in the process
    	while ( dataTypes[ 0 ] === "*" ) {
    		dataTypes.shift();
    		if ( ct === undefined ) {
    			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
    		}
    	}

    	// Check if we're dealing with a known content-type
    	if ( ct ) {
    		for ( type in contents ) {
    			if ( contents[ type ] && contents[ type ].test( ct ) ) {
    				dataTypes.unshift( type );
    				break;
    			}
    		}
    	}

    	// Check to see if we have a response for the expected dataType
    	if ( dataTypes[ 0 ] in responses ) {
    		finalDataType = dataTypes[ 0 ];
    	} else {

    		// Try convertible dataTypes
    		for ( type in responses ) {
    			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
    				finalDataType = type;
    				break;
    			}
    			if ( !firstDataType ) {
    				firstDataType = type;
    			}
    		}

    		// Or just use first one
    		finalDataType = finalDataType || firstDataType;
    	}

    	// If we found a dataType
    	// We add the dataType to the list if needed
    	// and return the corresponding response
    	if ( finalDataType ) {
    		if ( finalDataType !== dataTypes[ 0 ] ) {
    			dataTypes.unshift( finalDataType );
    		}
    		return responses[ finalDataType ];
    	}
    }

    /* Chain conversions given the request and the original response
     * Also sets the responseXXX fields on the jqXHR instance
     */
    function ajaxConvert( s, response, jqXHR, isSuccess ) {
    	var conv2, current, conv, tmp, prev,
    		converters = {},

    		// Work with a copy of dataTypes in case we need to modify it for conversion
    		dataTypes = s.dataTypes.slice();

    	// Create converters map with lowercased keys
    	if ( dataTypes[ 1 ] ) {
    		for ( conv in s.converters ) {
    			converters[ conv.toLowerCase() ] = s.converters[ conv ];
    		}
    	}

    	current = dataTypes.shift();

    	// Convert to each sequential dataType
    	while ( current ) {

    		if ( s.responseFields[ current ] ) {
    			jqXHR[ s.responseFields[ current ] ] = response;
    		}

    		// Apply the dataFilter if provided
    		if ( !prev && isSuccess && s.dataFilter ) {
    			response = s.dataFilter( response, s.dataType );
    		}

    		prev = current;
    		current = dataTypes.shift();

    		if ( current ) {

    			// There's only work to do if current dataType is non-auto
    			if ( current === "*" ) {

    				current = prev;

    			// Convert response if prev dataType is non-auto and differs from current
    			} else if ( prev !== "*" && prev !== current ) {

    				// Seek a direct converter
    				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

    				// If none found, seek a pair
    				if ( !conv ) {
    					for ( conv2 in converters ) {

    						// If conv2 outputs current
    						tmp = conv2.split( " " );
    						if ( tmp[ 1 ] === current ) {

    							// If prev can be converted to accepted input
    							conv = converters[ prev + " " + tmp[ 0 ] ] ||
    								converters[ "* " + tmp[ 0 ] ];
    							if ( conv ) {

    								// Condense equivalence converters
    								if ( conv === true ) {
    									conv = converters[ conv2 ];

    								// Otherwise, insert the intermediate dataType
    								} else if ( converters[ conv2 ] !== true ) {
    									current = tmp[ 0 ];
    									dataTypes.unshift( tmp[ 1 ] );
    								}
    								break;
    							}
    						}
    					}
    				}

    				// Apply converter (if not an equivalence)
    				if ( conv !== true ) {

    					// Unless errors are allowed to bubble, catch and return them
    					if ( conv && s.throws ) {
    						response = conv( response );
    					} else {
    						try {
    							response = conv( response );
    						} catch ( e ) {
    							return {
    								state: "parsererror",
    								error: conv ? e : "No conversion from " + prev + " to " + current
    							};
    						}
    					}
    				}
    			}
    		}
    	}

    	return { state: "success", data: response };
    }

    jQuery.extend( {

    	// Counter for holding the number of active queries
    	active: 0,

    	// Last-Modified header cache for next request
    	lastModified: {},
    	etag: {},

    	ajaxSettings: {
    		url: location.href,
    		type: "GET",
    		isLocal: rlocalProtocol.test( location.protocol ),
    		global: true,
    		processData: true,
    		async: true,
    		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

    		/*
    		timeout: 0,
    		data: null,
    		dataType: null,
    		username: null,
    		password: null,
    		cache: null,
    		throws: false,
    		traditional: false,
    		headers: {},
    		*/

    		accepts: {
    			"*": allTypes,
    			text: "text/plain",
    			html: "text/html",
    			xml: "application/xml, text/xml",
    			json: "application/json, text/javascript"
    		},

    		contents: {
    			xml: /\bxml\b/,
    			html: /\bhtml/,
    			json: /\bjson\b/
    		},

    		responseFields: {
    			xml: "responseXML",
    			text: "responseText",
    			json: "responseJSON"
    		},

    		// Data converters
    		// Keys separate source (or catchall "*") and destination types with a single space
    		converters: {

    			// Convert anything to text
    			"* text": String,

    			// Text to html (true = no transformation)
    			"text html": true,

    			// Evaluate text as a json expression
    			"text json": JSON.parse,

    			// Parse text as xml
    			"text xml": jQuery.parseXML
    		},

    		// For options that shouldn't be deep extended:
    		// you can add your own custom options here if
    		// and when you create one that shouldn't be
    		// deep extended (see ajaxExtend)
    		flatOptions: {
    			url: true,
    			context: true
    		}
    	},

    	// Creates a full fledged settings object into target
    	// with both ajaxSettings and settings fields.
    	// If target is omitted, writes into ajaxSettings.
    	ajaxSetup: function( target, settings ) {
    		return settings ?

    			// Building a settings object
    			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

    			// Extending ajaxSettings
    			ajaxExtend( jQuery.ajaxSettings, target );
    	},

    	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
    	ajaxTransport: addToPrefiltersOrTransports( transports ),

    	// Main method
    	ajax: function( url, options ) {

    		// If url is an object, simulate pre-1.5 signature
    		if ( typeof url === "object" ) {
    			options = url;
    			url = undefined;
    		}

    		// Force options to be an object
    		options = options || {};

    		var transport,

    			// URL without anti-cache param
    			cacheURL,

    			// Response headers
    			responseHeadersString,
    			responseHeaders,

    			// timeout handle
    			timeoutTimer,

    			// Url cleanup var
    			urlAnchor,

    			// Request state (becomes false upon send and true upon completion)
    			completed,

    			// To know if global events are to be dispatched
    			fireGlobals,

    			// Loop variable
    			i,

    			// uncached part of the url
    			uncached,

    			// Create the final options object
    			s = jQuery.ajaxSetup( {}, options ),

    			// Callbacks context
    			callbackContext = s.context || s,

    			// Context for global events is callbackContext if it is a DOM node or jQuery collection
    			globalEventContext = s.context &&
    				( callbackContext.nodeType || callbackContext.jquery ) ?
    					jQuery( callbackContext ) :
    					jQuery.event,

    			// Deferreds
    			deferred = jQuery.Deferred(),
    			completeDeferred = jQuery.Callbacks( "once memory" ),

    			// Status-dependent callbacks
    			statusCode = s.statusCode || {},

    			// Headers (they are sent all at once)
    			requestHeaders = {},
    			requestHeadersNames = {},

    			// Default abort message
    			strAbort = "canceled",

    			// Fake xhr
    			jqXHR = {
    				readyState: 0,

    				// Builds headers hashtable if needed
    				getResponseHeader: function( key ) {
    					var match;
    					if ( completed ) {
    						if ( !responseHeaders ) {
    							responseHeaders = {};
    							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
    								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
    									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
    										.concat( match[ 2 ] );
    							}
    						}
    						match = responseHeaders[ key.toLowerCase() + " " ];
    					}
    					return match == null ? null : match.join( ", " );
    				},

    				// Raw string
    				getAllResponseHeaders: function() {
    					return completed ? responseHeadersString : null;
    				},

    				// Caches the header
    				setRequestHeader: function( name, value ) {
    					if ( completed == null ) {
    						name = requestHeadersNames[ name.toLowerCase() ] =
    							requestHeadersNames[ name.toLowerCase() ] || name;
    						requestHeaders[ name ] = value;
    					}
    					return this;
    				},

    				// Overrides response content-type header
    				overrideMimeType: function( type ) {
    					if ( completed == null ) {
    						s.mimeType = type;
    					}
    					return this;
    				},

    				// Status-dependent callbacks
    				statusCode: function( map ) {
    					var code;
    					if ( map ) {
    						if ( completed ) {

    							// Execute the appropriate callbacks
    							jqXHR.always( map[ jqXHR.status ] );
    						} else {

    							// Lazy-add the new callbacks in a way that preserves old ones
    							for ( code in map ) {
    								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
    							}
    						}
    					}
    					return this;
    				},

    				// Cancel the request
    				abort: function( statusText ) {
    					var finalText = statusText || strAbort;
    					if ( transport ) {
    						transport.abort( finalText );
    					}
    					done( 0, finalText );
    					return this;
    				}
    			};

    		// Attach deferreds
    		deferred.promise( jqXHR );

    		// Add protocol if not provided (prefilters might expect it)
    		// Handle falsy url in the settings object (#10093: consistency with old signature)
    		// We also use the url parameter if available
    		s.url = ( ( url || s.url || location.href ) + "" )
    			.replace( rprotocol, location.protocol + "//" );

    		// Alias method option to type as per ticket #12004
    		s.type = options.method || options.type || s.method || s.type;

    		// Extract dataTypes list
    		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

    		// A cross-domain request is in order when the origin doesn't match the current origin.
    		if ( s.crossDomain == null ) {
    			urlAnchor = document.createElement( "a" );

    			// Support: IE <=8 - 11, Edge 12 - 15
    			// IE throws exception on accessing the href property if url is malformed,
    			// e.g. http://example.com:80x/
    			try {
    				urlAnchor.href = s.url;

    				// Support: IE <=8 - 11 only
    				// Anchor's host property isn't correctly set when s.url is relative
    				urlAnchor.href = urlAnchor.href;
    				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
    					urlAnchor.protocol + "//" + urlAnchor.host;
    			} catch ( e ) {

    				// If there is an error parsing the URL, assume it is crossDomain,
    				// it can be rejected by the transport if it is invalid
    				s.crossDomain = true;
    			}
    		}

    		// Convert data if not already a string
    		if ( s.data && s.processData && typeof s.data !== "string" ) {
    			s.data = jQuery.param( s.data, s.traditional );
    		}

    		// Apply prefilters
    		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

    		// If request was aborted inside a prefilter, stop there
    		if ( completed ) {
    			return jqXHR;
    		}

    		// We can fire global events as of now if asked to
    		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
    		fireGlobals = jQuery.event && s.global;

    		// Watch for a new set of requests
    		if ( fireGlobals && jQuery.active++ === 0 ) {
    			jQuery.event.trigger( "ajaxStart" );
    		}

    		// Uppercase the type
    		s.type = s.type.toUpperCase();

    		// Determine if request has content
    		s.hasContent = !rnoContent.test( s.type );

    		// Save the URL in case we're toying with the If-Modified-Since
    		// and/or If-None-Match header later on
    		// Remove hash to simplify url manipulation
    		cacheURL = s.url.replace( rhash, "" );

    		// More options handling for requests with no content
    		if ( !s.hasContent ) {

    			// Remember the hash so we can put it back
    			uncached = s.url.slice( cacheURL.length );

    			// If data is available and should be processed, append data to url
    			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
    				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

    				// #9682: remove data so that it's not used in an eventual retry
    				delete s.data;
    			}

    			// Add or update anti-cache param if needed
    			if ( s.cache === false ) {
    				cacheURL = cacheURL.replace( rantiCache, "$1" );
    				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
    					uncached;
    			}

    			// Put hash and anti-cache on the URL that will be requested (gh-1732)
    			s.url = cacheURL + uncached;

    		// Change '%20' to '+' if this is encoded form body content (gh-2658)
    		} else if ( s.data && s.processData &&
    			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
    			s.data = s.data.replace( r20, "+" );
    		}

    		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    		if ( s.ifModified ) {
    			if ( jQuery.lastModified[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
    			}
    			if ( jQuery.etag[ cacheURL ] ) {
    				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
    			}
    		}

    		// Set the correct header, if data is being sent
    		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
    			jqXHR.setRequestHeader( "Content-Type", s.contentType );
    		}

    		// Set the Accepts header for the server, depending on the dataType
    		jqXHR.setRequestHeader(
    			"Accept",
    			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
    				s.accepts[ s.dataTypes[ 0 ] ] +
    					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
    				s.accepts[ "*" ]
    		);

    		// Check for headers option
    		for ( i in s.headers ) {
    			jqXHR.setRequestHeader( i, s.headers[ i ] );
    		}

    		// Allow custom headers/mimetypes and early abort
    		if ( s.beforeSend &&
    			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

    			// Abort if not done already and return
    			return jqXHR.abort();
    		}

    		// Aborting is no longer a cancellation
    		strAbort = "abort";

    		// Install callbacks on deferreds
    		completeDeferred.add( s.complete );
    		jqXHR.done( s.success );
    		jqXHR.fail( s.error );

    		// Get transport
    		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

    		// If no transport, we auto-abort
    		if ( !transport ) {
    			done( -1, "No Transport" );
    		} else {
    			jqXHR.readyState = 1;

    			// Send global event
    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
    			}

    			// If request was aborted inside ajaxSend, stop there
    			if ( completed ) {
    				return jqXHR;
    			}

    			// Timeout
    			if ( s.async && s.timeout > 0 ) {
    				timeoutTimer = window.setTimeout( function() {
    					jqXHR.abort( "timeout" );
    				}, s.timeout );
    			}

    			try {
    				completed = false;
    				transport.send( requestHeaders, done );
    			} catch ( e ) {

    				// Rethrow post-completion exceptions
    				if ( completed ) {
    					throw e;
    				}

    				// Propagate others as results
    				done( -1, e );
    			}
    		}

    		// Callback for when everything is done
    		function done( status, nativeStatusText, responses, headers ) {
    			var isSuccess, success, error, response, modified,
    				statusText = nativeStatusText;

    			// Ignore repeat invocations
    			if ( completed ) {
    				return;
    			}

    			completed = true;

    			// Clear timeout if it exists
    			if ( timeoutTimer ) {
    				window.clearTimeout( timeoutTimer );
    			}

    			// Dereference transport for early garbage collection
    			// (no matter how long the jqXHR object will be used)
    			transport = undefined;

    			// Cache response headers
    			responseHeadersString = headers || "";

    			// Set readyState
    			jqXHR.readyState = status > 0 ? 4 : 0;

    			// Determine if successful
    			isSuccess = status >= 200 && status < 300 || status === 304;

    			// Get response data
    			if ( responses ) {
    				response = ajaxHandleResponses( s, jqXHR, responses );
    			}

    			// Use a noop converter for missing script
    			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
    				s.converters[ "text script" ] = function() {};
    			}

    			// Convert no matter what (that way responseXXX fields are always set)
    			response = ajaxConvert( s, response, jqXHR, isSuccess );

    			// If successful, handle type chaining
    			if ( isSuccess ) {

    				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
    				if ( s.ifModified ) {
    					modified = jqXHR.getResponseHeader( "Last-Modified" );
    					if ( modified ) {
    						jQuery.lastModified[ cacheURL ] = modified;
    					}
    					modified = jqXHR.getResponseHeader( "etag" );
    					if ( modified ) {
    						jQuery.etag[ cacheURL ] = modified;
    					}
    				}

    				// if no content
    				if ( status === 204 || s.type === "HEAD" ) {
    					statusText = "nocontent";

    				// if not modified
    				} else if ( status === 304 ) {
    					statusText = "notmodified";

    				// If we have data, let's convert it
    				} else {
    					statusText = response.state;
    					success = response.data;
    					error = response.error;
    					isSuccess = !error;
    				}
    			} else {

    				// Extract error from statusText and normalize for non-aborts
    				error = statusText;
    				if ( status || !statusText ) {
    					statusText = "error";
    					if ( status < 0 ) {
    						status = 0;
    					}
    				}
    			}

    			// Set data for the fake xhr object
    			jqXHR.status = status;
    			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

    			// Success/Error
    			if ( isSuccess ) {
    				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
    			} else {
    				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
    			}

    			// Status-dependent callbacks
    			jqXHR.statusCode( statusCode );
    			statusCode = undefined;

    			if ( fireGlobals ) {
    				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
    					[ jqXHR, s, isSuccess ? success : error ] );
    			}

    			// Complete
    			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

    			if ( fireGlobals ) {
    				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

    				// Handle the global AJAX counter
    				if ( !( --jQuery.active ) ) {
    					jQuery.event.trigger( "ajaxStop" );
    				}
    			}
    		}

    		return jqXHR;
    	},

    	getJSON: function( url, data, callback ) {
    		return jQuery.get( url, data, callback, "json" );
    	},

    	getScript: function( url, callback ) {
    		return jQuery.get( url, undefined, callback, "script" );
    	}
    } );

    jQuery.each( [ "get", "post" ], function( _i, method ) {
    	jQuery[ method ] = function( url, data, callback, type ) {

    		// Shift arguments if data argument was omitted
    		if ( isFunction( data ) ) {
    			type = type || callback;
    			callback = data;
    			data = undefined;
    		}

    		// The url can be an options object (which then must have .url)
    		return jQuery.ajax( jQuery.extend( {
    			url: url,
    			type: method,
    			dataType: type,
    			data: data,
    			success: callback
    		}, jQuery.isPlainObject( url ) && url ) );
    	};
    } );

    jQuery.ajaxPrefilter( function( s ) {
    	var i;
    	for ( i in s.headers ) {
    		if ( i.toLowerCase() === "content-type" ) {
    			s.contentType = s.headers[ i ] || "";
    		}
    	}
    } );


    jQuery._evalUrl = function( url, options, doc ) {
    	return jQuery.ajax( {
    		url: url,

    		// Make this explicit, since user can override this through ajaxSetup (#11264)
    		type: "GET",
    		dataType: "script",
    		cache: true,
    		async: false,
    		global: false,

    		// Only evaluate the response if it is successful (gh-4126)
    		// dataFilter is not invoked for failure responses, so using it instead
    		// of the default converter is kludgy but it works.
    		converters: {
    			"text script": function() {}
    		},
    		dataFilter: function( response ) {
    			jQuery.globalEval( response, options, doc );
    		}
    	} );
    };


    jQuery.fn.extend( {
    	wrapAll: function( html ) {
    		var wrap;

    		if ( this[ 0 ] ) {
    			if ( isFunction( html ) ) {
    				html = html.call( this[ 0 ] );
    			}

    			// The elements to wrap the target around
    			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

    			if ( this[ 0 ].parentNode ) {
    				wrap.insertBefore( this[ 0 ] );
    			}

    			wrap.map( function() {
    				var elem = this;

    				while ( elem.firstElementChild ) {
    					elem = elem.firstElementChild;
    				}

    				return elem;
    			} ).append( this );
    		}

    		return this;
    	},

    	wrapInner: function( html ) {
    		if ( isFunction( html ) ) {
    			return this.each( function( i ) {
    				jQuery( this ).wrapInner( html.call( this, i ) );
    			} );
    		}

    		return this.each( function() {
    			var self = jQuery( this ),
    				contents = self.contents();

    			if ( contents.length ) {
    				contents.wrapAll( html );

    			} else {
    				self.append( html );
    			}
    		} );
    	},

    	wrap: function( html ) {
    		var htmlIsFunction = isFunction( html );

    		return this.each( function( i ) {
    			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
    		} );
    	},

    	unwrap: function( selector ) {
    		this.parent( selector ).not( "body" ).each( function() {
    			jQuery( this ).replaceWith( this.childNodes );
    		} );
    		return this;
    	}
    } );


    jQuery.expr.pseudos.hidden = function( elem ) {
    	return !jQuery.expr.pseudos.visible( elem );
    };
    jQuery.expr.pseudos.visible = function( elem ) {
    	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
    };




    jQuery.ajaxSettings.xhr = function() {
    	try {
    		return new window.XMLHttpRequest();
    	} catch ( e ) {}
    };

    var xhrSuccessStatus = {

    		// File protocol always yields status code 0, assume 200
    		0: 200,

    		// Support: IE <=9 only
    		// #1450: sometimes IE returns 1223 when it should be 204
    		1223: 204
    	},
    	xhrSupported = jQuery.ajaxSettings.xhr();

    support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
    support.ajax = xhrSupported = !!xhrSupported;

    jQuery.ajaxTransport( function( options ) {
    	var callback, errorCallback;

    	// Cross domain only allowed if supported through XMLHttpRequest
    	if ( support.cors || xhrSupported && !options.crossDomain ) {
    		return {
    			send: function( headers, complete ) {
    				var i,
    					xhr = options.xhr();

    				xhr.open(
    					options.type,
    					options.url,
    					options.async,
    					options.username,
    					options.password
    				);

    				// Apply custom fields if provided
    				if ( options.xhrFields ) {
    					for ( i in options.xhrFields ) {
    						xhr[ i ] = options.xhrFields[ i ];
    					}
    				}

    				// Override mime type if needed
    				if ( options.mimeType && xhr.overrideMimeType ) {
    					xhr.overrideMimeType( options.mimeType );
    				}

    				// X-Requested-With header
    				// For cross-domain requests, seeing as conditions for a preflight are
    				// akin to a jigsaw puzzle, we simply never set it to be sure.
    				// (it can always be set on a per-request basis or even using ajaxSetup)
    				// For same-domain requests, won't change header if already provided.
    				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
    					headers[ "X-Requested-With" ] = "XMLHttpRequest";
    				}

    				// Set headers
    				for ( i in headers ) {
    					xhr.setRequestHeader( i, headers[ i ] );
    				}

    				// Callback
    				callback = function( type ) {
    					return function() {
    						if ( callback ) {
    							callback = errorCallback = xhr.onload =
    								xhr.onerror = xhr.onabort = xhr.ontimeout =
    									xhr.onreadystatechange = null;

    							if ( type === "abort" ) {
    								xhr.abort();
    							} else if ( type === "error" ) {

    								// Support: IE <=9 only
    								// On a manual native abort, IE9 throws
    								// errors on any property access that is not readyState
    								if ( typeof xhr.status !== "number" ) {
    									complete( 0, "error" );
    								} else {
    									complete(

    										// File: protocol always yields status 0; see #8605, #14207
    										xhr.status,
    										xhr.statusText
    									);
    								}
    							} else {
    								complete(
    									xhrSuccessStatus[ xhr.status ] || xhr.status,
    									xhr.statusText,

    									// Support: IE <=9 only
    									// IE9 has no XHR2 but throws on binary (trac-11426)
    									// For XHR2 non-text, let the caller handle it (gh-2498)
    									( xhr.responseType || "text" ) !== "text"  ||
    									typeof xhr.responseText !== "string" ?
    										{ binary: xhr.response } :
    										{ text: xhr.responseText },
    									xhr.getAllResponseHeaders()
    								);
    							}
    						}
    					};
    				};

    				// Listen to events
    				xhr.onload = callback();
    				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

    				// Support: IE 9 only
    				// Use onreadystatechange to replace onabort
    				// to handle uncaught aborts
    				if ( xhr.onabort !== undefined ) {
    					xhr.onabort = errorCallback;
    				} else {
    					xhr.onreadystatechange = function() {

    						// Check readyState before timeout as it changes
    						if ( xhr.readyState === 4 ) {

    							// Allow onerror to be called first,
    							// but that will not handle a native abort
    							// Also, save errorCallback to a variable
    							// as xhr.onerror cannot be accessed
    							window.setTimeout( function() {
    								if ( callback ) {
    									errorCallback();
    								}
    							} );
    						}
    					};
    				}

    				// Create the abort callback
    				callback = callback( "abort" );

    				try {

    					// Do send the request (this may raise an exception)
    					xhr.send( options.hasContent && options.data || null );
    				} catch ( e ) {

    					// #14683: Only rethrow if this hasn't been notified as an error yet
    					if ( callback ) {
    						throw e;
    					}
    				}
    			},

    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );




    // Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
    jQuery.ajaxPrefilter( function( s ) {
    	if ( s.crossDomain ) {
    		s.contents.script = false;
    	}
    } );

    // Install script dataType
    jQuery.ajaxSetup( {
    	accepts: {
    		script: "text/javascript, application/javascript, " +
    			"application/ecmascript, application/x-ecmascript"
    	},
    	contents: {
    		script: /\b(?:java|ecma)script\b/
    	},
    	converters: {
    		"text script": function( text ) {
    			jQuery.globalEval( text );
    			return text;
    		}
    	}
    } );

    // Handle cache's special case and crossDomain
    jQuery.ajaxPrefilter( "script", function( s ) {
    	if ( s.cache === undefined ) {
    		s.cache = false;
    	}
    	if ( s.crossDomain ) {
    		s.type = "GET";
    	}
    } );

    // Bind script tag hack transport
    jQuery.ajaxTransport( "script", function( s ) {

    	// This transport only deals with cross domain or forced-by-attrs requests
    	if ( s.crossDomain || s.scriptAttrs ) {
    		var script, callback;
    		return {
    			send: function( _, complete ) {
    				script = jQuery( "<script>" )
    					.attr( s.scriptAttrs || {} )
    					.prop( { charset: s.scriptCharset, src: s.url } )
    					.on( "load error", callback = function( evt ) {
    						script.remove();
    						callback = null;
    						if ( evt ) {
    							complete( evt.type === "error" ? 404 : 200, evt.type );
    						}
    					} );

    				// Use native DOM manipulation to avoid our domManip AJAX trickery
    				document.head.appendChild( script[ 0 ] );
    			},
    			abort: function() {
    				if ( callback ) {
    					callback();
    				}
    			}
    		};
    	}
    } );




    var oldCallbacks = [],
    	rjsonp = /(=)\?(?=&|$)|\?\?/;

    // Default jsonp settings
    jQuery.ajaxSetup( {
    	jsonp: "callback",
    	jsonpCallback: function() {
    		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
    		this[ callback ] = true;
    		return callback;
    	}
    } );

    // Detect, normalize options and install callbacks for jsonp requests
    jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

    	var callbackName, overwritten, responseContainer,
    		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
    			"url" :
    			typeof s.data === "string" &&
    				( s.contentType || "" )
    					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
    				rjsonp.test( s.data ) && "data"
    		);

    	// Handle iff the expected data type is "jsonp" or we have a parameter to set
    	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

    		// Get callback name, remembering preexisting value associated with it
    		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
    			s.jsonpCallback() :
    			s.jsonpCallback;

    		// Insert callback into url or form data
    		if ( jsonProp ) {
    			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
    		} else if ( s.jsonp !== false ) {
    			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
    		}

    		// Use data converter to retrieve json after script execution
    		s.converters[ "script json" ] = function() {
    			if ( !responseContainer ) {
    				jQuery.error( callbackName + " was not called" );
    			}
    			return responseContainer[ 0 ];
    		};

    		// Force json dataType
    		s.dataTypes[ 0 ] = "json";

    		// Install callback
    		overwritten = window[ callbackName ];
    		window[ callbackName ] = function() {
    			responseContainer = arguments;
    		};

    		// Clean-up function (fires after converters)
    		jqXHR.always( function() {

    			// If previous value didn't exist - remove it
    			if ( overwritten === undefined ) {
    				jQuery( window ).removeProp( callbackName );

    			// Otherwise restore preexisting value
    			} else {
    				window[ callbackName ] = overwritten;
    			}

    			// Save back as free
    			if ( s[ callbackName ] ) {

    				// Make sure that re-using the options doesn't screw things around
    				s.jsonpCallback = originalSettings.jsonpCallback;

    				// Save the callback name for future use
    				oldCallbacks.push( callbackName );
    			}

    			// Call if it was a function and we have a response
    			if ( responseContainer && isFunction( overwritten ) ) {
    				overwritten( responseContainer[ 0 ] );
    			}

    			responseContainer = overwritten = undefined;
    		} );

    		// Delegate to script
    		return "script";
    	}
    } );




    // Support: Safari 8 only
    // In Safari 8 documents created via document.implementation.createHTMLDocument
    // collapse sibling forms: the second one becomes a child of the first one.
    // Because of that, this security measure has to be disabled in Safari 8.
    // https://bugs.webkit.org/show_bug.cgi?id=137337
    support.createHTMLDocument = ( function() {
    	var body = document.implementation.createHTMLDocument( "" ).body;
    	body.innerHTML = "<form></form><form></form>";
    	return body.childNodes.length === 2;
    } )();


    // Argument "data" should be string of html
    // context (optional): If specified, the fragment will be created in this context,
    // defaults to document
    // keepScripts (optional): If true, will include scripts passed in the html string
    jQuery.parseHTML = function( data, context, keepScripts ) {
    	if ( typeof data !== "string" ) {
    		return [];
    	}
    	if ( typeof context === "boolean" ) {
    		keepScripts = context;
    		context = false;
    	}

    	var base, parsed, scripts;

    	if ( !context ) {

    		// Stop scripts or inline event handlers from being executed immediately
    		// by using document.implementation
    		if ( support.createHTMLDocument ) {
    			context = document.implementation.createHTMLDocument( "" );

    			// Set the base href for the created document
    			// so any parsed elements with URLs
    			// are based on the document's URL (gh-2965)
    			base = context.createElement( "base" );
    			base.href = document.location.href;
    			context.head.appendChild( base );
    		} else {
    			context = document;
    		}
    	}

    	parsed = rsingleTag.exec( data );
    	scripts = !keepScripts && [];

    	// Single tag
    	if ( parsed ) {
    		return [ context.createElement( parsed[ 1 ] ) ];
    	}

    	parsed = buildFragment( [ data ], context, scripts );

    	if ( scripts && scripts.length ) {
    		jQuery( scripts ).remove();
    	}

    	return jQuery.merge( [], parsed.childNodes );
    };


    /**
     * Load a url into a page
     */
    jQuery.fn.load = function( url, params, callback ) {
    	var selector, type, response,
    		self = this,
    		off = url.indexOf( " " );

    	if ( off > -1 ) {
    		selector = stripAndCollapse( url.slice( off ) );
    		url = url.slice( 0, off );
    	}

    	// If it's a function
    	if ( isFunction( params ) ) {

    		// We assume that it's the callback
    		callback = params;
    		params = undefined;

    	// Otherwise, build a param string
    	} else if ( params && typeof params === "object" ) {
    		type = "POST";
    	}

    	// If we have elements to modify, make the request
    	if ( self.length > 0 ) {
    		jQuery.ajax( {
    			url: url,

    			// If "type" variable is undefined, then "GET" method will be used.
    			// Make value of this field explicit since
    			// user can override it through ajaxSetup method
    			type: type || "GET",
    			dataType: "html",
    			data: params
    		} ).done( function( responseText ) {

    			// Save response for use in complete callback
    			response = arguments;

    			self.html( selector ?

    				// If a selector was specified, locate the right elements in a dummy div
    				// Exclude scripts to avoid IE 'Permission Denied' errors
    				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

    				// Otherwise use the full result
    				responseText );

    		// If the request succeeds, this function gets "data", "status", "jqXHR"
    		// but they are ignored because response was set above.
    		// If it fails, this function gets "jqXHR", "status", "error"
    		} ).always( callback && function( jqXHR, status ) {
    			self.each( function() {
    				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
    			} );
    		} );
    	}

    	return this;
    };




    jQuery.expr.pseudos.animated = function( elem ) {
    	return jQuery.grep( jQuery.timers, function( fn ) {
    		return elem === fn.elem;
    	} ).length;
    };




    jQuery.offset = {
    	setOffset: function( elem, options, i ) {
    		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
    			position = jQuery.css( elem, "position" ),
    			curElem = jQuery( elem ),
    			props = {};

    		// Set position first, in-case top/left are set even on static elem
    		if ( position === "static" ) {
    			elem.style.position = "relative";
    		}

    		curOffset = curElem.offset();
    		curCSSTop = jQuery.css( elem, "top" );
    		curCSSLeft = jQuery.css( elem, "left" );
    		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
    			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

    		// Need to be able to calculate position if either
    		// top or left is auto and position is either absolute or fixed
    		if ( calculatePosition ) {
    			curPosition = curElem.position();
    			curTop = curPosition.top;
    			curLeft = curPosition.left;

    		} else {
    			curTop = parseFloat( curCSSTop ) || 0;
    			curLeft = parseFloat( curCSSLeft ) || 0;
    		}

    		if ( isFunction( options ) ) {

    			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
    			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
    		}

    		if ( options.top != null ) {
    			props.top = ( options.top - curOffset.top ) + curTop;
    		}
    		if ( options.left != null ) {
    			props.left = ( options.left - curOffset.left ) + curLeft;
    		}

    		if ( "using" in options ) {
    			options.using.call( elem, props );

    		} else {
    			if ( typeof props.top === "number" ) {
    				props.top += "px";
    			}
    			if ( typeof props.left === "number" ) {
    				props.left += "px";
    			}
    			curElem.css( props );
    		}
    	}
    };

    jQuery.fn.extend( {

    	// offset() relates an element's border box to the document origin
    	offset: function( options ) {

    		// Preserve chaining for setter
    		if ( arguments.length ) {
    			return options === undefined ?
    				this :
    				this.each( function( i ) {
    					jQuery.offset.setOffset( this, options, i );
    				} );
    		}

    		var rect, win,
    			elem = this[ 0 ];

    		if ( !elem ) {
    			return;
    		}

    		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    		// Support: IE <=11 only
    		// Running getBoundingClientRect on a
    		// disconnected node in IE throws an error
    		if ( !elem.getClientRects().length ) {
    			return { top: 0, left: 0 };
    		}

    		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
    		rect = elem.getBoundingClientRect();
    		win = elem.ownerDocument.defaultView;
    		return {
    			top: rect.top + win.pageYOffset,
    			left: rect.left + win.pageXOffset
    		};
    	},

    	// position() relates an element's margin box to its offset parent's padding box
    	// This corresponds to the behavior of CSS absolute positioning
    	position: function() {
    		if ( !this[ 0 ] ) {
    			return;
    		}

    		var offsetParent, offset, doc,
    			elem = this[ 0 ],
    			parentOffset = { top: 0, left: 0 };

    		// position:fixed elements are offset from the viewport, which itself always has zero offset
    		if ( jQuery.css( elem, "position" ) === "fixed" ) {

    			// Assume position:fixed implies availability of getBoundingClientRect
    			offset = elem.getBoundingClientRect();

    		} else {
    			offset = this.offset();

    			// Account for the *real* offset parent, which can be the document or its root element
    			// when a statically positioned element is identified
    			doc = elem.ownerDocument;
    			offsetParent = elem.offsetParent || doc.documentElement;
    			while ( offsetParent &&
    				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
    				jQuery.css( offsetParent, "position" ) === "static" ) {

    				offsetParent = offsetParent.parentNode;
    			}
    			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

    				// Incorporate borders into its offset, since they are outside its content origin
    				parentOffset = jQuery( offsetParent ).offset();
    				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
    				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
    			}
    		}

    		// Subtract parent offsets and element margins
    		return {
    			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
    			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
    		};
    	},

    	// This method will return documentElement in the following cases:
    	// 1) For the element inside the iframe without offsetParent, this method will return
    	//    documentElement of the parent window
    	// 2) For the hidden or detached element
    	// 3) For body or html element, i.e. in case of the html node - it will return itself
    	//
    	// but those exceptions were never presented as a real life use-cases
    	// and might be considered as more preferable results.
    	//
    	// This logic, however, is not guaranteed and can change at any point in the future
    	offsetParent: function() {
    		return this.map( function() {
    			var offsetParent = this.offsetParent;

    			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
    				offsetParent = offsetParent.offsetParent;
    			}

    			return offsetParent || documentElement;
    		} );
    	}
    } );

    // Create scrollLeft and scrollTop methods
    jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
    	var top = "pageYOffset" === prop;

    	jQuery.fn[ method ] = function( val ) {
    		return access( this, function( elem, method, val ) {

    			// Coalesce documents and windows
    			var win;
    			if ( isWindow( elem ) ) {
    				win = elem;
    			} else if ( elem.nodeType === 9 ) {
    				win = elem.defaultView;
    			}

    			if ( val === undefined ) {
    				return win ? win[ prop ] : elem[ method ];
    			}

    			if ( win ) {
    				win.scrollTo(
    					!top ? val : win.pageXOffset,
    					top ? val : win.pageYOffset
    				);

    			} else {
    				elem[ method ] = val;
    			}
    		}, method, val, arguments.length );
    	};
    } );

    // Support: Safari <=7 - 9.1, Chrome <=37 - 49
    // Add the top/left cssHooks using jQuery.fn.position
    // Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
    // Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
    // getComputedStyle returns percent when specified for top/left/bottom/right;
    // rather than make the css module depend on the offset module, just check for it here
    jQuery.each( [ "top", "left" ], function( _i, prop ) {
    	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
    		function( elem, computed ) {
    			if ( computed ) {
    				computed = curCSS( elem, prop );

    				// If curCSS returns percentage, fallback to offset
    				return rnumnonpx.test( computed ) ?
    					jQuery( elem ).position()[ prop ] + "px" :
    					computed;
    			}
    		}
    	);
    } );


    // Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
    jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
    	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
    		function( defaultExtra, funcName ) {

    		// Margin is only for outerHeight, outerWidth
    		jQuery.fn[ funcName ] = function( margin, value ) {
    			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
    				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

    			return access( this, function( elem, type, value ) {
    				var doc;

    				if ( isWindow( elem ) ) {

    					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
    					return funcName.indexOf( "outer" ) === 0 ?
    						elem[ "inner" + name ] :
    						elem.document.documentElement[ "client" + name ];
    				}

    				// Get document width or height
    				if ( elem.nodeType === 9 ) {
    					doc = elem.documentElement;

    					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
    					// whichever is greatest
    					return Math.max(
    						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
    						elem.body[ "offset" + name ], doc[ "offset" + name ],
    						doc[ "client" + name ]
    					);
    				}

    				return value === undefined ?

    					// Get width or height on the element, requesting but not forcing parseFloat
    					jQuery.css( elem, type, extra ) :

    					// Set width or height on the element
    					jQuery.style( elem, type, value, extra );
    			}, type, chainable ? margin : undefined, chainable );
    		};
    	} );
    } );


    jQuery.each( [
    	"ajaxStart",
    	"ajaxStop",
    	"ajaxComplete",
    	"ajaxError",
    	"ajaxSuccess",
    	"ajaxSend"
    ], function( _i, type ) {
    	jQuery.fn[ type ] = function( fn ) {
    		return this.on( type, fn );
    	};
    } );




    jQuery.fn.extend( {

    	bind: function( types, data, fn ) {
    		return this.on( types, null, data, fn );
    	},
    	unbind: function( types, fn ) {
    		return this.off( types, null, fn );
    	},

    	delegate: function( selector, types, data, fn ) {
    		return this.on( types, selector, data, fn );
    	},
    	undelegate: function( selector, types, fn ) {

    		// ( namespace ) or ( selector, types [, fn] )
    		return arguments.length === 1 ?
    			this.off( selector, "**" ) :
    			this.off( types, selector || "**", fn );
    	},

    	hover: function( fnOver, fnOut ) {
    		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
    	}
    } );

    jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
    	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
    	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
    	function( _i, name ) {

    		// Handle event binding
    		jQuery.fn[ name ] = function( data, fn ) {
    			return arguments.length > 0 ?
    				this.on( name, null, data, fn ) :
    				this.trigger( name );
    		};
    	} );




    // Support: Android <=4.0 only
    // Make sure we trim BOM and NBSP
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

    // Bind a function to a context, optionally partially applying any
    // arguments.
    // jQuery.proxy is deprecated to promote standards (specifically Function#bind)
    // However, it is not slated for removal any time soon
    jQuery.proxy = function( fn, context ) {
    	var tmp, args, proxy;

    	if ( typeof context === "string" ) {
    		tmp = fn[ context ];
    		context = fn;
    		fn = tmp;
    	}

    	// Quick check to determine if target is callable, in the spec
    	// this throws a TypeError, but we will just return undefined.
    	if ( !isFunction( fn ) ) {
    		return undefined;
    	}

    	// Simulated bind
    	args = slice.call( arguments, 2 );
    	proxy = function() {
    		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
    	};

    	// Set the guid of unique handler to the same of original handler, so it can be removed
    	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

    	return proxy;
    };

    jQuery.holdReady = function( hold ) {
    	if ( hold ) {
    		jQuery.readyWait++;
    	} else {
    		jQuery.ready( true );
    	}
    };
    jQuery.isArray = Array.isArray;
    jQuery.parseJSON = JSON.parse;
    jQuery.nodeName = nodeName;
    jQuery.isFunction = isFunction;
    jQuery.isWindow = isWindow;
    jQuery.camelCase = camelCase;
    jQuery.type = toType;

    jQuery.now = Date.now;

    jQuery.isNumeric = function( obj ) {

    	// As of jQuery 3.0, isNumeric is limited to
    	// strings and numbers (primitives or objects)
    	// that can be coerced to finite numbers (gh-2662)
    	var type = jQuery.type( obj );
    	return ( type === "number" || type === "string" ) &&

    		// parseFloat NaNs numeric-cast false positives ("")
    		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
    		// subtraction forces infinities to NaN
    		!isNaN( obj - parseFloat( obj ) );
    };

    jQuery.trim = function( text ) {
    	return text == null ?
    		"" :
    		( text + "" ).replace( rtrim, "" );
    };




    var

    	// Map over jQuery in case of overwrite
    	_jQuery = window.jQuery,

    	// Map over the $ in case of overwrite
    	_$ = window.$;

    jQuery.noConflict = function( deep ) {
    	if ( window.$ === jQuery ) {
    		window.$ = _$;
    	}

    	if ( deep && window.jQuery === jQuery ) {
    		window.jQuery = _jQuery;
    	}

    	return jQuery;
    };

    // Expose jQuery and $ identifiers, even in AMD
    // (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
    // and CommonJS for browser emulators (#13566)
    if ( typeof noGlobal === "undefined" ) {
    	window.jQuery = window.$ = jQuery;
    }




    return jQuery;
    } );
    });

    /* eslint-disable no-control-regex */

    //@TODO:? @abhishek what this function do
    RegExp.quote = function (str) {
    	return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    };

    function formatXml(xml, cdata_format) {
        let cdata = cdata_format || false;
        let reg = /(>)(<)(\/*)/g;
        let wsexp = / *(.*) +\n/g;
        let contexp = /(<.+>)(.+\n)/g;
        if (cdata) {
            var old_cdata = xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim);
        }
        xml = xml.replace(/\t/g, '');
        xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
        if (cdata) {
            var new_cdata = xml.match(/<!--\[CDATA\[[\s\S]*?\]\]-->/gim);
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
            var ln = lines[i];
            if (ln != '') {
                var single = Boolean(ln.match(/<.+\/>/)); // is this line a single tag? ex. <br />
                var closing = Boolean(ln.match(/<\/.+>/)); // is this a closing tag? ex. </a>
                var opening = Boolean(ln.match(/<[^!].*>/)); // is this even a tag (that's not <!something>)
                var type = single ? 'single' : closing ? 'closing' : opening ? 'opening' : 'other';
                var fromTo = lastType + '->' + type;
                lastType = type;
                var padding = '';

                indent += transitions[fromTo];
                for (var j = 0; j < indent; j++) {
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

    let J = {};
    class treeviewHelper {
        constructor(options) {
            this.tempVar = 'u';
            this.userAnsXML = "";
            this.context_options = false;
            this.ajax_eId = "#treemain0";
            this.initSMANS = "";
            this.labBinded = true;
            this.lcrt = "";
            this.lall = "";
            J = jquery;
            jsTree(J);
        }

            // Called after selecting the option in contextmenu
        contextAction(obj) {
            let treeid = "#" + obj.reference.closest('[id^="treemain"]').attr("id");
            this.lcrt = J(treeid).find('.treeall');
            // id of draggable element on which contextmenu event fired 
            let id = obj.reference.parentNode.getAttribute('id');
            // find available tree structure on Droppable area 
            let tree = this.lcrt.jstree(true)._model.data;
            // Assigned cseq in tree structure received after selecting the contextmenu dialog option    
            tree[id].li_attr.cseq = obj.item.seq;
            // set the attribute cseq of draggable element on which contextmenu event fired  
            obj.reference.parentNode.setAttribute('cseq', obj.item.seq);
            // set the icon for draggable element on which contextmenu event fired according to selected value from contextmenu bar
            this.lcrt.jstree(true).set_icon(id, obj.item.icon);
            // Calls for check the answer
            this.checkAns(treeid, this.lcrt);
        };

        // Remove the draggable element from droppable conatiner to draggable container
        deleteList(obj) {
            let treeid = "#" + obj.reference.closest('[id^="treemain"]').getAttribute("id");
            /* Container element where elements are dropped after drag */
            this.lcrt = J(treeid).find('.treeall');
            /* Container element of draggable element from where element is dragged for perform the operation */
            this.lall = J(treeid).find('.treecorrect');
            /* Id of draggable element on which contextmenu event fired */
            let id = obj.reference.parentNode.getAttribute('id');
            // Cut the draggable element on which contextmenu event fired from droppable area    
            this.lcrt.jstree(true).cut(id);
            // Paste the draggable element on which contextmenu event fired on draggable area
            this.lall.jstree(true).paste('#');
            // Delete the draggable element on which contextmenu event fired from droppable area
            this.lcrt.jstree(true).delete_node(id);
        };

        // Used to copy the draggable element
        copyNode(obj, delandpaste) {
            let treeCorrect = J(treeid).find('.treecorrect');
            obj.currentTarget;
            // Copy the current target element according to their id on Draggable area
            treeCorrect.jstree(true).copy(obj.currentTarget.id);
            // Calls delandpaste() according to the value of variable delandpaste
            delandpaste && delandpaste();
        }

        // Used to pase the Draggable element on Droppable area
        pasteNode(obj, fun, handleDeleteCallback) {
            let treeId = "#treemain0";
            let treeAll = J(treeId).find('.treeall'); 
            // Paste the current target element according to their id on Droppable area
            treeAll.jstree(true).paste(obj.currentTarget.id);
            // Calls fun() according to the value of variable fun
            fun && fun();
            // Calls handleDeleteCallback() according to the value of variable handleDeleteCallback
            handleDeleteCallback && handleDeleteCallback();
        }

        // /used to handle the element when it is deleted on droppable area
        handleDelete(obj, deleteCallBack, pasteCallback) {
            let treeId = "#treemain0";
            let treeAll = J(treeId).find('.treeall');
            let id = obj.currentTarget;
            try {
                // used for paste the element back to draggable area
                treeAll.jstree(true).cut(id);
                // used for delete the element from droppable area
                treeAll.jstree(true).delete_node(id);
            } catch (Exception) {
                console.log("Error" + Exception);
            }
            // Calls deleteCallBack() method according to the value of deleteCallBack variable
            deleteCallBack && deleteCallBack();
            // Calls pasteCallback() method according to the value of pasteCallback variable
            pasteCallback && pasteCallback();
        }

        // Initialize the tree
        treeInit(treeid, contextmenu) {
            contextmenu = contextmenu || false;
            // configaration for droppable area
            let jOptions = {
                "core": {
                    // Allow the operations create, rename, delete, move or copy 
                    "check_callback": true
                },
                "checkbox": {
                    // a boolean indicating if checkboxes should cascade down and have an undetermined state. Defaults to true 
                    "three_state": false
                },
                "plugins": ["checkbox"]
            };
            if (contextmenu) {
                // Assign the contextmenu options to this.context_options
                this.context_options = contextmenu;
            }
            this.lcrt = J(treeid).find('.treeall');
            this.lall = J(treeid).find('.treecorrect');
            // Applied configaration on Droppable container to access the operations
            this.lcrt.jstree(jOptions);
            this.lcrt.on("move_node.jstree", (event, data)=> {
                let _jst = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                if (_jst.get_selected().length > 0) {
                    // deselect the node if it is selected
                    _jst.deselect_node(J(treeid),find('#' + data.old_parent));
                }
            }).on("copy_node.jstree", (event, data)=> {
                let _jst = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                _jst.open_node(J(treeid).find('#' + data.parent));
            }).on("delete_node.jstree", (event, data)=> {
                let _jst = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                // deselect the node if it is selected
                _jst.deselect_node(J(treeid).find('#' + data.parent));
            }).on("changed.jstree", (event, data)=> {
                let _jst = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                if (typeof (data.parent) == "undefined" && data.node.li_attr.tid.length < 3) {
                    // deselect the node if it is selected
                    _jst.deselect_node(J(treeid).find('#' + data.node.id));
                } else {
                    // deselect the parent node if it is selected
                    _jst.deselect_node(J(treeid).find('#' + data.parent));
                }
            }).on("open_node.jstree", ()=> {
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
            });
            // configaration for draggable area
            this.lall.jstree({
                "core": {
                    // Allow the operations create, rename, delete, move or copy if it is true otherwise these operations will be prevented 
                    "check_callback": (callback, node)=> {
                        if (callback == "copy_node" && this.isTidExists(node.li_attr.tid, this.lall)) {
                            return false;
                        }
                        if (callback == "delete_node" && node.li_attr.multi == "1") {
                            return false;
                        }
                        return true;
                    }
                },
                "plugins": ["wholerow"]
            });
            // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
            this.removePchecbox(treeid);
            // calls the showans method
            this.showans(treeid, 'u');
        }

        // used to initialized tree plugin and bind some required events that needed
        readyThis(treeid, contextmenu) {
            contextmenu = contextmenu || false;
            this.lcrt = J(treeid).find('.treeall');
            this.lall = J(treeid).find('.treecorrect');
            let jOptions = {
                "core": {
                    // Allow the operations create, rename, delete, move or copy if it is true otherwise these operations will be prevented 
                    check_callback: (op, node, parent)=> {
                        if (parent.li_attr) {
                            if (parent.li_attr.correctans) {
                                return true
                            } else {
                                if (window.inNative) window.postMessage('hint___Not an editable zone');
                                return false;
                            }
                        }
                    }
                },
                "checkbox": {
                    // a boolean indicating if checkboxes should cascade down and have an undetermined state. Defaults to true 
                    "three_state": false
                },
                // Defines all the active types in the tree 
                "types": {
                    "#": {
                        // disable max_depth checking in the tree 
                        "max_depth": 2,
                        // A string or array. Defines valid root node types (could be "all" , "none" , or an array of type strings) 
                        "valid_children": ["item"]
                    }
                },
                // The dnd plugin enables drag'n'drop support for jstree, also using foreign nodes and drop targets. 
                "dnd": {
                    // The number of milliseconds to wait before checking if a move is valid upon hovering a node 
                    "open_timeout": 1,
                    // prevent from being drag
                    "is_draggable": ()=> {
                        return false; //data.li_attr.tid.length > 2
                    }
                },
                "plugins": [typeof inNative != "undefined" ? "" : "dnd", typeof inNative != "undefined" ? "" : "checkbox", "types"]
            };
            // If contextmenu option exists then enter in this block
            if (contextmenu) {
                // assign contextmenu data into variable this.context_options
                this.context_options = contextmenu;
                jOptions['contextmenu'] = {
                    // a boolean indicating if the node should be selected when the context menu is invoked on it 
                    "select_node": false,
                    // a boolean indicating if the menu should be shown aligned with the node. Defaults to true, otherwise the mouse coordinates are used  
                    "show_at_node": false,
                    // an object of actions, or a function that accepts a node and a callback function and calls the callback function with an object of actions available for that node 
                    "items": (node)=> {
                        return node.li_attr.tid.length > 2 ? contextmenu : {};
                    }
                };
                // Adds contextmenu plugin in available plugin options
                jOptions['plugins'].push('contextmenu');
            }

            // Applied the configaration to Droppabe area's elements
            this.lcrt.jstree(jOptions);
            // 'move_node.jstree' event is called only at the end of Drag & Drop (equivalent to Drop event). 
            this.lcrt.on("move_node.jstree", (event, data)=> {
                var jstValue = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                // opens a node, revealing its children. If the node is not loaded it will be loaded and opened once ready 
                jstValue.open_node(J(treeid).find('#' + data.parent));
                if (jstValue.get_selected().length > 0) {
                    // deselect the node if it is selected
                    jstValue.deselect_node(J(treeid).find('#' + data.old_parent));
                }
                this.checkAns(treeid, this.lcrt);
                var timer1 = setTimeout(()=> {
                    // Click the element having id delNodes
                    document.querySelector("#delNodes").click();
                    clearTimeout(timer1);
                }, 100);
                // 'copy_node.jstree' event triggered when a node is copied 
            }).on("copy_node.jstree", (event, data)=> {
                var jstValue = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                // opens a node, revealing its children. If the node is not loaded it will be loaded and opened once ready 
                jstValue.open_node(J(treeid).find('#' + data.parent));
                // called for check the answer 
                this.checkAns(treeid, this.lcrt);
                var timer2 = setTimeout(()=> {
                    // Click the element having id delNodes
                    document.querySelector("#delNodes").click();
                    clearTimeout(timer2);
                }, 100);
                // 'delete_node.jstree' event triggered when a node is deleted 
            }).on("delete_node.jstree", (event, data)=> {
                var jstValue = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                // deselect the node if it is selected
                jstValue.deselect_node(J(treeid).find('#' + data.parent));
                // called for check the answer
                this.checkAns(treeid, this.lcrt);
                var timer3 = setTimeout(()=> {
                    // Click the element having id delNodes
                    document.querySelector("#delNodes").click();
                    clearTimeout(timer3);
                }, 100);
                // 'changed.jstree' event triggered when selection changes 
            }).on("changed.jstree", (event, data)=> {
                var jstValue = this.lcrt.jstree(true);
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
                if (typeof (data.parent) == "undefined" && data.node.li_attr.tid.length < 3) {
                    // deselect the node if it is selected
                    jstValue.deselect_node(J(treeid).find('#' + data.node.id));
                } else {
                    // deselect the node if it is selected
                    jstValue.deselect_node(J(treeid).find('#' + data.parent));
                }
                // Calls for checking the answer
                this.checkAns(treeid, this.lcrt);
                // 'open_node.jstree' event triggered when a node is opened (if there is an animation it will not be completed yet) 
            }).on("open_node.jstree", ()=> {
                // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
                this.removePchecbox(treeid);
            });
            // Applied the configaration to Draggabe area's elements
            this.lall.jstree({
                "core": {
                    // Allow the operations create, rename, delete, move or copy if it is true otherwise these operations will be prevented 
                    "check_callback": (callback, node)=> {
                        if (callback == "copy_node" && this.isTidExists(node.li_attr.tid, this.lall)) {
                            //what they are trying to do
                            return false;
                        }
                        if (callback == "delete_node" && node.li_attr.multi == "1") {
                            return false;
                        }
                        return true;
                    }
                },
                // Defines all the active types in the tree 
                "types": {
                    "#": {
                        // disable max_depth checking in the tree 
                        "max_depth": 1
                    }
                },
                "plugins": ["wholerow", typeof inNative != "undefined" ? "" : "dnd", "types"]
            });
            // Responsible for hide those checkboxes which meets the conditions described in this.removePchecbox method
            this.removePchecbox(treeid);
            this.showans(treeid, 'u');
            this.checkAns(treeid, this.lcrt);
        }

        // Used for hiding the checkboxes from jstree according to matched condition
        removePchecbox(treeid) {
            var timer4 = setTimeout(()=> {
                J(treeid).find('[tid]').each((_this)=> {
                    if (AI.find(treeid, '.treeall').getAttribute('data-showcheckbox') == "0" || _this.attr('tid').length < 3) {
                        // hide the element having class 'jstree-checkbox' in tree
                        J(_this).find('> a > .jstree-checkbox').attr({action: 'hide'});
                    }
                });
                clearTimeout(timer4);
            }, 100);
        }

        // checks if tid exists in the list of all draagable elements and return true or false accordingly
        isTidExists(tid, tree) {
            // assign the reference of all available draggable data to tree
            tree = J.jstree.reference(tree)._model.data;
            var istree = false;
            J.each(tree, (index, value)=> {
                if (index != '#' && value.li_attr.tid == tid) {
                    istree = true;
                    return false;
                }
            });
            return istree;
        }

        // find the tid of given id
        getTid(id, tree) {
            return tree[id].li_attr.tid;
        }

        // returns an array object with properties id and sequence
        getId(tid, tree, type, arr) {
            arr = arr || false;
            var ret = [];
            // loops through the properties of tree object
            for (let i in tree) {
                if (i != '#') {
                    if (tree[i].li_attr.tid == tid) {
                        if (arr) {
                            var ans = "";
                            if (type == "c") {
                                // assign the correctans attributes value to ans after finding the correctans attributes of the element inside the Droppable area where draggable element dragged
                                ans = tree[tree[i].parent].li_attr.correctans;
                            } else if (type == "u") {
                                // assign the userans attributes value to ans after finding the userans attributes of the element inside the Droppable area where draggable element dragged
                                ans = tree[tree[i].parent].li_attr.userans;
                            }

                            var seq = false;
                            if (tree[i].li_attr.multi == "1") {
                                if (ans) {
                                    // assign the array object to matching variable after search in ans variable where {} find with any value between {}
                                    var matching = ans.match(/\{(.*?)\}/g);
                                    // loops through the properties of matching object
                                    for (let i in matching) {
                                        if (matching[i] == '{1}') {
                                            seq = '1';
                                        } else if (matching[i] == '{2}') {
                                            seq = '2';
                                        }
                                    }
                                }
                                if (seq && ans.indexOf('{' + seq + '}' + tree[i].li_attr.tid) != -1) {
                                    // If seq is defined and '{' + seq + '}' + tree[i].li_attr.tid is found in ans variable then set the tp object with properties id and seq 
                                    let tp = {
                                        'id': i,
                                        'seq': seq
                                    };
                                    // push the tp object into ret array
                                    ret.push(tp);
                                }
                            } else if (ans.indexOf('{' + tree[i].li_attr.seq + '}' + tree[i].li_attr.tid) != -1) {
                                // if '{' + tree[i].li_attr.seq + '}' + tree[i].li_attr.tid is found in ans variable then set the tp object with properties id and seq  
                                let tp = {
                                    'id': i,
                                    'seq': tree[i].li_attr.seq
                                };
                                // push the tp object into ret array
                                ret.push(tp);
                            } else {
                                console.log("entered");
                            }

                        } else {
                            return i;
                        }
                    }
                }
            }
            return ret.length > 0 ? ret : null;
        }

        // used for check the answer
        checkAns(treeid, elemnt) {
            elemnt = elemnt || J(treeid).find('.treeall');
            // if (!this.labBinded) {
            //     return false;
            // }
            if (window.inNative) {
                window.postMessage('height___' + AI.select("#treemain0").clientHeight, '*'); // increases the height of react native outer container
            }
            if (this.tempVar == 'u') {
               // try {
                    let userAnswers = null;
                    this.userAnsXML = J('<smans type="7"></smans');
                    this.result = true;
                    this.temp = 0;
                    var tree = J.jstree.reference(elemnt)._model.data;
                    J.each(tree, (index, value)=> {
                        if (index != '#' || tree[index].icon == "icomoon-database") {
                            // set the userAnsXML to this.userAnsXML returned from this.checkChildAns method
                            this.userAnsXML = this.checkChildAns(treeid, value, tree, this.userAnsXML, elemnt);
                        }
                    });
                    
                    userAnswers = (formatXml(this.userAnsXML.xml ? this.userAnsXML.xml : (new XMLSerializer()).serializeToString(this.userAnsXML[0])));
                    let result = {
                        uXml: userAnswers,
                        ans: this.result,
                    };
                    // Used in native for show the answer
                    if (window.inNative) {
                        window.postMessage(JSON.stringify({
                            userAnswers,
                            inNativeIsCorrect: this.result
                        }), "*");
                    }
                    return result;
               // } catch (event) {
                 //   console.warn(event);
                //}
            }
        }

        /* 
            set the result by using the varible this.result and returns the userAnsXML
            here passed arguments have this meaning:
            treeid     : its container which holds all the data of module such as draggable container, droppable                      container, headings of these fields etc.
            pElem      : draggable element which is dropped on droppable container
            tree       : all details of trees that exits on droppable container
            userAnsXML : User answer xml
            elemnt     : droppable area's container
        */
        checkChildAns(treeid, pElem, tree, userAnsXML, elemnt) {
            if (this.tempVar == 'u') {
                if (typeof (pElem.li_attr.correctans) !== "undefined") {
                    // filter the array and returns the array for which callback returns true
                    var cans = pElem.li_attr.correctans.split(',').filter((n)=> {
                        return (n)
                    });
                    //sort the cans array in assending order
                    cans = cans.sort().toString();
                    // entered in this block if droppable element has any draggable children
                    if (pElem.children.length > 0) {
                        var uans = [];
                        J.each(pElem.children, (i, v)=> {
                            if (typeof (tree[v].li_attr.cseq) != "undefined" && tree[v].li_attr.cseq != "0" && tree[v].li_attr.cseq != "*") {
                                // push the tid with some addition in cans array if contextmenu option selected on target draggable element
                                uans.push('{' + tree[v].li_attr.cseq + '}' + this.getTid(v, tree));
                            } else if (J(treeid).find('#' + v).find('> a > .jstree-checkbox:visible').length > 0 && J.jstree.reference(elemnt).is_selected(J(treeid).find('#' + v))) {
                                // push the tid with some addition in cans array if checkbox is used in tree structure instead of image
                                uans.push('*' + this.getTid(v, tree));
                            } else {
                                // push the tid in cans array
                                uans.push(this.getTid(v, tree));
                            }
                        });

                        if (typeof calculatePoint != "undefined" || window.inNative) {
                            J(cans.split(',')).each((i, val)=> {
                                // Increases the value of variable ucTree.temp if any data exist in cans and uans array
                                if (uans.indexOf(val) != -1) this.temp++;
                            });
                            // Checks if it is not native then sets the number of correct answer performed by user in data-totalcorrectans attribute of preview container
                            if (!window.inNative) calculatePoint(J(treeid).attr('data-totalcorrectans'), this.temp);
                        }

                        // sorts the uans array in assending order
                        uans = uans.sort().toString();
                        if (this.userAnsXML.find('#' + pElem.li_attr.tid).length > 0) {
                            //sets the attribute 'uans' to element with id 'pElem.li_attr.tid' inside 'this.userAnsXML' 
                            this.userAnsXML.find('#' + pElem.li_attr.tid).attr('uans', uans);
                        } else {
                            // append the div element with attribute 'id' and 'uans' having values pElem.li_attr.tid and uans
                            this.userAnsXML.append('<div id="' + pElem.li_attr.tid + '" uans="' + uans + '"></div>');
                        }

                        if (pElem.li_attr.userans) {
                            if (pElem.li_attr.userans.length == cans.length) {
                                if (pElem.li_attr.userans.match(/\{2}/g) || pElem.li_attr.userans.match(/\*/g)) {
                                    // assign the value in 'uans' variable
                                    uans = pElem.li_attr.userans;
                                }
                            }
                        }
                        // at the time of answer checking '*' keyword is replaced
                        cans = cans.replace(/\*/gm, '');
                        if (cans != uans) {
                            this.result = false;
                            // sets the attribute 'as' with value 0 of element with tid equals to pElem.li_attr.tid if cans != uans 
                            AI.select('[tid="' + pElem.li_attr.tid + '"]').setAttribute('as', 0);
                        } else {
                            // sets the attribute 'as' with value 1 of element with tid equals to pElem.li_attr.tid
                            AI.select('[tid="' + pElem.li_attr.tid + '"]').setAttribute('as', 1);
                        }
                    } else {
                        this.result = false;
                        // sets the attribute 'as' with value 0 of element with tid equals to pElem.li_attr.tid if calculatePoint is not defined
                        AI.select('[tid="' + pElem.li_attr.tid + '"]').setAttribute('as', 0);
                    }
                }
            }
            return userAnsXML;
        }

        // Shows what is correct and what you have performed
        showans(treeid, type) {
            if (type == "c") {
                // hides the draggable elements from Draggable container and adds border on its parent element that is 'J('.treecorrect_outer')
                AI.selectAll(".treecorrect_outer", 'addClass', "treecorrect_outer_border");
                AI.setCss(".treecorrect", {
                    display: "none"
                });
            }
            // Assign the userxml value in the variable special_module_user_xml_temp
            //var special_module_user_xml_temp = AI.select('#special_module_user_xml').value;
            // Droppable area container where data will be drop for correct answer
            var tree1 = J.jstree.reference('.treeall');
            // Draggable area container from where data will be drag and drop on Droppable area for correct answer
            var tree2 = J.jstree.reference('.treecorrect');
            if (tree1) {
                J.each(tree1._model.data, (index, value)=> {
                    if (index != '#') {
                        // Calls the method 'ucTree.showChildAns' if index is not equals to '#'
                        this.showChildAns(treeid, value, tree1, tree2, type);
                    }
                });
            }
            if (type == "c") {
                var timer5 = setTimeout(()=> {
                    // Shows the Draggable elements on Draggable area container and removes border from it's parent
                    AI.selectAll(".treecorrect_outer", 'removeClass', "treecorrect_outer_border");
                    AI.setCss(".treecorrect", {
                        display: "block"
                    });
                    // clear the timeout
                    clearTimeout(timer5);
                }, 100);
            }
            //checkes that is userxml changed
            //ISSPECIALMODULEUSERXMLCHANGE = 1;
            // assign the userxml data in J('#special_module_user_xml') for access it further
            //J('#special_module_user_xml').val(special_module_user_xml_temp);
        }

        // shows the answer and manage the cut copy etc functionality
        showChildAns(treeid, pElem, tree1, tree2, type) {
            if (typeof (pElem.li_attr.correctans) != "undefined" || typeof (pElem.li_attr.userans) != "undefined") {
                if (pElem.children.length > 0) {
                    // cut a node from Droppable container 
                    tree1.cut(pElem.children);
                    // copy or move the previously cut or copied nodes to draggable container 
                    tree2.paste('#');
                    // remove a node from Droppable container 
                    tree1.delete_node(pElem.children);
                }
            }
            var sel = [],
                cicon = [];
            if (type == 'c' && typeof (pElem.li_attr.correctans) !== "undefined") {
                var cans = pElem.li_attr.correctans.split(',');
                // filter the array and returns the array for which callback returns true
                cans = cans.filter((n)=> {
                    return (n)
                });
                var cid = [];
                for (let i in cans) {
                    if (cans[i].indexOf('*') === 0) {
                        // removes the * if it exists at the very first character of cans[i] string
                        cans[i] = cans[i].replace('*', '');
                        // push the data of cans[i] in sel after removing * from index 0
                        sel.push(cans[i]);
                    } else if (cans[i].match(/\{.+?\}/)) {
                        // removes the all data between every {} encluding open and closing curly brace from cans[i]
                        cans[i] = cans[i].replace(/\{.+?\}/, '');
                        // push the data of cans[i] into cicon after removing all data between {} including both curly brace from cans[i]
                        cicon.push(cans[i]);
                    }
                    // push the data in cid array after retun from this.getId method
                    cid.push(this.getId(cans[i], tree2._model.data));
                }
                // filter the array and returns the array for which callback returns true
                cid = cid.filter((n)=> {
                    return (n)
                });
                // cut a node from Draggable container 
                tree2.cut(cid);
                // copy or move the previously cut or copied nodes to droppable container 
                tree1.paste(pElem.id);
            } else if (type == 'u' && typeof (pElem.li_attr.userans) !== "undefined") {
                var uans = pElem.li_attr.userans.split(',');
                // filter the array and returns the array for which callback returns true
                uans = uans.filter((n)=> {
                    return (n)
                });
                var uid = [];
                // loops through the properties of uans object
                for (let index in uans) {
                    if (uans[index].indexOf('*') === 0) {
                        // removes the * if it exists at the very first character of uans[index] string
                        uans[index] = uans[index].replace('*', '');
                        sel.push(uans[index]);
                    } else if (uans[index].match(/\{.+?\}/)) {
                        // removes the all data between every {} encluding open and closing curly brace from uans[index]
                        uans[index] = uans[index].replace(/\{.+?\}/, '');
                        cicon.push(uans[index]);
                    }
                    // push the data in uid array after retun from this.getId method
                    uid.push(this.getId(uans[index], tree2._model.data));
                }
                // filter the array and returns the array for which callback returns true
                uid = uid.filter((n)=> {
                    return (n)
                });
                // cut a node from Draggable container
                tree2.cut(uid);
                // copy or move the previously cut or copied nodes to droppable container 
                tree1.paste(pElem.id);
            }

            if (sel.length > 0) {
                let sid = [];
                // loops through the properties of sel object
                for (let index in sel) {
                    // joins 2 array first one 'sid' and second on retuned by this.getId method and assign to sid array
                    sid = sid.concat(this.getId(sel[index], tree1._model.data, type, true));
                }
                // filter the array and returns the array for which callback returns true
                sid = sid.filter((n)=> {
                    return (n)
                });
                // select a node, passing the second argument true will prevent 'changed.jstree' event from being triggered 
                tree1.select_node(sid, true);
            }

            if (cicon.length > 0) {
                let sid = [];
                // loops through the properties of cicon object
                for (let index in cicon) {
                    // joins 2 array first one 'sid' and second on retuned by this.getId method and assign to sid array
                    sid = sid.concat(this.getId(cicon[index], tree1._model.data, type, true));
                }
                // filter the array and returns the array for which callback returns true
                sid = sid.filter((n)=> { return (n) });

                var tr = tree1._model.data;
                // loops through the properties of sid object
                for (let index in sid) {
                    // assign the cseq of Droppable area's element
                    tr[sid[index].id].li_attr.cseq = sid[index].seq;
                    // set the node icon for a node
                    tree1.set_icon(sid[index].id, this.context_options['opt' + (sid[index].seq - 1)]['icon']);
                }
            }
        }

        // hide/show the button of currect answer and your answer and checks the answer and shows if argument 'on' passed in case of calling it
        modeOn(modeType) {
            // initially hides the buttons inside the element with id sm_controller
            AI.selectAll('.test, .review', 'addClass', 'h');
            if (modeType) {
                // shows the buttons inside the element with id sm_controller
                AI.selectAll('.review', 'removeClass', 'h');
                // disabled the drggable option and pushed the user data in uans array
                this.unBindLab();
                // shows the user answer
                this.showans(this.ajax_eId, 'u');
                // J('#sm_controller button').each(()=> {
                //     if (J(this).hasClass('your-ans btn-light')) {
                //         // shows the user answer if button inside the element has id: 'sm_controller' have 'your-ans' and 'btn-light' class 
                //         this.showans(this.ajax_eId, 'u');
                //     } else if (J(this).hasClass('correct-ans btn-light')) {
                //         // shows the correct answer after click on correct answer button
                //         this.showans(this.ajax_eId, 'c');
                //     }
                // });
            } else {
                //removes the h class from draggable container
                AI.selectAll('.test', 'removeClass', 'h');
                // Enables to drag and drop the element for matching the answer and completing the task
                this.bindLab();
                // shows the user answer
                this.showans(this.ajax_eId, 'u');
            }
        }

        // Used for disabled the drggable option if review mode is on and pushed the user data in uans array
        unBindLab() {
            this.labBinded = false;
            // For droppable area's container element
            var elemnt = J(this.ajax_eId).find('.treeall');
            // For draggable area's container element
            this.lall = J(this.ajax_eId).find('.treecorrect');
            elemnt.jstree()['settings']['dnd'].check_while_dragging = false;
            // disabled the draggable element from being drag from droppable container
            elemnt.jstree()['settings']['dnd'].is_draggable = false;
            this.lall.jstree()['settings']['dnd'].check_while_dragging = false;
            // disabled the draggable element from being drag from draggable container
            this.lall.jstree()['settings']['dnd'].is_draggable = false;
            var tree = J.jstree.reference(elemnt)._model.data;
            J.each(tree, (index, value)=> {
                if (index != '#') {
                    let uans = [];
                    J.each(value.children, (i, v)=> {
                        if (typeof (tree[v].li_attr.cseq) != "undefined" && tree[v].li_attr.cseq != "0" && tree[v].li_attr.cseq != "*") {
                            // push tid of draggable element with sequence if it is defined for answer matching
                            uans.push('{' + tree[v].li_attr.cseq + '}' + this.getTid(v, tree));
                        } else if (J(this.ajax_eId).find('#' + v).find('> a > .jstree-checkbox:visible').length > 0 && J.jstree.reference(elemnt).is_selected(J(this.ajax_eId).find('#' + v))) {
                            // push the tid with some addition in cans array if checkbox is used in tree structure instead of image
                            uans.push('*' + this.getTid(v, tree));
                        } else {
                            // push the tid in cans array
                            uans.push(this.getTid(v, tree));
                        }
                    });
                    uans = uans.sort().toString();
                    if (typeof (value.li_attr.correctans) != 'undefined') {
                        if (uans.length >= 0) {
                            // set the useranswer
                            value.li_attr.userans = uans;
                        }
                    }
                }
            });
            // hides the context menu if right-click performed on Droppable area's container
            J(elemnt).on({
                "contextmenu": (event)=> {
                    event.preventDefault();
                    if (event.which == '3' || event.which == '2') {
                        J('.jstree-contextmenu.jstree-default-contextmenu').css('display', 'none');
                    }
                }
            });
            // Add the class active on correct answer or your answer button which is clicked
            J('#sm_controller button').click(()=> {
                J('#sm_controller button').removeClass("active");
                J(this).addClass('active');
            });
        }

        // Enables to drag and drop the element for matching the answer and completing the task
        bindLab() {
            this.labBinded = true;
            // For droppable area's container element
            this.lcrt = J(this.ajax_eId).find('.treeall');
            // For draggable area's container element
            this.lall = J(this.ajax_eId).find('.treecorrect');
            this.lcrt.jstree()['settings']['dnd'].check_while_dragging = true;
            this.lcrt.jstree()['settings']['dnd'].is_draggable = false;
            this.lall.jstree()['settings']['dnd'].check_while_dragging = true;
            // enabled the draggable element from being drag from draggable container
            this.lall.jstree()['settings']['dnd'].is_draggable = true;
            // hides the context menu if right-click performed on Draggable area's container
            J(this.lcrt).on({
                "contextmenu": (event)=> {
                    event.preventDefault();
                    if (event.which == '3' || event.which == '2') {
                        J('.jstree-contextmenu.jstree-default-contextmenu').css('display', 'block');
                    }
                }
            });
        }
    }

    const ucTree = new treeviewHelper();

    let API  = {};
    const servers = [
        'http://localhost/pe-gold3/', 
        'https://www.ucertify.com/', 
        'https://www.jigyaasa.info/',
        'http://172.10.195.203/pe-gold3/',
    ];
    const REMOTE_API_URL = servers[1] + 'pe-api/1/index.php';
    let client = {
    	email: "pradeep.yadav@ucertify.com",
    	password: "786pradeep",
    	isSocial: "false",
    	clientId: "040MA"
    };
    API.validateApp = function (checkExpired) {
    	return new Promise((resolve, reject) => {
    		let isExpired = checkExpired ? `&action=refresh_token&refresh_token=1` : "";
    		let isSocial =  '&social_login=1' ;
    		let url = `${REMOTE_API_URL}?func=cat2.authenticate&device_id=${client.clientId}&email=${client.email}&password=${client.password + isSocial + isExpired}`;
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
    };

    API.getAPIDataJ = function(func, where, callback = function(){}) {
    	let param = "";
    	let _param2 = {};
    	let str = '';
    	let ajax_info = where.ajax_info ||{};
    	where = assignPartial(where, {}, 'ajax_info', true);
    	// if (typeof where.redis == 'undefined') {
    	// 	_param2.redis = 0;
        // }
    	//----------- code for acces_token based validation --------//
    	_param2.device_id = client.clientId;
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
    	
    	API.getAPIDataJSON(REMOTE_API_URL + "?" + str + "&debug=0&"+param, param, ajax_info, function(apidata) {
    		if (apidata == 'Expired'){
    			API.getAPIDataJ(func, where, callback);
    		} else {
    			callback(apidata);
    		}
    	}, func);
    };

    API.getAPIDataJSON = function (url, data, ajax_info, callback = function(){}, funcName) {
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
    						API.validateApp (responseObject.error.error_id != -9).then((validRes) => {
    							if (validRes.status == 'Success') {
    								setAccessKey$1(validRes);
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
    							console.log("Api data J reponse <-- Received -->", responseObject);
    						} else if(responseObject['response'] == undefined && responseObject.error == undefined) {
    							responseData = responseObject;
    							console.log("Api data J reponse <-- Received II-->", responseData);
    						} else {
    							responseData = undefined;
    							console.log({"Response_error":responseObject.error});
    						}
    					}
    				}
    			} catch (error) {
    				console.log("Please check your Internet connection.");
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
    };


    function assignPartial(iObj, oObj = {}, str, unsetOnly = false ) {
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

    function setAccessKey$1 (api) {
    	if (api.access_token && api.access_token.length > 50) {
    		window.apiAccessToken = api.access_token;
    	}
    }

    var api_functions = API;

    var xml2json = createCommonjsModule(function (module, exports) {
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

    let listener = {};
    const bsCat1 = ["Modal", "Tooltip", "Collapse", "Popover", "ScrollSpy", "Tab"];
    const extraSelectors = ["hidden", "visible", "selected", "checked", "enabled"];

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

    const AH = {
    	set: setContext,
    	get: getContext,
    	setApiKey(token) {
    		window.apiAccessToken = token;
    	},
    	url(url = window.location.href) {
    		return new URLSearchParams(url);
    	},
    	updateEditorUrl(data) {
    		var newUrl = `?action=new&content_subtype=${data.subtype}&content_type=${data.type}&content_icon=${data.content_icon}&react_content=1`;
    		window.history.replaceState(null, "", newUrl);
    	},
    	param2Url(params) {
    		let url = [];

    		for (var i in params) {
    			var uri = i + "=" + params[i];
    			url.push(uri);
    		}

    		return url.join("&");
    	},
    	unique(myArray) {
    		return myArray.filter((v, i, a) => a.indexOf(v) === i);
    	},
    	parseJSON(obj, showErr_data) {
    		let showErr = showErr_data || false;

    		try {
    			return JSON.parse(obj);
    		} catch(e) {
    			if (showErr) {
    				console.warn(e);
    			}

    			return {}; //Return blank object
    		}
    	},
    	parseDom(str) {
    		let parser = new DOMParser();
    		let html = parser.parseFromString(str, "text/html");
    		return html;
    	},
    	parseHtml: templateHtml,
    	addScript(data, isUrl, attr = {}) {
    		let sc = document.createElement("script");

    		if (isUrl) {
    			sc.src = isUrl;
    			sc.async = attr.async || true;
    		} else {
    			sc.innerHTML = data;
    		}

    		document.head.append(sc);
    		return sc;
    	},
    	hasInall(selector, target) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelectorAll(selector);

    		let result = [];

    		if (current) {
    			current.forEach(item => {
    				if (item.contains(target)) {
    					result.push(item);
    				}
    			});
    		}

    		return result;
    	},
    	removeDomAttr(selector, attrArray) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (current) {
    			attrArray.forEach(attr => {
    				current.removeAttribute(attr);
    			});
    		}

    		return current || {};
    	},
    	trigger(selector, evName, options) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (current) {
    			options
    			? current.dispatchEvent(new Event(evName, options))
    			: current.dispatchEvent(new Event(evName));
    		} else {
    			console.log("Selector not found.", selector);
    		}

    		return current || {};
    	},
    	findChild(selector, search) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

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
    	parent(selector, search) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		let elm = current.parentElement;

    		if (search) {
    			while (elm) {
    				if (elm.matches(search)) {
    					break;
    				}

    				elm = elm.parentElement;
    			}
    		}

    		return elm;
    	},
    	siblings(selector, search) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		let result = [];

    		if (current) {
    			var node = current.parentNode.firstChild;

    			while (node) {
    				if (node !== current && node.nodeType === Node.ELEMENT_NODE) {
    					if (search) {
    						node.matches(search) ? result.push(node) : "";
    					} else {
    						result.push(node);
    					}
    				}

    				node = node.nextElementSibling || node.nextSibling;
    			}
    		}

    		return result;
    	},
    	nextAll(selector) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		let nextSibling = current.nextElementSibling;
    		let result = [];

    		if (nextSibling) {
    			while (nextSibling) {
    				nextSibling = nextSibling.nextElementSibling;
    				result.push(nextSibling);
    			}
    		}

    		return result;
    	},
    	nextElm(selector, search) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		let nextSibling = current.nextElementSibling;

    		if (search) {
    			while (nextSibling) {
    				if (nextSibling.matches(search)) {
    					break;
    				}

    				nextSibling = nextSibling.nextElementSibling;
    			}
    		}

    		return nextSibling;
    	},
    	prevElm(selector, search) {
    		let current = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		let previousSibling = current.previousElementSibling;

    		if (search) {
    			while (previousSibling) {
    				if (previousSibling.matches(search)) {
    					break;
    				}

    				previousSibling = previousSibling.previousElementSibling;
    			}
    		}

    		return previousSibling;
    	},
    	onReady(func) {
    		document.addEventListener("DOMContentLoaded", function (event) {
    			func.call(event);
    		});
    	},
    	create(tagName, html) {
    		let elem = document.createElement(tagName);

    		if (html) {
    			elem.innerHTML = html;
    		}

    		return elem;
    	},
    	clone(selector) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			return selected.cloneNode(true);
    		}

    		return null;
    	},
    	serialize(selector) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			return new URLSearchParams(new FormData(selected)).toString();
    		}

    		return null;
    	},
    	empty(selector) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			while (selected.firstChild) selected.removeChild(selected.firstChild);
    		}
    	},
    	getBS(target, comp, options) {
    		let selected = typeof target == "object"
    		? target
    		: document.querySelector(target);

    		//let isIns = (typeof target == "object") ? false : target;
    		if (selected && bsCat1.includes(comp)) {
    			//if (isIns && bsInstance[isIns]) return bsInstance[isIns];
    			let isIns = bootstrap[comp].getInstance(selected);

    			if (isIns) {
    				return bootstrap[comp].getInstance(selected);
    			} else {
    				let ref = new bootstrap[comp](selected, options);

    				//isIns && (bsInstance[isIns] = ref);
    				return ref;
    			}
    		} else {
    			return {};
    		}
    	},
    	enableBsAll(selector, comp) {
    		if (bsCat1.includes(comp)) {
    			let triggerList = [].slice.call(document.querySelectorAll(selector));

    			let fireList = triggerList.map(function (triggerElm) {
    				return new bootstrap[comp](triggerElm);
    			});

    			return fireList;
    		} else {
    			console.error("Bootstrap can't enable for this component name");
    			return [];
    		}
    	},
    	hideBsAll(fireList, comp) {
    		if (bsCat1.includes(comp)) {
    			fireList.forEach(function (elm) {
    				elm.hide();
    			});
    		} else {
    			console.error("Bootstrap can't disable for this component name");
    		}
    	},
    	ajax(sendData) {
    		let longData = "";

    		if (typeof sendData.data == "object") {
    			if (sendData.formData) {
    				longData = sendData.data;
    			} else if (sendData.withUrl) {
    				let param = "?";

    				for (let k in sendData.data) {
    					if (typeof sendData.data[k] != "object") {
    						param += "&" + k + "=" + sendData.data[k];
    					}
    				}

    				sendData.url += param;
    			} else {
    				longData = new FormData();

    				for (let prop in sendData.data) {
    					if (typeof sendData.data[prop] != "object") {
    						longData.append(prop, sendData.data[prop]);
    					}
    				}
    			}
    		}

    		return new Promise((resolve, reject) => {
    				const request = new XMLHttpRequest();
    				request.open(sendData.type || "POST", sendData.url, true);

    				if (sendData.responseType) {
    					request.responseType = sendData.responseType;
    				}

    				request.onreadystatechange = event => {
    					if (request.readyState == 4 && request.status === 200) {
    						try {
    							resolve(request.responseText, event);
    						} catch(err) {
    							reject(err);
    						}
    					}
    				};

    				request.onerror = requestError => {
    					reject(requestError);
    				};

    				if (sendData.onStart) request.onloadstart = sendData.onStart;
    				request.send(longData);
    			});
    	},
    	getJSON(url) {
    		var scr = document.createElement("script");
    		scr.src = url;
    		document.body.appendChild(scr);
    	},
    	offset(container) {
    		let rect = typeof container == "object"
    		? container
    		: document.querySelector(container);

    		let offset = { rect };

    		if (rect) {
    			rect = ClientRect.getBoundingClientRect();

    			offset = {
    				rect,
    				top: rect.top + window.scrollY,
    				left: rect.left + window.scrollX
    			};
    		}

    		return offset;
    	},
    	inArray(baseArray, compareArray) {
    		let matched = [];

    		if (baseArray && compareArray) {
    			baseArray.forEach(item => {
    				compareArray.forEach(comp => {
    					if (item == comp) {
    						matched.includes(comp) ? "" : matched.push(comp);
    					}
    				});
    			});
    		}

    		return matched.length > 0 ? matched.length : -1;
    	},
    	find(baseSelector, target, data) {
    		let base = typeof baseSelector == "object"
    		? baseSelector
    		: document.querySelector(baseSelector);

    		let typeAction = typeof data == "object" ? "action" : data;

    		if (base) {
    			switch (typeAction) {
    				case "all":
    					return base.querySelectorAll(target);
    				case "child":
    					return base.querySelector(target).childNodes;
    				case "hidden":
    					return Array.prototype.filter.call(base.querySelectorAll(target), elm => elm.hidden);
    				case "visible":
    					return Array.prototype.filter.call(base.querySelectorAll(target), elm => !elm.hidden);
    				case "checked":
    					return Array.prototype.filter.call(document.querySelectorAll(selector), elm => elm.checked);
    				case "selected":
    					return Array.prototype.filter.call(base.querySelectorAll(target), elm => !elm.selected);
    				case "action":
    					{
    						let found = base.querySelectorAll(target);

    						if (found && found.length > 0 && data.action) {
    							found.forEach(_elm => jsAction(_elm, {
    								action: data.action,
    								actionData: data.actionData
    							}));
    						}

    						return found;
    					}
    				default:
    					return base.querySelector(target);
    			}
    		}

    		return [];
    	},
    	selectAll(selector, action, actionData) {
    		let selected = extraSelectors.includes(action)
    		? selectAction(selector, action)
    		: document.querySelectorAll(selector);

    		if (selected && selected.length > 0 && action) {
    			selected.forEach(elm => jsAction(elm, { action, actionData }));
    		}

    		return selected;
    	},
    	select(selector, type) {
    		if (type) {
    			return selectAction(selector, type);
    		} else {
    			return document.querySelector(selector) || {};
    		}
    	},
    	getElm(selector, type) {
    		if (type) {
    			return new Promise((resolve, reject) => {
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
    	listenAll(target, eventName, func) {
    		let selected = typeof target == "object"
    		? target
    		: document.querySelectorAll(target);

    		if (selected && selected.length > 0) {
    			for (let i = 0; i < selected.length; i++) {
    				selected[i].addEventListener(eventName, func, false);
    			}
    		}
    	},
    	bind(selector, eventName, handler) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			selected.addEventListener(eventName, handler);
    		}
    	},
    	listen(baseSelector, eventName, selector, handler) {
    		let base = typeof baseSelector == "object"
    		? baseSelector
    		: document.querySelector(baseSelector);

    		if (listener[selector]) {
    			base.removeEventListener(eventName, listener[selector]);
    		}

    		listener[selector] = onListen.bind(this, selector, handler, base);
    		base.addEventListener(eventName, listener[selector]);
    	},
    	removeClass(selector, name) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelectorAll(selector);

    		if (selected && selected.length > 0) {
    			selected.forEach(elm => jsAction(elm, { action: "removeClass", actionData: name }));
    		}

    		return selected || {};
    	},
    	addClass(selector, name) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelectorAll(selector);

    		if (selected && selected.length > 0) {
    			selected.forEach(elm => jsAction(elm, { action: "addClass", actionData: name }));
    		}

    		return selected || {};
    	},
    	toggleDom(dom, action = "toggleDisplay") {
    		let selected = typeof dom == "object"
    		? dom
    		: document.querySelectorAll(dom);

    		if (selected && selected.length > 0) {
    			selected.forEach(elm => jsAction(elm, { action }));
    		}

    		return selected || {};
    	},
    	select2(selecor) {
    		let found = document.querySelector(`${selecor} + span > .selection > span`);

    		if (found) {
    			found.click();
    		}
    	},
    	setAttr(selector, attrs) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			for (let property in attrs) {
    				selected.setAttribute(property, attrs[property]);
    			}
    		}

    		return selected || {};
    	},
    	setCss(selector, cssList) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			for (let property in cssList) {
    				selected.style && (selected.style[property] = cssList[property]);
    			}
    		}

    		return selected || {};
    	},
    	remove(dom) {
    		let selected = document.querySelectorAll(dom);

    		if (selected.length > 0) {
    			selected.forEach(elm => elm.remove());
    		}
    	},
    	replaceWith(selector, domStr) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			let createdNode = templateHtml(domStr);
    			selected.replaceWith(createdNode);
    			return createdNode;
    		}

    		return selected;
    	},
    	wrap(selector, domStr) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			let createdNode = templateHtml(domStr);
    			let innerNode = innerChild(createdNode);
    			innerNode.innerHTML = selected.outerHTML;
    			selected.parentNode.replaceChild(createdNode, selected);
    			return innerNode.firstChild;
    		}

    		return selected;
    	},
    	unwrap(selector) {
    		let nodeToRemove = typeof selector == "object"
    		? selector
    		: document.querySelectorAll(selector);

    		if (nodeToRemove && nodeToRemove.length > 0) {
    			nodeToRemove.forEach(item => {
    				item.outerHTML = item.innerHTML;
    			});
    		}
    	},
    	insertAfter(newNode, existingNode) {
    		newNode = typeof newNode == "object"
    		? newNode
    		: document.querySelector(newNode);

    		existingNode = typeof existingNode == "object"
    		? existingNode
    		: document.querySelector(existingNode);

    		if (newNode && existingNode) {
    			existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
    		}

    		return newNode;
    	},
    	insert(selector, domStr, position) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			switch (position) {
    				case "beforebegin":
    					selected.insertAdjacentHTML("beforebegin", domStr);
    					break;
    				case "afterbegin":
    					selected.insertAdjacentHTML("afterbegin", domStr);
    					break;
    				case "beforeend":
    					selected.insertAdjacentHTML("beforeend", domStr);
    					break;
    				case "afterend":
    					selected.insertAdjacentHTML("afterend", domStr);
    					break;
    			}
    		}

    		return selected || {};
    	},
    	domIndex(selector) {
    		let selected = typeof selector == "object"
    		? selector
    		: document.querySelector(selector);

    		if (selected) {
    			return Array.from(selected.parentNode.children).indexOf(selected);
    		} else {
    			retunr - 1;
    		}
    	},
    	contains(selector, text) {
    		var elements = typeof selector == "object"
    		? selector
    		: document.querySelectorAll(selector);

    		if (elements && elements.length > 0) {
    			return [].filter.call(elements, function (element) {
    				return RegExp(text).test(element.textContent);
    			});
    		} else {
    			return [];
    		}
    	},
    	match(baseSelector, mathStr) {
    		let base = typeof baseSelector == "object"
    		? baseSelector
    		: document.querySelector(baseSelector);

    		let matched = [];

    		if (base && base.length > 0) {
    			base.forEach(elm => {
    				if (elm.matches(mathStr)) matched.push(elm);
    			});
    		} else {
    			return base && base.matches(mathStr);
    		}

    		return matched;
    	},
    	getAPIDataJ: api_functions.getAPIDataJ,
    	validateApp: api_functions.validateApp,
    	validate(isExpired) {
    		return new Promise((resolve, reject) => {
    				api_functions.validateApp(isExpired).then(tokenApi => {
    					if (tokenApi.status != "Success") {
    						reject(tokenApi);
    					} else {
    						try {
    							setAccessKey(tokenApi);
    							resolve(tokenApi);
    						} catch(err) {
    							reject(err);
    						}
    					}
    				}).catch(err => {
    					reject(err);
    				});
    			});
    	},
    	ignoreEnity(html) {
    		return html.replace(/&amp;/g, "&");
    	},
    	getUrlVars() {
    		let vars = [], hash;
    		let hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&");

    		for (let i = 0; i < hashes.length; i++) {
    			hash = hashes[i].split("=");
    			vars.push(hash[0]);
    			vars[hash[0]] = hash[1];
    		}

    		return vars;
    	},
    	validateAjaxData(ajaxData, type) {
    		if (type == 0 || type == 8) {
    			if (ajaxData && !AI.get("is_proposed")) {
    				if (ajaxData.content_text) {
    					try {
    						ajaxData.content_text.answers.forEach(function (item, index) {
    							ajaxData.content_text.answers[index].answer = item.answer.replace(/\n/g, "");
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
    								}
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
    						}
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
    	cache(func) {
    		var chacheData = new Map();

    		return function (input) {
    			if (chacheData.has(input)) {
    				return chacheData.get(input);
    			}

    			var newResult = func(input);
    			chacheData.set(input, newResult);
    			return newResult;
    		};
    	},
    	editorModal(action, file, isFrame) {
    		
    	},
    	showmsg(msg, time = 10000) {
    		let errorAlert = document.querySelector("#errmsg");
    		if (buffer["showmsg"]) clearTimeout(buffer["showmsg"]);

    		if (msg != "") {
    			errorAlert.classList.add("show");
    			errorAlert.innerHTML = msg;

    			buffer["showmsg"] = setTimeout(
    				function () {
    					errorAlert.classList.remove("show");
    				},
    				time
    			);
    		} else {
    			errorAlert.classList.remove("show");
    		}
    	},
    	activate(loader) {
    		document.querySelector("#activateLoaderContainer") && document.querySelector("#activateLoaderContainer").remove();

    		if (loader > 0) {
    			AI.insert(document.body, `<div id="activateLoaderContainer" class="activateOverlay" style="z-index:9999999;"><center><div class="activator" style="height:100px; width: 100px;"></div></center></div>`, "afterend");
    		}
    	},
    	override() {
    		// define a new console
    		var _log = console.log;

    		console.log = function (logMessage) {
    			// Do something with the log message
    			if (logMessage && !logMessage.off) {
    				trackInf[temp] = logMessage;
    				temp++;
    			}

    			//Then pass the console
    			_log.apply(console, arguments);
    		}; //console.trace();
    	},
    	profile(tag) {
    		if (isDev == "1") {
    			tag != "end"
    			? console.profile(tag)
    			: console.profileEnd();
    		}
    	},
    	isValid(data, filter = false) {
    		if (data && data != undefined && data != "" && data != "undefined" && data != null) {
    			return true;
    		} else {
    			if (filter && data != filter) return true;
    			return false;
    		}
    	},
    	extend() {
    		//This function are alternative of $.extend which merge content of objects into first one
    		// Variables
    		var extended = {};

    		var deep = false;
    		var i = 0;
    		var length = arguments.length;

    		// Check if a deep merge
    		if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
    			deep = arguments[0];
    			i++;
    		}

    		// Merge the object into the extended object
    		var merge = function (obj) {
    			for (var prop in obj) {
    				if (Object.prototype.hasOwnProperty.call(obj, prop)) {
    					// If deep merge and property is an object, merge properties
    					if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]") {
    						extended[prop] = extend(true, extended[prop], obj[prop]);
    					} else {
    						extended[prop] = obj[prop];
    					}
    				}
    			}
    		};

    		// Loop through each object and conduct a merge
    		for (; i < length; i++) {
    			var obj = arguments[i];
    			merge(obj);
    		}

    		return extended;
    	}
    };

    function onListen(selector, handler, base, event) {
    	let closest = event.target.closest && event.target.closest(selector);

    	if (closest && base.contains(closest)) {
    		// passes the event to the handler and sets `this`
    		// in the handler as the closest parent matching the
    		// selector from the target element of the event
    		handler.call(this, closest, event);
    	}
    }

    function templateHtml(html) {
    	let t = document.createElement("template");
    	t.innerHTML = html;
    	return t.content.firstElementChild.cloneNode(true);
    }

    function innerChild(node) {
    	let currentNode = node.lastChild;

    	while (currentNode) {
    		currentNode = node.lastChild;
    	}

    	return currentNode;
    }

    function selectAction(selector, type) {
    	switch (type) {
    		case "hidden":
    			return Array.prototype.filter.call(document.querySelectorAll(selector), elm => elm.hidden);
    		case "visible":
    			return Array.prototype.filter.call(document.querySelectorAll(selector), elm => !elm.hidden);
    		case "selected":
    			return Array.prototype.filter.call(document.querySelectorAll(selector), elm => elm.selected);
    		case "checked":
    			return Array.prototype.filter.call(document.querySelectorAll(selector), elm => elm.checked);
    		case "enabled":
    			return document.querySelectorAll(selector + ":not([disabled]");
    		default:
    			return document.querySelector(selector);
    	}
    }

    function jsAction(selected, data) {
    	switch (data.action) {
    		case "show":
    			selected.style.display = "block";
    			break;
    		case "hide":
    			selected.style.display = "none";
    			break;
    		case "toggleDisplay":
    			selected.style.display = selected.style.display == "none" ? "block" : "none";
    			break;
    		case "addClass":
    			typeof data.actionData == "object"
    			? selected.classList.add(...data.actionData)
    			: selected.classList.add(data.actionData);
    			break;
    		case "removeClass":
    			typeof data.actionData == "object"
    			? selected.classList.remove(...data.actionData)
    			: selected.classList.remove(data.actionData);
    			break;
    		case "toggleClass":
    			selected.classList.toggle(data.actionData);
    			break;
    		case "html":
    			selected.innerHTML = data.actionData;
    			break;
    		case "value":
    			selected.value = data.actionData;
    			break;
    		case "checked":
    			selected.checked = data.actionData;
    			break;
    		case "remove":
    			selected.remove();
    			break;
    		case "removeAttr":
    			selected.removeAttribute(data.actionData);
    			break;
    	}
    }

    /* helper\ItemHelper.svelte generated by Svelte v3.29.0 */
    const file = "helper\\ItemHelper.svelte";

    // (13:0) {#if reviewMode}
    function create_if_block(ctx) {
    	let center;
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			center = element("center");
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "Correct Answer";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "Your Answer";
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "mode", "c");
    			attr_dev(button0, "class", "btn btn-light correct-ans");
    			add_location(button0, file, 15, 12, 744);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "mode", "u");
    			attr_dev(button1, "class", "btn btn-light your-ans active");
    			add_location(button1, file, 16, 12, 873);
    			attr_dev(div, "class", "smControlerBtn");
    			add_location(div, file, 14, 8, 702);
    			attr_dev(center, "class", "pb-2");
    			add_location(center, file, 13, 4, 671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, center, anchor);
    			append_dev(center, div);
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
    			if (detaching) detach_dev(center);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(13:0) {#if reviewMode}",
    		ctx
    	});

    	return block;
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

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			t0 = space();
    			button1 = element("button");
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(button0, "type", "button");
    			attr_dev(button0, "class", "h h-imp");
    			attr_dev(button0, "id", "set-review");
    			add_location(button0, file, 10, 0, 437);
    			attr_dev(button1, "type", "button");
    			attr_dev(button1, "class", "h h-imp");
    			attr_dev(button1, "id", "unset-review");
    			add_location(button1, file, 11, 0, 541);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, button1, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);

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
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(button1);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
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
    	const dispatch = createEventDispatcher();

    	function handleSmClick(event) {
    		document.querySelectorAll(".smControlerBtn button").forEach(el => el.classList.toggle("active"));
    		if (handleReviewClick) handleReviewClick(event.target.getAttribute("mode"), event);
    	}

    	const writable_props = ["reviewMode", "handleReviewClick"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ItemHelper> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("setReview");
    	const click_handler_1 = () => dispatch("unsetReview");

    	$$self.$$set = $$props => {
    		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ("handleReviewClick" in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		reviewMode,
    		handleReviewClick,
    		dispatch,
    		handleSmClick
    	});

    	$$self.$inject_state = $$props => {
    		if ("reviewMode" in $$props) $$invalidate(0, reviewMode = $$props.reviewMode);
    		if ("handleReviewClick" in $$props) $$invalidate(3, handleReviewClick = $$props.handleReviewClick);
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
    		init(this, options, instance, create_fragment, safe_not_equal, { reviewMode: 0, handleReviewClick: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemHelper",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*handleReviewClick*/ ctx[3] === undefined && !("handleReviewClick" in props)) {
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

    /* clsSMTree\TreeViewPreview.svelte generated by Svelte v3.29.0 */

    const { Object: Object_1, console: console_1, document: document_1 } = globals;
    const file$1 = "clsSMTree\\TreeViewPreview.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	child_ctx[36] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (624:8) {:else}
    function create_else_block(ctx) {
    	let div5;
    	let itemhelper;
    	let t0;
    	let button;
    	let t1;
    	let center;
    	let div4;
    	let t2;
    	let div3;
    	let t3;
    	let div0;
    	let ul0;
    	let div0_data_showcheckbox_value;
    	let t4;
    	let show_if = AH.isValid(window.inNative);
    	let t5;
    	let div2;
    	let div1;
    	let ul1;
    	let div2_class_value;
    	let div4_data_totalcorrectans_value;
    	let current;
    	let mounted;
    	let dispose;

    	itemhelper = new ItemHelper({
    			props: {
    				handleReviewClick: /*func*/ ctx[13],
    				reviewMode: /*isReview*/ ctx[0]
    			},
    			$$inline: true
    		});

    	itemhelper.$on("setReview", /*setReview*/ ctx[6]);
    	itemhelper.$on("unsetReview", /*unsetReview*/ ctx[7]);
    	let if_block0 = !window.inNative && create_if_block_6(ctx);
    	let if_block1 = window.inNative && window.inNative != undefined && create_if_block_5(ctx);
    	let each_value_1 = /*listItemCorrect*/ ctx[3];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let if_block2 = show_if && create_if_block_1(ctx);
    	let each_value = /*state*/ ctx[2].listItemAll;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			create_component(itemhelper.$$.fragment);
    			t0 = space();
    			button = element("button");
    			t1 = space();
    			center = element("center");
    			div4 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div3 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div0 = element("div");
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t4 = space();
    			if (if_block2) if_block2.c();
    			t5 = space();
    			div2 = element("div");
    			div1 = element("div");
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "type", "button");
    			attr_dev(button, "class", "h h-imp");
    			set_style(button, "display", "none");
    			attr_dev(button, "id", "delNodes");
    			add_location(button, file$1, 631, 16, 29824);
    			attr_dev(ul0, "id", "testme");
    			add_location(ul0, file$1, 649, 32, 30980);
    			attr_dev(div0, "class", "span6 treeall");
    			attr_dev(div0, "data-showcheckbox", div0_data_showcheckbox_value = /*state*/ ctx[2].showCheckbox);
    			add_location(div0, file$1, 648, 28, 30880);
    			add_location(ul1, file$1, 689, 36, 33773);
    			attr_dev(div1, "class", "span6 treecorrect");
    			set_style(div1, "width", "100%");
    			add_location(div1, file$1, 688, 32, 33683);
    			attr_dev(div2, "id", "test");

    			attr_dev(div2, "class", div2_class_value = AH.isValid(window.inNative)
    			? "w-100"
    			: "treecorrect_outer");

    			add_location(div2, file$1, 687, 28, 33566);
    			attr_dev(div3, "class", "row-fluid tree");
    			add_location(div3, file$1, 644, 24, 30615);
    			attr_dev(div4, "id", "treemain0");
    			attr_dev(div4, "data-totalcorrectans", div4_data_totalcorrectans_value = /*state*/ ctx[2].totalCorrectAns);
    			attr_dev(div4, "class", "treemain");
    			add_location(div4, file$1, 633, 20, 29975);
    			add_location(center, file$1, 632, 16, 29945);
    			add_location(div5, file$1, 624, 12, 29523);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			mount_component(itemhelper, div5, null);
    			append_dev(div5, t0);
    			append_dev(div5, button);
    			append_dev(div5, t1);
    			append_dev(div5, center);
    			append_dev(center, div4);
    			if (if_block0) if_block0.m(div4, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			if (if_block1) if_block1.m(div3, null);
    			append_dev(div3, t3);
    			append_dev(div3, div0);
    			append_dev(div0, ul0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(ul0, null);
    			}

    			append_dev(div3, t4);
    			if (if_block2) if_block2.m(div3, null);
    			append_dev(div3, t5);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, ul1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul1, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*delNodes*/ ctx[8], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const itemhelper_changes = {};
    			if (dirty[0] & /*ucTree*/ 2) itemhelper_changes.handleReviewClick = /*func*/ ctx[13];
    			if (dirty[0] & /*isReview*/ 1) itemhelper_changes.reviewMode = /*isReview*/ ctx[0];
    			itemhelper.$set(itemhelper_changes);
    			if (!window.inNative) if_block0.p(ctx, dirty);
    			if (window.inNative && window.inNative != undefined) if_block1.p(ctx, dirty);

    			if (dirty[0] & /*listItemCorrect, opened, selected, getIcon*/ 568) {
    				each_value_1 = /*listItemCorrect*/ ctx[3];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (!current || dirty[0] & /*state*/ 4 && div0_data_showcheckbox_value !== (div0_data_showcheckbox_value = /*state*/ ctx[2].showCheckbox)) {
    				attr_dev(div0, "data-showcheckbox", div0_data_showcheckbox_value);
    			}

    			if (show_if) if_block2.p(ctx, dirty);

    			if (dirty[0] & /*state, getIcon*/ 516) {
    				each_value = /*state*/ ctx[2].listItemAll;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty[0] & /*state*/ 4 && div4_data_totalcorrectans_value !== (div4_data_totalcorrectans_value = /*state*/ ctx[2].totalCorrectAns)) {
    				attr_dev(div4, "data-totalcorrectans", div4_data_totalcorrectans_value);
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
    			if (detaching) detach_dev(div5);
    			destroy_component(itemhelper);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			destroy_each(each_blocks_1, detaching);
    			if (if_block2) if_block2.d();
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(624:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (622:8) {#if state.blank}
    function create_if_block$1(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			add_location(div, file$1, 622, 12, 29481);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
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
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(622:8) {#if state.blank}",
    		ctx
    	});

    	return block;
    }

    // (635:24) {#if !window.inNative}
    function create_if_block_6(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let t0_value = /*state*/ ctx[2].headingListCorrect + "";
    	let t0;
    	let t1;
    	let div3;
    	let div2;
    	let t2_value = /*state*/ ctx[2].headingListAll + "";
    	let t2;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			div3 = element("div");
    			div2 = element("div");
    			t2 = text(t2_value);
    			attr_dev(div0, "class", "heading");
    			add_location(div0, file$1, 637, 36, 30249);
    			attr_dev(div1, "class", "span6");
    			add_location(div1, file$1, 636, 32, 30192);
    			attr_dev(div2, "class", "heading");
    			add_location(div2, file$1, 640, 36, 30433);
    			attr_dev(div3, "class", "span6");
    			add_location(div3, file$1, 639, 32, 30376);
    			attr_dev(div4, "class", "row-fluid");
    			add_location(div4, file$1, 635, 28, 30135);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div4, t1);
    			append_dev(div4, div3);
    			append_dev(div3, div2);
    			append_dev(div2, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && t0_value !== (t0_value = /*state*/ ctx[2].headingListCorrect + "")) set_data_dev(t0, t0_value);
    			if (dirty[0] & /*state*/ 4 && t2_value !== (t2_value = /*state*/ ctx[2].headingListAll + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(635:24) {#if !window.inNative}",
    		ctx
    	});

    	return block;
    }

    // (646:28) {#if (window.inNative && window.inNative != undefined)}
    function create_if_block_5(ctx) {
    	let div;
    	let t_value = /*state*/ ctx[2].headingListCorrect + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "heading");
    			add_location(div, file$1, 646, 32, 30762);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && t_value !== (t_value = /*state*/ ctx[2].headingListCorrect + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(646:28) {#if (window.inNative && window.inNative != undefined)}",
    		ctx
    	});

    	return block;
    }

    // (654:40) {#if listItemCorrect.item.length > 0}
    function create_if_block_2(ctx) {
    	let t;
    	let if_block1_anchor;
    	let if_block0 = /*listItemCorrect*/ ctx[3].isParant && create_if_block_4(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (window.inNative && window.inNative != undefined) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1();
    	let if_block1 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t = space();
    			if_block1.c();
    			if_block1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t, anchor);
    			if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*listItemCorrect*/ ctx[3].isParant) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(t.parentNode, t);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if_block1.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t);
    			if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(654:40) {#if listItemCorrect.item.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (655:44) {#if listItemCorrect.isParant}
    function create_if_block_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("selected = true;");
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
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(655:44) {#if listItemCorrect.isParant}",
    		ctx
    	});

    	return block;
    }

    // (668:44) {:else}
    function create_else_block_1(ctx) {
    	let li;
    	let t0_value = /*listItemCorrect*/ ctx[3].item + "";
    	let t0;
    	let t1;
    	let li_tid_value;
    	let li_correctans_value;
    	let li_userans_value;
    	let li_data_jstree_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "liItemIndex");
    			attr_dev(li, "tid", li_tid_value = /*listItemCorrect*/ ctx[3].ID);
    			attr_dev(li, "correctans", li_correctans_value = /*listItemCorrect*/ ctx[3].correctAns);
    			attr_dev(li, "userans", li_userans_value = /*listItemCorrect*/ ctx[3].userAns);
    			attr_dev(li, "data-jstree", li_data_jstree_value = "{\"opened\":" + /*opened*/ ctx[5] + ",\"selected\":" + /*selected*/ ctx[4] + ",\"icon\":\"" + /*getIcon*/ ctx[9](/*listItemCorrect*/ ctx[3]["level"]) + "\"}");
    			add_location(li, file$1, 668, 48, 32367);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*listItemCorrect*/ 8 && t0_value !== (t0_value = /*listItemCorrect*/ ctx[3].item + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*listItemCorrect*/ 8 && li_tid_value !== (li_tid_value = /*listItemCorrect*/ ctx[3].ID)) {
    				attr_dev(li, "tid", li_tid_value);
    			}

    			if (dirty[0] & /*listItemCorrect*/ 8 && li_correctans_value !== (li_correctans_value = /*listItemCorrect*/ ctx[3].correctAns)) {
    				attr_dev(li, "correctans", li_correctans_value);
    			}

    			if (dirty[0] & /*listItemCorrect*/ 8 && li_userans_value !== (li_userans_value = /*listItemCorrect*/ ctx[3].userAns)) {
    				attr_dev(li, "userans", li_userans_value);
    			}

    			if (dirty[0] & /*listItemCorrect*/ 8 && li_data_jstree_value !== (li_data_jstree_value = "{\"opened\":" + /*opened*/ ctx[5] + ",\"selected\":" + /*selected*/ ctx[4] + ",\"icon\":\"" + /*getIcon*/ ctx[9](/*listItemCorrect*/ ctx[3]["level"]) + "\"}")) {
    				attr_dev(li, "data-jstree", li_data_jstree_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(668:44) {:else}",
    		ctx
    	});

    	return block;
    }

    // (658:44) {#if (window.inNative && window.inNative != undefined)}
    function create_if_block_3(ctx) {
    	let li;
    	let t0_value = /*listItemCorrect*/ ctx[3].item + "";
    	let t0;
    	let t1;
    	let li_tid_value;
    	let li_correctans_value;
    	let li_userans_value;
    	let li_data_jstree_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(li, "class", "liItemIndex");
    			attr_dev(li, "tid", li_tid_value = /*listItemCorrect*/ ctx[3].ID);
    			attr_dev(li, "correctans", li_correctans_value = /*listItemCorrect*/ ctx[3].correctAns);
    			attr_dev(li, "userans", li_userans_value = /*listItemCorrect*/ ctx[3].userAns);
    			attr_dev(li, "data-jstree", li_data_jstree_value = "{\"opened\":" + /*opened*/ ctx[5] + ",\"selected\":" + /*selected*/ ctx[4] + "\"}");
    			add_location(li, file$1, 658, 48, 31619);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*listItemCorrect*/ 8 && t0_value !== (t0_value = /*listItemCorrect*/ ctx[3].item + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*listItemCorrect*/ 8 && li_tid_value !== (li_tid_value = /*listItemCorrect*/ ctx[3].ID)) {
    				attr_dev(li, "tid", li_tid_value);
    			}

    			if (dirty[0] & /*listItemCorrect*/ 8 && li_correctans_value !== (li_correctans_value = /*listItemCorrect*/ ctx[3].correctAns)) {
    				attr_dev(li, "correctans", li_correctans_value);
    			}

    			if (dirty[0] & /*listItemCorrect*/ 8 && li_userans_value !== (li_userans_value = /*listItemCorrect*/ ctx[3].userAns)) {
    				attr_dev(li, "userans", li_userans_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(658:44) {#if (window.inNative && window.inNative != undefined)}",
    		ctx
    	});

    	return block;
    }

    // (651:36) {#each listItemCorrect as listItemCorrect}
    function create_each_block_1(ctx) {
    	let t0_value = (/*opened*/ ctx[5] = "true") + "";
    	let t0;
    	let t1;
    	let t2_value = (/*selected*/ ctx[4] = false) + "";
    	let t2;
    	let t3;
    	let if_block_anchor;
    	let if_block = /*listItemCorrect*/ ctx[3].item.length > 0 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*listItemCorrect*/ ctx[3].item.length > 0) {
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
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(651:36) {#each listItemCorrect as listItemCorrect}",
    		ctx
    	});

    	return block;
    }

    // (685:28) {#if (AH.isValid(window.inNative))}
    function create_if_block_1(ctx) {
    	let div;
    	let t_value = /*state*/ ctx[2].headingListAll + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "heading");
    			attr_dev(div, "id", "headingTwo");
    			add_location(div, file$1, 685, 32, 33436);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && t_value !== (t_value = /*state*/ ctx[2].headingListAll + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(685:28) {#if (AH.isValid(window.inNative))}",
    		ctx
    	});

    	return block;
    }

    // (691:40) {#each state.listItemAll as data, i}
    function create_each_block(ctx) {
    	let li;
    	let span0;
    	let t0_value = /*data*/ ctx[34].item + "";
    	let t0;
    	let span1;
    	let t1;
    	let li_key_value;
    	let li_tid_value;
    	let li_seq_value;
    	let li_multi_value;
    	let li_data_jstree_value;

    	const block = {
    		c: function create() {
    			li = element("li");
    			span0 = element("span");
    			t0 = text(t0_value);
    			span1 = element("span");
    			t1 = space();
    			attr_dev(span0, "class", "data_style");
    			add_location(span0, file$1, 699, 48, 34475);
    			attr_dev(span1, "class", "delete_button");
    			add_location(span1, file$1, 699, 91, 34518);
    			attr_dev(li, "key", li_key_value = /*i*/ ctx[36]);
    			attr_dev(li, "class", "liItemIndex");
    			attr_dev(li, "tid", li_tid_value = /*data*/ ctx[34].ID);
    			attr_dev(li, "seq", li_seq_value = /*data*/ ctx[34].isParant.toString().replace(/,\s|{|}/gmi, ""));
    			attr_dev(li, "multi", li_multi_value = /*data*/ ctx[34].multi);
    			attr_dev(li, "data-jstree", li_data_jstree_value = "{\"icon\":\"" + /*getIcon*/ ctx[9](/*data*/ ctx[34].level) + "\"}");
    			add_location(li, file$1, 691, 44, 33901);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, span0);
    			append_dev(span0, t0);
    			append_dev(li, span1);
    			append_dev(li, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*state*/ 4 && t0_value !== (t0_value = /*data*/ ctx[34].item + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*state*/ 4 && li_tid_value !== (li_tid_value = /*data*/ ctx[34].ID)) {
    				attr_dev(li, "tid", li_tid_value);
    			}

    			if (dirty[0] & /*state*/ 4 && li_seq_value !== (li_seq_value = /*data*/ ctx[34].isParant.toString().replace(/,\s|{|}/gmi, ""))) {
    				attr_dev(li, "seq", li_seq_value);
    			}

    			if (dirty[0] & /*state*/ 4 && li_multi_value !== (li_multi_value = /*data*/ ctx[34].multi)) {
    				attr_dev(li, "multi", li_multi_value);
    			}

    			if (dirty[0] & /*state*/ 4 && li_data_jstree_value !== (li_data_jstree_value = "{\"icon\":\"" + /*getIcon*/ ctx[9](/*data*/ ctx[34].level) + "\"}")) {
    				attr_dev(li, "data-jstree", li_data_jstree_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(691:40) {#each state.listItemAll as data, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let link0;
    	let link0_href_value;
    	let link1;
    	let link1_href_value;
    	let t;
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*state*/ ctx[2].blank) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			link0 = element("link");
    			link1 = element("link");
    			t = space();
    			main = element("main");
    			if_block.c();
    			attr_dev(link0, "rel", "stylesheet");
    			attr_dev(link0, "href", link0_href_value = "" + (themeUrl + "pe-items/svelte/clsSMTree/libs/treeview.min.css"));
    			add_location(link0, file$1, 617, 8, 29220);
    			attr_dev(link1, "rel", "stylesheet");
    			attr_dev(link1, "href", link1_href_value = editor.baseUrlTheme + "prepengine/jstree/style.min.css");
    			add_location(link1, file$1, 618, 8, 29320);
    			add_location(main, file$1, 620, 4, 29434);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document_1.head, link0);
    			append_dev(document_1.head, link1);
    			insert_dev(target, t, anchor);
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
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
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
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
    			detach_dev(link0);
    			detach_dev(link1);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(main);
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

    function countInArray(item, array) {
    	let count = 0;

    	for (let index_no = 0; index_no < array.length; ++index_no) {
    		if (array[index_no] == item.replace(/\s/g, "")) {
    			count += 1;
    		}
    	}

    	return count;
    }

    // returns the length of # in perticular string
    function getLevel(str) {
    	var level = str.match(/#/gmi);

    	if (level) {
    		return level.length;
    	}

    	return 0;
    }

    // Suffles the draggable elements on draggable container
    function shuffle(aelement) {
    	for (let i = aelement.length; i; i--) {
    		let j = Math.floor(Math.random() * i);
    		[aelement[i - 1], aelement[j]] = [aelement[j], aelement[i - 1]];
    	}

    	return aelement;
    }

    // Returns 1 or 0 to indicate that it is draggable or not 1 for true and 0 for false
    function getDragable(str) {
    	if (str.substr(0, 1) == "[" && str.substr(str.length - 1) == "]") {
    		return 1;
    	}

    	return 0;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("TreeViewPreview", slots, []);
    	let { isReview } = $$props;
    	let { xml } = $$props;
    	let { uaxml } = $$props;
    	let { editorState = false } = $$props;
    	let selected;
    	let opened;
    	let remedStatus;
    	let booleanDelete = true;
    	let treeid = "treemain0", listItemCorrect = [], listItemAll = [];

    	const icons = [
    		"database-icon",
    		"table-icon",
    		"file-icon",
    		"file-icon",
    		"icomoon-new-24px-delete-1"
    	];

    	//let calcNodes 
    	//let countInArray 
    	let message = "";

    	let jsRef;
    	let parsedXml = {};

    	let state = {
    		xml: "",
    		blank: false,
    		remediationToggle: false,
    		showCheckbox: 0,
    		headingListCorrect: "",
    		headingListAll: "",
    		sort: "",
    		options: "",
    		parsedOptions: "",
    		totalCorrectAns: 0,
    		listItemAll: [],
    		treeNodes: [],
    		icons: "database-icon,table-icon,file-icon"
    	};

    	// Built-in method of react lifecycle and called just afetr render method once throughtout the program execution  
    	onMount(async () => {
    		//console.log({"abc":editor.baseUrlTheme});
    		// used to initialized tree plugin and bind some required events that needed
    		setTimeout(
    			function () {
    				ucTree.readyThis("#" + treeid, state.parsedOptions);

    				// Forces to re-render the component
    				calcNodes(parsedXml.smxml.tree.__cdata);
    			},
    			1000
    		);

    		// jsRef = new jsTree({}, document.getElementById('treemain0'));
    		// instance.empty().create(dummy(2, 10)).openAll();
    		if (typeof inNative != "undefined") {
    			// Used in Native for cut and copy functionality
    			cutAndCopyFunctionality();

    			// Used in Native for delete and paste functionality		
    			deleteAndPasteFunctionality();

    			// Used in Native for delete functionality
    			deleteFunctionality();
    		}

    		AH.listen("body", "keydown", ".jstree-clicked", (_this, event) => {
    			if (event.which === 13) {
    				// Used for cut and copy the draggable element when it is performed via keyboard
    				cutAndCopyFunctionality();
    			}
    		});

    		AH.listen(document, "keydown", ".vakata-context-hover", (_this, event) => {
    			if (event.which == 13 || event.keyCode == 13) {
    				// clicked the selected option of the contextmenu
    				AH.trigger(AH.find(_this, "a"), "click");

    				setTimeout(
    					function () {
    						let firstRow = AH.selectAll("#treemain0 .treeall .jstree-container-ul li")[0].querySelector("a");

    						if (firstRow) {
    							// used for focus the first row of the droppable area
    							firstRow.classList.add("jstree-hovered");

    							firstRow.focus();
    						}
    					},
    					200
    				);
    			}
    		});

    		AH.listen("body", "keydown", ".jstree-clicked", e => {
    			if (e.which === 13) {
    				//Used for delete and paste the draggable element when it is performed via keyboard
    				deleteAndPasteFunctionality();
    			}
    		});

    		AH.listen("body", "keyup", ".treeall", (_this, event) => {
    			if (event.which == 13 || event.keyCode == 13) {
    				// removes the class 'jstree-wholerow-clicked' that indicates selected row on Draggable area
    				AH.find(".treecorrect", ".jstree-wholerow-clicked").classList.remove("jstree-wholerow-clicked");

    				// removes the class 'jstree-clicked' that indicates selected Draggable element
    				AH.find(".treecorrect", ".jstree-clicked").classList.remove("jstree-clicked");
    			}
    		});

    		AH.listen("body", "keydown", ".treeall", (_this, event) => {
    			if (event.which == 9 || event.keyCode == 9) {
    				// used for remove the visibily of selection from draggable element on droppable area when 'tab' key pressed on droppable area
    				AH.trigger(AH.find(".treeall", ".jstree-clicked"), "click");

    				// removes the class 'jstree-wholerow-clicked' and 'jstree-wholerow-hovered' that indicates selected row on Draggable area that was previously selected
    				AH.selectAll(".treecorrect .jstree-wholerow-clicked", "removeClass", ["jstree-wholerow-clicked", "jstree-wholerow-hovered"]);

    				// removes the class 'jstree-clicked' and 'jstree-hovered' from draggable element that was previously selected and set the value 'false' of attribute 'aria-selected' of priviously selected row on draggable area
    				AH.find(".treecorrect", "[aria-selected=\"true\"]").setAttribute("aria-selected", false);

    				AH.removeClass(AH.find(".treecorrect", "[aria-selected=\"true\"]").querySelector(".jstree-clicked"), "jstree-clicked jstree-hovered");

    				// used for focus the first draggable element on draggable area using 'tab' key
    				AH.trigger(AH.selectAll(".treecorrect li[role=\"treeitem\"]", "visible")[0].querySelector(".jstree-anchor"), "click").focus();

    				// removes the class 'jstree-wholerow-clicked' and add class 'jstree-wholerow-hovered' to the first row on Draggable area
    				AH.find(AH.selectAll(".treecorrect li[role=\"treeitem\"]", "visible")[0], "div", {
    					action: "addClass",
    					actionData: "jstree-wholerow-hovered"
    				}).classList.remove("jstree-wholerow-clicked");

    				// removes the class 'jstree-clicked' and add class 'jstree-hovered' from the first row of draggable element on draggable area
    				AH.find(AH.selectAll(".treecorrect li[role=\"treeitem\"]", "visible")[0], ".jstree-anchor", {
    					action: "addClass",
    					actionData: "jstree-hovered"
    				});

    				AH.find(AH.selectAll(".treecorrect li[role=\"treeitem\"]", "visible")[0], ".jstree-anchor", {
    					action: "removeClass",
    					actionData: "jstree-clicked"
    				}).focus();

    				// prevents the event from being bubbled
    				event.preventDefault();
    			}
    		});

    		AH.listen("body", "keydown", ".treecorrect", (_this, event) => {
    			if (event.shiftKey && (event.which == 9 || event.keyCode == 9)) {
    				// used for focus the first row on droppable area when 'shift' + 'tab' key pressed on draggable area
    				AH.find(AH.selectAll("#treemain0 .treeall .jstree-container-ul li")[0], "a", {
    					action: "addClass",
    					actionData: "jstree-hovered"
    				}).focus();

    				// prevents the event from being bubbled
    				event.preventDefault();
    			}
    		});

    		AH.listen("body", "keydown", ".treeall .jstree-clicked", (_this, event) => {
    			if (event.ctrlKey && event.altKey && (event.which == 68 || event.keyCode == 68)) {
    				//Used for open the contextmenu when 'ctrl' + 'alt' + 'd' key pressed
    				AH.trigger(_this, "contextmenu");
    			}
    		});

    		// Used for add the active class on Currect Aswer or Your Answer button which is currently clicked
    		// AH.sel('#sm_controller button').click(function () {
    		//     jQuery('#sm_controller button').removeClass("active");
    		//     jQuery(this).addClass('active');
    		// });
    		AH.setCss(".liItemIndex", { "font-size": "14px !important" });

    		// used for mobile team
    		if (window.inNative && window.inNative != undefined) {
    			var pre_timer4 = setTimeout(
    				function () {
    					window.postMessage(`height___${AI.select("#treemain0").clientHeight}`, "*"); // increases the height of react native outer container
    					clearTimeout(pre_timer4);
    				},
    				2000
    			);
    		}
    	});

    	// Used to unmount the component, this is build in lifecycle method of react
    	onDestroy(() => {
    		($$invalidate(3, listItemCorrect = []), listItemAll = []);
    		AH.select(".reactStyle").remove();
    	});

    	// Called when props or state gets change
    	beforeUpdate(() => {
    		if (window.inNative && window.inNative != undefined) {
    			var pre_timer6 = setTimeout(
    				function () {
    					window.postMessage(`height___${AH.select("#treemain0").clientHeight}`, "*"); // increases the height of react native outer container
    					clearTimeout(pre_timer6);
    				},
    				500
    			);
    		}

    		// Checks that current props and previous props are same or not if not the render the component otherwise remains in idle state
    		if (xml != state.xml) {
    			$$invalidate(2, state.blank = true, state);
    			($$invalidate(3, listItemCorrect = []), listItemAll = []);
    			$$invalidate(2, state.blank = false, state);
    			$$invalidate(2, state.xml = xml, state);

    			// For loading the module according to change the value of props 
    			loadModule(xml, uaxml);
    		}
    	}); // Works in case of remedStatus changed of nextProps
    	// if (xml) {
    	//     if (isReview) {
    	//         // calls the setReview method

    	//         setReview();
    	//     } else {
    	//         // calls the unsetReview method
    	//         //unsetReview();
    	//     }
    	// }
    	afterUpdate(() => {
    		if (isReview) {
    			try {
    				var timer = setTimeout(
    					function () {
    						if (AI.find("#" + treeid, ".treeall")) {
    							ucTree.treeInit("#" + treeid, state.parsedOptions);

    							// Shows correct or incorrect according to the return value of ucTree.checkAns() method
    							let result = ucTree.checkAns("#" + treeid);

    							onUserAnsChange(result);
    							result && ucTree.showAns(result.ans);

    							// shows the button of currect answer and your answer and check the answer and shows and does not allow the user to perform the task
    							ucTree.modeOn("on");
    						}

    						clearTimeout(timer);
    					},
    					900
    				);
    			} catch(error) {
    				console.log({ error });
    			}
    		} else {
    			// used to initialized tree plugin and bind some required events that needed
    			ucTree.readyThis("#" + treeid, state.parsedOptions);

    			// hides the button of currect answer and your answer and allow the user to perform the task
    			ucTree.modeOn();
    		}
    	});

    	// For cut and copy the Draggable element
    	function cutAndCopyFunctionality() {
    		AH.listenAll(".treecorrect li", "touchend, keydown", event => {
    			handleCut(event);
    		});

    		if (window.inNative && window.inNative != undefined) {
    			window.getHeight && window.getHeight();
    		}
    	}

    	// For delete the draggable element from droppable area and paste the Draggable element on draggable container
    	function deleteAndPasteFunctionality() {
    		AH.listenAll(".treeall li", "touchstart", () => {
    			cmTime.s = new Date().getTime();
    		});

    		AH.selectAll(".treeall li", "touchend, click", event => {
    			handlePaste(event, deleteAndPasteFunctionality);
    		});

    		AH.listenAll(".delete_button", "touchend, keydown", event => {
    			if (booleanDelete) {
    				// used for delete the draggable element from Droppable area to paste in Draggable area
    				ucTree.handleDelete(event, deleteAndPasteFunctionality);
    			}
    		});

    		if (window.inNative && window.inNative != undefined) {
    			window.getHeight && window.getHeight();
    		}
    	}

    	// It calls copyNode method if review mode is off and value of booleanDelete variable is true
    	function handleCut(evt) {
    		if (!window.reviewMode && booleanDelete) {
    			// Used to copy the draggable element
    			ucTree.copyNode(evt);

    			booleanDelete = false;
    		}
    	}

    	// It calls pasteNode method if review mode is off and value of booleanDelete variable is false
    	function handlePaste(evt, handleDeleteCallback) {
    		if (!window.reviewMode && !booleanDelete) {
    			// Used to pase the Draggable element on Droppable area
    			ucTree.pasteNode(evt, handleDeleteCallback);

    			booleanDelete = true;
    		}

    		if (window.inNative && window.inNative != undefined) {
    			window.getHeight && window.getHeight();
    		}
    	}

    	// Used to disabled the activity to be performed when it is in review mode 
    	function setReview() {
    		$$invalidate(1, ucTree.tempVar = "c", ucTree);
    		$$invalidate(0, isReview = true);

    		// shows the button of currect answer and your answer and check the answer and shows and does not allow the user to perform the task
    		ucTree.modeOn("on");
    	} // jQuery('#sm_controller button').removeClass("active");
    	// jQuery('#sm_controller .your-ans').addClass("active");

    	// Used to enabled the activity to be performed when it is not in review mode
    	function unsetReview() {
    		$$invalidate(1, ucTree.tempVar = "u", ucTree);
    		$$invalidate(0, isReview = false);

    		// hides the button of currect answer and your answer and allow the user to perform the task
    		ucTree.modeOn();

    		// Used for mobile native team
    		if (typeof inNative != "undefined") {
    			cutAndCopyFunctionality();
    			deleteAndPasteFunctionality();
    		}
    	}

    	// For loading the module according to change in props it calls parseXml method after converting the xml into json and passes into parseXml method in the form of argument
    	function loadModule(loadXml, uaXML) {
    		loadXml = XMLToJSON(loadXml);
    		parseXml(loadXml, uaXML);
    	}

    	// Used for parse the xml and assign the data into variables and states so according to these values UI changed
    	function parseXml(QXML, userXML) {
    		parsedXml = QXML;

    		if (QXML.smxml.list) {
    			QXML.smxml.tree = QXML.smxml.list;
    		}

    		QXML.smxml.tree._headingCorrect
    		? $$invalidate(2, state.headingListCorrect = QXML.smxml.tree._headingCorrect, state)
    		: "";

    		QXML.smxml.tree._headingAll
    		? $$invalidate(2, state.headingListAll = QXML.smxml.tree._headingAll, state)
    		: "";

    		QXML.smxml.tree._headingcorrect
    		? $$invalidate(2, state.headingListCorrect = QXML.smxml.tree._headingcorrect, state)
    		: "";

    		QXML.smxml.tree._headingall
    		? $$invalidate(2, state.headingListAll = QXML.smxml.tree._headingall, state)
    		: "";

    		QXML.smxml.tree._sort
    		? $$invalidate(2, state.sort = QXML.smxml.tree._sort, state)
    		: "";

    		QXML.smxml.tree._options
    		? $$invalidate(2, state.options = QXML.smxml.tree._options, state)
    		: "";

    		// parses the options state value
    		parseOptions(state.options);

    		var listItem = QXML.smxml.tree.__cdata.trim().replace(/\t/gmi, "");
    		listItem = listItem.split(/\n/gmi);

    		// for set the data to draggable and non dragable elements
    		setItemValueAll(listItem, userXML);
    	}

    	// assign the draggable elements label text to treeData state
    	function calcNodes(treeData) {
    		// replaces the non Draggable elements and # and data between curly braces including curly brace from draggable elements and last closing square bracket from cdata
    		let countData = treeData.replace(/#{1,2}\w.*|\s|###\[/g, "").replace(/\[|\{.*?\}/g, "").replace(/\]$/g, "");

    		// split with ']' retruns each draggable element's label text in an array
    		countData = countData.split("]");

    		// sorts the draggable element's label text in assending order
    		countData.sort();

    		// assign the draggable element's label text into treeData state
    		$$invalidate(2, state.treeData = countData, state);

    		// calls delNodes
    		delNodes();
    	}

    	// used to add or remove the 'h-imp' class from Draggable element
    	function delNodes() {
    		// contains all draggable elements that are dragged
    		let allAssignedNodes = document.querySelector(".treeall").querySelectorAll("li[aria-level=\"2\"]");

    		// contains all draggable elements
    		let allPresentNodes = document.querySelector(".treecorrect").querySelectorAll("li");

    		for (let e of allPresentNodes) {
    			// text of label of Draggable element
    			let leafItem = e.querySelector("span").innerText;

    			let leafCount = 0;

    			for (let n of allAssignedNodes) {
    				// checks if leafItem is equals to dragged elements label text then increase the leafCount value by 1
    				if (n.querySelector("span").innerText == leafItem) {
    					++leafCount;
    				}

    				// checks if Dragged element exist in Draggable elements array then assign the value to 1 otherwise 0 is applied
    				let valInArray = countInArray(leafItem, state.treeData);

    				// If leafCount equals to valInArray and valInArray is greater than 0 then adds 'h-imp' class to draggable elements in case of web not in mobile
    				if (leafCount == valInArray && valInArray > 0) {
    					if (window.inNative && window.inNative != undefined) {
    						e.style.display = "none";
    					} else {
    						// adds h-imp class to draggable element
    						e.className += " h-imp";
    					}
    				} else {
    					if (window.inNative && window.inNative != undefined) {
    						e.style.display = "block";
    					} else {
    						// removes the 'h-imp' class from draggable element	
    						e.className = e.className.replace(/h-imp/g, "");
    					}
    				}
    			}
    		}
    	}

    	// for set the data to draggable and non dragable elements
    	function setItemValueAll(listItem, userXML) {
    		let userDiv;
    		let useransArray = [];

    		if (userXML) {
    			// assign the userXML json data to userXML variable
    			userXML = XMLToJSON(userXML);
    		}

    		if (userXML) {
    			if (userXML.smans) {
    				if (userXML.smans.div) {
    					// assign the userXML.smans.div json data to userDiv variable
    					userDiv = userXML.smans.div;

    					if (Array.isArray(userDiv)) {
    						for (let i = 0; i < userDiv.length; i++) {
    							// assign the 'userDiv[i]._uans' in useransArray at index 'userDiv[i]._id' 
    							useransArray[userDiv[i]._id] = userDiv[i]._uans;
    						}
    					} else {
    						// assign the 'userDiv._uans' in useransArray at index 'userDiv[i]._id'
    						useransArray[userDiv._id] = userDiv._uans;
    					}
    				}
    			}
    		}

    		var ID = 0, cans = "", countCorrect = 0;
    		var parentId = [-1, 0];

    		for (var i = 0; i < listItem.length; i++) {
    			listItem[i] = listItem[i].trim();

    			// assign the numeric data returned by getLevel method
    			var level = getLevel(listItem[i]);

    			listItem[i] = listItem[i].replace(/#/g, "");

    			// assign the numeric data returned by getDragable method
    			var isDragable = getDragable(listItem[i]);

    			listItem[i] = listItem[i].replace(/\[|\]/g, "");

    			// assign the numeric data returned by getParant method
    			var isParant = getParant(listItem[i]);

    			// replaces the starting data exists in {} including brackets or starting '*' character with blank
    			listItem[i] = listItem[i].toString().trim().replace(/^{(.*?)}|^\*/gmi, "");

    			if (isDragable) {
    				// checks if any elements exist where draggable element can be drop
    				if (listItemCorrect[ID - 1]) {
    					if (listItemCorrect[ID - 1]["level"] > 0 && listItemCorrect[ID - 1]["item"].length > 0) {
    						// assign the label value
    						level = listItemCorrect[ID - 1]["level"] + 1;
    					}
    				}

    				var oid = setOptions(listItem[i], 100 + i, level, isParant, ID - 1);

    				if (isParant) {
    					cans = cans + isParant + oid + ",";
    				} else {
    					cans = cans + oid + ",";
    				}

    				if (listItemCorrect[ID - 1]) {
    					if (listItemCorrect[ID - 1]["level"] > 0 && listItemCorrect[ID - 1]["item"].length > 0) {
    						// assign the correctAns value of non draggable element exist at index 'ID-1'
    						$$invalidate(3, listItemCorrect[ID - 1]["correctAns"] = cans, listItemCorrect);
    					}
    				}

    				// increases the countCorrect value
    				countCorrect++;
    			} else {
    				if (level > 0) {
    					cans = "";
    					$$invalidate(3, listItemCorrect[ID] = [], listItemCorrect);
    					$$invalidate(3, listItemCorrect[ID]["ID"] = ID, listItemCorrect);
    					$$invalidate(3, listItemCorrect[ID]["item"] = listItem[i], listItemCorrect);
    					$$invalidate(3, listItemCorrect[ID]["level"] = level, listItemCorrect);
    					$$invalidate(3, listItemCorrect[ID]["parentId"] = parentId[level - 1], listItemCorrect);
    					$$invalidate(3, listItemCorrect[ID]["isParant"] = isParant, listItemCorrect);

    					if (useransArray[ID]) {
    						// assign the 'useransArray[ID]' data in "listItemCorrect[ID]['userAns']"
    						$$invalidate(3, listItemCorrect[ID]["userAns"] = useransArray[ID], listItemCorrect);
    					}

    					// assign the value of 'ID' in parentId array have key 'level'
    					parentId["level"] = ID;

    					// increases the ID value
    					ID++;
    				}
    			}
    		}

    		// assign the total correct answer in 'totalCorrectAns' variable
    		$$invalidate(2, state.totalCorrectAns = countCorrect, state);

    		if (state.sort == 1) {
    			// Sort the available Draggable element
    			multi_array_sort();
    		} else {
    			// asign the draggable elements after suffle it
    			listItemAll = shuffle(listItemAll);
    		}

    		$$invalidate(2, state.listItemAll = listItemAll, state);
    	}

    	// parses the options attributes values
    	function parseOptions(options) {
    		if (window.inNative && window.inNative != undefined) return;

    		// checks if contextmenu list options are given then split it with comma (,)
    		options = options ? options.split(",") : "";

    		let json = {};

    		if (options) {
    			for (let index_no in options) {
    				// split the option with '|'
    				let v = options[index_no].trim().split("|");

    				let tmp = [];

    				// if v.length is 3 then assigns data in temporary array
    				if (v.length == 3) {
    					tmp["seq"] = v[0];
    					tmp["label"] = v[1];
    					tmp["icon"] = v[2];
    					tmp["action"] = "contextAction";
    				}

    				// temporary array converts into object and assign it to contextmenu list json
    				json["opt" + index_no] = AH.extend({}, tmp);
    			}
    		}

    		// sets Default label at the second last position of contextmenu list
    		json["opt" + Object.keys(json).length] = {
    			"seq": 0,
    			"label": "Default",
    			"icon": icons[2],
    			"action": "contextAction"
    		};

    		// sets Delete label at the end of contextmenu list
    		json["opt" + Object.keys(json).length] = {
    			"label": "Delete",
    			"icon": icons[4],
    			"action": "deleteList"
    		};

    		// Parses the Json data into string using JSON.stringify() method and then parses string into JSON format using JSON.parse() method
    		var jsonData = JSON.parse(JSON.stringify(json));

    		Object.values(jsonData).forEach(item => {
    			if (item.action == "contextAction") {
    				item.action = ucTree.contextAction;
    			} else if (item.action == "deleteList") {
    				item.action = ucTree.deleteList;
    			}
    		});

    		$$invalidate(2, state.parsedOptions = jsonData, state);
    	}

    	// Sort the available Draggable element
    	function multi_array_sort() {
    		listItemAll.sort(function (a, b) {
    			if (a.item === b.item) {
    				return b.ID - a.ID;
    			} else if (a.item > b.item) {
    				return 1;
    			} else if (a.item < b.item) {
    				return -1;
    			}
    		});
    	}

    	// returns the icon from icons array for contextmenu
    	function getIcon(level) {
    		if (level == 0) {
    			level = 4;
    		}

    		return icons[level - 1];
    	}

    	// returns 0, * or data between curly brace including both opening and closing such as {2}. If return value is not equals to 0 then parent and all its children have same icon
    	function getParant(str) {
    		str = str.trim();
    		var parant = 0;

    		if (str.substr(0, 1) == "*") {
    			$$invalidate(2, state.showCheckbox = 1, state);
    			parant = "*";
    		} else if (str.substr(0, 1) == "{" && str.substr(2, 1) == "}") {
    			parant = str.substr(0, 3);
    		}

    		return parant;
    	}

    	// returns the numeric data according to matching the data of passed arguments when called it with the data of array 'listItemAll' have index 'i' of key 'item'
    	function setOptions(optionName, ID, level, isParant, pID) {
    		var totalItem = listItemAll.length;

    		for (var i = 0; i < totalItem; i++) {
    			if (listItemAll[i]["isParant"] == "{1}") {
    				// set not to drag draggable element multiple time for creating the tree below droppable container
    				listItemAll[i]["multi"] = 0;
    			} else {
    				// set to drag draggable element multiple time for creating the tree below droppable container
    				listItemAll[i]["multi"] = 1;
    			}

    			if (listItemAll[i]["item"].length > 0 && listItemAll[i]["item"].toLowerCase() == optionName.toLowerCase()) {
    				if (listItemAll[i]["isParant"].toString().indexOf("|") === false) {
    					// sets the value of isParant key of listItemAll[i] array
    					listItemAll[i]["isParant"] = listItemAll[i]["isParant"] + "|" + listItemAll[i]["pID"];
    				}

    				// sets the value of isParant key of listItemAll[i] array
    				listItemAll[i]["isParant"] = listItemAll[i]["isParant"] + "," + isParant + "|" + pID;

    				// returns value of listItemAll[i]['ID']
    				return listItemAll[i]["ID"];
    			}
    		}

    		// create a variable with index length of array listItemAll and assign the data to it
    		listItemAll[totalItem] = [];

    		listItemAll[totalItem]["item"] = optionName;
    		listItemAll[totalItem]["ID"] = ID;
    		listItemAll[totalItem]["level"] = level;
    		listItemAll[totalItem]["pID"] = pID;
    		listItemAll[totalItem]["isParant"] = isParant;
    		return ID;
    	}

    	const writable_props = ["isReview", "xml", "uaxml", "editorState"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<TreeViewPreview> was created with unknown prop '${key}'`);
    	});

    	const func = mode => ucTree.showans("#treemain0", mode);

    	$$self.$$set = $$props => {
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("xml" in $$props) $$invalidate(10, xml = $$props.xml);
    		if ("uaxml" in $$props) $$invalidate(11, uaxml = $$props.uaxml);
    		if ("editorState" in $$props) $$invalidate(12, editorState = $$props.editorState);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		onDestroy,
    		beforeUpdate,
    		afterUpdate,
    		ucTree,
    		AH,
    		XMLToJSON,
    		onUserAnsChange,
    		ItemHelper,
    		isReview,
    		xml,
    		uaxml,
    		editorState,
    		selected,
    		opened,
    		remedStatus,
    		booleanDelete,
    		treeid,
    		listItemCorrect,
    		listItemAll,
    		icons,
    		message,
    		jsRef,
    		parsedXml,
    		state,
    		cutAndCopyFunctionality,
    		deleteAndPasteFunctionality,
    		handleCut,
    		handlePaste,
    		setReview,
    		unsetReview,
    		loadModule,
    		parseXml,
    		calcNodes,
    		delNodes,
    		countInArray,
    		setItemValueAll,
    		parseOptions,
    		multi_array_sort,
    		getIcon,
    		getLevel,
    		shuffle,
    		getDragable,
    		getParant,
    		setOptions
    	});

    	$$self.$inject_state = $$props => {
    		if ("isReview" in $$props) $$invalidate(0, isReview = $$props.isReview);
    		if ("xml" in $$props) $$invalidate(10, xml = $$props.xml);
    		if ("uaxml" in $$props) $$invalidate(11, uaxml = $$props.uaxml);
    		if ("editorState" in $$props) $$invalidate(12, editorState = $$props.editorState);
    		if ("selected" in $$props) $$invalidate(4, selected = $$props.selected);
    		if ("opened" in $$props) $$invalidate(5, opened = $$props.opened);
    		if ("remedStatus" in $$props) remedStatus = $$props.remedStatus;
    		if ("booleanDelete" in $$props) booleanDelete = $$props.booleanDelete;
    		if ("treeid" in $$props) treeid = $$props.treeid;
    		if ("listItemCorrect" in $$props) $$invalidate(3, listItemCorrect = $$props.listItemCorrect);
    		if ("listItemAll" in $$props) listItemAll = $$props.listItemAll;
    		if ("message" in $$props) message = $$props.message;
    		if ("jsRef" in $$props) jsRef = $$props.jsRef;
    		if ("parsedXml" in $$props) parsedXml = $$props.parsedXml;
    		if ("state" in $$props) $$invalidate(2, state = $$props.state);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		isReview,
    		ucTree,
    		state,
    		listItemCorrect,
    		selected,
    		opened,
    		setReview,
    		unsetReview,
    		delNodes,
    		getIcon,
    		xml,
    		uaxml,
    		editorState,
    		func
    	];
    }

    class TreeViewPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$1,
    			create_fragment$1,
    			safe_not_equal,
    			{
    				isReview: 0,
    				xml: 10,
    				uaxml: 11,
    				editorState: 12
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TreeViewPreview",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*isReview*/ ctx[0] === undefined && !("isReview" in props)) {
    			console_1.warn("<TreeViewPreview> was created without expected prop 'isReview'");
    		}

    		if (/*xml*/ ctx[10] === undefined && !("xml" in props)) {
    			console_1.warn("<TreeViewPreview> was created without expected prop 'xml'");
    		}

    		if (/*uaxml*/ ctx[11] === undefined && !("uaxml" in props)) {
    			console_1.warn("<TreeViewPreview> was created without expected prop 'uaxml'");
    		}
    	}

    	get isReview() {
    		throw new Error("<TreeViewPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isReview(value) {
    		throw new Error("<TreeViewPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xml() {
    		throw new Error("<TreeViewPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xml(value) {
    		throw new Error("<TreeViewPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get uaxml() {
    		throw new Error("<TreeViewPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set uaxml(value) {
    		throw new Error("<TreeViewPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editorState() {
    		throw new Error("<TreeViewPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editorState(value) {
    		throw new Error("<TreeViewPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const defXMl = `<SMXML type="7" name="TreeView"><tree headingCorrect="Permission Types" headingAll="Permissions" allowSort="0" allowMulti="1"><![CDATA[#Permissions\n##Standard NTFS folder permissons\n###[Read]\n###[Write]\n###[List Folder Contents]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard NTFS file permissions\n###[Read]\n###[Write]\n###[Read & Execute]\n###[Modify]\n###[Full Control]\n##Standard shared folder permission\n###[Read]\n###[Change]\n###[Full Control]\n ]]></tree></SMXML>`;

    const app = new TreeViewPreview({
    	target: document.getElementById(window.moduleContainer) || document.body,
    	props: {
    		xml: window.QXML || defXMl,
    		uaxml: window.uaXML,
    		ansStatus: 0,
    		isReview: window.isReviewMode || false,
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle_q7.js.map
