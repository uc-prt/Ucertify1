import{E as e,N as t,S as i,i as l,s as a,D as s,e as r,j as n,c as o,m as d,t as c,a as u,d as p,b as h,f as m,g,h as f,k as b,n as A,o as x,p as y,A as w,C as v,X as k,V as _,w as E,G as L,u as $}from"./main-75ae509f.js";import{I as M}from"./ItemHelper-39d01ef6.js";import"./style-inject.es-1f59c1d0.js";import{F as I}from"./mathquill-be309a09.js";const T=new e;let S={};const C=new class{constructor(e){this.userAnsXML="",this.sInfo=!0,this.labBinded=!0,this.delPreSpaces={},this.init(),this.iscorrect="-2"}init(){this.delPreSpaces={loopGaurd:0,withLines:e=>{this.delPreSpaces.loopGaurd>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide"));var t=T.selectAll(".linenums li").length,i=[];if(0==t&&this.delPreSpaces.loopGaurd<=4)return this.delPreSpaces.loopGaurd++,setTimeout((()=>{this.delPreSpaces.withLines(e)}),1e3),!1;this.showFillModule(e),T.selectAll(".linenums li").forEach(((e,t)=>{"&nbsp;"==T.find(e,"span").innerHTML||""==T.find(e,"span").innerHTML?e.remove():i.push(e)})),i.forEach(((e,t)=>{if(e.children.classList.contains("fillelement")||e.children.classList.contains("dropable")){let t;e.children.forEach((e=>{""==e.innerHTML?e.remove():t=e})),T.prevElm(e).append(t),T.insert(T.prevElm(e),T.nextElm(e).innerHTML,"beforeend"),T.nextElm(e).remove(),e.remove()}}))},withoutLines:e=>{T.find(e,".fillelement,.dropable","all").forEach((t=>{var i=T.prevElm(t).innerHTML.trim(),l=T.nextElm(t).innerHTML.trim();if(delPreSpaces.loopGaurd>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide")),0==T.find(e,".kwd","all").length&&delPreSpaces.loopGaurd<=4)return delPreSpaces.loopGaurd++,setTimeout((()=>{delPreSpaces.withoutLines(e)}),1e3),!1;this.showFillModule(e),""==i?T.prevElm(t).remove():T.prevElm(t).innerHTML=i,""==l?T.nextElm(t).remove():T.nextElm(t).innerHTML=l}))},showFillModule:e=>{"function"==typeof activate&&activate(0),"undefined"!=typeof quizPlayerStatic&&"undefined"!=typeof QuizPlayer&&QuizPlayer.setNewHeight(quizPlayerStatic),T.selectAll(e,"show")}}}setUpdate(e){this.updateModule=e}readyFill(e){let i="",l="";T.bind(e+" select","change",(()=>{T.trigger(e,"click")})),this.dragOptionFill={appendTo:"body",zIndex:100,revert:e=>{if(!e)return this.sInfo&&(this.sInfo=!1,setTimeout((function(){this.sInfo=!0}),6e4),T.showmsg("While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.",100)),!0},helper:t=>{var i=t.target;try{return i.classList.contains("dropable")&&(i=T.find(e,"#"+t.target.getAttribute("droped"))),this.img={width:T.select(i).clientWidth,height:"auto"},t.target.draggable("option","cursorAt",{left:Math.floor(this.img.width/2),top:-10}),t.target.cloneNode(!0).css({width:this.img.width+"px",height:this.img.height+"px",position:"absolute","text-align":"center"})}catch(e){console.warn("Helper:",e)}},onDragStart:e=>{e.target.dataset.drag_enable=!0},onDragEnter:e=>{e.target.classList.add("drop-hover")},onDragLeave:e=>{e.target.classList.remove("drop-hover")},onDrop:(t,i)=>{const a=t.target,s=i.getAttribute("droped")?i.getAttribute("droped"):i.getAttribute("id");a.getAttribute("droped").trim(),a.innerHTML=i.innerHTML,T.select(a,"attr",{userans:s,droped:s,path:i.getAttribute("path")}),T.select(a,"css",{backgroundColor:i.style.backgroundColor}),l=a.id,this.checkAns(e),a.classList.remove("drop-hover")},onDragEnd:(t,a)=>{let s=t.target;if(s.classList.contains("dropable")&&(s.dataset.drag_enable,T.select(s,"css",{backgroundColor:s.getAttribute("bgcolor")}),s.textContent=s.getAttribute("caption"),T.selectAll(s,"attr",{droped:"",userans:""})),i=s.id,s.classList.contains("dropable")){const e=T.select("#"+l).getAttribute("droped");e&&1==T.select("#"+e).getAttribute("drag-single")&&this.dnd.disableDrag("#"+e)}else if(i&&1==T.select("#"+i).getAttribute("drag-single")&&""!=l){this.dnd.disableDrag("#"+i),S&&Object.entries(S)&&S[l]&&(S[l].setAttribute("draggable","true"),S[l].setAttribute("aria-disabled","false"),S[l].classList.remove("ui-draggable-disabled","ui-state-disabled"));let e=document.querySelector("#"+i);e.setAttribute("draggable","false"),e.setAttribute("aria-disabled","true"),e.classList.add("ui-draggable-disabled","ui-state-disabled"),S[l]=e}this.checkAns(e),l=""},scroll:"true",refreshPositions:!0,cursor:"default"},window.fillid=e,this.dnd||(this.dnd=new t(this.dragOptionFill)),T.find(e,".dragable","all").forEach((e=>this.dnd.setDrag(e))),T.find(e,".dropable","all").forEach((e=>{const t=e.getAttribute("droped");t&&1==T.select("#"+t).getAttribute("drag-single")&&this.dnd.disableDrag(T.select("#"+t))})),T.find(e,"[droped*=ID]","all").forEach(((t,i)=>{"0"==T.find(e,"#"+t.getAttribute("droped")).getAttribute("multi_drag")&&this.dnd.disableDrag(T.find(e,"#"+t.getAttribute("droped")))})),T.find(e,".dropable","all").forEach((e=>this.dnd.setDrop(e)))}bindKeyup(e){T.find(e,".fillelement","all").forEach((e=>{T.selectAll(Array.from(e.children),"addClass","ks")})),T.find(e,".dragable","all").forEach((e=>{e.classList.add("ks")})),T.find(e,".dropable","all").forEach((e=>{e.classList.add("ks")}));let t="",i="",l="";function a(t){let a=t.getAttribute("userans");if(t.classList.contains("dropable")&&(t.getAttribute("drag_enable")&&t.getAttribute("droped"),t.style.backgroundColor=t.getAttribute("bgcolor"),t.innerText=t.getAttribute("caption"),t.setAttribute("droped",""),t.setAttribute("userans","")),i=t.getAttribute("id"),T.select("#"+i).classList.contains("dropable")){var s=l&&T.select("#"+l).getAttribute("droped");s&&1==T("#"+s).getAttribute("drag-single")||T.select("#"+a)&&(T.select("#"+a).setAttribute("draggable","true"),T.select("#"+a).setAttribute("aria-disabled","false"),T.select("#"+a).classList.remove("ui-draggable-disabled","ui-state-disabled"),T.select("#"+a).classList.add("dragable"))}else if(1==T.select("#"+i).getAttribute("drag-single")&&""!=l){!function(e){let t="object"==typeof e?e:document.querySelector(e);t&&(t.removeAttribute(["dragable","draggable"]),t.classList.remove("dragable"))}("#"+i),Object.entries(S)&&S[l]&&(S[l].setAttribute("draggable","true"),S[l].setAttribute("aria-disabled","false"),S[l].classList.remove("ui-draggable-disabled","ui-state-disabled"));let e=document.querySelector("#"+i);e.setAttribute("draggable","false"),e.setAttribute("aria-disabled","true"),e.classList.add("ui-draggable-disabled","ui-state-disabled"),S[l]=e}setTimeout((function(){C.checkAns(e)}),100),l=""}T.listen(document,"click",e,((i,l)=>{window.isReview||this.checkFocus("ks")||(T.selectAll(T.find(e,".copiedclr","all"),"removeClass","copiedclr"),t="")})),T.listen(document,"keydown",".dragable",(function(i,l){var a;13===l.which&&(window.learn||((a=T.select(e+" .ks:focus")).classList.contains("dragable")&&!a.classList.contains("ui-state-disabled")?(T.selectAll(e+" .dragable").forEach((function(e){e.classList.contains("copiedclr")&&e.classList.remove("copiedclr")})),t=a.id,a.classList.add("copiedclr")):showmsg("You cannot drop this, as it is already dropped",3)))})),T.listen(document,"keydown",".dropable",(function(i,s){var r;13===s.which?window.learn||function(){var i=T.select(e+" .ks:focus");if(""!=t&&i.classList.contains("dropable")){var s=T.select(".footerStr #"+t);s.classList.remove("copiedclr"),s.setAttribute("drag_enable",!0);var r=s.getAttribute("droped")?s.getAttribute("droped"):s.getAttribute("id");i.getAttribute("droped").trim(),""==T.find(e,"#"+r).innerText&&(s.style.backgroundColor="transparent"),i.innerHTML=s.innerHTML,i.setAttribute("userans",r);let n=window.getComputedStyle(s);i.style.backgroundColor=n.getPropertyValue("background-color"),i.setAttribute("droped",r),i.setAttribute("path",s.getAttribute("path")),l=i.getAttribute("id"),C.checkAns(e),a(s),t=""}}():8===s.which&&(window.learn||(r=T.select(e+" .ks:focus")).getAttribute("droped")&&(r.setAttribute("drag_enable",!0),a(r)))}))}checkFocus(e){this.checkAns&&this.checkAns(ajax_eId);var t=!1;return T.find(ajax_eId,"."+e,"all").forEach((e=>{if(T.isFocus(e))return t=!0,!1})),t}showdragans(e,t,i){void 0===i&&(i=0),T.find(e,"select,input,textarea,.dropable,span.edit_step","all").forEach((l=>{this.showchilddragans(e,l,t,i)}))}showchilddragans(e,t,i,l){let a=-2;if(t.classList.contains("dropable"))if(t.innerHTML=t.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{"background-color":t.getAttribute("bgcolor")}),"c"==i)t.getAttribute("anskey").split(",").forEach(((i,l)=>{if(""!=i.trim()){const l=T.find(e,"#"+i);return l&&(t.innerHTML=l.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{backgroundColor:l.getAttribute("bgcolor")})),!1}}));else if("u"==i){a=-1,""!=t.getAttribute("userans").trim()&&(this.userans=T.find(e,"#"+t.getAttribute("userans")),this.userans&&(t.innerHTML=this.userans.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{backgroundColor:this.userans.getAttribute("bgcolor")})));const i=t.getAttribute("anskey"),l=t.getAttribute("userans");""!=l&&i.indexOf(l)>-1&&(a=1)}if(t.classList.contains("edit_step")&&1==l&&("c"==i?T.selectAll(".edit_step","css",{border:"none",display:"none"}):"u"==i&&(T.selectAll(".edit_step","css",{cursor:"none",display:"block"}),a=this.fillTestText(e,t))),t.parentElement.classList.contains("fillelement"))if("SELECT"==t.nodeName)a=-1,this.totalcorrect=T.find(t,"[correctans='1']","all").length,this.a=0,T.find(t,"option","all").forEach(((e,t)=>{e.removeAttribute("selected"),e.selected=!1,"c"==i?e.getAttribute("correctans")>0&&(e.selected=!0):"u"==i&&(e.getAttribute("userans")>0&&(e.selected=!0),e.selected&&1==e.getAttribute("correctans")&&this.a++)})),this.totalcorrect==this.a&&(a=1);else if("INPUT"==t.nodeName||"TEXTAREA"==t.nodeName)if(void 0===t.type&&(this.type="text"),"c"==i){var s=t.getAttribute("anskey").split(",");if(s.length>1){var r="<p style='text-align:left;'>All of the answers are correct!<br>";s.forEach(((e,t)=>{r+="("+(t+1)+") "+e.replace(/#cm/g,",")+"<br>"})),setTimeout((function(){T.select(t.parentElement,"attr",{rel:"multiple_answers",title:r+"</p>","data-bs-toggle":"tooltip","data-toggle":"tooltip","data-bs-html":"true","data-html":"true"}),T.enableBsAll("[data-bs-toggle='tooltip']","Tooltip",{container:"body"})}),300)}t.value=t.getAttribute("anskey").replace(/#cm/g,",")}else if("u"==i){if(t.parentElement.removeAttribute("data-original-title"),t.parentElement.removeAttribute("data-html"),t.parentElement.removeAttribute("data-bs-html"),t.parentElement.removeAttribute("data-bs-toggle"),t.parentElement.removeAttribute("rel"),t.parentElement.removeAttribute("data-toggle"),""==t.getAttribute("userans")&&""!==t.getAttribute("defaultAns"))t.value=t.getAttribute("defaultAns");else{var n=t.getAttribute("userans");"TEXTAREA"==t.nodeName&&(n=(n=n.replace(/#singlequote#/g,"'")).replace(/#dblquote#/g,'"')),t.value=n}a=this.fillTestText(e,t)}if("u"==i&&1==l){if(-2!=a&&1!=parseInt(T.select(e).getAttribute("manual_grade"))){const e=this.markUserAnswer(a);t.classList.contains("dropable")?(T.insert(t,e,"beforeend"),t.setAttribute("as",a)):t.classList.contains("edit_step")?(1==a?T.selectAll("#"+t.getAttribute("id"),"css",{border:"2px solid green"}):T.selectAll("#"+t.getAttribute("id"),"css",{border:"2px solid red"}),t.setAttribute("as",a)):(T.insert(t.parentElement,e,"beforeend"),t.parentElement.setAttribute("as",a))}t.setAttribute("title",1==a?"is marked as Correct":"is marked as incorrect")}else T.find(e,".correct_incorrect_icon_fill",{action:"remove"}),t.setAttribute("title","");this.iscorrect=a}fillTestText(e,t){var i=-1,l=t.getAttribute("anskey").trim(),a=t.value?t.value.trim():"",s=t.getAttribute("haskeywords"),r=t.getAttribute("hasnotkeywords"),n=t.getAttribute("codetype"),o=t.getAttribute("mathtype");if("TEXTAREA"!=t.nodeName){/\d,\d/.test(a)&&(a=t.value.trim().replace(/,/g,"#cm"));let e=a.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g);a.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g)&&(e=e.toString().replace(/,/g,"#cm")),a=a.replace(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g,e)}if(1==n){var d=[/\s+/g,/\;$/,/"/g],c=["","","'"];for(let e=0;e<d.length;e++)a=a.replace(d[e],c[e]),l=l.replace(d[e],c[e])}if(1==o&&(a=t.getAttribute("userans").trim()),1==T.select(e).getAttribute("matchtype")&&(l=l.toLowerCase(),a=a.toLowerCase()),1==T.select(e).getAttribute("ignoretype")){if(0!=T.select(e).getAttribute("multi")){var u=[];l.split(",").forEach(((e,t)=>{u.push(e.replace(/[^a-zA-Z0-9]/gi,""))})),l=u.join(",")}else l=l.replace(/[^a-zA-Z0-9]/gi,"");a=a.replace(/[^a-zA-Z0-9]/gi,"")}if(1==t.getAttribute("keywordtype")&&s.length>0&&r.length>0){var p=0,h=0;s.split(",").forEach(((e,t)=>{-1!=a.indexOf(e)&&p++})),r.split(",").forEach(((e,t)=>{-1!=a.indexOf(e)&&h++})),s.split(",").length==p&&0==h&&(a=l)}return 0!=T.select(e).getAttribute("multi")?""!=(a=a.replace(/,/gm,"#cm"))&&this.checkInArray(l.split(","),a.split(","))&&(i=1,a=a.replace(/#cm/gm,",")):a==l&&(i=1),i}markUserAnswer(e){const t='<span class="'+(1==e?"icomoon-new-24px-checkmark-circle-1 font-weight-bold":"icomoon-new-24px-cancel-circle-1 font-weight-bold")+'" style="color:'+(1==e?"green":"red")+';">';let i='<span class="correct_incorrect_icon_fill" style="background:white;border-radius:15px 12px 12px;"> '+t+"</span></span>";return T.find(ajax_eId,".prettyprint","all").length>0&&(i='<span class="correct_incorrect_icon_fill" style="bottom:22px;background:none;border-radius:12px;"> '+t+"</span></span>"),i}checkAns(e){if(this.userAnsXML="<smans type='9'>\n",this.result=!0,this.temp=0,T.find(e,"select,input,textarea,.dropable,span.edit_step.mathquill","all").forEach((t=>{this.userAnsXML=this.checkChildAnswer(e,t,this.userAnsXML)})),this.userAnsXML+="</smans>",window.ISSPECIALMODULEUSERXMLCHANGE=1,T.select("#special_module_user_xml").value=this.userAnsXML,1!=parseInt(T.select(e).nodeName&&T.select(e).getAttribute("manual_grade")||"1"))return T.select("#answer").checked=!!this.result,this.result?(T.select("#answer").checked=!0,"undefined"!=typeof is_sm&&T.showmsg("Correct",3),"Correct"):(T.select("#answer").checked=!1,"undefined"!=typeof is_sm&&T.showmsg("Incorrect",3),"Incorrect")}checkInArray(e,t){let i=[];for(let l=0;l<e.length;l++)for(let a=0;a<t.length;a++)i.includes(t[a])||t[a].trim()!=e[l].trim()||i.push(t[a]);return 0==t.length-i.length}checkChildAnswer(e,t,i){if(t.classList.contains("dropable")){var l=t.getAttribute("anskey").split(",");null==T.findInArray(t.getAttribute("userans"),l)||0==T.findInArray(t.getAttribute("userans"),l)?this.result=!1:this.temp++,"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp),i+=`<div id='${t.getAttribute("id")}' userAns='${t.getAttribute("userans")}'></div>\n`}else if(t.classList.contains("mathquill")){for(var a=[],s=t.getAttribute("id"),r=t.getAttribute("anskey").trim(),n=t.getAttribute("userans").trim(),o=MathQuill.getInterface(2).StaticMath(document.getElementById(s)),d=0;d<=o.innerFields.length-1;d++)a[d]=o.innerFields[d].latex();let e=n,l=n.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);if(a.indexOf("")<0)for(d in l){const t="\\MathQuillMathField{"+a[d]+"}",i=l[d].replace(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g,t),s=l[d];e=e.replace(s,i)}let c=n=e;r!=c?this.result=!1:this.temp++,t.setAttribute("userans",c),i+=`<div id='${t.getAttribute("id")}' userAns='${c}' anskey='${r}' userAnsSeq='${t.getAttribute("userAnsSeq")}'></div>\n`}else if(t.parentElement.classList.contains("fillelement"))if("SELECT"==t.nodeName)this.uAnsSel="",this.a=0,this.totalcorrect=T.find(t,"[correctans='1']","all").length,T.find(t,"option","all").forEach(((e,t)=>{e.setAttribute("userans",""),e.selected&&(this.a++,1!=e.getAttribute("correctans")?this.result=!1:this.temp++,this.uAnsSel=this.uAnsSel+t+",",e.setAttribute("userans",t))})),this.a!=this.totalcorrect&&(this.result=!1),"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp),i+=`<div id='${t.parentElement.getAttribute("id")}' userAns='${this.uAnsSel}'></div>\n`;else if("INPUT"==t.nodeName||"TEXTAREA"==t.nodeName){r=t.getAttribute("anskey").trim();var c=t.value.trim(),u=t.getAttribute("codetype");if(t.setAttribute("userans",c),1==u){var p=[/\s+/g,/\;$/,/"/g],h=["","","'"];for(let e=0;e<p.length;e++)c=c.replace(p[e],h[e]),r=r.replace(p[e],h[e])}if(1==T.select(e).getAttribute("matchtype")&&(r=r.toLowerCase(),c=c.toLowerCase()),1==T.select(e).getAttribute("ignoretype")){if(0!=T.select(e).getAttribute("multi")){let e=[];r.split(",").forEach(((t,i)=>{e.push(t.replace(/[^a-zA-Z0-9]/gi,""))})),r=e.join(",")}else r=r.replace(/[^a-zA-Z0-9]/gi,"");c=c.replace(/[^a-zA-Z0-9]/gi,"")}if(0!=T.select(e).getAttribute("multi")||r.includes("#cm"))""!=(c=c.replace(/,/g,"#cm"))&&this.checkInArray(r.split(","),c.split(","))?this.temp++:this.result=!1;else{var m=t.getAttribute("haskeywords"),g=t.getAttribute("hasnotkeywords");if(1==t.getAttribute("keywordtype")&&m.length>0&&g.length>0){var f=0,b=0;m.split(",").forEach(((e,t)=>{-1!=c.indexOf(e)&&f++})),g.split(",").forEach(((e,t)=>{-1!=c.indexOf(e)&&b++})),m.split(",").length!=f||0!=b?this.result=!1:this.temp++}else r!=c?this.result=!1:this.temp++}"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp);var A=t.value;"TEXTAREA"==t.nodeName&&(A=(A=A.replace(/'/g,"#singlequote#")).replace(/"/g,"#dblquote#")),t.nodeName,i+=`<div id='${t.parentElement.getAttribute("id")}' userAns='${A}'></div>\n`}return i}modeOn(e,t){T.selectAll(".test, .review","addClass","h"),e?("function"==typeof hotkeys&&(hotkeys.unbind("alt+down,enter,delete","fillintheblank"),hotkeys.deleteScope("fillintheblank")),T.selectAll(".review","removeClass","h"),this.unBindLab(),this.showdragans(ajax_eId,"u",1)):(this.bindKeyup(ajax_eId),T.selectAll(".test","removeClass","h"),this.bindLab(),this.showdragans(ajax_eId,"u"))}bindLab(){this.labBinded=!0,T.find(ajax_eId,"select,input,textarea",{action:"removeAttr",actionData:"disabled"});try{this.readyFill(ajax_eId)}catch(e){console.log("catch")}}unBindLab(){this.labBinded=!1,T.find(ajax_eId,"input,select,textarea","all").forEach((e=>{"INPUT"==this.nodeName||"TEXTAREA"==this.nodeName?e.getAttribute("userans",e.value):"SELECT"==this.nodeName&&e.querySelectorAll("option").forEach(((e,t)=>{e.selected?e.setAttribute("userans",1):e.setAttribute("userans","")}))}))}pre_fill(e){T.find(e,".fillelement,.dropable","all");T.find(e,".prettyprint","all").length>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide"),T.find(e,"pre").classList.contains("lg")&&T.selectAll(e,"css",{width:"930px"}),setTimeout((()=>{T.find(e,"pre").classList.contains("linenums")?this.delPreSpaces.withLines(e):this.delPreSpaces.withoutLines(e),this.delPreSpaces.showFillModule(e)}),1e3))}},{document:j}=s;function q(e){let t;return{c(){t=$("*Matching is not case sensitive.")},m(e,i){f(e,t,i)},d(e){e&&x(t)}}}function F(e){let t;return{c(){t=$("*Exact matching is required.")},m(e,i){f(e,t,i)},d(e){e&&x(t)}}}function z(e){let t,i;return t=new I({props:{spanId:e[6].spanId,divId:e[6].divId,action:e[3].fillMath[e[5]],show:e[10]}}),{c(){o(t.$$.fragment)},m(e,l){d(t,e,l),i=!0},p(e,i){const l={};64&i[0]&&(l.spanId=e[6].spanId),64&i[0]&&(l.divId=e[6].divId),40&i[0]&&(l.action=e[3].fillMath[e[5]]),t.$set(l)},i(e){i||(c(t.$$.fragment,e),i=!0)},o(e){u(t.$$.fragment,e),i=!1},d(e){p(t,e)}}}function N(e){let t,i,l,a,s,y,w,v,k,_,E,L,$,I,T,S,C,j,N,R,D,O={handleReviewClick:e[11],reviewMode:e[0],customReviewMode:e[7]};function H(e,t){return"0"==e[6].matchtype?F:q}l=new M({props:O}),e[17](l),l.$on("setReview",e[8]),l.$on("unsetReview",e[9]);let B=H(e),Q=B(e),X=e[6].showToolbar&&z(e);return{c(){t=r("div"),i=r("center"),o(l.$$.fragment),a=h(),s=r("div"),y=r("div"),w=h(),v=r("div"),Q.c(),k=h(),_=r("div"),E=r("div"),L=h(),$=r("center"),I=h(),X&&X.c(),m(y,"class","string"),m(y,"id","previewArea"),g(v,"color","#b94a48"),g(v,"margin-top","5px"),m(v,"class","smnotes"),m(E,"class","arrow-up"),m($,"class","dragArea"),m(_,"class","footerStr"),g(_,"display",e[6].footerStr?"block":"none"),m(s,"id",P),m(s,"class","fillmain"),m(s,"matchtype",T=e[6].matchtype),m(s,"tabindex","0"),m(s,"multi",S=e[6].multi),m(s,"ignoretype",C=e[6].ignoretype),m(s,"manual_grade",j=e[1]||0),m(s,"totalcorrectans",N=e[6].totalcorrectans),g(s,"font-family","Roboto, sans-serif"),g(s,"font-size","1em"),m(t,"class",R=e[2]?"mx-4 pl-2 pl-md-0":"")},m(e,r){f(e,t,r),n(t,i),d(l,i,null),n(i,a),n(i,s),n(s,y),n(s,w),n(s,v),Q.m(v,null),n(s,k),n(s,_),n(_,E),n(_,L),n(_,$),n(s,I),X&&X.m(s,null),D=!0},p(e,i){const a={};1&i[0]&&(a.reviewMode=e[0]),l.$set(a),B!==(B=H(e))&&(Q.d(1),Q=B(e),Q&&(Q.c(),Q.m(v,null))),(!D||64&i[0])&&g(_,"display",e[6].footerStr?"block":"none"),e[6].showToolbar?X?(X.p(e,i),64&i[0]&&c(X,1)):(X=z(e),X.c(),c(X,1),X.m(s,null)):X&&(b(),u(X,1,1,(()=>{X=null})),A()),(!D||64&i[0]&&T!==(T=e[6].matchtype))&&m(s,"matchtype",T),(!D||64&i[0]&&S!==(S=e[6].multi))&&m(s,"multi",S),(!D||64&i[0]&&C!==(C=e[6].ignoretype))&&m(s,"ignoretype",C),(!D||2&i[0]&&j!==(j=e[1]||0))&&m(s,"manual_grade",j),(!D||64&i[0]&&N!==(N=e[6].totalcorrectans))&&m(s,"totalcorrectans",N),(!D||4&i[0]&&R!==(R=e[2]?"mx-4 pl-2 pl-md-0":""))&&m(t,"class",R)},i(e){D||(c(l.$$.fragment,e),c(X),D=!0)},o(e){u(l.$$.fragment,e),u(X),D=!1},d(i){i&&x(t),e[17](null),p(l),Q.d(),X&&X.d()}}}let P="fillmain";function R(e){let t=document.querySelectorAll(".textarea.ks");for(let l=0;l<t.length;l++){let a=t[l];var i=setTimeout((function(){a.style.cssText="height:auto;overflow: auto;",e&&(window.isIE?a.style.cssText="height:"+(a.scrollHeight+10)+"px;overflow: hidden":a.style.cssText="height:"+a.scrollHeight+"px;overflow: hidden"),clearTimeout(i)}),100)}}function D(e,t,i){let l,a,{manual_grade:s}=t,{xml:r}=t,{uxml:n}=t,{isReview:o}=t,{editorState:d}=t,{smValidate:c}=t,{showAns:u}=t,p=!1,h=o,m="",g="",f=[],b=0,A=1,x=[],$={},M={};globalThis.ajax_eId="#fillmain";let I={},T=!o;E({matchtype:"0",ignoretype:"",multi:"",totalcorrectans:0,showToolbar:!1,isMathquill:!1,fillMath:[],footerStr:!1}).subscribe((e=>{i(6,I=e)}));function S(){if(i(6,I.xml=r,I),$=k(r),n&&(window.isResetMath?window.isResetMath=!1:(M=k(n),i(6,I.uxml=n,I))),function(e,t=!1){m=e.smxml.text.__cdata,g="",f=[],b=0,i(6,I.footerStr=!1,I),w.selectAll(".smnotes","hide"),e.smxml.text._matchType&&(e.smxml.text._matchtype=e.smxml.text._matchType,delete e.smxml.text._matchType);e.smxml.text._ignoreType&&(e.smxml.text._ignoretype=e.smxml.text._ignoreType,delete e.smxml.text._ignoreType);i(6,I.matchtype=e.smxml.text._matchtype,I),i(6,I.ignoretype=e.smxml.text._ignoretype,I),i(6,I.multi="multiple"==e.smxml.text._multiple?"1":"",I);let l=m.match(/%{[\s\S]*?}%/gm),a="",s="",r=0;l&&l.forEach(((e,n)=>{if(r++,t&&t.smans){let e=t.smans.div;0==Array.isArray(e)&&(e=[],e[0]=t.smans.div),e&&(s=e[n])}let o=l[n];a=l[n].match(/\|(.*?)}%$/gm),a=a?a[0].replace(/\||}%/gm,""):"",a=a.trim(),""==a||"c"==a?(w.selectAll(".smnotes","show"),s?H(o,n,s):H(o,n)):"n"==a?s?B(o,n,s):B(o,n):"d"==a||"ds"==a?s?Z(o,n,s):Z(o,n):"s"==a?s?Q(o,n,s):Q(o,n):"e"==a?(i(6,I.isMathquill=!0,I),s?O(o,n,s):O(o,n)):(a.indexOf(!1)||a.indexOf(!1))&&(w.selectAll(".smnotes","show"),s?X(o,n,s):X(o,n));o.replace("%{","").replace("}%","")}));w.selectAll("#"+P,"attr",{totalcorrectans:r}),m=w.ignoreEnity(m),w.find("#"+P,"#previewArea",{action:"html",actionData:m}),w.find("#"+P,".dragArea",{action:"html",actionData:g});let n=w.find("#"+P,".dragArea"),o=n?.children?Array.from(n.children):[];for(;o.length;)n.append(o.splice(Math.floor(Math.random()*o.length),1)[0]);(function(){let e=[];w.selectAll(".dragArea div").forEach(((t,i)=>{e.push(10*t.innerHTML.length+30)})),w.selectAll("#previewArea [id^=elem]").forEach((t=>{t.classList.contains("drag-resize")&&w.setCss(t,{"max-width":Math.max(...e)})}))})(),function(){if(w.find(ajax_eId,"table.uc-table","all").length>0){let e=w.find(ajax_eId,"table.uc-table").clientWidth+9;w.setCss(w.find(ajax_eId,".smnotes"),{width:e+"px",margin:"auto","padding-top":"21px","padding-left":"65px"})}}(),D();var d=setTimeout((function(){w.find(ajax_eId,".prettyprint","all").length>=1&&0==w.find(ajax_eId,".prettyprint .L0","all").length&&"function"==typeof prettyPrint&&(w.selectAll(".prettyprint").forEach((e=>{e.classList.add("prettyprintReplica"),e.classList.remove("prettyprint")})),w.selectAll(".linenums").forEach((e=>{e.classList.add("linenumsReplica"),e.classList.remove("linenums")})),w.find(ajax_eId,".prettyprintReplica").forEach((e=>{e.classList.add("prettyprint")})),w.find(ajax_eId,".linenumsReplica").forEach((e=>{e.classList.add("linenums")})),prettyPrint(),w.selectAll(".prettyprintReplica").forEach((e=>{e.classList.add("prettyprint"),e.classList.remove("prettyprintReplica")})),w.selectAll(".linenumsReplica").forEach((e=>{e.classList.add("linenums"),e.classList.remove("linenumsReplica")}))),clearTimeout(d)}),2e3);if(w.find(ajax_eId,"table.uc-table","all").length>0){w.find(ajax_eId,"table.uc-table",{action:"addClass",actionData:"font14"});try{"BR"==w.find(ajax_eId,"table.uc-table").previousElementSibling?.nodeName&&w.find(ajax_eId,"table.uc-table").previousElementSibling.remove()}catch(e){console.warn(e)}}}($,M),!r){let e=smVal.validate(d.content_type,d.subtype,d.content_icon);c(e)}}function j(){i(0,o=!0),window.isReview=!0,window.learn=!0,r.includes("user Response{")&&(window.isResetMath=!0),i(6,I.showToolbar=!1,I),setTimeout((function(){C.modeOn("on"),C.showdragans(ajax_eId,"u",1),w.selectAll(".remed_disable","show"),R(1);let e=document.getElementById(P);e=e?e.getElementsByClassName("mathquill"):e,e&&(AI.selectAll(".textarea").length>0&&AI.selectAll(".textarea").forEach((e=>{e.setAttribute("disabled","true")})),w.selectAll(".fillintheblank","attr",{disabled:!0})),F()}),100)}function q(){w.selectAll(".fillintheblank","attr",{disabled:!1}),i(0,o=!1),window.learn=!1,w.selectAll(".mathquill","css",{border:"none"}),C.modeOn(),w.selectAll(".remed_disable, .corr_div","hide"),setTimeout((function(){C.showdragans(ajax_eId,"u",0)}),300);let e=document.getElementById(P);e=e?e.getElementsByClassName("mathquill"):e,R(),e&&(w.selectAll(ajax_eId,"css",{position:"unset"}),w.selectAll(".spinner-wrapper","remove"))}function F(e){let t=!p&&C.checkAns(ajax_eId)||"Incorrect",i={ans:C.result,uXml:C.userAnsXML};_(i),d&&u(t)}function z(e,t){let l=!0;for(;l;)(e=e.parentElement).getAttribute("id")&&(l=!1,i(5,a=e.getAttribute("id")));let s=[];w.selectAll("#"+a+" span.mq-editable-field").forEach((t=>{let i=e.getAttribute("mathquill-command-id");s.push(i)}));let r=e.getAttribute("mathquill-command-id"),n=s.indexOf(r);i(6,I.spanId=n,I),i(6,I.divId=a,I),i(6,I.showToolbar=!0,I)}function N(e,t){i(6,I[e]=t,I),"uxml"==e&&(M=k(I.uxml),function(e){let t="",i=$.smxml.text.__cdata.match(/%{[\s\S]*?}%/gm),l="";i&&i.forEach(((i,a)=>{if(e&&e.smans){let i=e.smans.div;0==Array.isArray(i)&&(i=[],i[0]=e.smans.div),i&&(t=i[a])}if(l=i.match(/\|(.*?)}%$/gm),l=l?l[0].replace(/\||}%/gm,""):"",l=l.trim(),t&&t._userAns){let e="";""==l||"c"==l||"n"==l?e=`#elem${a} .fillintheblank`:"d"==l||"ds"==l?e="#elem"+a:"s"==l||("e"==l?e="#elem"+a:(l.indexOf(!1)||l.indexOf(!1))&&(e=`#elem${a} .textarea`)),w.isValid(e)&&document.querySelector(e)&&document.querySelector(e).setAttribute("userans",t._userAns)}}))}(M))}function D(){try{C.readyFill(ajax_eId)}catch(t){if(A<=100)var e=setTimeout((()=>{D(),clearTimeout(e)}),50);else console.warn("Error at runModule function");A++}}function O(e,t,l=!1){let a=e,s=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].replace(/user Response/g,"\\MathQuillMathField").split("##"),r=Math.floor(Math.random()*s.length),n=s[r],o=n.replace(/MathQuillMathField{(.*?)}/g,"MathQuillMathField{}"),d=0,c=n;l?l._userAns&&(o=l._userAns,l._userAnsSeq&&(c=l._anskey,r=l._userAnsSeq)):n.indexOf("MathQuillMathField")>-1&&(c=n,d=1),w.select("#elem"+t,"css",{display:"none"});let u=`<div id="main_div" class="text-center filter auto_height fillelement mathitem inline-block"><div class="disable_div fh fwidth absolute h"></div><div class="remed_disable fh fwidth absolute h"></div>\n\t\t\t<span  id="m${t}" style="display:none;" class="auto_height h corr_div fillmathelement mathquill" userAnsSeq="${r}" anskey="${c}" defaultans="${d}" mathtype="1">\n\t\t\t\t${c}\n\t\t\t</span>\n\t\t\t${`<span id="elem${t}" class="auto_height auto_width edit_step fillmathelement mathquill" userAnsSeq="${r}" userans="${o}" anskey="${c}" defaultans="${d}" mathtype="1"></span>`}\n\t\t</div>`;m=m.replace(a,u);let p=setInterval((()=>{if("function"==typeof MathQuill){clearInterval(p),w.selectAll("#elem"+t,"show");let e=MathQuill.getInterface(2);w.selectAll(".mathquill").forEach((t=>{let i=t.getAttribute("id");if(1==t.getAttribute("defaultans")){var l=t.getAttribute("userans");null!=l&&w.select("#"+i,"text",l)}else{let e=t.getAttribute("userans");null!=e&&w.select("#"+i,"text",e)}x[i]=e.StaticMath(document.getElementById(i))})),i(3,C.fillMath=x,C)}}),100)}function H(e,t,i=!1){var l="";i&&i._userAns&&(l=i._userAns);let a=e,s="",r=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&"c"==e[1].trim()?"1":"",n=e[0].trim();if(-1!=n.indexOf("#style#")){let e=n.split("#style#");n=e[0],s=e[1]}let o=[],d=n.split(",");w.selectAll(d).forEach(((e,t)=>{o[t]=10*d[t].length+30}));let c=`<div id="elem${t}" class="fillelement">${`<input type="text" class="fillintheblank ks" anskey="${n.trim()}" value="${l}" userans="${l}" defaultans="" haskeywords="" codetype="${r}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:${Math.max(...o)}px;${s}"  />`}</div>`;m=m.replace(a,c)}function B(e,t,i=!1){var l="";i&&i._userAns&&(l=i._userAns);let a=e,s="",r=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&"c"==e[1].trim()?"1":"",n=e[0].trim();if(-1!=n.indexOf("#style#")){let e=n.split("#style#");n=e[0],s=e[1]}let o=[],d=n.split(",");w.selectAll(d).forEach(((e,t)=>{o[t]=10*d[t].length+30}));let c=`<div id="elem${t}" class="fillelement">${`<input type="number" onKeyDown="if(isNaN(event.key)){var key_arr = [13, 37, 38, 39, 40, 8, 69, 101, 46, 16, 9];if(!key_arr.includes(event.keyCode)) event.preventDefault()} "class="fillintheblank ks" anskey="${n.trim()}" value="${l}" userans="${l}" defaultans="" haskeywords="" codetype="${r}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width: ${Math.max(...o)+20}px;${s}" />`}</div>`;m=m.replace(a,c)}function Q(e,t,i=!1){let l=e,a=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim();a=a.split(",").map((e=>e.trim()));let s='<option value="">&nbsp;Please Select</option>';w.selectAll(a).forEach(((e,t)=>{let l=0==a[t].indexOf("*")?"1":"0",r=0==a[t].indexOf("+")?'selected="selected"':"",n=0==a[t].indexOf("*")||0==a[t].indexOf("+")?a[t].slice(1):a[t],o="";if(i&&i._userAns){r="",t==i._userAns.split(",")[0].trim()-1&&(r='selected="selected"',o="1")}n=n.replace(/\#cm/gim,",").replace(/\#pl/gim,"+"),s+=`<option value="${t}" correctans="${l}" userans="${o}" ${r}>&nbsp;${n}</option>`}));let r=`<div id="elem${t}" class="fillelement" tabindex ="0">${`<select class="fillintheblank ks" data-role="none">${s}</select>`}</div>`;m=m.replace(l,r)}function X(e,t,i=!1){let l="";i&&i._userAns&&(l=i._userAns);let a=e,s=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim(),r=JSON.parse(e[1]),n=`<span id="elem${t}" class="fillelement" style="height:auto">${`<textarea class="textarea ks" rows="${r.rows}" cols="${r.cols}" anskey="${s}" value="${l}" defaultans="${r.defaultAns?r.defaultAns:""}" userans="${l}" haskeywords="" hasnotkeywords="" keywordtype="1" autocomplete="off" data-role="none">${l}</textarea>`}</span>`;m=m.replace(a,n)}function Z(e,t,l=!1){let a=e,s=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim(),r="ds"==e[1].trim()?"1":"0",n=s.split(","),o="";w.selectAll(n).forEach(((e,t)=>{let i=!1,l=10*n[t].length+30,a=n[t],s=n[t].match(/i~|~i/g),d="";s?a=n[t].replace(/i~|~i/g,""):(o+="ID"+b+",",d="ID"+b+","),w.selectAll(f).forEach(((e,t)=>{f[t].ans==a&&(i=!0,s||(o=o.replace(d,""),o+=f[t].id+","))})),0==i&&f.push({ans:a,id:"ID"+b}),0==i&&(g+=`<div id="ID${b}" dragable="true" tabindex="0" class="drag-resize dragable ks" caption="${a.replace(/\#cm/gim,",").replace(/\"/gim,"#doublequote#")}" path="//s3.amazonaws.com/jigyaasa_content_static/" drag-single="${r}" bgcolor="#CCFFCC" style="background-color:#CCFFCC;height:auto;max-width:${l}px;padding:3px 10px 3px 10px; margin: 2px 2px;" aria-disabled="false">${a.replace(/\#cm/gim,",")}</div>`),0==i&&b++}));let d="";l&&l._userAns&&(d=l._userAns);let c='<div id="elem'+t+'" tabindex="0" dropzone="1" class="drag-resize dropable ks" path="//s3.amazonaws.com/jigyaasa_content_static/" anskey="'+o.slice(0,-1)+'" caption="" userans="'+d+'" droped="'+d+'" bgcolor="#FFFFCC" style="background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;">'+d+"</div>";m=m.replace(a,c),i(6,I.footerStr=!0,I)}return y((async()=>{in_editor&&w.addScript("","https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"),w.addScript("",window.itemUrl+"src/libs/mathQuill_new.js"),C.setUpdate(N.bind(this));let e=document.getElementById(P);e=e?e.getElementsByClassName("mathquill"):e,I.isMathquill&&w.selectAll("div"+ajax_eId,"css",{overflow:"auto"}),w.bind(ajax_eId,"click",F),w.bind(ajax_eId,"keyup",F),w.bind(ajax_eId,"change",F),w.bind(ajax_eId,"dragend",F),w.listen(document,"click","span.mq-editable-field.mq-focused",z),w.listen(document,"change","span.mq-editable-field.mq-focused",z),S()})),v((()=>{if(r!=I.xml){if(d&&1==d.stopPreviewUpdate)return!1;S(),setTimeout((function(){let e=document.getElementById("previewArea");if(e.childNodes[0]&&"TABLE"==e.childNodes[0].nodeName){e=document.querySelectorAll("#previewArea td");for(let t in e)e[t].firstElementChild||"TD"!=e[t].nodeName||e[t].setAttribute("tabindex","0")}else for(let t in e.childNodes)if(3==e.childNodes[t].nodeType){let i=document.createElement("span");i.setAttribute("tabindex","0"),i.innerHTML=e.childNodes[t].textContent,e.childNodes[t].replaceWith(i)}}),1e3)}})),e.$$set=e=>{"manual_grade"in e&&i(1,s=e.manual_grade),"xml"in e&&i(2,r=e.xml),"uxml"in e&&i(12,n=e.uxml),"isReview"in e&&i(0,o=e.isReview),"editorState"in e&&i(13,d=e.editorState),"smValidate"in e&&i(14,c=e.smValidate),"showAns"in e&&i(15,u=e.showAns)},e.$$.update=()=>{65537&e.$$.dirty[0]&&o!=T&&(o?j():q(),i(16,T=o))},[o,s,r,C,l,a,I,h,j,q,function(e){i(6,I.showToolbar=e,I)},function(e,t){"c"==e?(p=!0,C.showdragans(ajax_eId,"c",1),w.selectAll(".corr_div","css",{display:"block"}),w.selectAll(".remed_disable","css",{display:"block"}),R(1)):(p=!1,C.showdragans(ajax_eId,"u",1),w.selectAll(".corr_div","hide"),R(1))},n,d,c,u,T,function(e){L[e?"unshift":"push"]((()=>{l=e,i(4,l)}))}]}export default class extends i{constructor(e){var t;super(),j.getElementById("svelte-1w59lbb-style")||((t=r("style")).id="svelte-1w59lbb-style",t.textContent='xmp{display:inline}#fillmain{overflow:hidden;max-width:1024px;text-align:left}#fillmain pre{background:none;border:none;font-size:14px!important}#fillmain .string{min-height:50px;margin-top:10px;margin-right:10px}#fillmain .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}#fillmain .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}#fillmain .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}#fillmain input[type="text"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}#fillmain .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}#fillmain .drag-resize.dragable{cursor:move}#fillmain .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}#fillmain .fillcheck ul{width:220px}#fillmain .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}#fillmain .select{font-size:15px}#fillmain .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}#fillmain .dragable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}#fillmain .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}#fillmain select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#171718;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Roboto, sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.auto_width{width:auto!important}.prettyprint{display:-ms-grid!important}.tooltip-inner{text-align:left}',n(j.head,t)),l(this,e,D,N,a,{manual_grade:1,xml:2,uxml:12,isReview:0,editorState:13,smValidate:14,showAns:15},[-1,-1])}}
//# sourceMappingURL=FillInTheBlanksPreview-f7827344.js.map
