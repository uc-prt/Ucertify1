import{S as t,i as e,s as n,F as o,e as i,b as r,f as s,h as a,j as c,l,r as d,o as u,y as b,V as m}from"./main-91b4ef6d.js";function p(t){o(t,"svelte-ri6gyf",".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}")}function v(t){let e,n,o,m,p,v;return{c(){e=i("div"),n=i("button"),n.textContent="Correct Answer",o=r(),m=i("button"),m.textContent="Your Answer",s(n,"tabindex","0"),s(n,"type","button"),s(n,"mode","c"),s(n,"class","btn btn-light correct-ans"),s(m,"tabindex","0"),s(m,"type","button"),s(m,"mode","u"),s(m,"class","btn btn-light your-ans active"),s(e,"class","smControlerBtn btn-group mb-3"),s(e,"role","group"),s(e,"aria-label","Answer buttons")},m(i,r){a(i,e,r),c(e,n),c(e,o),c(e,m),p||(v=[l(n,"click",t[2]),l(m,"click",t[2])],p=!0)},p:d,d(t){t&&u(e),p=!1,b(v)}}}function w(t){let e,n,o,m,p,w,f,h=t[0]&&v(t);return{c(){e=i("center"),n=i("button"),o=r(),m=i("button"),p=r(),h&&h.c(),s(n,"tabindex","0"),s(n,"type","button"),s(n,"class","h h-imp"),s(n,"id","set-review"),s(m,"tabindex","0"),s(m,"type","button"),s(m,"class","h h-imp"),s(m,"id","unset-review")},m(i,r){a(i,e,r),c(e,n),c(e,o),c(e,m),c(e,p),h&&h.m(e,null),w||(f=[l(n,"click",t[4]),l(m,"click",t[5])],w=!0)},p(t,[n]){t[0]?h?h.p(t,n):(h=v(t),h.c(),h.m(e,null)):h&&(h.d(1),h=null)},i:d,o:d,d(t){t&&u(e),h&&h.d(),w=!1,b(f)}}}function f(t,e,n){let{reviewMode:o=!1}=e,{handleReviewClick:i}=e;const r=m();return t.$$set=t=>{"reviewMode"in t&&n(0,o=t.reviewMode),"handleReviewClick"in t&&n(3,i=t.handleReviewClick)},[o,r,function(t){document.querySelectorAll(".smControlerBtn button").forEach((t=>t.classList.remove("active"))),t.target.classList.add("active"),i&&i(t.target.getAttribute("mode"),t)},i,()=>r("setReview"),()=>r("unsetReview")]}class h extends t{constructor(t){super(),e(this,t,f,w,n,{reviewMode:0,handleReviewClick:3},p)}}export{h as I};
//# sourceMappingURL=ItemHelper-8de8b060.js.map
