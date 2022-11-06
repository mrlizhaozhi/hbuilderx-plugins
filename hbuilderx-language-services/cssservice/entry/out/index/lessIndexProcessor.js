"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.LessIndexProcessor=void 0;const fs_1=require("fs"),path_1=require("path"),vscode_css_languageservice_1=require("vscode-css-languageservice"),vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),vscode_uri_1=require("vscode-uri"),indexlib_1=require("../../../../indexlib"),utils_1=require("../../../../utils"),util_1=require("../utils/util");class LessIndexProcessor{createIndexData(e,t){let s=new indexlib_1.IndexData;if("string"==typeof t){let e=(0,fs_1.readFileSync)(t,{encoding:"utf8",flag:"r"});t=vscode_languageserver_textdocument_1.TextDocument.create(t,"less",0,e)}let r=(0,path_1.dirname)(vscode_uri_1.URI.parse(t.uri).fsPath),i=(0,vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(t),l=t.uri,a=[],c=[],o=[],u=[],d=[""],n=[""],p=[],x=[];return i.accept((t=>{var s,i;if(t.type===util_1.NodeType.ClassSelector)d.includes(t.getText().replace(".",""))||t.getText().includes("@")||(d.push(t.getText().replace(".","")),c.push({label:t.getText().replace(".",""),offset:t.offset,type:indexlib_1.IndexItemType.DEF}));else if(t.type===util_1.NodeType.IdentifierSelector)n.includes(t.getText().replace("#",""))||t.getText().includes("@")||(n.push(t.getText().replace("#","")),o.push({label:t.getText().replace("#",""),offset:t.offset,type:indexlib_1.IndexItemType.REF}));else if(t.type===util_1.NodeType.HexColorValue)p.includes(t.getText())||(p.push(t.getText()),u.push({label:t.getText(),offset:t.offset}));else if(t.type===util_1.NodeType.Import){const l=t.getText();if(!x.includes(l)){x.push(t.getText());let c=indexlib_1.ReferenceFileType.CSS,o="",u="";if(o=l.includes("url(")?null===(i=null===(s=t.children[0])||void 0===s?void 0:s.children[0])||void 0===i?void 0:i.getText().replace(/'/g,"").replace(/"/g,""):l.replace("@import","").replace(/'/g,"").replace(/"/g,"").trim(),o.startsWith("@/")&&e){let t=vscode_uri_1.URI.parse(e.uri).fsPath;u=o.replace("@",t).replace(/\\/g,"/")}else u=(0,path_1.resolve)(r,o).replace(/\\/g,"/");if((0,fs_1.existsSync)(u)){u=utils_1.hx.toNormalizedUri(u);let e={uri:u,type:c};a.push(e)}}}return!0})),s.location=l,s.references=a,s[indexlib_1.IndexDataCategory.CLASS]=c,s[indexlib_1.IndexDataCategory.ID]=o,s[indexlib_1.IndexDataCategory.COLOR]=u,s.categories.push(indexlib_1.IndexDataCategory.CLASS),s.categories.push(indexlib_1.IndexDataCategory.ID),s.categories.push(indexlib_1.IndexDataCategory.COLOR),s}}exports.LessIndexProcessor=LessIndexProcessor;