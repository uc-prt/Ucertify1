import{S as e,i as t,s as l,F as a,e as n,j as o,q as i,h as s,o as c,c as r,b as d,m,t as u,a as p,d as g,f,D as _,C as x,g as b,l as v,k as h,n as k,y as w,E as y,p as N,A as $,a3 as F,w as C,X as z,J as A,r as q,u as E}from"./main-c5aa8524.js";import{G as I}from"./GriddedHelper-c2008d2a.js";const{document:L}=a;function S(e,t,l){const a=e.slice();return a[33]=t[l],a[35]=l,a}function T(e,t,l){const a=e.slice();return a[30]=t[l],a[32]=l,a}function M(e,t,l){const a=e.slice();return a[33]=t[l],a[35]=l,a}function B(e){let t,l,a,o,i,r,d;return{c(){t=n("input"),f(t,"type","text"),f(t,"id",l=e[33].id),f(t,"name",a=e[33].name),f(t,"data-tag",o=e[33].dataTag),f(t,"style",i="width:50px;text-align:center;"),f(t,"class","tdFont fo")},m(l,a){s(l,t,a),r||(d=[v(t,"change",e[13]),v(t,"input",R)],r=!0)},p(e,n){64&n[0]&&l!==(l=e[33].id)&&f(t,"id",l),64&n[0]&&a!==(a=e[33].name)&&f(t,"name",a),64&n[0]&&o!==(o=e[33].dataTag)&&f(t,"data-tag",o)},d(e){e&&c(t),r=!1,w(d)}}}function P(e){let t;return{c(){t=n("input"),f(t,"type","text"),b(t,"width","50px"),b(t,"text-align","center"),t.value=".",f(t,"class","tdFont"),t.disabled="true"},m(e,l){s(e,t,l)},p:q,d(e){e&&c(t)}}}function D(e){let t;function l(e,t){return 1==e[33].decpoint?P:B}let a=l(e),n=a(e);return{c(){n.c(),t=i()},m(e,l){n.m(e,l),s(e,t,l)},p(e,o){a===(a=l(e))&&n?n.p(e,o):(n.d(1),n=a(e),n&&(n.c(),n.m(t.parentNode,t)))},d(e){n.d(e),e&&c(t)}}}function G(e){let t,l,a,n;return t=new I({props:{loop:e[5],class1:"tdFont plus_tab points",className:"tdFont plus_tab items_element",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP",value:"+"}}),t.$on("handleClickCombo",e[15]),a=new I({props:{loop:e[4],class1:"tdFont plus_tab",className:"tdFont minus_point text-center items_element",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP",value:"-"}}),a.$on("handleClickCombo",e[15]),{c(){r(t.$$.fragment),l=d(),r(a.$$.fragment)},m(e,o){m(t,e,o),s(e,l,o),m(a,e,o),n=!0},p(e,l){const n={};32&l[0]&&(n.loop=e[5]),t.$set(n);const o={};16&l[0]&&(o.loop=e[4]),a.$set(o)},i(e){n||(u(t.$$.fragment,e),u(a.$$.fragment,e),n=!0)},o(e){p(t.$$.fragment,e),p(a.$$.fragment,e),n=!1},d(e){g(t,e),e&&c(l),g(a,e)}}}function H(e){let t,l;return t=new I({props:{loop:e[3],class1:"tdFont points",className:"tdFont text-center items_element decl_point",tableId:"slash_tab",tableClass:"slash_tab gridded_tab mt-0 myP",value:"."}}),t.$on("handleClickCombo",e[15]),{c(){r(t.$$.fragment)},m(e,a){m(t,e,a),l=!0},p(e,l){const a={};8&l[0]&&(a.loop=e[3]),t.$set(a)},i(e){l||(u(t.$$.fragment,e),l=!0)},o(e){p(t.$$.fragment,e),l=!1},d(e){g(t,e)}}}function O(e){let t,l;return t=new I({props:{loop:e[3],class1:"tdFont points",className:"tdFont text-center items_element sla_point",tableId:"slash_tab",tableClass:"slash_tab gridded_tab mt-0 myP",value:"/"}}),t.$on("handleClickCombo",e[15]),{c(){r(t.$$.fragment)},m(e,a){m(t,e,a),l=!0},p(e,l){const a={};8&l[0]&&(a.loop=e[3]),t.$set(a)},i(e){l||(u(t.$$.fragment,e),l=!0)},o(e){p(t.$$.fragment,e),l=!1},d(e){g(t,e)}}}function X(e){let t,l,a,i,r,d,m,u,p,g,_=+e[32]+"";return{c(){t=n("td"),l=n("span"),a=E(_),f(l,"tabindex",i=0),f(l,"key",r=e[33].key),f(l,"name",d=e[33].name),f(l,"data-tag",m=e[33].name),f(l,"class","tdFont td_data text-center items_element"),f(l,"id",u=e[33].id),f(t,"width","50"),f(t,"class","text-center svelte-1wrfq8n")},m(n,i){s(n,t,i),o(t,l),o(l,a),p||(g=v(l,"click",e[14]),p=!0)},p(e,t){4&t[0]&&r!==(r=e[33].key)&&f(l,"key",r),4&t[0]&&d!==(d=e[33].name)&&f(l,"name",d),4&t[0]&&m!==(m=e[33].name)&&f(l,"data-tag",m),4&t[0]&&u!==(u=e[33].id)&&f(l,"id",u)},d(e){e&&c(t),p=!1,g()}}}function j(e){let t,l;return{c(){t=n("td"),f(t,"key",l=e[33].key),f(t,"class","tdFont text-center points svelte-1wrfq8n"),f(t,"width","50"),f(t,"disabled","true")},m(e,l){s(e,t,l)},p(e,a){4&a[0]&&l!==(l=e[33].key)&&f(t,"key",l)},d(e){e&&c(t)}}}function J(e){let t;function l(e,t){return 1==e[33].decpoint?j:X}let a=l(e),n=a(e);return{c(){n.c(),t=i()},m(e,l){n.m(e,l),s(e,t,l)},p(e,o){a===(a=l(e))&&n?n.p(e,o):(n.d(1),n=a(e),n&&(n.c(),n.m(t.parentNode,t)))},d(e){n.d(e),e&&c(t)}}}function K(e){let t,l,a,i=e[2],r=[];for(let t=0;t<i.length;t+=1)r[t]=J(S(e,i,t));return{c(){t=n("tr");for(let e=0;e<r.length;e+=1)r[e].c();l=d(),f(t,"key",a="row"+e[32])},m(e,a){s(e,t,a);for(let e=0;e<r.length;e+=1)r[e].m(t,null);o(t,l)},p(e,a){if(16388&a[0]){let n;for(i=e[2],n=0;n<i.length;n+=1){const o=S(e,i,n);r[n]?r[n].p(o,a):(r[n]=J(o),r[n].c(),r[n].m(t,l))}for(;n<r.length;n+=1)r[n].d(1);r.length=i.length}},d(e){e&&c(t),_(r,e)}}}function Q(e){let t,l,a,i,r,m,g,y,N,$,F,C,z,A,q,E,I,L,S,B,P,X,j,J,Q,R,U,V,W,Y,Z,ee,te,le,ae,ne,oe,ie,se,ce,re,de,me,ue,pe,ge,fe,_e,xe,be,ve,he,ke,we,ye,Ne,$e,Fe,Ce,ze,Ae,qe,Ee,Ie,Le,Se,Te,Me,Be=e[6],Pe=[];for(let t=0;t<Be.length;t+=1)Pe[t]=D(M(e,Be,t));let De=1==e[0].plus_minus&&G(e),Ge=1==e[0].decimal_val&&H(e),He=1==e[0].slash_val&&O(e),Oe=e[1],Xe=[];for(let t=0;t<Oe.length;t+=1)Xe[t]=K(T(e,Oe,t));return{c(){t=n("main"),l=n("div"),a=n("table"),i=n("tbody"),r=n("tr");for(let e=0;e<Pe.length;e+=1)Pe[e].c();g=d(),De&&De.c(),y=d(),Ge&&Ge.c(),N=d(),He&&He.c(),$=d(),F=n("table");for(let e=0;e<Xe.length;e+=1)Xe[e].c();C=d(),z=n("div"),A=n("div"),q=n("h2"),E=n("button"),E.textContent=""+x.layout_options,I=d(),L=n("div"),S=n("div"),B=n("div"),P=n("div"),X=n("div"),X.textContent=""+x.row_count,j=d(),J=n("div"),Q=n("input"),U=d(),V=n("div"),W=n("div"),W.textContent=""+x.col_count,Y=d(),Z=n("div"),ee=n("input"),le=d(),ae=n("div"),ne=n("div"),oe=n("div"),ie=n("input"),ce=n("label"),ce.textContent="Plus/Minus Column",re=d(),de=n("div"),me=n("div"),ue=n("input"),ge=n("label"),ge.textContent="Fraction/Slash",fe=d(),_e=n("div"),xe=n("div"),be=n("div"),ve=n("input"),ke=d(),we=n("label"),we.textContent="Fixed Decimal",ye=d(),Ne=n("div"),$e=n("div"),Fe=n("input"),ze=n("label"),ze.textContent="Floating Decimal",Ae=d(),qe=n("div"),Ee=n("div"),Ie=n("input"),f(a,"border","1"),f(a,"id","tab2"),f(a,"class","tab2"),f(a,"style",m="border-collapse: collapse;text-align: center;"),f(F,"id","gridded_sheet"),f(F,"class","gridded_tab lastGrid mt-0 myP svelte-1wrfq8n"),f(E,"class","accordion-button collapsed py-0"),f(E,"type","button"),f(E,"data-bs-toggle","collapse"),f(E,"data-bs-target","#collapseOne"),f(E,"aria-expanded","false"),f(E,"aria-controls","collapseOne"),f(q,"class","accordion-header mt-0"),f(q,"id","headingOne"),f(X,"class","font-weight-bold"),f(Q,"type","number"),f(Q,"min","1"),f(Q,"max","10"),Q.value=R=e[0].rowNum,f(Q,"name","col_range"),f(Q,"id","col_range"),f(Q,"class","form-control  inline-block"),f(Q,"data-label","Number of rows"),f(P,"class","col-sm-6"),f(W,"class","font-weight-bold"),f(ee,"type","number"),f(ee,"min","1"),f(ee,"max","6"),ee.value=te=e[0].colNum,f(ee,"name","col_nmbr"),f(ee,"id","col_range"),f(ee,"class","form-control  inline-block"),f(ee,"data-label","Number of rows"),f(V,"class","col-sm-6"),f(B,"class","row form-group"),f(ie,"type","checkbox"),f(ie,"class","custom_checkbox_new float-left svelte-1wrfq8n"),f(ie,"id","plus_minus_checkbox"),f(ie,"inputprops",se={"aria-label":"Plus/Minus Column"}),f(ce,"for","plus_minus_checkbox"),f(ce,"class","pl-1"),f(oe,"class","inline-block"),f(ne,"class","col-sm-6"),f(ue,"type","checkbox"),f(ue,"id","fraction_slash_checkbox"),f(ue,"class","custom_checkbox_new float-left svelte-1wrfq8n"),f(ue,"inputprops",pe={"aria-label":"Fraction/Slash"}),f(ge,"for","fraction_slash_checkbox"),f(ge,"class","pl-1"),f(me,"class","inline-block"),f(de,"class","col-sm-6"),f(ae,"class","row form-group"),f(ve,"type","checkbox"),f(ve,"id","fixed_decimal_checkbox"),f(ve,"class","custom_checkbox_new float-left svelte-1wrfq8n"),f(ve,"inputprops",he={"aria-label":"Fixed Decimal"}),f(we,"for","fixed_decimal_checkbox"),f(we,"class","pl-1"),f(be,"class","inline-block"),f(xe,"class","col-sm-6"),f(Fe,"type","checkbox"),f(Fe,"id","floating_decimal_checkbox"),f(Fe,"class","custom_checkbox_new float-left svelte-1wrfq8n"),f(Fe,"inputprops",Ce={"aria-label":"Floating Decimal"}),f(ze,"for","floating_decimal_checkbox"),f(ze,"class","pl-1"),f($e,"class","inline-block"),f(Ne,"class","col-sm-6"),f(_e,"class","row form-group"),f(Ie,"type","number"),f(Ie,"min","1"),f(Ie,"max","7"),f(Ie,"name","Fixed_decimal_column"),f(Ie,"id","Fixed_decimal_column"),f(Ie,"class","form-control  inline-block"),f(Ie,"placeholder","Fixed decimal column"),f(Ie,"style",Le="display: none"),f(Ie,"data-label","Fixed decimal column"),Ie.disabled="true",f(qe,"class","col-sm-6 inline-block pl-0"),f(S,"class","accordion-body"),f(L,"id","collapseOne"),f(L,"class","accordion-collapse collapse"),f(L,"aria-labelledby","headingOne"),f(L,"data-bs-parent","#accordionExample"),f(A,"class","accordion-item"),f(z,"class","accordion mt-5"),f(z,"id","accordionExample"),b(z,"background-color","#F0F0F0"),f(l,"class","griddedModule svelte-1wrfq8n")},m(n,c){s(n,t,c),o(t,l),o(l,a),o(a,i),o(i,r);for(let e=0;e<Pe.length;e+=1)Pe[e].m(r,null);o(l,g),De&&De.m(l,null),o(l,y),Ge&&Ge.m(l,null),o(l,N),He&&He.m(l,null),o(l,$),o(l,F);for(let e=0;e<Xe.length;e+=1)Xe[e].m(F,null);o(l,C),o(l,z),o(z,A),o(A,q),o(q,E),o(A,I),o(A,L),o(L,S),o(S,B),o(B,P),o(P,X),o(P,j),o(P,J),o(J,Q),o(B,U),o(B,V),o(V,W),o(V,Y),o(V,Z),o(Z,ee),o(S,le),o(S,ae),o(ae,ne),o(ne,oe),o(oe,ie),o(oe,ce),o(ae,re),o(ae,de),o(de,me),o(me,ue),o(me,ge),o(S,fe),o(S,_e),o(_e,xe),o(xe,be),o(be,ve),o(be,ke),o(be,we),o(_e,ye),o(_e,Ne),o(Ne,$e),o($e,Fe),o($e,ze),o(S,Ae),o(S,qe),o(qe,Ee),o(Ee,Ie),Se=!0,Te||(Me=[v(Q,"change",e[11]),v(ee,"change",e[11]),v(ie,"click",e[7]),v(ue,"click",e[8]),v(ve,"click",e[9]),v(Fe,"click",e[10]),v(Ie,"change",e[12])],Te=!0)},p(e,t){if(8256&t[0]){let l;for(Be=e[6],l=0;l<Be.length;l+=1){const a=M(e,Be,l);Pe[l]?Pe[l].p(a,t):(Pe[l]=D(a),Pe[l].c(),Pe[l].m(r,null))}for(;l<Pe.length;l+=1)Pe[l].d(1);Pe.length=Be.length}if(1==e[0].plus_minus?De?(De.p(e,t),1&t[0]&&u(De,1)):(De=G(e),De.c(),u(De,1),De.m(l,y)):De&&(h(),p(De,1,1,(()=>{De=null})),k()),1==e[0].decimal_val?Ge?(Ge.p(e,t),1&t[0]&&u(Ge,1)):(Ge=H(e),Ge.c(),u(Ge,1),Ge.m(l,N)):Ge&&(h(),p(Ge,1,1,(()=>{Ge=null})),k()),1==e[0].slash_val?He?(He.p(e,t),1&t[0]&&u(He,1)):(He=O(e),He.c(),u(He,1),He.m(l,$)):He&&(h(),p(He,1,1,(()=>{He=null})),k()),16390&t[0]){let l;for(Oe=e[1],l=0;l<Oe.length;l+=1){const a=T(e,Oe,l);Xe[l]?Xe[l].p(a,t):(Xe[l]=K(a),Xe[l].c(),Xe[l].m(F,null))}for(;l<Xe.length;l+=1)Xe[l].d(1);Xe.length=Oe.length}(!Se||1&t[0]&&R!==(R=e[0].rowNum))&&(Q.value=R),(!Se||1&t[0]&&te!==(te=e[0].colNum))&&(ee.value=te)},i(e){Se||(u(De),u(Ge),u(He),Se=!0)},o(e){p(De),p(Ge),p(He),Se=!1},d(e){e&&c(t),_(Pe,e),De&&De.d(),Ge&&Ge.d(),He&&He.d(),_(Xe,e),Te=!1,w(Me)}}}function R(e){let t=e.target.getAttribute("name"),l=document.getElementsByName(t);for(let t=1;t<l.length;t++)l[t].classList.contains("active")&&l[t].classList.remove("active"),l[t].innerHTML==e.target.value&&l[t].classList.add("active")}function U(e,t,l){let a={},{getChildXml:n}=t,o=[],{xml:i}=t;C({rowNum:4,colNum:4,tableName:"Gridded System",plus_minus:0,slash_val:0,decimal_val:0,xml:"",textSize:14,resAns:"",correctAns:[],listAns:[],res:"",fixed_decimal_val:0,decimal_point:0}).subscribe((e=>{l(0,a=e)}));function s(){let e='<smxml type="56" name="Gridded" plusminus="'+a.plus_minus+'" slash="'+a.slash_val+'" decimal="'+a.decimal_val+'" fixed_point="'+a.decimal_point+'" font="'+a.textSize+'" row="'+a.rowNum+'" col="'+a.colNum+'" correctAns="'+a.res+'" >\x3c!--[CDATA[]]--\x3e</smxml>';n(e)}y((()=>{AI.selectAll(".tdFont","css",{fontSize:"14px"})})),N((()=>{$.listen("body","keydown",".td_data",((e,t)=>{console.log("Evnts => ",t),13===t.which&&e.click()}))})),F((()=>{i!=a.xml&&(l(0,a.xml=i,a),function(e){try{l(0,a.rowNum=e.smxml._row,a),l(0,a.colNum=e.smxml._col,a),l(0,a.slash_val=e.smxml._slash,a),l(0,a.plus_minus=e.smxml._plusminus,a),l(0,a.decimal_val=e.smxml._decimal,a),l(0,a.textSize=e.smxml._font,a),l(0,a.correctAns=e.smxml._correctAns,a),n(A(e)),1==e.smxml._plusminus&&(document.getElementById("plus_minus_checkbox").checked=!0),1==e.smxml._slash&&(document.getElementById("fraction_slash_checkbox").checked=!0),1==e.smxml._decimal&&(document.getElementById("floating_decimal_checkbox").checked=!0)}catch(e){console.warn({error:e.message,"function name":"parseXMLAuthoring","File name":"Gridded.js"})}}(z(i))),function(){l(6,g=[]);let e=a.decimal_point;for(let t=0;t<a.colNum;t++)t===e-1&&0!=e?l(6,g=[...g,{decpoint:!0}]):g.length<a.colNum&&l(6,g=[...g,{id:"td"+t,name:t,dataTag:t,decpoint:!1}])}(),function(e){l(3,c=[]);let t=a.decimal_point;for(let e=0;e<a.colNum;e++)e==t-1&&0!=t?l(3,c=[...c,{key:"col"+e,decpoint:!0}]):c.length<a.colNum&&l(3,c=[...c,{id:"td"+e,name:e,dataTag:e,decpoint:!1}])}(),function(e){r=[];let t=a.decimal_point;for(let e=0;e<a.colNum;e++)e==t-1&&0!=t?r=[...r,{key:"col"+e,decpoint:!0}]:r.length<a.colNum&&r.push(r=[...r,{id:"td"+e,name:e,dataTag:e,decpoint:!1}])}(),function(e){l(5,p=[]),l(4,u=[]);let t=a.decimal_point;for(let e=0;e<a.colNum;e++)e==t-1&&0!=t?l(5,p=[...p,{id:"td"+e,dataTag:e,name:e,decpoint:!0}]):p.length<a.colNum&&l(5,p=[...p,{id:"td"+e,dataTag:e,name:e,decpoint:!1}]),e==t-1&&0!=t?l(4,u=[...u,{id:"td"+e,dataTag:e,name:e,decpoint:!0}]):u.length<a.colNum&&l(4,u=[...u,{id:"td"+e,name:e,dataTag:e,decpoint:!1}])}(),function(){$.select(".tdFont","css",{fontSize:a.textSize}),l(1,d=[]);let e=a.decimal_point;for(let t=0;t<a.rowNum;t++){l(2,m=[]);for(let n=0;n<a.colNum;n++)n==e-1&&0!=e?l(2,m=[...m,{key:"col"+t+n,decpoint:!0}]):m.length<a.colNum&&l(2,m=[...m,{key:"col"+t+n,name:n,id:"td"+n+"-"+t+n,decpoint:!1}]);l(1,d=[...d,{key:"row"+t}])}}()}));let c,r,d=[],m=[];let u=[],p=[];let g=[];return e.$$set=e=>{"getChildXml"in e&&l(16,n=e.getChildXml),"xml"in e&&l(17,i=e.xml)},[a,d,m,c,u,p,g,function(){l(0,a.plus_minus=0==a.plus_minus?1:0,a),s()},function(e){l(0,a.slash_val=0==a.slash_val?1:0,a),s()},function(e){if(0==a.fixed_decimal_val){l(0,a.fixed_decimal_val=1,a);let e=document.getElementById("Fixed_decimal_column");e.disabled=!1,e.style.display="inline-block"}else{l(0,a.fixed_decimal_val=0,a),l(0,a.decimal_point=0,a);let e=document.getElementById("Fixed_decimal_column");e.value=" ",e.disabled=!0,e.style.display="none",s()}},function(e){l(0,a.decimal_val=0==a.decimal_val?1:0,a),s()},function(e){if(e.target.value.length>1)return $.alert("accept only single value"),e.target.value=4,!1;console.log("check");let t=e.target.value;if(!(t>0&&t<=10))return $.alert(x.grid_one_to_ten),!1;if("col_nmbr"==e.target.name){if(e.target.value<1)return $.alert(x.col_less_one),eva,e.target.value=1,!1;if(e.target.value>6)return $.alert(x.type_one_to_seven),e.target.value="",!1;l(0,a.colNum=e.target.value,a)}else{if(e.target.value<1)return $.alert(x.row_less_one),e.target.value=1,!1;if(e.target.value>10)return $.alert(x.type_one_to_ten),e.target.value="",!1;l(0,a.rowNum=e.target.value,a)}s()},function(e){let t=e.target.value;if(e.target.value.length>1)return $.alert("accept only single value"),e.target.value="",!1;""==e.target.value&&(t=""),(e.target.value.length>1||e.target.value<1||a.colNum<=e.target.value)&&(t=1,e.target.value=1,$.alert(x.decimal_position+(a.colNum-1)+"."),document.querySelector(".sa-info").style.display="block"),l(0,a.decimal_point=t,a),s()},function(e){console.log("number"+a.plus_minus);let t=a.rowNum-1;if(e.target.value.length>1)return $.alert(x.double_digit),e.target.value="",!1;if(e.target.value<0)return $.alert(x.less_one),e.target.value="",!1;if(t<e.target.value)return $.alert(x.number_from+t),e.target.value="",!1;if(0==a.plus_minus&&"+"==e.target.value||"-"==e.target.value)return $.alert("Plz select plus and minus option"),e.target.value="",!1;if(0==a.slash_val&&"/"==e.target.value)return $.alert("Plz select slash option"),e.target.value="",!1;if(0==a.decimal_val&&"."==e.target.value)return $.alert("Plz select decimal option"),e.target.value="",!1;let n=e.target.attributes.getNamedItem("data-tag").value;o[n]=e.target.value;for(let e=0;e<o.length;e++)void 0!==o[e]&&""!=o[e]||(o[e]="%blank%");"%blank%"==o[o.length-1]&&o.pop(),l(0,a.listAns=o,a),l(0,a.res=a.listAns.toString(),a),s()},function(e){let t=e.target.getAttribute("name"),n=document.getElementsByName(t);for(let e=0;e<n.length;e++)n[e].classList.contains("active")&&n[e].classList.remove("active");e.target.classList.add("active");let i=e.target.id.split("-");document.getElementById(i[0]).value=e.target.innerHTML;let c=e.target.attributes.getNamedItem("data-tag").value;o[c]=e.target.innerHTML;for(let e=0;e<o.length;e++)void 0===o[e]&&(o[e]="%blank%");l(0,a.listAns=o,a),l(0,a.res=a.listAns.toString(),a),s()},function(e){let t=e.detail.target.getAttribute("name"),n=document.getElementsByName(t);for(let e=0;e<n.length;e++)n[e].classList.contains("active")&&n[e].classList.remove("active");e.detail.target.classList.add("active");let i=e.detail.target.id.split("-");document.getElementById(i[0]).value=e.detail.target.innerHTML;let c=e.detail.target.attributes.getNamedItem("data-tag").value;o[c]=e.detail.target.innerHTML;for(let e=0;e<o.length;e++)void 0===o[e]&&(o[e]="%blank%");l(0,a.listAns=o,a),l(0,a.res=a.listAns.toString(),a),s()},n,i]}export default class extends e{constructor(e){var a;super(),L.getElementById("svelte-1wrfq8n-style")||((a=n("style")).id="svelte-1wrfq8n-style",a.textContent=".custom_checkbox_new.svelte-1wrfq8n.svelte-1wrfq8n{display:block;position:relative;width:20px;height:20px;margin-bottom:0;cursor:pointer;font-size:18px}.layoutHeading{font-weight:bold;font-size:16px;color:#1877b1}.items_element:hover{border:1.2px solid #777}.moreOptions{-webkit-box-shadow:3px 4px 6px #c4c5c5;-moz-box-shadow:3px 4px 6px #c4c5c5;box-shadow:3px 4px 6px #c4c5c5;background-color:#f0f0f0;border-top:1px solid #1877b1;border-bottom:1px solid #1877b1}.moreOptionDetails{background-color:#f7f7f7}.input_col{position:relative;left:5px}.layoutheading{padding:5px;font-size:20px;font-weight:bold}.numbr_range{position:relative;left:130px}.numbr_range_txt{position:relative;left:200px}.plus_minus_fraction{position:relative;top:20px}.floating_fraction{position:relative;top:27px}.plus_minus_span{position:relative;left:5px}.floating_decimal{float:right;margin-right:45px}.fontStyle{width:100px;float:right;margin-right:60px}.fraction_slash{position:relative;left:177px}.minus_tab,\r\n.plus_tab,\r\n.slash_tab{text-align:center}.gridded_tab.svelte-1wrfq8n.svelte-1wrfq8n{background-color:#f0f0f0;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.font_size_label{position:relative;left:198px}.font_size{position:relative;left:225px}.decimal_col{position:relative;left:208px;width:90px}.correct_color{background-color:#E9FFE9}.fixed_decimal_check{position:relative;top:26px;left:13px}.correct_incorrect_icon_fill{position:relative;width:19px;height:19px;right:121px;top:-55px;background:white;border-radius:50%}.row_column_decimal{position:relative;top:30px;left:5px}.fixed_point_class{position:relative;left:7px}.row_column{position:relative;left:5px}.answer_icon{position:absolute;top:3px;right:34px}.col_range{width:205px}.posSize{position:relative;left:7px}.fontSmall{font-size:12px;text-align:center}.fontNormal{font-size:14px;text-align:center}.fontLarge{font-size:24px;text-align:center}.fontExtraLarge{font-size:26px;text-align:center}.grid{position:relative;top:10px;box-shadow:10px 5px 10px #000}.items_element{border:1px solid #8080807a;padding:6px 10px;border-radius:50%;background-color:white}.griddedModule .active{color:white;transition:1s;background:#696969;border:2px solid #fff}.sla_point{padding:6px 11px}.griddedModule.svelte-1wrfq8n table tr td.svelte-1wrfq8n:last-child{border-right:1px solid #ccc !important}.griddedModule.svelte-1wrfq8n .lastGrid tr:last-child td.svelte-1wrfq8n{border-bottom:1px solid #ccc !important}.griddedModule td{border:1px solid #f0f0f0 !important;border-left:1px solid #ccc !important}.token:hover{border:1px solid #000 !important}.bla .token:hover{border:1px solid #fff !important}.token_selected{background-color:#64bb63;color:#fff}.bla .token_highlight_heading{color:#000 !important}.griddedModule .expandIcon{font-size:27px;font-weight:bold;color:#1877b1}",o(L.head,a)),t(this,e,U,Q,l,{getChildXml:16,xml:17},[-1,-1])}}
//# sourceMappingURL=Gridded-6906e8cf.js.map
