import{S as t,i as e,s as n,D as l,q as a,h as o,o as i,c as s,b as r,m as c,t as d,a as m,d as p,e as u,f as g,j as f,z as b,g as h,k as x,n as v,p as _,A as w,C as k,B as y,w as $,X as N,W as L,Y as A,l as C,y as T,r as I,u as M}from"./main-e1047681.js";import{I as z}from"./ItemHelper-dc05db53.js";import{G as F}from"./GriddedHelper-0a642376.js";function P(t){l(t,"svelte-2kbm1c",".layoutHeading{font-weight:bold;font-size:16px;color:#1877b1}.items_element:hover{border:1.2px solid #777}.moreOptions{-webkit-box-shadow:3px 4px 6px #c4c5c5;-moz-box-shadow:3px 4px 6px #c4c5c5;box-shadow:3px 4px 6px #c4c5c5;background-color:#f0f0f0;border-top:1px solid #1877b1;border-bottom:1px solid #1877b1}.moreOptionDetails{background-color:#f7f7f7}.input_col{position:relative;left:5px}.layoutheading{padding:5px;font-size:20px;font-weight:bold}.numbr_range{position:relative;left:130px}.numbr_range_txt{position:relative;left:200px}.plus_minus_fraction{position:relative;top:20px}.floating_fraction{position:relative;top:27px}.plus_minus_span{position:relative;left:5px}.floating_decimal{float:right;margin-right:45px}.fontStyle{width:100px;float:right;margin-right:60px}.fraction_slash{position:relative;left:177px}.minus_tab,.plus_tab.svelte-2kbm1c,.slash_tab.svelte-2kbm1c{text-align:center}.gridded_tab{background-color:#f0f0f0!important;user-select:none!important;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.font_size_label{position:relative;left:198px}.font_size{position:relative;left:225px}.decimal_col{position:relative;left:208px;width:90px}.correct_color{background-color:#E9FFE9}.fixed_decimal_check{position:relative;top:26px;left:13px}.correct_incorrect_icon_fill{position:relative;width:19px;height:19px;right:121px;top:-55px;background:white;border-radius:50%}.row_column_decimal{position:relative;top:30px;left:5px}.fixed_point_class{position:relative;left:7px}.row_column{position:relative;left:5px}.answer_icon{position:absolute;top:6px;right:31px}.myP tbody{cursor:pointer}.col_range{width:205px}.posSize{position:relative;left:7px}.fontSmall{font-size:12px;text-align:center}.fontNormal{font-size:14px;text-align:center}.fontLarge{font-size:24px;text-align:center}.fontExtraLarge{font-size:26px;text-align:center}.grid{position:relative;top:10px;box-shadow:10px 5px 10px #000}.items_element{border:1px solid #8080807a;padding:6px 10px;border-radius:50%;background-color:white}.griddedModule .active{color:white;transition:1s;background:#696969;border:2px solid #fff}.minus_point,.decl_point.svelte-2kbm1c{padding:6px 12px}.sla_point{padding:6px 11px}.griddedModule table tr td:last-child{border-right:1px solid #ccc !important}.griddedModule .lastGrid tr:last-child td{border-bottom:1px solid #ccc !important}.griddedModule td{border:1px solid #f0f0f0 !important;border-left:1px solid #ccc !important}.token:hover{border:1px solid #000 !important}.bla .token:hover{border:1px solid #fff !important}.token_selected{background-color:#64bb63;color:#fff}.bla .token_highlight_heading{color:#000 !important}.griddedModule .expandIcon{font-size:27px;font-weight:bold;color:#1877b1}table td{padding:.5rem .5rem!important;vertical-align:top!important;border-top:1px solid #dee2e6!important}table th{padding:.5rem .5rem!important;vertical-align:top!important;border-top:1px solid #dee2e6!important}")}function E(t,e,n){const l=t.slice();return l[43]=e[n],l[45]=n,l}function H(t,e,n){const l=t.slice();return l[46]=e[n],l[48]=n,l}function S(t,e,n){const l=t.slice();return l[46]=e[n],l[48]=n,l}function B(t){let e,n,l,s,c,d,m,p,f,b,h=null!=t[1][t[48]]&&" "!=t[1][t[48]]&&j(t);return{c(){e=u("input"),m=r(),h&&h.c(),p=a(),g(e,"type","text"),g(e,"id",n=t[46].id),g(e,"data-tag",l=t[46].dataTag),g(e,"name",s=t[46].name),g(e,"style",c="width:50px;text-align:center;"),e.value=d=void 0===t[1][t[48]]?"":t[1][t[48]],g(e,"class","tdFont")},m(n,l){o(n,e,l),o(n,m,l),h&&h.m(n,l),o(n,p,l),f||(b=[C(e,"change",t[13]),C(e,"input",J)],f=!0)},p(t,a){8&a[0]&&n!==(n=t[46].id)&&g(e,"id",n),8&a[0]&&l!==(l=t[46].dataTag)&&g(e,"data-tag",l),8&a[0]&&s!==(s=t[46].name)&&g(e,"name",s),2&a[0]&&d!==(d=void 0===t[1][t[48]]?"":t[1][t[48]])&&e.value!==d&&(e.value=d),null!=t[1][t[48]]&&" "!=t[1][t[48]]?h?h.p(t,a):(h=j(t),h.c(),h.m(p.parentNode,p)):h&&(h.d(1),h=null)},d(t){t&&i(e),t&&i(m),h&&h.d(t),t&&i(p),f=!1,T(b)}}}function R(t){let e,n;return{c(){e=u("input"),g(e,"type","text"),g(e,"style",n="width:50px;text-align:center;"),e.value=".",e.disabled="true",g(e,"class","tdFont")},m(t,n){o(t,e,n)},p:I,d(t){t&&i(e)}}}function j(t){let e,n,l,a,s;return{c(){e=u("span"),n=u("span"),a=r(),g(n,"id",l=t[46].spanid),g(n,"class","answer_icon"),g(e,"class",s=A(t[2].iconVisible+" relative")+" svelte-2kbm1c")},m(t,l){o(t,e,l),f(e,n),f(e,a)},p(t,a){8&a[0]&&l!==(l=t[46].spanid)&&g(n,"id",l),4&a[0]&&s!==(s=A(t[2].iconVisible+" relative")+" svelte-2kbm1c")&&g(e,"class",s)},d(t){t&&i(e)}}}function G(t){let e;function n(t,e){return 1==t[46].decpoint?R:B}let l=n(t),s=l(t);return{c(){s.c(),e=a()},m(t,n){s.m(t,n),o(t,e,n)},p(t,a){l===(l=n(t))&&s?s.p(t,a):(s.d(1),s=l(t),s&&(s.c(),s.m(e.parentNode,e)))},d(t){s.d(t),t&&i(e)}}}function V(t){let e,n,l,a;return e=new F({props:{loop:t[8],class1:"tdFont plus_tab",className:"tdFontP plus_tab items_element",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP w-auto",value:"+"}}),e.$on("handleClickCombo",t[12]),l=new F({props:{loop:t[9],class1:"tdFont plus_tab",className:"tdFontP plus_tab items_element minus_point",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP w-auto",value:"-"}}),l.$on("handleClickCombo",t[12]),{c(){s(e.$$.fragment),n=r(),s(l.$$.fragment)},m(t,i){c(e,t,i),o(t,n,i),c(l,t,i),a=!0},p(t,n){const a={};256&n[0]&&(a.loop=t[8]),e.$set(a);const o={};512&n[0]&&(o.loop=t[9]),l.$set(o)},i(t){a||(d(e.$$.fragment,t),d(l.$$.fragment,t),a=!0)},o(t){m(e.$$.fragment,t),m(l.$$.fragment,t),a=!1},d(t){p(e,t),t&&i(n),p(l,t)}}}function X(t){let e,n;return e=new F({props:{loop:t[6],class1:"tdFont points",className:"tdFontP text-center items_element sla_point",tableId:"tdFontP slash_tab",tableClass:"slash_tab gridded_tab mt-0 w-auto",value:"/"}}),e.$on("handleClickCombo",t[12]),{c(){s(e.$$.fragment)},m(t,l){c(e,t,l),n=!0},p(t,n){const l={};64&n[0]&&(l.loop=t[6]),e.$set(l)},i(t){n||(d(e.$$.fragment,t),n=!0)},o(t){m(e.$$.fragment,t),n=!1},d(t){p(e,t)}}}function q(t){let e,n;return e=new F({props:{loop:t[7],class1:"tdFont points",className:"tdFontP text-center items_element decl_point",tableId:"slash_tab",tableClass:"slash_tab gridded_tab mt-0 mb-0 myP w-auto",value:"."}}),e.$on("handleClickCombo",t[12]),{c(){s(e.$$.fragment)},m(t,l){c(e,t,l),n=!0},p(t,n){const l={};128&n[0]&&(l.loop=t[7]),e.$set(l)},i(t){n||(d(e.$$.fragment,t),n=!0)},o(t){m(e.$$.fragment,t),n=!1},d(t){p(e,t)}}}function D(t){let e,n,l,a,s,r,c,d,m,p,b=+t[45]+"";return{c(){e=u("td"),n=u("span"),l=M(b),g(n,"tabindex",a=t[46].tabIndex),g(n,"key",s=t[46].key),g(n,"name",r=t[46].name),g(n,"data-tag",c=t[46].dataTag),g(n,"class","tdFontP text-center td_data algn items_element"),g(n,"id",d=t[46].id),g(e,"width","50"),g(e,"class","text-center")},m(a,i){o(a,e,i),f(e,n),f(n,l),m||(p=C(n,"click",t[11]),m=!0)},p(t,e){32&e[0]&&a!==(a=t[46].tabIndex)&&g(n,"tabindex",a),32&e[0]&&s!==(s=t[46].key)&&g(n,"key",s),32&e[0]&&r!==(r=t[46].name)&&g(n,"name",r),32&e[0]&&c!==(c=t[46].dataTag)&&g(n,"data-tag",c),32&e[0]&&d!==(d=t[46].id)&&g(n,"id",d)},d(t){t&&i(e),m=!1,p()}}}function O(t){let e,n;return{c(){e=u("td"),g(e,"key",n=t[46].key),g(e,"class","tdFont text-center"),g(e,"width","50"),g(e,"disabled","true")},m(t,n){o(t,e,n)},p(t,l){32&l[0]&&n!==(n=t[46].key)&&g(e,"key",n)},d(t){t&&i(e)}}}function W(t){let e;function n(t,e){return t[46].decpoint?O:D}let l=n(t),s=l(t);return{c(){s.c(),e=a()},m(t,n){s.m(t,n),o(t,e,n)},p(t,a){l===(l=n(t))&&s?s.p(t,a):(s.d(1),s=l(t),s&&(s.c(),s.m(e.parentNode,e)))},d(t){s.d(t),t&&i(e)}}}function Y(t){let e,n,l,a=t[5],s=[];for(let e=0;e<a.length;e+=1)s[e]=W(H(t,a,e));return{c(){e=u("tr");for(let t=0;t<s.length;t+=1)s[t].c();n=r(),g(e,"key",l=t[43].key)},m(t,l){o(t,e,l);for(let t=0;t<s.length;t+=1)s[t].m(e,null);f(e,n)},p(t,o){if(2080&o[0]){let l;for(a=t[5],l=0;l<a.length;l+=1){const i=H(t,a,l);s[l]?s[l].p(i,o):(s[l]=W(i),s[l].c(),s[l].m(e,n))}for(;l<s.length;l+=1)s[l].d(1);s.length=a.length}16&o[0]&&l!==(l=t[43].key)&&g(e,"key",l)},d(t){t&&i(e),b(s,t)}}}function Z(t){let e,n,l,a,_,w,k,y,$,N,L,A,C,T,I,M;_=new z({props:{handleReviewClick:t[14],reviewMode:t[0],customReviewMode:t[10]}});let F=t[3],P=[];for(let e=0;e<F.length;e+=1)P[e]=G(S(t,F,e));let H=1==t[2].plus_minus&&V(t),B=1==t[2].slash_val&&X(t),R=1==t[2].decimal_val&&q(t),j=t[4],D=[];for(let e=0;e<j.length;e+=1)D[e]=Y(E(t,j,e));return{c(){e=u("main"),n=u("center"),l=u("div"),a=u("center"),s(_.$$.fragment),w=r(),k=u("table"),y=u("tr");for(let t=0;t<P.length;t+=1)P[t].c();N=r(),H&&H.c(),L=r(),B&&B.c(),A=r(),R&&R.c(),C=r(),T=u("table"),I=u("tbody");for(let t=0;t<D.length;t+=1)D[t].c();h(y,"display","flex"),h(y,"padding","0"),g(k,"border","1"),g(k,"id","tab2"),g(k,"class","w-auto"),g(k,"style",$="border-collapse:collapse;text-align:center"),g(T,"id","gridded_sheet"),g(T,"class","gridded_tab mt-0 lastGrid create_tab myP w-auto"),g(l,"class","griddedModule")},m(t,i){o(t,e,i),f(e,n),f(n,l),f(l,a),c(_,a,null),f(l,w),f(l,k),f(k,y);for(let t=0;t<P.length;t+=1)P[t].m(y,null);f(l,N),H&&H.m(l,null),f(l,L),B&&B.m(l,null),f(l,A),R&&R.m(l,null),f(l,C),f(l,T),f(T,I);for(let t=0;t<D.length;t+=1)D[t].m(I,null);M=!0},p(t,e){const n={};if(1&e[0]&&(n.reviewMode=t[0]),_.$set(n),8206&e[0]){let n;for(F=t[3],n=0;n<F.length;n+=1){const l=S(t,F,n);P[n]?P[n].p(l,e):(P[n]=G(l),P[n].c(),P[n].m(y,null))}for(;n<P.length;n+=1)P[n].d(1);P.length=F.length}if(1==t[2].plus_minus?H?(H.p(t,e),4&e[0]&&d(H,1)):(H=V(t),H.c(),d(H,1),H.m(l,L)):H&&(x(),m(H,1,1,(()=>{H=null})),v()),1==t[2].slash_val?B?(B.p(t,e),4&e[0]&&d(B,1)):(B=X(t),B.c(),d(B,1),B.m(l,A)):B&&(x(),m(B,1,1,(()=>{B=null})),v()),1==t[2].decimal_val?R?(R.p(t,e),4&e[0]&&d(R,1)):(R=q(t),R.c(),d(R,1),R.m(l,C)):R&&(x(),m(R,1,1,(()=>{R=null})),v()),2096&e[0]){let n;for(j=t[4],n=0;n<j.length;n+=1){const l=E(t,j,n);D[n]?D[n].p(l,e):(D[n]=Y(l),D[n].c(),D[n].m(I,null))}for(;n<D.length;n+=1)D[n].d(1);D.length=j.length}},i(t){M||(d(_.$$.fragment,t),d(H),d(B),d(R),M=!0)},o(t){m(_.$$.fragment,t),m(H),m(B),m(R),M=!1},d(t){t&&i(e),p(_),b(P,t),H&&H.d(),B&&B.d(),R&&R.d(),b(D,t)}}}function J(t){let e=t.target.getAttribute("name"),n=document.getElementsByName(e);for(let e=1;e<n.length;e++)n[e].classList.contains("active")&&n[e].classList.remove("active"),n[e].innerHTML==t.target.value&&n[e].classList.add("active")}function K(t,e,n){let l,a,{isReview:o}=e,{xml:i}=e,{showAns:s}=e,{uxml:r}=e,{editorState:c}=e,d=o,m=" ",p=[],u=[],g=[],f=0,b="",h=$({rowNum:4,colNum:4,item:1,plus_minus:0,slash_val:0,decimal_val:0,xml:"",textSizeP:0,correctAns:[],userList:[],isMathquill:!1,smController:"h",pointerEvents:"auto",decimal_point:0,iconVisible:"h"}),x={};h.subscribe((t=>{n(2,x=t)}));function v(t){!function(t){try{n(2,x.rowNum=t.smxml._row,x),n(2,x.colNum=t.smxml._col,x),n(2,x.slash_val=t.smxml._slash,x),n(2,x.plus_minus=t.smxml._plusminus,x),n(2,x.decimal_val=t.smxml._decimal,x),n(2,x.textSizeP=t.smxml._font,x),n(2,x.correctAns=t.smxml._correctAns.split(","),x),n(2,x.decimal_point=t.smxml._fixed_point,x),r&&function(t){let e=N(t);e.smans&&e.smans.div&&e.smans.div._userAns&&(p=e.smans.div._userAns.split(","),m=e.smans.div._correct,u=p,n(2,x.userList=p,x))}(r)}catch(t){console.log({error:t.message,"function name":"parseXMLPreview","File name":"GriddedPreview.js"})}}(t=N(t))}function A(t){let e,o,i,d=t.target.attributes.getNamedItem("data-tag").value;""===t.target.innerHTML?p[d]=t.target.value:p[d]=t.target.innerHTML;for(let t=0;t<p.length;t++)void 0!==p[t]&&""!=p[t]||(p[t]="%blank%");"%blank%"==p[p.length-1]&&p.pop(),n(2,x.userList=p,x),l=x.correctAns;let u=x.userList;if(u.length==l.length){for(let t=0;t<l.length;t++)u[t]==l[t]&&f++;f==u.length?(e=y.correct,b=!0,f=0):(e=y.incorrect,b=!1,f=0)}else e=y.incorrect;c&&s(e),i="Correct"==e,a="<smans><div type='56' correct='"+b+"' userAns='"+x.userList+"'></div></smans>",o="<smans><div type='56' correct='"+b+"' userAns='"+x.userList+"'></div></smans>"," "!=m&&f==u.length?w.select("#answer","attr",{checked:m}):w.select("#answer","attr",{checked:b}),n(15,r=a),L({uXml:o,ans:i})}_((()=>{w.listen(document,"keydown",".td_data",((t,e)=>{13===e.which&&t.click()})),w.listen(document,"click","#sm_controller button",(t=>{w.selectAll("#sm_controller button","removeClass",["active,btn-secondary,text-white,bg-secondary"]),w.selectAll(t,"addClass",["active,btn-secondary,text-white,bg-secondary"])})),w.listen(document,"click","#set-review",(function(){F()})),w.listen(document,"click","#unset-review",(function(){P()}))})),k((()=>{i!=x.xml&&(n(2,x.xml=i,x),v(i)),i&&console.log("qxml"),function(){n(3,C=[]);let t=x.decimal_point;for(let e=0;e<x.colNum;e++)"%blank%"===u[e]?n(1,g[e]=" ",g):n(1,g[e]=u[e],g),e==t-1&&0!=t?n(3,C=[...C,{decpoint:!0}]):C.length<x.colNum&&n(3,C=[...C,{id:"t"+e,dataTag:e,name:"p"+e,value:g[e],spanid:"t_"+e,decpoint:!1}])}(),function(t){n(7,z=[]);let e=x.decimal_point;for(let t=0;t<x.colNum;t++)t==e-1&&0!=e?n(7,z=[...z,{key:"col"+t,decpoint:!0}]):z.length<x.colNum&&n(7,z=[...z,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}])}(),function(t){n(6,M=[]);let e=x.decimal_point;for(let t=0;t<x.colNum;t++)t==e-1&&0!=e?n(6,M=[...M,{key:"col"+t,decpoint:!0}]):M.length<x.colNum&&n(6,M=[...M,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}])}(),function(t){n(8,H=[]),n(9,S=[]);let e=x.decimal_point;for(let t=0;t<x.colNum;t++)t==e-1&&0!=e?n(8,H=[...H,{dataTag:t,name:t,decpoint:!0}]):H.length<x.colNum&&n(8,H=[...H,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}]),t==e-1&&0!=e?n(9,S=[...S,{dataTag:t,name:t,decpoint:!0}]):S.length<x.colNum&&n(9,S=[...S,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}])}(),function(){n(4,T=[]);let t=x.decimal_point;for(let e=0;e<x.rowNum;e++){n(5,I=[]);for(let l=0;l<x.colNum;l++)l==t-1&&0!=t?n(5,I=[...I,{key:"col"+e+l,decpoint:!0}]):I.length<x.colNum&&n(5,I=[...I,{tabIndex:0,key:"col"+e+l,name:"p"+l,dataTag:l,id:"t"+l+"-"+e+l,decpoint:!1}]);n(4,T=[...T,{key:"row"+e}])}}()}));let C=[];let T=[],I=[];let M=[];let z=[];function F(){n(2,x.smController="",x),n(2,x.pointerEvents="none",x),n(0,o=!0),E("yans","showIcon"),w.selectAll("#sm_controller .your-ans","addClass",["btn-light","active"]),w.selectAll(".tokenHeader","attr",{tabindex:0}),setTimeout(function(){for(let t=0;t<x.correctAns.length;t++)x.correctAns[t]==x.userList[t]?(w.select("#t_"+t,"removeClass","icomoon-new-24px-cancel-circle-1"),w.select("#t_"+t,"addClass","icomoon-new-24px-checkmark-circle-1")):(w.select("#t_"+t,"removeClass","icomoon-new-24px-checkmark-circle-1"),w.select("#t_"+t,"addClass","icomoon-new-24px-cancel-circle-1"))}(),200),c&&s(b?y.correct:y.incorrect)}function P(){n(2,x.smController="h",x),n(2,x.pointerEvents="auto",x),n(0,o=!1),E("yans","hideIcon"),w.selectAll(".tokenHeader","removeAttr","tabindex")}function E(t,e){if(n(2,x.iconVisible="showIcon"==e?"":"h",x),"cans"==t){document.getElementsByClassName("gridded_tab").disabled=!0,u=x.correctAns}else"yans"==t&&(u=p)}let H=[],S=[];return t.$$set=t=>{"isReview"in t&&n(0,o=t.isReview),"xml"in t&&n(16,i=t.xml),"showAns"in t&&n(17,s=t.showAns),"uxml"in t&&n(15,r=t.uxml),"editorState"in t&&n(18,c=t.editorState)},t.$$.update=()=>{1&t.$$.dirty[0]&&(o?F():P())},[o,g,x,C,T,I,M,z,H,S,d,function(t){let e=t.target.getAttribute("name"),n=document.getElementsByName(e);for(let t=0;t<n.length;t++)n[t].classList.contains("active")&&n[t].classList.remove("active");t.target.classList.add("active");let l=t.target.id.split("-");document.getElementById(l[0]).value=t.target.innerHTML,A(t)},function(t){let e=t.detail.target.getAttribute("name"),o=document.getElementsByName(e);for(let t=0;t<o.length;t++)o[t].classList.contains("active")&&o[t].classList.remove("active");t.detail.target.classList.add("active");let i=t.detail.target.id.split("-");document.getElementById(i[0]).value=t.detail.target.innerHTML,function(t){let e,o,i,d=t.detail.target.attributes.getNamedItem("data-tag").value;""===t.detail.target.innerHTML?p[d]=t.detail.target.value:p[d]=t.detail.target.innerHTML;for(let t=0;t<p.length;t++)void 0!==p[t]&&""!=p[t]||(p[t]="%blank%");"%blank%"==p[p.length-1]&&p.pop();n(2,x.userList=p,x),l=x.correctAns;let u=x.userList;if(u.length==l.length){for(let t=0;t<l.length;t++)u[t]==l[t]&&f++;f==u.length?(e=y.correct,b=!0,f=0):(e=y.incorrect,b=!1,f=0)}else e=y.incorrect;c&&s(e);i="Correct"==e,a="<smans><div type='56' correct='"+b+"' userAns='"+x.userList+"'></div></smans>",o="<smans><div type='56' correct='"+b+"' userAns='"+x.userList+"'></div></smans>"," "!=m&&f==u.length?w.select("#answer","attr",{checked:m}):w.select("#answer","attr",{checked:b});n(15,r=a),L({uXml:o,ans:i})}(t)},function(t){let e=x.rowNum-1;return/[a-z A-Z *%&$!@#=,"";:`~|)(?]/.test(t.target.value)?(w.alert("Not allowed alphabets and special symbols"),t.target.value="",!1):t.target.value.length>1?(w.alert("Double digit not accepted"),t.target.value="",!1):t.target.value<0?(w.alert("Less then 1 not accepted"),t.target.value="",!1):e<t.target.value?(w.alert("Number insert only 0 to "+x.rowNum),t.target.value="",!1):void A(t)},function(t){"c"==t?E("cans","hideIcon"):E("yans","showIcon")},r,i,s,c]}export default class extends t{constructor(t){super(),e(this,t,K,Z,n,{isReview:0,xml:16,showAns:17,uxml:15,editorState:18},P,[-1,-1])}}
//# sourceMappingURL=GriddedPreview-5173653a.js.map
