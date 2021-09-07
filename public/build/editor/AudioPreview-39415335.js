import{S as e,i as t,s as a,e as o,c as i,b as n,C as s,u as r,f as l,h as c,j as d,m as p,l as u,t as m,a as b,o as g,d as w,y as v,p as f,A as h,X as _,W as x}from"./main-2c2cbab0.js";import{I as k}from"./ItemHelper-5011163d.js";import{s as A}from"./style-inject.es-1f59c1d0.js";function C(e){let t,a,i,p,m,b,w,f,h,_,x,k,A,C,y,S,T,B,E,I,O,$,L,P,D,j,G,M,N,z,H,U,X,Y,F,J,K=s.recording_warning+"",V=1==e[4].showTranscript&&R(e);return{c(){t=o("div"),a=o("div"),i=o("b"),i.textContent=""+s.note_label,p=n(),m=r(K),b=n(),V&&V.c(),w=n(),f=o("div"),h=o("div"),_=o("div"),x=o("b"),x.textContent=""+s.audio_recorder,k=n(),A=o("div"),C=o("span"),C.textContent=""+s.starting_message,y=n(),S=o("div"),S.innerHTML='<img src="//s3.amazonaws.com/jigyaasa_content_static/6ba174bf48e9b6dc8d8bd19d13c9caa9_000Awg.gif" alt="recording is on" class="w-100 h-100 img_fit"/>',T=n(),B=o("div"),B.innerHTML='<img src="//s3.amazonaws.com/jigyaasa_content_static/giphy_000AYi.gif" alt="audio is playing" class="w-100 h-100 img_fit"/>',E=n(),I=o("div"),O=o("button"),$=o("span"),D=n(),j=o("button"),G=o("span"),z=n(),H=o("button"),U=o("span"),l(i,"class","noteColor bolder"),l(a,"class",""),l(a,"tabindex","0"),l(a,"aria-label","Recording will end after 15 sec"),l(t,"class","col-12 pb-3"),l(_,"class","p-2 tokenfield bg-light mb-3"),l(_,"aria-label","Audio Recorder"),l(_,"tabindex","0"),l(C,"class","align-self-center mx-auto previewInitialState tokenfield"),l(C,"aria-label","Click on record to start recording"),l(C,"tabindex","0"),l(S,"class","h previewRecordingOn tokenfield"),l(S,"aria-label","recording is on"),l(S,"tabindex","0"),l(B,"class","h previewAudioPlaying tokenfield"),l(B,"aria-label","Audio is playing"),l(B,"tabindex","0"),l(A,"class","mx-auto text-danger recording_status initialState mb-3 d-flex mx-auto"),l($,"class","icomoon-circle-2 s2 text-danger position-relative top1"),l($,"data-bs-toggle","tooltip"),l($,"data-bs-placement","top"),l($,"title",L="recording"==e[4].status?"Stop Recording":"Start Recording"),l($,"id","recordButtonTooltip"),l($,"name","recordButtonTooltip"),l(O,"type","button"),l(O,"name","preview_recordButton"),l(O,"id","preview_recordButton"),l(O,"class","btn btn-light py-0"),l(O,"aria-label",P="Click for "+e[3]),l(G,"class","icomoon-24px-autoplay-4 position-relative top1"),l(G,"data-bs-toggle","tooltip"),l(G,"data-bs-placement","top"),l(G,"title","Play Audio"),l(G,"id","stopButtonTooltip"),l(G,"name","stopButtonTooltip"),l(j,"type","button"),l(j,"name","preview_stopButton"),l(j,"id","preview_stopButton"),j.disabled=M=e[4].disabled,l(j,"class","btn btn-light py-0"),l(j,"aria-label",N="Click for "+e[1]),l(U,"class","icomoon-new-24px-reset-1 position-relative top1"),l(U,"data-bs-toggle","tooltip"),l(U,"data-placement","top"),l(U,"title","Reset Data"),l(H,"type","button"),l(H,"name","resetButton"),l(H,"id","resetButton"),l(H,"class","btn btn-light py-0"),H.disabled=X=e[4].isReset,l(H,"data-bs-toggle","modal"),l(H,"data-bs-target","#preview_confirm_modal"),l(H,"aria-label","Click on this button for override the previous recording"),l(I,"id","controls_container"),l(I,"class",Y="bg-light text-center w-100 p-2 "+("none"==e[4].pointerEvents?"pointerEventOff":"pointerEventOn")),l(h,"class","border rounded shadow-sm"),l(f,"class","col-12 col-md-8 offset-md-2")},m(o,n){c(o,t,n),d(t,a),d(a,i),d(a,p),d(a,m),c(o,b,n),V&&V.m(o,n),c(o,w,n),c(o,f,n),d(f,h),d(h,_),d(_,x),d(h,k),d(h,A),d(A,C),d(A,y),d(A,S),d(A,T),d(A,B),d(h,E),d(h,I),d(I,O),d(O,$),d(I,D),d(I,j),d(j,G),d(I,z),d(I,H),d(H,U),F||(J=[u(O,"click",e[7]),u(j,"click",e[10]),u(H,"click",e[8])],F=!0)},p(e,t){1==e[4].showTranscript?V?V.p(e,t):(V=R(e),V.c(),V.m(w.parentNode,w)):V&&(V.d(1),V=null),16&t[0]&&L!==(L="recording"==e[4].status?"Stop Recording":"Start Recording")&&l($,"title",L),8&t[0]&&P!==(P="Click for "+e[3])&&l(O,"aria-label",P),16&t[0]&&M!==(M=e[4].disabled)&&(j.disabled=M),2&t[0]&&N!==(N="Click for "+e[1])&&l(j,"aria-label",N),16&t[0]&&X!==(X=e[4].isReset)&&(H.disabled=X),16&t[0]&&Y!==(Y="bg-light text-center w-100 p-2 "+("none"==e[4].pointerEvents?"pointerEventOff":"pointerEventOn"))&&l(I,"class",Y)},d(e){e&&g(t),e&&g(b),V&&V.d(e),e&&g(w),e&&g(f),F=!1,v(J)}}}function y(e){let t,a,i,p,u,m=s.insensitive_message+"";function b(e,t){return 1!=e[5]?T:S}let w=b(e),v=w(e);return{c(){v.c(),t=n(),a=o("div"),i=o("b"),i.textContent=""+s.note_label,p=n(),u=r(m),l(i,"class","noteColor bolder"),l(a,"class","col-12 pb-3"),l(a,"tabindex","0"),l(a,"aria-label","matching is case insensitive")},m(e,o){v.m(e,o),c(e,t,o),c(e,a,o),d(a,i),d(a,p),d(a,u)},p(e,a){w===(w=b(e))&&v?v.p(e,a):(v.d(1),v=w(e),v&&(v.c(),v.m(t.parentNode,t)))},d(e){v.d(e),e&&g(t),e&&g(a)}}}function R(e){let t,a,i,r,p,u,m,b;return{c(){t=o("div"),a=o("div"),i=o("label"),r=o("b"),r.textContent=""+s.spoken_label,p=n(),u=o("textarea"),l(i,"for","preview_show_transcript"),l(u,"id","preview_show_transcript"),l(u,"name","preview_show_transcript"),l(u,"class","w-100 form-control"),l(u,"rows","2"),u.value=m=e[4].cdata,u.readOnly="readonly",l(u,"tabindex","0"),l(u,"aria-label",b=s.spoken_label+" "+(""!=e[4].cdata.trim()?e[4].cdata.trim():"Nothing")),l(t,"class","col-12 pb-3")},m(e,o){c(e,t,o),d(t,a),d(a,i),d(i,r),d(t,p),d(t,u)},p(e,t){16&t[0]&&m!==(m=e[4].cdata)&&(u.value=m),16&t[0]&&b!==(b=s.spoken_label+" "+(""!=e[4].cdata.trim()?e[4].cdata.trim():"Nothing"))&&l(u,"aria-label",b)},d(e){e&&g(t)}}}function S(e){let t,a,i,n,s;return{c(){t=o("div"),a=o("textarea"),l(a,"id","preview_data_container"),l(a,"name","cdata"),l(a,"class",i="w-100 form-control "+(1==e[4].useransstatus?"border-success typeCorrect":"border-danger typeIncorrect")),l(a,"rows","2"),a.value=n=e[4].cdata,a.readOnly="readonly",l(a,"tabindex","0"),l(a,"aria-label",s="Your answer is "+e[4].cdata+" which is "+(e[4].cdata.toLowerCase().trim()==e[4].correctAns.toLowerCase().trim()?"Correct":"Incorrect")),l(t,"class","col-12 py-3")},m(e,o){c(e,t,o),d(t,a)},p(e,t){16&t[0]&&i!==(i="w-100 form-control "+(1==e[4].useransstatus?"border-success typeCorrect":"border-danger typeIncorrect"))&&l(a,"class",i),16&t[0]&&n!==(n=e[4].cdata)&&(a.value=n),16&t[0]&&s!==(s="Your answer is "+e[4].cdata+" which is "+(e[4].cdata.toLowerCase().trim()==e[4].correctAns.toLowerCase().trim()?"Correct":"Incorrect"))&&l(a,"aria-label",s)},d(e){e&&g(t)}}}function T(e){let t,a,i,n;return{c(){t=o("div"),a=o("textarea"),l(a,"id","preanswer_data_container"),l(a,"name","cdata"),l(a,"class","w-100 form-control border-success typeCorrect"),l(a,"rows","2"),a.value=i=e[4].correctAns,a.readOnly="readonly",l(a,"tabindex","0"),l(a,"aria-label",n="correct Answer is "+e[4].correctAns),l(t,"class","col-12 py-3")},m(e,o){c(e,t,o),d(t,a)},p(e,t){16&t[0]&&i!==(i=e[4].correctAns)&&(a.value=i),16&t[0]&&n!==(n="correct Answer is "+e[4].correctAns)&&l(a,"aria-label",n)},d(e){e&&g(t)}}}function B(e){let t,a,f,h,_,x,A,R,S,T,B,E,I,O,$,L,P,D,j,G,M,N,z,H,U=s.modal_data+"";function X(e,t){return e[0]?y:C}f=new k({props:{reviewMode:e[0],handleReviewClick:e[13]}}),f.$on("setReview",e[11]),f.$on("unsetReview",e[12]);let Y=X(e),F=Y(e);return{c(){t=o("div"),a=o("div"),i(f.$$.fragment),h=n(),F.c(),_=n(),x=o("div"),A=o("div"),R=o("div"),S=o("div"),T=o("div"),B=o("h4"),B.textContent=""+s.confirm_label,E=n(),I=o("button"),I.textContent="×",O=n(),$=o("div"),L=r(U),P=n(),D=o("div"),j=o("button"),j.textContent=""+s.no_label,G=n(),M=o("button"),M.textContent=""+s.yes_label,l(a,"class","row"),l(t,"id","preview_container"),l(t,"class","container"),l(B,"class","modal-title tokenfield"),l(B,"aria-label","Confirmation Dialog box"),l(B,"tabindex","0"),l(I,"type","button"),l(I,"class","close"),l(I,"data-bs-dismiss","modal"),l(I,"tabindex","0"),l(I,"aria-label","Click on this button for close the confirmation dialog box"),l(T,"class","modal-header"),l($,"class","modal-body tokenfield"),l($,"tabindex","0"),l($,"aria-label",e[2]),l($,"id","previewDialogBody"),l($,"name","previewDialogBody"),l(j,"type","button"),l(j,"class","preview_dismiss_modal btn btn-light pr-2"),l(j,"data-bs-dismiss","modal"),l(j,"tabindex","0"),l(j,"aria-label","Click on this button for neglecte to override previous recording"),l(M,"type","button"),l(M,"class","preview_dismiss_done btn btn-primary"),l(M,"data-bs-dismiss","modal"),l(M,"tabindex","0"),l(M,"aria-label","Click on this button for override the previous recording"),l(D,"class","modal-footer"),l(S,"class","modal-content"),l(R,"class","modal-dialog modal-md modal-dialog-centered"),l(A,"class","modal fade"),l(A,"id","preview_confirm_modal"),l(x,"class","preview_modal_container container")},m(o,i){c(o,t,i),d(t,a),p(f,a,null),d(a,h),F.m(a,null),c(o,_,i),c(o,x,i),d(x,A),d(A,R),d(R,S),d(S,T),d(T,B),d(T,E),d(T,I),d(S,O),d(S,$),d($,L),d(S,P),d(S,D),d(D,j),d(D,G),d(D,M),N=!0,z||(H=[u(j,"click",e[9]),u(M,"click",e[6])],z=!0)},p(e,t){const o={};1&t[0]&&(o.reviewMode=e[0]),f.$set(o),Y===(Y=X(e))&&F?F.p(e,t):(F.d(1),F=Y(e),F&&(F.c(),F.m(a,null))),(!N||4&t[0])&&l($,"aria-label",e[2])},i(e){N||(m(f.$$.fragment,e),N=!0)},o(e){b(f.$$.fragment,e),N=!1},d(e){e&&g(t),w(f),F.d(),e&&g(_),e&&g(x),z=!1,v(H)}}}function E(e,t,a){let o,i,n,r,l,{xml:c}=t,{uxml:d}=t,{showAns:p}=t,{isReview:u}=t,{editorState:m}=t,b="no",g="Play Audio",w="Start Recording",v=15,k={disabled:!0,cdata:"",language:"",correctAns:"",xml:"",status:"",pointerEvents:"auto",isReset:!0,showTranscript:!1,counter:0};function A(e){!function(e){try{a(4,k.language=e.smxml._language,k),a(4,k.correctAns=e.smxml.__cdata,k),a(4,k.showTranscript="true"==e.smxml._showTranscript,k),d&&function(e){let t=_(e);a(4,k.language=t.smans._language,k),a(4,k.cdata=t.smans.__cdata,k),a(4,k.status=t.smans._status,k),a(4,k.disabled="recordingStopped"!=t.smans._status,k),a(4,k.isReset="true"==t.smans._isReset,k),a(4,k.showTranscript="true"==t.smans._showTranscript,k)}(d)}catch(e){console.warn({error:e.message,"function name":"parseXMLPreview","File name":"AudioPreview.svelte"})}}(_(e))}function C(){setTimeout((function(){let e='<smans type="43" name="AudioRecorder" disabled="'+k.disabled+'" status="'+k.status+'" language="'+k.language+'" isReset="'+k.isReset+'" showTranscript="'+k.showTranscript+'"><![CDATA['+k.cdata+"]]></smans>";h.select("#special_module_user_xml").value=e,ISSPECIALMODULEUSERXMLCHANGE=1,a(14,d=h.select("#special_module_user_xml").value),a(1,g=h.select("#stopButtonTooltip").getAttribute("title")),a(3,w=h.select("#recordButtonTooltip").getAttribute("title")),a(2,n=h.select("#previewDialogBody").innerText),""!=k.correctAns.trim()&&E()}),100)}function y(){T(),clearTimeout(r),a(4,k.status="recordingStopped",k),a(4,k.disabled=!1,k),C(),h.selectAll(".previewRecordingOn","addClass","h"),h.selectAll(".previewInitialState","removeClass","h"),o.stop()}function R(){v-=1,a(4,k.counter=k.counter+1,k),r=setTimeout((function(){v>0?R():y()}),1e3)}function S(){!function(){if(!window.webkitSpeechRecognition&&!window.SpeechRecognition)return void h.alert(s.browser_support_msg);window.SpeechRecognition=window.webkitSpeechRecognition||window.SpeechRecognition,o=new SpeechRecognition,o.continuous=!0,o.interimResults=!0,o.lang=k.language,window.recognitionData=o,o.addEventListener("end",(function(){k.isReset||(clearTimeout(r),h.alert(s.recording_ended),T(),h.selectAll(".previewInitialState","removeClass","h"),a(4,k.status="recordingStopped",k),a(4,k.disabled=!1,k),C())}))}(),o.start(),h.select("#preview_container #resetButton").disabled=!1,h.selectAll(".previewAudioPlaying, .previewInitialState","addClass","h"),h.selectAll(".previewRecordingOn","removeClass","h"),o.onresult=e=>{let t="";for(let a=0;a<e.results.length;a+=1)t+=e.results[a][0].transcript;a(4,k.cdata=t.trim(),k),C()}}function T(){h.selectAll(".previewAudioPlaying, .previewRecordingOn","addClass","h"),h.selectAll(".previewInitialState","removeClass","h"),h.selectAll("#preview_recordButton span","removeClass","icomoon-24px-stop"),h.selectAll("#preview_recordButton span","addClass",["icomoon-circle-2","text-danger"])}function B(){switch(k.status){case"recording":y();break;case"recordingStopped":h.getBS("#preview_confirm_modal","Modal").show(),h.select(".modal-body").focus();break;default:S(),a(4,k.status="recording",k),a(4,k.isReset=!1,k),a(4,k.counter=0,k),v=15,R(),C(),h.selectAll("#preview_recordButton span","removeClass",["icomoon-circle-2","text-danger"]),h.selectAll("#preview_recordButton span","addClass","icomoon-24px-stop")}}function E(){let e="";""!=k.correctAns.trim()?(k.correctAns.toLowerCase()==k.cdata.toLowerCase()?(e=s.correct,h.select("#answer").checked=!0,a(4,k.useransstatus=!0,k)):(e=s.incorrect,h.select("#answer").checked=!1,a(4,k.useransstatus=!1,k)),m?p(e):x({uXml:d,ans:e})):h.alert(s.matching_msg)}function I(){a(0,u=!0),a(4,k.pointerEvents="none",k),a(5,l=!0),E(),1==k.useransstatus?h.setCss("#preview_data_container",{color:"#50af50"}):h.setCss("#preview_data_container",{color:"#c30f0f"}),h.selectAll(h.parent(h.selectAll("#preanswer_data_container")),"addClass","h"),h.selectAll(h.parent(h.selectAll("#preview_data_container")),"removeClass","h")}function O(){a(0,u=!1),a(4,k.pointerEvents="auto",k),a(5,l=!1),h.selectAll(h.parent(h.selectAll("#preview_data_container")),"addClass","h")}return f((()=>{window.webkitSpeechRecognition||window.SpeechRecognition||h.alert(s.browser_support_msg),c!=k.xml&&(a(4,k.xml=c,k),a(4,k.disabled=!0,k),a(4,k.cdata="",k),a(4,k.xml="",k),a(4,k.status="",k),a(4,k.isReset=!0,k),A(c))})),e.$$set=e=>{"xml"in e&&a(15,c=e.xml),"uxml"in e&&a(14,d=e.uxml),"showAns"in e&&a(16,p=e.showAns),"isReview"in e&&a(0,u=e.isReview),"editorState"in e&&a(17,m=e.editorState)},e.$$.update=()=>{32769&e.$$.dirty[0]&&(A(c),u?I():O())},[u,g,n,w,k,l,function(){if("yes"==b)!function(){T(),"recording"==k.status&&o.stop();a(4,k.cdata="",k),a(4,k.disabled=!0,k),a(4,k.xml="",k),a(4,k.status="",k),a(4,k.isReset=!0,k),clearTimeout(r),C()}(),b="no";else{a(4,k.cdata="",k),a(4,k.disabled=!0,k),a(4,k.status="",k),a(4,k.pauseRecording="",k),C();let e=setTimeout((function(){B(),clearTimeout(e)}),120)}},B,function(){b="yes"},function(){b="no"},function(){window.speechSynthesis?(i=window.speechSynthesis,""!=k.cdata?(h.selectAll(".previewRecordingOn, .previewInitialState","addClass","h"),h.selectAll(".previewAudioPlaying","removeClass","h"),a(4,k.disabled=!0,k),C(),function(){let e=new SpeechSynthesisUtterance(k.cdata),t=i.getVoices(),o="de-DE"==k.language?"Google Deutsch":"fr-FR"==k.language?"Google français":"es-ES"==k.language?"Google español":"hi-IN"==k.language?"Google हिन्दी":"ja-JP"==k.language?"Google 日本語":"ko-KR"==k.language?"Google 한국의":"it-IT"==k.language?"Google italiano":"Google US English";e.addEventListener("end",(function(){h.selectAll(".previewAudioPlaying, .previewRecordingOn","addClass","h"),h.selectAll(".previewInitialState","removeClass","h"),a(4,k.disabled=!1,k),C(),i.cancel()}));for(let a=0;a<t.length;a+=1)if(t[a].name==o){e.voice=t[a],e.pitch=1,e.rate=1,e.lang=k.language,i.speak(e);break}}()):(h.selectAll(".previewRecordingOn, .previewAudioPlaying","addClass","h"),h.selectAll(".previewInitialState","removeClass","h"),h.alert(s.no_data_msg))):h.alert(s.browser_support_msg)},I,O,function(e){"c"==e?a(5,l=!1):"u"==e&&a(5,l=!0)},d,c,p,m]}A(".pointerEventOff{pointer-events:none}.pointerEventOn{pointer-events:auto}.noteColor{color:#c30f0f}.recording_status{height:185px;width:300px;background-color:#000}.img_fit{object-fit:contain}.disabledState,select:disabled{cursor:not-allowed!important}.disabledState{opacity:.5}.custom_checkbox_new{display:block;position:relative;width:20px;height:20px;margin-bottom:0;cursor:pointer;font-size:18px}.custom_checkbox_new input{position:absolute;z-index:-1;opacity:0}.check_mark_custom{width:17px;height:17px;position:absolute;text-align:center;top:2px;left:0;border:1px solid #d4cfcf}.custom_checkbox_new .check_mark_custom:after{content:'\\2713';color:#fff;transform:rotate(10deg);margin-top:-3px;width:13px;font-size:13px}.custom_checkbox_new input:checked~.check_mark_custom:after{display:block}.check_mark_custom:after{content:'';position:absolute}.custom_checkbox_new input:checked~.check_mark_custom{background:#4285f4;border:2px solid #a4dbfc}input:focus~.check_mark_custom{box-shadow:0 0 0 .13rem rgb(66 133 244 / 25%)}.btn-light:not([disabled]):not(.disabled).active{color:#fff!important;-webkit-box-shadow:inset 0 2px 0 #1266f1!important;box-shadow:inset 0 2px 0 #1266f1!important;background-color:#2572f2!important;border-color:#2572f2!important;border-top-color:#0c57d3!important}.typeCorrect{background:#d1f5cb!important}.typeIncorrect{background:#f3d2d7!important}.bg-light{background-color:#e4e1e1!important}.top1{top:1px}");export default class extends e{constructor(e){super(),t(this,e,E,B,a,{xml:15,uxml:14,showAns:16,isReview:0,editorState:17},null,[-1,-1])}}
//# sourceMappingURL=AudioPreview-39415335.js.map
