import{S as e,i as t,s as a,e as r,C as n,f as i,h as s,j as d,r as l,o,u as p,b as c,l as u,x,q as m,c as f,m as b,t as g,a as h,d as w,D as _,p as v,X as k,T as y}from"./main-91b4ef6d.js";import{I as $}from"./ItemHelper-8de8b060.js";import{s as I}from"./style-inject.es-1f59c1d0.js";function A(e,t,a){const r=e.slice();return r[20]=t[a],r[22]=a,r}function R(e){let t,a;return{c(){t=r("div"),a=r("span"),a.textContent=""+n.oops_msg,i(t,"class","alert alert-danger font-weight-bold")},m(e,r){s(e,t,r),d(t,a)},p:l,d(e){e&&o(t)}}}function S(e){let t;function a(e,t){return e[20].anskey==e[2].datauserans[e[20].sliderid]?j:M}let r=a(e),n=r(e);return{c(){n.c(),t=m()},m(e,a){n.m(e,a),s(e,t,a)},p(e,i){r!==(r=a(e))&&(n.d(1),n=r(e),n&&(n.c(),n.m(t.parentNode,t)))},d(e){n.d(e),e&&o(t)}}}function M(e){let t;return{c(){t=r("span"),t.innerHTML='<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold text-danger"></span>',i(t,"class","correct_incorrect_icon_fill position-absolute")},m(e,a){s(e,t,a)},d(e){e&&o(t)}}}function j(e){let t;return{c(){t=r("span"),t.innerHTML='<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold text-success"></span>',i(t,"class","correct_incorrect_icon_fill position-absolute")},m(e,a){s(e,t,a)},d(e){e&&o(t)}}}function C(e){let t,a,i,l,c=n.correct_val+"",u=e[20].anskey+"";return{c(){t=r("span"),a=p(c),i=p(": "),l=p(u)},m(e,r){s(e,t,r),d(t,a),d(t,i),d(t,l)},p(e,t){2&t&&u!==(u=e[20].anskey+"")&&x(l,u)},d(e){e&&o(t)}}}function H(e){let t,a,i,l,c=n.current_val+"",u=(0==e[2].datauserans[e[20].sliderid]||null==e[2].datauserans[e[20].sliderid]?e[20].defaultans:e[2].datauserans[e[20].sliderid])+"";return{c(){t=r("span"),a=p(c),i=p(": "),l=p(u)},m(e,r){s(e,t,r),d(t,a),d(t,i),d(t,l)},p(e,t){6&t&&u!==(u=(0==e[2].datauserans[e[20].sliderid]||null==e[2].datauserans[e[20].sliderid]?e[20].defaultans:e[2].datauserans[e[20].sliderid])+"")&&x(l,u)},d(e){e&&o(t)}}}function L(e){let t,a,l,m,f,b,g,h,w,_,v,k,y,$,I,A,R,M,j,L,z,E,N,X,P,T,D,U,q,F,G,O,B,J,K=e[20].title_val+"",Q=n.min_val+"",V=e[20].minval+"",W=n.max_val+"",Y=e[20].maxval+"",Z="block"==e[4]&&1==e[3]&&S(e);function ee(e,t){return"block"!=e[4]||0!=e[3]?H:C}let te=ee(e),ae=te(e);return{c(){t=r("div"),a=r("div"),l=r("span"),m=p(K),f=c(),b=r("div"),g=r("input"),$=c(),Z&&Z.c(),I=c(),A=r("div"),R=r("div"),M=r("span"),j=p(Q),L=p(": "),z=p(V),E=c(),N=r("div"),X=r("div"),ae.c(),P=c(),T=r("div"),D=r("span"),U=p(W),q=p(": "),F=p(Y),G=c(),i(a,"class","slider_heading_test text-start text-white bg-primary"),i(a,"tabindex","0"),i(g,"id",h=e[20].sliderid),i(g,"type","range"),i(g,"name","sliderrange"),i(g,"min",w=e[20].minval),i(g,"max",_=e[20].maxval),i(g,"step",v=e[20].step_val),i(g,"class","slideritem"),g.value=k="block"==e[4]&&0==e[3]?parseInt(e[20].anskey):0==e[2].datauserans[e[20].sliderid]||null==e[2].datauserans[e[20].sliderid]?parseInt(e[20].defaultans):parseInt(e[2].datauserans[e[20].sliderid]),g.disabled=y="block"==e[4],i(g,"tabindex","0"),i(R,"class","minRange float-start col px-0 text-start"),i(R,"tabindex","0"),i(X,"class","current_val"),i(N,"class","rangevalue col px-0"),i(N,"tabindex","0"),i(T,"class","max_val float-end col px-0 text-end"),i(T,"tabindex","0"),i(A,"class","range_details mt-2 row mx-0"),i(b,"class","col-md-12 select_slider_test w-100 pt-3 px-3 pb-2"),i(t,"key",O=e[22]),i(t,"class","clearfix slider_container my-3 rounded w-100")},m(r,n){s(r,t,n),d(t,a),d(a,l),d(l,m),d(t,f),d(t,b),d(b,g),d(b,$),Z&&Z.m(b,null),d(b,I),d(b,A),d(A,R),d(R,M),d(M,j),d(M,L),d(M,z),d(A,E),d(A,N),d(N,X),ae.m(X,null),d(A,P),d(A,T),d(T,D),d(D,U),d(D,q),d(D,F),d(t,G),B||(J=u(g,"input",e[6]),B=!0)},p(e,t){2&t&&K!==(K=e[20].title_val+"")&&x(m,K),2&t&&h!==(h=e[20].sliderid)&&i(g,"id",h),2&t&&w!==(w=e[20].minval)&&i(g,"min",w),2&t&&_!==(_=e[20].maxval)&&i(g,"max",_),2&t&&v!==(v=e[20].step_val)&&i(g,"step",v),30&t&&k!==(k="block"==e[4]&&0==e[3]?parseInt(e[20].anskey):0==e[2].datauserans[e[20].sliderid]||null==e[2].datauserans[e[20].sliderid]?parseInt(e[20].defaultans):parseInt(e[2].datauserans[e[20].sliderid]))&&(g.value=k),16&t&&y!==(y="block"==e[4])&&(g.disabled=y),"block"==e[4]&&1==e[3]?Z?Z.p(e,t):(Z=S(e),Z.c(),Z.m(b,I)):Z&&(Z.d(1),Z=null),2&t&&V!==(V=e[20].minval+"")&&x(z,V),te===(te=ee(e))&&ae?ae.p(e,t):(ae.d(1),ae=te(e),ae&&(ae.c(),ae.m(X,null))),2&t&&Y!==(Y=e[20].maxval+"")&&x(F,Y)},d(e){e&&o(t),Z&&Z.d(),ae.d(),B=!1,J()}}}function z(e){let t,a,n,l,p,u,x,m=""!=e[5]&&R();n=new $({props:{reviewMode:e[0],handleReviewClick:e[9]}}),n.$on("setReview",e[7]),n.$on("unsetReview",e[8]);let v=e[1],k=[];for(let t=0;t<v.length;t+=1)k[t]=L(A(e,v,t));return{c(){m&&m.c(),t=c(),a=r("div"),f(n.$$.fragment),l=c(),p=r("div"),u=r("div");for(let e=0;e<k.length;e+=1)k[e].c();i(u,"class","slider_item_container"),i(p,"id","slidermain"),i(a,"class","text-center")},m(e,r){m&&m.m(e,r),s(e,t,r),s(e,a,r),b(n,a,null),d(a,l),d(a,p),d(p,u);for(let e=0;e<k.length;e+=1)k[e].m(u,null);x=!0},p(e,[a]){""!=e[5]?m?m.p(e,a):(m=R(),m.c(),m.m(t.parentNode,t)):m&&(m.d(1),m=null);const r={};if(1&a&&(r.reviewMode=e[0]),n.$set(r),94&a){let t;for(v=e[1],t=0;t<v.length;t+=1){const r=A(e,v,t);k[t]?k[t].p(r,a):(k[t]=L(r),k[t].c(),k[t].m(u,null))}for(;t<k.length;t+=1)k[t].d(1);k.length=v.length}},i(e){x||(g(n.$$.fragment,e),x=!0)},o(e){h(n.$$.fragment,e),x=!1},d(e){m&&m.d(e),e&&o(t),e&&o(a),w(n),_(k,e)}}}function E(e){if(0==Array.isArray(e)){let t=e;(e=[])[0]=t}return e}function N(e,t,a){let r,n,{xml:i}=t,{uxml:s}=t,{showAns:d}=t,{isReview:l}=t,{editorState:o}=t,p=[],c=!0,u={datauserans:{}},x="none",m="";function f(e){!function(e){try{let t=e.smxml.slider;a(1,p=[]),t&&0==Array.isArray(t)&&(t=[],t[0]=e.smxml.slider);for(let e=0;e<t.length;e++)p.push({sliderid:t[e]._key,anskey:t[e]._anskey,title_val:t[e]._title,step_val:t[e]._step,defaultans:t[e]._defaultans,defaultans_id:"defaultans"+t[e]._key,title_id:"title"+t[e]._key,step_id:"step"+t[e]._key,sliderans:"slider"+t[e]._key,remove_item:"remove_item"+t[e]._key,minid:"min"+t[e]._key,maxid:"max"+t[e]._key,sliderop:"sliderop"+t[e]._key,minval:t[e]._minmax.split(",")[0],maxval:t[e]._minmax.split(",")[1]})}catch(e){a(5,m=e),console.log({error:e,function:"parseXMLPreview",File:"SliderItemPreview.js"})}}(e=k(e))}function b(){let e=function(){ISSPECIALMODULEUSERXMLCHANGE=1,r="<smans type='30'>",n=!0,p.map((function(e){a(2,u.datauserans[e.sliderid]=void 0===u.datauserans[e.sliderid]?e.defaultans:u.datauserans[e.sliderid],u),parseInt(e.anskey)!=parseInt(u.datauserans[e.sliderid])&&(n=!1),r+="<slider id='"+e.sliderid+"' userAns='"+u.datauserans[e.sliderid]+"'></slider>"})),r+="</smans>",o||y({uXml:r,ans:n});return n?"Correct":"Incorrect"}();o&&d(e)}function g(){a(4,x="block"),a(0,l=!0)}return v((()=>{f(i),window.inNative&&window.getHeight&&window.getHeight()})),e.$$set=e=>{"xml"in e&&a(10,i=e.xml),"uxml"in e&&a(11,s=e.uxml),"showAns"in e&&a(12,d=e.showAns),"isReview"in e&&a(0,l=e.isReview),"editorState"in e&&a(13,o=e.editorState)},e.$$.update=()=>{if(3079&e.$$.dirty&&(l?(a(4,x="block"),b(),g()):a(4,x="none"),i!=u.xml)){let e,t;a(2,u.xml=i,u),f(i),e=k(""==i?u.xml:i),t=k(u.xml);let r=E(e.smxml.slider),n=E(t.smxml.slider);if(r.map((function(e,t){null!=n[t]&&e._defaultans!=n[t]._defaultans&&a(2,u.datauserans[e._key]=n[t]._defaultans,u)})),s){let e;e=k(s),void 0!==e.smans.slider&&p.map((function(t,r){a(2,u.datauserans[t.sliderid]=e.smans.slider[r]._userAns,u)}))}}},[l,p,u,c,x,m,function(){a(2,u.datauserans[this.id]=this.value,u),a(2,u),a(0,l),a(10,i),a(11,s),a(1,p),b()},g,function(){a(4,x="none"),a(0,l=!1)},function(e){"c"==e?a(3,c=!1):"u"==e&&a(3,c=!0)},i,s,d,o]}I(".slider_item_container{max-width:710px;margin:0 auto;padding:15px 15px}.slider_heading{border:1px solid #a6c8ff;height:28px;border-radius:2px;padding-top:3px}.slider_heading_test{border:1px solid #a6c8ff;padding:2px 10px;border-radius:2px}.removeitem{width:23px;padding-top:4px}.sliderdefaultans,.slidermax,.slidermin,.sliderstep{width:70px;margin-top:9px}.slideroutput{margin-top:9px;float:left;width:70px;border:1px solid #ccc;height:34px;border-radius:4px;background:#dcdcdc}.slider_container{border:1px solid #a6c8ff}.correct_incorrect_icon_fill{right:2px;top:0;font-size:18px}input[type=range]{-webkit-appearance:none;margin:18px 0;width:100%;background:0 0}input[type=range]:focus{outline:0}input[type=range]::-webkit-slider-runnable-track{width:100%;height:4px;cursor:pointer;box-shadow:1px 1px 1px #000,0 0 1px #0d0d0d;background:#0087ca;border-radius:1.3px;border:1px solid #010101}input[type=range]::-webkit-slider-thumb{box-shadow:0 0 2px 2px #ccc;height:16px;width:16px;border-radius:50%;background:#fff;cursor:pointer;-webkit-appearance:none;margin-top:-7px}input[type=range]:focus::-moz-range-track,input[type=range]:focus::-webkit-slider-runnable-track{background:#05e6ff}input[type=range]::-moz-range-track{width:100%;height:2.4px;cursor:pointer;box-shadow:1px 1px 1px #000,0 0 1px #0d0d0d;background:#0087ca;border-radius:1.3px;border:.2px solid #010101}input[type=range]::-moz-range-thumb{box-shadow:1px 1px 1px #000,0 0 1px #0d0d0d;border:1px solid #000;height:16px;width:16px;border-radius:50%;background:#fff;cursor:pointer}input[type=range]::-ms-track{width:100%;height:5px;cursor:pointer;background:0 0;border-color:transparent;border-width:16px 0;border-radius:1.3px;color:transparent}input[type=range]::-ms-fill-lower{background:#0087ca;border:.1px solid #010101;border-radius:2.6px;box-shadow:1px 1px 1px #000,0 0 1px #0d0d0d}input[type=range]::-ms-fill-upper{background:#0087ca;border:.1px solid #010101;border-radius:2.6px;box-shadow:1px 1px 1px #000,0 0 1px #0d0d0d}input[type=range]::-ms-thumb{box-shadow:0 0 1px 1px #ccc;border:1px solid #000;height:16px;width:16px;border-radius:50%;background:#fff;cursor:pointer;margin-top:.8px}.width100{width:100px}.slideropt{margin-top:6px}.btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}");export default class extends e{constructor(e){super(),t(this,e,N,z,a,{xml:10,uxml:11,showAns:12,isReview:0,editorState:13})}}
//# sourceMappingURL=SliderItemPreview-2097e7e3.js.map
