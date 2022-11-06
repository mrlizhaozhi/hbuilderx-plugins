"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createFileIndexProcessor=exports.StylusIndexProcessor=void 0;const path_1=require("path"),node_1=require("../../../indexlib/out/node"),parser_1=require("./parser"),utils_1=require("./utils");class StylusIndexProcessor{support(e,r){return!("stylus"!==e.languageId&&!e.uri.endsWith(".styl"))}doIndex(e,r){const t=this.createIndexData(e);return t||{location:"",references:[],categories:[]}}getWorkspaceIndexData(e){return[...node_1.IndexDataStore.load(e).allIndexData().values()]}getIndexDataFromFile(e,r){let t=node_1.IndexDataStore.load(e),a=[];return a.push(t.indexData(r)),a}getIndexDataFromType(e,r){let t=[];for(let a of e){let e=a[r]||[];for(let r=0;r<e.length;++r){let a=e[r];t.push(a.label)}}return t}createIndexData(e){const r=e.getText(),t=(0,parser_1.buildAst)(r),a=(0,parser_1.flattenAndFilterAst)(t);if(!a)return;const n=(0,utils_1.compact)(a.filter((e=>e&&-1!==["selector","import"].indexOf(e.nodeName))));let s=new node_1.IndexData,o=e.uri,l=[],d=[],u=[],c=[""],i=[""],p=[];for(const e of n)if(e.name.startsWith(".")&&(c.includes(e.name.replace(".",""))||(c.push(e.name.replace(".","")),d.push({label:e.name.replace(".","")}))),e.name.startsWith("#")&&(i.includes(e.name.replace("#",""))||(i.push(e.name.replace("#","")),u.push({label:e.name.replace("#","")}))),"import"===e.nodeName&&!p.includes(e.name)){p.push(e.name);let r=node_1.ReferenceFileType.CSS,t={uri:(0,path_1.resolve)(e.name),type:r};l.push(t)}return s.location=o,s.references=l,s[node_1.IndexDataCategory.CLASS]=d,s[node_1.IndexDataCategory.ID]=u,s.categories.push(node_1.IndexDataCategory.CLASS),s.categories.push(node_1.IndexDataCategory.ID),s}}function createFileIndexProcessor(e){return new StylusIndexProcessor}exports.StylusIndexProcessor=StylusIndexProcessor,exports.createFileIndexProcessor=createFileIndexProcessor;