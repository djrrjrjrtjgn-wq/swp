(() => {
    "use strict";
    var e = {},
        t = {};
    function r(o) {
        var n = t[o];
        if (void 0 !== n) return n.exports;
        var a = (t[o] = { exports: {} }),
            i = !0;
        try {
            if (e[o]) {
                e[o](a, a.exports, r);
            } else {
                var dummy = function(props) {
                    return props && props.children ? props.children : null;
                };
                dummy.displayName = "MissingModule_" + o;
                a.exports = new Proxy(dummy, {
                    get: function(target, prop) {
                        if (prop === "__esModule") return true;
                        if (prop === "default") return dummy;
                        if (prop === "$$typeof") return undefined;
                        if (typeof prop === "string" && prop.startsWith("use")) {
                            return function() { return {}; };
                        }
                        return dummy;
                    }
                });
            }
            if (o === 8785 && a.exports) {
                if (a.exports.ErrorBoundaryHandler) {
                    a.exports.ErrorBoundaryHandler.prototype.render = function() {
                        return this.props.children;
                    };
                    a.exports.ErrorBoundaryHandler.getDerivedStateFromError = function() {
                        return { error: null };
                    };
                }
                if (a.exports.ErrorBoundary) {
                    a.exports.ErrorBoundary = function(props) {
                        return props.children;
                    };
                }
            }
            if (o === 7150 && a.exports) {
                a.exports.default = function() { return null; };
            }
            if (o === 3886 && a.exports) {
                if (a.exports.HTTPAccessFallbackBoundary) {
                    a.exports.HTTPAccessFallbackBoundary.prototype.render = function() {
                        return this.props.children;
                    };
                }
            }
            i = !1;
        } finally {
            i && delete t[o];
        }
        return a.exports;
    }
    (r.m = e),
        (() => {
            var e = [];
            r.O = (t, o, n, a) => {
                if (o) {
                    a = a || 0;
                    for (var i = e.length; i > 0 && e[i - 1][2] > a; i--) e[i] = e[i - 1];
                    e[i] = [o, n, a];
                    return;
                }
                for (var u = 1 / 0, i = 0; i < e.length; i++) {
                    for (var [o, n, a] = e[i], l = !0, c = 0; c < o.length; c++)
                        (!1 & a || u >= a) && Object.keys(r.O).every((e) => r.O[e](o[c]))
                            ? o.splice(c--, 1)
                            : ((l = !1), a < u && (u = a));
                    if (l) {
                        e.splice(i--, 1);
                        var d = n();
                        void 0 !== d && (t = d);
                    }
                }
                return t;
            };
        })(),
        (r.n = (e) => {
            var t = e && e.__esModule ? () => e.default : () => e;
            return r.d(t, { a: t }), t;
        }),
        (() => {
            var e,
                t = Object.getPrototypeOf ? (e) => Object.getPrototypeOf(e) : (e) => e.__proto__;
            r.t = function (o, n) {
                if (
                    (1 & n && (o = this(o)),
                    8 & n ||
                        ("object" == typeof o &&
                            o &&
                            ((4 & n && o.__esModule) || (16 & n && "function" == typeof o.then))))
                )
                    return o;
                var a = Object.create(null);
                r.r(a);
                var i = {};
                e = e || [null, t({}), t([]), t(t)];
                for (var u = 2 & n && o; "object" == typeof u && !~e.indexOf(u); u = t(u))
                    Object.getOwnPropertyNames(u).forEach((e) => (i[e] = () => o[e]));
                return (i.default = () => o), r.d(a, i), a;
            };
        })(),
        (r.d = (e, t) => {
            for (var o in t) r.o(t, o) && !r.o(e, o) && Object.defineProperty(e, o, { enumerable: !0, get: t[o] });
        }),
        (r.f = {}),
        (r.e = (e) => Promise.all(Object.keys(r.f).reduce((t, o) => (r.f[o](e, t), t), []))),
        (() => {
            var _u = (e) => e + ".js";
            Object.defineProperty(r, "u", {
                get: () => (e) => {
                    var res = _u(e);
                    return typeof res === "string" ? res.replace(/^(\/?_next\/)?static\/chunks\//, "") : res;
                },
                set: (fn) => {
                    _u = fn;
                },
                configurable: !0,
                enumerable: !0
            });
        })(),
        (r.miniCssF = (e) => {}),
        (r.g = (function () {
            if ("object" == typeof globalThis) return globalThis;
            try {
                return this || Function("return this")();
            } catch (e) {
                if ("object" == typeof window) return window;
            }
        })()),
        (r.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
        (() => {
            var e = {},
                t = "_N_E:";
            r.l = (o, n, a, i) => {
                if (e[o]) return void e[o].push(n);
                if (void 0 !== a)
                    for (var u, l, c = document.getElementsByTagName("script"), d = 0; d < c.length; d++) {
                        var f = c[d];
                        var src = f.getAttribute("src");
                        if (src == o || (src && (src == o.replace(/^\//, "") || "/" + src == o)) || f.getAttribute("data-webpack") == t + a) {
                            u = f;
                            break;
                        }
                    }
                u ||
                    ((l = !0),
                    ((u = document.createElement("script")).charset = "utf-8"),
                    (u.timeout = 120),
                    r.nc && u.setAttribute("nonce", r.nc),
                    u.setAttribute("data-webpack", t + a),
                    (u.src = r.tu(o))),
                    (e[o] = [n]);
                var s = (t, r) => {
                        (u.onerror = u.onload = null), clearTimeout(p);
                        var n = e[o];
                        if ((delete e[o], u.parentNode && u.parentNode.removeChild(u), n && n.forEach((e) => e(r)), t))
                            return t(r);
                    },
                    p = setTimeout(s.bind(null, void 0, { type: "timeout", target: u }), 12e4);
                (u.onerror = (evt) => {
                    var flatName = o.replace(/^.*[\/\\]/, "");
                    var flatUrl = (r.p || "/") + flatName;
                    if (flatUrl !== o && !u._retried) {
                        u._retried = !0;
                        u.src = r.tu(flatUrl);
                        return;
                    }
                    s(u.onerror, evt);
                }),
                    (u.onload = s.bind(null, u.onload)),
                    l && document.head.appendChild(u);
            };
        })(),
        (r.r = (e) => {
            "undefined" != typeof Symbol &&
                Symbol.toStringTag &&
                Object.defineProperty(e, Symbol.toStringTag, { value: "Module" }),
                Object.defineProperty(e, "__esModule", { value: !0 });
        }),
        (() => {
            var e;
            r.tt = () => (
                void 0 === e &&
                    ((e = { createScriptURL: (e) => e }),
                    "undefined" != typeof trustedTypes &&
                        trustedTypes.createPolicy &&
                        (e = trustedTypes.createPolicy("nextjs#bundler", e))),
                e
            );
        })(),
        (r.tu = (e) => r.tt().createScriptURL(e)),
        (r.p = typeof location !== "undefined" && location.protocol === "file:" ? "" : "/"),
        (() => {
            var e = { 68: 0, 1: 0, 466: 0 };
            (r.f.j = (t, o) => {
                var n = r.o(e, t) ? e[t] : void 0;
                if (0 !== n)
                    if (n) o.push(n[2]);
                    else if (/^(1|466|68)$/.test(t)) e[t] = 0;
                    else {
                        var a = new Promise((r, o) => (n = e[t] = [r, o]));
                        o.push((n[2] = a));
                        var chunk = r.u(t);
                        var cleanChunk = chunk ? String(chunk).replace(/^(\/?_next\/)?static\/chunks\//, "").replace(/^\//, "") : t + ".js";
                        var i = r.p + cleanChunk,
                            u = Error();
                        r.l(
                            i,
                            (o) => {
                                if (r.o(e, t) && (0 !== (n = e[t]) && (e[t] = void 0), n)) {
                                    // Suppress error interface on missing/failed chunk by resolving gracefully
                                    e[t] = 0;
                                    n[0]();
                                }
                            },
                            "chunk-" + t,
                            t
                        );
                    }
            }),
                (r.O.j = (t) => 0 === e[t]);
            var t = (t, o) => {
                    var n,
                        a,
                        [i, u, l] = o,
                        c = 0;
                    if (i.some((t) => 0 !== e[t])) {
                        for (n in u) r.o(u, n) && (r.m[n] = u[n]);
                        if (l) var d = l(r);
                    }
                    for (t && t(o); c < i.length; c++) (a = i[c]), r.o(e, a) && e[a] && e[a][0](), (e[a] = 0);
                    return r.O(d);
                },
                o = (self.webpackChunk_N_E = self.webpackChunk_N_E || []);
            o.forEach(t.bind(null, 0)), (o.push = t.bind(null, o.push.bind(o)));
        })();
        if (typeof document !== "undefined") {
            var s = document.createElement("style");
            s.textContent = "#__next_error__, [id='__next_error__'], .next-error-h1, [data-nextjs-dialog-overlay] { display: none !important; }";
            document.head ? document.head.appendChild(s) : document.addEventListener("DOMContentLoaded", () => document.head && document.head.appendChild(s));
        }
})();
