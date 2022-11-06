"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.uniCloud=void 0;const fs=require("fs"),path=require("path"),vscode_uri_1=require("vscode-uri"),hx=require("../../../core"),core_1=require("../../../core"),documents_1=require("../../../core/out/base/documents"),utils_1=require("../../../utils/");function checkCallExpression(e,t,i,n,o,r,s){var l;if(isUniCloudImportObjectExpression(n.expression,i,r)&&n.arguments.length>=1&&r.isStringLiteralLike(n.arguments[0])){let o,s=n.arguments[0].text;if((0,utils_1.getAllCloudFunctions)(e.project.fsPath).forEach((e=>{e.name==s&&fs.existsSync(path.join(e.path,"index.obj.js"))&&(o=path.join(e.path,"index.obj.js"))})),o){let n=null===(l=e.languageService.getProgram())||void 0===l?void 0:l.getSourceFile(o);n||(n=r.createSourceFile(o,hx.readFileToString(o),r.ScriptTarget.Latest),i.bindSourceFile(n,t));let s=i.getSymbolOfNode(n);if(s){const e=i.resolveExternalModuleSymbol(s);if(e)return i.getTypeOfSymbol(e)}}}}function isUniCloudImportObjectExpression(e,t,i){var n,o;if(e.kind!==i.SyntaxKind.PropertyAccessExpression)return!1;let r=e,s=r.expression;if("importObject"!==(null===(n=r.name)||void 0===n?void 0:n.text))return!1;let l=t.getSymbolAtLocation(s);if(l){let e=t.getTypeOfSymbol(l);if("UniCloud"==(null===(o=null==e?void 0:e.symbol)||void 0===o?void 0:o.escapedName))return!0}return!1}function getType(e,t,i,n){let o=i.getSymbolsInScope(t,n.SymbolFlags.Type).find((t=>t.escapedName===e));if(o)return i.getDeclaredTypeOfSymbol(o)}function createDocumentProvider(e,t,i,n){if(e&&t)return{get version(){return t.getProjectVersion()},getDefaultLibs:e=>[],compilerOptions:{allowNonTsExtensions:!0,allowJs:!0,lib:["lib.esnext.d.ts"],target:n.ScriptTarget.Latest,moduleResolution:n.ModuleResolutionKind.NodeJs,experimentalDecorators:!1},get documents(){let o=i;return t.getScriptFileNames().forEach((t=>{e.isProjectOf(t,n)&&o.push(t)})),o},getDocumentSnapshot(e){let i=vscode_uri_1.URI.parse(hx.toNormalizedUri(e,n));return t.getScriptSnapshot(i.fsPath)},hasDocument(e){let i=vscode_uri_1.URI.parse(hx.toNormalizedUri(e,n));return t.fileExists(i.fsPath)},getDocumentVersion(e){let i=vscode_uri_1.URI.parse(hx.toNormalizedUri(e,n));return t.getScriptVersion(i.fsPath)},resolveModuleNameOverride(e,t,i,o,r,s,l,a){if(isUnicloudSource(e,i,n)){let o,r=hx.toNormalizedPath(i,n),s=path.dirname(r),l=10;for(;l>0&&isUnicloudSource(e,s,n)&&fs.existsSync(s);){l--;let e=path.join(s,"package.json");if(fs.existsSync(e)){let i=fs.readFileSync(e).toString();try{let e=JSON.parse(i);if(e&&e.dependencies&&e.dependencies[t]){let i=e.dependencies[t];if(i.startsWith("file:")){let e=path.resolve(s,i.substring(5));if(fs.existsSync(path.join(e,"package.json"))){let t=fs.readFileSync(path.join(e,"package.json")).toString(),i=JSON.parse(t);if(i&&i.types){let t=path.resolve(e,i.types);fs.existsSync(t)&&(o={isExternalLibraryImport:!0,resolvedFileName:t})}else if(i&&i.main){o={isExternalLibraryImport:!0,resolvedFileName:path.resolve(e,i.main)}}}}}}catch(e){}break}s=path.dirname(s)}return o}return(0,core_1.resolveModuleName)(n,e,t,i,o,r,s,l,a)}}}function getUnicloudServerLibs(){let e=[],t=hx.getExtensionRootPath();return e.push(...(0,documents_1.getNodeLibs)(t,[])),e.push(path.join(t,"builtin-dts","node_modules","@dcloudio","types","uni-cloud-server.d.ts")),e}function isUnicloudSource(e,t,i){if(e.kind!=hx.HXProjectKind.UniApp&&e.kind!=hx.HXProjectKind.UniApp_Cli)return!1;const n=hx.toNormalizedUri(t,i);let o=vscode_uri_1.URI.parse(n).fsPath,r=path.relative(e.fsPath.toLowerCase(),o.toLowerCase());r&&(r=hx.toNormalizedPath(r,i));let s=o.endsWith(".jql");return/^unicloud-(tcb|aliyun)\/|^uni_modules\/.*\/unicloud\//.test(r)&&!s}function getExternalFiles(e,t){return!e||e.kind!=hx.HXProjectKind.UniApp&&e.kind!=hx.HXProjectKind.UniApp_Cli?[]:getUnicloudServerLibs()}function create(e){let t=e.project;if(t&&t&&(t.kind==hx.HXProjectKind.UniApp||t.kind==hx.HXProjectKind.UniApp_Cli)){const i=e.languageService,n=Object.create(null);for(let e of Object.keys(i)){const t=i[e];n[e]=(...e)=>t.apply(i,e)}let o=getUnicloudServerLibs();const r=createDocumentProvider(t,e.tsinfo.languageServiceHost,o,e.ts),s=(0,documents_1.createLanguageServiceHost)(r,t,e);let l=e.ts.createLanguageService2(e,s,t.documentRegistry);return n.getDefinitionAtPosition=(n,o)=>isUnicloudSource(t,n,e.ts)?l.getDefinitionAtPosition(n,o):i.getDefinitionAtPosition(n,o),n.getDefinitionAndBoundSpan=(n,o)=>isUnicloudSource(t,n,e.ts)?l.getDefinitionAndBoundSpan(n,o):i.getDefinitionAndBoundSpan(n,o),n.getTypeDefinitionAtPosition=(n,o)=>isUnicloudSource(t,n,e.ts)?l.getTypeDefinitionAtPosition(n,o):i.getTypeDefinitionAtPosition(n,o),n.getQuickInfoAtPosition=(n,o)=>isUnicloudSource(t,n,e.ts)?l.getQuickInfoAtPosition(n,o):i.getQuickInfoAtPosition(n,o),n.getCompletionEntryDetails=(n,o,r,s,a,u,c)=>isUnicloudSource(t,n,e.ts)?l.getCompletionEntryDetails(n,o,r,s,a,u,c):i.getCompletionEntryDetails(n,o,r,s,a,u,c),n.getCompletionsAtPosition=(n,o,r)=>isUnicloudSource(t,n,e.ts)?l.getCompletionsAtPosition(n,o,r):i.getCompletionsAtPosition(n,o,r),n}return e.languageService}function createTypeCheckerPlugins(e){let t=e.project;return!t||t.kind!=hx.HXProjectKind.UniApp&&t.kind!=hx.HXProjectKind.UniApp_Cli?[]:[{checkExpression:function(t,i,n,o,r,s){var l,a,u,c;const d=o.kind;if(d===e.ts.SyntaxKind.Identifier){let t=o,i=n.getResolvedSymbol(t);if(i&&i.valueDeclaration){let t=i.valueDeclaration;if((null===(l=t.parent)||void 0===l?void 0:l.kind)===e.ts.SyntaxKind.CatchClause&&(null===(u=null===(a=t.parent)||void 0===a?void 0:a.parent)||void 0===u?void 0:u.kind)===e.ts.SyntaxKind.TryStatement){let i=t.parent.parent.tryBlock.statements;if(i&&i.length>0){let t=n.getSymbolsInScope(i[0],e.ts.SymbolFlags.Variable);for(let r=0;r<i.length;r++){let s=i[r],l=/(\w+)\.(\w+)\s*\(/.exec(s.getText());if(l){let r=l[1],s=t.find((e=>e.escapedName===r));if(s&&s.valueDeclaration&&s.valueDeclaration.getText().indexOf(".importObject(")>=0){let t=n.getSymbolsInScope(i[0],e.ts.SymbolFlags.Namespace).find((e=>"UniCloud"===e.escapedName||"UniCloudNamespace"===e.escapedName));if(!t)return getType("Error",o,n,e.ts);let r=null===(c=t.exports)||void 0===c?void 0:c.get("UniCloudError");if(r)return n.getDeclaredTypeOfSymbol(r)}}}}return getType("Error",o,n,e.ts)}}}else if(d===e.ts.SyntaxKind.PropertyAccessExpression){if(isUniCloudImportObjectExpression(o,n,e.ts)&&o.parent.kind===e.ts.SyntaxKind.CallExpression){let t=n.defaultCheckExpression(o,r,s),l=n.getSignaturesOfType(t,e.ts.SignatureKind.Call);return l&&l.forEach((t=>{t.resolvedReturnType=checkCallExpression(e,i,n,o.parent,r,e.ts,s)})),t}}else if(d===e.ts.SyntaxKind.CallExpression){return checkCallExpression(e,i,n,o,r,e.ts,s)}},collectCustomModuleReferences(t,i,n){let o=[];for(var r=/uniCloud\.importObject/g;r.exec(n.text);){var s=e.ts.getTokenAtPosition(n,r.lastIndex);if(s.kind!==e.ts.SyntaxKind.CallExpression)continue;const{expression:i,arguments:l}=s;if("uniCloud.importObject"===i.getText(n)&&l.length>0&&e.ts.isStringLiteralLike(l[0])){let i,n=l[0].text;(0,utils_1.getAllCloudFunctions)(t.fsPath).forEach((e=>{e.name==n&&fs.existsSync(path.join(e.path,"index.obj.js"))&&(i=path.join(e.path,"index.obj.js"))})),i&&o.push(e.ts.createStringLiteral(i))}}return o}}]}var uniCloud;!function(e){e.uniCloudPlugin={create:create,getExternalFiles:getExternalFiles,createTypeCheckerPlugins:createTypeCheckerPlugins}}(uniCloud=exports.uniCloud||(exports.uniCloud={}));