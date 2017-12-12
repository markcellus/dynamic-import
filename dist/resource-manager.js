/** 
* resource-manager-js - v3.1.1.
* git://github.com/mkay581/resource-manager-js.git
* Copyright 2017 Mark Kennedy. Licensed MIT.
*/

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ResourceManager = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**!

 @license
 handlebars v4.0.11

Copyright (C) 2011-2017 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
!function (a, b) {
  "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "object" == (typeof module === "undefined" ? "undefined" : _typeof(module)) ? module.exports = b() : "function" == typeof define && define.amd ? define([], b) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.Handlebars = b() : a.Handlebars = b();
}(undefined, function () {
  return function (a) {
    function b(d) {
      if (c[d]) return c[d].exports;var e = c[d] = { exports: {}, id: d, loaded: !1 };return a[d].call(e.exports, e, e.exports, b), e.loaded = !0, e.exports;
    }var c = {};return b.m = a, b.c = c, b.p = "", b(0);
  }([function (a, b, c) {
    "use strict";
    function d() {
      var a = r();return a.compile = function (b, c) {
        return k.compile(b, c, a);
      }, a.precompile = function (b, c) {
        return k.precompile(b, c, a);
      }, a.AST = i["default"], a.Compiler = k.Compiler, a.JavaScriptCompiler = m["default"], a.Parser = j.parser, a.parse = j.parse, a;
    }var e = c(1)["default"];b.__esModule = !0;var f = c(2),
        g = e(f),
        h = c(35),
        i = e(h),
        j = c(36),
        k = c(41),
        l = c(42),
        m = e(l),
        n = c(39),
        o = e(n),
        p = c(34),
        q = e(p),
        r = g["default"].create,
        s = d();s.create = d, q["default"](s), s.Visitor = o["default"], s["default"] = s, b["default"] = s, a.exports = b["default"];
  }, function (a, b) {
    "use strict";
    b["default"] = function (a) {
      return a && a.__esModule ? a : { "default": a };
    }, b.__esModule = !0;
  }, function (a, b, c) {
    "use strict";
    function d() {
      var a = new h.HandlebarsEnvironment();return n.extend(a, h), a.SafeString = j["default"], a.Exception = l["default"], a.Utils = n, a.escapeExpression = n.escapeExpression, a.VM = p, a.template = function (b) {
        return p.template(b, a);
      }, a;
    }var e = c(3)["default"],
        f = c(1)["default"];b.__esModule = !0;var g = c(4),
        h = e(g),
        i = c(21),
        j = f(i),
        k = c(6),
        l = f(k),
        m = c(5),
        n = e(m),
        o = c(22),
        p = e(o),
        q = c(34),
        r = f(q),
        s = d();s.create = d, r["default"](s), s["default"] = s, b["default"] = s, a.exports = b["default"];
  }, function (a, b) {
    "use strict";
    b["default"] = function (a) {
      if (a && a.__esModule) return a;var b = {};if (null != a) for (var c in a) {
        Object.prototype.hasOwnProperty.call(a, c) && (b[c] = a[c]);
      }return b["default"] = a, b;
    }, b.__esModule = !0;
  }, function (a, b, c) {
    "use strict";
    function d(a, b, c) {
      this.helpers = a || {}, this.partials = b || {}, this.decorators = c || {}, i.registerDefaultHelpers(this), j.registerDefaultDecorators(this);
    }var e = c(1)["default"];b.__esModule = !0, b.HandlebarsEnvironment = d;var f = c(5),
        g = c(6),
        h = e(g),
        i = c(10),
        j = c(18),
        k = c(20),
        l = e(k),
        m = "4.0.11";b.VERSION = m;var n = 7;b.COMPILER_REVISION = n;var o = { 1: "<= 1.0.rc.2", 2: "== 1.0.0-rc.3", 3: "== 1.0.0-rc.4", 4: "== 1.x.x", 5: "== 2.0.0-alpha.x", 6: ">= 2.0.0-beta.1", 7: ">= 4.0.0" };b.REVISION_CHANGES = o;var p = "[object Object]";d.prototype = { constructor: d, logger: l["default"], log: l["default"].log, registerHelper: function registerHelper(a, b) {
        if (f.toString.call(a) === p) {
          if (b) throw new h["default"]("Arg not supported with multiple helpers");f.extend(this.helpers, a);
        } else this.helpers[a] = b;
      }, unregisterHelper: function unregisterHelper(a) {
        delete this.helpers[a];
      }, registerPartial: function registerPartial(a, b) {
        if (f.toString.call(a) === p) f.extend(this.partials, a);else {
          if ("undefined" == typeof b) throw new h["default"]('Attempting to register a partial called "' + a + '" as undefined');this.partials[a] = b;
        }
      }, unregisterPartial: function unregisterPartial(a) {
        delete this.partials[a];
      }, registerDecorator: function registerDecorator(a, b) {
        if (f.toString.call(a) === p) {
          if (b) throw new h["default"]("Arg not supported with multiple decorators");f.extend(this.decorators, a);
        } else this.decorators[a] = b;
      }, unregisterDecorator: function unregisterDecorator(a) {
        delete this.decorators[a];
      } };var q = l["default"].log;b.log = q, b.createFrame = f.createFrame, b.logger = l["default"];
  }, function (a, b) {
    "use strict";
    function c(a) {
      return k[a];
    }function d(a) {
      for (var b = 1; b < arguments.length; b++) {
        for (var c in arguments[b]) {
          Object.prototype.hasOwnProperty.call(arguments[b], c) && (a[c] = arguments[b][c]);
        }
      }return a;
    }function e(a, b) {
      for (var c = 0, d = a.length; c < d; c++) {
        if (a[c] === b) return c;
      }return -1;
    }function f(a) {
      if ("string" != typeof a) {
        if (a && a.toHTML) return a.toHTML();if (null == a) return "";if (!a) return a + "";a = "" + a;
      }return m.test(a) ? a.replace(l, c) : a;
    }function g(a) {
      return !a && 0 !== a || !(!p(a) || 0 !== a.length);
    }function h(a) {
      var b = d({}, a);return b._parent = a, b;
    }function i(a, b) {
      return a.path = b, a;
    }function j(a, b) {
      return (a ? a + "." : "") + b;
    }b.__esModule = !0, b.extend = d, b.indexOf = e, b.escapeExpression = f, b.isEmpty = g, b.createFrame = h, b.blockParams = i, b.appendContextPath = j;var k = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;", "=": "&#x3D;" },
        l = /[&<>"'`=]/g,
        m = /[&<>"'`=]/,
        n = Object.prototype.toString;b.toString = n;var o = function o(a) {
      return "function" == typeof a;
    };o(/x/) && (b.isFunction = o = function o(a) {
      return "function" == typeof a && "[object Function]" === n.call(a);
    }), b.isFunction = o;var p = Array.isArray || function (a) {
      return !(!a || "object" != (typeof a === "undefined" ? "undefined" : _typeof(a))) && "[object Array]" === n.call(a);
    };b.isArray = p;
  }, function (a, b, c) {
    "use strict";
    function d(a, b) {
      var c = b && b.loc,
          g = void 0,
          h = void 0;c && (g = c.start.line, h = c.start.column, a += " - " + g + ":" + h);for (var i = Error.prototype.constructor.call(this, a), j = 0; j < f.length; j++) {
        this[f[j]] = i[f[j]];
      }Error.captureStackTrace && Error.captureStackTrace(this, d);try {
        c && (this.lineNumber = g, e ? Object.defineProperty(this, "column", { value: h, enumerable: !0 }) : this.column = h);
      } catch (k) {}
    }var e = c(7)["default"];b.__esModule = !0;var f = ["description", "fileName", "lineNumber", "message", "name", "number", "stack"];d.prototype = new Error(), b["default"] = d, a.exports = b["default"];
  }, function (a, b, c) {
    a.exports = { "default": c(8), __esModule: !0 };
  }, function (a, b, c) {
    var d = c(9);a.exports = function (a, b, c) {
      return d.setDesc(a, b, c);
    };
  }, function (a, b) {
    var c = Object;a.exports = { create: c.create, getProto: c.getPrototypeOf, isEnum: {}.propertyIsEnumerable, getDesc: c.getOwnPropertyDescriptor, setDesc: c.defineProperty, setDescs: c.defineProperties, getKeys: c.keys, getNames: c.getOwnPropertyNames, getSymbols: c.getOwnPropertySymbols, each: [].forEach };
  }, function (a, b, c) {
    "use strict";
    function d(a) {
      g["default"](a), i["default"](a), k["default"](a), m["default"](a), o["default"](a), q["default"](a), s["default"](a);
    }var e = c(1)["default"];b.__esModule = !0, b.registerDefaultHelpers = d;var f = c(11),
        g = e(f),
        h = c(12),
        i = e(h),
        j = c(13),
        k = e(j),
        l = c(14),
        m = e(l),
        n = c(15),
        o = e(n),
        p = c(16),
        q = e(p),
        r = c(17),
        s = e(r);
  }, function (a, b, c) {
    "use strict";
    b.__esModule = !0;var d = c(5);b["default"] = function (a) {
      a.registerHelper("blockHelperMissing", function (b, c) {
        var e = c.inverse,
            f = c.fn;if (b === !0) return f(this);if (b === !1 || null == b) return e(this);if (d.isArray(b)) return b.length > 0 ? (c.ids && (c.ids = [c.name]), a.helpers.each(b, c)) : e(this);if (c.data && c.ids) {
          var g = d.createFrame(c.data);g.contextPath = d.appendContextPath(c.data.contextPath, c.name), c = { data: g };
        }return f(b, c);
      });
    }, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    var d = c(1)["default"];b.__esModule = !0;var e = c(5),
        f = c(6),
        g = d(f);b["default"] = function (a) {
      a.registerHelper("each", function (a, b) {
        function c(b, c, f) {
          j && (j.key = b, j.index = c, j.first = 0 === c, j.last = !!f, k && (j.contextPath = k + b)), i += d(a[b], { data: j, blockParams: e.blockParams([a[b], b], [k + b, null]) });
        }if (!b) throw new g["default"]("Must pass iterator to #each");var d = b.fn,
            f = b.inverse,
            h = 0,
            i = "",
            j = void 0,
            k = void 0;if (b.data && b.ids && (k = e.appendContextPath(b.data.contextPath, b.ids[0]) + "."), e.isFunction(a) && (a = a.call(this)), b.data && (j = e.createFrame(b.data)), a && "object" == (typeof a === "undefined" ? "undefined" : _typeof(a))) if (e.isArray(a)) for (var l = a.length; h < l; h++) {
          h in a && c(h, h, h === a.length - 1);
        } else {
          var m = void 0;for (var n in a) {
            a.hasOwnProperty(n) && (void 0 !== m && c(m, h - 1), m = n, h++);
          }void 0 !== m && c(m, h - 1, !0);
        }return 0 === h && (i = f(this)), i;
      });
    }, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    var d = c(1)["default"];b.__esModule = !0;var e = c(6),
        f = d(e);b["default"] = function (a) {
      a.registerHelper("helperMissing", function () {
        if (1 !== arguments.length) throw new f["default"]('Missing helper: "' + arguments[arguments.length - 1].name + '"');
      });
    }, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    b.__esModule = !0;var d = c(5);b["default"] = function (a) {
      a.registerHelper("if", function (a, b) {
        return d.isFunction(a) && (a = a.call(this)), !b.hash.includeZero && !a || d.isEmpty(a) ? b.inverse(this) : b.fn(this);
      }), a.registerHelper("unless", function (b, c) {
        return a.helpers["if"].call(this, b, { fn: c.inverse, inverse: c.fn, hash: c.hash });
      });
    }, a.exports = b["default"];
  }, function (a, b) {
    "use strict";
    b.__esModule = !0, b["default"] = function (a) {
      a.registerHelper("log", function () {
        for (var b = [void 0], c = arguments[arguments.length - 1], d = 0; d < arguments.length - 1; d++) {
          b.push(arguments[d]);
        }var e = 1;null != c.hash.level ? e = c.hash.level : c.data && null != c.data.level && (e = c.data.level), b[0] = e, a.log.apply(a, b);
      });
    }, a.exports = b["default"];
  }, function (a, b) {
    "use strict";
    b.__esModule = !0, b["default"] = function (a) {
      a.registerHelper("lookup", function (a, b) {
        return a && a[b];
      });
    }, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    b.__esModule = !0;var d = c(5);b["default"] = function (a) {
      a.registerHelper("with", function (a, b) {
        d.isFunction(a) && (a = a.call(this));var c = b.fn;if (d.isEmpty(a)) return b.inverse(this);var e = b.data;return b.data && b.ids && (e = d.createFrame(b.data), e.contextPath = d.appendContextPath(b.data.contextPath, b.ids[0])), c(a, { data: e, blockParams: d.blockParams([a], [e && e.contextPath]) });
      });
    }, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    function d(a) {
      g["default"](a);
    }var e = c(1)["default"];b.__esModule = !0, b.registerDefaultDecorators = d;var f = c(19),
        g = e(f);
  }, function (a, b, c) {
    "use strict";
    b.__esModule = !0;var d = c(5);b["default"] = function (a) {
      a.registerDecorator("inline", function (a, b, c, e) {
        var f = a;return b.partials || (b.partials = {}, f = function f(e, _f) {
          var g = c.partials;c.partials = d.extend({}, g, b.partials);var h = a(e, _f);return c.partials = g, h;
        }), b.partials[e.args[0]] = e.fn, f;
      });
    }, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    b.__esModule = !0;var d = c(5),
        e = { methodMap: ["debug", "info", "warn", "error"], level: "info", lookupLevel: function lookupLevel(a) {
        if ("string" == typeof a) {
          var b = d.indexOf(e.methodMap, a.toLowerCase());a = b >= 0 ? b : parseInt(a, 10);
        }return a;
      }, log: function log(a) {
        if (a = e.lookupLevel(a), "undefined" != typeof console && e.lookupLevel(e.level) <= a) {
          var b = e.methodMap[a];console[b] || (b = "log");for (var c = arguments.length, d = Array(c > 1 ? c - 1 : 0), f = 1; f < c; f++) {
            d[f - 1] = arguments[f];
          }console[b].apply(console, d);
        }
      } };b["default"] = e, a.exports = b["default"];
  }, function (a, b) {
    "use strict";
    function c(a) {
      this.string = a;
    }b.__esModule = !0, c.prototype.toString = c.prototype.toHTML = function () {
      return "" + this.string;
    }, b["default"] = c, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    function d(a) {
      var b = a && a[0] || 1,
          c = s.COMPILER_REVISION;if (b !== c) {
        if (b < c) {
          var d = s.REVISION_CHANGES[c],
              e = s.REVISION_CHANGES[b];throw new r["default"]("Template was precompiled with an older version of Handlebars than the current runtime. Please update your precompiler to a newer version (" + d + ") or downgrade your runtime to an older version (" + e + ").");
        }throw new r["default"]("Template was precompiled with a newer version of Handlebars than the current runtime. Please update your runtime to a newer version (" + a[1] + ").");
      }
    }function e(a, b) {
      function c(c, d, e) {
        e.hash && (d = p.extend({}, d, e.hash), e.ids && (e.ids[0] = !0)), c = b.VM.resolvePartial.call(this, c, d, e);var f = b.VM.invokePartial.call(this, c, d, e);if (null == f && b.compile && (e.partials[e.name] = b.compile(c, a.compilerOptions, b), f = e.partials[e.name](d, e)), null != f) {
          if (e.indent) {
            for (var g = f.split("\n"), h = 0, i = g.length; h < i && (g[h] || h + 1 !== i); h++) {
              g[h] = e.indent + g[h];
            }f = g.join("\n");
          }return f;
        }throw new r["default"]("The partial " + e.name + " could not be compiled when running in runtime-only mode");
      }function d(b) {
        function c(b) {
          return "" + a.main(e, b, e.helpers, e.partials, g, i, h);
        }var f = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
            g = f.data;d._setup(f), !f.partial && a.useData && (g = j(b, g));var h = void 0,
            i = a.useBlockParams ? [] : void 0;return a.useDepths && (h = f.depths ? b != f.depths[0] ? [b].concat(f.depths) : f.depths : [b]), (c = k(a.main, c, e, f.depths || [], g, i))(b, f);
      }if (!b) throw new r["default"]("No environment passed to template");if (!a || !a.main) throw new r["default"]("Unknown template object: " + (typeof a === "undefined" ? "undefined" : _typeof(a)));a.main.decorator = a.main_d, b.VM.checkRevision(a.compiler);var e = { strict: function strict(a, b) {
          if (!(b in a)) throw new r["default"]('"' + b + '" not defined in ' + a);return a[b];
        }, lookup: function lookup(a, b) {
          for (var c = a.length, d = 0; d < c; d++) {
            if (a[d] && null != a[d][b]) return a[d][b];
          }
        }, lambda: function lambda(a, b) {
          return "function" == typeof a ? a.call(b) : a;
        }, escapeExpression: p.escapeExpression, invokePartial: c, fn: function fn(b) {
          var c = a[b];return c.decorator = a[b + "_d"], c;
        }, programs: [], program: function program(a, b, c, d, e) {
          var g = this.programs[a],
              h = this.fn(a);return b || e || d || c ? g = f(this, a, h, b, c, d, e) : g || (g = this.programs[a] = f(this, a, h)), g;
        }, data: function data(a, b) {
          for (; a && b--;) {
            a = a._parent;
          }return a;
        }, merge: function merge(a, b) {
          var c = a || b;return a && b && a !== b && (c = p.extend({}, b, a)), c;
        }, nullContext: l({}), noop: b.VM.noop, compilerInfo: a.compiler };return d.isTop = !0, d._setup = function (c) {
        c.partial ? (e.helpers = c.helpers, e.partials = c.partials, e.decorators = c.decorators) : (e.helpers = e.merge(c.helpers, b.helpers), a.usePartial && (e.partials = e.merge(c.partials, b.partials)), (a.usePartial || a.useDecorators) && (e.decorators = e.merge(c.decorators, b.decorators)));
      }, d._child = function (b, c, d, g) {
        if (a.useBlockParams && !d) throw new r["default"]("must pass block params");if (a.useDepths && !g) throw new r["default"]("must pass parent depths");return f(e, b, a[b], c, 0, d, g);
      }, d;
    }function f(a, b, c, d, e, f, g) {
      function h(b) {
        var e = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1],
            h = g;return !g || b == g[0] || b === a.nullContext && null === g[0] || (h = [b].concat(g)), c(a, b, a.helpers, a.partials, e.data || d, f && [e.blockParams].concat(f), h);
      }return h = k(c, h, a, g, d, f), h.program = b, h.depth = g ? g.length : 0, h.blockParams = e || 0, h;
    }function g(a, b, c) {
      return a ? a.call || c.name || (c.name = a, a = c.partials[a]) : a = "@partial-block" === c.name ? c.data["partial-block"] : c.partials[c.name], a;
    }function h(a, b, c) {
      var d = c.data && c.data["partial-block"];c.partial = !0, c.ids && (c.data.contextPath = c.ids[0] || c.data.contextPath);var e = void 0;if (c.fn && c.fn !== i && !function () {
        c.data = s.createFrame(c.data);var a = c.fn;e = c.data["partial-block"] = function (b) {
          var c = arguments.length <= 1 || void 0 === arguments[1] ? {} : arguments[1];return c.data = s.createFrame(c.data), c.data["partial-block"] = d, a(b, c);
        }, a.partials && (c.partials = p.extend({}, c.partials, a.partials));
      }(), void 0 === a && e && (a = e), void 0 === a) throw new r["default"]("The partial " + c.name + " could not be found");if (a instanceof Function) return a(b, c);
    }function i() {
      return "";
    }function j(a, b) {
      return b && "root" in b || (b = b ? s.createFrame(b) : {}, b.root = a), b;
    }function k(a, b, c, d, e, f) {
      if (a.decorator) {
        var g = {};b = a.decorator(b, g, c, d && d[0], e, f, d), p.extend(b, g);
      }return b;
    }var l = c(23)["default"],
        m = c(3)["default"],
        n = c(1)["default"];b.__esModule = !0, b.checkRevision = d, b.template = e, b.wrapProgram = f, b.resolvePartial = g, b.invokePartial = h, b.noop = i;var o = c(5),
        p = m(o),
        q = c(6),
        r = n(q),
        s = c(4);
  }, function (a, b, c) {
    a.exports = { "default": c(24), __esModule: !0 };
  }, function (a, b, c) {
    c(25), a.exports = c(30).Object.seal;
  }, function (a, b, c) {
    var d = c(26);c(27)("seal", function (a) {
      return function (b) {
        return a && d(b) ? a(b) : b;
      };
    });
  }, function (a, b) {
    a.exports = function (a) {
      return "object" == (typeof a === "undefined" ? "undefined" : _typeof(a)) ? null !== a : "function" == typeof a;
    };
  }, function (a, b, c) {
    var d = c(28),
        e = c(30),
        f = c(33);a.exports = function (a, b) {
      var c = (e.Object || {})[a] || Object[a],
          g = {};g[a] = b(c), d(d.S + d.F * f(function () {
        c(1);
      }), "Object", g);
    };
  }, function (a, b, c) {
    var d = c(29),
        e = c(30),
        f = c(31),
        g = "prototype",
        h = function h(a, b, c) {
      var i,
          j,
          k,
          l = a & h.F,
          m = a & h.G,
          n = a & h.S,
          o = a & h.P,
          p = a & h.B,
          q = a & h.W,
          r = m ? e : e[b] || (e[b] = {}),
          s = m ? d : n ? d[b] : (d[b] || {})[g];m && (c = b);for (i in c) {
        j = !l && s && i in s, j && i in r || (k = j ? s[i] : c[i], r[i] = m && "function" != typeof s[i] ? c[i] : p && j ? f(k, d) : q && s[i] == k ? function (a) {
          var b = function b(_b) {
            return this instanceof a ? new a(_b) : a(_b);
          };return b[g] = a[g], b;
        }(k) : o && "function" == typeof k ? f(Function.call, k) : k, o && ((r[g] || (r[g] = {}))[i] = k));
      }
    };h.F = 1, h.G = 2, h.S = 4, h.P = 8, h.B = 16, h.W = 32, a.exports = h;
  }, function (a, b) {
    var c = a.exports = "undefined" != typeof window && window.Math == Math ? window : "undefined" != typeof self && self.Math == Math ? self : Function("return this")();"number" == typeof __g && (__g = c);
  }, function (a, b) {
    var c = a.exports = { version: "1.2.6" };"number" == typeof __e && (__e = c);
  }, function (a, b, c) {
    var d = c(32);a.exports = function (a, b, c) {
      if (d(a), void 0 === b) return a;switch (c) {case 1:
          return function (c) {
            return a.call(b, c);
          };case 2:
          return function (c, d) {
            return a.call(b, c, d);
          };case 3:
          return function (c, d, e) {
            return a.call(b, c, d, e);
          };}return function () {
        return a.apply(b, arguments);
      };
    };
  }, function (a, b) {
    a.exports = function (a) {
      if ("function" != typeof a) throw TypeError(a + " is not a function!");return a;
    };
  }, function (a, b) {
    a.exports = function (a) {
      try {
        return !!a();
      } catch (b) {
        return !0;
      }
    };
  }, function (a, b) {
    (function (c) {
      "use strict";
      b.__esModule = !0, b["default"] = function (a) {
        var b = "undefined" != typeof c ? c : window,
            d = b.Handlebars;a.noConflict = function () {
          return b.Handlebars === a && (b.Handlebars = d), a;
        };
      }, a.exports = b["default"];
    }).call(b, function () {
      return this;
    }());
  }, function (a, b) {
    "use strict";
    b.__esModule = !0;var c = { helpers: { helperExpression: function helperExpression(a) {
          return "SubExpression" === a.type || ("MustacheStatement" === a.type || "BlockStatement" === a.type) && !!(a.params && a.params.length || a.hash);
        }, scopedId: function scopedId(a) {
          return (/^\.|this\b/.test(a.original)
          );
        }, simpleId: function simpleId(a) {
          return 1 === a.parts.length && !c.helpers.scopedId(a) && !a.depth;
        } } };b["default"] = c, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    function d(a, b) {
      if ("Program" === a.type) return a;h["default"].yy = n, n.locInfo = function (a) {
        return new n.SourceLocation(b && b.srcName, a);
      };var c = new j["default"](b);return c.accept(h["default"].parse(a));
    }var e = c(1)["default"],
        f = c(3)["default"];b.__esModule = !0, b.parse = d;var g = c(37),
        h = e(g),
        i = c(38),
        j = e(i),
        k = c(40),
        l = f(k),
        m = c(5);b.parser = h["default"];var n = {};m.extend(n, l);
  }, function (a, b) {
    "use strict";
    b.__esModule = !0;var c = function () {
      function a() {
        this.yy = {};
      }var b = { trace: function trace() {}, yy: {}, symbols_: { error: 2, root: 3, program: 4, EOF: 5, program_repetition0: 6, statement: 7, mustache: 8, block: 9, rawBlock: 10, partial: 11, partialBlock: 12, content: 13, COMMENT: 14, CONTENT: 15, openRawBlock: 16, rawBlock_repetition_plus0: 17, END_RAW_BLOCK: 18, OPEN_RAW_BLOCK: 19, helperName: 20, openRawBlock_repetition0: 21, openRawBlock_option0: 22, CLOSE_RAW_BLOCK: 23, openBlock: 24, block_option0: 25, closeBlock: 26, openInverse: 27, block_option1: 28, OPEN_BLOCK: 29, openBlock_repetition0: 30, openBlock_option0: 31, openBlock_option1: 32, CLOSE: 33, OPEN_INVERSE: 34, openInverse_repetition0: 35, openInverse_option0: 36, openInverse_option1: 37, openInverseChain: 38, OPEN_INVERSE_CHAIN: 39, openInverseChain_repetition0: 40, openInverseChain_option0: 41, openInverseChain_option1: 42, inverseAndProgram: 43, INVERSE: 44, inverseChain: 45, inverseChain_option0: 46, OPEN_ENDBLOCK: 47, OPEN: 48, mustache_repetition0: 49, mustache_option0: 50, OPEN_UNESCAPED: 51, mustache_repetition1: 52, mustache_option1: 53, CLOSE_UNESCAPED: 54, OPEN_PARTIAL: 55, partialName: 56, partial_repetition0: 57, partial_option0: 58, openPartialBlock: 59, OPEN_PARTIAL_BLOCK: 60, openPartialBlock_repetition0: 61, openPartialBlock_option0: 62, param: 63, sexpr: 64, OPEN_SEXPR: 65, sexpr_repetition0: 66, sexpr_option0: 67, CLOSE_SEXPR: 68, hash: 69, hash_repetition_plus0: 70, hashSegment: 71, ID: 72, EQUALS: 73, blockParams: 74, OPEN_BLOCK_PARAMS: 75, blockParams_repetition_plus0: 76, CLOSE_BLOCK_PARAMS: 77, path: 78, dataName: 79, STRING: 80, NUMBER: 81, BOOLEAN: 82, UNDEFINED: 83, NULL: 84, DATA: 85, pathSegments: 86, SEP: 87, $accept: 0, $end: 1 }, terminals_: { 2: "error", 5: "EOF", 14: "COMMENT", 15: "CONTENT", 18: "END_RAW_BLOCK", 19: "OPEN_RAW_BLOCK", 23: "CLOSE_RAW_BLOCK", 29: "OPEN_BLOCK", 33: "CLOSE", 34: "OPEN_INVERSE", 39: "OPEN_INVERSE_CHAIN", 44: "INVERSE", 47: "OPEN_ENDBLOCK", 48: "OPEN", 51: "OPEN_UNESCAPED", 54: "CLOSE_UNESCAPED", 55: "OPEN_PARTIAL", 60: "OPEN_PARTIAL_BLOCK", 65: "OPEN_SEXPR", 68: "CLOSE_SEXPR", 72: "ID", 73: "EQUALS", 75: "OPEN_BLOCK_PARAMS", 77: "CLOSE_BLOCK_PARAMS", 80: "STRING", 81: "NUMBER", 82: "BOOLEAN", 83: "UNDEFINED", 84: "NULL", 85: "DATA", 87: "SEP" }, productions_: [0, [3, 2], [4, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [7, 1], [13, 1], [10, 3], [16, 5], [9, 4], [9, 4], [24, 6], [27, 6], [38, 6], [43, 2], [45, 3], [45, 1], [26, 3], [8, 5], [8, 5], [11, 5], [12, 3], [59, 5], [63, 1], [63, 1], [64, 5], [69, 1], [71, 3], [74, 3], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [20, 1], [56, 1], [56, 1], [79, 2], [78, 1], [86, 3], [86, 1], [6, 0], [6, 2], [17, 1], [17, 2], [21, 0], [21, 2], [22, 0], [22, 1], [25, 0], [25, 1], [28, 0], [28, 1], [30, 0], [30, 2], [31, 0], [31, 1], [32, 0], [32, 1], [35, 0], [35, 2], [36, 0], [36, 1], [37, 0], [37, 1], [40, 0], [40, 2], [41, 0], [41, 1], [42, 0], [42, 1], [46, 0], [46, 1], [49, 0], [49, 2], [50, 0], [50, 1], [52, 0], [52, 2], [53, 0], [53, 1], [57, 0], [57, 2], [58, 0], [58, 1], [61, 0], [61, 2], [62, 0], [62, 1], [66, 0], [66, 2], [67, 0], [67, 1], [70, 1], [70, 2], [76, 1], [76, 2]], performAction: function performAction(a, b, c, d, e, f, g) {
          var h = f.length - 1;switch (e) {case 1:
              return f[h - 1];case 2:
              this.$ = d.prepareProgram(f[h]);break;case 3:
              this.$ = f[h];break;case 4:
              this.$ = f[h];break;case 5:
              this.$ = f[h];break;case 6:
              this.$ = f[h];break;case 7:
              this.$ = f[h];break;case 8:
              this.$ = f[h];break;case 9:
              this.$ = { type: "CommentStatement", value: d.stripComment(f[h]), strip: d.stripFlags(f[h], f[h]), loc: d.locInfo(this._$) };break;case 10:
              this.$ = { type: "ContentStatement", original: f[h], value: f[h], loc: d.locInfo(this._$) };break;case 11:
              this.$ = d.prepareRawBlock(f[h - 2], f[h - 1], f[h], this._$);break;case 12:
              this.$ = { path: f[h - 3], params: f[h - 2], hash: f[h - 1] };break;case 13:
              this.$ = d.prepareBlock(f[h - 3], f[h - 2], f[h - 1], f[h], !1, this._$);break;case 14:
              this.$ = d.prepareBlock(f[h - 3], f[h - 2], f[h - 1], f[h], !0, this._$);break;case 15:
              this.$ = { open: f[h - 5], path: f[h - 4], params: f[h - 3], hash: f[h - 2], blockParams: f[h - 1], strip: d.stripFlags(f[h - 5], f[h]) };break;case 16:
              this.$ = { path: f[h - 4], params: f[h - 3], hash: f[h - 2], blockParams: f[h - 1], strip: d.stripFlags(f[h - 5], f[h]) };break;case 17:
              this.$ = { path: f[h - 4], params: f[h - 3], hash: f[h - 2], blockParams: f[h - 1], strip: d.stripFlags(f[h - 5], f[h]) };break;case 18:
              this.$ = { strip: d.stripFlags(f[h - 1], f[h - 1]), program: f[h] };break;case 19:
              var i = d.prepareBlock(f[h - 2], f[h - 1], f[h], f[h], !1, this._$),
                  j = d.prepareProgram([i], f[h - 1].loc);j.chained = !0, this.$ = { strip: f[h - 2].strip, program: j, chain: !0 };break;case 20:
              this.$ = f[h];break;case 21:
              this.$ = { path: f[h - 1], strip: d.stripFlags(f[h - 2], f[h]) };break;case 22:
              this.$ = d.prepareMustache(f[h - 3], f[h - 2], f[h - 1], f[h - 4], d.stripFlags(f[h - 4], f[h]), this._$);break;case 23:
              this.$ = d.prepareMustache(f[h - 3], f[h - 2], f[h - 1], f[h - 4], d.stripFlags(f[h - 4], f[h]), this._$);break;case 24:
              this.$ = { type: "PartialStatement", name: f[h - 3], params: f[h - 2], hash: f[h - 1], indent: "", strip: d.stripFlags(f[h - 4], f[h]), loc: d.locInfo(this._$) };break;case 25:
              this.$ = d.preparePartialBlock(f[h - 2], f[h - 1], f[h], this._$);break;case 26:
              this.$ = { path: f[h - 3], params: f[h - 2], hash: f[h - 1], strip: d.stripFlags(f[h - 4], f[h]) };break;case 27:
              this.$ = f[h];break;case 28:
              this.$ = f[h];break;case 29:
              this.$ = { type: "SubExpression", path: f[h - 3], params: f[h - 2], hash: f[h - 1], loc: d.locInfo(this._$) };break;case 30:
              this.$ = { type: "Hash", pairs: f[h], loc: d.locInfo(this._$) };break;case 31:
              this.$ = { type: "HashPair", key: d.id(f[h - 2]), value: f[h], loc: d.locInfo(this._$) };break;case 32:
              this.$ = d.id(f[h - 1]);break;case 33:
              this.$ = f[h];break;case 34:
              this.$ = f[h];break;case 35:
              this.$ = { type: "StringLiteral", value: f[h], original: f[h], loc: d.locInfo(this._$) };break;case 36:
              this.$ = { type: "NumberLiteral", value: Number(f[h]), original: Number(f[h]), loc: d.locInfo(this._$) };break;case 37:
              this.$ = { type: "BooleanLiteral", value: "true" === f[h], original: "true" === f[h], loc: d.locInfo(this._$) };break;case 38:
              this.$ = { type: "UndefinedLiteral", original: void 0, value: void 0, loc: d.locInfo(this._$) };break;case 39:
              this.$ = { type: "NullLiteral", original: null, value: null, loc: d.locInfo(this._$) };break;case 40:
              this.$ = f[h];break;case 41:
              this.$ = f[h];break;case 42:
              this.$ = d.preparePath(!0, f[h], this._$);break;case 43:
              this.$ = d.preparePath(!1, f[h], this._$);break;case 44:
              f[h - 2].push({ part: d.id(f[h]), original: f[h], separator: f[h - 1] }), this.$ = f[h - 2];break;case 45:
              this.$ = [{ part: d.id(f[h]), original: f[h] }];break;case 46:
              this.$ = [];break;case 47:
              f[h - 1].push(f[h]);break;case 48:
              this.$ = [f[h]];break;case 49:
              f[h - 1].push(f[h]);break;case 50:
              this.$ = [];break;case 51:
              f[h - 1].push(f[h]);break;case 58:
              this.$ = [];break;case 59:
              f[h - 1].push(f[h]);break;case 64:
              this.$ = [];break;case 65:
              f[h - 1].push(f[h]);break;case 70:
              this.$ = [];break;case 71:
              f[h - 1].push(f[h]);break;case 78:
              this.$ = [];break;case 79:
              f[h - 1].push(f[h]);break;case 82:
              this.$ = [];break;case 83:
              f[h - 1].push(f[h]);break;case 86:
              this.$ = [];break;case 87:
              f[h - 1].push(f[h]);break;case 90:
              this.$ = [];break;case 91:
              f[h - 1].push(f[h]);break;case 94:
              this.$ = [];break;case 95:
              f[h - 1].push(f[h]);break;case 98:
              this.$ = [f[h]];break;case 99:
              f[h - 1].push(f[h]);break;case 100:
              this.$ = [f[h]];break;case 101:
              f[h - 1].push(f[h]);}
        }, table: [{ 3: 1, 4: 2, 5: [2, 46], 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 1: [3] }, { 5: [1, 4] }, { 5: [2, 2], 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10, 13: 11, 14: [1, 12], 15: [1, 20], 16: 17, 19: [1, 23], 24: 15, 27: 16, 29: [1, 21], 34: [1, 22], 39: [2, 2], 44: [2, 2], 47: [2, 2], 48: [1, 13], 51: [1, 14], 55: [1, 18], 59: 19, 60: [1, 24] }, { 1: [2, 1] }, { 5: [2, 47], 14: [2, 47], 15: [2, 47], 19: [2, 47], 29: [2, 47], 34: [2, 47], 39: [2, 47], 44: [2, 47], 47: [2, 47], 48: [2, 47], 51: [2, 47], 55: [2, 47], 60: [2, 47] }, { 5: [2, 3], 14: [2, 3], 15: [2, 3], 19: [2, 3], 29: [2, 3], 34: [2, 3], 39: [2, 3], 44: [2, 3], 47: [2, 3], 48: [2, 3], 51: [2, 3], 55: [2, 3], 60: [2, 3] }, { 5: [2, 4], 14: [2, 4], 15: [2, 4], 19: [2, 4], 29: [2, 4], 34: [2, 4], 39: [2, 4], 44: [2, 4], 47: [2, 4], 48: [2, 4], 51: [2, 4], 55: [2, 4], 60: [2, 4] }, { 5: [2, 5], 14: [2, 5], 15: [2, 5], 19: [2, 5], 29: [2, 5], 34: [2, 5], 39: [2, 5], 44: [2, 5], 47: [2, 5], 48: [2, 5], 51: [2, 5], 55: [2, 5], 60: [2, 5] }, { 5: [2, 6], 14: [2, 6], 15: [2, 6], 19: [2, 6], 29: [2, 6], 34: [2, 6], 39: [2, 6], 44: [2, 6], 47: [2, 6], 48: [2, 6], 51: [2, 6], 55: [2, 6], 60: [2, 6] }, { 5: [2, 7], 14: [2, 7], 15: [2, 7], 19: [2, 7], 29: [2, 7], 34: [2, 7], 39: [2, 7], 44: [2, 7], 47: [2, 7], 48: [2, 7], 51: [2, 7], 55: [2, 7], 60: [2, 7] }, { 5: [2, 8], 14: [2, 8], 15: [2, 8], 19: [2, 8], 29: [2, 8], 34: [2, 8], 39: [2, 8], 44: [2, 8], 47: [2, 8], 48: [2, 8], 51: [2, 8], 55: [2, 8], 60: [2, 8] }, { 5: [2, 9], 14: [2, 9], 15: [2, 9], 19: [2, 9], 29: [2, 9], 34: [2, 9], 39: [2, 9], 44: [2, 9], 47: [2, 9], 48: [2, 9], 51: [2, 9], 55: [2, 9], 60: [2, 9] }, { 20: 25, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 36, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 37, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 4: 38, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 13: 40, 15: [1, 20], 17: 39 }, { 20: 42, 56: 41, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 45, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 5: [2, 10], 14: [2, 10], 15: [2, 10], 18: [2, 10], 19: [2, 10], 29: [2, 10], 34: [2, 10], 39: [2, 10], 44: [2, 10], 47: [2, 10], 48: [2, 10], 51: [2, 10], 55: [2, 10], 60: [2, 10] }, { 20: 46, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 47, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 48, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 42, 56: 49, 64: 43, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [2, 78], 49: 50, 65: [2, 78], 72: [2, 78], 80: [2, 78], 81: [2, 78], 82: [2, 78], 83: [2, 78], 84: [2, 78], 85: [2, 78] }, { 23: [2, 33], 33: [2, 33], 54: [2, 33], 65: [2, 33], 68: [2, 33], 72: [2, 33], 75: [2, 33], 80: [2, 33], 81: [2, 33], 82: [2, 33], 83: [2, 33], 84: [2, 33], 85: [2, 33] }, { 23: [2, 34], 33: [2, 34], 54: [2, 34], 65: [2, 34], 68: [2, 34], 72: [2, 34], 75: [2, 34], 80: [2, 34], 81: [2, 34], 82: [2, 34], 83: [2, 34], 84: [2, 34], 85: [2, 34] }, { 23: [2, 35], 33: [2, 35], 54: [2, 35], 65: [2, 35], 68: [2, 35], 72: [2, 35], 75: [2, 35], 80: [2, 35], 81: [2, 35], 82: [2, 35], 83: [2, 35], 84: [2, 35], 85: [2, 35] }, { 23: [2, 36], 33: [2, 36], 54: [2, 36], 65: [2, 36], 68: [2, 36], 72: [2, 36], 75: [2, 36], 80: [2, 36], 81: [2, 36], 82: [2, 36], 83: [2, 36], 84: [2, 36], 85: [2, 36] }, { 23: [2, 37], 33: [2, 37], 54: [2, 37], 65: [2, 37], 68: [2, 37], 72: [2, 37], 75: [2, 37], 80: [2, 37], 81: [2, 37], 82: [2, 37], 83: [2, 37], 84: [2, 37], 85: [2, 37] }, { 23: [2, 38], 33: [2, 38], 54: [2, 38], 65: [2, 38], 68: [2, 38], 72: [2, 38], 75: [2, 38], 80: [2, 38], 81: [2, 38], 82: [2, 38], 83: [2, 38], 84: [2, 38], 85: [2, 38] }, { 23: [2, 39], 33: [2, 39], 54: [2, 39], 65: [2, 39], 68: [2, 39], 72: [2, 39], 75: [2, 39], 80: [2, 39], 81: [2, 39], 82: [2, 39], 83: [2, 39], 84: [2, 39], 85: [2, 39] }, { 23: [2, 43], 33: [2, 43], 54: [2, 43], 65: [2, 43], 68: [2, 43], 72: [2, 43], 75: [2, 43], 80: [2, 43], 81: [2, 43], 82: [2, 43], 83: [2, 43], 84: [2, 43], 85: [2, 43], 87: [1, 51] }, { 72: [1, 35], 86: 52 }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 52: 53, 54: [2, 82], 65: [2, 82], 72: [2, 82], 80: [2, 82], 81: [2, 82], 82: [2, 82], 83: [2, 82], 84: [2, 82], 85: [2, 82] }, { 25: 54, 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 55, 47: [2, 54] }, { 28: 60, 43: 61, 44: [1, 59], 47: [2, 56] }, { 13: 63, 15: [1, 20], 18: [1, 62] }, { 15: [2, 48], 18: [2, 48] }, { 33: [2, 86], 57: 64, 65: [2, 86], 72: [2, 86], 80: [2, 86], 81: [2, 86], 82: [2, 86], 83: [2, 86], 84: [2, 86], 85: [2, 86] }, { 33: [2, 40], 65: [2, 40], 72: [2, 40], 80: [2, 40], 81: [2, 40], 82: [2, 40], 83: [2, 40], 84: [2, 40], 85: [2, 40] }, { 33: [2, 41], 65: [2, 41], 72: [2, 41], 80: [2, 41], 81: [2, 41], 82: [2, 41], 83: [2, 41], 84: [2, 41], 85: [2, 41] }, { 20: 65, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 66, 47: [1, 67] }, { 30: 68, 33: [2, 58], 65: [2, 58], 72: [2, 58], 75: [2, 58], 80: [2, 58], 81: [2, 58], 82: [2, 58], 83: [2, 58], 84: [2, 58], 85: [2, 58] }, { 33: [2, 64], 35: 69, 65: [2, 64], 72: [2, 64], 75: [2, 64], 80: [2, 64], 81: [2, 64], 82: [2, 64], 83: [2, 64], 84: [2, 64], 85: [2, 64] }, { 21: 70, 23: [2, 50], 65: [2, 50], 72: [2, 50], 80: [2, 50], 81: [2, 50], 82: [2, 50], 83: [2, 50], 84: [2, 50], 85: [2, 50] }, { 33: [2, 90], 61: 71, 65: [2, 90], 72: [2, 90], 80: [2, 90], 81: [2, 90], 82: [2, 90], 83: [2, 90], 84: [2, 90], 85: [2, 90] }, { 20: 75, 33: [2, 80], 50: 72, 63: 73, 64: 76, 65: [1, 44], 69: 74, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 72: [1, 80] }, { 23: [2, 42], 33: [2, 42], 54: [2, 42], 65: [2, 42], 68: [2, 42], 72: [2, 42], 75: [2, 42], 80: [2, 42], 81: [2, 42], 82: [2, 42], 83: [2, 42], 84: [2, 42], 85: [2, 42], 87: [1, 51] }, { 20: 75, 53: 81, 54: [2, 84], 63: 82, 64: 76, 65: [1, 44], 69: 83, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 26: 84, 47: [1, 67] }, { 47: [2, 55] }, { 4: 85, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 39: [2, 46], 44: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 47: [2, 20] }, { 20: 86, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 4: 87, 6: 3, 14: [2, 46], 15: [2, 46], 19: [2, 46], 29: [2, 46], 34: [2, 46], 47: [2, 46], 48: [2, 46], 51: [2, 46], 55: [2, 46], 60: [2, 46] }, { 26: 88, 47: [1, 67] }, { 47: [2, 57] }, { 5: [2, 11], 14: [2, 11], 15: [2, 11], 19: [2, 11], 29: [2, 11], 34: [2, 11], 39: [2, 11], 44: [2, 11], 47: [2, 11], 48: [2, 11], 51: [2, 11], 55: [2, 11], 60: [2, 11] }, { 15: [2, 49], 18: [2, 49] }, { 20: 75, 33: [2, 88], 58: 89, 63: 90, 64: 76, 65: [1, 44], 69: 91, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 65: [2, 94], 66: 92, 68: [2, 94], 72: [2, 94], 80: [2, 94], 81: [2, 94], 82: [2, 94], 83: [2, 94], 84: [2, 94], 85: [2, 94] }, { 5: [2, 25], 14: [2, 25], 15: [2, 25], 19: [2, 25], 29: [2, 25], 34: [2, 25], 39: [2, 25], 44: [2, 25], 47: [2, 25], 48: [2, 25], 51: [2, 25], 55: [2, 25], 60: [2, 25] }, { 20: 93, 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 31: 94, 33: [2, 60], 63: 95, 64: 76, 65: [1, 44], 69: 96, 70: 77, 71: 78, 72: [1, 79], 75: [2, 60], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 66], 36: 97, 63: 98, 64: 76, 65: [1, 44], 69: 99, 70: 77, 71: 78, 72: [1, 79], 75: [2, 66], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 22: 100, 23: [2, 52], 63: 101, 64: 76, 65: [1, 44], 69: 102, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 20: 75, 33: [2, 92], 62: 103, 63: 104, 64: 76, 65: [1, 44], 69: 105, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 106] }, { 33: [2, 79], 65: [2, 79], 72: [2, 79], 80: [2, 79], 81: [2, 79], 82: [2, 79], 83: [2, 79], 84: [2, 79], 85: [2, 79] }, { 33: [2, 81] }, { 23: [2, 27], 33: [2, 27], 54: [2, 27], 65: [2, 27], 68: [2, 27], 72: [2, 27], 75: [2, 27], 80: [2, 27], 81: [2, 27], 82: [2, 27], 83: [2, 27], 84: [2, 27], 85: [2, 27] }, { 23: [2, 28], 33: [2, 28], 54: [2, 28], 65: [2, 28], 68: [2, 28], 72: [2, 28], 75: [2, 28], 80: [2, 28], 81: [2, 28], 82: [2, 28], 83: [2, 28], 84: [2, 28], 85: [2, 28] }, { 23: [2, 30], 33: [2, 30], 54: [2, 30], 68: [2, 30], 71: 107, 72: [1, 108], 75: [2, 30] }, { 23: [2, 98], 33: [2, 98], 54: [2, 98], 68: [2, 98], 72: [2, 98], 75: [2, 98] }, { 23: [2, 45], 33: [2, 45], 54: [2, 45], 65: [2, 45], 68: [2, 45], 72: [2, 45], 73: [1, 109], 75: [2, 45], 80: [2, 45], 81: [2, 45], 82: [2, 45], 83: [2, 45], 84: [2, 45], 85: [2, 45], 87: [2, 45] }, { 23: [2, 44], 33: [2, 44], 54: [2, 44], 65: [2, 44], 68: [2, 44], 72: [2, 44], 75: [2, 44], 80: [2, 44], 81: [2, 44], 82: [2, 44], 83: [2, 44], 84: [2, 44], 85: [2, 44], 87: [2, 44] }, { 54: [1, 110] }, { 54: [2, 83], 65: [2, 83], 72: [2, 83], 80: [2, 83], 81: [2, 83], 82: [2, 83], 83: [2, 83], 84: [2, 83], 85: [2, 83] }, { 54: [2, 85] }, { 5: [2, 13], 14: [2, 13], 15: [2, 13], 19: [2, 13], 29: [2, 13], 34: [2, 13], 39: [2, 13], 44: [2, 13], 47: [2, 13], 48: [2, 13], 51: [2, 13], 55: [2, 13], 60: [2, 13] }, { 38: 56, 39: [1, 58], 43: 57, 44: [1, 59], 45: 112, 46: 111, 47: [2, 76] }, { 33: [2, 70], 40: 113, 65: [2, 70], 72: [2, 70], 75: [2, 70], 80: [2, 70], 81: [2, 70], 82: [2, 70], 83: [2, 70], 84: [2, 70], 85: [2, 70] }, { 47: [2, 18] }, { 5: [2, 14], 14: [2, 14], 15: [2, 14], 19: [2, 14], 29: [2, 14], 34: [2, 14], 39: [2, 14], 44: [2, 14], 47: [2, 14], 48: [2, 14], 51: [2, 14], 55: [2, 14], 60: [2, 14] }, { 33: [1, 114] }, { 33: [2, 87], 65: [2, 87], 72: [2, 87], 80: [2, 87], 81: [2, 87], 82: [2, 87], 83: [2, 87], 84: [2, 87],
          85: [2, 87] }, { 33: [2, 89] }, { 20: 75, 63: 116, 64: 76, 65: [1, 44], 67: 115, 68: [2, 96], 69: 117, 70: 77, 71: 78, 72: [1, 79], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 33: [1, 118] }, { 32: 119, 33: [2, 62], 74: 120, 75: [1, 121] }, { 33: [2, 59], 65: [2, 59], 72: [2, 59], 75: [2, 59], 80: [2, 59], 81: [2, 59], 82: [2, 59], 83: [2, 59], 84: [2, 59], 85: [2, 59] }, { 33: [2, 61], 75: [2, 61] }, { 33: [2, 68], 37: 122, 74: 123, 75: [1, 121] }, { 33: [2, 65], 65: [2, 65], 72: [2, 65], 75: [2, 65], 80: [2, 65], 81: [2, 65], 82: [2, 65], 83: [2, 65], 84: [2, 65], 85: [2, 65] }, { 33: [2, 67], 75: [2, 67] }, { 23: [1, 124] }, { 23: [2, 51], 65: [2, 51], 72: [2, 51], 80: [2, 51], 81: [2, 51], 82: [2, 51], 83: [2, 51], 84: [2, 51], 85: [2, 51] }, { 23: [2, 53] }, { 33: [1, 125] }, { 33: [2, 91], 65: [2, 91], 72: [2, 91], 80: [2, 91], 81: [2, 91], 82: [2, 91], 83: [2, 91], 84: [2, 91], 85: [2, 91] }, { 33: [2, 93] }, { 5: [2, 22], 14: [2, 22], 15: [2, 22], 19: [2, 22], 29: [2, 22], 34: [2, 22], 39: [2, 22], 44: [2, 22], 47: [2, 22], 48: [2, 22], 51: [2, 22], 55: [2, 22], 60: [2, 22] }, { 23: [2, 99], 33: [2, 99], 54: [2, 99], 68: [2, 99], 72: [2, 99], 75: [2, 99] }, { 73: [1, 109] }, { 20: 75, 63: 126, 64: 76, 65: [1, 44], 72: [1, 35], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 23], 14: [2, 23], 15: [2, 23], 19: [2, 23], 29: [2, 23], 34: [2, 23], 39: [2, 23], 44: [2, 23], 47: [2, 23], 48: [2, 23], 51: [2, 23], 55: [2, 23], 60: [2, 23] }, { 47: [2, 19] }, { 47: [2, 77] }, { 20: 75, 33: [2, 72], 41: 127, 63: 128, 64: 76, 65: [1, 44], 69: 129, 70: 77, 71: 78, 72: [1, 79], 75: [2, 72], 78: 26, 79: 27, 80: [1, 28], 81: [1, 29], 82: [1, 30], 83: [1, 31], 84: [1, 32], 85: [1, 34], 86: 33 }, { 5: [2, 24], 14: [2, 24], 15: [2, 24], 19: [2, 24], 29: [2, 24], 34: [2, 24], 39: [2, 24], 44: [2, 24], 47: [2, 24], 48: [2, 24], 51: [2, 24], 55: [2, 24], 60: [2, 24] }, { 68: [1, 130] }, { 65: [2, 95], 68: [2, 95], 72: [2, 95], 80: [2, 95], 81: [2, 95], 82: [2, 95], 83: [2, 95], 84: [2, 95], 85: [2, 95] }, { 68: [2, 97] }, { 5: [2, 21], 14: [2, 21], 15: [2, 21], 19: [2, 21], 29: [2, 21], 34: [2, 21], 39: [2, 21], 44: [2, 21], 47: [2, 21], 48: [2, 21], 51: [2, 21], 55: [2, 21], 60: [2, 21] }, { 33: [1, 131] }, { 33: [2, 63] }, { 72: [1, 133], 76: 132 }, { 33: [1, 134] }, { 33: [2, 69] }, { 15: [2, 12] }, { 14: [2, 26], 15: [2, 26], 19: [2, 26], 29: [2, 26], 34: [2, 26], 47: [2, 26], 48: [2, 26], 51: [2, 26], 55: [2, 26], 60: [2, 26] }, { 23: [2, 31], 33: [2, 31], 54: [2, 31], 68: [2, 31], 72: [2, 31], 75: [2, 31] }, { 33: [2, 74], 42: 135, 74: 136, 75: [1, 121] }, { 33: [2, 71], 65: [2, 71], 72: [2, 71], 75: [2, 71], 80: [2, 71], 81: [2, 71], 82: [2, 71], 83: [2, 71], 84: [2, 71], 85: [2, 71] }, { 33: [2, 73], 75: [2, 73] }, { 23: [2, 29], 33: [2, 29], 54: [2, 29], 65: [2, 29], 68: [2, 29], 72: [2, 29], 75: [2, 29], 80: [2, 29], 81: [2, 29], 82: [2, 29], 83: [2, 29], 84: [2, 29], 85: [2, 29] }, { 14: [2, 15], 15: [2, 15], 19: [2, 15], 29: [2, 15], 34: [2, 15], 39: [2, 15], 44: [2, 15], 47: [2, 15], 48: [2, 15], 51: [2, 15], 55: [2, 15], 60: [2, 15] }, { 72: [1, 138], 77: [1, 137] }, { 72: [2, 100], 77: [2, 100] }, { 14: [2, 16], 15: [2, 16], 19: [2, 16], 29: [2, 16], 34: [2, 16], 44: [2, 16], 47: [2, 16], 48: [2, 16], 51: [2, 16], 55: [2, 16], 60: [2, 16] }, { 33: [1, 139] }, { 33: [2, 75] }, { 33: [2, 32] }, { 72: [2, 101], 77: [2, 101] }, { 14: [2, 17], 15: [2, 17], 19: [2, 17], 29: [2, 17], 34: [2, 17], 39: [2, 17], 44: [2, 17], 47: [2, 17], 48: [2, 17], 51: [2, 17], 55: [2, 17], 60: [2, 17] }], defaultActions: { 4: [2, 1], 55: [2, 55], 57: [2, 20], 61: [2, 57], 74: [2, 81], 83: [2, 85], 87: [2, 18], 91: [2, 89], 102: [2, 53], 105: [2, 93], 111: [2, 19], 112: [2, 77], 117: [2, 97], 120: [2, 63], 123: [2, 69], 124: [2, 12], 136: [2, 75], 137: [2, 32] }, parseError: function parseError(a, b) {
          throw new Error(a);
        }, parse: function parse(a) {
          function b() {
            var a;return a = c.lexer.lex() || 1, "number" != typeof a && (a = c.symbols_[a] || a), a;
          }var c = this,
              d = [0],
              e = [null],
              f = [],
              g = this.table,
              h = "",
              i = 0,
              j = 0,
              k = 0;this.lexer.setInput(a), this.lexer.yy = this.yy, this.yy.lexer = this.lexer, this.yy.parser = this, "undefined" == typeof this.lexer.yylloc && (this.lexer.yylloc = {});var l = this.lexer.yylloc;f.push(l);var m = this.lexer.options && this.lexer.options.ranges;"function" == typeof this.yy.parseError && (this.parseError = this.yy.parseError);for (var n, o, p, q, r, s, t, u, v, w = {};;) {
            if (p = d[d.length - 1], this.defaultActions[p] ? q = this.defaultActions[p] : (null !== n && "undefined" != typeof n || (n = b()), q = g[p] && g[p][n]), "undefined" == typeof q || !q.length || !q[0]) {
              var x = "";if (!k) {
                v = [];for (s in g[p]) {
                  this.terminals_[s] && s > 2 && v.push("'" + this.terminals_[s] + "'");
                }x = this.lexer.showPosition ? "Parse error on line " + (i + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + v.join(", ") + ", got '" + (this.terminals_[n] || n) + "'" : "Parse error on line " + (i + 1) + ": Unexpected " + (1 == n ? "end of input" : "'" + (this.terminals_[n] || n) + "'"), this.parseError(x, { text: this.lexer.match, token: this.terminals_[n] || n, line: this.lexer.yylineno, loc: l, expected: v });
              }
            }if (q[0] instanceof Array && q.length > 1) throw new Error("Parse Error: multiple actions possible at state: " + p + ", token: " + n);switch (q[0]) {case 1:
                d.push(n), e.push(this.lexer.yytext), f.push(this.lexer.yylloc), d.push(q[1]), n = null, o ? (n = o, o = null) : (j = this.lexer.yyleng, h = this.lexer.yytext, i = this.lexer.yylineno, l = this.lexer.yylloc, k > 0 && k--);break;case 2:
                if (t = this.productions_[q[1]][1], w.$ = e[e.length - t], w._$ = { first_line: f[f.length - (t || 1)].first_line, last_line: f[f.length - 1].last_line, first_column: f[f.length - (t || 1)].first_column, last_column: f[f.length - 1].last_column }, m && (w._$.range = [f[f.length - (t || 1)].range[0], f[f.length - 1].range[1]]), r = this.performAction.call(w, h, j, i, this.yy, q[1], e, f), "undefined" != typeof r) return r;t && (d = d.slice(0, -1 * t * 2), e = e.slice(0, -1 * t), f = f.slice(0, -1 * t)), d.push(this.productions_[q[1]][0]), e.push(w.$), f.push(w._$), u = g[d[d.length - 2]][d[d.length - 1]], d.push(u);break;case 3:
                return !0;}
          }return !0;
        } },
          c = function () {
        var a = { EOF: 1, parseError: function parseError(a, b) {
            if (!this.yy.parser) throw new Error(a);this.yy.parser.parseError(a, b);
          }, setInput: function setInput(a) {
            return this._input = a, this._more = this._less = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = "", this.conditionStack = ["INITIAL"], this.yylloc = { first_line: 1, first_column: 0, last_line: 1, last_column: 0 }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this;
          }, input: function input() {
            var a = this._input[0];this.yytext += a, this.yyleng++, this.offset++, this.match += a, this.matched += a;var b = a.match(/(?:\r\n?|\n).*/g);return b ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), a;
          }, unput: function unput(a) {
            var b = a.length,
                c = a.split(/(?:\r\n?|\n)/g);this._input = a + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - b - 1), this.offset -= b;var d = this.match.split(/(?:\r\n?|\n)/g);this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), c.length - 1 && (this.yylineno -= c.length - 1);var e = this.yylloc.range;return this.yylloc = { first_line: this.yylloc.first_line, last_line: this.yylineno + 1, first_column: this.yylloc.first_column, last_column: c ? (c.length === d.length ? this.yylloc.first_column : 0) + d[d.length - c.length].length - c[0].length : this.yylloc.first_column - b }, this.options.ranges && (this.yylloc.range = [e[0], e[0] + this.yyleng - b]), this;
          }, more: function more() {
            return this._more = !0, this;
          }, less: function less(a) {
            this.unput(this.match.slice(a));
          }, pastInput: function pastInput() {
            var a = this.matched.substr(0, this.matched.length - this.match.length);return (a.length > 20 ? "..." : "") + a.substr(-20).replace(/\n/g, "");
          }, upcomingInput: function upcomingInput() {
            var a = this.match;return a.length < 20 && (a += this._input.substr(0, 20 - a.length)), (a.substr(0, 20) + (a.length > 20 ? "..." : "")).replace(/\n/g, "");
          }, showPosition: function showPosition() {
            var a = this.pastInput(),
                b = new Array(a.length + 1).join("-");return a + this.upcomingInput() + "\n" + b + "^";
          }, next: function next() {
            if (this.done) return this.EOF;this._input || (this.done = !0);var a, b, c, d, e;this._more || (this.yytext = "", this.match = "");for (var f = this._currentRules(), g = 0; g < f.length && (c = this._input.match(this.rules[f[g]]), !c || b && !(c[0].length > b[0].length) || (b = c, d = g, this.options.flex)); g++) {}return b ? (e = b[0].match(/(?:\r\n?|\n).*/g), e && (this.yylineno += e.length), this.yylloc = { first_line: this.yylloc.last_line, last_line: this.yylineno + 1, first_column: this.yylloc.last_column, last_column: e ? e[e.length - 1].length - e[e.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + b[0].length }, this.yytext += b[0], this.match += b[0], this.matches = b, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._input = this._input.slice(b[0].length), this.matched += b[0], a = this.performAction.call(this, this.yy, this, f[d], this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), a ? a : void 0) : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), { text: "", token: null, line: this.yylineno });
          }, lex: function lex() {
            var a = this.next();return "undefined" != typeof a ? a : this.lex();
          }, begin: function begin(a) {
            this.conditionStack.push(a);
          }, popState: function popState() {
            return this.conditionStack.pop();
          }, _currentRules: function _currentRules() {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
          }, topState: function topState() {
            return this.conditionStack[this.conditionStack.length - 2];
          }, pushState: function pushState(a) {
            this.begin(a);
          } };return a.options = {}, a.performAction = function (a, b, c, d) {
          function e(a, c) {
            return b.yytext = b.yytext.substr(a, b.yyleng - c);
          }switch (c) {case 0:
              if ("\\\\" === b.yytext.slice(-2) ? (e(0, 1), this.begin("mu")) : "\\" === b.yytext.slice(-1) ? (e(0, 1), this.begin("emu")) : this.begin("mu"), b.yytext) return 15;break;case 1:
              return 15;case 2:
              return this.popState(), 15;case 3:
              return this.begin("raw"), 15;case 4:
              return this.popState(), "raw" === this.conditionStack[this.conditionStack.length - 1] ? 15 : (b.yytext = b.yytext.substr(5, b.yyleng - 9), "END_RAW_BLOCK");case 5:
              return 15;case 6:
              return this.popState(), 14;case 7:
              return 65;case 8:
              return 68;case 9:
              return 19;case 10:
              return this.popState(), this.begin("raw"), 23;case 11:
              return 55;case 12:
              return 60;case 13:
              return 29;case 14:
              return 47;case 15:
              return this.popState(), 44;case 16:
              return this.popState(), 44;case 17:
              return 34;case 18:
              return 39;case 19:
              return 51;case 20:
              return 48;case 21:
              this.unput(b.yytext), this.popState(), this.begin("com");break;case 22:
              return this.popState(), 14;case 23:
              return 48;case 24:
              return 73;case 25:
              return 72;case 26:
              return 72;case 27:
              return 87;case 28:
              break;case 29:
              return this.popState(), 54;case 30:
              return this.popState(), 33;case 31:
              return b.yytext = e(1, 2).replace(/\\"/g, '"'), 80;case 32:
              return b.yytext = e(1, 2).replace(/\\'/g, "'"), 80;case 33:
              return 85;case 34:
              return 82;case 35:
              return 82;case 36:
              return 83;case 37:
              return 84;case 38:
              return 81;case 39:
              return 75;case 40:
              return 77;case 41:
              return 72;case 42:
              return b.yytext = b.yytext.replace(/\\([\\\]])/g, "$1"), 72;case 43:
              return "INVALID";case 44:
              return 5;}
        }, a.rules = [/^(?:[^\x00]*?(?=(\{\{)))/, /^(?:[^\x00]+)/, /^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/, /^(?:\{\{\{\{(?=[^\/]))/, /^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/, /^(?:[^\x00]*?(?=(\{\{\{\{)))/, /^(?:[\s\S]*?--(~)?\}\})/, /^(?:\()/, /^(?:\))/, /^(?:\{\{\{\{)/, /^(?:\}\}\}\})/, /^(?:\{\{(~)?>)/, /^(?:\{\{(~)?#>)/, /^(?:\{\{(~)?#\*?)/, /^(?:\{\{(~)?\/)/, /^(?:\{\{(~)?\^\s*(~)?\}\})/, /^(?:\{\{(~)?\s*else\s*(~)?\}\})/, /^(?:\{\{(~)?\^)/, /^(?:\{\{(~)?\s*else\b)/, /^(?:\{\{(~)?\{)/, /^(?:\{\{(~)?&)/, /^(?:\{\{(~)?!--)/, /^(?:\{\{(~)?![\s\S]*?\}\})/, /^(?:\{\{(~)?\*?)/, /^(?:=)/, /^(?:\.\.)/, /^(?:\.(?=([=~}\s\/.)|])))/, /^(?:[\/.])/, /^(?:\s+)/, /^(?:\}(~)?\}\})/, /^(?:(~)?\}\})/, /^(?:"(\\["]|[^"])*")/, /^(?:'(\\[']|[^'])*')/, /^(?:@)/, /^(?:true(?=([~}\s)])))/, /^(?:false(?=([~}\s)])))/, /^(?:undefined(?=([~}\s)])))/, /^(?:null(?=([~}\s)])))/, /^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/, /^(?:as\s+\|)/, /^(?:\|)/, /^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/, /^(?:\[(\\\]|[^\]])*\])/, /^(?:.)/, /^(?:$)/], a.conditions = { mu: { rules: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44], inclusive: !1 }, emu: { rules: [2], inclusive: !1 }, com: { rules: [6], inclusive: !1 }, raw: { rules: [3, 4, 5], inclusive: !1 }, INITIAL: { rules: [0, 1, 44], inclusive: !0 } }, a;
      }();return b.lexer = c, a.prototype = b, b.Parser = a, new a();
    }();b["default"] = c, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    function d() {
      var a = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0];this.options = a;
    }function e(a, b, c) {
      void 0 === b && (b = a.length);var d = a[b - 1],
          e = a[b - 2];return d ? "ContentStatement" === d.type ? (e || !c ? /\r?\n\s*?$/ : /(^|\r?\n)\s*?$/).test(d.original) : void 0 : c;
    }function f(a, b, c) {
      void 0 === b && (b = -1);var d = a[b + 1],
          e = a[b + 2];return d ? "ContentStatement" === d.type ? (e || !c ? /^\s*?\r?\n/ : /^\s*?(\r?\n|$)/).test(d.original) : void 0 : c;
    }function g(a, b, c) {
      var d = a[null == b ? 0 : b + 1];if (d && "ContentStatement" === d.type && (c || !d.rightStripped)) {
        var e = d.value;d.value = d.value.replace(c ? /^\s+/ : /^[ \t]*\r?\n?/, ""), d.rightStripped = d.value !== e;
      }
    }function h(a, b, c) {
      var d = a[null == b ? a.length - 1 : b - 1];if (d && "ContentStatement" === d.type && (c || !d.leftStripped)) {
        var e = d.value;return d.value = d.value.replace(c ? /\s+$/ : /[ \t]+$/, ""), d.leftStripped = d.value !== e, d.leftStripped;
      }
    }var i = c(1)["default"];b.__esModule = !0;var j = c(39),
        k = i(j);d.prototype = new k["default"](), d.prototype.Program = function (a) {
      var b = !this.options.ignoreStandalone,
          c = !this.isRootSeen;this.isRootSeen = !0;for (var d = a.body, i = 0, j = d.length; i < j; i++) {
        var k = d[i],
            l = this.accept(k);if (l) {
          var m = e(d, i, c),
              n = f(d, i, c),
              o = l.openStandalone && m,
              p = l.closeStandalone && n,
              q = l.inlineStandalone && m && n;l.close && g(d, i, !0), l.open && h(d, i, !0), b && q && (g(d, i), h(d, i) && "PartialStatement" === k.type && (k.indent = /([ \t]+$)/.exec(d[i - 1].original)[1])), b && o && (g((k.program || k.inverse).body), h(d, i)), b && p && (g(d, i), h((k.inverse || k.program).body));
        }
      }return a;
    }, d.prototype.BlockStatement = d.prototype.DecoratorBlock = d.prototype.PartialBlockStatement = function (a) {
      this.accept(a.program), this.accept(a.inverse);var b = a.program || a.inverse,
          c = a.program && a.inverse,
          d = c,
          i = c;if (c && c.chained) for (d = c.body[0].program; i.chained;) {
        i = i.body[i.body.length - 1].program;
      }var j = { open: a.openStrip.open, close: a.closeStrip.close, openStandalone: f(b.body), closeStandalone: e((d || b).body) };if (a.openStrip.close && g(b.body, null, !0), c) {
        var k = a.inverseStrip;k.open && h(b.body, null, !0), k.close && g(d.body, null, !0), a.closeStrip.open && h(i.body, null, !0), !this.options.ignoreStandalone && e(b.body) && f(d.body) && (h(b.body), g(d.body));
      } else a.closeStrip.open && h(b.body, null, !0);return j;
    }, d.prototype.Decorator = d.prototype.MustacheStatement = function (a) {
      return a.strip;
    }, d.prototype.PartialStatement = d.prototype.CommentStatement = function (a) {
      var b = a.strip || {};return { inlineStandalone: !0, open: b.open, close: b.close };
    }, b["default"] = d, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    function d() {
      this.parents = [];
    }function e(a) {
      this.acceptRequired(a, "path"), this.acceptArray(a.params), this.acceptKey(a, "hash");
    }function f(a) {
      e.call(this, a), this.acceptKey(a, "program"), this.acceptKey(a, "inverse");
    }function g(a) {
      this.acceptRequired(a, "name"), this.acceptArray(a.params), this.acceptKey(a, "hash");
    }var h = c(1)["default"];b.__esModule = !0;var i = c(6),
        j = h(i);d.prototype = { constructor: d, mutating: !1, acceptKey: function acceptKey(a, b) {
        var c = this.accept(a[b]);if (this.mutating) {
          if (c && !d.prototype[c.type]) throw new j["default"]('Unexpected node type "' + c.type + '" found when accepting ' + b + " on " + a.type);a[b] = c;
        }
      }, acceptRequired: function acceptRequired(a, b) {
        if (this.acceptKey(a, b), !a[b]) throw new j["default"](a.type + " requires " + b);
      }, acceptArray: function acceptArray(a) {
        for (var b = 0, c = a.length; b < c; b++) {
          this.acceptKey(a, b), a[b] || (a.splice(b, 1), b--, c--);
        }
      }, accept: function accept(a) {
        if (a) {
          if (!this[a.type]) throw new j["default"]("Unknown type: " + a.type, a);this.current && this.parents.unshift(this.current), this.current = a;var b = this[a.type](a);return this.current = this.parents.shift(), !this.mutating || b ? b : b !== !1 ? a : void 0;
        }
      }, Program: function Program(a) {
        this.acceptArray(a.body);
      }, MustacheStatement: e, Decorator: e, BlockStatement: f, DecoratorBlock: f, PartialStatement: g, PartialBlockStatement: function PartialBlockStatement(a) {
        g.call(this, a), this.acceptKey(a, "program");
      }, ContentStatement: function ContentStatement() {}, CommentStatement: function CommentStatement() {}, SubExpression: e, PathExpression: function PathExpression() {}, StringLiteral: function StringLiteral() {}, NumberLiteral: function NumberLiteral() {}, BooleanLiteral: function BooleanLiteral() {}, UndefinedLiteral: function UndefinedLiteral() {}, NullLiteral: function NullLiteral() {}, Hash: function Hash(a) {
        this.acceptArray(a.pairs);
      }, HashPair: function HashPair(a) {
        this.acceptRequired(a, "value");
      } }, b["default"] = d, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    function d(a, b) {
      if (b = b.path ? b.path.original : b, a.path.original !== b) {
        var c = { loc: a.path.loc };throw new q["default"](a.path.original + " doesn't match " + b, c);
      }
    }function e(a, b) {
      this.source = a, this.start = { line: b.first_line, column: b.first_column }, this.end = { line: b.last_line, column: b.last_column };
    }function f(a) {
      return (/^\[.*\]$/.test(a) ? a.substr(1, a.length - 2) : a
      );
    }function g(a, b) {
      return { open: "~" === a.charAt(2), close: "~" === b.charAt(b.length - 3) };
    }function h(a) {
      return a.replace(/^\{\{~?\!-?-?/, "").replace(/-?-?~?\}\}$/, "");
    }function i(a, b, c) {
      c = this.locInfo(c);for (var d = a ? "@" : "", e = [], f = 0, g = "", h = 0, i = b.length; h < i; h++) {
        var j = b[h].part,
            k = b[h].original !== j;if (d += (b[h].separator || "") + j, k || ".." !== j && "." !== j && "this" !== j) e.push(j);else {
          if (e.length > 0) throw new q["default"]("Invalid path: " + d, { loc: c });".." === j && (f++, g += "../");
        }
      }return { type: "PathExpression", data: a, depth: f, parts: e, original: d, loc: c };
    }function j(a, b, c, d, e, f) {
      var g = d.charAt(3) || d.charAt(2),
          h = "{" !== g && "&" !== g,
          i = /\*/.test(d);return { type: i ? "Decorator" : "MustacheStatement", path: a, params: b, hash: c, escaped: h, strip: e, loc: this.locInfo(f) };
    }function k(a, b, c, e) {
      d(a, c), e = this.locInfo(e);var f = { type: "Program", body: b, strip: {}, loc: e };return { type: "BlockStatement", path: a.path, params: a.params, hash: a.hash, program: f, openStrip: {}, inverseStrip: {}, closeStrip: {}, loc: e };
    }function l(a, b, c, e, f, g) {
      e && e.path && d(a, e);var h = /\*/.test(a.open);b.blockParams = a.blockParams;var i = void 0,
          j = void 0;if (c) {
        if (h) throw new q["default"]("Unexpected inverse block on decorator", c);c.chain && (c.program.body[0].closeStrip = e.strip), j = c.strip, i = c.program;
      }return f && (f = i, i = b, b = f), { type: h ? "DecoratorBlock" : "BlockStatement", path: a.path, params: a.params, hash: a.hash, program: b, inverse: i, openStrip: a.strip, inverseStrip: j, closeStrip: e && e.strip, loc: this.locInfo(g) };
    }function m(a, b) {
      if (!b && a.length) {
        var c = a[0].loc,
            d = a[a.length - 1].loc;c && d && (b = { source: c.source, start: { line: c.start.line, column: c.start.column }, end: { line: d.end.line, column: d.end.column } });
      }return { type: "Program", body: a, strip: {}, loc: b };
    }function n(a, b, c, e) {
      return d(a, c), { type: "PartialBlockStatement", name: a.path, params: a.params, hash: a.hash, program: b, openStrip: a.strip, closeStrip: c && c.strip, loc: this.locInfo(e) };
    }var o = c(1)["default"];b.__esModule = !0, b.SourceLocation = e, b.id = f, b.stripFlags = g, b.stripComment = h, b.preparePath = i, b.prepareMustache = j, b.prepareRawBlock = k, b.prepareBlock = l, b.prepareProgram = m, b.preparePartialBlock = n;var p = c(6),
        q = o(p);
  }, function (a, b, c) {
    "use strict";
    function d() {}function e(a, b, c) {
      if (null == a || "string" != typeof a && "Program" !== a.type) throw new k["default"]("You must pass a string or Handlebars AST to Handlebars.precompile. You passed " + a);b = b || {}, "data" in b || (b.data = !0), b.compat && (b.useDepths = !0);var d = c.parse(a, b),
          e = new c.Compiler().compile(d, b);return new c.JavaScriptCompiler().compile(e, b);
    }function f(a, b, c) {
      function d() {
        var d = c.parse(a, b),
            e = new c.Compiler().compile(d, b),
            f = new c.JavaScriptCompiler().compile(e, b, void 0, !0);return c.template(f);
      }function e(a, b) {
        return f || (f = d()), f.call(this, a, b);
      }if (void 0 === b && (b = {}), null == a || "string" != typeof a && "Program" !== a.type) throw new k["default"]("You must pass a string or Handlebars AST to Handlebars.compile. You passed " + a);b = l.extend({}, b), "data" in b || (b.data = !0), b.compat && (b.useDepths = !0);var f = void 0;return e._setup = function (a) {
        return f || (f = d()), f._setup(a);
      }, e._child = function (a, b, c, e) {
        return f || (f = d()), f._child(a, b, c, e);
      }, e;
    }function g(a, b) {
      if (a === b) return !0;if (l.isArray(a) && l.isArray(b) && a.length === b.length) {
        for (var c = 0; c < a.length; c++) {
          if (!g(a[c], b[c])) return !1;
        }return !0;
      }
    }function h(a) {
      if (!a.path.parts) {
        var b = a.path;a.path = { type: "PathExpression", data: !1, depth: 0, parts: [b.original + ""], original: b.original + "", loc: b.loc };
      }
    }var i = c(1)["default"];b.__esModule = !0, b.Compiler = d, b.precompile = e, b.compile = f;var j = c(6),
        k = i(j),
        l = c(5),
        m = c(35),
        n = i(m),
        o = [].slice;d.prototype = { compiler: d, equals: function equals(a) {
        var b = this.opcodes.length;if (a.opcodes.length !== b) return !1;for (var c = 0; c < b; c++) {
          var d = this.opcodes[c],
              e = a.opcodes[c];if (d.opcode !== e.opcode || !g(d.args, e.args)) return !1;
        }b = this.children.length;for (var c = 0; c < b; c++) {
          if (!this.children[c].equals(a.children[c])) return !1;
        }return !0;
      }, guid: 0, compile: function compile(a, b) {
        this.sourceNode = [], this.opcodes = [], this.children = [], this.options = b, this.stringParams = b.stringParams, this.trackIds = b.trackIds, b.blockParams = b.blockParams || [];var c = b.knownHelpers;if (b.knownHelpers = { helperMissing: !0, blockHelperMissing: !0, each: !0, "if": !0, unless: !0, "with": !0, log: !0, lookup: !0 }, c) for (var d in c) {
          d in c && (this.options.knownHelpers[d] = c[d]);
        }return this.accept(a);
      }, compileProgram: function compileProgram(a) {
        var b = new this.compiler(),
            c = b.compile(a, this.options),
            d = this.guid++;return this.usePartial = this.usePartial || c.usePartial, this.children[d] = c, this.useDepths = this.useDepths || c.useDepths, d;
      }, accept: function accept(a) {
        if (!this[a.type]) throw new k["default"]("Unknown type: " + a.type, a);this.sourceNode.unshift(a);var b = this[a.type](a);return this.sourceNode.shift(), b;
      }, Program: function Program(a) {
        this.options.blockParams.unshift(a.blockParams);for (var b = a.body, c = b.length, d = 0; d < c; d++) {
          this.accept(b[d]);
        }return this.options.blockParams.shift(), this.isSimple = 1 === c, this.blockParams = a.blockParams ? a.blockParams.length : 0, this;
      }, BlockStatement: function BlockStatement(a) {
        h(a);var b = a.program,
            c = a.inverse;b = b && this.compileProgram(b), c = c && this.compileProgram(c);var d = this.classifySexpr(a);"helper" === d ? this.helperSexpr(a, b, c) : "simple" === d ? (this.simpleSexpr(a), this.opcode("pushProgram", b), this.opcode("pushProgram", c), this.opcode("emptyHash"), this.opcode("blockValue", a.path.original)) : (this.ambiguousSexpr(a, b, c), this.opcode("pushProgram", b), this.opcode("pushProgram", c), this.opcode("emptyHash"), this.opcode("ambiguousBlockValue")), this.opcode("append");
      }, DecoratorBlock: function DecoratorBlock(a) {
        var b = a.program && this.compileProgram(a.program),
            c = this.setupFullMustacheParams(a, b, void 0),
            d = a.path;this.useDecorators = !0, this.opcode("registerDecorator", c.length, d.original);
      }, PartialStatement: function PartialStatement(a) {
        this.usePartial = !0;var b = a.program;b && (b = this.compileProgram(a.program));var c = a.params;if (c.length > 1) throw new k["default"]("Unsupported number of partial arguments: " + c.length, a);c.length || (this.options.explicitPartialContext ? this.opcode("pushLiteral", "undefined") : c.push({ type: "PathExpression", parts: [], depth: 0 }));var d = a.name.original,
            e = "SubExpression" === a.name.type;e && this.accept(a.name), this.setupFullMustacheParams(a, b, void 0, !0);var f = a.indent || "";this.options.preventIndent && f && (this.opcode("appendContent", f), f = ""), this.opcode("invokePartial", e, d, f), this.opcode("append");
      }, PartialBlockStatement: function PartialBlockStatement(a) {
        this.PartialStatement(a);
      }, MustacheStatement: function MustacheStatement(a) {
        this.SubExpression(a), a.escaped && !this.options.noEscape ? this.opcode("appendEscaped") : this.opcode("append");
      }, Decorator: function Decorator(a) {
        this.DecoratorBlock(a);
      }, ContentStatement: function ContentStatement(a) {
        a.value && this.opcode("appendContent", a.value);
      }, CommentStatement: function CommentStatement() {}, SubExpression: function SubExpression(a) {
        h(a);var b = this.classifySexpr(a);"simple" === b ? this.simpleSexpr(a) : "helper" === b ? this.helperSexpr(a) : this.ambiguousSexpr(a);
      }, ambiguousSexpr: function ambiguousSexpr(a, b, c) {
        var d = a.path,
            e = d.parts[0],
            f = null != b || null != c;this.opcode("getContext", d.depth), this.opcode("pushProgram", b), this.opcode("pushProgram", c), d.strict = !0, this.accept(d), this.opcode("invokeAmbiguous", e, f);
      }, simpleSexpr: function simpleSexpr(a) {
        var b = a.path;b.strict = !0, this.accept(b), this.opcode("resolvePossibleLambda");
      }, helperSexpr: function helperSexpr(a, b, c) {
        var d = this.setupFullMustacheParams(a, b, c),
            e = a.path,
            f = e.parts[0];if (this.options.knownHelpers[f]) this.opcode("invokeKnownHelper", d.length, f);else {
          if (this.options.knownHelpersOnly) throw new k["default"]("You specified knownHelpersOnly, but used the unknown helper " + f, a);e.strict = !0, e.falsy = !0, this.accept(e), this.opcode("invokeHelper", d.length, e.original, n["default"].helpers.simpleId(e));
        }
      }, PathExpression: function PathExpression(a) {
        this.addDepth(a.depth), this.opcode("getContext", a.depth);var b = a.parts[0],
            c = n["default"].helpers.scopedId(a),
            d = !a.depth && !c && this.blockParamIndex(b);d ? this.opcode("lookupBlockParam", d, a.parts) : b ? a.data ? (this.options.data = !0, this.opcode("lookupData", a.depth, a.parts, a.strict)) : this.opcode("lookupOnContext", a.parts, a.falsy, a.strict, c) : this.opcode("pushContext");
      }, StringLiteral: function StringLiteral(a) {
        this.opcode("pushString", a.value);
      }, NumberLiteral: function NumberLiteral(a) {
        this.opcode("pushLiteral", a.value);
      }, BooleanLiteral: function BooleanLiteral(a) {
        this.opcode("pushLiteral", a.value);
      }, UndefinedLiteral: function UndefinedLiteral() {
        this.opcode("pushLiteral", "undefined");
      }, NullLiteral: function NullLiteral() {
        this.opcode("pushLiteral", "null");
      }, Hash: function Hash(a) {
        var b = a.pairs,
            c = 0,
            d = b.length;for (this.opcode("pushHash"); c < d; c++) {
          this.pushParam(b[c].value);
        }for (; c--;) {
          this.opcode("assignToHash", b[c].key);
        }this.opcode("popHash");
      }, opcode: function opcode(a) {
        this.opcodes.push({ opcode: a, args: o.call(arguments, 1), loc: this.sourceNode[0].loc });
      }, addDepth: function addDepth(a) {
        a && (this.useDepths = !0);
      }, classifySexpr: function classifySexpr(a) {
        var b = n["default"].helpers.simpleId(a.path),
            c = b && !!this.blockParamIndex(a.path.parts[0]),
            d = !c && n["default"].helpers.helperExpression(a),
            e = !c && (d || b);if (e && !d) {
          var f = a.path.parts[0],
              g = this.options;g.knownHelpers[f] ? d = !0 : g.knownHelpersOnly && (e = !1);
        }return d ? "helper" : e ? "ambiguous" : "simple";
      }, pushParams: function pushParams(a) {
        for (var b = 0, c = a.length; b < c; b++) {
          this.pushParam(a[b]);
        }
      }, pushParam: function pushParam(a) {
        var b = null != a.value ? a.value : a.original || "";if (this.stringParams) b.replace && (b = b.replace(/^(\.?\.\/)*/g, "").replace(/\//g, ".")), a.depth && this.addDepth(a.depth), this.opcode("getContext", a.depth || 0), this.opcode("pushStringParam", b, a.type), "SubExpression" === a.type && this.accept(a);else {
          if (this.trackIds) {
            var c = void 0;if (!a.parts || n["default"].helpers.scopedId(a) || a.depth || (c = this.blockParamIndex(a.parts[0])), c) {
              var d = a.parts.slice(1).join(".");this.opcode("pushId", "BlockParam", c, d);
            } else b = a.original || b, b.replace && (b = b.replace(/^this(?:\.|$)/, "").replace(/^\.\//, "").replace(/^\.$/, "")), this.opcode("pushId", a.type, b);
          }this.accept(a);
        }
      }, setupFullMustacheParams: function setupFullMustacheParams(a, b, c, d) {
        var e = a.params;return this.pushParams(e), this.opcode("pushProgram", b), this.opcode("pushProgram", c), a.hash ? this.accept(a.hash) : this.opcode("emptyHash", d), e;
      }, blockParamIndex: function blockParamIndex(a) {
        for (var b = 0, c = this.options.blockParams.length; b < c; b++) {
          var d = this.options.blockParams[b],
              e = d && l.indexOf(d, a);if (d && e >= 0) return [b, e];
        }
      } };
  }, function (a, b, c) {
    "use strict";
    function d(a) {
      this.value = a;
    }function e() {}function f(a, b, c, d) {
      var e = b.popStack(),
          f = 0,
          g = c.length;for (a && g--; f < g; f++) {
        e = b.nameLookup(e, c[f], d);
      }return a ? [b.aliasable("container.strict"), "(", e, ", ", b.quotedString(c[f]), ")"] : e;
    }var g = c(1)["default"];b.__esModule = !0;var h = c(4),
        i = c(6),
        j = g(i),
        k = c(5),
        l = c(43),
        m = g(l);e.prototype = { nameLookup: function nameLookup(a, b) {
        return e.isValidJavaScriptVariableName(b) ? [a, ".", b] : [a, "[", JSON.stringify(b), "]"];
      }, depthedLookup: function depthedLookup(a) {
        return [this.aliasable("container.lookup"), '(depths, "', a, '")'];
      }, compilerInfo: function compilerInfo() {
        var a = h.COMPILER_REVISION,
            b = h.REVISION_CHANGES[a];return [a, b];
      }, appendToBuffer: function appendToBuffer(a, b, c) {
        return k.isArray(a) || (a = [a]), a = this.source.wrap(a, b), this.environment.isSimple ? ["return ", a, ";"] : c ? ["buffer += ", a, ";"] : (a.appendToBuffer = !0, a);
      }, initializeBuffer: function initializeBuffer() {
        return this.quotedString("");
      }, compile: function compile(a, b, c, d) {
        this.environment = a, this.options = b, this.stringParams = this.options.stringParams, this.trackIds = this.options.trackIds, this.precompile = !d, this.name = this.environment.name, this.isChild = !!c, this.context = c || { decorators: [], programs: [], environments: [] }, this.preamble(), this.stackSlot = 0, this.stackVars = [], this.aliases = {}, this.registers = { list: [] }, this.hashes = [], this.compileStack = [], this.inlineStack = [], this.blockParams = [], this.compileChildren(a, b), this.useDepths = this.useDepths || a.useDepths || a.useDecorators || this.options.compat, this.useBlockParams = this.useBlockParams || a.useBlockParams;var e = a.opcodes,
            f = void 0,
            g = void 0,
            h = void 0,
            i = void 0;for (h = 0, i = e.length; h < i; h++) {
          f = e[h], this.source.currentLocation = f.loc, g = g || f.loc, this[f.opcode].apply(this, f.args);
        }if (this.source.currentLocation = g, this.pushSource(""), this.stackSlot || this.inlineStack.length || this.compileStack.length) throw new j["default"]("Compile completed with content left on stack");this.decorators.isEmpty() ? this.decorators = void 0 : (this.useDecorators = !0, this.decorators.prepend("var decorators = container.decorators;\n"), this.decorators.push("return fn;"), d ? this.decorators = Function.apply(this, ["fn", "props", "container", "depth0", "data", "blockParams", "depths", this.decorators.merge()]) : (this.decorators.prepend("function(fn, props, container, depth0, data, blockParams, depths) {\n"), this.decorators.push("}\n"), this.decorators = this.decorators.merge()));var k = this.createFunctionContext(d);if (this.isChild) return k;var l = { compiler: this.compilerInfo(), main: k };this.decorators && (l.main_d = this.decorators, l.useDecorators = !0);var m = this.context,
            n = m.programs,
            o = m.decorators;for (h = 0, i = n.length; h < i; h++) {
          n[h] && (l[h] = n[h], o[h] && (l[h + "_d"] = o[h], l.useDecorators = !0));
        }return this.environment.usePartial && (l.usePartial = !0), this.options.data && (l.useData = !0), this.useDepths && (l.useDepths = !0), this.useBlockParams && (l.useBlockParams = !0), this.options.compat && (l.compat = !0), d ? l.compilerOptions = this.options : (l.compiler = JSON.stringify(l.compiler), this.source.currentLocation = { start: { line: 1, column: 0 } }, l = this.objectLiteral(l), b.srcName ? (l = l.toStringWithSourceMap({ file: b.destName }), l.map = l.map && l.map.toString()) : l = l.toString()), l;
      }, preamble: function preamble() {
        this.lastContext = 0, this.source = new m["default"](this.options.srcName), this.decorators = new m["default"](this.options.srcName);
      }, createFunctionContext: function createFunctionContext(a) {
        var b = "",
            c = this.stackVars.concat(this.registers.list);c.length > 0 && (b += ", " + c.join(", "));var d = 0;for (var e in this.aliases) {
          var f = this.aliases[e];this.aliases.hasOwnProperty(e) && f.children && f.referenceCount > 1 && (b += ", alias" + ++d + "=" + e, f.children[0] = "alias" + d);
        }var g = ["container", "depth0", "helpers", "partials", "data"];(this.useBlockParams || this.useDepths) && g.push("blockParams"), this.useDepths && g.push("depths");var h = this.mergeSource(b);return a ? (g.push(h), Function.apply(this, g)) : this.source.wrap(["function(", g.join(","), ") {\n  ", h, "}"]);
      }, mergeSource: function mergeSource(a) {
        var b = this.environment.isSimple,
            c = !this.forceBuffer,
            d = void 0,
            e = void 0,
            f = void 0,
            g = void 0;return this.source.each(function (a) {
          a.appendToBuffer ? (f ? a.prepend("  + ") : f = a, g = a) : (f && (e ? f.prepend("buffer += ") : d = !0, g.add(";"), f = g = void 0), e = !0, b || (c = !1));
        }), c ? f ? (f.prepend("return "), g.add(";")) : e || this.source.push('return "";') : (a += ", buffer = " + (d ? "" : this.initializeBuffer()), f ? (f.prepend("return buffer + "), g.add(";")) : this.source.push("return buffer;")), a && this.source.prepend("var " + a.substring(2) + (d ? "" : ";\n")), this.source.merge();
      }, blockValue: function blockValue(a) {
        var b = this.aliasable("helpers.blockHelperMissing"),
            c = [this.contextName(0)];this.setupHelperArgs(a, 0, c);var d = this.popStack();c.splice(1, 0, d), this.push(this.source.functionCall(b, "call", c));
      }, ambiguousBlockValue: function ambiguousBlockValue() {
        var a = this.aliasable("helpers.blockHelperMissing"),
            b = [this.contextName(0)];this.setupHelperArgs("", 0, b, !0), this.flushInline();var c = this.topStack();b.splice(1, 0, c), this.pushSource(["if (!", this.lastHelper, ") { ", c, " = ", this.source.functionCall(a, "call", b), "}"]);
      }, appendContent: function appendContent(a) {
        this.pendingContent ? a = this.pendingContent + a : this.pendingLocation = this.source.currentLocation, this.pendingContent = a;
      }, append: function append() {
        if (this.isInline()) this.replaceStack(function (a) {
          return [" != null ? ", a, ' : ""'];
        }), this.pushSource(this.appendToBuffer(this.popStack()));else {
          var a = this.popStack();this.pushSource(["if (", a, " != null) { ", this.appendToBuffer(a, void 0, !0), " }"]), this.environment.isSimple && this.pushSource(["else { ", this.appendToBuffer("''", void 0, !0), " }"]);
        }
      }, appendEscaped: function appendEscaped() {
        this.pushSource(this.appendToBuffer([this.aliasable("container.escapeExpression"), "(", this.popStack(), ")"]));
      }, getContext: function getContext(a) {
        this.lastContext = a;
      }, pushContext: function pushContext() {
        this.pushStackLiteral(this.contextName(this.lastContext));
      }, lookupOnContext: function lookupOnContext(a, b, c, d) {
        var e = 0;d || !this.options.compat || this.lastContext ? this.pushContext() : this.push(this.depthedLookup(a[e++])), this.resolvePath("context", a, e, b, c);
      }, lookupBlockParam: function lookupBlockParam(a, b) {
        this.useBlockParams = !0, this.push(["blockParams[", a[0], "][", a[1], "]"]), this.resolvePath("context", b, 1);
      }, lookupData: function lookupData(a, b, c) {
        a ? this.pushStackLiteral("container.data(data, " + a + ")") : this.pushStackLiteral("data"), this.resolvePath("data", b, 0, !0, c);
      }, resolvePath: function resolvePath(a, b, c, d, e) {
        var g = this;if (this.options.strict || this.options.assumeObjects) return void this.push(f(this.options.strict && e, this, b, a));for (var h = b.length; c < h; c++) {
          this.replaceStack(function (e) {
            var f = g.nameLookup(e, b[c], a);return d ? [" && ", f] : [" != null ? ", f, " : ", e];
          });
        }
      }, resolvePossibleLambda: function resolvePossibleLambda() {
        this.push([this.aliasable("container.lambda"), "(", this.popStack(), ", ", this.contextName(0), ")"]);
      }, pushStringParam: function pushStringParam(a, b) {
        this.pushContext(), this.pushString(b), "SubExpression" !== b && ("string" == typeof a ? this.pushString(a) : this.pushStackLiteral(a));
      }, emptyHash: function emptyHash(a) {
        this.trackIds && this.push("{}"), this.stringParams && (this.push("{}"), this.push("{}")), this.pushStackLiteral(a ? "undefined" : "{}");
      }, pushHash: function pushHash() {
        this.hash && this.hashes.push(this.hash), this.hash = { values: [], types: [], contexts: [], ids: [] };
      }, popHash: function popHash() {
        var a = this.hash;this.hash = this.hashes.pop(), this.trackIds && this.push(this.objectLiteral(a.ids)), this.stringParams && (this.push(this.objectLiteral(a.contexts)), this.push(this.objectLiteral(a.types))), this.push(this.objectLiteral(a.values));
      }, pushString: function pushString(a) {
        this.pushStackLiteral(this.quotedString(a));
      }, pushLiteral: function pushLiteral(a) {
        this.pushStackLiteral(a);
      }, pushProgram: function pushProgram(a) {
        null != a ? this.pushStackLiteral(this.programExpression(a)) : this.pushStackLiteral(null);
      }, registerDecorator: function registerDecorator(a, b) {
        var c = this.nameLookup("decorators", b, "decorator"),
            d = this.setupHelperArgs(b, a);this.decorators.push(["fn = ", this.decorators.functionCall(c, "", ["fn", "props", "container", d]), " || fn;"]);
      }, invokeHelper: function invokeHelper(a, b, c) {
        var d = this.popStack(),
            e = this.setupHelper(a, b),
            f = c ? [e.name, " || "] : "",
            g = ["("].concat(f, d);this.options.strict || g.push(" || ", this.aliasable("helpers.helperMissing")), g.push(")"), this.push(this.source.functionCall(g, "call", e.callParams));
      }, invokeKnownHelper: function invokeKnownHelper(a, b) {
        var c = this.setupHelper(a, b);this.push(this.source.functionCall(c.name, "call", c.callParams));
      }, invokeAmbiguous: function invokeAmbiguous(a, b) {
        this.useRegister("helper");var c = this.popStack();this.emptyHash();var d = this.setupHelper(0, a, b),
            e = this.lastHelper = this.nameLookup("helpers", a, "helper"),
            f = ["(", "(helper = ", e, " || ", c, ")"];this.options.strict || (f[0] = "(helper = ", f.push(" != null ? helper : ", this.aliasable("helpers.helperMissing"))), this.push(["(", f, d.paramsInit ? ["),(", d.paramsInit] : [], "),", "(typeof helper === ", this.aliasable('"function"'), " ? ", this.source.functionCall("helper", "call", d.callParams), " : helper))"]);
      }, invokePartial: function invokePartial(a, b, c) {
        var d = [],
            e = this.setupParams(b, 1, d);a && (b = this.popStack(), delete e.name), c && (e.indent = JSON.stringify(c)), e.helpers = "helpers", e.partials = "partials", e.decorators = "container.decorators", a ? d.unshift(b) : d.unshift(this.nameLookup("partials", b, "partial")), this.options.compat && (e.depths = "depths"), e = this.objectLiteral(e), d.push(e), this.push(this.source.functionCall("container.invokePartial", "", d));
      }, assignToHash: function assignToHash(a) {
        var b = this.popStack(),
            c = void 0,
            d = void 0,
            e = void 0;this.trackIds && (e = this.popStack()), this.stringParams && (d = this.popStack(), c = this.popStack());var f = this.hash;c && (f.contexts[a] = c), d && (f.types[a] = d), e && (f.ids[a] = e), f.values[a] = b;
      }, pushId: function pushId(a, b, c) {
        "BlockParam" === a ? this.pushStackLiteral("blockParams[" + b[0] + "].path[" + b[1] + "]" + (c ? " + " + JSON.stringify("." + c) : "")) : "PathExpression" === a ? this.pushString(b) : "SubExpression" === a ? this.pushStackLiteral("true") : this.pushStackLiteral("null");
      }, compiler: e, compileChildren: function compileChildren(a, b) {
        for (var c = a.children, d = void 0, e = void 0, f = 0, g = c.length; f < g; f++) {
          d = c[f], e = new this.compiler();var h = this.matchExistingProgram(d);if (null == h) {
            this.context.programs.push("");var i = this.context.programs.length;d.index = i, d.name = "program" + i, this.context.programs[i] = e.compile(d, b, this.context, !this.precompile), this.context.decorators[i] = e.decorators, this.context.environments[i] = d, this.useDepths = this.useDepths || e.useDepths, this.useBlockParams = this.useBlockParams || e.useBlockParams, d.useDepths = this.useDepths, d.useBlockParams = this.useBlockParams;
          } else d.index = h.index, d.name = "program" + h.index, this.useDepths = this.useDepths || h.useDepths, this.useBlockParams = this.useBlockParams || h.useBlockParams;
        }
      }, matchExistingProgram: function matchExistingProgram(a) {
        for (var b = 0, c = this.context.environments.length; b < c; b++) {
          var d = this.context.environments[b];if (d && d.equals(a)) return d;
        }
      }, programExpression: function programExpression(a) {
        var b = this.environment.children[a],
            c = [b.index, "data", b.blockParams];return (this.useBlockParams || this.useDepths) && c.push("blockParams"), this.useDepths && c.push("depths"), "container.program(" + c.join(", ") + ")";
      }, useRegister: function useRegister(a) {
        this.registers[a] || (this.registers[a] = !0, this.registers.list.push(a));
      }, push: function push(a) {
        return a instanceof d || (a = this.source.wrap(a)), this.inlineStack.push(a), a;
      }, pushStackLiteral: function pushStackLiteral(a) {
        this.push(new d(a));
      }, pushSource: function pushSource(a) {
        this.pendingContent && (this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent), this.pendingLocation)), this.pendingContent = void 0), a && this.source.push(a);
      }, replaceStack: function replaceStack(a) {
        var b = ["("],
            c = void 0,
            e = void 0,
            f = void 0;if (!this.isInline()) throw new j["default"]("replaceStack on non-inline");var g = this.popStack(!0);if (g instanceof d) c = [g.value], b = ["(", c], f = !0;else {
          e = !0;var h = this.incrStack();b = ["((", this.push(h), " = ", g, ")"], c = this.topStack();
        }var i = a.call(this, c);f || this.popStack(), e && this.stackSlot--, this.push(b.concat(i, ")"));
      }, incrStack: function incrStack() {
        return this.stackSlot++, this.stackSlot > this.stackVars.length && this.stackVars.push("stack" + this.stackSlot), this.topStackName();
      }, topStackName: function topStackName() {
        return "stack" + this.stackSlot;
      }, flushInline: function flushInline() {
        var a = this.inlineStack;this.inlineStack = [];for (var b = 0, c = a.length; b < c; b++) {
          var e = a[b];if (e instanceof d) this.compileStack.push(e);else {
            var f = this.incrStack();this.pushSource([f, " = ", e, ";"]), this.compileStack.push(f);
          }
        }
      }, isInline: function isInline() {
        return this.inlineStack.length;
      }, popStack: function popStack(a) {
        var b = this.isInline(),
            c = (b ? this.inlineStack : this.compileStack).pop();if (!a && c instanceof d) return c.value;if (!b) {
          if (!this.stackSlot) throw new j["default"]("Invalid stack pop");this.stackSlot--;
        }return c;
      }, topStack: function topStack() {
        var a = this.isInline() ? this.inlineStack : this.compileStack,
            b = a[a.length - 1];return b instanceof d ? b.value : b;
      }, contextName: function contextName(a) {
        return this.useDepths && a ? "depths[" + a + "]" : "depth" + a;
      }, quotedString: function quotedString(a) {
        return this.source.quotedString(a);
      }, objectLiteral: function objectLiteral(a) {
        return this.source.objectLiteral(a);
      }, aliasable: function aliasable(a) {
        var b = this.aliases[a];return b ? (b.referenceCount++, b) : (b = this.aliases[a] = this.source.wrap(a), b.aliasable = !0, b.referenceCount = 1, b);
      }, setupHelper: function setupHelper(a, b, c) {
        var d = [],
            e = this.setupHelperArgs(b, a, d, c),
            f = this.nameLookup("helpers", b, "helper"),
            g = this.aliasable(this.contextName(0) + " != null ? " + this.contextName(0) + " : (container.nullContext || {})");return { params: d, paramsInit: e, name: f, callParams: [g].concat(d) };
      }, setupParams: function setupParams(a, b, c) {
        var d = {},
            e = [],
            f = [],
            g = [],
            h = !c,
            i = void 0;h && (c = []), d.name = this.quotedString(a), d.hash = this.popStack(), this.trackIds && (d.hashIds = this.popStack()), this.stringParams && (d.hashTypes = this.popStack(), d.hashContexts = this.popStack());var j = this.popStack(),
            k = this.popStack();(k || j) && (d.fn = k || "container.noop", d.inverse = j || "container.noop");for (var l = b; l--;) {
          i = this.popStack(), c[l] = i, this.trackIds && (g[l] = this.popStack()), this.stringParams && (f[l] = this.popStack(), e[l] = this.popStack());
        }return h && (d.args = this.source.generateArray(c)), this.trackIds && (d.ids = this.source.generateArray(g)), this.stringParams && (d.types = this.source.generateArray(f), d.contexts = this.source.generateArray(e)), this.options.data && (d.data = "data"), this.useBlockParams && (d.blockParams = "blockParams"), d;
      }, setupHelperArgs: function setupHelperArgs(a, b, c, d) {
        var e = this.setupParams(a, b, c);return e = this.objectLiteral(e), d ? (this.useRegister("options"), c.push("options"), ["options=", e]) : c ? (c.push(e), "") : e;
      } }, function () {
      for (var a = "break else new var case finally return void catch for switch while continue function this with default if throw delete in try do instanceof typeof abstract enum int short boolean export interface static byte extends long super char final native synchronized class float package throws const goto private transient debugger implements protected volatile double import public let yield await null true false".split(" "), b = e.RESERVED_WORDS = {}, c = 0, d = a.length; c < d; c++) {
        b[a[c]] = !0;
      }
    }(), e.isValidJavaScriptVariableName = function (a) {
      return !e.RESERVED_WORDS[a] && /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(a);
    }, b["default"] = e, a.exports = b["default"];
  }, function (a, b, c) {
    "use strict";
    function d(a, b, c) {
      if (f.isArray(a)) {
        for (var d = [], e = 0, g = a.length; e < g; e++) {
          d.push(b.wrap(a[e], c));
        }return d;
      }return "boolean" == typeof a || "number" == typeof a ? a + "" : a;
    }function e(a) {
      this.srcFile = a, this.source = [];
    }b.__esModule = !0;var f = c(5),
        g = void 0;try {} catch (h) {}g || (g = function g(a, b, c, d) {
      this.src = "", d && this.add(d);
    }, g.prototype = { add: function add(a) {
        f.isArray(a) && (a = a.join("")), this.src += a;
      }, prepend: function prepend(a) {
        f.isArray(a) && (a = a.join("")), this.src = a + this.src;
      }, toStringWithSourceMap: function toStringWithSourceMap() {
        return { code: this.toString() };
      }, toString: function toString() {
        return this.src;
      } }), e.prototype = { isEmpty: function isEmpty() {
        return !this.source.length;
      }, prepend: function prepend(a, b) {
        this.source.unshift(this.wrap(a, b));
      }, push: function push(a, b) {
        this.source.push(this.wrap(a, b));
      }, merge: function merge() {
        var a = this.empty();return this.each(function (b) {
          a.add(["  ", b, "\n"]);
        }), a;
      }, each: function each(a) {
        for (var b = 0, c = this.source.length; b < c; b++) {
          a(this.source[b]);
        }
      }, empty: function empty() {
        var a = this.currentLocation || { start: {} };return new g(a.start.line, a.start.column, this.srcFile);
      }, wrap: function wrap(a) {
        var b = arguments.length <= 1 || void 0 === arguments[1] ? this.currentLocation || { start: {} } : arguments[1];return a instanceof g ? a : (a = d(a, this, b), new g(b.start.line, b.start.column, this.srcFile, a));
      }, functionCall: function functionCall(a, b, c) {
        return c = this.generateList(c), this.wrap([a, b ? "." + b + "(" : "(", c, ")"]);
      }, quotedString: function quotedString(a) {
        return '"' + (a + "").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029") + '"';
      }, objectLiteral: function objectLiteral(a) {
        var b = [];for (var c in a) {
          if (a.hasOwnProperty(c)) {
            var e = d(a[c], this);"undefined" !== e && b.push([this.quotedString(c), ":", e]);
          }
        }var f = this.generateList(b);return f.prepend("{"), f.add("}"), f;
      }, generateList: function generateList(a) {
        for (var b = this.empty(), c = 0, e = a.length; c < e; c++) {
          c && b.add(","), b.add(d(a[c], this));
        }return b;
      }, generateArray: function generateArray(a) {
        var b = this.generateList(a);return b.prepend("["), b.add("]"), b;
      } }, b["default"] = e, a.exports = b["default"];
  }]);
});

},{}],3:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator$1(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator$1.prototype._enumerate = function (input) {
  for (var i = 0; this._state === PENDING && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator$1.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$1 = c.resolve;

  if (resolve$$1 === resolve$1) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$2) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$1) {
        return resolve$$1(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$1(entry), i);
  }
};

Enumerator$1.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator$1.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all$1(entries) {
  return new Enumerator$1(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race$1(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise$2(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
  }
}

Promise$2.all = all$1;
Promise$2.race = race$1;
Promise$2.resolve = resolve$1;
Promise$2.reject = reject$1;
Promise$2._setScheduler = setScheduler;
Promise$2._setAsap = setAsap;
Promise$2._asap = asap;

Promise$2.prototype = {
  constructor: Promise$2,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

/*global self*/
function polyfill$1() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise$2;
}

// Strange compat..
Promise$2.polyfill = polyfill$1;
Promise$2.Promise = Promise$2;

return Promise$2;

})));



}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":1}],4:[function(require,module,exports){
(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require('whatwg-fetch');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

require('es6-promise').polyfill(); // needed for fetch

var handlebars = require('../lib/handlebars.min');
/**
 * Makes sure that a path is converted to an array.
 * @param paths
 * @returns {*}
 */
var ensurePathArray = function ensurePathArray(paths) {
    if (!paths) {
        paths = [];
    } else if (typeof paths === 'string') {
        paths = [paths];
    }
    return paths;
};

/**
 The Resource Manager.
 @class ResourceManager
 @description Represents a manager that loads any CSS and Javascript Resources on the fly.
 */

var ResourceManager = function () {

    /**
     * Upon initialization.
     * @memberOf ResourceManager
     */
    function ResourceManager() {
        _classCallCheck(this, ResourceManager);

        this._head = document.getElementsByTagName('head')[0];
        this._cssPaths = {};
        this._scriptMaps = {};
        this._dataPromises = {};
    }

    /**
     * Loads a javascript file.
     * @param {string|Array} paths - The path to the view's js file
     * @memberOf ResourceManager
     * @return {Promise} Returns a promise that resolves when all scripts have been loaded
     */


    _createClass(ResourceManager, [{
        key: 'loadScript',
        value: function loadScript(paths) {
            var script = void 0,
                map = void 0,
                loadPromises = [];
            paths = ensurePathArray(paths);
            paths.forEach(function (path) {
                map = this._scriptMaps[path] = this._scriptMaps[path] || {};
                if (!map.promise) {
                    map.path = path;
                    map.promise = new Promise(function (resolve) {
                        script = this.createScriptElement();
                        script.setAttribute('type', 'text/javascript');
                        script.src = path;
                        script.addEventListener('load', resolve);
                        this._head.appendChild(script);
                    }.bind(this));
                }
                loadPromises.push(map.promise);
            }.bind(this));
            return Promise.all(loadPromises);
        }

        /**
         * Removes a script that has the specified path from the head of the document.
         * @param {string|Array} paths - The paths of the scripts to unload
         * @memberOf ResourceManager
         */

    }, {
        key: 'unloadScript',
        value: function unloadScript(paths) {
            var file = void 0;
            return new Promise(function (resolve) {
                paths = ensurePathArray(paths);
                paths.forEach(function (path) {
                    file = this._head.querySelectorAll('script[src="' + path + '"]')[0];
                    if (file) {
                        this._head.removeChild(file);
                        delete this._scriptMaps[path];
                    }
                }.bind(this));
                resolve();
            }.bind(this));
        }

        /**
         * Creates a new script element.
         * @returns {HTMLElement}
         */

    }, {
        key: 'createScriptElement',
        value: function createScriptElement() {
            return document.createElement('script');
        }

        /**
         * Makes a request to get data and caches it.
         * @param {string} url - The url to fetch data from
         * @param [reqOptions] - options to be passed to fetch call
         * @returns {*}
         */

    }, {
        key: 'fetchData',
        value: function fetchData(url) {
            var _this = this;

            var reqOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

            var cacheId = url + JSON.stringify(reqOptions);

            reqOptions.cache = reqOptions.cache === undefined ? true : reqOptions.cache;

            if (!url) {
                return Promise.resolve();
            }
            if (!this._dataPromises[cacheId] || !reqOptions.cache) {
                this._dataPromises[cacheId] = fetch(url, reqOptions).catch(function (e) {
                    // if failure, remove cache so that subsequent
                    // requests will trigger new ajax call
                    _this._dataPromises[cacheId] = null;
                    throw e;
                });
            }
            return this._dataPromises[cacheId];
        }

        /**
         * Loads css files.
         * @param {Array|String} paths - An array of css paths files to load
         * @memberOf ResourceManager
         * @return {Promise}
         */

    }, {
        key: 'loadCss',
        value: function loadCss(paths) {
            return new Promise(function (resolve) {
                paths = ensurePathArray(paths);
                paths.forEach(function (path) {
                    // TODO: figure out a way to find out when css is guaranteed to be loaded,
                    // and make this return a truely asynchronous promise
                    if (!this._cssPaths[path]) {
                        var el = document.createElement('link');
                        el.setAttribute('rel', 'stylesheet');
                        el.setAttribute('href', path);
                        this._head.appendChild(el);
                        this._cssPaths[path] = el;
                    }
                }.bind(this));
                resolve();
            }.bind(this));
        }

        /**
         * Unloads css paths.
         * @param {string|Array} paths - The css paths to unload
         * @memberOf ResourceManager
         * @return {Promise}
         */

    }, {
        key: 'unloadCss',
        value: function unloadCss(paths) {
            var el = void 0;
            return new Promise(function (resolve) {
                paths = ensurePathArray(paths);
                paths.forEach(function (path) {
                    el = this._cssPaths[path];
                    if (el) {
                        this._head.removeChild(el);
                        this._cssPaths[path] = null;
                    }
                }.bind(this));
                resolve();
            }.bind(this));
        }

        /**
         * Parses a template into a DOM element, then returns element back to you.
         * @param {string} path - The path to the template
         * @param {HTMLElement} [el] - The element to attach template to
         * @param {Object|Array} [hbsData] - The data to use for the handlebar template (if applicable)
         * @returns {Promise} Returns a promise that resolves with contents of template file
         */

    }, {
        key: 'loadTemplate',
        value: function loadTemplate(path, el, hbsData) {

            var isHandlebarFile = function isHandlebarFile(filePath) {
                if (filePath) {
                    var frags = filePath.split('.');
                    var ext = frags[frags.length - 1];
                    return ext === 'hbs';
                }
            };

            if (!path) {
                return Promise.resolve();
            }

            return this.fetchTemplate(path).then(function (contents) {
                if (isHandlebarFile(path)) {
                    var template = handlebars.compile(contents);
                    contents = template(hbsData || {});
                }
                if (el) {
                    el.innerHTML = contents;
                    contents = el;
                }
                return contents;
            });
        }

        /**
         * Fetches a template file from the server.
         * @param [templatePath] - The file path to the template file
         * @returns {Promise} Returns a promise that is resolved with the contents of the template file when retrieved
         */

    }, {
        key: 'fetchTemplate',
        value: function fetchTemplate(templatePath) {
            return fetch(templatePath).then(function (resp) {
                return resp.text().then(function (contents) {
                    return contents;
                });
            });
        }

        /**
         * Removes all cached resources.
         * @memberOf ResourceManager
         */

    }, {
        key: 'flush',
        value: function flush() {
            this.unloadCss(Object.getOwnPropertyNames(this._cssPaths));
            this._cssPaths = {};
            for (var s in this._scriptMaps) {
                if (this._scriptMaps.hasOwnProperty(s)) {
                    var map = this._scriptMaps[s];
                    this.unloadScript(map.path);
                }
            }
            this._scriptMaps = {};
            this._dataPromises = {};
        }
    }]);

    return ResourceManager;
}();

exports.default = new ResourceManager();
module.exports = exports['default'];

},{"../lib/handlebars.min":2,"es6-promise":3,"whatwg-fetch":4}]},{},[5])(5)
});