import{S as t,i as e,s as n,e as a,u as i,b as o,f as s,h as c,j as l,l as r,v as u,x as d,o as f,y as p,g as h,ac as x,r as g,D as m,p as b}from"./main-daecf310.js";function v(t,e,n){const a=t.slice();return a[7]=e[n],a[9]=n,a}function _(t){let e,n,h,x,g,m,b,v,_,y,j,T,D,M,S=t[7]+"";return{c(){e=a("div"),n=a("div"),h=a("label"),x=i(S),m=o(),b=a("div"),v=a("input"),T=o(),s(h,"for",g=t[7]),s(n,"class","col-sm-2"),s(v,"type","text"),s(v,"id",_=t[7]),s(v,"class",y="inputBox form-control"),v.value=j=t[1].cText[t[7]],s(b,"class","col-sm-10"),s(e,"class","row form-group")},m(a,i){c(a,e,i),l(e,n),l(n,h),l(h,x),l(e,m),l(e,b),l(b,v),l(e,T),D||(M=[r(v,"change",(function(){u(t[3].bind(this,t[7]))&&t[3].bind(this,t[7]).apply(this,arguments)})),r(v,"blur",(function(){u(t[4].bind(this,t[7]))&&t[4].bind(this,t[7]).apply(this,arguments)}))],D=!0)},p(e,n){t=e,2&n&&S!==(S=t[7]+"")&&d(x,S),2&n&&g!==(g=t[7])&&s(h,"for",g),2&n&&_!==(_=t[7])&&s(v,"id",_),2&n&&j!==(j=t[1].cText[t[7]])&&v.value!==j&&(v.value=j)},d(t){t&&f(e),D=!1,p(M)}}}function y(t){let e,n,i,r,u,d,p=Object.keys(t[1].cText),b=[];for(let e=0;e<p.length;e+=1)b[e]=_(v(t,p,e));return{c(){e=a("div"),n=a("h1"),n.textContent="3D Object",i=o();for(let t=0;t<b.length;t+=1)b[t].c();s(e,"key","3d_object"),h(e,"width","98%")},m(a,o){c(a,e,o),l(e,n),l(e,i);for(let t=0;t<b.length;t+=1)b[t].m(e,null);u||(d=x(r=t[0].call(null,e,t[2])),u=!0)},p(t,[n]){if(26&n){let a;for(p=Object.keys(t[1].cText),a=0;a<p.length;a+=1){const i=v(t,p,a);b[a]?b[a].p(i,n):(b[a]=_(i),b[a].c(),b[a].m(e,null))}for(;a<b.length;a+=1)b[a].d(1);b.length=p.length}},i:g,o:g,d(t){t&&f(e),m(b,t),u=!1,d()}}}function j(t,e,n){let{editorState:a}=e,{didMount:i}=e,o={},s={error:!1,cText:{}};return b((()=>{o=a.ajaxData?a.ajaxData:{content_type:"f",content_subtype:52,content_icon:0,content_text:{name:"",display_image:"",zipfile:"",preview_image:"",about:"",light:!0,rotationX:"0",rotationY:"Math.PI / -2",positionX:"0",positionY:"0",positionZ:"0",scale:"45",point_light:"2"}},n(1,s.cText=o.content_text,s)})),t.$$set=t=>{"editorState"in t&&n(5,a=t.editorState),"didMount"in t&&n(0,i=t.didMount)},[i,s,undefined,function(t,e){n(1,s.cText[t]=e.target.value,s)},function(t,e){o.content_text=s.cText,AI.get("save_item")||AI.set("save_item",!0),n(5,a.ajaxData=o,a)},a]}export default class extends t{constructor(t){super(),e(this,t,j,y,n,{editorState:5,didMount:0})}}
//# sourceMappingURL=ObjectEditor-3d63d4cd.js.map
