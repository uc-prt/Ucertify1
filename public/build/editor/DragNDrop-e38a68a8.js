
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { a5 as Lang, a6 as swal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, v as validate_slots, C as validate_each_argument, e as element, j as attr_dev, k as add_location, n as insert_dev, x as detach_dev, K as destroy_each, h as text, f as space, l as set_style, p as append_dev, q as listen_dev, F as set_data_dev, H as run_all, z as empty, B as noop, G as prop_dev, t as transition_in, r as group_outros, a as transition_out, u as check_outros, c as create_component, m as mount_component, b as destroy_component, o as onMount, g as globals, L as beforeUpdate, A as AH, X as XMLToJSON, w as writable } from './main-32dbc3f7.js';
import './style-inject.es-1c867377.js';
import { C as CodeMirror } from './codemirror-76151d00.js';
import { D as Draggable } from './Draggable-366ea254.js';
import { R as Resizable } from './Resizable-87a71a4a.js';
import './codemirror.min-41ad232c.js';

class ContextMenu {
    constructor(container, items) {
        this.container = container;
        this.dom = null;
        this.shown = false;
        this.root = true;
        this.parent = null;
        this.submenus = [];
        this.items = items;

        this._onclick = e => {
            if (this.dom && e.target != this.dom && 
                e.target.parentElement != this.dom && 
                !e.target.classList.contains('item') && 
                !e.target.parentElement.classList.contains('item')) {
                this.hideAll();
            }
        };

        this._oncontextmenu = e => {
            e.preventDefault();
			if (e.target != this.dom && 
                e.target.parentElement != this.dom && 
                !e.target.classList.contains('item') && 
                !e.target.parentElement.classList.contains('item')) {
				this.hideAll();
				this.show(e.pageX, e.pageY);
                this.dom.setAttribute('clientx', Math.round(e.clientX));
                this.dom.setAttribute('clienty', Math.round(e.clientY));
            }
        };

        this._oncontextmenu_keydown = e => {
            if (e.keyCode != 93) return;
            e.preventDefault();

            this.hideAll();
            this.show(e.clientX, e.clientY);
        };

        this._onblur = e => {
            this.hideAll();
        };
    }

    checkPosition(position, node) {
        let boundry = document.querySelector(self.container).getBoundingClientRect();
        let x = e.pageX;
        let y = e.pageY;
        let dimension = {
            width : node.offsetWidth / 2,
            height: node.offsetHeight / 2,
        };
        if (position.x < dimension.width) {
            x = dimension.width;
        } else if (position.x > (boundry.width -  dimension.width) ) {
            x = (boundry.width -  dimension.width);
        } 

        if (position.y < dimension.height) {
            y = dimension.height;
        } else if (position.y > (boundry.height -  dimension.height)) {
            y = (boundry.height -  dimension.height);
        }

        return [x, y];
    }

    getMenuDom() {
        const menu = document.createElement('div');
        menu.classList.add('context');

        for (const item of this.items) {
            menu.appendChild(this.itemToDomEl(item));
        }

        return menu;
    }

    itemToDomEl(data) {
        const item = document.createElement('div');

        if (data === null) {
            item.classList = 'separator';
            return item;
        }

        if (data.hasOwnProperty('color') && /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.color.toString())) {
            item.style.cssText = `color: ${data.color}`;
        }

        item.classList.add('item');

        const label = document.createElement('span');
        label.classList = 'label';
        label.innerText = data.hasOwnProperty('text') ? data['text'].toString() : '';
        item.appendChild(label);

        if (data.hasOwnProperty('disabled') && data['disabled']) {
            item.classList.add('disabled');
        } else {
            item.classList.add('enabled');
        }

        const hotkey = document.createElement('span');
        hotkey.classList = 'hotkey';
        hotkey.innerText = data.hasOwnProperty('hotkey') ? data['hotkey'].toString() : '';
        item.appendChild(hotkey);

        if (data.hasOwnProperty('subitems') && Array.isArray(data['subitems']) && data['subitems'].length > 0) {
            const menu = new ContextMenu(this.container, data['subitems']);
            menu.root = false;
            menu.parent = this;

            const openSubItems = e => {
                if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                    return;

                this.hideSubMenus();

                const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                const y = this.dom.offsetTop + item.offsetTop;

                if (!menu.shown) {
                    menu.show(x, y);
                } else {
                    menu.hide();
                }
            };

            this.submenus.push(menu);

            item.classList.add('has-subitems');
            item.addEventListener('click', openSubItems);
            item.addEventListener('mousemove', openSubItems);
        } else if (data.hasOwnProperty('submenu') && data['submenu'] instanceof ContextMenu) {
            const menu = data['submenu'];
            menu.root = false;
            menu.parent = this;

            const openSubItems = e => {
                if (data.hasOwnProperty('disabled') && data['disabled'] == true)
                    return;

                this.hideSubMenus();

                const x = this.dom.offsetLeft + this.dom.clientWidth + item.offsetLeft;
                const y = this.dom.offsetTop + item.offsetTop;

                if (!menu.shown) {
                    menu.show(x, y);
                } else {
                    menu.hide();
                }
            };

            this.submenus.push(menu);

            item.classList.add('has-subitems');
            item.addEventListener('click', openSubItems);
            item.addEventListener('mousemove', openSubItems);
        } else {
            item.addEventListener('click', e => { 
                this.hideSubMenus();

                if (item.classList.contains('disabled'))
                    return;

                if (data.hasOwnProperty('onclick') && typeof data['onclick'] === 'function') {
                    const event = {
                        handled: false,
                        item: item,
                        label: label,
                        hotkey: hotkey,
                        items: this.items,
                        data: data
                    };
        
                    data['onclick'](event);
        
                    if (!event.handled) {
                        this.hide();
                    }
                } else {
                    this.hide();
                }
            });

            item.addEventListener('mousemove', e => {
                this.hideSubMenus();
            });
        }

        return item;
    }

    hideAll() {
        if (this.root && !this.parent) {
            if (this.shown) {
                this.hideSubMenus();

                this.shown = false;
                document.body.removeChild(this.dom);

                if (this.parent && this.parent.shown) {
                    this.parent.hide();
                }
            }

            return;
        }

        this.parent.hide();
    }

    hide() {
        if (this.dom && this.shown) {
            this.shown = false;
            this.hideSubMenus();
            document.body.removeChild(this.dom);

            if (this.parent && this.parent.shown) {
                this.parent.hide();
            }
        }
    }

    hideSubMenus() {
        for (const menu of this.submenus) {
            if (menu.shown) {
                menu.shown = false;
                document.body.removeChild(menu.dom);
            }
            menu.hideSubMenus();
        }
    }

    show(x, y) {
        this.dom = this.getMenuDom();
        
        this.dom.style.left = `${x}px`;
        this.dom.style.top = `${y}px`;

        this.shown = true;
        document.body.appendChild(this.dom);
    }

    install() {
        this.container.addEventListener('contextmenu', this._oncontextmenu);
        this.container.addEventListener('keydown', this._oncontextmenu_keydown);
        this.container.addEventListener('click', this._onclick);
        window.addEventListener('blur', this._onblur);
    }

    uninstall() {
        this.dom = null;
        this.container.removeEventListener('contextmenu', this._oncontextmenu);
        this.container.removeEventListener('keydown', this._oncontextmenu_keydown);
        this.container.removeEventListener('click', this._onclick);
        window.removeEventListener('blur', this._onblur);
    }
}

// TODO actually recognize syntax of TypeScript constructs

undefined("javascript", function(config, parserConfig) {
  var indentUnit = config.indentUnit;
  var statementIndent = parserConfig.statementIndent;
  var jsonMode = parserConfig.json;
  var isTS = parserConfig.typescript;

  // Tokenizer

  var keywords = function(){
    function kw(type) {return {type: type, style: "keyword"};}
    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
    var operator = kw("operator"), atom = {type: "atom", style: "atom"};

    var jsKeywords = {
      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
      "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C,
      "var": kw("var"), "const": kw("var"), "let": kw("var"),
      "function": kw("function"), "catch": kw("catch"),
      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
      "in": operator, "typeof": operator, "instanceof": operator,
      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
      "this": kw("this"), "module": kw("module"), "class": kw("class"), "super": kw("atom"),
      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C
    };

    // Extend the 'normal' keywords with the TypeScript language extensions
    if (isTS) {
      var type = {type: "variable", style: "variable-3"};
      var tsKeywords = {
        // object-like things
        "interface": kw("interface"),
        "extends": kw("extends"),
        "constructor": kw("constructor"),

        // scope modifiers
        "public": kw("public"),
        "private": kw("private"),
        "protected": kw("protected"),
        "static": kw("static"),

        // types
        "string": type, "number": type, "bool": type, "any": type
      };

      for (var attr in tsKeywords) {
        jsKeywords[attr] = tsKeywords[attr];
      }
    }

    return jsKeywords;
  }();

  var isOperatorChar = /[+\-*&%=<>!?|~^]/;

  function nextUntilUnescaped(stream, end) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (next == end && !escaped)
        return false;
      escaped = !escaped && next == "\\";
    }
    return escaped;
  }

  // Used as scratch variables to communicate multiple values without
  // consing up tons of objects.
  var type, content;
  function ret(tp, style, cont) {
    type = tp; content = cont;
    return style;
  }
  function tokenBase(stream, state) {
    var ch = stream.next();
    if (ch == '"' || ch == "'") {
      state.tokenize = tokenString(ch);
      return state.tokenize(stream, state);
    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
      return ret("number", "number");
    } else if (ch == "." && stream.match("..")) {
      return ret("spread", "meta");
    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
      return ret(ch);
    } else if (ch == "=" && stream.eat(">")) {
      return ret("=>");
    } else if (ch == "0" && stream.eat(/x/i)) {
      stream.eatWhile(/[\da-f]/i);
      return ret("number", "number");
    } else if (/\d/.test(ch)) {
      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
      return ret("number", "number");
    } else if (ch == "/") {
      if (stream.eat("*")) {
        state.tokenize = tokenComment;
        return tokenComment(stream, state);
      } else if (stream.eat("/")) {
        stream.skipToEnd();
        return ret("comment", "comment");
      } else if (state.lastType == "operator" || state.lastType == "keyword c" ||
               state.lastType == "sof" || /^[\[{}\(,;:]$/.test(state.lastType)) {
        nextUntilUnescaped(stream, "/");
        stream.eatWhile(/[gimy]/); // 'y' is "sticky" option in Mozilla
        return ret("regexp", "string-2");
      } else {
        stream.eatWhile(isOperatorChar);
        return ret("operator", null, stream.current());
      }
    } else if (ch == "`") {
      state.tokenize = tokenQuasi;
      return tokenQuasi(stream, state);
    } else if (ch == "#") {
      stream.skipToEnd();
      return ret("error", "error");
    } else if (isOperatorChar.test(ch)) {
      stream.eatWhile(isOperatorChar);
      return ret("operator", null, stream.current());
    } else {
      stream.eatWhile(/[\w\$_]/);
      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
    }
  }

  function tokenString(quote) {
    return function(stream, state) {
      if (!nextUntilUnescaped(stream, quote))
        state.tokenize = tokenBase;
      return ret("string", "string");
    };
  }

  function tokenComment(stream, state) {
    var maybeEnd = false, ch;
    while (ch = stream.next()) {
      if (ch == "/" && maybeEnd) {
        state.tokenize = tokenBase;
        break;
      }
      maybeEnd = (ch == "*");
    }
    return ret("comment", "comment");
  }

  function tokenQuasi(stream, state) {
    var escaped = false, next;
    while ((next = stream.next()) != null) {
      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
        state.tokenize = tokenBase;
        break;
      }
      escaped = !escaped && next == "\\";
    }
    return ret("quasi", "string-2", stream.current());
  }

  var brackets = "([{}])";
  // This is a crude lookahead trick to try and notice that we're
  // parsing the argument patterns for a fat-arrow function before we
  // actually hit the arrow token. It only works if the arrow is on
  // the same line as the arguments and there's no strange noise
  // (comments) in between. Fallback is to only notice when we hit the
  // arrow, and not declare the arguments as locals for the arrow
  // body.
  function findFatArrow(stream, state) {
    if (state.fatArrowAt) state.fatArrowAt = null;
    var arrow = stream.string.indexOf("=>", stream.start);
    if (arrow < 0) return;

    var depth = 0, sawSomething = false;
    for (var pos = arrow - 1; pos >= 0; --pos) {
      var ch = stream.string.charAt(pos);
      var bracket = brackets.indexOf(ch);
      if (bracket >= 0 && bracket < 3) {
        if (!depth) { ++pos; break; }
        if (--depth == 0) break;
      } else if (bracket >= 3 && bracket < 6) {
        ++depth;
      } else if (/[$\w]/.test(ch)) {
        sawSomething = true;
      } else if (sawSomething && !depth) {
        ++pos;
        break;
      }
    }
    if (sawSomething && !depth) state.fatArrowAt = pos;
  }

  // Parser

  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true};

  function JSLexical(indented, column, type, align, prev, info) {
    this.indented = indented;
    this.column = column;
    this.type = type;
    this.prev = prev;
    this.info = info;
    if (align != null) this.align = align;
  }

  function inScope(state, varname) {
    for (var v = state.localVars; v; v = v.next)
      if (v.name == varname) return true;
    for (var cx = state.context; cx; cx = cx.prev) {
      for (var v = cx.vars; v; v = v.next)
        if (v.name == varname) return true;
    }
  }

  function parseJS(state, style, type, content, stream) {
    var cc = state.cc;
    // Communicate our context to the combinators.
    // (Less wasteful than consing up a hundred closures on every call.)
    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc;

    if (!state.lexical.hasOwnProperty("align"))
      state.lexical.align = true;

    while(true) {
      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
      if (combinator(type, content)) {
        while(cc.length && cc[cc.length - 1].lex)
          cc.pop()();
        if (cx.marked) return cx.marked;
        if (type == "variable" && inScope(state, content)) return "variable-2";
        return style;
      }
    }
  }

  // Combinator utils

  var cx = {state: null, column: null, marked: null, cc: null};
  function pass() {
    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
  }
  function cont() {
    pass.apply(null, arguments);
    return true;
  }
  function register(varname) {
    function inList(list) {
      for (var v = list; v; v = v.next)
        if (v.name == varname) return true;
      return false;
    }
    var state = cx.state;
    if (state.context) {
      cx.marked = "def";
      if (inList(state.localVars)) return;
      state.localVars = {name: varname, next: state.localVars};
    } else {
      if (inList(state.globalVars)) return;
      if (parserConfig.globalVars)
        state.globalVars = {name: varname, next: state.globalVars};
    }
  }

  // Combinators

  var defaultVars = {name: "this", next: {name: "arguments"}};
  function pushcontext() {
    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
    cx.state.localVars = defaultVars;
  }
  function popcontext() {
    cx.state.localVars = cx.state.context.vars;
    cx.state.context = cx.state.context.prev;
  }
  function pushlex(type, info) {
    var result = function() {
      var state = cx.state, indent = state.indented;
      if (state.lexical.type == "stat") indent = state.lexical.indented;
      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
    };
    result.lex = true;
    return result;
  }
  function poplex() {
    var state = cx.state;
    if (state.lexical.prev) {
      if (state.lexical.type == ")")
        state.indented = state.lexical.indented;
      state.lexical = state.lexical.prev;
    }
  }
  poplex.lex = true;

  function expect(wanted) {
    return function(type) {
      if (type == wanted) return cont();
      else if (wanted == ";") return pass();
      else return cont(arguments.callee);
    };
  }

  function statement(type, value) {
    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
    if (type == "{") return cont(pushlex("}"), block, poplex);
    if (type == ";") return cont();
    if (type == "if") return cont(pushlex("form"), expression, statement, poplex, maybeelse);
    if (type == "function") return cont(functiondef);
    if (type == "for") return cont(pushlex("form"), forspec, poplex, statement, poplex);
    if (type == "variable") return cont(pushlex("stat"), maybelabel);
    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
    if (type == "case") return cont(expression, expect(":"));
    if (type == "default") return cont(expect(":"));
    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
    if (type == "module") return cont(pushlex("form"), pushcontext, afterModule, popcontext, poplex);
    if (type == "class") return cont(pushlex("form"), className, objlit, poplex);
    if (type == "export") return cont(pushlex("form"), afterExport, poplex);
    if (type == "import") return cont(pushlex("form"), afterImport, poplex);
    return pass(pushlex("stat"), expression, expect(";"), poplex);
  }
  function expression(type) {
    return expressionInner(type, false);
  }
  function expressionNoComma(type) {
    return expressionInner(type, true);
  }
  function expressionInner(type, noComma) {
    if (cx.state.fatArrowAt == cx.stream.start) {
      var body = noComma ? arrowBodyNoComma : arrowBody;
      if (type == "(") return cont(pushcontext, commasep(pattern, ")"), expect("=>"), body, popcontext);
      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
    }

    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
    if (type == "function") return cont(functiondef);
    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
    if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
    if (type == "[") return cont(pushlex("]"), expressionNoComma, maybeArrayComprehension, poplex, maybeop);
    if (type == "{") return cont(commasep(objprop, "}"), maybeop);
    return cont();
  }
  function maybeexpression(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expression);
  }
  function maybeexpressionNoComma(type) {
    if (type.match(/[;\}\)\],]/)) return pass();
    return pass(expressionNoComma);
  }

  function maybeoperatorComma(type, value) {
    if (type == ",") return cont(expression);
    return maybeoperatorNoComma(type, value, false);
  }
  function maybeoperatorNoComma(type, value, noComma) {
    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
    var expr = noComma == false ? expression : expressionNoComma;
    if (value == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
    if (type == "operator") {
      if (/\+\+|--/.test(value)) return cont(me);
      if (value == "?") return cont(expression, expect(":"), expr);
      return cont(expr);
    }
    if (type == "quasi") { cx.cc.push(me); return quasi(value); }
    if (type == ";") return;
    if (type == "(") return cont(commasep(expressionNoComma, ")", "call"), me);
    if (type == ".") return cont(property, me);
    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
  }
  function quasi(value) {
    if (!value) debugger;
    if (value.slice(value.length - 2) != "${") return cont();
    return cont(expression, continueQuasi);
  }
  function continueQuasi(type) {
    if (type == "}") {
      cx.marked = "string-2";
      cx.state.tokenize = tokenQuasi;
      return cont();
    }
  }
  function arrowBody(type) {
    findFatArrow(cx.stream, cx.state);
    if (type == "{") return pass(statement);
    return pass(expression);
  }
  function arrowBodyNoComma(type) {
    findFatArrow(cx.stream, cx.state);
    if (type == "{") return pass(statement);
    return pass(expressionNoComma);
  }
  function maybelabel(type) {
    if (type == ":") return cont(poplex, statement);
    return pass(maybeoperatorComma, expect(";"), poplex);
  }
  function property(type) {
    if (type == "variable") {cx.marked = "property"; return cont();}
  }
  function objprop(type, value) {
    if (type == "variable") {
      cx.marked = "property";
      if (value == "get" || value == "set") return cont(getterSetter);
    } else if (type == "number" || type == "string") {
      cx.marked = type + " property";
    } else if (type == "[") {
      return cont(expression, expect("]"), afterprop);
    }
    if (atomicTypes.hasOwnProperty(type)) return cont(afterprop);
  }
  function getterSetter(type) {
    if (type != "variable") return pass(afterprop);
    cx.marked = "property";
    return cont(functiondef);
  }
  function afterprop(type) {
    if (type == ":") return cont(expressionNoComma);
    if (type == "(") return pass(functiondef);
  }
  function commasep(what, end, info) {
    function proceed(type) {
      if (type == ",") {
        var lex = cx.state.lexical;
        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
        return cont(what, proceed);
      }
      if (type == end) return cont();
      return cont(expect(end));
    }
    return function(type) {
      if (type == end) return cont();
      if (info === false) return pass(what, proceed);
      return pass(pushlex(end, info), what, proceed, poplex);
    };
  }
  function block(type) {
    if (type == "}") return cont();
    return pass(statement, block);
  }
  function maybetype(type) {
    if (isTS && type == ":") return cont(typedef);
  }
  function typedef(type) {
    if (type == "variable"){cx.marked = "variable-3"; return cont();}
  }
  function vardef() {
    return pass(pattern, maybetype, maybeAssign, vardefCont);
  }
  function pattern(type, value) {
    if (type == "variable") { register(value); return cont(); }
    if (type == "[") return cont(commasep(pattern, "]"));
    if (type == "{") return cont(commasep(proppattern, "}"));
  }
  function proppattern(type, value) {
    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
      register(value);
      return cont(maybeAssign);
    }
    if (type == "variable") cx.marked = "property";
    return cont(expect(":"), pattern, maybeAssign);
  }
  function maybeAssign(_type, value) {
    if (value == "=") return cont(expressionNoComma);
  }
  function vardefCont(type) {
    if (type == ",") return cont(vardef);
  }
  function maybeelse(type, value) {
    if (type == "keyword b" && value == "else") return cont(pushlex("form"), statement, poplex);
  }
  function forspec(type) {
    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"));
  }
  function forspec1(type) {
    if (type == "var") return cont(vardef, expect(";"), forspec2);
    if (type == ";") return cont(forspec2);
    if (type == "variable") return cont(formaybeinof);
    return pass(expression, expect(";"), forspec2);
  }
  function formaybeinof(_type, value) {
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return cont(maybeoperatorComma, forspec2);
  }
  function forspec2(type, value) {
    if (type == ";") return cont(forspec3);
    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
    return pass(expression, expect(";"), forspec3);
  }
  function forspec3(type) {
    if (type != ")") cont(expression);
  }
  function functiondef(type, value) {
    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
    if (type == "variable") {register(value); return cont(functiondef);}
    if (type == "(") return cont(pushcontext, commasep(funarg, ")"), statement, popcontext);
  }
  function funarg(type) {
    if (type == "spread") return cont(funarg);
    return pass(pattern, maybetype);
  }
  function className(type, value) {
    if (type == "variable") {register(value); return cont(classNameAfter);}
  }
  function classNameAfter(_type, value) {
    if (value == "extends") return cont(expression);
  }
  function objlit(type) {
    if (type == "{") return cont(commasep(objprop, "}"));
  }
  function afterModule(type, value) {
    if (type == "string") return cont(statement);
    if (type == "variable") { register(value); return cont(maybeFrom); }
  }
  function afterExport(_type, value) {
    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
    return pass(statement);
  }
  function afterImport(type) {
    if (type == "string") return cont();
    return pass(importSpec, maybeFrom);
  }
  function importSpec(type, value) {
    if (type == "{") return cont(commasep(importSpec, "}"));
    if (type == "variable") register(value);
    return cont();
  }
  function maybeFrom(_type, value) {
    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
  }
  function maybeArrayComprehension(type) {
    if (type == "for") return pass(comprehension);
    if (type == ",") return cont(commasep(expressionNoComma, "]", false));
    return pass(commasep(expressionNoComma, "]", false));
  }
  function comprehension(type) {
    if (type == "for") return cont(forspec, comprehension);
    if (type == "if") return cont(expression, comprehension);
  }

  // Interface

  return {
    startState: function(basecolumn) {
      var state = {
        tokenize: tokenBase,
        lastType: "sof",
        cc: [],
        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
        localVars: parserConfig.localVars,
        context: parserConfig.localVars && {vars: parserConfig.localVars},
        indented: 0
      };
      if (parserConfig.globalVars) state.globalVars = parserConfig.globalVars;
      return state;
    },

    token: function(stream, state) {
      if (stream.sol()) {
        if (!state.lexical.hasOwnProperty("align"))
          state.lexical.align = false;
        state.indented = stream.indentation();
        findFatArrow(stream, state);
      }
      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
      var style = state.tokenize(stream, state);
      if (type == "comment") return style;
      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
      return parseJS(state, style, type, content, stream);
    },

    indent: function(state, textAfter) {
      if (state.tokenize == tokenComment) return undefined;
      if (state.tokenize != tokenBase) return 0;
      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
      // Kludge to prevent 'maybelse' from blocking lexical scope pops
      for (var i = state.cc.length - 1; i >= 0; --i) {
        var c = state.cc[i];
        if (c == poplex) lexical = lexical.prev;
        else if (c != maybeelse) break;
      }
      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
        lexical = lexical.prev;
      var type = lexical.type, closing = firstChar == type;

      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
      else if (type == "form" && firstChar == "{") return lexical.indented;
      else if (type == "form") return lexical.indented + indentUnit;
      else if (type == "stat")
        return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? statementIndent || indentUnit : 0);
      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
      else return lexical.indented + (closing ? 0 : indentUnit);
    },

    electricChars: ":{}",
    blockCommentStart: jsonMode ? null : "/*",
    blockCommentEnd: jsonMode ? null : "*/",
    lineComment: jsonMode ? null : "//",
    fold: "brace",

    helperType: jsonMode ? "json" : "javascript",
    jsonMode: jsonMode
  };
});

undefined("text/javascript", "javascript");
undefined("text/ecmascript", "javascript");
undefined("application/javascript", "javascript");
undefined("application/ecmascript", "javascript");
undefined("application/json", {name: "javascript", json: true});
undefined("application/x-json", {name: "javascript", json: true});
undefined("text/typescript", { name: "javascript", typescript: true });
undefined("application/typescript", { name: "javascript", typescript: true });

/**
 *  File Name   : dndAuthString.js
 *  Author      : Ayush Srivastava
 *  Function    : DND_AUTH
 *  Version     : 1.0
 *  Packege     : Drag and Drop (auth)
 *  Last update : 19 Jan 2021
 *  Dependency  : AI , Contextmenu, Codemirror
 */

const DND_AUTH = {};

DND_AUTH.isDNDExtended = 0;
DND_AUTH.error_message = '';
// variable for detecting the visible authoring modal
DND_AUTH.visible_class = '';

/*
 * Used for storing the data of the dnd auth
 * in obj we always pass id of the node in which we have to save the data
 * DND_AUTH.storage.store() return all the store data 
 */
DND_AUTH.storage = {
    store: function(obj, key, val) {
        if (!obj) {
            return this.state;
        } else if (!key) {
            if (!(obj in this.state)) {
                return {};
            }
            return this.state[obj];
        } else if (arguments.length < 3) {
            if (!(obj in this.state)) {
                return undefined;
            }
            return this.state[obj][key];
        } else {
            if (!(obj in this.state)) {
                this.state[obj] = {};
            }
            this.state[obj][key] = val;
        }
    },
    state: {}
};

// Used for the contextmenu showing on the right click
DND_AUTH.contextMenuOption = function() {
    let dropdown = (DND_AUTH.isDNDExtended) ? [{
            text: Lang.draggable,
            onclick: () => {
                DND_AUTH.elemModal("drag");
            }
        },
        {
            text: Lang.placeholder,
            onclick: () => {
                DND_AUTH.elemModal("drop");
            }
        },
        null,
        {
            text: Lang.input,
            hotkey: '❯',
            subitems: [{
                    text: Lang.input_box,
                    onclick: () => {
                        DND_AUTH.elemModal("input");
                    }
                },
                {
                    text: Lang.checkbox_input,
                    onclick: () => {
                        DND_AUTH.elemModal("checkbox");
                    }
                },
                {
                    text: Lang.multiline_text_box,
                    onclick: () => {
                        DND_AUTH.elemModal("multiline");
                    }
                },
                {
                    text: Lang.radio_inout,
                    onclick: () => {
                        DND_AUTH.elemModal("radio");
                    }
                },
                {
                    text: Lang.btn_txt,
                    onclick: () => {
                        DND_AUTH.elemModal("button");
                    }
                },
            ]
        },
        null,
        {
            text: Lang.select,
            hotkey: '❯',
            subitems: [{
                    text: Lang.select_dropdown,
                    onclick: () => {
                        DND_AUTH.elemModal("dropdown");
                    }
                },
                {
                    text: Lang.new_menu,
                    onclick: () => {
                        DND_AUTH.elemModal("menulist");
                    }
                },
            ]
        },
        null,
        {
            text: Lang.clickable,
            onclick: () => {
                DND_AUTH.elemModal("tabhead");
            }
        },
        null,
        {
            text: Lang.new_label,
            onclick: () => {
                DND_AUTH.elemModal("label");
            }
        },
        null,
        {
            text: Lang.hotspot,
            onclick: () => {
                DND_AUTH.elemModal("hotspot");
            }
        },
        null,
        {
            text: Lang.new_tab,
            onclick: () => {
                DND_AUTH.elemModal("tab");
            }
        },
        {
            text: Lang.new_steps,
            onclick: () => {
                DND_AUTH.elemModal("step");
            }
        },
        {
            text: Lang.insert_script,
            onclick: () => {
                DND_AUTH.elemModal("jscript");
            }
        },
    ] : [{
            text: Lang.draggable,
            onclick: () => {
                DND_AUTH.elemModal("drag");
            }
        },
        {
            text: Lang.placeholder,
            onclick: () => {
                DND_AUTH.elemModal("drop");
            }
        },
        null,
        {
            text: Lang.input,
            hotkey: '❯',
            subitems: [{
                    text: Lang.input_box,
                    onclick: () => {
                        DND_AUTH.elemModal("input");
                    }
                },
                {
                    text: Lang.checkbox_input,
                    onclick: () => {
                        DND_AUTH.elemModal("checkbox");
                    }
                },
                {
                    text: Lang.multiline_text_box,
                    onclick: () => {
                        DND_AUTH.elemModal("multiline");
                    }
                },
                {
                    text: Lang.radio_inout,
                    onclick: () => {
                        DND_AUTH.elemModal("radio");
                    }
                },
                {
                    text: Lang.btn_txt,
                    onclick: () => {
                        DND_AUTH.elemModal("button");
                    }
                },
            ]
        },
        null,
        {
            text: Lang.select,
            onclick: () => {
                DND_AUTH.elemModal("dropdown");
            }
        },
        null,
        {
            text: Lang.clickable,
            onclick: () => {
                DND_AUTH.elemModal("tabhead");
            }
        },
        null,
        {
            text: Lang.new_label,
            onclick: () => {
                DND_AUTH.elemModal("label");
            }
        },
        null,
        {
            text: Lang.hotspot,
            onclick: () => {
                DND_AUTH.elemModal("hotspot");
            }
        }
    ];
    const dragndrop_contextmenu = new ContextMenu(AI.select('#dndmain'), dropdown);
    dragndrop_contextmenu.install();
};

// used for binding the data and store in the storage 
DND_AUTH.bind_data = function(xml) {
    let elem = xml.getAttribute('id'),
        attrs = [];
    if (xml.nodeName == "SMXML") {
        elem = "dndmain";
    }
    for (let index = 0; index < xml.attributes.length; index++) {
        attrs[index] = {
            "name": xml.attributes[index].name,
            "value": xml.attributes[index].value
        };
    }
    if (xml.children.length == 0 && xml.innerText.trim() != "") {
        attrs[attrs.length] = {
            "name": "value",
            "value": xml.innerText.trim()
        };
    }
    if (xml.nodeName == "MULTILINEBOX") {
        attrs[attrs.length] = {
            "name": "defaultans",
            "value": DND_AUTH.clearCdata(AI.find(xml, 'defaultans') ? AI.find(xml, 'defaultans').innerHTML : '')
        };
        attrs[attrs.length] = {
            "name": "correctans",
            "value": DND_AUTH.clearCdata(AI.find(xml, 'correctans') ? AI.find(xml, 'correctans').innerHTML : '')
        };
    }
    if (typeof elem != "undefined" && elem) {
        DND_AUTH.storage.store('#' + elem, 'attributes', attrs);
    }
    if (xml.children.length > 0) {
        for (let index = 0; index < xml.children.length; index++) {
            let nd = (xml.children[index].nodeName).toLowerCase(),
                obj = xml.children[index];
            if (nd == "jscript") {
                AI.select('#authoring-modal #code').value = obj.innerText;
                DND_AUTH.setfunc(obj.innerText);
            } else {
                DND_AUTH.bind_data(obj);
            }
        }
    }
};

// for clearing the cdata
DND_AUTH.clearCdata = function(text) {
    return (typeof text != "undefined" ? text.replace("<!--[CDATA[", "").replace("]]-->", "").trim() : "");
};

// for getting the offset
DND_AUTH.offset = function(element) {
    let rect = element.getBoundingClientRect();
    return {
        top: rect.top + document.body.scrollTop,
        left: rect.left + document.body.scrollLeft
    }
};

// for getting the position
DND_AUTH.position = function(element) {
    return {
        left: element.offsetLeft,
        top: element.offsetTop
    }
};

// function calls whenever the authoring modal is open and resposible for overall functionality of authoring modal
DND_AUTH.elemModal = function(type, _this, key, bgImg, state = {}) { 
    if (type != "jscript") {
        let objects = [];
        let data = AI.selectAll('#authoring-modal .h:not(.jscript)');
        let obj_index = 0;
        for (let index = 0; index < data.length; index++) {
            let subnode = AI.find(data[index], 'select,textarea,input', 'all');
            if (subnode.length > 0) {
                for (let subindex = 0; subindex < subnode.length; subindex++) {
                    objects[obj_index] = subnode[subindex];
                    obj_index++;
                }
            }
        }

        DND_AUTH.resetAttr(objects);
        AI.selectAll('#authoring-modal .events a', 'removeClass', 'active');
        AI.find('#authoring-modal', '.events a .icomoon-checkmark', {
            action: 'remove',
        });
    }
    let parent = AI.select('.parent').getAttribute("data-parent");
    let htmlparent = parent == "dndmain" ? "#dndmain" : parent;
    let pos = [];
    let labkey = key;
    let hptkey = key;
    if (typeof(key) == "undefined") {
        key = false;
        labkey = 'ID' + DND_AUTH.getID(AI.selectAll(('[id^=ID]')).length);
        if (_this && _this.length) {
            let cur_elem = AI.select(_this);
            hptkey = (cur_elem) ? cur_elem.getAttribute('id') + '_' + (AI.find(cur_elem, '.hs_item', 'all').length + 1) : '';
        }
    }
    try {
        if (AI.select('.context').getAttribute) {
            let o = DND_AUTH.offset(AI.select(htmlparent));
            pos[0] = parseInt(AI.select('.context').getAttribute('clienty')) - o.top;
            pos[1] = parseInt(AI.select('.context').getAttribute('clientx')) - o.left;
        }
    } catch (e) {
        console.warn("Top not found");
    }
    if (pos[0] < 0) {
        pos[0] = 0;
    }
    pos[0] = isNaN(pos[0]) ? 0 : Math.round(pos[0]);
    pos[1] = isNaN(pos[1]) ? 0 : Math.round(pos[1]);
    AI.selectAll('#authoring-modal .modal-body>.h', 'hide');

    AI.select('#authoring-modal .addElement', 'removeClass', 'h');
    AI.select('#authoring-modal .errorBtn', 'addClass', 'h');

    DND_AUTH.visible_class = '';
    DND_AUTH.error_message = '';
    switch (type) {
        case "drag":
            AI.select('#authoring-modal .modal-title').innerText = Lang.draggable + ' - ' + labkey;
            AI.selectAll('#authoring-modal .drag', 'show', 'block');
            AI.select('#authoring-modal #drag-top').value = pos[0];
            AI.select('#authoring-modal #drag-left').value = pos[1];
            AI.select('#authoring-modal #drag-id').value = labkey;
            DND_AUTH.visible_class = '.drag';
            break;
        case "drop":
            AI.select('#authoring-modal .modal-title').innerText = Lang.placeholder + ' - ' + labkey;
            AI.selectAll('#authoring-modal .dropitem', 'show', 'block');
            AI.select('#authoring-modal #drop-top').value = pos[0];
            AI.select('#authoring-modal #drop-left').value = pos[1];
            AI.select('#authoring-modal #drop-id').value = labkey;
            DND_AUTH.visible_class = '.dropitem';

            break;
        case "input":
            AI.select('#authoring-modal .modal-title').innerText = Lang.input_box + ' - ' + labkey;
            AI.selectAll('#authoring-modal .inputbox', 'show', 'block');
            AI.select('#authoring-modal #int-top').value = pos[0];
            AI.select('#authoring-modal #int-left').value = pos[1];
            AI.select('#authoring-modal #int-id').value = labkey;
            AI.select('#authoring-modal .inputbox #custom_class_input').innerHTML = DND_AUTH.customClassOptions();
            DND_AUTH.visible_class = '.inputbox';

            break;
        case "multiline":
            AI.select('#authoring-modal .modal-title').innerText = Lang.multiline_text_box + ' - ' + labkey;
            AI.selectAll('#authoring-modal .multiline', 'show', 'block');
            AI.select('#authoring-modal #mlt-top').value = pos[0];
            AI.select('#authoring-modal #mlt-left').value = pos[1];
            AI.select('#authoring-modal #mlt-id').value = labkey;
            AI.select('#authoring-modal .multiline #custom_class').innerHTML = DND_AUTH.customClassOptions();
            DND_AUTH.visible_class = '.multiline';

            break;
        case "checkbox":
            AI.select('#authoring-modal .modal-title').innerText = Lang.checkbox_input + ' - ' + labkey;
            AI.selectAll('#authoring-modal .chekbox', 'show', 'block');
            AI.select('#authoring-modal #chk-top').value = pos[0];
            AI.select('#authoring-modal #chk-left').value = pos[1];
            AI.select('#authoring-modal #chk-id').value = labkey;
            DND_AUTH.visible_class = '.chekbox';

            break;
        case "radio":
            AI.select('#authoring-modal .modal-title').innerText = Lang.radio_inout + ' - ' + labkey;
            AI.selectAll('#authoring-modal .rdio', 'show', 'block');
            AI.select('#authoring-modal #rd-top').value = pos[0];
            AI.select('#authoring-modal #rd-left').value = pos[1];
            AI.select('#authoring-modal #rd-id').value = labkey;
            DND_AUTH.visible_class = '.rdio';

            break;
        case "button":
            AI.select('#authoring-modal .modal-title').innerText = Lang.btn_txt + ' - ' + labkey;
            AI.selectAll('#authoring-modal .button', 'show', 'block');
            AI.select('#authoring-modal #btn-top').value = pos[0];
            AI.select('#authoring-modal #btn-left').value = pos[1];
            AI.select('#authoring-modal #btn-id').value = labkey;
            DND_AUTH.visible_class = '.button';

            break;
        case "dropdown":
            AI.select('#authoring-modal .modal-title').innerText = Lang.select_dropdown + ' - ' + labkey;
            AI.selectAll('#authoring-modal .dropdown', 'show', 'block');
            AI.select('#authoring-modal #ddn-top').value = pos[0];
            AI.select('#authoring-modal #ddn-left').value = pos[1];
            AI.select('#authoring-modal #ddn-id').value = labkey;
            DND_AUTH.visible_class = '.dropdown';
            break;
        case "listbox":
            AI.select('#authoring-modal .modal-title').innerText = Lang.select_list + ' - ' + labkey;
            AI.selectAll('#authoring-modal .listbox', 'show', 'block');
            AI.select('#authoring-modal #lst-top').value = pos[0];
            AI.select('#authoring-modal #lst-left').value = pos[1];
            AI.select('#authoring-modal #lst-id').value = labkey;
            DND_AUTH.visible_class = '.listbox';

            break;
        case "tabhead":
            AI.select('#authoring-modal .modal-title').innerText = Lang.clickable + ' - ' + labkey;
            AI.selectAll('#authoring-modal .tabhead', 'show', 'block');
            AI.select('#authoring-modal #tbd-top').value = pos[0];
            AI.select('#authoring-modal #tbd-left').value = pos[1];
            AI.select('#authoring-modal #tbd-id').value = labkey;
            DND_AUTH.visible_class = '.tabhead';

            break;
        case "img":
            AI.select('#authoring-modal .modal-title').innerText = Lang.image_txt + ' - ' + labkey;
            AI.selectAll('#authoring-modal .img', 'show', 'block');
            AI.select('#authoring-modal #img-top').value = pos[0];
            AI.select('#authoring-modal #img-left').value = pos[1];
            AI.select('#authoring-modal #img-id').value = labkey;
            DND_AUTH.visible_class = '.img';

            break;
        case "label":
            {
                let xml_node;
                if (AI.select('#special_module_xml').value && AI.select('#special_module_xml').value.trim() != '') {
                    xml_node = AI.parseHtml(AI.select('#special_module_xml').value);
                }
                let xmlDomVal = AI.find(xml_node, '#' + key);
                if (xmlDomVal && xmlDomVal.getAttribute && xmlDomVal.getAttribute('richtext')) {
                    setTimeout(function() {
                        AI.select('#authoring-modal #rich_label_title').checked = true;

                        let cdataText = xmlDomVal.innerHTML.trim();
                        cdataText = cdataText.substring(11, (cdataText.length - 5));

                        AI.select('#authoring-modal #lbl-title').value = cdataText;
                    }, 1000);
                } else {
                    AI.select('#authoring-modal #rich_label_title').checked = false;
                }

                AI.select('#authoring-modal .modal-title').innerText = Lang.label + ' - ' + labkey;
                AI.selectAll('#authoring-modal .labal', 'show', 'block');
                AI.select('#authoring-modal #lbl-top').value = pos[0];
                AI.select('#authoring-modal #lbl-left').value = pos[1];
                AI.select('#authoring-modal #lbl-id').value = labkey;
                AI.select('#authoring-modal #label_class').innerHTML = DND_AUTH.labelClassOptions();
                DND_AUTH.visible_class = '.labal';
            }

            break;
        case "area":
            AI.select('#authoring-modal .modal-title').innerText = Lang.area_matrix + ' - ' + labkey;
            AI.selectAll('#authoring-modal .area', 'show', 'block');
            AI.select('#authoring-modal #area-top').value = pos[0];
            AI.select('#authoring-modal #area-left').value = pos[1];
            AI.select('#authoring-modal #area-id').value = labkey;
            DND_AUTH.visible_class = '.area';

            break;
        case "menulist":
            AI.select('#authoring-modal .modal-title').innerText = Lang.new_menu + ' - ' + labkey;
            AI.selectAll('#authoring-modal .menulist', 'show', 'block');
            AI.select('#authoring-modal #mnl-top').value = pos[0];
            AI.select('#authoring-modal #mnl-left').value = pos[1];
            AI.select('#authoring-modal #mnl-id').value = labkey;
            DND_AUTH.visible_class = '.menulist';

            break;
        case "hotspot":
            AI.select('#authoring-modal .modal-title').innerText = Lang.hotspot + ' - ' + labkey;
            AI.selectAll('#authoring-modal .hotspot', 'show', 'block');
            AI.select('#authoring-modal #hpt-top').value = pos[0];
            AI.select('#authoring-modal #hpt-left').value = pos[1];
            AI.select('#authoring-modal #hpt-id').value = labkey;
            DND_AUTH.visible_class = '.hotspot';

            break;
        case "hotspot_click":
            if (!key) {
                pos = [10, 10];
            }
            AI.select('#authoring-modal .modal-title').innerText = Lang.hotspot + ' ' + Lang.clickable + ' - ' + hptkey;
            AI.selectAll('#authoring-modal .hotspot_click', 'show', 'block');
            AI.select('#authoring-modal #hpt_clk-top').value = pos[0];
            AI.select('#authoring-modal #hpt_clk-left').value = pos[1];
            AI.select('#authoring-modal #hpt_clk-id').value = hptkey;
            DND_AUTH.visible_class = '.hotspot_click';

            break;
        case "tab":
            if (AI.select('.parent').getAttribute('type') == 'tab') {
                AI.select('#authoring-modal .modal-title').innerText = Lang.new_pills;
            } else {
                AI.select('#authoring-modal .modal-title').innerText = Lang.new_tab;
            }
            AI.selectAll('#authoring-modal .tab', 'show', 'block');
            AI.select('#authoring-modal #tab-id').value = labkey;
            DND_AUTH.visible_class = '.tab';

            break;
        case "step":
            parent = AI.select('.parent').getAttribute("data-parent");
            if (AI.select('.parent').getAttribute('type') == "tab") {
                parent = 'dndmain';
            }
            if (parent != 'dndmain' && !key) {
                labkey = AI.select('#' + parent).getAttribute('id') + '_' + AI.selectAll('#dndmain>.step').length;
            }

            AI.select('#authoring-modal .modal-title').innerText = Lang.new_steps + ' - ' + labkey;
            AI.selectAll('#authoring-modal .step', 'show', 'block');
            AI.select('#authoring-modal #step-id').value = labkey;
            DND_AUTH.visible_class = '.step';

            break;
        case "base": {
                AI.select('#authoring-modal .modal-title').innerText = Lang.base;
                AI.selectAll('#authoring-modal .base', 'all');
                if (state.imgWidth) {
                    AI.select('#authoring-modal #base-width').value = state.imgWidth;
                }

                if (state.imgHeight) {
                    AI.select('#authoring-modal #base-height').value = state.imgHeight;
                }

                AI.select('#authoring-modal #base-bgimg').value = bgImg;

                let img_src = AI.select('img[src="//s3.amazonaws.com/jigyaasa_content_static/' + bgImg + '"]');
                if (img_src.getAttribute) {
                    let alt_text = img_src.getAttribute('alt');
                    if (alt_text) {
                        AI.select('#authoring-modal #base-bgimg-alt').value = alt_text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    } else {
                        AI.select('#authoring-modal #base-bgimg-alt').value = '';
                    }
                    AI.select('#authoring-modal #base-borderrequired').checked = img_src.classList.contains("img-bordered");
                }
                AI.selectAll('#authoring-modal .base', 'show', 'block');
                DND_AUTH.visible_class = '.base';
            }

            break;
        case "jscript":
            AI.select('#authoring-modal .modal-title').innerText = Lang.insert_script;
            AI.selectAll('#authoring-modal .jscript', 'show', 'block');

            if (AI.selectAll('#authoring-modal .CodeMirror').length == 0) {
                let jscript_timer = setTimeout(function() {
                    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                        lineNumbers: true,
                        matchBrackets: true,
                        continueComments: "Enter",
                        indentWithTabs: true
                    }, 1000);
                    clearTimeout(jscript_timer);
                }, 200);
            }
            DND_AUTH.visible_class = '.jscript';

            break;
        case "choicematrix":
            AI.select('#authoring-modal .modal-title').innerText = Lang.choice_matrix + ' - ' + labkey;
            AI.selectAll('#authoring-modal .choicematrix', 'show', 'block');
            AI.select('#authoring-modal #choicematrix-id').value = labkey;
            DND_AUTH.visible_class = '.choicematrix';
            break;
    }
    AI.listen('body', 'click', '.addElement', function() {
        DND_AUTH.updateElem(type, _this, key);
    });
    AI.getBS('#authoring-modal', 'Modal').show();
    if (AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' .events a').nodeName) {
        AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' .events a').click();
    }
    if (key) {
        let attributes = [];
        if (type == "base") {
            attributes = DND_AUTH.storage.store('#dndmain', 'attributes');
        } else {
            attributes = DND_AUTH.storage.store('#' + key, 'attributes');
        }

        if (typeof(attributes) == "undefined") {
            attributes = [];
        }
        AI.selectAll('#authoring-modal .tabhead .events a i', 'remove');
        for (let index = 0; index < attributes.length; index++) {
            if (attributes[index]['name'].indexOf('on') === 0 && attributes[index]['value'].trim() != "") {
                AI.insert('#authoring-modal .tabhead .events [for$="' + attributes[index]['name'] + '"]', '<i class="icomoon-checkmark pull-right"></i>', 'beforeend');
            }
            AI.select('#authoring-modal .tabhead .events a i');
            let modal_element = AI.select('#authoring-modal ' + DND_AUTH.visible_class + ' [name="' + attributes[index]['name'] + '"]');
            if (modal_element && modal_element.nodeName) {
                if (modal_element.getAttribute('type') == "checkbox" || modal_element.getAttribute('type') == "radio" || modal_element.getAttribute('type') == "choicematrix") {
                    modal_element.checked = false;
                    if (attributes[index]['name'] == "multi_drag") {
                        if (attributes[index]['value'] == 1) {
                            modal_element.checked = true;
                        }
                    } else if (attributes[index]['value'] == 1) {
                        modal_element.checked = true;
                    }
                } else {
                    modal_element.value = DND_AUTH.setValue( attributes[index]['value'] );
                }
            }
        }
    }

    if (type == 'dropdown') {
        let fetched_list_data = DND_AUTH.errorChecking();
        let is_error = fetched_list_data[0] || (fetched_list_data[1] == 0);
        if (is_error) {
            DND_AUTH.error_message = (is_error) ? ((fetched_list_data[0]) ? (Lang.one_option_correct) : Lang.one_option_require) : '';
            AI.select('#authoring-modal .errorBtn', 'removeClass', 'h');
            AI.select('#authoring-modal .addElement', 'addClass', 'h');
        }
    }

    let required_fields = AI.selectAll('#authoring-modal ' + DND_AUTH.visible_class + ' .validate');

    for (let index = 0; index < required_fields.length; index ++) {
        if (required_fields[index].value.trim() == '') {
            DND_AUTH.error_message = Lang.required_field;
            AI.select('#authoring-modal .errorBtn', 'removeClass', 'h');
            AI.select('#authoring-modal .addElement', 'addClass', 'h');
            break;
        }
    }
};

// for rounding of the value
DND_AUTH.setValue = function (value) {
    if (isNaN(value) || (typeof (value) == 'string' && value.trim() == '')) {
        return value;
    } else if (value == null || value == undefined) {
        return '';
    } else {
        return Math.round(Number(value));
    }
};

// for select box option checking
DND_AUTH.errorChecking = function() {
    let is_multiple_selected = 0;
    let is_multiple_correct = 0;
    let is_multiple = 0;
    let options = document.getElementById('ddn-value').value.split('\n');
    for (let index = 0; index < options.length; index++) {
        let optionText = options[index].trim();
        if (optionText.indexOf('*') == 0) {
            is_multiple_correct++;
        }
        if (optionText.indexOf('+') == 0) {
            is_multiple_selected++;
        }
    }
    if ((is_multiple_selected > 1) || (is_multiple_correct > 1)) {
        is_multiple = 1;
    }
    return ([is_multiple, is_multiple_correct]);
};

// for deleting the element 
DND_AUTH.deleteElem = function(type, key) {
    swal({
        text: Lang.delete_txt,
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then(function(result) {
        if (result) {
            let old_key = key;
            if (type == 'hotspot_click') {
                key = key.split('_')[0];
            }
            let xmlDom = AI.parseHtml(AI.select('#special_module_xml').value);

            if (AI.find(xmlDom, '[id=' + key + ']')) {
                if (type == 'hotspot_click') {
                    let clkstr = '{';
                    let count = 0;
                    let id = AI.select('[id="' + key + '"]');
                    let hs_item = AI.find(id, '.hs_item:not([id="' + old_key + '"])', 'all');

                    for (let index = 0; index < hs_item.length; index++) {
                        count++;
                        let position = DND_AUTH.position(hs_item[index]);
                        let width = hs_item[index].offsetWidth;
                        let height = hs_item[index].offsetHeight;
                        if (count == hs_item.length) {
                            clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + ']';
                        } else {
                            clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + '],';
                        }
                    }
                    clkstr += '}';
                    AI.find(xmlDom, '[id=' + key + ']').innerText = clkstr;
                } else {
                    AI.find(xmlDom, '[id=' + key + ']').remove();
                }
                AI.select('#special_module_xml').value = xmlDom.outerHTML;
            }
            AI.select('#update_xml').click();
        }
    });
};

// this function is used for getting the serialized data
DND_AUTH.serialize = function(element) {
    let serialize = [];
    for (let index = 0; index < element.length; index++) {
        if (element[index].getAttribute('type') == 'radio' || element[index].getAttribute('type') == 'checkbox') {
            if (element[index].checked) {
                serialize[serialize.length] = {
                    "name": element[index].name,
                    "value": 1
                };
            }
        } else {
            serialize[serialize.length] = {
                "name": element[index].name,
                "value": element[index].value
            };
        }
    }
    return serialize;
};

// this function calls whenever the auth modal ok button is clicked or in other word when a element is updated
DND_AUTH.updateElem = function(type, _this, key, ui) {
    let obj = AI.select('#authoring-modal');
    let attributes_list = AI.find(AI.select('#authoring-modal ' + DND_AUTH.visible_class), 'select, textarea, input', 'all');
    let attributes = DND_AUTH.serialize(attributes_list);
    let k = DND_AUTH.getID(AI.selectAll('[id^=ID]').length);
    let is_update = false, bgimg = "", mainimage = "", attr = [], wd, hd, tp, lt, st, ttl, label_class, border_color, border_size, lbl_bg_color, border_required = 0, parent, htmlparent;

    if (typeof(ui) !== "undefined" && ui) {
        if (DND_AUTH.storage.store('#' + key, 'attributes')) {
            attributes = DND_AUTH.storage.store('#' + key, 'attributes');
        } else {
            let at = [];
            let temp = ["width", "height", "top", "left", "id"];
            for (let x in temp) {
                if (temp[x] == "id") {
                    at.push({
                        "name": "id",
                        "value": key
                    });
                } else {
                    at.push({
                        "name": temp[x],
                        "value": 0
                    });
                }
            }
            DND_AUTH.storage.store('#' + key, 'attributes', at);
            attributes = DND_AUTH.storage.store('#' + key, 'attributes');
        }
        for (let index = 0; index < attributes.length; index++) {
            switch (attributes[index].name) {
                case "width":
                    attributes[index].value = (ui.style.width) ? Number(ui.style.width.replace(/px/g, '')) : ui.offsetWidth;
                    break;
                case "height":
                    attributes[index].value = (ui.style.height) ? Number(ui.style.height.replace(/px/g, '')) : ui.offsetHeight;
                    break;
                case "top":
                    attributes[index].value = DND_AUTH.position(ui).top;
                    break;
                case "left":
                    attributes[index].value = DND_AUTH.position(ui).left;
                    break;
            }
        }
    }

    if (type != "jscript") {
        for (let index = 0; index < attributes.length; index++) {
            if (attributes[index].name == "borderrequired") border_required = 8;
            if (attributes[index].name == "width") wd = attributes[index].value;
            if (attributes[index].name == "height") hd = attributes[index].value;
            if (attributes[index].name == "top") tp = attributes[index].value;
            if (attributes[index].name == "left") lt = attributes[index].value;
            if (attributes[index].name == "value") ttl = attributes[index].value;
            if (attributes[index].name == "title") ttl = attributes[index].value;
            if (attributes[index].name == "label_class") label_class = attributes[index].value;
            if (attributes[index].name == "border_color") border_color = attributes[index].value;
            if (attributes[index].name == "border_size") border_size = attributes[index].value;
            if (attributes[index].name == "background_color") lbl_bg_color = attributes[index].value;
            if (attributes[index].name == "style") {
                st = attributes[index].value.split(';');
                if (Array.isArray(st)) {
                    st = st.map((value) => {
                        return value.trim()
                    }).filter(function(n) {
                        return n
                    }).join(';');
                }
            }

            if (attributes[index].name == "bgimg" && attributes[index].value && (attributes[index].value).trim() != "") {
                bgimg = AI.select('#dndmain').getAttribute('path') + (attributes[index].value).trim();
            }
            if (attributes[index].name == "image") {
                mainimage = (attributes[index].value).split(',')[0];
                if (mainimage.trim() != "") mainimage = AI.select('#dndmain').getAttribute('path') + mainimage.trim();
            }
            attr[attributes[index].name] = attributes[index].name;
        }

        let check = "multi_drag,showtarget,display,invisible,nocase,ismultipleanswer,borderrequired".split(',');
        for (let index = 0; index < check.length; index++) {
            if (typeof(attr[check[index]]) == "undefined") {
                attributes.push({
                    "name": check[index],
                    "value": "0"
                });
            }
        }
    }

    if (type != "hotspot_click") {
        parent = AI.select('.parent').getAttribute("data-parent");
        htmlparent = parent == "dndmain" ? "#dndmain" : parent;
        if (type == "step") {
            htmlparent = "#dndmain";
        }
    }

    let where;
    ttl = (ttl) ? ttl : '';
    switch (type) {
        case "drag":
            if (mainimage != "") {
                mainimage = "url(" + mainimage + ")";
            }
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                try {
                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                    let element = AI.select(where);
                    AI.setCss(element, {
                        backgroundImage: mainimage,
                        width: wd + 'px',
                        height: hd + 'px',
                        top: tp + 'px',
                        left: lt + 'px',
                    });

                    AI.find(element, 'p').innerText = ttl;
                } catch (error) {
                    console.warn(error);
                }
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div id="' + key + '" title="' + key + '" class="drag-resize dragable cursor_move unupdated_node" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;border:1px solid #aaccaa;background-color:#CCFFCC;' + st + '"><p>' + ttl + '</p><div class="btn-group tools h" data-t="drag"><a href="javascript:DND_AUTH.elemModal(\'drag\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'drag\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                AI.setCss(AI.select('[id=' + key + ']'), {
                    backgroundImage: mainimage
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "drop":
            if (mainimage != "") {
                mainimage = "url(" + mainimage + ")";
            }
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                try {
                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                    let element = AI.select(where);
                    AI.setCss(element, {
                        backgroundImage: mainimage,
                        width: wd + 'px',
                        height: hd + 'px',
                        top: tp + 'px',
                        left: lt + 'px',
                    });

                    AI.find(element, 'p').innerText = ttl;
                } catch (error) {
                    console.warn(error);
                }
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div id="' + key + '" title="' + key + '" class="drag-resize dropable cursor_move unupdated_node" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;border:1px solid #000000;background-color:#FFFFCC;' + st + '"><p>' + ttl + '</p><div class="btn-group tools h" data-t="drop"><a href="javascript:DND_AUTH.elemModal(\'drop\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'drop\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                AI.setCss(AI.select('[id=' + key + ']'), {
                    backgroundImage: mainimage
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "input":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });

            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="text" class="' + key + ' dnd_textbox elem form-control min_height_0" title="' + key + '" /><div class="btn-group tools h" data-t="input"><a href="javascript:DND_AUTH.elemModal(\'input\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'input\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "multiline":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><textarea class="' + key + ' dnd_textarea elem form-control" title="' + key + '"></textarea><div class="btn-group tools h" data-t="multiline"><a href="javascript:DND_AUTH.elemModal(\'multiline\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'multiline\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "checkbox":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="checkbox" class="' + key + ' dndcheckbox elem" title="' + key + '" /><div class="btn-group tools h" data-t="checkbox"><a href="javascript:DND_AUTH.elemModal(\'checkbox\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'checkbox\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "radio":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="radio" class="' + key + ' dndradio elem" title="' + key + '" /><div class="btn-group tools h" data-t="radio"><a href="javascript:DND_AUTH.elemModal(\'radio\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'radio\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "button":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><button type="button" class="' + key + ' dnd_button elem" title="' + key + '"></button><div class="btn-group tools h" data-t="button"><a href="javascript:DND_AUTH.elemModal(\'button\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'button\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "dropdown":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><select class="' + key + ' dnd_select elem form-control" title="' + key + '"></select><div class="btn-group tools h" data-t="dropdown"><a href="javascript:DND_AUTH.elemModal(\'dropdown\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'dropdown\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "listbox":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><select class="' + key + ' dnd_select elem form-control" title="' + key + '" size="3" multiple="multiple"></select><div class="btn-group tools h" data-t="listbox"><a href="javascript:DND_AUTH.elemModal(\'listbox\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'listbox\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "tabhead":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndtabhead" title="' + key + '" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools h" data-t="tabhead"><a href="javascript:DND_AUTH.elemModal(\'tabhead\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'tabhead\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "img":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;
                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><img src="' + bgimg + '" class="' + key + ' dnd_img elem" title="' + key + '" /><div class="btn-group tools h" data-t="img"><a href="javascript:DND_AUTH.elemModal(\'img\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'img\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "label": {
                let border = border_size + 'px solid ' + border_color;
                if (key) {
                    is_update = true;
                    where = '[id="' + key + '"]';

                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                    let element = AI.select(where);
                    AI.setCss(element, {
                        width: wd + 'px',
                        height: hd + 'px',
                        top: tp + 'px',
                        left: lt + 'px',
                        border: border,
                        backgroundColor: lbl_bg_color
                    });

                    AI.find(element, 'p').innerHTML = (ttl) ? DND_AUTH.decodeEnt(ttl) : '';

                    let labelClasses = AI.find(AI.select('select#label_class'), 'option', 'all');
                    for (let index = 1; index < labelClasses.length; index++) {
                        element.classList.remove(labelClasses[index].value);
                    }
                    element.classList.add(label_class);
                } else {
                    where = parent;
                    key = "ID" + k;
                    AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndlabel ' + label_class + '" id="' + key + '" title="' + key + '" style="position:absolute;border:' + border + ';background-color: ' + lbl_bg_color + '; width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><p>' + ((ttl) ? DND_AUTH.decodeEnt(ttl) : '') + '</p><div class="btn-group tools h" data-t="label"><a href="javascript:DND_AUTH.elemModal(\'label\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'label\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                    DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                }
            }
            break;
        case "area":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndarea" id="' + key + '" title="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools h" data-t="area"><a href="javascript:DND_AUTH.elemModal(\'area\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'area\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

            }
            break;
        case "menulist":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node dndarea" id="' + key + '" title="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools h" data-t="menulist"><a href="javascript:DND_AUTH.elemModal(\'menulist\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'menulist\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "hotspot":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="cursor_move unupdated_node drag-resize hotspot_auth" id="' + key + '" title="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div id="' + key + '_1" class="drag-resize hs_item cursor_move unupdated_node"  style="position:absolute;width:100px;height:50px;top:50px;left:50px;"><div class="btn-group tools h" data-t="hotspot_click"><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', this, \'' + key + '_1\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot_click\', \'' + key + '_1\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div><div class="btn-group tools h" data-t="hotspot"><a href="javascript:DND_AUTH.elemModal(\'hotspot\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', \'[id=' + key + ']\');" class="btn btn-light p-sm"><i class="icomoon-plus"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

                DND_AUTH.storage.store('#' + key + '_1', 'attributes', [{
                        "name": "width",
                        "value": "100"
                    },
                    {
                        "name": "height",
                        "value": "50"
                    },
                    {
                        "name": "top",
                        "value": "50"
                    },
                    {
                        "name": "left",
                        "value": "50"
                    },
                    {
                        "name": "id",
                        "value": key + "_1"
                    }
                ]);

            }
            break;
        case "hotspot_click":
            if (key) {
                where = '[id="' + key + '"]';
                is_update = true;
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = '[id="' + AI.select(_this).getAttribute('id') + '"]';
                key = AI.select(_this).getAttribute('id') + '_' + (AI.find(_this, '.hs_item', 'all').length + 1);

                AI.insert(where, '<div id="' + key + '" class="drag-resize hs_item unupdated_node"  style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><div class="btn-group tools" data-t="hotspot_click"><a href="javascript:DND_AUTH.elemModal(\'hotspot_click\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'hotspot_click\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "tab":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                AI.select('[for=' + key + '] a').innerText = AI.find(obj, '#tab-title').value;
                AI.select('[id="' + key + '"]' + '>img').setAttribute("src", bgimg);
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            } else {
                where = parent;
                key = "ID" + k;

                let tbstr = '<li class="unupdated_node" for="' + key + '"><a href="#' + key + '" data-toggle="tab">' + AI.find('#authoring-modal', '#tab-title').value + '</a></li>';
                let cnstr = '<div id="' + key + '" class="tab-pane unupdated_node"><div class="btn-group tools" data-t="tab"><a href="javascript:DND_AUTH.elemModal(\'tab\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div><ul class="nav nav-pills margin-bottom"></ul><div class="tab-content" type="tab" style="position: relative;"></div></div></div>';

                let cls = 'nav-tabs';
                if (AI.select('.parent').getAttribute('type') == "tab") {
                    cls = 'nav-pills';
                }
                let htmlparent_dom = AI.select(htmlparent);
                if (AI.find(htmlparent_dom, ".nav", 'all').length <= 0) {
                    tbstr = '<ul class="nav ' + cls + ' mb-xl">' + tbstr + '</ul>';
                    cnstr = '<div class="tab-content">' + cnstr + '</div>';
                    AI.insert(htmlparent, tbstr + "\n" + cnstr, 'beforeend');
                } else {

                    AI.insert(AI.find(htmlparent_dom, '.' + cls), tbstr, 'beforeend');

                    if (AI.find(htmlparent_dom, '.tab-content .tab-pane', 'all').length == 0) {
                        AI.insert(AI.find(htmlparent_dom, '.tab-content'), cnstr, 'beforeend');
                    } else {
                        let tabpane = AI.find(htmlparent_dom, '.tab-content .tab-pane').parentElement;
                        AI.insert(tabpane, cnstr, 'beforeend');
                    }
                }
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

                if (attributes[3].value == "1") {
                    AI.find(htmlparent_dom, '.' + cls + ' li', {
                        action: 'removeClass',
                        actionData: 'active'
                    });
                    AI.find(htmlparent_dom, '.' + cls + ' li[for=' + key + ']', {
                        action: 'addClass',
                        actionData: 'active'
                    });
                    AI.find(htmlparent_dom, '.tab-content .tab-pane', {
                        action: 'removeClass',
                        actionData: 'active'
                    });
                    AI.find(htmlparent_dom, '[id=' + key + ']', {
                        action: 'addClass',
                        actionData: 'active'
                    });
                }
            }
            break;
        case "step":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';

                AI.select('[id="' + key + '"]' + '>img').setAttribute('src', bgimg);

                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            } else {
                where = parent;
                key = "ID" + k;
                let steps = '#steps';
                if (parent != 'dndmain' && AI.select('.parent').getAttribute('type') != "tab") {
                    key = AI.select(parent).getAttribute('id') + '_' + AI.selectAll(parent + ' >.step').length;
                    steps = '[for=' + AI.select(parent).getAttribute('id') + ']';
                }

                AI.insert(steps, '<label for="' + key + '" class="checkbox inline no-margin no-padding unupdated_node"><input type="radio" id="step_' + key + '" name="rbsAuth" class="dndradio" onclick="javascript:DND_AUTH.setStepAuth(\'' + key + '\');"/> ' + key + '</label>', 'beforeend');

                AI.insert(htmlparent + " div:nth-child(2) div:nth-last-child(2)", '<div id="' + key + '" type="step" class="h step unupdated_node" style="position:relative;"><div class="btn-group tools" data-t="step"><a href="javascript:DND_AUTH.elemModal(\'step\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'step\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div>' + ((bgimg != "") ? '<img src="' + bgimg + '" />' : '') + '<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div><ul class="nav nav-tabs margin-bottom"></ul><div class="tab-content" type="tab" style="position: relative;"></div></div></div>', 'beforeend');

                DND_AUTH.storage.store('#' + key, 'attributes', attributes);

            }
            break;
        case "base":
            if (key) {
                is_update = true;
                where = "dndmain";
                let dom = AI.select('#special_module_xml').value ? AI.parseHtml(AI.select('#special_module_xml').value) : null;
                if (dom && dom.getAttribute && dom.getAttribute('type') && dom.getAttribute('width') && dom.getAttribute('height')) {
                    let module_type = dom ? Number(dom.getAttribute('type')) : 1;
                    let container = document.querySelector("#dndmain img");
                    let originalHeight = ((module_type == 1) ? DND_AUTH.getImageData('h', container) : container.naturalHeight) + border_required;
                    let originalWidth = ((module_type == 1) ? DND_AUTH.getImageData('w', container) : container.naturalWidth) + border_required;

                    wd = (wd < originalWidth) ? originalWidth : wd;
                    hd = (hd < originalHeight) ? originalHeight : hd;
                    let counting = 0;
                    for (let index = 0; index < attributes.length; index++) {
                        switch (attributes[index].name) {
                            case "width":
                                attributes[index].value = wd;
                                counting++;
                                break;
                            case "height":
                                attributes[index].value = hd;
                                counting++;
                                break;
                        }
                        if (counting == 2) {
                            break;
                        }
                    }
                }

                AI.setCss(AI.select('#' + where), {
                    width: wd + 'px',
                    height: hd + 'px',
                });
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
        case "jscript":
            is_update = true;
            where = "jscript";
            DND_AUTH.setfunc(editor.getValue());
            break;
        case "choicematrix":
            if (key) {
                is_update = true;
                where = '[id="' + key + '"]';
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
                let element = AI.select(where);
                AI.setCss(element, {
                    width: wd + 'px',
                    height: hd + 'px',
                    top: tp + 'px',
                    left: lt + 'px',
                });
            } else {
                where = parent;
                key = "ID" + k;

                AI.insert(htmlparent, '<div class="drag-resize cursor_move unupdated_node" id="' + key + '" style="position:absolute;width:' + wd + 'px;height:' + hd + 'px;top:' + tp + 'px;left:' + lt + 'px;' + st + '"><input type="radio" class="' + key + ' dndradio elem" title="' + key + '" /><div class="btn-group tools h" data-t="choicematrix"><a href="javascript:DND_AUTH.elemModal(\'choicematrix\', this, \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-24px-edit-1"></i></a><a href="javascript:DND_AUTH.deleteElem(\'choicematrix\', \'' + key + '\');" class="btn btn-light p-sm"><i class="icomoon-new-24px-delete-1"></i></a></div></div>', 'beforeend');
                DND_AUTH.storage.store('#' + key, 'attributes', attributes);
            }
            break;
    }

    if (type == "base" || type == "step" || type == "tab") {
        let bgholder = AI.select(htmlparent);
        if (type == "step") {
            bgholder = AI.find(htmlparent, '[id="' + key + '"]');
        }
        if (bgimg != "") {
            if (type == "tab") {
                if (AI.find(bgholder, '[id="' + key + '"] > img', 'all').length > 0) {
                    AI.find(bgholder, '[id="' + key + '"] > img').setAttribute("src", bgimg);
                } else {
                    AI.insert(AI.find(bgholder, '[id="' + key + '"]'), '<img src="' + bgimg + '"/>', 'afterbegin');
                }
            } else {
                if (AI.selectAll('#' + bgholder.getAttribute('id') + '>img').length > 0) {
                    AI.select('#' + bgholder.getAttribute('id') + '>img').setAttribute("src", bgimg);
                } else {
                    AI.insert(bgholder, '<img src="' + bgimg + '"/>', 'afterbegin');
                }
            }
        } else {
            if (AI.selectAll('#' + bgholder.getAttribute('id') + '>img').length > 0) {
                AI.select('#' + bgholder.getAttribute('id') + '>img').remove();
            }
        }
    }
    DND_AUTH.updateXML(type, where, attributes, is_update);
};

// for getting the image height and width
DND_AUTH.getImageData = function(type, element) {
    if (type == 'h') {
        return element.clientHeight > element.naturalHeight ? element.clientHeight : element.naturalHeight;
    } else {
        return element.clientWidth > element.naturalWidth ? element.clientWidth : element.naturalWidth
    }
};

// this function is responsible for updating the xml
DND_AUTH.updateXML = function(type, where, attributes, is_update) {
    let xmlDom = AI.parseHtml(AI.select('#special_module_xml').value);
    let change = true;
    let attr = '',
        val = '',
        tag, insert, hpt;
    if (where == "dndmain") {
        insert = xmlDom;
    } else {
        insert = AI.find(xmlDom, where);
    }
    switch (type) {
        case "input":
            tag = "textbox";
            break;
        case "multiline":
            tag = "multilinebox";
            break;
        case "dropdown":
        case "listbox":
            tag = "select";
            break;
        case "hotspot":
            type = "hotspot_click";
            tag = "hotspot";
            hpt = '[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]';
            break;
        case "hotspot_click":
            change = false;
            if (AI.select('[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]').nodeName && AI.select('[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]').parentElement.getAttribute('id')) {
                hpt = '[id="' + AI.select('[id="' + DND_AUTH.getObjectValue('id', attributes) + '"]').parentElement.getAttribute('id') + '"]';
            } else {
                hpt = '';
            }
            break;
        case "jscript":
            if (AI.find(xmlDom, 'jscript', 'all').length < 1) {
                AI.insert(xmlDom, "<jscript>\n" + editor.getValue() + "\n</jscript>" , 'beforeend');
            } else {
                AI.find(xmlDom, 'jscript').innerHTML = "\n" + editor.getValue() + "\n";
            }
            change = false;
            break;
        case "choicematrix":
            tag = "choicematrix";
            break;
        default:
            tag = type;
    }

    let options_list = ["multi_drag", "showtarget", "display", "invisible", "nocase", "ismultipleanswer", "multiple", "borderrequired"];
    if (change) {
        if (is_update && insert) {
            for (let i = 0; i < attributes.length; i++) {
                if (options_list.includes(attributes[i].name) && attributes[i].value == 0) {
                    if (type == "drag" && attributes[i].name == "multi_drag") {
                        attributes[i].value = "0";
                    } else {
                        attributes[i].value = "";
                    }
                }

                if (attributes[i].value !== "") {
                    if (type == "multiline" && attributes[i].name == "correctans") {
                        let correctans = AI.find(insert, 'correctans', 'all');
                        // have changed the logic previously it was adding multiple correct ans , need to check new logic
                        if (correctans.length > 0) {
                            for (let sub_index = 0; sub_index < correctans.length; sub_index++) {
                                correctans[sub_index].remove();
                            }
                        }
                        AI.insert(insert, '<correctans><![CDATA[' + attributes[i].value + ']]></correctans>', 'beforeend');
                    } else if (type == "multiline" && attributes[i].name == "defaultans") {
                        let defaultans = AI.find(insert, 'defaultans', 'all');
                        // have changed the logic previously it was adding multiple correct ans , need to check new logic
                        if (defaultans.length > 0) {
                            for (let sub_index = 0; sub_index < defaultans.length; sub_index++) {
                                defaultans[sub_index].remove();
                            }
                        }
                        AI.insert(insert, '<defaultans><![CDATA[' + attributes[i].value + ']]></defaultans>', 'beforeend');
                    } else if ((tag == "select" || tag == "menulist") && attributes[i].name == "value") {
                        insert.innerHTML = attributes[i].value;
                    } else if (attributes[i].name == "style") {
                        if (attributes[i].value) {
                            let split_data = attributes[i].value.split(';');
                            if (Array.isArray(split_data)) {
                                split_data = split_data.map((value) => {
                                    return value.trim()
                                }).filter(function(n) {
                                    return n
                                }).join(';');
                            }
                            insert.setAttribute(attributes[i].name, split_data);
                        }
                    } else if (type == "label" && attributes[i].name == "title") {
                        if (attributes[i + 1].name == "richtext") {
                            val += '<![CDATA[' + attributes[i].value + ']]>';
                            insert.removeAttribute(attributes[i].name);
                            insert.innerHTML = val;
                        } else {
                            insert.setAttribute(attributes[i].name, attributes[i].value);
                            insert.innerHTML = '';
                            insert.removeAttribute("richtext");
                        }
                    } else {
                        insert.setAttribute(attributes[i].name, attributes[i].value);
                    }
                } else {
                    if (type == "multiline" && attributes[i].name == "correctans") {
                        let correctans = AI.find(insert, 'correctans', 'all');
                        // have changed the logic previously it was adding multiple correct ans , need to check new logic
                        if (correctans.length > 0) {
                            for (let sub_index = 0; sub_index < correctans.length; sub_index++) {
                                correctans[sub_index].remove();
                            }
                        }
                        AI.insert(insert, '<correctans><![CDATA[' + attributes[i].value + ']]></correctans>', 'beforeend');
                    } else {
                        insert.removeAttribute(attributes[i].name);
                    }
                }
            }
        } else {
            for (let i = 0; i < attributes.length; i++) {
                if (options_list.includes(attributes[i].name) && attributes[i].value == 0) {
                    if (type == "drag" && attributes[i].name == "multi_drag") {
                        attributes[i].value = "0";
                    } else {
                        attributes[i].value = "";
                    }
                }
                if (attributes[i].value != "") {
                    if (type == "multiline" && attributes[i].name == "correctans") {
                        val += '<correctans><![CDATA[' + attributes[i].value + ']]></correctans>';
                    } else if (type == "multiline" && attributes[i].name == "defaultans") {
                        val += '<defaultans><![CDATA[' + attributes[i].value + ']]></defaultans>';
                    } else if ((tag == "select" || tag == "menulist") && attributes[i].name == "value") {
                        val += attributes[i].value;
                    } else if (attributes[i].name == "style") {
                        let split_data = '';
                        if (attributes[i].value) {
                            split_data = attributes[i].value.split(';');
                            if (Array.isArray(split_data)) {
                                split_data = split_data.map((value) => {
                                    return value.trim()
                                }).filter(function(n) {
                                    return n
                                }).join(';');
                            }
                        }
                        attr += attributes[i].name + '="' + split_data + '" ';
                    } else if (type == "label" && attributes[i].name == "title") {
                        if (attributes[i + 1].name == "richtext") {
                            val += '<![CDATA[' + attributes[i].value + ']]>';
                        } else {
                            attributes[i].value = attributes[i].value.replace(/["']/g, "&quot;");
                            attr += attributes[i].name + '="' + attributes[i].value + '" ';
                        }
                    } else {
                        attr += attributes[i].name + '="' + attributes[i].value + '" ';
                    }
                } else if (type == "multiline" && attributes[i].name == "correctans") {
                    val += '<correctans><![CDATA[]]></correctans>';
                }
            }
            AI.insert(insert, '<' + tag + ' ' + attr + '>' + val + '</' + tag + '>', 'beforeend');
        }
    }
    if (type == "hotspot_click" && hpt != '') {
        let clkstr = '{';
        let count = 0;
        let id = AI.select(hpt);
        let hs_item = AI.find(id, '.hs_item', 'all');

        for (let index = 0; index < hs_item.length; index++) {
            count++;
            let position = DND_AUTH.position(hs_item[index]);
            let width = hs_item[index].offsetWidth;
            let height = hs_item[index].offsetHeight;
            if (count == hs_item.length) {
                clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + ']';
            } else {
                clkstr += '"' + count + '":[' + position.top + ',' + position.left + ',' + width + ',' + height + '],';
            }
        }
        clkstr += '}';
        if (AI.find(xmlDom, hpt)) {
            AI.find(xmlDom, hpt).innerText = clkstr;
        }


        if (is_update && insert) {
            for (let i = 0; i < attributes.length; i++) {
                if (options_list.includes(attributes[i].name) && attributes[i].value == 0) {
                    attributes[i].value = "";
                }
                if (attributes[i].name == "value") attributes[i].value = "";
                (attributes[i].value !== "") ? insert.setAttribute(attributes[i].name, attributes[i].value): insert.removeAttribute(attributes[i].name);
            }
        }
    }
    AI.select('#special_module_xml').value = xmlDom.outerHTML;
    AI.select('#update_xml').click();
};

// for getting the value of a particular key in an object
DND_AUTH.getObjectValue = function(key, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].name == key) {
            return arr[i].value;
        }
    }
};

// function responsible for setting the step
DND_AUTH.setStepAuth = function(tabname) {
    let steps = AI.selectAll("#dndmain [type='step']");
    for (let index = 0; index < steps.length; index++) {
        AI.setCss(steps[index], {
            display: 'none'
        });
    }
    if (tabname == "baseAuth") {
        AI.select("#baseAuth").checked = true;
    } else {
        AI.select("#step_" + tabname).checked = true;
        if (tabname.trim() != '') {
            let tab = AI.select("#" + tabname);
            AI.setCss(tab, {
                display: 'block'
            });
            AI.setCss(tab.parentElement, {
                display: 'block'
            });
        }
    }
};

// for getting the ID
DND_AUTH.getID = function(count) {
    if (AI.selectAll('[id="ID' + count + '"]').length < 1) {
        return count;
    }
    count = DND_AUTH.getID(count + 1);
    return count;
};

// for getting first letter as capital
DND_AUTH.capitalize = function(s) {
    return s.toLowerCase().replace(/\b./g, function(a) {
        return a.toUpperCase();
    });
};

// for setting the functions in select which was added in the jscript
// this function is not in used for now but keeping it for the refrence 
DND_AUTH.setfunc = function(functions) {
    let matches = functions.match(/function .+\(/g);
    let eventopt = '<option value="" selected="selected"></option>';
    for (let i = 0; i < matches.length; i++) {
        let func = matches[i].replace("function ", "").replace("(", "").trim();
        eventopt += '<option value="' + func + '">' + DND_AUTH.capitalize(func) + '</option>';
    }
    AI.select('#authoring-modal .event-input select').innerHTML = eventopt;
};

// function used for reseting the attribute of elements in authoring modal
DND_AUTH.resetAttr = function(obj) {
    for (let i = 0; i < obj.length; i++) {
        let field_type = obj[i].type.toLowerCase();
        let attrs = DND_AUTH.setInAssoc(obj[i].attributes, true);
        switch (field_type) {
            case "text":
            case "password":
            case "textarea":
            case "hidden":
                if (typeof attrs['value'] != "undefined") {
                    obj[i].value = attrs['value'].value;
                } else if (typeof attrs['defaultvalue'] != "undefined") {
                    obj[i].value = attrs['defaultvalue'].value;
                } else {
                    obj[i].value = "";
                }
                break;
            case "radio":
            case "choicematrix":
            case "checkbox":
                if (obj[i].id == "base-borderrequired") return;
                if (typeof attrs['checked'] != "undefined") {
                    obj[i].checked = true;
                } else if (obj[i].checked) {
                    obj[i].checked = false;
                }
                break;
            case "select-one":
            case "select-multi":
                {
                    let options = obj[i].options, si = 0;
                    if (options.length > 0) {
                        for (let j = 0; j < options.length; j++) {
                            if (options[j].defaultSelected) {
                                si = j;
                                break;
                            }
                        }
                    }
                    obj[i].selectedIndex = si;
                }
                break;
        }
    }
};

// for setting the associated array
DND_AUTH.setInAssoc = function(attrs, all) {
    let ret = {};
    for (let index = 0; index < attrs.length; index++) {
        if (typeof all != "undefined" && all === true) {
            ret[attrs[index].name] = attrs[index];
        } else {
            ret[attrs[index].name] = attrs[index].value;
        }
    }
    return ret;
};

// this create label class option for the select box
DND_AUTH.labelClassOptions = function() {
    let option = [{
            text: Lang.select_style,
            value: 'null',
            prop: 'disabled selected'
        },
        {
            text: Lang.heading_arial,
            value: 'heading_arial',
            prop: ''
        },
        {
            text: Lang.heading_georgia,
            value: 'heading_georgia',
            prop: ''
        },
        {
            text: Lang.heading_cambria,
            value: 'heading_cambria',
            prop: ''
        },
        {
            text: Lang.heading_calibri,
            value: 'heading_calibri',
            prop: ''
        },
        {
            text: Lang.heading_verdana,
            value: 'heading_verdana',
            prop: ''
        },
        {
            text: Lang.heading_roman,
            value: 'heading_roman',
            prop: ''
        },

        {
            text: Lang.content_arial,
            value: 'content_arial',
            prop: ''
        },
        {
            text: Lang.content_georgia,
            value: 'content_georgia',
            prop: ''
        },
        {
            text: Lang.content_cambria,
            value: 'content_cambria',
            prop: ''
        },
        {
            text: Lang.content_calibri,
            value: 'content_calibri',
            prop: ''
        },
        {
            text: Lang.content_verdana,
            value: 'content_verdana',
            prop: ''
        },
        {
            text: Lang.content_roman,
            value: 'content_roman',
            prop: ''
        }

    ];
    let html = '';
    for (let i = 0; i < option.length; i++) {
        html += "<option value=" + option[i].value + " " + option[i].prop + ">" + option[i].text + "</option>";
    }
    return html;
};

// this create custom class options
DND_AUTH.customClassOptions = function() {
    let option = [{
            text: Lang.select_class,
            value: '',
            prop: ''
        },
        {
            text: Lang.sql_terminal,
            value: 'sql_terminal',
            prop: ''
        },
    ];
    let html = '';
    for (let i = 0; i < option.length; i++) {
        html += "<option value=" + option[i].value + " " + option[i].prop + ">" + option[i].text + "</option>";
    }
    return html;
};

// for decoding the entity
DND_AUTH.decodeEnt = function(htmlEnt) {
    return htmlEnt.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
};

/* clsSMDragNDrop\libs\authoring\Drag.svelte generated by Svelte v3.29.0 */

const file = "clsSMDragNDrop\\libs\\authoring\\Drag.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (81:0) {#if drag_value && drag_value.length > 0}
function create_if_block(ctx) {
	let div;
	let div_key_value;
	let each_value = /*drag_value*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "drag_" + /*index*/ ctx[2] + /*drag_value*/ ctx[3].length);
			add_location(div, file, 81, 4, 2162);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*drag_value, deleteElem, elemModal*/ 11) {
				each_value = /*drag_value*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, drag_value*/ 12 && div_key_value !== (div_key_value = "drag_" + /*index*/ ctx[2] + /*drag_value*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(81:0) {#if drag_value && drag_value.length > 0}",
		ctx
	});

	return block;
}

// (83:8) {#each drag_value as data, index}
function create_each_block(ctx) {
	let div2;
	let p;
	let t0_value = (/*data*/ ctx[8].text ? /*data*/ ctx[8].text : "") + "";
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let div2_data_title_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			add_location(p, file, 101, 16, 2976);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file, 107, 24, 3303);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file, 106, 20, 3159);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file, 110, 24, 3510);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file, 109, 20, 3391);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "drag");
			add_location(div0, file, 102, 16, 3029);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file, 113, 16, 3624);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "data-title", div2_data_title_value = /*data*/ ctx[8].title);
			attr_dev(div2, "class", "drag-resize cursor_move dragable ui-draggable ui-resizable");
			attr_dev(div2, "tabindex", "0");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			set_style(div2, "border", /*data*/ ctx[8].border);
			set_style(div2, "background-color", /*data*/ ctx[8].backgroundColor);
			set_style(div2, "background-image", /*data*/ ctx[8].backgroundImage);
			attr_dev(div2, "aria-disabled", "false");
			add_location(div2, file, 83, 12, 2266);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*drag_value*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].text ? /*data*/ ctx[8].text : "") + "")) set_data_dev(t0, t0_value);

			if (dirty & /*drag_value*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*drag_value*/ 8 && div2_data_title_value !== (div2_data_title_value = /*data*/ ctx[8].title)) {
				attr_dev(div2, "data-title", div2_data_title_value);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "border", /*data*/ ctx[8].border);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "background-color", /*data*/ ctx[8].backgroundColor);
			}

			if (dirty & /*drag_value*/ 8) {
				set_style(div2, "background-image", /*data*/ ctx[8].backgroundImage);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(83:8) {#each drag_value as data, index}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let if_block_anchor;
	let if_block = /*drag_value*/ ctx[3] && /*drag_value*/ ctx[3].length > 0 && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*drag_value*/ ctx[3] && /*drag_value*/ ctx[3].length > 0) {
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function validColor(_bgcolor, _invisible) {
	if (_invisible == "1") {
		return "";
	} else if (_bgcolor) {
		return _bgcolor;
	} else {
		return "#CCFFCC";
	}
}

// function used for getting the valid border color
function validBorderColor(_bordercolor) {
	if (_bordercolor) {
		return "1px solid " + _bordercolor;
	} else {
		return "";
	}
}

// function used for getting the background image
function bgImage(img) {
	if (img) {
		let str = img.split(",")[0];

		return (window.inNative
		? "https://s3.amazonaws.com/jigyaasa_content_static/"
		: "https://s3.amazonaws.com/jigyaasa_content_static/") + str;
	} else {
		return "";
	}
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Drag", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let drag = modules;
	let drag_value = [];
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Drag> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("drag", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("drag", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		drag,
		drag_value,
		validColor,
		validBorderColor,
		bgImage
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("drag" in $$props) $$invalidate(7, drag = $$props.drag);
		if ("drag_value" in $$props) $$invalidate(3, drag_value = $$props.drag_value);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, drag, drag_value*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, drag = []);
					$$invalidate(7, drag[0] = modules, drag);
				} else {
					$$invalidate(7, drag = modules);
				}

				$$invalidate(3, drag_value = []);

				drag.map(function (data) {
					$$invalidate(3, drag_value = [
						...drag_value,
						{
							id: data._id,
							title: data.title,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							border: validBorderColor(data._border_color),
							backgroundColor: validColor(data._bgcolor, data._invisible),
							backgroundImage: data._image
							? "url('" + bgImage(data._image) + "')"
							: "none",
							text: data._value
						}
					]);
				});
			} else {
				$$invalidate(3, drag_value = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		drag_value,
		modules,
		click_handler,
		click_handler_1
	];
}

class Drag extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance, create_fragment, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Drag",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Drag> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Drag> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Drag> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Drag>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Drag>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Drop.svelte generated by Svelte v3.29.0 */

const file$1 = "clsSMDragNDrop\\libs\\authoring\\Drop.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (66:0) {#if drop_data && drop_data.length > 0}
function create_if_block$1(ctx) {
	let div;
	let div_key_value;
	let each_value = /*drop_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "drop_" + /*index*/ ctx[2] + /*drop_data*/ ctx[3].length);
			add_location(div, file$1, 66, 4, 1760);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*drop_data, deleteElem, elemModal*/ 11) {
				each_value = /*drop_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$1(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$1(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, drop_data*/ 12 && div_key_value !== (div_key_value = "drop_" + /*index*/ ctx[2] + /*drop_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(66:0) {#if drop_data && drop_data.length > 0}",
		ctx
	});

	return block;
}

// (68:8) {#each drop_data as data, index}
function create_each_block$1(ctx) {
	let div2;
	let p;
	let t0_value = (/*data*/ ctx[8].caption ? /*data*/ ctx[8].caption : "") + "";
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let div2_data_title_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			add_location(p, file$1, 84, 16, 2462);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$1, 90, 24, 2795);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$1, 89, 20, 2651);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$1, 93, 24, 3018);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "id", "editButton");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$1, 92, 20, 2883);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "drop");
			add_location(div0, file$1, 85, 16, 2521);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$1, 96, 16, 3132);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "data-title", div2_data_title_value = /*data*/ ctx[8].title);
			attr_dev(div2, "tabindex", "0");
			attr_dev(div2, "class", "drag-resize cursor_move dropable ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			set_style(div2, "border", /*data*/ ctx[8].border);
			set_style(div2, "background-color", /*data*/ ctx[8].bgcolor);
			add_location(div2, file$1, 68, 12, 1862);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*drop_data*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].caption ? /*data*/ ctx[8].caption : "") + "")) set_data_dev(t0, t0_value);

			if (dirty & /*drop_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*drop_data*/ 8 && div2_data_title_value !== (div2_data_title_value = /*data*/ ctx[8].title)) {
				attr_dev(div2, "data-title", div2_data_title_value);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "border", /*data*/ ctx[8].border);
			}

			if (dirty & /*drop_data*/ 8) {
				set_style(div2, "background-color", /*data*/ ctx[8].bgcolor);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(68:8) {#each drop_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let if_block_anchor;
	let if_block = /*drop_data*/ ctx[3] && /*drop_data*/ ctx[3].length > 0 && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*drop_data*/ ctx[3] && /*drop_data*/ ctx[3].length > 0) {
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
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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

function validColor$1(_bgcolor, _invisible) {
	if (_invisible == "1") {
		return "";
	} else if (_bgcolor) {
		return _bgcolor;
	} else {
		return "#FFFFCC";
	}
}

// function used for getting the valid border color
function validBorderColor$1(_bordercolor) {
	if (_bordercolor) {
		return "1px solid " + _bordercolor;
	} else {
		return "";
	}
}

function instance$1($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Drop", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let drop_auth = modules;
	let drop_data = [];
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Drop> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("drop", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("drop", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		drop_auth,
		drop_data,
		validColor: validColor$1,
		validBorderColor: validBorderColor$1
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("drop_auth" in $$props) $$invalidate(7, drop_auth = $$props.drop_auth);
		if ("drop_data" in $$props) $$invalidate(3, drop_data = $$props.drop_data);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, drop_auth, drop_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, drop_auth = []);
					$$invalidate(7, drop_auth[0] = modules, drop_auth);
				} else {
					$$invalidate(7, drop_auth = modules);
				}

				$$invalidate(3, drop_data = []);

				drop_auth.map(function (data) {
					$$invalidate(3, drop_data = [
						...drop_data,
						{
							id: data._id,
							caption: data._value,
							title: data.title,
							bgcolor: validColor$1(data._bgcolor, data._invisible),
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							border: validBorderColor$1(data._border)
						}
					]);
				});
			} else {
				$$invalidate(3, drop_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		drop_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Drop extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Drop",
			options,
			id: create_fragment$1.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Drop> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Drop> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Drop> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Drop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Drop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Radio.svelte generated by Svelte v3.29.0 */

const file$2 = "clsSMDragNDrop\\libs\\authoring\\Radio.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (43:0) {#if radio_data && radio_data.length > 0}
function create_if_block$2(ctx) {
	let div;
	let div_key_value;
	let each_value = /*radio_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "radio_" + /*index*/ ctx[2] + /*radio_data*/ ctx[3].length);
			add_location(div, file$2, 43, 4, 1140);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*radio_data, deleteElem, elemModal*/ 11) {
				each_value = /*radio_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, radio_data*/ 12 && div_key_value !== (div_key_value = "radio_" + /*index*/ ctx[2] + /*radio_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(43:0) {#if radio_data && radio_data.length > 0}",
		ctx
	});

	return block;
}

// (45:8) {#each radio_data as data, index}
function create_each_block$2(ctx) {
	let div2;
	let input;
	let input_data_id_value;
	let input_id_value;
	let input_class_value;
	let input_data_title_value;
	let input_name_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(input, "type", "radio");
			attr_dev(input, "data-id", input_data_id_value = /*data*/ ctx[8].id);
			attr_dev(input, "id", input_id_value = /*data*/ ctx[8].id);
			attr_dev(input, "class", input_class_value = /*data*/ ctx[8].id + " elem dndradio");
			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[8].id);
			attr_dev(input, "name", input_name_value = /*data*/ ctx[8].name);
			input.value = "0";
			add_location(input, file$2, 57, 16, 1680);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$2, 71, 24, 2277);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$2, 70, 20, 2132);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$2, 74, 24, 2485);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$2, 73, 20, 2365);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "radio");
			add_location(div0, file$2, 66, 16, 2002);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$2, 77, 16, 2599);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "only-dragable drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$2, 45, 12, 1245);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, input);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*radio_data*/ 8 && input_data_id_value !== (input_data_id_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "data-id", input_data_id_value);
			}

			if (dirty & /*radio_data*/ 8 && input_id_value !== (input_id_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*radio_data*/ 8 && input_class_value !== (input_class_value = /*data*/ ctx[8].id + " elem dndradio")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*radio_data*/ 8 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "data-title", input_data_title_value);
			}

			if (dirty & /*radio_data*/ 8 && input_name_value !== (input_name_value = /*data*/ ctx[8].name)) {
				attr_dev(input, "name", input_name_value);
			}

			if (dirty & /*radio_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*radio_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(45:8) {#each radio_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
	let if_block_anchor;
	let if_block = /*radio_data*/ ctx[3] && /*radio_data*/ ctx[3].length > 0 && create_if_block$2(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*radio_data*/ ctx[3] && /*radio_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$2(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
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
	validate_slots("Radio", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let radio_data = [];
	let radio = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Radio> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("radio", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("radio", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		radio_data,
		radio
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("radio_data" in $$props) $$invalidate(3, radio_data = $$props.radio_data);
		if ("radio" in $$props) $$invalidate(7, radio = $$props.radio);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, radio, radio_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, radio = []);
					$$invalidate(7, radio[0] = modules, radio);
				} else {
					$$invalidate(7, radio = modules);
				}

				$$invalidate(3, radio_data = []);

				radio.map(function (data) {
					$$invalidate(3, radio_data = [
						...radio_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							name: data._name
						}
					]);
				});
			} else {
				$$invalidate(3, radio_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		radio_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Radio extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Radio",
			options,
			id: create_fragment$2.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Radio> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Radio> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Radio> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Select.svelte generated by Svelte v3.29.0 */

const file$3 = "clsSMDragNDrop\\libs\\authoring\\Select.svelte";

function get_each_context_1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[10] = list[i];
	return child_ctx;
}

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (73:0) {#if select_data && select_data.length > 0}
function create_if_block$3(ctx) {
	let div;
	let div_key_value;
	let each_value = /*select_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "select_" + /*index*/ ctx[2] + /*select_data*/ ctx[3].length);
			add_location(div, file$3, 73, 4, 2332);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data, deleteElem, elemModal*/ 11) {
				each_value = /*select_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, select_data*/ 12 && div_key_value !== (div_key_value = "select_" + /*index*/ ctx[2] + /*select_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(73:0) {#if select_data && select_data.length > 0}",
		ctx
	});

	return block;
}

// (100:20) {:else}
function create_else_block_1(ctx) {
	let option;

	const block = {
		c: function create() {
			option = element("option");
			option.textContent = "Please Select";
			option.__value = "Please Select";
			option.value = option.__value;
			add_location(option, file$3, 100, 24, 3723);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(100:20) {:else}",
		ctx
	});

	return block;
}

// (92:20) {#if data.select.length}
function create_if_block_1(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[8].select;
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 8) {
				each_value_1 = /*data*/ ctx[8].select;
				validate_each_argument(each_value_1);
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
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(92:20) {#if data.select.length}",
		ctx
	});

	return block;
}

// (96:28) {:else}
function create_else_block(ctx) {
	let option;
	let t_value = /*option*/ ctx[10].text + "";
	let t;
	let option_key_value;
	let option_data_correctans_value;
	let option_data_defaultans_value;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			attr_dev(option, "key", option_key_value = /*option*/ ctx[10].key);
			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[10].correctans);
			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[10].defaultans);
			attr_dev(option, "data-userans", "");
			option.__value = option_value_value = /*option*/ ctx[10].key + 1;
			option.value = option.__value;
			add_location(option, file$3, 96, 32, 3442);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 8 && t_value !== (t_value = /*option*/ ctx[10].text + "")) set_data_dev(t, t_value);

			if (dirty & /*select_data*/ 8 && option_key_value !== (option_key_value = /*option*/ ctx[10].key)) {
				attr_dev(option, "key", option_key_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[10].correctans)) {
				attr_dev(option, "data-correctans", option_data_correctans_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[10].defaultans)) {
				attr_dev(option, "data-defaultans", option_data_defaultans_value);
			}

			if (dirty & /*select_data*/ 8 && option_value_value !== (option_value_value = /*option*/ ctx[10].key + 1)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(96:28) {:else}",
		ctx
	});

	return block;
}

// (94:28) {#if option.selected == 1}
function create_if_block_2(ctx) {
	let option;
	let t_value = /*option*/ ctx[10].text + "";
	let t;
	let option_key_value;
	let option_data_correctans_value;
	let option_data_defaultans_value;
	let option_value_value;

	const block = {
		c: function create() {
			option = element("option");
			t = text(t_value);
			option.selected = "selected";
			attr_dev(option, "key", option_key_value = /*option*/ ctx[10].key);
			attr_dev(option, "data-correctans", option_data_correctans_value = /*option*/ ctx[10].correctans);
			attr_dev(option, "data-defaultans", option_data_defaultans_value = /*option*/ ctx[10].defaultans);
			attr_dev(option, "data-userans", "");
			option.__value = option_value_value = /*option*/ ctx[10].key + 1;
			option.value = option.__value;
			add_location(option, file$3, 94, 32, 3193);
		},
		m: function mount(target, anchor) {
			insert_dev(target, option, anchor);
			append_dev(option, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*select_data*/ 8 && t_value !== (t_value = /*option*/ ctx[10].text + "")) set_data_dev(t, t_value);

			if (dirty & /*select_data*/ 8 && option_key_value !== (option_key_value = /*option*/ ctx[10].key)) {
				attr_dev(option, "key", option_key_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_correctans_value !== (option_data_correctans_value = /*option*/ ctx[10].correctans)) {
				attr_dev(option, "data-correctans", option_data_correctans_value);
			}

			if (dirty & /*select_data*/ 8 && option_data_defaultans_value !== (option_data_defaultans_value = /*option*/ ctx[10].defaultans)) {
				attr_dev(option, "data-defaultans", option_data_defaultans_value);
			}

			if (dirty & /*select_data*/ 8 && option_value_value !== (option_value_value = /*option*/ ctx[10].key + 1)) {
				prop_dev(option, "__value", option_value_value);
				option.value = option.__value;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(option);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(94:28) {#if option.selected == 1}",
		ctx
	});

	return block;
}

// (93:24) {#each data.select as option}
function create_each_block_1(ctx) {
	let if_block_anchor;

	function select_block_type_1(ctx, dirty) {
		if (/*option*/ ctx[10].selected == 1) return create_if_block_2;
		return create_else_block;
	}

	let current_block_type = select_block_type_1(ctx);
	let if_block = current_block_type(ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
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
		d: function destroy(detaching) {
			if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1.name,
		type: "each",
		source: "(93:24) {#each data.select as option}",
		ctx
	});

	return block;
}

// (75:8) {#each select_data as data, index}
function create_each_block$3(ctx) {
	let div2;
	let select_1;
	let select_1_class_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function select_block_type(ctx, dirty) {
		if (/*data*/ ctx[8].select.length) return create_if_block_1;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block = current_block_type(ctx);

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			select_1 = element("select");
			if_block.c();
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(select_1, "class", select_1_class_value = /*data*/ ctx[8].id + " elem dnd_select min_height_0");
			select_1.disabled = "disabled";
			add_location(select_1, file$3, 87, 16, 2861);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$3, 108, 24, 4106);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$3, 107, 20, 3958);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$3, 111, 24, 4317);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$3, 110, 20, 4194);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "dropdown");
			add_location(div0, file$3, 103, 16, 3825);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$3, 114, 16, 4431);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$3, 75, 12, 2440);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, select_1);
			if_block.m(select_1, null);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
				if_block.p(ctx, dirty);
			} else {
				if_block.d(1);
				if_block = current_block_type(ctx);

				if (if_block) {
					if_block.c();
					if_block.m(select_1, null);
				}
			}

			if (dirty & /*select_data*/ 8 && select_1_class_value !== (select_1_class_value = /*data*/ ctx[8].id + " elem dnd_select min_height_0")) {
				attr_dev(select_1, "class", select_1_class_value);
			}

			if (dirty & /*select_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*select_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(75:8) {#each select_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
	let if_block_anchor;
	let if_block = /*select_data*/ ctx[3] && /*select_data*/ ctx[3].length > 0 && create_if_block$3(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*select_data*/ ctx[3] && /*select_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Select", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let select_data = [];
	let select = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Select> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("dropdown", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("dropdown", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		select_data,
		select
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("select_data" in $$props) $$invalidate(3, select_data = $$props.select_data);
		if ("select" in $$props) $$invalidate(7, select = $$props.select);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, select, select_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, select = []);
					$$invalidate(7, select[0] = modules, select);
				} else {
					$$invalidate(7, select = modules);
				}

				$$invalidate(3, select_data = []);

				select.map(function (data) {
					let option = [];

					if (data.__text) {
						data.__text.split("\n").map(function (option_data, index) {
							if (option_data.trim().charAt(0) == "+") {
								option.push({
									key: index,
									correctans: 0,
									defaultans: 1,
									text: option_data.trim().slice(1),
									selected: 1
								});
							} else if (option_data.trim().charAt(0) == "*") {
								option.push({
									key: index,
									correctans: 1,
									defaultans: 0,
									text: option_data.trim().slice(1)
								});
							} else {
								option.push({
									key: index,
									correctans: 0,
									defaultans: 0,
									text: option_data.trim()
								});
							}
						});
					}

					$$invalidate(3, select_data = [
						...select_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							select: option
						}
					]);
				});
			} else {
				$$invalidate(3, select_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		select_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Select extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Select",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Select> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Select> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Select> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Textbox.svelte generated by Svelte v3.29.0 */

const file$4 = "clsSMDragNDrop\\libs\\authoring\\Textbox.svelte";

function get_each_context$4(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (36:0) {#if textbox_data && textbox_data.length > 0}
function create_if_block$4(ctx) {
	let div;
	let div_key_value;
	let each_value = /*textbox_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "textbox_" + /*index*/ ctx[2] + /*textbox_data*/ ctx[3].length);
			add_location(div, file$4, 36, 4, 860);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*textbox_data, deleteElem, elemModal*/ 11) {
				each_value = /*textbox_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$4(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$4(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, textbox_data*/ 12 && div_key_value !== (div_key_value = "textbox_" + /*index*/ ctx[2] + /*textbox_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(36:0) {#if textbox_data && textbox_data.length > 0}",
		ctx
	});

	return block;
}

// (38:8) {#each textbox_data as data, index}
function create_each_block$4(ctx) {
	let div2;
	let input;
	let input_type_value;
	let input_id_value;
	let input_class_value;
	let input_value_value;
	let input_placeholder_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(input, "type", input_type_value = /*data*/ ctx[8]._type);
			attr_dev(input, "id", input_id_value = /*data*/ ctx[8]._id);
			attr_dev(input, "class", input_class_value = /*data*/ ctx[8]._id + " elem dnd_textbox form-control min_height_0");
			attr_dev(input, "name", "");

			input.value = input_value_value = /*data*/ ctx[8]._defaultans
			? /*data*/ ctx[8]._defaultans
			: "";

			attr_dev(input, "placeholder", input_placeholder_value = /*data*/ ctx[8]._placeholder
			? /*data*/ ctx[8]._placeholder
			: "");

			add_location(input, file$4, 50, 16, 1407);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$4, 63, 24, 2075);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$4, 62, 20, 1929);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$4, 66, 24, 2284);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$4, 65, 20, 2163);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "input");
			add_location(div0, file$4, 58, 16, 1799);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$4, 69, 16, 2398);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8]._id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8]._top + "px");
			set_style(div2, "left", /*data*/ ctx[8]._left + "px");
			set_style(div2, "height", /*data*/ ctx[8]._height + "px");
			set_style(div2, "width", /*data*/ ctx[8]._width + "px");
			add_location(div2, file$4, 38, 12, 971);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, input);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*textbox_data*/ 8 && input_type_value !== (input_type_value = /*data*/ ctx[8]._type)) {
				attr_dev(input, "type", input_type_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_id_value !== (input_id_value = /*data*/ ctx[8]._id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_class_value !== (input_class_value = /*data*/ ctx[8]._id + " elem dnd_textbox form-control min_height_0")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_value_value !== (input_value_value = /*data*/ ctx[8]._defaultans
			? /*data*/ ctx[8]._defaultans
			: "") && input.value !== input_value_value) {
				prop_dev(input, "value", input_value_value);
			}

			if (dirty & /*textbox_data*/ 8 && input_placeholder_value !== (input_placeholder_value = /*data*/ ctx[8]._placeholder
			? /*data*/ ctx[8]._placeholder
			: "")) {
				attr_dev(input, "placeholder", input_placeholder_value);
			}

			if (dirty & /*textbox_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8]._id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8]._top + "px");
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8]._left + "px");
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8]._height + "px");
			}

			if (dirty & /*textbox_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8]._width + "px");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$4.name,
		type: "each",
		source: "(38:8) {#each textbox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let if_block_anchor;
	let if_block = /*textbox_data*/ ctx[3] && /*textbox_data*/ ctx[3].length > 0 && create_if_block$4(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*textbox_data*/ ctx[3] && /*textbox_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$4(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Textbox", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let textbox_data = [];
	let textbox = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Textbox> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("input", event.currentTarget, data._id);
	const click_handler_1 = data => deleteElem("input", data._id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		textbox_data,
		textbox
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("textbox_data" in $$props) $$invalidate(3, textbox_data = $$props.textbox_data);
		if ("textbox" in $$props) $$invalidate(7, textbox = $$props.textbox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, textbox, textbox_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, textbox = []);
					$$invalidate(7, textbox[0] = modules, textbox);
				} else {
					$$invalidate(7, textbox = modules);
				}

				$$invalidate(3, textbox_data = []);

				textbox.map(function (data) {
					$$invalidate(3, textbox_data = [...textbox_data, data]);
				});
			} else {
				$$invalidate(3, textbox_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		textbox_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Textbox extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Textbox",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Textbox> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Textbox> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Textbox> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Textbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Textbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Multilinebox.svelte generated by Svelte v3.29.0 */

const file$5 = "clsSMDragNDrop\\libs\\authoring\\Multilinebox.svelte";

function get_each_context$5(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (40:0) {#if multilinebox_data && multilinebox_data.length > 0}
function create_if_block$5(ctx) {
	let div;
	let div_key_value;
	let each_value = /*multilinebox_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$5(get_each_context$5(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "multilinebox_" + /*index*/ ctx[2] + /*multilinebox_data*/ ctx[3].length);
			add_location(div, file$5, 40, 1, 1198);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*multilinebox_data, deleteElem, elemModal*/ 11) {
				each_value = /*multilinebox_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$5(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$5(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, multilinebox_data*/ 12 && div_key_value !== (div_key_value = "multilinebox_" + /*index*/ ctx[2] + /*multilinebox_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(40:0) {#if multilinebox_data && multilinebox_data.length > 0}",
		ctx
	});

	return block;
}

// (42:8) {#each multilinebox_data as data, index}
function create_each_block$5(ctx) {
	let div2;
	let textarea;
	let textarea_class_value;
	let textarea_data_title_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			textarea = element("textarea");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(textarea, "class", textarea_class_value = /*data*/ ctx[8].id + " elem dnd_textarea form-control min_height_0");
			attr_dev(textarea, "data-title", textarea_data_title_value = /*data*/ ctx[8].id);
			add_location(textarea, file$5, 54, 16, 1760);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$5, 63, 24, 2228);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$5, 62, 20, 2079);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$5, 66, 24, 2440);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$5, 65, 20, 2316);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "multiline");
			add_location(div0, file$5, 58, 16, 1945);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$5, 69, 16, 2554);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$5, 42, 12, 1324);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, textarea);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*multilinebox_data*/ 8 && textarea_class_value !== (textarea_class_value = /*data*/ ctx[8].id + " elem dnd_textarea form-control min_height_0")) {
				attr_dev(textarea, "class", textarea_class_value);
			}

			if (dirty & /*multilinebox_data*/ 8 && textarea_data_title_value !== (textarea_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(textarea, "data-title", textarea_data_title_value);
			}

			if (dirty & /*multilinebox_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*multilinebox_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$5.name,
		type: "each",
		source: "(42:8) {#each multilinebox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$5(ctx) {
	let if_block_anchor;
	let if_block = /*multilinebox_data*/ ctx[3] && /*multilinebox_data*/ ctx[3].length > 0 && create_if_block$5(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*multilinebox_data*/ ctx[3] && /*multilinebox_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$5(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Multilinebox", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let multilinebox_data = [];
	let multilinebox_preview = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Multilinebox> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("multiline", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("multiline", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		multilinebox_data,
		multilinebox_preview
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("multilinebox_data" in $$props) $$invalidate(3, multilinebox_data = $$props.multilinebox_data);
		if ("multilinebox_preview" in $$props) $$invalidate(7, multilinebox_preview = $$props.multilinebox_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, multilinebox_preview, multilinebox_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, multilinebox_preview = []);
					$$invalidate(7, multilinebox_preview[0] = modules, multilinebox_preview);
				} else {
					$$invalidate(7, multilinebox_preview = modules);
				}

				$$invalidate(3, multilinebox_data = []);

				multilinebox_preview.map(function (data) {
					$$invalidate(3, multilinebox_data = [
						...multilinebox_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px"
						}
					]);
				});
			} else {
				$$invalidate(3, multilinebox_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		multilinebox_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Multilinebox extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Multilinebox",
			options,
			id: create_fragment$5.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Multilinebox> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Multilinebox> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Multilinebox> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Multilinebox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Multilinebox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Checkbox.svelte generated by Svelte v3.29.0 */

const file$6 = "clsSMDragNDrop\\libs\\authoring\\Checkbox.svelte";

function get_each_context$6(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (42:0) {#if checkbox_data.length > 0}
function create_if_block$6(ctx) {
	let div;
	let div_key_value;
	let each_value = /*checkbox_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$6(get_each_context$6(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "checkbox_" + /*index*/ ctx[2] + /*checkbox_data*/ ctx[3].length);
			add_location(div, file$6, 42, 4, 1132);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*checkbox_data, deleteElem, elemModal*/ 11) {
				each_value = /*checkbox_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$6(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$6(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, checkbox_data*/ 12 && div_key_value !== (div_key_value = "checkbox_" + /*index*/ ctx[2] + /*checkbox_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(42:0) {#if checkbox_data.length > 0}",
		ctx
	});

	return block;
}

// (44:8) {#each checkbox_data as data, index}
function create_each_block$6(ctx) {
	let div2;
	let input;
	let input_class_value;
	let input_data_title_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			input = element("input");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", input_class_value = /*data*/ ctx[8].id + " elem dndcheckbox");
			attr_dev(input, "data-title", input_data_title_value = /*data*/ ctx[8].id);
			add_location(input, file$6, 56, 16, 1666);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$6, 66, 24, 2131);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$6, 65, 20, 1983);
			attr_dev(i1, "class", "icomoon-24px-delete-1");
			add_location(i1, file$6, 69, 24, 2342);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$6, 68, 20, 2219);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "checkbox");
			add_location(div0, file$6, 61, 16, 1850);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$6, 72, 16, 2452);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$6, 44, 12, 1246);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, input);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*checkbox_data*/ 8 && input_class_value !== (input_class_value = /*data*/ ctx[8].id + " elem dndcheckbox")) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty & /*checkbox_data*/ 8 && input_data_title_value !== (input_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(input, "data-title", input_data_title_value);
			}

			if (dirty & /*checkbox_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*checkbox_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$6.name,
		type: "each",
		source: "(44:8) {#each checkbox_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let if_block_anchor;
	let if_block = /*checkbox_data*/ ctx[3].length > 0 && create_if_block$6(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*checkbox_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$6(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Checkbox", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let checkbox_data = [];
	let checkbox = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Checkbox> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("checkbox", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("checkbox", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		checkbox_data,
		checkbox
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("checkbox_data" in $$props) $$invalidate(3, checkbox_data = $$props.checkbox_data);
		if ("checkbox" in $$props) $$invalidate(7, checkbox = $$props.checkbox);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, checkbox, checkbox_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, checkbox = []);
					$$invalidate(7, checkbox[0] = modules, checkbox);
				} else {
					$$invalidate(7, checkbox = modules);
				}

				$$invalidate(3, checkbox_data = []);

				checkbox.map(function (data) {
					$$invalidate(3, checkbox_data = [
						...checkbox_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id
						}
					]);
				});
			} else {
				$$invalidate(3, checkbox_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		checkbox_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Checkbox extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Checkbox",
			options,
			id: create_fragment$6.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Checkbox> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Checkbox> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Checkbox> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Button.svelte generated by Svelte v3.29.0 */

const file$7 = "clsSMDragNDrop\\libs\\authoring\\Button.svelte";

function get_each_context$7(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (45:0) {#if button_preview_data && button_preview_data.length > 0}
function create_if_block$7(ctx) {
	let div;
	let div_key_value;
	let each_value = /*button_preview_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$7(get_each_context$7(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "button_" + /*index*/ ctx[2] + /*button_preview_data*/ ctx[3].length);
			add_location(div, file$7, 45, 4, 1265);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*button_preview_data, deleteElem, elemModal*/ 11) {
				each_value = /*button_preview_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$7(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$7(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, button_preview_data*/ 12 && div_key_value !== (div_key_value = "button_" + /*index*/ ctx[2] + /*button_preview_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(45:0) {#if button_preview_data && button_preview_data.length > 0}",
		ctx
	});

	return block;
}

// (47:8) {#each button_preview_data as data, index}
function create_each_block$7(ctx) {
	let div2;
	let button0;
	let t0_value = (/*data*/ ctx[8].value ? /*data*/ ctx[8].value : "") + "";
	let t0;
	let button0_class_value;
	let button0_data_title_value;
	let t1;
	let div0;
	let button1;
	let i0;
	let t2;
	let button2;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			button0 = element("button");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button1 = element("button");
			i0 = element("i");
			t2 = space();
			button2 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", button0_class_value = /*data*/ ctx[8].id + " elem dnd_button");
			attr_dev(button0, "data-title", button0_data_title_value = /*data*/ ctx[8].id);
			add_location(button0, file$7, 59, 16, 1809);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$7, 71, 24, 2346);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$7, 70, 20, 2200);
			attr_dev(i1, "class", "icomoon-24px-delete-1");
			add_location(i1, file$7, 74, 24, 2555);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-light p-sm");
			add_location(button2, file$7, 73, 20, 2434);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "button");
			add_location(div0, file$7, 66, 16, 2069);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$7, 77, 16, 2665);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$7, 47, 12, 1389);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, button0);
			append_dev(button0, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button1);
			append_dev(button1, i0);
			append_dev(div0, t2);
			append_dev(div0, button2);
			append_dev(button2, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button1, "click", click_handler, false, false, false),
					listen_dev(button2, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*button_preview_data*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].value ? /*data*/ ctx[8].value : "") + "")) set_data_dev(t0, t0_value);

			if (dirty & /*button_preview_data*/ 8 && button0_class_value !== (button0_class_value = /*data*/ ctx[8].id + " elem dnd_button")) {
				attr_dev(button0, "class", button0_class_value);
			}

			if (dirty & /*button_preview_data*/ 8 && button0_data_title_value !== (button0_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(button0, "data-title", button0_data_title_value);
			}

			if (dirty & /*button_preview_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*button_preview_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$7.name,
		type: "each",
		source: "(47:8) {#each button_preview_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let if_block_anchor;
	let if_block = /*button_preview_data*/ ctx[3] && /*button_preview_data*/ ctx[3].length > 0 && create_if_block$7(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*button_preview_data*/ ctx[3] && /*button_preview_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$7(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Button", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let button_preview_data = [];
	let button_preview = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("button", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("button", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		button_preview_data,
		button_preview
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("button_preview_data" in $$props) $$invalidate(3, button_preview_data = $$props.button_preview_data);
		if ("button_preview" in $$props) $$invalidate(7, button_preview = $$props.button_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, button_preview, button_preview_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, button_preview = []);
					$$invalidate(7, button_preview[0] = modules, button_preview);
				} else {
					$$invalidate(7, button_preview = modules);
				}

				$$invalidate(3, button_preview_data = []);

				button_preview.map(function (data) {
					$$invalidate(3, button_preview_data = [
						...button_preview_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id,
							value: data._value
						}
					]);
				});
			} else {
				$$invalidate(3, button_preview_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		button_preview_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Button extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Button",
			options,
			id: create_fragment$7.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Button> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Button> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Button> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Tabhead.svelte generated by Svelte v3.29.0 */

const file$8 = "clsSMDragNDrop\\libs\\authoring\\Tabhead.svelte";

function get_each_context$8(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (44:0) {#if tabhead_data && tabhead_data.length > 0}
function create_if_block$8(ctx) {
	let div;
	let div_key_value;
	let each_value = /*tabhead_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$8(get_each_context$8(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "tabhead_" + /*index*/ ctx[2] + /*tabhead_data*/ ctx[3].length);
			add_location(div, file$8, 44, 4, 1225);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tabhead_data, deleteElem, elemModal*/ 11) {
				each_value = /*tabhead_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$8(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$8(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, tabhead_data*/ 12 && div_key_value !== (div_key_value = "tabhead_" + /*index*/ ctx[2] + /*tabhead_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(44:0) {#if tabhead_data && tabhead_data.length > 0}",
		ctx
	});

	return block;
}

// (46:8) {#each tabhead_data as data, index}
function create_each_block$8(ctx) {
	let div1;
	let div0;
	let button0;
	let i0;
	let t0;
	let button1;
	let i1;
	let t1;
	let div1_key_value;
	let div1_id_value;
	let div1_data_title_value;
	let div1_class_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t0 = space();
			button1 = element("button");
			i1 = element("i");
			t1 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$8, 65, 20, 2037);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$8, 64, 16, 1894);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$8, 68, 20, 2235);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$8, 67, 16, 2117);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "tabhead");
			add_location(div0, file$8, 60, 12, 1778);
			attr_dev(div1, "key", div1_key_value = /*index*/ ctx[2]);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[8].id);
			attr_dev(div1, "data-title", div1_data_title_value = /*data*/ ctx[8].id);
			attr_dev(div1, "data-type", "tabhead");
			attr_dev(div1, "class", div1_class_value = /*data*/ ctx[8].classes);
			set_style(div1, "position", "absolute");
			set_style(div1, "top", /*data*/ ctx[8].top);
			set_style(div1, "left", /*data*/ ctx[8].left);
			set_style(div1, "height", /*data*/ ctx[8].height);
			set_style(div1, "width", /*data*/ ctx[8].width);
			add_location(div1, file$8, 46, 12, 1336);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t0);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div1, t1);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*tabhead_data*/ 8 && div1_id_value !== (div1_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div1, "id", div1_id_value);
			}

			if (dirty & /*tabhead_data*/ 8 && div1_data_title_value !== (div1_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(div1, "data-title", div1_data_title_value);
			}

			if (dirty & /*tabhead_data*/ 8 && div1_class_value !== (div1_class_value = /*data*/ ctx[8].classes)) {
				attr_dev(div1, "class", div1_class_value);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*tabhead_data*/ 8) {
				set_style(div1, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$8.name,
		type: "each",
		source: "(46:8) {#each tabhead_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let if_block_anchor;
	let if_block = /*tabhead_data*/ ctx[3] && /*tabhead_data*/ ctx[3].length > 0 && create_if_block$8(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*tabhead_data*/ ctx[3] && /*tabhead_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$8(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Tabhead", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let tabhead_data = [];
	let tabhead = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tabhead> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("tabhead", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("tabhead", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		tabhead_data,
		tabhead
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("tabhead_data" in $$props) $$invalidate(3, tabhead_data = $$props.tabhead_data);
		if ("tabhead" in $$props) $$invalidate(7, tabhead = $$props.tabhead);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, tabhead, tabhead_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, tabhead = []);
					$$invalidate(7, tabhead[0] = modules, tabhead);
				} else {
					$$invalidate(7, tabhead = modules);
				}

				$$invalidate(3, tabhead_data = []);

				tabhead.map(function (data) {
					$$invalidate(3, tabhead_data = [
						...tabhead_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id,
							classes: "drag-resize cursor_move ui-draggable dndtabhead ui-resizable"
						}
					]);
				});
			} else {
				$$invalidate(3, tabhead_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		tabhead_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Tabhead extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tabhead",
			options,
			id: create_fragment$8.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Tabhead> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Tabhead> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Tabhead> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Tabhead>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Tabhead>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Img.svelte generated by Svelte v3.29.0 */

const file$9 = "clsSMDragNDrop\\libs\\authoring\\Img.svelte";

function get_each_context$9(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (43:0) {#if img_data && img_data.length > 0}
function create_if_block$9(ctx) {
	let div;
	let div_key_value;
	let each_value = /*img_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$9(get_each_context$9(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "img_" + /*index*/ ctx[2] + /*img_data*/ ctx[3].length);
			add_location(div, file$9, 43, 4, 1112);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*img_data, deleteElem, elemModal*/ 11) {
				each_value = /*img_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$9(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$9(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, img_data*/ 12 && div_key_value !== (div_key_value = "img_" + /*index*/ ctx[2] + /*img_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$9.name,
		type: "if",
		source: "(43:0) {#if img_data && img_data.length > 0}",
		ctx
	});

	return block;
}

// (45:8) {#each img_data as data, index}
function create_each_block$9(ctx) {
	let div2;
	let img_1;
	let img_1_src_value;
	let img_1_class_value;
	let img_1_data_title_value;
	let t0;
	let div0;
	let button0;
	let i0;
	let t1;
	let button1;
	let i1;
	let t2;
	let div1;
	let t3;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			img_1 = element("img");
			t0 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t1 = space();
			button1 = element("button");
			i1 = element("i");
			t2 = space();
			div1 = element("div");
			t3 = space();
			if (img_1.src !== (img_1_src_value = /*data*/ ctx[8].src)) attr_dev(img_1, "src", img_1_src_value);
			attr_dev(img_1, "class", img_1_class_value = /*data*/ ctx[8]._id + " elem dnd_img");
			attr_dev(img_1, "data-title", img_1_data_title_value = /*data*/ ctx[8].id);
			attr_dev(img_1, "style", "display : inline;");
			attr_dev(img_1, "alt", "");
			add_location(img_1, file$9, 57, 16, 1620);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$9, 69, 24, 2143);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$9, 68, 20, 2000);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$9, 72, 24, 2349);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$9, 71, 20, 2231);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "img");
			add_location(div0, file$9, 64, 16, 1872);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$9, 75, 16, 2463);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$9, 45, 12, 1211);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, img_1);
			append_dev(div2, t0);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t1);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t2);
			append_dev(div2, div1);
			append_dev(div2, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*img_data*/ 8 && img_1.src !== (img_1_src_value = /*data*/ ctx[8].src)) {
				attr_dev(img_1, "src", img_1_src_value);
			}

			if (dirty & /*img_data*/ 8 && img_1_class_value !== (img_1_class_value = /*data*/ ctx[8]._id + " elem dnd_img")) {
				attr_dev(img_1, "class", img_1_class_value);
			}

			if (dirty & /*img_data*/ 8 && img_1_data_title_value !== (img_1_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(img_1, "data-title", img_1_data_title_value);
			}

			if (dirty & /*img_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*img_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$9.name,
		type: "each",
		source: "(45:8) {#each img_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$9(ctx) {
	let if_block_anchor;
	let if_block = /*img_data*/ ctx[3] && /*img_data*/ ctx[3].length > 0 && create_if_block$9(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*img_data*/ ctx[3] && /*img_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$9(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Img", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let img_data = [];
	let img = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Img> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("img", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("img", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		img_data,
		img
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("img_data" in $$props) $$invalidate(3, img_data = $$props.img_data);
		if ("img" in $$props) $$invalidate(7, img = $$props.img);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, img, img_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, img = []);
					$$invalidate(7, img[0] = modules, img);
				} else {
					$$invalidate(7, img = modules);
				}

				$$invalidate(3, img_data = []);

				img.map(function (data) {
					$$invalidate(3, img_data = [
						...img_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							src: data._bgimg
						}
					]);
				});
			} else {
				$$invalidate(3, img_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		img_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Img extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Img",
			options,
			id: create_fragment$9.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Img> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Img> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Img> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Img>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Img>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Label.svelte generated by Svelte v3.29.0 */

const file$a = "clsSMDragNDrop\\libs\\authoring\\Label.svelte";

function get_each_context$a(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (66:0) {#if label_preview_data && label_preview_data.length}
function create_if_block$a(ctx) {
	let div;
	let div_key_value;
	let each_value = /*label_preview_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$a(get_each_context$a(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "label_" + /*index*/ ctx[2] + /*label_preview_data*/ ctx[3].length);
			add_location(div, file$a, 66, 4, 2183);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*label_preview_data, deleteElem, elemModal*/ 11) {
				each_value = /*label_preview_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$a(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$a(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, label_preview_data*/ 12 && div_key_value !== (div_key_value = "label_" + /*index*/ ctx[2] + /*label_preview_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$a.name,
		type: "if",
		source: "(66:0) {#if label_preview_data && label_preview_data.length}",
		ctx
	});

	return block;
}

// (69:8) {#each label_preview_data as data, index}
function create_each_block$a(ctx) {
	let div2;
	let p;
	let t0_value = (/*data*/ ctx[8].parahtml ? /*data*/ ctx[8].parahtml : "") + "";
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let div1;
	let t4;
	let div2_key_value;
	let div2_id_value;
	let div2_class_value;
	let div2_style_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			p = element("p");
			t0 = text(t0_value);
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			div1 = element("div");
			t4 = space();
			add_location(p, file$a, 77, 16, 2566);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$a, 83, 24, 2902);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$a, 82, 20, 2757);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$a, 86, 24, 3110);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$a, 85, 20, 2990);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "label");
			add_location(div0, file$a, 78, 16, 2627);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$a, 89, 16, 3224);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", div2_class_value = /*data*/ ctx[8].classes);
			attr_dev(div2, "tabindex", "1");
			attr_dev(div2, "style", div2_style_value = /*data*/ ctx[8].style);
			add_location(div2, file$a, 70, 12, 2366);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, p);
			append_dev(p, t0);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t3);
			append_dev(div2, div1);
			append_dev(div2, t4);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*label_preview_data*/ 8 && t0_value !== (t0_value = (/*data*/ ctx[8].parahtml ? /*data*/ ctx[8].parahtml : "") + "")) set_data_dev(t0, t0_value);

			if (dirty & /*label_preview_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*label_preview_data*/ 8 && div2_class_value !== (div2_class_value = /*data*/ ctx[8].classes)) {
				attr_dev(div2, "class", div2_class_value);
			}

			if (dirty & /*label_preview_data*/ 8 && div2_style_value !== (div2_style_value = /*data*/ ctx[8].style)) {
				attr_dev(div2, "style", div2_style_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$a.name,
		type: "each",
		source: "(69:8) {#each label_preview_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$a(ctx) {
	let if_block_anchor;
	let if_block = /*label_preview_data*/ ctx[3] && /*label_preview_data*/ ctx[3].length && create_if_block$a(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*label_preview_data*/ ctx[3] && /*label_preview_data*/ ctx[3].length) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$a(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function changeStyletoString(data) {
	let style = "";

	for (let key in data) {
		style += key.replace(/_/g, "-") + ":" + data[key] + ";";
	}

	return style;
}

// function for setting the inner html
function setInnerHtml(htmlEnt) {
	return htmlEnt
	? htmlEnt.replace(/&#(\d+);/g, function (match, dec) {
			return String.fromCharCode(dec);
		})
	: "";
}

function instance$a($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Label", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let label_preview_data = [];
	let labelPreview = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Label> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("label", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("label", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		label_preview_data,
		labelPreview,
		changeStyletoString,
		setInnerHtml
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("label_preview_data" in $$props) $$invalidate(3, label_preview_data = $$props.label_preview_data);
		if ("labelPreview" in $$props) $$invalidate(7, labelPreview = $$props.labelPreview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, labelPreview, label_preview_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, labelPreview = []);
					$$invalidate(7, labelPreview[0] = modules, labelPreview);
				} else {
					$$invalidate(7, labelPreview = modules);
				}

				$$invalidate(3, label_preview_data = []);

				labelPreview.map(function (data) {
					let styling = changeStyletoString({
						position: "absolute",
						top: data._top + "px",
						left: data._left + "px",
						height: data._height + "px",
						width: data._width + "px",
						border: data._border_size + "px solid " + data._border_color,
						background_color: data._background_color
					});

					$$invalidate(3, label_preview_data = [
						...label_preview_data,
						{
							id: data._id,
							style: styling,
							classes: "drag-resize cursor_move dndlabel ui-draggable ui-resizable " + (data._label_class ? data._label_class : ""),
							parahtml: data._richtext
							? setInnerHtml(data.__cdata)
							: data._title
						}
					]);
				});
			} else {
				$$invalidate(3, label_preview_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		label_preview_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Label extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Label",
			options,
			id: create_fragment$a.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Label> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Label> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Label> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Label>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Label>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Hotspot.svelte generated by Svelte v3.29.0 */

const file$b = "clsSMDragNDrop\\libs\\authoring\\Hotspot.svelte";

function get_each_context_1$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[13] = list[i];
	child_ctx[15] = i;
	return child_ctx;
}

function get_each_context$b(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (64:0) {#if hotspot_data && hotspot_data.length > 0}
function create_if_block$b(ctx) {
	let div;
	let div_key_value;
	let each_value = /*hotspot_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$b(get_each_context$b(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "hotspot_" + /*index*/ ctx[2] + /*hotspot_data*/ ctx[3].length);
			add_location(div, file$b, 64, 4, 1974);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data, elemModal, deleteElem*/ 11) {
				each_value = /*hotspot_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$b(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$b(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, hotspot_data*/ 12 && div_key_value !== (div_key_value = "hotspot_" + /*index*/ ctx[2] + /*hotspot_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$b.name,
		type: "if",
		source: "(64:0) {#if hotspot_data && hotspot_data.length > 0}",
		ctx
	});

	return block;
}

// (81:16) {#if data.bgimg}
function create_if_block_2$1(ctx) {
	let img;
	let img_src_value;

	const block = {
		c: function create() {
			img = element("img");
			set_style(img, "display", "none");
			attr_dev(img, "alt", "hotspot");
			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[11].bgimg)) attr_dev(img, "src", img_src_value);
			add_location(img, file$b, 81, 20, 2663);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data*/ 8 && img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[11].bgimg)) {
				attr_dev(img, "src", img_src_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(81:16) {#if data.bgimg}",
		ctx
	});

	return block;
}

// (84:16) {#if data.child.length > 0}
function create_if_block_1$1(ctx) {
	let each_1_anchor;
	let each_value_1 = /*data*/ ctx[11].child;
	validate_each_argument(each_value_1);
	let each_blocks = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hotspot_data, deleteElem, elemModal*/ 11) {
				each_value_1 = /*data*/ ctx[11].child;
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block_1$1(child_ctx);
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
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(84:16) {#if data.child.length > 0}",
		ctx
	});

	return block;
}

// (85:20) {#each data.child as child_data, child_index}
function create_each_block_1$1(ctx) {
	let div2;
	let div0;
	let button0;
	let i0;
	let t0;
	let button1;
	let i1;
	let t1;
	let div1;
	let t2;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[11], /*child_index*/ ctx[15], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[11], /*child_index*/ ctx[15], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t0 = space();
			button1 = element("button");
			i1 = element("i");
			t1 = space();
			div1 = element("div");
			t2 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$b, 103, 36, 3997);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$b, 102, 32, 3806);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$b, 106, 36, 4275);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$b, 105, 32, 4109);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "hotspot_click");
			add_location(div0, file$b, 98, 28, 3620);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$b, 109, 28, 4425);
			attr_dev(div2, "key", div2_key_value = /*child_index*/ ctx[15]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[11].id + "_" + (/*child_index*/ ctx[15] + 1));
			attr_dev(div2, "data-correctans", "0");
			attr_dev(div2, "class", "drag-resize hs_item ui-draggable cursor_move ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*child_data*/ ctx[13].top);
			set_style(div2, "left", /*child_data*/ ctx[13].left);
			set_style(div2, "height", /*child_data*/ ctx[13].height);
			set_style(div2, "width", /*child_data*/ ctx[13].width);
			add_location(div2, file$b, 85, 24, 2941);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t0);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div2, t2);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*hotspot_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[11].id + "_" + (/*child_index*/ ctx[15] + 1))) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "top", /*child_data*/ ctx[13].top);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "left", /*child_data*/ ctx[13].left);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "height", /*child_data*/ ctx[13].height);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "width", /*child_data*/ ctx[13].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$1.name,
		type: "each",
		source: "(85:20) {#each data.child as child_data, child_index}",
		ctx
	});

	return block;
}

// (66:8) {#each hotspot_data as data, index}
function create_each_block$b(ctx) {
	let div2;
	let t0;
	let t1;
	let div0;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let button2;
	let i2;
	let t4;
	let div1;
	let t5;
	let div2_key_value;
	let div2_id_value;
	let mounted;
	let dispose;
	let if_block0 = /*data*/ ctx[11].bgimg && create_if_block_2$1(ctx);
	let if_block1 = /*data*/ ctx[11].child.length > 0 && create_if_block_1$1(ctx);

	function click_handler_2(...args) {
		return /*click_handler_2*/ ctx[7](/*data*/ ctx[11], ...args);
	}

	function click_handler_3(...args) {
		return /*click_handler_3*/ ctx[8](/*data*/ ctx[11], ...args);
	}

	function click_handler_4(...args) {
		return /*click_handler_4*/ ctx[9](/*data*/ ctx[11], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			button2 = element("button");
			i2 = element("i");
			t4 = space();
			div1 = element("div");
			t5 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$b, 119, 24, 4850);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$b, 118, 20, 4703);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$b, 122, 24, 5060);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$b, 121, 20, 4938);
			attr_dev(i2, "class", "icomoon-plus");
			add_location(i2, file$b, 125, 24, 5296);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "class", "btn btn-light p-sm");
			add_location(button2, file$b, 124, 20, 5154);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "hotspot");
			add_location(div0, file$b, 114, 16, 4571);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$b, 128, 16, 5397);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[11].id);
			attr_dev(div2, "class", "drag-resize cursor_move hotspot_auth ui-draggable ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[11].top);
			set_style(div2, "left", /*data*/ ctx[11].left);
			set_style(div2, "height", /*data*/ ctx[11].height);
			set_style(div2, "width", /*data*/ ctx[11].width);
			set_style(div2, "border", /*data*/ ctx[11].border);
			set_style(div2, "background-image", /*data*/ ctx[11].backgroundImage + "\r\n                ");
			add_location(div2, file$b, 66, 12, 2085);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			if (if_block0) if_block0.m(div2, null);
			append_dev(div2, t0);
			if (if_block1) if_block1.m(div2, null);
			append_dev(div2, t1);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t2);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div0, t3);
			append_dev(div0, button2);
			append_dev(button2, i2);
			append_dev(div2, t4);
			append_dev(div2, div1);
			append_dev(div2, t5);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler_2, false, false, false),
					listen_dev(button1, "click", click_handler_3, false, false, false),
					listen_dev(button2, "click", click_handler_4, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*data*/ ctx[11].bgimg) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$1(ctx);
					if_block0.c();
					if_block0.m(div2, t0);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (/*data*/ ctx[11].child.length > 0) {
				if (if_block1) {
					if_block1.p(ctx, dirty);
				} else {
					if_block1 = create_if_block_1$1(ctx);
					if_block1.c();
					if_block1.m(div2, t1);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (dirty & /*hotspot_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[11].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[11].top);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[11].left);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[11].height);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[11].width);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "border", /*data*/ ctx[11].border);
			}

			if (dirty & /*hotspot_data*/ 8) {
				set_style(div2, "background-image", /*data*/ ctx[11].backgroundImage + "\r\n                ");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$b.name,
		type: "each",
		source: "(66:8) {#each hotspot_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$b(ctx) {
	let if_block_anchor;
	let if_block = /*hotspot_data*/ ctx[3] && /*hotspot_data*/ ctx[3].length > 0 && create_if_block$b(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*hotspot_data*/ ctx[3] && /*hotspot_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$b(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$b.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function bgImage$1(img) {
	if (img) {
		return (window.inNative
		? "https://s3.amazonaws.com/jigyaasa_content_static/"
		: "https://s3.amazonaws.com/jigyaasa_content_static/") + img;
	} else {
		return "";
	}
}

function instance$b($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Hotspot", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let hotspot_data = [];
	let hotspot = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Hotspot> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, child_index, event) => elemModal("hotspot_click", event.currentTarget, data.id + "_" + (child_index + 1));
	const click_handler_1 = (data, child_index) => deleteElem("hotspot_click", data.id + "_" + (child_index + 1));
	const click_handler_2 = (data, event) => elemModal("hotspot", event.currentTarget, data.id);
	const click_handler_3 = data => deleteElem("hotspot", data.id);
	const click_handler_4 = data => elemModal("hotspot_click", "[id=" + data.id + "]");

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		hotspot_data,
		hotspot,
		bgImage: bgImage$1
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("hotspot_data" in $$props) $$invalidate(3, hotspot_data = $$props.hotspot_data);
		if ("hotspot" in $$props) $$invalidate(10, hotspot = $$props.hotspot);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, hotspot, hotspot_data*/ 1048) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(10, hotspot = []);
					$$invalidate(10, hotspot[0] = modules, hotspot);
				} else {
					$$invalidate(10, hotspot = modules);
				}

				$$invalidate(3, hotspot_data = []);

				hotspot.map(function (data, index) {
					let inner_component = [];
					let innerText = JSON.parse(data.__text ? data.__text : data.__cdata);

					for (let key in innerText) {
						inner_component.push({
							top: innerText[key][0] + "px",
							left: innerText[key][1] + "px",
							width: innerText[key][2] + "px",
							height: innerText[key][3] + "px"
						});
					}

					$$invalidate(3, hotspot_data = [
						...hotspot_data,
						{
							id: data._id,
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							backgroundImage: "url('" + bgImage$1(data._bgimg) + "')",
							bgimg: data._bgimg,
							child: inner_component
						}
					]);
				});
			} else {
				$$invalidate(3, hotspot_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		hotspot_data,
		modules,
		click_handler,
		click_handler_1,
		click_handler_2,
		click_handler_3,
		click_handler_4
	];
}

class Hotspot extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Hotspot",
			options,
			id: create_fragment$b.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Hotspot> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Hotspot> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Hotspot> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Hotspot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Hotspot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Menulist.svelte generated by Svelte v3.29.0 */

const file$c = "clsSMDragNDrop\\libs\\authoring\\Menulist.svelte";

function get_each_context$c(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[2] = i;
	return child_ctx;
}

// (43:0) {#if menulist_data && menulist_data.length > 0}
function create_if_block$c(ctx) {
	let div;
	let div_key_value;
	let each_value = /*menulist_data*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$c(get_each_context$c(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "menulist_" + /*index*/ ctx[2] + /*menulist_data*/ ctx[3].length);
			add_location(div, file$c, 43, 4, 1175);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*menulist_data, deleteElem, elemModal*/ 11) {
				each_value = /*menulist_data*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$c(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$c(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (dirty & /*index, menulist_data*/ 12 && div_key_value !== (div_key_value = "menulist_" + /*index*/ ctx[2] + /*menulist_data*/ ctx[3].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$c.name,
		type: "if",
		source: "(43:0) {#if menulist_data && menulist_data.length > 0}",
		ctx
	});

	return block;
}

// (45:8) {#each menulist_data as data, index}
function create_each_block$c(ctx) {
	let div2;
	let div0;
	let button0;
	let i0;
	let t0;
	let button1;
	let i1;
	let t1;
	let div1;
	let t2;
	let div2_key_value;
	let div2_id_value;
	let div2_data_title_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[5](/*data*/ ctx[8], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			button0 = element("button");
			i0 = element("i");
			t0 = space();
			button1 = element("button");
			i1 = element("i");
			t1 = space();
			div1 = element("div");
			t2 = space();
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$c, 63, 24, 2032);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$c, 62, 20, 1884);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$c, 66, 24, 2243);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$c, 65, 20, 2120);
			attr_dev(div0, "class", "btn-group tools h");
			attr_dev(div0, "data-t", "menulist");
			add_location(div0, file$c, 58, 16, 1751);
			attr_dev(div1, "class", "resizer icomoon-resize");
			add_location(div1, file$c, 69, 16, 2357);
			attr_dev(div2, "key", div2_key_value = /*index*/ ctx[2]);
			attr_dev(div2, "id", div2_id_value = /*data*/ ctx[8].id);
			attr_dev(div2, "data-title", div2_data_title_value = /*data*/ ctx[8].id);
			attr_dev(div2, "class", "drag-resize cursor_move ui-draggable dndarea ui-resizable");
			set_style(div2, "position", "absolute");
			set_style(div2, "top", /*data*/ ctx[8].top);
			set_style(div2, "left", /*data*/ ctx[8].left);
			set_style(div2, "height", /*data*/ ctx[8].height);
			set_style(div2, "width", /*data*/ ctx[8].width);
			add_location(div2, file$c, 45, 12, 1289);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, button0);
			append_dev(button0, i0);
			append_dev(div0, t0);
			append_dev(div0, button1);
			append_dev(button1, i1);
			append_dev(div2, t1);
			append_dev(div2, div1);
			append_dev(div2, t2);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*menulist_data*/ 8 && div2_id_value !== (div2_id_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "id", div2_id_value);
			}

			if (dirty & /*menulist_data*/ 8 && div2_data_title_value !== (div2_data_title_value = /*data*/ ctx[8].id)) {
				attr_dev(div2, "data-title", div2_data_title_value);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "top", /*data*/ ctx[8].top);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "left", /*data*/ ctx[8].left);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "height", /*data*/ ctx[8].height);
			}

			if (dirty & /*menulist_data*/ 8) {
				set_style(div2, "width", /*data*/ ctx[8].width);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$c.name,
		type: "each",
		source: "(45:8) {#each menulist_data as data, index}",
		ctx
	});

	return block;
}

function create_fragment$c(ctx) {
	let if_block_anchor;
	let if_block = /*menulist_data*/ ctx[3] && /*menulist_data*/ ctx[3].length > 0 && create_if_block$c(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*menulist_data*/ ctx[3] && /*menulist_data*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$c(ctx);
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$c.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$c($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Menulist", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let menulist_data = [];
	let menulist_preview = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menulist> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("menulist", event.currentTarget, data.id);
	const click_handler_1 = data => deleteElem("menulist", data.id);

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
	};

	$$self.$capture_state = () => ({
		modules,
		index,
		deleteElem,
		elemModal,
		menulist_data,
		menulist_preview
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(2, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("menulist_data" in $$props) $$invalidate(3, menulist_data = $$props.menulist_data);
		if ("menulist_preview" in $$props) $$invalidate(7, menulist_preview = $$props.menulist_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules, menulist_preview, menulist_data*/ 152) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(7, menulist_preview = []);
					$$invalidate(7, menulist_preview[0] = modules, menulist_preview);
				} else {
					$$invalidate(7, menulist_preview = modules);
				}

				$$invalidate(3, menulist_data = []);

				menulist_preview.map(function (data) {
					$$invalidate(3, menulist_data = [
						...menulist_data,
						{
							top: data._top + "px",
							left: data._left + "px",
							height: data._height + "px",
							width: data._width + "px",
							id: data._id
						}
					]);
				});
			} else {
				$$invalidate(3, menulist_data = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		index,
		menulist_data,
		modules,
		click_handler,
		click_handler_1
	];
}

class Menulist extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
			modules: 4,
			index: 2,
			deleteElem: 0,
			elemModal: 1
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Menulist",
			options,
			id: create_fragment$c.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Menulist> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Menulist> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Menulist> was created without expected prop 'elemModal'");
		}
	}

	get modules() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Menulist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Menulist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Tabpills.svelte generated by Svelte v3.29.0 */
const file$d = "clsSMDragNDrop\\libs\\authoring\\Tabpills.svelte";

function get_each_context$d(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

function get_each_context_1$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[8] = i;
	return child_ctx;
}

// (42:4) {#if tab_pills_preview && tab_pills_preview.length > 0}
function create_if_block$d(ctx) {
	let ul;
	let t;
	let div;
	let current;
	let each_value_1 = /*tab_pills_preview*/ ctx[3];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
	}

	let each_value = /*tab_pills_preview*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$d(get_each_context$d(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			ul = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(ul, "class", "nav nav-pills margin-bottom mt-3 px-2");
			attr_dev(ul, "role", "tablist");
			add_location(ul, file$d, 42, 8, 1341);
			attr_dev(div, "class", "tab-content");
			attr_dev(div, "type", "tab");
			set_style(div, "position", "relative");
			add_location(div, file$d, 49, 8, 1792);
		},
		m: function mount(target, anchor) {
			insert_dev(target, ul, anchor);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul, null);
			}

			insert_dev(target, t, anchor);
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 8) {
				each_value_1 = /*tab_pills_preview*/ ctx[3];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1$2(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*tab_pills_preview, elemModal, deleteElem, checkImageStatus*/ 15) {
				each_value = /*tab_pills_preview*/ ctx[3];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$d(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$d(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(ul);
			destroy_each(each_blocks_1, detaching);
			if (detaching) detach_dev(t);
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$d.name,
		type: "if",
		source: "(42:4) {#if tab_pills_preview && tab_pills_preview.length > 0}",
		ctx
	});

	return block;
}

// (44:12) {#each tab_pills_preview as data, index}
function create_each_block_1$2(ctx) {
	let li;
	let a;
	let t0_value = /*data*/ ctx[6]._value + "";
	let t0;
	let a_data_bs_target_value;
	let a_class_value;
	let a_href_value;
	let t1;
	let li_for_value;
	let li_key_value;

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			attr_dev(a, "data-bs-toggle", "pill");
			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#" + /*data*/ ctx[6]._id);
			attr_dev(a, "class", a_class_value = "nav-link" + (/*data*/ ctx[6]._display == "1" ? " active" : ""));
			attr_dev(a, "href", a_href_value = "#" + /*data*/ ctx[6]._id);
			add_location(a, file$d, 45, 20, 1568);
			attr_dev(li, "for", li_for_value = /*data*/ ctx[6]._id);
			attr_dev(li, "key", li_key_value = "tab_pills_list_" + /*index*/ ctx[8]);
			attr_dev(li, "class", "nav-item");
			add_location(li, file$d, 44, 16, 1478);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(li, t1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 8 && t0_value !== (t0_value = /*data*/ ctx[6]._value + "")) set_data_dev(t0, t0_value);

			if (dirty & /*tab_pills_preview*/ 8 && a_data_bs_target_value !== (a_data_bs_target_value = "#" + /*data*/ ctx[6]._id)) {
				attr_dev(a, "data-bs-target", a_data_bs_target_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && a_class_value !== (a_class_value = "nav-link" + (/*data*/ ctx[6]._display == "1" ? " active" : ""))) {
				attr_dev(a, "class", a_class_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && a_href_value !== (a_href_value = "#" + /*data*/ ctx[6]._id)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && li_for_value !== (li_for_value = /*data*/ ctx[6]._id)) {
				attr_dev(li, "for", li_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$2.name,
		type: "each",
		source: "(44:12) {#each tab_pills_preview as data, index}",
		ctx
	});

	return block;
}

// (58:20) {#if data._bgimg}
function create_if_block_1$2(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[6]._bgimg)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[6]._alt);
			add_location(img, file$d, 58, 24, 2225);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[5], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_pills_preview*/ 8 && img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[6]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*tab_pills_preview*/ 8 && img_alt_value !== (img_alt_value = /*data*/ ctx[6]._alt)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(58:20) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (51:12) {#each tab_pills_preview as data, index}
function create_each_block$d(ctx) {
	let div;
	let t0;
	let drag;
	let t1;
	let drop;
	let t2;
	let radio;
	let t3;
	let select;
	let t4;
	let textbox;
	let t5;
	let multilinebox;
	let t6;
	let checkbox;
	let t7;
	let button;
	let t8;
	let tabhead;
	let t9;
	let img;
	let t10;
	let label;
	let t11;
	let hotspot;
	let t12;
	let menulist;
	let t13;
	let div_key_value;
	let div_id_value;
	let div_class_value;
	let current;
	let if_block = /*data*/ ctx[6]._bgimg && create_if_block_1$2(ctx);

	drag = new Drag({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	drop = new Drop({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].select ? /*data*/ ctx[6].select : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].multilinebox
				? /*data*/ ctx[6].multilinebox
				: "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	button = new Button({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].button ? /*data*/ ctx[6].button : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].img ? /*data*/ ctx[6].img : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].label ? /*data*/ ctx[6].label : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 0,
				modules: /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			create_component(drag.$$.fragment);
			t1 = space();
			create_component(drop.$$.fragment);
			t2 = space();
			create_component(radio.$$.fragment);
			t3 = space();
			create_component(select.$$.fragment);
			t4 = space();
			create_component(textbox.$$.fragment);
			t5 = space();
			create_component(multilinebox.$$.fragment);
			t6 = space();
			create_component(checkbox.$$.fragment);
			t7 = space();
			create_component(button.$$.fragment);
			t8 = space();
			create_component(tabhead.$$.fragment);
			t9 = space();
			create_component(img.$$.fragment);
			t10 = space();
			create_component(label.$$.fragment);
			t11 = space();
			create_component(hotspot.$$.fragment);
			t12 = space();
			create_component(menulist.$$.fragment);
			t13 = space();
			attr_dev(div, "key", div_key_value = "tab_pills_preview_" + /*index*/ ctx[8]);
			attr_dev(div, "id", div_id_value = /*data*/ ctx[6]._id);
			attr_dev(div, "role", "tabpanel");
			attr_dev(div, "class", div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""));
			add_location(div, file$d, 51, 16, 1926);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t0);
			mount_component(drag, div, null);
			append_dev(div, t1);
			mount_component(drop, div, null);
			append_dev(div, t2);
			mount_component(radio, div, null);
			append_dev(div, t3);
			mount_component(select, div, null);
			append_dev(div, t4);
			mount_component(textbox, div, null);
			append_dev(div, t5);
			mount_component(multilinebox, div, null);
			append_dev(div, t6);
			mount_component(checkbox, div, null);
			append_dev(div, t7);
			mount_component(button, div, null);
			append_dev(div, t8);
			mount_component(tabhead, div, null);
			append_dev(div, t9);
			mount_component(img, div, null);
			append_dev(div, t10);
			mount_component(label, div, null);
			append_dev(div, t11);
			mount_component(hotspot, div, null);
			append_dev(div, t12);
			mount_component(menulist, div, null);
			append_dev(div, t13);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[6]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$2(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const drag_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) drag_changes.modules = /*data*/ ctx[6].drag ? /*data*/ ctx[6].drag : "";
			if (dirty & /*elemModal*/ 2) drag_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drag_changes.deleteElem = /*deleteElem*/ ctx[0];
			drag.$set(drag_changes);
			const drop_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) drop_changes.modules = /*data*/ ctx[6].drop ? /*data*/ ctx[6].drop : "";
			if (dirty & /*elemModal*/ 2) drop_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drop_changes.deleteElem = /*deleteElem*/ ctx[0];
			drop.$set(drop_changes);
			const radio_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) radio_changes.modules = /*data*/ ctx[6].radio ? /*data*/ ctx[6].radio : "";
			if (dirty & /*elemModal*/ 2) radio_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) radio_changes.deleteElem = /*deleteElem*/ ctx[0];
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) select_changes.modules = /*data*/ ctx[6].select ? /*data*/ ctx[6].select : "";
			if (dirty & /*elemModal*/ 2) select_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) select_changes.deleteElem = /*deleteElem*/ ctx[0];
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) textbox_changes.modules = /*data*/ ctx[6].textbox ? /*data*/ ctx[6].textbox : "";
			if (dirty & /*elemModal*/ 2) textbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) textbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};

			if (dirty & /*tab_pills_preview*/ 8) multilinebox_changes.modules = /*data*/ ctx[6].multilinebox
			? /*data*/ ctx[6].multilinebox
			: "";

			if (dirty & /*elemModal*/ 2) multilinebox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) multilinebox_changes.deleteElem = /*deleteElem*/ ctx[0];
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) checkbox_changes.modules = /*data*/ ctx[6].checkbox ? /*data*/ ctx[6].checkbox : "";
			if (dirty & /*elemModal*/ 2) checkbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) checkbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			checkbox.$set(checkbox_changes);
			const button_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) button_changes.modules = /*data*/ ctx[6].button ? /*data*/ ctx[6].button : "";
			if (dirty & /*elemModal*/ 2) button_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) button_changes.deleteElem = /*deleteElem*/ ctx[0];
			button.$set(button_changes);
			const tabhead_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) tabhead_changes.modules = /*data*/ ctx[6].tabhead ? /*data*/ ctx[6].tabhead : "";
			if (dirty & /*elemModal*/ 2) tabhead_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabhead_changes.deleteElem = /*deleteElem*/ ctx[0];
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) img_changes.modules = /*data*/ ctx[6].img ? /*data*/ ctx[6].img : "";
			if (dirty & /*elemModal*/ 2) img_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) img_changes.deleteElem = /*deleteElem*/ ctx[0];
			img.$set(img_changes);
			const label_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) label_changes.modules = /*data*/ ctx[6].label ? /*data*/ ctx[6].label : "";
			if (dirty & /*elemModal*/ 2) label_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) label_changes.deleteElem = /*deleteElem*/ ctx[0];
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) hotspot_changes.modules = /*data*/ ctx[6].hotspot ? /*data*/ ctx[6].hotspot : "";
			if (dirty & /*elemModal*/ 2) hotspot_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) hotspot_changes.deleteElem = /*deleteElem*/ ctx[0];
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty & /*tab_pills_preview*/ 8) menulist_changes.modules = /*data*/ ctx[6].menulist ? /*data*/ ctx[6].menulist : "";
			if (dirty & /*elemModal*/ 2) menulist_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) menulist_changes.deleteElem = /*deleteElem*/ ctx[0];
			menulist.$set(menulist_changes);

			if (!current || dirty & /*tab_pills_preview*/ 8 && div_id_value !== (div_id_value = /*data*/ ctx[6]._id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (!current || dirty & /*tab_pills_preview*/ 8 && div_class_value !== (div_class_value = "tab-pane " + (/*data*/ ctx[6]._display == "1" ? "active" : ""))) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag.$$.fragment, local);
			transition_in(drop.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag.$$.fragment, local);
			transition_out(drop.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_component(drag);
			destroy_component(drop);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$d.name,
		type: "each",
		source: "(51:12) {#each tab_pills_preview as data, index}",
		ctx
	});

	return block;
}

function create_fragment$d(ctx) {
	let div;
	let current;
	let if_block = /*tab_pills_preview*/ ctx[3] && /*tab_pills_preview*/ ctx[3].length > 0 && create_if_block$d(ctx);

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			add_location(div, file$d, 40, 0, 1265);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*tab_pills_preview*/ ctx[3] && /*tab_pills_preview*/ ctx[3].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*tab_pills_preview*/ 8) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$d(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
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
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$d.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$d($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Tabpills", slots, []);
	let { modules } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let { checkImageStatus } = $$props;
	let tab_pills_preview = modules;
	const writable_props = ["modules", "deleteElem", "elemModal", "checkImageStatus"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tabpills> was created with unknown prop '${key}'`);
	});

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("checkImageStatus" in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
	};

	$$self.$capture_state = () => ({
		Button,
		Checkbox,
		Drag,
		Drop,
		Hotspot,
		Img,
		Label,
		Menulist,
		Multilinebox,
		Radio,
		Select,
		Tabhead,
		Textbox,
		modules,
		deleteElem,
		elemModal,
		checkImageStatus,
		tab_pills_preview
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(4, modules = $$props.modules);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("checkImageStatus" in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
		if ("tab_pills_preview" in $$props) $$invalidate(3, tab_pills_preview = $$props.tab_pills_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 16) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(3, tab_pills_preview = []);
					$$invalidate(3, tab_pills_preview[0] = modules, tab_pills_preview);
				} else {
					$$invalidate(3, tab_pills_preview = modules);
				}
			} else {
				$$invalidate(3, tab_pills_preview = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		checkImageStatus,
		tab_pills_preview,
		modules,
		load_handler
	];
}

class Tabpills extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
			modules: 4,
			deleteElem: 0,
			elemModal: 1,
			checkImageStatus: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tabpills",
			options,
			id: create_fragment$d.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[4] === undefined && !("modules" in props)) {
			console.warn("<Tabpills> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Tabpills> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Tabpills> was created without expected prop 'elemModal'");
		}

		if (/*checkImageStatus*/ ctx[2] === undefined && !("checkImageStatus" in props)) {
			console.warn("<Tabpills> was created without expected prop 'checkImageStatus'");
		}
	}

	get modules() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImageStatus() {
		throw new Error("<Tabpills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImageStatus(value) {
		throw new Error("<Tabpills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Tab.svelte generated by Svelte v3.29.0 */
const file$e = "clsSMDragNDrop\\libs\\authoring\\Tab.svelte";

function get_each_context$e(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

function get_each_context_1$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

// (44:0) {#if tab_preview && tab_preview.length > 0}
function create_if_block$e(ctx) {
	let div1;
	let ul;
	let t;
	let div0;
	let div1_key_value;
	let current;
	let each_value_1 = /*tab_preview*/ ctx[4];
	validate_each_argument(each_value_1);
	let each_blocks_1 = [];

	for (let i = 0; i < each_value_1.length; i += 1) {
		each_blocks_1[i] = create_each_block_1$3(get_each_context_1$3(ctx, each_value_1, i));
	}

	let each_value = /*tab_preview*/ ctx[4];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$e(get_each_context$e(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div1 = element("div");
			ul = element("ul");

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].c();
			}

			t = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(ul, "class", "nav nav-tabs margin-bottom mt-3 px-2");
			add_location(ul, file$e, 45, 8, 1444);
			attr_dev(div0, "class", "tab-content");
			attr_dev(div0, "type", "tab");
			set_style(div0, "position", "relative");
			add_location(div0, file$e, 63, 8, 2522);
			attr_dev(div1, "key", div1_key_value = "tab_" + /*index*/ ctx[3] + /*tab_preview*/ ctx[4].length);
			add_location(div1, file$e, 44, 4, 1387);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, ul);

			for (let i = 0; i < each_blocks_1.length; i += 1) {
				each_blocks_1[i].m(ul, null);
			}

			append_dev(div1, t);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_preview, deleteElem, elemModal*/ 19) {
				each_value_1 = /*tab_preview*/ ctx[4];
				validate_each_argument(each_value_1);
				let i;

				for (i = 0; i < each_value_1.length; i += 1) {
					const child_ctx = get_each_context_1$3(ctx, each_value_1, i);

					if (each_blocks_1[i]) {
						each_blocks_1[i].p(child_ctx, dirty);
					} else {
						each_blocks_1[i] = create_each_block_1$3(child_ctx);
						each_blocks_1[i].c();
						each_blocks_1[i].m(ul, null);
					}
				}

				for (; i < each_blocks_1.length; i += 1) {
					each_blocks_1[i].d(1);
				}

				each_blocks_1.length = each_value_1.length;
			}

			if (dirty & /*tab_preview, elemModal, deleteElem, checkImageStatus*/ 23) {
				each_value = /*tab_preview*/ ctx[4];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$e(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$e(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*index, tab_preview*/ 24 && div1_key_value !== (div1_key_value = "tab_" + /*index*/ ctx[3] + /*tab_preview*/ ctx[4].length)) {
				attr_dev(div1, "key", div1_key_value);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			destroy_each(each_blocks_1, detaching);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$e.name,
		type: "if",
		source: "(44:0) {#if tab_preview && tab_preview.length > 0}",
		ctx
	});

	return block;
}

// (47:12) {#each tab_preview as data, index}
function create_each_block_1$3(ctx) {
	let li;
	let a;
	let t0_value = /*data*/ ctx[9]._value + "";
	let t0;
	let a_href_value;
	let a_data_bs_target_value;
	let a_class_value;
	let t1;
	let div;
	let button0;
	let i0;
	let t2;
	let button1;
	let i1;
	let t3;
	let li_for_value;
	let li_key_value;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[9], ...args);
	}

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[7](/*data*/ ctx[9], ...args);
	}

	const block = {
		c: function create() {
			li = element("li");
			a = element("a");
			t0 = text(t0_value);
			t1 = space();
			div = element("div");
			button0 = element("button");
			i0 = element("i");
			t2 = space();
			button1 = element("button");
			i1 = element("i");
			t3 = space();
			attr_dev(a, "href", a_href_value = "#" + /*data*/ ctx[9]._id);
			attr_dev(a, "data-bs-target", a_data_bs_target_value = "#" + /*data*/ ctx[9]._id);
			attr_dev(a, "data-bs-toggle", "tab");

			attr_dev(a, "class", a_class_value = /*data*/ ctx[9]._display == "1"
			? " active nav-link"
			: " nav-link");

			add_location(a, file$e, 48, 20, 1650);
			attr_dev(i0, "class", "icomoon-24px-edit-1");
			add_location(i0, file$e, 54, 28, 2130);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$e, 53, 24, 1982);
			attr_dev(i1, "class", "icomoon-new-24px-delete-1");
			add_location(i1, file$e, 57, 28, 2349);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "btn btn-light p-sm");
			add_location(button1, file$e, 56, 24, 2226);
			attr_dev(div, "class", "btn-group tools tabTools h");
			attr_dev(div, "data-t", "label");
			add_location(div, file$e, 49, 20, 1827);
			attr_dev(li, "for", li_for_value = /*data*/ ctx[9]._id);
			attr_dev(li, "key", li_key_value = "tab_list_" + /*index*/ ctx[3]);
			attr_dev(li, "class", "tbhead nav-item");
			add_location(li, file$e, 47, 16, 1559);
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, a);
			append_dev(a, t0);
			append_dev(li, t1);
			append_dev(li, div);
			append_dev(div, button0);
			append_dev(button0, i0);
			append_dev(div, t2);
			append_dev(div, button1);
			append_dev(button1, i1);
			append_dev(li, t3);

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", click_handler, false, false, false),
					listen_dev(button1, "click", click_handler_1, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			if (dirty & /*tab_preview*/ 16 && t0_value !== (t0_value = /*data*/ ctx[9]._value + "")) set_data_dev(t0, t0_value);

			if (dirty & /*tab_preview*/ 16 && a_href_value !== (a_href_value = "#" + /*data*/ ctx[9]._id)) {
				attr_dev(a, "href", a_href_value);
			}

			if (dirty & /*tab_preview*/ 16 && a_data_bs_target_value !== (a_data_bs_target_value = "#" + /*data*/ ctx[9]._id)) {
				attr_dev(a, "data-bs-target", a_data_bs_target_value);
			}

			if (dirty & /*tab_preview*/ 16 && a_class_value !== (a_class_value = /*data*/ ctx[9]._display == "1"
			? " active nav-link"
			: " nav-link")) {
				attr_dev(a, "class", a_class_value);
			}

			if (dirty & /*tab_preview*/ 16 && li_for_value !== (li_for_value = /*data*/ ctx[9]._id)) {
				attr_dev(li, "for", li_for_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block_1$3.name,
		type: "each",
		source: "(47:12) {#each tab_preview as data, index}",
		ctx
	});

	return block;
}

// (71:20) {#if data._bgimg}
function create_if_block_1$3(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[9]._bgimg)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[9]._alt);
			add_location(img, file$e, 71, 24, 2889);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[8], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*tab_preview*/ 16 && img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[9]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*tab_preview*/ 16 && img_alt_value !== (img_alt_value = /*data*/ ctx[9]._alt)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(71:20) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (65:12) {#each tab_preview as data, index}
function create_each_block$e(ctx) {
	let div;
	let t0;
	let drag;
	let t1;
	let drop;
	let t2;
	let radio;
	let t3;
	let select;
	let t4;
	let textbox;
	let t5;
	let multilinebox;
	let t6;
	let checkbox;
	let t7;
	let button;
	let t8;
	let tabhead;
	let t9;
	let img;
	let t10;
	let label;
	let t11;
	let hotspot;
	let t12;
	let menulist;
	let t13;
	let tabpills;
	let t14;
	let div_id_value;
	let div_class_value;
	let current;
	let if_block = /*data*/ ctx[9]._bgimg && create_if_block_1$3(ctx);

	drag = new Drag({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].drag ? /*data*/ ctx[9].drag : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	drop = new Drop({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].drop ? /*data*/ ctx[9].drop : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].radio ? /*data*/ ctx[9].radio : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].select ? /*data*/ ctx[9].select : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].textbox ? /*data*/ ctx[9].textbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].multilinebox
				? /*data*/ ctx[9].multilinebox
				: "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].checkbox ? /*data*/ ctx[9].checkbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	button = new Button({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].button ? /*data*/ ctx[9].button : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].tabhead ? /*data*/ ctx[9].tabhead : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].img ? /*data*/ ctx[9].img : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].label ? /*data*/ ctx[9].label : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].hotspot ? /*data*/ ctx[9].hotspot : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].menulist ? /*data*/ ctx[9].menulist : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabpills = new Tabpills({
			props: {
				index: 11,
				modules: /*data*/ ctx[9].tab ? /*data*/ ctx[9].tab : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0],
				checkImageStatus: /*checkImageStatus*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			t0 = space();
			create_component(drag.$$.fragment);
			t1 = space();
			create_component(drop.$$.fragment);
			t2 = space();
			create_component(radio.$$.fragment);
			t3 = space();
			create_component(select.$$.fragment);
			t4 = space();
			create_component(textbox.$$.fragment);
			t5 = space();
			create_component(multilinebox.$$.fragment);
			t6 = space();
			create_component(checkbox.$$.fragment);
			t7 = space();
			create_component(button.$$.fragment);
			t8 = space();
			create_component(tabhead.$$.fragment);
			t9 = space();
			create_component(img.$$.fragment);
			t10 = space();
			create_component(label.$$.fragment);
			t11 = space();
			create_component(hotspot.$$.fragment);
			t12 = space();
			create_component(menulist.$$.fragment);
			t13 = space();
			create_component(tabpills.$$.fragment);
			t14 = space();
			attr_dev(div, "id", div_id_value = /*data*/ ctx[9]._id);
			attr_dev(div, "class", div_class_value = "tab-pane" + (/*data*/ ctx[9]._display == "1" ? " active" : ""));
			attr_dev(div, "role", "tabpanel");
			add_location(div, file$e, 65, 16, 2650);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			if (if_block) if_block.m(div, null);
			append_dev(div, t0);
			mount_component(drag, div, null);
			append_dev(div, t1);
			mount_component(drop, div, null);
			append_dev(div, t2);
			mount_component(radio, div, null);
			append_dev(div, t3);
			mount_component(select, div, null);
			append_dev(div, t4);
			mount_component(textbox, div, null);
			append_dev(div, t5);
			mount_component(multilinebox, div, null);
			append_dev(div, t6);
			mount_component(checkbox, div, null);
			append_dev(div, t7);
			mount_component(button, div, null);
			append_dev(div, t8);
			mount_component(tabhead, div, null);
			append_dev(div, t9);
			mount_component(img, div, null);
			append_dev(div, t10);
			mount_component(label, div, null);
			append_dev(div, t11);
			mount_component(hotspot, div, null);
			append_dev(div, t12);
			mount_component(menulist, div, null);
			append_dev(div, t13);
			mount_component(tabpills, div, null);
			append_dev(div, t14);
			current = true;
		},
		p: function update(ctx, dirty) {
			if (/*data*/ ctx[9]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$3(ctx);
					if_block.c();
					if_block.m(div, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const drag_changes = {};
			if (dirty & /*tab_preview*/ 16) drag_changes.modules = /*data*/ ctx[9].drag ? /*data*/ ctx[9].drag : "";
			if (dirty & /*elemModal*/ 2) drag_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drag_changes.deleteElem = /*deleteElem*/ ctx[0];
			drag.$set(drag_changes);
			const drop_changes = {};
			if (dirty & /*tab_preview*/ 16) drop_changes.modules = /*data*/ ctx[9].drop ? /*data*/ ctx[9].drop : "";
			if (dirty & /*elemModal*/ 2) drop_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drop_changes.deleteElem = /*deleteElem*/ ctx[0];
			drop.$set(drop_changes);
			const radio_changes = {};
			if (dirty & /*tab_preview*/ 16) radio_changes.modules = /*data*/ ctx[9].radio ? /*data*/ ctx[9].radio : "";
			if (dirty & /*elemModal*/ 2) radio_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) radio_changes.deleteElem = /*deleteElem*/ ctx[0];
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty & /*tab_preview*/ 16) select_changes.modules = /*data*/ ctx[9].select ? /*data*/ ctx[9].select : "";
			if (dirty & /*elemModal*/ 2) select_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) select_changes.deleteElem = /*deleteElem*/ ctx[0];
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty & /*tab_preview*/ 16) textbox_changes.modules = /*data*/ ctx[9].textbox ? /*data*/ ctx[9].textbox : "";
			if (dirty & /*elemModal*/ 2) textbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) textbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};

			if (dirty & /*tab_preview*/ 16) multilinebox_changes.modules = /*data*/ ctx[9].multilinebox
			? /*data*/ ctx[9].multilinebox
			: "";

			if (dirty & /*elemModal*/ 2) multilinebox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) multilinebox_changes.deleteElem = /*deleteElem*/ ctx[0];
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty & /*tab_preview*/ 16) checkbox_changes.modules = /*data*/ ctx[9].checkbox ? /*data*/ ctx[9].checkbox : "";
			if (dirty & /*elemModal*/ 2) checkbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) checkbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			checkbox.$set(checkbox_changes);
			const button_changes = {};
			if (dirty & /*tab_preview*/ 16) button_changes.modules = /*data*/ ctx[9].button ? /*data*/ ctx[9].button : "";
			if (dirty & /*elemModal*/ 2) button_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) button_changes.deleteElem = /*deleteElem*/ ctx[0];
			button.$set(button_changes);
			const tabhead_changes = {};
			if (dirty & /*tab_preview*/ 16) tabhead_changes.modules = /*data*/ ctx[9].tabhead ? /*data*/ ctx[9].tabhead : "";
			if (dirty & /*elemModal*/ 2) tabhead_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabhead_changes.deleteElem = /*deleteElem*/ ctx[0];
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty & /*tab_preview*/ 16) img_changes.modules = /*data*/ ctx[9].img ? /*data*/ ctx[9].img : "";
			if (dirty & /*elemModal*/ 2) img_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) img_changes.deleteElem = /*deleteElem*/ ctx[0];
			img.$set(img_changes);
			const label_changes = {};
			if (dirty & /*tab_preview*/ 16) label_changes.modules = /*data*/ ctx[9].label ? /*data*/ ctx[9].label : "";
			if (dirty & /*elemModal*/ 2) label_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) label_changes.deleteElem = /*deleteElem*/ ctx[0];
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty & /*tab_preview*/ 16) hotspot_changes.modules = /*data*/ ctx[9].hotspot ? /*data*/ ctx[9].hotspot : "";
			if (dirty & /*elemModal*/ 2) hotspot_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) hotspot_changes.deleteElem = /*deleteElem*/ ctx[0];
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty & /*tab_preview*/ 16) menulist_changes.modules = /*data*/ ctx[9].menulist ? /*data*/ ctx[9].menulist : "";
			if (dirty & /*elemModal*/ 2) menulist_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) menulist_changes.deleteElem = /*deleteElem*/ ctx[0];
			menulist.$set(menulist_changes);
			const tabpills_changes = {};
			if (dirty & /*tab_preview*/ 16) tabpills_changes.modules = /*data*/ ctx[9].tab ? /*data*/ ctx[9].tab : "";
			if (dirty & /*elemModal*/ 2) tabpills_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabpills_changes.deleteElem = /*deleteElem*/ ctx[0];
			if (dirty & /*checkImageStatus*/ 4) tabpills_changes.checkImageStatus = /*checkImageStatus*/ ctx[2];
			tabpills.$set(tabpills_changes);

			if (!current || dirty & /*tab_preview*/ 16 && div_id_value !== (div_id_value = /*data*/ ctx[9]._id)) {
				attr_dev(div, "id", div_id_value);
			}

			if (!current || dirty & /*tab_preview*/ 16 && div_class_value !== (div_class_value = "tab-pane" + (/*data*/ ctx[9]._display == "1" ? " active" : ""))) {
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag.$$.fragment, local);
			transition_in(drop.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			transition_in(tabpills.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag.$$.fragment, local);
			transition_out(drop.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			transition_out(tabpills.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			if (if_block) if_block.d();
			destroy_component(drag);
			destroy_component(drop);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
			destroy_component(tabpills);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$e.name,
		type: "each",
		source: "(65:12) {#each tab_preview as data, index}",
		ctx
	});

	return block;
}

function create_fragment$e(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*tab_preview*/ ctx[4] && /*tab_preview*/ ctx[4].length > 0 && create_if_block$e(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*tab_preview*/ ctx[4] && /*tab_preview*/ ctx[4].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*tab_preview*/ 16) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$e(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$e.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$e($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Tab", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let { checkImageStatus } = $$props;
	var tab_preview = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal", "checkImageStatus"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tab> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("tab", event.currentTarget, data._id);
	const click_handler_1 = data => deleteElem("tab", data._id);

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(5, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(3, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("checkImageStatus" in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
	};

	$$self.$capture_state = () => ({
		Button,
		Checkbox,
		Drag,
		Drop,
		Hotspot,
		Img,
		Label,
		Menulist,
		Multilinebox,
		Radio,
		Select,
		Tabhead,
		Textbox,
		onMount,
		Tabpills,
		modules,
		index,
		deleteElem,
		elemModal,
		checkImageStatus,
		tab_preview
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(5, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(3, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("checkImageStatus" in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
		if ("tab_preview" in $$props) $$invalidate(4, tab_preview = $$props.tab_preview);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 32) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, tab_preview = []);
					$$invalidate(4, tab_preview[0] = modules, tab_preview);
				} else {
					$$invalidate(4, tab_preview = modules);
				}
			} else {
				$$invalidate(4, tab_preview = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		checkImageStatus,
		index,
		tab_preview,
		modules,
		click_handler,
		click_handler_1,
		load_handler
	];
}

class Tab extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
			modules: 5,
			index: 3,
			deleteElem: 0,
			elemModal: 1,
			checkImageStatus: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Tab",
			options,
			id: create_fragment$e.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[5] === undefined && !("modules" in props)) {
			console.warn("<Tab> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Tab> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Tab> was created without expected prop 'elemModal'");
		}

		if (/*checkImageStatus*/ ctx[2] === undefined && !("checkImageStatus" in props)) {
			console.warn("<Tab> was created without expected prop 'checkImageStatus'");
		}
	}

	get modules() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImageStatus() {
		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImageStatus(value) {
		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\Step.svelte generated by Svelte v3.29.0 */
const file$f = "clsSMDragNDrop\\libs\\authoring\\Step.svelte";

function get_each_context$f(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[8] = list[i];
	child_ctx[3] = i;
	return child_ctx;
}

// (45:0) {#if step && step.length > 0}
function create_if_block$f(ctx) {
	let div;
	let div_key_value;
	let current;
	let each_value = /*step*/ ctx[4];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$f(get_each_context$f(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(div, "key", div_key_value = "step_" + /*index*/ ctx[3] + /*step*/ ctx[4].length);
			add_location(div, file$f, 45, 4, 1307);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*step, elemModal, deleteElem, checkImageStatus*/ 23) {
				each_value = /*step*/ ctx[4];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$f(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$f(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*index, step*/ 24 && div_key_value !== (div_key_value = "step_" + /*index*/ ctx[3] + /*step*/ ctx[4].length)) {
				attr_dev(div, "key", div_key_value);
			}
		},
		i: function intro(local) {
			if (current) return;

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$f.name,
		type: "if",
		source: "(45:0) {#if step && step.length > 0}",
		ctx
	});

	return block;
}

// (57:16) {#if data._bgimg}
function create_if_block_1$4(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[8]._bgimg)) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = /*data*/ ctx[8]._alt);
			add_location(img, file$f, 57, 5, 1889);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*load_handler*/ ctx[7], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty & /*step*/ 16 && img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*data*/ ctx[8]._bgimg)) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty & /*step*/ 16 && img_alt_value !== (img_alt_value = /*data*/ ctx[8]._alt)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(57:16) {#if data._bgimg}",
		ctx
	});

	return block;
}

// (47:8) {#each step as data, index}
function create_each_block$f(ctx) {
	let div1;
	let div0;
	let button0;
	let i;
	let t0;
	let t1;
	let drag;
	let t2;
	let drop;
	let t3;
	let radio;
	let t4;
	let select;
	let t5;
	let textbox;
	let t6;
	let multilinebox;
	let t7;
	let checkbox;
	let t8;
	let button1;
	let t9;
	let tabhead;
	let t10;
	let img;
	let t11;
	let label;
	let t12;
	let hotspot;
	let t13;
	let menulist;
	let t14;
	let tab;
	let t15;
	let div1_key_value;
	let div1_id_value;
	let current;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[6](/*data*/ ctx[8], ...args);
	}

	let if_block = /*data*/ ctx[8]._bgimg && create_if_block_1$4(ctx);

	drag = new Drag({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].drag ? /*data*/ ctx[8].drag : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	drop = new Drop({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].drop ? /*data*/ ctx[8].drop : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].radio ? /*data*/ ctx[8].radio : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].select ? /*data*/ ctx[8].select : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].textbox ? /*data*/ ctx[8].textbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].multilinebox
				? /*data*/ ctx[8].multilinebox
				: "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].checkbox ? /*data*/ ctx[8].checkbox : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	button1 = new Button({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].button ? /*data*/ ctx[8].button : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].tabhead ? /*data*/ ctx[8].tabhead : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].img ? /*data*/ ctx[8].img : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].label ? /*data*/ ctx[8].label : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].hotspot ? /*data*/ ctx[8].hotspot : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].menulist ? /*data*/ ctx[8].menulist : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0]
			},
			$$inline: true
		});

	tab = new Tab({
			props: {
				index: 10,
				modules: /*data*/ ctx[8].tab ? /*data*/ ctx[8].tab : "",
				elemModal: /*elemModal*/ ctx[1],
				deleteElem: /*deleteElem*/ ctx[0],
				checkImageStatus: /*checkImageStatus*/ ctx[2]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			button0 = element("button");
			i = element("i");
			t0 = space();
			if (if_block) if_block.c();
			t1 = space();
			create_component(drag.$$.fragment);
			t2 = space();
			create_component(drop.$$.fragment);
			t3 = space();
			create_component(radio.$$.fragment);
			t4 = space();
			create_component(select.$$.fragment);
			t5 = space();
			create_component(textbox.$$.fragment);
			t6 = space();
			create_component(multilinebox.$$.fragment);
			t7 = space();
			create_component(checkbox.$$.fragment);
			t8 = space();
			create_component(button1.$$.fragment);
			t9 = space();
			create_component(tabhead.$$.fragment);
			t10 = space();
			create_component(img.$$.fragment);
			t11 = space();
			create_component(label.$$.fragment);
			t12 = space();
			create_component(hotspot.$$.fragment);
			t13 = space();
			create_component(menulist.$$.fragment);
			t14 = space();
			create_component(tab.$$.fragment);
			t15 = space();
			attr_dev(i, "class", "icomoon-24px-edit-1");
			add_location(i, file$f, 54, 196, 1779);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light p-sm");
			add_location(button0, file$f, 54, 76, 1659);
			attr_dev(div0, "class", "btn-group tools");
			attr_dev(div0, "data-type", "step");
			attr_dev(div0, "data-t", "step");
			add_location(div0, file$f, 54, 16, 1599);
			attr_dev(div1, "key", div1_key_value = /*index*/ ctx[3]);
			attr_dev(div1, "id", div1_id_value = /*data*/ ctx[8]._id);
			attr_dev(div1, "type", "step");
			attr_dev(div1, "class", "step");
			set_style(div1, "position", "relative");
			add_location(div1, file$f, 47, 12, 1399);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, button0);
			append_dev(button0, i);
			append_dev(div1, t0);
			if (if_block) if_block.m(div1, null);
			append_dev(div1, t1);
			mount_component(drag, div1, null);
			append_dev(div1, t2);
			mount_component(drop, div1, null);
			append_dev(div1, t3);
			mount_component(radio, div1, null);
			append_dev(div1, t4);
			mount_component(select, div1, null);
			append_dev(div1, t5);
			mount_component(textbox, div1, null);
			append_dev(div1, t6);
			mount_component(multilinebox, div1, null);
			append_dev(div1, t7);
			mount_component(checkbox, div1, null);
			append_dev(div1, t8);
			mount_component(button1, div1, null);
			append_dev(div1, t9);
			mount_component(tabhead, div1, null);
			append_dev(div1, t10);
			mount_component(img, div1, null);
			append_dev(div1, t11);
			mount_component(label, div1, null);
			append_dev(div1, t12);
			mount_component(hotspot, div1, null);
			append_dev(div1, t13);
			mount_component(menulist, div1, null);
			append_dev(div1, t14);
			mount_component(tab, div1, null);
			append_dev(div1, t15);
			current = true;

			if (!mounted) {
				dispose = listen_dev(button0, "click", click_handler, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (/*data*/ ctx[8]._bgimg) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1$4(ctx);
					if_block.c();
					if_block.m(div1, t1);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const drag_changes = {};
			if (dirty & /*step*/ 16) drag_changes.modules = /*data*/ ctx[8].drag ? /*data*/ ctx[8].drag : "";
			if (dirty & /*elemModal*/ 2) drag_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drag_changes.deleteElem = /*deleteElem*/ ctx[0];
			drag.$set(drag_changes);
			const drop_changes = {};
			if (dirty & /*step*/ 16) drop_changes.modules = /*data*/ ctx[8].drop ? /*data*/ ctx[8].drop : "";
			if (dirty & /*elemModal*/ 2) drop_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) drop_changes.deleteElem = /*deleteElem*/ ctx[0];
			drop.$set(drop_changes);
			const radio_changes = {};
			if (dirty & /*step*/ 16) radio_changes.modules = /*data*/ ctx[8].radio ? /*data*/ ctx[8].radio : "";
			if (dirty & /*elemModal*/ 2) radio_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) radio_changes.deleteElem = /*deleteElem*/ ctx[0];
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty & /*step*/ 16) select_changes.modules = /*data*/ ctx[8].select ? /*data*/ ctx[8].select : "";
			if (dirty & /*elemModal*/ 2) select_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) select_changes.deleteElem = /*deleteElem*/ ctx[0];
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty & /*step*/ 16) textbox_changes.modules = /*data*/ ctx[8].textbox ? /*data*/ ctx[8].textbox : "";
			if (dirty & /*elemModal*/ 2) textbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) textbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};

			if (dirty & /*step*/ 16) multilinebox_changes.modules = /*data*/ ctx[8].multilinebox
			? /*data*/ ctx[8].multilinebox
			: "";

			if (dirty & /*elemModal*/ 2) multilinebox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) multilinebox_changes.deleteElem = /*deleteElem*/ ctx[0];
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty & /*step*/ 16) checkbox_changes.modules = /*data*/ ctx[8].checkbox ? /*data*/ ctx[8].checkbox : "";
			if (dirty & /*elemModal*/ 2) checkbox_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) checkbox_changes.deleteElem = /*deleteElem*/ ctx[0];
			checkbox.$set(checkbox_changes);
			const button1_changes = {};
			if (dirty & /*step*/ 16) button1_changes.modules = /*data*/ ctx[8].button ? /*data*/ ctx[8].button : "";
			if (dirty & /*elemModal*/ 2) button1_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) button1_changes.deleteElem = /*deleteElem*/ ctx[0];
			button1.$set(button1_changes);
			const tabhead_changes = {};
			if (dirty & /*step*/ 16) tabhead_changes.modules = /*data*/ ctx[8].tabhead ? /*data*/ ctx[8].tabhead : "";
			if (dirty & /*elemModal*/ 2) tabhead_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tabhead_changes.deleteElem = /*deleteElem*/ ctx[0];
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty & /*step*/ 16) img_changes.modules = /*data*/ ctx[8].img ? /*data*/ ctx[8].img : "";
			if (dirty & /*elemModal*/ 2) img_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) img_changes.deleteElem = /*deleteElem*/ ctx[0];
			img.$set(img_changes);
			const label_changes = {};
			if (dirty & /*step*/ 16) label_changes.modules = /*data*/ ctx[8].label ? /*data*/ ctx[8].label : "";
			if (dirty & /*elemModal*/ 2) label_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) label_changes.deleteElem = /*deleteElem*/ ctx[0];
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty & /*step*/ 16) hotspot_changes.modules = /*data*/ ctx[8].hotspot ? /*data*/ ctx[8].hotspot : "";
			if (dirty & /*elemModal*/ 2) hotspot_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) hotspot_changes.deleteElem = /*deleteElem*/ ctx[0];
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty & /*step*/ 16) menulist_changes.modules = /*data*/ ctx[8].menulist ? /*data*/ ctx[8].menulist : "";
			if (dirty & /*elemModal*/ 2) menulist_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) menulist_changes.deleteElem = /*deleteElem*/ ctx[0];
			menulist.$set(menulist_changes);
			const tab_changes = {};
			if (dirty & /*step*/ 16) tab_changes.modules = /*data*/ ctx[8].tab ? /*data*/ ctx[8].tab : "";
			if (dirty & /*elemModal*/ 2) tab_changes.elemModal = /*elemModal*/ ctx[1];
			if (dirty & /*deleteElem*/ 1) tab_changes.deleteElem = /*deleteElem*/ ctx[0];
			if (dirty & /*checkImageStatus*/ 4) tab_changes.checkImageStatus = /*checkImageStatus*/ ctx[2];
			tab.$set(tab_changes);

			if (!current || dirty & /*step*/ 16 && div1_id_value !== (div1_id_value = /*data*/ ctx[8]._id)) {
				attr_dev(div1, "id", div1_id_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag.$$.fragment, local);
			transition_in(drop.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button1.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			transition_in(tab.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag.$$.fragment, local);
			transition_out(drop.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button1.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			transition_out(tab.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block) if_block.d();
			destroy_component(drag);
			destroy_component(drop);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button1);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
			destroy_component(tab);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$f.name,
		type: "each",
		source: "(47:8) {#each step as data, index}",
		ctx
	});

	return block;
}

function create_fragment$f(ctx) {
	let if_block_anchor;
	let current;
	let if_block = /*step*/ ctx[4] && /*step*/ ctx[4].length > 0 && create_if_block$f(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (/*step*/ ctx[4] && /*step*/ ctx[4].length > 0) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*step*/ 16) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$f(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
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
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$f.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$f($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Step", slots, []);
	let { modules } = $$props;
	let { index = 0 } = $$props;
	let { deleteElem } = $$props;
	let { elemModal } = $$props;
	let { checkImageStatus } = $$props;
	let step = modules;
	const writable_props = ["modules", "index", "deleteElem", "elemModal", "checkImageStatus"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Step> was created with unknown prop '${key}'`);
	});

	const click_handler = (data, event) => elemModal("step", event.currentTarget, data._id);

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ("modules" in $$props) $$invalidate(5, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(3, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("checkImageStatus" in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
	};

	$$self.$capture_state = () => ({
		Button,
		Checkbox,
		Drag,
		Drop,
		Hotspot,
		Img,
		Label,
		Menulist,
		Multilinebox,
		Radio,
		Select,
		Tab,
		Tabhead,
		Textbox,
		modules,
		index,
		deleteElem,
		elemModal,
		checkImageStatus,
		step
	});

	$$self.$inject_state = $$props => {
		if ("modules" in $$props) $$invalidate(5, modules = $$props.modules);
		if ("index" in $$props) $$invalidate(3, index = $$props.index);
		if ("deleteElem" in $$props) $$invalidate(0, deleteElem = $$props.deleteElem);
		if ("elemModal" in $$props) $$invalidate(1, elemModal = $$props.elemModal);
		if ("checkImageStatus" in $$props) $$invalidate(2, checkImageStatus = $$props.checkImageStatus);
		if ("step" in $$props) $$invalidate(4, step = $$props.step);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*modules*/ 32) {
			 if (modules) {
				if (Array.isArray(modules) == false) {
					$$invalidate(4, step = []);
					$$invalidate(4, step[0] = modules, step);
				} else {
					$$invalidate(4, step = modules);
				}
			} else {
				$$invalidate(4, step = []);
			}
		}
	};

	return [
		deleteElem,
		elemModal,
		checkImageStatus,
		index,
		step,
		modules,
		click_handler,
		load_handler
	];
}

class Step extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
			modules: 5,
			index: 3,
			deleteElem: 0,
			elemModal: 1,
			checkImageStatus: 2
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Step",
			options,
			id: create_fragment$f.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*modules*/ ctx[5] === undefined && !("modules" in props)) {
			console.warn("<Step> was created without expected prop 'modules'");
		}

		if (/*deleteElem*/ ctx[0] === undefined && !("deleteElem" in props)) {
			console.warn("<Step> was created without expected prop 'deleteElem'");
		}

		if (/*elemModal*/ ctx[1] === undefined && !("elemModal" in props)) {
			console.warn("<Step> was created without expected prop 'elemModal'");
		}

		if (/*checkImageStatus*/ ctx[2] === undefined && !("checkImageStatus" in props)) {
			console.warn("<Step> was created without expected prop 'checkImageStatus'");
		}
	}

	get modules() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set modules(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get index() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set index(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get deleteElem() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set deleteElem(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get elemModal() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set elemModal(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get checkImageStatus() {
		throw new Error("<Step>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set checkImageStatus(value) {
		throw new Error("<Step>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\libs\authoring\ModalEvent.svelte generated by Svelte v3.29.0 */
const file$g = "clsSMDragNDrop\\libs\\authoring\\ModalEvent.svelte";

function create_fragment$g(ctx) {
	let div4;
	let div1;
	let div0;
	let a0;
	let t1;
	let a1;
	let t3;
	let a2;
	let t5;
	let a3;
	let t7;
	let a4;
	let t9;
	let a5;
	let t11;
	let a6;
	let t13;
	let a7;
	let t15;
	let a8;
	let t17;
	let a9;
	let t19;
	let a10;
	let t21;
	let a11;
	let t23;
	let a12;
	let t25;
	let a13;
	let t27;
	let a14;
	let t29;
	let a15;
	let t31;
	let div2;
	let t32;
	let div3;
	let input0;
	let input0_placeholder_value;
	let t33;
	let input1;
	let input1_placeholder_value;
	let t34;
	let input2;
	let input2_placeholder_value;
	let t35;
	let input3;
	let input3_placeholder_value;
	let t36;
	let input4;
	let input4_placeholder_value;
	let t37;
	let input5;
	let input5_placeholder_value;
	let t38;
	let input6;
	let input6_placeholder_value;
	let t39;
	let input7;
	let input7_placeholder_value;
	let t40;
	let input8;
	let input8_placeholder_value;
	let t41;
	let input9;
	let input9_placeholder_value;
	let t42;
	let input10;
	let input10_placeholder_value;
	let t43;
	let input11;
	let input11_placeholder_value;
	let t44;
	let input12;
	let input12_placeholder_value;
	let t45;
	let input13;
	let input13_placeholder_value;
	let t46;
	let input14;
	let input14_placeholder_value;
	let t47;
	let input15;
	let input15_placeholder_value;

	const block = {
		c: function create() {
			div4 = element("div");
			div1 = element("div");
			div0 = element("div");
			a0 = element("a");
			a0.textContent = `${Lang.on_click}`;
			t1 = space();
			a1 = element("a");
			a1.textContent = `${Lang.on_dbl_click}`;
			t3 = space();
			a2 = element("a");
			a2.textContent = `${Lang.on_context}`;
			t5 = space();
			a3 = element("a");
			a3.textContent = `${Lang.on_drag_start}`;
			t7 = space();
			a4 = element("a");
			a4.textContent = `${Lang.on_drag}`;
			t9 = space();
			a5 = element("a");
			a5.textContent = `${Lang.on_drag_end}`;
			t11 = space();
			a6 = element("a");
			a6.textContent = `${Lang.on_drop}`;
			t13 = space();
			a7 = element("a");
			a7.textContent = `${Lang.on_mouse_over}`;
			t15 = space();
			a8 = element("a");
			a8.textContent = `${Lang.on_mouse_up}`;
			t17 = space();
			a9 = element("a");
			a9.textContent = `${Lang.on_mouse_down}`;
			t19 = space();
			a10 = element("a");
			a10.textContent = `${Lang.on_change}`;
			t21 = space();
			a11 = element("a");
			a11.textContent = `${Lang.on_focus}`;
			t23 = space();
			a12 = element("a");
			a12.textContent = `${Lang.on_blur}`;
			t25 = space();
			a13 = element("a");
			a13.textContent = `${Lang.on_key_up}`;
			t27 = space();
			a14 = element("a");
			a14.textContent = `${Lang.on_key_press}`;
			t29 = space();
			a15 = element("a");
			a15.textContent = `${Lang.on_key_down}`;
			t31 = space();
			div2 = element("div");
			t32 = space();
			div3 = element("div");
			input0 = element("input");
			t33 = space();
			input1 = element("input");
			t34 = space();
			input2 = element("input");
			t35 = space();
			input3 = element("input");
			t36 = space();
			input4 = element("input");
			t37 = space();
			input5 = element("input");
			t38 = space();
			input6 = element("input");
			t39 = space();
			input7 = element("input");
			t40 = space();
			input8 = element("input");
			t41 = space();
			input9 = element("input");
			t42 = space();
			input10 = element("input");
			t43 = space();
			input11 = element("input");
			t44 = space();
			input12 = element("input");
			t45 = space();
			input13 = element("input");
			t46 = space();
			input14 = element("input");
			t47 = space();
			input15 = element("input");
			attr_dev(a0, "for", "onclick");
			attr_dev(a0, "class", "list-group-item active");
			attr_dev(a0, "href", "javascript:;");
			add_location(a0, file$g, 14, 12, 424);
			attr_dev(a1, "for", "ondblclick");
			attr_dev(a1, "class", "list-group-item");
			attr_dev(a1, "href", "javascript:;");
			add_location(a1, file$g, 15, 12, 522);
			attr_dev(a2, "for", "oncontextmenu");
			attr_dev(a2, "class", "list-group-item");
			attr_dev(a2, "href", "javascript:;");
			add_location(a2, file$g, 16, 12, 620);
			attr_dev(a3, "for", "ondragstart");
			attr_dev(a3, "class", "list-group-item");
			attr_dev(a3, "href", "javascript:;");
			add_location(a3, file$g, 17, 12, 719);
			attr_dev(a4, "for", "ondrag");
			attr_dev(a4, "class", "list-group-item");
			attr_dev(a4, "href", "javascript:;");
			add_location(a4, file$g, 18, 12, 819);
			attr_dev(a5, "for", "ondragend");
			attr_dev(a5, "class", "list-group-item");
			attr_dev(a5, "href", "javascript:;");
			add_location(a5, file$g, 19, 12, 908);
			attr_dev(a6, "for", "ondrop");
			attr_dev(a6, "class", "list-group-item");
			attr_dev(a6, "href", "javascript:;");
			add_location(a6, file$g, 20, 12, 1004);
			attr_dev(a7, "for", "onmouseover");
			attr_dev(a7, "class", "list-group-item");
			attr_dev(a7, "href", "javascript:;");
			add_location(a7, file$g, 21, 12, 1093);
			attr_dev(a8, "for", "onmouseup");
			attr_dev(a8, "class", "list-group-item");
			attr_dev(a8, "href", "javascript:;");
			add_location(a8, file$g, 22, 12, 1193);
			attr_dev(a9, "for", "onmousedown");
			attr_dev(a9, "class", "list-group-item");
			attr_dev(a9, "href", "javascript:;");
			add_location(a9, file$g, 23, 12, 1289);
			attr_dev(a10, "for", "onchange");
			attr_dev(a10, "class", "list-group-item");
			attr_dev(a10, "href", "javascript:;");
			add_location(a10, file$g, 24, 12, 1389);
			attr_dev(a11, "for", "onfocus");
			attr_dev(a11, "class", "list-group-item");
			attr_dev(a11, "href", "javascript:;");
			add_location(a11, file$g, 25, 12, 1482);
			attr_dev(a12, "for", "onblur");
			attr_dev(a12, "class", "list-group-item");
			attr_dev(a12, "href", "javascript:;");
			add_location(a12, file$g, 26, 12, 1573);
			attr_dev(a13, "for", "onkeyup");
			attr_dev(a13, "class", "list-group-item");
			attr_dev(a13, "href", "javascript:;");
			add_location(a13, file$g, 27, 12, 1662);
			attr_dev(a14, "for", "onkeypress");
			attr_dev(a14, "class", "list-group-item");
			attr_dev(a14, "href", "javascript:;");
			add_location(a14, file$g, 28, 12, 1754);
			attr_dev(a15, "for", "onkeydown");
			attr_dev(a15, "class", "list-group-item");
			attr_dev(a15, "href", "javascript:;");
			add_location(a15, file$g, 29, 12, 1852);
			attr_dev(div0, "class", "list-group");
			add_location(div0, file$g, 13, 8, 386);
			attr_dev(div1, "class", "row-fluid events");
			set_style(div1, "height", "221px");
			add_location(div1, file$g, 12, 4, 323);
			attr_dev(div2, "class", "clearboth mb-3");
			add_location(div2, file$g, 32, 4, 1968);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "id", "onclick");
			attr_dev(input0, "class", "form-control form-control-md show w-100 border rounded");
			attr_dev(input0, "name", "onclick");
			attr_dev(input0, "placeholder", input0_placeholder_value = Lang.func_for + Lang.on_click);
			add_location(input0, file$g, 34, 8, 2065);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "id", "ondblclick");
			attr_dev(input1, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input1, "name", "ondblclick");
			attr_dev(input1, "placeholder", input1_placeholder_value = Lang.func_for + Lang.on_dbl_click);
			add_location(input1, file$g, 35, 8, 2226);
			attr_dev(input2, "type", "text");
			attr_dev(input2, "id", "oncontextmenu");
			attr_dev(input2, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input2, "name", "oncontextmenu");
			attr_dev(input2, "placeholder", input2_placeholder_value = Lang.func_for + Lang.on_context);
			add_location(input2, file$g, 36, 8, 2394);
			attr_dev(input3, "type", "text");
			attr_dev(input3, "id", "ondragstart");
			attr_dev(input3, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input3, "name", "ondragstart");
			attr_dev(input3, "placeholder", input3_placeholder_value = Lang.func_for + Lang.on_drag_start);
			add_location(input3, file$g, 37, 8, 2566);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "id", "ondrag");
			attr_dev(input4, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input4, "name", "ondrag");
			attr_dev(input4, "placeholder", input4_placeholder_value = Lang.func_for + Lang.on_drag);
			add_location(input4, file$g, 38, 8, 2737);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "id", "ondragend");
			attr_dev(input5, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input5, "name", "ondragend");
			attr_dev(input5, "placeholder", input5_placeholder_value = Lang.func_for + Lang.on_drag_end);
			add_location(input5, file$g, 39, 8, 2892);
			attr_dev(input6, "type", "text");
			attr_dev(input6, "id", "ondrop");
			attr_dev(input6, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input6, "name", "ondrop");
			attr_dev(input6, "placeholder", input6_placeholder_value = Lang.func_for + Lang.on_drop);
			add_location(input6, file$g, 40, 8, 3057);
			attr_dev(input7, "type", "text");
			attr_dev(input7, "id", "onmouseover");
			attr_dev(input7, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input7, "name", "onmouseover");
			attr_dev(input7, "placeholder", input7_placeholder_value = Lang.func_for + Lang.on_mouse_over);
			add_location(input7, file$g, 41, 8, 3212);
			attr_dev(input8, "type", "text");
			attr_dev(input8, "id", "onmouseup");
			attr_dev(input8, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input8, "name", "onmouseup");
			attr_dev(input8, "placeholder", input8_placeholder_value = Lang.func_for + Lang.on_mouse_up);
			add_location(input8, file$g, 42, 8, 3383);
			attr_dev(input9, "type", "text");
			attr_dev(input9, "id", "onmousedown");
			attr_dev(input9, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input9, "name", "onmousedown");
			attr_dev(input9, "placeholder", input9_placeholder_value = Lang.func_for + Lang.on_mouse_down);
			add_location(input9, file$g, 43, 8, 3548);
			attr_dev(input10, "type", "text");
			attr_dev(input10, "id", "onchange");
			attr_dev(input10, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input10, "name", "onchange");
			attr_dev(input10, "placeholder", input10_placeholder_value = Lang.func_for + Lang.on_change);
			add_location(input10, file$g, 44, 8, 3719);
			attr_dev(input11, "type", "text");
			attr_dev(input11, "id", "onfocus");
			attr_dev(input11, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input11, "name", "onfocus");
			attr_dev(input11, "placeholder", input11_placeholder_value = Lang.func_for + Lang.on_focus);
			add_location(input11, file$g, 45, 8, 3880);
			attr_dev(input12, "type", "text");
			attr_dev(input12, "id", "onblur");
			attr_dev(input12, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input12, "name", "onblur");
			attr_dev(input12, "placeholder", input12_placeholder_value = Lang.func_for + Lang.on_blur);
			add_location(input12, file$g, 46, 8, 4038);
			attr_dev(input13, "type", "text");
			attr_dev(input13, "id", "onkeyup");
			attr_dev(input13, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input13, "name", "onkeyup");
			attr_dev(input13, "placeholder", input13_placeholder_value = Lang.func_for + Lang.on_key_up);
			add_location(input13, file$g, 47, 8, 4193);
			attr_dev(input14, "type", "text");
			attr_dev(input14, "id", "onkeypress");
			attr_dev(input14, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input14, "name", "onkeypress");
			attr_dev(input14, "placeholder", input14_placeholder_value = Lang.func_for + Lang.on_key_press);
			add_location(input14, file$g, 48, 8, 4352);
			attr_dev(input15, "type", "text");
			attr_dev(input15, "id", "onkeydown");
			attr_dev(input15, "class", "form-control form-control-md h w-100 border rounded");
			attr_dev(input15, "name", "onkeydown");
			attr_dev(input15, "placeholder", input15_placeholder_value = Lang.func_for + Lang.on_key_down);
			add_location(input15, file$g, 49, 8, 4520);
			attr_dev(div3, "class", "row-fluid margin-top1 event-input");
			add_location(div3, file$g, 33, 4, 2008);
			add_location(div4, file$g, 11, 0, 312);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div4, anchor);
			append_dev(div4, div1);
			append_dev(div1, div0);
			append_dev(div0, a0);
			append_dev(div0, t1);
			append_dev(div0, a1);
			append_dev(div0, t3);
			append_dev(div0, a2);
			append_dev(div0, t5);
			append_dev(div0, a3);
			append_dev(div0, t7);
			append_dev(div0, a4);
			append_dev(div0, t9);
			append_dev(div0, a5);
			append_dev(div0, t11);
			append_dev(div0, a6);
			append_dev(div0, t13);
			append_dev(div0, a7);
			append_dev(div0, t15);
			append_dev(div0, a8);
			append_dev(div0, t17);
			append_dev(div0, a9);
			append_dev(div0, t19);
			append_dev(div0, a10);
			append_dev(div0, t21);
			append_dev(div0, a11);
			append_dev(div0, t23);
			append_dev(div0, a12);
			append_dev(div0, t25);
			append_dev(div0, a13);
			append_dev(div0, t27);
			append_dev(div0, a14);
			append_dev(div0, t29);
			append_dev(div0, a15);
			append_dev(div4, t31);
			append_dev(div4, div2);
			append_dev(div4, t32);
			append_dev(div4, div3);
			append_dev(div3, input0);
			append_dev(div3, t33);
			append_dev(div3, input1);
			append_dev(div3, t34);
			append_dev(div3, input2);
			append_dev(div3, t35);
			append_dev(div3, input3);
			append_dev(div3, t36);
			append_dev(div3, input4);
			append_dev(div3, t37);
			append_dev(div3, input5);
			append_dev(div3, t38);
			append_dev(div3, input6);
			append_dev(div3, t39);
			append_dev(div3, input7);
			append_dev(div3, t40);
			append_dev(div3, input8);
			append_dev(div3, t41);
			append_dev(div3, input9);
			append_dev(div3, t42);
			append_dev(div3, input10);
			append_dev(div3, t43);
			append_dev(div3, input11);
			append_dev(div3, t44);
			append_dev(div3, input12);
			append_dev(div3, t45);
			append_dev(div3, input13);
			append_dev(div3, t46);
			append_dev(div3, input14);
			append_dev(div3, t47);
			append_dev(div3, input15);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div4);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$g.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$g($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("ModalEvent", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ModalEvent> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ l: Lang });
	return [];
}

class ModalEvent extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ModalEvent",
			options,
			id: create_fragment$g.name
		});
	}
}

/* clsSMDragNDrop\libs\authoring\DndModalBox.svelte generated by Svelte v3.29.0 */
const file$h = "clsSMDragNDrop\\libs\\authoring\\DndModalBox.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-rrvcgd-style";
	style.textContent = ".modal_height.svelte-rrvcgd{max-height:350px}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRG5kTW9kYWxCb3guc3ZlbHRlIiwic291cmNlcyI6WyJEbmRNb2RhbEJveC5zdmVsdGUiXSwic291cmNlc0NvbnRlbnQiOlsiPCEtLVxyXG4gKiAgRmlsZSBOYW1lICAgOiBEbmRNb2RhbEJveC5zdmVsdGVcclxuICogIERlc2NyaXB0aW9uIDogUmVzcG9uc2libGUgZm9yIE1vZGFsIEJveFxyXG4gKiAgQXV0aG9yICAgICAgOiBBeXVzaCBTcml2YXN0YXZhXHJcbiAqICBQYWNrYWdlICAgICA6IERyYWcgYW5kIERyb3AgKGF1dGhvcmluZylcclxuICogIExhc3QgdXBkYXRlIDogMjAtSmFuLTIwMjFcclxuICogIExhc3QgVXBkYXRlZCBCeSA6IEF5dXNoIFNyaXZhc3RhdmFcclxuLS0+XHJcbjxzY3JpcHQ+XHJcbiAgICBpbXBvcnQgTW9kYWxFdmVudCBmcm9tIFwiLi9Nb2RhbEV2ZW50LnN2ZWx0ZVwiO1xyXG4gICAgaW1wb3J0IGwgZnJvbSAnLi4vLi4vLi4vc3JjL2xpYnMvTGFuZyc7XHJcbiAgICBleHBvcnQgbGV0IGlzRE5ERXh0ZW5kZWQgPSAwO1xyXG48L3NjcmlwdD5cclxuPGRpdiBpZD1cImF1dGhvcmluZy1tb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiIHRhYkluZGV4PVwiLTFcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2cgbW9kYWwtZGlhbG9nLWNlbnRlcmVkXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj57bC5kcmFnZ2FibGV9PC9oND5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWJzLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5IG1vZGFsX2hlaWdodCBvdmVyZmxvdy15XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZHJhZyBoXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBteC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTMgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJkcmFnLXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJkcmFnLXdpZHRoXCIgbmFtZT1cIndpZHRoXCIgcGxhY2Vob2xkZXI9XCJ7bC53aWR0aF9vZl9kcmFnZ2FibGV9XCIgZGVmYXVsdHZhbHVlPVwiMTAwXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTMgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJkcmFnLWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImRyYWctaGVpZ2h0XCIgbmFtZT1cImhlaWdodFwiIHBsYWNlaG9sZGVyPVwie2wuaGVpZ2h0X29mX2RyZ2dhYmxlfVwiIGRlZmF1bHR2YWx1ZT1cIjMwXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJkcmFnLXRvcFwiPntsLnRvcH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiZHJhZy10b3BcIiBuYW1lPVwidG9wXCIgcGxhY2Vob2xkZXI9XCJ7bC50b3Bfb2ZfZHJhZ2dhYmxlfVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiZHJhZy1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiZHJhZy1sZWZ0XCIgbmFtZT1cImxlZnRcIiBwbGFjZWhvbGRlcj1cIntsLmxlZnRfb2ZfZHJnZ2FibGV9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImRyYWctdmFsdWVcIj57bC50aXRsZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJkcmFnLXZhbHVlXCIgbmFtZT1cInZhbHVlXCIgcGxhY2Vob2xkZXI9XCJ7bC50aXRsZV9vZl9kcmdnYWJsZX1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiZHJhZy1ib3JkZXJfY29sb3JcIj57bC5ib3JkZXJfY29sb3J9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJkcmFnLWJvcmRlcl9jb2xvclwiIG5hbWU9XCJib3JkZXJfY29sb3JcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+e2wubm9uZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYmxhY2tcIj57bC5ibGFja308L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ3JheVwiPntsLmdyYXl9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJkcmFnLW5hbWVcIj57bC5ncnBfbmFtZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJkcmFnLW5hbWVcIiBuYW1lPVwibmFtZVwiIHBsYWNlaG9sZGVyPVwie2wubmFtZV9vZl9kcmFnZ2FibGV9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJkcmFnLWltYWdlXCI+e2wuYmFja2dyb3VuZF9pbWFnZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJkcmFnLWltYWdlXCIgbmFtZT1cImltYWdlXCIgcGxhY2Vob2xkZXI9XCJ7bC5iZ19vZl9kcmFnZ2JsZX1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJkcmFnX3VwbG9hZF9tZWRpYVwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnkgZmxvYXQtc3RhcnRcIj57bC51cGxvYWRfbWVkaWFfdGV4dH08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMSBwdC1zbS00IG10LXNtLTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZm9ybS1jaGVjayBmb3JtLWNoZWNrLWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3ggZm9ybS1jaGVjay1pbnB1dCBtYXJnaW4tYm90dG9tXCIgaWQ9XCJkcmFnLW11bHRpX2RyYWdcIiBuYW1lPVwibXVsdGlfZHJhZ1wiIGRlZmF1bHR2YWx1ZT1cIjFcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvcm0tY2hlY2stbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJkcmFnLW11bHRpX2RyYWdcIj57bC5tdWx0aXBsZV9kcmFnfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGZvcm0tY2hlY2sgcHQtMyBmb3JtLWNoZWNrLWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3ggZm9ybS1jaGVjay1pbnB1dCBtYXJnaW4tYm90dG9tXCIgaWQ9XCJjaC1pbnZpc2libGVcIiBuYW1lPVwiaW52aXNpYmxlXCIgZGVmYXVsdHZhbHVlPVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvcm0tY2hlY2stbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJjaC1pbnZpc2libGVcIj57bC5pbnZpc2libGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgZC1ub25lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJ0eHQtc3R5bGVcIj57bC5jc3Nfc3R5bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cInR4dC1zdHlsZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCBoZWlnaHRfMzQgaGVpZ2h0XzM0XCIgbmFtZT1cInN0eWxlXCIgcGxhY2Vob2xkZXI9XCJ7bC5jc3Nfc3R5bGVfb2ZfdHh0fVwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiZHJhZy1kZXRhaWxcIj57bC5kZXRhaWx9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiZHJhZy1kZXRhaWxcIiBuYW1lPVwiZGV0YWlsXCIgcGxhY2Vob2xkZXI9XCJ7bC5kZXRhaWxfb2ZfZHJhZ31cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwiZHJhZy1pZFwiIG5hbWU9XCJpZFwiIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJkcm9waXRlbSBoXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBteC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJkcm9wLXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJkcm9wLXdpZHRoXCIgbmFtZT1cIndpZHRoXCIgcGxhY2Vob2xkZXI9XCJ7bC53aWR0aF9vZl9wbGFjZWhvbGRlcn1cIiBkZWZhdWx0dmFsdWU9XCIxMDBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImRyb3AtaGVpZ2h0XCI+e2wuaGVpZ2h0X2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiZHJvcC1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfcGxhY2Vob2xkZXJ9XCIgZGVmYXVsdHZhbHVlPVwiMzBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiZHJvcC10b3BcIj57bC50b3B9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImRyb3AtdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX3BofVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiZHJvcC1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiZHJvcC1sZWZ0XCIgbmFtZT1cImxlZnRcIiBwbGFjZWhvbGRlcj1cIntsLmxlZnRfb2ZfcGh9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiZHJvcC12YWx1ZVwiPntsLnRpdGxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cImRyb3AtdmFsdWVcIiBuYW1lPVwidmFsdWVcIiBwbGFjZWhvbGRlcj1cIntsLnRpbHRlX29mX3BofVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiZHJvcC1ib3JkZXJcIj57bC5ib3JkZXJfY29sb3J9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJkcm9wLWJvcmRlclwiIG5hbWU9XCJib3JkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+e2wubm9uZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYmxhY2tcIj57bC5ibGFja308L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiZ3JheVwiPntsLmdyYXl9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImRyb3AtbmFtZVwiPntsLmdycF9uYW1lfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cImRyb3AtbmFtZVwiIG5hbWU9XCJuYW1lXCIgcGxhY2Vob2xkZXI9XCJ7bC5uYW1lX29mX3BofVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiZHJvcC1hbnNrZXlcIj57bC5jb3JyZWN0X2Fuc3dlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJkcm9wLWFuc2tleVwiIG5hbWU9XCJhbnNrZXlcIiBwbGFjZWhvbGRlcj1cIntsLmNvcnJlY3RfYW5zd2VyX29mX3BofVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgcHgtMSBkLW5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJkcm9wLWRlZmF1bHRhbnNcIj57bC5kZWZhdWx0X2Fuc3dlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJkcm9wLWRlZmF1bHRhbnNcIiBuYW1lPVwiZGVmYXVsdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuZGVmYXVsdF9hbnN3ZXJfb2ZfcGh9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjaGVja2JveCBkLWlubGluZSBtci0yXCIgaWQ9XCJkcm9wLWludmlzaWJsZVwiIG5hbWU9XCJpbnZpc2libGVcIiBkZWZhdWx0dmFsdWU9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgcG9zaXRpb24tcmVsYXRpdmUgYm90dG9tMVwiIGZvcj1cImRyb3AtaW52aXNpYmxlXCI+e2wuaW52aXNpYmxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJkcm9wLWlkXCIgbmFtZT1cImlkXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHBsLTIgcHItMSBkLW5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImRyb3Atc3R5bGVcIj57bC5jc3Nfc3R5bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJkcm9wLXN0eWxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIGhlaWdodF8zNFwiIG5hbWU9XCJzdHlsZVwiIHBsYWNlaG9sZGVyPVwie2wuY3NzX3N0eWxlX29mX3BofVwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJldlwiIHR5cGU9XCJkcm9wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXRib3ggaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaW50LXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJpbnQtd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2lucHV0fVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaW50LWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImludC1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfaW5wdXR9XCIgZGVmYXVsdHZhbHVlPVwiMzBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaW50LXRvcFwiPntsLnRvcH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiaW50LXRvcFwiIG5hbWU9XCJ0b3BcIiBwbGFjZWhvbGRlcj1cIntsLnRvcF9vZl9pbnB1dH1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImludC1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiaW50LWxlZnRcIiBuYW1lPVwibGVmdFwiIHBsYWNlaG9sZGVyPVwie2wubGVmdF9vZl9pbnB1dH1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImludC1jb3JyZWN0YW5zXCI+e2wuY29ycmVjdF9hbnN3ZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZVwiIGlkPVwiaW50LWNvcnJlY3RhbnNcIiBuYW1lPVwiY29ycmVjdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuY29ycmVjdF9hbnN3ZXJfb2ZfaW5wdXR9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xIGQtbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImludC1kZWZhdWx0YW5zXCI+e2wuZGVmYXVsdF9hbnN3ZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiaW50LWRlZmF1bHRhbnNcIiBuYW1lPVwiZGVmYXVsdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuZGVmYXVsdF9hbnNfb2ZfaW5wdXR9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiaW50LXBsYWNlaG9sZGVyXCI+e2wucGxhY2Vob2xkZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiaW50LXBsYWNlaG9sZGVyXCIgbmFtZT1cInBsYWNlaG9sZGVyXCIgcGxhY2Vob2xkZXI9XCJ7bC5wbGFjZWhvbGRlcl9vZl9pYn1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImludC10eXBlXCI+e2wudHlwZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cImludC10eXBlXCIgbmFtZT1cInR5cGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwidGV4dFwiIHNlbGVjdGVkPVwic2VsZWN0ZWRcIj57bC50ZXh0X2JveH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGFzc3dvcmRcIj57bC5wYXNzd29yZH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImludC1wYXJzZXJcIj57bC5wYXJzZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJpbnQtcGFyc2VyXCIgbmFtZT1cInBhcnNlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj57bC5wYXJzZXJfb2ZfdHh0fTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJzcWxcIj57bC5zcWx9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZm9ybS1jaGVjayBmb3JtLWNoZWNrLWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3ggZm9ybS1jaGVjay1pbnB1dFwiIGlkPVwiaW50LW5vY2FzZVwiIG5hbWU9XCJub2Nhc2VcIiBkZWZhdWx0dmFsdWU9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9ybS1jaGVjay1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImludC1ub2Nhc2VcIj57bC5jYXNlX2luc2Vuc2l0aXZlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIGZvcm0tY2hlY2sgZm9ybS1jaGVjay1pbmxpbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImNoZWNrYm94IGZvcm0tY2hlY2staW5wdXRcIiBpZD1cImludC1pc211bHRpcGxlYW5zd2VyXCIgbmFtZT1cImlzbXVsdGlwbGVhbnN3ZXJcIiBkZWZhdWx0dmFsdWU9XCIxXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgZm9ybS1jaGVjay1sYWJlbFwiIGZvcj1cImludC1pc211bHRpcGxlYW5zd2VyXCI+TXVsdGlwbGUgQ29ycmVjdCBBbnN3ZXJzPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cImludC1pZFwiIG5hbWU9XCJpZFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBwbC0yIHByLTEgZC1ub25lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJpbnQtc3R5bGVcIj57bC5jc3Nfc3R5bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJpbnQtc3R5bGVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgaGVpZ2h0XzM0XCIgbmFtZT1cInN0eWxlXCIgcGxhY2Vob2xkZXI9XCJ7bC5jc3Nfb2ZfaW5wdXR9XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiY3VzdG9tX2NsYXNzX2lucHV0XCI+e2wuZm9udF9zdHlsZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJjdXN0b21fY2xhc3NfaW5wdXRcIiBuYW1lPVwiY3VzdG9tX2NsYXNzXCI+PC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJldlwiIHR5cGU9XCJpbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxFdmVudC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtdWx0aWxpbmUgaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwibWx0LXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJtbHQtd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX211bHRpbGluZX1cIiBkZWZhdWx0dmFsdWU9XCIxMDBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cIm1sdC1oZWlnaHRcIj57bC5oZWlnaHRfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJtbHQtaGVpZ2h0XCIgbmFtZT1cImhlaWdodFwiIHBsYWNlaG9sZGVyPVwie2wuaGVpZ2h0X29mX211bHRpbGluZX1cIiBkZWZhdWx0dmFsdWU9XCIzMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJtbHQtdG9wXCI+e2wudG9wfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJtbHQtdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX211bHRpbGluZX1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cIm1sdC1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwibWx0LWxlZnRcIiBuYW1lPVwibGVmdFwiIHBsYWNlaG9sZGVyPVwie2wubGVmdF9vZl9tdWx0aWxpbmV9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJtbHQtY29ycmVjdGFuc1wiPntsLmNvcnJlY3RfYW5zd2VyfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGVcIiBpZD1cIm1sdC1jb3JyZWN0YW5zXCIgbmFtZT1cImNvcnJlY3RhbnNcIiBwbGFjZWhvbGRlcj1cIntsLmNyY3RfYW5zX211bHRpbGluZX1cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTEgZC1ub25lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwibWx0LWRlZmF1bHRhbnNcIj57bC5kZWZhdWx0X2Fuc3dlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJtbHQtZGVmYXVsdGFuc1wiIG5hbWU9XCJkZWZhdWx0YW5zXCIgcGxhY2Vob2xkZXI9XCJ7bC5kZWZfYW5zX211bHRpbGluZX1cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJtbHQtcGxhY2Vob2xkZXJcIj57bC5wbGFjZWhvbGRlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJtbHQtcGxhY2Vob2xkZXJcIiBuYW1lPVwicGxhY2Vob2xkZXJcIiBwbGFjZWhvbGRlcj1cIntsLnBsYWNlaG9sZGVyX211bHRpbGluZX1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJtbHQtcGFyc2VyXCI+e2wucGFyc2VyfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwibWx0LXBhcnNlclwiIG5hbWU9XCJwYXJzZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiXCI+e2wucGFyc2VyX29mX211bHRpbGluZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwic3FsXCI+e2wuc3FsfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBmb3JtLWNoZWNrIGZvcm0tY2hlY2staW5saW5lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjaGVja2JveCBmb3JtLWNoZWNrLWlucHV0IG1hcmdpbi1ib3R0b21cIiBpZD1cIm1sdC1ub2Nhc2VcIiBuYW1lPVwibm9jYXNlXCIgZGVmYXVsdHZhbHVlPVwiMVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvcm0tY2hlY2stbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJtbHQtbm9jYXNlXCI+e2wuY2FzZV9pbnNlbnNpdGl2ZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwibWx0LWlkXCIgbmFtZT1cImlkXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHBsLTIgcHItMSBkLW5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cIm1sdC1zdHlsZVwiPntsLmNzc19zdHlsZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cIm1sdC1zdHlsZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCBoZWlnaHRfMzRcIiBuYW1lPVwic3R5bGVcIiBwbGFjZWhvbGRlcj1cIkNTUyBzdHlsZSBvZiBNdWx0aWxpbmVcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJjdXN0b21fY2xhc3NcIj57bC5jc3NfY2xhc3N9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiY3VzdG9tX2NsYXNzXCIgbmFtZT1cImN1c3RvbV9jbGFzc1wiPjwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZcIiB0eXBlPVwibWx0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hla2JveCBoXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBteC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJjaGstd2lkdGhcIj57bC53aWR0aF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImNoay13aWR0aFwiIG5hbWU9XCJ3aWR0aFwiIHBsYWNlaG9sZGVyPVwiV2lkdGggb2YgQ2hlY2tib3hcIiBkZWZhdWx0dmFsdWU9XCIyMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiY2hrLWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImNoay1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfY2hlY2tib3h9XCIgZGVmYXVsdHZhbHVlPVwiMjBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiY2hrLXRvcFwiPntsLnRvcH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiY2hrLXRvcFwiIG5hbWU9XCJ0b3BcIiBwbGFjZWhvbGRlcj1cIntsLnRvcF9vZl9jaGVja2JveH1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImNoay1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiY2hrLWxlZnRcIiBuYW1lPVwibGVmdFwiIHBsYWNlaG9sZGVyPVwie2wubGVmdF9vZl9jaGVja2JveH1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImNoay1jb3JyZWN0YW5zXCI+e2wuY29ycmVjdF9hbnN3ZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZVwiIGlkPVwiY2hrLWNvcnJlY3RhbnNcIiBuYW1lPVwiY29ycmVjdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuY3JjdF9vZl9jaGt9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiY2hrLWRlZmF1bHRhbnNcIj57bC5kZWZhdWx0X2Fuc3dlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJjaGstZGVmYXVsdGFuc1wiIG5hbWU9XCJkZWZhdWx0YW5zXCIgcGxhY2Vob2xkZXI9XCJ7bC5kZWZfb2ZfY2hrfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJjaGstaWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHItMSBwbC0yIGQtbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiY2hrLXN0eWxlXCI+e2wuY3NzX3N0eWxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY2hrLXN0eWxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIGhlaWdodF8zNFwiIG5hbWU9XCJzdHlsZVwiIHBsYWNlaG9sZGVyPVwie2wuY3NzX29mX2Noa31cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZcIiB0eXBlPVwiY2hrXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicmRpbyBoXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBteC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJyZC13aWR0aFwiPntsLndpZHRoX2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwicmQtd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX3JhZGlvfVwiIGRlZmF1bHR2YWx1ZT1cIjIwXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJyZC1oZWlnaHRcIj57bC5oZWlnaHRfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJyZC1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfcmFkaW99XCIgZGVmYXVsdHZhbHVlPVwiMjBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwicmQtdG9wXCI+e2wudG9wfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJyZC10b3BcIiBuYW1lPVwidG9wXCIgcGxhY2Vob2xkZXI9XCJ7bC50b3Bfb2ZfcmFkaW99XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJyZC1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwicmQtbGVmdFwiIG5hbWU9XCJsZWZ0XCIgcGxhY2Vob2xkZXI9XCJ7bC5sZWZ0X29mX3JhZGlvfVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwicmQtbmFtZVwiPntsLm5hbWVfdGV4dH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlXCIgaWQ9XCJyZC1uYW1lXCIgbmFtZT1cIm5hbWVcIiBwbGFjZWhvbGRlcj1cIk5hbWUgb2YgUmFkaW9cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwicmQtY29ycmVjdGFuc1wiPntsLmNvcnJlY3RfYW5zd2VyfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGVcIiBpZD1cInJkLWNvcnJlY3RhbnNcIiBuYW1lPVwiY29ycmVjdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuY3JjdF9vZl9yYWRpb31cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJyZC1kZWZhdWx0YW5zXCI+e2wuZGVmYXVsdF9hbnN3ZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwicmQtZGVmYXVsdGFuc1wiIG5hbWU9XCJkZWZhdWx0YW5zXCIgcGxhY2Vob2xkZXI9XCJ7bC5kZWZfb2ZfcmFkaW99XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwicmQtY2hlY2t0eXBlXCI+e2wuY2hrX3R5cGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwicmQtY2hlY2t0eXBlXCIgbmFtZT1cImNoZWNrdHlwZVwiIHBsYWNlaG9sZGVyPVwie2wuY2hrdHlwZV9vZl9yYWRpb31cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwicmQtaWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcGwtMiBwci0xIGQtbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwicmQtc3R5bGVcIj57bC5jc3Nfc3R5bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJyZC1zdHlsZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCBoZWlnaHRfMzRcIiBuYW1lPVwic3R5bGVcIiBwbGFjZWhvbGRlcj1cIntsLmNzc19zdHlsZV9yYWRpb31cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZcIiB0eXBlPVwicmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxFdmVudC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b24gaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiYnRuLXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJidG4td2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2J1dHRvbn1cIiBkZWZhdWx0dmFsdWU9XCIxMDBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImJ0bi1oZWlnaHRcIj57bC5oZWlnaHRfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJidG4taGVpZ2h0XCIgbmFtZT1cImhlaWdodFwiIHBsYWNlaG9sZGVyPVwie2wuaGVpZ2h0X29mX2J1dHRvbn1cIiBkZWZhdWx0dmFsdWU9XCIzMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJidG4tdG9wXCI+e2wudG9wfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJidG4tdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX2J1dHRvbn1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImJ0bi1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiYnRuLWxlZnRcIiBuYW1lPVwibGVmdFwiIHBsYWNlaG9sZGVyPVwie2wubGVmdF9vZl9idXR0b259XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImJ0bi12YWx1ZVwiPlZhbHVlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiYnRuLXZhbHVlXCIgbmFtZT1cInZhbHVlXCIgcGxhY2Vob2xkZXI9XCJ7bC52YWx1ZV9vZl9idXR0b259XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiYnRuLWNsYXNzXCI+e2wuY2xhc3N9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiYnRuLWNsYXNzXCIgbmFtZT1cImNsYXNzXCIgcGxhY2Vob2xkZXI9XCJ7bC5jbGFzc19vZl9idXR0b259XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJidG4taWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHItMSBwbC0yIGQtbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiYnRuLXN0eWxlXCI+e2wuY3NzX3N0eWxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiYnRuLXN0eWxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIGhlaWdodF8zNFwiIG5hbWU9XCJzdHlsZVwiIHBsYWNlaG9sZGVyPVwie2wuY3NzX3N0eWxlX2J0bn1cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZcIiB0eXBlPVwiYnRuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZHJvcGRvd24gaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiZGRuLXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJkZG4td2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2Ryb3Bkb3dufVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiZGRuLWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImRkbi1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfZHJvcGRvd259XCIgZGVmYXVsdHZhbHVlPVwiMzBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiZGRuLXRvcFwiPntsLnRvcH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiZGRuLXRvcFwiIG5hbWU9XCJ0b3BcIiBwbGFjZWhvbGRlcj1cIntsLnRvcF9vZl9kcm9wZG93bn1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImRkbi1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiZGRuLWxlZnRcIiBuYW1lPVwibGVmdFwiIHBsYWNlaG9sZGVyPVwie2wubGVmdF9vZl9kcm9wZG93bn1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiZGRuLXZhbHVlXCI+e2wub3B0aW9uc308L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiZGRuLXZhbHVlXCIgbmFtZT1cInZhbHVlXCIgcGxhY2Vob2xkZXI9XCJ7bC5vcHRpb25fb2ZfZHJvcGRvd259XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJkZG4taWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHItMSBwbC0yIGQtbm9uZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiZGRuLXN0eWxlXCI+e2wuY3NzX3N0eWxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiZGRuLXN0eWxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIGhlaWdodF8zNFwiIG5hbWU9XCJzdHlsZVwiIHBsYWNlaG9sZGVyPVwie2wuY3NzX3N0eWxlX29mX2RycGR3bn1cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZcIiB0eXBlPVwiZGRuXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGlzdGJveCBoXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBteC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImxzdC13aWR0aFwiPntsLndpZHRoX2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwibHN0LXdpZHRoXCIgbmFtZT1cIndpZHRoXCIgcGxhY2Vob2xkZXI9XCJ7bC53aWR0aF9vZl9saXN0Ym94fVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwibHN0LWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImxzdC1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfbGlzdGJveH1cIiBkZWZhdWx0dmFsdWU9XCIzMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJsc3QtdG9wXCI+e2wudG9wfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJsc3QtdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX2xpc3Rib3h9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJsc3QtbGVmdFwiPntsLmxlZnR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImxzdC1sZWZ0XCIgbmFtZT1cImxlZnRcIiBwbGFjZWhvbGRlcj1cIntsLmxlZnRfb2ZfbGlzdGJveH1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwibHN0LXZhbHVlXCI+e2wub3B0aW9uc308L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwibHN0LXZhbHVlXCIgbmFtZT1cInZhbHVlXCIgcGxhY2Vob2xkZXI9XCJ7bC5vcHRpb25fb2ZfbGlzdGJveH1cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZm9ybS1jaGVjayBmb3JtLWNoZWNrLWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3ggZm9ybS1jaGVjay1pbnB1dCBtYXJnaW4tYm90dG9tXCIgaWQ9XCJsc3QtbXVsdGlwbGVcIiBuYW1lPVwibXVsdGlwbGVcIiBkZWZhdWx0dmFsdWU9XCIxXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBmb3JtLWNoZWNrLWxhYmVsXCIgZm9yPVwibHN0LW11bHRpcGxlXCI+e2wuc2VsZWN0X211bHRpcGxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJsc3Qtc2l6ZVwiIG5hbWU9XCJzaXplXCIgZGVmYXVsdHZhbHVlPVwiM1wiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cImxzdC1pZFwiIG5hbWU9XCJpZFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBwci0xIHBsLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImxzdC1zdHlsZVwiPntsLmNzc19zdHlsZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImxzdC1zdHlsZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCBoZWlnaHRfMzRcIiBuYW1lPVwic3R5bGVcIiBwbGFjZWhvbGRlcj1cIntsLmNzc19zdHlsZV9vZl9saXN0Ym94fVwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJldlwiIHR5cGU9XCJsc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TW9kYWxFdmVudC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0YWJoZWFkIGhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG14LTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ7KGlzRE5ERXh0ZW5kZWQgPT0gMSkgPyBcImNvbC1zbS02XCIgOiBcImNvbC1zbS0xMlwifVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cInRiZC13aWR0aFwiPntsLndpZHRoX2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwidGJkLXdpZHRoXCIgbmFtZT1cIndpZHRoXCIgcGxhY2Vob2xkZXI9XCJ7bC53aWR0aF9vZl90YWJoZWFkfVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwidGJkLWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cInRiZC1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfdGFiaGVhZH1cIiBkZWZhdWx0dmFsdWU9XCIzMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJ0YmQtdG9wXCI+e2wudG9wfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJ0YmQtdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX3RhYmhlYWR9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJ0YmQtbGVmdFwiPntsLmxlZnR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cInRiZC1sZWZ0XCIgbmFtZT1cImxlZnRcIiBwbGFjZWhvbGRlcj1cIntsLmxlZnRfb2ZfdGFiaGVhZH1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwidGJkLXRpdGxlXCI+e2wudGl0bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwidGJkLXRpdGxlXCIgbmFtZT1cInRpdGxlXCIgcGxhY2Vob2xkZXI9XCJ7bC50aXRsZV9vZl90YWJoZWFkfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cInRiZC1jbGFzc1wiPntsLmNsYXNzfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cInRiZC1jbGFzc1wiIG5hbWU9XCJjbGFzc1wiIHBsYWNlaG9sZGVyPVwie2wuY2xhc3Nfb2ZfdGFiaGVhZH1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cInRiZC1pZFwiIG5hbWU9XCJpZFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsjaWYgaXNETkRFeHRlbmRlZCA9PSAxfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHByLTEgcGwtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJ0YmQtc3R5bGVcIj57bC5jc3Nfc3R5bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwidGJkLXN0eWxlXCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIGhlaWdodF8zNFwiIG5hbWU9XCJzdHlsZVwiIHBsYWNlaG9sZGVyPVwie2wuY3NzX3N0eWxlX29mX3RhYmhlYWR9XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZcIiB0eXBlPVwidGJkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNb2RhbEV2ZW50Lz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW1nIGhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG14LTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaW1nLXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJpbWctd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2ltYWdlfVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaW1nLWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImltZy1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfaW1hZ2V9XCIgZGVmYXVsdHZhbHVlPVwiMzBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaW1nLXRvcFwiPntsLnRvcH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiaW1nLXRvcFwiIG5hbWU9XCJ0b3BcIiBwbGFjZWhvbGRlcj1cIntsLnRvcF9vZl9pbWFnZX1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImltZy1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiaW1nLWxlZnRcIiBuYW1lPVwibGVmdFwiIHBsYWNlaG9sZGVyPVwie2wubGVmdF9vZl9pbWFnZX1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiaW1nLXRpdGxlXCI+e2wudGl0bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiaW1nLXRpdGxlXCIgbmFtZT1cInRpdGxlXCIgcGxhY2Vob2xkZXI9XCJ7bC50aXRsZV9vZl9pbWFnZX1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJpbWctYmdpbWdcIj57bC5iYWNrZ3JvdW5kX2ltYWdlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cImltZy1iZ2ltZ1wiIG5hbWU9XCJiZ2ltZ1wiIHBsYWNlaG9sZGVyPVwie2wuYmdfb2ZfaW1nfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwiaW1nLWlkXCIgbmFtZT1cImlkXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBwci0xIHBsLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImltZy1zdHlsZVwiPntsLmNzc19zdHlsZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImltZy1zdHlsZVwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCBoZWlnaHRfMzRcIiBuYW1lPVwic3R5bGVcIiBwbGFjZWhvbGRlcj1cIntsLmNzc19zdHlsZV9vZl9pbWFnZX1cIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZXZcIiB0eXBlPVwiaW1nXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGFiYWwgaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwibGJsLXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJsYmwtd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2xhYmVsfVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwibGJsLWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImxibC1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfbGFiZWx9XCIgZGVmYXVsdHZhbHVlPVwiMzBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImxibC10b3BcIj57bC50b3B9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImxibC10b3BcIiBuYW1lPVwidG9wXCIgcGxhY2Vob2xkZXI9XCJ7bC50b3Bfb2ZfbGFiZWx9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJsYmwtbGVmdFwiPntsLmxlZnR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImxibC1sZWZ0XCIgbmFtZT1cImxlZnRcIiBwbGFjZWhvbGRlcj1cIntsLmxlZnRfb2ZfbGFiZWx9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJsYmwtdGl0bGVcIj57bC50aXRsZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJsYmwtdGl0bGVcIiBuYW1lPVwidGl0bGVcIiBwbGFjZWhvbGRlcj1cIntsLnRpdGxlX29mX2xhYmVsfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNCBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwibGJsX2JvcmRlcl9zaXplXCI+e2wuYm9yZGVyX3NpemV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJsYmxfYm9yZGVyX3NpemVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgaGVpZ2h0XzM0XCIgbmFtZT1cImJvcmRlcl9zaXplXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjBcIj57bC5ub25lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxXCI+MTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIyXCI+Mjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIzXCI+Mzwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI0XCI+NDwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI1XCI+NTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNCBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwibGJsX2JvcmRlcl9jb2xvclwiPkJvcmRlciBDb2xvcjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGlkPVwibGJsX2JvcmRlcl9jb2xvclwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCBoZWlnaHRfMzRcIiBuYW1lPVwiYm9yZGVyX2NvbG9yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIndoaXRlXCI+e2wubm9uZX08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYmxhY2tcIj57bC5ibGFja308L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiYmx1ZVwiPntsLmJsdWV9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImdyZWVuXCI+e2wuZ3JlZW59PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInJlZFwiPntsLnJlZH08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTQgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImxibF9iYWNrZ3JvdW5kX2NvbG9yXCI+e2wuYmdfY29sb3J9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgaWQ9XCJsYmxfYmFja2dyb3VuZF9jb2xvclwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCBoZWlnaHRfMzRcIiBuYW1lPVwiYmFja2dyb3VuZF9jb2xvclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJcIj57bC5ub25lfTwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIjYzVkMGZhXCI+e2wucHJpbWFyeV9jb2xvcn08L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiI2ZmYTM1NFwiPntsLndhcm5pbmdfY29sb3J9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIiNmNTc4NWRcIj57bC5kYW5nZXJfY29sb3J9PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJsYmwtaWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwibGFiZWxfY2xhc3NcIj57bC5mb250X3N0eWxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwibGFiZWxfY2xhc3NcIiBuYW1lPVwibGFiZWxfY2xhc3NcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTEgcGItMiBkLW5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tY2hlY2sgZm9ybS1jaGVjay1pbmxpbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz1cImZvcm0tY2hlY2staW5wdXRcIiBuYW1lPVwicmljaHRleHRcIiBpZD1cInJpY2hfbGFiZWxfdGl0bGVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgZm9ybS1jaGVjay1sYWJlbFwiIGZvcj1cInJpY2hfbGFiZWxfdGl0bGVcIj57bC5yaWNoX3RleHR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBkLW5vbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV2XCIgdHlwZT1cImxibFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFyZWEgaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiYXJlYS13aWR0aFwiPntsLndpZHRoX2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiYXJlYS13aWR0aFwiIG5hbWU9XCJ3aWR0aFwiIHBsYWNlaG9sZGVyPVwie2wud2lkdGhfb2ZfYXJlYX1cIiBkZWZhdWx0dmFsdWU9XCIxMDBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMyBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImFyZWEtaGVpZ2h0XCI+e2wuaGVpZ2h0X2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiYXJlYS1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfYXJlYX1cIiBkZWZhdWx0dmFsdWU9XCIzMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiYXJlYS10b3BcIj57bC50b3B9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImFyZWEtdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX2FyZWF9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTMgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJhcmVhLWxlZnRcIj57bC5sZWZ0fTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJhcmVhLWxlZnRcIiBuYW1lPVwibGVmdFwiIHBsYWNlaG9sZGVyPVwie2wubGVmdF9vZl9hcmVhfVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImFyZWEtbWF0cml4XCI+e2wubWF0cml4fTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cImFyZWEtbWF0cml4XCIgbmFtZT1cIm1hdHJpeFwiIHBsYWNlaG9sZGVyPVwie2wubWF0cml4X29mX2FyZWF9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJhcmVhLWNvcnJlY3RhbnNcIj57bC5jb3JyZWN0X2Fuc3dlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJhcmVhLWNvcnJlY3RhbnNcIiBuYW1lPVwiY29ycmVjdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuY3J0X29mX2FyZWF9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImFyZWEtZGVmYXVsdGFuc1wiPntsLmRlZmF1bHRfYW5zd2VyfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cImFyZWEtZGVmYXVsdGFuc1wiIG5hbWU9XCJkZWZhdWx0YW5zXCIgcGxhY2Vob2xkZXI9XCJ7bC5kZWZfb2ZfYXJlYX1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cImFyZWEtaWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibWVudWxpc3QgaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwibW5sLXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJtbmwtd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX21lbnVsaXN0fVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwibW5sLWhlaWdodFwiPntsLmhlaWdodF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cIm1ubC1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfbWVudWxpc3R9XCIgZGVmYXVsdHZhbHVlPVwiMzBcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMyBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cIm1ubC10b3BcIj57bC50b3B9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cIm1ubC10b3BcIiBuYW1lPVwidG9wXCIgcGxhY2Vob2xkZXI9XCJ7bC50b3Bfb2ZfbWVudWxpc3R9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTMgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJtbmwtbGVmdFwiPntsLmxlZnR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cIm1ubC1sZWZ0XCIgbmFtZT1cImxlZnRcIiBwbGFjZWhvbGRlcj1cIntsLmxlZnRfb2ZfbWVudWxpc3R9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwibW5sLW1hdHJpeFwiPntsLm1hdHJpeH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJtbmwtbWF0cml4XCIgbmFtZT1cIm1hdHJpeFwiIHBsYWNlaG9sZGVyPVwie2wubWF0cml4X29mX21lbnVsaXN0fVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwibW5sLWNvcnJlY3RhbnNcIj57bC5jb3JyZWN0X2Fuc3dlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJtbmwtY29ycmVjdGFuc1wiIG5hbWU9XCJjb3JyZWN0YW5zXCIgcGxhY2Vob2xkZXI9XCJ7bC5jcnRfb2ZfbWVudWxpc3R9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cIm1ubC12YWx1ZVwiPntsLmV2ZW50X3ZhbHVlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cIm1ubC12YWx1ZVwiIG5hbWU9XCJ2YWx1ZVwiIHBsYWNlaG9sZGVyPVwie2wuZXZlbnRfdmFsX21lbnVsaXN0fVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwibW5sLWlkXCIgbmFtZT1cImlkXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhvdHNwb3QgaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaHB0LXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJocHQtd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2hvdHNwb3R9XCIgZGVmYXVsdHZhbHVlPVwiMjAwXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTMgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJocHQtaGVpZ2h0XCI+e2wuaGVpZ2h0X2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiaHB0LWhlaWdodFwiIG5hbWU9XCJoZWlnaHRcIiBwbGFjZWhvbGRlcj1cIntsLmhlaWdodF9vZl9ob3RzcG90fVwiIGRlZmF1bHR2YWx1ZT1cIjIwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaHB0LXRvcFwiPntsLnRvcH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiaHB0LXRvcFwiIG5hbWU9XCJ0b3BcIiBwbGFjZWhvbGRlcj1cIntsLnRvcF9vZl9ob3RzcG90fVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaHB0LWxlZnRcIj57bC5sZWZ0fTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJocHQtbGVmdFwiIG5hbWU9XCJsZWZ0XCIgcGxhY2Vob2xkZXI9XCJ7bC5sZWZ0X29mX2hvdHNwb3R9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiaHB0LXRpdGxlXCI+e2wudGl0bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiaHB0LXRpdGxlXCIgbmFtZT1cInRpdGxlXCIgcGxhY2Vob2xkZXI9XCJ7bC50aXRsZV9vZl9ob3RzcG90fVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiaHB0LW5hbWVcIj57bC5uYW1lX3RleHR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiaHB0LW5hbWVcIiBuYW1lPVwibmFtZVwiIHBsYWNlaG9sZGVyPVwie2wubmFtZV9vZl9ob3RzcG90fVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGhcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImhwdC10YXJnZXRpbWdcIj57bC50YXJnZXRfaW1nfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cImhwdC10YXJnZXRpbWdcIiBuYW1lPVwidGFyZ2V0aW1nXCIgcGxhY2Vob2xkZXI9XCJ7bC50YXJnZXRfaW1nX2hwdH1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwIG10LTQgcHQtc20gZm9ybS1jaGVjayBmb3JtLWNoZWNrLWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3ggaW5saW5lIG1hcmdpbi1ib3R0b20gZm9ybS1jaGVjay1pbnB1dFwiIGlkPVwiaHB0LXNob3d0YXJnZXRcIiBuYW1lPVwic2hvd3RhcmdldFwiIGRlZmF1bHR2YWx1ZT1cIjFcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIGZvcm0tY2hlY2stbGFiZWxcIiBmb3I9XCJocHQtc2hvd3RhcmdldFwiPntsLmhpZGVfdGFyZ2V0fTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIGlkPVwiaHB0LWlkXCIgbmFtZT1cImlkXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJob3RzcG90X2NsaWNrIGhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG14LTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMyBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImhwdF9jbGstd2lkdGhcIj57bC53aWR0aF9sYWJlbDF9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImhwdF9jbGstd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2NsaWNrfVwiIGRlZmF1bHR2YWx1ZT1cIjEwMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaHB0X2Nsay1oZWlnaHRcIj57bC5oZWlnaHRfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJocHRfY2xrLWhlaWdodFwiIG5hbWU9XCJoZWlnaHRcIiBwbGFjZWhvbGRlcj1cIntsLmhlaWdodF9vZl9jbGlja31cIiBkZWZhdWx0dmFsdWU9XCIzMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaHB0X2Nsay10b3BcIj57bC50b3B9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZCB2YWxpZGF0ZSBudW1iZXJfdmFsaWRhdGVcIiBpZD1cImhwdF9jbGstdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX2NsaWNrfVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0zIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiaHB0X2Nsay1sZWZ0XCI+e2wubGVmdH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiaHB0X2Nsay1sZWZ0XCIgbmFtZT1cImxlZnRcIiBwbGFjZWhvbGRlcj1cIntsLmxlZnRfb2ZfY2xpY2t9XCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cImhwdF9jbGstaWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRhYiBoXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBteC0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cInRhYi10aXRsZVwiPntsLnRpdGxlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWRcIiBpZD1cInRhYi10aXRsZVwiIG5hbWU9XCJ2YWx1ZVwiIHBsYWNlaG9sZGVyPVwie2wudGl0bGVfb2ZfdGFifVwiIGRlZmF1bHR2YWx1ZT1cIk5ld1wiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJ0YWItYWx0XCI+e2wuYWx0X3RleHR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwidGFiLWFsdFwiIG5hbWU9XCJhbHRcIiBwbGFjZWhvbGRlcj1cIntsLmFsdF9vZl9pbWFnZX1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwidGFiLWJnaW1nXCI+e2wuYmFja2dyb3VuZF9pbWFnZX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJ0YWItYmdpbWdcIiBuYW1lPVwiYmdpbWdcIiBwbGFjZWhvbGRlcj1cIntsLmJnX29mX3RhYn1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJ0YWJfdXBsb2FkX21lZGlhXCIgdGFyZ2V0PVwidGFiLWJnaW1nXCIgY2xhc3M9XCJidG4gYnRuLW91dGxpbmUtcHJpbWFyeSBmbG9hdC1zdGFydFwiPntsLnVwbG9hZF9tZWRpYV90ZXh0fTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xIG10LTQgcHQtc21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZm9ybS1jaGVjayBmb3JtLWNoZWNrLWlubGluZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3ggaW5saW5lIGZvcm0tY2hlY2staW5wdXQgbWFyZ2luLWJvdHRvbVwiIGlkPVwidGFiLWRpc3BsYXlcIiBuYW1lPVwiZGlzcGxheVwiIGRlZmF1bHR2YWx1ZT1cIjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBmb3JtLWNoZWNrLWxhYmVsXCIgZm9yPVwidGFiLWRpc3BsYXlcIj57bC5kaXNwbGF5fTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cInRhYi1pZFwiIG5hbWU9XCJpZFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGVwIGhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG14LTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0xMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwic3RlcC1iZ2ltZ1wiPntsLmJhY2tncm91bmRfaW1hZ2V9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwic3RlcC1iZ2ltZ1wiIG5hbWU9XCJiZ2ltZ1wiIHBsYWNlaG9sZGVyPVwie2wuYmdfb2Zfc3RlcH1cIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgaWQ9XCJzdGVwX3VwbG9hZF9tZWRpYVwiIHRhcmdldD1cInN0ZXAtYmdpbWdcIiBjbGFzcz1cImJ0biBidG4tb3V0bGluZS1wcmltYXJ5IGZsb2F0LXN0YXJ0XCI+e2wudXBsb2FkX21lZGlhX3RleHR9PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJzdGVwLWFsdFwiPntsLmltZ19hbHR9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwic3RlcC1hbHRcIiBuYW1lPVwiYWx0XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cCBmb3JtLWNoZWNrIGZvcm0tY2hlY2staW5saW5lXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3M9XCJjaGVja2JveCBpbmxpbmUgbWFyZ2luLWJvdHRvbSBmb3JtLWNoZWNrLWlucHV0XCIgaWQ9XCJzdGVwLWRpc3BsYXlcIiBuYW1lPVwiZGlzcGxheVwiIGRlZmF1bHR2YWx1ZT1cIjFcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBmb3JtLWNoZWNrLWxhYmVsXCIgZm9yPVwic3RlcC1kaXNwbGF5XCI+e2wuZGlzcGxheX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBpZD1cInN0ZXAtaWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhc2UgaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgbXgtMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS00IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiYmFzZS13aWR0aFwiPntsLndpZHRoX2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiYmFzZS13aWR0aFwiIG5hbWU9XCJ3aWR0aFwiIHBsYWNlaG9sZGVyPVwie2wud2lkdGhfb2ZfYmFzZX1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNCBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIG1lbmRhdG9yeV9sYWJlbFwiIGZvcj1cImJhc2UtaGVpZ2h0XCI+e2wuaGVpZ2h0X2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiYmFzZS1oZWlnaHRcIiBuYW1lPVwiaGVpZ2h0XCIgcGxhY2Vob2xkZXI9XCJ7bC5oZWlnaHRfb2ZfYmFzZX1cIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNCBweC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJjb250cm9sLWxhYmVsIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wXCIgZm9yPVwiYmFzZS1iZ2ltZy1hbHRcIj57bC5iZ19hbHRfdGV4dH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJiYXNlLWJnaW1nLWFsdFwiIG5hbWU9XCJhbHRcIiBwbGFjZWhvbGRlcj1cIntsLmFsdF90ZXh0X2Jhc2V9XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImJhc2UtYmdpbWdcIj57bC5iYWNrZ3JvdW5kX2ltYWdlfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgcmVhZG9ubHk9XCJyZWFkb25seVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJiYXNlLWJnaW1nXCIgbmFtZT1cImJnaW1nXCIgcGxhY2Vob2xkZXI9XCJ7bC5iZ19vZl9iYXNlfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tNiBtdC0zIHB0LTEgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBpZD1cInVwbG9hZF9tZWRpYVwiIGNsYXNzPVwiYnRuIGJ0bi1vdXRsaW5lLXByaW1hcnkgZmxvYXQtc3RhcnRcIj57bC51cGxvYWRfbWVkaWFfdGV4dH08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXAgZmxvYXQtc3RhcnQgbXQtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3ggaW5saW5lIG1hcmdpbi1ib3R0b20gbWwtMyBwb3NpdGlvbi1yZWxhdGl2ZSB0b3AyXCIgaWQ9XCJiYXNlLWJvcmRlcnJlcXVpcmVkXCIgbmFtZT1cImJvcmRlcnJlcXVpcmVkXCIgZGVmYXVsdHZhbHVlPVwiMVwiIGNoZWNrZWQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBtbC0xIGZvbnQtd2VpZ2h0LW5vcm1hbCBtYi0wIHBvc2l0aW9uLXJlbGF0aXZlIHRvcDFcIiBmb3I9XCJiYXNlLWJvcmRlcnJlcXVpcmVkXCI+e2wuYWRkX2JvcmRlcn08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImpzY3JpcHQgaFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJjb2RlXCIgbmFtZT1cImpzY3JpcHRcIiBzdHlsZT17e3dpZHRoOlwiMTAwJVwiLGhlaWdodDpcIjMwMHB4XCJ9fT48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hvaWNlbWF0cml4IGhcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IG14LTBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiY2hvaWNlbWF0cml4LXdpZHRoXCI+e2wud2lkdGhfbGFiZWwxfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJjaG9pY2VtYXRyaXgtd2lkdGhcIiBuYW1lPVwid2lkdGhcIiBwbGFjZWhvbGRlcj1cIntsLndpZHRoX29mX2NtfVwiIGRlZmF1bHR2YWx1ZT1cIjIwXCIvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJjaG9pY2VtYXRyaXgtaGVpZ2h0XCI+e2wuaGVpZ2h0X2xhYmVsMX08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kIHZhbGlkYXRlIG51bWJlcl92YWxpZGF0ZVwiIGlkPVwiY2hvaWNlbWF0cml4LWhlaWdodFwiIG5hbWU9XCJoZWlnaHRcIiBwbGFjZWhvbGRlcj1cIntsLmhlaWdodF9vZl9jbX1cIiBkZWZhdWx0dmFsdWU9XCIyMFwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMCBtZW5kYXRvcnlfbGFiZWxcIiBmb3I9XCJjaG9pY2VtYXRyaXgtdG9wXCI+e2wudG9wfTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJjaG9pY2VtYXRyaXgtdG9wXCIgbmFtZT1cInRvcFwiIHBsYWNlaG9sZGVyPVwie2wudG9wX29mX2NtfVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02IHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTAgbWVuZGF0b3J5X2xhYmVsXCIgZm9yPVwiY2hvaWNlbWF0cml4LWxlZnRcIj57bC5sZWZ0fTwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgdmFsaWRhdGUgbnVtYmVyX3ZhbGlkYXRlXCIgaWQ9XCJjaG9pY2VtYXRyaXgtbGVmdFwiIG5hbWU9XCJsZWZ0XCIgcGxhY2Vob2xkZXI9XCJ7bC5sZWZ0X29mX2NtfVwiLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTEyIHB4LTFcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJjaG9pY2VtYXRyaXgtbmFtZVwiPntsLm5hbWVfdGV4dH08L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2wgZm9ybS1jb250cm9sLW1kXCIgaWQ9XCJjaG9pY2VtYXRyaXgtbmFtZVwiIG5hbWU9XCJuYW1lXCIgcGxhY2Vob2xkZXI9XCJ7bC5uYW1lX29mX2NtfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImNob2ljZW1hdHJpeC1jb3JyZWN0YW5zXCI+e2wuY29ycmVjdF9hbnN3ZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiY2hvaWNlbWF0cml4LWNvcnJlY3RhbnNcIiBuYW1lPVwiY29ycmVjdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuY3J0X29mX2NtfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMTIgcHgtMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVwiY29udHJvbC1sYWJlbCBmb250LXdlaWdodC1ub3JtYWwgbWItMFwiIGZvcj1cImNob2ljZW1hdHJpeC1kZWZhdWx0YW5zXCI+e2wuZGVmYXVsdF9hbnN3ZXJ9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sIGZvcm0tY29udHJvbC1tZFwiIGlkPVwiY2hvaWNlbWF0cml4LWRlZmF1bHRhbnNcIiBuYW1lPVwiZGVmYXVsdGFuc1wiIHBsYWNlaG9sZGVyPVwie2wuZGVmX29mX2NtfVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgaWQ9XCJjaG9pY2VtYXRyaXgtaWRcIiBuYW1lPVwiaWRcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTYgcGwtMiBwci0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImNvbnRyb2wtbGFiZWwgZm9udC13ZWlnaHQtbm9ybWFsIG1iLTBcIiBmb3I9XCJjaG9pY2VtYXRyaXgtc3R5bGVcIj57bC5jc3Nfc3R5bGV9PC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJjaG9pY2VtYXRyaXgtc3R5bGVcIiBjbGFzcz1cImZvcm0tY29udHJvbCBmb3JtLWNvbnRyb2wtbWQgaGVpZ2h0XzM0XCIgbmFtZT1cInN0eWxlXCIgcGxhY2Vob2xkZXI9XCJ7bC5jc3Nfb2ZfY219XCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImV2XCIgdHlwZT1cInJkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1vZGFsRXZlbnQvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tbGlnaHRcIiBkYXRhLWJzLWRpc21pc3M9XCJtb2RhbFwiPntsLmNhbmNlbH08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGFkZEVsZW1lbnRcIiBkYXRhLWJzLWRpc21pc3M9XCJtb2RhbFwiPntsLm9rX2J0bn08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGVycm9yQnRuIGhcIj57bC5va19idG59PC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG5cclxuPHN0eWxlPlxyXG4gICAgLm1vZGFsX2hlaWdodCB7XHJcbiAgICAgICAgbWF4LWhlaWdodDogMzUwcHg7XHJcbiAgICB9XHJcbjwvc3R5bGU+Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXN3Q0ksYUFBYSxjQUFDLENBQUMsQUFDWCxVQUFVLENBQUUsS0FBSyxBQUNyQixDQUFDIn0= */";
	append_dev(document.head, style);
}

// (726:24) {#if isDNDExtended == 1}
function create_if_block$g(ctx) {
	let div2;
	let div0;
	let label;
	let t1;
	let textarea;
	let textarea_placeholder_value;
	let t2;
	let div1;
	let modalevent;
	let current;
	modalevent = new ModalEvent({ $$inline: true });

	const block = {
		c: function create() {
			div2 = element("div");
			div0 = element("div");
			label = element("label");
			label.textContent = `${Lang.css_style}`;
			t1 = space();
			textarea = element("textarea");
			t2 = space();
			div1 = element("div");
			create_component(modalevent.$$.fragment);
			attr_dev(label, "class", "control-label font-weight-normal mb-0");
			attr_dev(label, "for", "tbd-style");
			add_location(label, file$h, 728, 36, 55857);
			attr_dev(textarea, "id", "tbd-style");
			attr_dev(textarea, "class", "form-control form-control-md height_34");
			attr_dev(textarea, "name", "style");
			attr_dev(textarea, "placeholder", textarea_placeholder_value = Lang.css_style_of_tabhead);
			add_location(textarea, file$h, 729, 36, 55985);
			attr_dev(div0, "class", "form-group");
			add_location(div0, file$h, 727, 32, 55795);
			attr_dev(div1, "class", "ev");
			attr_dev(div1, "type", "tbd");
			add_location(div1, file$h, 731, 32, 56194);
			attr_dev(div2, "class", "col-sm-6 pr-1 pl-2");
			add_location(div2, file$h, 726, 28, 55729);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div2, anchor);
			append_dev(div2, div0);
			append_dev(div0, label);
			append_dev(div0, t1);
			append_dev(div0, textarea);
			append_dev(div2, t2);
			append_dev(div2, div1);
			mount_component(modalevent, div1, null);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(modalevent.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modalevent.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div2);
			destroy_component(modalevent);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$g.name,
		type: "if",
		source: "(726:24) {#if isDNDExtended == 1}",
		ctx
	});

	return block;
}

function create_fragment$h(ctx) {
	let div438;
	let div437;
	let div436;
	let div0;
	let h4;
	let t1;
	let button0;
	let t3;
	let div434;
	let div30;
	let div29;
	let div22;
	let div21;
	let div2;
	let div1;
	let label0;
	let t5;
	let input0;
	let input0_placeholder_value;
	let t6;
	let div4;
	let div3;
	let label1;
	let t8;
	let input1;
	let input1_placeholder_value;
	let t9;
	let div6;
	let div5;
	let label2;
	let t11;
	let input2;
	let input2_placeholder_value;
	let t12;
	let div8;
	let div7;
	let label3;
	let t14;
	let input3;
	let input3_placeholder_value;
	let t15;
	let div10;
	let div9;
	let label4;
	let t17;
	let input4;
	let input4_placeholder_value;
	let t18;
	let div12;
	let div11;
	let label5;
	let t20;
	let select0;
	let option0;
	let option1;
	let option2;
	let t24;
	let div14;
	let div13;
	let label6;
	let t26;
	let input5;
	let input5_placeholder_value;
	let t27;
	let div16;
	let div15;
	let label7;
	let t29;
	let input6;
	let input6_placeholder_value;
	let t30;
	let button1;
	let t32;
	let div18;
	let div17;
	let input7;
	let t33;
	let label8;
	let t35;
	let div20;
	let div19;
	let input8;
	let t36;
	let label9;
	let t38;
	let div28;
	let div27;
	let div24;
	let div23;
	let label10;
	let t40;
	let textarea0;
	let textarea0_placeholder_value;
	let t41;
	let div26;
	let div25;
	let label11;
	let t43;
	let input9;
	let input9_placeholder_value;
	let t44;
	let input10;
	let t45;
	let div60;
	let div59;
	let div55;
	let div35;
	let div32;
	let div31;
	let label12;
	let t47;
	let input11;
	let input11_placeholder_value;
	let t48;
	let div34;
	let div33;
	let label13;
	let t50;
	let input12;
	let input12_placeholder_value;
	let t51;
	let div40;
	let div37;
	let div36;
	let label14;
	let t53;
	let input13;
	let input13_placeholder_value;
	let t54;
	let div39;
	let div38;
	let label15;
	let t56;
	let input14;
	let input14_placeholder_value;
	let t57;
	let div45;
	let div42;
	let div41;
	let label16;
	let t59;
	let input15;
	let input15_placeholder_value;
	let t60;
	let div44;
	let div43;
	let label17;
	let t62;
	let select1;
	let option3;
	let option4;
	let option5;
	let t66;
	let div54;
	let div47;
	let div46;
	let label18;
	let t68;
	let input16;
	let input16_placeholder_value;
	let t69;
	let div49;
	let div48;
	let label19;
	let t71;
	let input17;
	let input17_placeholder_value;
	let t72;
	let div51;
	let div50;
	let label20;
	let t74;
	let input18;
	let input18_placeholder_value;
	let t75;
	let div53;
	let div52;
	let input19;
	let t76;
	let label21;
	let t78;
	let input20;
	let t79;
	let div58;
	let div56;
	let label22;
	let t81;
	let textarea1;
	let textarea1_placeholder_value;
	let t82;
	let div57;
	let modalevent0;
	let t83;
	let div92;
	let div91;
	let div86;
	let div65;
	let div62;
	let div61;
	let label23;
	let t85;
	let input21;
	let input21_placeholder_value;
	let t86;
	let div64;
	let div63;
	let label24;
	let t88;
	let input22;
	let input22_placeholder_value;
	let t89;
	let div70;
	let div67;
	let div66;
	let label25;
	let t91;
	let input23;
	let input23_placeholder_value;
	let t92;
	let div69;
	let div68;
	let label26;
	let t94;
	let input24;
	let input24_placeholder_value;
	let t95;
	let div85;
	let div72;
	let div71;
	let label27;
	let t97;
	let input25;
	let input25_placeholder_value;
	let t98;
	let div74;
	let div73;
	let label28;
	let t100;
	let input26;
	let input26_placeholder_value;
	let t101;
	let div76;
	let div75;
	let label29;
	let t103;
	let input27;
	let input27_placeholder_value;
	let t104;
	let div78;
	let div77;
	let label30;
	let t106;
	let select2;
	let option6;
	let option7;
	let t109;
	let div80;
	let div79;
	let label31;
	let t111;
	let select3;
	let option8;
	let option9;
	let t114;
	let div82;
	let div81;
	let input28;
	let t115;
	let label32;
	let t117;
	let div84;
	let div83;
	let input29;
	let t118;
	let label33;
	let t120;
	let input30;
	let t121;
	let div90;
	let div87;
	let label34;
	let t123;
	let textarea2;
	let textarea2_placeholder_value;
	let t124;
	let div88;
	let label35;
	let t126;
	let select4;
	let t127;
	let div89;
	let modalevent1;
	let t128;
	let div120;
	let div119;
	let div114;
	let div97;
	let div94;
	let div93;
	let label36;
	let t130;
	let input31;
	let input31_placeholder_value;
	let t131;
	let div96;
	let div95;
	let label37;
	let t133;
	let input32;
	let input32_placeholder_value;
	let t134;
	let div102;
	let div99;
	let div98;
	let label38;
	let t136;
	let input33;
	let input33_placeholder_value;
	let t137;
	let div101;
	let div100;
	let label39;
	let t139;
	let input34;
	let input34_placeholder_value;
	let t140;
	let div113;
	let div104;
	let div103;
	let label40;
	let t142;
	let textarea3;
	let textarea3_placeholder_value;
	let t143;
	let div106;
	let div105;
	let label41;
	let t145;
	let textarea4;
	let textarea4_placeholder_value;
	let t146;
	let div108;
	let div107;
	let label42;
	let t148;
	let input35;
	let input35_placeholder_value;
	let t149;
	let div110;
	let div109;
	let label43;
	let t151;
	let select5;
	let option10;
	let option11;
	let t154;
	let div112;
	let div111;
	let input36;
	let t155;
	let label44;
	let t157;
	let input37;
	let t158;
	let div118;
	let div115;
	let label45;
	let t160;
	let textarea5;
	let t161;
	let div116;
	let label46;
	let t163;
	let select6;
	let t164;
	let div117;
	let modalevent2;
	let t165;
	let div141;
	let div140;
	let div136;
	let div125;
	let div122;
	let div121;
	let label47;
	let t167;
	let input38;
	let t168;
	let div124;
	let div123;
	let label48;
	let t170;
	let input39;
	let input39_placeholder_value;
	let t171;
	let div130;
	let div127;
	let div126;
	let label49;
	let t173;
	let input40;
	let input40_placeholder_value;
	let t174;
	let div129;
	let div128;
	let label50;
	let t176;
	let input41;
	let input41_placeholder_value;
	let t177;
	let div135;
	let div132;
	let div131;
	let label51;
	let t179;
	let input42;
	let input42_placeholder_value;
	let t180;
	let div134;
	let div133;
	let label52;
	let t182;
	let input43;
	let input43_placeholder_value;
	let t183;
	let input44;
	let t184;
	let div139;
	let div137;
	let label53;
	let t186;
	let textarea6;
	let textarea6_placeholder_value;
	let t187;
	let div138;
	let modalevent3;
	let t188;
	let div166;
	let div165;
	let div161;
	let div146;
	let div143;
	let div142;
	let label54;
	let t190;
	let input45;
	let input45_placeholder_value;
	let t191;
	let div145;
	let div144;
	let label55;
	let t193;
	let input46;
	let input46_placeholder_value;
	let t194;
	let div151;
	let div148;
	let div147;
	let label56;
	let t196;
	let input47;
	let input47_placeholder_value;
	let t197;
	let div150;
	let div149;
	let label57;
	let t199;
	let input48;
	let input48_placeholder_value;
	let t200;
	let div160;
	let div153;
	let div152;
	let label58;
	let t202;
	let input49;
	let t203;
	let div155;
	let div154;
	let label59;
	let t205;
	let input50;
	let input50_placeholder_value;
	let t206;
	let div157;
	let div156;
	let label60;
	let t208;
	let input51;
	let input51_placeholder_value;
	let t209;
	let div159;
	let div158;
	let label61;
	let t211;
	let input52;
	let input52_placeholder_value;
	let t212;
	let input53;
	let t213;
	let div164;
	let div162;
	let label62;
	let t215;
	let textarea7;
	let textarea7_placeholder_value;
	let t216;
	let div163;
	let modalevent4;
	let t217;
	let div187;
	let div186;
	let div182;
	let div171;
	let div168;
	let div167;
	let label63;
	let t219;
	let input54;
	let input54_placeholder_value;
	let t220;
	let div170;
	let div169;
	let label64;
	let t222;
	let input55;
	let input55_placeholder_value;
	let t223;
	let div176;
	let div173;
	let div172;
	let label65;
	let t225;
	let input56;
	let input56_placeholder_value;
	let t226;
	let div175;
	let div174;
	let label66;
	let t228;
	let input57;
	let input57_placeholder_value;
	let t229;
	let div181;
	let div178;
	let div177;
	let label67;
	let t231;
	let input58;
	let input58_placeholder_value;
	let t232;
	let div180;
	let div179;
	let label68;
	let t234;
	let input59;
	let input59_placeholder_value;
	let t235;
	let input60;
	let t236;
	let div185;
	let div183;
	let label69;
	let t238;
	let textarea8;
	let textarea8_placeholder_value;
	let t239;
	let div184;
	let modalevent5;
	let t240;
	let div206;
	let div205;
	let div201;
	let div192;
	let div189;
	let div188;
	let label70;
	let t242;
	let input61;
	let input61_placeholder_value;
	let t243;
	let div191;
	let div190;
	let label71;
	let t245;
	let input62;
	let input62_placeholder_value;
	let t246;
	let div197;
	let div194;
	let div193;
	let label72;
	let t248;
	let input63;
	let input63_placeholder_value;
	let t249;
	let div196;
	let div195;
	let label73;
	let t251;
	let input64;
	let input64_placeholder_value;
	let t252;
	let div200;
	let div199;
	let div198;
	let label74;
	let t254;
	let textarea9;
	let textarea9_placeholder_value;
	let t255;
	let input65;
	let t256;
	let div204;
	let div202;
	let label75;
	let t258;
	let textarea10;
	let textarea10_placeholder_value;
	let t259;
	let div203;
	let modalevent6;
	let t260;
	let div227;
	let div226;
	let div222;
	let div211;
	let div208;
	let div207;
	let label76;
	let t262;
	let input66;
	let input66_placeholder_value;
	let t263;
	let div210;
	let div209;
	let label77;
	let t265;
	let input67;
	let input67_placeholder_value;
	let t266;
	let div216;
	let div213;
	let div212;
	let label78;
	let t268;
	let input68;
	let input68_placeholder_value;
	let t269;
	let div215;
	let div214;
	let label79;
	let t271;
	let input69;
	let input69_placeholder_value;
	let t272;
	let div221;
	let div218;
	let div217;
	let label80;
	let t274;
	let textarea11;
	let textarea11_placeholder_value;
	let t275;
	let div220;
	let div219;
	let input70;
	let t276;
	let label81;
	let t278;
	let input71;
	let t279;
	let input72;
	let t280;
	let div225;
	let div223;
	let label82;
	let t282;
	let textarea12;
	let textarea12_placeholder_value;
	let t283;
	let div224;
	let modalevent7;
	let t284;
	let div245;
	let div244;
	let div243;
	let div232;
	let div229;
	let div228;
	let label83;
	let t286;
	let input73;
	let input73_placeholder_value;
	let t287;
	let div231;
	let div230;
	let label84;
	let t289;
	let input74;
	let input74_placeholder_value;
	let t290;
	let div237;
	let div234;
	let div233;
	let label85;
	let t292;
	let input75;
	let input75_placeholder_value;
	let t293;
	let div236;
	let div235;
	let label86;
	let t295;
	let input76;
	let input76_placeholder_value;
	let t296;
	let div242;
	let div239;
	let div238;
	let label87;
	let t298;
	let input77;
	let input77_placeholder_value;
	let t299;
	let div241;
	let div240;
	let label88;
	let t301;
	let input78;
	let input78_placeholder_value;
	let t302;
	let input79;
	let div243_class_value;
	let t303;
	let t304;
	let div266;
	let div265;
	let div261;
	let div250;
	let div247;
	let div246;
	let label89;
	let t306;
	let input80;
	let input80_placeholder_value;
	let t307;
	let div249;
	let div248;
	let label90;
	let t309;
	let input81;
	let input81_placeholder_value;
	let t310;
	let div255;
	let div252;
	let div251;
	let label91;
	let t312;
	let input82;
	let input82_placeholder_value;
	let t313;
	let div254;
	let div253;
	let label92;
	let t315;
	let input83;
	let input83_placeholder_value;
	let t316;
	let div260;
	let div257;
	let div256;
	let label93;
	let t318;
	let input84;
	let input84_placeholder_value;
	let t319;
	let div259;
	let div258;
	let label94;
	let t321;
	let input85;
	let input85_placeholder_value;
	let t322;
	let input86;
	let t323;
	let div264;
	let div262;
	let label95;
	let t325;
	let textarea13;
	let textarea13_placeholder_value;
	let t326;
	let div263;
	let modalevent8;
	let t327;
	let div294;
	let div293;
	let div288;
	let div287;
	let div268;
	let div267;
	let label96;
	let t329;
	let input87;
	let input87_placeholder_value;
	let t330;
	let div270;
	let div269;
	let label97;
	let t332;
	let input88;
	let input88_placeholder_value;
	let t333;
	let div272;
	let div271;
	let label98;
	let t335;
	let input89;
	let input89_placeholder_value;
	let t336;
	let div274;
	let div273;
	let label99;
	let t338;
	let input90;
	let input90_placeholder_value;
	let t339;
	let div276;
	let div275;
	let label100;
	let t341;
	let input91;
	let input91_placeholder_value;
	let t342;
	let div278;
	let div277;
	let label101;
	let t344;
	let select7;
	let option12;
	let option13;
	let option14;
	let option15;
	let option16;
	let option17;
	let t351;
	let div280;
	let div279;
	let label102;
	let t353;
	let select8;
	let option18;
	let option19;
	let option20;
	let option21;
	let option22;
	let t359;
	let div282;
	let div281;
	let label103;
	let t361;
	let select9;
	let option23;
	let option24;
	let option25;
	let option26;
	let t366;
	let input92;
	let t367;
	let div284;
	let div283;
	let label104;
	let t369;
	let select10;
	let t370;
	let div286;
	let div285;
	let input93;
	let t371;
	let label105;
	let t373;
	let div292;
	let div291;
	let div290;
	let div289;
	let modalevent9;
	let t374;
	let div315;
	let div314;
	let div312;
	let div303;
	let div296;
	let div295;
	let label106;
	let t376;
	let input94;
	let input94_placeholder_value;
	let t377;
	let div298;
	let div297;
	let label107;
	let t379;
	let input95;
	let input95_placeholder_value;
	let t380;
	let div300;
	let div299;
	let label108;
	let t382;
	let input96;
	let input96_placeholder_value;
	let t383;
	let div302;
	let div301;
	let label109;
	let t385;
	let input97;
	let input97_placeholder_value;
	let t386;
	let div308;
	let div305;
	let div304;
	let label110;
	let t388;
	let input98;
	let input98_placeholder_value;
	let t389;
	let div307;
	let div306;
	let label111;
	let t391;
	let input99;
	let input99_placeholder_value;
	let t392;
	let div311;
	let div310;
	let div309;
	let label112;
	let t394;
	let input100;
	let input100_placeholder_value;
	let t395;
	let input101;
	let t396;
	let div313;
	let t397;
	let div336;
	let div335;
	let div333;
	let div324;
	let div317;
	let div316;
	let label113;
	let t399;
	let input102;
	let input102_placeholder_value;
	let t400;
	let div319;
	let div318;
	let label114;
	let t402;
	let input103;
	let input103_placeholder_value;
	let t403;
	let div321;
	let div320;
	let label115;
	let t405;
	let input104;
	let input104_placeholder_value;
	let t406;
	let div323;
	let div322;
	let label116;
	let t408;
	let input105;
	let input105_placeholder_value;
	let t409;
	let div329;
	let div326;
	let div325;
	let label117;
	let t411;
	let input106;
	let input106_placeholder_value;
	let t412;
	let div328;
	let div327;
	let label118;
	let t414;
	let input107;
	let input107_placeholder_value;
	let t415;
	let div332;
	let div331;
	let div330;
	let label119;
	let t417;
	let input108;
	let input108_placeholder_value;
	let t418;
	let input109;
	let t419;
	let div334;
	let t420;
	let div358;
	let div357;
	let div356;
	let div345;
	let div338;
	let div337;
	let label120;
	let t422;
	let input110;
	let input110_placeholder_value;
	let t423;
	let div340;
	let div339;
	let label121;
	let t425;
	let input111;
	let input111_placeholder_value;
	let t426;
	let div342;
	let div341;
	let label122;
	let t428;
	let input112;
	let input112_placeholder_value;
	let t429;
	let div344;
	let div343;
	let label123;
	let t431;
	let input113;
	let input113_placeholder_value;
	let t432;
	let div350;
	let div347;
	let div346;
	let label124;
	let t434;
	let input114;
	let input114_placeholder_value;
	let t435;
	let div349;
	let div348;
	let label125;
	let t437;
	let input115;
	let input115_placeholder_value;
	let t438;
	let div355;
	let div352;
	let div351;
	let label126;
	let t440;
	let input116;
	let input116_placeholder_value;
	let t441;
	let div354;
	let div353;
	let input117;
	let t442;
	let label127;
	let t444;
	let input118;
	let t445;
	let div370;
	let div369;
	let div368;
	let div367;
	let div360;
	let div359;
	let label128;
	let t447;
	let input119;
	let input119_placeholder_value;
	let t448;
	let div362;
	let div361;
	let label129;
	let t450;
	let input120;
	let input120_placeholder_value;
	let t451;
	let div364;
	let div363;
	let label130;
	let t453;
	let input121;
	let input121_placeholder_value;
	let t454;
	let div366;
	let div365;
	let label131;
	let t456;
	let input122;
	let input122_placeholder_value;
	let t457;
	let input123;
	let t458;
	let div383;
	let div382;
	let div381;
	let div375;
	let div372;
	let div371;
	let label132;
	let t460;
	let input124;
	let input124_placeholder_value;
	let t461;
	let div374;
	let div373;
	let label133;
	let t463;
	let input125;
	let input125_placeholder_value;
	let t464;
	let div380;
	let div377;
	let div376;
	let label134;
	let t466;
	let input126;
	let input126_placeholder_value;
	let t467;
	let button2;
	let t469;
	let div379;
	let div378;
	let input127;
	let t470;
	let label135;
	let t472;
	let input128;
	let t473;
	let div394;
	let div393;
	let div392;
	let div388;
	let div385;
	let div384;
	let label136;
	let t475;
	let input129;
	let input129_placeholder_value;
	let t476;
	let button3;
	let t478;
	let div387;
	let div386;
	let label137;
	let t480;
	let input130;
	let t481;
	let div391;
	let div390;
	let div389;
	let input131;
	let t482;
	let label138;
	let t484;
	let input132;
	let t485;
	let div409;
	let div408;
	let div407;
	let div401;
	let div396;
	let div395;
	let label139;
	let t487;
	let input133;
	let input133_placeholder_value;
	let t488;
	let div398;
	let div397;
	let label140;
	let t490;
	let input134;
	let input134_placeholder_value;
	let t491;
	let div400;
	let div399;
	let label141;
	let t493;
	let input135;
	let input135_placeholder_value;
	let t494;
	let div406;
	let div403;
	let div402;
	let label142;
	let t496;
	let input136;
	let input136_placeholder_value;
	let t497;
	let div405;
	let button4;
	let t499;
	let div404;
	let input137;
	let t500;
	let label143;
	let t502;
	let div410;
	let textarea14;
	let textarea14_style_value;
	let t503;
	let div433;
	let div432;
	let div428;
	let div415;
	let div412;
	let div411;
	let label144;
	let t505;
	let input138;
	let input138_placeholder_value;
	let t506;
	let div414;
	let div413;
	let label145;
	let t508;
	let input139;
	let input139_placeholder_value;
	let t509;
	let div420;
	let div417;
	let div416;
	let label146;
	let t511;
	let input140;
	let input140_placeholder_value;
	let t512;
	let div419;
	let div418;
	let label147;
	let t514;
	let input141;
	let input141_placeholder_value;
	let t515;
	let div427;
	let div422;
	let div421;
	let label148;
	let t517;
	let input142;
	let input142_placeholder_value;
	let t518;
	let div424;
	let div423;
	let label149;
	let t520;
	let input143;
	let input143_placeholder_value;
	let t521;
	let div426;
	let div425;
	let label150;
	let t523;
	let input144;
	let input144_placeholder_value;
	let t524;
	let input145;
	let t525;
	let div431;
	let div429;
	let label151;
	let t527;
	let textarea15;
	let textarea15_placeholder_value;
	let t528;
	let div430;
	let modalevent10;
	let t529;
	let div435;
	let button5;
	let t531;
	let button6;
	let t533;
	let button7;
	let current;
	modalevent0 = new ModalEvent({ $$inline: true });
	modalevent1 = new ModalEvent({ $$inline: true });
	modalevent2 = new ModalEvent({ $$inline: true });
	modalevent3 = new ModalEvent({ $$inline: true });
	modalevent4 = new ModalEvent({ $$inline: true });
	modalevent5 = new ModalEvent({ $$inline: true });
	modalevent6 = new ModalEvent({ $$inline: true });
	modalevent7 = new ModalEvent({ $$inline: true });
	let if_block = /*isDNDExtended*/ ctx[0] == 1 && create_if_block$g(ctx);
	modalevent8 = new ModalEvent({ $$inline: true });
	modalevent9 = new ModalEvent({ $$inline: true });
	modalevent10 = new ModalEvent({ $$inline: true });

	const block = {
		c: function create() {
			div438 = element("div");
			div437 = element("div");
			div436 = element("div");
			div0 = element("div");
			h4 = element("h4");
			h4.textContent = `${Lang.draggable}`;
			t1 = space();
			button0 = element("button");
			button0.textContent = "×";
			t3 = space();
			div434 = element("div");
			div30 = element("div");
			div29 = element("div");
			div22 = element("div");
			div21 = element("div");
			div2 = element("div");
			div1 = element("div");
			label0 = element("label");
			label0.textContent = `${Lang.width_label1}`;
			t5 = space();
			input0 = element("input");
			t6 = space();
			div4 = element("div");
			div3 = element("div");
			label1 = element("label");
			label1.textContent = `${Lang.height_label1}`;
			t8 = space();
			input1 = element("input");
			t9 = space();
			div6 = element("div");
			div5 = element("div");
			label2 = element("label");
			label2.textContent = `${Lang.top}`;
			t11 = space();
			input2 = element("input");
			t12 = space();
			div8 = element("div");
			div7 = element("div");
			label3 = element("label");
			label3.textContent = `${Lang.left}`;
			t14 = space();
			input3 = element("input");
			t15 = space();
			div10 = element("div");
			div9 = element("div");
			label4 = element("label");
			label4.textContent = `${Lang.title}`;
			t17 = space();
			input4 = element("input");
			t18 = space();
			div12 = element("div");
			div11 = element("div");
			label5 = element("label");
			label5.textContent = `${Lang.border_color}`;
			t20 = space();
			select0 = element("select");
			option0 = element("option");
			option0.textContent = `${Lang.none}`;
			option1 = element("option");
			option1.textContent = `${Lang.black}`;
			option2 = element("option");
			option2.textContent = `${Lang.gray}`;
			t24 = space();
			div14 = element("div");
			div13 = element("div");
			label6 = element("label");
			label6.textContent = `${Lang.grp_name}`;
			t26 = space();
			input5 = element("input");
			t27 = space();
			div16 = element("div");
			div15 = element("div");
			label7 = element("label");
			label7.textContent = `${Lang.background_image}`;
			t29 = space();
			input6 = element("input");
			t30 = space();
			button1 = element("button");
			button1.textContent = `${Lang.upload_media_text}`;
			t32 = space();
			div18 = element("div");
			div17 = element("div");
			input7 = element("input");
			t33 = space();
			label8 = element("label");
			label8.textContent = `${Lang.multiple_drag}`;
			t35 = space();
			div20 = element("div");
			div19 = element("div");
			input8 = element("input");
			t36 = space();
			label9 = element("label");
			label9.textContent = `${Lang.invisible}`;
			t38 = space();
			div28 = element("div");
			div27 = element("div");
			div24 = element("div");
			div23 = element("div");
			label10 = element("label");
			label10.textContent = `${Lang.css_style}`;
			t40 = space();
			textarea0 = element("textarea");
			t41 = space();
			div26 = element("div");
			div25 = element("div");
			label11 = element("label");
			label11.textContent = `${Lang.detail}`;
			t43 = space();
			input9 = element("input");
			t44 = space();
			input10 = element("input");
			t45 = space();
			div60 = element("div");
			div59 = element("div");
			div55 = element("div");
			div35 = element("div");
			div32 = element("div");
			div31 = element("div");
			label12 = element("label");
			label12.textContent = `${Lang.width_label1}`;
			t47 = space();
			input11 = element("input");
			t48 = space();
			div34 = element("div");
			div33 = element("div");
			label13 = element("label");
			label13.textContent = `${Lang.height_label1}`;
			t50 = space();
			input12 = element("input");
			t51 = space();
			div40 = element("div");
			div37 = element("div");
			div36 = element("div");
			label14 = element("label");
			label14.textContent = `${Lang.top}`;
			t53 = space();
			input13 = element("input");
			t54 = space();
			div39 = element("div");
			div38 = element("div");
			label15 = element("label");
			label15.textContent = `${Lang.left}`;
			t56 = space();
			input14 = element("input");
			t57 = space();
			div45 = element("div");
			div42 = element("div");
			div41 = element("div");
			label16 = element("label");
			label16.textContent = `${Lang.title}`;
			t59 = space();
			input15 = element("input");
			t60 = space();
			div44 = element("div");
			div43 = element("div");
			label17 = element("label");
			label17.textContent = `${Lang.border_color}`;
			t62 = space();
			select1 = element("select");
			option3 = element("option");
			option3.textContent = `${Lang.none}`;
			option4 = element("option");
			option4.textContent = `${Lang.black}`;
			option5 = element("option");
			option5.textContent = `${Lang.gray}`;
			t66 = space();
			div54 = element("div");
			div47 = element("div");
			div46 = element("div");
			label18 = element("label");
			label18.textContent = `${Lang.grp_name}`;
			t68 = space();
			input16 = element("input");
			t69 = space();
			div49 = element("div");
			div48 = element("div");
			label19 = element("label");
			label19.textContent = `${Lang.correct_answer}`;
			t71 = space();
			input17 = element("input");
			t72 = space();
			div51 = element("div");
			div50 = element("div");
			label20 = element("label");
			label20.textContent = `${Lang.default_answer}`;
			t74 = space();
			input18 = element("input");
			t75 = space();
			div53 = element("div");
			div52 = element("div");
			input19 = element("input");
			t76 = space();
			label21 = element("label");
			label21.textContent = `${Lang.invisible}`;
			t78 = space();
			input20 = element("input");
			t79 = space();
			div58 = element("div");
			div56 = element("div");
			label22 = element("label");
			label22.textContent = `${Lang.css_style}`;
			t81 = space();
			textarea1 = element("textarea");
			t82 = space();
			div57 = element("div");
			create_component(modalevent0.$$.fragment);
			t83 = space();
			div92 = element("div");
			div91 = element("div");
			div86 = element("div");
			div65 = element("div");
			div62 = element("div");
			div61 = element("div");
			label23 = element("label");
			label23.textContent = `${Lang.width_label1}`;
			t85 = space();
			input21 = element("input");
			t86 = space();
			div64 = element("div");
			div63 = element("div");
			label24 = element("label");
			label24.textContent = `${Lang.height_label1}`;
			t88 = space();
			input22 = element("input");
			t89 = space();
			div70 = element("div");
			div67 = element("div");
			div66 = element("div");
			label25 = element("label");
			label25.textContent = `${Lang.top}`;
			t91 = space();
			input23 = element("input");
			t92 = space();
			div69 = element("div");
			div68 = element("div");
			label26 = element("label");
			label26.textContent = `${Lang.left}`;
			t94 = space();
			input24 = element("input");
			t95 = space();
			div85 = element("div");
			div72 = element("div");
			div71 = element("div");
			label27 = element("label");
			label27.textContent = `${Lang.correct_answer}`;
			t97 = space();
			input25 = element("input");
			t98 = space();
			div74 = element("div");
			div73 = element("div");
			label28 = element("label");
			label28.textContent = `${Lang.default_answer}`;
			t100 = space();
			input26 = element("input");
			t101 = space();
			div76 = element("div");
			div75 = element("div");
			label29 = element("label");
			label29.textContent = `${Lang.placeholder}`;
			t103 = space();
			input27 = element("input");
			t104 = space();
			div78 = element("div");
			div77 = element("div");
			label30 = element("label");
			label30.textContent = `${Lang.type}`;
			t106 = space();
			select2 = element("select");
			option6 = element("option");
			option6.textContent = `${Lang.text_box}`;
			option7 = element("option");
			option7.textContent = `${Lang.password}`;
			t109 = space();
			div80 = element("div");
			div79 = element("div");
			label31 = element("label");
			label31.textContent = `${Lang.parser}`;
			t111 = space();
			select3 = element("select");
			option8 = element("option");
			option8.textContent = `${Lang.parser_of_txt}`;
			option9 = element("option");
			option9.textContent = `${Lang.sql}`;
			t114 = space();
			div82 = element("div");
			div81 = element("div");
			input28 = element("input");
			t115 = space();
			label32 = element("label");
			label32.textContent = `${Lang.case_insensitive}`;
			t117 = space();
			div84 = element("div");
			div83 = element("div");
			input29 = element("input");
			t118 = space();
			label33 = element("label");
			label33.textContent = "Multiple Correct Answers";
			t120 = space();
			input30 = element("input");
			t121 = space();
			div90 = element("div");
			div87 = element("div");
			label34 = element("label");
			label34.textContent = `${Lang.css_style}`;
			t123 = space();
			textarea2 = element("textarea");
			t124 = space();
			div88 = element("div");
			label35 = element("label");
			label35.textContent = `${Lang.font_style}`;
			t126 = space();
			select4 = element("select");
			t127 = space();
			div89 = element("div");
			create_component(modalevent1.$$.fragment);
			t128 = space();
			div120 = element("div");
			div119 = element("div");
			div114 = element("div");
			div97 = element("div");
			div94 = element("div");
			div93 = element("div");
			label36 = element("label");
			label36.textContent = `${Lang.width_label1}`;
			t130 = space();
			input31 = element("input");
			t131 = space();
			div96 = element("div");
			div95 = element("div");
			label37 = element("label");
			label37.textContent = `${Lang.height_label1}`;
			t133 = space();
			input32 = element("input");
			t134 = space();
			div102 = element("div");
			div99 = element("div");
			div98 = element("div");
			label38 = element("label");
			label38.textContent = `${Lang.top}`;
			t136 = space();
			input33 = element("input");
			t137 = space();
			div101 = element("div");
			div100 = element("div");
			label39 = element("label");
			label39.textContent = `${Lang.left}`;
			t139 = space();
			input34 = element("input");
			t140 = space();
			div113 = element("div");
			div104 = element("div");
			div103 = element("div");
			label40 = element("label");
			label40.textContent = `${Lang.correct_answer}`;
			t142 = space();
			textarea3 = element("textarea");
			t143 = space();
			div106 = element("div");
			div105 = element("div");
			label41 = element("label");
			label41.textContent = `${Lang.default_answer}`;
			t145 = space();
			textarea4 = element("textarea");
			t146 = space();
			div108 = element("div");
			div107 = element("div");
			label42 = element("label");
			label42.textContent = `${Lang.placeholder}`;
			t148 = space();
			input35 = element("input");
			t149 = space();
			div110 = element("div");
			div109 = element("div");
			label43 = element("label");
			label43.textContent = `${Lang.parser}`;
			t151 = space();
			select5 = element("select");
			option10 = element("option");
			option10.textContent = `${Lang.parser_of_multiline}`;
			option11 = element("option");
			option11.textContent = `${Lang.sql}`;
			t154 = space();
			div112 = element("div");
			div111 = element("div");
			input36 = element("input");
			t155 = space();
			label44 = element("label");
			label44.textContent = `${Lang.case_insensitive}`;
			t157 = space();
			input37 = element("input");
			t158 = space();
			div118 = element("div");
			div115 = element("div");
			label45 = element("label");
			label45.textContent = `${Lang.css_style}`;
			t160 = space();
			textarea5 = element("textarea");
			t161 = space();
			div116 = element("div");
			label46 = element("label");
			label46.textContent = `${Lang.css_class}`;
			t163 = space();
			select6 = element("select");
			t164 = space();
			div117 = element("div");
			create_component(modalevent2.$$.fragment);
			t165 = space();
			div141 = element("div");
			div140 = element("div");
			div136 = element("div");
			div125 = element("div");
			div122 = element("div");
			div121 = element("div");
			label47 = element("label");
			label47.textContent = `${Lang.width_label1}`;
			t167 = space();
			input38 = element("input");
			t168 = space();
			div124 = element("div");
			div123 = element("div");
			label48 = element("label");
			label48.textContent = `${Lang.height_label1}`;
			t170 = space();
			input39 = element("input");
			t171 = space();
			div130 = element("div");
			div127 = element("div");
			div126 = element("div");
			label49 = element("label");
			label49.textContent = `${Lang.top}`;
			t173 = space();
			input40 = element("input");
			t174 = space();
			div129 = element("div");
			div128 = element("div");
			label50 = element("label");
			label50.textContent = `${Lang.left}`;
			t176 = space();
			input41 = element("input");
			t177 = space();
			div135 = element("div");
			div132 = element("div");
			div131 = element("div");
			label51 = element("label");
			label51.textContent = `${Lang.correct_answer}`;
			t179 = space();
			input42 = element("input");
			t180 = space();
			div134 = element("div");
			div133 = element("div");
			label52 = element("label");
			label52.textContent = `${Lang.default_answer}`;
			t182 = space();
			input43 = element("input");
			t183 = space();
			input44 = element("input");
			t184 = space();
			div139 = element("div");
			div137 = element("div");
			label53 = element("label");
			label53.textContent = `${Lang.css_style}`;
			t186 = space();
			textarea6 = element("textarea");
			t187 = space();
			div138 = element("div");
			create_component(modalevent3.$$.fragment);
			t188 = space();
			div166 = element("div");
			div165 = element("div");
			div161 = element("div");
			div146 = element("div");
			div143 = element("div");
			div142 = element("div");
			label54 = element("label");
			label54.textContent = `${Lang.width_label1}`;
			t190 = space();
			input45 = element("input");
			t191 = space();
			div145 = element("div");
			div144 = element("div");
			label55 = element("label");
			label55.textContent = `${Lang.height_label1}`;
			t193 = space();
			input46 = element("input");
			t194 = space();
			div151 = element("div");
			div148 = element("div");
			div147 = element("div");
			label56 = element("label");
			label56.textContent = `${Lang.top}`;
			t196 = space();
			input47 = element("input");
			t197 = space();
			div150 = element("div");
			div149 = element("div");
			label57 = element("label");
			label57.textContent = `${Lang.left}`;
			t199 = space();
			input48 = element("input");
			t200 = space();
			div160 = element("div");
			div153 = element("div");
			div152 = element("div");
			label58 = element("label");
			label58.textContent = `${Lang.name_text}`;
			t202 = space();
			input49 = element("input");
			t203 = space();
			div155 = element("div");
			div154 = element("div");
			label59 = element("label");
			label59.textContent = `${Lang.correct_answer}`;
			t205 = space();
			input50 = element("input");
			t206 = space();
			div157 = element("div");
			div156 = element("div");
			label60 = element("label");
			label60.textContent = `${Lang.default_answer}`;
			t208 = space();
			input51 = element("input");
			t209 = space();
			div159 = element("div");
			div158 = element("div");
			label61 = element("label");
			label61.textContent = `${Lang.chk_type}`;
			t211 = space();
			input52 = element("input");
			t212 = space();
			input53 = element("input");
			t213 = space();
			div164 = element("div");
			div162 = element("div");
			label62 = element("label");
			label62.textContent = `${Lang.css_style}`;
			t215 = space();
			textarea7 = element("textarea");
			t216 = space();
			div163 = element("div");
			create_component(modalevent4.$$.fragment);
			t217 = space();
			div187 = element("div");
			div186 = element("div");
			div182 = element("div");
			div171 = element("div");
			div168 = element("div");
			div167 = element("div");
			label63 = element("label");
			label63.textContent = `${Lang.width_label1}`;
			t219 = space();
			input54 = element("input");
			t220 = space();
			div170 = element("div");
			div169 = element("div");
			label64 = element("label");
			label64.textContent = `${Lang.height_label1}`;
			t222 = space();
			input55 = element("input");
			t223 = space();
			div176 = element("div");
			div173 = element("div");
			div172 = element("div");
			label65 = element("label");
			label65.textContent = `${Lang.top}`;
			t225 = space();
			input56 = element("input");
			t226 = space();
			div175 = element("div");
			div174 = element("div");
			label66 = element("label");
			label66.textContent = `${Lang.left}`;
			t228 = space();
			input57 = element("input");
			t229 = space();
			div181 = element("div");
			div178 = element("div");
			div177 = element("div");
			label67 = element("label");
			label67.textContent = "Value";
			t231 = space();
			input58 = element("input");
			t232 = space();
			div180 = element("div");
			div179 = element("div");
			label68 = element("label");
			label68.textContent = `${Lang.class}`;
			t234 = space();
			input59 = element("input");
			t235 = space();
			input60 = element("input");
			t236 = space();
			div185 = element("div");
			div183 = element("div");
			label69 = element("label");
			label69.textContent = `${Lang.css_style}`;
			t238 = space();
			textarea8 = element("textarea");
			t239 = space();
			div184 = element("div");
			create_component(modalevent5.$$.fragment);
			t240 = space();
			div206 = element("div");
			div205 = element("div");
			div201 = element("div");
			div192 = element("div");
			div189 = element("div");
			div188 = element("div");
			label70 = element("label");
			label70.textContent = `${Lang.width_label1}`;
			t242 = space();
			input61 = element("input");
			t243 = space();
			div191 = element("div");
			div190 = element("div");
			label71 = element("label");
			label71.textContent = `${Lang.height_label1}`;
			t245 = space();
			input62 = element("input");
			t246 = space();
			div197 = element("div");
			div194 = element("div");
			div193 = element("div");
			label72 = element("label");
			label72.textContent = `${Lang.top}`;
			t248 = space();
			input63 = element("input");
			t249 = space();
			div196 = element("div");
			div195 = element("div");
			label73 = element("label");
			label73.textContent = `${Lang.left}`;
			t251 = space();
			input64 = element("input");
			t252 = space();
			div200 = element("div");
			div199 = element("div");
			div198 = element("div");
			label74 = element("label");
			label74.textContent = `${Lang.options}`;
			t254 = space();
			textarea9 = element("textarea");
			t255 = space();
			input65 = element("input");
			t256 = space();
			div204 = element("div");
			div202 = element("div");
			label75 = element("label");
			label75.textContent = `${Lang.css_style}`;
			t258 = space();
			textarea10 = element("textarea");
			t259 = space();
			div203 = element("div");
			create_component(modalevent6.$$.fragment);
			t260 = space();
			div227 = element("div");
			div226 = element("div");
			div222 = element("div");
			div211 = element("div");
			div208 = element("div");
			div207 = element("div");
			label76 = element("label");
			label76.textContent = `${Lang.width_label1}`;
			t262 = space();
			input66 = element("input");
			t263 = space();
			div210 = element("div");
			div209 = element("div");
			label77 = element("label");
			label77.textContent = `${Lang.height_label1}`;
			t265 = space();
			input67 = element("input");
			t266 = space();
			div216 = element("div");
			div213 = element("div");
			div212 = element("div");
			label78 = element("label");
			label78.textContent = `${Lang.top}`;
			t268 = space();
			input68 = element("input");
			t269 = space();
			div215 = element("div");
			div214 = element("div");
			label79 = element("label");
			label79.textContent = `${Lang.left}`;
			t271 = space();
			input69 = element("input");
			t272 = space();
			div221 = element("div");
			div218 = element("div");
			div217 = element("div");
			label80 = element("label");
			label80.textContent = `${Lang.options}`;
			t274 = space();
			textarea11 = element("textarea");
			t275 = space();
			div220 = element("div");
			div219 = element("div");
			input70 = element("input");
			t276 = space();
			label81 = element("label");
			label81.textContent = `${Lang.select_multiple}`;
			t278 = space();
			input71 = element("input");
			t279 = space();
			input72 = element("input");
			t280 = space();
			div225 = element("div");
			div223 = element("div");
			label82 = element("label");
			label82.textContent = `${Lang.css_style}`;
			t282 = space();
			textarea12 = element("textarea");
			t283 = space();
			div224 = element("div");
			create_component(modalevent7.$$.fragment);
			t284 = space();
			div245 = element("div");
			div244 = element("div");
			div243 = element("div");
			div232 = element("div");
			div229 = element("div");
			div228 = element("div");
			label83 = element("label");
			label83.textContent = `${Lang.width_label1}`;
			t286 = space();
			input73 = element("input");
			t287 = space();
			div231 = element("div");
			div230 = element("div");
			label84 = element("label");
			label84.textContent = `${Lang.height_label1}`;
			t289 = space();
			input74 = element("input");
			t290 = space();
			div237 = element("div");
			div234 = element("div");
			div233 = element("div");
			label85 = element("label");
			label85.textContent = `${Lang.top}`;
			t292 = space();
			input75 = element("input");
			t293 = space();
			div236 = element("div");
			div235 = element("div");
			label86 = element("label");
			label86.textContent = `${Lang.left}`;
			t295 = space();
			input76 = element("input");
			t296 = space();
			div242 = element("div");
			div239 = element("div");
			div238 = element("div");
			label87 = element("label");
			label87.textContent = `${Lang.title}`;
			t298 = space();
			input77 = element("input");
			t299 = space();
			div241 = element("div");
			div240 = element("div");
			label88 = element("label");
			label88.textContent = `${Lang.class}`;
			t301 = space();
			input78 = element("input");
			t302 = space();
			input79 = element("input");
			t303 = space();
			if (if_block) if_block.c();
			t304 = space();
			div266 = element("div");
			div265 = element("div");
			div261 = element("div");
			div250 = element("div");
			div247 = element("div");
			div246 = element("div");
			label89 = element("label");
			label89.textContent = `${Lang.width_label1}`;
			t306 = space();
			input80 = element("input");
			t307 = space();
			div249 = element("div");
			div248 = element("div");
			label90 = element("label");
			label90.textContent = `${Lang.height_label1}`;
			t309 = space();
			input81 = element("input");
			t310 = space();
			div255 = element("div");
			div252 = element("div");
			div251 = element("div");
			label91 = element("label");
			label91.textContent = `${Lang.top}`;
			t312 = space();
			input82 = element("input");
			t313 = space();
			div254 = element("div");
			div253 = element("div");
			label92 = element("label");
			label92.textContent = `${Lang.left}`;
			t315 = space();
			input83 = element("input");
			t316 = space();
			div260 = element("div");
			div257 = element("div");
			div256 = element("div");
			label93 = element("label");
			label93.textContent = `${Lang.title}`;
			t318 = space();
			input84 = element("input");
			t319 = space();
			div259 = element("div");
			div258 = element("div");
			label94 = element("label");
			label94.textContent = `${Lang.background_image}`;
			t321 = space();
			input85 = element("input");
			t322 = space();
			input86 = element("input");
			t323 = space();
			div264 = element("div");
			div262 = element("div");
			label95 = element("label");
			label95.textContent = `${Lang.css_style}`;
			t325 = space();
			textarea13 = element("textarea");
			t326 = space();
			div263 = element("div");
			create_component(modalevent8.$$.fragment);
			t327 = space();
			div294 = element("div");
			div293 = element("div");
			div288 = element("div");
			div287 = element("div");
			div268 = element("div");
			div267 = element("div");
			label96 = element("label");
			label96.textContent = `${Lang.width_label1}`;
			t329 = space();
			input87 = element("input");
			t330 = space();
			div270 = element("div");
			div269 = element("div");
			label97 = element("label");
			label97.textContent = `${Lang.height_label1}`;
			t332 = space();
			input88 = element("input");
			t333 = space();
			div272 = element("div");
			div271 = element("div");
			label98 = element("label");
			label98.textContent = `${Lang.top}`;
			t335 = space();
			input89 = element("input");
			t336 = space();
			div274 = element("div");
			div273 = element("div");
			label99 = element("label");
			label99.textContent = `${Lang.left}`;
			t338 = space();
			input90 = element("input");
			t339 = space();
			div276 = element("div");
			div275 = element("div");
			label100 = element("label");
			label100.textContent = `${Lang.title}`;
			t341 = space();
			input91 = element("input");
			t342 = space();
			div278 = element("div");
			div277 = element("div");
			label101 = element("label");
			label101.textContent = `${Lang.border_size}`;
			t344 = space();
			select7 = element("select");
			option12 = element("option");
			option12.textContent = `${Lang.none}`;
			option13 = element("option");
			option13.textContent = "1";
			option14 = element("option");
			option14.textContent = "2";
			option15 = element("option");
			option15.textContent = "3";
			option16 = element("option");
			option16.textContent = "4";
			option17 = element("option");
			option17.textContent = "5";
			t351 = space();
			div280 = element("div");
			div279 = element("div");
			label102 = element("label");
			label102.textContent = "Border Color";
			t353 = space();
			select8 = element("select");
			option18 = element("option");
			option18.textContent = `${Lang.none}`;
			option19 = element("option");
			option19.textContent = `${Lang.black}`;
			option20 = element("option");
			option20.textContent = `${Lang.blue}`;
			option21 = element("option");
			option21.textContent = `${Lang.green}`;
			option22 = element("option");
			option22.textContent = `${Lang.red}`;
			t359 = space();
			div282 = element("div");
			div281 = element("div");
			label103 = element("label");
			label103.textContent = `${Lang.bg_color}`;
			t361 = space();
			select9 = element("select");
			option23 = element("option");
			option23.textContent = `${Lang.none}`;
			option24 = element("option");
			option24.textContent = `${Lang.primary_color}`;
			option25 = element("option");
			option25.textContent = `${Lang.warning_color}`;
			option26 = element("option");
			option26.textContent = `${Lang.danger_color}`;
			t366 = space();
			input92 = element("input");
			t367 = space();
			div284 = element("div");
			div283 = element("div");
			label104 = element("label");
			label104.textContent = `${Lang.font_style}`;
			t369 = space();
			select10 = element("select");
			t370 = space();
			div286 = element("div");
			div285 = element("div");
			input93 = element("input");
			t371 = space();
			label105 = element("label");
			label105.textContent = `${Lang.rich_text}`;
			t373 = space();
			div292 = element("div");
			div291 = element("div");
			div290 = element("div");
			div289 = element("div");
			create_component(modalevent9.$$.fragment);
			t374 = space();
			div315 = element("div");
			div314 = element("div");
			div312 = element("div");
			div303 = element("div");
			div296 = element("div");
			div295 = element("div");
			label106 = element("label");
			label106.textContent = `${Lang.width_label1}`;
			t376 = space();
			input94 = element("input");
			t377 = space();
			div298 = element("div");
			div297 = element("div");
			label107 = element("label");
			label107.textContent = `${Lang.height_label1}`;
			t379 = space();
			input95 = element("input");
			t380 = space();
			div300 = element("div");
			div299 = element("div");
			label108 = element("label");
			label108.textContent = `${Lang.top}`;
			t382 = space();
			input96 = element("input");
			t383 = space();
			div302 = element("div");
			div301 = element("div");
			label109 = element("label");
			label109.textContent = `${Lang.left}`;
			t385 = space();
			input97 = element("input");
			t386 = space();
			div308 = element("div");
			div305 = element("div");
			div304 = element("div");
			label110 = element("label");
			label110.textContent = `${Lang.matrix}`;
			t388 = space();
			input98 = element("input");
			t389 = space();
			div307 = element("div");
			div306 = element("div");
			label111 = element("label");
			label111.textContent = `${Lang.correct_answer}`;
			t391 = space();
			input99 = element("input");
			t392 = space();
			div311 = element("div");
			div310 = element("div");
			div309 = element("div");
			label112 = element("label");
			label112.textContent = `${Lang.default_answer}`;
			t394 = space();
			input100 = element("input");
			t395 = space();
			input101 = element("input");
			t396 = space();
			div313 = element("div");
			t397 = space();
			div336 = element("div");
			div335 = element("div");
			div333 = element("div");
			div324 = element("div");
			div317 = element("div");
			div316 = element("div");
			label113 = element("label");
			label113.textContent = `${Lang.width_label1}`;
			t399 = space();
			input102 = element("input");
			t400 = space();
			div319 = element("div");
			div318 = element("div");
			label114 = element("label");
			label114.textContent = `${Lang.height_label1}`;
			t402 = space();
			input103 = element("input");
			t403 = space();
			div321 = element("div");
			div320 = element("div");
			label115 = element("label");
			label115.textContent = `${Lang.top}`;
			t405 = space();
			input104 = element("input");
			t406 = space();
			div323 = element("div");
			div322 = element("div");
			label116 = element("label");
			label116.textContent = `${Lang.left}`;
			t408 = space();
			input105 = element("input");
			t409 = space();
			div329 = element("div");
			div326 = element("div");
			div325 = element("div");
			label117 = element("label");
			label117.textContent = `${Lang.matrix}`;
			t411 = space();
			input106 = element("input");
			t412 = space();
			div328 = element("div");
			div327 = element("div");
			label118 = element("label");
			label118.textContent = `${Lang.correct_answer}`;
			t414 = space();
			input107 = element("input");
			t415 = space();
			div332 = element("div");
			div331 = element("div");
			div330 = element("div");
			label119 = element("label");
			label119.textContent = `${Lang.event_value}`;
			t417 = space();
			input108 = element("input");
			t418 = space();
			input109 = element("input");
			t419 = space();
			div334 = element("div");
			t420 = space();
			div358 = element("div");
			div357 = element("div");
			div356 = element("div");
			div345 = element("div");
			div338 = element("div");
			div337 = element("div");
			label120 = element("label");
			label120.textContent = `${Lang.width_label1}`;
			t422 = space();
			input110 = element("input");
			t423 = space();
			div340 = element("div");
			div339 = element("div");
			label121 = element("label");
			label121.textContent = `${Lang.height_label1}`;
			t425 = space();
			input111 = element("input");
			t426 = space();
			div342 = element("div");
			div341 = element("div");
			label122 = element("label");
			label122.textContent = `${Lang.top}`;
			t428 = space();
			input112 = element("input");
			t429 = space();
			div344 = element("div");
			div343 = element("div");
			label123 = element("label");
			label123.textContent = `${Lang.left}`;
			t431 = space();
			input113 = element("input");
			t432 = space();
			div350 = element("div");
			div347 = element("div");
			div346 = element("div");
			label124 = element("label");
			label124.textContent = `${Lang.title}`;
			t434 = space();
			input114 = element("input");
			t435 = space();
			div349 = element("div");
			div348 = element("div");
			label125 = element("label");
			label125.textContent = `${Lang.name_text}`;
			t437 = space();
			input115 = element("input");
			t438 = space();
			div355 = element("div");
			div352 = element("div");
			div351 = element("div");
			label126 = element("label");
			label126.textContent = `${Lang.target_img}`;
			t440 = space();
			input116 = element("input");
			t441 = space();
			div354 = element("div");
			div353 = element("div");
			input117 = element("input");
			t442 = space();
			label127 = element("label");
			label127.textContent = `${Lang.hide_target}`;
			t444 = space();
			input118 = element("input");
			t445 = space();
			div370 = element("div");
			div369 = element("div");
			div368 = element("div");
			div367 = element("div");
			div360 = element("div");
			div359 = element("div");
			label128 = element("label");
			label128.textContent = `${Lang.width_label1}`;
			t447 = space();
			input119 = element("input");
			t448 = space();
			div362 = element("div");
			div361 = element("div");
			label129 = element("label");
			label129.textContent = `${Lang.height_label1}`;
			t450 = space();
			input120 = element("input");
			t451 = space();
			div364 = element("div");
			div363 = element("div");
			label130 = element("label");
			label130.textContent = `${Lang.top}`;
			t453 = space();
			input121 = element("input");
			t454 = space();
			div366 = element("div");
			div365 = element("div");
			label131 = element("label");
			label131.textContent = `${Lang.left}`;
			t456 = space();
			input122 = element("input");
			t457 = space();
			input123 = element("input");
			t458 = space();
			div383 = element("div");
			div382 = element("div");
			div381 = element("div");
			div375 = element("div");
			div372 = element("div");
			div371 = element("div");
			label132 = element("label");
			label132.textContent = `${Lang.title}`;
			t460 = space();
			input124 = element("input");
			t461 = space();
			div374 = element("div");
			div373 = element("div");
			label133 = element("label");
			label133.textContent = `${Lang.alt_text}`;
			t463 = space();
			input125 = element("input");
			t464 = space();
			div380 = element("div");
			div377 = element("div");
			div376 = element("div");
			label134 = element("label");
			label134.textContent = `${Lang.background_image}`;
			t466 = space();
			input126 = element("input");
			t467 = space();
			button2 = element("button");
			button2.textContent = `${Lang.upload_media_text}`;
			t469 = space();
			div379 = element("div");
			div378 = element("div");
			input127 = element("input");
			t470 = space();
			label135 = element("label");
			label135.textContent = `${Lang.display}`;
			t472 = space();
			input128 = element("input");
			t473 = space();
			div394 = element("div");
			div393 = element("div");
			div392 = element("div");
			div388 = element("div");
			div385 = element("div");
			div384 = element("div");
			label136 = element("label");
			label136.textContent = `${Lang.background_image}`;
			t475 = space();
			input129 = element("input");
			t476 = space();
			button3 = element("button");
			button3.textContent = `${Lang.upload_media_text}`;
			t478 = space();
			div387 = element("div");
			div386 = element("div");
			label137 = element("label");
			label137.textContent = `${Lang.img_alt}`;
			t480 = space();
			input130 = element("input");
			t481 = space();
			div391 = element("div");
			div390 = element("div");
			div389 = element("div");
			input131 = element("input");
			t482 = space();
			label138 = element("label");
			label138.textContent = `${Lang.display}`;
			t484 = space();
			input132 = element("input");
			t485 = space();
			div409 = element("div");
			div408 = element("div");
			div407 = element("div");
			div401 = element("div");
			div396 = element("div");
			div395 = element("div");
			label139 = element("label");
			label139.textContent = `${Lang.width_label1}`;
			t487 = space();
			input133 = element("input");
			t488 = space();
			div398 = element("div");
			div397 = element("div");
			label140 = element("label");
			label140.textContent = `${Lang.height_label1}`;
			t490 = space();
			input134 = element("input");
			t491 = space();
			div400 = element("div");
			div399 = element("div");
			label141 = element("label");
			label141.textContent = `${Lang.bg_alt_text}`;
			t493 = space();
			input135 = element("input");
			t494 = space();
			div406 = element("div");
			div403 = element("div");
			div402 = element("div");
			label142 = element("label");
			label142.textContent = `${Lang.background_image}`;
			t496 = space();
			input136 = element("input");
			t497 = space();
			div405 = element("div");
			button4 = element("button");
			button4.textContent = `${Lang.upload_media_text}`;
			t499 = space();
			div404 = element("div");
			input137 = element("input");
			t500 = space();
			label143 = element("label");
			label143.textContent = `${Lang.add_border}`;
			t502 = space();
			div410 = element("div");
			textarea14 = element("textarea");
			t503 = space();
			div433 = element("div");
			div432 = element("div");
			div428 = element("div");
			div415 = element("div");
			div412 = element("div");
			div411 = element("div");
			label144 = element("label");
			label144.textContent = `${Lang.width_label1}`;
			t505 = space();
			input138 = element("input");
			t506 = space();
			div414 = element("div");
			div413 = element("div");
			label145 = element("label");
			label145.textContent = `${Lang.height_label1}`;
			t508 = space();
			input139 = element("input");
			t509 = space();
			div420 = element("div");
			div417 = element("div");
			div416 = element("div");
			label146 = element("label");
			label146.textContent = `${Lang.top}`;
			t511 = space();
			input140 = element("input");
			t512 = space();
			div419 = element("div");
			div418 = element("div");
			label147 = element("label");
			label147.textContent = `${Lang.left}`;
			t514 = space();
			input141 = element("input");
			t515 = space();
			div427 = element("div");
			div422 = element("div");
			div421 = element("div");
			label148 = element("label");
			label148.textContent = `${Lang.name_text}`;
			t517 = space();
			input142 = element("input");
			t518 = space();
			div424 = element("div");
			div423 = element("div");
			label149 = element("label");
			label149.textContent = `${Lang.correct_answer}`;
			t520 = space();
			input143 = element("input");
			t521 = space();
			div426 = element("div");
			div425 = element("div");
			label150 = element("label");
			label150.textContent = `${Lang.default_answer}`;
			t523 = space();
			input144 = element("input");
			t524 = space();
			input145 = element("input");
			t525 = space();
			div431 = element("div");
			div429 = element("div");
			label151 = element("label");
			label151.textContent = `${Lang.css_style}`;
			t527 = space();
			textarea15 = element("textarea");
			t528 = space();
			div430 = element("div");
			create_component(modalevent10.$$.fragment);
			t529 = space();
			div435 = element("div");
			button5 = element("button");
			button5.textContent = `${Lang.cancel}`;
			t531 = space();
			button6 = element("button");
			button6.textContent = `${Lang.ok_btn}`;
			t533 = space();
			button7 = element("button");
			button7.textContent = `${Lang.ok_btn}`;
			attr_dev(h4, "class", "modal-title");
			add_location(h4, file$h, 17, 16, 606);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "close");
			attr_dev(button0, "data-bs-dismiss", "modal");
			add_location(button0, file$h, 18, 16, 666);
			attr_dev(div0, "class", "modal-header");
			add_location(div0, file$h, 16, 12, 562);
			attr_dev(label0, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label0, "for", "drag-width");
			add_location(label0, file$h, 27, 40, 1167);
			attr_dev(input0, "type", "text");
			attr_dev(input0, "class", "form-control form-control-md validate number_validate");
			attr_dev(input0, "id", "drag-width");
			attr_dev(input0, "name", "width");
			attr_dev(input0, "placeholder", input0_placeholder_value = Lang.width_of_draggable);
			attr_dev(input0, "defaultvalue", "100");
			add_location(input0, file$h, 28, 40, 1319);
			attr_dev(div1, "class", "form-group");
			add_location(div1, file$h, 26, 36, 1101);
			attr_dev(div2, "class", "col-sm-3 px-1");
			add_location(div2, file$h, 25, 32, 1036);
			attr_dev(label1, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label1, "for", "drag-height");
			add_location(label1, file$h, 33, 40, 1735);
			attr_dev(input1, "type", "text");
			attr_dev(input1, "class", "form-control form-control-md validate number_validate");
			attr_dev(input1, "id", "drag-height");
			attr_dev(input1, "name", "height");
			attr_dev(input1, "placeholder", input1_placeholder_value = Lang.height_of_drggable);
			attr_dev(input1, "defaultvalue", "30");
			add_location(input1, file$h, 34, 40, 1889);
			attr_dev(div3, "class", "form-group");
			add_location(div3, file$h, 32, 36, 1669);
			attr_dev(div4, "class", "col-sm-3 px-1");
			add_location(div4, file$h, 31, 32, 1604);
			attr_dev(label2, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label2, "for", "drag-top");
			add_location(label2, file$h, 39, 40, 2306);
			attr_dev(input2, "type", "text");
			attr_dev(input2, "class", "form-control form-control-md validate number_validate");
			attr_dev(input2, "id", "drag-top");
			attr_dev(input2, "name", "top");
			attr_dev(input2, "placeholder", input2_placeholder_value = Lang.top_of_draggable);
			add_location(input2, file$h, 40, 40, 2447);
			attr_dev(div5, "class", "form-group");
			add_location(div5, file$h, 38, 36, 2240);
			attr_dev(div6, "class", "col-sm-6 px-1");
			add_location(div6, file$h, 37, 32, 2175);
			attr_dev(label3, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label3, "for", "drag-left");
			add_location(label3, file$h, 45, 40, 2838);
			attr_dev(input3, "type", "text");
			attr_dev(input3, "class", "form-control form-control-md validate number_validate");
			attr_dev(input3, "id", "drag-left");
			attr_dev(input3, "name", "left");
			attr_dev(input3, "placeholder", input3_placeholder_value = Lang.left_of_drggable);
			add_location(input3, file$h, 46, 40, 2981);
			attr_dev(div7, "class", "form-group");
			add_location(div7, file$h, 44, 36, 2772);
			attr_dev(div8, "class", "col-sm-6 px-1");
			add_location(div8, file$h, 43, 32, 2707);
			attr_dev(label4, "class", "control-label font-weight-normal mb-0");
			attr_dev(label4, "for", "drag-value");
			add_location(label4, file$h, 51, 40, 3374);
			attr_dev(input4, "type", "text");
			attr_dev(input4, "class", "form-control form-control-md");
			attr_dev(input4, "id", "drag-value");
			attr_dev(input4, "name", "value");
			attr_dev(input4, "placeholder", input4_placeholder_value = Lang.title_of_drggable);
			add_location(input4, file$h, 52, 40, 3503);
			attr_dev(div9, "class", "form-group");
			add_location(div9, file$h, 50, 36, 3308);
			attr_dev(div10, "class", "col-sm-6 px-1");
			add_location(div10, file$h, 49, 32, 3243);
			attr_dev(label5, "class", "control-label font-weight-normal mb-0");
			attr_dev(label5, "for", "drag-border_color");
			add_location(label5, file$h, 57, 40, 3876);
			option0.__value = "";
			option0.value = option0.__value;
			add_location(option0, file$h, 59, 44, 4153);
			option1.__value = "black";
			option1.value = option1.__value;
			add_location(option1, file$h, 60, 44, 4233);
			option2.__value = "gray";
			option2.value = option2.__value;
			add_location(option2, file$h, 61, 44, 4319);
			attr_dev(select0, "class", "form-control form-control-md");
			attr_dev(select0, "id", "drag-border_color");
			attr_dev(select0, "name", "border_color");
			add_location(select0, file$h, 58, 40, 4019);
			attr_dev(div11, "class", "form-group");
			add_location(div11, file$h, 56, 36, 3810);
			attr_dev(div12, "class", "col-sm-6 px-1");
			add_location(div12, file$h, 55, 32, 3745);
			attr_dev(label6, "class", "control-label font-weight-normal mb-0");
			attr_dev(label6, "for", "drag-name");
			add_location(label6, file$h, 67, 40, 4657);
			attr_dev(input5, "type", "text");
			attr_dev(input5, "class", "form-control form-control-md");
			attr_dev(input5, "id", "drag-name");
			attr_dev(input5, "name", "name");
			attr_dev(input5, "placeholder", input5_placeholder_value = Lang.name_of_draggable);
			add_location(input5, file$h, 68, 40, 4788);
			attr_dev(div13, "class", "form-group");
			add_location(div13, file$h, 66, 36, 4591);
			attr_dev(div14, "class", "col-sm-6 px-1");
			add_location(div14, file$h, 65, 32, 4526);
			attr_dev(label7, "class", "control-label font-weight-normal mb-0");
			attr_dev(label7, "for", "drag-image");
			add_location(label7, file$h, 73, 40, 5158);
			attr_dev(input6, "type", "text");
			attr_dev(input6, "class", "form-control form-control-md");
			attr_dev(input6, "id", "drag-image");
			attr_dev(input6, "name", "image");
			attr_dev(input6, "placeholder", input6_placeholder_value = Lang.bg_of_draggble);
			add_location(input6, file$h, 74, 40, 5298);
			attr_dev(div15, "class", "form-group");
			add_location(div15, file$h, 72, 36, 5092);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "id", "drag_upload_media");
			attr_dev(button1, "class", "btn btn-outline-primary float-start");
			add_location(button1, file$h, 76, 36, 5500);
			attr_dev(div16, "class", "col-sm-6 px-1");
			add_location(div16, file$h, 71, 32, 5027);
			attr_dev(input7, "type", "checkbox");
			attr_dev(input7, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input7, "id", "drag-multi_drag");
			attr_dev(input7, "name", "multi_drag");
			attr_dev(input7, "defaultvalue", "1");
			add_location(input7, file$h, 80, 40, 5869);
			attr_dev(label8, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label8, "for", "drag-multi_drag");
			add_location(label8, file$h, 81, 40, 6039);
			attr_dev(div17, "class", "form-group form-check form-check-inline");
			add_location(div17, file$h, 79, 36, 5774);
			attr_dev(div18, "class", "col-sm-6 px-1 pt-sm-4 mt-sm-1");
			add_location(div18, file$h, 78, 32, 5693);
			attr_dev(input8, "type", "checkbox");
			attr_dev(input8, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input8, "id", "ch-invisible");
			attr_dev(input8, "name", "invisible");
			attr_dev(input8, "defaultvalue", "1");
			add_location(input8, file$h, 86, 40, 6439);
			attr_dev(label9, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label9, "for", "ch-invisible");
			add_location(label9, file$h, 87, 40, 6606);
			attr_dev(div19, "class", "form-group form-check pt-3 form-check-inline");
			add_location(div19, file$h, 85, 36, 6339);
			attr_dev(div20, "class", "col-sm-6 px-1");
			add_location(div20, file$h, 84, 32, 6274);
			attr_dev(div21, "class", "row");
			add_location(div21, file$h, 24, 28, 985);
			attr_dev(div22, "class", "col-sm-12");
			add_location(div22, file$h, 23, 24, 932);
			attr_dev(label10, "class", "control-label font-weight-normal mb-0");
			attr_dev(label10, "for", "txt-style");
			add_location(label10, file$h, 96, 40, 7136);
			attr_dev(textarea0, "id", "txt-style");
			attr_dev(textarea0, "class", "form-control form-control-md height_34 height_34");
			attr_dev(textarea0, "name", "style");
			attr_dev(textarea0, "placeholder", textarea0_placeholder_value = Lang.css_style_of_txt);
			add_location(textarea0, file$h, 97, 40, 7268);
			attr_dev(div23, "class", "form-group");
			add_location(div23, file$h, 95, 36, 7070);
			attr_dev(div24, "class", "col-sm-6 px-1");
			add_location(div24, file$h, 94, 32, 7005);
			attr_dev(label11, "class", "control-label font-weight-normal mb-0");
			attr_dev(label11, "for", "drag-detail");
			add_location(label11, file$h, 102, 40, 7658);
			attr_dev(input9, "type", "text");
			attr_dev(input9, "class", "form-control form-control-md");
			attr_dev(input9, "id", "drag-detail");
			attr_dev(input9, "name", "detail");
			attr_dev(input9, "placeholder", input9_placeholder_value = Lang.detail_of_drag);
			add_location(input9, file$h, 103, 40, 7789);
			attr_dev(div25, "class", "form-group");
			add_location(div25, file$h, 101, 36, 7592);
			attr_dev(div26, "class", "col-sm-6 px-1");
			add_location(div26, file$h, 100, 32, 7527);
			attr_dev(div27, "class", "row");
			add_location(div27, file$h, 93, 28, 6954);
			attr_dev(div28, "class", "col-sm-12 d-none");
			add_location(div28, file$h, 92, 24, 6894);
			attr_dev(div29, "class", "row mx-0");
			add_location(div29, file$h, 22, 20, 884);
			attr_dev(input10, "type", "hidden");
			attr_dev(input10, "id", "drag-id");
			attr_dev(input10, "name", "id");
			add_location(input10, file$h, 109, 20, 8113);
			attr_dev(div30, "class", "drag h");
			add_location(div30, file$h, 21, 16, 842);
			attr_dev(label12, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label12, "for", "drop-width");
			add_location(label12, file$h, 117, 40, 8530);
			attr_dev(input11, "type", "text");
			attr_dev(input11, "class", "form-control form-control-md validate number_validate");
			attr_dev(input11, "id", "drop-width");
			attr_dev(input11, "name", "width");
			attr_dev(input11, "placeholder", input11_placeholder_value = Lang.width_of_placeholder);
			attr_dev(input11, "defaultvalue", "100");
			add_location(input11, file$h, 118, 40, 8682);
			attr_dev(div31, "class", "form-group");
			add_location(div31, file$h, 116, 36, 8464);
			attr_dev(div32, "class", "col-sm-6 px-1");
			add_location(div32, file$h, 115, 32, 8399);
			attr_dev(label13, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label13, "for", "drop-height");
			add_location(label13, file$h, 123, 40, 9100);
			attr_dev(input12, "type", "text");
			attr_dev(input12, "class", "form-control form-control-md validate number_validate");
			attr_dev(input12, "id", "drop-height");
			attr_dev(input12, "name", "height");
			attr_dev(input12, "placeholder", input12_placeholder_value = Lang.height_of_placeholder);
			attr_dev(input12, "defaultvalue", "30");
			add_location(input12, file$h, 124, 40, 9254);
			attr_dev(div33, "class", "form-group");
			add_location(div33, file$h, 122, 36, 9034);
			attr_dev(div34, "class", "col-sm-6 px-1");
			add_location(div34, file$h, 121, 32, 8969);
			attr_dev(div35, "class", "row");
			add_location(div35, file$h, 114, 28, 8348);
			attr_dev(label14, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label14, "for", "drop-top");
			add_location(label14, file$h, 131, 40, 9757);
			attr_dev(input13, "type", "text");
			attr_dev(input13, "class", "form-control form-control-md validate number_validate");
			attr_dev(input13, "id", "drop-top");
			attr_dev(input13, "name", "top");
			attr_dev(input13, "placeholder", input13_placeholder_value = Lang.top_of_ph);
			add_location(input13, file$h, 132, 40, 9898);
			attr_dev(div36, "class", "form-group");
			add_location(div36, file$h, 130, 36, 9691);
			attr_dev(div37, "class", "col-sm-6 px-1");
			add_location(div37, file$h, 129, 32, 9626);
			attr_dev(label15, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label15, "for", "drop-left");
			add_location(label15, file$h, 137, 40, 10282);
			attr_dev(input14, "type", "text");
			attr_dev(input14, "class", "form-control form-control-md validate number_validate");
			attr_dev(input14, "id", "drop-left");
			attr_dev(input14, "name", "left");
			attr_dev(input14, "placeholder", input14_placeholder_value = Lang.left_of_ph);
			add_location(input14, file$h, 138, 40, 10425);
			attr_dev(div38, "class", "form-group");
			add_location(div38, file$h, 136, 36, 10216);
			attr_dev(div39, "class", "col-sm-6 px-1");
			add_location(div39, file$h, 135, 32, 10151);
			attr_dev(div40, "class", "row");
			add_location(div40, file$h, 128, 28, 9575);
			attr_dev(label16, "class", "control-label font-weight-normal mb-0");
			attr_dev(label16, "for", "drop-value");
			add_location(label16, file$h, 145, 40, 10895);
			attr_dev(input15, "type", "text");
			attr_dev(input15, "class", "form-control form-control-md");
			attr_dev(input15, "id", "drop-value");
			attr_dev(input15, "name", "value");
			attr_dev(input15, "placeholder", input15_placeholder_value = Lang.tilte_of_ph);
			add_location(input15, file$h, 146, 40, 11024);
			attr_dev(div41, "class", "form-group");
			add_location(div41, file$h, 144, 36, 10829);
			attr_dev(div42, "class", "col-sm-6 px-1");
			add_location(div42, file$h, 143, 32, 10764);
			attr_dev(label17, "class", "control-label font-weight-normal mb-0");
			attr_dev(label17, "for", "drop-border");
			add_location(label17, file$h, 151, 40, 11390);
			option3.__value = "";
			option3.value = option3.__value;
			add_location(option3, file$h, 153, 44, 11649);
			option4.__value = "black";
			option4.value = option4.__value;
			add_location(option4, file$h, 154, 44, 11729);
			option5.__value = "gray";
			option5.value = option5.__value;
			add_location(option5, file$h, 155, 44, 11815);
			attr_dev(select1, "class", "form-control form-control-md");
			attr_dev(select1, "id", "drop-border");
			attr_dev(select1, "name", "border");
			add_location(select1, file$h, 152, 40, 11527);
			attr_dev(div43, "class", "form-group");
			add_location(div43, file$h, 150, 36, 11324);
			attr_dev(div44, "class", "col-sm-6 px-1");
			add_location(div44, file$h, 149, 32, 11259);
			attr_dev(div45, "class", "row");
			add_location(div45, file$h, 142, 28, 10713);
			attr_dev(label18, "class", "control-label font-weight-normal mb-0");
			attr_dev(label18, "for", "drop-name");
			add_location(label18, file$h, 163, 40, 12236);
			attr_dev(input16, "type", "text");
			attr_dev(input16, "class", "form-control form-control-md");
			attr_dev(input16, "id", "drop-name");
			attr_dev(input16, "name", "name");
			attr_dev(input16, "placeholder", input16_placeholder_value = Lang.name_of_ph);
			add_location(input16, file$h, 164, 40, 12367);
			attr_dev(div46, "class", "form-group");
			add_location(div46, file$h, 162, 36, 12170);
			attr_dev(div47, "class", "col-sm-6 px-1");
			add_location(div47, file$h, 161, 32, 12105);
			attr_dev(label19, "class", "control-label font-weight-normal mb-0");
			attr_dev(label19, "for", "drop-anskey");
			add_location(label19, file$h, 169, 40, 12730);
			attr_dev(input17, "type", "text");
			attr_dev(input17, "class", "form-control form-control-md");
			attr_dev(input17, "id", "drop-anskey");
			attr_dev(input17, "name", "anskey");
			attr_dev(input17, "placeholder", input17_placeholder_value = Lang.correct_answer_of_ph);
			add_location(input17, file$h, 170, 40, 12869);
			attr_dev(div48, "class", "form-group");
			add_location(div48, file$h, 168, 36, 12664);
			attr_dev(div49, "class", "col-sm-6 px-1");
			add_location(div49, file$h, 167, 32, 12599);
			attr_dev(label20, "class", "control-label font-weight-normal mb-0");
			attr_dev(label20, "for", "drop-defaultans");
			add_location(label20, file$h, 175, 40, 13254);
			attr_dev(input18, "type", "text");
			attr_dev(input18, "class", "form-control form-control-md");
			attr_dev(input18, "id", "drop-defaultans");
			attr_dev(input18, "name", "defaultans");
			attr_dev(input18, "placeholder", input18_placeholder_value = Lang.default_answer_of_ph);
			add_location(input18, file$h, 176, 40, 13397);
			attr_dev(div50, "class", "form-group");
			add_location(div50, file$h, 174, 36, 13188);
			attr_dev(div51, "class", "col-sm-12 px-1 d-none");
			add_location(div51, file$h, 173, 32, 13115);
			attr_dev(input19, "type", "checkbox");
			attr_dev(input19, "class", "checkbox d-inline mr-2");
			attr_dev(input19, "id", "drop-invisible");
			attr_dev(input19, "name", "invisible");
			attr_dev(input19, "defaultvalue", "1");
			add_location(input19, file$h, 181, 40, 13783);
			attr_dev(label21, "class", "control-label font-weight-normal mb-0 position-relative bottom1");
			attr_dev(label21, "for", "drop-invisible");
			add_location(label21, file$h, 182, 40, 13935);
			attr_dev(div52, "class", "form-group");
			add_location(div52, file$h, 180, 36, 13717);
			attr_dev(div53, "class", "col-sm-12 px-1");
			add_location(div53, file$h, 179, 32, 13651);
			attr_dev(input20, "type", "hidden");
			attr_dev(input20, "id", "drop-id");
			attr_dev(input20, "name", "id");
			add_location(input20, file$h, 185, 32, 14174);
			attr_dev(div54, "class", "row");
			add_location(div54, file$h, 160, 28, 12054);
			attr_dev(div55, "class", "col-sm-12");
			add_location(div55, file$h, 113, 24, 8295);
			attr_dev(label22, "class", "control-label font-weight-normal mb-0");
			attr_dev(label22, "for", "drop-style");
			add_location(label22, file$h, 190, 32, 14441);
			attr_dev(textarea1, "id", "drop-style");
			attr_dev(textarea1, "class", "form-control form-control-md height_34");
			attr_dev(textarea1, "name", "style");
			attr_dev(textarea1, "placeholder", textarea1_placeholder_value = Lang.css_style_of_ph);
			add_location(textarea1, file$h, 191, 32, 14566);
			attr_dev(div56, "class", "form-group");
			add_location(div56, file$h, 189, 28, 14383);
			attr_dev(div57, "class", "ev");
			attr_dev(div57, "type", "drop");
			add_location(div57, file$h, 193, 28, 14763);
			attr_dev(div58, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div58, file$h, 188, 24, 14314);
			attr_dev(div59, "class", "row mx-0");
			add_location(div59, file$h, 112, 20, 8247);
			attr_dev(div60, "class", "dropitem h");
			add_location(div60, file$h, 111, 16, 8201);
			attr_dev(label23, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label23, "for", "int-width");
			add_location(label23, file$h, 205, 40, 15305);
			attr_dev(input21, "type", "text");
			attr_dev(input21, "class", "form-control form-control-md validate number_validate");
			attr_dev(input21, "id", "int-width");
			attr_dev(input21, "name", "width");
			attr_dev(input21, "placeholder", input21_placeholder_value = Lang.width_of_input);
			attr_dev(input21, "defaultvalue", "100");
			add_location(input21, file$h, 206, 40, 15456);
			attr_dev(div61, "class", "form-group");
			add_location(div61, file$h, 204, 36, 15239);
			attr_dev(div62, "class", "col-sm-6 px-1");
			add_location(div62, file$h, 203, 32, 15174);
			attr_dev(label24, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label24, "for", "int-height");
			add_location(label24, file$h, 211, 40, 15867);
			attr_dev(input22, "type", "text");
			attr_dev(input22, "class", "form-control form-control-md validate number_validate");
			attr_dev(input22, "id", "int-height");
			attr_dev(input22, "name", "height");
			attr_dev(input22, "placeholder", input22_placeholder_value = Lang.height_of_input);
			attr_dev(input22, "defaultvalue", "30");
			add_location(input22, file$h, 212, 40, 16020);
			attr_dev(div63, "class", "form-group");
			add_location(div63, file$h, 210, 36, 15801);
			attr_dev(div64, "class", "col-sm-6 px-1");
			add_location(div64, file$h, 209, 32, 15736);
			attr_dev(div65, "class", "row");
			add_location(div65, file$h, 202, 28, 15123);
			attr_dev(label25, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label25, "for", "int-top");
			add_location(label25, file$h, 219, 40, 16516);
			attr_dev(input23, "type", "text");
			attr_dev(input23, "class", "form-control form-control-md validate number_validate");
			attr_dev(input23, "id", "int-top");
			attr_dev(input23, "name", "top");
			attr_dev(input23, "placeholder", input23_placeholder_value = Lang.top_of_input);
			add_location(input23, file$h, 220, 40, 16656);
			attr_dev(div66, "class", "form-group");
			add_location(div66, file$h, 218, 36, 16450);
			attr_dev(div67, "class", "col-sm-6 px-1");
			add_location(div67, file$h, 217, 32, 16385);
			attr_dev(label26, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label26, "for", "int-left");
			add_location(label26, file$h, 225, 40, 17042);
			attr_dev(input24, "type", "text");
			attr_dev(input24, "class", "form-control form-control-md validate number_validate");
			attr_dev(input24, "id", "int-left");
			attr_dev(input24, "name", "left");
			attr_dev(input24, "placeholder", input24_placeholder_value = Lang.left_of_input);
			add_location(input24, file$h, 226, 40, 17184);
			attr_dev(div68, "class", "form-group");
			add_location(div68, file$h, 224, 36, 16976);
			attr_dev(div69, "class", "col-sm-6 px-1");
			add_location(div69, file$h, 223, 32, 16911);
			attr_dev(div70, "class", "row");
			add_location(div70, file$h, 216, 28, 16334);
			attr_dev(label27, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label27, "for", "int-correctans");
			add_location(label27, file$h, 233, 40, 17657);
			attr_dev(input25, "type", "text");
			attr_dev(input25, "class", "form-control form-control-md validate");
			attr_dev(input25, "id", "int-correctans");
			attr_dev(input25, "name", "correctans");
			attr_dev(input25, "placeholder", input25_placeholder_value = Lang.correct_answer_of_input);
			add_location(input25, file$h, 234, 40, 17815);
			attr_dev(div71, "class", "form-group");
			add_location(div71, file$h, 232, 36, 17591);
			attr_dev(div72, "class", "col-sm-12 px-1");
			add_location(div72, file$h, 231, 32, 17525);
			attr_dev(label28, "class", "control-label font-weight-normal mb-0");
			attr_dev(label28, "for", "int-defaultans");
			add_location(label28, file$h, 239, 40, 18219);
			attr_dev(input26, "type", "text");
			attr_dev(input26, "class", "form-control form-control-md");
			attr_dev(input26, "id", "int-defaultans");
			attr_dev(input26, "name", "defaultans");
			attr_dev(input26, "placeholder", input26_placeholder_value = Lang.default_ans_of_input);
			add_location(input26, file$h, 240, 40, 18361);
			attr_dev(div73, "class", "form-group");
			add_location(div73, file$h, 238, 36, 18153);
			attr_dev(div74, "class", "col-sm-12 px-1 d-none");
			add_location(div74, file$h, 237, 32, 18080);
			attr_dev(label29, "class", "control-label font-weight-normal mb-0");
			attr_dev(label29, "for", "int-placeholder");
			add_location(label29, file$h, 245, 40, 18746);
			attr_dev(input27, "type", "text");
			attr_dev(input27, "class", "form-control form-control-md");
			attr_dev(input27, "id", "int-placeholder");
			attr_dev(input27, "name", "placeholder");
			attr_dev(input27, "placeholder", input27_placeholder_value = Lang.placeholder_of_ib);
			add_location(input27, file$h, 246, 40, 18886);
			attr_dev(div75, "class", "form-group");
			add_location(div75, file$h, 244, 36, 18680);
			attr_dev(div76, "class", "col-sm-12 px-1");
			add_location(div76, file$h, 243, 32, 18614);
			attr_dev(label30, "class", "control-label font-weight-normal mb-0");
			attr_dev(label30, "for", "int-type");
			add_location(label30, file$h, 251, 40, 19269);
			option6.__value = "text";
			option6.value = option6.__value;
			option6.selected = "selected";
			add_location(option6, file$h, 253, 44, 19512);
			option7.__value = "password";
			option7.value = option7.__value;
			add_location(option7, file$h, 254, 44, 19620);
			attr_dev(select2, "class", "form-control form-control-md");
			attr_dev(select2, "id", "int-type");
			attr_dev(select2, "name", "type");
			add_location(select2, file$h, 252, 40, 19395);
			attr_dev(div77, "class", "form-group");
			add_location(div77, file$h, 250, 36, 19203);
			attr_dev(div78, "class", "col-sm-6 px-1");
			add_location(div78, file$h, 249, 32, 19138);
			attr_dev(label31, "class", "control-label font-weight-normal mb-0");
			attr_dev(label31, "for", "int-parser");
			add_location(label31, file$h, 260, 40, 19966);
			option8.__value = "";
			option8.value = option8.__value;
			add_location(option8, file$h, 262, 44, 20217);
			option9.__value = "sql";
			option9.value = option9.__value;
			add_location(option9, file$h, 263, 44, 20306);
			attr_dev(select3, "class", "form-control form-control-md");
			attr_dev(select3, "id", "int-parser");
			attr_dev(select3, "name", "parser");
			add_location(select3, file$h, 261, 40, 20096);
			attr_dev(div79, "class", "form-group");
			add_location(div79, file$h, 259, 36, 19900);
			attr_dev(div80, "class", "col-sm-6 px-1");
			add_location(div80, file$h, 258, 32, 19835);
			attr_dev(input28, "type", "checkbox");
			attr_dev(input28, "class", "checkbox form-check-input");
			attr_dev(input28, "id", "int-nocase");
			attr_dev(input28, "name", "nocase");
			attr_dev(input28, "defaultvalue", "1");
			add_location(input28, file$h, 269, 40, 20671);
			attr_dev(label32, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label32, "for", "int-nocase");
			add_location(label32, file$h, 270, 40, 20819);
			attr_dev(div81, "class", "form-group form-check form-check-inline");
			add_location(div81, file$h, 268, 36, 20576);
			attr_dev(div82, "class", "col-sm-6 px-1");
			add_location(div82, file$h, 267, 32, 20511);
			attr_dev(input29, "type", "checkbox");
			attr_dev(input29, "class", "checkbox form-check-input");
			attr_dev(input29, "id", "int-ismultipleanswer");
			attr_dev(input29, "name", "ismultipleanswer");
			attr_dev(input29, "defaultvalue", "1");
			add_location(input29, file$h, 275, 40, 21212);
			attr_dev(label33, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label33, "for", "int-ismultipleanswer");
			add_location(label33, file$h, 276, 40, 21380);
			attr_dev(div83, "class", "form-group form-check form-check-inline");
			add_location(div83, file$h, 274, 36, 21117);
			attr_dev(div84, "class", "col-sm-6 px-1");
			add_location(div84, file$h, 273, 32, 21052);
			attr_dev(input30, "type", "hidden");
			attr_dev(input30, "id", "int-id");
			attr_dev(input30, "name", "id");
			add_location(input30, file$h, 279, 32, 21627);
			attr_dev(div85, "class", "row");
			add_location(div85, file$h, 230, 28, 17474);
			attr_dev(div86, "class", "col-sm-12");
			add_location(div86, file$h, 201, 24, 15070);
			attr_dev(label34, "class", "control-label font-weight-normal mb-0");
			attr_dev(label34, "for", "int-style");
			add_location(label34, file$h, 284, 32, 21893);
			attr_dev(textarea2, "id", "int-style");
			attr_dev(textarea2, "class", "form-control form-control-md height_34");
			attr_dev(textarea2, "name", "style");
			attr_dev(textarea2, "placeholder", textarea2_placeholder_value = Lang.css_of_input);
			add_location(textarea2, file$h, 285, 32, 22017);
			attr_dev(div87, "class", "form-group");
			add_location(div87, file$h, 283, 28, 21835);
			attr_dev(label35, "class", "control-label font-weight-normal mb-0");
			attr_dev(label35, "for", "custom_class_input");
			add_location(label35, file$h, 288, 32, 22268);
			attr_dev(select4, "class", "form-control form-control-md");
			attr_dev(select4, "id", "custom_class_input");
			attr_dev(select4, "name", "custom_class");
			add_location(select4, file$h, 289, 32, 22402);
			attr_dev(div88, "class", "form-group");
			add_location(div88, file$h, 287, 28, 22210);
			attr_dev(div89, "class", "ev");
			attr_dev(div89, "type", "int");
			add_location(div89, file$h, 291, 28, 22566);
			attr_dev(div90, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div90, file$h, 282, 24, 21766);
			attr_dev(div91, "class", "row mx-0");
			add_location(div91, file$h, 200, 20, 15022);
			attr_dev(div92, "class", "inputbox h");
			add_location(div92, file$h, 199, 16, 14976);
			attr_dev(label36, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label36, "for", "mlt-width");
			add_location(label36, file$h, 303, 40, 23108);
			attr_dev(input31, "type", "text");
			attr_dev(input31, "class", "form-control form-control-md validate number_validate");
			attr_dev(input31, "id", "mlt-width");
			attr_dev(input31, "name", "width");
			attr_dev(input31, "placeholder", input31_placeholder_value = Lang.width_of_multiline);
			attr_dev(input31, "defaultvalue", "100");
			add_location(input31, file$h, 304, 40, 23259);
			attr_dev(div93, "class", "form-group");
			add_location(div93, file$h, 302, 36, 23042);
			attr_dev(div94, "class", "col-sm-6 px-1");
			add_location(div94, file$h, 301, 32, 22977);
			attr_dev(label37, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label37, "for", "mlt-height");
			add_location(label37, file$h, 309, 40, 23674);
			attr_dev(input32, "type", "text");
			attr_dev(input32, "class", "form-control form-control-md validate number_validate");
			attr_dev(input32, "id", "mlt-height");
			attr_dev(input32, "name", "height");
			attr_dev(input32, "placeholder", input32_placeholder_value = Lang.height_of_multiline);
			attr_dev(input32, "defaultvalue", "30");
			add_location(input32, file$h, 310, 40, 23827);
			attr_dev(div95, "class", "form-group");
			add_location(div95, file$h, 308, 36, 23608);
			attr_dev(div96, "class", "col-sm-6 px-1");
			add_location(div96, file$h, 307, 32, 23543);
			attr_dev(div97, "class", "row");
			add_location(div97, file$h, 300, 28, 22926);
			attr_dev(label38, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label38, "for", "mlt-top");
			add_location(label38, file$h, 317, 40, 24327);
			attr_dev(input33, "type", "text");
			attr_dev(input33, "class", "form-control form-control-md validate number_validate");
			attr_dev(input33, "id", "mlt-top");
			attr_dev(input33, "name", "top");
			attr_dev(input33, "placeholder", input33_placeholder_value = Lang.top_of_multiline);
			add_location(input33, file$h, 318, 40, 24467);
			attr_dev(div98, "class", "form-group");
			add_location(div98, file$h, 316, 36, 24261);
			attr_dev(div99, "class", "col-sm-6 px-1");
			add_location(div99, file$h, 315, 32, 24196);
			attr_dev(label39, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label39, "for", "mlt-left");
			add_location(label39, file$h, 323, 40, 24857);
			attr_dev(input34, "type", "text");
			attr_dev(input34, "class", "form-control form-control-md validate number_validate");
			attr_dev(input34, "id", "mlt-left");
			attr_dev(input34, "name", "left");
			attr_dev(input34, "placeholder", input34_placeholder_value = Lang.left_of_multiline);
			add_location(input34, file$h, 324, 40, 24999);
			attr_dev(div100, "class", "form-group");
			add_location(div100, file$h, 322, 36, 24791);
			attr_dev(div101, "class", "col-sm-6 px-1");
			add_location(div101, file$h, 321, 32, 24726);
			attr_dev(div102, "class", "row");
			add_location(div102, file$h, 314, 28, 24145);
			attr_dev(label40, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label40, "for", "mlt-correctans");
			add_location(label40, file$h, 331, 40, 25476);
			attr_dev(textarea3, "type", "text");
			attr_dev(textarea3, "class", "form-control form-control-md validate");
			attr_dev(textarea3, "id", "mlt-correctans");
			attr_dev(textarea3, "name", "correctans");
			attr_dev(textarea3, "placeholder", textarea3_placeholder_value = Lang.crct_ans_multiline);
			add_location(textarea3, file$h, 332, 40, 25634);
			attr_dev(div103, "class", "form-group");
			add_location(div103, file$h, 330, 36, 25410);
			attr_dev(div104, "class", "col-sm-12 px-1");
			add_location(div104, file$h, 329, 32, 25344);
			attr_dev(label41, "class", "control-label font-weight-normal mb-0");
			attr_dev(label41, "for", "mlt-defaultans");
			add_location(label41, file$h, 337, 40, 26045);
			attr_dev(textarea4, "type", "text");
			attr_dev(textarea4, "class", "form-control form-control-md");
			attr_dev(textarea4, "id", "mlt-defaultans");
			attr_dev(textarea4, "name", "defaultans");
			attr_dev(textarea4, "placeholder", textarea4_placeholder_value = Lang.def_ans_multiline);
			add_location(textarea4, file$h, 338, 40, 26187);
			attr_dev(div105, "class", "form-group");
			add_location(div105, file$h, 336, 36, 25979);
			attr_dev(div106, "class", "col-sm-12 px-1 d-none");
			add_location(div106, file$h, 335, 32, 25906);
			attr_dev(label42, "class", "control-label font-weight-normal mb-0");
			attr_dev(label42, "for", "mlt-placeholder");
			add_location(label42, file$h, 343, 40, 26581);
			attr_dev(input35, "type", "text");
			attr_dev(input35, "class", "form-control form-control-md");
			attr_dev(input35, "id", "mlt-placeholder");
			attr_dev(input35, "name", "placeholder");
			attr_dev(input35, "placeholder", input35_placeholder_value = Lang.placeholder_multiline);
			add_location(input35, file$h, 344, 40, 26721);
			attr_dev(div107, "class", "form-group");
			add_location(div107, file$h, 342, 36, 26515);
			attr_dev(div108, "class", "col-sm-12 px-1");
			add_location(div108, file$h, 341, 32, 26449);
			attr_dev(label43, "class", "control-label font-weight-normal mb-0");
			attr_dev(label43, "for", "mlt-parser");
			add_location(label43, file$h, 349, 40, 27109);
			option10.__value = "";
			option10.value = option10.__value;
			add_location(option10, file$h, 351, 44, 27360);
			option11.__value = "sql";
			option11.value = option11.__value;
			add_location(option11, file$h, 352, 44, 27455);
			attr_dev(select5, "class", "form-control form-control-md");
			attr_dev(select5, "id", "mlt-parser");
			attr_dev(select5, "name", "parser");
			add_location(select5, file$h, 350, 40, 27239);
			attr_dev(div109, "class", "form-group");
			add_location(div109, file$h, 348, 36, 27043);
			attr_dev(div110, "class", "col-sm-12 px-1");
			add_location(div110, file$h, 347, 32, 26977);
			attr_dev(input36, "type", "checkbox");
			attr_dev(input36, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input36, "id", "mlt-nocase");
			attr_dev(input36, "name", "nocase");
			attr_dev(input36, "defaultvalue", "1");
			add_location(input36, file$h, 358, 40, 27821);
			attr_dev(label44, "class", "control-label form-check-label font-weight-normal mb-0");
			attr_dev(label44, "for", "mlt-nocase");
			add_location(label44, file$h, 359, 40, 27983);
			attr_dev(div111, "class", "form-group form-check form-check-inline");
			add_location(div111, file$h, 357, 36, 27726);
			attr_dev(div112, "class", "col-sm-12 px-1");
			add_location(div112, file$h, 356, 32, 27660);
			attr_dev(input37, "type", "hidden");
			attr_dev(input37, "id", "mlt-id");
			attr_dev(input37, "name", "id");
			add_location(input37, file$h, 362, 32, 28216);
			attr_dev(div113, "class", "row");
			add_location(div113, file$h, 328, 28, 25293);
			attr_dev(div114, "class", "col-sm-12");
			add_location(div114, file$h, 299, 24, 22873);
			attr_dev(label45, "class", "control-label font-weight-normal mb-0");
			attr_dev(label45, "for", "mlt-style");
			add_location(label45, file$h, 367, 32, 28482);
			attr_dev(textarea5, "id", "mlt-style");
			attr_dev(textarea5, "class", "form-control form-control-md height_34");
			attr_dev(textarea5, "name", "style");
			attr_dev(textarea5, "placeholder", "CSS style of Multiline");
			add_location(textarea5, file$h, 368, 32, 28606);
			attr_dev(div115, "class", "form-group");
			add_location(div115, file$h, 366, 28, 28424);
			attr_dev(label46, "class", "control-label font-weight-normal mb-0");
			attr_dev(label46, "for", "custom_class");
			add_location(label46, file$h, 371, 32, 28863);
			attr_dev(select6, "class", "form-control form-control-md");
			attr_dev(select6, "id", "custom_class");
			attr_dev(select6, "name", "custom_class");
			add_location(select6, file$h, 372, 32, 28990);
			attr_dev(div116, "class", "form-group");
			add_location(div116, file$h, 370, 28, 28805);
			attr_dev(div117, "class", "ev");
			attr_dev(div117, "type", "mlt");
			add_location(div117, file$h, 374, 28, 29148);
			attr_dev(div118, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div118, file$h, 365, 24, 28355);
			attr_dev(div119, "class", "row mx-0");
			add_location(div119, file$h, 298, 20, 22825);
			attr_dev(div120, "class", "multiline h");
			add_location(div120, file$h, 297, 16, 22778);
			attr_dev(label47, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label47, "for", "chk-width");
			add_location(label47, file$h, 386, 40, 29688);
			attr_dev(input38, "type", "text");
			attr_dev(input38, "class", "form-control form-control-md validate number_validate");
			attr_dev(input38, "id", "chk-width");
			attr_dev(input38, "name", "width");
			attr_dev(input38, "placeholder", "Width of Checkbox");
			attr_dev(input38, "defaultvalue", "20");
			add_location(input38, file$h, 387, 40, 29839);
			attr_dev(div121, "class", "form-group");
			add_location(div121, file$h, 385, 36, 29622);
			attr_dev(div122, "class", "col-sm-6 px-1");
			add_location(div122, file$h, 384, 32, 29557);
			attr_dev(label48, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label48, "for", "chk-height");
			add_location(label48, file$h, 392, 40, 30248);
			attr_dev(input39, "type", "text");
			attr_dev(input39, "class", "form-control form-control-md validate number_validate");
			attr_dev(input39, "id", "chk-height");
			attr_dev(input39, "name", "height");
			attr_dev(input39, "placeholder", input39_placeholder_value = Lang.height_of_checkbox);
			attr_dev(input39, "defaultvalue", "20");
			add_location(input39, file$h, 393, 40, 30401);
			attr_dev(div123, "class", "form-group");
			add_location(div123, file$h, 391, 36, 30182);
			attr_dev(div124, "class", "col-sm-6 px-1");
			add_location(div124, file$h, 390, 32, 30117);
			attr_dev(div125, "class", "row");
			add_location(div125, file$h, 383, 28, 29506);
			attr_dev(label49, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label49, "for", "chk-top");
			add_location(label49, file$h, 400, 40, 30900);
			attr_dev(input40, "type", "text");
			attr_dev(input40, "class", "form-control form-control-md validate number_validate");
			attr_dev(input40, "id", "chk-top");
			attr_dev(input40, "name", "top");
			attr_dev(input40, "placeholder", input40_placeholder_value = Lang.top_of_checkbox);
			add_location(input40, file$h, 401, 40, 31040);
			attr_dev(div126, "class", "form-group");
			add_location(div126, file$h, 399, 36, 30834);
			attr_dev(div127, "class", "col-sm-6 px-1");
			add_location(div127, file$h, 398, 32, 30769);
			attr_dev(label50, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label50, "for", "chk-left");
			add_location(label50, file$h, 406, 40, 31429);
			attr_dev(input41, "type", "text");
			attr_dev(input41, "class", "form-control form-control-md validate number_validate");
			attr_dev(input41, "id", "chk-left");
			attr_dev(input41, "name", "left");
			attr_dev(input41, "placeholder", input41_placeholder_value = Lang.left_of_checkbox);
			add_location(input41, file$h, 407, 40, 31571);
			attr_dev(div128, "class", "form-group");
			add_location(div128, file$h, 405, 36, 31363);
			attr_dev(div129, "class", "col-sm-6 px-1");
			add_location(div129, file$h, 404, 32, 31298);
			attr_dev(div130, "class", "row");
			add_location(div130, file$h, 397, 28, 30718);
			attr_dev(label51, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label51, "for", "chk-correctans");
			add_location(label51, file$h, 414, 40, 32047);
			attr_dev(input42, "type", "text");
			attr_dev(input42, "class", "form-control form-control-md validate");
			attr_dev(input42, "id", "chk-correctans");
			attr_dev(input42, "name", "correctans");
			attr_dev(input42, "placeholder", input42_placeholder_value = Lang.crct_of_chk);
			add_location(input42, file$h, 415, 40, 32205);
			attr_dev(div131, "class", "form-group");
			add_location(div131, file$h, 413, 36, 31981);
			attr_dev(div132, "class", "col-sm-12 px-1");
			add_location(div132, file$h, 412, 32, 31915);
			attr_dev(label52, "class", "control-label font-weight-normal mb-0");
			attr_dev(label52, "for", "chk-defaultans");
			add_location(label52, file$h, 420, 40, 32590);
			attr_dev(input43, "type", "text");
			attr_dev(input43, "class", "form-control form-control-md");
			attr_dev(input43, "id", "chk-defaultans");
			attr_dev(input43, "name", "defaultans");
			attr_dev(input43, "placeholder", input43_placeholder_value = Lang.def_of_chk);
			add_location(input43, file$h, 421, 40, 32732);
			attr_dev(div133, "class", "form-group");
			add_location(div133, file$h, 419, 36, 32524);
			attr_dev(div134, "class", "col-sm-12 px-1");
			add_location(div134, file$h, 418, 32, 32458);
			attr_dev(input44, "type", "hidden");
			attr_dev(input44, "id", "chk-id");
			attr_dev(input44, "name", "id");
			add_location(input44, file$h, 424, 32, 32975);
			attr_dev(div135, "class", "row");
			add_location(div135, file$h, 411, 28, 31864);
			attr_dev(div136, "class", "col-sm-12");
			add_location(div136, file$h, 382, 24, 29453);
			attr_dev(label53, "class", "control-label font-weight-normal mb-0");
			attr_dev(label53, "for", "chk-style");
			add_location(label53, file$h, 429, 32, 33241);
			attr_dev(textarea6, "id", "chk-style");
			attr_dev(textarea6, "class", "form-control form-control-md height_34");
			attr_dev(textarea6, "name", "style");
			attr_dev(textarea6, "placeholder", textarea6_placeholder_value = Lang.css_of_chk);
			add_location(textarea6, file$h, 430, 32, 33365);
			attr_dev(div137, "class", "form-group");
			add_location(div137, file$h, 428, 28, 33183);
			attr_dev(div138, "class", "ev");
			attr_dev(div138, "type", "chk");
			add_location(div138, file$h, 432, 28, 33556);
			attr_dev(div139, "class", "col-sm-6 pr-1 pl-2 d-none");
			add_location(div139, file$h, 427, 24, 33114);
			attr_dev(div140, "class", "row mx-0");
			add_location(div140, file$h, 381, 20, 29405);
			attr_dev(div141, "class", "chekbox h");
			add_location(div141, file$h, 380, 16, 29360);
			attr_dev(label54, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label54, "for", "rd-width");
			add_location(label54, file$h, 444, 40, 34093);
			attr_dev(input45, "type", "text");
			attr_dev(input45, "class", "form-control form-control-md validate number_validate");
			attr_dev(input45, "id", "rd-width");
			attr_dev(input45, "name", "width");
			attr_dev(input45, "placeholder", input45_placeholder_value = Lang.width_of_radio);
			attr_dev(input45, "defaultvalue", "20");
			add_location(input45, file$h, 445, 40, 34243);
			attr_dev(div142, "class", "form-group");
			add_location(div142, file$h, 443, 36, 34027);
			attr_dev(div143, "class", "col-sm-6 px-1");
			add_location(div143, file$h, 442, 32, 33962);
			attr_dev(label55, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label55, "for", "rd-height");
			add_location(label55, file$h, 450, 40, 34652);
			attr_dev(input46, "type", "text");
			attr_dev(input46, "class", "form-control form-control-md validate number_validate");
			attr_dev(input46, "id", "rd-height");
			attr_dev(input46, "name", "height");
			attr_dev(input46, "placeholder", input46_placeholder_value = Lang.height_of_radio);
			attr_dev(input46, "defaultvalue", "20");
			add_location(input46, file$h, 451, 40, 34804);
			attr_dev(div144, "class", "form-group");
			add_location(div144, file$h, 449, 36, 34586);
			attr_dev(div145, "class", "col-sm-6 px-1");
			add_location(div145, file$h, 448, 32, 34521);
			attr_dev(div146, "class", "row");
			add_location(div146, file$h, 441, 28, 33911);
			attr_dev(label56, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label56, "for", "rd-top");
			add_location(label56, file$h, 458, 40, 35299);
			attr_dev(input47, "type", "text");
			attr_dev(input47, "class", "form-control form-control-md validate number_validate");
			attr_dev(input47, "id", "rd-top");
			attr_dev(input47, "name", "top");
			attr_dev(input47, "placeholder", input47_placeholder_value = Lang.top_of_radio);
			add_location(input47, file$h, 459, 40, 35438);
			attr_dev(div147, "class", "form-group");
			add_location(div147, file$h, 457, 36, 35233);
			attr_dev(div148, "class", "col-sm-6 px-1");
			add_location(div148, file$h, 456, 32, 35168);
			attr_dev(label57, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label57, "for", "rd-left");
			add_location(label57, file$h, 464, 40, 35823);
			attr_dev(input48, "type", "text");
			attr_dev(input48, "class", "form-control form-control-md validate number_validate");
			attr_dev(input48, "id", "rd-left");
			attr_dev(input48, "name", "left");
			attr_dev(input48, "placeholder", input48_placeholder_value = Lang.left_of_radio);
			add_location(input48, file$h, 465, 40, 35964);
			attr_dev(div149, "class", "form-group");
			add_location(div149, file$h, 463, 36, 35757);
			attr_dev(div150, "class", "col-sm-6 px-1");
			add_location(div150, file$h, 462, 32, 35692);
			attr_dev(div151, "class", "row");
			add_location(div151, file$h, 455, 28, 35117);
			attr_dev(label58, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label58, "for", "rd-name");
			add_location(label58, file$h, 472, 40, 36436);
			attr_dev(input49, "type", "text");
			attr_dev(input49, "class", "form-control form-control-md validate");
			attr_dev(input49, "id", "rd-name");
			attr_dev(input49, "name", "name");
			attr_dev(input49, "placeholder", "Name of Radio");
			add_location(input49, file$h, 473, 40, 36582);
			attr_dev(div152, "class", "form-group");
			add_location(div152, file$h, 471, 36, 36370);
			attr_dev(div153, "class", "col-sm-12 px-1");
			add_location(div153, file$h, 470, 32, 36304);
			attr_dev(label59, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label59, "for", "rd-correctans");
			add_location(label59, file$h, 478, 40, 36952);
			attr_dev(input50, "type", "text");
			attr_dev(input50, "class", "form-control form-control-md validate");
			attr_dev(input50, "id", "rd-correctans");
			attr_dev(input50, "name", "correctans");
			attr_dev(input50, "placeholder", input50_placeholder_value = Lang.crct_of_radio);
			add_location(input50, file$h, 479, 40, 37109);
			attr_dev(div154, "class", "form-group");
			add_location(div154, file$h, 477, 36, 36886);
			attr_dev(div155, "class", "col-sm-12 px-1");
			add_location(div155, file$h, 476, 32, 36820);
			attr_dev(label60, "class", "control-label font-weight-normal mb-0");
			attr_dev(label60, "for", "rd-defaultans");
			add_location(label60, file$h, 484, 40, 37495);
			attr_dev(input51, "type", "text");
			attr_dev(input51, "class", "form-control form-control-md");
			attr_dev(input51, "id", "rd-defaultans");
			attr_dev(input51, "name", "defaultans");
			attr_dev(input51, "placeholder", input51_placeholder_value = Lang.def_of_radio);
			add_location(input51, file$h, 485, 40, 37636);
			attr_dev(div156, "class", "form-group");
			add_location(div156, file$h, 483, 36, 37429);
			attr_dev(div157, "class", "col-sm-12 px-1");
			add_location(div157, file$h, 482, 32, 37363);
			attr_dev(label61, "class", "control-label font-weight-normal mb-0");
			attr_dev(label61, "for", "rd-checktype");
			add_location(label61, file$h, 490, 40, 38012);
			attr_dev(input52, "type", "text");
			attr_dev(input52, "class", "form-control form-control-md");
			attr_dev(input52, "id", "rd-checktype");
			attr_dev(input52, "name", "checktype");
			attr_dev(input52, "placeholder", input52_placeholder_value = Lang.chktype_of_radio);
			add_location(input52, file$h, 491, 40, 38146);
			attr_dev(div158, "class", "form-group");
			add_location(div158, file$h, 489, 36, 37946);
			attr_dev(div159, "class", "col-sm-12 px-1");
			add_location(div159, file$h, 488, 32, 37880);
			attr_dev(input53, "type", "hidden");
			attr_dev(input53, "id", "rd-id");
			attr_dev(input53, "name", "id");
			add_location(input53, file$h, 494, 32, 38392);
			attr_dev(div160, "class", "row");
			add_location(div160, file$h, 469, 28, 36253);
			attr_dev(div161, "class", "col-sm-12");
			add_location(div161, file$h, 440, 24, 33858);
			attr_dev(label62, "class", "control-label font-weight-normal mb-0");
			attr_dev(label62, "for", "rd-style");
			add_location(label62, file$h, 499, 32, 38657);
			attr_dev(textarea7, "id", "rd-style");
			attr_dev(textarea7, "class", "form-control form-control-md height_34");
			attr_dev(textarea7, "name", "style");
			attr_dev(textarea7, "placeholder", textarea7_placeholder_value = Lang.css_style_radio);
			add_location(textarea7, file$h, 500, 32, 38780);
			attr_dev(div162, "class", "form-group");
			add_location(div162, file$h, 498, 28, 38599);
			attr_dev(div163, "class", "ev");
			attr_dev(div163, "type", "rd");
			add_location(div163, file$h, 502, 28, 38975);
			attr_dev(div164, "class", "col-sm-6 pl-2 pr-1 d-none");
			add_location(div164, file$h, 497, 24, 38530);
			attr_dev(div165, "class", "row mx-0");
			add_location(div165, file$h, 439, 20, 33810);
			attr_dev(div166, "class", "rdio h");
			add_location(div166, file$h, 438, 16, 33768);
			attr_dev(label63, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label63, "for", "btn-width");
			add_location(label63, file$h, 514, 40, 39513);
			attr_dev(input54, "type", "text");
			attr_dev(input54, "class", "form-control form-control-md validate number_validate");
			attr_dev(input54, "id", "btn-width");
			attr_dev(input54, "name", "width");
			attr_dev(input54, "placeholder", input54_placeholder_value = Lang.width_of_button);
			attr_dev(input54, "defaultvalue", "100");
			add_location(input54, file$h, 515, 40, 39664);
			attr_dev(div167, "class", "form-group");
			add_location(div167, file$h, 513, 36, 39447);
			attr_dev(div168, "class", "col-sm-6 px-1");
			add_location(div168, file$h, 512, 32, 39382);
			attr_dev(label64, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label64, "for", "btn-height");
			add_location(label64, file$h, 520, 40, 40076);
			attr_dev(input55, "type", "text");
			attr_dev(input55, "class", "form-control form-control-md validate number_validate");
			attr_dev(input55, "id", "btn-height");
			attr_dev(input55, "name", "height");
			attr_dev(input55, "placeholder", input55_placeholder_value = Lang.height_of_button);
			attr_dev(input55, "defaultvalue", "30");
			add_location(input55, file$h, 521, 40, 40229);
			attr_dev(div169, "class", "form-group");
			add_location(div169, file$h, 519, 36, 40010);
			attr_dev(div170, "class", "col-sm-6 px-1");
			add_location(div170, file$h, 518, 32, 39945);
			attr_dev(div171, "class", "row");
			add_location(div171, file$h, 511, 28, 39331);
			attr_dev(label65, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label65, "for", "btn-top");
			add_location(label65, file$h, 528, 40, 40726);
			attr_dev(input56, "type", "text");
			attr_dev(input56, "class", "form-control form-control-md validate number_validate");
			attr_dev(input56, "id", "btn-top");
			attr_dev(input56, "name", "top");
			attr_dev(input56, "placeholder", input56_placeholder_value = Lang.top_of_button);
			add_location(input56, file$h, 529, 40, 40866);
			attr_dev(div172, "class", "form-group");
			add_location(div172, file$h, 527, 36, 40660);
			attr_dev(div173, "class", "col-sm-6 px-1");
			add_location(div173, file$h, 526, 32, 40595);
			attr_dev(label66, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label66, "for", "btn-left");
			add_location(label66, file$h, 534, 40, 41253);
			attr_dev(input57, "type", "text");
			attr_dev(input57, "class", "form-control form-control-md validate number_validate");
			attr_dev(input57, "id", "btn-left");
			attr_dev(input57, "name", "left");
			attr_dev(input57, "placeholder", input57_placeholder_value = Lang.left_of_button);
			add_location(input57, file$h, 535, 40, 41395);
			attr_dev(div174, "class", "form-group");
			add_location(div174, file$h, 533, 36, 41187);
			attr_dev(div175, "class", "col-sm-6 px-1");
			add_location(div175, file$h, 532, 32, 41122);
			attr_dev(div176, "class", "row");
			add_location(div176, file$h, 525, 28, 40544);
			attr_dev(label67, "class", "control-label font-weight-normal mb-0");
			attr_dev(label67, "for", "btn-value");
			add_location(label67, file$h, 542, 40, 41869);
			attr_dev(input58, "type", "text");
			attr_dev(input58, "class", "form-control form-control-md");
			attr_dev(input58, "id", "btn-value");
			attr_dev(input58, "name", "value");
			attr_dev(input58, "placeholder", input58_placeholder_value = Lang.value_of_button);
			add_location(input58, file$h, 543, 40, 41993);
			attr_dev(div177, "class", "form-group");
			add_location(div177, file$h, 541, 36, 41803);
			attr_dev(div178, "class", "col-sm-12 px-1");
			add_location(div178, file$h, 540, 32, 41737);
			attr_dev(label68, "class", "control-label font-weight-normal mb-0");
			attr_dev(label68, "for", "btn-class");
			add_location(label68, file$h, 548, 40, 42363);
			attr_dev(input59, "type", "text");
			attr_dev(input59, "class", "form-control form-control-md");
			attr_dev(input59, "id", "btn-class");
			attr_dev(input59, "name", "class");
			attr_dev(input59, "placeholder", input59_placeholder_value = Lang.class_of_button);
			add_location(input59, file$h, 549, 40, 42491);
			attr_dev(div179, "class", "form-group");
			add_location(div179, file$h, 547, 36, 42297);
			attr_dev(input60, "type", "hidden");
			attr_dev(input60, "id", "btn-id");
			attr_dev(input60, "name", "id");
			add_location(input60, file$h, 551, 36, 42693);
			attr_dev(div180, "class", "col-sm-12 px-1");
			add_location(div180, file$h, 546, 32, 42231);
			attr_dev(div181, "class", "row");
			add_location(div181, file$h, 539, 28, 41686);
			attr_dev(div182, "class", "col-sm-12");
			add_location(div182, file$h, 510, 24, 39278);
			attr_dev(label69, "class", "control-label font-weight-normal mb-0");
			attr_dev(label69, "for", "btn-style");
			add_location(label69, file$h, 557, 32, 42999);
			attr_dev(textarea8, "id", "btn-style");
			attr_dev(textarea8, "class", "form-control form-control-md height_34");
			attr_dev(textarea8, "name", "style");
			attr_dev(textarea8, "placeholder", textarea8_placeholder_value = Lang.css_style_btn);
			add_location(textarea8, file$h, 558, 32, 43123);
			attr_dev(div183, "class", "form-group");
			add_location(div183, file$h, 556, 28, 42941);
			attr_dev(div184, "class", "ev");
			attr_dev(div184, "type", "btn");
			add_location(div184, file$h, 560, 28, 43317);
			attr_dev(div185, "class", "col-sm-6 pr-1 pl-2 d-none");
			add_location(div185, file$h, 555, 24, 42872);
			attr_dev(div186, "class", "row mx-0");
			add_location(div186, file$h, 509, 20, 39230);
			attr_dev(div187, "class", "button h");
			add_location(div187, file$h, 508, 16, 39186);
			attr_dev(label70, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label70, "for", "ddn-width");
			add_location(label70, file$h, 572, 40, 43858);
			attr_dev(input61, "type", "text");
			attr_dev(input61, "class", "form-control form-control-md validate number_validate");
			attr_dev(input61, "id", "ddn-width");
			attr_dev(input61, "name", "width");
			attr_dev(input61, "placeholder", input61_placeholder_value = Lang.width_of_dropdown);
			attr_dev(input61, "defaultvalue", "100");
			add_location(input61, file$h, 573, 40, 44009);
			attr_dev(div188, "class", "form-group");
			add_location(div188, file$h, 571, 36, 43792);
			attr_dev(div189, "class", "col-sm-6 px-1");
			add_location(div189, file$h, 570, 32, 43727);
			attr_dev(label71, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label71, "for", "ddn-height");
			add_location(label71, file$h, 578, 40, 44423);
			attr_dev(input62, "type", "text");
			attr_dev(input62, "class", "form-control form-control-md validate number_validate");
			attr_dev(input62, "id", "ddn-height");
			attr_dev(input62, "name", "height");
			attr_dev(input62, "placeholder", input62_placeholder_value = Lang.height_of_dropdown);
			attr_dev(input62, "defaultvalue", "30");
			add_location(input62, file$h, 579, 40, 44576);
			attr_dev(div190, "class", "form-group");
			add_location(div190, file$h, 577, 36, 44357);
			attr_dev(div191, "class", "col-sm-6 px-1");
			add_location(div191, file$h, 576, 32, 44292);
			attr_dev(div192, "class", "row");
			add_location(div192, file$h, 569, 28, 43676);
			attr_dev(label72, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label72, "for", "ddn-top");
			add_location(label72, file$h, 586, 40, 45075);
			attr_dev(input63, "type", "text");
			attr_dev(input63, "class", "form-control form-control-md validate number_validate");
			attr_dev(input63, "id", "ddn-top");
			attr_dev(input63, "name", "top");
			attr_dev(input63, "placeholder", input63_placeholder_value = Lang.top_of_dropdown);
			add_location(input63, file$h, 587, 40, 45215);
			attr_dev(div193, "class", "form-group");
			add_location(div193, file$h, 585, 36, 45009);
			attr_dev(div194, "class", "col-sm-6 px-1");
			add_location(div194, file$h, 584, 32, 44944);
			attr_dev(label73, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label73, "for", "ddn-left");
			add_location(label73, file$h, 592, 40, 45604);
			attr_dev(input64, "type", "text");
			attr_dev(input64, "class", "form-control form-control-md validate number_validate");
			attr_dev(input64, "id", "ddn-left");
			attr_dev(input64, "name", "left");
			attr_dev(input64, "placeholder", input64_placeholder_value = Lang.left_of_dropdown);
			add_location(input64, file$h, 593, 40, 45746);
			attr_dev(div195, "class", "form-group");
			add_location(div195, file$h, 591, 36, 45538);
			attr_dev(div196, "class", "col-sm-6 px-1");
			add_location(div196, file$h, 590, 32, 45473);
			attr_dev(div197, "class", "row");
			add_location(div197, file$h, 583, 28, 44893);
			attr_dev(label74, "class", "control-label font-weight-normal mb-0");
			attr_dev(label74, "for", "ddn-value");
			add_location(label74, file$h, 600, 40, 46222);
			attr_dev(textarea9, "class", "form-control form-control-md");
			attr_dev(textarea9, "id", "ddn-value");
			attr_dev(textarea9, "name", "value");
			attr_dev(textarea9, "placeholder", textarea9_placeholder_value = Lang.option_of_dropdown);
			add_location(textarea9, file$h, 601, 40, 46352);
			attr_dev(div198, "class", "form-group");
			add_location(div198, file$h, 599, 36, 46156);
			attr_dev(input65, "type", "hidden");
			attr_dev(input65, "id", "ddn-id");
			attr_dev(input65, "name", "id");
			add_location(input65, file$h, 603, 36, 46557);
			attr_dev(div199, "class", "col-sm-12 px-1");
			add_location(div199, file$h, 598, 32, 46090);
			attr_dev(div200, "class", "row");
			add_location(div200, file$h, 597, 28, 46039);
			attr_dev(div201, "class", "col-sm-12");
			add_location(div201, file$h, 568, 24, 43623);
			attr_dev(label75, "class", "control-label font-weight-normal mb-0");
			attr_dev(label75, "for", "ddn-style");
			add_location(label75, file$h, 609, 32, 46863);
			attr_dev(textarea10, "id", "ddn-style");
			attr_dev(textarea10, "class", "form-control form-control-md height_34");
			attr_dev(textarea10, "name", "style");
			attr_dev(textarea10, "placeholder", textarea10_placeholder_value = Lang.css_style_of_drpdwn);
			add_location(textarea10, file$h, 610, 32, 46987);
			attr_dev(div202, "class", "form-group");
			add_location(div202, file$h, 608, 28, 46805);
			attr_dev(div203, "class", "ev");
			attr_dev(div203, "type", "ddn");
			add_location(div203, file$h, 612, 28, 47187);
			attr_dev(div204, "class", "col-sm-6 pr-1 pl-2 d-none");
			add_location(div204, file$h, 607, 24, 46736);
			attr_dev(div205, "class", "row mx-0");
			add_location(div205, file$h, 567, 20, 43575);
			attr_dev(div206, "class", "dropdown h");
			add_location(div206, file$h, 566, 16, 43529);
			attr_dev(label76, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label76, "for", "lst-width");
			add_location(label76, file$h, 624, 40, 47726);
			attr_dev(input66, "type", "text");
			attr_dev(input66, "class", "form-control form-control-md validate number_validate");
			attr_dev(input66, "id", "lst-width");
			attr_dev(input66, "name", "width");
			attr_dev(input66, "placeholder", input66_placeholder_value = Lang.width_of_listbox);
			attr_dev(input66, "defaultvalue", "100");
			add_location(input66, file$h, 625, 40, 47877);
			attr_dev(div207, "class", "form-group");
			add_location(div207, file$h, 623, 36, 47660);
			attr_dev(div208, "class", "col-sm-6 px-1");
			add_location(div208, file$h, 622, 32, 47595);
			attr_dev(label77, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label77, "for", "lst-height");
			add_location(label77, file$h, 630, 40, 48290);
			attr_dev(input67, "type", "text");
			attr_dev(input67, "class", "form-control form-control-md validate number_validate");
			attr_dev(input67, "id", "lst-height");
			attr_dev(input67, "name", "height");
			attr_dev(input67, "placeholder", input67_placeholder_value = Lang.height_of_listbox);
			attr_dev(input67, "defaultvalue", "30");
			add_location(input67, file$h, 631, 40, 48443);
			attr_dev(div209, "class", "form-group");
			add_location(div209, file$h, 629, 36, 48224);
			attr_dev(div210, "class", "col-sm-6 px-1");
			add_location(div210, file$h, 628, 32, 48159);
			attr_dev(div211, "class", "row");
			add_location(div211, file$h, 621, 28, 47544);
			attr_dev(label78, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label78, "for", "lst-top");
			add_location(label78, file$h, 638, 40, 48941);
			attr_dev(input68, "type", "text");
			attr_dev(input68, "class", "form-control form-control-md validate number_validate");
			attr_dev(input68, "id", "lst-top");
			attr_dev(input68, "name", "top");
			attr_dev(input68, "placeholder", input68_placeholder_value = Lang.top_of_listbox);
			add_location(input68, file$h, 639, 40, 49081);
			attr_dev(div212, "class", "form-group");
			add_location(div212, file$h, 637, 36, 48875);
			attr_dev(div213, "class", "col-sm-6 px-1");
			add_location(div213, file$h, 636, 32, 48810);
			attr_dev(label79, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label79, "for", "lst-left");
			add_location(label79, file$h, 644, 40, 49469);
			attr_dev(input69, "type", "text");
			attr_dev(input69, "class", "form-control form-control-md validate number_validate");
			attr_dev(input69, "id", "lst-left");
			attr_dev(input69, "name", "left");
			attr_dev(input69, "placeholder", input69_placeholder_value = Lang.left_of_listbox);
			add_location(input69, file$h, 645, 40, 49611);
			attr_dev(div214, "class", "form-group");
			add_location(div214, file$h, 643, 36, 49403);
			attr_dev(div215, "class", "col-sm-6 px-1");
			add_location(div215, file$h, 642, 32, 49338);
			attr_dev(div216, "class", "row");
			add_location(div216, file$h, 635, 28, 48759);
			attr_dev(label80, "class", "control-label font-weight-normal mb-0");
			attr_dev(label80, "for", "lst-value");
			add_location(label80, file$h, 652, 40, 50086);
			attr_dev(textarea11, "class", "form-control form-control-md");
			attr_dev(textarea11, "id", "lst-value");
			attr_dev(textarea11, "name", "value");
			attr_dev(textarea11, "placeholder", textarea11_placeholder_value = Lang.option_of_listbox);
			add_location(textarea11, file$h, 653, 40, 50216);
			attr_dev(div217, "class", "form-group");
			add_location(div217, file$h, 651, 36, 50020);
			attr_dev(div218, "class", "col-sm-12 px-1");
			add_location(div218, file$h, 650, 32, 49954);
			attr_dev(input70, "type", "checkbox");
			attr_dev(input70, "class", "checkbox form-check-input margin-bottom");
			attr_dev(input70, "id", "lst-multiple");
			attr_dev(input70, "name", "multiple");
			attr_dev(input70, "defaultvalue", "1");
			add_location(input70, file$h, 658, 40, 50617);
			attr_dev(label81, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label81, "for", "lst-multiple");
			add_location(label81, file$h, 659, 40, 50782);
			attr_dev(div219, "class", "form-group form-check form-check-inline");
			add_location(div219, file$h, 657, 36, 50522);
			attr_dev(div220, "class", "col-sm-12 px-1");
			add_location(div220, file$h, 656, 32, 50456);
			attr_dev(input71, "type", "hidden");
			attr_dev(input71, "id", "lst-size");
			attr_dev(input71, "name", "size");
			attr_dev(input71, "defaultvalue", "3");
			add_location(input71, file$h, 662, 32, 51016);
			attr_dev(input72, "type", "hidden");
			attr_dev(input72, "id", "lst-id");
			attr_dev(input72, "name", "id");
			add_location(input72, file$h, 663, 32, 51116);
			attr_dev(div221, "class", "row");
			add_location(div221, file$h, 649, 28, 49903);
			attr_dev(div222, "class", "col-sm-6");
			add_location(div222, file$h, 620, 24, 47492);
			attr_dev(label82, "class", "control-label font-weight-normal mb-0");
			attr_dev(label82, "for", "lst-style");
			add_location(label82, file$h, 668, 32, 51375);
			attr_dev(textarea12, "id", "lst-style");
			attr_dev(textarea12, "class", "form-control form-control-md height_34");
			attr_dev(textarea12, "name", "style");
			attr_dev(textarea12, "placeholder", textarea12_placeholder_value = Lang.css_style_of_listbox);
			add_location(textarea12, file$h, 669, 32, 51499);
			attr_dev(div223, "class", "form-group");
			add_location(div223, file$h, 667, 28, 51317);
			attr_dev(div224, "class", "ev");
			attr_dev(div224, "type", "lst");
			add_location(div224, file$h, 671, 28, 51700);
			attr_dev(div225, "class", "col-sm-6 pr-1 pl-2");
			add_location(div225, file$h, 666, 24, 51255);
			attr_dev(div226, "class", "row mx-0");
			add_location(div226, file$h, 619, 20, 47444);
			attr_dev(div227, "class", "listbox h");
			add_location(div227, file$h, 618, 16, 47399);
			attr_dev(label83, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label83, "for", "tbd-width");
			add_location(label83, file$h, 684, 40, 52306);
			attr_dev(input73, "type", "text");
			attr_dev(input73, "class", "form-control form-control-md validate number_validate");
			attr_dev(input73, "id", "tbd-width");
			attr_dev(input73, "name", "width");
			attr_dev(input73, "placeholder", input73_placeholder_value = Lang.width_of_tabhead);
			attr_dev(input73, "defaultvalue", "100");
			add_location(input73, file$h, 685, 40, 52457);
			attr_dev(div228, "class", "form-group");
			add_location(div228, file$h, 683, 36, 52240);
			attr_dev(div229, "class", "col-sm-6 px-1");
			add_location(div229, file$h, 682, 32, 52175);
			attr_dev(label84, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label84, "for", "tbd-height");
			add_location(label84, file$h, 690, 40, 52870);
			attr_dev(input74, "type", "text");
			attr_dev(input74, "class", "form-control form-control-md validate number_validate");
			attr_dev(input74, "id", "tbd-height");
			attr_dev(input74, "name", "height");
			attr_dev(input74, "placeholder", input74_placeholder_value = Lang.height_of_tabhead);
			attr_dev(input74, "defaultvalue", "30");
			add_location(input74, file$h, 691, 40, 53023);
			attr_dev(div230, "class", "form-group");
			add_location(div230, file$h, 689, 36, 52804);
			attr_dev(div231, "class", "col-sm-6 px-1");
			add_location(div231, file$h, 688, 32, 52739);
			attr_dev(div232, "class", "row");
			add_location(div232, file$h, 681, 28, 52124);
			attr_dev(label85, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label85, "for", "tbd-top");
			add_location(label85, file$h, 698, 40, 53521);
			attr_dev(input75, "type", "text");
			attr_dev(input75, "class", "form-control form-control-md validate number_validate");
			attr_dev(input75, "id", "tbd-top");
			attr_dev(input75, "name", "top");
			attr_dev(input75, "placeholder", input75_placeholder_value = Lang.top_of_tabhead);
			add_location(input75, file$h, 699, 40, 53661);
			attr_dev(div233, "class", "form-group");
			add_location(div233, file$h, 697, 36, 53455);
			attr_dev(div234, "class", "col-sm-6 px-1");
			add_location(div234, file$h, 696, 32, 53390);
			attr_dev(label86, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label86, "for", "tbd-left");
			add_location(label86, file$h, 704, 40, 54049);
			attr_dev(input76, "type", "text");
			attr_dev(input76, "class", "form-control form-control-md validate number_validate");
			attr_dev(input76, "id", "tbd-left");
			attr_dev(input76, "name", "left");
			attr_dev(input76, "placeholder", input76_placeholder_value = Lang.left_of_tabhead);
			add_location(input76, file$h, 705, 40, 54191);
			attr_dev(div235, "class", "form-group");
			add_location(div235, file$h, 703, 36, 53983);
			attr_dev(div236, "class", "col-sm-6 px-1");
			add_location(div236, file$h, 702, 32, 53918);
			attr_dev(div237, "class", "row");
			add_location(div237, file$h, 695, 28, 53339);
			attr_dev(label87, "class", "control-label font-weight-normal mb-0");
			attr_dev(label87, "for", "tbd-title");
			add_location(label87, file$h, 712, 40, 54666);
			attr_dev(input77, "type", "text");
			attr_dev(input77, "class", "form-control form-control-md");
			attr_dev(input77, "id", "tbd-title");
			attr_dev(input77, "name", "title");
			attr_dev(input77, "placeholder", input77_placeholder_value = Lang.title_of_tabhead);
			add_location(input77, file$h, 713, 40, 54794);
			attr_dev(div238, "class", "form-group");
			add_location(div238, file$h, 711, 36, 54600);
			attr_dev(div239, "class", "col-sm-12 px-1");
			add_location(div239, file$h, 710, 32, 54534);
			attr_dev(label88, "class", "control-label font-weight-normal mb-0");
			attr_dev(label88, "for", "tbd-class");
			add_location(label88, file$h, 718, 40, 55165);
			attr_dev(input78, "type", "text");
			attr_dev(input78, "class", "form-control form-control-md");
			attr_dev(input78, "id", "tbd-class");
			attr_dev(input78, "name", "class");
			attr_dev(input78, "placeholder", input78_placeholder_value = Lang.class_of_tabhead);
			add_location(input78, file$h, 719, 40, 55293);
			attr_dev(div240, "class", "form-group");
			add_location(div240, file$h, 717, 36, 55099);
			attr_dev(input79, "type", "hidden");
			attr_dev(input79, "id", "tbd-id");
			attr_dev(input79, "name", "id");
			add_location(input79, file$h, 721, 36, 55496);
			attr_dev(div241, "class", "col-sm-12 px-1");
			add_location(div241, file$h, 716, 32, 55033);
			attr_dev(div242, "class", "row");
			add_location(div242, file$h, 709, 28, 54483);
			attr_dev(div243, "class", div243_class_value = /*isDNDExtended*/ ctx[0] == 1 ? "col-sm-6" : "col-sm-12");
			add_location(div243, file$h, 680, 24, 52031);
			attr_dev(div244, "class", "row mx-0");
			add_location(div244, file$h, 678, 20, 51957);
			attr_dev(div245, "class", "tabhead h");
			add_location(div245, file$h, 677, 16, 51912);
			attr_dev(label89, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label89, "for", "img-width");
			add_location(label89, file$h, 744, 40, 56772);
			attr_dev(input80, "type", "text");
			attr_dev(input80, "class", "form-control form-control-md validate number_validate");
			attr_dev(input80, "id", "img-width");
			attr_dev(input80, "name", "width");
			attr_dev(input80, "placeholder", input80_placeholder_value = Lang.width_of_image);
			attr_dev(input80, "defaultvalue", "100");
			add_location(input80, file$h, 745, 40, 56923);
			attr_dev(div246, "class", "form-group");
			add_location(div246, file$h, 743, 36, 56706);
			attr_dev(div247, "class", "col-sm-6 px-1");
			add_location(div247, file$h, 742, 32, 56641);
			attr_dev(label90, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label90, "for", "img-height");
			add_location(label90, file$h, 750, 40, 57334);
			attr_dev(input81, "type", "text");
			attr_dev(input81, "class", "form-control form-control-md validate number_validate");
			attr_dev(input81, "id", "img-height");
			attr_dev(input81, "name", "height");
			attr_dev(input81, "placeholder", input81_placeholder_value = Lang.height_of_image);
			attr_dev(input81, "defaultvalue", "30");
			add_location(input81, file$h, 751, 40, 57487);
			attr_dev(div248, "class", "form-group");
			add_location(div248, file$h, 749, 36, 57268);
			attr_dev(div249, "class", "col-sm-6 px-1");
			add_location(div249, file$h, 748, 32, 57203);
			attr_dev(div250, "class", "row");
			add_location(div250, file$h, 741, 28, 56590);
			attr_dev(label91, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label91, "for", "img-top");
			add_location(label91, file$h, 758, 40, 57983);
			attr_dev(input82, "type", "text");
			attr_dev(input82, "class", "form-control form-control-md validate number_validate");
			attr_dev(input82, "id", "img-top");
			attr_dev(input82, "name", "top");
			attr_dev(input82, "placeholder", input82_placeholder_value = Lang.top_of_image);
			add_location(input82, file$h, 759, 40, 58123);
			attr_dev(div251, "class", "form-group");
			add_location(div251, file$h, 757, 36, 57917);
			attr_dev(div252, "class", "col-sm-6 px-1");
			add_location(div252, file$h, 756, 32, 57852);
			attr_dev(label92, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label92, "for", "img-left");
			add_location(label92, file$h, 764, 40, 58509);
			attr_dev(input83, "type", "text");
			attr_dev(input83, "class", "form-control form-control-md validate number_validate");
			attr_dev(input83, "id", "img-left");
			attr_dev(input83, "name", "left");
			attr_dev(input83, "placeholder", input83_placeholder_value = Lang.left_of_image);
			add_location(input83, file$h, 765, 40, 58651);
			attr_dev(div253, "class", "form-group");
			add_location(div253, file$h, 763, 36, 58443);
			attr_dev(div254, "class", "col-sm-6 px-1");
			add_location(div254, file$h, 762, 32, 58378);
			attr_dev(div255, "class", "row");
			add_location(div255, file$h, 755, 28, 57801);
			attr_dev(label93, "class", "control-label font-weight-normal mb-0");
			attr_dev(label93, "for", "img-title");
			add_location(label93, file$h, 772, 40, 59124);
			attr_dev(input84, "type", "text");
			attr_dev(input84, "class", "form-control form-control-md");
			attr_dev(input84, "id", "img-title");
			attr_dev(input84, "name", "title");
			attr_dev(input84, "placeholder", input84_placeholder_value = Lang.title_of_image);
			add_location(input84, file$h, 773, 40, 59252);
			attr_dev(div256, "class", "form-group");
			add_location(div256, file$h, 771, 36, 59058);
			attr_dev(div257, "class", "col-sm-12 px-1");
			add_location(div257, file$h, 770, 32, 58992);
			attr_dev(label94, "class", "control-label font-weight-normal mb-0");
			attr_dev(label94, "for", "img-bgimg");
			add_location(label94, file$h, 778, 40, 59621);
			attr_dev(input85, "type", "text");
			attr_dev(input85, "class", "form-control form-control-md");
			attr_dev(input85, "id", "img-bgimg");
			attr_dev(input85, "name", "bgimg");
			attr_dev(input85, "placeholder", input85_placeholder_value = Lang.bg_of_img);
			add_location(input85, file$h, 779, 40, 59760);
			attr_dev(input86, "type", "hidden");
			attr_dev(input86, "id", "img-id");
			attr_dev(input86, "name", "id");
			add_location(input86, file$h, 780, 40, 59916);
			attr_dev(div258, "class", "form-group");
			add_location(div258, file$h, 777, 36, 59555);
			attr_dev(div259, "class", "col-sm-12 px-1");
			add_location(div259, file$h, 776, 32, 59489);
			attr_dev(div260, "class", "row");
			add_location(div260, file$h, 769, 28, 58941);
			attr_dev(div261, "class", "col-sm-6");
			add_location(div261, file$h, 740, 24, 56538);
			attr_dev(label95, "class", "control-label font-weight-normal mb-0");
			attr_dev(label95, "for", "img-style");
			add_location(label95, file$h, 787, 32, 60259);
			attr_dev(textarea13, "id", "img-style");
			attr_dev(textarea13, "class", "form-control form-control-md height_34");
			attr_dev(textarea13, "name", "style");
			attr_dev(textarea13, "placeholder", textarea13_placeholder_value = Lang.css_style_of_image);
			add_location(textarea13, file$h, 788, 32, 60383);
			attr_dev(div262, "class", "form-group");
			add_location(div262, file$h, 786, 28, 60201);
			attr_dev(div263, "class", "ev");
			attr_dev(div263, "type", "img");
			add_location(div263, file$h, 790, 28, 60582);
			attr_dev(div264, "class", "col-sm-6 pr-1 pl-2");
			add_location(div264, file$h, 785, 24, 60139);
			attr_dev(div265, "class", "row mx-0");
			add_location(div265, file$h, 739, 20, 56490);
			attr_dev(div266, "class", "img h");
			add_location(div266, file$h, 738, 16, 56449);
			attr_dev(label96, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label96, "for", "lbl-width");
			add_location(label96, file$h, 802, 40, 61120);
			attr_dev(input87, "type", "text");
			attr_dev(input87, "class", "form-control form-control-md validate number_validate");
			attr_dev(input87, "id", "lbl-width");
			attr_dev(input87, "name", "width");
			attr_dev(input87, "placeholder", input87_placeholder_value = Lang.width_of_label);
			attr_dev(input87, "defaultvalue", "100");
			add_location(input87, file$h, 803, 40, 61271);
			attr_dev(div267, "class", "form-group");
			add_location(div267, file$h, 801, 36, 61054);
			attr_dev(div268, "class", "col-sm-6 px-1");
			add_location(div268, file$h, 800, 32, 60989);
			attr_dev(label97, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label97, "for", "lbl-height");
			add_location(label97, file$h, 808, 40, 61682);
			attr_dev(input88, "type", "text");
			attr_dev(input88, "class", "form-control form-control-md validate number_validate");
			attr_dev(input88, "id", "lbl-height");
			attr_dev(input88, "name", "height");
			attr_dev(input88, "placeholder", input88_placeholder_value = Lang.height_of_label);
			attr_dev(input88, "defaultvalue", "30");
			add_location(input88, file$h, 809, 40, 61835);
			attr_dev(div269, "class", "form-group");
			add_location(div269, file$h, 807, 36, 61616);
			attr_dev(div270, "class", "col-sm-6 px-1");
			add_location(div270, file$h, 806, 32, 61551);
			attr_dev(label98, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label98, "for", "lbl-top");
			add_location(label98, file$h, 814, 40, 62248);
			attr_dev(input89, "type", "text");
			attr_dev(input89, "class", "form-control form-control-md validate number_validate");
			attr_dev(input89, "id", "lbl-top");
			attr_dev(input89, "name", "top");
			attr_dev(input89, "placeholder", input89_placeholder_value = Lang.top_of_label);
			add_location(input89, file$h, 815, 40, 62388);
			attr_dev(div271, "class", "form-group");
			add_location(div271, file$h, 813, 36, 62182);
			attr_dev(div272, "class", "col-sm-6 px-1");
			add_location(div272, file$h, 812, 32, 62117);
			attr_dev(label99, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label99, "for", "lbl-left");
			add_location(label99, file$h, 820, 40, 62774);
			attr_dev(input90, "type", "text");
			attr_dev(input90, "class", "form-control form-control-md validate number_validate");
			attr_dev(input90, "id", "lbl-left");
			attr_dev(input90, "name", "left");
			attr_dev(input90, "placeholder", input90_placeholder_value = Lang.left_of_label);
			add_location(input90, file$h, 821, 40, 62916);
			attr_dev(div273, "class", "form-group");
			add_location(div273, file$h, 819, 36, 62708);
			attr_dev(div274, "class", "col-sm-6 px-1");
			add_location(div274, file$h, 818, 32, 62643);
			attr_dev(label100, "class", "control-label font-weight-normal mb-0");
			attr_dev(label100, "for", "lbl-title");
			add_location(label100, file$h, 826, 40, 63306);
			attr_dev(input91, "type", "text");
			attr_dev(input91, "class", "form-control form-control-md");
			attr_dev(input91, "id", "lbl-title");
			attr_dev(input91, "name", "title");
			attr_dev(input91, "placeholder", input91_placeholder_value = Lang.title_of_label);
			add_location(input91, file$h, 827, 40, 63434);
			attr_dev(div275, "class", "form-group");
			add_location(div275, file$h, 825, 36, 63240);
			attr_dev(div276, "class", "col-sm-12 px-1");
			add_location(div276, file$h, 824, 32, 63174);
			attr_dev(label101, "class", "control-label font-weight-normal mb-0");
			attr_dev(label101, "for", "lbl_border_size");
			add_location(label101, file$h, 832, 40, 63802);
			option12.__value = "0";
			option12.value = option12.__value;
			add_location(option12, file$h, 834, 44, 64083);
			option13.__value = "1";
			option13.value = option13.__value;
			add_location(option13, file$h, 835, 44, 64164);
			option14.__value = "2";
			option14.value = option14.__value;
			add_location(option14, file$h, 836, 44, 64238);
			option15.__value = "3";
			option15.value = option15.__value;
			add_location(option15, file$h, 837, 44, 64312);
			option16.__value = "4";
			option16.value = option16.__value;
			add_location(option16, file$h, 838, 44, 64386);
			option17.__value = "5";
			option17.value = option17.__value;
			add_location(option17, file$h, 839, 44, 64460);
			attr_dev(select7, "id", "lbl_border_size");
			attr_dev(select7, "class", "form-control form-control-md height_34");
			attr_dev(select7, "name", "border_size");
			add_location(select7, file$h, 833, 40, 63942);
			attr_dev(div277, "class", "form-group");
			add_location(div277, file$h, 831, 36, 63736);
			attr_dev(div278, "class", "col-sm-4 px-1");
			add_location(div278, file$h, 830, 32, 63671);
			attr_dev(label102, "class", "control-label font-weight-normal mb-0");
			attr_dev(label102, "for", "lbl_border_color");
			add_location(label102, file$h, 845, 40, 64788);
			option18.__value = "white";
			option18.value = option18.__value;
			add_location(option18, file$h, 847, 44, 65069);
			option19.__value = "black";
			option19.value = option19.__value;
			add_location(option19, file$h, 848, 44, 65154);
			option20.__value = "blue";
			option20.value = option20.__value;
			add_location(option20, file$h, 849, 44, 65240);
			option21.__value = "green";
			option21.value = option21.__value;
			add_location(option21, file$h, 850, 44, 65324);
			option22.__value = "red";
			option22.value = option22.__value;
			add_location(option22, file$h, 851, 44, 65410);
			attr_dev(select8, "id", "lbl_border_color");
			attr_dev(select8, "class", "form-control form-control-md height_34");
			attr_dev(select8, "name", "border_color");
			add_location(select8, file$h, 846, 40, 64926);
			attr_dev(div279, "class", "form-group");
			add_location(div279, file$h, 844, 36, 64722);
			attr_dev(div280, "class", "col-sm-4 px-1");
			add_location(div280, file$h, 843, 32, 64657);
			attr_dev(label103, "class", "control-label font-weight-normal mb-0");
			attr_dev(label103, "for", "lbl_background_color");
			add_location(label103, file$h, 857, 40, 65746);
			option23.__value = "";
			option23.value = option23.__value;
			add_location(option23, file$h, 859, 44, 66039);
			option24.__value = "#c5d0fa";
			option24.value = option24.__value;
			add_location(option24, file$h, 860, 44, 66119);
			option25.__value = "#ffa354";
			option25.value = option25.__value;
			add_location(option25, file$h, 861, 44, 66215);
			option26.__value = "#f5785d";
			option26.value = option26.__value;
			add_location(option26, file$h, 862, 44, 66311);
			attr_dev(select9, "id", "lbl_background_color");
			attr_dev(select9, "class", "form-control form-control-md height_34");
			attr_dev(select9, "name", "background_color");
			add_location(select9, file$h, 858, 40, 65888);
			attr_dev(input92, "type", "hidden");
			attr_dev(input92, "id", "lbl-id");
			attr_dev(input92, "name", "id");
			add_location(input92, file$h, 864, 40, 66453);
			attr_dev(div281, "class", "form-group");
			add_location(div281, file$h, 856, 36, 65680);
			attr_dev(div282, "class", "col-sm-4 px-1");
			add_location(div282, file$h, 855, 32, 65615);
			attr_dev(label104, "class", "font-weight-normal mb-0");
			attr_dev(label104, "for", "label_class");
			add_location(label104, file$h, 869, 40, 66748);
			attr_dev(select10, "class", "form-control form-control-md");
			attr_dev(select10, "id", "label_class");
			attr_dev(select10, "name", "label_class");
			add_location(select10, file$h, 870, 40, 66869);
			attr_dev(div283, "class", "form-group");
			add_location(div283, file$h, 868, 36, 66682);
			attr_dev(div284, "class", "col-sm-12 px-1");
			add_location(div284, file$h, 867, 32, 66616);
			attr_dev(input93, "type", "checkbox");
			attr_dev(input93, "class", "form-check-input");
			attr_dev(input93, "name", "richtext");
			attr_dev(input93, "id", "rich_label_title");
			add_location(input93, file$h, 876, 40, 67281);
			attr_dev(label105, "class", "font-weight-normal mb-0 form-check-label");
			attr_dev(label105, "for", "rich_label_title");
			add_location(label105, file$h, 877, 40, 67411);
			attr_dev(div285, "class", "form-check form-check-inline");
			add_location(div285, file$h, 875, 36, 67197);
			attr_dev(div286, "class", "col-sm-12 px-1 pb-2 d-none");
			add_location(div286, file$h, 874, 32, 67119);
			attr_dev(div287, "class", "row");
			add_location(div287, file$h, 799, 28, 60938);
			attr_dev(div288, "class", "col-sm-12");
			add_location(div288, file$h, 798, 24, 60885);
			attr_dev(div289, "class", "ev");
			attr_dev(div289, "type", "lbl");
			add_location(div289, file$h, 885, 36, 67865);
			attr_dev(div290, "class", "col-sm-12 px-1");
			add_location(div290, file$h, 884, 32, 67799);
			attr_dev(div291, "class", "row");
			add_location(div291, file$h, 883, 28, 67748);
			attr_dev(div292, "class", "col-sm-6 d-none");
			add_location(div292, file$h, 882, 24, 67689);
			attr_dev(div293, "class", "row mx-0");
			add_location(div293, file$h, 797, 20, 60837);
			attr_dev(div294, "class", "labal h");
			add_location(div294, file$h, 796, 16, 60794);
			attr_dev(label106, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label106, "for", "area-width");
			add_location(label106, file$h, 899, 40, 68494);
			attr_dev(input94, "type", "text");
			attr_dev(input94, "class", "form-control form-control-md validate number_validate");
			attr_dev(input94, "id", "area-width");
			attr_dev(input94, "name", "width");
			attr_dev(input94, "placeholder", input94_placeholder_value = Lang.width_of_area);
			attr_dev(input94, "defaultvalue", "100");
			add_location(input94, file$h, 900, 40, 68646);
			attr_dev(div295, "class", "form-group");
			add_location(div295, file$h, 898, 36, 68428);
			attr_dev(div296, "class", "col-sm-3 px-1");
			add_location(div296, file$h, 897, 32, 68363);
			attr_dev(label107, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label107, "for", "area-height");
			add_location(label107, file$h, 905, 40, 69057);
			attr_dev(input95, "type", "text");
			attr_dev(input95, "class", "form-control form-control-md validate number_validate");
			attr_dev(input95, "id", "area-height");
			attr_dev(input95, "name", "height");
			attr_dev(input95, "placeholder", input95_placeholder_value = Lang.height_of_area);
			attr_dev(input95, "defaultvalue", "30");
			add_location(input95, file$h, 906, 40, 69211);
			attr_dev(div297, "class", "form-group");
			add_location(div297, file$h, 904, 36, 68991);
			attr_dev(div298, "class", "col-sm-3 px-1");
			add_location(div298, file$h, 903, 32, 68926);
			attr_dev(label108, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label108, "for", "area-top");
			add_location(label108, file$h, 911, 40, 69624);
			attr_dev(input96, "type", "text");
			attr_dev(input96, "class", "form-control form-control-md validate number_validate");
			attr_dev(input96, "id", "area-top");
			attr_dev(input96, "name", "top");
			attr_dev(input96, "placeholder", input96_placeholder_value = Lang.top_of_area);
			add_location(input96, file$h, 912, 40, 69765);
			attr_dev(div299, "class", "form-group");
			add_location(div299, file$h, 910, 36, 69558);
			attr_dev(div300, "class", "col-sm-3 px-1");
			add_location(div300, file$h, 909, 32, 69493);
			attr_dev(label109, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label109, "for", "area-left");
			add_location(label109, file$h, 917, 40, 70151);
			attr_dev(input97, "type", "text");
			attr_dev(input97, "class", "form-control form-control-md validate number_validate");
			attr_dev(input97, "id", "area-left");
			attr_dev(input97, "name", "left");
			attr_dev(input97, "placeholder", input97_placeholder_value = Lang.left_of_area);
			add_location(input97, file$h, 918, 40, 70294);
			attr_dev(div301, "class", "form-group");
			add_location(div301, file$h, 916, 36, 70085);
			attr_dev(div302, "class", "col-sm-3 px-1");
			add_location(div302, file$h, 915, 32, 70020);
			attr_dev(div303, "class", "row");
			add_location(div303, file$h, 896, 28, 68312);
			attr_dev(label110, "class", "control-label font-weight-normal mb-0");
			attr_dev(label110, "for", "area-matrix");
			add_location(label110, file$h, 925, 40, 70766);
			attr_dev(input98, "type", "text");
			attr_dev(input98, "class", "form-control form-control-md");
			attr_dev(input98, "id", "area-matrix");
			attr_dev(input98, "name", "matrix");
			attr_dev(input98, "placeholder", input98_placeholder_value = Lang.matrix_of_area);
			add_location(input98, file$h, 926, 40, 70897);
			attr_dev(div304, "class", "form-group");
			add_location(div304, file$h, 924, 36, 70700);
			attr_dev(div305, "class", "col-sm-6 px-1");
			add_location(div305, file$h, 923, 32, 70635);
			attr_dev(label111, "class", "control-label font-weight-normal mb-0");
			attr_dev(label111, "for", "area-correctans");
			add_location(label111, file$h, 931, 40, 71268);
			attr_dev(input99, "type", "text");
			attr_dev(input99, "class", "form-control form-control-md");
			attr_dev(input99, "id", "area-correctans");
			attr_dev(input99, "name", "correctans");
			attr_dev(input99, "placeholder", input99_placeholder_value = Lang.crt_of_area);
			add_location(input99, file$h, 932, 40, 71411);
			attr_dev(div306, "class", "form-group");
			add_location(div306, file$h, 930, 36, 71202);
			attr_dev(div307, "class", "col-sm-6 px-1");
			add_location(div307, file$h, 929, 32, 71137);
			attr_dev(div308, "class", "row");
			add_location(div308, file$h, 922, 28, 70584);
			attr_dev(label112, "class", "control-label font-weight-normal mb-0");
			attr_dev(label112, "for", "area-defaultans");
			add_location(label112, file$h, 939, 40, 71870);
			attr_dev(input100, "type", "text");
			attr_dev(input100, "class", "form-control form-control-md");
			attr_dev(input100, "id", "area-defaultans");
			attr_dev(input100, "name", "defaultans");
			attr_dev(input100, "placeholder", input100_placeholder_value = Lang.def_of_area);
			add_location(input100, file$h, 940, 40, 72013);
			attr_dev(div309, "class", "form-group");
			add_location(div309, file$h, 938, 36, 71804);
			attr_dev(div310, "class", "col-sm-6 px-1");
			add_location(div310, file$h, 937, 32, 71739);
			attr_dev(div311, "class", "row");
			add_location(div311, file$h, 936, 28, 71688);
			attr_dev(input101, "type", "hidden");
			attr_dev(input101, "id", "area-id");
			attr_dev(input101, "name", "id");
			add_location(input101, file$h, 944, 28, 72290);
			attr_dev(div312, "class", "col-sm-12");
			add_location(div312, file$h, 895, 24, 68259);
			attr_dev(div313, "class", "col-sm-6");
			add_location(div313, file$h, 946, 24, 72394);
			attr_dev(div314, "class", "row mx-0");
			add_location(div314, file$h, 894, 20, 68211);
			attr_dev(div315, "class", "area h");
			add_location(div315, file$h, 893, 16, 68169);
			attr_dev(label113, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label113, "for", "mnl-width");
			add_location(label113, file$h, 956, 40, 72847);
			attr_dev(input102, "type", "text");
			attr_dev(input102, "class", "form-control form-control-md validate number_validate");
			attr_dev(input102, "id", "mnl-width");
			attr_dev(input102, "name", "width");
			attr_dev(input102, "placeholder", input102_placeholder_value = Lang.width_of_menulist);
			attr_dev(input102, "defaultvalue", "100");
			add_location(input102, file$h, 957, 40, 72998);
			attr_dev(div316, "class", "form-group");
			add_location(div316, file$h, 955, 36, 72781);
			attr_dev(div317, "class", "col-sm-3 px-1");
			add_location(div317, file$h, 954, 32, 72716);
			attr_dev(label114, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label114, "for", "mnl-height");
			add_location(label114, file$h, 962, 40, 73412);
			attr_dev(input103, "type", "text");
			attr_dev(input103, "class", "form-control form-control-md validate number_validate");
			attr_dev(input103, "id", "mnl-height");
			attr_dev(input103, "name", "height");
			attr_dev(input103, "placeholder", input103_placeholder_value = Lang.height_of_menulist);
			attr_dev(input103, "defaultvalue", "30");
			add_location(input103, file$h, 963, 40, 73565);
			attr_dev(div318, "class", "form-group");
			add_location(div318, file$h, 961, 36, 73346);
			attr_dev(div319, "class", "col-sm-3 px-1");
			add_location(div319, file$h, 960, 32, 73281);
			attr_dev(label115, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label115, "for", "mnl-top");
			add_location(label115, file$h, 968, 40, 73981);
			attr_dev(input104, "type", "text");
			attr_dev(input104, "class", "form-control form-control-md validate number_validate");
			attr_dev(input104, "id", "mnl-top");
			attr_dev(input104, "name", "top");
			attr_dev(input104, "placeholder", input104_placeholder_value = Lang.top_of_menulist);
			add_location(input104, file$h, 969, 40, 74121);
			attr_dev(div320, "class", "form-group");
			add_location(div320, file$h, 967, 36, 73915);
			attr_dev(div321, "class", "col-sm-3 px-1");
			add_location(div321, file$h, 966, 32, 73850);
			attr_dev(label116, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label116, "for", "mnl-left");
			add_location(label116, file$h, 974, 40, 74510);
			attr_dev(input105, "type", "text");
			attr_dev(input105, "class", "form-control form-control-md validate number_validate");
			attr_dev(input105, "id", "mnl-left");
			attr_dev(input105, "name", "left");
			attr_dev(input105, "placeholder", input105_placeholder_value = Lang.left_of_menulist);
			add_location(input105, file$h, 975, 40, 74652);
			attr_dev(div322, "class", "form-group");
			add_location(div322, file$h, 973, 36, 74444);
			attr_dev(div323, "class", "col-sm-3 px-1");
			add_location(div323, file$h, 972, 32, 74379);
			attr_dev(div324, "class", "row");
			add_location(div324, file$h, 953, 28, 72665);
			attr_dev(label117, "class", "control-label font-weight-normal mb-0");
			attr_dev(label117, "for", "mnl-matrix");
			add_location(label117, file$h, 982, 40, 75127);
			attr_dev(input106, "type", "text");
			attr_dev(input106, "class", "form-control form-control-md");
			attr_dev(input106, "id", "mnl-matrix");
			attr_dev(input106, "name", "matrix");
			attr_dev(input106, "placeholder", input106_placeholder_value = Lang.matrix_of_menulist);
			add_location(input106, file$h, 983, 40, 75257);
			attr_dev(div325, "class", "form-group");
			add_location(div325, file$h, 981, 36, 75061);
			attr_dev(div326, "class", "col-sm-6 px-1");
			add_location(div326, file$h, 980, 32, 74996);
			attr_dev(label118, "class", "control-label font-weight-normal mb-0");
			attr_dev(label118, "for", "mnl-correctans");
			add_location(label118, file$h, 988, 40, 75631);
			attr_dev(input107, "type", "text");
			attr_dev(input107, "class", "form-control form-control-md");
			attr_dev(input107, "id", "mnl-correctans");
			attr_dev(input107, "name", "correctans");
			attr_dev(input107, "placeholder", input107_placeholder_value = Lang.crt_of_menulist);
			add_location(input107, file$h, 989, 40, 75773);
			attr_dev(div327, "class", "form-group");
			add_location(div327, file$h, 987, 36, 75565);
			attr_dev(div328, "class", "col-sm-6 px-1");
			add_location(div328, file$h, 986, 32, 75500);
			attr_dev(div329, "class", "row");
			add_location(div329, file$h, 979, 28, 74945);
			attr_dev(label119, "class", "control-label font-weight-normal mb-0");
			attr_dev(label119, "for", "mnl-value");
			add_location(label119, file$h, 996, 40, 76235);
			attr_dev(input108, "type", "text");
			attr_dev(input108, "class", "form-control form-control-md");
			attr_dev(input108, "id", "mnl-value");
			attr_dev(input108, "name", "value");
			attr_dev(input108, "placeholder", input108_placeholder_value = Lang.event_val_menulist);
			add_location(input108, file$h, 997, 40, 76369);
			attr_dev(div330, "class", "form-group");
			add_location(div330, file$h, 995, 36, 76169);
			attr_dev(div331, "class", "col-sm-6 px-1");
			add_location(div331, file$h, 994, 32, 76104);
			attr_dev(div332, "class", "row");
			add_location(div332, file$h, 993, 28, 76053);
			attr_dev(input109, "type", "hidden");
			attr_dev(input109, "id", "mnl-id");
			attr_dev(input109, "name", "id");
			add_location(input109, file$h, 1001, 28, 76642);
			attr_dev(div333, "class", "col-sm-12");
			add_location(div333, file$h, 952, 24, 72612);
			attr_dev(div334, "class", "col-sm-6");
			add_location(div334, file$h, 1003, 24, 76745);
			attr_dev(div335, "class", "row mx-0");
			add_location(div335, file$h, 951, 20, 72564);
			attr_dev(div336, "class", "menulist h");
			add_location(div336, file$h, 950, 16, 72518);
			attr_dev(label120, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label120, "for", "hpt-width");
			add_location(label120, file$h, 1013, 40, 77197);
			attr_dev(input110, "type", "text");
			attr_dev(input110, "class", "form-control form-control-md validate number_validate");
			attr_dev(input110, "id", "hpt-width");
			attr_dev(input110, "name", "width");
			attr_dev(input110, "placeholder", input110_placeholder_value = Lang.width_of_hotspot);
			attr_dev(input110, "defaultvalue", "200");
			add_location(input110, file$h, 1014, 40, 77348);
			attr_dev(div337, "class", "form-group");
			add_location(div337, file$h, 1012, 36, 77131);
			attr_dev(div338, "class", "col-sm-3 px-1");
			add_location(div338, file$h, 1011, 32, 77066);
			attr_dev(label121, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label121, "for", "hpt-height");
			add_location(label121, file$h, 1019, 40, 77761);
			attr_dev(input111, "type", "text");
			attr_dev(input111, "class", "form-control form-control-md validate number_validate");
			attr_dev(input111, "id", "hpt-height");
			attr_dev(input111, "name", "height");
			attr_dev(input111, "placeholder", input111_placeholder_value = Lang.height_of_hotspot);
			attr_dev(input111, "defaultvalue", "200");
			add_location(input111, file$h, 1020, 40, 77914);
			attr_dev(div339, "class", "form-group");
			add_location(div339, file$h, 1018, 36, 77695);
			attr_dev(div340, "class", "col-sm-3 px-1");
			add_location(div340, file$h, 1017, 32, 77630);
			attr_dev(label122, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label122, "for", "hpt-top");
			add_location(label122, file$h, 1025, 40, 78330);
			attr_dev(input112, "type", "text");
			attr_dev(input112, "class", "form-control form-control-md validate number_validate");
			attr_dev(input112, "id", "hpt-top");
			attr_dev(input112, "name", "top");
			attr_dev(input112, "placeholder", input112_placeholder_value = Lang.top_of_hotspot);
			add_location(input112, file$h, 1026, 40, 78470);
			attr_dev(div341, "class", "form-group");
			add_location(div341, file$h, 1024, 36, 78264);
			attr_dev(div342, "class", "col-sm-3 px-1");
			add_location(div342, file$h, 1023, 32, 78199);
			attr_dev(label123, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label123, "for", "hpt-left");
			add_location(label123, file$h, 1031, 40, 78858);
			attr_dev(input113, "type", "text");
			attr_dev(input113, "class", "form-control form-control-md validate number_validate");
			attr_dev(input113, "id", "hpt-left");
			attr_dev(input113, "name", "left");
			attr_dev(input113, "placeholder", input113_placeholder_value = Lang.left_of_hotspot);
			add_location(input113, file$h, 1032, 40, 79000);
			attr_dev(div343, "class", "form-group");
			add_location(div343, file$h, 1030, 36, 78792);
			attr_dev(div344, "class", "col-sm-3 px-1");
			add_location(div344, file$h, 1029, 32, 78727);
			attr_dev(div345, "class", "row");
			add_location(div345, file$h, 1010, 28, 77015);
			attr_dev(label124, "class", "control-label font-weight-normal mb-0");
			attr_dev(label124, "for", "hpt-title");
			add_location(label124, file$h, 1039, 40, 79474);
			attr_dev(input114, "type", "text");
			attr_dev(input114, "class", "form-control form-control-md");
			attr_dev(input114, "id", "hpt-title");
			attr_dev(input114, "name", "title");
			attr_dev(input114, "placeholder", input114_placeholder_value = Lang.title_of_hotspot);
			add_location(input114, file$h, 1040, 40, 79602);
			attr_dev(div346, "class", "form-group");
			add_location(div346, file$h, 1038, 36, 79408);
			attr_dev(div347, "class", "col-sm-6 px-1");
			add_location(div347, file$h, 1037, 32, 79343);
			attr_dev(label125, "class", "control-label font-weight-normal mb-0");
			attr_dev(label125, "for", "hpt-name");
			add_location(label125, file$h, 1045, 40, 79972);
			attr_dev(input115, "type", "text");
			attr_dev(input115, "class", "form-control form-control-md");
			attr_dev(input115, "id", "hpt-name");
			attr_dev(input115, "name", "name");
			attr_dev(input115, "placeholder", input115_placeholder_value = Lang.name_of_hotspot);
			add_location(input115, file$h, 1046, 40, 80103);
			attr_dev(div348, "class", "form-group");
			add_location(div348, file$h, 1044, 36, 79906);
			attr_dev(div349, "class", "col-sm-6 px-1");
			add_location(div349, file$h, 1043, 32, 79841);
			attr_dev(div350, "class", "row");
			add_location(div350, file$h, 1036, 28, 79292);
			attr_dev(label126, "class", "control-label font-weight-normal mb-0");
			attr_dev(label126, "for", "hpt-targetimg");
			add_location(label126, file$h, 1053, 40, 80555);
			attr_dev(input116, "type", "text");
			attr_dev(input116, "class", "form-control form-control-md");
			attr_dev(input116, "id", "hpt-targetimg");
			attr_dev(input116, "name", "targetimg");
			attr_dev(input116, "placeholder", input116_placeholder_value = Lang.target_img_hpt);
			add_location(input116, file$h, 1054, 40, 80692);
			attr_dev(div351, "class", "form-group");
			add_location(div351, file$h, 1052, 36, 80489);
			attr_dev(div352, "class", "col-sm-6 px-1");
			add_location(div352, file$h, 1051, 32, 80424);
			attr_dev(input117, "type", "checkbox");
			attr_dev(input117, "class", "checkbox inline margin-bottom form-check-input");
			attr_dev(input117, "id", "hpt-showtarget");
			attr_dev(input117, "name", "showtarget");
			attr_dev(input117, "defaultvalue", "1");
			add_location(input117, file$h, 1059, 40, 81107);
			attr_dev(label127, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label127, "for", "hpt-showtarget");
			add_location(label127, file$h, 1060, 40, 81283);
			attr_dev(div353, "class", "form-group mt-4 pt-sm form-check form-check-inline");
			add_location(div353, file$h, 1058, 36, 81001);
			attr_dev(div354, "class", "col-sm-6 px-1");
			add_location(div354, file$h, 1057, 32, 80936);
			attr_dev(div355, "class", "row h");
			add_location(div355, file$h, 1050, 28, 80371);
			attr_dev(input118, "type", "hidden");
			attr_dev(input118, "id", "hpt-id");
			attr_dev(input118, "name", "id");
			add_location(input118, file$h, 1064, 28, 81547);
			attr_dev(div356, "class", "col-sm-12");
			add_location(div356, file$h, 1009, 24, 76962);
			attr_dev(div357, "class", "row mx-0");
			add_location(div357, file$h, 1008, 20, 76914);
			attr_dev(div358, "class", "hotspot h");
			add_location(div358, file$h, 1007, 16, 76869);
			attr_dev(label128, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label128, "for", "hpt_clk-width");
			add_location(label128, file$h, 1074, 40, 82028);
			attr_dev(input119, "type", "text");
			attr_dev(input119, "class", "form-control form-control-md validate number_validate");
			attr_dev(input119, "id", "hpt_clk-width");
			attr_dev(input119, "name", "width");
			attr_dev(input119, "placeholder", input119_placeholder_value = Lang.width_of_click);
			attr_dev(input119, "defaultvalue", "100");
			add_location(input119, file$h, 1075, 40, 82183);
			attr_dev(div359, "class", "form-group");
			add_location(div359, file$h, 1073, 36, 81962);
			attr_dev(div360, "class", "col-sm-3 px-1");
			add_location(div360, file$h, 1072, 32, 81897);
			attr_dev(label129, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label129, "for", "hpt_clk-height");
			add_location(label129, file$h, 1080, 40, 82598);
			attr_dev(input120, "type", "text");
			attr_dev(input120, "class", "form-control form-control-md validate number_validate");
			attr_dev(input120, "id", "hpt_clk-height");
			attr_dev(input120, "name", "height");
			attr_dev(input120, "placeholder", input120_placeholder_value = Lang.height_of_click);
			attr_dev(input120, "defaultvalue", "30");
			add_location(input120, file$h, 1081, 40, 82755);
			attr_dev(div361, "class", "form-group");
			add_location(div361, file$h, 1079, 36, 82532);
			attr_dev(div362, "class", "col-sm-3 px-1");
			add_location(div362, file$h, 1078, 32, 82467);
			attr_dev(label130, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label130, "for", "hpt_clk-top");
			add_location(label130, file$h, 1086, 40, 83172);
			attr_dev(input121, "type", "text");
			attr_dev(input121, "class", "form-control form-control-md validate number_validate");
			attr_dev(input121, "id", "hpt_clk-top");
			attr_dev(input121, "name", "top");
			attr_dev(input121, "placeholder", input121_placeholder_value = Lang.top_of_click);
			add_location(input121, file$h, 1087, 40, 83316);
			attr_dev(div363, "class", "form-group");
			add_location(div363, file$h, 1085, 36, 83106);
			attr_dev(div364, "class", "col-sm-3 px-1");
			add_location(div364, file$h, 1084, 32, 83041);
			attr_dev(label131, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label131, "for", "hpt_clk-left");
			add_location(label131, file$h, 1092, 40, 83706);
			attr_dev(input122, "type", "text");
			attr_dev(input122, "class", "form-control form-control-md validate number_validate");
			attr_dev(input122, "id", "hpt_clk-left");
			attr_dev(input122, "name", "left");
			attr_dev(input122, "placeholder", input122_placeholder_value = Lang.left_of_click);
			add_location(input122, file$h, 1093, 40, 83852);
			attr_dev(div365, "class", "form-group");
			add_location(div365, file$h, 1091, 36, 83640);
			attr_dev(div366, "class", "col-sm-3 px-1");
			add_location(div366, file$h, 1090, 32, 83575);
			attr_dev(div367, "class", "row");
			add_location(div367, file$h, 1071, 28, 81846);
			attr_dev(input123, "type", "hidden");
			attr_dev(input123, "id", "hpt_clk-id");
			attr_dev(input123, "name", "id");
			add_location(input123, file$h, 1097, 28, 84146);
			attr_dev(div368, "class", "col-sm-12");
			add_location(div368, file$h, 1070, 24, 81793);
			attr_dev(div369, "class", "row mx-0");
			add_location(div369, file$h, 1069, 20, 81745);
			attr_dev(div370, "class", "hotspot_click h");
			add_location(div370, file$h, 1068, 16, 81694);
			attr_dev(label132, "class", "control-label font-weight-normal mb-0");
			attr_dev(label132, "for", "tab-title");
			add_location(label132, file$h, 1107, 40, 84621);
			attr_dev(input124, "type", "text");
			attr_dev(input124, "class", "form-control form-control-md");
			attr_dev(input124, "id", "tab-title");
			attr_dev(input124, "name", "value");
			attr_dev(input124, "placeholder", input124_placeholder_value = Lang.title_of_tab);
			attr_dev(input124, "defaultvalue", "New");
			add_location(input124, file$h, 1108, 40, 84749);
			attr_dev(div371, "class", "form-group");
			add_location(div371, file$h, 1106, 36, 84555);
			attr_dev(div372, "class", "col-sm-6 px-1");
			add_location(div372, file$h, 1105, 32, 84490);
			attr_dev(label133, "class", "control-label font-weight-normal mb-0");
			attr_dev(label133, "for", "tab-alt");
			add_location(label133, file$h, 1113, 40, 85133);
			attr_dev(input125, "type", "text");
			attr_dev(input125, "class", "form-control form-control-md");
			attr_dev(input125, "id", "tab-alt");
			attr_dev(input125, "name", "alt");
			attr_dev(input125, "placeholder", input125_placeholder_value = Lang.alt_of_image);
			add_location(input125, file$h, 1114, 40, 85262);
			attr_dev(div373, "class", "form-group");
			add_location(div373, file$h, 1112, 36, 85067);
			attr_dev(div374, "class", "col-sm-6 px-1");
			add_location(div374, file$h, 1111, 32, 85002);
			attr_dev(div375, "class", "row");
			add_location(div375, file$h, 1104, 28, 84439);
			attr_dev(label134, "class", "control-label font-weight-normal mb-0");
			attr_dev(label134, "for", "tab-bgimg");
			add_location(label134, file$h, 1121, 40, 85707);
			attr_dev(input126, "type", "text");
			attr_dev(input126, "class", "form-control form-control-md");
			attr_dev(input126, "id", "tab-bgimg");
			attr_dev(input126, "name", "bgimg");
			attr_dev(input126, "placeholder", input126_placeholder_value = Lang.bg_of_tab);
			add_location(input126, file$h, 1122, 40, 85846);
			attr_dev(div376, "class", "form-group");
			add_location(div376, file$h, 1120, 36, 85641);
			attr_dev(button2, "type", "button");
			attr_dev(button2, "id", "tab_upload_media");
			attr_dev(button2, "target", "tab-bgimg");
			attr_dev(button2, "class", "btn btn-outline-primary float-start");
			add_location(button2, file$h, 1124, 36, 86042);
			attr_dev(div377, "class", "col-sm-6 px-1");
			add_location(div377, file$h, 1119, 32, 85576);
			attr_dev(input127, "type", "checkbox");
			attr_dev(input127, "class", "checkbox inline form-check-input margin-bottom");
			attr_dev(input127, "id", "tab-display");
			attr_dev(input127, "name", "display");
			attr_dev(input127, "defaultvalue", "1");
			add_location(input127, file$h, 1128, 40, 86424);
			attr_dev(label135, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label135, "for", "tab-display");
			add_location(label135, file$h, 1129, 40, 86595);
			attr_dev(div378, "class", "form-group form-check form-check-inline");
			add_location(div378, file$h, 1127, 36, 86329);
			attr_dev(input128, "type", "hidden");
			attr_dev(input128, "id", "tab-id");
			attr_dev(input128, "name", "id");
			add_location(input128, file$h, 1131, 36, 86785);
			attr_dev(div379, "class", "col-sm-6 px-1 mt-4 pt-sm");
			add_location(div379, file$h, 1126, 32, 86253);
			attr_dev(div380, "class", "row");
			add_location(div380, file$h, 1118, 28, 85525);
			attr_dev(div381, "class", "col-sm-12");
			add_location(div381, file$h, 1103, 24, 84386);
			attr_dev(div382, "class", "row mx-0");
			add_location(div382, file$h, 1102, 20, 84338);
			attr_dev(div383, "class", "tab h");
			add_location(div383, file$h, 1101, 16, 84297);
			attr_dev(label136, "class", "control-label font-weight-normal mb-0");
			attr_dev(label136, "for", "step-bgimg");
			add_location(label136, file$h, 1143, 40, 87333);
			attr_dev(input129, "type", "text");
			attr_dev(input129, "class", "form-control form-control-md");
			attr_dev(input129, "id", "step-bgimg");
			attr_dev(input129, "name", "bgimg");
			attr_dev(input129, "placeholder", input129_placeholder_value = Lang.bg_of_step);
			add_location(input129, file$h, 1144, 40, 87473);
			attr_dev(div384, "class", "form-group");
			add_location(div384, file$h, 1142, 36, 87267);
			attr_dev(button3, "type", "button");
			attr_dev(button3, "id", "step_upload_media");
			attr_dev(button3, "target", "step-bgimg");
			attr_dev(button3, "class", "btn btn-outline-primary float-start");
			add_location(button3, file$h, 1146, 36, 87671);
			attr_dev(div385, "class", "col-sm-6 px-1");
			add_location(div385, file$h, 1141, 32, 87202);
			attr_dev(label137, "class", "control-label font-weight-normal mb-0");
			attr_dev(label137, "for", "step-alt");
			add_location(label137, file$h, 1150, 40, 88015);
			attr_dev(input130, "type", "text");
			attr_dev(input130, "class", "form-control form-control-md");
			attr_dev(input130, "id", "step-alt");
			attr_dev(input130, "name", "alt");
			add_location(input130, file$h, 1151, 40, 88144);
			attr_dev(div386, "class", "form-group");
			add_location(div386, file$h, 1149, 36, 87949);
			attr_dev(div387, "class", "col-sm-6 px-1");
			add_location(div387, file$h, 1148, 32, 87884);
			attr_dev(div388, "class", "row");
			add_location(div388, file$h, 1140, 28, 87151);
			attr_dev(input131, "type", "checkbox");
			attr_dev(input131, "class", "checkbox inline margin-bottom form-check-input");
			attr_dev(input131, "id", "step-display");
			attr_dev(input131, "name", "display");
			attr_dev(input131, "defaultvalue", "1");
			add_location(input131, file$h, 1158, 40, 88588);
			attr_dev(label138, "class", "control-label font-weight-normal mb-0 form-check-label");
			attr_dev(label138, "for", "step-display");
			add_location(label138, file$h, 1159, 40, 88760);
			attr_dev(div389, "class", "form-group form-check form-check-inline");
			add_location(div389, file$h, 1157, 36, 88493);
			attr_dev(div390, "class", "col-sm-6 px-1");
			add_location(div390, file$h, 1156, 32, 88428);
			attr_dev(div391, "class", "row");
			add_location(div391, file$h, 1155, 28, 88377);
			attr_dev(input132, "type", "hidden");
			attr_dev(input132, "id", "step-id");
			attr_dev(input132, "name", "id");
			add_location(input132, file$h, 1163, 28, 89018);
			attr_dev(div392, "class", "col-sm-12");
			add_location(div392, file$h, 1139, 24, 87098);
			attr_dev(div393, "class", "row mx-0");
			add_location(div393, file$h, 1138, 20, 87050);
			attr_dev(div394, "class", "step h");
			add_location(div394, file$h, 1137, 16, 87008);
			attr_dev(label139, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label139, "for", "base-width");
			add_location(label139, file$h, 1173, 40, 89491);
			attr_dev(input133, "type", "text");
			attr_dev(input133, "class", "form-control form-control-md validate number_validate");
			attr_dev(input133, "id", "base-width");
			attr_dev(input133, "name", "width");
			attr_dev(input133, "placeholder", input133_placeholder_value = Lang.width_of_base);
			add_location(input133, file$h, 1174, 40, 89643);
			attr_dev(div395, "class", "form-group");
			add_location(div395, file$h, 1172, 36, 89425);
			attr_dev(div396, "class", "col-sm-4 px-1");
			add_location(div396, file$h, 1171, 32, 89360);
			attr_dev(label140, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label140, "for", "base-height");
			add_location(label140, file$h, 1179, 40, 90035);
			attr_dev(input134, "type", "text");
			attr_dev(input134, "class", "form-control form-control-md validate number_validate");
			attr_dev(input134, "id", "base-height");
			attr_dev(input134, "name", "height");
			attr_dev(input134, "placeholder", input134_placeholder_value = Lang.height_of_base);
			add_location(input134, file$h, 1180, 40, 90189);
			attr_dev(div397, "class", "form-group");
			add_location(div397, file$h, 1178, 36, 89969);
			attr_dev(div398, "class", "col-sm-4 px-1");
			add_location(div398, file$h, 1177, 32, 89904);
			attr_dev(label141, "class", "control-label font-weight-normal mb-0");
			attr_dev(label141, "for", "base-bgimg-alt");
			add_location(label141, file$h, 1185, 40, 90584);
			attr_dev(input135, "type", "text");
			attr_dev(input135, "class", "form-control form-control-md");
			attr_dev(input135, "id", "base-bgimg-alt");
			attr_dev(input135, "name", "alt");
			attr_dev(input135, "placeholder", input135_placeholder_value = Lang.alt_text_base);
			add_location(input135, file$h, 1186, 40, 90723);
			attr_dev(div399, "class", "form-group");
			add_location(div399, file$h, 1184, 36, 90518);
			attr_dev(div400, "class", "col-sm-4 px-1");
			add_location(div400, file$h, 1183, 32, 90453);
			attr_dev(div401, "class", "row");
			add_location(div401, file$h, 1170, 28, 89309);
			attr_dev(label142, "class", "control-label font-weight-normal mb-0");
			attr_dev(label142, "for", "base-bgimg");
			add_location(label142, file$h, 1193, 40, 91176);
			input136.readOnly = "readonly";
			attr_dev(input136, "type", "text");
			attr_dev(input136, "class", "form-control form-control-md");
			attr_dev(input136, "id", "base-bgimg");
			attr_dev(input136, "name", "bgimg");
			attr_dev(input136, "placeholder", input136_placeholder_value = Lang.bg_of_base);
			add_location(input136, file$h, 1194, 40, 91316);
			attr_dev(div402, "class", "form-group");
			add_location(div402, file$h, 1192, 36, 91110);
			attr_dev(div403, "class", "col-sm-6 px-1");
			add_location(div403, file$h, 1191, 32, 91045);
			attr_dev(button4, "type", "button");
			attr_dev(button4, "id", "upload_media");
			attr_dev(button4, "class", "btn btn-outline-primary float-start");
			add_location(button4, file$h, 1198, 36, 91645);
			attr_dev(input137, "type", "checkbox");
			attr_dev(input137, "class", "checkbox inline margin-bottom ml-3 position-relative top2");
			attr_dev(input137, "id", "base-borderrequired");
			attr_dev(input137, "name", "borderrequired");
			attr_dev(input137, "defaultvalue", "1");
			input137.checked = true;
			add_location(input137, file$h, 1200, 40, 91880);
			attr_dev(label143, "class", "control-label ml-1 font-weight-normal mb-0 position-relative top1");
			attr_dev(label143, "for", "base-borderrequired");
			add_location(label143, file$h, 1201, 40, 92084);
			attr_dev(div404, "class", "form-group float-start mt-2");
			add_location(div404, file$h, 1199, 36, 91797);
			attr_dev(div405, "class", "col-sm-6 mt-3 pt-1 px-1");
			add_location(div405, file$h, 1197, 32, 91570);
			attr_dev(div406, "class", "row");
			add_location(div406, file$h, 1190, 28, 90994);
			attr_dev(div407, "class", "col-sm-12");
			add_location(div407, file$h, 1169, 24, 89256);
			attr_dev(div408, "class", "row mx-0");
			add_location(div408, file$h, 1168, 20, 89208);
			attr_dev(div409, "class", "base h");
			add_location(div409, file$h, 1167, 16, 89166);
			attr_dev(textarea14, "id", "code");
			attr_dev(textarea14, "name", "jscript");
			attr_dev(textarea14, "style", textarea14_style_value = { width: "100%", height: "300px" });
			add_location(textarea14, file$h, 1209, 24, 92484);
			attr_dev(div410, "class", "jscript h");
			add_location(div410, file$h, 1208, 16, 92435);
			attr_dev(label144, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label144, "for", "choicematrix-width");
			add_location(label144, file$h, 1217, 40, 92942);
			attr_dev(input138, "type", "text");
			attr_dev(input138, "class", "form-control form-control-md validate number_validate");
			attr_dev(input138, "id", "choicematrix-width");
			attr_dev(input138, "name", "width");
			attr_dev(input138, "placeholder", input138_placeholder_value = Lang.width_of_cm);
			attr_dev(input138, "defaultvalue", "20");
			add_location(input138, file$h, 1218, 40, 93102);
			attr_dev(div411, "class", "form-group");
			add_location(div411, file$h, 1216, 36, 92876);
			attr_dev(div412, "class", "col-sm-6 px-1");
			add_location(div412, file$h, 1215, 32, 92811);
			attr_dev(label145, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label145, "for", "choicematrix-height");
			add_location(label145, file$h, 1223, 40, 93518);
			attr_dev(input139, "type", "text");
			attr_dev(input139, "class", "form-control form-control-md validate number_validate");
			attr_dev(input139, "id", "choicematrix-height");
			attr_dev(input139, "name", "height");
			attr_dev(input139, "placeholder", input139_placeholder_value = Lang.height_of_cm);
			attr_dev(input139, "defaultvalue", "20");
			add_location(input139, file$h, 1224, 40, 93680);
			attr_dev(div413, "class", "form-group");
			add_location(div413, file$h, 1222, 36, 93452);
			attr_dev(div414, "class", "col-sm-6 px-1");
			add_location(div414, file$h, 1221, 32, 93387);
			attr_dev(div415, "class", "row");
			add_location(div415, file$h, 1214, 28, 92760);
			attr_dev(label146, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label146, "for", "choicematrix-top");
			add_location(label146, file$h, 1231, 40, 94182);
			attr_dev(input140, "type", "text");
			attr_dev(input140, "class", "form-control form-control-md validate number_validate");
			attr_dev(input140, "id", "choicematrix-top");
			attr_dev(input140, "name", "top");
			attr_dev(input140, "placeholder", input140_placeholder_value = Lang.top_of_cm);
			add_location(input140, file$h, 1232, 40, 94331);
			attr_dev(div416, "class", "form-group");
			add_location(div416, file$h, 1230, 36, 94116);
			attr_dev(div417, "class", "col-sm-6 px-1");
			add_location(div417, file$h, 1229, 32, 94051);
			attr_dev(label147, "class", "control-label font-weight-normal mb-0 mendatory_label");
			attr_dev(label147, "for", "choicematrix-left");
			add_location(label147, file$h, 1237, 40, 94723);
			attr_dev(input141, "type", "text");
			attr_dev(input141, "class", "form-control form-control-md validate number_validate");
			attr_dev(input141, "id", "choicematrix-left");
			attr_dev(input141, "name", "left");
			attr_dev(input141, "placeholder", input141_placeholder_value = Lang.left_of_cm);
			add_location(input141, file$h, 1238, 40, 94874);
			attr_dev(div418, "class", "form-group");
			add_location(div418, file$h, 1236, 36, 94657);
			attr_dev(div419, "class", "col-sm-6 px-1");
			add_location(div419, file$h, 1235, 32, 94592);
			attr_dev(div420, "class", "row");
			add_location(div420, file$h, 1228, 28, 94000);
			attr_dev(label148, "class", "control-label font-weight-normal mb-0");
			attr_dev(label148, "for", "choicematrix-name");
			add_location(label148, file$h, 1245, 40, 95353);
			attr_dev(input142, "type", "text");
			attr_dev(input142, "class", "form-control form-control-md");
			attr_dev(input142, "id", "choicematrix-name");
			attr_dev(input142, "name", "name");
			attr_dev(input142, "placeholder", input142_placeholder_value = Lang.name_of_cm);
			add_location(input142, file$h, 1246, 40, 95493);
			attr_dev(div421, "class", "form-group");
			add_location(div421, file$h, 1244, 36, 95287);
			attr_dev(div422, "class", "col-sm-12 px-1");
			add_location(div422, file$h, 1243, 32, 95221);
			attr_dev(label149, "class", "control-label font-weight-normal mb-0");
			attr_dev(label149, "for", "choicematrix-correctans");
			add_location(label149, file$h, 1251, 40, 95865);
			attr_dev(input143, "type", "text");
			attr_dev(input143, "class", "form-control form-control-md");
			attr_dev(input143, "id", "choicematrix-correctans");
			attr_dev(input143, "name", "correctans");
			attr_dev(input143, "placeholder", input143_placeholder_value = Lang.crt_of_cm);
			add_location(input143, file$h, 1252, 40, 96016);
			attr_dev(div423, "class", "form-group");
			add_location(div423, file$h, 1250, 36, 95799);
			attr_dev(div424, "class", "col-sm-12 px-1");
			add_location(div424, file$h, 1249, 32, 95733);
			attr_dev(label150, "class", "control-label font-weight-normal mb-0");
			attr_dev(label150, "for", "choicematrix-defaultans");
			add_location(label150, file$h, 1257, 40, 96399);
			attr_dev(input144, "type", "text");
			attr_dev(input144, "class", "form-control form-control-md");
			attr_dev(input144, "id", "choicematrix-defaultans");
			attr_dev(input144, "name", "defaultans");
			attr_dev(input144, "placeholder", input144_placeholder_value = Lang.def_of_cm);
			add_location(input144, file$h, 1258, 40, 96550);
			attr_dev(div425, "class", "form-group");
			add_location(div425, file$h, 1256, 36, 96333);
			attr_dev(div426, "class", "col-sm-12 px-1");
			add_location(div426, file$h, 1255, 32, 96267);
			attr_dev(input145, "type", "hidden");
			attr_dev(input145, "id", "choicematrix-id");
			attr_dev(input145, "name", "id");
			add_location(input145, file$h, 1261, 32, 96801);
			attr_dev(div427, "class", "row");
			add_location(div427, file$h, 1242, 28, 95170);
			attr_dev(div428, "class", "col-sm-6");
			add_location(div428, file$h, 1213, 24, 92708);
			attr_dev(label151, "class", "control-label font-weight-normal mb-0");
			attr_dev(label151, "for", "choicematrix-style");
			add_location(label151, file$h, 1266, 32, 97069);
			attr_dev(textarea15, "id", "choicematrix-style");
			attr_dev(textarea15, "class", "form-control form-control-md height_34");
			attr_dev(textarea15, "name", "style");
			attr_dev(textarea15, "placeholder", textarea15_placeholder_value = Lang.css_of_cm);
			add_location(textarea15, file$h, 1267, 32, 97202);
			attr_dev(div429, "class", "form-group");
			add_location(div429, file$h, 1265, 28, 97011);
			attr_dev(div430, "class", "ev");
			attr_dev(div430, "type", "rd");
			add_location(div430, file$h, 1269, 28, 97401);
			attr_dev(div431, "class", "col-sm-6 pl-2 pr-1");
			add_location(div431, file$h, 1264, 24, 96949);
			attr_dev(div432, "class", "row mx-0");
			add_location(div432, file$h, 1212, 20, 92660);
			attr_dev(div433, "class", "choicematrix h");
			add_location(div433, file$h, 1211, 16, 92610);
			attr_dev(div434, "class", "modal-body modal_height overflow-y svelte-rrvcgd");
			add_location(div434, file$h, 20, 12, 776);
			attr_dev(button5, "type", "button");
			attr_dev(button5, "class", "btn btn-light");
			attr_dev(button5, "data-bs-dismiss", "modal");
			add_location(button5, file$h, 1277, 16, 97672);
			attr_dev(button6, "type", "button");
			attr_dev(button6, "class", "btn btn-primary addElement");
			attr_dev(button6, "data-bs-dismiss", "modal");
			add_location(button6, file$h, 1278, 16, 97777);
			attr_dev(button7, "type", "button");
			attr_dev(button7, "class", "btn btn-primary errorBtn h");
			add_location(button7, file$h, 1279, 16, 97895);
			attr_dev(div435, "class", "modal-footer");
			add_location(div435, file$h, 1276, 12, 97628);
			attr_dev(div436, "class", "modal-content");
			add_location(div436, file$h, 15, 8, 521);
			attr_dev(div437, "class", "modal-dialog modal-dialog-centered");
			add_location(div437, file$h, 14, 4, 463);
			attr_dev(div438, "id", "authoring-modal");
			attr_dev(div438, "class", "modal fade");
			attr_dev(div438, "tabindex", "-1");
			add_location(div438, file$h, 13, 0, 398);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div438, anchor);
			append_dev(div438, div437);
			append_dev(div437, div436);
			append_dev(div436, div0);
			append_dev(div0, h4);
			append_dev(div0, t1);
			append_dev(div0, button0);
			append_dev(div436, t3);
			append_dev(div436, div434);
			append_dev(div434, div30);
			append_dev(div30, div29);
			append_dev(div29, div22);
			append_dev(div22, div21);
			append_dev(div21, div2);
			append_dev(div2, div1);
			append_dev(div1, label0);
			append_dev(div1, t5);
			append_dev(div1, input0);
			append_dev(div21, t6);
			append_dev(div21, div4);
			append_dev(div4, div3);
			append_dev(div3, label1);
			append_dev(div3, t8);
			append_dev(div3, input1);
			append_dev(div21, t9);
			append_dev(div21, div6);
			append_dev(div6, div5);
			append_dev(div5, label2);
			append_dev(div5, t11);
			append_dev(div5, input2);
			append_dev(div21, t12);
			append_dev(div21, div8);
			append_dev(div8, div7);
			append_dev(div7, label3);
			append_dev(div7, t14);
			append_dev(div7, input3);
			append_dev(div21, t15);
			append_dev(div21, div10);
			append_dev(div10, div9);
			append_dev(div9, label4);
			append_dev(div9, t17);
			append_dev(div9, input4);
			append_dev(div21, t18);
			append_dev(div21, div12);
			append_dev(div12, div11);
			append_dev(div11, label5);
			append_dev(div11, t20);
			append_dev(div11, select0);
			append_dev(select0, option0);
			append_dev(select0, option1);
			append_dev(select0, option2);
			append_dev(div21, t24);
			append_dev(div21, div14);
			append_dev(div14, div13);
			append_dev(div13, label6);
			append_dev(div13, t26);
			append_dev(div13, input5);
			append_dev(div21, t27);
			append_dev(div21, div16);
			append_dev(div16, div15);
			append_dev(div15, label7);
			append_dev(div15, t29);
			append_dev(div15, input6);
			append_dev(div16, t30);
			append_dev(div16, button1);
			append_dev(div21, t32);
			append_dev(div21, div18);
			append_dev(div18, div17);
			append_dev(div17, input7);
			append_dev(div17, t33);
			append_dev(div17, label8);
			append_dev(div21, t35);
			append_dev(div21, div20);
			append_dev(div20, div19);
			append_dev(div19, input8);
			append_dev(div19, t36);
			append_dev(div19, label9);
			append_dev(div29, t38);
			append_dev(div29, div28);
			append_dev(div28, div27);
			append_dev(div27, div24);
			append_dev(div24, div23);
			append_dev(div23, label10);
			append_dev(div23, t40);
			append_dev(div23, textarea0);
			append_dev(div27, t41);
			append_dev(div27, div26);
			append_dev(div26, div25);
			append_dev(div25, label11);
			append_dev(div25, t43);
			append_dev(div25, input9);
			append_dev(div30, t44);
			append_dev(div30, input10);
			append_dev(div434, t45);
			append_dev(div434, div60);
			append_dev(div60, div59);
			append_dev(div59, div55);
			append_dev(div55, div35);
			append_dev(div35, div32);
			append_dev(div32, div31);
			append_dev(div31, label12);
			append_dev(div31, t47);
			append_dev(div31, input11);
			append_dev(div35, t48);
			append_dev(div35, div34);
			append_dev(div34, div33);
			append_dev(div33, label13);
			append_dev(div33, t50);
			append_dev(div33, input12);
			append_dev(div55, t51);
			append_dev(div55, div40);
			append_dev(div40, div37);
			append_dev(div37, div36);
			append_dev(div36, label14);
			append_dev(div36, t53);
			append_dev(div36, input13);
			append_dev(div40, t54);
			append_dev(div40, div39);
			append_dev(div39, div38);
			append_dev(div38, label15);
			append_dev(div38, t56);
			append_dev(div38, input14);
			append_dev(div55, t57);
			append_dev(div55, div45);
			append_dev(div45, div42);
			append_dev(div42, div41);
			append_dev(div41, label16);
			append_dev(div41, t59);
			append_dev(div41, input15);
			append_dev(div45, t60);
			append_dev(div45, div44);
			append_dev(div44, div43);
			append_dev(div43, label17);
			append_dev(div43, t62);
			append_dev(div43, select1);
			append_dev(select1, option3);
			append_dev(select1, option4);
			append_dev(select1, option5);
			append_dev(div55, t66);
			append_dev(div55, div54);
			append_dev(div54, div47);
			append_dev(div47, div46);
			append_dev(div46, label18);
			append_dev(div46, t68);
			append_dev(div46, input16);
			append_dev(div54, t69);
			append_dev(div54, div49);
			append_dev(div49, div48);
			append_dev(div48, label19);
			append_dev(div48, t71);
			append_dev(div48, input17);
			append_dev(div54, t72);
			append_dev(div54, div51);
			append_dev(div51, div50);
			append_dev(div50, label20);
			append_dev(div50, t74);
			append_dev(div50, input18);
			append_dev(div54, t75);
			append_dev(div54, div53);
			append_dev(div53, div52);
			append_dev(div52, input19);
			append_dev(div52, t76);
			append_dev(div52, label21);
			append_dev(div54, t78);
			append_dev(div54, input20);
			append_dev(div59, t79);
			append_dev(div59, div58);
			append_dev(div58, div56);
			append_dev(div56, label22);
			append_dev(div56, t81);
			append_dev(div56, textarea1);
			append_dev(div58, t82);
			append_dev(div58, div57);
			mount_component(modalevent0, div57, null);
			append_dev(div434, t83);
			append_dev(div434, div92);
			append_dev(div92, div91);
			append_dev(div91, div86);
			append_dev(div86, div65);
			append_dev(div65, div62);
			append_dev(div62, div61);
			append_dev(div61, label23);
			append_dev(div61, t85);
			append_dev(div61, input21);
			append_dev(div65, t86);
			append_dev(div65, div64);
			append_dev(div64, div63);
			append_dev(div63, label24);
			append_dev(div63, t88);
			append_dev(div63, input22);
			append_dev(div86, t89);
			append_dev(div86, div70);
			append_dev(div70, div67);
			append_dev(div67, div66);
			append_dev(div66, label25);
			append_dev(div66, t91);
			append_dev(div66, input23);
			append_dev(div70, t92);
			append_dev(div70, div69);
			append_dev(div69, div68);
			append_dev(div68, label26);
			append_dev(div68, t94);
			append_dev(div68, input24);
			append_dev(div86, t95);
			append_dev(div86, div85);
			append_dev(div85, div72);
			append_dev(div72, div71);
			append_dev(div71, label27);
			append_dev(div71, t97);
			append_dev(div71, input25);
			append_dev(div85, t98);
			append_dev(div85, div74);
			append_dev(div74, div73);
			append_dev(div73, label28);
			append_dev(div73, t100);
			append_dev(div73, input26);
			append_dev(div85, t101);
			append_dev(div85, div76);
			append_dev(div76, div75);
			append_dev(div75, label29);
			append_dev(div75, t103);
			append_dev(div75, input27);
			append_dev(div85, t104);
			append_dev(div85, div78);
			append_dev(div78, div77);
			append_dev(div77, label30);
			append_dev(div77, t106);
			append_dev(div77, select2);
			append_dev(select2, option6);
			append_dev(select2, option7);
			append_dev(div85, t109);
			append_dev(div85, div80);
			append_dev(div80, div79);
			append_dev(div79, label31);
			append_dev(div79, t111);
			append_dev(div79, select3);
			append_dev(select3, option8);
			append_dev(select3, option9);
			append_dev(div85, t114);
			append_dev(div85, div82);
			append_dev(div82, div81);
			append_dev(div81, input28);
			append_dev(div81, t115);
			append_dev(div81, label32);
			append_dev(div85, t117);
			append_dev(div85, div84);
			append_dev(div84, div83);
			append_dev(div83, input29);
			append_dev(div83, t118);
			append_dev(div83, label33);
			append_dev(div85, t120);
			append_dev(div85, input30);
			append_dev(div91, t121);
			append_dev(div91, div90);
			append_dev(div90, div87);
			append_dev(div87, label34);
			append_dev(div87, t123);
			append_dev(div87, textarea2);
			append_dev(div90, t124);
			append_dev(div90, div88);
			append_dev(div88, label35);
			append_dev(div88, t126);
			append_dev(div88, select4);
			append_dev(div90, t127);
			append_dev(div90, div89);
			mount_component(modalevent1, div89, null);
			append_dev(div434, t128);
			append_dev(div434, div120);
			append_dev(div120, div119);
			append_dev(div119, div114);
			append_dev(div114, div97);
			append_dev(div97, div94);
			append_dev(div94, div93);
			append_dev(div93, label36);
			append_dev(div93, t130);
			append_dev(div93, input31);
			append_dev(div97, t131);
			append_dev(div97, div96);
			append_dev(div96, div95);
			append_dev(div95, label37);
			append_dev(div95, t133);
			append_dev(div95, input32);
			append_dev(div114, t134);
			append_dev(div114, div102);
			append_dev(div102, div99);
			append_dev(div99, div98);
			append_dev(div98, label38);
			append_dev(div98, t136);
			append_dev(div98, input33);
			append_dev(div102, t137);
			append_dev(div102, div101);
			append_dev(div101, div100);
			append_dev(div100, label39);
			append_dev(div100, t139);
			append_dev(div100, input34);
			append_dev(div114, t140);
			append_dev(div114, div113);
			append_dev(div113, div104);
			append_dev(div104, div103);
			append_dev(div103, label40);
			append_dev(div103, t142);
			append_dev(div103, textarea3);
			append_dev(div113, t143);
			append_dev(div113, div106);
			append_dev(div106, div105);
			append_dev(div105, label41);
			append_dev(div105, t145);
			append_dev(div105, textarea4);
			append_dev(div113, t146);
			append_dev(div113, div108);
			append_dev(div108, div107);
			append_dev(div107, label42);
			append_dev(div107, t148);
			append_dev(div107, input35);
			append_dev(div113, t149);
			append_dev(div113, div110);
			append_dev(div110, div109);
			append_dev(div109, label43);
			append_dev(div109, t151);
			append_dev(div109, select5);
			append_dev(select5, option10);
			append_dev(select5, option11);
			append_dev(div113, t154);
			append_dev(div113, div112);
			append_dev(div112, div111);
			append_dev(div111, input36);
			append_dev(div111, t155);
			append_dev(div111, label44);
			append_dev(div113, t157);
			append_dev(div113, input37);
			append_dev(div119, t158);
			append_dev(div119, div118);
			append_dev(div118, div115);
			append_dev(div115, label45);
			append_dev(div115, t160);
			append_dev(div115, textarea5);
			append_dev(div118, t161);
			append_dev(div118, div116);
			append_dev(div116, label46);
			append_dev(div116, t163);
			append_dev(div116, select6);
			append_dev(div118, t164);
			append_dev(div118, div117);
			mount_component(modalevent2, div117, null);
			append_dev(div434, t165);
			append_dev(div434, div141);
			append_dev(div141, div140);
			append_dev(div140, div136);
			append_dev(div136, div125);
			append_dev(div125, div122);
			append_dev(div122, div121);
			append_dev(div121, label47);
			append_dev(div121, t167);
			append_dev(div121, input38);
			append_dev(div125, t168);
			append_dev(div125, div124);
			append_dev(div124, div123);
			append_dev(div123, label48);
			append_dev(div123, t170);
			append_dev(div123, input39);
			append_dev(div136, t171);
			append_dev(div136, div130);
			append_dev(div130, div127);
			append_dev(div127, div126);
			append_dev(div126, label49);
			append_dev(div126, t173);
			append_dev(div126, input40);
			append_dev(div130, t174);
			append_dev(div130, div129);
			append_dev(div129, div128);
			append_dev(div128, label50);
			append_dev(div128, t176);
			append_dev(div128, input41);
			append_dev(div136, t177);
			append_dev(div136, div135);
			append_dev(div135, div132);
			append_dev(div132, div131);
			append_dev(div131, label51);
			append_dev(div131, t179);
			append_dev(div131, input42);
			append_dev(div135, t180);
			append_dev(div135, div134);
			append_dev(div134, div133);
			append_dev(div133, label52);
			append_dev(div133, t182);
			append_dev(div133, input43);
			append_dev(div135, t183);
			append_dev(div135, input44);
			append_dev(div140, t184);
			append_dev(div140, div139);
			append_dev(div139, div137);
			append_dev(div137, label53);
			append_dev(div137, t186);
			append_dev(div137, textarea6);
			append_dev(div139, t187);
			append_dev(div139, div138);
			mount_component(modalevent3, div138, null);
			append_dev(div434, t188);
			append_dev(div434, div166);
			append_dev(div166, div165);
			append_dev(div165, div161);
			append_dev(div161, div146);
			append_dev(div146, div143);
			append_dev(div143, div142);
			append_dev(div142, label54);
			append_dev(div142, t190);
			append_dev(div142, input45);
			append_dev(div146, t191);
			append_dev(div146, div145);
			append_dev(div145, div144);
			append_dev(div144, label55);
			append_dev(div144, t193);
			append_dev(div144, input46);
			append_dev(div161, t194);
			append_dev(div161, div151);
			append_dev(div151, div148);
			append_dev(div148, div147);
			append_dev(div147, label56);
			append_dev(div147, t196);
			append_dev(div147, input47);
			append_dev(div151, t197);
			append_dev(div151, div150);
			append_dev(div150, div149);
			append_dev(div149, label57);
			append_dev(div149, t199);
			append_dev(div149, input48);
			append_dev(div161, t200);
			append_dev(div161, div160);
			append_dev(div160, div153);
			append_dev(div153, div152);
			append_dev(div152, label58);
			append_dev(div152, t202);
			append_dev(div152, input49);
			append_dev(div160, t203);
			append_dev(div160, div155);
			append_dev(div155, div154);
			append_dev(div154, label59);
			append_dev(div154, t205);
			append_dev(div154, input50);
			append_dev(div160, t206);
			append_dev(div160, div157);
			append_dev(div157, div156);
			append_dev(div156, label60);
			append_dev(div156, t208);
			append_dev(div156, input51);
			append_dev(div160, t209);
			append_dev(div160, div159);
			append_dev(div159, div158);
			append_dev(div158, label61);
			append_dev(div158, t211);
			append_dev(div158, input52);
			append_dev(div160, t212);
			append_dev(div160, input53);
			append_dev(div165, t213);
			append_dev(div165, div164);
			append_dev(div164, div162);
			append_dev(div162, label62);
			append_dev(div162, t215);
			append_dev(div162, textarea7);
			append_dev(div164, t216);
			append_dev(div164, div163);
			mount_component(modalevent4, div163, null);
			append_dev(div434, t217);
			append_dev(div434, div187);
			append_dev(div187, div186);
			append_dev(div186, div182);
			append_dev(div182, div171);
			append_dev(div171, div168);
			append_dev(div168, div167);
			append_dev(div167, label63);
			append_dev(div167, t219);
			append_dev(div167, input54);
			append_dev(div171, t220);
			append_dev(div171, div170);
			append_dev(div170, div169);
			append_dev(div169, label64);
			append_dev(div169, t222);
			append_dev(div169, input55);
			append_dev(div182, t223);
			append_dev(div182, div176);
			append_dev(div176, div173);
			append_dev(div173, div172);
			append_dev(div172, label65);
			append_dev(div172, t225);
			append_dev(div172, input56);
			append_dev(div176, t226);
			append_dev(div176, div175);
			append_dev(div175, div174);
			append_dev(div174, label66);
			append_dev(div174, t228);
			append_dev(div174, input57);
			append_dev(div182, t229);
			append_dev(div182, div181);
			append_dev(div181, div178);
			append_dev(div178, div177);
			append_dev(div177, label67);
			append_dev(div177, t231);
			append_dev(div177, input58);
			append_dev(div181, t232);
			append_dev(div181, div180);
			append_dev(div180, div179);
			append_dev(div179, label68);
			append_dev(div179, t234);
			append_dev(div179, input59);
			append_dev(div180, t235);
			append_dev(div180, input60);
			append_dev(div186, t236);
			append_dev(div186, div185);
			append_dev(div185, div183);
			append_dev(div183, label69);
			append_dev(div183, t238);
			append_dev(div183, textarea8);
			append_dev(div185, t239);
			append_dev(div185, div184);
			mount_component(modalevent5, div184, null);
			append_dev(div434, t240);
			append_dev(div434, div206);
			append_dev(div206, div205);
			append_dev(div205, div201);
			append_dev(div201, div192);
			append_dev(div192, div189);
			append_dev(div189, div188);
			append_dev(div188, label70);
			append_dev(div188, t242);
			append_dev(div188, input61);
			append_dev(div192, t243);
			append_dev(div192, div191);
			append_dev(div191, div190);
			append_dev(div190, label71);
			append_dev(div190, t245);
			append_dev(div190, input62);
			append_dev(div201, t246);
			append_dev(div201, div197);
			append_dev(div197, div194);
			append_dev(div194, div193);
			append_dev(div193, label72);
			append_dev(div193, t248);
			append_dev(div193, input63);
			append_dev(div197, t249);
			append_dev(div197, div196);
			append_dev(div196, div195);
			append_dev(div195, label73);
			append_dev(div195, t251);
			append_dev(div195, input64);
			append_dev(div201, t252);
			append_dev(div201, div200);
			append_dev(div200, div199);
			append_dev(div199, div198);
			append_dev(div198, label74);
			append_dev(div198, t254);
			append_dev(div198, textarea9);
			append_dev(div199, t255);
			append_dev(div199, input65);
			append_dev(div205, t256);
			append_dev(div205, div204);
			append_dev(div204, div202);
			append_dev(div202, label75);
			append_dev(div202, t258);
			append_dev(div202, textarea10);
			append_dev(div204, t259);
			append_dev(div204, div203);
			mount_component(modalevent6, div203, null);
			append_dev(div434, t260);
			append_dev(div434, div227);
			append_dev(div227, div226);
			append_dev(div226, div222);
			append_dev(div222, div211);
			append_dev(div211, div208);
			append_dev(div208, div207);
			append_dev(div207, label76);
			append_dev(div207, t262);
			append_dev(div207, input66);
			append_dev(div211, t263);
			append_dev(div211, div210);
			append_dev(div210, div209);
			append_dev(div209, label77);
			append_dev(div209, t265);
			append_dev(div209, input67);
			append_dev(div222, t266);
			append_dev(div222, div216);
			append_dev(div216, div213);
			append_dev(div213, div212);
			append_dev(div212, label78);
			append_dev(div212, t268);
			append_dev(div212, input68);
			append_dev(div216, t269);
			append_dev(div216, div215);
			append_dev(div215, div214);
			append_dev(div214, label79);
			append_dev(div214, t271);
			append_dev(div214, input69);
			append_dev(div222, t272);
			append_dev(div222, div221);
			append_dev(div221, div218);
			append_dev(div218, div217);
			append_dev(div217, label80);
			append_dev(div217, t274);
			append_dev(div217, textarea11);
			append_dev(div221, t275);
			append_dev(div221, div220);
			append_dev(div220, div219);
			append_dev(div219, input70);
			append_dev(div219, t276);
			append_dev(div219, label81);
			append_dev(div221, t278);
			append_dev(div221, input71);
			append_dev(div221, t279);
			append_dev(div221, input72);
			append_dev(div226, t280);
			append_dev(div226, div225);
			append_dev(div225, div223);
			append_dev(div223, label82);
			append_dev(div223, t282);
			append_dev(div223, textarea12);
			append_dev(div225, t283);
			append_dev(div225, div224);
			mount_component(modalevent7, div224, null);
			append_dev(div434, t284);
			append_dev(div434, div245);
			append_dev(div245, div244);
			append_dev(div244, div243);
			append_dev(div243, div232);
			append_dev(div232, div229);
			append_dev(div229, div228);
			append_dev(div228, label83);
			append_dev(div228, t286);
			append_dev(div228, input73);
			append_dev(div232, t287);
			append_dev(div232, div231);
			append_dev(div231, div230);
			append_dev(div230, label84);
			append_dev(div230, t289);
			append_dev(div230, input74);
			append_dev(div243, t290);
			append_dev(div243, div237);
			append_dev(div237, div234);
			append_dev(div234, div233);
			append_dev(div233, label85);
			append_dev(div233, t292);
			append_dev(div233, input75);
			append_dev(div237, t293);
			append_dev(div237, div236);
			append_dev(div236, div235);
			append_dev(div235, label86);
			append_dev(div235, t295);
			append_dev(div235, input76);
			append_dev(div243, t296);
			append_dev(div243, div242);
			append_dev(div242, div239);
			append_dev(div239, div238);
			append_dev(div238, label87);
			append_dev(div238, t298);
			append_dev(div238, input77);
			append_dev(div242, t299);
			append_dev(div242, div241);
			append_dev(div241, div240);
			append_dev(div240, label88);
			append_dev(div240, t301);
			append_dev(div240, input78);
			append_dev(div241, t302);
			append_dev(div241, input79);
			append_dev(div244, t303);
			if (if_block) if_block.m(div244, null);
			append_dev(div434, t304);
			append_dev(div434, div266);
			append_dev(div266, div265);
			append_dev(div265, div261);
			append_dev(div261, div250);
			append_dev(div250, div247);
			append_dev(div247, div246);
			append_dev(div246, label89);
			append_dev(div246, t306);
			append_dev(div246, input80);
			append_dev(div250, t307);
			append_dev(div250, div249);
			append_dev(div249, div248);
			append_dev(div248, label90);
			append_dev(div248, t309);
			append_dev(div248, input81);
			append_dev(div261, t310);
			append_dev(div261, div255);
			append_dev(div255, div252);
			append_dev(div252, div251);
			append_dev(div251, label91);
			append_dev(div251, t312);
			append_dev(div251, input82);
			append_dev(div255, t313);
			append_dev(div255, div254);
			append_dev(div254, div253);
			append_dev(div253, label92);
			append_dev(div253, t315);
			append_dev(div253, input83);
			append_dev(div261, t316);
			append_dev(div261, div260);
			append_dev(div260, div257);
			append_dev(div257, div256);
			append_dev(div256, label93);
			append_dev(div256, t318);
			append_dev(div256, input84);
			append_dev(div260, t319);
			append_dev(div260, div259);
			append_dev(div259, div258);
			append_dev(div258, label94);
			append_dev(div258, t321);
			append_dev(div258, input85);
			append_dev(div258, t322);
			append_dev(div258, input86);
			append_dev(div265, t323);
			append_dev(div265, div264);
			append_dev(div264, div262);
			append_dev(div262, label95);
			append_dev(div262, t325);
			append_dev(div262, textarea13);
			append_dev(div264, t326);
			append_dev(div264, div263);
			mount_component(modalevent8, div263, null);
			append_dev(div434, t327);
			append_dev(div434, div294);
			append_dev(div294, div293);
			append_dev(div293, div288);
			append_dev(div288, div287);
			append_dev(div287, div268);
			append_dev(div268, div267);
			append_dev(div267, label96);
			append_dev(div267, t329);
			append_dev(div267, input87);
			append_dev(div287, t330);
			append_dev(div287, div270);
			append_dev(div270, div269);
			append_dev(div269, label97);
			append_dev(div269, t332);
			append_dev(div269, input88);
			append_dev(div287, t333);
			append_dev(div287, div272);
			append_dev(div272, div271);
			append_dev(div271, label98);
			append_dev(div271, t335);
			append_dev(div271, input89);
			append_dev(div287, t336);
			append_dev(div287, div274);
			append_dev(div274, div273);
			append_dev(div273, label99);
			append_dev(div273, t338);
			append_dev(div273, input90);
			append_dev(div287, t339);
			append_dev(div287, div276);
			append_dev(div276, div275);
			append_dev(div275, label100);
			append_dev(div275, t341);
			append_dev(div275, input91);
			append_dev(div287, t342);
			append_dev(div287, div278);
			append_dev(div278, div277);
			append_dev(div277, label101);
			append_dev(div277, t344);
			append_dev(div277, select7);
			append_dev(select7, option12);
			append_dev(select7, option13);
			append_dev(select7, option14);
			append_dev(select7, option15);
			append_dev(select7, option16);
			append_dev(select7, option17);
			append_dev(div287, t351);
			append_dev(div287, div280);
			append_dev(div280, div279);
			append_dev(div279, label102);
			append_dev(div279, t353);
			append_dev(div279, select8);
			append_dev(select8, option18);
			append_dev(select8, option19);
			append_dev(select8, option20);
			append_dev(select8, option21);
			append_dev(select8, option22);
			append_dev(div287, t359);
			append_dev(div287, div282);
			append_dev(div282, div281);
			append_dev(div281, label103);
			append_dev(div281, t361);
			append_dev(div281, select9);
			append_dev(select9, option23);
			append_dev(select9, option24);
			append_dev(select9, option25);
			append_dev(select9, option26);
			append_dev(div281, t366);
			append_dev(div281, input92);
			append_dev(div287, t367);
			append_dev(div287, div284);
			append_dev(div284, div283);
			append_dev(div283, label104);
			append_dev(div283, t369);
			append_dev(div283, select10);
			append_dev(div287, t370);
			append_dev(div287, div286);
			append_dev(div286, div285);
			append_dev(div285, input93);
			append_dev(div285, t371);
			append_dev(div285, label105);
			append_dev(div293, t373);
			append_dev(div293, div292);
			append_dev(div292, div291);
			append_dev(div291, div290);
			append_dev(div290, div289);
			mount_component(modalevent9, div289, null);
			append_dev(div434, t374);
			append_dev(div434, div315);
			append_dev(div315, div314);
			append_dev(div314, div312);
			append_dev(div312, div303);
			append_dev(div303, div296);
			append_dev(div296, div295);
			append_dev(div295, label106);
			append_dev(div295, t376);
			append_dev(div295, input94);
			append_dev(div303, t377);
			append_dev(div303, div298);
			append_dev(div298, div297);
			append_dev(div297, label107);
			append_dev(div297, t379);
			append_dev(div297, input95);
			append_dev(div303, t380);
			append_dev(div303, div300);
			append_dev(div300, div299);
			append_dev(div299, label108);
			append_dev(div299, t382);
			append_dev(div299, input96);
			append_dev(div303, t383);
			append_dev(div303, div302);
			append_dev(div302, div301);
			append_dev(div301, label109);
			append_dev(div301, t385);
			append_dev(div301, input97);
			append_dev(div312, t386);
			append_dev(div312, div308);
			append_dev(div308, div305);
			append_dev(div305, div304);
			append_dev(div304, label110);
			append_dev(div304, t388);
			append_dev(div304, input98);
			append_dev(div308, t389);
			append_dev(div308, div307);
			append_dev(div307, div306);
			append_dev(div306, label111);
			append_dev(div306, t391);
			append_dev(div306, input99);
			append_dev(div312, t392);
			append_dev(div312, div311);
			append_dev(div311, div310);
			append_dev(div310, div309);
			append_dev(div309, label112);
			append_dev(div309, t394);
			append_dev(div309, input100);
			append_dev(div312, t395);
			append_dev(div312, input101);
			append_dev(div314, t396);
			append_dev(div314, div313);
			append_dev(div434, t397);
			append_dev(div434, div336);
			append_dev(div336, div335);
			append_dev(div335, div333);
			append_dev(div333, div324);
			append_dev(div324, div317);
			append_dev(div317, div316);
			append_dev(div316, label113);
			append_dev(div316, t399);
			append_dev(div316, input102);
			append_dev(div324, t400);
			append_dev(div324, div319);
			append_dev(div319, div318);
			append_dev(div318, label114);
			append_dev(div318, t402);
			append_dev(div318, input103);
			append_dev(div324, t403);
			append_dev(div324, div321);
			append_dev(div321, div320);
			append_dev(div320, label115);
			append_dev(div320, t405);
			append_dev(div320, input104);
			append_dev(div324, t406);
			append_dev(div324, div323);
			append_dev(div323, div322);
			append_dev(div322, label116);
			append_dev(div322, t408);
			append_dev(div322, input105);
			append_dev(div333, t409);
			append_dev(div333, div329);
			append_dev(div329, div326);
			append_dev(div326, div325);
			append_dev(div325, label117);
			append_dev(div325, t411);
			append_dev(div325, input106);
			append_dev(div329, t412);
			append_dev(div329, div328);
			append_dev(div328, div327);
			append_dev(div327, label118);
			append_dev(div327, t414);
			append_dev(div327, input107);
			append_dev(div333, t415);
			append_dev(div333, div332);
			append_dev(div332, div331);
			append_dev(div331, div330);
			append_dev(div330, label119);
			append_dev(div330, t417);
			append_dev(div330, input108);
			append_dev(div333, t418);
			append_dev(div333, input109);
			append_dev(div335, t419);
			append_dev(div335, div334);
			append_dev(div434, t420);
			append_dev(div434, div358);
			append_dev(div358, div357);
			append_dev(div357, div356);
			append_dev(div356, div345);
			append_dev(div345, div338);
			append_dev(div338, div337);
			append_dev(div337, label120);
			append_dev(div337, t422);
			append_dev(div337, input110);
			append_dev(div345, t423);
			append_dev(div345, div340);
			append_dev(div340, div339);
			append_dev(div339, label121);
			append_dev(div339, t425);
			append_dev(div339, input111);
			append_dev(div345, t426);
			append_dev(div345, div342);
			append_dev(div342, div341);
			append_dev(div341, label122);
			append_dev(div341, t428);
			append_dev(div341, input112);
			append_dev(div345, t429);
			append_dev(div345, div344);
			append_dev(div344, div343);
			append_dev(div343, label123);
			append_dev(div343, t431);
			append_dev(div343, input113);
			append_dev(div356, t432);
			append_dev(div356, div350);
			append_dev(div350, div347);
			append_dev(div347, div346);
			append_dev(div346, label124);
			append_dev(div346, t434);
			append_dev(div346, input114);
			append_dev(div350, t435);
			append_dev(div350, div349);
			append_dev(div349, div348);
			append_dev(div348, label125);
			append_dev(div348, t437);
			append_dev(div348, input115);
			append_dev(div356, t438);
			append_dev(div356, div355);
			append_dev(div355, div352);
			append_dev(div352, div351);
			append_dev(div351, label126);
			append_dev(div351, t440);
			append_dev(div351, input116);
			append_dev(div355, t441);
			append_dev(div355, div354);
			append_dev(div354, div353);
			append_dev(div353, input117);
			append_dev(div353, t442);
			append_dev(div353, label127);
			append_dev(div356, t444);
			append_dev(div356, input118);
			append_dev(div434, t445);
			append_dev(div434, div370);
			append_dev(div370, div369);
			append_dev(div369, div368);
			append_dev(div368, div367);
			append_dev(div367, div360);
			append_dev(div360, div359);
			append_dev(div359, label128);
			append_dev(div359, t447);
			append_dev(div359, input119);
			append_dev(div367, t448);
			append_dev(div367, div362);
			append_dev(div362, div361);
			append_dev(div361, label129);
			append_dev(div361, t450);
			append_dev(div361, input120);
			append_dev(div367, t451);
			append_dev(div367, div364);
			append_dev(div364, div363);
			append_dev(div363, label130);
			append_dev(div363, t453);
			append_dev(div363, input121);
			append_dev(div367, t454);
			append_dev(div367, div366);
			append_dev(div366, div365);
			append_dev(div365, label131);
			append_dev(div365, t456);
			append_dev(div365, input122);
			append_dev(div368, t457);
			append_dev(div368, input123);
			append_dev(div434, t458);
			append_dev(div434, div383);
			append_dev(div383, div382);
			append_dev(div382, div381);
			append_dev(div381, div375);
			append_dev(div375, div372);
			append_dev(div372, div371);
			append_dev(div371, label132);
			append_dev(div371, t460);
			append_dev(div371, input124);
			append_dev(div375, t461);
			append_dev(div375, div374);
			append_dev(div374, div373);
			append_dev(div373, label133);
			append_dev(div373, t463);
			append_dev(div373, input125);
			append_dev(div381, t464);
			append_dev(div381, div380);
			append_dev(div380, div377);
			append_dev(div377, div376);
			append_dev(div376, label134);
			append_dev(div376, t466);
			append_dev(div376, input126);
			append_dev(div377, t467);
			append_dev(div377, button2);
			append_dev(div380, t469);
			append_dev(div380, div379);
			append_dev(div379, div378);
			append_dev(div378, input127);
			append_dev(div378, t470);
			append_dev(div378, label135);
			append_dev(div379, t472);
			append_dev(div379, input128);
			append_dev(div434, t473);
			append_dev(div434, div394);
			append_dev(div394, div393);
			append_dev(div393, div392);
			append_dev(div392, div388);
			append_dev(div388, div385);
			append_dev(div385, div384);
			append_dev(div384, label136);
			append_dev(div384, t475);
			append_dev(div384, input129);
			append_dev(div385, t476);
			append_dev(div385, button3);
			append_dev(div388, t478);
			append_dev(div388, div387);
			append_dev(div387, div386);
			append_dev(div386, label137);
			append_dev(div386, t480);
			append_dev(div386, input130);
			append_dev(div392, t481);
			append_dev(div392, div391);
			append_dev(div391, div390);
			append_dev(div390, div389);
			append_dev(div389, input131);
			append_dev(div389, t482);
			append_dev(div389, label138);
			append_dev(div392, t484);
			append_dev(div392, input132);
			append_dev(div434, t485);
			append_dev(div434, div409);
			append_dev(div409, div408);
			append_dev(div408, div407);
			append_dev(div407, div401);
			append_dev(div401, div396);
			append_dev(div396, div395);
			append_dev(div395, label139);
			append_dev(div395, t487);
			append_dev(div395, input133);
			append_dev(div401, t488);
			append_dev(div401, div398);
			append_dev(div398, div397);
			append_dev(div397, label140);
			append_dev(div397, t490);
			append_dev(div397, input134);
			append_dev(div401, t491);
			append_dev(div401, div400);
			append_dev(div400, div399);
			append_dev(div399, label141);
			append_dev(div399, t493);
			append_dev(div399, input135);
			append_dev(div407, t494);
			append_dev(div407, div406);
			append_dev(div406, div403);
			append_dev(div403, div402);
			append_dev(div402, label142);
			append_dev(div402, t496);
			append_dev(div402, input136);
			append_dev(div406, t497);
			append_dev(div406, div405);
			append_dev(div405, button4);
			append_dev(div405, t499);
			append_dev(div405, div404);
			append_dev(div404, input137);
			append_dev(div404, t500);
			append_dev(div404, label143);
			append_dev(div434, t502);
			append_dev(div434, div410);
			append_dev(div410, textarea14);
			append_dev(div434, t503);
			append_dev(div434, div433);
			append_dev(div433, div432);
			append_dev(div432, div428);
			append_dev(div428, div415);
			append_dev(div415, div412);
			append_dev(div412, div411);
			append_dev(div411, label144);
			append_dev(div411, t505);
			append_dev(div411, input138);
			append_dev(div415, t506);
			append_dev(div415, div414);
			append_dev(div414, div413);
			append_dev(div413, label145);
			append_dev(div413, t508);
			append_dev(div413, input139);
			append_dev(div428, t509);
			append_dev(div428, div420);
			append_dev(div420, div417);
			append_dev(div417, div416);
			append_dev(div416, label146);
			append_dev(div416, t511);
			append_dev(div416, input140);
			append_dev(div420, t512);
			append_dev(div420, div419);
			append_dev(div419, div418);
			append_dev(div418, label147);
			append_dev(div418, t514);
			append_dev(div418, input141);
			append_dev(div428, t515);
			append_dev(div428, div427);
			append_dev(div427, div422);
			append_dev(div422, div421);
			append_dev(div421, label148);
			append_dev(div421, t517);
			append_dev(div421, input142);
			append_dev(div427, t518);
			append_dev(div427, div424);
			append_dev(div424, div423);
			append_dev(div423, label149);
			append_dev(div423, t520);
			append_dev(div423, input143);
			append_dev(div427, t521);
			append_dev(div427, div426);
			append_dev(div426, div425);
			append_dev(div425, label150);
			append_dev(div425, t523);
			append_dev(div425, input144);
			append_dev(div427, t524);
			append_dev(div427, input145);
			append_dev(div432, t525);
			append_dev(div432, div431);
			append_dev(div431, div429);
			append_dev(div429, label151);
			append_dev(div429, t527);
			append_dev(div429, textarea15);
			append_dev(div431, t528);
			append_dev(div431, div430);
			mount_component(modalevent10, div430, null);
			append_dev(div436, t529);
			append_dev(div436, div435);
			append_dev(div435, button5);
			append_dev(div435, t531);
			append_dev(div435, button6);
			append_dev(div435, t533);
			append_dev(div435, button7);
			current = true;
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*isDNDExtended*/ 1 && div243_class_value !== (div243_class_value = /*isDNDExtended*/ ctx[0] == 1 ? "col-sm-6" : "col-sm-12")) {
				attr_dev(div243, "class", div243_class_value);
			}

			if (/*isDNDExtended*/ ctx[0] == 1) {
				if (if_block) {
					if_block.p(ctx, dirty);

					if (dirty & /*isDNDExtended*/ 1) {
						transition_in(if_block, 1);
					}
				} else {
					if_block = create_if_block$g(ctx);
					if_block.c();
					transition_in(if_block, 1);
					if_block.m(div244, null);
				}
			} else if (if_block) {
				group_outros();

				transition_out(if_block, 1, 1, () => {
					if_block = null;
				});

				check_outros();
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(modalevent0.$$.fragment, local);
			transition_in(modalevent1.$$.fragment, local);
			transition_in(modalevent2.$$.fragment, local);
			transition_in(modalevent3.$$.fragment, local);
			transition_in(modalevent4.$$.fragment, local);
			transition_in(modalevent5.$$.fragment, local);
			transition_in(modalevent6.$$.fragment, local);
			transition_in(modalevent7.$$.fragment, local);
			transition_in(if_block);
			transition_in(modalevent8.$$.fragment, local);
			transition_in(modalevent9.$$.fragment, local);
			transition_in(modalevent10.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(modalevent0.$$.fragment, local);
			transition_out(modalevent1.$$.fragment, local);
			transition_out(modalevent2.$$.fragment, local);
			transition_out(modalevent3.$$.fragment, local);
			transition_out(modalevent4.$$.fragment, local);
			transition_out(modalevent5.$$.fragment, local);
			transition_out(modalevent6.$$.fragment, local);
			transition_out(modalevent7.$$.fragment, local);
			transition_out(if_block);
			transition_out(modalevent8.$$.fragment, local);
			transition_out(modalevent9.$$.fragment, local);
			transition_out(modalevent10.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div438);
			destroy_component(modalevent0);
			destroy_component(modalevent1);
			destroy_component(modalevent2);
			destroy_component(modalevent3);
			destroy_component(modalevent4);
			destroy_component(modalevent5);
			destroy_component(modalevent6);
			destroy_component(modalevent7);
			if (if_block) if_block.d();
			destroy_component(modalevent8);
			destroy_component(modalevent9);
			destroy_component(modalevent10);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$h.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$h($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("DndModalBox", slots, []);
	let { isDNDExtended = 0 } = $$props;
	const writable_props = ["isDNDExtended"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DndModalBox> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("isDNDExtended" in $$props) $$invalidate(0, isDNDExtended = $$props.isDNDExtended);
	};

	$$self.$capture_state = () => ({ ModalEvent, l: Lang, isDNDExtended });

	$$self.$inject_state = $$props => {
		if ("isDNDExtended" in $$props) $$invalidate(0, isDNDExtended = $$props.isDNDExtended);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [isDNDExtended];
}

class DndModalBox extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document.getElementById("svelte-rrvcgd-style")) add_css();
		init(this, options, instance$h, create_fragment$h, safe_not_equal, { isDNDExtended: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DndModalBox",
			options,
			id: create_fragment$h.name
		});
	}

	get isDNDExtended() {
		throw new Error("<DndModalBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set isDNDExtended(value) {
		throw new Error("<DndModalBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* clsSMDragNDrop\DragNDrop.svelte generated by Svelte v3.29.0 */

const { console: console_1 } = globals;
const file$i = "clsSMDragNDrop\\DragNDrop.svelte";

function get_each_context$g(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[38] = list[i];
	return child_ctx;
}

// (729:2) {#if step && step.length}
function create_if_block_2$2(ctx) {
	let each_1_anchor;
	let each_value = /*step*/ ctx[4];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$g(get_each_context$g(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*step, state, DND_AUTH, changeStep*/ 561) {
				each_value = /*step*/ ctx[4];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$g(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block$g(child_ctx);
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
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$2.name,
		type: "if",
		source: "(729:2) {#if step && step.length}",
		ctx
	});

	return block;
}

// (731:16) {#if (data._display == "1" || data._ddisplay == '1') && state.store.updated == false}
function create_if_block_3(ctx) {
	let t_value = /*changeStep*/ ctx[9](/*data*/ ctx[38]._id) + "";
	let t;

	const block = {
		c: function create() {
			t = text(t_value);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*step*/ 16 && t_value !== (t_value = /*changeStep*/ ctx[9](/*data*/ ctx[38]._id) + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(t);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_3.name,
		type: "if",
		source: "(731:16) {#if (data._display == \\\"1\\\" || data._ddisplay == '1') && state.store.updated == false}",
		ctx
	});

	return block;
}

// (730:3) {#each step as data}
function create_each_block$g(ctx) {
	let t0;
	let span;
	let input;
	let input_id_value;
	let input_defaultchecked_value;
	let t1;
	let t2_value = /*data*/ ctx[38]._id + "";
	let t2;
	let t3;
	let span_for_value;
	let span_key_value;
	let mounted;
	let dispose;
	let if_block = (/*data*/ ctx[38]._display == "1" || /*data*/ ctx[38]._ddisplay == "1") && /*state*/ ctx[5].store.updated == false && create_if_block_3(ctx);

	function click_handler_1(...args) {
		return /*click_handler_1*/ ctx[15](/*data*/ ctx[38], ...args);
	}

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			t0 = space();
			span = element("span");
			input = element("input");
			t1 = space();
			t2 = text(t2_value);
			t3 = space();
			attr_dev(input, "id", input_id_value = "step_" + /*data*/ ctx[38]._id);
			attr_dev(input, "type", "radio");
			attr_dev(input, "defaultvalue", "1");
			attr_dev(input, "name", "rbsAuth");
			attr_dev(input, "class", "baseradio dndradio");

			attr_dev(input, "defaultchecked", input_defaultchecked_value = (/*data*/ ctx[38]._display == "1" || /*data*/ ctx[38]._ddisplay == "1") && /*state*/ ctx[5].store.updated == false
			? true
			: false);

			add_location(input, file$i, 734, 5, 30907);
			attr_dev(span, "for", span_for_value = /*data*/ ctx[38]._id);
			attr_dev(span, "key", span_key_value = /*data*/ ctx[38]._id);
			add_location(span, file$i, 733, 4, 30864);
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, t0, anchor);
			insert_dev(target, span, anchor);
			append_dev(span, input);
			append_dev(span, t1);
			append_dev(span, t2);
			append_dev(span, t3);

			if (!mounted) {
				dispose = listen_dev(input, "click", click_handler_1, false, false, false);
				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if ((/*data*/ ctx[38]._display == "1" || /*data*/ ctx[38]._ddisplay == "1") && /*state*/ ctx[5].store.updated == false) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_3(ctx);
					if_block.c();
					if_block.m(t0.parentNode, t0);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty[0] & /*step*/ 16 && input_id_value !== (input_id_value = "step_" + /*data*/ ctx[38]._id)) {
				attr_dev(input, "id", input_id_value);
			}

			if (dirty[0] & /*step, state*/ 48 && input_defaultchecked_value !== (input_defaultchecked_value = (/*data*/ ctx[38]._display == "1" || /*data*/ ctx[38]._ddisplay == "1") && /*state*/ ctx[5].store.updated == false
			? true
			: false)) {
				attr_dev(input, "defaultchecked", input_defaultchecked_value);
			}

			if (dirty[0] & /*step*/ 16 && t2_value !== (t2_value = /*data*/ ctx[38]._id + "")) set_data_dev(t2, t2_value);

			if (dirty[0] & /*step*/ 16 && span_for_value !== (span_for_value = /*data*/ ctx[38]._id)) {
				attr_dev(span, "for", span_for_value);
			}

			if (dirty[0] & /*step*/ 16 && span_key_value !== (span_key_value = /*data*/ ctx[38]._id)) {
				attr_dev(span, "key", span_key_value);
			}
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(span);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$g.name,
		type: "each",
		source: "(730:3) {#each step as data}",
		ctx
	});

	return block;
}

// (762:12) {:else}
function create_else_block$1(ctx) {
	let img;
	let img_src_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "id", "sample_image");
			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/bg_000PLn.png")) attr_dev(img, "src", img_src_value);
			attr_dev(img, "alt", img_alt_value = Lang.sample_img);
			add_location(img, file$i, 762, 16, 32244);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = listen_dev(img, "load", /*changeLoadState*/ ctx[11], false, false, false);
				mounted = true;
			}
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(762:12) {:else}",
		ctx
	});

	return block;
}

// (760:12) {#if bgImg}
function create_if_block_1$5(ctx) {
	let img;
	let img_height_value;
	let img_width_value;
	let img_src_value;
	let img_class_value;
	let img_alt_value;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			img = element("img");
			attr_dev(img, "height", img_height_value = /*imgHeight*/ ctx[2] + "px");
			attr_dev(img, "width", img_width_value = /*imgWidth*/ ctx[3] + "px");
			if (img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[1])) attr_dev(img, "src", img_src_value);
			attr_dev(img, "class", img_class_value = /*state*/ ctx[5].store.borderclass);

			attr_dev(img, "alt", img_alt_value = /*state*/ ctx[5].store.alt
			? /*state*/ ctx[5].store.alt
			: Lang.sample_img);

			add_location(img, file$i, 760, 16, 31941);
		},
		m: function mount(target, anchor) {
			insert_dev(target, img, anchor);

			if (!mounted) {
				dispose = [
					listen_dev(img, "error", /*checkError*/ ctx[8], false, false, false),
					listen_dev(img, "load", /*load_handler*/ ctx[17], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*imgHeight*/ 4 && img_height_value !== (img_height_value = /*imgHeight*/ ctx[2] + "px")) {
				attr_dev(img, "height", img_height_value);
			}

			if (dirty[0] & /*imgWidth*/ 8 && img_width_value !== (img_width_value = /*imgWidth*/ ctx[3] + "px")) {
				attr_dev(img, "width", img_width_value);
			}

			if (dirty[0] & /*bgImg*/ 2 && img.src !== (img_src_value = "https://s3.amazonaws.com/jigyaasa_content_static/" + /*bgImg*/ ctx[1])) {
				attr_dev(img, "src", img_src_value);
			}

			if (dirty[0] & /*state*/ 32 && img_class_value !== (img_class_value = /*state*/ ctx[5].store.borderclass)) {
				attr_dev(img, "class", img_class_value);
			}

			if (dirty[0] & /*state*/ 32 && img_alt_value !== (img_alt_value = /*state*/ ctx[5].store.alt
			? /*state*/ ctx[5].store.alt
			: Lang.sample_img)) {
				attr_dev(img, "alt", img_alt_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(img);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$5.name,
		type: "if",
		source: "(760:12) {#if bgImg}",
		ctx
	});

	return block;
}

// (765:12) {#if state.data && image_loaded}
function create_if_block$h(ctx) {
	let div;
	let drag0;
	let t0;
	let drag1;
	let t1;
	let drop0;
	let t2;
	let drop1;
	let t3;
	let radio;
	let t4;
	let select;
	let t5;
	let textbox;
	let t6;
	let multilinebox;
	let t7;
	let checkbox;
	let t8;
	let button;
	let t9;
	let tabhead;
	let t10;
	let img;
	let t11;
	let label;
	let t12;
	let hotspot;
	let t13;
	let menulist;
	let t14;
	let step_1;
	let t15;
	let tab;
	let current;

	drag0 = new Drag({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].drag,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	drag1 = new Drag({
			props: {
				index: 1,
				modules: /*state*/ ctx[5].data[1],
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	drop0 = new Drop({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].drop,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	drop1 = new Drop({
			props: {
				index: 1,
				modules: /*state*/ ctx[5].data[2],
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	radio = new Radio({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].radio,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	select = new Select({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].select,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	textbox = new Textbox({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].textbox,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	multilinebox = new Multilinebox({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].multilinebox,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	checkbox = new Checkbox({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].checkbox,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	button = new Button({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].button,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	tabhead = new Tabhead({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].tabhead,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	img = new Img({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].img,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	label = new Label({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].label,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	hotspot = new Hotspot({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].hotspot,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	menulist = new Menulist({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].menulist,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem
			},
			$$inline: true
		});

	step_1 = new Step({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].step,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem,
				checkImageStatus: /*checkImageStatus*/ ctx[7]
			},
			$$inline: true
		});

	tab = new Tab({
			props: {
				index: 0,
				modules: /*state*/ ctx[5].data[0].tab,
				elemModal: /*DND_AUTH*/ ctx[0].elemModal,
				deleteElem: /*DND_AUTH*/ ctx[0].deleteElem,
				checkImageStatus: /*checkImageStatus*/ ctx[7]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div = element("div");
			create_component(drag0.$$.fragment);
			t0 = space();
			create_component(drag1.$$.fragment);
			t1 = space();
			create_component(drop0.$$.fragment);
			t2 = space();
			create_component(drop1.$$.fragment);
			t3 = space();
			create_component(radio.$$.fragment);
			t4 = space();
			create_component(select.$$.fragment);
			t5 = space();
			create_component(textbox.$$.fragment);
			t6 = space();
			create_component(multilinebox.$$.fragment);
			t7 = space();
			create_component(checkbox.$$.fragment);
			t8 = space();
			create_component(button.$$.fragment);
			t9 = space();
			create_component(tabhead.$$.fragment);
			t10 = space();
			create_component(img.$$.fragment);
			t11 = space();
			create_component(label.$$.fragment);
			t12 = space();
			create_component(hotspot.$$.fragment);
			t13 = space();
			create_component(menulist.$$.fragment);
			t14 = space();
			create_component(step_1.$$.fragment);
			t15 = space();
			create_component(tab.$$.fragment);
			add_location(div, file$i, 765, 16, 32468);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(drag0, div, null);
			append_dev(div, t0);
			mount_component(drag1, div, null);
			append_dev(div, t1);
			mount_component(drop0, div, null);
			append_dev(div, t2);
			mount_component(drop1, div, null);
			append_dev(div, t3);
			mount_component(radio, div, null);
			append_dev(div, t4);
			mount_component(select, div, null);
			append_dev(div, t5);
			mount_component(textbox, div, null);
			append_dev(div, t6);
			mount_component(multilinebox, div, null);
			append_dev(div, t7);
			mount_component(checkbox, div, null);
			append_dev(div, t8);
			mount_component(button, div, null);
			append_dev(div, t9);
			mount_component(tabhead, div, null);
			append_dev(div, t10);
			mount_component(img, div, null);
			append_dev(div, t11);
			mount_component(label, div, null);
			append_dev(div, t12);
			mount_component(hotspot, div, null);
			append_dev(div, t13);
			mount_component(menulist, div, null);
			append_dev(div, t14);
			mount_component(step_1, div, null);
			append_dev(div, t15);
			mount_component(tab, div, null);
			current = true;
		},
		p: function update(ctx, dirty) {
			const drag0_changes = {};
			if (dirty[0] & /*state*/ 32) drag0_changes.modules = /*state*/ ctx[5].data[0].drag;
			if (dirty[0] & /*DND_AUTH*/ 1) drag0_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drag0_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drag0.$set(drag0_changes);
			const drag1_changes = {};
			if (dirty[0] & /*state*/ 32) drag1_changes.modules = /*state*/ ctx[5].data[1];
			if (dirty[0] & /*DND_AUTH*/ 1) drag1_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drag1_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drag1.$set(drag1_changes);
			const drop0_changes = {};
			if (dirty[0] & /*state*/ 32) drop0_changes.modules = /*state*/ ctx[5].data[0].drop;
			if (dirty[0] & /*DND_AUTH*/ 1) drop0_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drop0_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drop0.$set(drop0_changes);
			const drop1_changes = {};
			if (dirty[0] & /*state*/ 32) drop1_changes.modules = /*state*/ ctx[5].data[2];
			if (dirty[0] & /*DND_AUTH*/ 1) drop1_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) drop1_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			drop1.$set(drop1_changes);
			const radio_changes = {};
			if (dirty[0] & /*state*/ 32) radio_changes.modules = /*state*/ ctx[5].data[0].radio;
			if (dirty[0] & /*DND_AUTH*/ 1) radio_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) radio_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			radio.$set(radio_changes);
			const select_changes = {};
			if (dirty[0] & /*state*/ 32) select_changes.modules = /*state*/ ctx[5].data[0].select;
			if (dirty[0] & /*DND_AUTH*/ 1) select_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) select_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			select.$set(select_changes);
			const textbox_changes = {};
			if (dirty[0] & /*state*/ 32) textbox_changes.modules = /*state*/ ctx[5].data[0].textbox;
			if (dirty[0] & /*DND_AUTH*/ 1) textbox_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) textbox_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			textbox.$set(textbox_changes);
			const multilinebox_changes = {};
			if (dirty[0] & /*state*/ 32) multilinebox_changes.modules = /*state*/ ctx[5].data[0].multilinebox;
			if (dirty[0] & /*DND_AUTH*/ 1) multilinebox_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) multilinebox_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			multilinebox.$set(multilinebox_changes);
			const checkbox_changes = {};
			if (dirty[0] & /*state*/ 32) checkbox_changes.modules = /*state*/ ctx[5].data[0].checkbox;
			if (dirty[0] & /*DND_AUTH*/ 1) checkbox_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) checkbox_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			checkbox.$set(checkbox_changes);
			const button_changes = {};
			if (dirty[0] & /*state*/ 32) button_changes.modules = /*state*/ ctx[5].data[0].button;
			if (dirty[0] & /*DND_AUTH*/ 1) button_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) button_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			button.$set(button_changes);
			const tabhead_changes = {};
			if (dirty[0] & /*state*/ 32) tabhead_changes.modules = /*state*/ ctx[5].data[0].tabhead;
			if (dirty[0] & /*DND_AUTH*/ 1) tabhead_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) tabhead_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			tabhead.$set(tabhead_changes);
			const img_changes = {};
			if (dirty[0] & /*state*/ 32) img_changes.modules = /*state*/ ctx[5].data[0].img;
			if (dirty[0] & /*DND_AUTH*/ 1) img_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) img_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			img.$set(img_changes);
			const label_changes = {};
			if (dirty[0] & /*state*/ 32) label_changes.modules = /*state*/ ctx[5].data[0].label;
			if (dirty[0] & /*DND_AUTH*/ 1) label_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) label_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			label.$set(label_changes);
			const hotspot_changes = {};
			if (dirty[0] & /*state*/ 32) hotspot_changes.modules = /*state*/ ctx[5].data[0].hotspot;
			if (dirty[0] & /*DND_AUTH*/ 1) hotspot_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) hotspot_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			hotspot.$set(hotspot_changes);
			const menulist_changes = {};
			if (dirty[0] & /*state*/ 32) menulist_changes.modules = /*state*/ ctx[5].data[0].menulist;
			if (dirty[0] & /*DND_AUTH*/ 1) menulist_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) menulist_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			menulist.$set(menulist_changes);
			const step_1_changes = {};
			if (dirty[0] & /*state*/ 32) step_1_changes.modules = /*state*/ ctx[5].data[0].step;
			if (dirty[0] & /*DND_AUTH*/ 1) step_1_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) step_1_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			step_1.$set(step_1_changes);
			const tab_changes = {};
			if (dirty[0] & /*state*/ 32) tab_changes.modules = /*state*/ ctx[5].data[0].tab;
			if (dirty[0] & /*DND_AUTH*/ 1) tab_changes.elemModal = /*DND_AUTH*/ ctx[0].elemModal;
			if (dirty[0] & /*DND_AUTH*/ 1) tab_changes.deleteElem = /*DND_AUTH*/ ctx[0].deleteElem;
			tab.$set(tab_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(drag0.$$.fragment, local);
			transition_in(drag1.$$.fragment, local);
			transition_in(drop0.$$.fragment, local);
			transition_in(drop1.$$.fragment, local);
			transition_in(radio.$$.fragment, local);
			transition_in(select.$$.fragment, local);
			transition_in(textbox.$$.fragment, local);
			transition_in(multilinebox.$$.fragment, local);
			transition_in(checkbox.$$.fragment, local);
			transition_in(button.$$.fragment, local);
			transition_in(tabhead.$$.fragment, local);
			transition_in(img.$$.fragment, local);
			transition_in(label.$$.fragment, local);
			transition_in(hotspot.$$.fragment, local);
			transition_in(menulist.$$.fragment, local);
			transition_in(step_1.$$.fragment, local);
			transition_in(tab.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(drag0.$$.fragment, local);
			transition_out(drag1.$$.fragment, local);
			transition_out(drop0.$$.fragment, local);
			transition_out(drop1.$$.fragment, local);
			transition_out(radio.$$.fragment, local);
			transition_out(select.$$.fragment, local);
			transition_out(textbox.$$.fragment, local);
			transition_out(multilinebox.$$.fragment, local);
			transition_out(checkbox.$$.fragment, local);
			transition_out(button.$$.fragment, local);
			transition_out(tabhead.$$.fragment, local);
			transition_out(img.$$.fragment, local);
			transition_out(label.$$.fragment, local);
			transition_out(hotspot.$$.fragment, local);
			transition_out(menulist.$$.fragment, local);
			transition_out(step_1.$$.fragment, local);
			transition_out(tab.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_component(drag0);
			destroy_component(drag1);
			destroy_component(drop0);
			destroy_component(drop1);
			destroy_component(radio);
			destroy_component(select);
			destroy_component(textbox);
			destroy_component(multilinebox);
			destroy_component(checkbox);
			destroy_component(button);
			destroy_component(tabhead);
			destroy_component(img);
			destroy_component(label);
			destroy_component(hotspot);
			destroy_component(menulist);
			destroy_component(step_1);
			destroy_component(tab);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$h.name,
		type: "if",
		source: "(765:12) {#if state.data && image_loaded}",
		ctx
	});

	return block;
}

function create_fragment$i(ctx) {
	let div5;
	let div0;
	let input0;
	let t0;
	let t1_value = Lang.base_steps + "";
	let t1;
	let t2;
	let t3;
	let center0;
	let div2;
	let div1;
	let button0;
	let i;
	let button0_title_value;
	let t4;
	let t5;
	let t6;
	let input1;
	let t7;
	let button1;
	let t8;
	let center1;
	let div3;
	let t9;
	let div4;
	let t10;
	let dndmodalbox;
	let current;
	let mounted;
	let dispose;
	let if_block0 = /*step*/ ctx[4] && /*step*/ ctx[4].length && create_if_block_2$2(ctx);

	function select_block_type(ctx, dirty) {
		if (/*bgImg*/ ctx[1]) return create_if_block_1$5;
		return create_else_block$1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block1 = current_block_type(ctx);
	let if_block2 = /*state*/ ctx[5].data && /*image_loaded*/ ctx[6] && create_if_block$h(ctx);

	dndmodalbox = new DndModalBox({
			props: {
				isDNDExtended: /*DND_AUTH*/ ctx[0].isDNDExtended
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			div5 = element("div");
			div0 = element("div");
			input0 = element("input");
			t0 = space();
			t1 = text(t1_value);
			t2 = space();
			if (if_block0) if_block0.c();
			t3 = space();
			center0 = element("center");
			div2 = element("div");
			div1 = element("div");
			button0 = element("button");
			i = element("i");
			t4 = space();
			if_block1.c();
			t5 = space();
			if (if_block2) if_block2.c();
			t6 = space();
			input1 = element("input");
			t7 = space();
			button1 = element("button");
			t8 = space();
			center1 = element("center");
			div3 = element("div");
			t9 = space();
			div4 = element("div");
			t10 = space();
			create_component(dndmodalbox.$$.fragment);
			attr_dev(input0, "id", "baseAuth");
			attr_dev(input0, "type", "radio");
			attr_dev(input0, "defaultvalue", "1");
			attr_dev(input0, "defaultchecked", "");
			attr_dev(input0, "name", "rbsAuth");
			attr_dev(input0, "class", "baseradio dndradio");
			add_location(input0, file$i, 726, 2, 30455);
			attr_dev(div0, "id", "steps");
			attr_dev(div0, "class", "h");
			add_location(div0, file$i, 725, 4, 30424);
			attr_dev(i, "class", "icomoon-24px-edit-1");
			add_location(i, file$i, 757, 232, 31834);
			attr_dev(button0, "title", button0_title_value = Lang.edit_base);
			attr_dev(button0, "type", "button");
			attr_dev(button0, "class", "btn btn-light px-1 pt-sm1 pb-sm1 image-dialog");
			add_location(button0, file$i, 757, 16, 31618);
			attr_dev(div1, "class", "btn-group tools mr-1");
			attr_dev(div1, "data-t", "base");
			add_location(div1, file$i, 756, 12, 31552);
			attr_dev(div2, "id", "dndmain");
			attr_dev(div2, "path", "https://s3.amazonaws.com/jigyaasa_content_static/");
			attr_dev(div2, "class", "ui-resizable");
			set_style(div2, "height", "400px");
			set_style(div2, "width", "100%");
			add_location(div2, file$i, 750, 8, 31344);
			add_location(center0, file$i, 749, 4, 31326);
			attr_dev(input1, "type", "hidden");
			attr_dev(input1, "id", "special_module_xml");
			attr_dev(input1, "name", "special_module_xml");
			add_location(input1, file$i, 787, 4, 34893);
			attr_dev(button1, "type", "button");
			attr_dev(button1, "class", "h");
			attr_dev(button1, "id", "update_xml");
			attr_dev(button1, "name", "update_xml");
			add_location(button1, file$i, 788, 4, 34972);
			attr_dev(div3, "class", "smnotes");
			add_location(div3, file$i, 790, 8, 35071);
			add_location(center1, file$i, 789, 4, 35053);
			attr_dev(div4, "class", "parent h");
			attr_dev(div4, "data-parent", "dndmain");
			add_location(div4, file$i, 792, 4, 35119);
			attr_dev(div5, "class", "input_border dragable-container overflow-visible p");
			add_location(div5, file$i, 724, 0, 30354);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div5, anchor);
			append_dev(div5, div0);
			append_dev(div0, input0);
			append_dev(div0, t0);
			append_dev(div0, t1);
			append_dev(div0, t2);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div5, t3);
			append_dev(div5, center0);
			append_dev(center0, div2);
			append_dev(div2, div1);
			append_dev(div1, button0);
			append_dev(button0, i);
			append_dev(div2, t4);
			if_block1.m(div2, null);
			append_dev(div2, t5);
			if (if_block2) if_block2.m(div2, null);
			append_dev(div5, t6);
			append_dev(div5, input1);
			append_dev(div5, t7);
			append_dev(div5, button1);
			append_dev(div5, t8);
			append_dev(div5, center1);
			append_dev(center1, div3);
			append_dev(div5, t9);
			append_dev(div5, div4);
			append_dev(div5, t10);
			mount_component(dndmodalbox, div5, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[10], false, false, false),
					listen_dev(input0, "click", /*click_handler*/ ctx[14], false, false, false),
					listen_dev(button0, "click", /*click_handler_2*/ ctx[16], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if (/*step*/ ctx[4] && /*step*/ ctx[4].length) {
				if (if_block0) {
					if_block0.p(ctx, dirty);
				} else {
					if_block0 = create_if_block_2$2(ctx);
					if_block0.c();
					if_block0.m(div0, null);
				}
			} else if (if_block0) {
				if_block0.d(1);
				if_block0 = null;
			}

			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block1) {
				if_block1.p(ctx, dirty);
			} else {
				if_block1.d(1);
				if_block1 = current_block_type(ctx);

				if (if_block1) {
					if_block1.c();
					if_block1.m(div2, t5);
				}
			}

			if (/*state*/ ctx[5].data && /*image_loaded*/ ctx[6]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty[0] & /*state, image_loaded*/ 96) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block$h(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(div2, null);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}

			const dndmodalbox_changes = {};
			if (dirty[0] & /*DND_AUTH*/ 1) dndmodalbox_changes.isDNDExtended = /*DND_AUTH*/ ctx[0].isDNDExtended;
			dndmodalbox.$set(dndmodalbox_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block2);
			transition_in(dndmodalbox.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block2);
			transition_out(dndmodalbox.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div5);
			if (if_block0) if_block0.d();
			if_block1.d();
			if (if_block2) if_block2.d();
			destroy_component(dndmodalbox);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$i.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function objToLower(obj) {
	let newX = {};

	for (let index in obj) {
		newX[index.toLowerCase()] = obj[index];
	}

	return newX;
}

function instance$i($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("DragNDrop", slots, []);
	let { xml } = $$props;
	let { getChildXml } = $$props;

	// creating the varibles
	let QXML = "", bgImg = "", imgHeight = "", imgWidth = "";

	let step = [];
	let isOldXml = false;
	let xmlErrDialog = false;
	let container_id = "dndmain";
	let borderclassname = "img-bordered";
	let IS_EVENT_CALLED = 1;
	let minimum_resize = 25;
	let module_type = 1;
	let state = {};
	let image_loaded = 0;

	// creating store
	let auth_store = writable({
		xml: "",
		bgImage: "",
		imgHeight: "",
		imgWidth: "",
		alt: "",
		borderclass: "",
		updated: false,
		resize: false
	});

	// subscribing to the store
	const unsubscribe = auth_store.subscribe(value => {
		$$invalidate(5, state.store = value, state);
	});

	// responsible for rerendering the module based on the changed xml
	beforeUpdate(async () => {
		if (state.store.xml != xml) {
			loadModule(xml);

			if (isOldXml && !xmlErrDialog) {
				xmlErrDialog = true;

				swal({
					content: AH.parseHtml("<div>" + Lang.old_xml + "</div>"),
					icon: "warning",
					dangerMode: true
				});
			}
		}
	});

	// call once and bind all the events
	onMount(async () => {
		loadModule(xml);
		bindEvents();
	});

	// function for checking the dnd extended module
	function checkDndExtended() {
		let xml = AH.select("#special_module_xml").value;
		let isDNDExtended = 0;
		let oldxml = ["</step>", "</tab>", "</jscript>", "</menulist>"];

		if (xml) {
			for (let index = 0; index < oldxml.length; index++) {
				if (xml.includes(oldxml[index])) {
					isDNDExtended = 1;
					break;
				}
			}
		}

		return isDNDExtended;
	}

	// function responsible for binding the events
	function bindEvents() {
		AH.listen("body", "mouseup", "#dndmain", function () {
			if (!state.store.resize) {
				updateXML();
			}
		});

		AH.listen("body", "click", "#update_xml", function () {
			updateXML();
		});

		AH.listen("body", "mouseover", "#dndmain .cursor_move", function (element) {
			AH.select("#" + element.getAttribute("id") + ">.tools").classList.remove("h");
		});

		AH.listen("body", "mouseout", "#dndmain .cursor_move", function (element) {
			AH.select("#" + element.getAttribute("id") + ">.tools").classList.add("h");
		});

		AH.listen("body", "click", "#dndmain .cursor_move", function (element) {
			AH.selectAll("#dndmain .elemActive", "removeClass", "elemActive");
			element.classList.add("elemActive");
			element.focus();
		});

		AH.listen("body", "dblclick", "#dndmain .cursor_move", function () {
			if (AH.selectAll("#dndmain > textarea").length > 0) {
				AH.selectAll(".cursor_move > textarea", "show");
			}
		});

		AH.listen("body", "hidden.bs.modal", "#authoring-modal", function () {
			$$invalidate(0, DND_AUTH.visible_class = "", DND_AUTH);
			$$invalidate(0, DND_AUTH.error_message = "", DND_AUTH);
		});

		AH.listen("body", "click", "#authoring-modal .events a", function (element) {
			if (DND_AUTH.visible_class != "") {
				AH.selectAll(".events a", "removeClass", "active");
				element.classList.add("active");
				AH.selectAll(DND_AUTH.visible_class + " .event-input input", "removeClass", "show");
				AH.selectAll(DND_AUTH.visible_class + " .event-input input", "addClass", "h");
				AH.selectAll("#" + element.getAttribute("for"), "removeClass", "h");
				AH.selectAll("#" + element.getAttribute("for"), "addClass", "show");

				// don't why this is written this code
				let val = AH.select("#" + element.getAttribute("for")).value;

				let split_data = val.split(/\(.*?\;/g);

				if (Array.isArray(split_data)) {
					split_data = split_data.map(value => {
						return value.trim();
					}).filter(function (n) {
						return n;
					});

					AH.select(".event-input select").value = "";
				}
			}
		});

		AH.listen("body", "change", "#authoring-modal .event-input input.show", function (element) {
			if (DND_AUTH.visible_class != "" && element.closest(DND_AUTH.visible_class)) {
				let cur_element = AH.select("[for=\"" + element.getAttribute("id") + "\"]");

				if (cur_element && cur_element.nodeName) {
					AH.find(cur_element, ".icomoon-checkmark", { action: "remove" });

					if (element.value != "") {
						AH.insert("[for=\"" + element.getAttribute("id") + "\"]", "<i class=\"icomoon-checkmark float-end\"></i>", "beforeend");
					}
				}
			}
		});

		// not in use right now need to check with pradeep sir
		AH.listen("body", "change", "#authoring-modal .event-input select", function (element) {
			let val = element.value;
			let input = AH.select("#authoring-modal " + DND_AUTH.visible_class + " .event-input input.show");

			if (input.value.indexOf(val) == -1) {
				input.value = input.value + val + "();";
			}

			let cur_element = AH.select("[for=\"" + input.getAttribute("id") + "\"]");

			if (cur_element && cur_element.nodeName) {
				AH.find(cur_element, ".icomoon-checkmark", { action: "remove" });

				if (input.value != "") {
					AH.insert("[for=\"" + input.getAttribute("id") + "\"]", "<i class=\"icomoon-checkmark float-end\"></i>", "beforeend");
				}
			}
		});

		AH.listen(document, "click", ".addElement, #updateDnd", function () {
			let borderclass = AH.select("#authoring-modal #base-borderrequired").checked
			? borderclassname
			: "";

			auth_store.update(item => {
				item.bgImage = AH.select("#authoring-modal #base-bgimg").value;
				item.alt = AH.select("#authoring-modal #base-bgimg-alt").value;
				item.borderclass = borderclass;
				return item;
			});

			if (QXML.smxml.hotspot) {
				updateXML("deepUpdate");
			} else {
				updateXML();
			}
		});

		AH.listen("body", "change", "#authoring-modal input", function (current) {
			current.value = DND_AUTH.setValue(current.value);
		});

		AH.listen("body", "input", "#authoring-modal .validate", function (current) {
			toggleBtn(current);
		});

		AH.listen("body", "input", "#authoring-modal .number_validate", function (current) {
			let fixed = current.value.replace(/[^0-9]/g, "");

			if (current.value !== fixed) {
				current.value = fixed;
			}

			toggleBtn(current);
		});

		AH.listen("body", "keyup", "#authoring-modal .dropdown #ddn-value", function (current) {
			let fetched_list_data = DND_AUTH.errorChecking();
			let is_error = fetched_list_data[0] || fetched_list_data[1] == 0;

			$$invalidate(
				0,
				DND_AUTH.error_message = is_error
				? fetched_list_data[0]
					? Lang.one_option_correct
					: Lang.one_option_require
				: "",
				DND_AUTH
			);

			if (is_error) {
				AH.select("#authoring-modal .errorBtn", "removeClass", "h");
				AH.select("#authoring-modal .addElement", "addClass", "h");
			} else {
				AH.select("#authoring-modal .addElement", "removeClass", "h");
				AH.select("#authoring-modal .errorBtn", "addClass", "h");
			}
		});

		AH.listen("body", "click", ".errorBtn", function (element) {
			swal({
				text: DND_AUTH.error_message,
				icon: "error",
				dangerMode: true
			});
		});

		AH.listen("body", "keyup", "#authoring-modal input", function (el, e) {
			e.preventDefault();
			e.stopPropagation();

			if (e.keyCode == 13) {
				document.querySelector("#authoring-modal .addElement").click();
			}
		});

		AH.listen("body", "click", ".dragable-container #steps input", function (element) {
			let date_parent = element.getAttribute("id") == "baseAuth"
			? "dndmain"
			: "[id=\"" + element.parentElement.getAttribute("for") + "\"]";

			AH.select(".parent").setAttribute("data-parent", date_parent);
			AH.select(".parent").removeAttribute("type");
		});

		AH.listen("body", "click", ".dragable-container #dndmain .nav > li", function (element) {
			AH.select(".parent").setAttribute("data-parent", "[id=\"" + element.getAttribute("for") + "\"]");
			AH.select(".parent").setAttribute("type", "tab");
		});

		AH.listen("body", "click", "#dndmain .nav textarea", function (element) {
			AH.setCss(element, { width: element.value.length * 8 + "px" });
		});

		AH.listen("body", "click", "#upload_media, #drag_upload_media, #tab_upload_media, #step_upload_media", function () {
			AH.getBS("#modal-media-upload", "Modal").show();
		});
	}

	function toggleBtn(current) {
		if (current.value.trim() != "") {
			AH.select("#authoring-modal .addElement", "removeClass", "h");
			AH.select("#authoring-modal .errorBtn", "addClass", "h");
		} else {
			$$invalidate(0, DND_AUTH.error_message = Lang.required_field, DND_AUTH);
			AH.select("#authoring-modal .errorBtn", "removeClass", "h");
			AH.select("#authoring-modal .addElement", "addClass", "h");
		}
	}

	// function responsible for loading the module whenever the xml changes
	function loadModule(loadXml) {
		// convert xml 
		let newXml = XMLToJSON(loadXml);

		if (!newXml) {
			console.warn({
				Error: "XMl fromat not correct",
				xml: loadXml
			});

			// return if xml format is not correct or there is any issue
			return false;
		}

		auth_store.update(item => {
			item.xml = loadXml;
			return item;
		});

		QXML = newXml;

		if (state.store.xml != "") {
			let node = AH.parseHtml(state.store.xml);

			if (node.getAttribute("alt")) {
				let alt_attr = node.getAttribute("alt").replace("<", "&lt;").replace(">", "&gt;");
				node.setAttribute("alt", alt_attr.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
			}
		}

		AH.select("#special_module_xml").value = loadXml;
		initialize();
		checkImageStatus();
		parseXMLAuthoring(newXml);
		$$invalidate(5, state.data = loadNestedModule(QXML.smxml), state);
		AH.selectAll(".unupdated_node", "remove");
	}

	// function for initializing and changing the dom whenever xml changes
	function initialize() {
		if (AH.select("#special_module_xml").value && AH.select("#special_module_xml").value.trim() != "") {
			DND_AUTH.bind_data(AH.parseHtml(AH.select("#special_module_xml").value));
		}

		let dndmain = AH.select("#dndmain");

		if (dndmain.nodeName && IS_EVENT_CALLED) {
			let events = AH.selectAll("#authoring-modal .ev");

			if (events.length) {
				for (let index = 0; index < events.length; index++) {
					let cur_element = events[index];
					let sub_element = AH.find(cur_element, "input", "all");

					for (let sub_index = 0; sub_index < sub_element.length; sub_index++) {
						let id = cur_element.getAttribute("type") + "-" + sub_element[sub_index].getAttribute("id");

						if (AH.find(cur_element, "[for=\"" + sub_element[sub_index].getAttribute("id") + "\"]")) {
							AH.find(cur_element, "[for=\"" + sub_element[sub_index].getAttribute("id") + "\"]").setAttribute("for", id);
						}

						sub_element[sub_index].setAttribute("id", id);
					}
				}
			}

			// creating contextmenu
			$$invalidate(0, DND_AUTH.isDNDExtended = checkDndExtended(), DND_AUTH);

			DND_AUTH.contextMenuOption();
			enableDragResize();
			IS_EVENT_CALLED = 0;
		}

		if (AH.selectAll("#dndmain .nav textarea").length > 0) {
			let nav_textarea = AH.selectAll("#dndmain .nav textarea");

			for (let index = 0; index < nav_textarea.length; index++) {
				AH.setCss(nav_textarea[index], {
					width: nav_textarea[index].value.length * 8 + "px"
				});
			}
		}

		if (AH.selectAll("[id^=\"ID\"]").length > 0) {
			let hotspot_ids = AH.selectAll("[id^=\"ID\"]");

			for (let index = 0; index < hotspot_ids.length; index++) {
				if (hotspot_ids[index].classList.contains("hotspot_auth")) {
					let hostspot_children = hotspot_ids[index].children;

					for (let sub_index = 0; sub_index < hostspot_children.length; sub_index++) {
						if (hostspot_children[sub_index].classList.contains("hs_item") && AH.find(hostspot_children[sub_index], ".tools", "all").length == 0) {
							AH.insert(hostspot_children[sub_index], "<div class=\"btn-group tools\" data-t=\"hotspot_click\"><a href=\"javascript:DND_AUTH.elemModal('hotspot_click', this, '" + hostspot_children[sub_index].getAttribute("id") + "');\" class=\"btn btn-light px-1 pt-sm1 pb-sm1\"><i class=\"icomoon-24px-edit-1\"></i></a><a href=\"javascript:DND_AUTH.deleteElem('hotspot_click', '" + hostspot_children[sub_index].getAttribute("id") + "');\" class=\"btn btn-light px-1 pt-sm1 pb-sm1\"><i class=\"icomoon-new-24px-delete-1\"></i></a></div>", "beforeend");
						}
					}
				}
			}
		}

		if (document.querySelectorAll("#dndmain, #dndmain .drag-resize, #dndmain .only-dragable").length > 0) {
			if (AH.selectAll("#dndmain img:not([draggable])").length > 0) {
				AH.selectAll("#dndmain img:not([draggable])").forEach(element => {
					element.setAttribute("draggable", false);
				});
			}

			[].forEach.call(document.querySelectorAll("#dndmain, #dndmain .drag-resize, #dndmain .only-dragable"), el => {
				if (el.querySelector(".resizer") == null || el.id == "dndmain" && document.querySelector("#dndmain > .resizer") == null) {
					let resizer = document.createElement("div");
					resizer.className = "resizer icomoon-resize";
					el.appendChild(resizer);
				}
			});
		}

		try {
			if (AH.selectAll("#dndmain .nav .active").length > 0) {
				let steps = AH.selectAll("#dndmain .nav .active");
				let visible_node = [];

				steps.forEach(element => {
					if (element.getBoundingClientRect().top > 0) {
						visible_node.push(element);
					}
				});

				if (visible_node.length > 0) {
					visible_node.forEach(element => {
						AH.select(".parent").setAttribute("data-parent", "[id=\"" + element.getAttribute("for") + "\"]");
						AH.select(".parent").setAttribute("type", "tab");
					});
				}
			} else if (AH.selectAll("#dndmain [type=\"step\"]").length > 0) {
				let steps = AH.selectAll("#dndmain [type=\"step\"]");
				let visible_node = [];

				steps.forEach(element => {
					if (element.getBoundingClientRect().top > 0) {
						visible_node.push(element);
					}
				});

				if (visible_node.length > 0) {
					visible_node.forEach(element => {
						AH.select(".parent").setAttribute("data-parent", "[id=\"" + element.getAttribute("id") + "\"]");
					});
				}
			}
		} catch(error) {
			console.warn(error);
		}
	}

	// funciton for enabling drag and resize
	function enableDragResize() {
		let draggable = new Draggable({
				containment: "#dndmain",
				classes: "#dndmain .drag-resize, #dndmain .only-dragable",
				ignore: [".tools", ".resizer"]
			});

		draggable.changeContainment = function (element) {
			if (element.classList.contains("hs_item")) {
				return "#" + element.getAttribute("id").split("_")[0];
			} else if (element.closest("#dndmain .tab-content")) {
				element.closest("#dndmain .tab-content").id = "tabContent" + element.id;
				return "#tabContent" + element.id;
			} else {
				return "#dndmain";
			}
		};

		draggable.onDragStop = function (event, position, ui) {
			if (AH.find(ui, ".tools")) {
				let type = ui.classList.contains("hs_item")
				? "hotspot_click"
				: AH.select("#" + ui.id + "> .tools").getAttribute("data-t");

				DND_AUTH.updateElem(type, ui, ui.getAttribute("id"), ui);
				updateXML();

				if (AH.selectAll("#dndmain .tab-content").length) {
					AH.selectAll("#dndmain .tab-content").forEach(function (element) {
						element.id = "";
					});
				}
			}
		};

		let resizable = new Resizable("#dndmain", "#dndmain, #dndmain .drag-resize, #dndmain .only-dragable");

		resizable.onStart = function () {
			auth_store.update(item => {
				item.resize = true;
				return item;
			});
		};

		resizable.setLimit = function (x, y) {
			if (x <= minimum_resize) {
				x = minimum_resize;
			}

			if (y <= minimum_resize) {
				y = minimum_resize;
			}

			return { x, y };
		};

		resizable.onStop = function (e, ui) {
			let pr = AH.select(".parent").getAttribute("data-parent");

			if (ui.id == "dndmain") {
				AH.select(".parent").setAttribute("data-parent", "dndmain");
			}

			let type = ui.classList.contains("hs_item")
			? "hotspot_click"
			: AH.findChild(ui, ".tools").getAttribute("data-t");

			DND_AUTH.updateElem(type, ui, ui.getAttribute("id"), ui);
			AH.select(".parent").setAttribute("data-parent", pr);
			updateXML();

			let update_timer = setTimeout(
				function () {
					auth_store.update(item => {
						item.resize = false;
						return item;
					});

					clearTimeout(update_timer);
				},
				100
			);
		};
	}

	// function for parsing the xml 
	function parseXMLAuthoring(MYXML) {
		// taking the data from the xml and setting state accordingly
		$$invalidate(1, bgImg = MYXML.smxml._bgimg);

		module_type = MYXML.smxml._type || 1;
		$$invalidate(2, imgHeight = MYXML.smxml._height);
		$$invalidate(3, imgWidth = MYXML.smxml._width);

		auth_store.update(item => {
			item.bgImage = bgImg;
			item.imgHeight = imgHeight;
			item.imgWidth = imgWidth;
			item.alt = MYXML.smxml._alt;

			if (MYXML.smxml._borderrequired == 1) {
				item.borderclass = borderclassname;
			}

			return item;
		});

		$$invalidate(4, step = MYXML.smxml.step);

		if (Array.isArray(step) == false && step) {
			$$invalidate(4, step = []);
			$$invalidate(4, step[0] = MYXML.smxml.step, step);
		}
	}

	// function returns the nested module data
	function loadNestedModule(xml) {
		let customDrag = [], customDrop = [];

		if (xml) {
			if (xml.div) {
				isOldXml = true;

				xml.div.map(function (data, index) {
					data = objToLower(data);

					if (data._anskey == "" || data._anskey == undefined) {
						customDrag.push(data);
					} else {
						let id = data._id.split("ID");
						let key = data._key.split("key");

						if (id[1] == key[1]) {
							data._anskey = "ID" + id[1];
						}

						customDrop.push(data);
					}
				});
			}
		}

		return [xml, customDrag, customDrop];
	}

	// setting the container height and width on the basis of image height and width
	function checkImageStatus(is_image_load) {
		let container = document.querySelectorAll("#" + container_id + " img");

		if (container.length > 0) {
			container.forEach(function (cur_element) {
				if (cur_element.complete) {
					let originalHeight = (module_type == 1
					? DND_AUTH.getImageData("h", cur_element)
					: cur_element.naturalHeight) + (state.store.borderclass ? 8 : 0);

					let originalWidth = (module_type == 1
					? DND_AUTH.getImageData("w", cur_element)
					: cur_element.naturalWidth) + (state.store.borderclass ? 8 : 0);

					if (Number(originalWidth) != 0 || Number(originalHeight) != 0 || typeof from_myproject != "undefined" && from_myproject == 1) {
						AH.setCss("#" + container_id, {
							height: (imgHeight && Number(imgHeight) >= Number(originalHeight)
							? imgHeight
							: originalHeight) + "px",
							width: (imgWidth && Number(imgWidth) >= Number(originalWidth)
							? imgWidth
							: originalWidth) + "px"
						});
					}
				}
			});
		}

		if (is_image_load == 1) {
			$$invalidate(6, image_loaded = 1);
		}
	}

	// function for changing the error
	function checkError() {
		auth_store.update(item => {
			item.xml = loadXml;
			return item;
		});
	}

	// function for changing the step
	function changeStep(id) {
		let timer = setTimeout(
			function () {
				DND_AUTH.setStepAuth(id);
				clearTimeout(timer);
			},
			100
		);
	}

	// function responsible for updating the xml using getchildxml
	function updateXML(isDeepUpdate) {
		let q_xml = document.querySelector("#special_module_xml").value;

		// convert single and double quote
		q_xml = q_xml.replace(/\’|\′/g, "&apos;").replace(/\″|\“|\”/g, "&quote;");

		if (state.store.xml != AH.select("#special_module_xml").value) {
			// update the xml
			isDeepUpdate
			? getChildXml(q_xml, "deepUpdate")
			: getChildXml(q_xml);
		}

		auth_store.update(item => {
			item.updated = true;
			return item;
		});
	}

	// function for setting the position on the basis of key events
	function setPS(curWidth, curHeight, curTop, curLeft, isDelete) {
		let element = AH.selectAll(".elemActive");

		if (element.length > 0) {
			let elementActive = element[0];
			let key = elementActive.getAttribute("id");
			let xmlDom = AH.parseHtml(AH.select("#special_module_xml").value);
			let insert = AH.find(xmlDom, "[id=\"" + key + "\"]");

			if (typeof isDelete !== "undefined" && isDelete && key != undefined) {
				DND_AUTH.deleteElem(AH.findChild(elementActive, ".tools").getAttribute("data-t"), key);
			} else if (elementActive.offsetHeight != 0 && elementActive.offsetWidth != 0) {
				curWidth = elementActive.offsetWidth + curWidth;
				curHeight = elementActive.offsetHeight + curHeight;
				curTop = elementActive.offsetTop + curTop;
				curLeft = elementActive.offsetLeft + curLeft;

				AH.setCss(elementActive, {
					width: curWidth + "px",
					height: curHeight + "px",
					top: curTop + "px",
					left: curLeft + "px"
				});

				let attributes = DND_AUTH.storage.store("#" + key, "attributes");

				if (Array.isArray(attributes)) {
					for (let index = 0; index < attributes.length; index++) {
						switch (attributes[index].name) {
							case "width":
								attributes[index].value = parseInt(elementActive.offsetWidth);
								insert.setAttribute("width", attributes[index].value);
								break;
							case "height":
								attributes[index].value = parseInt(elementActive.offsetHeight);
								insert.setAttribute("height", attributes[index].value);
								break;
							case "top":
								attributes[index].value = parseInt(elementActive.offsetTop);
								insert.setAttribute("top", attributes[index].value);
								break;
							case "left":
								attributes[index].value = parseInt(elementActive.offsetLeft);
								insert.setAttribute("left", attributes[index].value);
								break;
						}
					}
				}

				DND_AUTH.storage.store("#" + key, "attributes", attributes);

				AH.select("#special_module_xml").value = xmlDom.xml
				? xmlDom.xml
				: new XMLSerializer().serializeToString(xmlDom);

				updateXML();
			}
		}
	}

	// calls in case of keydown event on the document and set the position of elements accoridngly
	function handleKeyDown(event) {
		if (AH.select("#dndmain").offsetHeight != 0 && event.keyCode) {
			if (event.ctrlKey && event.shiftKey) {
				event.preventDefault();

				switch (event.keyCode.toString()) {
					case "37":
						setPS(-1, 0, 0, 0);
						break;
					case "38":
						setPS(0, -1, 0, 0);
						break;
					case "39":
						setPS(1, 0, 0, 0);
						break;
					case "40":
						setPS(0, 1, 0, 0);
						break;
				}
			} else if (event.ctrlKey) {
				switch (event.keyCode.toString()) {
					case "37":
						event.preventDefault();
						setPS(0, 0, 0, -1);
						break;
					case "38":
						event.preventDefault();
						setPS(0, 0, -1, 0);
						break;
					case "39":
						event.preventDefault();
						setPS(0, 0, 0, 1);
						break;
					case "40":
						event.preventDefault();
						setPS(0, 0, 1, 0);
						break;
				} // taken from else part
				// taken from else part
				// taken from else part
				// taken from else part
			} else {
				switch (event.keyCode.toString()) {
					case "27":
						AH.removeClass(".dragable-container .ui-draggable").removeClass("elemActive");
						break;
					case "46":
						setPS(0, 0, 0, 0, true);
						break;
				}
			}
		}
	}

	// for changing the laod state
	function changeLoadState() {
		AH.select("#sample_image").remove();
		$$invalidate(6, image_loaded = 1);
	}

	const writable_props = ["xml", "getChildXml"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<DragNDrop> was created with unknown prop '${key}'`);
	});

	const click_handler = () => DND_AUTH.setStepAuth("baseAuth");
	const click_handler_1 = data => DND_AUTH.setStepAuth(data._id);

	const click_handler_2 = event => {
		DND_AUTH.elemModal("base", event.currentTarget, "dndmain", state.store.bgImage, state.store);
	};

	const load_handler = () => {
		checkImageStatus(1);
	};

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(12, xml = $$props.xml);
		if ("getChildXml" in $$props) $$invalidate(13, getChildXml = $$props.getChildXml);
	};

	$$self.$capture_state = () => ({
		onMount,
		beforeUpdate,
		XMLToJSON,
		AH,
		writable,
		DND_AUTH,
		Drag,
		Drop,
		Radio,
		Select,
		Textbox,
		Multilinebox,
		Checkbox,
		Button,
		Tabhead,
		Img,
		Label,
		Hotspot,
		Menulist,
		Step,
		Tab,
		DndModalBox,
		swal,
		Draggable,
		Resizable,
		l: Lang,
		xml,
		getChildXml,
		QXML,
		bgImg,
		imgHeight,
		imgWidth,
		step,
		isOldXml,
		xmlErrDialog,
		container_id,
		borderclassname,
		IS_EVENT_CALLED,
		minimum_resize,
		module_type,
		state,
		image_loaded,
		auth_store,
		unsubscribe,
		checkDndExtended,
		bindEvents,
		toggleBtn,
		loadModule,
		initialize,
		enableDragResize,
		parseXMLAuthoring,
		objToLower,
		loadNestedModule,
		checkImageStatus,
		checkError,
		changeStep,
		updateXML,
		setPS,
		handleKeyDown,
		changeLoadState
	});

	$$self.$inject_state = $$props => {
		if ("xml" in $$props) $$invalidate(12, xml = $$props.xml);
		if ("getChildXml" in $$props) $$invalidate(13, getChildXml = $$props.getChildXml);
		if ("QXML" in $$props) QXML = $$props.QXML;
		if ("bgImg" in $$props) $$invalidate(1, bgImg = $$props.bgImg);
		if ("imgHeight" in $$props) $$invalidate(2, imgHeight = $$props.imgHeight);
		if ("imgWidth" in $$props) $$invalidate(3, imgWidth = $$props.imgWidth);
		if ("step" in $$props) $$invalidate(4, step = $$props.step);
		if ("isOldXml" in $$props) isOldXml = $$props.isOldXml;
		if ("xmlErrDialog" in $$props) xmlErrDialog = $$props.xmlErrDialog;
		if ("container_id" in $$props) container_id = $$props.container_id;
		if ("borderclassname" in $$props) borderclassname = $$props.borderclassname;
		if ("IS_EVENT_CALLED" in $$props) IS_EVENT_CALLED = $$props.IS_EVENT_CALLED;
		if ("minimum_resize" in $$props) minimum_resize = $$props.minimum_resize;
		if ("module_type" in $$props) module_type = $$props.module_type;
		if ("state" in $$props) $$invalidate(5, state = $$props.state);
		if ("image_loaded" in $$props) $$invalidate(6, image_loaded = $$props.image_loaded);
		if ("auth_store" in $$props) auth_store = $$props.auth_store;
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		DND_AUTH,
		bgImg,
		imgHeight,
		imgWidth,
		step,
		state,
		image_loaded,
		checkImageStatus,
		checkError,
		changeStep,
		handleKeyDown,
		changeLoadState,
		xml,
		getChildXml,
		click_handler,
		click_handler_1,
		click_handler_2,
		load_handler
	];
}

class DragNDrop extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$i, create_fragment$i, safe_not_equal, { xml: 12, getChildXml: 13 }, [-1, -1]);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DragNDrop",
			options,
			id: create_fragment$i.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[12] === undefined && !("xml" in props)) {
			console_1.warn("<DragNDrop> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[13] === undefined && !("getChildXml" in props)) {
			console_1.warn("<DragNDrop> was created without expected prop 'getChildXml'");
		}
	}

	get xml() {
		throw new Error("<DragNDrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<DragNDrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<DragNDrop>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<DragNDrop>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default DragNDrop;
//# sourceMappingURL=DragNDrop-e38a68a8.js.map
