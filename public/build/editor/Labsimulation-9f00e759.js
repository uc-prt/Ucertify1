import{S as e,i as t,s as n,L as o,I as s,K as c,H as u,e as l,b as m,c as d,f,h as g,m as h,N as p,t as v,a as b,o as y,d as w,p as x,V as _,a0 as A,A as S,C as k,E as $,a9 as T,w as C,u as I,x as j,a5 as F,g as M,j as q,r as D,U as O}from"./main-981785a7.js";var B={};function L(e){let t;return{c(){t=I(e[0])},m(e,r){g(e,t,r)},p(e,r){1&r&&j(t,e[0])},d(e){e&&y(t)}}}function E(e){let t,r,n,a,i,o,s,c,u,p,x,_,A=k.calculate_answer+"",S=k.please_wait+"";return i=new F({props:{size:60}}),{c(){t=l("h4"),t.innerHTML='<div class="d-flex justify-content-between"><div>Review</div></div>',r=m(),n=l("div"),a=l("center"),d(i.$$.fragment),o=m(),s=l("h4"),c=I(A),u=l("br"),p=m(),x=I(S),f(t,"class","mt-1 font21 mb-4"),f(a,"class","mt-xl"),f(n,"id","remediationModel"),M(n,"overflow-y","auto"),M(n,"padding-right","20px")},m(e,l){g(e,t,l),g(e,r,l),g(e,n,l),q(n,a),h(i,a,null),q(a,o),q(a,s),q(s,c),q(s,u),q(s,p),q(s,x),_=!0},p:D,i(e){_||(v(i.$$.fragment,e),_=!0)},o(e){b(i.$$.fragment,e),_=!1},d(e){e&&y(t),e&&y(r),e&&y(n),w(i)}}}function R(e){let t,r=k.done+"";return{c(){t=I(r)},m(e,r){g(e,t,r)},p:D,d(e){e&&y(t)}}}function P(e){let t,r,n;return r=new O({props:{unelevated:!0,outlined:!0,color:"primary",$$slots:{default:[R]},$$scope:{ctx:e}}}),r.$on("Click",e[6]),{c(){t=l("div"),d(r.$$.fragment),f(t,"slot","footer"),f(t,"class","svelteFooter")},m(e,a){g(e,t,a),h(r,t,null),n=!0},p(e,t){const n={};8388608&t&&(n.$$scope={dirty:t,ctx:e}),r.$set(n)},i(e){n||(v(r.$$.fragment,e),n=!0)},o(e){b(r.$$.fragment,e),n=!1},d(e){e&&y(t),w(r)}}}function U(e){let t,r,n,a,i,x,_,A;function S(t){e[5](t)}let k={timeout:10,$$slots:{default:[L]},$$scope:{ctx:e}};function $(t){e[7](t)}void 0!==e[1].snackback&&(k.visible=e[1].snackback),n=new o({props:k}),s.push((()=>c(n,"visible",S)));let T={width:450,style:"background: #fff; border-radius: 5px;",class:"remove_right_margin",$$slots:{footer:[P],default:[E]},$$scope:{ctx:e}};return void 0!==e[1].remediationToggle&&(T.visible=e[1].remediationToggle),x=new u({props:T}),s.push((()=>c(x,"visible",$))),{c(){t=l("div"),t.innerHTML='<center><div id="frame"><iframe id="authoringFrame" title="Hardware Lab" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" height="650" width="94%" name="authoringFrame" data-authoring="1"></iframe></div></center> \n\t<input type="hidden" name="labAnswer" id="labAnswer" val="0"/> \n\t<input type="hidden" id="checkAnsStr" name="checkAnsStr" value=""/> \n\t<button id="clickRun" name="clickRun" style="display: none"></button>',r=m(),d(n.$$.fragment),i=m(),d(x.$$.fragment),f(t,"id","authoringArea")},m(e,a){g(e,t,a),g(e,r,a),h(n,e,a),g(e,i,a),h(x,e,a),A=!0},p(e,[t]){const r={};8388609&t&&(r.$$scope={dirty:t,ctx:e}),!a&&2&t&&(a=!0,r.visible=e[1].snackback,p((()=>a=!1))),n.$set(r);const i={};8388610&t&&(i.$$scope={dirty:t,ctx:e}),!_&&2&t&&(_=!0,i.visible=e[1].remediationToggle,p((()=>_=!1))),x.$set(i)},i(e){A||(v(n.$$.fragment,e),v(x.$$.fragment,e),A=!0)},o(e){b(n.$$.fragment,e),b(x.$$.fragment,e),A=!1},d(e){e&&y(t),e&&y(r),w(n,e),e&&y(i),w(x,e)}}}function H(e){return(e=escape(e)).replace(/[*+\/@]|%20/g,(function(e){switch(e){case"*":e="%2A";break;case"+":e="%2B";break;case"/":e="%2F";break;case"@":e="%40";break;case"%20":e="+"}return e}))}function z(e,t,r){let{editorState:n}=t,{ucEditor:a}=t,{showAns:i}=t,o="",s="<smans></smans>",c="",u="",l={};C({xml:"",uxml:"",module:"0",stepIndex:0,toggle:!1,snackback:!1,testMode:"0",remediationToggle:!1,qxml:"",titleData:"",stemData:"",remediationData:"",remediationToggle:!1,webAutogradeNotCalled:!0,toggleMode:""}).subscribe((e=>{r(1,l=e)}));async function m(e){r(2,n.activator=!0,n),S.empty("#authoringFrame"),S.find("#authoringArea","form",{action:"remove"}),o=await function(e){return new Promise(((t,r)=>{try{let r;setTimeout((function(){r="22"==l.module?"1"==e?l.qxml:S.select("#authoringFrame")?.contentWindow.save_data?.():"1"==e?l.qxml:S.select("#authoringFrame")?.contentWindow.generateXML?.(),t(r)}),50)}catch(e){r(e)}}))}(e),console.log("qxml Fetched"),S.empty("#authoringDiv player"),T(S.select("#authoringDiv")),S.find("#authoringDiv","player",{action:"addClass",actionData:"hidecontent"}),S.selectAll("#editor img").forEach((e=>{e.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)||"editor-header-img"==e.getAttribute("id")||e.getAttribute("src","//s3.amazonaws.com/jigyaasa_content_static/"+e.getAttribute("src"))})),S.select("#headerTitle","html",k.preview),S.select("#answerCheck","css",{visibility:"visible",display:"inline-block"}),S.select("#authoringFrame","attr",{"data-authoring":"0"});var t=function(e,t,r){switch(r){case"17":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/labsimulation/?in_editor=1"><textarea class="h" name="qxml" id="qxml">'+H(e)+'</textarea><textarea class="h" name="uxml" id="uxml">'+H(t)+'</textarea><input type="hidden" name="content_guid" value="0"/></form>';case"18":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/relationship/?in_editor=1"><textarea class="h" name="qxml">'+H(e)+'</textarea><textarea class="h" name="uxml">'+t+'</textarea><input type="hidden" name="content_guid" value="0"/></form>';case"22":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/web/?in_editor=1"><textarea class="h" name="qxml">'+e+'</textarea><textarea class="h" name="uxml">'+t+'</textarea><input type="hidden" name="content_guid" value="0"/></form>'}}(o,"<smans></smans>",l.module);S.insert("#authoringArea",t,"beforeend"),S.selectAll("#tilteShow, #stemShow, #remediationShow","remove");let a=S.select("#title").innerHTML,i=S.select("#stem").innerHTML,s=S.select("#remediation").innerHTML;S.insert(S.select(S.empty("#title"),"hide"),'<div id="tilteShow">'+a+"</div>","afterend"),S.insert(S.select(S.empty("#stem"),"hide"),'<div id="stemShow">'+i+"</div>","afterend"),S.insert(S.select(S.empty("#remediation"),"hide"),'<div id="remediationShow">'+s+"</div>","afterend"),S.select("#externalInputs","hide"),r(1,l.qxml=o,l),r(1,l.titleData=a,l),r(1,l.stemData=i,l),r(1,l.remediationData=s,l),setTimeout((function(){S.selectAll("#stemShow .ebook_item_text, #remediationShow .ebook_item_text","attr",{contenteditable:!1}),S.select('form[target="authoringFrame"]').submit()}),200)}function d(e,t){switch(t){case"17":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/labsimulation/?in_editor=1"><input type="hidden" name="authoringmode" value="1"/><textarea class="h" name="qxml">'+H(e)+'</textarea><textarea class="h" name="uxml">'+s+"</textarea></form>";case"18":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/relationship/?in_editor=1"><input type="hidden" name="authoringmode" value="1"/><textarea class="h" name="qxml">'+H(e)+'</textarea><textarea class="h" name="uxml">'+s+"</textarea></form>";case"22":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/web/?in_editor=1"><input type="hidden" name="authoringmode" value="1"/><textarea class="h" name="qxml">'+e+'</textarea><textarea class="h" name="uxml">'+s+"</textarea></form>"}}x((async()=>{r(1,l.xml=n.xml,l);let e=n.xml.match(/<smxml(.*?)>/gim).toString().match(/type="(.*?)"|type='(.*?)'/gim);e=e.toString().replace(/type=|"/gim,""),r(1,l.module=e,l),r(2,n.activator=!0,n),await _(),setTimeout((function(){c=d(n.xml,l.module.toString()),/Edge/i.test(navigator.userAgent)?S.select("#authoringFrame","attr",{height:window.innerHeight-31}):/Mac/i.test(navigator.userAgent)?S.select("#authoringFrame","attr",{height:window.innerHeight-60}):S.select("#authoringFrame","attr",{height:window.innerHeight+12}),S.select("#preview","hide"),S.find("#authoringArea","form",{action:"remove"}),S.insert("#authoringArea",c,"beforeend"),setTimeout((function(){S.find(document,'form[target="authoringFrame"]').submit(),r(2,n.activator=!0,n)}),100)}),200),S.listen(document,"click","#answerCheck",(()=>{!function(){S.select("#authoringFrame","attr",{"data-authoring":"0"});try{if("17"==l.module)s=S.select("#authoringFrame").contentWindow.getAnswerXMLLabsim(),s=s.uxml;else if("18"==l.module)s=S.select("#authoringFrame").contentWindow.generateXML(),s=JSON.stringify(s.xml);else if("22"==l.module){let e=S.select("#authoringFrame").contentWindow.webAutoEvaluate();if(e){r(1,l.remediationToggle=!0,l),r(1,l.webAutogradeNotCalled=!1,l),S.select("#remediationModel","html",e);let t=e.replace(/\s=\s/gim,"=").match(/ans="(.*?)"/gim);t=t?t.toString().replace(/ans=|"/gim,""):"",i(B.ucfirst(t))}}else s=S.select("#authoringFrame").contentWindow.save_data()}catch(e){console.log(e)}l.webAutogradeNotCalled&&(S.find("#authoringArea","form"),c=function(e,t,r){switch(r){case"17":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/labsimulation/?in_editor=1"><input type="hidden" name="isReview" value="1"/><textarea class="h" name="qxml">'+H(e)+'</textarea><textarea class="h" name="uxml">'+H(t)+'</textarea><input type="hidden" name="content_guid" value="0"/></form>';case"18":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/relationship/?in_editor=1"><input type="hidden" name="isReview" value="1"/><textarea class="h" name="qxml">'+H(e)+'</textarea><textarea class="h" name="uxml">'+t+'</textarea><input type="hidden" name="content_guid" value="0"/></form>';case"22":return'<form method="post" target="authoringFrame" action="'+baseUrl+'sim/web/?in_editor=1"><input type="hidden" name="isReview" value="1"/><textarea class="h" name="qxml">'+e+'</textarea><textarea class="h" name="uxml">'+t+'</textarea><input type="hidden" name="content_guid" value="0"/></form>'}}(l.qxml,s,l.module),S.insert("#authoringArea",c,"beforeend"),setTimeout((function(){S.select('form[target="authoringFrame"]').submit(),r(2,n.activator=!0,n)}),100))}()})),S.listen(document,"click","#testMode",(function(){m(1),S.select("#testMode","attr",{id:"answerCheck"}).innerHTML=k.remediation})),setTimeout((function(){"17"==l.module&&S.bind("#authoringFrame","load",(()=>{let e=S.select("#authoringFrame").contentDocument;S.listen(e,"click","body",(function(e){"1"==l.testMode&&(r(0,u="1"==S.select("#labAnswer").value?"Correct":"Incorrect"),r(1,l.snackback=!0,l))})),r(2,n.activator=!1,n)}))}),200),S.listen("#clickRun","click",(()=>{i(S.select("#checkAnsStr").value)}))})),A((()=>{S.select("#testMode","attr",{id:"answerCheck"}).innerHTML=k.remediation})),$((async()=>{n.toggleMode!=l.toggleMode&&(1==n.toggleMode?(r(1,l.testMode=1,l),m(0)):(r(2,n.activator=!0,n),r(1,l.testMode=0,l),S.select("#headerTitle","html",k.authoring),S.select("#answerCheck","css",{visibility:"hidden",display:"none"}),S.select("#authoringFrame","attr",{"data-authoring":"1"}),S.find("#authoringArea","form",{action:"remove"}),c=d(l.qxml,l.module),S.insert("#authoringArea",c,"beforeend"),S.selectAll("#tilteShow,#stemShow,#remediationShow","remove"),S.select("#title","html",l.titleData),S.select("#stem","html",l.stemData),S.select("#remediation","html",l.remediationData),S.selectAll("#title,#stem,#remediation,#externalInputs","show"),S.empty("#authoringDiv player"),S.find("#authoringDiv","player",{action:"removeClass",actionData:"hidecontent"}),S.selectAll("#editor img").forEach((e=>{e.getAttribute("src").match(/\/\/s3.amazonaws.com\/jigyaasa_content_static/gm)||"editor-header-img"==e.getAttribute("id")||e.getAttribute("src",e.getAttribute("src"))})),setTimeout((function(){S.select('form[target="authoringFrame"]').submit(),a.initEditor(!1,"#authoringSection .ebook_item_text")}),100)),r(1,l.toggleMode=n.toggleMode,l))}));return e.$$set=e=>{"editorState"in e&&r(2,n=e.editorState),"ucEditor"in e&&r(3,a=e.ucEditor),"showAns"in e&&r(4,i=e.showAns)},[u,l,n,a,i,function(t){e.$$.not_equal(l.snackback,t)&&(l.snackback=t,r(1,l))},()=>{r(1,l.remediationToggle=!1,l)},function(t){e.$$.not_equal(l.remediationToggle,t)&&(l.remediationToggle=t,r(1,l))}]}B.ucfirst=function(e){return(e+="").charAt(0).toUpperCase()+e.substr(1)},B.decbin=function(e){return e<0&&(e=4294967295+e+1),parseInt(e,10).toString(2)},B.bindec=function(e){return e=(e+"").replace(/[^01]/gi,""),parseInt(e,2)},B.strrev=function(e){e+="";var t=FACTS.uniChars,r=new RegExp("(.)(["+t.join("")+"]+)","g");return(e=e.replace(r,"$2$1")).split("").reverse().join("")},B.isDefined=e=>void 0!==e&&""!=e,B.isObject=e=>B.isDefined(e)&&"object"==typeof e,B.changeObjectKey=function(e,t){var r={};for(key in e){r[t+key]=e[key]}return r},B.replaceSpclInObjKey=function(e,t,r){var n={};for(key in e){let r=key;-1!==key.indexOf(t)&&(r=key.replace(".","-")),n[r]=e[key]}return n},B.ucwords=function(e){return(str+"").replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,(function(e){return e.toUpperCase()}))},B.chr=function(e){return e>65535?(e-=65536,String.fromCharCode(55296+(e>>10),56320+(1023&e))):String.fromCharCode(e)},B.rand=function(e,t){var r=arguments.length;if(0===r)e=0,t=2147483647;else if(1===r)throw new Error("Warning: rand() expects exactly 2 parameters, 1 given");return Math.floor(Math.random()*(t-e+1))+e},B.isNumeric=function(e){return("number"==typeof e||"string"==typeof e&&-1===" \n\r\t\f\v            ​\u2028\u2029　".indexOf(e.slice(-1)))&&""!==e&&!isNaN(e)},B.is_int=function(e){return e===+e&&isFinite(e)&&!(e%1)},B.is_object=function(e){return"[object Array]"!==Object.prototype.toString.call(e)&&(null!==e&&"object"==typeof e)},B.in_array=function(e,t,r){var n="";if(!!r){for(n in t)if(t[n]===e)return!0}else for(n in t)if(t[n]==e)return!0;return!1},B.array_reverse=function(e,t){var r,n=t?{}:[];if("[object Array]"===Object.prototype.toString.call(e)&&!t)return e.slice(0).reverse();if(t){var a=[];for(r in e)a.push(r);for(var i=a.length;i--;)n[r=a[i]]=e[r]}else for(r in e)n.unshift(e[r]);return n},B.array_slice=function(e,t,r,n){var a="";if("[object Array]"!==Object.prototype.toString.call(e)||n&&0!==t){var i=0,o={};for(a in e)i+=1,o[a]=e[a];e=o,t=t<0?i+t:t,r=void 0===r?i:r<0?i+r-t:r;var s={},c=!1,u=-1,l=0,m=0;for(a in e){if(++u,l>=r)break;u==t&&(c=!0),c&&(++l,B.is_int(a)&&!n?s[m++]=e[a]:s[a]=e[a])}return s}return void 0===r?e.slice(t):r>=0?e.slice(t,t+r):e.slice(t,r)},B.strPad=function(e,t,r,n){var a,i="",o=function(e,t){for(var r="";r.length<t;)r+=e;return r=r.substr(0,t)};return r=void 0!==r?r:" ","STR_PAD_LEFT"!==n&&"STR_PAD_RIGHT"!==n&&"STR_PAD_BOTH"!==n&&(n="STR_PAD_RIGHT"),(a=t-(e+="").length)>0&&("STR_PAD_LEFT"===n?e=o(r,a)+e:"STR_PAD_RIGHT"===n?e+=o(r,a):"STR_PAD_BOTH"===n&&(e=(e=(i=o(r,Math.ceil(a/2)))+e+i).substr(0,t))),e},B.explode=function(e,t,r){if(arguments.length<2||void 0===e||void 0===t)return null;if(""===e||!1===e||null===e)return!1;if("function"==typeof e||"object"==typeof e||"function"==typeof t||"object"==typeof t)return{0:""};!0===e&&(e="1");var n=(t+="").split(e+="");return void 0===r?n:(0===r&&(r=1),r>0?r>=n.length?n:n.slice(0,r-1).concat([n.slice(r-1).join(e)]):-r>=n.length?[]:(n.splice(n.length+r),n))},B.implode=function(e,t){var r="",n="",a="";if(1===arguments.length&&(t=e,e=""),"object"==typeof t){if("[object Array]"===Object.prototype.toString.call(t))return t.join(e);for(r in t)n+=a+t[r],a=e;return n}return t},B.array_filter=function(e,t){var r,n={};for(r in t=t||function(e){return e},"[object Array]"===Object.prototype.toString.call(e)&&(n=[]),e)t(parseInt(e[r]))&&(n[r]=e[r]);return n},B.strpos=function(e,t,r){var n=(e+"").indexOf(t,r||0);return-1!==n&&n},B.stripos=function(e,t,r){var n,a=(e+"").toLowerCase(),i=(t+"").toLowerCase();return-1!==(n=a.indexOf(i,r))&&n},B.str_ireplace=function(e,t,r,n){var a,i,o,s,c=0,u=0,l="",m="",d=0,f="",g="",h="",p="",v=r,b="[object Array]"===Object.prototype.toString.call(v);if("object"==typeof e)for(l=e,e=[],c=0;c<l.length;c+=1)e[c]=l[c].toLowerCase();else e=e.toLowerCase();if("object"==typeof r)for(l=r,r=[],c=0;c<l.length;c+=1)r[c]=l[c].toLowerCase();else r=r.toLowerCase();if("object"==typeof e&&"string"==typeof t)for(l=t,t=[],c=0;c<e.length;c+=1)t[c]=l;for(l="",i=[].concat(e),o=[].concat(t),s="[object Array]"===Object.prototype.toString.call(o),f=[].concat(f=r),v=[].concat(v),n&&(n.value=0),c=0,a=f.length;c<a;c++)if(""!==f[c])for(u=0,d=i.length;u<d;u++)l=f[c]+"",m=s?void 0!==o[u]?o[u]:"":o[0],f[c]=l.split(i[u]).join(m),g=v[c]+"",h=l.indexOf(i[u]),p=i[u].length,h>=0&&(v[c]=g.split(g.substr(h,p)).join(m)),n&&(n.value+=l.split(i[u]).length-1);return b?v:v[0]},B.array_flip=function(e){var t,r={};if(e&&"object"==typeof e&&e.change_key_case)return e.flip();for(t in e)e.hasOwnProperty(t)&&(r[e[t]]=t);return r},B.array_unique=function(e){var t="",r={},n="",a=function(e,t){var r="";for(r in t)if(t.hasOwnProperty(r)&&t[r]+""==e+"")return r;return!1};for(t in e)e.hasOwnProperty(t)&&!1===a(n=e[t],r)&&(r[t]=n);return r},B.array_merge=function(e,t){var r={};for(let t in e)r[t]=e[t];for(let e in t)r[e]=t[e];return r},B.is_array=function(e){return e.constructor===Array},B.shuffle=function(e){for(let t=e.length-1;t>0;t--){let r=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[r],e[r]=n}return e},B.count=function(e){return e.constructor===Array?e.length:0},B.ord=function(e){var t=e+"",r=t.charCodeAt(0);if(55296<=r&&r<=56319){var n=r;return 1===t.length?r:1024*(n-55296)+(t.charCodeAt(1)-56320)+65536}return r},B.array_values=function(e){var t=[],r="";if(e&&"object"==typeof e&&e.change_key_case)return e.values();for(r in e)t[t.length]=e[r];return t},B.extend=function(e,t){return Object.keys(t).forEach((function(r){e[r]==t[r]||(e[r]=t[r])})),e},B.utf8_encode=function(e){if(null==e)return"";var t,r,n,a=e+"",i="";t=r=0,n=a.length;for(var o=0;o<n;o++){var s=a.charCodeAt(o),c=null;if(s<128)r++;else if(s>127&&s<2048)c=String.fromCharCode(s>>6|192,63&s|128);else if(55296!=(63488&s))c=String.fromCharCode(s>>12|224,s>>6&63|128,63&s|128);else{if(55296!=(64512&s))throw new RangeError("Unmatched trail surrogate at "+o);var u=a.charCodeAt(++o);if(56320!=(64512&u))throw new RangeError("Unmatched lead surrogate at "+(o-1));s=((1023&s)<<10)+(1023&u)+65536,c=String.fromCharCode(s>>18|240,s>>12&63|128,s>>6&63|128,63&s|128)}null!==c&&(r>t&&(i+=a.slice(t,r)),i+=c,t=r=o+1)}return r>t&&(i+=a.slice(t,n)),i},B.md5=function(e){var t,r,n,a,i,o,s,c,u,l,m,d=function(e,t){return e<<t|e>>>32-t},f=function(e,t){var r,n,a,i,o;return a=2147483648&e,i=2147483648&t,o=(1073741823&e)+(1073741823&t),(r=1073741824&e)&(n=1073741824&t)?2147483648^o^a^i:r|n?1073741824&o?3221225472^o^a^i:1073741824^o^a^i:o^a^i},g=function(e,t,r,n,a,i,o){return e=f(e,f(f(function(e,t,r){return e&t|~e&r}(t,r,n),a),o)),f(d(e,i),t)},h=function(e,t,r,n,a,i,o){return e=f(e,f(f(function(e,t,r){return e&r|t&~r}(t,r,n),a),o)),f(d(e,i),t)},p=function(e,t,r,n,a,i,o){return e=f(e,f(f(function(e,t,r){return e^t^r}(t,r,n),a),o)),f(d(e,i),t)},v=function(e,t,r,n,a,i,o){return e=f(e,f(f(function(e,t,r){return t^(e|~r)}(t,r,n),a),o)),f(d(e,i),t)},b=function(e){var t,r="",n="";for(t=0;t<=3;t++)r+=(n="0"+(e>>>8*t&255).toString(16)).substr(n.length-2,2);return r};for(c=1732584193,u=4023233417,l=2562383102,m=271733878,t=(r=function(e){for(var t,r=e.length,n=r+8,a=16*((n-n%64)/64+1),i=new Array(a-1),o=0,s=0;s<r;)o=s%4*8,i[t=(s-s%4)/4]=i[t]|e.charCodeAt(s)<<o,s++;return o=s%4*8,i[t=(s-s%4)/4]=i[t]|128<<o,i[a-2]=r<<3,i[a-1]=r>>>29,i}(e=B.utf8_encode(e))).length,n=0;n<t;n+=16)a=c,i=u,o=l,s=m,c=g(c,u,l,m,r[n+0],7,3614090360),m=g(m,c,u,l,r[n+1],12,3905402710),l=g(l,m,c,u,r[n+2],17,606105819),u=g(u,l,m,c,r[n+3],22,3250441966),c=g(c,u,l,m,r[n+4],7,4118548399),m=g(m,c,u,l,r[n+5],12,1200080426),l=g(l,m,c,u,r[n+6],17,2821735955),u=g(u,l,m,c,r[n+7],22,4249261313),c=g(c,u,l,m,r[n+8],7,1770035416),m=g(m,c,u,l,r[n+9],12,2336552879),l=g(l,m,c,u,r[n+10],17,4294925233),u=g(u,l,m,c,r[n+11],22,2304563134),c=g(c,u,l,m,r[n+12],7,1804603682),m=g(m,c,u,l,r[n+13],12,4254626195),l=g(l,m,c,u,r[n+14],17,2792965006),c=h(c,u=g(u,l,m,c,r[n+15],22,1236535329),l,m,r[n+1],5,4129170786),m=h(m,c,u,l,r[n+6],9,3225465664),l=h(l,m,c,u,r[n+11],14,643717713),u=h(u,l,m,c,r[n+0],20,3921069994),c=h(c,u,l,m,r[n+5],5,3593408605),m=h(m,c,u,l,r[n+10],9,38016083),l=h(l,m,c,u,r[n+15],14,3634488961),u=h(u,l,m,c,r[n+4],20,3889429448),c=h(c,u,l,m,r[n+9],5,568446438),m=h(m,c,u,l,r[n+14],9,3275163606),l=h(l,m,c,u,r[n+3],14,4107603335),u=h(u,l,m,c,r[n+8],20,1163531501),c=h(c,u,l,m,r[n+13],5,2850285829),m=h(m,c,u,l,r[n+2],9,4243563512),l=h(l,m,c,u,r[n+7],14,1735328473),c=p(c,u=h(u,l,m,c,r[n+12],20,2368359562),l,m,r[n+5],4,4294588738),m=p(m,c,u,l,r[n+8],11,2272392833),l=p(l,m,c,u,r[n+11],16,1839030562),u=p(u,l,m,c,r[n+14],23,4259657740),c=p(c,u,l,m,r[n+1],4,2763975236),m=p(m,c,u,l,r[n+4],11,1272893353),l=p(l,m,c,u,r[n+7],16,4139469664),u=p(u,l,m,c,r[n+10],23,3200236656),c=p(c,u,l,m,r[n+13],4,681279174),m=p(m,c,u,l,r[n+0],11,3936430074),l=p(l,m,c,u,r[n+3],16,3572445317),u=p(u,l,m,c,r[n+6],23,76029189),c=p(c,u,l,m,r[n+9],4,3654602809),m=p(m,c,u,l,r[n+12],11,3873151461),l=p(l,m,c,u,r[n+15],16,530742520),c=v(c,u=p(u,l,m,c,r[n+2],23,3299628645),l,m,r[n+0],6,4096336452),m=v(m,c,u,l,r[n+7],10,1126891415),l=v(l,m,c,u,r[n+14],15,2878612391),u=v(u,l,m,c,r[n+5],21,4237533241),c=v(c,u,l,m,r[n+12],6,1700485571),m=v(m,c,u,l,r[n+3],10,2399980690),l=v(l,m,c,u,r[n+10],15,4293915773),u=v(u,l,m,c,r[n+1],21,2240044497),c=v(c,u,l,m,r[n+8],6,1873313359),m=v(m,c,u,l,r[n+15],10,4264355552),l=v(l,m,c,u,r[n+6],15,2734768916),u=v(u,l,m,c,r[n+13],21,1309151649),c=v(c,u,l,m,r[n+4],6,4149444226),m=v(m,c,u,l,r[n+11],10,3174756917),l=v(l,m,c,u,r[n+2],15,718787259),u=v(u,l,m,c,r[n+9],21,3951481745),c=f(c,a),u=f(u,i),l=f(l,o),m=f(m,s);return(b(c)+b(u)+b(l)+b(m)).toLowerCase()},B.baseConvert=function(e,t,r){if("string"!=typeof e&&(e=e.toString()),64==t||64==r)var n="0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz()";else n="0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz";for(var a=(n=n.split("")).slice(0,t),i=n.slice(0,r),o=e.split("").reverse().reduce((function(e,r,n){if(-1===a.indexOf(r))throw new Error("Invalid digit `"+r+"` for base "+t+".");return e+a.indexOf(r)*Math.pow(t,n)}),0),s="";o>0;)s=i[o%r]+s,o=(o-o%r)/r;return s||"0"},B.GUID64_decode=e=>B.baseConvert(e,64,10),B.GUID64_encode=(e,t=2)=>{let r=B.baseConvert(e,10,64);return B.strPad(r,t,"0","STR_PAD_LEFT")},B.shuffleArray=e=>{for(let t=e.length-1;t>0;t--){let r=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[r],e[r]=n}return e},B.range=(e,t)=>new Array(t-e).fill().map(((t,r)=>r+e)),B.getRange=(e,t,r,n)=>(e=e||n,e=Math.min(r,Math.max(t,e))),B.getDefault=(e,t)=>e||t,B.str2Pass=e=>B.md5("ucertify"+e),B.byte2array=function(e,t,r=1){var n=B.decbin(e),a=(n=B.strrev(B.strPad(n,8*r,"0","STR_PAD_LEFT"))).split(""),i=0,o={};for(let e in t)o[e]=parseInt(a[i]),i++;return o},B.getUserPoints=function(e,t){return e=B.clearBit(e,7),scorePercent=B.ord(e),userPoints=Math.round(parseInt(scorePercent)*parseInt(t)/100),userPoints},B.getUserQuestionStatus=function(e,t,r){return e<=0?status=-1:(status=1,r<=0?status=0:t==r&&(status=2)),status},B.apiInitializeRandomSeq=function(e,t,n){strdata=String(e);for(let e=0;e<n;e++)r=B.chr(0),1==t&&(r=B.chr(Math.random(0,7))),strdata+=r;return strdata},B.setUserAnswerStr=function(e,t=0){var r=["1","2","3","4","5","6","7","8"],n=["A","B","C","D","E","F","G","H"],a=B.chr(0);"object"!=typeof e&&(e=e.split(","));for(let o in e){var i=e[o];2==t&&(i=B.getAnswerSeqStr(i,t,!0)),r.indexOf(i)>-1?a=B.setBit(a,parseInt(i)-1):n.indexOf(i)>-1&&(a=B.setBit(a,B.ord(i.toLowerCase())-65))}return a},B.setBookmark=function(e,t){return e=t?B.setBit(e,7):B.clearBit(e,7)},B.setScore=function(e,t,r){bookmark=B.getBit(e,7),parseInt(r)<=0&&(r=1);var n=Math.round(100*t/r);return n=Math.min(n,100),e=B.chr(n),e=B.setBookmark(e,bookmark)},B.testBit=function(e,t){return(e=parseInt(e))&1<<t},B.getBit=function(e,t){let r=B.ord(e);return""!=B.testBit(r,t)?1:0},B.setBit=function(e,t){let r=B.ord(e),n=1<<t;return B.chr(r|n)},B.clearBit=function(e,t){let r=B.ord(e),n=~(1<<t);return B.chr(r&n)},B.getAnswerSeqStr=function(e,t=0,r=!1){var n={};return 1==t?e:2==t?(n[1]="I",n[2]="II",n[3]="III",n[4]="IV",n[5]="V",n[6]="VI",n[7]="VII",n[8]="VIII",n[9]="IX",n[10]="X",r?(rAnsSeq0={},rAnsSeq0=B.array_flip(n),rAnsSeq0[e]):n[e]):(n[1]="A",n[2]="B",n[3]="C",n[4]="D",n[5]="E",n[6]="F",n[7]="G",n[8]="H",n[9]="I",n[10]="J",n[e])},B.getTestTimeSpent=function(e,t){let r=2*t,n=e[2*t-1],a=e[r],i=parseInt(255*B.ord(n)+B.ord(a));return i>0?i:0},B.setTestTimeSpent=function(e,t,r){r=parseInt(r);let n=Math.floor(r/255),a=r%255,i=Math.min(n,255),o=Math.min(a,255),s=B.chr(i),c=B.chr(o),u=B.setByteInString(e,s,2*t-1);return u=B.setByteInString(u,c,2*t),u},B.setByteInString=function(e,t,r){if("object"==typeof e){var n=!0;e=e.join(",")}return r<=0?(r=0,e=t+e.substr(parseInt(r)+1,1)):e=e.substr(0,r).toString()+t.toString()+e.substr(parseInt(r)+1).toString(),n&&(e=e.split(",")),e},B.getBookmark=function(e){return B.getBit(e,7)},B.getScore=function(e,t=1){e=B.clearBit(e,7);let r=B.ord(e);return parseInt(r)},B.getUserAnswerStr=function(e,t=0){var r=[],n=0,a=B.range(0,7);for(let o in a)i=parseInt(a[o]),1==B.getBit(e,i)&&(r[n]=B.getAnswerSeqStr(i+1,t),n++);return r},B.getAnswerPoints=function(e){var t=B.ord(e);return parseInt(t)},B.cleanTest=function(e){var t={can_review:1,can_result:1,can_grade:0};return e.test_mode>2&&(t.can_review=0,t.can_result=0),2==e.test_mode&&(t.can_result=1,t.can_review=0),1==e.manual_grading&&1==e.is_test_over&&(t.can_result=0,t.can_review=0),t},B.api_setAnswerSeq=function(e,t=0,r=0,n=0){var i=0;for(let t in e){a=e[t],a.is_correct>=1&&0;var o=a.answer;e[t].seq_str=B.getAnswerSeqStr(i+1,n),aotpos=B.strpos(o,"<!"),!1===aotpos?(aotpos=B.strpos(o,"<seq no="),!1===aotpos?e[t].seq_tag='<seq no="'+B.chr(97+i)+'" />':(aotendpos=B.strpos(o,"/>"),e[t].seq_tag=o.substr(aotpos,aotendpos-aotpos+2))):e[t].seq_tag=o.substr(aotpos,5),i++}return e},B.replaceAnsSeq=function(e,t){if(!e.includes("<seq no="))return e;for(let r in t){let n=t[r];e=e.split(n.seq_tag).join(n.seq_str)}return e},B.addCorrectAnswerStr=function(e){var t=[];for(let r in e){let n=e[r];"1"==n.is_correct&&t.push(n.seq_str)}return t.join(",")};export default class extends e{constructor(e){super(),t(this,e,z,U,n,{editorState:2,ucEditor:3,showAns:4})}}
//# sourceMappingURL=Labsimulation-9f00e759.js.map
