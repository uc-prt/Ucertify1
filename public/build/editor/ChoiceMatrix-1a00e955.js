import{S as t,i as e,s as l,F as a,e as n,u as o,h as m,j as i,r as d,o as c,q as s,b as r,f as h,Y as u,g as p,l as f,v as x,y as g,D as v,a2 as _,T as b,a4 as w,p as z,A as k,X as y,w as C}from"./main-55cf766a.js";import{l as F}from"./parseCSV-929be628.js";function E(t){a(t,"svelte-dt0zmm",".fa-check.svelte-dt0zmm{color:#46A546}.fa-close.svelte-dt0zmm{color:#A80000}.fa-close.svelte-dt0zmm,.fa-check.svelte-dt0zmm{margin-left:9px;font-size:18px}.fa-close.svelte-dt0zmm,.fa-check.svelte-dt0zmm,.middle_align.svelte-dt0zmm{vertical-align:middle!important}.middle_align.svelte-dt0zmm{width:164px;min-width:164px}.topic_input.svelte-dt0zmm{min-width:257px}.preview_header.svelte-dt0zmm{font-size:16pt;font-weight:bold;vertical-align:middle}.adjust_width.svelte-dt0zmm{width:12%;text-align:center}.width180.svelte-dt0zmm{width:180px}.width150.svelte-dt0zmm{width:150px}.full_day.svelte-dt0zmm{background-color:#eee !important;color:#000 !important}.width90.svelte-dt0zmm{width:90px}.width20.svelte-dt0zmm{width:20px}.relative.svelte-dt0zmm{position:relative}.min_height_38.svelte-dt0zmm{min-height:38px}.min_width_200.svelte-dt0zmm{min-width:200px !important}.min_width_125.svelte-dt0zmm{min-width:125px}.max_width_150.svelte-dt0zmm{max-width:150px !important}.height34.svelte-dt0zmm{height:34px !important}.width_90.svelte-dt0zmm{width:90%}.font24.svelte-dt0zmm{font-size:15px !important}.iconPos.svelte-dt0zmm{position:relative;top:5px}")}function D(t,e,l){const a=t.slice();return a[24]=e[l],a[26]=l,a}function W(t,e,l){const a=t.slice();return a[27]=e[l],a[29]=l,a}function A(t,e,l){const a=t.slice();return a[24]=e[l],a[26]=l,a}function T(t,e,l){const a=t.slice();return a[31]=e[l],a[26]=l,a}function S(t){let e,l,a,s=_[t[31]]+"";return{c(){e=n("option"),l=o(s),e.__value=a="theme"+ ++t[26],e.value=e.__value},m(t,a){m(t,e,a),i(e,l)},p:d,d(t){t&&c(e)}}}function B(t){let e,l=t[0].cdata.option,a=[];for(let e=0;e<l.length;e+=1)a[e]=N(A(t,l,e));return{c(){for(let t=0;t<a.length;t+=1)a[t].c();e=s()},m(t,l){for(let e=0;e<a.length;e+=1)a[e].m(t,l);m(t,e,l)},p(t,n){if(1091&n[0]){let o;for(l=t[0].cdata.option,o=0;o<l.length;o+=1){const m=A(t,l,o);a[o]?a[o].p(m,n):(a[o]=N(m),a[o].c(),a[o].m(e.parentNode,e))}for(;o<a.length;o+=1)a[o].d(1);a.length=l.length}},d(t){v(a,t),t&&c(e)}}}function N(t){let e,l,a,o,d,s,v,_,b,w,z,k,y,C;return{c(){e=n("th"),l=n("div"),a=n("textarea"),s=r(),v=n("div"),_=n("span"),w=r(),h(a,"id",o=t[24].id),a.value=d=t[24].text,h(a,"class","form-control form-control-md px-2 min_height_38 text-dark svelte-dt0zmm"),h(a,"cols","10"),h(a,"rows","1"),h(l,"class","float-left"),h(_,"class",b=u(I)+" svelte-dt0zmm"),h(v,"class","float-left pointer pt-1 ml-2 delete_column height35 top1 position-relative"),h(v,"tab-index","0"),h(e,"key",z=t[26]),h(e,"class",k=u("middle_align text-center "+t[24].id)+" svelte-dt0zmm"),p(e,"background-color",t[1][t[0].theme],1)},m(n,o){m(n,e,o),i(e,l),i(l,a),i(e,s),i(e,v),i(v,_),i(e,w),y||(C=[f(a,"change",t[6]),f(v,"click",(function(){x(t[10].bind(this,t[24].id))&&t[10].bind(this,t[24].id).apply(this,arguments)}))],y=!0)},p(l,n){t=l,1&n[0]&&o!==(o=t[24].id)&&h(a,"id",o),1&n[0]&&d!==(d=t[24].text)&&(a.value=d),1&n[0]&&k!==(k=u("middle_align text-center "+t[24].id)+" svelte-dt0zmm")&&h(e,"class",k),1&n[0]&&p(e,"background-color",t[1][t[0].theme],1)},d(t){t&&c(e),y=!1,g(C)}}}function $(t){let e,l=t[0].cdata.term,a=[];for(let e=0;e<l.length;e+=1)a[e]=X(D(t,l,e));return{c(){for(let t=0;t<a.length;t+=1)a[t].c();e=s()},m(t,l){for(let e=0;e<a.length;e+=1)a[e].m(t,l);m(t,e,l)},p(t,n){if(2597&n[0]){let o;for(l=t[0].cdata.term,o=0;o<l.length;o+=1){const m=D(t,l,o);a[o]?a[o].p(m,n):(a[o]=X(m),a[o].c(),a[o].m(e.parentNode,e))}for(;o<a.length;o+=1)a[o].d(1);a.length=l.length}},d(t){v(a,t),t&&c(e)}}}function M(t){let e,l,a,o,d,s,r,u,x,g,v;return{c(){e=n("td"),l=n("label"),a=n("input"),h(a,"type","radio"),h(a,"class","preview_radio align-middle"),a.value=o=t[27].id,h(a,"name",d=t[26]+1),h(a,"id",s="a"+t[26]+t[29]),h(a,"data-correct",r=t[24].correct),h(l,"class","label_choice pointer d-block w-100 mb-0"),h(l,"for",u="a"+t[26]+t[29]),h(e,"class","text-center align-middle h-auto min_width_125 max_width_150 svelte-dt0zmm"),h(e,"key",x=t[29]),p(e,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1)},m(n,o){m(n,e,o),i(e,l),i(l,a),g||(v=f(a,"click",t[11]),g=!0)},p(t,l){1&l[0]&&o!==(o=t[27].id)&&(a.value=o),1&l[0]&&r!==(r=t[24].correct)&&h(a,"data-correct",r),1&l[0]&&p(e,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1)},d(t){t&&c(e),g=!1,v()}}}function X(t){let e,l,a,o,d,s,_,b,w,z,k,y,C,F,E,D=t[0].cdata.option,A=[];for(let e=0;e<D.length;e+=1)A[e]=M(W(t,D,e));return{c(){e=n("tr"),l=n("td"),a=n("textarea"),s=r(),_=n("div"),b=n("span"),k=r();for(let t=0;t<A.length;t+=1)A[t].c();y=r(),h(a,"id",o=t[24].id),a.value=d=t[24].text,h(a,"class","form-control form-control-md width_90 float-left min_height_38 mr-2 svelte-dt0zmm"),p(a,"outline","none"),p(a,"height","38px"),h(b,"class",w=I+"+ iconPos svelte-dt0zmm"),h(_,"class","pointer pt-1 mt-sm2 ml-2 delete_row height34 svelte-dt0zmm"),h(_,"tab-index","0"),h(l,"class",z=u("min_width_200 h-auto "+t[24].id)+" svelte-dt0zmm"),p(l,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1),h(e,"key",C=t[26])},m(n,o){m(n,e,o),i(e,l),i(l,a),i(l,s),i(l,_),i(_,b),i(e,k);for(let t=0;t<A.length;t+=1)A[t].m(e,null);i(e,y),F||(E=[f(a,"input",t[5]),f(_,"click",(function(){x(t[9].bind(this,t[24].id))&&t[9].bind(this,t[24].id).apply(this,arguments)}))],F=!0)},p(n,m){if(t=n,1&m[0]&&o!==(o=t[24].id)&&h(a,"id",o),1&m[0]&&d!==(d=t[24].text)&&(a.value=d),1&m[0]&&z!==(z=u("min_width_200 h-auto "+t[24].id)+" svelte-dt0zmm")&&h(l,"class",z),1&m[0]&&p(l,"background-color",t[26]%2==0?t[2][t[0].theme]:"#FFF",1),2053&m[0]){let l;for(D=t[0].cdata.option,l=0;l<D.length;l+=1){const a=W(t,D,l);A[l]?A[l].p(a,m):(A[l]=M(a),A[l].c(),A[l].m(e,y))}for(;l<A.length;l+=1)A[l].d(1);A.length=D.length}},d(t){t&&c(e),v(A,t),F=!1,g(E)}}}function j(t){let e,l,a,s,u,x,w,z,k,y,C,F,E,D,W,A,N,M,X,j,I,q,O,Y,J,L,P,V,G,H,K,Q,R,U,Z,tt,et,lt,at,nt,ot,mt,it,dt,ct,st,rt,ht,ut,pt,ft=_.comment_choiceMatrix+"",xt=_.add_row+"",gt=_.add_column+"",vt=t[3],_t=[];for(let e=0;e<vt.length;e+=1)_t[e]=S(T(t,vt,e));let bt=t[0].cdata&&B(t),wt=t[0].cdata&&$(t);return{c(){e=n("main"),l=n("div"),a=n("div"),s=n("div"),u=n("div"),x=n("div"),w=n("label"),w.textContent=""+_.themes,z=r(),k=n("select");for(let t=0;t<_t.length;t+=1)_t[t].c();C=r(),F=n("label"),F.textContent=""+_.table_width,E=r(),D=n("input"),A=r(),N=n("span"),N.textContent="px",M=r(),X=n("div"),j=n("table"),I=n("thead"),q=n("tr"),O=n("th"),Y=n("textarea"),P=r(),bt&&bt.c(),V=r(),G=n("tbody"),wt&&wt.c(),H=r(),K=n("small"),Q=n("strong"),Q.textContent="* "+_.note_label,R=r(),U=o(ft),Z=r(),tt=n("div"),et=n("button"),lt=n("span"),lt.textContent="+",at=r(),nt=o(xt),mt=r(),it=n("button"),dt=n("span"),dt.textContent="+",ct=r(),st=o(gt),h(w,"for","select_themes"),h(w,"class","mb-0 pl-1 mt-2 mr-2 float-left"),h(k,"class","form-select form-control-md px-2 enroll_date_td width150 float-left svelte-dt0zmm"),h(k,"id","select_themes"),h(k,"name","select_themes"),h(F,"for","customWidth"),h(F,"class","mb-0 mt-2 mr-2 ml-2 float-left"),h(D,"class","form-control form-control-md px-2 width90 float-left svelte-dt0zmm"),h(D,"step","10"),h(D,"min","500"),h(D,"max","1000"),h(D,"type","number"),D.value=W=parseInt(t[0].maxWidth),h(D,"id","customWidth"),h(N,"class","d-inline-block mt-2 ml-1 width20 float-left svelte-dt0zmm"),h(x,"class","float-left mb-1 pr-2 "),h(u,"class","form-group row full_day mx-0 pt-2 pb-1 w-100 svelte-dt0zmm"),Y.value=J=t[0].stem,h(Y,"class","form-control form-control-md px-2 min_height_38 text-dark svelte-dt0zmm"),h(Y,"style",L="outline:none;"),h(Y,"cols","15"),h(Y,"rows","1"),h(O,"class","topic_input text-center svelte-dt0zmm"),h(O,"id","hello"),p(O,"background-color",t[1][t[0].theme],1),h(q,"class","table-head"),h(j,"class","table table-bordered relative w-100 ml-0 mt-0 svelte-dt0zmm"),h(j,"id","my_table"),h(X,"class","table-responsive mt-4 d-flex align-items-center"),h(K,"class","text-danger font13"),h(lt,"class","font24 svelte-dt0zmm"),h(et,"type","button"),h(et,"class","btn btn-outline-primary btn-sm add_stem pr-md ml-2 px-2"),h(et,"id","btn"),h(et,"style",ot="width: 122px;"),h(dt,"class","font24 svelte-dt0zmm"),h(it,"type","button"),h(it,"class","btn btn-outline-primary btn-sm add_option pr-md ml-2 px-2"),h(it,"id","btn_opt"),h(it,"style",rt="width: 122px;"),h(tt,"class","text-center"),h(tt,"style",ht="width:100%;"),h(s,"class","col-12 col-lg-12 p-0"),h(a,"id","authoring"),h(a,"class","p-2 border")},m(n,o){m(n,e,o),i(e,l),i(l,a),i(a,s),i(s,u),i(u,x),i(x,w),i(x,z),i(x,k);for(let t=0;t<_t.length;t+=1)_t[t].m(k,null);b(k,t[0].theme),i(x,C),i(x,F),i(x,E),i(x,D),i(x,A),i(x,N),i(s,M),i(s,X),i(X,j),i(j,I),i(I,q),i(q,O),i(O,Y),i(q,P),bt&&bt.m(q,null),i(j,V),i(j,G),wt&&wt.m(G,null),i(s,H),i(s,K),i(K,Q),i(K,R),i(K,U),i(s,Z),i(s,tt),i(tt,et),i(et,lt),i(et,at),i(et,nt),i(tt,mt),i(tt,it),i(it,dt),i(it,ct),i(it,st),ut||(pt=[f(k,"click",t[12]),f(D,"keyup",t[13].bind(this)),f(D,"change",t[13].bind(this)),f(Y,"change",t[4]),f(et,"click",t[7]),f(it,"click",t[8])],ut=!0)},p(t,e){if(8&e[0]){let l;for(vt=t[3],l=0;l<vt.length;l+=1){const a=T(t,vt,l);_t[l]?_t[l].p(a,e):(_t[l]=S(a),_t[l].c(),_t[l].m(k,null))}for(;l<_t.length;l+=1)_t[l].d(1);_t.length=vt.length}1&e[0]&&y!==(y=t[0].theme)&&b(k,t[0].theme),1&e[0]&&W!==(W=parseInt(t[0].maxWidth))&&(D.value=W),1&e[0]&&J!==(J=t[0].stem)&&(Y.value=J),1&e[0]&&p(O,"background-color",t[1][t[0].theme],1),t[0].cdata?bt?bt.p(t,e):(bt=B(t),bt.c(),bt.m(q,null)):bt&&(bt.d(1),bt=null),t[0].cdata?wt?wt.p(t,e):(wt=$(t),wt.c(),wt.m(G,null)):wt&&(wt.d(1),wt=null)},i:d,o:d,d(t){t&&c(e),v(_t,t),bt&&bt.d(),wt&&wt.d(),ut=!1,g(pt)}}}let I="icomoon-new-24px-delete-1 s3";function q(t,e,l){let a,{getChildXml:n}=e,{xml:o}=e,m="",i={};C({cdata:"",stem:"",xml:"",theme:"",font:"",maxWidth:""}).subscribe((t=>{l(0,i=t)}));function d(t){!function(t){let e=F.parseCSVFormat(t.smxml.__cdata),a=[];a=JSON.parse(JSON.stringify(e)),l(0,i.cdata=a,i),l(0,i.stem=a.stem,i),l(0,i.theme=t.smxml._theme,i),l(0,i.font=t.smxml._font,i),l(0,i.maxWidth=t.smxml._maxwidth?parseInt(t.smxml._maxwidth):800,i);let n=setTimeout((function(){let t=document.getElementsByClassName("preview_radio");for(let e=0;e<t.length;e++)t[e].checked=t[e].getAttribute("value")==t[e].getAttribute("data-correct");clearTimeout(n)}),200)}(t=y(t))}function c(){let t=function(t){let e=t.stem+",";return t.option.map((t=>{e+=t.text+","})),e+="\n",t.term.map(((l,a)=>{e+=l.text+",",t.option.map((t=>{e+=l.correct==t.id?"1,":"0,"})),e+="\n"})),e}(i.cdata);t=t.replace(/\’|\′/g,"'").replace(/\″|\“|\”/g,'"');let e=`<smxml type="27" name="ChoiceMatrix" theme="${i.theme}" font="${i.font}" maxwidth="${i.maxWidth}">\x3c!--[CDATA[${t}]]--\x3e</smxml>`;n(e)}return w((()=>{o!=i.xml&&(l(0,i.xml=o,i),d(o))})),z((()=>{k.listen(document,"keydown","textarea",(function(t){13==t.keyCode&&t.preventDefault()})),document.querySelector(".add_stem, .add_stem").addEventListener("click",(function(t){t.preventDefault()}));try{o&&(d(o),c())}catch(t){console.log({Error:t.message,File:"choiceMatrix",Line:"65"})}k.listen(document,"keydown",".delete_column",(function(t,e){13!=e.keyCode&&13!=e.which||(k.trigger(t,"click"),e.preventDefault())})),k.listen(document,"keydown",".delete_row",(function(t,e){13!=e.keyCode&&13!=e.which||(t.dispatchEvent(new Event("click")),e.preventDefault())}))})),t.$$set=t=>{"getChildXml"in t&&l(14,n=t.getChildXml),"xml"in t&&l(15,o=t.xml)},[i,{theme1:"#5B9BD5",theme2:"#3B67BC",theme3:"#F6C3A2",theme4:"#70AD47",theme5:"#745998"},{theme1:"#DEEAF6",theme2:"#D4DEF1",theme3:"#FAE0CF",theme4:"#E2EFD9",theme5:"#E1DAE9"},["light_blue","dark_blue","peach","green","purple"],function(t){l(0,i.stem=t.target.value,i),l(0,i.cdata.stem=t.target.value,i),c()},function(t){i.cdata&&i.cdata.term.map((function(e,l){e.id==t.target.id&&(e.text=t.target.value)})),c()},function(t){i.cdata&&i.cdata.option.map((function(e,l){e.id==t.target.id&&(e.text=t.target.value)})),c()},function(){let t=i.cdata.term.length+1;t<=6?(i.cdata.term.push({id:"t"+t,correct:"",text:"Term Sample text"}),c()):k.alert("Maximum possible value of rows are 6.")},function(){let t=i.cdata.option.length+1;t<=4?(i.cdata.option.push({id:"o"+t,text:"Option"}),c()):k.alert("Maximum possible value of columns are 4.")},function(t){if(i.cdata.term.length>2){let e=[],a=1;i.cdata.term.map((function(e,l){e.id==t&&i.cdata.term.splice(l,1)})),i.cdata.term.map((function(t,l){e.push({id:"t"+a,correct:t.correct,text:t.text}),a++})),l(0,i.cdata.term=e,i);let n=document.getElementsByClassName("preview_radio");for(let t=0;t<n;t++)n[t].checked=!1;c()}else k.alert("You must have at least two rows.")},function(t){if(i.cdata.option.length>2){let e=[],a=1;i.cdata.option.map((function(e,l){e.id==t&&i.cdata.option.splice(l,1)})),i.cdata.option.map((function(t,l){e.push({id:"o"+a,text:t.text}),a++})),i.cdata&&i.cdata.term.map((function(t,e){t.correct=""})),l(0,i.cdata.option=e,i),c()}else k.alert("You must have at least two columns.")},function(t){let e=t.target.name-1;l(0,i.cdata.term[e].correct=t.target.value,i),c()},function(t){l(0,i.theme=t.target.value,i),c()},function(){m=document.querySelector("#customWidth").value,document.getElementById("test_table").style.width=m+"px",a&&clearTimeout(a),a=setTimeout((function(){if(m<500){l(0,i.maxWidth=500,i);let t=setTimeout((function(){c(),clearTimeout(t)}),100);k.alert("Width should not be less than 500px")}if(m>1e3){l(0,i.maxWidth=1e3,i);let t=setTimeout((function(){c(),clearTimeout(t)}),100);k.alert("Width should not be greater than 1000px")}}),1e3),l(0,i.maxWidth=m,i),c()},n,o]}export default class extends t{constructor(t){super(),e(this,t,q,j,l,{getChildXml:14,xml:15},E,[-1,-1])}}
//# sourceMappingURL=ChoiceMatrix-1a00e955.js.map
