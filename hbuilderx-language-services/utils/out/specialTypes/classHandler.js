"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.doComplete=void 0;const vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),indexlib_1=require("../../../indexlib"),idHandler_1=require("./idHandler"),vscode_uri_1=require("vscode-uri");function addClassResults(e,s,t,o){let r=t.get(e),n=new Set;r.references.forEach((e=>{n.add(e.uri)})),n.add(e);for(const[e,t]of s.entries()){let s=new Set;for(let e of n)t.has(e)&&s.add(e);o.set(e,Array.from(s).join("\n"))}}function addCSSResultClasses(e,s,t){for(const[o,r]of t.entries())r.has(s)&&e.set(o,s)}function doComplete(e,s,t){let o=[],r=indexlib_1.IndexDataStore.load({uri:vscode_uri_1.URI.file(t.workspaceFolder).toString(),name:""}),n=(new Map,(0,idHandler_1.getClassList)(r)),i=new Map;for(const[e,s]of r.allIndexData().entries())(e.endsWith(".css")||e.endsWith(".scss")||e.endsWith(".sass")||e.endsWith(".stylus"))&&i.set(e,s);let d=new Map;if((0,idHandler_1.isHTMLDocument)(s))addClassResults(s.uri,n,i,d);else if((0,idHandler_1.isJSDocument)(s)){let e=new Map;for(const[s,t]of r.allIndexData().entries())(s.endsWith(".js")||s.endsWith(".ts"))&&e.set(s,t);if(e.has(s.uri)){e.get(s.uri).references.forEach((e=>{addClassResults(e.uri,n,i,d)}))}}else(0,idHandler_1.isCSSDocument)(s)&&addCSSResultClasses(d,s.uri,n);for(const[e,s]of d.entries())o.push({kind:vscode_languageserver_protocol_1.CompletionItemKind.Class,label:e,detail:s});for(const[e,s]of n.entries())d.has(e)||o.push({kind:vscode_languageserver_protocol_1.CompletionItemKind.Class,label:e,detail:Array.from(d.get(e)).join("\n")});return o}exports.doComplete=doComplete;