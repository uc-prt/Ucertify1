import{S as e,i as t,s as l,q as s,h as n,e as r,b as c,j as a,f as o,g as i,l as d,o as u,y as p,D as h,c as m,u as g,m as f,x as C,t as A,a as w,d as b,p as x,X as v,A as k,C as y,R as _}from"./main-a1cb066e.js";import{I as S}from"./ItemHelper-4ba8e744.js";function $(e,t,l){const s=e.slice();return s[39]=t[l],s}function P(e,t,l){const s=e.slice();return s[36]=t[l],s[38]=l,s}function V(e){let t,l=e[4],r=[];for(let t=0;t<l.length;t+=1)r[t]=G(P(e,l,t));return{c(){for(let e=0;e<r.length;e+=1)r[e].c();t=s()},m(e,l){for(let t=0;t<r.length;t+=1)r[t].m(e,l);n(e,t,l)},p(e,s){if(635&s[0]){let n;for(l=e[4],n=0;n<l.length;n+=1){const c=P(e,l,n);r[n]?r[n].p(c,s):(r[n]=G(c),r[n].c(),r[n].m(t.parentNode,t))}for(;n<r.length;n+=1)r[n].d(1);r.length=l.length}},d(e){h(r,e),e&&u(t)}}}function E(e){let t,l=e[3],r=[];for(let t=0;t<l.length;t+=1)r[t]=L($(e,l,t));return{c(){for(let e=0;e<r.length;e+=1)r[e].c();t=s()},m(e,l){for(let t=0;t<r.length;t+=1)r[t].m(e,l);n(e,t,l)},p(e,s){if(619&s[0]){let n;for(l=e[3],n=0;n<l.length;n+=1){const c=$(e,l,n);r[n]?r[n].p(c,s):(r[n]=L(c),r[n].c(),r[n].m(t.parentNode,t))}for(;n<r.length;n+=1)r[n].d(1);r.length=l.length}},d(e){h(r,e),e&&u(t)}}}function I(e){let t,l,s,h,m,g,f,C,A,w=e[0]&&j(e);return{c(){t=r("td"),w&&w.c(),l=c(),o(t,"id",s=e[39].id),o(t,"tabindex",h=e[39].tabindex),o(t,"aria-label",m=e[39].arialabel),o(t,"data-grid","no"),o(t,"pevdata-id",g=e[39].pevdata),o(t,"class",f=`${e[0]&&0==e[1]?"":e[39].class} ${e[39].classDetails} ${e[0]&&0==e[1]?"icomoon-24px-correct"==e[39].spanclass?"gridCorrect":"":e[39].correctAnswerColor} gridColor pointer border-dark text-center`),i(t,"width",e[39].width),i(t,"height",e[39].height),i(t,"pointerEvents","pointerEvents")},m(s,r){n(s,t,r),w&&w.m(t,null),a(t,l),C||(A=[d(t,"click",e[6]),d(t,"keyup",e[9])],C=!0)},p(e,n){e[0]?w?w.p(e,n):(w=j(e),w.c(),w.m(t,l)):w&&(w.d(1),w=null),8&n[0]&&s!==(s=e[39].id)&&o(t,"id",s),8&n[0]&&h!==(h=e[39].tabindex)&&o(t,"tabindex",h),8&n[0]&&m!==(m=e[39].arialabel)&&o(t,"aria-label",m),8&n[0]&&g!==(g=e[39].pevdata)&&o(t,"pevdata-id",g),11&n[0]&&f!==(f=`${e[0]&&0==e[1]?"":e[39].class} ${e[39].classDetails} ${e[0]&&0==e[1]?"icomoon-24px-correct"==e[39].spanclass?"gridCorrect":"":e[39].correctAnswerColor} gridColor pointer border-dark text-center`)&&o(t,"class",f),8&n[0]&&i(t,"width",e[39].width),8&n[0]&&i(t,"height",e[39].height)},d(e){e&&u(t),w&&w.d(),C=!1,p(A)}}}function j(e){let t;function l(e,t){return 1==e[1]?T:R}let r=l(e),c=r(e);return{c(){c.c(),t=s()},m(e,l){c.m(e,l),n(e,t,l)},p(e,s){r===(r=l(e))&&c?c.p(e,s):(c.d(1),c=r(e),c&&(c.c(),c.m(t.parentNode,t)))},d(e){c.d(e),e&&u(t)}}}function R(e){let t,l,s,c;return{c(){t=r("span"),l=r("span"),o(l,"class",s=e[39].corrspanclass),o(l,"aria-label",c=e[39].spanarialabel),i(l,"color",e[39].corrspanstyle)},m(e,s){n(e,t,s),a(t,l)},p(e,t){8&t[0]&&s!==(s=e[39].corrspanclass)&&o(l,"class",s),8&t[0]&&c!==(c=e[39].spanarialabel)&&o(l,"aria-label",c),8&t[0]&&i(l,"color",e[39].corrspanstyle)},d(e){e&&u(t)}}}function T(e){let t,l,s,c,d;return{c(){t=r("span"),l=r("span"),o(l,"class",s=e[39].spanclass),o(l,"aria-label",c=e[39].spanarialabel),i(l,"color",e[39].spanstyle),o(t,"class",d=e[5].iconVisible),i(t,"display",e[39].spandisplay)},m(e,s){n(e,t,s),a(t,l)},p(e,n){8&n[0]&&s!==(s=e[39].spanclass)&&o(l,"class",s),8&n[0]&&c!==(c=e[39].spanarialabel)&&o(l,"aria-label",c),8&n[0]&&i(l,"color",e[39].spanstyle),32&n[0]&&d!==(d=e[5].iconVisible)&&o(t,"class",d),8&n[0]&&i(t,"display",e[39].spandisplay)},d(e){e&&u(t)}}}function L(e){let t,l=e[38]==e[39].rowno&&I(e);return{c(){l&&l.c(),t=s()},m(e,s){l&&l.m(e,s),n(e,t,s)},p(e,s){e[38]==e[39].rowno?l?l.p(e,s):(l=I(e),l.c(),l.m(t.parentNode,t)):l&&(l.d(1),l=null)},d(e){l&&l.d(e),e&&u(t)}}}function G(e){let t,l,s=e[3]&&e[3].length>0&&E(e);return{c(){t=r("tr"),s&&s.c(),l=c()},m(e,r){n(e,t,r),s&&s.m(t,null),a(t,l)},p(e,n){e[3]&&e[3].length>0?s?s.p(e,n):(s=E(e),s.c(),s.m(t,l)):s&&(s.d(1),s=null)},d(e){e&&u(t),s&&s.d()}}}function H(e){let t,l,s,d,p,h,x,v,k,_,$,P,E,I,j,R,T=y.you_were_req_to_select+"",L=e[5].correctCount+"",G=y.grid_mark_ans_correct+"";p=new S({props:{reviewMode:e[0],handleReviewClick:e[10]}}),p.$on("setReview",e[8]),p.$on("unsetReview",e[7]);let H=e[4]&&e[4].length>0&&V(e);return{c(){t=r("link"),s=c(),d=r("div"),m(p.$$.fragment),h=c(),x=r("table"),v=r("tbody"),H&&H.c(),k=c(),_=r("div"),$=g(T),P=c(),E=g(L),I=c(),j=g(G),o(t,"onload","this.rel='stylesheet'"),o(t,"rel","preload"),o(t,"as","style"),o(t,"href",l=editor.baseUrlTheme+"clsSMShadedGrid/css/ShadingStyle.min.css"),o(x,"id","table"),o(x,"class","table-bordered shadingTable"),i(x,"pointer-events",e[0]?"none":""),o(_,"class","h mt-5 text-center"),o(_,"id","correctCountStatus"),i(_,"color",e[2]),o(d,"class","shadingPreview")},m(e,l){n(e,t,l),n(e,s,l),n(e,d,l),f(p,d,null),a(d,h),a(d,x),a(x,v),H&&H.m(v,null),a(d,k),a(d,_),a(_,$),a(_,P),a(_,E),a(_,I),a(_,j),R=!0},p(e,t){const l={};1&t[0]&&(l.reviewMode=e[0]),p.$set(l),e[4]&&e[4].length>0?H?H.p(e,t):(H=V(e),H.c(),H.m(v,null)):H&&(H.d(1),H=null),(!R||1&t[0])&&i(x,"pointer-events",e[0]?"none":""),(!R||32&t[0])&&L!==(L=e[5].correctCount+"")&&C(E,L),(!R||4&t[0])&&i(_,"color",e[2])},i(e){R||(A(p.$$.fragment,e),R=!0)},o(e){w(p.$$.fragment,e),R=!1},d(e){e&&u(t),e&&u(s),e&&u(d),b(p),H&&H.d()}}}function N(e,t,l){let s,n,r,c,a,o,i,d,{xml:u}=t,{uxml:p}=t,{isReview:h}=t,{showAns:m}=t,{editorState:g}=t,f="",C=[],A=!0,w="",b="",S=1,$={rowCount:1,colCount:4,gridWidth:80,gridHeight:80,correctAns:[],correctCount:"",userAns:[],shadedCell:[],cellLocked:!1,hiddenCell:[],smController:"h",itemLayout:[],iconVisible:"h",pointerEvents:"auto",checkLockCell:"",lockedCellValue:"",pointerEvents:""};function P(e){!function(e){try{l(5,$.rowCount=e.smxml._rowCount,$),l(5,$.colCount=e.smxml._colCount,$),l(5,$.gridWidth=40*parseInt(e.smxml._cellWidth),$),l(5,$.gridHeight=40*parseInt(e.smxml._cellHeight),$),l(5,$.correctAns=e.smxml._correctAns.split(","),$),l(5,$.correctCount=e.smxml._correctCount,$),l(5,$.cellLocked=e.smxml._lockedCell,$),l(5,$.hiddenCell=e.smxml._hiddenCell,$),l(5,$.shadedCell=e.smxml._shadedCell,$),l(5,$.lockedCellValue=e.smxml._lockedCellValue,$),function(){let e=""!=$.shadedCell?"#p"+$.shadedCell.split(",").join(",#p"):"";k.selectAll(".shadingPreview .shadingTable td","removeClass",["gridSelected","lockedGrid"]),k.selectAll(".shadingPreview .shadingTable td").forEach((function(e){e.dataset.grid="no"})),""!=e&&(k.selectAll(e,"addClass","gridSelected"),k.selectAll(e).forEach((function(e){e.dataset.grid="selected"})));let t=null!=$.lockedCellValue&&""!=$.lockedCellValue?"#p"+$.lockedCellValue.split(",").join(",#p"):"";""!=t&&(k.selectAll(t,"addClass","lockedGrid"),k.selectAll(t).forEach((function(e){e.dataset.grid="selected"})))}(),p&&function(e){let t=v(e);if(l(5,$.userAns=t.smans._userAns.split(","),$),t.smans._userAns){let e="#p"+t.smans._userAns.split(",").join(",#p");k.selectAll(".shadingPreview .shadingTable td","removeClass","gridSelected"),k.selectAll(".shadingPreview .shadingTable td").forEach((function(e){e.dataset.grid="no"})),k.selectAll(e,"addClass","gridSelected"),k.selectAll(e).forEach((function(e){e.dataset.grid="selected"}))}}(p)}catch(e){console.warn({error:e.message,"function name":"parseXMLPreview","File name":"ShadingPreview.js"})}}(e=v(e))}function V(e){return 0!=$.correctAns?!!$.correctAns.includes(e):$.userAns.length==$.correctCount?(l(2,w="#136d13"),!0):(l(2,w="#c30f0f"),!1)}function E(e){let t;return 0!=$.correctAns&&(t=!(!$.correctAns.includes(e)||$.userAns.includes(e))),t}function I(e,t,l){let s="";return-1!=t.indexOf(e)&&(s+="lockedGrid "),-1!=l.indexOf(e)&&1==S&&(s+="gridSelected"),s}function j(e){let t=e.target.id;S--,k.select(".shadingPreview [id='"+t+"']").classList.contains("lockedGrid")||(k.select(".shadingPreview [id='"+t+"']").classList.contains("gridSelected")?(k.select(".shadingPreview [id='"+t+"']").setAttribute("data-grid","no"),k.selectAll(".shadingPreview [id='"+t+"']","removeClass","gridSelected")):(k.select(".shadingPreview [id='"+t+"']").setAttribute("data-grid","selected"),k.selectAll(".shadingPreview [id='"+t+"']","addClass","gridSelected")));let l=T();g||_({uXml:$.userxml,ans:l})}function R(e,t){l(5,$.iconVisible="showIcon"==t?"":"h",$),"cans"==e?l(16,C=$.correctAns):"yans"==e&&l(16,C=$.userAns)}function T(){const e=$.correctAns.length;let t=0,s=0,n="",r="";return l(5,$.userAns=[],$),k.selectAll(".shadingPreview .shadingTable .gridSelected").forEach((function(e){$.userAns.push(e.getAttribute("pevdata-id"))})),k.select("#special_module_user_xml").innerText="<smans userAns='"+$.userAns.join()+"'></smans>",l(5,$.userxml="<smans userAns='"+$.userAns.join()+"'></smans>",$),""!=$.correctAns&&($.correctAns.map((function(e,l){$.userAns.map((function(l,s){e==l&&(t+=1)}))})),n=e==t&&t==$.userAns.length?y.correct:y.incorrect,"undefined"!=typeof calculatePoint&&calculatePoint($.correctAns.length,t),r="Incorrect"!=n,g&&m(n)),""!=$.correctCount&&""==$.correctAns&&($.userAns.length==$.correctCount?(b=y.correct,s=$.correctCount):b=y.incorrect,"undefined"!=typeof calculatePoint&&calculatePoint($.correctCount,s),g&&m(b)),g||_({uXml:$.userxml,ans:r}),r}function L(){R("yans","hideIcon"),l(0,h=!1),""!=$.correctCount&&""==$.correctAns&&k.selectAll("#correctCountStatus","addClass","h")}function G(){R("yans","showIcon"),l(0,h=!0),T(),""!=$.correctCount&&""==$.correctAns&&k.selectAll("#correctCountStatus","removeClass","h")}return x((()=>{l(5,$.xml=u,$),l(5,$.correctAns=[],$),l(5,$.correctCount=[],$),l(5,$.shadedCell=[],$),p||l(5,$.userAns=[],$),P(u)})),e.$$set=e=>{"xml"in e&&l(11,u=e.xml),"uxml"in e&&l(12,p=e.uxml),"isReview"in e&&l(0,h=e.isReview),"showAns"in e&&l(13,m=e.showAns),"editorState"in e&&l(14,g=e.editorState)},e.$$.update=()=>{if(31557689&e.$$.dirty[0]){h?G():L(),u!=$.xml&&(l(5,$.xml=u,$),P(u)),l(4,d=[]),l(3,i=[]),l(23,a=null!=$.lockedCellValue&&""!=$.lockedCellValue?$.lockedCellValue.split(","):""),l(24,o=""!=$.shadedCell?$.shadedCell.split(","):"");for(let e=0;e<$.rowCount;e++){l(4,d=[...d,{id:"gridRow_"+e}]);for(let d=0;d<$.colCount;d++)l(21,r=e+"_"+d),""!=C?(l(22,c=C.indexOf(r)),l(15,f=-1!=c?"gridSelected":"")):l(15,f=""),l(3,i=[...i,{id:"p"+r,tabindex:"auto"==$.pointerEvents?"0":"",arialabel:"Grids row "+(e+1)+" and column "+(d+1)+" is selected",pevdata:r,class:f,width:parseInt($.gridWidth)+"px",height:parseInt($.gridHeight)+"px",classDetails:I(r,a,o),correctAnswerColor:(t=r,s=""==$.iconVisible&&$.userAns.includes(t)?V(t)?" gridCorrect":" gridIncorrect":"",n=""!=$.iconVisible||$.userAns.includes(t)?"":E(t)?" gridNotPerformed":"",s+=n,s),spanclass:V(r)?"icomoon-24px-correct":"icomoon-24px-close",spanarialabel:V(r)?E(r)?"marked as unattempted":"marked as correct":"marked as incorrect",spanstyle:$.userAns.includes(r)?V(r)?"#136d13":"#c30f0f":E(r)?"#222":"",spandisplay:""==$.iconVisible&&$.userAns.includes(r)||""==$.iconVisible&&!$.userAns.includes(r)&&E(r)?"block":"none",rowno:e,corrspanclass:V(r)?"icomoon-24px-correct":"",corrspanstyle:V(r)?"#136d13":""}])}}var t},[h,A,w,i,d,$,j,L,G,function(e){13==e.keyCode&&j(e)},function(e){"c"==e?l(1,A=!1):"u"==e&&l(1,A=!0)},u,p,m,g]}export default class extends e{constructor(e){super(),t(this,e,N,H,l,{xml:11,uxml:12,isReview:0,showAns:13,editorState:14},[-1,-1])}}
//# sourceMappingURL=ShadingPreview-82cd06e0.js.map
