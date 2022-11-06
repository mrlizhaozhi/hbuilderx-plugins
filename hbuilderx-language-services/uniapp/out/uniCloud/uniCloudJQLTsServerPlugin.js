"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.uniCloudJQLTsServerPlugin=void 0;const vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),hx=require("../../../core"),documents_1=require("../../../core/out/base/documents");let documentVersion=1;const jqlHelperFileName="jql-helper-docs.ts",jqlSuffix="\nvar db = uniCloud.database();";let currentTextDocument=createHelperDocument(void 0),latestVersion="0";function createHelperDocument(e){let t="";if(e){let n=e.getSnapshot();t=n.getText(0,n.getLength())+jqlSuffix,latestVersion=e.getLatestVersion()}return vscode_languageserver_textdocument_1.TextDocument.create(jqlHelperFileName,"typescript",0,t)}function createDocumentProvider(e,t,n){if(!e||!t)return;return{get version(){return t.getProjectVersion()},compilerOptions:{allowNonTsExtensions:!0,allowJs:!0,lib:["lib.esnext.d.ts"],target:n.ScriptTarget.Latest,moduleResolution:n.ModuleResolutionKind.Classic,experimentalDecorators:!1},documents:[currentTextDocument.uri],getDocumentSnapshot(e){let t="";return e.indexOf(jqlHelperFileName)>=0&&(t=currentTextDocument.getText()),{getText:(e,n)=>t.substring(e,n),getLength:()=>t.length,getChangeRange:()=>{}}},getDocumentVersion:e=>e.indexOf(jqlHelperFileName)>=0?latestVersion:"1",hasDocument:e=>e.indexOf(jqlHelperFileName)>=0}}function proxyLanguageService(e,t,n,r){const o=Object.create(null);for(let t of Object.keys(e)){const n=e[t];o[t]=(...t)=>n.apply(e,t)}return o.getCompletionsAtPosition=(t,o,i)=>{if(t.endsWith(".jql")){let e=r.tsinfo.project.getScriptInfo(t);return currentTextDocument=createHelperDocument(e),n.getCompletionsAtPosition(currentTextDocument.uri,o,i)}return e.getCompletionsAtPosition(t,o,i)},o.getCompletionEntryDetails=(t,o,i,u,c,s,l)=>{if(t.endsWith(".jql")){let e=r.tsinfo.project.getScriptInfo(t);return currentTextDocument=createHelperDocument(e),n.getCompletionEntryDetails(currentTextDocument.uri,o,i,u,c,s,l)}return e.getCompletionEntryDetails(t,o,i,u,c,s,l)},o.getQuickInfoAtPosition=(t,o)=>{if(t.endsWith(".jql")){let e=r.tsinfo.project.getScriptInfo(t);return currentTextDocument=createHelperDocument(e),n.getQuickInfoAtPosition(currentTextDocument.uri,o)}return e.getQuickInfoAtPosition(t,o)},o.getDefinitionAndBoundSpan=(t,o)=>{if(t.endsWith(".jql")){let e=r.tsinfo.project.getScriptInfo(t);currentTextDocument=createHelperDocument(e);let i=n.getDefinitionAndBoundSpan(currentTextDocument.uri,o);if(i&&i.definitions&&i.definitions.length>0){let e=i.definitions[0].fileName,t=i.definitions[0].textSpan.start,n=currentTextDocument.positionAt(t);if(currentTextDocument.uri===e&&n.line===currentTextDocument.lineCount-1)return}return i}return e.getDefinitionAndBoundSpan(t,o)},o}function create(e){let t=e.project;if(t&&(t.kind===hx.HXProjectKind.UniApp||t.kind===hx.HXProjectKind.UniApp_Cli)){const n=createDocumentProvider(t,e.tsinfo.languageServiceHost,e.ts),r=(0,documents_1.createLanguageServiceHost)(n,t,e),o=e.ts.createLanguageService2(e,r,e.ts.createDocumentRegistry(!1,t.fsPath));return proxyLanguageService(e.languageService,t,o,e)}return e.languageService}exports.uniCloudJQLTsServerPlugin={create:create};