import{S as e,i as t,s,q as n,h as a,r as i,o as r,e as l,u as o,b as c,f as p,g as d,j as u,l as f,v,x as g,y as h,z as w,B as m,C as b,D as x}from"./main-42af7770.js";function _(e,t,s){const n=e.slice();return n[13]=t[s],n[10]=s,n}function k(e,t,s){const n=e.slice();return n[11]=t[s],n[10]=s,n}function y(e,t,s){const n=e.slice();return n[8]=t[s],n[10]=s,n}function M(e){let t,s=[],n=new Map,i=e[1];const o=e=>e[13].id;for(let t=0;t<i.length;t+=1){let a=_(e,i,t),r=o(a);n.set(r,s[t]=O(r,a))}return{c(){t=l("div");for(let e=0;e<s.length;e+=1)s[e].c();p(t,"class","mb-xl clear-both ml-lg overflow"),p(t,"id","user_answer")},m(e,n){a(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null)},p(e,a){63&a&&(i=e[1],s=w(s,a,o,1,e,i,n,t,m,O,null,_))},d(e){e&&r(t);for(let e=0;e<s.length;e+=1)s[e].d()}}}function U(e){let t;let s=(1==preview_edit&&AI.get("get_parent_guid")?A:C)(e);return{c(){s.c(),t=n()},m(e,n){s.m(e,n),a(e,t,n)},p(e,t){s.p(e,t)},d(e){s.d(e),e&&r(t)}}}function O(e,t){let s,n,i,w,m,b,x,_,k,y,M,U,O,C,A,H,L,T,j,I,$,q,z,B,D,N,S,E,F,G,J=t[0][t[10]]+"",K=t[13].answer+"";return{key:e,first:null,c(){s=l("span"),n=l("section"),i=l("div"),w=l("div"),m=l("div"),b=l("label"),x=l("div"),_=o(J),y=c(),M=l("div"),U=l("input"),j=c(),I=l("div"),$=l("div"),q=l("div"),z=o(K),D=c(),N=l("div"),N.innerHTML='<i class="icomoon-new-24px-delete-1 s3"></i>',S=c(),p(x,"class","ansoptlabel form-control ansopt"),p(x,"value",k=t[0][t[10]]),p(U,"tabindex","0"),p(U,"type",O=t[3]<1?"radio":"checkbox"),U.checked=C=1==t[13].is_correct,p(U,"class","answer_radio"),p(U,"id",A="userans-"+t[0][t[10]]),p(U,"name","userans[]"),U.value=H=t[0][t[10]],p(M,"class","ansoptinput input-group-text"),p(M,"tabindex","0"),p(b,"access-key",L=t[0][t[10]]),p(b,"class","d-flex"),p(b,"for",T="userans-"+t[0][t[10]]),p(m,"class","input-group"),p(w,"class","span1 float-left"),p(q,"id",B="option"+t[10]),p(q,"class","ebook_item_text auth-editor pt-2"),p($,"class","answer"),p(I,"class","printer"),p(N,"class","float-right delete_element mr-1 position-relative"),d(N,"bottom","32px"),p(N,"tabindex","0"),d(i,"min-height","46px"),p(i,"class","option"),p(n,"class","answer_container"),p(s,"key",E=t[13].id),p(s,"anscounter","0"),this.first=s},m(e,r){a(e,s,r),u(s,n),u(n,i),u(i,w),u(w,m),u(m,b),u(b,x),u(x,_),u(b,y),u(b,M),u(M,U),u(i,j),u(i,I),u(I,$),u($,q),u(q,z),u(i,D),u(i,N),u(s,S),F||(G=[f(U,"click",(function(){v(t[4].bind(this,t[10]))&&t[4].bind(this,t[10]).apply(this,arguments)})),f(q,"blur",(function(){v(t[2].bind(this,t[10]))&&t[2].bind(this,t[10]).apply(this,arguments)})),f(N,"click",(function(){v(t[5].bind(this,t[10]))&&t[5].bind(this,t[10]).apply(this,arguments)}))],F=!0)},p(e,n){t=e,3&n&&J!==(J=t[0][t[10]]+"")&&g(_,J),3&n&&k!==(k=t[0][t[10]])&&p(x,"value",k),8&n&&O!==(O=t[3]<1?"radio":"checkbox")&&p(U,"type",O),2&n&&C!==(C=1==t[13].is_correct)&&(U.checked=C),3&n&&A!==(A="userans-"+t[0][t[10]])&&p(U,"id",A),3&n&&H!==(H=t[0][t[10]])&&U.value!==H&&(U.value=H),3&n&&L!==(L=t[0][t[10]])&&p(b,"access-key",L),3&n&&T!==(T="userans-"+t[0][t[10]])&&p(b,"for",T),2&n&&K!==(K=t[13].answer+"")&&g(z,K),2&n&&B!==(B="option"+t[10])&&p(q,"id",B),2&n&&E!==(E=t[13].id)&&p(s,"key",E)},d(e){e&&r(s),F=!1,h(G)}}}function C(e){let t,s=[],n=new Map,i=e[1];const o=e=>e[11].id;for(let t=0;t<i.length;t+=1){let a=k(e,i,t),r=o(a);n.set(r,s[t]=H(r,a))}return{c(){t=l("div");for(let e=0;e<s.length;e+=1)s[e].c();p(t,"class","mb-xl ml-lg overflow"),p(t,"id","user_answer")},m(e,n){a(e,t,n);for(let e=0;e<s.length;e+=1)s[e].m(t,null)},p(e,a){75&a&&(i=e[1],s=w(s,a,o,1,e,i,n,t,m,H,null,k))},d(e){e&&r(t);for(let e=0;e<s.length;e+=1)s[e].d()}}}function A(e){let t,s,n,i,o,d,v,g,h,w,m,_,k,M=e[1],U=[];for(let t=0;t<M.length;t+=1)U[t]=L(y(e,M,t));return{c(){t=l("div"),s=l("section"),n=l("div"),i=l("div"),o=l("div"),d=l("b"),d.textContent=""+b.parent_guid_found,v=c(),g=l("div"),h=l("button"),h.textContent=""+b.yes_label,w=c(),m=l("div");for(let e=0;e<U.length;e+=1)U[e].c();p(o,"class","float-left mt"),p(h,"tabindex","0"),p(h,"id","show_parent_guid"),p(h,"name","show_parent_guid"),p(h,"class","btn btn-primary width90"),p(g,"class","float-right ml-lg-auto"),p(i,"class","row mx-0"),p(n,"tabindex","0"),p(n,"class","alert alert-primary mb-lg "),p(n,"id","open_test_session"),p(n,"role","alert"),p(s,"id","warning_label_container"),p(s,"class","w-100"),p(m,"class","mb-xl ml-lg overflow"),p(m,"id","user_answer")},m(e,r){a(e,t,r),u(t,s),u(s,n),u(n,i),u(i,o),u(o,d),u(i,v),u(i,g),u(g,h),u(t,w),u(t,m);for(let e=0;e<U.length;e+=1)U[e].m(m,null);_||(k=f(h,"click",j),_=!0)},p(e,t){if(75&t){let s;for(M=e[1],s=0;s<M.length;s+=1){const n=y(e,M,s);U[s]?U[s].p(n,t):(U[s]=L(n),U[s].c(),U[s].m(m,null))}for(;s<U.length;s+=1)U[s].d(1);U.length=M.length}},d(e){e&&r(t),x(U,e),_=!1,k()}}}function H(e,t){let s,n,i,f,v,h,w,m,b,x,_,k,y,M,U,O,C,A,H,L,T,j,I,$,q=t[0][t[10]]+"",z=t[11].answer+"";return{key:e,first:null,c(){s=l("span"),n=l("section"),i=l("label"),f=l("div"),v=l("div"),h=l("label"),w=l("div"),m=o(q),x=c(),_=l("div"),k=l("input"),H=c(),L=l("div"),T=l("div"),I=c(),p(w,"class","ansoptlabel form-control ansopt"),p(w,"value",b=t[0][t[10]]),p(k,"type",y=t[3]<=1?"radio":"checkbox"),p(k,"class","answer_radio"),p(k,"id",M="pUserans-"+t[0][t[10]]),p(k,"name","userans[]"),k.value=U=t[0][t[10]],p(_,"tabindex","0"),p(_,"class",O=1==t[6]&&1==t[11].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text"),p(h,"for",C="pUserans-"+t[0][t[10]]),p(h,"access-key",A=t[0][t[10]]),p(h,"class","d-flex"),p(v,"class","input-group"),p(f,"class","span1 float-left"),p(T,"class","answer"),d(T,"min-height","21px"),p(L,"class","printer"),p(i,"for",j="pUserans-"+t[0][t[10]]),p(i,"class","option glow"),p(n,"class","answer_container"),p(s,"key",$=t[11].id),p(s,"anscounter","0"),this.first=s},m(e,t){a(e,s,t),u(s,n),u(n,i),u(i,f),u(f,v),u(v,h),u(h,w),u(w,m),u(h,x),u(h,_),u(_,k),u(i,H),u(i,L),u(L,T),T.innerHTML=z,u(s,I)},p(e,n){t=e,3&n&&q!==(q=t[0][t[10]]+"")&&g(m,q),3&n&&b!==(b=t[0][t[10]])&&p(w,"value",b),8&n&&y!==(y=t[3]<=1?"radio":"checkbox")&&p(k,"type",y),3&n&&M!==(M="pUserans-"+t[0][t[10]])&&p(k,"id",M),3&n&&U!==(U=t[0][t[10]])&&k.value!==U&&(k.value=U),66&n&&O!==(O=1==t[6]&&1==t[11].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text")&&p(_,"class",O),3&n&&C!==(C="pUserans-"+t[0][t[10]])&&p(h,"for",C),3&n&&A!==(A=t[0][t[10]])&&p(h,"access-key",A),2&n&&z!==(z=t[11].answer+"")&&(T.innerHTML=z),3&n&&j!==(j="pUserans-"+t[0][t[10]])&&p(i,"for",j),2&n&&$!==($=t[11].id)&&p(s,"key",$)},d(e){e&&r(s)}}}function L(e){let t,s,n,i,f,v,h,w,m,b,x,_,k,y,M,U,O,C,A,H,L,T,j,I,$=e[0][e[10]]+"",q=e[8].answer+"";return{c(){t=l("span"),s=l("section"),n=l("label"),i=l("div"),f=l("div"),v=l("label"),h=l("div"),w=o($),b=c(),x=l("div"),_=l("input"),A=c(),H=l("div"),L=l("div"),T=o(q),I=c(),p(h,"class","ansoptlabel form-control ansopt"),p(h,"value",m=e[0][e[10]]),p(_,"type",k=e[3]<=1?"radio":"checkbox"),p(_,"class","answer_radio"),p(_,"id",y="pUserans-"+e[0][e[10]]),p(_,"name","userans[]"),_.value=M=e[0][e[10]],p(x,"tabindex","0"),p(x,"class",U=1==e[6]&&1==e[8].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text"),p(v,"for",O="pUserans-"+e[0][e[10]]),p(v,"access-key",C=e[0][e[10]]),p(v,"class","d-flex"),p(f,"class","input-group"),p(i,"class","span1 float-left"),p(L,"class","answer"),d(L,"min-height","21px"),p(H,"class","printer"),p(n,"for",j="pUserans-"+e[0][e[10]]),p(n,"class","option glow"),p(s,"class","answer_container"),p(t,"anscounter","0")},m(e,r){a(e,t,r),u(t,s),u(s,n),u(n,i),u(i,f),u(f,v),u(v,h),u(h,w),u(v,b),u(v,x),u(x,_),u(n,A),u(n,H),u(H,L),u(L,T),u(t,I)},p(e,t){1&t&&$!==($=e[0][e[10]]+"")&&g(w,$),1&t&&m!==(m=e[0][e[10]])&&p(h,"value",m),8&t&&k!==(k=e[3]<=1?"radio":"checkbox")&&p(_,"type",k),1&t&&y!==(y="pUserans-"+e[0][e[10]])&&p(_,"id",y),1&t&&M!==(M=e[0][e[10]])&&_.value!==M&&(_.value=M),66&t&&U!==(U=1==e[6]&&1==e[8].is_correct?"ansoptinput input-group-text active":"ansoptinput input-group-text")&&p(x,"class",U),1&t&&O!==(O="pUserans-"+e[0][e[10]])&&p(v,"for",O),1&t&&C!==(C=e[0][e[10]])&&p(v,"access-key",C),2&t&&q!==(q=e[8].answer+"")&&g(T,q),1&t&&j!==(j="pUserans-"+e[0][e[10]])&&p(n,"for",j)},d(e){e&&r(t)}}}function T(e){let t;function s(e,t){return e[7]?U:M}let l=s(e),o=l(e);return{c(){o.c(),t=n()},m(e,s){o.m(e,s),a(e,t,s)},p(e,[n]){l===(l=s(e))&&o?o.p(e,n):(o.d(1),o=l(e),o&&(o.c(),o.m(t.parentNode,t)))},i:i,o:i,d(e){o.d(e),e&&r(t)}}}function j(){let e=baseUrl+"editor/?action=edit&content_guid="+AI.get("get_parent_guid")+"&no_header=1&react_content=1&no_domain=1";window.open(e,"_blank")}function I(e,t,s){let{letters:n}=t,{data:a}=t,{editOption:i}=t,{correctAnswers:r}=t,{toggleChecked:l}=t,{deleteOption:o}=t,{reviewMode:c=!1}=t,{previewMode:p=!1}=t;return e.$$set=e=>{"letters"in e&&s(0,n=e.letters),"data"in e&&s(1,a=e.data),"editOption"in e&&s(2,i=e.editOption),"correctAnswers"in e&&s(3,r=e.correctAnswers),"toggleChecked"in e&&s(4,l=e.toggleChecked),"deleteOption"in e&&s(5,o=e.deleteOption),"reviewMode"in e&&s(6,c=e.reviewMode),"previewMode"in e&&s(7,p=e.previewMode)},[n,a,i,r,l,o,c,p]}class $ extends e{constructor(e){super(),t(this,e,I,T,s,{letters:0,data:1,editOption:2,correctAnswers:3,toggleChecked:4,deleteOption:5,reviewMode:6,previewMode:7})}}export{$ as O};
//# sourceMappingURL=OptionContainer-b0d84adf.js.map
