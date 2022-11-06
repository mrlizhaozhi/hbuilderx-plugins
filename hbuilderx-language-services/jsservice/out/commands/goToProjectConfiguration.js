"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.JavaScriptGoToProjectConfigCommand=exports.TypeScriptGoToProjectConfigCommand=void 0;const vscode=require("vscode"),tsconfig_1=require("../utils/tsconfig");class TypeScriptGoToProjectConfigCommand{constructor(o){this.lazyClientHost=o,this.id="typescript.goToProjectConfig"}execute(){const o=vscode.window.activeTextEditor;o&&(0,tsconfig_1.openProjectConfigForFile)(0,this.lazyClientHost.value.serviceClient,o.document.uri)}}exports.TypeScriptGoToProjectConfigCommand=TypeScriptGoToProjectConfigCommand;class JavaScriptGoToProjectConfigCommand{constructor(o){this.lazyClientHost=o,this.id="javascript.goToProjectConfig"}execute(){const o=vscode.window.activeTextEditor;o&&(0,tsconfig_1.openProjectConfigForFile)(1,this.lazyClientHost.value.serviceClient,o.document.uri)}}exports.JavaScriptGoToProjectConfigCommand=JavaScriptGoToProjectConfigCommand;