"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.startClient=void 0;const nls=require("vscode-nls"),localize=nls.loadMessageBundle(),vscode_1=require("vscode"),vscode_languageclient_1=require("vscode-languageclient"),htmlEmptyTagsShared_1=require("./htmlEmptyTagsShared"),tagClosing_1=require("./tagClosing"),customData_1=require("./customData"),client_1=require("../../../utils/client");var CustomDataChangedNotification,TagCloseRequest,SemanticTokenRequest,SemanticTokenLegendRequest,SettingIds;function startClient(e,t,n){let o,a=e.subscriptions,i=["html","html_es6","handlebars","vue"];const s=(0,customData_1.getCustomDataSource)(e.subscriptions);let r={documentSelector:i,synchronize:{configurationSection:["html","css","javascript","vue"],fileEvents:vscode_1.workspace.createFileSystemWatcher("**/package.json")},initializationOptions:{embeddedLanguages:{css:!0,javascript:!0},handledSchemas:["file"],provideFormatter:!1},outputChannel:new client_1.LogRedirectOutputChannel(localize("htmlserver.name","HTML Language Server")),middleware:{resolveCompletionItem:(e,t,n)=>n(e,t),provideCompletionItem(e,t,n,o,a){function i(e){const n=e.range;n instanceof vscode_1.Range&&n.end.isAfter(t)&&n.start.isBeforeOrEqual(t)&&(e.range={inserting:new vscode_1.Range(n.start,t),replacing:n})}function s(e){return e&&(Array.isArray(e)?e:e.items).forEach(i),e}const r=a(e,t,n,o);return(d=r)&&d.then?r.then(s):s(r);var d}}},d=t("html",localize("htmlserver.name","HTML Language Server"),r);d.registerProposedFeatures();let c=d.start();a.push(c),d.onReady().then((()=>{d.sendNotification(CustomDataChangedNotification.type,s.uris),s.onDidChange((()=>{d.sendNotification(CustomDataChangedNotification.type,s.uris)}));c=(0,tagClosing_1.activateTagClosing)(((e,t)=>{let n=d.code2ProtocolConverter.asTextDocumentPositionParams(e,t);return d.sendRequest(TagCloseRequest.type,n)}),{html:!0,handlebars:!0},"html.autoClosingTags"),a.push(c),c=d.onTelemetry((e=>{var t;null===(t=n.telemetry)||void 0===t||t.sendTelemetryEvent(e.key,e.data)})),a.push(c),a.push({dispose:()=>o&&o.dispose()}),a.push(vscode_1.workspace.onDidChangeConfiguration((e=>e.affectsConfiguration(SettingIds.formatEnable)&&void 0))),d.sendRequest(SemanticTokenLegendRequest.type).then((e=>{if(e){const t={provideDocumentSemanticTokens(e){const t={textDocument:d.code2ProtocolConverter.asTextDocumentIdentifier(e)};return d.sendRequest(SemanticTokenRequest.type,t).then((e=>e&&new vscode_1.SemanticTokens(new Uint32Array(e))))},provideDocumentRangeSemanticTokens(e,t){const n={textDocument:d.code2ProtocolConverter.asTextDocumentIdentifier(e),ranges:[d.code2ProtocolConverter.asRange(t)]};return d.sendRequest(SemanticTokenRequest.type,n).then((e=>e&&new vscode_1.SemanticTokens(new Uint32Array(e))))}};a.push(vscode_1.languages.registerDocumentSemanticTokensProvider(i,t,new vscode_1.SemanticTokensLegend(e.types,e.modifiers)))}}))})),vscode_1.languages.setLanguageConfiguration("html",{indentationRules:{increaseIndentPattern:/<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|link|meta|param)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/,decreaseIndentPattern:/^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/},wordPattern:/(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,onEnterRules:[{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),afterText:/^<\/([_:\w][_:\w-.\d]*)\s*>/i,action:{indentAction:vscode_1.IndentAction.IndentOutdent}},{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),action:{indentAction:vscode_1.IndentAction.Indent}}]}),vscode_1.languages.setLanguageConfiguration("html_es6",{indentationRules:{increaseIndentPattern:/<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|link|meta|param)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/,decreaseIndentPattern:/^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/},wordPattern:/(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,onEnterRules:[{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),afterText:/^<\/([_:\w][_:\w-.\d]*)\s*>/i,action:{indentAction:vscode_1.IndentAction.IndentOutdent}},{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),action:{indentAction:vscode_1.IndentAction.Indent}}]}),vscode_1.languages.setLanguageConfiguration("vue",{indentationRules:{increaseIndentPattern:/<(?!\?|(?:area|base|br|col|frame|hr|html|img|input|link|meta|param)\b|[^>]*\/>)([-_\.A-Za-z0-9]+)(?=\s|>)\b[^>]*>(?!.*<\/\1>)|<!--(?!.*-->)|\{[^}"']*$/,decreaseIndentPattern:/^\s*(<\/(?!html)[-_\.A-Za-z0-9]+\b[^>]*>|-->|\})/},wordPattern:/(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,onEnterRules:[{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),afterText:/^<\/([_:\w][_:\w-.\d]*)\s*>/i,action:{indentAction:vscode_1.IndentAction.IndentOutdent}},{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),action:{indentAction:vscode_1.IndentAction.Indent}}]}),vscode_1.languages.setLanguageConfiguration("handlebars",{wordPattern:/(-?\d*\.\d\w*)|([^\`\~\!\@\$\^\&\*\(\)\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\s]+)/g,onEnterRules:[{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),afterText:/^<\/([_:\w][_:\w-.\d]*)\s*>/i,action:{indentAction:vscode_1.IndentAction.IndentOutdent}},{beforeText:new RegExp(`<(?!(?:${htmlEmptyTagsShared_1.EMPTY_ELEMENTS.join("|")}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,"i"),action:{indentAction:vscode_1.IndentAction.Indent}}]});const l=/^(\s*)(<(!(-(-\s*(#\w*)?)?)?)?)?$/,g=/^(\s*)(<(h(t(m(l)?)?)?)?)?$/;vscode_1.languages.registerCompletionItemProvider(i,{provideCompletionItems(e,t){const n=[];let o=e.getText(new vscode_1.Range(new vscode_1.Position(t.line,0),t)),a=o.match(l);if(a){let e=new vscode_1.Range(new vscode_1.Position(t.line,a[1].length),t),o=new vscode_1.CompletionItem("#region",vscode_1.CompletionItemKind.Snippet);o.range=e,o.insertText=new vscode_1.SnippetString("\x3c!-- #region $1--\x3e"),o.documentation=localize("folding.start","Folding Region Start"),o.filterText=a[2],o.sortText="za",n.push(o);let i=new vscode_1.CompletionItem("#endregion",vscode_1.CompletionItemKind.Snippet);i.range=e,i.insertText=new vscode_1.SnippetString("\x3c!-- #endregion --\x3e"),i.documentation=localize("folding.end","Folding Region End"),i.filterText=a[2],i.sortText="zb",n.push(i)}let i=o.match(g);if(i&&e.getText(new vscode_1.Range(new vscode_1.Position(0,0),t)).match(g)){let e=new vscode_1.Range(new vscode_1.Position(t.line,i[1].length),t),o=new vscode_1.CompletionItem("HTML sample",vscode_1.CompletionItemKind.Snippet);o.range=e;const a=["<!DOCTYPE html>","<html>","<head>","\t<meta charset='utf-8'>","\t<meta http-equiv='X-UA-Compatible' content='IE=edge'>","\t<title>${1:Page Title}</title>","\t<meta name='viewport' content='width=device-width, initial-scale=1'>","\t<link rel='stylesheet' type='text/css' media='screen' href='${2:main.css}'>","\t<script src='${3:main.js}'><\/script>","</head>","<body>","\t$0","</body>","</html>"].join("\n");o.insertText=new vscode_1.SnippetString(a),o.documentation=localize("folding.html","Simple HTML5 starting point"),o.filterText=i[2],o.sortText="za",n.push(o)}return n}});const m="html.promptForTypeOnRename";if(void 0!==vscode_1.extensions.getExtension("formulahendry.auto-rename-tag")&&!1!==e.globalState.get(m)&&!vscode_1.workspace.getConfiguration("editor",{languageId:"html"}).get("renameOnType")){const t=vscode_1.window.onDidChangeActiveTextEditor((async n=>{if(n&&-1!==i.indexOf(n.document.languageId)){e.globalState.update(m,!1),t.dispose();const n=localize("configureButton","Configure");await vscode_1.window.showInformationMessage(localize("renameOnTypeQuestion","VS Code now has built-in support for auto-renaming tags. Do you want to enable it?"),n)===n&&vscode_1.commands.executeCommand("workbench.action.openSettings",SettingIds.renameOnType)}}));a.push(t)}a.push()}!function(e){e.type=new vscode_languageclient_1.NotificationType("html/customDataChanged")}(CustomDataChangedNotification||(CustomDataChangedNotification={})),function(e){e.type=new vscode_languageclient_1.RequestType("html/tag")}(TagCloseRequest||(TagCloseRequest={})),function(e){e.type=new vscode_languageclient_1.RequestType("html/semanticTokens")}(SemanticTokenRequest||(SemanticTokenRequest={})),function(e){e.type=new vscode_languageclient_1.RequestType0("html/semanticTokenLegend")}(SemanticTokenLegendRequest||(SemanticTokenLegendRequest={})),function(e){e.renameOnType="editor.renameOnType",e.formatEnable="html.format.enable"}(SettingIds||(SettingIds={})),exports.startClient=startClient;