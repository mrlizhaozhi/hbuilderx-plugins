"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TsHtmlIdClassDefinitionHandle=exports.TsHtmlIdClassCompletionHandle=void 0;const fs=require("fs"),path=require("path"),vscode_css_languageservice_1=require("vscode-css-languageservice"),vscode_html_languageservice_1=require("vscode-html-languageservice"),vscode_uri_1=require("vscode-uri"),core_1=require("../../../../core"),indexdatastore_1=require("../../../../indexlib/out/indexdatastore"),IndexProcessor_1=require("../../../../indexlib/out/IndexProcessor"),plugins_1=require("../plugins");function getEmbedCssData(e){let t;t="less"===e.languageId?(0,vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(e):"scss"===e.languageId?(0,vscode_css_languageservice_1.getSCSSLanguageService)().parseStylesheet(e):(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(e);let a=[""],s=[""],r=[];return t.accept((e=>{if(e.type===core_1.NodeType.ClassSelector){let t=e.getText();a.includes(t.replace(".",""))||(a.push(t.replace(".","")),r.push({text:t.replace(".",""),type:"class",offset:e.offset,length:e.length}))}else if(e.type===core_1.NodeType.IdentifierSelector){let t=e.getText();s.includes(t.replace("#",""))||(s.push(t.replace("#","")),r.push({text:t.replace("#",""),type:"id",offset:e.offset,length:e.length}))}else e.type,core_1.NodeType.HexColorValue;return!0})),r}class TsHtmlIdClassCompletionHandle{constructor(e,t,a){this.ls=e,this.allInfo=t,this.cssAndSourceData=a,this.cssLanguageServer=(0,vscode_css_languageservice_1.getCSSLanguageService)()}doExtraCompletion(e,t,a,s){let r=this.ls.getLocationInfoAtPosition(t,a,s);if(!r)return e;if(!r.activeAttribute)return e;if(r.kind===plugins_1.LocationInfoKind.AttributeValue)e=this.addCssIdCompletion(e,t,a,r),e=this.addCssClassCompletion(e,t,a,r);return e}addCssIdCompletion(e,t,a,s){if("id"!==s.activeAttribute)return e;let r=this.cssAndSourceData.getEmbedCssDocument(t);if(!r)return e;let i=this.cssAndSourceData.getSourceDocument(t);if(!i)return e;let n=[];r.forEach((e=>{n=n.concat(getEmbedCssData(e.document))}));let o=[""],c=[];n.forEach((e=>{"id"===e.type&&(o.includes(e.text)||(o.push(e.text),c.push(e)))}));const l=t.offsetAt(a),d=(0,core_1.getContextData)(t,l,void 0),u=i.uri;c.forEach((t=>{const a=vscode_uri_1.URI.file(u);e.items.push({label:t.text,kind:vscode_html_languageservice_1.CompletionItemKind.Property,detail:t.text,documentation:`定义于\n                [${path.basename(a.fsPath)}](${a.fsPath})`,textEdit:vscode_html_languageservice_1.TextEdit.replace(d.contextRange,t.text),data:{data:void 0,hxKind:core_1.HxIconKind.ID,detail:t.text,documentation:`定义于\n                    [${path.basename(a.fsPath)}](${a.fsPath})`}})}));let f=this.allInfo.project,g={uri:vscode_uri_1.URI.file(f.fsPath).toString(),name:f.fsPath},h=[];indexdatastore_1.IndexDataStore.load(g).allIndexData().forEach(((e,a)=>{a==t.uri?h.unshift({data:e,uri:a,sortText:"a"}):h.push({data:e,uri:a,sortText:"b"})}));let _=new Map;return h.forEach((t=>{const a=vscode_uri_1.URI.parse(t.uri).fsPath,s=path.relative(vscode_uri_1.URI.parse(g.uri).fsPath,a);let r=t.data[IndexProcessor_1.IndexDataCategory.ID]||[];r=r.filter((e=>!e.label.includes(":"))),r.forEach((r=>{let i=r.type==IndexProcessor_1.IndexItemType.DEF,n=_.get(r.label);if(!n||i&&!n.isDef){let i={label:r.label,kind:vscode_html_languageservice_1.CompletionItemKind.Text,textEdit:vscode_html_languageservice_1.TextEdit.replace(d.contextRange,r.label),insertTextFormat:vscode_html_languageservice_1.InsertTextFormat.PlainText,documentation:`定义于：<br><a href="file://${a}">${s}</a>`,sortText:t.sortText,data:{hxKind:core_1.HxIconKind.ID}};e.items.push(i)}}))})),e}addCssClassCompletion(e,t,a,s){if("class"!==s.activeAttribute)return e;let r=this.cssAndSourceData.getEmbedCssDocument(t);if(!r)return e;let i=this.cssAndSourceData.getSourceDocument(t);if(!i)return e;let n=[];r.forEach((e=>{n=n.concat(getEmbedCssData(e.document))}));let o=[""],c=[];n.forEach((e=>{"class"===e.type&&(o.includes(e.text)||(o.push(e.text),c.push(e)))}));const l=t.offsetAt(a),d=(0,core_1.getContextData)(t,l,void 0),u=i.uri;c.forEach((t=>{const a=vscode_uri_1.URI.file(u);e.items.push({label:t.text,kind:vscode_html_languageservice_1.CompletionItemKind.Property,detail:t.text,documentation:`定义于\n                [${path.basename(a.fsPath)}](${a.fsPath})`,textEdit:vscode_html_languageservice_1.TextEdit.replace(d.contextRange,t.text),data:{data:void 0,hxKind:core_1.HxIconKind.CLASS,detail:t.text,documentation:`定义于\n                    [${path.basename(a.fsPath)}](${a.fsPath})`}})}));let f=this.allInfo.project,g={uri:vscode_uri_1.URI.file(f.fsPath).toString(),name:f.fsPath},h=[];indexdatastore_1.IndexDataStore.load(g).allIndexData().forEach(((e,a)=>{a==t.uri?h.unshift({data:e,uri:a,sortText:"a"}):h.push({data:e,uri:a,sortText:"b"})}));let _=new Map;return h.forEach((t=>{const a=vscode_uri_1.URI.parse(t.uri).fsPath,s=path.relative(vscode_uri_1.URI.parse(g.uri).fsPath,a);let r=t.data[IndexProcessor_1.IndexDataCategory.CLASS]||[];r=r.filter((e=>!e.label.includes(":"))),r.forEach((r=>{let i=r.type==IndexProcessor_1.IndexItemType.DEF,n=_.get(r.label);if(!n||i&&!n.isDef){let i={label:r.label,kind:vscode_html_languageservice_1.CompletionItemKind.Text,textEdit:vscode_html_languageservice_1.TextEdit.replace(d.contextRange,r.label),insertTextFormat:vscode_html_languageservice_1.InsertTextFormat.PlainText,documentation:`定义于：<br><a href="file://${a}">${s}</a>`,sortText:t.sortText,data:{hxKind:core_1.HxIconKind.CLASS}};e.items.push(i)}}))})),e}}exports.TsHtmlIdClassCompletionHandle=TsHtmlIdClassCompletionHandle;class TsHtmlIdClassDefinitionHandle{constructor(e,t,a){this.ls=e,this.allInfo=t,this.cssAndSourceData=a,this.cssLanguageServer=(0,vscode_css_languageservice_1.getCSSLanguageService)()}doExtraDefinition(e,t,a,s){let r=this.ls.getLocationInfoAtPosition(t,a,s);if(!r)return e;if(!r.activeAttribute)return e;if(e||(e=[]),r.kind===plugins_1.LocationInfoKind.AttributeValue)e=this.getDefinitionFromClass(e,t,a,r);return e}getDefinitionFromClass(e,t,a,s){if("html"!==t.languageId&&"vue"!==t.languageId&&"nvue"!==t.languageId)return e;let r=this.cssAndSourceData.getEmbedCssDocument(t);if(!r||0===r.length)return e;let i=[],n=[""],o=[];const c=t.offsetAt(a),l=(0,core_1.getContextData)(t,c,void 0);let d=l.context,u=l.contextRange;if(r.forEach((t=>{i=i.concat(getEmbedCssData(t.document)),0!==i.length&&(i.forEach((e=>{"class"===e.type&&(n.includes(e.text)||(n.push(e.text),o.push(e)))})),o.forEach((a=>{if(!a.offset||!a.length)return;if(a.text!==d)return;let s=t.document.positionAt(a.offset),r=t.document.positionAt(a.offset);r.character=r.character+a.length;let i={start:s,end:r},n={targetUri:t.document.uri,targetRange:i,targetSelectionRange:i,originSelectionRange:u};e.unshift(n)})))})),0===e.length){let a=this.cssAndSourceData.getSourceDocument(t);if(!a)return e;let s,r=this.allInfo.project,i={uri:vscode_uri_1.URI.file(r.fsPath).toString(),name:r.fsPath},n=indexdatastore_1.IndexDataStore.load(i).allIndexData(),o=vscode_uri_1.URI.file(a.uri).toString();if(n.forEach(((e,t)=>{t===o&&(s=e)})),s){let t="";if(s.references.forEach((e=>{n.forEach(((a,s)=>{s==e.uri&&(t=s)}))})),""!==t){let a=vscode_uri_1.URI.parse(t).fsPath;if(fs.existsSync(a)){let s=vscode_html_languageservice_1.TextDocument.create(t,"css",0,fs.readFileSync(a,{encoding:"utf-8"}));(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(s).accept((t=>{if(t.type===core_1.NodeType.ClassSelector&&d===t.getText().replace(".","")){let a=s.positionAt(t.offset),r=s.positionAt(t.offset);r.character=r.character+t.length;let i={start:a,end:r},n={targetUri:s.uri,targetRange:i,targetSelectionRange:i,originSelectionRange:u};return e.unshift(n),!1}return!0}))}}}}if(0===e.length){if(!this.cssAndSourceData.getSourceDocument(t))return e;let a,s=this.allInfo.project,r={uri:vscode_uri_1.URI.file(s.fsPath).toString(),name:s.fsPath},i=indexdatastore_1.IndexDataStore.load(r).allIndexData(),n=vscode_uri_1.URI.parse(r.uri).fsPath,o="";if(this.allInfo.project.kind===core_1.HXProjectKind.UniApp?o=path.join(n,"App.vue"):this.allInfo.project.kind===core_1.HXProjectKind.UniApp_Cli&&(o=path.join(n,"src","App.vue")),o&&fs.existsSync(o)&&(i.forEach(((e,t)=>{t===vscode_uri_1.URI.file(o).toString()&&(a=e)})),a)){let t="";if(a.references.forEach((e=>{i.forEach(((a,s)=>{s==e.uri&&(t=s)}))})),""!==t){let a=vscode_uri_1.URI.parse(t).fsPath;if(fs.existsSync(a)){let s=vscode_html_languageservice_1.TextDocument.create(t,"css",0,fs.readFileSync(a,{encoding:"utf-8"}));(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(s).accept((t=>{if(t.type===core_1.NodeType.ClassSelector&&d===t.getText().replace(".","")){let a=s.positionAt(t.offset),r=s.positionAt(t.offset);r.character=r.character+t.length;let i={start:a,end:r},n={targetUri:s.uri,targetRange:i,targetSelectionRange:i,originSelectionRange:u};return e.unshift(n),!1}return!0}))}}}}return e}}exports.TsHtmlIdClassDefinitionHandle=TsHtmlIdClassDefinitionHandle;