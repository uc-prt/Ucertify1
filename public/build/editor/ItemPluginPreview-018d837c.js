import{S as SvelteComponent,i as init,s as safe_not_equal,F as globals,e as element,j as append,c as create_component,b as space,C as language,f as attr,A as AH,h as insert,m as mount_component,l as listen,o as detach,t as transition_in,a as transition_out,d as destroy_component,k as group_outros,n as check_outros,D as destroy_each,E as beforeUpdate,X as XMLToJSON,p as onMount,_ as jquery,w as writable,R as onUserAnsChange}from"./main-c5aa8524.js";import{I as ItemHelper}from"./ItemHelper-37ead10e.js";import{F as FillInTheBlanksToolbar}from"./mathquill-1dc386ec.js";import"./style-inject.es-1f59c1d0.js";var ALGO=ALGO||{mathtype:""};ALGO.init=function(e,t){let n="";try{n=ALGO.util.generateVariables(e,t)}catch(e){swal({html:!0,title:"",text:"<b>"+e+"<br/><br/>Variables are not correctly defined!</b>",type:"error"})}return console.log("var llist",n),n},ALGO.util={generateVariables:function(algostr,genereted_str){const regex_mathtype=/is_advance[\s]*=([\s"'\d]*)/;let fnName="",var_list={};var xml=algostr.split("\n");try{ALGO.mathtype=+xml[0].match(regex_mathtype)[1].match(/[\d]+/)}catch(e){ALGO.mathtype=""}for(let i=0;i<xml.length;i++){let xml_id=xml[i],xml_arr=xml_id.split("=");switch(fnName=xml_arr[1].substr(0,xml_arr[1].indexOf("(")).trim(),fnName){case"rand_int":fnName="randInt";break;case"rand_float":fnName="randFloat";break;case"uc_sqrt":fnName="ucSqrt";break;case"rand_obj":fnName="randObj"}if("object"!=typeof ALGO.math[fnName]&&(fnName=""),""!=fnName){const e=/\(([^)]+)\)/;let t=[],n=e.exec(xml_arr[1]),a,i,s;switch(fnName.trim()){case"randInt":t=n[1].split(","),a=parseInt(t[0]),i=parseInt(t[1]),s=parseInt(t[2]),var_list[xml_arr[0].trim()]=ALGO.math[fnName].f(a,i,s);break;case"randFloat":t=n[1].split(","),a=parseFloat(t[0]),i=parseFloat(t[1]),s=parseInt(t[2]),var_list[xml_arr[0].trim()]=ALGO.math[fnName].f(a,i,s);break;case"ucSqrt":t=n[1].split(","),a=parseInt(t[0]),i=parseInt(t[1]),var_list[xml_arr[0].trim()]=ALGO.math[fnName].f(a,i);break;case"ucPow":t=n[1].split(","),a=parseInt(t[0]),i=parseInt(t[1]),s=parseInt(t[2]),var_list[xml_arr[0].trim()]=ALGO.math[fnName].f(a,i,s);break;default:let e=JSON.stringify(n[1]);e=e.trim().replace(/"|\\/g,""),var_list[xml_arr[0].trim()]=ALGO.math[fnName].f(e)}}if(""==fnName){const regExp_arth=/(\*|\+|\-|\/|\^|\%|\(|\)|\,|\[|\]|\#)/g,regExp_semicolon=/;|\\/g;let test=xml_arr[1].split(regExp_arth),expression="";var iscartesian=!1;for(let e=0;e<test.length;e++)if(test[e]=test[e].trim(),";"!=test[e]&&""!=test[e]){test[e]=test[e].replace(regExp_semicolon,""),"#"==test[e]?test[e]="'":test[e]=var_list.hasOwnProperty(test[e])?var_list[test[e]]:isNaN(+test[e])?test[e]:+test[e];let t=test[e];t="string"==typeof t?t.trim():t,"math.setCartesian"==t&&(iscartesian=!0),expression+=test[e]}if(2==ALGO.mathtype){if(1==iscartesian){for(var testing=eval(expression),str="",k=0;k<testing.length;k++)testing[k]="("+testing[k]+") ",str+=testing[k];var_list[xml_arr[0].trim()]=str}iscartesian||(var_list[xml_arr[0].trim()]=eval(expression).toString()),""==var_list[xml_arr[0].trim()]&&(var_list[xml_arr[0].trim()]="None of these")}""==ALGO.mathtype&&(var_list[xml_arr[0].trim()]=eval(expression.trim()))}}return var_list}},ALGO.init.replaceVariables=function(e,t){for(let a in t){var n=new RegExp("<{"+a+"}>","g");e=e.replace(n,t[a])}return e},ALGO.math={randObj:{text:"Randomize Object",description:"Find the random string or character",param:"(javascript,java,C,react,php)",use:"randObj(javascript,php,java,c)",f:function(e){let t=e.split(",");return t[ALGO.math.randInt.f(0,t.length-1)]}},randInt:{text:"Randomize Integer",description:"Find the random integer value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randInt(1,4,2)",f:function(e,t,n){return(Math.floor(Math.random()*(t-e+1))+e).toFixed(n)}},randFloat:{text:"Randomize Float",description:"Find the random float/decimal value (min-value, max-value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"randFloat(1,4,2)",f:function(e,t,n){return(Math.random()*(t-e)+e).toFixed(n)}},ucSqrt:{text:"Square root",description:"Find the square root (value, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucSqrt(9,2)",f:function(e,t){return Math.sqrt(e).toFixed(t)}},ucPow:{text:"Power",description:"Return the value of the number 4 to the power of 3(value, power, no. of values after decimal)",param:"minimunvalue,maximumvalue",agrlength:2,use:"ucPow(4,3,2)",f:function(e,t,n){return Math.pow(e,t).toFixed(n)}}};var Step=ALGO;const{document:document_1}=globals;function add_css(){var e=element("style");e.id="svelte-142veau-style",e.textContent='.darkgrey_border{border:1px solid #ccc!important}.p-lg{padding:15px}.true-hover{outline:0;border:2px solid #14ca14!important}.false-hover{outline:0;border:2px solid #e45252!important}.default-hover{border-color:transparent!important;-webkit-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;-moz-box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important;box-shadow:inset 0 1px 0px 0px rgba(0,0,0,.075), 0 0 1px rgba(2, 2, 2, 0.9)!important}.blocked{display:block !important}.border_green{border:3px solid green!important}.border_red{border:3px solid red!important}.sticky{z-index:800;position:sticky;top:0\r\n\t}.corr_div{position:absolute!important;width:60px;line-height:30px;background-color:#21a81d;color:#ffffff;z-index:1;display:inline-block;vertical-align:middle;cursor:default}[id^="fillmain"]{overflow:hidden;text-align:left}[id^="fillmain"] pre{background:none;border:none;font-size:14px!important}[id^="fillmain"] .string{min-height:50px;margin-top:10px;margin-right:10px}[id^="fillmain"] .footerstr{position:relative;margin-top:10px;background-color:#ccc;padding:15px;min-height:60px}[id^="fillmain"] .footerstr .arrow-up{position:absolute;top:-10px;right:50%;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:10px solid #ccc}[id^="fillmain"] .fill-row{padding:6px}[id^="fillmain"] .fillelement, [id^="fillmain"] .drag-resize{height:30px;display:inline-block;position:relative;min-height:30px;margin:1px}[id^="fillmain"] input[type="text"], [id^="fillmain"] select{height:99%!important;resize:none;font-size:12px;color:#000;max-width:800px}[id^="fillmain"] .drag-resize{vertical-align:middle;border:1px solid #31B731;text-align:center;padding:3px;font-size:14px}[id^="fillmain"] .drag-resize.ui-draggable{cursor:move}[id^="fillmain"] .drop-hover{border:1px dashed red!important;box-shadow:0 0 0 2px yellow inset;outline:1px solid blue}[id^="fillmain"] .fillcheck ul{width:220px}[id^="fillmain"] .fillcheck li.selected{background-color:#E5E5E5}.fillcheck .selected .icomoon-checkmark-3:before{float:left;color:blue;padding:3px;position:relative;right:14px}.fillcheck .icomoon-close-2:before{float:left;color:blue;position:relative;right:14px;font-size:20px}.MathJax_Display{display:inline!important}[id^="fillmain"] .select{font-size:15px}[id^="fillmain"] .textarea{vertical-align:middle;border-radius:3px;background:#ffe;border:1px solid #ccc;-webkit-box-shadow:inset 0 1px 1px rgba(0,0,0,0.075);box-shadow:inset 0 1px 1px rgba(0,0,0,0.075)}.ui-draggable-disabled{cursor:no-drop!important;opacity:0.5!important}',append(document_1.head,e)}function get_each_context(e,t,n){const a=e.slice();return a[67]=t[n],a[69]=n,a}function get_each_context_1(e,t,n){const a=e.slice();return a[67]=t[n],a[69]=n,a}function create_if_block(e){let t,n,a,i,s,l,r,o,c,d,m,p,u,f,h,_,g,v,x;n=new ItemHelper({props:{handleReviewClick:e[11],reviewMode:e[0]}}),n.$on("setReview",e[9]),n.$on("unsetReview",e[10]);let b=e[5].itemArray,w=[];for(let t=0;t<b.length;t+=1)w[t]=create_each_block_1(get_each_context_1(e,b,t));let A=e[2],y=[];for(let t=0;t<A.length;t+=1)y[t]=create_each_block(get_each_context(e,A,t));let k=e[5].showToolbar&&create_if_block_1(e);return{c(){t=element("center"),create_component(n.$$.fragment),a=space(),i=element("div");for(let e=0;e<w.length;e+=1)w[e].c();r=space(),o=element("div");for(let e=0;e<y.length;e+=1)y[e].c();m=space(),k&&k.c(),p=space(),u=element("div"),f=element("button"),f.textContent=""+language.next,attr(i,"class",s=e[5].main_steps?"h-imp":"inNativeStyle"),attr(i,"style",l="width:"+(AH.isValid(window.inNative)?"100%":"700px")),attr(o,"class",c=e[5].correct_answer?"h-imp":""),attr(o,"style",d="width:"+(AH.isValid(window.inNative)?"100%":"700px")),attr(f,"type","button"),attr(f,"style",h="width:auto;font-size:15px;margin:15px 0;"),attr(f,"class","btn btn-sm btn-outline-primary imgcenter next_step px-md-5 px-sm-3"),attr(u,"class",_=e[5].hideNext?"h-imp":null)},m(s,l){insert(s,t,l),mount_component(n,t,null),append(t,a),append(t,i);for(let e=0;e<w.length;e+=1)w[e].m(i,null);append(t,r),append(t,o);for(let e=0;e<y.length;e+=1)y[e].m(o,null);append(t,m),k&&k.m(t,null),append(t,p),append(t,u),append(u,f),g=!0,v||(x=listen(f,"click",e[16]),v=!0)},p(e,a){const l={};if(1&a[0]&&(l.reviewMode=e[0]),n.$set(l),104&a[0]){let t;for(b=e[5].itemArray,t=0;t<b.length;t+=1){const n=get_each_context_1(e,b,t);w[t]?w[t].p(n,a):(w[t]=create_each_block_1(n),w[t].c(),w[t].m(i,null))}for(;t<w.length;t+=1)w[t].d(1);w.length=b.length}if((!g||32&a[0]&&s!==(s=e[5].main_steps?"h-imp":"inNativeStyle"))&&attr(i,"class",s),108&a[0]){let t;for(A=e[2],t=0;t<A.length;t+=1){const n=get_each_context(e,A,t);y[t]?y[t].p(n,a):(y[t]=create_each_block(n),y[t].c(),y[t].m(o,null))}for(;t<y.length;t+=1)y[t].d(1);y.length=A.length}(!g||32&a[0]&&c!==(c=e[5].correct_answer?"h-imp":""))&&attr(o,"class",c),e[5].showToolbar?k?(k.p(e,a),32&a[0]&&transition_in(k,1)):(k=create_if_block_1(e),k.c(),transition_in(k,1),k.m(t,p)):k&&(group_outros(),transition_out(k,1,1,(()=>{k=null})),check_outros()),(!g||32&a[0]&&_!==(_=e[5].hideNext?"h-imp":null))&&attr(u,"class",_)},i(e){g||(transition_in(n.$$.fragment,e),transition_in(k),g=!0)},o(e){transition_out(n.$$.fragment,e),transition_out(k),g=!1},d(e){e&&detach(t),destroy_component(n),destroy_each(w,e),destroy_each(y,e),k&&k.d(),v=!1,x()}}}function create_each_block_1(e){let t,n,a,i,s,l,r,o,c,d,m,p,u,f=e[67].cdata+"";return{c(){t=element("div"),n=element("div"),a=element("div"),i=element("div"),m=space(),attr(i,"seq",s="s"+e[69]),attr(a,"id",l="data-block_"+e[69]),attr(a,"class",r="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":"")),attr(a,"key",o=e[69]),attr(n,"id",c="s"+e[69]),attr(n,"class",d="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":"")),attr(t,"data-sticky",p=e[6](e[69])),attr(t,"class","bt-pd bg-white mt-3"),attr(t,"tabindex",u=0)},m(e,s){insert(e,t,s),append(t,n),append(n,a),append(a,i),i.innerHTML=f,append(t,m)},p(e,t){32&t[0]&&f!==(f=e[67].cdata+"")&&(i.innerHTML=f),32&t[0]&&r!==(r="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":""))&&attr(a,"class",r),40&t[0]&&d!==(d="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":""))&&attr(n,"class",d)},d(e){e&&detach(t)}}}function create_each_block(e){let t,n,a,i,s,l,r,o,c,d,m,p,u,f=e[67].__cdata+"";return{c(){t=element("div"),n=element("div"),a=element("div"),i=element("div"),m=space(),attr(i,"seq",s="s"+e[69]),attr(a,"id",l="data-block_"+e[69]),attr(a,"class",r="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":"")),attr(a,"key",o=e[69]),attr(n,"id",c="s"+e[69]),attr(n,"class",d="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":"")),attr(t,"data-sticky",p=e[6](e[69])),attr(t,"class","bt-pd bg-white mt-3"),attr(t,"tabindex",u=0)},m(e,s){insert(e,t,s),append(t,n),append(n,a),append(a,i),i.innerHTML=f,append(t,m)},p(e,t){4&t[0]&&f!==(f=e[67].__cdata+"")&&(i.innerHTML=f),32&t[0]&&r!==(r="main_item darkgrey_border secure-icon p-lg jqsfield spanlink_nav "+(e[69]==e[5].classChange?e[5].isColor?"border_green":"border_red":""))&&attr(a,"class",r),40&t[0]&&d!==(d="bg-white "+(1==e[5].display&&null!=e[3].smans&&null!=e[3].smans["s"+e[69]]?1==e[3].smans["s"+e[69]].overall?"border_green":"border_red":""))&&attr(n,"class",d)},d(e){e&&detach(t)}}}function create_if_block_1(e){let t,n;return t=new FillInTheBlanksToolbar({props:{spanId:e[5].spanId,divId:e[5].divId,action:e[1][e[4]],show:e[15]}}),{c(){create_component(t.$$.fragment)},m(e,a){mount_component(t,e,a),n=!0},p(e,n){const a={};32&n[0]&&(a.spanId=e[5].spanId),32&n[0]&&(a.divId=e[5].divId),18&n[0]&&(a.action=e[1][e[4]]),t.$set(a)},i(e){n||(transition_in(t.$$.fragment,e),n=!0)},o(e){transition_out(t.$$.fragment,e),n=!1},d(e){destroy_component(t,e)}}}function create_fragment(e){let t,n,a=0==e[5].blank&&create_if_block(e);return{c(){t=element("main"),a&&a.c()},m(e,i){insert(e,t,i),a&&a.m(t,null),n=!0},p(e,n){0==e[5].blank?a?(a.p(e,n),32&n[0]&&transition_in(a,1)):(a=create_if_block(e),a.c(),transition_in(a,1),a.m(t,null)):a&&(group_outros(),transition_out(a,1,1,(()=>{a=null})),check_outros())},i(e){n||(transition_in(a),n=!0)},o(e){transition_out(a),n=!1},d(e){e&&detach(t),a&&a.d()}}}function createAns(e,t,n,a){return void 0!==e[n]&&void 0!==e[n][t]||(void 0===e[n]&&(e[n]={}),e[n][t]={}),e[n][t].value=a,e}function instance(e,t,n){let a,i,s={},l={},r="",o="",c=[];var d=[];let m,p={},u="",f={},h="",_="",g=0,v=0,x=0,b=!1,w={},{xml:A}=t,{stopPreviewUpdate:y}=t,{isReview:k}=t,{uxml:H}=t;writable({blank:!0,hideNext:!1,itemArray:[],classChange:-1,isColor:!0,smController:"h",display:-1,showToolbar:!0,isMathquill:!1,correct_answer:!0,main_steps:!1,your_answer:[]}).subscribe((e=>{n(5,w=e)}));function S(e){if(e.nodeName)if(e.classList.contains("mathquill"))X(e,!1);else{let t=e.getAttribute("id"),n=e.closest("div").getAttribute("seq"),a=e.value;l=createAns(l,t,n,a),L(l)}}function N(){if(l)for(let e in l)for(let t in l[e]){let n=l[e][t].value;if(""!=n){let e=n.match(/MathQuillMathField\{(.*?)\}/g);e?e.map((function(e){""==e.toString().replace(/MathQuillMathField\{|\}/g,"")?AH.select("#"+t,"removeClass","answer_input"):AH.select("#"+t,"addClass","answer_input")})):AH.select("#"+t,"addClass","answer_input")}else AH.select("#"+t,"removeClass","answer_input")}}function M(e){b&&n(3,f.var_list=u,f),n(3,f.cuurentStep=g,f),x=0;const t=w.itemArray;var i,s;if(i=a,(s=e)<=_?(o=i.smxml.step[s].__cdata,q(s,o)):null!=i.smxml.step[g]&&(o=i.smxml.step[g].__cdata,q(s,o)),t.push({cdata:o}),n(5,w.itemArray=t,w),e<=_)var l=e;else l=g;var r=setTimeout((function(){null==a.smxml.step[l+1]&&"1"==a.smxml.step[l]._attempt||null==a.smxml.step[l+1]&&a.smxml.step[l]._viewonly,clearTimeout(r)}),500)}function q(e,t,a){let i=t.match(/%{[\s\S]*?}%/gm),s="";if(!i)return"";i.forEach((function(t,l){if(null!=a)var r=d[a].__cdata;let o=i[l];s=i[l].match(/\|(.*?)}%$/gm),s=s?s[0].replace(/\||}%/gm,""):"",s=s.trim(),""==s||"c"==s||"n"==s?null!=a?j(o,l,e,a,r):j(o,l,e):"e"==s&&(n(5,w.isMathquill=!0,w),null!=a?z(o,l,e,a,r):z(o,l,e))}))}function C(e){n(5,w.showToolbar=e,w)}function I(){if("undefined"!=typeof QUIZPLAYERID)var e=setTimeout((function(){window.parentElement.autoResize(QUIZPLAYERID),clearTimeout(e)}),0);null!=a.smxml.step[g+1]||"1"==a.smxml.step[g]._attempt?(1==a.smxml._gonext?function(){let e="s"+g;AH.find("#"+e,".edit_step","all").forEach((function(t,n){if(t.classList.contains("mathquill"))X(t,!1);else{let n=t.getAttribute("id"),a=t.value;l=createAns(l,n,e,a)}})),1==a.smxml.step[g]._attempt?F():(O(),$())}():1==a.smxml.step[g]._attempt?AH.selectAll(".edit_step").length==AH.selectAll(".answer_input").length?F():AH.selectAll(".edit_step").forEach((e=>{if(!e.classList.contains("answer_input")){e.style.border="2px solid #ff0000";var t=setTimeout((function(){e.style.border="1px solid #ccc",clearTimeout(t)}),500)}})):(O(),$()),a.smxml.step.length<=a.smxml.step[g]._seq&&1!=a.smxml.step[g]._attempt&&n(5,w.hideNext=!0,w)):n(5,w.hideNext=!0,w)}function O(){if(AH.selectAll(".edit_step").forEach((e=>{e.classList.contains("mathquill")?e.previousElementSibling.classList.contains("disable_div")&&AH.select(e.previousElementSibling,"removeClass","h"):e.disabled=!0,e.classList.add("data-check")})),x=0,null==a.smxml.step[g+1]&&"1"==a.smxml.step[g]._attempt)return n(5,w.hideNext=!0,w),L(l),void T();g!=a.smxml.step.length-1?(g+=1,M(),L(l),T()):console.log("All steps are attempted")}function L(e){window.inNative&&window.getHeight&&window.getHeight();var t=b?"lists="+JSON.stringify(f.var_list):" ";p.special="<smans><div "+t+" currStep='"+g+"' userAns='"+JSON.stringify(e)+"'></div></smans>"}function T(){let e=!1,t=null,n=!1;if(a.smxml.step.length==w.itemArray.length){let t=!0;for(let a in s)null!=s[a].overall&&(e=1==s[a].overall,t=t&&e),0==t?(AH.select("#answer").checked=!1,p.answer=!1,n=!1):(AH.select("#answer").checked=!0,p.answer=!0,n=!0)}t=p.special,window.inNative&&(window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*"),window.postMessage(JSON.stringify({userAnswers:t,inNativeIsCorrect:n}),"*")),onUserAnsChange({uXml:p.special,ans:p.answer})}function $(){AH.select("[data-sticky]","addClass","sticky")}function j(e,t,n,a,i){let s=e,l=((e=(e=e.replace(/%{|}%/g,"")).split("|"))[1]&&e[1].trim(),e[0].trim()),r="";if(-1!=l.indexOf("#style#")){let e=l.split("#style#");l=e[0],r=e[1]}let o=[],c=l.split(",");c.forEach((function(e,t){o[t]=10*c[t].length+30})),null!=a?E(e,o,r,s,n,l,t,a,i):E(e,o,r,s,n,l,t)}function E(e,t,a,l,c,m,p,u,h){if(null!=u){i="s"+u+"_t"+p,r="s"+u;let s='<input type="text" id="'+i+'" class="fillintheblank ks nmb text-center span0 edit_st" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none" style="width:'+(Math.max(...t)+20)+"px;"+a+'" />',o='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="text" class="corr_div">'+e[0]+"</span>"+s+"</span>",c=h.replace(l,o);n(2,d[u].__cdata=c,d)}else{if(c<=_)var v=c;else v=g;i="s"+v+"_t"+p,r="s"+v;let t='<input type="text" id="'+i+'" class="fillintheblank ks nmb text-center span0 edit_step" defaultans="" haskeywords=""  hasnotkeywords="" keywordtype="" autocomplete="off" data-role="none"  style="width:38px;'+a+'" />',d='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="remed_disable fh fwidth absolute h"></span><span id="" class="corr_div h-imp">'+e[0]+"</span>"+t+"</span>";o=o.replace(l,d),s=createAns(s,i,r,m),n(3,f.smans=s,f)}}function F(e){v=0,x+=1;for(let n in s)for(let a in s[n]){if(e<_)var t=e;else t=g;if(l["s"+t]&&null!=l["s"+t][a])if(s["s"+t][a].value==l["s"+t][a].value)R("correct",a);else if(/\,/g.test(s["s"+t][a].value)){let e=s["s"+t][a].value.split(","),n=l["s"+t][a].value;e.indexOf(n)>-1?R("correct",a):(v=1,R("wrong",a))}else v=1,R("wrong",a)}1==a.smxml.step[g]._mode?function(e,t){var n=0;v>0?(n=0,e<=_?s[t].overall=n:s[r].overall=n):(n=1,e<=_?s[t].overall=n:s[r].overall=n);O()}(e,"s"+e):function(e,t){var a=0;v>0?(n(5,w.classChange=w.itemArray.length-1,w),n(5,w.isColor=!1,w),a=0,e<=_?s[t].overall=a:(s[r].overall=a,T())):(n(5,w.classChange=w.itemArray.length-1,w),n(5,w.isColor=!0,w),a=1,e<=_?s[t].overall=a:(s[r].overall=a,O()));x>1&&O();l[r]&&null!=l[i]&&(l[r].optry=x);var o=setTimeout((function(){n(5,w.classChange=-1,w),clearTimeout(o)}),2500)}(e,"s"+e)}function R(e,t){if(1!=a.smxml.step[g]._mode&&("correct"==e?(AH.select("#"+t,"removeClass","false-hover"),AH.select("#"+t,"addClass","true-hover")):"wrong"==e&&(AH.select("#"+t,"removeClass","true-hover"),AH.select("#"+t,"addClass","false-hover")),x>1&&AH.select(AI.select("#"+t).previousElementSibling,"removeClass","h-imp"),1!=a.smxml._fixed))var n=setTimeout((function(){AH.select(AI.select("#"+t).previousElementSibling,"addClass","h-imp"),clearTimeout(n)}),2e3);H&&AH.selectAll(".edit_step").forEach((function(e,n){e.classList.contains("mathquill")?AH.select("#"+t).previousElementSibling.classList.contains("disable_div")&&AH.select(AH.select("#"+t).previousElementSibling,"removeClass","h"):e.classList.contains("answer_input")&&(e.disabled=!0),e.classList.add("data-check")}))}function P(){n(0,k=!0),T(),G(),document.querySelectorAll(".fillintheblank").disabled=!0}function Q(){n(0,k=!1),n(5,w.display=-1,w),n(5,w.smController=" h",w),AH.selectAll(".fillintheblank","removeClass","default-hover"),AH.selectAll(".fillintheblank").disabled=!1,n(5,w.main_steps=!1,w),n(5,w.correct_answer=!0,w),AH.selectAll(".remed_disable","css",{display:"none"}),(null==a.smxml.step[g+1]&&"1"==a.smxml.step[g]._attempt||null==a.smxml.step[g+1]&&"1"==a.smxml.step[g]._viewonly)&&AH.selectAll(".edit_step").length==AH.selectAll(".data-check").length?n(5,w.hideNext=!0,w):n(5,w.hideNext=!1,w),window.inNative&&window.getHeight&&window.getHeight()}function U(){n(5,w.display=-1,w),AH.selectAll(".fillintheblank","addClass","default-hover"),a.smxml.step.map((function(e,t){q("corr_ans",e.__cdata,t)})),n(5,w.main_steps=!0,w),n(5,w.correct_answer=!1,w),window.inNative&&window.getHeight&&window.getHeight()}function G(){n(5,w.display=1,w),n(5,w.hideNext=!0,w),n(5,w.smController="",w),AH.selectAll(".fillintheblank","removeClass","default-hover"),n(5,w.main_steps=!1,w),n(5,w.correct_answer=!0,w),AH.selectAll(".remed_disable","css",{display:"block"}),window.inNative&&window.getHeight&&window.getHeight()}function z(e,t,n,a,i){let s=e;(e=(e=e.replace(/%{|}%/g,"")).split("|"))[0]=e[0].replace(/user Response/g,"\\MathQuillMathField");let l=e[0].split("##"),r=Math.floor(Math.random()*l.length),o=l[r],c=o.replace(/MathQuillMathField{(.*?)}/g,"MathQuillMathField{}"),d=0,m=o,p=m.replace(/\\MathQuillMathField/g,"");o.indexOf("MathQuillMathField")>-1&&(m=o,d=1),null!=a?J(c,e,s,n,t,r,d,m,p,a,i):J(c,e,s,n,t,r,d,m,p)}function J(e,t,a,l,m,p,u,h,v,x,b){let w=t[0].trim();if(l<=_)var A=l;else A=g;if(null!=x){i="s0"+x+"_t"+m,r="s0"+x;let t='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m0"+x+"_t"+m)+'" class="corr_div fillmathelement mathquill mq'+A+'" userAnsSeq="'+p+'" anskey="'+h+'" defaultans="'+u+'" mathtype="1">'+v+"</span>"+('<span  id="'+i+'" class="auto_height edit_st fillmathelement mathquill mq'+A+'" userAnsSeq="'+p+'" userans="'+e+'" anskey="'+h+'" defaultans="'+u+'" mathtype="1">s</span>')+"</span>",s=b.replace(a,t);n(2,d[x].__cdata=s,d)}else{i="s"+A+"_t"+m,r="s"+A;let t='<span id="'+r+'" class="text-center filter fillelement inline-block"><span class="disable_div fh fwidth absolute h"></span><span class="remed_disable fh fwidth absolute h"></span><span  id="'+("m"+A+"_t"+m)+'" class="corr_div h-imp fillmathelement mathquill mq'+A+'" userAnsSeq="'+p+'" anskey="'+h+'" defaultans="'+u+'" mathtype="1">'+v+"</span>"+('<span  id="'+i+'" class="auto_height edit_step fillmathelement mathquill mq'+A+'" userAnsSeq="'+p+'" userans="'+e+'" anskey="'+h+'" defaultans="'+u+'" mathtype="1">s</span>')+"</span>";o=o.replace(a,t),s=createAns(s,i,r,w),n(3,f.smans=s,f)}let y=setInterval(function(){if("function"==typeof MathQuill){clearInterval(y);let e=MathQuill.getInterface(2);AH.selectAll(".mathquill.mq"+A).forEach((t=>{let a=t.getAttribute("id");if(1==t.getAttribute("defaultans")){let e=t.getAttribute("userans");AH.select("#"+a).innerText=e}else AH.select("#"+a).innerText=t.getAttribute("userans");try{n(1,c[a]=e.StaticMath(document.getElementById(a)),c)}catch(e){console.log(e)}}))}}.bind(this),100)}function X(e,t){let n,a=[],i=jQuery(e).closest("div").find("span.fillelement").attr("id"),s=jQuery(e).attr("id"),r=jQuery(e).attr("userans").trim();if("math_user"==t)n=r;else{let e=MathQuill.getInterface(2).StaticMath(document.getElementById(s));for(let t=0;t<=e.innerFields.length-1;t++)a[t]=e.innerFields[t].latex();let t=r,i=r.match(/\\MathQuillMathField{(.*?)\}/g);for(let e in i){const n="\\MathQuillMathField{"+a[e]+"}",s=i[e].replace(/\\MathQuillMathField{(.*?)\}/g,n);let l=i[e];t=t.replace(l,s)}r=t,n=r}l=createAns(l,s,i,n),L(l)}beforeUpdate((()=>{if(w.isMathquill&&loadLibs(),H){let e=XMLToJSON(H);e.smans&&e.smans.div&&e.smans.div._userAns&&function(e){let t=XMLToJSON(e);b&&(h=JSON.parse(t.smans.div._lists));_=JSON.parse(t.smans.div._currStep)}(H)}if(A!=w.xml){if(n(5,w.xml=A,w),1==y)return!1;H||(g=0,n(5,w.itemArray=[],w),l={},n(5,w.hideNext=!1,w),AH.find(document,".sticky",{action:"removeClass",actionData:"sticky"}),AH.selectAll(".edit_step","removeAttr","disabled"),AH.selectAll(".edit_step").value=""),n(5,w.blank=!1,w),function(e){b=!1,"undefined"!=e.smxml.algo&&e.smxml.algo&&(b=!0);b&&(u=Step.init(e.smxml.algo));let t=JSON.stringify(e);if(b){if(H){let e=XMLToJSON(H);e.smans&&e.smans.div&&e.smans.div._lists&&(u=h)}a=Step.init.replaceVariables(t,u),a=JSON.parse(a)}else a=e;let i=a.smxml.step;n(2,d=i.slice()),"function"!=typeof Object.assign&&(Object.assign=function(e){if(null==e)throw new TypeError("Cannot convert undefined or null to object");e=Object(e);for(var t=1;t<arguments.length;t++){var n=arguments[t];if(null!=n)for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e});if(i.map((function(e,t){n(2,d[t]=Object.assign({},e),d)})),""!=_){g=_;for(let e=0;e<=_;e++)M(e)}else M();if(H){let e=XMLToJSON(H);if(e.smans&&e.smans.div&&e.smans.div._userAns)var s=setTimeout((function(){!function(e){let t=XMLToJSON(e);if(t.smans&&t.smans.div&&t.smans.div._userAns){t=JSON.parse(t.smans.div._userAns);for(let e in t)for(let n in t[e]){let a=e.split("")[1],i=t[e][n].value;AH.select("#"+n).classList.contains("mathquill")?(AH.select("#"+n,"userans",i),X("#"+n,"math_user")):(AH.select("#"+n).value=i,S(AH.select("#"+n))),x=0,N(),F(a)}}}(H),clearTimeout(s)}),50)}}(XMLToJSON(w.xml))}})),onMount((()=>{AH.listen(document,"keydown",".edit_step",(function(e,t){let n=10*e.value.split("").length+30+"px";e.style.width=n})),window.J=jquery,AI.set("stepAlgo",this),AH.addScript("","https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"),AH.addScript("",itemUrl+"src/libs/mathQuill_new.js"),window.inNative&&window.getHeight&&window.getHeight(),setTimeout((function(){AH.selectAll(".toolbar_container_one","addClass","h-imp")}),100),AH.listen(document,"click",".edit_step",(e=>{S(e)})),AH.listen(document,"keyup",".edit_step",(e=>{S(e)})),AH.listen(document,"change",".edit_step",(e=>{S(e)})),AH.listen(document,"click","span.mq-editable-field.mq-focused",(e=>{let t,a=e,i=!0;for(;i;)a=a.parentElement,a.getAttribute("id")&&(i=!1,t=a.getAttribute("id"),n(4,m=t));let s=[];AH.selectAll("#"+t+" span.mq-editable-field").forEach((e=>{let t=e.getAttribute("mathquill-command-id");s.push(t)}));let l=e.getAttribute("mathquill-command-id"),r=s.indexOf(l);n(5,w.spanId=r,w),n(5,w.divId=t,w),AH.selectAll(".toolbar_container_one","removeClass","h-imp"),n(5,w.showToolbar=!0,w)})),AH.listen(document,"click",".next_step",(function(e,t){"undefined"!=typeof QUIZPLAYERID&&window.parentElement.autoResize(QUIZPLAYERID),t.preventDefault(),N()})),setTimeout((function(){AH.listen(document,"click","#set-review",(function(){P()})),AH.listen(document,"click","#unset-review",(function(){Q()}))}),1e3),window.inNative&&setTimeout((function(){window.postMessage("height___"+document.getElementsByClassName("inNativeStyle")[0].offsetHeight,"*")}),200),window.inNative&&(window.checkReview=e=>e?self.setReview():self.unsetReview()),AH.addScript("",itemUrl+"src/libs/mathQuill_new.js")}));return e.$$set=e=>{"xml"in e&&n(12,A=e.xml),"stopPreviewUpdate"in e&&n(13,y=e.stopPreviewUpdate),"isReview"in e&&n(0,k=e.isReview),"uxml"in e&&n(14,H=e.uxml)},e.$$.update=()=>{if(1&e.$$.dirty[0])if(k)var t=setTimeout((function(){P(),clearTimeout(t)}),500);else var n=setTimeout((function(){Q(),clearTimeout(n)}),200)},[k,c,d,f,m,w,function(e){if(null!=a.smxml.step[e]&&1==a.smxml.step[e]._sticky)return"sticky"},C,I,P,Q,function(e,t){"c"==e?U():G()},A,y,H,e=>{C(e)},()=>setTimeout((function(){I()}),100)]}class StepAlgoPreview extends SvelteComponent{constructor(e){super(),document_1.getElementById("svelte-142veau-style")||add_css(),init(this,e,instance,create_fragment,safe_not_equal,{xml:12,stopPreviewUpdate:13,isReview:0,uxml:14},[-1,-1,-1])}}function create_if_block$1(e){let t,n;return t=new StepAlgoPreview({props:{xml:e[0],remedStatus:e[1],showAns:e[2],stopPreviewUpdate:e[3],isReview:e[6]}}),{c(){create_component(t.$$.fragment)},m(e,a){mount_component(t,e,a),n=!0},p(e,n){const a={};1&n&&(a.xml=e[0]),2&n&&(a.remedStatus=e[1]),4&n&&(a.showAns=e[2]),8&n&&(a.stopPreviewUpdate=e[3]),64&n&&(a.isReview=e[6]),t.$set(a)},i(e){n||(transition_in(t.$$.fragment,e),n=!0)},o(e){transition_out(t.$$.fragment,e),n=!1},d(e){destroy_component(t,e)}}}function create_fragment$1(e){let t,n,a=(2==e[4]?.content_icon||2==e[5])&&create_if_block$1(e);return{c(){t=element("main"),a&&a.c()},m(e,i){insert(e,t,i),a&&a.m(t,null),n=!0},p(e,[n]){2==e[4]?.content_icon||2==e[5]?a?(a.p(e,n),48&n&&transition_in(a,1)):(a=create_if_block$1(e),a.c(),transition_in(a,1),a.m(t,null)):a&&(group_outros(),transition_out(a,1,1,(()=>{a=null})),check_outros())},i(e){n||(transition_in(a),n=!0)},o(e){transition_out(a),n=!1},d(e){e&&detach(t),a&&a.d()}}}function instance$1(e,t,n){let{xml:a}=t,{remedStatus:i}=t,{showAns:s}=t,{stopPreviewUpdate:l}=t,{editorState:r}=t,{content_icon:o}=t,{isReview:c}=t;return e.$$set=e=>{"xml"in e&&n(0,a=e.xml),"remedStatus"in e&&n(1,i=e.remedStatus),"showAns"in e&&n(2,s=e.showAns),"stopPreviewUpdate"in e&&n(3,l=e.stopPreviewUpdate),"editorState"in e&&n(4,r=e.editorState),"content_icon"in e&&n(5,o=e.content_icon),"isReview"in e&&n(6,c=e.isReview)},[a,i,s,l,r,o,c]}class ItemPluginPreview extends SvelteComponent{constructor(e){super(),init(this,e,instance$1,create_fragment$1,safe_not_equal,{xml:0,remedStatus:1,showAns:2,stopPreviewUpdate:3,editorState:4,content_icon:5,isReview:6})}}export default ItemPluginPreview;
//# sourceMappingURL=ItemPluginPreview-018d837c.js.map
