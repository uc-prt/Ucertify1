import{S as t,i as e,s as a,e as l,C as i,b as s,u as o,f as n,h as c,j as r,T as d,l as u,r as g,o as b,y as m,p,A as h,a4 as _,X as f}from"./main-2f393680.js";function v(t){let e,a,p,h,_,f,v,x,w,C,y,k,A,S,R,T,B,I,E,G,P,D,O,X,j,L,N,U,F,M,H,z,K,$,J,V,Y,q,Q,W,Z,tt,et,at,lt,it,st,ot,nt,ct,rt,dt,ut,gt,bt,mt,pt,ht,_t,ft,vt,xt,wt,Ct,yt,kt,At,St,Rt,Tt,Bt,It,Et,Gt,Pt,Dt,Ot,Xt,jt,Lt,Nt,Ut,Ft,Mt=i.recording_warning+"",Ht=i.modal_data+"";return{c(){e=l("div"),a=l("div"),p=l("div"),h=l("b"),h.textContent=""+i.note_label,_=s(),f=o(Mt),v=s(),x=l("div"),w=l("div"),C=l("b"),C.textContent=""+i.spoken_label,y=s(),k=l("textarea"),R=s(),T=l("div"),B=l("div"),I=l("label"),E=l("b"),E.textContent=""+i.select_lang,G=s(),P=l("select"),D=l("option"),D.textContent=""+i.english_us,O=l("option"),O.textContent=""+i.hindi_lang,X=l("option"),X.textContent=""+i.svenska,j=l("option"),j.textContent=""+i.suomi,L=l("option"),L.textContent=""+i.italiano,N=l("option"),N.textContent=""+i.english_in,F=s(),M=l("div"),H=l("label"),z=l("input"),$=s(),J=l("div"),V=s(),Y=l("label"),Y.textContent=""+i.show_transcript,q=s(),Q=l("div"),W=l("div"),Z=l("div"),tt=l("b"),tt.textContent=""+i.audio_recorder,et=s(),at=l("div"),lt=l("span"),lt.textContent=""+i.starting_message,it=s(),st=l("div"),st.innerHTML='<img src="//s3.amazonaws.com/jigyaasa_content_static/6ba174bf48e9b6dc8d8bd19d13c9caa9_000Awg.gif" alt="recording is on" class="w-100 h-100 img_fit"/>',ot=s(),nt=l("div"),nt.innerHTML='<img src="//s3.amazonaws.com/jigyaasa_content_static/giphy_000AYi.gif" alt="audio is playing" class="w-100 h-100 img_fit"/>',ct=s(),rt=l("div"),dt=l("button"),ut=l("span"),mt=s(),pt=l("button"),ht=l("span"),vt=s(),xt=l("button"),wt=l("span"),yt=s(),kt=l("div"),At=l("div"),St=l("div"),Rt=l("div"),Tt=l("div"),Bt=l("h4"),Bt.textContent=""+i.confirm_label,It=s(),Et=l("button"),Et.textContent="×",Gt=s(),Pt=l("div"),Dt=o(Ht),Ot=s(),Xt=l("div"),jt=l("button"),jt.textContent=""+i.no_label,Lt=s(),Nt=l("button"),Nt.textContent=""+i.yes_label,n(h,"class","noteColor bolder"),n(p,"class","col-12"),n(p,"tabindex","0"),n(p,"aria-label","Recording will end after 15 sec"),n(w,"class","pb-2"),n(k,"id","data_container"),k.disabled="disabled",n(k,"name","cdata"),n(k,"class","form-control"),n(k,"rows","3"),n(k,"cols","75"),k.value=A=t[3].cdata,n(k,"aria-label",S=i.spoken_label+" "+(""!=t[3].cdata?t[3].cdata:"Nothing")),n(x,"class","col-6 py-2 mb-1"),n(I,"for","language_select"),n(B,"class","select_label_container"),D.__value="en-US",D.value=D.__value,n(D,"aria-label","English United States"),O.__value="hi-IN",O.value=O.__value,n(O,"aria-label","Hindi"),X.__value="sv-SE",X.value=X.__value,n(X,"aria-label","Swedish"),j.__value="fi-FI",j.value=j.__value,n(j,"aria-label","Finnish"),L.__value="it-IT",L.value=L.__value,n(L,"aria-label","Italian"),N.__value="en-IN",N.value=N.__value,n(N,"aria-label","English UK"),n(P,"id","language_select"),n(P,"name","language"),n(P,"class","disability_apply form-select form-control-sm"),n(P,"aria-label","Select the language for Recording"),n(z,"type","checkbox"),n(z,"name","showTranscript"),n(z,"id","showTranscript"),n(z,"tabindex","0"),n(z,"class","form-check-input"),z.checked=K=t[3].showTranscript,n(J,"class","check_mark_custom pt-sm1"),n(H,"for","showTranscript"),n(H,"class","custom_checkbox_new float-left mr-1"),n(Y,"for","showTranscript"),n(Y,"class","form-check-label"),n(M,"class","form-check form-check-inline transcript_container mt-3"),n(T,"class","col-6 py-2 mb-1"),n(Z,"class","p-2 tokenfield bg-light mb-3"),n(Z,"aria-label","Audio Recorder"),n(Z,"tabindex","0"),n(lt,"class","align-self-center mx-auto authInitialState tokenfield"),n(lt,"aria-label","Click on record to start recording"),n(lt,"tabindex","0"),n(st,"class","h authRecordingOn w-100 h-100 tokenfield"),n(st,"aria-label","recording is on"),n(st,"tabindex","0"),n(nt,"class","h authAudioPlaying w-100 h-100 tokenfield"),n(nt,"aria-label","Audio is playing"),n(nt,"tabindex","0"),n(at,"class","mx-auto text-danger recording_status initialState mb-3 d-flex mx-auto"),n(ut,"class","icomoon-circle-2 s2 text-danger position-relative top1"),n(ut,"data-bs-toggle","tooltip"),n(ut,"data-bs-placement","top"),n(ut,"title",gt="recording"==t[3].status?"Stop Recording":"Start Recording"),n(dt,"type","button"),n(dt,"name","recordButton"),n(dt,"id","recordButton"),n(dt,"class","btn btn-light py-0"),n(dt,"aria-label",bt="Click for "+t[2]),n(ht,"class","icomoon-24px-autoplay-4 position-relative top1"),n(ht,"data-bs-toggle","tooltip"),n(ht,"data-bs-placement","top"),n(ht,"title","Play Audio"),n(pt,"type","button"),n(pt,"name","stopButton"),n(pt,"id","stopButton"),pt.disabled=_t=t[3].disabled,n(pt,"class","btn btn-light py-0"),n(pt,"aria-label",ft="Click for "+t[0]),n(wt,"class","icomoon-new-24px-reset-1 position-relative top1"),n(wt,"data-bs-toggle","tooltip"),n(wt,"data-bs-placement","top"),n(wt,"title","Reset Data"),n(xt,"type","button"),n(xt,"name","resetButton"),n(xt,"id","resetButton"),n(xt,"class","btn btn-light py-0"),xt.disabled=Ct=t[3].isReset,n(xt,"data-bs-toggle","modal"),n(xt,"data-bs-target","#authoring_confirm_modal"),n(xt,"aria-label","Click on this button for override the previous recording"),n(rt,"id","controls_container"),n(rt,"class","bg-light text-center w-100 p-2"),n(W,"class","border rounded shadow-sm"),n(Q,"class","col-12 col-md-8 offset-md-2"),n(a,"class","row"),n(e,"id","authoring_container"),n(e,"class","container"),n(Bt,"class","modal-title tokenfield"),n(Bt,"aria-label","Confirmation Dialog box"),n(Bt,"tabindex","0"),n(Et,"type","button"),n(Et,"class","close"),n(Et,"data-bs-dismiss","modal"),n(Et,"tabindex","0"),n(Et,"aria-label","Click on this button for close the confirmation dialog box"),n(Tt,"class","modal-header"),n(Pt,"class","modal-body tokenfield"),n(Pt,"tabindex","0"),n(Pt,"aria-label",t[1]),n(Pt,"id","dialogBody"),n(Pt,"name","dialogBody"),n(jt,"type","button"),n(jt,"class","authoring_dismiss_modal btn btn-light pr-2"),n(jt,"data-bs-dismiss","modal"),n(jt,"tabindex","0"),n(jt,"aria-label","Click on this button for neglecte to override previous recording"),n(Nt,"type","button"),n(Nt,"class","authoring_dismiss_done btn btn-primary"),n(Nt,"data-bs-dismiss","modal"),n(Nt,"tabindex","0"),n(Nt,"aria-label","Click on this button for override the previous recording"),n(Xt,"class","modal-footer"),n(Rt,"class","modal-content"),n(St,"class","modal-dialog modal-md modal-dialog-centered"),n(At,"class","modal fade"),n(At,"id","authoring_confirm_modal"),n(kt,"class","authoring_modal_container container")},m(l,i){c(l,e,i),r(e,a),r(a,p),r(p,h),r(p,_),r(p,f),r(a,v),r(a,x),r(x,w),r(w,C),r(x,y),r(x,k),r(a,R),r(a,T),r(T,B),r(B,I),r(I,E),r(T,G),r(T,P),r(P,D),r(P,O),r(P,X),r(P,j),r(P,L),r(P,N),d(P,t[3].language),r(T,F),r(T,M),r(M,H),r(H,z),r(H,$),r(H,J),r(M,V),r(M,Y),r(a,q),r(a,Q),r(Q,W),r(W,Z),r(Z,tt),r(W,et),r(W,at),r(at,lt),r(at,it),r(at,st),r(at,ot),r(at,nt),r(W,ct),r(W,rt),r(rt,dt),r(dt,ut),r(rt,mt),r(rt,pt),r(pt,ht),r(rt,vt),r(rt,xt),r(xt,wt),c(l,yt,i),c(l,kt,i),r(kt,At),r(At,St),r(St,Rt),r(Rt,Tt),r(Tt,Bt),r(Tt,It),r(Tt,Et),r(Rt,Gt),r(Rt,Pt),r(Pt,Dt),r(Rt,Ot),r(Rt,Xt),r(Xt,jt),r(Xt,Lt),r(Xt,Nt),Ut||(Ft=[u(k,"change",t[5]),u(P,"change",t[5]),u(P,"blur",t[5]),u(z,"click",t[4]),u(z,"keyup",t[11]),u(dt,"click",t[6]),u(pt,"click",t[8]),u(xt,"click",t[7]),u(jt,"click",t[10]),u(Nt,"click",t[9])],Ut=!0)},p(t,[e]){8&e&&A!==(A=t[3].cdata)&&(k.value=A),8&e&&S!==(S=i.spoken_label+" "+(""!=t[3].cdata?t[3].cdata:"Nothing"))&&n(k,"aria-label",S),8&e&&U!==(U=t[3].language)&&d(P,t[3].language),8&e&&K!==(K=t[3].showTranscript)&&(z.checked=K),8&e&&gt!==(gt="recording"==t[3].status?"Stop Recording":"Start Recording")&&n(ut,"title",gt),4&e&&bt!==(bt="Click for "+t[2])&&n(dt,"aria-label",bt),8&e&&_t!==(_t=t[3].disabled)&&(pt.disabled=_t),1&e&&ft!==(ft="Click for "+t[0])&&n(pt,"aria-label",ft),8&e&&Ct!==(Ct=t[3].isReset)&&(xt.disabled=Ct),2&e&&n(Pt,"aria-label",t[1])},i:g,o:g,d(t){t&&b(e),t&&b(yt),t&&b(kt),Ut=!1,m(Ft)}}}function x(t,e,a){let l,s,o,n,c,r,d,{getChildXml:u}=e,{xml:g}=e,b="no",m=15,v={language:"",cdata:"",disabled:!0,xml:"",status:"",isReset:!0,showTranscript:!1,counter:0};function x(t){!function(t){try{a(3,v.language=t.smxml._language,v),a(3,v.cdata=t.smxml.__cdata,v),a(3,v.status=t.smxml._status,v),a(3,v.disabled="recordingStopped"!=t.smxml._status,v),a(3,v.isReset="true"==t.smxml._isReset,v),a(3,v.showTranscript="true"==t.smxml._showTranscript,v),C()}catch(t){console.warn({error:t.message,"function name":"parseXMLAuthoring","File name":"AudioRecorder.svelte"})}}(f(t))}function w(t){a(3,v.showTranscript=t.target.checked,v),C()}function C(){!function(t){u(t)}('<smxml type="43" name="AudioRecorder" status="'+v.status+'" language="'+v.language+'" isReset="'+v.isReset+'" showTranscript="'+v.showTranscript+'">\x3c!--[CDATA['+v.cdata+"]]--\x3e</smxml>"),""!=v.status?(h.select(".disability_apply, #showTranscript").disabled="disabled",h.selectAll(".transcript_container, .select_label_container label","addClass","disabledState"),h.selectAll(".transcript_container,#showTranscript")[1].disabled=!0):(h.select(".disability_apply, #showTranscript").disabled="",h.selectAll(".transcript_container, .select_label_container label","removeClass","disabledState"),h.selectAll(".transcript_container,#showTranscript")[1].disabled=!1),a(0,o=h.select("#authoring_container #stopButton span").getAttribute("data-original-title")),a(2,c=h.select("#authoring_container #recordButton span").getAttribute("data-original-title")),a(1,n=h.select("#dialogBody").innerText)}function y(){switch(v.status){case"recording":k();break;case"recordingStopped":h.getBS("#authoring_confirm_modal","Modal").show(),h.select(".modal-body").focus();break;default:window.webkitSpeechRecognition||window.SpeechRecognition?(window.SpeechRecognition=window.webkitSpeechRecognition||window.SpeechRecognition,l=new SpeechRecognition,l.continuous=!0,l.interimResults=!0,l.lang=v.language,window.recognitionData=l,l.addEventListener("end",(function(){v.isReset||(clearTimeout(r),h.alert(i.recording_ended),A(),h.selectAll(".authInitialState","removeClass","h"),a(3,v.status="recordingStopped",v),a(3,v.disabled=!1,v),C())}))):h.alert(i.browser_support_msg),l.start(),h.select("#resetButton").disabled="",h.selectAll(".authAudioPlaying, .authInitialState","addClass","h"),h.selectAll(".authRecordingOn","removeClass","h"),l.onresult=t=>{let e="";for(let a=0;a<t.results.length;a+=1)e+=t.results[a][0].transcript;a(3,v.cdata=e.trim(),v),C()},a(3,v.status="recording",v),a(3,v.isReset=!1,v),a(3,v.counter=0,v),m=15,S(),C(),h.selectAll("#recordButton span","removeClass",["icomoon-circle-2","s2","text-danger"]),h.selectAll("#recordButton span","addClass","icomoon-24px-stop")}}function k(){A(),clearTimeout(r),a(3,v.status="recordingStopped",v),a(3,v.disabled=!1,v),C(),h.select(".authInitialState","removeClass","h"),l.stop()}function A(){h.selectAll(".authAudioPlaying, .authRecordingOn","addClass","h"),h.selectAll(".authInitialState","removeClass","h"),h.selectAll("#recordButton span","removeClass","icomoon-24px-stop"),h.selectAll("#recordButton span","addClass",["icomoon-circle-2","s2","text-danger"])}function S(){m-=1,a(3,v.counter=v.counter+1,v),r=setTimeout((function(){m>0?S():k()}),1e3)}return p((()=>{h.enableBsAll("[data-bs-toggle='tooltip']","Tooltip",{container:"body"}),a(3,v.xml=g,v),x(g)})),_((()=>{g!=v.xml&&(a(3,v.xml=g,v),x(g))})),t.$$set=t=>{"getChildXml"in t&&a(12,u=t.getChildXml),"xml"in t&&a(13,g=t.xml)},[o,n,c,v,w,function(t){a(3,v[t.target.name]=t.target.value,v),C()},y,function(){b="yes"},function(){window.speechSynthesis?(s=window.speechSynthesis,""!=v.cdata?(h.selectAll(".authRecordingOn, .authInitialState","addClass","h"),h.selectAll(".authAudioPlaying","removeClass","h"),a(3,v.disabled=!0,v),C(),function(){let t=new SpeechSynthesisUtterance(v.cdata),e="de-DE"==v.language?"Google Deutsch":"fr-FR"==v.language?"Google français":"es-ES"==v.language?"Google español":"hi-IN"==v.language?"Google हिन्दी":"ja-JP"==v.language?"Google 日本語":"ko-KR"==v.language?"Google 한국의":"it-IT"==v.language?"Google italiano":"Google US English";t.addEventListener("end",(function(){h.selectAll(".authAudioPlaying, .authRecordingOn","addClass","h"),h.selectAll(".authInitialState","removeClass","h"),a(3,v.disabled=!1,v),C(),s.cancel()})),setTimeout((function(){d=s.getVoices();for(let a=0;a<d.length;a++)d[a].name==e&&(t.voice=d[a],t.pitch=1,t.rate=1,t.lang=v.language,s.speak(t))}),10)}()):(h.selectAll(".authRecordingOn, .authAudioPaused","addClass","h"),h.selectAll(".authInitialState","removeClass","h"),h.alert(i.no_data_msg))):h.alert(i.browser_support_msg)},function(){if("yes"==b)!function(){A(),"recording"==v.status&&l.stop();a(3,v.language="",v),a(3,v.cdata="",v),a(3,v.disabled=!0,v),a(3,v.xml="",v),a(3,v.status="",v),a(3,v.isReset=!0,v),clearTimeout(r),C()}(),b="no";else{a(3,v.cdata="",v),a(3,v.disabled=!0,v),a(3,v.status="",v),C();let t=setTimeout((function(){y(),clearTimeout(t)}),120)}},function(){b="no"},function(t){13==t.keyCode&&w(t)},u,g]}export default class extends t{constructor(t){super(),e(this,t,x,v,a,{getChildXml:12,xml:13})}}
//# sourceMappingURL=AudioRecorder-a5f775ee.js.map
