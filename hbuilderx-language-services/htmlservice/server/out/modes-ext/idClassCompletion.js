"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.IdClassCompletionParticipant=void 0;const vscode_html_languageservice_1=require("vscode-html-languageservice"),path=require("path"),vscode_languageserver_1=require("vscode-languageserver"),vscode_uri_1=require("vscode-uri"),indexlib_1=require("../../../../indexlib"),utils_1=require("../../../../utils"),strings_1=require("../utils/strings"),whiteSpaceCharCode=[" ".charCodeAt(0),"\n".charCodeAt(0),"\t".charCodeAt(0),"\f".charCodeAt(0),"\r".charCodeAt(0)];class IdClassCompletionParticipant{constructor(){this.attributeCompletions=[]}onHtmlAttributeValue(e){"id"!=e.attribute&&"class"!=e.attribute||this.attributeCompletions.push(e)}beginCompletion(e){this.currentWorkspace=null==e?void 0:e.workspaceFolder,this.attributeCompletions=[]}collectIdIndex(e){let t=[],i=e.document.offsetAt(e.position),r=e.document.getText(e.range),a=e.document.offsetAt(e.range.start),s=a+r.length;const n=this.currentWorkspace.uri;let o=!0;i>a&&i<=s&&r&&('"'==r[0]||"'"==r[0])&&(s>a&&r[0]==r[r.length-1]&&s--,a++,o=!1),a=Math.min(i,a);let l={start:e.document.positionAt(a),end:e.document.positionAt(s)},c=[];indexlib_1.IndexDataStore.load(this.currentWorkspace).allIndexData().forEach(((t,i)=>{i==e.document.uri?c.unshift({data:t,uri:i,sortText:"a"}):c.push({data:t,uri:i,sortText:"b"})}));let d=new Map;return c.forEach((e=>{const i=vscode_uri_1.URI.parse(e.uri).fsPath,r=path.relative(vscode_uri_1.URI.parse(n).fsPath,i);let a=e.data[indexlib_1.IndexDataCategory.ID]||[];a=a.filter((e=>!e.label.includes(":"))),a.forEach((a=>{let s=a.type==indexlib_1.IndexItemType.DEF,n=d.get(a.label);if(!n||s&&!n.isDef){const c=o?'"'+a.label+'"':a.label;let u={label:a.label,kind:vscode_html_languageservice_1.CompletionItemKind.Text,textEdit:vscode_html_languageservice_1.TextEdit.replace(l,c),insertTextFormat:vscode_languageserver_1.InsertTextFormat.PlainText,documentation:`定义于：<br><a href="file://${i}">${r}</a>`,sortText:e.sortText,data:{hxKind:utils_1.HxIconKind.ID}};n?(n.isDef=!0,t.splice(n.index,1,u)):(n={isDef:s,index:t.length},d.set(a.label,n),t.push(u))}}))})),t}collectClassIndex(e){let t=[],i=e.document.offsetAt(e.position),r=e.document.getText(e.range),a=e.document.offsetAt(e.range.start),s=a+r.length;const n=this.currentWorkspace.uri;let o=!0;if(i>a&&i<=s&&r&&('"'==r[0]||"'"==r[0])){s>a&&r[0]==r[r.length-1]&&s--;const e=i-a;s=getWordEnd(r,e,s-a)+a,a=getWordStart(r,e,1)+a,o=!1}a=Math.min(i,a);let l={start:e.document.positionAt(a),end:e.document.positionAt(s)},c=[];indexlib_1.IndexDataStore.load(this.currentWorkspace).allIndexData().forEach(((t,i)=>{i==e.document.uri?c.unshift({data:t,uri:i,sortText:"a"}):c.push({data:t,uri:i,sortText:"b"})}));let d=new Map;return c.forEach((e=>{const i=vscode_uri_1.URI.parse(e.uri).fsPath,r=path.relative(vscode_uri_1.URI.parse(n).fsPath,i);let a=e.data[indexlib_1.IndexDataCategory.CLASS]||[];a=a.filter((e=>!e.label.includes(":"))),a.forEach((a=>{let s=a.type==indexlib_1.IndexItemType.DEF,n=d.get(a.label);if(!n||s&&!n.isDef){const c=o?'"'+a.label+'"':a.label;let u={label:a.label,kind:vscode_html_languageservice_1.CompletionItemKind.Text,textEdit:vscode_html_languageservice_1.TextEdit.replace(l,c),insertTextFormat:vscode_languageserver_1.InsertTextFormat.PlainText,documentation:`定义于：<br><a href="file://${i}">${r}</a>`,sortText:e.sortText,data:{hxKind:utils_1.HxIconKind.CLASS}};n?(n.isDef=!0,t.splice(n.index,1,u)):(n={isDef:s,index:t.length},d.set(a.label,n),t.push(u))}}))})),t}async computeCompletions(e,t,i){const r={items:[],isIncomplete:!1};if(!this.currentWorkspace)return r;if(this.attributeCompletions.length>0){const e=this.attributeCompletions[0];"id"==e.attribute?r.items.push(...this.collectIdIndex(e)):"class"==e.attribute&&r.items.push(...this.collectClassIndex(e))}return r}}function getWordStart(e,t,i){for(;t>i&&!whiteSpaceCharCode.includes(e.charCodeAt(t-1));)t--;return t}function getWordEnd(e,t,i){for(;t<i&&!whiteSpaceCharCode.includes(e.charCodeAt(t));)t++;return t}function stripQuotes(e){return(0,strings_1.startsWith)(e,"'")||(0,strings_1.startsWith)(e,'"')?e.slice(1,-1):e}exports.IdClassCompletionParticipant=IdClassCompletionParticipant;