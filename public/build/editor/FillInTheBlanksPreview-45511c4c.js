import{E as e,O as t,S as i,i as l,s as a,D as s,c as r,m as n,t as o,a as d,d as c,e as p,b as u,f as h,g as m,h as f,j as g,k as b,n as x,o as A,p as y,A as v,C as w,X as _,W as k,w as E,G as $,u as M}from"./main-fcda70bb.js";import{I}from"./ItemHelper-626a7559.js";import"./style-inject.es-1f59c1d0.js";import{F as L}from"./mathquill-07ae719e.js";const T=new e;const S=new class{constructor(e){this.userAnsXML="",this.sInfo=!0,this.labBinded=!0,this.delPreSpaces={},this.init(),this.iscorrect="-2",this.previous_droped_item={}}init(){this.delPreSpaces={loopGaurd:0,withLines:e=>{this.delPreSpaces.loopGaurd>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide"));var t=T.selectAll(".linenums li").length,i=[];if(0==t&&this.delPreSpaces.loopGaurd<=4)return this.delPreSpaces.loopGaurd++,setTimeout((()=>{this.delPreSpaces.withLines(e)}),1e3),!1;this.showFillModule(e),T.selectAll(".linenums li").forEach(((e,t)=>{"&nbsp;"==T.find(e,"span").innerHTML||""==T.find(e,"span").innerHTML?e.remove():i.push(e)})),i.forEach(((e,t)=>{if(e.children.classList.contains("fillelement")||e.children.classList.contains("dropable")){let t;e.children.forEach((e=>{""==e.innerHTML?e.remove():t=e})),T.prevElm(e).append(t),T.insert(T.prevElm(e),T.nextElm(e).innerHTML,"beforeend"),T.nextElm(e).remove(),e.remove()}}))},withoutLines:e=>{T.find(e,".fillelement,.dropable","all").forEach((t=>{var i=T.prevElm(t).innerHTML.trim(),l=T.nextElm(t).innerHTML.trim();if(delPreSpaces.loopGaurd>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide")),0==T.find(e,".kwd","all").length&&delPreSpaces.loopGaurd<=4)return delPreSpaces.loopGaurd++,setTimeout((()=>{delPreSpaces.withoutLines(e)}),1e3),!1;this.showFillModule(e),""==i?T.prevElm(t).remove():T.prevElm(t).innerHTML=i,""==l?T.nextElm(t).remove():T.nextElm(t).innerHTML=l}))},showFillModule:e=>{"function"==typeof activate&&activate(0),"undefined"!=typeof quizPlayerStatic&&"undefined"!=typeof QuizPlayer&&QuizPlayer.setNewHeight(quizPlayerStatic),T.selectAll(e,"show")}}}setUpdate(e){this.updateModule=e}readyFill(e){let i="",l="";T.bind(e+" select","change",(()=>{T.trigger(e,"click")})),this.dragOptionFill={appendTo:"body",zIndex:100,revert:e=>{if(!e)return this.sInfo&&(this.sInfo=!1,setTimeout((function(){this.sInfo=!0}),6e4),T.showmsg("While dropping a component, keep your mouse pointer on the drop area. Drop area must be compatible with the component you are dropping.",100)),!0},helper:t=>{var i=t.target;try{return i.classList.contains("dropable")&&(i=T.find(e,"#"+t.target.getAttribute("droped"))),this.img={width:T.select(i).clientWidth,height:"auto"},t.target.draggable("option","cursorAt",{left:Math.floor(this.img.width/2),top:-10}),t.target.cloneNode(!0).css({width:this.img.width+"px",height:this.img.height+"px",position:"absolute","text-align":"center"})}catch(e){console.warn("Helper:",e)}},onDragStart:e=>{e.target.dataset.drag_enable=!0},onDragEnter:e=>{e.target.classList.add("drop-hover")},onDragLeave:e=>{e.target.classList.remove("drop-hover")},onDrop:(t,i)=>{const a=t.target,s=i.getAttribute("droped")?i.getAttribute("droped"):i.getAttribute("id");a.getAttribute("droped").trim(),a.innerHTML=i.innerHTML,T.select(a,"attr",{userans:s,droped:s,path:i.getAttribute("path")}),T.select(a,"css",{backgroundColor:i.style.backgroundColor}),l=a.id,this.checkAns(e),a.classList.remove("drop-hover")},onDragEnd:(t,a)=>{let s=t.target;if(s.classList.contains("dropable")&&(s.dataset.drag_enable,T.select(s,"css",{backgroundColor:s.getAttribute("bgcolor")}),s.textContent=s.getAttribute("caption"),T.selectAll(s,"attr",{droped:"",userans:""})),i=s.id,s.classList.contains("dropable")){const e=T.select("#"+l).getAttribute("droped");e&&1==T.select("#"+e).getAttribute("drag-single")&&this.dnd.disableDrag("#"+e)}else if(i&&1==T.select("#"+i).getAttribute("drag-single")&&""!=l){this.dnd.disableDrag("#"+i),Object.entries(this.previous_droped_item)&&this.previous_droped_item[l]&&(this.previous_droped_item[l].setAttribute("draggable","true"),this.previous_droped_item[l].setAttribute("aria-disabled","false"),this.previous_droped_item[l].classList.remove("ui-draggable-disabled","ui-state-disabled"));let e=document.querySelector("#"+i);e.setAttribute("draggable","false"),e.setAttribute("aria-disabled","true"),e.classList.add("ui-draggable-disabled","ui-state-disabled"),this.previous_droped_item[l]=e}this.checkAns(e),l=""},scroll:"true",refreshPositions:!0,cursor:"default"},window.fillid=e,this.dnd||(this.dnd=new t(this.dragOptionFill)),T.find(e,".dragable","all").forEach((e=>this.dnd.setDrag(e))),T.find(e,".dropable","all").forEach((e=>{const t=e.getAttribute("droped");t&&1==T.select("#"+t).getAttribute("drag-single")&&this.dnd.disableDrag(T.select("#"+t))})),T.find(e,"[droped*=ID]","all").forEach(((t,i)=>{"0"==T.find(e,"#"+t.getAttribute("droped")).getAttribute("multi_drag")&&this.dnd.disableDrag(T.find(e,"#"+t.getAttribute("droped")))})),T.find(e,".dropable","all").forEach((e=>this.dnd.setDrop(e)))}bindKeyup(e){T.find(e,".fillelement","all").forEach((e=>{T.selectAll(Array.from(e.children),"addClass","ks")})),T.find(e,".dragable","all").forEach((e=>{e.classList.add("ks")})),T.find(e,".dropable","all").forEach((e=>{e.classList.add("ks")})),T.listen(document,"click",e,((t,i)=>{this.checkFocus("ks")||T.selectAll(T.find(e,".copiedclr","all"),"removeClass","copiedclr")}))}checkFocus(e){this.checkAns&&this.checkAns(ajax_eId);var t=!1;return T.find(ajax_eId,"."+e,"all").forEach((e=>{if(T.isFocus(e))return t=!0,!1})),t}showdragans(e,t,i){void 0===i&&(i=0),T.find(e,"select,input,textarea,.dropable,span.edit_step","all").forEach((l=>{this.showchilddragans(e,l,t,i)}))}showchilddragans(e,t,i,l){let a=-2;if(t.classList.contains("dropable"))if(t.innerHTML=t.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{"background-color":t.getAttribute("bgcolor")}),"c"==i)t.getAttribute("anskey").split(",").forEach(((i,l)=>{if(""!=i.trim()){const l=T.find(e,"#"+i);return l&&(t.innerHTML=l.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{backgroundColor:l.getAttribute("bgcolor")})),!1}}));else if("u"==i){a=-1,""!=t.getAttribute("userans").trim()&&(this.userans=T.find(e,"#"+t.getAttribute("userans")),this.userans&&(t.innerHTML=this.userans.getAttribute("caption").replace(/\#doublequote#/gim,'"'),T.setCss(t,{backgroundColor:this.userans.getAttribute("bgcolor")})));const i=t.getAttribute("anskey"),l=t.getAttribute("userans");""!=l&&i.indexOf(l)>-1&&(a=1)}if(t.classList.contains("edit_step")&&1==l&&("c"==i?T.selectAll(".edit_step","css",{border:"none",display:"none"}):"u"==i&&(T.selectAll(".edit_step","css",{cursor:"none",display:"block"}),a=this.fillTestText(e,t))),t.parentElement.classList.contains("fillelement"))if("SELECT"==t.nodeName)a=-1,this.totalcorrect=T.find(t,"[correctans='1']","all").length,this.a=0,T.find(t,"option","all").forEach(((e,t)=>{e.removeAttribute("selected"),e.selected=!1,"c"==i?e.getAttribute("correctans")>0&&(e.selected=!0):"u"==i&&(e.getAttribute("userans")>0&&(e.selected=!0),e.selected&&1==e.getAttribute("correctans")&&this.a++)})),this.totalcorrect==this.a&&(a=1);else if("INPUT"==t.nodeName||"TEXTAREA"==t.nodeName)if(void 0===t.type&&(this.type="text"),"c"==i){var s=t.getAttribute("anskey").split(",");if(s.length>1){var r="<p style='text-align:left;'>All of the answers are correct!<br>";s.forEach(((e,t)=>{r+="("+(t+1)+") "+e.replace(/#cm/g,",")+"<br>"})),T.setAttr(t,{rel:"multiple_answers",title:r+"</p>","data-html":"true"})}t.value=t.getAttribute("anskey").replace(/#cm/g,",")}else if("u"==i){if(t.removeAttribute(["rel","title","data-html"]),""==t.getAttribute("userans")&&""!==t.getAttribute("defaultAns"))t.value=t.getAttribute("defaultAns");else{var n=t.getAttribute("userans");"TEXTAREA"==t.nodeName&&(n=(n=n.replace(/#singlequote#/g,"'")).replace(/#dblquote#/g,'"')),t.value=n}a=this.fillTestText(e,t)}if("u"==i&&1==l){if(-2!=a&&1!=parseInt(T.select(e).getAttribute("manual_grade"))){const e=this.markUserAnswer(a);t.classList.contains("dropable")?(T.insert(t,e,"beforeend"),t.setAttribute("as",a)):t.classList.contains("edit_step")?(1==a?T.selectAll("#"+t.getAttribute("id"),"css",{border:"2px solid green"}):T.selectAll("#"+t.getAttribute("id"),"css",{border:"2px solid red"}),t.setAttribute("as",a)):(T.insert(t.parentElement,e,"beforeend"),t.parentElement.setAttribute("as",a))}t.setAttribute("title",1==a?"is marked as Correct":"is marked as incorrect")}else T.find(e,".correct_incorrect_icon_fill",{action:"remove"}),t.setAttribute("title","");this.iscorrect=a}fillTestText(e,t){var i=-1,l=t.getAttribute("anskey").trim(),a=t.value?t.value.trim():"",s=t.getAttribute("haskeywords"),r=t.getAttribute("hasnotkeywords"),n=t.getAttribute("codetype"),o=t.getAttribute("mathtype");if("TEXTAREA"!=t.nodeName){/\d,\d/.test(a)&&(a=t.value.trim().replace(/,/g,"#cm"));let e=a.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g);a.match(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g)&&(e=e.toString().replace(/,/g,"#cm")),a=a.replace(/[a-zA-Z]{1,1},[a-zA-Z]{1,1}/g,e)}if(1==n){var d=[/\s+/g,/\;$/,/"/g],c=["","","'"];for(let e=0;e<d.length;e++)a=a.replace(d[e],c[e]),l=l.replace(d[e],c[e])}if(1==o&&(a=t.getAttribute("userans").trim()),1==T.select(e).getAttribute("matchtype")&&(l=l.toLowerCase(),a=a.toLowerCase()),1==T.select(e).getAttribute("ignoretype")){if(0!=T.select(e).getAttribute("multi")){var p=[];l.split(",").forEach(((e,t)=>{p.push(e.replace(/[^a-zA-Z0-9]/gi,""))})),l=p.join(",")}else l=l.replace(/[^a-zA-Z0-9]/gi,"");a=a.replace(/[^a-zA-Z0-9]/gi,"")}if(1==t.getAttribute("keywordtype")&&s.length>0&&r.length>0){var u=0,h=0;s.split(",").forEach(((e,t)=>{-1!=a.indexOf(e)&&u++})),r.split(",").forEach(((e,t)=>{-1!=a.indexOf(e)&&h++})),s.split(",").length==u&&0==h&&(a=l)}return 0!=T.select(e).getAttribute("multi")?""!=(a=a.replace(/,/gm,"#cm"))&&this.checkInArray(l.split(","),a.split(","))&&(i=1,a=a.replace(/#cm/gm,",")):a==l&&(i=1),i}markUserAnswer(e){const t='<span class="'+(1==e?"icomoon-new-24px-checkmark-circle-1 font-weight-bold":"icomoon-new-24px-cancel-circle-1 font-weight-bold")+'" style="color:'+(1==e?"green":"red")+';">';let i='<span class="correct_incorrect_icon_fill" style="background:white;border-radius:15px 12px 12px;"> '+t+"</span></span>";return T.find(ajax_eId,".prettyprint","all").length>0&&(i='<span class="correct_incorrect_icon_fill" style="bottom:22px;background:none;border-radius:12px;"> '+t+"</span></span>"),i}checkAns(e){if(this.userAnsXML="<smans type='9'>\n",this.result=!0,this.temp=0,T.find(e,"select,input,textarea,.dropable,span.edit_step.mathquill","all").forEach((t=>{this.userAnsXML=this.checkChildAnswer(e,t,this.userAnsXML)})),this.userAnsXML+="</smans>",window.ISSPECIALMODULEUSERXMLCHANGE=1,T.select("#special_module_user_xml").value=this.userAnsXML,1!=parseInt(T.select(e)?.getAttribute("manual_grade")||"1"))return T.select("#answer").checked=!!this.result,this.result?(T.select("#answer").checked=!0,"undefined"!=typeof is_sm&&T.showmsg("Correct",3),"Correct"):(T.select("#answer").checked=!1,"undefined"!=typeof is_sm&&T.showmsg("Incorrect",3),"Incorrect")}checkInArray(e,t){let i=[];for(let l=0;l<e.length;l++)for(let a=0;a<t.length;a++)i.includes(t[a])||t[a].trim()!=e[l].trim()||i.push(t[a]);return 0==t.length-i.length}checkChildAnswer(e,t,i){if(t.classList.contains("dropable")){var l=t.getAttribute("anskey").split(",");null==T.findInArray(t.getAttribute("userans"),l)||0==T.findInArray(t.getAttribute("userans"),l)?this.result=!1:this.temp++,"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp),i+=`<div id='${t.getAttribute("id")}' userAns='${t.getAttribute("userans")}'></div>\n`}else if(t.classList.contains("mathquill")){for(var a=[],s=t.getAttribute("id"),r=t.getAttribute("anskey").trim(),n=t.getAttribute("userans").trim(),o=MathQuill.getInterface(2).StaticMath(document.getElementById(s)),d=0;d<=o.innerFields.length-1;d++)a[d]=o.innerFields[d].latex();let e=n,l=n.match(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g);if(a.indexOf("")<0)for(d in l){const t="\\MathQuillMathField{"+a[d]+"}",i=l[d].replace(/\\MathQuillMathField(.*?)}*}{4,6}|\\MathQuillMathField(.*?)}*}{3,6}|\\MathQuillMathField(.*?)}*}{2,6}|\\MathQuillMathField(.*?)}*}{1,6}/g,t),s=l[d];e=e.replace(s,i)}let c=n=e;r!=c?this.result=!1:this.temp++,t.setAttribute("userans",c),i+=`<div id='${t.getAttribute("id")}' userAns='${c}' anskey='${r}' userAnsSeq='${t.getAttribute("userAnsSeq")}'></div>\n`}else if(t.parentElement.classList.contains("fillelement"))if("SELECT"==t.nodeName)this.uAnsSel="",this.a=0,this.totalcorrect=T.find(t,"[correctans='1']","all").length,T.find(t,"option","all").forEach(((e,t)=>{e.setAttribute("userans",""),e.selected&&(this.a++,1!=e.getAttribute("correctans")?this.result=!1:this.temp++,this.uAnsSel=this.uAnsSel+t+",",e.setAttribute("userans",t))})),this.a!=this.totalcorrect&&(this.result=!1),"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp),i+=`<div id='${t.parentElement.getAttribute("id")}' userAns='${this.uAnsSel}'></div>\n`;else if("INPUT"==t.nodeName||"TEXTAREA"==t.nodeName){r=t.getAttribute("anskey").trim();var c=t.value.trim(),p=t.getAttribute("codetype");if(t.setAttribute("userans",c),1==p){var u=[/\s+/g,/\;$/,/"/g],h=["","","'"];for(let e=0;e<u.length;e++)c=c.replace(u[e],h[e]),r=r.replace(u[e],h[e])}if(1==T.select(e).getAttribute("matchtype")&&(r=r.toLowerCase(),c=c.toLowerCase()),1==T.select(e).getAttribute("ignoretype")){if(0!=T.select(e).getAttribute("multi")){let e=[];r.split(",").forEach(((t,i)=>{e.push(t.replace(/[^a-zA-Z0-9]/gi,""))})),r=e.join(",")}else r=r.replace(/[^a-zA-Z0-9]/gi,"");c=c.replace(/[^a-zA-Z0-9]/gi,"")}if(0!=T.select(e).getAttribute("multi")||r.includes("#cm"))""!=(c=c.replace(/,/g,"#cm"))&&this.checkInArray(r.split(","),c.split(","))?this.temp++:this.result=!1;else{var m=t.getAttribute("haskeywords"),f=t.getAttribute("hasnotkeywords");if(1==t.getAttribute("keywordtype")&&m.length>0&&f.length>0){var g=0,b=0;m.split(",").forEach(((e,t)=>{-1!=c.indexOf(e)&&g++})),f.split(",").forEach(((e,t)=>{-1!=c.indexOf(e)&&b++})),m.split(",").length!=g||0!=b?this.result=!1:this.temp++}else r!=c?this.result=!1:this.temp++}"undefined"!=typeof calculatePoint&&calculatePoint(T.select(e).getAttribute("totalcorrectans"),this.temp);var x=t.value;"TEXTAREA"==t.nodeName&&(x=(x=x.replace(/'/g,"#singlequote#")).replace(/"/g,"#dblquote#")),t.nodeName,i+=`<div id='${t.parentElement.getAttribute("id")}' userAns='${x}'></div>\n`}return i}modeOn(e,t){T.selectAll(".test, .review","addClass","h"),e?("function"==typeof hotkeys&&(hotkeys.unbind("alt+down,enter,delete","fillintheblank"),hotkeys.deleteScope("fillintheblank")),T.selectAll(".review","removeClass","h"),this.unBindLab(),this.showdragans(ajax_eId,"u",1)):(this.bindKeyup(ajax_eId),T.selectAll(".test","removeClass","h"),this.bindLab(),this.showdragans(ajax_eId,"u"))}bindLab(){this.labBinded=!0,T.find(ajax_eId,"select,input,textarea",{action:"removeAttr",actionData:"disabled"});try{this.readyFill(ajax_eId)}catch(e){console.log("catch")}}unBindLab(){this.labBinded=!1,T.find(ajax_eId,"input,select,textarea","all").forEach((e=>{"INPUT"==this.nodeName||"TEXTAREA"==this.nodeName?e.getAttribute("userans",e.value):"SELECT"==this.nodeName&&e.querySelectorAll("option").forEach(((e,t)=>{e.selected?e.setAttribute("userans",1):e.setAttribute("userans","")}))}))}pre_fill(e){T.find(e,".fillelement,.dropable","all");T.find(e,".prettyprint","all").length>0&&("function"==typeof activate&&activate(1),T.selectAll(e,"hide"),T.find(e,"pre").classList.contains("lg")&&T.selectAll(e,"css",{width:"930px"}),setTimeout((()=>{T.find(e,"pre").classList.contains("linenums")?this.delPreSpaces.withLines(e):this.delPreSpaces.withoutLines(e),this.delPreSpaces.showFillModule(e)}),1e3))}};function j(e){s(e,"svelte-1yk78jl","xmp{display:inline}#fillmain{overflow:hidden;max-width:1024px;text-align:left}#fillmain pre{background:none;border:none;font-size:14px!important}#fillmain .string{min-height:50px;margin-top:10px;margin-right:10px}#fillmain .footerStr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}#fillmain .footerStr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}#fillmain .fill-row{padding:6px}#fillmain .fillelement{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}#fillmain .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px 0 1px 0;top:-3px}td .drag-resize{top:0 !important}td .fillelement{top:0px !important}#fillmain input[type=\"text\"]{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}#fillmain .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}#fillmain .drag-resize.dragable{cursor:move}#fillmain .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}#fillmain .fillcheck ul{width:220px}#fillmain .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}#fillmain .select{font-size:15px}#fillmain .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}.sel{border:2px solid #FF0000!important}#fillmain .dragable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}#fillmain .dropable:focus{box-shadow:inset 0 0 0 1px transparent, inset 0 0 0 1px #ffffff, inset 0 0 0 2px #fff;outline:none}.highlight_main{border:1px dashed #000}.copiedclr{background-color:#CCC!important}#fillmain select::-ms-expand{margin-left:2px}.fillintheblank{height:30px;padding:5px 10px;font-size:14px;margin-bottom:3px;line-height:20px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;color:#555;background-color:#FFE;vertical-align:middle;background-image:none;border:1px solid #ccc;font-family:Helvetica,Arial,'Times New Roman',Verdana,sans-serif;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);-webkit-transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s;transition:border-color ease-in-out .15s,box-shadow ease-in-out .15s}.fillintheblank:focus{border-color:rgba(82,168,236,0.8);outline:0;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);-moz-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075),0 0 8px rgba(82,168,236,0.6)}.correct_incorrect_icon_fill{position:absolute;width:17px;height:18px;right:-4px;top:-7px;font-size:17px;white-space:normal !important;z-index:9 !important}.corr_div{display:none;position:absolute;width:100%;height:100%;background-color:#21a81d;color:#ffffff;top:0%;padding-top:4px;border-radius:3px;cursor:none !important}.auto_height{height:auto!important}.prettyprint{display:-ms-grid!important}")}function C(e){let t;return{c(){t=M("*Matching is not case sensitive.")},m(e,i){f(e,t,i)},d(e){e&&A(t)}}}function q(e){let t;return{c(){t=M("*Exact matching is required.")},m(e,i){f(e,t,i)},d(e){e&&A(t)}}}function F(e){let t,i;return t=new L({props:{spanId:e[6].spanId,divId:e[6].divId,action:e[3].fillMath[e[5]],show:e[10]}}),{c(){r(t.$$.fragment)},m(e,l){n(t,e,l),i=!0},p(e,i){const l={};64&i[0]&&(l.spanId=e[6].spanId),64&i[0]&&(l.divId=e[6].divId),40&i[0]&&(l.action=e[3].fillMath[e[5]]),t.$set(l)},i(e){i||(o(t.$$.fragment,e),i=!0)},o(e){d(t.$$.fragment,e),i=!1},d(e){c(t,e)}}}function z(e){let t,i,l,a,s,y,v,w,_,k,E,$,M,L,T,S,j,z,P,R,O,D,H={handleReviewClick:e[11],reviewMode:e[0],customReviewMode:e[7]};function Q(e,t){return"0"==e[6].matchtype?q:C}l=new I({props:H}),e[16](l),l.$on("setReview",e[8]),l.$on("unsetReview",e[9]);let B=Q(e),X=B(e),Z=e[6].showToolbar&&F(e);return{c(){t=p("div"),i=p("center"),r(l.$$.fragment),a=u(),s=p("div"),y=p("div"),v=u(),w=p("div"),X.c(),_=u(),k=p("div"),E=p("div"),$=u(),M=p("center"),L=u(),Z&&Z.c(),h(y,"class","string"),h(y,"id","previewArea"),m(w,"color","#b94a48"),m(w,"margin-top","5px"),h(w,"class","smnotes"),h(E,"class","arrow-up"),h(M,"class","dragArea"),h(k,"class","footerStr"),m(k,"display",e[6].footerStr?"block":"none"),h(s,"id",N),h(s,"class",T="fillmain "+(e[0]?"pe-none":null)),h(s,"matchtype",S=e[6].matchtype),h(s,"multi",j=e[6].multi),h(s,"ignoretype",z=e[6].ignoretype),h(s,"manual_grade",P=e[1]||0),h(s,"totalcorrectans",R=e[6].totalcorrectans),m(s,"font-family",'"Open Sans",sans-serif'),m(s,"font-size","15px"),h(t,"class",O=e[2]?"mx-4 pl-2 pl-md-0":"")},m(e,r){f(e,t,r),g(t,i),n(l,i,null),g(i,a),g(i,s),g(s,y),g(s,v),g(s,w),X.m(w,null),g(s,_),g(s,k),g(k,E),g(k,$),g(k,M),g(s,L),Z&&Z.m(s,null),D=!0},p(e,i){const a={};1&i[0]&&(a.reviewMode=e[0]),l.$set(a),B!==(B=Q(e))&&(X.d(1),X=B(e),X&&(X.c(),X.m(w,null))),(!D||64&i[0])&&m(k,"display",e[6].footerStr?"block":"none"),e[6].showToolbar?Z?(Z.p(e,i),64&i[0]&&o(Z,1)):(Z=F(e),Z.c(),o(Z,1),Z.m(s,null)):Z&&(b(),d(Z,1,1,(()=>{Z=null})),x()),(!D||1&i[0]&&T!==(T="fillmain "+(e[0]?"pe-none":null)))&&h(s,"class",T),(!D||64&i[0]&&S!==(S=e[6].matchtype))&&h(s,"matchtype",S),(!D||64&i[0]&&j!==(j=e[6].multi))&&h(s,"multi",j),(!D||64&i[0]&&z!==(z=e[6].ignoretype))&&h(s,"ignoretype",z),(!D||2&i[0]&&P!==(P=e[1]||0))&&h(s,"manual_grade",P),(!D||64&i[0]&&R!==(R=e[6].totalcorrectans))&&h(s,"totalcorrectans",R),(!D||4&i[0]&&O!==(O=e[2]?"mx-4 pl-2 pl-md-0":""))&&h(t,"class",O)},i(e){D||(o(l.$$.fragment,e),o(Z),D=!0)},o(e){d(l.$$.fragment,e),d(Z),D=!1},d(i){i&&A(t),e[16](null),c(l),X.d(),Z&&Z.d()}}}let N="fillmain";function P(e){let t=document.querySelectorAll(".textarea.ks");for(let l=0;l<t.length;l++){let a=t[l];var i=setTimeout((function(){a.style.cssText="height:auto;overflow: auto;",e&&(window.isIE?a.style.cssText="height:"+(a.scrollHeight+10)+"px;overflow: hidden":a.style.cssText="height:"+a.scrollHeight+"px;overflow: hidden"),clearTimeout(i)}),100)}}function R(e,t,i){let l,a,{manual_grade:s}=t,{xml:r}=t,{uxml:n}=t,{isReview:o}=t,{editorState:d}=t,{smValidate:c}=t,{showAns:p}=t,u=o,h="",m="",f=[],g=0,b=1,x=[],A={},M={};globalThis.ajax_eId="#fillmain";let I={};E({matchtype:"0",ignoretype:"",multi:"",totalcorrectans:0,showToolbar:!1,isMathquill:!1,fillMath:[],footerStr:!1}).subscribe((e=>{i(6,I=e)}));function L(){if(i(6,I.xml=r,I),A=_(r),n&&(window.isResetMath?window.isResetMath=!1:(M=_(n),i(6,I.uxml=n,I))),function(e,t=!1){h=e.smxml.text.__cdata,m="",f=[],g=0,i(6,I.footerStr=!1,I),v.selectAll(".smnotes","hide"),e.smxml.text._matchType&&(e.smxml.text._matchtype=e.smxml.text._matchType,delete e.smxml.text._matchType);e.smxml.text._ignoreType&&(e.smxml.text._ignoretype=e.smxml.text._ignoreType,delete e.smxml.text._ignoreType);i(6,I.matchtype=e.smxml.text._matchtype,I),i(6,I.ignoretype=e.smxml.text._ignoretype,I),i(6,I.multi="multiple"==e.smxml.text._multiple?"1":"",I);let l=h.match(/%{[\s\S]*?}%/gm),a="",s="",r=0;l&&l.forEach(((e,n)=>{if(r++,t&&t.smans){let e=t.smans.div;0==Array.isArray(e)&&(e=[],e[0]=t.smans.div),e&&(s=e[n])}let o=l[n];a=l[n].match(/\|(.*?)}%$/gm),a=a?a[0].replace(/\||}%/gm,""):"",a=a.trim(),""==a||"c"==a?(v.selectAll(".smnotes","show"),s?O(o,n,s):O(o,n)):"n"==a?s?D(o,n,s):D(o,n):"d"==a||"ds"==a?s?B(o,n,s):B(o,n):"s"==a?s?H(o,n,s):H(o,n):"e"==a?(i(6,I.isMathquill=!0,I),s?R(o,n,s):R(o,n)):(a.indexOf(!1)||a.indexOf(!1))&&(v.selectAll(".smnotes","show"),s?Q(o,n,s):Q(o,n));o.replace("%{","").replace("}%","")}));v.selectAll("#"+N,"attr",{totalcorrectans:r}),h=v.ignoreEnity(h),v.find("#"+N,"#previewArea",{action:"html",actionData:h}),v.find("#"+N,".dragArea",{action:"html",actionData:m});let n=v.find("#"+N,".dragArea"),o=n?.children?Array.from(n.children):[];for(;o.length;)n.append(o.splice(Math.floor(Math.random()*o.length),1)[0]);(function(){let e=[];v.selectAll(".dragArea div").forEach(((t,i)=>{e.push(10*t.innerHTML.length+30)})),v.selectAll("#previewArea [id^=elem]").forEach((t=>{t.classList.contains("drag-resize")&&v.setCss(t,{"max-width":Math.max(...e)})}))})(),function(){if(v.find(ajax_eId,"table.uc-table","all").length>0){let e=v.find(ajax_eId,"table.uc-table").clientWidth+9;v.setCss(v.find(ajax_eId,".smnotes"),{width:e+"px",margin:"auto","padding-top":"21px","padding-left":"65px"})}}(),z();var d=setTimeout((function(){v.find(ajax_eId,".prettyprint","all").length>=1&&0==v.find(ajax_eId,".prettyprint .L0","all").length&&"function"==typeof prettyPrint&&(v.selectAll(".prettyprint").forEach((e=>{e.classList.add("prettyprintReplica"),e.classList.remove("prettyprint")})),v.selectAll(".linenums").forEach((e=>{e.classList.add("linenumsReplica"),e.classList.remove("linenums")})),v.find(ajax_eId,".prettyprintReplica").forEach((e=>{e.classList.add("prettyprint")})),v.find(ajax_eId,".linenumsReplica").forEach((e=>{e.classList.add("linenums")})),prettyPrint(),v.selectAll(".prettyprintReplica").forEach((e=>{e.classList.add("prettyprint"),e.classList.remove("prettyprintReplica")})),v.selectAll(".linenumsReplica").forEach((e=>{e.classList.add("linenums"),e.classList.remove("linenumsReplica")}))),clearTimeout(d)}),2e3);if(v.find(ajax_eId,"table.uc-table","all").length>0){v.find(ajax_eId,"table.uc-table",{action:"addClass",actionData:"font14"});try{"BR"==v.find(ajax_eId,"table.uc-table").previousElementSibling?.nodeName&&v.find(ajax_eId,"table.uc-table").previousElementSibling.remove()}catch(e){console.warn(e)}}}(A,M),!r){let e=smVal.validate(d.content_type,d.subtype,d.content_icon);c(e)}}function T(){i(0,o=!0),r.includes("user Response{")&&(window.isResetMath=!0),i(6,I.showToolbar=!1,I),S.modeOn("on"),S.showdragans(ajax_eId,"u",1),v.selectAll(".remed_disable","show"),P(1);let e=document.getElementById(N);e=e?e.getElementsByClassName("mathquill"):e,e&&(v.setCss(ajax_eId,{position:"relative"}),v.insert(ajax_eId,"<div class='spinner-wrapper' style='position:absolute!important;opacity:0!important;'></div>","afterbegin")),C()}function j(){i(0,o=!1),v.selectAll(".mathquill","css",{border:"none"}),S.modeOn(),v.selectAll(".remed_disable, .corr_div","hide"),S.showdragans(ajax_eId,"u",0);let e=document.getElementById(N);e=e?e.getElementsByClassName("mathquill"):e,P(),e&&(v.selectAll(ajax_eId,"css",{position:"unset"}),v.selectAll(".spinner-wrapper","remove"))}function C(){let e=S.checkAns(ajax_eId),t={ans:S.result,uXml:S.userAnsXML};k(t),d&&p(e)}function q(e,t){let l=!0;for(;l;)(e=e.parentElement).getAttribute("id")&&(l=!1,i(5,a=e.getAttribute("id")));let s=[];v.selectAll("#"+a+" span.mq-editable-field").forEach((t=>{let i=e.getAttribute("mathquill-command-id");s.push(i)}));let r=e.getAttribute("mathquill-command-id"),n=s.indexOf(r);i(6,I.spanId=n,I),i(6,I.divId=a,I),i(6,I.showToolbar=!0,I)}function F(e,t){i(6,I[e]=t,I),"uxml"==e&&(M=_(I.uxml),function(e){let t="",i=A.smxml.text.__cdata.match(/%{[\s\S]*?}%/gm),l="";i&&i.forEach(((i,a)=>{if(e&&e.smans){let i=e.smans.div;0==Array.isArray(i)&&(i=[],i[0]=e.smans.div),i&&(t=i[a])}if(l=i.match(/\|(.*?)}%$/gm),l=l?l[0].replace(/\||}%/gm,""):"",l=l.trim(),t&&t._userAns){let e="";""==l||"c"==l||"n"==l?e=`#elem${a} .fillintheblank`:"d"==l||"ds"==l?e="#elem"+a:"s"==l||("e"==l?e="#elem"+a:(l.indexOf(!1)||l.indexOf(!1))&&(e=`#elem${a} .textarea`)),v.isValid(e)&&document.querySelector(e)&&document.querySelector(e).setAttribute("userans",t._userAns)}}))}(M))}function z(){try{S.readyFill(ajax_eId)}catch(t){if(b<=100)var e=setTimeout((()=>{z(),clearTimeout(e)}),50);else console.warn("Error at runModule function");b++}}function R(e,t,l=!1){let a=e,s=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].replace(/user Response/g,"\\MathQuillMathField").split("##"),r=Math.floor(Math.random()*s.length),n=s[r],o=n.replace(/MathQuillMathField{(.*?)}/g,"MathQuillMathField{}"),d=0,c=n;l?l._userAns&&(o=l._userAns,l._userAnsSeq&&(c=l._anskey,r=l._userAnsSeq)):n.indexOf("MathQuillMathField")>-1&&(c=n,d=1),v.select("#elem"+t,"css",{display:"none"});let p=`<div id="main_div" class="text-center filter auto_height fillelement mathitem inline-block"><div class="disable_div fh fwidth absolute h"></div><div class="remed_disable fh fwidth absolute h"></div>\n\t\t\t<span  id="m${t}" style="display:none;" class="auto_height h corr_div fillmathelement mathquill" userAnsSeq="${r}" anskey="${c}" defaultans="${d}" mathtype="1">\n\t\t\t\t${c}\n\t\t\t</span>\n\t\t\t${`<span id="elem${t}" class="auto_height edit_step fillmathelement mathquill" userAnsSeq="${r}" userans="${o}" anskey="${c}" defaultans="${d}" mathtype="1"></span>`}\n\t\t</div>`;h=h.replace(a,p);let u=setInterval((()=>{if("function"==typeof MathQuill){clearInterval(u),v.selectAll("#elem"+t,"show");let e=MathQuill.getInterface(2);v.selectAll(".mathquill").forEach((t=>{let i=t.getAttribute("id");if(1==t.getAttribute("defaultans")){var l=t.getAttribute("userans");null!=l&&v.select("#"+i,"text",l)}else v.select("#"+i,"text",t.getAttribute("userans"));x[i]=e.StaticMath(document.getElementById(i))})),i(3,S.fillMath=x,S)}}),100)}function O(e,t,i=!1){var l="";i&&i._userAns&&(l=i._userAns);let a=e,s="",r=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&"c"==e[1].trim()?"1":"",n=e[0].trim();if(-1!=n.indexOf("#style#")){let e=n.split("#style#");n=e[0],s=e[1]}let o=[],d=n.split(",");v.selectAll(d).forEach(((e,t)=>{o[t]=10*d[t].length+30}));let c=`<div id="elem${t}" class="fillelement">${`<input type="text" class="fillintheblank ks" anskey="${n.trim()}" value="${l}" userans="${l}" defaultans="" haskeywords="" codetype="${r}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:${Math.max(...o)}px;${s}" />`}</div>`;h=h.replace(a,c)}function D(e,t,i=!1){var l="";i&&i._userAns&&(l=i._userAns);let a=e,s="",r=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&"c"==e[1].trim()?"1":"",n=e[0].trim();if(-1!=n.indexOf("#style#")){let e=n.split("#style#");n=e[0],s=e[1]}let o=[],d=n.split(",");v.selectAll(d).forEach(((e,t)=>{o[t]=10*d[t].length+30}));let c=`<div id="elem${t}" class="fillelement">${`<input type="number" onKeyDown="if(isNaN(event.key)){var key_arr = [13, 37, 38, 39, 40, 8, 69, 101, 46, 16, 9];if(!key_arr.includes(event.keyCode)) event.preventDefault()} "class="fillintheblank ks" anskey="${n.trim()}" value="${l}" userans="${l}" defaultans="" haskeywords="" codetype="${r}" hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width: ${Math.max(...o)+20}px;${s}" />`}</div>`;h=h.replace(a,c)}function H(e,t,i=!1){let l=e,a=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim();a=a.split(",").map((e=>e.trim()));let s='<option value="">&nbsp;Please Select</option>';v.selectAll(a).forEach(((e,t)=>{let l=0==a[t].indexOf("*")?"1":"0",r=0==a[t].indexOf("+")?'selected="selected"':"",n=0==a[t].indexOf("*")||0==a[t].indexOf("+")?a[t].slice(1):a[t],o="";if(i&&i._userAns){r="",t==i._userAns.split(",")[0].trim()-1&&(r='selected="selected"',o="1")}n=n.replace(/\#cm/gim,",").replace(/\#pl/gim,"+"),s+=`<option value="${t}" correctans="${l}" userans="${o}" ${r}>&nbsp;${n}</option>`}));let r=`<div id="elem${t}" class="fillelement">${`<select class="fillintheblank ks" data-role="none">${s}</select>`}</div>`;h=h.replace(l,r)}function Q(e,t,i=!1){let l="";i&&i._userAns&&(l=i._userAns);let a=e,s=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim(),r=JSON.parse(e[1]),n=`<span id="elem${t}" class="fillelement" style="height:auto">${`<textarea class="textarea ks" rows="${r.rows}" cols="${r.cols}" anskey="${s}" value="${l}" defaultans="${r.defaultAns?r.defaultAns:""}" userans="${l}" haskeywords="" hasnotkeywords="" keywordtype="1" autocomplete="off" data-role="none">${l}</textarea>`}</span>`;h=h.replace(a,n)}function B(e,t,l=!1){let a=e,s=(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0].trim(),r="ds"==e[1].trim()?"1":"0",n=s.split(","),o="";v.selectAll(n).forEach(((e,t)=>{let i=!1,l=10*n[t].length+30,a=n[t],s=n[t].match(/i~|~i/g),d="";s?a=n[t].replace(/i~|~i/g,""):(o+="ID"+g+",",d="ID"+g+","),v.selectAll(f).forEach(((e,t)=>{f[t].ans==a&&(i=!0,s||(o=o.replace(d,""),o+=f[t].id+","))})),0==i&&f.push({ans:a,id:"ID"+g}),0==i&&(m+=`<div id="ID${g}" dragable="true" tabindex="0" class="drag-resize dragable ks" caption="${a.replace(/\#cm/gim,",").replace(/\"/gim,"#doublequote#")}" path="//s3.amazonaws.com/jigyaasa_content_static/" drag-single="${r}" bgcolor="#CCFFCC" style="background-color:#CCFFCC;height:auto;max-width:${l}px;padding:3px 10px 3px 10px; margin: 2px 2px;" aria-disabled="false">${a.replace(/\#cm/gim,",")}</div>`),0==i&&g++}));let d="";l&&l._userAns&&(d=l._userAns);let c='<div id="elem'+t+'" tabindex="0" dropzone="1" class="drag-resize dropable ks" path="//s3.amazonaws.com/jigyaasa_content_static/" anskey="'+o.slice(0,-1)+'" caption="" userans="'+d+'" droped="'+d+'" bgcolor="#FFFFCC" style="background-color: rgb(255, 255, 204); min-width: 50px; height: auto; padding: 5px 10px 5px;">'+d+"</div>";h=h.replace(a,c),i(6,I.footerStr=!0,I)}return y((async()=>{in_editor&&v.addScript("","https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"),v.addScript("",window.itemUrl+"src/libs/mathQuill_new.js"),S.setUpdate(F.bind(this));let e=document.getElementById(N);e=e?e.getElementsByClassName("mathquill"):e,I.isMathquill&&v.selectAll("div"+ajax_eId,"css",{overflow:"auto"}),v.bind(ajax_eId,"click",C),v.bind(ajax_eId,"keyup",C),v.bind(ajax_eId,"change",C),v.bind(ajax_eId,"dragend",C),v.listen(document,"click","span.mq-editable-field.mq-focused",q),v.listen(document,"change","span.mq-editable-field.mq-focused",q),L()})),w((()=>{if(r!=I.xml){if(d&&1==d.stopPreviewUpdate)return!1;L(),setTimeout((function(){let e=document.getElementById("previewArea");if(e.childNodes[0]&&"TABLE"==e.childNodes[0].nodeName){e=document.querySelectorAll("#previewArea td");for(let t in e)e[t].firstElementChild||"TD"!=e[t].nodeName||e[t].setAttribute("tabindex","0")}else for(let t in e.childNodes)if(3==e.childNodes[t].nodeType){let i=document.createElement("span");i.setAttribute("tabindex","0"),i.innerHTML=e.childNodes[t].textContent,e.childNodes[t].replaceWith(i)}}),1e3)}})),e.$$set=e=>{"manual_grade"in e&&i(1,s=e.manual_grade),"xml"in e&&i(2,r=e.xml),"uxml"in e&&i(12,n=e.uxml),"isReview"in e&&i(0,o=e.isReview),"editorState"in e&&i(13,d=e.editorState),"smValidate"in e&&i(14,c=e.smValidate),"showAns"in e&&i(15,p=e.showAns)},e.$$.update=()=>{1&e.$$.dirty[0]&&(o?T():j())},[o,s,r,S,l,a,I,u,T,j,function(e){i(6,I.showToolbar=e,I)},function(e,t){"c"==e?(S.showdragans(ajax_eId,"c",1),v.selectAll(".corr_div","css",{display:"block"}),v.selectAll(".remed_disable","css",{display:"block"}),P(1)):(S.showdragans(ajax_eId,"u",1),v.selectAll(".corr_div","hide"),P(1))},n,d,c,p,function(e){$[e?"unshift":"push"]((()=>{l=e,i(4,l)}))}]}export default class extends i{constructor(e){super(),l(this,e,R,z,a,{manual_grade:1,xml:2,uxml:12,isReview:0,editorState:13,smValidate:14,showAns:15},j,[-1,-1])}}
//# sourceMappingURL=FillInTheBlanksPreview-45511c4c.js.map
