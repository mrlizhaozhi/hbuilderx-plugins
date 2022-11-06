"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getLanguage=exports.TsServerStylePlugin=void 0;const vscode_css_languageservice_1=require("vscode-css-languageservice"),dataProvider_1=require("./dataProvider"),styleExtraPlugin_1=require("./modes/plugin/styleExtraPlugin"),styleMode_1=require("./modes/styleMode"),plugins_1=require("./plugins"),styleData_1=require("./styleData"),styleScriptCache_1=require("./styleScriptCache");function isStyleFile(e){let t=getLanguage(e);return"css"===t||"scss"===t||"less"===t}function getLanguage(e){return e.endsWith(".css")||e.endsWith(".wxss")||e.endsWith(".acss")||e.endsWith(".ttss")||e.endsWith(".qss")||e.endsWith(".nss")?"css":e.endsWith(".scss")||e.endsWith(".sass")?"scss":e.endsWith(".less")||e.endsWith(".less.erb")?"less":void 0}function create(e){let t=e.languageService;const i=Object.create(null);for(let e of Object.keys(t)){const n=t[e];i[e]=(...e)=>n.apply(t,e)}let n=e.tsinfo.languageServiceHost;const o=n.getScriptVersion.bind(n),s=n.getScriptSnapshot.bind(n),r=n.getScriptFileNames.bind(n);let l=new Map;l.set("css",(0,vscode_css_languageservice_1.getCSSLanguageService)()),l.set("scss",(0,vscode_css_languageservice_1.getSCSSLanguageService)()),l.set("less",(0,vscode_css_languageservice_1.getLESSLanguageService)());let c=[new dataProvider_1.CSSDataProvider(styleData_1.cssData)],a=new Map;l.forEach(((e,t)=>{e.setDataProviders(!1,c),a.set(t,c)}));let g=(0,plugins_1.styleEnablePluginProxy)({styleLanguageServiceList:l,project:e.project});l=new styleExtraPlugin_1.StyleExtraPluginModule(e,a,[]).create({styleLanguageServiceList:g,project:e.project});const u=new styleScriptCache_1.StyleScriptCache(e.ts,{getScriptVersion:o,getScriptSnapshot:s});n.getScriptSnapshot=e=>isStyleFile(e)?u.getScriptSnapshot(e):s(e),n.getScriptFileNames=function(){let e=[];return e=r().filter((e=>!isStyleFile(e))),e};let f=new styleMode_1.StyleMode(e,u,g,a);return i.cleanupSemanticCache=function(){},i.getSyntacticDiagnostics=function(e){return isStyleFile(e)?[]:t.getSyntacticDiagnostics(e)},i.getSemanticDiagnostics=function(e){return isStyleFile(e)?[]:t.getSemanticDiagnostics(e)},i.getSuggestionDiagnostics=function(e){return isStyleFile(e)?[]:t.getSuggestionDiagnostics(e)},i.getCompilerOptionsDiagnostics=function(){return t.getCompilerOptionsDiagnostics()},i.getSyntacticClassifications=function(e,i){return isStyleFile(e)?[]:t.getSyntacticClassifications(e,i)},i.getSemanticClassifications=function(e,i){return isStyleFile(e)?[]:t.getSemanticClassifications(e,i)},i.getEncodedSyntacticClassifications=function(e,i){return t.getEncodedSyntacticClassifications(e,i)},i.getEncodedSemanticClassifications=function(e,i,n){return t.getEncodedSemanticClassifications(e,i,n)},i.getCompletionsAtPosition=function(e,i,n){if(isStyleFile(e)){let o=f.getCompletionsAtPosition(t,e,i,n);return(null==o?void 0:o.isIncomplete)&&(o.metadata={isIncomplete:!0}),o}return t.getCompletionsAtPosition(e,i,n)},i.getCompletionEntryDetails=function(e,i,n,o,s,r,l){if(isStyleFile(e)){return f.getCompletionEntryDetails(t,e,i,n,o,s,r,l)}return t.getCompletionEntryDetails(e,i,n,o,s,r,l)},i.getCompletionEntrySymbol=function(e,i,n,o){if(!isStyleFile(e))return t.getCompletionEntrySymbol(e,i,n,o)},i.getQuickInfoAtPosition=function(e,i){if(isStyleFile(e)){return f.getQuickInfoAtPosition(t,e,i)}return t.getQuickInfoAtPosition(e,i)},i.getNameOrDottedNameSpan=function(e,i,n){if(!isStyleFile(e))return t.getNameOrDottedNameSpan(e,i,n)},i.getBreakpointStatementAtPosition=function(e,i){if(!isStyleFile(e))return t.getBreakpointStatementAtPosition(e,i)},i.getSignatureHelpItems=function(e,i,n){if(!isStyleFile(e))return t.getSignatureHelpItems(e,i,n)},i.getRenameInfo=function(e,i,n){return t.getRenameInfo(e,i,n)},i.findRenameLocations=function(e,i,n,o,s){if(!isStyleFile(e))return t.findRenameLocations(e,i,n,o,s)},i.getSmartSelectionRange=function(e,i){return t.getSmartSelectionRange(e,i)},i.getDefinitionAtPosition=function(e,i){if(!isStyleFile(e))return t.getDefinitionAtPosition(e,i)},i.getDefinitionAndBoundSpan=function(e,i){if(isStyleFile(e)){return f.getDefinitionAndBoundSpan(t,e,i)}return t.getDefinitionAndBoundSpan(e,i)},i.getTypeDefinitionAtPosition=function(e,i){if(!isStyleFile(e))return t.getTypeDefinitionAtPosition(e,i)},i.getImplementationAtPosition=function(e,i){if(!isStyleFile(e))return t.getImplementationAtPosition(e,i)},i.getReferencesAtPosition=function(e,i){if(!isStyleFile(e))return t.getReferencesAtPosition(e,i)},i.findReferences=function(e,i){if(!isStyleFile(e))return t.findReferences(e,i)},i.getDocumentHighlights=function(e,i,n){if(!isStyleFile(e))return t.getDocumentHighlights(e,i,n)},i.getFileReferences=function(e){return isStyleFile(e)?[]:t.getFileReferences(e)},i.getOccurrencesAtPosition=function(e,i){return isStyleFile(e)?[]:t.getOccurrencesAtPosition(e,i)},i.getNavigateToItems=function(e,i,n,o){return!n||isStyleFile(n)?[]:t.getNavigateToItems(e,i,n,o)},i.getNavigationBarItems=function(e){return isStyleFile(e)?[]:t.getNavigationBarItems(e)},i.getNavigationTree=function(i){if(isStyleFile(i)){let n={text:"",kind:e.ts.ScriptElementKind.alias,kindModifiers:"",spans:[],nameSpan:void 0},o=f.getNavigationTree(t,i);return o||n}return t.getNavigationTree(i)},i.prepareCallHierarchy=function(e,i){if(!isStyleFile(e))return t.prepareCallHierarchy(e,i)},i.provideCallHierarchyIncomingCalls=function(e,i){return isStyleFile(e)?[]:t.provideCallHierarchyIncomingCalls(e,i)},i.provideCallHierarchyOutgoingCalls=function(e,i){return isStyleFile(e)?[]:t.provideCallHierarchyOutgoingCalls(e,i)},i.provideInlayHints=function(e,i,n){return isStyleFile(e)?[]:t.provideInlayHints(e,i,n)},i.getOutliningSpans=function(e){return isStyleFile(e)?[]:t.getOutliningSpans(e)},i.getTodoComments=function(e,i){return isStyleFile(e)?[]:t.getTodoComments(e,i)},i.getBraceMatchingAtPosition=function(e,i){return isStyleFile(e)?[]:t.getBraceMatchingAtPosition(e,i)},i.getIndentationAtPosition=function(e,i,n){return t.getIndentationAtPosition(e,i,n)},i.getFormattingEditsForRange=function(e,i,n,o){return isStyleFile(e)?[]:t.getFormattingEditsForRange(e,i,n,o)},i.getFormattingEditsForDocument=function(e,i){return isStyleFile(e)?[]:t.getFormattingEditsForDocument(e,i)},i.getFormattingEditsAfterKeystroke=function(e,i,n,o){return isStyleFile(e)?[]:t.getFormattingEditsAfterKeystroke(e,i,n,o)},i.getDocCommentTemplateAtPosition=function(e,i,n){if(!isStyleFile(e))return t.getDocCommentTemplateAtPosition(e,i,n)},i.isValidBraceCompletionAtPosition=function(e,i,n){return t.isValidBraceCompletionAtPosition(e,i,n)},i.getJsxClosingTagAtPosition=function(e,i){if(!isStyleFile(e))return t.getJsxClosingTagAtPosition(e,i)},i.getSpanOfEnclosingComment=function(e,i,n){if(!isStyleFile(e))return t.getSpanOfEnclosingComment(e,i,n)},i.toLineColumnOffset=function(e,i){if(isStyleFile(e)){let t=u.getUpToDateInfo(e);if(t){let e=t.styleDocument.positionAt(i);return{line:e.line,character:e.character}}}return t.toLineColumnOffset(e,i)},i.getCodeFixesAtPosition=function(e,i,n,o,s,r){return isStyleFile(e)?[]:t.getCodeFixesAtPosition(e,i,n,o,s,r)},i.getCombinedCodeFix=function(e,i,n,o){return t.getCombinedCodeFix(e,i,n,o)},i.getApplicableRefactors=function(e,i,n,o,s){return isStyleFile(e)?[]:t.getApplicableRefactors(e,i,n,o,s)},i.getEditsForRefactor=function(e,i,n,o,s,r){if(!isStyleFile(e))return t.getEditsForRefactor(e,i,n,o,s,r)},i.organizeImports=function(e,i,n){return t.organizeImports(e,i,n)},i.getEditsForFileRename=function(e,i,n,o){return t.getEditsForFileRename(e,i,n,o)},i.getEmitOutput=function(e,i,n){return t.getEmitOutput(e,i,n)},i.getProgram=function(){return t.getProgram()},i.toggleLineComment=function(e,i){return isStyleFile(e)?[]:t.toggleLineComment(e,i)},i.toggleMultilineComment=function(e,i){return isStyleFile(e)?[]:t.toggleMultilineComment(e,i)},i.commentSelection=function(e,i){return isStyleFile(e)?[]:t.commentSelection(e,i)},i.uncommentSelection=function(e,i){return isStyleFile(e)?[]:t.uncommentSelection(e,i)},i.dispose=function(){},i}exports.getLanguage=getLanguage;const TsServerStylePlugin={create:create};exports.TsServerStylePlugin=TsServerStylePlugin;