"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.doComplete=void 0;const ts=require("typescript"),vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),type_resolve_1=require("../common/type-resolve"),ProjectFileFilter_1=require("../tool/ProjectFileFilter"),index_1=require("./index");function doComplete(e,t,o,r){let i;if(o.kind===index_1.StringLocationInfoKind.IN_JS_LIKE&&(i=o.ast),!i)return[];let l=(0,type_resolve_1.getTokenAtPosition)(i,e.offsetAt(t)),n="";l.kind===ts.SyntaxKind.StringLiteral&&(n=l.getText());let s=(0,ProjectFileFilter_1.getCompletionFilesSync)(o.project.fsPath,{extensionFilters:[".js"],prefixPath:n,timeout:1e3},e.uri),p=[];return null==s||s.files.forEach((e=>{p.push({label:e.relative,kind:e.isDir?vscode_languageserver_protocol_1.CompletionItemKind.Folder:vscode_languageserver_protocol_1.CompletionItemKind.File})})),p}exports.doComplete=doComplete;