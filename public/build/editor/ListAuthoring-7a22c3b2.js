
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { a8 as createCommonjsModule, a9 as commonjsGlobal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, e as element, p as append_dev, y as language, O as Dialog, P as binding_callbacks, Q as bind, v as validate_slots, o as onMount, A as AH, a7 as afterUpdate, w as writable, L as beforeUpdate, X as XMLToJSON, M as JSONToXML, U as Button, V as Checkbox, C as validate_each_argument, f as space, h as text, j as attr_dev, $ as null_to_empty, k as add_location, n as insert_dev, G as prop_dev, F as set_data_dev, x as detach_dev, K as destroy_each, z as empty, c as create_component, m as mount_component, q as listen_dev, W as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, H as run_all, E as is_function, B as noop, l as set_style } from './main-9d98459d.js';

/* @license
Papa Parse
v5.0.2
https://github.com/mholt/PapaParse
License: MIT
*/

var papaparse_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function s(){var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var r=(t=t||{}).dynamicTyping||!1;q(r)&&(t.dynamicTypingFunction=r,r={});if(t.dynamicTyping=r,t.transform=!!q(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var i=function(){if(!b.WORKERS_SUPPORTED)return !1;var e=(r=f.URL||f.webkitURL||null,i=s.toString(),b.BLOB_URL||(b.BLOB_URL=r.createObjectURL(new Blob(["(",i,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var r,i;return t.onmessage=_,t.id=h++,a[t.id]=t}();return i.userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=q(t.step),t.chunk=q(t.chunk),t.complete=q(t.complete),t.error=q(t.error),delete t.worker,void i.postMessage({input:e,config:t,workerId:i.id})}var n=null;"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&q(e.read)&&q(e.on)?n=new m(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var i=!1,_=!0,g=",",v="\r\n",n='"',s=n+n,r=!1,a=null;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(g=t.delimiter);("boolean"==typeof t.quotes||Array.isArray(t.quotes))&&(i=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(r=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(n=t.quoteChar);"boolean"==typeof t.header&&(_=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");a=t.columns;}void 0!==t.escapeChar&&(s=t.escapeChar+n);}();var o=new RegExp(U(n),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,r);if("object"==typeof e[0])return u(a||h(e[0]),e,r)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:h(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],r);throw new Error("Unable to serialize unrecognized input");function h(e){if("object"!=typeof e)return [];var t=[];for(var r in e)t.push(r);return t}function u(e,t,r){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(i+=g),i+=y(e[a],a);0<t.length&&(i+=v);}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(r&&!n&&(u="greedy"===r?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===r&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c]);}u=""===d.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(i+=g);var m=n&&s?e[p]:p;i+=y(t[o][m],p);}o<t.length-1&&(!r||0<h&&!f)&&(i+=v);}}return i}function y(e,t){if(null==e)return "";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);e=e.toString().replace(o,s);var r="boolean"==typeof i&&i||Array.isArray(i)&&i[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return !0;return !1}(e,b.BAD_DELIMITERS)||-1<e.indexOf(g)||" "===e.charAt(0)||" "===e.charAt(e.length-1);return r?n+e+n:e}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=E,b.ParserHandle=r,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=m,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var r=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},r)});}),e(),this;function e(){if(0!==h.length){var e,t,r,i,n=h[0];if(q(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,r=n.inputElem,i=s.reason,void(q(o.error)&&o.error({name:e},t,r,i));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){q(a)&&a(e,n.file,n.inputElem),u();},b.parse(n.file,n.instanceConfig);}else q(o.complete)&&o.complete();}function u(){h.splice(0,1),e();}};}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new r(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&q(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);void 0!==r&&(e=r);}this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+e;this._partialLine="";var n=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=i.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(q(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!q(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0;},this._sendError=function(e){q(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1});};}function l(e){var i;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else {if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),n||(i.onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)),i.open("GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t]);}if(this._config.chunkSize){var r=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+r);}try{i.send();}catch(e){this._chunkError(e.message);}n&&0===i.status?this._chunkError():this._start+=this._config.chunkSize;}},this._chunkLoaded=function(){4===i.readyState&&(i.status<200||400<=i.status?this._chunkError():(this._finished=!this._config.chunkSize||this._start>function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return -1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(i),this.parseChunk(i.responseText)));},this._chunkError=function(e){var t=i.statusText||e;this._sendError(new Error(t));};}function c(e){var i,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((i=new FileReader).onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)):i=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t);}var r=i.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:r}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(i.error);};}function p(e){var r;u.call(this,e=e||{}),this.stream=function(e){return r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}};}function m(e){u.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0;},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=y(function(){this._streamCleanUp(),i=!0,this._streamData("");},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function r(g){var a,o,h,i=Math.pow(2,53),n=-i,s=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,u=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,r=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(q(g.step)){var p=g.step;g.step=function(e){if(c=e,_())m();else {if(m(),0===c.data.length)return;r+=e.data.length,g.preview&&r>g.preview?o.abort():p(c,t);}};}function v(e){return "greedy"===g.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function m(){if(c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),g.skipEmptyLines)for(var e=0;e<c.data.length;e++)v(c.data[e])&&c.data.splice(e--,1);return _()&&function(){if(!c)return;function e(e){q(g.transformHeader)&&(e=g.transformHeader(e)),l.push(e);}if(Array.isArray(c.data[0])){for(var t=0;_()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1);}else c.data.forEach(e);}(),function(){if(!c||!g.header&&!g.dynamicTyping&&!g.transform)return c;function e(e,t){var r,i=g.header?{}:[];for(r=0;r<e.length;r++){var n=r,s=e[r];g.header&&(n=r>=l.length?"__parsed_extra":l[r]),g.transform&&(s=g.transform(s,n)),s=y(n,s),"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(s)):i[n]=s;}return g.header&&(r>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+r,f+t):r<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+r,f+t)),i}var t=1;!c.data[0]||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);g.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function _(){return g.header&&0===l.length}function y(e,t){return r=e,g.dynamicTypingFunction&&void 0===g.dynamicTyping[r]&&(g.dynamicTyping[r]=g.dynamicTypingFunction(r)),!0===(g.dynamicTyping[r]||g.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<i)return !0}return !1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var r;}function k(e,t,r,i){c.errors.push({type:e,code:t,message:r,row:i});}this.parse=function(e,t,r){var i=g.quoteChar||'"';if(g.newline||(g.newline=function(e,t){e=e.substr(0,1048576);var r=new RegExp(U(t)+"([^]*?)"+U(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return "\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(e,i)),h=!1,g.delimiter)q(g.delimiter)&&(g.delimiter=g.delimiter(e),c.meta.delimiter=g.delimiter);else {var n=function(e,t,r,i,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new E({comments:i,delimiter:f,newline:t,preview:10}).parse(e),m=0;m<p.data.length;m++)if(r&&v(p.data[m]))c++;else {var _=p.data[m].length;l+=_,void 0!==o?0<_&&(d+=Math.abs(_-o),o=_):o=_;}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l);}return {successful:!!(g.delimiter=s),bestDelimiter:s}}(e,g.newline,g.skipEmptyLines,g.comments,g.delimitersToGuess);n.successful?g.delimiter=n.bestDelimiter:(h=!0,g.delimiter=b.DefaultDelimiter),c.meta.delimiter=g.delimiter;}var s=w(g);return g.preview&&g.header&&s.preview++,a=e,o=new E(s),c=o.parse(a,t,r),m(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=a.substr(o.getCharIndex());},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(this.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,q(g.complete)&&g.complete(c),a="";};}function U(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e){var O,D=(e=e||{}).delimiter,I=e.newline,T=e.comments,A=e.step,L=e.preview,F=e.fastMode,z=O=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(z=e.escapeChar),("string"!=typeof D||-1<b.BAD_DELIMITERS.indexOf(D))&&(D=","),T===D)throw new Error("Comment character same as delimiter");!0===T?T="#":("string"!=typeof T||-1<b.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==I&&"\r"!==I&&"\r\n"!==I&&(I="\n");var M=0,j=!1;this.parse=function(a,r,t){if("string"!=typeof a)throw new Error("Input must be a string");var i=a.length,e=D.length,n=I.length,s=T.length,o=q(A),h=[],u=[],f=[],d=M=0;if(!a)return R();if(F||!1!==F&&-1===a.indexOf(O)){for(var l=a.split(I),c=0;c<l.length;c++){if(f=l[c],M+=f.length,c!==l.length-1)M+=I.length;else if(t)return R();if(!T||f.substr(0,s)!==T){if(o){if(h=[],b(f.split(D)),S(),j)return R()}else b(f.split(D));if(L&&L<=c)return h=h.slice(0,L),R(!0)}}return R()}for(var p=a.indexOf(D,M),m=a.indexOf(I,M),_=new RegExp(U(z)+U(O),"g"),g=a.indexOf(O,M);;)if(a[M]!==O)if(T&&0===f.length&&a.substr(M,s)===T){if(-1===m)return R();M=m+n,m=a.indexOf(I,M),p=a.indexOf(D,M);}else {if(-1!==p&&(p<m||-1===m)){if(-1===g){f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}var v=x(p,g,m);if(v&&void 0!==v.nextDelim){p=v.nextDelim,g=v.quoteSearch,f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}}if(-1===m)break;if(f.push(a.substring(M,m)),C(m+n),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0)}else for(g=M,M++;;){if(-1===(g=a.indexOf(O,g+1)))return t||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:M}),w();if(g===i-1)return w(a.substring(M,g).replace(_,O));if(O!==z||a[g+1]!==z){if(O===z||0===g||a[g-1]!==z){var y=E(-1===m?p:Math.min(p,m));if(a[g+1+y]===D){f.push(a.substring(M,g).replace(_,O)),a[M=g+1+y+e]!==O&&(g=a.indexOf(O,M)),p=a.indexOf(D,M),m=a.indexOf(I,M);break}var k=E(m);if(a.substr(g+1+k,n)===I){if(f.push(a.substring(M,g).replace(_,O)),C(g+1+k+n),p=a.indexOf(D,M),g=a.indexOf(O,M),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:M}),g++;}}else g++;}return w();function b(e){h.push(e),d=M;}function E(e){var t=0;if(-1!==e){var r=a.substring(g+1,e);r&&""===r.trim()&&(t=r.length);}return t}function w(e){return t||(void 0===e&&(e=a.substr(M)),f.push(e),M=i,b(f),o&&S()),R()}function C(e){M=e,b(f),f=[],m=a.indexOf(I,M);}function R(e,t){return {data:t||!1?h[0]:h,errors:u,meta:{delimiter:D,linebreak:I,aborted:j,truncated:!!e,cursor:d+(r||0)}}}function S(){A(R(void 0,!0)),h=[],u=[];}function x(e,t,r){var i={nextDelim:void 0,quoteSearch:void 0},n=a.indexOf(O,t+1);if(t<e&&e<n&&(n<r||-1===r)){var s=a.indexOf(D,n);if(-1===s)return i;n<s&&(n=a.indexOf(O,n+1)),i=x(s,n,r);}else i={nextDelim:e,quoteSearch:t};return i}},this.abort=function(){j=!0;},this.getCharIndex=function(){return M};}function _(e){var t=e.data,r=a[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){i=!0,g(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:v,resume:v};if(q(r.userStep)){for(var s=0;s<t.results.data.length&&(r.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!i);s++);delete t.results;}else q(r.userChunk)&&(r.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!i&&g(t.workerId,t.results);}function g(e,t){var r=a[e];q(r.userComplete)&&r.userComplete(t),r.terminate(),delete a[e];}function v(){throw new Error("Not implemented.")}function w(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=w(e[r]);return t}function y(e,t){return function(){e.apply(t,arguments);}}function q(e){return "function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var r=b.parse(t.input,t.config);r&&f.postMessage({workerId:b.WORKER_ID,results:r,finished:!0});}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,b});
});

/* clsSMList/ListAuthoring.svelte generated by Svelte v3.29.0 */

const { console: console_1, document: document_1 } = globals;
const file = "clsSMList/ListAuthoring.svelte";

function add_css() {
	var style = element("style");
	style.id = "svelte-1qzd0v1-style";
	style.textContent = ".height20.svelte-1qzd0v1{height:20px !important}.width125.svelte-1qzd0v1{width:125px}.width80.svelte-1qzd0v1{width:80px}.min_wid_95.svelte-1qzd0v1{min-width:95px}.width_max_content.svelte-1qzd0v1{width:max-content}.font17.svelte-1qzd0v1{font-size:15px!important}.custom_checkbox_new.svelte-1qzd0v1{display:block;position:relative;width:20px;height:20px;margin-bottom:0;cursor:pointer;font-size:18px}.width27.svelte-1qzd0v1{width:27px}.height27.svelte-1qzd0v1{height:27px !important}.width65.svelte-1qzd0v1{width:65px}td.svelte-1qzd0v1{text-align:center}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdEF1dGhvcmluZy5zdmVsdGUiLCJzb3VyY2VzIjpbIkxpc3RBdXRob3Jpbmcuc3ZlbHRlIl0sInNvdXJjZXNDb250ZW50IjpbIjxzY3JpcHQ+XG4gICAgaW1wb3J0IGwgZnJvbSAnLi4vc3JjL2xpYnMvZWRpdG9yTGliL2xhbmd1YWdlLmpzJztcbiAgICBpbXBvcnQge3dyaXRhYmxlfSBmcm9tICdzdmVsdGUvc3RvcmUnO1xuICAgIGltcG9ydCB7IG9uTW91bnQsYmVmb3JlVXBkYXRlLGFmdGVyVXBkYXRlIH0gZnJvbSBcInN2ZWx0ZVwiO1xuICAgIGltcG9ydCB7QUgsWE1MVG9KU09OLEpTT05Ub1hNTH0gZnJvbSBcIi4uL2hlbHBlci9IZWxwZXJBSS5zdmVsdGVcIjtcbiAgICBpbXBvcnQgZGF0YV9wYXJzZXIgZnJvbSAnLi9wYXBhcGFyc2UubWluJztcbiAgICBpbXBvcnQgeyBCdXR0b24sIERpYWxvZywgQ2hlY2tib3ggfSBmcm9tICdzdmVsdGUtbXVpL3NyYyc7XG4gICAgXG5cbiAgICBsZXQgc3RhdGUgPSB7fTtcbiAgICBsZXQgdGVtcF9hcnJheSA9IFtdO1xuICAgIGxldCBmaWxlX25hbWU7XG4gICAgbGV0IGNoaWxkX2dlbmVyYXRlZDtcbiAgICBsZXQgcm93X25vO1xuICAgIGxldCBvYmplY3RfZGF0YTtcbiAgICBsZXQgY291bnQgPSB0cnVlOztcblxuICAgIFxuXG5cbiAgICBleHBvcnQgbGV0IHhtbDtcbiAgIC8vIGV4cG9ydCBsZXQgZ3VpZDtcbiAgICBleHBvcnQgbGV0IGdldENoaWxkWG1sO1xuICAgIGV4cG9ydCBsZXQgZWRpdG9yU3RhdGU7XG5cbiAgICBcbiAgICAvL2FsZXJ0KGVkaXRvclN0YXRlLnhtbCk7XG4gICAgLy8vLy8vLy8vLy8vLy8vLyBEZXNjcmliZWQgc3RhdGVzLy8vLy8vLy8vLy8vXG5cbiAgICBsZXQgc3RhdGVEYXRhID0gd3JpdGFibGUoe1xuICAgICAgICB4bWwgICAgICAgICAgICAgICAgICAgICAgICAgOiAnJyxcbiAgICAgICAgaGFuZGxlX2Rpc2FibGVfc2hvdyAgICAgICAgIDogdHJ1ZSxcbiAgICAgICAgc2VsZWN0ZWRfbGVuZ3RoICAgICAgICAgICAgIDogMCxcbiAgICAgICAgZWRpdG9yTW9kYWxIYW5kbGUgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgIGNvdW50ZXIgICAgICAgICAgICAgICAgICAgICA6IDAsXG4gICAgICAgIEVkaXRvck1vZGFsQm94ICAgICAgICAgICAgICA6IGZhbHNlXG4gICAgfSlcblxuICAgIGxldCBtb2RhbCA9IHtcblx0XHRcdGhlYWRlcjogW10sXG5cdFx0XHRib2R5OiBbXSxcblx0XHRcdGZvb3RlcjogW10sXG5cdFx0XHRtYXhXaWR0aDogJ3NtJyxcbiAgICB9O1xuICAgICAgICBcbiAgICBjb25zdCB1bnN1YnNjcmliZSA9IHN0YXRlRGF0YS5zdWJzY3JpYmUoKGl0ZW1zKT0+e1xuICAgICAgICBzdGF0ZSA9IGl0ZW1zO1xuICAgIH0pXG5cbiAgICBcblxuICAgIG9uTW91bnQoKCk9PntcbiAgICAgICAgLy8gdXNlZCB0byBzaG93IHRoZSB0b29sdGlwXG4gICAgICAgIC8vIGpRdWVyeSgnI2F1dGhvcmluZ19jb250YWluZXInKS50b29sdGlwKHtcbiAgICAgICAgLy8gICAgIHNlbGVjdG9yOiAnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXSdcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIGpRdWVyeShkb2N1bWVudCkub24oJ2NoYW5nZScsICcuY2hlY2thbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIGpRdWVyeSgnLnNlbGVjdF9lZGl0YWJsZV9ndWlkJykucHJvcCgnY2hlY2tlZCcsIGpRdWVyeSh0aGlzKS5wcm9wKCdjaGVja2VkJykpO1xuICAgICAgICAvLyB9KTtcbiAgICAgICAgQUgubGlzdGVuKGRvY3VtZW50LCdjaGFuZ2UnLCcuY2hlY2thbGwnLCgoX3RoaXMpPT57XG4gICAgICAgICAgICBBSC5zZWxlY3RBbGwoJy5zZWxlY3RfZWRpdGFibGVfZ3VpZCcse2NoZWNrZWQ6X3RoaXMuZ2V0QXR0cmlidXRlKFwiY2hlY2tlZFwiKX0pO1xuICAgICAgICB9KSlcbiAgICAgICAgLy8galF1ZXJ5KGRvY3VtZW50KS5vbignY2hhbmdlJywgJy5jaGVja2FsbCwgLnNlbGVjdF9lZGl0YWJsZV9ndWlkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICB2YXIgc2VsZWN0ZWRfbGVuZ3RoID0galF1ZXJ5KCcuc2VsZWN0X2VkaXRhYmxlX2d1aWQ6Y2hlY2tlZCcpLmxlbmd0aDtcbiAgICAgICAgLy8gICAgIGlmIChzZWxlY3RlZF9sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgIC8vICAgICAgICAgc3RhdGUuaGFuZGxlX2Rpc2FibGVfc2hvdyA9IGZhbHNlO1xuICAgICAgICAvLyAgICAgICAgIHN0YXRlLnNlbGVjdGVkX2xlbmd0aCA9IHNlbGVjdGVkX2xlbmd0aDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIHN0YXRlLmhhbmRsZV9kaXNhYmxlX3Nob3cgPSB0cnVlO1xuICAgICAgICAvLyAgICAgICAgICAgICBzdGF0ZS5zZWxlY3RlZF9sZW5ndGggPSAwO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9KTtcbiAgICAgICAgQUgubGlzdGVuKGRvY3VtZW50LCdjaGFuZ2UnLCcuY2hlY2thbGwsIC5zZWxlY3RfZWRpdGFibGVfZ3VpZCcsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0ZWRfbGVuZ3RoID0gQUguc2VsZWN0KCcuc2VsZWN0X2VkaXRhYmxlX2d1aWQnLCdjaGVja2VkJykubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHNlbGVjdGVkX2xlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzdGF0ZS5oYW5kbGVfZGlzYWJsZV9zaG93ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc3RhdGUuc2VsZWN0ZWRfbGVuZ3RoID0gc2VsZWN0ZWRfbGVuZ3RoO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdGUuaGFuZGxlX2Rpc2FibGVfc2hvdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHN0YXRlLnNlbGVjdGVkX2xlbmd0aCA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfSlcblxuICAgIGFmdGVyVXBkYXRlKCgpPT57XG4gICAgICAgIGlmICh4bWwgIT0gc3RhdGUueG1sKSB7XG4gICAgICAgICAgICBzdGF0ZS54bWwgPSB4bWw7XG4gICAgICAgICAgICBsb2FkTW9kdWxlKHhtbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVkaXRvclN0YXRlLmd1aWQgJiYgc3RhdGUuZGF0YV9jZGF0YSAmJiBzdGF0ZS5kYXRhX2NkYXRhWzBdLnBnID09ICcnKSB7XG4gICAgICAgICAgICBzZXRQYXJlbnRHdWlkKGVkaXRvclN0YXRlLmd1aWQpO1xuICAgICAgICB9XG4gICAgfSlcblxuICAgICAvLyBsb2FkcyB0aGUgbW9kdWxlXG4gICAgZnVuY3Rpb24gbG9hZE1vZHVsZSh4bWwpIHtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGpzb24gZGF0YSBvZiB4bWxcbiAgICAgICAgbGV0IG5ld1hNTCA9IFhNTFRvSlNPTih4bWwpO1xuICAgICAgICAvLyB1c2VkIGZvciBwYXJzZSB0aGUgeG1sIGFuZCB1cGRhdGVzIHRoZSB4bWxcbiAgICAgICAgcGFyc2VYTUxBdXRob3JpbmcobmV3WE1MKTtcbiAgICB9XG5cbiAgICAvLyBwYXJzZXMgdGhlIHhtbCBkYXRhIGFuZCB1cGRhdGUgdGhlIHhtbFxuICAgIGZ1bmN0aW9uIHBhcnNlWE1MQXV0aG9yaW5nKE1ZWE1MKSB7XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgaWYoY291bnQpIHtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSBpbmZvcm1hdGlvbiBvZiBlYWNoIHJvd3MgaW4gdGhlIGZvcm0gb2YganNvbiBcbiAgICAgICAgICAgICAgICB0ZW1wX2FycmF5ID0gSlNPTi5wYXJzZShNWVhNTC5zbXhtbC5fX2NkYXRhKS5saXN0O1xuICAgICAgICAgICAgICAgIGNvdW50ID1mYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YXRlLmRhdGFfY2RhdGEgPSB0ZW1wX2FycmF5O1xuICAgICAgICAgICAgc3RhdGUueG1sID0gTVlYTUw7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHsgJ2Vycm9yJzogZXJyb3IgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgICAvLyB1c2VkIGZvciBpbXBvcnQgdGhlIGNzdiBmaWxlXG4gICAgZnVuY3Rpb24gaGFuZGxlSW1wb3J0KCkge1xuICAgICAgICAvLyBvcGVucyB0aGUgZmlsZSBzZWxlY3QgZGlhbG9nIGJveCBmb3IgaW1wb3J0IHRoZSBjc3ZcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZpbGVVcGxvYWQnKS5jbGljaygpO1xuICAgIH1cblxuICAgIC8vIHVzZWQgZm9yIHVwZGF0ZSB0aGUgeG1sXG4gICAgZnVuY3Rpb24gdXBkYXRlWE1MKGNkYXRhX3ZhbHVlKSB7XG4gICAgICAgIC8vIHVwZGF0ZXMgdGhlIGNkYXRhIHZhbHVlIG9mIHhtbFxuICAgICAgICBzdGF0ZS54bWwuc214bWwuX19jZGF0YSA9IGNkYXRhX3ZhbHVlO1xuICAgICAgICAvLyB1cGRhdGVzIHRoZSB4bWxcbiAgICAgICAgZ2V0Q2hpbGRYbWwoSlNPTlRvWE1MKHN0YXRlLnhtbCkpOyBcbiAgICB9XG5cbiAgICAvL3VzZWQgZm9yIHVwZGF0ZSB0aGUgY29sdW1uKHMpIHZhbHVlIGluIHhtbFxuICAgIGZ1bmN0aW9uIGhhbmRsZUVkaXQoZXZlbnQpIHtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIGlkIG9mIHRoYXQgY29sdW1uIGluIHdoaWNoIGNoYW5nZXMgbWFkZVxuICAgICAgICBsZXQgdGFyZ2V0X2lkID0gZXZlbnQudGFyZ2V0LmlkO1xuICAgICAgICAvLyBmaW5kcyB0aGUgcm93IG5vIGluIHdoaWNoIGNoYW5nZXMgbWFkZVxuICAgICAgICByb3dfbm8gPSB0YXJnZXRfaWQuc3BsaXQoJ18nKVsxXTtcbiAgICAgICAgLy8gZmluZHMgdGhlIGNvbHVtbiBubyBpbiB3aGljaCBjaGFuZ2VzIG1hZGVcbiAgICAgICAgbGV0IGNvbF9ubyA9IHRhcmdldF9pZC5zcGxpdCgnXycpWzJdO1xuICAgICAgICAvLyBjb250YWlucyBwcmV2aW91cyBjb2x1bW4gdmFsdWVcbiAgICAgICAgbGV0IHByZXZpb3VzX2RhdGE7XG4gICAgICAgIC8vIHVwZGF0ZXMgdGhlIHJlc3BlY3RpdmUgY29sdW1uIHZhbHVlIGFjY29yZGluZyB0byBjaGFuZ2UgaW4gY29sdW1uIHZhbHVlXG4gICAgICAgICgoY29sX25vID09IDApID8gKHByZXZpb3VzX2RhdGEgPSBzdGF0ZS5kYXRhX2NkYXRhW3Jvd19ub10uYzEsIHN0YXRlLmRhdGFfY2RhdGFbcm93X25vXS5jMSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGFyZ2V0X2lkKS5pbm5lclRleHQpIDogKHByZXZpb3VzX2RhdGEgPSBzdGF0ZS5kYXRhX2NkYXRhW3Jvd19ub10uYzIsIHN0YXRlLmRhdGFfY2RhdGFbcm93X25vXS5jMiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyMnICsgdGFyZ2V0X2lkKS5pbm5lclRleHQpKTtcbiAgICAgICAgLy8gdXBkYXRlcyB0aGUgeG1sXG4gICAgICAgIHVwZGF0ZVhNTChKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiBzdGF0ZS5kYXRhX2NkYXRhIH0pKTtcbiAgICAgICAgaWYgKHN0YXRlLmRhdGFfY2RhdGFbcm93X25vXS5jZyAmJiAoKGNvbF9ubyA9PSAwKSA/IChwcmV2aW91c19kYXRhICE9IHN0YXRlLmRhdGFfY2RhdGFbcm93X25vXS5jMSk6IChwcmV2aW91c19kYXRhICE9IHN0YXRlLmRhdGFfY2RhdGFbcm93X25vXS5jMikpKSB7XG4gICAgICAgICAgICAvLyBtb2RhbCA9IHtcbiAgICAgICAgICAgIC8vICAgICBoZWFkZXI6IHtcbiAgICAgICAgICAgIC8vICAgICAgICAgYm9keTogKDxkaXY+e2wuc2F2ZV9oZWFkZXJ9PC9kaXY+KSxcbiAgICAgICAgICAgIC8vICAgICAgICAgY2xhc3M6IFwiZWRpdG9yX21vZGFsX3RpdGxlXCJcbiAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgLy8gICAgIGJvZHk6IHtcbiAgICAgICAgICAgIC8vICAgICBib2R5OiAoPGRpdj57bC5jaGlsZF91cGRhdGV9PC9kaXY+KSxcbiAgICAgICAgICAgIC8vICAgICAgICAgY2xhc3M6IFwiZWRpdG9yX21vZGFsX2NvbnRlbnRcIixcbiAgICAgICAgICAgIC8vICAgICAgICAgc3R5bGU6IHtoZWlnaHQ6ICdhdXRvJ31cbiAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgLy8gICAgIGZvb3Rlcjoge1xuICAgICAgICAgICAgLy8gICAgICAgICBib2R5OiBbe2xhYmVsOiAnT0snLCBjbGFzczogXCJiZy1wcmltYXJ5IHRleHQtd2hpdGVcIiwgb25BY3Rpb246ICgpPT4gc2VsZi5oYW5kbGVVcGRhdGUocm93X25vKX1dLFxuICAgICAgICAgICAgLy8gICAgICAgICBjbGFzczogXCJlZGl0b3JfbW9kYWxfYWN0aW9uXCJcbiAgICAgICAgICAgIC8vICAgICB9LFxuICAgICAgICAgICAgLy8gICAgIG1heFdpZHRoOiAnc20nLFxuICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgIHN0YXRlLkVkaXRvck1vZGFsQm94ID0gdHJ1ZTtcbiAgICAgICAgICAgIGVkaXRvck1vZGFsVXBkYXRlKHRydWUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gdXNlZCBmb3IgdXBkYXRlIHRoZSBndWlkcyB3aGljaCBleGlzdCBpbiBcIkN1cnJlbnQgR3VpZFwiIGFuZCBcIlVzZWQgaW4gR3VpZHNcIiBmaWVsZCBvZiByZXNwZWN0aXZlIHJvd1xuICAgIGZ1bmN0aW9uIGhhbmRsZVVwZGF0ZShyb3dObykge1xuICAgICAgICBlZGl0b3JNb2RhbFVwZGF0ZShmYWxzZSk7XG4gICAgICAgIHVwZGF0ZU9sZEd1aWRzT3B0aW9uKHJvd05vLCBzdGF0ZS5kYXRhX2NkYXRhW3Jvd05vXS5jZywgc3RhdGUuZGF0YV9jZGF0YVtyb3dOb10ucGcsIHN0YXRlLmRhdGFfY2RhdGFbcm93Tm9dLnJuLCBzdGF0ZS5kYXRhX2NkYXRhW3Jvd05vXS5hZyk7XG4gICAgfVxuXG5cbiAgICAvLyBnZW5lcmF0ZXMgdGhlIGd1aWQgZm9yIGVhY2ggcm93c1xuICAgIGZ1bmN0aW9uIGdlbmVyYXRlSXRlbXMocGFyZW50X2d1aWQsIGN1cnJlbnRfcm93X3ZhbCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgLy8gc3RvcmVzIHRoZSByYW5kb20gcm93IG5vXG4gICAgICAgICAgICAgICAgbGV0IHJhbmRvbV9yb3dzID0gW10sIHJhbmRvbVJvd05vO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGluZGV4X25vID0gMDsgaW5kZXhfbm8gPCAzOyBpbmRleF9ubyArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSByYW5kb20gcm93IG5vIHJldHVybmVkIGJ5IHRoZSBtZXRob2QgXCJmaW5kUmFuZG9tUm93Tm9cIlxuICAgICAgICAgICAgICAgICAgICByYW5kb21Sb3dObyA9IGZpbmRSYW5kb21Sb3dObyhjdXJyZW50X3Jvd192YWwsIHJhbmRvbV9yb3dzKTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKCFyYW5kb21Sb3dObykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsbHMgdGhlIG1ldGhvZCBcImZpbmRSYW5kb21Sb3dOb1wiIHRpbGwgaXQgZG9lcyBub3QgZ2V0IHRoZSByb3cgbm9cbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbVJvd05vID0gZmluZFJhbmRvbVJvd05vKGN1cnJlbnRfcm93X3ZhbCwgcmFuZG9tX3Jvd3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChyYW5kb21Sb3dObykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gcHVzaGVzIHRoZSByb3cgbm8gcmVjZWl2ZWQgcmFuZG9tbHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmRvbV9yb3dzLnB1c2gocmFuZG9tUm93Tm8pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBhbGdvX3htbF9kYXRhID0gQUguZ2V0KCdhbGdvX3Zhcl9kYXRhJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgYWxnb194bWxfZGF0YSA9IGFsZ29feG1sX2RhdGEgJiYgYWxnb194bWxfZGF0YS5yZXBsYWNlKC9cIi9nbSwgXCJcXFwiXCIpO1xuICAgICAgICAgICAgICAgIC8vIGNyZWF0ZXMgdGhlIG9iamVjdCB0aGF0IGhhcyB0byBiZSBzZW5kIGZvciBnZW5lcmF0ZSB0aGUgZ3VpZCBvbiBzZXJ2ZXIgc2lkZVxuICAgICAgICAgICAgICAgIGxldCBxdWVzdGlvbl9vYmogPSB7IFwicXVlc3Rpb25cIjogXCJcIiwgXCJhbnN3ZXJzXCI6IFtdLCBcImNvcnJlY3RfYW5zX3N0clwiOiBcIkFcIiwgXCJ0b3RhbF9hbnN3ZXJzXCI6IDQsIFwiY29ycmVjdF9hbnN3ZXJzXCI6IDEsIFwidGl0bGVcIjogXCJcIiwgXCJwYXJlbnRfZ3VpZFwiOiBwYXJlbnRfZ3VpZCwgXCJleHBsYW5hdGlvblwiOiBcIkFuc3dlciA8c2VxIG5vPVxcXCJhXFxcIj48L3NlcT4gaXMgY29ycmVjdC5cIiwgXCJhbGdvX3F4bWxcIjogYWxnb194bWxfZGF0YX07XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGUgY29ycmVjdCBhbnN3ZXIgdmFsdWUgaW4gYXJyYXkga2V5IGFuc3dlcnMgb2Ygb2JqZWN0IHF1ZXN0aW9uX29ialxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uX29iai5hbnN3ZXJzLnB1c2goeyBcImlzX2NvcnJlY3RcIjogXCIxXCIsIFwiYW5zd2VyXCI6IHN0YXRlLmRhdGFfY2RhdGFbY3VycmVudF9yb3dfdmFsXS5jMiwgXCJpZFwiOiBcIjAxXCIgfSk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8xID0gMDsgaW5kZXhfbm8xIDwgMzsgaW5kZXhfbm8xICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGUgb3RoZXIgb3B0aW9ucyB2YWx1ZSBpbiBhcnJheSBrZXkgYW5zd2VycyBvZiBvYmplY3QgcXVlc3Rpb25fb2JqXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uX29iai5hbnN3ZXJzLnB1c2goeyBcImlzX2NvcnJlY3RcIjogXCIwXCIsIFwiYW5zd2VyXCI6IHN0YXRlLmRhdGFfY2RhdGFbcmFuZG9tX3Jvd3NbaW5kZXhfbm8xXV0uYzIsIFwiaWRcIjogXCIwXCIgKyAoaW5kZXhfbm8xICsgMikgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHNldHMgdGhlIHRpdGxlIGZvciBndWlkXG4gICAgICAgICAgICAgICAgLy9xdWVzdGlvbl9vYmoudGl0bGUgPSAkKCcjdGl0bGUnKS5odG1sKCkgKyAnOiAnICsgc3RhdGUuZGF0YV9jZGF0YVtjdXJyZW50X3Jvd192YWxdLmMxO1xuICAgICAgICAgICAgICAgIHF1ZXN0aW9uX29iai50aXRsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyN0aXRsZScpLmlubmVySFRNTCArICc6ICcgKyBzdGF0ZS5kYXRhX2NkYXRhW2N1cnJlbnRfcm93X3ZhbF0uYzE7XG4gICAgICAgICAgICAgICAgLy8gc2V0cyB0aGUgcXVlc3Rpb24gZGF0YSBmb3IgZ3VpZFxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uX29iai5xdWVzdGlvbiA9IHN0YXRlLmRhdGFfY2RhdGFbY3VycmVudF9yb3dfdmFsXS5jMTtcbiAgICAgICAgICAgICAgICAvLyByZXF1ZXN0IGZvciBnZXQgdGhlIGd1aWRcbiAgICAgICAgICAgICAgICAvLyBBSC5hamF4KHtcbiAgICAgICAgICAgICAgICAvLyAgICAgLy9hamF4OiBcIjFcIixcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gICAgIHVybDogYmFzZVVybCArICdlZGl0b3IvaW5kZXgucGhwJywgLy8gZGVub3RlcyBmaWxlIHdoZXJlIGFqYXggcmVxdWVzdCB3aWxsIGJlIGhhbmRsZSBieSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAvLyAgICAvLyBjYWNoZTogZmFsc2UsIC8vIGRvZXMgbm90IHN0b3JlcyByZXF1ZXN0IGRhdGEgaW4gY2FjaGUgbWVtb3J5XG4gICAgICAgICAgICAgICAgLy8gICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHN0cl9jb250ZW50OiBxdWVzdGlvbl9vYmosIC8vIG9iamVjdCBkYXRhIHdoaWNoIG5lZWRzIHRvIGJlIHVzZWQgZm9yIGNyZWF0ZSB0aGUgbmV3IGd1aWRcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGZ1bmM6IFwiZ2V0X2d1aWRfZnJvbV9hcGlcIiwgLy8gY29uZGl0aW9uIGluIHdoaWNoIGJsb2NrIGFqYXggcmVxdWVzdCB3aWxsIGJlIHJlY2VpdmVkIGFuZCByZXNwb25zZSB3aWxsIGJlIHNlbmQgZnJvbSBzZXJ2ZXJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIC8vc25pcHBldDogJCgnI3RpdGxlJykuaHRtbCgpICsgJzogJyArIHNlbGYuc3RhdGUuZGF0YV9jZGF0YVtjdXJyZW50X3Jvd192YWxdLmMxXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzbmlwcGV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGl0bGUnKS5pbm5lckhUTUwgKyAnOiAnICsgc3RhdGUuZGF0YV9jZGF0YVtjdXJyZW50X3Jvd192YWxdLmMxXG4gICAgICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6IFwicG9zdFwiLCAvLyB1c2VkIGZvciBzZWN1cml0eSBwdXJwb3NlXG4gICAgICAgICAgICAgICAgLy8gICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gY29udGFpbnMgdGhlIHJlc3BvbnNlIGluIG9iamVjdCBmb3JtXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB2YXIganNvbl9yZWNlaXZlZF9zdHJpbmcgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmIChqc29uX3JlY2VpdmVkX3N0cmluZyAmJiBqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAvLyBzdG9yZXMgdGhlIGdlbmVyYXRlZCBndWlkIGluIGN1cnJlbnRfZ3VpZCBrZXkgb2YgcmVzcGVjdGl2ZSByb3dcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB0ZW1wX2FycmF5W2N1cnJlbnRfcm93X3ZhbF0uY2cgPSBqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQ7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgZm9yICh2YXIgaW5kZXhfbm8xID0gMDsgaW5kZXhfbm8xIDwgMzsgaW5kZXhfbm8xICs9IDEpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy8gc3RvcmVzIHRoZSBnZW5lcmF0ZWQgZ3VpZCBpbiBhbGwgcm93cyBcInVzZWRfaW5fZ3VpZHNcIiBrZXkgd2l0aCB0aGUgaGVscCBvZiB3aGljaCBjdXJyZW50IGd1aWQgaXMgZ2VuZXJhdGVkXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRlbXBfYXJyYXlbcmFuZG9tX3Jvd3NbaW5kZXhfbm8xXV0uYWcucHVzaChqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpO1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyBzdG9yZXMgdGhlIHJvdyBubyB3aGljaCBhcmUgdXNlZCBmb3IgY3JlYXRlIHRoZSBnZW5lcmF0ZWQgZ3VpZFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0ZW1wX2FycmF5W2N1cnJlbnRfcm93X3ZhbF0ucm4ucHVzaChyYW5kb21fcm93c1tpbmRleF9ubzFdKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYgKGN1cnJlbnRfcm93X3ZhbCA9PSAoc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSB4bWwgd2l0aCBjcmVhdGVkIGd1aWRzXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHVwZGF0ZVhNTChKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiB0ZW1wX2FycmF5IH0pKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICByZXNvbHZlKGpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCk7XG4gICAgICAgICAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgICAgICAvLyB9KTtcbiAgICAgICAgICAgICAgICBBSC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogYmFzZVVybCArICdlZGl0b3IvaW5kZXgucGhwJyxcbiAgICAgICAgICAgICAgICAgICAgbG9uZ0RhdGE6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cl9jb250ZW50OiBKU09OLnN0cmluZ2lmeShxdWVzdGlvbl9vYmopLCBcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmM6IFwiZ2V0X2d1aWRfZnJvbV9hcGlcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICBzbmlwcGV0OiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGl0bGUnKS5pbm5lckhUTUwgKyAnOiAnICsgc3RhdGUuZGF0YV9jZGF0YVtjdXJyZW50X3Jvd192YWxdLmMxLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBvbkVuZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5hY3RpdmF0ZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSByZXNwb25zZSBpbiBvYmplY3QgZm9ybVxuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGpzb25fcmVjZWl2ZWRfc3RyaW5nID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChqc29uX3JlY2VpdmVkX3N0cmluZyAmJiBqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHN0b3JlcyB0aGUgZ2VuZXJhdGVkIGd1aWQgaW4gY3VycmVudF9ndWlkIGtleSBvZiByZXNwZWN0aXZlIHJvd1xuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcF9hcnJheVtjdXJyZW50X3Jvd192YWxdLmNnID0ganNvbl9yZWNlaXZlZF9zdHJpbmcuY29udGVudF9ndWlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8xID0gMDsgaW5kZXhfbm8xIDwgMzsgaW5kZXhfbm8xICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZXMgdGhlIGdlbmVyYXRlZCBndWlkIGluIGFsbCByb3dzIFwidXNlZF9pbl9ndWlkc1wiIGtleSB3aXRoIHRoZSBoZWxwIG9mIHdoaWNoIGN1cnJlbnQgZ3VpZCBpcyBnZW5lcmF0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wX2FycmF5W3JhbmRvbV9yb3dzW2luZGV4X25vMV1dLmFnLnB1c2goanNvbl9yZWNlaXZlZF9zdHJpbmcuY29udGVudF9ndWlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZXMgdGhlIHJvdyBubyB3aGljaCBhcmUgdXNlZCBmb3IgY3JlYXRlIHRoZSBnZW5lcmF0ZWQgZ3VpZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBfYXJyYXlbY3VycmVudF9yb3dfdmFsXS5ybi5wdXNoKHJhbmRvbV9yb3dzW2luZGV4X25vMV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRfcm93X3ZhbCA9PSAoc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIHhtbCB3aXRoIGNyZWF0ZWQgZ3VpZHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGVYTUwoSlNPTi5zdHJpbmdpZnkoeyBcImxpc3RcIjogdGVtcF9hcnJheSB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy91cGRhdGVYTUwoSlNPTi5zdHJpbmdpZnkoeyBcImxpc3RcIjogT2JqZWN0LmFzc2lnbih7fSx0ZW1wX2FycmF5KSB9KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoanNvbl9yZWNlaXZlZF9zdHJpbmcuY29udGVudF9ndWlkKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh7J2Vycm9yJzogZXJyb3J9KTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAgLy8gcmV0dXJucyB0aGUgcmFuZG9tIHJvdyBub1xuICAgIGZ1bmN0aW9uIGZpbmRSYW5kb21Sb3dObyhjdXJyZW50X3Jvd19ubywgcmFuZG9tX3Jvd3MpIHtcbiAgICAgICAgLy8gY29udGFpbnMgdGhlIHJhbmRvbSBub1xuICAgICAgICBsZXQgcmFuZG9tX3Jvd192YWx1ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aCAtIDEpKSArIDE7XG4gICAgICAgIGlmIChyYW5kb21fcm93X3ZhbHVlID09IGN1cnJlbnRfcm93X25vIHx8IHJhbmRvbV9yb3dzLmluZGV4T2YocmFuZG9tX3Jvd192YWx1ZSkgPiAtMSkge1xuICAgICAgICAgICAgLy8gcmV0dW5zIHRoZSBmYWxzZSBpZiBpdCBpcyBlcXVhbCB0byBjdXJyZW50IHJvdyBvciBhbHJlYWR5IHN0b3JlZCBpbiByYW5kb21fcm93cyBhcnJheVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gcmV0dW5zIHRoZSByYW5kb20gdmFsdWUgaWYgaXQgaXMgbm90IGVxdWFsIHRvIGN1cnJlbnQgcm93IGFuZCBuZWl0aGVyIHN0b3JlZCBpbiByYW5kb21fcm93cyBhcnJheVxuICAgICAgICAgICAgcmV0dXJuIHJhbmRvbV9yb3dfdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyB1c2VkIGZvciBkZWxldGUgdGhlIHJvd1xuICAgIGZ1bmN0aW9uIGhhbmRsZURlbGV0ZShpbmRleF9ubykge1xuICAgICAgICBjb25zb2xlLmxvZygnY2hlY2tpbmcnKTtcbiAgICAgICAgaWYgKHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoID49IDYpIHtcbiAgICAgICAgICAgIC8vIHJlbW92ZXMgdGhlIHJlc3BlY3RpdmUgcm93IGZyb20geG1sXG4gICAgICAgICAgICBzdGF0ZS5kYXRhX2NkYXRhLnNwbGljZShpbmRleF9ubywgMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBBSC5zaG93bXNnKGwubWluNF9yb3dzX2FsbG93ZWQsIDQwMDApO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc3RhdGUuZGF0YV9jZGF0YVsxXS5jZyB8fCBzdGF0ZS5kYXRhX2NkYXRhW3N0YXRlLmRhdGFfY2RhdGEubGVuZ3RoIC0gMV0uY2cpIHtcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIGRpc2FibGVkIHRoZSBHZW5lcmF0ZS9VcGRhdGUgSXRlbXMgYnV0dG9uXG4gICAgICAgICAgICBzdGF0ZS54bWwuc214bWwuX2Rpc2FibGVkX2dlbmVyYXRlID0gMTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHVzZWQgZm9yIGVuYWJsZWQgdGhlIEdlbmVyYXRlL1VwZGF0ZSBJdGVtcyBidXR0b25cbiAgICAgICAgICAgIHN0YXRlLnhtbC5zbXhtbC5fZGlzYWJsZWRfZ2VuZXJhdGUgPSAwO1xuICAgICAgICB9XG4gICAgICAgIC8vIHVwZGF0ZXMgdGhlIHhtbFxuICAgICAgICB1cGRhdGVYTUwoSlNPTi5zdHJpbmdpZnkoeyBcImxpc3RcIjogc3RhdGUuZGF0YV9jZGF0YSB9KSk7XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlcyB0aGUgZ3VpZHMgZGF0YVxuICAgIGZ1bmN0aW9uIGFqYXhSZXF1ZXN0Rm9yRGF0YVVwZGF0ZShyb3dObywgY3VycmVudF9ndWlkLCByb3dfbm9fYXJyYXksIHBhcmVudF9ndWlkLCBjbG9zZV9hY3RpdmF0b3IpIHtcbiAgICAgICAgLy8gb2JqZWN0IHRoYXQgaGFzIHRvIGJlIHNlbmQgb24gc2VydmVyIGZvciB1cGRhdGUgdGhlIGd1aWRcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGV0IGFsZ29feG1sX2RhdGExID0gQUguZ2V0KCdhbGdvX3Zhcl9kYXRhJyk7XG4gICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBhbGdvX3htbF9kYXRhMSA9IGFsZ29feG1sX2RhdGExICYmIGFsZ29feG1sX2RhdGExLnJlcGxhY2UoL1wiL2dtLCBcIlxcXCJcIik7XG4gICAgICAgICAgICAgICAgbGV0IHF1ZXN0aW9uX29iaiA9IHsgXCJxdWVzdGlvblwiOiBzdGF0ZS5kYXRhX2NkYXRhW3Jvd05vXS5jMSwgXCJhbnN3ZXJzXCI6IFtdLCBcImNvcnJlY3RfYW5zX3N0clwiOiBcIkFcIiwgXCJ0b3RhbF9hbnN3ZXJzXCI6IDQsIFwiY29ycmVjdF9hbnN3ZXJzXCI6IDEsIFwidGl0bGVcIjogc3RhdGUueG1sLnNteG1sLl9wdCArIFwiOiBcIiArIHN0YXRlLmRhdGFfY2RhdGFbcm93Tm9dLmMxLCBcInBhcmVudF9ndWlkXCI6IHBhcmVudF9ndWlkLCBcImV4cGxhbmF0aW9uXCI6IFwiQW5zd2VyIDxzZXEgbm89XFxcImFcXFwiPjwvc2VxPiBpcyBjb3JyZWN0LlwiLCBcImFsZ29fcXhtbFwiOiBhbGdvX3htbF9kYXRhMX07XG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGUgYW5zd2VycyBrZXkgZGF0YSBvZiBvYmplY3QgXCJxdWVzdGlvbl9vYmpcIlxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uX29iai5hbnN3ZXJzLnB1c2goeyBcImlzX2NvcnJlY3RcIjogXCIxXCIsIFwiYW5zd2VyXCI6IHN0YXRlLmRhdGFfY2RhdGFbcm93Tm9dLmMyLCBcImlkXCI6IFwiMDFcIiB9KTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpbmRleF9ubzEgPSAwOyBpbmRleF9ubzEgPCAzOyBpbmRleF9ubzEgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSBhbnN3ZXJzIGtleSBkYXRhIG9mIG9iamVjdCBcInF1ZXN0aW9uX29ialwiXG4gICAgICAgICAgICAgICAgICAgIHF1ZXN0aW9uX29iai5hbnN3ZXJzLnB1c2goeyBcImlzX2NvcnJlY3RcIjogXCIwXCIsIFwiYW5zd2VyXCI6IHN0YXRlLmRhdGFfY2RhdGFbcm93X25vX2FycmF5W2luZGV4X25vMV1dLmMyLCBcImlkXCI6IFwiMFwiICsgKGluZGV4X25vMSArIDIpIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBhamF4IHJlc3F1ZXN0IGZvciB1cGRhdGUgdGhlIGd1aWRcbiAgICAgICAgICAgICAgICAvLyBBSC5hamF4KHtcbiAgICAgICAgICAgICAgICAvLyAgICAgYWpheDogXCIxXCIsXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICAgICB1cmw6IGJhc2VVcmwgKyAnZWRpdG9yL2luZGV4LnBocCcsIC8vIGRlZmluZXMgd2hlcmUgYWpheCByZXF1ZXN0IHdpbGwgYmUgc2VuZFxuICAgICAgICAgICAgICAgIC8vICAgICBjYWNoZTogZmFsc2UsIC8vIGRvZXMgbm90IHN0b3JlcyBkYXRhIGluIGNhY2hlIG1lbW9yeVxuICAgICAgICAgICAgICAgIC8vICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBzdHJfY29udGVudDogcXVlc3Rpb25fb2JqLCAvLyBkYXRhIGluIHRoZSBmb3JtIG9mIG9iamVjdCBmb3IgdXBkYXRlIHRoZSBndWlkXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBmdW5jOiBcInVwZGF0ZV9ndWlkX2Zyb21fYXBpXCIsIC8vIGRlZmluZXMgdGhlIGNvbmRpZGl0b24gaW4gd2hpY2ggaXQgY2FuIGJlIGFjY2VzcyBvbiBzZXJ2ZXIgc2lkZVxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgY29udGVudF9ndWlkOiBjdXJyZW50X2d1aWQgLy8gc2VuZHMgdGhlIGd1aWQgdGhhdCBoYXMgdG8gYmUgdXBkYXRlXG4gICAgICAgICAgICAgICAgLy8gICAgIH0sXG4gICAgICAgICAgICAgICAgLy8gICAgIHR5cGU6IFwicG9zdFwiLCAvLyBzZW5kIHRoZSBkYXRhIHdpdGggZm9yIHNlY3VyaXR5XG4gICAgICAgICAgICAgICAgLy8gICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgLy8gY29udGFpbnMgdGhlIHJlc3BvbnNlIGluIG9iamVjdCBmb3JtXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB2YXIganNvbl9yZWNlaXZlZF9zdHJpbmcgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmIChqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQgJiYgKGNsb3NlX2FjdGl2YXRvciA9PSB0cnVlKSkge1xuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIC8vIGNsb3NlIHRoZSBhY3RpdmF0b3JcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBjb25zb2xlLmxvZygnYWpheFJlcXVlc3RGb3JEYXRhVXBkYXRlJyk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgQUguYWN0aXZhdGUoMCk7XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgLy8gc2hvd3MgdGhlIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIEFJICYmIEFJLnNob3dtc2cobC5jaGlsZF91cGRhdGVkLCA0MDAwKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIHJlc29sdmUoanNvbl9yZWNlaXZlZF9zdHJpbmcuY29udGVudF9ndWlkKTtcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgICAgIC8vIH0pO1xuXG4gICAgICAgICAgICAgICAgQUguYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IGJhc2VVcmwgKyAnZWRpdG9yL2luZGV4LnBocCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cl9jb250ZW50OiBxdWVzdGlvbl9vYmosIC8vIGRhdGEgaW4gdGhlIGZvcm0gb2Ygb2JqZWN0IGZvciB1cGRhdGUgdGhlIGd1aWRcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmM6IFwidXBkYXRlX2d1aWRfZnJvbV9hcGlcIiwgLy8gZGVmaW5lcyB0aGUgY29uZGlkaXRvbiBpbiB3aGljaCBpdCBjYW4gYmUgYWNjZXNzIG9uIHNlcnZlciBzaWRlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50X2d1aWQ6IGN1cnJlbnRfZ3VpZCAvLyBzZW5kcyB0aGUgZ3VpZCB0aGF0IGhhcyB0byBiZSB1cGRhdGVcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgQUguYWN0aXZhdGUoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgLy8gY29udGFpbnMgdGhlIHJlc3BvbnNlIGluIG9iamVjdCBmb3JtXG4gICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBqc29uX3JlY2VpdmVkX3N0cmluZyA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCAmJiAoY2xvc2VfYWN0aXZhdG9yID09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2xvc2UgdGhlIGFjdGl2YXRvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhamF4UmVxdWVzdEZvckRhdGFVcGRhdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBBSC5hY3RpdmF0ZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaG93cyB0aGUgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgQUkgJiYgQUguc2hvd21zZyhsLmNoaWxkX3VwZGF0ZWQsIDQwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSBjYXRjaChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHsnZXJyb3InOiBlcnJvcn0pO1xuICAgICAgICAgICAgICAgIHJlc29sdmUobnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZU9sZEd1aWRzT3B0aW9uKHJvd05vLCBjdXJyZW50X2d1aWQsIHBhcmVudF9ndWlkLCBjcmVhdGVkX3dpdGhfcm93cywgdXNlZF9pbikge1xuICAgICAgICAvLyBzaG93cyB0aGUgYWN0aXZhdG9yXG4gICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGVPbGRHdWlkc09wdGlvbiAxJyk7XG4gICAgICAgIEFILmFjdGl2YXRlKDIpO1xuICAgICAgICBmb3IgKGxldCBpbmRleF9ubyA9IDA7IGluZGV4X25vIDwgc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGg7IGluZGV4X25vICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChpbmRleF9ubyAhPSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHVzZWRfaW4uaW5kZXhPZihzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5jZykgPiAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGF0IHJvd3MgY3VycmVudF9ndWlkIHdoaWNoIGNvbnRhaW5zIGFyZ3VtZW50IGN1cnJlbnRfZ3VpZCBkYXRhIGluIHRoZWlyIFwidXNlZF9pbl9ndWlkc1wiIGFycmF5XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWNlaXZlZF9kYXRhID0gYXdhaXQgdXBkYXRlUmVsYXRlZEd1aWRzKGluZGV4X25vLCBzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5jZywgcGFyZW50X2d1aWQsIHN0YXRlLmRhdGFfY2RhdGFbaW5kZXhfbm9dLnJuLCBzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5hZyk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVjZWl2ZWRfZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwuY2hlY2tfbmV0X3VwZGF0ZV9pZHMsIDQwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3VwZGF0ZU9sZEd1aWRzT3B0aW9uIDInKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFILmFjdGl2YXRlKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4X25vID09IChzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgZ3VpZCBzdG9yZSBpbiBhcmd1bWVudCBjdXJyZW50X2d1aWRcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY2VpdmVkX2RhdGExID0gYXdhaXQgYWpheFJlcXVlc3RGb3JEYXRhVXBkYXRlKHJvd05vLCBjdXJyZW50X2d1aWQsIGNyZWF0ZWRfd2l0aF9yb3dzLCBwYXJlbnRfZ3VpZCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcmVjZWl2ZWRfZGF0YTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgQUguc2hvd21zZyhsLmNoZWNrX25ldF91cGRhdGVfaWRzLCA0MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd1cGRhdGVPbGRHdWlkc09wdGlvbiAzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5hY3RpdmF0ZSgwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyB1cGRhdGVzIHRoZSBwYXJlbnQgZ3VpZFxuICAgICAgICB1cGRhdGVQYXJlbnRHdWlkKCk7XG4gICAgfVxuXG4gICAgIC8vIHVwZGF0ZXMgdGhhdCByb3dzIGN1cnJlbnRfZ3VpZCB3aGljaCBjb250YWlucyBhcmd1bWVudCBjdXJyZW50X2d1aWQgZGF0YSBpbiB0aGVpciBcInVzZWRfaW5fZ3VpZHNcIiBhcnJheVxuICAgIGZ1bmN0aW9uIHVwZGF0ZVJlbGF0ZWRHdWlkcyhyb3dObywgY3VycmVudF9ndWlkLCBwYXJlbnRfZ3VpZCwgY3JlYXRlZF93aXRoX3Jvd3MpIHtcbiAgICAgICAgLy8gY2FsbGVkIGZvciB1cGRhdGUgdGhlIGd1aWRzIGRhdGFcbiAgICAgICAgcmV0dXJuIGFqYXhSZXF1ZXN0Rm9yRGF0YVVwZGF0ZShyb3dObywgY3VycmVudF9ndWlkLCBjcmVhdGVkX3dpdGhfcm93cywgcGFyZW50X2d1aWQsIGZhbHNlKTtcbiAgICB9XG5cbiAgICAvLyB1c2VkIGZvciBzZXQgdGhlIHBhcmVudCBndWlkIGluIGVhY2ggcm93cyB4bWwgYW5kIHVwZGF0ZXMgdGhlIHhtbFxuICAgIGZ1bmN0aW9uIHNldFBhcmVudEd1aWQoZ3VpZF9kYXRhKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiZ3VpZF9kYXRhIFwiK2d1aWRfZGF0YSk7XG4gICAgICAgIC8vIHVzZWQgZm9yIGRlZmluZWQgdGhlIHRpdGxlIG9mIGNoaWxkIGl0ZW1zXG4gICAgICAgIC8vIHN0YXRlLnhtbC5zbXhtbC5fcHQgPSAkKCcjdGl0bGUnKS5odG1sKCk7XG4gICAgICAgIHN0YXRlLnhtbC5zbXhtbC5fcHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjdGl0bGUnKS5pbm5lckhUTUw7XG4gICAgICAgIC8vIHVzZWQgZm9yIGVuYWJsZWQgdGhlIEdlbmVyYXRlL1VwZGF0ZSBJdGVtcyBidXR0b25cbiAgICAgICAgc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9IDA7XG4gICAgICAgIC8vIHNldHMgdGhlIHBhcmVudCBndWlkIGZvciBlYWNoIHJvd1xuXG4gICAgICAgIGZvciAobGV0IGtleSBpbiBzdGF0ZS5kYXRhX2NkYXRhKSB7XG4gICAgICAgICAgICBzdGF0ZS5kYXRhX2NkYXRhW2tleV0ucGcgPSBndWlkX2RhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyh7J2NkYXRhICc6c3RhdGUuZGF0YV9jZGF0YX0pO1xuICAgICAgICAvL3VwZGF0ZXMgdGhlIHhtbFxuICAgICAgICB1cGRhdGVYTUwoSlNPTi5zdHJpbmdpZnkoeyBcImxpc3RcIjogc3RhdGUuZGF0YV9jZGF0YSB9KSk7XG4gICAgfVxuXG4gICAgLy8gdXNlcmQgZm9yIHZhbGlkYXRpb24gcHVycG9zZSBiZWZvcmUgZ2VuZXJhdGUgdGhlIGl0ZW1zXG4gICAgZnVuY3Rpb24gZ2VuZXJhdGVRdWVzdGlvbnMoKSB7XG4gICAgICAgIC8vIHVzZWQgZm9yIGdlbmVyYXRlIHRoZSBndWlkcyBmb3IgZWFjaCByb3dcbiAgICAgICAgaGFuZGxlR2VuZXJhdGVJdGVtcygpO1xuICAgIH1cblxuICAgICAvLyB1c2VkIGZvciBnZW5lcmF0ZSB0aGUgZ3VpZCBmb3IgZWFjaCByb3dzXG4gICAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlR2VuZXJhdGVJdGVtcygpIHtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKCdoYW5kbGUgZ2VuZXJhdGUnKTtcbiAgICAgICAgaWYgKChzdGF0ZS5kYXRhX2NkYXRhKS5sZW5ndGggPj0gNSkge1xuICAgICAgICAgICAgLy8gdXNlZCBmb3IgZGlzYWJsZWQgdGhlIEdlbmVyYXRlL1VwZGF0ZSBJdGVtcyBidXR0b25cbiAgICAgICAgICAgIHN0YXRlLnhtbC5zbXhtbC5fZGlzYWJsZWRfZ2VuZXJhdGUgPSAxO1xuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdXNlciBndWlkIGluIHhtbFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzdGF0ZS54bWwuc214bWwuX2ltcG9ydGVkX2J5ID0gdXNlcl9ndWlkO1xuICAgICAgICAgICAgLy8gc2V0cyB0aGUgdXBsb2FkZWQgY3N2IGZpbGUgbmFtZSBpbiB4bWxcbiAgICAgICAgICAgIHN0YXRlLnhtbC5zbXhtbC5fZmlsZSA9IGZpbGVfbmFtZTtcbiAgICAgICAgICAgIGxldCBkYXRlX29iaiA9IG5ldyBEYXRlKCk7XG4gICAgICAgICAgICAvLyBzZXRzIHRoZSBkYXRlIG9mIHVwbG9hZGVkIGNzdiBmaWxlIG5hbWUgaW4geG1sXG4gICAgICAgICAgICBzdGF0ZS54bWwuc214bWwuX2ltcG9ydGVkX29uID0gZGF0ZV9vYmoudG9EYXRlU3RyaW5nKCk7XG4gICAgICAgICAgICBsZXQgaXNfZmFpbGVkID0gZmFsc2U7XG4gICAgICAgICAgICAvLyBzaG93cyB0aGUgcHJvZ3Jlc3MgYmFyXG4gICAgICAgICAgICAvL2pRdWVyeSgnI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyJykucmVtb3ZlQ2xhc3MoJ2gnKTtcbiAgICAgICAgICAgIEFJLnNlbGVjdCgnI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyJywncmVtb3ZlQ2xhc3MnLCdoJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIG5vdCBhbGxvd2VkIHVzZXIgdG8gcGVyZm9ybSBhbnkgb3BlcmF0aW9uXG4gICAgICAgICAgICAvL2pRdWVyeSgnI2F1dGhvcmluZ19jb250YWluZXInKS5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKTtcbiAgICAgICAgICAgIEFILnNldENzcygnI2F1dGhvcmluZ19jb250YWluZXInLHtcbiAgICAgICAgICAgICAgICAncG9pbnRlci1ldmVudHMnOiAnbm9uZSdcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleF9ubyA9IDA7IGluZGV4X25vIDwgc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGg7IGluZGV4X25vICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXhfbm8gIT0gMCAmJiBzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5jZyA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBjYWxsZWQgZm9yIGdlbmVyYXRlIHRoZSBndWlkIGZvciBlYWNoIHJvd1xuICAgICAgICAgICAgICAgICAgICBsZXQgZ3VpZF9kYXRhID0gYXdhaXQgZ2VuZXJhdGVJdGVtcyhzdGF0ZS5kYXRhX2NkYXRhW2luZGV4X25vXS5wZywgaW5kZXhfbm8pO1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGd1aWRfZGF0YSA9PSAndW5kZWZpbmVkJyB8fCAhZ3VpZF9kYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpc19mYWlsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwuY2hlY2tfbmV0d29yaywgNDAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1c2VkIGZvciBlbmFibGVkIHRoZSBHZW5lcmF0ZS9VcGRhdGUgSXRlbXMgYnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZS54bWwuc214bWwuX2Rpc2FibGVkX2dlbmVyYXRlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGFsbG93cyB1c2VyIHRvIHBlcmZvcm0gdGhlIG9wZXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgLy9qUXVlcnkoJyNhdXRob3JpbmdfY29udGFpbmVyJykuY3NzKCdwb2ludGVyLWV2ZW50cycsICdhdXRvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5zZXRDc3MoJyNhdXRob3JpbmdfY29udGFpbmVyJyx7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3BvaW50ZXItZXZlbnRzJzogJ2F1dG8nXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaGlkZXMgdGhlIHByb2dyZXNzIGJhclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9qUXVlcnkoJyN3YXJuaW5nX2xhYmVsX2NvbnRhaW5lcicpLmFkZENsYXNzKCdoJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBBSC5zZWxlY3QoXCIjd2FybmluZ19sYWJlbF9jb250YWluZXJcIiwnYWRkQ2xhc3MnLCdoJylcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW5jcmVhc2VzIHRoZSBjb3VudGVyIGFjY29yZGluZyB0byB0aGUgZ2VuZXJhdGVkIGd1aWRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGUuY291bnRlciA9IHN0YXRlLmNvdW50ZXIgKyAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFpc19mYWlsZWQpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwuY2hpbGRfaXRlbXNfZ2VuZXJhdGVkLCA0MDAwKTtcbiAgICAgICAgICAgICAgICAvLyBhbGxvd3MgdXNlciB0byBwZXJmb3JtIHRoZSBvcGVyYXRpb25cbiAgICAgICAgICAgICAgICAvL2pRdWVyeSgnI2F1dGhvcmluZ19jb250YWluZXInKS5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ2F1dG8nKTtcbiAgICAgICAgICAgICAgICBBSC5zZXRDc3MoXCIjYXV0aG9yaW5nX2NvbnRhaW5lclwiLHtcbiAgICAgICAgICAgICAgICAgICAgJ3BvaW50ZXItZXZlbnRzJzonYXV0bydcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIHBhcmVudCBndWlkXG4gICAgICAgICAgICAgICAgdXBkYXRlUGFyZW50R3VpZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEFILnNob3dtc2cobC5taW40X21heDUwMF9hbGxvd2VkLCA0MDAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVzZWQgZm9yIHNob3cgYWxsIHRoZSBjaGlsZCBndWlkcyB3aGljaCBhcmUgc2VsZWN0ZWRcbiAgICBmdW5jdGlvbiBzaG93QWxsQ2hpbGQoKSB7XG4gICAgICAgIC8vIGFycmF5IGZvciBjb250YWluIHRoZSBjaGlsZCBndWlkIG9mIHNlbGVjdGVkIHJvd1xuICAgICAgICBsZXQgcm91dGVyR3VpZCA9IFtdO1xuICAgICAgICAvLyBqUXVlcnkoJy5zZWxlY3RfZWRpdGFibGVfZ3VpZDpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgIC8vIHB1c2hlcyB0aGUgY2hpbGQgZ3VpZFxuICAgICAgICAvLyAgICAgcm91dGVyR3VpZC5wdXNoKGpRdWVyeSh0aGlzKS5hdHRyKCd0YXJnZXQtZ3VpZCcpKTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIEFILnNlbGVjdCgnLnNlbGVjdF9lZGl0YWJsZV9ndWlkJywnY2hlY2tlZCcpLmZvckVhY2goKF90aGlzKT0+e1xuICAgICAgICAgICAgcm91dGVyR3VpZC5wdXNoKF90aGlzLmdldEF0dHJpYnV0ZSgndGFyZ2V0LWd1aWQnKSk7XG4gICAgICAgIH0pXG4gICAgICAgIC8vIHVybCBmb3Igc2hvdyB0aGUgc2VsZWN0ZWQgY2hpbGQgZ3VpZHNcbiAgICAgICBcbiAgICAgICAgbGV0IGZ1dHVyZVVybCA9IGJhc2VVcmwgKyAnZWRpdG9yL3YyLz9hY3Rpb249ZWRpdCZjb250ZW50X2d1aWQ9JyArIHJvdXRlckd1aWRbMF0gKyAnJm5vX2hlYWRlcj0xJnJlYWN0X2NvbnRlbnQ9MSZub19kb21haW49MSZyb3V0ZXJfZ3VpZD0nICsgcm91dGVyR3VpZC5qb2luKFwiLFwiKTtcbiAgICAgICAgLy8gb3BlbnMgdGhlIHVybCBpbiBuZXcgdGFiXG4gICAgICAgIHdpbmRvdy5vcGVuKGZ1dHVyZVVybCwgJ19ibGFuaycpO1xuICAgIH1cblxuICAgIC8vIHVzZWQgZm9yIGFkZCB0aGUgcm93c1xuICAgIGZ1bmN0aW9uIGFkZE9wdGlvbigpIHtcbiAgICAgICAgaWYgKChzdGF0ZS5kYXRhX2NkYXRhKS5sZW5ndGggPCA1MDEpIHtcbiAgICAgICAgICAgIC8vIGNvbnRhaW5zIHRoZSByb3cgZGF0YSBpbiBvYmplY3QgZm9ybVxuICAgICAgICAgICAgb2JqZWN0X2RhdGEgPSB7IFwiYzFcIjogXCJEYXRhXCIgKyBzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aCwgXCJjMlwiOiBcIk1lYW5pbmdcIiArIHN0YXRlLmRhdGFfY2RhdGEubGVuZ3RoLCBcInBnXCI6IHN0YXRlLmRhdGFfY2RhdGFbMF0ucGcsIFwiY2dcIjogXCJcIiwgXCJhZ1wiOiBbXSwgXCJyblwiOiBbXX07XG4gICAgICAgICAgICAvLyBwdXNoZXMgdGhlIGRhdGEgaW50byBkYXRhX2NkYXRhIGFycmF5XG4gICAgICAgICAgICBzdGF0ZS5kYXRhX2NkYXRhLnB1c2gob2JqZWN0X2RhdGEpO1xuICAgICAgICAgICAgaWYgKHN0YXRlLmRhdGFfY2RhdGFbMV0uY2cpIHtcbiAgICAgICAgICAgICAgICAvLyB1c2VkIGZvciBlbmFibGVkIHRoZSBHZW5lcmF0ZS9VcGRhdGUgSXRlbXMgYnV0dG9uXG4gICAgICAgICAgICAgICAgc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB1cGRhdGVzIHRoZSB4bWxcbiAgICAgICAgICAgIHVwZGF0ZVhNTChKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiBzdGF0ZS5kYXRhX2NkYXRhIH0pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNob3dzIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICBcbiAgICAgICAgICAgIEFILnNob3dtc2cobC5tYXg1MDBfcm93c19hbGxvd2VkLCA0MDAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVzZWQgZm9yIHVwbG9hZCBjc3YgZmlsZSBhbmQgdXBkYXRlIHRoZSB4bWxcbiAgICBmdW5jdGlvbiB1cGxvYWRDc3YoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBzZWxlY3RzIHRoZSBlbGVtZW50IGhhdmUgaWQgJ2ZpbGVVcGxvYWQnIFxuICAgICAgICAgICAgbGV0IGZpbGVVcGxvYWQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImZpbGVVcGxvYWRcIik7XG4gICAgICAgICAgICAvLyB1c2VkIGZvciBjaGVjayB0aGUgZmlsZSBleHRlbnRpb24gXG4gICAgICAgICAgICBsZXQgcmVnZXggPSAvXFwuY3N2JC87XG4gICAgICAgICAgICBmaWxlX25hbWUgPSBmaWxlVXBsb2FkLmZpbGVzWzBdLm5hbWU7XG4gICAgICAgICAgICBpZiAocmVnZXgudGVzdChmaWxlVXBsb2FkLnZhbHVlLnRvTG93ZXJDYXNlKCkpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiAoRmlsZVJlYWRlcikgIT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdGUuZGF0YV9jZGF0YVsxXS5jZyA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmV0dXJucyBhIG5ld2x5IGNvbnN0cnVjdGVkIEZpbGVSZWFkZXIuXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEEgaGFuZGxlciBmb3IgdGhlIE0gZXZlbnQuIFRoaXMgZXZlbnQgaXMgdHJpZ2dlcmVkIGVhY2ggdGltZSB0aGUgcmVhZGluZyBvcGVyYXRpb24gaXMgc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnZlcnRzIGNzdiBkYXRhIGludG8ganNvbiBzdHJpbmcgZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbXBvcnRlZENzdiA9IGNzdlRvSnNvbihldmVudC50YXJnZXQucmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW1wb3J0ZWRDc3YpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXBkYXRlcyB0aGUgeG1sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZVhNTChpbXBvcnRlZENzdik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBSCAmJiBBSC5zaG93bXNnKGwuZmlsZV91cGxvYWRlZCwgNDAwMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVVcGxvYWQudmFsdWUgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJlYWRlci5yZWFkQXNUZXh0KGZpbGVVcGxvYWQuZmlsZXNbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvd3MgdGhlIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgICAgIEFILnNob3dtc2cobC5odG1sNV9ub3Rfc3VwcG9ydGVkLCA0MDAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHNob3dzIHRoZSB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwudXBsb2FkX3ZhbGlkX2NzdiwgNDAwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh7ICdlcnJvcic6IGVycm9yIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICAvLyBjb252ZXJ0cyBjc3YgZGF0YSBpbnRvIGpzb24gc3RyaW5nIGRhdGFcbiAgICBmdW5jdGlvbiBjc3ZUb0pzb24oY3N2KSB7XG4gICAgICAgIC8vIGNvbnZlcnRzIGNzdiBmaWxlIGRhdGEgaW50byBBcnJheVxuICAgICAgICBsZXQgY3N2X2FycmF5ID0gZGF0YV9wYXJzZXIucGFyc2UoY3N2KS5kYXRhO1xuICAgICAgICAvLyBjb250YWlucyByb3dzIGRhdGEgd2hpY2ggaXMgbm90IGJsYW5rIFx0XG4gICAgICAgIGNzdl9hcnJheSA9IGNzdl9hcnJheS5maWx0ZXIoZnVuY3Rpb24oZGF0YSkgeyBcbiAgICAgICAgICAgIGxldCBzdWJfY3N2X2FycmF5ID0gZGF0YS5maWx0ZXIoZnVuY3Rpb24odmFsKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCAmJiB2YWwudHJpbSgpICE9IFwiXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzdWJfY3N2X2FycmF5Lmxlbmd0aCA+IDA7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBjb250YWlucyB0aGUgcm93XG4gICAgICAgIGxldCByb3dfZGF0YSA9IFtdO1xuICAgICAgICAvLyBvYmplY3QgZm9yIHVwZGF0ZSB0aGUgeG1sXG4gICAgICAgIGxldCBzdHJfZGF0YSA9IHt9O1xuICAgICAgICBpZiAoY3N2X2FycmF5Lmxlbmd0aCA8PSA1MDEgJiYgY3N2X2FycmF5Lmxlbmd0aCA+PSA1KSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpbmRleF9ubyA9IDA7IGluZGV4X25vIDwgY3N2X2FycmF5Lmxlbmd0aDsgaW5kZXhfbm8gKz0gMSkge1xuICAgICAgICAgICAgICAgIGlmIChjc3ZfYXJyYXlbaW5kZXhfbm9dICYmIGNzdl9hcnJheVtpbmRleF9ub10ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb250YWlucyB0aGUgY29sdW1uIGRhdGEgaW4gdGhlIGZvcm0gb2YgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbHVtbl9kYXRhID0gY3N2X2FycmF5W2luZGV4X25vXTtcbiAgICAgICAgICAgICAgICAgICAgLy8gb2JqZWN0IGZvciB1cGRhdGUgdGhlIHhtbFxuICAgICAgICAgICAgICAgICAgICBzdHJfZGF0YSA9IHsgXCJjMVwiOiBcIlwiLCBcImMyXCI6IFwiXCIsIFwicGdcIjogc3RhdGUuZGF0YV9jZGF0YVswXS5wZywgXCJjZ1wiOiBcIlwiLCBcImFnXCI6IFtdLCBcInJuXCI6IFtdfTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaW5kZXhfbm8xID0gMDsgaW5kZXhfbm8xIDwgY29sdW1uX2RhdGEubGVuZ3RoOyBpbmRleF9ubzEgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNvbHVtbl9kYXRhLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGNvbHVtbl9kYXRhW2luZGV4X25vMV0gJiYgY29sdW1uX2RhdGFbaW5kZXhfbm8xXS50cmltKCkgIT0gXCJcIikgJiYgKGluZGV4X25vMSA9PSAwIHx8IGluZGV4X25vMSA9PSAxKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXhfbm8xID09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIGZpcnN0IGNvbHVtbiB2YWx1ZSBpbiB4bWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cl9kYXRhLmMxID0gY29sdW1uX2RhdGFbaW5kZXhfbm8xXS5yZXBsYWNlKC8nL2dtLCAnXFwnJykucmVwbGFjZSgvXCIvZ20sIFwiXFxcIlwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZXMgdGhlIHNlY29uZCBjb2x1bW4gdmFsdWUgaW4geG1sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJfZGF0YS5jMiA9IGNvbHVtbl9kYXRhW2luZGV4X25vMV0ucmVwbGFjZSgvJy9nbSwgJ1xcJycpLnJlcGxhY2UoL1wiL2dtLCBcIlxcXCJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGNvbHVtbl9kYXRhW2luZGV4X25vMV0gJiYgY29sdW1uX2RhdGFbaW5kZXhfbm8xXS50cmltKCkgIT0gXCJcIikgJiYgaW5kZXhfbm8xID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFILnNob3dtc2cobC5leGFjdDJfY29sdW1uX2FsbG93ZWQsIDQwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGluZGV4X25vMSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQUguc2hvd21zZyhsLmJsYW5rX2NvbHVtbl9ub3RhbGxvd2VkLCA0MDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNob3dzIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFILnNob3dtc2cobC5leGFjdDJfY29sdW1uX2FsbG93ZWQsIDQwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBzdG9yZXMgZWFjaCByb3dzIGRhdGEgaW4gb2JqZWN0IGZvcm1cbiAgICAgICAgICAgICAgICAgICAgcm93X2RhdGEucHVzaChzdHJfZGF0YSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc2hvd3Mgd2FybmluZyBtZXNzYWdlXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBBSC5zaG93bXNnKGwuYmxhbmtfY29sdW1uX25vdGFsbG93ZWQsIDQwMDApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcmV0dW5zIHRoZSBkYXRhIG9mIGVhY2ggY3N2IGZpbGUgaW4ganNvbiBzdHJpbmdcbiAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IFwibGlzdFwiOiByb3dfZGF0YSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIHNob3dzIHdhcm5pbmcgbWVzc2FnZVxuICAgICAgICBcbiAgICAgICAgICAgIEFILnNob3dtc2cobC5taW5fbWF4X3ZhbGlkYXRpb24sIDQwMDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdXBkYXRlUGFyZW50R3VpZCgpIHtcbiAgICAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgbWV0aG9kXG4gICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlUGFyZW50R3VpZCAxXCIpO1xuICAgICAgICBBSC5hY3RpdmF0ZSgyKTtcbiAgICAgICAgLy8gQUguYWpheCh7XG4gICAgICAgIC8vICAgICAvL2FqYXg6IFwiMVwiLFxuICAgICAgICAvLyAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgdmFyaWFibGVcbiAgICAgICAgLy8gICAgIHVybDogYmFzZVVybCArICdlZGl0b3IvaW5kZXgucGhwJywgLy8gZGVmaW5lcyB3aGVyZSBhamF4IHJlcXVlc3Qgd2lsbCBiZSBzZW5kXG4gICAgICAgIC8vICAgICAvL2NhY2hlOiBmYWxzZSwgLy8gZG9lcyBub3Qgc3RvcmVzIGRhdGEgaW4gY2FjaGUgbWVtb3J5XG4gICAgICAgIC8vICAgICBkYXRhOiB7XG4gICAgICAgIC8vICAgICAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgbWV0aG9kXG4gICAgICAgIC8vICAgICAgICAgc3RyX2NvbnRlbnQ6IEpTT05Ub1hNTChzdGF0ZS54bWwpLCAvLyBkYXRhIGluIHRoZSBmb3JtIG9mIG9iamVjdCBmb3IgdXBkYXRlIHRoZSBndWlkXG4gICAgICAgIC8vICAgICAgICAgZnVuYzogXCJ1cGRhdGVfZ3VpZF9mcm9tX2FwaVwiLCAvLyBkZWZpbmVzIHRoZSBjb25kaWRpdG9uIGluIHdoaWNoIGl0IGNhbiBiZSBhY2Nlc3Mgb24gc2VydmVyIHNpZGVcbiAgICAgICAgLy8gICAgICAgICBjb250ZW50X2d1aWQ6IHN0YXRlLmRhdGFfY2RhdGFbMV0ucGcsIC8vIHNlbmRzIHRoZSBndWlkIHRoYXQgaGFzIHRvIGJlIHVwZGF0ZVxuICAgICAgICAvLyAgICAgICAgIHVwZGF0ZV9wYXJlbnQ6IDFcbiAgICAgICAgLy8gICAgIH0sXG4gICAgICAgIC8vICAgICAvL3R5cGU6IFwicG9zdFwiLCAvLyBzZW5kIHRoZSBkYXRhIHdpdGggZm9yIHNlY3VyaXR5XG4gICAgICAgIC8vICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgLy8gICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cbiAgICAgICAgLy8gICAgICAgICB2YXIganNvbl9yZWNlaXZlZF9zdHJpbmcgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgLy8gICAgICAgICBpZiAoIWpzb25fcmVjZWl2ZWRfc3RyaW5nLmNvbnRlbnRfZ3VpZCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAvLyBzaG93cyB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgdmFyaWFibGVcbiAgICAgICAgLy8gICAgICAgICAgICAgQUkgJiYgQUkuc2hvd21zZyhsLmNoZWNrX25ldF9hbmRfc2F2ZSwgNDAwMCk7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgIC8vIEBlc2xpbnQgaXNzdWUsIGl0J3MgZ2xvYmFsIG1ldGhvZFxuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKFwidXBkYXRlUGFyZW50R3VpZCAyXCIpO1xuICAgICAgICAvLyAgICAgICAgIEFILmFjdGl2YXRlKDApO1xuICAgICAgICAvLyAgICAgICAgIC8vIGhpZGVzIHRoZSBwcm9ncmVzcyBiYXJcbiAgICAgICAgLy8gICAgICAgICAvL2pRdWVyeSgnI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyJykuYWRkQ2xhc3MoJ2gnKTtcbiAgICAgICAgLy8gICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3dhcm5pbmdfbGFiZWxfY29udGFpbmVyXCIpLmNsYXNzTGlzdC5hZGQoXCJoXCIpO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9KTtcblxuICAgICAgICBBSC5hamF4KHtcbiAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgdXJsOiBiYXNlVXJsICsgJ2VkaXRvci9pbmRleC5waHAnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgIHN0cl9jb250ZW50OiBKU09OVG9YTUwoc3RhdGUueG1sKSwgLy8gZGF0YSBpbiB0aGUgZm9ybSBvZiBvYmplY3QgZm9yIHVwZGF0ZSB0aGUgZ3VpZFxuICAgICAgICAgICAgICAgIGZ1bmM6IFwidXBkYXRlX2d1aWRfZnJvbV9hcGlcIiwgLy8gZGVmaW5lcyB0aGUgY29uZGlkaXRvbiBpbiB3aGljaCBpdCBjYW4gYmUgYWNjZXNzIG9uIHNlcnZlciBzaWRlXG4gICAgICAgICAgICAgICAgY29udGVudF9ndWlkOiBzdGF0ZS5kYXRhX2NkYXRhWzFdLnBnLCAvLyBzZW5kcyB0aGUgZ3VpZCB0aGF0IGhhcyB0byBiZSB1cGRhdGVcbiAgICAgICAgICAgICAgICB1cGRhdGVfcGFyZW50OiAxXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25FbmQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIEFILmFjdGl2YXRlKDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAvLyBjb250YWlucyB0aGUgcmVzcG9uc2UgaW4gb2JqZWN0IGZvcm1cbiAgICAgICAgICAgIGxldCBqc29uX3JlY2VpdmVkX3N0cmluZyA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgaWYgKCFqc29uX3JlY2VpdmVkX3N0cmluZy5jb250ZW50X2d1aWQpIHtcbiAgICAgICAgICAgICAgICAvLyBzaG93cyB3YXJuaW5nIG1lc3NhZ2VcbiAgICAgICAgICAgICAgICAvLyBAZXNsaW50IGlzc3VlLCBpdCdzIGdsb2JhbCB2YXJpYWJsZVxuICAgICAgICAgICAgICAgIEFIICYmIEFILnNob3dtc2cobC5jaGVja19uZXRfYW5kX3NhdmUsIDQwMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gQGVzbGludCBpc3N1ZSwgaXQncyBnbG9iYWwgbWV0aG9kXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwZGF0ZVBhcmVudEd1aWQgMlwiKTtcbiAgICAgICAgICAgIEFILmFjdGl2YXRlKDApO1xuICAgICAgICAgICAgLy8gaGlkZXMgdGhlIHByb2dyZXNzIGJhclxuICAgICAgICAgICAgLy9qUXVlcnkoJyN3YXJuaW5nX2xhYmVsX2NvbnRhaW5lcicpLmFkZENsYXNzKCdoJyk7XG4gICAgICAgICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjd2FybmluZ19sYWJlbF9jb250YWluZXJcIikuY2xhc3NMaXN0LmFkZChcImhcIik7XG4gICAgICAgICAgICBBSC5zZWxlY3QoXCIjd2FybmluZ19sYWJlbF9jb250YWluZXJcIixcImFkZENsYXNzXCIsXCJoXCIpXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBcbiAgICAvLyAkOntcbiAgICAvLyAgICAgaWYgKHN0YXRlLmRhdGFfY2RhdGEgJiYgc3RhdGUuZGF0YV9jZGF0YVsxXS5jZykge1xuICAgIC8vICAgICAgICAgaGFuZGxlX2Rpc2FibGUgPSB0cnVlO1xuICAgIC8vICAgICB9XG4gICAgLy8gICAgIGhhbmRsZV9nZW5lcmF0ZSA9IHN0YXRlLnhtbCAmJiAoKHN0YXRlLnhtbC5zbXhtbC5fZGlzYWJsZWRfZ2VuZXJhdGUgPT0gMSkgPyB0cnVlOiBmYWxzZSk7XG4gICAgLy8gICAgIGFsZXJ0KHN0YXRlLnhtbC5zbXhtbCk7XG4gICAgLy8gICAgIGlmIChzdGF0ZS5kYXRhX2NkYXRhKSB7XG4gICAgLy8gICAgICAgICBwcm9ncmVzc19kYXRhID0gTWF0aC5jZWlsKChzdGF0ZS5jb3VudGVyICogMTAwKSAvIChzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aCAtIDEpKSArICclJztcbiAgICAvLyAgICAgfVxuICAgIC8vICAgICBpZihzdGF0ZS5kYXRhX2NkYXRhKSB7XG4gICAgLy8gICAgICAgICBjaGlsZF9nZW5lcmF0ZWQgPSAoc3RhdGUuZGF0YV9jZGF0YVsxXS5jZykgPyBmYWxzZTogdHJ1ZVxuICAgIC8vICAgICB9XG4gICAgLy8gfVxuICAgIGxldCBoYW5kbGVfZGlzYWJsZSA9IGZhbHNlO1xuICAgIGxldCBwcm9ncmVzc19kYXRhID0gJyc7XG4gICAgbGV0IGhhbmRsZV9nZW5lcmF0ZTtcblxuICAgICQ6e1xuICAgICAgICBjb25zb2xlLmxvZygnRWRpdG9yIFN0YXRlID0+JytlZGl0b3JTdGF0ZS5ndWlkKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJDaGVja2luZyAkXCIpO1xuICAgICAgICBpZiAoc3RhdGUuZGF0YV9jZGF0YSAmJiBzdGF0ZS5kYXRhX2NkYXRhWzFdLmNnKSB7XG4gICAgICAgICAgICBoYW5kbGVfZGlzYWJsZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlX2dlbmVyYXRlID0gc3RhdGUueG1sICYmICgoc3RhdGUueG1sLnNteG1sLl9kaXNhYmxlZF9nZW5lcmF0ZSA9PSAxKSA/IHRydWU6IGZhbHNlKTtcbiAgICAgICAgLy9hbGVydChzdGF0ZS54bWwuc214bWwpO1xuICAgICAgICBpZiAoc3RhdGUuZGF0YV9jZGF0YSkge1xuICAgICAgICAgICAgcHJvZ3Jlc3NfZGF0YSA9IE1hdGguY2VpbCgoc3RhdGUuY291bnRlciAqIDEwMCkgLyAoc3RhdGUuZGF0YV9jZGF0YS5sZW5ndGggLSAxKSkgKyAnJSc7XG4gICAgICAgIH1cbiAgICAgICAgaWYoc3RhdGUuZGF0YV9jZGF0YSkge1xuICAgICAgICAgICAgY2hpbGRfZ2VuZXJhdGVkID0gKHN0YXRlLmRhdGFfY2RhdGFbMV0uY2cpID8gZmFsc2U6IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAgLy8gdXNlZCBmb3IgaGlkZSBhbmQgc2hvdyB0aGUgd2FybmluZyBkaWFsb2cgYm94XG4gICAgZnVuY3Rpb24gZWRpdG9yTW9kYWxVcGRhdGUoYXJncykge1xuICAgICAgICBcbiAgICAgICAgc3RhdGUuZWRpdG9yTW9kYWxIYW5kbGUgPSBhcmdzO1xuICAgICAgICBcbiAgICB9XG5cblxuPC9zY3JpcHQ+XG48ZGl2PlxuICAgIDxkaXYgaWQ9XCJhdXRob3JpbmdfY29udGFpbmVyXCIgY2xhc3M9XCJjb250YWluZXIgdy0xMDAgcHgtMyBweS0zXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLTEyXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJ3YXJuaW5nX2xhYmVsX2NvbnRhaW5lclwiIGNsYXNzPVwicHJvZ3Jlc3Mgdy0xMDAgaCBteS0yIGhlaWdodDIwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyIGJnLXN1Y2Nlc3MgcHJvZ3Jlc3MtYmFyLXN0cmlwZWQgcHJvZ3Jlc3MtYmFyLWFuaW1hdGVkIGZvbnQtd2VpZ2h0LWJvbGRlclwiIHN0eWxlPXtcIndpZHRoOlwiKyBwcm9ncmVzc19kYXRhfT48Yj57c3RhdGUuY291bnRlciArICcvJyArIChzdGF0ZS5kYXRhX2NkYXRhICYmIChzdGF0ZS5kYXRhX2NkYXRhLmxlbmd0aCAtIDEpKX08L2I+PC9kaXY+XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWlubGluZS1ibG9ja1wiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtYnMtcGxhY2VtZW50PVwidG9wXCIgdGl0bGU9eygoaGFuZGxlX2Rpc2FibGUpID8gbC5uZXdfbm90X2FsbG93ZWQ6IGwuY3N2X2ZpbGUpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXtcImJ0biBidG4tcHJpbWFyeSBidG4tbWRcIiArICgoaGFuZGxlX2Rpc2FibGUpID8gXCIgcG9pbnRlcl9ldmVudF9ub25lXCI6IFwiXCIpfSBuYW1lPVwiaW1wb3J0X2Nzdl9idG5cIiBvbjpjbGljaz17aGFuZGxlSW1wb3J0fSBkaXNhYmxlZD17aGFuZGxlX2Rpc2FibGV9PntsLmltcG9ydF9jc3Z9PC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJmaWxlVXBsb2FkXCIgdHlwZT1cImZpbGVcIiBvbjpjaGFuZ2U9e3VwbG9hZENzdn0gY2xhc3M9XCJ1cGxvYWQgaFwiIC8+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIG1sLTJcIiBkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLWJzLXBsYWNlbWVudD1cInRvcFwiIHRpdGxlPXsoKGhhbmRsZV9nZW5lcmF0ZSkgPyAoKGhhbmRsZV9kaXNhYmxlKSA/IGwuYWxyZWFkeV9nZW5lcmF0ZWQ6IGwuc2F2ZV93YXJfbXNnKTogKChoYW5kbGVfZGlzYWJsZSkgPyBsLm5ld19yb3dfdG9vbHRpcDogbC5nZW5lcmF0ZV9pdGVtcykpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXtcImJ0biBidG4tcHJpbWFyeSBidG4tbWRcIiArICgoaGFuZGxlX2dlbmVyYXRlKSA/ICcgcG9pbnRlcl9ldmVudF9ub25lJzogJycpfSBuYW1lPVwiZ2VuZXJhdGVfcXVlc3Rpb25fYnRuXCIgaWQ9XCJnZW5lcmF0ZV9xdWVzdGlvbl9idG5cIiBvbjpjbGljaz17Z2VuZXJhdGVRdWVzdGlvbnN9IGRpc2FibGVkPXtoYW5kbGVfZ2VuZXJhdGV9PnsoKGhhbmRsZV9nZW5lcmF0ZSkgPyBsLmdlbmVyYXRlX2l0ZW06ICgoc3RhdGUuZGF0YV9jZGF0YSAmJiBzdGF0ZS5kYXRhX2NkYXRhWzFdLmNnKSA/IGwudXBkYXRlX2l0ZW06IGwuZ2VuZXJhdGVfaXRlbSkpfTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkLWlubGluZS1ibG9jayBtbC0yXCIgZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1icy1wbGFjZW1lbnQ9XCJ0b3BcIiB0aXRsZT17KChzdGF0ZS5oYW5kbGVfZGlzYWJsZV9zaG93KSA/ICgoaGFuZGxlX2Rpc2FibGUpID8gbC5jaGlsZF9ub3Rfc2VsZWN0ZWQ6IGwuY2hpbGRfbm90X2dlbmVyYXRlZCk6IGwuc2hvd19hbGwpfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXtcImJ0biBidG4tcHJpbWFyeSBidG4tbWQgd2lkdGgxMjVcIiArICgoc3RhdGUuaGFuZGxlX2Rpc2FibGVfc2hvdykgPyBcIiBwb2ludGVyX2V2ZW50X25vbmVcIjogXCJcIil9IG5hbWU9XCJzaG93X2FsbF9jaGlsZFwiIGlkPVwic2hvd19hbGxfY2hpbGRcIiBkaXNhYmxlZD17c3RhdGUuaGFuZGxlX2Rpc2FibGVfc2hvd30gb246Y2xpY2s9e3Nob3dBbGxDaGlsZH0+eygoc3RhdGUuc2VsZWN0ZWRfbGVuZ3RoID4gMCkgPyBsLnNob3dfYWxsX2xhYmVsICsgJyAoJyArIHN0YXRlLnNlbGVjdGVkX2xlbmd0aCArJyknOiBsLnNob3dfYWxsX2xhYmVsKX08L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHsjaWYgc3RhdGUuZGF0YV9jZGF0YX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSBjbGVhcmZpeCBteC0wXCIgaWQ9XCJjc3ZfZGF0YV90YWJsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJ3aWR0aDgwIHRleHQtY2VudGVyIGFsaWduLW1pZGRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZC1pbmxpbmUtYmxvY2sgcC0wXCIgZGF0YS1icy10b2dnbGU9XCJ0b29sdGlwXCIgZGF0YS1icy1wbGFjZW1lbnQ9XCJ0b3BcIiB0aXRsZT17KChjaGlsZF9nZW5lcmF0ZWQpID8gbC5jaGlsZF9ub3RfZ2VuZXJhdGVkOiAnJyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgbmFtZT1cImNoZWNrYWxsXCIgcmVsPVwiY2hrXzFcIiBjbGFzcz17XCJtci0zIG10LTEgY3VzdG9tX2NoZWNrYm94X25ldyBmbG9hdC1sZWZ0IHVjX2NoZWNrYm94IGNoZWNrYWxsIG1uZ190cmFja19jaGVja2JveCBtdC1zbTIgbS1yXCIgKyAoKGNoaWxkX2dlbmVyYXRlZCkgPyAnIHBvaW50ZXJfZXZlbnRfbm9uZSc6ICcnKX0gZGlzYWJsZWQ9e2NoaWxkX2dlbmVyYXRlZH0vPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm1yLTJcIj48YiBjbGFzcz1cImZvbnQxN1wiPiM8L2I+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGggY2xhc3M9XCJtaW5fd2lkXzk1IHdpZHRoX21heF9jb250ZW50IG1heF93aWR0aF8zMDAgYWxpZ24tbWlkZGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGIgY2xhc3M9XCJmb250MTdcIj57c3RhdGUuZGF0YV9jZGF0YVswXS5jMX08L2I+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGNsYXNzPVwibWluX3dpZF85NSB3aWR0aF9tYXhfY29udGVudCBtYXhfd2lkdGhfMzAwIGFsaWduLW1pZGRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxiIGNsYXNzPVwiZm9udDE3XCI+e3N0YXRlLmRhdGFfY2RhdGFbMF0uYzJ9PC9iPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aCBjbGFzcz1cIndpZHRoNjUgdGV4dC1jZW50ZXIgYWxpZ24tbWlkZGxlXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGIgY2xhc3M9XCJmb250MTdcIj57bC5hY3Rpb25fdHh0fTwvYj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyNlYWNoIHN0YXRlLmRhdGFfY2RhdGEgYXMgb2JqZWN0X2RhdGEsIGluZGV4fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7I2lmIGluZGV4ID4gMH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwid2lkdGg4MCB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIHAtMFwiIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiIHRpdGxlPXsoKG9iamVjdF9kYXRhLmNnKSA/ICcnOiBsLmNoaWxkX25vdF9nZW5lcmF0ZWQpfSBkYXRhLWJzLXBsYWNlbWVudD1cInJpZ2h0XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBjbGFzcz17XCJtci0yIG10LTEgY3VzdG9tX2NoZWNrYm94X25ldyBmbG9hdC1sZWZ0IHNlbGVjdF9lZGl0YWJsZV9ndWlkXCIrICgob2JqZWN0X2RhdGEuY2cpID8gJyc6ICcgcG9pbnRlcl9ldmVudF9ub25lJyl9IHRhcmdldC1ndWlkPXtvYmplY3RfZGF0YS5jZ30gZGlzYWJsZWQ9eygob2JqZWN0X2RhdGEuY2cpID8gZmFsc2U6IHRydWUpfS8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJpbmxpbmUtYmxvY2sgYnRuLXNlY29uZGFyeSBidG4tY2lyY2xlIHJvdW5kZWQtY2lyY2xlIHdpZHRoMjcgaGVpZ2h0MjcgZm9udDEyIHRleHQtY2VudGVyIHAtMSBidG4tc20gc3F1YXJlXCI+eygoaW5kZXggPCAxMCkgPyAnMCcgKyBpbmRleCA6IGluZGV4KX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlkPXtcImNvbF9cIiArIGluZGV4ICsgXCJfXCIgKyAwfSBjb250ZW50RWRpdGFibGU9XCJ0cnVlXCIgb246Ymx1cj17aGFuZGxlRWRpdH0gY2xhc3M9XCJtaW5fd2lkXzk1IHdpZHRoX21heF9jb250ZW50IG1heF93aWR0aF8zMDAgd29yZC13cmFwLWJyZWFrIGFsaWduLW1pZGRsZVwiPntvYmplY3RfZGF0YS5jMX08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGlkPXtcImNvbF9cIiArIGluZGV4ICsgXCJfXCIgKyAxfSBjb250ZW50RWRpdGFibGU9XCJ0cnVlXCIgb246Ymx1cj17aGFuZGxlRWRpdH0gY2xhc3M9XCJtaW5fd2lkXzk1IHdpZHRoX21heF9jb250ZW50IG1heF93aWR0aF8zMDAgd29yZC13cmFwLWJyZWFrIGFsaWduLW1pZGRsZVwiPntvYmplY3RfZGF0YS5jMn08L3RkPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwid2lkdGg2NSB0ZXh0LWNlbnRlciBhbGlnbi1taWRkbGVcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImQtaW5saW5lLWJsb2NrIG1sLTJcIiBkYXRhLWJzLXRvZ2dsZT1cInRvb2x0aXBcIiBkYXRhLWJzLXBsYWNlbWVudD1cInRvcFwiIHRpdGxlPXsoKG9iamVjdF9kYXRhLmNnKSA/IGwuZGVsZXRpb25fbm90X2FsbG93ZWQ6IGwuZGVsX3Jvdyl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPXtcImJ0blwiICsgKChvYmplY3RfZGF0YS5jZykgPyAnIHBvaW50ZXJfZXZlbnRfbm9uZSc6ICcnKX0gbmFtZT17XCJkZWxldGVfZWxtXCIgKyBpbmRleH0gaWQ9e1wiZGVsZXRlX2VsbVwiICsgaW5kZXh9IG9uOmNsaWNrPXsoKT0+e2hhbmRsZURlbGV0ZShpbmRleCl9fSBkaXNhYmxlZD17KChvYmplY3RfZGF0YS5jZykgPyB0cnVlOiBmYWxzZSl9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29tb29uIGljb21vb24tMjRweC1kZWxldGUtMSBzNFwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7L2lmfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey9lYWNofVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHsvaWZ9XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gIGRhdGEtYnMtdG9nZ2xlPVwidG9vbHRpcFwiIGRhdGEtYnMtcGxhY2VtZW50PVwidG9wXCIgdGl0bGU9e2wuYWRkX2NoaWxkfSBjbGFzcz1cImJ0biBidG4tcHJpbWFyeSBidG4tbWQgbXQtMlwiIG5hbWU9XCJBZGRfcm93XCIgaWQ9XCJBZGRfcm93XCIgb246Y2xpY2s9e2FkZE9wdGlvbn0+e2wuYWRkX29wdGlvbn08L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8IS0tIDxFZGl0b3JNb2RhbFxuICAgICAgICBoZWFkZXI9e21vZGFsLmhlYWRlcn1cbiAgICAgICAgYm9keT17bW9kYWwuYm9keX1cbiAgICAgICAgZm9vdGVyPXttb2RhbC5mb290ZXJ9XG4gICAgICAgIGZ1bGxXaWR0aD1cInRydWVcIlxuICAgICAgICBtYXhXaWR0aD17bW9kYWwubWF4V2lkdGh9XG4gICAgICAgIGN1c3RvbUZvb3RlciA9IHt0cnVlfVxuICAgICAgICBvblVwZGF0ZT17ZWRpdG9yTW9kYWxVcGRhdGUuYmluZCh0aGlzKX1cbiAgICAgICAgaGFuZGxlPXtzdGF0ZS5lZGl0b3JNb2RhbEhhbmRsZX1cbiAgICAvPiAtLT5cbiAgICA8RGlhbG9nXG5cdFx0YmluZDp2aXNpYmxlPXtzdGF0ZS5FZGl0b3JNb2RhbEJveH0gb246Y2xvc2U9eygpID0+IHtzdGF0ZS5FZGl0b3JNb2RhbEJveCA9IGZhbHNlfX0gc3R5bGU9eyd3aWR0aDo1MDBweDsnfSA+XG4gICAgICAgICAgICA8ZGl2IHNsb3Q9XCJ0aXRsZVwiPntsLnNhdmVfaGVhZGVyfTwvZGl2PlxuICAgICAgICAgICAgPGRpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY29sLW1kLTEyXCIgc3R5bGU9eydtYXJnaW46NDBweDsnfT57bC5jaGlsZF91cGRhdGV9PC9zcGFuPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IHNsb3Q9XCJmb290ZXJcIiBjbGFzcz1cImZvb3RlclwiIHN0eWxlPVwiYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWRpdmlkZXIsIHJnYmEoMCwgMCwgMCwgMC4xKSk7XCI+IFxuICAgICAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cImNvbnRhaW5lZFwiXG4gICAgICAgICAgICAgICAgICAgIG9uOmNsaWNrPXtoYW5kbGVVcGRhdGUocm93X25vKX1cbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJ0ZXh0LXdoaXRlIGJnLXByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17J3RleHQtdHJhbnNmb3JtOm5vbmU7ZmxvYXQ6cmlnaHQ7bWFyZ2luOjVweDsnfVxuICAgICAgICAgICAgICAgID5PS1xuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG5cdFx0XHRcdFx0XG5cdDwvRGlhbG9nPlxuPC9kaXY+XG5cbjxzdHlsZT5cbiAgICAuaGVpZ2h0MjAgIHtcbiAgICAgICAgaGVpZ2h0OiAyMHB4ICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIC53aWR0aDEyNSB7XG4gICAgICAgIHdpZHRoOiAxMjVweDtcbiAgICB9XG4gICAgLndpZHRoODAgIHtcbiAgICAgICAgd2lkdGg6IDgwcHg7XG4gICAgfVxuICAgIC5taW5fd2lkXzk1ICB7XG4gICAgICAgIG1pbi13aWR0aDo5NXB4O1xuICAgIH1cbiAgICAud2lkdGhfbWF4X2NvbnRlbnQge1xuICAgICAgICB3aWR0aDogbWF4LWNvbnRlbnQ7XG4gICAgfVxuICAgIC5mb250MTcge1xuICAgICAgIGZvbnQtc2l6ZTogMTVweCFpbXBvcnRhbnQ7XG4gICAgfVxuXG4gICAgLmN1c3RvbV9jaGVja2JveF9uZXcge1xuICAgICAgICBkaXNwbGF5OiBibG9jaztcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICB3aWR0aDogMjBweDtcbiAgICAgICAgaGVpZ2h0OiAyMHB4O1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAwO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIGZvbnQtc2l6ZTogMThweDtcbiAgICB9XG4gICAgLndpZHRoMjcge1xuICAgICAgICB3aWR0aDogMjdweDtcbiAgICB9XG5cbiAgICAuaGVpZ2h0MjcgIHtcbiAgICAgICAgaGVpZ2h0OiAyN3B4ICFpbXBvcnRhbnQ7XG4gICAgfVxuICAgIC53aWR0aDY1ICB7XG4gICAgICAgIHdpZHRoOiA2NXB4O1xuICAgIH1cblxuICAgIHRkIHtcbiAgICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cblxuPC9zdHlsZT4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBbzRCSSxTQUFTLGVBQUUsQ0FBQyxBQUNSLE1BQU0sQ0FBRSxJQUFJLENBQUMsVUFBVSxBQUMzQixDQUFDLEFBQ0QsU0FBUyxlQUFDLENBQUMsQUFDUCxLQUFLLENBQUUsS0FBSyxBQUNoQixDQUFDLEFBQ0QsUUFBUSxlQUFFLENBQUMsQUFDUCxLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFDRCxXQUFXLGVBQUUsQ0FBQyxBQUNWLFVBQVUsSUFBSSxBQUNsQixDQUFDLEFBQ0Qsa0JBQWtCLGVBQUMsQ0FBQyxBQUNoQixLQUFLLENBQUUsV0FBVyxBQUN0QixDQUFDLEFBQ0QsT0FBTyxlQUFDLENBQUMsQUFDTixTQUFTLENBQUUsSUFBSSxVQUFVLEFBQzVCLENBQUMsQUFFRCxvQkFBb0IsZUFBQyxDQUFDLEFBQ2xCLE9BQU8sQ0FBRSxLQUFLLENBQ2QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLGFBQWEsQ0FBRSxDQUFDLENBQ2hCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsU0FBUyxDQUFFLElBQUksQUFDbkIsQ0FBQyxBQUNELFFBQVEsZUFBQyxDQUFDLEFBQ04sS0FBSyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUQsU0FBUyxlQUFFLENBQUMsQUFDUixNQUFNLENBQUUsSUFBSSxDQUFDLFVBQVUsQUFDM0IsQ0FBQyxBQUNELFFBQVEsZUFBRSxDQUFDLEFBQ1AsS0FBSyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUQsRUFBRSxlQUFDLENBQUMsQUFDQSxVQUFVLENBQUUsTUFBTSxBQUN0QixDQUFDIn0= */";
	append_dev(document_1.head, style);
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[40] = i;
	return child_ctx;
}

// (815:20) {#if state.data_cdata}
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
			add_location(input, file, 820, 44, 39755);
			attr_dev(b0, "class", "font17 svelte-1qzd0v1");
			add_location(b0, file, 821, 63, 40050);
			attr_dev(span0, "class", "mr-2");
			add_location(span0, file, 821, 44, 40031);
			attr_dev(span1, "class", "d-inline-block p-0");
			attr_dev(span1, "data-bs-toggle", "tooltip");
			attr_dev(span1, "data-bs-placement", "top");
			attr_dev(span1, "title", span1_title_value = /*child_generated*/ ctx[1] ? language.child_not_generated : "");
			add_location(span1, file, 819, 40, 39572);
			attr_dev(th0, "class", "width80 text-center align-middle svelte-1qzd0v1");
			add_location(th0, file, 818, 36, 39486);
			attr_dev(b1, "class", "font17 svelte-1qzd0v1");
			add_location(b1, file, 825, 40, 40316);
			attr_dev(th1, "class", "min_wid_95 width_max_content max_width_300 align-middle svelte-1qzd0v1");
			add_location(th1, file, 824, 36, 40207);
			attr_dev(b2, "class", "font17 svelte-1qzd0v1");
			add_location(b2, file, 828, 40, 40550);
			attr_dev(th2, "class", "min_wid_95 width_max_content max_width_300 align-middle svelte-1qzd0v1");
			add_location(th2, file, 827, 36, 40441);
			attr_dev(b3, "class", "font17 svelte-1qzd0v1");
			add_location(b3, file, 831, 40, 40761);
			attr_dev(th3, "class", "width65 text-center align-middle svelte-1qzd0v1");
			add_location(th3, file, 830, 36, 40675);
			add_location(tr, file, 817, 32, 39445);
			attr_dev(table, "class", "table clearfix mx-0");
			attr_dev(table, "id", "csv_data_table");
			add_location(table, file, 816, 28, 39357);
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
		source: "(815:20) {#if state.data_cdata}",
		ctx
	});

	return block;
}

// (839:40) {#if index > 0}
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
			add_location(input, file, 842, 56, 41515);
			attr_dev(div, "class", "inline-block btn-secondary btn-circle rounded-circle width27 height27 font12 text-center p-1 btn-sm square svelte-1qzd0v1");
			add_location(div, file, 843, 56, 41789);
			attr_dev(span0, "class", "d-inline-block p-0");
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "title", span0_title_value = /*object_data*/ ctx[6].cg ? "" : language.child_not_generated);
			attr_dev(span0, "data-bs-placement", "right");
			add_location(span0, file, 841, 52, 41319);
			attr_dev(td0, "class", "width80 text-center align-middle svelte-1qzd0v1");
			add_location(td0, file, 840, 48, 41221);
			attr_dev(td1, "id", td1_id_value = "col_" + /*index*/ ctx[40] + "_" + 0);
			attr_dev(td1, "contenteditable", "true");
			attr_dev(td1, "class", "min_wid_95 width_max_content max_width_300 word-wrap-break align-middle svelte-1qzd0v1");
			add_location(td1, file, 846, 48, 42116);
			attr_dev(td2, "id", td2_id_value = "col_" + /*index*/ ctx[40] + "_" + 1);
			attr_dev(td2, "contenteditable", "true");
			attr_dev(td2, "class", "min_wid_95 width_max_content max_width_300 word-wrap-break align-middle svelte-1qzd0v1");
			add_location(td2, file, 847, 48, 42344);
			attr_dev(span1, "class", "icomoon icomoon-24px-delete-1 s4");
			add_location(span1, file, 851, 60, 43140);
			attr_dev(button, "class", button_class_value = "" + (null_to_empty("btn" + (/*object_data*/ ctx[6].cg ? " pointer_event_none" : "")) + " svelte-1qzd0v1"));
			attr_dev(button, "name", button_name_value = "delete_elm" + /*index*/ ctx[40]);
			attr_dev(button, "id", button_id_value = "delete_elm" + /*index*/ ctx[40]);
			button.disabled = button_disabled_value = /*object_data*/ ctx[6].cg ? true : false;
			add_location(button, file, 850, 56, 42873);
			attr_dev(span2, "class", "d-inline-block ml-2");
			attr_dev(span2, "data-bs-toggle", "tooltip");
			attr_dev(span2, "data-bs-placement", "top");

			attr_dev(span2, "title", span2_title_value = /*object_data*/ ctx[6].cg
			? language.deletion_not_allowed
			: language.del_row);

			add_location(span2, file, 849, 52, 42670);
			attr_dev(td3, "class", "width65 text-center align-middle svelte-1qzd0v1");
			add_location(td3, file, 848, 48, 42572);
			add_location(tr, file, 839, 44, 41168);
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
		source: "(839:40) {#if index > 0}",
		ctx
	});

	return block;
}

// (836:36) {#each state.data_cdata as object_data, index}
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
		source: "(836:36) {#each state.data_cdata as object_data, index}",
		ctx
	});

	return block;
}

// (881:12) <div slot="title">
function create_title_slot(ctx) {
	let div;

	const block = {
		c: function create() {
			div = element("div");
			div.textContent = `${language.save_header}`;
			attr_dev(div, "slot", "title");
			add_location(div, file, 880, 12, 44348);
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
		source: "(881:12) <div slot=\\\"title\\\">",
		ctx
	});

	return block;
}

// (888:16) <Button                     variant="contained"                     on:click={handleUpdate(row_no)}                     class="text-white bg-primary"                     style={'text-transform:none;float:right;margin:5px;'}                 >
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
		source: "(888:16) <Button                     variant=\\\"contained\\\"                     on:click={handleUpdate(row_no)}                     class=\\\"text-white bg-primary\\\"                     style={'text-transform:none;float:right;margin:5px;'}                 >",
		ctx
	});

	return block;
}

// (887:12) <div slot="footer" class="footer" style="border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));">
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
			add_location(div, file, 886, 12, 44585);
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
		source: "(887:12) <div slot=\\\"footer\\\" class=\\\"footer\\\" style=\\\"border-top: 1px solid var(--divider, rgba(0, 0, 0, 0.1));\\\">",
		ctx
	});

	return block;
}

// (879:4) <Dialog   bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}} style={'width:500px;'} >
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
			add_location(span, file, 883, 20, 44460);
			attr_dev(div0, "class", "row");
			add_location(div0, file, 882, 16, 44422);
			add_location(div1, file, 881, 12, 44400);
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
		source: "(879:4) <Dialog   bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}} style={'width:500px;'} >",
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
			add_location(b, file, 799, 155, 37304);
			attr_dev(div0, "class", "progress-bar bg-success progress-bar-striped progress-bar-animated font-weight-bolder");
			attr_dev(div0, "style", div0_style_value = "width:" + /*progress_data*/ ctx[4]);
			add_location(div0, file, 799, 24, 37173);
			attr_dev(div1, "id", "warning_label_container");
			attr_dev(div1, "class", "progress w-100 h my-2 height20 svelte-1qzd0v1");
			add_location(div1, file, 798, 20, 37075);
			attr_dev(button0, "class", button0_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_disable*/ ctx[3] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"));
			attr_dev(button0, "name", "import_csv_btn");
			button0.disabled = /*handle_disable*/ ctx[3];
			add_location(button0, file, 803, 28, 37636);
			attr_dev(span0, "class", "d-inline-block");
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "data-bs-placement", "top");

			attr_dev(span0, "title", span0_title_value = /*handle_disable*/ ctx[3]
			? language.new_not_allowed
			: language.csv_file);

			add_location(span0, file, 802, 24, 37470);
			attr_dev(input, "id", "fileUpload");
			attr_dev(input, "type", "file");
			attr_dev(input, "class", "upload h");
			add_location(input, file, 805, 24, 37878);
			attr_dev(button1, "class", button1_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_generate*/ ctx[5] ? " pointer_event_none" : "")) + " svelte-1qzd0v1"));
			attr_dev(button1, "name", "generate_question_btn");
			attr_dev(button1, "id", "generate_question_btn");
			button1.disabled = /*handle_generate*/ ctx[5];
			add_location(button1, file, 807, 28, 38236);
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

			add_location(span1, file, 806, 24, 37979);

			attr_dev(button2, "class", button2_class_value = "" + (null_to_empty("btn btn-primary btn-md width125" + (/*state*/ ctx[0].handle_disable_show
			? " pointer_event_none"
			: "")) + " svelte-1qzd0v1"));

			attr_dev(button2, "name", "show_all_child");
			attr_dev(button2, "id", "show_all_child");
			button2.disabled = button2_disabled_value = /*state*/ ctx[0].handle_disable_show;
			add_location(button2, file, 810, 28, 38854);
			attr_dev(span2, "class", "d-inline-block ml-2");
			attr_dev(span2, "data-bs-toggle", "tooltip");
			attr_dev(span2, "data-bs-placement", "top");

			attr_dev(span2, "title", span2_title_value = /*state*/ ctx[0].handle_disable_show
			? /*handle_disable*/ ctx[3]
				? language.child_not_selected
				: language.child_not_generated
			: language.show_all);

			add_location(span2, file, 809, 24, 38625);
			add_location(div2, file, 801, 20, 37440);
			attr_dev(button3, "data-bs-toggle", "tooltip");
			attr_dev(button3, "data-bs-placement", "top");
			attr_dev(button3, "title", button3_title_value = language.add_child);
			attr_dev(button3, "class", "btn btn-primary btn-md mt-2");
			attr_dev(button3, "name", "Add_row");
			attr_dev(button3, "id", "Add_row");
			add_location(button3, file, 863, 20, 43661);
			attr_dev(div3, "class", "col-12");
			add_location(div3, file, 797, 16, 37034);
			attr_dev(div4, "class", "row");
			add_location(div4, file, 796, 12, 37000);
			attr_dev(div5, "class", "container");
			add_location(div5, file, 795, 8, 36964);
			attr_dev(div6, "id", "authoring_container");
			attr_dev(div6, "class", "container w-100 px-3 py-3");
			add_location(div6, file, 794, 4, 36891);
			add_location(div7, file, 793, 0, 36881);
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
//# sourceMappingURL=ListAuthoring-7a22c3b2.js.map
