import{G as e,S as t,i as s,s as n,e as r,f as o,h as i,o as a,c as l,b as c,u,j as d,m as f,l as m,x as h,t as p,a as b,d as g,D as _,y as A,p as v,A as w,a2 as S,w as x,T as k,X as y}from"./main-cddbb274.js";import{I as q}from"./ItemHelper-3bd8492b.js";import"./style-inject.es-1f59c1d0.js";import{h as L}from"./hotkeys.esm-4c49bce2.js";import{S as E}from"./sortable.esm-143959dc.js";import"./choose.min-a2cea529.js";const C=new e;var I={};let M,T,P,j;function D(e,t,s){const n=e.slice();return n[26]=t[s],n[28]=s,n}function N(e){let t,s,n,l,c,u,d,f,m,h,p=e[9](e[26])+"";return{c(){t=r("li"),o(t,"key",s=e[28]),o(t,"class",n="1"==e[3].isSentence?"sentence_li":"1"==e[3].isParagraph?"paragraph_li":""),o(t,"is_correct",l=e[26].isCorrect),o(t,"optid",c=e[26].optid),o(t,"correct_seq",u=e[26].seq),o(t,"user_answer",d=e[26].user_answer),o(t,"u",f=e[26].user_answer),o(t,"user_seq",m=e[26].user_seq?e[26].user_seq:e[28]),o(t,"id",h="id"+e[28]),o(t,"tabindex","0")},m(e,s){i(e,t,s),t.innerHTML=p},p(e,s){4&s&&p!==(p=e[9](e[26])+"")&&(t.innerHTML=p),8&s&&n!==(n="1"==e[3].isSentence?"sentence_li":"1"==e[3].isParagraph?"paragraph_li":"")&&o(t,"class",n),4&s&&l!==(l=e[26].isCorrect)&&o(t,"is_correct",l),4&s&&c!==(c=e[26].optid)&&o(t,"optid",c),4&s&&u!==(u=e[26].seq)&&o(t,"correct_seq",u),4&s&&d!==(d=e[26].user_answer)&&o(t,"user_answer",d),4&s&&f!==(f=e[26].user_answer)&&o(t,"u",f),4&s&&m!==(m=e[26].user_seq?e[26].user_seq:e[28])&&o(t,"user_seq",m)},d(e){e&&a(t)}}}function X(e){let t;return{c(){t=u("Sequencing of the selected item is not required. Click to select items.")},m(e,s){i(e,t,s)},d(e){e&&a(t)}}}function R(e){let t;return{c(){t=u("Click to select. Drag and Drop to set sequence.")},m(e,s){i(e,t,s)},d(e){e&&a(t)}}}function U(e){let t,s,n,v,w,S,x,k,y,L,E,C,I,M,T,P,j,U,H,$,B=e[3].headingCorrect+"";v=new q({props:{handleReviewClick:e[10],reviewMode:e[0]}}),v.$on("setReview",e[4]),v.$on("unsetReview",e[5]);let O=e[2],G=[];for(let t=0;t<O.length;t+=1)G[t]=N(D(e,O,t));function K(e,t){return 1==e[3].allowSort||1==e[3].isSentence||1==e[3].isParagraph?R:X}let F=K(e),J=F(e);return{c(){t=r("main"),s=r("div"),n=r("center"),l(v.$$.fragment),w=c(),S=r("center"),x=r("div"),k=r("div"),y=u(B),L=c(),E=r("ul");for(let e=0;e<G.length;e+=1)G[e].c();T=c(),P=r("div"),J.c(),o(k,"class","choose_header font17 pl-4"),o(E,"id","sortable"),o(E,"totalcorrectans",C=e[3].totalcorrectans),o(E,"checkseq",I=e[3].allowSort),o(E,"class","ui-sortable w-auto mt-0 p-2"),o(E,"style",M="border-left:10px solid #d9e7fd;border-right: 10px solid #d9e7fd"),o(P,"class","choose_bottom pl-4"),o(P,"id","instruction"),o(x,"id",e[1]),o(x,"type",j="1"==e[3].isSentence?"sentence":"1"==e[3].isParagraph?"paragraph":"normal"),o(x,"class","bg-white")},m(r,o){i(r,t,o),d(t,s),d(s,n),f(v,n,null),d(s,w),d(s,S),d(S,x),d(x,k),d(k,y),d(x,L),d(x,E);for(let e=0;e<G.length;e+=1)G[e].m(E,null);d(x,T),d(x,P),J.m(P,null),U=!0,H||($=[m(E,"mouseup",e[6].bind(this)),m(E,"mousemove",e[7].bind(this)),m(E,"mousedown",e[8].bind(this))],H=!0)},p(e,[t]){const s={};if(1&t&&(s.reviewMode=e[0]),v.$set(s),(!U||8&t)&&B!==(B=e[3].headingCorrect+"")&&h(y,B),524&t){let s;for(O=e[2],s=0;s<O.length;s+=1){const n=D(e,O,s);G[s]?G[s].p(n,t):(G[s]=N(n),G[s].c(),G[s].m(E,null))}for(;s<G.length;s+=1)G[s].d(1);G.length=O.length}(!U||8&t&&C!==(C=e[3].totalcorrectans))&&o(E,"totalcorrectans",C),(!U||8&t&&I!==(I=e[3].allowSort))&&o(E,"checkseq",I),F!==(F=K(e))&&(J.d(1),J=F(e),J&&(J.c(),J.m(P,null))),(!U||2&t)&&o(x,"id",e[1]),(!U||8&t&&j!==(j="1"==e[3].isSentence?"sentence":"1"==e[3].isParagraph?"paragraph":"normal"))&&o(x,"type",j)},i(e){U||(p(v.$$.fragment,e),U=!0)},o(e){b(v.$$.fragment,e),U=!1},d(e){e&&a(t),g(v),_(G,e),J.d(),H=!1,A($)}}}function H(e,t,s){let{cmed:n}=t,{showAns:r}=t,{xml:o}=t,{stopPreviewUpdate:i}=t,{editorState:a}=t,{isReview:l}=t,{uxml:c}=t,u=n?"choose"+n:"choose";I.ajax_eId=n?"#choose"+n:"#choose";var d=[];let f={};x({xml:"",headingCorrect:"",allowSort:"",isSentence:"",isParagraph:"",chooseClass:"",totalcorrectans:"",stateXMLToJSON:""}).subscribe((e=>{s(3,f=e)}));function m(){var e="";e=("1"==f.isSentence||f.isParagraph,I.CheckResultchoose("#"+u)),k({uXml:e.u,ans:e.b}),a&&r(e.b?"Correct":"Incorrect")}function h(){console.log("checking"),b("none"),I.modeOn("on"),s(0,l=!0),I.review("#"+u,0),w.removeClass("#show_ans_group button","active"),w.removeClass("#show_ans_group .your-ans","active"),m()}function p(){b("auto"),s(0,l=!1),I.modeOn(),I.review("#"+u,0)}function b(e){w.selectAll("#sortable li").forEach((t=>{t.style.pointerEvents=e}))}return v((()=>{w.bind(document,"click",(function(){if(document.querySelector(".editorRender"))return document.querySelector(".editorRender").clientHeight})),w.listen(document,"click","#"+u,(function(){setTimeout((function(){m()}),100)})),w.listen(document,"click","#show_ans_group button",(e=>{w.removeClass("#show_ans_group button","active"),w.addClass(e,"active")}))})),S((()=>{if(o!=f.xml){if(1==i)return!1;n&&(s(1,u="choose"+n),I.ajax_eId="#choose"+n),s(3,f.xml=o,f),s(3,f.stateXMLToJSON=y(o),f),function(e){if(function(e){try{s(2,d=[]);let n=e.smxml.list.__cdata.split("\n"),r=1,o=0,i=0;n.forEach((function(e,t){""!=n[t].trim()&&("*"==n[t].trim().charAt(0)&&o++,d.push({value:n[t].trim(),isCorrect:"*"==n[t].trim().charAt(0)?"1":"0",seq:"*"==n[t].trim().charAt(0)?r:"0",user_answer:"0",optid:i}),"*"==n[t].trim().charAt(0)&&r++,i++)})),function(e){for(var t=e.length-1;t>0;t--){var s=Math.floor(Math.random()*(t+1)),n=e[t];e[t]=e[s],e[s]=n}}(d),e=function(e){let t=e;return t.smxml.list._headingCorrect&&(t.smxml.list._headingcorrect=t.smxml.list._headingCorrect,delete t.smxml.list._headingCorrect),t.smxml.list._allowSort&&(t.smxml.list._allowsort=t.smxml.list._allowSort,delete t.smxml.list._allowSort),t.smxml.list._isParagraph&&(t.smxml.list._isparagraph=t.smxml.list._isParagraph,delete t.smxml.list._isParagraph),t.smxml.list._isSentence&&(t.smxml.list._issentence=t.smxml.list._isSentence,delete t.smxml.list._isSentence),t}(e),s(3,f.headingCorrect=e.smxml.list._headingcorrect,f),s(3,f.allowSort=e.smxml.list._allowsort?e.smxml.list._allowsort:"0",f),s(3,f.isSentence=e.smxml.list._issentence?e.smxml.list._issentence:"0",f),s(3,f.isParagraph=e.smxml.list._isparagraph?e.smxml.list._isparagraph:"0",f),s(3,f.totalcorrectans=o,f);var t=setTimeout(function(){w.find("#sortable",".sentence_li","all").forEach((function(e,t){e.setAttribute("user_seq",t+1)})),clearTimeout(t)}.bind(this),200)}catch(e){this.onError=e,console.warn({error:e.message,"function name":"parseXMLPreview","File name":"ChooseNReorderPreview.js"})}}(e),c){let e=y(c);if(e&&e.SMANS&&e.SMANS&&e.SMANS.list){let t=e.SMANS.list._useranswer.split(","),n=[];for(let e in t)if(t[e]){let r=t[e].split("|");for(let e in d)d[e].optid==r[0]&&(s(2,d[e].user_answer=r[2],d),s(2,d[e].user_seq=r[1],d),n.push(d[e]))}s(2,d=n)}}}(f.stateXMLToJSON);var e=setTimeout((function(){c||(w.selectAll("#sortable li").forEach((e=>{e.setAttribute("user_answer","0"),e.setAttribute("style","")})),w.selectAll("#sortable li .prefix").forEach((e=>{e.innerHTML=""}))),I.removeActive("#"+u),I.review("#"+u,0),I.init("#"+u),I.CheckResultchoose("#"+u);new E(w.find("#"+u,"#sortable"),{animation:150});"1"==f.allowSort&&"1"!=f.isSentence&&"1"!=f.isParagraph||new E(w.find("#"+u,"#sortable"),{onEnd(e){e.item;e.to,e.from,e.oldIndex,e.newIndex,e.oldDraggableIndex,e.newDraggableIndex,e.clone,e.pullMode}}),"1"!=f.isSentence&&"1"!=f.isParagraph||I.dragSenParItem("#"+u),clearTimeout(e)}),200)}})),e.$$set=e=>{"cmed"in e&&s(11,n=e.cmed),"showAns"in e&&s(12,r=e.showAns),"xml"in e&&s(13,o=e.xml),"stopPreviewUpdate"in e&&s(14,i=e.stopPreviewUpdate),"editorState"in e&&s(15,a=e.editorState),"isReview"in e&&s(0,l=e.isReview),"uxml"in e&&s(16,c=e.uxml)},e.$$.update=()=>{1&e.$$.dirty&&setTimeout((function(){l?h():p()}),200)},[l,u,d,f,h,p,function(e){"1"!=f.isSentence&&"1"!=f.isParagraph&&I.cmu("#"+u,e)},function(e,t){"1"!=f.isSentence&&"1"!=f.isParagraph&&I.cmm(e,t)},function(e,t){"1"!=f.isSentence&&"1"!=f.isParagraph&&(I.cmd(e,t),ISSPECIALMODULEUSERXMLCHANGE=1)},function(e){return'<div class="prefix pl-2 mr-2"'+("1"==f.isSentence?"nw":"")+'"></div>'+("1"==f.isParagraph?'<div class="pg_handle">&equiv;</div>':"")+("*"==e.value.charAt(0)?e.value.slice(1):e.value)},function(e,t){"c"==e?I.showAns("#"+u,t.currentTarget,"c"):I.showAns("#"+u,t.currentTarget,"u")},n,r,o,i,a,c]}I.ajax_eId="#choose",I.userAnsXML="",I.errorCatchFlag=1,C.listen("body","keyup",".sm_input_text",(function(){""==document.querySelector(".sm_input_text").value&&document.querySelector(".add-option")?document.querySelector(".add-option").disabled=!0:document.querySelector(".add-option")&&(document.querySelector(".add-option").disabled=!1)})),I.update_XMLValue=function(){var e=[];if(C.selectAll(".choose_item_container textarea").forEach((t=>{if(t.value.length>0){const s=t.value.replace(/\r?\n/g,"||");C.prevElm(t,"input")&&C.prevElm(t,"input").checked?e.push("*"+s):e.push(s)}})),document.querySelector("#special_module_xml")){var t=document.querySelector("#special_module_xml").value;C.find(t,"list").setAttribute("headingCorrect",document.querySelector("#headingCorrect").value),C.find(t,"list").setAttribute("allowSort",document.querySelector("#allowSort").getAttribute("value")),C.find(t,"list").setAttribute("isSentence",document.querySelector("#isSentence").getAttribute("value")),C.find(t,"list").setAttribute("isParagraph",document.querySelector("#isParagraph").getAttribute("value")),C.find(t,"list").innerHTML="\x3c!--[CDATA["+e.join("\n")+"]]--\x3e",document.querySelector("#special_module_xml").value=formatXml(t.xml?t.xml:(new XMLSerializer).serializeToString(t[0]),!0)}},I.showAns=function(e,t,s){"c"==s?(I.review(e,1),I.sortList(e,"correct_seq")):"u"==s&&(I.review(e,0),I.sortList(e,"user_seq"))},I.sortList=function(e,t){var s=C.selectAll(e+" #sortable > li"),n=Array.from(s);n.sort((function(e,s){var n=parseInt(e.getAttribute(t));0===n&&(n=Number.MAX_VALUE);var r=parseInt(s.getAttribute(t));return 0===r&&(r=Number.MAX_VALUE),n-r})),C.selectAll(e+" #sortable > li").forEach((e=>{e.remove()})),n.forEach((t=>{C.find(e,"#sortable").append(t)}))},I.togseq=function(e){var t=C.find(e,"#sortable").getAttribute("checkSeq");C.find(e,"#sortable").setAttribute("checkSeq","1"==t?"0":"1"),C.find(e,"#instruction").innerHTML="1"==t?"":"Sequence Important"},I.review=function(e,t){var s=document.querySelector(e)?.querySelector("#sortable")?.getAttribute("checkSeq"),n=1==t?"is_correct":"user_answer",r=1==t?"correct_seq":"user_seq";"normal"==C.select(e).getAttribute?.("type")?C.find(e,"#sortable li","all").forEach((e=>{if("1"==s){if(1==e.getAttribute(n))var o=e.getAttribute(r);else o=0;C.find(e,".prefix").innerHTML=o>0?o:"",C.find(e,".prefix",{action:"removeClass",actionData:"tick"})}else 1==e.getAttribute(n)?C.find(e,".prefix",{action:"addClass",actionData:"tick"}):C.find(e,".prefix",{action:"removeClass",actionData:"tick"});1==e.getAttribute("user_answer")&&0==t||1==e.getAttribute("is_correct")&&1==t?e.classList.add("choose_sel"):e.classList.remove("choose_sel")})):"sentence"!=C.select(e).getAttribute?.("type")&&"paragraph"!=C.select(e).getAttribute?.("type")||I.setActiveClass(e,t)},I.CheckResultchoose=function(e){let t={};var s=!0,n=0;let r=C.find(e,"#sortable");var o=Array.isArray(r)?"":r.getAttribute("checkSeq"),i="";return C.find(e,"#sortable li","all").forEach((e=>{var t=e.getAttribute("user_seq"),r=e.getAttribute("user_answer");"1"==o?(t!=e.getAttribute("correct_seq")&&(s=!1),"undefined"!=typeof calculatePoint&&e.getAttribute("correct_seq")>0&&t==e.getAttribute("correct_seq")&&n++):(r!=e.getAttribute("is_correct")&&(s=!1),"undefined"!=typeof calculatePoint&&e.getAttribute("is_correct")>0&&r==e.getAttribute("is_correct")&&n++),i+=e.getAttribute("optID")+"|"+t+"|"+r+","})),"undefined"!=typeof calculatePoint&&calculatePoint(C.find(e,"#sortable").getAttribute("totalCorrectAns"),n),I.userAnsXML='<SMANS type="6"><list useranswer="'+i+'" /></SMANS>',t.u=I.userAnsXML,t.b=s,t},I.touchHandler=function(e){var t=e.changedTouches[0],s="";switch(e.type){case"touchstart":s="mousedown";break;case"touchmove":s="mousemove";break;case"touchend":s="mouseup";break;default:return}var n=document.createEvent("MouseEvent");n.initMouseEvent(s,!0,!0,window,1,t.screenX,t.screenY,t.clientX,t.clientY,!1,!1,!1,!1,0,null),t.target.dispatchEvent(n)},I.init=function(e){document.addEventListener("touchstart",I.touchHandler,!0),document.addEventListener("touchmove",I.touchHandler,!0),document.addEventListener("touchend",I.touchHandler,!0),document.addEventListener("touchcancel",I.touchHandler,!0),C.bind(e,"touchstart",(function(e){e.preventDefault()})),C.bind(e,"touchmove",(function(e){e.preventDefault()}))},I.shouldselect=!1,I.readyThis=function(e){(null!=typeof isTouchable||isiPad)&&setTimeout((function(){C.find(e,"#sortable").removeAttribute("onmouseup"),C.listen(C.find("body",e),"click","#sortable",(function(){var t=window.event;I.ow=t.srcElement?t.srcElement:t.target,I.t=setTimeout((function(){I.setUserAns(e,I.ow,I.shouldselect)}),100)})),"0"!=document.querySelector("#sortable").getAttribute("checkseq")&&new E(C.find(e,"#sortable"),{onEnd:function(t){I.ow=t.srcElement?t.srcElement:t.target,I.t=setTimeout((function(){I.setUserAns(e,I.ow,I.shouldselect)}),100)}})}),200)},I.bindKeyup=function(e){var t=0;function s(e,t=1){if(e.id){let s=C.selectAll(".ks"),n=-1;for(let r=0;r<s.length;r++)if(e.id==s[r].id){n=t?r==s.length-1?0:r+1:0==r?s.length-1:r-1;break}-1!=n&&s[n].focus()}}function n(){var s,n;t=0,s=C.find(e,"#sortable .copied"),n=C.find(e,".ks").length,s.classList.contains("copied")&&(0==t?s.insertBefore(C.find(e,".ks:nth(0)")):s.insertAfter(C.find(e,".ks:nth("+t+")"))),C.find(e,".ks:nth("+t+")").focus(),t==n-1?t=0:t++}function r(){var e=!1;let t=C.selectAll("#sortable li"),s=C.select(":focus");if(s.nodeName){let n=s.getAttribute("id");for(let s=0;s<t.length;s++)if(n==t[s].getAttribute("id")){e=!0;break}}return e}L.unbind("down,up,enter,alt+down,delete,left,right,tab,shift+tab,esc","choose"+e),C.find(e,"#sortable li","all").forEach((e=>{e.classList.add("ks")})),C.bind(document,"click",(function(){r()||C.find(e,"#sortable .copied",{action:"removeClass",actionData:"copied"})})),C.listen(document,"keydown",e,(function(){L.setScope("choose"+e)})),L("down, up, enter, alt+down, delete, left, right, tab, shift+tab, esc","choose"+e,(function(t,o){switch(o.key){case"up":case"left":if(r()){var i=C.find(e,"#sortable .copied"),a=C.find(e,".ks").length;let n=C.select(".ks:focus"),r=C.selectAll(".ks")[0];n.id==r.id?i&&i.classList.contains("copied")?(i.insertAfter(C.find(e,".ks:nth("+(a-1)+")")),i.focus()):C.selectAll(".ks")[C.selectAll(".ks").length-1].focus():i&&i.classList.contains("copied")?(i.insertBefore(C.find(e,"#sortable .copied").previousElementSibling),i.focus()):s(n,0),t.preventDefault()}break;case"down":case"right":if(r()){console.log("check");i=C.find(e,"#sortable .copied"),C.selectAll(e+" .ks").length;let n=C.select(".ks:focus"),r=C.selectAll(".ks")[C.selectAll(".ks").length-1];if(n.id==r.id)i&&i.classList.contains("copied")?(i.insertBefore(C.find(e,".ks:nth(0)")),i.focus()):C.selectAll(".ks")[0].focus();else if(i&&i.classList.contains("copied")){var l=C.find(e,"#sortable .copied").nextSibling.cloneNode(!0);i.insertAfter(l,C.find(e,"#sortable .copied").nextSibling),i.focus()}else s(n,1);t.preventDefault()}break;case"enter":r()&&(t.preventDefault(),"0"==C.find(e,"#sortable").getAttribute("checkseq")?(I.ow=C.find(e,"#sortable li:focus","all")[0],I.t=setTimeout((function(){I.setUserAns(e,I.ow,!0)}),100)):"1"==C.find(e,"#sortable").getAttribute("checkseq")&&(C.find(e,"#sortable li:focus").classList.contains("copied")?(I.ow=C.find(e,"#sortable li:focus","all")[0],I.t=setTimeout((function(){I.setUserAns(e,I.ow,!C.find(e,"#sortable li:focus").classList.contains("choose_sel"))}),100),C.find(e,"#sortable li:focus",{action:"removeClass",actionData:"copied"})):(I.ow=C.find(e,"#sortable li:focus","all")[0],I.t=setTimeout((function(){I.setUserAns(e,I.ow,!C.find(e,"#sortable li:focus").classList.contains("choose_sel"))}),100),C.find(e,"#sortable li:focus",{action:"addClass",actionData:"copied"}))));break;case"alt+down":n();break;case"delete":r()&&(I.ow=C.find(e,"#sortable li:focus","all")[0],I.t=setTimeout((function(){I.setUserAns(e,I.ow,!0)}),100));break;case"tab":r()&&C.find(e,"#sortable .copied",{action:"removeClass",actionData:"copied"});let o=C.selectAll(".ks:focus"),c=C.selectAll(".ks")[C.selectAll(".ks").length-1];o.id==c.id&&(t.preventDefault(),C.selectAll(".ks")[0].focus());break;case"shift+tab":r()&&C.find(e,"#sortable .copied",{action:"removeClass",actionData:"copied"}),o=C.selectAll(".ks:focus"),c=C.selectAll(".ks")[C.selectAll(".ks").length-1],o.id==c.id&&(t.preventDefault(),C.selectAll(".ks")[C.selectAll(".ks").length].focus());break;case"esc":r()&&(t.preventDefault(),C.find(e,"#sortable .copied",{action:"removeClass",actionData:"copied"}),C.selectAll(".ks")[C.selectAll(".ks").length-1].focus(),C.selectAll(".ks")[C.selectAll(".ks").length-1].blur())}})),L.setScope("choose"+e)},I.cmd=function(e,t){I.shouldselect=!0},I.cmm=function(e,t){t||(t=window.event);var s=t.srcElement?t.srcElement:t.target;if(s.classList.contains("prefix")&&(s=s.parentElement),s){var n=s.getAttribute("user_answer");I.shouldselect=!1,"0"==n&&(I.shouldselect=!0)}},I.cmu=function(e,t,s=!1){s?I.ow=t:(t||(t=window.event),I.ow=t.srcElement?t.srcElement:t.target),I.ow.classList.contains("prefix")&&(I.ow=I.ow.parentElement),I.t=setTimeout((function(){I.setUserAns(e,I.ow,I.shouldselect)}),100)},I.setUserAns=function(e,t,s){if("IMG"==t.tagName?(M=C.parent(t,"li").getAttribute("user_answer"),T=C.parent(t,"li").getAttribute("user_seq"),P=C.find(e,"#sortable").getAttribute("checkSeq")):(M=t.getAttribute("user_answer"),T=t.getAttribute("user_seq"),P=C.find(e,"#sortable").getAttribute("checkSeq")),"UL"!=t.tagName){if(s)if("1"==M)if("IMG"==t.tagName){let e=C.parent(t,"li");C.setAttr(e,{user_answer:0}),e.classList.remove("choose_sel"),"1"!=P&&C.find(e,".prefix","all").classList.remove("tick")}else C.setAttr(t,{user_answer:0}),t.classList.remove("choose_sel"),"1"!=P&&C.find(t,".prefix",{action:"removeClass",actionData:"tick"});else if("IMG"==t.tagName){if(C.find(document.querySelector(t).parentElement,"li","all").setAttribute("user_answer",1),C.select(t.parentElement).classList.add("choose_sel"),"1"!=P){let e=C.parent(t,"li");C.find(e,".prefix").classList.add("tick")}}else C.setAttr(t,{user_answer:1}),t.classList.add("choose_sel"),"1"!=P&&C.find(t,".prefix",{action:"addClass",actionData:"tick"});if("1"==P){var n=1;C.find(e,"#sortable li","all").forEach((e=>{1==e.getAttribute("user_answer")?(C.find(e,".prefix").innerHTML=n,C.setAttr(e,{user_seq:n}),n++):(C.find(e,".prefix").innerHTML="",C.setAttr(e,{user_seq:0}))}))}I.CheckResultchoose(e),I.shouldselect=!1}else I.shouldselect=!1},I.removeItem=function(){C.remove(e1.parentElement.parentElement),document.querySelectorAll(".choose_item_container").innerHTML.trim().length<=200?document.querySelector(".message_content").style.display="block":document.querySelector(".message_content").style.display="none"},I.addItem=function(){document.querySelector(".message_content").style.display="none",C.insert(".choose_item_container",'<div class="clearfix mt choose_options"><div class="col-md-12 mt-head"><input class="choose_compls" type="checkbox"><textarea></textarea><span class="remove-item icomoon-24px-delete-1"></span></div></div>',"afterbegin")},I.setDragSequence=function(e,t,s){var n=1;C.find(e,"#sortable li","all").forEach((e=>{C.setAttr(e,{user_seq:n}),n++})),0==s&&C.find(e,"#sortable li","all").forEach((e=>{e.classList.remove("choose_sel")})),I.CheckResultSentenceChoose(e)},I.CheckResultSentenceChoose=function(e){var t=!0;let s={};P=C.find("#choose","#sortable").getAttribute("checkSeq");var n="";return C.find(e,"#sortable li","all").forEach((e=>{T=e.getAttribute("user_seq"),j=e.getAttribute("correct_seq"),M=e.getAttribute("user_answer"),T!=j&&0!=e.getAttribute("correct_seq")&&(t=!1),n+=e.getAttribute("optID")+"|"+T+"|"+M+","})),I.userAnsXML='<SMANS type="6"><list useranswer="'+n+'" /></SMANS>',ISSPECIALMODULEUSERXMLCHANGE=1,document.querySelector("#special_module_user_xml")&&(document.querySelector("#special_module_user_xml").value=I.userAnsXML),document.querySelector("#answer")&&C.setAttr("#answer",{checked:t}),s.u=I.userAnsXML,s.ans=t,s},I.dragSenParItem=function(e){new E(C.find(e,"#sortable"),{onStart:function(e){console.log("start =>"+e)},onEnd:function(t){console.log("end =>"+t),I.setDragSequence(e,t.item)}}),I.CheckResultchoose(e)},I.setActiveClass=function(e,t){C.find(e,"#sortable").getAttribute("checkSeq");C.find(e,"#sortable li","all").forEach((e=>{1==e.getAttribute("user_answer")&&0==t||1==e.getAttribute("is_correct")&&1==t?e.classList.add("choose_sel"):e.classList.remove("choose_sel")}))},I.removeActive=function(e){C.find(e,"#sortable li","all").forEach((e=>{e.classList.remove("choose_sel")}))},I.labBinded=!0,I.sortable=!1,I.modeOn=function(e){C.selectAll(".test","addClass","h"),C.selectAll(".review","addClass","h"),e?(C.selectAll(".review","removeClass","h"),I.unBindLab(),void 0!==L&&L.unbind("down,up,enter,alt+down,delete,left,right,tab,shift+tab,esc","choose"+I.ajax_eId),C.find(I.ajax_eId,".copied","all").forEach((e=>{e.classList.remove("copied")})),null!=document.querySelector("#show_ans_group button")&&document.querySelector("#show_ans_group button").forEach((e=>{e.classList.contains("correct-ans btn-primary")?I.showAns(I.ajax_eId,e,"c"):e.classList.contains("your-ans btn-primary")&&I.showAns(I.ajax_eId,e,"u")}))):(C.selectAll(".test","removeClass","h"),setTimeout((function(){I.callBindKey()}),100),I.review(I.ajax_eId,0),I.bindLab())},I.callBindKey=function(){void 0!==L?I.bindKeyup(I.ajax_eId):(I.errorCatchFlag<=50?setTimeout((function(){I.callBindKey()}),100):console.log("hotkeys not found"),I.errorCatchFlag++)},I.unBindLab=function(){I.labBinded=!1,"normal"==document.querySelector(I.ajax_eId).getAttribute("type")&&C.find(I.ajax_eId,"#sortable").removeAttribute("onmouseup onmousemove onmousedown"),C.find(I.ajax_eId,"#sortable").classList.contains("ui-sortable")&&(I.sortable=!0)},I.bindLab=function(){I.labBinded=!0,C.bind(document.querySelector("#sortable"),"mouseup",(function(e){I.cmu(I.ajax_eId,e)})),C.bind(document.querySelector("#sortable"),"mousemove",(function(e){I.cmm(I.ajax_eId,e)})),C.bind(document.querySelector("#sortable"),"mousedown",(function(e){I.cmd(I.ajax_eId,e)})),Array.isArray(C.find(I.ajax_eId,"#sortable"))||new E(C.find(I.ajax_eId,"#sortable"),{animation:150,onEnd:function(e){I.cmu(I.ajax_eId,e.item,!0),C.select(I.ajax_eId).click()}}),"sentence"!=document.querySelector(I.ajax_eId)?.getAttribute?.("type")&&"paragraph"!=document.querySelector(I.ajax_eId)?.getAttribute?.("type")||I.dragSenParItem(I.ajax_eId)};export default class extends t{constructor(e){super(),s(this,e,H,U,n,{cmed:11,showAns:12,xml:13,stopPreviewUpdate:14,editorState:15,isReview:0,uxml:16})}}
//# sourceMappingURL=ChooseNReorderPreview-85016427.js.map
