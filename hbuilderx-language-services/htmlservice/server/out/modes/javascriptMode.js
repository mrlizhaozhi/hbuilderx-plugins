"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.convertKind=exports.getJavaScriptMode=void 0;const languageModelCache_1=require("../languageModelCache"),strings_1=require("../utils/strings"),languageModes_1=require("./languageModes"),fs=require("fs"),path=require("path"),ts=require("typescript"),vscode_json_languageservice_1=require("vscode-json-languageservice"),vscode_uri_1=require("vscode-uri"),utils_1=require("../../../../utils"),domtypechecker_1=require("./domtypechecker"),javascriptSemanticTokens_1=require("./javascriptSemanticTokens"),JS_WORD_REGEX=/(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g;function languuage(){return"zh_cn"}function getNlsFilePath(e){if("string"!=typeof e)return;let t=e.split("."),n=null,a=null;t.length>2&&(n=t[0],a=t[1]);let i=path.resolve(__dirname,"../../../../utils/nls");if(n&&a){let e=path.join(i,languuage(),n,`${n}.${a}.js`);if(fs.existsSync(e))return e}}function translate(e,t){let n=require(e);if(n.hasOwnProperty(t))return n[t]}function translateText(e){let t=getNlsFilePath(e);if(t){let n=translate(t,e);n&&(e=n)}return e}function getLanguageServiceHost(e,t){const n={allowNonTsExtensions:!0,allowJs:!0,lib:["lib.es6.d.ts"],target:ts.ScriptTarget.Latest,moduleResolution:ts.ModuleResolutionKind.Classic,experimentalDecorators:!1};let a,i,r,o=languageModes_1.TextDocument.create("init","javascript",1,"");const s=Promise.resolve().then((()=>require("./javascriptLibs"))).then((t=>{const a={getCompilationSettings:()=>n,getScriptFileNames:()=>[o.uri,"jquery"],getScriptKind:t=>t===o.uri?e:"ts"===t.substr(t.length-2)?ts.ScriptKind.TS:ts.ScriptKind.JS,getScriptVersion:e=>e===o.uri?String(o.version):"1",getScriptSnapshot:e=>{let n="";return n=e===o.uri?o.getText():t.loadLibrary(e),{getText:(e,t)=>n.substring(e,t),getLength:()=>n.length,getChangeRange:()=>{}}},getCurrentDirectory:()=>"",getDefaultLibFileName:e=>"es6"};return ts.createLanguageService(a)})),l={get version(){return Number(new Date).toString()},useGlobalDocumentRegistry:!1,get compilerOptions(){return{allowNonTsExtensions:!0,allowJs:!0,lib:["lib.es6.d.ts"],target:ts.ScriptTarget.Latest,moduleResolution:ts.ModuleResolutionKind.Classic,experimentalDecorators:!1}},get typeCheckerPluigns(){return[new domtypechecker_1.default((e=>i))]},get documents(){var e;let t=[];if(void 0!==(null===(e=null==a?void 0:a.attributes)||void 0===e?void 0:e.setup)){let n=path.resolve(__dirname,"../../../../builtin-dts/common/vue.helper.d.ts");t.push(n)}if(r){let i=(0,utils_1.getLibraries)(r.fsPath),s=(0,utils_1.getSettingPath)(r.fsPath);function l(e){fs.existsSync(e)&&fs.statSync(e).isDirectory()&&fs.readdirSync(e).forEach((n=>{if(-1!=i.findIndex((e=>n===e))){let a=path.join(e,n,"index.d.ts");t.push(a)}}))}l(path.resolve(s,"../../../types")),l(path.resolve(__dirname,"../../../../frameworkdts"))}return t.push(o.uri),t},getDocumentKind:t=>t===o.uri?"typescript"===o.languageId?ts.ScriptKind.TS:e:"ts"===t.substr(t.length-2)?ts.ScriptKind.TS:ts.ScriptKind.JS,getDocumentSnapshot(e){let t="";return e==o.uri&&(t=o.getText()),{getText:(e,n)=>t.substring(e,n),getLength:()=>t.length,getChangeRange:()=>{}}},getDocumentVersion:e=>e==o.uri?""+o.version:"1",hasDocument:e=>e==o.uri};return{getLanguageService:async(e,n,g)=>(o=e,a=n,i=g,r=utils_1.hx.getProjectByDocumentUri(e.uri,t.folders),r?Promise.resolve(r.createTSLanguageService(l)):s),getCompilationSettings:()=>n,dispose(){s&&s.then((e=>e.dispose()))}}}function getJavaScriptMode(e,t,n,a){let i=(0,languageModelCache_1.getLanguageModelCache)(10,60,(t=>e.get(t).getEmbeddedDocument(n)));const r=getLanguageServiceHost("javascript"===n?ts.ScriptKind.JS:ts.ScriptKind.TS,a);let o={};function s(e,n){let a,i=t.get(e).findNodeAt(e.offsetAt(n));return"script"==i.tag&&i.attributes&&void 0!==i.attributes.setup&&(a=i),a}return{getId:()=>n,async doValidation(e,t=a.settings){if("javascript"===n)return Promise.resolve([]);r.getCompilationSettings().experimentalDecorators=t&&t.javascript&&t.javascript.implicitProjectConfig.experimentalDecorators;const o=i.get(e),s=await r.getLanguageService(o),l=s.getSyntacticDiagnostics(o.uri),g=s.getSemanticDiagnostics(o.uri);return l.concat(g).map((e=>({range:convertRange(o,e),severity:languageModes_1.DiagnosticSeverity.Error,source:n,message:ts.flattenDiagnosticMessageText(e.messageText,"\n")})))},async doComplete(e,a,o){let l=s(e,a);const g=i.get(e),c=t.get(e);let u=g.offsetAt(a);let d=(await r.getLanguageService(g,l,c)).getCompletionsAtPosition(g.uri,u,{includeExternalModuleExports:!1,includeInsertTextCompletions:!1});if(!d)return{isIncomplete:!1,items:[]};let p=convertRange(g,(0,strings_1.getWordAtText)(g.getText(),u,JS_WORD_REGEX));return{isIncomplete:!1,items:d.entries.map((t=>{var i;let r=t,o=null!==(i=r.insertText)&&void 0!==i?i:r.name,s=r.detail,l=r.documentation;return r.replaceRange&&(p=r.replaceRange),{uri:e.uri,position:a,label:t.name,sortText:t.sortText,detail:s,documentation:l,kind:convertKind(t.kind),textEdit:languageModes_1.TextEdit.replace(p,o),data:{languageId:n,uri:e.uri,offset:u,position:a}}}))}},async doResolve(e,n){var a,o;let l=s(e,null===(a=n.data)||void 0===a?void 0:a.position);const g=i.get(e),c=t.get(e),u=await r.getLanguageService(g,l,c);let d,p=u.getCompletionEntryDetails(g.uri,n.data.offset,n.label,void 0,void 0,void 0,void 0);p&&(n.detail=ts.displayPartsToString(p.displayParts),n.documentation=ts.displayPartsToString(p.documentation)),n.documentation=translateText(n.documentation),null===(o=null==p?void 0:p.tags)||void 0===o||o.forEach((e=>{n.documentation+=`<br />@${null==e?void 0:e.name} ${ts.displayPartsToString(null==e?void 0:e.text)}`}));let m=u.getProgram();m&&(d=m.getSourceFile(g.uri));let f=utils_1.hx.resolveJSCompletionItem(n,d);return delete n.data,f},async doHover(e,n){var a;let o=s(e,n);const l=i.get(e),g=t.get(e);let c=(await r.getLanguageService(l,o,g)).getQuickInfoAtPosition(l.uri,l.offsetAt(n));if(c){let e={language:"typescript",value:ts.displayPartsToString(c.displayParts)},t=ts.displayPartsToString(c.documentation);return t=translateText(t),null===(a=null==c?void 0:c.tags)||void 0===a||a.forEach((e=>{t+=`<br />@${null==e?void 0:e.name} ${ts.displayPartsToString(null==e?void 0:e.text)}`})),{range:convertRange(l,c.textSpan),contents:[e,t]}}return null},async doSignatureHelp(e,n){let a=s(e,n);const o=i.get(e),l=t.get(e);let g=(await r.getLanguageService(o,a,l)).getSignatureHelpItems(o.uri,o.offsetAt(n),void 0);if(g){let e={activeSignature:g.selectedItemIndex,activeParameter:g.argumentIndex,signatures:[]};return g.items.forEach((t=>{let n={label:"",documentation:void 0,parameters:[]};n.label+=ts.displayPartsToString(t.prefixDisplayParts),t.parameters.forEach(((e,a,i)=>{let r=ts.displayPartsToString(e.displayParts),o={label:r,documentation:ts.displayPartsToString(e.documentation)};n.label+=r,n.parameters.push(o),a<i.length-1&&(n.label+=ts.displayPartsToString(t.separatorDisplayParts))})),n.label+=ts.displayPartsToString(t.suffixDisplayParts),e.signatures.push(n)})),e}return null},async findDocumentHighlight(e,t){const n=i.get(e),a=(await r.getLanguageService(n)).getDocumentHighlights(n.uri,n.offsetAt(t),[n.uri]),o=[];for(const e of a||[])for(const t of e.highlightSpans)o.push({range:convertRange(n,t.textSpan),kind:"writtenReference"===t.kind?languageModes_1.DocumentHighlightKind.Write:languageModes_1.DocumentHighlightKind.Text});return o},async findDocumentSymbols(e){const t=i.get(e);let n=(await r.getLanguageService(t)).getNavigationBarItems(t.uri);if(n){let a=[],i=Object.create(null),r=(n,o)=>{let s=n.text+n.kind+n.spans[0].start;if("script"!==n.kind&&!i[s]){let r={name:n.text,kind:convertSymbolKind(n.kind),location:{uri:e.uri,range:convertRange(t,n.spans[0])},containerName:o};i[s]=!0,a.push(r),o=n.text}if(n.childItems&&n.childItems.length>0)for(let e of n.childItems)r(e,o)};return n.forEach((e=>r(e))),a}return[]},async findDefinition(e,t){let n=s(e,t);const a=i.get(e),o=await r.getLanguageService(a,n);let l=o.getDefinitionAndBoundSpan(a.uri,a.offsetAt(t));if(l&&l.definitions){let n=function(e,t,n){let a=t-1;const i=e.getText();let r=' \t\n\r":{[()]},*>+'+n;for(n||(r=' \t\n\r":{[()]},*>+');a>=0&&-1===r.indexOf(i.charAt(a));)a--;let o=i.substring(a+1,t),s=languageModes_1.Range.create(e.positionAt(a+1),e.positionAt(t)),l=t;for(;l!=i.length&&-1===r.indexOf(i.charAt(l));)l++;let g=i.substring(t,l),c=languageModes_1.Range.create(e.positionAt(t),e.positionAt(l));return{context:o+g,leftText:o,rightText:g,contextRange:languageModes_1.Range.create(e.positionAt(a+1),e.positionAt(l)),leftRange:s,rightRange:c}}(e,e.offsetAt(t),"'"),a=l.definitions[0].fileName;if(a&&a.includes("locale")&&a.endsWith(".json")){const e={resolveRelativePath:(e,t)=>{const n=t.substring(0,t.lastIndexOf("/")+1);return vscode_uri_1.Utils.resolvePath(vscode_uri_1.URI.parse(n),e).toString()}};(0,vscode_json_languageservice_1.getLanguageService)({workspaceContext:e,contributions:[],clientCapabilities:vscode_json_languageservice_1.ClientCapabilities.LATEST});let t=fs.readFileSync(a),i=languageModes_1.TextDocument.create(a,"json",1,t.toString()),r=i.positionAt(l.definitions[0].textSpan.start),o=i.positionAt(l.definitions[0].textSpan.start);o.character=o.character+l.definitions[0].textSpan.length;let s=languageModes_1.Range.create(r,o);return[{targetUri:utils_1.hx.toNormalizedUri(a),targetRange:s,targetSelectionRange:s,originSelectionRange:n.contextRange}]}}if(l&&l.definitions)return l.definitions.map((e=>{let t,n=-1,i=-1;try{let t=e.resolvedDefinition;if(t)n=t.textSpanPosition.line,i=t.textSpanPosition.character;else{const t=o.toLineColumnOffset(e.fileName,e.textSpan.start);n=t.line,i=t.character}}catch(t){let a=languageModes_1.TextDocument.create(e.fileName,"javascript",0,utils_1.hx.readFiletoString(e.fileName)).positionAt(e.textSpan.start);n=a.line,i=a.character}if(-1===n||-1===i)throw new Error("getDefinitionAndBoundSpan return error.");l.textSpan&&o.toLineColumnOffset&&(t=convertRange(a,l.textSpan));let r={start:{line:n,character:i},end:{line:n,character:i+e.textSpan.length}};return{targetUri:utils_1.hx.toNormalizedUri(e.fileName),targetRange:r,targetSelectionRange:r,originSelectionRange:t}}));if(l&&!l.definitions){let e=l;if(e[0].targetUri.endsWith("vue"))return e}return null},async findReferences(e,t){const n=i.get(e);let a=(await r.getLanguageService(n)).getReferencesAtPosition(n.uri,n.offsetAt(t));return a?a.filter((e=>e.fileName===n.uri)).map((t=>({uri:e.uri,range:convertRange(n,t.textSpan)}))):[]},async getSelectionRange(e,t){const n=i.get(e);return function e(t){const a=t.parent?e(t.parent):void 0;return languageModes_1.SelectionRange.create(convertRange(n,t.textSpan),a)}((await r.getLanguageService(n)).getSmartSelectionRange(n.uri,n.offsetAt(t)))},async format(t,n,a,i=o){const s=e.get(t).getEmbeddedDocument("javascript",!0),l=await r.getLanguageService(s);let g=i&&i.javascript&&i.javascript.format,c=computeInitialIndent(t,n,a),u=convertOptions(a,g,c+1),d=s.offsetAt(n.start),p=s.offsetAt(n.end),m=null;n.end.line>n.start.line&&(0===n.end.character||(0,strings_1.isWhitespaceOnly)(s.getText().substr(p-n.end.character,n.end.character)))&&(p-=n.end.character,m=languageModes_1.Range.create(languageModes_1.Position.create(n.end.line,0),n.end));let f=l.getFormattingEditsForRange(s.uri,d,p,u);if(f){let e=[];for(let t of f)t.span.start>=d&&t.span.start+t.span.length<=p&&e.push({range:convertRange(s,t.span),newText:t.newText});return m&&e.push({range:m,newText:generateIndent(c,a)}),e}return[]},async getFoldingRanges(e){const t=i.get(e);let n=(await r.getLanguageService(t)).getOutliningSpans(t.uri),a=[];for(let i of n){let n=convertRange(t,i.textSpan),r=n.start.line,o=n.end.line;if(r<o){let t={startLine:r,endLine:o},i=e.getText(n).match(/^\s*\/(?:(\/\s*#(?:end)?region\b)|(\*|\/))/);i&&(t.kind=i[1]?languageModes_1.FoldingRangeKind.Region:languageModes_1.FoldingRangeKind.Comment),a.push(t)}}return a},onDocumentRemoved(e){i.onDocumentRemoved(e)},async getSemanticTokens(e){const t=i.get(e),n=await r.getLanguageService(t);return(0,javascriptSemanticTokens_1.getSemanticTokens)(n,t,t.uri)},getSemanticTokenLegend:()=>(0,javascriptSemanticTokens_1.getSemanticTokenLegend)(),dispose(){r.dispose(),i.dispose()}}}function convertRange(e,t){if(void 0===t.start){const t=e.positionAt(0);return languageModes_1.Range.create(t,t)}const n=e.positionAt(t.start),a=e.positionAt(t.start+(t.length||0));return languageModes_1.Range.create(n,a)}function convertKind(e){switch(e){case"primitive type":case"keyword":return languageModes_1.CompletionItemKind.Keyword;case"var":case"local var":return languageModes_1.CompletionItemKind.Variable;case"property":case"getter":case"setter":return languageModes_1.CompletionItemKind.Field;case"function":case"local function":case"method":case"construct":case"call":case"index":return languageModes_1.CompletionItemKind.Function;case"enum":return languageModes_1.CompletionItemKind.Enum;case"module":return languageModes_1.CompletionItemKind.Module;case"class":return languageModes_1.CompletionItemKind.Property;case"interface":return languageModes_1.CompletionItemKind.Interface;case"warning":return languageModes_1.CompletionItemKind.Text;case"file":return languageModes_1.CompletionItemKind.File;case"dir":return languageModes_1.CompletionItemKind.Folder}return languageModes_1.CompletionItemKind.Property}function convertSymbolKind(e){switch(e){case"var":case"local var":case"const":return languageModes_1.SymbolKind.Variable;case"function":case"local function":return languageModes_1.SymbolKind.Function;case"enum":return languageModes_1.SymbolKind.Enum;case"module":return languageModes_1.SymbolKind.Module;case"class":return languageModes_1.SymbolKind.Class;case"interface":return languageModes_1.SymbolKind.Interface;case"method":return languageModes_1.SymbolKind.Method;case"property":case"getter":case"setter":return languageModes_1.SymbolKind.Property}return languageModes_1.SymbolKind.Variable}function convertOptions(e,t,n){return{ConvertTabsToSpaces:e.insertSpaces,TabSize:e.tabSize,IndentSize:e.tabSize,IndentStyle:ts.IndentStyle.Smart,NewLineCharacter:"\n",BaseIndentSize:e.tabSize*n,InsertSpaceAfterCommaDelimiter:Boolean(!t||t.insertSpaceAfterCommaDelimiter),InsertSpaceAfterSemicolonInForStatements:Boolean(!t||t.insertSpaceAfterSemicolonInForStatements),InsertSpaceBeforeAndAfterBinaryOperators:Boolean(!t||t.insertSpaceBeforeAndAfterBinaryOperators),InsertSpaceAfterKeywordsInControlFlowStatements:Boolean(!t||t.insertSpaceAfterKeywordsInControlFlowStatements),InsertSpaceAfterFunctionKeywordForAnonymousFunctions:Boolean(!t||t.insertSpaceAfterFunctionKeywordForAnonymousFunctions),InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis:Boolean(t&&t.insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis),InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets:Boolean(t&&t.insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets),InsertSpaceAfterOpeningAndBeforeClosingNonemptyBraces:Boolean(t&&t.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces),InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces:Boolean(t&&t.insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces),PlaceOpenBraceOnNewLineForControlBlocks:Boolean(t&&t.placeOpenBraceOnNewLineForFunctions),PlaceOpenBraceOnNewLineForFunctions:Boolean(t&&t.placeOpenBraceOnNewLineForControlBlocks)}}function computeInitialIndent(e,t,n){let a=e.offsetAt(languageModes_1.Position.create(t.start.line,0)),i=e.getText(),r=a,o=0,s=n.tabSize||4;for(;r<i.length;){let e=i.charAt(r);if(" "===e)o++;else{if("\t"!==e)break;o+=s}r++}return Math.floor(o/s)}function generateIndent(e,t){return t.insertSpaces?(0,strings_1.repeat)(" ",e*t.tabSize):(0,strings_1.repeat)("\t",e)}exports.getJavaScriptMode=getJavaScriptMode,exports.convertKind=convertKind;