"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getVueStyleModeExt=exports.getCssModeExt=exports.cssModeExtensionEnv=void 0;const vscode_html_languageservice_1=require("vscode-html-languageservice"),strings_1=require("../utils/strings"),entry_1=require("../../../../cssservice/entry"),vscode_languageserver_1=require("vscode-languageserver"),cssUtilts_1=require("./utils/cssUtilts"),languageModelCache_1=require("../languageModelCache"),interpolationService=require("../vue/interpolationService");function isVueLanguage(e){return"vue"===e.languageId||!e.languageId&&e.uri.toLowerCase().endsWith(".vue")}exports.cssModeExtensionEnv={};class CSSLanguageServiceExt{constructor(e,t){this.workspace=t,this.htmlLanguageService=(0,vscode_html_languageservice_1.getLanguageService)(),this.htmlDocuments=(0,languageModelCache_1.getLanguageModelCache)(10,60,(e=>this.htmlLanguageService.parseHTMLDocument(e))),this.cssLanguageService=e}getRootFolder(e){for(let t of this.workspace.folders){let s=t.uri;if((0,strings_1.endsWith)(s,"/")||(s+="/"),(0,strings_1.startsWith)(e,s))return t}}findDefinition(e,t,s,n){let o=n,i=t.offsetAt(s);return new Promise((r=>{let l="";if(o.accept((e=>!(e.type===cssUtilts_1.NodeType.IdentifierSelector&&e.offset<=i&&e.end>=i)||(l=e.getText(),!1))),l.length>0&&"#"==l[0]){let t=this.findIdHtmlNode(e,l.substr(1));r(t)}else{{let e=(0,entry_1.getExtraServer)(t).getLanguageServiceExt();if(e&&e.findDefinition){let o={workspaceFolder:this.getRootFolder(t.uri),docStylesheet:n};return void e.findDefinition(t,s,o).then((e=>{r(e)}))}}r(null)}}))}doComplete(e,t,s,n,o){let i=(0,entry_1.getExtraServer)(t).getLanguageServiceExt();if(i&&i.doComplete){let e={workspaceFolder:this.getRootFolder(t.uri),docStylesheet:n,documentContext:o,serverConnection:exports.cssModeExtensionEnv.serverConnection,scopedSettingsSupport:exports.cssModeExtensionEnv.scopedSettingsSupport};return i.doComplete(t,s,e)}return Promise.resolve(null)}findDocumentSymbols(e,t){var s,n;let o=(0,entry_1.getExtraServer)(e).getLanguageServiceExt();if(o&&o.findDocumentSymbols){let s={workspaceFolder:this.getRootFolder(e.uri),docStylesheet:t};return o.findDocumentSymbols(e,s)}return null!==(n=null===(s=this.cssLanguageService)||void 0===s?void 0:s.findDocumentSymbols(e,t))&&void 0!==n?n:[]}findIdHtmlNode(e,t){const s=e.getText();let n=this.htmlLanguageService.createScanner(e.getText()),o=n.scan(),i=!1;for(;o!==vscode_html_languageservice_1.TokenType.EOS;){switch(o){case vscode_html_languageservice_1.TokenType.AttributeName:i="id"==n.getTokenText().toLocaleLowerCase();break;case vscode_html_languageservice_1.TokenType.AttributeValue:if(i){let o=n.getTokenLength();if(o>0&&o<=t.length+2){let o=n.getTokenOffset(),i=n.getTokenEnd();if("'"!==s[o]&&'"'!==s[o]||(o++,i--),s.slice(o,i)===t){let t=vscode_languageserver_1.Range.create(e.positionAt(o),e.positionAt(i));return vscode_languageserver_1.Location.create(e.uri,t)}}}}o=n.scan()}return null}}class VueStyleLanguageService extends CSSLanguageServiceExt{constructor(e,t){super(e,t)}async doComplete(e,t,s,n,o){let i=await super.doComplete(e,t,s,n,o);function r(e,t=!0){let s=t?"v-bind($1)":"v-bind";return{label:"v-bind",kind:vscode_languageserver_1.CompletionItemKind.Function,textEdit:vscode_languageserver_1.TextEdit.replace(e,s),insertTextFormat:t?vscode_languageserver_1.InsertTextFormat.Snippet:void 0}}i||(i={isIncomplete:!1,items:[]});const l=async(e,n)=>{let o=this.getRootFolder(e.uri);if(o){const i=t.getText();let r=n.offset,l=n.end;"'"!=i[r]&&'"'!=i[r]||r++,"'"!=i[l-1]&&'"'!=i[l]||l--;let a=vscode_languageserver_1.Range.create(t.positionAt(r),t.positionAt(l)),c=this.htmlDocuments.get(e);return interpolationService.doCompletion2(e,c,a,s,o)}return null};let a=t.offsetAt(s),c=(vscode_languageserver_1.CompletionList.create(),(0,cssUtilts_1.getNodeAtOffset)(n,a)),g=!1;for(;c&&!g;){switch(c.type){case cssUtilts_1.NodeType.FunctionArgument:if(c.offset<=a&&a<=c.end){let t=c;for(;t&&t.type!==cssUtilts_1.NodeType.Function;)t=t.parent;if("v-bind"==(null==t?void 0:t.getName()))return l(e,c);g=!0}break;case cssUtilts_1.NodeType.Function:let n=c.getIdentifier();if(n&&n.offset<=a&&a<=n.end){const e=t.positionAt(n.offset),s=t.positionAt(n.end);i.items.push(r(vscode_languageserver_1.Range.create(e,s),!1)),g=!0;break}case cssUtilts_1.NodeType.Declarations:let o=c.findFirstChildBeforeOffset(a);if(o&&(0,cssUtilts_1.isDefined)(o.colonPosition)&&a>o.colonPosition&&(!(0,cssUtilts_1.isDefined)(o.semicolonPosition)||a<=o.semicolonPosition)){let e=o.getValue();if(e){let n=e.getText();if(a<e.offset)i.items.push(r(vscode_languageserver_1.Range.create(s,s)));else if(a<=e.end){const s=t.positionAt(e.offset);let o=-1!==e.end?e.end:a,l=a-e.offset,c=o-e.offset;for(;l<c&&!strings_1.whiteSpaceCharCode.includes(n.charCodeAt(l));)l++;const g=t.positionAt(l+e.offset);i.items.push(r(vscode_languageserver_1.Range.create(s,g)))}}else{const e=t.getText();let n=a-1;for(;n>=0&&-1===' \t\n\r":{[()]},*>+'.indexOf(e.charAt(n));)n--;let o=vscode_languageserver_1.Range.create(t.positionAt(n+1),s);i.items.push(r(o))}}g=!0}c=c.parent}return i}async findDefinition(e,t,s,n){if("stylus"===t.languageId||!n)return null;let o=await super.findDefinition(e,t,s,n);if(!o){const o=async(e,n)=>{let o=this.getRootFolder(e.uri);if(o){const i=t.getText();let r=n.offset,l=n.end;"'"!=i[r]&&'"'!=i[r]||r++,"'"!=i[l-1]&&'"'!=i[l]||l--;let a=vscode_languageserver_1.Range.create(t.positionAt(r),t.positionAt(l)),c=this.htmlDocuments.get(e);return interpolationService.findDefinition(e,c,a,s,o)}return null};let i=t.offsetAt(s),r=(0,cssUtilts_1.getNodeAtOffset)(n,i),l=!1;for(;r&&!l;){if(r.type===cssUtilts_1.NodeType.FunctionArgument)if(r.offset<=i&&i<=r.end){let t=r;for(;t&&t.type!==cssUtilts_1.NodeType.Function;)t=t.parent;if("v-bind"==(null==t?void 0:t.getName()))return o(e,r);l=!0}r=r.parent}}return o}}function getCssModeExt(e,t){return new CSSLanguageServiceExt(e,t)}function getVueStyleModeExt(e,t){return new VueStyleLanguageService(e,t)}exports.getCssModeExt=getCssModeExt,exports.getVueStyleModeExt=getVueStyleModeExt;