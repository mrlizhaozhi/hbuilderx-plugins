"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.gotoDefinition=exports.doComplete=void 0;const vscode_languageserver_protocol_1=require("vscode-languageserver-protocol");function doComplete(e,o,t){let r=[],n=t.jsonDocument.getNodeFromOffset(o.offsetAt(e)).parent;if("property"===(null==n?void 0:n.type)&&(n=n.parent,"object"===(null==n?void 0:n.type)&&(n=n.parent,"property"===(null==n?void 0:n.type)&&(n=n.parent,"object"===(null==n?void 0:n.type)))))for(let e of n.properties)r.push({label:e.keyNode.value,kind:vscode_languageserver_protocol_1.CompletionItemKind.Property});return r}function gotoDefinition(){}exports.doComplete=doComplete,exports.gotoDefinition=gotoDefinition;