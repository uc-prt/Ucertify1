import{S as e,i as t,s as a,e as l,C as n,b as o,u as i,f as s,h as c,j as r,P as d,l as u,r as g,o as b,y as m,p,A as h,a2 as _,X as f}from"./main-12a579e2.js";function v(e){let t,a,p,h,_,f,v,x,w,C,y,k,A,S,R,T,B,I,P,E,G,j,D,O,X,L,N,U,F,K,M,H,J,z,$,V,Y,q,Q,W,Z,ee,te,ae,le,ne,oe,ie,se,ce,re,de,ue,ge,be,me,pe,he,_e,fe,ve,xe,we,Ce,ye,ke,Ae,Se,Re,Te,Be,Ie,Pe,Ee,Ge,je,De,Oe,Xe,Le,Ne,Ue,Fe,Ke,Me,He,Je=n.recording_warning+"",ze=n.modal_data+"";return{c(){t=l("div"),a=l("div"),p=l("div"),h=l("b"),h.textContent=""+n.note_label,_=o(),f=i(Je),v=o(),x=l("div"),w=l("div"),C=l("b"),C.textContent=""+n.spoken_label,y=o(),k=l("textarea"),R=o(),T=l("div"),B=l("div"),I=l("label"),P=l("b"),P.textContent=""+n.select_lang,E=o(),G=l("select"),j=l("option"),j.textContent=""+n.english_us,D=l("option"),D.textContent=""+n.german_lang,O=l("option"),O.textContent=""+n.french_lang,X=l("option"),X.textContent=""+n.spanish_lang,L=l("option"),L.textContent=""+n.hindi_lang,N=l("option"),N.textContent=""+n.japanese_lang,U=l("option"),U.textContent=""+n.korean_lang,F=l("option"),F.textContent=""+n.italiano,K=l("option"),K.textContent=""+n.english_in,H=o(),J=l("div"),z=l("label"),$=l("input"),Y=o(),q=l("div"),Q=o(),W=l("label"),W.textContent=""+n.show_transcript,Z=o(),ee=l("div"),te=l("div"),ae=l("div"),le=l("b"),le.textContent=""+n.audio_recorder,ne=o(),oe=l("div"),ie=l("span"),ie.textContent=""+n.starting_message,se=o(),ce=l("div"),ce.innerHTML='<img src="//s3.amazonaws.com/jigyaasa_content_static/6ba174bf48e9b6dc8d8bd19d13c9caa9_000Awg.gif" alt="recording is on" class="w-100 h-100 img_fit"/>',re=o(),de=l("div"),de.innerHTML='<img src="//s3.amazonaws.com/jigyaasa_content_static/giphy_000AYi.gif" alt="audio is playing" class="w-100 h-100 img_fit"/>',ue=o(),ge=l("div"),be=l("button"),me=l("span"),_e=o(),fe=l("button"),ve=l("span"),Ce=o(),ye=l("button"),ke=l("span"),Se=o(),Re=l("div"),Te=l("div"),Be=l("div"),Ie=l("div"),Pe=l("div"),Ee=l("h4"),Ee.textContent=""+n.confirm_label,Ge=o(),je=l("button"),je.textContent="×",De=o(),Oe=l("div"),Xe=i(ze),Le=o(),Ne=l("div"),Ue=l("button"),Ue.textContent=""+n.no_label,Fe=o(),Ke=l("button"),Ke.textContent=""+n.yes_label,s(h,"class","noteColor bolder"),s(p,"class","col-12"),s(p,"tabindex","0"),s(p,"aria-label","Recording will end after 15 sec"),s(w,"class","pb-2"),s(k,"id","data_container"),k.disabled="disabled",s(k,"name","cdata"),s(k,"class","form-control"),s(k,"rows","3"),s(k,"cols","75"),k.value=A=e[3].cdata,s(k,"aria-label",S=n.spoken_label+" "+(""!=e[3].cdata?e[3].cdata:"Nothing")),s(x,"class","col-6 py-2 mb-1"),s(I,"for","language_select"),s(B,"class","select_label_container"),j.__value="en-US",j.value=j.__value,s(j,"aria-label","English United States"),D.__value="de-DE",D.value=D.__value,s(D,"aria-label","German"),O.__value="fr-FR",O.value=O.__value,s(O,"aria-label","French"),X.__value="es-ES",X.value=X.__value,s(X,"aria-label","Spanish"),L.__value="hi-IN",L.value=L.__value,s(L,"aria-label","Hindi"),N.__value="ja-JP",N.value=N.__value,s(N,"aria-label","Japanese"),U.__value="ko-KR",U.value=U.__value,s(U,"aria-label","Korean"),F.__value="it-IT",F.value=F.__value,s(F,"aria-label","Italian"),K.__value="en-IN",K.value=K.__value,s(K,"aria-label","English UK"),s(G,"id","language_select"),s(G,"name","language"),s(G,"class","disability_apply form-select form-control-sm"),s(G,"aria-label","Select the language for Recording"),s($,"type","checkbox"),s($,"name","showTranscript"),s($,"id","showTranscript"),s($,"tabindex","0"),s($,"class","form-check-input"),$.checked=V=e[3].showTranscript,s(q,"class","check_mark_custom pt-sm1"),s(z,"for","showTranscript"),s(z,"class","custom_checkbox_new float-left mr-1"),s(W,"for","showTranscript"),s(W,"class","form-check-label"),s(J,"class","form-check form-check-inline transcript_container mt-3"),s(T,"class","col-6 py-2 mb-1"),s(ae,"class","p-2 tokenfield bg-light mb-3"),s(ae,"aria-label","Audio Recorder"),s(ae,"tabindex","0"),s(ie,"class","align-self-center mx-auto authInitialState tokenfield"),s(ie,"aria-label","Click on record to start recording"),s(ie,"tabindex","0"),s(ce,"class","h authRecordingOn w-100 h-100 tokenfield"),s(ce,"aria-label","recording is on"),s(ce,"tabindex","0"),s(de,"class","h authAudioPlaying w-100 h-100 tokenfield"),s(de,"aria-label","Audio is playing"),s(de,"tabindex","0"),s(oe,"class","mx-auto text-danger recording_status initialState mb-3 d-flex mx-auto"),s(me,"class","icomoon-circle-2 s2 text-danger position-relative top1"),s(me,"data-bs-toggle","tooltip"),s(me,"data-bs-placement","top"),s(me,"title",pe="recording"==e[3].status?"Stop Recording":"Start Recording"),s(be,"type","button"),s(be,"name","recordButton"),s(be,"id","recordButton"),s(be,"class","btn btn-light py-0"),s(be,"aria-label",he="Click for "+e[2]),s(ve,"class","icomoon-24px-autoplay-4 position-relative top1"),s(ve,"data-bs-toggle","tooltip"),s(ve,"data-bs-placement","top"),s(ve,"title","Play Audio"),s(fe,"type","button"),s(fe,"name","stopButton"),s(fe,"id","stopButton"),fe.disabled=xe=e[3].disabled,s(fe,"class","btn btn-light py-0"),s(fe,"aria-label",we="Click for "+e[0]),s(ke,"class","icomoon-new-24px-reset-1 position-relative top1"),s(ke,"data-bs-toggle","tooltip"),s(ke,"data-bs-placement","top"),s(ke,"title","Reset Data"),s(ye,"type","button"),s(ye,"name","resetButton"),s(ye,"id","resetButton"),s(ye,"class","btn btn-light py-0"),ye.disabled=Ae=e[3].isReset,s(ye,"data-bs-toggle","modal"),s(ye,"data-bs-target","#authoring_confirm_modal"),s(ye,"aria-label","Click on this button for override the previous recording"),s(ge,"id","controls_container"),s(ge,"class","bg-light text-center w-100 p-2"),s(te,"class","border rounded shadow-sm"),s(ee,"class","col-12 col-md-8 offset-md-2"),s(a,"class","row"),s(t,"id","authoring_container"),s(t,"class","container"),s(Ee,"class","modal-title tokenfield"),s(Ee,"aria-label","Confirmation Dialog box"),s(Ee,"tabindex","0"),s(je,"type","button"),s(je,"class","close"),s(je,"data-bs-dismiss","modal"),s(je,"tabindex","0"),s(je,"aria-label","Click on this button for close the confirmation dialog box"),s(Pe,"class","modal-header"),s(Oe,"class","modal-body tokenfield"),s(Oe,"tabindex","0"),s(Oe,"aria-label",e[1]),s(Oe,"id","dialogBody"),s(Oe,"name","dialogBody"),s(Ue,"type","button"),s(Ue,"class","authoring_dismiss_modal btn btn-light pr-2"),s(Ue,"data-bs-dismiss","modal"),s(Ue,"tabindex","0"),s(Ue,"aria-label","Click on this button for neglecte to override previous recording"),s(Ke,"type","button"),s(Ke,"class","authoring_dismiss_done btn btn-primary"),s(Ke,"data-bs-dismiss","modal"),s(Ke,"tabindex","0"),s(Ke,"aria-label","Click on this button for override the previous recording"),s(Ne,"class","modal-footer"),s(Ie,"class","modal-content"),s(Be,"class","modal-dialog modal-md modal-dialog-centered"),s(Te,"class","modal fade"),s(Te,"id","authoring_confirm_modal"),s(Re,"class","authoring_modal_container container")},m(l,n){c(l,t,n),r(t,a),r(a,p),r(p,h),r(p,_),r(p,f),r(a,v),r(a,x),r(x,w),r(w,C),r(x,y),r(x,k),r(a,R),r(a,T),r(T,B),r(B,I),r(I,P),r(T,E),r(T,G),r(G,j),r(G,D),r(G,O),r(G,X),r(G,L),r(G,N),r(G,U),r(G,F),r(G,K),d(G,e[3].language),r(T,H),r(T,J),r(J,z),r(z,$),r(z,Y),r(z,q),r(J,Q),r(J,W),r(a,Z),r(a,ee),r(ee,te),r(te,ae),r(ae,le),r(te,ne),r(te,oe),r(oe,ie),r(oe,se),r(oe,ce),r(oe,re),r(oe,de),r(te,ue),r(te,ge),r(ge,be),r(be,me),r(ge,_e),r(ge,fe),r(fe,ve),r(ge,Ce),r(ge,ye),r(ye,ke),c(l,Se,n),c(l,Re,n),r(Re,Te),r(Te,Be),r(Be,Ie),r(Ie,Pe),r(Pe,Ee),r(Pe,Ge),r(Pe,je),r(Ie,De),r(Ie,Oe),r(Oe,Xe),r(Ie,Le),r(Ie,Ne),r(Ne,Ue),r(Ne,Fe),r(Ne,Ke),Me||(He=[u(k,"change",e[5]),u(G,"change",e[5]),u(G,"blur",e[5]),u($,"click",e[4]),u($,"keyup",e[11]),u(be,"click",e[6]),u(fe,"click",e[8]),u(ye,"click",e[7]),u(Ue,"click",e[10]),u(Ke,"click",e[9])],Me=!0)},p(e,[t]){8&t&&A!==(A=e[3].cdata)&&(k.value=A),8&t&&S!==(S=n.spoken_label+" "+(""!=e[3].cdata?e[3].cdata:"Nothing"))&&s(k,"aria-label",S),8&t&&M!==(M=e[3].language)&&d(G,e[3].language),8&t&&V!==(V=e[3].showTranscript)&&($.checked=V),8&t&&pe!==(pe="recording"==e[3].status?"Stop Recording":"Start Recording")&&s(me,"title",pe),4&t&&he!==(he="Click for "+e[2])&&s(be,"aria-label",he),8&t&&xe!==(xe=e[3].disabled)&&(fe.disabled=xe),1&t&&we!==(we="Click for "+e[0])&&s(fe,"aria-label",we),8&t&&Ae!==(Ae=e[3].isReset)&&(ye.disabled=Ae),2&t&&s(Oe,"aria-label",e[1])},i:g,o:g,d(e){e&&b(t),e&&b(Se),e&&b(Re),Me=!1,m(He)}}}function x(e,t,a){let l,o,i,s,c,r,d,{getChildXml:u}=t,{xml:g}=t,b="no",m=15,v={language:"",cdata:"",disabled:!0,xml:"",status:"",isReset:!0,showTranscript:!1,counter:0};function x(e){!function(e){try{a(3,v.language=e.smxml._language,v),a(3,v.cdata=e.smxml.__cdata,v),a(3,v.status=e.smxml._status,v),a(3,v.disabled="recordingStopped"!=e.smxml._status,v),a(3,v.isReset="true"==e.smxml._isReset,v),a(3,v.showTranscript="true"==e.smxml._showTranscript,v),C()}catch(e){console.warn({error:e.message,"function name":"parseXMLAuthoring","File name":"AudioRecorder.svelte"})}}(f(e))}function w(e){a(3,v.showTranscript=e.target.checked,v),C()}function C(){!function(e){u(e)}('<smxml type="43" name="AudioRecorder" status="'+v.status+'" language="'+v.language+'" isReset="'+v.isReset+'" showTranscript="'+v.showTranscript+'">\x3c!--[CDATA['+v.cdata+"]]--\x3e</smxml>"),""!=v.status?(h.select(".disability_apply, #showTranscript").disabled="disabled",h.selectAll(".transcript_container, .select_label_container label","addClass","disabledState"),h.selectAll(".transcript_container,#showTranscript")[1].disabled=!0):(h.select(".disability_apply, #showTranscript").disabled="",h.selectAll(".transcript_container, .select_label_container label","removeClass","disabledState"),h.selectAll(".transcript_container,#showTranscript")[1].disabled=!1),a(0,i=h.select("#authoring_container #stopButton span").getAttribute("data-original-title")),a(2,c=h.select("#authoring_container #recordButton span").getAttribute("data-original-title")),a(1,s=h.select("#dialogBody").innerText)}function y(){switch(v.status){case"recording":k();break;case"recordingStopped":h.getBS("#authoring_confirm_modal","Modal").show(),h.select(".modal-body").focus();break;default:window.webkitSpeechRecognition||window.SpeechRecognition?(window.SpeechRecognition=window.webkitSpeechRecognition||window.SpeechRecognition,l=new SpeechRecognition,l.continuous=!0,l.interimResults=!0,l.lang=v.language,window.recognitionData=l,l.addEventListener("end",(function(){v.isReset||(clearTimeout(r),h.alert(n.recording_ended),A(),h.selectAll(".authInitialState","removeClass","h"),a(3,v.status="recordingStopped",v),a(3,v.disabled=!1,v),C())}))):h.alert(n.browser_support_msg),l.start(),h.select("#resetButton").disabled="",h.selectAll(".authAudioPlaying, .authInitialState","addClass","h"),h.selectAll(".authRecordingOn","removeClass","h"),l.onresult=e=>{let t="";for(let a=0;a<e.results.length;a+=1)t+=e.results[a][0].transcript;a(3,v.cdata=t.trim(),v),C()},a(3,v.status="recording",v),a(3,v.isReset=!1,v),a(3,v.counter=0,v),m=15,S(),C(),h.selectAll("#recordButton span","removeClass",["icomoon-circle-2","s2","text-danger"]),h.selectAll("#recordButton span","addClass","icomoon-24px-stop")}}function k(){A(),clearTimeout(r),a(3,v.status="recordingStopped",v),a(3,v.disabled=!1,v),C(),h.select(".authInitialState","removeClass","h"),l.stop()}function A(){h.selectAll(".authAudioPlaying, .authRecordingOn","addClass","h"),h.selectAll(".authInitialState","removeClass","h"),h.selectAll("#recordButton span","removeClass","icomoon-24px-stop"),h.selectAll("#recordButton span","addClass",["icomoon-circle-2","s2","text-danger"])}function S(){m-=1,a(3,v.counter=v.counter+1,v),r=setTimeout((function(){m>0?S():k()}),1e3)}return p((()=>{h.enableBsAll("[data-bs-toggle='tooltip']","Tooltip",{container:"body"}),a(3,v.xml=g,v),x(g)})),_((()=>{g!=v.xml&&(a(3,v.xml=g,v),x(g))})),e.$$set=e=>{"getChildXml"in e&&a(12,u=e.getChildXml),"xml"in e&&a(13,g=e.xml)},[i,s,c,v,w,function(e){a(3,v[e.target.name]=e.target.value,v),C()},y,function(){b="yes"},function(){window.speechSynthesis?(o=window.speechSynthesis,""!=v.cdata?(h.selectAll(".authRecordingOn, .authInitialState","addClass","h"),h.selectAll(".authAudioPlaying","removeClass","h"),a(3,v.disabled=!0,v),C(),function(){let e=new SpeechSynthesisUtterance(v.cdata),t="de-DE"==v.language?"Google Deutsch":"fr-FR"==v.language?"Google français":"es-ES"==v.language?"Google español":"hi-IN"==v.language?"Google हिन्दी":"ja-JP"==v.language?"Google 日本語":"ko-KR"==v.language?"Google 한국의":"it-IT"==v.language?"Google italiano":"Google US English";e.addEventListener("end",(function(){h.selectAll(".authAudioPlaying, .authRecordingOn","addClass","h"),h.selectAll(".authInitialState","removeClass","h"),a(3,v.disabled=!1,v),C(),o.cancel()})),setTimeout((function(){d=o.getVoices();for(let a=0;a<d.length;a++)d[a].name==t&&(e.voice=d[a],e.pitch=1,e.rate=1,e.lang=v.language,o.speak(e))}),10)}()):(h.selectAll(".authRecordingOn, .authAudioPaused","addClass","h"),h.selectAll(".authInitialState","removeClass","h"),h.alert(n.no_data_msg))):h.alert(n.browser_support_msg)},function(){if("yes"==b)!function(){A(),"recording"==v.status&&l.stop();a(3,v.language="",v),a(3,v.cdata="",v),a(3,v.disabled=!0,v),a(3,v.xml="",v),a(3,v.status="",v),a(3,v.isReset=!0,v),clearTimeout(r),C()}(),b="no";else{a(3,v.cdata="",v),a(3,v.disabled=!0,v),a(3,v.status="",v),C();let e=setTimeout((function(){y(),clearTimeout(e)}),120)}},function(){b="no"},function(e){13==e.keyCode&&w(e)},u,g]}export default class extends e{constructor(e){super(),t(this,e,x,v,a,{getChildXml:12,xml:13})}}
//# sourceMappingURL=AudioRecorder-37e49c04.js.map
