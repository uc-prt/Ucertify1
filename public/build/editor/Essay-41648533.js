import{S as e,i as t,s as l,F as s,a1 as o,I as i,K as a,e as n,u as r,b as d,f as u,h as c,j as p,l as m,x as f,o as x,y as h,c as b,m as _,N as v,t as g,a as y,d as w,p as C,A,X as $}from"./main-f6104616.js";import{s as k,p as T}from"./index-b6c00f72.js";function q(e){s(e,"svelte-11lmiqu",".hero-unit.svelte-11lmiqu.svelte-11lmiqu{border:1px solid #ccc;width:84%;padding:18px!important;font-size:15px!important;margin-bottom:30px;font-weight:200;line-height:30px;color:inherit;background-color:#eeeeee;-webkit-border-radius:6px;-moz-border-radius:6px;border-radius:6px}#essay_editorAuth.svelte-11lmiqu.svelte-11lmiqu{max-height:250px;height:250px;background-color:white;border-collapse:separate;border:1px solid rgb(204, 204, 204);padding:4px;box-sizing:content-box;-webkit-box-shadow:rgba(0, 0, 0, 0.0745098) 0px 1px 1px 0px inset;box-shadow:rgba(0, 0, 0, 0.0745098) 0px 1px 1px 0px inset;border-top-right-radius:3px;border-bottom-right-radius:3px;border-bottom-left-radius:3px;border-top-left-radius:3px;overflow:scroll;outline:none}.essay-container .upload-area.svelte-11lmiqu #files_number.svelte-11lmiqu{width:115px}")}function j(e){let t;return{c(){t=n("span"),t.textContent="Upload"},m(e,l){c(e,t,l)},d(e){e&&x(t)}}}function H(e){let t,l,s,o,i,a,b,_,v,g,y,w,C,A,$,k,T,q,j,H,L,M,X,D,E,z,S,I,B=e[0].file_extension_text+"",F=e[0].number_of_files+"",K=e[0].you_can_upload+"";return{c(){t=n("div"),l=n("div"),s=n("div"),o=n("label"),i=r(B),a=d(),b=n("div"),_=n("select"),v=n("option"),v.textContent="All(*.*)",g=n("option"),g.textContent="*.txt",y=n("option"),y.textContent="*.pdf",w=n("option"),w.textContent="*.doc,*.docx",C=n("option"),C.textContent="*.doc,*.docx,*.pdf",A=n("option"),A.textContent="*.jpg,*.png,*.gif,*.bmp,*.jpeg",$=d(),k=n("div"),T=n("div"),q=n("label"),j=r(F),H=d(),L=n("div"),M=n("input"),D=d(),E=n("small"),z=r(K),u(o,"for","choose_ext"),u(o,"class","mb-0 pt-sm1 font14"),u(s,"class","col-sm-3"),v.__value="*.txt,*.doc,*.docx,*.pdf,*.jpg,*.png,*.gif,*.bmp,*.jpeg",v.value=v.__value,v.selected="selected",g.__value="*.txt",g.value=g.__value,y.__value="*.pdf",y.value=y.__value,w.__value="*.doc,*.docx",w.value=w.__value,C.__value="*.doc,*.docx,*.pdf",C.value=C.__value,A.__value="*.jpg,*.png,*.gif,*.bmp,*.jpeg",A.value=A.__value,u(_,"name","choose_ext"),u(_,"id","choose_ext"),u(_,"class","form-control form-control-md"),u(b,"class","col-sm-8"),u(l,"class","row"),u(q,"for","files_number"),u(q,"class","mb-0 font14 pt-1"),u(T,"class","col-sm-3"),u(M,"type","number"),u(M,"class","form-control form-control-md float-left filenumber svelte-11lmiqu"),u(M,"name","files_number"),u(M,"id","files_number"),M.value=X=e[2].files_number,u(M,"step","1"),u(M,"min","1"),u(M,"max","10"),M.required="required",u(E,"class","font11"),u(L,"class","col-sm-8"),u(k,"class","row mt-2"),u(t,"class","upload-area mt-3 text-left svelte-11lmiqu")},m(n,r){c(n,t,r),p(t,l),p(l,s),p(s,o),p(o,i),p(l,a),p(l,b),p(b,_),p(_,v),p(_,g),p(_,y),p(_,w),p(_,C),p(_,A),p(t,$),p(t,k),p(k,T),p(T,q),p(q,j),p(k,H),p(k,L),p(L,M),p(L,D),p(L,E),p(E,z),S||(I=[m(_,"blur",e[8]),m(M,"change",e[3].bind(this,2))],S=!0)},p(e,t){1&t&&B!==(B=e[0].file_extension_text+"")&&f(i,B),1&t&&F!==(F=e[0].number_of_files+"")&&f(j,F),4&t&&X!==(X=e[2].files_number)&&(M.value=X),1&t&&K!==(K=e[0].you_can_upload+"")&&f(z,K)},d(e){e&&x(t),S=!1,h(I)}}}function L(e){let t,l,s,r,m,f,h,C,A,$;function k(t){e[7](t)}let T={id:"uploadChk",name:"uploadChk",color:"primary",$$slots:{default:[j]},$$scope:{ctx:e}};void 0!==e[1]&&(T.checked=e[1]),h=new o({props:T}),i.push((()=>a(h,"checked",k))),h.$on("click",e[4]);let q=e[1]&&H(e);return{c(){t=n("main"),l=n("div"),s=n("div"),r=d(),m=n("textarea"),f=d(),b(h.$$.fragment),A=d(),q&&q.c(),u(s,"id","essayToolbar"),u(s,"class","sun-editor"),u(m,"id","essay_editorAuth"),u(m,"class","text-left editor sun-editor-editable svelte-11lmiqu"),u(l,"class","hero-unit svelte-11lmiqu"),u(t,"id","SM_essay")},m(e,o){c(e,t,o),p(t,l),p(l,s),p(l,r),p(l,m),p(l,f),_(h,l,null),p(l,A),q&&q.m(l,null),$=!0},p(e,[t]){const s={};32768&t&&(s.$$scope={dirty:t,ctx:e}),!C&&2&t&&(C=!0,s.checked=e[1],v((()=>C=!1))),h.$set(s),e[1]?q?q.p(e,t):(q=H(e),q.c(),q.m(l,null)):q&&(q.d(1),q=null)},i(e){$||(g(h.$$.fragment,e),$=!0)},o(e){y(h.$$.fragment,e),$=!1},d(e){e&&x(t),w(h),q&&q.d()}}}function M(e,t,l){let s,o,{xml:i}=t,{getChildXml:a}=t,{l:n}=t,r=!1,d=null,u={files_number:1,cdata:!0};function c(e,t){d&&clearTimeout(d),d=setTimeout((function(){let e=t||o.getContents(),l=A.parseHtml(i),n=A.selectAll("#choose_ext option","selected")[0],r=l.querySelector("default");if(A.select("#uploadChk").checked)if(r)A.setAttr(r,{type:1,fileTypeExts:n?n.value:"",limit:A.select("#files_number").value});else{let e=A.parseHtml(`<default type="1" fileTypeExts="${n?n.value:""}" limit="${A.select("#files_number").value}"></default>`);l.appendChild(e)}else r&&(r.setAttribute("type",0),r.removeAttribute("fileTypeExts","limit"));if(r)r.innerHTML=`\x3c!--[CDATA[${e}]]--\x3e`;else{let t=A.parseHtml(`<default type="0">\x3c!--[CDATA[${e}]]--\x3e</default>`);l.appendChild(t)}s=formatXml(l.outerHTML),a(s)}),e)}C((()=>{o=k.create("essay_editorAuth",{width:"auto",toolbarContainer:"#essayToolbar",placeholder:"Write text here.",plugins:T,resizingBar:!1,showPathLabel:!1,buttonList:[["formatBlock"],["bold","italic","underline"],["link"],["list","outdent","indent","align"],["removeFormat"]]}),o.onChange=(e,t)=>{c(1e3,e)},o.onKeyDown=(e,t)=>{86!=e.keyCode&&67!=e.keyCode||c(1e3)};let e=A.find("#SM_essay","a,button,input,select");A.listenAll(e,"blur",(e=>{console.log(e.target),c(500)})),A.bind("#files_number","keydown",(e=>{if(8!=e.which&&0!=e.which&&(e.which<48||e.which>57))return A.select("#err_txt").innerHTML="Digits Only",A.selectAll("#err_txt","show"),!1}));let t=A.parseHtml(i);A.find(t,"default")&&1==A.find(t,"default").getAttribute("type")&&(A.selectAll(".upload-area","removeClass","h"),A.select("#uploadChk").checked=!0,console.log(A.find(t,"default").getAttribute("fileTypeExts")),A.select(`#choose_ext option[value="${A.find(t,"default").getAttribute("fileTypeExts")}"]`,"attr",{selected:"selected"}),A.select("#files_number").value=A.find(t,"default").getAttribute("limit")),function(e){if(u.cdata){l(2,u.cdata=!1,u);let t=$(e);AI.isValid(t)&&AI.isValid(t.smxml.default)&&o.setContents(t.smxml.default.__cdata)}}(i)}));return e.$$set=e=>{"xml"in e&&l(5,i=e.xml),"getChildXml"in e&&l(6,a=e.getChildXml),"l"in e&&l(0,n=e.l)},[n,r,u,function(e,t){if(l(2,u.files_number=e.value,u),8!=e.which&&0!=e.which&&(e.which<48||e.which>57))return A.select("#err_txt").innerHTML="Digits Only",A.selectAll("#err_txt","show"),!1},c,i,a,function(e){r=e,l(1,r)},()=>c(500)]}export default class extends e{constructor(e){super(),t(this,e,M,L,l,{xml:5,getChildXml:6,l:0},q)}}
//# sourceMappingURL=Essay-41648533.js.map
