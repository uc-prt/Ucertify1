import{S as t,i as e,s as a,e as l,b as i,u as s,f as n,h as o,j as r,l as c,x as d,r as m,o as g,Z as u,q as h,v as p,C as f,y as x,D as b,c as y,m as v,t as _,a as C,d as w,a4 as I,E as A,A as $,p as k,X as N,w as T}from"./main-55cf766a.js";function S(t){let e,a,u,h,p,f,x,b;return{c(){e=l("button"),a=l("span"),u=i(),h=l("span"),p=s(t[1]),n(a,"class","icomoon-new-24px-add-circle-1 s3"),n(h,"class","position-relative top1"),n(e,"type","button"),n(e,"class",f="btn btn-sm btn-outline-primary "+t[0]),n(e,"id",t[2])},m(l,i){o(l,e,i),r(e,a),r(e,u),r(e,h),r(h,p),x||(b=c(e,"click",t[4]),x=!0)},p(t,[a]){2&a&&d(p,t[1]),1&a&&f!==(f="btn btn-sm btn-outline-primary "+t[0])&&n(e,"class",f),4&a&&n(e,"id",t[2])},i:m,o:m,d(t){t&&g(e),x=!1,b()}}}function O(t,e,a){let{btnClass:l=""}=e,{btnName:i}=e,{id:s}=e;const n=u();return t.$$set=t=>{"btnClass"in t&&a(0,l=t.btnClass),"btnName"in t&&a(1,i=t.btnName),"id"in t&&a(2,s=t.id)},[l,i,s,n,()=>n("btnClick")]}class V extends t{constructor(t){super(),e(this,t,O,S,a,{btnClass:0,btnName:1,id:2})}}function j(t,e,a){const l=t.slice();return l[29]=e[a],l[31]=a,l}function U(t,e,a){const l=t.slice();return l[32]=e[a],l[34]=a,l}function M(t){let e,a=t[1].authordata,l=[];for(let e=0;e<a.length;e+=1)l[e]=J(j(t,a,e));return{c(){for(let t=0;t<l.length;t+=1)l[t].c();e=h()},m(t,a){for(let e=0;e<l.length;e+=1)l[e].m(t,a);o(t,e,a)},p(t,i){if(2455&i[0]){let s;for(a=t[1].authordata,s=0;s<a.length;s+=1){const n=j(t,a,s);l[s]?l[s].p(n,i):(l[s]=J(n),l[s].c(),l[s].m(e.parentNode,e))}for(;s<l.length;s+=1)l[s].d(1);l.length=a.length}},d(t){b(l,t),t&&g(e)}}}function E(t){let e,a,i,s,d;return{c(){e=l("button"),a=l("span"),n(a,"title",i=f.delete_column),n(a,"data-bs-toggle","tooltip"),n(a,"class",t[2]),n(e,"type","button"),n(e,"class","btn_category btn mx-auto")},m(l,i){o(l,e,i),r(e,a),s||(d=c(e,"click",(function(){p(t[8].bind(this,t[32].id))&&t[8].bind(this,t[32].id).apply(this,arguments)})),s=!0)},p(e,a){t=e},d(t){t&&g(e),s=!1,d()}}}function D(t){let e,a,s,d,m,u,h,p;return{c(){e=l("label"),a=l("span"),d=i(),m=l("input"),n(a,"title",s=f.file_elem),n(a,"class","icomoon-images position-relative"),n(m,"type","file"),n(m,"id",u="imgUpload"+t[32].id),n(m,"class","imgUpload h"),n(e,"class","fileUpload btn btn-outline-primary bg-white rounded-0"),n(e,"tabindex","0")},m(l,i){o(l,e,i),r(e,a),r(e,d),r(e,m),h||(p=[c(m,"change",t[15]),c(m,"change",t[11]),c(e,"keydown",B)],h=!0)},p(t,e){2&e[0]&&u!==(u="imgUpload"+t[32].id)&&n(m,"id",u)},d(t){t&&g(e),h=!1,x(p)}}}function X(t){let e,a,s,d,m,u,h,f,b,y,v,_,C,w="categories"==t[32].class&&E(t),I="items"==t[32].class&&D(t);return{c(){e=l("div"),a=l("div"),s=l("textarea"),f=i(),w&&w.c(),b=i(),I&&I.c(),n(s,"aria-label",d=t[32].text),n(s,"class",m="categories"==t[32].class?"categories pointer text_alignmatch":"items pointer text_alignmatch"),s.value=u=t[32].text,n(s,"placeholder",h="categories"==t[32].class?"Category Name":"Item Information"),s.readOnly="readonly",n(a,"class","d-flex flex-column-reverse width180"),n(e,"key",y=t[34]),n(e,"class","columnContainer border-0"),n(e,"id",v=t[32].id)},m(l,i){o(l,e,i),r(e,a),r(a,s),r(a,f),w&&w.m(a,null),r(e,b),I&&I.m(e,null),_||(C=[c(s,"keydown",B),c(s,"click",(function(){p("categories"==t[32].class?t[4].bind(this,"categories",t[32].id):t[4].bind(this,"items",t[32].id))&&("categories"==t[32].class?t[4].bind(this,"categories",t[32].id):t[4].bind(this,"items",t[32].id)).apply(this,arguments)}))],_=!0)},p(l,i){t=l,2&i[0]&&d!==(d=t[32].text)&&n(s,"aria-label",d),2&i[0]&&m!==(m="categories"==t[32].class?"categories pointer text_alignmatch":"items pointer text_alignmatch")&&n(s,"class",m),2&i[0]&&u!==(u=t[32].text)&&(s.value=u),2&i[0]&&h!==(h="categories"==t[32].class?"Category Name":"Item Information")&&n(s,"placeholder",h),"categories"==t[32].class?w?w.p(t,i):(w=E(t),w.c(),w.m(a,null)):w&&(w.d(1),w=null),"items"==t[32].class?I?I.p(t,i):(I=D(t),I.c(),I.m(e,null)):I&&(I.d(1),I=null),2&i[0]&&v!==(v=t[32].id)&&n(e,"id",v)},d(t){t&&g(e),w&&w.d(),I&&I.d(),_=!1,x(C)}}}function J(t){let e,a,s,d,u=t[29],h=[];for(let e=0;e<u.length;e+=1)h[e]=X(U(t,u,e));let p=0!=t[31]&&function(t){let e,a,i,s,d,u,h;return{c(){e=l("button"),a=l("span"),n(a,"class","icomoon-new-24px-delete-1 position-relative s3"),n(a,"title",i=f.delete_row),n(a,"data-bs-toggle","tooltip"),n(e,"type","button"),n(e,"id",s="tags_"+t[31]),n(e,"row_tags",d=t[31]),n(e,"class","btn_category btn me-2 pt-0")},m(l,i){o(l,e,i),r(e,a),u||(h=c(e,"click",t[7]),u=!0)},p:m,d(t){t&&g(e),u=!1,h()}}}(t);return{c(){e=l("div");for(let t=0;t<h.length;t+=1)h[t].c();a=i(),p&&p.c(),s=i(),n(e,"key",d=t[31]),n(e,"class","rowContainer pt-2 d-flex align-items-center pe-3")},m(t,l){o(t,e,l);for(let t=0;t<h.length;t+=1)h[t].m(e,null);r(e,a),p&&p.m(e,null),r(e,s)},p(t,l){if(2327&l[0]){let i;for(u=t[29],i=0;i<u.length;i+=1){const s=U(t,u,i);h[i]?h[i].p(s,l):(h[i]=X(s),h[i].c(),h[i].m(e,a))}for(;i<h.length;i+=1)h[i].d(1);h.length=u.length}0!=t[31]&&p.p(t,l)},d(t){t&&g(e),b(h,t),p&&p.d()}}}function Y(t){let e,a,s,d,m,u,h,b,I,A,$,k,N,T,S,O,j,U,E,D,X,J,Y,B,F,W,q,z,P,R=t[1].authordata&&M(t);return h=new V({props:{btnClass:"span16 add_cat_btn w-auto",id:"add_cat_btn",btnName:f.add_category}}),h.$on("btnClick",t[10]),A=new V({props:{id:"btn",btnName:f.add_item}}),A.$on("btnClick",t[9]),{c(){e=l("div"),a=l("div"),s=l("div"),d=l("div"),R&&R.c(),m=i(),u=l("div"),y(h.$$.fragment),b=i(),I=l("div"),y(A.$$.fragment),$=i(),k=l("div"),N=l("div"),T=l("div"),S=l("div"),O=l("h4"),O.textContent=""+f.edit_dialog,j=i(),U=l("button"),E=i(),D=l("div"),X=l("textarea"),J=i(),Y=l("p"),Y.textContent="Please enter some valid data.",B=i(),F=l("div"),W=l("button"),W.textContent=""+f.update,n(d,"class","tableContainer light-cyan-bg mx-auto"),n(u,"class","text-center position-relative"),n(s,"class","d-flex align-items-center mx-2 mt-2"),n(I,"class","text-center my-2"),n(a,"class","categoryAuthorcontainer"),n(O,"class","modal-title"),n(U,"type","button"),n(U,"class","btn-close"),n(U,"data-bs-dismiss","modal"),n(U,"aria-hidden","true"),n(S,"class","modal-header"),n(X,"class","text-start w-100 h-100 form-control"),n(X,"id","editValue"),n(Y,"class","error_msg text-left text-danger mb-0 h"),n(D,"class","modal-body text-center"),n(W,"type","button"),n(W,"id","updateButton"),n(W,"class","sure btn btn-primary"),n(F,"class","modal-footer mt-0"),n(T,"class","modal-content"),n(N,"class","modal-dialog modal-dialog-centered span4"),n(k,"class","modal"),n(k,"id","editModal"),n(e,"class","border")},m(l,i){o(l,e,i),r(e,a),r(a,s),r(s,d),R&&R.m(d,null),r(s,m),r(s,u),v(h,u,null),r(a,b),r(a,I),v(A,I,null),r(e,$),r(e,k),r(k,N),r(N,T),r(T,S),r(S,O),r(S,j),r(S,U),r(T,E),r(T,D),r(D,X),r(D,J),r(D,Y),r(T,B),r(T,F),r(F,W),q=!0,z||(P=[c(X,"change",(function(){p("categories"==t[1].editType?t[5].bind(this,t[1].editId):t[6].bind(this,t[1].editId))&&("categories"==t[1].editType?t[5].bind(this,t[1].editId):t[6].bind(this,t[1].editId)).apply(this,arguments)})),c(W,"click",t[3].bind(this))],z=!0)},p(e,a){(t=e)[1].authordata?R?R.p(t,a):(R=M(t),R.c(),R.m(d,null)):R&&(R.d(1),R=null)},i(t){q||(_(h.$$.fragment,t),_(A.$$.fragment,t),q=!0)},o(t){C(h.$$.fragment,t),C(A.$$.fragment,t),q=!1},d(t){t&&g(e),R&&R.d(),w(h),w(A),z=!1,x(P)}}}function B(t){13===t.which&&this.click()}function F(t,e,a){let l,{getChildXml:i}=e,{editorState:s}=e,{xml:n}=e,o={},r=[],c=null;T({xml:"",csv:"",json:"",authordata:"",maxWidth:"",editType:"",editId:""}).subscribe((t=>{a(1,o=t)}));function d(t){!function(t){let e=JSON.parse(t.smxml.__cdata);(function(t){let e=JSON.parse(JSON.stringify(t));r=[];let l=[];e.category.categories.forEach((function(t){let e={};e.id=t.id,e.class="categories",e.tags="Tags 0",e.text=t.text,l.push(e)})),r.push(l);let i=e.category.categories.length;(function(t,e){let a=[],l=0,i=t.length;for(;l<i;)a.push(t.slice(l,l+=e));return a})(e.item.items,i).forEach((t=>{let e=[];t.forEach((t=>{let a={};a.id=t.id,a.class="items",a.tags="Tags ",c==t.id?(c=null,a.text=t.label):a.text=""!=t.imageurl?"*"+t.imageurl+"["+t.imagealt+"]":t.label,e=[...e,a]})),r=[...r,e]})),a(1,o.authordata=r,o)})(e),a(1,o.xml=e,o),a(1,o.maxWidth=t.smxml._maxwidth?parseInt(t.smxml._maxwidth):800,o)}(t=N(t))}function m(){try{let t=JSON.stringify(o.xml,null,4),e='<smxml type="35" name="AlignMatch" maxwidth="'+o.maxWidth+'">\x3c!--[CDATA['+t+"]]--\x3e</smxml>";i(e)}catch(t){console.warn(t.message)}}function g(){let t,e,a=o.xml.category.categories,l=o.xml.item.items;if(a.length>0){let e=a[a.length-1];t=parseInt(e.id.split("_")[1])}else t=0;if(l.length>0){let t=l[l.length-1];e=parseInt(t.id.split("_")[1])}else e=0;return{catId:t,itemId:e}}function u(t){let e=new FormData;Array.prototype.forEach.call(l,(t=>{e.append("image_file",t)})),$.ajax({url:baseUrl+"sim/smartsim/imageAudioUpload.php?func=upload_pic&ajax=1&user_guid=1&extension=jpg",formData:!0,data:e}).then((e=>{let a;if("0"==e)$.alert("Error In Uploading Image File!"),$.activate(0);else{$.activate(0),a=e.match(/http:/g)?e.replace("http://s3.amazonaws.com/jigyaasa_content_static//",""):e.replace("//s3.amazonaws.com/jigyaasa_content_static//",""),$.select("#"+t).querySelector("textarea").value="*"+a+"[]",function(t,e){o.xml.item.items.map((function(a,l){a.id==t&&(a.imageurl=e,a.imagealt="imagealt_text"+l,a.label=""),m()}))}(t,a)}})).catch((t=>{console.warn("error in upload",t)}))}return I((()=>{n!=o.xml&&(a(1,o.xml=n,o),d(n))})),A((()=>{s&&$.set("alignMatchReset",!0),s.stopAuthoringUpdate})),k((()=>{a(1,o.xml=n,o),d(n)})),t.$$set=t=>{"getChildXml"in t&&a(12,i=t.getChildXml),"editorState"in t&&a(13,s=t.editorState),"xml"in t&&a(14,n=t.xml)},[l,o,"icomoon-new-24px-delete-1 position-relative s3",function(){""!=$.select("#editValue").value.trim()&&($.getBS("#editModal","Modal").hide(),m())},function(t,e,l){a(1,o.editType=t,o),a(1,o.editId=e,o),$.getBS("#editModal","Modal").show(),$.select("#editValue").value=l.target.value,$.select("#editValue").focus()},function(t,e){o.xml.category.categories.map((function(a){a.id==t&&(a.text=""!=e.target.value?e.target.value:""),""==a.text.trim()?($.selectAll("#editValue","addClass","border-danger"),$.selectAll(".error_msg","removeClass","h")):($.selectAll("#editValue","removeClass","border-danger"),$.selectAll(".error_msg","addClass","h"))}))},function(t,e){try{o.xml.item.items.map((function(a){if(a.id==t){if(""!=e.target.value){if("*"==e.target.value.charAt(0)){let t=e.target.value.indexOf("["),l=e.target.value.indexOf("]");if(t>-1&&l>-1){let l=e.target.value.substr(1,t-1);a.imageurl=l,a.label="";let i=e.target.value.substring(e.target.value.lastIndexOf("[")+1,e.target.value.lastIndexOf("]"));a.imagealt=""!=i?i:"imagealt"}else a.label=e.target.value,a.imageurl="",a.imagealt="",$.alert("Image format is not correct")}else a.imageurl="",a.imagealt="";""==$.select("#editValue").value.trim()?($.selectAll("#editValue","addClass","border-danger"),$.selectAll(".error_msg","removeClass","h")):($.selectAll("#editValue","removeClass","border-danger"),$.selectAll(".error_msg","addClass","h"))}a.label=e.target.value,c=t}}))}catch(e){console.warn(e.message)}},function(t){let e=o.xml.category.categories.length,l=o.xml.item.items.length/e;if(l>2){let t="Tags "+this.getAttribute("row_tags"),i=[];o.xml.item.items.map((function(e,a){e.tags!=t&&i.push(o.xml.item.items[a])}));let s=1;o.authordata.map((function(t){t.map((function(t){i.map((function(e){t.id==e.id&&(e.tags="Tags "+s++)}))}))})),l=i.length/e;for(let t=0,a=0;t<l;t++)for(let l=0;l<e;l++,a++)i[a].tags="Tags "+(t+1);a(1,o.xml.item.items=i,o),m()}else $.alert("You can't have less than 2 rows.")},function(t){o.xml.category.categories.length>2?(o.xml.category.categories.map((function(e,a){e.id==t&&(o.xml.category.categories.splice(a,1),o.xml.item.items.map((function(t,a){e.id==t.category&&o.xml.item.items.splice(a,1)})))})),m()):$.alert("You can't have less than 2 categories.")},function(){let t=g(),e=o.xml.category.categories,a=t.itemId+1,l=o.xml.category.categories.length,i=o.xml.item.items.length+1,s=(i-1)/l;if(o.xml.category.categories.length>=1)if(s<=3){for(let t=1;t<=l;t++)o.xml.item.items.push({imageurl:"",imagealt:"",id:"item_"+a,label:"",category:e[t-1].id,tags:"Tags "+(s+1)}),i++,a++;m()}else $.alert("You can't have more than 4 rows.");else $.alert("First add category.")},function(){if(o.xml.category.categories.length<=3){let t=o.xml.category.categories.length+1,e=g(),a=e.catId+1,l=e.itemId+1,i=(o.xml.item.items.length+1-1)/(t-1),s="category_"+a;o.xml.category.categories.push({id:s,text:"Default Category"});for(let e=0;e<i;e++){let a="item_"+l;o.xml.item.items.splice((t-1)*(e+1)+e,0,{imageurl:"",imagealt:"",id:a,label:"",category:s,tags:"Tags "+(e+1)}),l++}$.select(".matchbutton").disabled=!1,$.select(".alignTestarea").style.display="block",m()}else $.alert("You can't have more than 4 categories.")},function(t){let e=t.target.closest(".columnContainer").id;$.activate(2),u(e)},i,s,n,function(){l=this.files,a(0,l)}]}export default class extends t{constructor(t){super(),e(this,t,F,Y,a,{getChildXml:12,editorState:13,xml:14},null,[-1,-1])}}
//# sourceMappingURL=AlignMatch-c8ba44d0.js.map
