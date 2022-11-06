"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createFileIndexProcessor=exports.CssIndexProcessor=void 0;const fs_1=require("fs"),path_1=require("path"),vscode_css_languageservice_1=require("vscode-css-languageservice"),vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),vscode_uri_1=require("vscode-uri"),core_1=require("../../../../core"),indexlib_1=require("../../../../indexlib"),utils_1=require("../../../../utils");class CssIndexProcessor{support(e,r){return!("css"!==e.languageId&&!e.uri.endsWith(".css"))}doIndex(e,r){return this.createIndexData(r,e)}createIndexData(e,r){let t=new indexlib_1.IndexData;if("string"==typeof r){let e=(0,fs_1.readFileSync)(r,{encoding:"utf8",flag:"r"});r=vscode_languageserver_textdocument_1.TextDocument.create(r,"css",0,e)}let s=(0,path_1.dirname)(vscode_uri_1.URI.parse(r.uri).fsPath),i=(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(r),a=r.uri,o=[],c=[],l=[],n=[],d=[""],u=[""],p=[],x=[];return i.accept((r=>{var t,i;if(r.type===core_1.NodeType.ClassSelector)d.includes(r.getText().replace(".",""))||(d.push(r.getText().replace(".","")),c.push({label:r.getText().replace(".",""),offset:r.offset,type:indexlib_1.IndexItemType.DEF}));else if(r.type===core_1.NodeType.IdentifierSelector)u.includes(r.getText().replace("#",""))||(u.push(r.getText().replace("#","")),l.push({label:r.getText().replace("#",""),offset:r.offset,type:indexlib_1.IndexItemType.REF}));else if(r.type===core_1.NodeType.HexColorValue)p.includes(r.getText())||(p.push(r.getText()),n.push({label:r.getText(),offset:r.offset}));else if(r.type===core_1.NodeType.Import){const a=r.getText();if(!x.includes(a)){x.push(r.getText());let c=indexlib_1.ReferenceFileType.CSS,l="",n="";if(l=a.includes("url(")?null===(i=null===(t=r.children[0])||void 0===t?void 0:t.children[0])||void 0===i?void 0:i.getText().replace(/'/g,"").replace(/"/g,""):a.replace("@import","").replace(/'/g,"").replace(/"/g,"").trim(),l.startsWith("@/")&&e){let r=vscode_uri_1.URI.parse(e.uri).fsPath;n=l.replace("@",r).replace(/\\/g,"/")}else n=(0,path_1.resolve)(s,l).replace(/\\/g,"/");if((0,fs_1.existsSync)(n)){n=utils_1.hx.toNormalizedUri(n);let e={uri:n,type:c};o.push(e)}}}return!0})),t.location=a,t.references=o,t[indexlib_1.IndexDataCategory.CLASS]=c,t[indexlib_1.IndexDataCategory.ID]=l,t[indexlib_1.IndexDataCategory.COLOR]=n,t.categories.push(indexlib_1.IndexDataCategory.CLASS),t.categories.push(indexlib_1.IndexDataCategory.ID),t.categories.push(indexlib_1.IndexDataCategory.COLOR),t}}function createFileIndexProcessor(e){return new CssIndexProcessor}exports.CssIndexProcessor=CssIndexProcessor,exports.createFileIndexProcessor=createFileIndexProcessor;