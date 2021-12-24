import{S as e,i as t,s as i,D as l,e as s,c as n,b as a,B as r,f as o,A as c,h as d,m,j as p,l as u,o as f,N as h,t as g,a as v,d as x,z as b,k as w,n as _,C as y,X as k,p as A,a4 as S,G as q,H as M,w as C,W as I}from"./main-7f25568c.js";import{I as N}from"./ItemHelper-9dafb813.js";import"./style-inject.es-1f59c1d0.js";import{F as j}from"./mathquill-4a3a5b3a.js";var $=$||{mathtype:""};function E(e){l(e,"svelte-dzqcfp",'.darkgrey_border{border:1px solid #ccc!important}.p-lg{padding:15px}.true-hover{outline:0;border:2px solid #14ca14!important}.false-hover{outline:0;border:1px solid #e45252!important}.default-hover{border-color:transparent!important;-webkit-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;-moz-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important}.blocked{display:block !important}.border_green{border:3px solid green!important}.border_red{border:3px solid red!important}.sticky{z-index:800;position:sticky;top:0\r\n\t}.corr_div{width:38px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default;position:absolute !important}.corr_div_correct{position:relative;width:38px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default}[id^="fillmain"]{overflow:hidden;text-align:left}[id^="fillmain"] pre{background:none;border:none;font-size:14px!important}[id^="fillmain"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^="fillmain"] .footerstr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^="fillmain"] .footerstr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^="fillmain"] .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}[id^="fillmain"] input[type="text"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^="fillmain"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^="fillmain"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^="fillmain"] .drag-resize.ui-draggable{cursor:move}[id^="fillmain"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^="fillmain"] .fillcheck ul{width:220px}[id^="fillmain"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^="fillmain"] .select{font-size:15px}[id^="fillmain"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}')}function T(e,t,i){const l=e.slice();return l[70]=t[i],l[72]=i,l}function R(e,t,i){const l=e.slice();return l[70]=t[i],l[72]=i,l}function F(e){let t,i,l,w,_,y,k,A,S,C,I,$,E,F,Q,P,L,H,U,J,D;i=new N({props:{handleReviewClick:e[12],reviewMode:e[0],customReviewMode:e[1]}}),i.$on("setReview",e[10]),i.$on("unsetReview",e[11]);let V=e[6].itemArray,B=[];for(let t=0;t<V.length;t+=1)B[t]=O(R(e,V,t));let Y=e[3],Z=[];for(let t=0;t<Y.length;t+=1)Z[t]=z(T(e,Y,t));function X(t){e[16](t)}let G={spanId:e[6].spanId,divId:e[6].divId,action:e[2][e[5]],show:e[8]};return void 0!==e[6].showToolbar&&(G.display=e[6].showToolbar),$=new j({props:G}),q.push((()=>M($,"display",X))),{c(){t=s("center"),n(i.$$.fragment),l=a(),w=s("div");for(let e=0;e<B.length;e+=1)B[e].c();k=a(),A=s("div");for(let e=0;e<Z.length;e+=1)Z[e].c();I=a(),n($.$$.fragment),F=a(),Q=s("div"),P=s("button"),P.textContent=""+r.next,o(w,"class",_=e[6].correct_answer?"":"h-imp"),o(w,"style",y="width:"+(c.isValid(window.inNative)?"100%":"700px")),o(A,"class",S=e[6].correct_answer?"h-imp":""),o(A,"style",C="width:"+(c.isValid(window.inNative)?"100%":"700px")),o(P,"type","button"),o(P,"style",L="width:auto;font-size:15px;margin:15px 0;"),o(P,"class","btn btn-sm btn-outline-primary imgcenter next_step px-md-5 px-sm-3"),o(Q,"class",H=e[6].hideNext?"h-imp":null)},m(s,n){d(s,t,n),m(i,t,null),p(t,l),p(t,w);for(let e=0;e<B.length;e+=1)B[e].m(w,null);p(t,k),p(t,A);for(let e=0;e<Z.length;e+=1)Z[e].m(A,null);p(t,I),m($,t,null),p(t,F),p(t,Q),p(Q,P),U=!0,J||(D=u(P,"click",e[17]),J=!0)},p(e,t){const l={};if(1&t[0]&&(l.reviewMode=e[0]),2&t[0]&&(l.customReviewMode=e[1]),i.$set(l),209&t[0]){let i;for(V=e[6].itemArray,i=0;i<V.length;i+=1){const l=R(e,V,i);B[i]?B[i].p(l,t):(B[i]=O(l),B[i].c(),B[i].m(w,null))}for(;i<B.length;i+=1)B[i].d(1);B.length=V.length}if((!U||64&t[0]&&_!==(_=e[6].correct_answer?"":"h-imp"))&&o(w,"class",_),217&t[0]){let i;for(Y=e[3],i=0;i<Y.length;i+=1){const l=T(e,Y,i);Z[i]?Z[i].p(l,t):(Z[i]=z(l),Z[i].c(),Z[i].m(A,null))}for(;i<Z.length;i+=1)Z[i].d(1);Z.length=Y.length}(!U||64&t[0]&&S!==(S=e[6].correct_answer?"h-imp":""))&&o(A,"class",S);const s={};64&t[0]&&(s.spanId=e[6].spanId),64&t[0]&&(s.divId=e[6].divId),36&t[0]&&(s.action=e[2][e[5]]),!E&&64&t[0]&&(E=!0,s.display=e[6].showToolbar,h((()=>E=!1))),$.$set(s),(!U||64&t[0]&&H!==(H=e[6].hideNext?"h-imp":null))&&o(Q,"class",H)},i(e){U||(g(i.$$.fragment,e),g($.$$.fragment,e),U=!0)},o(e){v(i.$$.fragment,e),v($.$$.fragment,e),U=!1},d(e){e&&f(t),x(i),b(B,e),b(Z,e),x($),J=!1,D()}}}function O(e){let t,i,l,n,r,c,m,u,h,g,v,x,b,w=e[70].cdata+"";return{c(){t=s("div"),i=s("div"),l=s("div"),n=s("div"),v=a(),o(n,"seq",r="s"+e[72]),o(l,"id",c="data-block_"+e[72]),o(l,"class",m="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(1==e[6].display&&e[4]?.smans&&null!=e[4]?.smans["s"+e[72]]&&e[0]?1==e[4]?.smans["s"+e[72]].overall?"border_green":"border_red":"")),o(l,"key",u=e[72]),o(i,"id",h="s"+e[72]),o(i,"class",g="bg-white"),o(t,"data-sticky",x=e[7](e[72])),o(t,"class","bt-pd bg-white mt-3"),o(t,"tabindex",b=0)},m(e,s){d(e,t,s),p(t,i),p(i,l),p(l,n),n.innerHTML=w,p(t,v)},p(e,t){64&t[0]&&w!==(w=e[70].cdata+"")&&(n.innerHTML=w),81&t[0]&&m!==(m="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(1==e[6].display&&e[4]?.smans&&null!=e[4]?.smans["s"+e[72]]&&e[0]?1==e[4]?.smans["s"+e[72]].overall?"border_green":"border_red":""))&&o(l,"class",m)},d(e){e&&f(t)}}}function z(e){let t,i,l,n,r,c,m,u,h,g,v,x,b,w=e[70].__cdata+"";return{c(){t=s("div"),i=s("div"),l=s("div"),n=s("div"),v=a(),o(n,"seq",r="s"+e[72]),o(l,"id",c="data-block_"+e[72]),o(l,"class",m="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(1==e[6].display&&e[4]?.smans&&null!=e[4].smans["s"+e[72]]&&e[0]?1==e[4].smans["s"+e[72]].overall?"border_green":"border_red":"")),o(l,"key",u=e[72]),o(i,"id",h="s"+e[72]),o(i,"class",g="bg-white "),o(t,"data-sticky",x=e[7](e[72])),o(t,"class","bt-pd bg-white mt-3"),o(t,"tabindex",b=0)},m(e,s){d(e,t,s),p(t,i),p(i,l),p(l,n),n.innerHTML=w,p(t,v)},p(e,t){8&t[0]&&w!==(w=e[70].__cdata+"")&&(n.innerHTML=w),81&t[0]&&m!==(m="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(1==e[6].display&&e[4]?.smans&&null!=e[4].smans["s"+e[72]]&&e[0]?1==e[4].smans["s"+e[72]].overall?"border_green":"border_red":""))&&o(l,"class",m)},d(e){e&&f(t)}}}function Q(e){let t,i,l=0==e[6].blank&&F(e);return{c(){t=s("main"),l&&l.c()},m(e,s){d(e,t,s),l&&l.m(t,null),i=!0},p(e,i){0==e[6].blank?l?(l.p(e,i),64&i[0]&&g(l,1)):(l=F(e),l.c(),g(l,1),l.m(t,null)):l&&(w(),v(l,1,1,(()=>{l=null})),_())},i(e){i||(g(l),i=!0)},o(e){v(l),i=!1},d(e){e&&f(t),l&&l.d()}}}function P(e,t,i,l){return void 0!==e[i]&&void 0!==e[i][t]||(void 0===e[i]&&(e[i]={}),e[i][t]={}),e[i][t].value=l,e}function L(e,t,i){let l,s,n={},a={},r="",o="",d=[];var m=[];let p,u,f={},h="",g={},v="",x="",b=0,w=0,_=0,q=!1,M={},N=[],j="",{xml:E}=t,{stopPreviewUpdate:T}=t,{isReview:R}=t,{uxml:F}=t,O=R;C({blank:!0,hideNext:!1,itemArray:[],classChange:-1,isColor:!0,smController:"h",display:-1,showToolbar:!0,isMathquill:!1,correct_answer:!0,main_steps:!1,your_answer:[]}).subscribe((e=>{i(6,M=e)}));function z(e){if(e.nodeName)if(e.classList.contains("mathquill"))se(e,!1);else{let t=e.getAttribute("id"),i=e.closest("div").getAttribute("seq"),l=e.value;a=P(a,t,i,l),D(a)}}function Q(){if(a)for(let e in a)for(let t in a[e]){let i=a[e][t].value;if(""!=i){let e=i.match(/MathQuillMathField\{(.*?)\}/g);e?e.map((function(e){""==e.toString().replace(/MathQuillMathField\{|\}/g,"")?c.select("#"+t,"removeClass","answer_input"):c.select("#"+t,"addClass","answer_input")})):c.select("#"+t,"addClass","answer_input")}else c.select("#"+t,"removeClass","answer_input")}}function L(e){q&&i(4,g.var_list=h,g),i(4,g.cuurentStep=b,g),_=0;const t=M.itemArray;var s,n;s=l,(n=e)<=x?(o=s.smxml.step[n].__cdata,H(n,o)):null!=s.smxml.step[b]&&(o=s.smxml.step[b].__cdata,H(n,o)),t.push({cdata:o}),i(6,M.itemArray=t,M)}function H(e,t,l){let s=t.match(/%{[\s\S]*?}%/gm),n="";if(!s)return"";s.forEach((function(t,a){if(null!=l)var r=m[l].__cdata;let o=s[a];n=s[a].match(/\|(.*?)}%$/gm),n=n?n[0].replace(/\||}%/gm,""):"",n=n.trim(),""==n||"c"==n||"n"==n?null!=l?Y(o,a,e,l,r):Y(o,a,e):"e"==n&&(i(6,M.isMathquill=!0,M),null!=l?ie(o,a,e,l,r):ie(o,a,e))}))}function U(){if(l.smxml.step[b]._attempt="1","undefined"!=typeof QUIZPLAYERID)var e=setTimeout((function(){window.parentElement.autoResize(QUIZPLAYERID),clearTimeout(e)}),0);null!=l.smxml.step[b+1]||"1"==l.smxml.step[b]._attempt?(1==l.smxml._gonext?function(){let e="s"+b;c.find("#"+e,".edit_step","all").forEach((function(t,i){if(t.classList.contains("mathquill"))se(t,!1);else{let i=t.getAttribute("id"),l=t.value;a=P(a,i,e,l)}})),1==l.smxml.step[b]._attempt?X():(J(),B())}():1==l.smxml.step[b]._attempt?c.selectAll(".edit_step").length==c.selectAll(".answer_input").length?X():c.selectAll(".edit_step").forEach((e=>{if(!e.classList.contains("answer_input")){e.style.border="2px solid #ff0000";var t=setTimeout((function(){e.style.border="1px solid #ccc",clearTimeout(t)}),500)}})):(J(),B()),l.smxml.step.length<=l.smxml.step[b]._seq&&1!=l.smxml.step[b]._attempt&&i(6,M.hideNext=!0,M)):i(6,M.hideNext=!0,M)}function J(){if(c.selectAll(".edit_step").forEach((e=>{e.classList.contains("mathquill")?e.previousElementSibling.classList.contains("disable_div")&&c.select(e.previousElementSibling,"removeClass","h"):e.disabled=!0,e.classList.add("data-check")})),_=0,null==l.smxml.step[b+1]&&"1"==l.smxml.step[b]._attempt)return i(6,M.hideNext=!0,M),D(a),void V();b!=l.smxml.step.length-1?(b+=1,L(b),D(a),V()):console.log("All steps are attempted")}function D(e){window.inNative&&window.getHeight&&window.getHeight();var t=q?"lists="+JSON.stringify(g.var_list):" ";f.special="<smans><div "+t+" currStep='"+b+"' userAns='"+JSON.stringify(e)+"'></div></smans>"}function V(){let e=!1,t=null,i=!1;if(l.smxml.step.length==M.itemArray.length){let t=!0;for(let l in n)null!=n[l].overall&&(e=1==n[l].overall,t=t&&e),0==t?(c.select("#answer").checked=!1,f.answer=!1,i=!1):(c.select("#answer").checked=!0,f.answer=!0,i=!0)}t=f.special,window.inNative&&(window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*"),window.postMessage(JSON.stringify({userAnswers:t,inNativeIsCorrect:i}),"*")),I({uXml:f.special,ans:f.answer})}function B(){c.select("[data-sticky]","addClass","sticky")}function Y(e,t,i,l,s){let n=e,a=((e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&e[1].trim(),e[0].trim()),r="";if(-1!=a.indexOf("#style#")){let e=a.split("#style#");a=e[0],r=e[1]}N=[];let o=a.split(",");o.forEach((function(e,t){N[t]=8*o[t].length*o.length})),null!=l?Z(e,N,r,n,i,a,t,l,s):Z(e,N,r,n,i,a,t)}function Z(e,t,l,a,c,d,p,u,f){if(null!=u){s="s"+u+"_t"+p,r="s"+u;let n='<input type="text" id="'+s+'" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:'+(Math.max(...t)+20)+"px;"+l+'" />',o='<span id="'+r+'" class="text-center filter fillelement position-relative inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="text" class="corr_div" style="width:'+(Math.max(...t)+20)+"px;"+l+'" >'+e[0]+"</span>"+n+"</span>",c=f.replace(a,o);i(3,m[u].__cdata=c,m)}else{if(c<=x)var h=c;else h=b;s="s"+h+"_t"+p,r="s"+h;let t='<input type="text" id="'+s+'" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none"  style="width:38px;'+l+'" />',m='<span id="'+r+'" class="text-center filter fillelement position-relative inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="" class="corr_div h-imp">'+e[0]+"</span>"+t+"</span>";o=o.replace(a,m),n=P(n,s,r,d),i(4,g.smans=n,g)}}function X(e){w=0,_+=1;for(let i in n)for(let l in n[i]){if(e<x)var t=e;else t=b;if(a["s"+t]&&null!=a["s"+t][l])if(n["s"+t][l].value==a["s"+t][l].value)G("correct",l);else if(/\,/g.test(n["s"+t][l].value)){let e=n["s"+t][l].value.split(","),i=a["s"+t][l].value;e.indexOf(i)>-1?G("correct",l):(w=1,G("wrong",l))}else w=1,G("wrong",l)}1==l.smxml.step[b]._mode?function(e,t){var i=0;w>0?(i=0,e<=x?n[t].overall=i:n[r].overall=i):(i=1,e<=x?n[t].overall=i:n[r].overall=i);J()}(e,"s"+e):function(e,t){var l=0;w>0?(i(6,M.classChange=M.itemArray.length-1,M),i(6,M.isColor=!1,M),l=0,e<=x?n[t].overall=l:(n[r].overall=l,V())):(i(6,M.classChange=M.itemArray.length-1,M),i(6,M.isColor=!0,M),l=1,e<=x?n[t].overall=l:(n[r].overall=l,J()));_>1&&J();a[r]&&null!=a[s]&&(a[r].optry=_);var o=setTimeout((function(){i(6,M.classChange=-1,M),clearTimeout(o)}),2500)}(e,"s"+e)}function G(e,t){if(1!=l.smxml.step[b]._mode){if("correct"==e?(c.select("#"+t,"removeClass","false-hover"),c.select("#"+t,"addClass","true-hover")):"wrong"==e&&(c.select("#"+t,"removeClass","true-hover"),c.select("#"+t,"addClass","false-hover")),_>1){let e=Math.max(...N);e<45&&(e="45px"),c.select(c.select("#"+t).previousElementSibling,"css",{width:e+"px"}),c.select(c.select("#"+t).previousElementSibling.nextSibling,"css",{width:e+"px"}),c.select(c.select("#"+t).previousElementSibling,"removeClass","h-imp")}1!=l.smxml._fixed&&(c.select(c.select("#"+t).previousElementSibling.nextSibling,"css",{width:j}),c.select(c.select("#"+t).previousElementSibling,"addClass","h-imp"))}F&&c.selectAll(".edit_step").forEach((function(e,i){e.classList.contains("mathquill")?c.select("#"+t).previousElementSibling.classList.contains("disable_div")&&c.select(c.select("#"+t).previousElementSibling,"removeClass","h"):e.classList.contains("answer_input")&&(e.disabled=!0),e.classList.add("data-check")}))}function W(){i(0,R=!0),V(),te(),document.querySelectorAll(".fillintheblank").disabled=!0}function K(){i(0,R=!1),i(6,M.display=-1,M),i(6,M.smController=" h",M),c.selectAll(".fillintheblank","removeClass","default-hover"),c.selectAll(".fillintheblank").disabled=!1,i(6,M.main_steps=!1,M),i(6,M.correct_answer=!0,M),c.selectAll(".remed_disable","css",{display:"none"}),(null==l.smxml.step[b+1]&&"1"==l.smxml.step[b]._attempt||null==l.smxml.step[b+1]&&"1"==l.smxml.step[b]._viewonly)&&c.selectAll(".edit_step").length==c.selectAll(".data-check").length?i(6,M.hideNext=!0,M):i(6,M.hideNext=!1,M),window.inNative&&window.getHeight&&window.getHeight()}function ee(){i(6,M.display=-1,M),c.selectAll(".fillintheblank","addClass","default-hover"),c.selectAll("#text","removeClass","corr_div"),c.selectAll("#text","addClass","corr_div_correct"),l.smxml.step.map((function(e,t){H("corr_ans",e.__cdata,t)})),i(6,M.main_steps=!0,M),i(6,M.correct_answer=!1,M),window.inNative&&window.getHeight&&window.getHeight()}function te(){i(6,M.display=1,M),i(6,M.hideNext=!0,M),i(6,M.smController="",M),c.selectAll(".fillintheblank","removeClass","default-hover"),c.selectAll("#text","addClass","corr_div"),c.selectAll("#text","removeClass","corr_div_correct"),i(6,M.main_steps=!1,M),i(6,M.correct_answer=!0,M),c.selectAll(".remed_disable","css",{display:"block"}),window.inNative&&window.getHeight&&window.getHeight()}function ie(e,t,i,l,s){let n=e;(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0]=e[0].replace(/user Response/g,"\\MathQuillMathField");let a=e[0].split("##"),r=Math.floor(Math.random()*a.length),o=a[r],c=o.replace(/MathQuillMathField{(.*?)}/g,"MathQuillMathField{}"),d=0,m=o,p=m.replace(/\\MathQuillMathField/g,"");o.indexOf("MathQuillMathField")>-1&&(m=o,d=1),null!=l?le(c,e,n,i,t,r,d,m,p,l,s):le(c,e,n,i,t,r,d,m,p)}function le(e,t,l,a,p,f,h,v,w,_,y){let k=t[0].trim();if(a<=x)var A=a;else A=b;if(null!=_){s="s0"+_+"_t"+p,r="s0"+_;let t='<span id="'+r+'" class="text-center filter fillelement position-relative inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m0"+_+"_t"+p)+'" class="corr_div fillmathelement position-absolute h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" anskey="'+v+'" defaultans="'+h+'" mathtype="1">'+w+"</span>"+('<span  id="'+s+'" class="auto_height edit_step fillmathelement h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" userans="'+e+'" anskey="'+v+'" defaultans="'+h+'" mathtype="1">s</span>')+"</span>",n=y.replace(l,t);i(3,m[_].__cdata=n,m)}else{s="s"+A+"_t"+p,r="s"+A;let t='<span id="'+r+'" class="text-center filter fillelement position-relative inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m"+A+"_t"+p)+'" class="corr_div h-imp fillmathelement h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" anskey="'+v+'" defaultans="'+h+'" mathtype="1">'+w+"</span>"+('<span  id="'+s+'" class="auto_height edit_step fillmathelement h-100 mathquill mq'+A+'" userAnsSeq="'+f+'" userans="'+e+'" anskey="'+v+'" defaultans="'+h+'" mathtype="1">s</span>')+"</span>";o=o.replace(l,t),n=P(n,s,r,k),i(4,g.smans=n,g)}let S=setInterval(function(){"function"==typeof MathQuill&&window.jQuery&&(clearInterval(S),u||(u=MathQuill.getInterface(2)),c.selectAll(".mathquill.mq"+A).forEach((e=>{let t=e.getAttribute("id");if(1==e.getAttribute("defaultans")){let i=e.getAttribute("userans");null!=i&&(c.select("#"+t).innerText=i)}else c.select("#"+t).innerText=e.getAttribute("userans");try{i(2,d[t]=u.StaticMath(document.getElementById(t)),d)}catch(e){console.log(e)}})))}.bind(this),100)}function se(e,t){let i,l=[],s=jQuery(e).closest("div").find("span.fillelement").attr("id"),n=jQuery(e).attr("id"),r=jQuery(e).attr("userans").trim();if("math_user"==t)i=r;else{let e=u.StaticMath(document.getElementById(n));for(let t=0;t<=e.innerFields.length-1;t++)l[t]=e.innerFields[t].latex();let t=r,s=r.match(/\\MathQuillMathField{(.*?)\}/g);for(let e in s){const i="\\MathQuillMathField{"+l[e]+"}",n=s[e].replace(/\\MathQuillMathField{(.*?)\}/g,i);let a=s[e];t=t.replace(a,n)}r=t,i=r}a=P(a,n,s,i),D(a)}y((()=>{if(c.addScript("",itemUrl+"src/libs/mathQuill_new.js"),F){let e=k(F);e?.smans&&e?.smans.div&&e?.smans.div._userAns&&function(e){let t=k(e);q&&(v=JSON.parse(t.smans.div._lists));x=JSON.parse(t.smans.div._currStep)}(F)}if(E!=M.xml){if(i(6,M.xml=E,M),1==T)return!1;F||(b=0,i(6,M.itemArray=[],M),a={},i(6,M.hideNext=!1,M),c.find(document,".sticky",{action:"removeClass",actionData:"sticky"}),c.selectAll(".edit_step","removeAttr","disabled"),c.selectAll(".edit_step").value=""),i(6,M.blank=!1,M),function(e){q=!1,"undefined"!=e.smxml.algo&&e.smxml.algo&&(q=!0);q&&(h=$.init(e.smxml.algo));let t=JSON.stringify(e);if(q){if(F){let e=k(F);e.smans&&e.smans.div&&e.smans.div._lists&&(h=v)}l=$.init.replaceVariables(t,h),l=JSON.parse(l)}else l=e;let s=l.smxml.step;i(3,m=s.slice()),"function"!=typeof Object.assign&&(Object.assign=function(e){if(null==e)throw new TypeError("Cannot convert undefined or null to object");e=Object(e);for(var t=1;t<arguments.length;t++){var i=arguments[t];if(null!=i)for(var l in i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l])}return e});if(s.map((function(e,t){i(3,m[t]=Object.assign({},e),m)})),""!=x){b=x;for(let e=0;e<=x;e++)L(e)}else L();if(F){let e=k(F);if(e?.smans&&e?.smans.div&&e?.smans.div._userAns)var n=setTimeout((function(){!function(e){let t=k(e);if(t.smans&&t.smans.div&&t.smans.div._userAns){t=JSON.parse(t.smans.div._userAns);for(let e in t)for(let i in t[e]){let l=e.split("")[1],s=t[e][i].value;c.select("#"+i).classList.contains("mathquill")?(c.select("#"+i,"userans",s),se("#"+i,"math_user")):(c.select("#"+i).value=s,z(c.select("#"+i))),_=0,Q(),X(l)}}}(F),clearTimeout(n)}),50)}}(k(M.xml))}})),A((()=>{c.listen(document,"keydown",".edit_step",(function(e,t){let i=10*t.target.value.split("").length+45+"px";e.style.width=i,t.target.previousSibling&&(t.target.previousSibling.style.width=i),j=i})),c.set("stepAlgo",this),in_editor&&c.addScript("","https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"),window.inNative&&window.getHeight&&window.getHeight(),setTimeout((function(){c.selectAll(".toolbar_container_one","addClass","h-imp")}),100),c.listen(document,"click",".edit_step",(e=>{z(e)})),c.listen(document,"keyup",".edit_step",(e=>{z(e)})),c.listen(document,"change",".edit_step",(e=>{z(e)})),c.listen(document,"click","span.mq-editable-field.mq-focused",(e=>{let t,l=e,s=!0;for(;s;)l=l.parentElement,l.getAttribute("id")&&(s=!1,t=l.getAttribute("id"),i(5,p=t));let n=[];c.selectAll("#"+t+" span.mq-editable-field").forEach((e=>{let t=e.getAttribute("mathquill-command-id");n.push(t)}));let a=e.getAttribute("mathquill-command-id"),r=n.indexOf(a);i(6,M.spanId=r,M),i(6,M.divId=t,M),c.selectAll(".toolbar_container_one","removeClass","h-imp"),i(6,M.showToolbar=!0,M)})),c.listen(document,"click",".next_step",(function(e,t){"undefined"!=typeof QUIZPLAYERID&&window.parentElement.autoResize(QUIZPLAYERID),t.preventDefault(),Q()})),setTimeout((function(){c.listen(document,"click","#set-review",(function(){W()})),c.listen(document,"click","#unset-review",(function(){K()}))}),1e3),window.inNative&&setTimeout((function(){window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*")}),200),window.inNative&&(window.checkReview=e=>e?self.setReview():self.unsetReview())})),S((()=>{c.selectAll('[data-mce-bogus="all"]',"remove","remove")}));return e.$$set=e=>{"xml"in e&&i(13,E=e.xml),"stopPreviewUpdate"in e&&i(14,T=e.stopPreviewUpdate),"isReview"in e&&i(0,R=e.isReview),"uxml"in e&&i(15,F=e.uxml)},e.$$.update=()=>{if(3&e.$$.dirty[0]&&O!=R){if(R)var t=setTimeout((function(){W(),clearTimeout(t)}),500);else var l=setTimeout((function(){K(),clearTimeout(l)}),200);i(1,O=R)}},[R,O,d,m,g,p,M,function(e){if(null!=l.smxml.step[e]&&1==l.smxml.step[e]._sticky)return"sticky"},function(e){i(6,M.showToolbar=e,M)},U,W,K,function(e,t){"c"==e?ee():te()},E,T,F,function(t){e.$$.not_equal(M.showToolbar,t)&&(M.showToolbar=t,i(6,M))},()=>setTimeout((function(){U()}),100)]}$.init=function(e,t){let i="";try{i=$.util.generateVariables(e,t)}catch(e){swal({html:!0,title:"",text:"<b>"+e+"<br/><br/>Variables are not correctly defined!</b>",type:"error"})}return console.log("var llist",i),i},$.util={generateVariables:function(e,t){const i=/is_advance[\s]*=([\s"'\d]*)/;let l="",s={};var n=e.split("\n");try{$.mathtype=+n[0].match(i)[1].match(/[\d]+/)}catch(e){$.mathtype=""}for(let e=0;e<n.length;e++){let t=n[e].split("=");switch(l=t[1].substr(0,t[1].indexOf("(")).trim(),l){case"rand_int":l="randInt";break;case"rand_float":l="randFloat";break;case"uc_sqrt":l="ucSqrt";break;case"rand_obj":l="randObj"}if("object"!=typeof $.math[l]&&(l=""),""!=l){let e,i,n,a=[],r=/\(([^)]+)\)/.exec(t[1]);switch(l.trim()){case"randInt":a=r[1].split(","),e=parseInt(a[0]),i=parseInt(a[1]),n=parseInt(a[2]),s[t[0].trim()]=$.math[l].f(e,i,n);break;case"randFloat":a=r[1].split(","),e=parseFloat(a[0]),i=parseFloat(a[1]),n=parseInt(a[2]),s[t[0].trim()]=$.math[l].f(e,i,n);break;case"ucSqrt":a=r[1].split(","),e=parseInt(a[0]),i=parseInt(a[1]),s[t[0].trim()]=$.math[l].f(e,i);break;case"ucPow":a=r[1].split(","),e=parseInt(a[0]),i=parseInt(a[1]),n=parseInt(a[2]),s[t[0].trim()]=$.math[l].f(e,i,n);break;default:let o=JSON.stringify(r[1]);o=o.trim().replace(/"|\\/g,""),s[t[0].trim()]=$.math[l].f(o)}}if(""==l){const e=/(\*|\+|\-|\/|\^|\%|\(|\)|\,|\[|\]|\#)/g,i=/;|\\/g;let l=t[1].split(e),n="";var a=!1;for(let e=0;e<l.length;e++)if(l[e]=l[e].trim(),";"!=l[e]&&""!=l[e]){l[e]=l[e].replace(i,""),"#"==l[e]?l[e]="'":l[e]=s.hasOwnProperty(l[e])?s[l[e]]:isNaN(+l[e])?l[e]:+l[e];let t=l[e];t="string"==typeof t?t.trim():t,"math.setCartesian"==t&&(a=!0),n+=l[e]}if(2==$.mathtype){if(1==a){for(var r=(0,eval)(n),o="",c=0;c<r.length;c++)r[c]="("+r[c]+") ",o+=r[c];s[t[0].trim()]=o}a||(s[t[0].trim()]=(0,eval)(n).toString()),""==s[t[0].trim()]&&(s[t[0].trim()]="None of these")}""==$.mathtype&&(s[t[0].trim()]=(0,eval)(n.trim()))}}return s}},$.init.replaceVariables=function(e,t){for(let l in t){var i=new RegExp("<{"+l+"}>","g");e=e.replace(i,t[l])}return e},$.math={randObj:{text:"Randomize Object",description:"Find the random string or character",param:"(javascript,java,C,react,php)",use:"randObj(javascript,php,java,c)",f:function(e){let t=e.split(",");return t[$.math.randInt.f(0,t.length-1)]}},randInt:{text:"Randomize Integer",description:"Find the random integer value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randInt(1,4,2)",f:function(e,t,i){return(Math.floor(Math.random()*(t-e+1))+e).toFixed(i)}},randFloat:{text:"Randomize Float",description:"Find the random float/decimal value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randFloat(1,4,2)",f:function(e,t,i){return(Math.random()*(t-e)+e).toFixed(i)}},ucSqrt:{text:"Square root",description:"Find the square root (value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucSqrt(9,2)",f:function(e,t){return Math.sqrt(e).toFixed(t)}},ucPow:{text:"Power",description:"Return the value of the number 4 to the power of 3(value, power, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucPow(4,3,2)",f:function(e,t,i){return Math.pow(e,t).toFixed(i)}}};class H extends e{constructor(e){super(),t(this,e,L,Q,i,{xml:13,stopPreviewUpdate:14,isReview:0,uxml:15},E,[-1,-1,-1])}}function U(e){let t,i;return t=new H({props:{xml:e[0],remedStatus:e[1],showAns:e[2],stopPreviewUpdate:e[3],isReview:e[6],uxml:e[7]}}),{c(){n(t.$$.fragment)},m(e,l){m(t,e,l),i=!0},p(e,i){const l={};1&i&&(l.xml=e[0]),2&i&&(l.remedStatus=e[1]),4&i&&(l.showAns=e[2]),8&i&&(l.stopPreviewUpdate=e[3]),64&i&&(l.isReview=e[6]),128&i&&(l.uxml=e[7]),t.$set(l)},i(e){i||(g(t.$$.fragment,e),i=!0)},o(e){v(t.$$.fragment,e),i=!1},d(e){x(t,e)}}}function J(e){let t,i,l=(2==e[4]?.content_icon||2==e[5])&&U(e);return{c(){t=s("main"),l&&l.c()},m(e,s){d(e,t,s),l&&l.m(t,null),i=!0},p(e,[i]){2==e[4]?.content_icon||2==e[5]?l?(l.p(e,i),48&i&&g(l,1)):(l=U(e),l.c(),g(l,1),l.m(t,null)):l&&(w(),v(l,1,1,(()=>{l=null})),_())},i(e){i||(g(l),i=!0)},o(e){v(l),i=!1},d(e){e&&f(t),l&&l.d()}}}function D(e,t,i){let{xml:l}=t,{remedStatus:s}=t,{showAns:n}=t,{stopPreviewUpdate:a}=t,{editorState:r}=t,{content_icon:o}=t,{isReview:c}=t,{uxml:d}=t;return e.$$set=e=>{"xml"in e&&i(0,l=e.xml),"remedStatus"in e&&i(1,s=e.remedStatus),"showAns"in e&&i(2,n=e.showAns),"stopPreviewUpdate"in e&&i(3,a=e.stopPreviewUpdate),"editorState"in e&&i(4,r=e.editorState),"content_icon"in e&&i(5,o=e.content_icon),"isReview"in e&&i(6,c=e.isReview),"uxml"in e&&i(7,d=e.uxml)},[l,s,n,a,r,o,c,d]}export default class extends e{constructor(e){super(),t(this,e,D,J,i,{xml:0,remedStatus:1,showAns:2,stopPreviewUpdate:3,editorState:4,content_icon:5,isReview:6,uxml:7})}}
//# sourceMappingURL=ItemPluginPreview-31ae489d.js.map
