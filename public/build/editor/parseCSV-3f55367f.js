var e={parseCSVFormat:function(e){let r={stem:"",term:[],option:[]},t=e.split("\n"),n=[];return t.map((e=>{e.trim()&&n.push(e)})),n.map((function(e,t){let n=e.replace(/,$/gm,"");if(n=n.split(","),0==t)n.map(((e,t)=>{0==t?r.stem=e:r.option.push({id:"o"+t,text:e.replace(/^\s+/g,"")})}));else{let e="",p="";n.map(((r,t)=>{if(0==t)e=r.replace(/^\s+/g,"");else if("1"==r.trim())return p="o"+t,!1})),r.term.push({id:"t"+t,text:e,correct:p})}})),r},CSVToArray:function(e,r){r=r||",";for(var t=new RegExp("(\\"+r+'|\\r?\\n|\\r|^)(?:"([^"]*(?:""[^"]*)*)"|([^"\\'+r+"\\r\\n]*))","gi"),n=[[]],p=null;p=t.exec(e);){var a=p[1];if(a.length&&a!=r&&n.push([]),p[2])var i=p[2].replace(new RegExp('""',"g"),'"');else i=p[3];n[n.length-1].push(i)}return n},CSV2JSON:function(e){for(var r=this.CSVToArray(e),t=[],n=1;n<r.length;n++){t[n-1]={};for(var p=0;p<r[0].length&&p<r[n].length;p++){var a=r[0][p];t[n-1][a]=r[n][p]}}return JSON.stringify(t).replace(/},/g,"},\r\n")}};export{e as p};
//# sourceMappingURL=parseCSV-3f55367f.js.map
