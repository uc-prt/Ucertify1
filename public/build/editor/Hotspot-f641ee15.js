import{G as e,S as t,i,s,F as n,e as a,j as l,H as o,I as r,K as c,L as d,b as h,C as m,c as u,f as g,g as p,h as v,m as f,l as x,M as b,N as w,O as y,t as _,a as $,o as k,d as I,y as C,p as S,A,X as T,P as D,w as L,Q as N,R as E,u as B,T as H,U as M,V as z,r as X,J as W}from"./main-cceb51cb.js";function O(e,t){return!0===isNaN(Number(e))?this.x=0:this.x=e,!0===isNaN(Number(t))?this.y=0:this.y=t,{X:this.x,Y:this.y}}const Y=new e;class q{constructor(e){this.prevPoint=void 0,this.defaultOptions={target:"",penSize:1,width:e.width,height:e.height,cssClass:"",onClick:e=>{},onMove:e=>{},onPaint:e=>{},onRelease:e=>{}},this.penWidth=2,this.drawing=!1,this.cap="round",this.ID="dooScribCanvas"+Math.floor(100*Math.random()+1),this.drawingSurface="",e&&(this.Settings={...this.defaultOptions,...e}),!0===isNaN(this.Settings.height)&&(this.Settings.height=100),!0===isNaN(this.Settings.width)&&(this.Settings.width=100),this.init()}init(){let e=this.Settings.target;e?("hptmain0"==e.getAttribute("id")&&Y.empty(e),Y.insert(e,`<canvas id='${this.ID}' tabindex='0' class='relative ${this.Settings.cssClass}' type='${this.Settings.type}' correctans='${this.Settings.correctans}' userans=''  height='${this.Settings.height}' width='${this.Settings.width}'></canvas>`,"beforeend"),this.penSize(this.Settings.penSize),this.drawingSurface=document.getElementById(this.ID).getContext("2d"),this.drawingSurface.lineWidth=this.penSize(),this.drawingSurface.lineCap=this.cap,!1===this.hasTouch()?(document.getElementById(this.ID).addEventListener("mousedown",this.clickDown.bind(this),!0),document.getElementById(this.ID).addEventListener("mousemove",this.moved.bind(this),!0),document.getElementById(this.ID).addEventListener("mouseup",this.clickUp.bind(this),!0)):(document.getElementById(this.ID).addEventListener("touchstart",this.clickDown.bind(this),!0),document.getElementById(this.ID).addEventListener("touchmove",this.moved.bind(this),!0),document.getElementById(this.ID).addEventListener("touchend",this.clickUp.bind(this),!0))):console.error("Target not defined")}normalizeTouch(e){if(!0===this.hasTouch()){let t=window.scrollY;["touchstart","touchmove"].indexOf(e.type)>-1&&(e.clientX=e.targetTouches[0].pageX,e.clientY=e.targetTouches[0].pageY-t),["touchend"].indexOf(e.type)>-1&&(e.clientX=e.changedTouches[0].pageX,e.clientY=e.changedTouches[0].pageY-t)}return e}clickDown(e){if(!0===this.isDrawing())return;e||(e=window.event),!0===this.hasTouch()&&(e.preventDefault(),e=this.normalizeTouch(e));let t=Y.offset(this.Settings.target),i=window.scrollY,s=new O(e.clientX-t.left,e.clientY-(t.top-i));return this.prevPoint=s,this.drawing=!0,this.Settings.onClick(s),!1}moved(e){e||(e=window.event),!0===this.hasTouch()&&(e.preventDefault(),e=this.normalizeTouch(e));var t=Y.offset(this.Settings.target),i=window.scrollY,s=new O(e.clientX-t.left,e.clientY-(t.top-i));return!0===this.isDrawing()?(this.drawLine(this.prevPoint.X,this.prevPoint.Y,s.X,s.Y),this.prevPoint=s,this.Settings.onPaint(s)):this.Settings.onMove(s),!1}clickUp(e){if(!1===this.isDrawing())return;!0===this.hasTouch()&&(e.preventDefault(),e=this.normalizeTouch(e));let t=Y.offset(this.Settings.target),i=window.scrollY,s=new O(e.clientX-t.left,e.clientY-(t.top-i));return this.Settings.onRelease(s),this.drawing=!1,!1}hasTouch(){return"ontouchstart"in window}penSize(e){return void 0!==e&&!1===isNaN(Number(e))&&(this.penWidth=e),this.penWidth}isDrawing(){if(this.Settings.editable)return this.drawing}lineCap(e){if(void 0!==e)switch(e){case"butt":case"round":case"square":this.cap=e}return this.cap}lineColor(e){if(void 0!==e){let t=Y.parseHtml("<div id='stub' style='backgroundColor:white'></div>");t.style.backgroundColor=e;let i=t.style.backgroundColor;void 0!==i&&""!==i&&(window.color=e)}return window.color}context(){return this.drawingSurface}clearSurface(){let e=Y.find(document,"canvas").getAttribute("width").replace("px",""),t=Y.find(document,"canvas").getAttribute("height").replace("px","");this.drawingSurface.clearRect(0,0,e,t)}drawLine(e,t,i,s){void 0!==e&&void 0!==t&&void 0!==i&&void 0!==s&&!1===isNaN(Number(e))&&!1===isNaN(Number(t))&&!1===isNaN(Number(i))&&!1===isNaN(Number(s))&&(this.drawingSurface.lineCap=this.cap,this.drawingSurface.strokeStyle=window.color,this.drawingSurface.lineWidth=this.penWidth,this.drawingSurface.beginPath(),this.drawingSurface.moveTo(e,t),this.drawingSurface.lineTo(i,s),this.drawingSurface.stroke())}}const P=new e;class j{constructor(){this.count=0,this.drawstr=""}updateElem(e,t,i,s,n){let a,l,o,r,c,d=P.serializeArray(P.find("#authoring-modal",".h","visible"),"input"),h="",m=[],u=P.select("#im").getBoundingClientRect();if(void 0!==s){if(d=JSON.parse(P.select("#"+i).dataset.attributes),!d){let e=[];e[0]={name:"id",value:i},e[1]={name:"type",value:"hotspot"},e[2]={name:"top",value:parseInt(P.select("#"+i).style.top.split("px")[0])},e[3]={name:"left",value:parseInt(P.select("#"+i).style.left.split("px")[0])},e[4]={name:"width",value:parseInt(P.select("#"+i).style.width.split("px")[0])},e[5]={name:"height",value:parseInt(P.select("#"+i).style.height.split("px")[0])},d=e}d.forEach(((e,i,n)=>{switch(e.name){case"width":e.value=s.clientWidth;break;case"height":e.value=s.clientHeight;break;case"top":e.value=+e.value+t.offsetY-s.clientHeight/2,e.value<0&&(e.value=0),e.value+s.clientHeight>u.height&&(e.value=u.height-s.clientHeight);break;case"left":e.value=+e.value+t.offsetX-s.clientWidth/2,e.value<0&&(e.value=0),e.value+s.clientWidth>u.width&&(e.value=u.width-s.clientWidth)}n[i]=e}))}switch(d.forEach(((e,t)=>{"width"==e.name&&(a=e.value),"height"==e.name&&(l=e.value),"top"==e.name&&(o=e.value),"left"==e.name&&(r=e.value),"bgimg"==e.name&&""!=e.value.trim()&&(h=P.select("#hptmain").getAttribute("path")+e.value.trim()),m[e.name]=e.name})),e){case"div":c=`[id="${i}"]`,P.select(`[id="${i}"]`,"css",{width:a+"px",height:l+"px",top:o+"px",left:r+"px"}).dataset.attributes=JSON.stringify(d);break;case"base":c="hptmain",P.select("#hptmain").dataset.attributes=JSON.stringify(d)}if("base"==e){let e="hptmain"==i?"#hptmain":"#hptdraw";if(""!=h){let t=new Image;t.src=h;let s=t.src.substr(t.src.lastIndexOf(".")+1);setTimeout((()=>{t.width=t.width>0?t.width:"600",t.height=t.height>0?t.height:"250",P.select("#option-toolbar","css",{width:t.width}),"gif"!=s&&(P.selectAll(e+">img").length>0?(P.select(e,"css",{width:t.width,height:t.height}),P.selectAll(e+">img","attr",{src:h})):"hptdraw"==i?(P.find(e,"canvas",{action:"attr",actionData:{width:t.width,height:t.height}}),P.selectAll(P.siblings(e),"css",{width:t.width}),P.select(e,"css",{width:t.width,height:t.height,backgroundImage:"url("+h+")"})):P.insert(P.select(e,"css",{width:t.width,height:t.height}),'<img src="'+h+'" />',"beforebegin"))}),100)}else P.selectAll(e+">img").length>0&&(P.select(e,"css",{width:"600px",height:"250px"}),P.select(e+">img","remove"))}return"div"==e?this.updateXML(e,c,d,o,r,n):"gif"!=img_ext&&"undefined"!=typeof img?this.updateXML(e,c,d,img.width,img.height,n):void P.alert("Please Do not use Gif Image!!!")}drawOnCanvasAuth(e,t,i){let s=document.getElementById(e).getContext("2d"),n=Object.keys(t).length;if(""!=t)for(let e=1;e<=n;e++)for(let i=0;i<=t[e].x.length;i++)s.beginPath(),s.lineWidth="4",s.strokeStyle=window.color,s.moveTo(t[e].x[i],t[e].y[i]),s.lineTo(t[e].x[i+1],t[e].y[i+1]),s.stroke()}updateXML(e,t,i,s,n,a){let l,o=P.parseHtml(a);if(l="hptmain"==t?o:P.find(o,t),s>0&&n>0&&(l.setAttribute("width",s),l.setAttribute("height",n)),i)for(let e of i)""!==e.value?(l.setAttribute(e.name,e.value),"type"==e.name&&l.setAttribute(e.value,"hotspot")):l.removeAttribute(e.name);return formatXml(o.outerHTML)}}const{document:J}=n;function R(e){let t,i=m.cancel+"";return{c(){t=B(i)},m(e,i){v(e,t,i)},p:X,d(e){e&&k(t)}}}function U(e){let t,i=m.submit+"";return{c(){t=B(i)},m(e,i){v(e,t,i)},p:X,d(e){e&&k(t)}}}function K(e){let t,i,s,n,o;return i=new E({props:{unelevated:!0,outlined:!0,class:"text-capitalize",color:"#ccc",$$slots:{default:[R]},$$scope:{ctx:e}}}),i.$on("click",e[12]),n=new E({props:{class:"bg-primary text-white",style:"text-transform: none",key:m.submit,$$slots:{default:[U]},$$scope:{ctx:e}}}),n.$on("click",e[11].bind(this,"img")),{c(){t=a("div"),u(i.$$.fragment),s=h(),u(n.$$.fragment),g(t,"slot","footer"),g(t,"class","svelteFooter")},m(e,a){v(e,t,a),f(i,t,null),l(t,s),f(n,t,null),o=!0},p(e,t){const s={};2&t[2]&&(s.$$scope={dirty:t,ctx:e}),i.$set(s);const a={};2&t[2]&&(a.$$scope={dirty:t,ctx:e}),n.$set(a)},i(e){o||(_(i.$$.fragment,e),_(n.$$.fragment,e),o=!0)},o(e){$(i.$$.fragment,e),$(n.$$.fragment,e),o=!1},d(e){e&&k(t),I(i),I(n)}}}function F(e){let t,i,s,n,o,r,c,d,m,u,f,b,w,y,_,$,I,S,A,T,D,L,N,E,W,O,Y,q,P,j,J,R,U,K,F,G,Q,V,Z,ee,te,ie,se,ne,ae,le,oe,re,ce,de,he,me,ue,ge,pe,ve,fe;return{c(){t=a("h4"),t.innerHTML='<div class="d-flex justify-content-between"><div>Image</div></div>',i=h(),s=a("div"),n=a("div"),o=a("input"),c=h(),d=a("button"),d.textContent="Upload image",m=h(),u=a("div"),f=a("img"),w=h(),y=a("span"),_=a("label"),$=B("Image Alt"),S=h(),A=a("input"),D=h(),L=a("div"),N=a("div"),E=a("span"),E.innerHTML='<label for="hotBorder" class="my-1 text-dark">Border width</label>',W=h(),O=a("select"),Y=a("option"),Y.textContent="None",q=a("option"),q.textContent="1",P=a("option"),P.textContent="2",j=a("option"),j.textContent="3",J=a("option"),J.textContent="4",R=a("option"),R.textContent="5",K=h(),F=a("div"),G=a("span"),G.innerHTML='<label for="hotBorderColor" class="my-1 text-dark">Border color</label>',Q=h(),V=a("select"),Z=a("option"),Z.textContent="None",ee=a("option"),ee.textContent="Black",te=a("option"),te.textContent="Grey",se=h(),ne=a("br"),ae=h(),le=a("div"),oe=a("span"),oe.innerHTML='<label for="setLineColor" class="mt-2 text-dark">Draw line color</label>',re=h(),ce=a("select"),de=a("option"),de.textContent="Please Select",he=a("option"),he.textContent="Red",me=a("option"),me.textContent="Black",ue=a("option"),ue.textContent="Blue",pe=h(),g(t,"class","mt-1 font21 mb-4"),g(o,"type","text"),g(o,"id","backgroundImage"),o.disabled="true",o.value=r=e[7].bgImg,g(o,"margin","normal"),p(o,"pointer-events","none"),p(o,"width","76%"),g(o,"class","form-control mr-2"),g(d,"id","upload_media"),g(d,"type","button"),d.value="Upload Media",g(d,"margin","normal"),g(d,"class","btn btn-outline-primary position-relative"),g(n,"class","d-flex"),f.src!==(b=e[7].image_url)&&g(f,"src",b),g(f,"alt","background"),g(f,"class","img img-responsive span7"),g(u,"class","mx-auto width8 p-2 border mt-2"),g(_,"for","imgAlt"),g(_,"class",I=4==e[7].valueMultiple?"my-1 text-dark":"hidden"),g(A,"type","text"),g(A,"id","imgAlt"),g(A,"placeholder","Alt text"),g(A,"class",T=4==e[7].valueMultiple?" form-control mt-0":"hidden form-control mt-0"),g(A,"margin","normal"),p(A,"width","-webkit-fill-available"),Y.__value="0",Y.value=Y.__value,q.__value="1",q.value=q.__value,P.__value="2",P.value=P.__value,j.__value="3",j.value=j.__value,J.__value="4",J.value=J.__value,R.__value="5",R.value=R.__value,g(O,"id","hotBorder"),g(O,"class","form-select"),void 0===e[7].hotBorder&&H((()=>e[28].call(O))),g(N,"class",U=4==e[7].valueMultiple?"d-inline-block pr-2 mt-2 w-sm":"hidden"),Z.__value="white",Z.value=Z.__value,ee.__value="black",ee.value=ee.__value,te.__value="grey",te.value=te.__value,g(V,"id","hotBorderColor"),g(V,"class","form-select"),void 0===e[7].hotBorderColor&&H((()=>e[29].call(V))),g(F,"class",ie=4==e[7].valueMultiple?"d-inline-block mt-2 w-sm":"hidden"),g(L,"class","d-flex"),de.__value="Please Select",de.value=de.__value,he.__value="red",he.value=he.__value,me.__value="black",me.value=me.__value,ue.__value="blue",ue.value=ue.__value,g(ce,"id","setLineColor"),g(ce,"class","form-select"),void 0===e[7].lineColor&&H((()=>e[30].call(ce))),g(le,"class",ge=3==e[7].valueMultiple?"":"hidden"),p(s,"overflow-y","auto"),p(s,"padding-right","20px")},m(a,r){v(a,t,r),v(a,i,r),v(a,s,r),l(s,n),l(n,o),l(n,c),l(n,d),l(s,m),l(s,u),l(u,f),l(s,w),l(s,y),l(y,_),l(_,$),l(s,S),l(s,A),M(A,e[7].alt),l(s,D),l(s,L),l(L,N),l(N,E),l(N,W),l(N,O),l(O,Y),l(O,q),l(O,P),l(O,j),l(O,J),l(O,R),z(O,e[7].hotBorder),l(L,K),l(L,F),l(F,G),l(F,Q),l(F,V),l(V,Z),l(V,ee),l(V,te),z(V,e[7].hotBorderColor),l(s,se),l(s,ne),l(s,ae),l(s,le),l(le,oe),l(le,re),l(le,ce),l(ce,de),l(ce,he),l(ce,me),l(ce,ue),z(ce,e[7].lineColor),v(a,pe,r),ve||(fe=[x(A,"input",e[27]),x(O,"change",e[28]),x(V,"change",e[29]),x(ce,"change",e[30]),x(ce,"blur",e[16].bind(this))],ve=!0)},p(e,t){o.value=r,g(f,"src",b),g(_,"class",I),g(A,"class",T),128&t[0]&&A.value!==e[7].alt&&M(A,e[7].alt),128&t[0]&&z(O,e[7].hotBorder),g(N,"class",U),128&t[0]&&z(V,e[7].hotBorderColor),g(F,"class",ie),128&t[0]&&z(ce,e[7].lineColor),g(le,"class",ge)},i:X,o:X,d(e){e&&k(t),e&&k(i),e&&k(s),e&&k(pe),ve=!1,C(fe)}}}function G(e){let t,i=m.cancel+"";return{c(){t=B(i)},m(e,i){v(e,t,i)},p:X,d(e){e&&k(t)}}}function Q(e){let t,i=m.done+"";return{c(){t=B(i)},m(e,i){v(e,t,i)},p:X,d(e){e&&k(t)}}}function V(e){let t,i,s,n,o;return i=new E({props:{unelevated:!0,outlined:!0,class:"text-capitalize",color:"#ccc",$$slots:{default:[G]},$$scope:{ctx:e}}}),i.$on("click",e[12]),n=new E({props:{class:"bg-primary text-white",style:"text-transform: none",key:m.done,$$slots:{default:[Q]},$$scope:{ctx:e}}}),n.$on("click",e[11].bind(this,"drag")),{c(){t=a("div"),u(i.$$.fragment),s=h(),u(n.$$.fragment),g(t,"slot","footer"),g(t,"class","svelteFooter")},m(e,a){v(e,t,a),f(i,t,null),l(t,s),f(n,t,null),o=!0},p(e,t){const s={};2&t[2]&&(s.$$scope={dirty:t,ctx:e}),i.$set(s);const a={};2&t[2]&&(a.$$scope={dirty:t,ctx:e}),n.$set(a)},i(e){o||(_(i.$$.fragment,e),_(n.$$.fragment,e),o=!0)},o(e){$(i.$$.fragment,e),$(n.$$.fragment,e),o=!1},d(e){e&&k(t),I(i),I(n)}}}function Z(e){let t,i,s,n;return{c(){t=a("h4"),t.innerHTML='<div class="d-flex justify-content-between"><div>Hotspot</div></div>',i=h(),s=a("div"),s.innerHTML='<div class="row"><div class="col-6 pr-1"><span><label for="dragHeight" class="my-1 text-dark">Height</label></span> \n                    <input type="number" id="dragHeight" placeholder="Height" defaultvalue=" " class="form-control"/></div> \n                <div class="col-6 pl-1"><span><label for="dragWidth" class="my-1 text-dark">Width</label></span> \n                    <input type="number" id="dragWidth" placeholder="Width" defaultvalue=" " class="form-control"/></div></div> \n            <div class="row mt-2"><div class="col-6 pr-1"><span><label for="dragTop" class="my-1 text-dark">Top</label></span> \n                    <input type="number" id="dragTop" placeholder="Top" defaultvalue=" " class="form-control"/></div> \n                <div class="col-6 pl-1"><span><label for="dragLeft" class="my-1 text-dark">Left</label></span> \n                    <input type="number" id="dragLeft" placeholder="Left" defaultvalue=" " class="form-control"/></div></div>',n=h(),g(t,"class","mt-1 font21 mb-4"),p(s,"overflow-y","auto"),p(s,"padding-right","20px")},m(e,a){v(e,t,a),v(e,i,a),v(e,s,a),v(e,n,a)},p:X,i:X,o:X,d(e){e&&k(t),e&&k(i),e&&k(s),e&&k(n)}}}function ee(e){let t;return{c(){t=B("Close")},m(e,i){v(e,t,i)},d(e){e&&k(t)}}}function te(e){let t,i,s;return i=new E({props:{color:"#ff0",$$slots:{default:[ee]},$$scope:{ctx:e}}}),i.$on("click",e[33]),{c(){t=a("span"),u(i.$$.fragment),g(t,"slot","action")},m(e,n){v(e,t,n),f(i,t,null),s=!0},p(e,t){const s={};2&t[2]&&(s.$$scope={dirty:t,ctx:e}),i.$set(s)},i(e){s||(_(i.$$.fragment,e),s=!0)},o(e){$(i.$$.fragment,e),s=!1},d(e){e&&k(t),I(i)}}}function ie(e){let t,i;return{c(){t=B(ae),i=h()},m(e,s){v(e,t,s),v(e,i,s)},p:X,i:X,o:X,d(e){e&&k(t),e&&k(i)}}}function se(e){let t,i,s,n,S,A,T,D,L,N,E,B,H,M,z,X,W,O,Y,q,P,j,J,R,U,G,Q,ee,se,ae,le,oe,re,ce,de,he,me,ue,ge,pe,ve,fe,xe,be,we,ye,_e,$e,ke;function Ie(t){e[31](t)}let Ce={class:"remove_right_margin",width:"600",style:"background: #fff; border-radius: 5px;",$$slots:{default:[F],footer:[K]},$$scope:{ctx:e}};function Se(t){e[32](t)}void 0!==e[7].openImg&&(Ce.visible=e[7].openImg),ge=new o({props:Ce}),r.push((()=>c(ge,"visible",Ie)));let Ae={class:"remove_right_margin",width:"600",style:"background: #fff; border-radius: 5px;",$$slots:{default:[Z],footer:[V]},$$scope:{ctx:e}};function Te(t){e[34](t)}void 0!==e[7].openDrag&&(Ae.visible=e[7].openDrag),fe=new o({props:Ae}),r.push((()=>c(fe,"visible",Se)));let De={bg:"#f44336",bottom:!0,timeout:10,style:"position:fixed; bottom:50px",$$slots:{default:[ie],action:[te]},$$scope:{ctx:e}};return void 0!==e[7].snackback&&(De.visible=e[7].snackback),we=new d({props:De}),r.push((()=>c(we,"visible",Te))),{c(){t=a("div"),i=a("center"),s=a("div"),S=h(),A=a("div"),T=a("div"),D=a("div"),L=a("span"),N=h(),E=a("span"),E.textContent=""+m.reset,B=h(),H=a("div"),M=a("div"),z=a("button"),z.innerHTML='<i class="icomoon-24px-edit-1"></i>',X=h(),W=a("div"),O=a("div"),Y=a("button"),Y.innerHTML='<i class="icomoon-24px-edit-1"></i>',q=h(),P=a("img"),R=h(),U=a("div"),G=a("div"),Q=a("button"),Q.innerHTML='<i class="icomoon-24px-edit-1"></i>',ee=h(),se=a("div"),ae=h(),le=a("div"),oe=h(),re=a("div"),de=h(),he=a("textarea"),ue=h(),u(ge.$$.fragment),ve=h(),u(fe.$$.fragment),be=h(),u(we.$$.fragment),g(s,"class","tinymce-editor-response"),g(s,"id","text0"),g(s,"type",n=e[6][0]),p(s,"width",e[1]+", \r\n                height: "+e[0]+", \r\n                border: 1px solid #ccc"),p(s,"outline","none"),p(s,"padding","10px"),p(s,"textAlign","left"),p(s,"display","none"),p(s,"overflowY","scroll\r\n            "),g(s,"contenteditable","true"),g(L,"class","icomoon-new-24px-reset-1 s3"),p(L,"vertical-align","text-top"),g(E,"class","position-relative bottom1"),g(D,"id","resetAuth"),g(D,"class","reset btn btn-outline-primary btn-sm height27 mt-sm2 mr-sm2 float-right"),p(D,"width","90px"),p(T,"width",e[1]),p(T,"height","32px"),p(T,"background","#d9e7fd"),p(T,"border-top","2px solid #96bbf6\r\n            "),g(z,"name","change_image"),g(z,"type","button"),g(z,"class","btn btn-light px-1 pt-sm1 pb-sm1 mt"),g(M,"class","btn-group tools"),g(H,"id","hptdraw"),p(H,"width",e[1]),p(H,"height",e[0]),p(H,"background-image","url('"+(ne+e[7].bgImg)+"')"),p(H,"background-repeat","no-repeat"),p(H,"position","relative"),p(H,"border","1px solid #e0e0e0"),g(A,"class","drawImage d-none"),g(Y,"type","button"),g(Y,"class","btn btn-light px-1 pt-sm1 pb-sm1 mt"),g(O,"class","btn-group tools"),g(P,"id","im"),g(P,"class","hotSpotImg border"),P.src!==(j=ne+e[7].bgImg)&&g(P,"src",j),p(P,"height",e[7].imgheight),p(P,"width",e[7].imgwidth),p(P,"border",e[7].hotBorder),p(P,"border-color",e[7].hotBorderColor),g(P,"alt",J=e[7].alt),g(Q,"type","button"),g(Q,"class","btn btn-light px-1 pt-sm1 pb-sm1"),g(G,"class","btn-group tools h"),g(se,"id","resizeX"),g(se,"class","svelte-dl6gty"),g(le,"id","resizeY"),g(le,"class","svelte-dl6gty"),g(re,"id","resizeXY"),g(re,"class","svelte-dl6gty"),g(U,"draggable",ce=!0),g(U,"class","drag-resize position-absolute"),g(U,"id","ID0"),p(U,"left",e[5]),p(U,"top",e[2]),p(U,"height",e[3]),p(U,"width",e[4]),g(W,"id","hptmain"),g(W,"path",ne),g(W,"class","d-none"),p(W,"position","relative"),p(W,"width",e[1]),g(he,"class","d-none"),g(he,"id","special_module_xml"),g(he,"name","special_module_xml"),he.value=me=e[7].xml,g(i,"class","mt"),g(i,"id","mainContent")},m(n,a){v(n,t,a),l(t,i),l(i,s),l(i,S),l(i,A),l(A,T),l(T,D),l(D,L),l(D,N),l(D,E),l(A,B),l(A,H),l(H,M),l(M,z),l(i,X),l(i,W),l(W,O),l(O,Y),l(W,q),l(W,P),l(W,R),l(W,U),l(U,G),l(G,Q),l(U,ee),l(U,se),e[24](se),l(U,ae),l(U,le),e[25](le),l(U,oe),l(U,re),e[26](re),l(i,de),l(i,he),l(t,ue),f(ge,t,null),l(t,ve),f(fe,t,null),l(t,be),f(we,t,null),_e=!0,$e||(ke=[x(s,"keyup",e[15]),x(z,"click",e[13].bind(this,"img")),x(Y,"click",e[13].bind(this,"img")),x(Q,"click",e[14].bind(this,"drag")),x(se,"mousedown",b(w(e[17]))),x(le,"mousedown",b(w(e[18]))),x(re,"mousedown",b(w(e[19])))],$e=!0)},p(e,t){(!_e||64&t[0]&&n!==(n=e[6][0]))&&g(s,"type",n),(!_e||3&t[0])&&p(s,"width",e[1]+", \r\n                height: "+e[0]+", \r\n                border: 1px solid #ccc"),(!_e||2&t[0])&&p(T,"width",e[1]),(!_e||2&t[0])&&p(H,"width",e[1]),(!_e||1&t[0])&&p(H,"height",e[0]),(!_e||128&t[0])&&p(H,"background-image","url('"+(ne+e[7].bgImg)+"')"),(!_e||128&t[0]&&P.src!==(j=ne+e[7].bgImg))&&g(P,"src",j),(!_e||128&t[0])&&p(P,"height",e[7].imgheight),(!_e||128&t[0])&&p(P,"width",e[7].imgwidth),(!_e||128&t[0])&&p(P,"border",e[7].hotBorder),(!_e||128&t[0])&&p(P,"border-color",e[7].hotBorderColor),(!_e||128&t[0]&&J!==(J=e[7].alt))&&g(P,"alt",J),(!_e||32&t[0])&&p(U,"left",e[5]),(!_e||4&t[0])&&p(U,"top",e[2]),(!_e||8&t[0])&&p(U,"height",e[3]),(!_e||16&t[0])&&p(U,"width",e[4]),(!_e||2&t[0])&&p(W,"width",e[1]),(!_e||128&t[0]&&me!==(me=e[7].xml))&&(he.value=me);const i={};128&t[0]|2&t[2]&&(i.$$scope={dirty:t,ctx:e}),!pe&&128&t[0]&&(pe=!0,i.visible=e[7].openImg,y((()=>pe=!1))),ge.$set(i);const a={};2&t[2]&&(a.$$scope={dirty:t,ctx:e}),!xe&&128&t[0]&&(xe=!0,a.visible=e[7].openDrag,y((()=>xe=!1))),fe.$set(a);const l={};128&t[0]|2&t[2]&&(l.$$scope={dirty:t,ctx:e}),!ye&&128&t[0]&&(ye=!0,l.visible=e[7].snackback,y((()=>ye=!1))),we.$set(l)},i(e){_e||(_(ge.$$.fragment,e),_(fe.$$.fragment,e),_(we.$$.fragment,e),_e=!0)},o(e){$(ge.$$.fragment,e),$(fe.$$.fragment,e),$(we.$$.fragment,e),_e=!1},d(i){i&&k(t),e[24](null),e[25](null),e[26](null),I(ge),I(fe),I(we),$e=!1,C(ke)}}}let ne="//s3.amazonaws.com/jigyaasa_content_static/",ae="";function le(e,t,i){let{xml:s}=t,{getChildXml:n}=t;const a=new j;let l=0,o="",c="",d="",h="",u="",g="",p="",v={},f=[],x=[],b="",w="";f[1]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textclick" top="10" left="20" width="30" height="50">\x3c!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--\x3e</div></smxml>',f[2]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="" path="" width="600" height="250"><div id="ID0" type="textselect" top="10" left="20" width="30" height="50">\x3c!--[CDATA[Most cheetahs live in the wilds of Africa. %{There are also some in Iran and northwestern Afghanistan.}% The cheetahs head is smaller than the leopards, and its body is longer. %{This cat is built for speed.}% Its legs are much longer than the leopard, allowing it to run at speeds of up to 70 miles per hour! This incredible ability helps the cheetahs catch their dinner, which is usually an unfortunate antelope. A cheetah spots are simply black spots, not rosettes or circles.]]--\x3e</div></smxml>',f[3]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="imagehighlight" top="10" left="20" width="30" height="50">\x3c!--[CDATA[]]--\x3e</div></smxml>',f[4]='<smxml xmlns="http://www.w3.org/1999/xhtml" type="4" name="HotSpot" bgimg="star_topology_000dlj.jpg" path="" width="600" height="250"><div id="ID0" type="hotspot" top="172" left="220" width="112" height="80">\x3c!--[CDATA[]]--\x3e</div></smxml>',x[1]="textclick",x[2]="textselect",x[3]="imagehighlight",x[4]="hotspot",x.textclick="1",x.textselect="2",x.imagehighlight="3",x.hotspot="4";let y={};L({xml:"",openImg:!1,openDrag:!1,bgImg:"",snackback:!1,valueMultiple:"1",cdata:"",bgImgWidth:"600px",bgImgHeight:"360px",alt:"",imgheight:"",imgwidth:"",hotBorder:"",hotBorderColor:"",lineColor:"",image_url:""}).subscribe((e=>{i(7,y=e)}));function _(){let e=tinyMCE.activeEditor.selection.getContent({format:"raw"});e=e.replace(e,'<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">'+e+"</span>"),tinyMCE.activeEditor.selection.setContent(e),B()}function $(e){let t=e.getAttribute("id"),i=[];"SMXML"==e.nodeName&&(t="imagehighlight"==e.children[0].getAttribute("type")?"hptdraw":"hptmain"),Array.prototype.forEach.call(e.attributes,((e,t)=>{i[t]={name:e.name,value:e.value}})),0==e.children.length&&""!=e.textContent.trim()&&(i[i.length]={name:"value",value:e.textContent.trim()}),void 0!==t&&(A.select("#"+t).dataset.attributes=JSON.stringify(i)),e.children.length>0&&Array.prototype.forEach.call(e.children,(e=>{$(e)}))}function k(){let e=[],t=[];$(A.parseHtml(y.xml));new D({onDragEnd:(e,t)=>{i(7,y.xml=a.updateElem("div",e,t.getAttribute("id"),t,y.xml),y),n(y.xml)}});A.listen("#hptmain","click",".drag-resize",(function(e){A.selectAll("#hptmain .elemActive","removeClass","elemActive"),A.select(e,"addClass","elemActive").focus()})),A.bind("#hptmain .drag-resize","mouseenter",(e=>{let t=e.target;A.find(t,".tools",{action:"show",actionData:"block"})})),A.bind("#hptmain .drag-resize","mouseleave",(e=>{let t=e.target;A.find(t,".tools",{action:"hide"})})),b=A.find("#mainContent","#hptdraw").clientWidth,w=A.find("#mainContent","#hptdraw").clientHeight;let r=new q({target:A.find("#mainContent","#hptdraw"),width:b,height:w,correctans:"",cssClass:"drawSurface",penSize:4,type:"imagehighlight",editable:!0,onMove(){},onClick(){},onPaint(i){e.push(i.X),t.push(i.Y)},onRelease(i){A.select("#special_module_user_xml").value="";let s=A.find("#mainContent","#hptdraw canvas").getAttribute("correctans");""!=s?(s=Object.keys(JSON.parse(s)).length,I(e,t,s)):I(e,t,l),e=[],t=[]}}),c=r.lineColor(window.color);if(A.siblings(A.find("#mainContent","#hptdraw")).find((e=>{let t=A.find(e,"div").getAttribute("id");return A.bind("#"+t,"click",(function(e){r.clearSurface(),o="{}",l=0,A.find("#mainContent","#hptdraw canvas",{action:"attr",actionData:{correctans:o}}),E()})),t})),"imagehighlight"==A.parseHtml(s).children[0].getAttribute("type")){var d=y.xml;""!=(d=d.substring(d.indexOf("{"),d.lastIndexOf("}")+1))&&(d=JSON.parse(d)),setTimeout((function(){a.drawOnCanvasAuth(A.find("#mainContent","#hptdraw canvas").getAttribute("id"),d,c)}),2e3)}window.surface=r}function I(e,t,i){0==i?o='{"'+ ++i+'":{"x":['+e+'],"y":['+t+"]}}":(o=A.find("#mainContent","#hptdraw canvas").getAttribute("correctans"),o=o.slice(0,-1),o+=',"'+ ++i+'":{"x":['+e+'],"y":['+t+"]}}"),A.find("#mainContent","#hptdraw canvas",{action:"attr",actionData:{correctans:o}}),E()}function C(e){if("img"==e){i(7,y.bgImg=A.select("#backgroundImage").value,y),i(7,y.alt=A.select("#imgAlt").value,y),i(7,y.imgheight=A.select("#imgHeight").value,y),i(7,y.imgwidth=A.select("#imgWidth").value,y),i(7,y.hotBorder=A.select("#hotBorder").value,y),i(7,y.hotBorderColor=A.select("#hotBorderColor").value,y),globalThis.sda=A.selectAll("#backgroundImage, #imgAlt, #imgHeight, #imgWidth, #hotBorder, #hotBorderColor"),i(7,y.xml=y.xml.replace(/alt="(.*?)"/gim,`alt="${y.alt.replace(/"/g,"&quot;")}"`),y),i(7,y.xml=y.xml.replace(/bgimg="(.*?)"/gim,`bgimg="${y.bgImg}"`),y),i(7,y.xml=y.xml.replace(/imgheight="(.*?)"/gim,`imgheight="${y.imgheight}"`),y),i(7,y.xml=y.xml.replace(/imgwidth="(.*?)"/gim,`imgwidth="${y.imgwidth}"`),y);let e=T(y.xml);e.smxml.div._border=y.hotBorder,e.smxml.div._bordercolor=y.hotBorderColor,e.smxml.div._linecolor=window.color;let t=new Image;t.onload=function(){i(0,c=this.height+"px"),i(1,d=this.width+"px"),A.select("#hptmain","css",{height:c,width:d}),"imagehighlight"==e.smxml.div._type&&(e.smxml._width=this.width,e.smxml._height=this.height,A.find("#hptdraw","canvas",{action:"attr",actionData:{height:this.height,width:this.width}}),A.selectAll("#previewSection .reset, #authoringLoadComponent .reset").forEach((e=>{e.click()}))),i(7,y.xml=W(e),y),n(y.xml)},t.src=ne+y.bgImg,i(7,y.openImg=!1,y)}else{if(function(){let e=A.select("#dragHeight").value,t=parseInt(e),i=A.select("#dragWidth").value,s=parseInt(i),n=A.select("#dragTop").value,a=parseInt(n),l=A.select("#dragLeft").value,o=parseInt(l),r=parseInt(c),h=parseInt(d);return isNaN(Number(e))||isNaN(t)?(A.showmsg("Only numeric value accepted."),A.select("#dragHeight").focus(),!1):t>parseInt(r/2)||t<32?(A.showmsg("Height must be greater than or equal to 32 and less than or equal to "+parseInt(r/2)),A.select("#dragHeight").focus(),!1):isNaN(Number(i))||isNaN(s)?(A.showmsg("Only numeric value accepted."),A.select("#dragWidth").focus(),!1):s>parseInt(h/2)||s<32?(A.showmsg("Width must be greater than or equal to 32 and less than or equal to "+parseInt(h/2)),A.select("#dragWidth").focus(),!1):isNaN(Number(n))||isNaN(a)?(A.showmsg("Only numeric value accepted."),A.select("#dragTop").focus(),!1):a>r-t||a<0?(A.showmsg("Top value must be greater than or equal to 0 and less than or equal to "+(r-t)),A.select("#dragTop").focus(),!1):isNaN(Number(l))||isNaN(o)?(A.showmsg("Only numeric value accepted."),A.select("#dragLeft").focus(),!1):!(o>h-s||o<0)||(A.showmsg("Left value must be greater than or equal to 0 and less than or equal to "+(h-s)),A.select("#dragLeft").focus(),!1)}()){var t=T(y.xml);i(3,u=t.smxml.div._height=parseInt(A.select("#dragHeight").value)),i(4,g=t.smxml.div._width=parseInt(A.select("#dragWidth").value)),i(2,h=t.smxml.div._top=parseInt(A.select("#dragTop").value)),i(5,p=t.smxml.div._left=parseInt(A.select("#dragLeft").value)),i(7,y.openDrag=!1,y),i(3,u+="px"),i(4,g+="px"),i(2,h+="px"),i(5,p+="px"),n(W(t)),i(7,y.xml=W(t),y)}}}function E(){var e=A.parseHtml(y.xml);"imagehighlight"==e.querySelector("div")?.getAttribute("type")&&(e.querySelector("div").innerHTML="<![CDATA["+A.find("#mainContent","#hptdraw canvas").getAttribute("correctans")+"]]>");var t=y.xml;if(t){var s=y.xml.replace(t,formatXml(e.xml?e.xml:(new XMLSerializer).serializeToString(e)));i(7,y.xml=s.toString(),y),n(y.xml)}}function B(){var e=[],t="",s=tinyMCE.activeEditor.getContent({format:"raw"});if(e=s.match(/<span data-type="select"(.*?)>(.*?)<\/span>/gi))for(var a=0;a<e.length;a++)t=e[a].replace(/<span data-type="select"(.*?)>|<\/span>/gm,""),s=s.replace(e[a],"%{"+t+"}%");var l=y.xml.match(/<!--\[CDATA\[(.*?)\]\]-->/gm);if(l){var o=l.toString().replace("\x3c!--[CDATA[","").replace("]]--\x3e","");o=y.xml.replace(l,"\x3c!--[CDATA["+s+"]]--\x3e"),i(7,y.xml=o.toString(),y),n(o.toString())}}function H(e,t,s,a,l){console.log("setps");let o=A.select("#ID0");if(o){let r=o.getBoundingClientRect(),c=o.getAttribute("id"),d=A.parseHtml(y.xml),h=d.querySelector('[id="'+c+'"]');if(void 0!==l&&l)confirm("Do you want to delete it?")&&(o.remove(),h.remove());else if(o.offsetWidth>0&&o.offsetHeight>0){e=o.clientWidth+e,t=o.clientHeight+t,s=r.top+s,a=r.left+a,A.select(o,"css",{width:e+"px",height:t+"px",top:s+"px",left:a+"px"});let i=A.select('[id="'+c+'"]').dataset.attributes;JSON.stringify(i).forEach(((e,t)=>{switch(e.name){case"width":e.value=parseInt(o.clientWidth),h.setAttribute("width",e.value);break;case"height":e.value=parseInt(o.clientHeight),h.setAttribute("height",e.value);break;case"top":e.value=parseInt(r.top),h.setAttribute("top",e.value);break;case"left":e.value=parseInt(r.left),h.setAttribute("left",e.value)}})),A.select('[id="'+c+'"]').dataset.attributes=i}A.select("#special_module_xml").value=d.xml?d.xml:(new XMLSerializer).serializeToString(d[0]),i(7,y.xml=d.xml?d.xml:(new XMLSerializer).serializeToString(d[0]),y),n(d.xml?d.xml:(new XMLSerializer).serializeToString(d[0]))}}let M,z,X,O,Y;function P(e){let t=X.parentNode,s=M-e.x;i(22,M=e.x),t.style.width=parseInt(getComputedStyle(t,"").width)-s+"px"}function J(e){let t=O.parentNode,s=z-e.y;i(23,z=e.y),t.style.height=parseInt(getComputedStyle(t,"").height)-s+"px"}function R(e){let t=O.parentNode,s=M-e.x,n=z-e.y;i(22,M=e.x),i(23,z=e.y),t.style.width=parseInt(getComputedStyle(t,"").width)-s+"px",t.style.height=parseInt(getComputedStyle(t,"").height)-n+"px"}S((()=>{A.createLink(window.itemUrl+"clsSMHotspot/css/hotspot.min.css",{preload:!0}),function(){i(7,y.xml=s,y);let e=T(s);if(e)switch(e.smxml.div._type=e.smxml.div._type?e.smxml.div._type:"hotspot",i(7,y.valueMultiple=x[e.smxml.div._type],y),x[e.smxml.div._type]){case"1":case"2":t=e,i(7,y.cdata=t.smxml.div.__cdata,y),i(0,c=t.smxml._height+"px"),i(1,d=t.smxml._width+"px"),A.select("#text0","show"),A.selectAll(".drawImage,#hptmain","hide"),A.find(document,"canvas").remove(),function(e){e=e.replace(/%{/gm,'<span data-type="select" class="alert alert-info" cursor="pointer" style="padding: 5px;outline: none;line-height:40px;" contentEditable="true">').replace(/}%/gm,"</span>"),A.find("#mainContent",".tinymce-editor-response").innerHTML=e}(t.smxml.div.__cdata);break;case"3":!function(e){i(7,y.bgImg=e.smxml._bgimg,y);let t=new Image;t.onload=function(){i(0,c=e.smxml._height>this.height?e.smxml._height+"px":this.height+"px"),i(1,d=e.smxml._width>this.width?e.smxml._width+"px":this.width+"px"),A.find("#previewSection",".reset").click(),A.find("#mainContent","#hptdraw canvas",{action:"attr",actionData:{height:c,width:d,correctans:e.smxml.div.__cdata}}),E()},t.src=ne+e.smxml._bgimg,i(7,y.bgImg=e.smxml._bgimg,y),A.selectAll(".drawImage","toggleClass","d-none"),A.selectAll("#text0,#hptmain","hide"),k()}(e);break;case"4":!function(e){i(7,y.hotBorder=e.smxml.div._border,y),i(7,y.hotBorderColor=e.smxml.div._bordercolor,y),i(7,y.bgImg=e.smxml._bgimg,y),i(0,c=e.smxml._height+"px"),i(7,y.alt=e.smxml._alt,y),i(1,d=e.smxml._width+"px"),i(4,g=e.smxml.div._width+"px"),i(3,u=e.smxml.div._height+"px"),i(5,p=e.smxml.div._left+"px"),i(2,h=e.smxml.div._top+"px");let t=new Image;t.src=ne+e.smxml._bgimg,t.onload=function(){i(0,c=this.height+"px"),i(1,d=this.width+"px"),w=e.smxml.div._imgheight?e.smxml.div._imgheight+"px":"auto !important",b=e.smxml.div._imgwidth?e.smxml.div._imgwidth+"px":"auto !important",i(7,y.imgwidth=b,y),i(7,y.imgheight=w,y),A.select("#hptmain","css",{height:c,width:d})},A.select("#hptmain","toggleClass","d-none"),A.selectAll(".drawImage,#text0","hide"),A.find(document,"canvas",{action:"remove"}),k()}(e),A.bind(document,"keydown",(e=>{if(e.ctrlKey&&e.shiftKey)switch(e.keyCode.toString()){case"37":H(-10,0,0,0);break;case"38":H(0,-10,0,0);break;case"39":H(10,0,0,0);break;case"40":H(0,10,0,0)}else if(e.shiftKey)switch(e.keyCode.toString()){case"37":H(-1,0,0,0);break;case"38":H(0,-1,0,0);break;case"39":H(1,0,0,0);break;case"40":H(0,1,0,0)}else if(e.ctrlKey)switch(e.keyCode.toString()){case"37":H(0,0,0,-10);break;case"38":H(0,0,-10,0);break;case"39":H(0,0,0,10);break;case"40":H(0,0,10,0)}else switch(e.keyCode.toString()){case"27":A.selectAll(".dragable-container .ui-draggable","removeClass","elemActive");break;case"38":e.preventDefault(),H(0,0,-1,0);break;case"40":e.preventDefault(),H(0,0,1,0)}}))}var t;tinyMCE.PluginManager.add("res",(function(e){e.addMenuItem("resp",{text:"Add Token",id:"addToken",onclick(){_()},context:"insert",prependToContext:!0})})),tinymce.init({selector:".tinymce-editor-response",inline:!0,theme:"modern",min_width:100,resize:!0,menubar:!1,toolbar:!1,elementpath:!1,statusbar:!1,force_br_newlines:!0,remove_trailing_brs:!0,forced_root_block:!1,paste_as_text:!0,extended_valid_elements:"span[onClick|contentEditable]",valid_elements:"*[*]",extended_valid_elements:"uc:syntax,uc:ref",custom_elements:"uc:syntax,~uc:ref",plugins:["res contextmenu paste"],contextmenu:"link resp"}),A.listen(document,"mousedown",".draggable",B),v={},A.listen(document,"touchstart",".tinymce-editor-response",(()=>{v.s=(new Date).getTime()})),A.listen(document,"touchend",".tinymce-editor-response",(()=>{v.e=(new Date).getTime()-v.s,v.e/1e3>1&&(_(),v={})})),A.listen(document,"click","#upload_media",(()=>{window.setImage("backgroundImage")})),A.bind(document,"click",(()=>{i(7,y.image_url=ne+""+A.select("#backgroundImage").value,y)}))}()}));return e.$$set=e=>{"xml"in e&&i(20,s=e.xml),"getChildXml"in e&&i(21,n=e.getChildXml)},e.$$.update=()=>{e.$$.dirty[0],e.$$.dirty[0]},[c,d,h,u,g,p,x,y,X,O,Y,function(e){let t=T(y.xml),s=e,n=!0,a=!0,l=!1;if("imagehighlight"==t.smxml.div._type){let e=new Image;e.onload=function(){l?(i(0,c=t.smxml._height+"px"),i(1,d=t.smxml._width+"px")):(i(0,c=this.height+"px"),i(1,d=this.width+"px")),this.width>=100&&this.width<=1e3?(n=!0,this.height>=80&&this.height<=550?a=!0:(A.alert(m.height_warning),a=!1)):(A.alert(m.width_warning),n=!1),a&&n?l?i(7,y.openImg=!0,y):C(s):(console.log("Default Image set"),i(7,y.openImg=!0,y),e.src=ne+t.smxml._bgimg,A.selectAll("#backgroundImage").value=t.smxml._bgimg,l=!0)},e.src=ne+A.select("#backgroundImage").value}else C(s)},function(){i(7,y.openDrag=!1,y),i(7,y.openImg=!1,y)},function(){A.select("#backgroundImage").value=y.bgImg,i(7,y.image_url=ne+""+y.bgImg,y),A.select(A.select("#backgroundImage").previousElementSibling,"css",{transform:"scale(0.75) translate(0px, -28px)",color:"rgb(0, 188, 212)"}),y.hotBorder&&(A.select("#hotBorder").value=y.hotBorder,A.select(A.select("#hotBorder").previousElementSibling,"css",{transform:"scale(0.75) translate(0px, -28px)",color:"rgb(0, 188, 212)"})),y.hotBorderColor&&(A.select("#hotBorderColor").value=y.hotBorderColor,A.select(A.select("#hotBorderColor").previousElementSibling,"css",{transform:"scale(0.75) translate(0px, -28px)",color:"rgb(0, 188, 212)"})),i(7,y.openImg=!0,y)},function(){i(7,y.openDrag=!0,y);var e=setTimeout((function(){A.select("#dragHeight").value=parseInt(A.select("#ID0").style.height),A.select("#dragWidth").value=parseInt(A.select("#ID0").style.width),A.select("#dragTop").value=parseInt(A.select("#ID0").style.top),A.select("#dragLeft").value=parseInt(A.select("#ID0").style.left),clearTimeout(e)}),300)},B,function(e){i(7,y.lineColor=e.target.value,y),window.color=y.lineColor},function(e){i(22,M=e.x),document.removeEventListener("mousemove",J,!1),document.addEventListener("mousemove",P,!1),document.addEventListener("mouseup",(function(){document.removeEventListener("mousemove",P,!1),document.removeEventListener("mousemove",J,!1),document.removeEventListener("mousemove",R,!1)}),!1)},function(e){i(23,z=e.y),document.removeEventListener("mousemove",P,!1),document.addEventListener("mousemove",J,!1),document.addEventListener("mouseup",(function(){document.removeEventListener("mousemove",P,!1),document.removeEventListener("mousemove",J,!1)}),!1)},function(e){i(22,M=e.x),i(23,z=e.y),document.removeEventListener("mousemove",P,!1),document.removeEventListener("mousemove",J,!1),document.addEventListener("mousemove",R,!1),document.addEventListener("mouseup",(function(){document.removeEventListener("mousemove",P,!1),document.removeEventListener("mousemove",J,!1),document.removeEventListener("mousemove",R,!1)}),!1)},s,n,M,z,function(e){r[e?"unshift":"push"]((()=>{X=e,i(8,X)}))},function(e){r[e?"unshift":"push"]((()=>{O=e,i(9,O)}))},function(e){r[e?"unshift":"push"]((()=>{Y=e,i(10,Y)}))},function(){y.alt=this.value,i(7,y)},function(){y.hotBorder=N(this),i(7,y)},function(){y.hotBorderColor=N(this),i(7,y)},function(){y.lineColor=N(this),i(7,y)},function(t){e.$$.not_equal(y.openImg,t)&&(y.openImg=t,i(7,y))},function(t){e.$$.not_equal(y.openDrag,t)&&(y.openDrag=t,i(7,y))},()=>i(7,y.snackback=!1,y),function(t){e.$$.not_equal(y.snackback,t)&&(y.snackback=t,i(7,y))}]}export default class extends t{constructor(e){var t;super(),J.getElementById("svelte-dl6gty-style")||((t=a("style")).id="svelte-dl6gty-style",t.textContent="#resizeX.svelte-dl6gty{position:absolute;right:0;width:3px;opacity:0;height:100%;cursor:w-resize}#resizeY.svelte-dl6gty{position:absolute;bottom:0;width:100%;height:3px;opacity:0;cursor:s-resize}#resizeXY.svelte-dl6gty{position:absolute;bottom:0;right:0;width:3px;height:3px;opacity:0;cursor:se-resize}",l(J.head,t)),i(this,e,le,se,s,{xml:20,getChildXml:21},[-1,-1,-1])}}
//# sourceMappingURL=Hotspot-f641ee15.js.map
