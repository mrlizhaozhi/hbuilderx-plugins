"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.doComplete=void 0;const vscode_languageserver_protocol_1=require("vscode-languageserver-protocol"),htmlDataUtils_1=require("./htmlDataUtils"),dataProvider=(0,htmlDataUtils_1.cssDataProvider)();function doComplete(e,o,t){let r=dataProvider.provideProperties();const a=null==t?void 0:t.replaceRange;return r.map((e=>({label:e.name,kind:vscode_languageserver_protocol_1.CompletionItemKind.Property,textEdit:a?vscode_languageserver_protocol_1.TextEdit.replace(a,e.name):void 0})))}exports.doComplete=doComplete;