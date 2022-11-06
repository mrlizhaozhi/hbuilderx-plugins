"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.deactivate=exports.activate=void 0;const rimraf=require("rimraf"),vscode=require("vscode"),commandManager_1=require("./commands/commandManager"),index_1=require("./commands/index"),schemaManager_1=require("./jsonHandler/schemaManager"),languageConfiguration_1=require("./languageFeatures/languageConfiguration"),lazyClientHost_1=require("./lazyClientHost"),cancellation_electron_1=require("./tsServer/cancellation.electron"),logDirectoryProvider_electron_1=require("./tsServer/logDirectoryProvider.electron"),serverProcess_electron_1=require("./tsServer/serverProcess.electron"),versionProvider_electron_1=require("./tsServer/versionProvider.electron"),cancellation_1=require("./utils/cancellation"),fileSystem_electron_1=require("./utils/fileSystem.electron"),plugins_1=require("./utils/plugins"),temp=require("./utils/temp.electron");async function updateFrameworkLibs(e,r){const n=e.value.serviceClient,s=await n.executeAsync("updateFrameworkLibs",r,cancellation_1.nulToken);let t="add"==r.type?"添加":"移除",o=s.body.success?"成功":"失败",i=s.body.success?"info":"warn";return vscode.window.setStatusBarMessage(`${t}框架语法库${o}`,5e3,i),s.body.success}function activate(e){const r=new plugins_1.PluginManager;e.subscriptions.push(r);const n=new commandManager_1.CommandManager;e.subscriptions.push(n);const s=new vscode.EventEmitter;e.subscriptions.push(s);const t=new logDirectoryProvider_electron_1.NodeLogDirectoryProvider(e),o=new versionProvider_electron_1.DiskTypeScriptVersionProvider;e.subscriptions.push(new languageConfiguration_1.LanguageConfigurationManager),serverProcess_electron_1.ChildServerProcess.inServerDebugMode=e.extensionMode==vscode.ExtensionMode.Development;const i=(0,lazyClientHost_1.createLazyClientHost)(e,(0,fileSystem_electron_1.onCaseInsenitiveFileSystem)(),{pluginManager:r,commandManager:n,logDirectoryProvider:t,cancellerFactory:cancellation_electron_1.nodeRequestCancellerFactory,versionProvider:o,processFactory:serverProcess_electron_1.ChildServerProcess},(e=>{s.fire(e)}));return(0,index_1.registerBaseCommands)(n,i,r),Promise.resolve().then((()=>require("./languageFeatures/tsconfig"))).then((r=>{e.subscriptions.push(r.register())})),Promise.resolve().then((()=>require("./jsonHandler/jsonCompletion"))).then((r=>{e.subscriptions.push(r.register())})),Promise.resolve().then((()=>require("./jsonHandler/jsonHover"))).then((r=>{e.subscriptions.push(r.register())})),Promise.resolve().then((()=>require("./jsonHandler/jsonDefinition"))).then((r=>{e.subscriptions.push(r.register())})),e.subscriptions.push((0,lazyClientHost_1.lazilyActivateClient)(i,r)),{expandJsonServerRegisterSchema:schemaManager_1.expandJsonServerRegisterSchema,updateFrameworkLibs:e=>updateFrameworkLibs(i,e)}}function deactivate(){rimraf.sync(temp.getInstanceTempDir())}exports.activate=activate,exports.deactivate=deactivate;