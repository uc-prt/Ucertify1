import{S as e,i as t,s as l,e as s,u as a,b as o,f as i,h as r,j as n,x as c,r as d,o as u,a1 as g,ad as m,c as h,M as b,m as p,l as _,t as v,a as f,d as x,a3 as A,p as C,A as y,a2 as w,X as S,J as k,w as L}from"./main-91b4ef6d.js";import{D as M}from"./Draggable-721df1da.js";import{R as N}from"./Resizable-191e4862.js";function T(e){let t,l,g,m,h,b,p,_,v,f,x,A,C,y,w,S,k,L,M,N,T,P,I,z,D,F,W,E,B,X,H,$,Y,j,O,R,Z,G,J,q,K,Q,U,V,ee,te,le,se,ae,oe,ie,re,ne,ce,de,ue,ge,me,he,be,pe,_e,ve,fe,xe,Ae,Ce,ye,we,Se,ke,Le,Me,Ne,Te,Pe,Ie,ze,De,Fe,We,Ee,Be,Xe,He,$e,Ye,je,Oe,Re,Ze,Ge,Je,qe,Ke,Qe,Ue,Ve,et,tt,lt,st,at,ot,it,rt=e[0].configuration+"",nt=e[0].background_image+"",ct=e[0].upload_media_text+"",dt=e[0].alt_txt_image+"",ut=e[0].width_of_image+"",gt=e[0].draw_color+"",mt=e[0].red+"",ht=e[0].green+"",bt=e[0].light_blue+"",pt=e[0].blue+"",_t=e[0].markPointColor+"",vt=e[0].lightGreen+"",ft=e[0].black+"",xt=e[0].orange+"",At=e[0].tools+"",Ct=e[0].scribble+"",yt=e[0].line+"",wt=e[0].compass+"",St=e[0].cancel+"",kt=e[0].submit+"";return{c(){t=s("div"),l=s("div"),g=s("div"),m=s("div"),h=s("h4"),b=a(rt),p=o(),_=s("button"),_.textContent="×",v=o(),f=s("div"),x=s("div"),A=s("div"),C=s("div"),y=s("div"),w=s("label"),S=a(nt),k=o(),L=s("input"),M=o(),N=s("div"),T=s("button"),P=a(ct),z=o(),D=s("div"),F=s("div"),W=s("div"),E=s("label"),B=s("span"),X=a(dt),H=o(),$=s("input"),Y=o(),j=s("div"),O=s("div"),R=s("div"),Z=s("label"),G=s("span"),J=a(ut),q=o(),K=s("input"),Q=o(),U=s("div"),V=s("span"),ee=s("label"),te=a(gt),le=o(),se=s("select"),ae=s("option"),oe=a(mt),re=s("option"),ne=a(ht),de=s("option"),ue=a(bt),ge=s("option"),me=a(pt),be=o(),pe=s("div"),_e=s("div"),ve=s("span"),fe=s("label"),xe=a(_t),Ae=o(),Ce=s("select"),ye=s("option"),we=a(vt),Se=s("option"),ke=a(ft),Le=s("option"),Me=a(xt),Ne=o(),Te=s("div"),Pe=s("span"),Ie=s("label"),ze=s("span"),De=a(At),Fe=o(),We=s("div"),Ee=s("div"),Be=s("input"),Xe=o(),He=s("label"),$e=a(Ct),Ye=o(),je=s("div"),Oe=s("input"),Re=o(),Ze=s("label"),Ge=a(yt),Je=o(),qe=s("div"),Ke=s("input"),Qe=o(),Ue=s("label"),Ve=a(wt),et=o(),tt=s("div"),lt=s("button"),st=a(St),at=o(),ot=s("button"),it=a(kt),i(h,"class","modal-title"),i(_,"type","button"),i(_,"class","close"),i(_,"data-bs-dismiss","modal"),i(m,"class","modal-header"),i(w,"class","control-label font-weight-normal d-inline-flex"),i(w,"for","backgroundImage"),i(L,"type","text"),L.disabled="disabled",L.readOnly="readonly",i(L,"class","form-control drawing_bgimg"),i(L,"id","backgroundImage"),i(L,"name","backgroundImage"),i(y,"class","form-group text-left"),i(C,"class","col-6"),i(T,"id","upload_media"),i(T,"type","button"),T.value=I=e[0].upload_media_text,i(T,"margin","normal"),i(T,"class","btn btn-primary w-100"),i(N,"class","col-6 margin-top-2"),i(A,"class","row"),i(B,"class","mendatory_label float-left"),i(E,"class","control-label font-weight-normal d-inline-flex"),i(E,"for","imgAlt"),i($,"type","text"),i($,"class","form-control"),i($,"id","imgAlt"),$.value="",i($,"name","imgAlt"),i(W,"class","form-group text-left"),i(F,"class","col-12"),i(D,"class","row"),i(G,"class","mendatory_label float-left"),i(Z,"class","control-label font-weight-normal d-inline-flex"),i(Z,"for","imgWidth"),i(K,"type","number"),i(K,"class"," form-control num"),i(K,"id","imgWidth"),K.value="",i(K,"name","imgWidth"),i(R,"class","form-group text-left"),i(O,"class","col-6"),i(ee,"for","lineColor"),i(ee,"class","text-dark"),ae.__value=ie=e[0].red,ae.value=ae.__value,re.__value=ce=e[0].green,re.value=re.__value,de.__value="#00BCD4",de.value=de.__value,de.selected="selected",ge.__value=he=e[0].blue,ge.value=ge.__value,i(se,"id","lineColor"),i(se,"class","form-control form-select"),i(U,"class","col-6"),i(j,"class","row"),i(fe,"for","markPointColor"),i(fe,"class","text-dark"),ye.__value="#00FF00",ye.value=ye.__value,ye.selected="selected",Se.__value="#000",Se.value=Se.__value,Le.__value="#ff8c00",Le.value=Le.__value,i(Ce,"id","markPointColor"),i(Ce,"class","form-control form-select"),i(_e,"class","col-6"),i(pe,"class","row mb-3"),i(ze,"class","mendatory_label float-left"),i(Ie,"class","mt-2 text-dark relative"),i(Be,"type","checkbox"),Be.value="_scribble",i(Be,"class","checkbox-inline toolCheckbox form-check-input"),i(Be,"name","scribble_checkbox"),i(Be,"id","scribble_checkbox"),i(He,"for","scribble_checkbox"),i(He,"class","text-dark form-check-label"),i(Ee,"class","form-check form-check-inline"),i(Oe,"type","checkbox"),Oe.value="_line",i(Oe,"class","checkbox-inline toolCheckbox form-check-input"),i(Oe,"name","line_checkbox"),i(Oe,"id","line_checkbox"),i(Ze,"for","line_checkbox"),i(Ze,"class","text-dark form-check-label"),i(je,"class","form-check form-check-inline"),i(Ke,"type","checkbox"),Ke.value="_compass",i(Ke,"class","checkbox-inline toolCheckbox form-check-input"),i(Ke,"name","compass_checkbox"),i(Ke,"id","compass_checkbox"),i(Ue,"for","compass_checkbox"),i(Ue,"class","text-dark form-check-label"),i(qe,"class","form-check form-check-inline"),i(We,"class","d-block toolsCheckbox"),i(x,"class","authoring-modal"),i(f,"class","modal-body overflow-y"),i(lt,"type","button"),i(lt,"class","btn btn-light"),i(lt,"data-bs-dismiss","modal"),i(ot,"type","button"),i(ot,"class","btn btn-secondary drawing_modal_submit"),i(tt,"class","modal-footer"),i(g,"class","modal-content"),i(l,"class","modal-dialog modal-dialog-centered"),i(t,"id","drawing-modal"),i(t,"class","modal fade"),i(t,"tabindex","-1")},m(e,s){r(e,t,s),n(t,l),n(l,g),n(g,m),n(m,h),n(h,b),n(m,p),n(m,_),n(g,v),n(g,f),n(f,x),n(x,A),n(A,C),n(C,y),n(y,w),n(w,S),n(y,k),n(y,L),n(A,M),n(A,N),n(N,T),n(T,P),n(x,z),n(x,D),n(D,F),n(F,W),n(W,E),n(E,B),n(B,X),n(W,H),n(W,$),n(x,Y),n(x,j),n(j,O),n(O,R),n(R,Z),n(Z,G),n(G,J),n(R,q),n(R,K),n(j,Q),n(j,U),n(U,V),n(V,ee),n(ee,te),n(U,le),n(U,se),n(se,ae),n(ae,oe),n(se,re),n(re,ne),n(se,de),n(de,ue),n(se,ge),n(ge,me),n(x,be),n(x,pe),n(pe,_e),n(_e,ve),n(ve,fe),n(fe,xe),n(_e,Ae),n(_e,Ce),n(Ce,ye),n(ye,we),n(Ce,Se),n(Se,ke),n(Ce,Le),n(Le,Me),n(x,Ne),n(x,Te),n(Te,Pe),n(Pe,Ie),n(Ie,ze),n(ze,De),n(x,Fe),n(x,We),n(We,Ee),n(Ee,Be),n(Ee,Xe),n(Ee,He),n(He,$e),n(We,Ye),n(We,je),n(je,Oe),n(je,Re),n(je,Ze),n(Ze,Ge),n(We,Je),n(We,qe),n(qe,Ke),n(qe,Qe),n(qe,Ue),n(Ue,Ve),n(g,et),n(g,tt),n(tt,lt),n(lt,st),n(tt,at),n(tt,ot),n(ot,it)},p(e,[t]){1&t&&rt!==(rt=e[0].configuration+"")&&c(b,rt),1&t&&nt!==(nt=e[0].background_image+"")&&c(S,nt),1&t&&ct!==(ct=e[0].upload_media_text+"")&&c(P,ct),1&t&&I!==(I=e[0].upload_media_text)&&(T.value=I),1&t&&dt!==(dt=e[0].alt_txt_image+"")&&c(X,dt),1&t&&ut!==(ut=e[0].width_of_image+"")&&c(J,ut),1&t&&gt!==(gt=e[0].draw_color+"")&&c(te,gt),1&t&&mt!==(mt=e[0].red+"")&&c(oe,mt),1&t&&ie!==(ie=e[0].red)&&(ae.__value=ie,ae.value=ae.__value),1&t&&ht!==(ht=e[0].green+"")&&c(ne,ht),1&t&&ce!==(ce=e[0].green)&&(re.__value=ce,re.value=re.__value),1&t&&bt!==(bt=e[0].light_blue+"")&&c(ue,bt),1&t&&pt!==(pt=e[0].blue+"")&&c(me,pt),1&t&&he!==(he=e[0].blue)&&(ge.__value=he,ge.value=ge.__value),1&t&&_t!==(_t=e[0].markPointColor+"")&&c(xe,_t),1&t&&vt!==(vt=e[0].lightGreen+"")&&c(we,vt),1&t&&ft!==(ft=e[0].black+"")&&c(ke,ft),1&t&&xt!==(xt=e[0].orange+"")&&c(Me,xt),1&t&&At!==(At=e[0].tools+"")&&c(De,At),1&t&&Ct!==(Ct=e[0].scribble+"")&&c($e,Ct),1&t&&yt!==(yt=e[0].line+"")&&c(Ge,yt),1&t&&wt!==(wt=e[0].compass+"")&&c(Ve,wt),1&t&&St!==(St=e[0].cancel+"")&&c(st,St),1&t&&kt!==(kt=e[0].submit+"")&&c(it,kt)},i:d,o:d,d(e){e&&u(t)}}}function P(e,t,l){let{l:s}=t;return e.$$set=e=>{"l"in e&&l(0,s=e.l)},[s]}class I extends e{constructor(e){super(),t(this,e,P,T,l,{l:0})}}function z(e){let t,l,d,A,C,y,w,S,k,L,M,N,T,P,z,F,W,E,B,X,H,$,Y,j,O,R,Z,G,J,q,K,Q,U,V,ee,te,le,se,ae,oe,ie,re,ne,ce,de,ue,ge,me,he,be,pe,_e,ve,fe,xe,Ae,Ce,ye,we,Se,ke,Le,Me,Ne,Te,Pe,Ie,ze,De,Fe,We,Ee,Be,Xe,He,$e,Ye,je,Oe,Re,Ze,Ge,Je,qe,Ke,Qe,Ue,Ve,et,tt,lt,st,at,ot,it,rt,nt,ct,dt,ut,gt,mt,ht,bt,pt,_t,vt,ft,xt,At,Ct,yt,wt,St,kt,Lt,Mt,Nt,Tt,Pt,It,zt,Dt,Ft,Wt,Et,Bt,Xt,Ht,$t=g.add_point+"",Yt=g.add_focus_pnt+"",jt=e[0].alt+"";return Et=new I({props:{l:g}}),{c(){t=s("main"),l=s("div"),d=s("center"),A=s("div"),C=s("div"),y=s("div"),w=s("button"),S=s("i"),L=o(),M=s("button"),N=a("/"),P=o(),z=s("button"),F=s("i"),B=o(),X=s("div"),H=s("button"),$=s("i"),j=o(),O=s("button"),R=s("i"),G=o(),J=s("button"),q=s("i"),Q=o(),U=s("button"),V=s("i"),le=o(),se=s("div"),ae=s("button"),oe=a($t),ne=o(),ce=s("div"),de=s("button"),ue=a(Yt),he=o(),be=s("div"),pe=s("button"),_e=s("i"),Ae=o(),Ce=s("div"),Ce.textContent=""+g.delete_point_msg,ye=o(),we=s("div"),Se=s("div"),ke=s("div"),Le=s("button"),Le.innerHTML='<i class="icomoon-24px-settings-1"></i>',Me=o(),Ne=s("img"),Ie=o(),ze=m("svg"),De=m("title"),Fe=a(jt),We=m("g"),Ee=m("g"),Be=m("g"),Xe=m("svg"),He=m("svg"),$e=m("g"),Ye=m("circle"),je=m("g"),Oe=m("line"),Re=m("g"),Ze=m("circle"),Ge=m("defs"),Je=m("pattern"),qe=m("svg"),Ke=m("path"),Qe=m("path"),Ue=m("path"),Ve=m("path"),et=m("circle"),tt=m("g"),lt=m("circle"),st=m("defs"),at=m("pattern"),ot=m("svg"),it=m("g"),rt=m("g"),nt=m("rect"),ct=m("g"),dt=m("rect"),ut=m("g"),gt=m("g"),mt=m("path"),ht=m("g"),bt=m("path"),pt=m("g"),_t=m("circle"),vt=m("defs"),ft=m("pattern"),xt=m("svg"),At=m("path"),Ct=m("g"),yt=m("circle"),St=m("circle"),kt=m("g"),Lt=m("circle"),Mt=m("defs"),Nt=m("pattern"),Tt=m("svg"),Pt=m("g"),It=m("g"),zt=m("g"),Dt=m("g"),Ft=m("path"),Wt=o(),h(Et.$$.fragment),i(S,"class","icomoon-pencil"),i(w,"type","button"),i(w,"tabindex","0"),i(w,"data-title","scribble"),i(w,"title",k=g.scribble),i(w,"name","authoring_scribble"),i(w,"id","authoring_scribble"),i(w,"class","btn btn-light auth_toolbar geometryTool tooltip_btn authoring_btn active"),i(M,"type","button"),i(M,"tabindex","0"),i(M,"data-title","line"),i(M,"title",T=g.line),i(M,"name","authoring_line"),i(M,"id","authoring_line"),i(M,"class","btn btn-light auth_toolbar geometryTool tooltip_btn authoring_btn"),i(F,"class","icomoon-compass1"),i(z,"type","button"),i(z,"tabindex","0"),i(z,"data-title","compass"),i(z,"title",W=g.compass),i(z,"name","compass"),i(z,"id","authoring_compass"),i(z,"class","btn btn-light auth_toolbar geometryTool tooltip_btn authoring_btn"),i(y,"tabindex","0"),i(y,"class","btn-group mr-2"),i(y,"role","group"),i(y,"aria-label",E=g.draw_tools),i($,"class","icomoon-delete-sm"),i(H,"type","button"),i(H,"tabindex","0"),i(H,"title",Y=g.delete_tool),i(H,"name","eraser"),i(H,"id","authoring_eraser"),i(H,"class","btn btn-light auth_toolbar authoring_btn tooltip_btn"),i(R,"class","icomoon-close-2"),i(O,"type","button"),i(O,"title",Z=g.clear_screen),i(O,"tabindex","0"),i(O,"name","clearScreen"),i(O,"id","authoring_clearScreen"),O.disabled="disabled",i(O,"class","btn btn-light tooltip_btn"),i(q,"class","icomoon-redo-2"),i(J,"type","button"),i(J,"tabindex","0"),i(J,"title",K=g.redo),i(J,"name","redo"),i(J,"id","authoring_redo"),J.disabled="disabled",i(J,"class","btn btn-light tooltip_btn"),i(V,"class","icomoon-undo-2"),i(U,"type","button"),i(U,"tabindex","0"),i(U,"title",ee=g.undo),i(U,"name","undo"),i(U,"id","authoring_undo"),U.disabled="disabled",i(U,"class","btn btn-light tooltip_btn"),i(X,"tabindex","0"),i(X,"class","btn-group mr-2"),i(X,"role","group"),i(X,"aria-label",te=g.removing_tools),i(ae,"type","button"),i(ae,"tabindex","0"),i(ae,"data-title","authoring_point"),i(ae,"title",ie=g.add_show_point),i(ae,"name","authoring_point"),i(ae,"id","authoring_point"),i(ae,"class","btn btn-light tooltip_btn"),i(se,"class","btn-group mr-2"),i(se,"role","group"),i(se,"aria-label",re=g.answer_point),i(de,"type","button"),i(de,"tabindex","0"),i(de,"title",ge=g.add_finish_point),i(de,"name","focus_point"),i(de,"id","focus_point"),i(de,"class","btn btn-light tooltip_btn"),i(ce,"class","btn-group mr-2"),i(ce,"role","group"),i(ce,"aria-label",me=g.access_mode),i(_e,"class","icomoon-new-24px-reset-1"),i(pe,"type","button"),i(pe,"tabindex","0"),i(pe,"title",ve=g.reset),i(pe,"name","default_button"),i(pe,"id","reset_btn"),i(pe,"class","btn btn-light tooltip_btn"),i(be,"class","btn-group mr-2"),i(be,"role","group"),i(be,"aria-label",fe=g.def_mode),i(C,"class","btn-toolbar auth_drawing_toolbar"),i(C,"role","toolbar"),i(C,"aria-label",xe=g.drawing_tools),i(Ce,"id","add_point_msg"),i(Ce,"class","text-danger my-1"),i(A,"class","mt-2 mb-2"),i(Le,"type","button"),i(Le,"tabindex","0"),i(Le,"title","Configuration"),i(Le,"class","btn tooltip_btn btn-light p-1"),i(ke,"class","btn-group position-absolute setting_btn"),i(Ne,"class","border"),b(Ne.src,Te=D+e[0].bgImg)||i(Ne,"src",Te),i(Ne,"id","svgImg"),i(Ne,"alt",Pe=e[0].alt),i(De,"id","authoringSvgTitle"),i(We,"class","backgroundFocusPath"),i(Ee,"class","drawing_paths"),i(Be,"class","backgroundFocusPoint"),i(Ye,"class","drawing-compass-route compass_route"),i(Ye,"cx","267.984375"),i(Ye,"cy","173"),i(Ye,"r","80"),i(Oe,"class","compass_rotationBar compass_radius"),i(Oe,"x1","267.984375"),i(Oe,"y1","173"),i(Oe,"x2","267.984375"),i(Oe,"y2","253"),i(Ze,"class","drawing_compass_center compass_center"),i(Ze,"cx","267.984375"),i(Ze,"cy","173"),i(Ze,"r","17"),i(Ze,"focusable","true"),i(Ze,"fill","url(#drawingCenter)"),i(Ke,"fill","#808080"),i(Ke,"class","st0"),i(Ke,"d","M3.22,15.1L1,12l2.22-3.1C3.22,10.97,3.22,13.03,3.22,15.1z"),i(Qe,"fill","#808080"),i(Qe,"class","st0"),i(Qe,"d","M8.9,3.22L12,1l3.1,2.22C13.03,3.22,10.97,3.22,8.9,3.22z"),i(Ue,"fill","#808080"),i(Ue,"class","st0"),i(Ue,"d","M15.1,20.78L12,23l-3.1-2.22C10.97,20.78,13.03,20.78,15.1,20.78z"),i(Ve,"fill","#808080"),i(Ve,"class","st0"),i(Ve,"d","M20.78,8.9L23,12l-2.22,3.1C20.78,13.03,20.78,10.97,20.78,8.9z"),i(et,"cx","12"),i(et,"cy","12"),i(et,"r","2"),i(et,"fill","#333333"),i(qe,"x","0px"),i(qe,"y","0px"),i(qe,"viewBox","1 -3 21 35"),i(qe,"width","33"),i(qe,"height","41"),i(Je,"id","drawingCenter"),i(Je,"width","20"),i(Je,"height","20"),i(lt,"class","compass_radius_icon mid_circle"),i(lt,"cx","267.984375"),i(lt,"cy","213"),i(lt,"r","17"),i(lt,"fill","url(#drawingRadius)"),i(lt,"transform","rotate(90,160,168)"),i(lt,"focusable","true"),i(nt,"x","8.53"),i(nt,"y","1.11"),i(nt,"width","1.5"),i(nt,"height","21.79"),i(dt,"x","13.97"),i(dt,"y","1.11"),i(dt,"width","1.5"),i(dt,"height","21.79"),i(mt,"d","M5.87,16.87L1,12l4.87-4.87C5.87,10.38,5.87,13.62,5.87,16.87z"),i(bt,"d","M18.13,16.87L23,12l-4.87-4.87C18.13,10.38,18.13,13.62,18.13,16.87z"),i(ot,"x","0px"),i(ot,"y","0px"),i(ot,"viewBox","1 -5 21 34"),i(ot,"width","33"),i(ot,"height","33"),i(at,"id","drawingRadius"),i(at,"width","20"),i(at,"height","20"),i(_t,"class","compass_rotation midSmallCircle"),i(_t,"cx","267.984375"),i(_t,"cy","233"),i(_t,"r","8"),i(_t,"fill","url(#midSmallCircle_icon)"),i(_t,"focusable","true"),i(_t,"transform","rotate(90,160,193)"),i(At,"fill","#000"),i(At,"opacity","0.8"),i(At,"d","M7,14 C3.13400675,14 0,10.8659932 0,7 C0,3.13400675 3.13400675,0 7, 0 C10.8659932,0 14,3.13400675 14,7 C14,10.8659932 10.8659932,14 7, 14 Z M4.66666667,8.16666667 L7,11.6666667 L9.33333333,8.16666667 L4.66666667,8.16666667 Z M4.66666667,5.83333333 L9.33333333,5.83333333 L7,2.33333333 L4.66666667,5.83333333 Z"),i(xt,"width","16px"),i(xt,"height","16px"),i(xt,"viewBox","0 0 14 14"),i(xt,"version","1.1"),i(ft,"id","midSmallCircle_icon"),i(ft,"width","20"),i(ft,"height","20"),i(yt,"class","drawing-compass-pointer lastCircle"),i(yt,"cx","267.984375"),i(yt,"cy","253"),i(yt,"r","3"),i(yt,"fill",wt=e[0].lineColor),i(St,"class","drawing-compass-pointer-border lastCircle last_big_circle"),i(St,"cx","267.984375"),i(St,"cy","253"),i(St,"r","17"),i(St,"focusable","true"),i(Lt,"class","lastCircleMid"),i(Lt,"fill","url(#lastCircleMid_icon)"),i(Lt,"cx","267.984375"),i(Lt,"cy","293"),i(Lt,"r","12"),i(Lt,"opacity","0"),i(Ft,"d","M3.76491276,22.4309727 C5.88207272,19.902578 7.10843487, 16.447736 7.10843487,12.7446281 C7.10843487,9.90533039 6.38974128, 7.20188959 5.07542401,4.93464319 L1.71316547,5.67221801 L4.9100909, 0.48305188 L10.1719173,3.81663137 L7.11351005,4.48755064 C8.4088902, 6.93966677 9.10843487,9.78181395 9.10843487,12.7446281 C9.10843487, 16.6677555 7.87827881,20.3638018 5.71250857,23.1972812 L8.63385425, 24.3467251 L2.93165771,26.8255625 L0.595287046,21.1838396 L3.76491276, 22.4309727 Z"),i(Ft,"class",""),i(Dt,"transform","translate(313.742737, 140.576561) rotate(-2.000000) translate(-313.742737, -140.576561) translate(308.242737, 127.076561)"),i(zt,"transform","translate(207.000000, 318.000000)"),i(It,"transform","translate(-516.000000, -445.000000)"),i(It,"fill","#333333"),i(It,"fillrule","nonzero"),i(Pt,"stroke","none"),i(Pt,"strokewidth","1"),i(Pt,"fill","none"),i(Pt,"fillrule","evenodd"),i(Pt,"opacity","0.5"),i(Tt,"width","24"),i(Tt,"height","23"),i(Tt,"viewBox","0 0 11 27"),i(Tt,"version","1.1"),i(Tt,"enablebackground","new 0 0 8 24"),i(Nt,"id","lastCircleMid_icon"),i(Nt,"width","20"),i(Nt,"height","20"),i(He,"class","drawing-compass-wrapper"),i(Xe,"class","drawing_compass_svg h"),i(Xe,"focusable","false"),i(ze,"width","100%"),i(ze,"height","100%"),i(ze,"id","authoringSvg"),i(ze,"tabindex","0"),i(ze,"aria-labelledby","authoringSvgTitle"),i(Se,"id","centerImg"),i(Se,"class","centerImg authCenterImg my-auto relative ml-0"),i(l,"class","drawing_module_container")},m(s,a){r(s,t,a),n(t,l),n(l,d),n(d,A),n(A,C),n(C,y),n(y,w),n(w,S),n(y,L),n(y,M),n(M,N),n(y,P),n(y,z),n(z,F),n(C,B),n(C,X),n(X,H),n(H,$),n(X,j),n(X,O),n(O,R),n(X,G),n(X,J),n(J,q),n(X,Q),n(X,U),n(U,V),n(C,le),n(C,se),n(se,ae),n(ae,oe),n(C,ne),n(C,ce),n(ce,de),n(de,ue),n(C,he),n(C,be),n(be,pe),n(pe,_e),n(A,Ae),n(A,Ce),n(d,ye),n(d,we),n(we,Se),n(Se,ke),n(ke,Le),n(Se,Me),n(Se,Ne),n(Se,Ie),n(Se,ze),n(ze,De),n(De,Fe),n(ze,We),n(ze,Ee),n(ze,Be),n(ze,Xe),n(Xe,He),n(He,$e),n($e,Ye),n($e,je),n(je,Oe),n($e,Re),n(Re,Ze),n(Re,Ge),n(Ge,Je),n(Je,qe),n(qe,Ke),n(qe,Qe),n(qe,Ue),n(qe,Ve),n(qe,et),n($e,tt),n(tt,lt),n(tt,st),n(st,at),n(at,ot),n(ot,it),n(it,rt),n(rt,nt),n(it,ct),n(ct,dt),n(ot,ut),n(ut,gt),n(gt,mt),n(ut,ht),n(ht,bt),n($e,pt),n(pt,_t),n(pt,vt),n(vt,ft),n(ft,xt),n(xt,At),n($e,Ct),n(Ct,yt),n(Ct,St),n($e,kt),n(kt,Lt),n(kt,Mt),n(Mt,Nt),n(Nt,Tt),n(Tt,Pt),n(Pt,It),n(It,zt),n(zt,Dt),n(Dt,Ft),n(l,Wt),p(Et,l,null),Bt=!0,Xt||(Ht=_(Le,"click",e[1]),Xt=!0)},p(e,t){(!Bt||1&t[0]&&!b(Ne.src,Te=D+e[0].bgImg))&&i(Ne,"src",Te),(!Bt||1&t[0]&&Pe!==(Pe=e[0].alt))&&i(Ne,"alt",Pe),(!Bt||1&t[0])&&jt!==(jt=e[0].alt+"")&&c(Fe,jt),(!Bt||1&t[0]&&wt!==(wt=e[0].lineColor))&&i(yt,"fill",wt)},i(e){Bt||(v(Et.$$.fragment,e),Bt=!0)},o(e){f(Et.$$.fragment,e),Bt=!1},d(e){e&&u(t),x(Et),Xt=!1,Ht()}}}let D="https://s3.amazonaws.com/jigyaasa_content_static/",F="http://www.w3.org/2000/svg";function W(e,t,l){let s,a,o,i,r,n,c,d,u,m,h,b,p,_,v,f,x,{xml:T}=t,{getChildXml:P}=t,I=!1,z="scribble",W="#00BCD4",E=[],B=0,X=0,H=[],$=[],Y=!0,j=!1,O=90,R=0,Z={x:null,y:null},G={x:null,y:null},J=0,q="",K=0,Q=[],U="",V=["_scribble","_line","_compass"],ee=1,te=[],le=[],se=1,ae=L({xml:"",bgImg:"useraccount_000ANv.png",snackback:!1,cDATA:"",focusDATA:"",imgWidth:"600",alt:"Triangle image",message:"",selectedTools:V,lineColor:"#00BCD4",markPointColor:"#00FF00"}),oe={};ae.subscribe((e=>{l(0,oe=e)}));function ie(e){var t;Y=!0,""==e.value.trim()?(Y=!1,y.insert(e.parentElement,'<span class="error text-danger">'+g.fill_warning+"</span>","beforeend")):e.classList.contains("num")&&Number(e.value)<600?(Y=!1,y.insert(e.parentElement,'<span class="error text-danger">'+g.val_gt_limit+"</span>","beforeend")):(t=e.value,!isNaN(parseFloat(t))&&isFinite(t)||!e.classList.contains("num")?0==y.selectAll(".checkbox-inline:checked").length&&e.classList.contains("checkbox-inline")&&(Y=!1,y.insert(e.closest(".toolsCheckbox").parentElement,'<span class="error text-danger">'+g.select_one_tool+"</span>","beforeend")):(Y=!1,y.insert(e.parentElement,'<span class="error text-danger">'+g.enter_number+"</span>","beforeend"))),Y?e.classList.contains("checkbox-inline")?y.select("#backgroundImage").classList.remove("showError"):(e.classList.remove("showError"),y.setCss(e,{border:"",background:""})):e.classList.contains("checkbox-inline")?y.select("#backgroundImage").classList.add("showError"):(e.classList.add("showError"),y.setCss(e,{border:"1px solid red",background:"#FFCECE"}))}function re(e){switch(z){case"line":case"scribble":I&&(he(e),r==a&&n==o?E.pop():(s.setAttributeNS(null,"d",E[B].d+" L"+a+" "+o),E[B].d=E[B].d+" L"+a+" "+o,i.prepend(s),B++,X++,H=[],y.select("#authoring_undo").disabled=!1,y.select("#authoring_clearScreen").disabled=!1,y.select("#authoring_redo").disabled=!0)),I=!1;break;case"compass":R=0,J=0,j&&(he(e),c=a,d=o,x=y.select(".drawing-compass-route").getAttribute("r"),ne(c,d,x,O),j=!1),I&&(r==p&&n==_?E.pop():(s.setAttributeNS(null,"d",E[B].d+" L"+p+" "+_),E[B].d=E[B].d+" L"+p+" "+_,i.prepend(s),B++,X++,H=[],y.select("#authoring_undo").disabled=!1,y.select("#authoring_clearScreen").disabled=!1,y.select("#authoring_redo").disabled=!0),I=!1),y.selectAll("#authoringSvg .lastCircle","css",{cursor:"grab"})}}function ne(e,t,l,s){u=e+l/2*Math.cos(s*(Math.PI/180)),m=t+l/2*Math.sin(s*(Math.PI/180)),h=e+3*l/4*Math.cos(s*(Math.PI/180)),b=t+3*l/4*Math.sin(s*(Math.PI/180)),p=e+l*Math.cos(s*(Math.PI/180)),_=t+l*Math.sin(s*(Math.PI/180)),v=e+5*l/4*Math.cos(s*(Math.PI/180)),f=t+5*l/4*Math.sin(s*(Math.PI/180)),y.selectAll(".drawing-compass-route, .drawing_compass_center","attr",{cx:e,cy:t}),y.select(".drawing-compass-route").setAttribute("r",l),y.setAttr("#authoringSvg .compass_rotationBar",{x1:e,y1:t,x2:p,y2:_}),y.setAttr("#authoringSvg .lastCircleMid",{cx:v,cy:f}),y.selectAll("#authoringSvg .lastCircle","attr",{cx:p,cy:_}),y.setAttr("#authoringSvg .midSmallCircle",{cx:h,cy:b}),y.setAttr("#authoringSvg .mid_circle",{cx:u,cy:m})}function ce(){U="";for(let e=0;e<Q.length;e++)null!=Q[e].Center_X||null!=Q[e].Center_Y||null!=Q[e].radius?U+='{"x":"'+Q[e].Center_X+'","y":"'+Q[e].Center_Y+'","r":"'+Q[e].radius+'"}!':Q=Q.filter((function(e){return null!=e.Center_X}));let e=y.selectAll(".resize");if(e.length>0)for(let t=0;t<Q.length;t++)y.setAttr(e[t],{"data-point":t+1});else y.select("#add_point_msg").classList.add("h"),K=0,z=oe.selectedTools[0].substr(-(oe.selectedTools[0].length-1)),y.setCss("#authoringSvg",{cursor:"crosshair"}),"compass"==z?y.selectAll(".drawing_compass_svg","removeClass","h"):y.selectAll(".drawing_compass_svg","addClass","h"),y.selectAll(".authoring_btn,#authoring_point,#focus_point","removeClass","active"),y.selectAll('[data-title="'+z+'"]',"addClass","active");U=U.substr(0,U.length-1),de(U)}function de(e){q=S(T),q.smxml.div.__cdata=e,q=k(q),q=q.replace(/<!\[CDATA\[/g,"\x3c!--[CDATA["),q=q.replace(/\]\]>/g,"]]--\x3e"),P(q),l(0,oe.xml=q,oe)}function ue(){Z.x=Number(y.select(".compass_rotationBar").getAttribute("x1")),Z.y=Number(y.select(".compass_rotationBar").getAttribute("y1")),G.x=Number(y.select(".compass_rotationBar").getAttribute("x2")),G.y=Number(y.select(".compass_rotationBar").getAttribute("y2")),x=Number(y.select(".drawing-compass-route").getAttribute("r")),O=180*Math.atan2(G.y-Z.y,G.x-Z.x)/Math.PI}function ge(){le.length>0&&te.push(le),q=S(T);var e="";for(let t=0;t<te.length;t++){e+='{"'+t+'":[';for(let l=0;l<te[t].length;l++)e+='{"x":"'+te[t][l].x+'","y":"'+te[t][l].y+'"}!';e=e.substr(0,e.length-1)+"]}!"}e=e.substr(0,e.length-1),q.smxml.backgroundPoint.__cdata=e,q=k(q),q=q.replace(/<!\[CDATA\[/g,"\x3c!--[CDATA["),q=q.replace(/\]\]>/g,"]]--\x3e"),P(q),l(0,oe.xml=q,oe),y.select("#focus_point").innerText="Add Focus Point",y.select("#focus_point").classList.remove("active"),z=oe.selectedTools[0].substr(-(oe.selectedTools[0].length-1)),y.setCss("#authoringSvg",{cursor:"crosshair"}),y.select("#authoring"+oe.selectedTools[0]).classList.add("active"),"compass"==z?y.selectAll(".drawing_compass_svg","removeClass","h"):y.selectAll(".drawing_compass_svg","addClass","h"),ee=1,me(le)}function me(e){if(0==e.length)return;s=document.createElementNS(F,"path");let t="M "+e[0].x+" "+e[0].y,l="";for(let t=1;t<e.length;t++)l+=" L "+e[t].x+" "+e[t].y;s.setAttributeNS(null,"d",t+""+l),be("rgb(128, 128, 128)",5),y.select(".backgroundFocusPath").prepend(s),le=[]}function he(e){let t=document.getElementById("authoringSvg").getBoundingClientRect();a=e.clientX-t.left,o=e.clientY-t.top}function be(e,t){s.style.stroke=e,s.style.strokeWidth=t,s.style.fill="none"}function pe(){y.select("#authoring_point").innerText="Add Point",y.select("#add_point_msg").classList.add("h"),y.selectAll(".resize","remove"),y.select(".drawing_paths").innerHTML="",y.select("#authoring_redo").disabled=!0,y.select("#authoring_undo").disabled=!0,y.select("#authoring_clearScreen").disabled=!0,y.setCss("#authoringSvg",{cursor:"crosshair"}),z=oe.selectedTools[0].substr(-(oe.selectedTools[0].length-1)),_e(),de(""),y.selectAll(".authoring_btn,#authoring_point,#focus_point","removeClass","active"),ge(),X=0,K=0,B=0,E=[],Q=[]}function _e(){y.selectAll(".geometryTool","addClass","h");for(let e=0;e<oe.selectedTools.length;e++)y.selectAll("#authoring"+oe.selectedTools[e],"removeClass","h");y.selectAll(".backgroundFocusPoint circle,.backgroundFocusPath path","remove"),W=oe.lineColor,y.selectAll(".authCenterImg,.auth_drawing_toolbar","attr",{style:"width:"+(Number(oe.imgWidth)+2)+"px"}),y.setAttr(".centerImg #svgImg",{src:D+""+oe.bgImg,alt:oe.alt,width:oe.imgWidth}),y.selectAll(".drawing_compass_svg","addClass","h"),te=[],le=[]}return A((async()=>{oe.xml!=T&&(!function(){q=S(T),ae.update((e=>(e.bgImg=q.smxml._bgimg,e.alt=q.smxml._imgAlt,e.imgWidth=q.smxml._width,e.selectedTools=q.smxml.div._selectedDrawingType.split(","),e.cDATA=q.smxml.div.__cdata,e.focusDATA=q.smxml.backgroundPoint.__cdata,e.markPointColor=q.smxml._markPointColor,e.lineColor=q.smxml._color,e)));try{y.select("#authoring_point").innerText="Add Point",_e(),K=0,y.select(".drawing_paths").innerHTML="",y.select("#authoring_redo").disabled=!0,y.select("#authoring_undo").disabled=!0,y.select("#authoring_clearScreen").disabled=!0,X=0,B=0,se=1,E=[];let e=oe.cDATA;e="["+e.replace(/!/g,",")+"]",e=JSON.parse(e),y.selectAll(".resize","remove");let t=Q.length;if(e.length>t)for(let l=0;l<e.length-t;l++)Q.push({Center_X:90,Center_Y:68,radius:33});else for(let l=e.length;l<t;l++)Q.pop();for(let t=0;t<e.length;t++)K++,Q[K-1].Center_X=e[t].x,Q[K-1].Center_Y=e[t].y,Q[K-1].radius=e[t].r,y.insert("#centerImg",'<div class="resize" data-point="'+K+'" style="z-index: 10; left: '+(e[t].x-e[t].r)+"px; top: "+(e[t].y-e[t].r)+"px;width: "+2*e[t].r+"px; height: "+2*e[t].r+'px;"><div class="resizer icomoon-resize"></div></div>',"beforeend"),ce();let l=oe.focusDATA;l="["+l.replace(/!/g,",")+"]",l=JSON.parse(l),y.selectAll(".backgroundFocusPoint circle,.backgroundFocusPath path","remove"),te=[];for(let e=0;e<l.length;e++)te.push(l[e][e]);for(let e=0;e<l.length;e++){for(let t=0;t<l[e][e].length;t++)te[e][t].x=l[e][e][t].x,te[e][t].y=l[e][e][t].y,s=document.createElementNS(F,"circle"),be("#808080",5),s.setAttributeNS(null,"id","focusPoint"+se),s.setAttributeNS(null,"cx",te[e][t].x),s.setAttributeNS(null,"cy",te[e][t].y),s.setAttributeNS(null,"r","2px"),y.select(".backgroundFocusPoint").prepend(s),se++;me(te[e])}0==K?y.select("#add_point_msg").classList.add("h"):y.select("#add_point_msg").classList.remove("h"),y.selectAll(".resize").length>0?(z="authoring_point",y.setCss("#authoringSvg",{cursor:"auto"})):(z=oe.selectedTools[0].substr(-(oe.selectedTools[0].length-1)),y.setCss("#authoringSvg",{cursor:"crosshair"}),"compass"==z?y.selectAll(".drawing_compass_svg","removeClass","h"):y.selectAll(".drawing_compass_svg","addClass","h")),y.selectAll(".authoring_btn,#authoring_point,#focus_point","removeClass","active"),y.selectAll('[data-title="'+z+'"]',"addClass","active")}catch(e){console.warn({e:e,func:"parseXMLForGettingData"})}}(),l(0,oe.xml=T,oe))})),C((async()=>{i=y.select(".drawing_paths"),y.setAttr(".centerImg #svgImg",{src:D+""+oe.bgImg,alt:oe.alt,width:oe.imgWidth}),y.setAttr(".auth_drawing_toolbar",{style:"width:"+(Number(oe.imgWidth)+2)+"px"}),y.setAttr(".authCenterImg",{style:"width:"+(Number(oe.imgWidth)+2)+"px"}),ne(160,118,100,90),y.listen("body","mousedown","#authoringSvg .mid_circle",(function(){"compass"==z&&(R=1)})),y.listen("body","mousedown","#authoringSvg .midSmallCircle",(function(){"compass"==z&&(J=1)})),y.listen("body","mousedown","#authoringSvg .drawing_compass_center",(function(e,t){"compass"==z&&(he(t),c=a,d=o,x=y.select(".drawing-compass-route").getAttribute("r"),ne(c,d,x,O),y.selectAll("#authoringSvg .midSmallCircle","attr",{transform:"rotate("+O+","+y.select("#authoringSvg .midSmallCircle").getAttribute("cx")+","+y.select("#authoringSvg .midSmallCircle").getAttribute("cy")+")"}),y.selectAll("#authoringSvg .mid_circle","attr",{transform:"rotate("+O+","+y.select("#authoringSvg .mid_circle").getAttribute("cx")+","+y.select("#authoringSvg .mid_circle").getAttribute("cy")+")"}),y.selectAll("#authoringSvg .lastCircleMid","attr",{transform:"rotate("+O+","+y.select("#authoringSvg .lastCircleMid").getAttribute("cx")+","+y.select("#authoringSvg .lastCircleMid").getAttribute("cy")+")"}),j=!0)})),y.listen("body","mousemove","#authoringSvg .lastCircle",(function(e){e.classList.add("lastCircle_hover"),y.selectAll("#authoringSvg .lastCircleMid","attr",{opacity:1})})),y.listen("body","mouseout","#authoringSvg .lastCircle",(function(e){e.classList.remove("lastCircle_hover"),y.selectAll("#authoringSvg .lastCircleMid","attr",{opacity:0})})),y.listen("body","mousedown","#authoringSvg .lastCircle",(function(e){"compass"==z&&(I=!0,J=1,y.selectAll("#authoringSvg .lastCircle","css",{cursor:"grabbing"}),s=document.createElementNS(F,"path"),be(W,5),s.setAttributeNS(null,"data-type",z+"_"+B),s.setAttributeNS(null,"data-order",B),s.setAttributeNS(null,"d","M"+p+" "+_),r=p,n=_,E.push({mode:"add",order:B,type:z+"_"+B,index:B,d:"M"+p+" "+_}))})),y.listen("body","mousedown","#authoringSvg",(function(e,t){!function(e){switch(z){case"line":case"scribble":I=!0,he(e),s=document.createElementNS(F,"path"),be(W,5),s.setAttributeNS(null,"data-type",z+"_"+B),s.setAttributeNS(null,"data-order",B),s.setAttributeNS(null,"d","M"+a+" "+o),r=a,n=o,E.push({mode:"add",order:B,type:z+"_"+B,index:B,d:"M"+a+" "+o});break;case"eraser":if(y.select(".currentSvg").nodeName&&null!=y.select(".currentSvg").getAttribute("data-order")){H=[];let e="",t=E.indexOf(E[y.select(".currentSvg").getAttribute("data-order")]);e=Object.assign({},E[t]),e.mode="remove",E.push(e),B++,X++,y.select("#authoring_redo").disabled=!0,y.selectAll(".currentSvg","remove"),0==y.selectAll(".drawing_paths path").length&&(y.select("#authoring_clearScreen").disabled=!0)}break;case"markAccessibilityPoint":ee||(he(e),s=document.createElementNS(F,"circle"),be("#808080",5),s.setAttributeNS(null,"id","focusPoint"+se),s.setAttributeNS(null,"cx",a),s.setAttributeNS(null,"cy",o),s.setAttributeNS(null,"r","2px"),le.push({x:a,y:o}),se++,y.select(".backgroundFocusPoint").prepend(s))}}(t)})),y.listen("body","click","#authoring_point",(function(e){ge(),y.selectAll(".authoring_btn, #focus_point","removeClass","active"),e.classList.add("active"),z="authoring_point",y.selectAll("#authoringSvg path","removeClass","eraserHover"),y.selectAll("#authoringSvg","css",{cursor:"unset"}),y.selectAll(".drawing_compass_svg","addClass","h"),"Add Point"==y.select("#authoring_point").innerText&&(K++,Q.push({Center_X:90,Center_Y:68,radius:33}),y.insert("#centerImg",'<div class="resize" data-point="'+K+'"><div class="resizer icomoon-resize"></div></div>',"beforeend"),ce()),y.select(".resize").nodeName&&y.select(".resize").offsetHeight&&0!=K||(y.selectAll(".resize","removeClass","h"),y.selectAll(".drawing_compass_svg","addClass","h"),y.select("#authoring_point").innerText="Add Point"),y.select("#add_point_msg").classList.remove("h")})),y.listen("body","mousemove","#authoringSvg",(function(e,t){switch(he(t),z){case"line":I&&(s.setAttributeNS(null,"d",E[B].d+" L"+a+" "+o),i.prepend(s));break;case"scribble":I&&(s.setAttributeNS(null,"d",E[B].d+" L"+a+" "+o),E[B].d=E[B].d+" L"+a+" "+o,i.prepend(s));break;case"compass":j&&(c=a,d=o,x=y.select(".drawing-compass-route").getAttribute("r"),ne(c,d,x,O)),R&&(ue(),O=Math.round(O),x=2*Math.sqrt(Math.pow(a-Z.x,2)+Math.pow(o-Z.y,2)),x<80&&(x=80),x>360&&(x=360),ne(Z.x,Z.y,x,O)),J&&(he(t),ue(),O=180*Math.atan2(o-Z.y,a-Z.x)/Math.PI,O<0&&(O=360+O),ne(Z.x,Z.y,x,O)),I&&(y.select("#authoringSvg .last_big_circle").classList.contains("lastCircle_hover")?(s.setAttributeNS(null,"d",E[B].d+" L"+p+" "+_),E[B].d=E[B].d+" L"+p+" "+_,i.prepend(s)):re(t)),y.selectAll("#authoringSvg .midSmallCircle","attr",{transform:"rotate("+O+","+y.select("#authoringSvg .midSmallCircle").getAttribute("cx")+","+y.select("#authoringSvg .midSmallCircle").getAttribute("cy")+")"}),y.selectAll("#authoringSvg .mid_circle","attr",{transform:"rotate("+O+","+y.select("#authoringSvg .mid_circle").getAttribute("cx")+","+y.select("#authoringSvg .mid_circle").getAttribute("cy")+")"}),y.selectAll("#authoringSvg .lastCircleMid","attr",{transform:"rotate("+O+","+y.select("#authoringSvg .lastCircleMid").getAttribute("cx")+","+y.select("#authoringSvg .lastCircleMid").getAttribute("cy")+")"})}})),y.listen("body","mouseup","#authoringSvg",(function(e,t){re(t)})),y.bind("#authoringSvg","mouseleave",(function(e){re(e)})),y.listen("body","click","#authoring_clearScreen",(function(e){y.select(".drawing_paths").innerHTML="",X=0,B=0,E=[],y.select("#authoring_undo").disabled=!0,y.select("#authoring_redo").disabled=!0,y.select("#authoring_clearScreen").disabled=!0})),y.listen("body","click",".auth_toolbar",(function(e){y.selectAll(".resize","addClass","h"),ge(),y.selectAction("#authoringSvg","css",{cursor:"crosshair"}),z=e.getAttribute("data-title"),y.selectAll(".authoring_btn,#authoring_point,#focus_point","removeClass","active"),e.classList.add("active"),"eraser"==z?y.selectAll(".drawing_paths path","addClass","eraserHover"):y.selectAll(".drawing_paths path","removeClass","eraserHover"),"compass"==z?y.selectAll(".drawing_compass_svg","removeClass","h"):y.selectAll(".drawing_compass_svg","addClass","h"),0!=K&&(y.select("#authoring_point").innerText="Show Point",y.select("#add_point_msg").classList.add("h"))})),y.listen("body","mouseover",".drawing_paths path",(function(e){"eraser"==z&&(y.selectAll(".drawing_paths path","removeClass","currentSvg"),e.classList.add("currentSvg"))})),y.listen("body","mouseout",".drawing_paths path",(function(e){"eraser"==z&&e.classList.remove("currentSvg")})),y.listen("body","click","#authoring_undo",(function(e){1==X?(e.disabled=!0,y.select("#authoring_redo").disabled=!1):y.select("#authoring_redo").disabled=!1,"add"==E[E.length-1].mode?y.select('#authoringSvg [data-order="'+(E.length-1)+'"]',"remove"):"remove"==E[E.length-1].mode&&(s=document.createElementNS(F,"path"),be(W,5),s.setAttributeNS(null,"data-type",E[E.length-1].type),s.setAttributeNS(null,"data-order",E[E.length-1].order),s.setAttributeNS(null,"d",E[E.length-1].d),"eraser"==z&&s.setAttributeNS(null,"class","eraserHover"),i.prepend(s)),H.push(E.pop()),B--,X--,0==y.selectAll(".drawing_paths path").length?y.select("#authoring_clearScreen").disabled=!0:y.select("#authoring_clearScreen").disabled=!1,0==E.length&&(e.disabled=!0)})),y.listen("body","click","#authoring_redo",(function(e){B++,H.length>0&&$.push(H.pop()),"add"==$[$.length-1].mode?(s=document.createElementNS(F,"path"),be(W,5),s.setAttributeNS(null,"data-type",$[$.length-1].type),s.setAttributeNS(null,"data-order",$[$.length-1].order),s.setAttributeNS(null,"d",$[$.length-1].d),"eraser"==z&&s.setAttributeNS(null,"class","eraserHover"),i.prepend(s)):"remove"==$[$.length-1].mode&&y.select('#authoringSvg [data-order="'+$[$.length-1].order+'"]',"remove"),X++,E.push($.pop()),0==y.selectAll(".drawing_paths path").length?y.select("#authoring_clearScreen").disabled=!0:y.select("#authoring_clearScreen").disabled=!1,0==H.length?(e.disabled=!0,y.select("#authoring_undo").disabled=!1):y.select("#authoring_undo").disabled=!1})),y.listen("body","click","#reset_btn",(function(){w({text:g.reset_module,icon:"warning",buttons:["cancel","ok"]}).then((e=>{e&&pe()}))})),y.listen("body","click","#focus_point",(function(){y.selectAll(".drawing_compass_svg","addClass","h"),y.selectAll("#authoringSvg path","removeClass","eraserHover"),y.select("#authoringSvg","css",{cursor:"crosshair"}),y.selectAll(".resize","addClass","h"),0!=K&&(y.select("#authoring_point").innerText="Show Point",y.select("#add_point_msg").classList.add("h")),ee?(y.selectAll(".authoring_btn,#authoring_point","removeClass","active"),y.select("#focus_point").innerText="Finish Marking",y.select("#focus_point","addClass","active"),ee=0,z="markAccessibilityPoint"):ge()})),AI.listen("body","contextmenu",".resize",(function(e,t){t.preventDefault(),w({text:g.delete_points,icon:"warning",buttons:!0}).then((t=>{if(t){let t=e.getAttribute("data-point");Q[t-1].Center_X=null,Q[t-1].Center_Y=null,Q[t-1].radius=null,e.remove(),ce()}}))})),AI.listen("body","keyup",".authoring-modal input",(function(e,t){t.stopPropagation(),y.selectAll(".error","remove"),ie(e)})),AI.listen("body","change",".authoring-modal input",(function(e,t){t.stopPropagation(),y.selectAll(".error","remove"),ie(e)})),AI.listen("body","click",".drawing_modal_submit",(function(e,t){if(Y&&0==y.selectAll(".showError").length){V=[];let e=y.selectAll(".checkbox-inline:checked");for(let t=0;t<e.length;t++)V.push(e[t].value);ae.update((e=>(e.bgImg=y.select("#backgroundImage").value,e.alt=y.select("#imgAlt").value.trim(),e.imgWidth=y.select("#imgWidth").value,e.lineColor=y.select("#lineColor").value,e.markPointColor=y.select("#markPointColor").value,e.selectedTools=V,e))),pe(),q=S(T),q.smxml._bgimg=oe.bgImg,q.smxml._imgAlt=oe.alt,q.smxml._width=oe.imgWidth,q.smxml._color=oe.lineColor,q.smxml._markPointColor=oe.markPointColor,q.smxml.div._selectedDrawingType=V.join(","),q.smxml.div.__cdata="",q.smxml.backgroundPoint.__cdata="",q=k(q),q=q.replace("<![CDATA[]]>","\x3c!--[CDATA[]]--\x3e"),P(q),l(0,oe.xml=q,oe),y.getBS("#drawing-modal","Modal").hide()}else w({text:"Please solve all the errors!",icon:"warning"})})),y.listen("body","click","#upload_media",(function(){y.getBS("#modal-media-upload","Modal").show()})),new M({containment:"#authoringSvg",classes:".resize",ignore:[".tools",".resizer"]}).onDragStop=function(e,t,l){let s=l.getAttribute("data-point");y.setCss(l,{height:l.offsetWidth+"px",width:l.offsetWidth+"px"});let a=l.offsetHeight/2,o=t.left+a,i=t.top+a;Q[s-1].Center_X=o,Q[s-1].Center_Y=i,Q[s-1].radius=a,ce()},new N("#authoringSvg",".resize").onStop=function(e,t){let l=t.getAttribute("data-point"),s=Number(t.offsetWidth)>66?66:t.offsetWidth;y.setCss(t,{height:s+"px",width:s+"px"});let a=t.offsetHeight/2,o=t.offsetLeft+a,i=t.offsetTop+a;Q[l-1].Center_X=o,Q[l-1].Center_Y=i,Q[l-1].radius=a,ce()}})),e.$$set=e=>{"xml"in e&&l(2,T=e.xml),"getChildXml"in e&&l(3,P=e.getChildXml)},[oe,function(){if(y.getBS("#drawing-modal","Modal").show(),y.select("#backgroundImage").value=oe.bgImg,""!=oe.lineColor&&(y.select('#lineColor option[value="'+oe.lineColor+'"]').selected=!0),""!=oe.markPointColor&&(y.select('#markPointColor option[value="'+oe.markPointColor+'"]').selected=!0),oe.selectedTools.length>0){y.selectAll(".toolCheckbox","checked",!1);for(var e=0;e<oe.selectedTools.length;e++)y.select('[value="'+oe.selectedTools[e]+'"]').checked=!0}y.select("#imgWidth").value=oe.imgWidth,y.select("#imgAlt").value=oe.alt;let t=y.selectAll(".authoring-modal input");y.selectAll(".error","remove");for(let e=0;e<t.length;e++)ie(t[e])},T,P]}export default class extends e{constructor(e){super(),t(this,e,W,z,l,{xml:2,getChildXml:3},null,[-1,-1,-1])}}
//# sourceMappingURL=Drawing-2af9d438.js.map
