import{S as t,i as e,s as n,F as o,e as s,b as i,f as r,h as a,j as l,l as c,r as d,o as u,y as b,$ as m}from"./main-49498b52.js";function p(t){o(t,"svelte-ri6gyf",".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}")}function v(t){let e,n,o,m,p,v;return{c(){e=s("div"),n=s("button"),n.textContent="Correct Answer",o=i(),m=s("button"),m.textContent="Your Answer",r(n,"tabindex","0"),r(n,"type","button"),r(n,"mode","c"),r(n,"class","btn btn-light correct-ans svelte_items_test"),r(m,"tabindex","0"),r(m,"type","button"),r(m,"mode","u"),r(m,"class","btn btn-light your-ans active svelte_items_test"),r(e,"class","smControlerBtn btn-group mb-3"),r(e,"role","group"),r(e,"aria-label","Answer buttons")},m(s,i){a(s,e,i),l(e,n),l(e,o),l(e,m),p||(v=[c(n,"click",t[2]),c(m,"click",t[2])],p=!0)},p:d,d(t){t&&u(e),p=!1,b(v)}}}function w(t){let e,n,o,m,p,w,f,h=t[0]&&v(t);return{c(){e=s("center"),n=s("button"),o=i(),m=s("button"),p=i(),h&&h.c(),r(n,"tabindex","0"),r(n,"type","button"),r(n,"class","h h-imp svelte_items_test"),r(n,"id","set-review"),r(m,"tabindex","0"),r(m,"type","button"),r(m,"class","h h-imp svelte_items_test"),r(m,"id","unset-review")},m(s,i){a(s,e,i),l(e,n),l(e,o),l(e,m),l(e,p),h&&h.m(e,null),w||(f=[c(n,"click",t[4]),c(m,"click",t[5])],w=!0)},p(t,[n]){t[0]?h?h.p(t,n):(h=v(t),h.c(),h.m(e,null)):h&&(h.d(1),h=null)},i:d,o:d,d(t){t&&u(e),h&&h.d(),w=!1,b(f)}}}function f(t,e,n){let{reviewMode:o=!1}=e,{handleReviewClick:s}=e;const i=m();return t.$$set=t=>{"reviewMode"in t&&n(0,o=t.reviewMode),"handleReviewClick"in t&&n(3,s=t.handleReviewClick)},[o,i,function(t){document.querySelectorAll(".smControlerBtn button").forEach((t=>t.classList.remove("active"))),t.target.classList.add("active"),s&&s(t.target.getAttribute("mode"),t)},s,()=>i("setReview"),()=>i("unsetReview")]}class h extends t{constructor(t){super(),e(this,t,f,w,n,{reviewMode:0,handleReviewClick:3},p)}}export{h as I};
//# sourceMappingURL=ItemHelper-53a6b3bd.js.map
