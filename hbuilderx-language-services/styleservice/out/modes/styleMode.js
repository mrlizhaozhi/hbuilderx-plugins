"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.StyleMode=void 0;const vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),vscode_uri_1=require("vscode-uri"),core_1=require("../../../core"),tsServerStylePlugin_1=require("../tsServerStylePlugin");class StyleMode{constructor(e,t,i,r){this.info=e,this.styleScriptCache=t,this.styleLanguageServiceList=i}initialize(e,t){const i=this.info,r=this.styleScriptCache,o=this.styleLanguageServiceList,n=(0,tsServerStylePlugin_1.getLanguage)(e);if(!n)return;const s=o.get(n);if(!s)return;if(!i.tsinfo.project.getScriptInfo(e))return;const l=r.getUpToDateInfo(e);if(!l)return;let u=vscode_uri_1.URI.file(e).toString();const c=vscode_languageserver_textdocument_1.TextDocument.create(u,n,0,l.styleDocument.getText()),a=s.parseStylesheet(c),g=c.positionAt(t);return{styleDocument:c,stylesheet:a,position:g,languageServer:s}}getCompletionsAtPosition(e,t,i,r){let o=this.initialize(t,i);if(!o)return;const n=o.styleDocument,s=o.stylesheet,l=o.position,u=o.languageServer.doComplete(n,l,s);return(0,core_1.fromLspCompletions)(u,n,this.info.ts)}getCompletionEntryDetails(e,t,i,r,o,n,s,l){if(!n)return;let u=vscode_uri_1.URI.parse(n).query,c=JSON.parse(u),a=this.initialize(t,i);if(!a)return;const g=a.styleDocument,f=a.stylesheet,p=a.position,v={label:r,...c},y=a.languageServer.doResolve(v,g,p,f);return(0,core_1.fromLspCompletionDetail)(y,g,this.info.ts)}getQuickInfoAtPosition(e,t,i){let r=this.initialize(t,i);if(!r)return;const o=r.styleDocument,n=r.stylesheet,s=r.position,l=r.languageServer.doHover(o,s,n);return(0,core_1.fromLspHover)(l,o,this.info.ts)}getDefinitionAndBoundSpan(e,t,i){let r=this.initialize(t,i);if(!r)return;const o=r.styleDocument,n=r.stylesheet,s=r.position,l=r.languageServer.tsFindDefinition(o,s,n);return(0,core_1.fromLspDefinition)(l,o,this.info,void 0)}getNavigationTree(e,t){const i=this.info,r=this.styleScriptCache,o=this.styleLanguageServiceList,n=(0,tsServerStylePlugin_1.getLanguage)(t);if(!n)return;const s=o.get(n);if(!s)return;if(!i.tsinfo.project.getScriptInfo(t))return;const l=r.getUpToDateInfo(t);if(!l)return;const u=vscode_languageserver_textdocument_1.TextDocument.create(t,n,0,l.styleDocument.getText()),c=s.parseStylesheet(u),a=s.findDocumentSymbols(u,c);return(0,core_1.fromLspNavigation)(a,u,this.info.ts,!1)}findReferences(e,t,i){}}exports.StyleMode=StyleMode;