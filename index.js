self.sqliteWorker = (function (exports) {
  'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function plain (t) {
    for (var s = t[0], i = 1, l = arguments.length; i < l; i++) {
      s += arguments[i] + t[i];
    }

    return s;
  }

  var cache = new WeakMap();

  var parse = function parse(template, values) {
    var t = [template[0]];
    var v = [];

    for (var c = 0, i = 0, j = 0, length = values.length; i < length; i++) {
      if (values[i] instanceof Static) t[c] += values[i].v + template[i + 1];else {
        v[j++] = i;
        t[++c] = template[i + 1];
      }
    }

    return {
      t: t,
      v: v
    };
  };

  var asStatic = function asStatic(value) {
    return new Static(value);
  };

  var asParams = function asParams(template) {
    for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      values[_key - 1] = arguments[_key];
    }

    var _parse = parse(template, values),
        t = _parse.t,
        v = _parse.v;

    var parsed = cache.get(template) || cache.set(template, {}).get(template);
    return (parsed[t] || (parsed[t] = [t])).concat(v.map(function (i) {
      return values[i];
    }));
  };

  function Static(v) {
    this.v = v;
  }

  var create = function create(db, name) {
    return function (tpl) {
      for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        values[_key - 1] = arguments[_key];
      }

      return new Promise(function (res, rej) {
        if (tpl.some(invalid)) rej(error(new Error('SQLITE_ERROR: SQL injection hazard')));

        var _asParams = asParams.apply(void 0, [tpl].concat(values)),
            _asParams2 = _toArray(_asParams),
            sql = _asParams2[0],
            params = _asParams2.slice(1);

        db[name](sql.join('?'), params, function (err, val) {
          if (err) rej(err);else res(val);
        });
      });
    };
  };

  var error = function error(_error) {
    return _error.code = 'SQLITE_ERROR', _error;
  };

  var raw = function raw(tpl) {
    for (var _len2 = arguments.length, values = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      values[_key2 - 1] = arguments[_key2];
    }

    return asStatic(plain.apply(void 0, [tpl].concat(values)));
  };

  var invalid = function invalid(chunk) {
    return chunk.includes('?');
  };

  function SQLiteTag(db) {
    return {
      all: create(db, 'all'),
      get: create(db, 'get'),
      query: create(db, 'run'),
      raw: raw
    };
  }

  var initSqlJsPromise = undefined;

  var initSqlJs = function initSqlJs(e) {
    if (initSqlJsPromise) {
      return initSqlJsPromise;
    }

    initSqlJsPromise = new Promise(function (t, r) {
      var n = typeof e !== "undefined" ? e : {};
      var o = n["onAbort"];

      n["onAbort"] = function (e) {
        r(new Error(e));

        if (o) {
          o(e);
        }
      };

      n["postRun"] = n["postRun"] || [];
      n["postRun"].push(function () {
        t(n);
      });
      var n = typeof n !== "undefined" ? n : {};

      n["onRuntimeInitialized"] = function e() {
        var t = eo(4);
        var r = n["cwrap"];
        var o = 0;
        var i = 0;
        var a = 100;
        var s = 101;
        var u = 1;
        var c = 2;
        var f = 3;
        var l = 4;
        var d = 1;
        var p = r("sqlite3_open", "number", ["string", "number"]);
        var E = r("sqlite3_close_v2", "number", ["number"]);
        var h = r("sqlite3_exec", "number", ["number", "string", "number", "number", "number"]);
        var m = r("sqlite3_changes", "number", ["number"]);

        var _ = r("sqlite3_prepare_v2", "number", ["number", "string", "number", "number", "number"]);

        var v = r("sqlite3_sql", "string", ["number"]);
        var T = r("sqlite3_normalized_sql", "string", ["number"]);
        var g = r("sqlite3_prepare_v2", "number", ["number", "number", "number", "number", "number"]);
        var w = r("sqlite3_bind_text", "number", ["number", "number", "number", "number", "number"]);
        var y = r("sqlite3_bind_blob", "number", ["number", "number", "number", "number", "number"]);
        var O = r("sqlite3_bind_double", "number", ["number", "number", "number"]);
        var b = r("sqlite3_bind_int", "number", ["number", "number", "number"]);
        var D = r("sqlite3_bind_parameter_index", "number", ["number", "string"]);
        var R = r("sqlite3_step", "number", ["number"]);
        var A = r("sqlite3_errmsg", "string", ["number"]);
        var S = r("sqlite3_column_count", "number", ["number"]);
        var M = r("sqlite3_data_count", "number", ["number"]);
        var P = r("sqlite3_column_double", "number", ["number", "number"]);
        var F = r("sqlite3_column_text", "string", ["number", "number"]);
        var N = r("sqlite3_column_blob", "number", ["number", "number"]);
        var I = r("sqlite3_column_bytes", "number", ["number", "number"]);
        var x = r("sqlite3_column_type", "number", ["number", "number"]);
        var k = r("sqlite3_column_name", "string", ["number", "number"]);
        var X = r("sqlite3_reset", "number", ["number"]);
        var L = r("sqlite3_clear_bindings", "number", ["number"]);
        var H = r("sqlite3_finalize", "number", ["number"]);
        var C = r("sqlite3_create_function_v2", "number", ["number", "string", "number", "number", "number", "number", "number", "number", "number"]);
        var q = r("sqlite3_value_type", "number", ["number"]);
        var Q = r("sqlite3_value_bytes", "number", ["number"]);
        var B = r("sqlite3_value_text", "string", ["number"]);
        var z = r("sqlite3_value_blob", "number", ["number"]);
        var Y = r("sqlite3_value_double", "number", ["number"]);
        var V = r("sqlite3_result_double", "", ["number", "number"]);
        var K = r("sqlite3_result_null", "", ["number"]);
        var J = r("sqlite3_result_text", "", ["number", "string", "number", "number"]);
        var Z = r("sqlite3_result_blob", "", ["number", "number", "number", "number"]);
        var $ = r("sqlite3_result_int", "", ["number", "number"]);
        var ee = r("sqlite3_result_error", "", ["number", "string", "number"]);
        var te = r("RegisterExtensionFunctions", "number", ["number"]);

        function ne(e, t) {
          this.stmt = e;
          this.db = t;
          this.pos = 1;
          this.allocatedmem = [];
        }

        ne.prototype["bind"] = function e(t) {
          if (!this.stmt) {
            throw "Statement closed";
          }

          this["reset"]();
          if (Array.isArray(t)) return this.bindFromArray(t);

          if (t != null && _typeof(t) === "object") {
            return this.bindFromObject(t);
          }

          return true;
        };

        ne.prototype["step"] = function e() {
          if (!this.stmt) {
            throw "Statement closed";
          }

          this.pos = 1;
          var t = R(this.stmt);

          switch (t) {
            case a:
              return true;

            case s:
              return false;

            default:
              throw this.db.handleError(t);
          }
        };

        ne.prototype.getNumber = function e(t) {
          if (t == null) {
            t = this.pos;
            this.pos += 1;
          }

          return P(this.stmt, t);
        };

        ne.prototype.getString = function e(t) {
          if (t == null) {
            t = this.pos;
            this.pos += 1;
          }

          return F(this.stmt, t);
        };

        ne.prototype.getBlob = function e(t) {
          if (t == null) {
            t = this.pos;
            this.pos += 1;
          }

          var r = I(this.stmt, t);
          var n = N(this.stmt, t);
          var o = new Uint8Array(r);

          for (var i = 0; i < r; i += 1) {
            o[i] = Pe[n + i];
          }

          return o;
        };

        ne.prototype["get"] = function e(t) {
          if (t != null && this["bind"](t)) {
            this["step"]();
          }

          var r = [];
          var n = M(this.stmt);

          for (var o = 0; o < n; o += 1) {
            switch (x(this.stmt, o)) {
              case u:
              case c:
                r.push(this.getNumber(o));
                break;

              case f:
                r.push(this.getString(o));
                break;

              case l:
                r.push(this.getBlob(o));
                break;

              default:
                r.push(null);
            }
          }

          return r;
        };

        ne.prototype["getColumnNames"] = function e() {
          var t = [];
          var r = S(this.stmt);

          for (var n = 0; n < r; n += 1) {
            t.push(k(this.stmt, n));
          }

          return t;
        };

        ne.prototype["getAsObject"] = function e(t) {
          var r = this["get"](t);
          var n = this["getColumnNames"]();
          var o = {};

          for (var i = 0; i < n.length; i += 1) {
            var a = n[i];
            o[a] = r[i];
          }

          return o;
        };

        ne.prototype["getSQL"] = function e() {
          return v(this.stmt);
        };

        ne.prototype["getNormalizedSQL"] = function e() {
          return T(this.stmt);
        };

        ne.prototype["run"] = function e(t) {
          if (t != null) {
            this["bind"](t);
          }

          this["step"]();
          return this["reset"]();
        };

        ne.prototype.bindString = function e(t, r) {
          if (r == null) {
            r = this.pos;
            this.pos += 1;
          }

          var n = Jr(t);
          var o = oe(n, re);
          this.allocatedmem.push(o);
          this.db.handleError(w(this.stmt, r, o, n.length - 1, 0));
          return true;
        };

        ne.prototype.bindBlob = function e(t, r) {
          if (r == null) {
            r = this.pos;
            this.pos += 1;
          }

          var n = oe(t, re);
          this.allocatedmem.push(n);
          this.db.handleError(y(this.stmt, r, n, t.length, 0));
          return true;
        };

        ne.prototype.bindNumber = function e(t, r) {
          if (r == null) {
            r = this.pos;
            this.pos += 1;
          }

          var n = t === (t | 0) ? b : O;
          this.db.handleError(n(this.stmt, r, t));
          return true;
        };

        ne.prototype.bindNull = function e(t) {
          if (t == null) {
            t = this.pos;
            this.pos += 1;
          }

          return y(this.stmt, t, 0, 0, 0) === i;
        };

        ne.prototype.bindValue = function e(t, r) {
          if (r == null) {
            r = this.pos;
            this.pos += 1;
          }

          switch (_typeof(t)) {
            case "string":
              return this.bindString(t, r);

            case "number":
            case "boolean":
              return this.bindNumber(t + 0, r);

            case "object":
              if (t === null) {
                return this.bindNull(r);
              }

              if (t.length != null) {
                return this.bindBlob(t, r);
              }

              break;
          }

          throw "Wrong API use : tried to bind a value of an unknown type (" + t + ").";
        };

        ne.prototype.bindFromObject = function e(t) {
          var r = this;
          Object.keys(t).forEach(function e(n) {
            var o = D(r.stmt, n);

            if (o !== 0) {
              r.bindValue(t[n], o);
            }
          });
          return true;
        };

        ne.prototype.bindFromArray = function e(t) {
          for (var r = 0; r < t.length; r += 1) {
            this.bindValue(t[r], r + 1);
          }

          return true;
        };

        ne.prototype["reset"] = function e() {
          this.freemem();
          return L(this.stmt) === i && X(this.stmt) === i;
        };

        ne.prototype["freemem"] = function e() {
          var t;

          while ((t = this.allocatedmem.pop()) !== undefined) {
            Wn(t);
          }
        };

        ne.prototype["free"] = function e() {
          var t;
          this.freemem();
          t = H(this.stmt) === i;
          delete this.db.statements[this.stmt];
          this.stmt = o;
          return t;
        };

        function ie(e, t) {
          this.db = t;
          var r = fe(e) + 1;
          this.sqlPtr = zn(r);

          if (this.sqlPtr === null) {
            throw new Error("Unable to allocate memory for the SQL string");
          }

          ce(e, this.sqlPtr, r);
          this.nextSqlPtr = this.sqlPtr;
          this.nextSqlString = null;
          this.activeStatement = null;
        }

        ie.prototype["next"] = function e() {
          if (this.sqlPtr === null) {
            return {
              done: true
            };
          }

          if (this.activeStatement !== null) {
            this.activeStatement["free"]();
            this.activeStatement = null;
          }

          if (!this.db.db) {
            this.finalize();
            throw new Error("Database closed");
          }

          var r = Zn();
          var n = eo(4);
          W(t, 0, "i32");
          W(n, 0, "i32");

          try {
            this.db.handleError(g(this.db.db, this.nextSqlPtr, -1, t, n));
            this.nextSqlPtr = G(n, "i32");
            var i = G(t, "i32");

            if (i === o) {
              this.finalize();
              return {
                done: true
              };
            }

            this.activeStatement = new ne(i, this.db);
            this.db.statements[i] = this.activeStatement;
            return {
              value: this.activeStatement,
              done: false
            };
          } catch (e) {
            this.nextSqlString = se(this.nextSqlPtr);
            this.finalize();
            throw e;
          } finally {
            $n(r);
          }
        };

        ie.prototype.finalize = function e() {
          Wn(this.sqlPtr);
          this.sqlPtr = null;
        };

        ie.prototype["getRemainingSQL"] = function e() {
          if (this.nextSqlString !== null) return this.nextSqlString;
          return se(this.nextSqlPtr);
        };

        if (typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol") {
          ie.prototype[Symbol.iterator] = function e() {
            return this;
          };
        }

        function ae(e) {
          this.filename = "dbfile_" + (4294967295 * Math.random() >>> 0);

          if (e != null) {
            $t.createDataFile("/", this.filename, e, true, true);
          }

          this.handleError(p(this.filename, t));
          this.db = G(t, "i32");
          te(this.db);
          this.statements = {};
          this.functions = {};
        }

        ae.prototype["run"] = function e(r, n) {
          if (!this.db) {
            throw "Database closed";
          }

          if (n) {
            var o = this["prepare"](r, n);

            try {
              o["step"]();
            } finally {
              o["free"]();
            }
          } else {
            this.handleError(h(this.db, r, 0, 0, t));
          }

          return this;
        };

        ae.prototype["exec"] = function e(r, n) {
          if (!this.db) {
            throw "Database closed";
          }

          var i = Zn();
          var a = null;

          try {
            var s = we(r);
            var u = eo(4);
            var c = [];

            while (G(s, "i8") !== o) {
              W(t, 0, "i32");
              W(u, 0, "i32");
              this.handleError(g(this.db, s, -1, t, u));
              var f = G(t, "i32");
              s = G(u, "i32");

              if (f !== o) {
                var l = null;
                a = new ne(f, this);

                if (n != null) {
                  a.bind(n);
                }

                while (a["step"]()) {
                  if (l === null) {
                    l = {
                      columns: a["getColumnNames"](),
                      values: []
                    };
                    c.push(l);
                  }

                  l["values"].push(a["get"]());
                }

                a["free"]();
              }
            }

            return c;
          } catch (e) {
            if (a) a["free"]();
            throw e;
          } finally {
            $n(i);
          }
        };

        ae.prototype["each"] = function e(t, r, n, o) {
          var i;

          if (typeof r === "function") {
            o = n;
            n = r;
            r = undefined;
          }

          i = this["prepare"](t, r);

          try {
            while (i["step"]()) {
              n(i["getAsObject"]());
            }
          } finally {
            i["free"]();
          }

          if (typeof o === "function") {
            return o();
          }

          return undefined;
        };

        ae.prototype["prepare"] = function e(r, n) {
          W(t, 0, "i32");
          this.handleError(_(this.db, r, -1, t, o));
          var i = G(t, "i32");

          if (i === o) {
            throw "Nothing to prepare";
          }

          var a = new ne(i, this);

          if (n != null) {
            a.bind(n);
          }

          this.statements[i] = a;
          return a;
        };

        ae.prototype["iterateStatements"] = function e(t) {
          return new ie(t, this);
        };

        ae.prototype["export"] = function e() {
          Object.values(this.statements).forEach(function e(t) {
            t["free"]();
          });
          Object.values(this.functions).forEach(j);
          this.functions = {};
          this.handleError(E(this.db));
          var r = $t.readFile(this.filename, {
            encoding: "binary"
          });
          this.handleError(p(this.filename, t));
          this.db = G(t, "i32");
          return r;
        };

        ae.prototype["close"] = function e() {
          if (this.db === null) {
            return;
          }

          Object.values(this.statements).forEach(function e(t) {
            t["free"]();
          });
          Object.values(this.functions).forEach(j);
          this.functions = {};
          this.handleError(E(this.db));
          $t.unlink("/" + this.filename);
          this.db = null;
        };

        ae.prototype["handleError"] = function e(t) {
          var r;

          if (t === i) {
            return null;
          }

          r = A(this.db);
          throw new Error(r);
        };

        ae.prototype["getRowsModified"] = function e() {
          return m(this.db);
        };

        ae.prototype["create_function"] = function e(t, r) {
          function n(e, t, n) {
            var o;

            function i(e) {
              var t = Q(e);
              var r = z(e);
              var n = new Uint8Array(t);

              for (var o = 0; o < t; o += 1) {
                n[o] = Pe[r + o];
              }

              return n;
            }

            var a = [];

            for (var s = 0; s < t; s += 1) {
              var d = G(n + 4 * s, "i32");
              var p = q(d);
              var E;

              if (p === u || p === c) {
                E = Y(d);
              } else if (p === f) {
                E = B(d);
              } else if (p === l) {
                E = i(d);
              } else E = null;

              a.push(E);
            }

            try {
              o = r.apply(null, a);
            } catch (t) {
              ee(e, t, -1);
              return;
            }

            switch (_typeof(o)) {
              case "boolean":
                $(e, o ? 1 : 0);
                break;

              case "number":
                V(e, o);
                break;

              case "string":
                J(e, o, -1, -1);
                break;

              case "object":
                if (o === null) {
                  K(e);
                } else if (o.length != null) {
                  var h = oe(o, re);
                  Z(e, h, o.length, -1);
                  Wn(h);
                } else {
                  ee(e, "Wrong API use : tried to return a value " + "of an unknown type (" + o + ").", -1);
                }

                break;

              default:
                K(e);
            }
          }

          if (Object.prototype.hasOwnProperty.call(this.functions, t)) {
            j(this.functions[t]);
            delete this.functions[t];
          }

          var o = U(n, "viii");
          this.functions[t] = o;
          this.handleError(C(this.db, t, r.length, d, 0, o, 0, 0, 0));
          return this;
        };

        n.Database = ae;
      };

      var i = {};
      var a;

      for (a in n) {
        if (n.hasOwnProperty(a)) {
          i[a] = n[a];
        }
      }
      var u = "./this.program";

      var f = false;
      var l = false;
      var d = false;
      var p = false;
      f = (typeof window === "undefined" ? "undefined" : _typeof(window)) === "object";
      l = typeof importScripts === "function";
      d = (typeof process === "undefined" ? "undefined" : _typeof(process)) === "object" && _typeof(process.versions) === "object" && typeof process.versions.node === "string";
      p = !f && !d && !l;

      if (n["ENVIRONMENT"]) {
        throw new Error("Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -s ENVIRONMENT=web or -s ENVIRONMENT=node)");
      }

      var E = "";

      function h(e) {
        if (n["locateFile"]) {
          return n["locateFile"](e, E);
        }

        return E + e;
      }

      var m, v;

      var g;
      var w;

      if (d) {
        if (l) {
          E = require("path").dirname(E) + "/";
        } else {
          E = __dirname + "/";
        }

        m = function e(t, r) {
          if (!g) g = require("fs");
          if (!w) w = require("path");
          t = w["normalize"](t);
          return g["readFileSync"](t, r ? null : "utf8");
        };

        v = function e(t) {
          var r = m(t, true);

          if (!r.buffer) {
            r = new Uint8Array(r);
          }

          Z(r.buffer);
          return r;
        };

        if (process["argv"].length > 1) {
          u = process["argv"][1].replace(/\\/g, "/");
        }

        process["argv"].slice(2);

        n["inspect"] = function () {
          return "[Emscripten Module object]";
        };
      } else if (p) {
        if (typeof read != "undefined") {
          m = function e(t) {
            return read(t);
          };
        }

        v = function e(t) {
          var r;

          if (typeof readbuffer === "function") {
            return new Uint8Array(readbuffer(t));
          }

          r = read(t, "binary");
          Z(_typeof(r) === "object");
          return r;
        };

        if (typeof scriptArgs != "undefined") {
          scriptArgs;
        }

        if (typeof print !== "undefined") {
          if (typeof console === "undefined") console = {};
          console.log = print;
          console.warn = console.error = typeof printErr !== "undefined" ? printErr : print;
        }
      } else if (f || l) {
        if (l) {
          E = self.location.href;
        } else if (document.currentScript) {
          E = document.currentScript.src;
        }

        if (E.indexOf("blob:") !== 0) {
          E = E.substr(0, E.lastIndexOf("/") + 1);
        } else {
          E = "";
        }

        {
          m = function e(t) {
            var r = new XMLHttpRequest();
            r.open("GET", t, false);
            r.send(null);
            return r.responseText;
          };

          if (l) {
            v = function e(t) {
              var r = new XMLHttpRequest();
              r.open("GET", t, false);
              r.responseType = "arraybuffer";
              r.send(null);
              return new Uint8Array(r.response);
            };
          }
        }
      } else {
        throw new Error("environment detection error");
      }

      var y = n["print"] || console.log.bind(console);
      var O = n["printErr"] || console.warn.bind(console);

      for (a in i) {
        if (i.hasOwnProperty(a)) {
          n[a] = i[a];
        }
      }

      i = null;
      if (n["arguments"]) n["arguments"];
      if (!Object.getOwnPropertyDescriptor(n, "arguments")) Object.defineProperty(n, "arguments", {
        configurable: true,
        get: function get() {
          _t("Module.arguments has been replaced with plain arguments_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      if (n["thisProgram"]) u = n["thisProgram"];
      if (!Object.getOwnPropertyDescriptor(n, "thisProgram")) Object.defineProperty(n, "thisProgram", {
        configurable: true,
        get: function get() {
          _t("Module.thisProgram has been replaced with plain thisProgram (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      if (n["quit"]) n["quit"];
      if (!Object.getOwnPropertyDescriptor(n, "quit")) Object.defineProperty(n, "quit", {
        configurable: true,
        get: function get() {
          _t("Module.quit has been replaced with plain quit_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      Z(typeof n["memoryInitializerPrefixURL"] === "undefined", "Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead");
      Z(typeof n["pthreadMainPrefixURL"] === "undefined", "Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead");
      Z(typeof n["cdInitializerPrefixURL"] === "undefined", "Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead");
      Z(typeof n["filePackagePrefixURL"] === "undefined", "Module.filePackagePrefixURL option was removed, use Module.locateFile instead");
      Z(typeof n["read"] === "undefined", "Module.read option was removed (modify read_ in JS)");
      Z(typeof n["readAsync"] === "undefined", "Module.readAsync option was removed (modify readAsync in JS)");
      Z(typeof n["readBinary"] === "undefined", "Module.readBinary option was removed (modify readBinary in JS)");
      Z(typeof n["setWindowTitle"] === "undefined", "Module.setWindowTitle option was removed (modify setWindowTitle in JS)");
      Z(typeof n["TOTAL_MEMORY"] === "undefined", "Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY");
      if (!Object.getOwnPropertyDescriptor(n, "read")) Object.defineProperty(n, "read", {
        configurable: true,
        get: function get() {
          _t("Module.read has been replaced with plain read_ (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      if (!Object.getOwnPropertyDescriptor(n, "readAsync")) Object.defineProperty(n, "readAsync", {
        configurable: true,
        get: function get() {
          _t("Module.readAsync has been replaced with plain readAsync (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      if (!Object.getOwnPropertyDescriptor(n, "readBinary")) Object.defineProperty(n, "readBinary", {
        configurable: true,
        get: function get() {
          _t("Module.readBinary has been replaced with plain readBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      if (!Object.getOwnPropertyDescriptor(n, "setWindowTitle")) Object.defineProperty(n, "setWindowTitle", {
        configurable: true,
        get: function get() {
          _t("Module.setWindowTitle has been replaced with plain setWindowTitle (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      var S = 16;

      function M(e, t) {
        if (!t) t = S;
        return Math.ceil(e / t) * t;
      }

      function F(e) {
        if (!F.shown) F.shown = {};

        if (!F.shown[e]) {
          F.shown[e] = 1;
          O(e);
        }
      }

      function N(e, t) {
        if (typeof WebAssembly.Function === "function") {
          var r = {
            i: "i32",
            j: "i64",
            f: "f32",
            d: "f64"
          };
          var n = {
            parameters: [],
            results: t[0] == "v" ? [] : [r[t[0]]]
          };

          for (var o = 1; o < t.length; ++o) {
            n.parameters.push(r[t[o]]);
          }

          return new WebAssembly.Function(n, e);
        }

        var i = [1, 0, 1, 96];
        var a = t.slice(0, 1);
        var s = t.slice(1);
        var u = {
          i: 127,
          j: 126,
          f: 125,
          d: 124
        };
        i.push(s.length);

        for (var o = 0; o < s.length; ++o) {
          i.push(u[s[o]]);
        }

        if (a == "v") {
          i.push(0);
        } else {
          i = i.concat([1, u[a]]);
        }

        i[1] = i.length - 2;
        var c = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(i, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0]));
        var f = new WebAssembly.Module(c);
        var l = new WebAssembly.Instance(f, {
          e: {
            f: e
          }
        });
        var d = l.exports["f"];
        return d;
      }

      var I = [];
      var x;

      function k(e, t) {
        var r = V;

        if (!x) {
          x = new WeakMap();

          for (var n = 0; n < r.length; n++) {
            var o = r.get(n);

            if (o) {
              x.set(o, n);
            }
          }
        }

        if (x.has(e)) {
          return x.get(e);
        }

        var i;

        if (I.length) {
          i = I.pop();
        } else {
          i = r.length;

          try {
            r.grow(1);
          } catch (e) {
            if (!(e instanceof RangeError)) {
              throw e;
            }

            throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
          }
        }

        try {
          r.set(i, e);
        } catch (n) {
          if (!(n instanceof TypeError)) {
            throw n;
          }

          Z(typeof t !== "undefined", "Missing signature argument to addFunction");
          var a = N(e, t);
          r.set(i, a);
        }

        x.set(e, i);
        return i;
      }

      function X(e) {
        x["delete"](V.get(e));
        I.push(e);
      }

      function U(e, t) {
        Z(typeof e !== "undefined");
        return k(e, t);
      }

      function j(e) {
        X(e);
      }

      var B;
      if (n["wasmBinary"]) B = n["wasmBinary"];
      if (!Object.getOwnPropertyDescriptor(n, "wasmBinary")) Object.defineProperty(n, "wasmBinary", {
        configurable: true,
        get: function get() {
          _t("Module.wasmBinary has been replaced with plain wasmBinary (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      if (n["noExitRuntime"]) n["noExitRuntime"];
      if (!Object.getOwnPropertyDescriptor(n, "noExitRuntime")) Object.defineProperty(n, "noExitRuntime", {
        configurable: true,
        get: function get() {
          _t("Module.noExitRuntime has been replaced with plain noExitRuntime (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });

      if ((typeof WebAssembly === "undefined" ? "undefined" : _typeof(WebAssembly)) !== "object") {
        _t("no native wasm support detected");
      }

      function W(e, t, r, n) {
        r = r || "i8";
        if (r.charAt(r.length - 1) === "*") r = "i32";

        switch (r) {
          case "i1":
            Pe[e >> 0] = t;
            break;

          case "i8":
            Pe[e >> 0] = t;
            break;

          case "i16":
            Ne[e >> 1] = t;
            break;

          case "i32":
            xe[e >> 2] = t;
            break;

          case "i64":
            Pt = [t >>> 0, (Mt = t, +Math.abs(Mt) >= 1 ? Mt > 0 ? (Math.min(+Math.floor(Mt / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((Mt - +(~~Mt >>> 0)) / 4294967296) >>> 0 : 0)], xe[e >> 2] = Pt[0], xe[e + 4 >> 2] = Pt[1];
            break;

          case "float":
            Xe[e >> 2] = t;
            break;

          case "double":
            Ue[e >> 3] = t;
            break;

          default:
            _t("invalid type for setValue: " + r);

        }
      }

      function G(e, t, r) {
        t = t || "i8";
        if (t.charAt(t.length - 1) === "*") t = "i32";

        switch (t) {
          case "i1":
            return Pe[e >> 0];

          case "i8":
            return Pe[e >> 0];

          case "i16":
            return Ne[e >> 1];

          case "i32":
            return xe[e >> 2];

          case "i64":
            return xe[e >> 2];

          case "float":
            return Xe[e >> 2];

          case "double":
            return Ue[e >> 3];

          default:
            _t("invalid type for getValue: " + t);

        }

        return null;
      }

      var Y;
      var V;
      var K = false;

      function Z(e, t) {
        if (!e) {
          _t("Assertion failed: " + t);
        }
      }

      function $(e) {
        var t = n["_" + e];
        Z(t, "Cannot call unknown function " + e + ", make sure it is exported");
        return t;
      }

      function ee(e, t, r, n, o) {
        var i = {
          string: function string(e) {
            var t = 0;

            if (e !== null && e !== undefined && e !== 0) {
              var r = (e.length << 2) + 1;
              t = eo(r);
              ce(e, t, r);
            }

            return t;
          },
          array: function array(e) {
            var t = eo(e.length);
            Oe(e, t);
            return t;
          }
        };

        function a(e) {
          if (t === "string") return se(e);
          if (t === "boolean") return Boolean(e);
          return e;
        }

        var s = $(e);
        var u = [];
        var c = 0;
        Z(t !== "array", 'Return type should not be "array".');

        if (n) {
          for (var f = 0; f < n.length; f++) {
            var l = i[r[f]];

            if (l) {
              if (c === 0) c = Zn();
              u[f] = l(n[f]);
            } else {
              u[f] = n[f];
            }
          }
        }

        var d = s.apply(null, u);
        d = a(d);
        if (c !== 0) $n(c);
        return d;
      }

      function te(e, t, r, n) {
        return function () {
          return ee(e, t, r, arguments);
        };
      }

      var re = 0;
      var ne = 1;

      function oe(e, t) {
        var r;
        Z(typeof t === "number", "allocate no longer takes a type argument");
        Z(typeof e !== "number", "allocate no longer takes a number as arg0");

        if (t == ne) {
          r = eo(e.length);
        } else {
          r = zn(e.length);
        }

        if (e.subarray || e.slice) {
          Fe.set(e, r);
        } else {
          Fe.set(new Uint8Array(e), r);
        }

        return r;
      }

      var ie = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;

      function ae(e, t, r) {
        var n = t + r;
        var o = t;

        while (e[o] && !(o >= n)) {
          ++o;
        }

        if (o - t > 16 && e.subarray && ie) {
          return ie.decode(e.subarray(t, o));
        } else {
          var i = "";

          while (t < o) {
            var a = e[t++];

            if (!(a & 128)) {
              i += String.fromCharCode(a);
              continue;
            }

            var s = e[t++] & 63;

            if ((a & 224) == 192) {
              i += String.fromCharCode((a & 31) << 6 | s);
              continue;
            }

            var u = e[t++] & 63;

            if ((a & 240) == 224) {
              a = (a & 15) << 12 | s << 6 | u;
            } else {
              if ((a & 248) != 240) F("Invalid UTF-8 leading byte 0x" + a.toString(16) + " encountered when deserializing a UTF-8 string on the asm.js/wasm heap to a JS string!");
              a = (a & 7) << 18 | s << 12 | u << 6 | e[t++] & 63;
            }

            if (a < 65536) {
              i += String.fromCharCode(a);
            } else {
              var c = a - 65536;
              i += String.fromCharCode(55296 | c >> 10, 56320 | c & 1023);
            }
          }
        }

        return i;
      }

      function se(e, t) {
        return e ? ae(Fe, e, t) : "";
      }

      function ue(e, t, r, n) {
        if (!(n > 0)) return 0;
        var o = r;
        var i = r + n - 1;

        for (var a = 0; a < e.length; ++a) {
          var s = e.charCodeAt(a);

          if (s >= 55296 && s <= 57343) {
            var u = e.charCodeAt(++a);
            s = 65536 + ((s & 1023) << 10) | u & 1023;
          }

          if (s <= 127) {
            if (r >= i) break;
            t[r++] = s;
          } else if (s <= 2047) {
            if (r + 1 >= i) break;
            t[r++] = 192 | s >> 6;
            t[r++] = 128 | s & 63;
          } else if (s <= 65535) {
            if (r + 2 >= i) break;
            t[r++] = 224 | s >> 12;
            t[r++] = 128 | s >> 6 & 63;
            t[r++] = 128 | s & 63;
          } else {
            if (r + 3 >= i) break;
            if (s >= 2097152) F("Invalid Unicode code point 0x" + s.toString(16) + " encountered when serializing a JS string to an UTF-8 string on the asm.js/wasm heap! (Valid unicode code points should be in range 0-0x1FFFFF).");
            t[r++] = 240 | s >> 18;
            t[r++] = 128 | s >> 12 & 63;
            t[r++] = 128 | s >> 6 & 63;
            t[r++] = 128 | s & 63;
          }
        }

        t[r] = 0;
        return r - o;
      }

      function ce(e, t, r) {
        Z(typeof r == "number", "stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!");
        return ue(e, Fe, t, r);
      }

      function fe(e) {
        var t = 0;

        for (var r = 0; r < e.length; ++r) {
          var n = e.charCodeAt(r);
          if (n >= 55296 && n <= 57343) n = 65536 + ((n & 1023) << 10) | e.charCodeAt(++r) & 1023;
          if (n <= 127) ++t;else if (n <= 2047) t += 2;else if (n <= 65535) t += 3;else t += 4;
        }

        return t;
      }

      var pe = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;

      function ge(e) {
        var t = fe(e) + 1;
        var r = zn(t);
        if (r) ue(e, Pe, r, t);
        return r;
      }

      function we(e) {
        var t = fe(e) + 1;
        var r = eo(t);
        ue(e, Pe, r, t);
        return r;
      }

      function Oe(e, t) {
        Z(e.length >= 0, "writeArrayToMemory array must have a length (should be an array or typed array)");
        Pe.set(e, t);
      }

      function be(e, t, r) {
        for (var n = 0; n < e.length; ++n) {
          Z(e.charCodeAt(n) === e.charCodeAt(n) & 255);
          Pe[t++ >> 0] = e.charCodeAt(n);
        }

        if (!r) Pe[t >> 0] = 0;
      }
      var Re = 65536;

      function Ae(e, t) {
        if (e % t > 0) {
          e += t - e % t;
        }

        return e;
      }

      var Me, Pe, Fe, Ne, xe, ke, Xe, Ue;

      function je(e) {
        Me = e;
        n["HEAP8"] = Pe = new Int8Array(e);
        n["HEAP16"] = Ne = new Int16Array(e);
        n["HEAP32"] = xe = new Int32Array(e);
        n["HEAPU8"] = Fe = new Uint8Array(e);
        n["HEAPU16"] = new Uint16Array(e);
        n["HEAPU32"] = ke = new Uint32Array(e);
        n["HEAPF32"] = Xe = new Float32Array(e);
        n["HEAPF64"] = Ue = new Float64Array(e);
      }

      var Le = 5307792,
          Ce = 64912;
      Z(Le % 16 === 0, "stack must start aligned");
      var qe = 5242880;
      if (n["TOTAL_STACK"]) Z(qe === n["TOTAL_STACK"], "the stack size can no longer be determined at runtime");
      var Qe = n["INITIAL_MEMORY"] || 16777216;
      if (!Object.getOwnPropertyDescriptor(n, "INITIAL_MEMORY")) Object.defineProperty(n, "INITIAL_MEMORY", {
        configurable: true,
        get: function get() {
          _t("Module.INITIAL_MEMORY has been replaced with plain INITIAL_INITIAL_MEMORY (the initial value can be provided on Module, but after startup the value is only looked for on a local variable of that name)");
        }
      });
      Z(Qe >= qe, "INITIAL_MEMORY should be larger than TOTAL_STACK, was " + Qe + "! (TOTAL_STACK=" + qe + ")");
      Z(typeof Int32Array !== "undefined" && typeof Float64Array !== "undefined" && Int32Array.prototype.subarray !== undefined && Int32Array.prototype.set !== undefined, "JS engine does not provide full typed array support");

      if (n["wasmMemory"]) {
        Y = n["wasmMemory"];
      } else {
        Y = new WebAssembly.Memory({
          initial: Qe / Re,
          maximum: 2147483648 / Re
        });
      }

      if (Y) {
        Me = Y.buffer;
      }

      Qe = Me.byteLength;
      Z(Qe % Re === 0);
      Z(65536 % Re === 0);
      je(Me);

      function Be() {
        Z((Ce & 3) == 0);
        ke[(Ce >> 2) + 1] = 34821223;
        ke[(Ce >> 2) + 2] = 2310721022;
        xe[0] = 1668509029;
      }

      function ze() {
        var e = ke[(Ce >> 2) + 1];
        var t = ke[(Ce >> 2) + 2];

        if (e != 34821223 || t != 2310721022) {
          _t("Stack overflow! Stack cookie has been overwritten, expected hex dwords 0x89BACDFE and 0x2135467, but received 0x" + t.toString(16) + " " + e.toString(16));
        }

        if (xe[0] !== 1668509029) _t("Runtime error: The application has corrupted its heap memory area (address zero)!");
      }

      (function () {
        var e = new Int16Array(1);
        var t = new Int8Array(e.buffer);
        e[0] = 25459;
        if (t[0] !== 115 || t[1] !== 99) throw "Runtime error: expected the system to be little-endian!";
      })();

      var Ge = [];
      var Ye = [];
      var Ve = [];
      var Je = [];
      var Ze = false;
      var $e = false;

      function et() {
        if (n["preRun"]) {
          if (typeof n["preRun"] == "function") n["preRun"] = [n["preRun"]];

          while (n["preRun"].length) {
            it(n["preRun"].shift());
          }
        }

        It(Ge);
      }

      function tt() {
        ze();
        Z(!Ze);
        Ze = true;
        if (!n["noFSInit"] && !$t.init.initialized) $t.init();
        Yt.init();
        It(Ye);
      }

      function rt() {
        ze();
        $t.ignorePermissions = false;
        It(Ve);
      }

      function ot() {
        ze();

        if (n["postRun"]) {
          if (typeof n["postRun"] == "function") n["postRun"] = [n["postRun"]];

          while (n["postRun"].length) {
            ct(n["postRun"].shift());
          }
        }

        It(Je);
      }

      function it(e) {
        Ge.unshift(e);
      }

      function ct(e) {
        Je.unshift(e);
      }

      Z(Math.imul, "This browser does not support Math.imul(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      Z(Math.fround, "This browser does not support Math.fround(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      Z(Math.clz32, "This browser does not support Math.clz32(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      Z(Math.trunc, "This browser does not support Math.trunc(), build with LEGACY_VM_SUPPORT or POLYFILL_OLD_MATH_FUNCTIONS to add in a polyfill");
      var ft = 0;
      var lt = null;
      var dt = null;
      var pt = {};

      function Et(e) {
        var t = e;

        while (1) {
          if (!pt[e]) return e;
          e = t + Math.random();
        }
      }

      function ht(e) {
        ft++;

        if (n["monitorRunDependencies"]) {
          n["monitorRunDependencies"](ft);
        }

        if (e) {
          Z(!pt[e]);
          pt[e] = 1;

          if (lt === null && typeof setInterval !== "undefined") {
            lt = setInterval(function () {
              if (K) {
                clearInterval(lt);
                lt = null;
                return;
              }

              var e = false;

              for (var t in pt) {
                if (!e) {
                  e = true;
                  O("still waiting on run dependencies:");
                }

                O("dependency: " + t);
              }

              if (e) {
                O("(end of list)");
              }
            }, 1e4);
          }
        } else {
          O("warning: run dependency added without ID");
        }
      }

      function mt(e) {
        ft--;

        if (n["monitorRunDependencies"]) {
          n["monitorRunDependencies"](ft);
        }

        if (e) {
          Z(pt[e]);
          delete pt[e];
        } else {
          O("warning: run dependency removed without ID");
        }

        if (ft == 0) {
          if (lt !== null) {
            clearInterval(lt);
            lt = null;
          }

          if (dt) {
            var t = dt;
            dt = null;
            t();
          }
        }
      }

      n["preloadedImages"] = {};
      n["preloadedAudios"] = {};

      function _t(e) {
        if (n["onAbort"]) {
          n["onAbort"](e);
        }

        e += "";
        O(e);
        K = true;
        var t = "abort(" + e + ") at " + Lt();
        e = t;
        var r = new WebAssembly.RuntimeError(e);
        throw r;
      }

      function Tt(e, t) {
        return String.prototype.startsWith ? e.startsWith(t) : e.indexOf(t) === 0;
      }

      var gt = "data:application/octet-stream;base64,";

      function wt(e) {
        return Tt(e, gt);
      }

      var yt = "file://";

      function Ot(e) {
        return Tt(e, yt);
      }

      function bt(e, t) {
        return function () {
          var r = e;
          var o = t;

          if (!t) {
            o = n["asm"];
          }

          Z(Ze, "native function `" + r + "` called before runtime initialization");
          Z(!$e, "native function `" + r + "` called after runtime exit (use NO_EXIT_RUNTIME to keep it alive after main() exits)");

          if (!o[e]) {
            Z(o[e], "exported native function `" + r + "` not found");
          }

          return o[e].apply(null, arguments);
        };
      }

      var Dt = "sql-wasm-debug.wasm";

      if (!wt(Dt)) {
        Dt = h(Dt);
      }

      function Rt() {
        try {
          if (B) {
            return new Uint8Array(B);
          }

          if (v) {
            return v(Dt);
          } else {
            throw "both async and sync fetching of the wasm failed";
          }
        } catch (e) {
          _t(e);
        }
      }

      function At() {
        if (!B && (f || l) && typeof fetch === "function" && !Ot(Dt)) {
          return fetch(Dt, {
            credentials: "same-origin"
          }).then(function (e) {
            if (!e["ok"]) {
              throw "failed to load wasm binary file at '" + Dt + "'";
            }

            return e["arrayBuffer"]();
          })["catch"](function () {
            return Rt();
          });
        }

        return Promise.resolve().then(Rt);
      }

      function St() {
        var e = {
          env: $r,
          wasi_snapshot_preview1: $r
        };

        function t(e, t) {
          var r = e.exports;
          n["asm"] = r;
          V = n["asm"]["__indirect_function_table"];
          Z(V, "table not found in wasm exports");
          mt("wasm-instantiate");
        }

        ht("wasm-instantiate");
        var r = n;

        function o(e) {
          Z(n === r, "the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?");
          r = null;
          t(e["instance"]);
        }

        function i(t) {
          return At().then(function (t) {
            return WebAssembly.instantiate(t, e);
          }).then(t, function (e) {
            O("failed to asynchronously prepare wasm: " + e);

            _t(e);
          });
        }

        function a() {
          if (!B && typeof WebAssembly.instantiateStreaming === "function" && !wt(Dt) && !Ot(Dt) && typeof fetch === "function") {
            fetch(Dt, {
              credentials: "same-origin"
            }).then(function (t) {
              var r = WebAssembly.instantiateStreaming(t, e);
              return r.then(o, function (e) {
                O("wasm streaming compile failed: " + e);
                O("falling back to ArrayBuffer instantiation");
                return i(o);
              });
            });
          } else {
            return i(o);
          }
        }

        if (n["instantiateWasm"]) {
          try {
            var s = n["instantiateWasm"](e, t);
            return s;
          } catch (e) {
            O("Module.instantiateWasm callback failed with error: " + e);
            return false;
          }
        }

        a();
        return {};
      }

      var Mt;
      var Pt;

      function It(e) {
        while (e.length > 0) {
          var t = e.shift();

          if (typeof t == "function") {
            t(n);
            continue;
          }

          var r = t.func;

          if (typeof r === "number") {
            if (t.arg === undefined) {
              V.get(r)();
            } else {
              V.get(r)(t.arg);
            }
          } else {
            r(t.arg === undefined ? null : t.arg);
          }
        }
      }

      function xt(e) {
        F("warning: build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling");
        return e;
      }

      function kt(e) {
        var t = /\b_Z[\w\d_]+/g;
        return e.replace(t, function (e) {
          var t = xt(e);
          return e === t ? e : t + " [" + e + "]";
        });
      }

      function jt() {
        var e = new Error();

        if (!e.stack) {
          try {
            throw new Error();
          } catch (t) {
            e = t;
          }

          if (!e.stack) {
            return "(no stack trace available)";
          }
        }

        return e.stack.toString();
      }

      function Lt() {
        var e = jt();
        if (n["extraStackTrace"]) e += "\n" + n["extraStackTrace"]();
        return kt(e);
      }

      function Ht(e, t, r, n) {
        _t("Assertion failed: " + se(e) + ", at: " + [t ? se(t) : "unknown filename", r, n ? se(n) : "unknown function"]);
      }

      function Ct() {
        if (Ct.called) return;
        Ct.called = true;
        xe[Jn() >> 2] = new Date().getTimezoneOffset() * 60;
        var e = new Date().getFullYear();
        var t = new Date(e, 0, 1);
        var r = new Date(e, 6, 1);
        xe[Kn() >> 2] = Number(t.getTimezoneOffset() != r.getTimezoneOffset());

        function n(e) {
          var t = e.toTimeString().match(/\(([A-Za-z ]+)\)$/);
          return t ? t[1] : "GMT";
        }

        var o = n(t);
        var i = n(r);
        var a = ge(o);
        var s = ge(i);

        if (r.getTimezoneOffset() < t.getTimezoneOffset()) {
          xe[Vn() >> 2] = a;
          xe[Vn() + 4 >> 2] = s;
        } else {
          xe[Vn() >> 2] = s;
          xe[Vn() + 4 >> 2] = a;
        }
      }

      function qt(e, t) {
        Ct();
        var r = new Date(xe[e >> 2] * 1e3);
        xe[t >> 2] = r.getSeconds();
        xe[t + 4 >> 2] = r.getMinutes();
        xe[t + 8 >> 2] = r.getHours();
        xe[t + 12 >> 2] = r.getDate();
        xe[t + 16 >> 2] = r.getMonth();
        xe[t + 20 >> 2] = r.getFullYear() - 1900;
        xe[t + 24 >> 2] = r.getDay();
        var n = new Date(r.getFullYear(), 0, 1);
        var o = (r.getTime() - n.getTime()) / (1e3 * 60 * 60 * 24) | 0;
        xe[t + 28 >> 2] = o;
        xe[t + 36 >> 2] = -(r.getTimezoneOffset() * 60);
        var i = new Date(r.getFullYear(), 6, 1).getTimezoneOffset();
        var a = n.getTimezoneOffset();
        var s = (i != a && r.getTimezoneOffset() == Math.min(a, i)) | 0;
        xe[t + 32 >> 2] = s;
        var u = xe[Vn() + (s ? 4 : 0) >> 2];
        xe[t + 40 >> 2] = u;
        return t;
      }

      function Qt(e, t) {
        return qt(e, t);
      }

      var Bt = {
        splitPath: function splitPath(e) {
          var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
          return t.exec(e).slice(1);
        },
        normalizeArray: function normalizeArray(e, t) {
          var r = 0;

          for (var n = e.length - 1; n >= 0; n--) {
            var o = e[n];

            if (o === ".") {
              e.splice(n, 1);
            } else if (o === "..") {
              e.splice(n, 1);
              r++;
            } else if (r) {
              e.splice(n, 1);
              r--;
            }
          }

          if (t) {
            for (; r; r--) {
              e.unshift("..");
            }
          }

          return e;
        },
        normalize: function normalize(e) {
          var t = e.charAt(0) === "/",
              r = e.substr(-1) === "/";
          e = Bt.normalizeArray(e.split("/").filter(function (e) {
            return !!e;
          }), !t).join("/");

          if (!e && !t) {
            e = ".";
          }

          if (e && r) {
            e += "/";
          }

          return (t ? "/" : "") + e;
        },
        dirname: function dirname(e) {
          var t = Bt.splitPath(e),
              r = t[0],
              n = t[1];

          if (!r && !n) {
            return ".";
          }

          if (n) {
            n = n.substr(0, n.length - 1);
          }

          return r + n;
        },
        basename: function basename(e) {
          if (e === "/") return "/";
          e = Bt.normalize(e);
          e = e.replace(/\/$/, "");
          var t = e.lastIndexOf("/");
          if (t === -1) return e;
          return e.substr(t + 1);
        },
        extname: function extname(e) {
          return Bt.splitPath(e)[3];
        },
        join: function join() {
          var e = Array.prototype.slice.call(arguments, 0);
          return Bt.normalize(e.join("/"));
        },
        join2: function join2(e, t) {
          return Bt.normalize(e + "/" + t);
        }
      };

      function zt(e) {
        xe[on() >> 2] = e;
        return e;
      }

      function Wt() {
        if ((typeof crypto === "undefined" ? "undefined" : _typeof(crypto)) === "object" && typeof crypto["getRandomValues"] === "function") {
          var e = new Uint8Array(1);
          return function () {
            crypto.getRandomValues(e);
            return e[0];
          };
        } else if (d) {
          try {
            var t = require("crypto");

            return function () {
              return t["randomBytes"](1)[0];
            };
          } catch (e) {}
        }

        return function () {
          _t("no cryptographic support found for randomDevice. consider polyfilling it if you want to use something insecure like Math.random(), e.g. put this in a --pre-js: var crypto = { getRandomValues: function(array) { for (var i = 0; i < array.length; i++) array[i] = (Math.random()*256)|0 } };");
        };
      }

      var Gt = {
        resolve: function resolve() {
          var e = "",
              t = false;

          for (var r = arguments.length - 1; r >= -1 && !t; r--) {
            var n = r >= 0 ? arguments[r] : $t.cwd();

            if (typeof n !== "string") {
              throw new TypeError("Arguments to path.resolve must be strings");
            } else if (!n) {
              return "";
            }

            e = n + "/" + e;
            t = n.charAt(0) === "/";
          }

          e = Bt.normalizeArray(e.split("/").filter(function (e) {
            return !!e;
          }), !t).join("/");
          return (t ? "/" : "") + e || ".";
        },
        relative: function relative(e, t) {
          e = Gt.resolve(e).substr(1);
          t = Gt.resolve(t).substr(1);

          function r(e) {
            var t = 0;

            for (; t < e.length; t++) {
              if (e[t] !== "") break;
            }

            var r = e.length - 1;

            for (; r >= 0; r--) {
              if (e[r] !== "") break;
            }

            if (t > r) return [];
            return e.slice(t, r - t + 1);
          }

          var n = r(e.split("/"));
          var o = r(t.split("/"));
          var i = Math.min(n.length, o.length);
          var a = i;

          for (var s = 0; s < i; s++) {
            if (n[s] !== o[s]) {
              a = s;
              break;
            }
          }

          var u = [];

          for (var s = a; s < n.length; s++) {
            u.push("..");
          }

          u = u.concat(o.slice(a));
          return u.join("/");
        }
      };
      var Yt = {
        ttys: [],
        init: function init() {},
        shutdown: function shutdown() {},
        register: function register(e, t) {
          Yt.ttys[e] = {
            input: [],
            output: [],
            ops: t
          };
          $t.registerDevice(e, Yt.stream_ops);
        },
        stream_ops: {
          open: function open(e) {
            var t = Yt.ttys[e.node.rdev];

            if (!t) {
              throw new $t.ErrnoError(43);
            }

            e.tty = t;
            e.seekable = false;
          },
          close: function close(e) {
            e.tty.ops.flush(e.tty);
          },
          flush: function flush(e) {
            e.tty.ops.flush(e.tty);
          },
          read: function read(e, t, r, n, o) {
            if (!e.tty || !e.tty.ops.get_char) {
              throw new $t.ErrnoError(60);
            }

            var i = 0;

            for (var a = 0; a < n; a++) {
              var s;

              try {
                s = e.tty.ops.get_char(e.tty);
              } catch (e) {
                throw new $t.ErrnoError(29);
              }

              if (s === undefined && i === 0) {
                throw new $t.ErrnoError(6);
              }

              if (s === null || s === undefined) break;
              i++;
              t[r + a] = s;
            }

            if (i) {
              e.node.timestamp = Date.now();
            }

            return i;
          },
          write: function write(e, t, r, n, o) {
            if (!e.tty || !e.tty.ops.put_char) {
              throw new $t.ErrnoError(60);
            }

            try {
              for (var i = 0; i < n; i++) {
                e.tty.ops.put_char(e.tty, t[r + i]);
              }
            } catch (e) {
              throw new $t.ErrnoError(29);
            }

            if (n) {
              e.node.timestamp = Date.now();
            }

            return i;
          }
        },
        default_tty_ops: {
          get_char: function get_char(e) {
            if (!e.input.length) {
              var t = null;

              if (d) {
                var r = 256;
                var n = Buffer.alloc ? Buffer.alloc(r) : new Buffer(r);
                var o = 0;

                try {
                  o = g.readSync(process.stdin.fd, n, 0, r, null);
                } catch (e) {
                  if (e.toString().indexOf("EOF") != -1) o = 0;else throw e;
                }

                if (o > 0) {
                  t = n.slice(0, o).toString("utf-8");
                } else {
                  t = null;
                }
              } else if (typeof window != "undefined" && typeof window.prompt == "function") {
                t = window.prompt("Input: ");

                if (t !== null) {
                  t += "\n";
                }
              } else if (typeof readline == "function") {
                t = readline();

                if (t !== null) {
                  t += "\n";
                }
              }

              if (!t) {
                return null;
              }

              e.input = Jr(t, true);
            }

            return e.input.shift();
          },
          put_char: function put_char(e, t) {
            if (t === null || t === 10) {
              y(ae(e.output, 0));
              e.output = [];
            } else {
              if (t != 0) e.output.push(t);
            }
          },
          flush: function flush(e) {
            if (e.output && e.output.length > 0) {
              y(ae(e.output, 0));
              e.output = [];
            }
          }
        },
        default_tty1_ops: {
          put_char: function put_char(e, t) {
            if (t === null || t === 10) {
              O(ae(e.output, 0));
              e.output = [];
            } else {
              if (t != 0) e.output.push(t);
            }
          },
          flush: function flush(e) {
            if (e.output && e.output.length > 0) {
              O(ae(e.output, 0));
              e.output = [];
            }
          }
        }
      };

      function Vt(e) {
        var t = M(e, 16384);
        var r = zn(t);

        while (e < t) {
          Pe[r + e++] = 0;
        }

        return r;
      }

      var Kt = {
        ops_table: null,
        mount: function mount(e) {
          return Kt.createNode(null, "/", 16384 | 511, 0);
        },
        createNode: function createNode(e, t, r, n) {
          if ($t.isBlkdev(r) || $t.isFIFO(r)) {
            throw new $t.ErrnoError(63);
          }

          if (!Kt.ops_table) {
            Kt.ops_table = {
              dir: {
                node: {
                  getattr: Kt.node_ops.getattr,
                  setattr: Kt.node_ops.setattr,
                  lookup: Kt.node_ops.lookup,
                  mknod: Kt.node_ops.mknod,
                  rename: Kt.node_ops.rename,
                  unlink: Kt.node_ops.unlink,
                  rmdir: Kt.node_ops.rmdir,
                  readdir: Kt.node_ops.readdir,
                  symlink: Kt.node_ops.symlink
                },
                stream: {
                  llseek: Kt.stream_ops.llseek
                }
              },
              file: {
                node: {
                  getattr: Kt.node_ops.getattr,
                  setattr: Kt.node_ops.setattr
                },
                stream: {
                  llseek: Kt.stream_ops.llseek,
                  read: Kt.stream_ops.read,
                  write: Kt.stream_ops.write,
                  allocate: Kt.stream_ops.allocate,
                  mmap: Kt.stream_ops.mmap,
                  msync: Kt.stream_ops.msync
                }
              },
              link: {
                node: {
                  getattr: Kt.node_ops.getattr,
                  setattr: Kt.node_ops.setattr,
                  readlink: Kt.node_ops.readlink
                },
                stream: {}
              },
              chrdev: {
                node: {
                  getattr: Kt.node_ops.getattr,
                  setattr: Kt.node_ops.setattr
                },
                stream: $t.chrdev_stream_ops
              }
            };
          }

          var o = $t.createNode(e, t, r, n);

          if ($t.isDir(o.mode)) {
            o.node_ops = Kt.ops_table.dir.node;
            o.stream_ops = Kt.ops_table.dir.stream;
            o.contents = {};
          } else if ($t.isFile(o.mode)) {
            o.node_ops = Kt.ops_table.file.node;
            o.stream_ops = Kt.ops_table.file.stream;
            o.usedBytes = 0;
            o.contents = null;
          } else if ($t.isLink(o.mode)) {
            o.node_ops = Kt.ops_table.link.node;
            o.stream_ops = Kt.ops_table.link.stream;
          } else if ($t.isChrdev(o.mode)) {
            o.node_ops = Kt.ops_table.chrdev.node;
            o.stream_ops = Kt.ops_table.chrdev.stream;
          }

          o.timestamp = Date.now();

          if (e) {
            e.contents[t] = o;
          }

          return o;
        },
        getFileDataAsRegularArray: function getFileDataAsRegularArray(e) {
          if (e.contents && e.contents.subarray) {
            var t = [];

            for (var r = 0; r < e.usedBytes; ++r) {
              t.push(e.contents[r]);
            }

            return t;
          }

          return e.contents;
        },
        getFileDataAsTypedArray: function getFileDataAsTypedArray(e) {
          if (!e.contents) return new Uint8Array(0);
          if (e.contents.subarray) return e.contents.subarray(0, e.usedBytes);
          return new Uint8Array(e.contents);
        },
        expandFileStorage: function expandFileStorage(e, t) {
          var r = e.contents ? e.contents.length : 0;
          if (r >= t) return;
          var n = 1024 * 1024;
          t = Math.max(t, r * (r < n ? 2 : 1.125) >>> 0);
          if (r != 0) t = Math.max(t, 256);
          var o = e.contents;
          e.contents = new Uint8Array(t);
          if (e.usedBytes > 0) e.contents.set(o.subarray(0, e.usedBytes), 0);
          return;
        },
        resizeFileStorage: function resizeFileStorage(e, t) {
          if (e.usedBytes == t) return;

          if (t == 0) {
            e.contents = null;
            e.usedBytes = 0;
            return;
          }

          if (!e.contents || e.contents.subarray) {
            var r = e.contents;
            e.contents = new Uint8Array(t);

            if (r) {
              e.contents.set(r.subarray(0, Math.min(t, e.usedBytes)));
            }

            e.usedBytes = t;
            return;
          }

          if (!e.contents) e.contents = [];
          if (e.contents.length > t) e.contents.length = t;else while (e.contents.length < t) {
            e.contents.push(0);
          }
          e.usedBytes = t;
        },
        node_ops: {
          getattr: function getattr(e) {
            var t = {};
            t.dev = $t.isChrdev(e.mode) ? e.id : 1;
            t.ino = e.id;
            t.mode = e.mode;
            t.nlink = 1;
            t.uid = 0;
            t.gid = 0;
            t.rdev = e.rdev;

            if ($t.isDir(e.mode)) {
              t.size = 4096;
            } else if ($t.isFile(e.mode)) {
              t.size = e.usedBytes;
            } else if ($t.isLink(e.mode)) {
              t.size = e.link.length;
            } else {
              t.size = 0;
            }

            t.atime = new Date(e.timestamp);
            t.mtime = new Date(e.timestamp);
            t.ctime = new Date(e.timestamp);
            t.blksize = 4096;
            t.blocks = Math.ceil(t.size / t.blksize);
            return t;
          },
          setattr: function setattr(e, t) {
            if (t.mode !== undefined) {
              e.mode = t.mode;
            }

            if (t.timestamp !== undefined) {
              e.timestamp = t.timestamp;
            }

            if (t.size !== undefined) {
              Kt.resizeFileStorage(e, t.size);
            }
          },
          lookup: function lookup(e, t) {
            throw $t.genericErrors[44];
          },
          mknod: function mknod(e, t, r, n) {
            return Kt.createNode(e, t, r, n);
          },
          rename: function rename(e, t, r) {
            if ($t.isDir(e.mode)) {
              var n;

              try {
                n = $t.lookupNode(t, r);
              } catch (e) {}

              if (n) {
                for (var o in n.contents) {
                  throw new $t.ErrnoError(55);
                }
              }
            }

            delete e.parent.contents[e.name];
            e.name = r;
            t.contents[r] = e;
            e.parent = t;
          },
          unlink: function unlink(e, t) {
            delete e.contents[t];
          },
          rmdir: function rmdir(e, t) {
            var r = $t.lookupNode(e, t);

            for (var n in r.contents) {
              throw new $t.ErrnoError(55);
            }

            delete e.contents[t];
          },
          readdir: function readdir(e) {
            var t = [".", ".."];

            for (var r in e.contents) {
              if (!e.contents.hasOwnProperty(r)) {
                continue;
              }

              t.push(r);
            }

            return t;
          },
          symlink: function symlink(e, t, r) {
            var n = Kt.createNode(e, t, 511 | 40960, 0);
            n.link = r;
            return n;
          },
          readlink: function readlink(e) {
            if (!$t.isLink(e.mode)) {
              throw new $t.ErrnoError(28);
            }

            return e.link;
          }
        },
        stream_ops: {
          read: function read(e, t, r, n, o) {
            var i = e.node.contents;
            if (o >= e.node.usedBytes) return 0;
            var a = Math.min(e.node.usedBytes - o, n);
            Z(a >= 0);

            if (a > 8 && i.subarray) {
              t.set(i.subarray(o, o + a), r);
            } else {
              for (var s = 0; s < a; s++) {
                t[r + s] = i[o + s];
              }
            }

            return a;
          },
          write: function write(e, t, r, n, o, i) {
            Z(!(t instanceof ArrayBuffer));

            if (t.buffer === Pe.buffer) {
              i = false;
            }

            if (!n) return 0;
            var a = e.node;
            a.timestamp = Date.now();

            if (t.subarray && (!a.contents || a.contents.subarray)) {
              if (i) {
                Z(o === 0, "canOwn must imply no weird position inside the file");
                a.contents = t.subarray(r, r + n);
                a.usedBytes = n;
                return n;
              } else if (a.usedBytes === 0 && o === 0) {
                a.contents = t.slice(r, r + n);
                a.usedBytes = n;
                return n;
              } else if (o + n <= a.usedBytes) {
                a.contents.set(t.subarray(r, r + n), o);
                return n;
              }
            }

            Kt.expandFileStorage(a, o + n);

            if (a.contents.subarray && t.subarray) {
              a.contents.set(t.subarray(r, r + n), o);
            } else {
              for (var s = 0; s < n; s++) {
                a.contents[o + s] = t[r + s];
              }
            }

            a.usedBytes = Math.max(a.usedBytes, o + n);
            return n;
          },
          llseek: function llseek(e, t, r) {
            var n = t;

            if (r === 1) {
              n += e.position;
            } else if (r === 2) {
              if ($t.isFile(e.node.mode)) {
                n += e.node.usedBytes;
              }
            }

            if (n < 0) {
              throw new $t.ErrnoError(28);
            }

            return n;
          },
          allocate: function allocate(e, t, r) {
            Kt.expandFileStorage(e.node, t + r);
            e.node.usedBytes = Math.max(e.node.usedBytes, t + r);
          },
          mmap: function mmap(e, t, r, n, o, i) {
            Z(t === 0);

            if (!$t.isFile(e.node.mode)) {
              throw new $t.ErrnoError(43);
            }

            var a;
            var s;
            var u = e.node.contents;

            if (!(i & 2) && u.buffer === Me) {
              s = false;
              a = u.byteOffset;
            } else {
              if (n > 0 || n + r < u.length) {
                if (u.subarray) {
                  u = u.subarray(n, n + r);
                } else {
                  u = Array.prototype.slice.call(u, n, n + r);
                }
              }

              s = true;
              a = Vt(r);

              if (!a) {
                throw new $t.ErrnoError(48);
              }

              Pe.set(u, a);
            }

            return {
              ptr: a,
              allocated: s
            };
          },
          msync: function msync(e, t, r, n, o) {
            if (!$t.isFile(e.node.mode)) {
              throw new $t.ErrnoError(43);
            }

            if (o & 2) {
              return 0;
            }

            var i = Kt.stream_ops.write(e, t, 0, n, r, false);
            return 0;
          }
        }
      };
      var Jt = {
        0: "Success",
        1: "Arg list too long",
        2: "Permission denied",
        3: "Address already in use",
        4: "Address not available",
        5: "Address family not supported by protocol family",
        6: "No more processes",
        7: "Socket already connected",
        8: "Bad file number",
        9: "Trying to read unreadable message",
        10: "Mount device busy",
        11: "Operation canceled",
        12: "No children",
        13: "Connection aborted",
        14: "Connection refused",
        15: "Connection reset by peer",
        16: "File locking deadlock error",
        17: "Destination address required",
        18: "Math arg out of domain of func",
        19: "Quota exceeded",
        20: "File exists",
        21: "Bad address",
        22: "File too large",
        23: "Host is unreachable",
        24: "Identifier removed",
        25: "Illegal byte sequence",
        26: "Connection already in progress",
        27: "Interrupted system call",
        28: "Invalid argument",
        29: "I/O error",
        30: "Socket is already connected",
        31: "Is a directory",
        32: "Too many symbolic links",
        33: "Too many open files",
        34: "Too many links",
        35: "Message too long",
        36: "Multihop attempted",
        37: "File or path name too long",
        38: "Network interface is not configured",
        39: "Connection reset by network",
        40: "Network is unreachable",
        41: "Too many open files in system",
        42: "No buffer space available",
        43: "No such device",
        44: "No such file or directory",
        45: "Exec format error",
        46: "No record locks available",
        47: "The link has been severed",
        48: "Not enough core",
        49: "No message of desired type",
        50: "Protocol not available",
        51: "No space left on device",
        52: "Function not implemented",
        53: "Socket is not connected",
        54: "Not a directory",
        55: "Directory not empty",
        56: "State not recoverable",
        57: "Socket operation on non-socket",
        59: "Not a typewriter",
        60: "No such device or address",
        61: "Value too large for defined data type",
        62: "Previous owner died",
        63: "Not super-user",
        64: "Broken pipe",
        65: "Protocol error",
        66: "Unknown protocol",
        67: "Protocol wrong type for socket",
        68: "Math result not representable",
        69: "Read only file system",
        70: "Illegal seek",
        71: "No such process",
        72: "Stale file handle",
        73: "Connection timed out",
        74: "Text file busy",
        75: "Cross-device link",
        100: "Device not a stream",
        101: "Bad font file fmt",
        102: "Invalid slot",
        103: "Invalid request code",
        104: "No anode",
        105: "Block device required",
        106: "Channel number out of range",
        107: "Level 3 halted",
        108: "Level 3 reset",
        109: "Link number out of range",
        110: "Protocol driver not attached",
        111: "No CSI structure available",
        112: "Level 2 halted",
        113: "Invalid exchange",
        114: "Invalid request descriptor",
        115: "Exchange full",
        116: "No data (for no delay io)",
        117: "Timer expired",
        118: "Out of streams resources",
        119: "Machine is not on the network",
        120: "Package not installed",
        121: "The object is remote",
        122: "Advertise error",
        123: "Srmount error",
        124: "Communication error on send",
        125: "Cross mount point (not really error)",
        126: "Given log. name not unique",
        127: "f.d. invalid for this operation",
        128: "Remote address changed",
        129: "Can   access a needed shared lib",
        130: "Accessing a corrupted shared lib",
        131: ".lib section in a.out corrupted",
        132: "Attempting to link in too many libs",
        133: "Attempting to exec a shared library",
        135: "Streams pipe error",
        136: "Too many users",
        137: "Socket type not supported",
        138: "Not supported",
        139: "Protocol family not supported",
        140: "Can't send after socket shutdown",
        141: "Too many references",
        142: "Host is down",
        148: "No medium (in tape drive)",
        156: "Level 2 not synchronized"
      };
      var Zt = {
        EPERM: 63,
        ENOENT: 44,
        ESRCH: 71,
        EINTR: 27,
        EIO: 29,
        ENXIO: 60,
        E2BIG: 1,
        ENOEXEC: 45,
        EBADF: 8,
        ECHILD: 12,
        EAGAIN: 6,
        EWOULDBLOCK: 6,
        ENOMEM: 48,
        EACCES: 2,
        EFAULT: 21,
        ENOTBLK: 105,
        EBUSY: 10,
        EEXIST: 20,
        EXDEV: 75,
        ENODEV: 43,
        ENOTDIR: 54,
        EISDIR: 31,
        EINVAL: 28,
        ENFILE: 41,
        EMFILE: 33,
        ENOTTY: 59,
        ETXTBSY: 74,
        EFBIG: 22,
        ENOSPC: 51,
        ESPIPE: 70,
        EROFS: 69,
        EMLINK: 34,
        EPIPE: 64,
        EDOM: 18,
        ERANGE: 68,
        ENOMSG: 49,
        EIDRM: 24,
        ECHRNG: 106,
        EL2NSYNC: 156,
        EL3HLT: 107,
        EL3RST: 108,
        ELNRNG: 109,
        EUNATCH: 110,
        ENOCSI: 111,
        EL2HLT: 112,
        EDEADLK: 16,
        ENOLCK: 46,
        EBADE: 113,
        EBADR: 114,
        EXFULL: 115,
        ENOANO: 104,
        EBADRQC: 103,
        EBADSLT: 102,
        EDEADLOCK: 16,
        EBFONT: 101,
        ENOSTR: 100,
        ENODATA: 116,
        ETIME: 117,
        ENOSR: 118,
        ENONET: 119,
        ENOPKG: 120,
        EREMOTE: 121,
        ENOLINK: 47,
        EADV: 122,
        ESRMNT: 123,
        ECOMM: 124,
        EPROTO: 65,
        EMULTIHOP: 36,
        EDOTDOT: 125,
        EBADMSG: 9,
        ENOTUNIQ: 126,
        EBADFD: 127,
        EREMCHG: 128,
        ELIBACC: 129,
        ELIBBAD: 130,
        ELIBSCN: 131,
        ELIBMAX: 132,
        ELIBEXEC: 133,
        ENOSYS: 52,
        ENOTEMPTY: 55,
        ENAMETOOLONG: 37,
        ELOOP: 32,
        EOPNOTSUPP: 138,
        EPFNOSUPPORT: 139,
        ECONNRESET: 15,
        ENOBUFS: 42,
        EAFNOSUPPORT: 5,
        EPROTOTYPE: 67,
        ENOTSOCK: 57,
        ENOPROTOOPT: 50,
        ESHUTDOWN: 140,
        ECONNREFUSED: 14,
        EADDRINUSE: 3,
        ECONNABORTED: 13,
        ENETUNREACH: 40,
        ENETDOWN: 38,
        ETIMEDOUT: 73,
        EHOSTDOWN: 142,
        EHOSTUNREACH: 23,
        EINPROGRESS: 26,
        EALREADY: 7,
        EDESTADDRREQ: 17,
        EMSGSIZE: 35,
        EPROTONOSUPPORT: 66,
        ESOCKTNOSUPPORT: 137,
        EADDRNOTAVAIL: 4,
        ENETRESET: 39,
        EISCONN: 30,
        ENOTCONN: 53,
        ETOOMANYREFS: 141,
        EUSERS: 136,
        EDQUOT: 19,
        ESTALE: 72,
        ENOTSUP: 138,
        ENOMEDIUM: 148,
        EILSEQ: 25,
        EOVERFLOW: 61,
        ECANCELED: 11,
        ENOTRECOVERABLE: 56,
        EOWNERDEAD: 62,
        ESTRPIPE: 135
      };
      var $t = {
        root: null,
        mounts: [],
        devices: {},
        streams: [],
        nextInode: 1,
        nameTable: null,
        currentPath: "/",
        initialized: false,
        ignorePermissions: true,
        trackingDelegate: {},
        tracking: {
          openFlags: {
            READ: 1,
            WRITE: 2
          }
        },
        ErrnoError: null,
        genericErrors: {},
        filesystems: null,
        syncFSRequests: 0,
        handleFSError: function handleFSError(e) {
          if (!(e instanceof $t.ErrnoError)) throw e + " : " + Lt();
          return zt(e.errno);
        },
        lookupPath: function lookupPath(e, t) {
          e = Gt.resolve($t.cwd(), e);
          t = t || {};
          if (!e) return {
            path: "",
            node: null
          };
          var r = {
            follow_mount: true,
            recurse_count: 0
          };

          for (var n in r) {
            if (t[n] === undefined) {
              t[n] = r[n];
            }
          }

          if (t.recurse_count > 8) {
            throw new $t.ErrnoError(32);
          }

          var o = Bt.normalizeArray(e.split("/").filter(function (e) {
            return !!e;
          }), false);
          var i = $t.root;
          var a = "/";

          for (var s = 0; s < o.length; s++) {
            var u = s === o.length - 1;

            if (u && t.parent) {
              break;
            }

            i = $t.lookupNode(i, o[s]);
            a = Bt.join2(a, o[s]);

            if ($t.isMountpoint(i)) {
              if (!u || u && t.follow_mount) {
                i = i.mounted.root;
              }
            }

            if (!u || t.follow) {
              var c = 0;

              while ($t.isLink(i.mode)) {
                var f = $t.readlink(a);
                a = Gt.resolve(Bt.dirname(a), f);
                var l = $t.lookupPath(a, {
                  recurse_count: t.recurse_count
                });
                i = l.node;

                if (c++ > 40) {
                  throw new $t.ErrnoError(32);
                }
              }
            }
          }

          return {
            path: a,
            node: i
          };
        },
        getPath: function getPath(e) {
          var t;

          while (true) {
            if ($t.isRoot(e)) {
              var r = e.mount.mountpoint;
              if (!t) return r;
              return r[r.length - 1] !== "/" ? r + "/" + t : r + t;
            }

            t = t ? e.name + "/" + t : e.name;
            e = e.parent;
          }
        },
        hashName: function hashName(e, t) {
          var r = 0;

          for (var n = 0; n < t.length; n++) {
            r = (r << 5) - r + t.charCodeAt(n) | 0;
          }

          return (e + r >>> 0) % $t.nameTable.length;
        },
        hashAddNode: function hashAddNode(e) {
          var t = $t.hashName(e.parent.id, e.name);
          e.name_next = $t.nameTable[t];
          $t.nameTable[t] = e;
        },
        hashRemoveNode: function hashRemoveNode(e) {
          var t = $t.hashName(e.parent.id, e.name);

          if ($t.nameTable[t] === e) {
            $t.nameTable[t] = e.name_next;
          } else {
            var r = $t.nameTable[t];

            while (r) {
              if (r.name_next === e) {
                r.name_next = e.name_next;
                break;
              }

              r = r.name_next;
            }
          }
        },
        lookupNode: function lookupNode(e, t) {
          var r = $t.mayLookup(e);

          if (r) {
            throw new $t.ErrnoError(r, e);
          }

          var n = $t.hashName(e.id, t);

          for (var o = $t.nameTable[n]; o; o = o.name_next) {
            var i = o.name;

            if (o.parent.id === e.id && i === t) {
              return o;
            }
          }

          return $t.lookup(e, t);
        },
        createNode: function createNode(e, t, r, n) {
          var o = new $t.FSNode(e, t, r, n);
          $t.hashAddNode(o);
          return o;
        },
        destroyNode: function destroyNode(e) {
          $t.hashRemoveNode(e);
        },
        isRoot: function isRoot(e) {
          return e === e.parent;
        },
        isMountpoint: function isMountpoint(e) {
          return !!e.mounted;
        },
        isFile: function isFile(e) {
          return (e & 61440) === 32768;
        },
        isDir: function isDir(e) {
          return (e & 61440) === 16384;
        },
        isLink: function isLink(e) {
          return (e & 61440) === 40960;
        },
        isChrdev: function isChrdev(e) {
          return (e & 61440) === 8192;
        },
        isBlkdev: function isBlkdev(e) {
          return (e & 61440) === 24576;
        },
        isFIFO: function isFIFO(e) {
          return (e & 61440) === 4096;
        },
        isSocket: function isSocket(e) {
          return (e & 49152) === 49152;
        },
        flagModes: {
          r: 0,
          rs: 1052672,
          "r+": 2,
          w: 577,
          wx: 705,
          xw: 705,
          "w+": 578,
          "wx+": 706,
          "xw+": 706,
          a: 1089,
          ax: 1217,
          xa: 1217,
          "a+": 1090,
          "ax+": 1218,
          "xa+": 1218
        },
        modeStringToFlags: function modeStringToFlags(e) {
          var t = $t.flagModes[e];

          if (typeof t === "undefined") {
            throw new Error("Unknown file open mode: " + e);
          }

          return t;
        },
        flagsToPermissionString: function flagsToPermissionString(e) {
          var t = ["r", "w", "rw"][e & 3];

          if (e & 512) {
            t += "w";
          }

          return t;
        },
        nodePermissions: function nodePermissions(e, t) {
          if ($t.ignorePermissions) {
            return 0;
          }

          if (t.indexOf("r") !== -1 && !(e.mode & 292)) {
            return 2;
          } else if (t.indexOf("w") !== -1 && !(e.mode & 146)) {
            return 2;
          } else if (t.indexOf("x") !== -1 && !(e.mode & 73)) {
            return 2;
          }

          return 0;
        },
        mayLookup: function mayLookup(e) {
          var t = $t.nodePermissions(e, "x");
          if (t) return t;
          if (!e.node_ops.lookup) return 2;
          return 0;
        },
        mayCreate: function mayCreate(e, t) {
          try {
            var r = $t.lookupNode(e, t);
            return 20;
          } catch (e) {}

          return $t.nodePermissions(e, "wx");
        },
        mayDelete: function mayDelete(e, t, r) {
          var n;

          try {
            n = $t.lookupNode(e, t);
          } catch (e) {
            return e.errno;
          }

          var o = $t.nodePermissions(e, "wx");

          if (o) {
            return o;
          }

          if (r) {
            if (!$t.isDir(n.mode)) {
              return 54;
            }

            if ($t.isRoot(n) || $t.getPath(n) === $t.cwd()) {
              return 10;
            }
          } else {
            if ($t.isDir(n.mode)) {
              return 31;
            }
          }

          return 0;
        },
        mayOpen: function mayOpen(e, t) {
          if (!e) {
            return 44;
          }

          if ($t.isLink(e.mode)) {
            return 32;
          } else if ($t.isDir(e.mode)) {
            if ($t.flagsToPermissionString(t) !== "r" || t & 512) {
              return 31;
            }
          }

          return $t.nodePermissions(e, $t.flagsToPermissionString(t));
        },
        MAX_OPEN_FDS: 4096,
        nextfd: function nextfd(e, t) {
          e = e || 0;
          t = t || $t.MAX_OPEN_FDS;

          for (var r = e; r <= t; r++) {
            if (!$t.streams[r]) {
              return r;
            }
          }

          throw new $t.ErrnoError(33);
        },
        getStream: function getStream(e) {
          return $t.streams[e];
        },
        createStream: function createStream(e, t, r) {
          if (!$t.FSStream) {
            $t.FSStream = function () {};

            $t.FSStream.prototype = {
              object: {
                get: function get() {
                  return this.node;
                },
                set: function set(e) {
                  this.node = e;
                }
              },
              isRead: {
                get: function get() {
                  return (this.flags & 2097155) !== 1;
                }
              },
              isWrite: {
                get: function get() {
                  return (this.flags & 2097155) !== 0;
                }
              },
              isAppend: {
                get: function get() {
                  return this.flags & 1024;
                }
              }
            };
          }

          var n = new $t.FSStream();

          for (var o in e) {
            n[o] = e[o];
          }

          e = n;
          var i = $t.nextfd(t, r);
          e.fd = i;
          $t.streams[i] = e;
          return e;
        },
        closeStream: function closeStream(e) {
          $t.streams[e] = null;
        },
        chrdev_stream_ops: {
          open: function open(e) {
            var t = $t.getDevice(e.node.rdev);
            e.stream_ops = t.stream_ops;

            if (e.stream_ops.open) {
              e.stream_ops.open(e);
            }
          },
          llseek: function llseek() {
            throw new $t.ErrnoError(70);
          }
        },
        major: function major(e) {
          return e >> 8;
        },
        minor: function minor(e) {
          return e & 255;
        },
        makedev: function makedev(e, t) {
          return e << 8 | t;
        },
        registerDevice: function registerDevice(e, t) {
          $t.devices[e] = {
            stream_ops: t
          };
        },
        getDevice: function getDevice(e) {
          return $t.devices[e];
        },
        getMounts: function getMounts(e) {
          var t = [];
          var r = [e];

          while (r.length) {
            var n = r.pop();
            t.push(n);
            r.push.apply(r, n.mounts);
          }

          return t;
        },
        syncfs: function syncfs(e, t) {
          if (typeof e === "function") {
            t = e;
            e = false;
          }

          $t.syncFSRequests++;

          if ($t.syncFSRequests > 1) {
            O("warning: " + $t.syncFSRequests + " FS.syncfs operations in flight at once, probably just doing extra work");
          }

          var r = $t.getMounts($t.root.mount);
          var n = 0;

          function o(e) {
            Z($t.syncFSRequests > 0);
            $t.syncFSRequests--;
            return t(e);
          }

          function i(e) {
            if (e) {
              if (!i.errored) {
                i.errored = true;
                return o(e);
              }

              return;
            }

            if (++n >= r.length) {
              o(null);
            }
          }

          r.forEach(function (t) {
            if (!t.type.syncfs) {
              return i(null);
            }

            t.type.syncfs(t, e, i);
          });
        },
        mount: function mount(e, t, r) {
          if (typeof e === "string") {
            throw e;
          }

          var n = r === "/";
          var o = !r;
          var i;

          if (n && $t.root) {
            throw new $t.ErrnoError(10);
          } else if (!n && !o) {
            var a = $t.lookupPath(r, {
              follow_mount: false
            });
            r = a.path;
            i = a.node;

            if ($t.isMountpoint(i)) {
              throw new $t.ErrnoError(10);
            }

            if (!$t.isDir(i.mode)) {
              throw new $t.ErrnoError(54);
            }
          }

          var s = {
            type: e,
            opts: t,
            mountpoint: r,
            mounts: []
          };
          var u = e.mount(s);
          u.mount = s;
          s.root = u;

          if (n) {
            $t.root = u;
          } else if (i) {
            i.mounted = s;

            if (i.mount) {
              i.mount.mounts.push(s);
            }
          }

          return u;
        },
        unmount: function unmount(e) {
          var t = $t.lookupPath(e, {
            follow_mount: false
          });

          if (!$t.isMountpoint(t.node)) {
            throw new $t.ErrnoError(28);
          }

          var r = t.node;
          var n = r.mounted;
          var o = $t.getMounts(n);
          Object.keys($t.nameTable).forEach(function (e) {
            var t = $t.nameTable[e];

            while (t) {
              var r = t.name_next;

              if (o.indexOf(t.mount) !== -1) {
                $t.destroyNode(t);
              }

              t = r;
            }
          });
          r.mounted = null;
          var i = r.mount.mounts.indexOf(n);
          Z(i !== -1);
          r.mount.mounts.splice(i, 1);
        },
        lookup: function lookup(e, t) {
          return e.node_ops.lookup(e, t);
        },
        mknod: function mknod(e, t, r) {
          var n = $t.lookupPath(e, {
            parent: true
          });
          var o = n.node;
          var i = Bt.basename(e);

          if (!i || i === "." || i === "..") {
            throw new $t.ErrnoError(28);
          }

          var a = $t.mayCreate(o, i);

          if (a) {
            throw new $t.ErrnoError(a);
          }

          if (!o.node_ops.mknod) {
            throw new $t.ErrnoError(63);
          }

          return o.node_ops.mknod(o, i, t, r);
        },
        create: function create(e, t) {
          t = t !== undefined ? t : 438;
          t &= 4095;
          t |= 32768;
          return $t.mknod(e, t, 0);
        },
        mkdir: function mkdir(e, t) {
          t = t !== undefined ? t : 511;
          t &= 511 | 512;
          t |= 16384;
          return $t.mknod(e, t, 0);
        },
        mkdirTree: function mkdirTree(e, t) {
          var r = e.split("/");
          var n = "";

          for (var o = 0; o < r.length; ++o) {
            if (!r[o]) continue;
            n += "/" + r[o];

            try {
              $t.mkdir(n, t);
            } catch (e) {
              if (e.errno != 20) throw e;
            }
          }
        },
        mkdev: function mkdev(e, t, r) {
          if (typeof r === "undefined") {
            r = t;
            t = 438;
          }

          t |= 8192;
          return $t.mknod(e, t, r);
        },
        symlink: function symlink(e, t) {
          if (!Gt.resolve(e)) {
            throw new $t.ErrnoError(44);
          }

          var r = $t.lookupPath(t, {
            parent: true
          });
          var n = r.node;

          if (!n) {
            throw new $t.ErrnoError(44);
          }

          var o = Bt.basename(t);
          var i = $t.mayCreate(n, o);

          if (i) {
            throw new $t.ErrnoError(i);
          }

          if (!n.node_ops.symlink) {
            throw new $t.ErrnoError(63);
          }

          return n.node_ops.symlink(n, o, e);
        },
        rename: function rename(e, t) {
          var r = Bt.dirname(e);
          var n = Bt.dirname(t);
          var o = Bt.basename(e);
          var i = Bt.basename(t);
          var a, s, u;
          a = $t.lookupPath(e, {
            parent: true
          });
          s = a.node;
          a = $t.lookupPath(t, {
            parent: true
          });
          u = a.node;
          if (!s || !u) throw new $t.ErrnoError(44);

          if (s.mount !== u.mount) {
            throw new $t.ErrnoError(75);
          }

          var c = $t.lookupNode(s, o);
          var f = Gt.relative(e, n);

          if (f.charAt(0) !== ".") {
            throw new $t.ErrnoError(28);
          }

          f = Gt.relative(t, r);

          if (f.charAt(0) !== ".") {
            throw new $t.ErrnoError(55);
          }

          var l;

          try {
            l = $t.lookupNode(u, i);
          } catch (e) {}

          if (c === l) {
            return;
          }

          var d = $t.isDir(c.mode);
          var p = $t.mayDelete(s, o, d);

          if (p) {
            throw new $t.ErrnoError(p);
          }

          p = l ? $t.mayDelete(u, i, d) : $t.mayCreate(u, i);

          if (p) {
            throw new $t.ErrnoError(p);
          }

          if (!s.node_ops.rename) {
            throw new $t.ErrnoError(63);
          }

          if ($t.isMountpoint(c) || l && $t.isMountpoint(l)) {
            throw new $t.ErrnoError(10);
          }

          if (u !== s) {
            p = $t.nodePermissions(s, "w");

            if (p) {
              throw new $t.ErrnoError(p);
            }
          }

          try {
            if ($t.trackingDelegate["willMovePath"]) {
              $t.trackingDelegate["willMovePath"](e, t);
            }
          } catch (r) {
            O("FS.trackingDelegate['willMovePath']('" + e + "', '" + t + "') threw an exception: " + r.message);
          }

          $t.hashRemoveNode(c);

          try {
            s.node_ops.rename(c, u, i);
          } catch (e) {
            throw e;
          } finally {
            $t.hashAddNode(c);
          }

          try {
            if ($t.trackingDelegate["onMovePath"]) $t.trackingDelegate["onMovePath"](e, t);
          } catch (r) {
            O("FS.trackingDelegate['onMovePath']('" + e + "', '" + t + "') threw an exception: " + r.message);
          }
        },
        rmdir: function rmdir(e) {
          var t = $t.lookupPath(e, {
            parent: true
          });
          var r = t.node;
          var n = Bt.basename(e);
          var o = $t.lookupNode(r, n);
          var i = $t.mayDelete(r, n, true);

          if (i) {
            throw new $t.ErrnoError(i);
          }

          if (!r.node_ops.rmdir) {
            throw new $t.ErrnoError(63);
          }

          if ($t.isMountpoint(o)) {
            throw new $t.ErrnoError(10);
          }

          try {
            if ($t.trackingDelegate["willDeletePath"]) {
              $t.trackingDelegate["willDeletePath"](e);
            }
          } catch (t) {
            O("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + t.message);
          }

          r.node_ops.rmdir(r, n);
          $t.destroyNode(o);

          try {
            if ($t.trackingDelegate["onDeletePath"]) $t.trackingDelegate["onDeletePath"](e);
          } catch (t) {
            O("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + t.message);
          }
        },
        readdir: function readdir(e) {
          var t = $t.lookupPath(e, {
            follow: true
          });
          var r = t.node;

          if (!r.node_ops.readdir) {
            throw new $t.ErrnoError(54);
          }

          return r.node_ops.readdir(r);
        },
        unlink: function unlink(e) {
          var t = $t.lookupPath(e, {
            parent: true
          });
          var r = t.node;
          var n = Bt.basename(e);
          var o = $t.lookupNode(r, n);
          var i = $t.mayDelete(r, n, false);

          if (i) {
            throw new $t.ErrnoError(i);
          }

          if (!r.node_ops.unlink) {
            throw new $t.ErrnoError(63);
          }

          if ($t.isMountpoint(o)) {
            throw new $t.ErrnoError(10);
          }

          try {
            if ($t.trackingDelegate["willDeletePath"]) {
              $t.trackingDelegate["willDeletePath"](e);
            }
          } catch (t) {
            O("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + t.message);
          }

          r.node_ops.unlink(r, n);
          $t.destroyNode(o);

          try {
            if ($t.trackingDelegate["onDeletePath"]) $t.trackingDelegate["onDeletePath"](e);
          } catch (t) {
            O("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + t.message);
          }
        },
        readlink: function readlink(e) {
          var t = $t.lookupPath(e);
          var r = t.node;

          if (!r) {
            throw new $t.ErrnoError(44);
          }

          if (!r.node_ops.readlink) {
            throw new $t.ErrnoError(28);
          }

          return Gt.resolve($t.getPath(r.parent), r.node_ops.readlink(r));
        },
        stat: function stat(e, t) {
          var r = $t.lookupPath(e, {
            follow: !t
          });
          var n = r.node;

          if (!n) {
            throw new $t.ErrnoError(44);
          }

          if (!n.node_ops.getattr) {
            throw new $t.ErrnoError(63);
          }

          return n.node_ops.getattr(n);
        },
        lstat: function lstat(e) {
          return $t.stat(e, true);
        },
        chmod: function chmod(e, t, r) {
          var n;

          if (typeof e === "string") {
            var o = $t.lookupPath(e, {
              follow: !r
            });
            n = o.node;
          } else {
            n = e;
          }

          if (!n.node_ops.setattr) {
            throw new $t.ErrnoError(63);
          }

          n.node_ops.setattr(n, {
            mode: t & 4095 | n.mode & ~4095,
            timestamp: Date.now()
          });
        },
        lchmod: function lchmod(e, t) {
          $t.chmod(e, t, true);
        },
        fchmod: function fchmod(e, t) {
          var r = $t.getStream(e);

          if (!r) {
            throw new $t.ErrnoError(8);
          }

          $t.chmod(r.node, t);
        },
        chown: function chown(e, t, r, n) {
          var o;

          if (typeof e === "string") {
            var i = $t.lookupPath(e, {
              follow: !n
            });
            o = i.node;
          } else {
            o = e;
          }

          if (!o.node_ops.setattr) {
            throw new $t.ErrnoError(63);
          }

          o.node_ops.setattr(o, {
            timestamp: Date.now()
          });
        },
        lchown: function lchown(e, t, r) {
          $t.chown(e, t, r, true);
        },
        fchown: function fchown(e, t, r) {
          var n = $t.getStream(e);

          if (!n) {
            throw new $t.ErrnoError(8);
          }

          $t.chown(n.node, t, r);
        },
        truncate: function truncate(e, t) {
          if (t < 0) {
            throw new $t.ErrnoError(28);
          }

          var r;

          if (typeof e === "string") {
            var n = $t.lookupPath(e, {
              follow: true
            });
            r = n.node;
          } else {
            r = e;
          }

          if (!r.node_ops.setattr) {
            throw new $t.ErrnoError(63);
          }

          if ($t.isDir(r.mode)) {
            throw new $t.ErrnoError(31);
          }

          if (!$t.isFile(r.mode)) {
            throw new $t.ErrnoError(28);
          }

          var o = $t.nodePermissions(r, "w");

          if (o) {
            throw new $t.ErrnoError(o);
          }

          r.node_ops.setattr(r, {
            size: t,
            timestamp: Date.now()
          });
        },
        ftruncate: function ftruncate(e, t) {
          var r = $t.getStream(e);

          if (!r) {
            throw new $t.ErrnoError(8);
          }

          if ((r.flags & 2097155) === 0) {
            throw new $t.ErrnoError(28);
          }

          $t.truncate(r.node, t);
        },
        utime: function utime(e, t, r) {
          var n = $t.lookupPath(e, {
            follow: true
          });
          var o = n.node;
          o.node_ops.setattr(o, {
            timestamp: Math.max(t, r)
          });
        },
        open: function open(e, t, r, o, i) {
          if (e === "") {
            throw new $t.ErrnoError(44);
          }

          t = typeof t === "string" ? $t.modeStringToFlags(t) : t;
          r = typeof r === "undefined" ? 438 : r;

          if (t & 64) {
            r = r & 4095 | 32768;
          } else {
            r = 0;
          }

          var a;

          if (_typeof(e) === "object") {
            a = e;
          } else {
            e = Bt.normalize(e);

            try {
              var s = $t.lookupPath(e, {
                follow: !(t & 131072)
              });
              a = s.node;
            } catch (e) {}
          }

          var u = false;

          if (t & 64) {
            if (a) {
              if (t & 128) {
                throw new $t.ErrnoError(20);
              }
            } else {
              a = $t.mknod(e, r, 0);
              u = true;
            }
          }

          if (!a) {
            throw new $t.ErrnoError(44);
          }

          if ($t.isChrdev(a.mode)) {
            t &= ~512;
          }

          if (t & 65536 && !$t.isDir(a.mode)) {
            throw new $t.ErrnoError(54);
          }

          if (!u) {
            var c = $t.mayOpen(a, t);

            if (c) {
              throw new $t.ErrnoError(c);
            }
          }

          if (t & 512) {
            $t.truncate(a, 0);
          }

          t &= ~(128 | 512 | 131072);
          var f = $t.createStream({
            node: a,
            path: $t.getPath(a),
            flags: t,
            seekable: true,
            position: 0,
            stream_ops: a.stream_ops,
            ungotten: [],
            error: false
          }, o, i);

          if (f.stream_ops.open) {
            f.stream_ops.open(f);
          }

          if (n["logReadFiles"] && !(t & 1)) {
            if (!$t.readFiles) $t.readFiles = {};

            if (!(e in $t.readFiles)) {
              $t.readFiles[e] = 1;
              O("FS.trackingDelegate error on read file: " + e);
            }
          }

          try {
            if ($t.trackingDelegate["onOpenFile"]) {
              var l = 0;

              if ((t & 2097155) !== 1) {
                l |= $t.tracking.openFlags.READ;
              }

              if ((t & 2097155) !== 0) {
                l |= $t.tracking.openFlags.WRITE;
              }

              $t.trackingDelegate["onOpenFile"](e, l);
            }
          } catch (t) {
            O("FS.trackingDelegate['onOpenFile']('" + e + "', flags) threw an exception: " + t.message);
          }

          return f;
        },
        close: function close(e) {
          if ($t.isClosed(e)) {
            throw new $t.ErrnoError(8);
          }

          if (e.getdents) e.getdents = null;

          try {
            if (e.stream_ops.close) {
              e.stream_ops.close(e);
            }
          } catch (e) {
            throw e;
          } finally {
            $t.closeStream(e.fd);
          }

          e.fd = null;
        },
        isClosed: function isClosed(e) {
          return e.fd === null;
        },
        llseek: function llseek(e, t, r) {
          if ($t.isClosed(e)) {
            throw new $t.ErrnoError(8);
          }

          if (!e.seekable || !e.stream_ops.llseek) {
            throw new $t.ErrnoError(70);
          }

          if (r != 0 && r != 1 && r != 2) {
            throw new $t.ErrnoError(28);
          }

          e.position = e.stream_ops.llseek(e, t, r);
          e.ungotten = [];
          return e.position;
        },
        read: function read(e, t, r, n, o) {
          if (n < 0 || o < 0) {
            throw new $t.ErrnoError(28);
          }

          if ($t.isClosed(e)) {
            throw new $t.ErrnoError(8);
          }

          if ((e.flags & 2097155) === 1) {
            throw new $t.ErrnoError(8);
          }

          if ($t.isDir(e.node.mode)) {
            throw new $t.ErrnoError(31);
          }

          if (!e.stream_ops.read) {
            throw new $t.ErrnoError(28);
          }

          var i = typeof o !== "undefined";

          if (!i) {
            o = e.position;
          } else if (!e.seekable) {
            throw new $t.ErrnoError(70);
          }

          var a = e.stream_ops.read(e, t, r, n, o);
          if (!i) e.position += a;
          return a;
        },
        write: function write(e, t, r, n, o, i) {
          if (n < 0 || o < 0) {
            throw new $t.ErrnoError(28);
          }

          if ($t.isClosed(e)) {
            throw new $t.ErrnoError(8);
          }

          if ((e.flags & 2097155) === 0) {
            throw new $t.ErrnoError(8);
          }

          if ($t.isDir(e.node.mode)) {
            throw new $t.ErrnoError(31);
          }

          if (!e.stream_ops.write) {
            throw new $t.ErrnoError(28);
          }

          if (e.seekable && e.flags & 1024) {
            $t.llseek(e, 0, 2);
          }

          var a = typeof o !== "undefined";

          if (!a) {
            o = e.position;
          } else if (!e.seekable) {
            throw new $t.ErrnoError(70);
          }

          var s = e.stream_ops.write(e, t, r, n, o, i);
          if (!a) e.position += s;

          try {
            if (e.path && $t.trackingDelegate["onWriteToFile"]) $t.trackingDelegate["onWriteToFile"](e.path);
          } catch (t) {
            O("FS.trackingDelegate['onWriteToFile']('" + e.path + "') threw an exception: " + t.message);
          }

          return s;
        },
        allocate: function allocate(e, t, r) {
          if ($t.isClosed(e)) {
            throw new $t.ErrnoError(8);
          }

          if (t < 0 || r <= 0) {
            throw new $t.ErrnoError(28);
          }

          if ((e.flags & 2097155) === 0) {
            throw new $t.ErrnoError(8);
          }

          if (!$t.isFile(e.node.mode) && !$t.isDir(e.node.mode)) {
            throw new $t.ErrnoError(43);
          }

          if (!e.stream_ops.allocate) {
            throw new $t.ErrnoError(138);
          }

          e.stream_ops.allocate(e, t, r);
        },
        mmap: function mmap(e, t, r, n, o, i) {
          if ((o & 2) !== 0 && (i & 2) === 0 && (e.flags & 2097155) !== 2) {
            throw new $t.ErrnoError(2);
          }

          if ((e.flags & 2097155) === 1) {
            throw new $t.ErrnoError(2);
          }

          if (!e.stream_ops.mmap) {
            throw new $t.ErrnoError(43);
          }

          return e.stream_ops.mmap(e, t, r, n, o, i);
        },
        msync: function msync(e, t, r, n, o) {
          if (!e || !e.stream_ops.msync) {
            return 0;
          }

          return e.stream_ops.msync(e, t, r, n, o);
        },
        munmap: function munmap(e) {
          return 0;
        },
        ioctl: function ioctl(e, t, r) {
          if (!e.stream_ops.ioctl) {
            throw new $t.ErrnoError(59);
          }

          return e.stream_ops.ioctl(e, t, r);
        },
        readFile: function readFile(e, t) {
          t = t || {};
          t.flags = t.flags || "r";
          t.encoding = t.encoding || "binary";

          if (t.encoding !== "utf8" && t.encoding !== "binary") {
            throw new Error('Invalid encoding type "' + t.encoding + '"');
          }

          var r;
          var n = $t.open(e, t.flags);
          var o = $t.stat(e);
          var i = o.size;
          var a = new Uint8Array(i);
          $t.read(n, a, 0, i, 0);

          if (t.encoding === "utf8") {
            r = ae(a, 0);
          } else if (t.encoding === "binary") {
            r = a;
          }

          $t.close(n);
          return r;
        },
        writeFile: function writeFile(e, t, r) {
          r = r || {};
          r.flags = r.flags || "w";
          var n = $t.open(e, r.flags, r.mode);

          if (typeof t === "string") {
            var o = new Uint8Array(fe(t) + 1);
            var i = ue(t, o, 0, o.length);
            $t.write(n, o, 0, i, undefined, r.canOwn);
          } else if (ArrayBuffer.isView(t)) {
            $t.write(n, t, 0, t.byteLength, undefined, r.canOwn);
          } else {
            throw new Error("Unsupported data type");
          }

          $t.close(n);
        },
        cwd: function cwd() {
          return $t.currentPath;
        },
        chdir: function chdir(e) {
          var t = $t.lookupPath(e, {
            follow: true
          });

          if (t.node === null) {
            throw new $t.ErrnoError(44);
          }

          if (!$t.isDir(t.node.mode)) {
            throw new $t.ErrnoError(54);
          }

          var r = $t.nodePermissions(t.node, "x");

          if (r) {
            throw new $t.ErrnoError(r);
          }

          $t.currentPath = t.path;
        },
        createDefaultDirectories: function createDefaultDirectories() {
          $t.mkdir("/tmp");
          $t.mkdir("/home");
          $t.mkdir("/home/web_user");
        },
        createDefaultDevices: function createDefaultDevices() {
          $t.mkdir("/dev");
          $t.registerDevice($t.makedev(1, 3), {
            read: function read() {
              return 0;
            },
            write: function write(e, t, r, n, o) {
              return n;
            }
          });
          $t.mkdev("/dev/null", $t.makedev(1, 3));
          Yt.register($t.makedev(5, 0), Yt.default_tty_ops);
          Yt.register($t.makedev(6, 0), Yt.default_tty1_ops);
          $t.mkdev("/dev/tty", $t.makedev(5, 0));
          $t.mkdev("/dev/tty1", $t.makedev(6, 0));
          var e = Wt();
          $t.createDevice("/dev", "random", e);
          $t.createDevice("/dev", "urandom", e);
          $t.mkdir("/dev/shm");
          $t.mkdir("/dev/shm/tmp");
        },
        createSpecialDirectories: function createSpecialDirectories() {
          $t.mkdir("/proc");
          $t.mkdir("/proc/self");
          $t.mkdir("/proc/self/fd");
          $t.mount({
            mount: function mount() {
              var e = $t.createNode("/proc/self", "fd", 16384 | 511, 73);
              e.node_ops = {
                lookup: function lookup(e, t) {
                  var r = +t;
                  var n = $t.getStream(r);
                  if (!n) throw new $t.ErrnoError(8);
                  var o = {
                    parent: null,
                    mount: {
                      mountpoint: "fake"
                    },
                    node_ops: {
                      readlink: function readlink() {
                        return n.path;
                      }
                    }
                  };
                  o.parent = o;
                  return o;
                }
              };
              return e;
            }
          }, {}, "/proc/self/fd");
        },
        createStandardStreams: function createStandardStreams() {
          if (n["stdin"]) {
            $t.createDevice("/dev", "stdin", n["stdin"]);
          } else {
            $t.symlink("/dev/tty", "/dev/stdin");
          }

          if (n["stdout"]) {
            $t.createDevice("/dev", "stdout", null, n["stdout"]);
          } else {
            $t.symlink("/dev/tty", "/dev/stdout");
          }

          if (n["stderr"]) {
            $t.createDevice("/dev", "stderr", null, n["stderr"]);
          } else {
            $t.symlink("/dev/tty1", "/dev/stderr");
          }

          var e = $t.open("/dev/stdin", "r");
          var t = $t.open("/dev/stdout", "w");
          var r = $t.open("/dev/stderr", "w");
          Z(e.fd === 0, "invalid handle for stdin (" + e.fd + ")");
          Z(t.fd === 1, "invalid handle for stdout (" + t.fd + ")");
          Z(r.fd === 2, "invalid handle for stderr (" + r.fd + ")");
        },
        ensureErrnoError: function ensureErrnoError() {
          if ($t.ErrnoError) return;

          $t.ErrnoError = function e(t, r) {
            this.node = r;

            this.setErrno = function (e) {
              this.errno = e;

              for (var t in Zt) {
                if (Zt[t] === e) {
                  this.code = t;
                  break;
                }
              }
            };

            this.setErrno(t);
            this.message = Jt[t];

            if (this.stack) {
              Object.defineProperty(this, "stack", {
                value: new Error().stack,
                writable: true
              });
              this.stack = kt(this.stack);
            }
          };

          $t.ErrnoError.prototype = new Error();
          $t.ErrnoError.prototype.constructor = $t.ErrnoError;
          [44].forEach(function (e) {
            $t.genericErrors[e] = new $t.ErrnoError(e);
            $t.genericErrors[e].stack = "<generic error, no stack>";
          });
        },
        staticInit: function staticInit() {
          $t.ensureErrnoError();
          $t.nameTable = new Array(4096);
          $t.mount(Kt, {}, "/");
          $t.createDefaultDirectories();
          $t.createDefaultDevices();
          $t.createSpecialDirectories();
          $t.filesystems = {
            MEMFS: Kt
          };
        },
        init: function init(e, t, r) {
          Z(!$t.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
          $t.init.initialized = true;
          $t.ensureErrnoError();
          n["stdin"] = e || n["stdin"];
          n["stdout"] = t || n["stdout"];
          n["stderr"] = r || n["stderr"];
          $t.createStandardStreams();
        },
        quit: function quit() {
          $t.init.initialized = false;
          var e = n["_fflush"];
          if (e) e(0);

          for (var t = 0; t < $t.streams.length; t++) {
            var r = $t.streams[t];

            if (!r) {
              continue;
            }

            $t.close(r);
          }
        },
        getMode: function getMode(e, t) {
          var r = 0;
          if (e) r |= 292 | 73;
          if (t) r |= 146;
          return r;
        },
        findObject: function findObject(e, t) {
          var r = $t.analyzePath(e, t);

          if (r.exists) {
            return r.object;
          } else {
            zt(r.error);
            return null;
          }
        },
        analyzePath: function analyzePath(e, t) {
          try {
            var r = $t.lookupPath(e, {
              follow: !t
            });
            e = r.path;
          } catch (e) {}

          var n = {
            isRoot: false,
            exists: false,
            error: 0,
            name: null,
            path: null,
            object: null,
            parentExists: false,
            parentPath: null,
            parentObject: null
          };

          try {
            var r = $t.lookupPath(e, {
              parent: true
            });
            n.parentExists = true;
            n.parentPath = r.path;
            n.parentObject = r.node;
            n.name = Bt.basename(e);
            r = $t.lookupPath(e, {
              follow: !t
            });
            n.exists = true;
            n.path = r.path;
            n.object = r.node;
            n.name = r.node.name;
            n.isRoot = r.path === "/";
          } catch (e) {
            n.error = e.errno;
          }

          return n;
        },
        createPath: function createPath(e, t, r, n) {
          e = typeof e === "string" ? e : $t.getPath(e);
          var o = t.split("/").reverse();

          while (o.length) {
            var i = o.pop();
            if (!i) continue;
            var a = Bt.join2(e, i);

            try {
              $t.mkdir(a);
            } catch (e) {}

            e = a;
          }

          return a;
        },
        createFile: function createFile(e, t, r, n, o) {
          var i = Bt.join2(typeof e === "string" ? e : $t.getPath(e), t);
          var a = $t.getMode(n, o);
          return $t.create(i, a);
        },
        createDataFile: function createDataFile(e, t, r, n, o, i) {
          var a = t ? Bt.join2(typeof e === "string" ? e : $t.getPath(e), t) : e;
          var s = $t.getMode(n, o);
          var u = $t.create(a, s);

          if (r) {
            if (typeof r === "string") {
              var c = new Array(r.length);

              for (var f = 0, l = r.length; f < l; ++f) {
                c[f] = r.charCodeAt(f);
              }

              r = c;
            }

            $t.chmod(u, s | 146);
            var d = $t.open(u, "w");
            $t.write(d, r, 0, r.length, 0, i);
            $t.close(d);
            $t.chmod(u, s);
          }

          return u;
        },
        createDevice: function createDevice(e, t, r, n) {
          var o = Bt.join2(typeof e === "string" ? e : $t.getPath(e), t);
          var i = $t.getMode(!!r, !!n);
          if (!$t.createDevice.major) $t.createDevice.major = 64;
          var a = $t.makedev($t.createDevice.major++, 0);
          $t.registerDevice(a, {
            open: function open(e) {
              e.seekable = false;
            },
            close: function close(e) {
              if (n && n.buffer && n.buffer.length) {
                n(10);
              }
            },
            read: function read(e, t, n, o, i) {
              var a = 0;

              for (var s = 0; s < o; s++) {
                var u;

                try {
                  u = r();
                } catch (e) {
                  throw new $t.ErrnoError(29);
                }

                if (u === undefined && a === 0) {
                  throw new $t.ErrnoError(6);
                }

                if (u === null || u === undefined) break;
                a++;
                t[n + s] = u;
              }

              if (a) {
                e.node.timestamp = Date.now();
              }

              return a;
            },
            write: function write(e, t, r, o, i) {
              for (var a = 0; a < o; a++) {
                try {
                  n(t[r + a]);
                } catch (e) {
                  throw new $t.ErrnoError(29);
                }
              }

              if (o) {
                e.node.timestamp = Date.now();
              }

              return a;
            }
          });
          return $t.mkdev(o, i, a);
        },
        forceLoadFile: function forceLoadFile(e) {
          if (e.isDevice || e.isFolder || e.link || e.contents) return true;
          var t = true;

          if (typeof XMLHttpRequest !== "undefined") {
            throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
          } else if (m) {
            try {
              e.contents = Jr(m(e.url), true);
              e.usedBytes = e.contents.length;
            } catch (e) {
              t = false;
            }
          } else {
            throw new Error("Cannot load without read() or XMLHttpRequest.");
          }

          if (!t) zt(29);
          return t;
        },
        createLazyFile: function createLazyFile(e, t, r, n, o) {
          function i() {
            this.lengthKnown = false;
            this.chunks = [];
          }

          i.prototype.get = function e(t) {
            if (t > this.length - 1 || t < 0) {
              return undefined;
            }

            var r = t % this.chunkSize;
            var n = t / this.chunkSize | 0;
            return this.getter(n)[r];
          };

          i.prototype.setDataGetter = function e(t) {
            this.getter = t;
          };

          i.prototype.cacheLength = function e() {
            var t = new XMLHttpRequest();
            t.open("HEAD", r, false);
            t.send(null);
            if (!(t.status >= 200 && t.status < 300 || t.status === 304)) throw new Error("Couldn't load " + r + ". Status: " + t.status);
            var n = Number(t.getResponseHeader("Content-length"));
            var o;
            var i = (o = t.getResponseHeader("Accept-Ranges")) && o === "bytes";
            var a = (o = t.getResponseHeader("Content-Encoding")) && o === "gzip";
            var s = 1024 * 1024;
            if (!i) s = n;

            var u = function u(e, t) {
              if (e > t) throw new Error("invalid range (" + e + ", " + t + ") or no bytes requested!");
              if (t > n - 1) throw new Error("only " + n + " bytes available! programmer error!");
              var o = new XMLHttpRequest();
              o.open("GET", r, false);
              if (n !== s) o.setRequestHeader("Range", "bytes=" + e + "-" + t);
              if (typeof Uint8Array != "undefined") o.responseType = "arraybuffer";

              if (o.overrideMimeType) {
                o.overrideMimeType("text/plain; charset=x-user-defined");
              }

              o.send(null);
              if (!(o.status >= 200 && o.status < 300 || o.status === 304)) throw new Error("Couldn't load " + r + ". Status: " + o.status);

              if (o.response !== undefined) {
                return new Uint8Array(o.response || []);
              } else {
                return Jr(o.responseText || "", true);
              }
            };

            var c = this;
            c.setDataGetter(function (e) {
              var t = e * s;
              var r = (e + 1) * s - 1;
              r = Math.min(r, n - 1);

              if (typeof c.chunks[e] === "undefined") {
                c.chunks[e] = u(t, r);
              }

              if (typeof c.chunks[e] === "undefined") throw new Error("doXHR failed!");
              return c.chunks[e];
            });

            if (a || !n) {
              s = n = 1;
              n = this.getter(0).length;
              s = n;
              y("LazyFiles on gzip forces download of the whole file when length is accessed");
            }

            this._length = n;
            this._chunkSize = s;
            this.lengthKnown = true;
          };

          if (typeof XMLHttpRequest !== "undefined") {
            if (!l) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
            var a = new i();
            Object.defineProperties(a, {
              length: {
                get: function get() {
                  if (!this.lengthKnown) {
                    this.cacheLength();
                  }

                  return this._length;
                }
              },
              chunkSize: {
                get: function get() {
                  if (!this.lengthKnown) {
                    this.cacheLength();
                  }

                  return this._chunkSize;
                }
              }
            });
            var s = {
              isDevice: false,
              contents: a
            };
          } else {
            var s = {
              isDevice: false,
              url: r
            };
          }

          var u = $t.createFile(e, t, s, n, o);

          if (s.contents) {
            u.contents = s.contents;
          } else if (s.url) {
            u.contents = null;
            u.url = s.url;
          }

          Object.defineProperties(u, {
            usedBytes: {
              get: function get() {
                return this.contents.length;
              }
            }
          });
          var c = {};
          var f = Object.keys(u.stream_ops);
          f.forEach(function (e) {
            var t = u.stream_ops[e];

            c[e] = function e() {
              if (!$t.forceLoadFile(u)) {
                throw new $t.ErrnoError(29);
              }

              return t.apply(null, arguments);
            };
          });

          c.read = function e(t, r, n, o, i) {
            if (!$t.forceLoadFile(u)) {
              throw new $t.ErrnoError(29);
            }

            var a = t.node.contents;
            if (i >= a.length) return 0;
            var s = Math.min(a.length - i, o);
            Z(s >= 0);

            if (a.slice) {
              for (var c = 0; c < s; c++) {
                r[n + c] = a[i + c];
              }
            } else {
              for (var c = 0; c < s; c++) {
                r[n + c] = a.get(i + c);
              }
            }

            return s;
          };

          u.stream_ops = c;
          return u;
        },
        createPreloadedFile: function createPreloadedFile(e, t, r, o, i, a, s, u, c, f) {
          Browser.init();
          var l = t ? Gt.resolve(Bt.join2(e, t)) : e;
          var d = Et("cp " + l);

          function p(r) {
            function p(r) {
              if (f) f();

              if (!u) {
                $t.createDataFile(e, t, r, o, i, c);
              }

              if (a) a();
              mt(d);
            }

            var E = false;
            n["preloadPlugins"].forEach(function (e) {
              if (E) return;

              if (e["canHandle"](l)) {
                e["handle"](r, l, p, function () {
                  if (s) s();
                  mt(d);
                });
                E = true;
              }
            });
            if (!E) p(r);
          }

          ht(d);

          if (typeof r == "string") {
            Browser.asyncLoad(r, function (e) {
              p(e);
            }, s);
          } else {
            p(r);
          }
        },
        indexedDB: function indexedDB() {
          return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        },
        DB_NAME: function DB_NAME() {
          return "EM_FS_" + window.location.pathname;
        },
        DB_VERSION: 20,
        DB_STORE_NAME: "FILE_DATA",
        saveFilesToDB: function saveFilesToDB(e, t, r) {
          t = t || function () {};

          r = r || function () {};

          var n = $t.indexedDB();

          try {
            var o = n.open($t.DB_NAME(), $t.DB_VERSION);
          } catch (e) {
            return r(e);
          }

          o.onupgradeneeded = function e() {
            y("creating db");
            var t = o.result;
            t.createObjectStore($t.DB_STORE_NAME);
          };

          o.onsuccess = function n() {
            var i = o.result;
            var a = i.transaction([$t.DB_STORE_NAME], "readwrite");
            var s = a.objectStore($t.DB_STORE_NAME);
            var u = 0,
                c = 0,
                f = e.length;

            function l() {
              if (c == 0) t();else r();
            }

            e.forEach(function (e) {
              var t = s.put($t.analyzePath(e).object.contents, e);

              t.onsuccess = function e() {
                u++;
                if (u + c == f) l();
              };

              t.onerror = function e() {
                c++;
                if (u + c == f) l();
              };
            });
            a.onerror = r;
          };

          o.onerror = r;
        },
        loadFilesFromDB: function loadFilesFromDB(e, t, r) {
          t = t || function () {};

          r = r || function () {};

          var n = $t.indexedDB();

          try {
            var o = n.open($t.DB_NAME(), $t.DB_VERSION);
          } catch (e) {
            return r(e);
          }

          o.onupgradeneeded = r;

          o.onsuccess = function n() {
            var i = o.result;

            try {
              var a = i.transaction([$t.DB_STORE_NAME], "readonly");
            } catch (e) {
              r(e);
              return;
            }

            var s = a.objectStore($t.DB_STORE_NAME);
            var u = 0,
                c = 0,
                f = e.length;

            function l() {
              if (c == 0) t();else r();
            }

            e.forEach(function (e) {
              var t = s.get(e);

              t.onsuccess = function r() {
                if ($t.analyzePath(e).exists) {
                  $t.unlink(e);
                }

                $t.createDataFile(Bt.dirname(e), Bt.basename(e), t.result, true, true, true);
                u++;
                if (u + c == f) l();
              };

              t.onerror = function e() {
                c++;
                if (u + c == f) l();
              };
            });
            a.onerror = r;
          };

          o.onerror = r;
        },
        absolutePath: function absolutePath() {
          _t("FS.absolutePath has been removed; use PATH_FS.resolve instead");
        },
        createFolder: function createFolder() {
          _t("FS.createFolder has been removed; use FS.mkdir instead");
        },
        createLink: function createLink() {
          _t("FS.createLink has been removed; use FS.symlink instead");
        },
        joinPath: function joinPath() {
          _t("FS.joinPath has been removed; use PATH.join instead");
        },
        mmapAlloc: function mmapAlloc() {
          _t("FS.mmapAlloc has been replaced by the top level function mmapAlloc");
        },
        standardizePath: function standardizePath() {
          _t("FS.standardizePath has been removed; use PATH.normalize instead");
        }
      };
      var er = {
        mappings: {},
        DEFAULT_POLLMASK: 5,
        umask: 511,
        calculateAt: function calculateAt(e, t) {
          if (t[0] !== "/") {
            var r;

            if (e === -100) {
              r = $t.cwd();
            } else {
              var n = $t.getStream(e);
              if (!n) throw new $t.ErrnoError(8);
              r = n.path;
            }

            t = Bt.join2(r, t);
          }

          return t;
        },
        doStat: function doStat(e, t, r) {
          try {
            var n = e(t);
          } catch (e) {
            if (e && e.node && Bt.normalize(t) !== Bt.normalize($t.getPath(e.node))) {
              return -54;
            }

            throw e;
          }

          xe[r >> 2] = n.dev;
          xe[r + 4 >> 2] = 0;
          xe[r + 8 >> 2] = n.ino;
          xe[r + 12 >> 2] = n.mode;
          xe[r + 16 >> 2] = n.nlink;
          xe[r + 20 >> 2] = n.uid;
          xe[r + 24 >> 2] = n.gid;
          xe[r + 28 >> 2] = n.rdev;
          xe[r + 32 >> 2] = 0;
          Pt = [n.size >>> 0, (Mt = n.size, +Math.abs(Mt) >= 1 ? Mt > 0 ? (Math.min(+Math.floor(Mt / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((Mt - +(~~Mt >>> 0)) / 4294967296) >>> 0 : 0)], xe[r + 40 >> 2] = Pt[0], xe[r + 44 >> 2] = Pt[1];
          xe[r + 48 >> 2] = 4096;
          xe[r + 52 >> 2] = n.blocks;
          xe[r + 56 >> 2] = n.atime.getTime() / 1e3 | 0;
          xe[r + 60 >> 2] = 0;
          xe[r + 64 >> 2] = n.mtime.getTime() / 1e3 | 0;
          xe[r + 68 >> 2] = 0;
          xe[r + 72 >> 2] = n.ctime.getTime() / 1e3 | 0;
          xe[r + 76 >> 2] = 0;
          Pt = [n.ino >>> 0, (Mt = n.ino, +Math.abs(Mt) >= 1 ? Mt > 0 ? (Math.min(+Math.floor(Mt / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((Mt - +(~~Mt >>> 0)) / 4294967296) >>> 0 : 0)], xe[r + 80 >> 2] = Pt[0], xe[r + 84 >> 2] = Pt[1];
          return 0;
        },
        doMsync: function doMsync(e, t, r, n, o) {
          var i = Fe.slice(e, e + r);
          $t.msync(t, i, o, r, n);
        },
        doMkdir: function doMkdir(e, t) {
          e = Bt.normalize(e);
          if (e[e.length - 1] === "/") e = e.substr(0, e.length - 1);
          $t.mkdir(e, t, 0);
          return 0;
        },
        doMknod: function doMknod(e, t, r) {
          switch (t & 61440) {
            case 32768:
            case 8192:
            case 24576:
            case 4096:
            case 49152:
              break;

            default:
              return -28;
          }

          $t.mknod(e, t, r);
          return 0;
        },
        doReadlink: function doReadlink(e, t, r) {
          if (r <= 0) return -28;
          var n = $t.readlink(e);
          var o = Math.min(r, fe(n));
          var i = Pe[t + o];
          ce(n, t, r + 1);
          Pe[t + o] = i;
          return o;
        },
        doAccess: function doAccess(e, t) {
          if (t & ~7) {
            return -28;
          }

          var r;
          var n = $t.lookupPath(e, {
            follow: true
          });
          r = n.node;

          if (!r) {
            return -44;
          }

          var o = "";
          if (t & 4) o += "r";
          if (t & 2) o += "w";
          if (t & 1) o += "x";

          if (o && $t.nodePermissions(r, o)) {
            return -2;
          }

          return 0;
        },
        doDup: function doDup(e, t, r) {
          var n = $t.getStream(r);
          if (n) $t.close(n);
          return $t.open(e, t, 0, r, r).fd;
        },
        doReadv: function doReadv(e, t, r, n) {
          var o = 0;

          for (var i = 0; i < r; i++) {
            var a = xe[t + i * 8 >> 2];
            var s = xe[t + (i * 8 + 4) >> 2];
            var u = $t.read(e, Pe, a, s, n);
            if (u < 0) return -1;
            o += u;
            if (u < s) break;
          }

          return o;
        },
        doWritev: function doWritev(e, t, r, n) {
          var o = 0;

          for (var i = 0; i < r; i++) {
            var a = xe[t + i * 8 >> 2];
            var s = xe[t + (i * 8 + 4) >> 2];
            var u = $t.write(e, Pe, a, s, n);
            if (u < 0) return -1;
            o += u;
          }

          return o;
        },
        varargs: undefined,
        get: function get() {
          Z(er.varargs != undefined);
          er.varargs += 4;
          var e = xe[er.varargs - 4 >> 2];
          return e;
        },
        getStr: function getStr(e) {
          var t = se(e);
          return t;
        },
        getStreamFromFD: function getStreamFromFD(e) {
          var t = $t.getStream(e);
          if (!t) throw new $t.ErrnoError(8);
          return t;
        },
        get64: function get64(e, t) {
          if (e >= 0) Z(t === 0);else Z(t === -1);
          return e;
        }
      };

      function tr(e, t) {
        try {
          e = er.getStr(e);
          return er.doAccess(e, t);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function rr(e, t) {
        try {
          e = er.getStr(e);
          $t.chmod(e, t);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function nr(e, t, r) {
        try {
          e = er.getStr(e);
          $t.chown(e, t, r);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function or(e, t) {
        try {
          $t.fchmod(e, t);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function ir(e, t, r) {
        try {
          $t.fchown(e, t, r);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function ar(e, t, r) {
        er.varargs = r;

        try {
          var n = er.getStreamFromFD(e);

          switch (t) {
            case 0:
              {
                var o = er.get();

                if (o < 0) {
                  return -28;
                }

                var i;
                i = $t.open(n.path, n.flags, 0, o);
                return i.fd;
              }

            case 1:
            case 2:
              return 0;

            case 3:
              return n.flags;

            case 4:
              {
                var o = er.get();
                n.flags |= o;
                return 0;
              }

            case 12:
              {
                var o = er.get();
                var a = 0;
                Ne[o + a >> 1] = 2;
                return 0;
              }

            case 13:
            case 14:
              return 0;

            case 16:
            case 8:
              return -28;

            case 9:
              zt(28);
              return -1;

            default:
              {
                return -28;
              }
          }
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function sr(e, t) {
        try {
          var r = er.getStreamFromFD(e);
          return er.doStat($t.stat, r.path, t);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function ur(e, t, r, n) {
        try {
          var o = er.get64(r, n);
          $t.ftruncate(e, o);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function cr(e, t) {
        try {
          if (t === 0) return -28;
          var r = $t.cwd();
          var n = fe(r);
          if (t < n + 1) return -68;
          ce(r, e, t);
          return e;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function fr() {
        return 0;
      }

      function lr() {
        return fr();
      }

      function dr() {
        return 42;
      }

      function pr(e, t) {
        try {
          e = er.getStr(e);
          return er.doStat($t.lstat, e, t);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function Er(e, t) {
        try {
          e = er.getStr(e);
          return er.doMkdir(e, t);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function hr(e, t, r, n, o, i) {
        i <<= 12;
        var a;
        var s = false;

        if ((n & 16) !== 0 && e % 16384 !== 0) {
          return -28;
        }

        if ((n & 32) !== 0) {
          a = to(16384, t);
          if (!a) return -48;
          rn(a, 0, t);
          s = true;
        } else {
          var u = $t.getStream(o);
          if (!u) return -8;
          var c = $t.mmap(u, e, t, i, r, n);
          a = c.ptr;
          s = c.allocated;
        }

        er.mappings[a] = {
          malloc: a,
          len: t,
          allocated: s,
          fd: o,
          prot: r,
          flags: n,
          offset: i
        };
        return a;
      }

      function mr(e, t, r, n, o, i) {
        try {
          return hr(e, t, r, n, o, i);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function _r(e, t) {
        if ((e | 0) === -1 || t === 0) {
          return -28;
        }

        var r = er.mappings[e];
        if (!r) return 0;

        if (t === r.len) {
          var n = $t.getStream(r.fd);

          if (r.prot & 2) {
            er.doMsync(e, n, t, r.flags, r.offset);
          }

          $t.munmap(n);
          er.mappings[e] = null;

          if (r.allocated) {
            Wn(r.malloc);
          }
        }

        return 0;
      }

      function vr(e, t) {
        try {
          return _r(e, t);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function Tr(e, t, r) {
        er.varargs = r;

        try {
          var n = er.getStr(e);
          var o = er.get();
          var i = $t.open(n, t, o);
          return i.fd;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function gr(e, t, r) {
        try {
          var n = er.getStreamFromFD(e);
          return $t.read(n, Pe, t, r);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function wr(e, t, r) {
        try {
          e = er.getStr(e);
          return er.doReadlink(e, t, r);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function yr(e) {
        try {
          e = er.getStr(e);
          $t.rmdir(e);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function Or(e, t) {
        try {
          e = er.getStr(e);
          return er.doStat($t.stat, e, t);
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function br(e) {
        try {
          e = er.getStr(e);
          $t.unlink(e);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return -e.errno;
        }
      }

      function Dr(e, t, r) {
        Fe.copyWithin(e, t, t + r);
      }

      function Rr() {
        return Fe.length;
      }

      function Ar(e) {
        try {
          Y.grow(e - Me.byteLength + 65535 >>> 16);
          je(Y.buffer);
          return 1;
        } catch (t) {
          console.error("emscripten_realloc_buffer: Attempted to grow heap from " + Me.byteLength + " bytes to " + e + " bytes, but got error: " + t);
        }
      }

      function Sr(e) {
        e = e >>> 0;
        var t = Rr();
        Z(e > t);
        var r = 2147483648;

        if (e > r) {
          O("Cannot enlarge memory, asked to go up to " + e + " bytes, but the limit is " + r + " bytes!");
          return false;
        }

        var n = 16777216;

        for (var o = 1; o <= 4; o *= 2) {
          var i = t * (1 + .2 / o);
          i = Math.min(i, e + 100663296);
          var a = Math.min(r, Ae(Math.max(n, e, i), 65536));
          var s = Ar(a);

          if (s) {
            return true;
          }
        }

        O("Failed to grow the heap from " + t + " bytes to " + a + " bytes, not enough memory!");
        return false;
      }

      var Mr = {};

      function Pr() {
        return u || "./this.program";
      }

      function Fr() {
        if (!Fr.strings) {
          var e = ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === "object" && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8";
          var t = {
            USER: "web_user",
            LOGNAME: "web_user",
            PATH: "/",
            PWD: "/",
            HOME: "/home/web_user",
            LANG: e,
            _: Pr()
          };

          for (var r in Mr) {
            t[r] = Mr[r];
          }

          var n = [];

          for (var r in t) {
            n.push(r + "=" + t[r]);
          }

          Fr.strings = n;
        }

        return Fr.strings;
      }

      function Nr(e, t) {
        var r = 0;
        Fr().forEach(function (n, o) {
          var i = t + r;
          xe[e + o * 4 >> 2] = i;
          be(n, i);
          r += n.length + 1;
        });
        return 0;
      }

      function Ir(e, t) {
        var r = Fr();
        xe[e >> 2] = r.length;
        var n = 0;
        r.forEach(function (e) {
          n += e.length + 1;
        });
        xe[t >> 2] = n;
        return 0;
      }

      function xr(e) {
        try {
          var t = er.getStreamFromFD(e);
          $t.close(t);
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return e.errno;
        }
      }

      function kr(e, t) {
        try {
          var r = er.getStreamFromFD(e);
          var n = r.tty ? 2 : $t.isDir(r.mode) ? 3 : $t.isLink(r.mode) ? 7 : 4;
          Pe[t >> 0] = n;
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return e.errno;
        }
      }

      function Xr(e, t, r, n, o) {
        try {
          var i = er.getStreamFromFD(e);
          var a = 4294967296;
          var s = r * a + (t >>> 0);
          var u = 9007199254740992;

          if (s <= -u || s >= u) {
            return -61;
          }

          $t.llseek(i, s, n);
          Pt = [i.position >>> 0, (Mt = i.position, +Math.abs(Mt) >= 1 ? Mt > 0 ? (Math.min(+Math.floor(Mt / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((Mt - +(~~Mt >>> 0)) / 4294967296) >>> 0 : 0)], xe[o >> 2] = Pt[0], xe[o + 4 >> 2] = Pt[1];
          if (i.getdents && s === 0 && n === 0) i.getdents = null;
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return e.errno;
        }
      }

      function Ur(e) {
        try {
          var t = er.getStreamFromFD(e);

          if (t.stream_ops && t.stream_ops.fsync) {
            return -t.stream_ops.fsync(t);
          }

          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return e.errno;
        }
      }

      function jr(e, t, r, n) {
        try {
          var o = er.getStreamFromFD(e);
          var i = er.doWritev(o, t, r);
          xe[n >> 2] = i;
          return 0;
        } catch (e) {
          if (typeof $t === "undefined" || !(e instanceof $t.ErrnoError)) _t(e);
          return e.errno;
        }
      }

      function Lr(e) {
        var t = Date.now();
        xe[e >> 2] = t / 1e3 | 0;
        xe[e + 4 >> 2] = t % 1e3 * 1e3 | 0;
        return 0;
      }

      var Hr;

      if (d) {
        Hr = function Hr() {
          var e = process["hrtime"]();
          return e[0] * 1e3 + e[1] / 1e6;
        };
      } else if (typeof dateNow !== "undefined") {
        Hr = dateNow;
      } else Hr = function Hr() {
        return performance.now();
      };

      function Cr(e) {
        var t = Hr();

        while (Hr() - t < e / 1e3) {}
      }

      n["_usleep"] = Cr;

      function qr(e, t) {
        if (e === 0) {
          zt(28);
          return -1;
        }

        var r = xe[e >> 2];
        var n = xe[e + 4 >> 2];

        if (n < 0 || n > 999999999 || r < 0) {
          zt(28);
          return -1;
        }

        if (t !== 0) {
          xe[t >> 2] = 0;
          xe[t + 4 >> 2] = 0;
        }

        return Cr(r * 1e6 + n / 1e3);
      }

      function Qr(e) {
      }

      function Br(e) {
        switch (e) {
          case 30:
            return 16384;

          case 85:
            var t = 2147483648;
            return t / 16384;

          case 132:
          case 133:
          case 12:
          case 137:
          case 138:
          case 15:
          case 235:
          case 16:
          case 17:
          case 18:
          case 19:
          case 20:
          case 149:
          case 13:
          case 10:
          case 236:
          case 153:
          case 9:
          case 21:
          case 22:
          case 159:
          case 154:
          case 14:
          case 77:
          case 78:
          case 139:
          case 80:
          case 81:
          case 82:
          case 68:
          case 67:
          case 164:
          case 11:
          case 29:
          case 47:
          case 48:
          case 95:
          case 52:
          case 51:
          case 46:
          case 79:
            return 200809;

          case 27:
          case 246:
          case 127:
          case 128:
          case 23:
          case 24:
          case 160:
          case 161:
          case 181:
          case 182:
          case 242:
          case 183:
          case 184:
          case 243:
          case 244:
          case 245:
          case 165:
          case 178:
          case 179:
          case 49:
          case 50:
          case 168:
          case 169:
          case 175:
          case 170:
          case 171:
          case 172:
          case 97:
          case 76:
          case 32:
          case 173:
          case 35:
            return -1;

          case 176:
          case 177:
          case 7:
          case 155:
          case 8:
          case 157:
          case 125:
          case 126:
          case 92:
          case 93:
          case 129:
          case 130:
          case 131:
          case 94:
          case 91:
            return 1;

          case 74:
          case 60:
          case 69:
          case 70:
          case 4:
            return 1024;

          case 31:
          case 42:
          case 72:
            return 32;

          case 87:
          case 26:
          case 33:
            return 2147483647;

          case 34:
          case 1:
            return 47839;

          case 38:
          case 36:
            return 99;

          case 43:
          case 37:
            return 2048;

          case 0:
            return 2097152;

          case 3:
            return 65536;

          case 28:
            return 32768;

          case 44:
            return 32767;

          case 75:
            return 16384;

          case 39:
            return 1e3;

          case 89:
            return 700;

          case 71:
            return 256;

          case 40:
            return 255;

          case 2:
            return 100;

          case 180:
            return 64;

          case 25:
            return 20;

          case 5:
            return 16;

          case 6:
            return 6;

          case 73:
            return 4;

          case 84:
            {
              if ((typeof navigator === "undefined" ? "undefined" : _typeof(navigator)) === "object") return navigator["hardwareConcurrency"] || 1;
              return 1;
            }
        }

        zt(28);
        return -1;
      }

      function zr(e) {
        var t = Date.now() / 1e3 | 0;

        if (e) {
          xe[e >> 2] = t;
        }

        return t;
      }

      function Wr(e, t) {
        var r;

        if (t) {
          var n = 8 + 0;
          r = xe[t + n >> 2] * 1e3;
          n = 8 + 4;
          r += xe[t + n >> 2] / 1e3;
        } else {
          r = Date.now();
        }

        e = se(e);

        try {
          $t.utime(e, r, r);
          return 0;
        } catch (e) {
          $t.handleFSError(e);
          return -1;
        }
      }

      var Gr = function Gr(e, t, r, n) {
        if (!e) {
          e = this;
        }

        this.parent = e;
        this.mount = e.mount;
        this.mounted = null;
        this.id = $t.nextInode++;
        this.name = t;
        this.mode = r;
        this.node_ops = {};
        this.stream_ops = {};
        this.rdev = n;
      };

      var Yr = 292 | 73;
      var Vr = 146;
      Object.defineProperties(Gr.prototype, {
        read: {
          get: function get() {
            return (this.mode & Yr) === Yr;
          },
          set: function set(e) {
            e ? this.mode |= Yr : this.mode &= ~Yr;
          }
        },
        write: {
          get: function get() {
            return (this.mode & Vr) === Vr;
          },
          set: function set(e) {
            e ? this.mode |= Vr : this.mode &= ~Vr;
          }
        },
        isFolder: {
          get: function get() {
            return $t.isDir(this.mode);
          }
        },
        isDevice: {
          get: function get() {
            return $t.isChrdev(this.mode);
          }
        }
      });
      $t.FSNode = Gr;
      $t.staticInit();

      function Jr(e, t, r) {
        var n = r > 0 ? r : fe(e) + 1;
        var o = new Array(n);
        var i = ue(e, o, 0, o.length);
        if (t) o.length = i;
        return o;
      }

      Ye.push({
        func: function func() {
          tn();
        }
      });
      var $r = {
        __assert_fail: Ht,
        __localtime_r: Qt,
        __sys_access: tr,
        __sys_chmod: rr,
        __sys_chown32: nr,
        __sys_fchmod: or,
        __sys_fchown32: ir,
        __sys_fcntl64: ar,
        __sys_fstat64: sr,
        __sys_ftruncate64: ur,
        __sys_getcwd: cr,
        __sys_geteuid32: lr,
        __sys_getpid: dr,
        __sys_lstat64: pr,
        __sys_mkdir: Er,
        __sys_mmap2: mr,
        __sys_munmap: vr,
        __sys_open: Tr,
        __sys_read: gr,
        __sys_readlink: wr,
        __sys_rmdir: yr,
        __sys_stat64: Or,
        __sys_unlink: br,
        emscripten_memcpy_big: Dr,
        emscripten_resize_heap: Sr,
        environ_get: Nr,
        environ_sizes_get: Ir,
        fd_close: xr,
        fd_fdstat_get: kr,
        fd_seek: Xr,
        fd_sync: Ur,
        fd_write: jr,
        gettimeofday: Lr,
        memory: Y,
        nanosleep: qr,
        setTempRet0: Qr,
        sysconf: Br,
        time: zr,
        utimes: Wr
      };
      var en = St();
      var tn = n["___wasm_call_ctors"] = bt("__wasm_call_ctors");
      var rn = n["_memset"] = bt("memset");
      var nn = n["_sqlite3_free"] = bt("sqlite3_free");
      var on = n["___errno_location"] = bt("__errno_location");
      var an = n["_sqlite3_finalize"] = bt("sqlite3_finalize");
      var sn = n["_sqlite3_reset"] = bt("sqlite3_reset");
      var un = n["_sqlite3_clear_bindings"] = bt("sqlite3_clear_bindings");
      var cn = n["_sqlite3_value_blob"] = bt("sqlite3_value_blob");
      var fn = n["_sqlite3_value_text"] = bt("sqlite3_value_text");
      var ln = n["_sqlite3_value_bytes"] = bt("sqlite3_value_bytes");
      var dn = n["_sqlite3_value_double"] = bt("sqlite3_value_double");
      var pn = n["_sqlite3_value_int"] = bt("sqlite3_value_int");
      var En = n["_sqlite3_value_type"] = bt("sqlite3_value_type");
      var hn = n["_sqlite3_result_blob"] = bt("sqlite3_result_blob");
      var mn = n["_sqlite3_result_double"] = bt("sqlite3_result_double");

      var _n = n["_sqlite3_result_error"] = bt("sqlite3_result_error");

      var vn = n["_sqlite3_result_int"] = bt("sqlite3_result_int");
      var Tn = n["_sqlite3_result_int64"] = bt("sqlite3_result_int64");
      var gn = n["_sqlite3_result_null"] = bt("sqlite3_result_null");
      var wn = n["_sqlite3_result_text"] = bt("sqlite3_result_text");
      var yn = n["_sqlite3_step"] = bt("sqlite3_step");
      var On = n["_sqlite3_column_count"] = bt("sqlite3_column_count");
      var bn = n["_sqlite3_data_count"] = bt("sqlite3_data_count");
      var Dn = n["_sqlite3_column_blob"] = bt("sqlite3_column_blob");
      var Rn = n["_sqlite3_column_bytes"] = bt("sqlite3_column_bytes");
      var An = n["_sqlite3_column_double"] = bt("sqlite3_column_double");
      var Sn = n["_sqlite3_column_text"] = bt("sqlite3_column_text");
      var Mn = n["_sqlite3_column_type"] = bt("sqlite3_column_type");
      var Pn = n["_sqlite3_column_name"] = bt("sqlite3_column_name");
      var Fn = n["_sqlite3_bind_blob"] = bt("sqlite3_bind_blob");
      var Nn = n["_sqlite3_bind_double"] = bt("sqlite3_bind_double");
      var In = n["_sqlite3_bind_int"] = bt("sqlite3_bind_int");
      var xn = n["_sqlite3_bind_text"] = bt("sqlite3_bind_text");
      var kn = n["_sqlite3_bind_parameter_index"] = bt("sqlite3_bind_parameter_index");
      var Xn = n["_sqlite3_sql"] = bt("sqlite3_sql");
      var Un = n["_sqlite3_normalized_sql"] = bt("sqlite3_normalized_sql");
      var jn = n["_sqlite3_errmsg"] = bt("sqlite3_errmsg");
      var Ln = n["_sqlite3_exec"] = bt("sqlite3_exec");
      var Hn = n["_sqlite3_prepare_v2"] = bt("sqlite3_prepare_v2");
      var Cn = n["_sqlite3_changes"] = bt("sqlite3_changes");
      var qn = n["_sqlite3_close_v2"] = bt("sqlite3_close_v2");
      var Qn = n["_sqlite3_create_function_v2"] = bt("sqlite3_create_function_v2");
      var Bn = n["_sqlite3_open"] = bt("sqlite3_open");
      var zn = n["_malloc"] = bt("malloc");
      var Wn = n["_free"] = bt("free");
      var Gn = n["_RegisterExtensionFunctions"] = bt("RegisterExtensionFunctions");
      var Yn = n["_fflush"] = bt("fflush");
      var Vn = n["__get_tzname"] = bt("_get_tzname");
      var Kn = n["__get_daylight"] = bt("_get_daylight");
      var Jn = n["__get_timezone"] = bt("_get_timezone");
      var Zn = n["stackSave"] = bt("stackSave");
      var $n = n["stackRestore"] = bt("stackRestore");
      var eo = n["stackAlloc"] = bt("stackAlloc");
      var to = n["_memalign"] = bt("memalign");
      var ro = n["dynCall_iiiij"] = bt("dynCall_iiiij");
      var no = n["dynCall_iij"] = bt("dynCall_iij");
      var oo = n["dynCall_iijii"] = bt("dynCall_iijii");
      var io = n["dynCall_iiji"] = bt("dynCall_iiji");
      var ao = n["dynCall_iiiiiij"] = bt("dynCall_iiiiiij");
      var so = n["dynCall_viji"] = bt("dynCall_viji");
      var uo = n["dynCall_jiji"] = bt("dynCall_jiji");
      if (!Object.getOwnPropertyDescriptor(n, "intArrayFromString")) n["intArrayFromString"] = function () {
        _t("'intArrayFromString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "intArrayToString")) n["intArrayToString"] = function () {
        _t("'intArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "ccall")) n["ccall"] = function () {
        _t("'ccall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      n["cwrap"] = te;
      if (!Object.getOwnPropertyDescriptor(n, "setValue")) n["setValue"] = function () {
        _t("'setValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getValue")) n["getValue"] = function () {
        _t("'getValue' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "allocate")) n["allocate"] = function () {
        _t("'allocate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "UTF8ArrayToString")) n["UTF8ArrayToString"] = function () {
        _t("'UTF8ArrayToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      n["UTF8ToString"] = se;
      if (!Object.getOwnPropertyDescriptor(n, "stringToUTF8Array")) n["stringToUTF8Array"] = function () {
        _t("'stringToUTF8Array' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "stringToUTF8")) n["stringToUTF8"] = function () {
        _t("'stringToUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "lengthBytesUTF8")) n["lengthBytesUTF8"] = function () {
        _t("'lengthBytesUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "stackTrace")) n["stackTrace"] = function () {
        _t("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "addOnPreRun")) n["addOnPreRun"] = function () {
        _t("'addOnPreRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "addOnInit")) n["addOnInit"] = function () {
        _t("'addOnInit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "addOnPreMain")) n["addOnPreMain"] = function () {
        _t("'addOnPreMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "addOnExit")) n["addOnExit"] = function () {
        _t("'addOnExit' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "addOnPostRun")) n["addOnPostRun"] = function () {
        _t("'addOnPostRun' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeStringToMemory")) n["writeStringToMemory"] = function () {
        _t("'writeStringToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeArrayToMemory")) n["writeArrayToMemory"] = function () {
        _t("'writeArrayToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeAsciiToMemory")) n["writeAsciiToMemory"] = function () {
        _t("'writeAsciiToMemory' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "addRunDependency")) n["addRunDependency"] = function () {
        _t("'addRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "removeRunDependency")) n["removeRunDependency"] = function () {
        _t("'removeRunDependency' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_createFolder")) n["FS_createFolder"] = function () {
        _t("'FS_createFolder' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_createPath")) n["FS_createPath"] = function () {
        _t("'FS_createPath' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_createDataFile")) n["FS_createDataFile"] = function () {
        _t("'FS_createDataFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_createPreloadedFile")) n["FS_createPreloadedFile"] = function () {
        _t("'FS_createPreloadedFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_createLazyFile")) n["FS_createLazyFile"] = function () {
        _t("'FS_createLazyFile' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_createLink")) n["FS_createLink"] = function () {
        _t("'FS_createLink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_createDevice")) n["FS_createDevice"] = function () {
        _t("'FS_createDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS_unlink")) n["FS_unlink"] = function () {
        _t("'FS_unlink' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ). Alternatively, forcing filesystem support (-s FORCE_FILESYSTEM=1) can export this for you");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getLEB")) n["getLEB"] = function () {
        _t("'getLEB' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getFunctionTables")) n["getFunctionTables"] = function () {
        _t("'getFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "alignFunctionTables")) n["alignFunctionTables"] = function () {
        _t("'alignFunctionTables' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "registerFunctions")) n["registerFunctions"] = function () {
        _t("'registerFunctions' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "addFunction")) n["addFunction"] = function () {
        _t("'addFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "removeFunction")) n["removeFunction"] = function () {
        _t("'removeFunction' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getFuncWrapper")) n["getFuncWrapper"] = function () {
        _t("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "prettyPrint")) n["prettyPrint"] = function () {
        _t("'prettyPrint' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "makeBigInt")) n["makeBigInt"] = function () {
        _t("'makeBigInt' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "dynCall")) n["dynCall"] = function () {
        _t("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getCompilerSetting")) n["getCompilerSetting"] = function () {
        _t("'getCompilerSetting' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "print")) n["print"] = function () {
        _t("'print' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "printErr")) n["printErr"] = function () {
        _t("'printErr' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getTempRet0")) n["getTempRet0"] = function () {
        _t("'getTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "setTempRet0")) n["setTempRet0"] = function () {
        _t("'setTempRet0' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "callMain")) n["callMain"] = function () {
        _t("'callMain' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "abort")) n["abort"] = function () {
        _t("'abort' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "stringToNewUTF8")) n["stringToNewUTF8"] = function () {
        _t("'stringToNewUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "emscripten_realloc_buffer")) n["emscripten_realloc_buffer"] = function () {
        _t("'emscripten_realloc_buffer' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "ENV")) n["ENV"] = function () {
        _t("'ENV' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "ERRNO_CODES")) n["ERRNO_CODES"] = function () {
        _t("'ERRNO_CODES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "ERRNO_MESSAGES")) n["ERRNO_MESSAGES"] = function () {
        _t("'ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "setErrNo")) n["setErrNo"] = function () {
        _t("'setErrNo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "DNS")) n["DNS"] = function () {
        _t("'DNS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getHostByName")) n["getHostByName"] = function () {
        _t("'getHostByName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "GAI_ERRNO_MESSAGES")) n["GAI_ERRNO_MESSAGES"] = function () {
        _t("'GAI_ERRNO_MESSAGES' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "Protocols")) n["Protocols"] = function () {
        _t("'Protocols' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "Sockets")) n["Sockets"] = function () {
        _t("'Sockets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getRandomDevice")) n["getRandomDevice"] = function () {
        _t("'getRandomDevice' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "traverseStack")) n["traverseStack"] = function () {
        _t("'traverseStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "UNWIND_CACHE")) n["UNWIND_CACHE"] = function () {
        _t("'UNWIND_CACHE' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "withBuiltinMalloc")) n["withBuiltinMalloc"] = function () {
        _t("'withBuiltinMalloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "readAsmConstArgsArray")) n["readAsmConstArgsArray"] = function () {
        _t("'readAsmConstArgsArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "readAsmConstArgs")) n["readAsmConstArgs"] = function () {
        _t("'readAsmConstArgs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "mainThreadEM_ASM")) n["mainThreadEM_ASM"] = function () {
        _t("'mainThreadEM_ASM' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "jstoi_q")) n["jstoi_q"] = function () {
        _t("'jstoi_q' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "jstoi_s")) n["jstoi_s"] = function () {
        _t("'jstoi_s' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getExecutableName")) n["getExecutableName"] = function () {
        _t("'getExecutableName' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "listenOnce")) n["listenOnce"] = function () {
        _t("'listenOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "autoResumeAudioContext")) n["autoResumeAudioContext"] = function () {
        _t("'autoResumeAudioContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "dynCallLegacy")) n["dynCallLegacy"] = function () {
        _t("'dynCallLegacy' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getDynCaller")) n["getDynCaller"] = function () {
        _t("'getDynCaller' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "dynCall")) n["dynCall"] = function () {
        _t("'dynCall' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "callRuntimeCallbacks")) n["callRuntimeCallbacks"] = function () {
        _t("'callRuntimeCallbacks' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "abortStackOverflow")) n["abortStackOverflow"] = function () {
        _t("'abortStackOverflow' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "reallyNegative")) n["reallyNegative"] = function () {
        _t("'reallyNegative' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "unSign")) n["unSign"] = function () {
        _t("'unSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "reSign")) n["reSign"] = function () {
        _t("'reSign' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "formatString")) n["formatString"] = function () {
        _t("'formatString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "PATH")) n["PATH"] = function () {
        _t("'PATH' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "PATH_FS")) n["PATH_FS"] = function () {
        _t("'PATH_FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "SYSCALLS")) n["SYSCALLS"] = function () {
        _t("'SYSCALLS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "syscallMmap2")) n["syscallMmap2"] = function () {
        _t("'syscallMmap2' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "syscallMunmap")) n["syscallMunmap"] = function () {
        _t("'syscallMunmap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "JSEvents")) n["JSEvents"] = function () {
        _t("'JSEvents' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "specialHTMLTargets")) n["specialHTMLTargets"] = function () {
        _t("'specialHTMLTargets' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "maybeCStringToJsString")) n["maybeCStringToJsString"] = function () {
        _t("'maybeCStringToJsString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "findEventTarget")) n["findEventTarget"] = function () {
        _t("'findEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "findCanvasEventTarget")) n["findCanvasEventTarget"] = function () {
        _t("'findCanvasEventTarget' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "polyfillSetImmediate")) n["polyfillSetImmediate"] = function () {
        _t("'polyfillSetImmediate' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "demangle")) n["demangle"] = function () {
        _t("'demangle' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "demangleAll")) n["demangleAll"] = function () {
        _t("'demangleAll' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "jsStackTrace")) n["jsStackTrace"] = function () {
        _t("'jsStackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "stackTrace")) n["stackTrace"] = function () {
        _t("'stackTrace' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getEnvStrings")) n["getEnvStrings"] = function () {
        _t("'getEnvStrings' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "checkWasiClock")) n["checkWasiClock"] = function () {
        _t("'checkWasiClock' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeI53ToI64")) n["writeI53ToI64"] = function () {
        _t("'writeI53ToI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeI53ToI64Clamped")) n["writeI53ToI64Clamped"] = function () {
        _t("'writeI53ToI64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeI53ToI64Signaling")) n["writeI53ToI64Signaling"] = function () {
        _t("'writeI53ToI64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeI53ToU64Clamped")) n["writeI53ToU64Clamped"] = function () {
        _t("'writeI53ToU64Clamped' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeI53ToU64Signaling")) n["writeI53ToU64Signaling"] = function () {
        _t("'writeI53ToU64Signaling' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "readI53FromI64")) n["readI53FromI64"] = function () {
        _t("'readI53FromI64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "readI53FromU64")) n["readI53FromU64"] = function () {
        _t("'readI53FromU64' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "convertI32PairToI53")) n["convertI32PairToI53"] = function () {
        _t("'convertI32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "convertU32PairToI53")) n["convertU32PairToI53"] = function () {
        _t("'convertU32PairToI53' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "exceptionLast")) n["exceptionLast"] = function () {
        _t("'exceptionLast' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "exceptionCaught")) n["exceptionCaught"] = function () {
        _t("'exceptionCaught' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "ExceptionInfoAttrs")) n["ExceptionInfoAttrs"] = function () {
        _t("'ExceptionInfoAttrs' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "ExceptionInfo")) n["ExceptionInfo"] = function () {
        _t("'ExceptionInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "CatchInfo")) n["CatchInfo"] = function () {
        _t("'CatchInfo' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "exception_addRef")) n["exception_addRef"] = function () {
        _t("'exception_addRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "exception_decRef")) n["exception_decRef"] = function () {
        _t("'exception_decRef' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "Browser")) n["Browser"] = function () {
        _t("'Browser' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "funcWrappers")) n["funcWrappers"] = function () {
        _t("'funcWrappers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "getFuncWrapper")) n["getFuncWrapper"] = function () {
        _t("'getFuncWrapper' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "setMainLoop")) n["setMainLoop"] = function () {
        _t("'setMainLoop' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "FS")) n["FS"] = function () {
        _t("'FS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "mmapAlloc")) n["mmapAlloc"] = function () {
        _t("'mmapAlloc' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "MEMFS")) n["MEMFS"] = function () {
        _t("'MEMFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "TTY")) n["TTY"] = function () {
        _t("'TTY' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "PIPEFS")) n["PIPEFS"] = function () {
        _t("'PIPEFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "SOCKFS")) n["SOCKFS"] = function () {
        _t("'SOCKFS' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "tempFixedLengthArray")) n["tempFixedLengthArray"] = function () {
        _t("'tempFixedLengthArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "miniTempWebGLFloatBuffers")) n["miniTempWebGLFloatBuffers"] = function () {
        _t("'miniTempWebGLFloatBuffers' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "heapObjectForWebGLType")) n["heapObjectForWebGLType"] = function () {
        _t("'heapObjectForWebGLType' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "heapAccessShiftForWebGLHeap")) n["heapAccessShiftForWebGLHeap"] = function () {
        _t("'heapAccessShiftForWebGLHeap' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "GL")) n["GL"] = function () {
        _t("'GL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "emscriptenWebGLGet")) n["emscriptenWebGLGet"] = function () {
        _t("'emscriptenWebGLGet' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "computeUnpackAlignedImageSize")) n["computeUnpackAlignedImageSize"] = function () {
        _t("'computeUnpackAlignedImageSize' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "emscriptenWebGLGetTexPixelData")) n["emscriptenWebGLGetTexPixelData"] = function () {
        _t("'emscriptenWebGLGetTexPixelData' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "emscriptenWebGLGetUniform")) n["emscriptenWebGLGetUniform"] = function () {
        _t("'emscriptenWebGLGetUniform' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "emscriptenWebGLGetVertexAttrib")) n["emscriptenWebGLGetVertexAttrib"] = function () {
        _t("'emscriptenWebGLGetVertexAttrib' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "writeGLArray")) n["writeGLArray"] = function () {
        _t("'writeGLArray' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "AL")) n["AL"] = function () {
        _t("'AL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "SDL_unicode")) n["SDL_unicode"] = function () {
        _t("'SDL_unicode' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "SDL_ttfContext")) n["SDL_ttfContext"] = function () {
        _t("'SDL_ttfContext' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "SDL_audio")) n["SDL_audio"] = function () {
        _t("'SDL_audio' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "SDL")) n["SDL"] = function () {
        _t("'SDL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "SDL_gfx")) n["SDL_gfx"] = function () {
        _t("'SDL_gfx' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "GLUT")) n["GLUT"] = function () {
        _t("'GLUT' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "EGL")) n["EGL"] = function () {
        _t("'EGL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "GLFW_Window")) n["GLFW_Window"] = function () {
        _t("'GLFW_Window' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "GLFW")) n["GLFW"] = function () {
        _t("'GLFW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "GLEW")) n["GLEW"] = function () {
        _t("'GLEW' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "IDBStore")) n["IDBStore"] = function () {
        _t("'IDBStore' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "runAndAbortIfError")) n["runAndAbortIfError"] = function () {
        _t("'runAndAbortIfError' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "warnOnce")) n["warnOnce"] = function () {
        _t("'warnOnce' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      n["stackSave"] = Zn;
      n["stackRestore"] = $n;
      n["stackAlloc"] = eo;
      if (!Object.getOwnPropertyDescriptor(n, "AsciiToString")) n["AsciiToString"] = function () {
        _t("'AsciiToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "stringToAscii")) n["stringToAscii"] = function () {
        _t("'stringToAscii' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "UTF16ToString")) n["UTF16ToString"] = function () {
        _t("'UTF16ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "stringToUTF16")) n["stringToUTF16"] = function () {
        _t("'stringToUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "lengthBytesUTF16")) n["lengthBytesUTF16"] = function () {
        _t("'lengthBytesUTF16' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "UTF32ToString")) n["UTF32ToString"] = function () {
        _t("'UTF32ToString' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "stringToUTF32")) n["stringToUTF32"] = function () {
        _t("'stringToUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "lengthBytesUTF32")) n["lengthBytesUTF32"] = function () {
        _t("'lengthBytesUTF32' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "allocateUTF8")) n["allocateUTF8"] = function () {
        _t("'allocateUTF8' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      if (!Object.getOwnPropertyDescriptor(n, "allocateUTF8OnStack")) n["allocateUTF8OnStack"] = function () {
        _t("'allocateUTF8OnStack' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
      };
      n["writeStackCookie"] = Be;
      n["checkStackCookie"] = ze;
      if (!Object.getOwnPropertyDescriptor(n, "ALLOC_NORMAL")) Object.defineProperty(n, "ALLOC_NORMAL", {
        configurable: true,
        get: function get() {
          _t("'ALLOC_NORMAL' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        }
      });
      if (!Object.getOwnPropertyDescriptor(n, "ALLOC_STACK")) Object.defineProperty(n, "ALLOC_STACK", {
        configurable: true,
        get: function get() {
          _t("'ALLOC_STACK' was not exported. add it to EXTRA_EXPORTED_RUNTIME_METHODS (see the FAQ)");
        }
      });
      var co;

      dt = function e() {
        if (!co) po();
        if (!co) dt = e;
      };

      function po(e) {

        if (ft > 0) {
          return;
        }

        Be();
        et();
        if (ft > 0) return;

        function t() {
          if (co) return;
          co = true;
          n["calledRun"] = true;
          if (K) return;
          tt();
          rt();
          if (n["onRuntimeInitialized"]) n["onRuntimeInitialized"]();
          Z(!n["_main"], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');
          ot();
        }

        if (n["setStatus"]) {
          n["setStatus"]("Running...");
          setTimeout(function () {
            setTimeout(function () {
              n["setStatus"]("");
            }, 1);
            t();
          }, 1);
        } else {
          t();
        }

        if (!K) ze();
      }

      n["run"] = po;

      if (n["preInit"]) {
        if (typeof n["preInit"] == "function") n["preInit"] = [n["preInit"]];

        while (n["preInit"].length > 0) {
          n["preInit"].pop()();
        }
      }
      po();
      return n;
    });
    return initSqlJsPromise;
  };

  if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && (typeof module === "undefined" ? "undefined" : _typeof(module)) === "object") {
    module.exports = initSqlJs;
    module.exports["default"] = initSqlJs;
  } else if (typeof define === "function" && define["amd"]) {
    define([], function () {
      return initSqlJs;
    });
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object") {
    exports["Module"] = initSqlJs;
  }

  var STORE = 'sqlite';
  var keyPath = 'buffer';
  var assign = Object.assign;

  var opener = function opener(name) {
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return new Promise(function (resolve, onerror) {
      assign(indexedDB.open(name, version), {
        onupgradeneeded: function onupgradeneeded(_ref) {
          var result = _ref.target.result;
          if (!result.objectStoreNames.contains(STORE)) result.createObjectStore(STORE).createIndex(keyPath, keyPath, {
            unique: true
          });
          resolve(result);
        },
        onsuccess: function onsuccess(_ref2) {
          var result = _ref2.target.result;
          resolve(result);
        },
        onerror: onerror
      });
    });
  };

  var init = function init() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return new Promise(function (resolve, onerror) {
      Promise.all([opener(options.name || 'sqlite-worker'), initSqlJs({
        locateFile: function locateFile(file) {
          return (options.dir || 'https://sql.js.org/dist') + '/' + file;
        }
      })]).then(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            idb = _ref4[0],
            Database = _ref4[1].Database;

        var store = function store(how) {
          return idb.transaction([STORE], how).objectStore(STORE);
        };

        assign(store('readonly').get(keyPath), {
          onsuccess: function onsuccess() {
            var queue = Promise.resolve();
            var result = this.result;
            var db = new Database(result || options.database || new Uint8Array(0));

            var save = function save() {
              queue = queue.then(function () {
                return new Promise(function (resolve, onerror) {
                  var uint8array = db["export"]();
                  assign(store('readwrite').put(uint8array, keyPath), {
                    onsuccess: function onsuccess() {
                      resolve();
                      if (options.update) options.update(uint8array);
                    },
                    onerror: onerror
                  });
                });
              });
            };

            if (!result) save();

            var _SQLiteTag = SQLiteTag({
              all: function all(sql, params, callback) {
                try {
                  var rows = db.exec(sql, params);
                  var _result = [];
                  rows.forEach(addItems, _result);
                  callback(null, _result);
                } catch (o_O) {
                  callback(o_O);
                }
              },
              get: function get(sql, params, callback) {
                try {
                  var rows = db.exec(sql + ' LIMIT 1', params);
                  var _result2 = [];
                  rows.forEach(addItems, _result2);
                  callback(null, _result2.shift() || null);
                } catch (o_O) {
                  callback(o_O);
                }
              },
              run: function run(sql, params, callback) {
                try {
                  callback(null, db.run(sql, params));
                } catch (o_O) {
                  callback(o_O);
                }
              }
            }),
                all = _SQLiteTag.all,
                get = _SQLiteTag.get,
                _query = _SQLiteTag.query,
                raw = _SQLiteTag.raw;

            var t = 0;
            resolve({
              all: all,
              get: get,
              raw: raw,
              query: function query(template) {
                if (/\b(?:INSERT|DELETE|UPDATE)\b/i.test(template[0])) {
                  clearTimeout(t);
                  t = setTimeout(save, options.timeout || 250);
                }

                return _query.apply(this, arguments);
              }
            });
          },
          onerror: onerror
        });
      })["catch"](onerror);
    });
  };

  function addItems(_ref5) {
    var columns = _ref5.columns,
        values = _ref5.values;

    for (var length = values.length, i = 0; i < length; i++) {
      var value = values[i];
      var item = {};

      for (var _length = columns.length, _i = 0; _i < _length; _i++) {
        item[columns[_i]] = value[_i];
      }

      this.push(item);
    }
  }

  var assign$1 = Object.assign;
  var cache$1 = new Map();
  var ids = 0;
  function SQLiteWorker(url, options) {
    var query = function query(how) {
      return function (template) {
        for (var _len = arguments.length, values = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          values[_key - 1] = arguments[_key];
        }

        return post(how, {
          template: template,
          values: values
        });
      };
    };

    var post = function post(action, options) {
      return new Promise(function (resolve, reject) {
        var id = ids++;
        cache$1.set(id, {
          resolve: resolve,
          reject: reject
        });
        worker.postMessage({
          id: id,
          action: action,
          options: options
        });
      });
    };

    var worker = assign$1(new Worker(url), {
      onmessage: function onmessage(_ref) {
        var _ref$data = _ref.data,
            id = _ref$data.id,
            result = _ref$data.result;

        var _cache$get = cache$1.get(id),
            resolve = _cache$get.resolve;

        cache$1["delete"](id);
        resolve(result);
      }
    });
    return post('init', options).then(function () {
      return {
        all: query('all'),
        get: query('get'),
        query: query('query')
      };
    });
  }

  exports.SQLiteWorker = SQLiteWorker;
  exports.init = init;

  return exports;

}({}));
