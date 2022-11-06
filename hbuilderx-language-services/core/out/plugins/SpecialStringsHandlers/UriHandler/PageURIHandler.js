"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const lspUtil_1=require("../../../base/lspUtil"),index_1=require("../index"),URIHandler_1=require("./URIHandler");class PageURIHandler extends URIHandler_1.default{constructor(e,t){super(e,t),this.doComplete=(e,t,n,i,r,l)=>{let a=(0,lspUtil_1.getContextData)(e,e.offsetAt(t),"'\"");r=(0,URIHandler_1.sortProcessing)(r,a.contextRange);let o=n.project.fsPath,s=n.project.sourceRoot,d={extSuffixFilterList:this._exts,ignoredFiles:["App.vue"],prefixPath:""};n.kind===index_1.StringLocationInfoKind.IN_JS_LIKE&&(""!==a.leftText?d.prefixPath=a.leftText:d.prefixPath="/");let u=a.contextRange,x=(0,URIHandler_1.getCompletionPathListSync)(o,s,d,e.uri),c=(0,URIHandler_1.getPathCompletionItem)(x,e,u,n,!1,!1);return n.kind===index_1.StringLocationInfoKind.IN_JSON_LIKE?(c=c.filter((e=>{if(e.documentation&&"string"!=typeof e.documentation&&e.documentation.value.includes("page"))return e})),c=c.map((e=>{let t=e.label.lastIndexOf(".");return e.label=e.label.substring(0,t),e.textEdit.newText=e.textEdit.newText.substring(0,t),e}))):n.kind===index_1.StringLocationInfoKind.IN_JS_LIKE&&(c=c.filter((e=>{if(e.documentation&&"string"!=typeof e.documentation&&e.documentation.value.includes("page"))return e})),c=c.map((e=>{let t=e.label.lastIndexOf(".");return e.label=e.label.substring(0,t),e.textEdit.newText=e.textEdit.newText.substring(0,t),e}))),r.push(...c),r}}}exports.default=PageURIHandler;