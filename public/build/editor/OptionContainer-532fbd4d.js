import{S as e,i as t,s as n,q as s,h as a,r as i,o as r,A as l,e as o,u as c,b as p,f as d,g as u,j as f,l as g,v,x as h,y as m,z as w,B as b}from"./main-970a190c.js";function x(e,t,n){const s=e.slice();return s[14]=t[n],s[11]=n,s}function _(e,t,n){const s=e.slice();return s[12]=t[n],s[11]=n,s}function k(e,t,n){const s=e.slice();return s[9]=t[n],s[11]=n,s}function y(e){let t,n=e[1],s=[];for(let t=0;t<n.length;t+=1)s[t]=U(x(e,n,t));return{c(){t=o("div");for(let e=0;e<s.length;e+=1)s[e].c();d(t,"class","mb-xl clear-both ml-lg overflow"),d(t,"id","user_answer")},m(e,n){a(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null)},p(e,a){if(63&a){let i;for(n=e[1],i=0;i<n.length;i+=1){const r=x(e,n,i);s[i]?s[i].p(r,a):(s[i]=U(r),s[i].c(),s[i].m(t,null))}for(;i<s.length;i+=1)s[i].d(1);s.length=n.length}},d(e){e&&r(t),w(s,e)}}}function M(e){let t;let n=(1==preview_edit&&l.get("get_parent_guid")?C:O)(e);return{c(){n.c(),t=s()},m(e,s){n.m(e,s),a(e,t,s)},p(e,t){n.p(e,t)},d(e){n.d(e),e&&r(t)}}}function U(e){let t,n,s,i,l,w,b,x,_,k,y,M,U,O,C,A,H,L,T,j,$,q,z,B,N,S,D,E,F=e[0][e[11]]+"",G=e[14].answer+"";return{c(){t=o("span"),n=o("section"),s=o("div"),i=o("div"),l=o("div"),w=o("label"),b=o("div"),x=c(F),k=p(),y=o("div"),M=o("input"),T=p(),j=o("div"),$=o("div"),q=o("div"),B=p(),N=o("div"),N.innerHTML='<i class="icomoon-new-24px-delete-1 s3"></i>',S=p(),d(b,"class","ansoptlabel form-control ansopt"),d(b,"value",_=e[0][e[11]]),d(M,"tabindex","0"),d(M,"type",U=e[3]<1?"radio":"checkbox"),M.checked=O=1==e[14].is_correct,d(M,"class","answer_radio"),d(M,"id",C="userans-"+e[0][e[11]]),d(M,"name","userans[]"),M.value=A=e[0][e[11]],d(y,"class","ansoptinput input-group-text"),d(y,"tabindex","0"),d(w,"access-key",H=e[0][e[11]]),d(w,"class","d-flex"),d(w,"for",L="userans-"+e[0][e[11]]),d(l,"class","input-group"),d(i,"class","span1 float-left"),d(q,"id",z="option"+e[11]),d(q,"class","ebook_item_text auth-editor pt-2"),d($,"class","answer"),d(j,"class","printer"),d(N,"class","float-right delete_element mr-1 position-relative"),u(N,"bottom","32px"),d(N,"tabindex","0"),u(s,"min-height","46px"),d(s,"class","option"),d(n,"class","answer_container"),d(t,"anscounter","0")},m(r,o){a(r,t,o),f(t,n),f(n,s),f(s,i),f(i,l),f(l,w),f(w,b),f(b,x),f(w,k),f(w,y),f(y,M),f(s,T),f(s,j),f(j,$),f($,q),q.innerHTML=G,f(s,B),f(s,N),f(t,S),D||(E=[g(M,"click",(function(){v(e[4].bind(this,e[11]))&&e[4].bind(this,e[11]).apply(this,arguments)})),g(q,"blur",(function(){v(e[2].bind(this,e[11]))&&e[2].bind(this,e[11]).apply(this,arguments)})),g(N,"click",(function(){v(e[5].bind(this,e[11]))&&e[5].bind(this,e[11]).apply(this,arguments)}))],D=!0)},p(t,n){e=t,1&n&&F!==(F=e[0][e[11]]+"")&&h(x,F),1&n&&_!==(_=e[0][e[11]])&&d(b,"value",_),8&n&&U!==(U=e[3]<1?"radio":"checkbox")&&d(M,"type",U),2&n&&O!==(O=1==e[14].is_correct)&&(M.checked=O),1&n&&C!==(C="userans-"+e[0][e[11]])&&d(M,"id",C),1&n&&A!==(A=e[0][e[11]])&&M.value!==A&&(M.value=A),1&n&&H!==(H=e[0][e[11]])&&d(w,"access-key",H),1&n&&L!==(L="userans-"+e[0][e[11]])&&d(w,"for",L),2&n&&G!==(G=e[14].answer+"")&&(q.innerHTML=G)},d(e){e&&r(t),D=!1,m(E)}}}function O(e){let t,n=e[1],s=[];for(let t=0;t<n.length;t+=1)s[t]=A(_(e,n,t));return{c(){t=o("div");for(let e=0;e<s.length;e+=1)s[e].c();d(t,"class","mb-xl ml-lg overflow"),d(t,"id","user_answer")},m(e,n){a(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null)},p(e,a){if(75&a){let i;for(n=e[1],i=0;i<n.length;i+=1){const r=_(e,n,i);s[i]?s[i].p(r,a):(s[i]=A(r),s[i].c(),s[i].m(t,null))}for(;i<s.length;i+=1)s[i].d(1);s.length=n.length}},d(e){e&&r(t),w(s,e)}}}function C(e){let t,n,s,i,l,c,u,v,h,m,x,_,y,M=e[1],U=[];for(let t=0;t<M.length;t+=1)U[t]=H(k(e,M,t));return{c(){t=o("div"),n=o("section"),s=o("div"),i=o("div"),l=o("div"),c=o("b"),c.textContent=""+b.parent_guid_found,u=p(),v=o("div"),h=o("button"),h.textContent=""+b.yes_label,m=p(),x=o("div");for(let e=0;e<U.length;e+=1)U[e].c();d(l,"class","float-left mt"),d(h,"tabindex","0"),d(h,"id","show_parent_guid"),d(h,"name","show_parent_guid"),d(h,"class","btn btn-primary width90"),d(v,"class","float-right ml-lg-auto"),d(i,"class","row mx-0"),d(s,"tabindex","0"),d(s,"class","alert alert-primary mb-lg "),d(s,"id","open_test_session"),d(s,"role","alert"),d(n,"id","warning_label_container"),d(n,"class","w-100"),d(x,"class","mb-xl ml-lg overflow"),d(x,"id","user_answer")},m(r,o){a(r,t,o),f(t,n),f(n,s),f(s,i),f(i,l),f(l,c),f(i,u),f(i,v),f(v,h),f(t,m),f(t,x);for(let e=0;e<U.length;e+=1)U[e].m(x,null);_||(y=g(h,"click",e[8]),_=!0)},p(e,t){if(75&t){let n;for(M=e[1],n=0;n<M.length;n+=1){const s=k(e,M,n);U[n]?U[n].p(s,t):(U[n]=H(s),U[n].c(),U[n].m(x,null))}for(;n<U.length;n+=1)U[n].d(1);U.length=M.length}},d(e){e&&r(t),w(U,e),_=!1,y()}}}function A(e){let t,n,s,i,l,g,v,m,w,b,x,_,k,y,M,U,O,C,A,H,L,T,j,$=e[0][e[11]]+"",q=get_ucsyntax(e[12].answer)+"";return{c(){t=o("span"),n=o("section"),s=o("label"),i=o("div"),l=o("div"),g=o("label"),v=o("div"),m=c($),b=p(),x=o("div"),_=o("input"),A=p(),H=o("div"),L=o("div"),j=p(),d(v,"class","ansoptlabel form-control ansopt"),d(v,"value",w=e[0][e[11]]),d(_,"type",k=e[3]<=1?"radio":"checkbox"),d(_,"class","answer_radio"),d(_,"id",y="pUserans-"+e[0][e[11]]),d(_,"name","userans[]"),_.value=M=e[0][e[11]],d(x,"tabindex","0"),d(x,"class",U=1==e[6]&&1==e[12].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text"),d(g,"for",O="pUserans-"+e[0][e[11]]),d(g,"access-key",C=e[0][e[11]]),d(g,"class","d-flex"),d(l,"class","input-group"),d(i,"class","span1 float-left"),d(L,"class","answer"),u(L,"min-height","21px"),d(H,"class","printer"),d(s,"for",T="pUserans-"+e[0][e[11]]),d(s,"class","option glow"),d(n,"class","answer_container"),d(t,"anscounter","0")},m(e,r){a(e,t,r),f(t,n),f(n,s),f(s,i),f(i,l),f(l,g),f(g,v),f(v,m),f(g,b),f(g,x),f(x,_),f(s,A),f(s,H),f(H,L),L.innerHTML=q,f(t,j)},p(e,t){1&t&&$!==($=e[0][e[11]]+"")&&h(m,$),1&t&&w!==(w=e[0][e[11]])&&d(v,"value",w),8&t&&k!==(k=e[3]<=1?"radio":"checkbox")&&d(_,"type",k),1&t&&y!==(y="pUserans-"+e[0][e[11]])&&d(_,"id",y),1&t&&M!==(M=e[0][e[11]])&&_.value!==M&&(_.value=M),66&t&&U!==(U=1==e[6]&&1==e[12].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text")&&d(x,"class",U),1&t&&O!==(O="pUserans-"+e[0][e[11]])&&d(g,"for",O),1&t&&C!==(C=e[0][e[11]])&&d(g,"access-key",C),2&t&&q!==(q=get_ucsyntax(e[12].answer)+"")&&(L.innerHTML=q),1&t&&T!==(T="pUserans-"+e[0][e[11]])&&d(s,"for",T)},d(e){e&&r(t)}}}function H(e){let t,n,s,i,l,g,v,m,w,b,x,_,k,y,M,U,O,C,A,H,L,T,j,$,q=e[0][e[11]]+"",z=e[9].answer+"";return{c(){t=o("span"),n=o("section"),s=o("label"),i=o("div"),l=o("div"),g=o("label"),v=o("div"),m=c(q),b=p(),x=o("div"),_=o("input"),A=p(),H=o("div"),L=o("div"),T=c(z),$=p(),d(v,"class","ansoptlabel form-control ansopt"),d(v,"value",w=e[0][e[11]]),d(_,"type",k=e[3]<=1?"radio":"checkbox"),d(_,"class","answer_radio"),d(_,"id",y="pUserans-"+e[0][e[11]]),d(_,"name","userans[]"),_.value=M=e[0][e[11]],d(x,"tabindex","0"),d(x,"class",U=1==e[6]&&1==e[9].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text"),d(g,"for",O="pUserans-"+e[0][e[11]]),d(g,"access-key",C=e[0][e[11]]),d(g,"class","d-flex"),d(l,"class","input-group"),d(i,"class","span1 float-left"),d(L,"class","answer"),u(L,"min-height","21px"),d(H,"class","printer"),d(s,"for",j="pUserans-"+e[0][e[11]]),d(s,"class","option glow"),d(n,"class","answer_container"),d(t,"anscounter","0")},m(e,r){a(e,t,r),f(t,n),f(n,s),f(s,i),f(i,l),f(l,g),f(g,v),f(v,m),f(g,b),f(g,x),f(x,_),f(s,A),f(s,H),f(H,L),f(L,T),f(t,$)},p(e,t){1&t&&q!==(q=e[0][e[11]]+"")&&h(m,q),1&t&&w!==(w=e[0][e[11]])&&d(v,"value",w),8&t&&k!==(k=e[3]<=1?"radio":"checkbox")&&d(_,"type",k),1&t&&y!==(y="pUserans-"+e[0][e[11]])&&d(_,"id",y),1&t&&M!==(M=e[0][e[11]])&&_.value!==M&&(_.value=M),66&t&&U!==(U=1==e[6]&&1==e[9].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text")&&d(x,"class",U),1&t&&O!==(O="pUserans-"+e[0][e[11]])&&d(g,"for",O),1&t&&C!==(C=e[0][e[11]])&&d(g,"access-key",C),2&t&&z!==(z=e[9].answer+"")&&h(T,z),1&t&&j!==(j="pUserans-"+e[0][e[11]])&&d(s,"for",j)},d(e){e&&r(t)}}}function L(e){let t;function n(e,t){return e[7]?M:y}let l=n(e),o=l(e);return{c(){o.c(),t=s()},m(e,n){o.m(e,n),a(e,t,n)},p(e,[s]){l===(l=n(e))&&o?o.p(e,s):(o.d(1),o=l(e),o&&(o.c(),o.m(t.parentNode,t)))},i:i,o:i,d(e){o.d(e),e&&r(t)}}}function T(e,t,n){let{letters:s}=t,{data:a}=t,{editOption:i}=t,{correctAnswers:r}=t,{toggleChecked:o}=t,{deleteOption:c}=t,{reviewMode:p=!1}=t,{previewMode:d=!1}=t;return e.$$set=e=>{"letters"in e&&n(0,s=e.letters),"data"in e&&n(1,a=e.data),"editOption"in e&&n(2,i=e.editOption),"correctAnswers"in e&&n(3,r=e.correctAnswers),"toggleChecked"in e&&n(4,o=e.toggleChecked),"deleteOption"in e&&n(5,c=e.deleteOption),"reviewMode"in e&&n(6,p=e.reviewMode),"previewMode"in e&&n(7,d=e.previewMode)},[s,a,i,r,o,c,p,d,function(){let e=baseUrl+"editor/?action=edit&content_guid="+l.get("get_parent_guid")+"&no_header=1&react_content=1&no_domain=1";window.open(e,"_blank")}]}class j extends e{constructor(e){super(),t(this,e,T,L,n,{letters:0,data:1,editOption:2,correctAnswers:3,toggleChecked:4,deleteOption:5,reviewMode:6,previewMode:7})}}export{j as O};
//# sourceMappingURL=OptionContainer-532fbd4d.js.map
