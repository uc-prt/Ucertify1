import{S as e,i as t,s as r,q as n,h as o,e as s,b as l,j as c,f as i,g as a,l as d,o as u,y as p,D as m,c as h,u as g,m as f,x as b,t as x,a as C,d as w,p as A,X as k,A as v,C as _,W as y}from"./main-9ba10aee.js";import{I as $}from"./ItemHelper-19045240.js";import{s as P}from"./style-inject.es-1f59c1d0.js";function S(e,t,r){const n=e.slice();return n[36]=t[r],n[38]=r,n}function V(e,t,r){const n=e.slice();return n[39]=t[r],n}function I(e){let t,r=e[2],s=[];for(let t=0;t<r.length;t+=1)s[t]=D(S(e,r,t));return{c(){for(let e=0;e<s.length;e+=1)s[e].c();t=n()},m(e,r){for(let t=0;t<s.length;t+=1)s[t].m(e,r);o(e,t,r)},p(e,n){if(607&n[0]){let o;for(r=e[2],o=0;o<r.length;o+=1){const l=S(e,r,o);s[o]?s[o].p(l,n):(s[o]=D(l),s[o].c(),s[o].m(t.parentNode,t))}for(;o<s.length;o+=1)s[o].d(1);s.length=r.length}},d(e){m(s,e),e&&u(t)}}}function j(e){let t,r=e[1],s=[];for(let t=0;t<r.length;t+=1)s[t]=H(V(e,r,t));return{c(){for(let e=0;e<s.length;e+=1)s[e].c();t=n()},m(e,r){for(let t=0;t<s.length;t+=1)s[t].m(e,r);o(e,t,r)},p(e,n){if(603&n[0]){let o;for(r=e[1],o=0;o<r.length;o+=1){const l=V(e,r,o);s[o]?s[o].p(l,n):(s[o]=H(l),s[o].c(),s[o].m(t.parentNode,t))}for(;o<s.length;o+=1)s[o].d(1);s.length=r.length}},d(e){m(s,e),e&&u(t)}}}function E(e){let t,r,n,m,h,g,f,b,x,C=e[0]&&T(e);return{c(){t=s("td"),C&&C.c(),r=l(),i(t,"id",n=e[39].id),i(t,"tabindex",m=e[39].tabindex),i(t,"aria-label",h=e[39].arialabel),i(t,"data-grid","no"),i(t,"pevdata-id",g=e[39].pevdata),i(t,"class",f=`${e[0]&&0==e[4]?"":e[39].class} ${e[39].classDetails} ${e[0]&&0==e[4]?"icomoon-24px-correct"==e[39].spanclass?"gridCorrect":"":e[39].correctAnswerColor} gridColor pointer border-dark text-center`),a(t,"width",e[39].width),a(t,"height",e[39].height),a(t,"pointerEvents","pointerEvents")},m(n,s){o(n,t,s),C&&C.m(t,null),c(t,r),b||(x=[d(t,"click",e[6]),d(t,"keyup",e[9])],b=!0)},p(e,o){e[0]?C?C.p(e,o):(C=T(e),C.c(),C.m(t,r)):C&&(C.d(1),C=null),2&o[0]&&n!==(n=e[39].id)&&i(t,"id",n),2&o[0]&&m!==(m=e[39].tabindex)&&i(t,"tabindex",m),2&o[0]&&h!==(h=e[39].arialabel)&&i(t,"aria-label",h),2&o[0]&&g!==(g=e[39].pevdata)&&i(t,"pevdata-id",g),19&o[0]&&f!==(f=`${e[0]&&0==e[4]?"":e[39].class} ${e[39].classDetails} ${e[0]&&0==e[4]?"icomoon-24px-correct"==e[39].spanclass?"gridCorrect":"":e[39].correctAnswerColor} gridColor pointer border-dark text-center`)&&i(t,"class",f),2&o[0]&&a(t,"width",e[39].width),2&o[0]&&a(t,"height",e[39].height)},d(e){e&&u(t),C&&C.d(),b=!1,p(x)}}}function T(e){let t;function r(e,t){return 1==e[4]?R:L}let s=r(e),l=s(e);return{c(){l.c(),t=n()},m(e,r){l.m(e,r),o(e,t,r)},p(e,n){s===(s=r(e))&&l?l.p(e,n):(l.d(1),l=s(e),l&&(l.c(),l.m(t.parentNode,t)))},d(e){l.d(e),e&&u(t)}}}function L(e){let t,r,n,l;return{c(){t=s("span"),r=s("span"),i(r,"class",n=e[39].corrspanclass),i(r,"aria-label",l=e[39].spanarialabel),a(r,"color",e[39].corrspanstyle)},m(e,n){o(e,t,n),c(t,r)},p(e,t){2&t[0]&&n!==(n=e[39].corrspanclass)&&i(r,"class",n),2&t[0]&&l!==(l=e[39].spanarialabel)&&i(r,"aria-label",l),2&t[0]&&a(r,"color",e[39].corrspanstyle)},d(e){e&&u(t)}}}function R(e){let t,r,n,l,d;return{c(){t=s("span"),r=s("span"),i(r,"class",n=e[39].spanclass),i(r,"aria-label",l=e[39].spanarialabel),a(r,"color",e[39].spanstyle),i(t,"class",d=e[3].iconVisible),a(t,"display",e[39].spandisplay)},m(e,n){o(e,t,n),c(t,r)},p(e,o){2&o[0]&&n!==(n=e[39].spanclass)&&i(r,"class",n),2&o[0]&&l!==(l=e[39].spanarialabel)&&i(r,"aria-label",l),2&o[0]&&a(r,"color",e[39].spanstyle),8&o[0]&&d!==(d=e[3].iconVisible)&&i(t,"class",d),2&o[0]&&a(t,"display",e[39].spandisplay)},d(e){e&&u(t)}}}function H(e){let t,r=e[38]==e[39].rowno&&E(e);return{c(){r&&r.c(),t=n()},m(e,n){r&&r.m(e,n),o(e,t,n)},p(e,n){e[38]==e[39].rowno?r?r.p(e,n):(r=E(e),r.c(),r.m(t.parentNode,t)):r&&(r.d(1),r=null)},d(e){r&&r.d(e),e&&u(t)}}}function D(e){let t,r,n=e[1]&&e[1].length>0&&j(e);return{c(){t=s("tr"),n&&n.c(),r=l()},m(e,s){o(e,t,s),n&&n.m(t,null),c(t,r)},p(e,o){e[1]&&e[1].length>0?n?n.p(e,o):(n=j(e),n.c(),n.m(t,r)):n&&(n.d(1),n=null)},d(e){e&&u(t),n&&n.d()}}}function G(e){let t,r,n,d,p,m,A,k,v,y,P,S,V,j=_.you_were_req_to_select+"",E=e[3].correctCount+"",T=_.grid_mark_ans_correct+"";r=new $({props:{reviewMode:e[0],handleReviewClick:e[10]}}),r.$on("setReview",e[8]),r.$on("unsetReview",e[7]);let L=e[2]&&e[2].length>0&&I(e);return{c(){t=s("div"),h(r.$$.fragment),n=l(),d=s("table"),p=s("tbody"),L&&L.c(),m=l(),A=s("div"),k=g(j),v=l(),y=g(E),P=l(),S=g(T),i(d,"id","table"),i(d,"class","table-bordered shadingTable"),a(d,"pointer-events",e[0]?"none":""),i(A,"class","h mt-5 text-center"),i(A,"id","correctCountStatus"),a(A,"color",e[5]),i(t,"class","shadingPreview")},m(e,s){o(e,t,s),f(r,t,null),c(t,n),c(t,d),c(d,p),L&&L.m(p,null),c(t,m),c(t,A),c(A,k),c(A,v),c(A,y),c(A,P),c(A,S),V=!0},p(e,t){const n={};1&t[0]&&(n.reviewMode=e[0]),r.$set(n),e[2]&&e[2].length>0?L?L.p(e,t):(L=I(e),L.c(),L.m(p,null)):L&&(L.d(1),L=null),(!V||1&t[0])&&a(d,"pointer-events",e[0]?"none":""),(!V||8&t[0])&&E!==(E=e[3].correctCount+"")&&b(y,E),(!V||32&t[0])&&a(A,"color",e[5])},i(e){V||(x(r.$$.fragment,e),V=!0)},o(e){C(r.$$.fragment,e),V=!1},d(e){e&&u(t),w(r),L&&L.d()}}}P(".gridColor{width:80px;height:80px;background:#e6f2fd;border:1.5px solid #2379b2!important}.gridColor:hover{background:#fff;border:2px solid #000!important}.gridColor:focus{box-shadow:none;border:2px dotted #000!important}.gridSelected{background:#2c97de!important}.lockedGrid{pointer-events:none!important}.gridDisabled{background:#98b8cc!important;cursor:not-allowed!important}.gridDisabled:hover{background:#98b8cc!important;border:1px solid #609fc9!important}.gridCorrect{border:2px solid green!important;background:#e9ffe9!important}.gridIncorrect{border:2px solid #c85050!important;background:#ffe8e8!important}.gridNotPerformed{background:#92929294!important;border:2px solid #5d5b5b!important}.unitMarginLeft{margin-left:10px}.shadingTable{margin:10px auto;width:auto}.gridHidden{width:80px;height:80px;background:#fff;border:0 solid #fff!important;cursor:default!important}.gridHidden:hover{background:#fff;border:1px solid #fff!important;cursor:default!important}.width-authoring{width:250px}table.shadingTable{border:0!important}.width100{width:100px}.custom_checkbox_new{display:block;position:relative;width:20px;height:20px;margin-bottom:0;cursor:pointer;font-size:18px}.custom_checkbox_new input{position:absolute;z-index:-1;opacity:0}.check_mark_custom{width:17px;height:17px;position:absolute;text-align:center;top:2px;left:0;border:1px solid #d4cfcf}.custom_checkbox_new .check_mark_custom:after{content:'\\2713';color:#fff;transform:rotate(10deg);margin-top:-3px;width:13px;font-size:13px}.custom_checkbox_new input:checked~.check_mark_custom:after{display:block}.check_mark_custom:after{content:'';position:absolute}.custom_checkbox_new input:checked~.check_mark_custom{background:#4285f4;border:2px solid #a4dbfc}input:focus~.check_mark_custom{box-shadow:0 0 0 .13rem rgb(66 133 244 / 25%)}.btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}");function N(e,t,r){let n,o,s,l,c,i,a,d,{xml:u}=t,{uxml:p}=t,{isReview:m}=t,{showAns:h}=t,{editorState:g}=t,f="",b=[],x=!0,C="",w="",$=1,P={rowCount:1,colCount:4,gridWidth:80,gridHeight:80,correctAns:[],correctCount:"",userAns:[],shadedCell:[],cellLocked:!1,hiddenCell:[],smController:"h",itemLayout:[],iconVisible:"h",pointerEvents:"auto",checkLockCell:"",lockedCellValue:""};function S(e){!function(e){try{r(3,P.rowCount=e.smxml._rowCount,P),r(3,P.colCount=e.smxml._colCount,P),r(3,P.gridWidth=40*parseInt(e.smxml._cellWidth),P),r(3,P.gridHeight=40*parseInt(e.smxml._cellHeight),P),r(3,P.correctAns=e.smxml._correctAns.split(","),P),r(3,P.correctCount=e.smxml._correctCount,P),r(3,P.cellLocked=e.smxml._lockedCell,P),r(3,P.hiddenCell=e.smxml._hiddenCell,P),r(3,P.shadedCell=e.smxml._shadedCell,P),r(3,P.lockedCellValue=e.smxml._lockedCellValue,P),function(){let e=""!=P.shadedCell?"#p"+P.shadedCell.split(",").join(",#p"):"";v.selectAll(".shadingPreview .shadingTable td","removeClass",["gridSelected","lockedGrid"]),v.selectAll(".shadingPreview .shadingTable td").forEach((function(e){e.dataset.grid="no"})),""!=e&&(v.selectAll(e,"addClass","gridSelected"),v.selectAll(e).forEach((function(e){e.dataset.grid="selected"})));let t=null!=P.lockedCellValue&&""!=P.lockedCellValue?"#p"+P.lockedCellValue.split(",").join(",#p"):"";""!=t&&(v.selectAll(t,"addClass","lockedGrid"),v.selectAll(t).forEach((function(e){e.dataset.grid="selected"})))}(),p&&function(e){let t=k(e);if(r(3,P.userAns=t.smans._userAns.split(","),P),t.smans._userAns){let e="#p"+t.smans._userAns.split(",").join(",#p");v.selectAll(".shadingPreview .shadingTable td","removeClass","gridSelected"),v.selectAll(".shadingPreview .shadingTable td").forEach((function(e){e.dataset.grid="no"})),v.selectAll(e,"addClass","gridSelected"),v.selectAll(e).forEach((function(e){e.dataset.grid="selected"}))}}(p)}catch(e){console.warn({error:e.message,"function name":"parseXMLPreview","File name":"ShadingPreview.js"})}}(e=k(e))}function V(e){return 0!=P.correctAns?!!P.correctAns.includes(e):P.userAns.length==P.correctCount?(r(5,C="#136d13"),!0):(r(5,C="#c30f0f"),!1)}function I(e){let t;return 0!=P.correctAns&&(t=!(!P.correctAns.includes(e)||P.userAns.includes(e))),t}function j(e,t,r){let n="";return-1!=t.indexOf(e)&&(n+="lockedGrid "),-1!=r.indexOf(e)&&1==$&&(n+="gridSelected"),n}function E(e){let t=e.target.id;$--,v.select(".shadingPreview [id='"+t+"']").classList.contains("lockedGrid")||(v.select(".shadingPreview [id='"+t+"']").classList.contains("gridSelected")?(v.select(".shadingPreview [id='"+t+"']").setAttribute("data-grid","no"),v.selectAll(".shadingPreview [id='"+t+"']","removeClass","gridSelected")):(v.select(".shadingPreview [id='"+t+"']").setAttribute("data-grid","selected"),v.selectAll(".shadingPreview [id='"+t+"']","addClass","gridSelected")));let r=L();g||y({uXml:P.userxml,ans:r})}function T(e,t){r(3,P.iconVisible="showIcon"==t?"":"h",P),"cans"==e?r(16,b=P.correctAns):"yans"==e&&r(16,b=P.userAns)}function L(){const e=P.correctAns.length;let t=0,n=0,o="",s="";return r(3,P.userAns=[],P),v.selectAll(".shadingPreview .shadingTable .gridSelected").forEach((function(e){P.userAns.push(e.getAttribute("pevdata-id"))})),v.select("#special_module_user_xml").innerText="<smans userAns='"+P.userAns.join()+"'></smans>",r(3,P.userxml="<smans userAns='"+P.userAns.join()+"'></smans>",P),""!=P.correctAns&&(P.correctAns.map((function(e,r){P.userAns.map((function(r,n){e==r&&(t+=1)}))})),o=e==t&&t==P.userAns.length?_.correct:_.incorrect,"undefined"!=typeof calculatePoint&&calculatePoint(P.correctAns.length,t),s="Incorrect"!=o,g&&h(o)),""!=P.correctCount&&""==P.correctAns&&(P.userAns.length==P.correctCount?(w=_.correct,n=P.correctCount):w=_.incorrect,"undefined"!=typeof calculatePoint&&calculatePoint(P.correctCount,n),g&&h(w)),g||y({uXml:P.userxml,ans:s}),s}function R(){T("yans","hideIcon"),r(0,m=!1),""!=P.correctCount&&""==P.correctAns&&v.selectAll("#correctCountStatus","addClass","h")}function H(){T("yans","showIcon"),r(0,m=!0),L(),""!=P.correctCount&&""==P.correctAns&&v.selectAll("#correctCountStatus","removeClass","h")}return A((()=>{r(3,P.xml=u,P),r(3,P.correctAns=[],P),r(3,P.correctCount=[],P),r(3,P.shadedCell=[],P),p||r(3,P.userAns=[],P),S(u)})),e.$$set=e=>{"xml"in e&&r(11,u=e.xml),"uxml"in e&&r(12,p=e.uxml),"isReview"in e&&r(0,m=e.isReview),"showAns"in e&&r(13,h=e.showAns),"editorState"in e&&r(14,g=e.editorState)},e.$$.update=()=>{if(2066447&e.$$.dirty[0]){m?H():R(),u!=P.xml&&(r(3,P.xml=u,P),S(u)),r(2,d=[]),r(1,a=[]),r(19,c=null!=P.lockedCellValue&&""!=P.lockedCellValue?P.lockedCellValue.split(","):""),r(20,i=""!=P.shadedCell?P.shadedCell.split(","):"");for(let e=0;e<P.rowCount;e++){r(2,d=[...d,{id:"gridRow_"+e}]);for(let d=0;d<P.colCount;d++)r(17,s=e+"_"+d),""!=b?(r(18,l=b.indexOf(s)),r(15,f=-1!=l?"gridSelected":"")):r(15,f=""),r(1,a=[...a,{id:"p"+s,tabindex:"auto"==P.pointerEvents?"0":"",arialabel:"Grids row "+(e+1)+" and column "+(d+1)+" is selected",pevdata:s,class:f,width:parseInt(P.gridWidth)+"px",height:parseInt(P.gridHeight)+"px",classDetails:j(s,c,i),correctAnswerColor:(t=s,n=""==P.iconVisible&&P.userAns.includes(t)?V(t)?" gridCorrect":" gridIncorrect":"",o=""!=P.iconVisible||P.userAns.includes(t)?"":I(t)?" gridNotPerformed":"",n+=o,n),spanclass:V(s)?"icomoon-24px-correct":"icomoon-24px-close",spanarialabel:V(s)?I(s)?"marked as unattempted":"marked as correct":"marked as incorrect",spanstyle:P.userAns.includes(s)?V(s)?"#136d13":"#c30f0f":I(s)?"#222":"",spandisplay:""==P.iconVisible&&P.userAns.includes(s)||""==P.iconVisible&&!P.userAns.includes(s)&&I(s)?"block":"none",rowno:e,corrspanclass:V(s)?"icomoon-24px-correct":"",corrspanstyle:V(s)?"#136d13":""}])}}var t},[m,a,d,P,x,C,E,R,H,function(e){13==e.keyCode&&E(e)},function(e){"c"==e?r(4,x=!1):"u"==e&&r(4,x=!0)},u,p,h,g,f,b,s,l,c,i]}export default class extends e{constructor(e){super(),t(this,e,N,G,r,{xml:11,uxml:12,isReview:0,showAns:13,editorState:14},null,[-1,-1])}}
//# sourceMappingURL=ShadingPreview-ac100152.js.map
