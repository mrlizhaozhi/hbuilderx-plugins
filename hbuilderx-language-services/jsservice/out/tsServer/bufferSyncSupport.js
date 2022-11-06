"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const vscode=require("vscode"),typescriptService_1=require("../typescriptService"),api_1=require("../utils/api"),arrays_1=require("../utils/arrays"),async_1=require("../utils/async"),cancellation_1=require("../utils/cancellation"),dispose_1=require("../utils/dispose"),languageModeIds=require("../utils/languageModeIds"),resourceMap_1=require("../utils/resourceMap"),typeConverters=require("../utils/typeConverters");function mode2ScriptKind(e){switch(e){case languageModeIds.typescript:return"TS";case languageModeIds.typescriptreact:return"TSX";case languageModeIds.javascript:return"JS";case languageModeIds.javascriptreact:return"JSX"}}class CloseOperation{constructor(e){this.args=e,this.type=0}}class OpenOperation{constructor(e){this.args=e,this.type=1}}class ChangeOperation{constructor(e){this.args=e,this.type=2}}class BufferSynchronizer{constructor(e,t){this.client=e,this._pending=new resourceMap_1.ResourceMap(void 0,{onCaseInsenitiveFileSystem:t})}open(e,t){this.supportsBatching?this.updatePending(e,new OpenOperation(t)):this.client.executeWithoutWaitingForResponse("open",t)}close(e,t){if(this.supportsBatching)return this.updatePending(e,new CloseOperation(t));{const e={file:t};return this.client.executeWithoutWaitingForResponse("close",e),!0}}change(e,t,s){if(s.length)if(this.supportsBatching)this.updatePending(e,new ChangeOperation({fileName:t,textChanges:s.map((e=>({newText:e.text,start:typeConverters.Position.toLocation(e.range.start),end:typeConverters.Position.toLocation(e.range.end)}))).reverse()}));else for(const{range:e,text:i}of s){const s={insertString:i,...typeConverters.Range.toFormattingRequestArgs(t,e)};this.client.executeWithoutWaitingForResponse("change",s)}}reset(){this._pending.clear()}beforeCommand(e){"updateOpen"!==e&&this.flush()}flush(){if(this.supportsBatching){if(this._pending.size>0){const e=[],t=[],s=[];for(const i of this._pending.values)switch(i.type){case 2:s.push(i.args);break;case 1:t.push(i.args);break;case 0:e.push(i.args)}this.client.execute("updateOpen",{changedFiles:s,closedFiles:e,openFiles:t},cancellation_1.nulToken,{nonRecoverable:!0}),console.log(`buffer sync supports: ${JSON.stringify(s)}`),this._pending.clear()}}else this._pending.clear()}get supportsBatching(){return this.client.apiVersion.gte(api_1.default.v340)}updatePending(e,t){if(0===t.type){const t=this._pending.get(e);if(1===(null==t?void 0:t.type))return this._pending.delete(e),!1}return this._pending.has(e)&&this.flush(),this._pending.set(e,t),!0}}class SyncedBuffer{constructor(e,t,s,i){this.document=e,this.filepath=t,this.client=s,this.synchronizer=i,this.state=1}open(){const e={file:this.filepath,fileContent:this.document.getText(),projectRootPath:this.client.getWorkspaceRootForResource(this.document.uri)},t=mode2ScriptKind(this.document.languageId);if(t&&(e.scriptKindName=t),this.client.apiVersion.gte(api_1.default.v240)){const t=this.client.pluginManager.plugins.filter((e=>e.languages.indexOf(this.document.languageId)>=0));t.length&&(e.plugins=t.map((e=>e.name)))}this.synchronizer.open(this.resource,e),this.state=2}get resource(){return this.document.uri}get lineCount(){return this.document.lineCount}get kind(){switch(this.document.languageId){case languageModeIds.typescript:case languageModeIds.typescriptreact:return 1;case languageModeIds.javascript:case languageModeIds.javascriptreact:return 2;default:return-1}}close(){return 2!==this.state?(this.state=2,!1):(this.state=2,this.synchronizer.close(this.resource,this.filepath))}onContentChanged(e){2!==this.state&&console.error(`Unexpected buffer state: ${this.state}`),this.synchronizer.change(this.resource,this.filepath,e)}}class SyncedBufferMap extends resourceMap_1.ResourceMap{getForPath(e){return this.get(vscode.Uri.file(e))}get allBuffers(){return this.values}}class PendingDiagnostics extends resourceMap_1.ResourceMap{getOrderedFileSet(){const e=Array.from(this.entries).sort(((e,t)=>e.value-t.value)).map((e=>e.resource)),t=new resourceMap_1.ResourceMap(void 0,this.config);for(const s of e)t.set(s,void 0);return t}}class GetErrRequest{constructor(e,t,s){this.files=t,this._done=!1,this._token=new vscode.CancellationTokenSource;const i=(0,arrays_1.coalesce)(Array.from(t.entries).map((t=>e.normalizedPath(t.resource))));if(i.length&&e.capabilities.has(typescriptService_1.ClientCapability.Semantic)){(e.configuration.enableProjectDiagnostics?e.executeAsync("geterrForProject",{delay:0,file:i[0]},this._token.token):e.executeAsync("geterr",{delay:0,files:i},this._token.token)).finally((()=>{this._done||(this._done=!0,s())}))}else this._done=!0,setImmediate(s)}static executeGetErrRequest(e,t,s){return new GetErrRequest(e,t,s)}cancel(){this._done||this._token.cancel(),this._token.dispose()}}class BufferSyncSupport extends dispose_1.Disposable{constructor(e,t,s){super(),this._validateJavaScript=!0,this._validateTypeScript=!0,this.listening=!1,this._onDelete=this._register(new vscode.EventEmitter),this.onDelete=this._onDelete.event,this._onWillChange=this._register(new vscode.EventEmitter),this.onWillChange=this._onWillChange.event,this.client=e,this.modeIds=new Set(t),this.diagnosticDelayer=new async_1.Delayer(300);const i=e=>this.client.normalizedPath(e);this.syncedBuffers=new SyncedBufferMap(i,{onCaseInsenitiveFileSystem:s}),this.pendingDiagnostics=new PendingDiagnostics(i,{onCaseInsenitiveFileSystem:s}),this.synchronizer=new BufferSynchronizer(e,s),this.updateConfiguration(),vscode.workspace.onDidChangeConfiguration(this.updateConfiguration,this,this._disposables)}listen(){this.listening||(this.listening=!0,vscode.workspace.onDidOpenTextDocument(this.openTextDocument,this,this._disposables),vscode.workspace.onDidCloseTextDocument(this.onDidCloseTextDocument,this,this._disposables),vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument,this,this._disposables),vscode.window.onDidChangeVisibleTextEditors((e=>{for(const{document:t}of e){const e=this.syncedBuffers.get(t.uri);e&&this.requestDiagnostic(e)}}),this,this._disposables),vscode.workspace.textDocuments.forEach(this.openTextDocument,this))}handles(e){return this.syncedBuffers.has(e)}ensureHasBuffer(e){if(this.syncedBuffers.has(e))return!0;const t=vscode.workspace.textDocuments.find((t=>t.uri.toString()===e.toString()));return!!t&&this.openTextDocument(t)}toVsCodeResource(e){const t=this.client.normalizedPath(e);for(const e of this.syncedBuffers.allBuffers)if(e.filepath===t)return e.resource;return e}toResource(e){const t=this.syncedBuffers.getForPath(e);return t?t.resource:vscode.Uri.file(e)}reset(){var e;null===(e=this.pendingGetErr)||void 0===e||e.cancel(),this.pendingDiagnostics.clear(),this.synchronizer.reset()}reinitialize(){this.reset();for(const e of this.syncedBuffers.allBuffers)e.open()}openTextDocument(e){if(!this.modeIds.has(e.languageId))return!1;const t=e.uri,s=this.client.normalizedPath(t);if(!s)return!1;if(this.syncedBuffers.has(t))return!0;const i=new SyncedBuffer(e,s,this.client,this.synchronizer);return this.syncedBuffers.set(t,i),i.open(),this.requestDiagnostic(i),!0}closeResource(e){var t;const s=this.syncedBuffers.get(e);if(!s)return;this.pendingDiagnostics.delete(e),null===(t=this.pendingGetErr)||void 0===t||t.files.delete(e),this.syncedBuffers.delete(e);const i=s.close();this._onDelete.fire(e),i&&this.requestAllDiagnostics()}interuptGetErr(e){if(!this.pendingGetErr||this.client.configuration.enableProjectDiagnostics)return e();this.pendingGetErr.cancel(),this.pendingGetErr=void 0;const t=e();return this.triggerDiagnostics(),t}beforeCommand(e){this.synchronizer.beforeCommand(e)}onDidCloseTextDocument(e){this.closeResource(e.uri)}onDidChangeTextDocument(e){const t=this.syncedBuffers.get(e.document.uri);if(!t)return;this._onWillChange.fire(t.resource),t.onContentChanged(e.contentChanges);!this.requestDiagnostic(t)&&this.pendingGetErr&&(this.pendingGetErr.cancel(),this.pendingGetErr=void 0,this.triggerDiagnostics())}requestAllDiagnostics(){for(const e of this.syncedBuffers.allBuffers)this.shouldValidate(e)&&this.pendingDiagnostics.set(e.resource,Date.now());this.triggerDiagnostics()}getErr(e){const t=e.filter((e=>this.handles(e)));if(t.length){for(const e of t)this.pendingDiagnostics.set(e,Date.now());this.triggerDiagnostics()}}triggerDiagnostics(e=200){this.diagnosticDelayer.trigger((()=>{this.sendPendingDiagnostics()}),e)}requestDiagnostic(e){if(!this.shouldValidate(e))return!1;this.pendingDiagnostics.set(e.resource,Date.now());const t=Math.min(Math.max(Math.ceil(e.lineCount/20),300),800);return this.triggerDiagnostics(t),!0}hasPendingDiagnostics(e){return this.pendingDiagnostics.has(e)}sendPendingDiagnostics(){const e=this.pendingDiagnostics.getOrderedFileSet();if(this.pendingGetErr){this.pendingGetErr.cancel();for(const{resource:t}of this.pendingGetErr.files.entries)this.syncedBuffers.get(t)&&e.set(t,void 0);this.pendingGetErr=void 0}for(const t of this.syncedBuffers.values)e.set(t.resource,void 0);if(e.size){const t=this.pendingGetErr=GetErrRequest.executeGetErrRequest(this.client,e,(()=>{this.pendingGetErr===t&&(this.pendingGetErr=void 0)}))}this.pendingDiagnostics.clear()}updateConfiguration(){const e=vscode.workspace.getConfiguration("javascript",null),t=vscode.workspace.getConfiguration("typescript",null);this._validateJavaScript=e.get("validate.enable",!1),this._validateTypeScript=t.get("validate.enable",!0)}shouldValidate(e){switch(e.kind){case 2:return this._validateJavaScript;case 1:return this._validateTypeScript;default:return!0}}}exports.default=BufferSyncSupport;