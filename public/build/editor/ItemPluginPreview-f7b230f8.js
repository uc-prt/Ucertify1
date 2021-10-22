import{S as e,i as t,s as i,F as l,e as s,j as n,c as a,b as r,C as o,f as d,A as c,h as m,m as p,l as u,o as f,t as h,a as g,d as v,k as x,n as b,D as w,E as _,X as y,p as k,w as A,Y as S}from"./main-8eda0cea.js";import{I as C}from"./ItemHelper-a0baafa0.js";import{F as M}from"./mathquill-f4e749f2.js";import"./style-inject.es-1f59c1d0.js";var q=q||{mathtype:""};q.init=function(e,t){let i="";try{i=q.util.generateVariables(e,t)}catch(e){swal({html:!0,title:"",text:"<b>"+e+"<br/><br/>Variables are not correctly defined!</b>",type:"error"})}return console.log("var llist",i),i},q.util={generateVariables:function(e,t){const i=/is_advance[\s]*=([\s"'\d]*)/;let l="",s={};var n=e.split("\n");try{q.mathtype=+n[0].match(i)[1].match(/[\d]+/)}catch(e){q.mathtype=""}for(let e=0;e<n.length;e++){let t=n[e].split("=");switch(l=t[1].substr(0,t[1].indexOf("(")).trim(),l){case"rand_int":l="randInt";break;case"rand_float":l="randFloat";break;case"uc_sqrt":l="ucSqrt";break;case"rand_obj":l="randObj"}if("object"!=typeof q.math[l]&&(l=""),""!=l){let e,i,n,a=[],r=/\(([^)]+)\)/.exec(t[1]);switch(l.trim()){case"randInt":a=r[1].split(","),e=parseInt(a[0]),i=parseInt(a[1]),n=parseInt(a[2]),s[t[0].trim()]=q.math[l].f(e,i,n);break;case"randFloat":a=r[1].split(","),e=parseFloat(a[0]),i=parseFloat(a[1]),n=parseInt(a[2]),s[t[0].trim()]=q.math[l].f(e,i,n);break;case"ucSqrt":a=r[1].split(","),e=parseInt(a[0]),i=parseInt(a[1]),s[t[0].trim()]=q.math[l].f(e,i);break;case"ucPow":a=r[1].split(","),e=parseInt(a[0]),i=parseInt(a[1]),n=parseInt(a[2]),s[t[0].trim()]=q.math[l].f(e,i,n);break;default:let o=JSON.stringify(r[1]);o=o.trim().replace(/"|\\/g,""),s[t[0].trim()]=q.math[l].f(o)}}if(""==l){const e=/(\*|\+|\-|\/|\^|\%|\(|\)|\,|\[|\]|\#)/g,i=/;|\\/g;let l=t[1].split(e),n="";var a=!1;for(let e=0;e<l.length;e++)if(l[e]=l[e].trim(),";"!=l[e]&&""!=l[e]){l[e]=l[e].replace(i,""),"#"==l[e]?l[e]="'":l[e]=s.hasOwnProperty(l[e])?s[l[e]]:isNaN(+l[e])?l[e]:+l[e];let t=l[e];t="string"==typeof t?t.trim():t,"math.setCartesian"==t&&(a=!0),n+=l[e]}if(2==q.mathtype){if(1==a){for(var r=(0,eval)(n),o="",d=0;d<r.length;d++)r[d]="("+r[d]+") ",o+=r[d];s[t[0].trim()]=o}a||(s[t[0].trim()]=(0,eval)(n).toString()),""==s[t[0].trim()]&&(s[t[0].trim()]="None of these")}""==q.mathtype&&(s[t[0].trim()]=(0,eval)(n.trim()))}}return s}},q.init.replaceVariables=function(e,t){for(let l in t){var i=new RegExp("<{"+l+"}>","g");e=e.replace(i,t[l])}return e},q.math={randObj:{text:"Randomize Object",description:"Find the random string or character",param:"(javascript,java,C,react,php)",use:"randObj(javascript,php,java,c)",f:function(e){let t=e.split(",");return t[q.math.randInt.f(0,t.length-1)]}},randInt:{text:"Randomize Integer",description:"Find the random integer value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randInt(1,4,2)",f:function(e,t,i){return(Math.floor(Math.random()*(t-e+1))+e).toFixed(i)}},randFloat:{text:"Randomize Float",description:"Find the random float/decimal value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randFloat(1,4,2)",f:function(e,t,i){return(Math.random()*(t-e)+e).toFixed(i)}},ucSqrt:{text:"Square root",description:"Find the square root (value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucSqrt(9,2)",f:function(e,t){return Math.sqrt(e).toFixed(t)}},ucPow:{text:"Power",description:"Return the value of the number 4 to the power of 3(value, power, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucPow(4,3,2)",f:function(e,t,i){return Math.pow(e,t).toFixed(i)}}};const{document:I}=l;function N(e,t,i){const l=e.slice();return l[67]=t[i],l[69]=i,l}function j(e,t,i){const l=e.slice();return l[67]=t[i],l[69]=i,l}function E(e){let t,i,l,_,y,k,A,S,M,q,I,E,$,O,Q,z,P,L,H;i=new C({props:{handleReviewClick:e[11],reviewMode:e[0]}}),i.$on("setReview",e[9]),i.$on("unsetReview",e[10]);let U=e[5].itemArray,J=[];for(let t=0;t<U.length;t+=1)J[t]=F(j(e,U,t));let D=e[2],V=[];for(let t=0;t<D.length;t+=1)V[t]=R(N(e,D,t));let B=e[5].showToolbar&&T(e);return{c(){t=s("center"),a(i.$$.fragment),l=r(),_=s("div");for(let e=0;e<J.length;e+=1)J[e].c();A=r(),S=s("div");for(let e=0;e<V.length;e+=1)V[e].c();I=r(),B&&B.c(),E=r(),$=s("div"),O=s("button"),O.textContent=""+o.next,d(_,"class",y=e[5].main_steps?"h-imp":"inNativeStyle"),d(_,"style",k="width:"+(c.isValid(window.inNative)?"100%":"700px")),d(S,"class",M=e[5].correct_answer?"h-imp":""),d(S,"style",q="width:"+(c.isValid(window.inNative)?"100%":"700px")),d(O,"type","button"),d(O,"style",Q="width:auto;font-size:15px;margin:15px 0;"),d(O,"class","btn btn-sm btn-outline-primary imgcenter next_step px-md-5 px-sm-3"),d($,"class",z=e[5].hideNext?"h-imp":null)},m(s,a){m(s,t,a),p(i,t,null),n(t,l),n(t,_);for(let e=0;e<J.length;e+=1)J[e].m(_,null);n(t,A),n(t,S);for(let e=0;e<V.length;e+=1)V[e].m(S,null);n(t,I),B&&B.m(t,null),n(t,E),n(t,$),n($,O),P=!0,L||(H=u(O,"click",e[16]),L=!0)},p(e,l){const s={};if(1&l[0]&&(s.reviewMode=e[0]),i.$set(s),104&l[0]){let t;for(U=e[5].itemArray,t=0;t<U.length;t+=1){const i=j(e,U,t);J[t]?J[t].p(i,l):(J[t]=F(i),J[t].c(),J[t].m(_,null))}for(;t<J.length;t+=1)J[t].d(1);J.length=U.length}if((!P||32&l[0]&&y!==(y=e[5].main_steps?"h-imp":"inNativeStyle"))&&d(_,"class",y),108&l[0]){let t;for(D=e[2],t=0;t<D.length;t+=1){const i=N(e,D,t);V[t]?V[t].p(i,l):(V[t]=R(i),V[t].c(),V[t].m(S,null))}for(;t<V.length;t+=1)V[t].d(1);V.length=D.length}(!P||32&l[0]&&M!==(M=e[5].correct_answer?"h-imp":""))&&d(S,"class",M),e[5].showToolbar?B?(B.p(e,l),32&l[0]&&h(B,1)):(B=T(e),B.c(),h(B,1),B.m(t,E)):B&&(x(),g(B,1,1,(()=>{B=null})),b()),(!P||32&l[0]&&z!==(z=e[5].hideNext?"h-imp":null))&&d($,"class",z)},i(e){P||(h(i.$$.fragment,e),h(B),P=!0)},o(e){g(i.$$.fragment,e),g(B),P=!1},d(e){e&&f(t),v(i),w(J,e),w(V,e),B&&B.d(),L=!1,H()}}}function F(e){let t,i,l,a,o,c,p,u,h,g,v,x,b,w=e[67].cdata+"";return{c(){t=s("div"),i=s("div"),l=s("div"),a=s("div"),v=r(),d(a,"seq",o="s"+e[69]),d(l,"id",c="data-block_"+e[69]),d(l,"class",p="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":"")),d(l,"key",u=e[69]),d(i,"id",h="s"+e[69]),d(i,"class",g="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":"")),d(t,"data-sticky",x=e[6](e[69])),d(t,"class","bt-pd bg-white mt-3"),d(t,"tabindex",b=0)},m(e,s){m(e,t,s),n(t,i),n(i,l),n(l,a),a.innerHTML=w,n(t,v)},p(e,t){32&t[0]&&w!==(w=e[67].cdata+"")&&(a.innerHTML=w),32&t[0]&&p!==(p="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":""))&&d(l,"class",p),40&t[0]&&g!==(g="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":""))&&d(i,"class",g)},d(e){e&&f(t)}}}function R(e){let t,i,l,a,o,c,p,u,h,g,v,x,b,w=e[67].__cdata+"";return{c(){t=s("div"),i=s("div"),l=s("div"),a=s("div"),v=r(),d(a,"seq",o="s"+e[69]),d(l,"id",c="data-block_"+e[69]),d(l,"class",p="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":"")),d(l,"key",u=e[69]),d(i,"id",h="s"+e[69]),d(i,"class",g="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":"")),d(t,"data-sticky",x=e[6](e[69])),d(t,"class","bt-pd bg-white mt-3"),d(t,"tabindex",b=0)},m(e,s){m(e,t,s),n(t,i),n(i,l),n(l,a),a.innerHTML=w,n(t,v)},p(e,t){4&t[0]&&w!==(w=e[67].__cdata+"")&&(a.innerHTML=w),32&t[0]&&p!==(p="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":""))&&d(l,"class",p),40&t[0]&&g!==(g="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":""))&&d(i,"class",g)},d(e){e&&f(t)}}}function T(e){let t,i;return t=new M({props:{spanId:e[5].spanId,divId:e[5].divId,action:e[1][e[4]],show:e[15]}}),{c(){a(t.$$.fragment)},m(e,l){p(t,e,l),i=!0},p(e,i){const l={};32&i[0]&&(l.spanId=e[5].spanId),32&i[0]&&(l.divId=e[5].divId),18&i[0]&&(l.action=e[1][e[4]]),t.$set(l)},i(e){i||(h(t.$$.fragment,e),i=!0)},o(e){g(t.$$.fragment,e),i=!1},d(e){v(t,e)}}}function $(e){let t,i,l=0==e[5].blank&&E(e);return{c(){t=s("main"),l&&l.c()},m(e,s){m(e,t,s),l&&l.m(t,null),i=!0},p(e,i){0==e[5].blank?l?(l.p(e,i),32&i[0]&&h(l,1)):(l=E(e),l.c(),h(l,1),l.m(t,null)):l&&(x(),g(l,1,1,(()=>{l=null})),b())},i(e){i||(h(l),i=!0)},o(e){g(l),i=!1},d(e){e&&f(t),l&&l.d()}}}function O(e,t,i,l){return void 0!==e[i]&&void 0!==e[i][t]||(void 0===e[i]&&(e[i]={}),e[i][t]={}),e[i][t].value=l,e}function Q(e,t,i){let l,s,n={},a={},r="",o="",d=[];var m=[];let p,u={},f="",h={},g="",v="",x=0,b=0,w=0,C=!1,M={},I=[],N="",{xml:j}=t,{stopPreviewUpdate:E}=t,{isReview:F}=t,{uxml:R}=t;A({blank:!0,hideNext:!1,itemArray:[],classChange:-1,isColor:!0,smController:"h",display:-1,showToolbar:!0,isMathquill:!1,correct_answer:!0,main_steps:!1,your_answer:[]}).subscribe((e=>{i(5,M=e)}));function T(e){if(e.nodeName)if(e.classList.contains("mathquill"))ie(e,!1);else{let t=e.getAttribute("id"),i=e.closest("div").getAttribute("seq"),l=e.value;a=O(a,t,i,l),U(a)}}function $(){if(a)for(let e in a)for(let t in a[e]){let i=a[e][t].value;if(""!=i){let e=i.match(/MathQuillMathField\{(.*?)\}/g);e?e.map((function(e){""==e.toString().replace(/MathQuillMathField\{|\}/g,"")?c.select("#"+t,"removeClass","answer_input"):c.select("#"+t,"addClass","answer_input")})):c.select("#"+t,"addClass","answer_input")}else c.select("#"+t,"removeClass","answer_input")}}function Q(e){C&&i(3,h.var_list=f,h),i(3,h.cuurentStep=x,h),w=0;const t=M.itemArray;var s,n;if(s=l,(n=e)<=v?(o=s.smxml.step[n].__cdata,z(n,o)):null!=s.smxml.step[x]&&(o=s.smxml.step[x].__cdata,z(n,o)),t.push({cdata:o}),i(5,M.itemArray=t,M),e<=v)var a=e;else a=x;var r=setTimeout((function(){null==l.smxml.step[a+1]&&"1"==l.smxml.step[a]._attempt||null==l.smxml.step[a+1]&&l.smxml.step[a]._viewonly,clearTimeout(r)}),500)}function z(e,t,l){let s=t.match(/%{[\s\S]*?}%/gm),n="";if(!s)return"";s.forEach((function(t,a){if(null!=l)var r=m[l].__cdata;let o=s[a];n=s[a].match(/\|(.*?)}%$/gm),n=n?n[0].replace(/\||}%/gm,""):"",n=n.trim(),""==n||"c"==n||"n"==n?null!=l?V(o,a,e,l,r):V(o,a,e):"e"==n&&(i(5,M.isMathquill=!0,M),null!=l?ee(o,a,e,l,r):ee(o,a,e))}))}function P(e){i(5,M.showToolbar=e,M)}function L(){if("undefined"!=typeof QUIZPLAYERID)var e=setTimeout((function(){window.parentElement.autoResize(QUIZPLAYERID),clearTimeout(e)}),0);null!=l.smxml.step[x+1]||"1"==l.smxml.step[x]._attempt?(1==l.smxml._gonext?function(){let e="s"+x;c.find("#"+e,".edit_step","all").forEach((function(t,i){if(t.classList.contains("mathquill"))ie(t,!1);else{let i=t.getAttribute("id"),l=t.value;a=O(a,i,e,l)}})),1==l.smxml.step[x]._attempt?Y():(H(),D())}():1==l.smxml.step[x]._attempt?c.selectAll(".edit_step").length==c.selectAll(".answer_input").length?Y():c.selectAll(".edit_step").forEach((e=>{if(!e.classList.contains("answer_input")){e.style.border="2px solid #ff0000";var t=setTimeout((function(){e.style.border="1px solid #ccc",clearTimeout(t)}),500)}})):(H(),D()),l.smxml.step.length<=l.smxml.step[x]._seq&&1!=l.smxml.step[x]._attempt&&i(5,M.hideNext=!0,M)):i(5,M.hideNext=!0,M)}function H(){if(c.selectAll(".edit_step").forEach((e=>{e.classList.contains("mathquill")?e.previousElementSibling.classList.contains("disable_div")&&c.select(e.previousElementSibling,"removeClass","h"):e.disabled=!0,e.classList.add("data-check")})),w=0,null==l.smxml.step[x+1]&&"1"==l.smxml.step[x]._attempt)return i(5,M.hideNext=!0,M),U(a),void J();x!=l.smxml.step.length-1?(x+=1,Q(),U(a),J()):console.log("All steps are attempted")}function U(e){window.inNative&&window.getHeight&&window.getHeight();var t=C?"lists="+JSON.stringify(h.var_list):" ";u.special="<smans><div "+t+" currStep='"+x+"' userAns='"+JSON.stringify(e)+"'></div></smans>"}function J(){let e=!1,t=null,i=!1;if(l.smxml.step.length==M.itemArray.length){let t=!0;for(let l in n)null!=n[l].overall&&(e=1==n[l].overall,t=t&&e),0==t?(c.select("#answer").checked=!1,u.answer=!1,i=!1):(c.select("#answer").checked=!0,u.answer=!0,i=!0)}t=u.special,window.inNative&&(window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*"),window.postMessage(JSON.stringify({userAnswers:t,inNativeIsCorrect:i}),"*")),S({uXml:u.special,ans:u.answer})}function D(){c.select("[data-sticky]","addClass","sticky")}function V(e,t,i,l,s){let n=e,a=((e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&e[1].trim(),e[0].trim()),r="";if(-1!=a.indexOf("#style#")){let e=a.split("#style#");a=e[0],r=e[1]}I=[];let o=a.split(",");o.forEach((function(e,t){I[t]=8*o[t].length*o.length})),null!=l?B(e,I,r,n,i,a,t,l,s):B(e,I,r,n,i,a,t)}function B(e,t,l,a,d,c,p,u,f){if(null!=u){s="s"+u+"_t"+p,r="s"+u;let n='<input type="text" id="'+s+'" class="fillintheblank ks nmb text-center span0 edit_st" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:'+(Math.max(...t)+20)+"px;"+l+'" />',o='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="text" class="corr_div" style="width:'+(Math.max(...t)+20)+"px;"+l+'" >'+e[0]+"</span>"+n+"</span>",d=f.replace(a,o);i(2,m[u].__cdata=d,m)}else{if(d<=v)var g=d;else g=x;s="s"+g+"_t"+p,r="s"+g;let t='<input type="text" id="'+s+'" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none"  style="width:38px;'+l+'" />',m='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="" class="corr_div h-imp">'+e[0]+"</span>"+t+"</span>";o=o.replace(a,m),n=O(n,s,r,c),i(3,h.smans=n,h)}}function Y(e){b=0,w+=1;for(let i in n)for(let l in n[i]){if(e<v)var t=e;else t=x;if(a["s"+t]&&null!=a["s"+t][l])if(n["s"+t][l].value==a["s"+t][l].value)Z("correct",l);else if(/\,/g.test(n["s"+t][l].value)){let e=n["s"+t][l].value.split(","),i=a["s"+t][l].value;e.indexOf(i)>-1?Z("correct",l):(b=1,Z("wrong",l))}else b=1,Z("wrong",l)}1==l.smxml.step[x]._mode?function(e,t){var i=0;b>0?(i=0,e<=v?n[t].overall=i:n[r].overall=i):(i=1,e<=v?n[t].overall=i:n[r].overall=i);H()}(e,"s"+e):function(e,t){var l=0;b>0?(i(5,M.classChange=M.itemArray.length-1,M),i(5,M.isColor=!1,M),l=0,e<=v?n[t].overall=l:(n[r].overall=l,J())):(i(5,M.classChange=M.itemArray.length-1,M),i(5,M.isColor=!0,M),l=1,e<=v?n[t].overall=l:(n[r].overall=l,H()));w>1&&H();a[r]&&null!=a[s]&&(a[r].optry=w);var o=setTimeout((function(){i(5,M.classChange=-1,M),clearTimeout(o)}),2500)}(e,"s"+e)}function Z(e,t){if(1!=l.smxml.step[x]._mode){if("correct"==e?(c.select("#"+t,"removeClass","false-hover"),c.select("#"+t,"addClass","true-hover")):"wrong"==e&&(c.select("#"+t,"removeClass","true-hover"),c.select("#"+t,"addClass","false-hover")),w>1){let e=Math.max(...I);e<45&&(e="45px"),c.select(c.select("#"+t).previousElementSibling,"css",{width:e+"px"}),c.select(c.select("#"+t).previousElementSibling.nextSibling,"css",{width:e+"px"}),c.select(c.select("#"+t).previousElementSibling,"removeClass","h-imp")}if(1!=l.smxml._fixed)var i=setTimeout((function(){c.select(c.select("#"+t).previousElementSibling.nextSibling,"css",{width:N}),c.select(c.select("#"+t).previousElementSibling,"addClass","h-imp"),clearTimeout(i)}),2e3)}R&&c.selectAll(".edit_step").forEach((function(e,i){e.classList.contains("mathquill")?c.select("#"+t).previousElementSibling.classList.contains("disable_div")&&c.select(c.select("#"+t).previousElementSibling,"removeClass","h"):e.classList.contains("answer_input")&&(e.disabled=!0),e.classList.add("data-check")}))}function X(){i(0,F=!0),J(),W(),document.querySelectorAll(".fillintheblank").disabled=!0}function G(){i(0,F=!1),i(5,M.display=-1,M),i(5,M.smController=" h",M),c.selectAll(".fillintheblank","removeClass","default-hover"),c.selectAll(".fillintheblank").disabled=!1,i(5,M.main_steps=!1,M),i(5,M.correct_answer=!0,M),c.selectAll(".remed_disable","css",{display:"none"}),(null==l.smxml.step[x+1]&&"1"==l.smxml.step[x]._attempt||null==l.smxml.step[x+1]&&"1"==l.smxml.step[x]._viewonly)&&c.selectAll(".edit_step").length==c.selectAll(".data-check").length?i(5,M.hideNext=!0,M):i(5,M.hideNext=!1,M),window.inNative&&window.getHeight&&window.getHeight()}function K(){i(5,M.display=-1,M),c.selectAll(".fillintheblank","addClass","default-hover"),AI.selectAll(".edit_st ","css",{display:"none"}),l.smxml.step.map((function(e,t){z("corr_ans",e.__cdata,t)})),i(5,M.main_steps=!0,M),i(5,M.correct_answer=!1,M),window.inNative&&window.getHeight&&window.getHeight()}function W(){i(5,M.display=1,M),i(5,M.hideNext=!0,M),i(5,M.smController="",M),c.selectAll(".fillintheblank","removeClass","default-hover"),i(5,M.main_steps=!1,M),i(5,M.correct_answer=!0,M),c.selectAll(".remed_disable","css",{display:"block"}),window.inNative&&window.getHeight&&window.getHeight()}function ee(e,t,i,l,s){let n=e;(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0]=e[0].replace(/user Response/g,"\\MathQuillMathField");let a=e[0].split("##"),r=Math.floor(Math.random()*a.length),o=a[r],d=o.replace(/MathQuillMathField{(.*?)}/g,"MathQuillMathField{}"),c=0,m=o,p=m.replace(/\\MathQuillMathField/g,"");o.indexOf("MathQuillMathField")>-1&&(m=o,c=1),null!=l?te(d,e,n,i,t,r,c,m,p,l,s):te(d,e,n,i,t,r,c,m,p)}function te(e,t,l,a,p,u,f,g,b,w,_){let y=t[0].trim();if(a<=v)var k=a;else k=x;if(null!=w){s="s0"+w+"_t"+p,r="s0"+w;let t='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m0"+w+"_t"+p)+'" class="corr_div fillmathelement mathquill mq'+k+'" userAnsSeq="'+u+'" anskey="'+g+'" defaultans="'+f+'" mathtype="1">'+b+"</span>"+('<span  id="'+s+'" class="auto_height edit_st fillmathelement mathquill mq'+k+'" userAnsSeq="'+u+'" userans="'+e+'" anskey="'+g+'" defaultans="'+f+'" mathtype="1">s</span>')+"</span>",n=_.replace(l,t);i(2,m[w].__cdata=n,m)}else{s="s"+k+"_t"+p,r="s"+k;let t='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m"+k+"_t"+p)+'" class="corr_div h-imp fillmathelement mathquill mq'+k+'" userAnsSeq="'+u+'" anskey="'+g+'" defaultans="'+f+'" mathtype="1">'+b+"</span>"+('<span  id="'+s+'" class="auto_height edit_step fillmathelement mathquill mq'+k+'" userAnsSeq="'+u+'" userans="'+e+'" anskey="'+g+'" defaultans="'+f+'" mathtype="1">s</span>')+"</span>";o=o.replace(l,t),n=O(n,s,r,y),i(3,h.smans=n,h)}let A=setInterval(function(){if("function"==typeof MathQuill){clearInterval(A);let e=MathQuill.getInterface(2);c.selectAll(".mathquill.mq"+k).forEach((t=>{let l=t.getAttribute("id");if(1==t.getAttribute("defaultans")){let e=t.getAttribute("userans");null!=e&&(c.select("#"+l).innerText=e)}else c.select("#"+l).innerText=t.getAttribute("userans");try{i(1,d[l]=e.StaticMath(document.getElementById(l)),d)}catch(e){console.log(e)}}))}}.bind(this),100)}function ie(e,t){let i,l=[],s=jQuery(e).closest("div").find("span.fillelement").attr("id"),n=jQuery(e).attr("id"),r=jQuery(e).attr("userans").trim();if("math_user"==t)i=r;else{let e=MathQuill.getInterface(2).StaticMath(document.getElementById(n));for(let t=0;t<=e.innerFields.length-1;t++)l[t]=e.innerFields[t].latex();let t=r,s=r.match(/\\MathQuillMathField{(.*?)\}/g);for(let e in s){const i="\\MathQuillMathField{"+l[e]+"}",n=s[e].replace(/\\MathQuillMathField{(.*?)\}/g,i);let a=s[e];t=t.replace(a,n)}r=t,i=r}a=O(a,n,s,i),U(a)}_((()=>{if(R){let e=y(R);e.smans&&e.smans.div&&e.smans.div._userAns&&function(e){let t=y(e);C&&(g=JSON.parse(t.smans.div._lists));v=JSON.parse(t.smans.div._currStep)}(R)}if(j!=M.xml){if(i(5,M.xml=j,M),1==E)return!1;R||(x=0,i(5,M.itemArray=[],M),a={},i(5,M.hideNext=!1,M),c.find(document,".sticky",{action:"removeClass",actionData:"sticky"}),c.selectAll(".edit_step","removeAttr","disabled"),c.selectAll(".edit_step").value=""),i(5,M.blank=!1,M),function(e){C=!1,"undefined"!=e.smxml.algo&&e.smxml.algo&&(C=!0);C&&(f=q.init(e.smxml.algo));let t=JSON.stringify(e);if(C){if(R){let e=y(R);e.smans&&e.smans.div&&e.smans.div._lists&&(f=g)}l=q.init.replaceVariables(t,f),l=JSON.parse(l)}else l=e;let s=l.smxml.step;i(2,m=s.slice()),"function"!=typeof Object.assign&&(Object.assign=function(e){if(null==e)throw new TypeError("Cannot convert undefined or null to object");e=Object(e);for(var t=1;t<arguments.length;t++){var i=arguments[t];if(null!=i)for(var l in i)Object.prototype.hasOwnProperty.call(i,l)&&(e[l]=i[l])}return e});if(s.map((function(e,t){i(2,m[t]=Object.assign({},e),m)})),""!=v){x=v;for(let e=0;e<=v;e++)Q(e)}else Q();if(R){let e=y(R);if(e.smans&&e.smans.div&&e.smans.div._userAns)var n=setTimeout((function(){!function(e){let t=y(e);if(t.smans&&t.smans.div&&t.smans.div._userAns){t=JSON.parse(t.smans.div._userAns);for(let e in t)for(let i in t[e]){let l=e.split("")[1],s=t[e][i].value;c.select("#"+i).classList.contains("mathquill")?(c.select("#"+i,"userans",s),ie("#"+i,"math_user")):(c.select("#"+i).value=s,T(c.select("#"+i))),w=0,$(),Y(l)}}}(R),clearTimeout(n)}),50)}}(y(M.xml))}})),k((()=>{c.listen(document,"keydown",".edit_step",(function(e,t){let i=10*e.value.split("").length+45+"px";e.style.width=i,t.target.previousSibling.style.width=i,N=i})),c.set("stepAlgo",this),in_editor&&c.addScript("","https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"),c.addScript("",itemUrl+"src/libs/mathQuill_new.js"),window.inNative&&window.getHeight&&window.getHeight(),setTimeout((function(){c.selectAll(".toolbar_container_one","addClass","h-imp")}),100),c.listen(document,"click",".edit_step",(e=>{T(e)})),c.listen(document,"keyup",".edit_step",(e=>{T(e)})),c.listen(document,"change",".edit_step",(e=>{T(e)})),c.listen(document,"click","span.mq-editable-field.mq-focused",(e=>{let t,l=e,s=!0;for(;s;)l=l.parentElement,l.getAttribute("id")&&(s=!1,t=l.getAttribute("id"),i(4,p=t));let n=[];c.selectAll("#"+t+" span.mq-editable-field").forEach((e=>{let t=e.getAttribute("mathquill-command-id");n.push(t)}));let a=e.getAttribute("mathquill-command-id"),r=n.indexOf(a);i(5,M.spanId=r,M),i(5,M.divId=t,M),c.selectAll(".toolbar_container_one","removeClass","h-imp"),i(5,M.showToolbar=!0,M)})),c.listen(document,"click",".next_step",(function(e,t){"undefined"!=typeof QUIZPLAYERID&&window.parentElement.autoResize(QUIZPLAYERID),t.preventDefault(),$()})),setTimeout((function(){c.listen(document,"click","#set-review",(function(){X()})),c.listen(document,"click","#unset-review",(function(){G()}))}),1e3),window.inNative&&setTimeout((function(){window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*")}),200),window.inNative&&(window.checkReview=e=>e?self.setReview():self.unsetReview())}));return e.$$set=e=>{"xml"in e&&i(12,j=e.xml),"stopPreviewUpdate"in e&&i(13,E=e.stopPreviewUpdate),"isReview"in e&&i(0,F=e.isReview),"uxml"in e&&i(14,R=e.uxml)},[F,d,m,h,p,M,function(e){if(null!=l.smxml.step[e]&&1==l.smxml.step[e]._sticky)return"sticky"},P,L,X,G,function(e,t){"c"==e?K():W()},j,E,R,e=>{P(e)},()=>setTimeout((function(){L()}),100)]}class z extends e{constructor(e){var l;super(),I.getElementById("svelte-1dndgnp-style")||((l=s("style")).id="svelte-1dndgnp-style",l.textContent='.darkgrey_border{border:1px solid #ccc!important}.p-lg{padding:15px}.true-hover{outline:0;border:2px solid #14ca14!important}.false-hover{outline:0;border:2px solid #e45252!important}.default-hover{border-color:transparent!important;-webkit-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;-moz-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important}.blocked{display:block !important}.border_green{border:3px solid green!important}.border_red{border:3px solid red!important}.sticky{z-index:800;position:sticky;top:0\r\n\t}.corr_div{position:absolute!important;width:60px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default}[id^="fillmain"]{overflow:hidden;text-align:left}[id^="fillmain"] pre{background:none;border:none;font-size:14px!important}[id^="fillmain"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^="fillmain"] .footerstr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^="fillmain"] .footerstr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^="fillmain"] .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}[id^="fillmain"] input[type="text"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^="fillmain"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^="fillmain"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^="fillmain"] .drag-resize.ui-draggable{cursor:move}[id^="fillmain"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^="fillmain"] .fillcheck ul{width:220px}[id^="fillmain"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^="fillmain"] .select{font-size:15px}[id^="fillmain"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}',n(I.head,l)),t(this,e,Q,$,i,{xml:12,stopPreviewUpdate:13,isReview:0,uxml:14},[-1,-1,-1])}}function P(e){let t,i;return t=new z({props:{xml:e[0],remedStatus:e[1],showAns:e[2],stopPreviewUpdate:e[3],isReview:e[6],uxml:e[7]}}),{c(){a(t.$$.fragment)},m(e,l){p(t,e,l),i=!0},p(e,i){const l={};1&i&&(l.xml=e[0]),2&i&&(l.remedStatus=e[1]),4&i&&(l.showAns=e[2]),8&i&&(l.stopPreviewUpdate=e[3]),64&i&&(l.isReview=e[6]),128&i&&(l.uxml=e[7]),t.$set(l)},i(e){i||(h(t.$$.fragment,e),i=!0)},o(e){g(t.$$.fragment,e),i=!1},d(e){v(t,e)}}}function L(e){let t,i,l=(2==e[4]?.content_icon||2==e[5])&&P(e);return{c(){t=s("main"),l&&l.c()},m(e,s){m(e,t,s),l&&l.m(t,null),i=!0},p(e,[i]){2==e[4]?.content_icon||2==e[5]?l?(l.p(e,i),48&i&&h(l,1)):(l=P(e),l.c(),h(l,1),l.m(t,null)):l&&(x(),g(l,1,1,(()=>{l=null})),b())},i(e){i||(h(l),i=!0)},o(e){g(l),i=!1},d(e){e&&f(t),l&&l.d()}}}function H(e,t,i){let{xml:l}=t,{remedStatus:s}=t,{showAns:n}=t,{stopPreviewUpdate:a}=t,{editorState:r}=t,{content_icon:o}=t,{isReview:d}=t,{uxml:c}=t;return e.$$set=e=>{"xml"in e&&i(0,l=e.xml),"remedStatus"in e&&i(1,s=e.remedStatus),"showAns"in e&&i(2,n=e.showAns),"stopPreviewUpdate"in e&&i(3,a=e.stopPreviewUpdate),"editorState"in e&&i(4,r=e.editorState),"content_icon"in e&&i(5,o=e.content_icon),"isReview"in e&&i(6,d=e.isReview),"uxml"in e&&i(7,c=e.uxml)},[l,s,n,a,r,o,d,c]}export default class extends e{constructor(e){super(),t(this,e,H,L,i,{xml:0,remedStatus:1,showAns:2,stopPreviewUpdate:3,editorState:4,content_icon:5,isReview:6,uxml:7})}}
//# sourceMappingURL=ItemPluginPreview-f7b230f8.js.map
