"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createTSLanguageServiceProxy=void 0;const fs=require("fs"),path=require("path"),ts=require("typescript"),vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),type_resolve_1=require("../common/type-resolve"),index_1=require("../specialTypes/index"),jql=require("./jqlService"),ParseUtil_1=require("./ParseUtil"),vueRouterParamsParser_1=require("./vueRouterParamsParser");function language(){return"zh_cn"}function getNlsFilePath(e){if("string"!=typeof e)return;let t=e.split("."),i=null,n=null;t.length>2&&(i=t[0],n=t[1]);let r=path.resolve(__dirname,"../../nls");if(i&&n){let e=path.join(r,language(),i,`${i}.${n}.js`);if(fs.existsSync(e))return e}}function translate(e,t){let i=require(e);if(i.hasOwnProperty(t))return i[t]}function translateText(e){let t=getNlsFilePath(e);if(t){let i=translate(t,e);i&&(e=i)}return e}function getSignatures(e,t,i){let n=[],r=ParseUtil_1.ParseUtil.getTypesAtLocation(t,i);return r&&r.length>0&&r.forEach((e=>{if("Document"===e){let e=t.parent;if((null==e?void 0:e.kind)===ts.SyntaxKind.CallExpression){let e=t.parent.expression.getChildAt(2);if(e&&e.kind===ts.SyntaxKind.Identifier){let t=e.escapedText;"getElementById"===t?n=["HBuilderX.IDString"]:"getElementByClassName"===t&&(n=["HBuilderX.ClassString"])}}}else"NodeRequire"===e?n=["HBuilderX.RequireCommonString"]:n.push(...r)})),Array.from(new Set(n))}function createTSLanguageServiceProxy(e,t,i){const n=Object.create(null);for(let t of Object.keys(e)){const i=e[t];n[t]=(...t)=>i.apply(e,t)}return n.getDefinitionAtPosition=(n,r)=>{let o=null;if(t&&t.isUnicloudSource&&i&&t.isUnicloudSource(n)&&(o=i.getDefinitionAtPosition(n,r)),n.endsWith(".jql")){let i=e.getProgram().getSourceFile(n);return jql.getJQLLanguageService(t,i.text).getDefinitionAtPosition(n,r)}if(o)return o;if(o=e.getDefinitionAtPosition(n,r),o&&o.length>0)return o;let l=e.getProgram().getSourceFile(n);const s=(0,type_resolve_1.getRelevantTokens)(r,l),a=s.previousToken,u=s.contextToken;if((0,type_resolve_1.isInString)(l,r,a)){let i=getSignatures(r,u,e);includeSpecialType(i)||(i=getSignatures(r,u,e));for(let o of i)if(index_1.specialTypes.has(o.trim())||index_1.specialTypes.has(`HBuilderX.${o.trim()}`)){const{line:i,character:l}=e.toLineColumnOffset(n,u.getStart()+1);return(0,index_1.gotoDefinition)(o.includes("HBuilderX.")?o.trim():`HBuilderX.${o.trim()}`,u.text,{workspaceFolder:t.fsPath,range:{start:{line:i,character:l},end:{line:i,character:l+u.getText().length}},offset:r-u.getStart()-1,token:u,fileName:n})}}return null},n.getDefinitionAndBoundSpan=(n,r)=>{let o=null;if(t&&t.isUnicloudSource&&i&&t.isUnicloudSource(n)&&(o=i.getDefinitionAndBoundSpan(n,r)),n.endsWith(".jql")){let i=e.getProgram().getSourceFile(n);return jql.getJQLLanguageService(t,i.text).getDefinitionAndBoundSpan(n,r)}if(o)return o;if(o=e.getDefinitionAndBoundSpan(n,r),o)return o;let l=e.getProgram().getSourceFile(n);const s=(0,type_resolve_1.getRelevantTokens)(r,l),a=s.previousToken,u=s.contextToken;if((0,type_resolve_1.isInString)(l,r,a)){let i=getSignatures(r,u,e);for(let o of i)if(index_1.specialTypes.has(o.trim())||index_1.specialTypes.has(`HBuilderX.${o.trim()}`)){const{line:i,character:l}=e.toLineColumnOffset(n,u.getStart()+1);return(0,index_1.gotoDefinition)(o.includes("HBuilderX.")?o.trim():`HBuilderX.${o.trim()}`,u.text,{workspaceFolder:t.fsPath,range:{start:{line:i,character:l},end:{line:i,character:l+u.getText().length}},offset:r-u.getStart()-1,token:u,fileName:n})}}return null},n.getTypeDefinitionAtPosition=(n,r)=>t&&t.isUnicloudSource&&i&&t.isUnicloudSource(n)?i.getTypeDefinitionAtPosition(n,r):e.getTypeDefinitionAtPosition(n,r),n.getQuickInfoAtPosition=(n,r)=>{let o=null;if(t&&t.isUnicloudSource&&i&&t.isUnicloudSource(n)&&(o=i.getQuickInfoAtPosition(n,r)),n.endsWith(".jql")){let i=e.getProgram().getSourceFile(n);return jql.getJQLLanguageService(t,i.text).getQuickInfoAtPosition(n,r)}if(o)return o;if(o=e.getQuickInfoAtPosition(n,r),o)return o;let l=e.getProgram().getSourceFile(n);const s=(0,type_resolve_1.getRelevantTokens)(r,l),a=s.previousToken,u=s.contextToken;if((0,type_resolve_1.isInString)(l,r,a)){let i,o=getSignatures(r,u,e);for(let l of o)if(index_1.specialTypes.has(l.trim())||index_1.specialTypes.has(`HBuilderX.${l.trim()}`)){const{line:o,character:s}=e.toLineColumnOffset(n,u.getStart()+1);i=(0,index_1.doHover)(l.includes("HBuilderX.")?l.trim():`HBuilderX.${l.trim()}`,u.text,{workspaceFolder:t.fsPath,range:{start:{line:o,character:s},end:{line:o,character:s+u.getText().length}},offset:r-u.getStart()-1,token:u,fileName:n})}if(i)return i}let c=ts.displayPartsToString(null==o?void 0:o.documentation);return o&&(o.documentation=[{kind:"text",text:translateText(c)}]),o},n.getCompletionEntryDetails=(n,r,o,l,s,a,u)=>{if(t&&t.isUnicloudSource&&i&&t.isUnicloudSource(n))return i.getCompletionEntryDetails(n,r,o,l,s,a,u);if(n.endsWith(".jql")){let i=e.getProgram().getSourceFile(n);return jql.getJQLLanguageService(t,i.text).getCompletionEntryDetails(n,r,o,l,s,a,u)}let c=e.getCompletionEntryDetails(n,r,o,l,s,a,u),g=ts.displayPartsToString(null==c?void 0:c.documentation);return c&&(c.documentation=[{kind:"text",text:translateText(g)}]),c},n.getCompletionsAtPosition=(n,r,o)=>{let l=null;if(t&&t.isUnicloudSource&&i&&t.isUnicloudSource(n)&&(l=i.getCompletionsAtPosition(n,r,o)),n.endsWith(".jql")){let i=e.getProgram().getSourceFile(n);return jql.getJQLLanguageService(t,i.text).getCompletionsAtPosition(n,r,o)}if(l)return l;if(l=e.getCompletionsAtPosition(n,r,o),!l)return;let s=e.getProgram().getSourceFile(n);const a=(0,type_resolve_1.getRelevantTokens)(r,s),u=a.previousToken,c=a.contextToken;if((0,type_resolve_1.isInString)(s,r,u)){const i=u.getStart(s),o=u.getEnd();let a={};l.entries.forEach((e=>{a[e.name]=!0}));let g=ParseUtil_1.ParseUtil.getParamTypes(n,r,e);includeSpecialType(g)||(g=getSignatures(r,c,e));for(let e of g)if(index_1.specialTypes.has(e.trim())||index_1.specialTypes.has(`HBuilderX.${e.trim()}`)){let u=vscode_languageserver_textdocument_1.TextDocument.create(n,n.endsWith(".html")||n.endsWith(".htm")?"html":"typescript",1,s.text),c=u.positionAt(r),g=u.positionAt(i+1),d=u.positionAt(o-1),p=vscode_languageserver_protocol_1.Range.create(g,d),f=(0,index_1.doComplete)([e.includes("HBuilderX.")?e.trim():`HBuilderX.${e.trim()}`],c,u,{workspaceFolder:null==t?void 0:t.fsPath,sourceFile:s,pos:r,replaceRange:p});null==f||f.forEach((e=>{var t,i,n,r;let o=e;if(a[e.label])return;const s=null!==(t=e.insertText)&&void 0!==t?t:void 0,u=null!==(n=null===(i=o.textEdit)||void 0===i?void 0:i.range)&&void 0!==n?n:void 0;l.entries.push({name:e.label,kind:convertKind(e.kind)?convertKind(e.kind):ts.ScriptElementKind.string,sortText:null!==(r=e.sortText)&&void 0!==r?r:e.label,insertText:s,detail:e.detail,documentation:e.documentation,replaceRange:u})}))}}else{getSignatures(r,c,e).includes("VueRouterParams")&&l&&l.entries.unshift(...(0,vueRouterParamsParser_1.getVueRouterParamsCompletions)(null==t?void 0:t.fsPath))}let g=JSON.parse(JSON.stringify(l.entries));return g.forEach((e=>{var t;if("class"==e.kind&&(e.kind="property"),("async"===e.name||"await"===e.name)&&(null===(t=a.previousToken)||void 0===t?void 0:t.kind)&&a.previousToken.kind===ts.SyntaxKind.Identifier){let t=a.previousToken;if(t.escapedText){let i=t.escapedText.length-(a.previousToken.end-r),n=t.escapedText;n=n.substring(i),""!==n&&(e.kindModifiers="Snippet",e.insertText=e.name+"$0 "+n)}}})),l.entries=g,l},n}function convertKind(e){return e===vscode_languageserver_protocol_1.CompletionItemKind.File?"file":e===vscode_languageserver_protocol_1.CompletionItemKind.Folder?"folder":""}function includeSpecialType(e){for(let t of e)if(index_1.specialTypes.has(t.trim())||index_1.specialTypes.has(`HBuilderX.${t.trim()}`))return!0;return!1}exports.createTSLanguageServiceProxy=createTSLanguageServiceProxy;