"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,i,r){void 0===r&&(r=i),Object.defineProperty(e,r,{enumerable:!0,get:function(){return t[i]}})}:function(e,t,i,r){void 0===r&&(r=i),e[r]=t[i]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)"default"!==i&&Object.prototype.hasOwnProperty.call(e,i)&&__createBinding(t,e,i);return __setModuleDefault(t,e),t};Object.defineProperty(exports,"__esModule",{value:!0}),exports.virtualToRealityFromRange=exports.TsServerVuePlugin=void 0;const core_1=require("../../core"),server_1=require("../../htmlservice/server"),VueScriptCache_1=require("./VueScriptCache"),path=__importStar(require("path")),vscode_css_languageservice_1=require("vscode-css-languageservice"),vscode_html_languageservice_1=require("vscode-html-languageservice"),vscode_uri_1=require("vscode-uri"),styleservice_1=require("../../styleservice"),uniapp_1=require("../../uniapp"),vue_typescript_1=require("../packages/vue-typescript"),HTMLServerVuePlugin_1=require("./HTMLServerVuePlugin"),unicloudDbVuePlugin_1=require("./LspVuePlugin/unicloudDbVuePlugin"),VueAdditionalPlugin_1=require("./LspVuePlugin/VueAdditionalPlugin"),VueTsHtmlEmbedMode_1=require("./TsServerVuePluginModes/VueTsHtmlEmbedMode"),VueTsJavaScriptEmbedMode_1=require("./TsServerVuePluginModes/VueTsJavaScriptEmbedMode"),VueTsStyleEmbedMode_1=require("./TsServerVuePluginModes/VueTsStyleEmbedMode"),VueDataProvider_1=require("./VueDataProvider"),vueTypeCheckerHelper_1=require("./vueTypeCheckerHelper");function isVueFile(e){return e.endsWith(".vue")||e.endsWith(".nvue")||e.endsWith(".swan")||e.endsWith(".axml")||e.endsWith(".ttml")||e.endsWith(".qml")||e.endsWith(".nml")||e.endsWith(".ux")}function virtualToRealityFromRange(e,t){let i;if(!t)return i;let r=e.getSourceRange(t.start,t.start+t.length);return r||(r=e.getSourceRange(t.start),r&&(r[0].end=r[0].start+t.length)),r?(i={start:r[0].start,length:r[0].end-r[0].start},i):i}function create(e){var t,i;let r=e.languageService,n=Object.create(null);for(let e of Object.keys(r)){const t=r[e];n[e]=(...e)=>t.apply(r,e)}let a=e.tsinfo.languageServiceHost;const s=a.getScriptKind.bind(a),l=a.getScriptSnapshot.bind(a),o=null===(t=a.resolveModuleNames)||void 0===t?void 0:t.bind(a),u=a.getCompilationSettings.bind(a),c=a.fileExists.bind(a),p=a.getScriptVersion.bind(a),f=(null===(i=a.readFile)||void 0===i||i.bind(a),a.getScriptFileNames.bind(a)),d=new Map;let g=!(e.project.kind===core_1.HXProjectKind.UniApp||e.project.kind===core_1.HXProjectKind.UniApp_Cli),m=(0,core_1.getExtensionRootPath)(),v=path.join(m,"htmlservice","server","data"),h=[],S=[new VueDataProvider_1.VueDataProvider(e.project,"uni_vue",path.join(v,"uni_vue_tag.json")),new VueDataProvider_1.NVueDataProvider(e.project,"uni_nvue",path.join(v,"uni_nvue_html.json")),new VueDataProvider_1.VueBaseDataProvider(e.project,"vue2-base",path.join(v,"vue_html.json")),new VueDataProvider_1.VueBaseDataProvider(e.project,"vue3-base",path.join(v,"vue3_html.json"))];h.push(...S),e.project.kind!==core_1.HXProjectKind.UniApp&&e.project.kind!=core_1.HXProjectKind.UniApp_Cli&&h.push(new server_1.HTMLDataProvider("html5",server_1.htmlData));const _=new VueScriptCache_1.VueScriptCache(e.ts,{getScriptVersion:p,getScriptSnapshot:l,getCompilationSettings:u,getUserPreferences:()=>e.tsinfo.project.projectService.getHostPreferences()});let b=(0,server_1.enablePluginProxy)({languageService:(0,vscode_html_languageservice_1.getLanguageService)({}),project:e.project}),y=[];y.push(new server_1.HTMLIdAndClassPlugin(e,new VueDataProvider_1.VueIdClassProvider(_))),y.push(new HTMLServerVuePlugin_1.HTMLServerVuePlugin(e,h)),y.push(new server_1.HTMLAdditionalPlugin(e,h)),y.push(new VueAdditionalPlugin_1.VueAdditionalPlugin(e,h)),y.push(new unicloudDbVuePlugin_1.UnicloudDbVuePlugin(e)),y.forEach((t=>{b=t.create({languageService:b,project:e.project})}));let T=(0,server_1.getVeturDataProviders)(vscode_uri_1.URI.file(e.project.fsPath).toString());h.push(...T),b.setDataProviders(g,h),e.ts.sys.watchFile&&e.ts.sys.watchFile(path.join(e.project.fsPath,"package.json"),((t,i)=>{h.splice(0,h.length),h.push(...S);let r=(0,server_1.getVeturDataProviders)(vscode_uri_1.URI.file(e.project.fsPath).toString());h.push(...r),b.setDataProviders(g,h)}),2e3),d.set("javascript",new VueTsJavaScriptEmbedMode_1.VueTsJavaScriptEmbedMode(e,_)),d.set("html",new VueTsHtmlEmbedMode_1.VueTsHtmlEmbedMode(e,_,b,h));let F=new Map;F.set("css",(0,vscode_css_languageservice_1.getCSSLanguageService)()),F.set("scss",(0,vscode_css_languageservice_1.getSCSSLanguageService)()),F.set("less",(0,vscode_css_languageservice_1.getLESSLanguageService)());let P=[new styleservice_1.CSSDataProvider(styleservice_1.cssData)],V=new Map;F.forEach(((e,t)=>{e.setDataProviders(!1,P),V.set(t,P)}));let j=(0,styleservice_1.styleEnablePluginProxy)({styleLanguageServiceList:F,project:e.project});function x(e){let t=function(e){let t;switch(path.extname(e)){case".html":t="html";break;case".css":case".scss":case".less":case".stylus":t="style";break;case".js":case".jsx":case".ts":case".tsx":t="javascript"}return t}(e);if(t)return d.get(t)}return F=new styleservice_1.StyleExtraPluginModule(e,V,h).create({styleLanguageServiceList:j,project:e.project}),d.set("style",new VueTsStyleEmbedMode_1.VueTsStyleEmbedMode(e,_,j)),function(){const t=e.tsinfo.serverHost.readFile.bind(e.tsinfo.serverHost),i=e.tsinfo.serverHost.fileExists.bind(e.tsinfo.serverHost);e.tsinfo.serverHost.readFile=function(e,i){if(_.hasEmbeddedFile(e)){let t=_.getEmbeddedFile(e);if(t)return t.file.content}else if(e.endsWith(vue_typescript_1.localTypes.typesFileName))return vue_typescript_1.localTypes.getTypesCode(2);return t(e,i)},e.tsinfo.serverHost.fileExists=function(e){return!!i(e)||(!!e.endsWith(vue_typescript_1.localTypes.typesFileName)||_.hasEmbeddedFile(e))}}(),a.resolveModuleNames=(t,i,r,n,s,l)=>function(t,i,r,n,s,l){let u=[];t.forEach((e=>u.push(void 0))),o&&(u=o(t,i,r,n,s,l));let c={fileExists:e=>a.fileExists(e),readFile:e=>a.readFile(e)};for(var p=0;p<t.length;p++){let r=t[p],n=u[p];if(e.project.kind===core_1.HXProjectKind.UniApp){let t=(0,core_1.getBuiltinUniappModule)(r,e.project);if(t){let e=!0;if(n){let t=(0,core_1.getExtensionRootPath)(),i=path.relative(t,n.resolvedFileName);i&&!path.isAbsolute(i)&&i.startsWith("builtin-dts")&&(e=!1)}e&&(n={isExternalLibraryImport:!0,resolvedFileName:t})}}if(!n){e.project.kind!=core_1.HXProjectKind.UniApp&&e.project.kind!=core_1.HXProjectKind.UniApp_Cli||r.startsWith("@/")&&(r=path.join(e.project.sourceRoot,r.substring(2)));let t=path.resolve(path.dirname(i),r),a=[t,t+".vue"];for(let e of a){let i;if(isVueFile(e)&&c.fileExists(e)){let t=_.getUpToDateInfo(e);if(t){let r=[".ts",".js"];for(let n of r){let r=t.getEmbedFile(e+n);if(r){i=r.file.fileName;break}}}}if(i){t=i;break}}if((_.hasEmbeddedFile(t)||t.endsWith(vue_typescript_1.localTypes.typesFileName))&&(n={isExternalLibraryImport:!1,resolvedFileName:t}),!n){let t=path.join((0,core_1.getExtensionRootPath)(),"builtin-dts","index.js"),i=e.ts.nodeModuleNameResolver(r,t,s,c);i.resolvedModule&&(n=i.resolvedModule)}}u[p]=n}return u}(t,i,r,n,s,l),a.getScriptFileNames=function(){let e=[],t=f();t&&e.push(...t),e.forEach((e=>{isVueFile(e)&&_.getUpToDateInfo(e)}));let i=[],r=_.allSourceFiles;for(let t of r){e.indexOf(t.fileName)<0&&i.push(t.fileName);let r=path.join(path.dirname(t.fileName),vue_typescript_1.localTypes.typesFileName);e.indexOf(r)<0&&i.indexOf(r)<0&&i.push(r);let n=t.getAllEmbeddeds();for(let e of n)i.push(e.file.fileName)}return e.push(...i),e},a.fileExists=function(e){return!!c(e)||(!!e.endsWith(vue_typescript_1.localTypes.typesFileName)||_.hasEmbeddedFile(e))},a.getScriptVersion=function(e){return isVueFile(e)&&_.getUpToDateInfo(e),_.hasEmbeddedFile(e)?_.getScriptVersion(e):p(e)},a.getScriptKind=function(e){return isVueFile(e)&&_.getUpToDateInfo(e),s(e)},a.getScriptSnapshot=function(t){if(isVueFile(t)&&_.getUpToDateInfo(t),t.endsWith(vue_typescript_1.localTypes.typesFileName)){let i=e.tsinfo.serverHost.readFile(t);return e.ts.ScriptSnapshot.fromString(i)}if(_.hasEmbeddedFile(t)){if(t.endsWith(".html"))return l(t);let i=e.tsinfo.serverHost.readFile(t);return e.ts.ScriptSnapshot.fromString(i)}return l(t)},n=function(t){const i=Object.create(null);for(let e of Object.keys(t)){const r=t[e];i[e]=(...e)=>r.apply(t,e)}return i.getCompletionsAtPosition=function(i,r,n){if(isVueFile(i)){let s;if(!e.tsinfo.project.getScriptInfo(i))return s;let l=_.getUpToDateInfo(i);if(!l)return s;let o=l.sourceFile.getAllEmbeddeds();for(var a=0;a<o.length;a++){let e=o[a].sourceMap,i=o[a].file;if(!1===i.capabilities.completions)continue;let l=e.getMappedRange(r);if(i&&l&&l[1].capabilities.completion){let r=x(i.fileName);if(r){if(s=r.getCompletionsAtPosition(t,i.fileName,l[0].start,n),!s)return;let a,o;return s.entries.forEach((t=>{a?((0,core_1.isSameTextSpan)(a,t.replacementSpan)||(a=t.replacementSpan,o=virtualToRealityFromRange(e,t.replacementSpan)),t.replacementSpan=o):(a=t.replacementSpan,o=virtualToRealityFromRange(e,t.replacementSpan),t.replacementSpan=o)})),s}}}return s}return t.getCompletionsAtPosition(i,r,n)},i.getCompletionEntryDetails=function(i,r,n,a,s,l,o){if(isVueFile(i)){let c;if(!e.tsinfo.project.getScriptInfo(i))return c;let p=_.getUpToDateInfo(i);if(!p)return c;let f=p.sourceFile.getAllEmbeddeds();for(var u=0;u<f.length;u++){let i=f[u].sourceMap,p=f[u].file;if(!1===p.capabilities.completions)continue;let d=i.getMappedRange(r);if(p&&d&&d[1].capabilities.completion){let i=x(p.fileName);if(i){if(c=i.getCompletionEntryDetails(t,p.fileName,d[0].start,n,a,s,l,o),null==c?void 0:c.codeActions){c.codeActions=c.codeActions.map((e=>{let t=e.changes.map((e=>{let t=_.getEmbeddedFileInfo(e.fileName);if(t&&t.file){return{isNewFile:!1,fileName:t.host.fileName,textChanges:e.textChanges.map((e=>{let i=e.newText;return i.toLowerCase().indexOf("vue2and3")>0&&(i=i.replace(/(['"]{1}).*(['"]{1})/,'"vue"')),0===e.span.start&&(i="\n"+i.trimRight()),{newText:i,span:virtualToRealityFromRange(t.file.sourceMap,e.span)}}))}}return e}));return{...e,changes:t}})),e.ts.displayPartsToString(c.sourceDisplay).toLowerCase().indexOf("vue2and3")>0&&(c.source=c.sourceDisplay=[{kind:"text",text:"vue"}])}return c}}}return c}return t.getCompletionEntryDetails(i,r,n,a,s,l,o)},i.getNavigationTree=function(i){if(isVueFile(i)){let t={text:"",kind:e.ts.ScriptElementKind.alias,kindModifiers:"",spans:[],nameSpan:void 0};if(!e.tsinfo.project.getScriptInfo(i))return t;if(!_.getUpToDateInfo(i))return t;let r=_.getEmbeddedFileInfo(i+".html");if(!r)return t;if(e.html){return e.html.getNavigationTree(r.file.file.fileName)}}return t.getNavigationTree(i)},i}(n),n=function(t){const i=Object.create(null);for(let e of Object.keys(t)){const r=t[e];i[e]=(...e)=>r.apply(t,e)}return i.toLineColumnOffset=function(e,i){if(isVueFile(e)){let t=_.getUpToDateInfo(e);if(t){let e=t.toLspDocument().positionAt(i);return{line:e.line,character:e.character}}}return t.toLineColumnOffset(e,i)},i.getDefinitionAndBoundSpan=function(i,r){if(isVueFile(i)){let a;if(!e.tsinfo.project.getScriptInfo(i))return a;let s=_.getUpToDateInfo(i);if(!s)return a;let l=s.sourceFile.getAllEmbeddeds();for(var n=0;n<l.length;n++){let e=l[n].file,i=l[n].sourceMap,s=i.getMappedRange(r);if(s&&s[1].capabilities.definitions){let r=x(e.fileName);if(r){if(a=r.getDefinitionAndBoundSpan(t,e.fileName,s[0].start),!a)return;if(!a.definitions||0==a.definitions.length||!a.textSpan)return;if(!i.getSourceRange(a.textSpan.start))return;return{textSpan:virtualToRealityFromRange(i,a.textSpan),definitions:a.definitions.map((e=>{let t=_.getEmbeddedFileInfo(e.fileName);if(!t)return e;let i=t.file.sourceMap;if(!i)return e;let r=t.host.fileName;return{...e,fileName:r,textSpan:virtualToRealityFromRange(i,e.textSpan),contextSpan:virtualToRealityFromRange(i,e.contextSpan)}}))}}}}}let a=t.getDefinitionAndBoundSpan(i,r);return a&&a.definitions&&(a.definitions=a.definitions.map((e=>{if("script"===e.kind&&_.hasEmbeddedFile(e.fileName)){let t=_.getEmbeddedFileInfo(e.fileName);if(t){let i=t.file.sourceMap;return{...e,fileName:t.host.fileName,textSpan:virtualToRealityFromRange(i,e.textSpan),contextSpan:virtualToRealityFromRange(i,e.contextSpan)}}}return e}))),a},i.getQuickInfoAtPosition=function(i,r){if(!isVueFile(i))return t.getQuickInfoAtPosition(i,r);if(e.tsinfo.project.getScriptInfo(i)){let e=_.getUpToDateInfo(i);if(e){let i=e.sourceFile.getAllEmbeddeds();for(var n=0;n<i.length;n++){let e=i[n].file,a=i[n].sourceMap,s=a.getMappedRange(r);if(s&&s[1].capabilities.basic){let i=x(e.fileName);if(i){let r=i.getQuickInfoAtPosition(t,e.fileName,s[0].start);if(!r)return;let n=a.getSourceRange(r.textSpan.start);return{...r,textSpan:{start:n?n[0].start:r.textSpan.start,length:r.textSpan.length}}}}}}}},i.getSignatureHelpItems=function(i,r,n){if(!isVueFile(i))return t.getSignatureHelpItems(i,r,n);{if(!e.tsinfo.project.getScriptInfo(i))return;let s=_.getUpToDateInfo(i);if(!s)return;let l=s.sourceFile.getAllEmbeddeds();for(var a=0;a<l.length;a++){let e=l[a].file,i=l[a].sourceMap,s=i.getMappedRange(r);if(s&&s[1].capabilities.completion){let r=x(e.fileName);if(r){let a=r.getSignatureHelpItems(t,e.fileName,s[0].start,n);if(!a)return;let l=virtualToRealityFromRange(i,a.applicableSpan);return l&&(a.applicableSpan=l),a}}}}},i.getSyntacticDiagnostics=function(e){if(isVueFile(e)){let i=_.getUpToDateInfo(e);if(i){let e=i.sourceFile.getAllEmbeddeds();if(e){let i=[];for(let r of e){if(!r.file.isTsHostFile||!r.file.capabilities.diagnostics)continue;let e=t.getSyntacticDiagnostics(r.file.fileName);if(e){let t=r.sourceMap;e.forEach((e=>{let r=t.getSourceRange(e.start,e.start+e.length);r&&r[1].capabilities.diagnostic&&i.push({...e,start:r[0].start})}))}}return i}}return[]}return t.getSyntacticDiagnostics(e)},i.getSemanticDiagnostics=function(e){if(isVueFile(e)){let i=_.getUpToDateInfo(e);if(i){let e=i.sourceFile.getAllEmbeddeds();if(e){let i=[];for(let r of e){if(!r.file.isTsHostFile||!r.file.capabilities.diagnostics)continue;let e=t.getSemanticDiagnostics(r.file.fileName);if(e){let t=r.sourceMap;e.forEach((e=>{if(!e)return;let r=t.getSourceRange(e.start,e.start+e.length);if(r&&r[1].capabilities.diagnostic){let t="string"==typeof e.messageText?e.messageText:e.messageText.messageText,n=t.indexOf("__VLS_CurrentPageType");-1!=n&&(t=t.substring(0,n),t+="VueInstance'"),i.push({...e,messageText:t,start:r[0].start})}}))}}return i}}return[]}return t.getSemanticDiagnostics(e)},i.getSuggestionDiagnostics=function(e){if(isVueFile(e)){let i=_.getUpToDateInfo(e);if(i){let e=i.sourceFile.getAllEmbeddeds();if(e){let i=[];for(let r of e){if(!r.file.isTsHostFile||!r.file.capabilities.diagnostics)continue;let e=t.getSuggestionDiagnostics(r.file.fileName);if(e){let t=r.sourceMap;e.forEach((e=>{let r=t.getSourceRange(e.start,e.start+e.length);r&&r[1].capabilities.diagnostic&&i.push({...e,start:r[0].start})}))}}return i}}return[]}return t.getSuggestionDiagnostics(e)},i.findReferences=function(e,i){if(!isVueFile(e))return t.findReferences(e,i);{let n=_.getUpToDateInfo(e);if(!n)return;let a=n.sourceFile.getAllEmbeddeds();for(var r=0;r<a.length;r++){let e=a[r].sourceMap,n=a[r].file,s=e.getMappedRange(i);if(n&&s&&s[1].capabilities.references){let e=x(n.fileName);if(e){let i=e.findReferences(t,n.fileName,s[0].start);if(i&&i.length>0)return i.map((e=>(e.definition,e.references=e.references.map((e=>{let t=e.fileName,i=_.getEmbeddedFileInfo(t);if(i&&i.file){e.fileName=i.host.fileName;let t=i.file.sourceMap;e.contextSpan=virtualToRealityFromRange(t,e.contextSpan),e.textSpan=virtualToRealityFromRange(t,e.textSpan),e.originalContextSpan=virtualToRealityFromRange(t,e.originalContextSpan)}return e})),e)))}}}}},i}(n),n}exports.virtualToRealityFromRange=virtualToRealityFromRange;const TsServerVuePlugin={create:e=>create(e),createTypeCheckerPlugins:e=>[(0,vueTypeCheckerHelper_1.createVueOptionsTypeChecker)(e),(0,vueTypeCheckerHelper_1.createVueThisTypeChecker)(e),new uniapp_1.UnicloudDbTypeCheckerPlugin(e)]};exports.TsServerVuePlugin=TsServerVuePlugin;