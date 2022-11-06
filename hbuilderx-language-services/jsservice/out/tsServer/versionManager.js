"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TypeScriptVersionManager=void 0;const vscode=require("vscode"),nls=require("vscode-nls"),path=require("path"),dispose_1=require("../utils/dispose"),localize=nls.loadMessageBundle(),useWorkspaceTsdkStorageKey="typescript.useWorkspaceTsdk",suppressPromptWorkspaceTsdkStorageKey="typescript.suppressPromptWorkspaceTsdk";class TypeScriptVersionManager extends dispose_1.Disposable{constructor(e,s,t){if(super(),this.configuration=e,this.versionProvider=s,this.workspaceState=t,this._onDidPickNewVersion=this._register(new vscode.EventEmitter),this.onDidPickNewVersion=this._onDidPickNewVersion.event,this._currentVersion=this.versionProvider.defaultVersion,this.useWorkspaceTsdkSetting){const e=this.versionProvider.localVersion;e&&(this._currentVersion=e)}this.isInPromptWorkspaceTsdkState(e)&&setImmediate((()=>{this.promptUseWorkspaceTsdk()}))}updateConfiguration(e){const s=this.configuration;this.configuration=e,!this.isInPromptWorkspaceTsdkState(s)&&this.isInPromptWorkspaceTsdkState(e)&&this.promptUseWorkspaceTsdk()}get currentVersion(){return this._currentVersion}reset(){this._currentVersion=this.versionProvider.bundledVersion}async promptUserForVersion(){const e=await vscode.window.showQuickPick([this.getBundledPickItem(),...this.getLocalPickItems(),LearnMorePickItem],{placeHolder:localize("selectTsVersion","Select the TypeScript version used for JavaScript and TypeScript language features")});return null==e?void 0:e.run()}getBundledPickItem(){const e=this.versionProvider.defaultVersion;return{label:(this.useWorkspaceTsdkSetting?"":"• ")+localize("useVSCodeVersionOption","Use VS Code's Version"),description:e.displayName,detail:e.pathLabel,run:async()=>{await this.workspaceState.update(useWorkspaceTsdkStorageKey,!1),this.updateActiveVersion(e)}}}getLocalPickItems(){return this.versionProvider.localVersions.map((e=>({label:(this.useWorkspaceTsdkSetting&&this.currentVersion.eq(e)?"• ":"")+localize("useWorkspaceVersionOption","Use Workspace Version"),description:e.displayName,detail:e.pathLabel,run:async()=>{await this.workspaceState.update(useWorkspaceTsdkStorageKey,!0);const s=vscode.workspace.getConfiguration("typescript");await s.update("tsdk",path.dirname(e.tsServerPath),!1),this.updateActiveVersion(e)}})))}async promptUseWorkspaceTsdk(){const e=this.versionProvider.localVersion;if(void 0===e)throw new Error("Could not prompt to use workspace TypeScript version because no workspace version is specified");const s=localize("allow","Allow"),t=localize("dismiss","Dismiss"),r=localize("suppress prompt","Never in this Workspace"),i=await vscode.window.showInformationMessage(localize("promptUseWorkspaceTsdk","This workspace contains a TypeScript version. Would you like to use the workspace TypeScript version for TypeScript and JavaScript language features?"),s,t,r);i===s?(await this.workspaceState.update(useWorkspaceTsdkStorageKey,!0),this.updateActiveVersion(e)):i===r&&await this.workspaceState.update(suppressPromptWorkspaceTsdkStorageKey,!0)}updateActiveVersion(e){const s=this.currentVersion;this._currentVersion=e,s.eq(e)||this._onDidPickNewVersion.fire()}get useWorkspaceTsdkSetting(){return this.workspaceState.get(useWorkspaceTsdkStorageKey,!1)}get suppressPromptWorkspaceTsdkSetting(){return this.workspaceState.get(suppressPromptWorkspaceTsdkStorageKey,!1)}isInPromptWorkspaceTsdkState(e){return null!==e.localTsdk&&!0===e.enablePromptUseWorkspaceTsdk&&!1===this.suppressPromptWorkspaceTsdkSetting&&!1===this.useWorkspaceTsdkSetting}}exports.TypeScriptVersionManager=TypeScriptVersionManager;const LearnMorePickItem={label:localize("learnMore","Learn more about managing TypeScript versions"),description:"",run:()=>{vscode.env.openExternal(vscode.Uri.parse("https://go.microsoft.com/fwlink/?linkid=839919"))}};