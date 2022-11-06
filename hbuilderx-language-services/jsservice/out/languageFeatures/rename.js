"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.register=void 0;const path=require("path"),vscode=require("vscode"),nls=require("vscode-nls"),typescriptService_1=require("../typescriptService"),api_1=require("../utils/api"),dependentRegistration_1=require("../utils/dependentRegistration"),typeConverters=require("../utils/typeConverters"),localize=nls.loadMessageBundle();class TypeScriptRenameProvider{constructor(e,t){this.client=e,this.fileConfigurationManager=t}async prepareRename(e,t,r){if(this.client.apiVersion.lt(api_1.default.v310))return null;const i=await this.execRename(e,t,r);if("response"!==(null==i?void 0:i.type)||!i.body)return null;const n=i.body.info;return n.canRename?typeConverters.Range.fromTextSpan(n.triggerSpan):Promise.reject(n.localizedErrorMessage)}async provideRenameEdits(e,t,r,i){const n=await this.execRename(e,t,i);if(!n||"response"!==n.type||!n.body)return null;const o=n.body.info;if(!o.canRename)return Promise.reject(o.localizedErrorMessage);if(o.fileToRename){const e=await this.renameFile(o.fileToRename,r,i);return e||Promise.reject(localize("fileRenameFail","An error occurred while renaming file"))}return this.updateLocs(n.body.locs,r)}async execRename(e,t,r){const i=this.client.toOpenedFilePath(e);if(!i)return;const n={...typeConverters.Position.toFileLocationRequestArgs(i,t),findInStrings:!1,findInComments:!1};return this.client.interruptGetErr((()=>(this.fileConfigurationManager.ensureConfigurationForDocument(e,r),this.client.execute("rename",n,r))))}updateLocs(e,t){const r=new vscode.WorkspaceEdit;for(const i of e){const e=this.client.toResource(i.file);for(const n of i.locs)r.replace(e,typeConverters.Range.fromTextSpan(n),(n.prefixText||"")+t+(n.suffixText||""))}return r}async renameFile(e,t,r){path.extname(t)||(t+=path.extname(e));const i=path.dirname(e),n=path.join(i,t),o={file:e,oldFilePath:e,newFilePath:n},s=await this.client.execute("getEditsForFileRename",o,r);if("response"!==s.type||!s.body)return;const a=typeConverters.WorkspaceEdit.fromFileCodeEdits(this.client,s.body);return a.renameFile(vscode.Uri.file(e),vscode.Uri.file(n)),a}}function register(e,t,r){return(0,dependentRegistration_1.conditionalRegistration)([(0,dependentRegistration_1.requireSomeCapability)(t,typescriptService_1.ClientCapability.Semantic)],(()=>vscode.languages.registerRenameProvider(e.semantic,new TypeScriptRenameProvider(t,r))))}exports.register=register;