"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.HTMLRevisePLugin=void 0;const HTMLRevisePLuginHandle_1=require("./HTMLRevisePLuginHandle");function create(e){let n=e.languageService,t=new HTMLRevisePLuginHandle_1.TsHtmlExtraCompletionHandle(n),o=new HTMLRevisePLuginHandle_1.TsHtmlExtraResolveHandle,l=new HTMLRevisePLuginHandle_1.TsHtmlExtraDocumentSymbolsHandle,i=Object.create(null);for(let e of Object.keys(n)){const t=n[e];i[e]=(...e)=>t.apply(n,e)}return i.doComplete=function(e,o,l,i){let s=n.doComplete(e,o,l,i);return s=t.doExtraCompletion(s,e,o,l),s},i.doResolve=function(e,n,t,l){return e=o.doExtraResolve(e,n,t,l)},i.findDocumentSymbols=function(e,t){let o=n.findDocumentSymbols(e,t);return o=l.doExtraSymbols(o,e,t),o},i}const HTMLRevisePLugin={create:create};exports.HTMLRevisePLugin=HTMLRevisePLugin;