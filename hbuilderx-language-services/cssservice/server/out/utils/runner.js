"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.runSafeAsync=exports.formatError=void 0;const vscode_languageserver_1=require("vscode-languageserver");function formatError(e,r){if(r instanceof Error){let n=r;return`${e}: ${n.message}\n${n.stack}`}return"string"==typeof r?`${e}: ${r}`:r?`${e}: ${r.toString()}`:e}function runSafeAsync(e,r,n,o){return new Promise((s=>{setImmediate((()=>(o.isCancellationRequested&&s(cancelValue()),e().then((e=>{o.isCancellationRequested?s(cancelValue()):s(e)}),(e=>{console.error(formatError(n,e)),s(r)})))))}))}function cancelValue(){return new vscode_languageserver_1.ResponseError(vscode_languageserver_1.ErrorCodes.RequestCancelled,"Request cancelled")}exports.formatError=formatError,exports.runSafeAsync=runSafeAsync;