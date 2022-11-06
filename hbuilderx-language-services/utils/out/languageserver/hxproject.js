"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.hx=void 0;const fs=require("fs"),path=require("path"),ts=require("typescript/lib/tsserverlibrary"),vscode_languageserver_1=require("vscode-languageserver"),vscode_uri_1=require("vscode-uri"),indexlib_1=require("../../../indexlib"),type_resolve_1=require("../common/type-resolve"),vueVersion_1=require("../vueParse/vueVersion"),hxPluginCreateFactory_1=require("./hxPluginCreateFactory"),languageServiceProxy_1=require("./languageServiceProxy"),uniCloudTypeHelper_1=require("./uniCloudTypeHelper"),vueOptionTsServerPlugin_1=require("./vueOptionTsServerPlugin"),vueRefTypeHelper_1=require("./vueRefTypeHelper"),vue=require("./vueService"),baseTypes=["Array","String","Number","Boolean","Symbol","Object"];var hx;!function(e){function t(e,t,i,n,s,o,r,l,a){let d={};if(o&&(0,type_resolve_1.isObjectLiteralKey)(o,n)){if(t){let u={title:"Suggest",command:"editor.action.triggerSnippet",arguments:["_object_func_callback_method.js","_object_func_callback.js","_object_func_callback_arrow.js","_object_property_callback.js"]},p=/\s*(UniNamespace|UniApp)\.(.*)Options\s*/,c=/\s*(UniCloudNamespace|UniCloud)\.(.*)Options\s*/,f=t.search(p),g=t.search(c);if(/UniNamespace\.(.*)Options\.(.*):\s*\((.*)\)\s*=>\s*/.test(t))d.command=u;else if(!i||(i!=vscode_languageserver_1.CompletionItemKind.Function&&i!=vscode_languageserver_1.CompletionItemKind.Method||r)&&(2!=i&&1!=i||!r))if(-1!==f||-1!==g){if(l==vscode_languageserver_1.InsertTextFormat.PlainText||r){let{isInString:t,flag:i}=(0,type_resolve_1.isStringLiteral)(o,n);s?(t?(s.newText=`${i}${e}${i}:$0`,s.range={start:{line:s.range.start.line,character:s.range.start.character-1},end:{line:s.range.end.line,character:s.range.end.character+1}}):s.newText=`${e}:$0`,d.textEdit=s):d.insertText=`${e}:$0`}d.command={title:"Suggest",command:"editor.action.triggerSuggest"},r||(d.insertTextFormat=vscode_languageserver_1.InsertTextFormat.Snippet)}else a&&a.startsWith("hxHtmlFlag")&&!e.startsWith("@")&&(d.textEdit=s);else d.command=u}}else if(t&&/Uni\.(.*)\(options\s*:\s*(UniNamespace|UniApp)\.(.*)Options\s*\)/.test(t)||/UniCloud\.(.*)\(options\s*:\s*(UniCloudNamespace|UniCloud)\.(.*)Options\s*\)/.test(t))(l==vscode_languageserver_1.InsertTextFormat.PlainText||r)&&((0,type_resolve_1.isFollowedBy)(o,n-1,ts.SyntaxKind.OpenParenToken)||(s?(d.textEdit=s,d.textEdit.newText=`${e}({\n\t$0\n})`):d.insertText=`${e}({\n\t$0\n})`,d.command={title:"Suggest",command:"editor.action.triggerSuggest"},r||(d.insertTextFormat=vscode_languageserver_1.InsertTextFormat.Snippet)));else if(!i||i!=vscode_languageserver_1.CompletionItemKind.Function&&i!=vscode_languageserver_1.CompletionItemKind.Method)a&&a.startsWith("hxHtmlFlag")&&!e.startsWith("@")&&(d.textEdit=s);else if((0,type_resolve_1.isImportElement)(o,n)||(0,type_resolve_1.isFollowedBy)(o,n-1,ts.SyntaxKind.OpenParenToken))(l==vscode_languageserver_1.InsertTextFormat.PlainText||r)&&(s?(d.textEdit=s,d.textEdit.newText=e):d.insertText=e);else if(l==vscode_languageserver_1.InsertTextFormat.PlainText||r){let t=e;t=t.replace(/\$/g,"\\$");let i=`${t}($1)$0`;s?(d.textEdit=s,d.textEdit.newText=i):d.insertText=i,r||(d.insertTextFormat=vscode_languageserver_1.InsertTextFormat.Snippet)}return d}function i(){return path.resolve(__dirname,"../../../")}function n(e){return ts.server.toNormalizedPath(e)}function s(e){if(e.startsWith("file:/")){let t=n(vscode_uri_1.URI.parse(e).fsPath);return vscode_uri_1.URI.file(t).toString()}let t=n(e);return vscode_uri_1.URI.file(t).toString()}let o;function r(e,t,i){const n=[vueOptionTsServerPlugin_1.default];for(let s of n)t=s.create({project:e,languageService:t,languageServiceHost:i});h(ts);const s=Object.create(null);for(let e of Object.keys(t)){const i=t[e];s[e]=(...e)=>i.apply(t,e)}return t=(0,languageServiceProxy_1.createTSLanguageServiceProxy)(t,e,null),s.getCompletionEntryDetails=(i,n,s,o,r,l,a)=>{let d=t.getProgram().getSourceFile(i);if(i.endsWith(".vue")||i.endsWith(".nvue")){let t=(0,type_resolve_1.findExportThisExpressionAtOffset)(d,n);if(t){let d=vue.getVueThisLangusgeService(e,t);if(d)return d.getCompletionEntryDetails(i,n,s,o,r,l,a)}}return t.getCompletionEntryDetails(i,n,s,o,r,l,a)},s.getCompletionsAtPosition=(i,n,s)=>{let o=t.getProgram().getSourceFile(i);if(i.endsWith(".vue")||i.endsWith(".nvue")){let r=(0,type_resolve_1.findExportThisExpressionAtOffset)(o,n);if(r){let o=vue.getVueThisLangusgeService(e,r);if(o){let e=o.getCompletionsAtPosition(i,n,s),r=new Set;null==e||e.entries.forEach((e=>{r.add(`${e.name}::${e.kind}`)}));let l=t.getCompletionsAtPosition(i,n,s);return e?(null==l||l.entries.forEach((t=>{r.has(`${t.name}::${t.kind}`)||e.entries.push(t)})),e):l}}}const r=t.getCompletionsAtPosition(i,n,s);if(i.endsWith(".html")||i.endsWith(".htm")){let t=vscode_uri_1.URI.file(e.sourceRoot),n=null===indexlib_1.IndexDataStore||void 0===indexlib_1.IndexDataStore?void 0:indexlib_1.IndexDataStore.load({uri:t.toString(),name:""}),s=null==n?void 0:n.indexData(i);if(s){let e=null==s?void 0:s.references.filter((e=>e.type==indexlib_1.ReferenceFileType.Script));for(let t of e){let e=vscode_uri_1.URI.parse(t.uri),i=null==e?void 0:e.fsPath;if(fs.existsSync(i)){let e=ts.createSourceFile("",fs.readFileSync(i).toLocaleString(),ts.ScriptTarget.Latest);null==e||e.forEachChild((e=>{var t,i;if(e.kind===ts.SyntaxKind.VariableStatement)for(let n of null===(i=null===(t=e)||void 0===t?void 0:t.declarationList)||void 0===i?void 0:i.declarations){if(n.kind===ts.SyntaxKind.VariableDeclaration){let e=n.name;if(e.kind===ts.SyntaxKind.Identifier){let t=e.escapedText.toString();r.entries.push({name:t,kind:ts.ScriptElementKind.variableElement,sortText:""})}}console.log(n)}else if(e.kind===ts.SyntaxKind.FunctionDeclaration){let t=e.name;if(t.kind===ts.SyntaxKind.Identifier){let e=t.escapedText.toString();r.entries.push({name:e,kind:ts.ScriptElementKind.functionElement,sortText:""})}}}))}}}}return r},s.getDefinitionAtPosition=(i,n)=>{let s=t.getProgram().getSourceFile(i);if(i.endsWith(".vue")||i.endsWith(".nvue")){let t=(0,type_resolve_1.findExportThisExpressionAtOffset)(s,n);if(t){let s=vue.getVueThisLangusgeService(e,t);if(s)return s.getDefinitionAtPosition(i,n)}}return t.getDefinitionAtPosition(i,n)},s.getDefinitionAndBoundSpan=(i,n)=>{let s=t.getProgram().getSourceFile(i);if(i.endsWith(".vue")||i.endsWith(".nvue")){let t=(0,type_resolve_1.findExportThisExpressionAtOffset)(s,n);if(t){let s=vue.getVueThisLangusgeService(e,t);if(s)return s.getDefinitionAndBoundSpan(i,n)}}if(i.endsWith(".html")||i.endsWith(".htm")){let t,o=vscode_uri_1.URI.file(e.sourceRoot),r=null===indexlib_1.IndexDataStore||void 0===indexlib_1.IndexDataStore?void 0:indexlib_1.IndexDataStore.load({uri:o.toString(),name:""}),l=null==r?void 0:r.indexData(i);if(l){let e=(0,type_resolve_1.getTokenAtPosition)(s,n),i=null==e?void 0:e.getText(),o=null==l?void 0:l.references.filter((e=>e.type==indexlib_1.ReferenceFileType.Script));for(let n of o){let s=vscode_uri_1.URI.parse(n.uri),o=null==s?void 0:s.fsPath;if(fs.existsSync(o)){let n=ts.createSourceFile("",fs.readFileSync(o).toLocaleString(),ts.ScriptTarget.Latest);null==n||n.forEachChild((n=>{var s,r;if(n.kind===ts.SyntaxKind.VariableStatement){for(let l of null===(r=null===(s=n)||void 0===s?void 0:s.declarationList)||void 0===r?void 0:r.declarations)if(l.kind===ts.SyntaxKind.VariableDeclaration){let n=l.name;if(n.kind===ts.SyntaxKind.Identifier){let s=n.escapedText.toString();if(i!=s)return!1;t={definitions:[{kind:ts.ScriptElementKind.unknown,name:"",containerKind:ts.ScriptElementKind.unknown,containerName:"",textSpan:{start:n.pos||0,length:0},fileName:o,contextSpan:{start:0,length:0}}],textSpan:{start:e.getStart(),length:i.length}}}}}else if(n.kind===ts.SyntaxKind.FunctionDeclaration){let s=n.name;if(s.kind===ts.SyntaxKind.Identifier){let n=s.escapedText.toString();if(i!=n)return!1;t={definitions:[{kind:ts.ScriptElementKind.unknown,name:"",containerKind:ts.ScriptElementKind.unknown,containerName:"",textSpan:{start:s.pos||0,length:i.length},fileName:o,contextSpan:{start:0,length:0}}],textSpan:{start:e.getStart(),length:i.length}}}}}))}}}if(t)return t}return t.getDefinitionAndBoundSpan(i,n)},s.getQuickInfoAtPosition=(i,n)=>{if(i.endsWith(".vue")||i.endsWith(".nvue")){let s=t.getProgram().getSourceFile(i),o=(0,type_resolve_1.findExportThisExpressionAtOffset)(s,n);if(o){let t=vue.getVueThisLangusgeService(e,o);if(t)return t.getQuickInfoAtPosition(i,n)}}return t.getQuickInfoAtPosition(i,n)},s}function l(t,i,s,r,l,d,u,p){let c,f=o.Web;t&&(f=t.kind),f!=o.UniApp&&f!=o.UniApp_Cli||i.startsWith("@/")&&(i=path.join(t.sourceRoot,i.substring(2)));let g=ts.resolveModuleName(i,s,r,l);if(g.resolvedModule)c=g.resolvedModule;else{let e=ts.nodeModuleNameResolver(i,s,r,l);e.resolvedModule&&(c=e.resolvedModule)}if(!c&&f===o.UniApp){let o=a(i,t.fsPath);if(o)c={isExternalLibraryImport:!0,resolvedFileName:o};else{let t=path.join(e.getExtensionRootPath(),"builtin-dts","index.js"),n=ts.nodeModuleNameResolver(i,t,r,l);n.resolvedModule&&(c=n.resolvedModule)}if(!c&&t.isUnicloudSource(s)){let e=n(s),o=path.dirname(e),r=10;for(;r>0&&t.isUnicloudSource(o)&&fs.existsSync(o);){r--;let e=path.join(o,"package.json");if(fs.existsSync(e)){let t=fs.readFileSync(e).toString();try{let e=JSON.parse(t);if(e&&e.dependencies&&e.dependencies[i]){let t=e.dependencies[i];if(t.startsWith("file:")){let e=path.resolve(o,t.substring(5));if(fs.existsSync(path.join(e,"package.json"))){let t=fs.readFileSync(path.join(e,"package.json")).toString(),i=JSON.parse(t);if(i&&i.types){let t=path.resolve(e,i.types);fs.existsSync(t)&&(c={isExternalLibraryImport:!0,resolvedFileName:t})}else if(i&&i.main){c={isExternalLibraryImport:!0,resolvedFileName:path.resolve(e,i.main)}}}}}}catch(e){}break}o=path.dirname(o)}}}return c}function a(e,t){let n=i();return{vuex:2===(0,vueVersion_1.vueVersion)(t)?path.join(n,"builtin-dts","node_modules","vuex","types","index.d.ts"):path.join(n,"builtin-dts","node_modules","vuex@4","types","index.d.ts"),"vue-router":path.join(n,"builtin-dts","node_modules","vue-router","types","index.d.ts"),vue:path.join(n,"builtin-dts","common","vue2And3.d.ts"),"@dcloudio/uni-app":path.join(n,"builtin-dts","node_modules","@dcloudio","uni-app","dist","uni-app.d.ts")}[e]}function d(e,t){let i=[],n=path.join(e,"builtin-dts","node_modules","node");return fs.readdirSync(n).forEach((e=>{let s=!0;t.forEach((t=>{e.includes(t)&&(s=!1)})),s&&e.endsWith(".d.ts")&&i.push(path.join(n,e))})),i}function u(e){let t=[],n=i();if(e.kind==o.UniApp)t.push(path.join(n,"builtin-dts","node_modules","vue","types","index.d.ts")),t.push(path.join(n,"builtin-dts","node_modules","vue@3","types","index.d.ts")),t.push(path.join(n,"builtin-dts","node_modules","vuex","types","index.d.ts")),t.push(path.join(n,"builtin-dts","node_modules","vue-router","types","index.d.ts")),t.push(path.join(n,"builtin-dts","node_modules","@dcloudio","types","index.d.ts")),t.push(path.join(n,"frameworkdts","wechat-miniprogram","index.d.ts"));else if(e.kind==o.App||e.kind==o.Wap2App)t.push(path.join(n,"builtin-dts","node_modules","@dcloudio","types","html5plus","plus.d.ts")),t.push(path.join(n,"builtin-dts","node_modules","jQuery","jquery.d.ts"));else if(e.kind==o.UniApp_Cli){let i=path.join(e.fsPath,"node_modules/@dcloudio/types/index.d.ts");fs.existsSync(i)&&t.push(i),t.push(path.join(n,"frameworkdts","wechat-miniprogram","index.d.ts"))}else e.kind==o.Web?t.push(path.join(n,"builtin-dts","node_modules","jQuery","jquery.d.ts")):e.kind==o.Extension&&(t.push(path.join(n,"builtin-dts","common","extension_js.d.ts")),t.push(...d(n,["globals.d.ts","index.d.ts"])));return t.push(path.join(n,"builtin-dts","node_modules","node","globals.d.ts")),t.push(path.join(n,"builtin-dts","common","lib.dom2.d.ts")),t}e.computeJSResolveData=t,e.resolveJSCompletionItem=function(e,i){var n;let s;(null===(n=e.data)||void 0===n?void 0:n.hxHtmlFlag)&&(s=e.data.hxHtmlFlag);let o=t(e.label,e.detail,e.kind,null==e?void 0:e.data.offset,e.textEdit,i,!1,e.insertTextFormat,s);return e.command=o.command,e.insertText=o.insertText,e.insertTextFormat=o.insertTextFormat,e.textEdit=o.textEdit,e},e.getExtensionRootPath=i,e.readFiletoString=function(e){return ts.sys.readFile(e)},e.toNormalizedPath=n,e.toNormalizedUri=s,function(e){e[e.UniApp=0]="UniApp",e[e.UniApp_Cli=1]="UniApp_Cli",e[e.Web=2]="Web",e[e.App=3]="App",e[e.Wap2App=4]="Wap2App",e[e.Extension=5]="Extension"}(o=e.HXProjectKind||(e.HXProjectKind={})),e.resolveModuleName=l,e.getBuiltinUniappModule=a,e.getUnicloudServerLibs=function(){let e=[],t=i();return e.push(path.join(t,"builtin-dts","node_modules","node","index.d.ts")),e.push(path.join(t,"builtin-dts","node_modules","@dcloudio","types","uni-cloud-server.d.ts")),e},e.getNodeLibs=d,e.getDefaultLibs=u;let p=new Map;const c=ts.createDocumentRegistry(!0,process.cwd());function f(e,t){const i=vscode_uri_1.URI.parse(e),a=function(e){let t=[{kind:o.UniApp_Cli,existsFiles:[["src/manifest.json"],["src/pages.json"],["src/App.vue","src/App.nvue"],["src/main.js","src/main.ts"]]},{kind:o.UniApp,existsFiles:[["manifest.json"],["pages.json"],["App.vue","App.nvue"],["main.js","main.ts"]]},{kind:o.Wap2App,existsFiles:[["manifest.json"],["sitemap.json"]]},{kind:o.App,existsFiles:[["manifest.json"]]},{kind:o.Extension,existsFiles:function(e){var t;if(fs.existsSync(path.join(e,"package.json"))){let i=require(path.join(e,"package.json"));if((null===(t=null==i?void 0:i.engines)||void 0===t?void 0:t.HBuilderX)&&(null==i?void 0:i.main)&&(null==i?void 0:i.contributes))return!0}return!1}}];for(let i of t){let t=i.kind,n=i.existsFiles,s=!0;if("function"==typeof n)s=n(e);else for(let t of n){let i=!1;for(let n of t)if(fs.existsSync(path.join(e,n))){i=!0;break}if(s=s&&i,!s)break}if(s)return t}return o.Web}(i.fsPath),d=a==o.UniApp_Cli?path.join(i.fsPath,"src"):i.fsPath,p=new Map;let f={kind:a,fsPath:i.fsPath,sourceRoot:d,onSettingsChanged(e){},isProjectOf(e){const t=s(e);let n=vscode_uri_1.URI.parse(t).fsPath;return!path.relative(i.fsPath.toLowerCase(),n.toLowerCase()).startsWith("..")},isUnicloudSource(e){if(a!=o.UniApp&&a!=o.UniApp_Cli)return!1;const t=s(e);let r=vscode_uri_1.URI.parse(t).fsPath,l=path.relative(i.fsPath.toLowerCase(),r.toLowerCase());l&&(l=n(l));let d=r.endsWith(".jql");return/^unicloud-(tcb|aliyun)\/|^uni_modules\/.*\/unicloud\//.test(l)&&!d},createTSLanguageService(e,n,d){if(p.has(e))return p.get(e);if(n&&d){let t=r(f,n,d);return p.set(e,t),t}const g=u(f);t&&g.push(...t);const h=e.compilerOptions;let m=path.dirname(ts.getDefaultLibFilePath(h));const v={getCompilationSettings:()=>(a!=o.UniApp&&a!=o.UniApp_Cli||(h.moduleResolution=ts.ModuleResolutionKind.NodeJs),h.checkExpressionOverride=(t,i,n,s)=>function(e,t,i,n,s,o,r){const l=[uniCloudTypeHelper_1.default,vueRefTypeHelper_1.default];r&&r.length>0&&l.push(...r);for(let r=0;r<l.length;r++){let a=l[r];try{if(!a||!a.checkExpression)continue;let r=a.checkExpression(e,t,i,n,s,o);if(r)return r}catch(e){console.error(e)}}}(f,h,t,i,n,s,e.typeCheckerPluigns),h.getContextualTypeOverride=(t,i,n)=>function(e,t,i,n,s,o){const r=[uniCloudTypeHelper_1.default,vueRefTypeHelper_1.default];o&&o.length>0&&r.push(...o);for(let o=0;o<r.length;o++){let l=r[o];try{if(!l||!l.getContextualType)continue;let o=l.getContextualType(e,t,i,n,s);if(o)return o}catch(e){console.error(e)}}}(f,h,t,i,n,e.typeCheckerPluigns),h),getScriptFileNames(){let t=[].concat(e.getDefaultLibs?e.getDefaultLibs(f):g);for(let i of e.documents)t.push(i);return t},getScriptKind(t){const i=s(t);return e.getDocumentKind?e.getDocumentKind(i):"ts"===t.substr(t.length-2)?ts.ScriptKind.TS:ts.ScriptKind.JS},getProjectVersion:()=>String(e.version),getScriptVersion(t){const i=s(t);return e.hasDocument(i)?e.getDocumentVersion(i):"1"},getScriptSnapshot(t){const i=s(t);if(e.hasDocument(i))return e.getDocumentSnapshot(i);let n="",o=vscode_uri_1.URI.parse(i).fsPath;return fs.existsSync(o)&&(n=fs.readFileSync(o).toString()),{getText:(e,t)=>n.substring(e,t),getLength:()=>n.length,getChangeRange:()=>{}}},getCurrentDirectory:()=>i.fsPath,getDefaultLibFileName:e=>e.lib&&e.lib.length>0?path.join(m,e.lib[0]):path.join(m,"lib.esnext.d.ts"),resolveModuleNames(t,i,n,o,r){const a=[];for(let n of t){let t,o={fileExists(t){const i=s(t),n=vscode_uri_1.URI.parse(i);return!!e.hasDocument(i)||fs.existsSync(n.fsPath)},readFile(t){const i=s(t);if(e.hasDocument(i)){let t=e.getDocumentSnapshot(i);return t.getText(0,t.getLength()-1)}const n=vscode_uri_1.URI.parse(i);return fs.readFileSync(n.fsPath).toString()}};e.resolveModuleNameOverride&&(t=e.resolveModuleNameOverride(f,n,i,h,o)),t||(t=l(f,n,i,h,o)),a.push(t)}return a}};let x=ts.createLanguageService(v,e.useGlobalDocumentRegistry?c:void 0,ts.LanguageServiceMode.Semantic),S=r(f,x,v);return p.set(e,S),S}};return f}function g(e){const t=s(e);if(p.has(t))return p.get(t);let i=f(t);return p.set(t,i),i}function h(e){if(e&&e.SymbolDisplay&&e.SymbolDisplay.getSymbolKind&&!e.SymbolDisplay.__overridedSymbolKind){let t=e.SymbolDisplay.getSymbolKind.bind(e.SymbolDisplay);e.SymbolDisplay.getSymbolKind=function(e,i,n){let s=e.getTypeOfSymbolAtLocation(i,n).getNonNullableType().getCallSignatures();return baseTypes.some((e=>e==i.escapedName))?"property":0!==s.length?"function":t(e,i,n)},e.SymbolDisplay.__overridedSymbolKind=!0}}e.createProject=f,e.getProject=g,e.getProjectByDocumentUri=function(e,t){for(let i of t){let t=i.uri;if(t.endsWith("/")||(t+="/"),e.startsWith(t))return g(i.uri)}},e.createTSServerPlugin=function(e){return(0,hxPluginCreateFactory_1.createPlugin)(e)},e.overrideSymbolKind=h}(hx=exports.hx||(exports.hx={}));