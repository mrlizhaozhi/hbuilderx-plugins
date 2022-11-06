"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TypeScriptPluginPathsProvider=void 0;const path=require("path"),vscode=require("vscode"),relativePathResolver_1=require("./relativePathResolver");class TypeScriptPluginPathsProvider{constructor(e){this.configuration=e}updateConfiguration(e){this.configuration=e}getPluginPaths(){const e=[];for(const t of this.configuration.tsServerPluginPaths)e.push(...this.resolvePluginPath(t));return e}resolvePluginPath(e){if(path.isAbsolute(e))return[e];const t=relativePathResolver_1.RelativeWorkspacePathResolver.asAbsoluteWorkspacePath(e);return void 0!==t?[t]:(vscode.workspace.workspaceFolders||[]).map((t=>path.join(t.uri.fsPath,e)))}}exports.TypeScriptPluginPathsProvider=TypeScriptPluginPathsProvider;