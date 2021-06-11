import{S as e,i as t,s as l,Z as n,I as o,K as i,H as a,e as s,$ as r,b as c,c as d,f as u,g as p,h as m,j as f,m as h,l as v,M as g,t as x,a as b,o as _,d as $,p as w,A as C,X as y,w as k,O as H,r as S,u as A,q as T,W as X}from"./main-a1cb066e.js";for(var D=["database-icon","table-icon","file-icon","user-group-icon","tools-icon","document-icon","key-icon","pencil-icon","circle-icon","square-icon"],I='<div class="table-responsive"><table class="table editor_table table-hover icons_table w-100"><thead><tr><th>Preview</th><th>Icon Name</th></tr></thead><tbody>',L=0;L<D.length;L++)I+=`<tr><td><span class="${D[L]}"></span></td><td class="search">${D[L]}</td></tr>`;var M={icons_html:I+="</tbody></table></div>"};function z(e){let t;return{c(){t=s("span"),t.textContent="Sort Options"},m(e,l){m(e,t,l)},d(e){e&&_(t)}}}function O(e){let t;return{c(){t=s("div"),t.textContent="Icon List",u(t,"slot","title")},m(e,l){m(e,t,l)},d(e){e&&_(t)}}}function E(e){let t;return{c(){t=s("div"),t.textContent=""+r.loading_icons,u(t,"class","alert alert-info my-2")},m(e,l){m(e,t,l)},p:S,d(e){e&&_(t)}}}function j(e){let t,l;return{c(){l=T(),t=new X(l)},m(n,o){t.m(e[1],n,o),m(n,l,o)},p:S,d(e){e&&_(l),e&&t.d()}}}function q(e){let t;return{c(){t=A("Close")},m(e,l){m(e,t,l)},d(e){e&&_(t)}}}function K(e){let t,l,n;return l=new H({props:{color:"secondary",raised:"true",title:"close button",$$slots:{default:[q]},$$scope:{ctx:e}}}),l.$on("click",e[3]),{c(){t=s("div"),d(l.$$.fragment),u(t,"slot","footer"),p(t,"border-top","1px solid var(--divider, rgba(0, 0, 0, 0.1))")},m(e,o){m(e,t,o),h(l,t,null),n=!0},p(e,t){const n={};65536&t&&(n.$$scope={dirty:t,ctx:e}),l.$set(n)},i(e){n||(x(l.$$.fragment,e),n=!0)},o(e){b(l.$$.fragment,e),n=!1},d(e){e&&_(t),$(l)}}}function P(e){let t,l,n,o,i,a,d,p,h,g;let x=function(e,t){return e[1]?j:E}(e)(e);return{c(){t=c(),l=s("div"),n=s("input"),o=c(),i=s("div"),i.textContent=""+r.no_icons,a=c(),d=s("div"),x.c(),p=c(),u(n,"type","text"),u(n,"id","tableSearch"),u(n,"placeholder","Search Icons"),u(n,"class","form-control"),u(i,"class","alert alert-danger treeview_record my-2 h"),u(d,"class","treemodule_table"),u(l,"class","text-center")},m(s,r){m(s,t,r),m(s,l,r),f(l,n),f(l,o),f(l,i),f(l,a),f(l,d),x.m(d,null),m(s,p,r),h||(g=v(n,"keyup",e[9]),h=!0)},p(e,t){x.p(e,t)},i:S,o:S,d(e){e&&_(t),e&&_(l),x.d(),e&&_(p),h=!1,g()}}}function N(e){let t,l,w,C,y,k,H,S,A,T,X,D,I,L,M,E,j,q,N,R,W,Z,B,F,G,J,Q,U,V,Y,ee,te,le,ne,oe,ie,ae,se,re,ce,de,ue,pe,me,fe,he,ve,ge,xe,be,_e,$e;function we(t){e[8].call(null,t)}let Ce={id:"sort",value:"Sort Options",name:"sort",title:"Sort Options",$$slots:{default:[z]},$$scope:{ctx:e}};function ye(t){e[10].call(null,t)}void 0!==e[0].sort&&(Ce.checked=e[0].sort),ee=new n({props:Ce}),o.push((()=>i(ee,"checked",we)));let ke={width:"400",$$slots:{default:[P],footer:[K],title:[O]},$$scope:{ctx:e}};return void 0!==e[0].openHelp&&(ke.visible=e[0].openHelp),ge=new a({props:ke}),o.push((()=>i(ge,"visible",ye))),{c(){t=s("main"),l=s("div"),w=s("center"),C=s("div"),y=s("div"),k=s("div"),H=s("div"),S=s("div"),A=s("div"),T=s("label"),T.textContent=""+r.heading_correct,X=c(),D=s("input"),I=c(),L=s("div"),M=s("div"),E=s("label"),E.textContent=""+r.heading_all,j=c(),q=s("input"),N=c(),R=s("div"),W=s("div"),W.innerHTML='<div class="text-left"><label for="parent_icon" class="text-dark"># icon</label></div> \n                                <input type="text" id="parent_icon" class="form-control"/>',Z=c(),B=s("div"),B.innerHTML='<div class="text-left"><label for="subparent_icon" class="text-dark">## icon</label></div> \n                                <input type="text" id="subparent_icon" class="form-control"/>',F=c(),G=s("div"),G.innerHTML='<div class="text-left"><label for="default_icon" class="text-dark">### icon</label></div> \n                                <input type="text" id="default_icon" class="form-control"/>',J=c(),Q=s("div"),U=s("button"),U.textContent="Icons List",V=c(),Y=s("div"),d(ee.$$.fragment),le=c(),ne=s("textarea"),oe=c(),ie=s("textarea"),ae=c(),se=s("div"),re=s("strong"),re.textContent=""+r.note_text,ce=c(),de=s("ol"),ue=s("li"),ue.textContent=""+r.select_icon,pe=c(),me=s("li"),me.textContent=""+r.heading_info,fe=c(),he=s("li"),he.textContent=""+r.key_info,ve=c(),d(ge.$$.fragment),u(T,"for","headingcorrect"),u(T,"class","text-dark"),u(A,"class","text-left"),u(D,"type","text"),u(D,"id","headingcorrect"),u(D,"defaultvalue"," "),u(D,"class","form-control"),u(S,"class","border-0 col-6 pr-1"),u(E,"for","headingall"),u(E,"class","text-dark"),u(M,"class","text-left"),u(q,"type","text"),u(q,"id","headingall"),u(q,"defaultvalue"," "),u(q,"class","form-control"),u(L,"class","border-0 col-6 pl-1"),u(H,"class","row my-2"),u(W,"class","border-0 col-3 pr-1"),u(B,"class","border-0 col-3 pl-1"),u(G,"class","border-0 col-3 pl-1"),u(U,"class","btn btn-outline-primary w-100"),u(U,"id","icons_info"),u(Q,"class","border-0 col-3 pl-1"),p(Q,"top","28px"),u(R,"class","row mt-2"),u(Y,"class","text-left"),u(ne,"id","tree"),u(ne,"wrap","off"),u(ne,"class","sm_input_textarea mb-0 resize_none"),p(ne,"height","150px"),u(ie,"id","options"),u(ie,"wrap","off"),p(ie,"height","100px"),u(ie,"class","sm_input_textarea mt-2 resize_none mb-0"),u(ie,"placeholder","Key|Option text|Icon (Put comma after each line)"),u(y,"class","border-0"),p(y,"width","95%"),u(re,"class","ml-lg-3"),u(se,"class","font13 mx-3 text-left text-danger"),u(C,"id","main"),u(C,"class","py-3 min_height_20 width98"),u(l,"id","authoringArea"),u(l,"class","border")},m(n,o){m(n,t,o),f(t,l),f(l,w),f(w,C),f(C,y),f(y,k),f(k,H),f(H,S),f(S,A),f(A,T),f(S,X),f(S,D),f(H,I),f(H,L),f(L,M),f(M,E),f(L,j),f(L,q),f(k,N),f(k,R),f(R,W),f(R,Z),f(R,B),f(R,F),f(R,G),f(R,J),f(R,Q),f(Q,U),f(k,V),f(k,Y),h(ee,Y,null),f(k,le),f(k,ne),f(k,oe),f(k,ie),f(C,ae),f(C,se),f(se,re),f(se,ce),f(se,de),f(de,ue),f(de,pe),f(de,me),f(de,fe),f(de,he),f(t,ve),h(ge,t,null),be=!0,_e||($e=v(U,"click",e[2]),_e=!0)},p(e,[t]){const l={};65536&t&&(l.$$scope={dirty:t,ctx:e}),!te&&1&t&&(te=!0,l.checked=e[0].sort,g((()=>te=!1))),ee.$set(l);const n={};65536&t&&(n.$$scope={dirty:t,ctx:e}),!xe&&1&t&&(xe=!0,n.visible=e[0].openHelp,g((()=>xe=!1))),ge.$set(n)},i(e){be||(x(ee.$$.fragment,e),x(ge.$$.fragment,e),be=!0)},o(e){b(ee.$$.fragment,e),b(ge.$$.fragment,e),be=!1},d(e){e&&_(t),$(ee),$(ge),_e=!1,$e()}}}function R(e,t,l){let{xml:n}=t,{getChildXml:o}=t,{visible:i=!1}=t,a=0,s=M.icons_html,c={};k({xml:"",sort:!1,allowSort:1,openHelp:!1}).subscribe((e=>{l(0,c=e)}));function d(){let e=C.parseHtml(c.xml),t=C.findChild(e,"tree");a=C.select("#sort").checked?1:0,t||(t=C.findChild(e,"list")),""!=C.select("#headingcorrect").value&&""!=C.select("#headingall").value||C.showmsg("Heading should not be blank!");let n=C.select("#parent_icon").value,i=C.select("#subparent_icon").value,s=C.select("#default_icon").value,d="database-icon,table-icon,file-icon";""!=n.trim()&&""!=i.trim()&&""!=s.trim()?d=n+","+i+","+s:AI&&AI.showmsg(r.icon_not_blank),t&&(C.setAttr(t,{headingCorrect:C.select("#headingcorrect").value,headingAll:C.select("#headingall").value,options:C.select("#options").value.trim().replace(/\\n{2,}/g,"\\n").replace(/\\n/g,","),sort:a,allowSort:1,icons:d}),t.innerHTML="<![CDATA[\n"+C.select("#tree").value+"\n]]>"),l(0,c.xml=formatXml(e.xml?e.xml:(new XMLSerializer).serializeToString(e)),c),o(formatXml(e.xml?e.xml:(new XMLSerializer).serializeToString(e)))}function u(e,t){var l=C.select(t);C.toggleDom(l,"show"),""==e.trim()?(C.selectAll(".treeview_record","hide"),C.selectAll(t+" tr","show")):C.select(l,"visible")&&(C.find(l,"tr","all").forEach(((t,l)=>{var n=C.find(t,".search","all");if(n.length>0){var o=!1;n.forEach(((t,l)=>{if(new RegExp(e,"i").test(t.textContent))return o=!0,!1})),1==o?C.toggleDom(t,"show"):C.toggleDom(t,"hide")}})),C.find(l,".search","visible").length>0?(C.selectAll(".treeview_record","hide"),C.toggleDom(l,"show")):(C.toggleDom(".treeview_record","show"),C.toggleDom(l,"hide")))}w((()=>{l(0,c.xml=n,c),function(e){var t=y(e),n=t.smxml.tree?t.smxml.tree:t.smxml.list;if(n){n._options&&(C.select("#options").value=n._options),C.select("#tree").value=n.__cdata.replace(/\t/gim,""),"0"!=n._allowSort?l(0,c.allowSort=!0,c):"0"!=n._allowsort&&l(0,c.allowsort=!0,c),n._headingCorrect?C.select("#headingcorrect").value=n._headingCorrect:n._headingcorrect&&(C.select("#headingcorrect").value=n._headingcorrect),n._headingAll?C.select("#headingall").value=n._headingAll:n._headingall&&(C.select("#headingall").value=n._headingall),1==n._sort?l(0,c.sort=!0,c):l(0,c.sort=!1,c);let e=["database-icon","table-icon","file-icon"];if(n.icons){let t=n.icons.split(",");e=3==t.length?t:e}C.select("#parent_icon").value=e[0],C.select("#subparent_icon").value=e[1],C.select("#default_icon").value=e[2]}d()}(n),C.bind("#main","keyup",(()=>{var e=setTimeout(function(){d(),clearTimeout(e)}.bind(this),500)})),C.bind("#main","click",(()=>{d()})),C.listen(document,"click","#xmlDone",(()=>{window.xml_button_clicked=!0}))}));return e.$$set=e=>{"xml"in e&&l(6,n=e.xml),"getChildXml"in e&&l(7,o=e.getChildXml),"visible"in e&&l(5,i=e.visible)},[c,s,function(){l(0,c.openHelp=!0,c),l(5,i=!0)},function(){l(5,i=!1),l(0,c.openHelp=!1,c)},u,i,n,o,function(e){c.sort=e,l(0,c)},e=>{u(e.target.value,".icons_table")},function(e){c.openHelp=e,l(0,c)}]}export default class extends e{constructor(e){super(),t(this,e,R,N,l,{xml:6,getChildXml:7,visible:5})}}
//# sourceMappingURL=TreeViewAuthoring-ecede2af.js.map
