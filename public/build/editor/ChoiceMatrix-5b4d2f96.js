import{S as t,i as e,s as l,F as o,e as a,u as n,h as i,j as c,r as s,o as r,q as d,b as m,f as h,U as u,g as p,l as g,v as f,y as x,D as v,a1 as _,P as b,a3 as w,p as z,A as k,X as y,w as C}from"./main-91b4ef6d.js";import{l as F}from"./parseCSV-929be628.js";function E(t){o(t,"svelte-ogtz12",".fa-check.svelte-ogtz12{color:#46A546}.fa-close.svelte-ogtz12{color:#A80000}.fa-close.svelte-ogtz12,.fa-check.svelte-ogtz12{margin-left:9px;font-size:18px}.fa-close.svelte-ogtz12,.fa-check.svelte-ogtz12,.middle_align.svelte-ogtz12{vertical-align:middle!important}.middle_align.svelte-ogtz12{width:164px;min-width:164px}.topic_input.svelte-ogtz12{min-width:257px}.preview_header.svelte-ogtz12{font-size:16pt;font-weight:bold;vertical-align:middle}.adjust_width.svelte-ogtz12{width:12%;text-align:center}.width180.svelte-ogtz12{width:180px}.width150.svelte-ogtz12{width:150px}.full_day.svelte-ogtz12{background-color:#eee !important;color:#000 !important}.width90.svelte-ogtz12{width:90px}.width20.svelte-ogtz12{width:20px}.relative.svelte-ogtz12{position:relative}.min_height_38.svelte-ogtz12{min-height:38px}.min_width_200.svelte-ogtz12{min-width:200px !important}.min_width_125.svelte-ogtz12{min-width:125px}.max_width_150.svelte-ogtz12{max-width:150px !important}.height34.svelte-ogtz12{height:34px !important}.width_90.svelte-ogtz12{width:90%}.font24.svelte-ogtz12{font-size:15px !important}")}function D(t,e,l){const o=t.slice();return o[24]=e[l],o[26]=l,o}function W(t,e,l){const o=t.slice();return o[27]=e[l],o[29]=l,o}function A(t,e,l){const o=t.slice();return o[24]=e[l],o[26]=l,o}function T(t,e,l){const o=t.slice();return o[31]=e[l],o[26]=l,o}function S(t){let e,l,o,d=_[t[31]]+"";return{c(){e=a("option"),l=n(d),e.__value=o="theme"+ ++t[26],e.value=e.__value},m(t,o){i(t,e,o),c(e,l)},p:s,d(t){t&&r(e)}}}function B(t){let e,l=t[0].cdata.option,o=[];for(let e=0;e<l.length;e+=1)o[e]=N(A(t,l,e));return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=d()},m(t,l){for(let e=0;e<o.length;e+=1)o[e].m(t,l);i(t,e,l)},p(t,a){if(1091&a[0]){let n;for(l=t[0].cdata.option,n=0;n<l.length;n+=1){const i=A(t,l,n);o[n]?o[n].p(i,a):(o[n]=N(i),o[n].c(),o[n].m(e.parentNode,e))}for(;n<o.length;n+=1)o[n].d(1);o.length=l.length}},d(t){v(o,t),t&&r(e)}}}function N(t){let e,l,o,n,s,d,v,_,b,w,z,k,y,C;return{c(){e=a("th"),l=a("div"),o=a("textarea"),d=m(),v=a("div"),_=a("span"),w=m(),h(o,"id",n=t[24].id),o.value=s=t[24].text,h(o,"class","form-control form-control-md px-2 min_height_38 text-dark svelte-ogtz12"),h(o,"cols","10"),h(o,"rows","1"),h(l,"class","float-left"),h(_,"class",b=u(I)+" svelte-ogtz12"),h(v,"class","float-left pointer pt-1 ml-2 delete_column height35 top1 position-relative"),h(v,"tab-index","0"),h(e,"key",z=t[26]),h(e,"class",k=u("middle_align text-center "+t[24].id)+" svelte-ogtz12"),p(e,"background-color",t[1][t[0].theme],1)},m(a,n){i(a,e,n),c(e,l),c(l,o),c(e,d),c(e,v),c(v,_),c(e,w),y||(C=[g(o,"change",t[6]),g(v,"click",(function(){f(t[10].bind(this,t[24].id))&&t[10].bind(this,t[24].id).apply(this,arguments)}))],y=!0)},p(l,a){t=l,1&a[0]&&n!==(n=t[24].id)&&h(o,"id",n),1&a[0]&&s!==(s=t[24].text)&&(o.value=s),1&a[0]&&k!==(k=u("middle_align text-center "+t[24].id)+" svelte-ogtz12")&&h(e,"class",k),1&a[0]&&p(e,"background-color",t[1][t[0].theme],1)},d(t){t&&r(e),y=!1,x(C)}}}function $(t){let e,l=t[0].cdata.term,o=[];for(let e=0;e<l.length;e+=1)o[e]=X(D(t,l,e));return{c(){for(let t=0;t<o.length;t+=1)o[t].c();e=d()},m(t,l){for(let e=0;e<o.length;e+=1)o[e].m(t,l);i(t,e,l)},p(t,a){if(2597&a[0]){let n;for(l=t[0].cdata.term,n=0;n<l.length;n+=1){const i=D(t,l,n);o[n]?o[n].p(i,a):(o[n]=X(i),o[n].c(),o[n].m(e.parentNode,e))}for(;n<o.length;n+=1)o[n].d(1);o.length=l.length}},d(t){v(o,t),t&&r(e)}}}function M(t){let e,l,o,n,s,d,m,u,f,x,v;return{c(){e=a("td"),l=a("label"),o=a("input"),h(o,"type","radio"),h(o,"class","preview_radio align-middle"),o.value=n=t[27].id,h(o,"name",s=t[26]+1),h(o,"id",d="a"+t[26]+t[29]),h(o,"data-correct",m=t[24].correct),h(l,"class","label_choice pointer d-block w-100 mb-0"),h(l,"for",u="a"+t[26]+t[29]),h(e,"class","text-center align-middle h-auto min_width_125 max_width_150 svelte-ogtz12"),h(e,"key",f=t[29]),p(e,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1)},m(a,n){i(a,e,n),c(e,l),c(l,o),x||(v=g(o,"click",t[11]),x=!0)},p(t,l){1&l[0]&&n!==(n=t[27].id)&&(o.value=n),1&l[0]&&m!==(m=t[24].correct)&&h(o,"data-correct",m),1&l[0]&&p(e,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1)},d(t){t&&r(e),x=!1,v()}}}function X(t){let e,l,o,n,s,d,_,b,w,z,k,y,C,F,E,D=t[0].cdata.option,A=[];for(let e=0;e<D.length;e+=1)A[e]=M(W(t,D,e));return{c(){e=a("tr"),l=a("td"),o=a("textarea"),d=m(),_=a("div"),b=a("span"),k=m();for(let t=0;t<A.length;t+=1)A[t].c();y=m(),h(o,"id",n=t[24].id),o.value=s=t[24].text,h(o,"class","form-control form-control-md width_90 float-left min_height_38 mr-2 svelte-ogtz12"),p(o,"outline","none"),p(o,"height","38px"),h(b,"class",w=u(I)+" svelte-ogtz12"),h(_,"class","pointer pt-1 mt-sm2 ml-2 delete_row height34 svelte-ogtz12"),h(_,"tab-index","0"),h(l,"class",z=u("min_width_200 h-auto "+t[24].id)+" svelte-ogtz12"),p(l,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1),h(e,"key",C=t[26])},m(a,n){i(a,e,n),c(e,l),c(l,o),c(l,d),c(l,_),c(_,b),c(e,k);for(let t=0;t<A.length;t+=1)A[t].m(e,null);c(e,y),F||(E=[g(o,"input",t[5]),g(_,"click",(function(){f(t[9].bind(this,t[24].id))&&t[9].bind(this,t[24].id).apply(this,arguments)}))],F=!0)},p(a,i){if(t=a,1&i[0]&&n!==(n=t[24].id)&&h(o,"id",n),1&i[0]&&s!==(s=t[24].text)&&(o.value=s),1&i[0]&&z!==(z=u("min_width_200 h-auto "+t[24].id)+" svelte-ogtz12")&&h(l,"class",z),1&i[0]&&p(l,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1),2053&i[0]){let l;for(D=t[0].cdata.option,l=0;l<D.length;l+=1){const o=W(t,D,l);A[l]?A[l].p(o,i):(A[l]=M(o),A[l].c(),A[l].m(e,y))}for(;l<A.length;l+=1)A[l].d(1);A.length=D.length}},d(t){t&&r(e),v(A,t),F=!1,x(E)}}}function j(t){let e,l,o,d,u,f,w,z,k,y,C,F,E,D,W,A,N,M,X,j,I,q,O,J,L,V,Y,P,U,G,H,K,Q,R,Z,tt,et,lt,ot,at,nt,it,ct,st,rt,dt,mt,ht,ut,pt,gt=_.comment_choiceMatrix+"",ft=_.add_row+"",xt=_.add_column+"",vt=t[3],_t=[];for(let e=0;e<vt.length;e+=1)_t[e]=S(T(t,vt,e));let bt=t[0].cdata&&B(t),wt=t[0].cdata&&$(t);return{c(){e=a("main"),l=a("div"),o=a("div"),d=a("div"),u=a("div"),f=a("div"),w=a("label"),w.textContent=""+_.themes,z=m(),k=a("select");for(let t=0;t<_t.length;t+=1)_t[t].c();C=m(),F=a("label"),F.textContent=""+_.table_width,E=m(),D=a("input"),A=m(),N=a("span"),N.textContent="px",M=m(),X=a("div"),j=a("table"),I=a("thead"),q=a("tr"),O=a("th"),J=a("textarea"),Y=m(),bt&&bt.c(),P=m(),U=a("tbody"),wt&&wt.c(),G=m(),H=a("small"),K=a("strong"),K.textContent="* "+_.note_label,Q=m(),R=n(gt),Z=m(),tt=a("div"),et=a("button"),lt=a("span"),lt.textContent="+",ot=m(),at=n(ft),it=m(),ct=a("button"),st=a("span"),st.textContent="+",rt=m(),dt=n(xt),h(w,"for","select_themes"),h(w,"class","mb-0 pl-1 mt-2 mr-2 float-left"),h(k,"class","form-control form-control-md px-2 enroll_date_td width150 float-left svelte-ogtz12"),h(k,"id","select_themes"),h(k,"name","select_themes"),h(F,"for","customWidth"),h(F,"class","mb-0 mt-2 mr-2 ml-2 float-left"),h(D,"class","form-control form-control-md px-2 width90 float-left svelte-ogtz12"),h(D,"step","10"),h(D,"min","500"),h(D,"max","1000"),h(D,"type","number"),D.value=W=parseInt(t[0].maxWidth),h(D,"id","customWidth"),h(N,"class","d-inline-block mt-2 ml-1 width20 float-left svelte-ogtz12"),h(f,"class","float-left mb-1 pr-2 "),h(u,"class","form-group row full_day mx-0 pt-2 pb-1 w-100 svelte-ogtz12"),J.value=L=t[0].stem,h(J,"class","form-control form-control-md px-2 min_height_38 text-dark svelte-ogtz12"),h(J,"style",V="outline:none;"),h(J,"cols","15"),h(J,"rows","1"),h(O,"class","topic_input text-center svelte-ogtz12"),h(O,"id","hello"),p(O,"background-color",t[1][t[0].theme],1),h(q,"class","table-head"),h(j,"class","table table-bordered relative w-100 ml-0 mt-0 svelte-ogtz12"),h(j,"id","my_table"),h(X,"class","table-responsive mt-4 d-flex align-items-center"),h(H,"class","text-danger font13"),h(lt,"class","font24 svelte-ogtz12"),h(et,"type","button"),h(et,"class","btn btn-outline-primary btn-sm add_stem pr-md ml-2 px-2"),h(et,"id","btn"),h(et,"style",nt="width: 122px;"),h(st,"class","font24 svelte-ogtz12"),h(ct,"type","button"),h(ct,"class","btn btn-outline-primary btn-sm add_option pr-md ml-2 px-2"),h(ct,"id","btn_opt"),h(ct,"style",mt="width: 122px;"),h(tt,"class","text-center"),h(tt,"style",ht="width:100%;"),h(d,"class","col-12 col-lg-12 p-0"),h(o,"id","authoring"),h(o,"class","p-2 border")},m(a,n){i(a,e,n),c(e,l),c(l,o),c(o,d),c(d,u),c(u,f),c(f,w),c(f,z),c(f,k);for(let t=0;t<_t.length;t+=1)_t[t].m(k,null);b(k,t[0].theme),c(f,C),c(f,F),c(f,E),c(f,D),c(f,A),c(f,N),c(d,M),c(d,X),c(X,j),c(j,I),c(I,q),c(q,O),c(O,J),c(q,Y),bt&&bt.m(q,null),c(j,P),c(j,U),wt&&wt.m(U,null),c(d,G),c(d,H),c(H,K),c(H,Q),c(H,R),c(d,Z),c(d,tt),c(tt,et),c(et,lt),c(et,ot),c(et,at),c(tt,it),c(tt,ct),c(ct,st),c(ct,rt),c(ct,dt),ut||(pt=[g(k,"click",t[12]),g(D,"keyup",t[13].bind(this)),g(D,"change",t[13].bind(this)),g(J,"change",t[4]),g(et,"click",t[7]),g(ct,"click",t[8])],ut=!0)},p(t,e){if(8&e[0]){let l;for(vt=t[3],l=0;l<vt.length;l+=1){const o=T(t,vt,l);_t[l]?_t[l].p(o,e):(_t[l]=S(o),_t[l].c(),_t[l].m(k,null))}for(;l<_t.length;l+=1)_t[l].d(1);_t.length=vt.length}1&e[0]&&y!==(y=t[0].theme)&&b(k,t[0].theme),1&e[0]&&W!==(W=parseInt(t[0].maxWidth))&&(D.value=W),1&e[0]&&L!==(L=t[0].stem)&&(J.value=L),1&e[0]&&p(O,"background-color",t[1][t[0].theme],1),t[0].cdata?bt?bt.p(t,e):(bt=B(t),bt.c(),bt.m(q,null)):bt&&(bt.d(1),bt=null),t[0].cdata?wt?wt.p(t,e):(wt=$(t),wt.c(),wt.m(U,null)):wt&&(wt.d(1),wt=null)},i:s,o:s,d(t){t&&r(e),v(_t,t),bt&&bt.d(),wt&&wt.d(),ut=!1,x(pt)}}}let I="icomoon-new-24px-delete-1 s3";function q(t,e,l){let o,{getChildXml:a}=e,{xml:n}=e,i="",c={};C({cdata:"",stem:"",xml:"",theme:"",font:"",maxWidth:""}).subscribe((t=>{l(0,c=t)}));function s(t){!function(t){let e=F.parseCSVFormat(t.smxml.__cdata),o=[];o=JSON.parse(JSON.stringify(e)),l(0,c.cdata=o,c),l(0,c.stem=o.stem,c),l(0,c.theme=t.smxml._theme,c),l(0,c.font=t.smxml._font,c),l(0,c.maxWidth=t.smxml._maxwidth?parseInt(t.smxml._maxwidth):800,c);let a=setTimeout((function(){let t=document.getElementsByClassName("preview_radio");for(let e=0;e<t.length;e++)t[e].checked=t[e].getAttribute("value")==t[e].getAttribute("data-correct");clearTimeout(a)}),200)}(t=y(t))}function r(){let t=function(t){let e=t.stem+",";return t.option.map((t=>{e+=t.text+","})),e+="\n",t.term.map(((l,o)=>{e+=l.text+",",t.option.map((t=>{e+=l.correct==t.id?"1,":"0,"})),e+="\n"})),e}(c.cdata);t=t.replace(/\’|\′/g,"'").replace(/\″|\“|\”/g,'"');let e=`<smxml type="27" name="ChoiceMatrix" theme="${c.theme}" font="${c.font}" maxwidth="${c.maxWidth}">\x3c!--[CDATA[${t}]]--\x3e</smxml>`;a(e)}return w((()=>{n!=c.xml&&(l(0,c.xml=n,c),s(n))})),z((()=>{k.listen(document,"keydown","textarea",(function(t){13==t.keyCode&&t.preventDefault()})),document.querySelector(".add_stem, .add_stem").addEventListener("click",(function(t){t.preventDefault()}));try{n&&(s(n),r())}catch(t){console.log({Error:t.message,File:"choiceMatrix",Line:"65"})}k.listen(document,"keydown",".delete_column",(function(t,e){13!=e.keyCode&&13!=e.which||(k.trigger(t,"click"),e.preventDefault())})),k.listen(document,"keydown",".delete_row",(function(t,e){13!=e.keyCode&&13!=e.which||(t.dispatchEvent(new Event("click")),e.preventDefault())}))})),t.$$set=t=>{"getChildXml"in t&&l(14,a=t.getChildXml),"xml"in t&&l(15,n=t.xml)},[c,{theme1:"#5B9BD5",theme2:"#3B67BC",theme3:"#F6C3A2",theme4:"#70AD47",theme5:"#745998"},{theme1:"#DEEAF6",theme2:"#D4DEF1",theme3:"#FAE0CF",theme4:"#E2EFD9",theme5:"#E1DAE9"},["light_blue","dark_blue","peach","green","purple"],function(t){l(0,c.stem=t.target.value,c),l(0,c.cdata.stem=t.target.value,c),r()},function(t){c.cdata&&c.cdata.term.map((function(e,l){e.id==t.target.id&&(e.text=t.target.value)})),r()},function(t){c.cdata&&c.cdata.option.map((function(e,l){e.id==t.target.id&&(e.text=t.target.value)})),r()},function(){let t=c.cdata.term.length+1;t<=6?(c.cdata.term.push({id:"t"+t,correct:"",text:"Term Sample text"}),r()):k.alert("Maximum possible value of rows are 6.")},function(){let t=c.cdata.option.length+1;t<=4?(c.cdata.option.push({id:"o"+t,text:"Option"}),r()):k.alert("Maximum possible value of columns are 4.")},function(t){if(c.cdata.term.length>2){let e=[],o=1;c.cdata.term.map((function(e,l){e.id==t&&c.cdata.term.splice(l,1)})),c.cdata.term.map((function(t,l){e.push({id:"t"+o,correct:t.correct,text:t.text}),o++})),l(0,c.cdata.term=e,c);let a=document.getElementsByClassName("preview_radio");for(let t=0;t<a;t++)a[t].checked=!1;r()}else k.alert("You must have at least two rows.")},function(t){if(c.cdata.option.length>2){let e=[],o=1;c.cdata.option.map((function(e,l){e.id==t&&c.cdata.option.splice(l,1)})),c.cdata.option.map((function(t,l){e.push({id:"o"+o,text:t.text}),o++})),c.cdata&&c.cdata.term.map((function(t,e){t.correct=""})),l(0,c.cdata.option=e,c),r()}else k.alert("You must have at least two columns.")},function(t){let e=t.target.name-1;l(0,c.cdata.term[e].correct=t.target.value,c),r()},function(t){l(0,c.theme=t.target.value,c),r()},function(){i=document.querySelector("#customWidth").value,document.getElementById("test_table").style.width=i+"px",o&&clearTimeout(o),o=setTimeout((function(){if(i<500){l(0,c.maxWidth=500,c);let t=setTimeout((function(){r(),clearTimeout(t)}),100);k.alert("Width should not be less than 500px")}if(i>1e3){l(0,c.maxWidth=1e3,c);let t=setTimeout((function(){r(),clearTimeout(t)}),100);k.alert("Width should not be greater than 1000px")}}),1500),l(0,c.maxWidth=i,c),r()},a,n]}export default class extends t{constructor(t){super(),e(this,t,q,j,l,{getChildXml:14,xml:15},E,[-1,-1])}}
//# sourceMappingURL=ChoiceMatrix-5b4d2f96.js.map
