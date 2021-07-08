
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { a8 as createCommonjsModule, a9 as commonjsGlobal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, O as Dialog, P as binding_callbacks, Q as bind, v as validate_slots, L as beforeUpdate, o as onMount, A as AH, _ as onUserAnsChange, a7 as afterUpdate, U as Button, aa as Loader, w as writable, y as language, j as attr_dev, k as add_location, n as insert_dev, x as detach_dev, f as space, c as create_component, m as mount_component, q as listen_dev, W as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, l as set_style, B as noop, h as text, G as prop_dev, F as set_data_dev, V as Checkbox, Z as tick, r as group_outros, u as check_outros } from './main-32dbc3f7.js';
import { s as styleInject } from './style-inject.es-1c867377.js';
import './codemirror-76151d00.js';
import './codemirror.min-41ad232c.js';
import './simplescrollbars-c1002091.js';

var css_248z = ".splitter_panel {\r\n  position: relative;\r\n}\r\n.splitter_panel .vsplitter {\r\n    background-color: grey;\r\n    cursor: col-resize;\r\n    z-index: 10;\r\n    width: 7px;\r\n}\r\n\r\n.splitter_panel .hsplitter {\r\n    background-color: #5F5F5F;\r\n    cursor: row-resize;\r\n    z-index: 98;\r\n    height: 7px;\r\n}\r\n.splitter_panel .vsplitter.splitter-invisible,\r\n.splitter_panel .hsplitter.splitter-invisible {\r\n    background: none;\r\n}\r\n.splitter_panel .vsplitter, .splitter_panel .left_panel, .splitter_panel .right_panel,\r\n.splitter_panel .hsplitter, .splitter_panel .top_panel, .splitter_panel .bottom_panel {\r\n    position: absolute;\r\n    overflow: auto;\r\n}\r\n.splitter_panel .vsplitter, .splitter_panel .left_panel, .splitter_panel .right_panel {\r\n  height: 100%;\r\n}\r\n.splitter_panel .hsplitter, .splitter_panel .top_panel, .splitter_panel .bottom_panel {\r\n  width: 100%;\r\n}\r\n.splitter_panel .top_panel, .splitter_panel .left_panel, .splitter_panel .vsplitter {\r\n   top: 0;\r\n}\r\n.splitter_panel .top_panel, .splitter_panel .bottom_panel, .splitter_panel .left_panel, .splitter_panel .hsplitter {\r\n   left: 0;\r\n}\r\n.splitter_panel .bottom_panel {\r\n   bottom: 0;\r\n}\r\n.splitter_panel .right_panel {\r\n   right: 0;\r\n}\r\n.splitterMask {\r\n  position: absolute;\r\n  left: 0;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  z-index: 1000;\r\n}";
styleInject(css_248z);

/*! Split.js - v1.6.0 */

var split = createCommonjsModule(function (module, exports) {
!(function (e, t) {
     (module.exports = t()) ;
})(commonjsGlobal, function () {
    var e = "undefined" != typeof window ? window : null,
        t = null === e,
        n = t ? void 0 : e.document,
        i = function () {
            return !1;
        },
        r = t
            ? "calc"
            : ["", "-webkit-", "-moz-", "-o-"]
                  .filter(function (e) {
                      var t = n.createElement("div");
                      return (t.style.cssText = "width:" + e + "calc(9px)"), !!t.style.length;
                  })
                  .shift() + "calc",
        s = function (e) {
            return "string" == typeof e || e instanceof String;
        },
        o = function (e) {
            if (s(e)) {
                var t = n.querySelector(e);
                if (!t) throw new Error("Selector " + e + " did not match a DOM element");
                return t;
            }
            return e;
        },
        a = function (e, t, n) {
            var i = e[t];
            return void 0 !== i ? i : n;
        },
        u = function (e, t, n, i) {
            if (t) {
                if ("end" === i) return 0;
                if ("center" === i) return e / 2;
            } else if (n) {
                if ("start" === i) return 0;
                if ("center" === i) return e / 2;
            }
            return e;
        },
        l = function (e, t) {
            var i = n.createElement("div");
            return (i.className = "gutter gutter-" + t), i;
        },
        c = function (e, t, n) {
            var i = {};
            return s(t) ? (i[e] = t) : (i[e] = r + "(" + t + "% - " + n + "px)"), i;
        },
        h = function (e, t) {
            var n;
            return ((n = {})[e] = t + "px"), n;
        };
    return function (r, s) {
        if ((void 0 === s && (s = {}), t)) return {};
        var d,
            f,
            v,
            m,
            g,
            p,
            y = r;
        Array.from && (y = Array.from(y));
        var z = o(y[0]).parentNode,
            b = getComputedStyle ? getComputedStyle(z) : null,
            E = b ? b.flexDirection : null,
            S =
                a(s, "sizes") ||
                y.map(function () {
                    return 100 / y.length;
                }),
            L = a(s, "minSize", 100),
            _ = Array.isArray(L)
                ? L
                : y.map(function () {
                      return L;
                  }),
            w = a(s, "expandToMin", !1),
            k = a(s, "gutterSize", 4),
            x = a(s, "gutterAlign", "center"),
            C = a(s, "snapOffset", 30),
            M = a(s, "dragInterval", 1),
            U = a(s, "direction", "horizontal"),
            O = a(s, "cursor", "horizontal" === U ? "col-resize" : "row-resize"),
            D = a(s, "gutter", l),
            A = a(s, "elementStyle", c),
            B = a(s, "gutterStyle", h);
        function j(e, t, n, i) {
            var r = A(d, t, n, i);
            Object.keys(r).forEach(function (t) {
                e.style[t] = r[t];
            });
        }
        function F() {
            return p.map(function (e) {
                return e.size;
            });
        }
        function R(e) {
            return "touches" in e ? e.touches[0][f] : e[f];
        }
        function T(e) {
            var t = p[this.a],
                n = p[this.b],
                i = t.size + n.size;
            (t.size = (e / this.size) * i), (n.size = i - (e / this.size) * i), j(t.element, t.size, this._b, t.i), j(n.element, n.size, this._c, n.i);
        }
        function N(e) {
            var t,
                n = p[this.a],
                r = p[this.b];
            this.dragging &&
                ((t = R(e) - this.start + (this._b - this.dragOffset)),
                M > 1 && (t = Math.round(t / M) * M),
                t <= n.minSize + C + this._b ? (t = n.minSize + this._b) : t >= this.size - (r.minSize + C + this._c) && (t = this.size - (r.minSize + this._c)),
                T.call(this, t),
                a(s, "onDrag", i)());
        }
        function q() {
            var e = p[this.a].element,
                t = p[this.b].element,
                n = e.getBoundingClientRect(),
                i = t.getBoundingClientRect();
            (this.size = n[d] + i[d] + this._b + this._c), (this.start = n[v]), (this.end = n[m]);
        }
        function H(e) {
            var t = (function (e) {
                if (!getComputedStyle) return null;
                var t = getComputedStyle(e);
                if (!t) return null;
                var n = e[g];
                return 0 === n ? null : (n -= "horizontal" === U ? parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) : parseFloat(t.paddingTop) + parseFloat(t.paddingBottom));
            })(z);
            if (null === t) return e;
            if (
                _.reduce(function (e, t) {
                    return e + t;
                }, 0) > t
            )
                return e;
            var n = 0,
                i = [],
                r = e.map(function (r, s) {
                    var o = (t * r) / 100,
                        a = u(k, 0 === s, s === e.length - 1, x),
                        l = _[s] + a;
                    return o < l ? ((n += l - o), i.push(0), l) : (i.push(o - l), o);
                });
            return 0 === n
                ? e
                : r.map(function (e, r) {
                      var s = e;
                      if (n > 0 && i[r] - n > 0) {
                          var o = Math.min(n, i[r] - n);
                          (n -= o), (s = e - o);
                      }
                      return (s / t) * 100;
                  });
        }
        function I() {
            var t = p[this.a].element,
                r = p[this.b].element;
            this.dragging && a(s, "onDragEnd", i)(F()),
                (this.dragging = !1),
                e.removeEventListener("mouseup", this.stop),
                e.removeEventListener("touchend", this.stop),
                e.removeEventListener("touchcancel", this.stop),
                e.removeEventListener("mousemove", this.move),
                e.removeEventListener("touchmove", this.move),
                (this.stop = null),
                (this.move = null),
                t.removeEventListener("selectstart", i),
                t.removeEventListener("dragstart", i),
                r.removeEventListener("selectstart", i),
                r.removeEventListener("dragstart", i),
                (t.style.userSelect = ""),
                (t.style.webkitUserSelect = ""),
                (t.style.MozUserSelect = ""),
                (t.style.pointerEvents = ""),
                (r.style.userSelect = ""),
                (r.style.webkitUserSelect = ""),
                (r.style.MozUserSelect = ""),
                (r.style.pointerEvents = ""),
                (this.gutter.style.cursor = ""),
                (this.parent.style.cursor = ""),
                (n.body.style.cursor = "");
        }
        function W(t) {
            if (!("button" in t) || 0 === t.button) {
                var r = p[this.a].element,
                    o = p[this.b].element;
                this.dragging || a(s, "onDragStart", i)(F()),
                    t.preventDefault(),
                    (this.dragging = !0),
                    (this.move = N.bind(this)),
                    (this.stop = I.bind(this)),
                    e.addEventListener("mouseup", this.stop),
                    e.addEventListener("touchend", this.stop),
                    e.addEventListener("touchcancel", this.stop),
                    e.addEventListener("mousemove", this.move),
                    e.addEventListener("touchmove", this.move),
                    r.addEventListener("selectstart", i),
                    r.addEventListener("dragstart", i),
                    o.addEventListener("selectstart", i),
                    o.addEventListener("dragstart", i),
                    (r.style.userSelect = "none"),
                    (r.style.webkitUserSelect = "none"),
                    (r.style.MozUserSelect = "none"),
                    (r.style.pointerEvents = "none"),
                    (o.style.userSelect = "none"),
                    (o.style.webkitUserSelect = "none"),
                    (o.style.MozUserSelect = "none"),
                    (o.style.pointerEvents = "none"),
                    (this.gutter.style.cursor = O),
                    (this.parent.style.cursor = O),
                    (n.body.style.cursor = O),
                    q.call(this),
                    (this.dragOffset = R(t) - this.end);
            }
        }
        "horizontal" === U ? ((d = "width"), (f = "clientX"), (v = "left"), (m = "right"), (g = "clientWidth")) : "vertical" === U && ((d = "height"), (f = "clientY"), (v = "top"), (m = "bottom"), (g = "clientHeight")), (S = H(S));
        var X = [];
        function Y(e) {
            var t = e.i === X.length,
                n = t ? X[e.i - 1] : X[e.i];
            q.call(n);
            var i = t ? n.size - e.minSize - n._c : e.minSize + n._b;
            T.call(n, i);
        }
        return (
            (p = y.map(function (e, t) {
                var n,
                    i = { element: o(e), size: S[t], minSize: _[t], i: t };
                if (t > 0 && (((n = { a: t - 1, b: t, dragging: !1, direction: U, parent: z })._b = u(k, t - 1 == 0, !1, x)), (n._c = u(k, !1, t === y.length - 1, x)), "row-reverse" === E || "column-reverse" === E)) {
                    var r = n.a;
                    (n.a = n.b), (n.b = r);
                }
                if (t > 0) {
                    var s = D(t, U, i.element);
                    !(function (e, t, n) {
                        var i = B(d, t, n);
                        Object.keys(i).forEach(function (t) {
                            e.style[t] = i[t];
                        });
                    })(s, k, t),
                        (n._a = W.bind(n)),
                        s.addEventListener("mousedown", n._a),
                        s.addEventListener("touchstart", n._a),
                        z.insertBefore(s, i.element),
                        (n.gutter = s);
                }
                return j(i.element, i.size, u(k, 0 === t, t === y.length - 1, x), t), t > 0 && X.push(n), i;
            })).forEach(function (e) {
                var t = e.element.getBoundingClientRect()[d];
                t < e.minSize && (w ? Y(e) : (e.minSize = t));
            }),
            {
                setSizes: function (e) {
                    var t = H(e);
                    t.forEach(function (e, n) {
                        if (n > 0) {
                            var i = X[n - 1],
                                r = p[i.a],
                                s = p[i.b];
                            (r.size = t[n - 1]), (s.size = e), j(r.element, r.size, i._b, r.i), j(s.element, s.size, i._c, s.i);
                        }
                    });
                },
                getSizes: F,
                collapse: function (e) {
                    Y(p[e]);
                },
                destroy: function (e, t) {
                    X.forEach(function (n) {
                        if ((!0 !== t ? n.parent.removeChild(n.gutter) : (n.gutter.removeEventListener("mousedown", n._a), n.gutter.removeEventListener("touchstart", n._a)), !0 !== e)) {
                            var i = A(d, n.a.size, n._b);
                            Object.keys(i).forEach(function (e) {
                                (p[n.a].element.style[e] = ""), (p[n.b].element.style[e] = "");
                            });
                        }
                    });
                },
                parent: z,
                pairs: X,
            }
        );
    };
});

});

/* clsSMWeb\WebPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMWeb\\WebPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-1553786-style";
	style.textContent = ".height44{height:44px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViUHJldmlldy5zdmVsdGUiLCJzb3VyY2VzIjpbIldlYlByZXZpZXcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjwhLS1cclxuICogIEZpbGUgTmFtZSAgIDogV2ViQXV0aG9yaW5nLnN2ZWx0ZVxyXG4gKiAgRGVzY3JpcHRpb24gOiBTaG93IHRoZSBlZGl0b3JzIGh0bWwsY3NzIGFuZCBqc1xyXG4gKiAgQXV0aG9yICAgICAgOiBTdW5kYXJhbSBUcmlwYXRoaVxyXG4gKiAgUGFja2FnZSAgICAgOiBzdmVsdGVfaXRlbXNcclxuICogIExhc3QgdXBkYXRlIDogMDItSnVuZS0yMDIxXHJcbiAqICBMYXN0IFVwZGF0ZWQgQnkgOiBQcmFkZWVwIFlhZGF2XHJcbi0tPlxyXG5cclxuPHNjcmlwdD4gXHJcbiAgICBsZXQgdGhlbWVVcmwgPSAod2luZG93LmJhc2VUaGVtZVVSTCkgPyB3aW5kb3cuYmFzZVRoZW1lVVJMOiB3aW5kb3cuYmFzZVVybFRoZW1lO1xyXG4gICAgLy9pbXBvcnQge1RpdGxlLCBDb250ZW50LCBBY3Rpb25zLCBJbml0aWFsRm9jdXN9IGZyb20gJ0BzbXVpL2RpYWxvZyc7XHJcbiAgICBpbXBvcnQgeyBhZnRlclVwZGF0ZSwgb25Nb3VudCwgYmVmb3JlVXBkYXRlIH0gZnJvbSAnc3ZlbHRlJztcclxuICAgIGltcG9ydCB7IEJ1dHRvbiwgRGlhbG9nIH0gZnJvbSAnc3ZlbHRlLW11aS9zcmMnO1xyXG4gICAgaW1wb3J0IExvYWRlciBmcm9tICcuLi9oZWxwZXIvTG9hZGVyLnN2ZWx0ZSc7XHJcbiAgICBpbXBvcnQge3dyaXRhYmxlfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xyXG4gICAgLy9pbXBvcnQgbCBmcm9tICcuLi8uLi9saWIvTGFuZyc7XHJcbiAgICBpbXBvcnQgbCBmcm9tICcuLi9zcmMvbGlicy9lZGl0b3JMaWIvbGFuZ3VhZ2UuanMnO1xyXG4gICAgaW1wb3J0IHsgQUgsb25Vc2VyQW5zQ2hhbmdlIH0gZnJvbSAnLi4vaGVscGVyL0hlbHBlckFJLnN2ZWx0ZSc7XHJcblxyXG4gICAgaW1wb3J0ICcuLi9zcmMvbGlicy9jb2RlbWlycm9yLm1pbi5jc3MnO1xyXG4gICAgaW1wb3J0ICcuLi9zcmMvbGlicy9tb25va2FpLmNzcyc7XHJcbiAgICBpbXBvcnQgJy4uL3NyYy9saWJzL3NpbXBsZXNjcm9sbGJhcnMuY3NzJztcclxuICAgIGltcG9ydCAnLi4vc3JjL2xpYnMvd2ViaXRlbS5taW4uY3NzJztcclxuXHJcbiAgICBpbXBvcnQgJy4uL3NyYy9saWJzL2NvZGVtaXJyb3InO1xyXG4gICAgaW1wb3J0IFNwbGl0IGZyb20gJy4uL3NyYy9saWJzL3NwbGl0JztcclxuXHJcbiAgICBleHBvcnQgbGV0IGluUXVpelBsYXllcjtcclxuICAgIGV4cG9ydCBsZXQgeG1sO1xyXG4gICAgZXhwb3J0IGxldCB1eG1sO1xyXG4gICAgZXhwb3J0IGxldCBpc1JldmlldztcclxuICAgIHhtbCA9IHV4bWwgJiYgIS9zbWFucy9naS50ZXN0KHV4bWwpID8gdXhtbCA6IHhtbDtcclxuICAgIGxldCBpc1ByZXZpZXcgPSBcIlwiO1xyXG4gICAgLy8gZGVmaW5lcyB0aGF0IGVkaXRvciBpcyBub3QgaW5pdGlhbGl6ZWRcclxuICAgIGxldCByZW5kZXJlZCA9IDA7XHJcbiAgICAvLyBjb250YWlucyB0aGUgeG1sXHJcbiAgICBcclxuICAgIFxyXG4gICAgbGV0IG1vZGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN3aXRjaC1pbnB1dC5zd2l0Y2gtaW5wdXRcIik7XHJcbiAgICBsZXQgaHRtbEVkaXRvcjsgICBcclxuICAgIGxldCBjc3NFZGl0b3I7IFxyXG4gICAgbGV0IGpzRWRpdG9yO1xyXG4gICAgbGV0IHNob3dIVE1MID0gMTtcclxuICAgIGxldCByZWFkSFRNTCA9IDE7XHJcbiAgICBsZXQgc2hvd0NTUyA9IDE7XHJcbiAgICBsZXQgcmVhZENTUyA9IDE7XHJcbiAgICBsZXQgc2hvd0pTID0gMTtcclxuICAgIGxldCByZWFkSlMgPSAxO1xyXG4gICAgbGV0IHNwbGl0dGVyMSA9ICcnO1xyXG4gICAgbGV0IHNwbGl0dGVyMiA9ICcnO1xyXG4gICAgbGV0IHNwbGl0dGVyMyA9ICcnO1xyXG4gICAgbGV0IHVzZXJBbnN3ZXIgPSAnJztcclxuICAgIGxldCBpc09sZFRlc3RjYXNlID0gZmFsc2U7XHJcbiAgICBsZXQgcmVzdWx0U2F2aW5nO1xyXG4gICAgbGV0IHN0YXRlID0ge307XHJcbiAgICBsZXQgc3RhdGVEYXRhID0gd3JpdGFibGUoe1xyXG4gICAgICAgIHhtbCAgICAgICAgICAgICAgICAgICAgICAgICA6ICcnLFxyXG4gICAgICAgIHV4bWwgICAgICAgICAgICAgICAgICAgICAgICA6ICcnLFxyXG4gICAgICAgIG1vZHVsZSAgICAgICAgICAgICAgICAgICAgICA6ICcnLFxyXG4gICAgICAgIHRvZ2dsZSAgICAgICAgICAgICAgICAgICAgICA6IGZhbHNlLFxyXG4gICAgICAgIHNuYWNrYmFjayAgICAgICAgICAgICAgICAgICA6IGZhbHNlLFxyXG4gICAgICAgIGxhbmdfdHlwZSAgICAgICAgICAgICAgICAgICA6ICdwaHAnLFxyXG4gICAgICAgIHhtbEFyciAgICAgICAgICAgICAgICAgICAgICA6IFtdLFxyXG4gICAgICAgIHJlbWVkaWF0aW9uVG9nZ2xlICAgICAgICAgICA6IGZhbHNlLFxyXG4gICAgICAgIHF4bWwgICAgICAgICAgICAgICAgICAgICAgICA6ICcnLFxyXG4gICAgICAgIHRpdGxlRGF0YSAgICAgICAgICAgICAgICAgICA6IFwiXCIsIFxyXG4gICAgICAgIHN0ZW1EYXRhICAgICAgICAgICAgICAgICAgICA6IFwiXCIsXHJcbiAgICAgICAgcmVtZWRpYXRpb25EYXRhICAgICAgICAgICAgIDogXCJcIixcclxuICAgICAgICBnb0RhcmsgICAgICAgICAgICAgICAgICAgICAgOiAod2luZG93LnNlc3Npb25TdG9yYWdlLmdvRGFyayAmJiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ29EYXJrID09IFwidHJ1ZVwiID8gdHJ1ZSA6IGZhbHNlKVxyXG4gICAgfSk7XHJcbiAgICAgICAgXHJcbiAgICBsZXQgdW5zdWJzY3JpYmUgPSBzdGF0ZURhdGEuc3Vic2NyaWJlKChpdGVtcyk9PntcclxuICAgICAgICBzdGF0ZSA9IGl0ZW1zO1xyXG4gICAgfSlcclxuXHJcbiAgICAgICBcclxuICAgIC8vIGNhbGxlZCBldmVyeSB0aW1lIHdoZW4gYW55IHByb3BzIG9yIHN0YXRlIGdldHMgY2hhbmdlZFxyXG4gICAgYmVmb3JlVXBkYXRlKCgpPT57XHJcbiAgICAgICAgaWYgKHhtbCAhPSBzdGF0ZS54bWwpIHtcclxuICAgICAgICAgICAgc3RhdGUueG1sID0geG1sO1xyXG4gICAgICAgICAgICBpZiAoaXNSZXZpZXcpIHtcclxuICAgICAgICAgICAgICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrcyB0aGUgYW5zd2VyIGFuZCBub3QgYWxsb3dlZCB1c2VyIHRvIHBlcmZvcm0gdGhlIHRhc2tcclxuICAgICAgICAgICAgICAgICAgICBzZXRSZXZpZXcoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjbGVhciB0aGUgdGltZW91dCAndGltZXInXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcclxuICAgICAgICAgICAgICAgIH0uYmluZCh0aGlzKSwgMTAwMCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGltZXJfbmV4dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGFsbG93ZWQgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrIGluIHRoYXQgZWRpdG9yIHdoaWNoIHdhcyBub3QgbWFkZSByZWFkb25seSBhdCB0aGUgdGltZSBvZiBxdWVzdGlvbiBjcmVhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIHVuc2V0UmV2aWV3KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY2xlYXIgdGhlIHRpbWVvdXQgJ3RpbWVyX25leHQnXHJcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyX25leHQpO1xyXG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiBsb2FkTGlicygpIHtcclxuICAgICAgICBsZXQgY29uZmlnID0ge1xyXG4gICAgICAgICAgICBwcmVsb2FkOiB0cnVlLFxyXG4gICAgICAgICAgICB0eXBlOiAndGV4dC9qYXZhc2NyaXB0JyxcclxuICAgICAgICAgICAgYXM6ICdzY3JpcHQnXHJcbiAgICAgICAgfVxyXG4gICAgICAgIEFILmNyZWF0ZUxpbmsod2luZG93Lml0ZW1Gb2xkZXIgKyAnc3JjL2xpYnMvY29kZW1pcnJvci5qcycsIGNvbmZpZyk7XHJcbiAgICAgICAgQUguY3JlYXRlTGluayh3aW5kb3cuaXRlbUZvbGRlciArICdzcmMvbGlicy9zcGxpdC5qcycsIGNvbmZpZyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIG9uTW91bnQoKCk9PntcclxuICAgICAgICBsb2FkTGlicygpXHJcbiAgICAgICAgLy8gdXNlZCBmb3IgbW9iaWxlIHRlYW1cclxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5nZXRIZWlnaHQgJiYgd2luZG93LmdldEhlaWdodCgpO1xyXG4gICAgICAgICAvKiAgIGpRdWVyeSgnI2h0bWxfcGFuZScpLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGpRdWVyeSh0aGlzKS5maW5kKCdhJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjY3NzX3BhbmVsLCNqc19wYW5lbCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoJyNodG1sX3BhbmVsJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJykuZmluZCgnYScpLmFkZENsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGxldCBodG1sX3RhZ3MgPSBodG1sRWRpdG9yLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICBodG1sRWRpdG9yLnNldFZhbHVlKGh0bWxfdGFncyk7XHJcbiAgICAgICAgICAgIH0pOyAvL1JlcGxhY2VkKi9cclxuICAgICAgICBcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h0bWxfcGFuZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbihfdGhpcykge1xyXG4gICAgICAgICAgICAgICAgQUkuc2VsZWN0KF90aGlzKS5xdWVyeVNlbGVjdG9yKCdhJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjc3NfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2Nzc19wYW5lbFwiLCdjc3MnLHtkaXNwbGF5Oidub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanNfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2pzX3BhbmVsXCIsJ2Nzcycse2Rpc3BsYXk6J25vbmUnfSk7XHJcbiAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdodG1sX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICBBSC5zZWxlY3QoXCIjaHRtbF9wYW5lbFwiLCdjc3MnLHtkaXNwbGF5OidibG9jayd9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdCgnI2h0bWxfcGFuZWwnKTtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdhJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgaHRtbF90YWdzID0gaHRtbEVkaXRvci5nZXRWYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgaHRtbEVkaXRvci5zZXRWYWx1ZShodG1sX3RhZ3MpO1xyXG4gICAgICAgICAgICB9KVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8qalF1ZXJ5KCcjY3NzX3BhbmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkodGhpcykuZmluZCgnYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGpRdWVyeSgnI2h0bWxfcGFuZWwsI2pzX3BhbmVsJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICAgICAgICAgICAgICAgIGpRdWVyeSgnI2Nzc19wYW5lbCcpLmNzcygnZGlzcGxheScsICdibG9jaycpLmZpbmQoJ2EnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQgY3NzX2RhdGEgPSBjc3NFZGl0b3IuZ2V0VmFsdWUoKTsgICAgXHJcbiAgICAgICAgICAgICAgICBjc3NFZGl0b3Iuc2V0VmFsdWUoY3NzX2RhdGEpO1xyXG4gICAgICAgICAgICB9KTsqLy8vIFJlcGxhY2VkXHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjaHRtbF9wYW5lJykuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLGZ1bmN0aW9uKF90aGlzKXtcclxuICAgICAgICAgICAgICAgIGxldCBjb250YWluID0gQUkuc2VsZWN0KF90aGlzKTtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW4ucXVlcnlTZWxlY3QoJ2EnKS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2h0bWxfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2h0bWxfcGFuZWxcIiwnY3NzJyx7ZGlzcGxheTonbm9uZSd9KTtcclxuICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIEFILnNlbGVjdChcIiNqc19wYW5lbFwiLCdjc3MnLHtkaXNwbGF5Om5vbmV9KTtcclxuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmVsJyk7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIucXVlcnlTZWxlY3RvcignYScpLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgbGV0IGNzc19kYXRhID0gY3NzRWRpdG9yLmdldFZhbHVlKCk7ICAgIFxyXG4gICAgICAgICAgICAgICAgY3NzRWRpdG9yLnNldFZhbHVlKGNzc19kYXRhKTtcclxuICAgICAgICAgICAgfSkgIFxyXG5cclxuXHJcblxyXG4gICAgICAgIC8qICAgIGpRdWVyeSgnI2pzX3BhbmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkodGhpcykuZmluZCgnYScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGpRdWVyeSgnI2Nzc19wYW5lbCwjaHRtbF9wYW5lbCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoJyNqc19wYW5lbCcpLmNzcygnZGlzcGxheScsICdibG9jaycpLmZpbmQoJ2EnKS5hZGRDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBsZXQganNfZGF0YSA9IGpzRWRpdG9yLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICBqc0VkaXRvci5zZXRWYWx1ZShqc19kYXRhKTtcclxuICAgICAgICAgICAgfSk7ICAqL1xyXG5cclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2pzX3BhbmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oX3RoaXMpe1xyXG4gICAgICAgICAgICAgICAgbGV0IGpzX1BhbmUgPSBBSS5zZWxlY3QoX3RoaXMpO1xyXG4gICAgICAgICAgICAgICAganNfUGFuZS5xdWVyeVNlbGVjdG9yKCdhJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjc3NfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2Nzc19wYW5lbFwiLCdjc3MnLHtkaXNwbGF5Oidub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaHRtbF9wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBBSC5zZWxlY3QoXCIjaHRtbF9wYW5lbFwiLCdjc3MnLHtkaXNwbGF5Oidub25lJ30pO1xyXG4gICAgICAgICAgICAgICAgbGV0IGpzX3BhbmVsX2NvbnRhaW5lciA9IEFILnNlbGVjdCgnI2pzX3BhbmVsJyk7XHJcbiAgICAgICAgICAgICAgICBqc19wYW5lbF9jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgICAgICBqc19wYW5lbF9jb250YWluZXIucXVlcnlTZWxlY3QoJ2EnKS5jbGFzc2xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGxldCBqc19kYXRhID0ganNFZGl0b3IuZ2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIGpzRWRpdG9yLnNldFZhbHVlKGpzX2RhdGEpO1xyXG5cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gY29uZGl0b24gY2FuIGJlIHJlbW92ZWQgYXMgaXRzIGRlZmluZWQgYWJvdmVcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbk5hdGl2ZSkge1xyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKGBoZWlnaHRfX18ke2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiI21haW5Db250YWluZXJcIikub2Zmc2V0SGVpZ2h0fWAsICcqJyk7XHJcbiAgICAgICAgICAgICAgICB9LCA1MDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICAgIHJlbmRlckNvZGVNaXJyb3IoKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NwbGl0dGVyV2ViXCIpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1c2VkIGZvciBzZXQgdGhlIHBvc2l0aW9uLCBudW1iZXIgb2YgcGl4ZWwgd2hlcmUgc3BsaXR0ZXIgYmFyIGNhbid0IGJlIG1vdmUgb24gdGhlIGVkZ2UsIGFuZCBvcmllbnRhdGlvbiBvZiB0aGUgc3BsaXR0ZXIgYmFyXHJcbiAgICAgICAgICAgICAgICBzcGxpdHRlcigpO1xyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyBmcm9tIHRoZSBmdW5jdGlvbiB0byBwcmV2ZW50IGZyb20gcmUtYXBwZW5lZCB0aGUgY29kZSBpZiBpdCB3YXMgYWxyZWFkeSBkZWZpbmVkXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIWluUXVpelBsYXllcikge1xyXG4gICAgICAgICAgICAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSBwb3NpdGlvbiwgbnVtYmVyIG9mIHBpeGVsIHdoZXJlIHNwbGl0dGVyIGJhciBjYW4ndCBiZSBtb3ZlIG9uIHRoZSBlZGdlLCBhbmQgb3JpZW50YXRpb24gb2YgdGhlIHNwbGl0dGVyIGJhclxyXG4gICAgICAgICAgICAgICAgc3BsaXR0ZXIoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldHMgdGhlIHdpZHRoIGFuZCBmbG9hdGluZyBwcm9wZXJ0eSBvZiB0aGUganMsIGh0bWwsIGNzcyBhbmQgcmVzdWx0IGVkaXRvclxyXG4gICAgICAgICAgICAgICAgY2hhbmdlU3R5bGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMDApO1xyXG5cclxuICAgIC8qICAgIGpRdWVyeShkb2N1bWVudCkub2ZmKCdjbGljaycsICcjYW5zd2VyQ2hlY2snKS5vbignY2xpY2snLCAnI2Fuc3dlckNoZWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBzaG93cyB0aGUgb3V0cHV0IG9mIHRoZSBjb2RlIHdyaXR0ZW4gb24gdGhlIGVkaXRvcnMgYW5kIHNldHMgdGhlIHZhbHVlIG9mIHN0YXRlICdyZW1lZGlhdGlvblRvZ2dsZScgdG8gdHJ1ZSBmb3IgaWRlbnRpZnkgdGhhdCByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXHJcbiAgICAgICAgICAgIHJlbWVkaWF0aW9uTW9kZSgpO1xyXG4gICAgICAgIH0pOyAgLy8gUmVwbGFjZWQqL1xyXG4gICAgICAgIEFJLmxpc3Rlbihkb2N1bWVudCwnY2xpY2snLCcjYW5zd2VyQ2hlY2snLGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHJlbWVkaWF0aW9uTW9kZSgpO1xyXG4gICAgICAgIH0pXHJcblxyXG4gICAgLyogICAgalF1ZXJ5KFwiI3NldC1yZXZpZXdcIikub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBjaGVja3MgdGhlIGFuc3dlciBhbmQgbm90IGFsbG93ZWQgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrXHJcbiAgICAgICAgICAgIHNldFJldmlldygpO1xyXG4gICAgICAgIH0pOyAgLy9SZXBsYWNlZCAoRml4ZWQgd2l0aCBYTUwgUGFydClcclxuICAgICovXHJcbiAgICBcclxuXHJcbiAgICAgICAgLy8galF1ZXJ5KFwiI3Vuc2V0LXJldmlld1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgLy8gICAgIC8vIGFsbG93ZWQgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrIGluIHRoYXQgZWRpdG9yIHdoaWNoIHdhcyBub3QgbWFkZSByZWFkb25seSBhdCB0aGUgdGltZSBvZiBxdWVzdGlvbiBjcmVhdGlvblxyXG4gICAgICAgIC8vICAgICB1bnNldFJldmlldygpOyAvL1JlcGxhY2VkIChGaXhlZCB3aXRoIFhNTCBQYXJ0KVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG5cclxuXHJcbiAgICAgICAgd2luZG93LnNhdmVfZGF0YSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAoQ29kZU1pcnJvcikgPT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzaG93cyB0aGUgb3V0cHV0IG9mIHRoZSBjb2RlIGluICdSZXN1bHQnIGVkaXRvclxyXG4gICAgICAgICAgICAgICAgLy9zZWxmLnJ1bkNvZGUoKTtcclxuICAgICAgICAgICAgICAgIGFuc3dlckNoZWNrV2ViKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gaXQgaXMgdXNlZCBvbmx5IHJlLXJlbmRlciBwdXJwb3NlIGFzIGl0cyB2YWx1ZSBmaXJzdCBjaGFuZ2VzIGJ1dCBjYWxsYmFjayBmdW5jdGlvbiBhZ2FpbiByZXNldCBpdCBpdHMgaW5pdGlhbCB2YWx1ZVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vc3RhdGUuZ29EYXJrID0hc3RhdGUuZ29EYXJrO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gc2V0UmV2aWV3KCkge1xyXG4gICAgICAgIC8vIGNoZWNrcyB0aGUgYW5zd2VyXHJcbiAgICAgICAgYW5zd2VyQ2hlY2tXZWIoKTtcclxuICAgICAgICBodG1sRWRpdG9yICYmIGh0bWxFZGl0b3Iuc2V0T3B0aW9uKFwicmVhZE9ubHlcIiwgdHJ1ZSk7XHJcbiAgICAgICAgY3NzRWRpdG9yICYmIGNzc0VkaXRvci5zZXRPcHRpb24oXCJyZWFkT25seVwiLCB0cnVlKTtcclxuICAgICAgICBqc0VkaXRvciAmJiBqc0VkaXRvci5zZXRPcHRpb24oXCJyZWFkT25seVwiLCB0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB1bnNldFJldmlldygpIHtcclxuICAgICAgICBpZiAodHlwZW9mIChDb2RlTWlycm9yKSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgaHRtbEVkaXRvciAmJiBodG1sRWRpdG9yLnNldE9wdGlvbihcInJlYWRPbmx5XCIsIChyZWFkSFRNTCA/IGZhbHNlIDogdHJ1ZSkpO1xyXG4gICAgICAgICAgICBjc3NFZGl0b3IgJiYgY3NzRWRpdG9yLnNldE9wdGlvbihcInJlYWRPbmx5XCIsIChyZWFkQ1NTID8gZmFsc2UgOiB0cnVlKSk7XHJcbiAgICAgICAgICAgIGpzRWRpdG9yICYmIGpzRWRpdG9yLnNldE9wdGlvbihcInJlYWRPbmx5XCIsIChyZWFkSlMgPyBmYWxzZSA6IHRydWUpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIHVwZGF0ZXMgdGhlIHhtbFxyXG4gICAgZnVuY3Rpb24gZ2V0Q2hpbGRYbWwoeG1sKSB7XHJcbiAgICAgICAgeG1sID0geG1sO1xyXG4gICAgfVxyXG5cclxuICAgIFxyXG4gICAgZnVuY3Rpb24gc3BsaXR0ZXIoKSB7XHJcbiAgICAgICAgLy8gVGhpcyBjb2RlIHdpbGwgcnVubmluZyBvbiBtb2JpbGVcclxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGluIGNhc2Ugd2hlbiBqcyBlZGl0b3IgaXMgdmlzaWJsZSBhbmQgZWl0aGVyIGh0bWwgb3IgY3NzIG9yIGJvdGggZWRpdG9yIHZpc2libGVcclxuICAgICAgICAgICAgaWYgKHNob3dKUyAmJiAoc2hvd0hUTUwgfHwgc2hvd0NTUykpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0IGlzIHVzZWQgdG8gc3R5bGVkIHRoZSBzcGxpdHRlciBiYXIgdGhhdCBleGlzdHMgb24gdGhlIGxlZnQgZWRnZSBvZiB0aGUganMgZWRpdG9yXHJcbiAgICAgICAgICAgICAgICAvLyBzcGxpdHRlcjEgPSBqUXVlcnkoJyN0b3BfY29udGVudCcpLmhlaWdodCgzOTQpLnNwbGl0KHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBBZGQgYSB2ZXJ0aWNhbCBzcGxpdHRlciBiYXJcclxuICAgICAgICAgICAgICAgIC8vICAgICBvcmllbnRhdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBTcGVjaWZ5IGhvdyBtYW55IHBpeGVscyB3aGVyZSB5b3UgY2FuJ3QgbW92ZSB0aGUgc3BsaXR0ZXIgYmFyIG9uIHRoZSBlZGdlXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbGltaXQ6IDE2MCxcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBTZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBzcGxpdHRlciBiYXJcclxuICAgICAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjogJzY4JSdcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IHNwbGl0dGVyMSA9IFNwbGl0KFsnI3RvcF9jb250ZW50J10se1xyXG4gICAgICAgICAgICAgICAgc2l6ZXM6IFs1MF0sXHJcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGluIGNhc2Ugd2hlbiBodG1sIGFuZCBjc3MgYm90aCBlZGl0b3IgaXMgdmlzaWJsZVxyXG4gICAgICAgICAgICBpZiAoc2hvd0hUTUwgJiYgc2hvd0NTUykge1xyXG4gICAgICAgICAgICAgICAgLy8gaXQgaXMgdXNlZCB0byBzdHlsZWQgdGhlIHNwbGl0dGVyIGJhciB0aGF0IGV4aXN0cyBvbiB0aGUgbGVmdCBlZGdlIG9mIHRoZSBjc3MgZWRpdG9yXHJcbiAgICAgICAgICAgICAgICAvLyBzcGxpdHRlcjIgPSBqUXVlcnkoJyNmaXJzdEVkaXRvckRpdicpLmhlaWdodCgzOTQpLnNwbGl0KHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBBZGQgYSB2ZXJ0aWNhbCBzcGxpdHRlciBiYXJcclxuICAgICAgICAgICAgICAgIC8vICAgICBvcmllbnRhdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBTcGVjaWZ5IGhvdyBtYW55IHBpeGVscyB3aGVyZSB5b3UgY2FuJ3QgbW92ZSB0aGUgc3BsaXR0ZXIgYmFyIG9uIHRoZSBlZGdlXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgbGltaXQ6IDgwLFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIFNldCB0aGUgcG9zaXRpb24gb2YgdGhlIHNwbGl0dGVyIGJhclxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOiAnNTAlJ1xyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgICAgICBsZXQgc3BsaXR0ZXIyID0gU3BsaXQoWycjZmlyc3RFZGl0b3JEaXYnXSx7XHJcbiAgICAgICAgICAgICAgICAgICAgc2l6ZXM6IFsxMDBdLFxyXG4gICAgICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAgICAgICAgICAgICAgICAgICAvL2RpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIFNwbGl0KFsnI2h0bWxfcGFuZWwnLCcjY3NzX3BhbmVsJywnI2pzX3BhbmVsJ10se1xyXG4gICAgICAgICAgICAgICAgICAgIHNpemVzOiBbNTAsNTAsNTBdLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbiBjYXNlIHdoZW4gb25seSBvbmUgZWRpdG9yIHZpc2libGVcclxuICAgICAgICAgICAgaWYgKChzaG93SFRNTCArIHNob3dDU1MgKyBzaG93SlMpID09IDEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGl0IGlzIHVzZWQgdG8gc3R5bGVkIHRoZSBzcGxpdHRlciBiYXIgdGhhdCBleGlzdHMgb24gdGhlIGxlZnQgZWRnZSBvZiB0aGUgcmVzdWx0IGVkaXRvciBpbiBjYXNlIHdoZW4gb25seSBvbmUgaHRtbCwganMgb3IgY3NzIGVkaXRvciBpcyB2aXNpYmxlXHJcbiAgICAgICAgICAgICAgICAvLyBzcGxpdHRlcjMgPSBqUXVlcnkoJyNhY2NvcmRpb24nKS5oZWlnaHQoMzk0KS5zcGxpdCh7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gQWRkIGEgdmVydGljYWwgc3BsaXR0ZXIgYmFyXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgb3JpZW50YXRpb246ICd2ZXJ0aWNhbCcsXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gU3BlY2lmeSBob3cgbWFueSBwaXhlbHMgd2hlcmUgeW91IGNhbid0IG1vdmUgdGhlIHNwbGl0dGVyIGJhciBvbiB0aGUgZWRnZVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGxpbWl0OiA4MCxcclxuICAgICAgICAgICAgICAgIC8vICAgICAvLyBTZXQgdGhlIHBvc2l0aW9uIG9mIHRoZSBzcGxpdHRlciBiYXJcclxuICAgICAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjogJzYwJSdcclxuICAgICAgICAgICAgICAgIC8vIH0pO1xyXG4gICAgICAgICAgICAgICAgbGV0IFNwbGl0dGVyMyA9IFNwbGl0KFsnI2FjY29yZGlvbiddLHtcclxuICAgICAgICAgICAgICAgIHNpemVzOiBbMTAwXSxcclxuICAgICAgICAgICAgICAgIGRpcmVjdGlvbjogJ3ZlcnRpY2FsJyxcclxuICAgICAgICAgICAgICAgIC8vZGlyZWN0aW9uOiBcInZlcnRpY2FsXCIsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgICAvLyBzZXRzIHRoZSB3aWR0aCBhbmQgZmxvYXRpbmcgcHJvcGVydHkgb2YgdGhlIGpzLCBodG1sLCBjc3MgYW5kIHJlc3VsdCBlZGl0b3JcclxuICAgIGZ1bmN0aW9uIGNoYW5nZVN0eWxlKCkge1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIG1vYmlsZSB0ZWFtXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbk5hdGl2ZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChzaG93SlMgJiYgKHNob3dIVE1MIHx8IHNob3dDU1MpKSB7XHJcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIHdpZHRoIDUwJSBvZiBodG1sL2NzcyBlZGl0b3IgaWYgb25seSBvbmUgZXhpc3Qgb3RoZXJ3aXNlIHNldHMgd2lkdGggNTAlIG9mIHBhcmVudCBlbGVtZW50IHdoaWNoIGNvbnRhaW5zIGJvdGggZWRpdG9yIHRoYXQgaGF2ZSBpZCAnZmlyc3RFZGl0b3JEaXYnIGFuZCBmbG9hdCBsZWZ0XHJcbiAgICAgICAgICAgLy8galF1ZXJ5KFwiI2ZpcnN0RWRpdG9yRGl2XCIpWzBdLnN0eWxlLmNzc1RleHQgPSBcImZsb2F0OmxlZnQ7d2lkdGg6NTAlXCI7IC8vIFJlcGxhY2VkXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlyc3RFZGl0b3JEaXZcIikuc3R5bGUuY3NzVGV4dCA9ICdmbG9hdDpsZWZ0O3dpZHRoOjUwJSc7XHJcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIHdpZHRoIDUwJSBvZiBqcyBlZGl0b3IgYW5kIGZsb2F0IGxlZnRcclxuICAgICAgICAgICAgLy9qUXVlcnkoXCIjanNFZGl0b3JEaXZcIilbMF0uc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo1MCVcIjsgLy8gUmVwbGFjZWRcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc0VkaXRvckRpdlwiKS5zdHlsZS5jc3NUZXh0ID0gJ2Zsb2F0OmxlZnQ7d2lkdGg6NTAlJztcclxuICAgICAgICAgICAgLy8gaXQgaXMgcGFyZW50IGVsZW1lbnQgdGhhdCBjb250YWlucyBodG1sLCBjc3MgYW5kIGpzIGVkaXRvci4gU3R5bGVzIGl0IG5vdCB0byBhbGxvdyBhbnkgZmxvYXRpbmcgZWxlbWVudCBvbiBsZWZ0IG9yIHJpZ2h0IGFuZCBzZXRzIG92ZXJmbG93IHByb3BlcnR5ICdhdXRvJ1xyXG4gICAgICAgICAgICAvL2pRdWVyeShcIiN0b3BfY29udGVudFwiKVswXS5zdHlsZS5jc3NUZXh0ID0gXCJjbGVhcjpib3RoO292ZXJmbG93OmF1dG9cIjsgLy8gUmVwbGFjZWRcclxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3BfY29udGVudFwiKS5zdHlsZS5jc3NUZXh0ID0gXCJjbGVhcjpib3RoO292ZXJmbG93OmF1dG9cIlxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoc2hvd0hUTUwgJiYgc2hvd0NTUykge1xyXG4gICAgICAgICAgICAvLyBpdCBpcyBwYXJlbnQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIGh0bWwsIGNzcyBhbmQganMgZWRpdG9yLiBTdHlsZXMgaXQgbm90IHRvIGFsbG93IGFueSBmbG9hdGluZyBlbGVtZW50IG9uIGxlZnQgb3IgcmlnaHQgYW5kIHNldHMgb3ZlcmZsb3cgcHJvcGVydHkgJ2F1dG8nXHJcbiAgICAgICAgICAgIC8valF1ZXJ5KFwiI3RvcF9jb250ZW50XCIpWzBdLnN0eWxlLmNzc1RleHQgPSBcImNsZWFyOmJvdGg7b3ZlcmZsb3c6YXV0b1wiOyAvLyBSZXBsYWNlZFxyXG4gICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjdG9wX2NvbnRlbnRcIikuc3R5bGUuY3NzVGV4dCA9ICdjbGVhcjpib3RoO292ZXJmbG93OmF1dG8nO1xyXG4gICAgICAgICAgICAvLyBzZXRzIGh0bWwgZWRpdG9yJ3Mgd2lkdGggNTAlIGFuZCBmbG9hdCBsZWZ0XHJcbiAgICAgICAgICAgLy8galF1ZXJ5KFwiI2h0bWxfcGFuZWxcIilbMF0uc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo1MCVcIjsgLy8gUmVwbGFjZWRcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNodG1sX3BhbmVsXCIpLnN0eWxlLmNzc1RleHQgPSBcImZsb2F0OmxlZnQ7d2lkdGg6NTAlXCI7XHJcbiAgICAgICAgICAgIC8vIHNldHMgY3NzIGVkaXRvcidzIHdpZHRoIDUwJSBhbmQgZmxvYXQgbGVmdFxyXG4gICAgICAgICAgIC8vIGpRdWVyeShcIiNjc3NfcGFuZWxcIilbMF0uc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo1MCVcIjsgLy8gUmVwbGFjZWRcclxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNjc3NfcGFuZWxcIikuc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo1MCVcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKChzaG93SFRNTCArIHNob3dDU1MgKyBzaG93SlMpID09IDEpIHtcclxuICAgICAgICAgICAgLy8gc2V0cyBjc3MgcHJvcGVydHkgIHdpZHRoIDUwJSBhbmQgZmxvYXQgbGVmdCBvZiBwYXJlbnQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIGh0bWwsIGNzcyBhbmQganMgZWRpdG9yIFxyXG4gICAgICAgICAgICAvL2pRdWVyeShcIiN0b3BfY29udGVudFwiKVswXS5zdHlsZS5jc3NUZXh0ID0gXCJmbG9hdDpsZWZ0O3dpZHRoOjYwJVwiO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3RvcF9jb250ZW50XCIpLnN0eWxlLmNzc1RleHQgPSBcImZsb2F0OmxlZnQ7d2lkdGg6NjAlXCI7XHJcbiAgICAgICAgICAgIC8vIHNldHMgY3NzIHByb3BlcnR5ICB3aWR0aCA0MCUgYW5kIGZsb2F0IGxlZnQgb2YgZWxlbWVudCB0aGF0IGNvbnRhaW5zIHJlc3VsdCBlZGl0b3IgXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm90dG9tX2NvbnRlbnRcIikuc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo0MCVcIjtcclxuICAgICAgICAgICAgLy9qUXVlcnkoXCIjYm90dG9tX2NvbnRlbnRcIilbMF0uc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo0MCVcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2hhbmdlcyB0aGVtZSBvZiB0aGUgaHRtbCwganMgYW5kIGNzcyBlZGl0b3JzIGFjY29yZGluZyB0byB0aGUgY2hlY2tlZCBzdGF0dXMgb2YgJ0RhcmsgTW9kZScgY2hlY2tib3ggXHJcbiAgICBmdW5jdGlvbiBjaGFuZ2VUaGVtZSgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygpO1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBjaGVja2VkIHN0YXR1cyBvZiB0aGUgJ0RhcmsgTW9kZScgY2hlY2tib3hcclxuICAgICAgICBsZXQgY2hlY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dvRGFya1wiKS5jaGVja2VkO1xyXG4gICAgICAgIC8vIHVwZGF0ZXMgdGhlIHZhbHVlIG9mIHN0YXRlICdnb0RhcmsnIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2NoZWNrJ1xyXG4gICAgICAgIHN0YXRlLmdvRGFyayA9IGNoZWNrIDtcclxuICAgICAgICAvLyBzdG9yZXMgdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdjaGVjaycgaW4gJ2dvRGFyaycgdmFyaWFibGUgb2Ygc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0XHJcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLmdvRGFyayA9IGNoZWNrO1xyXG4gICAgICAgIGlmIChjaGVjaykge1xyXG4gICAgICAgICAgICBodG1sRWRpdG9yLnNldE9wdGlvbihcInRoZW1lXCIsIFwibW9ub2thaVwiKTtcclxuICAgICAgICAgICAgY3NzRWRpdG9yLnNldE9wdGlvbihcInRoZW1lXCIsIFwibW9ub2thaVwiKTtcclxuICAgICAgICAgICAganNFZGl0b3Iuc2V0T3B0aW9uKFwidGhlbWVcIiwgXCJtb25va2FpXCIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGh0bWxFZGl0b3Iuc2V0T3B0aW9uKFwidGhlbWVcIiwgXCJkZWZhdWx0XCIpO1xyXG4gICAgICAgICAgICBjc3NFZGl0b3Iuc2V0T3B0aW9uKFwidGhlbWVcIiwgXCJkZWZhdWx0XCIpO1xyXG4gICAgICAgICAgICBqc0VkaXRvci5zZXRPcHRpb24oXCJ0aGVtZVwiLCBcImRlZmF1bHRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZXMgdGhlIHZhbHVlIG9mICdzcmMnIGF0dHJpYnV0ZSBvZiAnaW1nJywgJ2F1ZGlvJyBhbmQgJ3ZpZGVvJyB0YWcgaWYgYW55IG9mIHRoZXNlIHRhZ3MgZXhpc3Qgb3RoZXJ3aXNlIHJldHVybnMgYXMgaXQgaXNcclxuICAgIGZ1bmN0aW9uIG5ld1NvdXJjZSgpIHtcclxuICAgICAgICBsZXQgaHRtbERhdGEgPSBodG1sRWRpdG9yLmdldFZhbHVlKCk7XHJcbiAgICAgICAgbGV0IHZpZGVvX2FuZF9hdWRpb19kYXRhID0gWydtcDQnLCAnb2dnJywgJ3dlYm0nLCAnbXAzJywgJ3dhdiddO1xyXG4gICAgICAgIGxldCBpbWdfZGF0YSA9IFsnZ2lmJywgJ3RpZicsICdwbmcnLCAnanBnJywgJ2pzJ107XHJcbiAgICAgICAgaHRtbERhdGEgPSBodG1sRGF0YS5yZXBsYWNlKC9zcmNbIF0qPVsgXSpbJ1wiXSguKj8pWydcIl0vZ20sIGZ1bmN0aW9uIChmdWxsTWF0Y2gsIHNyYykge1xyXG4gICAgICAgICAgICBpZiAoc3JjKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZpZGVvX2FuZF9hdWRpb19kYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYy5pbmRleE9mKHZpZGVvX2FuZF9hdWRpb19kYXRhW2ldKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIGRhdGEgYWZ0ZXIgdXBkYXRpbmcgdGhlIHNyYyB2YWx1ZSBvZiBhdWRpbyBhbmQgdmlkZW8gdGFnIHRvIGFjY2VzcyBpdCBnbG9iYWxseVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZnVsbE1hdGNoLnJlcGxhY2Uoc3JjLCAnaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RyZWFtLycgKyBzcmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW1nX2RhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjLmluZGV4T2YoaW1nX2RhdGFbaV0pID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0dW5zIHRoZSBkYXRhIGFmdGVyIHVwZGF0aW5nIHRoZSBzcmMgdmFsdWUgb2YgJ2ltZycgdGFnIG8gZ2xvYmFsbHkgYWNjZXNzIGl0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxsTWF0Y2gucmVwbGFjZShzcmMsICdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvJyArIHNyYyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIGh0bWwgZGF0YSBhZnRlciB1cGRhdGluZyB0aGUgJ3NyYycgdmFsdWUgb2YgJ2ltZycsICd2aWRlbycgYW5kICdhdWRpbycgdGFnXHJcbiAgICAgICAgICAgIHJldHVybiBmdWxsTWF0Y2g7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgaHRtbCBkYXRhIGlmICdpbWcnLCAndmlkZW8nIGFuZCAnYXVkaW8nIHRhZyBub3QgZXhpc3RcclxuICAgICAgIC8vY29uc29sZS5sb2coeydkYXRhJzpodG1sRGF0YX0pXHJcbiAgICAgICAgcmV0dXJuIGh0bWxEYXRhO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgdGhlIGNvbWJpbmVkIGRhdGEgb2YgaHRtbCwgY3NzIGFuZCBqcyBhZnRlciB3cmFwcGluZyB0aGUgY3NzIGVkaXRvciB2YWx1ZSBpbiBzdHlsZSB0YWcgYW5kIGpzIGVkaXRvciB2YWx1ZSBpbiBzY3JpcHQgdGFnIGFuZCBoaWRlcyB0aGUgJ0xvYWRpbmcuLi4nIGNvbnRhaW5pbmcgYWZ0ZXIgbG9hZFxyXG4gICAgZnVuY3Rpb24gcHJlcGFyZVNvdXJjZSgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGh0bWwgZWRpdG9yIHZhbHVlIGFmdGVyIHVwZGF0aW5nIHRoZSBzcmMgdmFsdWUgb2YgaW1nLCB2aWRlbyBhbmQgYXVkaW8gdGFnXHJcbiAgICAgICAgICAgIGxldCBodG1sRGF0YSA9IFwiPGRpdiBpZD0nbG9hZGVyJyBzdHlsZT0ncG9zaXRpb246IGZpeGVkO3dpZHRoOiAxMDAlO2hlaWdodDogMTAwdmg7ei1pbmRleDogOTk5OTtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7Jz5Mb2FkaW5nLi4uPC9kaXY+XCIgKyBuZXdTb3VyY2UoKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjc3NEYXRhID0gY3NzRWRpdG9yLmdldFZhbHVlKCk7XHJcbiAgICAgICAgICAgIGxldCBqc0RhdGEgPSBqc0VkaXRvci5nZXRWYWx1ZSgpO1xyXG4gICAgICAgICAgICBjc3NEYXRhID0gY3NzRGF0YS5yZXBsYWNlKC91cmxcXChbJ1wiXSguKj8pWydcIl1cXCkvZywgJ3VybChcImh0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8kMVwiKScpO1xyXG4gICAgICAgICAgICBqc0RhdGEgPSBqc0RhdGEucmVwbGFjZSgvc3JjLio/W1wiJ10oLio/KVtcIiddL2dpLCAnc3JjID0gXCJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvJDFcIicpO1xyXG4gICAgICAgICAgICBqc0RhdGEgPSBgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uKGV2KSB7XHJcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGVyJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgfSk7JHtqc0RhdGF9YDtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGNvbWJpbmVkIGRhdGEgb2YgaHRtbCwgY3NzIGFuZCBqcyBlZGl0b3JcclxuICAgICAgICAgICAgbGV0IGZ1bGxEYXRhID0gaHRtbERhdGEgKyBcIlxcPHN0eWxlXFw+XCIgKyBjc3NEYXRhICsgXCJcXDxcXC9zdHlsZVxcPlxcPHNjcmlwdFxcPlwiICsganNEYXRhICsgXCJcXDxcXC9zY3JpcHRcXD5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bGxEYXRhO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coeyBlLCBmdW5jOiAncHJlcGFyZVNvdXJjZUAzOTMnIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9IFxyXG5cclxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBodG1sLCBjc3MgYW5kIGpzIGVkaXRvciBieSBjb252ZXJ0aW5nIHRleHRhcmVhcyBoYXZpbmcgaWQgJ2h0bWxfZWRpdG9yJywgJ2Nzc19lZGl0b3InLCAnanNfZWRpdG9yJyBpbiBodG1sLCBjc3MgYW5kIGpzIGVkaXRvclxyXG4gICAgZnVuY3Rpb24gcmVuZGVyQ29kZU1pcnJvcigpIHtcclxuICAgICAgICBpZiAocmVuZGVyZWQpIHtcclxuICAgICAgICAgICAgLy8gcmV0dXJucyB0cnVlIHRvIHByZXZlbnQgZnJvbSByZS1pbml0aWFsaXplIHRoZSBlZGl0b3JzIGlmIGl0IHdhcyBhbHJlYWR5IGluaXRpYWxpemVkXHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBjc3MgZWRpdG9yXHJcbiAgICAgICAgY3NzRWRpdG9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjc3NfZWRpdG9yXCIpLCB7XHJcbiAgICAgICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxyXG4gICAgICAgICAgICBtb2RlOiAnY3NzJyxcclxuICAgICAgICAgICAgc3R5bGVBY3RpdmVMaW5lOiB0cnVlLFxyXG4gICAgICAgICAgICBhdXRvQ2xvc2VCcmFja2V0czogdHJ1ZSxcclxuICAgICAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxyXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogXCJzaW1wbGVcIixcclxuICAgICAgICAgICAgbWF0Y2hCcmFja2V0czogdHJ1ZSxcclxuICAgICAgICAgICAgZ3V0dGVyczogW1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiLCBcImJyZWFrcG9pbnRzXCJdXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgaHRtbCBlZGl0b3JcclxuICAgICAgICBodG1sRWRpdG9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJodG1sX2VkaXRvclwiKSwge1xyXG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcclxuICAgICAgICAgICAgbW9kZTogJ3RleHQvaHRtbCcsXHJcbiAgICAgICAgICAgIHN0eWxlQWN0aXZlTGluZTogdHJ1ZSxcclxuICAgICAgICAgICAgYXV0b0Nsb3NlQnJhY2tldHM6IHRydWUsXHJcbiAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyU3R5bGU6IFwic2ltcGxlXCIsXHJcbiAgICAgICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXHJcbiAgICAgICAgICAgIGd1dHRlcnM6IFtcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIiwgXCJicmVha3BvaW50c1wiXVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIGpzIGVkaXRvclxyXG4gICAgICAgIGpzRWRpdG9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc19lZGl0b3JcIiksIHtcclxuICAgICAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXHJcbiAgICAgICAgICAgIG1vZGU6ICd0ZXh0L2phdmFzY3JpcHQnLFxyXG4gICAgICAgICAgICBzdHlsZUFjdGl2ZUxpbmU6IHRydWUsXHJcbiAgICAgICAgICAgIGF1dG9DbG9zZUJyYWNrZXRzOiB0cnVlLFxyXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclN0eWxlOiBcInNpbXBsZVwiLFxyXG4gICAgICAgICAgICBtYXRjaEJyYWNrZXRzOiB0cnVlLFxyXG4gICAgICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiYnJlYWtwb2ludHNcIl1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyB1c2VkIGZvciBzZXQgdGhlIHZhbHVlIG9mIGh0bWwsIGNzcywganMgZWRpdG9ycywgbWFrZXMgZWRpdG9yIHJlYWRvbmx5IHdoaWNoIHdhcyBtYWRlIGRpc2FibGVkIGF0IHRoZSB0aW1lIG9mIHF1ZXN0aW9uIGNyZWF0aW9uLCBoaWRlIHRoZSBlZGl0b3JzIHdoaWNoIHdhcyBtYWRlIGhpZGRlbiBhdCB0aGUgdGltZSBvZiBxdWVzdGlvIGNyZWF0aW9uIGFuZCBjaGFuZ2UgdGhlIHRoZW1lIG9mIGh0bWwsIGNzcyBhbmQganMgZWRpdG9ycyBhY2NvcmRpbmcgdG8gdGhlIGNoZWNrIHN0YXR1cyBvZiAnRGFyayBUaGVtZScgY2hlY2tib3hcclxuICAgICAgICBwYXJzZVhNTCgpO1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIG1vYmlsZSB0ZWFtXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbk5hdGl2ZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2V0SGVpZ2h0ICYmIHdpbmRvdy5nZXRIZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiAoaHRtbEVkaXRvcikgPT0gXCJvYmplY3RcIiAmJiAhd2luZG93LmlzUmV2aWV3TW9kZSkge1xyXG4gICAgICAgICAgICBodG1sRWRpdG9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIHVzZWQgZm9yIHVwZGF0ZSB0aGUgdXNlciBhbnN3ZXIgeG1sIHZhbHVlIHdoZW4gdmFsdWUgb2YgaHRtbCBlZGl0b3IgZ2V0cyBjaGFuZ2VkIGFuZCByZXZpZXcgbW9kZSBpcyBvZmZcclxuICAgICAgICAgICAgICAgIHNhdmVXZWJBbnN3ZXIoaHRtbEVkaXRvci5nZXRWYWx1ZSgpLCBcImh0bWxcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIChjc3NFZGl0b3IpID09IFwib2JqZWN0XCIgJiYgIXdpbmRvdy5pc1Jldmlld01vZGUpIHtcclxuICAgICAgICAgICAgY3NzRWRpdG9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIHVzZWQgZm9yIHVwZGF0ZSB0aGUgdXNlciBhbnN3ZXIgeG1sIHZhbHVlIHdoZW4gdmFsdWUgb2YgY3NzIGVkaXRvciBnZXRzIGNoYW5nZWQgYW5kIHJldmlldyBtb2RlIGlzIG9mZlxyXG4gICAgICAgICAgICAgICAgc2F2ZVdlYkFuc3dlcihjc3NFZGl0b3IuZ2V0VmFsdWUoKSwgXCJjc3NcIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodHlwZW9mIChqc0VkaXRvcikgPT0gXCJvYmplY3RcIiAmJiAhd2luZG93LmlzUmV2aWV3TW9kZSkge1xyXG4gICAgICAgICAgICBqc0VkaXRvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1c2VkIGZvciB1cGRhdGUgdGhlIHVzZXIgYW5zd2VyIHhtbCB2YWx1ZSB3aGVuIHZhbHVlIG9mIGpzIGVkaXRvciBnZXRzIGNoYW5nZWQgYW5kIHJldmlldyBtb2RlIGlzIG9mZlxyXG4gICAgICAgICAgICAgICAgc2F2ZVdlYkFuc3dlcihqc0VkaXRvci5nZXRWYWx1ZSgpLCBcImpzXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gbm90IHN1cmUgd2h5IGl0IGlzIHVzZWQgYXMgdGhpcyBpZCBkb2VzIG5vdCBleGlzdCBoZXJlXHJcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYVhtbFwiKSkge1xyXG4gICAgICAgICAgICBsZXQgeG1sRWRpdG9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhWG1sXCIpLCB7XHJcbiAgICAgICAgICAgICAgICBsaW5lTnVtYmVyczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBtb2RlOiBcImFwcGxpY2F0aW9uL3htbFwiLFxyXG4gICAgICAgICAgICAgICAgYXV0b0Nsb3NlQnJhY2tldHM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICBtYXRjaEJyYWNrZXRzOiB0cnVlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBodG1sRWRpdG9yLnNldE9wdGlvbihcImV4dHJhS2V5c1wiLCB7XHJcbiAgICAgICAgICAgIC8vIENoYW5naW5nIFRhYnMgaW50byA0IHNwYWNlcyBcclxuICAgICAgICAgICAgVGFiOiBmdW5jdGlvbiAoY20pIHtcclxuICAgICAgICAgICAgICAgIGxldCBzcGFjZXMgPSBBcnJheShjbS5nZXRPcHRpb24oXCJpbmRlbnRVbml0XCIpICsgMykuam9pbihcIiBcIik7XHJcbiAgICAgICAgICAgICAgICBjbS5yZXBsYWNlU2VsZWN0aW9uKHNwYWNlcyk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIHRvZ2dsZSBiZXR3ZWVuIGZ1bGxTY3JlZW4gYnV0IGl0IG5vdCB3b3JrZWQgZm9yIG1lXHJcbiAgICAgICAgICAgIEYxMTogZnVuY3Rpb24gKGNtKSB7XHJcbiAgICAgICAgICAgICAgICBjbS5zZXRPcHRpb24oXCJmdWxsU2NyZWVuXCIsICFjbS5nZXRPcHRpb24oXCJmdWxsU2NyZWVuXCIpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLy8gdXNlZCBmb3IgcmVtb3ZlIHRoZSBmdWxsU2NyZWVuIG1vZGUgYnV0IGl0IG5vdCB3b3JrZWQgZm9yIG1lXHJcbiAgICAgICAgICAgIEVzYzogZnVuY3Rpb24gKGNtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY20uZ2V0T3B0aW9uKFwiZnVsbFNjcmVlblwiKSkgY20uc2V0T3B0aW9uKFwiZnVsbFNjcmVlblwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICAvLyBkZWZpbmVzIHRoYXQgZWRpdG9yIGlzIGluaXRpYWxpemVkXHJcbiAgICAgICAgcmVuZGVyZWQgPSAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHNob3dzIHRoZSBvdXRwdXQgb2YgdGhlIGNvZGUgd3JpdHRlbiBvbiB0aGUgZWRpdG9ycyBhbmQgc2V0cyB0aGUgdmFsdWUgb2Ygc3RhdGUgJ3JlbWVkaWF0aW9uVG9nZ2xlJyB0byB0cnVlIGZvciBpZGVudGlmeSB0aGF0IHJlbWVkaWF0aW9uIG1vZGUgaXMgb25cclxuICAgIGZ1bmN0aW9uIHJlbWVkaWF0aW9uTW9kZSgpIHtcclxuICAgICAgICAvLyBzZXRzIHRoZSB2YWx1ZSBvZiBzdGF0ZSAncmVtZWRpYXRpb25Ub2dnbGUnIHRvIHRydWUgdGhhdCBpbmRpY2F0ZXMgdGhhdCByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXHJcbiAgICAgICBzdGF0ZS5yZW1lZGlhdGlvblRvZ2dsZSA9IHRydWUgO1xyXG4gICAgICAgIC8vIHNob3dzIHRoZSBvdXRwdXQgb2YgdGhlIGNvZGUgaW4gJ1Jlc3VsdCcgZWRpdG9yXHJcbiAgICAgICAgcnVuQ29kZSgpO1xyXG4gICAgfVxyXG5cclxuICAgICAvLyB1c2VkIGZvciBzaG93IHRoZSByZXN1bHQgb2YgdGVzdGNhc2VzXHJcbiAgICBmdW5jdGlvbiBhbnN3ZXJDaGVja1dlYihpc1J1biA9IHRydWUpIHtcclxuICAgICAgICBsZXQgcmVzTmV3ID0ge307XHJcbiAgICAgICAgcmVzTmV3LnUgPSByZXN1bHRTYXZpbmc7XHJcbiAgICAgICAgLy8gY29udGFpbnMgcm93cyBvZiBSZW1lZGlhdGlvbiBkaWFsb2cgYm94IGluIGVhY2ggcm93IDIgY29sdW1ucyBleGlzdCBpbiBmaXJzdCBjb2x1bW4gdGVzdGNhc2UgbnVtYmVyIGRlZmluZWQgYW5kIGluIHNlY29uZCBjb2x1bW4gdGhlaXIgcmVzdWx0IHN0YXR1cyBkZWZpbmVkXHJcbiAgICAgICAgbGV0IGNhc2VfcmVzdWx0ID0gW107XHJcbiAgICAgICAgLy8gc2hvd3MgdGhlIG91dHB1dCBvZiB0aGUgY29kZSBpbiAnUmVzdWx0JyBlZGl0b3IgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSBvZiBhcmd1bWVudCB2YXJpYWJsZSAnaXNSdW4nXHJcbiAgICAgICAgaXNSdW4gPyBydW5Db2RlKCkgOiBcIlwiO1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBzdHJpbmcgZGVmaW5lZCBpbiAnVGVzdGNhc2VzJyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XHJcbiAgICAgICAgbGV0IGdldF90ZXN0X2Nhc2VzID0gc3RyaW5nQmV0d2VlbihzdGF0ZS54bWwsICc8YXV0b2dyYWRlIHR5cGU9XCJ0ZXN0Y2FzZVwiPicsICc8L2F1dG9ncmFkZT4nKTtcclxuICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBhbnkgdGVzdGNhc2UgZGVmaW5lZCBpbiAnVGVzdGNhc2VzJyBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XHJcbiAgICAgICAgaWYgKGdldF90ZXN0X2Nhc2VzKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBzdHJpbmcgaWYgZXhpc3QgaW4gdmFyaWFibGUgJ2dldF90ZXN0X2Nhc2VzJyBvdGhlcndpc2UgYmxhbmsgdmFsdWUgY29udGFpbnNcclxuICAgICAgICAgICAgZ2V0X3Rlc3RfY2FzZXMgPSBnZXRfdGVzdF9jYXNlcyA/IGdldF90ZXN0X2Nhc2VzLnRyaW0oKSA6IFwiXCI7XHJcbiAgICAgICAgICAgIC8vIHJlcGxhY2VzIHN0cmluZyBzdGFydHMgZnJvbSAnPC9jYXNlPicgYW5kIGVuZHMgYXQgJzxjYXNlPicgd2l0aCAnOycgYW5kIHJlcGxhY2VzIHNpbmdsZSAnPC9jYXNlPicgb3IgJzxjYXNlPicgd2l0aCBibGFuayBcclxuICAgICAgICAgICAgZ2V0X3Rlc3RfY2FzZXMgPSBnZXRfdGVzdF9jYXNlcy5yZXBsYWNlKC88XFwvY2FzZT5bXFxzXFxTXSo/PGNhc2U+L2dtLCBcIjtcIikucmVwbGFjZSgvPFxcL2Nhc2U+fDxjYXNlPi9nLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgYXJyYXkgb2YgZGVmaW5lZCB0ZXN0Y3NlcyB3aGljaCBleGlzdCBpbiAnVGVzdGNhc2VzJyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XHJcbiAgICAgICAgICAgIGdldF90ZXN0X2Nhc2VzID0gZ2V0X3Rlc3RfY2FzZXMuc3BsaXQoXCI7XCIpO1xyXG4gICAgICAgICAgICAvLyBsb29wcyB0aHJvdWdoIHRoZSBlYWNoIHRlc3RjYXNlXHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgaW4gZ2V0X3Rlc3RfY2FzZXMpIHtcclxuICAgICAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHRlc3RjYXNlIGlzIGRlZmluZWQgaW4gJ1Rlc3RjYXNlcycgZmllbGQgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxyXG4gICAgICAgICAgICAgICAgaWYgKHRlc3RjYXNlQ2hlY2soZ2V0X3Rlc3RfY2FzZXNbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSByb3cgaW4gY2FzZV9yZXN1bHQgYXJyYXkgd2l0aCB0ZXN0Y2FzZSBudW1iZXIgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgKyAxIHdpdGggcHJpZml4ICdUZXN0IENhc2UnIGFuZCByZXN1bHQgc3RhdHVzIGFzIFBhc3NlZCBpZiB2YWx1ZSByZXR1cm5lZCBieSBtZXRob2QgdGVzdGNhc2VDaGVjayBpcyB0cnVlXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZV9yZXN1bHQucHVzaCgnPHRyPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkPlRlc3QgQ2FzZScgKyAocGFyc2VJbnQoaSkgKyAxKSArICc8L3RkPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkPlBhc3NlZDwvdGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3RyPicpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBwdXNoZXMgdGhlIHJvdyBpbiBjYXNlX3Jlc3VsdCBhcnJheSB3aXRoIHRlc3RjYXNlIG51bWJlciBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdpJyArIDEgd2l0aCBwcmlmaXggJ1Rlc3QgQ2FzZScgYW5kIHJlc3VsdCBzdGF0dXMgYXMgRmFpbGVkIGlmIHZhbHVlIHJldHVybmVkIGJ5IG1ldGhvZCB0ZXN0Y2FzZUNoZWNrIGlzIGZhbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZV9yZXN1bHQucHVzaCgnPHRyPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkPlRlc3QgQ2FzZScgKyAocGFyc2VJbnQoaSkgKyAxKSArICc8L3RkPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkPkZhaWxlZDwvdGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3RyPicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB0ZXN0Y2FzZXMgZGVmaW5lZCBpbiAnSW50ZXJuYWwgU2NyaXB0JyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XHJcbiAgICAgICAgbGV0IGdldF9pbnRlcm5hbF9jYXNlcyA9IHN0cmluZ0JldHdlZW4oc3RhdGUueG1sLCAnPGF1dG9ncmFkZSB0eXBlPVwiaW50ZXJuYWxcIj4nLCAnPC9hdXRvZ3JhZGU+Jyk7XHJcbiAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgYW55IHRlc3RjYXNlIGRlZmluZWQgaW4gJ0ludGVybmFsIFNjcmlwdCcgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxyXG4gICAgICAgIGlmIChnZXRfaW50ZXJuYWxfY2FzZXMpIHtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgc3RyaW5nIGlmIGV4aXN0IGluICdJbnRlcm5hbCBTY3JpcHQnIG90aGVyd2lzZSBjb250YWlucyBibGFuayB2YWx1ZVxyXG4gICAgICAgICAgICBnZXRfaW50ZXJuYWxfY2FzZXMgPSBnZXRfaW50ZXJuYWxfY2FzZXMgPyBnZXRfaW50ZXJuYWxfY2FzZXMudHJpbSgpIDogXCJcIjtcclxuICAgICAgICAgICAgLy8gcmVwbGFjZXMgc3RyaW5nIHN0YXJ0cyBmcm9tICc8L2Nhc2U+JyBhbmQgZW5kcyBhdCAnPGNhc2U+JyB3aXRoICc7JyBhbmQgcmVwbGFjZXMgc2luZ2xlICc8L2Nhc2U+JyBvciAnPGNhc2U+JyB3aXRoIGJsYW5rIFxyXG4gICAgICAgICAgICBnZXRfaW50ZXJuYWxfY2FzZXMgPSBnZXRfaW50ZXJuYWxfY2FzZXMucmVwbGFjZSgvPFxcL2Nhc2U+W1xcc1xcU10qPzxjYXNlPi9nbSwgXCI7XCIpLnJlcGxhY2UoLzxcXC9jYXNlPnw8Y2FzZT4vZywgXCJcIik7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIGFycmF5IG9mIGRlZmluZWQgdGVzdGNzZXMgd2hpY2ggZXhpc3QgaW4gJ0ludGVybmFsIFNjcmlwdCcgZmllbGQgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxyXG4gICAgICAgICAgICBnZXRfaW50ZXJuYWxfY2FzZXMgPSBnZXRfaW50ZXJuYWxfY2FzZXMuc3BsaXQoXCI7XCIpO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGdldF9pbnRlcm5hbF9jYXNlcykge1xyXG4gICAgICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSByb3cgaW4gY2FzZV9yZXN1bHQgYXJyYXkgd2l0aCB0ZXN0Y2FzZSBudW1iZXIgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgKyAxIHdpdGggcHJpZml4ICdJbnRlcm5hbCBDYXNlJyBhbmQgcmVzdWx0IHN0YXR1cyBhcyBQYXNzZWQgaWYgdmFsdWUgcmV0dXJuZWQgYnkgbWV0aG9kIGludGVybmFsQ2hlY2sgaXMgdHJ1ZVxyXG4gICAgICAgICAgICAgICAgaWYgKGludGVybmFsQ2hlY2soZ2V0X2ludGVybmFsX2Nhc2VzW2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2VfcmVzdWx0LnB1c2goJzx0cj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZD5JbnRlcm5hbCBDYXNlJyArIChwYXJzZUludChpKSArIDEpICsgJzwvdGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQ+UGFzc2VkPC90ZD4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdHI+Jyk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhc2VfcmVzdWx0LnB1c2goJzx0cj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZD5JbnRlcm5hbCBDYXNlJyArIChwYXJzZUludChpKSArIDEpICsgJzwvdGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQ+RmFpbGVkPC90ZD4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdHI+Jyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHRlc3RjYXNlcyBkZWZpbmVkIGluICdFeHRlcm5hbCBTY3JpcHQnIGZpZWxkIG9mICdBdXRvZ3JhZGUnIGRpYWxvZyBib3hcclxuICAgICAgICBsZXQgZ2V0X2V4dGVybmFsX2Nhc2VzID0gc3RyaW5nQmV0d2VlbihzdGF0ZS54bWwsICc8YXV0b2dyYWRlIHR5cGU9XCJjdXN0b21cIj4nLCAnPC9hdXRvZ3JhZGU+Jyk7XHJcbiAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgYW55IHRlc3RjYXNlIGRlZmluZWQgaW4gJ0V4dGVybmFsIFNjcmlwdCcgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxyXG4gICAgICAgIGlmIChnZXRfZXh0ZXJuYWxfY2FzZXMpIHtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mICdFeHRlbmFsIFNjcmlwdCcgZmllbGQgXHJcbiAgICAgICAgICAgIGxldCBnZXRfY2FzZSA9IGdldF9leHRlcm5hbF9jYXNlcy5yZXBsYWNlKC88Y2FzZT58PFxcL2Nhc2U+L2dtLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSByb3cgaW4gY2FzZV9yZXN1bHQgYXJyYXkgd2l0aCB0ZXN0Y2FzZSBudW1iZXIgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgKyAxIHdpdGggcHJpZml4ICdJbnRlcm5hbCBDYXNlJyBhbmQgcmVzdWx0IHN0YXR1cyBhcyBGYWlsZWQgIGlmIHZhbHVlIHJldHVybmVkIGJ5IG1ldGhvZCBleHRlcm5hbENoZWNrIGlzIHRydWVcclxuICAgICAgICAgICAgaWYgKGV4dGVybmFsQ2hlY2soZ2V0X2Nhc2UpKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlX3Jlc3VsdC5wdXNoKCc8dHI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzx0ZD5FeHRlcm5hbCBDYXNlPC90ZD4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPHRkPlBhc3NlZDwvdGQ+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+Jyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBwdXNoZXMgdGhlIHJvdyBpbiBjYXNlX3Jlc3VsdCBhcnJheSB3aXRoIHRlc3RjYXNlIG51bWJlciBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdpJyArIDEgd2l0aCBwcmlmaXggJ0ludGVybmFsIENhc2UnIGFuZCByZXN1bHQgc3RhdHVzIGFzIEZhaWxlZCAgaWYgdmFsdWUgcmV0dXJuZWQgYnkgbWV0aG9kIGV4dGVybmFsQ2hlY2sgaXMgZmFsc2VcclxuICAgICAgICAgICAgICAgIGNhc2VfcmVzdWx0LnB1c2goJzx0cj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPHRkPkV4dGVybmFsIENhc2U8L3RkPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8dGQ+RmFpbGVkPC90ZD4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC90cj4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBqb2lucyB0aGUgYXJyYXkgJ2Nhc2VfcmVzdWx0JyBpbiBzdHJpbmcgXHJcbiAgICAgICAgbGV0IGNhc2Vfc3RyID0gY2FzZV9yZXN1bHQuam9pbihcIlwiKTtcclxuICAgICAgICAvLyB1c2VkIGZvciBzaG93IHRoZSBhbnN3ZXIgY29ycmVjdCBvZiBpbmNvcnJlY3QgaW4gbW9iaWxlXHJcbiAgICAgICAgbGV0IGluTmF0aXZlSXNDb3JyZWN0ID0gbnVsbFxyXG4gICAgICAgIGlmICgvRmFpbGVkL2dpLnRlc3QoY2FzZV9zdHIpKSB7XHJcbiAgICAgICAgICAgIC8vIHVuY2hlY2sgdGhlIGVsZW1lbnQgaGF2ZSBpZCAnYW5zd2VyJyBpZiAnRmFpbGVkJyBzdHJpbmcgZXhpc3QgaW4gcmVzdWx0IHN0cmluZ1xyXG4gICAgICAgICAgICAvL2pRdWVyeShcIiNhbnN3ZXJcIikucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICByZXNOZXcuYSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBBSS5zZWxlY3QoXCIjYW5zd2VyXCIpLmNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJ2ZhbHNlJyBvZiB2YXJpYWJsZSAnaW5OYXRpdmVJc0NvcnJlY3QnIHRvIHNob3cgaW5jb3JyZWN0IGFuc3dlciBpbiBtb2JpbGVcclxuICAgICAgICAgICAgaW5OYXRpdmVJc0NvcnJlY3QgPSBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL2pRdWVyeShcIiNhbnN3ZXJcIikucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHJlc05ldy5hID0gdHJ1ZTtcclxuICAgICAgICAgICAgQUkuc2VsZWN0KFwiI2Fuc3dlclwiKS5jaGVja2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJ3RydWUnIG9mIHZhcmlhYmxlICdpbk5hdGl2ZUlzQ29ycmVjdCcgdG8gc2hvdyBjb3JyZWN0IGFuc3dlciBpbiBtb2JpbGVcclxuICAgICAgICAgICAgaW5OYXRpdmVJc0NvcnJlY3QgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB1c2VkIGZvciBtb2JpbGUgdGVhbVxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcclxuICAgICAgICAgICAgd2luZG93LmdldEhlaWdodCAmJiB3aW5kb3cuZ2V0SGVpZ2h0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHVzZWQgZm9yIG1vYmlsZSB0ZWFtXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbk5hdGl2ZSkgeyAvLyByZXBsYWNlZCAjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWxcclxuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHsgdXNlckFuc3dlcnM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3BlY2lhbF9tb2R1bGVfdXNlcl94bWxcIikudmFsdWUsIGluTmF0aXZlSXNDb3JyZWN0IH0pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZGVmaW5lcyB0aGUgdGFibGUgY29udGFpbmluZyB0aGUgZmllbGQgJ1Rlc3QgQ2FzZScgYW5kICdSZXN1bHQnIGluIHRhYmxlIGhlYWQgYW5kIHZhbHVlIHN0b3JlZCBpbiB2YXJpYWJsZSAnY2FzZV9zdHInIGFzIGJvZHkgcGFydCBvZiB0aGUgdGFibGVcclxuICAgICAgICBsZXQgcmV2aWV3TGF5b3V0ID0gXCI8dGFibGUgc3R5bGU9XFxcIndpZHRoOjUwMHB4O1xcXCIgY2xhc3M9XFxcInRhYmxlXFxcIj48dGhlYWQgY2xhc3M9XFxcInRoZWFkLWludmVyc2VcXFwiPjx0ciBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjojNDI4NUY0Jz48dGggc3R5bGU9J2JhY2tncm91bmQtY29sb3I6IzQyODVGNCc+VGVzdCBDYXNlPC90aD48dGg+UmVzdWx0PC90aD48L3RyPjwvdGhlYWQ+XCIgKyBjYXNlX3N0ciArIFwiPC90YWJsZT5cIjtcclxuICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXHJcbiAgICAgICAgaWYgKHN0YXRlLnJlbWVkaWF0aW9uVG9nZ2xlKSB7XHJcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIHRhYmxlIGluIGVsZW1lbnQgaGF2ZSBpZCAncmVtZWRpYXRpb25Nb2RlbCcgbWVhbnMgaW4gcmVtZWRpYXRpb24gZGlhbG9nIGJveFxyXG4gICAgICAgICAgICAvL2pRdWVyeShcIiNyZW1lZGlhdGlvbk1vZGVsXCIpLmh0bWwocmV2aWV3TGF5b3V0KTsgLy8gUmVwbGFjZWRcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW1lZGlhdGlvbk1vZGVsJykuaW5uZXJIVE1MID0gcmV2aWV3TGF5b3V0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBvblVzZXJBbnNDaGFuZ2Uoe3VYbWw6cmVzTmV3LnUsYW5zOnJlc05ldy5hfSk7XHJcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgZGVmaW5lZCB0YWJsZVxyXG4gICAgICAgIHJldHVybiAocmV2aWV3TGF5b3V0KTtcclxuICAgIH1cclxuXHJcbiAgICAgLy8gcmV0dXJucyB0cnVlIG9yIGZhbHNlIGFjY29yZGluZyB0byB0aGUgbWF0Y2hlZCB2YWx1ZSBvZiB0ZXN0Y2FzZSBkZWZpbmVkIGluICdUZXN0Y2FzZXMnIGZpZWxkIG9mICdBdXRvZ3JhZGUnIGRpYWxvZyBib3hcclxuICAgIGZ1bmN0aW9uIHRlc3RjYXNlQ2hlY2soZ2V0X2Nhc2VzKSB7XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGFycmF5IGFmdGVyIHNwbGl0aW5nIGJ5IHN5bWJvbCAnfCdcclxuICAgICAgICBsZXQgY2FzZUFyciA9IGdldF9jYXNlcy5zcGxpdChcInxcIik7XHJcbiAgICAgICAgLy8gZGVub3RlcyB0aGF0IGFycmF5IGFyZ3VtZW50IHBhc3NlZFxyXG4gICAgICAgIGxldCBmSW5wID0gMDtcclxuICAgICAgICAvLyBjb250YWlucyB0aGUgbmFtZSBvZiB0aGUgZnVuY3Rpb24gZGVmaW5lZCBpbiB0ZXN0Y2FzZVxyXG4gICAgICAgIGxldCB0ZXN0X2Z1bmMgPSBjYXNlQXJyWzBdO1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBhcmd1bWVudHMgb2YgdGhlIGZ1bmN0aW9uIGRlZmluZWQgaW4gdGVzdGNhc2VcclxuICAgICAgICBsZXQgdGVzdF9pbnAgPSBjYXNlQXJyWzFdO1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHJldHVybiB2YWx1ZSBvZiB0aGUgZnVuY3Rpb24gZGVmaW5lZCBpbiB0ZXN0Y2FzZVxyXG4gICAgICAgIGxldCB0ZXN0X291cCA9IGNhc2VBcnJbMl07XHJcbiAgICAgICAgLy8gdXNlZCBmb3IgaG9sZCB0aGUgZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgIGxldCBlcnJvciA9IHt9O1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIGNvbnRhaW4gdGhlIHZhbHVlIG9mIGpzIGVkaXRvclxyXG4gICAgICAgIGxldCBqc19kYXRhID0gXCJcIjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIChjYXNlQXJyWzFdKSA9PSAnc3RyaW5nJyAmJiBjYXNlQXJyWzFdLmluZGV4T2YoJ3thcnInKSA8IDApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGFuIGFycmF5IGFmdGVyIHJlcGxhY2luZyAne3BpcH0nIHdpdGggJ3wnIGFuZCBzcGxpdGluZyB3aXRoIGNvbW1hXHJcbiAgICAgICAgICAgICAgICB0ZXN0X2lucCA9IGNhc2VBcnJbMV0ucmVwbGFjZSgne3BpcH0nLCAnfCcpLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChjYXNlQXJyWzFdLmluZGV4T2YoJ3thcnInKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyBhbiBhcnJheSBhZnRlciByZXBsYWNpbmcgJ3thcnInIG9yICd9JyB3aXRoIGJsYW5rIHZhbHVlIGFuZCBzcGxpdGluZyB3aXRoIGNvbW1hXHJcbiAgICAgICAgICAgICAgICB0ZXN0X2lucCA9IChjYXNlQXJyWzFdLnJlcGxhY2UoL1xce2FycnxcXH0vZywgJycpKS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHZhbHVlICcxJyB0byBkZW5vdGUgdGhhdCBhcnJheSBhcmd1bWVudCBwYXNzZWRcclxuICAgICAgICAgICAgICAgIGZJbnAgPSAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGFyZ3VtZW50cyBvZiB0aGUgZnVuY3Rpb24gZGVmaW5lZCBpbiB0ZXN0Y2FzZVxyXG4gICAgICAgICAgICAgICAgdGVzdF9pbnAgPSBjYXNlQXJyWzFdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBqcyBlZGl0b3IgYWZ0ZXIgcmVtb3Zpbmcgd2hpdGUgc3BhY2UgZnJvbSBzdGFydCBhbmQgZW5kIG9mIHRoZSBzdHJpbmdcclxuICAgICAgICAgICAganNfZGF0YSA9IGpzRWRpdG9yLmdldFZhbHVlKCkudHJpbSgpO1xyXG4gICAgICAgICAgICAvLyByZW1vdmVzIGFsbCB0aGUgdGV4dCB0aGF0IGV4aXN0IGluIHNhbWUgbGluZSBzdGFydGluZyBmcm9tICdkb2N1bWVudC53cml0ZScgc3RyaW5nIG9mIGpzIGVkaXRvciB2YWx1ZSBcclxuICAgICAgICAgICAganNfZGF0YSA9IGpzX2RhdGEucmVwbGFjZSgvZG9jdW1lbnRcXC53cml0ZS4qL2dtLCAnJyk7XHJcbiAgICAgICAgICAgIC8vIGlmIGZ1bmN0aW9uIG5hbWUsIGFyZ3VtZW50IG9mIHRoZSBmdW5jdGlvbiBvciB2YWx1ZSBvZiBmdW5jdGlvbiByZXR1cm4gaXMgbm90IGRlY2xhaXJlZCBpbiB0ZXN0Y2FzZSB0aGVuIHdpdGhvdXQgY2hlY2tpbmcgYW5zd2VyIGl0IHJldHVybnMgZnJvbSBmdW5jdGlvbiBieSByZXR1cm5pbmcgdmFsdWUgJ2ZhbHNlJ1xyXG4gICAgICAgICAgICBpZiAoIXRlc3RfZnVuYyB8fCAhdGVzdF9pbnAgfHwgIXRlc3Rfb3VwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzZXRzIHRoZSBlcnJvciBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICBlcnJvcltcInZhbGlkYXRpb25cIl0gPSBcIkludmFsaWQgVGVzdCBDYXNlc1wiO1xyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyB2YWx1ZSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGlmIHR5cGUgb2YgdGhlIGZ1bmN0aW9uIGlzIHVuZGVmaW5lZCB0aGVuIGFsc28gcmV0dXJucyBmcm9tIGZ1bmN0aW9uIHdpdGhvdXQgY2hlY2tpbmcgdGhlIGFuc3dlciBhZnRlciBzZXR0aW5nIGVycm9yIG1lc3NhZ2VcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGVzdF9mdW5jKSA9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIGVycm9yW1wiZnVuY19jaGVja1wiXSA9IFwiRnVuY3Rpb24gY2FzZSBpcyB1bmRlZmluZWRcIjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBwYXR0ZXJuIGZvciBjb250YWluIHRoZSBcclxuICAgICAgICAgICAgbGV0IHJlID0gbmV3IFJlZ0V4cChcImZ1bmN0aW9uIFwiICsgdGVzdF9mdW5jICsgXCIuKj9cXFxcKVwiLCBcImdcIik7XHJcbiAgICAgICAgICAgIC8vIGFycmF5IGZvciBob2xkIHRoZSBtYXRjaGVkIHRleHQgcmV0dXJuIGJ5IHRoZSAnZXhlYycgbWV0aG9kXHJcbiAgICAgICAgICAgIGxldCBwYXJhbXMgPSBbXTtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHRleHQgdGhhdCBtYXRjaGVzIGluIGpzIGVkaXRvciB2YWx1ZSBmb3IgcGF0dGVybiBkZWZpbmVkIGluIHZhcmlhYmxlICdyZSdcclxuICAgICAgICAgICAgcGFyYW1zID0gcmUuZXhlYyhqc19kYXRhKTtcclxuICAgICAgICAgICAgLy8gY29udmVydHMgYXJyYXkgJ3BhcmFtcycgaW50byBzdHJpbmdcclxuICAgICAgICAgICAgcGFyYW1zID0gcGFyYW1zLmpvaW4oKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgLy8gaG9sZGVzIGVycm9yIG1lc2FhZ2UgaW4gY2FzZSBvZiBhbnkgZXJyb3Igb2NjdXJyZWRcclxuICAgICAgICAgICAgZXJyb3JbJ2Z1bmN0aW9uX2V4aXN0J10gPSBcIkdpdmVuIEZ1bmN0aW9uIGRvZXNuJ3QgZXhpc3RcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdXNlZCBmb3IgY29udGFpbnMgdGhlIGpzIGVkaXRvciB2YWx1ZSBhbmQgZnVuY3Rpb24gY2FsbCBzdHJpbmcgd2l0aCBhcmd1bWVudHNcclxuICAgICAgICBsZXQgZXZhbF9zdHIgPSBcIlwiO1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKGlucCkgPT0gJ2FycmF5JyB8fCB0eXBlb2YgKGlucCkgPT0gJ29iamVjdCcgJiYgIWZJbnApIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGpzIGVkaXRvciB2YWx1ZSBhbmQgY2FsbHMgZnVuY3Rpb24gd2l0aCBhcmd1bWVudCBkZWZpbmVkIGluIHRlc3RjYXNlIGFmdGVyIGpvaW5pbmcgdGhlIGFyZ3VtZW50IGluIHN0cmluZyBhbmQgd3JhcHBpbmcgaW4gcGFyZW50aGVzaXMgaWYgaXQgaXMgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBldmFsX3N0ciA9IGpzX2RhdGEgKyAnXFxuJyArIHRlc3RfZnVuYyArICcoJyArIHRlc3RfaW5wLmpvaW4oKSArICcpOyc7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZklucCkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMganMgZWRpdG9yIHZhbHVlIGFuZCBjYWxscyBmdW5jdGlvbiB3aXRoIGFyZ3VtZW50IGRlZmluZWQgaW4gdGVzdGNhc2UgYWZ0ZXIgd3JhcHBpbmcgdGhlIGFyZ3VtZW50IGluIHNxdWFyZSBicmFja2V0IHRoZW4gaW4gcGFyZW50aGVzaXMgaWYgdmFsdWUgb2YgdmFyaWFibGUgJ2ZJbnAnIGhvbGRzIDFcclxuICAgICAgICAgICAgICAgIGV2YWxfc3RyID0ganNfZGF0YSArICdcXG4nICsgdGVzdF9mdW5jICsgJyhbJyArIHRlc3RfaW5wICsgJ10pOyc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyBqcyBlZGl0b3IgdmFsdWUgYW5kIGNhbGxzIGZ1bmN0aW9uIHdpdGggYXJndW1lbnQgZGVmaW5lZCBpbiB0ZXN0Y2FzZSBhZnRlciB3cmFwcGluZyBhcmd1bWVudCBpbiBwYXJlbnRoZXNpcyBcclxuICAgICAgICAgICAgICAgIGV2YWxfc3RyID0ganNfZGF0YSArICdcXG4nICsgdGVzdF9mdW5jICsgJygnICsgdGVzdF9pbnAgKyAnKTsnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGV2YWx1dGUgdGhlIHN0cmluZyBob2xkIGluIHZhcmlhYmxlICdldmFsX3N0cicgYW5kIGNvbnRhaW5zIGl0cyBvdXRwdXRcclxuICAgICAgICAgICAgbGV0IGFjdHVhbF9vdXRwID0gZXZhbChldmFsX3N0cik7XHJcbiAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZS9mYWxzZSBpZiBldmFsdWF0ZWQgdmFsdWUgbWF0aGNoZXMgd2l0aCBmdW5jdGlvbiByZXR1cm4gdmFsdWUgZGVmaW5lZCBpbiB0ZXN0Y2FzZVxyXG4gICAgICAgICAgICBpZiAoYWN0dWFsX291dHAgPT0gdGVzdF9vdXApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIGVycm9yIG1lc3NhZ2UgaW4gY2FzZSBvZiBlcnJvciBcclxuICAgICAgICAgICAgZXJyb3JbJ291dHB1dF9lcnJvciddID0gZXJyO1xyXG4gICAgICAgICAgICAvLyByZXR1cm5zIGZyb20gZnVuY3Rpb24gYnkgcmV0dXJuaW5nIHZhbHVlICdmYWxzZSdcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgLy8gc3BsaXRlIHRoZSB0ZXN0Y2FzZSBhbmQgcmV0dXJucyB0aGUgYXJyYXkgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSBvZiBvbGQgb3IgbmV3IHRlc3RjYXNlIGZvcm1hdCBmb3IgbWF0Y2ggaHRtbCBvciBjc3NcclxuICAgIGZ1bmN0aW9uIHNwbGl0Q2FzZShjYXNlRGF0YSwgdHlwZSkge1xyXG4gICAgICAgIGlmICh0eXBlID09ICdzdHlsZScpIHtcclxuICAgICAgICAgICAgaWYgKGNhc2VEYXRhLmluY2x1ZGVzKFwiJFwiKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gaW5kaWNhdGVzIHRoZSBpdCBpcyBuZXcgdGVzdGNhc2UgZm9ybWF0IGZvciBjc3MgbWF0Y2hcclxuICAgICAgICAgICAgICAgIGlzT2xkVGVzdGNhc2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0ZSBmcm9tIHN5bWJvbCAnJCcgYW5kIHJldHVybnMgdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FzZURhdGEuc3BsaXQoXCIkXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaW5kaWNhdGVzIHRoZSBpdCBpcyBvbGQgdGVzdGNhc2UgZm9ybWF0IGZvciBjc3MgbWF0Y2hcclxuICAgICAgICAgICAgICAgIGlzT2xkVGVzdGNhc2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8gc3BsaXRlIGZyb20gc3ltYm9sICd7JyBhbmQgcmV0dXJucyB0aGUgYXJyYXlcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYXNlRGF0YS5zcGxpdChcIntcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY2FzZURhdGEuaW5jbHVkZXMoXCI/XCIpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBpbmRpY2F0ZXMgdGhlIGl0IGlzIG5ldyB0ZXN0Y2FzZSBmb3JtYXQgZm9yIGh0bWwgbWF0Y2hcclxuICAgICAgICAgICAgICAgIGlzT2xkVGVzdGNhc2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0ZSBmcm9tIHN5bWJvbCAnPycgYW5kIHJldHVybnMgdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FzZURhdGEuc3BsaXQoXCI/XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaW5kaWNhdGVzIHRoZSBpdCBpcyBvbGQgdGVzdGNhc2UgZm9ybWF0IGZvciBodG1sIG1hdGNoXHJcbiAgICAgICAgICAgICAgICBpc09sZFRlc3RjYXNlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0ZSBmcm9tIHN5bWJvbCAnfCcgYW5kIHJldHVybnMgdGhlIGFycmF5XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FzZURhdGEuc3BsaXQoXCJ8XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcclxuICAgIGZ1bmN0aW9uIGNoZWNrT2xkQXR0clRlc3RDYXNlKHBhdHRlcm4sIG91dHAsIG1pbiwgcGFydCkge1xyXG4gICAgICAgIC8vIGFycmF5IGNvbnRhaW5pbmcgYWxsIHRoZSBtYXRjaGVkIHN0cmluZyBpbiBodG1sIGVkaXRvciBkZWZpbmVkIGluIG1hdGNoaW5nIHBhdHRlcm5cclxuICAgICAgICBsZXQgbWF0Y2hIdG1sID0gaHRtbEVkaXRvci5nZXRWYWx1ZSgpLm1hdGNoKHBhdHRlcm4pO1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIGRlZmluZSB0aGUgdGVzdGNhc2UgcmVzdWx0IHN0YXR1cyBcclxuICAgICAgICBsZXQgcmVzdWx0ID0gMDtcclxuICAgICAgICBpZiAobWF0Y2hIdG1sKSB7XHJcbiAgICAgICAgICAgIGlmIChwYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGVzIHRlbXBvcmFyeSBhcnJheSBmb3IgaG9sZCB0aGUgbWF0Y2hlZCBkYXRhXHJcbiAgICAgICAgICAgICAgICBsZXQgdGVtcE1hdGNoID0gW107XHJcbiAgICAgICAgICAgICAgICBtYXRjaEh0bWwubWFwKCh2YWx1ZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5yZXBsYWNlKC9cXHMvZywgJycpLmluY2x1ZGVzKHBhcnQucmVwbGFjZSgvXFxzL2csICcnKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcE1hdGNoLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlLCBwYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdtYXRjaEh0bWwnXHJcbiAgICAgICAgICAgICAgICBtYXRjaEh0bWwgPSB0ZW1wTWF0Y2g7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1pbikge1xyXG4gICAgICAgICAgICAgICAgLy8gaG9sZHMgJzAnIGlmIG51bWJlciBvZiBtYXRjaGVkIG9jY3VyZW5jZSBpcyBsZXNzIHRoYW4gbWluIHZhbHVlIG90aGVyd2lzZSBob2xkcyAxXHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBtYXRjaEh0bWwubGVuZ3RoIDwgb3V0cCA/IDAgOiAxO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gaG9sZHMgJzAnIGlmIG51bWJlciBvZiBvY2N1cmVuY2UgaXMgZ3JlYXRlciB0aGFuIG1heCB2YWx1ZSBvdGhlcndpc2UgaG9sZHMgMVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbWF0Y2hIdG1sLmxlbmd0aCA+IG91dHAgPyAwIDogMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXR1cm5zIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSByZXN1bHRcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHJldHVybnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcclxuICAgIGZ1bmN0aW9uIGNoZWNrTmV3VGVzdENhc2UobWluLCBjb3VudGVyLCBvdXRwKSB7XHJcbiAgICAgICAgLy8gdXNlZCBmb3IgZGVmaW5lIHRoZSB0ZXN0Y2FzZSByZXN1bHQgc3RhdHVzIFxyXG4gICAgICAgIGxldCByZXN1bHQgPSAxO1xyXG4gICAgICAgIGlmIChtaW4pIHtcclxuICAgICAgICAgICAgLy8gaG9sZHMgJzAnIGlmIG51bWJlciBvZiBtYXRjaGVkIG9jY3VyZW5jZSBpcyBsZXNzIHRoYW4gbWluIHZhbHVlXHJcbiAgICAgICAgICAgIGlmICgoY291bnRlcikgPCBvdXRwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gaG9sZHMgJzAnIGlmIG51bWJlciBvZiBtYXRjaGVkIG9jY3VyZW5jZSBpcyBncmVhdGVyIHRoYW4gbWF4IHZhbHVlXHJcbiAgICAgICAgICAgIGlmICgoY291bnRlcikgPiBvdXRwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGhvbGRzICcwJyB0b28gaWYgY291bnRlciB2YWx1ZSBpcyAwXHJcbiAgICAgICAgaWYgKGNvdW50ZXIgPT0gMCkge1xyXG4gICAgICAgICAgICByZXN1bHQgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyByZXR1cm5zIHRoZSByZXN1bHQgdmFsdWVcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVzZWQgZm9yIGNhbGwgdGhlICdhdHRyX21hdGNoJywgJ3N0eWxlX21hdGNoJyBvciAnc3RyX21hdGNoJyBtZXRob2Qgd2l0aCByZXF1aXJlZCBhcmd1bWVudHMgYW5kIHJldHVybnMgdGhlIHZhbHVlIGFjY29yZGluZyB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZXNlIG1ldGhvZHNcclxuICAgIGZ1bmN0aW9uIGludGVybmFsQ2hlY2soZ2V0X2Nhc2VzKSB7XHJcbiAgICAgICAgLy8gc3BsaXRlIHRoZSB0ZXN0Y2FzZSBhbmQgcmV0dXJucyB0aGUgYXJyYXkgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSBvZiBvbGQgb3IgbmV3IHRlc3RjYXNlIGZvcm1hdCBmb3IgbWF0Y2ggaHRtbCBvciBjc3NcclxuICAgICAgICBsZXQgY2FzZUFyciA9IHNwbGl0Q2FzZShnZXRfY2FzZXMpO1xyXG4gICAgICAgIGxldCBzdHIgPSBcIlwiLCBpO1xyXG4gICAgICAgIGlmIChjYXNlQXJyWzBdLmluZGV4T2YoXCJzdHlsZV9tYXRjaFwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZSBvciBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIHJldHVybiB2YWx1ZSBvZiBtZXRob2QgJ3N0eWxlX21hdGNoJ1xyXG4gICAgICAgICAgICByZXR1cm4gc3R5bGVfbWF0Y2goY2FzZUFyclsxXSwgY2FzZUFyclsyXSwgY2FzZUFyclszXSk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChjYXNlQXJyWzBdLmluZGV4T2YoXCJhdHRyX21hdGNoXCIpID4gLTEpIHtcclxuICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaW4gY2FzZSBvZiBzdHJpbmcgbWF0Y2hlZCBpbiBkZWZpbmVkIHRhZyBhbmQgdGhhdCB0YWcgY29udGFpbnMgY2hhcmFjdGVyICc/J1xyXG4gICAgICAgICAgICBpZiAoY2FzZUFyci5sZW5ndGggPiA0KSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAyOyBpIDwgKGNhc2VBcnIubGVuZ3RoIC0gMSk7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IDIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkcyB0aGUgc3RyaW5nIGRlZmluZWQgaW4gYXJyYXkgJ2Nhc2VBcnInIGF0IGluZGV4ICcyJyBpbiBzdHJpbmcgZGVmaW5lZCBpbiB2YXJpYWJsZSAnc3RyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyBjYXNlQXJyW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZHMgdGhlIGNoYXJhY3RlciAnPycgYW5kIHN0cmluZyBkZWZpbmVkIGluIGFycmF5ICdjYXNlQXJyJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdpJyBpbiBzdHJpbmcgZGVmaW5lZCBpbiB2YXJpYWJsZSAnc3RyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyAnPycgKyBjYXNlQXJyW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZSBvZiBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIHJldHVybiB2YWx1ZSBvZiBtZXRob2QgJ2F0dHJfbWF0Y2gnXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXR0cl9tYXRjaChjYXNlQXJyWzFdLCBzdHIsIGNhc2VBcnJbKGNhc2VBcnIubGVuZ3RoIC0gMSldKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZSBvZiBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIHJldHVybiB2YWx1ZSBvZiBtZXRob2QgJ2F0dHJfbWF0Y2gnXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYXR0cl9tYXRjaChjYXNlQXJyWzFdLCBjYXNlQXJyWzJdLCBjYXNlQXJyWzNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGluIGNhc2Ugb2Ygc3RyaW5nIG1hdGNoZWQgYW55d2hlcmUgaW4gd2hvbGUgaHRtbCBvciBqcyBlZGl0b3IgYW5kIHRoYXQgZWRpdG9yIGNvbnRhaW5zIGNoYXJhY3RlciAnPydcclxuICAgICAgICAgICAgaWYgKGNhc2VBcnIubGVuZ3RoID4gNCkge1xyXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMjsgaSA8IChjYXNlQXJyLmxlbmd0aCAtIDEpOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZHMgdGhlIHN0cmluZyBkZWZpbmVkIGluIGFycmF5ICdjYXNlQXJyJyBhdCBpbmRleCAnMicgaW4gc3RyaW5nIGRlZmluZWQgaW4gdmFyaWFibGUgJ3N0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyICsgY2FzZUFycltpXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGRzIHRoZSBjaGFyYWN0ZXIgJz8nIGFuZCBzdHJpbmcgZGVmaW5lZCBpbiBhcnJheSAnY2FzZUFycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgaW4gc3RyaW5nIGRlZmluZWQgaW4gdmFyaWFibGUgJ3N0cidcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyID0gc3RyICsgJz8nICsgY2FzZUFycltpXTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHRydWUgb2YgZmFsc2UgYWNjb3JkaW5nIHRvIHRoZSByZXR1cm4gdmFsdWUgb2YgbWV0aG9kICdzdHJfbWF0Y2gnXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyX21hdGNoKGNhc2VBcnJbMV0sIHN0ciwgY2FzZUFyclsoY2FzZUFyci5sZW5ndGggLSAxKV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyB0cnVlIG9mIGZhbHNlIGFjY29yZGluZyB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIG1ldGhvZCAnc3RyX21hdGNoJ1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cl9tYXRjaChjYXNlQXJyWzFdLCBjYXNlQXJyWzJdLCBjYXNlQXJyWzNdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgIC8vIHJldHVybnMgdHJ1ZSBvciBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHByb3BlcnR5IHZhbHVlIG9mIGRlZmluZWQgY3NzIHNlbGVjdG9yXHJcbiAgICBmdW5jdGlvbiBzdHlsZV9tYXRjaChzcmMsIHNlbGVjdG9yLCBpbnApIHtcclxuICAgICAgICBsZXQgc3RyO1xyXG4gICAgICAgIGxldCBwc2V1ZG9fZWxtX3NlbGVjdG9yXHJcbiAgICAgICAgLy8gZGVub3RlcyB0aGUgc3RhdHVzIG9mIHRoZSB0ZXN0Y2FzZSBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoZWQgdmFsdWVcclxuICAgICAgICBsZXQgZmxhZ19jaGVjayA9IDE7XHJcbiAgICAgICAgLy8gV2luZG93IG9iamVjdCB0aGF0IGFsbG93cyB0byBhY2Nlc3MgdGhlIGlmcmFtZSdzIGRvY3VtZW50IGFuZCBpdHMgaW50ZXJuYWwgRE9NXHJcbiAgICAgICAgbGV0IGZyYW1lRG9jID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVzdWx0X2ZyYW1lJylbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudDtcclxuICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBwc2V1ZG8gc2VsZWN0b3IgdXNlZFxyXG4gICAgICAgIGlmIChzZWxlY3Rvci5pbmRleE9mKFwiOjpcIikgPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBhcnJheSBvZiBwc2V1ZG8gc2VsZWN0b3JcclxuICAgICAgICAgICAgbGV0IHBzZXVkb19lbG0gPSBzZWxlY3Rvci5zcGxpdCgnOjonKTtcclxuICAgICAgICAgICAgLy8gc3RyaW5nIGNvbnRhaW5pbmcgcHNldWRvIGNsYXNzIHdpdGggcHJlZml4ICc6J1xyXG4gICAgICAgICAgICBsZXQgc3RyID0gJzonICsgcHNldWRvX2VsbVsxXTtcclxuICAgICAgICAgICAgLy8gc2VsZWN0cyBlbGVtZW50IG9uIHdoaWNoIHBzZXVkbyBzZWxlY3Rpb24gYXBwbGllZFxyXG4gICAgICAgICAgICBsZXQgcHNldWRvX2VsbV9zZWxlY3RvciA9IHBzZXVkb19lbG1bMF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBpbmR4LCBuZXdfY2xhc3MsIG5ld19zZWxlY3RvciwgbmV3X3RhZ19uYW1lO1xyXG4gICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIGhvdmVyLCBhY3RpdmUgb3IgdmlzaXRlZCBwc2V1ZG8gY2xhc3MgYXBwbGllZFxyXG4gICAgICAgIGlmIChzZWxlY3Rvci5pbmRleE9mKCc6aG92ZXInKSA+IC0xIHx8IHNlbGVjdG9yLmluZGV4T2YoJzp2aXNpdGVkJykgPiAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKCc6YWN0aXZlJykgPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgbGFzdCBpbmRleCBvZiBjb2xvbiBpbiBwc2V1ZG8gc2VsZWN0b3JcclxuICAgICAgICAgICAgaW5keCA9IHNlbGVjdG9yLmxhc3RJbmRleE9mKCc6Jyk7XHJcbiAgICAgICAgICAgIC8vIHNlbGVjdHMgdGhlIGVsZW1lbnQgb24gd2hpY2ggcHNldWRvIGNsYXNzZXMgYXBwbGllZFxyXG4gICAgICAgICAgICBuZXdfc2VsZWN0b3IgPSBzZWxlY3Rvci5zdWJzdHJpbmcoMCwgaW5keCk7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBwc2V1ZG8gY2xhc3NcclxuICAgICAgICAgICAgbGV0IGNsYXNzX25hbWUgPSBzZWxlY3Rvci5zdWJzdHJpbmcoKGluZHggKyAxKSwgc2VsZWN0b3IubGVuZ3RoKTtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mIHBzZXVkbyBjbGFzcyB3aXRoIHByZWZpeCAnLidcclxuICAgICAgICAgICAgbmV3X2NsYXNzID0gJy4nICsgY2xhc3NfbmFtZTtcclxuICAgICAgICAgICAgaWYgKGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IobmV3X3NlbGVjdG9yKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIG5hbWUgb2YgdGhlIHRhZyBvbiB3aGljaCBwc2V1ZG8gc2VsZWN0aW9uIGFwcGxpZWRcclxuICAgICAgICAgICAgICAgIG5ld190YWdfbmFtZSA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IobmV3X3NlbGVjdG9yKS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlcyB0aGUgZWxlbWVudCBkZWZpbmVkIGluIHZhcmlhYmxlICduZXdfdGFnX25hbWUnXHJcbiAgICAgICAgICAgICAgICBsZXQgY3JlYXRlX2VsbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmV3X3RhZ19uYW1lKTtcclxuICAgICAgICAgICAgICAgIC8vIHNldHMgdGhlIGNsYXNzIGF0dHJpYnV0ZSB3aXRoIHZhbHVlIG9mIHBzZXVkbyBjbGFzc1xyXG4gICAgICAgICAgICAgICAgY3JlYXRlX2VsbS5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgY2xhc3NfbmFtZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBhcHBlbmQgdGhlIGNyZWF0ZWQgZWxlbWVudCBpbiBib2R5IHRhZyB0aGF0IGV4aXN0IGluIGlmcmFtZSBvZiByZXN1bHQgZmllbGRcclxuICAgICAgICAgICAgICAgIGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hcHBlbmRDaGlsZChjcmVhdGVfZWxtKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGlmIGVsZW1lbnQgbm90IGZvdW5kIG9uIHdoaWNoIHBzZXVkbyBzZWxlY3Rpb24gYXBwbGllZCB0aGVuIHJldHVybnMgZmFsc2VcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBwYXR0ZXJuIGZvciBtYXRjaGluZyB0aGUgdmFsdWUgb2Ygc3RhcnRzIHdpdGggZGVmaW5lZCBwc2V1ZG8gc2VsZWN0b3IgYW5kIGFueSBudW1iZXIgb2Ygc3BhY2UgYmV0d2VlbiBwc2V1ZG8gc2VsZWN0b3IgYW5kIG9wZW5pbmcgY3VybHkgYnJhY2UgYW5kIGFueSB2YWx1ZSBjb250YWluaW5nIGluIGN1cmx5IGJyYWNlIGluY2x1ZGluZyBicmFjZXNcclxuICAgICAgICAgICAgbGV0IHBhdHQgPSBuZXcgUmVnRXhwKHNlbGVjdG9yICsgJ1sgXSp7KFtcXFxcc1xcXFxTXSo/KX0nLCBcIlwiKTtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHRleHQgbWF0Y2hlZCBpbiBzdHlsZSB0YWcgZGVmaW5lZCBpbiB2YXJpYWJsZSAncGF0dCcgYWZ0ZXIgcmVtb3ZpbmcgbmV3IGxpbmUgY2hhcmFjdGVyXHJcbiAgICAgICAgICAgIGxldCBpc19tYXRjaGVkID0gZnJhbWVEb2MucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwucmVwbGFjZSgvXFxcXG4vLCBcIlwiKS5tYXRjaChwYXR0KTtcclxuICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgbWF0Y2hpbmcgZm91bmRcclxuICAgICAgICAgICAgaWYgKGlzX21hdGNoZWQpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5pbmcgdGhlIHZhbHVlIGRlZmluZWQgd2l0aCBwc2V1ZG8gc2VsZWN0b3IgaW4gY3VybHkgYnJhY2UgZXhjbHVkaW5nIGJyYWNlc1xyXG4gICAgICAgICAgICAgICAgbGV0IHByb3BfYW5kX3ZhbCA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MLnJlcGxhY2UoL1xcXFxuLywgXCJcIikubWF0Y2gocGF0dClbMF0ucmVwbGFjZShwYXR0LCBmdW5jdGlvbiAoZnVsbG1hdGNoLCBwcm9wc052YWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHZhbHVlIGV4aXN0IGluc2lkZSBjdXJseSBicmFjZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcm9wc052YWw7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZXMgdGV4dE5vZGUgY29udGFpbmluZyB2YWx1ZSBvZiB2YXJpYWJsZSAnbmV3X2NsYXNzJyBhbmQgdmFsdWUgb2YgdmFyaWFibGUgJ3Byb3BfYW5kX3ZhbCcgYWZ0ZXIgd3JhcGluZyBpdCBpbiBjdXJseSBicmFjZVxyXG4gICAgICAgICAgICAgICAgbGV0IHR4dCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG5ld19jbGFzcyArICd7JyArIHByb3BfYW5kX3ZhbCArICd9Jyk7XHJcbiAgICAgICAgICAgICAgICAvLyBhcHBlbmQgdGhpcyB0ZXh0IHRvIHN0eWxlIHRhZ1xyXG4gICAgICAgICAgICAgICAgZnJhbWVEb2MucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5hcHBlbmRDaGlsZCh0eHQpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGZhbHNlIGlmIGRlZmluZWQgcGF0dGVybiBub3QgbWF0Y2hlZCBpbiBzdHlsZSB0YWdcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB1c2VkIGZvciBzZWxlY3QgdGhlIGVsZW1lbnRcclxuICAgICAgICBsZXQgZGF0YTtcclxuICAgICAgICBpZiAobmV3X2NsYXNzICYmIGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MLnJlcGxhY2UoL1xcXFxuLywgXCJcIikubWF0Y2gobmV3X2NsYXNzKSkge1xyXG4gICAgICAgICAgICAvLyBzZWxlY3RzIGVsZW1lbnQgaGF2ZSBjbGFzcyBhdHRyaWJ1dGUgdGhhdCBpcyBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICduZXdfY2xhc3MnXHJcbiAgICAgICAgICAgIGRhdGEgPSBmcmFtZURvYy5xdWVyeVNlbGVjdG9yKG5ld19jbGFzcyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwc2V1ZG9fZWxtX3NlbGVjdG9yKSB7XHJcbiAgICAgICAgICAgIC8vIHNlbGVjdHMgZWxlbWVudCB3aXRoIHRhZyBuYW1lIHRoYXQgaXMgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAncHNldWRvX2VsbV9zZWxlY3RvcidcclxuICAgICAgICAgICAgZGF0YSA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IocHNldWRvX2VsbV9zZWxlY3Rvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gc2VsZWN0cyBlbGVtZW50IHdpdGggY3NzIHNlbGVjdG9yIGRlZmluZWQgaW4gdmFyaWFibGUgJ3NlbGVjdG9yJ1xyXG4gICAgICAgICAgICBkYXRhID0gZnJhbWVEb2MucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNwbGl0ZSB0aGUgdGVzdGNhc2UgYW5kIHJldHVybnMgdGhlIGFycmF5IGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2Ygb2xkIG9yIG5ldyB0ZXN0Y2FzZSBmb3JtYXQgZm9yIG1hdGNoIGNzc1xyXG4gICAgICAgIGxldCBpbnB1dCA9IHNwbGl0Q2FzZShpbnAsICdzdHlsZScpO1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBjc3MgcHJvcGVydHkgdGhhdCBleGlzdCBpbiBhcnJheSAnaW5wdXQnIGF0IGluZGV4ICcwJ1xyXG4gICAgICAgIGxldCBvdXRwID0gaW5wdXRbMV07XHJcbiAgICAgICAgLy8gZm9yIGNvbnRhaW4gdGhlIHZhbHVlIG9mIGNzcyBwcm9wZXJ0eSBvZiBkZWZpbmVkIGNzcyBzZWxlY3RvclxyXG4gICAgICAgIGxldCBjaGVja1N0eWxlO1xyXG4gICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHBzZXVkbyBjbGFzcyBkZWZpbmVkXHJcbiAgICAgICAgaWYgKHN0cikge1xyXG4gICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBzZWxlY3RvciBlbGVtZW50IGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBjc3MgcHJvcGVydHkgZGVmaW5lZCBpbiBhcnJheSAnaW5wdXQnIGF0IGluZGV4ICcwJyBvZiBlbGVtZW50IHRoYXQgaXMgc3RvcmVkIGluIHZhcmlhYmxlICdkYXRhJyBhbmQgaGF2ZSBwc2V1ZG8gY2xhc3Mgd2hpY2ggaXMgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnc3RyJ1xyXG4gICAgICAgICAgICAgICAgY2hlY2tTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRhdGEsIHN0cikuZ2V0UHJvcGVydHlWYWx1ZShpbnB1dFswXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBzZWxlY3RvciBlbGVtZW50IGRlZmluZWRcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBjc3MgcHJvcGVydHkgZGVmaW5lZCBpbiBhcnJheSAnaW5wdXQnIGF0IGluZGV4ICcwJyBvZiBlbGVtZW50IHRoYXQgaXMgc3RvcmVkIGluIHZhcmlhYmxlICdkYXRhJ1xyXG4gICAgICAgICAgICAgICAgY2hlY2tTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRhdGEpLmdldFByb3BlcnR5VmFsdWUoaW5wdXRbMF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHBzZXVkbyBjbGFzcyBleGlzdFxyXG4gICAgICAgIGlmIChzZWxlY3Rvci5pbmRleE9mKCc6aG92ZXInKSA+IC0xIHx8IHNlbGVjdG9yLmluZGV4T2YoJzp2aXNpdGVkJykgPiAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKCc6YWN0aXZlJykgPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBzZWxlY3RzIHRoZSBlbGVtZW50IHRoYXQgaGF2ZSBjbGFzcyB3aGljaCBpcyBwcmV2aW91c2x5IGRlZmluZWQgdXNpbmcgcGVzdWRvIGNsYXNzXHJcbiAgICAgICAgICAgIGxldCBkZWxldGVfZWxtID0gZnJhbWVEb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc19uYW1lKVswXTtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZWxlbWVudCBoYXZlIGNsYXNzIHdoaWNoIGlzIGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2RlbGV0ZV9lbG0nXHJcbiAgICAgICAgICAgIGRlbGV0ZV9lbG0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkZWxldGVfZWxtKTtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgdGV4dE5vZGUgZnJvbSBzdHlsZSB0YWcgdGhhdCB3YXMgcHJldmlvdXNseSBhZGRlZFxyXG4gICAgICAgICAgICBmcmFtZURvYy5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTCA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MLnJlcGxhY2UoL1xcXFxuL2dtLCBcIlwiKS5yZXBsYWNlKHR4dC50ZXh0Q29udGVudCwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHNldHMgdGhlIHZhbHVlICcwJyBvZiB2YXJpYWJsZSAnZmxhZ19jaGVjaycgaWYgZGVmaW5lZCB2YWx1ZSBvZiB0ZXN0Y2FzZSBjc3MgcHJvcGVydHkgaXMgbm90IGVxdWFscyB0byB0aGUgbWF0Y2hlZCB2YWx1ZSBvZiBjc3MgcHJvcGVydHkgZm9yIGRlZmluZWQgY3NzIHNlbGVjdG9yXHJcbiAgICAgICAgaWYgKGNoZWNrU3R5bGUgIT0gb3V0cCkge1xyXG4gICAgICAgICAgICBmbGFnX2NoZWNrID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHVybnMgdHJ1ZSBvZiBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdmbGFnX2NoZWNrJ1xyXG4gICAgICAgIGlmIChmbGFnX2NoZWNrKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXNlZCBmb3IgcmV0dXJuIHRoZSByZXN1bHQgc3RhdHVzIG9mIHRoZSB0ZXN0Y2FzZXMgZGVmaW5lZCBmb3IgbWF0Y2ggaW4gaHRtbCBlZGl0b3IgIFxyXG4gICAgZnVuY3Rpb24gYXR0cl9tYXRjaChzcmMsIGlucCwgb3V0cCkge1xyXG4gICAgICAgIGxldCBmbGFnX2NoZWNrID0gMSwgLy8gYnkgZGVmYXVsdCBzZXRzIHRoZSB2YWx1ZSAxIHRoYXQgaW5kaWNhdGVzIHRoYXQgbWF0Y2hpbmcgaXMgb2tcclxuICAgICAgICAgICAgLy8gZGVub3RlcyB0aGF0IHRhZyBtYXRjaGluZyBpcyByZXF1aXJlZFxyXG4gICAgICAgICAgICBzaW5ndWxhciA9IDAsXHJcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCBzdHJpbmcgbWF0Y2hpbmcgaXMgcmVxdWlyZWQgaW4gZGVmaW5lZCB0YWcgXHJcbiAgICAgICAgICAgIGp1c3RTdHJpbmcgPSAwLFxyXG4gICAgICAgICAgICAvLyBkZW5vdGVzIHRoYXQgYXR0cmlidXRlIG1hdGNoaW5nIGlzIHJlcXVpcmVkIG9mIGRlZmluZWQgdGFnIFxyXG4gICAgICAgICAgICBoYXNUYWdzQXR0cmlidXRlID0gMCxcclxuICAgICAgICAgICAgLy8gZGVub3RlcyB0aGF0IGF0dHJpYnV0ZSBhbmQgdGhlaXIgdmFsdWUgbWF0Y2hpbmcgaXMgcmVxdWlyZWQgb2YgZGVmaW5lZCB0YWcgXHJcbiAgICAgICAgICAgIGhhc1RhZ3NBdHRyaWJ1dGVWYWx1ZSA9IDAsXHJcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCAnbWF4JyBmbGFnIGlzIG5vdCBlbmFibGVkXHJcbiAgICAgICAgICAgIG1heCA9IGZhbHNlLFxyXG4gICAgICAgICAgICAvLyBkZW5vdGVzIHRoYXQgJ21pbicgZmxhZyBpcyBub3QgZW5hYmxlZFxyXG4gICAgICAgICAgICBtaW4gPSBmYWxzZTtcclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBpZiAoaW5wLmluZGV4T2YoXCJ7MX1cIikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gZGVub3RlcyB0aGF0IHRlc3RjYXNlIGlzIGRlZmluZWQgZm9yIG1hdGNoIHRhZyBpbiBodG1sIGVkaXRvclxyXG4gICAgICAgICAgICAgICAgc2luZ3VsYXIgPSAxO1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZmxhZyAnezF9JyBmcm9tIHRlc3RjYXNlIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgaW5wID0gaW5wLnJlcGxhY2UoXCJ7MX1cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlucC5pbmRleE9mKFwiezJ9XCIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCB0ZXN0Y2FzZSBpcyBkZWZpbmVkIGZvciBtYXRjaCBzdHJpbmcgaW4gZGVmaW5lZCB0YWcgaW4gaHRtbCBlZGl0b3JcclxuICAgICAgICAgICAgICAgIGp1c3RTdHJpbmcgPSAxO1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZmxhZyAnezJ9JyBmcm9tIHRlc3RjYXNlIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgaW5wID0gaW5wLnJlcGxhY2UoXCJ7Mn1cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlucC5pbmRleE9mKFwiezN9XCIpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCB0ZXN0Y2FzZSBpcyBkZWZpbmVkIGZvciBtYXRjaCBvbmx5IGF0dHJpYnV0ZSBub3QgdGhlaXIgdmFsdWUgb2YgZGVmaW5lZCB0YWcgaW4gaHRtbCBlZGl0b3JcclxuICAgICAgICAgICAgICAgIGhhc1RhZ3NBdHRyaWJ1dGUgPSAxO1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZmxhZyAnezN9JyBmcm9tIHRlc3RjYXNlIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgaW5wID0gaW5wLnJlcGxhY2UoXCJ7M31cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGlucC5pbmRleE9mKFwiezR9XCIpID4gLTEpIHsgLy9pZiBjaGVjayB2YWx1ZSBvZiBhdHRyaWJ1dGUgb25seVxyXG4gICAgICAgICAgICAgICAgLy8gZGVub3RlcyB0aGF0IHRlc3RjYXNlIGlzIGRlZmluZWQgZm9yIG1hdGNoIGF0dHJpYnV0ZSBhbmQgdGhlaXIgdmFsdWUgb2YgZGVmaW5lZCB0YWcgaW4gaHRtbCBlZGl0b3JcclxuICAgICAgICAgICAgICAgIGhhc1RhZ3NBdHRyaWJ1dGVWYWx1ZSA9IDE7XHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmVzIHRoZSBmbGFnICd7NH0nIGZyb20gdGVzdGNhc2Ugc3RyaW5nXHJcbiAgICAgICAgICAgICAgICBpbnAgPSBpbnAucmVwbGFjZShcIns0fVwiLCBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob3V0cC5pbmRleE9mKCdtaW4nKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBkZW5vdGVzIHRoYXQgJ21pbicgZmxhZyBpcyBlbmFibGVkXHJcbiAgICAgICAgICAgICAgICBtaW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgJ21pbicgdGV4dCBmcm9tIGRlZmluZWQgZmxhZyBhbmQgY29udGFpbnMgdGhlIG51bWVyaWMgdmFsdWUgb25seVxyXG4gICAgICAgICAgICAgICAgb3V0cCA9IHBhcnNlSW50KG91dHAucmVwbGFjZSgnbWluJywgJycpKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChvdXRwLmluZGV4T2YoJ21heCcpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCAnbWF4JyBmbGFnIGlzIGVuYWJsZWRcclxuICAgICAgICAgICAgICAgIG1heCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAvLyByZW1vdmVzIHRoZSAnbWF4JyB0ZXh0IGZyb20gZGVmaW5lZCBmbGFnIGFuZCBjb250YWlucyB0aGUgbnVtZXJpYyB2YWx1ZSBvbmx5XHJcbiAgICAgICAgICAgICAgICBvdXRwID0gcGFyc2VJbnQob3V0cC5yZXBsYWNlKCdtYXgnLCAnJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzcmMgPT0gXCJIVE1MXCIpIHtcclxuICAgICAgICAgICAgICAgIC8vIFdpbmRvdyBvYmplY3QgdGhhdCBhbGxvd3MgdG8gYWNjZXNzIHRoZSBpZnJhbWUncyBkb2N1bWVudCBhbmQgaXRzIGludGVybmFsIERPTVxyXG4gICAgICAgICAgICAgICAgbGV0IGZyYW1lRG9jID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVzdWx0X2ZyYW1lJylbMF0uY29udGVudFdpbmRvdy5kb2N1bWVudDtcclxuICAgICAgICAgICAgICAgIC8vIGluIGNhc2Ugb2YgdGFnIG1hdGNoIGVudGVycyBpbiB0aGlzIGJsb2NrXHJcbiAgICAgICAgICAgICAgICBpZiAoc2luZ3VsYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyBudW1iZXIgb2YgbWF0Y2hpbmcgdGFnIGV4aXN0XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGxlbmd0aENoZWNrID0gZnJhbWVEb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoaW5wKS5sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaW4gY2FzZSBvZiBtaW4gZmxhZyBpcyBlbmFibGVkXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1pbikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRzIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSBmbGFnX2NoZWNrICcwJyBpbiBjYXNlIG9mIGRlZmluZWQgbWluIHZhbHVlIGlzIGdyZWF0ZXIgdGhhbiBudW1iZXIgb2YgbWF0Y2hpbmcgdGFnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW5ndGhDaGVjayA8IG91dHApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgb2YgdmFyaWFibGUgZmxhZ19jaGVjayAnMCcgaW4gY2FzZSBvZiBkZWZpbmVkIG1heCB2YWx1ZSBpcyBsZXNzIHRoYW4gbnVtYmVyIG9mIG1hdGNoaW5nIHRhZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGVuZ3RoQ2hlY2sgPiBvdXRwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRhZ19uYW1lLCBhbGxDaGVjaywgY291bnRlciA9IDAsIHN0cl9kYXRhID0gXCJcIiwgbWF0Y2hfc3RyID0gXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpbiBjYXNlIG9mIHRlc3RjYXNlIGRlZmluZWQgZm9yIG1hdGNoIHN0cmluZyBpbiBwZXJ0aWN1bGFyIHRhZ1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChqdXN0U3RyaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGFuIGFycmF5IGFmdGVyIHNwbGl0aW5nIHRlc3RjYXNlIHZhbHVlIHdpdGggJ3snXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19uYW1lID0gaW5wLnNwbGl0KCd7Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdfbmFtZS5sZW5ndGggPiAyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAxOyBpIDwgdGFnX25hbWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZHMgdGhlIHN0cmluZyBkZWZpbmVkIGluIGFycmF5IHRhZ19uYW1lIGF0IGluZGV4ICcxJyBpbiBzdHJpbmcgJ3N0cl9kYXRhJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJfZGF0YSA9IHN0cl9kYXRhICsgdGFnX25hbWVbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkcyB0aGUgc3RyaW5nICd7JyBhbmQgc3RyaW5nIGRlZmluZWQgaW4gYXJyYXkgdGFnX25hbWUgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgaW4gc3RyaW5nICdzdHJfZGF0YSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyX2RhdGEgPSBzdHJfZGF0YSArICd7JyArIHRhZ19uYW1lW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZHMgdGhlIHN0cmluZyAnc3RyX2RhdGEnIGluIHN0cmluZyAnbWF0Y2hfc3RyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWF0Y2hfc3RyID0gbWF0Y2hfc3RyICsgc3RyX2RhdGE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGRzIHRoZSBzdHJpbmcgZGVmaW5lZCBpbiBhcnJheSB0YWdfbmFtZSBhdCBpbmRleCAnMScgaW4gc3RyaW5nICdtYXRjaF9zdHInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaF9zdHIgPSBtYXRjaF9zdHIgKyB0YWdfbmFtZVsxXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiB0ZXN0Y2FzZSBpcyBkZWZpbmVkIGluIG9sZCBmb3JtYXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT2xkVGVzdGNhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZXMgcGF0dGVybiB0byBtYXRjaCB0aGUgc3RyaW5nIGluc2lkZSBhbnkgdGFnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2hlY2tIdG1sID0gbmV3IFJlZ0V4cChgPC4qPz4oJHt0YWdfbmFtZVswXX0pPFxcLy4qPz5gLCAnZ2knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zICcwJyBvciAnMScgYWNjb3JkaW5nIHRvIHRoZSBtYXRjaCBzdGF0dXMgb2YgdGhlIHRlc3RjYXNlIGluIGh0bWwgZWRpdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gY2hlY2tPbGRBdHRyVGVzdENhc2UoY2hlY2tIdG1sLCBvdXRwLCBtaW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VsZWN0cyBhbGwgdGFnIGluIHdoaWNoIHN0cmluZyBleGlzdGluZyBoYXZlIHRvIGNoZWNrXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxDaGVjayA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3JBbGwodGFnX25hbWVbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbG9vcHMgdGhyb3VnaCB0aGUgYXZhaWxhYmxlIHRhZ3MgaW4gd2hpY2ggc3RyaW5nIGV4aXN0aW5nIGhhdmUgdG8gY2hlY2tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbGxDaGVjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYWxsQ2hlY2tbaV0uaW5uZXJIVE1MKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZ20sICcnKS50cmltKCkuaW5kZXhPZigobWF0Y2hfc3RyKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZ20sICcnKS50cmltKCkpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVhc2VzIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSBjb3VudGVyIGJ5IDEgaWYgc3RyaW5nIGV4aXN0IGluIGRlZmluZWQgdGFnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZXIrKztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyAnMCcgb3IgJzEnIGFjY29yZGluZyB0byB0aGUgbWF0Y2ggc3RhdHVzIG9mIHRoZSB0ZXN0Y2FzZSBpbiBodG1sIGVkaXRvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IGNoZWNrTmV3VGVzdENhc2UobWluLCBjb3VudGVyLCBvdXRwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzVGFnc0F0dHJpYnV0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgYXJyYXkgb2YgdGVzdGNhc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX25hbWUgPSBpbnAuc3BsaXQoJ3snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT2xkVGVzdGNhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhdHRlcm4gZm9yIG1hdGNoIHRoZSBkZXNpemUgYXR0cmlidXRlIGNvbnRhaW5pbmcgYW55IHZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYXR0clJlZyA9IG5ldyBSZWdFeHAoYCR7dGFnX25hbWVbMF19KFxcXFxzKj1cXFxccyopW1wiJ10/KCg/Oi4oPyFbXCInXT9cXFxccysoPzpcXFxcUyspPXxbPlwiJ10pKSsuKVtcIiddP2AsICdnaScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSBjaGVja09sZEF0dHJUZXN0Q2FzZShhdHRyUmVnLCBvdXRwLCBtaW4pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFmbGFnX2NoZWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcGF0dGVybiBmb3IgbWF0Y2ggdGhlIHdob2xlIHZhbHVlIHN0YXJ0cyBmcm9tIGNoYXJhY3RlciAnPCcgYW5kIGVuZHMgYXQgJz4nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRUcnkgPSBuZXcgUmVnRXhwKGA8KFxcXFx3KykoLio/KT5gLCAnZ2knKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcnJheSBjb250YWluaW5nIG1hdGNoZWQgc3RyaW5nIGluIGh0bWwgZWRpdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG1hdGNoVGV4dCA9IGh0bWxFZGl0b3IuZ2V0VmFsdWUoKS5tYXRjaChuZXh0VHJ5KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRzIHRydWUgb2YgZmFsc2UgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSBvZiBhcnJheSBtYXRjaFRleHQgYXQgaW5kZXggMCBhbmQgaXQgY29udGFpbnMgdGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSBkZWZpbmVkIGluIGFycmF5IHRhZ19uYW1lIGF0IGluZGV4IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gbWF0Y2hUZXh0WzBdICYmIG1hdGNoVGV4dFswXS5pbmNsdWRlcyh0YWdfbmFtZVswXSkgPyB0cnVlIDogZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxlY3RzIGFsbCB0YWdzIGluIGlmcmFtZSB0aGF0IGlzIGRlZmluZWQgaW4gdGVzdGNhc2UgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxDaGVjayA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3JBbGwodGFnX25hbWVbMF0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFsbENoZWNrLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFsbENoZWNrW2ldLmhhc0F0dHJpYnV0ZSh0YWdfbmFtZVsxXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVhc2VzIHRoZSB2YWx1ZSBvZiBjb3VudGVyIGlmIGF0dHJpYnV0ZSBtYXRjaGVkIGluIGFueSB0YWcgZGVmaW5lZCBpbiB0ZXN0Y2FzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyKys7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSBjaGVja05ld1Rlc3RDYXNlKG1pbiwgY291bnRlciwgb3V0cCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc1RhZ3NBdHRyaWJ1dGVWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgYXJyYXkgb2YgdGVzdGNhc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX25hbWUgPSBpbnAuc3BsaXQoJ3snKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT2xkVGVzdGNhc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFycmF5IGNvbnRhaW5zIGF0dHJpYnV0ZSBhdCBpbmRleCAnMCcgYW5kIGl0cyB2YWx1ZSBhdCBpbmRleCAnMSdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19uYW1lID0gaW5wLnNwbGl0KCckJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXR0ZXJuIGZvciBtYXRjaCB0aGUgZGVzaXplIGF0dHJpYnV0ZSBjb250YWluaW5nIGFueSB2YWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJWYWx1ZVJlZyA9IG5ldyBSZWdFeHAoYCR7dGFnX25hbWVbMF19KFxcXFxzKj1cXFxccyopW1wiJ10/KCg/Oi4oPyFbXCInXT9cXFxccysoPzpcXFxcUyspPXxbPlwiJ10pKSsuKVtcIiddP2AsICdnaScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSBjaGVja09sZEF0dHJUZXN0Q2FzZShhdHRyVmFsdWVSZWcsIG91dHAsIG1pbiwgdGFnX25hbWVbMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VsZWN0cyBhbGwgdGFncyBpbiBpZnJhbWUgdGhhdCBpcyBkZWZpbmVkIGluIHRlc3RjYXNlIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsQ2hlY2sgPSBmcmFtZURvYy5xdWVyeVNlbGVjdG9yQWxsKHRhZ19uYW1lWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBhbGxDaGVjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBkZWZpbmVkIGF0dHJpYnV0ZSBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IGFsbENoZWNrW2ldLmdldEF0dHJpYnV0ZSh0YWdfbmFtZVsxXSkgPyBhbGxDaGVja1tpXS5nZXRBdHRyaWJ1dGUodGFnX25hbWVbMV0pIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZW1vdmVzIHRoZSBzZW1pY29sb24gZnJvbSB2YWx1ZSBvZiBkZWZpbmVkIGF0dHJpYnV0ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGEgPSBhLnJlcGxhY2UoLzsvZywgJycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhLnJlcGxhY2UoL1xccysvZywgJycpLnRyaW0oKSA9PSB0YWdfbmFtZVsyXS5yZXBsYWNlKC9cXHMrL2csICcnKS50cmltKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVhc2VzIHRoZSB2YWx1ZSBvZiBjb3VudGVyIGJ5IDEgaWYgbWF0Y2hlZCB2YWx1ZSBvZiBkZWZpbmVkIGF0dHJpYnV0ZSBpcyBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIGRlZmluZWQgdmFsdWUgaW4gdGVzdGNhc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlcisrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zICcwJyBvciAnMScgYWNjb3JkaW5nIHRvIHRoZSBtYXRjaCBzdGF0dXMgb2YgdGhlIHRlc3RjYXNlIGluIGh0bWwgZWRpdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gY2hlY2tOZXdUZXN0Q2FzZShtaW4sIGNvdW50ZXIsIG91dHApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZSBvciBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlIGZsYWdfY2hlY2tcclxuICAgICAgICAgICAgcmV0dXJuIChmbGFnX2NoZWNrID8gdHJ1ZSA6IGZhbHNlKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAvLyBtZXNzYWdlIHRoZSBsb2cgb24gY29uc29sZSBpbiBjYXNlIG9mIGFueSBlcnJvciBvY2N1cmVkXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgZXJyb3IsIGZ1bmM6ICdhdHRyX21hdGNoJywgJ0NhdXNlJzogJ09sZCBDYXNlLCBuZWVkIHRvIGNvbnZlcnQgbGlrZSBhdHRyX21hdGNoP0hUTUw/VEFHe0FUVFJ7VmFsdWV7TWF0Y2hUeXBlfT9NQVgvTUlOJyB9KTtcclxuICAgICAgICAgICAgLy8gcmV0dXJucyBmYWxzZSBpbiBjYXNlIG9mIGFueSBlcnJvciBvY2N1cmVkXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIHVzZWQgZm9yIG1hdGNoIHRlc3RjYXNlIHN0cmluZyBpbiB3aG9sZSBodG1sL2pzIGVkaXRvciBpbiBjYXNlIG9mIGh0bWwvanMgYW5kIGluIGNhc2Ugb2YgY3NzIGl0IG1hdGNoZXMgdGhlIG1lZGlhIHF1ZXJ5LCBjc3Mgc2VsZWN0b3IgYW5kIGNzcyBwcm9wZXJ0eSBkZWZpbmVkIHRvZ2V0aGVyIGluIHdob2xlIGNzcyBlZGl0b3IgXHJcbiAgICBmdW5jdGlvbiBzdHJfbWF0Y2goc3JjLCBpbnAsIG91dHApIHtcclxuICAgICAgICAvLyBpbmRpY2F0ZXMgdGhhdCBzdHJpbmcgaXMgbWF0Y2hlZCBpbiBodG1sL2pzIGVkaXRvciBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIGFyZ3VtZW50IHZhcmlhYmxlICdzcmMnXHJcbiAgICAgICAgbGV0IGZsYWdfY2hlY2sgPSAxLFxyXG4gICAgICAgICAgICBzaW5ndWxhciA9IDAsXHJcbiAgICAgICAgICAgIGp1c3RTdHJpbmcgPSAwLFxyXG4gICAgICAgICAgICBjb21wbGV4VGFncyA9IDAsXHJcbiAgICAgICAgICAgIHRhZ19kYXRhID0gXCJcIixcclxuICAgICAgICAgICAgbWF4ID0gZmFsc2UsXHJcbiAgICAgICAgICAgIG1pbiA9IGZhbHNlO1xyXG4gICAgICAgIGxldCBpbnB1dF9kYXRhID0gaW5wO1xyXG4gICAgICAgIGlmIChpbnAuaW5kZXhPZihcInsxfVwiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIGl0IGlzIG5vdCBpbiB1c2UgZm9yIHRoaXMgZnVuY3Rpb25cclxuICAgICAgICAgICAgc2luZ3VsYXIgPSAxO1xyXG4gICAgICAgICAgICAvLyByZW1vdmVzIHRoZSBmbGFnICd7MX0nIGZyb20gdGVzdGNhc2Ugc3RyaW5nXHJcbiAgICAgICAgICAgIGlucCA9IGlucC5yZXBsYWNlKFwiezF9XCIsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wLmluZGV4T2YoXCJ7Mn1cIikgPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBpdCBpcyBub3QgaW4gdXNlIGZvciB0aGlzIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGp1c3RTdHJpbmcgPSAxO1xyXG4gICAgICAgICAgICAvLyByZW1vdmVzIHRoZSBmbGFnICd7Mn0nIGZyb20gdGVzdGNhc2Ugc3RyaW5nXHJcbiAgICAgICAgICAgIGlucCA9IGlucC5yZXBsYWNlKFwiezJ9XCIsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaW5wLmluZGV4T2YoXCJ7M31cIikgPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBpdCBpcyBub3QgaW4gdXNlIGZvciB0aGlzIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgIGNvbXBsZXhUYWdzID0gMTtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZmxhZyAnezN9JyBmcm9tIHRlc3RjYXNlIHN0cmluZ1xyXG4gICAgICAgICAgICBpbnAgPSBpbnAucmVwbGFjZShcInszfVwiLCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG91dHAuaW5kZXhPZignbWluJykgPiAtMSkge1xyXG4gICAgICAgICAgICAvLyBpbmRpY2F0ZXMgdGhhdCAnbWluJyBmbGFnIGlzIGVuYWJsZVxyXG4gICAgICAgICAgICBtaW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAvLyByZW1vdmVzIHRoZSAnbWluJyB0ZXh0IGZyb20gZGVmaW5lZCBmbGFnIGFuZCBjb250YWlucyB0aGUgbnVtZXJpYyB2YWx1ZVxyXG4gICAgICAgICAgICBvdXRwID0gcGFyc2VJbnQob3V0cC5yZXBsYWNlKCdtaW4nLCAnJykpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAob3V0cC5pbmRleE9mKCdtYXgnKSA+IC0xKSB7XHJcbiAgICAgICAgICAgIC8vIGluZGljYXRlcyB0aGF0ICdtYXgnIGZsYWcgaXMgZW5hYmxlXHJcbiAgICAgICAgICAgIG1heCA9IHRydWU7XHJcbiAgICAgICAgICAgIC8vIHJlbW92ZXMgdGhlICdtYXgnIHRleHQgZnJvbSBkZWZpbmVkIGZsYWcgYW5kIGNvbnRhaW5zIHRoZSBudW1lcmljIHZhbHVlXHJcbiAgICAgICAgICAgIG91dHAgPSBwYXJzZUludChvdXRwLnJlcGxhY2UoJ21heCcsICcnKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGNvbnRhaW5zIGFycmF5IG9mIGVhY2ggY2hhcmFjdGVyXHJcbiAgICAgICAgbGV0IHdvcmRfYXJyID0gaW5wLnNwbGl0KFwiXCIpO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd29yZF9hcnIubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKHdvcmRfYXJyW2ldLm1hdGNoKC9cXFcvZykpIHtcclxuICAgICAgICAgICAgICAgIC8vIGFkZHMgZmxhZyAnXFxcXCcgYmVmb3JlIG5vbiB3b3JkIGNoYXJhY3RlciBcclxuICAgICAgICAgICAgICAgIHdvcmRfYXJyW2ldID0gXCJcXFxcXCIgKyB3b3JkX2FycltpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb252ZXJ0cyBhcnJheSAnd29yZF9hcnInIGludG8gc3RyaW5nIGFmdGVyIGFwcGx5aW5nIGZsYWcgJ1xcXFwnIGJlZm9yZSBub24gd29yZCBjaGFyYWN0ZXJcclxuICAgICAgICBpbnAgPSB3b3JkX2Fyci5qb2luKFwiXCIpO1xyXG4gICAgICAgIC8vIGluIGNhc2Ugb2YgJ3N0cl9tYXRjaCcgaW4gaHRtbCwgc3RyaW5nIG1hdGNoZWQgaW4gd2hvbGUgaHRtbCBwYXJ0IHNvIG5vIG5lZWQgb2YgdGhpcyBibG9ja1xyXG4gICAgICAgIGlmIChzcmMgPT0gJ0hUTUwnKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB0ZXN0Y2FzZSBkYXRhIHRoYXQgaGF2ZSB0byBiZSBtYXRjaFxyXG4gICAgICAgICAgICB0YWdfZGF0YSA9IGlucDtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgc3RyaW5nIGRhdGEgdGhhdCBoYXZlIHRvIGJlIG1hdGNoXHJcbiAgICAgICAgICAgIGlucCA9IGp1c3RTdHJpbmcgPyBpbnAgOiAoY29tcGxleFRhZ3MgPyBcIlxcPFwiICsgaW5wICsgXCIuKj9cXD4uKj9cXDxcXC9cIiArIGlucCArIFwiXFw+XCIgOiAoc2luZ3VsYXIgPyAnPCcgKyBpbnAucmVwbGFjZSgnWycsICcgJykucmVwbGFjZSgnXScsICcnKSArICcofCB8XFwvfCBcXC8pPicgOiAnPCcgKyBpbnAucmVwbGFjZSgnWycsICcgJykucmVwbGFjZSgnXScsICcnKSArICc+JyArICcuKj9cXDxcXC8nICsgdGFnX2RhdGEgKyAnXFw+JykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb250YWlucyBwYXR0ZXJuIHRvIGJlIG1hdGNoIGRlZmluZWQgdGVzdGNhc2UgaW4gXHJcbiAgICAgICAgbGV0IHJlID0gXCJcIixcclxuICAgICAgICAgICAgLy8gY29udGFpbmVyIGZvciBob2xkIHRoZSBodG1sIGVkaXRvciB2YWx1ZVxyXG4gICAgICAgICAgICBodG1sX3RhZ3MgPSBcIlwiLFxyXG4gICAgICAgICAgICAvLyBjb250YWluZXIgZm9yIGhvbGQgdGhlIGNzcyBlZGl0b3IgdmFsdWVcclxuICAgICAgICAgICAgY3NzX2RhdGEgPSBcIlwiLFxyXG4gICAgICAgICAgICAvLyBjb250YWluZXIgZm9yIGhvbGQgdGhlIGpzIGVkaXRvciB2YWx1ZVxyXG4gICAgICAgICAgICBqc19kYXRhID0gXCJcIjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAvLyBjb250YWlucyBuZXcgUmVnRXhwIG9iamVjdCBmb3IgbWF0Y2ggZGVmaW5lZCBzdHJpbmcgZ2xvYmFsbHlcclxuICAgICAgICAgICAgcmUgPSBuZXcgUmVnRXhwKGlucCwgXCJnXCIpO1xyXG4gICAgICAgICAgICBodG1sX3RhZ3MgPSBodG1sRWRpdG9yLmdldFZhbHVlKCkudHJpbSgpO1xyXG4gICAgICAgICAgICBjc3NfZGF0YSA9IGNzc0VkaXRvci5nZXRWYWx1ZSgpLnRyaW0oKTtcclxuICAgICAgICAgICAganNfZGF0YSA9IGpzRWRpdG9yLmdldFZhbHVlKCkudHJpbSgpO1xyXG4gICAgICAgICAgICBjc3NfZGF0YSA9IGNzc19kYXRhLnJlcGxhY2UoL1xcbi9nbSwgJycpO1xyXG4gICAgICAgICAgICBqc19kYXRhID0ganNfZGF0YS5yZXBsYWNlKC9cXCAvZywgJycpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgLy8gcmV0dXJucyBiYWNrIGluIGNhc2Ugb2YgYW55IGVycm9yXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHNyYyA9PSAnSFRNTCcpIHtcclxuICAgICAgICAgICAgaWYgKGh0bWxfdGFncy5tYXRjaChyZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChodG1sX3RhZ3MubWF0Y2gocmUpLmxlbmd0aCA9PSBvdXRwICYmIGh0bWxfdGFncykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChodG1sX3RhZ3MubWF0Y2gocmUpLmxlbmd0aCA8PSBvdXRwICYmIGh0bWxfdGFncyAmJiBodG1sX3RhZ3MubWF0Y2gocmUpLmxlbmd0aCAmJiBtYXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaHRtbF90YWdzLm1hdGNoKHJlKS5sZW5ndGggPj0gb3V0cCAmJiBodG1sX3RhZ3MgJiYgaHRtbF90YWdzLm1hdGNoKHJlKS5sZW5ndGggJiYgbWluKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2UgaWYgKHNyYyA9PSAnQ1NTJykge1xyXG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgYXJyYXkgb2YgbWF0Y2hpbmcgZGF0YVxyXG4gICAgICAgICAgICBpbnB1dF9kYXRhID0gaW5wdXRfZGF0YS5zcGxpdCgneycpO1xyXG4gICAgICAgICAgICAvLyBjcmVhdGVzIGFuIGFycmF5IGZvciBjb250YWluIHRoZSBkZWZpbmVkIG1lZGlhIHF1ZXJpZXNcclxuICAgICAgICAgICAgbGV0IG1lZGlhX2FyciA9IFtdO1xyXG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBjb3VudGVyXHJcbiAgICAgICAgICAgIGxldCBjb3VudGVyID0gMDtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlcyBzcGFjZSBmcm9tIHRoZSB2YWx1ZSBvZiBjc3MgZWRpdG9yIHRoYXQgZXhpc3QgaW5zaWRlIHBhcmVudGhlc2lzXHJcbiAgICAgICAgICAgIGNzc19kYXRhID0gY3NzX2RhdGEucmVwbGFjZSgvXFwoLio/XFwpL2dtLCBmdW5jdGlvbiAobWF0Y2hfZGF0YSkgeyByZXR1cm4gbWF0Y2hfZGF0YS5yZXBsYWNlKC9bIF0vZ20sIFwiXCIpOyB9KTtcclxuICAgICAgICAgICAgLy8gcmVwbGFjZXMgJ0AnIHdpdGggJ1xcbkAnXHJcbiAgICAgICAgICAgIGNzc19kYXRhID0gY3NzX2RhdGEucmVwbGFjZSgvQC9nbSwgJ1xcbkAnKTtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIG1lZGlhIGRhdGEgdGhhdCBzdGFydHMgZnJvbSBjaGFyYWN0ZXIgJ0AnIGFuZCBlbmRzIGJlZm9yZSBmaXJzdCBjdXJseSBicmFjZSBcclxuICAgICAgICAgICAgY3NzX2RhdGEgPSBjc3NfZGF0YS5yZXBsYWNlKC9AKFtcXHNcXFNdKj8peyhbXFxzXFxTXSo/KXsoW1xcc1xcU10qPyl9KFtcXHNcXFNdKj8pfS9nbSwgZnVuY3Rpb24gKG1hdGNoX2RhdGEsIG1lZGlhX2RhdGEpIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIG1laWRhIHF1ZXJ5IGRhdGEgdGhhdCBzdGFydHMgZnJvbSBjaGFyYWN0ZXIgJ0AnIGFuZCBlbmRzIGJlZm9yZSBmaXJzdCBjdXJseSBicmFjZSBcclxuICAgICAgICAgICAgICAgIGxldCBmaW5kX21lZGlhX2RhdGEgPSBtZWRpYV9kYXRhO1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgYW4gYXJyYXkgb2Ygc3RyaW5nIGRlZmluZWQgaW4gdmFyaWFibGUgJ2ZpbmRfbWVkaWFfZGF0YScgYWZ0ZXIgc3BsaXRpbmcgaXQgd2l0aCB3aGl0ZSBzcGFjZSBjaGFyYWN0ZXJcclxuICAgICAgICAgICAgICAgIGZpbmRfbWVkaWFfZGF0YSA9IGZpbmRfbWVkaWFfZGF0YS5zcGxpdChcIiBcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBhcnJheSBmb3Igc3RvcmUgbWVkaWEgZGF0YSB0aGF0IGFyZSBzdG9yZWQgaW4gYXJyYXkgJ2ZpbmRfbWVkaWFfZGF0YScgYWZ0ZXIgcmVtb3ZpbmcgYmxhbmsgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBsZXQgc3RvcmVfZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmaW5kX21lZGlhX2RhdGEubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZmluZF9tZWRpYV9kYXRhW2ldICE9IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHVzaGVzIGRhdGEgaW50byBhcnJheSAnc3RvcmVfZGF0YScgd2hpY2ggaXMgZGVmaW5lZCBpbiBhcnJheSAnZmluZF9tZWRpYV9kYXRhJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdpJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZV9kYXRhLnB1c2goZmluZF9tZWRpYV9kYXRhW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyBzdHJpbmcgYWZ0ZXIgam9pbmluZyBhcnJheSAnc3RvcmVfZGF0YSAnd2l0aCcgd2hpdGUgc3BhY2VcclxuICAgICAgICAgICAgICAgIHN0b3JlX2RhdGEgPSBzdG9yZV9kYXRhLmpvaW4oXCIgXCIpO1xyXG4gICAgICAgICAgICAgICAgLy8gcmVwbGFjZXMgb2xkIG1lZGlhIGRhdGEgd2l0aCBuZXcgb25lIGFmdGVyIHJlbW92aW5nIHVubmVjZXNzYXJ5IG1vcmUgdGhhdCBvbmUgd2hpdGUgc3BhY2UgdGhhdCBjb21lcyB0b2dldGhlclxyXG4gICAgICAgICAgICAgICAgbWF0Y2hfZGF0YSA9IG1hdGNoX2RhdGEucmVwbGFjZShtZWRpYV9kYXRhLCBzdG9yZV9kYXRhKTtcclxuICAgICAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgbWF0Y2hlZCBtZWRpYSBxdWVyeSBkYXRhIGludG8gYXJyYXkgJ21lZGlhX2FycidcclxuICAgICAgICAgICAgICAgIG1lZGlhX2Fyci5wdXNoKG1hdGNoX2RhdGEpO1xyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyB1cGRhdGVkIGRlZmluZWQgbWVkaWEgcXVlcmllcyBkYXRhXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hfZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIGxvb3BzIHRocm91Z2ggbnVtYmVyIG9mIGRlZmluZWQgbWVkaWEgcXVlcnkgaW4gY3NzIGVkaXRvclxyXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1lZGlhX2Fyci5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgLy8gY2hlY2tzIGZvciBtYXRjaCB0aGUgbWVkaWEgZGF0YSBkZWZpbmVkIGluIHRlc3RjYXNlIHdpdGggbWVkaWEgZGF0YSBleGlzdCBpbiBhcnJheSAnbWVkaWFfYXJyJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdqJ1xyXG4gICAgICAgICAgICAgICAgbGV0IG1lZGlhX21hdGNoID0gbWVkaWFfYXJyW2pdLmluZGV4T2YoaW5wdXRfZGF0YVswXS50cmltKCkpO1xyXG4gICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgbWVkaWEgcXVlcnkgbWF0Y2hlZCB3aXRoIHRoZSBkYXRhIGRlZmluZWQgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaidcclxuICAgICAgICAgICAgICAgIGlmIChtZWRpYV9tYXRjaCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGNzcyBzZWxlY3RvclxyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rvcl9tYXRjaDtcclxuICAgICAgICAgICAgICAgICAgICAvLyBnb2VzIGluc2lkZSB0aGlzIGJsb2NrIGlmIG11bHRpcGxlIHNlbGVjdG9yIGRlZmluZWQgaW4gdGVzdGNhc2VcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaW5wdXRfZGF0YVsxXS5pbmRleE9mKCcsJykgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyBhcnJheSBvZiBhbGwgc2VsZWN0b3IgdGhhdCBkZWZpbmVkIGluIHRlc3RjYXNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdWJfaW5wdXQgPSBpbnB1dF9kYXRhWzFdLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdWJfaW5wdXQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGluZGV4IG9mIGNzcyBzZWxlY3RvciwgZGVmaW5lZCBpbiBhcnJheSAnc3ViX2lucHV0JyBhdCBpbmRleCBlcXVsYXMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdpJywgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdG9yX21hdGNoID0gbWVkaWFfYXJyW2pdLmluZGV4T2Yoc3ViX2lucHV0W2ldLnRyaW0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBleGlzdCBmcm9tIGxvb3AgaWYgdmFyaWFibGUgJ3NlbGVjdG9yX21hdGNoJyBjb250YWlucyB2YWx1ZSBsZXNzIHRoYW4gJzAnIG1lYW5zIGlmIGFueSBjc3Mgc2VsZWN0b3IgZG9lcyBub3QgZXhpc3QgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaicgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3JfbWF0Y2ggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyBpbmRleCBvZiBjc3Mgc2VsZWN0b3IgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaicgaW4gY2FzZSBvZiBzaW5nbGUgY3NzIHNlbGVjdG9yIGRlZmluZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JfbWF0Y2ggPSBtZWRpYV9hcnJbal0uaW5kZXhPZihpbnB1dF9kYXRhWzFdLnRyaW0oKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHNlbGVjdG9yIG1hdGNoZXMgaW4gbWVkaWEgcXVlcnkncyBzdHJpbmcgZGVmaW5lZCBpbiBhcnJheSAnbWVkaWFfYXJyJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdqJ1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rvcl9tYXRjaCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBpbmRleCBvZiBwcm9wZXJ0eSBzdHJpbmcgZGVmaW5lZCBpbiBtZWRpYSBxdWVyeSB0aGF0IGV4aXN0IGluIGFycmF5ICdtZWRpYV9hcnInIGF0IGluZGV4IGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2onXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaW5kX3N0ciA9IG1lZGlhX2FycltqXS5pbmRleE9mKGlucHV0X2RhdGFbMl0udHJpbSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWRlbnRpZnkgdGhhdCBwcm9wZXJ0eSBtYXRjaGVkIG9yIG5vdCwgaW5pdGlhbGx5IGRlZmluZWQgdGhhdCBpdCBpcyBub3QgbWF0Y2hlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcF9tYXRjaCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBwcm9wZXJ0eSBzdHJpbmcgZXhpc3QgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmRfc3RyID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluc3RlYWQgb2YgdGhpcyBvbmx5IHZhcmlhYmxlICdmaW5kX3N0cicgY2FuIGJlIHVzZWQgYXMgY29udGFpbnMgdGhlIHNhbWUgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaW5kX3N0cl9pbmRleCA9IG1lZGlhX2FycltqXS5pbmRleE9mKGlucHV0X2RhdGFbMl0udHJpbSgpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBjaGFyYWN0ZXIgZXhpc3QgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnZmluZF9zdHJfaW5kZXgnIGJ5IHJlZHVjaW5nIDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBwcm9wX2RhdGEgPSBtZWRpYV9hcnJbal0uY2hhckF0KChmaW5kX3N0cl9pbmRleCAtIDEpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGZvciBpbmRpY2F0ZSB0aGF0IHByb3BlcnR5IG1hdGNoZWQgaWYgcHJvcGVydHkgaXMgbm90IGNvbWJpbmVkIHdpdGggYW55IG90aGVyIHdvcmQgc3VjaCBhcyBpbiBjYXNlIG9mICdjb2xvcicgcHJvcGVydHkgdGhlbiBpdCB3aWxsIGlnbm9yZSAnYmFja2dyb3VuZC1jb2xvcicgcHJvcGVydHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wX2RhdGEgIT09ICctJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BfbWF0Y2ggPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHByb3BlcnR5IG1hdGNoZWQgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaidcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHByb3BfbWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY3JlbWVudHMgdmFsdWUgb2YgdmFyaWFibGUgJ2NvdW50ZXInIGJ5IDFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgPSBjb3VudGVyICsgMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY291bnRlciA9PSBvdXRwKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmIChqc19kYXRhLm1hdGNoKHJlKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGpzX2RhdGEubWF0Y2gocmUpLmxlbmd0aCA9PSBvdXRwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDE7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGpzX2RhdGEubWF0Y2gocmUpLmxlbmd0aCA8PSBvdXRwICYmIGpzX2RhdGEgJiYganNfZGF0YS5tYXRjaChyZSkubGVuZ3RoICYmIG1heCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSAxO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChqc19kYXRhLm1hdGNoKHJlKS5sZW5ndGggPj0gb3V0cCAmJiBqc19kYXRhICYmIGpzX2RhdGEubWF0Y2gocmUpLmxlbmd0aCAmJiBtaW4pIHtcclxuICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZmxhZ19jaGVjaykge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyB1c2VkIGZvciBjaGVjayB0aGUgcmVzdWx0IHN0YXR1cyBvZiAnRXh0ZXJuYWwgU2NyaXB0JyBkZWZpbmVkIGluICdBdXRvZ3JhZGUnIGRpYWxvZyBib3hcclxuICAgIGZ1bmN0aW9uIGV4dGVybmFsQ2hlY2soZ2V0X2Nhc2VzKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgUmVnRXhwIHBhdHRlcm4gZm9yIG1hdGNoIHRoZSBzdHJpbmcgJ3ZhciBmbGFnT05OJ1xyXG4gICAgICAgICAgICBsZXQgcmUgPSAvdmFyIGZsYWdPTk4vZ207XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBqcyBlZGl0b3JcclxuICAgICAgICAgICAgbGV0IGpzX2RhdGEgPSBqc0VkaXRvci5nZXRWYWx1ZSgpLnRyaW0oKTtcclxuICAgICAgICAgICAganNfZGF0YSA9IGpzX2RhdGEucmVwbGFjZSgvXi4qP2JvZHkuKj9cXFxcbi9nbSwgJycpO1xyXG4gICAgICAgICAgICAvLyByZW1vdmVzIGFsbCB0aGUgdGV4dCB0aGF0IGV4aXN0IGluIHNhbWUgbGluZSBzdGFydGluZyBmcm9tICdkb2N1bWVudC53cml0ZScgc3RyaW5nIG9mIGpzIGVkaXRvciB2YWx1ZSBcclxuICAgICAgICAgICAganNfZGF0YSA9IGpzX2RhdGEucmVwbGFjZSgvZG9jdW1lbnRcXC53cml0ZS4qL2dtLCAnJyk7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBhZnRlciBldmFsdWF0ZSB0aGUgc2NyaXB0XHJcbiAgICAgICAgICAgIGxldCByZXN1bHQ7XHJcbiAgICAgICAgICAgIGlmICghcmUudGVzdChnZXRfY2FzZXMpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgdmFsdWUgcmV0dXJuIGJ5IHRoZSBzY3JpcHQgZGVmaW5lZCBpbiBqcyBlZGl0b3IgYW5kIGluICdFeHRlcm5hbCBTY3JpcHQnIGZpZWxkIG9mICdBdXRvZ3JhZGUnIGRpYWxvZyBib3hcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGV2YWwoanNfZGF0YSArICdcXG4nICsgZ2V0X2Nhc2VzKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSByZXR1cm4gYnkgdGhlIHNjcmlwdCBkZWZpbmVkIGluICdFeHRlcm5hbCBTY3JpcHQnIGZpZWxkIG9mICdBdXRvZ3JhZGVcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGV2YWwoZ2V0X2Nhc2VzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyByZXR1cm5zIHRoZSB2YWx1ZSBzdG9yZWQgaW4gdmFyaWFibGUgJ3Jlc3VsdCdcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgLy8gc2hvd3MgbG9nIG1lc3NhZ2UgaW4gY2FzZSBvZiBhbnkgZXJyb3Igb2NjdXJyZWRcclxuICAgICAgICAgICAgY29uc29sZS5sb2coeyBtc2c6IGVyciwgZnVuYzogJ2V4dGVybmFsQ2hlY2tAMTEwOCcgfSk7XHJcbiAgICAgICAgICAgIC8vIHJldHVybnMgZmFsc2UgaW4gY2FzZSBvZiBhbnkgZXJyb3Igb2NjdXJyZWRcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgLy8gcmV0dXJucyB0aGUgdGV4dCBkZWZpbmVkIGJldHdlZW4gb3BlbmluZyBhbmQgY2xvc2luZyB0YWcgdGhhdCBpcyBwYXNzZWQgYXQgdGhlIHRpbWUgb2YgZnVuY3Rpb24gY2FsbCBpbiBzdHJpbmcgcGFzc2VkIGF0IGZpcnN0IGFyZ3VtZW50IGF0IHRoZSB0aW1lIG9mIGZ1bmN0aW9uIGNhbGwgKGJhc2ljYWxseSBpbiB4bWwpXHJcbiAgICBmdW5jdGlvbiBzdHJpbmdCZXR3ZWVuKGRhdGEsIHN0cl8xLCBzdHJfMikge1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIFJlZ0V4cCBwYXR0ZXJuIGZvciBtYXRjaCBpbiBzdHJpbmdcclxuICAgICAgICBsZXQgcmVnRXg7XHJcbiAgICAgICAgaWYgKHN0cl8yKSB7XHJcbiAgICAgICAgICAgIC8vIGNyZWF0ZXMgdGhlIHBhdHRlcm4gaWYgb3BlbmluZyBhbmQgY2xvc2luZyBib3RoIHRhZyBwcm92aWRlZCBhdCB0aGUgdGltZSBvZiBmdW5jdGlvbiBjYWxsaW5nXHJcbiAgICAgICAgICAgIHJlZ0V4ID0gbmV3IFJlZ0V4cChzdHJfMSArIFwiKFtcXFxcc1xcXFxTXSo/KVwiICsgc3RyXzIsIFwiZ21cIik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gY3JlYXRlcyB0aGUgcGF0dGVybiBpZiBvcGVuaW5nIGFuZCBjbG9zaW5nIGJvdGggdGFnIG5vdCBwcm92aWRlZCBhdCB0aGUgdGltZSBvZiBmdW5jdGlvbiBjYWxsaW5nXHJcbiAgICAgICAgICAgIHJlZ0V4ID0gbmV3IFJlZ0V4cChcIjxcIiArIHN0cl8xICsgXCI+KFtcXFxcc1xcXFxTXSo/KTwvXCIgKyBzdHJfMSArIFwiPlwiLCBcImdtXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBjb250YWlucyB0aGUgdGV4dCBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIGRhdGEgaW4geG1sIHN0cmluZ1xyXG4gICAgICAgIGxldCBtYXRjaGVkU3RyID0gcmVnRXguZXhlYyhkYXRhKTtcclxuICAgICAgICBpZiAobWF0Y2hlZFN0cikge1xyXG4gICAgICAgICAgICAvLyByZXR1cm5zIHRoZSB0ZXh0IGJldHdlZW4gZ2l2ZW4gb3BlbmluZyBhbmQgY2xvc2luZyB0YWcgaWYgaXQgZXhpc3RcclxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZWRTdHJbMV07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gcmV0dXJucyB0aGUgbnVsbCBpZiB0ZXh0IG5vdCBmb3VuZCBiZXR3ZWVuIGdpdmVuIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFnXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhdHRyaWJ1dGUgZGVmaW5lZCBpbiBzZWNvbmQgYXJndW1lbnQgZnJvbSB0YWcgZGVmaW5lZCBpbiAzcmQgYXJndW1lbnQgaW4geG1sIHN0cmluZyBkZWZpbmVkIGluIGFyZ3VtZW50IDFcclxuICAgIGZ1bmN0aW9uIGZpbmRBdHRyaWJ1dGUoWE1MLCBhdHRyLCB0YWcgPSBcIlwiKSB7XHJcbiAgICAgICAgLy8gY3JlYXRlcyBuZXcgUmVnRXhwIG9iamVjdCBmb3IgbWF0Y2ggdGhlIHZhbHVlIG9mIGF0dHJpYnV0ZSBvZiBhbnkgdGFnXHJcbiAgICAgICAgbGV0IHJlZ0V4ID0gbmV3IFJlZ0V4cChcIjxcIiArIHRhZyArIFwiLio/XCIgKyBhdHRyICsgXCI9XFxcIihcXFxcdy4qPylcXFwiLio/PlwiLCBcImdtXCIpO1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBtYXRjaGVkIHRleHQgaW4gJ1hNTCcgc3RyaW5nIGlmIGl0IG1hdGNoZWQgb3RoZXJ3aXNlIG51bGwgdmFsdWUgaG9sZHNcclxuICAgICAgICBsZXQgbWF0Y2hlZFN0ciA9IHJlZ0V4LmV4ZWMoWE1MKTtcclxuICAgICAgICBpZiAobWF0Y2hlZFN0cikge1xyXG4gICAgICAgICAgICAvLyByZXR1cm5zIHRoZSB2YWx1ZSBvZiBhdHRyaWJ1dGUgZGVmaW5lZCBpbiBhcmd1bWVudCB2YXJpYWJsZSAnYXR0cicgb2YgdGFnIGRlZmluZWQgaW4gYXJndW1lbnQgdmFyaWFibGUgJ3RhZycgb2YgWE1MXHJcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVkU3RyWzFdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHJldHVybnMgbnVsbCBpZiBubyBtYXRjaGVkIGRhdGEgZm91bmRcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHVzZWQgZm9yIHVucmVuZGVyIHRoZSBwbGF5ZXIgdGFnXHJcbiAgICBmdW5jdGlvbiB1blJlbmRlclBsYXllcigpIHtcclxuICAgICAgICAvLyBtYWtlcyBwbGF5ZXIgdGFnIGVtcHR5IHRoYXQgZXhpc3QgaW5zaWRlIGVsZW1lbnQgaGF2ZSBpZDogYXV0aG9yaW5nRGl2XHJcbiAgICAgICAvLyBqUXVlcnkoJyNhdXRob3JpbmdEaXYgcGxheWVyJykuZW1wdHkoKTsgLy8gUmVwbGFjZWRcclxuICAgICAgICBBSS5lbXB0eSgnI2F1dGhvcmluZ0RpdiBwbGF5ZXInKTtcclxuICAgICAgICAvLyByZW1vdmVzIHRoZSBjbGFzcyAnaGlkZWNvbnRlbnQnIGZyb20gcGxheWVyIHRhZyBlbXB0eSB0aGF0IGV4aXN0IGluc2lkZSBlbGVtZW50IGhhdmUgaWQ6IGF1dGhvcmluZ0RpdlxyXG4gICAgICAgLy8galF1ZXJ5KCcjYXV0aG9yaW5nRGl2JykuZmluZCgncGxheWVyJykucmVtb3ZlQ2xhc3MoJ2hpZGVjb250ZW50Jyk7IC8vIFJlcGxhY2VkXHJcbiAgICAgICAgQUkuc2VsZWN0KCcjYXV0aG9yaW5nRGl2JykucXVlcnlTZWxlY3RvcigncGxheWVyJykuY2xhc3NMaXN0LnJlbW92ZSgnaGlkZWNvbnRlbnQnKTtcclxuXHJcblxyXG5cclxuICAgIC8qICAgIGpRdWVyeSgnI2VkaXRvciBpbWcnKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKCFqUXVlcnkoc2VsZikuYXR0cignc3JjJykubWF0Y2goL1xcL1xcL3MzLmFtYXpvbmF3cy5jb21cXC9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy9nbSkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHNldHMgdGhlIHZhbHVlIG9mICdzcmMnIGF0dHJpYnV0ZSBvZiBpbWcgdGFnIHRoYXQgZXhpc3QgaW5zaWRlIGVsZW1lbnQgaGF2ZSBpZCAnZWRpdG9yJyBhbmQgaXRzIHNyYyBub3QgY29udGFpbnMgdGhlIHN0cmluZyAnLy9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljJ1xyXG4gICAgICAgICAgICAgICAgalF1ZXJ5KHNlbGYpLmF0dHIoJ3NyYycsIGpRdWVyeShzZWxmKS5hdHRyKCdzcmMnKSk7ICAvLyBSZXBsYWNlZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAqL1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZWRpdG9yIGltZycpLmZvckVhY2goZnVuY3Rpb24oX3RoaXMsaSl7XHJcbiAgICAgICAgICAgIGlmICghX3RoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKS5tYXRjaCgvXFwvXFwvczMuYW1hem9uYXdzLmNvbVxcL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljL2dtKSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QXR0cmlidXRlKCdzcmMnLF90aGlzLmdldEF0dHJpYnV0ZSgnc3JjJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VkIGZvciByZW5kZXIgdGhlIHBsYXllciB0YWdcclxuICAgIGZ1bmN0aW9uIHJlbmRlclBsYXllcigpIHtcclxuICAgICAgICAvLyBtYWtlcyBwbGF5ZXIgdGFnIGVtcHR5IHRoYXQgZXhpc3QgaW5zaWRlIGVsZW1lbnQgaGF2ZSBpZDogYXV0aG9yaW5nRGl2XHJcbiAgICAgICAgLy9qUXVlcnkoJyNhdXRob3JpbmdEaXYgcGxheWVyJykuZW1wdHkoKTsgLy8gUmVwbGFjZWRcclxuICAgICAgICBBSS5lbXB0eSgnI2F1dGhvcmluZ0RpdiBwbGF5ZXInKTtcclxuICAgICAgICAvLyB1c2VkIGZvciBzZXQgdGhlIGRhdGEgb2YgcGxheWVyIHRhZ1xyXG4gICAgICAvLyAgdGFnX3BsYXllcihqUXVlcnkoJyNhdXRob3JpbmdEaXYnKSk7IC8vIFJlcGxhY2VkXHJcbiAgICAgICAgICB0YWdfcGxheWVyKEFILnNlbGVjdCgnI2F1dGhvcmluZ0RpdicpKTtcclxuICAgICAgICAvLyBhZGRzIHRoZSBjbGFzcyAnaGlkZWNvbnRlbnQnIHRvIHBsYXllciB0YWcgZW1wdHkgdGhhdCBleGlzdCBpbnNpZGUgZWxlbWVudCBoYXZlIGlkOiBhdXRob3JpbmdEaXZcclxuICAgICAgIC8vIGpRdWVyeSgnI2F1dGhvcmluZ0RpdicpLmZpbmQoJ3BsYXllcicpLmFkZENsYXNzKCdoaWRlY29udGVudCcpOyAvLyBSZXBsYWNlZFxyXG4gICAgICAgIEFJLnNlbGVjdCgnI2F1dGhvcmluZ0RpdicpLnF1ZXJ5U2VsZWN0b3IoJ3BsYXllcicpLmNsYXNzTGlzdC5hZGQoJ2hpZGVjb250ZW50Jyk7XHJcblxyXG4gICAgLyogICAgalF1ZXJ5KCcjZWRpdG9yIGltZycpLmVhY2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoIWpRdWVyeShzZWxmKS5hdHRyKCdzcmMnKS5tYXRjaCgvXFwvXFwvczMuYW1hem9uYXdzLmNvbVxcL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljL2dtKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgb2YgJ3NyYycgYXR0cmlidXRlIG9mIGltZyB0YWcgYnkgYWRkaW5nIHN0cmluZyAnLy9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljLycgYmVmb3JlIGl0cyBwcmV2aW91cyBzcmMgdGhhdCBleGlzdCBpbnNpZGUgZWxlbWVudCBoYXZlIGlkICdlZGl0b3InIGFuZCBpdHMgc3JjIG5vdCBjb250YWlucyB0aGUgc3RyaW5nICcvL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMnXHJcbiAgICAgICAgICAgICAgICBqUXVlcnkoc2VsZikuYXR0cignc3JjJywgJy8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8nICsgalF1ZXJ5KHNlbGYpLmF0dHIoJ3NyYycpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pOyBSZXBsYWNlZFxyXG4gICAgKi9cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjZWRpdG9yIGltZycpLmZvckVhY2goZnVuY3Rpb24oX3RoaXMsaSl7XHJcbiAgICAgICAgICAgIGlmKCFfdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpLm1hdGNoKC9cXC9cXC9zMy5hbWF6b25hd3MuY29tXFwvamlneWFhc2FfY29udGVudF9zdGF0aWMvZ20pKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycsJy8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8nK190aGlzLmdldEF0dHJpYnV0ZSgnc3JjJykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBzaG93cyB0aGUgb3V0cHV0IG9mIHRoZSBjb2RlIGluICdSZXN1bHQnIGVkaXRvclxyXG4gICAgZnVuY3Rpb24gcnVuQ29kZSgpIHtcclxuICAgICAgIC8vIGpRdWVyeSgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6IGpRdWVyeSgnI3Jlc3VsdF9kaXYnKS5vZmZzZXQoKS50b3AgfSwgJ3Nsb3cnKTsgLy8gUmVwbGFjZWRcclxuICAgICAgICB3aW5kb3cuc2Nyb2xsKHtcclxuICAgICAgICAgICAgdG9wOiA1MDAsXHJcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJyAgXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGRhdGUgPSBkYXRlLmdldFRpbWUoKTtcclxuICAgICAgICBsZXQgaWZyYW1lSWQgPSBcInVDXCIgKyBkYXRlO1xyXG4gICAgIC8vICAgalF1ZXJ5KCcjcmVzdWx0X2RpdicpLmh0bWwoJzxpZnJhbWUgY2xhc3M9XCJyZXN1bHRfZnJhbWUgdy0xMDAgYm9yZGVyLTBcIiBzdHlsZT1cImhlaWdodDozNDdweFwiIGlkPVwiJyArIGlmcmFtZUlkICsgJ1wiPjwvaWZyYW1lPicpOyAvL1JlcGxhY2VkXHJcbiAgICAgICAgICBBSC5zZWxlY3QoJyNyZXN1bHRfZGl2JykuaW5uZXJIVE1MID0gJzxpZnJhbWUgY2xhc3M9XCJyZXN1bHRfZnJhbWUgdy0xMDAgYm9yZGVyLTBcIiBzdHlsZT1cImhlaWdodDozNDdweFwiIGlkPVwiJyArIGlmcmFtZUlkICsgJ1wiPjwvaWZyYW1lPic7XHJcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgY29tYmluZWQgZGF0YSBvZiBodG1sLCBjc3MgYW5kIGpzIGFmdGVyIHdyYXBwaW5nIHRoZSBjc3MgZWRpdG9yIHZhbHVlIGluIHN0eWxlIHRhZyBhbmQganMgZWRpdG9yIHZhbHVlIGluIHNjcmlwdCB0YWcgYW5kIGhpZGVzIHRoZSAnTG9hZGluZy4uLicgY29udGFpbmluZyBhZnRlciBsb2FkXHJcbiAgICAgICAgbGV0IHNvdXJjZSA9IHByZXBhcmVTb3VyY2UoKTtcclxuICAgICAgICBsZXQgaWZyYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3VDJyArIGRhdGUpO1xyXG4gICAgICAgIGlmcmFtZS5vbmxvYWQgPSBhbnN3ZXJDaGVja1dlYi5iaW5kKHRoaXMsIGZhbHNlKTtcclxuICAgICAgICBsZXQgaWZyYW1lX2RvYyA9IGlmcmFtZS5jb250ZW50RG9jdW1lbnQ7XHJcbiAgICAgICAgaWZyYW1lX2RvYy5vcGVuKCk7XHJcbiAgICAgICAgaWZyYW1lX2RvYy53cml0ZShzb3VyY2UpO1xyXG4gICAgICAgIGlmcmFtZV9kb2MuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBtYWtlcyBibGFuayB0aGUgdmFsdWUgb2YgdXNlciBhbnN3ZXIgeG1sIGFuZCBhbHNvIG9mIGh0bWwsY3NzIGFuZCBqcyBlZGl0b3JzIGJ1dCB0aGlzIG1ldGhvZCBpcyBub3QgY2FsbGVkIGZyb20gYW55IHdoZXJlIHdpdGhpbiB0aGUgY29tcG9uZW50XHJcbiAgICBmdW5jdGlvbiByZXNldCgpIHtcclxuICAgICAgICAvLyBtYWtlcyBibGFuayB0aGUgdmFsdWUgb2YgaHRtbCBlZGl0b3JcclxuICAgICAgICBodG1sRWRpdG9yLnNldFZhbHVlKFwiXCIpO1xyXG4gICAgICAgIC8vIG1ha2VzIGJsYW5rIHRoZSB2YWx1ZSBvZiBjc3MgZWRpdG9yXHJcbiAgICAgICAgY3NzRWRpdG9yLnNldFZhbHVlKFwiXCIpO1xyXG4gICAgICAgIC8vIG1ha2VzIGJsYW5rIHRoZSB2YWx1ZSBvZiBqcyBlZGl0b3JcclxuICAgICAgICBqc0VkaXRvci5zZXRWYWx1ZShcIlwiKTtcclxuICAgICAgICAvLyBtYWtlcyBibGFuayB2YWx1ZSBvZiB1c2VyIGFuc3dlciB4bWxcclxuICAgICAvLyAgIGpRdWVyeShcIiNzcGVjaWFsX21vZHVsZV91c2VyX3htbFwiKS52YWwoXCJcIik7IC8vIFJlcGxhY2VkXHJcbiAgICAgICAgQUguc2VsZWN0KCcjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWwnKS52YWx1ZSA9Jyc7XHJcbiAgICAgICAgLy8gbWFrZXMgYmxhbmsgdGhlIHZhbHVlIG9mICd1YVhNTCcgb2Ygd2luZG93IG9iamVjdFxyXG4gICAgICAgIHdpbmRvdy51eG1sID0gXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSB2YWx1ZSBvZiBodG1sLCBjc3MsIGpzIGVkaXRvcnMsIG1ha2VzIGVkaXRvciByZWFkb25seSB3aGljaCB3YXMgbWFkZSBkaXNhYmxlZCBhdCB0aGUgdGltZSBvZiBxdWVzdGlvbiBjcmVhdGlvbiwgaGlkZSB0aGUgZWRpdG9ycyB3aGljaCB3YXMgbWFkZSBoaWRkZW4gYXQgdGhlIHRpbWUgb2YgcXVlc3RpbyBjcmVhdGlvbiBhbmQgY2hhbmdlIHRoZSB0aGVtZSBvZiBodG1sLCBjc3MgYW5kIGpzIGVkaXRvcnMgYWNjb3JkaW5nIHRvIHRoZSBjaGVjayBzdGF0dXMgb2YgJ0RhcmsgVGhlbWUnIGNoZWNrYm94XHJcbiAgICBmdW5jdGlvbiBwYXJzZVhNTCh4bWwpIHtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcnKTtcclxuICAgICAgICAvLyBjb250YWlucyB0aGUgeG1sIFxyXG4gICAgICAgIHhtbCA9IHhtbCA/IHhtbCA6IHN0YXRlLnhtbDsgIFxyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBodG1sIGVkaXRvciB2YWx1ZSBmcm9tIHhtbFxyXG4gICAgICAgIGxldCBodG1sRGF0YSA9IHN0cmluZ0JldHdlZW4oeG1sLCBcInRhZ1wiKTtcclxuICAgICAgICAvLyBzZXRzIHRoZSB2YWx1ZSBvZiBodG1sIGVkaXRvclxyXG4gICAgICAgIGh0bWxFZGl0b3Iuc2V0VmFsdWUoaHRtbERhdGEgPyBodG1sRGF0YS50cmltKCkgOiBcIlwiKTtcclxuICAgICAgICAvLyBjb250YWlucyB0aGUgY3NzIGVkaXRvciB2YWx1ZSBmcm9tIHhtbFxyXG4gICAgICAgIGxldCBjc3NEYXRhID0gc3RyaW5nQmV0d2Vlbih4bWwsIFwiY3NzXCIpO1xyXG4gICAgICAgIC8vIHNldHMgdGhlIHZhbHVlIG9mIGNzcyBlZGl0b3JcclxuICAgICAgICBjc3NFZGl0b3Iuc2V0VmFsdWUoY3NzRGF0YSA/IGNzc0RhdGEudHJpbSgpIDogXCJcIik7XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGpzIGVkaXRvciB2YWx1ZSBmcm9tIHhtbFxyXG4gICAgICAgIGxldCBqc0RhdGEgPSBzdHJpbmdCZXR3ZWVuKHhtbCwgXCJqc1wiKTtcclxuICAgICAgICAvLyBzZXRzIHRoZSB2YWx1ZSBvZiBqcyBlZGl0b3JcclxuICAgICAgICBqc0VkaXRvci5zZXRWYWx1ZShqc0RhdGEgPyBqc0RhdGEudHJpbSgpIDogXCJcIik7XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mICdkaXNhYmxlJyBhdHRyaWJ1dGUgb2Ygd2ViIHRhZyBmcm9tIHhtbFxyXG4gICAgICAgIGxldCBkaXNhYmxlRGF0YSA9IGZpbmRBdHRyaWJ1dGUoeG1sLCBcImRpc2FibGVcIiwgXCJ3ZWJcIik7XHJcbiAgICAgICAgaWYgKC9odG1sL2cudGVzdChkaXNhYmxlRGF0YSkpIHtcclxuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJzAnIG9mIHZhcmlhYmxlICdyZWFkSFRNTCcgdG8gaW5kaWNhdGUgdGhhdCBodG1sIGVkaXRvciBpcyAncmVhZG9ubHknIGFuZCBubyBhbnkgb3BlcmF0aW9uIGNhbiBiZSBwZXJmb3JtZWQgb24gdGhpcyBlZGl0b3JcclxuICAgICAgICAgICAgcmVhZEhUTUwgPSAwO1xyXG4gICAgICAgICAgICAvLyBtYWtlcyB0aGUgaHRtbCBlZGl0b3IgYXMgJ3JlYWRvbmx5J1xyXG4gICAgICAgICAgICBodG1sRWRpdG9yLnNldE9wdGlvbihcInJlYWRPbmx5XCIsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoL2pzL2cudGVzdChkaXNhYmxlRGF0YSkpIHtcclxuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJzAnIG9mIHZhcmlhYmxlICdyZWFkSlMnIHRvIGluZGljYXRlIHRoYXQganMgZWRpdG9yIGlzICdyZWFkb25seScgYW5kIG5vIGFueSBvcGVyYXRpb24gY2FuIGJlIHBlcmZvcm1lZCBvbiB0aGlzIGVkaXRvclxyXG4gICAgICAgICAgICByZWFkSlMgPSAwO1xyXG4gICAgICAgICAgICBqc0VkaXRvci5zZXRPcHRpb24oXCJyZWFkT25seVwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKC9jc3MvZy50ZXN0KGRpc2FibGVEYXRhKSkge1xyXG4gICAgICAgICAgICAvLyBzZXRzIHRoZSB2YWx1ZSAnMCcgb2YgdmFyaWFibGUgJ3JlYWRDU1MnIHRvIGluZGljYXRlIHRoYXQgY3NzIGVkaXRvciBpcyAncmVhZG9ubHknIGFuZCBubyBhbnkgb3BlcmF0aW9uIGNhbiBiZSBwZXJmb3JtZWQgb24gdGhpcyBlZGl0b3JcclxuICAgICAgICAgICAgcmVhZENTUyA9IDA7XHJcbiAgICAgICAgICAgIGNzc0VkaXRvci5zZXRPcHRpb24oXCJyZWFkT25seVwiLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mICdoaWRlJyBhdHRyaWJ1dGUgb2YgJ3dlYicgdGFnIGZyb20geG1sXHJcbiAgICAgICAgbGV0IGhpZGVEYXRhID0gZmluZEF0dHJpYnV0ZSh4bWwsIFwiaGlkZVwiLCBcIndlYlwiKTtcclxuICAgICAgICAvLyB1cGRhdGVzIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaGlkZURhdGEnIGFjY29yZGluZyB0byBpdHMgdmFsdWVcclxuICAgICAgICBoaWRlRGF0YSA9IGhpZGVEYXRhID8gaGlkZURhdGEgOiBcIiwsXCI7XHJcbiAgICAgICAgLy8gY29udmVydHMgJ2hpZGVEYXRhJyBpbnRvIGFycmF5IGFuZCBcclxuICAgICAgICBoaWRlRGF0YSA9IGhpZGVEYXRhLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAvLyB1c2VkIGZvciBoaWRlIHRoZSBodG1sLCBjc3Mgb3IganMgZWRpdG9yIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgYXJyYXkgJ2hpZGVEYXRhJyBkZWZpbmVkIGF0IGluZGV4ICcwJywgJzEnLCAnMidcclxuICAgICAgICBoaWRlRWRpdG9ycyhwYXJzZUludChoaWRlRGF0YVswXSksIHBhcnNlSW50KGhpZGVEYXRhWzFdKSwgcGFyc2VJbnQoaGlkZURhdGFbMl0pKTtcclxuICAgICAgICAvLyBjaGFuZ2VzIHRoZW1lIG9mIHRoZSBodG1sLCBqcyBhbmQgY3NzIGVkaXRvcnMgYWNjb3JkaW5nIHRvIHRoZSBjaGVja2VkIHN0YXR1cyBvZiAnRGFyayBNb2RlJyBjaGVja2JveCBcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBjaGFuZ2VUaGVtZSgpO1xyXG4gICAgICAgIH0sMTAwKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VkIGZvciBoaWRlIHRoZSBodG1sLCBjc3Mgb3IganMgZWRpdG9yIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgYXJndW1lbnQgdmFyaWFibGUgJ2h0bWwnLCAnY3NzJywgJ2pzJ1xyXG4gICAgZnVuY3Rpb24gaGlkZUVkaXRvcnMoaHRtbCA9IDEsIGNzcyA9IDEsIGpzID0gMSkge1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSAxIG9yIDAgdGhhdCBkZXRlcm1pbmVzIHRoYXQgaHRtbCBlZGl0b3Igd2lsbCBiZSB2aXNpYmxlIG9yIG5vdFxyXG4gICAgICAgIHNob3dIVE1MID0gaXNOYU4oaHRtbCkgPyAxIDogaHRtbDtcclxuICAgICAgICAvLyBjb250YWlucyB0aGUgdmFsdWUgMSBvciAwIHRoYXQgZGV0ZXJtaW5lcyB0aGF0IGNzcyBlZGl0b3Igd2lsbCBiZSB2aXNpYmxlIG9yIG5vdFxyXG4gICAgICAgIHNob3dDU1MgPSBpc05hTihjc3MpID8gMSA6IGNzcztcclxuICAgICAgICAvLyBjb250YWlucyB0aGUgdmFsdWUgMSBvciAwIHRoYXQgZGV0ZXJtaW5lIHRoYXQganMgZWRpdG9yIHdpbGwgYmUgdmlzaWJsZSBvciBub3RcclxuICAgICAgICBzaG93SlMgPSBpc05hTihqcykgPyAxIDoganM7XHJcbiAgICAgICAgLy8gdXNlZCBmb3IgbW9iaWxlIHRlYW1cclxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XHJcbiAgICAgICAgICAgIGlmICghc2hvd0hUTUwpIHtcclxuICAgICAgICAgICAgLy8gICAgalF1ZXJ5KFwiI2h0bWxfcGFuZWwsICNodG1sX3BhbmUsICNjc3NfcGFuZWxcIikuaGlkZSgpOyAvLyBSZXBsYWNlZFxyXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2h0bWxfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2h0bWxfcGFuZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIEFILnNlbGVjdEFsbCgnI2h0bWxfcGFuZWwsI2h0bWxfcGFuZSwjY3NzX3BhbmVsJywnaGlkZScpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghc2hvd0NTUykge1xyXG4gICAgICAgICAgICAvLyAgICBqUXVlcnkoXCIjY3NzX3BhbmVsLCNjc3NfcGFuZSwjanNfcGFuZWxcIikuaGlkZSgpOyAvLyBSZXBsYWNlZFxyXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nzc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIEFILnNlbGVjdEFsbCgnI2Nzc19wYW5lbCwjY3NzX3BhbmUsI2pzX3BhbmVsJywnaGlkZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghc2hvd0pTKSB7XHJcbiAgICAgICAgICAgIC8vICAgIGpRdWVyeShcIiNqc19wYW5lbCwjanNfcGFuZSwjY3NzX3BhbmVsXCIpLmhpZGUoKTsgLy8gUmVwbGFjZWRcclxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanNfcGFuZScpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIEFILnNlbGVjdEFsbCgnI2pzX3BhbmVsLCNqc19wYW5lLCNjc3NfcGFuZWwnLCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChzaG93SFRNTCAmJiBzaG93Q1NTICYmIHNob3dKUykge1xyXG4gICAgICAgICAgICAvLyAgICBqUXVlcnkoXCIjY3NzX3BhbmVsLCNqc19wYW5lbFwiKS5oaWRlKCk7IC8vIFJlcGxhY2VkXHJcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgICAgICBBSC5zZWxlY3RBbGwoJyNjc3NfcGFuZWwsI2pzX3BhbmVsJywnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc2hvd0hUTUwpIHtcclxuICAgICAgICAgICAgLy8gaGlkZXMgdGhlIGh0bWwgZWRpdG9yIGlmIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnc2hvd0hUTUwnIGlzIDBcclxuICAgICAgICAgIC8valF1ZXJ5KFwiI2h0bWxfcGFuZWxcIikuaGlkZSgpOyAvLyBSZXBsYWNlZFxyXG4gICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdodG1sX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgQUguc2VsZWN0KFwiI2h0bWxfcGFuZWxcIiwnaGlkZScpO1xyXG4gICAgICAgICAgICBTcGxpdChbJyNjc3NfcGFuZWwnLCcjanNfcGFuZWwnXSx7XHJcbiAgICAgICAgICAgICAgICBzaXplczpbNTAsNTBdLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNob3dDU1MpIHtcclxuICAgICAgICAgICAvLyAgaGlkZXMgdGhlIGNzcyBlZGl0b3IgaWYgdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdzaG93Q1NTJyBpcyAwXHJcbiAgICAgICAgICAgIC8valF1ZXJ5KFwiI2Nzc19wYW5lbFwiKS5oaWRlKCk7IC8vIFJlcGxhY2VkXHJcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nzc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNjc3NfcGFuZWxcIixcImhpZGVcIik7XHJcbiAgICAgICAgICAgIFNwbGl0KFsnI2h0bWxfcGFuZWwnLCcjanNfcGFuZWwnXSx7XHJcbiAgICAgICAgICAgICAgICBzaXplczpbNTAsNTBdLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXNob3dKUykge1xyXG4gICAgICAgICAgIC8vICBoaWRlcyB0aGUganMgZWRpdG9yIGlmIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnc2hvd0pTJyBpcyAwXHJcbiAgICAgICAgICAgIC8valF1ZXJ5KFwiI2pzX3BhbmVsXCIpLmhpZGUoKTsgLy8gUmVwbGFjZWRcclxuICAgICAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanNfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBBSC5zZWxlY3RBbGwoXCIjanNfcGFuZWxcIixcImhpZGVcIik7XHJcbiAgICAgICAgICAgIFNwbGl0KFsnI2Nzc19wYW5lbCcsJyNodG1sX3BhbmVsJ10se1xyXG4gICAgICAgICAgICAgICAgc2l6ZXM6WzUwLDUwXSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFzaG93Q1NTICYmICFzaG93SlMgKSB7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcgc3BsaXR0ZXInKTtcclxuICAgICAgICAgICAgQUguc2VsZWN0QWxsKFwiI2Nzc19wYW5lbCwjanNfcGFuZWxcIiwnaGlkZScpO1xyXG5cclxuICAgICAgICAgICAgU3BsaXQoWycjdG9wX2NvbnRlbnQnLCcjYm90dG9tX2NvbnRlbnQnXSx7XHJcbiAgICAgICAgICAgICAgICBzaXplczpbNTAsNTBdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNhY2NvcmRpb25cIiwnY3NzJyx7ZGlzcGxheTonZmxleCd9KTtcclxuXHJcbiAgICAgICAgICAgIFNwbGl0KFsnI2h0bWxfcGFuZWwnXSx7XHJcbiAgICAgICAgICAgICAgICBzaXplczpbMTAwXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBBSC5zZWxlY3QoJyN0b3BfY29udGVudCcsJ2Nzcycse2hlaWdodDonMTAwJSd9KTtcclxuICAgICAgICAgICAgQUguc2VsZWN0KFwiI2ZpcnN0RWRpdG9yRGl2XCIsJ3JlbW92ZUF0dHInLCdkaXNwbGF5Jyk7XHJcbiAgICAgICAgICAgIFxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFzaG93Q1NTICYmICFzaG93SFRNTCkge1xyXG5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIEFILnNlbGVjdEFsbCgnI2Nzc19wYW5lbCwjaHRtbF9wYW5lbCcsJ2hpZGUnKTtcclxuICAgICAgICAgICBcclxuXHJcbiAgICAgICAgICAgIFNwbGl0KFsnI3RvcF9jb250ZW50JywnI2JvdHRvbV9jb250ZW50J10se1xyXG4gICAgICAgICAgICAgICAgc2l6ZXM6WzUwLDUwXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBBSC5zZWxlY3QoXCIjYWNjb3JkaW9uXCIsJ2Nzcycse2Rpc3BsYXk6J2ZsZXgnfSk7XHJcblxyXG4gICAgICAgICAgICBTcGxpdChbJyNqc19wYW5lbCddLHtcclxuICAgICAgICAgICAgICAgIHNpemVzOlsxMDBdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIEFILnNlbGVjdCgnI3RvcF9jb250ZW50JywnY3NzJyx7aGVpZ2h0OicxMDAlJ30pO1xyXG4gICAgICAgICAgICBBSC5zZWxlY3QoXCIjZmlyc3RFZGl0b3JEaXZcIiwncmVtb3ZlQXR0cicsJ2Rpc3BsYXknKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCFzaG93SFRNTCAmJiAhc2hvd0pTKSB7XHJcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNmaXJzdEVkaXRvckRpdlwiLCdyZW1vdmVBdHRyJywgJ2Rpc3BsYXknKTtcclxuICAgICAgICAgICAgQUguc2VsZWN0QWxsKCcjanNfcGFuZWwsI2h0bWxfcGFuZWwnLCdoaWRlJyk7XHJcblxyXG4gICAgICAgICAgICBTcGxpdChbJyN0b3BfY29udGVudCcsJyNib3R0b21fY29udGVudCddLHtcclxuICAgICAgICAgICAgICAgIHNpemVzOls1MCw1MF1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgQUguc2VsZWN0KFwiI2FjY29yZGlvblwiLCdjc3MnLHtkaXNwbGF5OidmbGV4J30pO1xyXG5cclxuICAgICAgICAgICAgU3BsaXQoWycjY3NzX3BhbmVsJ10se1xyXG4gICAgICAgICAgICAgICAgc2l6ZXM6WzEwMF1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgQUguc2VsZWN0KCcjdG9wX2NvbnRlbnQnLCdjc3MnLHtoZWlnaHQ6JzEwMCUnfSk7XHJcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNmaXJzdEVkaXRvckRpdlwiLCdyZW1vdmVBdHRyJywnZGlzcGxheScpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXNlZCBmb3IgdXBkYXRlIHRoZSB1c2VyIGFuc3dlciB4bWwgdmFsdWVcclxuICAgIGZ1bmN0aW9uIHNhdmVXZWJBbnN3ZXIoY29kZSwgY29kZV9sYW5nKSB7XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHVzZXIgYW5zd2VyIHhtbCBvZiBxdWVzdGlvbiB4bWxcclxuICAgICAgICBsZXQgcXhtbCA9ICEvc21hbnMvZy50ZXN0KHV4bWwpICYmIHV4bWwgPyB1eG1sIDogeG1sO1xyXG4gICAgICAgIC8vIHZhcmlhYmxlIGZvciBob2xkIHRoZSBodG1sLCBjc3MgYW5kIGpzIGVkaXRvciB2YWx1ZSBpbiB4bWwgZm9ybWF0IHdheVxyXG4gICAgICAgIGxldCB1WG1sID0gXCJcIjtcclxuICAgICAgICBpZiAoY29kZV9sYW5nID09ICdodG1sJykge1xyXG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBvbGQgY29kZSBvZiBodG1sIGVkaXRvciB3aXRoIG5ldyBvbmVcclxuICAgICAgICAgICAgdVhtbCA9IHF4bWwucmVwbGFjZSgvPHRhZz5bXFxzXFxTXSo/PFxcL3RhZz4vZywgXCI8dGFnPlwiICsgY29kZSArIFwiPC90YWc+XCIpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoY29kZV9sYW5nID09ICdjc3MnKSB7XHJcbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBjb2RlIG9mIGNzcyBlZGl0b3Igd2l0aCBuZXcgb25lXHJcbiAgICAgICAgICAgIHVYbWwgPSBxeG1sLnJlcGxhY2UoLzxjc3M+W1xcc1xcU10qPzxcXC9jc3M+L2csIFwiPGNzcz5cIiArIGNvZGUgKyBcIjwvY3NzPlwiKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBvbGQgY29kZSBvZiBqcyBlZGl0b3Igd2l0aCBuZXcgb25lXHJcbiAgICAgICAgICAgIHVYbWwgPSBxeG1sLnJlcGxhY2UoLzxqcz5bXFxzXFxTXSo/PFxcL2pzPi9nLCBcIjxqcz5cIiArIGNvZGUgKyBcIjwvanM+XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyB0aGlzIGJsb2NrIGlzIHVzZWQgZm9yIG1vYmlsZSB0ZWFtXHJcbiAgICAgICAgaWYgKHdpbmRvdy5pbk5hdGl2ZSkge1xyXG4gICAgICAgICAgICB3aW5kb3cuZ2V0SGVpZ2h0ICYmIHdpbmRvdy5nZXRIZWlnaHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gZGVmaW5lcyB0aGF0IHVzZXIgYW5zd2VyIHhtbCBpcyBjaGFuZ2VkXHJcbiAgICAgICAgSVNTUEVDSUFMTU9EVUxFVVNFUlhNTENIQU5HRSA9IDE7XHJcbiAgICAgICAgLy8gc2F2ZSB0aGUgdXNlciBhbnN3ZXIgeG1sXHJcbiAgICAgICAgLy9qUXVlcnkoXCIjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWxcIikudmFsKHVYbWwpOyAvLyBSZXBsYWNlZFxyXG4gICAgICAgIFxyXG4gICAgICAgIEFILnNlbGVjdCgnI3NwZWNpYWxfbW9kdWxlX3VzZXJfeG1sJykudmFsdWUgPSB1WG1sO1xyXG4gICAgICAgIFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGFzc2lnbiB0aGUgdXNlciBhbnN3ZXIgeG1sIGluIHZhcmlhYmxlICd1c2VyQW5zd2VycydcclxuICAgICAgICAvL2xldCB1c2VyQW5zd2VycyA9IHVzZXJBbnN3ZXIgPSBqUXVlcnkoXCIjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWxcIikudmFsKCk7IC8vIFJlcGxhY2VkXHJcbiAgICAgICAgbGV0IHVzZXJBbnN3ZXJzO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHVzZXJBbnN3ZXJzID0gdXNlckFuc3dlciA9IEFILnNlbGVjdChcIiNzcGVjaWFsX21vZHVsZV91c2VyX3htbFwiKS52YWx1ZTtcclxuICAgICAgICAvLyB1c2VkIGZvciBtb2JpbGUgdGVhbVxyXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcclxuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdoZWlnaHRfX18nICsgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnY29udGFpbmVyLWZsdWlkJylbMF0ub2Zmc2V0SGVpZ2h0LCAnKicpO1xyXG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoSlNPTi5zdHJpbmdpZnkoeyB1c2VyQW5zd2VycywgaW5OYXRpdmVJc0NvcnJlY3Q6IGZhbHNlIH0pLCAnKicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBhc3NpZ24gdGhlIHVzZXIgYW5zd2VyIHhtbCB2YWx1ZSBpbiAndWFYTUwnIHZhcmlhYmxlIG9mIHdpbmRvdyBvYmplY3RcclxuICAgICAgICB1eG1sID0gdVhtbDtcclxuICAgICAgICByZXN1bHRTYXZpbmcgPSB1WG1sO1xyXG4gICAgfVxyXG48L3NjcmlwdD5cclxuICAgIFxyXG4gICAgPGRpdj5cclxuXHJcbiAgICA8ZGl2IGlkPVwiYXV0aG9yaW5nQXJlYVwiIGNsYXNzPVwiZm9udDE0XCIgPlxyXG4gICAgICAgIHsjaWYgd2luZG93LmlzSUUgfHwgd2luZG93LmlzSUVFbGV2ZW59IFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCI+XHJcbiAgICAgICAgICAgICAgICBZb3UgYXJlIHVzaW5nIEludGVybmV0IEV4cGxvcmVyLCBFUzYgZnVuY3Rpb25hbGl0eSBvZiBqYXZhc2NyaXB0IHdpbGwgbm90IHdvcmshXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIHsvaWZ9XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJoIGgtaW1wXCIgaWQ9XCJzZXQtcmV2aWV3XCIgb246Y2xpY2s9eygpPT57c2V0UmV2aWV3KCl9fT5zZXQgcmV2aWV3PC9idXR0b24+XHJcbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJoIGgtaW1wXCIgaWQ9XCJ1bnNldC1yZXZpZXdcIiBvbjpjbGljaz17KCk9Pnt1bnNldFJldmlldygpfX0+dW5zZXQgcmV2aWV3PC9idXR0b24+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB7I2lmIHdpbmRvdy5pbk5hdGl2ZSB9XHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lci1mbHVpZFwiIGlkPVwibWFpbkNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwid2ViX3Rvb2xiYXJcIiBjbGFzcz1cImJnLWdyYXkgaGVpZ2h0NDQgd2ViX3Rvb2xiYXIgdGV4dC1kYXJrXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm10LTIgcHQgcGwtMyBmbG9hdC1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbW9vbi1jb2RpbmctNDRweCBzMyBhbGlnbi1taWRkbGUgbXItMVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImFsaWduLW1pZGRsZVwiPntsLmh0bWxfY3NzX2pzfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmxvYXQtcmlnaHQgbXQtMiBtci0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYm9yZGVyLTAgcHgtMCBtbC0yIG1yLTJcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGlkPVwiZHJvcGRvd25NZW51QnV0dG9uMVwiPjxzcGFuIGNsYXNzPVwiaWNvbW9vbi1tZW51LTIgczMgdGV4dC1zZWNvbmRhcnkgcHQtcyBkLWJsb2NrXCI+PC9zcGFuPjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtcmlnaHRcIiB4LXBsYWNlbWVudD1cImJvdHRvbS1lbmRcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wZG93bk1lbnVCdXR0b24xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImdvRGFya1wiIGNsYXNzPVwiZHJvcGRvd24taXRlbSBtYi0wIHBvaW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3N0YXRlLmdvRGFya30gb246Y2xpY2s9e2NoYW5nZVRoZW1lfSBpZD1cImdvRGFya1wiIGNsYXNzPVwicG9zaXRpb24tYWJzb2x1dGUgYmctdHJhbnNwYXJlbnRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57KHN0YXRlLmdvRGFyaykgPyBsLm5vcm1hbF9tb2RlIDogbC5kYXJrX21vZGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtYmxvY2sgcHVsbC1yaWdodFwiPnhgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IHJ1bmNvZGVfYnRuIG1sXCIgb246Y2xpY2s9e3J1bkNvZGV9PntsLnJ1bn08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17J3dpZHRoOiAxMDAlO2JhY2tncm91bmQ6IHdoaXRlOyd9IGNsYXNzPVwiY29udGVudF9wYXJlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXBpbGxzIG5hdi1maWxsXCIgcm9sZT1cInRhYmxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibmF2LWl0ZW1cIiBpZD1cImh0bWxfcGFuZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJuYXYtbGluayBhY3RpdmUgdGV4dC13aGl0ZVwiIGhyZWY9XCIjaHRtbF9wYW5lbFwiIHJvbGU9XCJ0YWJcIiBkYXRhLXRvZ2dsZT1cInRhYlwiPntsLmh0bWx9PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJuYXYtaXRlbVwiIGlkPVwiY3NzX3BhbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibmF2LWxpbmsgdGV4dC13aGl0ZVwiIGhyZWY9XCIjY3NzX3BhbmVsXCIgcm9sZT1cInRhYlwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+e2wuY3NzfTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibmF2LWl0ZW1cIiBpZD1cImpzX3BhbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibmF2LWxpbmsgdGV4dC13aGl0ZVwiIGhyZWY9XCIjanNfcGFuZWxcIiByb2xlPVwidGFiXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj57bC5qc308L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwidG9wX2NvbnRlbnRcIiBjbGFzcz1cInRhYi1jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJmaXJzdEVkaXRvckRpdlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImh0bWxfcGFuZWxcIiBjbGFzcz1cIm0tMCBwLTAgcm91bmRlZC0wIHRhYi1wYW5lIGZhZGUgc2hvdyBhY3RpdmVcIiByb2xlPVwidGFicGFuZWxcIiA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImh0bWxcIiBjbGFzcz1cImNhcmQtYm9keSBjb2RlX2JveCBjb250ZW50LWRpdiBtLTAgcC0wXCIgc3R5bGU9eydoZWlnaHQ6IDM0N3B4J30+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiaHRtbFwiIGlkPVwiaHRtbF9lZGl0b3JcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY3NzX3BhbmVsXCIgY2xhc3M9XCJtLTAgcC0wIHJvdW5kZWQtMCB0YWItcGFuZSBmYWRlIHNob3dcIiByb2xlPVwidGFicGFuZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY3NzXCIgY2xhc3M9XCJjYXJkLWJvZHkgY29kZV9ib3ggY29udGVudC1kaXYgbS0wIHAtMFwiIHN0eWxlPXsnaGVpZ2h0OiAzNDdweCcgfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJjc3NcIiBjbGFzcz1cImNzc190ZXh0XCIgaWQ9XCJjc3NfZWRpdG9yXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImpzRWRpdG9yRGl2XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwianNfcGFuZWxcIiBjbGFzcz1cIm0tMCBwLTAgcm91bmRlZC0wIHRhYi1wYW5lIGZhZGUgc2hvd1wiIHJvbGU9XCJ0YWJwYW5lbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJqc1wiIGNsYXNzPVwiY2FyZC1ib2R5IGNvZGVfYm94IGNvbnRlbnQtZGl2IG0tMCBwLTBcIiBzdHlsZT17J2hlaWdodDogMzQ3cHgnIH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwianNcIiBpZD1cImpzX2VkaXRvclwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImJvdHRvbV9jb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIHJvdW5kZWQtMCBubVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHJvdW5kZWQtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntsLnJlc3VsdH08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJyZXN1bHRfZGl2XCIgc3R5bGU9eydtaW4taGVpZ2h0OiAzNDdweCcgfSBjbGFzcz1cImNhcmQtYm9keSBjb250ZW50LWRpdiBtLTAgcC0wIHJvdW5kZWQtMFwiPlxyXG4gICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICB7OmVsc2V9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwid2ViX3Rvb2xiYXJcIiBjbGFzcz1cImJnLWxpZ2h0IHctMTAwIGhlaWdodDQ0IHdlYl90b29sYmFyIHRleHQtZGFyayBkLWZsZXgganVzdGlmeS1jb250ZW50LWJldHdlZW5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm10LTIgcHQtMSBwbC0yIGZsb2F0LWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbW9vbi1jb2RpbmctNDRweCBzMyBhbGlnbi1taWRkbGUgbXItMVwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cImFsaWduLW1pZGRsZVwiPntsLmh0bWxfY3NzX2pzfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkLWZsZXhcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtYmxvY2sgcHVsbC1yaWdodFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IHJ1bmNvZGVfYnRuIG1sIG10LTFcIiBvbjpjbGljaz17cnVuQ29kZX0+e2wucnVufTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbG9hdC1yaWdodCBtdC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJvcmRlci0wIHB4LTAgbWwtMiBtci0yXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtYnMtdG9nZ2xlPVwiZHJvcGRvd25cIj48c3BhbiBjbGFzcz1cImljb21vb24tbWVudS0yIHMzIHRleHQtc2Vjb25kYXJ5IHB0LXMgZC1ibG9ja1wiIGlkPVwiZHJvcGRvd25NZW51QnV0dG9uMVwiPjwvc3Bhbj48L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnUgZHJvcGRvd24tbWVudS1yaWdodFwiIHgtcGxhY2VtZW50PVwiYm90dG9tLWVuZFwiIGFyaWEtbGFiZWxsZWRieT1cImRyb3Bkb3duTWVudUJ1dHRvbjFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJnb0RhcmtcIiBjbGFzcz1cImRyb3Bkb3duLWl0ZW0gbWItMCBwb2ludGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17c3RhdGUuZ29EYXJrfSBvbjpjbGljaz17Y2hhbmdlVGhlbWV9IGlkPVwiZ29EYXJrXCIgY2xhc3M9XCJ0cmFuc3BhcmVudCBoXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnsoc3RhdGUuZ29EYXJrKSA/IGwubm9ybWFsX21vZGUgOiBsLmRhcmtfbW9kZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhY2NvcmRpb25cIiBzdHlsZT17J3dpZHRoOjEwMCU7IGJhY2tncm91bmQ6d2hpdGU7IHBhZGRpbmc6MHB4Oyd9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwidG9wX2NvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJmaXJzdEVkaXRvckRpdlwiIHN0eWxlPSdkaXNwbGF5OmZsZXg7Jz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiaHRtbF9wYW5lbFwiIGNsYXNzPVwiY2FyZCBtLTAgcC0wIHJvdW5kZWQtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXIgcm91bmRlZC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57bC5odG1sfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJodG1sXCIgY2xhc3M9XCJjYXJkLWJvZHkgY29kZV9ib3ggY29udGVudC1kaXYgbS0wIHAtMFwiIHN0eWxlPXsnaGVpZ2h0OiAzNDdweCAnfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiaHRtbFwiIGlkPVwiaHRtbF9lZGl0b3JcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY3NzX3BhbmVsXCIgY2xhc3M9XCJjYXJkIG0tMCBwLTAgcm91bmRlZC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciByb3VuZGVkLTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntsLmNzc308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY3NzXCIgY2xhc3M9XCJjYXJkLWJvZHkgY29kZV9ib3ggY29udGVudC1kaXYgbS0wIHAtMFwiIHN0eWxlPXsnaGVpZ2h0OiAzNDdweCcgfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiY3NzXCIgaWQ9XCJjc3NfZWRpdG9yXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSA8ZGl2IGlkPVwianNFZGl0b3JEaXZcIj4gLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJqc19wYW5lbFwiIGNsYXNzPVwiY2FyZCBtLTAgcC0wIHJvdW5kZWQtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHJvdW5kZWQtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntsLmpzfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImpzXCIgY2xhc3M9XCJjYXJkLWJvZHkgY29kZV9ib3ggY29udGVudC1kaXYgbS0wIHAtMFwiIHN0eWxlPXsnaGVpZ2h0OiAzNDdweCAnfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cImpzXCIgaWQ9XCJqc19lZGl0b3JcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gPC9kaXY+IC0tPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIDxkaXYgaWQ9XCJqc0VkaXRvckRpdlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJqc19wYW5lbFwiIGNsYXNzPVwiY2FyZCBtLTAgcC0wIHJvdW5kZWQtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXIgcm91bmRlZC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57bC5qc308L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwianNcIiBjbGFzcz1cImNhcmQtYm9keSBjb2RlX2JveCBjb250ZW50LWRpdiBtLTAgcC0wXCIgc3R5bGU9eydoZWlnaHQ6IDM0N3B4ICd9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJqc1wiIGlkPVwianNfZWRpdG9yXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gLS0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYm90dG9tX2NvbnRlbnRcIiBzdHlsZT17J292ZXJmbG93OiBoaWRkZW4nfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkIHJvdW5kZWQtMCBubVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciByb3VuZGVkLTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2wucmVzdWx0fTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwicmVzdWx0X2RpdlwiIHN0eWxlPXsnaGVpZ2h0OiAzNDdweCcgfSBjbGFzcz1cImNhcmQtYm9keSBjb250ZW50LWRpdiBtLTAgcC0wIHJvdW5kZWQtMFwiPlxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwhLS0gICA8RGlhbG9nXHJcbiAgICAgICAgICAgIGJpbmQ6dmlzaWJsZT17c3RhdGUucmVtZWRpYXRpb25Ub2dnbGV9XHJcbiAgICAgICAgICAgICAgICBvbjpjbG9zZT17KCkgPT4gc3RhdGUucmVtZWRpYXRpb25Ub2dnbGUgPSBmYWxzZSB9XHJcbiAgICAgICAgICAgIHRpdGxlPXtsLnJlbWVkaWF0aW9ufSB3aWR0aD1cIjY1MFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBzbG90PVwidGl0bGVcIj57bC5yZW1lZGlhdGlvbn08L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxDb250ZW50PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInJlbWVkaWF0aW9uTW9kZWxcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxjZW50ZXIgY2xhc3M9XCJtdC14bFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoND57bC5jYWxjdWxhdGVfYW5zd2VyfTxiciAvPiB7bC5wbGVhc2Vfd2FpdH08L2g0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9jZW50ZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9Db250ZW50PlxyXG4gICAgICAgICAgICAgICAgICAgIDxBY3Rpb25zPiAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24ga2V5PVwiY2FuY2VsX2J0blwiIGNsYXNzPVwiY2FuY2VsX2J0bl9wb3BcIiBzdHlsZT17J2Zsb2F0OnJpZ2h0O21hcmdpbjoxMHB4O2JhY2tncm91bmQtY29sb3I6Z3JheTsnfSB2YXJpYW50PVwiY29udGFpbmVkXCIgb246Y2xpY2s9eygpID0+IHN0YXRlLnJlbWVkaWF0aW9uVG9nZ2xlID0gZmFsc2UgfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtsLmNhbmNlbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9BY3Rpb25zPlxyXG4gICAgICAgICAgICA8L0RpYWxvZz4gLS0+XHJcbiAgICAgICAgICAgIDxEaWFsb2dcdFx0ICAgICAgICAgIFxyXG5cdGJpbmQ6dmlzaWJsZT17c3RhdGUucmVtZWRpYXRpb25Ub2dnbGV9XHJcblx0d2lkdGg9XCI2NTBcIlxyXG4gICAgb246Y2xvc2U9eygpID0+IHN0YXRlLnJlbWVkaWF0aW9uVG9nZ2xlID0gZmFsc2V9XHJcbj5cclxuICAgIFxyXG4gICAgPGRpdiBzbG90PVwidGl0bGVcIiBzdHlsZT1cInRleHQtYWxpZ246IGxlZnQ7XCI+XHJcblx0XHQ8ZGl2IHN0eWxlPVwiXCI+e2wucmVtZWRpYXRpb259PC9kaXY+XHJcblx0PC9kaXY+XHJcblx0PGRpdj5cclxuXHRcdDxkaXYgaWQ9XCJyZW1lZGlhdGlvbk1vZGVsXCI+XHJcblx0XHRcdDxjZW50ZXI+XHJcblx0XHRcdFx0PExvYWRlciBzaXplPXs3MH0gLz5cclxuXHRcdFx0XHQ8aDQ+e2wuY2FsY3VsYXRlX2Fuc3dlcn08YnIvPiB7bC5wbGVhc2Vfd2FpdH08L2g0PlxyXG5cdFx0XHQ8L2NlbnRlcj5cclxuXHRcdDwvZGl2PlxyXG5cdDwvZGl2PlxyXG5cdDxkaXYgc2xvdD1cImZvb3RlclwiIGNsYXNzPVwiZm9vdGVyXCIgc3R5bGU9XCJib3JkZXItdG9wOiAxcHggc29saWQgdmFyKC0tZGl2aWRlciwgcmdiYSgwLCAwLCAwLCAwLjEpKTtcIj5cclxuXHRcdDxCdXR0b24ga2V5PVwiY2FuY2VsX2J0blwiIGNsYXNzPVwiY2FuY2VsX2J0bl9wb3BcIiBzdHlsZT17J2Zsb2F0OnJpZ2h0O21hcmdpbjoxMHB4O2JhY2tncm91bmQtY29sb3I6Z3JheTsnfSB2YXJpYW50PVwiY29udGFpbmVkXCIgb246Y2xpY2s9eygpID0+IHN0YXRlLnJlbWVkaWF0aW9uVG9nZ2xlID0gZmFsc2UgfT5cclxuICAgICAgICAgICAge2wuY2FuY2VsfVxyXG4gICAgICAgIDwvQnV0dG9uPlxyXG5cdDwvZGl2PlxyXG48L0RpYWxvZz5cclxuICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwiYW5zTW9kZUFuc3dlclwiIHZhbHVlPVwiXCIgLz5cclxuICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcblxyXG4gICAgPHN0eWxlPlxyXG4gICAgICAgIDpnbG9iYWwoLmhlaWdodDQ0KSAge1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDQ0cHg7XHJcbiAgICAgICAgfVxyXG4gICAgPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBdzZEZ0IsU0FBUyxBQUFHLENBQUMsQUFDakIsTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyJ9 */";
	append_dev(document_1.head, style);
}

// (1754:8) {#if window.isIE || window.isIEEleven}
function create_if_block_1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "You are using Internet Explorer, ES6 functionality of javascript will not work!";
			attr_dev(div, "class", "alert alert-danger");
			add_location(div, file, 1754, 12, 93616);
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
		id: create_if_block_1.name,
		type: "if",
		source: "(1754:8) {#if window.isIE || window.isIEEleven}",
		ctx
	});

	return block;
}

// (1833:20) {:else}
function create_else_block(ctx) {
	let div22;
	let div21;
	let div4;
	let div0;
	let span0;
	let span1;
	let t1;
	let div3;
	let div1;
	let button0;
	let t3;
	let div2;
	let button1;
	let span2;
	let t4;
	let ul;
	let li;
	let label;
	let input;
	let input_checked_value;
	let t5;
	let span3;
	let t6_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "";
	let t6;
	let t7;
	let div20;
	let div15;
	let div14;
	let div7;
	let div5;
	let span4;
	let t9;
	let div6;
	let textarea0;
	let div6_style_value;
	let t10;
	let div10;
	let div8;
	let span5;
	let t12;
	let div9;
	let textarea1;
	let div9_style_value;
	let t13;
	let div13;
	let div11;
	let span6;
	let t15;
	let div12;
	let textarea2;
	let div12_style_value;
	let t16;
	let div19;
	let div18;
	let div16;
	let span7;
	let t18;
	let div17;
	let div17_style_value;
	let div19_style_value;
	let div20_style_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div22 = element("div");
			div21 = element("div");
			div4 = element("div");
			div0 = element("div");
			span0 = element("span");
			span1 = element("span");
			span1.textContent = `${language.html_css_js}`;
			t1 = space();
			div3 = element("div");
			div1 = element("div");
			button0 = element("button");
			button0.textContent = `${language.run}`;
			t3 = space();
			div2 = element("div");
			button1 = element("button");
			span2 = element("span");
			t4 = space();
			ul = element("ul");
			li = element("li");
			label = element("label");
			input = element("input");
			t5 = space();
			span3 = element("span");
			t6 = text(t6_value);
			t7 = space();
			div20 = element("div");
			div15 = element("div");
			div14 = element("div");
			div7 = element("div");
			div5 = element("div");
			span4 = element("span");
			span4.textContent = `${language.html}`;
			t9 = space();
			div6 = element("div");
			textarea0 = element("textarea");
			t10 = space();
			div10 = element("div");
			div8 = element("div");
			span5 = element("span");
			span5.textContent = `${language.css}`;
			t12 = space();
			div9 = element("div");
			textarea1 = element("textarea");
			t13 = space();
			div13 = element("div");
			div11 = element("div");
			span6 = element("span");
			span6.textContent = `${language.js}`;
			t15 = space();
			div12 = element("div");
			textarea2 = element("textarea");
			t16 = space();
			div19 = element("div");
			div18 = element("div");
			div16 = element("div");
			span7 = element("span");
			span7.textContent = `${language.result}`;
			t18 = space();
			div17 = element("div");
			attr_dev(span0, "class", "icomoon-coding-44px s3 align-middle mr-1");
			add_location(span0, file, 1837, 40, 99679);
			attr_dev(span1, "class", "align-middle");
			add_location(span1, file, 1837, 102, 99741);
			attr_dev(div0, "class", "mt-2 pt-1 pl-2 float-left");
			add_location(div0, file, 1836, 36, 99598);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-primary runcode_btn ml mt-1");
			add_location(button0, file, 1841, 44, 100017);
			attr_dev(div1, "class", "inline-block pull-right");
			add_location(div1, file, 1840, 40, 99934);
			attr_dev(span2, "class", "icomoon-menu-2 s3 text-secondary pt-s d-block");
			attr_dev(span2, "id", "dropdownMenuButton1");
			add_location(span2, file, 1844, 124, 100360);
			attr_dev(button1, "class", "btn border-0 px-0 ml-2 mr-2");
			attr_dev(button1, "type", "button");
			attr_dev(button1, "data-bs-toggle", "dropdown");
			add_location(button1, file, 1844, 40, 100276);
			attr_dev(input, "type", "checkbox");
			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
			attr_dev(input, "id", "goDark");
			attr_dev(input, "class", "transparent h");
			add_location(input, file, 1848, 52, 100821);
			add_location(span3, file, 1849, 52, 100980);
			attr_dev(label, "for", "goDark");
			attr_dev(label, "class", "dropdown-item mb-0 pointer");
			add_location(label, file, 1847, 48, 100712);
			add_location(li, file, 1846, 44, 100658);
			attr_dev(ul, "class", "dropdown-menu dropdown-menu-right");
			attr_dev(ul, "x-placement", "bottom-end");
			attr_dev(ul, "aria-labelledby", "dropdownMenuButton1");
			add_location(ul, file, 1845, 40, 100503);
			attr_dev(div2, "class", "float-right mt-2");
			add_location(div2, file, 1843, 36, 100204);
			attr_dev(div3, "class", "d-flex");
			add_location(div3, file, 1839, 36, 99872);
			attr_dev(div4, "id", "web_toolbar");
			attr_dev(div4, "class", "bg-light w-100 height44 web_toolbar text-dark d-flex justify-content-between");
			add_location(div4, file, 1835, 32, 99453);
			add_location(span4, file, 1861, 52, 101812);
			attr_dev(div5, "class", "card-header rounded-0");
			add_location(div5, file, 1860, 48, 101723);
			attr_dev(textarea0, "name", "html");
			attr_dev(textarea0, "id", "html_editor");
			add_location(textarea0, file, 1864, 52, 102080);
			attr_dev(div6, "id", "html");
			attr_dev(div6, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div6, "style", div6_style_value = "height: 347px ");
			add_location(div6, file, 1863, 48, 101939);
			attr_dev(div7, "id", "html_panel");
			attr_dev(div7, "class", "card m-0 p-0 rounded-0");
			add_location(div7, file, 1859, 44, 101621);
			add_location(span5, file, 1869, 52, 102474);
			attr_dev(div8, "class", "card-header rounded-0");
			add_location(div8, file, 1868, 48, 102385);
			attr_dev(textarea1, "name", "css");
			attr_dev(textarea1, "id", "css_editor");
			add_location(textarea1, file, 1872, 52, 102740);
			attr_dev(div9, "id", "css");
			attr_dev(div9, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div9, "style", div9_style_value = "height: 347px");
			add_location(div9, file, 1871, 48, 102600);
			attr_dev(div10, "id", "css_panel");
			attr_dev(div10, "class", "card m-0 p-0 rounded-0");
			add_location(div10, file, 1867, 44, 102284);
			add_location(span6, file, 1878, 56, 103220);
			attr_dev(div11, "class", "card-header rounded-0");
			add_location(div11, file, 1877, 52, 103127);
			attr_dev(textarea2, "name", "js");
			attr_dev(textarea2, "id", "js_editor");
			add_location(textarea2, file, 1881, 56, 103496);
			attr_dev(div12, "id", "js");
			attr_dev(div12, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div12, "style", div12_style_value = "height: 347px ");
			add_location(div12, file, 1880, 52, 103353);
			attr_dev(div13, "id", "js_panel");
			attr_dev(div13, "class", "card m-0 p-0 rounded-0");
			add_location(div13, file, 1876, 48, 103023);
			attr_dev(div14, "id", "firstEditorDiv");
			set_style(div14, "display", "flex");
			add_location(div14, file, 1858, 40, 101528);
			attr_dev(div15, "id", "top_content");
			add_location(div15, file, 1857, 36, 101464);
			add_location(span7, file, 1900, 48, 104879);
			attr_dev(div16, "class", "card-header rounded-0");
			add_location(div16, file, 1899, 44, 104794);
			attr_dev(div17, "id", "result_div");
			attr_dev(div17, "style", div17_style_value = "height: 347px");
			attr_dev(div17, "class", "card-body content-div m-0 p-0 rounded-0");
			add_location(div17, file, 1902, 44, 105000);
			attr_dev(div18, "class", "card rounded-0 nm");
			add_location(div18, file, 1898, 40, 104717);
			attr_dev(div19, "id", "bottom_content");
			attr_dev(div19, "style", div19_style_value = "overflow: hidden");
			add_location(div19, file, 1897, 36, 104623);
			attr_dev(div20, "id", "accordion");
			attr_dev(div20, "style", div20_style_value = "width:100%; background:white; padding:0px;");
			add_location(div20, file, 1856, 32, 101353);
			attr_dev(div21, "class", "row");
			add_location(div21, file, 1834, 28, 99402);
			attr_dev(div22, "class", "container-fluid");
			add_location(div22, file, 1833, 24, 99343);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div22, anchor);
			append_dev(div22, div21);
			append_dev(div21, div4);
			append_dev(div4, div0);
			append_dev(div0, span0);
			append_dev(div0, span1);
			append_dev(div4, t1);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, button0);
			append_dev(div3, t3);
			append_dev(div3, div2);
			append_dev(div2, button1);
			append_dev(button1, span2);
			append_dev(div2, t4);
			append_dev(div2, ul);
			append_dev(ul, li);
			append_dev(li, label);
			append_dev(label, input);
			append_dev(label, t5);
			append_dev(label, span3);
			append_dev(span3, t6);
			append_dev(div21, t7);
			append_dev(div21, div20);
			append_dev(div20, div15);
			append_dev(div15, div14);
			append_dev(div14, div7);
			append_dev(div7, div5);
			append_dev(div5, span4);
			append_dev(div7, t9);
			append_dev(div7, div6);
			append_dev(div6, textarea0);
			append_dev(div14, t10);
			append_dev(div14, div10);
			append_dev(div10, div8);
			append_dev(div8, span5);
			append_dev(div10, t12);
			append_dev(div10, div9);
			append_dev(div9, textarea1);
			append_dev(div14, t13);
			append_dev(div14, div13);
			append_dev(div13, div11);
			append_dev(div11, span6);
			append_dev(div13, t15);
			append_dev(div13, div12);
			append_dev(div12, textarea2);
			append_dev(div20, t16);
			append_dev(div20, div19);
			append_dev(div19, div18);
			append_dev(div18, div16);
			append_dev(div16, span7);
			append_dev(div18, t18);
			append_dev(div18, div17);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*runCode*/ ctx[4], false, false, false),
					listen_dev(input, "click", /*changeTheme*/ ctx[3], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 1 && input_checked_value !== (input_checked_value = /*state*/ ctx[0].goDark)) {
				prop_dev(input, "checked", input_checked_value);
			}

			if (dirty[0] & /*state*/ 1 && t6_value !== (t6_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "")) set_data_dev(t6, t6_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div22);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(1833:20) {:else}",
		ctx
	});

	return block;
}

// (1763:16) {#if window.inNative }
function create_if_block(ctx) {
	let div19;
	let div18;
	let div3;
	let div0;
	let span0;
	let span1;
	let t1;
	let div1;
	let button0;
	let span2;
	let t2;
	let ul0;
	let li0;
	let label;
	let input;
	let input_checked_value;
	let t3;
	let span3;
	let t4_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "";
	let t4;
	let t5;
	let div2;
	let t6;
	let button1;
	let t8;
	let div17;
	let ul1;
	let li1;
	let a0;
	let t10;
	let li2;
	let a1;
	let t12;
	let li3;
	let a2;
	let t14;
	let div12;
	let div8;
	let div5;
	let div4;
	let textarea0;
	let div4_style_value;
	let t15;
	let div7;
	let div6;
	let textarea1;
	let div6_style_value;
	let t16;
	let div11;
	let div10;
	let div9;
	let textarea2;
	let div9_style_value;
	let t17;
	let div16;
	let div15;
	let div13;
	let span4;
	let t19;
	let div14;
	let div14_style_value;
	let div17_style_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div19 = element("div");
			div18 = element("div");
			div3 = element("div");
			div0 = element("div");
			span0 = element("span");
			span1 = element("span");
			span1.textContent = `${language.html_css_js}`;
			t1 = space();
			div1 = element("div");
			button0 = element("button");
			span2 = element("span");
			t2 = space();
			ul0 = element("ul");
			li0 = element("li");
			label = element("label");
			input = element("input");
			t3 = space();
			span3 = element("span");
			t4 = text(t4_value);
			t5 = space();
			div2 = element("div");
			t6 = text("x`\r\n                                    ");
			button1 = element("button");
			button1.textContent = `${language.run}`;
			t8 = space();
			div17 = element("div");
			ul1 = element("ul");
			li1 = element("li");
			a0 = element("a");
			a0.textContent = `${language.html}`;
			t10 = space();
			li2 = element("li");
			a1 = element("a");
			a1.textContent = `${language.css}`;
			t12 = space();
			li3 = element("li");
			a2 = element("a");
			a2.textContent = `${language.js}`;
			t14 = space();
			div12 = element("div");
			div8 = element("div");
			div5 = element("div");
			div4 = element("div");
			textarea0 = element("textarea");
			t15 = space();
			div7 = element("div");
			div6 = element("div");
			textarea1 = element("textarea");
			t16 = space();
			div11 = element("div");
			div10 = element("div");
			div9 = element("div");
			textarea2 = element("textarea");
			t17 = space();
			div16 = element("div");
			div15 = element("div");
			div13 = element("div");
			span4 = element("span");
			span4.textContent = `${language.result}`;
			t19 = space();
			div14 = element("div");
			attr_dev(span0, "class", "icomoon-coding-44px s3 align-middle mr-1");
			add_location(span0, file, 1768, 36, 94422);
			attr_dev(span1, "class", "align-middle");
			add_location(span1, file, 1768, 98, 94484);
			attr_dev(div0, "class", "mt-2 pt pl-3 float-left");
			add_location(div0, file, 1767, 32, 94347);
			attr_dev(span2, "class", "icomoon-menu-2 s3 text-secondary pt-s d-block");
			add_location(span2, file, 1771, 142, 94786);
			attr_dev(button0, "class", "btn border-0 px-0 ml-2 mr-2");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "data-toggle", "dropdown");
			attr_dev(button0, "id", "dropdownMenuButton1");
			add_location(button0, file, 1771, 36, 94680);
			attr_dev(input, "type", "checkbox");
			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
			attr_dev(input, "id", "goDark");
			attr_dev(input, "class", "position-absolute bg-transparent");
			add_location(input, file, 1775, 48, 95206);
			add_location(span3, file, 1776, 48, 95380);
			attr_dev(label, "for", "goDark");
			attr_dev(label, "class", "dropdown-item mb-0 pointer");
			add_location(label, file, 1774, 44, 95101);
			add_location(li0, file, 1773, 40, 95051);
			attr_dev(ul0, "class", "dropdown-menu dropdown-menu-right");
			attr_dev(ul0, "x-placement", "bottom-end");
			attr_dev(ul0, "aria-labelledby", "dropdownMenuButton1");
			add_location(ul0, file, 1772, 36, 94900);
			attr_dev(div1, "class", "float-right mt-2 mr-2");
			add_location(div1, file, 1770, 32, 94607);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-primary runcode_btn ml");
			add_location(button1, file, 1782, 36, 95734);
			attr_dev(div2, "class", "inline-block pull-right");
			add_location(div2, file, 1781, 32, 95657);
			attr_dev(div3, "id", "web_toolbar");
			attr_dev(div3, "class", "bg-gray height44 web_toolbar text-dark");
			add_location(div3, file, 1766, 28, 94244);
			attr_dev(a0, "class", "nav-link active text-white");
			attr_dev(a0, "href", "#html_panel");
			attr_dev(a0, "role", "tab");
			attr_dev(a0, "data-toggle", "tab");
			add_location(a0, file, 1788, 40, 96205);
			attr_dev(li1, "class", "nav-item");
			attr_dev(li1, "id", "html_pane");
			add_location(li1, file, 1787, 36, 96127);
			attr_dev(a1, "class", "nav-link text-white");
			attr_dev(a1, "href", "#css_panel");
			attr_dev(a1, "role", "tab");
			attr_dev(a1, "data-toggle", "tab");
			add_location(a1, file, 1791, 40, 96461);
			attr_dev(li2, "class", "nav-item");
			attr_dev(li2, "id", "css_pane");
			add_location(li2, file, 1790, 36, 96384);
			attr_dev(a2, "class", "nav-link text-white");
			attr_dev(a2, "href", "#js_panel");
			attr_dev(a2, "role", "tab");
			attr_dev(a2, "data-toggle", "tab");
			add_location(a2, file, 1794, 40, 96707);
			attr_dev(li3, "class", "nav-item");
			attr_dev(li3, "id", "js_pane");
			add_location(li3, file, 1793, 36, 96631);
			attr_dev(ul1, "class", "nav nav-pills nav-fill");
			attr_dev(ul1, "role", "tablist");
			add_location(ul1, file, 1786, 32, 96039);
			attr_dev(textarea0, "name", "html");
			attr_dev(textarea0, "id", "html_editor");
			add_location(textarea0, file, 1801, 48, 97329);
			attr_dev(div4, "id", "html");
			attr_dev(div4, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div4, "style", div4_style_value = "height: 347px");
			add_location(div4, file, 1800, 44, 97193);
			attr_dev(div5, "id", "html_panel");
			attr_dev(div5, "class", "m-0 p-0 rounded-0 tab-pane fade show active");
			attr_dev(div5, "role", "tabpanel");
			add_location(div5, file, 1799, 40, 97057);
			attr_dev(textarea1, "name", "css");
			attr_dev(textarea1, "class", "css_text");
			attr_dev(textarea1, "id", "css_editor");
			add_location(textarea1, file, 1806, 48, 97784);
			attr_dev(div6, "id", "css");
			attr_dev(div6, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div6, "style", div6_style_value = "height: 347px");
			add_location(div6, file, 1805, 44, 97648);
			attr_dev(div7, "id", "css_panel");
			attr_dev(div7, "class", "m-0 p-0 rounded-0 tab-pane fade show");
			attr_dev(div7, "role", "tabpanel");
			add_location(div7, file, 1804, 40, 97521);
			attr_dev(div8, "id", "firstEditorDiv");
			add_location(div8, file, 1798, 36, 96990);
			attr_dev(textarea2, "name", "js");
			attr_dev(textarea2, "id", "js_editor");
			add_location(textarea2, file, 1813, 48, 98356);
			attr_dev(div9, "id", "js");
			attr_dev(div9, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div9, "style", div9_style_value = "height: 347px");
			add_location(div9, file, 1812, 44, 98221);
			attr_dev(div10, "id", "js_panel");
			attr_dev(div10, "class", "m-0 p-0 rounded-0 tab-pane fade show");
			attr_dev(div10, "role", "tabpanel");
			add_location(div10, file, 1811, 40, 98095);
			attr_dev(div11, "id", "jsEditorDiv");
			add_location(div11, file, 1810, 36, 98031);
			attr_dev(div12, "id", "top_content");
			attr_dev(div12, "class", "tab-content");
			add_location(div12, file, 1797, 32, 96910);
			add_location(span4, file, 1821, 44, 98837);
			attr_dev(div13, "class", "card-header rounded-0");
			add_location(div13, file, 1820, 40, 98756);
			attr_dev(div14, "id", "result_div");
			attr_dev(div14, "style", div14_style_value = "min-height: 347px");
			attr_dev(div14, "class", "card-body content-div m-0 p-0 rounded-0");
			add_location(div14, file, 1823, 40, 98950);
			attr_dev(div15, "class", "card rounded-0 nm");
			add_location(div15, file, 1819, 36, 98683);
			attr_dev(div16, "id", "bottom_content");
			add_location(div16, file, 1818, 32, 98620);
			attr_dev(div17, "style", div17_style_value = "width: 100%;background: white;");
			attr_dev(div17, "class", "content_parent");
			add_location(div17, file, 1785, 28, 95936);
			attr_dev(div18, "class", "row");
			add_location(div18, file, 1765, 24, 94197);
			attr_dev(div19, "class", "container-fluid");
			attr_dev(div19, "id", "mainContainer");
			add_location(div19, file, 1764, 20, 94123);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div19, anchor);
			append_dev(div19, div18);
			append_dev(div18, div3);
			append_dev(div3, div0);
			append_dev(div0, span0);
			append_dev(div0, span1);
			append_dev(div3, t1);
			append_dev(div3, div1);
			append_dev(div1, button0);
			append_dev(button0, span2);
			append_dev(div1, t2);
			append_dev(div1, ul0);
			append_dev(ul0, li0);
			append_dev(li0, label);
			append_dev(label, input);
			append_dev(label, t3);
			append_dev(label, span3);
			append_dev(span3, t4);
			append_dev(div3, t5);
			append_dev(div3, div2);
			append_dev(div2, t6);
			append_dev(div2, button1);
			append_dev(div18, t8);
			append_dev(div18, div17);
			append_dev(div17, ul1);
			append_dev(ul1, li1);
			append_dev(li1, a0);
			append_dev(ul1, t10);
			append_dev(ul1, li2);
			append_dev(li2, a1);
			append_dev(ul1, t12);
			append_dev(ul1, li3);
			append_dev(li3, a2);
			append_dev(div17, t14);
			append_dev(div17, div12);
			append_dev(div12, div8);
			append_dev(div8, div5);
			append_dev(div5, div4);
			append_dev(div4, textarea0);
			append_dev(div8, t15);
			append_dev(div8, div7);
			append_dev(div7, div6);
			append_dev(div6, textarea1);
			append_dev(div12, t16);
			append_dev(div12, div11);
			append_dev(div11, div10);
			append_dev(div10, div9);
			append_dev(div9, textarea2);
			append_dev(div17, t17);
			append_dev(div17, div16);
			append_dev(div16, div15);
			append_dev(div15, div13);
			append_dev(div13, span4);
			append_dev(div15, t19);
			append_dev(div15, div14);

			if (!mounted) {
				dispose = [
					listen_dev(input, "click", /*changeTheme*/ ctx[3], false, false, false),
					listen_dev(button1, "click", /*runCode*/ ctx[4], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*state*/ 1 && input_checked_value !== (input_checked_value = /*state*/ ctx[0].goDark)) {
				prop_dev(input, "checked", input_checked_value);
			}

			if (dirty[0] & /*state*/ 1 && t4_value !== (t4_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "")) set_data_dev(t4, t4_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div19);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(1763:16) {#if window.inNative }",
		ctx
	});

	return block;
}

// (1939:4) <div slot="title" style="text-align: left;">
function create_title_slot(ctx) {
	let div0;
	let div1;

	const block = {
		c: function create() {
			div0 = element("div");
			div1 = element("div");
			div1.textContent = `${language.remediation}`;
			add_location(div1, file, 1939, 2, 106579);
			attr_dev(div0, "slot", "title");
			set_style(div0, "text-align", "left");
			add_location(div0, file, 1938, 4, 106531);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			append_dev(div0, div1);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_title_slot.name,
		type: "slot",
		source: "(1939:4) <div slot=\\\"title\\\" style=\\\"text-align: left;\\\">",
		ctx
	});

	return block;
}

// (1951:2) <Button key="cancel_btn" class="cancel_btn_pop" style={'float:right;margin:10px;background-color:gray;'} variant="contained" on:click={() => state.remediationToggle = false }>
function create_default_slot_1(ctx) {
	let t_value = language.cancel + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(1951:2) <Button key=\\\"cancel_btn\\\" class=\\\"cancel_btn_pop\\\" style={'float:right;margin:10px;background-color:gray;'} variant=\\\"contained\\\" on:click={() => state.remediationToggle = false }>",
		ctx
	});

	return block;
}

// (1950:1) <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
function create_footer_slot(ctx) {
	let div;
	let button;
	let current;

	button = new Button({
			props: {
				key: "cancel_btn",
				class: "cancel_btn_pop",
				style: "float:right;margin:10px;background-color:gray;",
				variant: "contained",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*click_handler_2*/ ctx[11]);

	const block = {
		c: function create() {
			div = element("div");
			create_component(button.$$.fragment);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "footer");
			set_style(div, "border-top", "1px solid var(--divider, rgba(0, 0, 0, 0.1))");
			add_location(div, file, 1949, 1, 106793);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(button, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty[1] & /*$$scope*/ 33554432) {
				button_changes.$$scope = { dirty, ctx };
			}

			button.$set(button_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(button.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(button.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_footer_slot.name,
		type: "slot",
		source: "(1950:1) <div slot=\\\"footer\\\" class=\\\"footer\\\" style=\\\"border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));\\\">",
		ctx
	});

	return block;
}

// (1933:12) <Dialog               bind:visible={state.remediationToggle}   width="650"      on:close={() => state.remediationToggle = false}  >
function create_default_slot(ctx) {
	let t0;
	let div1;
	let div0;
	let center;
	let loader;
	let t1;
	let h4;
	let t2_value = language.calculate_answer + "";
	let t2;
	let br;
	let t3;
	let t4_value = language.please_wait + "";
	let t4;
	let t5;
	let current;
	loader = new Loader({ props: { size: 70 }, $$inline: true });

	const block = {
		c: function create() {
			t0 = space();
			div1 = element("div");
			div0 = element("div");
			center = element("center");
			create_component(loader.$$.fragment);
			t1 = space();
			h4 = element("h4");
			t2 = text(t2_value);
			br = element("br");
			t3 = space();
			t4 = text(t4_value);
			t5 = space();
			add_location(br, file, 1945, 28, 106731);
			add_location(h4, file, 1945, 4, 106707);
			add_location(center, file, 1943, 3, 106667);
			attr_dev(div0, "id", "remediationModel");
			add_location(div0, file, 1942, 2, 106635);
			add_location(div1, file, 1941, 1, 106626);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, center);
			mount_component(loader, center, null);
			append_dev(center, t1);
			append_dev(center, h4);
			append_dev(h4, t2);
			append_dev(h4, br);
			append_dev(h4, t3);
			append_dev(h4, t4);
			insert_dev(target, t5, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(loader.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(loader.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div1);
			destroy_component(loader);
			if (detaching) detach_dev(t5);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(1933:12) <Dialog               bind:visible={state.remediationToggle}   width=\\\"650\\\"      on:close={() => state.remediationToggle = false}  >",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div2;
	let div1;
	let t0;
	let button0;
	let t2;
	let button1;
	let t4;
	let div0;
	let t5;
	let dialog;
	let updating_visible;
	let t6;
	let input;
	let current;
	let mounted;
	let dispose;
	let if_block0 = (window.isIE || window.isIEEleven) && create_if_block_1(ctx);

	function select_block_type(ctx, dirty) {
		if (window.inNative) return create_if_block;
		return create_else_block;
	}

	let current_block_type = select_block_type();
	let if_block1 = current_block_type(ctx);

	function dialog_visible_binding(value) {
		/*dialog_visible_binding*/ ctx[12].call(null, value);
	}

	let dialog_props = {
		width: "650",
		$$slots: {
			default: [create_default_slot],
			footer: [create_footer_slot],
			title: [create_title_slot]
		},
		$$scope: { ctx }
	};

	if (/*state*/ ctx[0].remediationToggle !== void 0) {
		dialog_props.visible = /*state*/ ctx[0].remediationToggle;
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, "visible", dialog_visible_binding));
	dialog.$on("close", /*close_handler*/ ctx[13]);

	const block = {
		c: function create() {
			div2 = element("div");
			div1 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			button0 = element("button");
			button0.textContent = "set review";
			t2 = space();
			button1 = element("button");
			button1.textContent = "unset review";
			t4 = space();
			div0 = element("div");
			if_block1.c();
			t5 = space();
			create_component(dialog.$$.fragment);
			t6 = space();
			input = element("input");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "h h-imp");
			attr_dev(button0, "id", "set-review");
			add_location(button0, file, 1758, 8, 93790);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "h h-imp");
			attr_dev(button1, "id", "unset-review");
			add_location(button1, file, 1759, 8, 93902);
			add_location(div0, file, 1760, 8, 94020);
			attr_dev(input, "type", "hidden");
			attr_dev(input, "id", "ansModeAnswer");
			input.value = "";
			add_location(input, file, 1955, 8, 107145);
			attr_dev(div1, "id", "authoringArea");
			attr_dev(div1, "class", "font14");
			add_location(div1, file, 1752, 4, 93513);
			add_location(div2, file, 1750, 4, 93500);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			if (if_block0) if_block0.m(div1, null);
			append_dev(div1, t0);
			append_dev(div1, button0);
			append_dev(div1, t2);
			append_dev(div1, button1);
			append_dev(div1, t4);
			append_dev(div1, div0);
			if_block1.m(div0, null);
			append_dev(div1, t5);
			mount_component(dialog, div1, null);
			append_dev(div1, t6);
			append_dev(div1, input);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", /*click_handler*/ ctx[9], false, false, false),
					listen_dev(button1, "click", /*click_handler_1*/ ctx[10], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if_block1.p(ctx, dirty);
			const dialog_changes = {};

			if (dirty[0] & /*state*/ 1 | dirty[1] & /*$$scope*/ 33554432) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty[0] & /*state*/ 1) {
				updating_visible = true;
				dialog_changes.visible = /*state*/ ctx[0].remediationToggle;
				add_flush_callback(() => updating_visible = false);
			}

			dialog.$set(dialog_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dialog.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dialog.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (if_block0) if_block0.d();
			if_block1.d();
			destroy_component(dialog);
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

function getChildXml(xml) {
}

// returns '0' or '1' according to the match status of the testcase in html editor
function checkNewTestCase(min, counter, outp) {
	// used for define the testcase result status 
	let result = 1;

	if (min) {
		// holds '0' if number of matched occurence is less than min value
		if (counter < outp) {
			result = 0;
		}
	} else {
		// holds '0' if number of matched occurence is greater than max value
		if (counter > outp) {
			result = 0;
		}
	}

	// holds '0' too if counter value is 0
	if (counter == 0) {
		result = 0;
	}

	// returns the result value
	return result;
}

// returns the text defined between opening and closing tag that is passed at the time of function call in string passed at first argument at the time of function call (basically in xml)
function stringBetween(data, str_1, str_2) {
	// contains RegExp pattern for match in string
	let regEx;

	if (str_2) {
		// creates the pattern if opening and closing both tag provided at the time of function calling
		regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
	} else {
		// creates the pattern if opening and closing both tag not provided at the time of function calling
		regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
	}

	// contains the text according to the match data in xml string
	let matchedStr = regEx.exec(data);

	if (matchedStr) {
		// returns the text between given opening and closing tag if it exist
		return matchedStr[1];
	} else {
		// returns the null if text not found between given opening and closing tag
		return null;
	}
}

// returns the value of attribute defined in second argument from tag defined in 3rd argument in xml string defined in argument 1
function findAttribute(XML, attr, tag = "") {
	// creates new RegExp object for match the value of attribute of any tag
	let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w.*?)\".*?>", "gm");

	// contains the matched text in 'XML' string if it matched otherwise null value holds
	let matchedStr = regEx.exec(XML);

	if (matchedStr) {
		// returns the value of attribute defined in argument variable 'attr' of tag defined in argument variable 'tag' of XML
		return matchedStr[1];
	} else {
		// returns null if no matched data found
		return null;
	}
}

// used for unrender the player tag
function unRenderPlayer() {
	// makes player tag empty that exist inside element have id: authoringDiv
	// jQuery('#authoringDiv player').empty(); // Replaced
	AI.empty("#authoringDiv player");

	// removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
	// jQuery('#authoringDiv').find('player').removeClass('hidecontent'); // Replaced
	AI.select("#authoringDiv").querySelector("player").classList.remove("hidecontent");

	/*jQuery('#editor img').each(function () {
        if (!jQuery(self).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
            // sets the value of 'src' attribute of img tag that exist inside element have id 'editor' and its src not contains the string '//s3.amazonaws.com/jigyaasa_content_static'
            jQuery(self).attr('src', jQuery(self).attr('src'));  // Replaced
        }
    });
*/
	document.querySelector("#editor img").forEach(function (_this, i) {
		if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
			_this.setAttribute("src", _this.getAttribute("src"));
		}
	});
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("WebPreview", slots, []);

	let themeUrl = window.baseThemeURL
	? window.baseThemeURL
	: window.baseUrlTheme;

	let { inQuizPlayer } = $$props;
	let { xml } = $$props;
	let { uxml } = $$props;
	let { isReview } = $$props;
	xml = uxml && !(/smans/gi).test(uxml) ? uxml : xml;
	let isPreview = "";

	// defines that editor is not initialized
	let rendered = 0;

	// contains the xml
	let mode = document.querySelector(".switch-input.switch-input");

	let htmlEditor;
	let cssEditor;
	let jsEditor;
	let showHTML = 1;
	let readHTML = 1;
	let showCSS = 1;
	let readCSS = 1;
	let showJS = 1;
	let readJS = 1;
	let splitter1 = "";
	let splitter2 = "";
	let splitter3 = "";
	let userAnswer = "";
	let isOldTestcase = false;
	let resultSaving;
	let state = {};

	let stateData = writable({
		xml: "",
		uxml: "",
		module: "",
		toggle: false,
		snackback: false,
		lang_type: "php",
		xmlArr: [],
		remediationToggle: false,
		qxml: "",
		titleData: "",
		stemData: "",
		remediationData: "",
		goDark: window.sessionStorage.goDark && window.sessionStorage.goDark == "true"
		? true
		: false
	});

	let unsubscribe = stateData.subscribe(items => {
		$$invalidate(0, state = items);
	});

	// called every time when any props or state gets changed
	beforeUpdate(() => {
		if (xml != state.xml) {
			$$invalidate(0, state.xml = xml, state);

			if (isReview) {
				let timer = setTimeout(
					(function () {
						// checks the answer and not allowed user to perform the task
						setReview();

						// clear the timeout 'timer'
						clearTimeout(timer);
					}).bind(this),
					1000
				);
			} else {
				let timer_next = setTimeout(
					(function () {
						// allowed user to perform the task in that editor which was not made readonly at the time of question creation
						unsetReview();

						// clear the timeout 'timer_next'
						clearTimeout(timer_next);
					}).bind(this),
					200
				);
			}
		}
	});

	function loadLibs() {
		let config = {
			preload: true,
			type: "text/javascript",
			as: "script"
		};

		AH.createLink(window.itemFolder + "src/libs/codemirror.js", config);
		AH.createLink(window.itemFolder + "src/libs/split.js", config);
	}

	onMount(() => {
		loadLibs();

		// used for mobile team
		if (window.inNative) {
			window.getHeight && window.getHeight();

			/*   jQuery('#html_pane').on('click', function () {
       jQuery(this).find('a').removeClass('active');
       jQuery('#css_panel,#js_panel').css('display', 'none');
       jQuery('#html_panel').css('display', 'block').find('a').addClass('active');
       let html_tags = htmlEditor.getValue();
       htmlEditor.setValue(html_tags);
   }); //Replaced*/
			document.querySelector("#html_pane").addEventListener("click", function (_this) {
				AI.select(_this).querySelector("a").classList.remove("active");

				//document.getElementById('css_panel').style.display = 'none';
				AH.select("#css_panel", "css", { display: "none" });

				//document.getElementById('js_panel').style.display = 'none';
				AH.select("#js_panel", "css", { display: "none" });

				//document.getElementById('html_panel').style.display = 'block';
				AH.select("#html_panel", "css", { display: "block" });

				let container = document.querySelect("#html_panel");
				container.querySelector("a").classList.add("active");
				let html_tags = htmlEditor.getValue();
				htmlEditor.setValue(html_tags);
			});

			/*jQuery('#css_pane').on('click', function () {
    jQuery(this).find('a').removeClass('active');
    jQuery('#html_panel,#js_panel').css('display', 'none');
    jQuery('#css_panel').css('display', 'block').find('a').addClass('active');
    let css_data = cssEditor.getValue();    
    cssEditor.setValue(css_data);
});*/ // Replaced
			document.querySelector("#html_pane").addEventListener("click", function (_this) {
				let contain = AI.select(_this);
				contain.querySelect("a").classList.remove("active");

				//document.getElementById('html_panel').style.display = 'none';
				AH.select("#html_panel", "css", { display: "none" });

				//document.getElementById('js_panel').style.display = 'none';
				AH.select("#js_panel", "css", { display: none });

				let container = document.getElementById("css_panel");
				container.style.display = "block";
				container.querySelector("a").classList.add("active");
				let css_data = cssEditor.getValue();
				cssEditor.setValue(css_data);
			});

			/*    jQuery('#js_pane').on('click', function () {
        jQuery(this).find('a').removeClass('active');
        jQuery('#css_panel,#html_panel').css('display', 'none');
        jQuery('#js_panel').css('display', 'block').find('a').addClass('active');
        let js_data = jsEditor.getValue();
        jsEditor.setValue(js_data);
    });  */
			document.querySelector("#js_pane").addEventListener("click", function (_this) {
				let js_Pane = AI.select(_this);
				js_Pane.querySelector("a").classList.remove("active");

				//document.getElementById('css_panel').style.display = 'none';
				AH.select("#css_panel", "css", { display: "none" });

				//document.getElementById('html_panel').style.display = 'none';
				AH.select("#html_panel", "css", { display: "none" });

				let js_panel_container = AH.select("#js_panel");
				js_panel_container.style.display = "block";
				js_panel_container.querySelect("a").classlist.add("active");
				let js_data = jsEditor.getValue();
				jsEditor.setValue(js_data);
			});

			// conditon can be removed as its defined above
			if (window.inNative) {
				setTimeout(
					function () {
						window.postMessage(`height___${document.getElementById("#mainContainer").offsetHeight}`, "*");
					},
					500
				);
			}
		}

		setTimeout(
			() => {
				renderCodeMirror();

				if (document.querySelector("#splitterWeb")) {
					// used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
					splitter();

					// returns from the function to prevent from re-appened the code if it was already defined
					return true;
				}

				if (!inQuizPlayer) {
					// used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
					splitter();
				} else {
					// sets the width and floating property of the js, html, css and result editor
					changeStyle();
				}
			},
			1000
		);

		/*jQuery(document).off('click', '#answerCheck').on('click', '#answerCheck', function () {
        // shows the output of the code written on the editors and sets the value of state 'remediationToggle' to true for identify that remediation mode is on
        remediationMode();
    });  // Replaced*/
		AI.listen(document, "click", "#answerCheck", function () {
			remediationMode();
		});

		/*jQuery("#set-review").on('click', function () {
        // checks the answer and not allowed user to perform the task
        setReview();
    });  //Replaced (Fixed with XML Part)
*/
		// jQuery("#unset-review").on('click', function () {
		//     // allowed user to perform the task in that editor which was not made readonly at the time of question creation
		//     unsetReview(); //Replaced (Fixed with XML Part)
		// });
		window.save_data = function () {
			if (typeof CodeMirror == "function") {
				// shows the output of the code in 'Result' editor
				//self.runCode();
				answerCheckWeb();
			}
		};
	}); // it is used only re-render purpose as its value first changes but callback function again reset it its initial value
	//state.goDark =!state.goDark;

	function setReview() {
		// checks the answer
		answerCheckWeb();

		htmlEditor && htmlEditor.setOption("readOnly", true);
		cssEditor && cssEditor.setOption("readOnly", true);
		jsEditor && jsEditor.setOption("readOnly", true);
	}

	function unsetReview() {
		if (typeof CodeMirror == "function") {
			htmlEditor && htmlEditor.setOption("readOnly", readHTML ? false : true);
			cssEditor && cssEditor.setOption("readOnly", readCSS ? false : true);
			jsEditor && jsEditor.setOption("readOnly", readJS ? false : true);
		}
	}

	function splitter() {
		// This code will running on mobile
		if (window.inNative) {
			return true;
		} else {
			// in case when js editor is visible and either html or css or both editor visible
			if (showJS && (showHTML || showCSS)) {
				// it is used to styled the splitter bar that exists on the left edge of the js editor
				// splitter1 = jQuery('#top_content').height(394).split({
				//     // Add a vertical splitter bar
				//     orientation: 'vertical',
				//     // Specify how many pixels where you can't move the splitter bar on the edge
				//     limit: 160,
				//     // Set the position of the splitter bar
				//     position: '68%'
				// });
				let splitter1 = split(["#top_content"], { sizes: [50], direction: "vertical" });
			}

			// in case when html and css both editor is visible
			if (showHTML && showCSS) {
				// it is used to styled the splitter bar that exists on the left edge of the css editor
				// splitter2 = jQuery('#firstEditorDiv').height(394).split({
				//     // Add a vertical splitter bar
				//     orientation: 'vertical',
				//     // Specify how many pixels where you can't move the splitter bar on the edge
				//     limit: 80,
				//     // Set the position of the splitter bar
				//     position: '50%'
				// });
				let splitter2 = split(["#firstEditorDiv"], { sizes: [100], direction: "vertical" }); //direction: "vertical",

				split(["#html_panel", "#css_panel", "#js_panel"], { sizes: [50, 50, 50] });
			}

			// in case when only one editor visible
			if (showHTML + showCSS + showJS == 1) {
				// it is used to styled the splitter bar that exists on the left edge of the result editor in case when only one html, js or css editor is visible
				// splitter3 = jQuery('#accordion').height(394).split({
				//     // Add a vertical splitter bar
				//     orientation: 'vertical',
				//     // Specify how many pixels where you can't move the splitter bar on the edge
				//     limit: 80,
				//     // Set the position of the splitter bar
				//     position: '60%'
				// });
				let Splitter3 = split(["#accordion"], { sizes: [100], direction: "vertical" }); //direction: "vertical",
			}
		}
	}

	// sets the width and floating property of the js, html, css and result editor
	function changeStyle() {
		// used for mobile team
		if (window.inNative) {
			return;
		}

		if (showJS && (showHTML || showCSS)) {
			// sets the width 50% of html/css editor if only one exist otherwise sets width 50% of parent element which contains both editor that have id 'firstEditorDiv' and float left
			// jQuery("#firstEditorDiv")[0].style.cssText = "float:left;width:50%"; // Replaced
			document.getElementById("firstEditorDiv").style.cssText = "float:left;width:50%";

			// sets the width 50% of js editor and float left
			//jQuery("#jsEditorDiv")[0].style.cssText = "float:left;width:50%"; // Replaced
			document.getElementById("jsEditorDiv").style.cssText = "float:left;width:50%";

			// it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
			//jQuery("#top_content")[0].style.cssText = "clear:both;overflow:auto"; // Replaced
			document.getElementById("top_content").style.cssText = "clear:both;overflow:auto";
		}

		if (showHTML && showCSS) {
			// it is parent element that contains html, css and js editor. Styles it not to allow any floating element on left or right and sets overflow property 'auto'
			//jQuery("#top_content")[0].style.cssText = "clear:both;overflow:auto"; // Replaced
			document.querySelector("#top_content").style.cssText = "clear:both;overflow:auto";

			// sets html editor's width 50% and float left
			// jQuery("#html_panel")[0].style.cssText = "float:left;width:50%"; // Replaced
			document.querySelector("#html_panel").style.cssText = "float:left;width:50%";

			// sets css editor's width 50% and float left
			// jQuery("#css_panel")[0].style.cssText = "float:left;width:50%"; // Replaced
			document.querySelector("#css_panel").style.cssText = "float:left;width:50%";
		}

		if (showHTML + showCSS + showJS == 1) {
			// sets css property  width 50% and float left of parent element that contains html, css and js editor 
			//jQuery("#top_content")[0].style.cssText = "float:left;width:60%";
			document.querySelector("#top_content").style.cssText = "float:left;width:60%";

			// sets css property  width 40% and float left of element that contains result editor 
			document.querySelector("#bottom_content").style.cssText = "float:left;width:40%";
		} //jQuery("#bottom_content")[0].style.cssText = "float:left;width:40%";
	}

	// changes theme of the html, js and css editors according to the checked status of 'Dark Mode' checkbox 
	function changeTheme() {
		console.log();

		// contains the checked status of the 'Dark Mode' checkbox
		let check = document.querySelector("#goDark").checked;

		// updates the value of state 'goDark' according to the value of variable 'check'
		$$invalidate(0, state.goDark = check, state);

		// stores the value of variable 'check' in 'goDark' variable of sessionStorage object
		window.sessionStorage.goDark = check;

		if (check) {
			htmlEditor.setOption("theme", "monokai");
			cssEditor.setOption("theme", "monokai");
			jsEditor.setOption("theme", "monokai");
		} else {
			htmlEditor.setOption("theme", "default");
			cssEditor.setOption("theme", "default");
			jsEditor.setOption("theme", "default");
		}
	}

	// updates the value of 'src' attribute of 'img', 'audio' and 'video' tag if any of these tags exist otherwise returns as it is
	function newSource() {
		let htmlData = htmlEditor.getValue();
		let video_and_audio_data = ["mp4", "ogg", "webm", "mp3", "wav"];
		let img_data = ["gif", "tif", "png", "jpg", "js"];

		htmlData = htmlData.replace(/src[ ]*=[ ]*['"](.*?)['"]/gm, function (fullMatch, src) {
			if (src) {
				for (let i = 0; i < video_and_audio_data.length; i++) {
					if (src.indexOf(video_and_audio_data[i]) > -1) {
						// returns the data after updating the src value of audio and video tag to access it globally
						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_stream/" + src);
					}
				}

				for (let i = 0; i < img_data.length; i++) {
					if (src.indexOf(img_data[i]) > -1) {
						// retuns the data after updating the src value of 'img' tag o globally access it
						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_static/" + src);
					}
				}
			}

			// returns the html data after updating the 'src' value of 'img', 'video' and 'audio' tag
			return fullMatch;
		});

		// returns the html data if 'img', 'video' and 'audio' tag not exist
		//console.log({'data':htmlData})
		return htmlData;
	}

	// returns the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag and hides the 'Loading...' containing after load
	function prepareSource() {
		try {
			// contains the html editor value after updating the src value of img, video and audio tag
			let htmlData = "<div id='loader' style='position: fixed;width: 100%;height: 100vh;z-index: 9999;background-color:#fff;'>Loading...</div>" + newSource();

			let cssData = cssEditor.getValue();
			let jsData = jsEditor.getValue();
			cssData = cssData.replace(/url\(['"](.*?)['"]\)/g, "url(\"https://s3.amazonaws.com/jigyaasa_content_static/$1\")");
			jsData = jsData.replace(/src.*?["'](.*?)["']/gi, "src = \"https://s3.amazonaws.com/jigyaasa_content_static/$1\"");

			jsData = `window.addEventListener("load", function(ev) {
                document.getElementById('loader').style.display = 'none';
            });${jsData}`;

			// contains the combined data of html, css and js editor
			let fullData = htmlData + "<style>" + cssData + "</style><script>" + jsData + "</script>";

			return fullData;
		} catch(e) {
			console.log({ e, func: "prepareSource@393" });
			return "";
		}
	}

	// initialize the html, css and js editor by converting textareas having id 'html_editor', 'css_editor', 'js_editor' in html, css and js editor
	function renderCodeMirror() {
		if (rendered) {
			// returns true to prevent from re-initialize the editors if it was already initialized
			return true;
		}

		// initialize the css editor
		cssEditor = CodeMirror.fromTextArea(document.getElementById("css_editor"), {
			lineNumbers: true,
			mode: "css",
			styleActiveLine: true,
			autoCloseBrackets: true,
			lineWrapping: true,
			scrollbarStyle: "simple",
			matchBrackets: true,
			gutters: ["CodeMirror-linenumbers", "breakpoints"]
		});

		// initialize the html editor
		htmlEditor = CodeMirror.fromTextArea(document.getElementById("html_editor"), {
			lineNumbers: true,
			mode: "text/html",
			styleActiveLine: true,
			autoCloseBrackets: true,
			lineWrapping: true,
			scrollbarStyle: "simple",
			matchBrackets: true,
			gutters: ["CodeMirror-linenumbers", "breakpoints"]
		});

		// initialize the js editor
		jsEditor = CodeMirror.fromTextArea(document.getElementById("js_editor"), {
			lineNumbers: true,
			mode: "text/javascript",
			styleActiveLine: true,
			autoCloseBrackets: true,
			lineWrapping: true,
			scrollbarStyle: "simple",
			matchBrackets: true,
			gutters: ["CodeMirror-linenumbers", "breakpoints"]
		});

		// used for set the value of html, css, js editors, makes editor readonly which was made disabled at the time of question creation, hide the editors which was made hidden at the time of questio creation and change the theme of html, css and js editors according to the check status of 'Dark Theme' checkbox
		parseXML();

		// used for mobile team
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}

		if (typeof htmlEditor == "object" && !window.isReviewMode) {
			htmlEditor.on("change", function () {
				// used for update the user answer xml value when value of html editor gets changed and review mode is off
				saveWebAnswer(htmlEditor.getValue(), "html");
			});
		}

		if (typeof cssEditor == "object" && !window.isReviewMode) {
			cssEditor.on("change", function () {
				// used for update the user answer xml value when value of css editor gets changed and review mode is off
				saveWebAnswer(cssEditor.getValue(), "css");
			});
		}

		if (typeof jsEditor == "object" && !window.isReviewMode) {
			jsEditor.on("change", function () {
				// used for update the user answer xml value when value of js editor gets changed and review mode is off
				saveWebAnswer(jsEditor.getValue(), "js");
			});
		}

		// not sure why it is used as this id does not exist here
		if (document.getElementById("aXml")) {
			let xmlEditor = CodeMirror.fromTextArea(document.getElementById("aXml"), {
				lineNumbers: false,
				mode: "application/xml",
				autoCloseBrackets: true,
				lineWrapping: true,
				matchBrackets: true
			});
		}

		htmlEditor.setOption("extraKeys", {
			// Changing Tabs into 4 spaces 
			Tab(cm) {
				let spaces = Array(cm.getOption("indentUnit") + 3).join(" ");
				cm.replaceSelection(spaces);
			},
			// used for toggle between fullScreen but it not worked for me
			F11(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			// used for remove the fullScreen mode but it not worked for me
			Esc(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		});

		// defines that editor is initialized
		rendered = 1;
	}

	// shows the output of the code written on the editors and sets the value of state 'remediationToggle' to true for identify that remediation mode is on
	function remediationMode() {
		// sets the value of state 'remediationToggle' to true that indicates that remediation mode is on
		$$invalidate(0, state.remediationToggle = true, state);

		// shows the output of the code in 'Result' editor
		runCode();
	}

	// used for show the result of testcases
	function answerCheckWeb(isRun = true) {
		let resNew = {};
		resNew.u = resultSaving;

		// contains rows of Remediation dialog box in each row 2 columns exist in first column testcase number defined and in second column their result status defined
		let case_result = [];

		// shows the output of the code in 'Result' editor according to the value of argument variable 'isRun'
		isRun ? runCode() : "";

		// contains the string defined in 'Testcases' field of 'Autograde' dialog box
		let get_test_cases = stringBetween(state.xml, "<autograde type=\"testcase\">", "</autograde>");

		// enters in this block if any testcase defined in 'Testcases' of 'Autograde' dialog box
		if (get_test_cases) {
			// contains the string if exist in variable 'get_test_cases' otherwise blank value contains
			get_test_cases = get_test_cases ? get_test_cases.trim() : "";

			// replaces string starts from '</case>' and ends at '<case>' with ';' and replaces single '</case>' or '<case>' with blank 
			get_test_cases = get_test_cases.replace(/<\/case>[\s\S]*?<case>/gm, ";").replace(/<\/case>|<case>/g, "");

			// contains array of defined testcses which exist in 'Testcases' field of 'Autograde' dialog box
			get_test_cases = get_test_cases.split(";");

			// loops through the each testcase
			for (let i in get_test_cases) {
				// enters in this block if testcase is defined in 'Testcases' field of 'Autograde' dialog box
				if (testcaseCheck(get_test_cases[i])) {
					// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Test Case' and result status as Passed if value returned by method testcaseCheck is true
					case_result.push("<tr>" + "<td>Test Case" + (parseInt(i) + 1) + "</td>" + "<td>Passed</td>" + "</tr>");
				} else {
					// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Test Case' and result status as Failed if value returned by method testcaseCheck is false
					case_result.push("<tr>" + "<td>Test Case" + (parseInt(i) + 1) + "</td>" + "<td>Failed</td>" + "</tr>");
				}
			}
		}

		// contains the testcases defined in 'Internal Script' field of 'Autograde' dialog box
		let get_internal_cases = stringBetween(state.xml, "<autograde type=\"internal\">", "</autograde>");

		// enters in this block if any testcase defined in 'Internal Script' of 'Autograde' dialog box
		if (get_internal_cases) {
			// contains string if exist in 'Internal Script' otherwise contains blank value
			get_internal_cases = get_internal_cases ? get_internal_cases.trim() : "";

			// replaces string starts from '</case>' and ends at '<case>' with ';' and replaces single '</case>' or '<case>' with blank 
			get_internal_cases = get_internal_cases.replace(/<\/case>[\s\S]*?<case>/gm, ";").replace(/<\/case>|<case>/g, "");

			// contains array of defined testcses which exist in 'Internal Script' field of 'Autograde' dialog box
			get_internal_cases = get_internal_cases.split(";");

			for (let i in get_internal_cases) {
				// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Passed if value returned by method internalCheck is true
				if (internalCheck(get_internal_cases[i])) {
					case_result.push("<tr>" + "<td>Internal Case" + (parseInt(i) + 1) + "</td>" + "<td>Passed</td>" + "</tr>");
				} else {
					case_result.push("<tr>" + "<td>Internal Case" + (parseInt(i) + 1) + "</td>" + "<td>Failed</td>" + "</tr>");
				}
			}
		}

		// contains the testcases defined in 'External Script' field of 'Autograde' dialog box
		let get_external_cases = stringBetween(state.xml, "<autograde type=\"custom\">", "</autograde>");

		// enters in this block if any testcase defined in 'External Script' of 'Autograde' dialog box
		if (get_external_cases) {
			// contains the value of 'Extenal Script' field 
			let get_case = get_external_cases.replace(/<case>|<\/case>/gm, "");

			// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Failed  if value returned by method externalCheck is true
			if (externalCheck(get_case)) {
				case_result.push("<tr>" + "<td>External Case</td>" + "<td>Passed</td>" + "</tr>");
			} else {
				// pushes the row in case_result array with testcase number equals to the value of variable 'i' + 1 with prifix 'Internal Case' and result status as Failed  if value returned by method externalCheck is false
				case_result.push("<tr>" + "<td>External Case</td>" + "<td>Failed</td>" + "</tr>");
			}
		}

		// joins the array 'case_result' in string 
		let case_str = case_result.join("");

		// used for show the answer correct of incorrect in mobile
		let inNativeIsCorrect = null;

		if ((/Failed/gi).test(case_str)) {
			// uncheck the element have id 'answer' if 'Failed' string exist in result string
			//jQuery("#answer").prop("checked", false);
			resNew.a = false;

			AI.select("#answer").checked = false;

			// sets the value 'false' of variable 'inNativeIsCorrect' to show incorrect answer in mobile
			inNativeIsCorrect = false;
		} else {
			//jQuery("#answer").prop("checked", true);
			resNew.a = true;

			AI.select("#answer").checked = true;

			// sets the value 'true' of variable 'inNativeIsCorrect' to show correct answer in mobile
			inNativeIsCorrect = true;
		}

		// used for mobile team
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}

		// used for mobile team
		if (window.inNative) {
			// replaced #special_module_user_xml
			window.postMessage(JSON.stringify({
				userAnswers: document.getElementById("special_module_user_xml").value,
				inNativeIsCorrect
			}));
		}

		// defines the table containing the field 'Test Case' and 'Result' in table head and value stored in variable 'case_str' as body part of the table
		let reviewLayout = "<table style=\"width:500px;\" class=\"table\"><thead class=\"thead-inverse\"><tr style='background-color:#4285F4'><th style='background-color:#4285F4'>Test Case</th><th>Result</th></tr></thead>" + case_str + "</table>";

		// enters in this block if remediation mode is on
		if (state.remediationToggle) {
			// sets the table in element have id 'remediationModel' means in remediation dialog box
			//jQuery("#remediationModel").html(reviewLayout); // Replaced
			document.getElementById("remediationModel").innerHTML = reviewLayout;
		}

		onUserAnsChange({ uXml: resNew.u, ans: resNew.a });

		// returns the defined table
		return reviewLayout;
	}

	// returns true or false according to the matched value of testcase defined in 'Testcases' field of 'Autograde' dialog box
	function testcaseCheck(get_cases) {
		// contains the array after spliting by symbol '|'
		let caseArr = get_cases.split("|");

		// denotes that array argument passed
		let fInp = 0;

		// contains the name of the function defined in testcase
		let test_func = caseArr[0];

		// contains the arguments of the function defined in testcase
		let test_inp = caseArr[1];

		// contains return value of the function defined in testcase
		let test_oup = caseArr[2];

		// used for hold the error message
		let error = {};

		// used for contain the value of js editor
		let js_data = "";

		try {
			if (typeof caseArr[1] == "string" && caseArr[1].indexOf("{arr") < 0) {
				// contains an array after replacing '{pip}' with '|' and spliting with comma
				test_inp = caseArr[1].replace("{pip}", "|").split(",");
			} else if (caseArr[1].indexOf("{arr") > -1) {
				// contains an array after replacing '{arr' or '}' with blank value and spliting with comma
				test_inp = caseArr[1].replace(/\{arr|\}/g, "").split(",");

				// updates value '1' to denote that array argument passed
				fInp = 1;
			} else {
				// contains the arguments of the function defined in testcase
				test_inp = caseArr[1];
			}

			// contains the value of js editor after removing white space from start and end of the string
			js_data = jsEditor.getValue().trim();

			// removes all the text that exist in same line starting from 'document.write' string of js editor value 
			js_data = js_data.replace(/document\.write.*/gm, "");

			// if function name, argument of the function or value of function return is not declaired in testcase then without checking answer it returns from function by returning value 'false'
			if (!test_func || !test_inp || !test_oup) {
				// sets the error message
				error["validation"] = "Invalid Test Cases";

				// returns value false
				return false;
			}

			// if type of the function is undefined then also returns from function without checking the answer after setting error message
			if (typeof test_func == undefined) {
				error["func_check"] = "Function case is undefined";
				return false;
			}

			// pattern for contain the 
			let re = new RegExp("function " + test_func + ".*?\\)", "g");

			// array for hold the matched text return by the 'exec' method
			let params = [];

			// contains the text that matches in js editor value for pattern defined in variable 're'
			params = re.exec(js_data);

			// converts array 'params' into string
			params = params.join();
		} catch(err) {
			// holdes error mesaage in case of any error occurred
			error["function_exist"] = "Given Function doesn't exist";
		}

		// used for contains the js editor value and function call string with arguments
		let eval_str = "";

		try {
			if (typeof inp == "array" || typeof inp == "object" && !fInp) {
				// contains js editor value and calls function with argument defined in testcase after joining the argument in string and wrapping in parenthesis if it is object
				eval_str = js_data + "\n" + test_func + "(" + test_inp.join() + ");";
			} else if (fInp) {
				// contains js editor value and calls function with argument defined in testcase after wrapping the argument in square bracket then in parenthesis if value of variable 'fInp' holds 1
				eval_str = js_data + "\n" + test_func + "([" + test_inp + "]);";
			} else {
				// contains js editor value and calls function with argument defined in testcase after wrapping argument in parenthesis 
				eval_str = js_data + "\n" + test_func + "(" + test_inp + ");";
			}

			// evalute the string hold in variable 'eval_str' and contains its output
			let actual_outp = eval(eval_str);

			// returns true/false if evaluated value mathches with function return value defined in testcase
			if (actual_outp == test_oup) {
				return true;
			} else {
				return false;
			}
		} catch(err) {
			// sets the error message in case of error 
			error["output_error"] = err;

			// returns from function by returning value 'false'
			return false;
		}
	}

	// splite the testcase and returns the array according to the value of old or new testcase format for match html or css
	function splitCase(caseData, type) {
		if (type == "style") {
			if (caseData.includes("$")) {
				// indicates the it is new testcase format for css match
				isOldTestcase = false;

				// splite from symbol '$' and returns the array
				return caseData.split("$");
			} else {
				// indicates the it is old testcase format for css match
				isOldTestcase = true;

				// splite from symbol '{' and returns the array
				return caseData.split("{");
			}
		} else {
			if (caseData.includes("?")) {
				// indicates the it is new testcase format for html match
				isOldTestcase = false;

				// splite from symbol '?' and returns the array
				return caseData.split("?");
			} else {
				// indicates the it is old testcase format for html match
				isOldTestcase = true;

				// splite from symbol '|' and returns the array
				return caseData.split("|");
			}
		}
	}

	// returns '0' or '1' according to the match status of the testcase in html editor
	function checkOldAttrTestCase(pattern, outp, min, part) {
		// array containing all the matched string in html editor defined in matching pattern
		let matchHtml = htmlEditor.getValue().match(pattern);

		// used for define the testcase result status 
		let result = 0;

		if (matchHtml) {
			if (part) {
				// creates temporary array for hold the matched data
				let tempMatch = [];

				matchHtml.map(value => {
					if (value.replace(/\s/g, "").includes(part.replace(/\s/g, ""))) {
						tempMatch.push(value);
					} else {
						console.log(value, part);
					}
				});

				// updates the value of variable 'matchHtml'
				matchHtml = tempMatch;
			}

			if (min) {
				// holds '0' if number of matched occurence is less than min value otherwise holds 1
				result = matchHtml.length < outp ? 0 : 1;
			} else {
				// holds '0' if number of occurence is greater than max value otherwise holds 1
				result = matchHtml.length > outp ? 0 : 1;
			}
		}

		// returns the value of variable result
		return result;
	}

	// used for call the 'attr_match', 'style_match' or 'str_match' method with required arguments and returns the value according to the return value of these methods
	function internalCheck(get_cases) {
		// splite the testcase and returns the array according to the value of old or new testcase format for match html or css
		let caseArr = splitCase(get_cases);

		let str = "", i;

		if (caseArr[0].indexOf("style_match") > -1) {
			// returns true or false according to the return value of method 'style_match'
			return style_match(caseArr[1], caseArr[2], caseArr[3]);
		} else if (caseArr[0].indexOf("attr_match") > -1) {
			// enters in this block in case of string matched in defined tag and that tag contains character '?'
			if (caseArr.length > 4) {
				for (i = 2; i < caseArr.length - 1; i++) {
					if (i == 2) {
						// adds the string defined in array 'caseArr' at index '2' in string defined in variable 'str'
						str = str + caseArr[i];
					} else {
						// adds the character '?' and string defined in array 'caseArr' at index equals to the value of variable 'i' in string defined in variable 'str'
						str = str + "?" + caseArr[i];
					}
				}

				// returns true of false according to the return value of method 'attr_match'
				return attr_match(caseArr[1], str, caseArr[caseArr.length - 1]);
			} else {
				// returns true of false according to the return value of method 'attr_match'
				return attr_match(caseArr[1], caseArr[2], caseArr[3]);
			}
		} else {
			// enters in this block in case of string matched anywhere in whole html or js editor and that editor contains character '?'
			if (caseArr.length > 4) {
				for (i = 2; i < caseArr.length - 1; i++) {
					if (i == 2) {
						// adds the string defined in array 'caseArr' at index '2' in string defined in variable 'str'
						str = str + caseArr[i];
					} else {
						// adds the character '?' and string defined in array 'caseArr' at index equals to the value of variable 'i' in string defined in variable 'str'
						str = str + "?" + caseArr[i];
					}
				}

				// returns true of false according to the return value of method 'str_match'
				return str_match(caseArr[1], str, caseArr[caseArr.length - 1]);
			} else {
				// returns true of false according to the return value of method 'str_match'
				return str_match(caseArr[1], caseArr[2], caseArr[3]);
			}
		}
	}

	// returns true or false according to the match property value of defined css selector
	function style_match(src, selector, inp) {

		// denotes the status of the testcase according to the matched value
		let flag_check = 1;

		// Window object that allows to access the iframe's document and its internal DOM
		let frameDoc = document.getElementsByClassName("result_frame")[0].contentWindow.document;

		// enters in this block if pseudo selector used
		if (selector.indexOf("::") > -1) {
			// array of pseudo selector
			let pseudo_elm = selector.split("::");

			// string containing pseudo class with prefix ':'
			let str = ":" + pseudo_elm[1];

			// selects element on which pseudo selection applied
			let pseudo_elm_selector = pseudo_elm[0];
		}

		let indx, new_class, new_selector, new_tag_name;

		// enters in this block if hover, active or visited pseudo class applied
		if (selector.indexOf(":hover") > -1 || selector.indexOf(":visited") > -1 || selector.indexOf(":active") > -1) {
			// contains the last index of colon in pseudo selector
			indx = selector.lastIndexOf(":");

			// selects the element on which pseudo classes applied
			new_selector = selector.substring(0, indx);

			// contains the value of pseudo class
			let class_name = selector.substring(indx + 1, selector.length);

			// contains the value of pseudo class with prefix '.'
			new_class = "." + class_name;

			if (frameDoc.querySelector(new_selector)) {
				// contains the name of the tag on which pseudo selection applied
				new_tag_name = frameDoc.querySelector(new_selector).nodeName.toLowerCase();

				// creates the element defined in variable 'new_tag_name'
				let create_elm = document.createElement(new_tag_name);

				// sets the class attribute with value of pseudo class
				create_elm.setAttribute("class", class_name);

				// append the created element in body tag that exist in iframe of result field
				frameDoc.querySelector("body").appendChild(create_elm);
			} else {
				// if element not found on which pseudo selection applied then returns false
				return false;
			}

			// pattern for matching the value of starts with defined pseudo selector and any number of space between pseudo selector and opening curly brace and any value containing in curly brace including braces
			let patt = new RegExp(selector + "[ ]*{([\\s\\S]*?)}", "");

			// contains the text matched in style tag defined in variable 'patt' after removing new line character
			let is_matched = frameDoc.querySelector("style").innerHTML.replace(/\\n/, "").match(patt);

			// enters in this block if matching found
			if (is_matched) {
				// containing the value defined with pseudo selector in curly brace excluding braces
				let prop_and_val = frameDoc.querySelector("style").innerHTML.replace(/\\n/, "").match(patt)[0].replace(patt, function (fullmatch, propsNval) {
					// returns value exist inside curly brace
					return propsNval;
				});

				// creates textNode containing value of variable 'new_class' and value of variable 'prop_and_val' after wraping it in curly brace
				let txt = document.createTextNode(new_class + "{" + prop_and_val + "}");

				// append this text to style tag
				frameDoc.querySelector("style").appendChild(txt);
			} else {
				// return false if defined pattern not matched in style tag
				return false;
			}
		}

		// used for select the element
		let data;

		if (new_class && frameDoc.querySelector("style").innerHTML.replace(/\\n/, "").match(new_class)) {
			// selects element have class attribute that is equals to the value of variable 'new_class'
			data = frameDoc.querySelector(new_class);
		} else {
			// selects element with css selector defined in variable 'selector'
			data = frameDoc.querySelector(selector);
		}

		// splite the testcase and returns the array according to the value of old or new testcase format for match css
		let input = splitCase(inp, "style");

		// contains the value of css property that exist in array 'input' at index '0'
		let outp = input[1];

		// for contain the value of css property of defined css selector
		let checkStyle;

		// enters in this block if pseudo class defined
		{
			// enters in this block if selector element defined
			if (data) {
				// contains the value of css property defined in array 'input' at index '0' of element that is stored in variable 'data'
				checkStyle = window.getComputedStyle(data).getPropertyValue(input[0]);
			}
		}

		// enters in this block if pseudo class exist
		if (selector.indexOf(":hover") > -1 || selector.indexOf(":visited") > -1 || selector.indexOf(":active") > -1) {
			// selects the element that have class which is previously defined using pesudo class
			let delete_elm = frameDoc.getElementsByClassName(class_name)[0];

			// removes the element have class which is equals to the value of variable 'delete_elm'
			delete_elm.parentNode.removeChild(delete_elm);

			// removes the textNode from style tag that was previously added
			frameDoc.querySelector("style").innerHTML = frameDoc.querySelector("style").innerHTML.replace(/\\n/gm, "").replace(txt.textContent, "");
		}

		// sets the value '0' of variable 'flag_check' if defined value of testcase css property is not equals to the matched value of css property for defined css selector
		if (checkStyle != outp) {
			flag_check = 0;
		}

		// returns true of false according to the value of variable 'flag_check'
		if (flag_check) {
			return true;
		} else {
			return false;
		}
	}

	// used for return the result status of the testcases defined for match in html editor  
	function attr_match(src, inp, outp) {
		let flag_check = 1,
			// denotes that tag matching is required
			singular = 0,
			// denotes that string matching is required in defined tag 
			justString = 0,
			// denotes that attribute matching is required of defined tag 
			hasTagsAttribute = 0,
			// denotes that attribute and their value matching is required of defined tag 
			hasTagsAttributeValue = 0,
			// denotes that 'max' flag is not enabled
			max = false,
			// denotes that 'min' flag is not enabled
			min = false; // by default sets the value 1 that indicates that matching is ok

		let i;

		try {
			if (inp.indexOf("{1}") > -1) {
				// denotes that testcase is defined for match tag in html editor
				singular = 1;

				// removes the flag '{1}' from testcase string
				inp = inp.replace("{1}", "");
			}

			if (inp.indexOf("{2}") > -1) {
				// denotes that testcase is defined for match string in defined tag in html editor
				justString = 1;

				// removes the flag '{2}' from testcase string
				inp = inp.replace("{2}", "");
			}

			if (inp.indexOf("{3}") > -1) {
				// denotes that testcase is defined for match only attribute not their value of defined tag in html editor
				hasTagsAttribute = 1;

				// removes the flag '{3}' from testcase string
				inp = inp.replace("{3}", "");
			}

			if (inp.indexOf("{4}") > -1) {
				//if check value of attribute only
				// denotes that testcase is defined for match attribute and their value of defined tag in html editor
				hasTagsAttributeValue = 1;

				// removes the flag '{4}' from testcase string
				inp = inp.replace("{4}", "");
			}

			if (outp.indexOf("min") > -1) {
				// denotes that 'min' flag is enabled
				min = true;

				// removes the 'min' text from defined flag and contains the numeric value only
				outp = parseInt(outp.replace("min", ""));
			} else if (outp.indexOf("max") > -1) {
				// denotes that 'max' flag is enabled
				max = true;

				// removes the 'max' text from defined flag and contains the numeric value only
				outp = parseInt(outp.replace("max", ""));
			}

			if (src == "HTML") {
				// Window object that allows to access the iframe's document and its internal DOM
				let frameDoc = document.getElementsByClassName("result_frame")[0].contentWindow.document;

				// in case of tag match enters in this block
				if (singular) {
					// contains number of matching tag exist
					let lengthCheck = frameDoc.getElementsByTagName(inp).length;

					// enters in this block in case of min flag is enabled
					if (min) {
						// sets the value of variable flag_check '0' in case of defined min value is greater than number of matching tag
						if (lengthCheck < outp) {
							flag_check = 0;
						}
					} else {
						// sets the value of variable flag_check '0' in case of defined max value is less than number of matching tag
						if (lengthCheck > outp) {
							flag_check = 0;
						}
					}
				} else {
					let tag_name, allCheck, counter = 0, str_data = "", match_str = "";

					// enters in this block in case of testcase defined for match string in perticular tag
					if (justString) {
						// contains an array after spliting testcase value with '{'
						tag_name = inp.split("{");

						if (tag_name.length > 2) {
							for (i = 1; i < tag_name.length; i++) {
								if (i == 1) {
									// adds the string defined in array tag_name at index '1' in string 'str_data'
									str_data = str_data + tag_name[i];
								} else {
									// adds the string '{' and string defined in array tag_name at index equals to the value of variable 'i' in string 'str_data'
									str_data = str_data + "{" + tag_name[i];
								}
							}

							// adds the string 'str_data' in string 'match_str'
							match_str = match_str + str_data;
						} else {
							// adds the string defined in array tag_name at index '1' in string 'match_str'
							match_str = match_str + tag_name[1];
						}

						// enters in this block if testcase is defined in old format
						if (isOldTestcase) {
							// creates pattern to match the string inside any tag
							let checkHtml = new RegExp(`<.*?>(${tag_name[0]})<\/.*?>`, "gi");

							// contains '0' or '1' according to the match status of the testcase in html editor
							flag_check = checkOldAttrTestCase(checkHtml, outp, min);
						} else {
							// selects all tag in which string existing have to check
							allCheck = frameDoc.querySelectorAll(tag_name[0]);

							// loops through the available tags in which string existing have to check
							for (i = 0; i < allCheck.length; i++) {
								if (allCheck[i].innerHTML.toLowerCase().replace(/\s+/gm, "").trim().indexOf(match_str.toLowerCase().replace(/\s+/gm, "").trim()) > -1) {
									// increases the value of variable counter by 1 if string exist in defined tag
									counter++;
								}
							}

							// contains '0' or '1' according to the match status of the testcase in html editor
							flag_check = checkNewTestCase(min, counter, outp);
						}
					} else if (hasTagsAttribute) {
						// contains the array of testcase
						tag_name = inp.split("{");

						if (isOldTestcase) {
							// pattern for match the desize attribute containing any value
							let attrReg = new RegExp(`${tag_name[0]}(\\s*=\\s*)["']?((?:.(?!["']?\\s+(?:\\S+)=|[>"']))+.)["']?`, "gi");

							// contains '0' or '1' according to the match status of the testcase in html editor
							flag_check = checkOldAttrTestCase(attrReg, outp, min);

							if (!flag_check) {
								// pattern for match the whole value starts from character '<' and ends at '>'
								let nextTry = new RegExp(`<(\\w+)(.*?)>`, "gi");

								// array containing matched string in html editor
								let matchText = htmlEditor.getValue().match(nextTry);

								// sets true of false according to the value of array matchText at index 0 and it contains the name of the attribute defined in array tag_name at index 0
								flag_check = matchText[0] && matchText[0].includes(tag_name[0])
								? true
								: false;
							}
						} else {
							// selects all tags in iframe that is defined in testcase 
							allCheck = frameDoc.querySelectorAll(tag_name[0]);

							for (i = 0; i < allCheck.length; i++) {
								if (allCheck[i].hasAttribute(tag_name[1])) {
									// increases the value of counter if attribute matched in any tag defined in testcase
									counter++;
								}
							}

							// contains '0' or '1' according to the match status of the testcase in html editor
							flag_check = checkNewTestCase(min, counter, outp);
						}
					} else if (hasTagsAttributeValue) {
						// contains the array of testcase
						tag_name = inp.split("{");

						if (isOldTestcase) {
							// array contains attribute at index '0' and its value at index '1'
							tag_name = inp.split("$");

							// pattern for match the desize attribute containing any value
							let attrValueReg = new RegExp(`${tag_name[0]}(\\s*=\\s*)["']?((?:.(?!["']?\\s+(?:\\S+)=|[>"']))+.)["']?`, "gi");

							// contains '0' or '1' according to the match status of the testcase in html editor
							flag_check = checkOldAttrTestCase(attrValueReg, outp, min, tag_name[1]);
						} else {
							// selects all tags in iframe that is defined in testcase 
							allCheck = frameDoc.querySelectorAll(tag_name[0]);

							for (i = 0; i < allCheck.length; i++) {
								// contains the value of defined attribute 
								let a = allCheck[i].getAttribute(tag_name[1])
								? allCheck[i].getAttribute(tag_name[1])
								: "";

								// removes the semicolon from value of defined attribute
								a = a.replace(/;/g, "");

								if (a.replace(/\s+/g, "").trim() == tag_name[2].replace(/\s+/g, "").trim()) {
									// increases the value of counter by 1 if matched value of defined attribute is equals to the value of defined value in testcase
									counter++;
								}
							}

							// contains '0' or '1' according to the match status of the testcase in html editor
							flag_check = checkNewTestCase(min, counter, outp);
						}
					}
				}
			}

			// returns true or false according to the value of variable flag_check
			return flag_check ? true : false;
		} catch(error) {
			// message the log on console in case of any error occured
			console.log({
				error,
				func: "attr_match",
				"Cause": "Old Case, need to convert like attr_match?HTML?TAG{ATTR{Value{MatchType}?MAX/MIN"
			});

			// returns false in case of any error occured
			return false;
		}
	}

	// used for match testcase string in whole html/js editor in case of html/js and in case of css it matches the media query, css selector and css property defined together in whole css editor 
	function str_match(src, inp, outp) {
		// indicates that string is matched in html/js editor according to the value of argument variable 'src'
		let flag_check = 1,
			singular = 0,
			justString = 0,
			complexTags = 0,
			tag_data = "",
			max = false,
			min = false;

		let input_data = inp;

		if (inp.indexOf("{1}") > -1) {
			// it is not in use for this function
			singular = 1;

			// removes the flag '{1}' from testcase string
			inp = inp.replace("{1}", "");
		}

		if (inp.indexOf("{2}") > -1) {
			// it is not in use for this function
			justString = 1;

			// removes the flag '{2}' from testcase string
			inp = inp.replace("{2}", "");
		}

		if (inp.indexOf("{3}") > -1) {
			// it is not in use for this function
			complexTags = 1;

			// removes the flag '{3}' from testcase string
			inp = inp.replace("{3}", "");
		}

		if (outp.indexOf("min") > -1) {
			// indicates that 'min' flag is enable
			min = true;

			// removes the 'min' text from defined flag and contains the numeric value
			outp = parseInt(outp.replace("min", ""));
		} else if (outp.indexOf("max") > -1) {
			// indicates that 'max' flag is enable
			max = true;

			// removes the 'max' text from defined flag and contains the numeric value
			outp = parseInt(outp.replace("max", ""));
		}

		// contains array of each character
		let word_arr = inp.split("");

		for (let i = 0; i < word_arr.length; i++) {
			if (word_arr[i].match(/\W/g)) {
				// adds flag '\\' before non word character 
				word_arr[i] = "\\" + word_arr[i];
			}
		}

		// converts array 'word_arr' into string after applying flag '\\' before non word character
		inp = word_arr.join("");

		// in case of 'str_match' in html, string matched in whole html part so no need of this block
		if (src == "HTML") {
			// contains the testcase data that have to be match
			tag_data = inp;

			// contains string data that have to be match
			inp = justString
			? inp
			: complexTags
				? "<" + inp + ".*?>.*?</" + inp + ">"
				: singular
					? "<" + inp.replace("[", " ").replace("]", "") + "(| |/| /)>"
					: "<" + inp.replace("[", " ").replace("]", "") + ">" + ".*?</" + tag_data + ">";
		}

		// contains pattern to be match defined testcase in 
		let re = "",
			// container for hold the html editor value
			html_tags = "",
			// container for hold the css editor value
			css_data = "",
			// container for hold the js editor value
			js_data = "";

		try {
			// contains new RegExp object for match defined string globally
			re = new RegExp(inp, "g");

			html_tags = htmlEditor.getValue().trim();
			css_data = cssEditor.getValue().trim();
			js_data = jsEditor.getValue().trim();
			css_data = css_data.replace(/\n/gm, "");
			js_data = js_data.replace(/\ /g, "");
		} catch(e) {
			// returns back in case of any error
			return false;
		}

		if (src == "HTML") {
			if (html_tags.match(re)) {
				if (html_tags.match(re).length == outp && html_tags) {
					flag_check = 1;
				} else if (html_tags.match(re).length <= outp && html_tags && html_tags.match(re).length && max) {
					flag_check = 1;
				} else if (html_tags.match(re).length >= outp && html_tags && html_tags.match(re).length && min) {
					flag_check = 1;
				} else {
					flag_check = 0;
				}
			} else {
				flag_check = 0;
			}
		} else if (src == "CSS") {
			// contains the array of matching data
			input_data = input_data.split("{");

			// creates an array for contain the defined media queries
			let media_arr = [];

			// initialize the counter
			let counter = 0;

			// removes space from the value of css editor that exist inside parenthesis
			css_data = css_data.replace(/\(.*?\)/gm, function (match_data) {
				return match_data.replace(/[ ]/gm, "");
			});

			// replaces '@' with '\n@'
			css_data = css_data.replace(/@/gm, "\n@");

			// contains the media data that starts from character '@' and ends before first curly brace 
			css_data = css_data.replace(/@([\s\S]*?){([\s\S]*?){([\s\S]*?)}([\s\S]*?)}/gm, function (match_data, media_data) {
				// contains meida query data that starts from character '@' and ends before first curly brace 
				let find_media_data = media_data;

				// contains an array of string defined in variable 'find_media_data' after spliting it with white space character
				find_media_data = find_media_data.split(" ");

				// array for store media data that are stored in array 'find_media_data' after removing blank values
				let store_data = [];

				for (let i = 0; i < find_media_data.length; i++) {
					if (find_media_data[i] != "") {
						// pushes data into array 'store_data' which is defined in array 'find_media_data' at index equals to the value of variable 'i'
						store_data.push(find_media_data[i]);
					}
				}

				// contains string after joining array 'store_data 'with' white space
				store_data = store_data.join(" ");

				// replaces old media data with new one after removing unnecessary more that one white space that comes together
				match_data = match_data.replace(media_data, store_data);

				// pushes the matched media query data into array 'media_arr'
				media_arr.push(match_data);

				// returns updated defined media queries data
				return match_data;
			});

			// loops through number of defined media query in css editor
			for (let j = 0; j < media_arr.length; j++) {
				// checks for match the media data defined in testcase with media data exist in array 'media_arr' at index equals to the value of variable 'j'
				let media_match = media_arr[j].indexOf(input_data[0].trim());

				// enters in this block if media query matched with the data defined in array 'media_arr' at index equals to the value of variable 'j'
				if (media_match > -1) {
					// contains the css selector
					let selector_match;

					// goes inside this block if multiple selector defined in testcase
					if (input_data[1].indexOf(",") > -1) {
						// contains array of all selector that defined in testcase
						let sub_input = input_data[1].split(",");

						for (let i = 0; i < sub_input.length; i++) {
							// contains index of css selector, defined in array 'sub_input' at index equlas to the value of variable 'i', in array 'media_arr' at index equals to the value of variable 'j'
							selector_match = media_arr[j].indexOf(sub_input[i].trim());

							// exist from loop if variable 'selector_match' contains value less than '0' means if any css selector does not exist in array 'media_arr' at index equals to the value of variable 'j' 
							if (selector_match < 0) {
								break;
							}
						}
					} else {
						// contains index of css selector in array 'media_arr' at index equals to the value of variable 'j' in case of single css selector defined
						selector_match = media_arr[j].indexOf(input_data[1].trim());
					}

					// enters in this block if selector matches in media query's string defined in array 'media_arr' at index equals to the value of variable 'j'
					if (selector_match > -1) {
						// contains the index of property string defined in media query that exist in array 'media_arr' at index equals to the value of variable 'j'
						let find_str = media_arr[j].indexOf(input_data[2].trim());

						// identify that property matched or not, initially defined that it is not matched
						let prop_match = false;

						// enters in this block if property string exist in array 'media_arr' at index equals to the value of variable 'j'
						if (find_str > -1) {
							// instead of this only variable 'find_str' can be used as contains the same value
							let find_str_index = media_arr[j].indexOf(input_data[2].trim());

							// contains the character exist at index equals to the value of variable 'find_str_index' by reducing 1
							let prop_data = media_arr[j].charAt(find_str_index - 1);

							// enters in this block for indicate that property matched if property is not combined with any other word such as in case of 'color' property then it will ignore 'background-color' property
							if (prop_data !== "-") {
								prop_match = true;
							}
						}

						// enters in this block if property matched in array 'media_arr' at index equals to the value of variable 'j'
						if (prop_match) {
							// increments value of variable 'counter' by 1
							counter = counter + 1;
						}
					}
				}
			}

			if (counter == outp) {
				return true;
			} else {
				return false;
			}
		} else {
			if (js_data.match(re)) {
				if (js_data.match(re).length == outp) {
					flag_check = 1;
				} else if (js_data.match(re).length <= outp && js_data && js_data.match(re).length && max) {
					flag_check = 1;
				} else if (js_data.match(re).length >= outp && js_data && js_data.match(re).length && min) {
					flag_check = 1;
				} else {
					flag_check = 0;
				}
			} else {
				flag_check = 0;
			}
		}

		if (flag_check) {
			return true;
		} else {
			return false;
		}
	}

	// used for check the result status of 'External Script' defined in 'Autograde' dialog box
	function externalCheck(get_cases) {
		try {
			// contains RegExp pattern for match the string 'var flagONN'
			let re = /var flagONN/gm;

			// contains the value of js editor
			let js_data = jsEditor.getValue().trim();

			js_data = js_data.replace(/^.*?body.*?\\n/gm, "");

			// removes all the text that exist in same line starting from 'document.write' string of js editor value 
			js_data = js_data.replace(/document\.write.*/gm, "");

			// contains the value after evaluate the script
			let result;

			if (!re.test(get_cases)) {
				// contains the value return by the script defined in js editor and in 'External Script' field of 'Autograde' dialog box
				result = eval(js_data + "\n" + get_cases);
			} else {
				// contains the value return by the script defined in 'External Script' field of 'Autograde
				result = eval(get_cases);
			}

			// returns the value stored in variable 'result'
			return result;
		} catch(err) {
			// shows log message in case of any error occurred
			console.log({ msg: err, func: "externalCheck@1108" });

			// returns false in case of any error occurred
			return false;
		}
	}

	// used for render the player tag
	function renderPlayer() {
		// makes player tag empty that exist inside element have id: authoringDiv
		//jQuery('#authoringDiv player').empty(); // Replaced
		AI.empty("#authoringDiv player");

		// used for set the data of player tag
		//  tag_player(jQuery('#authoringDiv')); // Replaced
		tag_player(AH.select("#authoringDiv"));

		// adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
		// jQuery('#authoringDiv').find('player').addClass('hidecontent'); // Replaced
		AI.select("#authoringDiv").querySelector("player").classList.add("hidecontent");

		/*jQuery('#editor img').each(function () {
        if (!jQuery(self).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
            // sets the value of 'src' attribute of img tag by adding string '//s3.amazonaws.com/jigyaasa_content_static/' before its previous src that exist inside element have id 'editor' and its src not contains the string '//s3.amazonaws.com/jigyaasa_content_static'
            jQuery(self).attr('src', '//s3.amazonaws.com/jigyaasa_content_static/' + jQuery(self).attr('src'));
        }
    }); Replaced
*/
		document.querySelector("#editor img").forEach(function (_this, i) {
			if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				_this.getAttribute("src", "//s3.amazonaws.com/jigyaasa_content_static/" + _this.getAttribute("src"));
			}
		});
	}

	// shows the output of the code in 'Result' editor
	function runCode() {
		// jQuery('html, body').animate({ scrollTop: jQuery('#result_div').offset().top }, 'slow'); // Replaced
		window.scroll({ top: 500, behavior: "smooth" });

		let date = new Date();
		date = date.getTime();
		let iframeId = "uC" + date;

		//   jQuery('#result_div').html('<iframe class="result_frame w-100 border-0" style="height:347px" id="' + iframeId + '"></iframe>'); //Replaced
		AH.select("#result_div").innerHTML = "<iframe class=\"result_frame w-100 border-0\" style=\"height:347px\" id=\"" + iframeId + "\"></iframe>";

		// returns the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag and hides the 'Loading...' containing after load
		let source = prepareSource();

		let iframe = document.querySelector("#uC" + date);
		iframe.onload = answerCheckWeb.bind(this, false);
		let iframe_doc = iframe.contentDocument;
		iframe_doc.open();
		iframe_doc.write(source);
		iframe_doc.close();
	}

	// makes blank the value of user answer xml and also of html,css and js editors but this method is not called from any where within the component
	function reset() {
		// makes blank the value of html editor
		htmlEditor.setValue("");

		// makes blank the value of css editor
		cssEditor.setValue("");

		// makes blank the value of js editor
		jsEditor.setValue("");

		// makes blank value of user answer xml
		//   jQuery("#special_module_user_xml").val(""); // Replaced
		AH.select("#special_module_user_xml").value = "";

		// makes blank the value of 'uaXML' of window object
		window.uxml = "";
	}

	// used for set the value of html, css, js editors, makes editor readonly which was made disabled at the time of question creation, hide the editors which was made hidden at the time of questio creation and change the theme of html, css and js editors according to the check status of 'Dark Theme' checkbox
	function parseXML(xml) {
		console.log("checking");

		// contains the xml 
		xml = xml ? xml : state.xml;

		// contains the html editor value from xml
		let htmlData = stringBetween(xml, "tag");

		// sets the value of html editor
		htmlEditor.setValue(htmlData ? htmlData.trim() : "");

		// contains the css editor value from xml
		let cssData = stringBetween(xml, "css");

		// sets the value of css editor
		cssEditor.setValue(cssData ? cssData.trim() : "");

		// contains the js editor value from xml
		let jsData = stringBetween(xml, "js");

		// sets the value of js editor
		jsEditor.setValue(jsData ? jsData.trim() : "");

		// contains the value of 'disable' attribute of web tag from xml
		let disableData = findAttribute(xml, "disable", "web");

		if ((/html/g).test(disableData)) {
			// sets the value '0' of variable 'readHTML' to indicate that html editor is 'readonly' and no any operation can be performed on this editor
			readHTML = 0;

			// makes the html editor as 'readonly'
			htmlEditor.setOption("readOnly", true);
		}

		if ((/js/g).test(disableData)) {
			// sets the value '0' of variable 'readJS' to indicate that js editor is 'readonly' and no any operation can be performed on this editor
			readJS = 0;

			jsEditor.setOption("readOnly", true);
		}

		if ((/css/g).test(disableData)) {
			// sets the value '0' of variable 'readCSS' to indicate that css editor is 'readonly' and no any operation can be performed on this editor
			readCSS = 0;

			cssEditor.setOption("readOnly", true);
		}

		// contains the value of 'hide' attribute of 'web' tag from xml
		let hideData = findAttribute(xml, "hide", "web");

		// updates the value of variable 'hideData' according to its value
		hideData = hideData ? hideData : ",,";

		// converts 'hideData' into array and 
		hideData = hideData.split(",");

		// used for hide the html, css or js editor according to the value of array 'hideData' defined at index '0', '1', '2'
		hideEditors(parseInt(hideData[0]), parseInt(hideData[1]), parseInt(hideData[2]));

		// changes theme of the html, js and css editors according to the checked status of 'Dark Mode' checkbox 
		setTimeout(
			function () {
				changeTheme();
			},
			100
		);
	}

	// used for hide the html, css or js editor according to the value of argument variable 'html', 'css', 'js'
	function hideEditors(html = 1, css = 1, js = 1) {
		// contains the value 1 or 0 that determines that html editor will be visible or not
		showHTML = isNaN(html) ? 1 : html;

		// contains the value 1 or 0 that determines that css editor will be visible or not
		showCSS = isNaN(css) ? 1 : css;

		// contains the value 1 or 0 that determine that js editor will be visible or not
		showJS = isNaN(js) ? 1 : js;

		// used for mobile team
		if (window.inNative) {
			if (!showHTML) {
				//    jQuery("#html_panel, #html_pane, #css_panel").hide(); // Replaced
				// document.getElementById('html_panel').style.display = 'none';
				// document.getElementById('html_pane').style.display = 'none';
				// document.getElementById('css_panel').style.display = 'none';
				AH.selectAll("#html_panel,#html_pane,#css_panel", "hide");
			}

			if (!showCSS) {
				//    jQuery("#css_panel,#css_pane,#js_panel").hide(); // Replaced
				// document.getElementById('css_panel').style.display = 'none';
				// document.getElementById('css_pane').style.display = 'none';
				// document.getElementById('js_panel').style.display = 'none';
				AH.selectAll("#css_panel,#css_pane,#js_panel", "hide");
			}

			if (!showJS) {
				//    jQuery("#js_panel,#js_pane,#css_panel").hide(); // Replaced
				// document.getElementById('js_panel').style.display = 'none';
				// document.getElementById('js_pane').style.display = 'none';
				// document.getElementById('css_panel').style.display = 'none';
				AH.selectAll("#js_panel,#js_pane,#css_panel", "hide");
			}

			if (showHTML && showCSS && showJS) {
				//    jQuery("#css_panel,#js_panel").hide(); // Replaced
				// document.getElementById('css_panel').style.display = 'none';
				// document.getElementById('js_panel').style.display = 'none';
				AH.selectAll("#css_panel,#js_panel", "hide");
			}

			return;
		}

		if (!showHTML) {
			// hides the html editor if the value of variable 'showHTML' is 0
			//jQuery("#html_panel").hide(); // Replaced
			//document.getElementById('html_panel').style.display = 'none';
			AH.select("#html_panel", "hide");

			split(["#css_panel", "#js_panel"], { sizes: [50, 50] });
		}

		if (!showCSS) {
			//  hides the css editor if the value of variable 'showCSS' is 0
			//jQuery("#css_panel").hide(); // Replaced
			//document.getElementById('css_panel').style.display = 'none';
			AH.select("#css_panel", "hide");

			split(["#html_panel", "#js_panel"], { sizes: [50, 50] });
		}

		if (!showJS) {
			//  hides the js editor if the value of variable 'showJS' is 0
			//jQuery("#js_panel").hide(); // Replaced
			//document.getElementById('js_panel').style.display = 'none';
			AH.selectAll("#js_panel", "hide");

			split(["#css_panel", "#html_panel"], { sizes: [50, 50] });
		}

		if (!showCSS && !showJS) {
			console.log("checking splitter");
			AH.selectAll("#css_panel,#js_panel", "hide");
			split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
			AH.select("#accordion", "css", { display: "flex" });
			split(["#html_panel"], { sizes: [100] });
			AH.select("#top_content", "css", { height: "100%" });
			AH.select("#firstEditorDiv", "removeAttr", "display");
		}

		if (!showCSS && !showHTML) {
			AH.selectAll("#css_panel,#html_panel", "hide");
			split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
			AH.select("#accordion", "css", { display: "flex" });
			split(["#js_panel"], { sizes: [100] });
			AH.select("#top_content", "css", { height: "100%" });
			AH.select("#firstEditorDiv", "removeAttr", "display");
		}

		if (!showHTML && !showJS) {
			AH.select("#firstEditorDiv", "removeAttr", "display");
			AH.selectAll("#js_panel,#html_panel", "hide");
			split(["#top_content", "#bottom_content"], { sizes: [50, 50] });
			AH.select("#accordion", "css", { display: "flex" });
			split(["#css_panel"], { sizes: [100] });
			AH.select("#top_content", "css", { height: "100%" });
			AH.select("#firstEditorDiv", "removeAttr", "display");
		}
	}

	// used for update the user answer xml value
	function saveWebAnswer(code, code_lang) {
		// contains the user answer xml of question xml
		let qxml = !(/smans/g).test(uxml) && uxml ? uxml : xml;

		// variable for hold the html, css and js editor value in xml format way
		let uXml = "";

		if (code_lang == "html") {
			// replace the old code of html editor with new one
			uXml = qxml.replace(/<tag>[\s\S]*?<\/tag>/g, "<tag>" + code + "</tag>");
		} else if (code_lang == "css") {
			// replace the old code of css editor with new one
			uXml = qxml.replace(/<css>[\s\S]*?<\/css>/g, "<css>" + code + "</css>");
		} else {
			// replace the old code of js editor with new one
			uXml = qxml.replace(/<js>[\s\S]*?<\/js>/g, "<js>" + code + "</js>");
		}

		// this block is used for mobile team
		if (window.inNative) {
			window.getHeight && window.getHeight();
		}

		// defines that user answer xml is changed
		ISSPECIALMODULEUSERXMLCHANGE = 1;

		// save the user answer xml
		//jQuery("#special_module_user_xml").val(uXml); // Replaced
		AH.select("#special_module_user_xml").value = uXml;

		// assign the user answer xml in variable 'userAnswers'
		//let userAnswers = userAnswer = jQuery("#special_module_user_xml").val(); // Replaced
		let userAnswers;

		userAnswers = userAnswer = AH.select("#special_module_user_xml").value;

		// used for mobile team
		if (window.inNative) {
			window.postMessage("height___" + document.getElementsByClassName("container-fluid")[0].offsetHeight, "*");
			window.postMessage(JSON.stringify({ userAnswers, inNativeIsCorrect: false }), "*");
		}

		// assign the user answer xml value in 'uaXML' variable of window object
		$$invalidate(6, uxml = uXml);

		resultSaving = uXml;
	}

	const writable_props = ["inQuizPlayer", "xml", "uxml", "isReview"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<WebPreview> was created with unknown prop '${key}'`);
	});

	const click_handler = () => {
		setReview();
	};

	const click_handler_1 = () => {
		unsetReview();
	};

	const click_handler_2 = () => $$invalidate(0, state.remediationToggle = false, state);

	function dialog_visible_binding(value) {
		state.remediationToggle = value;
		$$invalidate(0, state);
	}

	const close_handler = () => $$invalidate(0, state.remediationToggle = false, state);

	$$self.$$set = $$props => {
		if ("inQuizPlayer" in $$props) $$invalidate(7, inQuizPlayer = $$props.inQuizPlayer);
		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(6, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
	};

	$$self.$capture_state = () => ({
		themeUrl,
		afterUpdate,
		onMount,
		beforeUpdate,
		Button,
		Dialog,
		Loader,
		writable,
		l: language,
		AH,
		onUserAnsChange,
		Split: split,
		inQuizPlayer,
		xml,
		uxml,
		isReview,
		isPreview,
		rendered,
		mode,
		htmlEditor,
		cssEditor,
		jsEditor,
		showHTML,
		readHTML,
		showCSS,
		readCSS,
		showJS,
		readJS,
		splitter1,
		splitter2,
		splitter3,
		userAnswer,
		isOldTestcase,
		resultSaving,
		state,
		stateData,
		unsubscribe,
		loadLibs,
		setReview,
		unsetReview,
		getChildXml,
		splitter,
		changeStyle,
		changeTheme,
		newSource,
		prepareSource,
		renderCodeMirror,
		remediationMode,
		answerCheckWeb,
		testcaseCheck,
		splitCase,
		checkOldAttrTestCase,
		checkNewTestCase,
		internalCheck,
		style_match,
		attr_match,
		str_match,
		externalCheck,
		stringBetween,
		findAttribute,
		unRenderPlayer,
		renderPlayer,
		runCode,
		reset,
		parseXML,
		hideEditors,
		saveWebAnswer
	});

	$$self.$inject_state = $$props => {
		if ("themeUrl" in $$props) themeUrl = $$props.themeUrl;
		if ("inQuizPlayer" in $$props) $$invalidate(7, inQuizPlayer = $$props.inQuizPlayer);
		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
		if ("uxml" in $$props) $$invalidate(6, uxml = $$props.uxml);
		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
		if ("isPreview" in $$props) isPreview = $$props.isPreview;
		if ("rendered" in $$props) rendered = $$props.rendered;
		if ("mode" in $$props) mode = $$props.mode;
		if ("htmlEditor" in $$props) htmlEditor = $$props.htmlEditor;
		if ("cssEditor" in $$props) cssEditor = $$props.cssEditor;
		if ("jsEditor" in $$props) jsEditor = $$props.jsEditor;
		if ("showHTML" in $$props) showHTML = $$props.showHTML;
		if ("readHTML" in $$props) readHTML = $$props.readHTML;
		if ("showCSS" in $$props) showCSS = $$props.showCSS;
		if ("readCSS" in $$props) readCSS = $$props.readCSS;
		if ("showJS" in $$props) showJS = $$props.showJS;
		if ("readJS" in $$props) readJS = $$props.readJS;
		if ("splitter1" in $$props) splitter1 = $$props.splitter1;
		if ("splitter2" in $$props) splitter2 = $$props.splitter2;
		if ("splitter3" in $$props) splitter3 = $$props.splitter3;
		if ("userAnswer" in $$props) userAnswer = $$props.userAnswer;
		if ("isOldTestcase" in $$props) isOldTestcase = $$props.isOldTestcase;
		if ("resultSaving" in $$props) resultSaving = $$props.resultSaving;
		if ("state" in $$props) $$invalidate(0, state = $$props.state);
		if ("stateData" in $$props) stateData = $$props.stateData;
		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		state,
		setReview,
		unsetReview,
		changeTheme,
		runCode,
		xml,
		uxml,
		inQuizPlayer,
		isReview,
		click_handler,
		click_handler_1,
		click_handler_2,
		dialog_visible_binding,
		close_handler
	];
}

class WebPreview extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-1553786-style")) add_css();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				inQuizPlayer: 7,
				xml: 5,
				uxml: 6,
				isReview: 8
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "WebPreview",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*inQuizPlayer*/ ctx[7] === undefined && !("inQuizPlayer" in props)) {
			console_1.warn("<WebPreview> was created without expected prop 'inQuizPlayer'");
		}

		if (/*xml*/ ctx[5] === undefined && !("xml" in props)) {
			console_1.warn("<WebPreview> was created without expected prop 'xml'");
		}

		if (/*uxml*/ ctx[6] === undefined && !("uxml" in props)) {
			console_1.warn("<WebPreview> was created without expected prop 'uxml'");
		}

		if (/*isReview*/ ctx[8] === undefined && !("isReview" in props)) {
			console_1.warn("<WebPreview> was created without expected prop 'isReview'");
		}
	}

	get inQuizPlayer() {
		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inQuizPlayer(value) {
		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get xml() {
		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uxml() {
		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uxml(value) {
		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMWeb\WebAuthoring.svelte generated by Svelte v3.29.0 */

const { console: console_1$1 } = globals;
const file$1 = "clsSMWeb\\WebAuthoring.svelte";

// (788:28) <Checkbox                                    checked={state.goDark}                                   on:click={changeTheme}                                   id="goDark"                              >
function create_default_slot$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Dark Theme");
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
		id: create_default_slot$1.name,
		type: "slot",
		source: "(788:28) <Checkbox                                    checked={state.goDark}                                   on:click={changeTheme}                                   id=\\\"goDark\\\"                              >",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let div53;
	let div24;
	let div23;
	let div22;
	let div5;
	let div0;
	let button0;
	let t1;
	let div1;
	let button1;
	let t3;
	let div2;
	let input0;
	let t4;
	let div3;
	let span0;
	let checkbox;
	let t5;
	let div4;
	let button2;
	let i;
	let t6;
	let t7_value = language.run + "";
	let t7;
	let t8;
	let div21;
	let div16;
	let div15;
	let div8;
	let div6;
	let span1;
	let t10;
	let div7;
	let textarea0;
	let t11;
	let div11;
	let div9;
	let span2;
	let t13;
	let div10;
	let textarea1;
	let t14;
	let div14;
	let div12;
	let span3;
	let t16;
	let div13;
	let textarea2;
	let t17;
	let div20;
	let div19;
	let div17;
	let span4;
	let t19;
	let div18;
	let t20;
	let div43;
	let div42;
	let div41;
	let div25;
	let h40;
	let label0;
	let t22;
	let input1;
	let t23;
	let button3;
	let t25;
	let div39;
	let div38;
	let div29;
	let div26;
	let h41;
	let a0;
	let t27;
	let span5;
	let t28;
	let div28;
	let div27;
	let textarea3;
	let t29;
	let div33;
	let div30;
	let h42;
	let a1;
	let t31;
	let span6;
	let t32;
	let div32;
	let div31;
	let textarea4;
	let t33;
	let div37;
	let div34;
	let h43;
	let a2;
	let t35;
	let span7;
	let t36;
	let div36;
	let div35;
	let textarea5;
	let t37;
	let div40;
	let button4;
	let t39;
	let div52;
	let div51;
	let div50;
	let div44;
	let h44;
	let t41;
	let button5;
	let t43;
	let div49;
	let div45;
	let label1;
	let t46;
	let select0;
	let option0;
	let option1;
	let option2;
	let t50;
	let div46;
	let label2;
	let t53;
	let select1;
	let option3;
	let option4;
	let option5;
	let t57;
	let div47;
	let label3;
	let t60;
	let select2;
	let option6;
	let option7;
	let option8;
	let t64;
	let div48;
	let button6;
	let t66;
	let input2;
	let current;
	let mounted;
	let dispose;

	checkbox = new Checkbox({
			props: {
				checked: /*state*/ ctx[0].goDark,
				id: "goDark",
				$$slots: { default: [create_default_slot$1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	checkbox.$on("click", /*changeTheme*/ ctx[1]);

	const block = {
		c: function create() {
			div53 = element("div");
			div24 = element("div");
			div23 = element("div");
			div22 = element("div");
			div5 = element("div");
			div0 = element("div");
			button0 = element("button");
			button0.textContent = `${language.autograde}`;
			t1 = space();
			div1 = element("div");
			button1 = element("button");
			button1.textContent = `${language.disable}`;
			t3 = space();
			div2 = element("div");
			input0 = element("input");
			t4 = space();
			div3 = element("div");
			span0 = element("span");
			create_component(checkbox.$$.fragment);
			t5 = space();
			div4 = element("div");
			button2 = element("button");
			i = element("i");
			t6 = space();
			t7 = text(t7_value);
			t8 = space();
			div21 = element("div");
			div16 = element("div");
			div15 = element("div");
			div8 = element("div");
			div6 = element("div");
			span1 = element("span");
			span1.textContent = `${language.html}`;
			t10 = space();
			div7 = element("div");
			textarea0 = element("textarea");
			t11 = space();
			div11 = element("div");
			div9 = element("div");
			span2 = element("span");
			span2.textContent = `${language.css}`;
			t13 = space();
			div10 = element("div");
			textarea1 = element("textarea");
			t14 = space();
			div14 = element("div");
			div12 = element("div");
			span3 = element("span");
			span3.textContent = `${language.js}`;
			t16 = space();
			div13 = element("div");
			textarea2 = element("textarea");
			t17 = space();
			div20 = element("div");
			div19 = element("div");
			div17 = element("div");
			span4 = element("span");
			span4.textContent = `${language.result}`;
			t19 = space();
			div18 = element("div");
			t20 = space();
			div43 = element("div");
			div42 = element("div");
			div41 = element("div");
			div25 = element("div");
			h40 = element("h4");
			label0 = element("label");
			label0.textContent = `${language.autograde}`;
			t22 = space();
			input1 = element("input");
			t23 = space();
			button3 = element("button");
			button3.textContent = "×";
			t25 = space();
			div39 = element("div");
			div38 = element("div");
			div29 = element("div");
			div26 = element("div");
			h41 = element("h4");
			a0 = element("a");
			a0.textContent = `${language.testcases}`;
			t27 = space();
			span5 = element("span");
			t28 = space();
			div28 = element("div");
			div27 = element("div");
			textarea3 = element("textarea");
			t29 = space();
			div33 = element("div");
			div30 = element("div");
			h42 = element("h4");
			a1 = element("a");
			a1.textContent = `${language.internalScript}`;
			t31 = space();
			span6 = element("span");
			t32 = space();
			div32 = element("div");
			div31 = element("div");
			textarea4 = element("textarea");
			t33 = space();
			div37 = element("div");
			div34 = element("div");
			h43 = element("h4");
			a2 = element("a");
			a2.textContent = `${language.externalScript}`;
			t35 = space();
			span7 = element("span");
			t36 = space();
			div36 = element("div");
			div35 = element("div");
			textarea5 = element("textarea");
			t37 = space();
			div40 = element("div");
			button4 = element("button");
			button4.textContent = "Done";
			t39 = space();
			div52 = element("div");
			div51 = element("div");
			div50 = element("div");
			div44 = element("div");
			h44 = element("h4");
			h44.textContent = `${language.disable}`;
			t41 = space();
			button5 = element("button");
			button5.textContent = "×";
			t43 = space();
			div49 = element("div");
			div45 = element("div");
			label1 = element("label");
			label1.textContent = `${language.html}:`;
			t46 = space();
			select0 = element("select");
			option0 = element("option");
			option0.textContent = `${language.editable}`;
			option1 = element("option");
			option1.textContent = `${language.hidden}`;
			option2 = element("option");
			option2.textContent = `${language.disabled}`;
			t50 = space();
			div46 = element("div");
			label2 = element("label");
			label2.textContent = `${language.css}:`;
			t53 = space();
			select1 = element("select");
			option3 = element("option");
			option3.textContent = `${language.editable}`;
			option4 = element("option");
			option4.textContent = `${language.hidden}`;
			option5 = element("option");
			option5.textContent = `${language.disabled}`;
			t57 = space();
			div47 = element("div");
			label3 = element("label");
			label3.textContent = `${language.js}:`;
			t60 = space();
			select2 = element("select");
			option6 = element("option");
			option6.textContent = `${language.editable}`;
			option7 = element("option");
			option7.textContent = `${language.hidden}`;
			option8 = element("option");
			option8.textContent = `${language.disabled}`;
			t64 = space();
			div48 = element("div");
			button6 = element("button");
			button6.textContent = `${language.done}`;
			t66 = space();
			input2 = element("input");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "data-bs-toggle", "modal");
			attr_dev(button0, "data-bs-target", "#autograde_modal");
			attr_dev(button0, "class", "btn btn-primary mr-2");
			add_location(button0, file$1, 761, 24, 34176);
			attr_dev(div0, "class", "inline-block pull-left");
			add_location(div0, file$1, 760, 20, 34114);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "data-bs-toggle", "modal");
			attr_dev(button1, "data-bs-target", "#disable_modal");
			attr_dev(button1, "class", "btn btn-primary mr-2");
			add_location(button1, file$1, 769, 24, 34564);
			attr_dev(div1, "class", "inline-block pull-left");
			add_location(div1, file$1, 768, 20, 34502);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "id", "launch_caption");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "placeholder", "Caption");
			add_location(input0, file$1, 777, 24, 34957);
			attr_dev(div2, "class", "inline-block pull-left width150");
			add_location(div2, file$1, 776, 20, 34886);
			attr_dev(span0, "class", "themeStyle form-check form-check-inline");
			add_location(span0, file$1, 786, 24, 35384);
			attr_dev(div3, "class", "inline-block width150 relative bottom6 pull-left ml-lg");
			add_location(div3, file$1, 785, 20, 35290);
			attr_dev(i, "class", "fa fa-code");
			add_location(i, file$1, 802, 28, 36116);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-primary ml");
			add_location(button2, file$1, 797, 24, 35902);
			attr_dev(div4, "class", "inline-block pull-right");
			add_location(div4, file$1, 796, 20, 35839);
			attr_dev(div5, "id", "web_toolbar");
			set_style(div5, "height", "50px");
			attr_dev(div5, "class", "bg-light w-100 p-2");
			add_location(div5, file$1, 759, 16, 34021);
			add_location(span1, file$1, 811, 36, 36626);
			attr_dev(div6, "class", "card-header rounded-0");
			add_location(div6, file$1, 810, 32, 36553);
			attr_dev(textarea0, "name", "html");
			attr_dev(textarea0, "id", "html_editor");
			add_location(textarea0, file$1, 814, 36, 36843);
			attr_dev(div7, "id", "html");
			attr_dev(div7, "class", "card-body code_box content-div m-0 p-0");
			set_style(div7, "height", "347px");
			add_location(div7, file$1, 813, 32, 36721);
			attr_dev(div8, "id", "html_panel");
			attr_dev(div8, "class", "card m-0 p-0 rounded-0");
			add_location(div8, file$1, 809, 28, 36467);
			add_location(span2, file$1, 819, 36, 37157);
			attr_dev(div9, "class", "card-header rounded-0");
			add_location(div9, file$1, 818, 32, 37084);
			attr_dev(textarea1, "name", "css");
			attr_dev(textarea1, "id", "css_editor");
			add_location(textarea1, file$1, 822, 36, 37372);
			attr_dev(div10, "id", "css");
			attr_dev(div10, "class", "card-body code_box content-div m-0 p-0");
			set_style(div10, "height", "347px");
			add_location(div10, file$1, 821, 32, 37251);
			attr_dev(div11, "id", "css_panel");
			attr_dev(div11, "class", "card m-0 p-0 rounded-0");
			add_location(div11, file$1, 817, 28, 36999);
			add_location(span3, file$1, 827, 36, 37683);
			attr_dev(div12, "class", "card-header rounded-0");
			add_location(div12, file$1, 826, 32, 37610);
			attr_dev(textarea2, "name", "js");
			attr_dev(textarea2, "id", "js_editor");
			add_location(textarea2, file$1, 830, 36, 37896);
			attr_dev(div13, "id", "js");
			attr_dev(div13, "class", "card-body code_box content-div m-0 p-0");
			set_style(div13, "height", "347px");
			add_location(div13, file$1, 829, 32, 37776);
			attr_dev(div14, "id", "js_panel");
			attr_dev(div14, "class", "card m-0 p-0 rounded-0");
			add_location(div14, file$1, 825, 28, 37526);
			attr_dev(div15, "id", "firstEditorDiv");
			set_style(div15, "display", "flex");
			add_location(div15, file$1, 808, 24, 36390);
			attr_dev(div16, "id", "top_content");
			add_location(div16, file$1, 807, 20, 36342);
			add_location(span4, file$1, 848, 32, 38894);
			attr_dev(div17, "class", "card-header rounded-0");
			add_location(div17, file$1, 847, 28, 38825);
			attr_dev(div18, "id", "result_div");
			set_style(div18, "min-height", "351px");
			attr_dev(div18, "class", "card-body content-div m-0 p-0 rounded-0");
			add_location(div18, file$1, 850, 28, 38983);
			attr_dev(div19, "class", "card rounded-0 nm");
			add_location(div19, file$1, 846, 24, 38764);
			attr_dev(div20, "id", "bottom_content");
			add_location(div20, file$1, 845, 20, 38713);
			attr_dev(div21, "id", "wrap");
			set_style(div21, "width", "100%");
			set_style(div21, "background", "white");
			set_style(div21, "padding", "0px");
			add_location(div21, file$1, 806, 16, 36255);
			attr_dev(div22, "class", "row");
			add_location(div22, file$1, 758, 12, 33986);
			attr_dev(div23, "class", "container-fluid");
			add_location(div23, file$1, 757, 8, 33943);
			add_location(div24, file$1, 756, 4, 33928);
			attr_dev(label0, "for", "autograde_cb");
			attr_dev(label0, "class", "form-check-label pr-2");
			add_location(label0, file$1, 868, 24, 39699);
			attr_dev(input1, "type", "checkbox");
			attr_dev(input1, "name", "autograde_cb");
			attr_dev(input1, "id", "autograde_cb");
			attr_dev(input1, "class", "form-check-input");
			add_location(input1, file$1, 869, 24, 39803);
			attr_dev(h40, "class", "modal-title form-check form-check-inline");
			add_location(h40, file$1, 867, 20, 39620);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "close");
			attr_dev(button3, "data-bs-dismiss", "modal");
			attr_dev(button3, "aria-hidden", "true");
			attr_dev(button3, "id", "close_dialog_btn");
			attr_dev(button3, "auto:focus", "autofocus");
			add_location(button3, file$1, 877, 20, 40143);
			attr_dev(div25, "class", "modal-header");
			add_location(div25, file$1, 866, 16, 39572);
			attr_dev(a0, "class", "text-dark");
			attr_dev(a0, "data-bs-toggle", "collapse");
			attr_dev(a0, "data-bs-parent", "#grade_accordion");
			attr_dev(a0, "href", "#test_case_collapse");
			add_location(a0, file$1, 891, 36, 40866);
			attr_dev(span5, "class", "icomoon-help float-right s4");
			attr_dev(span5, "data-bs-toggle", "tooltip");
			attr_dev(span5, "title", "custom function name|input1,input2,..inputN|Output");
			attr_dev(span5, "data-bs-placement", "left");
			add_location(span5, file$1, 899, 36, 41315);
			attr_dev(h41, "class", "panel-title");
			add_location(h41, file$1, 890, 32, 40804);
			attr_dev(div26, "class", "card-header");
			attr_dev(div26, "data-bs-toggle", "collapse");
			attr_dev(div26, "data-bs-target", "#test_case_collapse");
			add_location(div26, file$1, 889, 28, 40682);
			attr_dev(textarea3, "id", "test_case_text");
			attr_dev(textarea3, "class", "form-control");
			set_style(textarea3, "maxHeight", "150px");
			set_style(textarea3, "minHeight", "80px");
			attr_dev(textarea3, "placeholder", "custom function name|input1,input2,..inputN|Output");
			textarea3.disabled = "disabled";
			add_location(textarea3, file$1, 909, 36, 41933);
			attr_dev(div27, "class", "card-body p-md");
			add_location(div27, file$1, 908, 32, 41867);
			attr_dev(div28, "id", "test_case_collapse");
			attr_dev(div28, "class", "collapse in");
			add_location(div28, file$1, 907, 28, 41784);
			attr_dev(div29, "class", "card mb-2");
			add_location(div29, file$1, 888, 24, 40629);
			attr_dev(a1, "class", "text-dark");
			attr_dev(a1, "data-bs-toggle", "collapse");
			attr_dev(a1, "data-bs-parent", "#grade_accordion");
			attr_dev(a1, "href", "#internal_script_collapse");
			add_location(a1, file$1, 923, 36, 42810);
			attr_dev(span6, "class", "icomoon-help float-right s4");
			attr_dev(span6, "data-bs-toggle", "tooltip");
			attr_dev(span6, "title", "1. attr_match?HTML?tag name{1}?occurance.(for tag match)  2. attr_match?HTML?tag name");
			attr_dev(span6, "data-bs-placement", "left");
			add_location(span6, file$1, 931, 40, 43274);
			attr_dev(h42, "class", "panel-title");
			add_location(h42, file$1, 922, 32, 42748);
			attr_dev(div30, "class", "card-header");
			attr_dev(div30, "data-bs-toggle", "collapse");
			attr_dev(div30, "data-bs-target", "#internal_script_collapse");
			add_location(div30, file$1, 921, 28, 42620);
			attr_dev(textarea4, "id", "occurence_text");
			attr_dev(textarea4, "class", "form-control");
			set_style(textarea4, "max-height", "150px");
			set_style(textarea4, "min-height", "80px");
			attr_dev(textarea4, "placeholder", "function as suggested in help block?Lang?keyword?occurance");
			textarea4.disabled = "disabled";
			add_location(textarea4, file$1, 941, 36, 43960);
			attr_dev(div31, "class", "card-body p-md");
			add_location(div31, file$1, 940, 32, 43894);
			attr_dev(div32, "id", "internal_script_collapse");
			attr_dev(div32, "class", "panel-collapse collapse");
			add_location(div32, file$1, 939, 28, 43793);
			attr_dev(div33, "class", "card mb-2");
			add_location(div33, file$1, 920, 24, 42567);
			attr_dev(a2, "class", "text-dark");
			attr_dev(a2, "data-bs-toggle", "collapse");
			attr_dev(a2, "data-bs-parent", "#grade_accordion");
			attr_dev(a2, "href", "#external_script_collapse");
			add_location(a2, file$1, 955, 36, 44847);
			attr_dev(span7, "class", "icomoon-help float-right s4");
			attr_dev(span7, "data-bs-toggle", "tooltip");
			attr_dev(span7, "title", "Write your own script");
			attr_dev(span7, "data-bs-placement", "left");
			add_location(span7, file$1, 963, 36, 45307);
			attr_dev(h43, "class", "panel-title");
			add_location(h43, file$1, 954, 32, 44785);
			attr_dev(div34, "class", "card-header");
			attr_dev(div34, "data-bs-toggle", "collapse");
			attr_dev(div34, "data-bs-target", "#external_script_collapse");
			add_location(div34, file$1, 953, 28, 44657);
			attr_dev(textarea5, "id", "exscript_text");
			attr_dev(textarea5, "class", "form-control");
			set_style(textarea5, "max-height", "150px");
			set_style(textarea5, "min-height", "80px");
			attr_dev(textarea5, "placeholder", "Write your own script");
			textarea5.disabled = "disabled";
			textarea5.value = "\r\n                                    ";
			add_location(textarea5, file$1, 973, 36, 45914);
			attr_dev(div35, "class", "card-body p-md");
			add_location(div35, file$1, 972, 32, 45848);
			attr_dev(div36, "id", "external_script_collapse");
			attr_dev(div36, "class", "panel-collapse collapse");
			add_location(div36, file$1, 971, 28, 45747);
			attr_dev(div37, "class", "card mb-2");
			add_location(div37, file$1, 952, 24, 44604);
			attr_dev(div38, "class", "panel-group");
			attr_dev(div38, "id", "grade_accordion");
			add_location(div38, file$1, 887, 20, 40557);
			attr_dev(div39, "class", "modal-body overflow-auto");
			add_location(div39, file$1, 886, 16, 40497);
			attr_dev(button4, "type", "button");
			attr_dev(button4, "class", "btn btn-primary");
			attr_dev(button4, "data-bs-dismiss", "modal");
			attr_dev(button4, "name", "done_grading_btn");
			attr_dev(button4, "id", "done_grading_btn");
			add_location(button4, file$1, 988, 20, 46651);
			attr_dev(div40, "class", "modal-footer");
			add_location(div40, file$1, 987, 16, 46603);
			attr_dev(div41, "class", "modal-content");
			add_location(div41, file$1, 865, 12, 39527);
			attr_dev(div42, "class", "modal-dialog modal-lg modal-dialog-centered");
			add_location(div42, file$1, 864, 8, 39456);
			attr_dev(div43, "id", "autograde_modal");
			attr_dev(div43, "class", "modal fade");
			attr_dev(div43, "role", "dialog");
			add_location(div43, file$1, 863, 4, 39387);
			attr_dev(h44, "class", "modal-title");
			add_location(h44, file$1, 1005, 20, 47289);
			attr_dev(button5, "type", "button");
			attr_dev(button5, "class", "close");
			attr_dev(button5, "data-bs-dismiss", "modal");
			attr_dev(button5, "aria-hidden", "true");
			add_location(button5, file$1, 1006, 20, 47351);
			attr_dev(div44, "class", "modal-header");
			add_location(div44, file$1, 1004, 16, 47241);
			attr_dev(label1, "for", "html_disable");
			add_location(label1, file$1, 1010, 24, 47578);
			option0.__value = "";
			option0.value = option0.__value;
			add_location(option0, file$1, 1012, 28, 47769);
			option1.__value = "0";
			option1.value = option1.__value;
			add_location(option1, file$1, 1013, 28, 47837);
			option2.__value = "1";
			option2.value = option2.__value;
			add_location(option2, file$1, 1014, 28, 47904);
			attr_dev(select0, "class", "form-control");
			attr_dev(select0, "id", "html_disable");
			attr_dev(select0, "auto:focus", "autofocus");
			add_location(select0, file$1, 1011, 24, 47647);
			attr_dev(div45, "class", "form-group");
			add_location(div45, file$1, 1009, 20, 47528);
			attr_dev(label2, "for", "css_disable");
			add_location(label2, file$1, 1018, 24, 48078);
			option3.__value = "";
			option3.value = option3.__value;
			add_location(option3, file$1, 1020, 28, 48243);
			option4.__value = "0";
			option4.value = option4.__value;
			add_location(option4, file$1, 1021, 28, 48311);
			option5.__value = "1";
			option5.value = option5.__value;
			add_location(option5, file$1, 1022, 28, 48378);
			attr_dev(select1, "class", "form-control");
			attr_dev(select1, "id", "css_disable");
			add_location(select1, file$1, 1019, 24, 48145);
			attr_dev(div46, "class", "form-group");
			add_location(div46, file$1, 1017, 20, 48028);
			attr_dev(label3, "for", "js_disable");
			add_location(label3, file$1, 1026, 24, 48552);
			option6.__value = "";
			option6.value = option6.__value;
			add_location(option6, file$1, 1028, 28, 48714);
			option7.__value = "0";
			option7.value = option7.__value;
			add_location(option7, file$1, 1029, 28, 48782);
			option8.__value = "1";
			option8.value = option8.__value;
			add_location(option8, file$1, 1030, 28, 48849);
			attr_dev(select2, "class", "form-control");
			attr_dev(select2, "id", "js_disable");
			add_location(select2, file$1, 1027, 24, 48617);
			attr_dev(div47, "class", "form-group");
			add_location(div47, file$1, 1025, 20, 48502);
			attr_dev(button6, "type", "button");
			attr_dev(button6, "class", "btn btn-primary");
			attr_dev(button6, "data-bs-dismiss", "modal");
			add_location(button6, file$1, 1034, 24, 49024);
			attr_dev(div48, "class", "float-right");
			add_location(div48, file$1, 1033, 20, 48973);
			attr_dev(div49, "class", "modal-body");
			add_location(div49, file$1, 1008, 16, 47482);
			attr_dev(div50, "class", "modal-content");
			add_location(div50, file$1, 1003, 12, 47196);
			attr_dev(div51, "class", "modal-dialog modal-sm modal-dialog-centered");
			add_location(div51, file$1, 1002, 8, 47125);
			attr_dev(div52, "id", "disable_modal");
			attr_dev(div52, "class", "modal fade");
			attr_dev(div52, "role", "dialog");
			add_location(div52, file$1, 1001, 4, 47058);
			attr_dev(input2, "type", "hidden");
			attr_dev(input2, "id", "ansModeAnswer");
			input2.value = "";
			add_location(input2, file$1, 1040, 4, 49217);
			attr_dev(div53, "id", "authoringArea");
			set_style(div53, "line-height", "20px");
			set_style(div53, "font-size", "14px");
			add_location(div53, file$1, 755, 0, 33857);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div53, anchor);
			append_dev(div53, div24);
			append_dev(div24, div23);
			append_dev(div23, div22);
			append_dev(div22, div5);
			append_dev(div5, div0);
			append_dev(div0, button0);
			append_dev(div5, t1);
			append_dev(div5, div1);
			append_dev(div1, button1);
			append_dev(div5, t3);
			append_dev(div5, div2);
			append_dev(div2, input0);
			append_dev(div5, t4);
			append_dev(div5, div3);
			append_dev(div3, span0);
			mount_component(checkbox, span0, null);
			append_dev(div5, t5);
			append_dev(div5, div4);
			append_dev(div4, button2);
			append_dev(button2, i);
			append_dev(button2, t6);
			append_dev(button2, t7);
			append_dev(div22, t8);
			append_dev(div22, div21);
			append_dev(div21, div16);
			append_dev(div16, div15);
			append_dev(div15, div8);
			append_dev(div8, div6);
			append_dev(div6, span1);
			append_dev(div8, t10);
			append_dev(div8, div7);
			append_dev(div7, textarea0);
			append_dev(div15, t11);
			append_dev(div15, div11);
			append_dev(div11, div9);
			append_dev(div9, span2);
			append_dev(div11, t13);
			append_dev(div11, div10);
			append_dev(div10, textarea1);
			append_dev(div15, t14);
			append_dev(div15, div14);
			append_dev(div14, div12);
			append_dev(div12, span3);
			append_dev(div14, t16);
			append_dev(div14, div13);
			append_dev(div13, textarea2);
			append_dev(div21, t17);
			append_dev(div21, div20);
			append_dev(div20, div19);
			append_dev(div19, div17);
			append_dev(div17, span4);
			append_dev(div19, t19);
			append_dev(div19, div18);
			append_dev(div53, t20);
			append_dev(div53, div43);
			append_dev(div43, div42);
			append_dev(div42, div41);
			append_dev(div41, div25);
			append_dev(div25, h40);
			append_dev(h40, label0);
			append_dev(h40, t22);
			append_dev(h40, input1);
			append_dev(div25, t23);
			append_dev(div25, button3);
			append_dev(div41, t25);
			append_dev(div41, div39);
			append_dev(div39, div38);
			append_dev(div38, div29);
			append_dev(div29, div26);
			append_dev(div26, h41);
			append_dev(h41, a0);
			append_dev(h41, t27);
			append_dev(h41, span5);
			append_dev(div29, t28);
			append_dev(div29, div28);
			append_dev(div28, div27);
			append_dev(div27, textarea3);
			append_dev(div38, t29);
			append_dev(div38, div33);
			append_dev(div33, div30);
			append_dev(div30, h42);
			append_dev(h42, a1);
			append_dev(h42, t31);
			append_dev(h42, span6);
			append_dev(div33, t32);
			append_dev(div33, div32);
			append_dev(div32, div31);
			append_dev(div31, textarea4);
			append_dev(div38, t33);
			append_dev(div38, div37);
			append_dev(div37, div34);
			append_dev(div34, h43);
			append_dev(h43, a2);
			append_dev(h43, t35);
			append_dev(h43, span7);
			append_dev(div37, t36);
			append_dev(div37, div36);
			append_dev(div36, div35);
			append_dev(div35, textarea5);
			append_dev(div41, t37);
			append_dev(div41, div40);
			append_dev(div40, button4);
			append_dev(div53, t39);
			append_dev(div53, div52);
			append_dev(div52, div51);
			append_dev(div51, div50);
			append_dev(div50, div44);
			append_dev(div44, h44);
			append_dev(div44, t41);
			append_dev(div44, button5);
			append_dev(div50, t43);
			append_dev(div50, div49);
			append_dev(div49, div45);
			append_dev(div45, label1);
			append_dev(div45, t46);
			append_dev(div45, select0);
			append_dev(select0, option0);
			append_dev(select0, option1);
			append_dev(select0, option2);
			append_dev(div49, t50);
			append_dev(div49, div46);
			append_dev(div46, label2);
			append_dev(div46, t53);
			append_dev(div46, select1);
			append_dev(select1, option3);
			append_dev(select1, option4);
			append_dev(select1, option5);
			append_dev(div49, t57);
			append_dev(div49, div47);
			append_dev(div47, label3);
			append_dev(div47, t60);
			append_dev(div47, select2);
			append_dev(select2, option6);
			append_dev(select2, option7);
			append_dev(select2, option8);
			append_dev(div49, t64);
			append_dev(div49, div48);
			append_dev(div48, button6);
			append_dev(div53, t66);
			append_dev(div53, input2);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input0, "keyup", /*generateXml*/ ctx[2], false, false, false),
					listen_dev(button2, "click", /*runCode*/ ctx[3], false, false, false),
					listen_dev(input1, "click", /*enableAutograde*/ ctx[4], false, false, false),
					listen_dev(textarea3, "keyup", /*generateXml*/ ctx[2], false, false, false),
					listen_dev(textarea4, "keyup", /*generateXml*/ ctx[2], false, false, false),
					listen_dev(textarea5, "keyup", /*generateXml*/ ctx[2], false, false, false),
					listen_dev(select0, "blur", /*generateXml*/ ctx[2], false, false, false),
					listen_dev(select1, "blur", /*generateXml*/ ctx[2], false, false, false),
					listen_dev(select2, "blur", /*generateXml*/ ctx[2], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const checkbox_changes = {};
			if (dirty[0] & /*state*/ 1) checkbox_changes.checked = /*state*/ ctx[0].goDark;

			if (dirty[1] & /*$$scope*/ 32) {
				checkbox_changes.$$scope = { dirty, ctx };
			}

			checkbox.$set(checkbox_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(checkbox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(checkbox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div53);
			destroy_component(checkbox);
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

function handleDisable() {
	let html = parseInt(document.querySelector("#html_disable").value);
	let css = parseInt(document.querySelector("#css_disable").value);
	let js = parseInt(document.querySelector("#js_disable").value);
	let disableStr = (html ? "html " : "") + (css ? "css " : "") + (js ? "js" : "");
	disableStr = disableStr.trim();

	disableStr = disableStr
	? "disable=\"" + disableStr.split(" ").join() + "\""
	: "";

	let hiddenStr = (html == 0 ? "0 " : "1 ") + (css == 0 ? "0 " : "1 ") + (js == 0 ? "0 " : "1 ");
	hiddenStr = hiddenStr.trim();

	hiddenStr = hiddenStr
	? "hide=\"" + hiddenStr.split(" ").join() + "\""
	: "";

	let finalStr = disableStr + " " + hiddenStr;
	return finalStr;
}

function stringBetween$1(data, str_1, str_2) {
	// contains RegExp pattern for match in string
	let regEx;

	if (str_2) {
		// creates the pattern if opening and closing both tag provided at the time of function calling
		regEx = new RegExp(str_1 + "([\\s\\S]*?)" + str_2, "gm");
	} else {
		// creates the pattern if opening and closing both tag not provided at the time of function calling
		regEx = new RegExp("<" + str_1 + ">([\\s\\S]*?)</" + str_1 + ">", "gm");
	}

	// contains the text according to the match data in xml string
	let matchedStr = regEx.exec(data);

	if (matchedStr) {
		// returns the text between given opening and closing tag if it exist
		return matchedStr[1];
	} else {
		// returns the null if text not found between given opening and closing tag
		return null;
	}
}

// returns the value of attribute defined in second argument from tag defined in 3rd argument in xml string defined in argument 1
function findAttribute$1(XML, attr, tag = "") {
	// creates new RegExp object for match the value of attribute of any tag
	let regEx = new RegExp("<" + tag + ".*?" + attr + "=\"(\\w.*?)\".*?>", "gm");

	// contains the matched text in 'XML' string if it matched otherwise null value holds
	let matchedStr = regEx.exec(XML);

	if (matchedStr) {
		// returns the value of attribute defined in argument variable 'attr' of tag defined in argument variable 'tag' of XML
		return matchedStr[1];
	} else {
		// returns null if no matched data found
		return null;
	}
}

// used for contain the actual text value from formatted xml text
function getCase(str) {
	// replaces the string '</case><case>' with semicolon (;) and '</case>','<case>' or '\n' with blank value
	str = str.replace(/\n/gm, "").replace(/<\/case><case>/gm, ";").replace(/<\/case>|<case>/g, "");

	// returns the formatted string
	return str;
}

// used for unrender the player tag
function unRenderPlayer$1() {
	// makes player tag empty that exist inside element have id: authoringDiv
	//jQuery('#authoringDiv player').empty();
	AI.empty("#authoringDiv player");

	// removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
	//jQuery('#authoringDiv').find('player').removeClass('hidecontent'); // Replaced
	document.querySelector("#authoringDiv").querySelector("player").classList.remove("hidecontent");

	// jQuery('#editor img').each(function () { // Replaced
	//     if (!jQuery(self).attr('src').match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
	//         // sets the value of 'src' attribute of img tag that exist inside element have id 'editor' and its src not contains the string '//s3.amazonaws.com/jigyaasa_content_static' 
	//         jQuery(self).attr('src', jQuery(self).attr('src'));
	//     }
	// }); 
	document.querySelector("#editor img").forEach(function (_this, i) {
		if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
			_this.getAttribute("src", _this.getAttribute("src"));
		}
	});
}

// used for render the player tag
function renderPlayer() {
	// makes player tag empty that exist inside element have id: authoringDiv
	//jQuery('#authoringDiv player').empty(); // Replaced
	AI.empty("#authoringDiv player");

	// used for set the data of player tag
	//   tag_player(jQuery('#authoringDiv')); // Replaced
	//tag_player(document.querySelector('#authoringDiv'));
	// adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
	//jQuery('#authoringDiv').find('player').addClass('hidecontent'); // Replaced
	setTimeout(
		function () {
			document.querySelector("#authoringDiv").querySelector("player").classList.add("hidecontent");
		},
		200
	);

	document.querySelector("#editor img").forEach(function (_this, i) {
		if (!_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
			_this.getAttribute("src", "//s3.amazonaws.com/jigyaasa_content_static/" + _this.getAttribute("src"));
		}
	});
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("WebAuthoring", slots, []);
	let { xml } = $$props;
	let { getChildXml } = $$props;
	let { toggleMode } = $$props;
	let { isReview } = $$props;
	let { showAns } = $$props;
	let isPreview = 0;
	let defaultStartXml = "<smxml type=\"22\" addhtml=\"0\" name=\"Web\">";
	let isCaption = "";
	let isAutograde = "";
	let themeUrl = window.baseThemeURL || window.baseUrlTheme;
	let mode = document.querySelector(".switch-input.switch-input");
	let htmlEditor;
	let cssEditor;
	let jsEditor;
	let showHTML = 1;
	let readHTML = 1;
	let showCSS = 1;
	let readCSS = 1;
	let showJS = 1;
	let readJS = 1;
	let state = {};
	let disabled_hide = ["Editable", "Hidden", "Disabled"];

	let stateData = writable({
		xml: "",
		uxml: "",
		module: "",
		toggle: false,
		snackback: false,
		lang_type: "php",
		xmlArr: [],
		remediationToggle: false,
		// used for check or uncheck the 'Dark Theme' checkbox
		goDark: window.sessionStorage.goDark && window.sessionStorage.goDark == "true"
		? true
		: false
	});

	let unsubscribe = stateData.subscribe(items => {
		$$invalidate(0, state = items);
	});

	function changeTheme() {
		console.log("chacking theme");
		let check = document.querySelector("#goDark").checked;
		$$invalidate(0, state.goDark = check, state);

		stateData.update(item => {
			item.goDark = check;
			return item;
		});

		window.sessionStorage.goDark = check;

		if (check) {
			htmlEditor && htmlEditor.setOption("theme", "monokai");
			cssEditor && cssEditor.setOption("theme", "monokai");
			jsEditor && jsEditor.setOption("theme", "monokai");
		} else {
			htmlEditor && htmlEditor.setOption("theme", "default");
			cssEditor && cssEditor.setOption("theme", "default");
			jsEditor && jsEditor.setOption("theme", "default");
		}
	}

	// used for update the xml and returns updated xml
	function generateXml(isFormatted) {
		// used for contain the updated xml
		let aXml = "";

		// contains the value of caption field
		if (document.querySelector("#launch_caption") != null) isCaption = AH.select("#launch_caption").value;

		if (isCaption) {
			// sets the caption field value in 'launch_caption' attribute of 'smxml' tag
			defaultStartXml = `<smxml type="22" addhtml="0" name="Web" launch_caption="${isCaption}">`;
		}

		// contains the all editors value, all answer matching cases defined in Autograde dialog box and status of the editors as hidden, disabled or Editable 
		aXml = defaultStartXml + testCasesXml() + `\n<web libs="" files=",," ${handleDisable()}>\n<![CDATA[\n${getCode()}\n]]>\n</web>\n</SMXML>`;

		// this block will not execute as argument is not passed from any where at the time of function calling 
		if (isFormatted === true) {
			return aXml;
		}

		// updates the xml
		getChildXml(aXml);

		// returns the updated xml
		return aXml;
	}

	// used for show the output of written code
	function runCode() {
		//jQuery('html, body').animate({ scrollTop: jQuery('#result_div').offset().top }, 'slow'); // replaced
		window.scroll({ top: 500, behavior: "smooth" });

		// creates the date object
		let date = new Date();

		// gets the time in milliseconds
		date = date.getTime();

		// sets the iframe inside the result field 
		//   jQuery('#result_div').html('<iframe class="result_frame w-100 border-0" style="height:344px" id="uC' + date + '"></iframe>');
		AH.selectAll("#result_div", "html", "<iframe class=\"result_frame w-100 border-0\" style=\"height:344px\" id=\"uC" + date + "\"></iframe>");

		// contains the combined data of html, css and js after wrapping the css editor value in style tag and js editor value in script tag
		let source = prepareSource();

		// selects the iframe element
		let iframe = AH.select("#uC" + date);

		//  returns the Document object generated by a frame or iframe element. Allow to access the Document object that belongs to a frame or iframe element
		let iframe_doc = iframe.contentDocument;

		// opens a new browser window, or a new tab, depending on browser settings and the parameter values
		iframe_doc.open();

		// writes the combiled html, css and js data in iframe after wrapping css data in style tag and js data in script tag
		iframe_doc.write(source);

		// closes the current window
		iframe_doc.close();
	}

	function enableAutograde(e) {
		if (e.target.checked) {
			isAutograde = "active=\"1\"";

			AH.selectAll("#test_case_text, #occurence_text, #exscript_text").forEach(_elm => {
				_elm.disabled = false;
			});
		} else {
			isAutograde = "";

			AH.selectAll("#test_case_text, #occurence_text, #exscript_text").forEach(_elm => {
				_elm.disabled = true;
			});
		}

		// used for update the xml and returns updated xml
		generateXml();
	}

	beforeUpdate(() => {
		// if(!is_visible) {
		//     createLink('pe-items/svelte_items/clsSMWeb/libs/codemirror.min.css');
		//     createLink('pe-items/svelte_items/clsSMWeb/libs/monokai.css');
		//     createLink('pe-items/svelte_items/clsSMWeb/libs/simplescrollbars.css');
		//     createLink('pe-items/svelte_items/clsSMWeb/libs/webitem.min.css');
		//     is_visible = 1;
		// }
		// contains the xml
		$$invalidate(5, xml = xml ? xml : state.xml);

		if (toggleMode) {
			// defined in 'Web.js' it loads Preview or Authoring component according to the value of this variable but in this file it is not in use
			isPreview = 0;
		}
	});

	// afterUpdate(()=>{
	//     document.querySelectorAll('.CodeMirror').forEach(function(el,i){ el.CodeMirror.refresh(); });
	// })
	// called once throught the program execution just after render method
	onMount(() => {
		AH.enableBsAll("[data-bs-toggle='tooltip']", "Tooltip", { container: "body" });

		AH.bind(".modal", "show.bs.modal", () => {
			setTimeout(
				function () {
					if (AH.select("#disable_modal", "visible").length > 0) {
						AH.select("#html_disable").focus();
					} else {
						AH.select("#close_dialog_btn").focus();
					}
				},
				500
			);
		});

		AH.listen(document, "keydown", "body", (_this, event) => {
			if (event.ctrlkey && event.altkey && (event.which == 85 || event.keyCode == 85)) {
				if (AH.select("#disable_modal", "visible").length > 0) {
					AH.selectAll("#html_disable").focus();
				} else {
					AH.selectAll("#close_dialog_btn").focus();
				}
			}
		});

		AH.listen(document, "click", "#grade_accordion .card", (_this, event) => {
			let card_len = document.getElementsByClassName("card");

			for (let i = 0; i < card_len.length; i++) {
				AH.select(card_len[i], "css", { border: "none" });
			}

			AH.select(_this, "css", { border: "1px solid #000" });
		});

		// for remove the border from card element if focus is on checkbox, close button and on textarea
		// jQuery(document).on('focus', '#autograde_cb, #close_dialog_btn, #done_grading_btn', function () {
		//     jQuery('.card').css('border', 'none');
		// });  // Replaced
		AH.listen(document, "click", "#autograde_cb, #close_dialog_btn, #done_grading_btn", () => {
			let card_len = document.getElementsByClassName("card");

			for (let i = 0; i < card_len.length; i++) {
				AH.select(card_len[i], "css", { border: "none" });
			}
		});

		// used for show the tooltip
		//AH.enableBsAll("[data-toggle='tooltip']", 'Tooltip');
		AH.select("#preview", "hide");

		// setTimeout(function () {
		if (typeof CodeMirror == "function") {
			// initialize the html, css and js editor if the type of 'CodeMirror' is function
			renderCodeMirror();

			parseXML();
		} else {
			//jQuery(function () {
			AI.ajax({
				type: "GET",
				url: themeUrl + "src/libs/codemirror.js",
				dataType: "script"
			}).then(function (data) {
				//  AI.activate(0);
				let sc = document.createElement("script");

				// sets the data received from 'codemirror.js' file inside the script tag
				sc.innerHTML = data;

				// appends this created script tag in body element of the document
				document.body.appendChild(sc);

				// initialize the html, css and js editor
				renderCodeMirror(); //Fixed with codemirror

				parseXML();
			});
		} //   })

		AI.ajax({
			type: "GET",
			url: themeUrl + "src/libs/split.js",
			async: true,
			dataType: "script"
		}).then(data => {
			AH.activate(0);

			if (document.querySelector("#splitterWeb")) {
				// sets the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
				splitter();

				// returns from the function to prevent from re-appened the code if it was already defined
				return true;
			}

			// creates script element
			let sc = document.createElement("script");

			// defines the 'id' of the created script tag
			sc.id = "splitterWeb";

			// sets the data received from 'splitter.js' file inside the script tag
			sc.innerHTML = data;

			// appends this created script tag in body element of the document
			document.body.appendChild(sc);

			// sets the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
			splitter();
		});

		// }, 200);
		// setTimeout(()=> {
		// for manage the extra white space between last editor splitter
		// jQuery('#authoringDiv').css({ 'width': '99%', 'margin-left': '7px' }); // Replace
		AH.select("#authoringDiv", "css", { marginLeft: "7px", width: "99%" });
	}); // }, 1300);

	// used for set the position, number of pixel where splitter bar can't be move on the edge, and orientation of the splitter bar
	function splitter() {
		// in case when js editor is visible and either html or css or both editor visible
		if (showJS && (showHTML || showCSS)) {
			// it is used to styled the splitter bar that exists on the left edge of the js editor
			// let splitter1 = jQuery('#top_content').height(394).split({
			//     // Add a vertical splitter bar
			//     orientation: 'vertical',
			//     // Specify how many pixels where you can't move the splitter bar on the edge
			//     limit: 160,
			//     // Set the position of the splitter bar
			//     position: '68%'
			// });
			let splitter1 = Split(["#top_content"], { sizes: [50], direction: "vertical" });
		}

		// in case when html and css both editor is visible
		if (showHTML && showCSS) {
			// it is used to styled the splitter bar that exists on the left edge of the css editor
			// let splitter2 = jQuery('#firstEditorDiv').height(394).split({
			//     // Add a vertical splitter bar
			//     orientation: 'vertical',
			//     // Specify how many pixels where you can't move the splitter bar on the edge
			//     limit: 80,
			//     // Set the position of the splitter bar
			//     position: '50%'
			// });
			let splitter2 = Split(["#firstEditorDiv"], { sizes: [100], direction: "vertical" }); //direction: "vertical",

			Split(["#html_panel", "#css_panel", "#js_panel"], { sizes: [50, 50, 50] });
		}

		// in case when only one editor visible
		if (showHTML + showCSS + showJS == 1) {
			// it is used to styled the splitter bar that exists on the left edge of the result editor
			// let splitter3 = jQuery('#wrap').height(394).split({
			//     // Add a vertical splitter bar
			//     orientation: 'vertical',
			//     // Specify how many pixels where you can't move the splitter bar on the edge
			//     limit: 80,
			//     // Set the position of the splitter bar
			//     position: '60%'
			// });
			// let Splitter3 = Split(['#wrap'],{
			//     minSize: [60],
			//     direction: "vertical",
			// })
			let Splitter3 = Split(["#wrap"], { sizes: [100], direction: "vertical" }); //direction: "vertical",
		}
	}

	// used to create the xml of autograding conditions defined in 'Autograde' dialog box
	function testCasesXml() {
		if (!isAutograde) {
			// returns blank value if value of variable 'isAutograde' is blank 
			return "";
		}

		// contains the value of 'Testcases' field of 'Autograde' modal box
		let test_cases = document.querySelector("#test_case_text").value;

		// contains the value of 'Internal Script' field of 'Autograde' modal box
		let internal_cases = document.querySelector("#occurence_text").value;

		// contains the value of 'External Script' field of 'Autograde' modal box
		let external_case = document.querySelector("#exscript_text").value;

		// defines that the value of 'Testcases' field of 'Autograde' modal box is blank
		let flag_test = 0;

		// defines that the value of 'Internal Script' field of 'Autograde' modal box is blank
		let flag_internal = 0;

		// defines that the value of 'External Script' field of 'Autograde' modal box is blank
		let flag_external = 0;

		if (test_cases) {
			// defines that the value of 'External Script' field of 'Autograde' modal box is not blank
			flag_test = 1;

			// wraps the each defined conditions value of 'Testcases' field separated by semicolon (;) of 'Autograde' modal box in 'case' tag
			test_cases = "<case>" + test_cases.split(";").join("</case><case>") + "</case>";

			test_cases = "\n<autograde type=\"testcase\">" + test_cases + "</autograde>";
		}

		if (internal_cases) {
			flag_internal = 1;
			internal_cases = "<case>" + internal_cases.split(";").join("</case><case>") + "</case>";
			internal_cases = "\n<autograde type=\"internal\">" + internal_cases + "</autograde>";
		}

		if (external_case) {
			// defines that the value of 'External Script' field of 'Autograde' modal box is not blank
			flag_external = 1;

			external_case = "\n<autograde type=\"custom\">" + external_case + "</autograde>";
		}

		let testStr = "<webautograde active=\"1\" testcase=\"" + flag_test + "\" internal=\"" + flag_internal + "\" custom=\"" + flag_external + "\">" + test_cases + internal_cases + external_case + "\n</webautograde>";

		// returns the value of variable 'testStr'
		return testStr;
	}

	function newSource() {
		let htmlData = htmlEditor.getValue();
		let video_and_audio_data = ["mp4", "ogg", "webm", "mp3", "wav"];
		let img_data = ["gif", "tif", "png", "jpg"];

		htmlData = htmlData.replace(/src[ ]*=[ ]*['"](.*?)['"]/gm, function (fullMatch, src) {
			if (src) {
				for (let i = 0; i < video_and_audio_data.length; i++) {
					if (src.indexOf(video_and_audio_data[i]) > -1) {
						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_stream/" + src);
					}
				}

				for (let i = 0; i < img_data.length; i++) {
					if (src.indexOf(img_data[i]) > -1) {
						return fullMatch.replace(src, "https://s3.amazonaws.com/jigyaasa_content_static/" + src);
					}
				}
			}
		});

		return htmlData;
	}

	function getCode() {
		try {
			let htmlData = htmlEditor.getValue();
			let cssData = cssEditor.getValue();
			let jsData = jsEditor.getValue();
			let fullData = "<tag>" + htmlData + "</tag>\n<css>" + cssData + "</css>\n<js>" + jsData + "</js>";

			// returns the string stored in variable 'fullData'
			return fullData;
		} catch(e) {
			// returns blank value when any error occurred
			return "";
		}
	}

	function prepareSource() {
		try {
			let htmlData = htmlEditor.getValue();
			let cssData = cssEditor.getValue();
			let jsData = jsEditor.getValue();
			htmlData = newSource();
			cssData = cssData.replace(/url\(['"](.*?)['"]\)/g, "url('https://s3.amazonaws.com/jigyaasa_content_static/$1')");
			jsData = jsData.replace(/src.*?["'](.*?)["']/gi, "src = 'https://s3.amazonaws.com/jigyaasa_content_static/$1'");

			/// Need to fix
			let fullData = htmlData + "<style>" + cssData + "</style><script>" + jsData + "</script>";

			// returns the data after combining html, css and js data
			return fullData;
		} catch(e) {
			return "";
		}
	}

	function renderCodeMirror() {
		if (AI.get("renderCodeMirror")) {
			return true;
		}

		cssEditor = CodeMirror.fromTextArea(document.getElementById("css_editor"), {
			lineNumbers: true,
			mode: "css",
			styleActiveLine: true,
			autoCloseBrackets: true,
			lineWrapping: true,
			scrollbarStyle: "simple",
			matchBrackets: true,
			gutters: ["CodeMirror-linenumbers", "breakpoints"]
		});

		// initialize the html editor
		htmlEditor = CodeMirror.fromTextArea(document.getElementById("html_editor"), {
			lineNumbers: true,
			mode: "text/html",
			styleActiveLine: true,
			autoCloseBrackets: true,
			lineWrapping: true,
			scrollbarStyle: "simple",
			matchBrackets: true,
			gutters: ["CodeMirror-linenumbers", "breakpoints"]
		});

		// initialize the js editor
		jsEditor = CodeMirror.fromTextArea(document.getElementById("js_editor"), {
			lineNumbers: true,
			mode: "text/javascript",
			styleActiveLine: true,
			autoCloseBrackets: true,
			lineWrapping: true,
			scrollbarStyle: "simple",
			matchBrackets: true,
			gutters: ["CodeMirror-linenumbers", "breakpoints"]
		});

		if (typeof htmlEditor == "object" && !isReview) {
			htmlEditor.on("change", function () {
				generateXml();
			});
		}

		if (typeof cssEditor == "object" && !isReview) {
			cssEditor.on("change", function () {
				generateXml();
			});
		} // AI.listen(cssEditor,'change',function(){
		//     generateXml();

		// })
		if (typeof jsEditor == "object" && !isReview) {
			jsEditor.on("change", function () {
				generateXml();
			});
		} // AI.listen(cssEditor,'change',function(){
		//     generateXml();

		// })
		htmlEditor.setOption("extraKeys", {
			// Changing Tabs into 4 spaces  
			Tab(cm) {
				let spaces = Array(cm.getOption("indentUnit") + 3).join(" ");
				cm.replaceSelection(spaces);
			},
			F11(cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			Esc(cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		});

		// calls for set the editors value if it was defined 
		parseXML();

		// defines that editor is initialized
		AI.set("renderCodeMirror", true);
	}

	// makes blank the value of user answer xml and also of html,css and js editors
	function reset() {
		// makes blank the value of html editor
		htmlEditor.setValue("");

		// makes blank the value of css editor
		cssEditor.setValue("");

		// makes blank the value of js editor
		jsEditor.setValue("");

		// makes blank value of user answer xml
		//jQuery("#special_module_user_xml").val(""); // Replaced
		document.getElementById("special_module_user_xml").value = "";

		// makes blank the value of 'uaXML' of window object
		window.uaXML = "";
	}

	function parseXML() {
		let htmlData = stringBetween$1(xml, "tag");
		if (htmlData != null) htmlEditor.setValue(htmlData ? htmlData.trim() : "");
		let cssData = stringBetween$1(xml, "css");
		if (cssData != null) cssEditor.setValue(cssData ? cssData.trim() : "");
		let jsData = stringBetween$1(xml, "js");
		if (jsData != null) jsEditor.setValue(jsData ? jsData.trim() : "");
		let disableData = findAttribute$1(xml, "disable", "web");
		let html_disable = document.querySelector("#html_disable");
		let css_disable = document.querySelector("#css_disable");
		let js_disable = document.querySelector("#js_disable");

		if ((/html/g).test(disableData)) {
			html_disable.value = 1;
		}

		if ((/js/g).test(disableData)) {
			js_disable.value = 1;
		}

		if ((/css/g).test(disableData)) {
			// sets value '1' of 'CSS' field to show 'Disabled' option seleced of CSS field in 'Disable/Hide' dialog box
			css_disable.value = 1;
		}

		// contains the caption field value
		let caption = findAttribute$1(xml, "launch_caption", "smxml");

		// sets the caption field value
		AH.select("#launch_caption", "value", caption);

		// contains the 'hide' attribute value of 'web' tag of xml
		let hideData = findAttribute$1(xml, "hide", "web");

		// if hide attribute value exist then it contains that value otherwise contains value ",,"
		hideData = hideData ? hideData : ",,";

		// creates and array containing the value of variable 'hideData' by spliting it comma (,)
		hideData = hideData.split(",");

		if (parseInt(hideData[0]) == 0) {
			// sets value '0' of 'HTML' field to show 'Hidden' option seleced of CSS field in 'Disable/Hide' dialog box
			html_disable.value = 0;
		}

		if (parseInt(hideData[1]) == 0) {
			// sets value '0' of 'CSS' field to show 'Hidden' option seleced of CSS field in 'Disable/Hide' dialog box
			css_disable.value = 0;
		}

		if (parseInt(hideData[2]) == 0) {
			// sets value '0' of 'JS' field to show 'Hidden' option seleced of JS field in 'Disable/Hide' dialog box
			js_disable.value = 0;
		}

		let test_cases = stringBetween$1(xml, "<autograde type=\"testcase\">", "</autograde>");
		let internal_cases = stringBetween$1(xml, "<autograde type=\"internal\">", "</autograde>");
		let external_cases = stringBetween$1(xml, "<autograde type=\"custom\">", "</autograde>");
		test_cases = test_cases ? getCase(test_cases) : "";
		internal_cases = internal_cases ? getCase(internal_cases) : "";

		external_cases = external_cases
		? external_cases.replace(/<\/case>|<case>/g, "")
		: "";

		if (document.querySelector("#test_case_text")) {
			document.querySelector("#test_case_text").value = test_cases;
			document.querySelector("#occurence_text").value = internal_cases;
			document.querySelector("#exscript_text").value = external_cases.replace(/<\/case>|<case>/g, "");
		}

		if (test_cases || internal_cases || external_cases) {
			// sets the value 1 of variable 'isAutograde'
			isAutograde = 1;

			// enables 'Testcases' field of 'Autograde' dialog box
			document.querySelector("#test_case_text").disabled = false;

			// enables 'Internal Script' field of 'Autograde' dialog box
			document.querySelector("#occurence_text").disabled = false;

			// enables 'External Script' field of 'Autograde' dialog box
			document.querySelector("#exscript_text").disabled = false;

			// checked the 'Autograde' checkbox
			document.querySelector("#autograde_cb").checked = true;
		}

		// sets the theme of html, css and js editors according to the checked status of 'Dark Theme' checkbox
		changeTheme();
	}

	const writable_props = ["xml", "getChildXml", "toggleMode", "isReview", "showAns"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<WebAuthoring> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
		if ("getChildXml" in $$props) $$invalidate(6, getChildXml = $$props.getChildXml);
		if ("toggleMode" in $$props) $$invalidate(7, toggleMode = $$props.toggleMode);
		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(9, showAns = $$props.showAns);
	};

	$$self.$capture_state = () => ({
		l: language,
		onMount,
		beforeUpdate,
		Checkbox,
		writable,
		AH,
		xml,
		getChildXml,
		toggleMode,
		isReview,
		showAns,
		isPreview,
		defaultStartXml,
		isCaption,
		isAutograde,
		themeUrl,
		mode,
		htmlEditor,
		cssEditor,
		jsEditor,
		showHTML,
		readHTML,
		showCSS,
		readCSS,
		showJS,
		readJS,
		state,
		disabled_hide,
		stateData,
		unsubscribe,
		changeTheme,
		generateXml,
		runCode,
		enableAutograde,
		handleDisable,
		splitter,
		testCasesXml,
		newSource,
		getCode,
		prepareSource,
		renderCodeMirror,
		stringBetween: stringBetween$1,
		findAttribute: findAttribute$1,
		getCase,
		unRenderPlayer: unRenderPlayer$1,
		renderPlayer,
		reset,
		parseXML
	});

	$$self.$inject_state = $$props => {
		if ("xml" in $$props) $$invalidate(5, xml = $$props.xml);
		if ("getChildXml" in $$props) $$invalidate(6, getChildXml = $$props.getChildXml);
		if ("toggleMode" in $$props) $$invalidate(7, toggleMode = $$props.toggleMode);
		if ("isReview" in $$props) $$invalidate(8, isReview = $$props.isReview);
		if ("showAns" in $$props) $$invalidate(9, showAns = $$props.showAns);
		if ("isPreview" in $$props) isPreview = $$props.isPreview;
		if ("defaultStartXml" in $$props) defaultStartXml = $$props.defaultStartXml;
		if ("isCaption" in $$props) isCaption = $$props.isCaption;
		if ("isAutograde" in $$props) isAutograde = $$props.isAutograde;
		if ("themeUrl" in $$props) themeUrl = $$props.themeUrl;
		if ("mode" in $$props) mode = $$props.mode;
		if ("htmlEditor" in $$props) htmlEditor = $$props.htmlEditor;
		if ("cssEditor" in $$props) cssEditor = $$props.cssEditor;
		if ("jsEditor" in $$props) jsEditor = $$props.jsEditor;
		if ("showHTML" in $$props) showHTML = $$props.showHTML;
		if ("readHTML" in $$props) readHTML = $$props.readHTML;
		if ("showCSS" in $$props) showCSS = $$props.showCSS;
		if ("readCSS" in $$props) readCSS = $$props.readCSS;
		if ("showJS" in $$props) showJS = $$props.showJS;
		if ("readJS" in $$props) readJS = $$props.readJS;
		if ("state" in $$props) $$invalidate(0, state = $$props.state);
		if ("disabled_hide" in $$props) disabled_hide = $$props.disabled_hide;
		if ("stateData" in $$props) stateData = $$props.stateData;
		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		state,
		changeTheme,
		generateXml,
		runCode,
		enableAutograde,
		xml,
		getChildXml,
		toggleMode,
		isReview,
		showAns
	];
}

class WebAuthoring extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(
			this,
			options,
			instance$1,
			create_fragment$1,
			safe_not_equal,
			{
				xml: 5,
				getChildXml: 6,
				toggleMode: 7,
				isReview: 8,
				showAns: 9
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "WebAuthoring",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[5] === undefined && !("xml" in props)) {
			console_1$1.warn("<WebAuthoring> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[6] === undefined && !("getChildXml" in props)) {
			console_1$1.warn("<WebAuthoring> was created without expected prop 'getChildXml'");
		}

		if (/*toggleMode*/ ctx[7] === undefined && !("toggleMode" in props)) {
			console_1$1.warn("<WebAuthoring> was created without expected prop 'toggleMode'");
		}

		if (/*isReview*/ ctx[8] === undefined && !("isReview" in props)) {
			console_1$1.warn("<WebAuthoring> was created without expected prop 'isReview'");
		}

		if (/*showAns*/ ctx[9] === undefined && !("showAns" in props)) {
			console_1$1.warn("<WebAuthoring> was created without expected prop 'showAns'");
		}
	}

	get xml() {
		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggleMode() {
		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggleMode(value) {
		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<WebAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<WebAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

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
    check_net_update_ids: 'Something went wrong. Please check your network connection and update the IDs again.'
};

/* clsSMWeb\Web.svelte generated by Svelte v3.29.0 */

const { console: console_1$2 } = globals;
const file$2 = "clsSMWeb\\Web.svelte";

// (227:40) 
function create_if_block_2(ctx) {
	let webauthoring;
	let current;

	webauthoring = new WebAuthoring({
			props: {
				key: "2",
				xml: /*xml*/ ctx[0],
				toggleMode: /*toggleMode*/ ctx[3],
				getChildXml: /*getChildXml*/ ctx[4],
				showAns: /*showAns*/ ctx[5],
				editorState: /*editorState*/ ctx[2],
				isReview: /*isReview*/ ctx[6]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(webauthoring.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(webauthoring, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const webauthoring_changes = {};
			if (dirty & /*xml*/ 1) webauthoring_changes.xml = /*xml*/ ctx[0];
			if (dirty & /*toggleMode*/ 8) webauthoring_changes.toggleMode = /*toggleMode*/ ctx[3];
			if (dirty & /*getChildXml*/ 16) webauthoring_changes.getChildXml = /*getChildXml*/ ctx[4];
			if (dirty & /*showAns*/ 32) webauthoring_changes.showAns = /*showAns*/ ctx[5];
			if (dirty & /*editorState*/ 4) webauthoring_changes.editorState = /*editorState*/ ctx[2];
			if (dirty & /*isReview*/ 64) webauthoring_changes.isReview = /*isReview*/ ctx[6];
			webauthoring.$set(webauthoring_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(webauthoring.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(webauthoring.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(webauthoring, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(227:40) ",
		ctx
	});

	return block;
}

// (219:40) 
function create_if_block_1$1(ctx) {
	let webpreview;
	let current;

	webpreview = new WebPreview({
			props: {
				key: "1",
				xml: /*xml*/ ctx[0],
				inQuizPlayer: /*editorState*/ ctx[2] ? 0 : 1,
				editorState: /*editorState*/ ctx[2],
				uaXML: /*uaXML*/ ctx[1]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(webpreview.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(webpreview, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const webpreview_changes = {};
			if (dirty & /*xml*/ 1) webpreview_changes.xml = /*xml*/ ctx[0];
			if (dirty & /*editorState*/ 4) webpreview_changes.inQuizPlayer = /*editorState*/ ctx[2] ? 0 : 1;
			if (dirty & /*editorState*/ 4) webpreview_changes.editorState = /*editorState*/ ctx[2];
			if (dirty & /*uaXML*/ 2) webpreview_changes.uaXML = /*uaXML*/ ctx[1];
			webpreview.$set(webpreview_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(webpreview.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(webpreview.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(webpreview, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(219:40) ",
		ctx
	});

	return block;
}

// (217:2) {#if state.currentComponent == 2}
function create_if_block$1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("Loading...");
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(217:2) {#if state.currentComponent == 2}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let main;
	let div;
	let current_block_type_index;
	let if_block;
	let current;
	const if_block_creators = [create_if_block$1, create_if_block_1$1, create_if_block_2];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*state*/ ctx[7].currentComponent == 2) return 0;
		if (/*state*/ ctx[7].currentComponent == 1) return 1;
		if (/*state*/ ctx[7].currentComponent == 0) return 2;
		return -1;
	}

	if (~(current_block_type_index = select_block_type(ctx))) {
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
	}

	const block = {
		c: function create() {
			main = element("main");
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(div, "id", "webModule");
			add_location(div, file$2, 215, 1, 9493);
			add_location(main, file$2, 214, 0, 9484);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
			let previous_block_index = current_block_type_index;
			current_block_type_index = select_block_type(ctx);

			if (current_block_type_index === previous_block_index) {
				if (~current_block_type_index) {
					if_blocks[current_block_type_index].p(ctx, dirty);
				}
			} else {
				if (if_block) {
					group_outros();

					transition_out(if_blocks[previous_block_index], 1, 1, () => {
						if_blocks[previous_block_index] = null;
					});

					check_outros();
				}

				if (~current_block_type_index) {
					if_block = if_blocks[current_block_type_index];

					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					}

					transition_in(if_block, 1);
					if_block.m(div, null);
				} else {
					if_block = null;
				}
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
			if (detaching) detach_dev(main);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}
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
	validate_slots("Web", slots, []);
	let { xml } = $$props;
	let { uaXML } = $$props;
	let { inEditor } = $$props;
	let { editorState } = $$props;
	let { toggleMode } = $$props;
	let { getChildXml } = $$props;
	let { showAns } = $$props;
	let { setInlineEditor } = $$props;
	let { isReview } = $$props;
	let isPreview = 0;
	let state = {};

	let DataState = writable({
		currentComponent: 2,
		titleData: "",
		stemData: "",
		remediationData: "",
		toggle: toggleMode
	});

	let unsubscribe = DataState.subscribe(items => {
		$$invalidate(7, state = items);
	});

	// called every time when any props or state gets changed and update the xml
	beforeUpdate(() => {
		if (editorState) {
			// contains the xml
			//window.QXML = xml;
			if (toggleMode != state.toggle) {
				console.log({ toggleMode });
				$$invalidate(7, state.toggle = toggleMode, state);

				if (toggleMode == true) {
					AI.set("renderCodeMirror", false);

					// assign the value '1' to variable 'isPreview' to load the 'WebPreview' conponent
					isPreview = 1;

					renderPlayer();

					// sets the content 'Preview' of header title that can be seen on the top of the 'Title' label
					AH.select("#headerTitle", "html", Lang.preview);

					// shows the label 'Check Answer' in inline way
					AH.select("#answerCheck", "css", {
						visibility: "visible",
						display: "inline-block"
					});

					// used for show the tooltip
					AH.enableBsAll("[data-toggle=\"tooltip\"]", "Tooltip");

					// contains the 'Title' field value of 'Authoring' area // Replaced
					let titleData = AH.select("#title").innerHTML;

					// contains the 'Stem' field value of 'Authoring' area // Replaced
					let stemData = AH.select("#stem").innerHTML;

					// contains the 'Remediation' field value of 'Authoring' area
					let remediationData = AH.select("#remediation").innerHTML;

					// stes the value of state 'titleData' with value of 'Title' field of 'Authoring' area
					$$invalidate(7, state.titleData = titleData, state);

					// stes the value of state 'stemData' with value of 'Stem' field of 'Authoring' area
					$$invalidate(7, state.stemData = stemData, state);

					// stes the value of state 'remediationData' with value of 'Remediation' field of 'Authoring' area
					$$invalidate(7, state.remediationData = remediationData, state);

					// hides the 'Title' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'titleShow' and text stored in variable 'titleData'
					//jQuery('#title').empty().hide().after('<div id="tilteShow">' + titleData + '</div>');  // Replaced
					AH.empty("#title");

					AH.select("#title", "hide");
					AH.select("#title", "html", `<div id="tilteShow">${titleData}</div>`);

					// hides the 'Stem' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'stemShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'stemData'
					//	jQuery('#stem').empty().hide().after('<div id="stemShow">' + get_ucsyntax(stemData) + '</div>'); // Replaced
					AH.empty("#stem");

					AH.select("#stem", "hide");
					AH.select("#stem", "html", `<div id="stemShow">${get_ucsyntax(stemData)}</div>`);

					// hides the 'Remediation' field of 'Authoring' area after making it empty and after it adds element 'div' with id 'remediationShow' and text returned by method 'get_ucsyntax' by passing the argument as value of variable 'remediationData'
					//jQuery('#remediation').hide().empty().after('<div id="remediationShow">' + get_ucsyntax(remediationData) + '</div>'); Replaced
					AH.empty("#remediation");

					AH.select("#remediation", "hide");
					AH.select("#remediation", "html", `<div id="remediationShow">${get_ucsyntax(remediationData)}</div>`);
					AH.selectAll("#externalInputs, #authoringActions, #addTestCase", "hide");

					// loads preview component
					$$invalidate(7, state.currentComponent = 1, state); //<WebPreview xml={xml} inQuizPlayer={0} key={1} />;
				} else {
					// sets the value of variable isPreview 0 that means loads the authoring component
					isPreview = 0;

					// makes user answer value blank
					//window.uaXML = '';
					// hidess the label 'Check Answer'
					AH.select("#answerCheck", "css", { visibility: "hidden", display: "none" });

					// sets the content 'Authoring' of header title that can be seen on the top of the 'Title' label
					AH.select("#headerTitle", "html", Lang.authoring);

					// removes the form element from 'Authoring area
					AH.find("#authoringArea", "form", { action: "remove" });

					// append the html 'stored' in variable 'windowHtml' in authoring area
					//jQuery('#authoringArea').append(windowHtml);
					// removes the element that was added on preview area at the place of 'Title', 'Stem' and 'Remediation' field
					AH.selectAll("#tilteShow, #stemShow, #remediationShow", "remove");

					// sets the content of the 'Title' field of Authoring area
					AH.select("#title", "html", state.titleData);

					// sets the content of the 'Stem' field of Authoring area
					AH.select("#stem", "html", state.stemData);

					// sets the content of the 'Remediation' field of Authoring area
					AH.select("#remediation", "html", state.remediationData);

					AH.selectAll("#title, #stem, #remediation, #externalInputs, #authoringActions, #addTestCase", "show", "block"); // Replaced;
					unRenderPlayer();

					// loads authoring component
					$$invalidate(7, state.currentComponent = 0, state);

					// stes the value '0' of margin-bottom of 'ol' tag that exist in 'Authoring' area
					//jQuery("#authoringSection ol").attr("style","margin-bottom:0!important");
					//AH.select('#authoringSection ol').setAttribute("style","margin-bottom:0!important");
					try {
						// removes the id of all elements that comes under 'Stem' label and un-initialize the tinymce editor
						setInlineEditor("#stem");

						// removes the id of all elements that comes under Remediation' label and un-initialize the tinymce editor
						setInlineEditor("#remediation");
					} catch(e) {
						console.log(e);
					}
				}
			}
		} else {
			getComp();
		}
	});

	// called once throughtout the program execution just after render method
	onMount(async () => {
		await tick();

		if (editorState) {
			//AI.set('web',this);
			getComp();

			// logs the message on console if module loaded in editor
			console.log("Web in editormode");
		} else {
			AH.listen(document, "mouseover", "#webModule", () => {
				if (isHover == 0) {
					isHover = 1;

					//state.currentComponent = "<h1>uCertify</h1>";
					$$invalidate(7, state.currentComponent = 1, state);
				}
			});

			// sets the value of state 'currentComponent' and loads 'WebPreview' component by setting the value of property 'inQuizPlayer' as '1' and property 'key' as '2'
			$$invalidate(7, state.currentComponent = 1, state); //<WebPreview xml={window.QXML} inQuizPlayer={1} key={2} />;
		}

		await tick();
	});

	function getComp() {
		if (editorState) {
			// in case of Editor loads preview or authoring component according to the value of variable 'isPreview'
			setTimeout(
				() => {
					$$invalidate(7, state.currentComponent = isPreview == 1 ? 1 : 0, state);
				},
				1000
			);
		} else {
			// render preview component in case other than Editor such as book, quiz etc
			$$invalidate(7, state.currentComponent = 1, state); //<WebPreview xml={window.QXML} inQuizPlayer={0} key={1} />; 
		}
	}

	// used for unrender the player tag
	function unRenderPlayer() {
		// makes player tag empty that exist inside element have id: authoringDiv
		//jQuery('#authoringDiv player').empty(); // Replaced 
		AH.empty("#authoringDiv player");

		// removes the class 'hidecontent' from player tag empty that exist inside element have id: authoringDiv
		AH.find("#authoringDiv", "player", {
			action: "removeClass",
			actionData: "hidecontent"
		});

		AH.selectAll("#editor img").forEach(_this => {
			if (!_this.getAttribute("header-logo") && !_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				_this.setAttribute("src", _this.getAttribute("src"));
			}
		});
	}

	// render the player tag
	function renderPlayer() {
		// makes player tag empty that exist inside element have id: authoringDiv
		//jQuery('#authoringDiv player').empty(); // Replaced
		AH.empty("#authoringDiv player");

		// used for set the data of player tag
		//tag_player(AH.select('#authoringDiv')); // Need to fix it
		// adds the class 'hidecontent' to player tag empty that exist inside element have id: authoringDiv
		AH.find("#authoringDiv", "player", {
			action: "addClass",
			actionData: "hidecontent"
		});

		AH.selectAll("#editor img").forEach(_this => {
			if (!_this.getAttribute("header-logo") && !_this.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)) {
				_this.setAttribute("src", "//s3.amazonaws.com/jigyaasa_content_static/" + _this.getAttribute("src"));
			}
		});
	}

	const writable_props = [
		"xml",
		"uaXML",
		"inEditor",
		"editorState",
		"toggleMode",
		"getChildXml",
		"showAns",
		"setInlineEditor",
		"isReview"
	];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Web> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(0, xml = $$props.xml);
		if ("uaXML" in $$props) $$invalidate(1, uaXML = $$props.uaXML);
		if ("inEditor" in $$props) $$invalidate(8, inEditor = $$props.inEditor);
		if ("editorState" in $$props) $$invalidate(2, editorState = $$props.editorState);
		if ("toggleMode" in $$props) $$invalidate(3, toggleMode = $$props.toggleMode);
		if ("getChildXml" in $$props) $$invalidate(4, getChildXml = $$props.getChildXml);
		if ("showAns" in $$props) $$invalidate(5, showAns = $$props.showAns);
		if ("setInlineEditor" in $$props) $$invalidate(9, setInlineEditor = $$props.setInlineEditor);
		if ("isReview" in $$props) $$invalidate(6, isReview = $$props.isReview);
	};

	$$self.$capture_state = () => ({
		WebPreview,
		WebAuthoring,
		l: Lang,
		beforeUpdate,
		onMount,
		tick,
		writable,
		AH,
		xml,
		uaXML,
		inEditor,
		editorState,
		toggleMode,
		getChildXml,
		showAns,
		setInlineEditor,
		isReview,
		isPreview,
		state,
		DataState,
		unsubscribe,
		getComp,
		unRenderPlayer,
		renderPlayer
	});

	$$self.$inject_state = $$props => {
		if ("xml" in $$props) $$invalidate(0, xml = $$props.xml);
		if ("uaXML" in $$props) $$invalidate(1, uaXML = $$props.uaXML);
		if ("inEditor" in $$props) $$invalidate(8, inEditor = $$props.inEditor);
		if ("editorState" in $$props) $$invalidate(2, editorState = $$props.editorState);
		if ("toggleMode" in $$props) $$invalidate(3, toggleMode = $$props.toggleMode);
		if ("getChildXml" in $$props) $$invalidate(4, getChildXml = $$props.getChildXml);
		if ("showAns" in $$props) $$invalidate(5, showAns = $$props.showAns);
		if ("setInlineEditor" in $$props) $$invalidate(9, setInlineEditor = $$props.setInlineEditor);
		if ("isReview" in $$props) $$invalidate(6, isReview = $$props.isReview);
		if ("isPreview" in $$props) isPreview = $$props.isPreview;
		if ("state" in $$props) $$invalidate(7, state = $$props.state);
		if ("DataState" in $$props) DataState = $$props.DataState;
		if ("unsubscribe" in $$props) unsubscribe = $$props.unsubscribe;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		xml,
		uaXML,
		editorState,
		toggleMode,
		getChildXml,
		showAns,
		isReview,
		state,
		inEditor,
		setInlineEditor
	];
}

class Web extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			xml: 0,
			uaXML: 1,
			inEditor: 8,
			editorState: 2,
			toggleMode: 3,
			getChildXml: 4,
			showAns: 5,
			setInlineEditor: 9,
			isReview: 6
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Web",
			options,
			id: create_fragment$2.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[0] === undefined && !("xml" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'xml'");
		}

		if (/*uaXML*/ ctx[1] === undefined && !("uaXML" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'uaXML'");
		}

		if (/*inEditor*/ ctx[8] === undefined && !("inEditor" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'inEditor'");
		}

		if (/*editorState*/ ctx[2] === undefined && !("editorState" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'editorState'");
		}

		if (/*toggleMode*/ ctx[3] === undefined && !("toggleMode" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'toggleMode'");
		}

		if (/*getChildXml*/ ctx[4] === undefined && !("getChildXml" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'getChildXml'");
		}

		if (/*showAns*/ ctx[5] === undefined && !("showAns" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'showAns'");
		}

		if (/*setInlineEditor*/ ctx[9] === undefined && !("setInlineEditor" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'setInlineEditor'");
		}

		if (/*isReview*/ ctx[6] === undefined && !("isReview" in props)) {
			console_1$2.warn("<Web> was created without expected prop 'isReview'");
		}
	}

	get xml() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get uaXML() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uaXML(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get inEditor() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set inEditor(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get toggleMode() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set toggleMode(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get showAns() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set showAns(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get setInlineEditor() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set setInlineEditor(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<Web>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<Web>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default Web;
//# sourceMappingURL=Web-2fa96841.js.map
