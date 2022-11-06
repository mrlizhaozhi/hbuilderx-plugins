"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),hx=require("../../index"),path=require("path");class VueEventHandler{doComplete(e,t,r,o,a,l){let i=[],n=o.get(hx.LanguageServiceType.TS),p=r.ast,s=o.get(hx.LanguageServiceType.TYPESCRIPT_LANGUAGE_SERVICE).getProgram(),g=path.basename(p.fileName);g=g.split(".")[0];let u=path.join(path.dirname(p.fileName),g+".vue.__VLS_template.tsx"),d=s.getSourceFile(u);if(!d)return i;let c=s.getTypeChecker();if(!c)return i;let f=c.getSymbolsInScope(d,n.SymbolFlags.Alias).find((e=>"___VLS_options"===e.escapedName));if(f){let e=c.getTypeOfSymbolAtLocation(f,d);if(e){let t=c.getPropertiesOfType(e).find((e=>"data"===e.escapedName));if(t){let e=c.getTypeOfSymbolAtLocation(t,d);if(e){let t=c.getReturnTypeOfSignature(e.getCallSignatures()[0]);if(t){c.getPropertiesOfType(t).forEach((e=>{i.push({label:e.escapedName,kind:vscode_languageserver_protocol_1.CompletionItemKind.Property})}))}}}}}return i}doCompleteResolve(e,t,r,o,a){return e}doHover(e,t,r,o){}doDefinition(e,t,r,o){return[]}doReference(e,t,r,o){return[]}}exports.default=VueEventHandler;