"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getDataManager=void 0;const vscode_html_languageservice_1=require("vscode-html-languageservice"),fs=require("fs"),path=require("path"),dataroot=path.join(__dirname,"../../server/data"),vue_tag_file=path.join(dataroot,"uni_vue_tag.json"),nvue_tag_file=path.join(dataroot,"uni_nvue_html.json");function createDataProvider(e,a){try{let t=fs.readFileSync(a,{encoding:"utf8"}),r=JSON.parse(t);return(0,vscode_html_languageservice_1.newHTMLDataProvider)(e,{version:r.version||1,tags:r.tags||[],globalAttributes:r.globalAttributes||[],valueSets:r.valueSets||[]})}catch(e){}return(0,vscode_html_languageservice_1.newHTMLDataProvider)(e,{version:1})}function getDataManager(){let e,a=[];return a.push(createDataProvider("uni_vue_tag",vue_tag_file)),a.push(createDataProvider("uni_nvue_tag",nvue_tag_file)),{vueDataProvides(){let e=[];return e.push(...a),e},allDataProviders(e=!1){let t=[];return t.push(...a),e&&t.push(this.defaultDataProvider()),t},defaultDataProvider:()=>(e||(e=(0,vscode_html_languageservice_1.getDefaultHTMLDataProvider)()),e)}}exports.getDataManager=getDataManager;