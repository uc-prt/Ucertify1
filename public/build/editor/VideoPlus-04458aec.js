import{S as t,i as e,s as i,e as n,b as a,f as o,g as c,h as s,j as r,l,r as d,o as p,y as u,p as g,A as h,E as v,w as f}from"./main-b5f32948.js";function b(t){let e,i,g,h,v,f,b,m;return{c(){e=n("div"),i=n("div"),h=a(),v=n("div"),o(i,"class","tinymce-editor auth-editor"),o(i,"contenteditable",g=!0),o(i,"id","vtt"),o(i,"data-text","Vtt"),c(i,"border-bottom","1px solid #e7e7e7"),c(i,"margin","5px 0 5px 0"),c(i,"whiteSpace","pre-line"),c(i,"clear","both"),c(i,"min-height","125px"),o(v,"class","tinymce-editor auth-editor"),o(v,"contenteditable",f=!0),o(v,"id","info"),o(v,"data-text","Info"),c(v,"border-bottom","1px solid #e7e7e7"),c(v,"margin","5px 0 5px 0"),c(v,"whiteSpace","pre-line"),c(v,"clear","both"),c(v,"min-height","125px"),o(e,"id","authoringArea")},m(n,a){s(n,e,a),r(e,i),r(e,h),r(e,v),b||(m=[l(i,"keyup",t[0].bind(this,"vtt")),l(v,"keyup",t[0].bind(this,"info"))],b=!0)},p:d,i:d,o:d,d(t){t&&p(e),b=!1,u(m)}}}function m(t,e,i){let{setAjaxContent:n}=e,{editorState:a}=e,o="",c={};f({sequence:"0",info:"",vtt:""}).subscribe((t=>{c=t}));function s(){var t={};t.title=a.title,t.content=a.content?a.content.replace(/'/g,'"'):"",t.info=c.info;var e=c.vtt?c.vtt.replace(/<br>|<br\/>|<br \/>/gim,"\n").replace(/<span>|<\/span>/gim,""):"";t.vtt=e.replace(/ \n|\n |\n/g,"\n"),i(1,a.activator=!0,a),h.ajax({url:baseUrl+"editor/index.php",cache:!1,data:{ajax:1,content_guid:a.guid,title:t.title,content:t.content,info:t.info,vtt:t.vtt,content_type:"f",content_subtype:"45",content_text:t,func:"react_get_preview"}}).then((t=>{(t=JSON.parse(t)).page_data=t.page_data.replace(/id="update-vtt"/gim,'id="update-vtt" in_editor="1" '),h.select("#previewSection").innerHTML=t.page_data,i(1,a.activator=!1,a)}))}function r(t){o&&clearTimeout(o),o=setTimeout((function(){var e,n,s=tinyMCE.activeEditor.getContent({format:"raw"});(s=(s=s.replace(/<span class="nanospell-typo" data-mce-bogus="1">/g,"")).replace(/<span class="" data-mce-bogus="1">/g,"")).match(/<uc:syntax/gm)&&prettyPrint(),c[t]=s.replace(/<br>|<br\/>|<br \/>/gim,"\n").replace(/<span>|<\/span>/gim,""),e=c.vtt,n=c.info,i(1,a.vtt=e,a),i(1,a.info=n,a),clearTimeout(o)}),200)}return g((()=>{if(n){var t=n.page_data;c.vtt=n.vtt,c.info=n.info,t&&(t=n.page_data.replace(/id="update-vtt"/gim,'id="update-vtt" in_editor="1" '),h.select("#previewSection").innerHTML=t)}h.listen(document,"click","#showPreview",s.bind(this)),h.listen(document,"click","#update-vtt",(function(t){h.selectAll(".text").forEach(((t,e)=>{captions[e].text=t.textContent}));var e=JSON.stringify(captions);i(1,a.activator=!0,a),h.ajax({url:baseUrl+"editor/index.php",type:"POST",data:{ajax:1,content_guid:self.props.guid,text:e,tag:[],action:"update_vtt",in_editor:1}}).then((t=>{try{h.select("#save_xml").classList.remove("disabled"),h.select("#save_xml").setAttribute("disabled",!1),t=JSON.parse(t),c.vtt=t.vtt,c.info=t.info,h.select("#vtt").innerHTML=t.vtt,h.select("#info").innerHTML=t.info,h.select("#showPreview").click()}catch(t){console.log({err:t,func:"componentDidMount @ 70"})}}))})),tinyMCE.PluginManager.add("changeInModule",(function(t,e){t.on("change click",(function(t){try{r(tinyMCE.activeEditor.id)}catch(t){console.log({error:t,func:"loadVideoListener @ 1173"})}}))}))})),v((async()=>{let t=h.select(".video-container").clientHeight;if(t>100&&t>h.select("#sidebar").clientHeight){h.select("#sidebar").style.height=t-(isNaN(h.select(".sidetab_ul").clientHeight)?0:h.select(".sidetab_ul").clientHeight);let e=t-(h.select(".trans_toolbar").clientHeight+10);h.select("#transcript").style.height=e,h.selectAll("#transcript,.transcript-ul").forEach((t=>t.style.height=h.select("#video-container").outerHeight-h.select(".sidetab_ul").outerHeight-4+"px")),h.select(".video_comment_section").style.height=h.select("#video-container").outerHeight-h.select(".sidetab_ul").outerHeight-4}})),t.$$set=t=>{"setAjaxContent"in t&&i(2,n=t.setAjaxContent),"editorState"in t&&i(1,a=t.editorState)},[r,a,n]}export default class extends t{constructor(t){super(),e(this,t,m,b,i,{setAjaxContent:2,editorState:1})}}
//# sourceMappingURL=VideoPlus-04458aec.js.map
