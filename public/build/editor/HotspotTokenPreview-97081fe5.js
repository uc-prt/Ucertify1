import{S as e,i as t,s as n,e as s,j as i,q as o,h as l,k as a,a as r,n as c,t as d,o as p,E as u,p as m,A as f,X as v,Q as h,R as x,w,b as g,u as b,x as y,D as k,c as j,C as A,f as I,g as L,m as _,d as R,r as E,T as D,l as H}from"./main-daecf310.js";import{I as $}from"./ItemHelper-f40df82d.js";function C(e,t,n){const s=e.slice();return s[24]=t[n],s[26]=n,s}function N(e){let t,n,o,a,c,u,m,f;o=new $({props:{handleReviewClick:e[6],reviewMode:e[0].isReview}}),o.$on("setReview",e[2]),o.$on("unsetReview",e[3]);let v=e[0].itemLayout&&M(e);return{c(){t=s("div"),n=s("center"),j(o.$$.fragment),a=g(),c=s("div"),c.textContent=""+A.token_highlight,u=g(),m=s("div"),v&&v.c(),I(c,"class","token_highlight_heading font17 p-2 text-left"),L(c,"max-width","600px"),L(c,"border-top","2px solid #96bbf6"),L(c,"background-color","#d9e7fd"),I(m,"class","p-2"),L(m,"max-width","600px"),L(m,"border","2px solid #d9e7fd"),L(m,"display","flow-root"),L(m,"text-align","left"),L(m,"justify-content","left"),I(t,"class","hotspot-token-preview svelte-4djjpi"),I(t,"tabindex","0")},m(e,s){l(e,t,s),i(t,n),_(o,n,null),i(n,a),i(n,c),i(n,u),i(n,m),v&&v.m(m,null),f=!0},p(e,t){const n={};1&t&&(n.reviewMode=e[0].isReview),o.$set(n),e[0].itemLayout?v?v.p(e,t):(v=M(e),v.c(),v.m(m,null)):v&&(v.d(1),v=null)},i(e){f||(d(o.$$.fragment,e),f=!0)},o(e){r(o.$$.fragment,e),f=!1},d(e){e&&p(t),R(o),v&&v.d()}}}function S(e){let t;return{c(){t=s("div"),t.innerHTML="<span>Oops Something went wrong please check your ParseXML Function</span>",I(t,"class","alert alert-danger font-weight-bold")},m(e,n){l(e,t,n)},p:E,i:E,o:E,d(e){e&&p(t)}}}function M(e){let t,n=e[0].itemLayout,s=[];for(let t=0;t<n.length;t+=1)s[t]=z(C(e,n,t));return{c(){for(let e=0;e<s.length;e+=1)s[e].c();t=o()},m(e,n){for(let t=0;t<s.length;t+=1)s[t].m(e,n);l(e,t,n)},p(e,i){if(49&i){let o;for(n=e[0].itemLayout,o=0;o<n.length;o+=1){const l=C(e,n,o);s[o]?s[o].p(l,i):(s[o]=z(l),s[o].c(),s[o].m(t.parentNode,t))}for(;o<s.length;o+=1)s[o].d(1);s.length=n.length}},d(e){k(s,e),e&&p(t)}}}function O(e){let t,n=(e[24].value=e[24].value.replace(/##pt/g,"."))+"";return{c(){t=b(n)},m(e,n){l(e,t,n)},p(e,s){1&s&&n!==(n=(e[24].value=e[24].value.replace(/##pt/g,"."))+"")&&y(t,n)},d(e){e&&p(t)}}}function V(e){let t,n=(e[24].value=e[24].value.replace(/#cm/g,","))+"";return{c(){t=b(n)},m(e,n){l(e,t,n)},p(e,s){1&s&&n!==(n=(e[24].value=e[24].value.replace(/#cm/g,","))+"")&&y(t,n)},d(e){e&&p(t)}}}function T(e){let t,n,o,a,r,c,d,u,m,f,v,h,x,w,k,j,A,_,R=e[24].value+"";return{c(){t=s("div"),n=s("span"),o=b(R),m=g(),f=s("span"),v=s("span"),k=g(),I(n,"data-id",a="ID"+e[26]),I(n,"data-correct",r=e[4]("ID"+e[26])),I(n,"data-selected",c=e[24].selected),I(n,"tabindex",d="auto"==e[0].pointerEvents?"0":"1"),I(n,"class",u="pointer float-left text-left font14 token "+(e[24].selected?"token_selected":"")+" svelte-4djjpi"),L(n,"margin","2px"),L(n,"user-select","none"),L(n,"border","1px solid transparent"),L(n,"padding","1px 3px"),L(n,"border-radius","3px"),L(n,"pointer-events",e[0].pointerEvents+"\r\n                                "),I(v,"class",h="position-relative "+(e[4]("ID"+e[26])?"icomoon-new-24px-checkmark-circle-1":"icomoon-new-24px-cancel-circle-1")),L(v,"color",e[4]("ID"+e[26])?"green":"red"),L(v,"bottom","3px"),L(v,"left","0"),I(v,"aria-label",x=e[4]("ID"+e[26])?"marked as correct":"marked as incorrect"),I(f,"class",w=D(e[0].iconVisible)+" svelte-4djjpi"),L(f,"position","absolute"),L(f,"width","17px"),L(f,"height","17px"),L(f,"right","-8px"),L(f,"top","-9px"),L(f,"background","white"),L(f,"border-radius","15px 12px 12px"),L(f,"font-size","18px"),L(f,"z-index","1"),L(f,"display",(""==e[0].iconVisible&&e[24].selected?"block":"none")+"\r\n                                "),I(t,"key",j=e[26]),I(t,"class","tokenHeader position-relative float-left d-inline")},m(s,a){l(s,t,a),i(t,n),i(n,o),i(t,m),i(t,f),i(f,v),i(t,k),A||(_=H(n,"click",e[5].bind(this,e[26])),A=!0)},p(t,s){e=t,1&s&&R!==(R=e[24].value+"")&&y(o,R),1&s&&c!==(c=e[24].selected)&&I(n,"data-selected",c),1&s&&d!==(d="auto"==e[0].pointerEvents?"0":"1")&&I(n,"tabindex",d),1&s&&u!==(u="pointer float-left text-left font14 token "+(e[24].selected?"token_selected":"")+" svelte-4djjpi")&&I(n,"class",u),1&s&&L(n,"pointer-events",e[0].pointerEvents+"\r\n                                "),1&s&&w!==(w=D(e[0].iconVisible)+" svelte-4djjpi")&&I(f,"class",w),1&s&&L(f,"display",(""==e[0].iconVisible&&e[24].selected?"block":"none")+"\r\n                                ")},d(e){e&&p(t),A=!1,_()}}}function X(e){let t;return{c(){t=s("br"),I(t,"class","svelte-4djjpi")},m(e,n){l(e,t,n)},p:E,d(e){e&&p(t)}}}function P(e){let t,n,o,a,r=e[24].value+"";return{c(){t=s("div"),n=s("span"),o=b(r),a=g(),I(n,"class","float-left position-absolute"),L(n,"left","-2.5px"),I(t,"class","float-left position-relative d-inline"),L(t,"width","1.5px"),L(t,"height","1px")},m(e,s){l(e,t,s),i(t,n),i(n,o),i(t,a)},p(e,t){1&t&&r!==(r=e[24].value+"")&&y(o,r)},d(e){e&&p(t)}}}function z(e){let t,n,s,i=e[24].value.indexOf("##pt")>-1,a=e[24].value.indexOf("#cm")>-1,r=i&&O(e),c=a&&V(e);function d(e,t){return","==e[24].value||"."==e[24].value?P:"#newline#"==e[24].value?X:T}let u=d(e),m=u(e);return{c(){r&&r.c(),t=g(),c&&c.c(),n=g(),m.c(),s=o()},m(e,i){r&&r.m(e,i),l(e,t,i),c&&c.m(e,i),l(e,n,i),m.m(e,i),l(e,s,i)},p(e,o){1&o&&(i=e[24].value.indexOf("##pt")>-1),i?r?r.p(e,o):(r=O(e),r.c(),r.m(t.parentNode,t)):r&&(r.d(1),r=null),1&o&&(a=e[24].value.indexOf("#cm")>-1),a?c?c.p(e,o):(c=V(e),c.c(),c.m(n.parentNode,n)):c&&(c.d(1),c=null),u===(u=d(e))&&m?m.p(e,o):(m.d(1),m=u(e),m&&(m.c(),m.m(s.parentNode,s)))},d(e){r&&r.d(e),e&&p(t),c&&c.d(e),e&&p(n),m.d(e),e&&p(s)}}}function F(e){let t,n,s,i;const u=[S,N],m=[];function f(e,t){return""!=e[1]?0:1}return t=f(e),n=m[t]=u[t](e),{c(){n.c(),s=o()},m(e,n){m[t].m(e,n),l(e,s,n),i=!0},p(e,[i]){let o=t;t=f(e),t===o?m[t].p(e,i):(a(),r(m[o],1,1,(()=>{m[o]=null})),c(),n=m[t],n||(n=m[t]=u[t](e),n.c()),d(n,1),n.m(s.parentNode,s))},i(e){i||(d(n),i=!0)},o(e){r(n),i=!1},d(e){m[t].d(e),e&&p(s)}}}function U(e,t,n){let{xml:s}=t,{editorState:i}=t,{isReview:o}=t,{showAns:l}=t,{uxml:a}=t,r={},c=w({xml:"",itemType:"",cdata:"",correctAns:"",userAns:[],itemLayout:[],smController:"h",pointerEvents:"auto",iconVisible:"h",isReview:!1}),d="";c.subscribe((e=>{n(0,r=e)}));function p(){n(0,r.isReview=!0,r),n(0,r.smController="",r),n(0,r.pointerEvents="none",r),y("yans","showIcon"),f.select(".tokenHeader","attr",{tabIndex:"0"})}function g(){n(0,r.isReview=!1,r),n(0,r.smController="h",r),n(0,r.pointerEvents="auto",r),y("yans","hideIcon"),f.select(".tokenHeader","removeAttr","tabindex")}function b(){ISSPECIALMODULEUSERXMLCHANGE=1;let e=0;const t=r.correctAns.length;r.correctAns.map(((t,n)=>{r.userAns.map(((n,s)=>{t==n&&(e+=1)}))}));let n=t==e&&e==r.userAns.length;x({ans:n,uXml:a}),l&&l(n?"Correct":"Incorrect")}function y(e,t){n(0,r.iconVisible="showIcon"==t?"":"h",r);let s=[];"cans"==e?s=r.correctAns:"yans"==e&&(s=r.userAns),r.itemLayout.map(((e,t)=>{e.selected=!!f.findInArray(e.id,s)}))}return u((()=>{s!=r.xml&&(n(0,r.xml=s,r),n(0,r.correctAns=[],r),n(0,r.userAns=[],r),async function(e){try{switch(n(0,r.correctAns=e.smxml.div._correctAns.split(","),r),n(0,r.itemType=e.smxml.div._type,r),n(0,r.cdata=e.smxml.div.__cdata,r),await h(),e.smxml.div._type){case"w":!function(e){let t=(e=e.replace(/\n/g," #newline# ")).split(" ").map((e=>e.trim())).filter((e=>""!=e)),s=[],i=[];t.map(((e,t)=>{let n=e.match(/[.,]/g);if(n){let t=e.split(n[0]);i.push(t[0]),i.push(n[0]),t[1].trim()&&i.push(t[1])}else i.push(e)})),i.map(((e,t)=>{s.push({id:"ID"+t,value:e,selected:!1})})),n(0,r.itemLayout=s,r)}(r.cdata);break;case"s":!function(e){let t=e.split(".").map((e=>e.trim())).filter((e=>""!=e)),s=[];t.map(((e,t)=>{s.push({id:"ID"+t,value:e+".",selected:!1})})),n(0,r.itemLayout=s,r)}(r.cdata);break;case"p":!function(e){let t=e.split("\n").map((e=>e.trim())).filter((e=>""!=e)),s=[];t.map(((e,t)=>{s.push({id:"ID"+t,value:e,selected:!1})})),n(0,r.itemLayout=s,r)}(r.cdata);break;default:console.warn("No type found to parse")}a&&function(e){let t=v(e);t.smans&&t.smans.div&&t.smans.div._userAns&&(n(0,r.userAns=t.smans.div._userAns.split(","),r),r.itemLayout.map(((e,t)=>{e.selected=!!f.findInArray(e.id,r.userAns)})))}(a)}catch(e){n(1,d=e),console.warn({error:e.message,"function name":"parseXMLPreview","File name":"HotspotTokenPreview.js"})}}(v(s))),o?(b(),p()):i&&g()})),m((()=>{f.listen("body","keydown",".token",((e,t)=>{13===t.which&&e.click()})),window.inNative&&window.getHeight&&window.getHeight()})),e.$$set=e=>{"xml"in e&&n(8,s=e.xml),"editorState"in e&&n(9,i=e.editorState),"isReview"in e&&n(10,o=e.isReview),"showAns"in e&&n(11,l=e.showAns),"uxml"in e&&n(7,a=e.uxml)},[r,d,p,g,function(e){return!!f.findInArray(e,r.correctAns)},function(e){n(0,r.itemLayout[e].selected=!r.itemLayout[e].selected,r),function(e,t){let s=r.userAns;if(1==t)s.push("ID"+e),n(0,r.userAns=s,r);else if(0==t){let t=s.indexOf("ID"+e);t>-1&&s.splice(t,1),n(0,r.userAns=s,r)}window.inNative&&window.getHeight&&window.getHeight();n(7,a="<smans><div userAns='"+r.userAns.join()+"'></div></smans>"),b()}(e,r.itemLayout[e].selected)},function(e,t){"c"==e?y("cans","hideIcon"):y("yans","showIcon")},a,s,i,o,l]}export default class extends e{constructor(e){var o;super(),document.getElementById("svelte-4djjpi-style")||((o=s("style")).id="svelte-4djjpi-style",o.textContent=".token.svelte-4djjpi.svelte-4djjpi:hover{border:1px solid #000!important}.bla .token:hover{border:1px solid #fff!important}.token_selected.svelte-4djjpi.svelte-4djjpi{background-color:#64bb63;color:#fff}.bla .token_highlight_heading{color:#000!important}.hotspot-token-preview.svelte-4djjpi br.svelte-4djjpi{clear:both}",i(document.head,o)),t(this,e,U,F,n,{xml:8,editorState:9,isReview:10,showAns:11,uxml:7})}}
//# sourceMappingURL=HotspotTokenPreview-97081fe5.js.map
