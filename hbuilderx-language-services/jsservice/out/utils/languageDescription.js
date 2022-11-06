"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.doesResourceLookLikeAJavaScriptFile=exports.doesResourceLookLikeATypeScriptFile=exports.isJsConfigOrTsConfigFileName=exports.isTsConfigFileName=exports.standardLanguageDescriptions=exports.allDiagnosticLanguages=void 0;const path_1=require("path"),languageModeIds=require("./languageModeIds");function isTsConfigFileName(e){return/^tsconfig\.(.+\.)?json$/i.test((0,path_1.basename)(e))}function isJsConfigOrTsConfigFileName(e){return/^[jt]sconfig\.(.+\.)?json$/i.test((0,path_1.basename)(e))}function doesResourceLookLikeATypeScriptFile(e){return/\.tsx?$/i.test(e.fsPath)}function doesResourceLookLikeAJavaScriptFile(e){return/\.jsx?$/i.test(e.fsPath)}exports.allDiagnosticLanguages=[0,1],exports.standardLanguageDescriptions=[{id:"typescript",diagnosticOwner:"typescript",diagnosticSource:"ts",diagnosticLanguage:1,modeIds:[languageModeIds.typescript,languageModeIds.typescriptreact],configFilePattern:/^tsconfig(\..*)?\.json$/gi},{id:"javascript",diagnosticOwner:"typescript",diagnosticSource:"ts",diagnosticLanguage:0,modeIds:[languageModeIds.javascript,languageModeIds.javascriptreact],configFilePattern:/^jsconfig(\..*)?\.json$/gi},{id:"javascript_es6",diagnosticOwner:"typescript",diagnosticSource:"ts",diagnosticLanguage:0,modeIds:["javascript_es6"],configFilePattern:/^jsconfig(\..*)?\.json$/gi}],exports.isTsConfigFileName=isTsConfigFileName,exports.isJsConfigOrTsConfigFileName=isJsConfigOrTsConfigFileName,exports.doesResourceLookLikeATypeScriptFile=doesResourceLookLikeATypeScriptFile,exports.doesResourceLookLikeAJavaScriptFile=doesResourceLookLikeAJavaScriptFile;