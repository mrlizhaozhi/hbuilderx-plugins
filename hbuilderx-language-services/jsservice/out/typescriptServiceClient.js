"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const path=require("path"),vscode=require("vscode"),nls=require("vscode-nls"),diagnostics_1=require("./languageFeatures/diagnostics"),protocol_const_1=require("./protocol.const"),bufferSyncSupport_1=require("./tsServer/bufferSyncSupport"),serverError_1=require("./tsServer/serverError"),spawner_1=require("./tsServer/spawner"),versionManager_1=require("./tsServer/versionManager"),typescriptService_1=require("./typescriptService"),api_1=require("./utils/api"),configuration_1=require("./utils/configuration"),dispose_1=require("./utils/dispose"),fileSchemes=require("./utils/fileSchemes"),logger_1=require("./utils/logger"),platform_1=require("./utils/platform"),pluginPathsProvider_1=require("./utils/pluginPathsProvider"),telemetry_1=require("./utils/telemetry"),tracer_1=require("./utils/tracer"),tsconfig_1=require("./utils/tsconfig"),localize=nls.loadMessageBundle(),configurations=["editor.codeassist.px2rem.enabel","editor.codeassist.px2rem.proportion","editor.codeassist.px2rem.decimalLength","editor.codeassist.px2upx.enabel","editor.codeassist.px2upx.proportion","editor.codeassist.px2upx.decimalLength","javascript.validate.enable","typescript.validate.enable"];var ServerState;!function(e){e.None={type:0};e.Running=class{constructor(e,t,r,i){this.server=e,this.apiVersion=t,this.tsserverVersion=r,this.languageServiceEnabled=i,this.type=1,this.toCancelOnResourceChange=new Set}updateTsserverVersion(e){this.tsserverVersion=e}updateLanguageServiceEnabled(e){this.languageServiceEnabled=e}};e.Errored=class{constructor(e,t){this.error=e,this.tsServerLogFile=t,this.type=2}}}(ServerState||(ServerState={}));class TypeScriptServiceClient extends dispose_1.Disposable{constructor(e,t,r,i){let s,o;super(),this.workspaceState=e,this.inMemoryResourcePrefix="^",this.logger=new logger_1.Logger,this.tracer=new tracer_1.default(this.logger),this.serverState=ServerState.None,this._isPromptingAfterCrash=!1,this.isRestarting=!1,this.hasServerFatallyCrashedTooManyTimes=!1,this.loadingIndicator=new ServerInitializingIndicator,this._onDidChangeCapabilities=this._register(new vscode.EventEmitter),this.onDidChangeCapabilities=this._onDidChangeCapabilities.event,this._onTsServerStarted=this._register(new vscode.EventEmitter),this.onTsServerStarted=this._onTsServerStarted.event,this._onDiagnosticsReceived=this._register(new vscode.EventEmitter),this.onDiagnosticsReceived=this._onDiagnosticsReceived.event,this._onConfigDiagnosticsReceived=this._register(new vscode.EventEmitter),this.onConfigDiagnosticsReceived=this._onConfigDiagnosticsReceived.event,this._onResendModelsRequested=this._register(new vscode.EventEmitter),this.onResendModelsRequested=this._onResendModelsRequested.event,this._onProjectLanguageServiceStateChanged=this._register(new vscode.EventEmitter),this.onProjectLanguageServiceStateChanged=this._onProjectLanguageServiceStateChanged.event,this._onDidBeginInstallTypings=this._register(new vscode.EventEmitter),this.onDidBeginInstallTypings=this._onDidBeginInstallTypings.event,this._onDidEndInstallTypings=this._register(new vscode.EventEmitter),this.onDidEndInstallTypings=this._onDidEndInstallTypings.event,this._onTypesInstallerInitializationFailed=this._register(new vscode.EventEmitter),this.onTypesInstallerInitializationFailed=this._onTypesInstallerInitializationFailed.event,this._onSurveyReady=this._register(new vscode.EventEmitter),this.onSurveyReady=this._onSurveyReady.event,this.token=0,this.pluginManager=r.pluginManager,this.logDirectoryProvider=r.logDirectoryProvider,this.cancellerFactory=r.cancellerFactory,this.versionProvider=r.versionProvider,this.processFactory=r.processFactory,this.pathSeparator=path.sep,this.lastStart=Date.now();const n=new Promise(((e,t)=>{s=e,o=t}));this._onReady={promise:n,resolve:s,reject:o},this.numberRestarts=0,this._configuration=configuration_1.TypeScriptServiceConfiguration.loadFromWorkspace(),this.versionProvider.updateConfiguration(this._configuration),this.pluginPathsProvider=new pluginPathsProvider_1.TypeScriptPluginPathsProvider(this._configuration),this._versionManager=this._register(new versionManager_1.TypeScriptVersionManager(this._configuration,this.versionProvider,this.workspaceState)),this._register(this._versionManager.onDidPickNewVersion((()=>{this.restartTsServer()}))),this.bufferSyncSupport=new bufferSyncSupport_1.default(this,i,t),this.onReady((()=>{let e=vscode.workspace.getConfiguration(),t=Object.create(null);configurations.forEach((r=>{t["@workspace/"+r]=e.get(r)})),this.syncWorkspaceConfiguration(t);let r=vscode.workspace.onDidChangeConfiguration((t=>{let r;for(let i=0;i<configurations.length;i++){const s=configurations[i];if(t.affectsConfiguration(s)){r=Object.create(null),r["@workspace/"+s]=e.get(s);break}}r&&this.syncWorkspaceConfiguration(r)}));this._disposables.push(r),this.bufferSyncSupport.listen()})),this.diagnosticsManager=new diagnostics_1.DiagnosticsManager("typescript",t),this.bufferSyncSupport.onDelete((e=>{this.cancelInflightRequestsForResource(e),this.diagnosticsManager.delete(e)}),null,this._disposables),this.bufferSyncSupport.onWillChange((e=>{this.cancelInflightRequestsForResource(e)})),vscode.workspace.onDidChangeConfiguration((()=>{const e=this._configuration;this._configuration=configuration_1.TypeScriptServiceConfiguration.loadFromWorkspace(),this.versionProvider.updateConfiguration(this._configuration),this._versionManager.updateConfiguration(this._configuration),this.pluginPathsProvider.updateConfiguration(this._configuration),this.tracer.updateConfiguration(),1===this.serverState.type&&(this._configuration.checkJs===e.checkJs&&this._configuration.experimentalDecorators===e.experimentalDecorators||this.setCompilerOptionsForInferredProjects(this._configuration),this._configuration.isEqualTo(e)||this.restartTsServer())}),this,this._disposables),this.telemetryReporter=this._register(new telemetry_1.VSCodeTelemetryReporter((()=>1===this.serverState.type&&this.serverState.tsserverVersion?this.serverState.tsserverVersion:this.apiVersion.fullVersionString))),this.typescriptServerSpawner=new spawner_1.TypeScriptServerSpawner(this.versionProvider,this._versionManager,this.logDirectoryProvider,this.pluginPathsProvider,this.logger,this.telemetryReporter,this.tracer,this.processFactory),this._register(this.pluginManager.onDidUpdateConfig((e=>{this.configurePlugin(e.pluginId,e.config)}))),this._register(this.pluginManager.onDidChangePlugins((()=>{this.restartTsServer()})))}syncWorkspaceConfiguration(e){const t={hostInfo:"hbuilder",preferences:{providePrefixAndSuffixTextForRename:!0,allowRenameOfImportPath:!0,includePackageJsonAutoImports:this.configuration.includePackageJsonAutoImports,...e}};this.executeWithoutWaitingForResponse("configure",t)}get capabilities(){return(0,platform_1.isWeb)()?new typescriptService_1.ClientCapabilities(typescriptService_1.ClientCapability.Syntax,typescriptService_1.ClientCapability.EnhancedSyntax):this.apiVersion.gte(api_1.default.v400)?new typescriptService_1.ClientCapabilities(typescriptService_1.ClientCapability.Syntax,typescriptService_1.ClientCapability.EnhancedSyntax,typescriptService_1.ClientCapability.Semantic):new typescriptService_1.ClientCapabilities(typescriptService_1.ClientCapability.Syntax,typescriptService_1.ClientCapability.Semantic)}cancelInflightRequestsForResource(e){if(1===this.serverState.type)for(const t of this.serverState.toCancelOnResourceChange)t.resource.toString()===e.toString()&&t.cancel()}get configuration(){return this._configuration}dispose(){super.dispose(),this.bufferSyncSupport.dispose(),1===this.serverState.type&&this.serverState.server.kill(),this.loadingIndicator.reset()}restartTsServer(){1===this.serverState.type&&(this.info("Killing TS Server"),this.isRestarting=!0,this.serverState.server.kill()),this.serverState=this.startService(!0)}get apiVersion(){return 1===this.serverState.type?this.serverState.apiVersion:api_1.default.defaultVersion}onReady(e){return this._onReady.promise.then(e)}info(e,t){this.logger.info(e,t)}error(e,t){this.logger.error(e,t)}logTelemetry(e,t){this.telemetryReporter.logTelemetry(e,t)}service(){if(1===this.serverState.type)return this.serverState;if(2===this.serverState.type)throw this.serverState.error;const e=this.startService();if(1===e.type)return e;throw new Error(`Could not create TS service. Service state:${JSON.stringify(e)}`)}ensureServiceStarted(){1!==this.serverState.type&&this.startService()}startService(e=!1){if(this.info("Starting TS Server "),this.isDisposed)return this.info("Not starting server. Disposed "),ServerState.None;if(this.hasServerFatallyCrashedTooManyTimes)return this.info("Not starting server. Too many crashes."),ServerState.None;let t=this._versionManager.currentVersion;t.isValid||(vscode.window.showWarningMessage(localize("noServerFound","The path {0} doesn't point to a valid tsserver install. Falling back to bundled TypeScript version.",t.path)),this._versionManager.reset(),t=this._versionManager.currentVersion),this.info(`Using tsserver from: ${t.path}`);const r=t.apiVersion||api_1.default.defaultVersion;let i=++this.token;const s=this.typescriptServerSpawner.spawn(t,this.capabilities,this.configuration,this.pluginManager,this.cancellerFactory,{onFatalError:(e,t)=>this.fatalError(e,t)});return this.serverState=new ServerState.Running(s,r,void 0,!0),this.lastStart=Date.now(),this.logTelemetry("tsserver.spawned",{localTypeScriptVersion:this.versionProvider.localVersion?this.versionProvider.localVersion.displayName:"",typeScriptVersionSource:t.source}),s.onError((e=>{this.token===i&&(e&&vscode.window.showErrorMessage(localize("serverExitedWithError","TypeScript language server exited with error. Error message is: {0}",e.message||e.name)),this.serverState=new ServerState.Errored(e,s.tsServerLogFile),this.error("TSServer errored with error.",e),s.tsServerLogFile&&this.error(`TSServer log file: ${s.tsServerLogFile}`),this.logTelemetry("tsserver.error"),this.serviceExited(!1))})),s.onExit((e=>{this.token===i&&(null==e?this.info("TSServer exited"):(this.error(`TSServer exited with code: ${e}`),this.logTelemetry("tsserver.exitWithCode",{code:e})),s.tsServerLogFile&&this.info(`TSServer log file: ${s.tsServerLogFile}`),this.serviceExited(!this.isRestarting),this.isRestarting=!1)})),s.onEvent((e=>this.dispatchEvent(e))),r.gte(api_1.default.v300)&&this.capabilities.has(typescriptService_1.ClientCapability.Semantic)&&this.loadingIndicator.startedLoadingProject(void 0),this.serviceStarted(e),this._onReady.resolve(),this._onTsServerStarted.fire({version:t,usedApiVersion:r}),this._onDidChangeCapabilities.fire(),this.serverState}async showVersionPicker(){this._versionManager.promptUserForVersion()}async openTsServerLogFile(){if(this._configuration.tsServerLogLevel===configuration_1.TsServerLogLevel.Off)return vscode.window.showErrorMessage(localize("typescript.openTsServerLog.loggingNotEnabled","TS Server logging is off. Please set `typescript.tsserver.log` and restart the TS server to enable logging"),{title:localize("typescript.openTsServerLog.enableAndReloadOption","Enable logging and restart TS server")}).then((e=>{if(e)return vscode.workspace.getConfiguration().update("typescript.tsserver.log","verbose",!0).then((()=>{this.restartTsServer()}))})),!1;if(1!==this.serverState.type||!this.serverState.server.tsServerLogFile)return vscode.window.showWarningMessage(localize("typescript.openTsServerLog.noLogFile","TS Server has not started logging.")),!1;try{const e=await vscode.workspace.openTextDocument(vscode.Uri.file(this.serverState.server.tsServerLogFile));return await vscode.window.showTextDocument(e),!0}catch(e){}try{return await vscode.commands.executeCommand("revealFileInOS",vscode.Uri.file(this.serverState.server.tsServerLogFile)),!0}catch(e){return vscode.window.showWarningMessage(localize("openTsServerLog.openFileFailedFailed","Could not open TS Server log file")),!1}}serviceStarted(e){this.bufferSyncSupport.reset();const t=this.apiVersion.gte(api_1.default.v380)?this.configuration.watchOptions:void 0,r={hostInfo:"hbuilder",preferences:{providePrefixAndSuffixTextForRename:!0,allowRenameOfImportPath:!0,includePackageJsonAutoImports:this._configuration.includePackageJsonAutoImports},watchOptions:t,extraFileExtensions:[{extension:".vue",isMixedContent:!0,scriptKind:7},{extension:".nvue",isMixedContent:!0,scriptKind:7}]};this.executeWithoutWaitingForResponse("configure",r),this.setCompilerOptionsForInferredProjects(this._configuration),e&&(this._onResendModelsRequested.fire(),this.bufferSyncSupport.reinitialize(),this.bufferSyncSupport.requestAllDiagnostics());for(const[e,t]of this.pluginManager.configurations())this.configurePlugin(e,t)}setCompilerOptionsForInferredProjects(e){const t={options:this.getCompilerOptionsForInferredProjects(e)};this.executeWithoutWaitingForResponse("compilerOptionsForInferredProjects",t)}getCompilerOptionsForInferredProjects(e){return{...(0,tsconfig_1.inferredProjectCompilerOptions)(0,e),allowJs:!0,allowSyntheticDefaultImports:!0,allowNonTsExtensions:!0,resolveJsonModule:!0}}serviceExited(e){this.loadingIndicator.reset();const t=this.serverState;if(this.serverState=ServerState.None,e){const e=Date.now()-this.lastStart;this.numberRestarts++;let r=!0;const i={title:localize("serverDiedReportIssue","Report Issue")};let s;this.numberRestarts>5?(this.numberRestarts=0,e<1e4?(this.lastStart=Date.now(),r=!1,this.hasServerFatallyCrashedTooManyTimes=!0,s=vscode.window.showErrorMessage(localize("serverDiedAfterStart","The TypeScript language service died 5 times right after it got started. The service will not be restarted."),i),this.logTelemetry("serviceExited")):e<3e5&&(this.lastStart=Date.now(),s=vscode.window.showWarningMessage(localize("serverDied","The TypeScript language service died unexpectedly 5 times in the last 5 Minutes."),i))):["vscode-insiders","code-oss"].includes(vscode.env.uriScheme)&&!this._isPromptingAfterCrash&&2===t.type&&t.error instanceof serverError_1.TypeScriptServerError&&(this.numberRestarts=0,this._isPromptingAfterCrash=!0,s=vscode.window.showWarningMessage(localize("serverDiedOnce","The TypeScript language service died unexpectedly."),i)),null==s||s.then((e=>{if(this._isPromptingAfterCrash=!1,e===i){const e=2===t.type&&t.error instanceof serverError_1.TypeScriptServerError?getReportIssueArgsForError(t.error,t.tsServerLogFile):void 0;vscode.commands.executeCommand("workbench.action.openIssueReporter",e)}})),r&&this.startService(!0)}}normalizedPath(e){if(!fileSchemes.disabledSchemes.has(e.scheme)){if(e.scheme===fileSchemes.file){let t=e.fsPath;if(!t)return;return t=path.normalize(t),t.replace(new RegExp("\\"+this.pathSeparator,"g"),"/")}return this.inMemoryResourcePrefix+e.toString(!0)}}toPath(e){return this.normalizedPath(e)}toOpenedFilePath(e){if(this.bufferSyncSupport.ensureHasBuffer(e.uri))return this.toPath(e.uri)||void 0;fileSchemes.disabledSchemes.has(e.uri.scheme)||console.error(`Unexpected resource ${e.uri}`)}toResource(e){if(e.startsWith(this.inMemoryResourcePrefix)){const t=vscode.Uri.parse(e.slice(1));return this.bufferSyncSupport.toVsCodeResource(t)}return this.bufferSyncSupport.toResource(e)}getWorkspaceRootForResource(e){const t=vscode.workspace.workspaceFolders?Array.from(vscode.workspace.workspaceFolders):void 0;if(t&&t.length&&(e.scheme===fileSchemes.file||e.scheme===fileSchemes.untitled)){for(const r of t.sort(((e,t)=>e.uri.fsPath.length-t.uri.fsPath.length)))if(e.fsPath.startsWith(r.uri.fsPath+path.sep))return r.uri.fsPath;return t[0].uri.fsPath}}execute(e,t,r,i){let s;if(null==i?void 0:i.cancelOnResourceChange){const o=this.service(),n=new vscode.CancellationTokenSource;r.onCancellationRequested((()=>n.cancel()));const a={resource:i.cancelOnResourceChange,cancel:()=>n.cancel()};o.toCancelOnResourceChange.add(a),s=this.executeImpl(e,t,{isAsync:!1,token:n.token,expectsResult:!0,...i}).finally((()=>{o.toCancelOnResourceChange.delete(a),n.dispose()}))}else s=this.executeImpl(e,t,{isAsync:!1,token:r,expectsResult:!0,...i});return(null==i?void 0:i.nonRecoverable)&&s.catch((t=>this.fatalError(e,t))),s}executeWithoutWaitingForResponse(e,t){this.executeImpl(e,t,{isAsync:!1,token:void 0,expectsResult:!1})}executeAsync(e,t,r){return this.executeImpl(e,t,{isAsync:!0,token:r,expectsResult:!0})}executeImpl(e,t,r){this.bufferSyncSupport.beforeCommand(e);return this.service().server.executeImpl(e,t,r)}interruptGetErr(e){return this.bufferSyncSupport.interuptGetErr(e)}fatalError(e,t){if(this.logTelemetry("fatalError",{...t instanceof serverError_1.TypeScriptServerError?t.telemetry:{command:e}}),console.error(`A non-recoverable error occured while executing tsserver command: ${e}`),t instanceof serverError_1.TypeScriptServerError&&t.serverErrorText&&console.error(t.serverErrorText),1===this.serverState.type){this.info("Killing TS Server");const e=this.serverState.server.tsServerLogFile;this.serverState.server.kill(),t instanceof serverError_1.TypeScriptServerError&&(this.serverState=new ServerState.Errored(t,e))}}dispatchEvent(e){switch(e.event){case protocol_const_1.EventName.syntaxDiag:case protocol_const_1.EventName.semanticDiag:case protocol_const_1.EventName.suggestionDiag:this.loadingIndicator.reset();const t=e;t.body&&t.body.diagnostics&&this._onDiagnosticsReceived.fire({kind:getDignosticsKind(e),resource:this.toResource(t.body.file),diagnostics:t.body.diagnostics});break;case protocol_const_1.EventName.configFileDiag:this._onConfigDiagnosticsReceived.fire(e);break;case protocol_const_1.EventName.telemetry:{const t=e.body;this.dispatchTelemetryEvent(t);break}case protocol_const_1.EventName.projectLanguageServiceState:{const t=e.body;1===this.serverState.type&&this.serverState.updateLanguageServiceEnabled(t.languageServiceEnabled),this._onProjectLanguageServiceStateChanged.fire(t);break}case protocol_const_1.EventName.projectsUpdatedInBackground:const r=e.body.openFiles.map((e=>this.toResource(e)));this.bufferSyncSupport.getErr(r);break;case protocol_const_1.EventName.beginInstallTypes:this._onDidBeginInstallTypings.fire(e.body);break;case protocol_const_1.EventName.endInstallTypes:this._onDidEndInstallTypings.fire(e.body);break;case protocol_const_1.EventName.typesInstallerInitializationFailed:this._onTypesInstallerInitializationFailed.fire(e.body);break;case protocol_const_1.EventName.surveyReady:this._onSurveyReady.fire(e.body);break;case protocol_const_1.EventName.projectLoadingStart:this.loadingIndicator.startedLoadingProject(e.body.projectName);break;case protocol_const_1.EventName.projectLoadingFinish:this.loadingIndicator.finishedLoadingProject(e.body.projectName)}}dispatchTelemetryEvent(e){const t=Object.create(null);if("typingsInstalled"===e.telemetryEventName){const r=e.payload;t.installedPackages=r.installedPackages,"boolean"==typeof r.installSuccess&&(t.installSuccess=r.installSuccess.toString()),"string"==typeof r.typingsInstallerVersion&&(t.typingsInstallerVersion=r.typingsInstallerVersion)}else{const r=e.payload;r&&Object.keys(r).forEach((e=>{try{r.hasOwnProperty(e)&&(t[e]="string"==typeof r[e]?r[e]:JSON.stringify(r[e]))}catch(e){}}))}"projectInfo"===e.telemetryEventName&&1===this.serverState.type&&this.serverState.updateTsserverVersion(t.version),this.logTelemetry(e.telemetryEventName,t)}configurePlugin(e,t){this.apiVersion.gte(api_1.default.v314)&&this.executeWithoutWaitingForResponse("configurePlugin",{pluginName:e,configuration:t})}}function getReportIssueArgsForError(e,t){var r;if(!e.serverStack||!e.serverMessage)return;const i=["❗️❗️❗️ Please fill in the sections below to help us diagnose the issue ❗️❗️❗️",`**TypeScript Version:** ${null===(r=e.version.apiVersion)||void 0===r?void 0:r.fullVersionString}`,"**Steps to reproduce crash**\n\n1.\n2.\n3."];return t?i.push(`**TS Server Log**\n\n❗️ Please review and upload this log file to help us diagnose this crash:\n\n\`${t}\`\n\nThe log file may contain personal data, including full paths and source code from your workspace. You can scrub the log file to remove paths or other personal information.\n`):i.push('**TS Server Log**\n\n❗️Server logging disabled. To help us fix crashes like this, please enable logging by setting:\n\n```json\n"typescript.tsserver.log": "verbose"\n```\n\nAfter enabling this setting, future crash reports will include the server log.'),i.push(`**TS Server Error Stack**\n\nServer: \`${e.serverId}\`\n\n\`\`\`\n${e.serverStack}\n\`\`\``),{extensionId:"vscode.typescript-language-features",issueTitle:`TS Server fatal error:  ${e.serverMessage}`,issueBody:i.join("\n\n")}}function getDignosticsKind(e){switch(e.event){case"syntaxDiag":return 0;case"semanticDiag":return 1;case"suggestionDiag":return 2}throw new Error("Unknown dignostics kind")}exports.default=TypeScriptServiceClient;class ServerInitializingIndicator extends dispose_1.Disposable{reset(){}startedLoadingProject(e){}finishedLoadingProject(e){}}