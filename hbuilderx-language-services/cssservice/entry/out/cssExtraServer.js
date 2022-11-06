"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createFileIndexProcessor=exports.CssExtraServer=void 0;const vscode_css_languageservice_1=require("vscode-css-languageservice"),baseExtraServer_1=require("./baseExtraServer"),cssCompletionProcessor_1=require("./completion/cssCompletionProcessor"),baseDefinitionProcessor_1=require("./definition/baseDefinitionProcessor"),formatProcessor_1=require("./format/formatProcessor"),cssIndexProcessor_1=require("./index/cssIndexProcessor"),baseSymbolProcessor_1=require("./symbol/baseSymbolProcessor");class CssExtraServer extends baseExtraServer_1.BaseExtraServer{support(e,s){return!("css"!==e.languageId&&!e.uri.endsWith(".css"))}doIndex(e,s){return(new cssIndexProcessor_1.CssIndexProcessor).createIndexData(s,e)}getLanguageServiceExt(){return{findSymbol:async(e,s,r)=>Promise.resolve().then((()=>(new baseDefinitionProcessor_1.BaseDefinitionProcessor).getDefinitionFromClass(r,e,s))),async doComplete(e,s,r){let o=null==r?void 0:r.docStylesheet;if(!r||!r.documentContext)return{isIncomplete:!1,items:[]};r.docStylesheet||(o=(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(e));let t=await(0,vscode_css_languageservice_1.getCSSLanguageService)().doComplete2(e,s,o,r.documentContext);return Promise.resolve().then((async()=>{const n=new cssCompletionProcessor_1.CssCompletionProcessor,c=r.workspaceFolder,i=r.serverConnection,a=r.scopedSettingsSupport;return t=await n.doExtraCompletion(c,e,s,o,i,a,t),t}))},findDocumentSymbols(e,s){let r=null==s?void 0:s.docStylesheet;if(!s)return[];s.docStylesheet||(r=(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(e));let o=(0,vscode_css_languageservice_1.getCSSLanguageService)().findDocumentSymbols(e,r),t=s.workspaceFolder;return o=(new baseSymbolProcessor_1.BaseSymbolProcessor).getHxKindConvertedSymbolsData(t,o),o},format:async(e,s,r)=>(0,formatProcessor_1.getFormattingInHtml)(e,s,r),async findDefinition(e,s,r){let o=null==r?void 0:r.docStylesheet;r&&r.docStylesheet||(o=(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(e));let t=(0,vscode_css_languageservice_1.getCSSLanguageService)().findDefinition(e,s,o);return Promise.resolve().then((async()=>(new baseDefinitionProcessor_1.BaseDefinitionProcessor).getBaseLocationLink(null==r?void 0:r.workspaceFolder,e,s,o,t)))}}}}function createFileIndexProcessor(e){return new CssExtraServer}exports.CssExtraServer=CssExtraServer,exports.createFileIndexProcessor=createFileIndexProcessor;