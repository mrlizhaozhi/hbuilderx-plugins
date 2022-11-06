"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const lspUtil_1=require("../../base/lspUtil"),index_1=require("./index"),URIHandler_1=require("./UriHandler/URIHandler");class PageURIHandler extends URIHandler_1.default{constructor(e){super(e),this.doComplete=(e,t,n,r,i,l)=>{let s=(0,lspUtil_1.getContextData)(e,e.offsetAt(t),"'\"");i=(0,URIHandler_1.sortProcessing)(i,s.contextRange);let a=n.project.fsPath,o=n.project.sourceRoot,d={extensionFilters:this._exts,ignoredFiles:["App.vue"],prefixPath:""},p=s.contextRange,u=(0,URIHandler_1.getCompletionPathListSync)(a,o,d,e.uri),x=(0,URIHandler_1.getPathCompletionItem)(u,e,p,n.project,!1,!1);return n.kind===index_1.StringLocationInfoKind.IN_JSON_LIKE?(x=x.filter((e=>e.label.includes("page"))),x=x.map((e=>{let t=e.label.lastIndexOf(".");return e.label=e.label.substring(0,t),e.textEdit.newText=e.textEdit.newText.substring(0,t),e}))):(n.kind,index_1.StringLocationInfoKind.IN_JS_LIKE),i.push(...x),i}}}exports.default=PageURIHandler;