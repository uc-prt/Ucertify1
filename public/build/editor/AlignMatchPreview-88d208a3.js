import{S as t,i as e,s as n,e as a,b as l,f as i,h as o,j as r,u as s,x as c,o as m,q as d,z as u,r as g,A as p,Q as f,l as h,L as b,g as x,y,c as _,m as w,t as v,a as A,d as k,k as C,n as E,p as T,C as $,a3 as j,X as S,V as M,D as N,B as z}from"./main-75ae509f.js";import{I as L}from"./ItemHelper-39d01ef6.js";import{s as H}from"./style-inject.es-1f59c1d0.js";function V(t,e,n){const a=t.slice();return a[6]=e[n],a[8]=n,a}function O(t,e,n){const a=t.slice();return a[9]=e[n],a[11]=n,a}function R(t,e,n){const a=t.slice();return a[12]=e[n],a}function q(t){let e,n,s,c,d=t[0].categories,g=[];for(let e=0;e<d.length;e+=1)g[e]=I(R(t,d,e));let p=t[1],f=[];for(let e=0;e<p.length;e+=1)f[e]=X(V(t,p,e));return{c(){e=a("table"),n=a("tbody"),s=a("tr");for(let t=0;t<g.length;t+=1)g[t].c();c=l();for(let t=0;t<f.length;t+=1)f[t].c();i(s,"class","remedcolumn height50"),i(e,"class","table"),i(e,"id","alignmatch-table")},m(t,a){o(t,e,a),r(e,n),r(n,s);for(let t=0;t<g.length;t+=1)g[t].m(s,null);r(n,c);for(let t=0;t<f.length;t+=1)f[t].m(n,null)},p(t,e){if(1&e){let n;for(d=t[0].categories,n=0;n<d.length;n+=1){const a=R(t,d,n);g[n]?g[n].p(a,e):(g[n]=I(a),g[n].c(),g[n].m(s,null))}for(;n<g.length;n+=1)g[n].d(1);g.length=d.length}if(62&e){let a;for(p=t[1],a=0;a<p.length;a+=1){const l=V(t,p,a);f[a]?f[a].p(l,e):(f[a]=X(l),f[a].c(),f[a].m(n,null))}for(;a<f.length;a+=1)f[a].d(1);f.length=p.length}},d(t){t&&m(e),u(g,t),u(f,t)}}}function I(t){let e,n,d,u,g,p=t[12].text+"";return{c(){e=a("td"),n=a("h3"),d=s(p),u=l(),i(n,"tabindex","0"),i(n,"class","m-0 font-italic"),i(e,"key",g=t[12].text+"_"+t[12].id),i(e,"class","steel-bg")},m(t,a){o(t,e,a),r(e,n),r(n,d),r(e,u)},p(t,n){1&n&&p!==(p=t[12].text+"")&&c(d,p),1&n&&g!==(g=t[12].text+"_"+t[12].id)&&i(e,"key",g)},d(t){t&&m(e)}}}function U(t){let e,n=t[6],a=[];for(let e=0;e<n.length;e+=1)a[e]=B(O(t,n,e));return{c(){for(let t=0;t<a.length;t+=1)a[t].c();e=d()},m(t,n){for(let e=0;e<a.length;e+=1)a[e].m(t,n);o(t,e,n)},p(t,l){if(54&l){let i;for(n=t[6],i=0;i<n.length;i+=1){const o=O(t,n,i);a[i]?a[i].p(o,l):(a[i]=B(o),a[i].c(),a[i].m(e.parentNode,e))}for(;i<a.length;i+=1)a[i].d(1);a.length=n.length}},d(t){u(a,t),t&&m(e)}}}function D(t){let e,n,l=t[9].label+"";return{c(){e=a("div"),i(e,"class","elementText"),i(e,"tabindex","0"),i(e,"title",n=t[9].label)},m(t,n){o(t,e,n),e.innerHTML=l},p(t,a){2&a&&l!==(l=t[9].label+"")&&(e.innerHTML=l),2&a&&n!==(n=t[9].label)&&i(e,"title",n)},d(t){t&&m(e)}}}function G(t){let e,n,l,s,c;return{c(){e=a("div"),n=a("img"),i(n,"class","imagData"),n.src!==(l="//s3.amazonaws.com/jigyaasa_content_static//"+t[9].imageurl)&&i(n,"src",l),i(n,"tabindex","0"),i(n,"alt",s=t[9].imagealt),i(n,"title",c=t[9].imagealt)},m(t,a){o(t,e,a),r(e,n)},p(t,e){2&e&&n.src!==(l="//s3.amazonaws.com/jigyaasa_content_static//"+t[9].imageurl)&&i(n,"src",l),2&e&&s!==(s=t[9].imagealt)&&i(n,"alt",s),2&e&&c!==(c=t[9].imagealt)&&i(n,"title",c)},d(t){t&&m(e)}}}function P(t){let e;function n(t,e){return t[9].imageurl&&""!=t[2].userAnswerArr[t[9].tags][t[11]].imageurl?J:""!=t[9].label?W:void 0}let a=n(t),l=a&&a(t);return{c(){l&&l.c(),e=d()},m(t,n){l&&l.m(t,n),o(t,e,n)},p(t,i){a===(a=n(t))&&l?l.p(t,i):(l&&l.d(1),l=a&&a(t),l&&(l.c(),l.m(e.parentNode,e)))},d(t){l&&l.d(t),t&&m(e)}}}function W(t){let e,n,l=t[2].userAnswerArr[t[9].tags][t[11]].label+"";return{c(){e=a("div"),i(e,"class","elementText"),i(e,"tabindex","0"),i(e,"title",n=t[9].label)},m(t,n){o(t,e,n),e.innerHTML=l},p(t,a){6&a&&l!==(l=t[2].userAnswerArr[t[9].tags][t[11]].label+"")&&(e.innerHTML=l),2&a&&n!==(n=t[9].label)&&i(e,"title",n)},d(t){t&&m(e)}}}function J(t){let e,n,l,r;return{c(){e=a("img"),i(e,"class","imagData"),e.src!==(n="//s3.amazonaws.com/jigyaasa_content_static//"+t[2].userAnswerArr[t[9].tags][t[11]].imageurl)&&i(e,"src",n),i(e,"tabindex","0"),i(e,"alt",l=t[9].imagealt),i(e,"title",r=t[9].imagealt)},m(t,n){o(t,e,n)},p(t,a){6&a&&e.src!==(n="//s3.amazonaws.com/jigyaasa_content_static//"+t[2].userAnswerArr[t[9].tags][t[11]].imageurl)&&i(e,"src",n),2&a&&l!==(l=t[9].imagealt)&&i(e,"alt",l),2&a&&r!==(r=t[9].imagealt)&&i(e,"title",r)},d(t){t&&m(e)}}}function B(t){let e,n,s,c,d;function u(t,e){return 1==t[5]?P:t[9].imageurl&&""!=t[9].imageurl?G:""!=t[9].label?D:void 0}let g=u(t),p=g&&g(t);return{c(){e=a("td"),p&&p.c(),n=l(),i(e,"key",s=t[11]),i(e,"col",c=t[9].id),i(e,"class",d="position-relative "+t[4]+" align-middle column_"+(t[11]+1))},m(t,a){o(t,e,a),p&&p.m(e,null),r(e,n)},p(t,a){g===(g=u(t))&&p?p.p(t,a):(p&&p.d(1),p=g&&g(t),p&&(p.c(),p.m(e,n))),2&a&&c!==(c=t[9].id)&&i(e,"col",c),16&a&&d!==(d="position-relative "+t[4]+" align-middle column_"+(t[11]+1))&&i(e,"class",d)},d(t){t&&m(e),p&&p.d()}}}function X(t){let e,n,s,c,d=t[6]&&U(t);return{c(){e=a("tr"),d&&d.c(),n=l(),i(e,"key",s=t[8]),i(e,"class",c=t[3]+" remedcolumn row_"+(t[8]+1))},m(t,a){o(t,e,a),d&&d.m(e,null),r(e,n)},p(t,a){t[6]?d?d.p(t,a):(d=U(t),d.c(),d.m(e,n)):d&&(d.d(1),d=null),8&a&&c!==(c=t[3]+" remedcolumn row_"+(t[8]+1))&&i(e,"class",c)},d(t){t&&m(e),d&&d.d()}}}function Q(t){let e,n=t[0]&&q(t);return{c(){n&&n.c(),e=d()},m(t,a){n&&n.m(t,a),o(t,e,a)},p(t,[a]){t[0]?n?n.p(t,a):(n=q(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},i:g,o:g,d(t){n&&n.d(t),t&&m(e)}}}function F(t,e,n){let{jsondataCategory:a}=e,{objValues:l}=e,{state:i}=e,{correct_ans_bg:o=""}=e,{your_ans_class:r=""}=e,{user_ans_table:s}=e;return t.$$set=t=>{"jsondataCategory"in t&&n(0,a=t.jsondataCategory),"objValues"in t&&n(1,l=t.objValues),"state"in t&&n(2,i=t.state),"correct_ans_bg"in t&&n(3,o=t.correct_ans_bg),"your_ans_class"in t&&n(4,r=t.your_ans_class),"user_ans_table"in t&&n(5,s=t.user_ans_table)},[a,l,i,o,r,s]}class K extends t{constructor(t){super(),e(this,t,F,Q,n,{jsondataCategory:0,objValues:1,state:2,correct_ans_bg:3,your_ans_class:4,user_ans_table:5})}}H(".alignTestarea{user-select:none}.alignTestarea p{margin:2rem 0;font-size:1.6rem;line-height:1.5;font-weight:400;font-family:Roboto,sans-serif}.alignTestarea p:first-of-type{margin-top:3rem}.categoryinnercontainer{border:2px solid #4182b9;display:block}.card_border{background:#eee;padding-top:3px;border-radius:10px 10px 0 0;border-bottom:2px solid #ccc;width:99.5%;height:auto;margin:0 auto}.categoryitemcontainer{width:100%;position:relative}.nextbutton,.prevbutton{display:block;opacity:.8;position:relative;cursor:pointer;height:94px;color:#4182b9;text-align:center}.nextbutton:hover,.prevbutton:hover{opacity:1}.btnGrp{position:relative;top:50%}.categoryiteminnercontainer img{display:block;margin:0 auto}.matchbutton,.reset_btn{font-size:19px;padding-left:70px;padding-right:70px}.element{width:100%;height:100%;display:table-cell;vertical-align:middle}.overlay{background-color:transparent;position:relative;top:0;left:0;right:0;bottom:0;width:100%;height:100%;-webkit-transition:background-color .2s ease-in;transition:background-color .2s ease-in;z-index:20}.item.left{float:left}.item.clear{clear:both}.typeCorrect{background:#d1f5cb}.typeIncorrect{background:#f0cbd1}.remedcolumn{border:1px solid #000;position:relative;width:100px;height:100px;text-align:center}.categoryAuthorcontainer table{font-family:arial,sans-serif;border-collapse:unset;width:100%}.categoryAuthorcontainer table td{border:1px solid #ddd;text-align:left;padding:8px}.categoryAuthorcontainer table tr:nth-child(even){background-color:#ddd}.fileUpload{width:19px;height:24px;position:relative;left:-26px;bottom:20px}.categoryAuthorcontainer table tr td button{width:29px;height:22px}.fileUpload span{top:-5px;left:-7px}.categoryAuthorcontainer table tr td button span{left:-1px}.btn_category{width:20px;height:30px;position:relative;right:-1px;margin:6px 0 0 10px;padding:3px 0 0 7px}.btn_category span{left:-6px;top:-6px;font-size:13px}.tableContainer{overflow-x:auto}.rowContainer{width:100%;margin-bottom:8px;min-height:70px;display:inline-flex}.columnContainer{width:180px;padding:5px 8px 5px 0;min-height:70px;display:inline-flex;border:1px solid #747477;margin:0 0 6px 10px}.nextbutton img,.prevbutton img{position:relative;top:36%;width:57%}.remedcolumn td{border:1px solid #000!important;text-align:center}.elementText{padding:17px 0;font-weight:700;font-size:18px}td .elementText{line-height:normal;font-weight:700;font-size:14px;overflow:hidden;text-overflow:ellipsis;margin:0 auto}.remedcolumn .elementText.other{font-weight:400;font-size:14px}.heightmin{height:0%}.glyCorrect{color:green}.glyIncorrect{color:red}.yourAnswer table{width:100%!important;border-collapse:unset}.correctAnswer table{width:100%!important;border-collapse:unset}.text_alignmatch{min-height:56px;max-height:150px;cursor:pointer}.r-lg{-webkit-border-radius:15px;-moz-border-radius:15px;border-radius:15px}.span9{width:700px}.wrong_ans{animation:shake .82s cubic-bezier(.36,.07,.19,.97) both;transform:translate3d(0,0,0);backface-visibility:hidden;perspective:1000px}.steel-bg{background-color:#7aa8ce;color:#fff!important}@keyframes shake{10%,90%{transform:translate3d(-1px,0,0)}20%,80%{transform:translate3d(2px,0,0)}30%,50%,70%{transform:translate3d(-4px,0,0)}40%,60%{transform:translate3d(4px,0,0)}}.light-cyan-bg{background-color:#d4e4ff;color:#333}.add_cat_btn{transform:rotate(270deg);width:109px}.scoreDiv{overflow:auto}.height50{height:50px}.btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}");const{window:Y}=N;function Z(t,e,n){const a=t.slice();return a[37]=e[n],a[39]=n,a}function tt(t,e,n){const a=t.slice();return a[40]=e[n],a}function et(t){let e,n=t[3].xml.category.categories,a=[];for(let e=0;e<n.length;e+=1)a[e]=rt(Z(t,n,e));return{c(){for(let t=0;t<a.length;t+=1)a[t].c();e=d()},m(t,n){for(let e=0;e<a.length;e+=1)a[e].m(t,n);o(t,e,n)},p(t,l){if(1928&l[0]){let i;for(n=t[3].xml.category.categories,i=0;i<n.length;i+=1){const o=Z(t,n,i);a[i]?a[i].p(o,l):(a[i]=rt(o),a[i].c(),a[i].m(e.parentNode,e))}for(;i<a.length;i+=1)a[i].d(1);a.length=n.length}},d(t){u(a,t),t&&m(e)}}}function nt(t){let e,n=0==t[3].correct_match["category_"+t[40].sequence]&&at(t);return{c(){n&&n.c(),e=d()},m(t,a){n&&n.m(t,a),o(t,e,a)},p(t,a){0==t[3].correct_match["category_"+t[40].sequence]?n?n.p(t,a):(n=at(t),n.c(),n.m(e.parentNode,e)):n&&(n.d(1),n=null)},d(t){n&&n.d(t),t&&m(e)}}}function at(t){let e,n,s,c,d;function u(t,e){return""!=t[40].imageurl?it:""!=t[40].label?lt:void 0}let g=u(t),p=g&&g(t);return{c(){e=a("div"),p&&p.c(),n=l(),i(e,"class","element bg-white m-0"),i(e,"seq_no",s="category_"+t[40].sequence),i(e,"key",c=t[40].id),i(e,"data-tags",d=t[40].tags),x(e,"display","none")},m(t,a){o(t,e,a),p&&p.m(e,null),r(e,n)},p(t,a){g===(g=u(t))&&p?p.p(t,a):(p&&p.d(1),p=g&&g(t),p&&(p.c(),p.m(e,n))),8&a[0]&&s!==(s="category_"+t[40].sequence)&&i(e,"seq_no",s),8&a[0]&&c!==(c=t[40].id)&&i(e,"key",c),8&a[0]&&d!==(d=t[40].tags)&&i(e,"data-tags",d)},d(t){t&&m(e),p&&p.d()}}}function lt(t){let e,n,l,r=t[40].label+"";return{c(){e=a("div"),i(e,"class","elementText"),i(e,"tabindex",n=0),i(e,"title",l=t[40].label)},m(t,n){o(t,e,n),e.innerHTML=r},p(t,n){8&n[0]&&r!==(r=t[40].label+"")&&(e.innerHTML=r),8&n[0]&&l!==(l=t[40].label)&&i(e,"title",l)},d(t){t&&m(e)}}}function it(t){let e,n,l,r,s,c,d,u;return{c(){e=a("img"),i(e,"data-check",n=t[39]),e.src!==(l="//s3.amazonaws.com/jigyaasa_content_static//"+t[40].imageurl)&&i(e,"src",l),i(e,"class","img-fluid"),i(e,"tabindex",r=0),i(e,"alt",s=t[40].imagealt?t[40].imagealt:"No alt of image"),i(e,"title",c=t[40].imagealt?t[40].imagealt:"No alt of image")},m(n,a){o(n,e,a),d||(u=h(e,"load",t[8]),d=!0)},p(t,n){8&n[0]&&e.src!==(l="//s3.amazonaws.com/jigyaasa_content_static//"+t[40].imageurl)&&i(e,"src",l),8&n[0]&&s!==(s=t[40].imagealt?t[40].imagealt:"No alt of image")&&i(e,"alt",s),8&n[0]&&c!==(c=t[40].imagealt?t[40].imagealt:"No alt of image")&&i(e,"title",c)},d(t){t&&m(e),d=!1,u()}}}function ot(t){let e,n=t[37].id==t[40].category&&-1==t[7].indexOf(t[40].id),a=n&&nt(t);return{c(){a&&a.c(),e=d()},m(t,n){a&&a.m(t,n),o(t,e,n)},p(t,l){8&l[0]&&(n=t[37].id==t[40].category&&-1==t[7].indexOf(t[40].id)),n?a?a.p(t,l):(a=nt(t),a.c(),a.m(e.parentNode,e)):a&&(a.d(1),a=null)},d(t){a&&a.d(t),t&&m(e)}}}function rt(t){let e,n,s,c,d,g,p,f,x,_,w,v,A,k,C,E,T,$,j,S,M,N,z,L=t[37].text+"",H=t[3].xml.item.items,V=[];for(let e=0;e<H.length;e+=1)V[e]=ot(tt(t,H,e));return{c(){e=a("div"),n=a("div"),n.innerHTML='<span class="icomoon-arrow-left font26 btnGrp"></span>',d=l(),g=a("div"),p=a("div"),f=a("div"),w=l(),v=a("div"),A=a("div"),k=a("div");for(let t=0;t<V.length;t+=1)V[t].c();E=l(),T=a("div"),T.innerHTML='<span class="icomoon-arrow-right-2 font26 btnGrp"></span>',S=l(),i(n,"class",s="prevbutton col-lg-1 col-md-1 col-sm-2 col-2 px-sm-3 px-0 prevbutton_"+t[39]),i(n,"tabindex",c=0),i(n,"title","previous"),i(f,"class","font20 text-center text-dark"),i(f,"tabindex",x=0),i(f,"title",_=t[37].text),i(p,"class","categorytitle card_border"),i(k,"class","elementContainer w-100 h-100 d-table"),i(A,"class","categoryiteminnercontainer w-100 h-100 text-center"),i(v,"class",C="categoryitemcontainer p-1 categoryitemcontainer_"+t[39]),i(g,"class","categoryinnercontainer p-0 r-lg col-lg-10 col-md-10 col-sm-8 col-8"),i(T,"class",$="nextbutton col-md-1 col-lg-1 col-sm-2 col-2 px-sm-3 px-0 nextbutton_"+t[39]),i(T,"tabindex",j=0),i(T,"title","next"),i(e,"class","row np mb-3"),i(e,"key",M=t[39])},m(a,l){o(a,e,l),r(e,n),r(e,d),r(e,g),r(g,p),r(p,f),f.innerHTML=L,r(g,w),r(g,v),r(v,A),r(A,k);for(let t=0;t<V.length;t+=1)V[t].m(k,null);r(e,E),r(e,T),r(e,S),N||(z=[h(n,"click",b(t[9])),h(n,"keydown",ut),h(T,"click",t[10]),h(T,"keydown",ut)],N=!0)},p(t,e){if(8&e[0]&&L!==(L=t[37].text+"")&&(f.innerHTML=L),8&e[0]&&_!==(_=t[37].text)&&i(f,"title",_),392&e[0]){let n;for(H=t[3].xml.item.items,n=0;n<H.length;n+=1){const a=tt(t,H,n);V[n]?V[n].p(a,e):(V[n]=ot(a),V[n].c(),V[n].m(k,null))}for(;n<V.length;n+=1)V[n].d(1);V.length=H.length}},d(t){t&&m(e),u(V,t),N=!1,y(z)}}}function st(t){let e,n,l,d,u=t[3].xml.settings.matchButtonText+"";return{c(){e=a("button"),n=s(u),i(e,"type","button"),i(e,"class","matchbutton btn btn-primary mb-2")},m(a,i){o(a,e,i),r(e,n),l||(d=[h(e,"click",t[13]),h(e,"keydown",ut)],l=!0)},p(t,e){8&e[0]&&u!==(u=t[3].xml.settings.matchButtonText+"")&&c(n,u)},d(t){t&&m(e),l=!1,y(d)}}}function ct(t){let e,n,s,c,d,u,g,p;return c=new K({props:{jsondataCategory:t[2].category,objValues:dt(t[6]),state:t[3],correct_ans_bg:"typeCorrect"}}),g=new K({props:{user_ans_table:"1",jsondataCategory:t[2].category,objValues:dt(t[6]),state:t[3],your_ans_class:"your_ans_td"}}),{c(){e=a("div"),n=a("div"),s=a("div"),_(c.$$.fragment),d=l(),u=a("div"),_(g.$$.fragment),i(s,"class","correctAnswer h"),i(u,"class","yourAnswer"),i(n,"class","scoreDiv"),i(e,"class","finalResult")},m(t,a){o(t,e,a),r(e,n),r(n,s),w(c,s,null),r(n,d),r(n,u),w(g,u,null),p=!0},p(t,e){const n={};4&e[0]&&(n.jsondataCategory=t[2].category),64&e[0]&&(n.objValues=dt(t[6])),8&e[0]&&(n.state=t[3]),c.$set(n);const a={};4&e[0]&&(a.jsondataCategory=t[2].category),64&e[0]&&(a.objValues=dt(t[6])),8&e[0]&&(a.state=t[3]),g.$set(a)},i(t){p||(v(c.$$.fragment,t),v(g.$$.fragment,t),p=!0)},o(t){A(c.$$.fragment,t),A(g.$$.fragment,t),p=!1},d(t){t&&m(e),k(c),k(g)}}}function mt(t){let e,n,s,c,d,u,b,y,T,$,j,S,M,N,H=1==p.get("alignMatchReset");f(t[21]),n=new L({props:{handleReviewClick:t[15],reviewMode:t[0],customReviewMode:t[1]}}),n.$on("setReview",t[11]),n.$on("unsetReview",t[12]);let V=t[3].xml&&et(t),O=H&&function(t){let e,n,l;return{c(){e=a("button"),e.textContent=""+z.reset,i(e,"type","button"),i(e,"id","reset_btn"),i(e,"class","btn btn-primary me-sm-2 me-0 mb-2 reset_btn"),e.disabled="disabled"},m(a,i){o(a,e,i),n||(l=h(e,"click",t[14]),n=!0)},p:g,d(t){t&&m(e),n=!1,l()}}}(t),R=t[3].xml&&st(t),q="block"==t[5]&&ct(t);return{c(){e=a("div"),_(n.$$.fragment),s=l(),c=a("div"),d=a("div"),V&&V.c(),b=l(),y=a("div"),O&&O.c(),T=l(),R&&R.c(),j=l(),q&&q.c(),i(d,"class",u="categorycontainer center-block "+(t[4]>1200?"span9":"")),i(y,"class","text-center"),i(c,"class",$="alignTestarea px-3 mx-auto mt-3 "+("block"==t[5]?"h":"")),x(c,"max-width",t[3].maxWidth)},m(a,l){o(a,e,l),w(n,e,null),r(e,s),r(e,c),r(c,d),V&&V.m(d,null),r(c,b),r(c,y),O&&O.m(y,null),r(y,T),R&&R.m(y,null),r(e,j),q&&q.m(e,null),S=!0,M||(N=h(Y,"resize",t[21]),M=!0)},p(t,a){const l={};1&a[0]&&(l.reviewMode=t[0]),2&a[0]&&(l.customReviewMode=t[1]),n.$set(l),t[3].xml?V?V.p(t,a):(V=et(t),V.c(),V.m(d,null)):V&&(V.d(1),V=null),(!S||16&a[0]&&u!==(u="categorycontainer center-block "+(t[4]>1200?"span9":"")))&&i(d,"class",u),H&&O.p(t,a),t[3].xml?R?R.p(t,a):(R=st(t),R.c(),R.m(y,null)):R&&(R.d(1),R=null),(!S||32&a[0]&&$!==($="alignTestarea px-3 mx-auto mt-3 "+("block"==t[5]?"h":"")))&&i(c,"class",$),(!S||8&a[0])&&x(c,"max-width",t[3].maxWidth),"block"==t[5]?q?(q.p(t,a),32&a[0]&&v(q,1)):(q=ct(t),q.c(),v(q,1),q.m(e,null)):q&&(C(),A(q,1,1,(()=>{q=null})),E())},i(t){S||(v(n.$$.fragment,t),v(q),S=!0)},o(t){A(n.$$.fragment,t),A(q),S=!1},d(t){t&&m(e),k(n),V&&V.d(),O&&O.d(),R&&R.d(),q&&q.d(),M=!1,N()}}}function dt(t){let e=[];for(let n in t)t.hasOwnProperty(n)&&e.push(t[n]);return window.prettifyContent&&prettifyContent({imgAltText:1,container:["#alignmatch-table"]}),e}function ut(t){13===t.which&&this.click()}function gt(t,e,n){let a,l,{xml:i}=e,{uxml:o}=e,{showAns:r}=e,{isReview:s}=e,{updateCSV:c}=e,{editorState:m}=e,d=s,u={},g={xml:"",content:"",settings:"",remediationState:!1,gameStatus:!1,maxWidth:"",userAnswerArr:[],imgHeight:"",idCheck:0,correct_match:[]},f={},h="none",b=[],x=!1,y=[],_=[],w=[],v=[],A=[];function k(t){n(3,g.gameStatus=!1,g),function(t){n(3,g.maxWidth=t.smxml._maxwidth?t.smxml._maxwidth:800,g),n(2,u=JSON.parse(t.smxml.__cdata)),u.item.items.forEach((function(t){_[t.id]=t})),l=u.item.items.length/u.category.categories.length,n(6,y=[]),n(3,g.correct_match=[],g),u.item.items.forEach((function(t,e){null==y[t.tags]&&(n(6,y[t.tags]=[],y),w[t.tags]=[]),y[t.tags].push(t),w[t.tags].push(t),n(3,g.correct_match["category_"+e]=!1,g),t.sequence=e}));let e=!1;if(null!=i&&""!=g.uxml&&null!=g.uxml){f=JSON.parse(g.uxml),C(),Object.keys(f.items).forEach((t=>{2==f.items[t].slice(-1)[0]&&(b[t]=!0)})),x=f.correct_attempt.length===l,x&&(p.selectAll(".alignTestarea","addClass","complete"),p.setCss(".categorycontainer",{opacity:"0.7",cursor:"not-allowed"}),p.select(".matchbutton").disabled=!0);let t,n=Object.keys(f.items);for(let e in w)for(let a in w[e])if(0==a)t=n.indexOf(w[e][a].id)>-1;else if(t){if(t){let t=w[e][0].id,n=f.items[t][a-1];w[e][a]=_[n]}}else w[e][a]={imageurl:"",label:"Unattempted"};e=!0}if(!e)for(let t in w)for(let e in w[t])e>0&&(w[t][e]={imageurl:"",imagealt:"",label:"Unattempted"});n(3,g.userAnswerArr=w,g),n(3,g.xml=u,g),z()}(t=S(t)),p.selectAll(".elementContainer").forEach((function(){let t=this;p.find(t,"img","all").forEach((function(t,e){let n=p.select(e).getAttribute("data-check");p.select(".categoryitemcontainer_"+n).height="",p.select(".prevbutton_"+n).height="",p.select(".nextbutton_"+n).height="",p.select(e).trigger("load")}))}))}function C(){let t=f.answer&&2==f.answer;if(m)r(t?"Correct":"Incorrect");else if(p.select("#answer").checked=t,!m&&g.uxml&&""!=g.uxml){let e=!!t;M({uXml:g.uxml,ans:e})}}function E(t,e){p.select(".categoryitemcontainer_"+e).style.height=t+11+"px",p.select(".prevbutton_"+e).style.height=t+50+"px",p.select(".nextbutton_"+e).style.height=t+50+"px"}function N(t){setTimeout((function(){p.selectAll(".categoryinnercontainer ","all").forEach((function(t,e){p.find(t,".element","all").forEach((function(t,e){t.setAttribute("id","element_"+(e+1)),t.style.display="none"}));let n=p.find(t,".element","all").length,a=Math.floor(Math.random()*n)+1;p.select(".categoryitemcontainer_"+e+" #element_"+a).style.display=""}))}),200),"csv"==t&&setTimeout((function(){c("csv",!1),console.log("csv Updated")}),1200)}function z(){setTimeout((function(){x||n(3,g.gameStatus=!0,g)}),200)}function L(){n(1,d=!0),n(5,h="block"),setTimeout((function(){p.selectAll(".your_ans_td:first-child").forEach((t=>{let e=t.getAttribute("col");b[e]?p.parent(t).classList.add("typeCorrect"):p.parent(t).classList.add("typeIncorrect")}))}),100),C()}function H(){n(5,h="none"),n(0,s=!1),n(1,d=!1)}return T((()=>{if(n(3,g.xml=i,g),n(3,g.uxml=o,g),'<smans type="35"></smans>'!=g.uxml&&"<SMANS></SMANS>"!=g.uxml||n(3,g.uxml="",g),g.uxml&&g.uxml.includes("&useransxml=")){let t=g.uxml.replace("&useransxml=","");n(3,g.uxml=t,g)}k(i),m&&m.isCSV&&N("csv")})),$((()=>{k(i)})),j((()=>{v.length>0&&(x||v.forEach(((t,e)=>{let n=_[e].tags;y[n].slice(1).forEach(((t,e)=>{A.push(e.id)}))})))})),t.$$set=t=>{"xml"in t&&n(16,i=t.xml),"uxml"in t&&n(17,o=t.uxml),"showAns"in t&&n(18,r=t.showAns),"isReview"in t&&n(0,s=t.isReview),"updateCSV"in t&&n(19,c=t.updateCSV),"editorState"in t&&n(20,m=t.editorState)},t.$$.update=()=>{1&t.$$.dirty[0]&&(s?(n(5,h="block"),L()):(n(5,h="none"),H(),N()))},[s,d,u,g,a,h,y,A,function(t){let e=t.target.getAttribute("data-check"),a=p.select(".categoryitemcontainer_"+e).style.height,l=a.substr(0,a.indexOf("p"))-11,i=t.target.naturalHeight;(""==l||null==l||isNaN(l)||l<=i)&&(n(3,g.imgHeight=i,g),E(g.imgHeight,e))},function(){if(!x){let t,e=p.nextElm(this,".categoryinnercontainer");return p.find(e,".categoryitemcontainer .categoryiteminnercontainer .element","all").forEach((function(e){"table-cell"==getComputedStyle(e,null).display&&(t=e)})),t&&p.prevElm(t)?(p.prevElm(t).style.display="",p.nextElm(p.prevElm(t)).style.display="none"):(t&&(t.style.display="none"),p.find(e,".categoryitemcontainer .categoryiteminnercontainer .element").style.display="none",p.find(e,".categoryitemcontainer .categoryiteminnercontainer .element:last-child").style.display=""),!1}},function(){if(!x){let t,e=p.prevElm(this,".categoryinnercontainer");return p.find(e,".categoryitemcontainer .categoryiteminnercontainer .element","all").forEach((function(e){"table-cell"==getComputedStyle(e,null).display&&(t=e)})),t&&p.nextElm(t)?(p.nextElm(t).style.display="",p.prevElm(p.nextElm(t)).style.display="none"):(t&&(t.style.display="none"),p.find(e,".categoryitemcontainer .categoryiteminnercontainer .element").style.display="none",p.find(e,".categoryitemcontainer .categoryiteminnercontainer .element:first-child").style.display=""),!1}},L,H,function(){if(!x){let t,e,a=this.closest(".alignTestarea"),i=[];p.find(a,".categorycontainer .categoryinnercontainer .categoryitemcontainer .categoryiteminnercontainer .element","all").forEach((function(t){"table-cell"==getComputedStyle(t,null).display&&(i=[...i,t])}));let o=null,r=null,s=null;i.forEach((function(a,l){let i;t=a.getAttribute("data-tags"),0==l&&(e=t),p.find(a,"img")?i=p.find(a,"img").getAttribute("src"):(i="",null!=p.find(a,"div")&&(i=p.find(a,"div").textContent));let c=g.xml.item.items;for(let e in c){let n=c[e];if(n.tags==t){if((n.imageurl?"//s3.amazonaws.com/jigyaasa_content_static//"+n.imageurl:n.label)==i){r=n;break}}}null==f.items&&(f.items={}),0==l?(o=t,s=r.id,f.items[s]=[]):(t!=o&&(o=null),f.items[s].push(r.id),n(3,g.userAnswerArr[e][l]={imageurl:r.imageurl,label:r.label},g))}));let c=null==o;f.items[s].push(c?0:2),f.correct_attempt=f.correct_attempt||[],c||-1!=f.correct_attempt.indexOf(s)||f.correct_attempt.push(s),b[s]=!c,n(3,g);let m=0;for(let t in f.items){2===f.items[t].slice(-1)[0]&&(m+=1)}let d=p.selectAll(".categoryiteminnercontainer:first-child .elementContainer .element").length;"undefined"!=typeof calculatePoint&&calculatePoint(d,m),f.answer=0,l===m&&(f.answer=2),x=f.correct_attempt.length===l,c?(p.select(".categorycontainer ").classList.contains("wrong_ans")&&p.selectAll(".categorycontainer","removeClass","wrong_ans"),setTimeout((function(){p.selectAll(".categorycontainer","addClass","wrong_ans")}),100),p.showmsg("Please match all the items correctly.",3e3)):(p.select("#reset_btn").disabled=!1,p.selectAll(".categoryinnercontainer ","all").forEach((function(t,e){p.find(t,".element","all").length>1?(p.find(t,".element","all").forEach((function(t){"table-cell"==getComputedStyle(t,null).display&&n(3,g.correct_match[t.getAttribute("seq_no")]=!0,g)})),setTimeout((function(){p.find(t,".element","all").forEach((function(t,e){t.setAttribute("id","element_"+(e+1)),t.style.display="none"}));let n=p.find(t,".element","all").length,a=Math.floor(Math.random()*n)+1;p.select(".categoryitemcontainer_"+e+" #element_"+a).style.display=""}),100)):(p.setCss(".categorycontainer",{opacity:"0.7",cursor:"not-allowed"}),p.selectAll(".categorycontainer","addClass","complete"),p.setCss(".nextbutton",{"pointer-events":"none"}),p.setCss(".prevbutton",{"pointer-events":"none"}),p.select(".matchbutton").disabled=!0,p.showmsg("Game Completed!!",3e3),C())}))),z(),ISSPECIALMODULEUSERXMLCHANGE=1,n(3,g.uxml=JSON.stringify(f),g),p.select("#special_module_user_xml").value=JSON.stringify(f)}},function(){f={},b=[],x=!1,n(6,y=[]),p.selectAll(".categorycontainer","removeClass","complete"),p.setCss(".categorycontainer",{opacity:"1",cursor:"pointer"}),p.setCss(".nextbutton",{"pointer-events":"auto"}),p.setCss(".prevbutton",{"pointer-events":"auto"}),p.select(".matchbutton").disabled=!1,n(3,g.uxml="",g),n(3,g.xml="",g),n(3,g.correct_match=[],g),k(i);const t=p.selectAll(".categoryitemcontainer .categoryiteminnercontainer .elementContainer");t&&t.length&&t.forEach((t=>{const e=p.findChild(t,".element","all");if(e&&t.length){e.forEach((t=>t.style.display="none"));e[Math.round(Math.random()*e.length)-1].style.display=""}})),p.select("#reset_btn").disabled=!0},function(t){"c"==t?(p.select(".correctAnswer","removeClass","h"),p.select(".yourAnswer","css",{display:"none"})):"u"==t&&(p.select(".yourAnswer","css",{display:"block"}),p.select(".correctAnswer","addClass","h"))},i,o,r,c,m,function(){n(4,a=Y.innerWidth)}]}export default class extends t{constructor(t){super(),e(this,t,gt,mt,n,{xml:16,uxml:17,showAns:18,isReview:0,updateCSV:19,editorState:20},[-1,-1])}}
//# sourceMappingURL=AlignMatchPreview-88d208a3.js.map
