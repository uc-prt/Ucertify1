import{S as t,i as e,s as n,F as l,e as i,j as a,q as s,h as c,o,D as r,u as d,b,C as m,f as p,g as u,l as v,x as h,r as f,y as g,E as k,p as x,A as y,X as w,w as _,J as T}from"./main-e78d0283.js";const{document:A}=l;function L(t,e,n){const l=t.slice();return l[20]=e[n],l[22]=n,l}function D(t){let e,n=t[0].itemLayout,l=[];for(let e=0;e<n.length;e+=1)l[e]=X(L(t,n,e));return{c(){for(let t=0;t<l.length;t+=1)l[t].c();e=s()},m(t,n){for(let e=0;e<l.length;e+=1)l[e].m(t,n);c(t,e,n)},p(t,i){if(17&i){let a;for(n=t[0].itemLayout,a=0;a<n.length;a+=1){const s=L(t,n,a);l[a]?l[a].p(s,i):(l[a]=X(s),l[a].c(),l[a].m(e.parentNode,e))}for(;a<l.length;a+=1)l[a].d(1);l.length=n.length}},d(t){r(l,t),t&&o(e)}}}function C(t){let e,n,l,s,r,m,f,g,k=t[20].value+"";return{c(){e=i("div"),n=d(k),l=b(),p(e,"data-id",s="ID"+t[22]),p(e,"data-selected",r=t[20].selected),p(e,"tabindex","0"),p(e,"class",m="token float-start mx-1 mb-1 p-1 border border-secondary pointer text-left "+(t[20].selected?"token_selected":"token bg-white")+" svelte-1cdvsco"),u(e,"user-select","none"),u(e,"border-radius","3px"),u(e,"font","14px")},m(i,s){c(i,e,s),a(e,n),a(e,l),f||(g=v(e,"click",t[4].bind(this,t[22])),f=!0)},p(l,i){t=l,1&i&&k!==(k=t[20].value+"")&&h(n,k),1&i&&r!==(r=t[20].selected)&&p(e,"data-selected",r),1&i&&m!==(m="token float-start mx-1 mb-1 p-1 border border-secondary pointer text-left "+(t[20].selected?"token_selected":"token bg-white")+" svelte-1cdvsco")&&p(e,"class",m)},d(t){t&&o(e),f=!1,g()}}}function I(t){let e;return{c(){e=i("br")},m(t,n){c(t,e,n)},p:f,d(t){t&&o(e)}}}function S(t){let e,n,l,s,r=t[20].value+"";return{c(){e=i("div"),n=i("span"),l=d(r),s=b(),p(n,"class","position-absolute float-start top5"),u(n,"left","-3px"),p(e,"class","float-start position-relative done_percent_bar"),u(e,"width","2px")},m(t,i){c(t,e,i),a(e,n),a(n,l),a(e,s)},p(t,e){1&e&&r!==(r=t[20].value+"")&&h(l,r)},d(t){t&&o(e)}}}function X(t){let e;function n(t,e){return","==t[20].value||"."==t[20].value?S:"#newline#"==t[20].value?I:C}let l=n(t),i=l(t);return{c(){i.c(),e=s()},m(t,n){i.m(t,n),c(t,e,n)},p(t,a){l===(l=n(t))&&i?i.p(t,a):(i.d(1),i=l(t),i&&(i.c(),i.m(e.parentNode,e)))},d(t){i.d(t),t&&o(e)}}}function R(t){let e,n,l,s,r,k,x,y,w,_,T,A,L,C,I,S,X,R,j,E,N,q,$,z,B,F,J,O,G,H,K,M,P,Q,U,V,W,Y,Z,tt,et,nt,lt,it,at=m.edit_template+"",st=m.edit_token+"",ct=m.word+"",ot=m.sentance+"",rt=m.paragraph+"",dt=t[0].correctAns.length+"",bt=m.no_of_token+"",mt=t[0].itemLayout&&D(t);return{c(){e=i("div"),n=i("div"),l=i("div"),s=i("button"),r=d(at),x=b(),y=i("button"),w=d(st),T=b(),A=i("div"),L=i("div"),C=i("button"),I=d(ct),X=b(),R=i("button"),j=d(ot),N=b(),q=i("button"),$=d(rt),B=b(),F=i("button"),F.textContent=""+m.clear,J=b(),O=i("textarea"),G=b(),H=i("div"),K=i("div"),mt&&mt.c(),M=b(),P=i("div"),Q=i("div"),U=d(dt),V=b(),W=d(bt),Y=b(),Z=i("div"),tt=i("span"),tt.textContent="* "+m.note_label,et=b(),nt=i("span"),nt.textContent=""+m.token_message,p(s,"type","button"),p(s,"class",k="block"==t[0].viewTemplate?"btn btn-light active":"btn btn-light "),p(y,"type","button"),p(y,"class",_="block"==t[0].viewToken?"btn btn-light active":"btn btn-light"),p(l,"class","btn-group amazonpaybutton mb-2 mr-4"),p(l,"role","group"),p(C,"type","button"),p(C,"class",S="w"==t[0].activeToken?"btn btn-light active":"btn btn-light"),p(R,"type","button"),p(R,"class",E="s"==t[0].activeToken?"btn btn-light active":"btn btn-light"),p(q,"type","button"),p(q,"class",z="p"==t[0].activeToken?"btn btn-light active":"btn btn-light"),p(L,"class","btn-group border-0 bg-none"),p(F,"type","button"),p(F,"class","btn btn-outline-primary ml-2"),u(A,"display",t[0].viewToken),p(n,"class","row ml-sm2"),u(O,"display",t[0].viewTemplate),p(O,"rows","10"),p(O,"cols","65"),p(O,"class","text_area p-2 mt-3 fwidth"),p(K,"class","d-inline-block px-1 py-2 word_break"),u(H,"display",t[0].viewToken),p(H,"class","mt-3 light-cyan-bg border"),p(Q,"class","pl-2 pt-2 font-weight-bold"),u(P,"display",t[0].viewToken),p(tt,"class","font-weight-bolder"),p(Z,"class","text-danger pl-2 pt-2"),u(Z,"font","13px"),p(e,"class","hotspot-token p-2 border")},m(i,o){c(i,e,o),a(e,n),a(n,l),a(l,s),a(s,r),a(l,x),a(l,y),a(y,w),a(n,T),a(n,A),a(A,L),a(L,C),a(C,I),a(L,X),a(L,R),a(R,j),a(L,N),a(L,q),a(q,$),a(A,B),a(A,F),a(e,J),a(e,O),a(e,G),a(e,H),a(H,K),mt&&mt.m(K,null),a(e,M),a(e,P),a(P,Q),a(Q,U),a(Q,V),a(Q,W),a(e,Y),a(e,Z),a(Z,tt),a(Z,et),a(Z,nt),lt||(it=[v(s,"click",t[2].bind(this,"none","block")),v(y,"click",t[2].bind(this,"block","none")),v(C,"click",t[3].bind(this,"w")),v(R,"click",t[3].bind(this,"s")),v(q,"click",t[3].bind(this,"p")),v(F,"click",t[5].bind(this)),v(O,"change",t[1].bind(this))],lt=!0)},p(t,[e]){1&e&&k!==(k="block"==t[0].viewTemplate?"btn btn-light active":"btn btn-light ")&&p(s,"class",k),1&e&&_!==(_="block"==t[0].viewToken?"btn btn-light active":"btn btn-light")&&p(y,"class",_),1&e&&S!==(S="w"==t[0].activeToken?"btn btn-light active":"btn btn-light")&&p(C,"class",S),1&e&&E!==(E="s"==t[0].activeToken?"btn btn-light active":"btn btn-light")&&p(R,"class",E),1&e&&z!==(z="p"==t[0].activeToken?"btn btn-light active":"btn btn-light")&&p(q,"class",z),1&e&&u(A,"display",t[0].viewToken),1&e&&u(O,"display",t[0].viewTemplate),t[0].itemLayout?mt?mt.p(t,e):(mt=D(t),mt.c(),mt.m(K,null)):mt&&(mt.d(1),mt=null),1&e&&u(H,"display",t[0].viewToken),1&e&&dt!==(dt=t[0].correctAns.length+"")&&h(U,dt),1&e&&u(P,"display",t[0].viewToken)},i:f,o:f,d(t){t&&o(e),mt&&mt.d(),lt=!1,g(it)}}}function j(t,e,n){let{xml:l}=e,{isReview:i}=e,{editorState:a}=e,{getChildXml:s}=e,c={};_({xml:"",cdata:"",viewToken:"",viewTemplate:"",correctAns:[],itemLayout:[],activeToken:"",confirmDialog:!1}).subscribe((t=>{n(0,c=t)}));function o(t,e){n(0,c.viewToken=t,c),n(0,c.viewTemplate=e,c)}function r(t){return!!y.findInArray("ID"+t,c.correctAns)}return k((()=>{l!=c.xml&&(n(0,c.xml=l,c),async function(t){switch(n(0,c.correctAns=t.smxml.div._correctAns.trim()?t.smxml.div._correctAns.split(","):[],c),n(0,c.cdata=t.smxml.div.__cdata,c),n(0,c.activeToken=t.smxml.div._type,c),t.smxml.div._type){case"w":!function(t){let e=(t=t.replace(/\n/g," #newline# ")).split(" ").map((t=>t.trim())).filter((t=>""!=t)),l=[];e.map(((t,e)=>{let n=t.match(/[.,]/g);if(n){let e=t.split(n[0]);l.push(e[0]),l.push(n[0]),e[1].trim()&&l.push(e[1])}else l.push(t)}));let i=[];l.map(((t,e)=>{i.push({id:"ID"+e,value:t,selected:r(e)})})),n(0,c.itemLayout=i,c)}(c.cdata);break;case"s":!function(t){let e=t.split(".").map((t=>t.trim())).filter((t=>""!=t)),l=[];e.map(((t,e)=>{l.push({id:"ID"+e,value:t+".",selected:r(e)})})),n(0,c.itemLayout=l,c)}(c.cdata);break;case"p":!function(t){let e=t.split("\n").map((t=>t.trim())).filter((t=>""!=t)),l=[];e.map(((t,e)=>{l.push({id:"ID"+e,value:t,selected:r(e)})})),n(0,c.itemLayout=l,c)}(c.cdata);break;default:console.warn("No type found to parse")}}(w(l)))})),x((()=>{s(l+" "),o("none","block"),y.selectAll(".text_area","value",c.cdata.trim().replace(/[ ]+/gm," ")),y.bind(".text_area","keydown",(t=>{let e=t;var n=document.querySelector(".text_area"),l=n.selectionStart;n.selectionEnd==l&&32==e.which&&(" "!=y.select(".text_area").value.charAt(l-1)&&" "!=y.select(".text_area").value.charAt(l)||(y.alert(m.space_warning),e.preventDefault()))}))})),t.$$set=t=>{"xml"in t&&n(6,l=t.xml),"isReview"in t&&n(7,i=t.isReview),"editorState"in t&&n(8,a=t.editorState),"getChildXml"in t&&n(9,s=t.getChildXml)},[c,function(t){let e=w(c.xml);e.smxml.div._correctAns="",e.smxml.div.__cdata=t.target.value,s(T(e))},o,function(t){let e=w(c.xml);e.smxml.div._type=t,e.smxml.div._correctAns="",s(T(e))},function(t){n(0,c.itemLayout[t].selected=!c.itemLayout[t].selected,c),function(t,e){if(1==e)c.correctAns.push("ID"+t);else if(0==e){let e=c.correctAns.indexOf("ID"+t);e>-1&&c.correctAns.splice(e,1)}!function(t){let e=w(c.xml);e.smxml.div._correctAns=t,s(T(e))}(c.correctAns.filter((function(t){return""!=t})).join())}(t,c.itemLayout[t].selected)},function(){let t=w(c.xml);t.smxml.div._correctAns="",s(T(t))},l,i,a,s]}export default class extends t{constructor(t){var l;super(),A.getElementById("svelte-1cdvsco-style")||((l=i("style")).id="svelte-1cdvsco-style",l.textContent=".token_selected.svelte-1cdvsco{background-color:#64bb63;color:#fff}",a(A.head,l)),e(this,t,j,R,n,{xml:6,isReview:7,editorState:8,getChildXml:9})}}
//# sourceMappingURL=HotspotToken-b8e967c8.js.map
