import{S as t,i as e,s as n,F as o,e as s,j as i,b as r,f as a,h as c,l,r as d,o as b,y as u,q as m,U as p}from"./main-daecf310.js";const{document:v}=o;function w(t){let e,n,o,m,p,v;return{c(){e=s("div"),n=s("button"),n.textContent="Correct Answer",o=r(),m=s("button"),m.textContent="Your Answer",a(n,"tabindex","0"),a(n,"type","button"),a(n,"mode","c"),a(n,"class","btn btn-light correct-ans"),a(m,"tabindex","0"),a(m,"type","button"),a(m,"mode","u"),a(m,"class","btn btn-light your-ans active"),a(e,"class","smControlerBtn btn-group mb-3"),a(e,"role","group"),a(e,"aria-label","Answer buttons")},m(s,r){c(s,e,r),i(e,n),i(e,o),i(e,m),p||(v=[l(n,"click",t[2]),l(m,"click",t[2])],p=!0)},p:d,d(t){t&&b(e),p=!1,u(v)}}}function f(t){let e,n,o,i,p,v,f,h=t[0]&&w(t);return{c(){e=s("button"),n=r(),o=s("button"),i=r(),h&&h.c(),p=m(),a(e,"tabindex","0"),a(e,"type","button"),a(e,"class","h h-imp"),a(e,"id","set-review"),a(o,"tabindex","0"),a(o,"type","button"),a(o,"class","h h-imp"),a(o,"id","unset-review")},m(s,r){c(s,e,r),c(s,n,r),c(s,o,r),c(s,i,r),h&&h.m(s,r),c(s,p,r),v||(f=[l(e,"click",t[4]),l(o,"click",t[5])],v=!0)},p(t,[e]){t[0]?h?h.p(t,e):(h=w(t),h.c(),h.m(p.parentNode,p)):h&&(h.d(1),h=null)},i:d,o:d,d(t){t&&b(e),t&&b(n),t&&b(o),t&&b(i),h&&h.d(t),t&&b(p),v=!1,u(f)}}}function h(t,e,n){let{reviewMode:o=!1}=e,{handleReviewClick:s}=e;const i=p();return t.$$set=t=>{"reviewMode"in t&&n(0,o=t.reviewMode),"handleReviewClick"in t&&n(3,s=t.handleReviewClick)},[o,i,function(t){document.querySelectorAll(".smControlerBtn button").forEach((t=>t.classList.remove("active"))),t.target.classList.add("active"),s&&s(t.target.getAttribute("mode"),t)},s,()=>i("setReview"),()=>i("unsetReview")]}class x extends t{constructor(t){var o;super(),v.getElementById("svelte-ri6gyf-style")||((o=s("style")).id="svelte-ri6gyf-style",o.textContent=".smControlerBtn .btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}",i(v.head,o)),e(this,t,h,f,n,{reviewMode:0,handleReviewClick:3})}}export{x as I};
//# sourceMappingURL=ItemHelper-f40df82d.js.map
