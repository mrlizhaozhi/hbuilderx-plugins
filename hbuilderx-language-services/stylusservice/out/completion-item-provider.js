"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getValues=exports.getProperties=exports.getAtRules=exports.getAllSymbols=exports.findPropertySchema=exports.getPropertyName=exports.isValue=exports.isAtRule=exports.isClassOrId=void 0;const vscode_1=require("vscode"),parser_1=require("./parser"),utils_1=require("./utils"),built_in_1=require("./built-in"),css_built_in_1=require("./css-built-in"),cssSchema=require("./css-schema"),languageFacts_1=require("./languageFacts");function isClassOrId(e){return e.startsWith(".")||e.startsWith("#")||e.startsWith("&")}function isAtRule(e){return e.startsWith("@")}function isValue(e,t){const s=getPropertyName(t);return s&&Boolean(findPropertySchema(e,s))}function getPropertyName(e){return e.trim().replace(":"," ").split(" ")[0]}function findPropertySchema(e,t){return e.cssData.properties.find((e=>e.name===t))}function _variableSymbol(e,t,s){const r=e.name,o=Number(e.val.lineno)-1,i=new vscode_1.CompletionItem(r);return i.detail=t[o].trim(),i.kind=vscode_1.CompletionItemKind.Variable,i}function _functionSymbol(e,t){const s=e.name,r=new vscode_1.CompletionItem(s);return r.kind=vscode_1.CompletionItemKind.Function,r}function _selectorSymbol(e,t,s){const r=e.segments[0],o=r.string?e.segments.map((e=>e.string)).join(""):r.nodes.map((e=>e.name)).join(""),i=new vscode_1.CompletionItem(o);return i.kind=vscode_1.CompletionItemKind.Class,i}function _selectorCallSymbol(e,t){const s=Number(e.lineno)-1,r=(0,utils_1.prepareName)(t[s]),o=new vscode_1.CompletionItem(r);return o.kind=vscode_1.CompletionItemKind.Class,o}function getAllSymbols(e,t){const s=(0,parser_1.buildAst)(e),r=e.split("\n");return(0,parser_1.flattenAndFilterAst)(s).filter((e=>e&&-1===["media","keyframes","atrule","import","require","supports","literal"].indexOf(e.nodeName))).map((e=>(0,parser_1.isVariableNode)(e)?_variableSymbol(e,r,t):(0,parser_1.isFunctionNode)(e)?_functionSymbol(e,r):(0,parser_1.isSelectorNode)(e)?_selectorSymbol(e,r,t):(0,parser_1.isSelectorCallNode)(e)?_selectorCallSymbol(e,r):void 0))}function getAtRules(e,t){return isAtRule(t)?e.cssData.atdirectives.map((e=>{const t=new vscode_1.CompletionItem(e.name);return t.detail=e.desc,t.kind=vscode_1.CompletionItemKind.Keyword,t})):[]}function getProperties(e,t,s){return isClassOrId(t)||isAtRule(t)?[]:e.cssData.properties.map((e=>{const t=new vscode_1.CompletionItem(e.name);return t.insertText=e.name+(s?": ":" "),t.documentation=(0,languageFacts_1.getPropertyDescription)(e),t.kind=vscode_1.CompletionItemKind.Property,t}))}function getValues(e,t){const s=findPropertySchema(e,getPropertyName(t)).values;return s?s.map((e=>{const t=new vscode_1.CompletionItem(e.name);return t.detail=e.desc,t.insertText=new vscode_1.SnippetString(e.name.replace(")","$0)")),t.kind=vscode_1.CompletionItemKind.Value,t})):[]}exports.isClassOrId=isClassOrId,exports.isAtRule=isAtRule,exports.isValue=isValue,exports.getPropertyName=getPropertyName,exports.findPropertySchema=findPropertySchema,exports.getAllSymbols=getAllSymbols,exports.getAtRules=getAtRules,exports.getProperties=getProperties,exports.getValues=getValues;class StylusCompletion{provideCompletionItems(e,t,s){const r=new vscode_1.Position(t.line,0),o=new vscode_1.Range(r,t),i=e.getText(o).trim(),n=e.getText(),l=isValue(cssSchema,i),a=vscode_1.workspace.getConfiguration("languageStylus");let c=[],u=[],m=[],p=[];l?(p=getValues(cssSchema,i),c=(0,utils_1.compact)(getAllSymbols(n,i)).filter((e=>e.kind===vscode_1.CompletionItemKind.Variable))):(u=getAtRules(cssSchema,i),m=getProperties(cssSchema,i,a.get("useSeparator",!0)),c=(0,utils_1.compact)(getAllSymbols(n,i)));let d=[].concat(c,u,m,p,css_built_in_1.default,a.get("useBuiltinFunctions",!0)?built_in_1.default:[]);return i.startsWith(".")&&(d=d.filter((e=>e.label.startsWith(i)))),{isIncomplete:!1,items:d}}}exports.default=StylusCompletion;