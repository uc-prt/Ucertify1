import{S as e,i as t,s as i,D as l,e as s,c as a,b as n,B as r,f as o,A as c,h as d,m,j as p,l as u,o as f,N as h,t as v,a as g,d as x,z as w,k as b,n as _,C as y,X as k,p as A,G as S,H as M,w as q,W as C}from"./main-491253aa.js";import{I}from"./ItemHelper-bcf4dee1.js";import"./style-inject.es-1f59c1d0.js";import{F as N}from"./mathquill-4ec4a96d.js";var j=j||{mathtype:""};function $(e){l(e,"svelte-105f8pf",'.darkgrey_border{border:1px solid #ccc!important}.p-lg{padding:15px}.true-hover{outline:0;border:2px solid #14ca14!important}.false-hover{outline:0;border:1px solid #e45252!important}.default-hover{border-color:transparent!important;-webkit-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;-moz-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important}.blocked{display:block !important}.border_green{border:3px solid green!important}.border_red{border:3px solid red!important}.sticky{z-index:800;position:sticky;top:0\r\n\t}.corr_div{width:38px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default}.corr_div_correct{position:relative;width:38px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default}[id^="fillmain"]{overflow:hidden;text-align:left}[id^="fillmain"] pre{background:none;border:none;font-size:14px!important}[id^="fillmain"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^="fillmain"] .footerstr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^="fillmain"] .footerstr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^="fillmain"] .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}[id^="fillmain"] input[type="text"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^="fillmain"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^="fillmain"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^="fillmain"] .drag-resize.ui-draggable{cursor:move}[id^="fillmain"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^="fillmain"] .fillcheck ul{width:220px}[id^="fillmain"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^="fillmain"] .select{font-size:15px}[id^="fillmain"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}')}function E(e,t,i){const l=e.slice();return l[70]=t[i],l[72]=i,l}function T(e){let t,i,l,b,_,y,k,A,q,C,j,$,T,F,O,z,Q;i=new I({props:{handleReviewClick:e[11],reviewMode:e[0],customReviewMode:e[1]}}),i.$on("setReview",e[9]),i.$on("unsetReview",e[10]);let P=e[5].itemArray,L=[];for(let t=0;t<P.length;t+=1)L[t]=R(E(e,P,t));function H(t){e[15](t)}let U={spanId:e[5].spanId,divId:e[5].divId,action:e[2][e[4]],show:e[7]};return void 0!==e[5].showToolbar&&(U.display=e[5].showToolbar),A=new N({props:U}),S.push((()=>M(A,"display",H))),{c(){t=s("center"),a(i.$$.fragment),l=n(),b=s("div");for(let e=0;e<L.length;e+=1)L[e].c();k=n(),a(A.$$.fragment),C=n(),j=s("div"),$=s("button"),$.textContent=""+r.next,o(b,"class",_="inNativeStyle"),o(b,"style",y="width:"+(c.isValid(window.inNative)?"100%":"700px")),o($,"type","button"),o($,"style",T="width:auto;font-size:15px;margin:15px 0;"),o($,"class","btn btn-sm btn-outline-primary imgcenter next_step px-md-5 px-sm-3"),o(j,"class",F=e[5].hideNext?"h-imp":null)},m(s,a){d(s,t,a),m(i,t,null),p(t,l),p(t,b);for(let e=0;e<L.length;e+=1)L[e].m(b,null);p(t,k),m(A,t,null),p(t,C),p(t,j),p(j,$),O=!0,z||(Q=u($,"click",e[16]),z=!0)},p(e,t){const l={};if(1&t[0]&&(l.reviewMode=e[0]),2&t[0]&&(l.customReviewMode=e[1]),i.$set(l),105&t[0]){let i;for(P=e[5].itemArray,i=0;i<P.length;i+=1){const l=E(e,P,i);L[i]?L[i].p(l,t):(L[i]=R(l),L[i].c(),L[i].m(b,null))}for(;i<L.length;i+=1)L[i].d(1);L.length=P.length}const s={};32&t[0]&&(s.spanId=e[5].spanId),32&t[0]&&(s.divId=e[5].divId),20&t[0]&&(s.action=e[2][e[4]]),!q&&32&t[0]&&(q=!0,s.display=e[5].showToolbar,h((()=>q=!1))),A.$set(s),(!O||32&t[0]&&F!==(F=e[5].hideNext?"h-imp":null))&&o(j,"class",F)},i(e){O||(v(i.$$.fragment,e),v(A.$$.fragment,e),O=!0)},o(e){g(i.$$.fragment,e),g(A.$$.fragment,e),O=!1},d(e){e&&f(t),x(i),w(L,e),x(A),z=!1,Q()}}}function R(e){let t,i,l,a,r,c,m,u,h,v,g,x,w,b=e[70].cdata+"";return{c(){t=s("div"),i=s("div"),l=s("div"),a=s("div"),g=n(),o(a,"seq",r="s"+e[72]),o(l,"id",c="data-block_"+e[72]),o(l,"class",m="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(1==e[5].display&&e[3]?.smans&&null!=e[3]?.smans["s"+e[72]]&&e[0]?1==e[3]?.smans["s"+e[72]].overall?"border_green":"border_red":"")),o(l,"key",u=e[72]),o(i,"id",h="s"+e[72]),o(i,"class",v="bg-white"),o(t,"data-sticky",x=e[6](e[72])),o(t,"class","bt-pd bg-white mt-3"),o(t,"tabindex",w=0)},m(e,s){d(e,t,s),p(t,i),p(i,l),p(l,a),a.innerHTML=b,p(t,g)},p(e,t){32&t[0]&&b!==(b=e[70].cdata+"")&&(a.innerHTML=b),41&t[0]&&m!==(m="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(1==e[5].display&&e[3]?.smans&&null!=e[3]?.smans["s"+e[72]]&&e[0]?1==e[3]?.smans["s"+e[72]].overall?"border_green":"border_red":""))&&o(l,"class",m)},d(e){e&&f(t)}}}function F(e){let t,i,l=0==e[5].blank&&T(e);return{c(){t=s("main"),l&&l.c()},m(e,s){d(e,t,s),l&&l.m(t,null),i=!0},p(e,i){0==e[5].blank?l?(l.p(e,i),32&i[0]&&v(l,1)):(l=T(e),l.c(),v(l,1),l.m(t,null)):l&&(b(),g(l,1,1,(()=>{l=null})),_())},i(e){i||(v(l),i=!0)},o(e){g(l),i=!1},d(e){e&&f(t),l&&l.d()}}}function O(e,t,i,l){return void 0!==e[i]&&void 0!==e[i][t]||(void 0===e[i]&&(e[i]={}),e[i][t]={}),e[i][t].value=l,e}function z(e,t,i){let l,s,a={},n={},r="",o="",d=[];var m=[];let p,u,f={},h="",v={},g="",x="",w=0,b=0,_=0,S=!1,M={},I=[],N="",{xml:$}=t,{stopPreviewUpdate:E}=t,{isReview:T}=t,{uxml:R}=t,F=T;q({blank:!0,hideNext:!1,itemArray:[],classChange:-1,isColor:!0,smController:"h",display:-1,showToolbar:!0,isMathquill:!1,correct_answer:!0,main_steps:!1,your_answer:[]}).subscribe((e=>{i(5,M=e)}));function z(e){if(e.nodeName)if(e.classList.contains("mathquill"))le(e,!1);else{let t=e.getAttribute("id"),i=e.closest("div").getAttribute("seq"),l=e.value;n=O(n,t,i,l),J(n)}}function Q(){if(n)for(let e in n)for(let t in n[e]){let i=n[e][t].value;if(""!=i){let e=i.match(/MathQuillMathField\{(.*?)\}/g);e?e.map((function(e){""==e.toString().replace(/MathQuillMathField\{|\}/g,"")?c.select("#"+t,"removeClass","answer_input"):c.select("#"+t,"addClass","answer_input")})):c.select("#"+t,"addClass","answer_input")}else c.select("#"+t,"removeClass","answer_input")}}function P(e){S&&i(3,v.var_list=h,v),i(3,v.cuurentStep=w,v),_=0;const t=M.itemArray;var s,a;if(s=l,(a=e)<=x?(o=s.smxml.step[a].__cdata,L(a,o)):null!=s.smxml.step[w]&&(o=s.smxml.step[w].__cdata,L(a,o)),t.push({cdata:o}),i(5,M.itemArray=t,M),e<=x)var n=e;else n=w;var r=setTimeout((function(){null==l.smxml.step[n+1]&&"1"==l.smxml.step[n]._attempt||null==l.smxml.step[n+1]&&l.smxml.step[n]._viewonly,clearTimeout(r)}),500)}function L(e,t,l){let s=t.match(/%{[\s\S]*?}%/gm),a="";if(!s)return"";s.forEach((function(t,n){if(null!=l)var r=m[l].__cdata;let o=s[n];a=s[n].match(/\|(.*?)}%$/gm),a=a?a[0].replace(/\||}%/gm,""):"",a=a.trim(),""==a||"c"==a||"n"==a?null!=l?V(o,n,e,l,r):V(o,n,e):"e"==a&&(i(5,M.isMathquill=!0,M),null!=l?te(o,n,e,l,r):te(o,n,e))}))}function H(){if(l.smxml.step[w]._attempt="1","undefined"!=typeof QUIZPLAYERID)var e=setTimeout((function(){window.parentElement.autoResize(QUIZPLAYERID),clearTimeout(e)}),0);null!=l.smxml.step[w+1]||"1"==l.smxml.step[w]._attempt?(1==l.smxml._gonext?function(){let e="s"+w;c.find("#"+e,".edit_step","all").forEach((function(t,i){if(t.classList.contains("mathquill"))le(t,!1);else{let i=t.getAttribute("id"),l=t.value;n=O(n,i,e,l)}})),1==l.smxml.step[w]._attempt?Z():(U(),B())}():1==l.smxml.step[w]._attempt?c.selectAll(".edit_step").length==c.selectAll(".answer_input").length?Z():c.selectAll(".edit_step").forEach((e=>{if(!e.classList.contains("answer_input")){e.style.border="2px solid #ff0000";var t=setTimeout((function(){e.style.border="1px solid #ccc",clearTimeout(t)}),500)}})):(U(),B()),l.smxml.step.length<=l.smxml.step[w]._seq&&1!=l.smxml.step[w]._attempt&&i(5,M.hideNext=!0,M)):i(5,M.hideNext=!0,M)}function U(){if(c.selectAll(".edit_step").forEach((e=>{e.classList.contains("mathquill")?e.previousElementSibling.classList.contains("disable_div")&&c.select(e.previousElementSibling,"removeClass","h"):e.disabled=!0,e.classList.add("data-check")})),_=0,null==l.smxml.step[w+1]&&"1"==l.smxml.step[w]._attempt)return i(5,M.hideNext=!0,M),J(n),void D();w!=l.smxml.step.length-1?(w+=1,P(),J(n),D()):console.log("All steps are attempted")}function J(e){window.inNative&&window.getHeight&&window.getHeight();var t=S?"lists="+JSON.stringify(v.var_list):" ";f.special="<smans><div "+t+" currStep='"+w+"' userAns='"+JSON.stringify(e)+"'></div></smans>"}function D(){let e=!1,t=null,i=!1;if(l.smxml.step.length==M.itemArray.length){let t=!0;for(let l in a)null!=a[l].overall&&(e=1==a[l].overall,t=t&&e),0==t?(c.select("#answer").checked=!1,f.answer=!1,i=!1):(c.select("#answer").checked=!0,f.answer=!0,i=!0)}t=f.special,window.inNative&&(window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*"),window.postMessage(JSON.stringify({userAnswers:t,inNativeIsCorrect:i}),"*")),C({uXml:f.special,ans:f.answer})}function B(){c.select("[data-sticky]","addClass","sticky")}function V(e,t,i,l,s){let a=e,n=((e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&e[1].trim(),e[0].trim()),r="";if(-1!=n.indexOf("#style#")){let e=n.split("#style#");n=e[0],r=e[1]}I=[];let o=n.split(",");o.forEach((function(e,t){I[t]=8*o[t].length*o.length})),null!=l?Y(e,I,r,a,i,n,t,l,s):Y(e,I,r,a,i,n,t)}function Y(e,t,l,n,c,d,p,u,f){if(null!=u){s="s"+u+"_t"+p,r="s"+u;let i='<input type="text" id="'+s+'" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:'+(Math.max(...t)+20)+"px;"+l+'" />',a='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="text" class="corr_div" style="width:'+(Math.max(...t)+20)+"px;"+l+'" >'+e[0]+"</span>"+i+"</span>",o=f.replace(n,a);m[u].__cdata=o}else{if(c<=x)var h=c;else h=w;s="s"+h+"_t"+p,r="s"+h;let t='<input type="text" id="'+s+'" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none"  style="width:38px;'+l+'" />',m='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="" class="corr_div h-imp">'+e[0]+"</span>"+t+"</span>";o=o.replace(n,m),a=O(a,s,r,d),i(3,v.smans=a,v)}}function Z(e){b=0,_+=1;for(let i in a)for(let l in a[i]){if(e<x)var t=e;else t=w;if(n["s"+t]&&null!=n["s"+t][l])if(a["s"+t][l].value==n["s"+t][l].value)X("correct",l);else if(/\,/g.test(a["s"+t][l].value)){let e=a["s"+t][l].value.split(","),i=n["s"+t][l].value;e.indexOf(i)>-1?X("correct",l):(b=1,X("wrong",l))}else b=1,X("wrong",l)}1==l.smxml.step[w]._mode?function(e,t){var i=0;b>0?(i=0,e<=x?a[t].overall=i:a[r].overall=i):(i=1,e<=x?a[t].overall=i:a[r].overall=i);U()}(e,"s"+e):function(e,t){var l=0;b>0?(i(5,M.classChange=M.itemArray.length-1,M),i(5,M.isColor=!1,M),l=0,e<=x?a[t].overall=l:(a[r].overall=l,D())):(i(5,M.classChange=M.itemArray.length-1,M),i(5,M.isColor=!0,M),l=1,e<=x?a[t].overall=l:(a[r].overall=l,U()));_>1&&U();n[r]&&null!=n[s]&&(n[r].optry=_);var o=setTimeout((function(){i(5,M.classChange=-1,M),clearTimeout(o)}),2500)}(e,"s"+e)}function X(e,t){if(1!=l.smxml.step[w]._mode){if("correct"==e?(c.select("#"+t,"removeClass","false-hover"),c.select("#"+t,"addClass","true-hover")):"wrong"==e&&(c.select("#"+t,"removeClass","true-hover"),c.select("#"+t,"addClass","false-hover")),_>1){let e=Math.max(...I);e<45&&(e="45px"),c.select(c.select("#"+t).previousElementSibling,"css",{width:e+"px"}),c.select(c.select("#"+t).previousElementSibling.nextSibling,"css",{width:e+"px"}),c.select(c.select("#"+t).previousElementSibling,"removeClass","h-imp")}if(1!=l.smxml._fixed)var i=setTimeout((function(){c.select(c.select("#"+t).previousElementSibling.nextSibling,"css",{width:N}),c.select(c.select("#"+t).previousElementSibling,"addClass","h-imp"),clearTimeout(i)}),2e3)}R&&c.selectAll(".edit_step").forEach((function(e,i){e.classList.contains("mathquill")?c.select("#"+t).previousElementSibling.classList.contains("disable_div")&&c.select(c.select("#"+t).previousElementSibling,"removeClass","h"):e.classList.contains("answer_input")&&(e.disabled=!0),e.classList.add("data-check")}))}function G(){i(0,T=!0),D(),ee(),document.querySelectorAll(".fillintheblank").disabled=!0}function W(){i(0,T=!1),i(5,M.display=-1,M),i(5,M.smController=" h",M),c.selectAll(".fillintheblank","removeClass","default-hover"),c.selectAll(".fillintheblank").disabled=!1,i(5,M.main_steps=!1,M),i(5,M.correct_answer=!0,M),c.selectAll(".remed_disable","css",{display:"none"}),(null==l.smxml.step[w+1]&&"1"==l.smxml.step[w]._attempt||null==l.smxml.step[w+1]&&"1"==l.smxml.step[w]._viewonly)&&c.selectAll(".edit_step").length==c.selectAll(".data-check").length?i(5,M.hideNext=!0,M):i(5,M.hideNext=!1,M),window.inNative&&window.getHeight&&window.getHeight()}function K(){i(5,M.display=-1,M),c.selectAll(".fillintheblank","addClass","default-hover"),c.selectAll(".edit_step","hide"),c.selectAll(".corr_div","removeClass","h-imp"),c.selectAll("#text","removeClass","corr_div"),c.selectAll("#text","addClass","corr_div_correct"),l.smxml.step.map((function(e,t){L("corr_ans",e.__cdata,t)})),i(5,M.main_steps=!0,M),i(5,M.correct_answer=!1,M),window.inNative&&window.getHeight&&window.getHeight()}function ee(){i(5,M.display=1,M),i(5,M.hideNext=!0,M),i(5,M.smController="",M),c.selectAll(".fillintheblank","removeClass","default-hover"),c.selectAll(".corr_div","addClass","h-imp"),c.selectAll(".edit_step","show"),c.selectAll("#text","addClass","corr_div"),c.selectAll("#text","removeClass","corr_div_correct"),i(5,M.main_steps=!1,M),i(5,M.correct_answer=!0,M),c.selectAll(".remed_disable","css",{display:"block"}),window.inNative&&window.getHeight&&window.getHeight()}function te(e,t,i,l,s){let a=e;(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0]=e[0].replace(/user Response/g,"\\MathQuillMathField");let n=e[0].split("##"),r=Math.floor(Math.random()*n.length),o=n[r],c=o.replace(/MathQuillMathField{(.*?)}/g,"MathQuillMathField{}"),d=0,m=o,p=m.replace(/\\MathQuillMathField/g,"");o.indexOf("MathQuillMathField")>-1&&(m=o,d=1),null!=l?ie(c,e,a,i,t,r,d,m,p,l,s):ie(c,e,a,i,t,r,d,m,p)}function ie(e,t,l,n,p,f,h,g,b,_,y){let k=t[0].trim();if(n<=x)var A=n;else A=w;if(null!=_){s="s0"+_+"_t"+p,r="s0"+_;let t='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m0"+_+"_t"+p)+'" class="corr_div fillmathelement h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" anskey="'+g+'" defaultans="'+h+'" mathtype="1">'+b+"</span>"+('<span  id="'+s+'" class="auto_height edit_step fillmathelement h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" userans="'+e+'" anskey="'+g+'" defaultans="'+h+'" mathtype="1">s</span>')+"</span>",i=y.replace(l,t);m[_].__cdata=i}else{s="s"+A+"_t"+p,r="s"+A;let t='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m"+A+"_t"+p)+'" class="corr_div h-imp fillmathelement h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" anskey="'+g+'" defaultans="'+h+'" mathtype="1">'+b+"</span>"+('<span  id="'+s+'" class="auto_height edit_step fillmathelement h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" userans="'+e+'" anskey="'+g+'" defaultans="'+h+'" mathtype="1">s</span>')+"</span>";o=o.replace(l,t),a=O(a,s,r,k),i(3,v.smans=a,v)}let S=setInterval(function(){"function"==typeof MathQuill&&window.jQuery&&(clearInterval(S),u||(u=MathQuill.getInterface(2)),c.selectAll(".mathquill.mq"+A).forEach((e=>{let t=e.getAttribute("id");if(1==e.getAttribute("defaultans")){let i=e.getAttribute("userans");null!=i&&(c.select("#"+t).innerText=i)}else c.select("#"+t).innerText=e.getAttribute("userans");try{i(2,d[t]=u.StaticMath(document.getElementById(t)),d)}catch(e){console.log(e)}})))}.bind(this),100)}function le(e,t){let i,l=[],s=jQuery(e).closest("div").find("span.fillelement").attr("id"),a=jQuery(e).attr("id"),r=jQuery(e).attr("userans").trim();if("math_user"==t)i=r;else{let e=u.StaticMath(document.getElementById(a));for(let t=0;t<=e.innerFields.length-1;t++)l[t]=e.innerFields[t].latex();let t=r,s=r.match(/\\MathQuillMathField{(.*?)\}/g);for(let e in s){const i="\\MathQuillMathField{"+l[e]+"}",a=s[e].replace(/\\MathQuillMathField{(.*?)\}/g,i);let n=s[e];t=t.replace(n,a)}r=t,i=r}n=O(n,a,s,i),J(n)}y((()=>{if(c.addScript("",itemUrl+"src/libs/mathQuill_new.js"),R){let e=k(R);e?.smans&&e?.smans.div&&e?.smans.div._userAns&&function(e){let t=k(e);S&&(g=JSON.parse(t.smans.div._lists));x=JSON.parse(t.smans.div._currStep)}(R)}if($!=M.xml){if(i(5,M.xml=$,M),1==E)return!1;R||(w=0,i(5,M.itemArray=[],M),n={},i(5,M.hideNext=!1,M),c.find(document,".sticky",{action:"removeClass",actionData:"sticky"}),c.selectAll(".edit_step","removeAttr","disabled"),c.selectAll(".edit_step").value=""),i(5,M.blank=!1,M),function(e){S=!1,"undefined"!=e.smxml.algo&&e.smxml.algo&&(S=!0);S&&(h=j.init(e.smxml.algo));let t=JSON.stringify(e);if(S){if(R){let e=k(R);e.smans&&e.smans.div&&e.smans.div._lists&&(h=g)}l=j.init.replaceVariables(t,h),l=JSON.parse(l)}else l=e;let i=l.smxml.step;m=i.slice(),"function"!=typeof Object.assign&&(Object.assign=function(e){if(null==e)throw new TypeError("Cannot convert undefined or null to object");e=Object(e);for(var t=1;t<arguments.length;t++){var i=arguments[t];if(null!=i)for(var l in i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l])}return e});if(i.map((function(e,t){m[t]=Object.assign({},e)})),""!=x){w=x;for(let e=0;e<=x;e++)P(e)}else P();if(R){let e=k(R);if(e?.smans&&e?.smans.div&&e?.smans.div._userAns)var s=setTimeout((function(){!function(e){let t=k(e);if(t.smans&&t.smans.div&&t.smans.div._userAns){t=JSON.parse(t.smans.div._userAns);for(let e in t)for(let i in t[e]){let l=e.split("")[1],s=t[e][i].value;c.select("#"+i).classList.contains("mathquill")?(c.select("#"+i,"userans",s),le("#"+i,"math_user")):(c.select("#"+i).value=s,z(c.select("#"+i))),_=0,Q(),Z(l)}}}(R),clearTimeout(s)}),50)}}(k(M.xml))}})),A((()=>{c.listen(document,"keydown",".edit_step",(function(e,t){let i=10*t.target.value.split("").length+45+"px";e.style.width=i,t.target.previousSibling&&(t.target.previousSibling.style.width=i),N=i})),c.set("stepAlgo",this),in_editor&&c.addScript("","https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"),window.inNative&&window.getHeight&&window.getHeight(),setTimeout((function(){c.selectAll(".toolbar_container_one","addClass","h-imp")}),100),c.listen(document,"click",".edit_step",(e=>{z(e)})),c.listen(document,"keyup",".edit_step",(e=>{z(e)})),c.listen(document,"change",".edit_step",(e=>{z(e)})),c.listen(document,"click","span.mq-editable-field.mq-focused",(e=>{let t,l=e,s=!0;for(;s;)l=l.parentElement,l.getAttribute("id")&&(s=!1,t=l.getAttribute("id"),i(4,p=t));let a=[];c.selectAll("#"+t+" span.mq-editable-field").forEach((e=>{let t=e.getAttribute("mathquill-command-id");a.push(t)}));let n=e.getAttribute("mathquill-command-id"),r=a.indexOf(n);i(5,M.spanId=r,M),i(5,M.divId=t,M),c.selectAll(".toolbar_container_one","removeClass","h-imp"),i(5,M.showToolbar=!0,M)})),c.listen(document,"click",".next_step",(function(e,t){"undefined"!=typeof QUIZPLAYERID&&window.parentElement.autoResize(QUIZPLAYERID),t.preventDefault(),Q()})),setTimeout((function(){c.listen(document,"click","#set-review",(function(){G()})),c.listen(document,"click","#unset-review",(function(){W()}))}),1e3),window.inNative&&setTimeout((function(){window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*")}),200),window.inNative&&(window.checkReview=e=>e?self.setReview():self.unsetReview())}));return e.$$set=e=>{"xml"in e&&i(12,$=e.xml),"stopPreviewUpdate"in e&&i(13,E=e.stopPreviewUpdate),"isReview"in e&&i(0,T=e.isReview),"uxml"in e&&i(14,R=e.uxml)},e.$$.update=()=>{if(3&e.$$.dirty[0]&&F!=T){if(T)var t=setTimeout((function(){G(),clearTimeout(t)}),500);else var l=setTimeout((function(){W(),clearTimeout(l)}),200);i(1,F=T)}},[T,F,d,v,p,M,function(e){if(null!=l.smxml.step[e]&&1==l.smxml.step[e]._sticky)return"sticky"},function(e){i(5,M.showToolbar=e,M)},H,G,W,function(e,t){"c"==e?K():ee()},$,E,R,function(t){e.$$.not_equal(M.showToolbar,t)&&(M.showToolbar=t,i(5,M))},()=>setTimeout((function(){H()}),100)]}j.init=function(e,t){let i="";try{i=j.util.generateVariables(e,t)}catch(e){swal({html:!0,title:"",text:"<b>"+e+"<br/><br/>Variables are not correctly defined!</b>",type:"error"})}return console.log("var llist",i),i},j.util={generateVariables:function(e,t){const i=/is_advance[\s]*=([\s"'\d]*)/;let l="",s={};var a=e.split("\n");try{j.mathtype=+a[0].match(i)[1].match(/[\d]+/)}catch(e){j.mathtype=""}for(let e=0;e<a.length;e++){let t=a[e].split("=");switch(l=t[1].substr(0,t[1].indexOf("(")).trim(),l){case"rand_int":l="randInt";break;case"rand_float":l="randFloat";break;case"uc_sqrt":l="ucSqrt";break;case"rand_obj":l="randObj"}if("object"!=typeof j.math[l]&&(l=""),""!=l){let e,i,a,n=[],r=/\(([^)]+)\)/.exec(t[1]);switch(l.trim()){case"randInt":n=r[1].split(","),e=parseInt(n[0]),i=parseInt(n[1]),a=parseInt(n[2]),s[t[0].trim()]=j.math[l].f(e,i,a);break;case"randFloat":n=r[1].split(","),e=parseFloat(n[0]),i=parseFloat(n[1]),a=parseInt(n[2]),s[t[0].trim()]=j.math[l].f(e,i,a);break;case"ucSqrt":n=r[1].split(","),e=parseInt(n[0]),i=parseInt(n[1]),s[t[0].trim()]=j.math[l].f(e,i);break;case"ucPow":n=r[1].split(","),e=parseInt(n[0]),i=parseInt(n[1]),a=parseInt(n[2]),s[t[0].trim()]=j.math[l].f(e,i,a);break;default:let o=JSON.stringify(r[1]);o=o.trim().replace(/"|\\/g,""),s[t[0].trim()]=j.math[l].f(o)}}if(""==l){const e=/(\*|\+|\-|\/|\^|\%|\(|\)|\,|\[|\]|\#)/g,i=/;|\\/g;let l=t[1].split(e),a="";var n=!1;for(let e=0;e<l.length;e++)if(l[e]=l[e].trim(),";"!=l[e]&&""!=l[e]){l[e]=l[e].replace(i,""),"#"==l[e]?l[e]="'":l[e]=s.hasOwnProperty(l[e])?s[l[e]]:isNaN(+l[e])?l[e]:+l[e];let t=l[e];t="string"==typeof t?t.trim():t,"math.setCartesian"==t&&(n=!0),a+=l[e]}if(2==j.mathtype){if(1==n){for(var r=(0,eval)(a),o="",c=0;c<r.length;c++)r[c]="("+r[c]+") ",o+=r[c];s[t[0].trim()]=o}n||(s[t[0].trim()]=(0,eval)(a).toString()),""==s[t[0].trim()]&&(s[t[0].trim()]="None of these")}""==j.mathtype&&(s[t[0].trim()]=(0,eval)(a.trim()))}}return s}},j.init.replaceVariables=function(e,t){for(let l in t){var i=new RegExp("<{"+l+"}>","g");e=e.replace(i,t[l])}return e},j.math={randObj:{text:"Randomize Object",description:"Find the random string or character",param:"(javascript,java,C,react,php)",use:"randObj(javascript,php,java,c)",f:function(e){let t=e.split(",");return t[j.math.randInt.f(0,t.length-1)]}},randInt:{text:"Randomize Integer",description:"Find the random integer value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randInt(1,4,2)",f:function(e,t,i){return(Math.floor(Math.random()*(t-e+1))+e).toFixed(i)}},randFloat:{text:"Randomize Float",description:"Find the random float/decimal value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randFloat(1,4,2)",f:function(e,t,i){return(Math.random()*(t-e)+e).toFixed(i)}},ucSqrt:{text:"Square root",description:"Find the square root (value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucSqrt(9,2)",f:function(e,t){return Math.sqrt(e).toFixed(t)}},ucPow:{text:"Power",description:"Return the value of the number 4 to the power of 3(value, power, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucPow(4,3,2)",f:function(e,t,i){return Math.pow(e,t).toFixed(i)}}};class Q extends e{constructor(e){super(),t(this,e,z,F,i,{xml:12,stopPreviewUpdate:13,isReview:0,uxml:14},$,[-1,-1,-1])}}function P(e){let t,i;return t=new Q({props:{xml:e[0],remedStatus:e[1],showAns:e[2],stopPreviewUpdate:e[3],isReview:e[6],uxml:e[7]}}),{c(){a(t.$$.fragment)},m(e,l){m(t,e,l),i=!0},p(e,i){const l={};1&i&&(l.xml=e[0]),2&i&&(l.remedStatus=e[1]),4&i&&(l.showAns=e[2]),8&i&&(l.stopPreviewUpdate=e[3]),64&i&&(l.isReview=e[6]),128&i&&(l.uxml=e[7]),t.$set(l)},i(e){i||(v(t.$$.fragment,e),i=!0)},o(e){g(t.$$.fragment,e),i=!1},d(e){x(t,e)}}}function L(e){let t,i,l=(2==e[4]?.content_icon||2==e[5])&&P(e);return{c(){t=s("main"),l&&l.c()},m(e,s){d(e,t,s),l&&l.m(t,null),i=!0},p(e,[i]){2==e[4]?.content_icon||2==e[5]?l?(l.p(e,i),48&i&&v(l,1)):(l=P(e),l.c(),v(l,1),l.m(t,null)):l&&(b(),g(l,1,1,(()=>{l=null})),_())},i(e){i||(v(l),i=!0)},o(e){g(l),i=!1},d(e){e&&f(t),l&&l.d()}}}function H(e,t,i){let{xml:l}=t,{remedStatus:s}=t,{showAns:a}=t,{stopPreviewUpdate:n}=t,{editorState:r}=t,{content_icon:o}=t,{isReview:c}=t,{uxml:d}=t;return e.$$set=e=>{"xml"in e&&i(0,l=e.xml),"remedStatus"in e&&i(1,s=e.remedStatus),"showAns"in e&&i(2,a=e.showAns),"stopPreviewUpdate"in e&&i(3,n=e.stopPreviewUpdate),"editorState"in e&&i(4,r=e.editorState),"content_icon"in e&&i(5,o=e.content_icon),"isReview"in e&&i(6,c=e.isReview),"uxml"in e&&i(7,d=e.uxml)},[l,s,a,n,r,o,c,d]}export default class extends e{constructor(e){super(),t(this,e,H,L,i,{xml:0,remedStatus:1,showAns:2,stopPreviewUpdate:3,editorState:4,content_icon:5,isReview:6,uxml:7})}}
//# sourceMappingURL=ItemPluginPreview-7db9472c.js.map
