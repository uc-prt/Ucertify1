import{S as t,i as e,s as n,F as l,q as i,h as a,o as s,D as c,e as o,u as r,b as d,C as b,f as p,g as m,j as u,l as v,x as h,r as f,y as g,E as k,p as x,A as w,X as y,w as _,J as T}from"./main-e34bd166.js";function A(t){l(t,"svelte-1cdvsco",".token_selected.svelte-1cdvsco{background-color:#64bb63;color:#fff}")}function L(t,e,n){const l=t.slice();return l[20]=e[n],l[22]=n,l}function D(t){let e,n=t[0].itemLayout,l=[];for(let e=0;e<n.length;e+=1)l[e]=X(L(t,n,e));return{c(){for(let t=0;t<l.length;t+=1)l[t].c();e=i()},m(t,n){for(let e=0;e<l.length;e+=1)l[e].m(t,n);a(t,e,n)},p(t,i){if(17&i){let a;for(n=t[0].itemLayout,a=0;a<n.length;a+=1){const s=L(t,n,a);l[a]?l[a].p(s,i):(l[a]=X(s),l[a].c(),l[a].m(e.parentNode,e))}for(;a<l.length;a+=1)l[a].d(1);l.length=n.length}},d(t){c(l,t),t&&s(e)}}}function C(t){let e,n,l,i,c,b,f,g,k=t[20].value+"";return{c(){e=o("div"),n=r(k),l=d(),p(e,"data-id",i="ID"+t[22]),p(e,"data-selected",c=t[20].selected),p(e,"tabindex","0"),p(e,"class",b="token float-start mx-1 mb-1 p-1 border border-secondary pointer text-left "+(t[20].selected?"token_selected":"token bg-white")+" svelte-1cdvsco"),m(e,"user-select","none"),m(e,"border-radius","3px"),m(e,"font","14px")},m(i,s){a(i,e,s),u(e,n),u(e,l),f||(g=v(e,"click",t[4].bind(this,t[22])),f=!0)},p(l,i){t=l,1&i&&k!==(k=t[20].value+"")&&h(n,k),1&i&&c!==(c=t[20].selected)&&p(e,"data-selected",c),1&i&&b!==(b="token float-start mx-1 mb-1 p-1 border border-secondary pointer text-left "+(t[20].selected?"token_selected":"token bg-white")+" svelte-1cdvsco")&&p(e,"class",b)},d(t){t&&s(e),f=!1,g()}}}function I(t){let e;return{c(){e=o("br")},m(t,n){a(t,e,n)},p:f,d(t){t&&s(e)}}}function S(t){let e,n,l,i,c=t[20].value+"";return{c(){e=o("div"),n=o("span"),l=r(c),i=d(),p(n,"class","position-absolute float-start top5"),m(n,"left","-3px"),p(e,"class","float-start position-relative done_percent_bar"),m(e,"width","2px")},m(t,s){a(t,e,s),u(e,n),u(n,l),u(e,i)},p(t,e){1&e&&c!==(c=t[20].value+"")&&h(l,c)},d(t){t&&s(e)}}}function X(t){let e;function n(t,e){return","==t[20].value||"."==t[20].value?S:"#newline#"==t[20].value?I:C}let l=n(t),c=l(t);return{c(){c.c(),e=i()},m(t,n){c.m(t,n),a(t,e,n)},p(t,i){l===(l=n(t))&&c?c.p(t,i):(c.d(1),c=l(t),c&&(c.c(),c.m(e.parentNode,e)))},d(t){c.d(t),t&&s(e)}}}function R(t){let e,n,l,i,c,k,x,w,y,_,T,A,L,C,I,S,X,R,j,N,q,E,$,z,F,J,O,B,G,H,K,M,P,Q,U,V,W,Y,Z,tt,et,nt,lt,it,at=b.edit_template+"",st=b.edit_token+"",ct=b.word+"",ot=b.sentance+"",rt=b.paragraph+"",dt=t[0].correctAns.length+"",bt=b.no_of_token+"",pt=t[0].itemLayout&&D(t);return{c(){e=o("div"),n=o("div"),l=o("div"),i=o("button"),c=r(at),x=d(),w=o("button"),y=r(st),T=d(),A=o("div"),L=o("div"),C=o("button"),I=r(ct),X=d(),R=o("button"),j=r(ot),q=d(),E=o("button"),$=r(rt),F=d(),J=o("button"),J.textContent=""+b.clear,O=d(),B=o("textarea"),G=d(),H=o("div"),K=o("div"),pt&&pt.c(),M=d(),P=o("div"),Q=o("div"),U=r(dt),V=d(),W=r(bt),Y=d(),Z=o("div"),tt=o("span"),tt.textContent="* "+b.note_label,et=d(),nt=o("span"),nt.textContent=""+b.token_message,p(i,"type","button"),p(i,"class",k="block"==t[0].viewTemplate?"btn btn-light active":"btn btn-light "),p(w,"type","button"),p(w,"class",_="block"==t[0].viewToken?"btn btn-light active":"btn btn-light"),p(l,"class","btn-group amazonpaybutton mb-2 mr-4"),p(l,"role","group"),p(C,"type","button"),p(C,"class",S="w"==t[0].activeToken?"btn btn-light active":"btn btn-light"),p(R,"type","button"),p(R,"class",N="s"==t[0].activeToken?"btn btn-light active":"btn btn-light"),p(E,"type","button"),p(E,"class",z="p"==t[0].activeToken?"btn btn-light active":"btn btn-light"),p(L,"class","btn-group border-0 bg-none"),p(J,"type","button"),p(J,"class","btn btn-outline-primary ml-2"),m(A,"display",t[0].viewToken),p(n,"class","row ml-sm2"),m(B,"display",t[0].viewTemplate),p(B,"rows","10"),p(B,"cols","65"),p(B,"class","text_area p-2 mt-3 fwidth"),p(K,"class","d-inline-block px-1 py-2 word_break"),m(H,"display",t[0].viewToken),p(H,"class","mt-3 light-cyan-bg border"),p(Q,"class","pl-2 pt-2 font-weight-bold"),m(P,"display",t[0].viewToken),p(tt,"class","font-weight-bolder"),p(Z,"class","text-danger pl-2 pt-2"),m(Z,"font","13px"),p(e,"class","hotspot-token p-2 border")},m(s,o){a(s,e,o),u(e,n),u(n,l),u(l,i),u(i,c),u(l,x),u(l,w),u(w,y),u(n,T),u(n,A),u(A,L),u(L,C),u(C,I),u(L,X),u(L,R),u(R,j),u(L,q),u(L,E),u(E,$),u(A,F),u(A,J),u(e,O),u(e,B),u(e,G),u(e,H),u(H,K),pt&&pt.m(K,null),u(e,M),u(e,P),u(P,Q),u(Q,U),u(Q,V),u(Q,W),u(e,Y),u(e,Z),u(Z,tt),u(Z,et),u(Z,nt),lt||(it=[v(i,"click",t[2].bind(this,"none","block")),v(w,"click",t[2].bind(this,"block","none")),v(C,"click",t[3].bind(this,"w")),v(R,"click",t[3].bind(this,"s")),v(E,"click",t[3].bind(this,"p")),v(J,"click",t[5].bind(this)),v(B,"change",t[1].bind(this))],lt=!0)},p(t,[e]){1&e&&k!==(k="block"==t[0].viewTemplate?"btn btn-light active":"btn btn-light ")&&p(i,"class",k),1&e&&_!==(_="block"==t[0].viewToken?"btn btn-light active":"btn btn-light")&&p(w,"class",_),1&e&&S!==(S="w"==t[0].activeToken?"btn btn-light active":"btn btn-light")&&p(C,"class",S),1&e&&N!==(N="s"==t[0].activeToken?"btn btn-light active":"btn btn-light")&&p(R,"class",N),1&e&&z!==(z="p"==t[0].activeToken?"btn btn-light active":"btn btn-light")&&p(E,"class",z),1&e&&m(A,"display",t[0].viewToken),1&e&&m(B,"display",t[0].viewTemplate),t[0].itemLayout?pt?pt.p(t,e):(pt=D(t),pt.c(),pt.m(K,null)):pt&&(pt.d(1),pt=null),1&e&&m(H,"display",t[0].viewToken),1&e&&dt!==(dt=t[0].correctAns.length+"")&&h(U,dt),1&e&&m(P,"display",t[0].viewToken)},i:f,o:f,d(t){t&&s(e),pt&&pt.d(),lt=!1,g(it)}}}function j(t,e,n){let{xml:l}=e,{isReview:i}=e,{editorState:a}=e,{getChildXml:s}=e,c={};_({xml:"",cdata:"",viewToken:"",viewTemplate:"",correctAns:[],itemLayout:[],activeToken:"",confirmDialog:!1}).subscribe((t=>{n(0,c=t)}));function o(t,e){n(0,c.viewToken=t,c),n(0,c.viewTemplate=e,c)}function r(t){return!!w.findInArray("ID"+t,c.correctAns)}return k((()=>{l!=c.xml&&(n(0,c.xml=l,c),async function(t){switch(n(0,c.correctAns=t.smxml.div._correctAns.trim()?t.smxml.div._correctAns.split(","):[],c),n(0,c.cdata=t.smxml.div.__cdata,c),n(0,c.activeToken=t.smxml.div._type,c),t.smxml.div._type){case"w":!function(t){let e=(t=t.replace(/\n/g," #newline# ")).split(" ").map((t=>t.trim())).filter((t=>""!=t)),l=[];e.map(((t,e)=>{let n=t.match(/[.,]/g);if(n){let e=t.split(n[0]);l.push(e[0]),l.push(n[0]),e[1].trim()&&l.push(e[1])}else l.push(t)}));let i=[];l.map(((t,e)=>{i.push({id:"ID"+e,value:t,selected:r(e)})})),n(0,c.itemLayout=i,c)}(c.cdata);break;case"s":!function(t){let e=t.split(".").map((t=>t.trim())).filter((t=>""!=t)),l=[];e.map(((t,e)=>{l.push({id:"ID"+e,value:t+".",selected:r(e)})})),n(0,c.itemLayout=l,c)}(c.cdata);break;case"p":!function(t){let e=t.split("\n").map((t=>t.trim())).filter((t=>""!=t)),l=[];e.map(((t,e)=>{l.push({id:"ID"+e,value:t,selected:r(e)})})),n(0,c.itemLayout=l,c)}(c.cdata);break;default:console.warn("No type found to parse")}}(y(l)))})),x((()=>{s(l+" "),o("none","block"),w.selectAll(".text_area","value",c.cdata.trim().replace(/[ ]+/gm," ")),w.bind(".text_area","keydown",(t=>{let e=t;var n=document.querySelector(".text_area"),l=n.selectionStart;n.selectionEnd==l&&32==e.which&&(" "!=w.select(".text_area").value.charAt(l-1)&&" "!=w.select(".text_area").value.charAt(l)||(w.alert(b.space_warning),e.preventDefault()))}))})),t.$$set=t=>{"xml"in t&&n(6,l=t.xml),"isReview"in t&&n(7,i=t.isReview),"editorState"in t&&n(8,a=t.editorState),"getChildXml"in t&&n(9,s=t.getChildXml)},[c,function(t){let e=y(c.xml);e.smxml.div._correctAns="",e.smxml.div.__cdata=t.target.value,s(T(e))},o,function(t){let e=y(c.xml);e.smxml.div._type=t,e.smxml.div._correctAns="",s(T(e))},function(t){n(0,c.itemLayout[t].selected=!c.itemLayout[t].selected,c),function(t,e){if(1==e)c.correctAns.push("ID"+t);else if(0==e){let e=c.correctAns.indexOf("ID"+t);e>-1&&c.correctAns.splice(e,1)}!function(t){let e=y(c.xml);e.smxml.div._correctAns=t,s(T(e))}(c.correctAns.filter((function(t){return""!=t})).join())}(t,c.itemLayout[t].selected)},function(){let t=y(c.xml);t.smxml.div._correctAns="",s(T(t))},l,i,a,s]}export default class extends t{constructor(t){super(),e(this,t,j,R,n,{xml:6,isReview:7,editorState:8,getChildXml:9},A)}}
//# sourceMappingURL=HotspotToken-a99dbe36.js.map
