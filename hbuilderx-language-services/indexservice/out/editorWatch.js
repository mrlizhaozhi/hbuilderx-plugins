"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.watchActivateTextEditor=void 0;const vscode_1=require("vscode"),request_1=require("./request"),hx=require("hbuilderx");function watchActivateTextEditor(t){const e=vscode_1.window.onDidChangeActiveTextEditor((async e=>{let i=null==e?void 0:e.document.uri,o=i?i.toString():"";t.sendNotification(request_1.EditorActivatedNotify.type,o)}));return hx.window.getActiveTextEditor().then((e=>{let i=null==e?void 0:e.document.uri,o=i?i.toString():"";t.sendNotification(request_1.EditorActivatedNotify.type,o)})),e}exports.watchActivateTextEditor=watchActivateTextEditor;