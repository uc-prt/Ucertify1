import{S as e,i as t,s,F as l,e as n,j as o,q as r,h as a,o as i,c,b as d,m,t as p,a as u,d as v,f as g,D as w,g as f,k as h,n as x,p as b,A as _,E as j,C as k,w as y,X as $,T as L,l as N,y as A,r as C,u as M}from"./main-a30cdebc.js";import{I as T}from"./ItemHelper-bbb6acbc.js";import{G as I}from"./GriddedHelper-65ecaf6a.js";const{document:F}=l;function E(e,t,s){const l=e.slice();return l[42]=t[s],l[44]=s,l}function P(e,t,s){const l=e.slice();return l[39]=t[s],l[41]=s,l}function z(e,t,s){const l=e.slice();return l[42]=t[s],l[44]=s,l}function H(e){let t,s,l,r,c,m,p,u,v,w,f,h,x,b;return{c(){t=n("input"),p=d(),u=n("span"),v=n("span"),f=d(),g(t,"type","text"),g(t,"id",s=e[42].id),g(t,"data-tag",l=e[42].dataTag),g(t,"name",r=e[42].name),g(t,"style",c="width:50px;text-align:center;"),t.value=m=void 0===e[1][e[44]]?" ":e[1][e[44]],g(t,"class","tdFont"),g(v,"id",w=e[42].spanid),g(v,"class","answer_icon svelte-1ersj3w"),g(u,"class",h=L(e[2].iconVisible+" relative")+" svelte-1ersj3w")},m(s,l){a(s,t,l),a(s,p,l),a(s,u,l),o(u,v),o(u,f),x||(b=[N(t,"change",e[12]),N(t,"input",J)],x=!0)},p(e,n){8&n[0]&&s!==(s=e[42].id)&&g(t,"id",s),8&n[0]&&l!==(l=e[42].dataTag)&&g(t,"data-tag",l),8&n[0]&&r!==(r=e[42].name)&&g(t,"name",r),2&n[0]&&m!==(m=void 0===e[1][e[44]]?" ":e[1][e[44]])&&t.value!==m&&(t.value=m),8&n[0]&&w!==(w=e[42].spanid)&&g(v,"id",w),4&n[0]&&h!==(h=L(e[2].iconVisible+" relative")+" svelte-1ersj3w")&&g(u,"class",h)},d(e){e&&i(t),e&&i(p),e&&i(u),x=!1,A(b)}}}function X(e){let t,s;return{c(){t=n("input"),g(t,"type","text"),g(t,"style",s="width:50px;text-align:center;"),t.value=".",t.disabled="true",g(t,"class","tdFont")},m(e,s){a(e,t,s)},p:C,d(e){e&&i(t)}}}function B(e){let t;function s(e,t){return 1==e[42].decpoint?X:H}let l=s(e),n=l(e);return{c(){n.c(),t=r()},m(e,s){n.m(e,s),a(e,t,s)},p(e,o){l===(l=s(e))&&n?n.p(e,o):(n.d(1),n=l(e),n&&(n.c(),n.m(t.parentNode,t)))},d(e){n.d(e),e&&i(t)}}}function S(e){let t,s,l,n;return t=new I({props:{loop:e[8],class1:"tdFont plus_tab",className:"tdFontP plus_tab items_element",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP",value:"+"}}),t.$on("handleClickCombo",e[11]),l=new I({props:{loop:e[9],class1:"tdFont plus_tab",className:"tdFontP plus_tab items_element minus_point",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP",value:"-"}}),l.$on("handleClickCombo",e[11]),{c(){c(t.$$.fragment),s=d(),c(l.$$.fragment)},m(e,o){m(t,e,o),a(e,s,o),m(l,e,o),n=!0},p(e,s){const n={};256&s[0]&&(n.loop=e[8]),t.$set(n);const o={};512&s[0]&&(o.loop=e[9]),l.$set(o)},i(e){n||(p(t.$$.fragment,e),p(l.$$.fragment,e),n=!0)},o(e){u(t.$$.fragment,e),u(l.$$.fragment,e),n=!1},d(e){v(t,e),e&&i(s),v(l,e)}}}function G(e){let t,s;return t=new I({props:{loop:e[7],class1:"tdFont points",className:"tdFontP text-center items_element decl_point",tableId:"slash_tab",tableClass:"slash_tab gridded_tab mt-0 mb-0 myP",value:"."}}),t.$on("handleClickCombo",e[11]),{c(){c(t.$$.fragment)},m(e,l){m(t,e,l),s=!0},p(e,s){const l={};128&s[0]&&(l.loop=e[7]),t.$set(l)},i(e){s||(p(t.$$.fragment,e),s=!0)},o(e){u(t.$$.fragment,e),s=!1},d(e){v(t,e)}}}function R(e){let t,s;return t=new I({props:{loop:e[6],class1:"tdFont points",className:"tdFontP text-center items_element sla_point",tableId:"tdFontP slash_tab",tableClass:"slash_tab gridded_tab mt-0",value:"/"}}),t.$on("handleClickCombo",e[11]),{c(){c(t.$$.fragment)},m(e,l){m(t,e,l),s=!0},p(e,s){const l={};64&s[0]&&(l.loop=e[6]),t.$set(l)},i(e){s||(p(t.$$.fragment,e),s=!0)},o(e){u(t.$$.fragment,e),s=!1},d(e){v(t,e)}}}function Q(e){let t,s,l,r,c,d,m,p,u,v,w=+e[41]+"";return{c(){t=n("td"),s=n("span"),l=M(w),g(s,"tabindex",r=e[42].tabIndex),g(s,"key",c=e[42].key),g(s,"name",d=e[42].name),g(s,"data-tag",m=e[42].dataTag),g(s,"class","tdFontP text-center td_data algn items_element svelte-1ersj3w"),g(s,"id",p=e[42].id),g(t,"width","50"),g(t,"class","text-center svelte-1ersj3w")},m(n,r){a(n,t,r),o(t,s),o(s,l),u||(v=N(s,"click",e[10]),u=!0)},p(e,t){32&t[0]&&r!==(r=e[42].tabIndex)&&g(s,"tabindex",r),32&t[0]&&c!==(c=e[42].key)&&g(s,"key",c),32&t[0]&&d!==(d=e[42].name)&&g(s,"name",d),32&t[0]&&m!==(m=e[42].dataTag)&&g(s,"data-tag",m),32&t[0]&&p!==(p=e[42].id)&&g(s,"id",p)},d(e){e&&i(t),u=!1,v()}}}function V(e){let t,s;return{c(){t=n("td"),g(t,"key",s=e[42].key),g(t,"class","tdFont text-center svelte-1ersj3w"),g(t,"width","50"),g(t,"disabled","true")},m(e,s){a(e,t,s)},p(e,l){32&l[0]&&s!==(s=e[42].key)&&g(t,"key",s)},d(e){e&&i(t)}}}function q(e){let t;function s(e,t){return e[42].decpoint?V:Q}let l=s(e),n=l(e);return{c(){n.c(),t=r()},m(e,s){n.m(e,s),a(e,t,s)},p(e,o){l===(l=s(e))&&n?n.p(e,o):(n.d(1),n=l(e),n&&(n.c(),n.m(t.parentNode,t)))},d(e){n.d(e),e&&i(t)}}}function D(e){let t,s,l,r=e[5],c=[];for(let t=0;t<r.length;t+=1)c[t]=q(E(e,r,t));return{c(){t=n("tr");for(let e=0;e<c.length;e+=1)c[e].c();s=d(),g(t,"key",l=e[39].key)},m(e,l){a(e,t,l);for(let e=0;e<c.length;e+=1)c[e].m(t,null);o(t,s)},p(e,n){if(1056&n[0]){let l;for(r=e[5],l=0;l<r.length;l+=1){const o=E(e,r,l);c[l]?c[l].p(o,n):(c[l]=q(o),c[l].c(),c[l].m(t,s))}for(;l<c.length;l+=1)c[l].d(1);c.length=r.length}16&n[0]&&l!==(l=e[39].key)&&g(t,"key",l)},d(e){e&&i(t),w(c,e)}}}function O(e){let t,s,l,r,b,_,j,k,y,$,L,N,A,C,M;r=new T({props:{handleReviewClick:e[13],reviewMode:e[0]}});let I=e[3],F=[];for(let t=0;t<I.length;t+=1)F[t]=B(z(e,I,t));let E=1==e[2].plus_minus&&S(e),H=1==e[2].decimal_val&&G(e),X=1==e[2].slash_val&&R(e),Q=e[4],V=[];for(let t=0;t<Q.length;t+=1)V[t]=D(P(e,Q,t));return{c(){t=n("main"),s=n("div"),l=n("center"),c(r.$$.fragment),b=d(),_=n("table"),j=n("tr");for(let e=0;e<F.length;e+=1)F[e].c();y=d(),E&&E.c(),$=d(),H&&H.c(),L=d(),X&&X.c(),N=d(),A=n("table"),C=n("tbody");for(let e=0;e<V.length;e+=1)V[e].c();f(j,"display","flex"),g(_,"border","1"),g(_,"id","tab2"),g(_,"style",k="border-collapse:collapse;text-align:center"),g(C,"class","svelte-1ersj3w"),g(A,"id","gridded_sheet"),g(A,"class","gridded_tab mt-0 lastGrid create_tab myP svelte-1ersj3w"),g(s,"class","griddedModule svelte-1ersj3w")},m(e,n){a(e,t,n),o(t,s),o(s,l),m(r,l,null),o(s,b),o(s,_),o(_,j);for(let e=0;e<F.length;e+=1)F[e].m(j,null);o(s,y),E&&E.m(s,null),o(s,$),H&&H.m(s,null),o(s,L),X&&X.m(s,null),o(s,N),o(s,A),o(A,C);for(let e=0;e<V.length;e+=1)V[e].m(C,null);M=!0},p(e,t){const l={};if(1&t[0]&&(l.reviewMode=e[0]),r.$set(l),4110&t[0]){let s;for(I=e[3],s=0;s<I.length;s+=1){const l=z(e,I,s);F[s]?F[s].p(l,t):(F[s]=B(l),F[s].c(),F[s].m(j,null))}for(;s<F.length;s+=1)F[s].d(1);F.length=I.length}if(1==e[2].plus_minus?E?(E.p(e,t),4&t[0]&&p(E,1)):(E=S(e),E.c(),p(E,1),E.m(s,$)):E&&(h(),u(E,1,1,(()=>{E=null})),x()),1==e[2].decimal_val?H?(H.p(e,t),4&t[0]&&p(H,1)):(H=G(e),H.c(),p(H,1),H.m(s,L)):H&&(h(),u(H,1,1,(()=>{H=null})),x()),1==e[2].slash_val?X?(X.p(e,t),4&t[0]&&p(X,1)):(X=R(e),X.c(),p(X,1),X.m(s,N)):X&&(h(),u(X,1,1,(()=>{X=null})),x()),1072&t[0]){let s;for(Q=e[4],s=0;s<Q.length;s+=1){const l=P(e,Q,s);V[s]?V[s].p(l,t):(V[s]=D(l),V[s].c(),V[s].m(C,null))}for(;s<V.length;s+=1)V[s].d(1);V.length=Q.length}},i(e){M||(p(r.$$.fragment,e),p(E),p(H),p(X),M=!0)},o(e){u(r.$$.fragment,e),u(E),u(H),u(X),M=!1},d(e){e&&i(t),v(r),w(F,e),E&&E.d(),H&&H.d(),X&&X.d(),w(V,e)}}}function J(e){let t=e.target.getAttribute("name"),s=document.getElementsByName(t);for(let t=1;t<s.length;t++)s[t].classList.contains("active")&&s[t].classList.remove("active"),s[t].innerHTML==e.target.value&&s[t].classList.add("active")}function K(e,t,s){let l,{isReview:n}=t,{xml:o}=t,{showAns:r}=t,a=" ",i=[],c=[],d=[],m=0,p="",u=y({rowNum:4,colNum:4,item:1,plus_minus:0,slash_val:0,decimal_val:0,xml:"",textSizeP:0,correctAns:[],userList:[],isMathquill:!1,smController:"h",pointerEvents:"auto",decimal_point:0,iconVisible:"h"}),v={};u.subscribe((e=>{s(2,v=e)}));function g(e){!function(e){try{if(s(2,v.rowNum=e.smxml._row,v),s(2,v.colNum=e.smxml._col,v),s(2,v.slash_val=e.smxml._slash,v),s(2,v.plus_minus=e.smxml._plusminus,v),s(2,v.decimal_val=e.smxml._decimal,v),s(2,v.textSizeP=e.smxml._font,v),s(2,v.correctAns=e.smxml._correctAns.split(","),v),s(2,v.decimal_point=e.smxml._fixed_point,v),window.uaXML){let e=setTimeout((function(){!function(e){let t=$(e);t.smans&&t.smans.div&&t.smans.div._userAns&&(i=t.smans.div._userAns.split(","),a=t.smans.div._correct,c=i)}(window.uaXML),clearTimeout(e)}),50)}}catch(e){onError=e,console.log({error:e.message,"function name":"parseXMLPreview","File name":"GriddedPreview.js"})}}(e=$(e))}function w(e){let t,n=e.target.attributes.getNamedItem("data-tag").value;""===e.target.innerHTML?i[n]=e.target.value:i[n]=e.target.innerHTML;for(let e=0;e<i.length;e++)void 0!==i[e]&&""!=i[e]||(i[e]="%blank%");"%blank%"==i[i.length-1]&&i.pop(),s(2,v.userList=i,v),l=v.correctAns;let o=v.userList;if(o.length==l.length){for(let e=0;e<l.length;e++)o[e]==l[e]&&m++;m==o.length?(t=k.correct,p=!0,m=0):(t=k.incorrect,p=!1,m=0)}else t=k.incorrect;window.QXML||r(t),_.select("#special_module_user_xml").value="<smans><div type='56' correct='"+p+"' userAns='"+v.userList+"'></div></smans>"," "!=a&&m==o.length?_.select("#answer","attr",{checked:a}):_.select("#answer","attr",{checked:p})}b((()=>{_.listen(document,"keydown",".td_data",(e=>{13===e.which&&e.click()})),_.listen(document,"click","#sm_controller button",(e=>{_.selectAll("#sm_controller button","removeClass",["active,btn-secondary,text-white,bg-secondary"]),_.selectAll(e,"addClass",["active,btn-secondary,text-white,bg-secondary"])})),_.listen(document,"click","#set-review",(function(){A()})),_.listen(document,"click","#unset-review",(function(){C()}))})),j((()=>{o!=v.xml&&(s(2,v.xml=o,v),g(o)),window.QXML&&console.log("qxml"),function(){s(3,f=[]);let e=v.decimal_point;for(let t=0;t<v.colNum;t++)"%blank%"===c[t]?s(1,d[t]=" ",d):s(1,d[t]=c[t],d),t==e-1&&0!=e?s(3,f=[...f,{decpoint:!0}]):f.length<v.colNum&&s(3,f=[...f,{id:"t"+t,dataTag:t,name:"p"+t,value:d[t],spanid:"t_"+t,decpoint:!1}])}(),function(e){s(7,N=[]);let t=v.decimal_point;for(let e=0;e<v.colNum;e++)e==t-1&&0!=t?s(7,N=[...N,{key:"col"+e,decpoint:!0}]):N.length<v.colNum&&s(7,N=[...N,{id:"t"+e,name:"p"+e,dataTag:e,decpoint:!1}])}(),function(e){s(6,L=[]);let t=v.decimal_point;for(let e=0;e<v.colNum;e++)e==t-1&&0!=t?s(6,L=[...L,{key:"col"+e,decpoint:!0}]):L.length<v.colNum&&s(6,L=[...L,{id:"t"+e,name:"p"+e,dataTag:e,decpoint:!1}])}(),function(e){s(8,T=[]),s(9,I=[]);let t=v.decimal_point;for(let e=0;e<v.colNum;e++)e==t-1&&0!=t?s(8,T=[...T,{dataTag:e,name:e,decpoint:!0}]):T.length<v.colNum&&s(8,T=[...T,{id:"t"+e,name:"p"+e,dataTag:e,decpoint:!1}]),e==t-1&&0!=t?s(9,I=[...I,{dataTag:e,name:e,decpoint:!0}]):I.length<v.colNum&&s(9,I=[...I,{id:"t"+e,name:"p"+e,dataTag:e,decpoint:!1}])}(),function(){s(4,h=[]);let e=v.decimal_point;for(let t=0;t<v.rowNum;t++){s(5,x=[]);for(let l=0;l<v.colNum;l++)l==e-1&&0!=e?s(5,x=[...x,{key:"col"+t+l,decpoint:!0}]):x.length<v.colNum&&s(5,x=[...x,{tabIndex:0,key:"col"+t+l,name:"p"+l,dataTag:l,id:"t"+l+"-"+t+l,decpoint:!1}]);s(4,h=[...h,{key:"row"+t}])}}()}));let f=[];let h=[],x=[];let L=[];let N=[];function A(){console.trace(),s(2,v.smController="",v),s(2,v.pointerEvents="none",v),s(0,n=!0),M("yans","showIcon"),_.selectAll("#sm_controller .your-ans","addClass",["btn-light","active"]),_.selectAll(".tokenHeader","attr",{tabindex:0}),setTimeout(function(){for(let e=0;e<v.correctAns.length;e++)v.correctAns[e]==v.userList[e]?(_.select("#t_"+e,"removeClass","icomoon-new-24px-cancel-circle-1"),_.select("#t_"+e,"addClass","icomoon-new-24px-checkmark-circle-1")):(_.select("#t_"+e,"removeClass","icomoon-new-24px-checkmark-circle-1"),_.select("#t_"+e,"addClass","icomoon-new-24px-cancel-circle-1"))}(),200),window.QXML||r(p?k.correct:k.incorrect)}function C(){s(2,v.smController="h",v),s(2,v.pointerEvents="auto",v),s(0,n=!1),M("yans","hideIcon"),_.selectAll(".tokenHeader","removeAttr","tabindex")}function M(e,t){if(s(2,v.iconVisible="showIcon"==t?"":"h",v),"cans"==e){document.getElementsByClassName("gridded_tab").disabled=!0,c=v.correctAns}else"yans"==e&&(c=i)}let T=[],I=[];return e.$$set=e=>{"isReview"in e&&s(0,n=e.isReview),"xml"in e&&s(14,o=e.xml),"showAns"in e&&s(15,r=e.showAns)},e.$$.update=()=>{1&e.$$.dirty[0]&&(n?A():C())},[n,d,v,f,h,x,L,N,T,I,function(e){let t=e.target.getAttribute("name"),s=document.getElementsByName(t);for(let e=0;e<s.length;e++)s[e].classList.contains("active")&&s[e].classList.remove("active");e.target.classList.add("active");let l=e.target.id.split("-");document.getElementById(l[0]).value=e.target.innerHTML,w(e)},function(e){let t=e.detail.target.getAttribute("name"),n=document.getElementsByName(t);for(let e=0;e<n.length;e++)n[e].classList.contains("active")&&n[e].classList.remove("active");e.detail.target.classList.add("active");let o=e.detail.target.id.split("-");document.getElementById(o[0]).value=e.detail.target.innerHTML,function(e){let t,n=e.detail.target.attributes.getNamedItem("data-tag").value;""===e.detail.target.innerHTML?i[n]=e.detail.target.value:i[n]=e.detail.target.innerHTML;for(let e=0;e<i.length;e++)void 0!==i[e]&&""!=i[e]||(i[e]="%blank%");"%blank%"==i[i.length-1]&&i.pop();s(2,v.userList=i,v),l=v.correctAns;let o=v.userList;if(o.length==l.length){for(let e=0;e<l.length;e++)o[e]==l[e]&&m++;m==o.length?(t=k.correct,p=!0,m=0):(t=k.incorrect,p=!1,m=0)}else t=k.incorrect;window.QXML||r(t);_.select("#special_module_user_xml").value="<smans><div type='56' correct='"+p+"' userAns='"+v.userList+"'></div></smans>"," "!=a&&m==o.length?_.select("#answer","attr",{checked:a}):_.select("#answer","attr",{checked:p})}(e)},function(e){let t=v.rowNum-1;return e.target.value.length>1?(_.alert("Double digit not accepted"),e.target.value="",!1):e.target.value<0?(_.alert("Less then 1 not accepted"),e.target.value="",!1):t<e.target.value?(_.alert("Number insert only 0 to "+v.rowNum),e.target.value="",!1):void w(e)},function(e){"c"==e?M("cans","hideIcon"):M("yans","showIcon")},o,r]}export default class extends e{constructor(e){var l;super(),F.getElementById("svelte-1ersj3w-style")||((l=n("style")).id="svelte-1ersj3w-style",l.textContent=".layoutHeading.svelte-1ersj3w.svelte-1ersj3w{font-weight:bold;font-size:16px;color:#1877b1}.items_element.svelte-1ersj3w.svelte-1ersj3w:hover{border:1.2px solid #777}.moreOptions.svelte-1ersj3w.svelte-1ersj3w{-webkit-box-shadow:3px 4px 6px #c4c5c5;-moz-box-shadow:3px 4px 6px #c4c5c5;box-shadow:3px 4px 6px #c4c5c5;background-color:#f0f0f0;border-top:1px solid #1877b1;border-bottom:1px solid #1877b1}.moreOptionDetails.svelte-1ersj3w.svelte-1ersj3w{background-color:#f7f7f7}.input_col.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:5px}.layoutheading.svelte-1ersj3w.svelte-1ersj3w{padding:5px;font-size:20px;font-weight:bold}.numbr_range.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:130px}.numbr_range_txt.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:200px}.plus_minus_fraction.svelte-1ersj3w.svelte-1ersj3w{position:relative;top:20px}.floating_fraction.svelte-1ersj3w.svelte-1ersj3w{position:relative;top:27px}.plus_minus_span.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:5px}.floating_decimal.svelte-1ersj3w.svelte-1ersj3w{float:right;margin-right:45px}.fontStyle.svelte-1ersj3w.svelte-1ersj3w{width:100px;float:right;margin-right:60px}.fraction_slash.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:177px}.minus_tab.svelte-1ersj3w.svelte-1ersj3w,.plus_tab.svelte-1ersj3w.svelte-1ersj3w,.slash_tab.svelte-1ersj3w.svelte-1ersj3w{text-align:center}.gridded_tab.svelte-1ersj3w.svelte-1ersj3w{background-color:#f0f0f0;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.font_size_label.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:198px}.font_size.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:225px}.decimal_col.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:208px;width:90px}.correct_color.svelte-1ersj3w.svelte-1ersj3w{background-color:#E9FFE9}.fixed_decimal_check.svelte-1ersj3w.svelte-1ersj3w{position:relative;top:26px;left:13px}.correct_incorrect_icon_fill.svelte-1ersj3w.svelte-1ersj3w{position:relative;width:19px;height:19px;right:121px;top:-55px;background:white;border-radius:50%}.row_column_decimal.svelte-1ersj3w.svelte-1ersj3w{position:relative;top:30px;left:5px}.fixed_point_class.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:7px}.row_column.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:5px}.answer_icon.svelte-1ersj3w.svelte-1ersj3w{position:absolute;top:7px;right:34px}.myP.svelte-1ersj3w tbody.svelte-1ersj3w{cursor:pointer}.col_range.svelte-1ersj3w.svelte-1ersj3w{width:205px}.posSize.svelte-1ersj3w.svelte-1ersj3w{position:relative;left:7px}.fontSmall.svelte-1ersj3w.svelte-1ersj3w{font-size:12px;text-align:center}.fontNormal.svelte-1ersj3w.svelte-1ersj3w{font-size:14px;text-align:center}.fontLarge.svelte-1ersj3w.svelte-1ersj3w{font-size:24px;text-align:center}.fontExtraLarge.svelte-1ersj3w.svelte-1ersj3w{font-size:26px;text-align:center}.grid.svelte-1ersj3w.svelte-1ersj3w{position:relative;top:10px;box-shadow:10px 5px 10px #000}.items_element{border:1px solid #8080807a;padding:6px 10px;border-radius:50%;background-color:white}.griddedModule .active{color:white;transition:1s;background:#696969;border:2px solid #fff}.minus_point.svelte-1ersj3w.svelte-1ersj3w,.decl_point.svelte-1ersj3w.svelte-1ersj3w{padding:6px 12px}.sla_point.svelte-1ersj3w.svelte-1ersj3w{padding:6px 11px}.griddedModule.svelte-1ersj3w table tr td.svelte-1ersj3w:last-child{border-right:1px solid #ccc !important}.griddedModule.svelte-1ersj3w .lastGrid tr:last-child td.svelte-1ersj3w{border-bottom:1px solid #ccc !important}.griddedModule.svelte-1ersj3w td.svelte-1ersj3w{border:1px solid #f0f0f0 !important;border-left:1px solid #ccc !important}.token.svelte-1ersj3w.svelte-1ersj3w:hover{border:1px solid #000 !important}.bla .token:hover{border:1px solid #fff !important}.token_selected.svelte-1ersj3w.svelte-1ersj3w{background-color:#64bb63;color:#fff}.bla .token_highlight_heading{color:#000 !important}.griddedModule.svelte-1ersj3w .expandIcon.svelte-1ersj3w{font-size:27px;font-weight:bold;color:#1877b1}",o(F.head,l)),t(this,e,K,O,s,{isReview:0,xml:14,showAns:15},[-1,-1])}}
//# sourceMappingURL=GriddedPreview-2878cdf5.js.map
