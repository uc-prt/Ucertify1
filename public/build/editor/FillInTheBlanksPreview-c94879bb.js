import{G as e,Q as t,S as i,i as l,s,F as a,c as r,m as n,t as o,a as d,d as c,e as p,b as u,f as h,g as m,h as f,j as g,k as b,n as x,o as A,p as y,A as v,E as w,X as _,Z as k,w as E,I as $,u as M}from"./main-b3f3abad.js";import{I}from"./ItemHelper-bd2d1ddf.js";import{F as L}from"./mathquill-5db1b2aa.js";import"./style-inject.es-1f59c1d0.js";const T=new e;const S=new class{constructor(e){this.userAnsXML="",this.sInfo=!0,this.labBinded=!0,this.delPreSpaces={},this.init(),this.iscorrect="-2",this.previous_droped_item={}}init(){this.delPreSpaces={loopGaurd:0,withLines:e=>{this.delPreSpaces.loopGaurd>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide"));var t=T.selectAll(".linenums li").length,i=[];if(0==t&&this.delPreSpaces.loopGaurd<=4)return this.delPreSpaces.loopGaurd++,setTimeout((()=>{this.delPreSpaces.withLines(e)}),1e3),!1;this.showFillModule(e),T.selectAll(".linenums li").forEach(((e,t)=>{"&nbsp;"==T.find(e,"span").innerHTML||""==T.find(e,"span").innerHTML?e.remove():i.push(e)})),i.forEach(((e,t)=>{if(e.children.classList.contains("fillelement")||e.children.classList.contains("dropable")){let t;e.children.forEach((e=>{""==e.innerHTML?e.remove():t=e})),T.prevElm(e).append(t),T.insert(T.prevElm(e),T.nextElm(e).innerHTML,"beforeend"),T.nextElm(e).remove(),e.remove()}}))},withoutLines:e=>{T.find(e,".fillelement,.dropable","all").forEach((t=>{var i=T.prevElm(t).innerHTML.trim(),l=T.nextElm(t).innerHTML.trim();if(delPreSpaces.loopGaurd>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide")),0==T.find(e,".kwd","all").length&&delPreSpaces.loopGaurd<=4)return delPreSpaces.loopGaurd++,setTimeout((()=>{delPreSpaces.withoutLines(e)}),1e3),!1;this.showFillModule(e),""==i?T.prevElm(t).remove():T.prevElm(t).innerHTML=i,""==l?T.nextElm(t).remove():T.nextElm(t).innerHTML=l}))},showFillModule:e=>{"function"==typeof activate&&activate(0),"undefined"!=typeof quizPlayerStatic&&"undefined"!=typeof QuizPlayer&&QuizPlayer.setNewHeight(quizPlayerStatic),T.selectAll(e,"show")}}}setUpdate(e){this.updateModule=e}readyFill(e){let i="",l="";T.bind(e+" select","change",(()=>{T.trigger(e,"click")})),this.dragOptionFill={appendTo:"body",zIndex:100,revert:e=>{if(!e)return this.sInfo&&(this.sInfo=!1,setTimeout((function(){this.sInfo=!0}),6e4),T.showmsg("While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.",100)),!0},helper:t=>{var i=t.target;try{return i.classList.contains("dropable")&&(i=T.find(e,"#"+t.target.getAttribute("droped"))),this.img={width:T.select(i).clientWidth,height:"auto"},t.target.draggable("option","cursorAt",{left:Math.floor(this.img.width/2),top:-10}),t.target.cloneNode(!0).css({width:this.img.width+"px",height:this.img.height+"px",position:"absolute","text-align":"center"})}catch(e){console.warn("Helper:",e)}},onDragStart:e=>{e.target.dataset.drag_enable=!0},onDragEnter:e=>{e.target.classList.add("drop-hover")},onDragLeave:e=>{e.target.classList.remove("drop-hover")},onDrop:(t,i)=>{const s=t.target,a=i.getAttribute("droped")?i.getAttribute("droped"):i.getAttribute("id");s.getAttribute("droped").trim(),s.innerHTML=i.innerHTML,T.select(s,"attr",{userans:a,droped:a,path:i.getAttribute("path")}),T.select(s,"css",{backgroundColor:i.style.backgroundColor}),l=s.id,this.checkAns(e),s.classList.remove("drop-hover")},onDragEnd:(t,s)=>{let a=t.target;if(a.classList.contains("dropable")&&(a.dataset.drag_enable,T.select(a,"css",{backgroundColor:a.getAttribute("bgcolor")}),a.textContent=a.getAttribute("caption"),T.selectAll(a,"attr",{droped:"",userans:""})),i=a.id,a.classList.contains("dropable")){const e=T.select("#"+l).getAttribute("droped");e&&1==T.select("#"+e).getAttribute("drag-single")&&this.dnd.disableDrag("#"+e)}else if(i&&1==T.select("#"+i).getAttribute("drag-single")&&""!=l){this.dnd.disableDrag("#"+i),Object.entries(this.previous_droped_item)&&this.previous_droped_item[l]&&(this.previous_droped_item[l].setAttribute("draggable","true"),this.previous_droped_item[l].setAttribute("aria-disabled","false"),this.previous_droped_item[l].classList.remove("ui-draggable-disabled","ui-state-disabled"));let e=document.querySelector("#"+i);e.setAttribute("draggable","false"),e.setAttribute("aria-disabled","true"),e.classList.add("ui-draggable-disabled","ui-state-disabled"),this.previous_droped_item[l]=e}this.checkAns(e),l=""},scroll:"true",refreshPositions:!0,cursor:"default"},window.fillid=e,this.dnd||(this.dnd=new t(this.dragOptionFill)),T.find(e,".dragable","all").forEach((e=>this.dnd.setDrag(e))),T.find(e,".dropable","all").forEach((e=>{const t=e.getAttribute("droped");t&&1==T.select("#"+t).getAttribute("drag-single")&&this.dnd.disableDrag(T.select("#"+t))})),T.find(e,"[droped*=ID]","all").forEach(((t,i)=>{"0"==T.find(e,"#"+t.getAttribute("droped")).getAttribute("multi_drag")&&this.dnd.disableDrag(T.find(e,"#"+t.getAttribute("droped")))})),T.find(e,".dropable","all").forEach((e=>this.dnd.setDrop(e)))}bindKeyup(e){T.find(e,".fillelement","all").forEach((e=>{T.selectAll(Array.from(e.children),"addClass","ks")})),T.find(e,".dragable","all").forEach((e=>{e.classList.add("ks")})),T.find(e,".dropable","all").forEach((e=>{e.classList.add("ks")})),T.listen(document,"click",e,((t,i)=>{this.checkFocus("ks")||T.selectAll(T.find(e,".copiedclr","all"),"removeClass","copiedclr")}))}checkFocus(e){this.checkAns&&this.checkAns(ajax_eId);var t=!1;return T.find(ajax_eId,"."+e,"all").forEach((e=>{if(T.isFocus(e))return t=!0,!1})),t}showdragans(e,t,i){void 0===i&&(i=0),T.find(e,"select,input,textarea,.dropable,span.edit_step","all").forEach((l=>{this.showchilddragans(e,l,t,i)}))}showchilddragans(e,t,i,l){let s=-2;if(t.classList.contains("dropable"))if(t.innerHTML=t.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{"background-color":t.getAttribute("bgcolor")}),"c"==i)t.getAttribute("anskey").split(",").forEach(((i,l)=>{if(""!=i.trim()){const l=T.find(e,"#"+i);return l&&(t.innerHTML=l.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{backgroundColor:l.getAttribute("bgcolor")})),!1}}));else if("u"==i){s=-1,""!=t.getAttribute("userans").trim()&&(this.userans=T.find(e,"#"+t.getAttribute("userans")),this.userans&&(t.innerHTML=this.userans.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{backgroundColor:this.userans.getAttribute("bgcolor")})));const i=t.getAttribute("anskey"),l=t.getAttribute("userans");""!=l&&i.indexOf(l)>-1&&(s=1)}if(t.classList.contains("edit_step")&&1==l&&("c"==i?T.selectAll(".edit_step","css",{border:"none",display:"none"}):"u"==i&&(T.selectAll(".edit_step","css",{cursor:"none",display:"block"}),s=this.fillTestText(e,t))),t.parentElement.classList.contains("fillelement"))if("SELECT"==t.nodeName)s=-1,this.totalcorrect=T.find(t,"[correctans='1']","all").length,this.a=0,T.find(t,"option","all").forEach(((e,t)=>{e.removeAttribute("selected"),e.selected=!1,"c"==i?e.getAttribute("correctans")>0&&(e.selected=!0):"u"==i&&(e.getAttribute("userans")>0&&(e.selected=!0),e.selected&&1==e.getAttribute("correctans")&&this.a++)})),this.totalcorrect==this.a&&(s=1);else if("INPUT"==t.nodeName||"TEXTAREA"==t.nodeName)if(void 0===t.type&&(this.type="text"),"c"==i){var a=t.getAttribute("anskey").split(",");if(a.length>1){var r="<p style='text-align:left;'>All of the answers are correct!<br>";a.forEach(((e,t)=>{r+="("+(t+1)+") "+e.replace(/#cm/g,",")+"<br>"})),T.setAttr(t,{rel:"multiple_answers",title:r+"</p>","data-html":"true"})}t.value=t.getAttribute("anskey").replace(/#cm/g,",")}else if("u"==i){if(t.removeAttribute(["rel","title","data-html"]),""==t.getAttribute("userans")&&""!==t.getAttribute("defaultAns"))t.value=t.getAttribute("defaultAns");else{var n=t.getAttribute("userans");"TEXTAREA"==t.nodeName&&(n=(n=n.replace(/#singlequote#/g,"'")).replace(/#dblquote#/g,'"')),t.value=n}s=this.fillTestText(e,t)}if("u"==i&&1==l){if(-2!=s&&1!=parseInt(T.select(e).getAttribute("manual_grade"))){const e=this.markUserAnswer(s);t.classList.contains("dropable")?(T.insert(t,e,"beforeend"),t.setAttribute("as",s)):t.classList.contains("edit_step")?(1==s?T.selectAll("#"+t.getAttribute("id"),"css",{border:"2px solid green"}):T.selectAll("#"+t.getAttribute("id"),"css",{border:"2px solid red"}),t.setAttribute("as",s)):(T.insert(t.parentElement,e,"beforeend"),t.parentElement.setAttribute("as",s))}t.setAttribute("title",1==s?"is marked as Correct":"is marked as incorrect")}else T.find(e,".correct_incorrect_icon_fill",{action:"remove"}),t.setAttribute("title","");this.iscorrect=s}fillTestText(e,t){var i=-1,l=t.getAttribute("anskey").trim(),s=t.value?t.value.trim():"",a=t.getAttribute("haskeywords"),r=t.getAttribute("hasnotkeywords"),n=t.getAttribute("codetype"),o=t.getAttribute("mathtype");if("TEXTAREA"!=t.nodeName){/\d,\d/.test(s)&&(s=t.value.trim().replace(/,/g,"#cm"));let e=s.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g);s.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g)&&(e=e.toString().replace(/,/g,"#cm")),s=s.replace(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g,e)}if(1==n){var d=[/\s+/g,/\;$/,/"/g],c=["","","'"];for(let e=0;e<d.length;e++)s=s.replace(d[e],c[e]),l=l.replace(d[e],c[e])}if(1==o&&(s=t.getAttribute("userans").trim()),1==T.select(e).getAttribute("matchtype")&&(l=l.toLowerCase(),s=s.toLowerCase()),1==T.select(e).getAttribute("ignoretype")){if(0!=T.select(e).getAttribute("multi")){var p=[];l.split(",").forEach(((e,t)=>{p.push(e.replace(/[^a-zA-Z0-9]/gi,""))})),l=p.join(",")}else l=l.replace(/[^a-zA-Z0-9]/gi,"");s=s.replace(/[^a-zA-Z0-9]/gi,"")}if(1==t.getAttribute("keywordtype")&&a.length>0&&r.length>0){var u=0,h=0;a.split(",").forEach(((e,t)=>{-1!=s.indexOf(e)&&u++})),r.split(",").forEach(((e,t)=>{-1!=s.indexOf(e)&&h++})),a.split(",").length==u&&0==h&&(s=l)}return 0!=T.select(e).getAttribute("multi")?""!=(s=s.replace(/,/gm,"#cm"))&&this.checkInArray(l.split(","),s.split(","))&&(i=1,s=s.replace(/#cm/gm,",")):s==l&&(i=1),i}markUserAnswer(e){const t='<span class="'+(1==e?"icomoon-new-24px-checkmark-circle-1 font-weight-bold":"icomoon-new-24px-cancel-circle-1 font-weight-bold")+'" style="color:'+(1==e?"green":"red")+';">';let i='<span class="correct_incorrect_icon_fill" style="background:white;border-radius:15px 12px 12px;"> '+t+"</span></span>";return T.find(ajax_eId,".prettyprint","all").length>0&&(i='<span class="correct_incorrect_icon_fill" style="bottom:22px;background:none;border-radius:12px;"> '+t+"</span></span>"),i}checkAns(e){if(this.userAnsXML="<smans type='9'>\n",this.result=!0,this.temp=0,T.find(e,"select,input,textarea,.dropable,span.edit_step.mathquill","all").forEach((t=>{this.userAnsXML=this.checkChildAnswer(e,t,this.userAnsXML)})),this.userAnsXML+="</smans>",window.ISSPECIALMODULEUSERXMLCHANGE=1,T.select("#special_module_user_xml").value=this.userAnsXML,this.updateModule("uxml",this.userAnsXML),1!=parseInt(T.select(e).getAttribute("manual_grade")))return T.select("#answer").checked=!!this.result,this.result?(T.select("#answer").checked=!0,"undefined"!=typeof is_sm&&T.showmsg("Correct",3),"Correct"):(T.select("#answer").checked=!1,"undefined"!=typeof is_sm&&T.showmsg("Incorrect",3),"Incorrect")}checkInArray(e,t){let i=[];for(let l=0;l<e.length;l++)for(let s=0;s<t.length;s++)i.includes(t[s])||t[s].trim()!=e[l].trim()||i.push(t[s]);return 0==t.length-i.length}checkChildAnswer(e,t,i){if(t.classList.contains("dropable")){var l=t.getAttribute("anskey").split(",");null==T.findInArray(t.getAttribute("userans"),l)||0==T.findInArray(t.getAttribute("userans"),l)?this.result=!1:this.temp++,"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp),i+=`<div id='${t.getAttribute("id")}' userAns='${t.getAttribute("userans")}'></div>\n`}else if(t.classList.contains("mathquill")){for(var s=[],a=t.getAttribute("id"),r=t.getAttribute("anskey").trim(),n=t.getAttribute("userans").trim(),o=MathQuill.getInterface(2).StaticMath(document.getElementById(a)),d=0;d<=o.innerFields.length-1;d++)s[d]=o.innerFields[d].latex();let e=n,l=n.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);if(s.indexOf("")<0)for(d in l){const t="\\MathQuillMathField{"+s[d]+"}",i=l[d].replace(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g,t),a=l[d];e=e.replace(a,i)}let c=n=e;r!=c?this.result=!1:this.temp++,t.getAttribute("userans",c),i+=`<div id='${t.getAttribute("id")}' userAns='${c}' anskey='${r}' userAnsSeq='${t.getAttribute("userAnsSeq")}'></div>\n`}else if(t.parentElement.classList.contains("fillelement"))if("SELECT"==t.nodeName)this.uAnsSel="",this.a=0,this.totalcorrect=T.find(t,"[correctans='1']","all").length,T.find(t,"option","all").forEach(((e,t)=>{e.setAttribute("userans",""),e.selected&&(this.a++,1!=e.getAttribute("correctans")?this.result=!1:this.temp++,this.uAnsSel=this.uAnsSel+t+",",e.setAttribute("userans",t))})),this.a!=this.totalcorrect&&(this.result=!1),"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp),i+=`<div id='${t.parentElement.getAttribute("id")}' userAns='${this.uAnsSel}'></div>\n`;else if("INPUT"==t.nodeName||"TEXTAREA"==t.nodeName){r=t.getAttribute("anskey").trim();var c=t.value.trim();if(1==t.getAttribute("codetype")){var p=[/\s+/g,/\;$/,/"/g],u=["","","'"];for(let e=0;e<p.length;e++)c=c.replace(p[e],u[e]),r=r.replace(p[e],u[e])}if(1==T.select(e).getAttribute("matchtype")&&(r=r.toLowerCase(),c=c.toLowerCase()),1==T.select(e).getAttribute("ignoretype")){if(0!=T.select(e).getAttribute("multi")){let e=[];r.split(",").forEach(((t,i)=>{e.push(t.replace(/[^a-zA-Z0-9]/gi,""))})),r=e.join(",")}else r=r.replace(/[^a-zA-Z0-9]/gi,"");c=c.replace(/[^a-zA-Z0-9]/gi,"")}if(console.log(this.result),console.log("userans",c),console.log("test",T.select(e).getAttribute("multi")),0!=T.select(e).getAttribute("multi")||r.includes("#cm"))""!=(c=c.replace(/,/g,"#cm"))&&this.checkInArray(r.split(","),c.split(","))?this.temp++:this.result=!1;else{var h=t.getAttribute("haskeywords"),m=t.getAttribute("hasnotkeywords");if(1==t.getAttribute("keywordtype")&&h.length>0&&m.length>0){var f=0,g=0;h.split(",").forEach(((e,t)=>{-1!=c.indexOf(e)&&f++})),m.split(",").forEach(((e,t)=>{-1!=c.indexOf(e)&&g++})),h.split(",").length!=f||0!=g?this.result=!1:this.temp++}else r!=c?this.result=!1:this.temp++}"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp);var b=t.value;"TEXTAREA"==t.nodeName&&(b=(b=b.replace(/'/g,"#singlequote#")).replace(/"/g,"#dblquote#")),t.nodeName,i+=`<div id='${t.parentElement.getAttribute("id")}' userAns='${b}'></div>\n`}return i}modeOn(e,t){T.selectAll(".test, .review","addClass","h"),e?("function"==typeof hotkeys&&(hotkeys.unbind("alt+down,enter,delete","fillintheblank"),hotkeys.deleteScope("fillintheblank")),T.selectAll(".review","removeClass","h"),this.unBindLab(),this.showdragans(ajax_eId,"u",1)):(this.bindKeyup(ajax_eId),T.selectAll(".test","removeClass","h"),this.bindLab(),this.showdragans(ajax_eId,"u"))}bindLab(){this.labBinded=!0,T.find(ajax_eId,"select,input,textarea",{action:"removeAttr",actionData:"disabled"});try{this.readyFill(ajax_eId)}catch(e){console.log("catch")}}unBindLab(){this.labBinded=!1,T.find(ajax_eId,"input,select,textarea","all").forEach((e=>{"INPUT"==this.nodeName||"TEXTAREA"==this.nodeName?e.getAttribute("userans",e.value):"SELECT"==this.nodeName&&e.querySelectorAll("option").forEach(((e,t)=>{e.selected?e.setAttribute("userans",1):e.setAttribute("userans","")}))}))}pre_fill(e){T.find(e,".fillelement,.dropable","all");T.find(e,".prettyprint","all").length>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide"),T.find(e,"pre").classList.contains("lg")&&T.selectAll(e,"css",{width:"930px"}),setTimeout((()=>{T.find(e,"pre").classList.contains("linenums")?this.delPreSpaces.withLines(e):this.delPreSpaces.withoutLines(e),this.delPreSpaces.showFillModule(e)}),1e3))}};function j(e){a(e,"svelte-1yk78jl","xmp{display:inline}#fillmain{overflow:hidden;max-width:1024px;text-align:left}#fillmain pre{background:none;border:none;font-size:14px!important}#fillmain .string{min-height:50px;margin-top:10px;margin-right:10px}#fillmain .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}#fillmain .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}#fillmain .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}#fillmain input[type=\"text\"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}#fillmain .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}#fillmain .drag-resize.dragable{cursor:move}#fillmain .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}#fillmain .fillcheck ul{width:220px}#fillmain .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}#fillmain .select{font-size:15px}#fillmain .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}#fillmain .dragable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}#fillmain .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}#fillmain select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#555;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Helvetica,Arial,'Times New Roman',Verdana,sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.prettyprint{display:-ms-grid!important}")}function C(e){let t,i;return t=new L({props:{spanId:e[6].spanId,divId:e[6].divId,action:e[3].fillMath[e[5]],show:e[9]}}),{c(){r(t.$$.fragment)},m(e,l){n(t,e,l),i=!0},p(e,i){const l={};64&i[0]&&(l.spanId=e[6].spanId),64&i[0]&&(l.divId=e[6].divId),40&i[0]&&(l.action=e[3].fillMath[e[5]]),t.$set(l)},i(e){i||(o(t.$$.fragment,e),i=!0)},o(e){d(t.$$.fragment,e),i=!1},d(e){c(t,e)}}}function q(e){let t;return{c(){t=M("*Matching is not case sensitive.")},m(e,i){f(e,t,i)},d(e){e&&A(t)}}}function F(e){let t;return{c(){t=M("*Exact matching is required.")},m(e,i){f(e,t,i)},d(e){e&&A(t)}}}function z(e){let t,i,l,s,a,y,v,w,_,k,E,$,M,L,T,S,j,z,P,R,O,D,H,Q,B={handleReviewClick:e[10],reviewMode:e[0]};l=new I({props:B}),e[15](l),l.$on("setReview",e[7]),l.$on("unsetReview",e[8]);let X=e[6].showToolbar&&C(e);function Z(e,t){return"0"==e[6].matchtype?F:q}let U=Z(e),G=U(e);return{c(){t=p("div"),i=p("center"),r(l.$$.fragment),s=u(),a=p("div"),y=p("div"),v=u(),X&&X.c(),w=u(),_=p("div"),G.c(),k=u(),E=p("div"),$=p("div"),M=u(),L=p("center"),D=u(),H=p("textarea"),h(y,"class","string"),h(y,"id","previewArea"),m(_,"color","#b94a48"),m(_,"margin-top","5px"),h(_,"class","smnotes"),h($,"class","arrow-up"),h(L,"class","dragArea"),h(E,"class","footerStr"),m(E,"display",e[6].footerStr?"block":"none"),h(a,"id",N),h(a,"class",T="fillmain "+(e[0]?"pe-none":null)),h(a,"matchtype",S=e[6].matchtype),h(a,"multi",j=e[6].multi),h(a,"ignoretype",z=e[6].ignoretype),h(a,"manual_grade",P=e[1]||0),h(a,"totalcorrectans",R=e[6].totalcorrectans),m(a,"font-family",'"Open Sans",sans-serif'),m(a,"font-size","16px"),h(t,"class",O=e[2]?"mx-4 pl-2 pl-md-0":""),h(H,"class","h"),h(H,"id","special_module_user_xml")},m(e,r){f(e,t,r),g(t,i),n(l,i,null),g(i,s),g(i,a),g(a,y),g(a,v),X&&X.m(a,null),g(a,w),g(a,_),G.m(_,null),g(a,k),g(a,E),g(E,$),g(E,M),g(E,L),f(e,D,r),f(e,H,r),Q=!0},p(e,i){const s={};1&i[0]&&(s.reviewMode=e[0]),l.$set(s),e[6].showToolbar?X?(X.p(e,i),64&i[0]&&o(X,1)):(X=C(e),X.c(),o(X,1),X.m(a,w)):X&&(b(),d(X,1,1,(()=>{X=null})),x()),U!==(U=Z(e))&&(G.d(1),G=U(e),G&&(G.c(),G.m(_,null))),(!Q||64&i[0])&&m(E,"display",e[6].footerStr?"block":"none"),(!Q||1&i[0]&&T!==(T="fillmain "+(e[0]?"pe-none":null)))&&h(a,"class",T),(!Q||64&i[0]&&S!==(S=e[6].matchtype))&&h(a,"matchtype",S),(!Q||64&i[0]&&j!==(j=e[6].multi))&&h(a,"multi",j),(!Q||64&i[0]&&z!==(z=e[6].ignoretype))&&h(a,"ignoretype",z),(!Q||2&i[0]&&P!==(P=e[1]||0))&&h(a,"manual_grade",P),(!Q||64&i[0]&&R!==(R=e[6].totalcorrectans))&&h(a,"totalcorrectans",R),(!Q||4&i[0]&&O!==(O=e[2]?"mx-4 pl-2 pl-md-0":""))&&h(t,"class",O)},i(e){Q||(o(l.$$.fragment,e),o(X),Q=!0)},o(e){d(l.$$.fragment,e),d(X),Q=!1},d(i){i&&A(t),e[15](null),c(l),X&&X.d(),G.d(),i&&A(D),i&&A(H)}}}let N="fillmain";function P(e){let t=document.querySelectorAll(".textarea.ks");for(let l=0;l<t.length;l++){let s=t[l];var i=setTimeout((function(){s.style.cssText="height:auto;overflow: auto;",e&&(window.isIE?s.style.cssText="height:"+(s.scrollHeight+10)+"px;overflow: hidden":s.style.cssText="height:"+s.scrollHeight+"px;overflow: hidden"),clearTimeout(i)}),100)}}function R(e,t,i){let l,s,{manual_grade:a}=t,{xml:r}=t,{uxml:n}=t,{isReview:o}=t,{editorState:d}=t,{smValidate:c}=t,{showAns:p}=t,u="",h="",m=[],f=0,g=1,b=[],x={},A={};globalThis.ajax_eId="#fillmain";let M={};E({matchtype:"0",ignoretype:"",multi:"",totalcorrectans:0,showToolbar:!1,isMathquill:!1,fillMath:[],footerStr:!1}).subscribe((e=>{i(6,M=e)}));function I(){if(i(6,M.xml=r,M),x=_(r),n&&(window.isResetMath?window.isResetMath=!1:(A=_(n),i(6,M.uxml=n,M))),function(e,t=!1){u=e.smxml.text.__cdata,h="",m=[],f=0,i(6,M.footerStr=!1,M),v.selectAll(".smnotes","hide"),e.smxml.text._matchType&&(e.smxml.text._matchtype=e.smxml.text._matchType,delete e.smxml.text._matchType);e.smxml.text._ignoreType&&(e.smxml.text._ignoretype=e.smxml.text._ignoreType,delete e.smxml.text._ignoreType);i(6,M.matchtype=e.smxml.text._matchtype,M),i(6,M.ignoretype=e.smxml.text._ignoretype,M),i(6,M.multi="multiple"==e.smxml.text._multiple?"1":"",M);let l=u.match(/%{[\s\S]*?}%/gm),s="",a="",r=0;l&&l.forEach(((e,n)=>{if(r++,t&&t.smans){let e=t.smans.div;0==Array.isArray(e)&&(e=[],e[0]=t.smans.div),e&&(a=e[n])}let o=l[n];s=l[n].match(/\|(.*?)}%$/gm),s=s?s[0].replace(/\||}%/gm,""):"",s=s.trim(),""==s||"c"==s?(v.selectAll(".smnotes","show"),a?R(o,n,a):R(o,n)):"n"==s?a?O(o,n,a):O(o,n):"d"==s||"ds"==s?a?Q(o,n,a):Q(o,n):"s"==s?a?D(o,n,a):D(o,n):"e"==s?(i(6,M.isMathquill=!0,M),a?z(o,n,a):z(o,n)):(s.indexOf(!1)||s.indexOf(!1))&&(v.selectAll(".smnotes","show"),a?H(o,n,a):H(o,n));o.replace("%{","").replace("}%","")}));v.selectAll("#"+N,"attr",{totalcorrectans:r}),u=v.ignoreEnity(u),v.find("#"+N,"#previewArea",{action:"html",actionData:u}),v.find("#"+N,".dragArea",{action:"html",actionData:h});let n=v.find("#"+N,".dragArea"),o=n?.children?Array.from(n.children):[];for(;o.length;)n.append(o.splice(Math.floor(Math.random()*o.length),1)[0]);(function(){let e=[];v.selectAll(".dragArea div").forEach(((t,i)=>{e.push(10*t.innerHTML.length+30)})),v.selectAll("#previewArea [id^=elem]").forEach((t=>{t.classList.contains("drag-resize")&&v.setCss(t,{"max-width":Math.max(...e)})}))})(),function(){if(v.find(ajax_eId,"table.uc-table","all").length>0){let e=v.find(ajax_eId,"table.uc-table").clientWidth+9;v.setCss(v.find(ajax_eId,".smnotes"),{width:e+"px",margin:"auto","padding-top":"5px"})}}(),F();var d=setTimeout((function(){v.find(ajax_eId,".prettyprint","all").length>=1&&0==v.find(ajax_eId,".prettyprint .L0","all").length&&"function"==typeof prettyPrint&&(v.selectAll(".prettyprint").forEach((e=>{e.classList.add("prettyprintReplica"),e.classList.remove("prettyprint")})),v.selectAll(".linenums").forEach((e=>{e.classList.add("linenumsReplica"),e.classList.remove("linenums")})),v.find(ajax_eId,".prettyprintReplica").forEach((e=>{e.classList.add("prettyprint")})),v.find(ajax_eId,".linenumsReplica").forEach((e=>{e.classList.add("linenums")})),prettyPrint(),v.selectAll(".prettyprintReplica").forEach((e=>{e.classList.add("prettyprint"),e.classList.remove("prettyprintReplica")})),v.selectAll(".linenumsReplica").forEach((e=>{e.classList.add("linenums"),e.classList.remove("linenumsReplica")}))),clearTimeout(d)}),2e3);if(v.find(ajax_eId,"table.uc-table","all").length>0){v.find(ajax_eId,"table.uc-table",{action:"addClass",actionData:"font14"});try{"BR"==v.find(ajax_eId,"table.uc-table").previousElementSibling?.nodeName&&v.find(ajax_eId,"table.uc-table").previousElementSibling.remove()}catch(e){console.warn(e)}}}(x,A),!r){let e=smVal.validate(d.content_type,d.subtype,d.content_icon);c(e)}}function L(){i(0,o=!0),r.includes("user Response{")&&(window.isResetMath=!0),i(6,M.showToolbar=!1,M),S.modeOn("on"),S.showdragans(ajax_eId,"u",1),v.selectAll(".remed_disable","show"),P(1);let e=document.getElementById(N);e=e?e.getElementsByClassName("mathquill"):e,e&&(v.setCss(ajax_eId,{position:"relative"}),v.insert(ajax_eId,"<div class='spinner-wrapper' style='position:absolute!important;opacity:0!important;'></div>","afterbegin")),j()}function T(){i(0,o=!1),v.selectAll(".mathquill","css",{border:"none"}),S.modeOn(),v.selectAll(".remed_disable, .corr_div","hide"),S.showdragans(ajax_eId,"u",0);let e=document.getElementById(N);e=e?e.getElementsByClassName("mathquill"):e,P(),e&&(v.selectAll(ajax_eId,"css",{position:"unset"}),v.selectAll(".spinner-wrapper","remove"))}function j(){let e=S.checkAns(ajax_eId),t={ans:S.result,uXml:S.userAnsXML};k(t),d&&p(e)}function C(e,t){let l=!0;for(;l;)(e=e.parentElement).getAttribute("id")&&(l=!1,i(5,s=e.getAttribute("id")));let a=[];v.selectAll("#"+s+" span.mq-editable-field").forEach((t=>{let i=e.getAttribute("mathquill-command-id");a.push(i)}));let r=e.getAttribute("mathquill-command-id"),n=a.indexOf(r);i(6,M.spanId=n,M),i(6,M.divId=s,M),i(6,M.showToolbar=!0,M)}function q(e,t){i(6,M[e]=t,M),"uxml"==e&&(A=_(M.uxml),function(e){let t="",i=x.smxml.text.__cdata.match(/%{[\s\S]*?}%/gm),l="";i&&i.forEach(((i,s)=>{if(e&&e.smans){let i=e.smans.div;0==Array.isArray(i)&&(i=[],i[0]=e.smans.div),i&&(t=i[s])}if(l=i.match(/\|(.*?)}%$/gm),l=l?l[0].replace(/\||}%/gm,""):"",l=l.trim(),t&&t._userAns){let e="";""==l||"c"==l||"n"==l?e=`#elem${s} .fillintheblank`:"d"==l||"ds"==l?e="#elem"+s:"s"==l||("e"==l?e="#elem"+s:(l.indexOf(!1)||l.indexOf(!1))&&(e=`#elem${s} .textarea`)),v.isValid(e)&&document.querySelector(e)&&document.querySelector(e).setAttribute("userans",t._userAns)}}))}(A))}function F(){try{S.readyFill(ajax_eId)}catch(t){if(g<=100)var e=setTimeout((()=>{F(),clearTimeout(e)}),50);else console.warn("Error at runModule function");g++}}function z(e,t,l=!1){let s=e,a=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].replace(/user Response/g,"\\MathQuillMathField").split("##"),r=Math.floor(Math.random()*a.length),n=a[r],o=n.replace(/MathQuillMathField{(.*?)}/g,"MathQuillMathField{}"),d=0,c=n;l?l._userAns&&(o=l._userAns,l._userAnsSeq&&(c=l._anskey,r=l._userAnsSeq)):n.indexOf("MathQuillMathField")>-1&&(c=n,d=1),v.select("#elem"+t,"css",{display:"none"});let p=`<div id="main_div" class="text-center filter auto_height fillelement mathitem inline-block"><div class="disable_div fh fwidth absolute h"></div><div class="remed_disable fh fwidth absolute h"></div>\n\t\t\t<span  id="m${t}" style="display:none;" class="auto_height h corr_div fillmathelement mathquill" userAnsSeq="${r}" anskey="${c}" defaultans="${d}" mathtype="1">\n\t\t\t\t${c}\n\t\t\t</span>\n\t\t\t${`<span id="elem${t}" class="auto_height edit_step fillmathelement mathquill" userAnsSeq="${r}" userans="${o}" anskey="${c}" defaultans="${d}" mathtype="1"></span>`}\n\t\t</div>`;u=u.replace(s,p);let h=setInterval((()=>{if("function"==typeof MathQuill){clearInterval(h),v.selectAll("#elem"+t,"show");let e=MathQuill.getInterface(2);v.selectAll(".mathquill").forEach((t=>{let i=t.getAttribute("id");if(1==t.getAttribute("defaultans")){var l=t.getAttribute("userans");null!=l&&v.select("#"+i,"text",l)}else v.select("#"+i,"text",t.getAttribute("userans"));b[i]=e.StaticMath(document.getElementById(i))})),i(3,S.fillMath=b,S)}}),100)}function R(e,t,i=!1){var l="";i&&i._userAns&&(l=i._userAns);let s=e,a="",r=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&"c"==e[1].trim()?"1":"",n=e[0].trim();if(-1!=n.indexOf("#style#")){let e=n.split("#style#");n=e[0],a=e[1]}let o=[],d=n.split(",");v.selectAll(d).forEach(((e,t)=>{o[t]=10*d[t].length+30}));let c=`<div id="elem${t}" class="fillelement">${`<input type="text" class="fillintheblank ks" anskey="${n.trim()}" value="${l}" userans="${l}" defaultans="" haskeywords="" codetype="${r}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:${Math.max(...o)}px;${a}" />`}</div>`;u=u.replace(s,c)}function O(e,t,i=!1){var l="";i&&i._userAns&&(l=i._userAns);let s=e,a="",r=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&"c"==e[1].trim()?"1":"",n=e[0].trim();if(-1!=n.indexOf("#style#")){let e=n.split("#style#");n=e[0],a=e[1]}let o=[],d=n.split(",");v.selectAll(d).forEach(((e,t)=>{o[t]=10*d[t].length+30}));let c=`<div id="elem${t}" class="fillelement">${`<input type="number" onKeyDown="if(isNaN(event.key)){var key_arr = [13, 37, 38, 39, 40, 8, 69, 101, 46, 16, 9];if(!key_arr.includes(event.keyCode)) event.preventDefault()} "class="fillintheblank ks" anskey="${n.trim()}" value="${l}" userans="${l}" defaultans="" haskeywords="" codetype="${r}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width: ${Math.max(...o)+20}px;${a}" />`}</div>`;u=u.replace(s,c)}function D(e,t,i=!1){let l=e,s=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim();s=s.split(",").map((e=>e.trim()));let a='<option value="">&nbsp;Please Select</option>';v.selectAll(s).forEach(((e,t)=>{let l=0==s[t].indexOf("*")?"1":"0",r=0==s[t].indexOf("+")?'selected="selected"':"",n=0==s[t].indexOf("*")||0==s[t].indexOf("+")?s[t].slice(1):s[t],o="";if(i&&i._userAns){r="",t==i._userAns.split(",")[0].trim()-1&&(r='selected="selected"',o="1")}n=n.replace(/\#cm/gim,",").replace(/\#pl/gim,"+"),a+=`<option value="${t}" correctans="${l}" userans="${o}" ${r}>&nbsp;${n}</option>`}));let r=`<div id="elem${t}" class="fillelement">${`<select class="fillintheblank ks" data-role="none">${a}</select>`}</div>`;u=u.replace(l,r)}function H(e,t,i=!1){let l="";i&&i._userAns&&(l=i._userAns);let s=e,a=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim(),r=JSON.parse(e[1]),n=`<span id="elem${t}" class="fillelement" style="height:auto">${`<textarea class="textarea ks" rows="${r.rows}" cols="${r.cols}" anskey="${a}" value="${l}" defaultans="${r.defaultAns?r.defaultAns:""}" userans="${l}" haskeywords="" hasnotkeywords="" keywordtype="1" autocomplete="off" data-role="none">${l}</textarea>`}</span>`;u=u.replace(s,n)}function Q(e,t,l=!1){let s=e,a=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim(),r="ds"==e[1].trim()?"1":"0",n=a.split(","),o="";v.selectAll(n).forEach(((e,t)=>{let i=!1,l=10*n[t].length+30,s=n[t],a=n[t].match(/i~|~i/g),d="";a?s=n[t].replace(/i~|~i/g,""):(o+="ID"+f+",",d="ID"+f+","),v.selectAll(m).forEach(((e,t)=>{m[t].ans==s&&(i=!0,a||(o=o.replace(d,""),o+=m[t].id+","))})),0==i&&m.push({ans:s,id:"ID"+f}),0==i&&(h+=`<div id="ID${f}" dragable="true" tabindex="0" class="drag-resize dragable ks" caption="${s.replace(/\#cm/gim,",").replace(/\"/gim,"#doublequote#")}" path="//s3.amazonaws.com/jigyaasa_content_static/" drag-single="${r}" bgcolor="#CCFFCC" style="background-color:#CCFFCC;height:auto;max-width:${l}px;padding:3px 10px 3px 10px; margin: 2px 2px;" aria-disabled="false">${s.replace(/\#cm/gim,",")}</div>`),0==i&&f++}));let d="";l&&l._userAns&&(d=l._userAns);let c='<div id="elem'+t+'" tabindex="0" dropzone="1" class="drag-resize dropable ks" path="//s3.amazonaws.com/jigyaasa_content_static/" anskey="'+o.slice(0,-1)+'" caption="" userans="'+d+'" droped="'+d+'" bgcolor="#FFFFCC" style="background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;">'+d+"</div>";u=u.replace(s,c),i(6,M.footerStr=!0,M)}return y((async()=>{in_editor&&v.addScript("","https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"),v.addScript("",window.itemUrl+"src/libs/mathQuill_new.js"),S.setUpdate(q.bind(this));let e=document.getElementById(N);e=e?e.getElementsByClassName("mathquill"):e,M.isMathquill&&v.selectAll("div"+ajax_eId,"css",{overflow:"auto"}),v.bind(ajax_eId,"click",j),v.bind(ajax_eId,"keyup",j),v.bind(ajax_eId,"change",j),v.bind(ajax_eId,"dragend",j),v.listen(document,"click","span.mq-editable-field.mq-focused",C),v.listen(document,"change","span.mq-editable-field.mq-focused",C),I()})),w((()=>{if(r!=M.xml){if(d&&1==d.stopPreviewUpdate)return!1;I(),setTimeout((function(){let e=document.getElementById("previewArea");if(e.childNodes[0]&&"TABLE"==e.childNodes[0].nodeName){e=document.querySelectorAll("#previewArea td");for(let t in e)e[t].firstElementChild||"TD"!=e[t].nodeName||e[t].setAttribute("tabindex","0")}else for(let t in e.childNodes)if(3==e.childNodes[t].nodeType){let i=document.createElement("span");i.setAttribute("tabindex","0"),i.innerHTML=e.childNodes[t].textContent,e.childNodes[t].replaceWith(i)}}),1e3)}})),e.$$set=e=>{"manual_grade"in e&&i(1,a=e.manual_grade),"xml"in e&&i(2,r=e.xml),"uxml"in e&&i(11,n=e.uxml),"isReview"in e&&i(0,o=e.isReview),"editorState"in e&&i(12,d=e.editorState),"smValidate"in e&&i(13,c=e.smValidate),"showAns"in e&&i(14,p=e.showAns)},e.$$.update=()=>{1&e.$$.dirty[0]&&(o?L():T())},[o,a,r,S,l,s,M,L,T,function(e){i(6,M.showToolbar=e,M)},function(e,t){"c"==e?(S.showdragans(ajax_eId,"c",1),v.selectAll(".corr_div","css",{display:"block"}),v.selectAll(".remed_disable","css",{display:"block"}),P(1)):(S.showdragans(ajax_eId,"u",1),v.selectAll(".corr_div","hide"),P(1))},n,d,c,p,function(e){$[e?"unshift":"push"]((()=>{l=e,i(4,l)}))}]}export default class extends i{constructor(e){super(),l(this,e,R,z,s,{manual_grade:1,xml:2,uxml:11,isReview:0,editorState:12,smValidate:13,showAns:14},j,[-1,-1])}}
//# sourceMappingURL=FillInTheBlanksPreview-c94879bb.js.map
