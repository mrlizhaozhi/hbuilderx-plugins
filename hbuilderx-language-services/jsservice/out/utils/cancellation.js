"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.nulToken=void 0;const vscode=require("vscode"),noopDisposable=vscode.Disposable.from();exports.nulToken={isCancellationRequested:!1,onCancellationRequested:()=>noopDisposable};