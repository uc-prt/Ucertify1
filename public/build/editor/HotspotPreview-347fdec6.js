import{E as t,S as e,i,s,D as n,c as a,m as r,t as o,a as l,d as c,e as d,b as h,f as p,h as m,j as u,k as g,n as w,o as f,p as x,X as v,A as b,W as y,q as A,g as _,u as S,K as k,_ as C,l as I,$ as N}from"./main-fcda70bb.js";import{I as M}from"./ItemHelper-626a7559.js";import{s as $}from"./style-inject.es-1f59c1d0.js";const T=new t;class L{constructor(){this.userAnsXML="<SMANS></SMANS>",this.xaxis=[],this.yaxis=[],this.count=0,this.drawstr="",this.elemId="#hptmain0",this.labBinded=!0,this.result=!1,this.temp=0}readyThis(t,e,i,s){if(t="#"+t,!e){this.labBinded=!0;const e=function(e){if(this.labBinded){let i=e,s="";i.classList.contains("selected")?(i.setAttribute("data-userans",0),i.classList.remove("selected")):(i.setAttribute("data-userans",1),i.classList.add("selected")),T.find(t,"[type] .textClick.selected","all").forEach((function(t,e){s=0==e?t.textContent:s+"|"+t.textContent})),T.find(t,"[type]",{action:"attr",actionData:{"data-userans":s}})}},i=function(e){if(this.labBinded){let i="";"SPAN"==e.target?.nodeName?(T.select(e.target,"removeClass",["selecttext","selected"]),this.removespan(e.target,t,0)):this.highlightText(t),T.find(t,"[type] .selecttext.selected","all").forEach((function(t,e){i=0==e?t.textContent:i+"|"+t.textContent}));let s=T.find(t,"[type]");T.select(s,"attr",{"data-userhtml":s.innerHTML,"data-userans":i})}};T.listen(t,"touchstart",".textClick",e.bind(this)),T.listen(t,"touchend",".textClick",e.bind(this)),T.listen(t,"click",".textClick",e.bind(this)),T.listen(t,"touchstart",'[type="textselect"]',i.bind(this)),T.listen(t,"touchend",'[type="textselect"]',i.bind(this)),T.listen(t,"click",'[type="textselect"]',i.bind(this))}}check_Ans(t){let e={inNativeIsCorrect:!1,userAnswers:""};this.userAnsXML="<smans type='4'>\\n",this.result=!0,this.temp=0;let i=T.select(t).children;for(let e=0;e<i.length;e++)this.userAnsXML=this.checkChildAnswer(t,i[e],this.userAnsXML);return this.userAnsXML+="</smans>",window.ISSPECIALMODULEUSERXMLCHANGE=1,e.userAnswers=T.select("#special_module_user_xml").value,"undefined"!=typeof calculatePoint&&calculatePoint(T.select(t).getAttribute("totalcorrectans"),temp),window.inNative&&(window.getHeight?.(),e.inNativeIsCorrect=this.result,window.postMessage(JSON.stringify(e),"*")),{uXml:this.userAnsXML,status:this.result}}checkChildAnswer(t,e,i){let s=e.getAttribute("type");switch(s){case"textclick":case"textselect":var n=e.getAttribute("data-correctans").split("|").sort().join("|"),a=e.getAttribute("data-userans").split("|").sort();n!=(a=(a=a.filter((function(t){return t}))).join("|"))&&(this.result=!1),"undefined"!=typeof calculatePoint&&T.find(e,"p","all").forEach((t=>{t.classList.contains("selected")&&t.getAttribute("data-userans")==t.getAttribute("data-correctans")&&this.temp++})),this.userAnsXML+="textselect"==s?`<div id="${e.getAttribute("id")}" data-userHtml="${escape(e.getAttribute("data-userhtml"))}" data-userAns="${escape(e.getAttribute("data-userans"))}"></div>\\n`:`<div id="${e.getAttribute("id")}" data-userAns="${escape(e.getAttribute("data-userans"))}"></div>\\n`}return this.userAnsXML}showansdrag(t,e,i){void 0===i&&(i=0);let s=T.select(t).children;if(s)for(let n=0;n<s.length;n++)this.showchilddragans(t,s[n],e,i)}showchilddragans(t,e,i,s){let n=T.select(e);switch(n.getAttribute("type")){case"textclick":if("c"==i){T.find(n,".show_correct,.show_incorrect","all").length>0&&(T.find(n,".show_correct,.show_incorrect",{action:"removeClass",actionData:["show_correct","show_incorrect"]}),T.find(n,".correct_incorrect_icon",{action:"remove"}),T.find(n,".correct_incorrect_icon",{action:"removeAttr",actionData:"style"}));let s=e.getAttribute("data-correctans").split("|");e.getAttribute("type");s.forEach((e=>{this.selectText(t,e,i,"selected")}))}else if("u"==i){e.getAttribute("type");try{var a=decodeURIComponent(e.getAttribute("data-userans"))}catch(t){a=decodeURIComponent(unescape(e.getAttribute("data-userans")))}if(a=(a=a.split("|")).filter((function(t){return t})),void 0!==s&&1==s){T.find(t,".selected",{action:"removeClass",actionData:"selected"});var r=e.getAttribute("data-correctans").split("|");a.forEach((e=>{let s="show_incorrect";T.findInArray(e,r)?(s="show_correct",this.selectText(t,e,i,s)):this.selectText(t,e,i,s)}))}else a.forEach((e=>{this.selectText(t,e,"c","selected"),T.select(t+" p span").length&&T.select(t+" p span").remove(),T.select(".textClick","removeClass",["show_incorrect","show_correct"])}))}break;case"textselect":if("c"==i){T.find(n,".show_correct,.show_incorrect").length>0&&(T.find(n,".show_correct,.show_incorrect",{action:"removeClass",actionData:["show_correct","show_incorrect"]}),T.find(n,".correct_incorrect_icon",{action:"removeAttr",actionData:"style"}));r=e.getAttribute("data-correctans").split("|"),e.getAttribute("type");T.select(e,"html",e.getAttribute("data-correcthtml").replace(/<span>/g,"</span>"))}else if("u"==i){e.getAttribute("type");try{a=decodeURIComponent(e.getAttribute("data-userans"))}catch(t){a=decodeURIComponent(unescape(e.getAttribute("data-userans")))}if(a=(a=a.split("|")).filter((function(t){return t})),""!=e.getAttribute("data-userhtml")||"undefined"==e.getAttribute("data-userhtml")){var o=e.getAttribute("data-userhtml");try{o=decodeURIComponent(o);var l=decodeURIComponent(o)}catch(t){console.log(t)}T.select(e,"html",l)}if(void 0!==s&&1==s){let t='<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold" style="color:green;vertical-align:super;">',i='<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold red" style="vertical-align: super;">';T.insert(e.querySelector('span[userans="1"]span[correctans="1"]'),'<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:17px;background:white;border-radius:12px;font-size: 18px;"> '+t+"</span></span>","beforeend"),T.insert(e.querySelector('span[userans="1"]span[correctans="0"]'),'<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:17px;background:white;border-radius:12px;font-size: 18px;"> '+i+"</span></span>","beforeend")}}break;case"imagehighlight":{let e=T.find(t,"canvas"),s=T.select("#special_module_parse").value,n=s.substring(s.indexOf("{"),s.lastIndexOf("}")+1);if(""!=n&&(n=JSON.parse(n)),this.drawOnCanvas(e,n,window.color),"c"==i){let t=e.getAttribute("correctans");""!=t&&(t=JSON.parse(t)),this.drawOnCanvas(e,t,"green")}break}}}calculateArea(t,e,i){return{top:Math.min.apply(Math,i),left:Math.min.apply(Math,e),width:Math.max.apply(Math,e)-Math.min.apply(Math,e),height:Math.max.apply(Math,i)-Math.min.apply(Math,i)}}getCoordinate(t,e,i,s){return 0==s?this.drawstr='{"'+ ++s+'":{"x":['+e+'],"y":['+i+"]}}":(this.drawstr=T.select("#special_module_parse").value,this.drawstr=this.drawstr.substring(this.drawstr.indexOf("{"),this.drawstr.lastIndexOf("}")+1),this.drawstr=this.drawstr.slice(0,-1),this.drawstr+=',"'+ ++s+'":{"x":['+e+'],"y":['+i+"]}}"),T.selectAll(T.select(t).children,"attr",{userans:this.drawstr}),this.createUserAnsXMLDraw(this.drawstr),this.userAnsXML}update_HTMLValue(){let t=T.parseHtml(T.select("#special_module_xml").value),e="",i="";if(t)for(let s of t.attributes)switch(na_attr.nameme){case"bgimg":e=s.value;break;case"path":i=s.value}let s=T.children(t,"div"),n=s.getAttribute("top"),a=s.getAttribute("left"),r=s.getAttribute("width"),o=s.getAttribute("height");T.select("#area","css",{height:o,top:n,width:r,left:a}),e&&i&&T.select("#im","attr",{src:i+"/"+e})}movetarget(t,e,i){let s;t.style.display="",!window.event&&i.layerX?(t.style.top=i.layerY-t.height/2+"px",t.style.left=i.layerX-t.width/2+"px"):(t.style.top=i.offsetY-t.height/2+"px",t.style.left=i.offsetX-t.width/2+"px"),s=this.checkmodule(t,e),this.createUserAnsXML(t.style.top,t.style.left);let n=document.getElementById("special_module_user_xml");n.value=this.userAnsXML,n=document.getElementById("answer"),n.checked=s>0,"undefined"!=typeof calculatePoint&&(this.temp=1==s,calculatePoint(1,s))}createUserAnsXMLDraw(t){this.userAnsXML='<SMANS type="4"><div userans="'+t+'"></div></SMANS>'}createUserAnsXML(t,e){this.userAnsXML='<SMANS type="4"><div targetTop="'+parseInt(t)+'" targetLeft="'+parseInt(e)+'" /></SMANS>'}checkmodule(t,e){let i=0;return parseInt(t.style.top)+t.height/2>=parseInt(e.style.top)&&parseInt(t.style.top)+t.height/2<=parseInt(e.style.top)+parseInt(e.style.height)&&parseInt(t.style.left)+t.width/2>=parseInt(e.style.left)&&parseInt(t.style.left)+t.width/2<=parseInt(e.style.left)+parseInt(e.style.width)&&(i=1),i}drawOnCanvas(t,e,i){if(t){let s=0!=t.toString().indexOf("d")?document.getElementById(t.getAttribute("id")):document.getElementById(t),n=null!=s?s.getContext("2d"):"",a=Object.keys(e).length;if(""!=e&&""!=n)for(let t=1;t<=a;t++)for(let s=0;s<=e[t].x.length;s++)n.beginPath(),n.lineWidth="4",n.strokeStyle=i,n.moveTo(e[t].x[s],e[t].y[s]),n.lineTo(e[t].x[s+1],e[t].y[s+1]),n.stroke()}}compareDrawing(t,e,i){let s=0,n=this.getAreaVal(t),a=this.getAreaVal(e),r=0,o=0,l=Object.keys(a).length,c=Object.keys(n).length;for(let t=1;t<=l;t++){for(let e=1;e<=c;e++)if(n[e].height<=a[t].height&&n[e].width<=a[t].width&&n[e].top>=a[t].top&&a[t].left+a[t].width-(n[e].left+n[e].width)>=0&&n[e].left>=a[t].left&&a[t].top+a[t].height-(n[e].top+n[e].height)>=0){r++;break}"undefined"!=typeof calculatePoint&&(t==r&&o++,calculatePoint(T.select(i).getAttribute("totalcorrectans"),o))}return l==r&&l==c&&(s=1),s}getAreaVal(t){let e=Object.keys(t).length;if(""!=t){let i=[];for(let s=1;s<=e;s++)i[s]=this.calculateArea("",t[s].x,t[s].y);return i}}selectText(t,e,i,s){let n=T.selectAll(t+" p");for(var a=0;a<n.length;a++){let t=n[a];if(t.textContent.trim()==e&&(t.classList.add(s),"u"==i)){let e;e="show_correct"==s?'<span class="icomoon-new-24px-checkmark-circle-1 font-weight-bold" style="color:green;vertical-align:7px">':'<span class="icomoon-new-24px-cancel-circle-1 font-weight-bold red" style="vertical-align:7px">',T.insert(t,'<span class="correct_incorrect_icon" style="position:absolute;z-index:100;width:18px;height:18px;bottom:16px;background:white;border-radius:12px;font-size: 18px;"> '+e+"</span></span>")}}}highlightText(t){if(0!=this.getSelected().getRangeAt(0).endOffset){this.snapSelectionToWord();let i=this.getSelected().getRangeAt(0),s=(i.startOffset,T.find(t,"[type]").getAttribute("data-correctans").split("|"));var e=i.toString();if(e=e.trim()){let t=T.findInArray(e,s)?1:0;this.pasteHtmlAtCaret("<span class='selecttext selected' correctans="+t+" userans='1'>"+e+"</span> ")}}}snapSelectionToWord(){let t;if(window.getSelection&&(t==window.getSelection()).modify){if(t=window.getSelection(),""!=t&&!t.isCollapsed){var e=document.createRange();e.setStart(t.anchorNode,t.anchorOffset),e.setEnd(t.focusNode,t.focusOffset);var i=e.collapsed;e.detach();var s=t.focusNode,n=t.focusOffset;t.collapse(t.anchorNode,t.anchorOffset),i?(T.findInArray(t.anchorNode.textContent.charAt(t.anchorOffset-1),[",",".","!","?",";",")","}"])&&(t.modify("move","backward","character"),t.modify("move","forward","word")),t.extend(s,n),t.modify("extend","forward","character"),t.modify("extend","backward","word")):(t.modify("move","forward","character"),t.modify("move","backward","word"),t.extend(s,n),T.findInArray(t.anchorNode.textContent.charAt(n-1),[",",".","!","?",";",")","}"])&&(t.modify("extend","backward","character"),t.modify("extend","forward","word")))}}else if(t==document.selection&&"Control"!=t.type){let e=t.createRange();if(e.text){for(e.expand("word");/\s$/.test(e.text);)e.moveEnd("character",-1);e.select()}}}pasteHtmlAtCaret(t){let e,i;if(window.getSelection){if(e=window.getSelection(),e.getRangeAt&&e.rangeCount){i=e.getRangeAt(0),i.deleteContents();var s=document.createElement("div");s.innerHTML=t;for(var n,a,r=document.createDocumentFragment();n=s.firstChild;)a=r.appendChild(n);i.insertNode(r),a&&(i=i.cloneRange(),i.setStartAfter(a),i.collapse(!0),e.removeAllRanges(),e.addRange(i))}}else document.selection&&"Control"!=document.selection.type&&document.selection.createRange().pasteHTML(t)}getSelected(){if(window.getSelection)return window.getSelection();if(document.getSelection)return document.getSelection();var t=document.selection&&document.selection.createRange();return!!t.text&&t.text}removespan(t,e,i){let s=t.innerHTML,n=new RegExp("<\\/?span[^>]*>","g");s=s.replace(n,""),t.parentNode.replaceChild(document.createTextNode(s),t),i||T.find(e,"[type]",{action:"html",actionData:T.find(e,"[type]").innerHTML})}modeOnHot(t){T.selectAll(".test, .review","addClass","h"),t?(T.selectAll(".review","removeClass","h"),this.unBindLab(),this.showansdrag(this.elemId,"u",1)):(T.selectAll(".test","removeClass","h"),T.selectAll(".review","addClass","h"),this.bindLab(),this.showansdrag(this.elemId,"u",0))}unBindLab(){this.labBinded=!1,T.find(this.elemId,".hotArea0.hotArea",{action:"css",actionData:{display:"block"}}),T.find(this.elemId,".hotSpotImg",{action:"css",actionData:{pointerEvents:"none"}})}bindLab(){this.labBinded=!0,T.find(this.elemId,".hotArea0.hotArea",{action:"css",actionData:{display:"none"}}),T.find(this.elemId,".hotSpotImg",{action:"css",actionData:{pointerEvents:"auto"}})}}function D(t,e){return!0===isNaN(Number(t))?this.x=0:this.x=t,!0===isNaN(Number(e))?this.y=0:this.y=e,{X:this.x,Y:this.y}}const O=new t;class E{constructor(t){this.prevPoint=void 0,this.defaultOptions={target:"",penSize:1,width:t.width,height:t.height,cssClass:"",onClick:t=>{},onMove:t=>{},onPaint:t=>{},onRelease:t=>{}},this.penWidth=2,this.drawing=!1,this.cap="round",this.ID="dooScribCanvas"+Math.floor(100*Math.random()+1),this.drawingSurface="",t&&(this.Settings={...this.defaultOptions,...t}),!0===isNaN(this.Settings.height)&&(this.Settings.height=100),!0===isNaN(this.Settings.width)&&(this.Settings.width=100),this.init()}init(){let t=this.Settings.target;t?("hptmain0"==t.getAttribute("id")&&O.empty(t),O.insert(t,`<canvas id='${this.ID}' tabindex='0' class='relative ${this.Settings.cssClass}' type='${this.Settings.type}' correctans='${this.Settings.correctans}' userans=''  height='${this.Settings.height}' width='${this.Settings.width}'></canvas>`,"beforeend"),this.penSize(this.Settings.penSize),this.drawingSurface=document.getElementById(this.ID).getContext("2d"),this.drawingSurface.lineWidth=this.penSize(),this.drawingSurface.lineCap=this.cap,!1===this.hasTouch()?(document.getElementById(this.ID).addEventListener("mousedown",this.clickDown.bind(this),!0),document.getElementById(this.ID).addEventListener("mousemove",this.moved.bind(this),!0),document.getElementById(this.ID).addEventListener("mouseup",this.clickUp.bind(this),!0)):(document.getElementById(this.ID).addEventListener("touchstart",this.clickDown.bind(this),!0),document.getElementById(this.ID).addEventListener("touchmove",this.moved.bind(this),!0),document.getElementById(this.ID).addEventListener("touchend",this.clickUp.bind(this),!0))):console.error("Target not defined")}normalizeTouch(t){if(!0===this.hasTouch()){let e=window.scrollY;["touchstart","touchmove"].indexOf(t.type)>-1&&(t.clientX=t.targetTouches[0].pageX,t.clientY=t.targetTouches[0].pageY-e),["touchend"].indexOf(t.type)>-1&&(t.clientX=t.changedTouches[0].pageX,t.clientY=t.changedTouches[0].pageY-e)}return t}clickDown(t){if(!0===this.isDrawing())return;t||(t=window.event),!0===this.hasTouch()&&(t.preventDefault(),t=this.normalizeTouch(t));let e=O.offset(this.Settings.target),i=window.scrollY,s=new D(t.clientX-e.left,t.clientY-(e.top-i));return this.prevPoint=s,this.drawing=!0,this.Settings.onClick(s),!1}moved(t){t||(t=window.event),!0===this.hasTouch()&&(t.preventDefault(),t=this.normalizeTouch(t));var e=O.offset(this.Settings.target),i=window.scrollY,s=new D(t.clientX-e.left,t.clientY-(e.top-i));return!0===this.isDrawing()?(this.drawLine(this.prevPoint.X,this.prevPoint.Y,s.X,s.Y),this.prevPoint=s,this.Settings.onPaint(s)):this.Settings.onMove(s),!1}clickUp(t){if(!1===this.isDrawing())return;!0===this.hasTouch()&&(t.preventDefault(),t=this.normalizeTouch(t));let e=O.offset(this.Settings.target),i=window.scrollY,s=new D(t.clientX-e.left,t.clientY-(e.top-i));return this.Settings.onRelease(s),this.drawing=!1,!1}hasTouch(){return"ontouchstart"in window}penSize(t){return void 0!==t&&!1===isNaN(Number(t))&&(this.penWidth=t),this.penWidth}isDrawing(){if(this.Settings.editable)return this.drawing}lineCap(t){if(void 0!==t)switch(t){case"butt":case"round":case"square":this.cap=t}return this.cap}lineColor(t){if(void 0!==t){let e=O.parseHtml("<div id='stub' style='backgroundColor:white'></div>");e.style.backgroundColor=t;let i=e.style.backgroundColor;void 0!==i&&""!==i&&(window.color=t)}return window.color}context(){return this.drawingSurface}clearSurface(){let t=O.find(document,"canvas").getAttribute("width").replace("px",""),e=O.find(document,"canvas").getAttribute("height").replace("px","");this.drawingSurface.clearRect(0,0,t,e)}drawLine(t,e,i,s){void 0!==t&&void 0!==e&&void 0!==i&&void 0!==s&&!1===isNaN(Number(t))&&!1===isNaN(Number(e))&&!1===isNaN(Number(i))&&!1===isNaN(Number(s))&&(this.drawingSurface.lineCap=this.cap,this.drawingSurface.strokeStyle=window.color,this.drawingSurface.lineWidth=this.penWidth,this.drawingSurface.beginPath(),this.drawingSurface.moveTo(t,e),this.drawingSurface.lineTo(i,s),this.drawingSurface.stroke())}}function X(t,e,i,s,n){let a,r=13,o={x:t.layerX,y:t.layerY,top:0,left:0,uXml:"",ans:!1,ans_h:e,ans_w:i,ans_left:s,ans_top:n};var l,c;return 13!=t.which?t.layerX&&t.layerY?(o.top=t.layerY-r,o.left=t.layerX-r):(o.top=t.offsetY-r,o.left=t.offsetX-r):(o.top=7,o.left=7),a=function(t,e){let i=0,s=t.ans_top+t.ans_h,n=t.ans_left+t.ans_w;return t.top+e>t.ans_top&&t.top+parseInt(e/2)<s&&t.left+e>t.ans_left&&t.left+parseInt(e/2)<n&&(i=1),i}(o,r),o.uXml=(l=o.top,c=o.left,'<SMANS type="4"><div targetTop="'+parseInt(l)+'" targetLeft="'+parseInt(c)+'" /></SMANS>'),"undefined"!=typeof calculatePoint&&(temp=1==a?1:0,calculatePoint(1,temp)),o.ans=a>0,o}function R(t){n(t,"svelte-11usv4u","main.svelte-11usv4u{text-align:center !important;padding:1em;max-width:240px;margin:0 auto;font-size:26px}.targetImg.svelte-11usv4u{display:none;position:absolute;z-index:10;width:17px;height:15px;border-radius:50%;background:#fff;color:#1c3ad4}.showBlock.svelte-11usv4u{display:block}@media(min-width: 640px){main.svelte-11usv4u{max-width:none}}")}function z(t){let e,i;return e=new M({props:{handleReviewClick:t[24],customReviewMode:t[18],reviewMode:t[0]}}),e.$on("setReview",t[21]),e.$on("unsetReview",t[22]),{c(){a(e.$$.fragment)},m(t,s){r(e,t,s),i=!0},p(t,i){const s={};1&i[0]&&(s.reviewMode=t[0]),e.$set(s)},i(t){i||(o(e.$$.fragment,t),i=!0)},o(t){l(e.$$.fragment,t),i=!1},d(t){c(e,t)}}}function H(t){let e,i,s=t[23](t[19][t[15]])+"";return{c(){e=new N,i=A(),e.a=i},m(t,n){e.m(s,t,n),m(t,i,n)},p(t,i){32768&i[0]&&s!==(s=t[23](t[19][t[15]])+"")&&e.p(s)},d(t){t&&f(i),t&&e.d()}}}function P(t){let e,i,s,n,a,r,o,l=t[17]&&Y();return{c(){e=d("center"),i=d("div"),s=d("div"),s.innerHTML='<span class="icomoon-new-24px-reset-1 s3" style="vertical-align: text-top"></span>  \n\t\t\t\t\t\t\t<span class="position-relative bottom1">Reset</span>',n=h(),a=d("div"),o=h(),l&&l.c(),p(s,"id","reset"),_(s,"height","27px"),_(s,"width","90px"),_(s,"top","2px"),p(s,"class","reset btn btn-outline-primary position-relative btn-sm mt-sm2 mr-sm2 float-end"),_(i,"height","34px"),_(i,"width",window.inNative?window.innerWidth:t[3].imgwidth),_(i,"background","#d9e7fd"),_(i,"border-top","2px solid #96bbf6"),p(a,"id","hptmain0"),p(a,"totalcorrectans",t[1]),p(a,"dd",r=t[3].imgwidth),_(a,"width",t[3].imgwidth||"250px"),_(a,"height",t[3].imgheight||"600px"),_(a,"background-image","url('"+(j+t[14])+"')"),_(a,"background-repeat","no-repeat"),_(a,"position","relative"),_(a,"border","2px solid #d9e7fd"),p(e,"key","imageHeight_3")},m(t,r){m(t,e,r),u(e,i),u(i,s),u(e,n),u(e,a),u(e,o),l&&l.m(e,null)},p(t,s){8&s[0]&&_(i,"width",window.inNative?window.innerWidth:t[3].imgwidth),2&s[0]&&p(a,"totalcorrectans",t[1]),8&s[0]&&r!==(r=t[3].imgwidth)&&p(a,"dd",r),8&s[0]&&_(a,"width",t[3].imgwidth||"250px"),8&s[0]&&_(a,"height",t[3].imgheight||"600px"),16384&s[0]&&_(a,"background-image","url('"+(j+t[14])+"')"),t[17]?l||(l=Y(),l.c(),l.m(e,null)):l&&(l.d(1),l=null)},d(t){t&&f(e),l&&l.d()}}}function B(t){let e,i,s,n,a,r,o,l,c,g,w,x,v,b,y,A,N,M;return{c(){e=d("table"),i=d("tbody"),s=d("tr"),n=d("td"),a=d("div"),r=d("div"),o=d("img"),c=h(),g=d("div"),w=S(" "),v=h(),b=d("span"),p(o,"id","im0"),p(o,"tabindex","0"),_(o,"max-width","none"),_(o,"width",t[3].imgwidth),_(o,"height",t[3].imgheight),p(o,"class","hotSpotImg"),k(o.src,l=j+t[14])||p(o,"src",l),p(o,"alt",t[2]),p(g,"id","hotArea"),p(g,"class","hotArea hotArea hotAreaPreview"),p(g,"style",x=`\n\t\t\t\t\t\t\t\t\t\t\t\tdisplay: ${t[11]};\n\t\t\t\t\t\t\t\t\t\t\t\tleft:${t[10]};\n\t\t\t\t\t\t\t\t\t\t\t\ttop:${t[7]};\n\t\t\t\t\t\t\t\t\t\t\t\theight:${t[8]};\n\t\t\t\t\t\t\t\t\t\t\t\twidth:${t[9]};\n\t\t\t\t\t\t\t\t\t\t\t`),p(b,"id","target"),p(b,"class","target targetImg icomoon-plus-circle-2 svelte-11usv4u"),p(b,"style",y=`\n\t\t\t\t\t\t\t\t\t\t\t\tleft:${t[12]}px;\n\t\t\t\t\t\t\t\t\t\t\t\ttop:${t[13]}px;\n\t\t\t\t\t\t\t\t\t\t\t`),C(b,"showBlock",t[6]),p(r,"id","SM0"),p(r,"class","SM position-relative m-0 p-0"),p(r,"style",A=`\n\t\t\t\t\t\t\t\t\t\t\tposition: relative;\n\t\t\t\t\t\t\t\t\t\t\tmargin: 0px;\n\t\t\t\t\t\t\t\t\t\t\tpadding: 0px;\n\t\t\t\t\t\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\t\t\t\t\t\theight: 100%;\n\t\t\t\t\t\t\t\t\t\t\tborder: ${t[4]?t[4]+"px solid":""};\n\t\t\t\t\t\t\t\t\t\t\tborder-color: ${t[5]};\n\t\t\t\t\t\t\t\t\t\t`),p(a,"id","SM0"),p(a,"class","relative"),p(n,"class","border"),p(e,"id","hptmain0"),p(e,"class","smbase smhotspot border-0 h-auto w-auto uc-table")},m(l,d){m(l,e,d),u(e,i),u(i,s),u(s,n),u(n,a),u(a,r),u(r,o),u(r,c),u(r,g),u(g,w),u(r,v),u(r,b),N||(M=I(o,"click",t[20]),N=!0)},p(t,e){8&e[0]&&_(o,"width",t[3].imgwidth),8&e[0]&&_(o,"height",t[3].imgheight),16384&e[0]&&!k(o.src,l=j+t[14])&&p(o,"src",l),4&e[0]&&p(o,"alt",t[2]),3968&e[0]&&x!==(x=`\n\t\t\t\t\t\t\t\t\t\t\t\tdisplay: ${t[11]};\n\t\t\t\t\t\t\t\t\t\t\t\tleft:${t[10]};\n\t\t\t\t\t\t\t\t\t\t\t\ttop:${t[7]};\n\t\t\t\t\t\t\t\t\t\t\t\theight:${t[8]};\n\t\t\t\t\t\t\t\t\t\t\t\twidth:${t[9]};\n\t\t\t\t\t\t\t\t\t\t\t`)&&p(g,"style",x),12288&e[0]&&y!==(y=`\n\t\t\t\t\t\t\t\t\t\t\t\tleft:${t[12]}px;\n\t\t\t\t\t\t\t\t\t\t\t\ttop:${t[13]}px;\n\t\t\t\t\t\t\t\t\t\t\t`)&&p(b,"style",y),64&e[0]&&C(b,"showBlock",t[6]),48&e[0]&&A!==(A=`\n\t\t\t\t\t\t\t\t\t\t\tposition: relative;\n\t\t\t\t\t\t\t\t\t\t\tmargin: 0px;\n\t\t\t\t\t\t\t\t\t\t\tpadding: 0px;\n\t\t\t\t\t\t\t\t\t\t\twidth: 100%;\n\t\t\t\t\t\t\t\t\t\t\theight: 100%;\n\t\t\t\t\t\t\t\t\t\t\tborder: ${t[4]?t[4]+"px solid":""};\n\t\t\t\t\t\t\t\t\t\t\tborder-color: ${t[5]};\n\t\t\t\t\t\t\t\t\t\t`)&&p(r,"style",A)},d(t){t&&f(e),N=!1,M()}}}function Y(t){let e;return{c(){e=d("div"),p(e,"class","position-fixed index0"),_(e,"right","0"),_(e,"top","0"),_(e,"left","0"),_(e,"bottom","0"),_(e,"background","rgba(0,0,0,0.4)")},m(t,i){m(t,e,i)},d(t){t&&f(e)}}}function U(t){let e,i,s,n,a,r,c,x=("1"==t[19][t[15]]||"2"==t[19][t[15]])&&z(t);function v(t,e){return"4"==t[19][t[15]]?B:"3"==t[19][t[15]]?P:H}let b=v(t),y=b(t);return{c(){e=d("main"),i=d("center"),x&&x.c(),s=h(),n=d("div"),y.c(),a=h(),r=d("input"),p(n,"id","previewArea"),p(n,"class","relative"),p(r,"type","hidden"),p(r,"id","special_module_parse"),p(r,"name","special_module_parse"),p(r,"userans",""),r.value=t[16],p(e,"class","svelte-11usv4u")},m(t,o){m(t,e,o),u(e,i),x&&x.m(i,null),u(i,s),u(i,n),y.m(n,null),u(e,a),u(e,r),c=!0},p(t,e){"1"==t[19][t[15]]||"2"==t[19][t[15]]?x?(x.p(t,e),32768&e[0]&&o(x,1)):(x=z(t),x.c(),o(x,1),x.m(i,s)):x&&(g(),l(x,1,1,(()=>{x=null})),w()),b===(b=v(t))&&y?y.p(t,e):(y.d(1),y=b(t),y&&(y.c(),y.m(n,null))),(!c||65536&e[0])&&(r.value=t[16])},i(t){c||(o(x),c=!0)},o(t){l(x),c=!1},d(t){t&&f(e),x&&x.d(),y.d()}}}$('#hptmain .drag-resize{position:absolute;left:90px;top:50px;border:none;z-index:8;text-align:center;font-size:0;line-height:20px;background-color:rgba(244,255,71,.6)!important;box-shadow:0 0 1px #000 inset;cursor:move}.tools{position:absolute;right:5px;z-index:101}.tools .labs-btn{padding:2px 5px}.drag-resize .tools{top:-28px;right:-3px}.elemActive{background:rgba(244,255,71,.6)!important;opacity:1!important}#option-toolbar{margin-bottom:0}.controls{list-style:none;margin:0;padding:0}.controls li{display:inline;padding:11px;float:left;font-size:13px}.controls li:hover,.selected-option{cursor:pointer;background-color:#ccc!important}#hotspot{width:700px;padding:4px;border-top-right-radius:10px;border-top-left-radius:10px;text-align:left;background-color:#ccc}.hotspotTxt{background:#fff;word-wrap:break-word;padding:1em;min-height:180px;text-align:left;overflow-y:scroll;border:1px solid #ccc;font-family:"open sans",Helvetica,Arial,"Times New Roman",sans-serif;font-size:14px}.hotspotTxt p{float:left;margin-bottom:3px}.textClick{border:1px solid transparent;padding:2px 0;margin-right:2px;cursor:pointer;border-radius:2px;position:relative;-webkit-user-select:none;-moz-user-select:none;user-select:none}.selecttext.selected,.textClick.selected,.textClick.selected:hover{background-color:#ff9;border:1px solid #8a7300;border-radius:2px}.textClick:hover{background-color:#fcfcd3;border-color:#8a7300}.show_correct{background-color:#e7f4e1!important;border-color:#62ae41!important}.show_incorrect{border-color:#da1919!important;background-color:#fbdddd!important}.selecttext{border:1px solid transparent;padding:3px 0;margin-right:2px;position:relative;margin-left:-1px;margin-right:-1px;border-radius:2px}.drawSurface{cursor:crosshair}.h{display:none}.textClick.selected:focus{box-shadow:inset 0 0 0 1px transparent,inset 0 0 0 1px #fff,inset 0 0 0 2px #000;outline:0}.red{color:red}#hptmain0 tr td{border:0!important}');let j="//s3.amazonaws.com/jigyaasa_content_static/";function W(t,e,i){let{xml:s}=e,{uxml:n}=e,{ansStatus:a}=e,{isReview:r}=e,{showAns:o}=e,{editorState:l}=e,c=r;const d=new L;let h,p,m="",u=0,g="",w={textclick:"1",textselect:"2",imagehighlight:"3",hotspot:"4"},f={},A=0,_="gray",S=!1,k="",C="",I="",N="",M="none",$=0,T=0,D=0,O=0,R="",z="",H="",P=0,B=0,Y="",U="",W="black",J="",q=0,F=[],V=[],G=0,K=0;var Q="textclick",Z="",tt="";function et(){switch(i(15,H=m.smxml.div._type),P=m.smxml._height,B=m.smxml._width,null!=H&&""!=H||i(15,H=m.smxml._name.toLowerCase()),Q=H,i(14,z=m.smxml._bgimg),w[H]){case"1":G=m.smxml._height+"px",K=m.smxml._width+"px",function(t){var e="",s=t.match(/%{(.*?)}%/gm);if(s){i(1,p=s.length);for(var n=0;n<s.length;n++)Z=s[n].replace(/\s+/gm,"<uc:space>"),t=t.replace(s[n],Z)}Z="",t=t.split(" ");for(n=0;n<t.length;n++)t[n].match(/%{|%}/gm)?(t[n]=t[n].replace(/<uc:space>/gm," ").replace(/%{|}%/gm,""),e+='<p class="textClick" data-index="'+n+'" data-userans="0" data-correctans="1">'+t[n]+"</p>",Z+=t[n]+"|"):e+='<p class="textClick" data-index="'+n+'" data-userans="0" data-correctans="0">'+t[n]+"</p>";Z=Z.replace(/\|$/gm,""),b.select(" #previewArea  #textID0").innerHTML=e}(m.smxml.div.__cdata),b.select(b.parent("#textID0"),"show","block"),b.selectAll('#drawPreview,table[id="hptmain2"]',"hide");break;case"2":isNaN(m.smxml._height)||(m.smxml._height=m.smxml._height+"px"),G=m.smxml._height,K=m.smxml._width+"px",function(t){Z="";var e=t.match(/%{(.*?)}%/gm);if(e){for(var s=0;s<e.length;s+=1)Z+=e[s].replace(/%{|}%/gm,"")+"|";tt=t.replace(/%{/gm,'<span class="selecttext selected">').replace(/}%/gm,"<span>"),i(1,p=e.length),Z=Z.replace(/\|$/gm,"")}var n=t.replace(/%{|}%/gm,""),a=setTimeout(function(){b.select(" #previewArea  #textID0").innerHTML=n,clearTimeout(a)}.bind(self),100)}(m.smxml.div.__cdata),b.select(b.parent("#textID0"),"show","block"),b.selectAll('#drawPreview,table[id="hptmain2"]',"hide");break;case"3":{let t=new Image;t.addEventListener("load",(function(t){i(3,f.imgheight=m.smxml._height>this.height?m.smxml._height+"px":this.height+"px",f),i(3,f.imgwidth=m.smxml._width>this.width?m.smxml._width+"px":this.width+"px",f),b.find("#hptdraw0","canvas",{action:"attr",actionData:{height:f.imgheight,width:f.imgwidth}}),b.empty("#textID0"),at()}),!1),t.setAttribute("src",j+m.smxml._bgimg)}break;case"4":{i(14,z=m.smxml._bgimg),i(2,g=m.smxml._alt),i(13,T=parseFloat(m.smxml.div._top)),i(12,$=parseFloat(m.smxml.div._left)+13),D=parseFloat(m.smxml.div._height),O=parseFloat(m.smxml.div._width),i(2,g=m.smxml.div._alt),R=m.smxml.div.type,i(4,A=m.smxml.div._border),i(5,_=m.smxml.div._bordercolor),i(9,I=m.smxml.div._width+"px"),i(8,C=m.smxml.div._height+"px"),i(10,N=parseInt(m.smxml.div._left)+4+"px"),i(7,k=parseInt(m.smxml.div._top)+2+"px");let t=new Image;t.onload=function(){let t=this.height+"px",e=this.width+"px";i(3,f.imgheight=m.smxml.div._imgheight?m.smxml.div._imgheight+"px":"auto !important",f),i(3,f.imgwidth=m.smxml.div._imgwidth?m.smxml.div._imgwidth+"px":"auto !important",f),b.select("#hptmain0","css",{height:t,width:e})},t.src=j+m.smxml._bgimg}}}function it(){r&&i(11,M="block");var t=new Image;if(t.onload=function(){"3"==w[H]?(i(3,f.imgheight=m.smxml._height>this.height?m.smxml._height+"px":this.height+"px",f),i(3,f.imgwidth=m.smxml._width>this.width?m.smxml._width+"px":this.width+"px",f)):(i(3,f.imgheight=m.smxml.div._imgheight?m.smxml.div._imgheight+"px":"auto !important",f),i(3,f.imgwidth=m.smxml.div._imgwidth?m.smxml.div._imgwidth+"px":"auto !important",f))},z&&(t.src=j+z),n){i(16,Y=n);let t=v(n);t.SMANS&&t.SMANS.div&&(i(6,S=!0),i(12,$=t.SMANS.div._targetLeft),i(13,T=t.SMANS.div._targetTop))}}function st(t){let e={};"textclick"==Q||"textselect"==Q?e=d.check_Ans("#previewArea #hptmain0"):(e=X(t,D,O,parseInt(N),parseInt(k)),i(6,S=!0),i(12,$=e.left),i(13,T=e.top),i(25,a=e.ans),i(30,h=a),l&&o(a?"Correct":"Incorrect")),y(e)}function nt(){if(i(0,r=!0),i(11,M="block"),"3"==w[H]){let t=b.find("#previewArea","canvas"),e=t.getAttribute("correctans");""!=e&&(e=JSON.parse(e)),d.drawOnCanvas(t,e,"green")}d.modeOnHot(1),b.select("#hptmain0","css",{pointerEvents:"none"})}function at(){if(i(11,M="none"),"3"==w[H]){b.find("#previewArea","canvas",{action:"remove"});var t=setTimeout((function(){!function(t,e){let n=b.find(t,"#hptmain0");t=n;let a=new E({target:n,width:+f.imgwidth.replace("px",""),height:+f.imgheight.replace("px",""),correctans:U,cssClass:"drawSurface",penSize:4,type:"imagehighlight",editable:!e,onMove(){},onClick(){},onPaint(t){F.push(t.X),V.push(t.Y)},onRelease(s){!function(t,e,s){let n="",a=!1;if(!s){J="";var r=document.querySelector("#special_module_parse").value;""!=(r=r.substring(r.indexOf("{"),r.lastIndexOf("}")+1))?(r=Object.keys(JSON.parse(r)).length,J=d.getCoordinate(e,F,V,r)):J=d.getCoordinate(e,F,V,q),window.inNative&&window.getHeight&&window.getHeight(),window.ISSPECIALMODULEUSERXMLCHANGE=1,b.select("#special_module_user_xml").value=J,i(16,Y=J),F=[],V=[];let t=b.find(e,"canvas").getAttribute("correctans"),s=b.find(e,"canvas").getAttribute("userans");""!=s&&(s=JSON.parse(s)),""!=t&&(t=JSON.parse(t));let c=d.compareDrawing(s,t,e),p="Incorrect";c>0?(a=!0,p="Correct",i(3,f.answerType3=!0,f),l&&o("Correct")):(a=!1,p="Incorrect",i(3,f.answerType3=!1,f)),l&&o(p),n=b.select("#special_module_user_xml").value,c=c>0,i(30,h=c),y({ans:c,uXml:n}),b.select("#answer").checked=c>0,window.inNative&&window.postMessage(JSON.stringify({inNativeIsCorrect:a,userAnswers:n}),"*")}}(0,t,e)}});W=String(s.match(/linecolor=\"([^\"]+)\"/gm)),W=W.substring("11",W.length-1),e||b.listen("#previewArea","click","#reset",(()=>{a.clearSurface(),J="",q=0,i(16,Y=""),b.selectAll(b.select(t).children,"attr",{userans:""}),i(30,h=!1)}));window.surface=a}("#previewArea",0);let e=b.find("#previewArea","canvas"),n=b.select("#special_module_parse").value,a=n.substring(n.indexOf("{"),n.lastIndexOf("}")+1);""!=a&&(a=JSON.parse(a)),d.drawOnCanvas(e,a,W),clearTimeout(t)}),500)}d.modeOnHot(),b.select("#hptmain0","css",{pointerEvents:"auto"})}return x((async()=>{m=v(s),et(),it(),d.readyThis("hptmain0",r),r?d.modeOnHot(1):d.modeOnHot(),b.listen("#previewArea","keydown","#im0",(function(t,e){switch(console.log("click...."),13===e.which&&st(e),e.which){case 37:window.scroll({left:"-=2",behavior:"smooth"});break;case 38:window.scroll({top:"-=2",behavior:"smooth"});break;case 39:window.scroll({left:"+=2",behavior:"smooth"});break;case 40:window.scroll({top:"+=2",behavior:"smooth"});break;case 13:st()}})),b.listen("#previewArea","click",".textClick",(function(){st()})),b.listen("#previewArea","click",'[type="textselect"]',(function(){st()}))})),t.$$set=t=>{"xml"in t&&i(26,s=t.xml),"uxml"in t&&i(27,n=t.uxml),"ansStatus"in t&&i(25,a=t.ansStatus),"isReview"in t&&i(0,r=t.isReview),"showAns"in t&&i(28,o=t.showAns),"editorState"in t&&i(29,l=t.editorState)},t.$$.update=()=>{if(1879048193&t.$$.dirty[0]|1&t.$$.dirty[1]&&(r?(nt(),l&&0==u&&(o(h?"Correct":"Incorrect"),i(31,u=1))):(i(31,u=0),at())),67108866&t.$$.dirty[0]|2&t.$$.dirty[1]&&s){let t=s.replace("\x3c!--[CDATA[","<![CDATA[").replace("]]--\x3e","]]>");t.match(/<\!\[CDATA\[{|<\!--\[CDATA\[{/gm)&&(i(32,U=t.toString().match(/{(.*)}/gim)),i(1,p=U.toString().match(/},"\d+"/gm)),i(1,p=p?p.pop():null),i(1,p=p?p.replace(/"|}|,/gm,""):1),t=t.replace(U,""),i(32,U=U[0])),m=v(s),et(),it()}},[r,p,g,f,A,_,S,k,C,I,N,M,$,T,z,H,Y,!1,c,w,st,nt,at,function(t){switch(t){case"1":case"2":{let t="",e="";if(n){let i=v(n);window.test=n,i?.smans?.div&&(t=i.smans.div["_data-userAns"],e=i.smans.div["_data-userHtml"])}return`\n\t\t\t\t\t\t<div is id="hptmain0" totalCorrectAns=${p}>\n\t\t\t\t\t\t\t<div \n\t\t\t\t\t\t\t\tid="textID0" \n\t\t\t\t\t\t\t\ttype="${Q}" \n\t\t\t\t\t\t\t\tdata-correcthtml="${tt}" \n\t\t\t\t\t\t\t\tdata-correctans="${Z}"\n\t\t\t\t\t\t\t\tdata-userans="${t}" \n\t\t\t\t\t\t\t\tdata-userhtml="${e}" \n\t\t\t\t\t\t\t\tclass="drag-resize hotspotTxt" \n\t\t\t\t\t\t\t\tstyle="max-width:${K}; height:${G}; line-height: 1.4; font-size:17px!important;"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t`}default:return"<div>Incorrect question type</div>"}},function(t,e){"c"==t?d.showansdrag("#hptmain0","c",1):d.showansdrag("#hptmain0","u",1)},a,s,n,o,l,h,u,U]}export default class extends e{constructor(t){super(),i(this,t,W,U,s,{xml:26,uxml:27,ansStatus:25,isReview:0,showAns:28,editorState:29},R,[-1,-1])}}
//# sourceMappingURL=HotspotPreview-347fdec6.js.map
