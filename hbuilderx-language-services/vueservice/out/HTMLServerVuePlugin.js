"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,i,n){void 0===n&&(n=i),Object.defineProperty(e,n,{enumerable:!0,get:function(){return t[i]}})}:function(e,t,i,n){void 0===n&&(n=i),e[n]=t[i]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&__createBinding(t,e,i);return __setModuleDefault(t,e),t};Object.defineProperty(exports,"__esModule",{value:!0}),exports.HTMLServerVuePlugin=void 0;const path=__importStar(require("path")),vscode_html_languageservice_1=require("vscode-html-languageservice"),vscode_uri_1=require("vscode-uri"),out_1=require("../../core/out"),out_2=require("../../htmlservice/server/out"),node_1=require("../../indexlib/out/node"),out_3=require("../packages/vue-typescript/out"),easycomService=__importStar(require("./vue/easycomService")),VueModifierData_1=require("./VueModifierData"),VueEventPrefix="[event]";var VueDirectiveType;function vueDirectiveType(e){return"v-on"==e||"@"==e?VueDirectiveType.Event:"v-bind"==e||":"==e?VueDirectiveType.Attribute:"v-pre"==e||"v-cloak"==e||"v-once"==e||"v-else"==e?VueDirectiveType.Empty:VueDirectiveType.String}function getVueBindOrOnDirective(e){return e?e.startsWith("v-on:")?"v-on:":e.startsWith("@")?"@":e.startsWith("v-bind:")?"v-bind:":e.startsWith(":")?":":"":""}function checkVueModifierDirective(e){return e.startsWith("v-on:")?"v-on:":e.startsWith("@")?"@":e.startsWith("v-bind:")?"v-bind":e.startsWith(":")?":":e.startsWith("v-model")?"v-model":""}function normalizeMarkupContent(e){if(e)return"string"==typeof e?{kind:"markdown",value:e}:{kind:"markdown",value:e.value}}function vueModifierHandle(e,t,i){const n=(0,VueModifierData_1.getModifierProvider)();let o=[];if(!t.activeAttribute)return e;let a=checkVueModifierDirective(t.activeAttribute);if(""===a)return e;let r=t.activeAttribute.split("."),l=r.slice(0,1),u=r.slice(0,-1);if(t.activeAttribute===l[0])return e;let c=l[0].substring(a.length);if("@"===a||"v-on:"===a){const e=["keydown","keypress","keyup"],t=["click","dblclick","mouseup","mousedown"];o.push(...n.eventModifiers),e.includes(c)?(o.push(...n.keyModifiers),o.push(...n.systemModifiers)):t.includes(c)&&(o.push(...n.mouseModifiers),o.push(...n.systemModifiers))}else":"===a||"v-bind"===a?o.push(...n.propsModifiers):"v-model"===a&&(o.push(...n.propsModifiers),o.push(...n.vModelModifiers));let s=u.join("."),d=i.offsetAt(t.activeRange.start)+s.length+1,v=i.positionAt(d),f=t.activeRange.end,m=vscode_html_languageservice_1.Range.create(v,f);return e.items=[],o.forEach((t=>{e.items.push({label:t.label,kind:vscode_html_languageservice_1.CompletionItemKind.Method,textEdit:vscode_html_languageservice_1.TextEdit.replace(m,t.label),insertTextFormat:vscode_html_languageservice_1.InsertTextFormat.PlainText,documentation:normalizeMarkupContent(t.documentation),data:{hxKind:out_1.HxIconKind.ATTRIBUTE}})})),e}function vueCustomDirectiveHandle(e,t,i){let n=t.project.fsPath,o=vscode_uri_1.URI.file(n).toString();const a=node_1.IndexDataStore.load({uri:o,name:""});let r=[];return a.allIndexData().forEach(((e,t)=>{var i;let n=e["vue-components"];if(n instanceof Array)for(let e=0;e<n.length;e++){const t=n[e];if("regularName"==t.label){const e=null===(i=null==t?void 0:t.data)||void 0===i?void 0:i.events;e instanceof Array&&e.forEach((e=>{"string"==typeof e&&r.push({label:e,kind:vscode_html_languageservice_1.CompletionItemKind.Property,sortText:"aa"})}));break}}})),e.items.push(...r),e}function create(e,t,i){let n=e.languageService,o=Object.create(null);for(let e of Object.keys(n)){const t=n[e];o[e]=(...e)=>t.apply(n,e)}return o.doComplete=function(i,o,a,r){if("vue"===i.languageId||"nvue"===i.languageId){let r=function(t,i,o,a){var r,l,u;let c=n.doComplete(t,i,o),s=n.getLocationInfoAtPosition(t,i,o);if(!s)return{result:c};switch(s.kind){case out_2.LocationInfoKind.StartTagOpen:case out_2.LocationInfoKind.StartTag:case out_2.LocationInfoKind.EndTag:!function(e,t,i){let n=easycomService.collectEasycoms(e,t,i),o=s.activeRange;n.forEach((t=>{c.items.push({label:t.name,kind:vscode_html_languageservice_1.CompletionItemKind.Property,data:{hxKind:out_1.HxIconKind.ELEMENT,languageId:"vue-template",uri:e.uri,kind:"vue-component",filePath:t.filePath},textEdit:vscode_html_languageservice_1.TextEdit.replace(o,t.name+"$0></"+t.name+">"),insertTextFormat:vscode_html_languageservice_1.InsertTextFormat.Snippet})}))}(t,o,e.project);break;case out_2.LocationInfoKind.AttributeName:{let i=t.offsetAt(s.activeRange.end),a=n.isFollowedBy(t.getText(),i,vscode_html_languageservice_1.ScannerState.AfterAttributeName,vscode_html_languageservice_1.TokenType.DelimiterAssign),u=easycomService.findEasycomByTag(s.activeTag,t,o,e.project);if(u){let e=easycomService.fetchVueComponentInfo(u.filePath),t=a?void 0:{title:"Suggest",command:"editor.action.triggerSuggest"};null===(r=null==e?void 0:e.properties)||void 0===r||r.forEach((e=>{if(e.name){let i=e.name+(a?"":'="$1"');c.items.push({label:e.name,kind:vscode_html_languageservice_1.CompletionItemKind.Property,documentation:e.description,textEdit:vscode_html_languageservice_1.TextEdit.replace(s.activeRange,i),insertTextFormat:vscode_html_languageservice_1.InsertTextFormat.Snippet,command:t})}})),null===(l=null==e?void 0:e.events)||void 0===l||l.forEach((e=>{if(e.name){let i=e.name+(a?"":'="$1"');c.items.push({label:e.name,kind:vscode_html_languageservice_1.CompletionItemKind.Function,documentation:e.description,textEdit:vscode_html_languageservice_1.TextEdit.replace(s.activeRange,i),insertTextFormat:vscode_html_languageservice_1.InsertTextFormat.Snippet,command:t,data:{hxKind:out_1.HxIconKind.EVENT,source:"easycom"}})}}))}break}case out_2.LocationInfoKind.AttributeValue:{let i=easycomService.findEasycomByTag(s.activeTag,t,o,e.project);if(i){let e=easycomService.fetchVueComponentInfo(i.filePath),t=null===(u=null==e?void 0:e.properties)||void 0===u?void 0:u.find((e=>e.name===(null==s?void 0:s.activeAttribute)));t&&t.values&&t.values.forEach((e=>{let t=e.value;c.items.push({label:e.value,kind:vscode_html_languageservice_1.CompletionItemKind.Value,documentation:e.description,textEdit:vscode_html_languageservice_1.TextEdit.replace(s.activeRange,t)})}))}}}return{result:c,location:s}}(i,o,a);if(r&&r.location&&r.location.kind===out_2.LocationInfoKind.AttributeName){let e=getVueBindOrOnDirective(r.location.activeAttribute),n={isIncomplete:r.result.isIncomplete,items:[]};return r.result.items.forEach((t=>{var i,o,a,r;if(t.label){if((null===(i=t.data)||void 0===i?void 0:i.hxKind)===out_1.HxIconKind.EVENT){if(0===e.length&&(null===(o=t.data)||void 0===o?void 0:o.source))return;if(t.label.startsWith("on")&&(t.label=t.label.slice(2),t.textEdit)){let e=t.textEdit.newText.startsWith("on")?t.textEdit.newText.slice(2):t.textEdit.newText;t.textEdit.newText=e}}if(t.label.startsWith("[event]")&&(t.data||(t.data={}),t.data.hxKind=out_1.HxIconKind.EVENT,t.label=t.label.slice("[event]".length),t.textEdit)){let e=t.textEdit.newText.startsWith("[event]")?t.textEdit.newText.slice("[event]".length):t.textEdit.newText;t.textEdit.newText=e}if(t.label.startsWith("v-")){let e=vueDirectiveType(t.label);e!=VueDirectiveType.Event&&e!=VueDirectiveType.Attribute||t.textEdit&&(t.textEdit.newText=t.label+":"),e!=VueDirectiveType.Empty&&(t.command={title:"Suggest",command:"editor.action.triggerSuggest"})}else e.length>0&&t.textEdit&&("@"===e||"v-on:"===e?(null===(a=t.data)||void 0===a?void 0:a.hxKind)===out_1.HxIconKind.EVENT&&(t.label=e+t.label,t.textEdit.newText=e+t.textEdit.newText):(null===(r=t.data)||void 0===r?void 0:r.hxKind)!==out_1.HxIconKind.EVENT&&(t.label=e+t.label,t.textEdit.newText=e+t.textEdit.newText));n.items.push(t)}})),n=vueModifierHandle(r.result,r.location,i),n=vueCustomDirectiveHandle(r.result,t,r.location),n}return r.result}return n.doComplete(i,o,a,r)},o.doResolve=function(e,i,o,a){if("vue"===i.languageId||"nvue"===i.languageId){if((e=n.doResolve(e,i,o,a)).data&&e.data.kind){const r=e.data;function l(){if(r.filePath){let t=easycomService.fetchVueComponentInfo(r.filePath);if(t)return e.detail=e.label,e.documentation=t.description,e}}function u(){var i,n;let o=t.languageService.getProgram(),a=null==o?void 0:o.getRootFileNames().find((e=>e.endsWith(out_3.localTypes.typesFileName)));if(!a)return e;let r=null==o?void 0:o.getSourceFile(a),l=null==o?void 0:o.getTypeChecker();if(!l||!r)return e;let u=l.getSymbolsInScope(r,t.ts.SymbolFlags.Type|t.ts.SymbolFlags.BlockScoped).find((e=>"GlobalComponents"===e.escapedName));if(!u||0==(null===(i=u.declarations)||void 0===i?void 0:i.length))return e;let c=l.getTypeAtLocation(u.declarations[0]),s=l.getPropertiesOfType(c).find((t=>t.getName()===e.label));if(s){const{displayParts:i,documentation:o,symbolKind:a,tags:u}=t.ts.SymbolDisplay.getSymbolDisplayPartsDocumentationAndSymbolKind(l,s,r,r,r,7);let c=t.ts.Completions.createCompletionDetails(s.name,t.ts.SymbolDisplay.getSymbolModifiers(l,s),a,i,o,u,void 0,void 0);if(c){let i=null===(n=s.valueDeclaration)||void 0===n?void 0:n.getSourceFile().fileName;if(e.detail=`${e.label}:GlobalElements.${e.label}`,e.documentation=t.ts.displayPartsToString(c.documentation),i){let t=i.indexOf("node_modules");t>=0&&(i=i.substring(t),e.documentation&&e.documentation.length>0?e.documentation=e.documentation+"\n"+`来自于：${i}`:e.documentation=`来自于：${i}`)}}}return e}"vue-component"===r.kind?l():"vue-global-component"===r.kind&&u()}return e}return n.doResolve(e,i,o,a)},o.doHover=function(t,i,o,a){if("vue"===t.languageId||"nvue"===t.languageId){let r=n.doHover(t,i,o,a);if(r)return r;let l=n.getLocationInfoAtPosition(t,i,o);if((null==l?void 0:l.kind)===out_2.LocationInfoKind.AttributeName){let c=l.activeTag,s=easycomService.findEasycomByTag(c,t,o,e.project);if(s)return u(s,l)}if((null==l?void 0:l.kind)===out_2.LocationInfoKind.StartTag||(null==l?void 0:l.kind)===out_2.LocationInfoKind.EndTag){let d=l.activeTag,v=easycomService.findEasycomByTag(d,t,o,e.project);if(v)return u(v,l)}function u(t,i){var n,o;let a=easycomService.fetchVueComponentInfo(t.filePath);if(a){if(i.kind!==out_2.LocationInfoKind.AttributeName){let t=[];return t.push(`**${i.activeTag}**`),t.push("<hr>"),a.description&&(t.push(`${a.description}`),t.push("<br />"),t.push("<br />")),t.push(`<b>定义于：</b> <a href='file://${a.filePath}'>${path.relative(e.project.fsPath,a.filePath)}</a>`),a.tutorial&&(t.push("<br />"),t.push(`<b>文档：</b><a data-kind='tutorial' href='${a.tutorial}'>${a.tutorial}</a>`)),{range:i.activeRange,contents:{kind:"markdown",value:t.join("\n")}}}{let t=null===(n=a.properties)||void 0===n?void 0:n.find((e=>i.activeAttribute==e.name||i.activeAttribute==":"+e.name||i.activeAttribute=="v-bind:"+e.name)),r=null===(o=a.events)||void 0===o?void 0:o.find((e=>i.activeAttribute==e.name||i.activeAttribute=="@"+e.name||i.activeAttribute=="v-on:"+e.name));if(t){let n=[];return n.push(`**${t.name}**`),n.push("<hr>"),t.description&&(n.push(`${t.description}`),n.push("<br />"),n.push("<br />")),n.push(`<b>定义于：</b> <a href='file://${a.filePath}'>${path.relative(e.project.fsPath,a.filePath)}</a>`),{range:i.activeRange,contents:{kind:"markdown",value:n.join("\n")}}}if(r){let t=[];return t.push(`**${r.name}**`),t.push("<hr>"),r.description&&(t.push(`${r.description}`),t.push("<br />"),t.push("<br />")),t.push(`<b>定义于：</b> <a href='file://${a.filePath}'>${path.relative(e.project.fsPath,a.filePath)}</a>`),{range:i.activeRange,contents:{kind:"markdown",value:t.join("\n")}}}}}return null}}return n.doHover(t,i,o,a)},o.findDefinition=function(t,i,o){if("vue"===t.languageId||"nvue"===t.languageId){let a=[],r=n.findDefinition(t,i,o);r&&a.push(...r);let l=n.getLocationInfoAtPosition(t,i,o);if(l&&(l.kind===out_2.LocationInfoKind.StartTag||l.kind===out_2.LocationInfoKind.EndTag)){let i=easycomService.findEasycomByTag(l.activeTag,t,o,e.project);if(i){let e={start:{line:0,character:0},end:{line:0,character:0}};a.push({originSelectionRange:l.activeRange,targetUri:i.filePath,targetSelectionRange:e,targetRange:e})}}return a}return n.findDefinition(t,i,o)},o}!function(e){e[e.Empty=0]="Empty",e[e.String=1]="String",e[e.Event=2]="Event",e[e.Attribute=3]="Attribute"}(VueDirectiveType||(VueDirectiveType={}));class HTMLServerVuePlugin{constructor(e,t){this.tsInfo=e,this.vueDataProviders=t}create(e){return create(e,this.tsInfo,this.vueDataProviders)}}exports.HTMLServerVuePlugin=HTMLServerVuePlugin;