
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { a5 as createCommonjsModule, a6 as commonjsGlobal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, y as language, O as Dialog, P as binding_callbacks, Q as bind, v as validate_slots, o as onMount, A as AH, a9 as afterUpdate, w as writable, L as beforeUpdate, X as XMLToJSON, M as JSONToXML, U as Button, V as Checkbox, C as validate_each_argument, f as space, h as text, j as attr_dev, $ as null_to_empty, k as add_location, n as insert_dev, G as prop_dev, F as set_data_dev, x as detach_dev, K as destroy_each, z as empty, c as create_component, m as mount_component, q as listen_dev, W as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, E as is_function, B as noop, l as set_style } from './main-dd9f9f1a.js';

/* @license
Papa Parse
v5.0.2
https://github.com/mholt/PapaParse
License: MIT
*/

var papaparse_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function s(){var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var r=(t=t||{}).dynamicTyping||!1;q(r)&&(t.dynamicTypingFunction=r,r={});if(t.dynamicTyping=r,t.transform=!!q(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var i=function(){if(!b.WORKERS_SUPPORTED)return !1;var e=(r=f.URL||f.webkitURL||null,i=s.toString(),b.BLOB_URL||(b.BLOB_URL=r.createObjectURL(new Blob(["(",i,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var r,i;return t.onmessage=_,t.id=h++,a[t.id]=t}();return i.userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=q(t.step),t.chunk=q(t.chunk),t.complete=q(t.complete),t.error=q(t.error),delete t.worker,void i.postMessage({input:e,config:t,workerId:i.id})}var n=null;"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&q(e.read)&&q(e.on)?n=new m(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var i=!1,_=!0,g=",",v="\r\n",n='"',s=n+n,r=!1,a=null;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(g=t.delimiter);("boolean"==typeof t.quotes||Array.isArray(t.quotes))&&(i=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(r=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(n=t.quoteChar);"boolean"==typeof t.header&&(_=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");a=t.columns;}void 0!==t.escapeChar&&(s=t.escapeChar+n);}();var o=new RegExp(U(n),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,r);if("object"==typeof e[0])return u(a||h(e[0]),e,r)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:h(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],r);throw new Error("Unable to serialize unrecognized input");function h(e){if("object"!=typeof e)return [];var t=[];for(var r in e)t.push(r);return t}function u(e,t,r){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(i+=g),i+=y(e[a],a);0<t.length&&(i+=v);}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(r&&!n&&(u="greedy"===r?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===r&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c]);}u=""===d.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(i+=g);var m=n&&s?e[p]:p;i+=y(t[o][m],p);}o<t.length-1&&(!r||0<h&&!f)&&(i+=v);}}return i}function y(e,t){if(null==e)return "";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);e=e.toString().replace(o,s);var r="boolean"==typeof i&&i||Array.isArray(i)&&i[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return !0;return !1}(e,b.BAD_DELIMITERS)||-1<e.indexOf(g)||" "===e.charAt(0)||" "===e.charAt(e.length-1);return r?n+e+n:e}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=E,b.ParserHandle=r,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=m,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var r=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},r)});}),e(),this;function e(){if(0!==h.length){var e,t,r,i,n=h[0];if(q(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,r=n.inputElem,i=s.reason,void(q(o.error)&&o.error({name:e},t,r,i));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){q(a)&&a(e,n.file,n.inputElem),u();},b.parse(n.file,n.instanceConfig);}else q(o.complete)&&o.complete();}function u(){h.splice(0,1),e();}};}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new r(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&q(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);void 0!==r&&(e=r);}this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+e;this._partialLine="";var n=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=i.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(q(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!q(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0;},this._sendError=function(e){q(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1});};}function l(e){var i;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else {if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),n||(i.onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)),i.open("GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t]);}if(this._config.chunkSize){var r=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+r);}try{i.send();}catch(e){this._chunkError(e.message);}n&&0===i.status?this._chunkError():this._start+=this._config.chunkSize;}},this._chunkLoaded=function(){4===i.readyState&&(i.status<200||400<=i.status?this._chunkError():(this._finished=!this._config.chunkSize||this._start>function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return -1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(i),this.parseChunk(i.responseText)));},this._chunkError=function(e){var t=i.statusText||e;this._sendError(new Error(t));};}function c(e){var i,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((i=new FileReader).onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)):i=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t);}var r=i.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:r}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(i.error);};}function p(e){var r;u.call(this,e=e||{}),this.stream=function(e){return r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}};}function m(e){u.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0;},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=y(function(){this._streamCleanUp(),i=!0,this._streamData("");},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function r(g){var a,o,h,i=Math.pow(2,53),n=-i,s=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,u=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,r=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(q(g.step)){var p=g.step;g.step=function(e){if(c=e,_())m();else {if(m(),0===c.data.length)return;r+=e.data.length,g.preview&&r>g.preview?o.abort():p(c,t);}};}function v(e){return "greedy"===g.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function m(){if(c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),g.skipEmptyLines)for(var e=0;e<c.data.length;e++)v(c.data[e])&&c.data.splice(e--,1);return _()&&function(){if(!c)return;function e(e){q(g.transformHeader)&&(e=g.transformHeader(e)),l.push(e);}if(Array.isArray(c.data[0])){for(var t=0;_()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1);}else c.data.forEach(e);}(),function(){if(!c||!g.header&&!g.dynamicTyping&&!g.transform)return c;function e(e,t){var r,i=g.header?{}:[];for(r=0;r<e.length;r++){var n=r,s=e[r];g.header&&(n=r>=l.length?"__parsed_extra":l[r]),g.transform&&(s=g.transform(s,n)),s=y(n,s),"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(s)):i[n]=s;}return g.header&&(r>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+r,f+t):r<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+r,f+t)),i}var t=1;!c.data[0]||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);g.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function _(){return g.header&&0===l.length}function y(e,t){return r=e,g.dynamicTypingFunction&&void 0===g.dynamicTyping[r]&&(g.dynamicTyping[r]=g.dynamicTypingFunction(r)),!0===(g.dynamicTyping[r]||g.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<i)return !0}return !1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var r;}function k(e,t,r,i){c.errors.push({type:e,code:t,message:r,row:i});}this.parse=function(e,t,r){var i=g.quoteChar||'"';if(g.newline||(g.newline=function(e,t){e=e.substr(0,1048576);var r=new RegExp(U(t)+"([^]*?)"+U(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return "\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(e,i)),h=!1,g.delimiter)q(g.delimiter)&&(g.delimiter=g.delimiter(e),c.meta.delimiter=g.delimiter);else {var n=function(e,t,r,i,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new E({comments:i,delimiter:f,newline:t,preview:10}).parse(e),m=0;m<p.data.length;m++)if(r&&v(p.data[m]))c++;else {var _=p.data[m].length;l+=_,void 0!==o?0<_&&(d+=Math.abs(_-o),o=_):o=_;}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l);}return {successful:!!(g.delimiter=s),bestDelimiter:s}}(e,g.newline,g.skipEmptyLines,g.comments,g.delimitersToGuess);n.successful?g.delimiter=n.bestDelimiter:(h=!0,g.delimiter=b.DefaultDelimiter),c.meta.delimiter=g.delimiter;}var s=w(g);return g.preview&&g.header&&s.preview++,a=e,o=new E(s),c=o.parse(a,t,r),m(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=a.substr(o.getCharIndex());},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(this.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,q(g.complete)&&g.complete(c),a="";};}function U(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e){var O,D=(e=e||{}).delimiter,I=e.newline,T=e.comments,A=e.step,L=e.preview,F=e.fastMode,z=O=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(z=e.escapeChar),("string"!=typeof D||-1<b.BAD_DELIMITERS.indexOf(D))&&(D=","),T===D)throw new Error("Comment character same as delimiter");!0===T?T="#":("string"!=typeof T||-1<b.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==I&&"\r"!==I&&"\r\n"!==I&&(I="\n");var M=0,j=!1;this.parse=function(a,r,t){if("string"!=typeof a)throw new Error("Input must be a string");var i=a.length,e=D.length,n=I.length,s=T.length,o=q(A),h=[],u=[],f=[],d=M=0;if(!a)return R();if(F||!1!==F&&-1===a.indexOf(O)){for(var l=a.split(I),c=0;c<l.length;c++){if(f=l[c],M+=f.length,c!==l.length-1)M+=I.length;else if(t)return R();if(!T||f.substr(0,s)!==T){if(o){if(h=[],b(f.split(D)),S(),j)return R()}else b(f.split(D));if(L&&L<=c)return h=h.slice(0,L),R(!0)}}return R()}for(var p=a.indexOf(D,M),m=a.indexOf(I,M),_=new RegExp(U(z)+U(O),"g"),g=a.indexOf(O,M);;)if(a[M]!==O)if(T&&0===f.length&&a.substr(M,s)===T){if(-1===m)return R();M=m+n,m=a.indexOf(I,M),p=a.indexOf(D,M);}else {if(-1!==p&&(p<m||-1===m)){if(-1===g){f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}var v=x(p,g,m);if(v&&void 0!==v.nextDelim){p=v.nextDelim,g=v.quoteSearch,f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}}if(-1===m)break;if(f.push(a.substring(M,m)),C(m+n),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0)}else for(g=M,M++;;){if(-1===(g=a.indexOf(O,g+1)))return t||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:M}),w();if(g===i-1)return w(a.substring(M,g).replace(_,O));if(O!==z||a[g+1]!==z){if(O===z||0===g||a[g-1]!==z){var y=E(-1===m?p:Math.min(p,m));if(a[g+1+y]===D){f.push(a.substring(M,g).replace(_,O)),a[M=g+1+y+e]!==O&&(g=a.indexOf(O,M)),p=a.indexOf(D,M),m=a.indexOf(I,M);break}var k=E(m);if(a.substr(g+1+k,n)===I){if(f.push(a.substring(M,g).replace(_,O)),C(g+1+k+n),p=a.indexOf(D,M),g=a.indexOf(O,M),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:M}),g++;}}else g++;}return w();function b(e){h.push(e),d=M;}function E(e){var t=0;if(-1!==e){var r=a.substring(g+1,e);r&&""===r.trim()&&(t=r.length);}return t}function w(e){return t||(void 0===e&&(e=a.substr(M)),f.push(e),M=i,b(f),o&&S()),R()}function C(e){M=e,b(f),f=[],m=a.indexOf(I,M);}function R(e,t){return {data:t||!1?h[0]:h,errors:u,meta:{delimiter:D,linebreak:I,aborted:j,truncated:!!e,cursor:d+(r||0)}}}function S(){A(R(void 0,!0)),h=[],u=[];}function x(e,t,r){var i={nextDelim:void 0,quoteSearch:void 0},n=a.indexOf(O,t+1);if(t<e&&e<n&&(n<r||-1===r)){var s=a.indexOf(D,n);if(-1===s)return i;n<s&&(n=a.indexOf(O,n+1)),i=x(s,n,r);}else i={nextDelim:e,quoteSearch:t};return i}},this.abort=function(){j=!0;},this.getCharIndex=function(){return M};}function _(e){var t=e.data,r=a[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){i=!0,g(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:v,resume:v};if(q(r.userStep)){for(var s=0;s<t.results.data.length&&(r.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!i);s++);delete t.results;}else q(r.userChunk)&&(r.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!i&&g(t.workerId,t.results);}function g(e,t){var r=a[e];q(r.userComplete)&&r.userComplete(t),r.terminate(),delete a[e];}function v(){throw new Error("Not implemented.")}function w(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=w(e[r]);return t}function y(e,t){return function(){e.apply(t,arguments);}}function q(e){return "function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var r=b.parse(t.input,t.config);r&&f.postMessage({workerId:b.WORKER_ID,results:r,finished:!0});}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,b});
});

/* clsSMList\ListAuthoring.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMList\\ListAuthoring.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-1qzd0v1-style";
	style.textContent = ".height20.svelte-1qzd0v1{height:20px !important}.width125.svelte-1qzd0v1{width:125px}.width80.svelte-1qzd0v1{width:80px}.min_wid_95.svelte-1qzd0v1{min-width:95px}.width_max_content.svelte-1qzd0v1{width:max-content}.font17.svelte-1qzd0v1{font-size:15px!important}.custom_checkbox_new.svelte-1qzd0v1{display:block;position:relative;width:20px;height:20px;margin-bottom:0;cursor:pointer;font-size:18px}.width27.svelte-1qzd0v1{width:27px}.height27.svelte-1qzd0v1{height:27px !important}.width65.svelte-1qzd0v1{width:65px}td.svelte-1qzd0v1{text-align:center}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdEF1dGhvcmluZy5zdmVsdGUiLCJzb3VyY2VzIjpbIkxpc3RBdXRob3Jpbmcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XHJcbiAgICBpbXBvcnQgbCBmcm9tICcuLi9zcmMvbGlicy9lZGl0b3JMaWIvbGFuZ3VhZ2UuanMnO1xyXG4gICAgaW1wb3J0IHt3cml0YWJsZX0gZnJvbSAnc3ZlbHRlL3N0b3JlJztcclxuICAgIGltcG9ydCB7IG9uTW91bnQsYmVmb3JlVXBkYXRlLGFmdGVyVXBkYXRlIH0gZnJvbSBcInN2ZWx0ZVwiO1xyXG4gICAgaW1wb3J0IHtBSCxYTUxUb0pTT04sSlNPTlRvWE1MfSBmcm9tIFwiLi4vaGVscGVyL0hlbHBlckFJLnN2ZWx0ZVwiO1xyXG4gICAgaW1wb3J0IGRhdGFfcGFyc2VyIGZyb20gJy4vcGFwYXBhcnNlLm1pbic7XHJcbiAgICBpbXBvcnQgeyBCdXR0b24sIERpYWxvZywgQ2hlY2tib3ggfSBmcm9tICdzdmVsdGUtbXVpL3NyYyc7XHJcbiAgICBcclxuXHJcbiAgICBsZXQgc3RhdGUgPSB7fTtcclxuICAgIGxldCB0ZW1wX2FycmF5ID0gW107XHJcbiAgICBsZXQgZmlsZV9uYW1lO1xyXG4gICAgbGV0IGNoaWxkX2dlbmVyYXRlZDtcclxuICAgIGxldCByb3dfbm87XHJcbiAgICBsZXQgb2JqZWN0X2RhdGE7XHJcbiAgICBsZXQgY291bnQgPSB0cnVlOztcclxuXHJcbiAgICBcclxuXHJcblxyXG4gICAgZXhwb3J0IGxldCB4bWw7XHJcbiAgIC8vIGV4cG9ydCBsZXQgZ3VpZDtcclxuICAgIGV4cG9ydCBsZXQgZ2V0Q2hpbGRYbWw7XHJcbiAgICBleHBvcnQgbGV0IGVkaXRvclN0YXRlO1xyXG5cclxuICAgIFxyXG4gICAgLy9hbGVydChlZGl0b3JTdGF0ZS54bWwpO1xyXG4gICAgLy8vLy8vLy8vLy8vLy8vLyBEZXNjcmliZWQgc3RhdGVzLy8vLy8vLy8vLy8vXHJcblxyXG4gICAgbGV0IHN0YXRlRGF0YSA9IHdyaXRhYmxlKHtcclxuICAgICAgICB4bWwgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJyxcclxuICAgICAgICBoYW5kbGVfZGlzYWJsZV9zaG93ICAgICAgICAgOiB0cnVlLFxyXG4gICAgICAgIHNlbGVjdGVkX2xlbmd0aCAgICAgICAgICAgICA6IDAsXHJcbiAgICAgICAgZWRpdG9yTW9kYWxIYW5kbGUgICAgICAgICAgIDogZmFsc2UsXHJcbiAgICAgICAgY291bnRlciAgICAgICAgICAgICAgICAgICAgIDogMCxcclxuICAgICAgICBFZGl0b3JNb2RhbEJveCAgICAgICAgICAgICAgOiBmYWxzZVxyXG4gICAgfSlcclxuXHJcbiAgICBsZXQgbW9kYWwgPSB7XHJcblx0XHRcdGhlYWRlcjogW10sXHJcblx0XHRcdGJvZHk6IFtdLFxyXG5cdFx0XHRmb290ZXI6IFtdLFxyXG5cdFx0XHRtYXhXaWR0aDogJ3NtJyxcclxuICAgIH07XHJcbiAgICAgICAgXHJcbiAgICBjb25zdCB1bnN1YnNjcmliZSA9IHN0YXRlRGF0YS5zdWJzY3JpYmUoKGl0ZW1zKT0+e1xyXG4gICAgICAgIHN0YXRlID0gaXRlbXM7XHJcbiAgICB9KVxyXG5cclxuICAgIFxyXG5cclxuICAgIG9uTW91bnQoKCk9PntcclxuICAgICAgICAvLyB1c2VkIHRvIHNob3cgdGhlIHRvb2x0aXBcclxuICAgICAgICAvLyBqUXVlcnkoJyNhdXRob3JpbmdfY29udGFpbmVyJykudG9vbHRpcCh7XHJcbiAgICAgICAgLy8gICAgIHNlbGVjdG9yOiAnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXSdcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICAvLyBqUXVlcnkoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCAnLmNoZWNrYWxsJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8gICAgIGpRdWVyeSgnLnNlbGVjdF9lZGl0YWJsZV9ndWlkJykucHJvcCgnY2hlY2tlZCcsIGpRdWVyeSh0aGlzKS5wcm9wKCdjaGVja2VkJykpO1xyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIEFILmxpc3Rlbihkb2N1bWVudCwnY2hhbmdlJywnLmNoZWNrYWxsJywoKF90aGlzKT0+e1xyXG4gICAgICAgICAgICBBSC5zZWxlY3RBbGwoJy5zZWxlY3RfZWRpdGFibGVfZ3VpZCcse2NoZWNrZWQ6X3RoaXMuZ2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiKX0pO1xyXG4gICAgICAgIH0pKVxyXG4gICAgICAgIC8vIGpRdWVyeShkb2N1bWVudCkub24oJ2NoYW5nZScsICcuY2hlY2thbGwsIC5zZWxlY3RfZWRpdGFibGVfZ3VpZCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vICAgICB2YXIgc2VsZWN0ZWRfbGVuZ3RoID0galF1ZXJ5KCcuc2VsZWN0X2VkaXRhYmxlX2d1aWQ6Y2hlY2tlZCcpLmxlbmd0aDtcclxuICAgICAgICAvLyAgICAgaWYgKHNlbGVjdGVkX2xlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgIC8vICAgICAgICAgc3RhdGUuaGFuZGxlX2Rpc2FibGVfc2hvdyA9IGZhbHNlO1xyXG4gICAgICAgIC8vICAgICAgICAgc3RhdGUuc2VsZWN0ZWRfbGVuZ3RoID0gc2VsZWN0ZWRfbGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgc3RhdGUuaGFuZGxlX2Rpc2FibGVfc2hvdyA9IHRydWU7XHJcbiAgICAgICAgLy8gICAgICAgICAgICAgc3RhdGUuc2VsZWN0ZWRfbGVuZ3RoID0gMDtcclxuICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgIC8vIH0pO1xyXG4gICAgICAgIEFILmxpc3Rlbihkb2N1bWVudCwnY2hhbmdlJywnLmNoZWNrYWxsLCAuc2VsZWN0X2VkaXRhYmxlX2d1aWQnLGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRfbGVuZ3RoID0gQUguc2VsZWN0KCcuc2VsZWN0X2VkaXRhYmxlX2d1aWQnLCdjaGVja2VkJykubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWRfbGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5oYW5kbGVfZGlzYWJsZV9zaG93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5zZWxlY3RlZF9sZW5ndGggPSBzZWxlY3RlZF9sZW5ndGg7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5oYW5kbGVfZGlzYWJsZV9zaG93ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5zZWxlY3RlZF9sZW5ndGggPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSlcclxuICAgIH0pXHJcblxyXG4gICAgYWZ0ZXJVcGRhdGUoKCk9PntcclxuICAgICAgICBpZiAoeG1sICE9IHN0YXRlLnhtbCkge1xyXG4gICAgICAgICAgICBzdGF0ZS54bWwgPSB4bWw7XHJcbiAgICAgICAgICAgIGxvYWRNb2R1bGUoeG1sKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGVkaXRvclN0YXRlLmd1aWQgJiYgc3RhdGUuZGF0YV9jZGF0YSAmJiBzdGF0ZS5kYXRhX2NkYXRhWzBdLnBnID09ICcnKSB7XHJcbiAgICAgICAgICAgIHNldFBhcmVudEd1aWQoZWRpdG9yU3RhdGUuZ3VpZCk7XHJcbiAgICAgICAgfVxyXG4gICAgfSlcclxuXHJcbiAgICAgLy8gbG9hZHMgdGhlIG1vZHVsZVxyXG4gICAgZnVuY3Rpb24gbG9hZE1vZHVsZSh4bWwpIHtcclxuICAgICAgICAvLyBjb250YWlucyB0aGUganNvbiBkYXRhIG9mIHhtbFxyXG4gICAgICAgIGxldCBuZXdYTUwgPSBYTUxUb0pTT04oeG1sKTtcclxuICAgICAgICAvLyB1c2VkIGZvciBwYXJzZSB0aGUgeG1sIGFuZCB1cGRhdGVzIHRoZSB4bWxcclxuICAgICAgICBwYXJzZVhNTEF1dGhvcmluZyhuZXdYTUwpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHBhcnNlcyB0aGUgeG1sIGRhdGEgYW5kIHVwZGF0ZSB0aGUgeG1sXHJcbiAgICBmdW5jdGlvbiBwYXJzZVhNTEF1dGhvcmluZyhNWVhNTCkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmKGNvdW50KSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBvZiBlYWNoIHJvd3MgaW4gdGhlIGZvcm0gb2YganNvbiBcclxuICAgICAgICAgICAgICAgIHRlbXBfYXJyYXkgPSBKU09OLnBhcnNlKE1ZWE1MLnNteG1sLl9fY2RhdGEpLmxpc3Q7XHJcbiAgICAgICAgICAgICAgICBjb3VudCA9ZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3RhdGUuZGF0YV9jZGF0YSA9IHRlbXBfYXJyYXk7XHJcbiAgICAgICAgICAgIHN0YXRlLnhtbCA9IE1ZWE1MO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgJ2Vycm9yJzogZXJyb3IgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAgLy8gdXNlZCBmb3IgaW1wb3J0IHRoZSBjc3YgZmlsZVxyXG4gICAgZnVuY3Rpb24gaGFuZGxlSW1wb3J0KCkge1xyXG4gICAgICAgIC8vIG9wZW5zIHRoZSBmaWxlIHNlbGVjdCBkaWFsb2cgYm94IGZvciBpbXBvcnQgdGhlIGNzdlxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNmaWxlVXBsb2FkJykuY2xpY2soKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXNlZCBmb3IgdXBkYXRlIHRoZSB4bWxcclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVhNTChjZGF0YV92YWx1ZSkge1xyXG4gICAgICAgIC8vIHVwZGF0ZXMgdGhlIGNkYXRhIHZhbHVlIG9mIHhtbFxyXG4gICAgICAgIHN0YXRlLnhtbC5zbXhtbC5fX2NkYXRhID0gY2RhdGFfdmFsdWU7XHJcbiAgICAgICAgLy8gdXBkYXRlcyB0aGUgeG1sXHJcbiAgICAgICAgZ2V0Q2hpbGRYbWwoSlNPTlRvWE1MKHN0YXRlLnhtbCkpOyBcclxuICAgIH1cclxuXHJcbiAgICAvL3VzZWQgZm9yIHVwZGF0ZSB0aGUgY29sdW1uKHMpIHZhbHVlIGluIHhtbFxyXG4gICAgZnVuY3Rpb24gaGFuZGxlRWRpdChldmVudCkge1xyXG4gICAgICAgIC8vIGNvbnRhaW5zIHRoZSBpZCBvZiB0aGF0IGNvbHVtbiBpbiB3aGljaCBjaGFuZ2VzIG1hZGVcclxuICAgICAgICBsZXQgdGFyZ2V0X2lkID0gZXZlbnQudGFyZ2V0LmlkO1xyXG4gICAgICAgIC8vIGZpbmRzIHRoZSByb3cgbm8gaW4gd2hpY2ggY2hhbmdlcyBtYWRlXHJcbiAgICAgICAgcm93X25vID0gdGFyZ2V0X2lkLnNwbGl0KCdfJylbMV07XHJcbiAgICAgICAgLy8gZmluZHMgdGhlIGNvbHVtbiBubyBpbiB3aGljaCBjaGFuZ2VzIG1hZGVcclxuICAgICAgICBsZXQgY29sX25vID0gdGFyZ2V0X2lkLnNwbGl0KCdfJylbMl07XHJcbiAgICAgICAgLy8gY29udGFpbnMgcHJldmlvdXMgY29sdW1uIHZhbHVlXHJcbiAgICAgICAgbGV0IHByZXZpb3VzX2RhdGE7XHJcbiAgICAgICAgLy8gdXBkYXRlcyB0aGUgcmVzcGVjdGl2ZSBjb2x1bW4gdmFsdWUgYWNjb3JkaW5nIHRvIGNoYW5nZSBpbiBjb2x1bW4gdmFsdWVcclxuICAgICAgICAoKGNvbF9ubyA9PSAwKSA/IChwcmV2aW91c19kYXRhID0gc3RhdGUuZGF0YV9jZGF0YVtyb3dfbm9dLmMxLCBzdGF0ZS5kYXRhX2NkYXRhW3Jvd19ub10uYzEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRhcmdldF9pZCkuaW5uZXJUZXh0KSA6IChwcmV2aW91c19kYXRhID0gc3RhdGUuZGF0YV9jZGF0YVtyb3dfbm9dLmMyLCBzdGF0ZS5kYXRhX2NkYXRhW3Jvd19ub10uYzIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjJyArIHRhcmdldF9pZCkuaW5uZXJUZXh0KSk7XHJcbiAgICAgICAgLy8gdXBkYXRlcyB0aGUgeG1sXHJcbiAgICAgICAgdXBkYXRlWE1MKEpTT04uc3RyaW5naWZ5KHsgXCJsaXN0XCI6IHN0YXRlLmRhdGFfY2RhdGEgfSkpO1xyXG4gICAgICAgIGlmIChzdGF0ZS5kYXRhX2NkYXRhW3Jvd19ub10uY2cgJiYgKChjb2xfbm8gPT0gMCkgPyAocHJldmlvdXNfZGF0YSAhPSBzdGF0ZS5kYXRhX2NkYXRhW3Jvd19ub10uYzEpOiAocHJldmlvdXNfZGF0YSAhPSBzdGF0ZS5kYXRhX2NkYXRhW3Jvd19ub10uYzIpKSkge1xyXG4gICAgICAgICAgICAvLyBtb2RhbCA9IHtcclxuICAgICAgICAgICAgLy8gICAgIGhlYWRlcjoge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgIGJvZHk6ICg8ZGl2PntsLnNhdmVfaGVhZGVyfTwvZGl2PiksXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgY2xhc3M6IFwiZWRpdG9yX21vZGFsX3RpdGxlXCJcclxuICAgICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgIC8vICAgICBib2R5OiB7XHJcbiAgICAgICAgICAgIC8vICAgICBib2R5OiAoPGRpdj57bC5jaGlsZF91cGRhdGV9PC9kaXY+KSxcclxuICAgICAgICAgICAgLy8gICAgICAgICBjbGFzczogXCJlZGl0b3JfbW9kYWxfY29udGVudFwiLFxyXG4gICAgICAgICAgICAvLyAgICAgICAgIHN0eWxlOiB7aGVpZ2h0OiAnYXV0byd9XHJcbiAgICAgICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgICAgICAvLyAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgYm9keTogW3tsYWJlbDogJ09LJywgY2xhc3M6IFwiYmctcHJpbWFyeSB0ZXh0LXdoaXRlXCIsIG9uQWN0aW9uOiAoKT0+IHNlbGYuaGFuZGxlVXBkYXRlKHJvd19ubyl9XSxcclxuICAgICAgICAgICAgLy8gICAgICAgICBjbGFzczogXCJlZGl0b3JfbW9kYWxfYWN0aW9uXCJcclxuICAgICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgIC8vICAgICBtYXhXaWR0aDogJ3NtJyxcclxuICAgICAgICAgICAgLy8gfTtcclxuICAgICAgICAgICAgc3RhdGUuRWRpdG9yTW9kYWxCb3ggPSB0cnVlO1xyXG4gICAgICAgICAgICBlZGl0b3JNb2RhbFVwZGF0ZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXNlZCBmb3IgdXBkYXRlIHRoZSBndWlkcyB3aGljaCBleGlzdCBpbiBcIkN1cnJlbnQgR3VpZFwiIGFuZCBcIlVzZWQgaW4gR3VpZHNcIiBmaWVsZCBvZiByZXNwZWN0aXZlIHJvd1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlVXBkYXRlKHJvd05vKSB7XHJcbiAgICAgICAgZWRpdG9yTW9kYWxVcGRhdGUoZmFsc2UpO1xyXG4gICAgICAgIHVwZGF0ZU9sZEd1aWRzT3B0aW9uKHJvd05vLCBzdGF0ZS5kYXRhX2NkYXRhW3Jvd05vXS5jZywgc3RhdGUuZGF0YV9jZGF0YVtyb3dOb10ucGcsIHN0YXRlLmRhdGFfY2RhdGFbcm93Tm9dLnJuLCBzdGF0ZS5kYXRhX2NkYXRhW3Jvd05vXS5hZyk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIGdlbmVyYXRlcyB0aGUgZ3VpZCBmb3IgZWFjaCByb3dzXHJcbiAgICBmdW5jdGlvbiBnZW5lcmF0ZUl0ZW1zKHBhcmVudF9ndWlkLCBjdXJyZW50X3Jvd192YWwpIHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIC8vIHN0b3JlcyB0aGUgcmFuZG9tIHJvdyBub1xyXG4gICAgICAgICAgICAgICAgbGV0IHJhbmRvbV9yb3dzID0gW10sIHJhbmRvbVJvd05vO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8gPSAwOyBpbmRleF9ubyA8IDM7IGluZGV4X25vICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgcmFuZG9tIHJvdyBubyByZXR1cm5lZCBieSB0aGUgbWV0aG9kIFwiZmluZFJhbmRvbVJvd05vXCJcclxuICAgICAgICAgICAgICAgICAgICByYW5kb21Sb3dObyA9IGZpbmRSYW5kb21Sb3dObyhjdXJyZW50X3Jvd192YWwsIHJhbmRvbV9yb3dzKTtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoIXJhbmRvbVJvd05vKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGxzIHRoZSBtZXRob2QgXCJmaW5kUmFuZG9tUm93Tm9cIiB0aWxsIGl0IGRvZXMgbm90IGdldCB0aGUgcm93IG5vXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbVJvd05vID0gZmluZFJhbmRvbVJvd05vKGN1cnJlbnRfcm93X3ZhbCwgcmFuZG9tX3Jvd3MpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAocmFuZG9tUm93Tm8pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSByb3cgbm8gcmVjZWl2ZWQgcmFuZG9tbHlcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZG9tX3Jvd3MucHVzaChyYW5kb21Sb3dObyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBsZXQgYWxnb194bWxfZGF0YSA9IEFILmdldCgnYWxnb192YXJfZGF0YScpO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBhbGdvX3htbF9kYXRhID0gYWxnb194bWxfZGF0YSAmJiBhbGdvX3htbF9kYXRhLnJlcGxhY2UoL1wiL2dtLCBcIlxcXCJcIik7XHJcbiAgICAgICAgICAgICAgICAvLyBjcmVhdGVzIHRoZSBvYmplY3QgdGhhdCBoYXMgdG8gYmUgc2VuZCBmb3IgZ2VuZXJhdGUgdGhlIGd1aWQgb24gc2VydmVyIHNpZGVcclxuICAgICAgICAgICAgICAgIGxldCBxdWVzdGlvbl9vYmogPSB7IFwicXVlc3Rpb25cIjogXCJcIiwgXCJhbnN3ZXJzXCI6IFtdLCBcImNvcnJlY3RfYW5zX3N0clwiOiBcIkFcIiwgXCJ0b3RhbF9hbnN3ZXJzXCI6IDQsIFwiY29ycmVjdF9hbnN3ZXJzXCI6IDEsIFwidGl0bGVcIjogXCJcIiwgXCJwYXJlbnRfZ3VpZFwiOiBwYXJlbnRfZ3VpZCwgXCJleHBsYW5hdGlvblwiOiBcIkFuc3dlciA8c2VxIG5vPVxcXCJhXFxcIj48L3NlcT4gaXMgY29ycmVjdC5cIiwgXCJhbGdvX3F4bWxcIjogYWxnb194bWxfZGF0YX07XHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSBjb3JyZWN0IGFuc3dlciB2YWx1ZSBpbiBhcnJheSBrZXkgYW5zd2VycyBvZiBvYmplY3QgcXVlc3Rpb25fb2JqXHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbl9vYmouYW5zd2Vycy5wdXNoKHsgXCJpc19jb3JyZWN0XCI6IFwiMVwiLCBcImFuc3dlclwiOiBzdGF0ZS5kYXRhX2NkYXRhW2N1cnJlbnRfcm93X3ZhbF0uYzIsIFwiaWRcIjogXCIwMVwiIH0pO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8xID0gMDsgaW5kZXhfbm8xIDwgMzsgaW5kZXhfbm8xICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSBvdGhlciBvcHRpb25zIHZhbHVlIGluIGFycmF5IGtleSBhbnN3ZXJzIG9mIG9iamVjdCBxdWVzdGlvbl9vYmpcclxuICAgICAgICAgICAgICAgICAgICBxdWVzdGlvbl9vYmouYW5zd2Vycy5wdXNoKHsgXCJpc19jb3JyZWN0XCI6IFwiMFwiLCBcImFuc3dlclwiOiBzdGF0ZS5kYXRhX2NkYXRhW3JhbmRvbV9yb3dzW2luZGV4X25vMV1dLmMyLCBcImlkXCI6IFwiMFwiICsgKGluZGV4X25vMSArIDIpIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gc2V0cyB0aGUgdGl0bGUgZm9yIGd1aWRcclxuICAgICAgICAgICAgICAgIC8vcXVlc3Rpb25fb2JqLnRpdGxlID0gJCgnI3RpdGxlJykuaHRtbCgpICsgJzogJyArIHN0YXRlLmRhdGFfY2RhdGFbY3VycmVudF9yb3dfdmFsXS5jMTtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uX29iai50aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aXRsZScpLmlubmVySFRNTCArICc6ICcgKyBzdGF0ZS5kYXRhX2NkYXRhW2N1cnJlbnRfcm93X3ZhbF0uYzE7XHJcbiAgICAgICAgICAgICAgICAvLyBzZXRzIHRoZSBxdWVzdGlvbiBkYXRhIGZvciBndWlkXHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbl9vYmoucXVlc3Rpb24gPSBzdGF0ZS5kYXRhX2NkYXRhW2N1cnJlbnRfcm93X3ZhbF0uYzE7XHJcbiAgICAgICAgICAgICAgICAvLyByZXF1ZXN0IGZvciBnZXQgdGhlIGd1aWRcclxuICAgICAgICAgICAgICAgIC8vIEFILmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIC8vYWpheDogXCIxXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgdXJsOiBiYXNlVXJsICsgJ2VkaXRvci9pbmRleC5waHAnLCAvLyBkZW5vdGVzIGZpbGUgd2hlcmUgYWpheCByZXF1ZXN0IHdpbGwgYmUgaGFuZGxlIGJ5IHNlcnZlclxyXG4gICAgICAgICAgICAgICAgLy8gICAgLy8gY2FjaGU6IGZhbHNlLCAvLyBkb2VzIG5vdCBzdG9yZXMgcmVxdWVzdCBkYXRhIGluIGNhY2hlIG1lbW9yeVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgc3RyX2NvbnRlbnQ6IHF1ZXN0aW9uX29iaiwgLy8gb2JqZWN0IGRhdGEgd2hpY2ggbmVlZHMgdG8gYmUgdXNlZCBmb3IgY3JlYXRlIHRoZSBuZXcgZ3VpZFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBmdW5jOiBcImdldF9ndWlkX2Zyb21fYXBpXCIsIC8vIGNvbmRpdGlvbiBpbiB3aGljaCBibG9jayBhamF4IHJlcXVlc3Qgd2lsbCBiZSByZWNlaXZlZCBhbmQgcmVzcG9uc2Ugd2lsbCBiZSBzZW5kIGZyb20gc2VydmVyXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8vc25pcHBldDogJCgnI3RpdGxlJykuaHRtbCgpICsgJzogJyArIHNlbGYuc3RhdGUuZGF0YV9jZGF0YVtjdXJyZW50X3Jvd192YWxdLmMxXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHNuaXBwZXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aXRsZScpLmlubmVySFRNTCArICc6ICcgKyBzdGF0ZS5kYXRhX2NkYXRhW2N1cnJlbnRfcm93X3ZhbF0uYzFcclxuICAgICAgICAgICAgICAgIC8vICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6IFwicG9zdFwiLCAvLyB1c2VkIGZvciBzZWN1cml0eSBwdXJwb3NlXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSByZXNwb25zZSBpbiBvYmplY3QgZm9ybVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB2YXIganNvbl9yZWNlaXZlZF9zdHJpbmcgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYgKGpzb25fcmVjZWl2ZWRfc3RyaW5nICYmIGpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gc3RvcmVzIHRoZSBnZW5lcmF0ZWQgZ3VpZCBpbiBjdXJyZW50X2d1aWQga2V5IG9mIHJlc3BlY3RpdmUgcm93XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0ZW1wX2FycmF5W2N1cnJlbnRfcm93X3ZhbF0uY2cgPSBqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQ7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBmb3IgKHZhciBpbmRleF9ubzEgPSAwOyBpbmRleF9ubzEgPCAzOyBpbmRleF9ubzEgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vIHN0b3JlcyB0aGUgZ2VuZXJhdGVkIGd1aWQgaW4gYWxsIHJvd3MgXCJ1c2VkX2luX2d1aWRzXCIga2V5IHdpdGggdGhlIGhlbHAgb2Ygd2hpY2ggY3VycmVudCBndWlkIGlzIGdlbmVyYXRlZFxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRlbXBfYXJyYXlbcmFuZG9tX3Jvd3NbaW5kZXhfbm8xXV0uYWcucHVzaChqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vIHN0b3JlcyB0aGUgcm93IG5vIHdoaWNoIGFyZSB1c2VkIGZvciBjcmVhdGUgdGhlIGdlbmVyYXRlZCBndWlkXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGVtcF9hcnJheVtjdXJyZW50X3Jvd192YWxdLnJuLnB1c2gocmFuZG9tX3Jvd3NbaW5kZXhfbm8xXSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAoY3VycmVudF9yb3dfdmFsID09IChzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGUgeG1sIHdpdGggY3JlYXRlZCBndWlkc1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHVwZGF0ZVhNTChKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiB0ZW1wX2FycmF5IH0pKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICByZXNvbHZlKGpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcbiAgICAgICAgICAgICAgICBBSC5hamF4KHtcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB1cmw6IGJhc2VVcmwgKyAnZWRpdG9yL2luZGV4LnBocCcsXHJcbiAgICAgICAgICAgICAgICAgICAgbG9uZ0RhdGE6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJfY29udGVudDogSlNPTi5zdHJpbmdpZnkocXVlc3Rpb25fb2JqKSwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmM6IFwiZ2V0X2d1aWRfZnJvbV9hcGlcIiwgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNuaXBwZXQ6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aXRsZScpLmlubmVySFRNTCArICc6ICcgKyBzdGF0ZS5kYXRhX2NkYXRhW2N1cnJlbnRfcm93X3ZhbF0uYzEsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbkVuZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFILmFjdGl2YXRlKDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cclxuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cclxuICAgICAgICAgICAgICAgICAgICBsZXQganNvbl9yZWNlaXZlZF9zdHJpbmcgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoanNvbl9yZWNlaXZlZF9zdHJpbmcgJiYganNvbl9yZWNlaXZlZF9zdHJpbmcuY29udGVudF9ndWlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlcyB0aGUgZ2VuZXJhdGVkIGd1aWQgaW4gY3VycmVudF9ndWlkIGtleSBvZiByZXNwZWN0aXZlIHJvd1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wX2FycmF5W2N1cnJlbnRfcm93X3ZhbF0uY2cgPSBqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4X25vMSA9IDA7IGluZGV4X25vMSA8IDM7IGluZGV4X25vMSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZXMgdGhlIGdlbmVyYXRlZCBndWlkIGluIGFsbCByb3dzIFwidXNlZF9pbl9ndWlkc1wiIGtleSB3aXRoIHRoZSBoZWxwIG9mIHdoaWNoIGN1cnJlbnQgZ3VpZCBpcyBnZW5lcmF0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBfYXJyYXlbcmFuZG9tX3Jvd3NbaW5kZXhfbm8xXV0uYWcucHVzaChqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc3RvcmVzIHRoZSByb3cgbm8gd2hpY2ggYXJlIHVzZWQgZm9yIGNyZWF0ZSB0aGUgZ2VuZXJhdGVkIGd1aWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBfYXJyYXlbY3VycmVudF9yb3dfdmFsXS5ybi5wdXNoKHJhbmRvbV9yb3dzW2luZGV4X25vMV0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50X3Jvd192YWwgPT0gKHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIHhtbCB3aXRoIGNyZWF0ZWQgZ3VpZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVhNTChKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiB0ZW1wX2FycmF5IH0pKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vdXBkYXRlWE1MKEpTT04uc3RyaW5naWZ5KHsgXCJsaXN0XCI6IE9iamVjdC5hc3NpZ24oe30sdGVtcF9hcnJheSkgfSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coeydlcnJvcic6IGVycm9yfSk7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIHJldHVybnMgdGhlIHJhbmRvbSByb3cgbm9cclxuICAgIGZ1bmN0aW9uIGZpbmRSYW5kb21Sb3dObyhjdXJyZW50X3Jvd19ubywgcmFuZG9tX3Jvd3MpIHtcclxuICAgICAgICAvLyBjb250YWlucyB0aGUgcmFuZG9tIG5vXHJcbiAgICAgICAgbGV0IHJhbmRvbV9yb3dfdmFsdWUgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGggLSAxKSkgKyAxO1xyXG4gICAgICAgIGlmIChyYW5kb21fcm93X3ZhbHVlID09IGN1cnJlbnRfcm93X25vIHx8IHJhbmRvbV9yb3dzLmluZGV4T2YocmFuZG9tX3Jvd192YWx1ZSkgPiAtMSkge1xyXG4gICAgICAgICAgICAvLyByZXR1bnMgdGhlIGZhbHNlIGlmIGl0IGlzIGVxdWFsIHRvIGN1cnJlbnQgcm93IG9yIGFscmVhZHkgc3RvcmVkIGluIHJhbmRvbV9yb3dzIGFycmF5XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyByZXR1bnMgdGhlIHJhbmRvbSB2YWx1ZSBpZiBpdCBpcyBub3QgZXF1YWwgdG8gY3VycmVudCByb3cgYW5kIG5laXRoZXIgc3RvcmVkIGluIHJhbmRvbV9yb3dzIGFycmF5XHJcbiAgICAgICAgICAgIHJldHVybiByYW5kb21fcm93X3ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VkIGZvciBkZWxldGUgdGhlIHJvd1xyXG4gICAgZnVuY3Rpb24gaGFuZGxlRGVsZXRlKGluZGV4X25vKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2NoZWNraW5nJyk7XHJcbiAgICAgICAgaWYgKHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoID49IDYpIHtcclxuICAgICAgICAgICAgLy8gcmVtb3ZlcyB0aGUgcmVzcGVjdGl2ZSByb3cgZnJvbSB4bWxcclxuICAgICAgICAgICAgc3RhdGUuZGF0YV9jZGF0YS5zcGxpY2UoaW5kZXhfbm8sIDEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIEFILnNob3dtc2cobC5taW40X3Jvd3NfYWxsb3dlZCwgNDAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghc3RhdGUuZGF0YV9jZGF0YVsxXS5jZyB8fCBzdGF0ZS5kYXRhX2NkYXRhW3N0YXRlLmRhdGFfY2RhdGEubGVuZ3RoIC0gMV0uY2cpIHtcclxuICAgICAgICAgICAgLy8gdXNlZCBmb3IgZGlzYWJsZWQgdGhlIEdlbmVyYXRlL1VwZGF0ZSBJdGVtcyBidXR0b25cclxuICAgICAgICAgICAgc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9IDE7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gdXNlZCBmb3IgZW5hYmxlZCB0aGUgR2VuZXJhdGUvVXBkYXRlIEl0ZW1zIGJ1dHRvblxyXG4gICAgICAgICAgICBzdGF0ZS54bWwuc214bWwuX2Rpc2FibGVkX2dlbmVyYXRlID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdXBkYXRlcyB0aGUgeG1sXHJcbiAgICAgICAgdXBkYXRlWE1MKEpTT04uc3RyaW5naWZ5KHsgXCJsaXN0XCI6IHN0YXRlLmRhdGFfY2RhdGEgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVwZGF0ZXMgdGhlIGd1aWRzIGRhdGFcclxuICAgIGZ1bmN0aW9uIGFqYXhSZXF1ZXN0Rm9yRGF0YVVwZGF0ZShyb3dObywgY3VycmVudF9ndWlkLCByb3dfbm9fYXJyYXksIHBhcmVudF9ndWlkLCBjbG9zZV9hY3RpdmF0b3IpIHtcclxuICAgICAgICAvLyBvYmplY3QgdGhhdCBoYXMgdG8gYmUgc2VuZCBvbiBzZXJ2ZXIgZm9yIHVwZGF0ZSB0aGUgZ3VpZFxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGxldCBhbGdvX3htbF9kYXRhMSA9IEFILmdldCgnYWxnb192YXJfZGF0YScpO1xyXG4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIGFsZ29feG1sX2RhdGExID0gYWxnb194bWxfZGF0YTEgJiYgYWxnb194bWxfZGF0YTEucmVwbGFjZSgvXCIvZ20sIFwiXFxcIlwiKTtcclxuICAgICAgICAgICAgICAgIGxldCBxdWVzdGlvbl9vYmogPSB7IFwicXVlc3Rpb25cIjogc3RhdGUuZGF0YV9jZGF0YVtyb3dOb10uYzEsIFwiYW5zd2Vyc1wiOiBbXSwgXCJjb3JyZWN0X2Fuc19zdHJcIjogXCJBXCIsIFwidG90YWxfYW5zd2Vyc1wiOiA0LCBcImNvcnJlY3RfYW5zd2Vyc1wiOiAxLCBcInRpdGxlXCI6IHN0YXRlLnhtbC5zbXhtbC5fcHQgKyBcIjogXCIgKyBzdGF0ZS5kYXRhX2NkYXRhW3Jvd05vXS5jMSwgXCJwYXJlbnRfZ3VpZFwiOiBwYXJlbnRfZ3VpZCwgXCJleHBsYW5hdGlvblwiOiBcIkFuc3dlciA8c2VxIG5vPVxcXCJhXFxcIj48L3NlcT4gaXMgY29ycmVjdC5cIiwgXCJhbGdvX3F4bWxcIjogYWxnb194bWxfZGF0YTF9O1xyXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGUgYW5zd2VycyBrZXkgZGF0YSBvZiBvYmplY3QgXCJxdWVzdGlvbl9vYmpcIlxyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25fb2JqLmFuc3dlcnMucHVzaCh7IFwiaXNfY29ycmVjdFwiOiBcIjFcIiwgXCJhbnN3ZXJcIjogc3RhdGUuZGF0YV9jZGF0YVtyb3dOb10uYzIsIFwiaWRcIjogXCIwMVwiIH0pO1xyXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8xID0gMDsgaW5kZXhfbm8xIDwgMzsgaW5kZXhfbm8xICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSBhbnN3ZXJzIGtleSBkYXRhIG9mIG9iamVjdCBcInF1ZXN0aW9uX29ialwiXHJcbiAgICAgICAgICAgICAgICAgICAgcXVlc3Rpb25fb2JqLmFuc3dlcnMucHVzaCh7IFwiaXNfY29ycmVjdFwiOiBcIjBcIiwgXCJhbnN3ZXJcIjogc3RhdGUuZGF0YV9jZGF0YVtyb3dfbm9fYXJyYXlbaW5kZXhfbm8xXV0uYzIsIFwiaWRcIjogXCIwXCIgKyAoaW5kZXhfbm8xICsgMikgfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBhamF4IHJlc3F1ZXN0IGZvciB1cGRhdGUgdGhlIGd1aWRcclxuICAgICAgICAgICAgICAgIC8vIEFILmFqYXgoe1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGFqYXg6IFwiMVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHVybDogYmFzZVVybCArICdlZGl0b3IvaW5kZXgucGhwJywgLy8gZGVmaW5lcyB3aGVyZSBhamF4IHJlcXVlc3Qgd2lsbCBiZSBzZW5kXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgY2FjaGU6IGZhbHNlLCAvLyBkb2VzIG5vdCBzdG9yZXMgZGF0YSBpbiBjYWNoZSBtZW1vcnlcclxuICAgICAgICAgICAgICAgIC8vICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHN0cl9jb250ZW50OiBxdWVzdGlvbl9vYmosIC8vIGRhdGEgaW4gdGhlIGZvcm0gb2Ygb2JqZWN0IGZvciB1cGRhdGUgdGhlIGd1aWRcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgZnVuYzogXCJ1cGRhdGVfZ3VpZF9mcm9tX2FwaVwiLCAvLyBkZWZpbmVzIHRoZSBjb25kaWRpdG9uIGluIHdoaWNoIGl0IGNhbiBiZSBhY2Nlc3Mgb24gc2VydmVyIHNpZGVcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29udGVudF9ndWlkOiBjdXJyZW50X2d1aWQgLy8gc2VuZHMgdGhlIGd1aWQgdGhhdCBoYXMgdG8gYmUgdXBkYXRlXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSxcclxuICAgICAgICAgICAgICAgIC8vICAgICB0eXBlOiBcInBvc3RcIiwgLy8gc2VuZCB0aGUgZGF0YSB3aXRoIGZvciBzZWN1cml0eVxyXG4gICAgICAgICAgICAgICAgLy8gICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgdmFyIGpzb25fcmVjZWl2ZWRfc3RyaW5nID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmIChqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQgJiYgKGNsb3NlX2FjdGl2YXRvciA9PSB0cnVlKSkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gY2xvc2UgdGhlIGFjdGl2YXRvclxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgY29uc29sZS5sb2coJ2FqYXhSZXF1ZXN0Rm9yRGF0YVVwZGF0ZScpO1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgQUguYWN0aXZhdGUoMCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAvLyBzaG93cyB0aGUgd2FybmluZyBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIEFJICYmIEFJLnNob3dtc2cobC5jaGlsZF91cGRhdGVkLCA0MDAwKTtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICByZXNvbHZlKGpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgQUguYWpheCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBiYXNlVXJsICsgJ2VkaXRvci9pbmRleC5waHAnLFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyX2NvbnRlbnQ6IHF1ZXN0aW9uX29iaiwgLy8gZGF0YSBpbiB0aGUgZm9ybSBvZiBvYmplY3QgZm9yIHVwZGF0ZSB0aGUgZ3VpZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jOiBcInVwZGF0ZV9ndWlkX2Zyb21fYXBpXCIsIC8vIGRlZmluZXMgdGhlIGNvbmRpZGl0b24gaW4gd2hpY2ggaXQgY2FuIGJlIGFjY2VzcyBvbiBzZXJ2ZXIgc2lkZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50X2d1aWQ6IGN1cnJlbnRfZ3VpZCAvLyBzZW5kcyB0aGUgZ3VpZCB0aGF0IGhhcyB0byBiZSB1cGRhdGVcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIG9uRW5kOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQUguYWN0aXZhdGUoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHJlc3BvbnNlIGluIG9iamVjdCBmb3JtXHJcbiAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSByZXNwb25zZSBpbiBvYmplY3QgZm9ybVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQganNvbl9yZWNlaXZlZF9zdHJpbmcgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCAmJiAoY2xvc2VfYWN0aXZhdG9yID09IHRydWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjbG9zZSB0aGUgYWN0aXZhdG9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWpheFJlcXVlc3RGb3JEYXRhVXBkYXRlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBSC5hY3RpdmF0ZSgwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3dzIHRoZSB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQUkgJiYgQUguc2hvd21zZyhsLmNoaWxkX3VwZGF0ZWQsIDQwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbl9yZWNlaXZlZF9zdHJpbmcuY29udGVudF9ndWlkKTtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHsnZXJyb3InOiBlcnJvcn0pO1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU9sZEd1aWRzT3B0aW9uKHJvd05vLCBjdXJyZW50X2d1aWQsIHBhcmVudF9ndWlkLCBjcmVhdGVkX3dpdGhfcm93cywgdXNlZF9pbikge1xyXG4gICAgICAgIC8vIHNob3dzIHRoZSBhY3RpdmF0b3JcclxuICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlT2xkR3VpZHNPcHRpb24gMScpO1xyXG4gICAgICAgIEFILmFjdGl2YXRlKDIpO1xyXG4gICAgICAgIGZvciAobGV0IGluZGV4X25vID0gMDsgaW5kZXhfbm8gPCBzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aDsgaW5kZXhfbm8gKz0gMSkge1xyXG4gICAgICAgICAgICBpZiAoaW5kZXhfbm8gIT0gMCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVzZWRfaW4uaW5kZXhPZihzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5jZykgPiAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoYXQgcm93cyBjdXJyZW50X2d1aWQgd2hpY2ggY29udGFpbnMgYXJndW1lbnQgY3VycmVudF9ndWlkIGRhdGEgaW4gdGhlaXIgXCJ1c2VkX2luX2d1aWRzXCIgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjZWl2ZWRfZGF0YSA9IGF3YWl0IHVwZGF0ZVJlbGF0ZWRHdWlkcyhpbmRleF9ubywgc3RhdGUuZGF0YV9jZGF0YVtpbmRleF9ub10uY2csIHBhcmVudF9ndWlkLCBzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5ybiwgc3RhdGUuZGF0YV9jZGF0YVtpbmRleF9ub10uYWcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVjZWl2ZWRfZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgQUguc2hvd21zZyhsLmNoZWNrX25ldF91cGRhdGVfaWRzLCA0MDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZU9sZEd1aWRzT3B0aW9uIDInKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQUguYWN0aXZhdGUoMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChpbmRleF9ubyA9PSAoc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgZ3VpZCBzdG9yZSBpbiBhcmd1bWVudCBjdXJyZW50X2d1aWRcclxuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjZWl2ZWRfZGF0YTEgPSBhd2FpdCBhamF4UmVxdWVzdEZvckRhdGFVcGRhdGUocm93Tm8sIGN1cnJlbnRfZ3VpZCwgY3JlYXRlZF93aXRoX3Jvd3MsIHBhcmVudF9ndWlkLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlY2VpdmVkX2RhdGExKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwuY2hlY2tfbmV0X3VwZGF0ZV9pZHMsIDQwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRlT2xkR3VpZHNPcHRpb24gMycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5hY3RpdmF0ZSgwKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gdXBkYXRlcyB0aGUgcGFyZW50IGd1aWRcclxuICAgICAgICB1cGRhdGVQYXJlbnRHdWlkKCk7XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIHVwZGF0ZXMgdGhhdCByb3dzIGN1cnJlbnRfZ3VpZCB3aGljaCBjb250YWlucyBhcmd1bWVudCBjdXJyZW50X2d1aWQgZGF0YSBpbiB0aGVpciBcInVzZWRfaW5fZ3VpZHNcIiBhcnJheVxyXG4gICAgZnVuY3Rpb24gdXBkYXRlUmVsYXRlZEd1aWRzKHJvd05vLCBjdXJyZW50X2d1aWQsIHBhcmVudF9ndWlkLCBjcmVhdGVkX3dpdGhfcm93cykge1xyXG4gICAgICAgIC8vIGNhbGxlZCBmb3IgdXBkYXRlIHRoZSBndWlkcyBkYXRhXHJcbiAgICAgICAgcmV0dXJuIGFqYXhSZXF1ZXN0Rm9yRGF0YVVwZGF0ZShyb3dObywgY3VycmVudF9ndWlkLCBjcmVhdGVkX3dpdGhfcm93cywgcGFyZW50X2d1aWQsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VkIGZvciBzZXQgdGhlIHBhcmVudCBndWlkIGluIGVhY2ggcm93cyB4bWwgYW5kIHVwZGF0ZXMgdGhlIHhtbFxyXG4gICAgZnVuY3Rpb24gc2V0UGFyZW50R3VpZChndWlkX2RhdGEpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImd1aWRfZGF0YSBcIitndWlkX2RhdGEpO1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIGRlZmluZWQgdGhlIHRpdGxlIG9mIGNoaWxkIGl0ZW1zXHJcbiAgICAgICAgLy8gc3RhdGUueG1sLnNteG1sLl9wdCA9ICQoJyN0aXRsZScpLmh0bWwoKTtcclxuICAgICAgICBzdGF0ZS54bWwuc214bWwuX3B0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3RpdGxlJykuaW5uZXJIVE1MO1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIGVuYWJsZWQgdGhlIEdlbmVyYXRlL1VwZGF0ZSBJdGVtcyBidXR0b25cclxuICAgICAgICBzdGF0ZS54bWwuc214bWwuX2Rpc2FibGVkX2dlbmVyYXRlID0gMDtcclxuICAgICAgICAvLyBzZXRzIHRoZSBwYXJlbnQgZ3VpZCBmb3IgZWFjaCByb3dcclxuXHJcbiAgICAgICAgZm9yIChsZXQga2V5IGluIHN0YXRlLmRhdGFfY2RhdGEpIHtcclxuICAgICAgICAgICAgc3RhdGUuZGF0YV9jZGF0YVtrZXldLnBnID0gZ3VpZF9kYXRhO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coeydjZGF0YSAnOnN0YXRlLmRhdGFfY2RhdGF9KTtcclxuICAgICAgICAvL3VwZGF0ZXMgdGhlIHhtbFxyXG4gICAgICAgIHVwZGF0ZVhNTChKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiBzdGF0ZS5kYXRhX2NkYXRhIH0pKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VyZCBmb3IgdmFsaWRhdGlvbiBwdXJwb3NlIGJlZm9yZSBnZW5lcmF0ZSB0aGUgaXRlbXNcclxuICAgIGZ1bmN0aW9uIGdlbmVyYXRlUXVlc3Rpb25zKCkge1xyXG4gICAgICAgIC8vIHVzZWQgZm9yIGdlbmVyYXRlIHRoZSBndWlkcyBmb3IgZWFjaCByb3dcclxuICAgICAgICBoYW5kbGVHZW5lcmF0ZUl0ZW1zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgIC8vIHVzZWQgZm9yIGdlbmVyYXRlIHRoZSBndWlkIGZvciBlYWNoIHJvd3NcclxuICAgIGFzeW5jIGZ1bmN0aW9uIGhhbmRsZUdlbmVyYXRlSXRlbXMoKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2hhbmRsZSBnZW5lcmF0ZScpO1xyXG4gICAgICAgIGlmICgoc3RhdGUuZGF0YV9jZGF0YSkubGVuZ3RoID49IDUpIHtcclxuICAgICAgICAgICAgLy8gdXNlZCBmb3IgZGlzYWJsZWQgdGhlIEdlbmVyYXRlL1VwZGF0ZSBJdGVtcyBidXR0b25cclxuICAgICAgICAgICAgc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9IDE7XHJcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIHVzZXIgZ3VpZCBpbiB4bWxcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHN0YXRlLnhtbC5zbXhtbC5faW1wb3J0ZWRfYnkgPSB1c2VyX2d1aWQ7XHJcbiAgICAgICAgICAgIC8vIHNldHMgdGhlIHVwbG9hZGVkIGNzdiBmaWxlIG5hbWUgaW4geG1sXHJcbiAgICAgICAgICAgIHN0YXRlLnhtbC5zbXhtbC5fZmlsZSA9IGZpbGVfbmFtZTtcclxuICAgICAgICAgICAgbGV0IGRhdGVfb2JqID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgLy8gc2V0cyB0aGUgZGF0ZSBvZiB1cGxvYWRlZCBjc3YgZmlsZSBuYW1lIGluIHhtbFxyXG4gICAgICAgICAgICBzdGF0ZS54bWwuc214bWwuX2ltcG9ydGVkX29uID0gZGF0ZV9vYmoudG9EYXRlU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIGxldCBpc19mYWlsZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgLy8gc2hvd3MgdGhlIHByb2dyZXNzIGJhclxyXG4gICAgICAgICAgICAvL2pRdWVyeSgnI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2gnKTtcclxuICAgICAgICAgICAgQUkuc2VsZWN0KCcjd2FybmluZ19sYWJlbF9jb250YWluZXInLCdyZW1vdmVDbGFzcycsJ2gnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIG5vdCBhbGxvd2VkIHVzZXIgdG8gcGVyZm9ybSBhbnkgb3BlcmF0aW9uXHJcbiAgICAgICAgICAgIC8valF1ZXJ5KCcjYXV0aG9yaW5nX2NvbnRhaW5lcicpLmNzcygncG9pbnRlci1ldmVudHMnLCAnbm9uZScpO1xyXG4gICAgICAgICAgICBBSC5zZXRDc3MoJyNhdXRob3JpbmdfY29udGFpbmVyJyx7XHJcbiAgICAgICAgICAgICAgICAncG9pbnRlci1ldmVudHMnOiAnbm9uZSdcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8gPSAwOyBpbmRleF9ubyA8IHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoOyBpbmRleF9ubyArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXhfbm8gIT0gMCAmJiBzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5jZyA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNhbGxlZCBmb3IgZ2VuZXJhdGUgdGhlIGd1aWQgZm9yIGVhY2ggcm93XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGd1aWRfZGF0YSA9IGF3YWl0IGdlbmVyYXRlSXRlbXMoc3RhdGUuZGF0YV9jZGF0YVtpbmRleF9ub10ucGcsIGluZGV4X25vKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGd1aWRfZGF0YSA9PSAndW5kZWZpbmVkJyB8fCAhZ3VpZF9kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzX2ZhaWxlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3dzIHdhcm5pbmcgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwuY2hlY2tfbmV0d29yaywgNDAwMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVzZWQgZm9yIGVuYWJsZWQgdGhlIEdlbmVyYXRlL1VwZGF0ZSBJdGVtcyBidXR0b25cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbG93cyB1c2VyIHRvIHBlcmZvcm0gdGhlIG9wZXJhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2pRdWVyeSgnI2F1dGhvcmluZ19jb250YWluZXInKS5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgQUguc2V0Q3NzKCcjYXV0aG9yaW5nX2NvbnRhaW5lcicse1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BvaW50ZXItZXZlbnRzJzogJ2F1dG8nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGhpZGVzIHRoZSBwcm9ncmVzcyBiYXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9qUXVlcnkoJyN3YXJuaW5nX2xhYmVsX2NvbnRhaW5lcicpLmFkZENsYXNzKCdoJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFILnNlbGVjdChcIiN3YXJuaW5nX2xhYmVsX2NvbnRhaW5lclwiLCdhZGRDbGFzcycsJ2gnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbmNyZWFzZXMgdGhlIGNvdW50ZXIgYWNjb3JkaW5nIHRvIHRoZSBnZW5lcmF0ZWQgZ3VpZHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlLmNvdW50ZXIgPSBzdGF0ZS5jb3VudGVyICsgMTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFpc19mYWlsZWQpIHtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgQUguc2hvd21zZyhsLmNoaWxkX2l0ZW1zX2dlbmVyYXRlZCwgNDAwMCk7XHJcbiAgICAgICAgICAgICAgICAvLyBhbGxvd3MgdXNlciB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb25cclxuICAgICAgICAgICAgICAgIC8valF1ZXJ5KCcjYXV0aG9yaW5nX2NvbnRhaW5lcicpLmNzcygncG9pbnRlci1ldmVudHMnLCAnYXV0bycpO1xyXG4gICAgICAgICAgICAgICAgQUguc2V0Q3NzKFwiI2F1dGhvcmluZ19jb250YWluZXJcIix7XHJcbiAgICAgICAgICAgICAgICAgICAgJ3BvaW50ZXItZXZlbnRzJzonYXV0bydcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSBwYXJlbnQgZ3VpZFxyXG4gICAgICAgICAgICAgICAgdXBkYXRlUGFyZW50R3VpZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBBSC5zaG93bXNnKGwubWluNF9tYXg1MDBfYWxsb3dlZCwgNDAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIHVzZWQgZm9yIHNob3cgYWxsIHRoZSBjaGlsZCBndWlkcyB3aGljaCBhcmUgc2VsZWN0ZWRcclxuICAgIGZ1bmN0aW9uIHNob3dBbGxDaGlsZCgpIHtcclxuICAgICAgICAvLyBhcnJheSBmb3IgY29udGFpbiB0aGUgY2hpbGQgZ3VpZCBvZiBzZWxlY3RlZCByb3dcclxuICAgICAgICBsZXQgcm91dGVyR3VpZCA9IFtdO1xyXG4gICAgICAgIC8vIGpRdWVyeSgnLnNlbGVjdF9lZGl0YWJsZV9ndWlkOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vICAgICAvLyBwdXNoZXMgdGhlIGNoaWxkIGd1aWRcclxuICAgICAgICAvLyAgICAgcm91dGVyR3VpZC5wdXNoKGpRdWVyeSh0aGlzKS5hdHRyKCd0YXJnZXQtZ3VpZCcpKTtcclxuICAgICAgICAvLyB9KTtcclxuICAgICAgICBBSC5zZWxlY3QoJy5zZWxlY3RfZWRpdGFibGVfZ3VpZCcsJ2NoZWNrZWQnKS5mb3JFYWNoKChfdGhpcyk9PntcclxuICAgICAgICAgICAgcm91dGVyR3VpZC5wdXNoKF90aGlzLmdldEF0dHJpYnV0ZSgndGFyZ2V0LWd1aWQnKSk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAvLyB1cmwgZm9yIHNob3cgdGhlIHNlbGVjdGVkIGNoaWxkIGd1aWRzXHJcbiAgICAgICBcclxuICAgICAgICBsZXQgZnV0dXJlVXJsID0gYmFzZVVybCArICdlZGl0b3IvdjIvP2FjdGlvbj1lZGl0JmNvbnRlbnRfZ3VpZD0nICsgcm91dGVyR3VpZFswXSArICcmbm9faGVhZGVyPTEmcmVhY3RfY29udGVudD0xJm5vX2RvbWFpbj0xJnJvdXRlcl9ndWlkPScgKyByb3V0ZXJHdWlkLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgIC8vIG9wZW5zIHRoZSB1cmwgaW4gbmV3IHRhYlxyXG4gICAgICAgIHdpbmRvdy5vcGVuKGZ1dHVyZVVybCwgJ19ibGFuaycpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHVzZWQgZm9yIGFkZCB0aGUgcm93c1xyXG4gICAgZnVuY3Rpb24gYWRkT3B0aW9uKCkge1xyXG4gICAgICAgIGlmICgoc3RhdGUuZGF0YV9jZGF0YSkubGVuZ3RoIDwgNTAxKSB7XHJcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSByb3cgZGF0YSBpbiBvYmplY3QgZm9ybVxyXG4gICAgICAgICAgICBvYmplY3RfZGF0YSA9IHsgXCJjMVwiOiBcIkRhdGFcIiArIHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoLCBcImMyXCI6IFwiTWVhbmluZ1wiICsgc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGgsIFwicGdcIjogc3RhdGUuZGF0YV9jZGF0YVswXS5wZywgXCJjZ1wiOiBcIlwiLCBcImFnXCI6IFtdLCBcInJuXCI6IFtdfTtcclxuICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSBkYXRhIGludG8gZGF0YV9jZGF0YSBhcnJheVxyXG4gICAgICAgICAgICBzdGF0ZS5kYXRhX2NkYXRhLnB1c2gob2JqZWN0X2RhdGEpO1xyXG4gICAgICAgICAgICBpZiAoc3RhdGUuZGF0YV9jZGF0YVsxXS5jZykge1xyXG4gICAgICAgICAgICAgICAgLy8gdXNlZCBmb3IgZW5hYmxlZCB0aGUgR2VuZXJhdGUvVXBkYXRlIEl0ZW1zIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGUgeG1sXHJcbiAgICAgICAgICAgIHVwZGF0ZVhNTChKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiBzdGF0ZS5kYXRhX2NkYXRhIH0pKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBzaG93cyB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgQUguc2hvd21zZyhsLm1heDUwMF9yb3dzX2FsbG93ZWQsIDQwMDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyB1c2VkIGZvciB1cGxvYWQgY3N2IGZpbGUgYW5kIHVwZGF0ZSB0aGUgeG1sXHJcbiAgICBmdW5jdGlvbiB1cGxvYWRDc3YoKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgLy8gc2VsZWN0cyB0aGUgZWxlbWVudCBoYXZlIGlkICdmaWxlVXBsb2FkJyBcclxuICAgICAgICAgICAgbGV0IGZpbGVVcGxvYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVVcGxvYWRcIik7XHJcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIGNoZWNrIHRoZSBmaWxlIGV4dGVudGlvbiBcclxuICAgICAgICAgICAgbGV0IHJlZ2V4ID0gL1xcLmNzdiQvO1xyXG4gICAgICAgICAgICBmaWxlX25hbWUgPSBmaWxlVXBsb2FkLmZpbGVzWzBdLm5hbWU7XHJcbiAgICAgICAgICAgIGlmIChyZWdleC50ZXN0KGZpbGVVcGxvYWQudmFsdWUudG9Mb3dlckNhc2UoKSkpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKEZpbGVSZWFkZXIpICE9IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuZGF0YV9jZGF0YVsxXS5jZyA9PSAnJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXR1cm5zIGEgbmV3bHkgY29uc3RydWN0ZWQgRmlsZVJlYWRlci5cclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEEgaGFuZGxlciBmb3IgdGhlIE0gZXZlbnQuIFRoaXMgZXZlbnQgaXMgdHJpZ2dlcmVkIGVhY2ggdGltZSB0aGUgcmVhZGluZyBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIub25sb2FkID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb252ZXJ0cyBjc3YgZGF0YSBpbnRvIGpzb24gc3RyaW5nIGRhdGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnRlZENzdiA9IGNzdlRvSnNvbihldmVudC50YXJnZXQucmVzdWx0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbXBvcnRlZENzdikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIHhtbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVhNTChpbXBvcnRlZENzdik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY291bnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFIICYmIEFILnNob3dtc2cobC5maWxlX3VwbG9hZGVkLCA0MDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVVcGxvYWQudmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWFkZXIucmVhZEFzVGV4dChmaWxlVXBsb2FkLmZpbGVzWzBdKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHNob3dzIHRoZSB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgIEFILnNob3dtc2cobC5odG1sNV9ub3Rfc3VwcG9ydGVkLCA0MDAwKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIHNob3dzIHRoZSB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgQUguc2hvd21zZyhsLnVwbG9hZF92YWxpZF9jc3YsIDQwMDApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coeyAnZXJyb3InOiBlcnJvciB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIGNvbnZlcnRzIGNzdiBkYXRhIGludG8ganNvbiBzdHJpbmcgZGF0YVxyXG4gICAgZnVuY3Rpb24gY3N2VG9Kc29uKGNzdikge1xyXG4gICAgICAgIC8vIGNvbnZlcnRzIGNzdiBmaWxlIGRhdGEgaW50byBBcnJheVxyXG4gICAgICAgIGxldCBjc3ZfYXJyYXkgPSBkYXRhX3BhcnNlci5wYXJzZShjc3YpLmRhdGE7XHJcbiAgICAgICAgLy8gY29udGFpbnMgcm93cyBkYXRhIHdoaWNoIGlzIG5vdCBibGFuayBcdFxyXG4gICAgICAgIGNzdl9hcnJheSA9IGNzdl9hcnJheS5maWx0ZXIoZnVuY3Rpb24oZGF0YSkgeyBcclxuICAgICAgICAgICAgbGV0IHN1Yl9jc3ZfYXJyYXkgPSBkYXRhLmZpbHRlcihmdW5jdGlvbih2YWwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWwgJiYgdmFsLnRyaW0oKSAhPSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBzdWJfY3N2X2FycmF5Lmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHJvd1xyXG4gICAgICAgIGxldCByb3dfZGF0YSA9IFtdO1xyXG4gICAgICAgIC8vIG9iamVjdCBmb3IgdXBkYXRlIHRoZSB4bWxcclxuICAgICAgICBsZXQgc3RyX2RhdGEgPSB7fTtcclxuICAgICAgICBpZiAoY3N2X2FycmF5Lmxlbmd0aCA8PSA1MDEgJiYgY3N2X2FycmF5Lmxlbmd0aCA+PSA1KSB7XHJcbiAgICAgICAgICAgIGZvciAobGV0IGluZGV4X25vID0gMDsgaW5kZXhfbm8gPCBjc3ZfYXJyYXkubGVuZ3RoOyBpbmRleF9ubyArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoY3N2X2FycmF5W2luZGV4X25vXSAmJiBjc3ZfYXJyYXlbaW5kZXhfbm9dLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgY29sdW1uIGRhdGEgaW4gdGhlIGZvcm0gb2YgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY29sdW1uX2RhdGEgPSBjc3ZfYXJyYXlbaW5kZXhfbm9dO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIG9iamVjdCBmb3IgdXBkYXRlIHRoZSB4bWxcclxuICAgICAgICAgICAgICAgICAgICBzdHJfZGF0YSA9IHsgXCJjMVwiOiBcIlwiLCBcImMyXCI6IFwiXCIsIFwicGdcIjogc3RhdGUuZGF0YV9jZGF0YVswXS5wZywgXCJjZ1wiOiBcIlwiLCBcImFnXCI6IFtdLCBcInJuXCI6IFtdfTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleF9ubzEgPSAwOyBpbmRleF9ubzEgPCBjb2x1bW5fZGF0YS5sZW5ndGg7IGluZGV4X25vMSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5fZGF0YS5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGNvbHVtbl9kYXRhW2luZGV4X25vMV0gJiYgY29sdW1uX2RhdGFbaW5kZXhfbm8xXS50cmltKCkgIT0gXCJcIikgJiYgKGluZGV4X25vMSA9PSAwIHx8IGluZGV4X25vMSA9PSAxKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleF9ubzEgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSBmaXJzdCBjb2x1bW4gdmFsdWUgaW4geG1sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cl9kYXRhLmMxID0gY29sdW1uX2RhdGFbaW5kZXhfbm8xXS5yZXBsYWNlKC8nL2dtLCAnXFwnJykucmVwbGFjZSgvXCIvZ20sIFwiXFxcIlwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSBzZWNvbmQgY29sdW1uIHZhbHVlIGluIHhtbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJfZGF0YS5jMiA9IGNvbHVtbl9kYXRhW2luZGV4X25vMV0ucmVwbGFjZSgvJy9nbSwgJ1xcJycpLnJlcGxhY2UoL1wiL2dtLCBcIlxcXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGNvbHVtbl9kYXRhW2luZGV4X25vMV0gJiYgY29sdW1uX2RhdGFbaW5kZXhfbm8xXS50cmltKCkgIT0gXCJcIikgJiYgaW5kZXhfbm8xID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaG93cyB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFILnNob3dtc2cobC5leGFjdDJfY29sdW1uX2FsbG93ZWQsIDQwMDApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4X25vMSA8PSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaG93cyB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQUguc2hvd21zZyhsLmJsYW5rX2NvbHVtbl9ub3RhbGxvd2VkLCA0MDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3dzIHdhcm5pbmcgbWVzc2FnZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwuZXhhY3QyX2NvbHVtbl9hbGxvd2VkLCA0MDAwKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZXMgZWFjaCByb3dzIGRhdGEgaW4gb2JqZWN0IGZvcm1cclxuICAgICAgICAgICAgICAgICAgICByb3dfZGF0YS5wdXNoKHN0cl9kYXRhKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgQUguc2hvd21zZyhsLmJsYW5rX2NvbHVtbl9ub3RhbGxvd2VkLCA0MDAwKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gcmV0dW5zIHRoZSBkYXRhIG9mIGVhY2ggY3N2IGZpbGUgaW4ganNvbiBzdHJpbmdcclxuICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHsgXCJsaXN0XCI6IHJvd19kYXRhIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIHNob3dzIHdhcm5pbmcgbWVzc2FnZVxyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBBSC5zaG93bXNnKGwubWluX21heF92YWxpZGF0aW9uLCA0MDAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdXBkYXRlUGFyZW50R3VpZCgpIHtcclxuICAgICAgICAvLyBAZXNsaW50IGlzc3VlLCBpdCdzIGdsb2JhbCBtZXRob2RcclxuICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZVBhcmVudEd1aWQgMVwiKTtcclxuICAgICAgICBBSC5hY3RpdmF0ZSgyKTtcclxuICAgICAgICAvLyBBSC5hamF4KHtcclxuICAgICAgICAvLyAgICAgLy9hamF4OiBcIjFcIixcclxuICAgICAgICAvLyAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgdmFyaWFibGVcclxuICAgICAgICAvLyAgICAgdXJsOiBiYXNlVXJsICsgJ2VkaXRvci9pbmRleC5waHAnLCAvLyBkZWZpbmVzIHdoZXJlIGFqYXggcmVxdWVzdCB3aWxsIGJlIHNlbmRcclxuICAgICAgICAvLyAgICAgLy9jYWNoZTogZmFsc2UsIC8vIGRvZXMgbm90IHN0b3JlcyBkYXRhIGluIGNhY2hlIG1lbW9yeVxyXG4gICAgICAgIC8vICAgICBkYXRhOiB7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyBAZXNsaW50IGlzc3VlLCBpdCdzIGdsb2JhbCBtZXRob2RcclxuICAgICAgICAvLyAgICAgICAgIHN0cl9jb250ZW50OiBKU09OVG9YTUwoc3RhdGUueG1sKSwgLy8gZGF0YSBpbiB0aGUgZm9ybSBvZiBvYmplY3QgZm9yIHVwZGF0ZSB0aGUgZ3VpZFxyXG4gICAgICAgIC8vICAgICAgICAgZnVuYzogXCJ1cGRhdGVfZ3VpZF9mcm9tX2FwaVwiLCAvLyBkZWZpbmVzIHRoZSBjb25kaWRpdG9uIGluIHdoaWNoIGl0IGNhbiBiZSBhY2Nlc3Mgb24gc2VydmVyIHNpZGVcclxuICAgICAgICAvLyAgICAgICAgIGNvbnRlbnRfZ3VpZDogc3RhdGUuZGF0YV9jZGF0YVsxXS5wZywgLy8gc2VuZHMgdGhlIGd1aWQgdGhhdCBoYXMgdG8gYmUgdXBkYXRlXHJcbiAgICAgICAgLy8gICAgICAgICB1cGRhdGVfcGFyZW50OiAxXHJcbiAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgLy8gICAgIC8vdHlwZTogXCJwb3N0XCIsIC8vIHNlbmQgdGhlIGRhdGEgd2l0aCBmb3Igc2VjdXJpdHlcclxuICAgICAgICAvLyAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgLy8gICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cclxuICAgICAgICAvLyAgICAgICAgIHZhciBqc29uX3JlY2VpdmVkX3N0cmluZyA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgIC8vICAgICAgICAgaWYgKCFqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpIHtcclxuICAgICAgICAvLyAgICAgICAgICAgICAvLyBzaG93cyB3YXJuaW5nIG1lc3NhZ2VcclxuICAgICAgICAvLyAgICAgICAgICAgICAvLyBAZXNsaW50IGlzc3VlLCBpdCdzIGdsb2JhbCB2YXJpYWJsZVxyXG4gICAgICAgIC8vICAgICAgICAgICAgIEFJICYmIEFJLnNob3dtc2cobC5jaGVja19uZXRfYW5kX3NhdmUsIDQwMDApO1xyXG4gICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgIC8vICAgICAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgbWV0aG9kXHJcbiAgICAgICAgLy8gICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZVBhcmVudEd1aWQgMlwiKTtcclxuICAgICAgICAvLyAgICAgICAgIEFILmFjdGl2YXRlKDApO1xyXG4gICAgICAgIC8vICAgICAgICAgLy8gaGlkZXMgdGhlIHByb2dyZXNzIGJhclxyXG4gICAgICAgIC8vICAgICAgICAgLy9qUXVlcnkoJyN3YXJuaW5nX2xhYmVsX2NvbnRhaW5lcicpLmFkZENsYXNzKCdoJyk7XHJcbiAgICAgICAgLy8gICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyXCIpLmNsYXNzTGlzdC5hZGQoXCJoXCIpO1xyXG4gICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgLy8gfSk7XHJcblxyXG4gICAgICAgIEFILmFqYXgoe1xyXG4gICAgICAgICAgICB0eXBlOiBcInBvc3RcIixcclxuICAgICAgICAgICAgdXJsOiBiYXNlVXJsICsgJ2VkaXRvci9pbmRleC5waHAnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBzdHJfY29udGVudDogSlNPTlRvWE1MKHN0YXRlLnhtbCksIC8vIGRhdGEgaW4gdGhlIGZvcm0gb2Ygb2JqZWN0IGZvciB1cGRhdGUgdGhlIGd1aWRcclxuICAgICAgICAgICAgICAgIGZ1bmM6IFwidXBkYXRlX2d1aWRfZnJvbV9hcGlcIiwgLy8gZGVmaW5lcyB0aGUgY29uZGlkaXRvbiBpbiB3aGljaCBpdCBjYW4gYmUgYWNjZXNzIG9uIHNlcnZlciBzaWRlXHJcbiAgICAgICAgICAgICAgICBjb250ZW50X2d1aWQ6IHN0YXRlLmRhdGFfY2RhdGFbMV0ucGcsIC8vIHNlbmRzIHRoZSBndWlkIHRoYXQgaGFzIHRvIGJlIHVwZGF0ZVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlX3BhcmVudDogMVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbkVuZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBBSC5hY3RpdmF0ZSgwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHJlc3BvbnNlIGluIG9iamVjdCBmb3JtXHJcbiAgICAgICAgICAgIGxldCBqc29uX3JlY2VpdmVkX3N0cmluZyA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICBpZiAoIWpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCkge1xyXG4gICAgICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXHJcbiAgICAgICAgICAgICAgICAvLyBAZXNsaW50IGlzc3VlLCBpdCdzIGdsb2JhbCB2YXJpYWJsZVxyXG4gICAgICAgICAgICAgICAgQUggJiYgQUguc2hvd21zZyhsLmNoZWNrX25ldF9hbmRfc2F2ZSwgNDAwMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgbWV0aG9kXHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlUGFyZW50R3VpZCAyXCIpO1xyXG4gICAgICAgICAgICBBSC5hY3RpdmF0ZSgwKTtcclxuICAgICAgICAgICAgLy8gaGlkZXMgdGhlIHByb2dyZXNzIGJhclxyXG4gICAgICAgICAgICAvL2pRdWVyeSgnI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyJykuYWRkQ2xhc3MoJ2gnKTtcclxuICAgICAgICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyXCIpLmNsYXNzTGlzdC5hZGQoXCJoXCIpO1xyXG4gICAgICAgICAgICBBSC5zZWxlY3QoXCIjd2FybmluZ19sYWJlbF9jb250YWluZXJcIixcImFkZENsYXNzXCIsXCJoXCIpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgXHJcbiAgICAvLyAkOntcclxuICAgIC8vICAgICBpZiAoc3RhdGUuZGF0YV9jZGF0YSAmJiBzdGF0ZS5kYXRhX2NkYXRhWzFdLmNnKSB7XHJcbiAgICAvLyAgICAgICAgIGhhbmRsZV9kaXNhYmxlID0gdHJ1ZTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvLyAgICAgaGFuZGxlX2dlbmVyYXRlID0gc3RhdGUueG1sICYmICgoc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9PSAxKSA/IHRydWU6IGZhbHNlKTtcclxuICAgIC8vICAgICBhbGVydChzdGF0ZS54bWwuc214bWwpO1xyXG4gICAgLy8gICAgIGlmIChzdGF0ZS5kYXRhX2NkYXRhKSB7XHJcbiAgICAvLyAgICAgICAgIHByb2dyZXNzX2RhdGEgPSBNYXRoLmNlaWwoKHN0YXRlLmNvdW50ZXIgKiAxMDApIC8gKHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoIC0gMSkpICsgJyUnO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vICAgICBpZihzdGF0ZS5kYXRhX2NkYXRhKSB7XHJcbiAgICAvLyAgICAgICAgIGNoaWxkX2dlbmVyYXRlZCA9IChzdGF0ZS5kYXRhX2NkYXRhWzFdLmNnKSA/IGZhbHNlOiB0cnVlXHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy8gfVxyXG4gICAgbGV0IGhhbmRsZV9kaXNhYmxlID0gZmFsc2U7XHJcbiAgICBsZXQgcHJvZ3Jlc3NfZGF0YSA9ICcnO1xyXG4gICAgbGV0IGhhbmRsZV9nZW5lcmF0ZTtcclxuXHJcbiAgICAkOntcclxuICAgICAgICBjb25zb2xlLmxvZygnRWRpdG9yIFN0YXRlID0+JytlZGl0b3JTdGF0ZS5ndWlkKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIkNoZWNraW5nICRcIik7XHJcbiAgICAgICAgaWYgKHN0YXRlLmRhdGFfY2RhdGEgJiYgc3RhdGUuZGF0YV9jZGF0YVsxXS5jZykge1xyXG4gICAgICAgICAgICBoYW5kbGVfZGlzYWJsZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGhhbmRsZV9nZW5lcmF0ZSA9IHN0YXRlLnhtbCAmJiAoKHN0YXRlLnhtbC5zbXhtbC5fZGlzYWJsZWRfZ2VuZXJhdGUgPT0gMSkgPyB0cnVlOiBmYWxzZSk7XHJcbiAgICAgICAgLy9hbGVydChzdGF0ZS54bWwuc214bWwpO1xyXG4gICAgICAgIGlmIChzdGF0ZS5kYXRhX2NkYXRhKSB7XHJcbiAgICAgICAgICAgIHByb2dyZXNzX2RhdGEgPSBNYXRoLmNlaWwoKHN0YXRlLmNvdW50ZXIgKiAxMDApIC8gKHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoIC0gMSkpICsgJyUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdGF0ZS5kYXRhX2NkYXRhKSB7XHJcbiAgICAgICAgICAgIGNoaWxkX2dlbmVyYXRlZCA9IChzdGF0ZS5kYXRhX2NkYXRhWzFdLmNnKSA/IGZhbHNlOiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAgLy8gdXNlZCBmb3IgaGlkZSBhbmQgc2hvdyB0aGUgd2FybmluZyBkaWFsb2cgYm94XHJcbiAgICBmdW5jdGlvbiBlZGl0b3JNb2RhbFVwZGF0ZShhcmdzKSB7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3RhdGUuZWRpdG9yTW9kYWxIYW5kbGUgPSBhcmdzO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcbjwvc2NyaXB0PlxyXG48ZGl2PlxyXG4gICAgPGRpdiBpZD1cImF1dGhvcmluZ19jb250YWluZXJcIiBjbGFzcz1cImNvbnRhaW5lciB3LTEwMCBweC0zIHB5LTNcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtMTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwid2FybmluZ19sYWJlbF9jb250YWluZXJcIiBjbGFzcz1cInByb2dyZXNzIHctMTAwIGggbXktMiBoZWlnaHQyMFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyIGJnLXN1Y2Nlc3MgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkIGZvbnQtd2VpZ2h0LWJvbGRlclwiIHN0eWxlPXtcIndpZHRoOlwiKyBwcm9ncmVzc19kYXRhfT48Yj57c3RhdGUuY291bnRlciArICcvJyArIChzdGF0ZS5kYXRhX2NkYXRhICYmIChzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aCAtIDEpKX08L2I+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWlubGluZS1ibG9ja1wiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtYnMtcGxhY2VtZW50PVwidG9wXCIgdGl0bGU9eygoaGFuZGxlX2Rpc2FibGUpID8gbC5uZXdfbm90X2FsbG93ZWQ6IGwuY3N2X2ZpbGUpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9e1wiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1tZFwiICsgKChoYW5kbGVfZGlzYWJsZSkgPyBcIiBwb2ludGVyX2V2ZW50X25vbmVcIjogXCJcIil9IG5hbWU9XCJpbXBvcnRfY3N2X2J0blwiIG9uOmNsaWNrPXtoYW5kbGVJbXBvcnR9IGRpc2FibGVkPXtoYW5kbGVfZGlzYWJsZX0+e2wuaW1wb3J0X2Nzdn08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJmaWxlVXBsb2FkXCIgdHlwZT1cImZpbGVcIiBvbjpjaGFuZ2U9e3VwbG9hZENzdn0gY2xhc3M9XCJ1cGxvYWQgaFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgbWwtMlwiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtYnMtcGxhY2VtZW50PVwidG9wXCIgdGl0bGU9eygoaGFuZGxlX2dlbmVyYXRlKSA/ICgoaGFuZGxlX2Rpc2FibGUpID8gbC5hbHJlYWR5X2dlbmVyYXRlZDogbC5zYXZlX3dhcl9tc2cpOiAoKGhhbmRsZV9kaXNhYmxlKSA/IGwubmV3X3Jvd190b29sdGlwOiBsLmdlbmVyYXRlX2l0ZW1zKSl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz17XCJidG4gYnRuLXByaW1hcnkgYnRuLW1kXCIgKyAoKGhhbmRsZV9nZW5lcmF0ZSkgPyAnIHBvaW50ZXJfZXZlbnRfbm9uZSc6ICcnKX0gbmFtZT1cImdlbmVyYXRlX3F1ZXN0aW9uX2J0blwiIGlkPVwiZ2VuZXJhdGVfcXVlc3Rpb25fYnRuXCIgb246Y2xpY2s9e2dlbmVyYXRlUXVlc3Rpb25zfSBkaXNhYmxlZD17aGFuZGxlX2dlbmVyYXRlfT57KChoYW5kbGVfZ2VuZXJhdGUpID8gbC5nZW5lcmF0ZV9pdGVtOiAoKHN0YXRlLmRhdGFfY2RhdGEgJiYgc3RhdGUuZGF0YV9jZGF0YVsxXS5jZykgPyBsLnVwZGF0ZV9pdGVtOiBsLmdlbmVyYXRlX2l0ZW0pKX08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIG1sLTJcIiBkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLWJzLXBsYWNlbWVudD1cInRvcFwiIHRpdGxlPXsoKHN0YXRlLmhhbmRsZV9kaXNhYmxlX3Nob3cpID8gKChoYW5kbGVfZGlzYWJsZSkgPyBsLmNoaWxkX25vdF9zZWxlY3RlZDogbC5jaGlsZF9ub3RfZ2VuZXJhdGVkKTogbC5zaG93X2FsbCl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz17XCJidG4gYnRuLXByaW1hcnkgYnRuLW1kIHdpZHRoMTI1XCIgKyAoKHN0YXRlLmhhbmRsZV9kaXNhYmxlX3Nob3cpID8gXCIgcG9pbnRlcl9ldmVudF9ub25lXCI6IFwiXCIpfSBuYW1lPVwic2hvd19hbGxfY2hpbGRcIiBpZD1cInNob3dfYWxsX2NoaWxkXCIgZGlzYWJsZWQ9e3N0YXRlLmhhbmRsZV9kaXNhYmxlX3Nob3d9IG9uOmNsaWNrPXtzaG93QWxsQ2hpbGR9PnsoKHN0YXRlLnNlbGVjdGVkX2xlbmd0aCA+IDApID8gbC5zaG93X2FsbF9sYWJlbCArICcgKCcgKyBzdGF0ZS5zZWxlY3RlZF9sZW5ndGggKycpJzogbC5zaG93X2FsbF9sYWJlbCl9PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHsjaWYgc3RhdGUuZGF0YV9jZGF0YX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGUgY2xlYXJmaXggbXgtMFwiIGlkPVwiY3N2X2RhdGFfdGFibGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cIndpZHRoODAgdGV4dC1jZW50ZXIgYWxpZ24tbWlkZGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIHAtMFwiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtYnMtcGxhY2VtZW50PVwidG9wXCIgdGl0bGU9eygoY2hpbGRfZ2VuZXJhdGVkKSA/IGwuY2hpbGRfbm90X2dlbmVyYXRlZDogJycpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImNoZWNrYWxsXCIgcmVsPVwiY2hrXzFcIiBjbGFzcz17XCJtci0zIG10LTEgY3VzdG9tX2NoZWNrYm94X25ldyBmbG9hdC1sZWZ0IHVjX2NoZWNrYm94IGNoZWNrYWxsIG1uZ190cmFja19jaGVja2JveCBtdC1zbTIgbS1yXCIgKyAoKGNoaWxkX2dlbmVyYXRlZCkgPyAnIHBvaW50ZXJfZXZlbnRfbm9uZSc6ICcnKX0gZGlzYWJsZWQ9e2NoaWxkX2dlbmVyYXRlZH0vPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwibXItMlwiPjxiIGNsYXNzPVwiZm9udDE3XCI+IzwvYj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cIm1pbl93aWRfOTUgd2lkdGhfbWF4X2NvbnRlbnQgbWF4X3dpZHRoXzMwMCBhbGlnbi1taWRkbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzPVwiZm9udDE3XCI+e3N0YXRlLmRhdGFfY2RhdGFbMF0uYzF9PC9iPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJtaW5fd2lkXzk1IHdpZHRoX21heF9jb250ZW50IG1heF93aWR0aF8zMDAgYWxpZ24tbWlkZGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YiBjbGFzcz1cImZvbnQxN1wiPntzdGF0ZS5kYXRhX2NkYXRhWzBdLmMyfTwvYj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwid2lkdGg2NSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzPVwiZm9udDE3XCI+e2wuYWN0aW9uX3R4dH08L2I+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHN0YXRlLmRhdGFfY2RhdGEgYXMgb2JqZWN0X2RhdGEsIGluZGV4fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmIGluZGV4ID4gMH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cIndpZHRoODAgdGV4dC1jZW50ZXIgYWxpZ24tbWlkZGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIHAtMFwiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiIHRpdGxlPXsoKG9iamVjdF9kYXRhLmNnKSA/ICcnOiBsLmNoaWxkX25vdF9nZW5lcmF0ZWQpfSBkYXRhLWJzLXBsYWNlbWVudD1cInJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPXtcIm1yLTIgbXQtMSBjdXN0b21fY2hlY2tib3hfbmV3IGZsb2F0LWxlZnQgc2VsZWN0X2VkaXRhYmxlX2d1aWRcIisgKChvYmplY3RfZGF0YS5jZykgPyAnJzogJyBwb2ludGVyX2V2ZW50X25vbmUnKX0gdGFyZ2V0LWd1aWQ9e29iamVjdF9kYXRhLmNnfSBkaXNhYmxlZD17KChvYmplY3RfZGF0YS5jZykgPyBmYWxzZTogdHJ1ZSl9Lz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5saW5lLWJsb2NrIGJ0bi1zZWNvbmRhcnkgYnRuLWNpcmNsZSByb3VuZGVkLWNpcmNsZSB3aWR0aDI3IGhlaWdodDI3IGZvbnQxMiB0ZXh0LWNlbnRlciBwLTEgYnRuLXNtIHNxdWFyZVwiPnsoKGluZGV4IDwgMTApID8gJzAnICsgaW5kZXggOiBpbmRleCl9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBpZD17XCJjb2xfXCIgKyBpbmRleCArIFwiX1wiICsgMH0gY29udGVudEVkaXRhYmxlPVwidHJ1ZVwiIG9uOmJsdXI9e2hhbmRsZUVkaXR9IGNsYXNzPVwibWluX3dpZF85NSB3aWR0aF9tYXhfY29udGVudCBtYXhfd2lkdGhfMzAwIHdvcmQtd3JhcC1icmVhayBhbGlnbi1taWRkbGVcIj57b2JqZWN0X2RhdGEuYzF9PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlkPXtcImNvbF9cIiArIGluZGV4ICsgXCJfXCIgKyAxfSBjb250ZW50RWRpdGFibGU9XCJ0cnVlXCIgb246Ymx1cj17aGFuZGxlRWRpdH0gY2xhc3M9XCJtaW5fd2lkXzk1IHdpZHRoX21heF9jb250ZW50IG1heF93aWR0aF8zMDAgd29yZC13cmFwLWJyZWFrIGFsaWduLW1pZGRsZVwiPntvYmplY3RfZGF0YS5jMn08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJ3aWR0aDY1IHRleHQtY2VudGVyIGFsaWduLW1pZGRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWlubGluZS1ibG9jayBtbC0yXCIgZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1icy1wbGFjZW1lbnQ9XCJ0b3BcIiB0aXRsZT17KChvYmplY3RfZGF0YS5jZykgPyBsLmRlbGV0aW9uX25vdF9hbGxvd2VkOiBsLmRlbF9yb3cpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXtcImJ0blwiICsgKChvYmplY3RfZGF0YS5jZykgPyAnIHBvaW50ZXJfZXZlbnRfbm9uZSc6ICcnKX0gbmFtZT17XCJkZWxldGVfZWxtXCIgKyBpbmRleH0gaWQ9e1wiZGVsZXRlX2VsbVwiICsgaW5kZXh9IG9uOmNsaWNrPXsoKT0+e2hhbmRsZURlbGV0ZShpbmRleCl9fSBkaXNhYmxlZD17KChvYmplY3RfZGF0YS5jZykgPyB0cnVlOiBmYWxzZSl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb21vb24gaWNvbW9vbi0yNHB4LWRlbGV0ZS0xIHM0XCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2VhY2h9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XHJcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiAgZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1icy1wbGFjZW1lbnQ9XCJ0b3BcIiB0aXRsZT17bC5hZGRfY2hpbGR9IGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5IGJ0bi1tZCBtdC0yXCIgbmFtZT1cIkFkZF9yb3dcIiBpZD1cIkFkZF9yb3dcIiBvbjpjbGljaz17YWRkT3B0aW9ufT57bC5hZGRfb3B0aW9ufTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8IS0tIDxFZGl0b3JNb2RhbFxyXG4gICAgICAgIGhlYWRlcj17bW9kYWwuaGVhZGVyfVxyXG4gICAgICAgIGJvZHk9e21vZGFsLmJvZHl9XHJcbiAgICAgICAgZm9vdGVyPXttb2RhbC5mb290ZXJ9XHJcbiAgICAgICAgZnVsbFdpZHRoPVwidHJ1ZVwiXHJcbiAgICAgICAgbWF4V2lkdGg9e21vZGFsLm1heFdpZHRofVxyXG4gICAgICAgIGN1c3RvbUZvb3RlciA9IHt0cnVlfVxyXG4gICAgICAgIG9uVXBkYXRlPXtlZGl0b3JNb2RhbFVwZGF0ZS5iaW5kKHRoaXMpfVxyXG4gICAgICAgIGhhbmRsZT17c3RhdGUuZWRpdG9yTW9kYWxIYW5kbGV9XHJcbiAgICAvPiAtLT5cclxuICAgIDxEaWFsb2dcclxuXHRcdGJpbmQ6dmlzaWJsZT17c3RhdGUuRWRpdG9yTW9kYWxCb3h9IG9uOmNsb3NlPXsoKSA9PiB7c3RhdGUuRWRpdG9yTW9kYWxCb3ggPSBmYWxzZX19IHN0eWxlPXsnd2lkdGg6NTAwcHg7J30gPlxyXG4gICAgICAgICAgICA8ZGl2IHNsb3Q9XCJ0aXRsZVwiPntsLnNhdmVfaGVhZGVyfTwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29sLW1kLTEyXCIgc3R5bGU9eydtYXJnaW46NDBweDsnfT57bC5jaGlsZF91cGRhdGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IHNsb3Q9XCJmb290ZXJcIiBjbGFzcz1cImZvb3RlclwiIHN0eWxlPVwiYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWRpdmlkZXIsIHJnYmEoMCwgMCwgMCwgMC4xKSk7XCI+IFxyXG4gICAgICAgICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJjb250YWluZWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uOmNsaWNrPXtoYW5kbGVVcGRhdGUocm93X25vKX1cclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInRleHQtd2hpdGUgYmctcHJpbWFyeVwiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9eyd0ZXh0LXRyYW5zZm9ybTpub25lO2Zsb2F0OnJpZ2h0O21hcmdpbjo1cHg7J31cclxuICAgICAgICAgICAgICAgID5PS1xyXG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG5cdFx0XHRcdFx0XHJcblx0PC9EaWFsb2c+XHJcbjwvZGl2PlxyXG5cclxuPHN0eWxlPlxyXG4gICAgLmhlaWdodDIwICB7XHJcbiAgICAgICAgaGVpZ2h0OiAyMHB4ICFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcbiAgICAud2lkdGgxMjUge1xyXG4gICAgICAgIHdpZHRoOiAxMjVweDtcclxuICAgIH1cclxuICAgIC53aWR0aDgwICB7XHJcbiAgICAgICAgd2lkdGg6IDgwcHg7XHJcbiAgICB9XHJcbiAgICAubWluX3dpZF85NSAge1xyXG4gICAgICAgIG1pbi13aWR0aDo5NXB4O1xyXG4gICAgfVxyXG4gICAgLndpZHRoX21heF9jb250ZW50IHtcclxuICAgICAgICB3aWR0aDogbWF4LWNvbnRlbnQ7XHJcbiAgICB9XHJcbiAgICAuZm9udDE3IHtcclxuICAgICAgIGZvbnQtc2l6ZTogMTVweCFpbXBvcnRhbnQ7XHJcbiAgICB9XHJcblxyXG4gICAgLmN1c3RvbV9jaGVja2JveF9uZXcge1xyXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xyXG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICAgICAgICB3aWR0aDogMjBweDtcclxuICAgICAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMDtcclxuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgZm9udC1zaXplOiAxOHB4O1xyXG4gICAgfVxyXG4gICAgLndpZHRoMjcge1xyXG4gICAgICAgIHdpZHRoOiAyN3B4O1xyXG4gICAgfVxyXG5cclxuICAgIC5oZWlnaHQyNyAge1xyXG4gICAgICAgIGhlaWdodDogMjdweCAhaW1wb3J0YW50O1xyXG4gICAgfVxyXG4gICAgLndpZHRoNjUgIHtcclxuICAgICAgICB3aWR0aDogNjVweDtcclxuICAgIH1cclxuXHJcbiAgICB0ZCB7XHJcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gICAgfVxyXG5cclxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbTRCSSxTQUFTLGVBQUUsQ0FBQyxBQUNSLE1BQU0sQ0FBRSxJQUFJLENBQUMsVUFBVSxBQUMzQixDQUFDLEFBQ0QsU0FBUyxlQUFDLENBQUMsQUFDUCxLQUFLLENBQUUsS0FBSyxBQUNoQixDQUFDLEFBQ0QsUUFBUSxlQUFFLENBQUMsQUFDUCxLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFDRCxXQUFXLGVBQUUsQ0FBQyxBQUNWLFVBQVUsSUFBSSxBQUNsQixDQUFDLEFBQ0Qsa0JBQWtCLGVBQUMsQ0FBQyxBQUNoQixLQUFLLENBQUUsV0FBVyxBQUN0QixDQUFDLEFBQ0QsT0FBTyxlQUFDLENBQUMsQUFDTixTQUFTLENBQUUsSUFBSSxVQUFVLEFBQzVCLENBQUMsQUFFRCxvQkFBb0IsZUFBQyxDQUFDLEFBQ2xCLE9BQU8sQ0FBRSxLQUFLLENBQ2QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLGFBQWEsQ0FBRSxDQUFDLENBQ2hCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsU0FBUyxDQUFFLElBQUksQUFDbkIsQ0FBQyxBQUNELFFBQVEsZUFBQyxDQUFDLEFBQ04sS0FBSyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUQsU0FBUyxlQUFFLENBQUMsQUFDUixNQUFNLENBQUUsSUFBSSxDQUFDLFVBQVUsQUFDM0IsQ0FBQyxBQUNELFFBQVEsZUFBRSxDQUFDLEFBQ1AsS0FBSyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUQsRUFBRSxlQUFDLENBQUMsQUFDQSxVQUFVLENBQUUsTUFBTSxBQUN0QixDQUFDIn0= */";
	append_dev(document_1.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[40] = i;
	return child_ctx;
}

// (814:20) {#if state.data_cdata}
function create_if_block(ctx) {
	let table;
	let tr;
	let th0;
	let span1;
	let input;
	let input_class_value;
	let t0;
	let span0;
	let b0;
	let span1_title_value;
	let t2;
	let th1;
	let b1;
	let t3_value = /*state*/ ctx[0].data_cdata[0].c1 + "";
	let t3;
	let t4;
	let th2;
	let b2;
	let t5_value = /*state*/ ctx[0].data_cdata[0].c2 + "";
	let t5;
	let t6;
	let th3;
	let b3;
	let t8;
	let each_value = /*state*/ ctx[0].data_cdata;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			table = element("table");
			tr = element("tr");
			th0 = element("th");
			span1 = element("span");
			input = element("input");
			t0 = space();
			span0 = element("span");
			b0 = element("b");
			b0.textContent = "#";
			t2 = space();
			th1 = element("th");
			b1 = element("b");
			t3 = text(t3_value);
			t4 = space();
			th2 = element("th");
			b2 = element("b");
			t5 = text(t5_value);
			t6 = space();
			th3 = element("th");
			b3 = element("b");
			b3.textContent = `${language.action_txt}`;
			t8 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(input, "type", "checkbox");
			attr_dev(input, "name", "checkall");
			attr_dev(input, "rel", "chk_1");
			attr_dev(input, "class", input_class_value = "" + (null_to_empty("mr-3 mt-1 custom_checkbox_new float-left uc_checkbox checkall mng_track_checkbox mt-sm2 m-r" + (/*child_generated*/ ctx[1] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"));
			input.disabled = /*child_generated*/ ctx[1];
			add_location(input, file, 819, 44, 40566);
			attr_dev(b0, "class", "font17 svelte-1qzd0v1");
			add_location(b0, file, 820, 63, 40862);
			attr_dev(span0, "class", "mr-2");
			add_location(span0, file, 820, 44, 40843);
			attr_dev(span1, "class", "d-inline-block p-0");
			attr_dev(span1, "data-bs-toggle", "tooltip");
			attr_dev(span1, "data-bs-placement", "top");
			attr_dev(span1, "title", span1_title_value = /*child_generated*/ ctx[1] ? language.child_not_generated : "");
			add_location(span1, file, 818, 40, 40382);
			attr_dev(th0, "class", "width80 text-center align-middle svelte-1qzd0v1");
			add_location(th0, file, 817, 36, 40295);
			attr_dev(b1, "class", "font17 svelte-1qzd0v1");
			add_location(b1, file, 824, 40, 41132);
			attr_dev(th1, "class", "min_wid_95 width_max_content max_width_300 align-middle svelte-1qzd0v1");
			add_location(th1, file, 823, 36, 41022);
			attr_dev(b2, "class", "font17 svelte-1qzd0v1");
			add_location(b2, file, 827, 40, 41369);
			attr_dev(th2, "class", "min_wid_95 width_max_content max_width_300 align-middle svelte-1qzd0v1");
			add_location(th2, file, 826, 36, 41259);
			attr_dev(b3, "class", "font17 svelte-1qzd0v1");
			add_location(b3, file, 830, 40, 41583);
			attr_dev(th3, "class", "width65 text-center align-middle svelte-1qzd0v1");
			add_location(th3, file, 829, 36, 41496);
			add_location(tr, file, 816, 32, 40253);
			attr_dev(table, "class", "table clearfix mx-0");
			attr_dev(table, "id", "csv_data_table");
			add_location(table, file, 815, 28, 40164);
		},
		m: function mount(target, anchor) {
			insert_dev(target, table, anchor);
			append_dev(table, tr);
			append_dev(tr, th0);
			append_dev(th0, span1);
			append_dev(span1, input);
			append_dev(span1, t0);
			append_dev(span1, span0);
			append_dev(span0, b0);
			append_dev(tr, t2);
			append_dev(tr, th1);
			append_dev(th1, b1);
			append_dev(b1, t3);
			append_dev(tr, t4);
			append_dev(tr, th2);
			append_dev(th2, b2);
			append_dev(b2, t5);
			append_dev(tr, t6);
			append_dev(tr, th3);
			append_dev(th3, b3);
			append_dev(table, t8);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(table, null);
			}
		},
		p: function update(ctx, dirty) {
			if (dirty[0] & /*child_generated*/ 2 && input_class_value !== (input_class_value = "" + (null_to_empty("mr-3 mt-1 custom_checkbox_new float-left uc_checkbox checkall mng_track_checkbox mt-sm2 m-r" + (/*child_generated*/ ctx[1] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"))) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty[0] & /*child_generated*/ 2) {
				prop_dev(input, "disabled", /*child_generated*/ ctx[1]);
			}

			if (dirty[0] & /*child_generated*/ 2 && span1_title_value !== (span1_title_value = /*child_generated*/ ctx[1] ? language.child_not_generated : "")) {
				attr_dev(span1, "title", span1_title_value);
			}

			if (dirty[0] & /*state*/ 1 && t3_value !== (t3_value = /*state*/ ctx[0].data_cdata[0].c1 + "")) set_data_dev(t3, t3_value);
			if (dirty[0] & /*state*/ 1 && t5_value !== (t5_value = /*state*/ ctx[0].data_cdata[0].c2 + "")) set_data_dev(t5, t5_value);

			if (dirty[0] & /*state, handleDelete, handleEdit*/ 641) {
				each_value = /*state*/ ctx[0].data_cdata;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(table, null);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(table);
			destroy_each(each_blocks, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(814:20) {#if state.data_cdata}",
		ctx
	});

	return block;
}

// (838:40) {#if index > 0}
function create_if_block_1(ctx) {
	let tr;
	let td0;
	let span0;
	let input;
	let input_class_value;
	let input_target_guid_value;
	let input_disabled_value;
	let t0;
	let div;

	let t1_value = (/*index*/ ctx[40] < 10
	? "0" + /*index*/ ctx[40]
	: /*index*/ ctx[40]) + "";

	let t1;
	let span0_title_value;
	let t2;
	let td1;
	let t3_value = /*object_data*/ ctx[6].c1 + "";
	let t3;
	let td1_id_value;
	let t4;
	let td2;
	let t5_value = /*object_data*/ ctx[6].c2 + "";
	let t5;
	let td2_id_value;
	let t6;
	let td3;
	let span2;
	let button;
	let span1;
	let button_class_value;
	let button_name_value;
	let button_id_value;
	let button_disabled_value;
	let span2_title_value;
	let t7;
	let mounted;
	let dispose;

	function click_handler(...args) {
		return /*click_handler*/ ctx[17](/*index*/ ctx[40], ...args);
	}

	const block = {
		c: function create() {
			tr = element("tr");
			td0 = element("td");
			span0 = element("span");
			input = element("input");
			t0 = space();
			div = element("div");
			t1 = text(t1_value);
			t2 = space();
			td1 = element("td");
			t3 = text(t3_value);
			t4 = space();
			td2 = element("td");
			t5 = text(t5_value);
			t6 = space();
			td3 = element("td");
			span2 = element("span");
			button = element("button");
			span1 = element("span");
			t7 = space();
			attr_dev(input, "type", "checkbox");
			attr_dev(input, "class", input_class_value = "" + (null_to_empty("mr-2 mt-1 custom_checkbox_new float-left select_editable_guid" + (/*object_data*/ ctx[6].cg ? "" : " pointer_event_none")) + " svelte-1qzd0v1"));
			attr_dev(input, "target-guid", input_target_guid_value = /*object_data*/ ctx[6].cg);
			input.disabled = input_disabled_value = /*object_data*/ ctx[6].cg ? false : true;
			add_location(input, file, 841, 56, 42348);
			attr_dev(div, "class", "inline-block btn-secondary btn-circle rounded-circle width27 height27 font12 text-center p-1 btn-sm square svelte-1qzd0v1");
			add_location(div, file, 842, 56, 42623);
			attr_dev(span0, "class", "d-inline-block p-0");
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "title", span0_title_value = /*object_data*/ ctx[6].cg ? "" : language.child_not_generated);
			attr_dev(span0, "data-bs-placement", "right");
			add_location(span0, file, 840, 52, 42151);
			attr_dev(td0, "class", "width80 text-center align-middle svelte-1qzd0v1");
			add_location(td0, file, 839, 48, 42052);
			attr_dev(td1, "id", td1_id_value = "col_" + /*index*/ ctx[40] + "_" + 0);
			attr_dev(td1, "contenteditable", "true");
			attr_dev(td1, "class", "min_wid_95 width_max_content max_width_300 word-wrap-break align-middle svelte-1qzd0v1");
			add_location(td1, file, 845, 48, 42953);
			attr_dev(td2, "id", td2_id_value = "col_" + /*index*/ ctx[40] + "_" + 1);
			attr_dev(td2, "contenteditable", "true");
			attr_dev(td2, "class", "min_wid_95 width_max_content max_width_300 word-wrap-break align-middle svelte-1qzd0v1");
			add_location(td2, file, 846, 48, 43182);
			attr_dev(span1, "class", "icomoon icomoon-24px-delete-1 s4");
			add_location(span1, file, 850, 60, 43982);
			attr_dev(button, "class", button_class_value = "" + (null_to_empty("btn" + (/*object_data*/ ctx[6].cg ? " pointer_event_none" : "")) + " svelte-1qzd0v1"));
			attr_dev(button, "name", button_name_value = "delete_elm" + /*index*/ ctx[40]);
			attr_dev(button, "id", button_id_value = "delete_elm" + /*index*/ ctx[40]);
			button.disabled = button_disabled_value = /*object_data*/ ctx[6].cg ? true : false;
			add_location(button, file, 849, 56, 43714);
			attr_dev(span2, "class", "d-inline-block ml-2");
			attr_dev(span2, "data-bs-toggle", "tooltip");
			attr_dev(span2, "data-bs-placement", "top");

			attr_dev(span2, "title", span2_title_value = /*object_data*/ ctx[6].cg
			? language.deletion_not_allowed
			: language.del_row);

			add_location(span2, file, 848, 52, 43510);
			attr_dev(td3, "class", "width65 text-center align-middle svelte-1qzd0v1");
			add_location(td3, file, 847, 48, 43411);
			add_location(tr, file, 838, 44, 41998);
		},
		m: function mount(target, anchor) {
			insert_dev(target, tr, anchor);
			append_dev(tr, td0);
			append_dev(td0, span0);
			append_dev(span0, input);
			append_dev(span0, t0);
			append_dev(span0, div);
			append_dev(div, t1);
			append_dev(tr, t2);
			append_dev(tr, td1);
			append_dev(td1, t3);
			append_dev(tr, t4);
			append_dev(tr, td2);
			append_dev(td2, t5);
			append_dev(tr, t6);
			append_dev(tr, td3);
			append_dev(td3, span2);
			append_dev(span2, button);
			append_dev(button, span1);
			append_dev(tr, t7);

			if (!mounted) {
				dispose = [
					listen_dev(td1, "blur", /*handleEdit*/ ctx[7], false, false, false),
					listen_dev(td2, "blur", /*handleEdit*/ ctx[7], false, false, false),
					listen_dev(button, "click", click_handler, false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty[0] & /*state*/ 1 && input_class_value !== (input_class_value = "" + (null_to_empty("mr-2 mt-1 custom_checkbox_new float-left select_editable_guid" + (/*object_data*/ ctx[6].cg ? "" : " pointer_event_none")) + " svelte-1qzd0v1"))) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty[0] & /*state*/ 1 && input_target_guid_value !== (input_target_guid_value = /*object_data*/ ctx[6].cg)) {
				attr_dev(input, "target-guid", input_target_guid_value);
			}

			if (dirty[0] & /*state*/ 1 && input_disabled_value !== (input_disabled_value = /*object_data*/ ctx[6].cg ? false : true)) {
				prop_dev(input, "disabled", input_disabled_value);
			}

			if (dirty[0] & /*state*/ 1 && span0_title_value !== (span0_title_value = /*object_data*/ ctx[6].cg ? "" : language.child_not_generated)) {
				attr_dev(span0, "title", span0_title_value);
			}

			if (dirty[0] & /*state*/ 1 && t3_value !== (t3_value = /*object_data*/ ctx[6].c1 + "")) set_data_dev(t3, t3_value);
			if (dirty[0] & /*state*/ 1 && t5_value !== (t5_value = /*object_data*/ ctx[6].c2 + "")) set_data_dev(t5, t5_value);

			if (dirty[0] & /*state*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty("btn" + (/*object_data*/ ctx[6].cg ? " pointer_event_none" : "")) + " svelte-1qzd0v1"))) {
				attr_dev(button, "class", button_class_value);
			}

			if (dirty[0] & /*state*/ 1 && button_disabled_value !== (button_disabled_value = /*object_data*/ ctx[6].cg ? true : false)) {
				prop_dev(button, "disabled", button_disabled_value);
			}

			if (dirty[0] & /*state*/ 1 && span2_title_value !== (span2_title_value = /*object_data*/ ctx[6].cg
			? language.deletion_not_allowed
			: language.del_row)) {
				attr_dev(span2, "title", span2_title_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(tr);
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(838:40) {#if index > 0}",
		ctx
	});

	return block;
}

// (835:36) {#each state.data_cdata as object_data, index}
function create_each_block(ctx) {
	let if_block_anchor;
	let if_block = /*index*/ ctx[40] > 0 && create_if_block_1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (/*index*/ ctx[40] > 0) if_block.p(ctx, dirty);
		},
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(835:36) {#each state.data_cdata as object_data, index}",
		ctx
	});

	return block;
}

// (880:12) <div slot="title">
function create_title_slot(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = `${language.save_header}`;
			attr_dev(div, "slot", "title");
			add_location(div, file, 879, 12, 45219);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_title_slot.name,
		type: "slot",
		source: "(880:12) <div slot=\\\"title\\\">",
		ctx
	});

	return block;
}

// (887:16) <Button                      variant="contained"                      on:click={handleUpdate(row_no)}                      class="text-white bg-primary"                      style={'text-transform:none;float:right;margin:5px;'}                  >
function create_default_slot_1(ctx) {
	let t;

	const block = {
		c: function create() {
			t = text("OK");
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
		id: create_default_slot_1.name,
		type: "slot",
		source: "(887:16) <Button                      variant=\\\"contained\\\"                      on:click={handleUpdate(row_no)}                      class=\\\"text-white bg-primary\\\"                      style={'text-transform:none;float:right;margin:5px;'}                  >",
		ctx
	});

	return block;
}

// (886:12) <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
function create_footer_slot(ctx) {
	let div;
	let button;
	let current;

	button = new Button({
			props: {
				variant: "contained",
				class: "text-white bg-primary",
				style: "text-transform:none;float:right;margin:5px;",
				$$slots: { default: [create_default_slot_1] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", function () {
		if (is_function(/*handleUpdate*/ ctx[8](/*row_no*/ ctx[2]))) /*handleUpdate*/ ctx[8](/*row_no*/ ctx[2]).apply(this, arguments);
	});

	const block = {
		c: function create() {
			div = element("div");
			create_component(button.$$.fragment);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "footer");
			set_style(div, "border-top", "1px solid var(--divider, rgba(0, 0, 0, 0.1))");
			add_location(div, file, 885, 12, 45462);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			mount_component(button, div, null);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const button_changes = {};

			if (dirty[1] & /*$$scope*/ 1024) {
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
		source: "(886:12) <div slot=\\\"footer\\\" class=\\\"footer\\\" style=\\\"border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));\\\">",
		ctx
	});

	return block;
}

// (878:4) <Dialog    bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}} style={'width:500px;'} >
function create_default_slot(ctx) {
	let t0;
	let div1;
	let div0;
	let span;
	let span_style_value;
	let t2;

	const block = {
		c: function create() {
			t0 = space();
			div1 = element("div");
			div0 = element("div");
			span = element("span");
			span.textContent = `${language.child_update}`;
			t2 = space();
			attr_dev(span, "class", "col-md-12");
			attr_dev(span, "style", span_style_value = "margin:40px;");
			add_location(span, file, 882, 20, 45334);
			attr_dev(div0, "class", "row");
			add_location(div0, file, 881, 16, 45295);
			add_location(div1, file, 880, 12, 45272);
		},
		m: function mount(target, anchor) {
			insert_dev(target, t0, anchor);
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, span);
			insert_dev(target, t2, anchor);
		},
		p: noop,
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(t0);
			if (detaching) detach_dev(div1);
			if (detaching) detach_dev(t2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot.name,
		type: "slot",
		source: "(878:4) <Dialog    bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}} style={'width:500px;'} >",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let div7;
	let div6;
	let div5;
	let div4;
	let div3;
	let div1;
	let div0;
	let b;
	let t0_value = /*state*/ ctx[0].counter + "/" + (/*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata.length - 1) + "";
	let t0;
	let div0_style_value;
	let t1;
	let div2;
	let span0;
	let button0;
	let t2_value = language.import_csv + "";
	let t2;
	let button0_class_value;
	let span0_title_value;
	let t3;
	let input;
	let t4;
	let span1;
	let button1;

	let t5_value = (/*handle_generate*/ ctx[5]
	? language.generate_item
	: /*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata[1].cg
		? language.update_item
		: language.generate_item) + "";

	let t5;
	let button1_class_value;
	let span1_title_value;
	let t6;
	let span2;
	let button2;

	let t7_value = (/*state*/ ctx[0].selected_length > 0
	? language.show_all_label + " (" + /*state*/ ctx[0].selected_length + ")"
	: language.show_all_label) + "";

	let t7;
	let button2_class_value;
	let button2_disabled_value;
	let span2_title_value;
	let t8;
	let t9;
	let button3;
	let t10_value = language.add_option + "";
	let t10;
	let button3_title_value;
	let t11;
	let dialog;
	let updating_visible;
	let current;
	let mounted;
	let dispose;
	let if_block = /*state*/ ctx[0].data_cdata && create_if_block(ctx);

	function dialog_visible_binding(value) {
		/*dialog_visible_binding*/ ctx[18].call(null, value);
	}

	let dialog_props = {
		style: "width:500px;",
		$$slots: {
			default: [create_default_slot],
			footer: [create_footer_slot],
			title: [create_title_slot]
		},
		$$scope: { ctx }
	};

	if (/*state*/ ctx[0].EditorModalBox !== void 0) {
		dialog_props.visible = /*state*/ ctx[0].EditorModalBox;
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, "visible", dialog_visible_binding));
	dialog.$on("close", /*close_handler*/ ctx[19]);

	const block = {
		c: function create() {
			div7 = element("div");
			div6 = element("div");
			div5 = element("div");
			div4 = element("div");
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");
			b = element("b");
			t0 = text(t0_value);
			t1 = space();
			div2 = element("div");
			span0 = element("span");
			button0 = element("button");
			t2 = text(t2_value);
			t3 = space();
			input = element("input");
			t4 = space();
			span1 = element("span");
			button1 = element("button");
			t5 = text(t5_value);
			t6 = space();
			span2 = element("span");
			button2 = element("button");
			t7 = text(t7_value);
			t8 = space();
			if (if_block) if_block.c();
			t9 = space();
			button3 = element("button");
			t10 = text(t10_value);
			t11 = space();
			create_component(dialog.$$.fragment);
			add_location(b, file, 798, 155, 38094);
			attr_dev(div0, "class", "progress-bar bg-success progress-bar-striped progress-bar-animated font-weight-bolder");
			attr_dev(div0, "style", div0_style_value = "width:" + /*progress_data*/ ctx[4]);
			add_location(div0, file, 798, 24, 37963);
			attr_dev(div1, "id", "warning_label_container");
			attr_dev(div1, "class", "progress w-100 h my-2 height20 svelte-1qzd0v1");
			add_location(div1, file, 797, 20, 37864);
			attr_dev(button0, "class", button0_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_disable*/ ctx[3] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"));
			attr_dev(button0, "name", "import_csv_btn");
			button0.disabled = /*handle_disable*/ ctx[3];
			add_location(button0, file, 802, 28, 38430);
			attr_dev(span0, "class", "d-inline-block");
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "data-bs-placement", "top");

			attr_dev(span0, "title", span0_title_value = /*handle_disable*/ ctx[3]
			? language.new_not_allowed
			: language.csv_file);

			add_location(span0, file, 801, 24, 38263);
			attr_dev(input, "id", "fileUpload");
			attr_dev(input, "type", "file");
			attr_dev(input, "class", "upload h");
			add_location(input, file, 804, 24, 38674);
			attr_dev(button1, "class", button1_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_generate*/ ctx[5] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"));
			attr_dev(button1, "name", "generate_question_btn");
			attr_dev(button1, "id", "generate_question_btn");
			button1.disabled = /*handle_generate*/ ctx[5];
			add_location(button1, file, 806, 28, 39034);
			attr_dev(span1, "class", "d-inline-block ml-2");
			attr_dev(span1, "data-bs-toggle", "tooltip");
			attr_dev(span1, "data-bs-placement", "top");

			attr_dev(span1, "title", span1_title_value = /*handle_generate*/ ctx[5]
			? /*handle_disable*/ ctx[3]
				? language.already_generated
				: language.save_war_msg
			: /*handle_disable*/ ctx[3]
				? language.new_row_tooltip
				: language.generate_items);

			add_location(span1, file, 805, 24, 38776);

			attr_dev(button2, "class", button2_class_value = "" + (null_to_empty("btn btn-primary btn-md width125" + (/*state*/ ctx[0].handle_disable_show
			? " pointer_event_none"
			: "")) + " svelte-1qzd0v1"));

			attr_dev(button2, "name", "show_all_child");
			attr_dev(button2, "id", "show_all_child");
			button2.disabled = button2_disabled_value = /*state*/ ctx[0].handle_disable_show;
			add_location(button2, file, 809, 28, 39655);
			attr_dev(span2, "class", "d-inline-block ml-2");
			attr_dev(span2, "data-bs-toggle", "tooltip");
			attr_dev(span2, "data-bs-placement", "top");

			attr_dev(span2, "title", span2_title_value = /*state*/ ctx[0].handle_disable_show
			? /*handle_disable*/ ctx[3]
				? language.child_not_selected
				: language.child_not_generated
			: language.show_all);

			add_location(span2, file, 808, 24, 39425);
			add_location(div2, file, 800, 20, 38232);
			attr_dev(button3, "data-bs-toggle", "tooltip");
			attr_dev(button3, "data-bs-placement", "top");
			attr_dev(button3, "title", button3_title_value = language.add_child);
			attr_dev(button3, "class", "btn btn-primary btn-md mt-2");
			attr_dev(button3, "name", "Add_row");
			attr_dev(button3, "id", "Add_row");
			add_location(button3, file, 862, 20, 44515);
			attr_dev(div3, "class", "col-12");
			add_location(div3, file, 796, 16, 37822);
			attr_dev(div4, "class", "row");
			add_location(div4, file, 795, 12, 37787);
			attr_dev(div5, "class", "container");
			add_location(div5, file, 794, 8, 37750);
			attr_dev(div6, "id", "authoring_container");
			attr_dev(div6, "class", "container w-100 px-3 py-3");
			add_location(div6, file, 793, 4, 37676);
			add_location(div7, file, 792, 0, 37665);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div7, anchor);
			append_dev(div7, div6);
			append_dev(div6, div5);
			append_dev(div5, div4);
			append_dev(div4, div3);
			append_dev(div3, div1);
			append_dev(div1, div0);
			append_dev(div0, b);
			append_dev(b, t0);
			append_dev(div3, t1);
			append_dev(div3, div2);
			append_dev(div2, span0);
			append_dev(span0, button0);
			append_dev(button0, t2);
			append_dev(div2, t3);
			append_dev(div2, input);
			append_dev(div2, t4);
			append_dev(div2, span1);
			append_dev(span1, button1);
			append_dev(button1, t5);
			append_dev(div2, t6);
			append_dev(div2, span2);
			append_dev(span2, button2);
			append_dev(button2, t7);
			append_dev(div3, t8);
			if (if_block) if_block.m(div3, null);
			append_dev(div3, t9);
			append_dev(div3, button3);
			append_dev(button3, t10);
			append_dev(div7, t11);
			mount_component(dialog, div7, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(button0, "click", handleImport, false, false, false),
					listen_dev(input, "change", /*uploadCsv*/ ctx[13], false, false, false),
					listen_dev(button1, "click", /*generateQuestions*/ ctx[10], false, false, false),
					listen_dev(button2, "click", /*showAllChild*/ ctx[11], false, false, false),
					listen_dev(button3, "click", /*addOption*/ ctx[12], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			if ((!current || dirty[0] & /*state*/ 1) && t0_value !== (t0_value = /*state*/ ctx[0].counter + "/" + (/*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata.length - 1) + "")) set_data_dev(t0, t0_value);

			if (!current || dirty[0] & /*progress_data*/ 16 && div0_style_value !== (div0_style_value = "width:" + /*progress_data*/ ctx[4])) {
				attr_dev(div0, "style", div0_style_value);
			}

			if (!current || dirty[0] & /*handle_disable*/ 8 && button0_class_value !== (button0_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_disable*/ ctx[3] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"))) {
				attr_dev(button0, "class", button0_class_value);
			}

			if (!current || dirty[0] & /*handle_disable*/ 8) {
				prop_dev(button0, "disabled", /*handle_disable*/ ctx[3]);
			}

			if (!current || dirty[0] & /*handle_disable*/ 8 && span0_title_value !== (span0_title_value = /*handle_disable*/ ctx[3]
			? language.new_not_allowed
			: language.csv_file)) {
				attr_dev(span0, "title", span0_title_value);
			}

			if ((!current || dirty[0] & /*handle_generate, state*/ 33) && t5_value !== (t5_value = (/*handle_generate*/ ctx[5]
			? language.generate_item
			: /*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata[1].cg
				? language.update_item
				: language.generate_item) + "")) set_data_dev(t5, t5_value);

			if (!current || dirty[0] & /*handle_generate*/ 32 && button1_class_value !== (button1_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_generate*/ ctx[5] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"))) {
				attr_dev(button1, "class", button1_class_value);
			}

			if (!current || dirty[0] & /*handle_generate*/ 32) {
				prop_dev(button1, "disabled", /*handle_generate*/ ctx[5]);
			}

			if (!current || dirty[0] & /*handle_generate, handle_disable*/ 40 && span1_title_value !== (span1_title_value = /*handle_generate*/ ctx[5]
			? /*handle_disable*/ ctx[3]
				? language.already_generated
				: language.save_war_msg
			: /*handle_disable*/ ctx[3]
				? language.new_row_tooltip
				: language.generate_items)) {
				attr_dev(span1, "title", span1_title_value);
			}

			if ((!current || dirty[0] & /*state*/ 1) && t7_value !== (t7_value = (/*state*/ ctx[0].selected_length > 0
			? language.show_all_label + " (" + /*state*/ ctx[0].selected_length + ")"
			: language.show_all_label) + "")) set_data_dev(t7, t7_value);

			if (!current || dirty[0] & /*state*/ 1 && button2_class_value !== (button2_class_value = "" + (null_to_empty("btn btn-primary btn-md width125" + (/*state*/ ctx[0].handle_disable_show
			? " pointer_event_none"
			: "")) + " svelte-1qzd0v1"))) {
				attr_dev(button2, "class", button2_class_value);
			}

			if (!current || dirty[0] & /*state*/ 1 && button2_disabled_value !== (button2_disabled_value = /*state*/ ctx[0].handle_disable_show)) {
				prop_dev(button2, "disabled", button2_disabled_value);
			}

			if (!current || dirty[0] & /*state, handle_disable*/ 9 && span2_title_value !== (span2_title_value = /*state*/ ctx[0].handle_disable_show
			? /*handle_disable*/ ctx[3]
				? language.child_not_selected
				: language.child_not_generated
			: language.show_all)) {
				attr_dev(span2, "title", span2_title_value);
			}

			if (/*state*/ ctx[0].data_cdata) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
					if_block.c();
					if_block.m(div3, t9);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			const dialog_changes = {};

			if (dirty[0] & /*row_no*/ 4 | dirty[1] & /*$$scope*/ 1024) {
				dialog_changes.$$scope = { dirty, ctx };
			}

			if (!updating_visible && dirty[0] & /*state*/ 1) {
				updating_visible = true;
				dialog_changes.visible = /*state*/ ctx[0].EditorModalBox;
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
			if (detaching) detach_dev(div7);
			if (if_block) if_block.d();
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

function handleImport() {
	// opens the file select dialog box for import the csv
	document.querySelector("#fileUpload").click();
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("ListAuthoring", slots, []);
	let state = {};
	let temp_array = [];
	let file_name;
	let child_generated;
	let row_no;
	let object_data;
	let count = true;
	
	let { xml } = $$props;
	let { getChildXml } = $$props;
	let { editorState } = $$props;

	//alert(editorState.xml);
	//////////////// Described states////////////
	let stateData = writable({
		xml: "",
		handle_disable_show: true,
		selected_length: 0,
		editorModalHandle: false,
		counter: 0,
		EditorModalBox: false
	});

	let modal = {
		header: [],
		body: [],
		footer: [],
		maxWidth: "sm"
	};

	const unsubscribe = stateData.subscribe(items => {
		$$invalidate(0, state = items);
	});

	onMount(() => {
		// used to show the tooltip
		// jQuery('#authoring_container').tooltip({
		//     selector: '[data-toggle="tooltip"]'
		// });
		// jQuery(document).on('change', '.checkall', function() {
		//     jQuery('.select_editable_guid').prop('checked', jQuery(this).prop('checked'));
		// });
		AH.listen(document, "change", ".checkall", _this => {
			AH.selectAll(".select_editable_guid", { checked: _this.getAttribute("checked") });
		});

		// jQuery(document).on('change', '.checkall, .select_editable_guid', function() {
		//     var selected_length = jQuery('.select_editable_guid:checked').length;
		//     if (selected_length > 0) {
		//         state.handle_disable_show = false;
		//         state.selected_length = selected_length;
		//     } else {
		//             state.handle_disable_show = true;
		//             state.selected_length = 0;
		//     }
		// });
		AH.listen(document, "change", ".checkall, .select_editable_guid", function () {
			let selected_length = AH.select(".select_editable_guid", "checked").length;

			if (selected_length > 0) {
				$$invalidate(0, state.handle_disable_show = false, state);
				$$invalidate(0, state.selected_length = selected_length, state);
			} else {
				$$invalidate(0, state.handle_disable_show = true, state);
				$$invalidate(0, state.selected_length = 0, state);
			}
		});
	});

	afterUpdate(() => {
		if (xml != state.xml) {
			$$invalidate(0, state.xml = xml, state);
			loadModule(xml);
		}

		if (editorState.guid && state.data_cdata && state.data_cdata[0].pg == "") {
			setParentGuid(editorState.guid);
		}
	});

	// loads the module
	function loadModule(xml) {
		// contains the json data of xml
		let newXML = XMLToJSON(xml);

		// used for parse the xml and updates the xml
		parseXMLAuthoring(newXML);
	}

	// parses the xml data and update the xml
	function parseXMLAuthoring(MYXML) {
		try {
			if (count) {
				// contains the information of each rows in the form of json 
				temp_array = JSON.parse(MYXML.smxml.__cdata).list;

				count = false;
			}

			$$invalidate(0, state.data_cdata = temp_array, state);
			$$invalidate(0, state.xml = MYXML, state);
		} catch(error) {
			console.log({ error });
		}
	}

	// used for update the xml
	function updateXML(cdata_value) {
		// updates the cdata value of xml
		$$invalidate(0, state.xml.smxml.__cdata = cdata_value, state);

		// updates the xml
		getChildXml(JSONToXML(state.xml));
	}

	//used for update the column(s) value in xml
	function handleEdit(event) {
		// contains the id of that column in which changes made
		let target_id = event.target.id;

		// finds the row no in which changes made
		$$invalidate(2, row_no = target_id.split("_")[1]);

		// finds the column no in which changes made
		let col_no = target_id.split("_")[2];

		// contains previous column value
		let previous_data;

		// updates the respective column value according to change in column value
		col_no == 0
		? (previous_data = state.data_cdata[row_no].c1, $$invalidate(0, state.data_cdata[row_no].c1 = document.querySelector("#" + target_id).innerText, state))
		: (previous_data = state.data_cdata[row_no].c2, $$invalidate(0, state.data_cdata[row_no].c2 = document.querySelector("#" + target_id).innerText, state));

		// updates the xml
		updateXML(JSON.stringify({ "list": state.data_cdata }));

		if (state.data_cdata[row_no].cg && (col_no == 0
		? previous_data != state.data_cdata[row_no].c1
		: previous_data != state.data_cdata[row_no].c2)) {
			// modal = {
			//     header: {
			//         body: (<div>{l.save_header}</div>),
			//         class: "editor_modal_title"
			//     },
			//     body: {
			//     body: (<div>{l.child_update}</div>),
			//         class: "editor_modal_content",
			//         style: {height: 'auto'}
			//     },
			//     footer: {
			//         body: [{label: 'OK', class: "bg-primary text-white", onAction: ()=> self.handleUpdate(row_no)}],
			//         class: "editor_modal_action"
			//     },
			//     maxWidth: 'sm',
			// };
			$$invalidate(0, state.EditorModalBox = true, state);

			editorModalUpdate(true);
		}
	}

	// used for update the guids which exist in "Current Guid" and "Used in Guids" field of respective row
	function handleUpdate(rowNo) {
		editorModalUpdate(false);
		updateOldGuidsOption(rowNo, state.data_cdata[rowNo].cg, state.data_cdata[rowNo].pg, state.data_cdata[rowNo].rn, state.data_cdata[rowNo].ag);
	}

	// generates the guid for each rows
	function generateItems(parent_guid, current_row_val) {
		return new Promise(resolve => {
				try {
					// stores the random row no
					let random_rows = [], randomRowNo;

					for (let index_no = 0; index_no < 3; index_no += 1) {
						// contains the random row no returned by the method "findRandomRowNo"
						randomRowNo = findRandomRowNo(current_row_val, random_rows);

						while (!randomRowNo) {
							// calls the method "findRandomRowNo" till it does not get the row no
							randomRowNo = findRandomRowNo(current_row_val, random_rows);
						}

						if (randomRowNo) {
							// pushes the row no received randomly
							random_rows.push(randomRowNo);
						}
					}

					let algo_xml_data = AH.get("algo_var_data");
					algo_xml_data = algo_xml_data && algo_xml_data.replace(/"/gm, "\"");

					// creates the object that has to be send for generate the guid on server side
					let question_obj = {
						"question": "",
						"answers": [],
						"correct_ans_str": "A",
						"total_answers": 4,
						"correct_answers": 1,
						"title": "",
						parent_guid,
						"explanation": "Answer <seq no=\"a\"></seq> is correct.",
						"algo_qxml": algo_xml_data
					};

					// updates the correct answer value in array key answers of object question_obj
					question_obj.answers.push({
						"is_correct": "1",
						"answer": state.data_cdata[current_row_val].c2,
						"id": "01"
					});

					for (let index_no1 = 0; index_no1 < 3; index_no1 += 1) {
						// updates the other options value in array key answers of object question_obj
						question_obj.answers.push({
							"is_correct": "0",
							"answer": state.data_cdata[random_rows[index_no1]].c2,
							"id": "0" + (index_no1 + 2)
						});
					}

					// sets the title for guid
					//question_obj.title = $('#title').html() + ': ' + state.data_cdata[current_row_val].c1;
					question_obj.title = document.querySelector("#title").innerHTML + ": " + state.data_cdata[current_row_val].c1;

					// sets the question data for guid
					question_obj.question = state.data_cdata[current_row_val].c1;

					// request for get the guid
					// AH.ajax({
					//     //ajax: "1",
					//     url: baseUrl + 'editor/index.php', // denotes file where ajax request will be handle by server
					//    // cache: false, // does not stores request data in cache memory
					//     data: {
					//         str_content: question_obj, // object data which needs to be used for create the new guid
					//         func: "get_guid_from_api", // condition in which block ajax request will be received and response will be send from server
					//         //snippet: $('#title').html() + ': ' + self.state.data_cdata[current_row_val].c1
					//         snippet: document.querySelector('#title').innerHTML + ': ' + state.data_cdata[current_row_val].c1
					//     },
					//     type: "post", // used for security purpose
					//     success: function (response) {
					//         // contains the response in object form
					//         var json_received_string = JSON.parse(response);
					//         if (json_received_string && json_received_string.content_guid) {
					//             // stores the generated guid in current_guid key of respective row
					//             temp_array[current_row_val].cg = json_received_string.content_guid;
					//             for (var index_no1 = 0; index_no1 < 3; index_no1 += 1) {
					//                 // stores the generated guid in all rows "used_in_guids" key with the help of which current guid is generated
					//                 temp_array[random_rows[index_no1]].ag.push(json_received_string.content_guid);
					//                 // stores the row no which are used for create the generated guid
					//                 temp_array[current_row_val].rn.push(random_rows[index_no1]);
					//             }
					//             if (current_row_val == (state.data_cdata.length - 1)) {
					//                 // updates the xml with created guids
					//                 updateXML(JSON.stringify({ "list": temp_array }));
					//             }
					//         }
					//         resolve(json_received_string.content_guid);
					//     }
					// });
					AH.ajax({
						type: "post",
						url: baseUrl + "editor/index.php",
						longData: true,
						data: {
							str_content: JSON.stringify(question_obj),
							func: "get_guid_from_api",
							snippet: document.querySelector("#title").innerHTML + ": " + state.data_cdata[current_row_val].c1
						},
						onEnd() {
							AH.activate(0);
						}
					}).then(function (response) {
						console.log(response);

						// contains the response in object form
						// contains the response in object form
						let json_received_string = JSON.parse(response);

						if (json_received_string && json_received_string.content_guid) {
							// stores the generated guid in current_guid key of respective row
							temp_array[current_row_val].cg = json_received_string.content_guid;

							for (let index_no1 = 0; index_no1 < 3; index_no1 += 1) {
								// stores the generated guid in all rows "used_in_guids" key with the help of which current guid is generated
								temp_array[random_rows[index_no1]].ag.push(json_received_string.content_guid);

								// stores the row no which are used for create the generated guid
								temp_array[current_row_val].rn.push(random_rows[index_no1]);
							}

							if (current_row_val == state.data_cdata.length - 1) {
								// updates the xml with created guids
								updateXML(JSON.stringify({ "list": temp_array }));
							} //updateXML(JSON.stringify({ "list": Object.assign({},temp_array) }));
						}

						resolve(json_received_string.content_guid);
					});
				} catch(error) {
					console.log({ error });
					resolve(null);
				}
			});
	}

	// returns the random row no
	function findRandomRowNo(current_row_no, random_rows) {
		// contains the random no
		let random_row_value = Math.floor(Math.random() * (state.data_cdata.length - 1)) + 1;

		if (random_row_value == current_row_no || random_rows.indexOf(random_row_value) > -1) {
			// retuns the false if it is equal to current row or already stored in random_rows array
			return false;
		} else {
			// retuns the random value if it is not equal to current row and neither stored in random_rows array
			return random_row_value;
		}
	}

	// used for delete the row
	function handleDelete(index_no) {
		console.log("checking");

		if (state.data_cdata.length >= 6) {
			// removes the respective row from xml
			state.data_cdata.splice(index_no, 1);
		} else {
			AH.showmsg(language.min4_rows_allowed, 4000);
		}

		if (!state.data_cdata[1].cg || state.data_cdata[state.data_cdata.length - 1].cg) {
			// used for disabled the Generate/Update Items button
			$$invalidate(0, state.xml.smxml._disabled_generate = 1, state);
		} else {
			// used for enabled the Generate/Update Items button
			$$invalidate(0, state.xml.smxml._disabled_generate = 0, state);
		}

		// updates the xml
		updateXML(JSON.stringify({ "list": state.data_cdata }));
	}

	// updates the guids data
	function ajaxRequestForDataUpdate(rowNo, current_guid, row_no_array, parent_guid, close_activator) {
		// object that has to be send on server for update the guid
		return new Promise(function (resolve) {
				try {
					let algo_xml_data1 = AH.get("algo_var_data");
					algo_xml_data1 = algo_xml_data1 && algo_xml_data1.replace(/"/gm, "\"");

					let question_obj = {
						"question": state.data_cdata[rowNo].c1,
						"answers": [],
						"correct_ans_str": "A",
						"total_answers": 4,
						"correct_answers": 1,
						"title": state.xml.smxml._pt + ": " + state.data_cdata[rowNo].c1,
						parent_guid,
						"explanation": "Answer <seq no=\"a\"></seq> is correct.",
						"algo_qxml": algo_xml_data1
					};

					// updates the answers key data of object "question_obj"
					question_obj.answers.push({
						"is_correct": "1",
						"answer": state.data_cdata[rowNo].c2,
						"id": "01"
					});

					for (let index_no1 = 0; index_no1 < 3; index_no1 += 1) {
						// updates the answers key data of object "question_obj"
						question_obj.answers.push({
							"is_correct": "0",
							"answer": state.data_cdata[row_no_array[index_no1]].c2,
							"id": "0" + (index_no1 + 2)
						});
					}

					// ajax resquest for update the guid
					// AH.ajax({
					//     ajax: "1",
					//     url: baseUrl + 'editor/index.php', // defines where ajax request will be send
					//     cache: false, // does not stores data in cache memory
					//     data: {
					//         str_content: question_obj, // data in the form of object for update the guid
					//         func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
					//         content_guid: current_guid // sends the guid that has to be update
					//     },
					//     type: "post", // send the data with for security
					//     success: function (response) {
					//         // contains the response in object form
					//         var json_received_string = JSON.parse(response);
					//         if (json_received_string.content_guid && (close_activator == true)) {
					//             // close the activator
					//             console.log('ajaxRequestForDataUpdate');
					//             AH.activate(0);
					//             // shows the warning message
					//             AI && AI.showmsg(l.child_updated, 4000);
					//         }
					//         resolve(json_received_string.content_guid);
					//     }
					// });
					AH.ajax({
						type: "post",
						url: baseUrl + "editor/index.php",
						data: {
							str_content: question_obj, // data in the form of object for update the guid
							func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
							content_guid: current_guid, // sends the guid that has to be update
							
						},
						onEnd() {
							AH.activate(0);
						}
					}).then(function (response) {
						// contains the response in object form
						// contains the response in object form
						let json_received_string = JSON.parse(response);

						if (json_received_string.content_guid && close_activator == true) {
							// close the activator
							console.log("ajaxRequestForDataUpdate");

							AH.activate(0);

							// shows the warning message
							AI && AH.showmsg(language.child_updated, 4000);
						}

						resolve(json_received_string.content_guid);
					});
				} catch(error) {
					console.log({ error });
					resolve(null);
				}
			});
	}

	async function updateOldGuidsOption(rowNo, current_guid, parent_guid, created_with_rows, used_in) {
		// shows the activator
		console.log("updateOldGuidsOption 1");

		AH.activate(2);

		for (let index_no = 0; index_no < state.data_cdata.length; index_no += 1) {
			if (index_no != 0) {
				if (used_in.indexOf(state.data_cdata[index_no].cg) > -1) {
					// updates that rows current_guid which contains argument current_guid data in their "used_in_guids" array
					let received_data = await updateRelatedGuids(index_no, state.data_cdata[index_no].cg, parent_guid, state.data_cdata[index_no].rn, state.data_cdata[index_no].ag);

					if (!received_data) {
						AH.showmsg(language.check_net_update_ids, 4000);
						console.log("updateOldGuidsOption 2");
						AH.activate(0);
						break;
					}
				}

				if (index_no == state.data_cdata.length - 1) {
					// update the guid store in argument current_guid
					let received_data1 = await ajaxRequestForDataUpdate(rowNo, current_guid, created_with_rows, parent_guid, true);

					if (!received_data1) {
						AH.showmsg(language.check_net_update_ids, 4000);
						console.log("updateOldGuidsOption 3");
						AH.activate(0);
					}
				}
			}
		}

		// updates the parent guid
		updateParentGuid();
	}

	// updates that rows current_guid which contains argument current_guid data in their "used_in_guids" array
	function updateRelatedGuids(rowNo, current_guid, parent_guid, created_with_rows) {
		// called for update the guids data
		return ajaxRequestForDataUpdate(rowNo, current_guid, created_with_rows, parent_guid, false);
	}

	// used for set the parent guid in each rows xml and updates the xml
	function setParentGuid(guid_data) {
		console.log("guid_data " + guid_data);

		// used for defined the title of child items
		// state.xml.smxml._pt = $('#title').html();
		$$invalidate(0, state.xml.smxml._pt = document.querySelector("#title").innerHTML, state);

		// used for enabled the Generate/Update Items button
		$$invalidate(0, state.xml.smxml._disabled_generate = 0, state);

		// sets the parent guid for each row
		for (let key in state.data_cdata) {
			$$invalidate(0, state.data_cdata[key].pg = guid_data, state);
		}

		console.log({ "cdata ": state.data_cdata });

		//updates the xml
		updateXML(JSON.stringify({ "list": state.data_cdata }));
	}

	// userd for validation purpose before generate the items
	function generateQuestions() {
		// used for generate the guids for each row
		handleGenerateItems();
	}

	// used for generate the guid for each rows
	async function handleGenerateItems() {
		console.log("handle generate");

		if (state.data_cdata.length >= 5) {
			// used for disabled the Generate/Update Items button
			$$invalidate(0, state.xml.smxml._disabled_generate = 1, state);

			// sets the user guid in xml
			$$invalidate(0, state.xml.smxml._imported_by = user_guid, state);

			// sets the uploaded csv file name in xml
			$$invalidate(0, state.xml.smxml._file = file_name, state);

			let date_obj = new Date();

			// sets the date of uploaded csv file name in xml
			$$invalidate(0, state.xml.smxml._imported_on = date_obj.toDateString(), state);

			let is_failed = false;

			// shows the progress bar
			//jQuery('#warning_label_container').removeClass('h');
			AI.select("#warning_label_container", "removeClass", "h");

			// not allowed user to perform any operation
			//jQuery('#authoring_container').css('pointer-events', 'none');
			AH.setCss("#authoring_container", { "pointer-events": "none" });

			for (let index_no = 0; index_no < state.data_cdata.length; index_no += 1) {
				if (index_no != 0 && state.data_cdata[index_no].cg == "") {
					// called for generate the guid for each row
					let guid_data = await generateItems(state.data_cdata[index_no].pg, index_no);

					if (typeof guid_data == "undefined" || !guid_data) {
						is_failed = true;

						// shows warning message
						AH.showmsg(language.check_network, 4000);

						// used for enabled the Generate/Update Items button
						$$invalidate(0, state.xml.smxml._disabled_generate = 0, state);

						// allows user to perform the operation
						//jQuery('#authoring_container').css('pointer-events', 'auto');
						AH.setCss("#authoring_container", { "pointer-events": "auto" });

						// hides the progress bar
						//jQuery('#warning_label_container').addClass('h');
						AH.select("#warning_label_container", "addClass", "h");

						break;
					} else {
						// increases the counter according to the generated guids
						$$invalidate(0, state.counter = state.counter + 1, state);
					}
				}
			}

			if (!is_failed) {
				AH.showmsg(language.child_items_generated, 4000);

				// allows user to perform the operation
				//jQuery('#authoring_container').css('pointer-events', 'auto');
				AH.setCss("#authoring_container", { "pointer-events": "auto" });

				// updates the parent guid
				updateParentGuid();
			}
		} else {
			// shows warning message
			AH.showmsg(language.min4_max500_allowed, 4000);
		}
	}

	// used for show all the child guids which are selected
	function showAllChild() {
		// array for contain the child guid of selected row
		let routerGuid = [];

		// jQuery('.select_editable_guid:checked').each(function() {
		//     // pushes the child guid
		//     routerGuid.push(jQuery(this).attr('target-guid'));
		// });
		AH.select(".select_editable_guid", "checked").forEach(_this => {
			routerGuid.push(_this.getAttribute("target-guid"));
		});

		// url for show the selected child guids
		let futureUrl = baseUrl + "editor/v2/?action=edit&content_guid=" + routerGuid[0] + "&no_header=1&react_content=1&no_domain=1&router_guid=" + routerGuid.join(",");

		// opens the url in new tab
		window.open(futureUrl, "_blank");
	}

	// used for add the rows
	function addOption() {
		if (state.data_cdata.length < 501) {
			// contains the row data in object form
			$$invalidate(6, object_data = {
				"c1": "Data" + state.data_cdata.length,
				"c2": "Meaning" + state.data_cdata.length,
				"pg": state.data_cdata[0].pg,
				"cg": "",
				"ag": [],
				"rn": []
			});

			// pushes the data into data_cdata array
			state.data_cdata.push(object_data);

			if (state.data_cdata[1].cg) {
				// used for enabled the Generate/Update Items button
				$$invalidate(0, state.xml.smxml._disabled_generate = 0, state);
			}

			// updates the xml
			updateXML(JSON.stringify({ "list": state.data_cdata }));
		} else {
			// shows warning message
			AH.showmsg(language.max500_rows_allowed, 4000);
		}
	}

	// used for upload csv file and update the xml
	function uploadCsv() {
		try {
			// selects the element have id 'fileUpload' 
			let fileUpload = document.getElementById("fileUpload");

			// used for check the file extention 
			let regex = /\.csv$/;

			file_name = fileUpload.files[0].name;

			if (regex.test(fileUpload.value.toLowerCase())) {
				if (typeof FileReader != "undefined") {
					if (state.data_cdata[1].cg == "") {
						// Returns a newly constructed FileReader.
						let reader = new FileReader();

						// A handler for the M event. This event is triggered each time the reading operation is successfully completed
						reader.onload = function (event) {
							// converts csv data into json string data
							let importedCsv = csvToJson(event.target.result);

							if (importedCsv) {
								// updates the xml
								updateXML(importedCsv);

								count = true;
								AH && AH.showmsg(language.file_uploaded, 4000);
							}

							fileUpload.value = "";
						};

						reader.readAsText(fileUpload.files[0]);
					}
				} else {
					// shows the warning message
					AH.showmsg(language.html5_not_supported, 4000);
				}
			} else {
				// shows the warning message
				AH.showmsg(language.upload_valid_csv, 4000);
			}
		} catch(error) {
			console.log({ error });
		}
	}

	// converts csv data into json string data
	function csvToJson(csv) {
		// converts csv file data into Array
		let csv_array = papaparse_min.parse(csv).data;

		// contains rows data which is not blank 	
		csv_array = csv_array.filter(function (data) {
			let sub_csv_array = data.filter(function (val) {
				if (val && val.trim() != "") {
					return val;
				}
			});

			return sub_csv_array.length > 0;
		});

		// contains the row
		let row_data = [];

		// object for update the xml
		let str_data = {};

		if (csv_array.length <= 501 && csv_array.length >= 5) {
			for (let index_no = 0; index_no < csv_array.length; index_no += 1) {
				if (csv_array[index_no] && csv_array[index_no].length > 0) {
					// contains the column data in the form of array
					let column_data = csv_array[index_no];

					// object for update the xml
					str_data = {
						"c1": "",
						"c2": "",
						"pg": state.data_cdata[0].pg,
						"cg": "",
						"ag": [],
						"rn": []
					};

					for (let index_no1 = 0; index_no1 < column_data.length; index_no1 += 1) {
						if (column_data.length > 1) {
							if (column_data[index_no1] && column_data[index_no1].trim() != "" && (index_no1 == 0 || index_no1 == 1)) {
								if (index_no1 == 0) {
									// updates the first column value in xml
									str_data.c1 = column_data[index_no1].replace(/'/gm, "'").replace(/"/gm, "\"");
								} else {
									// updates the second column value in xml
									str_data.c2 = column_data[index_no1].replace(/'/gm, "'").replace(/"/gm, "\"");
								}
							} else {
								if (column_data[index_no1] && column_data[index_no1].trim() != "" && index_no1 > 1) {
									// shows warning message
									AH.showmsg(language.exact2_column_allowed, 4000);

									return false;
								} else {
									if (index_no1 <= 1) {
										// shows warning message
										AH.showmsg(language.blank_column_notallowed, 4000);

										return false;
									}
								}
							}
						} else {
							// shows warning message
							AH.showmsg(language.exact2_column_allowed, 4000);

							return false;
						}
					}

					// stores each rows data in object form
					row_data.push(str_data);
				} else {
					// shows warning message
					AH.showmsg(language.blank_column_notallowed, 4000);

					return false;
				}
			}

			// retuns the data of each csv file in json string
			return JSON.stringify({ "list": row_data });
		} else {
			// shows warning message
			AH.showmsg(language.min_max_validation, 4000);
		}
	}

	function updateParentGuid() {
		// @eslint issue, it's global method
		console.log("updateParentGuid 1");

		AH.activate(2);

		// AH.ajax({
		//     //ajax: "1",
		//     // @eslint issue, it's global variable
		//     url: baseUrl + 'editor/index.php', // defines where ajax request will be send
		//     //cache: false, // does not stores data in cache memory
		//     data: {
		//         // @eslint issue, it's global method
		//         str_content: JSONToXML(state.xml), // data in the form of object for update the guid
		//         func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
		//         content_guid: state.data_cdata[1].pg, // sends the guid that has to be update
		//         update_parent: 1
		//     },
		//     //type: "post", // send the data with for security
		//     success: function (response) {
		//         // contains the response in object form
		//         var json_received_string = JSON.parse(response);
		//         if (!json_received_string.content_guid) {
		//             // shows warning message
		//             // @eslint issue, it's global variable
		//             AI && AI.showmsg(l.check_net_and_save, 4000);
		//         }
		//         // @eslint issue, it's global method
		//         console.log("updateParentGuid 2");
		//         AH.activate(0);
		//         // hides the progress bar
		//         //jQuery('#warning_label_container').addClass('h');
		//         document.querySelector("#warning_label_container").classList.add("h");
		//     }
		// });
		AH.ajax({
			type: "post",
			url: baseUrl + "editor/index.php",
			data: {
				str_content: JSONToXML(state.xml), // data in the form of object for update the guid
				func: "update_guid_from_api", // defines the condiditon in which it can be access on server side
				content_guid: state.data_cdata[1].pg, // sends the guid that has to be update
				update_parent: 1
			},
			onEnd() {
				AH.activate(0);
			}
		}).then(function (response) {
			// contains the response in object form
			let json_received_string = JSON.parse(response);

			if (!json_received_string.content_guid) {
				// shows warning message
				// @eslint issue, it's global variable
				AH && AH.showmsg(language.check_net_and_save, 4000);
			}

			// @eslint issue, it's global method
			console.log("updateParentGuid 2");

			AH.activate(0);

			// hides the progress bar
			//jQuery('#warning_label_container').addClass('h');
			//document.querySelector("#warning_label_container").classList.add("h");
			AH.select("#warning_label_container", "addClass", "h");
		});
	}

	// $:{
	//     if (state.data_cdata && state.data_cdata[1].cg) {
	//         handle_disable = true;
	//     }
	//     handle_generate = state.xml && ((state.xml.smxml._disabled_generate == 1) ? true: false);
	//     alert(state.xml.smxml);
	//     if (state.data_cdata) {
	//         progress_data = Math.ceil((state.counter * 100) / (state.data_cdata.length - 1)) + '%';
	//     }
	//     if(state.data_cdata) {
	//         child_generated = (state.data_cdata[1].cg) ? false: true
	//     }
	// }
	let handle_disable = false;

	let progress_data = "";
	let handle_generate;

	// used for hide and show the warning dialog box
	function editorModalUpdate(args) {
		$$invalidate(0, state.editorModalHandle = args, state);
	}

	const writable_props = ["xml", "getChildXml", "editorState"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<ListAuthoring> was created with unknown prop '${key}'`);
	});

	const click_handler = index => {
		handleDelete(index);
	};

	function dialog_visible_binding(value) {
		state.EditorModalBox = value;
		$$invalidate(0, state);
	}

	const close_handler = () => {
		$$invalidate(0, state.EditorModalBox = false, state);
	};

	$$self.$$set = $$props => {
		if ("xml" in $$props) $$invalidate(14, xml = $$props.xml);
		if ("getChildXml" in $$props) $$invalidate(15, getChildXml = $$props.getChildXml);
		if ("editorState" in $$props) $$invalidate(16, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		l: language,
		writable,
		onMount,
		beforeUpdate,
		afterUpdate,
		AH,
		XMLToJSON,
		JSONToXML,
		data_parser: papaparse_min,
		Button,
		Dialog,
		Checkbox,
		state,
		temp_array,
		file_name,
		child_generated,
		row_no,
		object_data,
		count,
		xml,
		getChildXml,
		editorState,
		stateData,
		modal,
		unsubscribe,
		loadModule,
		parseXMLAuthoring,
		handleImport,
		updateXML,
		handleEdit,
		handleUpdate,
		generateItems,
		findRandomRowNo,
		handleDelete,
		ajaxRequestForDataUpdate,
		updateOldGuidsOption,
		updateRelatedGuids,
		setParentGuid,
		generateQuestions,
		handleGenerateItems,
		showAllChild,
		addOption,
		uploadCsv,
		csvToJson,
		updateParentGuid,
		handle_disable,
		progress_data,
		handle_generate,
		editorModalUpdate
	});

	$$self.$inject_state = $$props => {
		if ("state" in $$props) $$invalidate(0, state = $$props.state);
		if ("temp_array" in $$props) temp_array = $$props.temp_array;
		if ("file_name" in $$props) file_name = $$props.file_name;
		if ("child_generated" in $$props) $$invalidate(1, child_generated = $$props.child_generated);
		if ("row_no" in $$props) $$invalidate(2, row_no = $$props.row_no);
		if ("object_data" in $$props) $$invalidate(6, object_data = $$props.object_data);
		if ("count" in $$props) count = $$props.count;
		if ("xml" in $$props) $$invalidate(14, xml = $$props.xml);
		if ("getChildXml" in $$props) $$invalidate(15, getChildXml = $$props.getChildXml);
		if ("editorState" in $$props) $$invalidate(16, editorState = $$props.editorState);
		if ("stateData" in $$props) stateData = $$props.stateData;
		if ("modal" in $$props) modal = $$props.modal;
		if ("handle_disable" in $$props) $$invalidate(3, handle_disable = $$props.handle_disable);
		if ("progress_data" in $$props) $$invalidate(4, progress_data = $$props.progress_data);
		if ("handle_generate" in $$props) $$invalidate(5, handle_generate = $$props.handle_generate);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*editorState, state*/ 65537) {
			 {
				console.log("Editor State =>" + editorState.guid);
				console.log("Checking $");

				if (state.data_cdata && state.data_cdata[1].cg) {
					$$invalidate(3, handle_disable = true);
				}

				$$invalidate(5, handle_generate = state.xml && (state.xml.smxml._disabled_generate == 1 ? true : false));

				//alert(state.xml.smxml);
				if (state.data_cdata) {
					$$invalidate(4, progress_data = Math.ceil(state.counter * 100 / (state.data_cdata.length - 1)) + "%");
				}

				if (state.data_cdata) {
					$$invalidate(1, child_generated = state.data_cdata[1].cg ? false : true);
				}
			}
		}
	};

	return [
		state,
		child_generated,
		row_no,
		handle_disable,
		progress_data,
		handle_generate,
		object_data,
		handleEdit,
		handleUpdate,
		handleDelete,
		generateQuestions,
		showAllChild,
		addOption,
		uploadCsv,
		xml,
		getChildXml,
		editorState,
		click_handler,
		dialog_visible_binding,
		close_handler
	];
}

class ListAuthoring extends SvelteComponentDev {
	constructor(options) {
		super(options);
		if (!document_1.getElementById("svelte-1qzd0v1-style")) add_css();

		init(
			this,
			options,
			instance,
			create_fragment,
			safe_not_equal,
			{
				xml: 14,
				getChildXml: 15,
				editorState: 16
			},
			[-1, -1]
		);

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "ListAuthoring",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*xml*/ ctx[14] === undefined && !("xml" in props)) {
			console_1.warn("<ListAuthoring> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[15] === undefined && !("getChildXml" in props)) {
			console_1.warn("<ListAuthoring> was created without expected prop 'getChildXml'");
		}

		if (/*editorState*/ ctx[16] === undefined && !("editorState" in props)) {
			console_1.warn("<ListAuthoring> was created without expected prop 'editorState'");
		}
	}

	get xml() {
		throw new Error("<ListAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set xml(value) {
		throw new Error("<ListAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get getChildXml() {
		throw new Error("<ListAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set getChildXml(value) {
		throw new Error("<ListAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get editorState() {
		throw new Error("<ListAuthoring>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set editorState(value) {
		throw new Error("<ListAuthoring>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

export default ListAuthoring;
//# sourceMappingURL=ListAuthoring-131112d7.js.map
