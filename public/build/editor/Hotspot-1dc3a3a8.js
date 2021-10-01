import{G as e,S as t,i,s as a,H as l,I as s,K as n,L as o,e as r,b as c,C as d,c as h,f as m,g,M as u,h as p,j as v,m as f,l as x,N as b,t as w,a as y,o as _,d as $,y as k,p as I,A as C,X as S,O as A,w as T,P as D,u as N,Q as B,R as M,T as H,U as L,r as E,J as W}from"./main-6197a26a.js";function z(e,t){return!0===isNaN(Number(e))?this.x=0:this.x=e,!0===isNaN(Number(t))?this.y=0:this.y=t,{X:this.x,Y:this.y}}const X=new e;class O{constructor(e){this.prevPoint=void 0,this.defaultOptions={target:"",penSize:1,width:e.width,height:e.height,cssClass:"",onClick:e=>{},onMove:e=>{},onPaint:e=>{},onRelease:e=>{}},this.penWidth=2,this.drawing=!1,this.cap="round",this.ID="dooScribCanvas"+Math.floor(100*Math.random()+1),this.drawingSurface="",e&&(this.Settings={...this.defaultOptions,...e}),!0===isNaN(this.Settings.height)&&(this.Settings.height=100),!0===isNaN(this.Settings.width)&&(this.Settings.width=100),this.init()}init(){let e=this.Settings.target;e?("hptmain0"==e.getAttribute("id")&&X.empty(e),X.insert(e,`<canvas id='${this.ID}' tabindex='0' class='relative ${this.Settings.cssClass}' type='${this.Settings.type}' correctans='${this.Settings.correctans}' userans=''  height='${this.Settings.height}' width='${this.Settings.width}'></canvas>`,"beforeend"),this.penSize(this.Settings.penSize),this.drawingSurface=document.getElementById(this.ID).getContext("2d"),this.drawingSurface.lineWidth=this.penSize(),this.drawingSurface.lineCap=this.cap,!1===this.hasTouch()?(document.getElementById(this.ID).addEventListener("mousedown",this.clickDown.bind(this),!0),document.getElementById(this.ID).addEventListener("mousemove",this.moved.bind(this),!0),document.getElementById(this.ID).addEventListener("mouseup",this.clickUp.bind(this),!0)):(document.getElementById(this.ID).addEventListener("touchstart",this.clickDown.bind(this),!0),document.getElementById(this.ID).addEventListener("touchmove",this.moved.bind(this),!0),document.getElementById(this.ID).addEventListener("touchend",this.clickUp.bind(this),!0))):console.error("Target not defined")}normalizeTouch(e){if(!0===this.hasTouch()){let t=window.scrollY;["touchstart","touchmove"].indexOf(e.type)>-1&&(e.clientX=e.targetTouches[0].pageX,e.clientY=e.targetTouches[0].pageY-t),["touchend"].indexOf(e.type)>-1&&(e.clientX=e.changedTouches[0].pageX,e.clientY=e.changedTouches[0].pageY-t)}return e}clickDown(e){if(!0===this.isDrawing())return;e||(e=window.event),!0===this.hasTouch()&&(e.preventDefault(),e=this.normalizeTouch(e));let t=X.offset(this.Settings.target),i=window.scrollY,a=new z(e.clientX-t.left,e.clientY-(t.top-i));return this.prevPoint=a,this.drawing=!0,this.Settings.onClick(a),!1}moved(e){e||(e=window.event),!0===this.hasTouch()&&(e.preventDefault(),e=this.normalizeTouch(e));var t=X.offset(this.Settings.target),i=window.scrollY,a=new z(e.clientX-t.left,e.clientY-(t.top-i));return!0===this.isDrawing()?(this.drawLine(this.prevPoint.X,this.prevPoint.Y,a.X,a.Y),this.prevPoint=a,this.Settings.onPaint(a)):this.Settings.onMove(a),!1}clickUp(e){if(!1===this.isDrawing())return;!0===this.hasTouch()&&(e.preventDefault(),e=this.normalizeTouch(e));let t=X.offset(this.Settings.target),i=window.scrollY,a=new z(e.clientX-t.left,e.clientY-(t.top-i));return this.Settings.onRelease(a),this.drawing=!1,!1}hasTouch(){return"ontouchstart"in window}penSize(e){return void 0!==e&&!1===isNaN(Number(e))&&(this.penWidth=e),this.penWidth}isDrawing(){if(this.Settings.editable)return this.drawing}lineCap(e){if(void 0!==e)switch(e){case"butt":case"round":case"square":this.cap=e}return this.cap}lineColor(e){if(void 0!==e){let t=X.parseHtml("<div id='stub' style='backgroundColor:white'></div>");t.style.backgroundColor=e;let i=t.style.backgroundColor;void 0!==i&&""!==i&&(window.color=e)}return window.color}context(){return this.drawingSurface}clearSurface(){let e=X.find(document,"canvas").getAttribute("width").replace("px",""),t=X.find(document,"canvas").getAttribute("height").replace("px","");this.drawingSurface.clearRect(0,0,e,t)}drawLine(e,t,i,a){void 0!==e&&void 0!==t&&void 0!==i&&void 0!==a&&!1===isNaN(Number(e))&&!1===isNaN(Number(t))&&!1===isNaN(Number(i))&&!1===isNaN(Number(a))&&(this.drawingSurface.lineCap=this.cap,this.drawingSurface.strokeStyle=window.color,this.drawingSurface.lineWidth=this.penWidth,this.drawingSurface.beginPath(),this.drawingSurface.moveTo(e,t),this.drawingSurface.lineTo(i,a),this.drawingSurface.stroke())}}const Y=new e;class q{constructor(){this.count=0,this.drawstr=""}updateElem(e,t,i,a,l){let s,n,o,r,c,d=Y.serializeArray(Y.find("#authoring-modal",".h","visible"),"input"),h="",m=[],g=Y.select("#im").getBoundingClientRect();if(void 0!==a){if(d=JSON.parse(Y.select("#"+i).dataset.attributes),!d){let e=[];e[0]={name:"id",value:i},e[1]={name:"type",value:"hotspot"},e[2]={name:"top",value:parseInt(Y.select("#"+i).style.top.split("px")[0])},e[3]={name:"left",value:parseInt(Y.select("#"+i).style.left.split("px")[0])},e[4]={name:"width",value:parseInt(Y.select("#"+i).style.width.split("px")[0])},e[5]={name:"height",value:parseInt(Y.select("#"+i).style.height.split("px")[0])},d=e}console.log("_this",t),console.log(a.css),d.forEach(((e,i,l)=>{switch(console.log("_data.name",e.name),e.name){case"width":e.value=a.clientWidth;break;case"height":e.value=a.clientHeight;break;case"top":e.value=+e.value+t.offsetY-a.clientHeight/2,e.value<0&&(e.value=0),e.value+a.clientHeight>g.height&&(e.value=g.height-a.clientHeight);break;case"left":e.value=+e.value+t.offsetX-a.clientWidth/2,e.value<0&&(e.value=0),e.value+a.clientWidth>g.width&&(e.value=g.width-a.clientWidth)}l[i]=e})),console.log("after",d,t)}switch(d.forEach(((e,t)=>{"width"==e.name&&(s=e.value),"height"==e.name&&(n=e.value),"top"==e.name&&(o=e.value),"left"==e.name&&(r=e.value),"bgimg"==e.name&&""!=e.value.trim()&&(h=Y.select("#hptmain").getAttribute("path")+e.value.trim()),m[e.name]=e.name})),e){case"div":c=`[id="${i}"]`,Y.select(`[id="${i}"]`,"css",{width:s+"px",height:n+"px",top:o+"px",left:r+"px"}).dataset.attributes=JSON.stringify(d);break;case"base":c="hptmain",Y.select("#hptmain").dataset.attributes=JSON.stringify(d)}if("base"==e){let e="hptmain"==i?"#hptmain":"#hptdraw";if(""!=h){let t=new Image;t.src=h;let a=t.src.substr(t.src.lastIndexOf(".")+1);setTimeout((()=>{t.width=t.width>0?t.width:"600",t.height=t.height>0?t.height:"250",Y.select("#option-toolbar","css",{width:t.width}),"gif"!=a&&(Y.selectAll(e+">img").length>0?(Y.select(e,"css",{width:t.width,height:t.height}),Y.selectAll(e+">img","attr",{src:h})):"hptdraw"==i?(Y.find(e,"canvas",{action:"attr",actionData:{width:t.width,height:t.height}}),Y.selectAll(Y.siblings(e),"css",{width:t.width}),Y.select(e,"css",{width:t.width,height:t.height,backgroundImage:"url("+h+")"})):Y.insert(Y.select(e,"css",{width:t.width,height:t.height}),'<img src="'+h+'" />',"beforebegin"))}),100)}else Y.selectAll(e+">img").length>0&&(Y.select(e,"css",{width:"600px",height:"250px"}),Y.select(e+">img","remove"))}return"div"==e?this.updateXML(e,c,d,o,r,l):"gif"!=img_ext&&"undefined"!=typeof img?this.updateXML(e,c,d,img.width,img.height,l):void Y.alert("Please Do not use Gif Image!!!")}drawOnCanvasAuth(e,t,i){let a=document.getElementById(e).getContext("2d"),l=Object.keys(t).length;if(""!=t)for(let e=1;e<=l;e++)for(let i=0;i<=t[e].x.length;i++)a.beginPath(),a.lineWidth="4",a.strokeStyle=window.color,a.moveTo(t[e].x[i],t[e].y[i]),a.lineTo(t[e].x[i+1],t[e].y[i+1]),a.stroke()}updateXML(e,t,i,a,l,s){let n,o=Y.parseHtml(s);if(n="hptmain"==t?o:Y.find(o,t),a>0&&l>0&&(n.setAttribute("width",a),n.setAttribute("height",l)),i)for(let e of i)""!==e.value?(n.setAttribute(e.name,e.value),"type"==e.name&&n.setAttribute(e.value,"hotspot")):n.removeAttribute(e.name);return formatXml(o.outerHTML)}}function P(e){let t,i,a,l,s,n,o,d,h,f,b,w,y,$,I,C,S,A,T,D,L,E,W,z,X,O,Y,q,P,j,J,R,U,K,G,F,Q,V,Z,ee,te,ie,ae,le,se,ne,oe,re,ce,de,he,me,ge,ue,pe,ve;return{c(){t=r("h4"),t.innerHTML='<div class="d-flex justify-content-between"><div>Image</div></div>',i=c(),a=r("div"),l=r("div"),s=r("input"),o=c(),d=r("button"),d.textContent="Upload image",h=c(),f=r("div"),b=r("img"),y=c(),$=r("span"),I=r("label"),C=N("Image Alt"),A=c(),T=r("input"),L=c(),E=r("div"),W=r("div"),z=r("span"),z.innerHTML='<label for="hotBorder" class="my-1 text-dark">Border width</label>',X=c(),O=r("select"),Y=r("option"),Y.textContent="None",q=r("option"),q.textContent="1",P=r("option"),P.textContent="2",j=r("option"),j.textContent="3",J=r("option"),J.textContent="4",R=r("option"),R.textContent="5",K=c(),G=r("div"),F=r("span"),F.innerHTML='<label for="hotBorderColor" class="my-1 text-dark">Border color</label>',Q=c(),V=r("select"),Z=r("option"),Z.textContent="None",ee=r("option"),ee.textContent="Black",te=r("option"),te.textContent="Grey",ae=c(),le=r("br"),se=c(),ne=r("div"),oe=r("span"),oe.innerHTML='<label for="setLineColor" class="mt-2 text-dark">Draw line color</label>',re=c(),ce=r("select"),de=r("option"),de.textContent="Please Select",he=r("option"),he.textContent="Red",me=r("option"),me.textContent="Black",ge=r("option"),ge.textContent="Blue",m(t,"class","mt-1 font21 mb-4"),m(s,"type","text"),m(s,"id","backgroundImage"),s.disabled="true",s.value=n=e[7].bgImg,m(s,"margin","normal"),g(s,"pointer-events","none"),g(s,"width","76%"),m(s,"class","form-control mr-2"),m(d,"id","upload_media"),m(d,"type","button"),d.value="Upload Media",m(d,"margin","normal"),m(d,"class","btn btn-outline-primary position-relative"),m(l,"class","d-flex"),u(b.src,w=e[7].image_url)||m(b,"src",w),m(b,"alt","background"),m(b,"class","img img-responsive span7"),m(f,"class","mx-auto width8 p-2 border mt-2"),m(I,"for","imgAlt"),m(I,"class",S=4==e[7].valueMultiple?"my-1 text-dark":"hidden"),m(T,"type","text"),m(T,"id","imgAlt"),m(T,"placeholder","Alt text"),m(T,"class",D=4==e[7].valueMultiple?" form-control mt-0":"hidden form-control mt-0"),m(T,"margin","normal"),g(T,"width","-webkit-fill-available"),Y.__value="0",Y.value=Y.__value,q.__value="1",q.value=q.__value,P.__value="2",P.value=P.__value,j.__value="3",j.value=j.__value,J.__value="4",J.value=J.__value,R.__value="5",R.value=R.__value,m(O,"id","hotBorder"),m(O,"class","form-select"),void 0===e[7].hotBorder&&B((()=>e[17].call(O))),m(W,"class",U=4==e[7].valueMultiple?"d-inline-block pr-2 mt-2 w-sm":"hidden"),Z.__value="white",Z.value=Z.__value,ee.__value="black",ee.value=ee.__value,te.__value="grey",te.value=te.__value,m(V,"id","hotBorderColor"),m(V,"class","form-select"),void 0===e[7].hotBorderColor&&B((()=>e[18].call(V))),m(G,"class",ie=4==e[7].valueMultiple?"d-inline-block mt-2 w-sm":"hidden"),m(E,"class","d-flex"),de.__value="Please Select",de.value=de.__value,he.__value="red",he.value=he.__value,me.__value="black",me.value=me.__value,ge.__value="blue",ge.value=ge.__value,m(ce,"id","setLineColor"),m(ce,"class","form-select"),void 0===e[7].lineColor&&B((()=>e[19].call(ce))),m(ne,"class",ue=3==e[7].valueMultiple?"":"hidden"),g(a,"overflow-y","auto"),g(a,"padding-right","20px")},m(n,r){p(n,t,r),p(n,i,r),p(n,a,r),v(a,l),v(l,s),v(l,o),v(l,d),v(a,h),v(a,f),v(f,b),v(a,y),v(a,$),v($,I),v(I,C),v(a,A),v(a,T),M(T,e[7].alt),v(a,L),v(a,E),v(E,W),v(W,z),v(W,X),v(W,O),v(O,Y),v(O,q),v(O,P),v(O,j),v(O,J),v(O,R),H(O,e[7].hotBorder),v(E,K),v(E,G),v(G,F),v(G,Q),v(G,V),v(V,Z),v(V,ee),v(V,te),H(V,e[7].hotBorderColor),v(a,ae),v(a,le),v(a,se),v(a,ne),v(ne,oe),v(ne,re),v(ne,ce),v(ce,de),v(ce,he),v(ce,me),v(ce,ge),H(ce,e[7].lineColor),pe||(ve=[x(T,"input",e[16]),x(O,"change",e[17]),x(V,"change",e[18]),x(ce,"change",e[19]),x(ce,"blur",e[13].bind(this))],pe=!0)},p(e,t){128&t[0]&&n!==(n=e[7].bgImg)&&s.value!==n&&(s.value=n),128&t[0]&&!u(b.src,w=e[7].image_url)&&m(b,"src",w),128&t[0]&&S!==(S=4==e[7].valueMultiple?"my-1 text-dark":"hidden")&&m(I,"class",S),128&t[0]&&D!==(D=4==e[7].valueMultiple?" form-control mt-0":"hidden form-control mt-0")&&m(T,"class",D),128&t[0]&&T.value!==e[7].alt&&M(T,e[7].alt),128&t[0]&&H(O,e[7].hotBorder),128&t[0]&&U!==(U=4==e[7].valueMultiple?"d-inline-block pr-2 mt-2 w-sm":"hidden")&&m(W,"class",U),128&t[0]&&H(V,e[7].hotBorderColor),128&t[0]&&ie!==(ie=4==e[7].valueMultiple?"d-inline-block mt-2 w-sm":"hidden")&&m(G,"class",ie),128&t[0]&&H(ce,e[7].lineColor),128&t[0]&&ue!==(ue=3==e[7].valueMultiple?"":"hidden")&&m(ne,"class",ue)},d(e){e&&_(t),e&&_(i),e&&_(a),pe=!1,k(ve)}}}function j(e){let t,i=d.cancel+"";return{c(){t=N(i)},m(e,i){p(e,t,i)},p:E,d(e){e&&_(t)}}}function J(e){let t,i=d.submit+"";return{c(){t=N(i)},m(e,i){p(e,t,i)},p:E,d(e){e&&_(t)}}}function R(e){let t,i,a,l,s;return i=new L({props:{unelevated:!0,outlined:!0,class:"text-capitalize",color:"#ccc",$$slots:{default:[j]},$$scope:{ctx:e}}}),i.$on("click",e[9]),l=new L({props:{class:"bg-primary text-white",style:"text-transform: none",key:d.submit,$$slots:{default:[J]},$$scope:{ctx:e}}}),l.$on("click",e[8].bind(this,"img")),{c(){t=r("div"),h(i.$$.fragment),a=c(),h(l.$$.fragment),m(t,"slot","footer"),m(t,"class","svelteFooter")},m(e,n){p(e,t,n),f(i,t,null),v(t,a),f(l,t,null),s=!0},p(e,t){const a={};262144&t[1]&&(a.$$scope={dirty:t,ctx:e}),i.$set(a);const s={};262144&t[1]&&(s.$$scope={dirty:t,ctx:e}),l.$set(s)},i(e){s||(w(i.$$.fragment,e),w(l.$$.fragment,e),s=!0)},o(e){y(i.$$.fragment,e),y(l.$$.fragment,e),s=!1},d(e){e&&_(t),$(i),$(l)}}}function U(e){let t,i,a;return{c(){t=r("h4"),t.innerHTML='<div class="d-flex justify-content-between"><div>Hotspot</div></div>',i=c(),a=r("div"),a.innerHTML='<div class="row"><div class="col-6 pr-1"><span><label for="dragHeight" class="my-1 text-dark">Height</label></span> \n                    <input type="number" id="dragHeight" placeholder="Height" defaultvalue=" " class="form-control"/></div> \n                <div class="col-6 pl-1"><span><label for="dragWidth" class="my-1 text-dark">Width</label></span> \n                    <input type="number" id="dragWidth" placeholder="Width" defaultvalue=" " class="form-control"/></div></div> \n            <div class="row mt-2"><div class="col-6 pr-1"><span><label for="dragTop" class="my-1 text-dark">Top</label></span> \n                    <input type="number" id="dragTop" placeholder="Top" defaultvalue=" " class="form-control"/></div> \n                <div class="col-6 pl-1"><span><label for="dragLeft" class="my-1 text-dark">Left</label></span> \n                    <input type="number" id="dragLeft" placeholder="Left" defaultvalue=" " class="form-control"/></div></div>',m(t,"class","mt-1 font21 mb-4"),g(a,"overflow-y","auto"),g(a,"padding-right","20px")},m(e,l){p(e,t,l),p(e,i,l),p(e,a,l)},d(e){e&&_(t),e&&_(i),e&&_(a)}}}function K(e){let t,i=d.cancel+"";return{c(){t=N(i)},m(e,i){p(e,t,i)},p:E,d(e){e&&_(t)}}}function G(e){let t,i=d.done+"";return{c(){t=N(i)},m(e,i){p(e,t,i)},p:E,d(e){e&&_(t)}}}function F(e){let t,i,a,l,s;return i=new L({props:{unelevated:!0,outlined:!0,class:"text-capitalize",color:"#ccc",$$slots:{default:[K]},$$scope:{ctx:e}}}),i.$on("click",e[9]),l=new L({props:{class:"bg-primary text-white",style:"text-transform: none",key:d.done,$$slots:{default:[G]},$$scope:{ctx:e}}}),l.$on("click",e[8].bind(this,"drag")),{c(){t=r("div"),h(i.$$.fragment),a=c(),h(l.$$.fragment),m(t,"slot","footer"),m(t,"class","svelteFooter")},m(e,n){p(e,t,n),f(i,t,null),v(t,a),f(l,t,null),s=!0},p(e,t){const a={};262144&t[1]&&(a.$$scope={dirty:t,ctx:e}),i.$set(a);const s={};262144&t[1]&&(s.$$scope={dirty:t,ctx:e}),l.$set(s)},i(e){s||(w(i.$$.fragment,e),w(l.$$.fragment,e),s=!0)},o(e){y(i.$$.fragment,e),y(l.$$.fragment,e),s=!1},d(e){e&&_(t),$(i),$(l)}}}function Q(e){let t;return{c(){t=N(ie)},m(e,i){p(e,t,i)},p:E,d(e){e&&_(t)}}}function V(e){let t;return{c(){t=N("Close")},m(e,i){p(e,t,i)},d(e){e&&_(t)}}}function Z(e){let t,i,a;return i=new L({props:{color:"#ff0",$$slots:{default:[V]},$$scope:{ctx:e}}}),i.$on("click",e[22]),{c(){t=r("span"),h(i.$$.fragment),m(t,"slot","action")},m(e,l){p(e,t,l),f(i,t,null),a=!0},p(e,t){const a={};262144&t[1]&&(a.$$scope={dirty:t,ctx:e}),i.$set(a)},i(e){a||(w(i.$$.fragment,e),a=!0)},o(e){y(i.$$.fragment,e),a=!1},d(e){e&&_(t),$(i)}}}function ee(e){let t,i,a,I,C,S,A,T,D,N,B,M,H,L,E,W,z,X,O,Y,q,j,J,K,G,V,ee,ie,ae,le,se,ne,oe,re,ce,de,he,me,ge,ue,pe,ve,fe;function xe(t){e[20](t)}let be={class:"remove_right_margin",width:"600",style:"background: #fff; border-radius: 5px;",$$slots:{footer:[R],default:[P]},$$scope:{ctx:e}};function we(t){e[21](t)}void 0!==e[7].openImg&&(be.visible=e[7].openImg),oe=new l({props:be}),s.push((()=>n(oe,"visible",xe)));let ye={class:"remove_right_margin",width:"600",style:"background: #fff; border-radius: 5px;",$$slots:{footer:[F],default:[U]},$$scope:{ctx:e}};function _e(t){e[23](t)}void 0!==e[7].openDrag&&(ye.visible=e[7].openDrag),de=new l({props:ye}),s.push((()=>n(de,"visible",we)));let $e={bg:"#f44336",bottom:!0,timeout:10,style:"position:fixed; bottom:50px",$$slots:{action:[Z],default:[Q]},$$scope:{ctx:e}};return void 0!==e[7].snackback&&($e.visible=e[7].snackback),ge=new o({props:$e}),s.push((()=>n(ge,"visible",_e))),{c(){t=r("div"),i=r("center"),a=r("div"),C=c(),S=r("div"),A=r("div"),T=r("div"),D=r("span"),N=c(),B=r("span"),B.textContent=""+d.reset,M=c(),H=r("div"),L=r("div"),E=r("button"),E.innerHTML='<i class="icomoon-24px-edit-1"></i>',W=c(),z=r("div"),X=r("div"),O=r("button"),O.innerHTML='<i class="icomoon-24px-edit-1"></i>',Y=c(),q=r("img"),K=c(),G=r("div"),V=r("div"),ee=r("button"),ee.innerHTML='<i class="icomoon-24px-edit-1"></i>',ae=c(),le=r("textarea"),ne=c(),h(oe.$$.fragment),ce=c(),h(de.$$.fragment),me=c(),h(ge.$$.fragment),m(a,"class","tinymce-editor-response"),m(a,"id","text0"),m(a,"type",I=e[6][0]),g(a,"width",e[1]+", \r\n                height: "+e[0]+", \r\n                border: 1px solid #ccc"),g(a,"outline","none"),g(a,"padding","10px"),g(a,"textAlign","left"),g(a,"display","none"),g(a,"overflowY","scroll\r\n            "),m(a,"contenteditable","true"),m(D,"class","icomoon-new-24px-reset-1 s3"),g(D,"vertical-align","text-top"),m(B,"class","position-relative bottom1"),m(T,"id","resetAuth"),m(T,"class","reset btn btn-outline-primary btn-sm height27 mt-sm2 mr-sm2 float-right"),g(T,"width","90px"),g(A,"width",e[1]),g(A,"height","32px"),g(A,"background","#d9e7fd"),g(A,"border-top","2px solid #96bbf6\r\n            "),m(E,"name","change_image"),m(E,"type","button"),m(E,"class","btn btn-light px-1 pt-sm1 pb-sm1 mt"),m(L,"class","btn-group tools"),m(H,"id","hptdraw"),g(H,"width",e[1]),g(H,"height",e[0]),g(H,"background-image","url('"+(te+e[7].bgImg)+"')"),g(H,"background-repeat","no-repeat"),g(H,"position","relative"),g(H,"border","1px solid #e0e0e0"),m(S,"class","drawImage d-none"),m(O,"type","button"),m(O,"class","btn btn-light px-1 pt-sm1 pb-sm1 mt"),m(X,"class","btn-group tools"),m(q,"id","im"),m(q,"class","hotSpotImg border"),u(q.src,j=te+e[7].bgImg)||m(q,"src",j),g(q,"height",e[7].imgheight),g(q,"width",e[7].imgwidth),g(q,"border",e[7].hotBorder),g(q,"border-color",e[7].hotBorderColor),m(q,"alt",J=e[7].alt),m(ee,"type","button"),m(ee,"class","btn btn-light px-1 pt-sm1 pb-sm1"),m(V,"class","btn-group tools h"),m(G,"draggable",ie=!0),m(G,"class","drag-resize position-absolute"),m(G,"id","ID0"),g(G,"left",e[5]),g(G,"top",e[2]),g(G,"height",e[3]),g(G,"width",e[4]),m(z,"id","hptmain"),m(z,"path",te),m(z,"class","d-none"),g(z,"position","relative"),g(z,"width",e[1]),m(le,"class","d-none"),m(le,"id","special_module_xml"),m(le,"name","special_module_xml"),le.value=se=e[7].xml,m(i,"class","mt"),m(i,"id","mainContent")},m(l,s){p(l,t,s),v(t,i),v(i,a),v(i,C),v(i,S),v(S,A),v(A,T),v(T,D),v(T,N),v(T,B),v(S,M),v(S,H),v(H,L),v(L,E),v(i,W),v(i,z),v(z,X),v(X,O),v(z,Y),v(z,q),v(z,K),v(z,G),v(G,V),v(V,ee),v(i,ae),v(i,le),v(t,ne),f(oe,t,null),v(t,ce),f(de,t,null),v(t,me),f(ge,t,null),pe=!0,ve||(fe=[x(a,"keyup",e[12]),x(E,"click",e[10].bind(this,"img")),x(O,"click",e[10].bind(this,"img")),x(ee,"click",e[11].bind(this,"drag"))],ve=!0)},p(e,t){(!pe||64&t[0]&&I!==(I=e[6][0]))&&m(a,"type",I),(!pe||3&t[0])&&g(a,"width",e[1]+", \r\n                height: "+e[0]+", \r\n                border: 1px solid #ccc"),(!pe||2&t[0])&&g(A,"width",e[1]),(!pe||2&t[0])&&g(H,"width",e[1]),(!pe||1&t[0])&&g(H,"height",e[0]),(!pe||128&t[0])&&g(H,"background-image","url('"+(te+e[7].bgImg)+"')"),(!pe||128&t[0]&&!u(q.src,j=te+e[7].bgImg))&&m(q,"src",j),(!pe||128&t[0])&&g(q,"height",e[7].imgheight),(!pe||128&t[0])&&g(q,"width",e[7].imgwidth),(!pe||128&t[0])&&g(q,"border",e[7].hotBorder),(!pe||128&t[0])&&g(q,"border-color",e[7].hotBorderColor),(!pe||128&t[0]&&J!==(J=e[7].alt))&&m(q,"alt",J),(!pe||32&t[0])&&g(G,"left",e[5]),(!pe||4&t[0])&&g(G,"top",e[2]),(!pe||8&t[0])&&g(G,"height",e[3]),(!pe||16&t[0])&&g(G,"width",e[4]),(!pe||2&t[0])&&g(z,"width",e[1]),(!pe||128&t[0]&&se!==(se=e[7].xml))&&(le.value=se);const i={};128&t[0]|262144&t[1]&&(i.$$scope={dirty:t,ctx:e}),!re&&128&t[0]&&(re=!0,i.visible=e[7].openImg,b((()=>re=!1))),oe.$set(i);const l={};262144&t[1]&&(l.$$scope={dirty:t,ctx:e}),!he&&128&t[0]&&(he=!0,l.visible=e[7].openDrag,b((()=>he=!1))),de.$set(l);const s={};128&t[0]|262144&t[1]&&(s.$$scope={dirty:t,ctx:e}),!ue&&128&t[0]&&(ue=!0,s.visible=e[7].snackback,b((()=>ue=!1))),ge.$set(s)},i(e){pe||(w(oe.$$.fragment,e),w(de.$$.fragment,e),w(ge.$$.fragment,e),pe=!0)},o(e){y(oe.$$.fragment,e),y(de.$$.fragment,e),y(ge.$$.fragment,e),pe=!1},d(e){e&&_(t),$(oe),$(de),$(ge),ve=!1,k(fe)}}}let te="//s3.amazonaws.com/jigyaasa_content_static/",ie="";function ae(e,t,i){let{xml:a}=t,{getChildXml:l}=t;const s=new q;let n=0,o="",r="",c="",h="",m="",g="",u="",p={},v=[],f=[],x="",b="";v[1]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textclick" top="10" left="20" width="30" height="50">\x3c!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--\x3e</div></smxml>',v[2]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textselect" top="10" left="20" width="30" height="50">\x3c!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--\x3e</div></smxml>',v[3]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="imagehighlight" top="10" left="20" width="30" height="50">\x3c!--[CDATA[]]--\x3e</div></smxml>',v[4]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="hotspot" top="172" left="220" width="112" height="80">\x3c!--[CDATA[]]--\x3e</div></smxml>',f[1]="textclick",f[2]="textselect",f[3]="imagehighlight",f[4]="hotspot",f.textclick="1",f.textselect="2",f.imagehighlight="3",f.hotspot="4";let w={};T({xml:"",openImg:!1,openDrag:!1,bgImg:"",snackback:!1,valueMultiple:"1",cdata:"",bgImgWidth:"600px",bgImgHeight:"360px",alt:"",imgheight:"",imgwidth:"",hotBorder:"",hotBorderColor:"",lineColor:"",image_url:""}).subscribe((e=>{i(7,w=e)}));function y(){let e=tinyMCE.activeEditor.selection.getContent({format:"raw"});e=e.replace(e,'<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">'+e+"</span>"),tinyMCE.activeEditor.selection.setContent(e),M()}function _(e){let t=e.getAttribute("id"),i=[];"SMXML"==e.nodeName&&(t="imagehighlight"==e.children[0].getAttribute("type")?"hptdraw":"hptmain"),Array.prototype.forEach.call(e.attributes,((e,t)=>{i[t]={name:e.name,value:e.value}})),0==e.children.length&&""!=e.textContent.trim()&&(i[i.length]={name:"value",value:e.textContent.trim()}),void 0!==t&&(C.select("#"+t).dataset.attributes=JSON.stringify(i)),e.children.length>0&&Array.prototype.forEach.call(e.children,(e=>{_(e)}))}function $(){let e=[],t=[];_(C.parseHtml(w.xml));new A({onDragEnd:(e,t)=>{i(7,w.xml=s.updateElem("div",e,t.getAttribute("id"),t,w.xml),w),l(w.xml)}});C.listen("#hptmain","click",".drag-resize",(function(e){C.selectAll("#hptmain .elemActive","removeClass","elemActive"),C.select(e,"addClass","elemActive").focus()})),C.bind("#hptmain .drag-resize","mouseenter",(e=>{let t=e.target;C.find(t,".tools",{action:"show",actionData:"block"})})),C.bind("#hptmain .drag-resize","mouseleave",(e=>{let t=e.target;C.find(t,".tools",{action:"hide"})})),x=C.find("#mainContent","#hptdraw").clientWidth,b=C.find("#mainContent","#hptdraw").clientHeight;let r=new O({target:C.find("#mainContent","#hptdraw"),width:x,height:b,correctans:"",cssClass:"drawSurface",penSize:4,type:"imagehighlight",editable:!0,onMove(){},onClick(){},onPaint(i){e.push(i.X),t.push(i.Y)},onRelease(i){C.select("#special_module_user_xml").value="";let a=C.find("#mainContent","#hptdraw canvas").getAttribute("correctans");""!=a?(a=Object.keys(JSON.parse(a)).length,k(e,t,a)):k(e,t,n),e=[],t=[]}}),c=r.lineColor(window.color);if(C.siblings(C.find("#mainContent","#hptdraw")).find((e=>{let t=C.find(e,"div").getAttribute("id");return C.bind("#"+t,"click",(function(e){r.clearSurface(),o="{}",n=0,C.find("#mainContent","#hptdraw canvas",{action:"attr",actionData:{correctans:o}}),B()})),t})),"imagehighlight"==C.parseHtml(a).children[0].getAttribute("type")){var d=w.xml;""!=(d=d.substring(d.indexOf("{"),d.lastIndexOf("}")+1))&&(d=JSON.parse(d)),setTimeout((function(){s.drawOnCanvasAuth(C.find("#mainContent","#hptdraw canvas").getAttribute("id"),d,c)}),2e3)}window.surface=r}function k(e,t,i){0==i?o='{"'+ ++i+'":{"x":['+e+'],"y":['+t+"]}}":(o=C.find("#mainContent","#hptdraw canvas").getAttribute("correctans"),o=o.slice(0,-1),o+=',"'+ ++i+'":{"x":['+e+'],"y":['+t+"]}}"),C.find("#mainContent","#hptdraw canvas",{action:"attr",actionData:{correctans:o}}),B()}function N(e){if("img"==e){i(7,w.bgImg=C.select("#backgroundImage").value,w),i(7,w.alt=C.select("#imgAlt").value,w),i(7,w.imgheight=C.select("#imgHeight").value,w),i(7,w.imgwidth=C.select("#imgWidth").value,w),i(7,w.hotBorder=C.select("#hotBorder").value,w),i(7,w.hotBorderColor=C.select("#hotBorderColor").value,w),globalThis.sda=C.selectAll("#backgroundImage, #imgAlt, #imgHeight, #imgWidth, #hotBorder, #hotBorderColor"),i(7,w.xml=w.xml.replace(/alt="(.*?)"/gim,`alt="${w.alt.replace(/"/g,"&quot;")}"`),w),i(7,w.xml=w.xml.replace(/bgimg="(.*?)"/gim,`bgimg="${w.bgImg}"`),w),i(7,w.xml=w.xml.replace(/imgheight="(.*?)"/gim,`imgheight="${w.imgheight}"`),w),i(7,w.xml=w.xml.replace(/imgwidth="(.*?)"/gim,`imgwidth="${w.imgwidth}"`),w);let e=S(w.xml);e.smxml.div._border=w.hotBorder,e.smxml.div._bordercolor=w.hotBorderColor,e.smxml.div._linecolor=window.color;let t=new Image;t.onload=function(){i(0,r=this.height+"px"),i(1,c=this.width+"px"),C.select("#hptmain","css",{height:r,width:c}),"imagehighlight"==e.smxml.div._type&&(e.smxml._width=this.width,e.smxml._height=this.height,C.find("#hptdraw","canvas",{action:"attr",actionData:{height:this.height,width:this.width}}),C.selectAll("#previewSection .reset, #authoringLoadComponent .reset").forEach((e=>{e.click()}))),i(7,w.xml=W(e),w),l(w.xml)},t.src=te+w.bgImg,i(7,w.openImg=!1,w)}else{if(function(){let e=C.select("#dragHeight").value,t=parseInt(e),i=C.select("#dragWidth").value,a=parseInt(i),l=C.select("#dragTop").value,s=parseInt(l),n=C.select("#dragLeft").value,o=parseInt(n),d=parseInt(r),h=parseInt(c);return isNaN(Number(e))||isNaN(t)?(C.showmsg("Only numeric value accepted."),C.select("#dragHeight").focus(),!1):t>parseInt(d/2)||t<32?(C.showmsg("Height must be greater than or equal to 32 and less than or equal to "+parseInt(d/2)),C.select("#dragHeight").focus(),!1):isNaN(Number(i))||isNaN(a)?(C.showmsg("Only numeric value accepted."),C.select("#dragWidth").focus(),!1):a>parseInt(h/2)||a<32?(C.showmsg("Width must be greater than or equal to 32 and less than or equal to "+parseInt(h/2)),C.select("#dragWidth").focus(),!1):isNaN(Number(l))||isNaN(s)?(C.showmsg("Only numeric value accepted."),C.select("#dragTop").focus(),!1):s>d-t||s<0?(C.showmsg("Top value must be greater than or equal to 0 and less than or equal to "+(d-t)),C.select("#dragTop").focus(),!1):isNaN(Number(n))||isNaN(o)?(C.showmsg("Only numeric value accepted."),C.select("#dragLeft").focus(),!1):!(o>h-a||o<0)||(C.showmsg("Left value must be greater than or equal to 0 and less than or equal to "+(h-a)),C.select("#dragLeft").focus(),!1)}()){var t=S(w.xml);i(3,m=t.smxml.div._height=parseInt(C.select("#dragHeight").value)),i(4,g=t.smxml.div._width=parseInt(C.select("#dragWidth").value)),i(2,h=t.smxml.div._top=parseInt(C.select("#dragTop").value)),i(5,u=t.smxml.div._left=parseInt(C.select("#dragLeft").value)),i(7,w.openDrag=!1,w),i(3,m+="px"),i(4,g+="px"),i(2,h+="px"),i(5,u+="px"),l(W(t)),i(7,w.xml=W(t),w)}}}function B(){var e=C.parseHtml(w.xml);"imagehighlight"==e.querySelector("div")?.getAttribute("type")&&(e.querySelector("div").innerHTML="<![CDATA["+C.find("#mainContent","#hptdraw canvas").getAttribute("correctans")+"]]>");var t=w.xml;if(t){var a=w.xml.replace(t,formatXml(e.xml?e.xml:(new XMLSerializer).serializeToString(e)));i(7,w.xml=a.toString(),w),l(w.xml)}}function M(){var e=[],t="",a=tinyMCE.activeEditor.getContent({format:"raw"});if(e=a.match(/<span data-type="select"(.*?)>(.*?)<\/span>/gi))for(var s=0;s<e.length;s++)t=e[s].replace(/<span data-type="select"(.*?)>|<\/span>/gm,""),a=a.replace(e[s],"%{"+t+"}%");var n=w.xml.match(/<!--\[CDATA\[(.*?)\]\]-->/gm);if(n){var o=n.toString().replace("\x3c!--[CDATA[","").replace("]]--\x3e","");o=w.xml.replace(n,"\x3c!--[CDATA["+a+"]]--\x3e"),i(7,w.xml=o.toString(),w),l(o.toString())}}function H(e,t,a,s,n){console.log("setps");let o=C.select("#ID0");if(o){let r=o.getBoundingClientRect(),c=o.getAttribute("id"),d=C.parseHtml(w.xml),h=d.querySelector('[id="'+c+'"]');if(void 0!==n&&n)confirm("Do you want to delete it?")&&(o.remove(),h.remove());else if(o.offsetWidth>0&&o.offsetHeight>0){e=o.clientWidth+e,t=o.clientHeight+t,a=r.top+a,s=r.left+s,C.select(o,"css",{width:e+"px",height:t+"px",top:a+"px",left:s+"px"});let i=C.select('[id="'+c+'"]').dataset.attributes;JSON.stringify(i).forEach(((e,t)=>{switch(e.name){case"width":e.value=parseInt(o.clientWidth),h.setAttribute("width",e.value);break;case"height":e.value=parseInt(o.clientHeight),h.setAttribute("height",e.value);break;case"top":e.value=parseInt(r.top),h.setAttribute("top",e.value);break;case"left":e.value=parseInt(r.left),h.setAttribute("left",e.value)}})),C.select('[id="'+c+'"]').dataset.attributes=i}C.select("#special_module_xml").value=d.xml?d.xml:(new XMLSerializer).serializeToString(d[0]),i(7,w.xml=d.xml?d.xml:(new XMLSerializer).serializeToString(d[0]),w),l(d.xml?d.xml:(new XMLSerializer).serializeToString(d[0]))}}I((()=>{C.createLink(window.itemUrl+"clsSMHotspot/css/hotspot.min.css",{preload:!0}),function(){i(7,w.xml=a,w);let e=S(a);if(e)switch(e.smxml.div._type=e.smxml.div._type?e.smxml.div._type:"hotspot",i(7,w.valueMultiple=f[e.smxml.div._type],w),f[e.smxml.div._type]){case"1":case"2":t=e,i(7,w.cdata=t.smxml.div.__cdata,w),i(0,r=t.smxml._height+"px"),i(1,c=t.smxml._width+"px"),C.select("#text0","show"),C.selectAll(".drawImage,#hptmain","hide"),C.find(document,"canvas").remove(),function(e){e=e.replace(/%{/gm,'<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">').replace(/}%/gm,"</span>"),C.find("#mainContent",".tinymce-editor-response").innerHTML=e}(t.smxml.div.__cdata);break;case"3":!function(e){i(7,w.bgImg=e.smxml._bgimg,w);let t=new Image;t.onload=function(){i(0,r=e.smxml._height>this.height?e.smxml._height+"px":this.height+"px"),i(1,c=e.smxml._width>this.width?e.smxml._width+"px":this.width+"px"),C.find("#previewSection",".reset").click(),C.find("#mainContent","#hptdraw canvas",{action:"attr",actionData:{height:r,width:c,correctans:e.smxml.div.__cdata}}),B()},t.src=te+e.smxml._bgimg,i(7,w.bgImg=e.smxml._bgimg,w),C.selectAll(".drawImage","toggleClass","d-none"),C.selectAll("#text0,#hptmain","hide"),$()}(e);break;case"4":!function(e){i(7,w.hotBorder=e.smxml.div._border,w),i(7,w.hotBorderColor=e.smxml.div._bordercolor,w),i(7,w.bgImg=e.smxml._bgimg,w),i(0,r=e.smxml._height+"px"),i(7,w.alt=e.smxml._alt,w),i(1,c=e.smxml._width+"px"),i(4,g=e.smxml.div._width+"px"),i(3,m=e.smxml.div._height+"px"),i(5,u=e.smxml.div._left+"px"),i(2,h=e.smxml.div._top+"px");let t=new Image;t.src=te+e.smxml._bgimg,t.onload=function(){i(0,r=this.height+"px"),i(1,c=this.width+"px"),b=e.smxml.div._imgheight?e.smxml.div._imgheight+"px":"auto !important",x=e.smxml.div._imgwidth?e.smxml.div._imgwidth+"px":"auto !important",i(7,w.imgwidth=x,w),i(7,w.imgheight=b,w),C.select("#hptmain","css",{height:r,width:c})},C.select("#hptmain","toggleClass","d-none"),C.selectAll(".drawImage,#text0","hide"),C.find(document,"canvas",{action:"remove"}),$()}(e),C.bind(document,"keydown",(e=>{if(e.ctrlKey&&e.shiftKey)switch(e.keyCode.toString()){case"37":H(-10,0,0,0);break;case"38":H(0,-10,0,0);break;case"39":H(10,0,0,0);break;case"40":H(0,10,0,0)}else if(e.shiftKey)switch(e.keyCode.toString()){case"37":H(-1,0,0,0);break;case"38":H(0,-1,0,0);break;case"39":H(1,0,0,0);break;case"40":H(0,1,0,0)}else if(e.ctrlKey)switch(e.keyCode.toString()){case"37":H(0,0,0,-10);break;case"38":H(0,0,-10,0);break;case"39":H(0,0,0,10);break;case"40":H(0,0,10,0)}else switch(e.keyCode.toString()){case"27":C.selectAll(".dragable-container .ui-draggable","removeClass","elemActive");break;case"38":e.preventDefault(),H(0,0,-1,0);break;case"40":e.preventDefault(),H(0,0,1,0)}}))}var t;tinyMCE.PluginManager.add("res",(function(e){e.addMenuItem("resp",{text:"Add Token",id:"addToken",onclick(){y()},context:"insert",prependToContext:!0})})),tinymce.init({selector:".tinymce-editor-response",inline:!0,theme:"modern",min_width:100,resize:!0,menubar:!1,toolbar:!1,elementpath:!1,statusbar:!1,force_br_newlines:!0,remove_trailing_brs:!0,forced_root_block:!1,paste_as_text:!0,extended_valid_elements:"span[onClick|contentEditable]",valid_elements:"*[*]",extended_valid_elements:"uc:syntax,uc:ref",custom_elements:"uc:syntax,~uc:ref",plugins:["res contextmenu paste"],contextmenu:"link resp"}),C.listen(document,"mousedown",".draggable",M),p={},C.listen(document,"touchstart",".tinymce-editor-response",(()=>{p.s=(new Date).getTime()})),C.listen(document,"touchend",".tinymce-editor-response",(()=>{p.e=(new Date).getTime()-p.s,p.e/1e3>1&&(y(),p={})})),C.listen(document,"click","#upload_media",(()=>{window.setImage("backgroundImage")})),C.bind(document,"click",(()=>{i(7,w.image_url=te+""+C.select("#backgroundImage").value,w)}))}()}));return e.$$set=e=>{"xml"in e&&i(14,a=e.xml),"getChildXml"in e&&i(15,l=e.getChildXml)},[r,c,h,m,g,u,f,w,function(e){let t=S(w.xml),a=e,l=!0,s=!0,n=!1;if("imagehighlight"==t.smxml.div._type){let e=new Image;e.onload=function(){n?(i(0,r=t.smxml._height+"px"),i(1,c=t.smxml._width+"px")):(i(0,r=this.height+"px"),i(1,c=this.width+"px")),this.width>=100&&this.width<=1e3?(l=!0,this.height>=80&&this.height<=550?s=!0:(C.alert(d.height_warning),s=!1)):(C.alert(d.width_warning),l=!1),s&&l?n?i(7,w.openImg=!0,w):N(a):(console.log("Default Image set"),i(7,w.openImg=!0,w),e.src=te+t.smxml._bgimg,C.selectAll("#backgroundImage").value=t.smxml._bgimg,n=!0)},e.src=te+C.select("#backgroundImage").value}else N(a)},function(){i(7,w.openDrag=!1,w),i(7,w.openImg=!1,w)},function(){C.select("#backgroundImage").value=w.bgImg,i(7,w.image_url=te+""+w.bgImg,w),C.select(C.select("#backgroundImage").previousElementSibling,"css",{transform:"scale(0.75) translate(0px, -28px)",color:"rgb(0, 188, 212)"}),w.hotBorder&&(C.select("#hotBorder").value=w.hotBorder,C.select(C.select("#hotBorder").previousElementSibling,"css",{transform:"scale(0.75) translate(0px, -28px)",color:"rgb(0, 188, 212)"})),w.hotBorderColor&&(C.select("#hotBorderColor").value=w.hotBorderColor,C.select(C.select("#hotBorderColor").previousElementSibling,"css",{transform:"scale(0.75) translate(0px, -28px)",color:"rgb(0, 188, 212)"})),i(7,w.openImg=!0,w)},function(){i(7,w.openDrag=!0,w);var e=setTimeout((function(){C.select("#dragHeight").value=parseInt(C.select("#ID0").style.height),C.select("#dragWidth").value=parseInt(C.select("#ID0").style.width),C.select("#dragTop").value=parseInt(C.select("#ID0").style.top),C.select("#dragLeft").value=parseInt(C.select("#ID0").style.left),clearTimeout(e)}),300)},M,function(e){i(7,w.lineColor=e.target.value,w),window.color=w.lineColor},a,l,function(){w.alt=this.value,i(7,w)},function(){w.hotBorder=D(this),i(7,w)},function(){w.hotBorderColor=D(this),i(7,w)},function(){w.lineColor=D(this),i(7,w)},function(t){e.$$.not_equal(w.openImg,t)&&(w.openImg=t,i(7,w))},function(t){e.$$.not_equal(w.openDrag,t)&&(w.openDrag=t,i(7,w))},()=>i(7,w.snackback=!1,w),function(t){e.$$.not_equal(w.snackback,t)&&(w.snackback=t,i(7,w))}]}export default class extends t{constructor(e){super(),i(this,e,ae,ee,a,{xml:14,getChildXml:15},null,[-1,-1])}}
//# sourceMappingURL=Hotspot-1dc3a3a8.js.map
