"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const fs=require("fs"),jsonc_1=require("jsonc"),path=require("path"),vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),vscode_uri_1=require("vscode-uri"),core_1=require("../../../core"),uniCloudUtils_1=require("../utils/uniCloudUtils");class RequireCommonHandler{doComplete(e,t,r,o,n,i){let s=n,l=vscode_uri_1.URI.parse(e.uri).fsPath;if((0,uniCloudUtils_1.getCloudFunctionOrObjectName)(l)){let t=(0,uniCloudUtils_1.getCloudFunctionOrObjectRoot)(l);if(t){let o=(0,core_1.getCompletionPathListSync)(r.project.fsPath,t,{extSuffixFilterList:[".js"]},e.uri);o&&(console.log("t"),s.push(...(0,core_1.getPathCompletionItem)(o,e,r.range,r,!1,!1)));let n=path.join(t,"package.json");if(!fs.existsSync(n))return s;let[i,l]=jsonc_1.jsonc.safe.parse(fs.readFileSync(n).toString());if(!i&&l.dependencies){let e=l.dependencies;for(let t of Object.keys(e))e[t].startsWith("file:")&&s.push({label:t,kind:vscode_languageserver_protocol_1.CompletionItemKind.Property,documentation:t})}}}return s}doCompleteResolve(e,t,r,o,n){return e}doHover(e,t,r,o){}doDefinition(e,t,r,o){let n=path.resolve(r.project.fsPath,"package.json");if(!fs.existsSync(n))return[];let[i,s]=jsonc_1.jsonc.safe.parse(fs.readFileSync(n).toString());if(!i&&s.dependencies){let t=s.dependencies,o=e.getText(r.range);for(let e of Object.keys(t))if(e==o&&t[e].startsWith("file:")){let o=t[e].substring(5).trim();return[{targetUri:path.resolve(n,o),targetRange:(0,core_1.getNullRange)(),targetSelectionRange:(0,core_1.getNullRange)(),originSelectionRange:r.range}]}}return[]}doReference(e,t,r,o){return[]}}exports.default=RequireCommonHandler;