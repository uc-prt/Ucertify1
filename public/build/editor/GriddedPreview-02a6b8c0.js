import{S as t,i as e,s as n,F as l,e as o,j as a,q as i,h as s,o as r,c,b as d,m,t as p,a as u,d as g,f,D as x,g as h,k as b,n as _,p as v,A as w,E as y,C as k,w as $,X as N,R as L,l as A,y as C,r as I,u as T}from"./main-daecf310.js";import{I as F}from"./ItemHelper-f40df82d.js";import{G as M}from"./GriddedHelper-145242d0.js";const{document:E}=l;function P(t,e,n){const l=t.slice();return l[45]=e[n],l[47]=n,l}function z(t,e,n){const l=t.slice();return l[42]=e[n],l[44]=n,l}function H(t,e,n){const l=t.slice();return l[45]=e[n],l[47]=n,l}function S(t){let e,n,l,i,c,m,p,u,g,x,h,b,_,v;return{c(){e=o("input"),p=d(),u=o("span"),g=o("span"),h=d(),f(e,"type","text"),f(e,"id",n=t[45].id),f(e,"data-tag",l=t[45].dataTag),f(e,"name",i=t[45].name),f(e,"style",c="width:50px;text-align:center;"),e.value=m=void 0===t[1][t[47]]?" ":t[1][t[47]],f(e,"class","tdFont"),f(g,"id",x=t[45].spanid),f(g,"class","answer_icon"),f(u,"class",b=t[2].iconVisible+" relative")},m(n,l){s(n,e,l),s(n,p,l),s(n,u,l),a(u,g),a(u,h),_||(v=[A(e,"change",t[12]),A(e,"input",K)],_=!0)},p(t,o){8&o[0]&&n!==(n=t[45].id)&&f(e,"id",n),8&o[0]&&l!==(l=t[45].dataTag)&&f(e,"data-tag",l),8&o[0]&&i!==(i=t[45].name)&&f(e,"name",i),2&o[0]&&m!==(m=void 0===t[1][t[47]]?" ":t[1][t[47]])&&e.value!==m&&(e.value=m),8&o[0]&&x!==(x=t[45].spanid)&&f(g,"id",x),4&o[0]&&b!==(b=t[2].iconVisible+" relative")&&f(u,"class",b)},d(t){t&&r(e),t&&r(p),t&&r(u),_=!1,C(v)}}}function B(t){let e,n;return{c(){e=o("input"),f(e,"type","text"),f(e,"style",n="width:50px;text-align:center;"),e.value=".",e.disabled="true",f(e,"class","tdFont")},m(t,n){s(t,e,n)},p:I,d(t){t&&r(e)}}}function R(t){let e;function n(t,e){return 1==t[45].decpoint?B:S}let l=n(t),o=l(t);return{c(){o.c(),e=i()},m(t,n){o.m(t,n),s(t,e,n)},p(t,a){l===(l=n(t))&&o?o.p(t,a):(o.d(1),o=l(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&r(e)}}}function j(t){let e,n,l,o;return e=new M({props:{loop:t[8],class1:"tdFont plus_tab",className:"tdFontP plus_tab items_element",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP",value:"+"}}),e.$on("handleClickCombo",t[11]),l=new M({props:{loop:t[9],class1:"tdFont plus_tab",className:"tdFontP plus_tab items_element minus_point",tableId:"plus_minus_tab",tableClass:"plus_minus_tab gridded_tab mt-0 myP",value:"-"}}),l.$on("handleClickCombo",t[11]),{c(){c(e.$$.fragment),n=d(),c(l.$$.fragment)},m(t,a){m(e,t,a),s(t,n,a),m(l,t,a),o=!0},p(t,n){const o={};256&n[0]&&(o.loop=t[8]),e.$set(o);const a={};512&n[0]&&(a.loop=t[9]),l.$set(a)},i(t){o||(p(e.$$.fragment,t),p(l.$$.fragment,t),o=!0)},o(t){u(e.$$.fragment,t),u(l.$$.fragment,t),o=!1},d(t){g(e,t),t&&r(n),g(l,t)}}}function G(t){let e,n;return e=new M({props:{loop:t[7],class1:"tdFont points",className:"tdFontP text-center items_element decl_point",tableId:"slash_tab",tableClass:"slash_tab gridded_tab mt-0 mb-0 myP",value:"."}}),e.$on("handleClickCombo",t[11]),{c(){c(e.$$.fragment)},m(t,l){m(e,t,l),n=!0},p(t,n){const l={};128&n[0]&&(l.loop=t[7]),e.$set(l)},i(t){n||(p(e.$$.fragment,t),n=!0)},o(t){u(e.$$.fragment,t),n=!1},d(t){g(e,t)}}}function V(t){let e,n;return e=new M({props:{loop:t[6],class1:"tdFont points",className:"tdFontP text-center items_element sla_point",tableId:"tdFontP slash_tab",tableClass:"slash_tab gridded_tab mt-0",value:"/"}}),e.$on("handleClickCombo",t[11]),{c(){c(e.$$.fragment)},m(t,l){m(e,t,l),n=!0},p(t,n){const l={};64&n[0]&&(l.loop=t[6]),e.$set(l)},i(t){n||(p(e.$$.fragment,t),n=!0)},o(t){u(e.$$.fragment,t),n=!1},d(t){g(e,t)}}}function q(t){let e,n,l,i,c,d,m,p,u,g,x=+t[44]+"";return{c(){e=o("td"),n=o("span"),l=T(x),f(n,"tabindex",i=t[45].tabIndex),f(n,"key",c=t[45].key),f(n,"name",d=t[45].name),f(n,"data-tag",m=t[45].dataTag),f(n,"class","tdFontP text-center td_data algn items_element"),f(n,"id",p=t[45].id),f(e,"width","50"),f(e,"class","text-center")},m(o,i){s(o,e,i),a(e,n),a(n,l),u||(g=A(n,"click",t[10]),u=!0)},p(t,e){32&e[0]&&i!==(i=t[45].tabIndex)&&f(n,"tabindex",i),32&e[0]&&c!==(c=t[45].key)&&f(n,"key",c),32&e[0]&&d!==(d=t[45].name)&&f(n,"name",d),32&e[0]&&m!==(m=t[45].dataTag)&&f(n,"data-tag",m),32&e[0]&&p!==(p=t[45].id)&&f(n,"id",p)},d(t){t&&r(e),u=!1,g()}}}function D(t){let e,n;return{c(){e=o("td"),f(e,"key",n=t[45].key),f(e,"class","tdFont text-center"),f(e,"width","50"),f(e,"disabled","true")},m(t,n){s(t,e,n)},p(t,l){32&l[0]&&n!==(n=t[45].key)&&f(e,"key",n)},d(t){t&&r(e)}}}function X(t){let e;function n(t,e){return t[45].decpoint?D:q}let l=n(t),o=l(t);return{c(){o.c(),e=i()},m(t,n){o.m(t,n),s(t,e,n)},p(t,a){l===(l=n(t))&&o?o.p(t,a):(o.d(1),o=l(t),o&&(o.c(),o.m(e.parentNode,e)))},d(t){o.d(t),t&&r(e)}}}function O(t){let e,n,l,i=t[5],c=[];for(let e=0;e<i.length;e+=1)c[e]=X(P(t,i,e));return{c(){e=o("tr");for(let t=0;t<c.length;t+=1)c[t].c();n=d(),f(e,"key",l=t[42].key)},m(t,l){s(t,e,l);for(let t=0;t<c.length;t+=1)c[t].m(e,null);a(e,n)},p(t,o){if(1056&o[0]){let l;for(i=t[5],l=0;l<i.length;l+=1){const a=P(t,i,l);c[l]?c[l].p(a,o):(c[l]=X(a),c[l].c(),c[l].m(e,n))}for(;l<c.length;l+=1)c[l].d(1);c.length=i.length}16&o[0]&&l!==(l=t[42].key)&&f(e,"key",l)},d(t){t&&r(e),x(c,t)}}}function J(t){let e,n,l,i,v,w,y,k,$,N,L,A,C,I,T,M;v=new F({props:{handleReviewClick:t[13],reviewMode:t[0]}});let E=t[3],P=[];for(let e=0;e<E.length;e+=1)P[e]=R(H(t,E,e));let S=1==t[2].plus_minus&&j(t),B=1==t[2].decimal_val&&G(t),q=1==t[2].slash_val&&V(t),D=t[4],X=[];for(let e=0;e<D.length;e+=1)X[e]=O(z(t,D,e));return{c(){e=o("main"),n=o("center"),l=o("div"),i=o("center"),c(v.$$.fragment),w=d(),y=o("table"),k=o("tr");for(let t=0;t<P.length;t+=1)P[t].c();N=d(),S&&S.c(),L=d(),B&&B.c(),A=d(),q&&q.c(),C=d(),I=o("table"),T=o("tbody");for(let t=0;t<X.length;t+=1)X[t].c();h(k,"display","flex"),f(y,"border","1"),f(y,"id","tab2"),f(y,"style",$="border-collapse:collapse;text-align:center"),f(I,"id","gridded_sheet"),f(I,"class","gridded_tab mt-0 lastGrid create_tab myP"),f(l,"class","griddedModule")},m(t,o){s(t,e,o),a(e,n),a(n,l),a(l,i),m(v,i,null),a(l,w),a(l,y),a(y,k);for(let t=0;t<P.length;t+=1)P[t].m(k,null);a(l,N),S&&S.m(l,null),a(l,L),B&&B.m(l,null),a(l,A),q&&q.m(l,null),a(l,C),a(l,I),a(I,T);for(let t=0;t<X.length;t+=1)X[t].m(T,null);M=!0},p(t,e){const n={};if(1&e[0]&&(n.reviewMode=t[0]),v.$set(n),4110&e[0]){let n;for(E=t[3],n=0;n<E.length;n+=1){const l=H(t,E,n);P[n]?P[n].p(l,e):(P[n]=R(l),P[n].c(),P[n].m(k,null))}for(;n<P.length;n+=1)P[n].d(1);P.length=E.length}if(1==t[2].plus_minus?S?(S.p(t,e),4&e[0]&&p(S,1)):(S=j(t),S.c(),p(S,1),S.m(l,L)):S&&(b(),u(S,1,1,(()=>{S=null})),_()),1==t[2].decimal_val?B?(B.p(t,e),4&e[0]&&p(B,1)):(B=G(t),B.c(),p(B,1),B.m(l,A)):B&&(b(),u(B,1,1,(()=>{B=null})),_()),1==t[2].slash_val?q?(q.p(t,e),4&e[0]&&p(q,1)):(q=V(t),q.c(),p(q,1),q.m(l,C)):q&&(b(),u(q,1,1,(()=>{q=null})),_()),1072&e[0]){let n;for(D=t[4],n=0;n<D.length;n+=1){const l=z(t,D,n);X[n]?X[n].p(l,e):(X[n]=O(l),X[n].c(),X[n].m(T,null))}for(;n<X.length;n+=1)X[n].d(1);X.length=D.length}},i(t){M||(p(v.$$.fragment,t),p(S),p(B),p(q),M=!0)},o(t){u(v.$$.fragment,t),u(S),u(B),u(q),M=!1},d(t){t&&r(e),g(v),x(P,t),S&&S.d(),B&&B.d(),q&&q.d(),x(X,t)}}}function K(t){let e=t.target.getAttribute("name"),n=document.getElementsByName(e);for(let e=1;e<n.length;e++)n[e].classList.contains("active")&&n[e].classList.remove("active"),n[e].innerHTML==t.target.value&&n[e].classList.add("active")}function Q(t,e,n){let l,o,{isReview:a}=e,{xml:i}=e,{showAns:s}=e,{uxml:r}=e,{editorState:c}=e,d=" ",m=[],p=[],u=[],g=0,f="",x=$({rowNum:4,colNum:4,item:1,plus_minus:0,slash_val:0,decimal_val:0,xml:"",textSizeP:0,correctAns:[],userList:[],isMathquill:!1,smController:"h",pointerEvents:"auto",decimal_point:0,iconVisible:"h"}),h={};x.subscribe((t=>{n(2,h=t)}));function b(t){!function(t){try{n(2,h.rowNum=t.smxml._row,h),n(2,h.colNum=t.smxml._col,h),n(2,h.slash_val=t.smxml._slash,h),n(2,h.plus_minus=t.smxml._plusminus,h),n(2,h.decimal_val=t.smxml._decimal,h),n(2,h.textSizeP=t.smxml._font,h),n(2,h.correctAns=t.smxml._correctAns.split(","),h),n(2,h.decimal_point=t.smxml._fixed_point,h),r&&function(t){let e=N(t);e.smans&&e.smans.div&&e.smans.div._userAns&&(m=e.smans.div._userAns.split(","),d=e.smans.div._correct,p=m)}(r)}catch(t){onError=t,console.log({error:t.message,"function name":"parseXMLPreview","File name":"GriddedPreview.js"})}}(t=N(t))}function _(t){let e,a,i,p=t.target.attributes.getNamedItem("data-tag").value;""===t.target.innerHTML?m[p]=t.target.value:m[p]=t.target.innerHTML;for(let t=0;t<m.length;t++)void 0!==m[t]&&""!=m[t]||(m[t]="%blank%");"%blank%"==m[m.length-1]&&m.pop(),n(2,h.userList=m,h),l=h.correctAns;let u=h.userList;if(u.length==l.length){for(let t=0;t<l.length;t++)u[t]==l[t]&&g++;g==u.length?(e=k.correct,f=!0,g=0):(e=k.incorrect,f=!1,g=0)}else e=k.incorrect;c&&s(e),i="correct"==e,o="<smans><div type='56' correct='"+f+"' userAns='"+h.userList+"'></div></smans>",a="<smans><div type='56' correct='"+f+"' userAns='"+h.userList+"'></div></smans>"," "!=d&&g==u.length?w.select("#answer","attr",{checked:d}):w.select("#answer","attr",{checked:f}),n(14,r=o),L({uXml:a,ans:i})}v((()=>{w.listen(document,"keydown",".td_data",((t,e)=>{13===e.which&&t.click()})),w.listen(document,"click","#sm_controller button",(t=>{w.selectAll("#sm_controller button","removeClass",["active,btn-secondary,text-white,bg-secondary"]),w.selectAll(t,"addClass",["active,btn-secondary,text-white,bg-secondary"])})),w.listen(document,"click","#set-review",(function(){M()})),w.listen(document,"click","#unset-review",(function(){E()}))})),y((()=>{i!=h.xml&&(n(2,h.xml=i,h),b(i)),i&&console.log("qxml"),function(){n(3,A=[]);let t=h.decimal_point;for(let e=0;e<h.colNum;e++)"%blank%"===p[e]?n(1,u[e]=" ",u):n(1,u[e]=p[e],u),e==t-1&&0!=t?n(3,A=[...A,{decpoint:!0}]):A.length<h.colNum&&n(3,A=[...A,{id:"t"+e,dataTag:e,name:"p"+e,value:u[e],spanid:"t_"+e,decpoint:!1}])}(),function(t){n(7,F=[]);let e=h.decimal_point;for(let t=0;t<h.colNum;t++)t==e-1&&0!=e?n(7,F=[...F,{key:"col"+t,decpoint:!0}]):F.length<h.colNum&&n(7,F=[...F,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}])}(),function(t){n(6,T=[]);let e=h.decimal_point;for(let t=0;t<h.colNum;t++)t==e-1&&0!=e?n(6,T=[...T,{key:"col"+t,decpoint:!0}]):T.length<h.colNum&&n(6,T=[...T,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}])}(),function(t){n(8,z=[]),n(9,H=[]);let e=h.decimal_point;for(let t=0;t<h.colNum;t++)t==e-1&&0!=e?n(8,z=[...z,{dataTag:t,name:t,decpoint:!0}]):z.length<h.colNum&&n(8,z=[...z,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}]),t==e-1&&0!=e?n(9,H=[...H,{dataTag:t,name:t,decpoint:!0}]):H.length<h.colNum&&n(9,H=[...H,{id:"t"+t,name:"p"+t,dataTag:t,decpoint:!1}])}(),function(){n(4,C=[]);let t=h.decimal_point;for(let e=0;e<h.rowNum;e++){n(5,I=[]);for(let l=0;l<h.colNum;l++)l==t-1&&0!=t?n(5,I=[...I,{key:"col"+e+l,decpoint:!0}]):I.length<h.colNum&&n(5,I=[...I,{tabIndex:0,key:"col"+e+l,name:"p"+l,dataTag:l,id:"t"+l+"-"+e+l,decpoint:!1}]);n(4,C=[...C,{key:"row"+e}])}}()}));let A=[];let C=[],I=[];let T=[];let F=[];function M(){console.trace(),n(2,h.smController="",h),n(2,h.pointerEvents="none",h),n(0,a=!0),P("yans","showIcon"),w.selectAll("#sm_controller .your-ans","addClass",["btn-light","active"]),w.selectAll(".tokenHeader","attr",{tabindex:0}),setTimeout(function(){for(let t=0;t<h.correctAns.length;t++)h.correctAns[t]==h.userList[t]?(w.select("#t_"+t,"removeClass","icomoon-new-24px-cancel-circle-1"),w.select("#t_"+t,"addClass","icomoon-new-24px-checkmark-circle-1")):(w.select("#t_"+t,"removeClass","icomoon-new-24px-checkmark-circle-1"),w.select("#t_"+t,"addClass","icomoon-new-24px-cancel-circle-1"))}(),200),c&&s(f?k.correct:k.incorrect)}function E(){n(2,h.smController="h",h),n(2,h.pointerEvents="auto",h),n(0,a=!1),P("yans","hideIcon"),w.selectAll(".tokenHeader","removeAttr","tabindex")}function P(t,e){if(n(2,h.iconVisible="showIcon"==e?"":"h",h),"cans"==t){document.getElementsByClassName("gridded_tab").disabled=!0,p=h.correctAns}else"yans"==t&&(p=m)}let z=[],H=[];return t.$$set=t=>{"isReview"in t&&n(0,a=t.isReview),"xml"in t&&n(15,i=t.xml),"showAns"in t&&n(16,s=t.showAns),"uxml"in t&&n(14,r=t.uxml),"editorState"in t&&n(17,c=t.editorState)},t.$$.update=()=>{1&t.$$.dirty[0]&&(a?M():E())},[a,u,h,A,C,I,T,F,z,H,function(t){let e=t.target.getAttribute("name"),n=document.getElementsByName(e);for(let t=0;t<n.length;t++)n[t].classList.contains("active")&&n[t].classList.remove("active");t.target.classList.add("active");let l=t.target.id.split("-");document.getElementById(l[0]).value=t.target.innerHTML,_(t)},function(t){let e=t.detail.target.getAttribute("name"),o=document.getElementsByName(e);for(let t=0;t<o.length;t++)o[t].classList.contains("active")&&o[t].classList.remove("active");t.detail.target.classList.add("active");let a=t.detail.target.id.split("-");document.getElementById(a[0]).value=t.detail.target.innerHTML,function(t){let e,o=t.detail.target.attributes.getNamedItem("data-tag").value;""===t.detail.target.innerHTML?m[o]=t.detail.target.value:m[o]=t.detail.target.innerHTML;for(let t=0;t<m.length;t++)void 0!==m[t]&&""!=m[t]||(m[t]="%blank%");"%blank%"==m[m.length-1]&&m.pop();n(2,h.userList=m,h),l=h.correctAns;let a=h.userList;if(a.length==l.length){for(let t=0;t<l.length;t++)a[t]==l[t]&&g++;g==a.length?(e=k.correct,f=!0,g=0):(e=k.incorrect,f=!1,g=0)}else e=k.incorrect;c&&s(e);w.select("#special_module_user_xml").value="<smans><div type='56' correct='"+f+"' userAns='"+h.userList+"'></div></smans>"," "!=d&&g==a.length?w.select("#answer","attr",{checked:d}):w.select("#answer","attr",{checked:f})}(t)},function(t){let e=h.rowNum-1;return t.target.value.length>1?(w.alert("Double digit not accepted"),t.target.value="",!1):t.target.value<0?(w.alert("Less then 1 not accepted"),t.target.value="",!1):e<t.target.value?(w.alert("Number insert only 0 to "+h.rowNum),t.target.value="",!1):void _(t)},function(t){"c"==t?P("cans","hideIcon"):P("yans","showIcon")},r,i,s,c]}export default class extends t{constructor(t){var l;super(),E.getElementById("svelte-vscbpc-style")||((l=o("style")).id="svelte-vscbpc-style",l.textContent=".layoutHeading{font-weight:bold;font-size:16px;color:#1877b1}.items_element:hover{border:1.2px solid #777}.moreOptions{-webkit-box-shadow:3px 4px 6px #c4c5c5;-moz-box-shadow:3px 4px 6px #c4c5c5;box-shadow:3px 4px 6px #c4c5c5;background-color:#f0f0f0;border-top:1px solid #1877b1;border-bottom:1px solid #1877b1}.moreOptionDetails{background-color:#f7f7f7}.input_col{position:relative;left:5px}.layoutheading{padding:5px;font-size:20px;font-weight:bold}.numbr_range{position:relative;left:130px}.numbr_range_txt{position:relative;left:200px}.plus_minus_fraction{position:relative;top:20px}.floating_fraction{position:relative;top:27px}.plus_minus_span{position:relative;left:5px}.floating_decimal{float:right;margin-right:45px}.fontStyle{width:100px;float:right;margin-right:60px}.fraction_slash{position:relative;left:177px}.minus_tab,\r\n    .plus_tab,\r\n    .slash_tab{text-align:center}.gridded_tab{background-color:#f0f0f0!important;user-select:none!important;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.font_size_label{position:relative;left:198px}.font_size{position:relative;left:225px}.decimal_col{position:relative;left:208px;width:90px}.correct_color{background-color:#E9FFE9}.fixed_decimal_check{position:relative;top:26px;left:13px}.correct_incorrect_icon_fill{position:relative;width:19px;height:19px;right:121px;top:-55px;background:white;border-radius:50%}.row_column_decimal{position:relative;top:30px;left:5px}.fixed_point_class{position:relative;left:7px}.row_column{position:relative;left:5px}.answer_icon{position:absolute;top:7px;right:34px}.myP tbody{cursor:pointer}.col_range{width:205px}.posSize{position:relative;left:7px}.fontSmall{font-size:12px;text-align:center}.fontNormal{font-size:14px;text-align:center}.fontLarge{font-size:24px;text-align:center}.fontExtraLarge{font-size:26px;text-align:center}.grid{position:relative;top:10px;box-shadow:10px 5px 10px #000}.items_element{border:1px solid #8080807a;padding:6px 10px;border-radius:50%;background-color:white}.griddedModule .active{color:white;transition:1s;background:#696969;border:2px solid #fff}.minus_point,\r\n    .decl_point{padding:6px 12px}.sla_point{padding:6px 11px}.griddedModule table tr td:last-child{border-right:1px solid #ccc !important}.griddedModule .lastGrid tr:last-child td{border-bottom:1px solid #ccc !important}.griddedModule td{border:1px solid #f0f0f0 !important;border-left:1px solid #ccc !important}.token:hover{border:1px solid #000 !important}.bla .token:hover{border:1px solid #fff !important}.token_selected{background-color:#64bb63;color:#fff}.bla .token_highlight_heading{color:#000 !important}.griddedModule .expandIcon{font-size:27px;font-weight:bold;color:#1877b1}table td, table th{padding:.5rem .5rem!important;vertical-align:top!important;border-top:1px solid #dee2e6!important}",a(E.head,l)),e(this,t,Q,J,n,{isReview:0,xml:15,showAns:16,uxml:14,editorState:17},[-1,-1])}}
//# sourceMappingURL=GriddedPreview-02a6b8c0.js.map
