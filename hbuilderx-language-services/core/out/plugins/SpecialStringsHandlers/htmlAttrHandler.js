"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.doComplete=void 0;const vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),lspUtil_1=require("../../base/lspUtil"),htmlDataUtils_1=require("../tool/htmlDataUtils"),dataProvider=(0,htmlDataUtils_1.htmlDataProvider)(),attrsCache=[];function getDistinctAttrs(){if(attrsCache.length>0)return attrsCache;let e=new Set,t=dataProvider.provideTags();for(let r of t){let t=dataProvider.provideAttributes(r.name);for(let r of t)e.has(r.name)||(e.add(r.name),attrsCache.push(r))}return attrsCache}function doComplete(e,t,r,a){dataProvider.provideTags();let o=getDistinctAttrs();const l=r.range;return o.map((e=>({label:e.name,kind:vscode_languageserver_protocol_1.CompletionItemKind.Value,textEdit:l?vscode_languageserver_protocol_1.TextEdit.replace(l,e.name):void 0,data:{hxKind:lspUtil_1.HxIconKind.ATTRIBUTE}})))}exports.doComplete=doComplete;