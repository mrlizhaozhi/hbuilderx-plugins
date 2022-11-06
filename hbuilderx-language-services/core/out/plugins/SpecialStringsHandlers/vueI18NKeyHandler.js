"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const fs=require("fs"),path=require("path"),vscode_json_languageservice_1=require("vscode-json-languageservice"),vscode_languageserver_1=require("vscode-languageserver"),vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),vscode_uri_1=require("vscode-uri"),lspUtil_1=require("../../base/lspUtil"),project_1=require("../../base/project");function getJsonServer(){const e={resolveRelativePath:(e,t)=>{const r=t.substring(0,t.lastIndexOf("/")+1);return vscode_uri_1.Utils.resolvePath(vscode_uri_1.URI.parse(r),e).toString()}};return(0,vscode_json_languageservice_1.getLanguageService)({workspaceContext:e,contributions:[],clientCapabilities:vscode_json_languageservice_1.ClientCapabilities.LATEST})}function treeApply(e,t){e&&t(e)&&e.children&&e.children.forEach((e=>{treeApply(e,t)}))}function getNodeFromKey(e,t){const r=e.root;let n=[];return treeApply(r,(e=>("property"===e.type&&e.keyNode.value===t&&n.push(e),!0))),n}function getNodeFromValue(e,t){const r=e.root;let n=[];return treeApply(r,(e=>("property"===e.type&&e.valueNode.value===t&&n.push(e),!0))),n}function getCurrentI18nLanguageFile(e){let t,r=path.join(e.sourceRoot,"manifest.json"),n=fs.readFileSync(r),o=vscode_languageserver_textdocument_1.TextDocument.create(r,"json",1,n.toString()),i=getJsonServer().parseJSONDocument(o),s=getNodeFromKey(i,"locale"),u="zh-Hans";if(s.length>0){u=s[0].valueNode.value}let a=path.join(e.sourceRoot,"locale"),c=fs.readdirSync(a);if(!c)return t;if(c.length<1)return t;let l=c.filter((e=>{if(!e.includes("uni")&&e.endsWith(".json"))return e}));if(!l.includes(u+".json")){let e=getNodeFromKey(i,"fallbackLocale"),t="en";if(s.length>0&&(t=e[0].value),!l.includes(u+".json"))return}return t=path.join(a,u+".json"),t}class VueI18NKeyHandler{doComplete(e,t,r,n,o,i){if(!r.project.sourceRoot)return o;let s=r.project;if(!s)return o;if(s.kind!==project_1.HXProjectKind.UniApp&&s.kind!==project_1.HXProjectKind.UniApp_Cli)return o;let u=getCurrentI18nLanguageFile(s);if(u){const e=getJsonServer(),t=fs.readFileSync(u),n=vscode_languageserver_textdocument_1.TextDocument.create(u,"json",1,t.toString());treeApply(e.parseJSONDocument(n).root,(e=>("property"===e.type&&o.push({label:e.keyNode.value,detail:u,documentation:e.valueNode.value,textEdit:vscode_json_languageservice_1.TextEdit.replace(r.range,e.keyNode.value),kind:vscode_languageserver_1.CompletionItemKind.Text,data:{hxKind:lspUtil_1.HxIconKind.ATTRIBUTE}}),!0)))}return o}doCompleteResolve(e,t,r,n,o){return e}doHover(e,t,r,n){if(!r.project.sourceRoot)return;let o=r.project;if(!o)return;if(o.kind!==project_1.HXProjectKind.UniApp&&o.kind!==project_1.HXProjectKind.UniApp_Cli)return;let i=e.getText(r.range),s=getCurrentI18nLanguageFile(o);if(s){const e=getJsonServer(),t=fs.readFileSync(s),n=vscode_languageserver_textdocument_1.TextDocument.create(s,"json",1,t.toString()),o=getNodeFromKey(e.parseJSONDocument(n),i);if(!o)return;const u=o[0];if(!u||!u.keyNode)return;return{contents:u.valueNode.value,range:r.range}}}doDefinition(e,t,r,n){if(!r.project.sourceRoot)return[];let o=r.project;if(!o)return[];if(o.kind!==project_1.HXProjectKind.UniApp&&o.kind!==project_1.HXProjectKind.UniApp_Cli)return[];let i=e.getText(r.range),s=getCurrentI18nLanguageFile(o);if(s){const e=getJsonServer(),t=fs.readFileSync(s),n=vscode_languageserver_textdocument_1.TextDocument.create(s,"json",1,t.toString()),o=getNodeFromKey(e.parseJSONDocument(n),i);if(!o)return[];const u=o[0];if(!u||!u.keyNode)return[];let a=n.positionAt(u.keyNode.offset),c=n.positionAt(u.keyNode.offset+u.keyNode.length),l=vscode_json_languageservice_1.Range.create(a,c),d={targetUri:s,targetRange:l,targetSelectionRange:l,originSelectionRange:r.range},g=[];return g.push(d),g}return[]}doReference(e,t,r,n){return[]}}exports.default=VueI18NKeyHandler;