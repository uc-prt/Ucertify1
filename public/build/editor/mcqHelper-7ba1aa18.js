import{S as a,i as e,s as t}from"./main-e2e93ff3.js";const s={doNotformatXml:(a,e)=>0==+a?"":e,donNotSendXMl:!0,checkDataOnSave:(a,e,t,s)=>(a.correct_answers=t.ajaxData.correct_answers,a.total_answers=t.ajaxData.total_answers,a.answers=t.ajaxData.answers,a),actionOnUpdate(a){"q"==a.content_type&&0==a.item&&0==a.content_icon?jQuery("#xmlBtn").addClass("h"):jQuery("#xmlBtn").removeClass("h")},checkBeforeSave:(a,e)=>null==JSON.stringify(a.ajaxData.answers).match(/"is_correct":"[1-9]"/)&&(e("message","You must select a option"),e("saveDialog",!1),e("snackback",!0),!0),helpVideo:"//player.vimeo.com/external/290348936.hd.mp4?s=a13a32bc22efff0e3b2813f64ee52ab6413166ea"};export default class extends a{constructor(a){super(),e(this,a,null,null,t,{})}}export{s as itemHelper};
//# sourceMappingURL=mcqHelper-7ba1aa18.js.map
