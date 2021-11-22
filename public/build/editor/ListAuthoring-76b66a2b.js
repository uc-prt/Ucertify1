
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
import { ad as createCommonjsModule, ae as commonjsGlobal, S as SvelteComponentDev, i as init, s as safe_not_equal, d as dispatch_dev, g as globals, J as append_styles, y as l, M as Dialog, N as binding_callbacks, O as bind, v as validate_slots, o as onMount, A as AH, aa as afterUpdate, X as XMLToJSON, w as writable, I as beforeUpdate, K as JSONToXML, R as Button, T as Checkbox, C as validate_each_argument, e as element, f as space, h as text, j as attr_dev, a3 as null_to_empty, k as add_location, n as insert_dev, p as append_dev, F as prop_dev, E as set_data_dev, x as detach_dev, H as destroy_each, z as empty, c as create_component, m as mount_component, q as listen_dev, Y as add_flush_callback, t as transition_in, a as transition_out, b as destroy_component, G as run_all, l as set_style, B as noop } from './main-693def0f.js';

/* @license
Papa Parse
v5.0.2
https://github.com/mholt/PapaParse
License: MIT
*/

var papaparse_min = createCommonjsModule(function (module, exports) {
!function(e,t){module.exports=t();}(commonjsGlobal,function s(){var f="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==f?f:{};var n=!f.document&&!!f.postMessage,o=n&&/blob:/i.test((f.location||{}).protocol),a={},h=0,b={parse:function(e,t){var r=(t=t||{}).dynamicTyping||!1;q(r)&&(t.dynamicTypingFunction=r,r={});if(t.dynamicTyping=r,t.transform=!!q(t.transform)&&t.transform,t.worker&&b.WORKERS_SUPPORTED){var i=function(){if(!b.WORKERS_SUPPORTED)return !1;var e=(r=f.URL||f.webkitURL||null,i=s.toString(),b.BLOB_URL||(b.BLOB_URL=r.createObjectURL(new Blob(["(",i,")();"],{type:"text/javascript"})))),t=new f.Worker(e);var r,i;return t.onmessage=_,t.id=h++,a[t.id]=t}();return i.userStep=t.step,i.userChunk=t.chunk,i.userComplete=t.complete,i.userError=t.error,t.step=q(t.step),t.chunk=q(t.chunk),t.complete=q(t.complete),t.error=q(t.error),delete t.worker,void i.postMessage({input:e,config:t,workerId:i.id})}var n=null;"string"==typeof e?n=t.download?new l(t):new p(t):!0===e.readable&&q(e.read)&&q(e.on)?n=new m(t):(f.File&&e instanceof File||e instanceof Object)&&(n=new c(t));return n.stream(e)},unparse:function(e,t){var i=!1,_=!0,g=",",v="\r\n",n='"',s=n+n,r=!1,a=null;!function(){if("object"!=typeof t)return;"string"!=typeof t.delimiter||b.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(g=t.delimiter);("boolean"==typeof t.quotes||Array.isArray(t.quotes))&&(i=t.quotes);"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(r=t.skipEmptyLines);"string"==typeof t.newline&&(v=t.newline);"string"==typeof t.quoteChar&&(n=t.quoteChar);"boolean"==typeof t.header&&(_=t.header);if(Array.isArray(t.columns)){if(0===t.columns.length)throw new Error("Option columns is empty");a=t.columns;}void 0!==t.escapeChar&&(s=t.escapeChar+n);}();var o=new RegExp(U(n),"g");"string"==typeof e&&(e=JSON.parse(e));if(Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return u(null,e,r);if("object"==typeof e[0])return u(a||h(e[0]),e,r)}else if("object"==typeof e)return "string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:h(e.data[0])),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),u(e.fields||[],e.data||[],r);throw new Error("Unable to serialize unrecognized input");function h(e){if("object"!=typeof e)return [];var t=[];for(var r in e)t.push(r);return t}function u(e,t,r){var i="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var n=Array.isArray(e)&&0<e.length,s=!Array.isArray(t[0]);if(n&&_){for(var a=0;a<e.length;a++)0<a&&(i+=g),i+=y(e[a],a);0<t.length&&(i+=v);}for(var o=0;o<t.length;o++){var h=n?e.length:t[o].length,u=!1,f=n?0===Object.keys(t[o]).length:0===t[o].length;if(r&&!n&&(u="greedy"===r?""===t[o].join("").trim():1===t[o].length&&0===t[o][0].length),"greedy"===r&&n){for(var d=[],l=0;l<h;l++){var c=s?e[l]:l;d.push(t[o][c]);}u=""===d.join("").trim();}if(!u){for(var p=0;p<h;p++){0<p&&!f&&(i+=g);var m=n&&s?e[p]:p;i+=y(t[o][m],p);}o<t.length-1&&(!r||0<h&&!f)&&(i+=v);}}return i}function y(e,t){if(null==e)return "";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);e=e.toString().replace(o,s);var r="boolean"==typeof i&&i||Array.isArray(i)&&i[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return !0;return !1}(e,b.BAD_DELIMITERS)||-1<e.indexOf(g)||" "===e.charAt(0)||" "===e.charAt(e.length-1);return r?n+e+n:e}}};if(b.RECORD_SEP=String.fromCharCode(30),b.UNIT_SEP=String.fromCharCode(31),b.BYTE_ORDER_MARK="\ufeff",b.BAD_DELIMITERS=["\r","\n",'"',b.BYTE_ORDER_MARK],b.WORKERS_SUPPORTED=!n&&!!f.Worker,b.NODE_STREAM_INPUT=1,b.LocalChunkSize=10485760,b.RemoteChunkSize=5242880,b.DefaultDelimiter=",",b.Parser=E,b.ParserHandle=r,b.NetworkStreamer=l,b.FileStreamer=c,b.StringStreamer=p,b.ReadableStreamStreamer=m,f.jQuery){var d=f.jQuery;d.fn.parse=function(o){var r=o.config||{},h=[];return this.each(function(e){if(!("INPUT"===d(this).prop("tagName").toUpperCase()&&"file"===d(this).attr("type").toLowerCase()&&f.FileReader)||!this.files||0===this.files.length)return !0;for(var t=0;t<this.files.length;t++)h.push({file:this.files[t],inputElem:this,instanceConfig:d.extend({},r)});}),e(),this;function e(){if(0!==h.length){var e,t,r,i,n=h[0];if(q(o.before)){var s=o.before(n.file,n.inputElem);if("object"==typeof s){if("abort"===s.action)return e="AbortError",t=n.file,r=n.inputElem,i=s.reason,void(q(o.error)&&o.error({name:e},t,r,i));if("skip"===s.action)return void u();"object"==typeof s.config&&(n.instanceConfig=d.extend(n.instanceConfig,s.config));}else if("skip"===s)return void u()}var a=n.instanceConfig.complete;n.instanceConfig.complete=function(e){q(a)&&a(e,n.file,n.inputElem),u();},b.parse(n.file,n.instanceConfig);}else q(o.complete)&&o.complete();}function u(){h.splice(0,1),e();}};}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},function(e){var t=w(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null);this._handle=new r(t),(this._handle.streamer=this)._config=t;}.call(this,e),this.parseChunk=function(e,t){if(this.isFirstChunk&&q(this._config.beforeFirstChunk)){var r=this._config.beforeFirstChunk(e);void 0!==r&&(e=r);}this.isFirstChunk=!1,this._halted=!1;var i=this._partialLine+e;this._partialLine="";var n=this._handle.parse(i,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var s=n.meta.cursor;this._finished||(this._partialLine=i.substring(s-this._baseIndex),this._baseIndex=s),n&&n.data&&(this._rowCount+=n.data.length);var a=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(o)f.postMessage({results:n,workerId:b.WORKER_ID,finished:a});else if(q(this._config.chunk)&&!t){if(this._config.chunk(n,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);n=void 0,this._completeResults=void 0;}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(n.data),this._completeResults.errors=this._completeResults.errors.concat(n.errors),this._completeResults.meta=n.meta),this._completed||!a||!q(this._config.complete)||n&&n.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),a||n&&n.meta.paused||this._nextChunk(),n}this._halted=!0;},this._sendError=function(e){q(this._config.error)?this._config.error(e):o&&this._config.error&&f.postMessage({workerId:b.WORKER_ID,error:e,finished:!1});};}function l(e){var i;(e=e||{}).chunkSize||(e.chunkSize=b.RemoteChunkSize),u.call(this,e),this._nextChunk=n?function(){this._readChunk(),this._chunkLoaded();}:function(){this._readChunk();},this.stream=function(e){this._input=e,this._nextChunk();},this._readChunk=function(){if(this._finished)this._chunkLoaded();else {if(i=new XMLHttpRequest,this._config.withCredentials&&(i.withCredentials=this._config.withCredentials),n||(i.onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)),i.open("GET",this._input,!n),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var t in e)i.setRequestHeader(t,e[t]);}if(this._config.chunkSize){var r=this._start+this._config.chunkSize-1;i.setRequestHeader("Range","bytes="+this._start+"-"+r);}try{i.send();}catch(e){this._chunkError(e.message);}n&&0===i.status?this._chunkError():this._start+=this._config.chunkSize;}},this._chunkLoaded=function(){4===i.readyState&&(i.status<200||400<=i.status?this._chunkError():(this._finished=!this._config.chunkSize||this._start>function(e){var t=e.getResponseHeader("Content-Range");if(null===t)return -1;return parseInt(t.substr(t.lastIndexOf("/")+1))}(i),this.parseChunk(i.responseText)));},this._chunkError=function(e){var t=i.statusText||e;this._sendError(new Error(t));};}function c(e){var i,n;(e=e||{}).chunkSize||(e.chunkSize=b.LocalChunkSize),u.call(this,e);var s="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,n=e.slice||e.webkitSlice||e.mozSlice,s?((i=new FileReader).onload=y(this._chunkLoaded,this),i.onerror=y(this._chunkError,this)):i=new FileReaderSync,this._nextChunk();},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk();},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var t=Math.min(this._start+this._config.chunkSize,this._input.size);e=n.call(e,this._start,t);}var r=i.readAsText(e,this._config.encoding);s||this._chunkLoaded({target:{result:r}});},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result);},this._chunkError=function(){this._sendError(i.error);};}function p(e){var r;u.call(this,e=e||{}),this.stream=function(e){return r=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e=this._config.chunkSize,t=e?r.substr(0,e):r;return r=e?r.substr(e):"",this._finished=!r,this.parseChunk(t)}};}function m(e){u.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause();},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume();},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError);},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0);},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0;},this._streamData=y(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()));}catch(e){this._streamError(e);}},this),this._streamError=y(function(e){this._streamCleanUp(),this._sendError(e);},this),this._streamEnd=y(function(){this._streamCleanUp(),i=!0,this._streamData("");},this),this._streamCleanUp=y(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError);},this);}function r(g){var a,o,h,i=Math.pow(2,53),n=-i,s=/^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i,u=/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/,t=this,r=0,f=0,d=!1,e=!1,l=[],c={data:[],errors:[],meta:{}};if(q(g.step)){var p=g.step;g.step=function(e){if(c=e,_())m();else {if(m(),0===c.data.length)return;r+=e.data.length,g.preview&&r>g.preview?o.abort():p(c,t);}};}function v(e){return "greedy"===g.skipEmptyLines?""===e.join("").trim():1===e.length&&0===e[0].length}function m(){if(c&&h&&(k("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+b.DefaultDelimiter+"'"),h=!1),g.skipEmptyLines)for(var e=0;e<c.data.length;e++)v(c.data[e])&&c.data.splice(e--,1);return _()&&function(){if(!c)return;function e(e){q(g.transformHeader)&&(e=g.transformHeader(e)),l.push(e);}if(Array.isArray(c.data[0])){for(var t=0;_()&&t<c.data.length;t++)c.data[t].forEach(e);c.data.splice(0,1);}else c.data.forEach(e);}(),function(){if(!c||!g.header&&!g.dynamicTyping&&!g.transform)return c;function e(e,t){var r,i=g.header?{}:[];for(r=0;r<e.length;r++){var n=r,s=e[r];g.header&&(n=r>=l.length?"__parsed_extra":l[r]),g.transform&&(s=g.transform(s,n)),s=y(n,s),"__parsed_extra"===n?(i[n]=i[n]||[],i[n].push(s)):i[n]=s;}return g.header&&(r>l.length?k("FieldMismatch","TooManyFields","Too many fields: expected "+l.length+" fields but parsed "+r,f+t):r<l.length&&k("FieldMismatch","TooFewFields","Too few fields: expected "+l.length+" fields but parsed "+r,f+t)),i}var t=1;!c.data[0]||Array.isArray(c.data[0])?(c.data=c.data.map(e),t=c.data.length):c.data=e(c.data,0);g.header&&c.meta&&(c.meta.fields=l);return f+=t,c}()}function _(){return g.header&&0===l.length}function y(e,t){return r=e,g.dynamicTypingFunction&&void 0===g.dynamicTyping[r]&&(g.dynamicTyping[r]=g.dynamicTypingFunction(r)),!0===(g.dynamicTyping[r]||g.dynamicTyping)?"true"===t||"TRUE"===t||"false"!==t&&"FALSE"!==t&&(function(e){if(s.test(e)){var t=parseFloat(e);if(n<t&&t<i)return !0}return !1}(t)?parseFloat(t):u.test(t)?new Date(t):""===t?null:t):t;var r;}function k(e,t,r,i){c.errors.push({type:e,code:t,message:r,row:i});}this.parse=function(e,t,r){var i=g.quoteChar||'"';if(g.newline||(g.newline=function(e,t){e=e.substr(0,1048576);var r=new RegExp(U(t)+"([^]*?)"+U(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return "\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(e,i)),h=!1,g.delimiter)q(g.delimiter)&&(g.delimiter=g.delimiter(e),c.meta.delimiter=g.delimiter);else {var n=function(e,t,r,i,n){var s,a,o,h;n=n||[",","\t","|",";",b.RECORD_SEP,b.UNIT_SEP];for(var u=0;u<n.length;u++){var f=n[u],d=0,l=0,c=0;o=void 0;for(var p=new E({comments:i,delimiter:f,newline:t,preview:10}).parse(e),m=0;m<p.data.length;m++)if(r&&v(p.data[m]))c++;else {var _=p.data[m].length;l+=_,void 0!==o?0<_&&(d+=Math.abs(_-o),o=_):o=_;}0<p.data.length&&(l/=p.data.length-c),(void 0===a||d<=a)&&(void 0===h||h<l)&&1.99<l&&(a=d,s=f,h=l);}return {successful:!!(g.delimiter=s),bestDelimiter:s}}(e,g.newline,g.skipEmptyLines,g.comments,g.delimitersToGuess);n.successful?g.delimiter=n.bestDelimiter:(h=!0,g.delimiter=b.DefaultDelimiter),c.meta.delimiter=g.delimiter;}var s=w(g);return g.preview&&g.header&&s.preview++,a=e,o=new E(s),c=o.parse(a,t,r),m(),d?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return d},this.pause=function(){d=!0,o.abort(),a=a.substr(o.getCharIndex());},this.resume=function(){t.streamer._halted?(d=!1,t.streamer.parseChunk(a,!0)):setTimeout(this.resume,3);},this.aborted=function(){return e},this.abort=function(){e=!0,o.abort(),c.meta.aborted=!0,q(g.complete)&&g.complete(c),a="";};}function U(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function E(e){var O,D=(e=e||{}).delimiter,I=e.newline,T=e.comments,A=e.step,L=e.preview,F=e.fastMode,z=O=void 0===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(z=e.escapeChar),("string"!=typeof D||-1<b.BAD_DELIMITERS.indexOf(D))&&(D=","),T===D)throw new Error("Comment character same as delimiter");!0===T?T="#":("string"!=typeof T||-1<b.BAD_DELIMITERS.indexOf(T))&&(T=!1),"\n"!==I&&"\r"!==I&&"\r\n"!==I&&(I="\n");var M=0,j=!1;this.parse=function(a,r,t){if("string"!=typeof a)throw new Error("Input must be a string");var i=a.length,e=D.length,n=I.length,s=T.length,o=q(A),h=[],u=[],f=[],d=M=0;if(!a)return R();if(F||!1!==F&&-1===a.indexOf(O)){for(var l=a.split(I),c=0;c<l.length;c++){if(f=l[c],M+=f.length,c!==l.length-1)M+=I.length;else if(t)return R();if(!T||f.substr(0,s)!==T){if(o){if(h=[],b(f.split(D)),S(),j)return R()}else b(f.split(D));if(L&&L<=c)return h=h.slice(0,L),R(!0)}}return R()}for(var p=a.indexOf(D,M),m=a.indexOf(I,M),_=new RegExp(U(z)+U(O),"g"),g=a.indexOf(O,M);;)if(a[M]!==O)if(T&&0===f.length&&a.substr(M,s)===T){if(-1===m)return R();M=m+n,m=a.indexOf(I,M),p=a.indexOf(D,M);}else {if(-1!==p&&(p<m||-1===m)){if(-1===g){f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}var v=x(p,g,m);if(v&&void 0!==v.nextDelim){p=v.nextDelim,g=v.quoteSearch,f.push(a.substring(M,p)),M=p+e,p=a.indexOf(D,M);continue}}if(-1===m)break;if(f.push(a.substring(M,m)),C(m+n),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0)}else for(g=M,M++;;){if(-1===(g=a.indexOf(O,g+1)))return t||u.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:h.length,index:M}),w();if(g===i-1)return w(a.substring(M,g).replace(_,O));if(O!==z||a[g+1]!==z){if(O===z||0===g||a[g-1]!==z){var y=E(-1===m?p:Math.min(p,m));if(a[g+1+y]===D){f.push(a.substring(M,g).replace(_,O)),a[M=g+1+y+e]!==O&&(g=a.indexOf(O,M)),p=a.indexOf(D,M),m=a.indexOf(I,M);break}var k=E(m);if(a.substr(g+1+k,n)===I){if(f.push(a.substring(M,g).replace(_,O)),C(g+1+k+n),p=a.indexOf(D,M),g=a.indexOf(O,M),o&&(S(),j))return R();if(L&&h.length>=L)return R(!0);break}u.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:h.length,index:M}),g++;}}else g++;}return w();function b(e){h.push(e),d=M;}function E(e){var t=0;if(-1!==e){var r=a.substring(g+1,e);r&&""===r.trim()&&(t=r.length);}return t}function w(e){return t||(void 0===e&&(e=a.substr(M)),f.push(e),M=i,b(f),o&&S()),R()}function C(e){M=e,b(f),f=[],m=a.indexOf(I,M);}function R(e,t){return {data:t||!1?h[0]:h,errors:u,meta:{delimiter:D,linebreak:I,aborted:j,truncated:!!e,cursor:d+(r||0)}}}function S(){A(R(void 0,!0)),h=[],u=[];}function x(e,t,r){var i={nextDelim:void 0,quoteSearch:void 0},n=a.indexOf(O,t+1);if(t<e&&e<n&&(n<r||-1===r)){var s=a.indexOf(D,n);if(-1===s)return i;n<s&&(n=a.indexOf(O,n+1)),i=x(s,n,r);}else i={nextDelim:e,quoteSearch:t};return i}},this.abort=function(){j=!0;},this.getCharIndex=function(){return M};}function _(e){var t=e.data,r=a[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var n={abort:function(){i=!0,g(t.workerId,{data:[],errors:[],meta:{aborted:!0}});},pause:v,resume:v};if(q(r.userStep)){for(var s=0;s<t.results.data.length&&(r.userStep({data:t.results.data[s],errors:t.results.errors,meta:t.results.meta},n),!i);s++);delete t.results;}else q(r.userChunk)&&(r.userChunk(t.results,n,t.file),delete t.results);}t.finished&&!i&&g(t.workerId,t.results);}function g(e,t){var r=a[e];q(r.userComplete)&&r.userComplete(t),r.terminate(),delete a[e];}function v(){throw new Error("Not implemented.")}function w(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=w(e[r]);return t}function y(e,t){return function(){e.apply(t,arguments);}}function q(e){return "function"==typeof e}return o&&(f.onmessage=function(e){var t=e.data;void 0===b.WORKER_ID&&t&&(b.WORKER_ID=t.workerId);if("string"==typeof t.input)f.postMessage({workerId:b.WORKER_ID,results:b.parse(t.input,t.config),finished:!0});else if(f.File&&t.input instanceof File||t.input instanceof Object){var r=b.parse(t.input,t.config);r&&f.postMessage({workerId:b.WORKER_ID,results:r,finished:!0});}}),(l.prototype=Object.create(u.prototype)).constructor=l,(c.prototype=Object.create(u.prototype)).constructor=c,(p.prototype=Object.create(p.prototype)).constructor=p,(m.prototype=Object.create(u.prototype)).constructor=m,b});
});

/* clsSMList\ListAuthoring.svelte generated by Svelte v3.40.2 */

const { console: console_1 } = globals;
const file = "clsSMList\\ListAuthoring.svelte";

function add_css(target) {
	append_styles(target, "svelte-uyfhy5", ".height20.svelte-uyfhy5{height:20px !important}.width125.svelte-uyfhy5{width:125px}.width80.svelte-uyfhy5{width:80px}.min_wid_95.svelte-uyfhy5{min-width:95px}.width_max_content.svelte-uyfhy5{width:max-content}.font17.svelte-uyfhy5{font-size:15px!important}.custom_checkbox_new.svelte-uyfhy5{display:block;position:relative;width:20px;height:20px;margin-bottom:0;cursor:pointer;font-size:18px}.width27.svelte-uyfhy5{width:27px}.height27.svelte-uyfhy5{height:27px !important}.width65.svelte-uyfhy5{width:65px}td.svelte-uyfhy5{text-align:center}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTGlzdEF1dGhvcmluZy5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBcXlCUSxTQUFTLGNBQUUsQ0FBQyxBQUNSLE1BQU0sQ0FBRSxJQUFJLENBQUMsVUFBVSxBQUMzQixDQUFDLEFBQ0QsU0FBUyxjQUFDLENBQUMsQUFDUCxLQUFLLENBQUUsS0FBSyxBQUNoQixDQUFDLEFBQ0QsUUFBUSxjQUFFLENBQUMsQUFDUCxLQUFLLENBQUUsSUFBSSxBQUNmLENBQUMsQUFDRCxXQUFXLGNBQUUsQ0FBQyxBQUNWLFVBQVUsSUFBSSxBQUNsQixDQUFDLEFBQ0Qsa0JBQWtCLGNBQUMsQ0FBQyxBQUNoQixLQUFLLENBQUUsV0FBVyxBQUN0QixDQUFDLEFBQ0QsT0FBTyxjQUFDLENBQUMsQUFDTixTQUFTLENBQUUsSUFBSSxVQUFVLEFBQzVCLENBQUMsQUFFRCxvQkFBb0IsY0FBQyxDQUFDLEFBQ2xCLE9BQU8sQ0FBRSxLQUFLLENBQ2QsUUFBUSxDQUFFLFFBQVEsQ0FDbEIsS0FBSyxDQUFFLElBQUksQ0FDWCxNQUFNLENBQUUsSUFBSSxDQUNaLGFBQWEsQ0FBRSxDQUFDLENBQ2hCLE1BQU0sQ0FBRSxPQUFPLENBQ2YsU0FBUyxDQUFFLElBQUksQUFDbkIsQ0FBQyxBQUNELFFBQVEsY0FBQyxDQUFDLEFBQ04sS0FBSyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUQsU0FBUyxjQUFFLENBQUMsQUFDUixNQUFNLENBQUUsSUFBSSxDQUFDLFVBQVUsQUFDM0IsQ0FBQyxBQUNELFFBQVEsY0FBRSxDQUFDLEFBQ1AsS0FBSyxDQUFFLElBQUksQUFDZixDQUFDLEFBRUQsRUFBRSxjQUFDLENBQUMsQUFDQSxVQUFVLENBQUUsTUFBTSxBQUN0QixDQUFDIiwibmFtZXMiOltdLCJzb3VyY2VzIjpbIkxpc3RBdXRob3Jpbmcuc3ZlbHRlIl19 */");
}

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[6] = list[i];
	child_ctx[42] = i;
	return child_ctx;
}

// (689:24) {#if state.data_cdata}
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
			b3.textContent = `${l.action_txt}`;
			t8 = space();

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(input, "type", "checkbox");
			attr_dev(input, "name", "checkall");
			attr_dev(input, "rel", "chk_1");
			attr_dev(input, "class", input_class_value = "" + (null_to_empty("mr-3 mt-1 custom_checkbox_new float-left uc_checkbox checkall mng_track_checkbox mt-sm2 m-r" + (/*child_generated*/ ctx[1] ? ' pointer_event_none' : '')) + " svelte-uyfhy5"));
			input.disabled = /*child_generated*/ ctx[1];
			add_location(input, file, 694, 48, 35735);
			attr_dev(b0, "class", "font17 svelte-uyfhy5");
			add_location(b0, file, 695, 67, 36035);
			attr_dev(span0, "class", "mr-2");
			add_location(span0, file, 695, 48, 36016);
			attr_dev(span1, "class", "d-inline-block p-0");
			attr_dev(span1, "data-bs-toggle", "tooltip");
			attr_dev(span1, "data-bs-placement", "top");
			attr_dev(span1, "title", span1_title_value = /*child_generated*/ ctx[1] ? l.child_not_generated : '');
			add_location(span1, file, 693, 44, 35547);
			attr_dev(th0, "class", "width80 text-center align-middle svelte-uyfhy5");
			add_location(th0, file, 692, 40, 35456);
			attr_dev(b1, "class", "font17 svelte-uyfhy5");
			add_location(b1, file, 699, 44, 36321);
			attr_dev(th1, "class", "min_wid_95 width_max_content max_width_300 align-middle svelte-uyfhy5");
			add_location(th1, file, 698, 40, 36207);
			attr_dev(b2, "class", "font17 svelte-uyfhy5");
			add_location(b2, file, 702, 44, 36570);
			attr_dev(th2, "class", "min_wid_95 width_max_content max_width_300 align-middle svelte-uyfhy5");
			add_location(th2, file, 701, 40, 36456);
			attr_dev(b3, "class", "font17 svelte-uyfhy5");
			add_location(b3, file, 705, 44, 36796);
			attr_dev(th3, "class", "width65 text-center align-middle svelte-uyfhy5");
			add_location(th3, file, 704, 40, 36705);
			add_location(tr, file, 691, 36, 35410);
			attr_dev(table, "class", "table clearfix mx-0");
			attr_dev(table, "id", "csv_data_table");
			add_location(table, file, 690, 32, 35317);
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
			if (dirty[0] & /*child_generated*/ 2 && input_class_value !== (input_class_value = "" + (null_to_empty("mr-3 mt-1 custom_checkbox_new float-left uc_checkbox checkall mng_track_checkbox mt-sm2 m-r" + (/*child_generated*/ ctx[1] ? ' pointer_event_none' : '')) + " svelte-uyfhy5"))) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty[0] & /*child_generated*/ 2) {
				prop_dev(input, "disabled", /*child_generated*/ ctx[1]);
			}

			if (dirty[0] & /*child_generated*/ 2 && span1_title_value !== (span1_title_value = /*child_generated*/ ctx[1] ? l.child_not_generated : '')) {
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
		source: "(689:24) {#if state.data_cdata}",
		ctx
	});

	return block;
}

// (713:44) {#if index > 0}
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

	let t1_value = (/*index*/ ctx[42] < 10
	? '0' + /*index*/ ctx[42]
	: /*index*/ ctx[42]) + "";

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
	let span1_title_value;
	let button_class_value;
	let button_name_value;
	let button_id_value;
	let button_disabled_value;
	let t7;
	let mounted;
	let dispose;

	function click_handler() {
		return /*click_handler*/ ctx[17](/*index*/ ctx[42]);
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
			attr_dev(input, "class", input_class_value = "" + (null_to_empty("mr-2 mt-1 custom_checkbox_new float-left select_editable_guid" + (/*object_data*/ ctx[6].cg ? '' : ' pointer_event_none')) + " svelte-uyfhy5"));
			attr_dev(input, "target-guid", input_target_guid_value = /*object_data*/ ctx[6].cg);
			input.disabled = input_disabled_value = /*object_data*/ ctx[6].cg ? false : true;
			add_location(input, file, 716, 60, 37605);
			attr_dev(div, "class", "inline-block btn-secondary btn-circle rounded-circle width27 height27 font12 text-center p-1 btn-sm square svelte-uyfhy5");
			add_location(div, file, 717, 60, 37884);
			attr_dev(span0, "class", "d-inline-block p-0");
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "title", span0_title_value = /*object_data*/ ctx[6].cg ? '' : l.child_not_generated);
			attr_dev(span0, "data-bs-placement", "right");
			add_location(span0, file, 715, 56, 37404);
			attr_dev(td0, "class", "width80 text-center align-middle svelte-uyfhy5");
			add_location(td0, file, 714, 52, 37301);
			attr_dev(td1, "id", td1_id_value = "col_" + /*index*/ ctx[42] + "_" + 0);
			attr_dev(td1, "contenteditable", "true");
			attr_dev(td1, "class", "min_wid_95 width_max_content max_width_300 word-wrap-break align-middle svelte-uyfhy5");
			add_location(td1, file, 720, 52, 38226);
			attr_dev(td2, "id", td2_id_value = "col_" + /*index*/ ctx[42] + "_" + 1);
			attr_dev(td2, "contenteditable", "true");
			attr_dev(td2, "class", "min_wid_95 width_max_content max_width_300 word-wrap-break align-middle svelte-uyfhy5");
			add_location(td2, file, 721, 52, 38459);
			attr_dev(span1, "class", "icomoon icomoon-24px-delete-1 s4");
			attr_dev(span1, "data-bs-toggle", "tooltip");
			attr_dev(span1, "data-bs-placement", "top");

			attr_dev(span1, "title", span1_title_value = /*object_data*/ ctx[6].cg
			? l.deletion_not_allowed
			: l.del_row);

			add_location(span1, file, 725, 64, 39164);
			attr_dev(button, "class", button_class_value = "" + (null_to_empty("btn" + (/*object_data*/ ctx[6].cg ? ' pointer_event_none' : '')) + " svelte-uyfhy5"));
			attr_dev(button, "name", button_name_value = "delete_elm" + /*index*/ ctx[42]);
			attr_dev(button, "id", button_id_value = "delete_elm" + /*index*/ ctx[42]);
			button.disabled = button_disabled_value = /*object_data*/ ctx[6].cg ? true : false;
			add_location(button, file, 724, 60, 38891);
			attr_dev(span2, "class", "d-inline-block ml-2");
			add_location(span2, file, 723, 56, 38795);
			attr_dev(td3, "class", "width65 text-center align-middle svelte-uyfhy5");
			add_location(td3, file, 722, 52, 38692);
			add_location(tr, file, 713, 48, 37243);
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

			if (dirty[0] & /*state*/ 1 && input_class_value !== (input_class_value = "" + (null_to_empty("mr-2 mt-1 custom_checkbox_new float-left select_editable_guid" + (/*object_data*/ ctx[6].cg ? '' : ' pointer_event_none')) + " svelte-uyfhy5"))) {
				attr_dev(input, "class", input_class_value);
			}

			if (dirty[0] & /*state*/ 1 && input_target_guid_value !== (input_target_guid_value = /*object_data*/ ctx[6].cg)) {
				attr_dev(input, "target-guid", input_target_guid_value);
			}

			if (dirty[0] & /*state*/ 1 && input_disabled_value !== (input_disabled_value = /*object_data*/ ctx[6].cg ? false : true)) {
				prop_dev(input, "disabled", input_disabled_value);
			}

			if (dirty[0] & /*state*/ 1 && span0_title_value !== (span0_title_value = /*object_data*/ ctx[6].cg ? '' : l.child_not_generated)) {
				attr_dev(span0, "title", span0_title_value);
			}

			if (dirty[0] & /*state*/ 1 && t3_value !== (t3_value = /*object_data*/ ctx[6].c1 + "")) set_data_dev(t3, t3_value);
			if (dirty[0] & /*state*/ 1 && t5_value !== (t5_value = /*object_data*/ ctx[6].c2 + "")) set_data_dev(t5, t5_value);

			if (dirty[0] & /*state*/ 1 && span1_title_value !== (span1_title_value = /*object_data*/ ctx[6].cg
			? l.deletion_not_allowed
			: l.del_row)) {
				attr_dev(span1, "title", span1_title_value);
			}

			if (dirty[0] & /*state*/ 1 && button_class_value !== (button_class_value = "" + (null_to_empty("btn" + (/*object_data*/ ctx[6].cg ? ' pointer_event_none' : '')) + " svelte-uyfhy5"))) {
				attr_dev(button, "class", button_class_value);
			}

			if (dirty[0] & /*state*/ 1 && button_disabled_value !== (button_disabled_value = /*object_data*/ ctx[6].cg ? true : false)) {
				prop_dev(button, "disabled", button_disabled_value);
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
		source: "(713:44) {#if index > 0}",
		ctx
	});

	return block;
}

// (710:40) {#each state.data_cdata as object_data, index}
function create_each_block(ctx) {
	let if_block_anchor;
	let if_block = /*index*/ ctx[42] > 0 && create_if_block_1(ctx);

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
			if (/*index*/ ctx[42] > 0) if_block.p(ctx, dirty);
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
		source: "(710:40) {#each state.data_cdata as object_data, index}",
		ctx
	});

	return block;
}

// (773:8) <Dialog                          bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}}                          style={'width:500px;'}                      >
function create_default_slot_1(ctx) {
	let div0;
	let t1;
	let div2;
	let div1;
	let span;
	let span_style_value;

	const block = {
		c: function create() {
			div0 = element("div");
			div0.textContent = `${l.save_header}`;
			t1 = space();
			div2 = element("div");
			div1 = element("div");
			span = element("span");
			span.textContent = `${l.child_update}`;
			set_style(div0, "font-weight", "bold");
			add_location(div0, file, 776, 24, 41632);
			attr_dev(span, "class", "col-md-12");
			attr_dev(span, "style", span_style_value = 'margin-top:40px;margin-bottom:40px;');
			add_location(span, file, 779, 28, 41792);
			attr_dev(div1, "class", "row");
			add_location(div1, file, 778, 28, 41745);
			add_location(div2, file, 777, 24, 41710);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div0, anchor);
			insert_dev(target, t1, anchor);
			insert_dev(target, div2, anchor);
			append_dev(div2, div1);
			append_dev(div1, span);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(div0);
			if (detaching) detach_dev(t1);
			if (detaching) detach_dev(div2);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_default_slot_1.name,
		type: "slot",
		source: "(773:8) <Dialog                          bind:visible={state.EditorModalBox} on:close={() => {state.EditorModalBox = false}}                          style={'width:500px;'}                      >",
		ctx
	});

	return block;
}

// (789:28) <Button variant="contained" on:click={()=>{handleUpdate(row_no)}}                                  class="bg-primary text-white" id="okDialog">
function create_default_slot(ctx) {
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
		id: create_default_slot.name,
		type: "slot",
		source: "(789:28) <Button variant=\\\"contained\\\" on:click={()=>{handleUpdate(row_no)}}                                  class=\\\"bg-primary text-white\\\" id=\\\"okDialog\\\">",
		ctx
	});

	return block;
}

// (785:24) 
function create_footer_slot(ctx) {
	let div;
	let input;
	let t;
	let button;
	let current;
	let mounted;
	let dispose;

	button = new Button({
			props: {
				variant: "contained",
				class: "bg-primary text-white",
				id: "okDialog",
				$$slots: { default: [create_default_slot] },
				$$scope: { ctx }
			},
			$$inline: true
		});

	button.$on("click", /*click_handler_2*/ ctx[19]);

	const block = {
		c: function create() {
			div = element("div");
			input = element("input");
			t = space();
			create_component(button.$$.fragment);
			attr_dev(input, "type", "button");
			attr_dev(input, "variant", "contained");
			attr_dev(input, "class", "btn btn-light colorgray");
			input.value = "No";
			add_location(input, file, 786, 28, 42107);
			attr_dev(div, "slot", "footer");
			attr_dev(div, "class", "svelteFooter");
			add_location(div, file, 784, 24, 42007);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, input);
			append_dev(div, t);
			mount_component(button, div, null);
			current = true;

			if (!mounted) {
				dispose = listen_dev(input, "click", /*click_handler_1*/ ctx[18], false, false, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const button_changes = {};

			if (dirty[1] & /*$$scope*/ 4096) {
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
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_footer_slot.name,
		type: "slot",
		source: "(785:24) ",
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
	let t0_value = /*state*/ ctx[0].counter + '/' + (/*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata.length - 1) + "";
	let t0;
	let div0_style_value;
	let t1;
	let div2;
	let span0;
	let button0;
	let t2_value = l.import_csv + "";
	let t2;
	let button0_class_value;
	let span0_title_value;
	let t3;
	let input;
	let t4;
	let span1;
	let button1;

	let t5_value = (/*handle_generate*/ ctx[5]
	? l.generate_item
	: /*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata[1].cg
		? l.update_item
		: l.generate_item) + "";

	let t5;
	let button1_class_value;
	let span1_title_value;
	let t6;
	let span2;
	let button2;

	let t7_value = (/*state*/ ctx[0].selected_length > 0
	? l.show_all_label + ' (' + /*state*/ ctx[0].selected_length + ')'
	: l.show_all_label) + "";

	let t7;
	let button2_class_value;
	let button2_disabled_value;
	let span2_title_value;
	let t8;
	let t9;
	let button3;
	let t10_value = l.add_option + "";
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
		/*dialog_visible_binding*/ ctx[20](value);
	}

	let dialog_props = {
		style: 'width:500px;',
		$$slots: {
			footer: [create_footer_slot],
			default: [create_default_slot_1]
		},
		$$scope: { ctx }
	};

	if (/*state*/ ctx[0].EditorModalBox !== void 0) {
		dialog_props.visible = /*state*/ ctx[0].EditorModalBox;
	}

	dialog = new Dialog({ props: dialog_props, $$inline: true });
	binding_callbacks.push(() => bind(dialog, 'visible', dialog_visible_binding));
	dialog.$on("close", /*close_handler*/ ctx[21]);

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
			add_location(b, file, 673, 159, 33096);
			attr_dev(div0, "class", "progress-bar bg-success progress-bar-striped progress-bar-animated font-weight-bolder");
			attr_dev(div0, "style", div0_style_value = "width:" + /*progress_data*/ ctx[4]);
			add_location(div0, file, 673, 28, 32965);
			attr_dev(div1, "id", "warning_label_container");
			attr_dev(div1, "class", "progress w-100 h my-2 height20 svelte-uyfhy5");
			add_location(div1, file, 672, 24, 32862);
			attr_dev(button0, "class", button0_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_disable*/ ctx[3] ? " pointer_event_none" : "")) + " svelte-uyfhy5"));
			attr_dev(button0, "data-cy", "import_csv_btn");
			attr_dev(button0, "name", "import_csv_btn");
			button0.disabled = /*handle_disable*/ ctx[3];
			add_location(button0, file, 677, 32, 33448);
			attr_dev(span0, "class", "d-inline-block");
			attr_dev(span0, "data-bs-toggle", "tooltip");
			attr_dev(span0, "data-bs-placement", "top");

			attr_dev(span0, "title", span0_title_value = /*handle_disable*/ ctx[3]
			? l.new_not_allowed
			: l.csv_file);

			add_location(span0, file, 676, 28, 33277);
			attr_dev(input, "id", "fileUpload");
			attr_dev(input, "type", "file");
			attr_dev(input, "class", "upload h");
			add_location(input, file, 679, 28, 33725);
			attr_dev(button1, "class", button1_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_generate*/ ctx[5] ? ' pointer_event_none' : '')) + " svelte-uyfhy5"));
			attr_dev(button1, "name", "generate_question_btn");
			attr_dev(button1, "id", "generate_question_btn");
			button1.disabled = /*handle_generate*/ ctx[5];
			add_location(button1, file, 681, 32, 34125);
			attr_dev(span1, "class", "d-inline-block ml-2");
			attr_dev(span1, "data-cy", "generate_question_btn");
			attr_dev(span1, "data-bs-toggle", "tooltip");
			attr_dev(span1, "data-bs-placement", "top");

			attr_dev(span1, "title", span1_title_value = /*handle_generate*/ ctx[5]
			? /*handle_disable*/ ctx[3]
				? l.already_generated
				: l.save_war_msg
			: /*handle_disable*/ ctx[3]
				? l.new_row_tooltip
				: l.generate_items);

			add_location(span1, file, 680, 28, 33831);

			attr_dev(button2, "class", button2_class_value = "" + (null_to_empty("btn btn-primary btn-md width125" + (/*state*/ ctx[0].handle_disable_show
			? " pointer_event_none"
			: "")) + " svelte-uyfhy5"));

			attr_dev(button2, "name", "show_all_child");
			attr_dev(button2, "data-cy", "show_all_child");
			attr_dev(button2, "id", "show_all_child");
			button2.disabled = button2_disabled_value = /*state*/ ctx[0].handle_disable_show;
			add_location(button2, file, 684, 32, 34759);
			attr_dev(span2, "class", "d-inline-block ml-2");
			attr_dev(span2, "data-bs-toggle", "tooltip");
			attr_dev(span2, "data-bs-placement", "top");

			attr_dev(span2, "title", span2_title_value = /*state*/ ctx[0].handle_disable_show
			? /*handle_disable*/ ctx[3]
				? l.child_not_selected
				: l.child_not_generated
			: l.show_all);

			add_location(span2, file, 683, 28, 34525);
			add_location(div2, file, 675, 24, 33242);
			attr_dev(button3, "data-bs-toggle", "tooltip");
			attr_dev(button3, "data-bs-placement", "top");
			attr_dev(button3, "title", button3_title_value = l.add_child);
			attr_dev(button3, "class", "btn btn-primary btn-md mt-2");
			attr_dev(button3, "name", "Add_row");
			attr_dev(button3, "id", "Add_row");
			add_location(button3, file, 737, 24, 39858);
			attr_dev(div3, "class", "col-12");
			add_location(div3, file, 671, 20, 32816);
			attr_dev(div4, "class", "row");
			add_location(div4, file, 670, 16, 32777);
			attr_dev(div5, "class", "container");
			add_location(div5, file, 669, 12, 32736);
			attr_dev(div6, "id", "authoring_container");
			attr_dev(div6, "class", "container w-100 px-3 py-3");
			add_location(div6, file, 668, 8, 32658);
			add_location(div7, file, 667, 4, 32643);
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
			if ((!current || dirty[0] & /*state*/ 1) && t0_value !== (t0_value = /*state*/ ctx[0].counter + '/' + (/*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata.length - 1) + "")) set_data_dev(t0, t0_value);

			if (!current || dirty[0] & /*progress_data*/ 16 && div0_style_value !== (div0_style_value = "width:" + /*progress_data*/ ctx[4])) {
				attr_dev(div0, "style", div0_style_value);
			}

			if (!current || dirty[0] & /*handle_disable*/ 8 && button0_class_value !== (button0_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_disable*/ ctx[3] ? " pointer_event_none" : "")) + " svelte-uyfhy5"))) {
				attr_dev(button0, "class", button0_class_value);
			}

			if (!current || dirty[0] & /*handle_disable*/ 8) {
				prop_dev(button0, "disabled", /*handle_disable*/ ctx[3]);
			}

			if (!current || dirty[0] & /*handle_disable*/ 8 && span0_title_value !== (span0_title_value = /*handle_disable*/ ctx[3]
			? l.new_not_allowed
			: l.csv_file)) {
				attr_dev(span0, "title", span0_title_value);
			}

			if ((!current || dirty[0] & /*handle_generate, state*/ 33) && t5_value !== (t5_value = (/*handle_generate*/ ctx[5]
			? l.generate_item
			: /*state*/ ctx[0].data_cdata && /*state*/ ctx[0].data_cdata[1].cg
				? l.update_item
				: l.generate_item) + "")) set_data_dev(t5, t5_value);

			if (!current || dirty[0] & /*handle_generate*/ 32 && button1_class_value !== (button1_class_value = "" + (null_to_empty("btn btn-primary btn-md" + (/*handle_generate*/ ctx[5] ? ' pointer_event_none' : '')) + " svelte-uyfhy5"))) {
				attr_dev(button1, "class", button1_class_value);
			}

			if (!current || dirty[0] & /*handle_generate*/ 32) {
				prop_dev(button1, "disabled", /*handle_generate*/ ctx[5]);
			}

			if (!current || dirty[0] & /*handle_generate, handle_disable*/ 40 && span1_title_value !== (span1_title_value = /*handle_generate*/ ctx[5]
			? /*handle_disable*/ ctx[3]
				? l.already_generated
				: l.save_war_msg
			: /*handle_disable*/ ctx[3]
				? l.new_row_tooltip
				: l.generate_items)) {
				attr_dev(span1, "title", span1_title_value);
			}

			if ((!current || dirty[0] & /*state*/ 1) && t7_value !== (t7_value = (/*state*/ ctx[0].selected_length > 0
			? l.show_all_label + ' (' + /*state*/ ctx[0].selected_length + ')'
			: l.show_all_label) + "")) set_data_dev(t7, t7_value);

			if (!current || dirty[0] & /*state*/ 1 && button2_class_value !== (button2_class_value = "" + (null_to_empty("btn btn-primary btn-md width125" + (/*state*/ ctx[0].handle_disable_show
			? " pointer_event_none"
			: "")) + " svelte-uyfhy5"))) {
				attr_dev(button2, "class", button2_class_value);
			}

			if (!current || dirty[0] & /*state*/ 1 && button2_disabled_value !== (button2_disabled_value = /*state*/ ctx[0].handle_disable_show)) {
				prop_dev(button2, "disabled", button2_disabled_value);
			}

			if (!current || dirty[0] & /*state, handle_disable*/ 9 && span2_title_value !== (span2_title_value = /*state*/ ctx[0].handle_disable_show
			? /*handle_disable*/ ctx[3]
				? l.child_not_selected
				: l.child_not_generated
			: l.show_all)) {
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

			if (dirty[0] & /*row_no, state*/ 5 | dirty[1] & /*$$scope*/ 4096) {
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
	document.querySelector('#fileUpload').click();
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots('ListAuthoring', slots, []);
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

	//////////////// Described states////////////
	let stateData = writable({
		xml: '',
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
		maxWidth: 'sm'
	};

	const unsubscribe = stateData.subscribe(items => {
		$$invalidate(0, state = items);
	});

	let handle_disable = false;
	let progress_data = '';
	let handle_generate;

	onMount(() => {
		AH.listen(document, 'click', '.checkall', function (_this) {
			let chk = _this.checked;
			AH.selectAll('table.table input[type=checkbox]:enabled,.sticky-col input[type=checkbox]:enabled,.sticky-intersect input[type=checkbox]:enabled', 'checked', chk);
			AH.select(_this, 'attr', chk);
		});

		// used to show the tooltip
		AH.enableBsAll("[data-bs-toggle='tooltip']", 'Tooltip', { container: 'body' });

		// });
		AH.listen(document, 'change', '.checkall', _this => {
			AH.selectAll('.select_editable_guid', { checked: _this.getAttribute("checked") });
		});

		AH.listen(document, 'change', '.checkall, .select_editable_guid', function () {
			let selected_length = AH.select('.select_editable_guid', 'checked').length;

			if (selected_length > 0) {
				$$invalidate(0, state.handle_disable_show = false, state);
				$$invalidate(0, state.selected_length = selected_length, state);
			} else {
				$$invalidate(0, state.handle_disable_show = true, state);
				$$invalidate(0, state.selected_length = 0, state);
			}
		});

		AH.listen(document, 'click', '#okDialog', function () {
			$$invalidate(0, state.EditorModalBox = false, state);
		});
	});

	afterUpdate(() => {
		if (xml != state.xml) {
			$$invalidate(0, state.xml = xml, state);
			loadModule(xml);
		}

		if (editorState.guid && state.data_cdata && state.data_cdata[0].pg == '') {
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
		$$invalidate(2, row_no = target_id.split('_')[1]);

		// finds the column no in which changes made
		let col_no = target_id.split('_')[2];

		// contains previous column value
		let previous_data;

		// updates the respective column value according to change in column value
		col_no == 0
		? (previous_data = state.data_cdata[row_no].c1, $$invalidate(0, state.data_cdata[row_no].c1 = document.querySelector('#' + target_id).innerText, state))
		: (previous_data = state.data_cdata[row_no].c2, $$invalidate(0, state.data_cdata[row_no].c2 = document.querySelector('#' + target_id).innerText, state));

		// updates the xml
		updateXML(JSON.stringify({ "list": state.data_cdata }));

		if (state.data_cdata[row_no].cg && (col_no == 0
		? previous_data != state.data_cdata[row_no].c1
		: previous_data != state.data_cdata[row_no].c2)) {
			//Remove some uncessasry code
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

					let algo_xml_data = AH.get('algo_var_data');
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
					question_obj.title = document.querySelector('#title').innerHTML + ': ' + state.data_cdata[current_row_val].c1;

					// sets the question data for guid
					question_obj.question = state.data_cdata[current_row_val].c1;

					// request for get the guid
					updateXML(state.xml.smxml._disabled_generate);

					AH.ajax({
						type: "post",
						url: baseUrl + 'editor/index.php',
						longData: true,
						data: {
							str_content: JSON.stringify(question_obj),
							func: "get_guid_from_api",
							snippet: document.querySelector('#title').innerHTML + ': ' + state.data_cdata[current_row_val].c1
						},
						onEnd() {
							AH.activate(0);
						}
					}).then(function (response) {
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
		if (state.data_cdata.length >= 6) {
			// removes the respective row from xml
			state.data_cdata.splice(index_no, 1);
		} else {
			AH.showmsg(l.min4_rows_allowed, 4000);
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
					let algo_xml_data1 = AH.get('algo_var_data');
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
					AH.ajax({
						type: "post",
						url: baseUrl + 'editor/index.php',
						longData: true,
						data: {
							str_content: JSON.stringify(question_obj), // data in the form of object for update the guid
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
							//AH.activate(0);
							// shows the warning message
							AH && AH.showmsg(l.child_updated);
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
		AH.activate(2);

		for (let index_no = 0; index_no < state.data_cdata.length; index_no += 1) {
			if (index_no != 0) {
				if (used_in.indexOf(state.data_cdata[index_no].cg) > -1) {
					// updates that rows current_guid which contains argument current_guid data in their "used_in_guids" array
					let received_data = await updateRelatedGuids(index_no, state.data_cdata[index_no].cg, parent_guid, state.data_cdata[index_no].rn, state.data_cdata[index_no].ag);

					if (!received_data) {
						AH.showmsg(l.check_net_update_ids, 4000);
						AH.activate(0);
						break;
					}
				}

				if (index_no == state.data_cdata.length - 1) {
					// update the guid store in argument current_guid
					let received_data1 = await ajaxRequestForDataUpdate(rowNo, current_guid, created_with_rows, parent_guid, true);

					if (!received_data1) {
						AH.showmsg(l.check_net_update_ids, 4000);
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
		// used for defined the title of child items
		// state.xml.smxml._pt = $('#title').html();
		$$invalidate(0, state.xml.smxml._pt = document.querySelector('#title').innerHTML, state);

		// used for enabled the Generate/Update Items button
		$$invalidate(0, state.xml.smxml._disabled_generate = 0, state);

		// sets the parent guid for each row
		for (let key in state.data_cdata) {
			$$invalidate(0, state.data_cdata[key].pg = guid_data, state);
		}

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
			AI.select('#warning_label_container', 'removeClass', 'h');

			// not allowed user to perform any operation
			//jQuery('#authoring_container').css('pointer-events', 'none');
			AH.setCss('#authoring_container', { 'pointer-events': 'none' });

			for (let index_no = 0; index_no < state.data_cdata.length; index_no += 1) {
				if (index_no != 0 && state.data_cdata[index_no].cg == '') {
					// called for generate the guid for each row
					let guid_data = await generateItems(state.data_cdata[index_no].pg, index_no);

					if (typeof guid_data == 'undefined' || !guid_data) {
						is_failed = true;

						// shows warning message
						AH.showmsg(l.check_network, 4000);

						// used for enabled the Generate/Update Items button
						$$invalidate(0, state.xml.smxml._disabled_generate = 0, state);

						// allows user to perform the operation
						//jQuery('#authoring_container').css('pointer-events', 'auto');
						AH.setCss('#authoring_container', { 'pointer-events': 'auto' });

						// hides the progress bar
						//jQuery('#warning_label_container').addClass('h');
						AH.select("#warning_label_container", 'addClass', 'h');

						break;
					} else {
						// increases the counter according to the generated guids
						$$invalidate(0, state.counter = state.counter + 1, state);
					}
				}
			}

			if (!is_failed) {
				AH.showmsg(l.child_items_generated, 4000);

				// allows user to perform the operation
				//jQuery('#authoring_container').css('pointer-events', 'auto');
				AH.setCss("#authoring_container", { 'pointer-events': 'auto' });

				// updates the parent guid
				updateParentGuid();
			}
		} else {
			// shows warning message
			AH.showmsg(l.min4_max500_allowed, 4000);
		}
	}

	// used for show all the child guids which are selected
	function showAllChild() {
		// array for contain the child guid of selected row
		let routerGuid = [];

		AH.select('.select_editable_guid', 'checked').forEach(_this => {
			routerGuid.push(_this.getAttribute('target-guid'));
		});

		// url for show the selected child guids
		let futureUrl = baseUrl + 'editor/v2/?action=edit&content_guid=' + routerGuid[0] + '&no_header=1&react_content=1&preview_only=1&item=listItem&no_domain=1&router_guid=' + routerGuid.join(",");

		// opens the url in new tab
		window.open(futureUrl, '_blank');
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
			AH.showmsg(l.max500_rows_allowed, 4000);
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
					if (state.data_cdata[1].cg == '') {
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
								AH && AH.showmsg(l.file_uploaded, 4000);
							}

							fileUpload.value = '';
						};

						reader.readAsText(fileUpload.files[0]);
					}
				} else {
					// shows the warning message
					AH.showmsg(l.html5_not_supported, 4000);
				}
			} else {
				// shows the warning message
				AH.showmsg(l.upload_valid_csv, 4000);
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
									str_data.c1 = column_data[index_no1].replace(/'/gm, '\'').replace(/"/gm, "\"");
								} else {
									// updates the second column value in xml
									str_data.c2 = column_data[index_no1].replace(/'/gm, '\'').replace(/"/gm, "\"");
								}
							} else {
								if (column_data[index_no1] && column_data[index_no1].trim() != "" && index_no1 > 1) {
									// shows warning message
									AH.showmsg(l.exact2_column_allowed, 4000);

									return false;
								} else {
									if (index_no1 <= 1) {
										// shows warning message
										AH.showmsg(l.blank_column_notallowed, 4000);

										return false;
									}
								}
							}
						} else {
							// shows warning message
							AH.showmsg(l.exact2_column_allowed, 4000);

							return false;
						}
					}

					// stores each rows data in object form
					row_data.push(str_data);
				} else {
					// shows warning message
					AH.showmsg(l.blank_column_notallowed, 4000);

					return false;
				}
			}

			// retuns the data of each csv file in json string
			return JSON.stringify({ "list": row_data });
		} else {
			// shows warning message
			AH.showmsg(l.min_max_validation, 4000);
		}
	}

	function updateParentGuid() {
		// @eslint issue, it's global method
		AH.activate(2);

		AH.ajax({
			type: "post",
			url: baseUrl + 'editor/index.php',
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
				AH && AH.showmsg(l.check_net_and_save, 4000);
			}

			// @eslint issue, it's global method
			AH.activate(0);

			// hides the progress bar
			AH.select("#warning_label_container", "addClass", "h");
		});
	}

	// used for hide and show the warning dialog box
	function editorModalUpdate(args) {
		$$invalidate(0, state.editorModalHandle = args, state);
	}

	const writable_props = ['xml', 'getChildXml', 'editorState'];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<ListAuthoring> was created with unknown prop '${key}'`);
	});

	const click_handler = index => {
		handleDelete(index);
	};

	const click_handler_1 = () => {
		$$invalidate(0, state.EditorModalBox = false, state);
	};

	const click_handler_2 = () => {
		handleUpdate(row_no);
	};

	function dialog_visible_binding(value) {
		if ($$self.$$.not_equal(state.EditorModalBox, value)) {
			state.EditorModalBox = value;
			$$invalidate(0, state);
		}
	}

	const close_handler = () => {
		$$invalidate(0, state.EditorModalBox = false, state);
	};

	$$self.$$set = $$props => {
		if ('xml' in $$props) $$invalidate(14, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(15, getChildXml = $$props.getChildXml);
		if ('editorState' in $$props) $$invalidate(16, editorState = $$props.editorState);
	};

	$$self.$capture_state = () => ({
		l,
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
		handle_disable,
		progress_data,
		handle_generate,
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
		editorModalUpdate
	});

	$$self.$inject_state = $$props => {
		if ('state' in $$props) $$invalidate(0, state = $$props.state);
		if ('temp_array' in $$props) temp_array = $$props.temp_array;
		if ('file_name' in $$props) file_name = $$props.file_name;
		if ('child_generated' in $$props) $$invalidate(1, child_generated = $$props.child_generated);
		if ('row_no' in $$props) $$invalidate(2, row_no = $$props.row_no);
		if ('object_data' in $$props) $$invalidate(6, object_data = $$props.object_data);
		if ('count' in $$props) count = $$props.count;
		if ('xml' in $$props) $$invalidate(14, xml = $$props.xml);
		if ('getChildXml' in $$props) $$invalidate(15, getChildXml = $$props.getChildXml);
		if ('editorState' in $$props) $$invalidate(16, editorState = $$props.editorState);
		if ('stateData' in $$props) stateData = $$props.stateData;
		if ('modal' in $$props) modal = $$props.modal;
		if ('handle_disable' in $$props) $$invalidate(3, handle_disable = $$props.handle_disable);
		if ('progress_data' in $$props) $$invalidate(4, progress_data = $$props.progress_data);
		if ('handle_generate' in $$props) $$invalidate(5, handle_generate = $$props.handle_generate);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty[0] & /*state*/ 1) {
			 {
				if (state.data_cdata && state.data_cdata[1].cg) {
					$$invalidate(3, handle_disable = true);
				}

				$$invalidate(5, handle_generate = state.xml && (state.xml.smxml._disabled_generate == 1 ? true : false));

				//alert(state.xml.smxml);
				if (state.data_cdata) {
					$$invalidate(4, progress_data = Math.ceil(state.counter * 100 / (state.data_cdata.length - 1)) + '%');
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
		click_handler_1,
		click_handler_2,
		dialog_visible_binding,
		close_handler
	];
}

class ListAuthoring extends SvelteComponentDev {
	constructor(options) {
		super(options);

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
			add_css,
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

		if (/*xml*/ ctx[14] === undefined && !('xml' in props)) {
			console_1.warn("<ListAuthoring> was created without expected prop 'xml'");
		}

		if (/*getChildXml*/ ctx[15] === undefined && !('getChildXml' in props)) {
			console_1.warn("<ListAuthoring> was created without expected prop 'getChildXml'");
		}

		if (/*editorState*/ ctx[16] === undefined && !('editorState' in props)) {
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
//# sourceMappingURL=ListAuthoring-76b66a2b.js.map
