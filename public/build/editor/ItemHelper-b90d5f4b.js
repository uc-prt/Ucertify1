import{S as t,i as e,s as o,D as n,e as s,b as i,f as r,h as c,j as l,l as a,r as d,o as u,y as m,A as b,Z as v}from"./main-ddd9bfcc.js";function w(t){n(t,"svelte-ri6gyf",".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}")}function p(t){let e,o,n,b,v,w;return{c(){e=s("div"),o=s("button"),o.textContent="Correct Answer",n=i(),b=s("button"),b.textContent="Your Answer",r(o,"type","button"),r(o,"mode","c"),r(o,"class","btn btn-light correct-ans svelte_items_test"),r(b,"type","button"),r(b,"mode","u"),r(b,"class","btn btn-light your-ans active svelte_items_test"),r(e,"class","smControlerBtn btn-group mb-3"),r(e,"aria-label","Answer buttons")},m(s,i){c(s,e,i),l(e,o),l(e,n),l(e,b),v||(w=[a(o,"click",t[3]),a(b,"click",t[3])],v=!0)},p:d,d(t){t&&u(e),v=!1,m(w)}}}function h(t){let e,o,n,b,v,w,h,f=(t[0]||t[1])&&p(t);return{c(){e=s("center"),o=s("button"),n=i(),b=s("button"),v=i(),f&&f.c(),r(o,"type","button"),r(o,"class","h h-imp svelte_items_test"),r(o,"id","set-review"),r(b,"type","button"),r(b,"class","h h-imp svelte_items_test"),r(b,"id","unset-review")},m(s,i){c(s,e,i),l(e,o),l(e,n),l(e,b),l(e,v),f&&f.m(e,null),w||(h=[a(o,"click",t[5]),a(b,"click",t[6])],w=!0)},p(t,[o]){t[0]||t[1]?f?f.p(t,o):(f=p(t),f.c(),f.m(e,null)):f&&(f.d(1),f=null)},i:d,o:d,d(t){t&&u(e),f&&f.d(),w=!1,m(h)}}}function f(t,e,o){let{reviewMode:n=!1}=e,{handleReviewClick:s}=e,{customReviewMode:i}=e;b.listen("body","keydown",".smControlerBtn .correct-ans",(function(t,e){13===e.which&&t.click()})),b.listen("body","keydown",".smControlerBtn .your-ans",(function(t,e){13===e.which&&t.click()}));const r=v();return t.$$set=t=>{"reviewMode"in t&&o(0,n=t.reviewMode),"handleReviewClick"in t&&o(4,s=t.handleReviewClick),"customReviewMode"in t&&o(1,i=t.customReviewMode)},[n,i,r,function(t){document.querySelectorAll(".smControlerBtn button").forEach((t=>t.classList.remove("active"))),t.target.classList.add("active"),s&&s(t.target.getAttribute("mode"),t)},s,()=>r("setReview"),()=>r("unsetReview")]}class k extends t{constructor(t){super(),e(this,t,f,h,o,{reviewMode:0,handleReviewClick:4,customReviewMode:1},w)}}export{k as I};
//# sourceMappingURL=ItemHelper-b90d5f4b.js.map
