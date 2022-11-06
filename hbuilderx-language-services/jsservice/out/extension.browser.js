"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.activate=void 0;const vscode=require("vscode"),api_1=require("./api"),index_1=require("./commands/index"),languageConfiguration_1=require("./languageFeatures/languageConfiguration"),lazyClientHost_1=require("./lazyClientHost"),cancellation_1=require("./tsServer/cancellation"),logDirectoryProvider_1=require("./tsServer/logDirectoryProvider"),versionProvider_1=require("./tsServer/versionProvider"),serverProcess_browser_1=require("./tsServer/serverProcess.browser"),api_2=require("./utils/api"),commandManager_1=require("./commands/commandManager"),plugins_1=require("./utils/plugins");class StaticVersionProvider{constructor(e){this._version=e,this.globalVersion=void 0,this.localVersion=void 0,this.localVersions=[]}updateConfiguration(e){}get defaultVersion(){return this._version}get bundledVersion(){return this._version}}function activate(e){const r=new plugins_1.PluginManager;e.subscriptions.push(r);const i=new commandManager_1.CommandManager;e.subscriptions.push(i),e.subscriptions.push(new languageConfiguration_1.LanguageConfigurationManager);const o=new vscode.EventEmitter;e.subscriptions.push(o);const s=new StaticVersionProvider(new versionProvider_1.TypeScriptVersion("bundled",vscode.Uri.joinPath(e.extensionUri,"dist/browser/typescript-web/tsserver.web.js").toString(),api_2.default.v400)),n=(0,lazyClientHost_1.createLazyClientHost)(e,!1,{pluginManager:r,commandManager:i,logDirectoryProvider:logDirectoryProvider_1.noopLogDirectoryProvider,cancellerFactory:cancellation_1.noopRequestCancellerFactory,versionProvider:s,processFactory:serverProcess_browser_1.WorkerServerProcess},(e=>{o.fire(e)}));return(0,index_1.registerBaseCommands)(i,n,r),Promise.resolve().then((()=>require("./languageFeatures/tsconfig"))).then((r=>{e.subscriptions.push(r.register())})),e.subscriptions.push((0,lazyClientHost_1.lazilyActivateClient)(n,r)),(0,api_1.getExtensionApi)(o.event,r)}exports.activate=activate;