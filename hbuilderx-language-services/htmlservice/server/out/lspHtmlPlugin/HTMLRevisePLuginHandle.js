"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TsHtmlExtraDocumentSymbolsHandle=exports.TsHtmlExtraDefinitionHandle=exports.TsHtmlExtraResolveHandle=exports.TsHtmlExtraCompletionHandle=void 0;const vscode_html_languageservice_1=require("vscode-html-languageservice"),core_1=require("../../../../core"),plugins_1=require("../plugins"),selfClosingTags=["br","hr","img","link","base","area","input","source","meta"];class TsHtmlExtraCompletionHandle{constructor(t){this.ls=t}doExtraCompletion(t,e,n,a){let i=this.ls.getLocationInfoAtPosition(e,n,a);if(!i)return t;let o=i;switch(t.items.forEach((t=>{t=this.initData(t)})),o.kind){case plugins_1.LocationInfoKind.StartTagOpen:case plugins_1.LocationInfoKind.StartTag:case plugins_1.LocationInfoKind.EndTag:t.items.forEach((t=>{t=this.addEndTag(t,e,n),t=this.addHxKind(t,o.kind)})),t=this.deleteEndTagCompletions(t);break;case plugins_1.LocationInfoKind.AttributeName:t.items.forEach((t=>{t=this.addHxKind(t,o.kind),t=this.addCommand(t,i),t=this.correctionData(t,i)}))}return t}initData(t){let e={data:t.data};return t.data=e,t}addEndTag(t,e,n){const a=e.offsetAt(n);return(0,core_1.getContextData)(e,a,' \t\n\r":{[()]},*<+').context.includes(">")||(selfClosingTags.includes(t.label)?t.textEdit&&(t.insertTextFormat=vscode_html_languageservice_1.InsertTextFormat.Snippet,t.textEdit.newText=t.label+" $0/>"):t.kind===vscode_html_languageservice_1.CompletionItemKind.Property&&t.textEdit&&(t.insertTextFormat=vscode_html_languageservice_1.InsertTextFormat.Snippet,t.textEdit.newText=t.label+"$0></"+t.label+">")),t}addHxKind(t,e){let n=core_1.HxIconKind.ATTRIBUTE;switch(e){case plugins_1.LocationInfoKind.StartTagOpen:case plugins_1.LocationInfoKind.StartTag:case plugins_1.LocationInfoKind.EndTag:n=core_1.HxIconKind.ELEMENT;break;case plugins_1.LocationInfoKind.AttributeName:(t.label.startsWith("on")||t.kind===vscode_html_languageservice_1.CompletionItemKind.Function)&&(n=core_1.HxIconKind.EVENT)}let a=t.data;return a.hxKind=n,t.data=a,t}addCommand(t,e){if(t.command)return t;if(e.kind===plugins_1.LocationInfoKind.AttributeName)t.command=core_1.retriggerCommand,"script"===e.activeTag&&"defer"===t.label&&(t.command=void 0),"script"===e.activeTag&&"setup"===t.label&&(t.command=void 0),"style"===e.activeTag&&"scoped"===t.label&&(t.command=void 0);return t}correctionData(t,e){if(e.kind===plugins_1.LocationInfoKind.AttributeName)"style"===e.activeTag&&"scoped"===t.label&&t.textEdit&&(t.textEdit.newText=t.label);return t}deleteEndTagCompletions(t){return t.items=t.items.filter((t=>!t.label.includes("/"))),t}}exports.TsHtmlExtraCompletionHandle=TsHtmlExtraCompletionHandle;class TsHtmlExtraResolveHandle{doExtraResolve(t,e,n,a){return t.data,t}}exports.TsHtmlExtraResolveHandle=TsHtmlExtraResolveHandle;class TsHtmlExtraDefinitionHandle{constructor(t){this.ls=t}doExtraDefinition(t,e,n){return[]}}exports.TsHtmlExtraDefinitionHandle=TsHtmlExtraDefinitionHandle;class TsHtmlExtraDocumentSymbolsHandle{doExtraSymbols(t,e,n){return t=this.convertSymbolKind(t,e,n),t=this.convertSymbolRange(t,e,n)}convertSymbolKind(t,e,n){return t.forEach((t=>{t.kind===vscode_html_languageservice_1.SymbolKind.Field&&(t.kind=core_1.HxIconKind.ELEMENT)})),t}convertSymbolRange(t,e,n){return t.forEach((t=>{t.location.range.start.character+=1})),t}}exports.TsHtmlExtraDocumentSymbolsHandle=TsHtmlExtraDocumentSymbolsHandle;