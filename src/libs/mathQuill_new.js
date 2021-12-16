if(window.in_editor){
  /*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
  !function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k="".trim,l={},m="1.11.0",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return n.each(this,a,b)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(n.isPlainObject(c)||(b=n.isArray(c)))?(b?(b=!1,f=a&&n.isArray(a)?a:[]):f=a&&n.isPlainObject(a)?a:{},g[d]=n.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray||function(a){return"array"===n.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return a-parseFloat(a)>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(l.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&n.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=s(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:k&&!k.call("\ufeff\xa0")?function(a){return null==a?"":k.call(a)}:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=s(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),n.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||n.guid++,e):void 0},now:function(){return+new Date},support:l}),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s="sizzle"+-new Date,t=a.document,u=0,v=0,w=eb(),x=eb(),y=eb(),z=function(a,b){return a===b&&(j=!0),0},A="undefined",B=1<<31,C={}.hasOwnProperty,D=[],E=D.pop,F=D.push,G=D.push,H=D.slice,I=D.indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(this[b]===a)return b;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",K="[\\x20\\t\\r\\n\\f]",L="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",M=L.replace("w","w#"),N="\\["+K+"*("+L+")"+K+"*(?:([*^$|!~]?=)"+K+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+M+")|)|)"+K+"*\\]",O=":("+L+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+N.replace(3,8)+")*)|.*)\\)|)",P=new RegExp("^"+K+"+|((?:^|[^\\\\])(?:\\\\.)*)"+K+"+$","g"),Q=new RegExp("^"+K+"*,"+K+"*"),R=new RegExp("^"+K+"*([>+~]|"+K+")"+K+"*"),S=new RegExp("="+K+"*([^\\]'\"]*?)"+K+"*\\]","g"),T=new RegExp(O),U=new RegExp("^"+M+"$"),V={ID:new RegExp("^#("+L+")"),CLASS:new RegExp("^\\.("+L+")"),TAG:new RegExp("^("+L.replace("w","w*")+")"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+K+"*(even|odd|(([+-]|)(\\d*)n|)"+K+"*(?:([+-]|)"+K+"*(\\d+)|))"+K+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+K+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+K+"*((?:-\\d)?\\d*)"+K+"*\\)|)(?=[^-]|$)","i")},W=/^(?:input|select|textarea|button)$/i,X=/^h\d$/i,Y=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,$=/[+~]/,_=/'|\\/g,ab=new RegExp("\\\\([\\da-f]{1,6}"+K+"?|("+K+")|.)","ig"),bb=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)};try{G.apply(D=H.call(t.childNodes),t.childNodes),D[t.childNodes.length].nodeType}catch(cb){G={apply:D.length?function(a,b){F.apply(a,H.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function db(a,b,d,e){var f,g,h,i,j,m,p,q,u,v;if((b?b.ownerDocument||b:t)!==l&&k(b),b=b||l,d=d||[],!a||"string"!=typeof a)return d;if(1!==(i=b.nodeType)&&9!==i)return[];if(n&&!e){if(f=Z.exec(a))if(h=f[1]){if(9===i){if(g=b.getElementById(h),!g||!g.parentNode)return d;if(g.id===h)return d.push(g),d}else if(b.ownerDocument&&(g=b.ownerDocument.getElementById(h))&&r(b,g)&&g.id===h)return d.push(g),d}else{if(f[2])return G.apply(d,b.getElementsByTagName(a)),d;if((h=f[3])&&c.getElementsByClassName&&b.getElementsByClassName)return G.apply(d,b.getElementsByClassName(h)),d}if(c.qsa&&(!o||!o.test(a))){if(q=p=s,u=b,v=9===i&&a,1===i&&"object"!==b.nodeName.toLowerCase()){m=ob(a),(p=b.getAttribute("id"))?q=p.replace(_,"\\$&"):b.setAttribute("id",q),q="[id='"+q+"'] ",j=m.length;while(j--)m[j]=q+pb(m[j]);u=$.test(a)&&mb(b.parentNode)||b,v=m.join(",")}if(v)try{return G.apply(d,u.querySelectorAll(v)),d}catch(w){}finally{p||b.removeAttribute("id")}}}return xb(a.replace(P,"$1"),b,d,e)}function eb(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function fb(a){return a[s]=!0,a}function gb(a){var b=l.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function hb(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function ib(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||B)-(~a.sourceIndex||B);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function jb(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function kb(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function lb(a){return fb(function(b){return b=+b,fb(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function mb(a){return a&&typeof a.getElementsByTagName!==A&&a}c=db.support={},f=db.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},k=db.setDocument=function(a){var b,e=a?a.ownerDocument||a:t,g=e.defaultView;return e!==l&&9===e.nodeType&&e.documentElement?(l=e,m=e.documentElement,n=!f(e),g&&g!==g.top&&(g.addEventListener?g.addEventListener("unload",function(){k()},!1):g.attachEvent&&g.attachEvent("onunload",function(){k()})),c.attributes=gb(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=gb(function(a){return a.appendChild(e.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Y.test(e.getElementsByClassName)&&gb(function(a){return a.innerHTML="<div class='a'></div><div class='a i'></div>",a.firstChild.className="i",2===a.getElementsByClassName("i").length}),c.getById=gb(function(a){return m.appendChild(a).id=s,!e.getElementsByName||!e.getElementsByName(s).length}),c.getById?(d.find.ID=function(a,b){if(typeof b.getElementById!==A&&n){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ab,bb);return function(a){var c=typeof a.getAttributeNode!==A&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return typeof b.getElementsByTagName!==A?b.getElementsByTagName(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return typeof b.getElementsByClassName!==A&&n?b.getElementsByClassName(a):void 0},p=[],o=[],(c.qsa=Y.test(e.querySelectorAll))&&(gb(function(a){a.innerHTML="<select t=''><option selected=''></option></select>",a.querySelectorAll("[t^='']").length&&o.push("[*^$]="+K+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||o.push("\\["+K+"*(?:value|"+J+")"),a.querySelectorAll(":checked").length||o.push(":checked")}),gb(function(a){var b=e.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&o.push("name"+K+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||o.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),o.push(",.*:")})),(c.matchesSelector=Y.test(q=m.webkitMatchesSelector||m.mozMatchesSelector||m.oMatchesSelector||m.msMatchesSelector))&&gb(function(a){c.disconnectedMatch=q.call(a,"div"),q.call(a,"[s!='']:x"),p.push("!=",O)}),o=o.length&&new RegExp(o.join("|")),p=p.length&&new RegExp(p.join("|")),b=Y.test(m.compareDocumentPosition),r=b||Y.test(m.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},z=b?function(a,b){if(a===b)return j=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===e||a.ownerDocument===t&&r(t,a)?-1:b===e||b.ownerDocument===t&&r(t,b)?1:i?I.call(i,a)-I.call(i,b):0:4&d?-1:1)}:function(a,b){if(a===b)return j=!0,0;var c,d=0,f=a.parentNode,g=b.parentNode,h=[a],k=[b];if(!f||!g)return a===e?-1:b===e?1:f?-1:g?1:i?I.call(i,a)-I.call(i,b):0;if(f===g)return ib(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)k.unshift(c);while(h[d]===k[d])d++;return d?ib(h[d],k[d]):h[d]===t?-1:k[d]===t?1:0},e):l},db.matches=function(a,b){return db(a,null,null,b)},db.matchesSelector=function(a,b){if((a.ownerDocument||a)!==l&&k(a),b=b.replace(S,"='$1']"),!(!c.matchesSelector||!n||p&&p.test(b)||o&&o.test(b)))try{var d=q.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return db(b,l,null,[a]).length>0},db.contains=function(a,b){return(a.ownerDocument||a)!==l&&k(a),r(a,b)},db.attr=function(a,b){(a.ownerDocument||a)!==l&&k(a);var e=d.attrHandle[b.toLowerCase()],f=e&&C.call(d.attrHandle,b.toLowerCase())?e(a,b,!n):void 0;return void 0!==f?f:c.attributes||!n?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},db.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},db.uniqueSort=function(a){var b,d=[],e=0,f=0;if(j=!c.detectDuplicates,i=!c.sortStable&&a.slice(0),a.sort(z),j){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return i=null,a},e=db.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=db.selectors={cacheLength:50,createPseudo:fb,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ab,bb),a[3]=(a[4]||a[5]||"").replace(ab,bb),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||db.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&db.error(a[0]),a},PSEUDO:function(a){var b,c=!a[5]&&a[2];return V.CHILD.test(a[0])?null:(a[3]&&void 0!==a[4]?a[2]=a[4]:c&&T.test(c)&&(b=ob(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ab,bb).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=w[a+" "];return b||(b=new RegExp("(^|"+K+")"+a+"("+K+"|$)"))&&w(a,function(a){return b.test("string"==typeof a.className&&a.className||typeof a.getAttribute!==A&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=db.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),t=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&t){k=q[s]||(q[s]={}),j=k[a]||[],n=j[0]===u&&j[1],m=j[0]===u&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[u,n,m];break}}else if(t&&(j=(b[s]||(b[s]={}))[a])&&j[0]===u)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(t&&((l[s]||(l[s]={}))[a]=[u,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||db.error("unsupported pseudo: "+a);return e[s]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?fb(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=I.call(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:fb(function(a){var b=[],c=[],d=g(a.replace(P,"$1"));return d[s]?fb(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),!c.pop()}}),has:fb(function(a){return function(b){return db(a,b).length>0}}),contains:fb(function(a){return function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:fb(function(a){return U.test(a||"")||db.error("unsupported lang: "+a),a=a.replace(ab,bb).toLowerCase(),function(b){var c;do if(c=n?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===m},focus:function(a){return a===l.activeElement&&(!l.hasFocus||l.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return X.test(a.nodeName)},input:function(a){return W.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:lb(function(){return[0]}),last:lb(function(a,b){return[b-1]}),eq:lb(function(a,b,c){return[0>c?c+b:c]}),even:lb(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:lb(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:lb(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:lb(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=jb(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=kb(b);function nb(){}nb.prototype=d.filters=d.pseudos,d.setFilters=new nb;function ob(a,b){var c,e,f,g,h,i,j,k=x[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=Q.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=R.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(P," ")}),h=h.slice(c.length));for(g in d.filter)!(e=V[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?db.error(a):x(a,i).slice(0)}function pb(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function qb(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=v++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[u,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[s]||(b[s]={}),(h=i[d])&&h[0]===u&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function rb(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function sb(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function tb(a,b,c,d,e,f){return d&&!d[s]&&(d=tb(d)),e&&!e[s]&&(e=tb(e,f)),fb(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||wb(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:sb(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=sb(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?I.call(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=sb(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):G.apply(g,r)})}function ub(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],i=g||d.relative[" "],j=g?1:0,k=qb(function(a){return a===b},i,!0),l=qb(function(a){return I.call(b,a)>-1},i,!0),m=[function(a,c,d){return!g&&(d||c!==h)||((b=c).nodeType?k(a,c,d):l(a,c,d))}];f>j;j++)if(c=d.relative[a[j].type])m=[qb(rb(m),c)];else{if(c=d.filter[a[j].type].apply(null,a[j].matches),c[s]){for(e=++j;f>e;e++)if(d.relative[a[e].type])break;return tb(j>1&&rb(m),j>1&&pb(a.slice(0,j-1).concat({value:" "===a[j-2].type?"*":""})).replace(P,"$1"),c,e>j&&ub(a.slice(j,e)),f>e&&ub(a=a.slice(e)),f>e&&pb(a))}m.push(c)}return rb(m)}function vb(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,i,j,k){var m,n,o,p=0,q="0",r=f&&[],s=[],t=h,v=f||e&&d.find.TAG("*",k),w=u+=null==t?1:Math.random()||.1,x=v.length;for(k&&(h=g!==l&&g);q!==x&&null!=(m=v[q]);q++){if(e&&m){n=0;while(o=a[n++])if(o(m,g,i)){j.push(m);break}k&&(u=w)}c&&((m=!o&&m)&&p--,f&&r.push(m))}if(p+=q,c&&q!==p){n=0;while(o=b[n++])o(r,s,g,i);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=E.call(j));s=sb(s)}G.apply(j,s),k&&!f&&s.length>0&&p+b.length>1&&db.uniqueSort(j)}return k&&(u=w,h=t),r};return c?fb(f):f}g=db.compile=function(a,b){var c,d=[],e=[],f=y[a+" "];if(!f){b||(b=ob(a)),c=b.length;while(c--)f=ub(b[c]),f[s]?d.push(f):e.push(f);f=y(a,vb(e,d))}return f};function wb(a,b,c){for(var d=0,e=b.length;e>d;d++)db(a,b[d],c);return c}function xb(a,b,e,f){var h,i,j,k,l,m=ob(a);if(!f&&1===m.length){if(i=m[0]=m[0].slice(0),i.length>2&&"ID"===(j=i[0]).type&&c.getById&&9===b.nodeType&&n&&d.relative[i[1].type]){if(b=(d.find.ID(j.matches[0].replace(ab,bb),b)||[])[0],!b)return e;a=a.slice(i.shift().value.length)}h=V.needsContext.test(a)?0:i.length;while(h--){if(j=i[h],d.relative[k=j.type])break;if((l=d.find[k])&&(f=l(j.matches[0].replace(ab,bb),$.test(i[0].type)&&mb(b.parentNode)||b))){if(i.splice(h,1),a=f.length&&pb(i),!a)return G.apply(e,f),e;break}}}return g(a,m)(f,b,!n,e,$.test(a)&&mb(b.parentNode)||b),e}return c.sortStable=s.split("").sort(z).join("")===s,c.detectDuplicates=!!j,k(),c.sortDetached=gb(function(a){return 1&a.compareDocumentPosition(l.createElement("div"))}),gb(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||hb("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&gb(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||hb("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),gb(function(a){return null==a.getAttribute("disabled")})||hb(J,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),db}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=n.expr.match.needsContext,v=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,w=/^.[^:#\[\.,]*$/;function x(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(w.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return n.inArray(a,b)>=0!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;e>b;b++)if(n.contains(d[b],this))return!0}));for(b=0;e>b;b++)n.find(a,d[b],c);return c=this.pushStack(e>1?n.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(x(this,a||[],!1))},not:function(a){return this.pushStack(x(this,a||[],!0))},is:function(a){return!!x(this,"string"==typeof a&&u.test(a)?n(a):a||[],!1).length}});var y,z=a.document,A=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,B=n.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:A.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||y).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:z,!0)),v.test(c[1])&&n.isPlainObject(b))for(c in b)n.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=z.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return y.find(a);this.length=1,this[0]=d}return this.context=z,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?"undefined"!=typeof y.ready?y.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};B.prototype=n.fn,y=n(z);var C=/^(?:parents|prev(?:Until|All))/,D={children:!0,contents:!0,next:!0,prev:!0};n.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!n(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),n.fn.extend({has:function(a){var b,c=n(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(n.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=u.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.unique(f):f)},index:function(a){return a?"string"==typeof a?n.inArray(this[0],n(a)):n.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.unique(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function E(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return n.dir(a,"parentNode")},parentsUntil:function(a,b,c){return n.dir(a,"parentNode",c)},next:function(a){return E(a,"nextSibling")},prev:function(a){return E(a,"previousSibling")},nextAll:function(a){return n.dir(a,"nextSibling")},prevAll:function(a){return n.dir(a,"previousSibling")},nextUntil:function(a,b,c){return n.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return n.dir(a,"previousSibling",c)},siblings:function(a){return n.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return n.sibling(a.firstChild)},contents:function(a){return n.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(D[a]||(e=n.unique(e)),C.test(a)&&(e=e.reverse())),this.pushStack(e)}});var F=/\S+/g,G={};function H(a){var b=G[a]={};return n.each(a.match(F)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?G[a]||H(a):n.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){n.each(b,function(b,c){var d=n.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&n.each(arguments,function(a,c){var d;while((d=n.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?n.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&n.isFunction(a.promise)?e:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){if(a===!0?!--n.readyWait:!n.isReady){if(!z.body)return setTimeout(n.ready);n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(z,[n]),n.fn.trigger&&n(z).trigger("ready").off("ready"))}}});function J(){z.addEventListener?(z.removeEventListener("DOMContentLoaded",K,!1),a.removeEventListener("load",K,!1)):(z.detachEvent("onreadystatechange",K),a.detachEvent("onload",K))}function K(){(z.addEventListener||"load"===event.type||"complete"===z.readyState)&&(J(),n.ready())}n.ready.promise=function(b){if(!I)if(I=n.Deferred(),"complete"===z.readyState)setTimeout(n.ready);else if(z.addEventListener)z.addEventListener("DOMContentLoaded",K,!1),a.addEventListener("load",K,!1);else{z.attachEvent("onreadystatechange",K),a.attachEvent("onload",K);var c=!1;try{c=null==a.frameElement&&z.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!n.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}J(),n.ready()}}()}return I.promise(b)};var L="undefined",M;for(M in n(l))break;l.ownLast="0"!==M,l.inlineBlockNeedsLayout=!1,n(function(){var a,b,c=z.getElementsByTagName("body")[0];c&&(a=z.createElement("div"),a.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",b=z.createElement("div"),c.appendChild(a).appendChild(b),typeof b.style.zoom!==L&&(b.style.cssText="border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1",(l.inlineBlockNeedsLayout=3===b.offsetWidth)&&(c.style.zoom=1)),c.removeChild(a),a=b=null)}),function(){var a=z.createElement("div");if(null==l.deleteExpando){l.deleteExpando=!0;try{delete a.test}catch(b){l.deleteExpando=!1}}a=null}(),n.acceptData=function(a){var b=n.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var N=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,O=/([A-Z])/g;function P(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(O,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:N.test(c)?n.parseJSON(c):c}catch(e){}n.data(a,b,c)}else c=void 0}return c}function Q(a){var b;for(b in a)if(("data"!==b||!n.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;return!0}function R(a,b,d,e){if(n.acceptData(a)){var f,g,h=n.expando,i=a.nodeType,j=i?n.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||n.guid++:h),j[k]||(j[k]=i?{}:{toJSON:n.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=n.extend(j[k],b):j[k].data=n.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[n.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[n.camelCase(b)])):f=g,f
  }}function S(a,b,c){if(n.acceptData(a)){var d,e,f=a.nodeType,g=f?n.cache:a,h=f?a[n.expando]:n.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){n.isArray(b)?b=b.concat(n.map(b,n.camelCase)):b in d?b=[b]:(b=n.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!Q(d):!n.isEmptyObject(d))return}(c||(delete g[h].data,Q(g[h])))&&(f?n.cleanData([a],!0):l.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}n.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?n.cache[a[n.expando]]:a[n.expando],!!a&&!Q(a)},data:function(a,b,c){return R(a,b,c)},removeData:function(a,b){return S(a,b)},_data:function(a,b,c){return R(a,b,c,!0)},_removeData:function(a,b){return S(a,b,!0)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=n.data(f),1===f.nodeType&&!n._data(f,"parsedAttrs"))){c=g.length;while(c--)d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),P(f,d,e[d]));n._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){n.data(this,a)}):arguments.length>1?this.each(function(){n.data(this,a,b)}):f?P(f,a,n.data(f,a)):void 0},removeData:function(a){return this.each(function(){n.removeData(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=n._data(a,b),c&&(!d||n.isArray(c)?d=n._data(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return n._data(a,c)||n._data(a,c,{empty:n.Callbacks("once memory").add(function(){n._removeData(a,b+"queue"),n._removeData(a,c)})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=n._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var T=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)},W=n.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)n.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},X=/^(?:checkbox|radio)$/i;!function(){var a=z.createDocumentFragment(),b=z.createElement("div"),c=z.createElement("input");if(b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a>",l.leadingWhitespace=3===b.firstChild.nodeType,l.tbody=!b.getElementsByTagName("tbody").length,l.htmlSerialize=!!b.getElementsByTagName("link").length,l.html5Clone="<:nav></:nav>"!==z.createElement("nav").cloneNode(!0).outerHTML,c.type="checkbox",c.checked=!0,a.appendChild(c),l.appendChecked=c.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,a.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,l.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){l.noCloneEvent=!1}),b.cloneNode(!0).click()),null==l.deleteExpando){l.deleteExpando=!0;try{delete b.test}catch(d){l.deleteExpando=!1}}a=b=c=null}(),function(){var b,c,d=z.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(l[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),l[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var Y=/^(?:input|select|textarea)$/i,Z=/^key/,$=/^(?:mouse|contextmenu)|click/,_=/^(?:focusinfocus|focusoutblur)$/,ab=/^([^.]*)(?:\.(.+)|)$/;function bb(){return!0}function cb(){return!1}function db(){try{return z.activeElement}catch(a){}}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=n.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof n===L||a&&n.event.triggered===a.type?void 0:n.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(F)||[""],h=b.length;while(h--)f=ab.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=n.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=n.event.special[o]||{},l=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},i),(m=g[o])||(m=g[o]=[],m.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,l):m.push(l),n.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=n.hasData(a)&&n._data(a);if(r&&(k=r.events)){b=(b||"").match(F)||[""],j=b.length;while(j--)if(h=ab.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=m.length;while(f--)g=m[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(m.splice(f,1),g.selector&&m.delegateCount--,l.remove&&l.remove.call(a,g));i&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(k)&&(delete r.handle,n._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,m,o=[d||z],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||z,3!==d.nodeType&&8!==d.nodeType&&!_.test(p+n.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[n.expando]?b:new n.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:n.makeArray(c,[b]),k=n.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!n.isWindow(d)){for(i=k.delegateType||p,_.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||z)&&o.push(l.defaultView||l.parentWindow||a)}m=0;while((h=o[m++])&&!b.isPropagationStopped())b.type=m>1?i:k.bindType||p,f=(n._data(h,"events")||{})[b.type]&&n._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&n.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&n.acceptData(d)&&g&&d[p]&&!n.isWindow(d)){l=d[g],l&&(d[g]=null),n.event.triggered=p;try{d[p]()}catch(r){}n.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=n.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(n._data(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((n.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?n(c,this).index(i)>=0:n.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[n.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=$.test(e)?this.mouseHooks:Z.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new n.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||z),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||z,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==db()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===db()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return n.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=n.extend(new n.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?n.event.trigger(e,null,b):n.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},n.removeEvent=z.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===L&&(a[d]=null),a.detachEvent(d,c))},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&(a.returnValue===!1||a.getPreventDefault&&a.getPreventDefault())?bb:cb):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={isDefaultPrevented:cb,isPropagationStopped:cb,isImmediatePropagationStopped:cb,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=bb,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=bb,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=bb,this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!n.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),l.submitBubbles||(n.event.special.submit={setup:function(){return n.nodeName(this,"form")?!1:void n.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=n.nodeName(b,"input")||n.nodeName(b,"button")?b.form:void 0;c&&!n._data(c,"submitBubbles")&&(n.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),n._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&n.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return n.nodeName(this,"form")?!1:void n.event.remove(this,"._submit")}}),l.changeBubbles||(n.event.special.change={setup:function(){return Y.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(n.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),n.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),n.event.simulate("change",this,a,!0)})),!1):void n.event.add(this,"beforeactivate._change",function(a){var b=a.target;Y.test(b.nodeName)&&!n._data(b,"changeBubbles")&&(n.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||n.event.simulate("change",this.parentNode,a,!0)}),n._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return n.event.remove(this,"._change"),!Y.test(this.nodeName)}}),l.focusinBubbles||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a),!0)};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=n._data(d,b);e||d.addEventListener(a,c,!0),n._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=n._data(d,b)-1;e?n._data(d,b,e):(d.removeEventListener(a,c,!0),n._removeData(d,b))}}}),n.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=cb;else if(!d)return this;return 1===e&&(g=d,d=function(a){return n().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=n.guid++)),this.each(function(){n.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=cb),this.each(function(){n.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}});function eb(a){var b=fb.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var fb="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gb=/ jQuery\d+="(?:null|\d+)"/g,hb=new RegExp("<(?:"+fb+")[\\s/>]","i"),ib=/^\s+/,jb=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,kb=/<([\w:]+)/,lb=/<tbody/i,mb=/<|&#?\w+;/,nb=/<(?:script|style|link)/i,ob=/checked\s*(?:[^=]|=\s*.checked.)/i,pb=/^$|\/(?:java|ecma)script/i,qb=/^true\/(.*)/,rb=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,sb={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:l.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},tb=eb(z),ub=tb.appendChild(z.createElement("div"));sb.optgroup=sb.option,sb.tbody=sb.tfoot=sb.colgroup=sb.caption=sb.thead,sb.th=sb.td;function vb(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==L?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==L?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||n.nodeName(d,b)?f.push(d):n.merge(f,vb(d,b));return void 0===b||b&&n.nodeName(a,b)?n.merge([a],f):f}function wb(a){X.test(a.type)&&(a.defaultChecked=a.checked)}function xb(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function yb(a){return a.type=(null!==n.find.attr(a,"type"))+"/"+a.type,a}function zb(a){var b=qb.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function Ab(a,b){for(var c,d=0;null!=(c=a[d]);d++)n._data(c,"globalEval",!b||n._data(b[d],"globalEval"))}function Bb(a,b){if(1===b.nodeType&&n.hasData(a)){var c,d,e,f=n._data(a),g=n._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)n.event.add(b,c,h[c][d])}g.data&&(g.data=n.extend({},g.data))}}function Cb(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!l.noCloneEvent&&b[n.expando]){e=n._data(b);for(d in e.events)n.removeEvent(b,d,e.handle);b.removeAttribute(n.expando)}"script"===c&&b.text!==a.text?(yb(b).text=a.text,zb(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),l.html5Clone&&a.innerHTML&&!n.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&X.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}n.extend({clone:function(a,b,c){var d,e,f,g,h,i=n.contains(a.ownerDocument,a);if(l.html5Clone||n.isXMLDoc(a)||!hb.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(ub.innerHTML=a.outerHTML,ub.removeChild(f=ub.firstChild)),!(l.noCloneEvent&&l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(d=vb(f),h=vb(a),g=0;null!=(e=h[g]);++g)d[g]&&Cb(e,d[g]);if(b)if(c)for(h=h||vb(a),d=d||vb(f),g=0;null!=(e=h[g]);g++)Bb(e,d[g]);else Bb(a,f);return d=vb(f,"script"),d.length>0&&Ab(d,!i&&vb(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,k,m=a.length,o=eb(b),p=[],q=0;m>q;q++)if(f=a[q],f||0===f)if("object"===n.type(f))n.merge(p,f.nodeType?[f]:f);else if(mb.test(f)){h=h||o.appendChild(b.createElement("div")),i=(kb.exec(f)||["",""])[1].toLowerCase(),k=sb[i]||sb._default,h.innerHTML=k[1]+f.replace(jb,"<$1></$2>")+k[2],e=k[0];while(e--)h=h.lastChild;if(!l.leadingWhitespace&&ib.test(f)&&p.push(b.createTextNode(ib.exec(f)[0])),!l.tbody){f="table"!==i||lb.test(f)?"<table>"!==k[1]||lb.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)n.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}n.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),l.appendChecked||n.grep(vb(p,"input"),wb),q=0;while(f=p[q++])if((!d||-1===n.inArray(f,d))&&(g=n.contains(f.ownerDocument,f),h=vb(o.appendChild(f),"script"),g&&Ab(h),c)){e=0;while(f=h[e++])pb.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=n.expando,j=n.cache,k=l.deleteExpando,m=n.event.special;null!=(d=a[h]);h++)if((b||n.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)m[e]?n.event.remove(d,e):n.removeEvent(d,e,g.handle);j[f]&&(delete j[f],k?delete d[i]:typeof d.removeAttribute!==L?d.removeAttribute(i):d[i]=null,c.push(f))}}}),n.fn.extend({text:function(a){return W(this,function(a){return void 0===a?n.text(this):this.empty().append((this[0]&&this[0].ownerDocument||z).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=xb(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?n.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||n.cleanData(vb(c)),c.parentNode&&(b&&n.contains(c.ownerDocument,c)&&Ab(vb(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&n.cleanData(vb(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&n.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return W(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(gb,""):void 0;if(!("string"!=typeof a||nb.test(a)||!l.htmlSerialize&&hb.test(a)||!l.leadingWhitespace&&ib.test(a)||sb[(kb.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(jb,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(vb(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,n.cleanData(vb(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,k=this.length,m=this,o=k-1,p=a[0],q=n.isFunction(p);if(q||k>1&&"string"==typeof p&&!l.checkClone&&ob.test(p))return this.each(function(c){var d=m.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(k&&(i=n.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=n.map(vb(i,"script"),yb),f=g.length;k>j;j++)d=i,j!==o&&(d=n.clone(d,!0,!0),f&&n.merge(g,vb(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,n.map(g,zb),j=0;f>j;j++)d=g[j],pb.test(d.type||"")&&!n._data(d,"globalEval")&&n.contains(h,d)&&(d.src?n._evalUrl&&n._evalUrl(d.src):n.globalEval((d.text||d.textContent||d.innerHTML||"").replace(rb,"")));i=c=null}return this}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=0,e=[],g=n(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),n(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Db,Eb={};function Fb(b,c){var d=n(c.createElement(b)).appendTo(c.body),e=a.getDefaultComputedStyle?a.getDefaultComputedStyle(d[0]).display:n.css(d[0],"display");return d.detach(),e}function Gb(a){var b=z,c=Eb[a];return c||(c=Fb(a,b),"none"!==c&&c||(Db=(Db||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Db[0].contentWindow||Db[0].contentDocument).document,b.write(),b.close(),c=Fb(a,b),Db.detach()),Eb[a]=c),c}!function(){var a,b,c=z.createElement("div"),d="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";c.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=c.getElementsByTagName("a")[0],a.style.cssText="float:left;opacity:.5",l.opacity=/^0.5/.test(a.style.opacity),l.cssFloat=!!a.style.cssFloat,c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===c.style.backgroundClip,a=c=null,l.shrinkWrapBlocks=function(){var a,c,e,f;if(null==b){if(a=z.getElementsByTagName("body")[0],!a)return;f="border:0;width:0;height:0;position:absolute;top:0;left:-9999px",c=z.createElement("div"),e=z.createElement("div"),a.appendChild(c).appendChild(e),b=!1,typeof e.style.zoom!==L&&(e.style.cssText=d+";width:1px;padding:1px;zoom:1",e.innerHTML="<div></div>",e.firstChild.style.width="5px",b=3!==e.offsetWidth),a.removeChild(c),a=c=e=null}return b}}();var Hb=/^margin/,Ib=new RegExp("^("+T+")(?!px)[a-z%]+$","i"),Jb,Kb,Lb=/^(top|right|bottom|left)$/;a.getComputedStyle?(Jb=function(a){return a.ownerDocument.defaultView.getComputedStyle(a,null)},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),Ib.test(g)&&Hb.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):z.documentElement.currentStyle&&(Jb=function(a){return a.currentStyle},Kb=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Jb(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Ib.test(g)&&!Lb.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function Mb(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h=z.createElement("div"),i="border:0;width:0;height:0;position:absolute;top:0;left:-9999px",j="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";h.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",b=h.getElementsByTagName("a")[0],b.style.cssText="float:left;opacity:.5",l.opacity=/^0.5/.test(b.style.opacity),l.cssFloat=!!b.style.cssFloat,h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,b=h=null,n.extend(l,{reliableHiddenOffsets:function(){if(null!=c)return c;var a,b,d,e=z.createElement("div"),f=z.getElementsByTagName("body")[0];if(f)return e.setAttribute("className","t"),e.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=z.createElement("div"),a.style.cssText=i,f.appendChild(a).appendChild(e),e.innerHTML="<table><tr><td></td><td>t</td></tr></table>",b=e.getElementsByTagName("td"),b[0].style.cssText="padding:0;margin:0;border:0;display:none",d=0===b[0].offsetHeight,b[0].style.display="",b[1].style.display="none",c=d&&0===b[0].offsetHeight,f.removeChild(a),e=f=null,c},boxSizing:function(){return null==d&&k(),d},boxSizingReliable:function(){return null==e&&k(),e},pixelPosition:function(){return null==f&&k(),f},reliableMarginRight:function(){var b,c,d,e;if(null==g&&a.getComputedStyle){if(b=z.getElementsByTagName("body")[0],!b)return;c=z.createElement("div"),d=z.createElement("div"),c.style.cssText=i,b.appendChild(c).appendChild(d),e=d.appendChild(z.createElement("div")),e.style.cssText=d.style.cssText=j,e.style.marginRight=e.style.width="0",d.style.width="1px",g=!parseFloat((a.getComputedStyle(e,null)||{}).marginRight),b.removeChild(c)}return g}});function k(){var b,c,h=z.getElementsByTagName("body")[0];h&&(b=z.createElement("div"),c=z.createElement("div"),b.style.cssText=i,h.appendChild(b).appendChild(c),c.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%",n.swap(h,null!=h.style.zoom?{zoom:1}:{},function(){d=4===c.offsetWidth}),e=!0,f=!1,g=!0,a.getComputedStyle&&(f="1%"!==(a.getComputedStyle(c,null)||{}).top,e="4px"===(a.getComputedStyle(c,null)||{width:"4px"}).width),h.removeChild(b),c=h=null)}}(),n.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Nb=/alpha\([^)]*\)/i,Ob=/opacity\s*=\s*([^)]*)/,Pb=/^(none|table(?!-c[ea]).+)/,Qb=new RegExp("^("+T+")(.*)$","i"),Rb=new RegExp("^([+-])=("+T+")","i"),Sb={position:"absolute",visibility:"hidden",display:"block"},Tb={letterSpacing:0,fontWeight:400},Ub=["Webkit","O","Moz","ms"];function Vb(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Ub.length;while(e--)if(b=Ub[e]+c,b in a)return b;return d}function Wb(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=n._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=n._data(d,"olddisplay",Gb(d.nodeName)))):f[g]||(e=V(d),(c&&"none"!==c||!e)&&n._data(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Xb(a,b,c){var d=Qb.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Yb(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Zb(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Jb(a),g=l.boxSizing()&&"border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Kb(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ib.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Yb(a,b,c||(g?"border":"content"),d,f)+"px"}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Kb(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":l.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;if(b=n.cssProps[h]||(n.cssProps[h]=Vb(i,h)),g=n.cssHooks[b]||n.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Rb.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(n.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||n.cssNumber[h]||(c+="px"),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]="",i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Vb(a.style,h)),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Kb(a,b,d)),"normal"===f&&b in Tb&&(f=Tb[b]),""===c||c?(e=parseFloat(f),c===!0||n.isNumeric(e)?e||0:f):f}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?0===a.offsetWidth&&Pb.test(n.css(a,"display"))?n.swap(a,Sb,function(){return Zb(a,b,d)}):Zb(a,b,d):void 0},set:function(a,c,d){var e=d&&Jb(a);return Xb(a,c,d?Yb(a,b,d,l.boxSizing()&&"border-box"===n.css(a,"boxSizing",!1,e),e):0)}}}),l.opacity||(n.cssHooks.opacity={get:function(a,b){return Ob.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=n.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===n.trim(f.replace(Nb,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Nb.test(f)?f.replace(Nb,e):f+" "+e)}}),n.cssHooks.marginRight=Mb(l.reliableMarginRight,function(a,b){return b?n.swap(a,{display:"inline-block"},Kb,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Hb.test(a)||(n.cssHooks[a+b].set=Xb)}),n.fn.extend({css:function(a,b){return W(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Jb(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)
  },a,b,arguments.length>1)},show:function(){return Wb(this,!0)},hide:function(){return Wb(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function $b(a,b,c,d,e){return new $b.prototype.init(a,b,c,d,e)}n.Tween=$b,$b.prototype={constructor:$b,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=$b.propHooks[this.prop];return a&&a.get?a.get(this):$b.propHooks._default.get(this)},run:function(a){var b,c=$b.propHooks[this.prop];return this.pos=b=this.options.duration?n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):$b.propHooks._default.set(this),this}},$b.prototype.init.prototype=$b.prototype,$b.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[n.cssProps[a.prop]]||n.cssHooks[a.prop])?n.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},$b.propHooks.scrollTop=$b.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},n.fx=$b.prototype.init,n.fx.step={};var _b,ac,bc=/^(?:toggle|show|hide)$/,cc=new RegExp("^(?:([+-])=|)("+T+")([a-z%]*)$","i"),dc=/queueHooks$/,ec=[jc],fc={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=cc.exec(b),f=e&&e[3]||(n.cssNumber[a]?"":"px"),g=(n.cssNumber[a]||"px"!==f&&+d)&&cc.exec(n.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,n.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function gc(){return setTimeout(function(){_b=void 0}),_b=n.now()}function hc(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=U[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function ic(a,b,c){for(var d,e=(fc[b]||[]).concat(fc["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function jc(a,b,c){var d,e,f,g,h,i,j,k,m=this,o={},p=a.style,q=a.nodeType&&V(a),r=n._data(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,m.always(function(){m.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=n.css(a,"display"),k=Gb(a.nodeName),"none"===j&&(j=k),"inline"===j&&"none"===n.css(a,"float")&&(l.inlineBlockNeedsLayout&&"inline"!==k?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",l.shrinkWrapBlocks()||m.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],bc.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||n.style(a,d)}if(!n.isEmptyObject(o)){r?"hidden"in r&&(q=r.hidden):r=n._data(a,"fxshow",{}),f&&(r.hidden=!q),q?n(a).show():m.done(function(){n(a).hide()}),m.done(function(){var b;n._removeData(a,"fxshow");for(b in o)n.style(a,b,o[b])});for(d in o)g=ic(q?r[d]:0,d,m),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function kc(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function lc(a,b,c){var d,e,f=0,g=ec.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=_b||gc(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:_b||gc(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(kc(k,j.opts.specialEasing);g>f;f++)if(d=ec[f].call(j,a,k,j.opts))return d;return n.map(k,ic,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(lc,{tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],fc[c]=fc[c]||[],fc[c].unshift(b)},prefilter:function(a,b){b?ec.unshift(a):ec.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=lc(this,n.extend({},a),f);(e||n._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=n._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&dc.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=n._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(hc(b,!0),a,d,e)}}),n.each({slideDown:hc("show"),slideUp:hc("hide"),slideToggle:hc("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=n.timers,c=0;for(_b=n.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||n.fx.stop(),_b=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){ac||(ac=setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){clearInterval(ac),ac=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(a,b){return a=n.fx?n.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e=z.createElement("div");e.setAttribute("className","t"),e.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",a=e.getElementsByTagName("a")[0],c=z.createElement("select"),d=c.appendChild(z.createElement("option")),b=e.getElementsByTagName("input")[0],a.style.cssText="top:1px",l.getSetAttribute="t"!==e.className,l.style=/top/.test(a.getAttribute("style")),l.hrefNormalized="/a"===a.getAttribute("href"),l.checkOn=!!b.value,l.optSelected=d.selected,l.enctype=!!z.createElement("form").enctype,c.disabled=!0,l.optDisabled=!d.disabled,b=z.createElement("input"),b.setAttribute("value",""),l.input=""===b.getAttribute("value"),b.value="t",b.setAttribute("type","radio"),l.radioValue="t"===b.value,a=b=c=d=e=null}();var mc=/\r/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(mc,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.text(a)}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(l.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)if(d=e[g],n.inArray(n.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>=0:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var nc,oc,pc=n.expr.attrHandle,qc=/^(?:checked|selected)$/i,rc=l.getSetAttribute,sc=l.input;n.fn.extend({attr:function(a,b){return W(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===L?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),d=n.attrHooks[b]||(n.expr.match.bool.test(b)?oc:nc)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=n.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void n.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(F);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)?sc&&rc||!qc.test(c)?a[d]=!1:a[n.camelCase("default-"+c)]=a[d]=!1:n.attr(a,c,""),a.removeAttribute(rc?c:d)},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),oc={set:function(a,b,c){return b===!1?n.removeAttr(a,c):sc&&rc||!qc.test(c)?a.setAttribute(!rc&&n.propFix[c]||c,c):a[n.camelCase("default-"+c)]=a[c]=!0,c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=pc[b]||n.find.attr;pc[b]=sc&&rc||!qc.test(b)?function(a,b,d){var e,f;return d||(f=pc[b],pc[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,pc[b]=f),e}:function(a,b,c){return c?void 0:a[n.camelCase("default-"+b)]?b.toLowerCase():null}}),sc&&rc||(n.attrHooks.value={set:function(a,b,c){return n.nodeName(a,"input")?void(a.defaultValue=b):nc&&nc.set(a,b,c)}}),rc||(nc={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},pc.id=pc.name=pc.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},n.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:nc.set},n.attrHooks.contenteditable={set:function(a,b,c){nc.set(a,""===b?!1:b,c)}},n.each(["width","height"],function(a,b){n.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),l.style||(n.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var tc=/^(?:input|select|textarea|button|object)$/i,uc=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return W(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return a=n.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),n.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!n.isXMLDoc(a),f&&(b=n.propFix[b]||b,e=n.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):tc.test(a.nodeName)||uc.test(a.nodeName)&&a.href?0:-1}}}}),l.hrefNormalized||n.each(["href","src"],function(a,b){n.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this}),l.enctype||(n.propFix.enctype="encoding");var vc=/[\t\r\n\f]/g;n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(vc," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=n.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(F)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(vc," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?n.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(n.isFunction(a)?function(c){n(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=n(this),f=a.match(F)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===L||"boolean"===c)&&(this.className&&n._data(this,"__className__",this.className),this.className=this.className||a===!1?"":n._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(vc," ").indexOf(b)>=0)return!0;return!1}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var wc=n.now(),xc=/\?/,yc=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;n.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=n.trim(b+"");return e&&!n.trim(e.replace(yc,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():n.error("Invalid JSON: "+b)},n.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var zc,Ac,Bc=/#.*$/,Cc=/([?&])_=[^&]*/,Dc=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Ec=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Fc=/^(?:GET|HEAD)$/,Gc=/^\/\//,Hc=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Ic={},Jc={},Kc="*/".concat("*");try{Ac=location.href}catch(Lc){Ac=z.createElement("a"),Ac.href="",Ac=Ac.href}zc=Hc.exec(Ac.toLowerCase())||[];function Mc(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(F)||[];if(n.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Nc(a,b,c,d){var e={},f=a===Jc;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Oc(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&n.extend(!0,a,c),a}function Pc(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Qc(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ac,type:"GET",isLocal:Ec.test(zc[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Kc,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Oc(Oc(a,n.ajaxSettings),b):Oc(n.ajaxSettings,a)},ajaxPrefilter:Mc(Ic),ajaxTransport:Mc(Jc),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=n.ajaxSetup({},b),l=k.context||k,m=k.context&&(l.nodeType||l.jquery)?n(l):n.event,o=n.Deferred(),p=n.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Dc.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||Ac)+"").replace(Bc,"").replace(Gc,zc[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=n.trim(k.dataType||"*").toLowerCase().match(F)||[""],null==k.crossDomain&&(c=Hc.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===zc[1]&&c[2]===zc[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(zc[3]||("http:"===zc[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=n.param(k.data,k.traditional)),Nc(Ic,k,b,v),2===t)return v;h=k.global,h&&0===n.active++&&n.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Fc.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(xc.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Cc.test(e)?e.replace(Cc,"$1_="+wc++):e+(xc.test(e)?"&":"?")+"_="+wc++)),k.ifModified&&(n.lastModified[e]&&v.setRequestHeader("If-Modified-Since",n.lastModified[e]),n.etag[e]&&v.setRequestHeader("If-None-Match",n.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Kc+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Nc(Jc,k,b,v)){v.readyState=1,h&&m.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Pc(k,v,c)),u=Qc(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(n.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(n.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&m.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(m.trigger("ajaxComplete",[v,k]),--n.active||n.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){if(n.isFunction(a))return this.each(function(b){n(this).wrapAll(a.call(this,b))});if(this[0]){var b=n(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(n.isFunction(a)?function(b){n(this).wrapInner(a.call(this,b))}:function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!l.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||n.css(a,"display"))},n.expr.filters.visible=function(a){return!n.expr.filters.hidden(a)};var Rc=/%20/g,Sc=/\[\]$/,Tc=/\r?\n/g,Uc=/^(?:submit|button|image|reset|file)$/i,Vc=/^(?:input|select|textarea|keygen)/i;function Wc(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Sc.test(a)?d(a,e):Wc(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Wc(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Wc(c,a[c],b,e);return d.join("&").replace(Rc,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Vc.test(this.nodeName)&&!Uc.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Tc,"\r\n")}}):{name:b.name,value:c.replace(Tc,"\r\n")}}).get()}}),n.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&$c()||_c()}:$c;var Xc=0,Yc={},Zc=n.ajaxSettings.xhr();a.ActiveXObject&&n(a).on("unload",function(){for(var a in Yc)Yc[a](void 0,!0)}),l.cors=!!Zc&&"withCredentials"in Zc,Zc=l.ajax=!!Zc,Zc&&n.ajaxTransport(function(a){if(!a.crossDomain||l.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Xc;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Yc[g],b=void 0,f.onreadystatechange=n.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Yc[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function $c(){try{return new a.XMLHttpRequest}catch(b){}}function _c(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=z.head||n("head")[0]||z.documentElement;return{send:function(d,e){b=z.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var ad=[],bd=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=ad.pop()||n.expando+"_"+wc++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(bd.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&bd.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(bd,"$1"+e):b.jsonp!==!1&&(b.url+=(xc.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,ad.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||z;var d=v.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=n.buildFragment([a],b,e),e&&e.length&&n(e).remove(),n.merge([],d.childNodes))};var cd=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&cd)return cd.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=a.slice(h,a.length),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&n.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};var dd=a.document.documentElement;function ed(a){return n.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&n.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,n.contains(b,e)?(typeof e.getBoundingClientRect!==L&&(d=e.getBoundingClientRect()),c=ed(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===n.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(c=a.offset()),c.top+=n.css(a[0],"borderTopWidth",!0),c.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-n.css(d,"marginTop",!0),left:b.left-c.left-n.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||dd;while(a&&!n.nodeName(a,"html")&&"static"===n.css(a,"position"))a=a.offsetParent;return a||dd})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);n.fn[a]=function(d){return W(this,function(a,d,e){var f=ed(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?n(f).scrollLeft():e,c?e:n(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Mb(l.pixelPosition,function(a,c){return c?(c=Kb(a,b),Ib.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return W(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.size=function(){return this.length},n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var fd=a.jQuery,gd=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=gd),b&&a.jQuery===n&&(a.jQuery=fd),n},typeof b===L&&(a.jQuery=a.$=n),n});
}
/**
 * MathQuill v0.10.1               http://mathquill.com
 * by Han, Jeanine, and Mary  maintainers@mathquill.com
 *
 * This Source Code Form is subject to the terms of the
 * Mozilla Public License, v. 2.0. If a copy of the MPL
 * was not distributed with this file, You can obtain
 * one at http://mozilla.org/MPL/2.0/.
 */

(function() {

  var jQuery = window.jQuery,
    undefined,
    mqCmdId = 'mathquill-command-id',
    mqBlockId = 'mathquill-block-id',
    min = Math.min,
    max = Math.max;
  function noop() {}
  
  /**
   * A utility higher-order function that makes defining variadic
   * functions more convenient by letting you essentially define functions
   * with the last argument as a splat, i.e. the last argument "gathers up"
   * remaining arguments to the function:
   *   var doStuff = variadic(function(first, rest) { return rest; });
   *   doStuff(1, 2, 3); // => [2, 3]
   */
  var __slice = [].slice;
  function variadic(fn) {
    var numFixedArgs = fn.length - 1;
    return function() {
      var args = __slice.call(arguments, 0, numFixedArgs);
      var varArg = __slice.call(arguments, numFixedArgs);
      return fn.apply(this, args.concat([ varArg ]));
    };
  }
  
  /**
   * A utility higher-order function that makes combining object-oriented
   * programming and functional programming techniques more convenient:
   * given a method name and any number of arguments to be bound, returns
   * a function that calls it's first argument's method of that name (if
   * it exists) with the bound arguments and any additional arguments that
   * are passed:
   *   var sendMethod = send('method', 1, 2);
   *   var obj = { method: function() { return Array.apply(this, arguments); } };
   *   sendMethod(obj, 3, 4); // => [1, 2, 3, 4]
   *   // or more specifically,
   *   var obj2 = { method: function(one, two, three) { return one*two + three; } };
   *   sendMethod(obj2, 3); // => 5
   *   sendMethod(obj2, 4); // => 6
   */
  var send = variadic(function(method, args) {
    return variadic(function(obj, moreArgs) {
      if (method in obj) return obj[method].apply(obj, args.concat(moreArgs));
    });
  });
  
  /**
   * A utility higher-order function that creates "implicit iterators"
   * from "generators": given a function that takes in a sole argument,
   * a "yield_" function, that calls "yield_" repeatedly with an object as
   * a sole argument (presumably objects being iterated over), returns
   * a function that calls it's first argument on each of those objects
   * (if the first argument is a function, it is called repeatedly with
   * each object as the first argument, otherwise it is stringified and
   * the method of that name is called on each object (if such a method
   * exists)), passing along all additional arguments:
   *   var a = [
   *     { method: function(list) { list.push(1); } },
   *     { method: function(list) { list.push(2); } },
   *     { method: function(list) { list.push(3); } }
   *   ];
   *   a.each = iterator(function(yield_) {
   *     for (var i in this) yield_(this[i]);
   *   });
   *   var list = [];
   *   a.each('method', list);
   *   list; // => [1, 2, 3]
   *   // Note that the for-in loop will yield 'each', but 'each' maps to
   *   // the function object created by iterator() which does not have a
   *   // .method() method, so that just fails silently.
   */
  function iterator(generator) {
    return variadic(function(fn, args) {
      if (typeof fn !== 'function') fn = send(fn);
      var yield_ = function(obj) { return fn.apply(obj, [ obj ].concat(args)); };
      return generator.call(this, yield_);
    });
  }
  
  /**
   * sugar to make defining lots of commands easier.
   * TODO: rethink this.
   */
  function bind(cons /*, args... */) {
    var args = __slice.call(arguments, 1);
    return function() {
      return cons.apply(this, args);
    };
  }
  
  /**
   * a development-only debug method.  This definition and all
   * calls to `pray` will be stripped from the minified
   * build of mathquill.
   *
   * This function must be called by name to be removed
   * at compile time.  Do not define another function
   * with the same name, and only call this function by
   * name.
   */
  function pray(message, cond) {
    if (!cond) throw new Error('prayer failed: '+message);
  }
  var P = (function(prototype, ownProperty, undefined) {
    // helper functions that also help minification
    function isObject(o) { return typeof o === 'object'; }
    function isFunction(f) { return typeof f === 'function'; }
  
    // used to extend the prototypes of superclasses (which might not
    // have `.Bare`s)
    function SuperclassBare() {}
  
    return function P(_superclass /* = Object */, definition) {
      // handle the case where no superclass is given
      if (definition === undefined) {
        definition = _superclass;
        _superclass = Object;
      }
  
      // C is the class to be returned.
      //
      // It delegates to instantiating an instance of `Bare`, so that it
      // will always return a new instance regardless of the calling
      // context.
      //
      //  TODO: the Chrome inspector shows all created objects as `C`
      //        rather than `Object`.  Setting the .name property seems to
      //        have no effect.  Is there a way to override this behavior?
      function C() {
        var self = new Bare;
        if (isFunction(self.init)) self.init.apply(self, arguments);
        return self;
      }
  
      // C.Bare is a class with a noop constructor.  Its prototype is the
      // same as C, so that instances of C.Bare are also instances of C.
      // New objects can be allocated without initialization by calling
      // `new MyClass.Bare`.
      function Bare() {}
      C.Bare = Bare;
  
      // Set up the prototype of the new class.
      var _super = SuperclassBare[prototype] = _superclass != undefined ? _superclass[prototype]  : Object;
      var proto = Bare[prototype] = C[prototype] = C.p = new SuperclassBare;
  
      // other variables, as a minifier optimization
      var extensions;
  
  
      // set the constructor property on the prototype, for convenience
      proto.constructor = C;
  
      C.mixin = function(def) {
        Bare[prototype] = C[prototype] = P(C, def)[prototype];
        return C;
      }
  
      return (C.open = function(def) {
        extensions = {};
  
        if (isFunction(def)) {
          // call the defining function with all the arguments you need
          // extensions captures the return value.
          extensions = def.call(C, proto, _super, C, _superclass);
        }
        else if (isObject(def)) {
          // if you passed an object instead, we'll take it
          extensions = def;
        }
  
        // ...and extend it
        if (isObject(extensions)) {
          for (var ext in extensions) {
            if (ownProperty.call(extensions, ext)) {
              proto[ext] = extensions[ext];
            }
          }
        }
  
        // if there's no init, we assume we're inheriting a non-pjs class, so
        // we default to applying the superclass's constructor.
        if (!isFunction(proto.init)) {
          proto.init = _superclass;
        }
  
        return C;
      })(definition);
    }
  
    // as a minifier optimization, we've closured in a few helper functions
    // and the string 'prototype' (C[p] is much shorter than C.prototype)
  })('prototype', ({}).hasOwnProperty);
  /*************************************************
   * Base classes of edit tree-related objects
   *
   * Only doing tree node manipulation via these
   * adopt/ disown methods guarantees well-formedness
   * of the tree.
   ************************************************/
  
  // L = 'left'
  // R = 'right'
  //
  // the contract is that they can be used as object properties
  // and (-L) === R, and (-R) === L.
  var L = -1;
  var R = 1;
  
  function prayDirection(dir) {
    pray('a direction was passed', dir === L || dir === R);
  }
  
  /**
   * Tiny extension of jQuery adding directionalized DOM manipulation methods.
   *
   * Funny how Pjs v3 almost just works with `jQuery.fn.init`.
   *
   * jQuery features that don't work on $:
   *   - jQuery.*, like jQuery.ajax, obviously (Pjs doesn't and shouldn't
   *                                            copy constructor properties)
   *
   *   - jQuery(function), the shortcut for `jQuery(document).ready(function)`,
   *     because `jQuery.fn.init` is idiosyncratic and Pjs doing, essentially,
   *     `jQuery.fn.init.apply(this, arguments)` isn't quite right, you need:
   *
   *       _.init = function(s, c) { jQuery.fn.init.call(this, s, c, $(document)); };
   *
   *     if you actually give a shit (really, don't bother),
   *     see https://github.com/jquery/jquery/blob/1.7.2/src/core.js#L889
   *
   *   - jQuery(selector), because jQuery translates that to
   *     `jQuery(document).find(selector)`, but Pjs doesn't (should it?) let
   *     you override the result of a constructor call
   *       + note that because of the jQuery(document) shortcut-ness, there's also
   *         the 3rd-argument-needs-to-be-`$(document)` thing above, but the fix
   *         for that (as can be seen above) is really easy. This problem requires
   *         a way more intrusive fix
   *
   * And that's it! Everything else just magically works because jQuery internally
   * uses `this.constructor()` everywhere (hence calling `$`), but never ever does
   * `this.constructor.find` or anything like that, always doing `jQuery.find`.
   */
  var $ = P(jQuery, function(_) {
    _.insDirOf = function(dir, el) {
      return dir === L ?
        this.insertBefore(el.first()) : this.insertAfter(el.last());
    };
    _.insAtDirEnd = function(dir, el) {
      return dir === L ? this.prependTo(el) : this.appendTo(el);
    };
  });
  
  var Point = P(function(_) {
    _.parent = 0;
    _[L] = 0;
    _[R] = 0;
  
    _.init = function(parent, leftward, rightward) {
      this.parent = parent;
      this[L] = leftward;
      this[R] = rightward;
    };
  
    this.copy = function(pt) {
      return Point(pt.parent, pt[L], pt[R]);
    };
  });
  
  /**
   * MathQuill virtual-DOM tree-node abstract base class
   */
  var Node = P(function(_) {
    _[L] = 0;
    _[R] = 0
    _.parent = 0;
  
    var id = 0;
    function uniqueNodeId() { return id += 1; }
    this.byId = {};
  
    _.init = function() {
      this.id = uniqueNodeId();
      Node.byId[this.id] = this;
      this.ends = {};
      this.ends[L] = 0;
      this.ends[R] = 0;
    };
  
    _.dispose = function() { delete Node.byId[this.id]; };
  
    _.toString = function() { return '{{ MathQuill Node #'+this.id+' }}'; };
  
    _.jQ = $();
    _.jQadd = function(jQ) { return this.jQ = this.jQ.add(jQ); };
    _.jQize = function(jQ) {
      // jQuery-ifies this.html() and links up the .jQ of all corresponding Nodes
      var jQ = $(jQ || this.html());
  
      function jQadd(el) {
        if (el.getAttribute) {
          var cmdId = el.getAttribute('mathquill-command-id');
          var blockId = el.getAttribute('mathquill-block-id');
          if (cmdId) Node.byId[cmdId].jQadd(el);
          if (blockId) Node.byId[blockId].jQadd(el);
        }
        for (el = el.firstChild; el; el = el.nextSibling) {
          jQadd(el);
        }
      }
  
      for (var i = 0; i < jQ.length; i += 1) jQadd(jQ[i]);
      return jQ;
    };
  
    _.createDir = function(dir, cursor) {
      prayDirection(dir);
      var node = this;
      node.jQize();
      node.jQ.insDirOf(dir, cursor.jQ);
      cursor[dir] = node.adopt(cursor.parent, cursor[L], cursor[R]);
      return node;
    };
    _.createLeftOf = function(el) { return this.createDir(L, el); };
  
    _.selectChildren = function(leftEnd, rightEnd) {
      return Selection(leftEnd, rightEnd);
    };
  
    _.bubble = iterator(function(yield_) {
      for (var ancestor = this; ancestor; ancestor = ancestor.parent) {
        var result = yield_(ancestor);
        if (result === false) break;
      }
  
      return this;
    });
  
    _.postOrder = iterator(function(yield_) {
      (function recurse(descendant) {
        descendant.eachChild(recurse);
        yield_(descendant);
      })(this);
  
      return this;
    });
  
    _.isEmpty = function() {
      return this.ends[L] === 0 && this.ends[R] === 0;
    };
  
    _.children = function() {
      return Fragment(this.ends[L], this.ends[R]);
    };
  
    _.eachChild = function() {
      var children = this.children();
      children.each.apply(children, arguments);
      return this;
    };
  
    _.foldChildren = function(fold, fn) {
      return this.children().fold(fold, fn);
    };
  
    _.withDirAdopt = function(dir, parent, withDir, oppDir) {
      Fragment(this, this).withDirAdopt(dir, parent, withDir, oppDir);
      return this;
    };
  
    _.adopt = function(parent, leftward, rightward) {
      Fragment(this, this).adopt(parent, leftward, rightward);
      return this;
    };
  
    _.disown = function() {
      Fragment(this, this).disown();
      return this;
    };
  
    _.remove = function() {
      this.jQ.remove();
      this.postOrder('dispose');
      return this.disown();
    };
  });
  
  function prayWellFormed(parent, leftward, rightward) {
    pray('a parent is always present', parent);
    pray('leftward is properly set up', (function() {
      // either it's empty and `rightward` is the left end child (possibly empty)
      if (!leftward) return parent.ends[L] === rightward;
  
      // or it's there and its [R] and .parent are properly set up
      return leftward[R] === rightward && leftward.parent === parent;
    })());
  
    pray('rightward is properly set up', (function() {
      // either it's empty and `leftward` is the right end child (possibly empty)
      if (!rightward) return parent.ends[R] === leftward;
  
      // or it's there and its [L] and .parent are properly set up
      return rightward[L] === leftward && rightward.parent === parent;
    })());
  }
  
  
  /**
   * An entity outside the virtual tree with one-way pointers (so it's only a
   * "view" of part of the tree, not an actual node/entity in the tree) that
   * delimits a doubly-linked list of sibling nodes.
   * It's like a fanfic love-child between HTML DOM DocumentFragment and the Range
   * classes: like DocumentFragment, its contents must be sibling nodes
   * (unlike Range, whose contents are arbitrary contiguous pieces of subtrees),
   * but like Range, it has only one-way pointers to its contents, its contents
   * have no reference to it and in fact may still be in the visible tree (unlike
   * DocumentFragment, whose contents must be detached from the visible tree
   * and have their 'parent' pointers set to the DocumentFragment).
   */
  var Fragment = P(function(_) {
    _.init = function(withDir, oppDir, dir) {
      if (dir === undefined) dir = L;
      prayDirection(dir);
  
      pray('no half-empty fragments', !withDir === !oppDir);
  
      this.ends = {};
  
      if (!withDir) return;
  
      pray('withDir is passed to Fragment', withDir instanceof Node);
      pray('oppDir is passed to Fragment', oppDir instanceof Node);
      pray('withDir and oppDir have the same parent',
           withDir.parent === oppDir.parent);
  
      this.ends[dir] = withDir;
      this.ends[-dir] = oppDir;
  
      // To build the jquery collection for a fragment, accumulate elements
      // into an array and then call jQ.add once on the result. jQ.add sorts the
      // collection according to document order each time it is called, so
      // building a collection by folding jQ.add directly takes more than
      // quadratic time in the number of elements.
      //
      // https://github.com/jquery/jquery/blob/2.1.4/src/traversing.js#L112
      var accum = this.fold([], function (accum, el) {
        accum.push.apply(accum, el.jQ.get());
        return accum;
      });
  
      this.jQ = this.jQ.add(accum);
    };
    _.jQ = $();
  
    // like Cursor::withDirInsertAt(dir, parent, withDir, oppDir)
    _.withDirAdopt = function(dir, parent, withDir, oppDir) {
      return (dir === L ? this.adopt(parent, withDir, oppDir)
                        : this.adopt(parent, oppDir, withDir));
    };
    _.adopt = function(parent, leftward, rightward) {
      prayWellFormed(parent, leftward, rightward);
  
      var self = this;
      self.disowned = false;
  
      var leftEnd = self.ends[L];
      if (!leftEnd) return this;
  
      var rightEnd = self.ends[R];
  
      if (leftward) {
        // NB: this is handled in the ::each() block
        // leftward[R] = leftEnd
      } else {
        parent.ends[L] = leftEnd;
      }
  
      if (rightward) {
        rightward[L] = rightEnd;
      } else {
        parent.ends[R] = rightEnd;
      }
  
      self.ends[R][R] = rightward;
  
      self.each(function(el) {
        el[L] = leftward;
        el.parent = parent;
        if (leftward) leftward[R] = el;
  
        leftward = el;
      });
  
      return self;
    };
  
    _.disown = function() {
      var self = this;
      var leftEnd = self.ends[L];
  
      // guard for empty and already-disowned fragments
      if (!leftEnd || self.disowned) return self;
  
      self.disowned = true;
  
      var rightEnd = self.ends[R]
      var parent = leftEnd.parent;
  
      prayWellFormed(parent, leftEnd[L], leftEnd);
      prayWellFormed(parent, rightEnd, rightEnd[R]);
  
      if (leftEnd[L]) {
        leftEnd[L][R] = rightEnd[R];
      } else {
        parent.ends[L] = rightEnd[R];
      }
  
      if (rightEnd[R]) {
        rightEnd[R][L] = leftEnd[L];
      } else {
        parent.ends[R] = leftEnd[L];
      }
  
      return self;
    };
  
    _.remove = function() {
      this.jQ.remove();
      this.each('postOrder', 'dispose');
      return this.disown();
    };
  
    _.each = iterator(function(yield_) {
      var self = this;
      var el = self.ends[L];
      if (!el) return self;
  
      for (; el !== self.ends[R][R]; el = el[R]) {
        var result = yield_(el);
        if (result === false) break;
      }
  
      return self;
    });
  
    _.fold = function(fold, fn) {
      this.each(function(el) {
        fold = fn.call(this, fold, el);
      });
  
      return fold;
    };
  });
  
  
  /**
   * Registry of LaTeX commands and commands created when typing
   * a single character.
   *
   * (Commands are all subclasses of Node.)
   */
  var LatexCmds = {}, CharCmds = {};
  /********************************************
   * Cursor and Selection "singleton" classes
   *******************************************/
  
  /* The main thing that manipulates the Math DOM. Makes sure to manipulate the
  HTML DOM to match. */
  
  /* Sort of singletons, since there should only be one per editable math
  textbox, but any one HTML document can contain many such textboxes, so any one
  JS environment could actually contain many instances. */
  
  //A fake cursor in the fake textbox that the math is rendered in.
  var Cursor = P(Point, function(_) {
    _.init = function(initParent, options) {
      this.parent = initParent;
      this.options = options;
  
      var jQ = this.jQ = this._jQ = $('<span class="mq-cursor">&#8203;</span>');
      //closured for setInterval
      this.blink = function(){ jQ.toggleClass('mq-blink'); };
  
      this.upDownCache = {};
    };
  
    _.show = function() {
      this.jQ = this._jQ.removeClass('mq-blink');
      if ('intervalId' in this) //already was shown, just restart interval
        clearInterval(this.intervalId);
      else { //was hidden and detached, insert this.jQ back into HTML DOM
        if (this[R]) {
          if (this.selection && this.selection.ends[L][L] === this[L])
            this.jQ.insertBefore(this.selection.jQ);
          else
            this.jQ.insertBefore(this[R].jQ.first());
        }
        else
          this.jQ.appendTo(this.parent.jQ);
        this.parent.focus();
      }
      this.intervalId = setInterval(this.blink, 500);
      return this;
    };
    _.hide = function() {
      if ('intervalId' in this)
        clearInterval(this.intervalId);
      delete this.intervalId;
      this.jQ.detach();
      this.jQ = $();
      return this;
    };
  
    _.withDirInsertAt = function(dir, parent, withDir, oppDir) {
      var oldParent = this.parent;
      this.parent = parent;
      this[dir] = withDir;
      this[-dir] = oppDir;
      // by contract, .blur() is called after all has been said and done
      // and the cursor has actually been moved
      if (oldParent !== parent && oldParent.blur) oldParent.blur();
    };
    _.insDirOf = function(dir, el) {
      prayDirection(dir);
      this.jQ.insDirOf(dir, el.jQ);
      this.withDirInsertAt(dir, el.parent, el[dir], el);
      this.parent.jQ.addClass('mq-hasCursor');
      return this;
    };
    _.insLeftOf = function(el) { return this.insDirOf(L, el); };
    _.insRightOf = function(el) { return this.insDirOf(R, el); };
  
    _.insAtDirEnd = function(dir, el) {
      prayDirection(dir);
      this.jQ.insAtDirEnd(dir, el.jQ);
      this.withDirInsertAt(dir, el, 0, el.ends[dir]);
      el.focus();
      return this;
    };
    _.insAtLeftEnd = function(el) { return this.insAtDirEnd(L, el); };
    _.insAtRightEnd = function(el) { return this.insAtDirEnd(R, el); };
  
    /**
     * jump up or down from one block Node to another:
     * - cache the current Point in the node we're jumping from
     * - check if there's a Point in it cached for the node we're jumping to
     *   + if so put the cursor there,
     *   + if not seek a position in the node that is horizontally closest to
     *     the cursor's current position
     */
    _.jumpUpDown = function(from, to) {
      var self = this;
      self.upDownCache[from.id] = Point.copy(self);
      var cached = self.upDownCache[to.id];
      if (cached) {
        cached[R] ? self.insLeftOf(cached[R]) : self.insAtRightEnd(cached.parent);
      }
      else {
        var pageX = self.offset().left;
        to.seek(pageX, self);
      }
    };
    _.offset = function() {
      //in Opera 11.62, .getBoundingClientRect() and hence jQuery::offset()
      //returns all 0's on inline elements with negative margin-right (like
      //the cursor) at the end of their parent, so temporarily remove the
      //negative margin-right when calling jQuery::offset()
      //Opera bug DSK-360043
      //http://bugs.jquery.com/ticket/11523
      //https://github.com/jquery/jquery/pull/717
      var self = this, offset = self.jQ.removeClass('mq-cursor').offset();
      self.jQ.addClass('mq-cursor');
      return offset;
    }
    _.unwrapGramp = function() {
      var gramp = this.parent.parent;
      var greatgramp = gramp.parent;
      var rightward = gramp[R];
      var cursor = this;
  
      var leftward = gramp[L];
      gramp.disown().eachChild(function(uncle) {
        if (uncle.isEmpty()) return;
  
        uncle.children()
          .adopt(greatgramp, leftward, rightward)
          .each(function(cousin) {
            cousin.jQ.insertBefore(gramp.jQ.first());
          })
        ;
  
        leftward = uncle.ends[R];
      });
  
      if (!this[R]) { //then find something to be rightward to insLeftOf
        if (this[L])
          this[R] = this[L][R];
        else {
          while (!this[R]) {
            this.parent = this.parent[R];
            if (this.parent)
              this[R] = this.parent.ends[L];
            else {
              this[R] = gramp[R];
              this.parent = greatgramp;
              break;
            }
          }
        }
      }
      if (this[R])
        this.insLeftOf(this[R]);
      else
        this.insAtRightEnd(greatgramp);
  
      gramp.jQ.remove();
  
      if (gramp[L].siblingDeleted) gramp[L].siblingDeleted(cursor.options, R);
      if (gramp[R].siblingDeleted) gramp[R].siblingDeleted(cursor.options, L);
    };
    _.startSelection = function() {
      var anticursor = this.anticursor = Point.copy(this);
      var ancestors = anticursor.ancestors = {}; // a map from each ancestor of
        // the anticursor, to its child that is also an ancestor; in other words,
        // the anticursor's ancestor chain in reverse order
      for (var ancestor = anticursor; ancestor.parent; ancestor = ancestor.parent) {
        ancestors[ancestor.parent.id] = ancestor;
      }
    };
    _.endSelection = function() {
      delete this.anticursor;
    };
    _.select = function() {
      var anticursor = this.anticursor;
      if (this[L] === anticursor[L] && this.parent === anticursor.parent) return false;
  
      // Find the lowest common ancestor (`lca`), and the ancestor of the cursor
      // whose parent is the LCA (which'll be an end of the selection fragment).
      for (var ancestor = this; ancestor.parent; ancestor = ancestor.parent) {
        if (ancestor.parent.id in anticursor.ancestors) {
          var lca = ancestor.parent;
          break;
        }
      }
      pray('cursor and anticursor in the same tree', lca);
      // The cursor and the anticursor should be in the same tree, because the
      // mousemove handler attached to the document, unlike the one attached to
      // the root HTML DOM element, doesn't try to get the math tree node of the
      // mousemove target, and Cursor::seek() based solely on coordinates stays
      // within the tree of `this` cursor's root.
  
      // The other end of the selection fragment, the ancestor of the anticursor
      // whose parent is the LCA.
      var antiAncestor = anticursor.ancestors[lca.id];
  
      // Now we have two either Nodes or Points, guaranteed to have a common
      // parent and guaranteed that if both are Points, they are not the same,
      // and we have to figure out which is the left end and which the right end
      // of the selection.
      var leftEnd, rightEnd, dir = R;
  
      // This is an extremely subtle algorithm.
      // As a special case, `ancestor` could be a Point and `antiAncestor` a Node
      // immediately to `ancestor`'s left.
      // In all other cases,
      // - both Nodes
      // - `ancestor` a Point and `antiAncestor` a Node
      // - `ancestor` a Node and `antiAncestor` a Point
      // `antiAncestor[R] === rightward[R]` for some `rightward` that is
      // `ancestor` or to its right, if and only if `antiAncestor` is to
      // the right of `ancestor`.
      if (ancestor[L] !== antiAncestor) {
        for (var rightward = ancestor; rightward; rightward = rightward[R]) {
          if (rightward[R] === antiAncestor[R]) {
            dir = L;
            leftEnd = ancestor;
            rightEnd = antiAncestor;
            break;
          }
        }
      }
      if (dir === R) {
        leftEnd = antiAncestor;
        rightEnd = ancestor;
      }
  
      // only want to select Nodes up to Points, can't select Points themselves
      if (leftEnd instanceof Point) leftEnd = leftEnd[R];
      if (rightEnd instanceof Point) rightEnd = rightEnd[L];
  
      this.hide().selection = lca.selectChildren(leftEnd, rightEnd);
      this.insDirOf(dir, this.selection.ends[dir]);
      this.selectionChanged();
      return true;
    };
  
    _.clearSelection = function() {
      if (this.selection) {
        this.selection.clear();
        delete this.selection;
        this.selectionChanged();
      }
      return this;
    };
    _.deleteSelection = function() {
      if (!this.selection) return;
  
      this[L] = this.selection.ends[L][L];
      this[R] = this.selection.ends[R][R];
      this.selection.remove();
      this.selectionChanged();
      delete this.selection;
    };
    _.replaceSelection = function() {
      var seln = this.selection;
      if (seln) {
        this[L] = seln.ends[L][L];
        this[R] = seln.ends[R][R];
        delete this.selection;
      }
      return seln;
    };
  });
  
  var Selection = P(Fragment, function(_, super_) {
    _.init = function() {
      super_.init.apply(this, arguments);
      this.jQ = this.jQ.wrapAll('<span class="mq-selection"></span>').parent();
        //can't do wrapAll(this.jQ = $(...)) because wrapAll will clone it
    };
    _.adopt = function() {
      this.jQ.replaceWith(this.jQ = this.jQ.children());
      return super_.adopt.apply(this, arguments);
    };
    _.clear = function() {
      // using the browser's native .childNodes property so that we
      // don't discard text nodes.
      this.jQ.replaceWith(this.jQ[0].childNodes);
      return this;
    };
    _.join = function(methodName) {
      return this.fold('', function(fold, child) {
        return fold + child[methodName]();
      });
    };
  });
  /*********************************************
   * Controller for a MathQuill instance,
   * on which services are registered with
   *
   *   Controller.open(function(_) { ... });
   *
   ********************************************/
  
  var Controller = P(function(_) {
    _.init = function(root, container, options) {
      this.id = root.id;
      this.data = {};
  
      this.root = root;
      this.container = container;
      this.options = options;
  
      root.controller = this;
  
      this.cursor = root.cursor = Cursor(root, options);
      // TODO: stop depending on root.cursor, and rm it
    };
  
    _.handle = function(name, dir) {
      var handlers = this.options.handlers;
      if (handlers && handlers.fns[name]) {
        var mq = handlers.APIClasses[this.KIND_OF_MQ](this);
        if (dir === L || dir === R) handlers.fns[name](dir, mq);
        else handlers.fns[name](mq);
      }
    };
  
    var notifyees = [];
    this.onNotify = function(f) { notifyees.push(f); };
    _.notify = function() {
      for (var i = 0; i < notifyees.length; i += 1) {
        notifyees[i].apply(this.cursor, arguments);
      }
      return this;
    };
  });
  /*********************************************************
   * The publicly exposed MathQuill API.
   ********************************************************/
  
  var API = {}, Options = P(), optionProcessors = {}, Progenote = P(), EMBEDS = {};
  
  /**
   * Interface Versioning (#459, #495) to allow us to virtually guarantee
   * backcompat. v0.10.x introduces it, so for now, don't completely break the
   * API for people who don't know about it, just complain with console.warn().
   *
   * The methods are shimmed in outro.js so that MQ.MathField.prototype etc can
   * be accessed.
   */
  function insistOnInterVer() {
    if (window.console) console.warn(
      'You are using the MathQuill API without specifying an interface version, ' +
      'which will fail in v1.0.0. You can fix this easily by doing this before ' +
      'doing anything else:\n' +
      '\n' +
      '    MathQuill = MathQuill.getInterface(1);\n' +
      '    // now MathQuill.MathField() works like it used to\n' +
      '\n' +
      'See also the "`dev` branch (2014\u20132015) \u2192 v0.10.0 Migration Guide" at\n' +
      '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
    );
  }
  // globally exported API object
  function MathQuill(el) {
    insistOnInterVer();
    return MQ1(el);
  };
  MathQuill.prototype = Progenote.p;
  MathQuill.interfaceVersion = function(v) {
    // shim for #459-era interface versioning (ended with #495)
    if (v !== 1) throw 'Only interface version 1 supported. You specified: ' + v;
    insistOnInterVer = function() {
      if (window.console) console.warn(
        'You called MathQuill.interfaceVersion(1); to specify the interface ' +
        'version, which will fail in v1.0.0. You can fix this easily by doing ' +
        'this before doing anything else:\n' +
        '\n' +
        '    MathQuill = MathQuill.getInterface(1);\n' +
        '    // now MathQuill.MathField() works like it used to\n' +
        '\n' +
        'See also the "`dev` branch (2014\u20132015) \u2192 v0.10.0 Migration Guide" at\n' +
        '  https://github.com/mathquill/mathquill/wiki/%60dev%60-branch-(2014%E2%80%932015)-%E2%86%92-v0.10.0-Migration-Guide'
      );
    };
    insistOnInterVer();
    return MathQuill;
  };
  MathQuill.getInterface = getInterface;
  
  var MIN = getInterface.MIN = 1, MAX = getInterface.MAX = 2;
  function getInterface(v) {
    if (!(MIN <= v && v <= MAX)) throw 'Only interface versions between ' +
      MIN + ' and ' + MAX + ' supported. You specified: ' + v;
  
    /**
     * Function that takes an HTML element and, if it's the root HTML element of a
     * static math or math or text field, returns an API object for it (else, null).
     *
     *   var mathfield = MQ.MathField(mathFieldSpan);
     *   assert(MQ(mathFieldSpan).id === mathfield.id);
     *   assert(MQ(mathFieldSpan).id === MQ(mathFieldSpan).id);
     *
     */
    function MQ(el) {
      //let a = (el).children('.mq-root-block');
      if (!el || !el.nodeType) return null; // check that `el` is a HTML element, using the
        // same technique as jQuery: https://github.com/jquery/jquery/blob/679536ee4b7a92ae64a5f58d90e9cc38c001e807/src/core/init.js#L92
      var blockId = $(el).children && $(el).children('.mq-root-block').attr(mqBlockId);
      var ctrlr = blockId && Node.byId[blockId]?.controller;
      return ctrlr ? APIClasses[ctrlr.KIND_OF_MQ](ctrlr) : null;
    };
    var APIClasses = {};
  
    MQ.L = L;
    MQ.R = R;
  
    function config(currentOptions, newOptions) {
      if (newOptions && newOptions.handlers) {
        newOptions.handlers = { fns: newOptions.handlers, APIClasses: APIClasses };
      }
      for (var name in newOptions) if (newOptions.hasOwnProperty(name)) {
        var value = newOptions[name], processor = optionProcessors[name];
        currentOptions[name] = (processor ? processor(value) : value);
      }
    }
    MQ.config = function(opts) { config(Options.p, opts); return this; };
    MQ.registerEmbed = function(name, options) {
      if (!/^[a-z][a-z0-9]*$/i.test(name)) {
        throw 'Embed name must start with letter and be only letters and digits';
      }
      EMBEDS[name] = options;
    };
  
    var AbstractMathQuill = APIClasses.AbstractMathQuill = P(Progenote, function(_) {
      _.init = function(ctrlr) {
        this.__controller = ctrlr;
        this.__options = ctrlr.options;
        this.id = ctrlr.id;
        this.data = ctrlr.data;
      };
      _.__mathquillify = function(classNames) {
        var ctrlr = this.__controller, root = ctrlr.root, el = ctrlr.container;
        ctrlr.createTextarea();
  
        var contents = el.addClass(classNames).contents().detach();
        root.jQ =
          $('<span class="mq-root-block"/>').attr(mqBlockId, root.id).appendTo(el);
        this.latex(contents.text());
  
        this.revert = function() {
          return el.empty().unbind('.mathquill')
          .removeClass('mq-editable-field mq-math-mode mq-text-mode')
          .append(contents);
        };
      };
      _.config = function(opts) { config(this.__options, opts); return this; };
      _.el = function() { return this.__controller.container[0]; };
      _.text = function() { return this.__controller.exportText(); };
      _.latex = function(latex) {
        if (arguments.length > 0) {
          this.__controller.renderLatexMath(latex);
          if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
          return this;
        }
        return this.__controller.exportLatex();
      };
      _.html = function() {
        return this.__controller.root.jQ.html()
          .replace(/ mathquill-(?:command|block)-id="?\d+"?/g, '')
          .replace(/<span class="?mq-cursor( mq-blink)?"?>.?<\/span>/i, '')
          .replace(/ mq-hasCursor|mq-hasCursor ?/, '')
          .replace(/ class=(""|(?= |>))/g, '');
      };
      _.reflow = function() {
        this.__controller.root.postOrder('reflow');
        return this;
      };
    });
    MQ.prototype = AbstractMathQuill.prototype;
  
    APIClasses.EditableField = P(AbstractMathQuill, function(_, super_) {
      _.__mathquillify = function() {
        super_.__mathquillify.apply(this, arguments);
        this.__controller.editable = true;
        this.__controller.delegateMouseEvents();
        this.__controller.editablesTextareaEvents();
        return this;
      };
      _.focus = function() { this.__controller.textarea.focus(); return this; };
      _.blur = function() { this.__controller.textarea.blur(); return this; };
      _.write = function(latex) {
        this.__controller.writeLatex(latex);
        this.__controller.scrollHoriz();
        if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
        return this;
      };
      _.cmd = function(cmd) {
        var ctrlr = this.__controller.notify(), cursor = ctrlr.cursor;
        if (/^\\[a-z]+$/i.test(cmd)) {
          cmd = cmd.slice(1);
          var klass = LatexCmds[cmd];
          if (klass) {
            cmd = klass(cmd);
            if (cursor.selection) cmd.replaces(cursor.replaceSelection());
            cmd.createLeftOf(cursor.show());
            this.__controller.scrollHoriz();
          }
          else /* TODO: API needs better error reporting */;
        }
        else cursor.parent.write(cursor, cmd);
        if (ctrlr.blurred) cursor.hide().parent.blur();
        return this;
      };
      _.select = function() {
        var ctrlr = this.__controller;
        ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
        while (ctrlr.cursor[L]) ctrlr.selectLeft();
        return this;
      };
      _.clearSelection = function() {
        this.__controller.cursor.clearSelection();
        return this;
      };
  
      _.moveToDirEnd = function(dir) {
        this.__controller.notify('move').cursor.insAtDirEnd(dir, this.__controller.root);
        return this;
      };
      _.moveToLeftEnd = function() { return this.moveToDirEnd(L); };
      _.moveToRightEnd = function() { return this.moveToDirEnd(R); };
  
      _.keystroke = function(keys) {
        var keys = keys.replace(/^\s+|\s+$/g, '').split(/\s+/);
        for (var i = 0; i < keys.length; i += 1) {
          this.__controller.keystroke(keys[i], { preventDefault: noop });
        }
        return this;
      };
      _.typedText = function(text) {
        for (var i = 0; i < text.length; i += 1) this.__controller.typedText(text.charAt(i));
        return this;
      };
      _.dropEmbedded = function(pageX, pageY, options) {
        var clientX = pageX - $(window).scrollLeft();
        var clientY = pageY - $(window).scrollTop();
  
        var el = document.elementFromPoint(clientX, clientY);
        this.__controller.seek($(el), pageX, pageY);
        var cmd = Embed().setOptions(options);
        cmd.createLeftOf(this.__controller.cursor);
      };
    });
    MQ.EditableField = function() { throw "wtf don't call me, I'm 'abstract'"; };
    MQ.EditableField.prototype = APIClasses.EditableField.prototype;
  
    /**
     * Export the API functions that MathQuill-ify an HTML element into API objects
     * of each class. If the element had already been MathQuill-ified but into a
     * different kind (or it's not an HTML element), return null.
     */
    for (var kind in API) (function(kind, defAPIClass) {
      var APIClass = APIClasses[kind] = defAPIClass(APIClasses);
      MQ[kind] = function(el, opts) {
        var mq = MQ(el);
        if (mq instanceof APIClass || !el || !el.nodeType) return mq;
        var ctrlr = Controller(APIClass.RootBlock(), $(el), Options());
        ctrlr.KIND_OF_MQ = kind;
        return APIClass(ctrlr).__mathquillify(opts, v);
      };
      MQ[kind].prototype = APIClass.prototype;
    }(kind, API[kind]));
  
    return MQ;
  }
  
  MathQuill.noConflict = function() {
    window.MathQuill = origMathQuill;
    return MathQuill;
  };
  var origMathQuill = window.MathQuill;
  window.MathQuill = MathQuill;
  
  function RootBlockMixin(_) {
    var names = 'moveOutOf deleteOutOf selectOutOf upOutOf downOutOf'.split(' ');
    for (var i = 0; i < names.length; i += 1) (function(name) {
      _[name] = function(dir) { this.controller.handle(name, dir); };
    }(names[i]));
    _.reflow = function() {
      this.controller.handle('reflow');
      this.controller.handle('edited');
      this.controller.handle('edit');
    };
  }
  var Parser = P(function(_, super_, Parser) {
    // The Parser object is a wrapper for a parser function.
    // Externally, you use one to parse a string by calling
    //   var result = SomeParser.parse('Me Me Me! Parse Me!');
    // You should never call the constructor, rather you should
    // construct your Parser from the base parsers and the
    // parser combinator methods.
  
    function parseError(stream, message) {
      if (stream) {
        stream = "'"+stream+"'";
      }
      else {
        stream = 'EOF';
      }
  
      throw 'Parse Error: '+message+' at '+stream;
    }
  
    _.init = function(body) { this._ = body; };
  
    _.parse = function(stream) {
      return this.skip(eof)._(''+stream, success, parseError);
  
      function success(stream, result) { return result; }
    };
  
    // -*- primitive combinators -*- //
    _.or = function(alternative) {
      pray('or is passed a parser', alternative instanceof Parser);
  
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        return self._(stream, onSuccess, failure);
  
        function failure(newStream) {
          return alternative._(stream, onSuccess, onFailure);
        }
      });
    };
  
    _.then = function(next) {
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        return self._(stream, success, onFailure);
  
        function success(newStream, result) {
          var nextParser = (next instanceof Parser ? next : next(result));
          pray('a parser is returned', nextParser instanceof Parser);
          return nextParser._(newStream, onSuccess, onFailure);
        }
      });
    };
  
    // -*- optimized iterative combinators -*- //
    _.many = function() {
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        var xs = [];
        while (self._(stream, success, failure));
        return onSuccess(stream, xs);
  
        function success(newStream, x) {
          stream = newStream;
          xs.push(x);
          return true;
        }
  
        function failure() {
          return false;
        }
      });
    };
  
    _.times = function(min, max) {
      if (arguments.length < 2) max = min;
      var self = this;
  
      return Parser(function(stream, onSuccess, onFailure) {
        var xs = [];
        var result = true;
        var failure;
  
        for (var i = 0; i < min; i += 1) {
          result = self._(stream, success, firstFailure);
          if (!result) return onFailure(stream, failure);
        }
  
        for (; i < max && result; i += 1) {
          result = self._(stream, success, secondFailure);
        }
  
        return onSuccess(stream, xs);
  
        function success(newStream, x) {
          xs.push(x);
          stream = newStream;
          return true;
        }
  
        function firstFailure(newStream, msg) {
          failure = msg;
          stream = newStream;
          return false;
        }
  
        function secondFailure(newStream, msg) {
          return false;
        }
      });
    };
  
    // -*- higher-level combinators -*- //
    _.result = function(res) { return this.then(succeed(res)); };
    _.atMost = function(n) { return this.times(0, n); };
    _.atLeast = function(n) {
      var self = this;
      return self.times(n).then(function(start) {
        return self.many().map(function(end) {
          return start.concat(end);
        });
      });
    };
  
    _.map = function(fn) {
      return this.then(function(result) { return succeed(fn(result)); });
    };
  
    _.skip = function(two) {
      return this.then(function(result) { return two.result(result); });
    };
  
    // -*- primitive parsers -*- //
    var string = this.string = function(str) {
      var len = str.length;
      var expected = "expected '"+str+"'";
  
      return Parser(function(stream, onSuccess, onFailure) {
        var head = stream.slice(0, len);
  
        if (head === str) {
          return onSuccess(stream.slice(len), head);
        }
        else {
          return onFailure(stream, expected);
        }
      });
    };
  
    var regex = this.regex = function(re) {
      pray('regexp parser is anchored', re.toString().charAt(1) === '^');
  
      var expected = 'expected '+re;
  
      return Parser(function(stream, onSuccess, onFailure) {
        var match = re.exec(stream);
  
        if (match) {
          var result = match[0];
          return onSuccess(stream.slice(result.length), result);
        }
        else {
          return onFailure(stream, expected);
        }
      });
    };
  
    var succeed = Parser.succeed = function(result) {
      return Parser(function(stream, onSuccess) {
        return onSuccess(stream, result);
      });
    };
  
    var fail = Parser.fail = function(msg) {
      return Parser(function(stream, _, onFailure) {
        return onFailure(stream, msg);
      });
    };
  
    var letter = Parser.letter = regex(/^[a-z]/i);
    var letters = Parser.letters = regex(/^[a-z]*/i);
    var digit = Parser.digit = regex(/^[0-9]/);
    var digits = Parser.digits = regex(/^[0-9]*/);
    var whitespace = Parser.whitespace = regex(/^\s+/);
    var optWhitespace = Parser.optWhitespace = regex(/^\s*/);
  
    var any = Parser.any = Parser(function(stream, onSuccess, onFailure) {
      if (!stream) return onFailure(stream, 'expected any character');
  
      return onSuccess(stream.slice(1), stream.charAt(0));
    });
  
    var all = Parser.all = Parser(function(stream, onSuccess, onFailure) {
      return onSuccess('', stream);
    });
  
    var eof = Parser.eof = Parser(function(stream, onSuccess, onFailure) {
      if (stream) return onFailure(stream, 'expected EOF');
  
      return onSuccess(stream, stream);
    });
  });
  /*************************************************
   * Sane Keyboard Events Shim
   *
   * An abstraction layer wrapping the textarea in
   * an object with methods to manipulate and listen
   * to events on, that hides all the nasty cross-
   * browser incompatibilities behind a uniform API.
   *
   * Design goal: This is a *HARD* internal
   * abstraction barrier. Cross-browser
   * inconsistencies are not allowed to leak through
   * and be dealt with by event handlers. All future
   * cross-browser issues that arise must be dealt
   * with here, and if necessary, the API updated.
   *
   * Organization:
   * - key values map and stringify()
   * - saneKeyboardEvents()
   *    + defer() and flush()
   *    + event handler logic
   *    + attach event handlers and export methods
   ************************************************/
  
  var saneKeyboardEvents = (function() {
    // The following [key values][1] map was compiled from the
    // [DOM3 Events appendix section on key codes][2] and
    // [a widely cited report on cross-browser tests of key codes][3],
    // except for 10: 'Enter', which I've empirically observed in Safari on iOS
    // and doesn't appear to conflict with any other known key codes.
    //
    // [1]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#keys-keyvalues
    // [2]: http://www.w3.org/TR/2012/WD-DOM-Level-3-Events-20120614/#fixed-virtual-key-codes
    // [3]: http://unixpapa.com/js/key.html
    var KEY_VALUES = {
      8: 'Backspace',
      9: 'Tab',
  
      10: 'Enter', // for Safari on iOS
  
      13: 'Enter',
  
      16: 'Shift',
      17: 'Control',
      18: 'Alt',
      20: 'CapsLock',
  
      27: 'Esc',
  
      32: 'Spacebar',
  
      33: 'PageUp',
      34: 'PageDown',
      35: 'End',
      36: 'Home',
  
      37: 'Left',
      38: 'Up',
      39: 'Right',
      40: 'Down',
  
      45: 'Insert',
  
      46: 'Del',
  
      144: 'NumLock'
    };
  
    // To the extent possible, create a normalized string representation
    // of the key combo (i.e., key code and modifier keys).
    function stringify(evt) {
      var which = evt.which || evt.keyCode;
      var keyVal = KEY_VALUES[which];
      var key;
      var modifiers = [];
  
      if (evt.ctrlKey) modifiers.push('Ctrl');
      if (evt.originalEvent && evt.originalEvent.metaKey) modifiers.push('Meta');
      if (evt.altKey) modifiers.push('Alt');
      if (evt.shiftKey) modifiers.push('Shift');
  
      key = keyVal || String.fromCharCode(which);
  
      if (!modifiers.length && !keyVal) return key;
  
      modifiers.push(key);
      return modifiers.join('-');
    }
  
    // create a keyboard events shim that calls callbacks at useful times
    // and exports useful public methods
    return function saneKeyboardEvents(el, handlers) {
      var keydown = null;
      var keypress = null;
  
      var textarea = jQuery(el);
      var target = jQuery(handlers.container || textarea);
  
      // checkTextareaFor() is called after keypress or paste events to
      // say "Hey, I think something was just typed" or "pasted" (resp.),
      // so that at all subsequent opportune times (next event or timeout),
      // will check for expected typed or pasted text.
      // Need to check repeatedly because #135: in Safari 5.1 (at least),
      // after selecting something and then typing, the textarea is
      // incorrectly reported as selected during the input event (but not
      // subsequently).
      var checkTextarea = noop, timeoutId;
      function checkTextareaFor(checker) {
        checkTextarea = checker;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checker);
      }
      target.bind('keydown keypress input keyup focusout paste', function(e) { checkTextarea(e); });
  
  
      // -*- public methods -*- //
      function select(text) {
        // check textarea at least once/one last time before munging (so
        // no race condition if selection happens after keypress/paste but
        // before checkTextarea), then never again ('cos it's been munged)
        checkTextarea();
        checkTextarea = noop;
        clearTimeout(timeoutId);
  
        textarea.val(text);
        if (text && textarea[0].select) textarea[0].select();
        shouldBeSelected = !!text;
      }
      var shouldBeSelected = false;
  
      // -*- helper subroutines -*- //
  
      // Determine whether there's a selection in the textarea.
      // This will always return false in IE < 9, which don't support
      // HTMLTextareaElement::selection{Start,End}.
      function hasSelection() {
        var dom = textarea[0];
  
        if (!('selectionStart' in dom)) return false;
        return dom.selectionStart !== dom.selectionEnd;
      }
  
      function handleKey() {
        handlers.keystroke(stringify(keydown), keydown);
      }
  
      // -*- event handlers -*- //
      function onKeydown(e) {
        keydown = e;
        keypress = null;
  
        if (shouldBeSelected) checkTextareaFor(function(e) {
          if (!(e && e.type === 'focusout') && textarea[0].select) {
            textarea[0].select(); // re-select textarea in case it's an unrecognized
          }
          checkTextarea = noop; // key that clears the selection, then never
          clearTimeout(timeoutId); // again, 'cos next thing might be blur
        });
  
        handleKey();
      }
  
      function onKeypress(e) {
        // call the key handler for repeated keypresses.
        // This excludes keypresses that happen directly
        // after keydown.  In that case, there will be
        // no previous keypress, so we skip it here
        if (keydown && keypress) handleKey();
  
        keypress = e;
  
        checkTextareaFor(typedText);
      }
      function typedText() {
        // If there is a selection, the contents of the textarea couldn't
        // possibly have just been typed in.
        // This happens in browsers like Firefox and Opera that fire
        // keypress for keystrokes that are not text entry and leave the
        // selection in the textarea alone, such as Ctrl-C.
        // Note: we assume that browsers that don't support hasSelection()
        // also never fire keypress on keystrokes that are not text entry.
        // This seems reasonably safe because:
        // - all modern browsers including IE 9+ support hasSelection(),
        //   making it extremely unlikely any browser besides IE < 9 won't
        // - as far as we know IE < 9 never fires keypress on keystrokes
        //   that aren't text entry, which is only as reliable as our
        //   tests are comprehensive, but the IE < 9 way to do
        //   hasSelection() is poorly documented and is also only as
        //   reliable as our tests are comprehensive
        // If anything like #40 or #71 is reported in IE < 9, see
        // b1318e5349160b665003e36d4eedd64101ceacd8
        if (hasSelection()) return;
  
        var text = textarea.val();
        if (text.length === 1) {
          textarea.val('');
          handlers.typedText(text);
        } // in Firefox, keys that don't type text, just clear seln, fire keypress
        // https://github.com/mathquill/mathquill/issues/293#issuecomment-40997668
        else if (text && textarea[0].select) textarea[0].select(); // re-select if that's why we're here
      }
  
      function onBlur() { keydown = keypress = null; }
  
      function onPaste(e) {
        // browsers are dumb.
        //
        // In Linux, middle-click pasting causes onPaste to be called,
        // when the textarea is not necessarily focused.  We focus it
        // here to ensure that the pasted text actually ends up in the
        // textarea.
        //
        // It's pretty nifty that by changing focus in this handler,
        // we can change the target of the default action.  (This works
        // on keydown too, FWIW).
        //
        // And by nifty, we mean dumb (but useful sometimes).
        textarea.focus();
  
        checkTextareaFor(pastedText);
      }
      function pastedText() {
        var text = textarea.val();
        textarea.val('');
        if (text) handlers.paste(text);
      }
  
      // -*- attach event handlers -*- //
      target.bind({
        keydown: onKeydown,
        keypress: onKeypress,
        focusout: onBlur,
        paste: onPaste
      });
  
      // -*- export public methods -*- //
      return {
        select: select
      };
    };
  }());
  /***********************************************
   * Export math in a human-readable text format
   * As you can see, only half-baked so far.
   **********************************************/
  
  Controller.open(function(_, super_) {
    _.exportText = function() {
      return this.root.foldChildren('', function(text, child) {
        return text + child.text();
      });
    };
  });
  Controller.open(function(_) {
    _.focusBlurEvents = function() {
      var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor;
      var blurTimeout;
      ctrlr.textarea.focus(function() {
        ctrlr.blurred = false;
        clearTimeout(blurTimeout);
        ctrlr.container.addClass('mq-focused');
        if (!cursor.parent)
          cursor.insAtRightEnd(root);
        if (cursor.selection) {
          cursor.selection.jQ.removeClass('mq-blur');
          ctrlr.selectionChanged(); //re-select textarea contents after tabbing away and back
        }
        else
          cursor.show();
      }).blur(function() {
        ctrlr.blurred = true;
        blurTimeout = setTimeout(function() { // wait for blur on window; if
          root.postOrder('intentionalBlur'); // none, intentional blur: #264
          cursor.clearSelection().endSelection();
          blur();
        });
        $(window).on('blur', windowBlur);
      });
      function windowBlur() { // blur event also fired on window, just switching
        clearTimeout(blurTimeout); // tabs/windows, not intentional blur
        if (cursor.selection) cursor.selection.jQ.addClass('mq-blur');
        blur();
      }
      function blur() { // not directly in the textarea blur handler so as to be
        cursor.hide().parent.blur(); // synchronous with/in the same frame as
        ctrlr.container.removeClass('mq-focused'); // clearing/blurring selection
        $(window).off('blur', windowBlur);
      }
      ctrlr.blurred = true;
      cursor.hide().parent.blur();
    };
  });
  
  /**
   * TODO: I wanted to move MathBlock::focus and blur here, it would clean
   * up lots of stuff like, TextBlock::focus is set to MathBlock::focus
   * and TextBlock::blur calls MathBlock::blur, when instead they could
   * use inheritance and super_.
   *
   * Problem is, there's lots of calls to .focus()/.blur() on nodes
   * outside Controller::focusBlurEvents(), such as .postOrder('blur') on
   * insertion, which if MathBlock::blur becomes Node::blur, would add the
   * 'blur' CSS class to all Symbol's (because .isEmpty() is true for all
   * of them).
   *
   * I'm not even sure there aren't other troublesome calls to .focus() or
   * .blur(), so this is TODO for now.
   */
  /*****************************************
   * Deals with the browser DOM events from
   * interaction with the typist.
   ****************************************/
  
  Controller.open(function(_) {
    _.keystroke = function(key, evt) {
      this.cursor.parent.keystroke(key, evt, this);
    };
  });
  
  Node.open(function(_) {
    _.keystroke = function(key, e, ctrlr) {
      var cursor = ctrlr.cursor;
  
      switch (key) {
      case 'Ctrl-Shift-Backspace':
      case 'Ctrl-Backspace':
        ctrlr.ctrlDeleteDir(L);
        break;
  
      case 'Shift-Backspace':
      case 'Backspace':
        ctrlr.backspace();
        break;
  
      // Tab or Esc -> go one block right if it exists, else escape right.
      case 'Esc':
      case 'Tab':
        ctrlr.escapeDir(R, key, e);
        return;
  
      // Shift-Tab -> go one block left if it exists, else escape left.
      case 'Shift-Tab':
      case 'Shift-Esc':
        ctrlr.escapeDir(L, key, e);
        return;
  
      // End -> move to the end of the current block.
      case 'End':
        ctrlr.notify('move').cursor.insAtRightEnd(cursor.parent);
        break;
  
      // Ctrl-End -> move all the way to the end of the root block.
      case 'Ctrl-End':
        ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
        break;
  
      // Shift-End -> select to the end of the current block.
      case 'Shift-End':
        while (cursor[R]) {
          ctrlr.selectRight();
        }
        break;
  
      // Ctrl-Shift-End -> select to the end of the root block.
      case 'Ctrl-Shift-End':
        while (cursor[R] || cursor.parent !== ctrlr.root) {
          ctrlr.selectRight();
        }
        break;
  
      // Home -> move to the start of the root block or the current block.
      case 'Home':
        ctrlr.notify('move').cursor.insAtLeftEnd(cursor.parent);
        break;
  
      // Ctrl-Home -> move to the start of the current block.
      case 'Ctrl-Home':
        ctrlr.notify('move').cursor.insAtLeftEnd(ctrlr.root);
        break;
  
      // Shift-Home -> select to the start of the current block.
      case 'Shift-Home':
        while (cursor[L]) {
          ctrlr.selectLeft();
        }
        break;
  
      // Ctrl-Shift-Home -> move to the start of the root block.
      case 'Ctrl-Shift-Home':
        while (cursor[L] || cursor.parent !== ctrlr.root) {
          ctrlr.selectLeft();
        }
        break;
  
      case 'Left': ctrlr.moveLeft(); break;
      case 'Shift-Left': ctrlr.selectLeft(); break;
      case 'Ctrl-Left': break;
  
      case 'Right': ctrlr.moveRight(); break;
      case 'Shift-Right': ctrlr.selectRight(); break;
      case 'Ctrl-Right': break;
  
      case 'Up': ctrlr.moveUp(); break;
      case 'Down': ctrlr.moveDown(); break;
  
      case 'Shift-Up':
        if (cursor[L]) {
          while (cursor[L]) ctrlr.selectLeft();
        } else {
          ctrlr.selectLeft();
        }
  
      case 'Shift-Down':
        if (cursor[R]) {
          while (cursor[R]) ctrlr.selectRight();
        }
        else {
          ctrlr.selectRight();
        }
  
      case 'Ctrl-Up': break;
      case 'Ctrl-Down': break;
  
      case 'Ctrl-Shift-Del':
      case 'Ctrl-Del':
        ctrlr.ctrlDeleteDir(R);
        break;
  
      case 'Shift-Del':
      case 'Del':
        ctrlr.deleteForward();
        break;
  
      case 'Meta-A':
      case 'Ctrl-A':
        ctrlr.notify('move').cursor.insAtRightEnd(ctrlr.root);
        while (cursor[L]) ctrlr.selectLeft();
        break;
  
      default:
        return;
      }
      e.preventDefault();
      ctrlr.scrollHoriz();
    };
  
    _.moveOutOf = // called by Controller::escapeDir, moveDir
    _.moveTowards = // called by Controller::moveDir
    _.deleteOutOf = // called by Controller::deleteDir
    _.deleteTowards = // called by Controller::deleteDir
    _.unselectInto = // called by Controller::selectDir
    _.selectOutOf = // called by Controller::selectDir
    _.selectTowards = // called by Controller::selectDir
      function() { pray('overridden or never called on this node'); };
  });
  
  Controller.open(function(_) {
    this.onNotify(function(e) {
      if (e === 'move' || e === 'upDown') this.show().clearSelection();
    });
    _.escapeDir = function(dir, key, e) {
      prayDirection(dir);
      var cursor = this.cursor;
  
      // only prevent default of Tab if not in the root editable
      if (cursor.parent !== this.root) e.preventDefault();
  
      // want to be a noop if in the root editable (in fact, Tab has an unrelated
      // default browser action if so)
      if (cursor.parent === this.root) return;
  
      cursor.parent.moveOutOf(dir, cursor);
      return this.notify('move');
    };
  
    optionProcessors.leftRightIntoCmdGoes = function(updown) {
      if (updown && updown !== 'up' && updown !== 'down') {
        throw '"up" or "down" required for leftRightIntoCmdGoes option, '
              + 'got "'+updown+'"';
      }
      return updown;
    };
    _.moveDir = function(dir) {
      prayDirection(dir);
      var cursor = this.cursor, updown = cursor.options.leftRightIntoCmdGoes;
  
      if (cursor.selection) {
        cursor.insDirOf(dir, cursor.selection.ends[dir]);
      }
      else if (cursor[dir]) cursor[dir].moveTowards(dir, cursor, updown);
      else cursor.parent.moveOutOf(dir, cursor, updown);
  
      return this.notify('move');
    };
    _.moveLeft = function() { return this.moveDir(L); };
    _.moveRight = function() { return this.moveDir(R); };
  
    /**
     * moveUp and moveDown have almost identical algorithms:
     * - first check left and right, if so insAtLeft/RightEnd of them
     * - else check the parent's 'upOutOf'/'downOutOf' property:
     *   + if it's a function, call it with the cursor as the sole argument and
     *     use the return value as if it were the value of the property
     *   + if it's a Node, jump up or down into it:
     *     - if there is a cached Point in the block, insert there
     *     - else, seekHoriz within the block to the current x-coordinate (to be
     *       as close to directly above/below the current position as possible)
     *   + unless it's exactly `true`, stop bubbling
     */
    _.moveUp = function() { return moveUpDown(this, 'up'); };
    _.moveDown = function() { return moveUpDown(this, 'down'); };
    function moveUpDown(self, dir) {
      var cursor = self.notify('upDown').cursor;
      var dirInto = dir+'Into', dirOutOf = dir+'OutOf';
      if (cursor[R][dirInto]) cursor.insAtLeftEnd(cursor[R][dirInto]);
      else if (cursor[L][dirInto]) cursor.insAtRightEnd(cursor[L][dirInto]);
      else {
        cursor.parent.bubble(function(ancestor) {
          var prop = ancestor[dirOutOf];
          if (prop) {
            if (typeof prop === 'function') prop = ancestor[dirOutOf](cursor);
            if (prop instanceof Node) cursor.jumpUpDown(ancestor, prop);
            if (prop !== true) return false;
          }
        });
      }
      return self;
    }
    this.onNotify(function(e) { if (e !== 'upDown') this.upDownCache = {}; });
  
    this.onNotify(function(e) { if (e === 'edit') this.show().deleteSelection(); });
    _.deleteDir = function(dir) {
      prayDirection(dir);
      var cursor = this.cursor;
  
      var hadSelection = cursor.selection;
      this.notify('edit'); // deletes selection if present
      if (!hadSelection) {
        if (cursor[dir]) cursor[dir].deleteTowards(dir, cursor);
        else cursor.parent.deleteOutOf(dir, cursor);
      }
  
      if (cursor[L].siblingDeleted) cursor[L].siblingDeleted(cursor.options, R);
      if (cursor[R].siblingDeleted) cursor[R].siblingDeleted(cursor.options, L);
      cursor.parent.bubble('reflow');
  
      return this;
    };
    _.ctrlDeleteDir = function(dir) {
      prayDirection(dir);
      var cursor = this.cursor;
      if (!cursor[L] || cursor.selection) return ctrlr.deleteDir();
  
      this.notify('edit');
      Fragment(cursor.parent.ends[L], cursor[L]).remove();
      cursor.insAtDirEnd(L, cursor.parent);
  
      if (cursor[L].siblingDeleted) cursor[L].siblingDeleted(cursor.options, R);
      if (cursor[R].siblingDeleted) cursor[R].siblingDeleted(cursor.options, L);
      cursor.parent.bubble('reflow');
  
      return this;
    };
    _.backspace = function() { return this.deleteDir(L); };
    _.deleteForward = function() { return this.deleteDir(R); };
  
    this.onNotify(function(e) { if (e !== 'select') this.endSelection(); });
    _.selectDir = function(dir) {
      var cursor = this.notify('select').cursor, seln = cursor.selection;
      prayDirection(dir);
  
      if (!cursor.anticursor) cursor.startSelection();
  
      var node = cursor[dir];
      if (node) {
        // "if node we're selecting towards is inside selection (hence retracting)
        // and is on the *far side* of the selection (hence is only node selected)
        // and the anticursor is *inside* that node, not just on the other side"
        if (seln && seln.ends[dir] === node && cursor.anticursor[-dir] !== node) {
          node.unselectInto(dir, cursor);
        }
        else node.selectTowards(dir, cursor);
      }
      else cursor.parent.selectOutOf(dir, cursor);
  
      cursor.clearSelection();
      cursor.select() || cursor.show();
    };
    _.selectLeft = function() { return this.selectDir(L); };
    _.selectRight = function() { return this.selectDir(R); };
  });
  // Parser MathCommand
  var latexMathParser = (function() {
    function commandToBlock(cmd) {
      var block = MathBlock();
      cmd.adopt(block, 0, 0);
      return block;
    }
    function joinBlocks(blocks) {
      var firstBlock = blocks[0] || MathBlock();
  
      for (var i = 1; i < blocks.length; i += 1) {
        blocks[i].children().adopt(firstBlock, firstBlock.ends[R], 0);
      }
  
      return firstBlock;
    }
  
    var string = Parser.string;
    var regex = Parser.regex;
    var letter = Parser.letter;
    var any = Parser.any;
    var optWhitespace = Parser.optWhitespace;
    var succeed = Parser.succeed;
    var fail = Parser.fail;
  
    // Parsers yielding either MathCommands, or Fragments of MathCommands
    //   (either way, something that can be adopted by a MathBlock)
    var variable = letter.map(function(c) { return Letter(c); });
    var symbol = regex(/^[^${}\\_^]/).map(function(c) { return VanillaSymbol(c); });
  
    var controlSequence =
      regex(/^[^\\a-eg-zA-Z]/) // hotfix #164; match MathBlock::write
      .or(string('\\').then(
        regex(/^[a-z]+/i)
        .or(regex(/^\s+/).result(' '))
        .or(any)
      )).then(function(ctrlSeq) {
        var cmdKlass = LatexCmds[ctrlSeq];
  
        if (cmdKlass) {
          return cmdKlass(ctrlSeq).parser();
        }
        else {
          return fail('unknown command: \\'+ctrlSeq);
        }
      })
    ;
  
    var command =
      controlSequence
      .or(variable)
      .or(symbol)
    ;
  
    // Parsers yielding MathBlocks
    var mathGroup = string('{').then(function() { return mathSequence; }).skip(string('}'));
    var mathBlock = optWhitespace.then(mathGroup.or(command.map(commandToBlock)));
    var mathSequence = mathBlock.many().map(joinBlocks).skip(optWhitespace);
  
    var optMathBlock =
      string('[').then(
        mathBlock.then(function(block) {
          return block.join('latex') !== ']' ? succeed(block) : fail();
        })
        .many().map(joinBlocks).skip(optWhitespace)
      ).skip(string(']'))
    ;
  
    var latexMath = mathSequence;
  
    latexMath.block = mathBlock;
    latexMath.optBlock = optMathBlock;
    return latexMath;
  })();
  
  Controller.open(function(_, super_) {
    _.exportLatex = function() {
      return this.root.latex().replace(/(\\[a-z]+) (?![a-z])/ig,'$1');
    };
    _.writeLatex = function(latex) {
      var cursor = this.notify('edit').cursor;
  
      var all = Parser.all;
      var eof = Parser.eof;
  
      var block = latexMathParser.skip(eof).or(all.result(false)).parse(latex);
  
      if (block && !block.isEmpty()) {
        block.children().adopt(cursor.parent, cursor[L], cursor[R]);
        var jQ = block.jQize();
        jQ.insertBefore(cursor.jQ);
        cursor[L] = block.ends[R];
        block.finalizeInsert(cursor.options, cursor);
        if (block.ends[R][R].siblingCreated) block.ends[R][R].siblingCreated(cursor.options, L);
        if (block.ends[L][L].siblingCreated) block.ends[L][L].siblingCreated(cursor.options, R);
        cursor.parent.bubble('reflow');
      }
  
      return this;
    };
    _.renderLatexMath = function(latex) {
      var root = this.root, cursor = this.cursor;
  
      var all = Parser.all;
      var eof = Parser.eof;
  
      var block = latexMathParser.skip(eof).or(all.result(false)).parse(latex);
  
      root.eachChild('postOrder', 'dispose');
      root.ends[L] = root.ends[R] = 0;
  
      if (block) {
        block.children().adopt(root, 0, 0);
      }
  
      var jQ = root.jQ;
  
      if (block) {
        var html = block.join('html');
        jQ.html(html);
        root.jQize(jQ.children());
        root.finalizeInsert(cursor.options);
      }
      else {
        jQ.empty();
      }
  
      delete cursor.selection;
      cursor.insAtRightEnd(root);
    };
    _.renderLatexText = function(latex) {
      var root = this.root, cursor = this.cursor;
  
      root.jQ.children().slice(1).remove();
      root.eachChild('postOrder', 'dispose');
      root.ends[L] = root.ends[R] = 0;
      delete cursor.selection;
      cursor.show().insAtRightEnd(root);
  
      var regex = Parser.regex;
      var string = Parser.string;
      var eof = Parser.eof;
      var all = Parser.all;
  
      // Parser RootMathCommand
      var mathMode = string('$').then(latexMathParser)
        // because TeX is insane, math mode doesn't necessarily
        // have to end.  So we allow for the case that math mode
        // continues to the end of the stream.
        .skip(string('$').or(eof))
        .map(function(block) {
          // HACK FIXME: this shouldn't have to have access to cursor
          var rootMathCommand = RootMathCommand(cursor);
  
          rootMathCommand.createBlocks();
          var rootMathBlock = rootMathCommand.ends[L];
          block.children().adopt(rootMathBlock, 0, 0);
  
          return rootMathCommand;
        })
      ;
  
      var escapedDollar = string('\\$').result('$');
      var textChar = escapedDollar.or(regex(/^[^$]/)).map(VanillaSymbol);
      var latexText = mathMode.or(textChar).many();
      var commands = latexText.skip(eof).or(all.result(false)).parse(latex);
  
      if (commands) {
        for (var i = 0; i < commands.length; i += 1) {
          commands[i].adopt(root, root.ends[R], 0);
        }
  
        root.jQize().appendTo(root.jQ);
  
        root.finalizeInsert(cursor.options);
      }
    };
  });
  /********************************************************
   * Deals with mouse events for clicking, drag-to-select
   *******************************************************/
  
  Controller.open(function(_) {
    _.delegateMouseEvents = function() {
      var ultimateRootjQ = this.root.jQ;
      //drag-to-select event handling
      this.container.bind('mousedown.mathquill', function(e) {
        var rootjQ = $(e.target).closest('.mq-root-block');
        var root = Node.byId[rootjQ.attr(mqBlockId) || ultimateRootjQ.attr(mqBlockId)];
        var ctrlr = root.controller, cursor = ctrlr.cursor, blink = cursor.blink;
        var textareaSpan = ctrlr.textareaSpan, textarea = ctrlr.textarea;
  
        var target;
        function mousemove(e) { target = $(e.target); }
        function docmousemove(e) {
          if (!cursor.anticursor) cursor.startSelection();
          ctrlr.seek(target, e.pageX, e.pageY).cursor.select();
          target = undefined;
        }
        // outside rootjQ, the MathQuill node corresponding to the target (if any)
        // won't be inside this root, so don't mislead Controller::seek with it
  
        function mouseup(e) {
          cursor.blink = blink;
          if (!cursor.selection) {
            if (ctrlr.editable) {
              cursor.show();
            }
            else {
              textareaSpan.detach();
            }
          }
  
          // delete the mouse handlers now that we're not dragging anymore
          rootjQ.unbind('mousemove', mousemove);
          $(e.target.ownerDocument).unbind('mousemove', docmousemove).unbind('mouseup', mouseup);
        }
  
        if (ctrlr.blurred) {
          if (!ctrlr.editable) rootjQ.prepend(textareaSpan);
          textarea.focus();
        }
        e.preventDefault(); // doesn't work in IE\u22648, but it's a one-line fix:
        e.target.unselectable = true; // http://jsbin.com/yagekiji/1
  
        cursor.blink = noop;
        ctrlr.seek($(e.target), e.pageX, e.pageY).cursor.startSelection();
  
        rootjQ.mousemove(mousemove);
        $(e.target.ownerDocument).mousemove(docmousemove).mouseup(mouseup);
        // listen on document not just body to not only hear about mousemove and
        // mouseup on page outside field, but even outside page, except iframes: https://github.com/mathquill/mathquill/commit/8c50028afcffcace655d8ae2049f6e02482346c5#commitcomment-6175800
      });
    }
  });
  
  Controller.open(function(_) {
    _.seek = function(target, pageX, pageY) {
      var cursor = this.notify('select').cursor;
  
      if (target) {
        var nodeId = target.attr(mqBlockId) || target.attr(mqCmdId);
        if (!nodeId) {
          var targetParent = target.parent();
          nodeId = targetParent.attr(mqBlockId) || targetParent.attr(mqCmdId);
        }
      }
      var node = nodeId ? Node.byId[nodeId] : this.root;
      pray('nodeId is the id of some Node that exists', node);
  
      // don't clear selection until after getting node from target, in case
      // target was selection span, otherwise target will have no parent and will
      // seek from root, which is less accurate (e.g. fraction)
      cursor.clearSelection().show();
  
      node.seek(pageX, cursor);
      this.scrollHoriz(); // before .selectFrom when mouse-selecting, so
                          // always hits no-selection case in scrollHoriz and scrolls slower
      return this;
    };
  });
  /***********************************************
   * Horizontal panning for editable fields that
   * overflow their width
   **********************************************/
  
  Controller.open(function(_) {
    _.scrollHoriz = function() {
      var cursor = this.cursor, seln = cursor.selection;
      var rootRect = this.root.jQ[0].getBoundingClientRect();
      if (!seln) {
        var x = cursor.jQ[0].getBoundingClientRect().left;
        if (x > rootRect.right - 20) var scrollBy = x - (rootRect.right - 20);
        else if (x < rootRect.left + 20) var scrollBy = x - (rootRect.left + 20);
        else return;
      }
      else {
        var rect = seln.jQ[0].getBoundingClientRect();
        var overLeft = rect.left - (rootRect.left + 20);
        var overRight = rect.right - (rootRect.right - 20);
        if (seln.ends[L] === cursor[R]) {
          if (overLeft < 0) var scrollBy = overLeft;
          else if (overRight > 0) {
            if (rect.left - overRight < rootRect.left + 20) var scrollBy = overLeft;
            else var scrollBy = overRight;
          }
          else return;
        }
        else {
          if (overRight > 0) var scrollBy = overRight;
          else if (overLeft < 0) {
            if (rect.right - overLeft > rootRect.right - 20) var scrollBy = overRight;
            else var scrollBy = overLeft;
          }
          else return;
        }
      }
      this.root.jQ.stop().animate({ scrollLeft: '+=' + scrollBy}, 100);
    };
  });
  /*********************************************
   * Manage the MathQuill instance's textarea
   * (as owned by the Controller)
   ********************************************/
  
  Controller.open(function(_) {
    Options.p.substituteTextarea = function() {
      return $('<textarea autocapitalize=off autocomplete=off autocorrect=off ' +
                 'spellcheck=false x-palm-disable-ste-all=true />')[0];
    };
    _.createTextarea = function() {
      var textareaSpan = this.textareaSpan = $('<span class="mq-textarea"></span>'),
        textarea = this.options.substituteTextarea();
      if (textarea && !textarea.nodeType) {
        throw 'substituteTextarea() must return a DOM element, got ' + textarea;
      }
      textarea = this.textarea = textarea && $(textarea).appendTo(textareaSpan);
  
      var ctrlr = this;
      ctrlr.cursor.selectionChanged = function() { ctrlr.selectionChanged(); };
      ctrlr.container.bind('copy', function() { ctrlr.setTextareaSelection(); });
    };
    _.selectionChanged = function() {
      var ctrlr = this;
      forceIERedraw(ctrlr.container[0]);
  
      // throttle calls to setTextareaSelection(), because setting textarea.value
      // and/or calling textarea.select() can have anomalously bad performance:
      // https://github.com/mathquill/mathquill/issues/43#issuecomment-1399080
      if (ctrlr.textareaSelectionTimeout === undefined) {
        ctrlr.textareaSelectionTimeout = setTimeout(function() {
          ctrlr.setTextareaSelection();
        });
      }
    };
    _.setTextareaSelection = function() {
      this.textareaSelectionTimeout = undefined;
      var latex = '';
      if (this.cursor.selection) {
        latex = this.cursor.selection.join('latex');
        if (this.options.statelessClipboard) {
          // FIXME: like paste, only this works for math fields; should ask parent
          latex = '$' + latex + '$';
        }
      }
      this.selectFn(latex);
    };
    _.staticMathTextareaEvents = function() {
      var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor,
        textarea = ctrlr.textarea, textareaSpan = ctrlr.textareaSpan;
  
      this.container.prepend('<span class="mq-selectable">$'+ctrlr.exportLatex()+'$</span>');
      ctrlr.blurred = true;
      textarea.bind('cut paste', false)
      .focus(function() { ctrlr.blurred = false; }).blur(function() {
        if (cursor.selection) cursor.selection.clear();
        setTimeout(detach); //detaching during blur explodes in WebKit
      });
      function detach() {
        textareaSpan.detach();
        ctrlr.blurred = true;
      }
  
      ctrlr.selectFn = function(text) {
        textarea.val(text);
        if (text) textarea.select();
      };
    };
    _.editablesTextareaEvents = function() {
      var ctrlr = this, root = ctrlr.root, cursor = ctrlr.cursor,
        textarea = ctrlr.textarea, textareaSpan = ctrlr.textareaSpan;
  
      var keyboardEventsShim = saneKeyboardEvents(textarea, this);
      this.selectFn = function(text) { keyboardEventsShim.select(text); };
  
      this.container.prepend(textareaSpan)
      .on('cut', function(e) {
        if (cursor.selection) {
          setTimeout(function() {
            ctrlr.notify('edit'); // deletes selection if present
            cursor.parent.bubble('reflow');
          });
        }
      });
  
      this.focusBlurEvents();
    };
    _.typedText = function(ch) {
      if (ch === '\n') return this.handle('enter');
      var cursor = this.notify().cursor;
      cursor.parent.write(cursor, ch);
      this.scrollHoriz();
    };
    _.paste = function(text) {
      // TODO: document `statelessClipboard` config option in README, after
      // making it work like it should, that is, in both text and math mode
      // (currently only works in math fields, so worse than pointless, it
      //  only gets in the way by \text{}-ifying pasted stuff and $-ifying
      //  cut/copied LaTeX)
      if (this.options.statelessClipboard) {
        if (text.slice(0,1) === '$' && text.slice(-1) === '$') {
          text = text.slice(1, -1);
        }
        else {
          text = '\\text{'+text+'}';
        }
      }
      // FIXME: this always inserts math or a TextBlock, even in a RootTextBlock
      this.writeLatex(text).cursor.show();
    };
  });
  /*************************************************
   * Abstract classes of math blocks and commands.
   ************************************************/
  
  /**
   * Math tree node base class.
   * Some math-tree-specific extensions to Node.
   * Both MathBlock's and MathCommand's descend from it.
   */
  var MathElement = P(Node, function(_, super_) {
    _.finalizeInsert = function(options, cursor) { // `cursor` param is only for
        // SupSub::contactWeld, and is deliberately only passed in by writeLatex,
        // see ea7307eb4fac77c149a11ffdf9a831df85247693
      var self = this;
      self.postOrder('finalizeTree', options);
      self.postOrder('contactWeld', cursor);
  
      // note: this order is important.
      // empty elements need the empty box provided by blur to
      // be present in order for their dimensions to be measured
      // correctly by 'reflow' handlers.
      self.postOrder('blur');
  
      self.postOrder('reflow');
      if (self[R].siblingCreated) self[R].siblingCreated(options, L);
      if (self[L].siblingCreated) self[L].siblingCreated(options, R);
      self.bubble('reflow');
    };
  });
  
  /**
   * Commands and operators, like subscripts, exponents, or fractions.
   * Descendant commands are organized into blocks.
   */
  var MathCommand = P(MathElement, function(_, super_) {
    _.init = function(ctrlSeq, htmlTemplate, textTemplate) {
      var cmd = this;
      super_.init.call(cmd);
  
      if (!cmd.ctrlSeq) cmd.ctrlSeq = ctrlSeq;
      if (htmlTemplate) cmd.htmlTemplate = htmlTemplate;
      if (textTemplate) cmd.textTemplate = textTemplate;
    };
  
    // obvious methods
    _.replaces = function(replacedFragment) {
      replacedFragment.disown();
      this.replacedFragment = replacedFragment;
    };
    _.isEmpty = function() {
      return this.foldChildren(true, function(isEmpty, child) {
        return isEmpty && child.isEmpty();
      });
    };
  
    _.parser = function() {
      var block = latexMathParser.block;
      var self = this;
  
      return block.times(self.numBlocks()).map(function(blocks) {
        self.blocks = blocks;
  
        for (var i = 0; i < blocks.length; i += 1) {
          blocks[i].adopt(self, self.ends[R], 0);
        }
  
        return self;
      });
    };
  
    // createLeftOf(cursor) and the methods it calls
    _.createLeftOf = function(cursor) {
      var cmd = this;
      var replacedFragment = cmd.replacedFragment;
  
      cmd.createBlocks();
      super_.createLeftOf.call(cmd, cursor);
      if (replacedFragment) {
        replacedFragment.adopt(cmd.ends[L], 0, 0);
        replacedFragment.jQ.appendTo(cmd.ends[L].jQ);
      }
      cmd.finalizeInsert(cursor.options);
      cmd.placeCursor(cursor);
    };
    _.createBlocks = function() {
      var cmd = this,
        numBlocks = cmd.numBlocks(),
        blocks = cmd.blocks = Array(numBlocks);
  
      for (var i = 0; i < numBlocks; i += 1) {
        var newBlock = blocks[i] = MathBlock();
        newBlock.adopt(cmd, cmd.ends[R], 0);
      }
    };
    _.placeCursor = function(cursor) {
      //insert the cursor at the right end of the first empty child, searching
      //left-to-right, or if none empty, the right end child
      cursor.insAtRightEnd(this.foldChildren(this.ends[L], function(leftward, child) {
        return leftward.isEmpty() ? leftward : child;
      }));
    };
  
    // editability methods: called by the cursor for editing, cursor movements,
    // and selection of the MathQuill tree, these all take in a direction and
    // the cursor
    _.moveTowards = function(dir, cursor, updown) {
      var updownInto = updown && this[updown+'Into'];
      cursor.insAtDirEnd(-dir, updownInto || this.ends[-dir]);
    };
    _.deleteTowards = function(dir, cursor) {
      if (this.isEmpty()) cursor[dir] = this.remove()[dir];
      else this.moveTowards(dir, cursor, null);
    };
    _.selectTowards = function(dir, cursor) {
      cursor[-dir] = this;
      cursor[dir] = this[dir];
    };
    _.selectChildren = function() {
      return Selection(this, this);
    };
    _.unselectInto = function(dir, cursor) {
      cursor.insAtDirEnd(-dir, cursor.anticursor.ancestors[this.id]);
    };
    _.seek = function(pageX, cursor) {
      function getBounds(node) {
        var bounds = {}
        bounds[L] = node.jQ.offset().left;
        bounds[R] = bounds[L] + node.jQ.outerWidth();
        return bounds;
      }
  
      var cmd = this;
      var cmdBounds = getBounds(cmd);
  
      if (pageX < cmdBounds[L]) return cursor.insLeftOf(cmd);
      if (pageX > cmdBounds[R]) return cursor.insRightOf(cmd);
  
      var leftLeftBound = cmdBounds[L];
      cmd.eachChild(function(block) {
        var blockBounds = getBounds(block);
        if (pageX < blockBounds[L]) {
          // closer to this block's left bound, or the bound left of that?
          if (pageX - leftLeftBound < blockBounds[L] - pageX) {
            if (block[L]) cursor.insAtRightEnd(block[L]);
            else cursor.insLeftOf(cmd);
          }
          else cursor.insAtLeftEnd(block);
          return false;
        }
        else if (pageX > blockBounds[R]) {
          if (block[R]) leftLeftBound = blockBounds[R]; // continue to next block
          else { // last (rightmost) block
            // closer to this block's right bound, or the cmd's right bound?
            if (cmdBounds[R] - pageX < pageX - blockBounds[R]) {
              cursor.insRightOf(cmd);
            }
            else cursor.insAtRightEnd(block);
          }
        }
        else {
          block.seek(pageX, cursor);
          return false;
        }
      });
    }
  
    // methods involved in creating and cross-linking with HTML DOM nodes
    /*
      They all expect an .htmlTemplate like
        '<span>&0</span>'
      or
        '<span><span>&0</span><span>&1</span></span>'
  
      See html.test.js for more examples.
  
      Requirements:
      - For each block of the command, there must be exactly one "block content
        marker" of the form '&<number>' where <number> is the 0-based index of the
        block. (Like the LaTeX \newcommand syntax, but with a 0-based rather than
        1-based index, because JavaScript because C because Dijkstra.)
      - The block content marker must be the sole contents of the containing
        element, there can't even be surrounding whitespace, or else we can't
        guarantee sticking to within the bounds of the block content marker when
        mucking with the HTML DOM.
      - The HTML not only must be well-formed HTML (of course), but also must
        conform to the XHTML requirements on tags, specifically all tags must
        either be self-closing (like '<br/>') or come in matching pairs.
        Close tags are never optional.
  
      Note that &<number> isn't well-formed HTML; if you wanted a literal '&123',
      your HTML template would have to have '&amp;123'.
    */
    _.numBlocks = function() {
      var matches = this.htmlTemplate.match(/&\d+/g);
      return matches ? matches.length : 0;
    };
    _.html = function() {
      // Render the entire math subtree rooted at this command, as HTML.
      // Expects .createBlocks() to have been called already, since it uses the
      // .blocks array of child blocks.
      //
      // See html.test.js for example templates and intended outputs.
      //
      // Given an .htmlTemplate as described above,
      // - insert the mathquill-command-id attribute into all top-level tags,
      //   which will be used to set this.jQ in .jQize().
      //   This is straightforward:
      //     * tokenize into tags and non-tags
      //     * loop through top-level tokens:
      //         * add #cmdId attribute macro to top-level self-closing tags
      //         * else add #cmdId attribute macro to top-level open tags
      //             * skip the matching top-level close tag and all tag pairs
      //               in between
      // - for each block content marker,
      //     + replace it with the contents of the corresponding block,
      //       rendered as HTML
      //     + insert the mathquill-block-id attribute into the containing tag
      //   This is even easier, a quick regex replace, since block tags cannot
      //   contain anything besides the block content marker.
      //
      // Two notes:
      // - The outermost loop through top-level tokens should never encounter any
      //   top-level close tags, because we should have first encountered a
      //   matching top-level open tag, all inner tags should have appeared in
      //   matching pairs and been skipped, and then we should have skipped the
      //   close tag in question.
      // - All open tags should have matching close tags, which means our inner
      //   loop should always encounter a close tag and drop nesting to 0. If
      //   a close tag is missing, the loop will continue until i >= tokens.length
      //   and token becomes undefined. This will not infinite loop, even in
      //   production without pray(), because it will then TypeError on .slice().
  
      var cmd = this;
      var blocks = cmd.blocks;
      var cmdId = ' mathquill-command-id=' + cmd.id;
      var tokens = cmd.htmlTemplate.match(/<[^<>]+>|[^<>]+/g);
  
      pray('no unmatched angle brackets', tokens.join('') === this.htmlTemplate);
  
      // add cmdId to all top-level tags
      for (var i = 0, token = tokens[0]; token; i += 1, token = tokens[i]) {
        // top-level self-closing tags
        if (token.slice(-2) === '/>') {
          tokens[i] = token.slice(0,-2) + cmdId + '/>';
        }
        // top-level open tags
        else if (token.charAt(0) === '<') {
          pray('not an unmatched top-level close tag', token.charAt(1) !== '/');
  
          tokens[i] = token.slice(0,-1) + cmdId + '>';
  
          // skip matching top-level close tag and all tag pairs in between
          var nesting = 1;
          do {
            i += 1, token = tokens[i];
            pray('no missing close tags', token);
            // close tags
            if (token.slice(0,2) === '</') {
              nesting -= 1;
            }
            // non-self-closing open tags
            else if (token.charAt(0) === '<' && token.slice(-2) !== '/>') {
              nesting += 1;
            }
          } while (nesting > 0);
        }
      }
      return tokens.join('').replace(/>&(\d+)/g, function($0, $1) {
        return ' mathquill-block-id=' + blocks[$1].id + '>' + blocks[$1].join('html');
      });
    };
  
    // methods to export a string representation of the math tree
    _.latex = function() {
      return this.foldChildren(this.ctrlSeq, function(latex, child) {
        return latex + '{' + (child.latex() || ' ') + '}';
      });
    };
    _.textTemplate = [''];
    _.text = function() {
      var cmd = this, i = 0;
      return cmd.foldChildren(cmd.textTemplate[i], function(text, child) {
        i += 1;
        var child_text = child.text();
        if (text && cmd.textTemplate[i] === '('
            && child_text[0] === '(' && child_text.slice(-1) === ')')
          return text + child_text.slice(1, -1) + cmd.textTemplate[i];
        return text + child.text() + (cmd.textTemplate[i] || '');
      });
    };
  });
  
  /**
   * Lightweight command without blocks or children.
   */
  var Symbol = P(MathCommand, function(_, super_) {
    _.init = function(ctrlSeq, html, text) {
      if (!text) text = ctrlSeq && ctrlSeq.length > 1 ? ctrlSeq.slice(1) : ctrlSeq;
  
      super_.init.call(this, ctrlSeq, html, [ text ]);
    };
  
    _.parser = function() { return Parser.succeed(this); };
    _.numBlocks = function() { return 0; };
  
    _.replaces = function(replacedFragment) {
      replacedFragment.remove();
    };
    _.createBlocks = noop;
  
    _.moveTowards = function(dir, cursor) {
      cursor.jQ.insDirOf(dir, this.jQ);
      cursor[-dir] = this;
      cursor[dir] = this[dir];
    };
    _.deleteTowards = function(dir, cursor) {
      cursor[dir] = this.remove()[dir];
    };
    _.seek = function(pageX, cursor) {
      // insert at whichever side the click was closer to
      if (pageX - this.jQ.offset().left < this.jQ.outerWidth()/2)
        cursor.insLeftOf(this);
      else
        cursor.insRightOf(this);
    };
  
    _.latex = function(){ return this.ctrlSeq; };
    _.text = function(){ return this.textTemplate; };
    _.placeCursor = noop;
    _.isEmpty = function(){ return true; };
  });
  var VanillaSymbol = P(Symbol, function(_, super_) {
    _.init = function(ch, html) {
      super_.init.call(this, ch, '<span>'+(html || ch)+'</span>');
    };
  });
  var BinaryOperator = P(Symbol, function(_, super_) {
    _.init = function(ctrlSeq, html, text) {
      super_.init.call(this,
        ctrlSeq, '<span class="mq-binary-operator">'+html+'</span>', text
      );
    };
  });
  
  /**
   * Children and parent of MathCommand's. Basically partitions all the
   * symbols and operators that descend (in the Math DOM tree) from
   * ancestor operators.
   */
  var MathBlock = P(MathElement, function(_, super_) {
    _.join = function(methodName) {
      return this.foldChildren('', function(fold, child) {
        return fold + child[methodName]();
      });
    };
    _.html = function() { return this.join('html'); };
    _.latex = function() { return this.join('latex'); };
    _.text = function() {
      return (this.ends[L] === this.ends[R] && this.ends[L] !== 0) ?
        this.ends[L].text() :
        this.join('text')
      ;
    };
  
    _.keystroke = function(key, e, ctrlr) {
      if (ctrlr.options.spaceBehavesLikeTab
          && (key === 'Spacebar' || key === 'Shift-Spacebar')) {
        e.preventDefault();
        ctrlr.escapeDir(key === 'Shift-Spacebar' ? L : R, key, e);
        return;
      }
      return super_.keystroke.apply(this, arguments);
    };
  
    // editability methods: called by the cursor for editing, cursor movements,
    // and selection of the MathQuill tree, these all take in a direction and
    // the cursor
    _.moveOutOf = function(dir, cursor, updown) {
      var updownInto = updown && this.parent[updown+'Into'];
      if (!updownInto && this[dir]) cursor.insAtDirEnd(-dir, this[dir]);
      else cursor.insDirOf(dir, this.parent);
    };
    _.selectOutOf = function(dir, cursor) {
      cursor.insDirOf(dir, this.parent);
    };
    _.deleteOutOf = function(dir, cursor) {
      cursor.unwrapGramp();
    };
    _.seek = function(pageX, cursor) {
      var node = this.ends[R];
      if (!node || node.jQ.offset().left + node.jQ.outerWidth() < pageX) {
        return cursor.insAtRightEnd(this);
      }
      if (pageX < this.ends[L].jQ.offset().left) return cursor.insAtLeftEnd(this);
      while (pageX < node.jQ.offset().left) node = node[L];
      return node.seek(pageX, cursor);
    };
    _.chToCmd = function(ch) {
      var cons;
      // exclude f because it gets a dedicated command with more spacing
      if (ch.match(/^[a-eg-zA-Z]$/))
        return Letter(ch);
      else if (/^\d$/.test(ch))
        return Digit(ch);
      else if (cons = CharCmds[ch] || LatexCmds[ch])
        return cons(ch);
      else
        return VanillaSymbol(ch);
    };
    _.write = function(cursor, ch) {
      var cmd = this.chToCmd(ch);
      if (cursor.selection) cmd.replaces(cursor.replaceSelection());
      cmd.createLeftOf(cursor.show());
    };
  
    _.focus = function() {
      this.jQ.addClass('mq-hasCursor');
      this.jQ.removeClass('mq-empty');
  
      return this;
    };
    _.blur = function() {
      this.jQ.removeClass('mq-hasCursor');
      if (this.isEmpty())
        this.jQ.addClass('mq-empty');
  
      return this;
    };
  });
  
  API.StaticMath = function(APIClasses) {
    return P(APIClasses.AbstractMathQuill, function(_, super_) {
      this.RootBlock = MathBlock;
      _.__mathquillify = function() {
        super_.__mathquillify.call(this, 'mq-math-mode');
        this.__controller.delegateMouseEvents();
        this.__controller.staticMathTextareaEvents();
        return this;
      };
      _.init = function() {
        super_.init.apply(this, arguments);
        this.__controller.root.postOrder(
          'registerInnerField', this.innerFields = [], APIClasses.MathField);
      };
      _.latex = function() {
        var returned = super_.latex.apply(this, arguments);
        if (arguments.length > 0) {
          this.__controller.root.postOrder(
            'registerInnerField', this.innerFields = [], APIClasses.MathField);
        }
        return returned;
      };
    });
  };
  
  var RootMathBlock = P(MathBlock, RootBlockMixin);
  API.MathField = function(APIClasses) {
    return P(APIClasses.EditableField, function(_, super_) {
      this.RootBlock = RootMathBlock;
      _.__mathquillify = function(opts, interfaceVersion) {
        this.config(opts);
        if (interfaceVersion > 1) this.__controller.root.reflow = noop;
        super_.__mathquillify.call(this, 'mq-editable-field mq-math-mode');
        delete this.__controller.root.reflow;
        return this;
      };
    });
  };
  /*************************************************
   * Abstract classes of text blocks
   ************************************************/
  
  /**
   * Blocks of plain text, with one or two TextPiece's as children.
   * Represents flat strings of typically serif-font Roman characters, as
   * opposed to hierchical, nested, tree-structured math.
   * Wraps a single HTMLSpanElement.
   */
  var TextBlock = P(Node, function(_, super_) {
    _.ctrlSeq = '\\text';
  
    _.replaces = function(replacedText) {
      if (replacedText instanceof Fragment)
        this.replacedText = replacedText.remove().jQ.text();
      else if (typeof replacedText === 'string')
        this.replacedText = replacedText;
    };
  
    _.jQadd = function(jQ) {
      super_.jQadd.call(this, jQ);
      if (this.ends[L]) this.ends[L].jQadd(this.jQ[0].firstChild);
    };
  
    _.createLeftOf = function(cursor) {
      var textBlock = this;
      super_.createLeftOf.call(this, cursor);
  
      if (textBlock[R].siblingCreated) textBlock[R].siblingCreated(cursor.options, L);
      if (textBlock[L].siblingCreated) textBlock[L].siblingCreated(cursor.options, R);
      textBlock.bubble('reflow');
  
      cursor.insAtRightEnd(textBlock);
  
      if (textBlock.replacedText)
        for (var i = 0; i < textBlock.replacedText.length; i += 1)
          textBlock.write(cursor, textBlock.replacedText.charAt(i));
    };
  
    _.parser = function() {
      var textBlock = this;
  
      // TODO: correctly parse text mode
      var string = Parser.string;
      var regex = Parser.regex;
      var optWhitespace = Parser.optWhitespace;
      return optWhitespace
        .then(string('{')).then(regex(/^[^}]*/)).skip(string('}'))
        .map(function(text) {
          // TODO: is this the correct behavior when parsing
          // the latex \text{} ?  This violates the requirement that
          // the text contents are always nonempty.  Should we just
          // disown the parent node instead?
          TextPiece(text).adopt(textBlock, 0, 0);
          return textBlock;
        })
      ;
    };
  
    _.textContents = function() {
      return this.foldChildren('', function(text, child) {
        return text + child.text;
      });
    };
    _.text = function() { return '"' + this.textContents() + '"'; };
    _.latex = function() { return '\\text{' + this.textContents() + '}'; };
    _.html = function() {
      return (
          '<span class="mq-text-mode" mathquill-command-id='+this.id+'>'
        +   this.textContents()
        + '</span>'
      );
    };
  
    // editability methods: called by the cursor for editing, cursor movements,
    // and selection of the MathQuill tree, these all take in a direction and
    // the cursor
    _.moveTowards = function(dir, cursor) { cursor.insAtDirEnd(-dir, this); };
    _.moveOutOf = function(dir, cursor) { cursor.insDirOf(dir, this); };
    _.unselectInto = _.moveTowards;
  
    // TODO: make these methods part of a shared mixin or something.
    _.selectTowards = MathCommand.prototype.selectTowards;
    _.deleteTowards = MathCommand.prototype.deleteTowards;
  
    _.selectOutOf = function(dir, cursor) {
      cursor.insDirOf(dir, this);
    };
    _.deleteOutOf = function(dir, cursor) {
      // backspace and delete at ends of block don't unwrap
      if (this.isEmpty()) cursor.insRightOf(this);
    };
    _.write = function(cursor, ch) {
      cursor.show().deleteSelection();
  
      if (ch !== '$') {
        if (!cursor[L]) TextPiece(ch).createLeftOf(cursor);
        else cursor[L].appendText(ch);
      }
      else if (this.isEmpty()) {
        cursor.insRightOf(this);
        VanillaSymbol('\\$','$').createLeftOf(cursor);
      }
      else if (!cursor[R]) cursor.insRightOf(this);
      else if (!cursor[L]) cursor.insLeftOf(this);
      else { // split apart
        var leftBlock = TextBlock();
        var leftPc = this.ends[L];
        leftPc.disown();
        leftPc.adopt(leftBlock, 0, 0);
  
        cursor.insLeftOf(this);
        super_.createLeftOf.call(leftBlock, cursor);
      }
    };
  
    _.seek = function(pageX, cursor) {
      cursor.hide();
      var textPc = fuseChildren(this);
  
      // insert cursor at approx position in DOMTextNode
      var avgChWidth = this.jQ.width()/this.text.length;
      var approxPosition = Math.round((pageX - this.jQ.offset().left)/avgChWidth);
      if (approxPosition <= 0) cursor.insAtLeftEnd(this);
      else if (approxPosition >= textPc.text.length) cursor.insAtRightEnd(this);
      else cursor.insLeftOf(textPc.splitRight(approxPosition));
  
      // move towards mousedown (pageX)
      var displ = pageX - cursor.show().offset().left; // displacement
      var dir = displ && displ < 0 ? L : R;
      var prevDispl = dir;
      // displ * prevDispl > 0 iff displacement direction === previous direction
      while (cursor[dir] && displ * prevDispl > 0) {
        cursor[dir].moveTowards(dir, cursor);
        prevDispl = displ;
        displ = pageX - cursor.offset().left;
      }
      if (dir*displ < -dir*prevDispl) cursor[-dir].moveTowards(-dir, cursor);
  
      if (!cursor.anticursor) {
        // about to start mouse-selecting, the anticursor is gonna get put here
        this.anticursorPosition = cursor[L] && cursor[L].text.length;
        // ^ get it? 'cos if there's no cursor[L], it's 0... I'm a terrible person.
      }
      else if (cursor.anticursor.parent === this) {
        // mouse-selecting within this TextBlock, re-insert the anticursor
        var cursorPosition = cursor[L] && cursor[L].text.length;;
        if (this.anticursorPosition === cursorPosition) {
          cursor.anticursor = Point.copy(cursor);
        }
        else {
          if (this.anticursorPosition < cursorPosition) {
            var newTextPc = cursor[L].splitRight(this.anticursorPosition);
            cursor[L] = newTextPc;
          }
          else {
            var newTextPc = cursor[R].splitRight(this.anticursorPosition - cursorPosition);
          }
          cursor.anticursor = Point(this, newTextPc[L], newTextPc);
        }
      }
    };
  
    _.blur = function() {
      MathBlock.prototype.blur.call(this);
      fuseChildren(this);
    };
  
    function fuseChildren(self) {
      self.jQ[0].normalize();
  
      var textPcDom = self.jQ[0].firstChild;
      pray('only node in TextBlock span is Text node', textPcDom.nodeType === 3);
      // nodeType === 3 has meant a Text node since ancient times:
      //   http://reference.sitepoint.com/javascript/Node/nodeType
  
      var textPc = TextPiece(textPcDom.data);
      textPc.jQadd(textPcDom);
  
      self.children().disown();
      return textPc.adopt(self, 0, 0);
    }
  
    _.focus = MathBlock.prototype.focus;
  });
  
  /**
   * Piece of plain text, with a TextBlock as a parent and no children.
   * Wraps a single DOMTextNode.
   * For convenience, has a .text property that's just a JavaScript string
   * mirroring the text contents of the DOMTextNode.
   * Text contents must always be nonempty.
   */
  var TextPiece = P(Node, function(_, super_) {
    _.init = function(text) {
      super_.init.call(this);
      this.text = text;
    };
    _.jQadd = function(dom) { this.dom = dom; this.jQ = $(dom); };
    _.jQize = function() {
      return this.jQadd(document.createTextNode(this.text));
    };
    _.appendText = function(text) {
      this.text += text;
      this.dom.appendData(text);
    };
    _.prependText = function(text) {
      this.text = text + this.text;
      this.dom.insertData(0, text);
    };
    _.insTextAtDirEnd = function(text, dir) {
      prayDirection(dir);
      if (dir === R) this.appendText(text);
      else this.prependText(text);
    };
    _.splitRight = function(i) {
      var newPc = TextPiece(this.text.slice(i)).adopt(this.parent, this, this[R]);
      newPc.jQadd(this.dom.splitText(i));
      this.text = this.text.slice(0, i);
      return newPc;
    };
  
    function endChar(dir, text) {
      return text.charAt(dir === L ? 0 : -1 + text.length);
    }
  
    _.moveTowards = function(dir, cursor) {
      prayDirection(dir);
  
      var ch = endChar(-dir, this.text)
  
      var from = this[-dir];
      if (from) from.insTextAtDirEnd(ch, dir);
      else TextPiece(ch).createDir(-dir, cursor);
  
      return this.deleteTowards(dir, cursor);
    };
  
    _.latex = function() { return this.text; };
  
    _.deleteTowards = function(dir, cursor) {
      if (this.text.length > 1) {
        if (dir === R) {
          this.dom.deleteData(0, 1);
          this.text = this.text.slice(1);
        }
        else {
          // note that the order of these 2 lines is annoyingly important
          // (the second line mutates this.text.length)
          this.dom.deleteData(-1 + this.text.length, 1);
          this.text = this.text.slice(0, -1);
        }
      }
      else {
        this.remove();
        this.jQ.remove();
        cursor[dir] = this[dir];
      }
    };
  
    _.selectTowards = function(dir, cursor) {
      prayDirection(dir);
      var anticursor = cursor.anticursor;
  
      var ch = endChar(-dir, this.text)
  
      if (anticursor[dir] === this) {
        var newPc = TextPiece(ch).createDir(dir, cursor);
        anticursor[dir] = newPc;
        cursor.insDirOf(dir, newPc);
      }
      else {
        var from = this[-dir];
        if (from) from.insTextAtDirEnd(ch, dir);
        else {
          var newPc = TextPiece(ch).createDir(-dir, cursor);
          newPc.jQ.insDirOf(-dir, cursor.selection.jQ);
        }
  
        if (this.text.length === 1 && anticursor[-dir] === this) {
          anticursor[-dir] = this[-dir]; // `this` will be removed in deleteTowards
        }
      }
  
      return this.deleteTowards(dir, cursor);
    };
  });
  
  CharCmds.$ =
  LatexCmds.text =
  LatexCmds.textnormal =
  LatexCmds.textrm =
  LatexCmds.textup =
  LatexCmds.textmd = TextBlock;
  
  function makeTextBlock(latex, tagName, attrs) {
    return P(TextBlock, {
      ctrlSeq: latex,
      htmlTemplate: '<'+tagName+' '+attrs+'>&0</'+tagName+'>'
    });
  }
  
  LatexCmds.em = LatexCmds.italic = LatexCmds.italics =
  LatexCmds.emph = LatexCmds.textit = LatexCmds.textsl =
    makeTextBlock('\\textit', 'i', 'class="mq-text-mode"');
  LatexCmds.strong = LatexCmds.bold = LatexCmds.textbf =
    makeTextBlock('\\textbf', 'b', 'class="mq-text-mode"');
  LatexCmds.sf = LatexCmds.textsf =
    makeTextBlock('\\textsf', 'span', 'class="mq-sans-serif mq-text-mode"');
  LatexCmds.tt = LatexCmds.texttt =
    makeTextBlock('\\texttt', 'span', 'class="mq-monospace mq-text-mode"');
  LatexCmds.textsc =
    makeTextBlock('\\textsc', 'span', 'style="font-variant:small-caps" class="mq-text-mode"');
  LatexCmds.uppercase =
    makeTextBlock('\\uppercase', 'span', 'style="text-transform:uppercase" class="mq-text-mode"');
  LatexCmds.lowercase =
    makeTextBlock('\\lowercase', 'span', 'style="text-transform:lowercase" class="mq-text-mode"');
  
  
  var RootMathCommand = P(MathCommand, function(_, super_) {
    _.init = function(cursor) {
      super_.init.call(this, '$');
      this.cursor = cursor;
    };
    _.htmlTemplate = '<span class="mq-math-mode">&0</span>';
    _.createBlocks = function() {
      super_.createBlocks.call(this);
  
      this.ends[L].cursor = this.cursor;
      this.ends[L].write = function(cursor, ch) {
        if (ch !== '$')
          MathBlock.prototype.write.call(this, cursor, ch);
        else if (this.isEmpty()) {
          cursor.insRightOf(this.parent);
          this.parent.deleteTowards(dir, cursor);
          VanillaSymbol('\\$','$').createLeftOf(cursor.show());
        }
        else if (!cursor[R])
          cursor.insRightOf(this.parent);
        else if (!cursor[L])
          cursor.insLeftOf(this.parent);
        else
          MathBlock.prototype.write.call(this, cursor, ch);
      };
    };
    _.latex = function() {
      return '$' + this.ends[L].latex() + '$';
    };
  });
  
  var RootTextBlock = P(RootMathBlock, function(_, super_) {
    _.keystroke = function(key) {
      if (key === 'Spacebar' || key === 'Shift-Spacebar') return;
      return super_.keystroke.apply(this, arguments);
    };
    _.write = function(cursor, ch) {
      cursor.show().deleteSelection();
      if (ch === '$')
        RootMathCommand(cursor).createLeftOf(cursor);
      else {
        var html;
        if (ch === '<') html = '&lt;';
        else if (ch === '>') html = '&gt;';
        VanillaSymbol(ch, html).createLeftOf(cursor);
      }
    };
  });
  API.TextField = function(APIClasses) {
    return P(APIClasses.EditableField, function(_, super_) {
      this.RootBlock = RootTextBlock;
      _.__mathquillify = function() {
        return super_.__mathquillify.call(this, 'mq-editable-field mq-text-mode');
      };
      _.latex = function(latex) {
        if (arguments.length > 0) {
          this.__controller.renderLatexText(latex);
          if (this.__controller.blurred) this.__controller.cursor.hide().parent.blur();
          return this;
        }
        return this.__controller.exportLatex();
      };
    });
  };
  /****************************************
   * Input box to type backslash commands
   ***************************************/
  
  var LatexCommandInput =
  CharCmds['\\'] = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\';
    _.replaces = function(replacedFragment) {
      this._replacedFragment = replacedFragment.disown();
      this.isEmpty = function() { return false; };
    };
    _.htmlTemplate = '<span class="mq-latex-command-input mq-non-leaf">\\<span>&0</span></span>';
    _.textTemplate = ['\\'];
    _.createBlocks = function() {
      super_.createBlocks.call(this);
      this.ends[L].focus = function() {
        this.parent.jQ.addClass('mq-hasCursor');
        if (this.isEmpty())
          this.parent.jQ.removeClass('mq-empty');
  
        return this;
      };
      this.ends[L].blur = function() {
        this.parent.jQ.removeClass('mq-hasCursor');
        if (this.isEmpty())
          this.parent.jQ.addClass('mq-empty');
  
        return this;
      };
      this.ends[L].write = function(cursor, ch) {
        cursor.show().deleteSelection();
  
        if (ch.match(/[a-z]/i)) VanillaSymbol(ch).createLeftOf(cursor);
        else {
          this.parent.renderCommand(cursor);
          if (ch !== '\\' || !this.isEmpty()) this.parent.parent.write(cursor, ch);
        }
      };
      this.ends[L].keystroke = function(key, e, ctrlr) {
        if (key === 'Tab' || key === 'Enter' || key === 'Spacebar') {
          this.parent.renderCommand(ctrlr.cursor);
          e.preventDefault();
          return;
        }
        return super_.keystroke.apply(this, arguments);
      };
    };
    _.createLeftOf = function(cursor) {
      super_.createLeftOf.call(this, cursor);
  
      if (this._replacedFragment) {
        var el = this.jQ[0];
        this.jQ =
          this._replacedFragment.jQ.addClass('mq-blur').bind(
            'mousedown mousemove', //FIXME: is monkey-patching the mousedown and mousemove handlers the right way to do this?
            function(e) {
              $(e.target = el).trigger(e);
              return false;
            }
          ).insertBefore(this.jQ).add(this.jQ);
      }
    };
    _.latex = function() {
      return '\\' + this.ends[L].latex() + ' ';
    };
    _.renderCommand = function(cursor) {
      this.jQ = this.jQ.last();
      this.remove();
      if (this[R]) {
        cursor.insLeftOf(this[R]);
      } else {
        cursor.insAtRightEnd(this.parent);
      }
  
      var latex = this.ends[L].latex();
      if (!latex) latex = ' ';
      var cmd = LatexCmds[latex];
      if (cmd) {
        cmd = cmd(latex);
        if (this._replacedFragment) cmd.replaces(this._replacedFragment);
        cmd.createLeftOf(cursor);
      }
      else {
        cmd = TextBlock();
        cmd.replaces(latex);
        cmd.createLeftOf(cursor);
        cursor.insRightOf(cmd);
        if (this._replacedFragment)
          this._replacedFragment.remove();
      }
    };
  });
  
  /************************************
   * Symbols for Advanced Mathematics
   ***********************************/
  
  LatexCmds.notin =
  LatexCmds.cong =
  LatexCmds.equiv =
  LatexCmds.oplus =
  LatexCmds.otimes = P(BinaryOperator, function(_, super_) {
    _.init = function(latex) {
      super_.init.call(this, '\\'+latex+' ', '&'+latex+';');
    };
  });
  
  LatexCmds['\u2260'] = LatexCmds.ne = LatexCmds.neq = bind(BinaryOperator,'\\ne ','&ne;');
  
  LatexCmds.ast = LatexCmds.star = LatexCmds.loast = LatexCmds.lowast =
    bind(BinaryOperator,'\\ast ','&lowast;');
    //case 'there4 = // a special exception for this one, perhaps?
  LatexCmds.therefor = LatexCmds.therefore =
    bind(BinaryOperator,'\\therefore ','&there4;');
  
  LatexCmds.cuz = // l33t
  LatexCmds.because = bind(BinaryOperator,'\\because ','&#8757;');
  
  LatexCmds.prop = LatexCmds.propto = bind(BinaryOperator,'\\propto ','&prop;');
  
  LatexCmds['\u2248'] = LatexCmds.asymp = LatexCmds.approx = bind(BinaryOperator,'\\approx ','&asymp;');
  
  LatexCmds.isin = LatexCmds['in'] = bind(BinaryOperator,'\\in ','&isin;');
  
  LatexCmds.ni = LatexCmds.contains = bind(BinaryOperator,'\\ni ','&ni;');
  
  LatexCmds.notni = LatexCmds.niton = LatexCmds.notcontains = LatexCmds.doesnotcontain =
    bind(BinaryOperator,'\\not\\ni ','&#8716;');
  
  LatexCmds.sub = LatexCmds.subset = bind(BinaryOperator,'\\subset ','&sub;');
  
  LatexCmds.sup = LatexCmds.supset = LatexCmds.superset =
    bind(BinaryOperator,'\\supset ','&sup;');
  
  LatexCmds.nsub = LatexCmds.notsub =
  LatexCmds.nsubset = LatexCmds.notsubset =
    bind(BinaryOperator,'\\not\\subset ','&#8836;');
  
  LatexCmds.nsup = LatexCmds.notsup =
  LatexCmds.nsupset = LatexCmds.notsupset =
  LatexCmds.nsuperset = LatexCmds.notsuperset =
    bind(BinaryOperator,'\\not\\supset ','&#8837;');
  
  LatexCmds.sube = LatexCmds.subeq = LatexCmds.subsete = LatexCmds.subseteq =
    bind(BinaryOperator,'\\subseteq ','&sube;');
  
  LatexCmds.supe = LatexCmds.supeq =
  LatexCmds.supsete = LatexCmds.supseteq =
  LatexCmds.supersete = LatexCmds.superseteq =
    bind(BinaryOperator,'\\supseteq ','&supe;');
  
  LatexCmds.nsube = LatexCmds.nsubeq =
  LatexCmds.notsube = LatexCmds.notsubeq =
  LatexCmds.nsubsete = LatexCmds.nsubseteq =
  LatexCmds.notsubsete = LatexCmds.notsubseteq =
    bind(BinaryOperator,'\\not\\subseteq ','&#8840;');
  
  LatexCmds.nsupe = LatexCmds.nsupeq =
  LatexCmds.notsupe = LatexCmds.notsupeq =
  LatexCmds.nsupsete = LatexCmds.nsupseteq =
  LatexCmds.notsupsete = LatexCmds.notsupseteq =
  LatexCmds.nsupersete = LatexCmds.nsuperseteq =
  LatexCmds.notsupersete = LatexCmds.notsuperseteq =
    bind(BinaryOperator,'\\not\\supseteq ','&#8841;');
  
  
  //the canonical sets of numbers
  LatexCmds.N = LatexCmds.naturals = LatexCmds.Naturals =
    bind(VanillaSymbol,'\\mathbb{N}','&#8469;');
  
  LatexCmds.P =
  LatexCmds.primes = LatexCmds.Primes =
  LatexCmds.projective = LatexCmds.Projective =
  LatexCmds.probability = LatexCmds.Probability =
    bind(VanillaSymbol,'\\mathbb{P}','&#8473;');
  
  LatexCmds.Z = LatexCmds.integers = LatexCmds.Integers =
    bind(VanillaSymbol,'\\mathbb{Z}','&#8484;');
  
  LatexCmds.Q = LatexCmds.rationals = LatexCmds.Rationals =
    bind(VanillaSymbol,'\\mathbb{Q}','&#8474;');
  
  LatexCmds.R = LatexCmds.reals = LatexCmds.Reals =
    bind(VanillaSymbol,'\\mathbb{R}','&#8477;');
  
  LatexCmds.C =
  LatexCmds.complex = LatexCmds.Complex =
  LatexCmds.complexes = LatexCmds.Complexes =
  LatexCmds.complexplane = LatexCmds.Complexplane = LatexCmds.ComplexPlane =
    bind(VanillaSymbol,'\\mathbb{C}','&#8450;');
  
  LatexCmds.H = LatexCmds.Hamiltonian = LatexCmds.quaternions = LatexCmds.Quaternions =
    bind(VanillaSymbol,'\\mathbb{H}','&#8461;');
  
  //spacing
  LatexCmds.quad = LatexCmds.emsp = bind(VanillaSymbol,'\\quad ','    ');
  LatexCmds.qquad = bind(VanillaSymbol,'\\qquad ','        ');
  /* spacing special characters, gonna have to implement this in LatexCommandInput::onText somehow
  case ',':
    return VanillaSymbol('\\, ',' ');
  case ':':
    return VanillaSymbol('\\: ','  ');
  case ';':
    return VanillaSymbol('\\; ','   ');
  case '!':
    return Symbol('\\! ','<span style="margin-right:-.2em"></span>');
  */
  
  //binary operators
  LatexCmds.diamond = bind(VanillaSymbol, '\\diamond ', '&#9671;');
  LatexCmds.bigtriangleup = bind(VanillaSymbol, '\\bigtriangleup ', '&#9651;');
  LatexCmds.ominus = bind(VanillaSymbol, '\\ominus ', '&#8854;');
  LatexCmds.uplus = bind(VanillaSymbol, '\\uplus ', '&#8846;');
  LatexCmds.bigtriangledown = bind(VanillaSymbol, '\\bigtriangledown ', '&#9661;');
  LatexCmds.sqcap = bind(VanillaSymbol, '\\sqcap ', '&#8851;');
  LatexCmds.triangleleft = bind(VanillaSymbol, '\\triangleleft ', '&#8882;');
  LatexCmds.sqcup = bind(VanillaSymbol, '\\sqcup ', '&#8852;');
  LatexCmds.triangleright = bind(VanillaSymbol, '\\triangleright ', '&#8883;');
  //circledot is not a not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
  LatexCmds.odot = LatexCmds.circledot = bind(VanillaSymbol, '\\odot ', '&#8857;');
  LatexCmds.bigcirc = bind(VanillaSymbol, '\\bigcirc ', '&#9711;');
  LatexCmds.dagger = bind(VanillaSymbol, '\\dagger ', '&#0134;');
  LatexCmds.ddagger = bind(VanillaSymbol, '\\ddagger ', '&#135;');
  LatexCmds.wr = bind(VanillaSymbol, '\\wr ', '&#8768;');
  LatexCmds.amalg = bind(VanillaSymbol, '\\amalg ', '&#8720;');
  
  //relationship symbols
  LatexCmds.models = bind(VanillaSymbol, '\\models ', '&#8872;');
  LatexCmds.prec = bind(VanillaSymbol, '\\prec ', '&#8826;');
  LatexCmds.succ = bind(VanillaSymbol, '\\succ ', '&#8827;');
  LatexCmds.preceq = bind(VanillaSymbol, '\\preceq ', '&#8828;');
  LatexCmds.succeq = bind(VanillaSymbol, '\\succeq ', '&#8829;');
  LatexCmds.simeq = bind(VanillaSymbol, '\\simeq ', '&#8771;');
  LatexCmds.mid = bind(VanillaSymbol, '\\mid ', '&#8739;');
  LatexCmds.ll = bind(VanillaSymbol, '\\ll ', '&#8810;');
  LatexCmds.gg = bind(VanillaSymbol, '\\gg ', '&#8811;');
  LatexCmds.parallel = bind(VanillaSymbol, '\\parallel ', '&#8741;');
  LatexCmds.nparallel = bind(VanillaSymbol, '\\nparallel ', '&#8742;');
  LatexCmds.bowtie = bind(VanillaSymbol, '\\bowtie ', '&#8904;');
  LatexCmds.sqsubset = bind(VanillaSymbol, '\\sqsubset ', '&#8847;');
  LatexCmds.sqsupset = bind(VanillaSymbol, '\\sqsupset ', '&#8848;');
  LatexCmds.smile = bind(VanillaSymbol, '\\smile ', '&#8995;');
  LatexCmds.sqsubseteq = bind(VanillaSymbol, '\\sqsubseteq ', '&#8849;');
  LatexCmds.sqsupseteq = bind(VanillaSymbol, '\\sqsupseteq ', '&#8850;');
  LatexCmds.doteq = bind(VanillaSymbol, '\\doteq ', '&#8784;');
  LatexCmds.frown = bind(VanillaSymbol, '\\frown ', '&#8994;');
  LatexCmds.vdash = bind(VanillaSymbol, '\\vdash ', '&#8870;');
  LatexCmds.dashv = bind(VanillaSymbol, '\\dashv ', '&#8867;');
  LatexCmds.nless = bind(VanillaSymbol, '\\nless ', '&#8814;');
  LatexCmds.ngtr = bind(VanillaSymbol, '\\ngtr ', '&#8815;');
  
  //arrows
  LatexCmds.longleftarrow = bind(VanillaSymbol, '\\longleftarrow ', '&#8592;');
  LatexCmds.longrightarrow = bind(VanillaSymbol, '\\longrightarrow ', '&#8594;');
  LatexCmds.Longleftarrow = bind(VanillaSymbol, '\\Longleftarrow ', '&#8656;');
  LatexCmds.Longrightarrow = bind(VanillaSymbol, '\\Longrightarrow ', '&#8658;');
  LatexCmds.longleftrightarrow = bind(VanillaSymbol, '\\longleftrightarrow ', '&#8596;');
  LatexCmds.updownarrow = bind(VanillaSymbol, '\\updownarrow ', '&#8597;');
  LatexCmds.Longleftrightarrow = bind(VanillaSymbol, '\\Longleftrightarrow ', '&#8660;');
  LatexCmds.Updownarrow = bind(VanillaSymbol, '\\Updownarrow ', '&#8661;');
  LatexCmds.mapsto = bind(VanillaSymbol, '\\mapsto ', '&#8614;');
  LatexCmds.nearrow = bind(VanillaSymbol, '\\nearrow ', '&#8599;');
  LatexCmds.hookleftarrow = bind(VanillaSymbol, '\\hookleftarrow ', '&#8617;');
  LatexCmds.hookrightarrow = bind(VanillaSymbol, '\\hookrightarrow ', '&#8618;');
  LatexCmds.searrow = bind(VanillaSymbol, '\\searrow ', '&#8600;');
  LatexCmds.leftharpoonup = bind(VanillaSymbol, '\\leftharpoonup ', '&#8636;');
  LatexCmds.rightharpoonup = bind(VanillaSymbol, '\\rightharpoonup ', '&#8640;');
  LatexCmds.swarrow = bind(VanillaSymbol, '\\swarrow ', '&#8601;');
  LatexCmds.leftharpoondown = bind(VanillaSymbol, '\\leftharpoondown ', '&#8637;');
  LatexCmds.rightharpoondown = bind(VanillaSymbol, '\\rightharpoondown ', '&#8641;');
  LatexCmds.nwarrow = bind(VanillaSymbol, '\\nwarrow ', '&#8598;');
  
  //Misc
  LatexCmds.ldots = bind(VanillaSymbol, '\\ldots ', '&#8230;');
  LatexCmds.cdots = bind(VanillaSymbol, '\\cdots ', '&#8943;');
  LatexCmds.vdots = bind(VanillaSymbol, '\\vdots ', '&#8942;');
  LatexCmds.ddots = bind(VanillaSymbol, '\\ddots ', '&#8945;');
  LatexCmds.surd = bind(VanillaSymbol, '\\surd ', '&#8730;');
  LatexCmds.triangle = bind(VanillaSymbol, '\\triangle ', '&#9651;');
  LatexCmds.ell = bind(VanillaSymbol, '\\ell ', '&#8467;');
  LatexCmds.top = bind(VanillaSymbol, '\\top ', '&#8868;');
  LatexCmds.flat = bind(VanillaSymbol, '\\flat ', '&#9837;');
  LatexCmds.natural = bind(VanillaSymbol, '\\natural ', '&#9838;');
  LatexCmds.sharp = bind(VanillaSymbol, '\\sharp ', '&#9839;');
  LatexCmds.wp = bind(VanillaSymbol, '\\wp ', '&#8472;');
  LatexCmds.bot = bind(VanillaSymbol, '\\bot ', '&#8869;');
  LatexCmds.clubsuit = bind(VanillaSymbol, '\\clubsuit ', '&#9827;');
  LatexCmds.diamondsuit = bind(VanillaSymbol, '\\diamondsuit ', '&#9826;');
  LatexCmds.heartsuit = bind(VanillaSymbol, '\\heartsuit ', '&#9825;');
  LatexCmds.spadesuit = bind(VanillaSymbol, '\\spadesuit ', '&#9824;');
  //not real LaTex command see https://github.com/mathquill/mathquill/pull/552 for more details
  LatexCmds.parallelogram = bind(VanillaSymbol, '\\parallelogram ', '&#9649;');
  LatexCmds.square = bind(VanillaSymbol, '\\square ', '&#11036;');
  
  //variable-sized
  LatexCmds.oint = bind(VanillaSymbol, '\\oint ', '&#8750;');
  LatexCmds.bigcap = bind(VanillaSymbol, '\\bigcap ', '&#8745;');
  LatexCmds.bigcup = bind(VanillaSymbol, '\\bigcup ', '&#8746;');
  LatexCmds.bigsqcup = bind(VanillaSymbol, '\\bigsqcup ', '&#8852;');
  LatexCmds.bigvee = bind(VanillaSymbol, '\\bigvee ', '&#8744;');
  LatexCmds.bigwedge = bind(VanillaSymbol, '\\bigwedge ', '&#8743;');
  LatexCmds.bigodot = bind(VanillaSymbol, '\\bigodot ', '&#8857;');
  LatexCmds.bigotimes = bind(VanillaSymbol, '\\bigotimes ', '&#8855;');
  LatexCmds.bigoplus = bind(VanillaSymbol, '\\bigoplus ', '&#8853;');
  LatexCmds.biguplus = bind(VanillaSymbol, '\\biguplus ', '&#8846;');
  
  //delimiters
  LatexCmds.lfloor = bind(VanillaSymbol, '\\lfloor ', '&#8970;');
  LatexCmds.rfloor = bind(VanillaSymbol, '\\rfloor ', '&#8971;');
  LatexCmds.lceil = bind(VanillaSymbol, '\\lceil ', '&#8968;');
  LatexCmds.rceil = bind(VanillaSymbol, '\\rceil ', '&#8969;');
  LatexCmds.opencurlybrace = LatexCmds.lbrace = bind(VanillaSymbol, '\\lbrace ', '{');
  LatexCmds.closecurlybrace = LatexCmds.rbrace = bind(VanillaSymbol, '\\rbrace ', '}');
  LatexCmds.lbrack = bind(VanillaSymbol, '[');
  LatexCmds.rbrack = bind(VanillaSymbol, ']');
  
  //various symbols
  LatexCmds['\u222b'] =
  LatexCmds['int'] =
  LatexCmds.integral = bind(Symbol,'\\int ','<big>&int;</big>');
  
  LatexCmds.slash = bind(VanillaSymbol, '/');
  LatexCmds.vert = bind(VanillaSymbol,'|');
  LatexCmds.perp = LatexCmds.perpendicular = bind(VanillaSymbol,'\\perp ','&perp;');
  LatexCmds.nabla = LatexCmds.del = bind(VanillaSymbol,'\\nabla ','&nabla;');
  LatexCmds.hbar = bind(VanillaSymbol,'\\hbar ','&#8463;');
  
  LatexCmds.AA = LatexCmds.Angstrom = LatexCmds.angstrom =
    bind(VanillaSymbol,'\\text\\AA ','&#8491;');
  
  LatexCmds.ring = LatexCmds.circ = LatexCmds.circle =
    bind(VanillaSymbol,'\\circ ','&#8728;');
  
  LatexCmds.bull = LatexCmds.bullet = bind(VanillaSymbol,'\\bullet ','&bull;');
  
  LatexCmds.setminus = LatexCmds.smallsetminus =
    bind(VanillaSymbol,'\\setminus ','&#8726;');
  
  LatexCmds.not = //bind(Symbol,'\\not ','<span class="not">/</span>');
  LatexCmds['\u00ac'] = LatexCmds.neg = bind(VanillaSymbol,'\\neg ','&not;');
  
  LatexCmds['\u2026'] = LatexCmds.dots = LatexCmds.ellip = LatexCmds.hellip =
  LatexCmds.ellipsis = LatexCmds.hellipsis =
    bind(VanillaSymbol,'\\dots ','&hellip;');
  
  LatexCmds.converges =
  LatexCmds.darr = LatexCmds.dnarr = LatexCmds.dnarrow = LatexCmds.downarrow =
    bind(VanillaSymbol,'\\downarrow ','&darr;');
  
  LatexCmds.dArr = LatexCmds.dnArr = LatexCmds.dnArrow = LatexCmds.Downarrow =
    bind(VanillaSymbol,'\\Downarrow ','&dArr;');
  
  LatexCmds.diverges = LatexCmds.uarr = LatexCmds.uparrow =
    bind(VanillaSymbol,'\\uparrow ','&uarr;');
  
  LatexCmds.uArr = LatexCmds.Uparrow = bind(VanillaSymbol,'\\Uparrow ','&uArr;');
  
  LatexCmds.to = bind(BinaryOperator,'\\to ','&rarr;');
  
  LatexCmds.rarr = LatexCmds.rightarrow = bind(VanillaSymbol,'\\rightarrow ','&rarr;');
  
  LatexCmds.implies = bind(BinaryOperator,'\\Rightarrow ','&rArr;');
  
  LatexCmds.rArr = LatexCmds.Rightarrow = bind(VanillaSymbol,'\\Rightarrow ','&rArr;');
  
  LatexCmds.gets = bind(BinaryOperator,'\\gets ','&larr;');
  
  LatexCmds.larr = LatexCmds.leftarrow = bind(VanillaSymbol,'\\leftarrow ','&larr;');
  
  LatexCmds.impliedby = bind(BinaryOperator,'\\Leftarrow ','&lArr;');
  
  LatexCmds.lArr = LatexCmds.Leftarrow = bind(VanillaSymbol,'\\Leftarrow ','&lArr;');
  
  LatexCmds.harr = LatexCmds.lrarr = LatexCmds.leftrightarrow =
    bind(VanillaSymbol,'\\leftrightarrow ','&harr;');
  
  LatexCmds.iff = bind(BinaryOperator,'\\Leftrightarrow ','&hArr;');
  
  LatexCmds.hArr = LatexCmds.lrArr = LatexCmds.Leftrightarrow =
    bind(VanillaSymbol,'\\Leftrightarrow ','&hArr;');
  
  LatexCmds.Re = LatexCmds.Real = LatexCmds.real = bind(VanillaSymbol,'\\Re ','&real;');
  
  LatexCmds.Im = LatexCmds.imag =
  LatexCmds.image = LatexCmds.imagin = LatexCmds.imaginary = LatexCmds.Imaginary =
    bind(VanillaSymbol,'\\Im ','&image;');
  
  LatexCmds.part = LatexCmds.partial = bind(VanillaSymbol,'\\partial ','&part;');
  
  LatexCmds.infty = LatexCmds.infin = LatexCmds.infinity =
    bind(VanillaSymbol,'\\infty ','&infin;');
  
  LatexCmds.alef = LatexCmds.alefsym = LatexCmds.aleph = LatexCmds.alephsym =
    bind(VanillaSymbol,'\\aleph ','&alefsym;');
  
  LatexCmds.xist = //LOL
  LatexCmds.xists = LatexCmds.exist = LatexCmds.exists =
    bind(VanillaSymbol,'\\exists ','&exist;');
  
  LatexCmds.and = LatexCmds.land = LatexCmds.wedge =
    bind(VanillaSymbol,'\\wedge ','&and;');
  
  LatexCmds.or = LatexCmds.lor = LatexCmds.vee = bind(VanillaSymbol,'\\vee ','&or;');
  
  LatexCmds.o = LatexCmds.O =
  LatexCmds.empty = LatexCmds.emptyset =
  LatexCmds.oslash = LatexCmds.Oslash =
  LatexCmds.nothing = LatexCmds.varnothing =
    bind(BinaryOperator,'\\varnothing ','&empty;');
  
  LatexCmds.cup = LatexCmds.union = bind(BinaryOperator,'\\cup ','&cup;');
  
  LatexCmds.cap = LatexCmds.intersect = LatexCmds.intersection =
    bind(BinaryOperator,'\\cap ','&cap;');
  
  // FIXME: the correct LaTeX would be ^\circ but we can't parse that
  LatexCmds.deg = LatexCmds.degree = bind(VanillaSymbol,'\\degree ','&deg;');
  
  LatexCmds.ang = LatexCmds.angle = bind(VanillaSymbol,'\\angle ','&ang;');
  LatexCmds.measuredangle = bind(VanillaSymbol,'\\measuredangle ','&#8737;');
  /*********************************
   * Symbols for Basic Mathematics
   ********************************/
  
  var Digit = P(VanillaSymbol, function(_, super_) {
    _.createLeftOf = function(cursor) {
      if (cursor.options.autoSubscriptNumerals
          && cursor.parent !== cursor.parent.parent.sub
          && ((cursor[L] instanceof Variable && cursor[L].isItalic !== false)
              || (cursor[L] instanceof SupSub
                  && cursor[L][L] instanceof Variable
                  && cursor[L][L].isItalic !== false))) {
        LatexCmds._().createLeftOf(cursor);
        super_.createLeftOf.call(this, cursor);
        cursor.insRightOf(cursor.parent.parent);
      }
      else super_.createLeftOf.call(this, cursor);
    };
  });
  
  var Variable = P(Symbol, function(_, super_) {
    _.init = function(ch, html) {
      super_.init.call(this, ch, '<var>'+(html || ch)+'</var>');
    };
    _.text = function() {
      var text = this.ctrlSeq;
      if (this[L] && !(this[L] instanceof Variable)
          && !(this[L] instanceof BinaryOperator)
          && this[L].ctrlSeq !== "\\ ")
        text = '*' + text;
      if (this[R] && !(this[R] instanceof BinaryOperator)
          && !(this[R] instanceof SupSub))
        text += '*';
      return text;
    };
  });
  
  Options.p.autoCommands = { _maxLength: 0 };
  optionProcessors.autoCommands = function(cmds) {
    if (!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)) {
      throw '"'+cmds+'" not a space-delimited list of only letters';
    }
    var list = cmds.split(' '), dict = {}, maxLength = 0;
    for (var i = 0; i < list.length; i += 1) {
      var cmd = list[i];
      if (cmd.length < 2) {
        throw 'autocommand "'+cmd+'" not minimum length of 2';
      }
      if (LatexCmds[cmd] === OperatorName) {
        throw '"' + cmd + '" is a built-in operator name';
      }
      dict[cmd] = 1;
      maxLength = max(maxLength, cmd.length);
    }
    dict._maxLength = maxLength;
    return dict;
  };
  
  var Letter = P(Variable, function(_, super_) {
    _.init = function(ch) { return super_.init.call(this, this.letter = ch); };
    _.createLeftOf = function(cursor) {
      var autoCmds = cursor.options.autoCommands, maxLength = autoCmds._maxLength;
      if (maxLength > 0) {
        // want longest possible autocommand, so join together longest
        // sequence of letters
        var str = this.letter, l = cursor[L], i = 1;
        while (l instanceof Letter && i < maxLength) {
          str = l.letter + str, l = l[L], i += 1;
        }
        // check for an autocommand, going thru substrings longest to shortest
        while (str.length) {
          if (autoCmds.hasOwnProperty(str)) {
            for (var i = 2, l = cursor[L]; i < str.length; i += 1, l = l[L]);
            Fragment(l, cursor[L]).remove();
            cursor[L] = l[L];
            return LatexCmds[str](str).createLeftOf(cursor);
          }
          str = str.slice(1);
        }
      }
      super_.createLeftOf.apply(this, arguments);
    };
    _.italicize = function(bool) {
      this.isItalic = bool;
      this.jQ.toggleClass('mq-operator-name', !bool);
      return this;
    };
    _.finalizeTree = _.siblingDeleted = _.siblingCreated = function(opts, dir) {
      // don't auto-un-italicize if the sibling to my right changed (dir === R or
      // undefined) and it's now a Letter, it will un-italicize everyone
      if (dir !== L && this[R] instanceof Letter) return;
      this.autoUnItalicize(opts);
    };
    _.autoUnItalicize = function(opts) {
      var autoOps = opts.autoOperatorNames;
      if (autoOps._maxLength === 0) return;
      // want longest possible operator names, so join together entire contiguous
      // sequence of letters
      var str = this.letter;
      for (var l = this[L]; l instanceof Letter; l = l[L]) str = l.letter + str;
      for (var r = this[R]; r instanceof Letter; r = r[R]) str += r.letter;
  
      // removeClass and delete flags from all letters before figuring out
      // which, if any, are part of an operator name
      Fragment(l[R] || this.parent.ends[L], r[L] || this.parent.ends[R]).each(function(el) {
        el.italicize(true).jQ.removeClass('mq-first mq-last');
        el.ctrlSeq = el.letter;
      });
  
      // check for operator names: at each position from left to right, check
      // substrings from longest to shortest
      outer: for (var i = 0, first = l[R] || this.parent.ends[L]; i < str.length; i += 1, first = first[R]) {
        for (var len = min(autoOps._maxLength, str.length - i); len > 0; len -= 1) {
          var word = str.slice(i, i + len);
          if (autoOps.hasOwnProperty(word)) {
            for (var j = 0, letter = first; j < len; j += 1, letter = letter[R]) {
              letter.italicize(false);
              var last = letter;
            }
  
            var isBuiltIn = BuiltInOpNames.hasOwnProperty(word);
            first.ctrlSeq = (isBuiltIn ? '\\' : '\\operatorname{') + first.ctrlSeq;
            last.ctrlSeq += (isBuiltIn ? ' ' : '}');
            if (TwoWordOpNames.hasOwnProperty(word)) last[L][L][L].jQ.addClass('mq-last');
            if (nonOperatorSymbol(first[L])) first.jQ.addClass('mq-first');
            if (nonOperatorSymbol(last[R])) last.jQ.addClass('mq-last');
  
            i += len - 1;
            first = last;
            continue outer;
          }
        }
      }
    };
    function nonOperatorSymbol(node) {
      return node instanceof Symbol && !(node instanceof BinaryOperator);
    }
  });
  var BuiltInOpNames = {}; // the set of operator names like \sin, \cos, etc that
    // are built-into LaTeX: http://latex.wikia.com/wiki/List_of_LaTeX_symbols#Named_operators:_sin.2C_cos.2C_etc.
    // MathQuill auto-unitalicizes some operator names not in that set, like 'hcf'
    // and 'arsinh', which must be exported as \operatorname{hcf} and
    // \operatorname{arsinh}. Note: over/under line/arrow \lim variants like
    // \varlimsup are not supported
  var AutoOpNames = Options.p.autoOperatorNames = { _maxLength: 9 }; // the set
    // of operator names that MathQuill auto-unitalicizes by default; overridable
  var TwoWordOpNames = { limsup: 1, liminf: 1, projlim: 1, injlim: 1 };
  (function() {
    var mostOps = ('arg deg det dim exp gcd hom inf ker lg lim ln log max min sup'
                   + ' limsup liminf injlim projlim Pr').split(' ');
    for (var i = 0; i < mostOps.length; i += 1) {
      BuiltInOpNames[mostOps[i]] = AutoOpNames[mostOps[i]] = 1;
    }
  
    var builtInTrigs = // why coth but not sech and csch, LaTeX?
      'sin cos tan arcsin arccos arctan sinh cosh tanh sec csc cot coth'.split(' ');
    for (var i = 0; i < builtInTrigs.length; i += 1) {
      BuiltInOpNames[builtInTrigs[i]] = 1;
    }
  
    var autoTrigs = 'sin cos tan sec cosec csc cotan cot ctg'.split(' ');
    for (var i = 0; i < autoTrigs.length; i += 1) {
      AutoOpNames[autoTrigs[i]] =
      AutoOpNames['arc'+autoTrigs[i]] =
      AutoOpNames[autoTrigs[i]+'h'] =
      AutoOpNames['ar'+autoTrigs[i]+'h'] =
      AutoOpNames['arc'+autoTrigs[i]+'h'] = 1;
    }
  
    // compat with some of the nonstandard LaTeX exported by MathQuill
    // before #247. None of these are real LaTeX commands so, seems safe
    var moreNonstandardOps = 'gcf hcf lcm proj span'.split(' ');
    for (var i = 0; i < moreNonstandardOps.length; i += 1) {
      AutoOpNames[moreNonstandardOps[i]] = 1;
    }
  }());
  optionProcessors.autoOperatorNames = function(cmds) {
    if (!/^[a-z]+(?: [a-z]+)*$/i.test(cmds)) {
      throw '"'+cmds+'" not a space-delimited list of only letters';
    }
    var list = cmds.split(' '), dict = {}, maxLength = 0;
    for (var i = 0; i < list.length; i += 1) {
      var cmd = list[i];
      if (cmd.length < 2) {
        throw '"'+cmd+'" not minimum length of 2';
      }
      dict[cmd] = 1;
      maxLength = max(maxLength, cmd.length);
    }
    dict._maxLength = maxLength;
    return dict;
  };
  var OperatorName = P(Symbol, function(_, super_) {
    _.init = function(fn) { this.ctrlSeq = fn; };
    _.createLeftOf = function(cursor) {
      var fn = this.ctrlSeq;
      for (var i = 0; i < fn.length; i += 1) {
        Letter(fn.charAt(i)).createLeftOf(cursor);
      }
    };
    _.parser = function() {
      var fn = this.ctrlSeq;
      var block = MathBlock();
      for (var i = 0; i < fn.length; i += 1) {
        Letter(fn.charAt(i)).adopt(block, block.ends[R], 0);
      }
      return Parser.succeed(block.children());
    };
  });
  for (var fn in AutoOpNames) if (AutoOpNames.hasOwnProperty(fn)) {
    LatexCmds[fn] = OperatorName;
  }
  LatexCmds.operatorname = P(MathCommand, function(_) {
    _.createLeftOf = noop;
    _.numBlocks = function() { return 1; };
    _.parser = function() {
      return latexMathParser.block.map(function(b) { return b.children(); });
    };
  });
  
  LatexCmds.f = P(Letter, function(_, super_) {
    _.init = function() {
      Symbol.p.init.call(this, this.letter = 'f', '<var class="mq-f">f</var>');
    };
    _.italicize = function(bool) {
      this.jQ.html('f').toggleClass('mq-f', bool);
      return super_.italicize.apply(this, arguments);
    };
  });
  
  // VanillaSymbol's
  LatexCmds[' '] = LatexCmds.space = bind(VanillaSymbol, '\\ ', '&nbsp;');
  
  LatexCmds["'"] = LatexCmds.prime = bind(VanillaSymbol, "'", '&prime;');
  
  LatexCmds.backslash = bind(VanillaSymbol,'\\backslash ','\\');
  if (!CharCmds['\\']) CharCmds['\\'] = LatexCmds.backslash;
  
  LatexCmds.$ = bind(VanillaSymbol, '\\$', '$');
  
  // does not use Symbola font
  var NonSymbolaSymbol = P(Symbol, function(_, super_) {
    _.init = function(ch, html) {
      super_.init.call(this, ch, '<span class="mq-nonSymbola">'+(html || ch)+'</span>');
    };
  });
  
  LatexCmds['@'] = NonSymbolaSymbol;
  LatexCmds['&'] = bind(NonSymbolaSymbol, '\\&', '&amp;');
  LatexCmds['%'] = bind(NonSymbolaSymbol, '\\%', '%');
  
  //the following are all Greek to me, but this helped a lot: http://www.ams.org/STIX/ion/stixsig03.html
  
  //lowercase Greek letter variables
  LatexCmds.alpha =
  LatexCmds.beta =
  LatexCmds.gamma =
  LatexCmds.delta =
  LatexCmds.zeta =
  LatexCmds.eta =
  LatexCmds.theta =
  LatexCmds.iota =
  LatexCmds.kappa =
  LatexCmds.mu =
  LatexCmds.nu =
  LatexCmds.xi =
  LatexCmds.rho =
  LatexCmds.sigma =
  LatexCmds.tau =
  LatexCmds.chi =
  LatexCmds.psi =
  LatexCmds.omega = P(Variable, function(_, super_) {
    _.init = function(latex) {
      super_.init.call(this,'\\'+latex+' ','&'+latex+';');
    };
  });
  
  //why can't anybody FUCKING agree on these
  LatexCmds.phi = //W3C or Unicode?
    bind(Variable,'\\phi ','&#981;');
  
  LatexCmds.phiv = //Elsevier and 9573-13
  LatexCmds.varphi = //AMS and LaTeX
    bind(Variable,'\\varphi ','&phi;');
  
  LatexCmds.epsilon = //W3C or Unicode?
    bind(Variable,'\\epsilon ','&#1013;');
  
  LatexCmds.epsiv = //Elsevier and 9573-13
  LatexCmds.varepsilon = //AMS and LaTeX
    bind(Variable,'\\varepsilon ','&epsilon;');
  
  LatexCmds.piv = //W3C/Unicode and Elsevier and 9573-13
  LatexCmds.varpi = //AMS and LaTeX
    bind(Variable,'\\varpi ','&piv;');
  
  LatexCmds.sigmaf = //W3C/Unicode
  LatexCmds.sigmav = //Elsevier
  LatexCmds.varsigma = //LaTeX
    bind(Variable,'\\varsigma ','&sigmaf;');
  
  LatexCmds.thetav = //Elsevier and 9573-13
  LatexCmds.vartheta = //AMS and LaTeX
  LatexCmds.thetasym = //W3C/Unicode
    bind(Variable,'\\vartheta ','&thetasym;');
  
  LatexCmds.upsilon = //AMS and LaTeX and W3C/Unicode
  LatexCmds.upsi = //Elsevier and 9573-13
    bind(Variable,'\\upsilon ','&upsilon;');
  
  //these aren't even mentioned in the HTML character entity references
  LatexCmds.gammad = //Elsevier
  LatexCmds.Gammad = //9573-13 -- WTF, right? I dunno if this was a typo in the reference (see above)
  LatexCmds.digamma = //LaTeX
    bind(Variable,'\\digamma ','&#989;');
  
  LatexCmds.kappav = //Elsevier
  LatexCmds.varkappa = //AMS and LaTeX
    bind(Variable,'\\varkappa ','&#1008;');
  
  LatexCmds.rhov = //Elsevier and 9573-13
  LatexCmds.varrho = //AMS and LaTeX
    bind(Variable,'\\varrho ','&#1009;');
  
  //Greek constants, look best in non-italicized Times New Roman
  LatexCmds.pi = LatexCmds['\u03c0'] = bind(NonSymbolaSymbol,'\\pi ','&pi;');
  LatexCmds.lambda = bind(NonSymbolaSymbol,'\\lambda ','&lambda;');
  
  //uppercase greek letters
  
  LatexCmds.Upsilon = //LaTeX
  LatexCmds.Upsi = //Elsevier and 9573-13
  LatexCmds.upsih = //W3C/Unicode "upsilon with hook"
  LatexCmds.Upsih = //'cos it makes sense to me
    bind(Symbol,'\\Upsilon ','<var style="font-family: serif">&upsih;</var>'); //Symbola's 'upsilon with a hook' is a capital Y without hooks :(
  
  //other symbols with the same LaTeX command and HTML character entity reference
  LatexCmds.Gamma =
  LatexCmds.Delta =
  LatexCmds.Theta =
  LatexCmds.Lambda =
  LatexCmds.Xi =
  LatexCmds.Pi =
  LatexCmds.Sigma =
  LatexCmds.Phi =
  LatexCmds.Psi =
  LatexCmds.Omega =
  LatexCmds.forall = P(VanillaSymbol, function(_, super_) {
    _.init = function(latex) {
      super_.init.call(this,'\\'+latex+' ','&'+latex+';');
    };
  });
  
  // symbols that aren't a single MathCommand, but are instead a whole
  // Fragment. Creates the Fragment from a LaTeX string
  var LatexFragment = P(MathCommand, function(_) {
    _.init = function(latex) { this.latex = latex; };
    _.createLeftOf = function(cursor) {
      var block = latexMathParser.parse(this.latex);
      block.children().adopt(cursor.parent, cursor[L], cursor[R]);
      cursor[L] = block.ends[R];
      block.jQize().insertBefore(cursor.jQ);
      block.finalizeInsert(cursor.options, cursor);
      if (block.ends[R][R].siblingCreated) block.ends[R][R].siblingCreated(cursor.options, L);
      if (block.ends[L][L].siblingCreated) block.ends[L][L].siblingCreated(cursor.options, R);
      cursor.parent.bubble('reflow');
    };
    _.parser = function() {
      var frag = latexMathParser.parse(this.latex).children();
      return Parser.succeed(frag);
    };
  });
  
  // for what seems to me like [stupid reasons][1], Unicode provides
  // subscripted and superscripted versions of all ten Arabic numerals,
  // as well as [so-called "vulgar fractions"][2].
  // Nobody really cares about most of them, but some of them actually
  // predate Unicode, dating back to [ISO-8859-1][3], apparently also
  // known as "Latin-1", which among other things [Windows-1252][4]
  // largely coincides with, so Microsoft Word sometimes inserts them
  // and they get copy-pasted into MathQuill.
  //
  // (Irrelevant but funny story: though not a superset of Latin-1 aka
  // ISO-8859-1, Windows-1252 **is** a strict superset of the "closely
  // related but distinct"[3] "ISO 8859-1" -- see the lack of a dash
  // after "ISO"? Completely different character set, like elephants vs
  // elephant seals, or "Zombies" vs "Zombie Redneck Torture Family".
  // What kind of idiot would get them confused.
  // People in fact got them confused so much, it was so common to
  // mislabel Windows-1252 text as ISO-8859-1, that most modern web
  // browsers and email clients treat the MIME charset of ISO-8859-1
  // as actually Windows-1252, behavior now standard in the HTML5 spec.)
  //
  // [1]: http://en.wikipedia.org/wiki/Unicode_subscripts_andsuper_scripts
  // [2]: http://en.wikipedia.org/wiki/Number_Forms
  // [3]: http://en.wikipedia.org/wiki/ISO/IEC_8859-1
  // [4]: http://en.wikipedia.org/wiki/Windows-1252
  LatexCmds['\u00b9'] = bind(LatexFragment, '^1');
  LatexCmds['\u00b2'] = bind(LatexFragment, '^2');
  LatexCmds['\u00b3'] = bind(LatexFragment, '^3');
  LatexCmds['\u00bc'] = bind(LatexFragment, '\\frac14');
  LatexCmds['\u00bd'] = bind(LatexFragment, '\\frac12');
  LatexCmds['\u00be'] = bind(LatexFragment, '\\frac34');
  
  var PlusMinus = P(BinaryOperator, function(_) {
    _.init = VanillaSymbol.prototype.init;
  
    _.contactWeld = _.siblingCreated = _.siblingDeleted = function(opts, dir) {
      if (dir === R) return; // ignore if sibling only changed on the right
      this.jQ[0].className =
        (!this[L] || this[L] instanceof BinaryOperator ? '' : 'mq-binary-operator');
      return this;
    };
  });
  
  LatexCmds['+'] = bind(PlusMinus, '+', '+');
  //yes, these are different dashes, I think one is an en dash and the other is a hyphen
  LatexCmds['\u2013'] = LatexCmds['-'] = bind(PlusMinus, '-', '&minus;');
  LatexCmds['\u00b1'] = LatexCmds.pm = LatexCmds.plusmn = LatexCmds.plusminus =
    bind(PlusMinus,'\\pm ','&plusmn;');
  LatexCmds.mp = LatexCmds.mnplus = LatexCmds.minusplus =
    bind(PlusMinus,'\\mp ','&#8723;');
  
  CharCmds['*'] = LatexCmds.sdot = LatexCmds.cdot =
    bind(BinaryOperator, '\\cdot ', '&middot;', '*');
  //semantically should be &sdot;, but &middot; looks better
  
  var Inequality = P(BinaryOperator, function(_, super_) {
    _.init = function(data, strict) {
      this.data = data;
      this.strict = strict;
      var strictness = (strict ? 'Strict' : '');
      super_.init.call(this, data['ctrlSeq'+strictness], data['html'+strictness],
                       data['text'+strictness]);
    };
    _.swap = function(strict) {
      this.strict = strict;
      var strictness = (strict ? 'Strict' : '');
      this.ctrlSeq = this.data['ctrlSeq'+strictness];
      this.jQ.html(this.data['html'+strictness]);
      this.textTemplate = [ this.data['text'+strictness] ];
    };
    _.deleteTowards = function(dir, cursor) {
      if (dir === L && !this.strict) {
        this.swap(true);
        this.bubble('reflow');
        return;
      }
      super_.deleteTowards.apply(this, arguments);
    };
  });
  
  var less = { ctrlSeq: '\\le ', html: '&le;', text: '\u2264',
               ctrlSeqStrict: '<', htmlStrict: '&lt;', textStrict: '<' };
  var greater = { ctrlSeq: '\\ge ', html: '&ge;', text: '\u2265',
                  ctrlSeqStrict: '>', htmlStrict: '&gt;', textStrict: '>' };
  
  LatexCmds['<'] = LatexCmds.lt = bind(Inequality, less, true);
  LatexCmds['>'] = LatexCmds.gt = bind(Inequality, greater, true);
  LatexCmds['\u2264'] = LatexCmds.le = LatexCmds.leq = bind(Inequality, less, false);
  LatexCmds['\u2265'] = LatexCmds.ge = LatexCmds.geq = bind(Inequality, greater, false);
  
  var Equality = P(BinaryOperator, function(_, super_) {
    _.init = function() {
      super_.init.call(this, '=', '=');
    };
    _.createLeftOf = function(cursor) {
      if (cursor[L] instanceof Inequality && cursor[L].strict) {
        cursor[L].swap(false);
        cursor[L].bubble('reflow');
        return;
      }
      super_.createLeftOf.apply(this, arguments);
    };
  });
  LatexCmds['='] = Equality;
  
  LatexCmds['\u00d7'] = LatexCmds.times = bind(BinaryOperator, '\\times ', '&times;', '[x]');
  
  LatexCmds['\u00f7'] = LatexCmds.div = LatexCmds.divide = LatexCmds.divides =
    bind(BinaryOperator,'\\div ','&divide;', '[/]');
  
  CharCmds['~'] = LatexCmds.sim = bind(BinaryOperator, '\\sim ', '~', '~');
  /***************************
   * Commands and Operators.
   **************************/
  
  var scale, // = function(jQ, x, y) { ... }
  //will use a CSS 2D transform to scale the jQuery-wrapped HTML elements,
  //or the filter matrix transform fallback for IE 5.5-8, or gracefully degrade to
  //increasing the fontSize to match the vertical Y scaling factor.
  
  //ideas from http://github.com/louisremi/jquery.transform.js
  //see also http://msdn.microsoft.com/en-us/library/ms533014(v=vs.85).aspx
  
    forceIERedraw = noop,
    div = document.createElement('div'),
    div_style = div.style,
    transformPropNames = {
      transform:1,
      WebkitTransform:1,
      MozTransform:1,
      OTransform:1,
      msTransform:1
    },
    transformPropName;
  
  for (var prop in transformPropNames) {
    if (prop in div_style) {
      transformPropName = prop;
      break;
    }
  }
  
  if (transformPropName) {
    scale = function(jQ, x, y) {
      jQ.css(transformPropName, 'scale('+x+','+y+')');
    };
  }
  else if ('filter' in div_style) { //IE 6, 7, & 8 fallback, see https://github.com/laughinghan/mathquill/wiki/Transforms
    forceIERedraw = function(el){ el.className = el.className; };
    scale = function(jQ, x, y) { //NOTE: assumes y > x
      x /= (1+(y-1)/2);
      jQ.css('fontSize', y + 'em');
      if (!jQ.hasClass('mq-matrixed-container')) {
        jQ.addClass('mq-matrixed-container')
        .wrapInner('<span class="mq-matrixed"></span>');
      }
      var innerjQ = jQ.children()
      .css('filter', 'progid:DXImageTransform.Microsoft'
          + '.Matrix(M11=' + x + ",SizingMethod='auto expand')"
      );
      function calculateMarginRight() {
        jQ.css('marginRight', (innerjQ.width()-1)*(x-1)/x + 'px');
      }
      calculateMarginRight();
      var intervalId = setInterval(calculateMarginRight);
      $(window).load(function() {
        clearTimeout(intervalId);
        calculateMarginRight();
      });
    };
  }
  else {
    scale = function(jQ, x, y) {
      jQ.css('fontSize', y + 'em');
    };
  }
  
  var Style = P(MathCommand, function(_, super_) {
    _.init = function(ctrlSeq, tagName, attrs) {
      super_.init.call(this, ctrlSeq, '<'+tagName+' '+attrs+'>&0</'+tagName+'>');
    };
  });
  
  //fonts
  LatexCmds.mathrm = bind(Style, '\\mathrm', 'span', 'class="mq-roman mq-font"');
  LatexCmds.mathit = bind(Style, '\\mathit', 'i', 'class="mq-font"');
  LatexCmds.mathbf = bind(Style, '\\mathbf', 'b', 'class="mq-font"');
  LatexCmds.mathsf = bind(Style, '\\mathsf', 'span', 'class="mq-sans-serif mq-font"');
  LatexCmds.mathtt = bind(Style, '\\mathtt', 'span', 'class="mq-monospace mq-font"');
  //text-decoration
  LatexCmds.underline = bind(Style, '\\underline', 'span', 'class="mq-non-leaf mq-underline"');
  LatexCmds.overline = LatexCmds.bar = bind(Style, '\\overline', 'span', 'class="mq-non-leaf mq-overline"');
  LatexCmds.overrightarrow = bind(Style, '\\overrightarrow', 'span', 'class="mq-non-leaf mq-overarrow mq-arrow-right"');
  LatexCmds.overleftarrow = bind(Style, '\\overleftarrow', 'span', 'class="mq-non-leaf mq-overarrow mq-arrow-left"');
  
  // `\textcolor{color}{math}` will apply a color to the given math content, where
  // `color` is any valid CSS Color Value (see [SitePoint docs][] (recommended),
  // [Mozilla docs][], or [W3C spec][]).
  //
  // [SitePoint docs]: http://reference.sitepoint.com/css/colorvalues
  // [Mozilla docs]: https://developer.mozilla.org/en-US/docs/CSS/color_value#Values
  // [W3C spec]: http://dev.w3.org/csswg/css3-color/#colorunits
  var TextColor = LatexCmds.textcolor = P(MathCommand, function(_, super_) {
    _.setColor = function(color) {
      this.color = color;
      this.htmlTemplate =
        '<span class="mq-textcolor" style="color:' + color + '">&0</span>';
    };
    _.latex = function() {
      return '\\textcolor{' + this.color + '}{' + this.blocks[0].latex() + '}';
    };
    _.parser = function() {
      var self = this;
      var optWhitespace = Parser.optWhitespace;
      var string = Parser.string;
      var regex = Parser.regex;
  
      return optWhitespace
        .then(string('{'))
        .then(regex(/^[#\w\s.,()%-]*/))
        .skip(string('}'))
        .then(function(color) {
          self.setColor(color);
          return super_.parser.call(self);
        })
      ;
    };
  });
  
  // Very similar to the \textcolor command, but will add the given CSS class.
  // Usage: \class{classname}{math}
  // Note regex that whitelists valid CSS classname characters:
  // https://github.com/mathquill/mathquill/pull/191#discussion_r4327442
  var Class = LatexCmds['class'] = P(MathCommand, function(_, super_) {
    _.parser = function() {
      var self = this, string = Parser.string, regex = Parser.regex;
      return Parser.optWhitespace
        .then(string('{'))
        .then(regex(/^[-\w\s\\\xA0-\xFF]*/))
        .skip(string('}'))
        .then(function(cls) {
          self.htmlTemplate = '<span class="mq-class '+cls+'">&0</span>';
          return super_.parser.call(self);
        })
      ;
    };
  });
  
  var SupSub = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '_{...}^{...}';
    _.createLeftOf = function(cursor) {
      if (!cursor[L] && cursor.options.supSubsRequireOperand) return;
      return super_.createLeftOf.apply(this, arguments);
    };
    _.contactWeld = function(cursor) {
      // Look on either side for a SupSub, if one is found compare my
      // .sub, .sup with its .sub, .sup. If I have one that it doesn't,
      // then call .addBlock() on it with my block; if I have one that
      // it also has, then insert my block's children into its block,
      // unless my block has none, in which case insert the cursor into
      // its block (and not mine, I'm about to remove myself) in the case
      // I was just typed.
      // TODO: simplify
  
      // equiv. to [L, R].forEach(function(dir) { ... });
      for (var dir = L; dir; dir = (dir === L ? R : false)) {
        if (this[dir] instanceof SupSub) {
          // equiv. to 'sub sup'.split(' ').forEach(function(supsub) { ... });
          for (var supsub = 'sub'; supsub; supsub = (supsub === 'sub' ? 'sup' : false)) {
            var src = this[supsub], dest = this[dir][supsub];
            if (!src) continue;
            if (!dest) this[dir].addBlock(src.disown());
            else if (!src.isEmpty()) { // ins src children at -dir end of dest
              src.jQ.children().insAtDirEnd(-dir, dest.jQ);
              var children = src.children().disown();
              var pt = Point(dest, children.ends[R], dest.ends[L]);
              if (dir === L) children.adopt(dest, dest.ends[R], 0);
              else children.adopt(dest, 0, dest.ends[L]);
            }
            else var pt = Point(dest, 0, dest.ends[L]);
            this.placeCursor = (function(dest, src) { // TODO: don't monkey-patch
              return function(cursor) { cursor.insAtDirEnd(-dir, dest || src); };
            }(dest, src));
          }
          this.remove();
          if (cursor && cursor[L] === this) {
            if (dir === R && pt) {
              pt[L] ? cursor.insRightOf(pt[L]) : cursor.insAtLeftEnd(pt.parent);
            }
            else cursor.insRightOf(this[dir]);
          }
          break;
        }
      }
      this.respace();
    };
    Options.p.charsThatBreakOutOfSupSub = '';
    _.finalizeTree = function() {
      this.ends[L].write = function(cursor, ch) {
        if (cursor.options.autoSubscriptNumerals && this === this.parent.sub) {
          if (ch === '_') return;
          var cmd = this.chToCmd(ch);
          if (cmd instanceof Symbol) cursor.deleteSelection();
          else cursor.clearSelection().insRightOf(this.parent);
          return cmd.createLeftOf(cursor.show());
        }
        if (cursor[L] && !cursor[R] && !cursor.selection
            && cursor.options.charsThatBreakOutOfSupSub.indexOf(ch) > -1) {
          cursor.insRightOf(this.parent);
        }
        MathBlock.p.write.apply(this, arguments);
      };
    };
    _.moveTowards = function(dir, cursor, updown) {
      if (cursor.options.autoSubscriptNumerals && !this.sup) {
        cursor.insDirOf(dir, this);
      }
      else super_.moveTowards.apply(this, arguments);
    };
    _.deleteTowards = function(dir, cursor) {
      if (cursor.options.autoSubscriptNumerals && this.sub) {
        var cmd = this.sub.ends[-dir];
        if (cmd instanceof Symbol) cmd.remove();
        else if (cmd) cmd.deleteTowards(dir, cursor.insAtDirEnd(-dir, this.sub));
  
        // TODO: factor out a .removeBlock() or something
        if (this.sub.isEmpty()) {
          this.sub.deleteOutOf(L, cursor.insAtLeftEnd(this.sub));
          if (this.sup) cursor.insDirOf(-dir, this);
          // Note `-dir` because in e.g. x_1^2| want backspacing (leftward)
          // to delete the 1 but to end up rightward of x^2; with non-negated
          // `dir` (try it), the cursor appears to have gone "through" the ^2.
        }
      }
      else super_.deleteTowards.apply(this, arguments);
    };
    _.latex = function() {
      function latex(prefix, block) {
        var l = block && block.latex();
        return block ? prefix + (l.length === 1 ? l : '{' + (l || ' ') + '}') : '';
      }
      return latex('_', this.sub) + latex('^', this.sup);
    };
    _.respace = _.siblingCreated = _.siblingDeleted = function(opts, dir) {
      if (dir === R) return; // ignore if sibling only changed on the right
      this.jQ.toggleClass('mq-limit', this[L].ctrlSeq === '\\int ');
    };
    _.addBlock = function(block) {
      if (this.supsub === 'sub') {
        this.sup = this.upInto = this.sub.upOutOf = block;
        block.adopt(this, this.sub, 0).downOutOf = this.sub;
        block.jQ = $('<span class="mq-sup"/>').append(block.jQ.children())
          .attr(mqBlockId, block.id).prependTo(this.jQ);
      }
      else {
        this.sub = this.downInto = this.sup.downOutOf = block;
        block.adopt(this, 0, this.sup).upOutOf = this.sup;
        block.jQ = $('<span class="mq-sub"></span>').append(block.jQ.children())
          .attr(mqBlockId, block.id).appendTo(this.jQ.removeClass('mq-sup-only'));
        this.jQ.append('<span style="display:inline-block;width:0">&#8203;</span>');
      }
      // like 'sub sup'.split(' ').forEach(function(supsub) { ... });
      for (var i = 0; i < 2; i += 1) (function(cmd, supsub, oppositeSupsub, updown) {
        cmd[supsub].deleteOutOf = function(dir, cursor) {
          cursor.insDirOf((this[dir] ? -dir : dir), this.parent);
          if (!this.isEmpty()) {
            var end = this.ends[dir];
            this.children().disown()
              .withDirAdopt(dir, cursor.parent, cursor[dir], cursor[-dir])
              .jQ.insDirOf(-dir, cursor.jQ);
            cursor[-dir] = end;
          }
          cmd.supsub = oppositeSupsub;
          delete cmd[supsub];
          delete cmd[updown+'Into'];
          cmd[oppositeSupsub][updown+'OutOf'] = insLeftOfMeUnlessAtEnd;
          delete cmd[oppositeSupsub].deleteOutOf;
          if (supsub === 'sub') $(cmd.jQ.addClass('mq-sup-only')[0].lastChild).remove();
          this.remove();
        };
      }(this, 'sub sup'.split(' ')[i], 'sup sub'.split(' ')[i], 'down up'.split(' ')[i]));
    };
  });
  
  function insLeftOfMeUnlessAtEnd(cursor) {
    // cursor.insLeftOf(cmd), unless cursor at the end of block, and every
    // ancestor cmd is at the end of every ancestor block
    var cmd = this.parent, ancestorCmd = cursor;
    do {
      if (ancestorCmd[R]) return cursor.insLeftOf(cmd);
      ancestorCmd = ancestorCmd.parent.parent;
    } while (ancestorCmd !== cmd);
    cursor.insRightOf(cmd);
  }
  
  LatexCmds.subscript =
  LatexCmds._ = P(SupSub, function(_, super_) {
    _.supsub = 'sub';
    _.htmlTemplate =
        '<span class="mq-supsub mq-non-leaf">'
      +   '<span class="mq-sub">&0</span>'
      +   '<span style="display:inline-block;width:0">&#8203;</span>'
      + '</span>'
    ;
    _.textTemplate = [ '_' ];
    _.finalizeTree = function() {
      this.downInto = this.sub = this.ends[L];
      this.sub.upOutOf = insLeftOfMeUnlessAtEnd;
      super_.finalizeTree.call(this);
    };
  });
  
  LatexCmds.superscript =
  LatexCmds.supscript =
  LatexCmds['^'] = P(SupSub, function(_, super_) {
    _.supsub = 'sup';
    _.htmlTemplate =
        '<span class="mq-supsub mq-non-leaf mq-sup-only">'
      +   '<span class="mq-sup">&0</span>'
      + '</span>'
    ;
    _.textTemplate = [ '^' ];
    _.finalizeTree = function() {
      this.upInto = this.sup = this.ends[R];
      this.sup.downOutOf = insLeftOfMeUnlessAtEnd;
      super_.finalizeTree.call(this);
    };
  });
  
  var SummationNotation = P(MathCommand, function(_, super_) {
    _.init = function(ch, html) {
      var htmlTemplate =
        '<span class="mq-large-operator mq-non-leaf">'
      +   '<span class="mq-to"><span>&1</span></span>'
      +   '<big>'+html+'</big>'
      +   '<span class="mq-from"><span>&0</span></span>'
      + '</span>'
      ;
      Symbol.prototype.init.call(this, ch, htmlTemplate);
    };
    _.createLeftOf = function(cursor) {
      super_.createLeftOf.apply(this, arguments);
      if (cursor.options.sumStartsWithNEquals) {
        Letter('n').createLeftOf(cursor);
        Equality().createLeftOf(cursor);
      }
    };
    _.latex = function() {
      function simplify(latex) {
        return latex.length === 1 ? latex : '{' + (latex || ' ') + '}';
      }
      return this.ctrlSeq + '_' + simplify(this.ends[L].latex()) +
        '^' + simplify(this.ends[R].latex());
    };
    _.parser = function() {
      var string = Parser.string;
      var optWhitespace = Parser.optWhitespace;
      var succeed = Parser.succeed;
      var block = latexMathParser.block;
  
      var self = this;
      var blocks = self.blocks = [ MathBlock(), MathBlock() ];
      for (var i = 0; i < blocks.length; i += 1) {
        blocks[i].adopt(self, self.ends[R], 0);
      }
  
      return optWhitespace.then(string('_').or(string('^'))).then(function(supOrSub) {
        var child = blocks[supOrSub === '_' ? 0 : 1];
        return block.then(function(block) {
          block.children().adopt(child, child.ends[R], 0);
          return succeed(self);
        });
      }).many().result(self);
    };
    _.finalizeTree = function() {
      this.downInto = this.ends[L];
      this.upInto = this.ends[R];
      this.ends[L].upOutOf = this.ends[R];
      this.ends[R].downOutOf = this.ends[L];
    };
  });
  
  LatexCmds['\u2211'] =
  LatexCmds.sum =
  LatexCmds.summation = bind(SummationNotation,'\\sum ','&sum;');
  
  LatexCmds['\u220f'] =
  LatexCmds.prod =
  LatexCmds.product = bind(SummationNotation,'\\prod ','&prod;');
  
  LatexCmds.coprod =
  LatexCmds.coproduct = bind(SummationNotation,'\\coprod ','&#8720;');
  
  var Fraction =
  LatexCmds.frac =
  LatexCmds.dfrac =
  LatexCmds.cfrac =
  LatexCmds.fraction = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\frac';
    _.htmlTemplate =
        '<span class="mq-fraction mq-non-leaf">'
      +   '<span class="mq-numerator">&0</span>'
      +   '<span class="mq-denominator">&1</span>'
      +   '<span style="display:inline-block;width:0">&#8203;</span>'
      + '</span>'
    ;
    _.textTemplate = ['(', ')/(', ')'];
    _.finalizeTree = function() {
      this.upInto = this.ends[R].upOutOf = this.ends[L];
      this.downInto = this.ends[L].downOutOf = this.ends[R];
    };
  });
  
  var LiveFraction =
  LatexCmds.over =
  CharCmds['/'] = P(Fraction, function(_, super_) {
    _.createLeftOf = function(cursor) {
      if (!this.replacedFragment) {
        var leftward = cursor[L];
        while (leftward &&
          !(
            leftward instanceof BinaryOperator ||
            leftward instanceof (LatexCmds.text || noop) ||
            leftward instanceof SummationNotation ||
            leftward.ctrlSeq === '\\ ' ||
            /^[,;:]$/.test(leftward.ctrlSeq)
          ) //lookbehind for operator
        ) leftward = leftward[L];
  
        if (leftward instanceof SummationNotation && leftward[R] instanceof SupSub) {
          leftward = leftward[R];
          if (leftward[R] instanceof SupSub && leftward[R].ctrlSeq != leftward.ctrlSeq)
            leftward = leftward[R];
        }
  
        if (leftward !== cursor[L]) {
          this.replaces(Fragment(leftward[R] || cursor.parent.ends[L], cursor[L]));
          cursor[L] = leftward;
        }
      }
      super_.createLeftOf.call(this, cursor);
    };
  });
  
  var SquareRoot =
  LatexCmds.sqrt =
  LatexCmds['\u221a'] = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\sqrt';
    _.htmlTemplate =
        '<span class="mq-non-leaf">'
      +   '<span class="mq-scaled mq-sqrt-prefix">&radic;</span>'
      +   '<span class="mq-non-leaf mq-sqrt-stem">&0</span>'
      + '</span>'
    ;
    _.textTemplate = ['sqrt(', ')'];
    _.parser = function() {
      return latexMathParser.optBlock.then(function(optBlock) {
        return latexMathParser.block.map(function(block) {
          var nthroot = NthRoot();
          nthroot.blocks = [ optBlock, block ];
          optBlock.adopt(nthroot, 0, 0);
          block.adopt(nthroot, optBlock, 0);
          return nthroot;
        });
      }).or(super_.parser.call(this));
    };
    _.reflow = function() {
      var block = this.ends[R].jQ;
      scale(block.prev(), 1, block.innerHeight()/+block.css('fontSize').slice(0,-2) - .1);
    };
  });
  
  var Vec = LatexCmds.vec = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\vec';
    _.htmlTemplate =
        '<span class="mq-non-leaf">'
      +   '<span class="mq-vector-prefix">&rarr;</span>'
      +   '<span class="mq-vector-stem">&0</span>'
      + '</span>'
    ;
    _.textTemplate = ['vec(', ')'];
  });
  
  var NthRoot =
  LatexCmds.nthroot = P(SquareRoot, function(_, super_) {
    _.htmlTemplate =
        '<sup class="mq-nthroot mq-non-leaf">&0</sup>'
      + '<span class="mq-scaled">'
      +   '<span class="mq-sqrt-prefix mq-scaled">&radic;</span>'
      +   '<span class="mq-sqrt-stem mq-non-leaf">&1</span>'
      + '</span>'
    ;
    _.textTemplate = ['sqrt[', '](', ')'];
    _.latex = function() {
      return '\\sqrt['+this.ends[L].latex()+']{'+this.ends[R].latex()+'}';
    };
  });
  
  function DelimsMixin(_, super_) {
    _.jQadd = function() {
      super_.jQadd.apply(this, arguments);
      this.delimjQs = this.jQ.children(':first').add(this.jQ.children(':last'));
      this.contentjQ = this.jQ.children(':eq(1)');
    };
    _.reflow = function() {
      var height = this.contentjQ.outerHeight()
                   / parseFloat(this.contentjQ.css('fontSize'));
      scale(this.delimjQs, min(1 + .2*(height - 1), 1.2), 1.2*height);
    };
  }
  
  // Round/Square/Curly/Angle Brackets (aka Parens/Brackets/Braces)
  //   first typed as one-sided bracket with matching "ghost" bracket at
  //   far end of current block, until you type an opposing one
  var Bracket = P(P(MathCommand, DelimsMixin), function(_, super_) {
    _.init = function(side, open, close, ctrlSeq, end) {
      super_.init.call(this, '\\left'+ctrlSeq, undefined, [open, close]);
      this.side = side;
      this.sides = {};
      this.sides[L] = { ch: open, ctrlSeq: ctrlSeq };
      this.sides[R] = { ch: close, ctrlSeq: end };
    };
    _.numBlocks = function() { return 1; };
    _.html = function() { // wait until now so that .side may
      this.htmlTemplate = // be set by createLeftOf or parser
          '<span class="mq-non-leaf">'
        +   '<span class="mq-scaled mq-paren'+(this.side === R ? ' mq-ghost' : '')+'">'
        +     this.sides[L].ch
        +   '</span>'
        +   '<span class="mq-non-leaf">&0</span>'
        +   '<span class="mq-scaled mq-paren'+(this.side === L ? ' mq-ghost' : '')+'">'
        +     this.sides[R].ch
        +   '</span>'
        + '</span>'
      ;
      return super_.html.call(this);
    };
    _.latex = function() {
      return '\\left'+this.sides[L].ctrlSeq+this.ends[L].latex()+'\\right'+this.sides[R].ctrlSeq;
    };
    _.oppBrack = function(opts, node, expectedSide) {
      // return node iff it's a 1-sided bracket of expected side (if any, may be
      // undefined), and of opposite side from me if I'm not a pipe
      return node instanceof Bracket && node.side && node.side !== -expectedSide
        && (this.sides[this.side].ch === '|' || node.side === -this.side)
        && (!opts.restrictMismatchedBrackets
          || OPP_BRACKS[this.sides[this.side].ch] === node.sides[node.side].ch
          || { '(': ']', '[': ')' }[this.sides[L].ch] === node.sides[R].ch) && node;
    };
    _.closeOpposing = function(brack) {
      brack.side = 0;
      brack.sides[this.side] = this.sides[this.side]; // copy over my info (may be
      brack.delimjQs.eq(this.side === L ? 0 : 1) // mismatched, like [a, b))
        .removeClass('mq-ghost').html(this.sides[this.side].ch);
    };
    _.createLeftOf = function(cursor) {
      if (!this.replacedFragment) { // unless wrapping seln in brackets,
          // check if next to or inside an opposing one-sided bracket
          // (must check both sides 'cos I might be a pipe)
        var opts = cursor.options;
        var brack = this.oppBrack(opts, cursor[L], L)
                    || this.oppBrack(opts, cursor[R], R)
                    || this.oppBrack(opts, cursor.parent.parent);
      }
      if (brack) {
        var side = this.side = -brack.side; // may be pipe with .side not yet set
        this.closeOpposing(brack);
        if (brack === cursor.parent.parent && cursor[side]) { // move the stuff between
          Fragment(cursor[side], cursor.parent.ends[side], -side) // me and ghost outside
            .disown().withDirAdopt(-side, brack.parent, brack, brack[side])
            .jQ.insDirOf(side, brack.jQ);
          brack.bubble('reflow');
        }
      }
      else {
        brack = this, side = brack.side;
        if (brack.replacedFragment) brack.side = 0; // wrapping seln, don't be one-sided
        else if (cursor[-side]) { // elsewise, auto-expand so ghost is at far end
          brack.replaces(Fragment(cursor[-side], cursor.parent.ends[-side], side));
          cursor[-side] = 0;
        }
        super_.createLeftOf.call(brack, cursor);
      }
      if (side === L) cursor.insAtLeftEnd(brack.ends[L]);
      else cursor.insRightOf(brack);
    };
    _.placeCursor = noop;
    _.unwrap = function() {
      this.ends[L].children().disown().adopt(this.parent, this, this[R])
        .jQ.insertAfter(this.jQ);
      this.remove();
    };
    _.deleteSide = function(side, outward, cursor) {
      var parent = this.parent, sib = this[side], farEnd = parent.ends[side];
  
      if (side === this.side) { // deleting non-ghost of one-sided bracket, unwrap
        this.unwrap();
        sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
        return;
      }
  
      var opts = cursor.options, wasSolid = !this.side;
      this.side = -side;
      // if deleting like, outer close-brace of [(1+2)+3} where inner open-paren
      if (this.oppBrack(opts, this.ends[L].ends[this.side], side)) { // is ghost,
        this.closeOpposing(this.ends[L].ends[this.side]); // then become [1+2)+3
        var origEnd = this.ends[L].ends[side];
        this.unwrap();
        if (origEnd.siblingCreated) origEnd.siblingCreated(cursor.options, side);
        sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
      }
      else { // if deleting like, inner close-brace of ([1+2}+3) where outer
        if (this.oppBrack(opts, this.parent.parent, side)) { // open-paren is
          this.parent.parent.closeOpposing(this); // ghost, then become [1+2+3)
          this.parent.parent.unwrap();
        } // else if deleting outward from a solid pair, unwrap
        else if (outward && wasSolid) {
          this.unwrap();
          sib ? cursor.insDirOf(-side, sib) : cursor.insAtDirEnd(side, parent);
          return;
        }
        else { // else deleting just one of a pair of brackets, become one-sided
          this.sides[side] = { ch: OPP_BRACKS[this.sides[this.side].ch],
                               ctrlSeq: OPP_BRACKS[this.sides[this.side].ctrlSeq] };
          this.delimjQs.removeClass('mq-ghost')
            .eq(side === L ? 0 : 1).addClass('mq-ghost').html(this.sides[side].ch);
        }
        if (sib) { // auto-expand so ghost is at far end
          var origEnd = this.ends[L].ends[side];
          Fragment(sib, farEnd, -side).disown()
            .withDirAdopt(-side, this.ends[L], origEnd, 0)
            .jQ.insAtDirEnd(side, this.ends[L].jQ.removeClass('mq-empty'));
          if (origEnd.siblingCreated) origEnd.siblingCreated(cursor.options, side);
          cursor.insDirOf(-side, sib);
        } // didn't auto-expand, cursor goes just outside or just inside parens
        else (outward ? cursor.insDirOf(side, this)
                      : cursor.insAtDirEnd(side, this.ends[L]));
      }
    };
    _.deleteTowards = function(dir, cursor) {
      this.deleteSide(-dir, false, cursor);
    };
    _.finalizeTree = function() {
      this.ends[L].deleteOutOf = function(dir, cursor) {
        this.parent.deleteSide(dir, true, cursor);
      };
      // FIXME HACK: after initial creation/insertion, finalizeTree would only be
      // called if the paren is selected and replaced, e.g. by LiveFraction
      this.finalizeTree = this.intentionalBlur = function() {
        this.delimjQs.eq(this.side === L ? 1 : 0).removeClass('mq-ghost');
        this.side = 0;
      };
    };
    _.siblingCreated = function(opts, dir) { // if something typed between ghost and far
      if (dir === -this.side) this.finalizeTree(); // end of its block, solidify
    };
  });
  
  var OPP_BRACKS = {
    '(': ')',
    ')': '(',
    '[': ']',
    ']': '[',
    '{': '}',
    '}': '{',
    '\\{': '\\}',
    '\\}': '\\{',
    '&lang;': '&rang;',
    '&rang;': '&lang;',
    '\\langle ': '\\rangle ',
    '\\rangle ': '\\langle ',
    '|': '|'
  };
  
  function bindCharBracketPair(open, ctrlSeq) {
    var ctrlSeq = ctrlSeq || open, close = OPP_BRACKS[open], end = OPP_BRACKS[ctrlSeq];
    CharCmds[open] = bind(Bracket, L, open, close, ctrlSeq, end);
    CharCmds[close] = bind(Bracket, R, open, close, ctrlSeq, end);
  }
  bindCharBracketPair('(');
  bindCharBracketPair('[');
  bindCharBracketPair('{', '\\{');
  LatexCmds.langle = bind(Bracket, L, '&lang;', '&rang;', '\\langle ', '\\rangle ');
  LatexCmds.rangle = bind(Bracket, R, '&lang;', '&rang;', '\\langle ', '\\rangle ');
  CharCmds['|'] = bind(Bracket, L, '|', '|', '|', '|');
  
  LatexCmds.left = P(MathCommand, function(_) {
    _.parser = function() {
      var regex = Parser.regex;
      var string = Parser.string;
      var succeed = Parser.succeed;
      var optWhitespace = Parser.optWhitespace;
  
      return optWhitespace.then(regex(/^(?:[([|]|\\\{)/))
        .then(function(ctrlSeq) { // TODO: \langle, \rangle
          var open = (ctrlSeq.charAt(0) === '\\' ? ctrlSeq.slice(1) : ctrlSeq);
          return latexMathParser.then(function (block) {
            return string('\\right').skip(optWhitespace)
              .then(regex(/^(?:[\])|]|\\\})/)).map(function(end) {
                var close = (end.charAt(0) === '\\' ? end.slice(1) : end);
                var cmd = Bracket(0, open, close, ctrlSeq, end);
                cmd.blocks = [ block ];
                block.adopt(cmd, 0, 0);
                return cmd;
              })
            ;
          });
        })
      ;
    };
  });
  
  LatexCmds.right = P(MathCommand, function(_) {
    _.parser = function() {
      return Parser.fail('unmatched \\right');
    };
  });
  
  var Binomial =
  LatexCmds.binom =
  LatexCmds.binomial = P(P(MathCommand, DelimsMixin), function(_, super_) {
    _.ctrlSeq = '\\binom';
    _.htmlTemplate =
        '<span class="mq-non-leaf">'
      +   '<span class="mq-paren mq-scaled">(</span>'
      +   '<span class="mq-non-leaf">'
      +     '<span class="mq-array mq-non-leaf">'
      +       '<span>&0</span>'
      +       '<span>&1</span>'
      +     '</span>'
      +   '</span>'
      +   '<span class="mq-paren mq-scaled">)</span>'
      + '</span>'
    ;
    _.textTemplate = ['choose(',',',')'];
  });
  
  var Choose =
  LatexCmds.choose = P(Binomial, function(_) {
    _.createLeftOf = LiveFraction.prototype.createLeftOf;
  });
  
  LatexCmds.editable = // backcompat with before cfd3620 on #233
  LatexCmds.MathQuillMathField = P(MathCommand, function(_, super_) {
    _.ctrlSeq = '\\MathQuillMathField';
    _.htmlTemplate =
        '<span class="mq-editable-field">'
      +   '<span class="mq-root-block">&0</span>'
      + '</span>'
    ;
    _.parser = function() {
      var self = this,
        string = Parser.string, regex = Parser.regex, succeed = Parser.succeed;
      return string('[').then(regex(/^[a-z][a-z0-9]*/i)).skip(string(']'))
        .map(function(name) { self.name = name; }).or(succeed())
        .then(super_.parser.call(self));
    };
    _.finalizeTree = function() {
      var ctrlr = Controller(this.ends[L], this.jQ, Options());
      ctrlr.KIND_OF_MQ = 'MathField';
      ctrlr.editable = true;
      ctrlr.createTextarea();
      ctrlr.editablesTextareaEvents();
      ctrlr.cursor.insAtRightEnd(ctrlr.root);
      RootBlockMixin(ctrlr.root);
    };
    _.registerInnerField = function(innerFields, MathField) {
      innerFields.push(innerFields[this.name] = MathField(this.ends[L].controller));
    };
    _.latex = function(){ return this.ends[L].latex(); };
    _.text = function(){ return this.ends[L].text(); };
  });
  
  // Embed arbitrary things
  // Probably the closest DOM analogue would be an iframe?
  // From MathQuill's perspective, it's a Symbol, it can be
  // anywhere and the cursor can go around it but never in it.
  // Create by calling public API method .dropEmbedded(),
  // or by calling the global public API method .registerEmbed()
  // and rendering LaTeX like \embed{registeredName} (see test).
  var Embed = LatexCmds.embed = P(Symbol, function(_, super_) {
    _.setOptions = function(options) {
      function noop () { return ""; }
      this.text = options.text || noop;
      this.htmlTemplate = options.htmlString || "";
      this.latex = options.latex || noop;
      return this;
    };
    _.parser = function() {
      var self = this;
        string = Parser.string, regex = Parser.regex, succeed = Parser.succeed;
      return string('{').then(regex(/^[a-z][a-z0-9]*/i)).skip(string('}'))
        .then(function(name) {
          // the chars allowed in the optional data block are arbitrary other than
          // excluding curly braces and square brackets (which'd be too confusing)
          return string('[').then(regex(/^[-\w\s]*/)).skip(string(']'))
            .or(succeed()).map(function(data) {
              return self.setOptions(EMBEDS[name](data));
            })
          ;
        })
      ;
    };
  });
  var MQ1 = getInterface(1);
  for (var key in MQ1) (function(key, val) {
    if (typeof val === 'function') {
      MathQuill[key] = function() {
        insistOnInterVer();
        return val.apply(this, arguments);
      };
      MathQuill[key].prototype = val.prototype;
    }
    else MathQuill[key] = val;
  }(key, MQ1[key]));
  
}());
  