import{S as e,i as t,s as a,F as l,q as c,h as n,e as s,u as i,f as r,Y as o,g as d,j as m,x as u,o as h,D as g,b as f,l as p,c as b,m as x,t as v,a as y,d as A,E as w,a4 as k,p as _,X as E,A as C,w as F,W as N}from"./main-9dc835e5.js";import{I as S}from"./ItemHelper-1bce5273.js";import{l as $}from"./parseCSV-929be628.js";function B(e){l(e,"svelte-ugc9ab",".fa-check{color:#46A546;position:relative;left:50px}.fa-close{color:#A80000;left:50px}.fa-close{margin-left:-26px;font-size:18px;position:relative;bottom:10px}.fa-check{margin-left:-26px;font-size:18px;position:relative;bottom:10px}.fa-close,.fa-check.svelte-ugc9ab,.middle_align.svelte-ugc9ab{vertical-align:middle!important}.middle_align{width:164px;min-width:164px}.topic_input{min-width:257px}.preview_header{font-size:16pt;font-weight:bold;vertical-align:middle}.adjust_width{width:10%;text-align:center}")}function R(e,t,a){const l=e.slice();return l[26]=t[a],l[28]=a,l}function D(e,t,a){const l=e.slice();return l[29]=t[a],l[31]=a,l}function j(e,t,a){const l=e.slice();return l[26]=t[a],l[28]=a,l}function J(e){let t,a=e[2].cdata.option,l=[];for(let t=0;t<a.length;t+=1)l[t]=M(j(e,a,t));return{c(){for(let e=0;e<l.length;e+=1)l[e].c();t=c()},m(e,a){for(let t=0;t<l.length;t+=1)l[t].m(e,a);n(e,t,a)},p(e,c){if(20&c[0]){let n;for(a=e[2].cdata.option,n=0;n<a.length;n+=1){const s=j(e,a,n);l[n]?l[n].p(s,c):(l[n]=M(s),l[n].c(),l[n].m(t.parentNode,t))}for(;n<l.length;n+=1)l[n].d(1);l.length=a.length}},d(e){g(l,e),e&&h(t)}}}function M(e){let t,a,l,c,g,f=e[26].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"";return{c(){t=s("th"),a=i(f),r(t,"key",l=e[28]),r(t,"class",c=o("preview_header adjust_width "+("theme3"!==e[2].theme?e[26].id+"text-center text-white":e[26].id+"text-center"))+" svelte-ugc9ab"),r(t,"tabindex",g=0),d(t,"background-color",e[4][e[2].theme],1)},m(e,l){n(e,t,l),m(t,a)},p(e,l){4&l[0]&&f!==(f=e[26].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"")&&u(a,f),4&l[0]&&c!==(c=o("preview_header adjust_width "+("theme3"!==e[2].theme?e[26].id+"text-center text-white":e[26].id+"text-center"))+" svelte-ugc9ab")&&r(t,"class",c),4&l[0]&&d(t,"background-color",e[4][e[2].theme],1)},d(e){e&&h(t)}}}function O(e){let t,a=e[1].cdata.term,l=[];for(let t=0;t<a.length;t+=1)l[t]=z(R(e,a,t));return{c(){for(let e=0;e<l.length;e+=1)l[e].c();t=c()},m(e,a){for(let t=0;t<l.length;t+=1)l[t].m(e,a);n(e,t,a)},p(e,c){if(302&c[0]){let n;for(a=e[1].cdata.term,n=0;n<a.length;n+=1){const s=R(e,a,n);l[n]?l[n].p(s,c):(l[n]=z(s),l[n].c(),l[n].m(t.parentNode,t))}for(;n<l.length;n+=1)l[n].d(1);l.length=a.length}},d(e){g(l,e),e&&h(t)}}}function W(e){let t,a,l,c,i,u,g,b,x,v,y,A,w,k,_,E,C,F,N,S,$,B,R,D,j;return{c(){t=s("td"),a=s("i"),c=f(),i=s("i"),g=f(),b=s("input"),E=f(),C=s("label"),r(a,"class","fa fa-check svelte-ugc9ab"),r(a,"aria-hidden","true"),r(a,"style",l=P(e[3])),r(i,"class","fa fa-close"),r(i,"aria-hidden","true"),r(i,"style",u=P(e[3])),r(b,"type","radio"),r(b,"class","test_radio CMRad"),r(b,"style",x="vertical-align:middle;"),b.value=v=e[29].id,r(b,"name",y="tm"+(e[28]+1)),r(b,"id",A="t"+e[28]+e[31]),r(b,"data-termid",w=e[26].id),r(b,"data-correct",k=e[26].correct),r(b,"data-userans",""),r(b,"data-role","none"),r(b,"tabindex",_=-1),r(C,"tabindex",F=0),r(C,"class",N="label_choice customRadCM "+(e[31]%2==0?"tureitemColorCM":"falseitemColorCM")),r(C,"for",S="t"+e[28]+e[31]),r(t,"key",$=e[31]),r(t,"id",B="tb"+e[28]+e[31]),r(t,"class",R=o("text-center test_area "+(e[29].id==e[26].correct?"dbg-success":"dbg-danger"))+" svelte-ugc9ab"),d(t,"background-color",e[28]%2==0?e[5][e[2].theme]:"#FFF")},m(l,s){n(l,t,s),m(t,a),m(t,c),m(t,i),m(t,g),m(t,b),m(t,E),m(t,C),D||(j=p(b,"click",e[8]),D=!0)},p(e,a){2&a[0]&&v!==(v=e[29].id)&&(b.value=v),2&a[0]&&w!==(w=e[26].id)&&r(b,"data-termid",w),2&a[0]&&k!==(k=e[26].correct)&&r(b,"data-correct",k),2&a[0]&&R!==(R=o("text-center test_area "+(e[29].id==e[26].correct?"dbg-success":"dbg-danger"))+" svelte-ugc9ab")&&r(t,"class",R),4&a[0]&&d(t,"background-color",e[28]%2==0?e[5][e[2].theme]:"#FFF")},d(e){e&&h(t),D=!1,j()}}}function z(e){let t,a,l,c,p,b,x,v,y=e[26].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"",A=e[1].cdata.option,w=[];for(let t=0;t<A.length;t+=1)w[t]=W(D(e,A,t));return{c(){t=s("tr"),a=s("td"),l=i(y),b=f();for(let e=0;e<w.length;e+=1)w[e].c();x=f(),r(a,"class",c=o(e[26].id)+" svelte-ugc9ab"),r(a,"tabindex",p=0),d(a,"background-color",e[28]%2==0?e[5][e[2].theme]:"#FFF",1),d(a,"font-size","14pt"),d(a,"vertical-align","middle"),d(a,"font-family",e[2].font),r(t,"key",v=e[28])},m(e,c){n(e,t,c),m(t,a),m(a,l),m(t,b);for(let e=0;e<w.length;e+=1)w[e].m(t,null);m(t,x)},p(e,n){if(2&n[0]&&y!==(y=e[26].text.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"")&&u(l,y),2&n[0]&&c!==(c=o(e[26].id)+" svelte-ugc9ab")&&r(a,"class",c),4&n[0]&&d(a,"background-color",e[28]%2==0?e[5][e[2].theme]:"#FFF",1),4&n[0]&&d(a,"font-family",e[2].font),302&n[0]){let a;for(A=e[1].cdata.option,a=0;a<A.length;a+=1){const l=D(e,A,a);w[a]?w[a].p(l,n):(w[a]=W(l),w[a].c(),w[a].m(t,x))}for(;a<w.length;a+=1)w[a].d(1);w.length=A.length}},d(e){e&&h(t),g(w,e)}}}function I(e){let t,a,l,c,g,p,w,k,_,E,C,F,N,$,B,R,D,j,M,W=e[2].stem.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"";l=new S({props:{handleReviewClick:e[9],reviewMode:e[0]}}),l.$on("setReview",e[6]),l.$on("unsetReview",e[7]);let z=e[2].cdata&&J(e),I=e[1].cdata&&O(e);return{c(){t=s("main"),a=s("div"),b(l.$$.fragment),c=f(),g=s("center"),p=s("table"),w=s("thead"),k=s("tr"),_=s("th"),E=i(W),N=f(),z&&z.c(),$=f(),B=s("tbody"),I&&I.c(),r(_,"class",C=o("preview_header "+("theme3"!==e[2].theme?"text-center text-white":"text-center"))+" svelte-ugc9ab"),r(_,"tabindex",F=0),d(_,"background-color",e[4][e[2].theme],1),r(k,"class","table-head"),r(p,"class",R="table testmode_table "),r(p,"id","test_table"),r(p,"style",D="position:relative; margin-top:20px;width:"+e[2].maxWidth+"px;font-family: Georgia;"),r(a,"id","choicemain"),r(a,"style",j="margin-bottom:20px")},m(e,s){n(e,t,s),m(t,a),x(l,a,null),m(a,c),m(a,g),m(g,p),m(p,w),m(w,k),m(k,_),m(_,E),m(k,N),z&&z.m(k,null),m(p,$),m(p,B),I&&I.m(B,null),M=!0},p(e,t){const a={};1&t[0]&&(a.reviewMode=e[0]),l.$set(a),(!M||4&t[0])&&W!==(W=e[2].stem.replace(/\n/gm,"</br>").replace(/#cm/gm,",")+"")&&u(E,W),(!M||4&t[0]&&C!==(C=o("preview_header "+("theme3"!==e[2].theme?"text-center text-white":"text-center"))+" svelte-ugc9ab"))&&r(_,"class",C),(!M||4&t[0])&&d(_,"background-color",e[4][e[2].theme],1),e[2].cdata?z?z.p(e,t):(z=J(e),z.c(),z.m(k,null)):z&&(z.d(1),z=null),e[1].cdata?I?I.p(e,t):(I=O(e),I.c(),I.m(B,null)):I&&(I.d(1),I=null),(!M||4&t[0]&&D!==(D="position:relative; margin-top:20px;width:"+e[2].maxWidth+"px;font-family: Georgia;"))&&r(p,"style",D)},i(e){M||(v(l.$$.fragment,e),M=!0)},o(e){y(l.$$.fragment,e),M=!1},d(e){e&&h(t),A(l),z&&z.d(),I&&I.d()}}}function q(){let e=document.getElementsByClassName("test_radio");for(let t=0;t<e.length;t++)e[t].getAttribute("id")==e[t].getAttribute("data-userans")?e[t].checked=!0:e[t].checked=!1}function G(){!function(){let e=document.querySelectorAll(" .test_radio");for(let t=0;t<e.length;t++)e[t].getAttribute("value")==e[t].getAttribute("data-correct")?e[t].checked=!0:e[t].checked=!1}(),L()}function L(){let e=document.getElementsByClassName("fa-check"),t=document.getElementsByClassName("fa-close");for(let a=0;a<e.length;a++)e[a].style.display="none",t[a].style.display="none"}function P(e){return 1==e?{paddingLeft:"14px",display:"inline-flex",position:"absolute"}:{paddingLeft:"15px",display:"none",position:"absolute"}}function V(e,t,a){let l,{showAns:c}=t,{editorState:n}=t,{xml:s}=t,{uxml:i}=t,{isReview:r}=t,o={cdata:""},d={},m=0;F({cdata:"",stem:"",xml:"",theme:"",font:"",maxWidth:"",totalcorrectans:""}).subscribe((e=>{a(2,d=e)}));function u(){let e=function(){let e=0,t=0,a=document.getElementsByClassName("test_radio");for(let t=0;t<a.length;t++)if(a[t].getAttribute("value")==a[t].getAttribute("data-correct")){if(1!=a[t].checked)return e=0,a[t].setAttribute("as",0),!1;a[t].setAttribute("as",1),e=1}for(let e=0;e<a.length;e++)a[e].getAttribute("value")==a[e].getAttribute("data-correct")&&1==a[e].checked&&t++,"undefined"!=typeof calculatePoint&&calculatePoint(d.totalcorrectans,t);return e}();e=1==e,i?C.select("#answer").checked=e:n&&c(e?"Correct":"Incorrect"),N({uXml:l,ans:e})}function h(){q(),C.select(".dbg-success input","checked").forEach((e=>{C.siblings(e,".fa-check").forEach((e=>{e.style.display="inline-flex"}))})),C.select(".dbg-danger input","checked").forEach((e=>{C.siblings(e,".fa-close").forEach((e=>{e.style.display="inline-flex"}))})),C.selectAll(".dbg-success input, .dbg-danger input","removeAttr","as"),C.select(".dbg-success input","checked").forEach((e=>{e.setAttribute("as",1)})),C.select(".dbg-success input","checked").forEach((e=>{e.setAttribute("as",0)})),C.select(".dbg-success input","checked").forEach((e=>{C.siblings(e,".label_choice").forEach((e=>{e.setAttribute("title","is marked as correct")}))})),C.select(".dbg-danger input","checked").forEach((e=>{C.siblings(e,".label_choice").forEach((e=>{e.setAttribute("title","is marked as incorrect")}))}))}function g(){a(0,r=!0);let e=C.selectAll(" .test_radio");for(let t=0;t<e.length;t++)e[t].disabled=!0;h()}function f(){a(0,r=!1);let e=document.getElementsByClassName("test_radio");for(let t=0;t<e.length;t++)e[t].disabled=!1;L()}return w((()=>{var e;s!=d.xml&&(a(2,d.xml=s,d),e=i,function(e,t){a(2,d.theme=e.smxml._theme,d),a(2,d.font=e.smxml._font,d),a(2,d.maxWidth=e.smxml._maxwidth?e.smxml._maxwidth:800,d);let l=$.parseCSVFormat(e.smxml.__cdata),c=[];c=JSON.parse(JSON.stringify(l)),a(2,d.cdata=c,d),a(2,d.stem=c.stem,d),a(1,o.cdata=c,o);let n=o.cdata.term.length;if(a(2,d.totalcorrectans=n,d),f(),t)try{t=JSON.parse(t);let e=[];e=JSON.parse(JSON.stringify(t)),setTimeout((function(){e.ans.map((function(e,t){C.selectAll(".test_area #"+e.userAns,"attr",{"data-userans":e.userAns})})),q()}),100)}catch(e){}else{let e=document.getElementsByClassName("test_radio");for(let t=0;t<e.length;t++)e[t].checked=!1,e[t].setAttribute("data-userans","")}}(E(s),e))})),k((()=>{r||L()})),_((()=>{AI.listen("body","keydown",".label_choice",(function(e,t){13===t.which&&e.click()}))})),e.$$set=e=>{"showAns"in e&&a(10,c=e.showAns),"editorState"in e&&a(11,n=e.editorState),"xml"in e&&a(12,s=e.xml),"uxml"in e&&a(13,i=e.uxml),"isReview"in e&&a(0,r=e.isReview)},e.$$.update=()=>{18433&e.$$.dirty[0]&&(r?(g(),n&&0==m&&(a(14,m=1),u())):(a(14,m=0),q(),f()))},[r,o,d,undefined,{theme1:"#5B9BD5",theme2:"#3B67BC",theme3:"#F6C3A2",theme4:"#70AD47",theme5:"#745998"},{theme1:"#DEEAF6",theme2:"#D4DEF1",theme3:"#FAE0CF",theme4:"#E2EFD9",theme5:"#E1DAE9"},function(){g()},function(){q(),f()},function(e){let t=e.target.id,a=e.target.name,c=document.querySelectorAll(" .test_area input[name="+a+"]");for(let e=0;e<c.length;e++)c[e].setAttribute("data-userans","");C.selectAll(" .test_area #"+t,"attr",{"data-userans":t});let n={type:"34",ans:[]},s=document.getElementsByClassName("test_radio");for(let e=0;e<s.length;e++)1==s[e].checked&&n.ans.push({id:s[e].getAttribute("data-termid"),userAns:s[e].getAttribute("id")});l=JSON.stringify(n),u()},function(e,t){"c"==e?G():h()},c,n,s,i,m]}export default class extends e{constructor(e){super(),t(this,e,V,I,a,{showAns:10,editorState:11,xml:12,uxml:13,isReview:0},B,[-1,-1])}}
//# sourceMappingURL=ChoiceMatrixPreview-72e815a4.js.map
