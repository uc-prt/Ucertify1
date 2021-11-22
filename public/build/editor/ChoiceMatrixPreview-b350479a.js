import{S as e,i as t,s as l,D as o,q as r,h as m,e as c,u as a,f as s,Y as i,j as n,x as h,o as d,z as _,b as u,g as f,l as p,c as g,m as b,t as x,a as A,d as E,C as F,a4 as v,p as y,X as D,A as w,w as k,W as C}from"./main-8beedc99.js";import{I as B}from"./ItemHelper-e0014170.js";import{l as z}from"./parseCSV-929be628.js";function N(e){o(e,"svelte-izmpft",".fa-close{margin-left:20px;font-size:18px;position:absolute;top:10px;color:#A80000}.fa-check{margin-left:20px;font-size:18px;position:absolute;top:10px;color:#46A546}.fa-close,.fa-check.svelte-izmpft,.middle_align.svelte-izmpft{vertical-align:middle!important}.middle_align{width:164px;min-width:164px}.topic_input{min-width:257px}.preview_header{font-size:16pt;font-weight:bold;vertical-align:middle}.adjust_width{width:10%;text-align:center}.theme_color_theme1.svelte-izmpft{background-color:#5B9BD5!important}.theme_color_theme2.svelte-izmpft{background-color:#3B67BC!important}.theme_color_theme3.svelte-izmpft{background-color:#F6C3A2!important}.theme_color_theme4.svelte-izmpft{background-color:#70AD47!important}.theme_color_theme5.svelte-izmpft{background-color:#745998!important}.theme_color_terms_theme1.svelte-izmpft{background-color:#DEEAF6}.theme_color_terms_theme2.svelte-izmpft{background-color:#D4DEF1}.theme_color_terms_theme3.svelte-izmpft{background-color:#FAE0CF}.theme_color_terms_theme4.svelte-izmpft{background-color:#E2EFD9}.theme_color_terms_theme5.svelte-izmpft{background-color:#E1DAE9}")}function S(e,t,l){const o=e.slice();return o[27]=t[l],o[29]=l,o}function $(e,t,l){const o=e.slice();return o[30]=t[l],o[32]=l,o}function R(e,t,l){const o=e.slice();return o[27]=t[l],o[29]=l,o}function j(e){let t,l=e[2].cdata.option,o=[];for(let t=0;t<l.length;t+=1)o[t]=M(R(e,l,t));return{c(){for(let e=0;e<o.length;e+=1)o[e].c();t=r()},m(e,l){for(let t=0;t<o.length;t+=1)o[t].m(e,l);m(e,t,l)},p(e,r){if(36&r[0]){let m;for(l=e[2].cdata.option,m=0;m<l.length;m+=1){const c=R(e,l,m);o[m]?o[m].p(c,r):(o[m]=M(c),o[m].c(),o[m].m(t.parentNode,t))}for(;m<o.length;m+=1)o[m].d(1);o.length=l.length}},d(e){_(o,e),e&&d(t)}}}function M(e){let t,l,o,r,_,u=e[27].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"";return{c(){t=c("th"),l=a(u),s(t,"key",o=e[29]),s(t,"class",r=i(("#5B9BD5"==e[5][e[2].theme]?"theme_color_theme1":"#3B67BC"==e[5][e[2].theme]?"theme_color_theme2":"#F6C3A2"==e[5][e[2].theme]?"theme_color_theme3":"#70AD47"==e[5][e[2].theme]?"theme_color_theme4":"#745998"==e[5][e[2].theme]?"theme_color_theme5":"")+" preview_header adjust_width "+("theme3"!==e[2].theme?e[27].id+"text-center text-white":e[27].id+"text-center"))+" svelte-izmpft"),s(t,"tabindex",_=0)},m(e,o){m(e,t,o),n(t,l)},p(e,o){4&o[0]&&u!==(u=e[27].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"")&&h(l,u),4&o[0]&&r!==(r=i(("#5B9BD5"==e[5][e[2].theme]?"theme_color_theme1":"#3B67BC"==e[5][e[2].theme]?"theme_color_theme2":"#F6C3A2"==e[5][e[2].theme]?"theme_color_theme3":"#70AD47"==e[5][e[2].theme]?"theme_color_theme4":"#745998"==e[5][e[2].theme]?"theme_color_theme5":"")+" preview_header adjust_width "+("theme3"!==e[2].theme?e[27].id+"text-center text-white":e[27].id+"text-center"))+" svelte-izmpft")&&s(t,"class",r)},d(e){e&&d(t)}}}function J(e){let t,l=e[1].cdata.term,o=[];for(let t=0;t<l.length;t+=1)o[t]=W(S(e,l,t));return{c(){for(let e=0;e<o.length;e+=1)o[e].c();t=r()},m(e,l){for(let t=0;t<o.length;t+=1)o[t].m(e,l);m(e,t,l)},p(e,r){if(598&r[0]){let m;for(l=e[1].cdata.term,m=0;m<l.length;m+=1){const c=S(e,l,m);o[m]?o[m].p(c,r):(o[m]=W(c),o[m].c(),o[m].m(t.parentNode,t))}for(;m<o.length;m+=1)o[m].d(1);o.length=l.length}},d(e){_(o,e),e&&d(t)}}}function O(e){let t,l,o,r,a,h,_,f,g,b,x,A,E,F,v,y,D,w,k,C,B,z,N,S,$;return{c(){t=c("td"),l=c("i"),r=u(),a=c("i"),_=u(),f=c("input"),y=u(),D=c("label"),s(l,"class","fa fa-check svelte-izmpft"),s(l,"aria-hidden","true"),s(l,"style",o=P(e[4])),s(a,"class","fa fa-close"),s(a,"aria-hidden","true"),s(a,"style",h=P(e[4])),s(f,"type","radio"),s(f,"class","test_radio CMRad"),s(f,"style",g="vertical-align:middle;"),f.value=b=e[30].id,s(f,"name",x="tm"+(e[29]+1)),s(f,"id",A="t"+e[29]+e[32]),s(f,"data-termid",E=e[27].id),s(f,"data-correct",F=e[27].correct),s(f,"data-userans",""),s(f,"data-role","none"),s(f,"tabindex",v=-1),s(D,"tabindex",w=0),s(D,"class",k="label_choice customRadCM "+(e[32]%2==0?"tureitemColorCM":"falseitemColorCM")),s(D,"for",C="t"+e[29]+e[32]),s(t,"key",B=e[32]),s(t,"id",z="tb"+e[29]+e[32]),s(t,"class",N=i((e[29]%2==0?"#DEEAF6"==e[6][e[2].theme]?"theme_color_terms_theme1":"#D4DEF1"==e[6][e[2].theme]?"theme_color_terms_theme2":"#FAE0CF"==e[6][e[2].theme]?"theme_color_terms_theme3":"#E2EFD9"==e[6][e[2].theme]?"theme_color_terms_theme4":"#E1DAE9"==e[6][e[2].theme]?"theme_color_terms_theme5":"#FFF":"#FFF")+" text-center test_area"+(e[30].id==e[27].correct?" dbg-success":" dbg-danger")+" position-relative")+" svelte-izmpft")},m(o,c){m(o,t,c),n(t,l),n(t,r),n(t,a),n(t,_),n(t,f),n(t,y),n(t,D),S||($=p(f,"click",e[9]),S=!0)},p(e,l){2&l[0]&&b!==(b=e[30].id)&&(f.value=b),2&l[0]&&E!==(E=e[27].id)&&s(f,"data-termid",E),2&l[0]&&F!==(F=e[27].correct)&&s(f,"data-correct",F),6&l[0]&&N!==(N=i((e[29]%2==0?"#DEEAF6"==e[6][e[2].theme]?"theme_color_terms_theme1":"#D4DEF1"==e[6][e[2].theme]?"theme_color_terms_theme2":"#FAE0CF"==e[6][e[2].theme]?"theme_color_terms_theme3":"#E2EFD9"==e[6][e[2].theme]?"theme_color_terms_theme4":"#E1DAE9"==e[6][e[2].theme]?"theme_color_terms_theme5":"#FFF":"#FFF")+" text-center test_area"+(e[30].id==e[27].correct?" dbg-success":" dbg-danger")+" position-relative")+" svelte-izmpft")&&s(t,"class",N)},d(e){e&&d(t),S=!1,$()}}}function W(e){let t,l,o,r,p,g,b,x,A=e[27].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"",E=e[1].cdata.option,F=[];for(let t=0;t<E.length;t+=1)F[t]=O($(e,E,t));return{c(){t=c("tr"),l=c("td"),o=a(A),g=u();for(let e=0;e<F.length;e+=1)F[e].c();b=u(),s(l,"class",r=i((e[29]%2==0?"#DEEAF6"==e[6][e[2].theme]?"theme_color_terms_theme1":"#D4DEF1"==e[6][e[2].theme]?"theme_color_terms_theme2":"#FAE0CF"==e[6][e[2].theme]?"theme_color_terms_theme3":"#E2EFD9"==e[6][e[2].theme]?"theme_color_terms_theme4":"#E1DAE9"==e[6][e[2].theme]?"theme_color_terms_theme5":"#FFF":"#FFF")+" "+e[27].id+" position-relative")+" svelte-izmpft"),s(l,"tabindex",p=0),f(l,"font-size","14pt"),f(l,"vertical-align","middle"),f(l,"font-family",e[2].font),s(t,"key",x=e[29])},m(e,r){m(e,t,r),n(t,l),n(l,o),n(t,g);for(let e=0;e<F.length;e+=1)F[e].m(t,null);n(t,b)},p(e,m){if(2&m[0]&&A!==(A=e[27].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"")&&h(o,A),6&m[0]&&r!==(r=i((e[29]%2==0?"#DEEAF6"==e[6][e[2].theme]?"theme_color_terms_theme1":"#D4DEF1"==e[6][e[2].theme]?"theme_color_terms_theme2":"#FAE0CF"==e[6][e[2].theme]?"theme_color_terms_theme3":"#E2EFD9"==e[6][e[2].theme]?"theme_color_terms_theme4":"#E1DAE9"==e[6][e[2].theme]?"theme_color_terms_theme5":"#FFF":"#FFF")+" "+e[27].id+" position-relative")+" svelte-izmpft")&&s(l,"class",r),4&m[0]&&f(l,"font-family",e[2].font),598&m[0]){let l;for(E=e[1].cdata.option,l=0;l<E.length;l+=1){const o=$(e,E,l);F[l]?F[l].p(o,m):(F[l]=O(o),F[l].c(),F[l].m(t,b))}for(;l<F.length;l+=1)F[l].d(1);F.length=E.length}},d(e){e&&d(t),_(F,e)}}}function I(e){let t,l,o,r,_,f,p,F,v,y,D,w,k,C,z,N,S,$,R,M=e[2].stem.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"";o=new B({props:{handleReviewClick:e[10],reviewMode:e[0],customReviewMode:e[3]}}),o.$on("setReview",e[7]),o.$on("unsetReview",e[8]);let O=e[2].cdata&&j(e),W=e[1].cdata&&J(e);return{c(){t=c("main"),l=c("div"),g(o.$$.fragment),r=u(),_=c("center"),f=c("table"),p=c("thead"),F=c("tr"),v=c("th"),y=a(M),k=u(),O&&O.c(),C=u(),z=c("tbody"),W&&W.c(),s(v,"class",D=i(("#5B9BD5"==e[5][e[2].theme]?"theme_color_theme1":"#3B67BC"==e[5][e[2].theme]?"theme_color_theme2":"#F6C3A2"==e[5][e[2].theme]?"theme_color_theme3":"#70AD47"==e[5][e[2].theme]?"theme_color_theme4":"#745998"==e[5][e[2].theme]?"theme_color_theme5":"")+" preview_header "+("theme3"!==e[2].theme?"text-center text-white":" text-center"))+" svelte-izmpft"),s(v,"tabindex",w=0),s(F,"class","table-head"),s(f,"class",N="table testmode_table "),s(f,"id","test_table"),s(f,"style",S="position:relative; margin-top:20px;width:"+e[2].maxWidth+"px;font-family: Georgia;"),s(l,"id","choicemain"),s(l,"style",$="margin-bottom:20px")},m(e,c){m(e,t,c),n(t,l),b(o,l,null),n(l,r),n(l,_),n(_,f),n(f,p),n(p,F),n(F,v),n(v,y),n(F,k),O&&O.m(F,null),n(f,C),n(f,z),W&&W.m(z,null),R=!0},p(e,t){const l={};1&t[0]&&(l.reviewMode=e[0]),o.$set(l),(!R||4&t[0])&&M!==(M=e[2].stem.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"")&&h(y,M),(!R||4&t[0]&&D!==(D=i(("#5B9BD5"==e[5][e[2].theme]?"theme_color_theme1":"#3B67BC"==e[5][e[2].theme]?"theme_color_theme2":"#F6C3A2"==e[5][e[2].theme]?"theme_color_theme3":"#70AD47"==e[5][e[2].theme]?"theme_color_theme4":"#745998"==e[5][e[2].theme]?"theme_color_theme5":"")+" preview_header "+("theme3"!==e[2].theme?"text-center text-white":" text-center"))+" svelte-izmpft"))&&s(v,"class",D),e[2].cdata?O?O.p(e,t):(O=j(e),O.c(),O.m(F,null)):O&&(O.d(1),O=null),e[1].cdata?W?W.p(e,t):(W=J(e),W.c(),W.m(z,null)):W&&(W.d(1),W=null),(!R||4&t[0]&&S!==(S="position:relative; margin-top:20px;width:"+e[2].maxWidth+"px;font-family: Georgia;"))&&s(f,"style",S)},i(e){R||(x(o.$$.fragment,e),R=!0)},o(e){A(o.$$.fragment,e),R=!1},d(e){e&&d(t),E(o),O&&O.d(),W&&W.d()}}}function q(){let e=document.getElementsByClassName("test_radio");for(let t=0;t<e.length;t++)e[t].getAttribute("id")==e[t].getAttribute("data-userans")?e[t].checked=!0:e[t].checked=!1}function G(){!function(){let e=document.querySelectorAll(" .test_radio");for(let t=0;t<e.length;t++)e[t].getAttribute("value")==e[t].getAttribute("data-correct")?e[t].checked=!0:e[t].checked=!1}(),L()}function L(){let e=document.getElementsByClassName("fa-check"),t=document.getElementsByClassName("fa-close");for(let l=0;l<e.length;l++)e[l].style.display="none",t[l].style.display="none"}function P(e){return 1==e?{paddingLeft:"14px",display:"inline-flex",position:"absolute"}:{paddingLeft:"15px",display:"none",position:"absolute"}}function V(e,t,l){let o,{showAns:r}=t,{editorState:m}=t,{xml:c}=t,{uxml:a}=t,{isReview:s}=t,i=s,n={cdata:""},h={},d=0;k({cdata:"",stem:"",xml:"",theme:"",font:"",maxWidth:"",totalcorrectans:""}).subscribe((e=>{l(2,h=e)}));function _(){let e=function(){let e=0,t=0,l=document.getElementsByClassName("test_radio");for(let t=0;t<l.length;t++)if(l[t].getAttribute("value")==l[t].getAttribute("data-correct")){if(1!=l[t].checked)return e=0,l[t].setAttribute("as",0),!1;l[t].setAttribute("as",1),e=1}for(let e=0;e<l.length;e++)l[e].getAttribute("value")==l[e].getAttribute("data-correct")&&1==l[e].checked&&t++,"undefined"!=typeof calculatePoint&&calculatePoint(h.totalcorrectans,t);return e}();e=1==e,a?w.select("#answer").checked=e:m&&r(e?"Correct":"Incorrect"),C({uXml:o,ans:e})}function u(){q(),w.select(".dbg-success input","checked").forEach((e=>{w.siblings(e,".fa-check").forEach((e=>{e.style.display="inline-flex"}))})),w.select(".dbg-danger input","checked").forEach((e=>{w.siblings(e,".fa-close").forEach((e=>{e.style.display="inline-flex"}))})),w.selectAll(".dbg-success input, .dbg-danger input","removeAttr","as"),w.select(".dbg-success input","checked").forEach((e=>{e.setAttribute("as",1)})),w.select(".dbg-success input","checked").forEach((e=>{e.setAttribute("as",0)})),w.select(".dbg-success input","checked").forEach((e=>{w.siblings(e,".label_choice").forEach((e=>{e.setAttribute("title","is marked as correct")}))})),w.select(".dbg-danger input","checked").forEach((e=>{w.siblings(e,".label_choice").forEach((e=>{e.setAttribute("title","is marked as incorrect")}))}))}function f(){l(0,s=!0);let e=w.selectAll(" .test_radio");for(let t=0;t<e.length;t++)e[t].disabled=!0;u()}function p(){l(0,s=!1);let e=document.getElementsByClassName("test_radio");for(let t=0;t<e.length;t++)e[t].disabled=!1;L()}return F((()=>{var e;c!=h.xml&&(l(2,h.xml=c,h),e=a,function(e,t){l(2,h.theme=e.smxml._theme,h),l(2,h.font=e.smxml._font,h),l(2,h.maxWidth=e.smxml._maxwidth?e.smxml._maxwidth:800,h);let o=z.parseCSVFormat(e.smxml.__cdata),r=[];r=JSON.parse(JSON.stringify(o)),l(2,h.cdata=r,h),l(2,h.stem=r.stem,h),l(1,n.cdata=r,n);let m=n.cdata.term.length;if(l(2,h.totalcorrectans=m,h),p(),t)try{t=JSON.parse(t);let e=[];e=JSON.parse(JSON.stringify(t)),setTimeout((function(){e.ans.map((function(e,t){w.selectAll(".test_area #"+e.userAns,"attr",{"data-userans":e.userAns})})),q()}),100)}catch(e){}else{let e=document.getElementsByClassName("test_radio");for(let t=0;t<e.length;t++)e[t].checked=!1,e[t].setAttribute("data-userans","")}}(D(c),e))})),v((()=>{s||L()})),y((()=>{AI.listen("body","keydown",".label_choice",(function(e,t){13===t.which&&e.click()}))})),e.$$set=e=>{"showAns"in e&&l(11,r=e.showAns),"editorState"in e&&l(12,m=e.editorState),"xml"in e&&l(13,c=e.xml),"uxml"in e&&l(14,a=e.uxml),"isReview"in e&&l(0,s=e.isReview)},e.$$.update=()=>{36865&e.$$.dirty[0]&&(s?(f(),m&&0==d&&(l(15,d=1),_())):(l(15,d=0),q(),p()))},[s,n,h,i,undefined,{theme1:"#5B9BD5",theme2:"#3B67BC",theme3:"#F6C3A2",theme4:"#70AD47",theme5:"#745998"},{theme1:"#DEEAF6",theme2:"#D4DEF1",theme3:"#FAE0CF",theme4:"#E2EFD9",theme5:"#E1DAE9"},function(){f()},function(){q(),p()},function(e){let t=e.target.id,l=e.target.name,r=document.querySelectorAll(" .test_area input[name="+l+"]");for(let e=0;e<r.length;e++)r[e].setAttribute("data-userans","");w.selectAll(" .test_area #"+t,"attr",{"data-userans":t});let m={type:"34",ans:[]},c=document.getElementsByClassName("test_radio");for(let e=0;e<c.length;e++)1==c[e].checked&&m.ans.push({id:c[e].getAttribute("data-termid"),userAns:c[e].getAttribute("id")});o=JSON.stringify(m),_()},function(e,t){"c"==e?G():u()},r,m,c,a,d]}export default class extends e{constructor(e){super(),t(this,e,V,I,l,{showAns:11,editorState:12,xml:13,uxml:14,isReview:0},N,[-1,-1])}}
//# sourceMappingURL=ChoiceMatrixPreview-b350479a.js.map