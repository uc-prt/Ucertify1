import{S as e,i as t,s as n,e as s,j as i,q as o,h as a,k as r,a as l,n as c,t as d,o as p,E as u,p as m,A as f,X as v,W as h,w as x,Y as w,b as g,f as b,u as y,x as A,D as k,c as I,C as j,g as L,m as D,d as $,r as _,Z as E,l as R}from"./main-ce4abdd6.js";import{I as H}from"./ItemHelper-7f5401f1.js";function C(e,t,n){const s=e.slice();return s[25]=t[n],s[27]=n,s}function S(e){let t,n,o,r,c,u,m,f;o=new H({props:{handleReviewClick:e[5],reviewMode:e[0].isReview}}),o.$on("setReview",e[2]),o.$on("unsetReview",e[3]);let v=e[0].itemLayout&&N(e);return{c(){t=s("div"),n=s("center"),I(o.$$.fragment),r=g(),c=s("div"),c.textContent=""+j.token_highlight,u=g(),m=s("div"),v&&v.c(),b(c,"class","token_highlight_heading font17 p-2 text-left"),L(c,"max-width","600px"),L(c,"border-top","2px solid #96bbf6"),L(c,"background-color","#d9e7fd"),b(m,"class","p-2"),L(m,"max-width","600px"),L(m,"border","2px solid #d9e7fd"),L(m,"display","flow-root"),L(m,"text-align","left"),L(m,"justify-content","left"),b(t,"class","hotspot-token-preview svelte-4djjpi"),b(t,"tabindex","0")},m(e,s){a(e,t,s),i(t,n),D(o,n,null),i(n,r),i(n,c),i(n,u),i(n,m),v&&v.m(m,null),f=!0},p(e,t){const n={};1&t&&(n.reviewMode=e[0].isReview),o.$set(n),e[0].itemLayout?v?v.p(e,t):(v=N(e),v.c(),v.m(m,null)):v&&(v.d(1),v=null)},i(e){f||(d(o.$$.fragment,e),f=!0)},o(e){l(o.$$.fragment,e),f=!1},d(e){e&&p(t),$(o),v&&v.d()}}}function M(e){let t;return{c(){t=s("div"),t.innerHTML="<span>Oops Something went wrong please check your ParseXML Function</span>",b(t,"class","alert alert-danger font-weight-bold")},m(e,n){a(e,t,n)},p:_,i:_,o:_,d(e){e&&p(t)}}}function N(e){let t,n=e[0].itemLayout,s=[];for(let t=0;t<n.length;t+=1)s[t]=z(C(e,n,t));return{c(){for(let e=0;e<s.length;e+=1)s[e].c();t=o()},m(e,n){for(let t=0;t<s.length;t+=1)s[t].m(e,n);a(e,t,n)},p(e,i){if(17&i){let o;for(n=e[0].itemLayout,o=0;o<n.length;o+=1){const a=C(e,n,o);s[o]?s[o].p(a,i):(s[o]=z(a),s[o].c(),s[o].m(t.parentNode,t))}for(;o<s.length;o+=1)s[o].d(1);s.length=n.length}},d(e){k(s,e),e&&p(t)}}}function O(e){let t,n=(e[25].value=e[25].value.replace(/##pt/g,"."))+"";return{c(){t=y(n)},m(e,n){a(e,t,n)},p(e,s){1&s&&n!==(n=(e[25].value=e[25].value.replace(/##pt/g,"."))+"")&&A(t,n)},d(e){e&&p(t)}}}function V(e){let t,n=(e[25].value=e[25].value.replace(/#cm/g,","))+"";return{c(){t=y(n)},m(e,n){a(e,t,n)},p(e,s){1&s&&n!==(n=(e[25].value=e[25].value.replace(/#cm/g,","))+"")&&A(t,n)},d(e){e&&p(t)}}}function X(e){let t,n,o,r,l,c,d,u,m,v,h,x,w,k,I,j,D,$,_=e[25].value+"";return{c(){t=s("div"),n=s("span"),o=y(_),m=g(),v=s("span"),h=s("span"),I=g(),b(n,"data-id",r="ID"+e[27]),b(n,"data-correct",l=f.findInArray("ID"+e[27],e[0].correctAns)),b(n,"data-selected",c=e[25].selected),b(n,"tabindex",d="auto"==e[0].pointerEvents?"0":"1"),b(n,"class",u="pointer float-left text-left font14 token "+(e[25].selected?"token_selected":"")+" svelte-4djjpi"),L(n,"margin","2px"),L(n,"user-select","none"),L(n,"border","1px solid transparent"),L(n,"padding","1px 3px"),L(n,"border-radius","3px"),L(n,"pointer-events",e[0].pointerEvents+"\r\n                                "),b(h,"class",x="position-relative "+(f.findInArray("ID"+e[27],e[0].correctAns)?"icomoon-new-24px-checkmark-circle-1":"icomoon-new-24px-cancel-circle-1")),L(h,"color",f.findInArray("ID"+e[27],e[0].correctAns)?"green":"red"),L(h,"bottom","3px"),L(h,"left","0"),b(h,"aria-label",w=f.findInArray("ID"+e[27],e[0].correctAns)?"marked as correct":"marked as incorrect"),b(v,"class",k=E(e[0].iconVisible)+" svelte-4djjpi"),L(v,"position","absolute"),L(v,"width","17px"),L(v,"height","17px"),L(v,"right","-8px"),L(v,"top","-9px"),L(v,"background","white"),L(v,"border-radius","15px 12px 12px"),L(v,"font-size","18px"),L(v,"z-index","1"),L(v,"display",(""==e[0].iconVisible&&e[25].selected?"block":"none")+"\r\n                                "),b(t,"key",j=e[27]),b(t,"class","tokenHeader position-relative float-left d-inline")},m(s,r){a(s,t,r),i(t,n),i(n,o),i(t,m),i(t,v),i(v,h),i(t,I),D||($=R(n,"click",e[4].bind(this,e[27])),D=!0)},p(t,s){e=t,1&s&&_!==(_=e[25].value+"")&&A(o,_),1&s&&l!==(l=f.findInArray("ID"+e[27],e[0].correctAns))&&b(n,"data-correct",l),1&s&&c!==(c=e[25].selected)&&b(n,"data-selected",c),1&s&&d!==(d="auto"==e[0].pointerEvents?"0":"1")&&b(n,"tabindex",d),1&s&&u!==(u="pointer float-left text-left font14 token "+(e[25].selected?"token_selected":"")+" svelte-4djjpi")&&b(n,"class",u),1&s&&L(n,"pointer-events",e[0].pointerEvents+"\r\n                                "),1&s&&x!==(x="position-relative "+(f.findInArray("ID"+e[27],e[0].correctAns)?"icomoon-new-24px-checkmark-circle-1":"icomoon-new-24px-cancel-circle-1"))&&b(h,"class",x),1&s&&L(h,"color",f.findInArray("ID"+e[27],e[0].correctAns)?"green":"red"),1&s&&w!==(w=f.findInArray("ID"+e[27],e[0].correctAns)?"marked as correct":"marked as incorrect")&&b(h,"aria-label",w),1&s&&k!==(k=E(e[0].iconVisible)+" svelte-4djjpi")&&b(v,"class",k),1&s&&L(v,"display",(""==e[0].iconVisible&&e[25].selected?"block":"none")+"\r\n                                ")},d(e){e&&p(t),D=!1,$()}}}function P(e){let t;return{c(){t=s("br"),b(t,"class","svelte-4djjpi")},m(e,n){a(e,t,n)},p:_,d(e){e&&p(t)}}}function T(e){let t,n,o,r,l=e[25].value+"";return{c(){t=s("div"),n=s("span"),o=y(l),r=g(),b(n,"class","float-left position-absolute"),L(n,"left","-2.5px"),b(t,"class","float-left position-relative d-inline"),L(t,"width","1.5px"),L(t,"height","1px")},m(e,s){a(e,t,s),i(t,n),i(n,o),i(t,r)},p(e,t){1&t&&l!==(l=e[25].value+"")&&A(o,l)},d(e){e&&p(t)}}}function z(e){let t,n,r,l,c=e[25].value.indexOf("##pt")>-1,d=e[25].value.indexOf("#cm")>-1,u=c&&O(e),m=d&&V(e);function f(e,t){return","==e[25].value||"."==e[25].value?T:"#newline#"==e[25].value?P:X}let v=f(e),h=v(e);return{c(){t=s("div"),u&&u.c(),n=g(),m&&m.c(),r=g(),h.c(),l=o(),b(t,"class","h")},m(e,s){a(e,t,s),u&&u.m(t,null),i(t,n),m&&m.m(t,null),a(e,r,s),h.m(e,s),a(e,l,s)},p(e,s){1&s&&(c=e[25].value.indexOf("##pt")>-1),c?u?u.p(e,s):(u=O(e),u.c(),u.m(t,n)):u&&(u.d(1),u=null),1&s&&(d=e[25].value.indexOf("#cm")>-1),d?m?m.p(e,s):(m=V(e),m.c(),m.m(t,null)):m&&(m.d(1),m=null),v===(v=f(e))&&h?h.p(e,s):(h.d(1),h=v(e),h&&(h.c(),h.m(l.parentNode,l)))},d(e){e&&p(t),u&&u.d(),m&&m.d(),e&&p(r),h.d(e),e&&p(l)}}}function F(e){let t,n,s,i;const u=[M,S],m=[];function f(e,t){return""!=e[1]?0:1}return t=f(e),n=m[t]=u[t](e),{c(){n.c(),s=o()},m(e,n){m[t].m(e,n),a(e,s,n),i=!0},p(e,[i]){let o=t;t=f(e),t===o?m[t].p(e,i):(r(),l(m[o],1,1,(()=>{m[o]=null})),c(),n=m[t],n?n.p(e,i):(n=m[t]=u[t](e),n.c()),d(n,1),n.m(s.parentNode,s))},i(e){i||(d(n),i=!0)},o(e){l(n),i=!1},d(e){m[t].d(e),e&&p(s)}}}function U(e,t,n){let{xml:s}=t,{editorState:i}=t,{isReview:o}=t,{showAns:a}=t,{uxml:r}=t,l=0,c={},d=x({xml:"",itemType:"",cdata:"",correctAns:"",userAns:[],itemLayout:[],smController:"h",pointerEvents:"auto",iconVisible:"h",isReview:!1}),p="";d.subscribe((e=>{n(0,c=e)}));function g(){n(0,c.isReview=!0,c),n(0,c.smController="",c),n(0,c.pointerEvents="none",c),A("yans","showIcon"),f.select(".tokenHeader","attr",{tabIndex:"0"})}function b(){n(0,c.isReview=!1,c),n(0,c.smController="h",c),n(0,c.pointerEvents="auto",c),A("yans","hideIcon"),f.select(".tokenHeader","removeAttr","tabindex")}function y(){ISSPECIALMODULEUSERXMLCHANGE=1;let e=0;const t=c.correctAns.length;c.correctAns.map(((t,n)=>{c.userAns.map(((n,s)=>{t==n&&(e+=1)}))}));let n=t==e&&e==c.userAns.length;w({ans:n,uXml:r}),a&&a(n?"Correct":"Incorrect")}function A(e,t){n(0,c.iconVisible="showIcon"==t?"":"h",c);let s=[];"cans"==e?s=c.correctAns:"yans"==e&&(s=c.userAns),c.itemLayout.map(((e,t)=>{e.selected=!!f.findInArray(e.id,s)}))}return u((()=>{s!=c.xml&&(n(0,c.xml=s,c),n(0,c.correctAns=[],c),n(0,c.userAns=[],c),async function(e){try{switch(n(0,c.correctAns=e.smxml.div._correctAns.split(","),c),n(0,c.itemType=e.smxml.div._type,c),n(0,c.cdata=e.smxml.div.__cdata,c),await h(),e.smxml.div._type){case"w":!function(e){let t=(e=e.replace(/\n/g," #newline# ")).split(" ").map((e=>e.trim())).filter((e=>""!=e)),s=[],i=[];t.map(((e,t)=>{let n=e.match(/[.,]/g);if(n){let t=e.split(n[0]);i.push(t[0]),i.push(n[0]),t[1].trim()&&i.push(t[1])}else i.push(e)})),i.map(((e,t)=>{s.push({id:"ID"+t,value:e,selected:!1})})),n(0,c.itemLayout=s,c)}(c.cdata);break;case"s":!function(e){let t=e.split(".").map((e=>e.trim())).filter((e=>""!=e)),s=[];t.map(((e,t)=>{s.push({id:"ID"+t,value:e+".",selected:!1})})),n(0,c.itemLayout=s,c)}(c.cdata);break;case"p":!function(e){let t=e.split("\n").map((e=>e.trim())).filter((e=>""!=e)),s=[];t.map(((e,t)=>{s.push({id:"ID"+t,value:e,selected:!1})})),n(0,c.itemLayout=s,c)}(c.cdata);break;default:console.warn("No type found to parse")}r&&function(e){let t=v(e);t.smans&&t.smans.div&&t.smans.div._userAns&&(n(0,c.userAns=t.smans.div._userAns.split(","),c),c.itemLayout.map(((e,t)=>{e.selected=!!f.findInArray(e.id,c.userAns)})))}(r)}catch(e){n(1,p=e),console.warn({error:e.message,"function name":"parseXMLPreview","File name":"HotspotTokenPreview.js"})}}(v(s)))})),m((()=>{f.listen("body","keydown",".token",((e,t)=>{13===t.which&&e.click()})),window.inNative&&window.getHeight&&window.getHeight()})),e.$$set=e=>{"xml"in e&&n(7,s=e.xml),"editorState"in e&&n(8,i=e.editorState),"isReview"in e&&n(9,o=e.isReview),"showAns"in e&&n(10,a=e.showAns),"uxml"in e&&n(6,r=e.uxml)},e.$$.update=()=>{2816&e.$$.dirty&&(o?(g(),i&&0==l&&(n(11,l=1),y())):(n(11,l=0),i&&b()))},[c,p,g,b,function(e){n(0,c.itemLayout[e].selected=!c.itemLayout[e].selected,c),function(e,t){let s=c.userAns;if(1==t)s.push("ID"+e),n(0,c.userAns=s,c);else if(0==t){let t=s.indexOf("ID"+e);t>-1&&s.splice(t,1),n(0,c.userAns=s,c)}window.inNative&&window.getHeight&&window.getHeight();n(6,r="<smans><div userAns='"+c.userAns.join()+"'></div></smans>"),y()}(e,c.itemLayout[e].selected)},function(e,t){"c"==e?A("cans","hideIcon"):A("yans","showIcon")},r,s,i,o,a,l]}export default class extends e{constructor(e){var o;super(),document.getElementById("svelte-4djjpi-style")||((o=s("style")).id="svelte-4djjpi-style",o.textContent=".token.svelte-4djjpi.svelte-4djjpi:hover{border:1px solid #000!important}.bla .token:hover{border:1px solid #fff!important}.token_selected.svelte-4djjpi.svelte-4djjpi{background-color:#64bb63;color:#fff}.bla .token_highlight_heading{color:#000!important}.hotspot-token-preview.svelte-4djjpi br.svelte-4djjpi{clear:both}",i(document.head,o)),t(this,e,U,F,n,{xml:7,editorState:8,isReview:9,showAns:10,uxml:6})}}
//# sourceMappingURL=HotspotTokenPreview-a1fa13ae.js.map
