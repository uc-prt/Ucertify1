import{S as e,i as s,s as a}from"./main-464952be.js";const t={getXml:(e,s,a)=>e.generateXml(),onOpenSave:(e,s)=>!e.db_changed,checkDataOnSave(e,s,a,t){let l=a.state.xml,c=XMLToJSON(l);if(c&&"sql"==c.smxml._language){let e=l.match(/<case>[\s\S]*?<\/case>/g).join("").split("<case>");for(let s=0;s<e.length;s++)e[s]=e[s].substring(e[s].indexOf("|")+1);e=e.join("<case>|"),l=l.replace(/<testcases>[\s\S]*?<\/testcases>/g,"<testcases>"+e+"</testcases>"),t({xml:l})}return e.special_module_xml=l,e},verticalView:!0,doNotformatXml:!0,helpVideo:"//player.vimeo.com/external/287909057.hd.mp4?s=294a3cad46aec8d3cd8620b56ad7fa7e4aca731b"};export default class extends e{constructor(e){super(),s(this,e,null,null,a,{})}}export{t as itemHelper};
//# sourceMappingURL=evalHelper-c1c45195.js.map
