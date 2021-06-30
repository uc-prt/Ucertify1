
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { a8 as createCommonjsModule, a9 as commonjsGlobal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, O as Dialog, P as binding_callbacks, Q as bind, v as validate_slots, L as beforeUpdate, o as onMount, A as AH, a7 as afterUpdate, U as Button, aa as Loader, w as writable, y as language, j as attr_dev, k as add_location, n as insert_dev, x as detach_dev, f as space, c as create_component, m as mount_component, q as listen_dev, W as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, l as set_style, B as noop, h as text, G as prop_dev, F as set_data_dev, V as Checkbox, Z as tick, r as group_outros, u as check_outros } from './main-f818ac0f.js';
import './codemirror-7ee317ca.js';

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

/* clsSMWeb/WebPreview.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMWeb/WebPreview.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-1553786-style";
	style.textContent = ".height44{height:44px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViUHJldmlldy5zdmVsdGUiLCJzb3VyY2VzIjpbIldlYlByZXZpZXcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjwhLS1cbiAqICBGaWxlIE5hbWUgICA6IFdlYkF1dGhvcmluZy5zdmVsdGVcbiAqICBEZXNjcmlwdGlvbiA6IFNob3cgdGhlIGVkaXRvcnMgaHRtbCxjc3MgYW5kIGpzXG4gKiAgQXV0aG9yICAgICAgOiBTdW5kYXJhbSBUcmlwYXRoaVxuICogIFBhY2thZ2UgICAgIDogcGUtaXRlbXNcbiAqICBMYXN0IHVwZGF0ZSA6IDAyLUp1bmUtMjAyMVxuICogIExhc3QgVXBkYXRlZCBCeSA6IFByYWRlZXAgWWFkYXZcbi0tPlxuXG48c2NyaXB0PiBcbiAgICBsZXQgdGhlbWVVcmwgPSAod2luZG93LmJhc2VUaGVtZVVSTCkgPyB3aW5kb3cuYmFzZVRoZW1lVVJMOiB3aW5kb3cuYmFzZVVybFRoZW1lO1xuICAgIC8vaW1wb3J0IHtUaXRsZSwgQ29udGVudCwgQWN0aW9ucywgSW5pdGlhbEZvY3VzfSBmcm9tICdAc211aS9kaWFsb2cnO1xuICAgIGltcG9ydCB7IGFmdGVyVXBkYXRlLCBvbk1vdW50LCBiZWZvcmVVcGRhdGUgfSBmcm9tICdzdmVsdGUnO1xuICAgIGltcG9ydCB7IEJ1dHRvbiwgRGlhbG9nIH0gZnJvbSAnc3ZlbHRlLW11aS9zcmMnO1xuICAgIGltcG9ydCBMb2FkZXIgZnJvbSAnLi4vaGVscGVyL0xvYWRlci5zdmVsdGUnO1xuICAgIGltcG9ydCB7d3JpdGFibGV9IGZyb20gJ3N2ZWx0ZS9zdG9yZSc7XG4gICAgLy9pbXBvcnQgbCBmcm9tICcuLi8uLi9saWIvTGFuZyc7XG4gICAgaW1wb3J0IGwgZnJvbSAnLi4vc3JjL2xpYnMvZWRpdG9yTGliL2xhbmd1YWdlLmpzJztcbiAgICBpbXBvcnQgeyBBSCB9IGZyb20gJy4uL2hlbHBlci9IZWxwZXJBSS5zdmVsdGUnO1xuXG4gICAgaW1wb3J0ICcuLi9zcmMvbGlicy9jb2RlbWlycm9yLm1pbi5jc3MnO1xuICAgIGltcG9ydCAnLi4vc3JjL2xpYnMvbW9ub2thaS5jc3MnO1xuICAgIGltcG9ydCAnLi4vc3JjL2xpYnMvc2ltcGxlc2Nyb2xsYmFycy5jc3MnO1xuICAgIGltcG9ydCAnLi4vc3JjL2xpYnMvd2ViaXRlbS5taW4uY3NzJztcblxuICAgIGltcG9ydCAnLi4vc3JjL2xpYnMvY29kZW1pcnJvcic7XG4gICAgaW1wb3J0IFNwbGl0IGZyb20gJy4uL3NyYy9saWJzL3NwbGl0JztcblxuICAgIGV4cG9ydCBsZXQgaW5RdWl6UGxheWVyO1xuICAgIGV4cG9ydCBsZXQgeG1sO1xuICAgIGV4cG9ydCBsZXQgdWFYTUw7XG4gICAgZXhwb3J0IGxldCBpc1JldmlldztcbiAgICB4bWwgPSB1YVhNTCAmJiAhL3NtYW5zL2dpLnRlc3QodWFYTUwpID8gdWFYTUwgOiB4bWw7XG4gICAgbGV0IGlzUHJldmlldyA9IFwiXCI7XG4gICAgLy8gZGVmaW5lcyB0aGF0IGVkaXRvciBpcyBub3QgaW5pdGlhbGl6ZWRcbiAgICBsZXQgcmVuZGVyZWQgPSAwO1xuICAgIC8vIGNvbnRhaW5zIHRoZSB4bWxcbiAgICBcbiAgICBcbiAgICBsZXQgbW9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3dpdGNoLWlucHV0LnN3aXRjaC1pbnB1dFwiKTtcbiAgICBsZXQgaHRtbEVkaXRvcjsgICBcbiAgICBsZXQgY3NzRWRpdG9yOyBcbiAgICBsZXQganNFZGl0b3I7XG4gICAgbGV0IHNob3dIVE1MID0gMTtcbiAgICBsZXQgcmVhZEhUTUwgPSAxO1xuICAgIGxldCBzaG93Q1NTID0gMTtcbiAgICBsZXQgcmVhZENTUyA9IDE7XG4gICAgbGV0IHNob3dKUyA9IDE7XG4gICAgbGV0IHJlYWRKUyA9IDE7XG4gICAgbGV0IHNwbGl0dGVyMSA9ICcnO1xuICAgIGxldCBzcGxpdHRlcjIgPSAnJztcbiAgICBsZXQgc3BsaXR0ZXIzID0gJyc7XG4gICAgbGV0IHVzZXJBbnN3ZXIgPSAnJztcbiAgICBsZXQgaXNPbGRUZXN0Y2FzZSA9IGZhbHNlO1xuICAgIGxldCByZXN1bHRTYXZpbmc7XG4gICAgbGV0IHN0YXRlID0ge307XG4gICAgbGV0IHN0YXRlRGF0YSA9IHdyaXRhYmxlKHtcbiAgICAgICAgeG1sICAgICAgICAgICAgICAgICAgICAgICAgIDogJycsXG4gICAgICAgIHV4bWwgICAgICAgICAgICAgICAgICAgICAgICA6ICcnLFxuICAgICAgICBtb2R1bGUgICAgICAgICAgICAgICAgICAgICAgOiAnJyxcbiAgICAgICAgdG9nZ2xlICAgICAgICAgICAgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgIHNuYWNrYmFjayAgICAgICAgICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICBsYW5nX3R5cGUgICAgICAgICAgICAgICAgICAgOiAncGhwJyxcbiAgICAgICAgeG1sQXJyICAgICAgICAgICAgICAgICAgICAgIDogW10sXG4gICAgICAgIHJlbWVkaWF0aW9uVG9nZ2xlICAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICBxeG1sICAgICAgICAgICAgICAgICAgICAgICAgOiAnJyxcbiAgICAgICAgdGl0bGVEYXRhICAgICAgICAgICAgICAgICAgIDogXCJcIiwgXG4gICAgICAgIHN0ZW1EYXRhICAgICAgICAgICAgICAgICAgICA6IFwiXCIsXG4gICAgICAgIHJlbWVkaWF0aW9uRGF0YSAgICAgICAgICAgICA6IFwiXCIsXG4gICAgICAgIGdvRGFyayAgICAgICAgICAgICAgICAgICAgICA6ICh3aW5kb3cuc2Vzc2lvblN0b3JhZ2UuZ29EYXJrICYmIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nb0RhcmsgPT0gXCJ0cnVlXCIgPyB0cnVlIDogZmFsc2UpXG4gICAgfSk7XG4gICAgICAgIFxuICAgIGxldCB1bnN1YnNjcmliZSA9IHN0YXRlRGF0YS5zdWJzY3JpYmUoKGl0ZW1zKT0+e1xuICAgICAgICBzdGF0ZSA9IGl0ZW1zO1xuICAgIH0pXG5cbiAgICAgICBcbiAgICAvLyBjYWxsZWQgZXZlcnkgdGltZSB3aGVuIGFueSBwcm9wcyBvciBzdGF0ZSBnZXRzIGNoYW5nZWRcbiAgICBiZWZvcmVVcGRhdGUoKCk9PntcbiAgICAgICAgaWYgKHhtbCAhPSBzdGF0ZS54bWwpIHtcbiAgICAgICAgICAgIHN0YXRlLnhtbCA9IHhtbDtcbiAgICAgICAgICAgIGlmIChpc1Jldmlldykge1xuICAgICAgICAgICAgICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjaGVja3MgdGhlIGFuc3dlciBhbmQgbm90IGFsbG93ZWQgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrXG4gICAgICAgICAgICAgICAgICAgIHNldFJldmlldygpO1xuICAgICAgICAgICAgICAgICAgICAvLyBjbGVhciB0aGUgdGltZW91dCAndGltZXInXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAxMDAwKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHRpbWVyX25leHQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYWxsb3dlZCB1c2VyIHRvIHBlcmZvcm0gdGhlIHRhc2sgaW4gdGhhdCBlZGl0b3Igd2hpY2ggd2FzIG5vdCBtYWRlIHJlYWRvbmx5IGF0IHRoZSB0aW1lIG9mIHF1ZXN0aW9uIGNyZWF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHVuc2V0UmV2aWV3KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNsZWFyIHRoZSB0aW1lb3V0ICd0aW1lcl9uZXh0J1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXJfbmV4dCk7XG4gICAgICAgICAgICAgICAgfS5iaW5kKHRoaXMpLCAyMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cblxuXG4gICAgZnVuY3Rpb24gbG9hZExpYnMoKSB7XG4gICAgICAgIGxldCBjb25maWcgPSB7XG4gICAgICAgICAgICBwcmVsb2FkOiB0cnVlLFxuICAgICAgICAgICAgdHlwZTogJ3RleHQvamF2YXNjcmlwdCcsXG4gICAgICAgICAgICBhczogJ3NjcmlwdCdcbiAgICAgICAgfVxuICAgICAgICBBSC5jcmVhdGVMaW5rKHdpbmRvdy5pdGVtRm9sZGVyICsgJ3NyYy9saWJzL2NvZGVtaXJyb3IuanMnLCBjb25maWcpO1xuICAgICAgICBBSC5jcmVhdGVMaW5rKHdpbmRvdy5pdGVtRm9sZGVyICsgJ3NyYy9saWJzL3NwbGl0LmpzJywgY29uZmlnKTtcbiAgICB9XG4gICAgXG4gICAgb25Nb3VudCgoKT0+e1xuICAgICAgICBsb2FkTGlicygpXG4gICAgICAgIC8vIHVzZWQgZm9yIG1vYmlsZSB0ZWFtXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5nZXRIZWlnaHQgJiYgd2luZG93LmdldEhlaWdodCgpO1xuICAgICAgICAgLyogICBqUXVlcnkoJyNodG1sX3BhbmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjY3NzX3BhbmVsLCNqc19wYW5lbCcpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjaHRtbF9wYW5lbCcpLmNzcygnZGlzcGxheScsICdibG9jaycpLmZpbmQoJ2EnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbGV0IGh0bWxfdGFncyA9IGh0bWxFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBodG1sRWRpdG9yLnNldFZhbHVlKGh0bWxfdGFncyk7XG4gICAgICAgICAgICB9KTsgLy9SZXBsYWNlZCovXG4gICAgICAgIFxuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2h0bWxfcGFuZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbihfdGhpcykge1xuICAgICAgICAgICAgICAgIEFJLnNlbGVjdChfdGhpcykucXVlcnlTZWxlY3RvcignYScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nzc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2Nzc19wYW5lbFwiLCdjc3MnLHtkaXNwbGF5Oidub25lJ30pO1xuICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICBBSC5zZWxlY3QoXCIjanNfcGFuZWxcIiwnY3NzJyx7ZGlzcGxheTonbm9uZSd9KTtcbiAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdodG1sX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2h0bWxfcGFuZWxcIiwnY3NzJyx7ZGlzcGxheTonYmxvY2snfSk7XG4gICAgICAgICAgICAgICAgbGV0IGNvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0KCcjaHRtbF9wYW5lbCcpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdhJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbGV0IGh0bWxfdGFncyA9IGh0bWxFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBodG1sRWRpdG9yLnNldFZhbHVlKGh0bWxfdGFncyk7XG4gICAgICAgICAgICB9KVxuXG5cbiAgICAgICAgICAgIC8qalF1ZXJ5KCcjY3NzX3BhbmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjaHRtbF9wYW5lbCwjanNfcGFuZWwnKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgICAgICAgICAgICAgIGpRdWVyeSgnI2Nzc19wYW5lbCcpLmNzcygnZGlzcGxheScsICdibG9jaycpLmZpbmQoJ2EnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbGV0IGNzc19kYXRhID0gY3NzRWRpdG9yLmdldFZhbHVlKCk7ICAgIFxuICAgICAgICAgICAgICAgIGNzc0VkaXRvci5zZXRWYWx1ZShjc3NfZGF0YSk7XG4gICAgICAgICAgICB9KTsqLy8vIFJlcGxhY2VkXG5cbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNodG1sX3BhbmUnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oX3RoaXMpe1xuICAgICAgICAgICAgICAgIGxldCBjb250YWluID0gQUkuc2VsZWN0KF90aGlzKTtcbiAgICAgICAgICAgICAgICBjb250YWluLnF1ZXJ5U2VsZWN0KCdhJykuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaHRtbF9wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2h0bWxfcGFuZWxcIiwnY3NzJyx7ZGlzcGxheTonbm9uZSd9KTtcbiAgICAgICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2pzX3BhbmVsXCIsJ2Nzcycse2Rpc3BsYXk6bm9uZX0pO1xuICAgICAgICAgICAgICAgIGxldCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmVsJyk7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdhJykuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbGV0IGNzc19kYXRhID0gY3NzRWRpdG9yLmdldFZhbHVlKCk7ICAgIFxuICAgICAgICAgICAgICAgIGNzc0VkaXRvci5zZXRWYWx1ZShjc3NfZGF0YSk7XG4gICAgICAgICAgICB9KSAgXG5cblxuXG4gICAgICAgIC8qICAgIGpRdWVyeSgnI2pzX3BhbmUnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KHRoaXMpLmZpbmQoJ2EnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgalF1ZXJ5KCcjY3NzX3BhbmVsLCNodG1sX3BhbmVsJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICBqUXVlcnkoJyNqc19wYW5lbCcpLmNzcygnZGlzcGxheScsICdibG9jaycpLmZpbmQoJ2EnKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgbGV0IGpzX2RhdGEgPSBqc0VkaXRvci5nZXRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgIGpzRWRpdG9yLnNldFZhbHVlKGpzX2RhdGEpO1xuICAgICAgICAgICAgfSk7ICAqL1xuXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjanNfcGFuZScpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxmdW5jdGlvbihfdGhpcyl7XG4gICAgICAgICAgICAgICAgbGV0IGpzX1BhbmUgPSBBSS5zZWxlY3QoX3RoaXMpO1xuICAgICAgICAgICAgICAgIGpzX1BhbmUucXVlcnlTZWxlY3RvcignYScpLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nzc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0KFwiI2Nzc19wYW5lbFwiLCdjc3MnLHtkaXNwbGF5Oidub25lJ30pO1xuICAgICAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2h0bWxfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIEFILnNlbGVjdChcIiNodG1sX3BhbmVsXCIsJ2Nzcycse2Rpc3BsYXk6J25vbmUnfSk7XG4gICAgICAgICAgICAgICAgbGV0IGpzX3BhbmVsX2NvbnRhaW5lciA9IEFILnNlbGVjdCgnI2pzX3BhbmVsJyk7XG4gICAgICAgICAgICAgICAganNfcGFuZWxfY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgICAgICAgIGpzX3BhbmVsX2NvbnRhaW5lci5xdWVyeVNlbGVjdCgnYScpLmNsYXNzbGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgICAgIGxldCBqc19kYXRhID0ganNFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgICAgICBqc0VkaXRvci5zZXRWYWx1ZShqc19kYXRhKTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC8vIGNvbmRpdG9uIGNhbiBiZSByZW1vdmVkIGFzIGl0cyBkZWZpbmVkIGFib3ZlXG4gICAgICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZShgaGVpZ2h0X19fJHtkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIiNtYWluQ29udGFpbmVyXCIpLm9mZnNldEhlaWdodH1gLCAnKicpO1xuICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICByZW5kZXJDb2RlTWlycm9yKCk7XG5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NwbGl0dGVyV2ViXCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlZCBmb3Igc2V0IHRoZSBwb3NpdGlvbiwgbnVtYmVyIG9mIHBpeGVsIHdoZXJlIHNwbGl0dGVyIGJhciBjYW4ndCBiZSBtb3ZlIG9uIHRoZSBlZGdlLCBhbmQgb3JpZW50YXRpb24gb2YgdGhlIHNwbGl0dGVyIGJhclxuICAgICAgICAgICAgICAgIHNwbGl0dGVyKCk7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyBmcm9tIHRoZSBmdW5jdGlvbiB0byBwcmV2ZW50IGZyb20gcmUtYXBwZW5lZCB0aGUgY29kZSBpZiBpdCB3YXMgYWxyZWFkeSBkZWZpbmVkXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWluUXVpelBsYXllcikge1xuICAgICAgICAgICAgICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgcG9zaXRpb24sIG51bWJlciBvZiBwaXhlbCB3aGVyZSBzcGxpdHRlciBiYXIgY2FuJ3QgYmUgbW92ZSBvbiB0aGUgZWRnZSwgYW5kIG9yaWVudGF0aW9uIG9mIHRoZSBzcGxpdHRlciBiYXJcbiAgICAgICAgICAgICAgICBzcGxpdHRlcigpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBzZXRzIHRoZSB3aWR0aCBhbmQgZmxvYXRpbmcgcHJvcGVydHkgb2YgdGhlIGpzLCBodG1sLCBjc3MgYW5kIHJlc3VsdCBlZGl0b3JcbiAgICAgICAgICAgICAgICBjaGFuZ2VTdHlsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAxMDAwKTtcblxuICAgIC8qICAgIGpRdWVyeShkb2N1bWVudCkub2ZmKCdjbGljaycsICcjYW5zd2VyQ2hlY2snKS5vbignY2xpY2snLCAnI2Fuc3dlckNoZWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gc2hvd3MgdGhlIG91dHB1dCBvZiB0aGUgY29kZSB3cml0dGVuIG9uIHRoZSBlZGl0b3JzIGFuZCBzZXRzIHRoZSB2YWx1ZSBvZiBzdGF0ZSAncmVtZWRpYXRpb25Ub2dnbGUnIHRvIHRydWUgZm9yIGlkZW50aWZ5IHRoYXQgcmVtZWRpYXRpb24gbW9kZSBpcyBvblxuICAgICAgICAgICAgcmVtZWRpYXRpb25Nb2RlKCk7XG4gICAgICAgIH0pOyAgLy8gUmVwbGFjZWQqL1xuICAgICAgICBBSS5saXN0ZW4oZG9jdW1lbnQsJ2NsaWNrJywnI2Fuc3dlckNoZWNrJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgcmVtZWRpYXRpb25Nb2RlKCk7XG4gICAgICAgIH0pXG5cbiAgICAvKiAgICBqUXVlcnkoXCIjc2V0LXJldmlld1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAvLyBjaGVja3MgdGhlIGFuc3dlciBhbmQgbm90IGFsbG93ZWQgdXNlciB0byBwZXJmb3JtIHRoZSB0YXNrXG4gICAgICAgICAgICBzZXRSZXZpZXcoKTtcbiAgICAgICAgfSk7ICAvL1JlcGxhY2VkIChGaXhlZCB3aXRoIFhNTCBQYXJ0KVxuICAgICovXG4gICAgXG5cbiAgICAgICAgLy8galF1ZXJ5KFwiI3Vuc2V0LXJldmlld1wiKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vICAgICAvLyBhbGxvd2VkIHVzZXIgdG8gcGVyZm9ybSB0aGUgdGFzayBpbiB0aGF0IGVkaXRvciB3aGljaCB3YXMgbm90IG1hZGUgcmVhZG9ubHkgYXQgdGhlIHRpbWUgb2YgcXVlc3Rpb24gY3JlYXRpb25cbiAgICAgICAgLy8gICAgIHVuc2V0UmV2aWV3KCk7IC8vUmVwbGFjZWQgKEZpeGVkIHdpdGggWE1MIFBhcnQpXG4gICAgICAgIC8vIH0pO1xuICAgICAgICBcbiAgICAgICAgXG5cblxuICAgICAgICB3aW5kb3cuc2F2ZV9kYXRhID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAoQ29kZU1pcnJvcikgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgLy8gc2hvd3MgdGhlIG91dHB1dCBvZiB0aGUgY29kZSBpbiAnUmVzdWx0JyBlZGl0b3JcbiAgICAgICAgICAgICAgICAvL3NlbGYucnVuQ29kZSgpO1xuICAgICAgICAgICAgICAgIGFuc3dlckNoZWNrV2ViKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaXQgaXMgdXNlZCBvbmx5IHJlLXJlbmRlciBwdXJwb3NlIGFzIGl0cyB2YWx1ZSBmaXJzdCBjaGFuZ2VzIGJ1dCBjYWxsYmFjayBmdW5jdGlvbiBhZ2FpbiByZXNldCBpdCBpdHMgaW5pdGlhbCB2YWx1ZVxuICAgICAgICBcbiAgICAgICAgLy9zdGF0ZS5nb0RhcmsgPSFzdGF0ZS5nb0Rhcms7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBzZXRSZXZpZXcoKSB7XG4gICAgICAgIC8vIGNoZWNrcyB0aGUgYW5zd2VyXG4gICAgICAgIGFuc3dlckNoZWNrV2ViKCk7XG4gICAgICAgIGh0bWxFZGl0b3IgJiYgaHRtbEVkaXRvci5zZXRPcHRpb24oXCJyZWFkT25seVwiLCB0cnVlKTtcbiAgICAgICAgY3NzRWRpdG9yICYmIGNzc0VkaXRvci5zZXRPcHRpb24oXCJyZWFkT25seVwiLCB0cnVlKTtcbiAgICAgICAganNFZGl0b3IgJiYganNFZGl0b3Iuc2V0T3B0aW9uKFwicmVhZE9ubHlcIiwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5zZXRSZXZpZXcoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKENvZGVNaXJyb3IpID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgaHRtbEVkaXRvciAmJiBodG1sRWRpdG9yLnNldE9wdGlvbihcInJlYWRPbmx5XCIsIChyZWFkSFRNTCA/IGZhbHNlIDogdHJ1ZSkpO1xuICAgICAgICAgICAgY3NzRWRpdG9yICYmIGNzc0VkaXRvci5zZXRPcHRpb24oXCJyZWFkT25seVwiLCAocmVhZENTUyA/IGZhbHNlIDogdHJ1ZSkpO1xuICAgICAgICAgICAganNFZGl0b3IgJiYganNFZGl0b3Iuc2V0T3B0aW9uKFwicmVhZE9ubHlcIiwgKHJlYWRKUyA/IGZhbHNlIDogdHJ1ZSkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgIC8vIHVwZGF0ZXMgdGhlIHhtbFxuICAgIGZ1bmN0aW9uIGdldENoaWxkWG1sKHhtbCkge1xuICAgICAgICB4bWwgPSB4bWw7XG4gICAgfVxuXG4gICAgXG4gICAgZnVuY3Rpb24gc3BsaXR0ZXIoKSB7XG4gICAgICAgIC8vIFRoaXMgY29kZSB3aWxsIHJ1bm5pbmcgb24gbW9iaWxlXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaW4gY2FzZSB3aGVuIGpzIGVkaXRvciBpcyB2aXNpYmxlIGFuZCBlaXRoZXIgaHRtbCBvciBjc3Mgb3IgYm90aCBlZGl0b3IgdmlzaWJsZVxuICAgICAgICAgICAgaWYgKHNob3dKUyAmJiAoc2hvd0hUTUwgfHwgc2hvd0NTUykpIHtcbiAgICAgICAgICAgICAgICAvLyBpdCBpcyB1c2VkIHRvIHN0eWxlZCB0aGUgc3BsaXR0ZXIgYmFyIHRoYXQgZXhpc3RzIG9uIHRoZSBsZWZ0IGVkZ2Ugb2YgdGhlIGpzIGVkaXRvclxuICAgICAgICAgICAgICAgIC8vIHNwbGl0dGVyMSA9IGpRdWVyeSgnI3RvcF9jb250ZW50JykuaGVpZ2h0KDM5NCkuc3BsaXQoe1xuICAgICAgICAgICAgICAgIC8vICAgICAvLyBBZGQgYSB2ZXJ0aWNhbCBzcGxpdHRlciBiYXJcbiAgICAgICAgICAgICAgICAvLyAgICAgb3JpZW50YXRpb246ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIFNwZWNpZnkgaG93IG1hbnkgcGl4ZWxzIHdoZXJlIHlvdSBjYW4ndCBtb3ZlIHRoZSBzcGxpdHRlciBiYXIgb24gdGhlIGVkZ2VcbiAgICAgICAgICAgICAgICAvLyAgICAgbGltaXQ6IDE2MCxcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gU2V0IHRoZSBwb3NpdGlvbiBvZiB0aGUgc3BsaXR0ZXIgYmFyXG4gICAgICAgICAgICAgICAgLy8gICAgIHBvc2l0aW9uOiAnNjglJ1xuICAgICAgICAgICAgICAgIC8vIH0pO1xuICAgICAgICAgICAgICAgIGxldCBzcGxpdHRlcjEgPSBTcGxpdChbJyN0b3BfY29udGVudCddLHtcbiAgICAgICAgICAgICAgICBzaXplczogWzUwXSxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpbiBjYXNlIHdoZW4gaHRtbCBhbmQgY3NzIGJvdGggZWRpdG9yIGlzIHZpc2libGVcbiAgICAgICAgICAgIGlmIChzaG93SFRNTCAmJiBzaG93Q1NTKSB7XG4gICAgICAgICAgICAgICAgLy8gaXQgaXMgdXNlZCB0byBzdHlsZWQgdGhlIHNwbGl0dGVyIGJhciB0aGF0IGV4aXN0cyBvbiB0aGUgbGVmdCBlZGdlIG9mIHRoZSBjc3MgZWRpdG9yXG4gICAgICAgICAgICAgICAgLy8gc3BsaXR0ZXIyID0galF1ZXJ5KCcjZmlyc3RFZGl0b3JEaXYnKS5oZWlnaHQoMzk0KS5zcGxpdCh7XG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIEFkZCBhIHZlcnRpY2FsIHNwbGl0dGVyIGJhclxuICAgICAgICAgICAgICAgIC8vICAgICBvcmllbnRhdGlvbjogJ3ZlcnRpY2FsJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gU3BlY2lmeSBob3cgbWFueSBwaXhlbHMgd2hlcmUgeW91IGNhbid0IG1vdmUgdGhlIHNwbGl0dGVyIGJhciBvbiB0aGUgZWRnZVxuICAgICAgICAgICAgICAgIC8vICAgICBsaW1pdDogODAsXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIFNldCB0aGUgcG9zaXRpb24gb2YgdGhlIHNwbGl0dGVyIGJhclxuICAgICAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjogJzUwJSdcbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgICAgICBsZXQgc3BsaXR0ZXIyID0gU3BsaXQoWycjZmlyc3RFZGl0b3JEaXYnXSx7XG4gICAgICAgICAgICAgICAgICAgIHNpemVzOiBbMTAwXSxcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAndmVydGljYWwnLFxuICAgICAgICAgICAgICAgICAgICAvL2RpcmVjdGlvbjogXCJ2ZXJ0aWNhbFwiLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgU3BsaXQoWycjaHRtbF9wYW5lbCcsJyNjc3NfcGFuZWwnLCcjanNfcGFuZWwnXSx7XG4gICAgICAgICAgICAgICAgICAgIHNpemVzOiBbNTAsNTAsNTBdLFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBpbiBjYXNlIHdoZW4gb25seSBvbmUgZWRpdG9yIHZpc2libGVcbiAgICAgICAgICAgIGlmICgoc2hvd0hUTUwgKyBzaG93Q1NTICsgc2hvd0pTKSA9PSAxKSB7XG4gICAgICAgICAgICAgICAgLy8gaXQgaXMgdXNlZCB0byBzdHlsZWQgdGhlIHNwbGl0dGVyIGJhciB0aGF0IGV4aXN0cyBvbiB0aGUgbGVmdCBlZGdlIG9mIHRoZSByZXN1bHQgZWRpdG9yIGluIGNhc2Ugd2hlbiBvbmx5IG9uZSBodG1sLCBqcyBvciBjc3MgZWRpdG9yIGlzIHZpc2libGVcbiAgICAgICAgICAgICAgICAvLyBzcGxpdHRlcjMgPSBqUXVlcnkoJyNhY2NvcmRpb24nKS5oZWlnaHQoMzk0KS5zcGxpdCh7XG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIEFkZCBhIHZlcnRpY2FsIHNwbGl0dGVyIGJhclxuICAgICAgICAgICAgICAgIC8vICAgICBvcmllbnRhdGlvbjogJ3ZlcnRpY2FsJyxcbiAgICAgICAgICAgICAgICAvLyAgICAgLy8gU3BlY2lmeSBob3cgbWFueSBwaXhlbHMgd2hlcmUgeW91IGNhbid0IG1vdmUgdGhlIHNwbGl0dGVyIGJhciBvbiB0aGUgZWRnZVxuICAgICAgICAgICAgICAgIC8vICAgICBsaW1pdDogODAsXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vIFNldCB0aGUgcG9zaXRpb24gb2YgdGhlIHNwbGl0dGVyIGJhclxuICAgICAgICAgICAgICAgIC8vICAgICBwb3NpdGlvbjogJzYwJSdcbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgICAgICBsZXQgU3BsaXR0ZXIzID0gU3BsaXQoWycjYWNjb3JkaW9uJ10se1xuICAgICAgICAgICAgICAgIHNpemVzOiBbMTAwXSxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICd2ZXJ0aWNhbCcsXG4gICAgICAgICAgICAgICAgLy9kaXJlY3Rpb246IFwidmVydGljYWxcIixcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgICAvLyBzZXRzIHRoZSB3aWR0aCBhbmQgZmxvYXRpbmcgcHJvcGVydHkgb2YgdGhlIGpzLCBodG1sLCBjc3MgYW5kIHJlc3VsdCBlZGl0b3JcbiAgICBmdW5jdGlvbiBjaGFuZ2VTdHlsZSgpIHtcbiAgICAgICAgLy8gdXNlZCBmb3IgbW9iaWxlIHRlYW1cbiAgICAgICAgaWYgKHdpbmRvdy5pbk5hdGl2ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93SlMgJiYgKHNob3dIVE1MIHx8IHNob3dDU1MpKSB7XG4gICAgICAgICAgICAvLyBzZXRzIHRoZSB3aWR0aCA1MCUgb2YgaHRtbC9jc3MgZWRpdG9yIGlmIG9ubHkgb25lIGV4aXN0IG90aGVyd2lzZSBzZXRzIHdpZHRoIDUwJSBvZiBwYXJlbnQgZWxlbWVudCB3aGljaCBjb250YWlucyBib3RoIGVkaXRvciB0aGF0IGhhdmUgaWQgJ2ZpcnN0RWRpdG9yRGl2JyBhbmQgZmxvYXQgbGVmdFxuICAgICAgICAgICAvLyBqUXVlcnkoXCIjZmlyc3RFZGl0b3JEaXZcIilbMF0uc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo1MCVcIjsgLy8gUmVwbGFjZWRcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZmlyc3RFZGl0b3JEaXZcIikuc3R5bGUuY3NzVGV4dCA9ICdmbG9hdDpsZWZ0O3dpZHRoOjUwJSc7XG4gICAgICAgICAgICAvLyBzZXRzIHRoZSB3aWR0aCA1MCUgb2YganMgZWRpdG9yIGFuZCBmbG9hdCBsZWZ0XG4gICAgICAgICAgICAvL2pRdWVyeShcIiNqc0VkaXRvckRpdlwiKVswXS5zdHlsZS5jc3NUZXh0ID0gXCJmbG9hdDpsZWZ0O3dpZHRoOjUwJVwiOyAvLyBSZXBsYWNlZFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc0VkaXRvckRpdlwiKS5zdHlsZS5jc3NUZXh0ID0gJ2Zsb2F0OmxlZnQ7d2lkdGg6NTAlJztcbiAgICAgICAgICAgIC8vIGl0IGlzIHBhcmVudCBlbGVtZW50IHRoYXQgY29udGFpbnMgaHRtbCwgY3NzIGFuZCBqcyBlZGl0b3IuIFN0eWxlcyBpdCBub3QgdG8gYWxsb3cgYW55IGZsb2F0aW5nIGVsZW1lbnQgb24gbGVmdCBvciByaWdodCBhbmQgc2V0cyBvdmVyZmxvdyBwcm9wZXJ0eSAnYXV0bydcbiAgICAgICAgICAgIC8valF1ZXJ5KFwiI3RvcF9jb250ZW50XCIpWzBdLnN0eWxlLmNzc1RleHQgPSBcImNsZWFyOmJvdGg7b3ZlcmZsb3c6YXV0b1wiOyAvLyBSZXBsYWNlZFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b3BfY29udGVudFwiKS5zdHlsZS5jc3NUZXh0ID0gXCJjbGVhcjpib3RoO292ZXJmbG93OmF1dG9cIlxuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93SFRNTCAmJiBzaG93Q1NTKSB7XG4gICAgICAgICAgICAvLyBpdCBpcyBwYXJlbnQgZWxlbWVudCB0aGF0IGNvbnRhaW5zIGh0bWwsIGNzcyBhbmQganMgZWRpdG9yLiBTdHlsZXMgaXQgbm90IHRvIGFsbG93IGFueSBmbG9hdGluZyBlbGVtZW50IG9uIGxlZnQgb3IgcmlnaHQgYW5kIHNldHMgb3ZlcmZsb3cgcHJvcGVydHkgJ2F1dG8nXG4gICAgICAgICAgICAvL2pRdWVyeShcIiN0b3BfY29udGVudFwiKVswXS5zdHlsZS5jc3NUZXh0ID0gXCJjbGVhcjpib3RoO292ZXJmbG93OmF1dG9cIjsgLy8gUmVwbGFjZWRcbiAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0b3BfY29udGVudFwiKS5zdHlsZS5jc3NUZXh0ID0gJ2NsZWFyOmJvdGg7b3ZlcmZsb3c6YXV0byc7XG4gICAgICAgICAgICAvLyBzZXRzIGh0bWwgZWRpdG9yJ3Mgd2lkdGggNTAlIGFuZCBmbG9hdCBsZWZ0XG4gICAgICAgICAgIC8vIGpRdWVyeShcIiNodG1sX3BhbmVsXCIpWzBdLnN0eWxlLmNzc1RleHQgPSBcImZsb2F0OmxlZnQ7d2lkdGg6NTAlXCI7IC8vIFJlcGxhY2VkXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2h0bWxfcGFuZWxcIikuc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo1MCVcIjtcbiAgICAgICAgICAgIC8vIHNldHMgY3NzIGVkaXRvcidzIHdpZHRoIDUwJSBhbmQgZmxvYXQgbGVmdFxuICAgICAgICAgICAvLyBqUXVlcnkoXCIjY3NzX3BhbmVsXCIpWzBdLnN0eWxlLmNzc1RleHQgPSBcImZsb2F0OmxlZnQ7d2lkdGg6NTAlXCI7IC8vIFJlcGxhY2VkXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2Nzc19wYW5lbFwiKS5zdHlsZS5jc3NUZXh0ID0gXCJmbG9hdDpsZWZ0O3dpZHRoOjUwJVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmICgoc2hvd0hUTUwgKyBzaG93Q1NTICsgc2hvd0pTKSA9PSAxKSB7XG4gICAgICAgICAgICAvLyBzZXRzIGNzcyBwcm9wZXJ0eSAgd2lkdGggNTAlIGFuZCBmbG9hdCBsZWZ0IG9mIHBhcmVudCBlbGVtZW50IHRoYXQgY29udGFpbnMgaHRtbCwgY3NzIGFuZCBqcyBlZGl0b3IgXG4gICAgICAgICAgICAvL2pRdWVyeShcIiN0b3BfY29udGVudFwiKVswXS5zdHlsZS5jc3NUZXh0ID0gXCJmbG9hdDpsZWZ0O3dpZHRoOjYwJVwiO1xuICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiN0b3BfY29udGVudFwiKS5zdHlsZS5jc3NUZXh0ID0gXCJmbG9hdDpsZWZ0O3dpZHRoOjYwJVwiO1xuICAgICAgICAgICAgLy8gc2V0cyBjc3MgcHJvcGVydHkgIHdpZHRoIDQwJSBhbmQgZmxvYXQgbGVmdCBvZiBlbGVtZW50IHRoYXQgY29udGFpbnMgcmVzdWx0IGVkaXRvciBcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjYm90dG9tX2NvbnRlbnRcIikuc3R5bGUuY3NzVGV4dCA9IFwiZmxvYXQ6bGVmdDt3aWR0aDo0MCVcIjtcbiAgICAgICAgICAgIC8valF1ZXJ5KFwiI2JvdHRvbV9jb250ZW50XCIpWzBdLnN0eWxlLmNzc1RleHQgPSBcImZsb2F0OmxlZnQ7d2lkdGg6NDAlXCI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBjaGFuZ2VzIHRoZW1lIG9mIHRoZSBodG1sLCBqcyBhbmQgY3NzIGVkaXRvcnMgYWNjb3JkaW5nIHRvIHRoZSBjaGVja2VkIHN0YXR1cyBvZiAnRGFyayBNb2RlJyBjaGVja2JveCBcbiAgICBmdW5jdGlvbiBjaGFuZ2VUaGVtZSgpIHtcbiAgICAgICAgY29uc29sZS5sb2coKTtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGNoZWNrZWQgc3RhdHVzIG9mIHRoZSAnRGFyayBNb2RlJyBjaGVja2JveFxuICAgICAgICBsZXQgY2hlY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI2dvRGFya1wiKS5jaGVja2VkO1xuICAgICAgICAvLyB1cGRhdGVzIHRoZSB2YWx1ZSBvZiBzdGF0ZSAnZ29EYXJrJyBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdjaGVjaydcbiAgICAgICAgc3RhdGUuZ29EYXJrID0gY2hlY2sgO1xuICAgICAgICAvLyBzdG9yZXMgdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdjaGVjaycgaW4gJ2dvRGFyaycgdmFyaWFibGUgb2Ygc2Vzc2lvblN0b3JhZ2Ugb2JqZWN0XG4gICAgICAgIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nb0RhcmsgPSBjaGVjaztcbiAgICAgICAgaWYgKGNoZWNrKSB7XG4gICAgICAgICAgICBodG1sRWRpdG9yLnNldE9wdGlvbihcInRoZW1lXCIsIFwibW9ub2thaVwiKTtcbiAgICAgICAgICAgIGNzc0VkaXRvci5zZXRPcHRpb24oXCJ0aGVtZVwiLCBcIm1vbm9rYWlcIik7XG4gICAgICAgICAgICBqc0VkaXRvci5zZXRPcHRpb24oXCJ0aGVtZVwiLCBcIm1vbm9rYWlcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBodG1sRWRpdG9yLnNldE9wdGlvbihcInRoZW1lXCIsIFwiZGVmYXVsdFwiKTtcbiAgICAgICAgICAgIGNzc0VkaXRvci5zZXRPcHRpb24oXCJ0aGVtZVwiLCBcImRlZmF1bHRcIik7XG4gICAgICAgICAgICBqc0VkaXRvci5zZXRPcHRpb24oXCJ0aGVtZVwiLCBcImRlZmF1bHRcIik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1cGRhdGVzIHRoZSB2YWx1ZSBvZiAnc3JjJyBhdHRyaWJ1dGUgb2YgJ2ltZycsICdhdWRpbycgYW5kICd2aWRlbycgdGFnIGlmIGFueSBvZiB0aGVzZSB0YWdzIGV4aXN0IG90aGVyd2lzZSByZXR1cm5zIGFzIGl0IGlzXG4gICAgZnVuY3Rpb24gbmV3U291cmNlKCkge1xuICAgICAgICBsZXQgaHRtbERhdGEgPSBodG1sRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgIGxldCB2aWRlb19hbmRfYXVkaW9fZGF0YSA9IFsnbXA0JywgJ29nZycsICd3ZWJtJywgJ21wMycsICd3YXYnXTtcbiAgICAgICAgbGV0IGltZ19kYXRhID0gWydnaWYnLCAndGlmJywgJ3BuZycsICdqcGcnLCAnanMnXTtcbiAgICAgICAgaHRtbERhdGEgPSBodG1sRGF0YS5yZXBsYWNlKC9zcmNbIF0qPVsgXSpbJ1wiXSguKj8pWydcIl0vZ20sIGZ1bmN0aW9uIChmdWxsTWF0Y2gsIHNyYykge1xuICAgICAgICAgICAgaWYgKHNyYykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlkZW9fYW5kX2F1ZGlvX2RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNyYy5pbmRleE9mKHZpZGVvX2FuZF9hdWRpb19kYXRhW2ldKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHRoZSBkYXRhIGFmdGVyIHVwZGF0aW5nIHRoZSBzcmMgdmFsdWUgb2YgYXVkaW8gYW5kIHZpZGVvIHRhZyB0byBhY2Nlc3MgaXQgZ2xvYmFsbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmdWxsTWF0Y2gucmVwbGFjZShzcmMsICdodHRwczovL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdHJlYW0vJyArIHNyYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbWdfZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3JjLmluZGV4T2YoaW1nX2RhdGFbaV0pID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldHVucyB0aGUgZGF0YSBhZnRlciB1cGRhdGluZyB0aGUgc3JjIHZhbHVlIG9mICdpbWcnIHRhZyBvIGdsb2JhbGx5IGFjY2VzcyBpdFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZ1bGxNYXRjaC5yZXBsYWNlKHNyYywgJ2h0dHBzOi8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8nICsgc3JjKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIGh0bWwgZGF0YSBhZnRlciB1cGRhdGluZyB0aGUgJ3NyYycgdmFsdWUgb2YgJ2ltZycsICd2aWRlbycgYW5kICdhdWRpbycgdGFnXG4gICAgICAgICAgICByZXR1cm4gZnVsbE1hdGNoO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgaHRtbCBkYXRhIGlmICdpbWcnLCAndmlkZW8nIGFuZCAnYXVkaW8nIHRhZyBub3QgZXhpc3RcbiAgICAgICAvL2NvbnNvbGUubG9nKHsnZGF0YSc6aHRtbERhdGF9KVxuICAgICAgICByZXR1cm4gaHRtbERhdGE7XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyB0aGUgY29tYmluZWQgZGF0YSBvZiBodG1sLCBjc3MgYW5kIGpzIGFmdGVyIHdyYXBwaW5nIHRoZSBjc3MgZWRpdG9yIHZhbHVlIGluIHN0eWxlIHRhZyBhbmQganMgZWRpdG9yIHZhbHVlIGluIHNjcmlwdCB0YWcgYW5kIGhpZGVzIHRoZSAnTG9hZGluZy4uLicgY29udGFpbmluZyBhZnRlciBsb2FkXG4gICAgZnVuY3Rpb24gcHJlcGFyZVNvdXJjZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGh0bWwgZWRpdG9yIHZhbHVlIGFmdGVyIHVwZGF0aW5nIHRoZSBzcmMgdmFsdWUgb2YgaW1nLCB2aWRlbyBhbmQgYXVkaW8gdGFnXG4gICAgICAgICAgICBsZXQgaHRtbERhdGEgPSBcIjxkaXYgaWQ9J2xvYWRlcicgc3R5bGU9J3Bvc2l0aW9uOiBmaXhlZDt3aWR0aDogMTAwJTtoZWlnaHQ6IDEwMHZoO3otaW5kZXg6IDk5OTk7YmFja2dyb3VuZC1jb2xvcjojZmZmOyc+TG9hZGluZy4uLjwvZGl2PlwiICsgbmV3U291cmNlKCk7XG5cbiAgICAgICAgICAgIGxldCBjc3NEYXRhID0gY3NzRWRpdG9yLmdldFZhbHVlKCk7XG4gICAgICAgICAgICBsZXQganNEYXRhID0ganNFZGl0b3IuZ2V0VmFsdWUoKTtcbiAgICAgICAgICAgIGNzc0RhdGEgPSBjc3NEYXRhLnJlcGxhY2UoL3VybFxcKFsnXCJdKC4qPylbJ1wiXVxcKS9nLCAndXJsKFwiaHR0cHM6Ly9zMy5hbWF6b25hd3MuY29tL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljLyQxXCIpJyk7XG4gICAgICAgICAgICBqc0RhdGEgPSBqc0RhdGEucmVwbGFjZSgvc3JjLio/W1wiJ10oLio/KVtcIiddL2dpLCAnc3JjID0gXCJodHRwczovL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvJDFcIicpO1xuICAgICAgICAgICAganNEYXRhID0gYHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBmdW5jdGlvbihldikge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2FkZXInKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgfSk7JHtqc0RhdGF9YDtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBjb21iaW5lZCBkYXRhIG9mIGh0bWwsIGNzcyBhbmQganMgZWRpdG9yXG4gICAgICAgICAgICBsZXQgZnVsbERhdGEgPSBodG1sRGF0YSArIFwiXFw8c3R5bGVcXD5cIiArIGNzc0RhdGEgKyBcIlxcPFxcL3N0eWxlXFw+XFw8c2NyaXB0XFw+XCIgKyBqc0RhdGEgKyBcIlxcPFxcL3NjcmlwdFxcPlwiO1xuICAgICAgICAgICAgcmV0dXJuIGZ1bGxEYXRhO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh7IGUsIGZ1bmM6ICdwcmVwYXJlU291cmNlQDM5MycgfSk7XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgIH0gXG5cbiAgICAgICAgLy8gaW5pdGlhbGl6ZSB0aGUgaHRtbCwgY3NzIGFuZCBqcyBlZGl0b3IgYnkgY29udmVydGluZyB0ZXh0YXJlYXMgaGF2aW5nIGlkICdodG1sX2VkaXRvcicsICdjc3NfZWRpdG9yJywgJ2pzX2VkaXRvcicgaW4gaHRtbCwgY3NzIGFuZCBqcyBlZGl0b3JcbiAgICBmdW5jdGlvbiByZW5kZXJDb2RlTWlycm9yKCkge1xuICAgICAgICBpZiAocmVuZGVyZWQpIHtcbiAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZSB0byBwcmV2ZW50IGZyb20gcmUtaW5pdGlhbGl6ZSB0aGUgZWRpdG9ycyBpZiBpdCB3YXMgYWxyZWFkeSBpbml0aWFsaXplZFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIGNzcyBlZGl0b3JcbiAgICAgICAgY3NzRWRpdG9yID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjc3NfZWRpdG9yXCIpLCB7XG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIG1vZGU6ICdjc3MnLFxuICAgICAgICAgICAgc3R5bGVBY3RpdmVMaW5lOiB0cnVlLFxuICAgICAgICAgICAgYXV0b0Nsb3NlQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogXCJzaW1wbGVcIixcbiAgICAgICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiYnJlYWtwb2ludHNcIl1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIGh0bWwgZWRpdG9yXG4gICAgICAgIGh0bWxFZGl0b3IgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImh0bWxfZWRpdG9yXCIpLCB7XG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIG1vZGU6ICd0ZXh0L2h0bWwnLFxuICAgICAgICAgICAgc3R5bGVBY3RpdmVMaW5lOiB0cnVlLFxuICAgICAgICAgICAgYXV0b0Nsb3NlQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogXCJzaW1wbGVcIixcbiAgICAgICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiYnJlYWtwb2ludHNcIl1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGluaXRpYWxpemUgdGhlIGpzIGVkaXRvclxuICAgICAgICBqc0VkaXRvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNfZWRpdG9yXCIpLCB7XG4gICAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICAgIG1vZGU6ICd0ZXh0L2phdmFzY3JpcHQnLFxuICAgICAgICAgICAgc3R5bGVBY3RpdmVMaW5lOiB0cnVlLFxuICAgICAgICAgICAgYXV0b0Nsb3NlQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgICBzY3JvbGxiYXJTdHlsZTogXCJzaW1wbGVcIixcbiAgICAgICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiYnJlYWtwb2ludHNcIl1cbiAgICAgICAgfSk7XG4gICAgICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgdmFsdWUgb2YgaHRtbCwgY3NzLCBqcyBlZGl0b3JzLCBtYWtlcyBlZGl0b3IgcmVhZG9ubHkgd2hpY2ggd2FzIG1hZGUgZGlzYWJsZWQgYXQgdGhlIHRpbWUgb2YgcXVlc3Rpb24gY3JlYXRpb24sIGhpZGUgdGhlIGVkaXRvcnMgd2hpY2ggd2FzIG1hZGUgaGlkZGVuIGF0IHRoZSB0aW1lIG9mIHF1ZXN0aW8gY3JlYXRpb24gYW5kIGNoYW5nZSB0aGUgdGhlbWUgb2YgaHRtbCwgY3NzIGFuZCBqcyBlZGl0b3JzIGFjY29yZGluZyB0byB0aGUgY2hlY2sgc3RhdHVzIG9mICdEYXJrIFRoZW1lJyBjaGVja2JveFxuICAgICAgICBwYXJzZVhNTCgpO1xuICAgICAgICAvLyB1c2VkIGZvciBtb2JpbGUgdGVhbVxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2V0SGVpZ2h0ICYmIHdpbmRvdy5nZXRIZWlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIChodG1sRWRpdG9yKSA9PSBcIm9iamVjdFwiICYmICF3aW5kb3cuaXNSZXZpZXdNb2RlKSB7XG4gICAgICAgICAgICBodG1sRWRpdG9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2VkIGZvciB1cGRhdGUgdGhlIHVzZXIgYW5zd2VyIHhtbCB2YWx1ZSB3aGVuIHZhbHVlIG9mIGh0bWwgZWRpdG9yIGdldHMgY2hhbmdlZCBhbmQgcmV2aWV3IG1vZGUgaXMgb2ZmXG4gICAgICAgICAgICAgICAgc2F2ZVdlYkFuc3dlcihodG1sRWRpdG9yLmdldFZhbHVlKCksIFwiaHRtbFwiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKGNzc0VkaXRvcikgPT0gXCJvYmplY3RcIiAmJiAhd2luZG93LmlzUmV2aWV3TW9kZSkge1xuICAgICAgICAgICAgY3NzRWRpdG9yLm9uKFwiY2hhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2VkIGZvciB1cGRhdGUgdGhlIHVzZXIgYW5zd2VyIHhtbCB2YWx1ZSB3aGVuIHZhbHVlIG9mIGNzcyBlZGl0b3IgZ2V0cyBjaGFuZ2VkIGFuZCByZXZpZXcgbW9kZSBpcyBvZmZcbiAgICAgICAgICAgICAgICBzYXZlV2ViQW5zd2VyKGNzc0VkaXRvci5nZXRWYWx1ZSgpLCBcImNzc1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgKGpzRWRpdG9yKSA9PSBcIm9iamVjdFwiICYmICF3aW5kb3cuaXNSZXZpZXdNb2RlKSB7XG4gICAgICAgICAgICBqc0VkaXRvci5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgLy8gdXNlZCBmb3IgdXBkYXRlIHRoZSB1c2VyIGFuc3dlciB4bWwgdmFsdWUgd2hlbiB2YWx1ZSBvZiBqcyBlZGl0b3IgZ2V0cyBjaGFuZ2VkIGFuZCByZXZpZXcgbW9kZSBpcyBvZmZcbiAgICAgICAgICAgICAgICBzYXZlV2ViQW5zd2VyKGpzRWRpdG9yLmdldFZhbHVlKCksIFwianNcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBub3Qgc3VyZSB3aHkgaXQgaXMgdXNlZCBhcyB0aGlzIGlkIGRvZXMgbm90IGV4aXN0IGhlcmVcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYVhtbFwiKSkge1xuICAgICAgICAgICAgbGV0IHhtbEVkaXRvciA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYVhtbFwiKSwge1xuICAgICAgICAgICAgICAgIGxpbmVOdW1iZXJzOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBtb2RlOiBcImFwcGxpY2F0aW9uL3htbFwiLFxuICAgICAgICAgICAgICAgIGF1dG9DbG9zZUJyYWNrZXRzOiB0cnVlLFxuICAgICAgICAgICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgICAgICAgICBtYXRjaEJyYWNrZXRzOiB0cnVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBodG1sRWRpdG9yLnNldE9wdGlvbihcImV4dHJhS2V5c1wiLCB7XG4gICAgICAgICAgICAvLyBDaGFuZ2luZyBUYWJzIGludG8gNCBzcGFjZXMgXG4gICAgICAgICAgICBUYWI6IGZ1bmN0aW9uIChjbSkge1xuICAgICAgICAgICAgICAgIGxldCBzcGFjZXMgPSBBcnJheShjbS5nZXRPcHRpb24oXCJpbmRlbnRVbml0XCIpICsgMykuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgICAgY20ucmVwbGFjZVNlbGVjdGlvbihzcGFjZXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIHRvZ2dsZSBiZXR3ZWVuIGZ1bGxTY3JlZW4gYnV0IGl0IG5vdCB3b3JrZWQgZm9yIG1lXG4gICAgICAgICAgICBGMTE6IGZ1bmN0aW9uIChjbSkge1xuICAgICAgICAgICAgICAgIGNtLnNldE9wdGlvbihcImZ1bGxTY3JlZW5cIiwgIWNtLmdldE9wdGlvbihcImZ1bGxTY3JlZW5cIikpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIHJlbW92ZSB0aGUgZnVsbFNjcmVlbiBtb2RlIGJ1dCBpdCBub3Qgd29ya2VkIGZvciBtZVxuICAgICAgICAgICAgRXNjOiBmdW5jdGlvbiAoY20pIHtcbiAgICAgICAgICAgICAgICBpZiAoY20uZ2V0T3B0aW9uKFwiZnVsbFNjcmVlblwiKSkgY20uc2V0T3B0aW9uKFwiZnVsbFNjcmVlblwiLCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBkZWZpbmVzIHRoYXQgZWRpdG9yIGlzIGluaXRpYWxpemVkXG4gICAgICAgIHJlbmRlcmVkID0gMTtcbiAgICB9XG5cbiAgICAvLyBzaG93cyB0aGUgb3V0cHV0IG9mIHRoZSBjb2RlIHdyaXR0ZW4gb24gdGhlIGVkaXRvcnMgYW5kIHNldHMgdGhlIHZhbHVlIG9mIHN0YXRlICdyZW1lZGlhdGlvblRvZ2dsZScgdG8gdHJ1ZSBmb3IgaWRlbnRpZnkgdGhhdCByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXG4gICAgZnVuY3Rpb24gcmVtZWRpYXRpb25Nb2RlKCkge1xuICAgICAgICAvLyBzZXRzIHRoZSB2YWx1ZSBvZiBzdGF0ZSAncmVtZWRpYXRpb25Ub2dnbGUnIHRvIHRydWUgdGhhdCBpbmRpY2F0ZXMgdGhhdCByZW1lZGlhdGlvbiBtb2RlIGlzIG9uXG4gICAgICAgc3RhdGUucmVtZWRpYXRpb25Ub2dnbGUgPSB0cnVlIDtcbiAgICAgICAgLy8gc2hvd3MgdGhlIG91dHB1dCBvZiB0aGUgY29kZSBpbiAnUmVzdWx0JyBlZGl0b3JcbiAgICAgICAgcnVuQ29kZSgpO1xuICAgIH1cblxuICAgICAvLyB1c2VkIGZvciBzaG93IHRoZSByZXN1bHQgb2YgdGVzdGNhc2VzXG4gICAgZnVuY3Rpb24gYW5zd2VyQ2hlY2tXZWIoaXNSdW4gPSB0cnVlKSB7XG4gICAgICAgIGxldCByZXNOZXcgPSB7fTtcbiAgICAgICAgcmVzTmV3LnUgPSByZXN1bHRTYXZpbmc7XG4gICAgICAgIC8vIGNvbnRhaW5zIHJvd3Mgb2YgUmVtZWRpYXRpb24gZGlhbG9nIGJveCBpbiBlYWNoIHJvdyAyIGNvbHVtbnMgZXhpc3QgaW4gZmlyc3QgY29sdW1uIHRlc3RjYXNlIG51bWJlciBkZWZpbmVkIGFuZCBpbiBzZWNvbmQgY29sdW1uIHRoZWlyIHJlc3VsdCBzdGF0dXMgZGVmaW5lZFxuICAgICAgICBsZXQgY2FzZV9yZXN1bHQgPSBbXTtcbiAgICAgICAgLy8gc2hvd3MgdGhlIG91dHB1dCBvZiB0aGUgY29kZSBpbiAnUmVzdWx0JyBlZGl0b3IgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSBvZiBhcmd1bWVudCB2YXJpYWJsZSAnaXNSdW4nXG4gICAgICAgIGlzUnVuID8gcnVuQ29kZSgpIDogXCJcIjtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHN0cmluZyBkZWZpbmVkIGluICdUZXN0Y2FzZXMnIGZpZWxkIG9mICdBdXRvZ3JhZGUnIGRpYWxvZyBib3hcbiAgICAgICAgbGV0IGdldF90ZXN0X2Nhc2VzID0gc3RyaW5nQmV0d2VlbihzdGF0ZS54bWwsICc8YXV0b2dyYWRlIHR5cGU9XCJ0ZXN0Y2FzZVwiPicsICc8L2F1dG9ncmFkZT4nKTtcbiAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgYW55IHRlc3RjYXNlIGRlZmluZWQgaW4gJ1Rlc3RjYXNlcycgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxuICAgICAgICBpZiAoZ2V0X3Rlc3RfY2FzZXMpIHtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBzdHJpbmcgaWYgZXhpc3QgaW4gdmFyaWFibGUgJ2dldF90ZXN0X2Nhc2VzJyBvdGhlcndpc2UgYmxhbmsgdmFsdWUgY29udGFpbnNcbiAgICAgICAgICAgIGdldF90ZXN0X2Nhc2VzID0gZ2V0X3Rlc3RfY2FzZXMgPyBnZXRfdGVzdF9jYXNlcy50cmltKCkgOiBcIlwiO1xuICAgICAgICAgICAgLy8gcmVwbGFjZXMgc3RyaW5nIHN0YXJ0cyBmcm9tICc8L2Nhc2U+JyBhbmQgZW5kcyBhdCAnPGNhc2U+JyB3aXRoICc7JyBhbmQgcmVwbGFjZXMgc2luZ2xlICc8L2Nhc2U+JyBvciAnPGNhc2U+JyB3aXRoIGJsYW5rIFxuICAgICAgICAgICAgZ2V0X3Rlc3RfY2FzZXMgPSBnZXRfdGVzdF9jYXNlcy5yZXBsYWNlKC88XFwvY2FzZT5bXFxzXFxTXSo/PGNhc2U+L2dtLCBcIjtcIikucmVwbGFjZSgvPFxcL2Nhc2U+fDxjYXNlPi9nLCBcIlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIGFycmF5IG9mIGRlZmluZWQgdGVzdGNzZXMgd2hpY2ggZXhpc3QgaW4gJ1Rlc3RjYXNlcycgZmllbGQgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxuICAgICAgICAgICAgZ2V0X3Rlc3RfY2FzZXMgPSBnZXRfdGVzdF9jYXNlcy5zcGxpdChcIjtcIik7XG4gICAgICAgICAgICAvLyBsb29wcyB0aHJvdWdoIHRoZSBlYWNoIHRlc3RjYXNlXG4gICAgICAgICAgICBmb3IgKGxldCBpIGluIGdldF90ZXN0X2Nhc2VzKSB7XG4gICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgdGVzdGNhc2UgaXMgZGVmaW5lZCBpbiAnVGVzdGNhc2VzJyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XG4gICAgICAgICAgICAgICAgaWYgKHRlc3RjYXNlQ2hlY2soZ2V0X3Rlc3RfY2FzZXNbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgcm93IGluIGNhc2VfcmVzdWx0IGFycmF5IHdpdGggdGVzdGNhc2UgbnVtYmVyIGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2knICsgMSB3aXRoIHByaWZpeCAnVGVzdCBDYXNlJyBhbmQgcmVzdWx0IHN0YXR1cyBhcyBQYXNzZWQgaWYgdmFsdWUgcmV0dXJuZWQgYnkgbWV0aG9kIHRlc3RjYXNlQ2hlY2sgaXMgdHJ1ZVxuICAgICAgICAgICAgICAgICAgICBjYXNlX3Jlc3VsdC5wdXNoKCc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkPlRlc3QgQ2FzZScgKyAocGFyc2VJbnQoaSkgKyAxKSArICc8L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZD5QYXNzZWQ8L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSByb3cgaW4gY2FzZV9yZXN1bHQgYXJyYXkgd2l0aCB0ZXN0Y2FzZSBudW1iZXIgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgKyAxIHdpdGggcHJpZml4ICdUZXN0IENhc2UnIGFuZCByZXN1bHQgc3RhdHVzIGFzIEZhaWxlZCBpZiB2YWx1ZSByZXR1cm5lZCBieSBtZXRob2QgdGVzdGNhc2VDaGVjayBpcyBmYWxzZVxuICAgICAgICAgICAgICAgICAgICBjYXNlX3Jlc3VsdC5wdXNoKCc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkPlRlc3QgQ2FzZScgKyAocGFyc2VJbnQoaSkgKyAxKSArICc8L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZD5GYWlsZWQ8L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB0ZXN0Y2FzZXMgZGVmaW5lZCBpbiAnSW50ZXJuYWwgU2NyaXB0JyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XG4gICAgICAgIGxldCBnZXRfaW50ZXJuYWxfY2FzZXMgPSBzdHJpbmdCZXR3ZWVuKHN0YXRlLnhtbCwgJzxhdXRvZ3JhZGUgdHlwZT1cImludGVybmFsXCI+JywgJzwvYXV0b2dyYWRlPicpO1xuICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBhbnkgdGVzdGNhc2UgZGVmaW5lZCBpbiAnSW50ZXJuYWwgU2NyaXB0JyBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XG4gICAgICAgIGlmIChnZXRfaW50ZXJuYWxfY2FzZXMpIHtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHN0cmluZyBpZiBleGlzdCBpbiAnSW50ZXJuYWwgU2NyaXB0JyBvdGhlcndpc2UgY29udGFpbnMgYmxhbmsgdmFsdWVcbiAgICAgICAgICAgIGdldF9pbnRlcm5hbF9jYXNlcyA9IGdldF9pbnRlcm5hbF9jYXNlcyA/IGdldF9pbnRlcm5hbF9jYXNlcy50cmltKCkgOiBcIlwiO1xuICAgICAgICAgICAgLy8gcmVwbGFjZXMgc3RyaW5nIHN0YXJ0cyBmcm9tICc8L2Nhc2U+JyBhbmQgZW5kcyBhdCAnPGNhc2U+JyB3aXRoICc7JyBhbmQgcmVwbGFjZXMgc2luZ2xlICc8L2Nhc2U+JyBvciAnPGNhc2U+JyB3aXRoIGJsYW5rIFxuICAgICAgICAgICAgZ2V0X2ludGVybmFsX2Nhc2VzID0gZ2V0X2ludGVybmFsX2Nhc2VzLnJlcGxhY2UoLzxcXC9jYXNlPltcXHNcXFNdKj88Y2FzZT4vZ20sIFwiO1wiKS5yZXBsYWNlKC88XFwvY2FzZT58PGNhc2U+L2csIFwiXCIpO1xuICAgICAgICAgICAgLy8gY29udGFpbnMgYXJyYXkgb2YgZGVmaW5lZCB0ZXN0Y3NlcyB3aGljaCBleGlzdCBpbiAnSW50ZXJuYWwgU2NyaXB0JyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XG4gICAgICAgICAgICBnZXRfaW50ZXJuYWxfY2FzZXMgPSBnZXRfaW50ZXJuYWxfY2FzZXMuc3BsaXQoXCI7XCIpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSBpbiBnZXRfaW50ZXJuYWxfY2FzZXMpIHtcbiAgICAgICAgICAgICAgICAvLyBwdXNoZXMgdGhlIHJvdyBpbiBjYXNlX3Jlc3VsdCBhcnJheSB3aXRoIHRlc3RjYXNlIG51bWJlciBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdpJyArIDEgd2l0aCBwcmlmaXggJ0ludGVybmFsIENhc2UnIGFuZCByZXN1bHQgc3RhdHVzIGFzIFBhc3NlZCBpZiB2YWx1ZSByZXR1cm5lZCBieSBtZXRob2QgaW50ZXJuYWxDaGVjayBpcyB0cnVlXG4gICAgICAgICAgICAgICAgaWYgKGludGVybmFsQ2hlY2soZ2V0X2ludGVybmFsX2Nhc2VzW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlX3Jlc3VsdC5wdXNoKCc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHRkPkludGVybmFsIENhc2UnICsgKHBhcnNlSW50KGkpICsgMSkgKyAnPC90ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQ+UGFzc2VkPC90ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3RyPicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2VfcmVzdWx0LnB1c2goJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8dGQ+SW50ZXJuYWwgQ2FzZScgKyAocGFyc2VJbnQoaSkgKyAxKSArICc8L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzx0ZD5GYWlsZWQ8L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgJzwvdHI+Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB0ZXN0Y2FzZXMgZGVmaW5lZCBpbiAnRXh0ZXJuYWwgU2NyaXB0JyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XG4gICAgICAgIGxldCBnZXRfZXh0ZXJuYWxfY2FzZXMgPSBzdHJpbmdCZXR3ZWVuKHN0YXRlLnhtbCwgJzxhdXRvZ3JhZGUgdHlwZT1cImN1c3RvbVwiPicsICc8L2F1dG9ncmFkZT4nKTtcbiAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgYW55IHRlc3RjYXNlIGRlZmluZWQgaW4gJ0V4dGVybmFsIFNjcmlwdCcgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxuICAgICAgICBpZiAoZ2V0X2V4dGVybmFsX2Nhc2VzKSB7XG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgdmFsdWUgb2YgJ0V4dGVuYWwgU2NyaXB0JyBmaWVsZCBcbiAgICAgICAgICAgIGxldCBnZXRfY2FzZSA9IGdldF9leHRlcm5hbF9jYXNlcy5yZXBsYWNlKC88Y2FzZT58PFxcL2Nhc2U+L2dtLCBcIlwiKTtcbiAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgcm93IGluIGNhc2VfcmVzdWx0IGFycmF5IHdpdGggdGVzdGNhc2UgbnVtYmVyIGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2knICsgMSB3aXRoIHByaWZpeCAnSW50ZXJuYWwgQ2FzZScgYW5kIHJlc3VsdCBzdGF0dXMgYXMgRmFpbGVkICBpZiB2YWx1ZSByZXR1cm5lZCBieSBtZXRob2QgZXh0ZXJuYWxDaGVjayBpcyB0cnVlXG4gICAgICAgICAgICBpZiAoZXh0ZXJuYWxDaGVjayhnZXRfY2FzZSkpIHtcbiAgICAgICAgICAgICAgICBjYXNlX3Jlc3VsdC5wdXNoKCc8dHI+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGQ+RXh0ZXJuYWwgQ2FzZTwvdGQ+JyArXG4gICAgICAgICAgICAgICAgICAgICc8dGQ+UGFzc2VkPC90ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzwvdHI+Jyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgcm93IGluIGNhc2VfcmVzdWx0IGFycmF5IHdpdGggdGVzdGNhc2UgbnVtYmVyIGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2knICsgMSB3aXRoIHByaWZpeCAnSW50ZXJuYWwgQ2FzZScgYW5kIHJlc3VsdCBzdGF0dXMgYXMgRmFpbGVkICBpZiB2YWx1ZSByZXR1cm5lZCBieSBtZXRob2QgZXh0ZXJuYWxDaGVjayBpcyBmYWxzZVxuICAgICAgICAgICAgICAgIGNhc2VfcmVzdWx0LnB1c2goJzx0cj4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0ZD5FeHRlcm5hbCBDYXNlPC90ZD4nICtcbiAgICAgICAgICAgICAgICAgICAgJzx0ZD5GYWlsZWQ8L3RkPicgK1xuICAgICAgICAgICAgICAgICAgICAnPC90cj4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBqb2lucyB0aGUgYXJyYXkgJ2Nhc2VfcmVzdWx0JyBpbiBzdHJpbmcgXG4gICAgICAgIGxldCBjYXNlX3N0ciA9IGNhc2VfcmVzdWx0LmpvaW4oXCJcIik7XG4gICAgICAgIC8vIHVzZWQgZm9yIHNob3cgdGhlIGFuc3dlciBjb3JyZWN0IG9mIGluY29ycmVjdCBpbiBtb2JpbGVcbiAgICAgICAgbGV0IGluTmF0aXZlSXNDb3JyZWN0ID0gbnVsbFxuICAgICAgICBpZiAoL0ZhaWxlZC9naS50ZXN0KGNhc2Vfc3RyKSkge1xuICAgICAgICAgICAgLy8gdW5jaGVjayB0aGUgZWxlbWVudCBoYXZlIGlkICdhbnN3ZXInIGlmICdGYWlsZWQnIHN0cmluZyBleGlzdCBpbiByZXN1bHQgc3RyaW5nXG4gICAgICAgICAgICAvL2pRdWVyeShcIiNhbnN3ZXJcIikucHJvcChcImNoZWNrZWRcIiwgZmFsc2UpO1xuICAgICAgICAgICAgcmVzTmV3LmEgPSBmYWxzZTtcbiAgICAgICAgICAgIEFJLnNlbGVjdChcIiNhbnN3ZXJcIikuY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJ2ZhbHNlJyBvZiB2YXJpYWJsZSAnaW5OYXRpdmVJc0NvcnJlY3QnIHRvIHNob3cgaW5jb3JyZWN0IGFuc3dlciBpbiBtb2JpbGVcbiAgICAgICAgICAgIGluTmF0aXZlSXNDb3JyZWN0ID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvL2pRdWVyeShcIiNhbnN3ZXJcIikucHJvcChcImNoZWNrZWRcIiwgdHJ1ZSk7XG4gICAgICAgICAgICByZXNOZXcuYSA9IHRydWU7XG4gICAgICAgICAgICBBSS5zZWxlY3QoXCIjYW5zd2VyXCIpLmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJ3RydWUnIG9mIHZhcmlhYmxlICdpbk5hdGl2ZUlzQ29ycmVjdCcgdG8gc2hvdyBjb3JyZWN0IGFuc3dlciBpbiBtb2JpbGVcbiAgICAgICAgICAgIGluTmF0aXZlSXNDb3JyZWN0ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyB1c2VkIGZvciBtb2JpbGUgdGVhbVxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XG4gICAgICAgICAgICB3aW5kb3cuZ2V0SGVpZ2h0ICYmIHdpbmRvdy5nZXRIZWlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB1c2VkIGZvciBtb2JpbGUgdGVhbVxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7IC8vIHJlcGxhY2VkICNzcGVjaWFsX21vZHVsZV91c2VyX3htbFxuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKEpTT04uc3RyaW5naWZ5KHsgdXNlckFuc3dlcnM6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3BlY2lhbF9tb2R1bGVfdXNlcl94bWxcIikudmFsdWUsIGluTmF0aXZlSXNDb3JyZWN0IH0pKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkZWZpbmVzIHRoZSB0YWJsZSBjb250YWluaW5nIHRoZSBmaWVsZCAnVGVzdCBDYXNlJyBhbmQgJ1Jlc3VsdCcgaW4gdGFibGUgaGVhZCBhbmQgdmFsdWUgc3RvcmVkIGluIHZhcmlhYmxlICdjYXNlX3N0cicgYXMgYm9keSBwYXJ0IG9mIHRoZSB0YWJsZVxuICAgICAgICBsZXQgcmV2aWV3TGF5b3V0ID0gXCI8dGFibGUgc3R5bGU9XFxcIndpZHRoOjUwMHB4O1xcXCIgY2xhc3M9XFxcInRhYmxlXFxcIj48dGhlYWQgY2xhc3M9XFxcInRoZWFkLWludmVyc2VcXFwiPjx0ciBzdHlsZT0nYmFja2dyb3VuZC1jb2xvcjojNDI4NUY0Jz48dGggc3R5bGU9J2JhY2tncm91bmQtY29sb3I6IzQyODVGNCc+VGVzdCBDYXNlPC90aD48dGg+UmVzdWx0PC90aD48L3RyPjwvdGhlYWQ+XCIgKyBjYXNlX3N0ciArIFwiPC90YWJsZT5cIjtcbiAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgcmVtZWRpYXRpb24gbW9kZSBpcyBvblxuICAgICAgICBpZiAoc3RhdGUucmVtZWRpYXRpb25Ub2dnbGUpIHtcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIHRhYmxlIGluIGVsZW1lbnQgaGF2ZSBpZCAncmVtZWRpYXRpb25Nb2RlbCcgbWVhbnMgaW4gcmVtZWRpYXRpb24gZGlhbG9nIGJveFxuICAgICAgICAgICAgLy9qUXVlcnkoXCIjcmVtZWRpYXRpb25Nb2RlbFwiKS5odG1sKHJldmlld0xheW91dCk7IC8vIFJlcGxhY2VkXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZW1lZGlhdGlvbk1vZGVsJykuaW5uZXJIVE1MID0gcmV2aWV3TGF5b3V0O1xuICAgICAgICB9XG4gICAgICAgIG9uVXNlckFuc0NoYW5nZSh7dVhtbDpyZXNOZXcudSxhbnM6cmVzTmV3LmF9KTtcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgZGVmaW5lZCB0YWJsZVxuICAgICAgICByZXR1cm4gKHJldmlld0xheW91dCk7XG4gICAgfVxuXG4gICAgIC8vIHJldHVybnMgdHJ1ZSBvciBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoZWQgdmFsdWUgb2YgdGVzdGNhc2UgZGVmaW5lZCBpbiAnVGVzdGNhc2VzJyBmaWVsZCBvZiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XG4gICAgZnVuY3Rpb24gdGVzdGNhc2VDaGVjayhnZXRfY2FzZXMpIHtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGFycmF5IGFmdGVyIHNwbGl0aW5nIGJ5IHN5bWJvbCAnfCdcbiAgICAgICAgbGV0IGNhc2VBcnIgPSBnZXRfY2FzZXMuc3BsaXQoXCJ8XCIpO1xuICAgICAgICAvLyBkZW5vdGVzIHRoYXQgYXJyYXkgYXJndW1lbnQgcGFzc2VkXG4gICAgICAgIGxldCBmSW5wID0gMDtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIG5hbWUgb2YgdGhlIGZ1bmN0aW9uIGRlZmluZWQgaW4gdGVzdGNhc2VcbiAgICAgICAgbGV0IHRlc3RfZnVuYyA9IGNhc2VBcnJbMF07XG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBhcmd1bWVudHMgb2YgdGhlIGZ1bmN0aW9uIGRlZmluZWQgaW4gdGVzdGNhc2VcbiAgICAgICAgbGV0IHRlc3RfaW5wID0gY2FzZUFyclsxXTtcbiAgICAgICAgLy8gY29udGFpbnMgcmV0dXJuIHZhbHVlIG9mIHRoZSBmdW5jdGlvbiBkZWZpbmVkIGluIHRlc3RjYXNlXG4gICAgICAgIGxldCB0ZXN0X291cCA9IGNhc2VBcnJbMl07XG4gICAgICAgIC8vIHVzZWQgZm9yIGhvbGQgdGhlIGVycm9yIG1lc3NhZ2VcbiAgICAgICAgbGV0IGVycm9yID0ge307XG4gICAgICAgIC8vIHVzZWQgZm9yIGNvbnRhaW4gdGhlIHZhbHVlIG9mIGpzIGVkaXRvclxuICAgICAgICBsZXQganNfZGF0YSA9IFwiXCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIChjYXNlQXJyWzFdKSA9PSAnc3RyaW5nJyAmJiBjYXNlQXJyWzFdLmluZGV4T2YoJ3thcnInKSA8IDApIHtcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyBhbiBhcnJheSBhZnRlciByZXBsYWNpbmcgJ3twaXB9JyB3aXRoICd8JyBhbmQgc3BsaXRpbmcgd2l0aCBjb21tYVxuICAgICAgICAgICAgICAgIHRlc3RfaW5wID0gY2FzZUFyclsxXS5yZXBsYWNlKCd7cGlwfScsICd8Jykuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChjYXNlQXJyWzFdLmluZGV4T2YoJ3thcnInKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgYW4gYXJyYXkgYWZ0ZXIgcmVwbGFjaW5nICd7YXJyJyBvciAnfScgd2l0aCBibGFuayB2YWx1ZSBhbmQgc3BsaXRpbmcgd2l0aCBjb21tYVxuICAgICAgICAgICAgICAgIHRlc3RfaW5wID0gKGNhc2VBcnJbMV0ucmVwbGFjZSgvXFx7YXJyfFxcfS9nLCAnJykpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHZhbHVlICcxJyB0byBkZW5vdGUgdGhhdCBhcnJheSBhcmd1bWVudCBwYXNzZWRcbiAgICAgICAgICAgICAgICBmSW5wID0gMTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGFyZ3VtZW50cyBvZiB0aGUgZnVuY3Rpb24gZGVmaW5lZCBpbiB0ZXN0Y2FzZVxuICAgICAgICAgICAgICAgIHRlc3RfaW5wID0gY2FzZUFyclsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBqcyBlZGl0b3IgYWZ0ZXIgcmVtb3Zpbmcgd2hpdGUgc3BhY2UgZnJvbSBzdGFydCBhbmQgZW5kIG9mIHRoZSBzdHJpbmdcbiAgICAgICAgICAgIGpzX2RhdGEgPSBqc0VkaXRvci5nZXRWYWx1ZSgpLnRyaW0oKTtcbiAgICAgICAgICAgIC8vIHJlbW92ZXMgYWxsIHRoZSB0ZXh0IHRoYXQgZXhpc3QgaW4gc2FtZSBsaW5lIHN0YXJ0aW5nIGZyb20gJ2RvY3VtZW50LndyaXRlJyBzdHJpbmcgb2YganMgZWRpdG9yIHZhbHVlIFxuICAgICAgICAgICAganNfZGF0YSA9IGpzX2RhdGEucmVwbGFjZSgvZG9jdW1lbnRcXC53cml0ZS4qL2dtLCAnJyk7XG4gICAgICAgICAgICAvLyBpZiBmdW5jdGlvbiBuYW1lLCBhcmd1bWVudCBvZiB0aGUgZnVuY3Rpb24gb3IgdmFsdWUgb2YgZnVuY3Rpb24gcmV0dXJuIGlzIG5vdCBkZWNsYWlyZWQgaW4gdGVzdGNhc2UgdGhlbiB3aXRob3V0IGNoZWNraW5nIGFuc3dlciBpdCByZXR1cm5zIGZyb20gZnVuY3Rpb24gYnkgcmV0dXJuaW5nIHZhbHVlICdmYWxzZSdcbiAgICAgICAgICAgIGlmICghdGVzdF9mdW5jIHx8ICF0ZXN0X2lucCB8fCAhdGVzdF9vdXApIHtcbiAgICAgICAgICAgICAgICAvLyBzZXRzIHRoZSBlcnJvciBtZXNzYWdlXG4gICAgICAgICAgICAgICAgZXJyb3JbXCJ2YWxpZGF0aW9uXCJdID0gXCJJbnZhbGlkIFRlc3QgQ2FzZXNcIjtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHZhbHVlIGZhbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgdHlwZSBvZiB0aGUgZnVuY3Rpb24gaXMgdW5kZWZpbmVkIHRoZW4gYWxzbyByZXR1cm5zIGZyb20gZnVuY3Rpb24gd2l0aG91dCBjaGVja2luZyB0aGUgYW5zd2VyIGFmdGVyIHNldHRpbmcgZXJyb3IgbWVzc2FnZVxuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGVzdF9mdW5jKSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBlcnJvcltcImZ1bmNfY2hlY2tcIl0gPSBcIkZ1bmN0aW9uIGNhc2UgaXMgdW5kZWZpbmVkXCI7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcGF0dGVybiBmb3IgY29udGFpbiB0aGUgXG4gICAgICAgICAgICBsZXQgcmUgPSBuZXcgUmVnRXhwKFwiZnVuY3Rpb24gXCIgKyB0ZXN0X2Z1bmMgKyBcIi4qP1xcXFwpXCIsIFwiZ1wiKTtcbiAgICAgICAgICAgIC8vIGFycmF5IGZvciBob2xkIHRoZSBtYXRjaGVkIHRleHQgcmV0dXJuIGJ5IHRoZSAnZXhlYycgbWV0aG9kXG4gICAgICAgICAgICBsZXQgcGFyYW1zID0gW107XG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgdGV4dCB0aGF0IG1hdGNoZXMgaW4ganMgZWRpdG9yIHZhbHVlIGZvciBwYXR0ZXJuIGRlZmluZWQgaW4gdmFyaWFibGUgJ3JlJ1xuICAgICAgICAgICAgcGFyYW1zID0gcmUuZXhlYyhqc19kYXRhKTtcbiAgICAgICAgICAgIC8vIGNvbnZlcnRzIGFycmF5ICdwYXJhbXMnIGludG8gc3RyaW5nXG4gICAgICAgICAgICBwYXJhbXMgPSBwYXJhbXMuam9pbigpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIC8vIGhvbGRlcyBlcnJvciBtZXNhYWdlIGluIGNhc2Ugb2YgYW55IGVycm9yIG9jY3VycmVkXG4gICAgICAgICAgICBlcnJvclsnZnVuY3Rpb25fZXhpc3QnXSA9IFwiR2l2ZW4gRnVuY3Rpb24gZG9lc24ndCBleGlzdFwiO1xuICAgICAgICB9XG4gICAgICAgIC8vIHVzZWQgZm9yIGNvbnRhaW5zIHRoZSBqcyBlZGl0b3IgdmFsdWUgYW5kIGZ1bmN0aW9uIGNhbGwgc3RyaW5nIHdpdGggYXJndW1lbnRzXG4gICAgICAgIGxldCBldmFsX3N0ciA9IFwiXCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIChpbnApID09ICdhcnJheScgfHwgdHlwZW9mIChpbnApID09ICdvYmplY3QnICYmICFmSW5wKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMganMgZWRpdG9yIHZhbHVlIGFuZCBjYWxscyBmdW5jdGlvbiB3aXRoIGFyZ3VtZW50IGRlZmluZWQgaW4gdGVzdGNhc2UgYWZ0ZXIgam9pbmluZyB0aGUgYXJndW1lbnQgaW4gc3RyaW5nIGFuZCB3cmFwcGluZyBpbiBwYXJlbnRoZXNpcyBpZiBpdCBpcyBvYmplY3RcbiAgICAgICAgICAgICAgICBldmFsX3N0ciA9IGpzX2RhdGEgKyAnXFxuJyArIHRlc3RfZnVuYyArICcoJyArIHRlc3RfaW5wLmpvaW4oKSArICcpOyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZJbnApIHtcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyBqcyBlZGl0b3IgdmFsdWUgYW5kIGNhbGxzIGZ1bmN0aW9uIHdpdGggYXJndW1lbnQgZGVmaW5lZCBpbiB0ZXN0Y2FzZSBhZnRlciB3cmFwcGluZyB0aGUgYXJndW1lbnQgaW4gc3F1YXJlIGJyYWNrZXQgdGhlbiBpbiBwYXJlbnRoZXNpcyBpZiB2YWx1ZSBvZiB2YXJpYWJsZSAnZklucCcgaG9sZHMgMVxuICAgICAgICAgICAgICAgIGV2YWxfc3RyID0ganNfZGF0YSArICdcXG4nICsgdGVzdF9mdW5jICsgJyhbJyArIHRlc3RfaW5wICsgJ10pOyc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGpzIGVkaXRvciB2YWx1ZSBhbmQgY2FsbHMgZnVuY3Rpb24gd2l0aCBhcmd1bWVudCBkZWZpbmVkIGluIHRlc3RjYXNlIGFmdGVyIHdyYXBwaW5nIGFyZ3VtZW50IGluIHBhcmVudGhlc2lzIFxuICAgICAgICAgICAgICAgIGV2YWxfc3RyID0ganNfZGF0YSArICdcXG4nICsgdGVzdF9mdW5jICsgJygnICsgdGVzdF9pbnAgKyAnKTsnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZXZhbHV0ZSB0aGUgc3RyaW5nIGhvbGQgaW4gdmFyaWFibGUgJ2V2YWxfc3RyJyBhbmQgY29udGFpbnMgaXRzIG91dHB1dFxuICAgICAgICAgICAgbGV0IGFjdHVhbF9vdXRwID0gZXZhbChldmFsX3N0cik7XG4gICAgICAgICAgICAvLyByZXR1cm5zIHRydWUvZmFsc2UgaWYgZXZhbHVhdGVkIHZhbHVlIG1hdGhjaGVzIHdpdGggZnVuY3Rpb24gcmV0dXJuIHZhbHVlIGRlZmluZWQgaW4gdGVzdGNhc2VcbiAgICAgICAgICAgIGlmIChhY3R1YWxfb3V0cCA9PSB0ZXN0X291cCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gc2V0cyB0aGUgZXJyb3IgbWVzc2FnZSBpbiBjYXNlIG9mIGVycm9yIFxuICAgICAgICAgICAgZXJyb3JbJ291dHB1dF9lcnJvciddID0gZXJyO1xuICAgICAgICAgICAgLy8gcmV0dXJucyBmcm9tIGZ1bmN0aW9uIGJ5IHJldHVybmluZyB2YWx1ZSAnZmFsc2UnXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAgLy8gc3BsaXRlIHRoZSB0ZXN0Y2FzZSBhbmQgcmV0dXJucyB0aGUgYXJyYXkgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSBvZiBvbGQgb3IgbmV3IHRlc3RjYXNlIGZvcm1hdCBmb3IgbWF0Y2ggaHRtbCBvciBjc3NcbiAgICBmdW5jdGlvbiBzcGxpdENhc2UoY2FzZURhdGEsIHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgaWYgKGNhc2VEYXRhLmluY2x1ZGVzKFwiJFwiKSkge1xuICAgICAgICAgICAgICAgIC8vIGluZGljYXRlcyB0aGUgaXQgaXMgbmV3IHRlc3RjYXNlIGZvcm1hdCBmb3IgY3NzIG1hdGNoXG4gICAgICAgICAgICAgICAgaXNPbGRUZXN0Y2FzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIHNwbGl0ZSBmcm9tIHN5bWJvbCAnJCcgYW5kIHJldHVybnMgdGhlIGFycmF5XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhc2VEYXRhLnNwbGl0KFwiJFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaW5kaWNhdGVzIHRoZSBpdCBpcyBvbGQgdGVzdGNhc2UgZm9ybWF0IGZvciBjc3MgbWF0Y2hcbiAgICAgICAgICAgICAgICBpc09sZFRlc3RjYXNlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAvLyBzcGxpdGUgZnJvbSBzeW1ib2wgJ3snIGFuZCByZXR1cm5zIHRoZSBhcnJheVxuICAgICAgICAgICAgICAgIHJldHVybiBjYXNlRGF0YS5zcGxpdChcIntcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoY2FzZURhdGEuaW5jbHVkZXMoXCI/XCIpKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5kaWNhdGVzIHRoZSBpdCBpcyBuZXcgdGVzdGNhc2UgZm9ybWF0IGZvciBodG1sIG1hdGNoXG4gICAgICAgICAgICAgICAgaXNPbGRUZXN0Y2FzZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIC8vIHNwbGl0ZSBmcm9tIHN5bWJvbCAnPycgYW5kIHJldHVybnMgdGhlIGFycmF5XG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhc2VEYXRhLnNwbGl0KFwiP1wiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaW5kaWNhdGVzIHRoZSBpdCBpcyBvbGQgdGVzdGNhc2UgZm9ybWF0IGZvciBodG1sIG1hdGNoXG4gICAgICAgICAgICAgICAgaXNPbGRUZXN0Y2FzZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gc3BsaXRlIGZyb20gc3ltYm9sICd8JyBhbmQgcmV0dXJucyB0aGUgYXJyYXlcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FzZURhdGEuc3BsaXQoXCJ8XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyAnMCcgb3IgJzEnIGFjY29yZGluZyB0byB0aGUgbWF0Y2ggc3RhdHVzIG9mIHRoZSB0ZXN0Y2FzZSBpbiBodG1sIGVkaXRvclxuICAgIGZ1bmN0aW9uIGNoZWNrT2xkQXR0clRlc3RDYXNlKHBhdHRlcm4sIG91dHAsIG1pbiwgcGFydCkge1xuICAgICAgICAvLyBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgbWF0Y2hlZCBzdHJpbmcgaW4gaHRtbCBlZGl0b3IgZGVmaW5lZCBpbiBtYXRjaGluZyBwYXR0ZXJuXG4gICAgICAgIGxldCBtYXRjaEh0bWwgPSBodG1sRWRpdG9yLmdldFZhbHVlKCkubWF0Y2gocGF0dGVybik7XG4gICAgICAgIC8vIHVzZWQgZm9yIGRlZmluZSB0aGUgdGVzdGNhc2UgcmVzdWx0IHN0YXR1cyBcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgICAgIGlmIChtYXRjaEh0bWwpIHtcbiAgICAgICAgICAgIGlmIChwYXJ0KSB7XG4gICAgICAgICAgICAgICAgLy8gY3JlYXRlcyB0ZW1wb3JhcnkgYXJyYXkgZm9yIGhvbGQgdGhlIG1hdGNoZWQgZGF0YVxuICAgICAgICAgICAgICAgIGxldCB0ZW1wTWF0Y2ggPSBbXTtcbiAgICAgICAgICAgICAgICBtYXRjaEh0bWwubWFwKCh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsdWUucmVwbGFjZSgvXFxzL2csICcnKS5pbmNsdWRlcyhwYXJ0LnJlcGxhY2UoL1xccy9nLCAnJykpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wTWF0Y2gucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2YWx1ZSwgcGFydCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnbWF0Y2hIdG1sJ1xuICAgICAgICAgICAgICAgIG1hdGNoSHRtbCA9IHRlbXBNYXRjaDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtaW4pIHtcbiAgICAgICAgICAgICAgICAvLyBob2xkcyAnMCcgaWYgbnVtYmVyIG9mIG1hdGNoZWQgb2NjdXJlbmNlIGlzIGxlc3MgdGhhbiBtaW4gdmFsdWUgb3RoZXJ3aXNlIGhvbGRzIDFcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBtYXRjaEh0bWwubGVuZ3RoIDwgb3V0cCA/IDAgOiAxO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBob2xkcyAnMCcgaWYgbnVtYmVyIG9mIG9jY3VyZW5jZSBpcyBncmVhdGVyIHRoYW4gbWF4IHZhbHVlIG90aGVyd2lzZSBob2xkcyAxXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gbWF0Y2hIdG1sLmxlbmd0aCA+IG91dHAgPyAwIDogMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyByZXR1cm5zIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSByZXN1bHRcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyByZXR1cm5zICcwJyBvciAnMScgYWNjb3JkaW5nIHRvIHRoZSBtYXRjaCBzdGF0dXMgb2YgdGhlIHRlc3RjYXNlIGluIGh0bWwgZWRpdG9yXG4gICAgZnVuY3Rpb24gY2hlY2tOZXdUZXN0Q2FzZShtaW4sIGNvdW50ZXIsIG91dHApIHtcbiAgICAgICAgLy8gdXNlZCBmb3IgZGVmaW5lIHRoZSB0ZXN0Y2FzZSByZXN1bHQgc3RhdHVzIFxuICAgICAgICBsZXQgcmVzdWx0ID0gMTtcbiAgICAgICAgaWYgKG1pbikge1xuICAgICAgICAgICAgLy8gaG9sZHMgJzAnIGlmIG51bWJlciBvZiBtYXRjaGVkIG9jY3VyZW5jZSBpcyBsZXNzIHRoYW4gbWluIHZhbHVlXG4gICAgICAgICAgICBpZiAoKGNvdW50ZXIpIDwgb3V0cCkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBob2xkcyAnMCcgaWYgbnVtYmVyIG9mIG1hdGNoZWQgb2NjdXJlbmNlIGlzIGdyZWF0ZXIgdGhhbiBtYXggdmFsdWVcbiAgICAgICAgICAgIGlmICgoY291bnRlcikgPiBvdXRwKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBob2xkcyAnMCcgdG9vIGlmIGNvdW50ZXIgdmFsdWUgaXMgMFxuICAgICAgICBpZiAoY291bnRlciA9PSAwKSB7XG4gICAgICAgICAgICByZXN1bHQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIHJldHVybnMgdGhlIHJlc3VsdCB2YWx1ZVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIC8vIHVzZWQgZm9yIGNhbGwgdGhlICdhdHRyX21hdGNoJywgJ3N0eWxlX21hdGNoJyBvciAnc3RyX21hdGNoJyBtZXRob2Qgd2l0aCByZXF1aXJlZCBhcmd1bWVudHMgYW5kIHJldHVybnMgdGhlIHZhbHVlIGFjY29yZGluZyB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIHRoZXNlIG1ldGhvZHNcbiAgICBmdW5jdGlvbiBpbnRlcm5hbENoZWNrKGdldF9jYXNlcykge1xuICAgICAgICAvLyBzcGxpdGUgdGhlIHRlc3RjYXNlIGFuZCByZXR1cm5zIHRoZSBhcnJheSBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIG9sZCBvciBuZXcgdGVzdGNhc2UgZm9ybWF0IGZvciBtYXRjaCBodG1sIG9yIGNzc1xuICAgICAgICBsZXQgY2FzZUFyciA9IHNwbGl0Q2FzZShnZXRfY2FzZXMpO1xuICAgICAgICBsZXQgc3RyID0gXCJcIiwgaTtcbiAgICAgICAgaWYgKGNhc2VBcnJbMF0uaW5kZXhPZihcInN0eWxlX21hdGNoXCIpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZSBvciBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIHJldHVybiB2YWx1ZSBvZiBtZXRob2QgJ3N0eWxlX21hdGNoJ1xuICAgICAgICAgICAgcmV0dXJuIHN0eWxlX21hdGNoKGNhc2VBcnJbMV0sIGNhc2VBcnJbMl0sIGNhc2VBcnJbM10pO1xuICAgICAgICB9IGVsc2UgaWYgKGNhc2VBcnJbMF0uaW5kZXhPZihcImF0dHJfbWF0Y2hcIikgPiAtMSkge1xuICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaW4gY2FzZSBvZiBzdHJpbmcgbWF0Y2hlZCBpbiBkZWZpbmVkIHRhZyBhbmQgdGhhdCB0YWcgY29udGFpbnMgY2hhcmFjdGVyICc/J1xuICAgICAgICAgICAgaWYgKGNhc2VBcnIubGVuZ3RoID4gNCkge1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDI7IGkgPCAoY2FzZUFyci5sZW5ndGggLSAxKTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZHMgdGhlIHN0cmluZyBkZWZpbmVkIGluIGFycmF5ICdjYXNlQXJyJyBhdCBpbmRleCAnMicgaW4gc3RyaW5nIGRlZmluZWQgaW4gdmFyaWFibGUgJ3N0cidcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArIGNhc2VBcnJbaV07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGRzIHRoZSBjaGFyYWN0ZXIgJz8nIGFuZCBzdHJpbmcgZGVmaW5lZCBpbiBhcnJheSAnY2FzZUFycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgaW4gc3RyaW5nIGRlZmluZWQgaW4gdmFyaWFibGUgJ3N0cidcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0ciA9IHN0ciArICc/JyArIGNhc2VBcnJbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyB0cnVlIG9mIGZhbHNlIGFjY29yZGluZyB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIG1ldGhvZCAnYXR0cl9tYXRjaCdcbiAgICAgICAgICAgICAgICByZXR1cm4gYXR0cl9tYXRjaChjYXNlQXJyWzFdLCBzdHIsIGNhc2VBcnJbKGNhc2VBcnIubGVuZ3RoIC0gMSldKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJucyB0cnVlIG9mIGZhbHNlIGFjY29yZGluZyB0byB0aGUgcmV0dXJuIHZhbHVlIG9mIG1ldGhvZCAnYXR0cl9tYXRjaCdcbiAgICAgICAgICAgICAgICByZXR1cm4gYXR0cl9tYXRjaChjYXNlQXJyWzFdLCBjYXNlQXJyWzJdLCBjYXNlQXJyWzNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGluIGNhc2Ugb2Ygc3RyaW5nIG1hdGNoZWQgYW55d2hlcmUgaW4gd2hvbGUgaHRtbCBvciBqcyBlZGl0b3IgYW5kIHRoYXQgZWRpdG9yIGNvbnRhaW5zIGNoYXJhY3RlciAnPydcbiAgICAgICAgICAgIGlmIChjYXNlQXJyLmxlbmd0aCA+IDQpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAyOyBpIDwgKGNhc2VBcnIubGVuZ3RoIC0gMSk7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGRzIHRoZSBzdHJpbmcgZGVmaW5lZCBpbiBhcnJheSAnY2FzZUFycicgYXQgaW5kZXggJzInIGluIHN0cmluZyBkZWZpbmVkIGluIHZhcmlhYmxlICdzdHInXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyBjYXNlQXJyW2ldO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkcyB0aGUgY2hhcmFjdGVyICc/JyBhbmQgc3RyaW5nIGRlZmluZWQgaW4gYXJyYXkgJ2Nhc2VBcnInIGF0IGluZGV4IGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2knIGluIHN0cmluZyBkZWZpbmVkIGluIHZhcmlhYmxlICdzdHInXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHIgPSBzdHIgKyAnPycgKyBjYXNlQXJyW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHJldHVybnMgdHJ1ZSBvZiBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIHJldHVybiB2YWx1ZSBvZiBtZXRob2QgJ3N0cl9tYXRjaCdcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyX21hdGNoKGNhc2VBcnJbMV0sIHN0ciwgY2FzZUFyclsoY2FzZUFyci5sZW5ndGggLSAxKV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHRydWUgb2YgZmFsc2UgYWNjb3JkaW5nIHRvIHRoZSByZXR1cm4gdmFsdWUgb2YgbWV0aG9kICdzdHJfbWF0Y2gnXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cl9tYXRjaChjYXNlQXJyWzFdLCBjYXNlQXJyWzJdLCBjYXNlQXJyWzNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgIC8vIHJldHVybnMgdHJ1ZSBvciBmYWxzZSBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHByb3BlcnR5IHZhbHVlIG9mIGRlZmluZWQgY3NzIHNlbGVjdG9yXG4gICAgZnVuY3Rpb24gc3R5bGVfbWF0Y2goc3JjLCBzZWxlY3RvciwgaW5wKSB7XG4gICAgICAgIC8vIGRlbm90ZXMgdGhlIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgYWNjb3JkaW5nIHRvIHRoZSBtYXRjaGVkIHZhbHVlXG4gICAgICAgIGxldCBmbGFnX2NoZWNrID0gMTtcbiAgICAgICAgLy8gV2luZG93IG9iamVjdCB0aGF0IGFsbG93cyB0byBhY2Nlc3MgdGhlIGlmcmFtZSdzIGRvY3VtZW50IGFuZCBpdHMgaW50ZXJuYWwgRE9NXG4gICAgICAgIGxldCBmcmFtZURvYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Jlc3VsdF9mcmFtZScpWzBdLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHBzZXVkbyBzZWxlY3RvciB1c2VkXG4gICAgICAgIGlmIChzZWxlY3Rvci5pbmRleE9mKFwiOjpcIikgPiAtMSkge1xuICAgICAgICAgICAgLy8gYXJyYXkgb2YgcHNldWRvIHNlbGVjdG9yXG4gICAgICAgICAgICBsZXQgcHNldWRvX2VsbSA9IHNlbGVjdG9yLnNwbGl0KCc6OicpO1xuICAgICAgICAgICAgLy8gc3RyaW5nIGNvbnRhaW5pbmcgcHNldWRvIGNsYXNzIHdpdGggcHJlZml4ICc6J1xuICAgICAgICAgICAgbGV0IHN0ciA9ICc6JyArIHBzZXVkb19lbG1bMV07XG4gICAgICAgICAgICAvLyBzZWxlY3RzIGVsZW1lbnQgb24gd2hpY2ggcHNldWRvIHNlbGVjdGlvbiBhcHBsaWVkXG4gICAgICAgICAgICBsZXQgcHNldWRvX2VsbV9zZWxlY3RvciA9IHBzZXVkb19lbG1bMF07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGluZHgsIG5ld19jbGFzcywgbmV3X3NlbGVjdG9yLCBuZXdfdGFnX25hbWU7XG4gICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIGhvdmVyLCBhY3RpdmUgb3IgdmlzaXRlZCBwc2V1ZG8gY2xhc3MgYXBwbGllZFxuICAgICAgICBpZiAoc2VsZWN0b3IuaW5kZXhPZignOmhvdmVyJykgPiAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKCc6dmlzaXRlZCcpID4gLTEgfHwgc2VsZWN0b3IuaW5kZXhPZignOmFjdGl2ZScpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBsYXN0IGluZGV4IG9mIGNvbG9uIGluIHBzZXVkbyBzZWxlY3RvclxuICAgICAgICAgICAgaW5keCA9IHNlbGVjdG9yLmxhc3RJbmRleE9mKCc6Jyk7XG4gICAgICAgICAgICAvLyBzZWxlY3RzIHRoZSBlbGVtZW50IG9uIHdoaWNoIHBzZXVkbyBjbGFzc2VzIGFwcGxpZWRcbiAgICAgICAgICAgIG5ld19zZWxlY3RvciA9IHNlbGVjdG9yLnN1YnN0cmluZygwLCBpbmR4KTtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBwc2V1ZG8gY2xhc3NcbiAgICAgICAgICAgIGxldCBjbGFzc19uYW1lID0gc2VsZWN0b3Iuc3Vic3RyaW5nKChpbmR4ICsgMSksIHNlbGVjdG9yLmxlbmd0aCk7XG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgdmFsdWUgb2YgcHNldWRvIGNsYXNzIHdpdGggcHJlZml4ICcuJ1xuICAgICAgICAgICAgbmV3X2NsYXNzID0gJy4nICsgY2xhc3NfbmFtZTtcbiAgICAgICAgICAgIGlmIChmcmFtZURvYy5xdWVyeVNlbGVjdG9yKG5ld19zZWxlY3RvcikpIHtcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgbmFtZSBvZiB0aGUgdGFnIG9uIHdoaWNoIHBzZXVkbyBzZWxlY3Rpb24gYXBwbGllZFxuICAgICAgICAgICAgICAgIG5ld190YWdfbmFtZSA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IobmV3X3NlbGVjdG9yKS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZXMgdGhlIGVsZW1lbnQgZGVmaW5lZCBpbiB2YXJpYWJsZSAnbmV3X3RhZ19uYW1lJ1xuICAgICAgICAgICAgICAgIGxldCBjcmVhdGVfZWxtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChuZXdfdGFnX25hbWUpO1xuICAgICAgICAgICAgICAgIC8vIHNldHMgdGhlIGNsYXNzIGF0dHJpYnV0ZSB3aXRoIHZhbHVlIG9mIHBzZXVkbyBjbGFzc1xuICAgICAgICAgICAgICAgIGNyZWF0ZV9lbG0uc2V0QXR0cmlidXRlKCdjbGFzcycsIGNsYXNzX25hbWUpO1xuICAgICAgICAgICAgICAgIC8vIGFwcGVuZCB0aGUgY3JlYXRlZCBlbGVtZW50IGluIGJvZHkgdGFnIHRoYXQgZXhpc3QgaW4gaWZyYW1lIG9mIHJlc3VsdCBmaWVsZFxuICAgICAgICAgICAgICAgIGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKS5hcHBlbmRDaGlsZChjcmVhdGVfZWxtKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gaWYgZWxlbWVudCBub3QgZm91bmQgb24gd2hpY2ggcHNldWRvIHNlbGVjdGlvbiBhcHBsaWVkIHRoZW4gcmV0dXJucyBmYWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHBhdHRlcm4gZm9yIG1hdGNoaW5nIHRoZSB2YWx1ZSBvZiBzdGFydHMgd2l0aCBkZWZpbmVkIHBzZXVkbyBzZWxlY3RvciBhbmQgYW55IG51bWJlciBvZiBzcGFjZSBiZXR3ZWVuIHBzZXVkbyBzZWxlY3RvciBhbmQgb3BlbmluZyBjdXJseSBicmFjZSBhbmQgYW55IHZhbHVlIGNvbnRhaW5pbmcgaW4gY3VybHkgYnJhY2UgaW5jbHVkaW5nIGJyYWNlc1xuICAgICAgICAgICAgbGV0IHBhdHQgPSBuZXcgUmVnRXhwKHNlbGVjdG9yICsgJ1sgXSp7KFtcXFxcc1xcXFxTXSo/KX0nLCBcIlwiKTtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB0ZXh0IG1hdGNoZWQgaW4gc3R5bGUgdGFnIGRlZmluZWQgaW4gdmFyaWFibGUgJ3BhdHQnIGFmdGVyIHJlbW92aW5nIG5ldyBsaW5lIGNoYXJhY3RlclxuICAgICAgICAgICAgbGV0IGlzX21hdGNoZWQgPSBmcmFtZURvYy5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTC5yZXBsYWNlKC9cXFxcbi8sIFwiXCIpLm1hdGNoKHBhdHQpO1xuICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgbWF0Y2hpbmcgZm91bmRcbiAgICAgICAgICAgIGlmIChpc19tYXRjaGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbmluZyB0aGUgdmFsdWUgZGVmaW5lZCB3aXRoIHBzZXVkbyBzZWxlY3RvciBpbiBjdXJseSBicmFjZSBleGNsdWRpbmcgYnJhY2VzXG4gICAgICAgICAgICAgICAgbGV0IHByb3BfYW5kX3ZhbCA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MLnJlcGxhY2UoL1xcXFxuLywgXCJcIikubWF0Y2gocGF0dClbMF0ucmVwbGFjZShwYXR0LCBmdW5jdGlvbiAoZnVsbG1hdGNoLCBwcm9wc052YWwpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJucyB2YWx1ZSBleGlzdCBpbnNpZGUgY3VybHkgYnJhY2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3BzTnZhbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGVzIHRleHROb2RlIGNvbnRhaW5pbmcgdmFsdWUgb2YgdmFyaWFibGUgJ25ld19jbGFzcycgYW5kIHZhbHVlIG9mIHZhcmlhYmxlICdwcm9wX2FuZF92YWwnIGFmdGVyIHdyYXBpbmcgaXQgaW4gY3VybHkgYnJhY2VcbiAgICAgICAgICAgICAgICBsZXQgdHh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobmV3X2NsYXNzICsgJ3snICsgcHJvcF9hbmRfdmFsICsgJ30nKTtcbiAgICAgICAgICAgICAgICAvLyBhcHBlbmQgdGhpcyB0ZXh0IHRvIHN0eWxlIHRhZ1xuICAgICAgICAgICAgICAgIGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuYXBwZW5kQ2hpbGQodHh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuIGZhbHNlIGlmIGRlZmluZWQgcGF0dGVybiBub3QgbWF0Y2hlZCBpbiBzdHlsZSB0YWdcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gdXNlZCBmb3Igc2VsZWN0IHRoZSBlbGVtZW50XG4gICAgICAgIGxldCBkYXRhO1xuICAgICAgICBpZiAobmV3X2NsYXNzICYmIGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IoJ3N0eWxlJykuaW5uZXJIVE1MLnJlcGxhY2UoL1xcXFxuLywgXCJcIikubWF0Y2gobmV3X2NsYXNzKSkge1xuICAgICAgICAgICAgLy8gc2VsZWN0cyBlbGVtZW50IGhhdmUgY2xhc3MgYXR0cmlidXRlIHRoYXQgaXMgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnbmV3X2NsYXNzJ1xuICAgICAgICAgICAgZGF0YSA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3IobmV3X2NsYXNzKTtcbiAgICAgICAgfSBlbHNlIGlmIChwc2V1ZG9fZWxtX3NlbGVjdG9yKSB7XG4gICAgICAgICAgICAvLyBzZWxlY3RzIGVsZW1lbnQgd2l0aCB0YWcgbmFtZSB0aGF0IGlzIGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ3BzZXVkb19lbG1fc2VsZWN0b3InXG4gICAgICAgICAgICBkYXRhID0gZnJhbWVEb2MucXVlcnlTZWxlY3Rvcihwc2V1ZG9fZWxtX3NlbGVjdG9yKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNlbGVjdHMgZWxlbWVudCB3aXRoIGNzcyBzZWxlY3RvciBkZWZpbmVkIGluIHZhcmlhYmxlICdzZWxlY3RvcidcbiAgICAgICAgICAgIGRhdGEgPSBmcmFtZURvYy5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzcGxpdGUgdGhlIHRlc3RjYXNlIGFuZCByZXR1cm5zIHRoZSBhcnJheSBhY2NvcmRpbmcgdG8gdGhlIHZhbHVlIG9mIG9sZCBvciBuZXcgdGVzdGNhc2UgZm9ybWF0IGZvciBtYXRjaCBjc3NcbiAgICAgICAgbGV0IGlucHV0ID0gc3BsaXRDYXNlKGlucCwgJ3N0eWxlJyk7XG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBjc3MgcHJvcGVydHkgdGhhdCBleGlzdCBpbiBhcnJheSAnaW5wdXQnIGF0IGluZGV4ICcwJ1xuICAgICAgICBsZXQgb3V0cCA9IGlucHV0WzFdO1xuICAgICAgICAvLyBmb3IgY29udGFpbiB0aGUgdmFsdWUgb2YgY3NzIHByb3BlcnR5IG9mIGRlZmluZWQgY3NzIHNlbGVjdG9yXG4gICAgICAgIGxldCBjaGVja1N0eWxlO1xuICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBwc2V1ZG8gY2xhc3MgZGVmaW5lZFxuICAgICAgICBpZiAoc3RyKSB7XG4gICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBzZWxlY3RvciBlbGVtZW50IGRlZmluZWRcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mIGNzcyBwcm9wZXJ0eSBkZWZpbmVkIGluIGFycmF5ICdpbnB1dCcgYXQgaW5kZXggJzAnIG9mIGVsZW1lbnQgdGhhdCBpcyBzdG9yZWQgaW4gdmFyaWFibGUgJ2RhdGEnIGFuZCBoYXZlIHBzZXVkbyBjbGFzcyB3aGljaCBpcyBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdzdHInXG4gICAgICAgICAgICAgICAgY2hlY2tTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRhdGEsIHN0cikuZ2V0UHJvcGVydHlWYWx1ZShpbnB1dFswXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBzZWxlY3RvciBlbGVtZW50IGRlZmluZWRcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mIGNzcyBwcm9wZXJ0eSBkZWZpbmVkIGluIGFycmF5ICdpbnB1dCcgYXQgaW5kZXggJzAnIG9mIGVsZW1lbnQgdGhhdCBpcyBzdG9yZWQgaW4gdmFyaWFibGUgJ2RhdGEnXG4gICAgICAgICAgICAgICAgY2hlY2tTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRhdGEpLmdldFByb3BlcnR5VmFsdWUoaW5wdXRbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHBzZXVkbyBjbGFzcyBleGlzdFxuICAgICAgICBpZiAoc2VsZWN0b3IuaW5kZXhPZignOmhvdmVyJykgPiAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKCc6dmlzaXRlZCcpID4gLTEgfHwgc2VsZWN0b3IuaW5kZXhPZignOmFjdGl2ZScpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIHNlbGVjdHMgdGhlIGVsZW1lbnQgdGhhdCBoYXZlIGNsYXNzIHdoaWNoIGlzIHByZXZpb3VzbHkgZGVmaW5lZCB1c2luZyBwZXN1ZG8gY2xhc3NcbiAgICAgICAgICAgIGxldCBkZWxldGVfZWxtID0gZnJhbWVEb2MuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShjbGFzc19uYW1lKVswXTtcbiAgICAgICAgICAgIC8vIHJlbW92ZXMgdGhlIGVsZW1lbnQgaGF2ZSBjbGFzcyB3aGljaCBpcyBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdkZWxldGVfZWxtJ1xuICAgICAgICAgICAgZGVsZXRlX2VsbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRlbGV0ZV9lbG0pO1xuICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgdGV4dE5vZGUgZnJvbSBzdHlsZSB0YWcgdGhhdCB3YXMgcHJldmlvdXNseSBhZGRlZFxuICAgICAgICAgICAgZnJhbWVEb2MucXVlcnlTZWxlY3Rvcignc3R5bGUnKS5pbm5lckhUTUwgPSBmcmFtZURvYy5xdWVyeVNlbGVjdG9yKCdzdHlsZScpLmlubmVySFRNTC5yZXBsYWNlKC9cXFxcbi9nbSwgXCJcIikucmVwbGFjZSh0eHQudGV4dENvbnRlbnQsIFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNldHMgdGhlIHZhbHVlICcwJyBvZiB2YXJpYWJsZSAnZmxhZ19jaGVjaycgaWYgZGVmaW5lZCB2YWx1ZSBvZiB0ZXN0Y2FzZSBjc3MgcHJvcGVydHkgaXMgbm90IGVxdWFscyB0byB0aGUgbWF0Y2hlZCB2YWx1ZSBvZiBjc3MgcHJvcGVydHkgZm9yIGRlZmluZWQgY3NzIHNlbGVjdG9yXG4gICAgICAgIGlmIChjaGVja1N0eWxlICE9IG91dHApIHtcbiAgICAgICAgICAgIGZsYWdfY2hlY2sgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmV0dXJucyB0cnVlIG9mIGZhbHNlIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2ZsYWdfY2hlY2snXG4gICAgICAgIGlmIChmbGFnX2NoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVzZWQgZm9yIHJldHVybiB0aGUgcmVzdWx0IHN0YXR1cyBvZiB0aGUgdGVzdGNhc2VzIGRlZmluZWQgZm9yIG1hdGNoIGluIGh0bWwgZWRpdG9yICBcbiAgICBmdW5jdGlvbiBhdHRyX21hdGNoKHNyYywgaW5wLCBvdXRwKSB7XG4gICAgICAgIGxldCBmbGFnX2NoZWNrID0gMSwgLy8gYnkgZGVmYXVsdCBzZXRzIHRoZSB2YWx1ZSAxIHRoYXQgaW5kaWNhdGVzIHRoYXQgbWF0Y2hpbmcgaXMgb2tcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCB0YWcgbWF0Y2hpbmcgaXMgcmVxdWlyZWRcbiAgICAgICAgICAgIHNpbmd1bGFyID0gMCxcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCBzdHJpbmcgbWF0Y2hpbmcgaXMgcmVxdWlyZWQgaW4gZGVmaW5lZCB0YWcgXG4gICAgICAgICAgICBqdXN0U3RyaW5nID0gMCxcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCBhdHRyaWJ1dGUgbWF0Y2hpbmcgaXMgcmVxdWlyZWQgb2YgZGVmaW5lZCB0YWcgXG4gICAgICAgICAgICBoYXNUYWdzQXR0cmlidXRlID0gMCxcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCBhdHRyaWJ1dGUgYW5kIHRoZWlyIHZhbHVlIG1hdGNoaW5nIGlzIHJlcXVpcmVkIG9mIGRlZmluZWQgdGFnIFxuICAgICAgICAgICAgaGFzVGFnc0F0dHJpYnV0ZVZhbHVlID0gMCxcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCAnbWF4JyBmbGFnIGlzIG5vdCBlbmFibGVkXG4gICAgICAgICAgICBtYXggPSBmYWxzZSxcbiAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCAnbWluJyBmbGFnIGlzIG5vdCBlbmFibGVkXG4gICAgICAgICAgICBtaW4gPSBmYWxzZTtcbiAgICAgICAgbGV0IGk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoaW5wLmluZGV4T2YoXCJ7MX1cIikgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCB0ZXN0Y2FzZSBpcyBkZWZpbmVkIGZvciBtYXRjaCB0YWcgaW4gaHRtbCBlZGl0b3JcbiAgICAgICAgICAgICAgICBzaW5ndWxhciA9IDE7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZmxhZyAnezF9JyBmcm9tIHRlc3RjYXNlIHN0cmluZ1xuICAgICAgICAgICAgICAgIGlucCA9IGlucC5yZXBsYWNlKFwiezF9XCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucC5pbmRleE9mKFwiezJ9XCIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBkZW5vdGVzIHRoYXQgdGVzdGNhc2UgaXMgZGVmaW5lZCBmb3IgbWF0Y2ggc3RyaW5nIGluIGRlZmluZWQgdGFnIGluIGh0bWwgZWRpdG9yXG4gICAgICAgICAgICAgICAganVzdFN0cmluZyA9IDE7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZmxhZyAnezJ9JyBmcm9tIHRlc3RjYXNlIHN0cmluZ1xuICAgICAgICAgICAgICAgIGlucCA9IGlucC5yZXBsYWNlKFwiezJ9XCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucC5pbmRleE9mKFwiezN9XCIpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAvLyBkZW5vdGVzIHRoYXQgdGVzdGNhc2UgaXMgZGVmaW5lZCBmb3IgbWF0Y2ggb25seSBhdHRyaWJ1dGUgbm90IHRoZWlyIHZhbHVlIG9mIGRlZmluZWQgdGFnIGluIGh0bWwgZWRpdG9yXG4gICAgICAgICAgICAgICAgaGFzVGFnc0F0dHJpYnV0ZSA9IDE7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgZmxhZyAnezN9JyBmcm9tIHRlc3RjYXNlIHN0cmluZ1xuICAgICAgICAgICAgICAgIGlucCA9IGlucC5yZXBsYWNlKFwiezN9XCIsIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGlucC5pbmRleE9mKFwiezR9XCIpID4gLTEpIHsgLy9pZiBjaGVjayB2YWx1ZSBvZiBhdHRyaWJ1dGUgb25seVxuICAgICAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCB0ZXN0Y2FzZSBpcyBkZWZpbmVkIGZvciBtYXRjaCBhdHRyaWJ1dGUgYW5kIHRoZWlyIHZhbHVlIG9mIGRlZmluZWQgdGFnIGluIGh0bWwgZWRpdG9yXG4gICAgICAgICAgICAgICAgaGFzVGFnc0F0dHJpYnV0ZVZhbHVlID0gMTtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmVzIHRoZSBmbGFnICd7NH0nIGZyb20gdGVzdGNhc2Ugc3RyaW5nXG4gICAgICAgICAgICAgICAgaW5wID0gaW5wLnJlcGxhY2UoXCJ7NH1cIiwgXCJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAob3V0cC5pbmRleE9mKCdtaW4nKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gZGVub3RlcyB0aGF0ICdtaW4nIGZsYWcgaXMgZW5hYmxlZFxuICAgICAgICAgICAgICAgIG1pbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgJ21pbicgdGV4dCBmcm9tIGRlZmluZWQgZmxhZyBhbmQgY29udGFpbnMgdGhlIG51bWVyaWMgdmFsdWUgb25seVxuICAgICAgICAgICAgICAgIG91dHAgPSBwYXJzZUludChvdXRwLnJlcGxhY2UoJ21pbicsICcnKSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG91dHAuaW5kZXhPZignbWF4JykgPiAtMSkge1xuICAgICAgICAgICAgICAgIC8vIGRlbm90ZXMgdGhhdCAnbWF4JyBmbGFnIGlzIGVuYWJsZWRcbiAgICAgICAgICAgICAgICBtYXggPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZXMgdGhlICdtYXgnIHRleHQgZnJvbSBkZWZpbmVkIGZsYWcgYW5kIGNvbnRhaW5zIHRoZSBudW1lcmljIHZhbHVlIG9ubHlcbiAgICAgICAgICAgICAgICBvdXRwID0gcGFyc2VJbnQob3V0cC5yZXBsYWNlKCdtYXgnLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNyYyA9PSBcIkhUTUxcIikge1xuICAgICAgICAgICAgICAgIC8vIFdpbmRvdyBvYmplY3QgdGhhdCBhbGxvd3MgdG8gYWNjZXNzIHRoZSBpZnJhbWUncyBkb2N1bWVudCBhbmQgaXRzIGludGVybmFsIERPTVxuICAgICAgICAgICAgICAgIGxldCBmcmFtZURvYyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3Jlc3VsdF9mcmFtZScpWzBdLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gICAgICAgICAgICAgICAgLy8gaW4gY2FzZSBvZiB0YWcgbWF0Y2ggZW50ZXJzIGluIHRoaXMgYmxvY2tcbiAgICAgICAgICAgICAgICBpZiAoc2luZ3VsYXIpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgbnVtYmVyIG9mIG1hdGNoaW5nIHRhZyBleGlzdFxuICAgICAgICAgICAgICAgICAgICBsZXQgbGVuZ3RoQ2hlY2sgPSBmcmFtZURvYy5nZXRFbGVtZW50c0J5VGFnTmFtZShpbnApLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaW4gY2FzZSBvZiBtaW4gZmxhZyBpcyBlbmFibGVkXG4gICAgICAgICAgICAgICAgICAgIGlmIChtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldHMgdGhlIHZhbHVlIG9mIHZhcmlhYmxlIGZsYWdfY2hlY2sgJzAnIGluIGNhc2Ugb2YgZGVmaW5lZCBtaW4gdmFsdWUgaXMgZ3JlYXRlciB0aGFuIG51bWJlciBvZiBtYXRjaGluZyB0YWdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW5ndGhDaGVjayA8IG91dHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNldHMgdGhlIHZhbHVlIG9mIHZhcmlhYmxlIGZsYWdfY2hlY2sgJzAnIGluIGNhc2Ugb2YgZGVmaW5lZCBtYXggdmFsdWUgaXMgbGVzcyB0aGFuIG51bWJlciBvZiBtYXRjaGluZyB0YWdcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsZW5ndGhDaGVjayA+IG91dHApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCB0YWdfbmFtZSwgYWxsQ2hlY2ssIGNvdW50ZXIgPSAwLCBzdHJfZGF0YSA9IFwiXCIsIG1hdGNoX3N0ciA9IFwiXCI7XG4gICAgICAgICAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGluIGNhc2Ugb2YgdGVzdGNhc2UgZGVmaW5lZCBmb3IgbWF0Y2ggc3RyaW5nIGluIHBlcnRpY3VsYXIgdGFnXG4gICAgICAgICAgICAgICAgICAgIGlmIChqdXN0U3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyBhbiBhcnJheSBhZnRlciBzcGxpdGluZyB0ZXN0Y2FzZSB2YWx1ZSB3aXRoICd7J1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFnX25hbWUgPSBpbnAuc3BsaXQoJ3snKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWdfbmFtZS5sZW5ndGggPiAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMTsgaSA8IHRhZ19uYW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFkZHMgdGhlIHN0cmluZyBkZWZpbmVkIGluIGFycmF5IHRhZ19uYW1lIGF0IGluZGV4ICcxJyBpbiBzdHJpbmcgJ3N0cl9kYXRhJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyX2RhdGEgPSBzdHJfZGF0YSArIHRhZ19uYW1lW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkcyB0aGUgc3RyaW5nICd7JyBhbmQgc3RyaW5nIGRlZmluZWQgaW4gYXJyYXkgdGFnX25hbWUgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaScgaW4gc3RyaW5nICdzdHJfZGF0YSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cl9kYXRhID0gc3RyX2RhdGEgKyAneycgKyB0YWdfbmFtZVtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhZGRzIHRoZSBzdHJpbmcgJ3N0cl9kYXRhJyBpbiBzdHJpbmcgJ21hdGNoX3N0cidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaF9zdHIgPSBtYXRjaF9zdHIgKyBzdHJfZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWRkcyB0aGUgc3RyaW5nIGRlZmluZWQgaW4gYXJyYXkgdGFnX25hbWUgYXQgaW5kZXggJzEnIGluIHN0cmluZyAnbWF0Y2hfc3RyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoX3N0ciA9IG1hdGNoX3N0ciArIHRhZ19uYW1lWzFdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgdGVzdGNhc2UgaXMgZGVmaW5lZCBpbiBvbGQgZm9ybWF0XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNPbGRUZXN0Y2FzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZXMgcGF0dGVybiB0byBtYXRjaCB0aGUgc3RyaW5nIGluc2lkZSBhbnkgdGFnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNoZWNrSHRtbCA9IG5ldyBSZWdFeHAoYDwuKj8+KCR7dGFnX25hbWVbMF19KTxcXC8uKj8+YCwgJ2dpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gY2hlY2tPbGRBdHRyVGVzdENhc2UoY2hlY2tIdG1sLCBvdXRwLCBtaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxlY3RzIGFsbCB0YWcgaW4gd2hpY2ggc3RyaW5nIGV4aXN0aW5nIGhhdmUgdG8gY2hlY2tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGxDaGVjayA9IGZyYW1lRG9jLnF1ZXJ5U2VsZWN0b3JBbGwodGFnX25hbWVbMF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxvb3BzIHRocm91Z2ggdGhlIGF2YWlsYWJsZSB0YWdzIGluIHdoaWNoIHN0cmluZyBleGlzdGluZyBoYXZlIHRvIGNoZWNrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFsbENoZWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgoYWxsQ2hlY2tbaV0uaW5uZXJIVE1MKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZ20sICcnKS50cmltKCkuaW5kZXhPZigobWF0Y2hfc3RyKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1xccysvZ20sICcnKS50cmltKCkpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlcyB0aGUgdmFsdWUgb2YgdmFyaWFibGUgY291bnRlciBieSAxIGlmIHN0cmluZyBleGlzdCBpbiBkZWZpbmVkIHRhZ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zICcwJyBvciAnMScgYWNjb3JkaW5nIHRvIHRoZSBtYXRjaCBzdGF0dXMgb2YgdGhlIHRlc3RjYXNlIGluIGh0bWwgZWRpdG9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IGNoZWNrTmV3VGVzdENhc2UobWluLCBjb3VudGVyLCBvdXRwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNUYWdzQXR0cmlidXRlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgYXJyYXkgb2YgdGVzdGNhc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhZ19uYW1lID0gaW5wLnNwbGl0KCd7Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNPbGRUZXN0Y2FzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHBhdHRlcm4gZm9yIG1hdGNoIHRoZSBkZXNpemUgYXR0cmlidXRlIGNvbnRhaW5pbmcgYW55IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGF0dHJSZWcgPSBuZXcgUmVnRXhwKGAke3RhZ19uYW1lWzBdfShcXFxccyo9XFxcXHMqKVtcIiddPygoPzouKD8hW1wiJ10/XFxcXHMrKD86XFxcXFMrKT18Wz5cIiddKSkrLilbXCInXT9gLCAnZ2knKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyAnMCcgb3IgJzEnIGFjY29yZGluZyB0byB0aGUgbWF0Y2ggc3RhdHVzIG9mIHRoZSB0ZXN0Y2FzZSBpbiBodG1sIGVkaXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSBjaGVja09sZEF0dHJUZXN0Q2FzZShhdHRyUmVnLCBvdXRwLCBtaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghZmxhZ19jaGVjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXR0ZXJuIGZvciBtYXRjaCB0aGUgd2hvbGUgdmFsdWUgc3RhcnRzIGZyb20gY2hhcmFjdGVyICc8JyBhbmQgZW5kcyBhdCAnPidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5leHRUcnkgPSBuZXcgUmVnRXhwKGA8KFxcXFx3KykoLio/KT5gLCAnZ2knKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYXJyYXkgY29udGFpbmluZyBtYXRjaGVkIHN0cmluZyBpbiBodG1sIGVkaXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbWF0Y2hUZXh0ID0gaHRtbEVkaXRvci5nZXRWYWx1ZSgpLm1hdGNoKG5leHRUcnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZXRzIHRydWUgb2YgZmFsc2UgYWNjb3JkaW5nIHRvIHRoZSB2YWx1ZSBvZiBhcnJheSBtYXRjaFRleHQgYXQgaW5kZXggMCBhbmQgaXQgY29udGFpbnMgdGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSBkZWZpbmVkIGluIGFycmF5IHRhZ19uYW1lIGF0IGluZGV4IDBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IG1hdGNoVGV4dFswXSAmJiBtYXRjaFRleHRbMF0uaW5jbHVkZXModGFnX25hbWVbMF0pID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VsZWN0cyBhbGwgdGFncyBpbiBpZnJhbWUgdGhhdCBpcyBkZWZpbmVkIGluIHRlc3RjYXNlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsbENoZWNrID0gZnJhbWVEb2MucXVlcnlTZWxlY3RvckFsbCh0YWdfbmFtZVswXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGFsbENoZWNrLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhbGxDaGVja1tpXS5oYXNBdHRyaWJ1dGUodGFnX25hbWVbMV0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmNyZWFzZXMgdGhlIHZhbHVlIG9mIGNvdW50ZXIgaWYgYXR0cmlidXRlIG1hdGNoZWQgaW4gYW55IHRhZyBkZWZpbmVkIGluIHRlc3RjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gY2hlY2tOZXdUZXN0Q2FzZShtaW4sIGNvdW50ZXIsIG91dHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGhhc1RhZ3NBdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIGFycmF5IG9mIHRlc3RjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICB0YWdfbmFtZSA9IGlucC5zcGxpdCgneycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzT2xkVGVzdGNhc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhcnJheSBjb250YWlucyBhdHRyaWJ1dGUgYXQgaW5kZXggJzAnIGFuZCBpdHMgdmFsdWUgYXQgaW5kZXggJzEnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFnX25hbWUgPSBpbnAuc3BsaXQoJyQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBwYXR0ZXJuIGZvciBtYXRjaCB0aGUgZGVzaXplIGF0dHJpYnV0ZSBjb250YWluaW5nIGFueSB2YWx1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBhdHRyVmFsdWVSZWcgPSBuZXcgUmVnRXhwKGAke3RhZ19uYW1lWzBdfShcXFxccyo9XFxcXHMqKVtcIiddPygoPzouKD8hW1wiJ10/XFxcXHMrKD86XFxcXFMrKT18Wz5cIiddKSkrLilbXCInXT9gLCAnZ2knKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyAnMCcgb3IgJzEnIGFjY29yZGluZyB0byB0aGUgbWF0Y2ggc3RhdHVzIG9mIHRoZSB0ZXN0Y2FzZSBpbiBodG1sIGVkaXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSBjaGVja09sZEF0dHJUZXN0Q2FzZShhdHRyVmFsdWVSZWcsIG91dHAsIG1pbiwgdGFnX25hbWVbMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzZWxlY3RzIGFsbCB0YWdzIGluIGlmcmFtZSB0aGF0IGlzIGRlZmluZWQgaW4gdGVzdGNhc2UgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxsQ2hlY2sgPSBmcmFtZURvYy5xdWVyeVNlbGVjdG9yQWxsKHRhZ19uYW1lWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYWxsQ2hlY2subGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mIGRlZmluZWQgYXR0cmlidXRlIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgYSA9IGFsbENoZWNrW2ldLmdldEF0dHJpYnV0ZSh0YWdfbmFtZVsxXSkgPyBhbGxDaGVja1tpXS5nZXRBdHRyaWJ1dGUodGFnX25hbWVbMV0pIDogXCJcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgc2VtaWNvbG9uIGZyb20gdmFsdWUgb2YgZGVmaW5lZCBhdHRyaWJ1dGVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYSA9IGEucmVwbGFjZSgvOy9nLCAnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhLnJlcGxhY2UoL1xccysvZywgJycpLnRyaW0oKSA9PSB0YWdfbmFtZVsyXS5yZXBsYWNlKC9cXHMrL2csICcnKS50cmltKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY3JlYXNlcyB0aGUgdmFsdWUgb2YgY291bnRlciBieSAxIGlmIG1hdGNoZWQgdmFsdWUgb2YgZGVmaW5lZCBhdHRyaWJ1dGUgaXMgZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiBkZWZpbmVkIHZhbHVlIGluIHRlc3RjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29udGFpbnMgJzAnIG9yICcxJyBhY2NvcmRpbmcgdG8gdGhlIG1hdGNoIHN0YXR1cyBvZiB0aGUgdGVzdGNhc2UgaW4gaHRtbCBlZGl0b3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gY2hlY2tOZXdUZXN0Q2FzZShtaW4sIGNvdW50ZXIsIG91dHApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmV0dXJucyB0cnVlIG9yIGZhbHNlIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgZmxhZ19jaGVja1xuICAgICAgICAgICAgcmV0dXJuIChmbGFnX2NoZWNrID8gdHJ1ZSA6IGZhbHNlKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIC8vIG1lc3NhZ2UgdGhlIGxvZyBvbiBjb25zb2xlIGluIGNhc2Ugb2YgYW55IGVycm9yIG9jY3VyZWRcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgZXJyb3IsIGZ1bmM6ICdhdHRyX21hdGNoJywgJ0NhdXNlJzogJ09sZCBDYXNlLCBuZWVkIHRvIGNvbnZlcnQgbGlrZSBhdHRyX21hdGNoP0hUTUw/VEFHe0FUVFJ7VmFsdWV7TWF0Y2hUeXBlfT9NQVgvTUlOJyB9KTtcbiAgICAgICAgICAgIC8vIHJldHVybnMgZmFsc2UgaW4gY2FzZSBvZiBhbnkgZXJyb3Igb2NjdXJlZFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgIC8vIHVzZWQgZm9yIG1hdGNoIHRlc3RjYXNlIHN0cmluZyBpbiB3aG9sZSBodG1sL2pzIGVkaXRvciBpbiBjYXNlIG9mIGh0bWwvanMgYW5kIGluIGNhc2Ugb2YgY3NzIGl0IG1hdGNoZXMgdGhlIG1lZGlhIHF1ZXJ5LCBjc3Mgc2VsZWN0b3IgYW5kIGNzcyBwcm9wZXJ0eSBkZWZpbmVkIHRvZ2V0aGVyIGluIHdob2xlIGNzcyBlZGl0b3IgXG4gICAgZnVuY3Rpb24gc3RyX21hdGNoKHNyYywgaW5wLCBvdXRwKSB7XG4gICAgICAgIC8vIGluZGljYXRlcyB0aGF0IHN0cmluZyBpcyBtYXRjaGVkIGluIGh0bWwvanMgZWRpdG9yIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgYXJndW1lbnQgdmFyaWFibGUgJ3NyYydcbiAgICAgICAgbGV0IGZsYWdfY2hlY2sgPSAxLFxuICAgICAgICAgICAgc2luZ3VsYXIgPSAwLFxuICAgICAgICAgICAganVzdFN0cmluZyA9IDAsXG4gICAgICAgICAgICBjb21wbGV4VGFncyA9IDAsXG4gICAgICAgICAgICB0YWdfZGF0YSA9IFwiXCIsXG4gICAgICAgICAgICBtYXggPSBmYWxzZSxcbiAgICAgICAgICAgIG1pbiA9IGZhbHNlO1xuICAgICAgICBsZXQgaW5wdXRfZGF0YSA9IGlucDtcbiAgICAgICAgaWYgKGlucC5pbmRleE9mKFwiezF9XCIpID4gLTEpIHtcbiAgICAgICAgICAgIC8vIGl0IGlzIG5vdCBpbiB1c2UgZm9yIHRoaXMgZnVuY3Rpb25cbiAgICAgICAgICAgIHNpbmd1bGFyID0gMTtcbiAgICAgICAgICAgIC8vIHJlbW92ZXMgdGhlIGZsYWcgJ3sxfScgZnJvbSB0ZXN0Y2FzZSBzdHJpbmdcbiAgICAgICAgICAgIGlucCA9IGlucC5yZXBsYWNlKFwiezF9XCIsIFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnAuaW5kZXhPZihcInsyfVwiKSA+IC0xKSB7XG4gICAgICAgICAgICAvLyBpdCBpcyBub3QgaW4gdXNlIGZvciB0aGlzIGZ1bmN0aW9uXG4gICAgICAgICAgICBqdXN0U3RyaW5nID0gMTtcbiAgICAgICAgICAgIC8vIHJlbW92ZXMgdGhlIGZsYWcgJ3syfScgZnJvbSB0ZXN0Y2FzZSBzdHJpbmdcbiAgICAgICAgICAgIGlucCA9IGlucC5yZXBsYWNlKFwiezJ9XCIsIFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbnAuaW5kZXhPZihcInszfVwiKSA+IC0xKSB7XG4gICAgICAgICAgICAvLyBpdCBpcyBub3QgaW4gdXNlIGZvciB0aGlzIGZ1bmN0aW9uXG4gICAgICAgICAgICBjb21wbGV4VGFncyA9IDE7XG4gICAgICAgICAgICAvLyByZW1vdmVzIHRoZSBmbGFnICd7M30nIGZyb20gdGVzdGNhc2Ugc3RyaW5nXG4gICAgICAgICAgICBpbnAgPSBpbnAucmVwbGFjZShcInszfVwiLCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3V0cC5pbmRleE9mKCdtaW4nKSA+IC0xKSB7XG4gICAgICAgICAgICAvLyBpbmRpY2F0ZXMgdGhhdCAnbWluJyBmbGFnIGlzIGVuYWJsZVxuICAgICAgICAgICAgbWluID0gdHJ1ZTtcbiAgICAgICAgICAgIC8vIHJlbW92ZXMgdGhlICdtaW4nIHRleHQgZnJvbSBkZWZpbmVkIGZsYWcgYW5kIGNvbnRhaW5zIHRoZSBudW1lcmljIHZhbHVlXG4gICAgICAgICAgICBvdXRwID0gcGFyc2VJbnQob3V0cC5yZXBsYWNlKCdtaW4nLCAnJykpO1xuICAgICAgICB9IGVsc2UgaWYgKG91dHAuaW5kZXhPZignbWF4JykgPiAtMSkge1xuICAgICAgICAgICAgLy8gaW5kaWNhdGVzIHRoYXQgJ21heCcgZmxhZyBpcyBlbmFibGVcbiAgICAgICAgICAgIG1heCA9IHRydWU7XG4gICAgICAgICAgICAvLyByZW1vdmVzIHRoZSAnbWF4JyB0ZXh0IGZyb20gZGVmaW5lZCBmbGFnIGFuZCBjb250YWlucyB0aGUgbnVtZXJpYyB2YWx1ZVxuICAgICAgICAgICAgb3V0cCA9IHBhcnNlSW50KG91dHAucmVwbGFjZSgnbWF4JywgJycpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb250YWlucyBhcnJheSBvZiBlYWNoIGNoYXJhY3RlclxuICAgICAgICBsZXQgd29yZF9hcnIgPSBpbnAuc3BsaXQoXCJcIik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgd29yZF9hcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh3b3JkX2FycltpXS5tYXRjaCgvXFxXL2cpKSB7XG4gICAgICAgICAgICAgICAgLy8gYWRkcyBmbGFnICdcXFxcJyBiZWZvcmUgbm9uIHdvcmQgY2hhcmFjdGVyIFxuICAgICAgICAgICAgICAgIHdvcmRfYXJyW2ldID0gXCJcXFxcXCIgKyB3b3JkX2FycltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb252ZXJ0cyBhcnJheSAnd29yZF9hcnInIGludG8gc3RyaW5nIGFmdGVyIGFwcGx5aW5nIGZsYWcgJ1xcXFwnIGJlZm9yZSBub24gd29yZCBjaGFyYWN0ZXJcbiAgICAgICAgaW5wID0gd29yZF9hcnIuam9pbihcIlwiKTtcbiAgICAgICAgLy8gaW4gY2FzZSBvZiAnc3RyX21hdGNoJyBpbiBodG1sLCBzdHJpbmcgbWF0Y2hlZCBpbiB3aG9sZSBodG1sIHBhcnQgc28gbm8gbmVlZCBvZiB0aGlzIGJsb2NrXG4gICAgICAgIGlmIChzcmMgPT0gJ0hUTUwnKSB7XG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgdGVzdGNhc2UgZGF0YSB0aGF0IGhhdmUgdG8gYmUgbWF0Y2hcbiAgICAgICAgICAgIHRhZ19kYXRhID0gaW5wO1xuICAgICAgICAgICAgLy8gY29udGFpbnMgc3RyaW5nIGRhdGEgdGhhdCBoYXZlIHRvIGJlIG1hdGNoXG4gICAgICAgICAgICBpbnAgPSBqdXN0U3RyaW5nID8gaW5wIDogKGNvbXBsZXhUYWdzID8gXCJcXDxcIiArIGlucCArIFwiLio/XFw+Lio/XFw8XFwvXCIgKyBpbnAgKyBcIlxcPlwiIDogKHNpbmd1bGFyID8gJzwnICsgaW5wLnJlcGxhY2UoJ1snLCAnICcpLnJlcGxhY2UoJ10nLCAnJykgKyAnKHwgfFxcL3wgXFwvKT4nIDogJzwnICsgaW5wLnJlcGxhY2UoJ1snLCAnICcpLnJlcGxhY2UoJ10nLCAnJykgKyAnPicgKyAnLio/XFw8XFwvJyArIHRhZ19kYXRhICsgJ1xcPicpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBjb250YWlucyBwYXR0ZXJuIHRvIGJlIG1hdGNoIGRlZmluZWQgdGVzdGNhc2UgaW4gXG4gICAgICAgIGxldCByZSA9IFwiXCIsXG4gICAgICAgICAgICAvLyBjb250YWluZXIgZm9yIGhvbGQgdGhlIGh0bWwgZWRpdG9yIHZhbHVlXG4gICAgICAgICAgICBodG1sX3RhZ3MgPSBcIlwiLFxuICAgICAgICAgICAgLy8gY29udGFpbmVyIGZvciBob2xkIHRoZSBjc3MgZWRpdG9yIHZhbHVlXG4gICAgICAgICAgICBjc3NfZGF0YSA9IFwiXCIsXG4gICAgICAgICAgICAvLyBjb250YWluZXIgZm9yIGhvbGQgdGhlIGpzIGVkaXRvciB2YWx1ZVxuICAgICAgICAgICAganNfZGF0YSA9IFwiXCI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBjb250YWlucyBuZXcgUmVnRXhwIG9iamVjdCBmb3IgbWF0Y2ggZGVmaW5lZCBzdHJpbmcgZ2xvYmFsbHlcbiAgICAgICAgICAgIHJlID0gbmV3IFJlZ0V4cChpbnAsIFwiZ1wiKTtcbiAgICAgICAgICAgIGh0bWxfdGFncyA9IGh0bWxFZGl0b3IuZ2V0VmFsdWUoKS50cmltKCk7XG4gICAgICAgICAgICBjc3NfZGF0YSA9IGNzc0VkaXRvci5nZXRWYWx1ZSgpLnRyaW0oKTtcbiAgICAgICAgICAgIGpzX2RhdGEgPSBqc0VkaXRvci5nZXRWYWx1ZSgpLnRyaW0oKTtcbiAgICAgICAgICAgIGNzc19kYXRhID0gY3NzX2RhdGEucmVwbGFjZSgvXFxuL2dtLCAnJyk7XG4gICAgICAgICAgICBqc19kYXRhID0ganNfZGF0YS5yZXBsYWNlKC9cXCAvZywgJycpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyByZXR1cm5zIGJhY2sgaW4gY2FzZSBvZiBhbnkgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3JjID09ICdIVE1MJykge1xuICAgICAgICAgICAgaWYgKGh0bWxfdGFncy5tYXRjaChyZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAoaHRtbF90YWdzLm1hdGNoKHJlKS5sZW5ndGggPT0gb3V0cCAmJiBodG1sX3RhZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChodG1sX3RhZ3MubWF0Y2gocmUpLmxlbmd0aCA8PSBvdXRwICYmIGh0bWxfdGFncyAmJiBodG1sX3RhZ3MubWF0Y2gocmUpLmxlbmd0aCAmJiBtYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChodG1sX3RhZ3MubWF0Y2gocmUpLmxlbmd0aCA+PSBvdXRwICYmIGh0bWxfdGFncyAmJiBodG1sX3RhZ3MubWF0Y2gocmUpLmxlbmd0aCAmJiBtaW4pIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZmxhZ19jaGVjayA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChzcmMgPT0gJ0NTUycpIHtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBhcnJheSBvZiBtYXRjaGluZyBkYXRhXG4gICAgICAgICAgICBpbnB1dF9kYXRhID0gaW5wdXRfZGF0YS5zcGxpdCgneycpO1xuICAgICAgICAgICAgLy8gY3JlYXRlcyBhbiBhcnJheSBmb3IgY29udGFpbiB0aGUgZGVmaW5lZCBtZWRpYSBxdWVyaWVzXG4gICAgICAgICAgICBsZXQgbWVkaWFfYXJyID0gW107XG4gICAgICAgICAgICAvLyBpbml0aWFsaXplIHRoZSBjb3VudGVyXG4gICAgICAgICAgICBsZXQgY291bnRlciA9IDA7XG4gICAgICAgICAgICAvLyByZW1vdmVzIHNwYWNlIGZyb20gdGhlIHZhbHVlIG9mIGNzcyBlZGl0b3IgdGhhdCBleGlzdCBpbnNpZGUgcGFyZW50aGVzaXNcbiAgICAgICAgICAgIGNzc19kYXRhID0gY3NzX2RhdGEucmVwbGFjZSgvXFwoLio/XFwpL2dtLCBmdW5jdGlvbiAobWF0Y2hfZGF0YSkgeyByZXR1cm4gbWF0Y2hfZGF0YS5yZXBsYWNlKC9bIF0vZ20sIFwiXCIpOyB9KTtcbiAgICAgICAgICAgIC8vIHJlcGxhY2VzICdAJyB3aXRoICdcXG5AJ1xuICAgICAgICAgICAgY3NzX2RhdGEgPSBjc3NfZGF0YS5yZXBsYWNlKC9AL2dtLCAnXFxuQCcpO1xuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIG1lZGlhIGRhdGEgdGhhdCBzdGFydHMgZnJvbSBjaGFyYWN0ZXIgJ0AnIGFuZCBlbmRzIGJlZm9yZSBmaXJzdCBjdXJseSBicmFjZSBcbiAgICAgICAgICAgIGNzc19kYXRhID0gY3NzX2RhdGEucmVwbGFjZSgvQChbXFxzXFxTXSo/KXsoW1xcc1xcU10qPyl7KFtcXHNcXFNdKj8pfShbXFxzXFxTXSo/KX0vZ20sIGZ1bmN0aW9uIChtYXRjaF9kYXRhLCBtZWRpYV9kYXRhKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgbWVpZGEgcXVlcnkgZGF0YSB0aGF0IHN0YXJ0cyBmcm9tIGNoYXJhY3RlciAnQCcgYW5kIGVuZHMgYmVmb3JlIGZpcnN0IGN1cmx5IGJyYWNlIFxuICAgICAgICAgICAgICAgIGxldCBmaW5kX21lZGlhX2RhdGEgPSBtZWRpYV9kYXRhO1xuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGFuIGFycmF5IG9mIHN0cmluZyBkZWZpbmVkIGluIHZhcmlhYmxlICdmaW5kX21lZGlhX2RhdGEnIGFmdGVyIHNwbGl0aW5nIGl0IHdpdGggd2hpdGUgc3BhY2UgY2hhcmFjdGVyXG4gICAgICAgICAgICAgICAgZmluZF9tZWRpYV9kYXRhID0gZmluZF9tZWRpYV9kYXRhLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgICAgICAvLyBhcnJheSBmb3Igc3RvcmUgbWVkaWEgZGF0YSB0aGF0IGFyZSBzdG9yZWQgaW4gYXJyYXkgJ2ZpbmRfbWVkaWFfZGF0YScgYWZ0ZXIgcmVtb3ZpbmcgYmxhbmsgdmFsdWVzXG4gICAgICAgICAgICAgICAgbGV0IHN0b3JlX2RhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZpbmRfbWVkaWFfZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmluZF9tZWRpYV9kYXRhW2ldICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHB1c2hlcyBkYXRhIGludG8gYXJyYXkgJ3N0b3JlX2RhdGEnIHdoaWNoIGlzIGRlZmluZWQgaW4gYXJyYXkgJ2ZpbmRfbWVkaWFfZGF0YScgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaSdcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlX2RhdGEucHVzaChmaW5kX21lZGlhX2RhdGFbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHN0cmluZyBhZnRlciBqb2luaW5nIGFycmF5ICdzdG9yZV9kYXRhICd3aXRoJyB3aGl0ZSBzcGFjZVxuICAgICAgICAgICAgICAgIHN0b3JlX2RhdGEgPSBzdG9yZV9kYXRhLmpvaW4oXCIgXCIpO1xuICAgICAgICAgICAgICAgIC8vIHJlcGxhY2VzIG9sZCBtZWRpYSBkYXRhIHdpdGggbmV3IG9uZSBhZnRlciByZW1vdmluZyB1bm5lY2Vzc2FyeSBtb3JlIHRoYXQgb25lIHdoaXRlIHNwYWNlIHRoYXQgY29tZXMgdG9nZXRoZXJcbiAgICAgICAgICAgICAgICBtYXRjaF9kYXRhID0gbWF0Y2hfZGF0YS5yZXBsYWNlKG1lZGlhX2RhdGEsIHN0b3JlX2RhdGEpO1xuICAgICAgICAgICAgICAgIC8vIHB1c2hlcyB0aGUgbWF0Y2hlZCBtZWRpYSBxdWVyeSBkYXRhIGludG8gYXJyYXkgJ21lZGlhX2FycidcbiAgICAgICAgICAgICAgICBtZWRpYV9hcnIucHVzaChtYXRjaF9kYXRhKTtcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5zIHVwZGF0ZWQgZGVmaW5lZCBtZWRpYSBxdWVyaWVzIGRhdGFcbiAgICAgICAgICAgICAgICByZXR1cm4gbWF0Y2hfZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gbG9vcHMgdGhyb3VnaCBudW1iZXIgb2YgZGVmaW5lZCBtZWRpYSBxdWVyeSBpbiBjc3MgZWRpdG9yXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1lZGlhX2Fyci5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIC8vIGNoZWNrcyBmb3IgbWF0Y2ggdGhlIG1lZGlhIGRhdGEgZGVmaW5lZCBpbiB0ZXN0Y2FzZSB3aXRoIG1lZGlhIGRhdGEgZXhpc3QgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaidcbiAgICAgICAgICAgICAgICBsZXQgbWVkaWFfbWF0Y2ggPSBtZWRpYV9hcnJbal0uaW5kZXhPZihpbnB1dF9kYXRhWzBdLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgbWVkaWEgcXVlcnkgbWF0Y2hlZCB3aXRoIHRoZSBkYXRhIGRlZmluZWQgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaidcbiAgICAgICAgICAgICAgICBpZiAobWVkaWFfbWF0Y2ggPiAtMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgY3NzIHNlbGVjdG9yXG4gICAgICAgICAgICAgICAgICAgIGxldCBzZWxlY3Rvcl9tYXRjaDtcbiAgICAgICAgICAgICAgICAgICAgLy8gZ29lcyBpbnNpZGUgdGhpcyBibG9jayBpZiBtdWx0aXBsZSBzZWxlY3RvciBkZWZpbmVkIGluIHRlc3RjYXNlXG4gICAgICAgICAgICAgICAgICAgIGlmIChpbnB1dF9kYXRhWzFdLmluZGV4T2YoJywnKSA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyBhcnJheSBvZiBhbGwgc2VsZWN0b3IgdGhhdCBkZWZpbmVkIGluIHRlc3RjYXNlXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3ViX2lucHV0ID0gaW5wdXRfZGF0YVsxXS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN1Yl9pbnB1dC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGluZGV4IG9mIGNzcyBzZWxlY3RvciwgZGVmaW5lZCBpbiBhcnJheSAnc3ViX2lucHV0JyBhdCBpbmRleCBlcXVsYXMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdpJywgaW4gYXJyYXkgJ21lZGlhX2FycicgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnaidcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvcl9tYXRjaCA9IG1lZGlhX2FycltqXS5pbmRleE9mKHN1Yl9pbnB1dFtpXS50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGV4aXN0IGZyb20gbG9vcCBpZiB2YXJpYWJsZSAnc2VsZWN0b3JfbWF0Y2gnIGNvbnRhaW5zIHZhbHVlIGxlc3MgdGhhbiAnMCcgbWVhbnMgaWYgYW55IGNzcyBzZWxlY3RvciBkb2VzIG5vdCBleGlzdCBpbiBhcnJheSAnbWVkaWFfYXJyJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdqJyBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc2VsZWN0b3JfbWF0Y2ggPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIGluZGV4IG9mIGNzcyBzZWxlY3RvciBpbiBhcnJheSAnbWVkaWFfYXJyJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdqJyBpbiBjYXNlIG9mIHNpbmdsZSBjc3Mgc2VsZWN0b3IgZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0b3JfbWF0Y2ggPSBtZWRpYV9hcnJbal0uaW5kZXhPZihpbnB1dF9kYXRhWzFdLnRyaW0oKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgaWYgc2VsZWN0b3IgbWF0Y2hlcyBpbiBtZWRpYSBxdWVyeSdzIHN0cmluZyBkZWZpbmVkIGluIGFycmF5ICdtZWRpYV9hcnInIGF0IGluZGV4IGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2onXG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rvcl9tYXRjaCA+IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgaW5kZXggb2YgcHJvcGVydHkgc3RyaW5nIGRlZmluZWQgaW4gbWVkaWEgcXVlcnkgdGhhdCBleGlzdCBpbiBhcnJheSAnbWVkaWFfYXJyJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdqJ1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmRfc3RyID0gbWVkaWFfYXJyW2pdLmluZGV4T2YoaW5wdXRfZGF0YVsyXS50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaWRlbnRpZnkgdGhhdCBwcm9wZXJ0eSBtYXRjaGVkIG9yIG5vdCwgaW5pdGlhbGx5IGRlZmluZWQgdGhhdCBpdCBpcyBub3QgbWF0Y2hlZFxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHByb3BfbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVudGVycyBpbiB0aGlzIGJsb2NrIGlmIHByb3BlcnR5IHN0cmluZyBleGlzdCBpbiBhcnJheSAnbWVkaWFfYXJyJyBhdCBpbmRleCBlcXVhbHMgdG8gdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdqJ1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbmRfc3RyID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnN0ZWFkIG9mIHRoaXMgb25seSB2YXJpYWJsZSAnZmluZF9zdHInIGNhbiBiZSB1c2VkIGFzIGNvbnRhaW5zIHRoZSBzYW1lIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbmRfc3RyX2luZGV4ID0gbWVkaWFfYXJyW2pdLmluZGV4T2YoaW5wdXRfZGF0YVsyXS50cmltKCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBjaGFyYWN0ZXIgZXhpc3QgYXQgaW5kZXggZXF1YWxzIHRvIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnZmluZF9zdHJfaW5kZXgnIGJ5IHJlZHVjaW5nIDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcHJvcF9kYXRhID0gbWVkaWFfYXJyW2pdLmNoYXJBdCgoZmluZF9zdHJfaW5kZXggLSAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW50ZXJzIGluIHRoaXMgYmxvY2sgZm9yIGluZGljYXRlIHRoYXQgcHJvcGVydHkgbWF0Y2hlZCBpZiBwcm9wZXJ0eSBpcyBub3QgY29tYmluZWQgd2l0aCBhbnkgb3RoZXIgd29yZCBzdWNoIGFzIGluIGNhc2Ugb2YgJ2NvbG9yJyBwcm9wZXJ0eSB0aGVuIGl0IHdpbGwgaWdub3JlICdiYWNrZ3JvdW5kLWNvbG9yJyBwcm9wZXJ0eVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwcm9wX2RhdGEgIT09ICctJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcm9wX21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnRlcnMgaW4gdGhpcyBibG9jayBpZiBwcm9wZXJ0eSBtYXRjaGVkIGluIGFycmF5ICdtZWRpYV9hcnInIGF0IGluZGV4IGVxdWFscyB0byB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ2onXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocHJvcF9tYXRjaCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluY3JlbWVudHMgdmFsdWUgb2YgdmFyaWFibGUgJ2NvdW50ZXInIGJ5IDFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb3VudGVyID0gY291bnRlciArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY291bnRlciA9PSBvdXRwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChqc19kYXRhLm1hdGNoKHJlKSkge1xuICAgICAgICAgICAgICAgIGlmIChqc19kYXRhLm1hdGNoKHJlKS5sZW5ndGggPT0gb3V0cCkge1xuICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGpzX2RhdGEubWF0Y2gocmUpLmxlbmd0aCA8PSBvdXRwICYmIGpzX2RhdGEgJiYganNfZGF0YS5tYXRjaChyZSkubGVuZ3RoICYmIG1heCkge1xuICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGpzX2RhdGEubWF0Y2gocmUpLmxlbmd0aCA+PSBvdXRwICYmIGpzX2RhdGEgJiYganNfZGF0YS5tYXRjaChyZSkubGVuZ3RoICYmIG1pbikge1xuICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBmbGFnX2NoZWNrID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGZsYWdfY2hlY2sgPSAwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChmbGFnX2NoZWNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLy8gdXNlZCBmb3IgY2hlY2sgdGhlIHJlc3VsdCBzdGF0dXMgb2YgJ0V4dGVybmFsIFNjcmlwdCcgZGVmaW5lZCBpbiAnQXV0b2dyYWRlJyBkaWFsb2cgYm94XG4gICAgZnVuY3Rpb24gZXh0ZXJuYWxDaGVjayhnZXRfY2FzZXMpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIFJlZ0V4cCBwYXR0ZXJuIGZvciBtYXRjaCB0aGUgc3RyaW5nICd2YXIgZmxhZ09OTidcbiAgICAgICAgICAgIGxldCByZSA9IC92YXIgZmxhZ09OTi9nbTtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSBvZiBqcyBlZGl0b3JcbiAgICAgICAgICAgIGxldCBqc19kYXRhID0ganNFZGl0b3IuZ2V0VmFsdWUoKS50cmltKCk7XG4gICAgICAgICAgICBqc19kYXRhID0ganNfZGF0YS5yZXBsYWNlKC9eLio/Ym9keS4qP1xcXFxuL2dtLCAnJyk7XG4gICAgICAgICAgICAvLyByZW1vdmVzIGFsbCB0aGUgdGV4dCB0aGF0IGV4aXN0IGluIHNhbWUgbGluZSBzdGFydGluZyBmcm9tICdkb2N1bWVudC53cml0ZScgc3RyaW5nIG9mIGpzIGVkaXRvciB2YWx1ZSBcbiAgICAgICAgICAgIGpzX2RhdGEgPSBqc19kYXRhLnJlcGxhY2UoL2RvY3VtZW50XFwud3JpdGUuKi9nbSwgJycpO1xuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIGFmdGVyIGV2YWx1YXRlIHRoZSBzY3JpcHRcbiAgICAgICAgICAgIGxldCByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoIXJlLnRlc3QoZ2V0X2Nhc2VzKSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSB2YWx1ZSByZXR1cm4gYnkgdGhlIHNjcmlwdCBkZWZpbmVkIGluIGpzIGVkaXRvciBhbmQgaW4gJ0V4dGVybmFsIFNjcmlwdCcgZmllbGQgb2YgJ0F1dG9ncmFkZScgZGlhbG9nIGJveFxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGV2YWwoanNfZGF0YSArICdcXG4nICsgZ2V0X2Nhc2VzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIHJldHVybiBieSB0aGUgc2NyaXB0IGRlZmluZWQgaW4gJ0V4dGVybmFsIFNjcmlwdCcgZmllbGQgb2YgJ0F1dG9ncmFkZVxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGV2YWwoZ2V0X2Nhc2VzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIHZhbHVlIHN0b3JlZCBpbiB2YXJpYWJsZSAncmVzdWx0J1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAvLyBzaG93cyBsb2cgbWVzc2FnZSBpbiBjYXNlIG9mIGFueSBlcnJvciBvY2N1cnJlZFxuICAgICAgICAgICAgY29uc29sZS5sb2coeyBtc2c6IGVyciwgZnVuYzogJ2V4dGVybmFsQ2hlY2tAMTEwOCcgfSk7XG4gICAgICAgICAgICAvLyByZXR1cm5zIGZhbHNlIGluIGNhc2Ugb2YgYW55IGVycm9yIG9jY3VycmVkXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAgLy8gcmV0dXJucyB0aGUgdGV4dCBkZWZpbmVkIGJldHdlZW4gb3BlbmluZyBhbmQgY2xvc2luZyB0YWcgdGhhdCBpcyBwYXNzZWQgYXQgdGhlIHRpbWUgb2YgZnVuY3Rpb24gY2FsbCBpbiBzdHJpbmcgcGFzc2VkIGF0IGZpcnN0IGFyZ3VtZW50IGF0IHRoZSB0aW1lIG9mIGZ1bmN0aW9uIGNhbGwgKGJhc2ljYWxseSBpbiB4bWwpXG4gICAgZnVuY3Rpb24gc3RyaW5nQmV0d2VlbihkYXRhLCBzdHJfMSwgc3RyXzIpIHtcbiAgICAgICAgLy8gY29udGFpbnMgUmVnRXhwIHBhdHRlcm4gZm9yIG1hdGNoIGluIHN0cmluZ1xuICAgICAgICBsZXQgcmVnRXg7XG4gICAgICAgIGlmIChzdHJfMikge1xuICAgICAgICAgICAgLy8gY3JlYXRlcyB0aGUgcGF0dGVybiBpZiBvcGVuaW5nIGFuZCBjbG9zaW5nIGJvdGggdGFnIHByb3ZpZGVkIGF0IHRoZSB0aW1lIG9mIGZ1bmN0aW9uIGNhbGxpbmdcbiAgICAgICAgICAgIHJlZ0V4ID0gbmV3IFJlZ0V4cChzdHJfMSArIFwiKFtcXFxcc1xcXFxTXSo/KVwiICsgc3RyXzIsIFwiZ21cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBjcmVhdGVzIHRoZSBwYXR0ZXJuIGlmIG9wZW5pbmcgYW5kIGNsb3NpbmcgYm90aCB0YWcgbm90IHByb3ZpZGVkIGF0IHRoZSB0aW1lIG9mIGZ1bmN0aW9uIGNhbGxpbmdcbiAgICAgICAgICAgIHJlZ0V4ID0gbmV3IFJlZ0V4cChcIjxcIiArIHN0cl8xICsgXCI+KFtcXFxcc1xcXFxTXSo/KTwvXCIgKyBzdHJfMSArIFwiPlwiLCBcImdtXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB0ZXh0IGFjY29yZGluZyB0byB0aGUgbWF0Y2ggZGF0YSBpbiB4bWwgc3RyaW5nXG4gICAgICAgIGxldCBtYXRjaGVkU3RyID0gcmVnRXguZXhlYyhkYXRhKTtcbiAgICAgICAgaWYgKG1hdGNoZWRTdHIpIHtcbiAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIHRleHQgYmV0d2VlbiBnaXZlbiBvcGVuaW5nIGFuZCBjbG9zaW5nIHRhZyBpZiBpdCBleGlzdFxuICAgICAgICAgICAgcmV0dXJuIG1hdGNoZWRTdHJbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyByZXR1cm5zIHRoZSBudWxsIGlmIHRleHQgbm90IGZvdW5kIGJldHdlZW4gZ2l2ZW4gb3BlbmluZyBhbmQgY2xvc2luZyB0YWdcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmV0dXJucyB0aGUgdmFsdWUgb2YgYXR0cmlidXRlIGRlZmluZWQgaW4gc2Vjb25kIGFyZ3VtZW50IGZyb20gdGFnIGRlZmluZWQgaW4gM3JkIGFyZ3VtZW50IGluIHhtbCBzdHJpbmcgZGVmaW5lZCBpbiBhcmd1bWVudCAxXG4gICAgZnVuY3Rpb24gZmluZEF0dHJpYnV0ZShYTUwsIGF0dHIsIHRhZyA9IFwiXCIpIHtcbiAgICAgICAgLy8gY3JlYXRlcyBuZXcgUmVnRXhwIG9iamVjdCBmb3IgbWF0Y2ggdGhlIHZhbHVlIG9mIGF0dHJpYnV0ZSBvZiBhbnkgdGFnXG4gICAgICAgIGxldCByZWdFeCA9IG5ldyBSZWdFeHAoXCI8XCIgKyB0YWcgKyBcIi4qP1wiICsgYXR0ciArIFwiPVxcXCIoXFxcXHcuKj8pXFxcIi4qPz5cIiwgXCJnbVwiKTtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIG1hdGNoZWQgdGV4dCBpbiAnWE1MJyBzdHJpbmcgaWYgaXQgbWF0Y2hlZCBvdGhlcndpc2UgbnVsbCB2YWx1ZSBob2xkc1xuICAgICAgICBsZXQgbWF0Y2hlZFN0ciA9IHJlZ0V4LmV4ZWMoWE1MKTtcbiAgICAgICAgaWYgKG1hdGNoZWRTdHIpIHtcbiAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIHZhbHVlIG9mIGF0dHJpYnV0ZSBkZWZpbmVkIGluIGFyZ3VtZW50IHZhcmlhYmxlICdhdHRyJyBvZiB0YWcgZGVmaW5lZCBpbiBhcmd1bWVudCB2YXJpYWJsZSAndGFnJyBvZiBYTUxcbiAgICAgICAgICAgIHJldHVybiBtYXRjaGVkU3RyWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcmV0dXJucyBudWxsIGlmIG5vIG1hdGNoZWQgZGF0YSBmb3VuZFxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1c2VkIGZvciB1bnJlbmRlciB0aGUgcGxheWVyIHRhZ1xuICAgIGZ1bmN0aW9uIHVuUmVuZGVyUGxheWVyKCkge1xuICAgICAgICAvLyBtYWtlcyBwbGF5ZXIgdGFnIGVtcHR5IHRoYXQgZXhpc3QgaW5zaWRlIGVsZW1lbnQgaGF2ZSBpZDogYXV0aG9yaW5nRGl2XG4gICAgICAgLy8galF1ZXJ5KCcjYXV0aG9yaW5nRGl2IHBsYXllcicpLmVtcHR5KCk7IC8vIFJlcGxhY2VkXG4gICAgICAgIEFJLmVtcHR5KCcjYXV0aG9yaW5nRGl2IHBsYXllcicpO1xuICAgICAgICAvLyByZW1vdmVzIHRoZSBjbGFzcyAnaGlkZWNvbnRlbnQnIGZyb20gcGxheWVyIHRhZyBlbXB0eSB0aGF0IGV4aXN0IGluc2lkZSBlbGVtZW50IGhhdmUgaWQ6IGF1dGhvcmluZ0RpdlxuICAgICAgIC8vIGpRdWVyeSgnI2F1dGhvcmluZ0RpdicpLmZpbmQoJ3BsYXllcicpLnJlbW92ZUNsYXNzKCdoaWRlY29udGVudCcpOyAvLyBSZXBsYWNlZFxuICAgICAgICBBSS5zZWxlY3QoJyNhdXRob3JpbmdEaXYnKS5xdWVyeVNlbGVjdG9yKCdwbGF5ZXInKS5jbGFzc0xpc3QucmVtb3ZlKCdoaWRlY29udGVudCcpO1xuXG5cblxuICAgIC8qICAgIGpRdWVyeSgnI2VkaXRvciBpbWcnKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICghalF1ZXJ5KHNlbGYpLmF0dHIoJ3NyYycpLm1hdGNoKC9cXC9cXC9zMy5hbWF6b25hd3MuY29tXFwvamlneWFhc2FfY29udGVudF9zdGF0aWMvZ20pKSB7XG4gICAgICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgb2YgJ3NyYycgYXR0cmlidXRlIG9mIGltZyB0YWcgdGhhdCBleGlzdCBpbnNpZGUgZWxlbWVudCBoYXZlIGlkICdlZGl0b3InIGFuZCBpdHMgc3JjIG5vdCBjb250YWlucyB0aGUgc3RyaW5nICcvL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMnXG4gICAgICAgICAgICAgICAgalF1ZXJ5KHNlbGYpLmF0dHIoJ3NyYycsIGpRdWVyeShzZWxmKS5hdHRyKCdzcmMnKSk7ICAvLyBSZXBsYWNlZFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAqL1xuXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNlZGl0b3IgaW1nJykuZm9yRWFjaChmdW5jdGlvbihfdGhpcyxpKXtcbiAgICAgICAgICAgIGlmICghX3RoaXMuZ2V0QXR0cmlidXRlKCdzcmMnKS5tYXRjaCgvXFwvXFwvczMuYW1hem9uYXdzLmNvbVxcL2ppZ3lhYXNhX2NvbnRlbnRfc3RhdGljL2dtKSkge1xuICAgICAgICAgICAgICAgIF90aGlzLnNldEF0dHJpYnV0ZSgnc3JjJyxfdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvLyB1c2VkIGZvciByZW5kZXIgdGhlIHBsYXllciB0YWdcbiAgICBmdW5jdGlvbiByZW5kZXJQbGF5ZXIoKSB7XG4gICAgICAgIC8vIG1ha2VzIHBsYXllciB0YWcgZW1wdHkgdGhhdCBleGlzdCBpbnNpZGUgZWxlbWVudCBoYXZlIGlkOiBhdXRob3JpbmdEaXZcbiAgICAgICAgLy9qUXVlcnkoJyNhdXRob3JpbmdEaXYgcGxheWVyJykuZW1wdHkoKTsgLy8gUmVwbGFjZWRcbiAgICAgICAgQUkuZW1wdHkoJyNhdXRob3JpbmdEaXYgcGxheWVyJyk7XG4gICAgICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgZGF0YSBvZiBwbGF5ZXIgdGFnXG4gICAgICAvLyAgdGFnX3BsYXllcihqUXVlcnkoJyNhdXRob3JpbmdEaXYnKSk7IC8vIFJlcGxhY2VkXG4gICAgICAgICAgdGFnX3BsYXllcihBSC5zZWxlY3QoJyNhdXRob3JpbmdEaXYnKSk7XG4gICAgICAgIC8vIGFkZHMgdGhlIGNsYXNzICdoaWRlY29udGVudCcgdG8gcGxheWVyIHRhZyBlbXB0eSB0aGF0IGV4aXN0IGluc2lkZSBlbGVtZW50IGhhdmUgaWQ6IGF1dGhvcmluZ0RpdlxuICAgICAgIC8vIGpRdWVyeSgnI2F1dGhvcmluZ0RpdicpLmZpbmQoJ3BsYXllcicpLmFkZENsYXNzKCdoaWRlY29udGVudCcpOyAvLyBSZXBsYWNlZFxuICAgICAgICBBSS5zZWxlY3QoJyNhdXRob3JpbmdEaXYnKS5xdWVyeVNlbGVjdG9yKCdwbGF5ZXInKS5jbGFzc0xpc3QuYWRkKCdoaWRlY29udGVudCcpO1xuXG4gICAgLyogICAgalF1ZXJ5KCcjZWRpdG9yIGltZycpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFqUXVlcnkoc2VsZikuYXR0cignc3JjJykubWF0Y2goL1xcL1xcL3MzLmFtYXpvbmF3cy5jb21cXC9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy9nbSkpIHtcbiAgICAgICAgICAgICAgICAvLyBzZXRzIHRoZSB2YWx1ZSBvZiAnc3JjJyBhdHRyaWJ1dGUgb2YgaW1nIHRhZyBieSBhZGRpbmcgc3RyaW5nICcvL3MzLmFtYXpvbmF3cy5jb20vamlneWFhc2FfY29udGVudF9zdGF0aWMvJyBiZWZvcmUgaXRzIHByZXZpb3VzIHNyYyB0aGF0IGV4aXN0IGluc2lkZSBlbGVtZW50IGhhdmUgaWQgJ2VkaXRvcicgYW5kIGl0cyBzcmMgbm90IGNvbnRhaW5zIHRoZSBzdHJpbmcgJy8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYydcbiAgICAgICAgICAgICAgICBqUXVlcnkoc2VsZikuYXR0cignc3JjJywgJy8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8nICsgalF1ZXJ5KHNlbGYpLmF0dHIoJ3NyYycpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7IFJlcGxhY2VkXG4gICAgKi9cbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2VkaXRvciBpbWcnKS5mb3JFYWNoKGZ1bmN0aW9uKF90aGlzLGkpe1xuICAgICAgICAgICAgaWYoIV90aGlzLmdldEF0dHJpYnV0ZSgnc3JjJykubWF0Y2goL1xcL1xcL3MzLmFtYXpvbmF3cy5jb21cXC9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy9nbSkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5nZXRBdHRyaWJ1dGUoJ3NyYycsJy8vczMuYW1hem9uYXdzLmNvbS9qaWd5YWFzYV9jb250ZW50X3N0YXRpYy8nK190aGlzLmdldEF0dHJpYnV0ZSgnc3JjJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8vIHNob3dzIHRoZSBvdXRwdXQgb2YgdGhlIGNvZGUgaW4gJ1Jlc3VsdCcgZWRpdG9yXG4gICAgZnVuY3Rpb24gcnVuQ29kZSgpIHtcbiAgICAgICAvLyBqUXVlcnkoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBqUXVlcnkoJyNyZXN1bHRfZGl2Jykub2Zmc2V0KCkudG9wIH0sICdzbG93Jyk7IC8vIFJlcGxhY2VkXG4gICAgICAgIHdpbmRvdy5zY3JvbGwoe1xuICAgICAgICAgICAgdG9wOiA1MDAsXG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCcgIFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBkYXRlID0gZGF0ZS5nZXRUaW1lKCk7XG4gICAgICAgIGxldCBpZnJhbWVJZCA9IFwidUNcIiArIGRhdGU7XG4gICAgIC8vICAgalF1ZXJ5KCcjcmVzdWx0X2RpdicpLmh0bWwoJzxpZnJhbWUgY2xhc3M9XCJyZXN1bHRfZnJhbWUgdy0xMDAgYm9yZGVyLTBcIiBzdHlsZT1cImhlaWdodDozNDdweFwiIGlkPVwiJyArIGlmcmFtZUlkICsgJ1wiPjwvaWZyYW1lPicpOyAvL1JlcGxhY2VkXG4gICAgICAgICAgQUguc2VsZWN0KCcjcmVzdWx0X2RpdicpLmlubmVySFRNTCA9ICc8aWZyYW1lIGNsYXNzPVwicmVzdWx0X2ZyYW1lIHctMTAwIGJvcmRlci0wXCIgc3R5bGU9XCJoZWlnaHQ6MzQ3cHhcIiBpZD1cIicgKyBpZnJhbWVJZCArICdcIj48L2lmcmFtZT4nO1xuICAgICAgICAvLyByZXR1cm5zIHRoZSBjb21iaW5lZCBkYXRhIG9mIGh0bWwsIGNzcyBhbmQganMgYWZ0ZXIgd3JhcHBpbmcgdGhlIGNzcyBlZGl0b3IgdmFsdWUgaW4gc3R5bGUgdGFnIGFuZCBqcyBlZGl0b3IgdmFsdWUgaW4gc2NyaXB0IHRhZyBhbmQgaGlkZXMgdGhlICdMb2FkaW5nLi4uJyBjb250YWluaW5nIGFmdGVyIGxvYWRcbiAgICAgICAgbGV0IHNvdXJjZSA9IHByZXBhcmVTb3VyY2UoKTtcbiAgICAgICAgbGV0IGlmcmFtZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN1QycgKyBkYXRlKTtcbiAgICAgICAgaWZyYW1lLm9ubG9hZCA9IGFuc3dlckNoZWNrV2ViLmJpbmQodGhpcywgZmFsc2UpO1xuICAgICAgICBsZXQgaWZyYW1lX2RvYyA9IGlmcmFtZS5jb250ZW50RG9jdW1lbnQ7XG4gICAgICAgIGlmcmFtZV9kb2Mub3BlbigpO1xuICAgICAgICBpZnJhbWVfZG9jLndyaXRlKHNvdXJjZSk7XG4gICAgICAgIGlmcmFtZV9kb2MuY2xvc2UoKTtcbiAgICB9XG5cbiAgICAvLyBtYWtlcyBibGFuayB0aGUgdmFsdWUgb2YgdXNlciBhbnN3ZXIgeG1sIGFuZCBhbHNvIG9mIGh0bWwsY3NzIGFuZCBqcyBlZGl0b3JzIGJ1dCB0aGlzIG1ldGhvZCBpcyBub3QgY2FsbGVkIGZyb20gYW55IHdoZXJlIHdpdGhpbiB0aGUgY29tcG9uZW50XG4gICAgZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgICAgIC8vIG1ha2VzIGJsYW5rIHRoZSB2YWx1ZSBvZiBodG1sIGVkaXRvclxuICAgICAgICBodG1sRWRpdG9yLnNldFZhbHVlKFwiXCIpO1xuICAgICAgICAvLyBtYWtlcyBibGFuayB0aGUgdmFsdWUgb2YgY3NzIGVkaXRvclxuICAgICAgICBjc3NFZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgIC8vIG1ha2VzIGJsYW5rIHRoZSB2YWx1ZSBvZiBqcyBlZGl0b3JcbiAgICAgICAganNFZGl0b3Iuc2V0VmFsdWUoXCJcIik7XG4gICAgICAgIC8vIG1ha2VzIGJsYW5rIHZhbHVlIG9mIHVzZXIgYW5zd2VyIHhtbFxuICAgICAvLyAgIGpRdWVyeShcIiNzcGVjaWFsX21vZHVsZV91c2VyX3htbFwiKS52YWwoXCJcIik7IC8vIFJlcGxhY2VkXG4gICAgICAgIEFILnNlbGVjdCgnI3NwZWNpYWxfbW9kdWxlX3VzZXJfeG1sJykudmFsdWUgPScnO1xuICAgICAgICAvLyBtYWtlcyBibGFuayB0aGUgdmFsdWUgb2YgJ3VhWE1MJyBvZiB3aW5kb3cgb2JqZWN0XG4gICAgICAgIHdpbmRvdy51YVhNTCA9IFwiXCI7XG4gICAgfVxuXG4gICAgIC8vIHVzZWQgZm9yIHNldCB0aGUgdmFsdWUgb2YgaHRtbCwgY3NzLCBqcyBlZGl0b3JzLCBtYWtlcyBlZGl0b3IgcmVhZG9ubHkgd2hpY2ggd2FzIG1hZGUgZGlzYWJsZWQgYXQgdGhlIHRpbWUgb2YgcXVlc3Rpb24gY3JlYXRpb24sIGhpZGUgdGhlIGVkaXRvcnMgd2hpY2ggd2FzIG1hZGUgaGlkZGVuIGF0IHRoZSB0aW1lIG9mIHF1ZXN0aW8gY3JlYXRpb24gYW5kIGNoYW5nZSB0aGUgdGhlbWUgb2YgaHRtbCwgY3NzIGFuZCBqcyBlZGl0b3JzIGFjY29yZGluZyB0byB0aGUgY2hlY2sgc3RhdHVzIG9mICdEYXJrIFRoZW1lJyBjaGVja2JveFxuICAgIGZ1bmN0aW9uIHBhcnNlWE1MKHhtbCkge1xuICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcnKTtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHhtbCBcbiAgICAgICAgeG1sID0geG1sID8geG1sIDogc3RhdGUueG1sOyAgXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBodG1sIGVkaXRvciB2YWx1ZSBmcm9tIHhtbFxuICAgICAgICBsZXQgaHRtbERhdGEgPSBzdHJpbmdCZXR3ZWVuKHhtbCwgXCJ0YWdcIik7XG4gICAgICAgIC8vIHNldHMgdGhlIHZhbHVlIG9mIGh0bWwgZWRpdG9yXG4gICAgICAgIGh0bWxFZGl0b3Iuc2V0VmFsdWUoaHRtbERhdGEgPyBodG1sRGF0YS50cmltKCkgOiBcIlwiKTtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGNzcyBlZGl0b3IgdmFsdWUgZnJvbSB4bWxcbiAgICAgICAgbGV0IGNzc0RhdGEgPSBzdHJpbmdCZXR3ZWVuKHhtbCwgXCJjc3NcIik7XG4gICAgICAgIC8vIHNldHMgdGhlIHZhbHVlIG9mIGNzcyBlZGl0b3JcbiAgICAgICAgY3NzRWRpdG9yLnNldFZhbHVlKGNzc0RhdGEgPyBjc3NEYXRhLnRyaW0oKSA6IFwiXCIpO1xuICAgICAgICAvLyBjb250YWlucyB0aGUganMgZWRpdG9yIHZhbHVlIGZyb20geG1sXG4gICAgICAgIGxldCBqc0RhdGEgPSBzdHJpbmdCZXR3ZWVuKHhtbCwgXCJqc1wiKTtcbiAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgb2YganMgZWRpdG9yXG4gICAgICAgIGpzRWRpdG9yLnNldFZhbHVlKGpzRGF0YSA/IGpzRGF0YS50cmltKCkgOiBcIlwiKTtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mICdkaXNhYmxlJyBhdHRyaWJ1dGUgb2Ygd2ViIHRhZyBmcm9tIHhtbFxuICAgICAgICBsZXQgZGlzYWJsZURhdGEgPSBmaW5kQXR0cmlidXRlKHhtbCwgXCJkaXNhYmxlXCIsIFwid2ViXCIpO1xuICAgICAgICBpZiAoL2h0bWwvZy50ZXN0KGRpc2FibGVEYXRhKSkge1xuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJzAnIG9mIHZhcmlhYmxlICdyZWFkSFRNTCcgdG8gaW5kaWNhdGUgdGhhdCBodG1sIGVkaXRvciBpcyAncmVhZG9ubHknIGFuZCBubyBhbnkgb3BlcmF0aW9uIGNhbiBiZSBwZXJmb3JtZWQgb24gdGhpcyBlZGl0b3JcbiAgICAgICAgICAgIHJlYWRIVE1MID0gMDtcbiAgICAgICAgICAgIC8vIG1ha2VzIHRoZSBodG1sIGVkaXRvciBhcyAncmVhZG9ubHknXG4gICAgICAgICAgICBodG1sRWRpdG9yLnNldE9wdGlvbihcInJlYWRPbmx5XCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvanMvZy50ZXN0KGRpc2FibGVEYXRhKSkge1xuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdmFsdWUgJzAnIG9mIHZhcmlhYmxlICdyZWFkSlMnIHRvIGluZGljYXRlIHRoYXQganMgZWRpdG9yIGlzICdyZWFkb25seScgYW5kIG5vIGFueSBvcGVyYXRpb24gY2FuIGJlIHBlcmZvcm1lZCBvbiB0aGlzIGVkaXRvclxuICAgICAgICAgICAgcmVhZEpTID0gMDtcbiAgICAgICAgICAgIGpzRWRpdG9yLnNldE9wdGlvbihcInJlYWRPbmx5XCIsIHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICgvY3NzL2cudGVzdChkaXNhYmxlRGF0YSkpIHtcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIHZhbHVlICcwJyBvZiB2YXJpYWJsZSAncmVhZENTUycgdG8gaW5kaWNhdGUgdGhhdCBjc3MgZWRpdG9yIGlzICdyZWFkb25seScgYW5kIG5vIGFueSBvcGVyYXRpb24gY2FuIGJlIHBlcmZvcm1lZCBvbiB0aGlzIGVkaXRvclxuICAgICAgICAgICAgcmVhZENTUyA9IDA7XG4gICAgICAgICAgICBjc3NFZGl0b3Iuc2V0T3B0aW9uKFwicmVhZE9ubHlcIiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIG9mICdoaWRlJyBhdHRyaWJ1dGUgb2YgJ3dlYicgdGFnIGZyb20geG1sXG4gICAgICAgIGxldCBoaWRlRGF0YSA9IGZpbmRBdHRyaWJ1dGUoeG1sLCBcImhpZGVcIiwgXCJ3ZWJcIik7XG4gICAgICAgIC8vIHVwZGF0ZXMgdGhlIHZhbHVlIG9mIHZhcmlhYmxlICdoaWRlRGF0YScgYWNjb3JkaW5nIHRvIGl0cyB2YWx1ZVxuICAgICAgICBoaWRlRGF0YSA9IGhpZGVEYXRhID8gaGlkZURhdGEgOiBcIiwsXCI7XG4gICAgICAgIC8vIGNvbnZlcnRzICdoaWRlRGF0YScgaW50byBhcnJheSBhbmQgXG4gICAgICAgIGhpZGVEYXRhID0gaGlkZURhdGEuc3BsaXQoXCIsXCIpO1xuICAgICAgICAvLyB1c2VkIGZvciBoaWRlIHRoZSBodG1sLCBjc3Mgb3IganMgZWRpdG9yIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgYXJyYXkgJ2hpZGVEYXRhJyBkZWZpbmVkIGF0IGluZGV4ICcwJywgJzEnLCAnMidcbiAgICAgICAgaGlkZUVkaXRvcnMocGFyc2VJbnQoaGlkZURhdGFbMF0pLCBwYXJzZUludChoaWRlRGF0YVsxXSksIHBhcnNlSW50KGhpZGVEYXRhWzJdKSk7XG4gICAgICAgIC8vIGNoYW5nZXMgdGhlbWUgb2YgdGhlIGh0bWwsIGpzIGFuZCBjc3MgZWRpdG9ycyBhY2NvcmRpbmcgdG8gdGhlIGNoZWNrZWQgc3RhdHVzIG9mICdEYXJrIE1vZGUnIGNoZWNrYm94IFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY2hhbmdlVGhlbWUoKTtcbiAgICAgICAgfSwxMDApO1xuICAgICAgICBcbiAgICB9XG5cbiAgICAvLyB1c2VkIGZvciBoaWRlIHRoZSBodG1sLCBjc3Mgb3IganMgZWRpdG9yIGFjY29yZGluZyB0byB0aGUgdmFsdWUgb2YgYXJndW1lbnQgdmFyaWFibGUgJ2h0bWwnLCAnY3NzJywgJ2pzJ1xuICAgIGZ1bmN0aW9uIGhpZGVFZGl0b3JzKGh0bWwgPSAxLCBjc3MgPSAxLCBqcyA9IDEpIHtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIDEgb3IgMCB0aGF0IGRldGVybWluZXMgdGhhdCBodG1sIGVkaXRvciB3aWxsIGJlIHZpc2libGUgb3Igbm90XG4gICAgICAgIHNob3dIVE1MID0gaXNOYU4oaHRtbCkgPyAxIDogaHRtbDtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHZhbHVlIDEgb3IgMCB0aGF0IGRldGVybWluZXMgdGhhdCBjc3MgZWRpdG9yIHdpbGwgYmUgdmlzaWJsZSBvciBub3RcbiAgICAgICAgc2hvd0NTUyA9IGlzTmFOKGNzcykgPyAxIDogY3NzO1xuICAgICAgICAvLyBjb250YWlucyB0aGUgdmFsdWUgMSBvciAwIHRoYXQgZGV0ZXJtaW5lIHRoYXQganMgZWRpdG9yIHdpbGwgYmUgdmlzaWJsZSBvciBub3RcbiAgICAgICAgc2hvd0pTID0gaXNOYU4oanMpID8gMSA6IGpzO1xuICAgICAgICAvLyB1c2VkIGZvciBtb2JpbGUgdGVhbVxuICAgICAgICBpZiAod2luZG93LmluTmF0aXZlKSB7XG4gICAgICAgICAgICBpZiAoIXNob3dIVE1MKSB7XG4gICAgICAgICAgICAvLyAgICBqUXVlcnkoXCIjaHRtbF9wYW5lbCwgI2h0bWxfcGFuZSwgI2Nzc19wYW5lbFwiKS5oaWRlKCk7IC8vIFJlcGxhY2VkXG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2h0bWxfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdodG1sX3BhbmUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjc3NfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIEFILnNlbGVjdEFsbCgnI2h0bWxfcGFuZWwsI2h0bWxfcGFuZSwjY3NzX3BhbmVsJywnaGlkZScpO1xuICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghc2hvd0NTUykge1xuICAgICAgICAgICAgLy8gICAgalF1ZXJ5KFwiI2Nzc19wYW5lbCwjY3NzX3BhbmUsI2pzX3BhbmVsXCIpLmhpZGUoKTsgLy8gUmVwbGFjZWRcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgICAgICAvLyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3NzX3BhbmUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0QWxsKCcjY3NzX3BhbmVsLCNjc3NfcGFuZSwjanNfcGFuZWwnLCdoaWRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXNob3dKUykge1xuICAgICAgICAgICAgLy8gICAgalF1ZXJ5KFwiI2pzX3BhbmVsLCNqc19wYW5lLCNjc3NfcGFuZWxcIikuaGlkZSgpOyAvLyBSZXBsYWNlZFxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2pzX3BhbmUnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjc3NfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIEFILnNlbGVjdEFsbCgnI2pzX3BhbmVsLCNqc19wYW5lLCNjc3NfcGFuZWwnLCdoaWRlJyk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaG93SFRNTCAmJiBzaG93Q1NTICYmIHNob3dKUykge1xuICAgICAgICAgICAgLy8gICAgalF1ZXJ5KFwiI2Nzc19wYW5lbCwjanNfcGFuZWxcIikuaGlkZSgpOyAvLyBSZXBsYWNlZFxuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjc3NfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgICAgIC8vIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICAgICAgQUguc2VsZWN0QWxsKCcjY3NzX3BhbmVsLCNqc19wYW5lbCcsJ2hpZGUnKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2hvd0hUTUwpIHtcbiAgICAgICAgICAgIC8vIGhpZGVzIHRoZSBodG1sIGVkaXRvciBpZiB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ3Nob3dIVE1MJyBpcyAwXG4gICAgICAgICAgLy9qUXVlcnkoXCIjaHRtbF9wYW5lbFwiKS5oaWRlKCk7IC8vIFJlcGxhY2VkXG4gICAgICAgICAgICAvL2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdodG1sX3BhbmVsJykuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNodG1sX3BhbmVsXCIsJ2hpZGUnKTtcbiAgICAgICAgICAgIFNwbGl0KFsnI2Nzc19wYW5lbCcsJyNqc19wYW5lbCddLHtcbiAgICAgICAgICAgICAgICBzaXplczpbNTAsNTBdLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNob3dDU1MpIHtcbiAgICAgICAgICAgLy8gIGhpZGVzIHRoZSBjc3MgZWRpdG9yIGlmIHRoZSB2YWx1ZSBvZiB2YXJpYWJsZSAnc2hvd0NTUycgaXMgMFxuICAgICAgICAgICAgLy9qUXVlcnkoXCIjY3NzX3BhbmVsXCIpLmhpZGUoKTsgLy8gUmVwbGFjZWRcbiAgICAgICAgICAgIC8vZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Nzc19wYW5lbCcpLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICBBSC5zZWxlY3QoXCIjY3NzX3BhbmVsXCIsXCJoaWRlXCIpO1xuICAgICAgICAgICAgU3BsaXQoWycjaHRtbF9wYW5lbCcsJyNqc19wYW5lbCddLHtcbiAgICAgICAgICAgICAgICBzaXplczpbNTAsNTBdLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNob3dKUykge1xuICAgICAgICAgICAvLyAgaGlkZXMgdGhlIGpzIGVkaXRvciBpZiB0aGUgdmFsdWUgb2YgdmFyaWFibGUgJ3Nob3dKUycgaXMgMFxuICAgICAgICAgICAgLy9qUXVlcnkoXCIjanNfcGFuZWxcIikuaGlkZSgpOyAvLyBSZXBsYWNlZFxuICAgICAgICAgICAgLy9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnanNfcGFuZWwnKS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgQUguc2VsZWN0QWxsKFwiI2pzX3BhbmVsXCIsXCJoaWRlXCIpO1xuICAgICAgICAgICAgU3BsaXQoWycjY3NzX3BhbmVsJywnI2h0bWxfcGFuZWwnXSx7XG4gICAgICAgICAgICAgICAgc2l6ZXM6WzUwLDUwXSxcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZighc2hvd0NTUyAmJiAhc2hvd0pTICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcgc3BsaXR0ZXInKTtcbiAgICAgICAgICAgIEFILnNlbGVjdEFsbChcIiNjc3NfcGFuZWwsI2pzX3BhbmVsXCIsJ2hpZGUnKTtcblxuICAgICAgICAgICAgU3BsaXQoWycjdG9wX2NvbnRlbnQnLCcjYm90dG9tX2NvbnRlbnQnXSx7XG4gICAgICAgICAgICAgICAgc2l6ZXM6WzUwLDUwXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNhY2NvcmRpb25cIiwnY3NzJyx7ZGlzcGxheTonZmxleCd9KTtcblxuICAgICAgICAgICAgU3BsaXQoWycjaHRtbF9wYW5lbCddLHtcbiAgICAgICAgICAgICAgICBzaXplczpbMTAwXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIEFILnNlbGVjdCgnI3RvcF9jb250ZW50JywnY3NzJyx7aGVpZ2h0OicxMDAlJ30pO1xuICAgICAgICAgICAgQUguc2VsZWN0KFwiI2ZpcnN0RWRpdG9yRGl2XCIsJ3JlbW92ZUF0dHInLCdkaXNwbGF5Jyk7XG4gICAgICAgICAgICBcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXNob3dDU1MgJiYgIXNob3dIVE1MKSB7XG5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgQUguc2VsZWN0QWxsKCcjY3NzX3BhbmVsLCNodG1sX3BhbmVsJywnaGlkZScpO1xuICAgICAgICAgICBcblxuICAgICAgICAgICAgU3BsaXQoWycjdG9wX2NvbnRlbnQnLCcjYm90dG9tX2NvbnRlbnQnXSx7XG4gICAgICAgICAgICAgICAgc2l6ZXM6WzUwLDUwXVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNhY2NvcmRpb25cIiwnY3NzJyx7ZGlzcGxheTonZmxleCd9KTtcblxuICAgICAgICAgICAgU3BsaXQoWycjanNfcGFuZWwnXSx7XG4gICAgICAgICAgICAgICAgc2l6ZXM6WzEwMF1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBBSC5zZWxlY3QoJyN0b3BfY29udGVudCcsJ2Nzcycse2hlaWdodDonMTAwJSd9KTtcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNmaXJzdEVkaXRvckRpdlwiLCdyZW1vdmVBdHRyJywnZGlzcGxheScpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoIXNob3dIVE1MICYmICFzaG93SlMpIHtcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNmaXJzdEVkaXRvckRpdlwiLCdyZW1vdmVBdHRyJywgJ2Rpc3BsYXknKTtcbiAgICAgICAgICAgIEFILnNlbGVjdEFsbCgnI2pzX3BhbmVsLCNodG1sX3BhbmVsJywnaGlkZScpO1xuXG4gICAgICAgICAgICBTcGxpdChbJyN0b3BfY29udGVudCcsJyNib3R0b21fY29udGVudCddLHtcbiAgICAgICAgICAgICAgICBzaXplczpbNTAsNTBdXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgQUguc2VsZWN0KFwiI2FjY29yZGlvblwiLCdjc3MnLHtkaXNwbGF5OidmbGV4J30pO1xuXG4gICAgICAgICAgICBTcGxpdChbJyNjc3NfcGFuZWwnXSx7XG4gICAgICAgICAgICAgICAgc2l6ZXM6WzEwMF1cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBBSC5zZWxlY3QoJyN0b3BfY29udGVudCcsJ2Nzcycse2hlaWdodDonMTAwJSd9KTtcbiAgICAgICAgICAgIEFILnNlbGVjdChcIiNmaXJzdEVkaXRvckRpdlwiLCdyZW1vdmVBdHRyJywnZGlzcGxheScpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1c2VkIGZvciB1cGRhdGUgdGhlIHVzZXIgYW5zd2VyIHhtbCB2YWx1ZVxuICAgIGZ1bmN0aW9uIHNhdmVXZWJBbnN3ZXIoY29kZSwgY29kZV9sYW5nKSB7XG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSB1c2VyIGFuc3dlciB4bWwgb2YgcXVlc3Rpb24geG1sXG4gICAgICAgIGxldCBxeG1sID0gIS9zbWFucy9nLnRlc3QodWFYTUwpICYmIHVhWE1MID8gdWFYTUwgOiB4bWw7XG4gICAgICAgIC8vIHZhcmlhYmxlIGZvciBob2xkIHRoZSBodG1sLCBjc3MgYW5kIGpzIGVkaXRvciB2YWx1ZSBpbiB4bWwgZm9ybWF0IHdheVxuICAgICAgICBsZXQgdVhtbCA9IFwiXCI7XG4gICAgICAgIGlmIChjb2RlX2xhbmcgPT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBvbGQgY29kZSBvZiBodG1sIGVkaXRvciB3aXRoIG5ldyBvbmVcbiAgICAgICAgICAgIHVYbWwgPSBxeG1sLnJlcGxhY2UoLzx0YWc+W1xcc1xcU10qPzxcXC90YWc+L2csIFwiPHRhZz5cIiArIGNvZGUgKyBcIjwvdGFnPlwiKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb2RlX2xhbmcgPT0gJ2NzcycpIHtcbiAgICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIG9sZCBjb2RlIG9mIGNzcyBlZGl0b3Igd2l0aCBuZXcgb25lXG4gICAgICAgICAgICB1WG1sID0gcXhtbC5yZXBsYWNlKC88Y3NzPltcXHNcXFNdKj88XFwvY3NzPi9nLCBcIjxjc3M+XCIgKyBjb2RlICsgXCI8L2Nzcz5cIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBvbGQgY29kZSBvZiBqcyBlZGl0b3Igd2l0aCBuZXcgb25lXG4gICAgICAgICAgICB1WG1sID0gcXhtbC5yZXBsYWNlKC88anM+W1xcc1xcU10qPzxcXC9qcz4vZywgXCI8anM+XCIgKyBjb2RlICsgXCI8L2pzPlwiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyB0aGlzIGJsb2NrIGlzIHVzZWQgZm9yIG1vYmlsZSB0ZWFtXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5nZXRIZWlnaHQgJiYgd2luZG93LmdldEhlaWdodCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRlZmluZXMgdGhhdCB1c2VyIGFuc3dlciB4bWwgaXMgY2hhbmdlZFxuICAgICAgICBJU1NQRUNJQUxNT0RVTEVVU0VSWE1MQ0hBTkdFID0gMTtcbiAgICAgICAgLy8gc2F2ZSB0aGUgdXNlciBhbnN3ZXIgeG1sXG4gICAgICAgIC8valF1ZXJ5KFwiI3NwZWNpYWxfbW9kdWxlX3VzZXJfeG1sXCIpLnZhbCh1WG1sKTsgLy8gUmVwbGFjZWRcbiAgICAgICAgXG4gICAgICAgIEFILnNlbGVjdCgnI3NwZWNpYWxfbW9kdWxlX3VzZXJfeG1sJykudmFsdWUgPSB1WG1sO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIC8vIGFzc2lnbiB0aGUgdXNlciBhbnN3ZXIgeG1sIGluIHZhcmlhYmxlICd1c2VyQW5zd2VycydcbiAgICAgICAgLy9sZXQgdXNlckFuc3dlcnMgPSB1c2VyQW5zd2VyID0galF1ZXJ5KFwiI3NwZWNpYWxfbW9kdWxlX3VzZXJfeG1sXCIpLnZhbCgpOyAvLyBSZXBsYWNlZFxuICAgICAgICBsZXQgdXNlckFuc3dlcnM7XG4gICAgICAgIFxuICAgICAgICB1c2VyQW5zd2VycyA9IHVzZXJBbnN3ZXIgPSBBSC5zZWxlY3QoXCIjc3BlY2lhbF9tb2R1bGVfdXNlcl94bWxcIikudmFsdWU7XG4gICAgICAgIC8vIHVzZWQgZm9yIG1vYmlsZSB0ZWFtXG4gICAgICAgIGlmICh3aW5kb3cuaW5OYXRpdmUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgnaGVpZ2h0X19fJyArIGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2NvbnRhaW5lci1mbHVpZCcpWzBdLm9mZnNldEhlaWdodCwgJyonKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeSh7IHVzZXJBbnN3ZXJzLCBpbk5hdGl2ZUlzQ29ycmVjdDogZmFsc2UgfSksICcqJyk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gYXNzaWduIHRoZSB1c2VyIGFuc3dlciB4bWwgdmFsdWUgaW4gJ3VhWE1MJyB2YXJpYWJsZSBvZiB3aW5kb3cgb2JqZWN0XG4gICAgICAgIHVhWE1MID0gdVhtbDtcbiAgICAgICAgcmVzdWx0U2F2aW5nID0gdVhtbDtcbiAgICB9XG48L3NjcmlwdD5cbiAgICBcbiAgICA8ZGl2PlxuXG4gICAgPGRpdiBpZD1cImF1dGhvcmluZ0FyZWFcIiBjbGFzcz1cImZvbnQxNFwiID5cbiAgICAgICAgeyNpZiB3aW5kb3cuaXNJRSB8fCB3aW5kb3cuaXNJRUVsZXZlbn0gXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCI+XG4gICAgICAgICAgICAgICAgWW91IGFyZSB1c2luZyBJbnRlcm5ldCBFeHBsb3JlciwgRVM2IGZ1bmN0aW9uYWxpdHkgb2YgamF2YXNjcmlwdCB3aWxsIG5vdCB3b3JrIVxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIHsvaWZ9XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiaCBoLWltcFwiIGlkPVwic2V0LXJldmlld1wiIG9uOmNsaWNrPXsoKT0+e3NldFJldmlldygpfX0+c2V0IHJldmlldzwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImggaC1pbXBcIiBpZD1cInVuc2V0LXJldmlld1wiIG9uOmNsaWNrPXsoKT0+e3Vuc2V0UmV2aWV3KCl9fT51bnNldCByZXZpZXc8L2J1dHRvbj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHsjaWYgd2luZG93LmluTmF0aXZlIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIiBpZD1cIm1haW5Db250YWluZXJcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwid2ViX3Rvb2xiYXJcIiBjbGFzcz1cImJnLWdyYXkgaGVpZ2h0NDQgd2ViX3Rvb2xiYXIgdGV4dC1kYXJrXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtdC0yIHB0IHBsLTMgZmxvYXQtbGVmdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29tb29uLWNvZGluZy00NHB4IHMzIGFsaWduLW1pZGRsZSBtci0xXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVwiYWxpZ24tbWlkZGxlXCI+e2wuaHRtbF9jc3NfanN9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZsb2F0LXJpZ2h0IG10LTIgbXItMlwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBib3JkZXItMCBweC0wIG1sLTIgbXItMlwiIHR5cGU9XCJidXR0b25cIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgaWQ9XCJkcm9wZG93bk1lbnVCdXR0b24xXCI+PHNwYW4gY2xhc3M9XCJpY29tb29uLW1lbnUtMiBzMyB0ZXh0LXNlY29uZGFyeSBwdC1zIGQtYmxvY2tcIj48L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGRyb3Bkb3duLW1lbnUtcmlnaHRcIiB4LXBsYWNlbWVudD1cImJvdHRvbS1lbmRcIiBhcmlhLWxhYmVsbGVkYnk9XCJkcm9wZG93bk1lbnVCdXR0b24xXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZ29EYXJrXCIgY2xhc3M9XCJkcm9wZG93bi1pdGVtIG1iLTAgcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNoZWNrZWQ9e3N0YXRlLmdvRGFya30gb246Y2xpY2s9e2NoYW5nZVRoZW1lfSBpZD1cImdvRGFya1wiIGNsYXNzPVwicG9zaXRpb24tYWJzb2x1dGUgYmctdHJhbnNwYXJlbnRcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+eyhzdGF0ZS5nb0RhcmspID8gbC5ub3JtYWxfbW9kZSA6IGwuZGFya19tb2RlfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtYmxvY2sgcHVsbC1yaWdodFwiPnhgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBydW5jb2RlX2J0biBtbFwiIG9uOmNsaWNrPXtydW5Db2RlfT57bC5ydW59PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9eyd3aWR0aDogMTAwJTtiYWNrZ3JvdW5kOiB3aGl0ZTsnfSBjbGFzcz1cImNvbnRlbnRfcGFyZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtcGlsbHMgbmF2LWZpbGxcIiByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibmF2LWl0ZW1cIiBpZD1cImh0bWxfcGFuZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwibmF2LWxpbmsgYWN0aXZlIHRleHQtd2hpdGVcIiBocmVmPVwiI2h0bWxfcGFuZWxcIiByb2xlPVwidGFiXCIgZGF0YS10b2dnbGU9XCJ0YWJcIj57bC5odG1sfTwvYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJuYXYtaXRlbVwiIGlkPVwiY3NzX3BhbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm5hdi1saW5rIHRleHQtd2hpdGVcIiBocmVmPVwiI2Nzc19wYW5lbFwiIHJvbGU9XCJ0YWJcIiBkYXRhLXRvZ2dsZT1cInRhYlwiPntsLmNzc308L2E+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwibmF2LWl0ZW1cIiBpZD1cImpzX3BhbmVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBjbGFzcz1cIm5hdi1saW5rIHRleHQtd2hpdGVcIiBocmVmPVwiI2pzX3BhbmVsXCIgcm9sZT1cInRhYlwiIGRhdGEtdG9nZ2xlPVwidGFiXCI+e2wuanN9PC9hPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInRvcF9jb250ZW50XCIgY2xhc3M9XCJ0YWItY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImZpcnN0RWRpdG9yRGl2XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImh0bWxfcGFuZWxcIiBjbGFzcz1cIm0tMCBwLTAgcm91bmRlZC0wIHRhYi1wYW5lIGZhZGUgc2hvdyBhY3RpdmVcIiByb2xlPVwidGFicGFuZWxcIiA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJodG1sXCIgY2xhc3M9XCJjYXJkLWJvZHkgY29kZV9ib3ggY29udGVudC1kaXYgbS0wIHAtMFwiIHN0eWxlPXsnaGVpZ2h0OiAzNDdweCd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJodG1sXCIgaWQ9XCJodG1sX2VkaXRvclwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJjc3NfcGFuZWxcIiBjbGFzcz1cIm0tMCBwLTAgcm91bmRlZC0wIHRhYi1wYW5lIGZhZGUgc2hvd1wiIHJvbGU9XCJ0YWJwYW5lbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY3NzXCIgY2xhc3M9XCJjYXJkLWJvZHkgY29kZV9ib3ggY29udGVudC1kaXYgbS0wIHAtMFwiIHN0eWxlPXsnaGVpZ2h0OiAzNDdweCcgfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiY3NzXCIgY2xhc3M9XCJjc3NfdGV4dFwiIGlkPVwiY3NzX2VkaXRvclwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwianNFZGl0b3JEaXZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwianNfcGFuZWxcIiBjbGFzcz1cIm0tMCBwLTAgcm91bmRlZC0wIHRhYi1wYW5lIGZhZGUgc2hvd1wiIHJvbGU9XCJ0YWJwYW5lbFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwianNcIiBjbGFzcz1cImNhcmQtYm9keSBjb2RlX2JveCBjb250ZW50LWRpdiBtLTAgcC0wXCIgc3R5bGU9eydoZWlnaHQ6IDM0N3B4JyB9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJqc1wiIGlkPVwianNfZWRpdG9yXCI+PC90ZXh0YXJlYT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJib3R0b21fY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgcm91bmRlZC0wIG5tXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHJvdW5kZWQtMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57bC5yZXN1bHR9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJyZXN1bHRfZGl2XCIgc3R5bGU9eydtaW4taGVpZ2h0OiAzNDdweCcgfSBjbGFzcz1cImNhcmQtYm9keSBjb250ZW50LWRpdiBtLTAgcC0wIHJvdW5kZWQtMFwiPlxuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7OmVsc2V9XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwid2ViX3Rvb2xiYXJcIiBjbGFzcz1cImJnLWxpZ2h0IHctMTAwIGhlaWdodDQ0IHdlYl90b29sYmFyIHRleHQtZGFya1wiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm10LTIgcHQtMSBwbC0yIGZsb2F0LWxlZnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb21vb24tY29kaW5nLTQ0cHggczMgYWxpZ24tbWlkZGxlIG1yLTFcIj48L3NwYW4+PHNwYW4gY2xhc3M9XCJhbGlnbi1taWRkbGVcIj57bC5odG1sX2Nzc19qc308L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmbG9hdC1yaWdodCBtdC0yXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBib3JkZXItMCBweC0wIG1sLTIgbXItMlwiIHR5cGU9XCJidXR0b25cIiBkYXRhLWJzLXRvZ2dsZT1cImRyb3Bkb3duXCI+PHNwYW4gY2xhc3M9XCJpY29tb29uLW1lbnUtMiBzMyB0ZXh0LXNlY29uZGFyeSBwdC1zIGQtYmxvY2tcIiBpZD1cImRyb3Bkb3duTWVudUJ1dHRvbjFcIj48L3NwYW4+PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudSBkcm9wZG93bi1tZW51LXJpZ2h0XCIgeC1wbGFjZW1lbnQ9XCJib3R0b20tZW5kXCIgYXJpYS1sYWJlbGxlZGJ5PVwiZHJvcGRvd25NZW51QnV0dG9uMVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiZ29EYXJrXCIgY2xhc3M9XCJkcm9wZG93bi1pdGVtIG1iLTAgcG9pbnRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjaGVja2VkPXtzdGF0ZS5nb0Rhcmt9IG9uOmNsaWNrPXtjaGFuZ2VUaGVtZX0gaWQ9XCJnb0RhcmtcIiBjbGFzcz1cInRyYW5zcGFyZW50IGhcIiAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPnsoc3RhdGUuZ29EYXJrKSA/IGwubm9ybWFsX21vZGUgOiBsLmRhcmtfbW9kZX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xpPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtYmxvY2sgcHVsbC1yaWdodFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IHJ1bmNvZGVfYnRuIG1sIG10LTFcIiBvbjpjbGljaz17cnVuQ29kZX0+e2wucnVufTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYWNjb3JkaW9uXCIgc3R5bGU9eyd3aWR0aDoxMDAlOyBiYWNrZ3JvdW5kOndoaXRlOyBwYWRkaW5nOjBweDsnfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJ0b3BfY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJmaXJzdEVkaXRvckRpdlwiIHN0eWxlPSdkaXNwbGF5OmZsZXg7Jz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImh0bWxfcGFuZWxcIiBjbGFzcz1cImNhcmQgbS0wIHAtMCByb3VuZGVkLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciByb3VuZGVkLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57bC5odG1sfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImh0bWxcIiBjbGFzcz1cImNhcmQtYm9keSBjb2RlX2JveCBjb250ZW50LWRpdiBtLTAgcC0wXCIgc3R5bGU9eydoZWlnaHQ6IDM0N3B4ICd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiaHRtbFwiIGlkPVwiaHRtbF9lZGl0b3JcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiY3NzX3BhbmVsXCIgY2xhc3M9XCJjYXJkIG0tMCBwLTAgcm91bmRlZC0wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXIgcm91bmRlZC0wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2wuY3NzfTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImNzc1wiIGNsYXNzPVwiY2FyZC1ib2R5IGNvZGVfYm94IGNvbnRlbnQtZGl2IG0tMCBwLTBcIiBzdHlsZT17J2hlaWdodDogMzQ3cHgnIH0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIG5hbWU9XCJjc3NcIiBpZD1cImNzc19lZGl0b3JcIj48L3RleHRhcmVhPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIDxkaXYgaWQ9XCJqc0VkaXRvckRpdlwiPiAtLT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJqc19wYW5lbFwiIGNsYXNzPVwiY2FyZCBtLTAgcC0wIHJvdW5kZWQtMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjYXJkLWhlYWRlciByb3VuZGVkLTBcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2wuanN9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJqc1wiIGNsYXNzPVwiY2FyZC1ib2R5IGNvZGVfYm94IGNvbnRlbnQtZGl2IG0tMCBwLTBcIiBzdHlsZT17J2hlaWdodDogMzQ3cHggJ30+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwianNcIiBpZD1cImpzX2VkaXRvclwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSA8L2Rpdj4gLS0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSA8ZGl2IGlkPVwianNFZGl0b3JEaXZcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImpzX3BhbmVsXCIgY2xhc3M9XCJjYXJkIG0tMCBwLTAgcm91bmRlZC0wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1oZWFkZXIgcm91bmRlZC0wXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2wuanN9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwianNcIiBjbGFzcz1cImNhcmQtYm9keSBjb2RlX2JveCBjb250ZW50LWRpdiBtLTAgcC0wXCIgc3R5bGU9eydoZWlnaHQ6IDM0N3B4ICd9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwianNcIiBpZD1cImpzX2VkaXRvclwiPjwvdGV4dGFyZWE+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+IC0tPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYm90dG9tX2NvbnRlbnRcIiBzdHlsZT17J292ZXJmbG93OiBoaWRkZW4nfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZCByb3VuZGVkLTAgbm1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtaGVhZGVyIHJvdW5kZWQtMFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2wucmVzdWx0fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJyZXN1bHRfZGl2XCIgc3R5bGU9eydoZWlnaHQ6IDM0N3B4JyB9IGNsYXNzPVwiY2FyZC1ib2R5IGNvbnRlbnQtZGl2IG0tMCBwLTAgcm91bmRlZC0wXCI+XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICB7L2lmfVxuICAgICAgICAgICAgXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8IS0tICAgPERpYWxvZ1xuICAgICAgICAgICAgYmluZDp2aXNpYmxlPXtzdGF0ZS5yZW1lZGlhdGlvblRvZ2dsZX1cbiAgICAgICAgICAgICAgICBvbjpjbG9zZT17KCkgPT4gc3RhdGUucmVtZWRpYXRpb25Ub2dnbGUgPSBmYWxzZSB9XG4gICAgICAgICAgICB0aXRsZT17bC5yZW1lZGlhdGlvbn0gd2lkdGg9XCI2NTBcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IHNsb3Q9XCJ0aXRsZVwiPntsLnJlbWVkaWF0aW9ufTwvZGl2PlxuICAgICAgICAgICAgICAgIDxDb250ZW50PlxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJyZW1lZGlhdGlvbk1vZGVsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGNlbnRlciBjbGFzcz1cIm10LXhsXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDQ+e2wuY2FsY3VsYXRlX2Fuc3dlcn08YnIgLz4ge2wucGxlYXNlX3dhaXR9PC9oND5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2NlbnRlcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvQ29udGVudD5cbiAgICAgICAgICAgICAgICAgICAgPEFjdGlvbnM+ICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24ga2V5PVwiY2FuY2VsX2J0blwiIGNsYXNzPVwiY2FuY2VsX2J0bl9wb3BcIiBzdHlsZT17J2Zsb2F0OnJpZ2h0O21hcmdpbjoxMHB4O2JhY2tncm91bmQtY29sb3I6Z3JheTsnfSB2YXJpYW50PVwiY29udGFpbmVkXCIgb246Y2xpY2s9eygpID0+IHN0YXRlLnJlbWVkaWF0aW9uVG9nZ2xlID0gZmFsc2UgfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7bC5jYW5jZWx9XG4gICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPC9BY3Rpb25zPlxuICAgICAgICAgICAgPC9EaWFsb2c+IC0tPlxuICAgICAgICAgICAgPERpYWxvZ1x0XHQgICAgICAgICAgXG5cdGJpbmQ6dmlzaWJsZT17c3RhdGUucmVtZWRpYXRpb25Ub2dnbGV9XG5cdHdpZHRoPVwiNjUwXCJcbiAgICBvbjpjbG9zZT17KCkgPT4gc3RhdGUucmVtZWRpYXRpb25Ub2dnbGUgPSBmYWxzZX1cbj5cbiAgICBcbiAgICA8ZGl2IHNsb3Q9XCJ0aXRsZVwiIHN0eWxlPVwidGV4dC1hbGlnbjogbGVmdDtcIj5cblx0XHQ8ZGl2IHN0eWxlPVwiXCI+e2wucmVtZWRpYXRpb259PC9kaXY+XG5cdDwvZGl2PlxuXHQ8ZGl2PlxuXHRcdDxkaXYgaWQ9XCJyZW1lZGlhdGlvbk1vZGVsXCI+XG5cdFx0XHQ8Y2VudGVyPlxuXHRcdFx0XHQ8TG9hZGVyIHNpemU9ezcwfSAvPlxuXHRcdFx0XHQ8aDQ+e2wuY2FsY3VsYXRlX2Fuc3dlcn08YnIvPiB7bC5wbGVhc2Vfd2FpdH08L2g0PlxuXHRcdFx0PC9jZW50ZXI+XG5cdFx0PC9kaXY+XG5cdDwvZGl2PlxuXHQ8ZGl2IHNsb3Q9XCJmb290ZXJcIiBjbGFzcz1cImZvb3RlclwiIHN0eWxlPVwiYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWRpdmlkZXIsIHJnYmEoMCwgMCwgMCwgMC4xKSk7XCI+XG5cdFx0PEJ1dHRvbiBrZXk9XCJjYW5jZWxfYnRuXCIgY2xhc3M9XCJjYW5jZWxfYnRuX3BvcFwiIHN0eWxlPXsnZmxvYXQ6cmlnaHQ7bWFyZ2luOjEwcHg7YmFja2dyb3VuZC1jb2xvcjpncmF5Oyd9IHZhcmlhbnQ9XCJjb250YWluZWRcIiBvbjpjbGljaz17KCkgPT4gc3RhdGUucmVtZWRpYXRpb25Ub2dnbGUgPSBmYWxzZSB9PlxuICAgICAgICAgICAge2wuY2FuY2VsfVxuICAgICAgICA8L0J1dHRvbj5cblx0PC9kaXY+XG48L0RpYWxvZz5cbiAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cImFuc01vZGVBbnN3ZXJcIiB2YWx1ZT1cIlwiIC8+XG4gICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8c3R5bGU+XG4gICAgICAgIDpnbG9iYWwoLmhlaWdodDQ0KSAge1xuICAgICAgICAgICAgaGVpZ2h0OiA0NHB4O1xuICAgICAgICB9XG4gICAgPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbzZEZ0IsU0FBUyxBQUFHLENBQUMsQUFDakIsTUFBTSxDQUFFLElBQUksQUFDaEIsQ0FBQyJ9 */";
	append_dev(document_1.head, style);
}

// (1752:8) {#if window.isIE || window.isIEEleven}
function create_if_block_1(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = "You are using Internet Explorer, ES6 functionality of javascript will not work!";
			attr_dev(div, "class", "alert alert-danger");
			add_location(div, file, 1752, 12, 91802);
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
		source: "(1752:8) {#if window.isIE || window.isIEEleven}",
		ctx
	});

	return block;
}

// (1831:20) {:else}
function create_else_block(ctx) {
	let div21;
	let div20;
	let div3;
	let div0;
	let span0;
	let span1;
	let t1;
	let div1;
	let button0;
	let span2;
	let t2;
	let ul;
	let li;
	let label;
	let input;
	let input_checked_value;
	let t3;
	let span3;
	let t4_value = (/*state*/ ctx[0].goDark ? language.normal_mode : language.dark_mode) + "";
	let t4;
	let t5;
	let div2;
	let button1;
	let t7;
	let div19;
	let div14;
	let div13;
	let div6;
	let div4;
	let span4;
	let t9;
	let div5;
	let textarea0;
	let div5_style_value;
	let t10;
	let div9;
	let div7;
	let span5;
	let t12;
	let div8;
	let textarea1;
	let div8_style_value;
	let t13;
	let div12;
	let div10;
	let span6;
	let t15;
	let div11;
	let textarea2;
	let div11_style_value;
	let t16;
	let div18;
	let div17;
	let div15;
	let span7;
	let t18;
	let div16;
	let div16_style_value;
	let div18_style_value;
	let div19_style_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			div21 = element("div");
			div20 = element("div");
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
			ul = element("ul");
			li = element("li");
			label = element("label");
			input = element("input");
			t3 = space();
			span3 = element("span");
			t4 = text(t4_value);
			t5 = space();
			div2 = element("div");
			button1 = element("button");
			button1.textContent = `${language.run}`;
			t7 = space();
			div19 = element("div");
			div14 = element("div");
			div13 = element("div");
			div6 = element("div");
			div4 = element("div");
			span4 = element("span");
			span4.textContent = `${language.html}`;
			t9 = space();
			div5 = element("div");
			textarea0 = element("textarea");
			t10 = space();
			div9 = element("div");
			div7 = element("div");
			span5 = element("span");
			span5.textContent = `${language.css}`;
			t12 = space();
			div8 = element("div");
			textarea1 = element("textarea");
			t13 = space();
			div12 = element("div");
			div10 = element("div");
			span6 = element("span");
			span6.textContent = `${language.js}`;
			t15 = space();
			div11 = element("div");
			textarea2 = element("textarea");
			t16 = space();
			div18 = element("div");
			div17 = element("div");
			div15 = element("div");
			span7 = element("span");
			span7.textContent = `${language.result}`;
			t18 = space();
			div16 = element("div");
			attr_dev(span0, "class", "icomoon-coding-44px s3 align-middle mr-1");
			add_location(span0, file, 1835, 40, 97751);
			attr_dev(span1, "class", "align-middle");
			add_location(span1, file, 1835, 102, 97813);
			attr_dev(div0, "class", "mt-2 pt-1 pl-2 float-left");
			add_location(div0, file, 1834, 36, 97671);
			attr_dev(span2, "class", "icomoon-menu-2 s3 text-secondary pt-s d-block");
			attr_dev(span2, "id", "dropdownMenuButton1");
			add_location(span2, file, 1838, 124, 98097);
			attr_dev(button0, "class", "btn border-0 px-0 ml-2 mr-2");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "data-bs-toggle", "dropdown");
			add_location(button0, file, 1838, 40, 98013);
			attr_dev(input, "type", "checkbox");
			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
			attr_dev(input, "id", "goDark");
			attr_dev(input, "class", "transparent h");
			add_location(input, file, 1842, 52, 98554);
			add_location(span3, file, 1843, 52, 98712);
			attr_dev(label, "for", "goDark");
			attr_dev(label, "class", "dropdown-item mb-0 pointer");
			add_location(label, file, 1841, 48, 98446);
			add_location(li, file, 1840, 44, 98393);
			attr_dev(ul, "class", "dropdown-menu dropdown-menu-right");
			attr_dev(ul, "x-placement", "bottom-end");
			attr_dev(ul, "aria-labelledby", "dropdownMenuButton1");
			add_location(ul, file, 1839, 40, 98239);
			attr_dev(div1, "class", "float-right mt-2");
			add_location(div1, file, 1837, 36, 97942);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-primary runcode_btn ml mt-1");
			add_location(button1, file, 1849, 40, 99082);
			attr_dev(div2, "class", "inline-block pull-right");
			add_location(div2, file, 1848, 36, 99004);
			attr_dev(div3, "id", "web_toolbar");
			attr_dev(div3, "class", "bg-light w-100 height44 web_toolbar text-dark");
			add_location(div3, file, 1833, 32, 97558);
			add_location(span4, file, 1857, 52, 99752);
			attr_dev(div4, "class", "card-header rounded-0");
			add_location(div4, file, 1856, 48, 99664);
			attr_dev(textarea0, "name", "html");
			attr_dev(textarea0, "id", "html_editor");
			add_location(textarea0, file, 1860, 52, 100017);
			attr_dev(div5, "id", "html");
			attr_dev(div5, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div5, "style", div5_style_value = "height: 347px ");
			add_location(div5, file, 1859, 48, 99877);
			attr_dev(div6, "id", "html_panel");
			attr_dev(div6, "class", "card m-0 p-0 rounded-0");
			add_location(div6, file, 1855, 44, 99563);
			add_location(span5, file, 1865, 52, 100406);
			attr_dev(div7, "class", "card-header rounded-0");
			add_location(div7, file, 1864, 48, 100318);
			attr_dev(textarea1, "name", "css");
			attr_dev(textarea1, "id", "css_editor");
			add_location(textarea1, file, 1868, 52, 100669);
			attr_dev(div8, "id", "css");
			attr_dev(div8, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div8, "style", div8_style_value = "height: 347px");
			add_location(div8, file, 1867, 48, 100530);
			attr_dev(div9, "id", "css_panel");
			attr_dev(div9, "class", "card m-0 p-0 rounded-0");
			add_location(div9, file, 1863, 44, 100218);
			add_location(span6, file, 1874, 56, 101143);
			attr_dev(div10, "class", "card-header rounded-0");
			add_location(div10, file, 1873, 52, 101051);
			attr_dev(textarea2, "name", "js");
			attr_dev(textarea2, "id", "js_editor");
			add_location(textarea2, file, 1877, 56, 101416);
			attr_dev(div11, "id", "js");
			attr_dev(div11, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div11, "style", div11_style_value = "height: 347px ");
			add_location(div11, file, 1876, 52, 101274);
			attr_dev(div12, "id", "js_panel");
			attr_dev(div12, "class", "card m-0 p-0 rounded-0");
			add_location(div12, file, 1872, 48, 100948);
			attr_dev(div13, "id", "firstEditorDiv");
			set_style(div13, "display", "flex");
			add_location(div13, file, 1854, 40, 99471);
			attr_dev(div14, "id", "top_content");
			add_location(div14, file, 1853, 36, 99408);
			add_location(span7, file, 1896, 48, 102780);
			attr_dev(div15, "class", "card-header rounded-0");
			add_location(div15, file, 1895, 44, 102696);
			attr_dev(div16, "id", "result_div");
			attr_dev(div16, "style", div16_style_value = "height: 347px");
			attr_dev(div16, "class", "card-body content-div m-0 p-0 rounded-0");
			add_location(div16, file, 1898, 44, 102899);
			attr_dev(div17, "class", "card rounded-0 nm");
			add_location(div17, file, 1894, 40, 102620);
			attr_dev(div18, "id", "bottom_content");
			attr_dev(div18, "style", div18_style_value = "overflow: hidden");
			add_location(div18, file, 1893, 36, 102527);
			attr_dev(div19, "id", "accordion");
			attr_dev(div19, "style", div19_style_value = "width:100%; background:white; padding:0px;");
			add_location(div19, file, 1852, 32, 99298);
			attr_dev(div20, "class", "row");
			add_location(div20, file, 1832, 28, 97508);
			attr_dev(div21, "class", "container-fluid");
			add_location(div21, file, 1831, 24, 97450);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div21, anchor);
			append_dev(div21, div20);
			append_dev(div20, div3);
			append_dev(div3, div0);
			append_dev(div0, span0);
			append_dev(div0, span1);
			append_dev(div3, t1);
			append_dev(div3, div1);
			append_dev(div1, button0);
			append_dev(button0, span2);
			append_dev(div1, t2);
			append_dev(div1, ul);
			append_dev(ul, li);
			append_dev(li, label);
			append_dev(label, input);
			append_dev(label, t3);
			append_dev(label, span3);
			append_dev(span3, t4);
			append_dev(div3, t5);
			append_dev(div3, div2);
			append_dev(div2, button1);
			append_dev(div20, t7);
			append_dev(div20, div19);
			append_dev(div19, div14);
			append_dev(div14, div13);
			append_dev(div13, div6);
			append_dev(div6, div4);
			append_dev(div4, span4);
			append_dev(div6, t9);
			append_dev(div6, div5);
			append_dev(div5, textarea0);
			append_dev(div13, t10);
			append_dev(div13, div9);
			append_dev(div9, div7);
			append_dev(div7, span5);
			append_dev(div9, t12);
			append_dev(div9, div8);
			append_dev(div8, textarea1);
			append_dev(div13, t13);
			append_dev(div13, div12);
			append_dev(div12, div10);
			append_dev(div10, span6);
			append_dev(div12, t15);
			append_dev(div12, div11);
			append_dev(div11, textarea2);
			append_dev(div19, t16);
			append_dev(div19, div18);
			append_dev(div18, div17);
			append_dev(div17, div15);
			append_dev(div15, span7);
			append_dev(div17, t18);
			append_dev(div17, div16);

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
			if (detaching) detach_dev(div21);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(1831:20) {:else}",
		ctx
	});

	return block;
}

// (1761:16) {#if window.inNative }
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
			t6 = text("x`\n                                    ");
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
			add_location(span0, file, 1766, 36, 92594);
			attr_dev(span1, "class", "align-middle");
			add_location(span1, file, 1766, 98, 92656);
			attr_dev(div0, "class", "mt-2 pt pl-3 float-left");
			add_location(div0, file, 1765, 32, 92520);
			attr_dev(span2, "class", "icomoon-menu-2 s3 text-secondary pt-s d-block");
			add_location(span2, file, 1769, 142, 92955);
			attr_dev(button0, "class", "btn border-0 px-0 ml-2 mr-2");
			attr_dev(button0, "type", "button");
			attr_dev(button0, "data-toggle", "dropdown");
			attr_dev(button0, "id", "dropdownMenuButton1");
			add_location(button0, file, 1769, 36, 92849);
			attr_dev(input, "type", "checkbox");
			input.checked = input_checked_value = /*state*/ ctx[0].goDark;
			attr_dev(input, "id", "goDark");
			attr_dev(input, "class", "position-absolute bg-transparent");
			add_location(input, file, 1773, 48, 93371);
			add_location(span3, file, 1774, 48, 93544);
			attr_dev(label, "for", "goDark");
			attr_dev(label, "class", "dropdown-item mb-0 pointer");
			add_location(label, file, 1772, 44, 93267);
			add_location(li0, file, 1771, 40, 93218);
			attr_dev(ul0, "class", "dropdown-menu dropdown-menu-right");
			attr_dev(ul0, "x-placement", "bottom-end");
			attr_dev(ul0, "aria-labelledby", "dropdownMenuButton1");
			add_location(ul0, file, 1770, 36, 93068);
			attr_dev(div1, "class", "float-right mt-2 mr-2");
			add_location(div1, file, 1768, 32, 92777);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-primary runcode_btn ml");
			add_location(button1, file, 1780, 36, 93892);
			attr_dev(div2, "class", "inline-block pull-right");
			add_location(div2, file, 1779, 32, 93816);
			attr_dev(div3, "id", "web_toolbar");
			attr_dev(div3, "class", "bg-gray height44 web_toolbar text-dark");
			add_location(div3, file, 1764, 28, 92418);
			attr_dev(a0, "class", "nav-link active text-white");
			attr_dev(a0, "href", "#html_panel");
			attr_dev(a0, "role", "tab");
			attr_dev(a0, "data-toggle", "tab");
			add_location(a0, file, 1786, 40, 94357);
			attr_dev(li1, "class", "nav-item");
			attr_dev(li1, "id", "html_pane");
			add_location(li1, file, 1785, 36, 94280);
			attr_dev(a1, "class", "nav-link text-white");
			attr_dev(a1, "href", "#css_panel");
			attr_dev(a1, "role", "tab");
			attr_dev(a1, "data-toggle", "tab");
			add_location(a1, file, 1789, 40, 94610);
			attr_dev(li2, "class", "nav-item");
			attr_dev(li2, "id", "css_pane");
			add_location(li2, file, 1788, 36, 94534);
			attr_dev(a2, "class", "nav-link text-white");
			attr_dev(a2, "href", "#js_panel");
			attr_dev(a2, "role", "tab");
			attr_dev(a2, "data-toggle", "tab");
			add_location(a2, file, 1792, 40, 94853);
			attr_dev(li3, "class", "nav-item");
			attr_dev(li3, "id", "js_pane");
			add_location(li3, file, 1791, 36, 94778);
			attr_dev(ul1, "class", "nav nav-pills nav-fill");
			attr_dev(ul1, "role", "tablist");
			add_location(ul1, file, 1784, 32, 94193);
			attr_dev(textarea0, "name", "html");
			attr_dev(textarea0, "id", "html_editor");
			add_location(textarea0, file, 1799, 48, 95468);
			attr_dev(div4, "id", "html");
			attr_dev(div4, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div4, "style", div4_style_value = "height: 347px");
			add_location(div4, file, 1798, 44, 95333);
			attr_dev(div5, "id", "html_panel");
			attr_dev(div5, "class", "m-0 p-0 rounded-0 tab-pane fade show active");
			attr_dev(div5, "role", "tabpanel");
			add_location(div5, file, 1797, 40, 95198);
			attr_dev(textarea1, "name", "css");
			attr_dev(textarea1, "class", "css_text");
			attr_dev(textarea1, "id", "css_editor");
			add_location(textarea1, file, 1804, 48, 95918);
			attr_dev(div6, "id", "css");
			attr_dev(div6, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div6, "style", div6_style_value = "height: 347px");
			add_location(div6, file, 1803, 44, 95783);
			attr_dev(div7, "id", "css_panel");
			attr_dev(div7, "class", "m-0 p-0 rounded-0 tab-pane fade show");
			attr_dev(div7, "role", "tabpanel");
			add_location(div7, file, 1802, 40, 95657);
			attr_dev(div8, "id", "firstEditorDiv");
			add_location(div8, file, 1796, 36, 95132);
			attr_dev(textarea2, "name", "js");
			attr_dev(textarea2, "id", "js_editor");
			add_location(textarea2, file, 1811, 48, 96483);
			attr_dev(div9, "id", "js");
			attr_dev(div9, "class", "card-body code_box content-div m-0 p-0");
			attr_dev(div9, "style", div9_style_value = "height: 347px");
			add_location(div9, file, 1810, 44, 96349);
			attr_dev(div10, "id", "js_panel");
			attr_dev(div10, "class", "m-0 p-0 rounded-0 tab-pane fade show");
			attr_dev(div10, "role", "tabpanel");
			add_location(div10, file, 1809, 40, 96224);
			attr_dev(div11, "id", "jsEditorDiv");
			add_location(div11, file, 1808, 36, 96161);
			attr_dev(div12, "id", "top_content");
			attr_dev(div12, "class", "tab-content");
			add_location(div12, file, 1795, 32, 95053);
			add_location(span4, file, 1819, 44, 96956);
			attr_dev(div13, "class", "card-header rounded-0");
			add_location(div13, file, 1818, 40, 96876);
			attr_dev(div14, "id", "result_div");
			attr_dev(div14, "style", div14_style_value = "min-height: 347px");
			attr_dev(div14, "class", "card-body content-div m-0 p-0 rounded-0");
			add_location(div14, file, 1821, 40, 97067);
			attr_dev(div15, "class", "card rounded-0 nm");
			add_location(div15, file, 1817, 36, 96804);
			attr_dev(div16, "id", "bottom_content");
			add_location(div16, file, 1816, 32, 96742);
			attr_dev(div17, "style", div17_style_value = "width: 100%;background: white;");
			attr_dev(div17, "class", "content_parent");
			add_location(div17, file, 1783, 28, 94091);
			attr_dev(div18, "class", "row");
			add_location(div18, file, 1763, 24, 92372);
			attr_dev(div19, "class", "container-fluid");
			attr_dev(div19, "id", "mainContainer");
			add_location(div19, file, 1762, 20, 92299);
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
		source: "(1761:16) {#if window.inNative }",
		ctx
	});

	return block;
}

// (1935:4) <div slot="title" style="text-align: left;">
function create_title_slot(ctx) {
	let div0;
	let div1;

	const block = {
		c: function create() {
			div0 = element("div");
			div1 = element("div");
			div1.textContent = `${language.remediation}`;
			add_location(div1, file, 1935, 2, 104441);
			attr_dev(div0, "slot", "title");
			set_style(div0, "text-align", "left");
			add_location(div0, file, 1934, 4, 104394);
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
		source: "(1935:4) <div slot=\\\"title\\\" style=\\\"text-align: left;\\\">",
		ctx
	});

	return block;
}

// (1947:2) <Button key="cancel_btn" class="cancel_btn_pop" style={'float:right;margin:10px;background-color:gray;'} variant="contained" on:click={() => state.remediationToggle = false }>
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
		source: "(1947:2) <Button key=\\\"cancel_btn\\\" class=\\\"cancel_btn_pop\\\" style={'float:right;margin:10px;background-color:gray;'} variant=\\\"contained\\\" on:click={() => state.remediationToggle = false }>",
		ctx
	});

	return block;
}

// (1946:1) <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
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
			add_location(div, file, 1945, 1, 104645);
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
		source: "(1946:1) <div slot=\\\"footer\\\" class=\\\"footer\\\" style=\\\"border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));\\\">",
		ctx
	});

	return block;
}

// (1929:12) <Dialog              bind:visible={state.remediationToggle}  width="650"     on:close={() => state.remediationToggle = false} >
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
			add_location(br, file, 1941, 28, 104587);
			add_location(h4, file, 1941, 4, 104563);
			add_location(center, file, 1939, 3, 104525);
			attr_dev(div0, "id", "remediationModel");
			add_location(div0, file, 1938, 2, 104494);
			add_location(div1, file, 1937, 1, 104486);
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
		source: "(1929:12) <Dialog              bind:visible={state.remediationToggle}  width=\\\"650\\\"     on:close={() => state.remediationToggle = false} >",
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
			add_location(button0, file, 1756, 8, 91972);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "h h-imp");
			attr_dev(button1, "id", "unset-review");
			add_location(button1, file, 1757, 8, 92083);
			add_location(div0, file, 1758, 8, 92200);
			attr_dev(input, "type", "hidden");
			attr_dev(input, "id", "ansModeAnswer");
			input.value = "";
			add_location(input, file, 1951, 8, 104991);
			attr_dev(div1, "id", "authoringArea");
			attr_dev(div1, "class", "font14");
			add_location(div1, file, 1750, 4, 91701);
			add_location(div2, file, 1748, 4, 91690);
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
	let { uaXML } = $$props;
	let { isReview } = $$props;
	xml = uaXML && !(/smans/gi).test(uaXML) ? uaXML : xml;
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
		} else if (pseudo_elm_selector) {
			// selects element with tag name that is equals to the value of variable 'pseudo_elm_selector'
			data = frameDoc.querySelector(pseudo_elm_selector);
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
		if (str) {
			// enters in this block if selector element defined
			if (data) {
				// contains the value of css property defined in array 'input' at index '0' of element that is stored in variable 'data' and have pseudo class which is equals to the value of variable 'str'
				checkStyle = window.getComputedStyle(data, str).getPropertyValue(input[0]);
			}
		} else {
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
		window.uaXML = "";
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
		let qxml = !(/smans/g).test(uaXML) && uaXML ? uaXML : xml;

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
		$$invalidate(6, uaXML = uXml);

		resultSaving = uXml;
	}

	const writable_props = ["inQuizPlayer", "xml", "uaXML", "isReview"];

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
		if ("uaXML" in $$props) $$invalidate(6, uaXML = $$props.uaXML);
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
		Split: split,
		inQuizPlayer,
		xml,
		uaXML,
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
		if ("uaXML" in $$props) $$invalidate(6, uaXML = $$props.uaXML);
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
		uaXML,
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
				uaXML: 6,
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

		if (/*uaXML*/ ctx[6] === undefined && !("uaXML" in props)) {
			console_1.warn("<WebPreview> was created without expected prop 'uaXML'");
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

	get uaXML() {
		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set uaXML(value) {
		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get isReview() {
		throw new Error("<WebPreview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isReview(value) {
		throw new Error("<WebPreview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMWeb/WebAuthoring.svelte generated by Svelte v3.29.0 */

const { console: console_1$1 } = globals;
const file$1 = "clsSMWeb/WebAuthoring.svelte";

// (788:28) <Checkbox                                   checked={state.goDark}                                  on:click={changeTheme}                                  id="goDark"                             >
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
		source: "(788:28) <Checkbox                                   checked={state.goDark}                                  on:click={changeTheme}                                  id=\\\"goDark\\\"                             >",
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
			add_location(button0, file$1, 761, 24, 33363);
			attr_dev(div0, "class", "inline-block pull-left");
			add_location(div0, file$1, 760, 20, 33302);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "data-bs-toggle", "modal");
			attr_dev(button1, "data-bs-target", "#disable_modal");
			attr_dev(button1, "class", "btn btn-primary mr-2");
			add_location(button1, file$1, 769, 24, 33743);
			attr_dev(div1, "class", "inline-block pull-left");
			add_location(div1, file$1, 768, 20, 33682);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "id", "launch_caption");
			attr_dev(input0, "class", "form-control");
			attr_dev(input0, "placeholder", "Caption");
			add_location(input0, file$1, 777, 24, 34128);
			attr_dev(div2, "class", "inline-block pull-left width150");
			add_location(div2, file$1, 776, 20, 34058);
			attr_dev(span0, "class", "themeStyle form-check form-check-inline");
			add_location(span0, file$1, 786, 24, 34546);
			attr_dev(div3, "class", "inline-block width150 relative bottom6 pull-left ml-lg");
			add_location(div3, file$1, 785, 20, 34453);
			attr_dev(i, "class", "fa fa-code");
			add_location(i, file$1, 802, 28, 35262);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-primary ml");
			add_location(button2, file$1, 797, 24, 35053);
			attr_dev(div4, "class", "inline-block pull-right");
			add_location(div4, file$1, 796, 20, 34991);
			attr_dev(div5, "id", "web_toolbar");
			set_style(div5, "height", "50px");
			attr_dev(div5, "class", "bg-light w-100 p-2");
			add_location(div5, file$1, 759, 16, 33210);
			add_location(span1, file$1, 811, 36, 35763);
			attr_dev(div6, "class", "card-header rounded-0");
			add_location(div6, file$1, 810, 32, 35691);
			attr_dev(textarea0, "name", "html");
			attr_dev(textarea0, "id", "html_editor");
			add_location(textarea0, file$1, 814, 36, 35977);
			attr_dev(div7, "id", "html");
			attr_dev(div7, "class", "card-body code_box content-div m-0 p-0");
			set_style(div7, "height", "347px");
			add_location(div7, file$1, 813, 32, 35856);
			attr_dev(div8, "id", "html_panel");
			attr_dev(div8, "class", "card m-0 p-0 rounded-0");
			add_location(div8, file$1, 809, 28, 35606);
			add_location(span2, file$1, 819, 36, 36286);
			attr_dev(div9, "class", "card-header rounded-0");
			add_location(div9, file$1, 818, 32, 36214);
			attr_dev(textarea1, "name", "css");
			attr_dev(textarea1, "id", "css_editor");
			add_location(textarea1, file$1, 822, 36, 36498);
			attr_dev(div10, "id", "css");
			attr_dev(div10, "class", "card-body code_box content-div m-0 p-0");
			set_style(div10, "height", "347px");
			add_location(div10, file$1, 821, 32, 36378);
			attr_dev(div11, "id", "css_panel");
			attr_dev(div11, "class", "card m-0 p-0 rounded-0");
			add_location(div11, file$1, 817, 28, 36130);
			add_location(span3, file$1, 827, 36, 36804);
			attr_dev(div12, "class", "card-header rounded-0");
			add_location(div12, file$1, 826, 32, 36732);
			attr_dev(textarea2, "name", "js");
			attr_dev(textarea2, "id", "js_editor");
			add_location(textarea2, file$1, 830, 36, 37014);
			attr_dev(div13, "id", "js");
			attr_dev(div13, "class", "card-body code_box content-div m-0 p-0");
			set_style(div13, "height", "347px");
			add_location(div13, file$1, 829, 32, 36895);
			attr_dev(div14, "id", "js_panel");
			attr_dev(div14, "class", "card m-0 p-0 rounded-0");
			add_location(div14, file$1, 825, 28, 36649);
			attr_dev(div15, "id", "firstEditorDiv");
			set_style(div15, "display", "flex");
			add_location(div15, file$1, 808, 24, 35530);
			attr_dev(div16, "id", "top_content");
			add_location(div16, file$1, 807, 20, 35483);
			add_location(span4, file$1, 848, 32, 37994);
			attr_dev(div17, "class", "card-header rounded-0");
			add_location(div17, file$1, 847, 28, 37926);
			attr_dev(div18, "id", "result_div");
			set_style(div18, "min-height", "351px");
			attr_dev(div18, "class", "card-body content-div m-0 p-0 rounded-0");
			add_location(div18, file$1, 850, 28, 38081);
			attr_dev(div19, "class", "card rounded-0 nm");
			add_location(div19, file$1, 846, 24, 37866);
			attr_dev(div20, "id", "bottom_content");
			add_location(div20, file$1, 845, 20, 37816);
			attr_dev(div21, "id", "wrap");
			set_style(div21, "width", "100%");
			set_style(div21, "background", "white");
			set_style(div21, "padding", "0px");
			add_location(div21, file$1, 806, 16, 35397);
			attr_dev(div22, "class", "row");
			add_location(div22, file$1, 758, 12, 33176);
			attr_dev(div23, "class", "container-fluid");
			add_location(div23, file$1, 757, 8, 33134);
			add_location(div24, file$1, 756, 4, 33120);
			attr_dev(label0, "for", "autograde_cb");
			attr_dev(label0, "class", "form-check-label pr-2");
			add_location(label0, file$1, 868, 24, 38779);
			attr_dev(input1, "type", "checkbox");
			attr_dev(input1, "name", "autograde_cb");
			attr_dev(input1, "id", "autograde_cb");
			attr_dev(input1, "class", "form-check-input");
			add_location(input1, file$1, 869, 24, 38882);
			attr_dev(h40, "class", "modal-title form-check form-check-inline");
			add_location(h40, file$1, 867, 20, 38701);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "class", "close");
			attr_dev(button3, "data-bs-dismiss", "modal");
			attr_dev(button3, "aria-hidden", "true");
			attr_dev(button3, "id", "close_dialog_btn");
			attr_dev(button3, "auto:focus", "autofocus");
			add_location(button3, file$1, 877, 20, 39214);
			attr_dev(div25, "class", "modal-header");
			add_location(div25, file$1, 866, 16, 38654);
			attr_dev(a0, "class", "text-dark");
			attr_dev(a0, "data-bs-toggle", "collapse");
			attr_dev(a0, "data-bs-parent", "#grade_accordion");
			attr_dev(a0, "href", "#test_case_collapse");
			add_location(a0, file$1, 891, 36, 39923);
			attr_dev(span5, "class", "icomoon-help float-right s4");
			attr_dev(span5, "data-bs-toggle", "tooltip");
			attr_dev(span5, "title", "custom function name|input1,input2,..inputN|Output");
			attr_dev(span5, "data-bs-placement", "left");
			add_location(span5, file$1, 899, 36, 40364);
			attr_dev(h41, "class", "panel-title");
			add_location(h41, file$1, 890, 32, 39862);
			attr_dev(div26, "class", "card-header");
			attr_dev(div26, "data-bs-toggle", "collapse");
			attr_dev(div26, "data-bs-target", "#test_case_collapse");
			add_location(div26, file$1, 889, 28, 39741);
			attr_dev(textarea3, "id", "test_case_text");
			attr_dev(textarea3, "class", "form-control");
			set_style(textarea3, "maxHeight", "150px");
			set_style(textarea3, "minHeight", "80px");
			attr_dev(textarea3, "placeholder", "custom function name|input1,input2,..inputN|Output");
			textarea3.disabled = "disabled";
			add_location(textarea3, file$1, 909, 36, 40972);
			attr_dev(div27, "class", "card-body p-md");
			add_location(div27, file$1, 908, 32, 40907);
			attr_dev(div28, "id", "test_case_collapse");
			attr_dev(div28, "class", "collapse in");
			add_location(div28, file$1, 907, 28, 40825);
			attr_dev(div29, "class", "card mb-2");
			add_location(div29, file$1, 888, 24, 39689);
			attr_dev(a1, "class", "text-dark");
			attr_dev(a1, "data-bs-toggle", "collapse");
			attr_dev(a1, "data-bs-parent", "#grade_accordion");
			attr_dev(a1, "href", "#internal_script_collapse");
			add_location(a1, file$1, 923, 36, 41835);
			attr_dev(span6, "class", "icomoon-help float-right s4");
			attr_dev(span6, "data-bs-toggle", "tooltip");
			attr_dev(span6, "title", "1. attr_match?HTML?tag name{1}?occurance.(for tag match)  2. attr_match?HTML?tag name");
			attr_dev(span6, "data-bs-placement", "left");
			add_location(span6, file$1, 931, 40, 42291);
			attr_dev(h42, "class", "panel-title");
			add_location(h42, file$1, 922, 32, 41774);
			attr_dev(div30, "class", "card-header");
			attr_dev(div30, "data-bs-toggle", "collapse");
			attr_dev(div30, "data-bs-target", "#internal_script_collapse");
			add_location(div30, file$1, 921, 28, 41647);
			attr_dev(textarea4, "id", "occurence_text");
			attr_dev(textarea4, "class", "form-control");
			set_style(textarea4, "max-height", "150px");
			set_style(textarea4, "min-height", "80px");
			attr_dev(textarea4, "placeholder", "function as suggested in help block?Lang?keyword?occurance");
			textarea4.disabled = "disabled";
			add_location(textarea4, file$1, 941, 36, 42967);
			attr_dev(div31, "class", "card-body p-md");
			add_location(div31, file$1, 940, 32, 42902);
			attr_dev(div32, "id", "internal_script_collapse");
			attr_dev(div32, "class", "panel-collapse collapse");
			add_location(div32, file$1, 939, 28, 42802);
			attr_dev(div33, "class", "card mb-2");
			add_location(div33, file$1, 920, 24, 41595);
			attr_dev(a2, "class", "text-dark");
			attr_dev(a2, "data-bs-toggle", "collapse");
			attr_dev(a2, "data-bs-parent", "#grade_accordion");
			attr_dev(a2, "href", "#external_script_collapse");
			add_location(a2, file$1, 955, 36, 43840);
			attr_dev(span7, "class", "icomoon-help float-right s4");
			attr_dev(span7, "data-bs-toggle", "tooltip");
			attr_dev(span7, "title", "Write your own script");
			attr_dev(span7, "data-bs-placement", "left");
			add_location(span7, file$1, 963, 36, 44292);
			attr_dev(h43, "class", "panel-title");
			add_location(h43, file$1, 954, 32, 43779);
			attr_dev(div34, "class", "card-header");
			attr_dev(div34, "data-bs-toggle", "collapse");
			attr_dev(div34, "data-bs-target", "#external_script_collapse");
			add_location(div34, file$1, 953, 28, 43652);
			attr_dev(textarea5, "id", "exscript_text");
			attr_dev(textarea5, "class", "form-control");
			set_style(textarea5, "max-height", "150px");
			set_style(textarea5, "min-height", "80px");
			attr_dev(textarea5, "placeholder", "Write your own script");
			textarea5.disabled = "disabled";
			textarea5.value = "\n                                    ";
			add_location(textarea5, file$1, 973, 36, 44889);
			attr_dev(div35, "class", "card-body p-md");
			add_location(div35, file$1, 972, 32, 44824);
			attr_dev(div36, "id", "external_script_collapse");
			attr_dev(div36, "class", "panel-collapse collapse");
			add_location(div36, file$1, 971, 28, 44724);
			attr_dev(div37, "class", "card mb-2");
			add_location(div37, file$1, 952, 24, 43600);
			attr_dev(div38, "class", "panel-group");
			attr_dev(div38, "id", "grade_accordion");
			add_location(div38, file$1, 887, 20, 39618);
			attr_dev(div39, "class", "modal-body overflow-auto");
			add_location(div39, file$1, 886, 16, 39559);
			attr_dev(button4, "type", "button");
			attr_dev(button4, "class", "btn btn-primary");
			attr_dev(button4, "data-bs-dismiss", "modal");
			attr_dev(button4, "name", "done_grading_btn");
			attr_dev(button4, "id", "done_grading_btn");
			add_location(button4, file$1, 988, 20, 45611);
			attr_dev(div40, "class", "modal-footer");
			add_location(div40, file$1, 987, 16, 45564);
			attr_dev(div41, "class", "modal-content");
			add_location(div41, file$1, 865, 12, 38610);
			attr_dev(div42, "class", "modal-dialog modal-lg modal-dialog-centered");
			add_location(div42, file$1, 864, 8, 38540);
			attr_dev(div43, "id", "autograde_modal");
			attr_dev(div43, "class", "modal fade");
			attr_dev(div43, "role", "dialog");
			add_location(div43, file$1, 863, 4, 38472);
			attr_dev(h44, "class", "modal-title");
			add_location(h44, file$1, 1005, 20, 46232);
			attr_dev(button5, "type", "button");
			attr_dev(button5, "class", "close");
			attr_dev(button5, "data-bs-dismiss", "modal");
			attr_dev(button5, "aria-hidden", "true");
			add_location(button5, file$1, 1006, 20, 46293);
			attr_dev(div44, "class", "modal-header");
			add_location(div44, file$1, 1004, 16, 46185);
			attr_dev(label1, "for", "html_disable");
			add_location(label1, file$1, 1010, 24, 46516);
			option0.__value = "";
			option0.value = option0.__value;
			add_location(option0, file$1, 1012, 28, 46705);
			option1.__value = "0";
			option1.value = option1.__value;
			add_location(option1, file$1, 1013, 28, 46772);
			option2.__value = "1";
			option2.value = option2.__value;
			add_location(option2, file$1, 1014, 28, 46838);
			attr_dev(select0, "class", "form-control");
			attr_dev(select0, "id", "html_disable");
			attr_dev(select0, "auto:focus", "autofocus");
			add_location(select0, file$1, 1011, 24, 46584);
			attr_dev(div45, "class", "form-group");
			add_location(div45, file$1, 1009, 20, 46467);
			attr_dev(label2, "for", "css_disable");
			add_location(label2, file$1, 1018, 24, 47008);
			option3.__value = "";
			option3.value = option3.__value;
			add_location(option3, file$1, 1020, 28, 47171);
			option4.__value = "0";
			option4.value = option4.__value;
			add_location(option4, file$1, 1021, 28, 47238);
			option5.__value = "1";
			option5.value = option5.__value;
			add_location(option5, file$1, 1022, 28, 47304);
			attr_dev(select1, "class", "form-control");
			attr_dev(select1, "id", "css_disable");
			add_location(select1, file$1, 1019, 24, 47074);
			attr_dev(div46, "class", "form-group");
			add_location(div46, file$1, 1017, 20, 46959);
			attr_dev(label3, "for", "js_disable");
			add_location(label3, file$1, 1026, 24, 47474);
			option6.__value = "";
			option6.value = option6.__value;
			add_location(option6, file$1, 1028, 28, 47634);
			option7.__value = "0";
			option7.value = option7.__value;
			add_location(option7, file$1, 1029, 28, 47701);
			option8.__value = "1";
			option8.value = option8.__value;
			add_location(option8, file$1, 1030, 28, 47767);
			attr_dev(select2, "class", "form-control");
			attr_dev(select2, "id", "js_disable");
			add_location(select2, file$1, 1027, 24, 47538);
			attr_dev(div47, "class", "form-group");
			add_location(div47, file$1, 1025, 20, 47425);
			attr_dev(button6, "type", "button");
			attr_dev(button6, "class", "btn btn-primary");
			attr_dev(button6, "data-bs-dismiss", "modal");
			add_location(button6, file$1, 1034, 24, 47938);
			attr_dev(div48, "class", "float-right");
			add_location(div48, file$1, 1033, 20, 47888);
			attr_dev(div49, "class", "modal-body");
			add_location(div49, file$1, 1008, 16, 46422);
			attr_dev(div50, "class", "modal-content");
			add_location(div50, file$1, 1003, 12, 46141);
			attr_dev(div51, "class", "modal-dialog modal-sm modal-dialog-centered");
			add_location(div51, file$1, 1002, 8, 46071);
			attr_dev(div52, "id", "disable_modal");
			attr_dev(div52, "class", "modal fade");
			attr_dev(div52, "role", "dialog");
			add_location(div52, file$1, 1001, 4, 46005);
			attr_dev(input2, "type", "hidden");
			attr_dev(input2, "id", "ansModeAnswer");
			input2.value = "";
			add_location(input2, file$1, 1040, 4, 48125);
			attr_dev(div53, "id", "authoringArea");
			set_style(div53, "line-height", "20px");
			set_style(div53, "font-size", "14px");
			add_location(div53, file$1, 755, 0, 33050);
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
		//     createLink('pe-items/svelte/clsSMWeb/libs/codemirror.min.css');
		//     createLink('pe-items/svelte/clsSMWeb/libs/monokai.css');
		//     createLink('pe-items/svelte/clsSMWeb/libs/simplescrollbars.css');
		//     createLink('pe-items/svelte/clsSMWeb/libs/webitem.min.css');
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

/* clsSMWeb/Web.svelte generated by Svelte v3.29.0 */

const { console: console_1$2 } = globals;
const file$2 = "clsSMWeb/Web.svelte";

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
			add_location(div, file$2, 215, 1, 9278);
			add_location(main, file$2, 214, 0, 9270);
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
//# sourceMappingURL=Web-1d55889e.js.map
