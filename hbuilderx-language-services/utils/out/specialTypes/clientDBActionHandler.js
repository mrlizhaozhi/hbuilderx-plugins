"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.gotoDefinition=exports.doComplete=void 0;const path=require("path"),fs=require("fs"),vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),uniCloudPath_1=require("../common/uniCloudPath");function doComplete(e,t,n){let r=[],o=new Set;if(null==n?void 0:n.workspaceFolder){let e=n.workspaceFolder;for(let t=0;t<uniCloudPath_1.providers.length;++t){let n=path.join(e,(0,uniCloudPath_1.getCloudActionRoot)(uniCloudPath_1.providers[t]));fs.existsSync(n)&&fs.readdirSync(n).forEach((e=>{let t=e.substr(0,e.lastIndexOf("."));o.add(t)}))}getUniModuleActionNames(e).forEach((e=>{o.add(e)}))}return o.forEach((e=>{r.push({label:e,kind:vscode_languageserver_protocol_1.CompletionItemKind.Property,documentation:e})})),r}function getUniModuleActionNames(e,t){let n=[],r=(0,uniCloudPath_1.getUniModulesDir)(),o=path.join(e,r);if(fs.existsSync(o)&&fs.statSync(o).isDirectory()){let e=fs.readdirSync(o);for(let r of e){let e=path.join(o,r);if(fs.statSync(e).isDirectory())for(let r=0;r<uniCloudPath_1.providers.length;++r){let r=path.join(e,"/uniCloud/cloudfunctions/uni-clientDB-actions");if(fs.existsSync(r)&&fs.statSync(r).isDirectory()){let e=fs.readdirSync(r);for(let o=0;o<e.length;++o){let a=path.basename(e[o],".js");if(a==t)return[path.join(r,e[o])];n.push(a)}}}}}return n}function gotoDefinition(e,t){if(null==t?void 0:t.workspaceFolder){let n=t.workspaceFolder;for(let r=0;r<uniCloudPath_1.providers.length;++r){let o=path.join(n,(0,uniCloudPath_1.getCloudActionRoot)(uniCloudPath_1.providers[r]));if(!fs.existsSync(o))continue;let a=fs.readdirSync(o);for(let n=0;n<a.length;++n){if(path.basename(a[n],".js")==e)return{definitions:[{textSpan:{start:0,length:0},fileName:path.join(o,a[n]),originSelectionRange:{start:{line:t.range.start.line,character:t.range.start.character},end:{line:t.range.end.line,character:t.range.end.character}},targetRange:{start:{line:0,character:0},end:{line:0,character:0}},targetSelectionRange:{start:{line:0,character:0},end:{line:0,character:0}}}]}}}let r=getUniModuleActionNames(n,e);if(1===r.length)return{definitions:[{textSpan:{start:0,length:0},fileName:r[0],originSelectionRange:{start:{line:t.range.start.line,character:t.range.start.character},end:{line:t.range.end.line,character:t.range.end.character}},targetRange:{start:{line:0,character:0},end:{line:0,character:0}},targetSelectionRange:{start:{line:0,character:0},end:{line:0,character:0}}}]}}}exports.doComplete=doComplete,exports.gotoDefinition=gotoDefinition;