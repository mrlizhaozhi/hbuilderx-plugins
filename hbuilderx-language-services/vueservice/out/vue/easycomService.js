"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,s,i){void 0===i&&(i=s),Object.defineProperty(e,i,{enumerable:!0,get:function(){return t[s]}})}:function(e,t,s,i){void 0===i&&(i=s),e[i]=t[s]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)"default"!==s&&Object.prototype.hasOwnProperty.call(e,s)&&__createBinding(t,e,s);return __setModuleDefault(t,e),t};Object.defineProperty(exports,"__esModule",{value:!0}),exports.fetchVueComponentInfo=exports.collectEasycoms=exports.findImportComponents=exports.findEasycomByTag=void 0;const vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),vscode_html_languageservice_1=require("vscode-html-languageservice"),vscode_uri_1=require("vscode-uri"),jsonc_1=require("jsonc"),fs=__importStar(require("fs")),path=__importStar(require("path")),ts=__importStar(require("typescript")),core_1=require("../../../core");function visitFiles(e,t){if(!fs.existsSync(e))return;if(fs.statSync(e).isDirectory()){let s=fs.readdirSync(e);for(let i of s){fs.statSync(path.join(e,i)).isDirectory()?visitFiles(path.join(e,i),t):t(path.join(e,i))}}}function scanComponents(e){let t=[];if(!fs.existsSync(e))return t;if(fs.statSync(e).isDirectory()){let s=fs.readdirSync(e);for(let i of s){if(!fs.statSync(path.join(e,i)).isDirectory())continue;let s=[".vue",".nvue"];for(let n of s){let s=path.join(e,i,i+n);if(fs.existsSync(s)){t.push({name:i,filePath:s});break}}}}return t}function collectRuleRegexGroups(e){let t=new Map,s=0,i=-1;for(let n=0;n<e.length;n++){let o=e.charAt(n);"("==o?(s++,i=n):")"==o&&(-1!=i&&n>i&&t.set(s,{start:i,end:n+1}),i=-1)}return t}function buildGroupMappings(e,t){let s=new Map;if(t.size>0){let i="\0",n=0;for(let o=0;o<e.length;o++){let r=e.charAt(o);if(r>="0"&&r<="9"&&"$"==i){let e=Number.parseInt(r);t.has(e)&&(n++,s.set(n,e))}i=r}}return s}function scanAllEasycomByCustomRule(e,t,s,i,n,o){let r=[],a=new RegExp(e),l=e.split("/"),c=o.fsPath;for(;l.length>0;){let e=l.shift(),t=path.join(c,e);if(!fs.existsSync(t))break;c=t}return visitFiles(c,(e=>{let l=path.relative(o.fsPath,e),c=a.exec(l.replace(/\\/g,"/"));if(c){const e=[],a=new Map;for(let t=1;t<c.length;t++)if(n.has(t)){let s=c[t],o=n.get(t),r=i.get(o);e.find((e=>e.start==r.start&&e.end==r.end))||e.push({start:null==r?void 0:r.start,end:null==r?void 0:r.end,newText:s}),a.set(o,s)}e.sort(((e,t)=>t.start-e.start));let l=t;for(let t of e)l=l.substring(0,t.start)+t.newText+l.substring(t.end);let f=s;a.forEach(((e,t)=>{f=f.replace(new RegExp("\\$"+t,"g"),e)})),f=path.join(o.fsPath,f),l.length>0&&fs.existsSync(f)&&(l.startsWith("^")&&(l=l.substring(1)),/^[A-Za-z][A-Za-z0-9\-_]+$/.test(l)&&r.push({name:l,filePath:f}))}return!0})),r}function findEasycomByTag(e,t,s,i){if(!e)return;let n=findImportComponents(t,s,i).find((t=>t.name===e));if(n)return n;let o=getEasycomConfigOptions(i),r=[];if(o.custom)for(let t in o.custom){let s=o.custom[t];if("string"!=typeof s)continue;let n=new RegExp(t).exec(e);if(n){for(let e=1;e<n.length;e++)s=s.replace(new RegExp("\\$"+e,"g"),n[e]);s=s.startsWith("@/")?path.join(i.sourceRoot,s.substring(2)):path.join(i.fsPath,"node_modules",s),r.push(s)}}if(o.autoscan){r.push(path.join(i.sourceRoot,"components",e,e+".vue"));let t=path.join(i.sourceRoot,"uni_modules");if(fs.existsSync(t)){let s=fs.readdirSync(t);for(let i of s)r.push(path.join(t,i,"components",e,e+".vue"))}}for(let t of r)if(fs.existsSync(t))return{name:e,filePath:t}}function getEasycomConfigOptions(e){let t=e.sourceRoot,s=path.join(t,"pages.json"),i={autoscan:!0,custom:{}};if(fs.existsSync(s)){let e;try{e=jsonc_1.jsonc.readSync(s)}catch(e){console.error(e)}if(e.easycom)for(let t in i)t in e.easycom&&(i[t]=e.easycom[t])}return i}function findImportComponents(e,t,s){var i,n;let o=[];if(null==s)return o;let r=parseVuePageInstanceOptions(e,t);if(r){let t=r.options.find((e=>{if(ts.isIdentifier(e.name)){return"components"===e.name.escapedText}return"components"===e.name.getText()})),a=null==t?void 0:t.initializer;if(a&&ts.isObjectLiteralExpression(a)){let t=new Map;for(let e of r.sourceFile.statements)if(ts.isImportDeclaration(e)){let s=e,o=null===(n=null===(i=s.importClause)||void 0===i?void 0:i.name)||void 0===n?void 0:n.getText(),r=s.moduleSpecifier;if(o&&r&&ts.isStringLiteral(r)){let e=r.text;t.set(o,e)}}a.properties.forEach((i=>{var n;let r=null===(n=i.name)||void 0===n?void 0:n.getText();if(r){let i="";if(t.has(r)){let n=t.get(r);if(n.startsWith("@/"))i=s.kind===core_1.HXProjectKind.UniApp||s.kind===core_1.HXProjectKind.UniApp_Cli?path.join(s.fsPath,n.substring(2)):path.join(s.fsPath,"src",n.substring(2));else{let t=path.dirname(vscode_uri_1.URI.parse(e.uri).fsPath);i=path.resolve(t,n)}if(!i.endsWith(".vue")&&!i.endsWith(".nvue"))for(let e of[".vue",".nvue"])if(fs.existsSync(i+e)){i+=e;break}}o.push({name:r,filePath:fs.existsSync(i)?i:""});let n=r.replace(/([A-Z])/g,"-$1").toLowerCase();o.push({name:n.startsWith("-")?n.substring(1):n,filePath:fs.existsSync(i)?i:""})}}))}}return o}function collectEasycoms(e,t,s){let i=[];if(null==s)return i;let n=findImportComponents(e,t,s);i.push(...n);let o=getEasycomConfigOptions(s),r=o.custom;for(let e in r){let t=r[e];if("string"!=typeof t)continue;let n=collectRuleRegexGroups(e),o=buildGroupMappings(t,n),a=t;if(n.forEach(((t,s)=>{let i=e.substring(t.start,t.end);a=a.replace(new RegExp("\\$"+s,"g"),i)})),a.startsWith("@/")){scanAllEasycomByCustomRule(a.substr(2),e,t.substr(2),n,o,s).forEach((e=>{i.push(e)}))}else{scanAllEasycomByCustomRule("node_modules/"+a,e,"node_modules/"+t,n,o,s).forEach((e=>{i.push(e)}))}}if(o.autoscan){scanComponents(path.join(s.sourceRoot,"components")).forEach((e=>{i.push(e)}));let e=path.join(s.sourceRoot,"uni_modules");if(fs.existsSync(e)){let t=fs.readdirSync(e);for(let s of t){scanComponents(path.join(e,s,"components")).forEach((e=>{i.push(e)}))}}}let a=new Map;i.forEach((e=>{a.set(`${e.name}@${e.filePath}`,e)}));let l=[];return a.forEach(((e,t)=>{l.push(e)})),l}function parseVuePageInstanceOptions(e,t){if(!t)return;let s=t.roots.find((e=>"script"===e.tag));if(s){let t={options:[]},i=s.attributes&&"setup"in s.attributes,n=e.positionAt(s.startTagEnd),o=e.positionAt(s.endTagStart),r=e.getText({start:n,end:o}),a=ts.createSourceFile(e.uri,r,ts.ScriptTarget.Latest,!0,ts.ScriptKind.TS);if(t.sourceFile=a,i){if(a.statements&&a.statements.length>0){let e=a.statements[0].jsDoc;e&&e.length>0&&(t.vuedoc=e[0]);let s=[];if(a.statements.forEach((e=>{var t,i;if(ts.isImportDeclaration(e)){let n=e,o=n.moduleSpecifier;if(ts.isStringLiteral(o)){let e=o;if(e.text&&e.text.endsWith(".vue")){if(null===(i=null===(t=n.importClause)||void 0===t?void 0:t.name)||void 0===i?void 0:i.getText()){let e=n.importClause.name;s.push(ts.createPropertyAssignment(e,e))}}}}})),s.length>0){let e=ts.createObjectLiteral(s);t.options.push(ts.createPropertyAssignment("components",e))}}}else{let e=a.statements.find(ts.isExportAssignment);if(e){let s=e.jsDoc;s&&s.length>0&&(t.vuedoc=s[0]);let i=e.expression;if(i&&ts.isObjectLiteralExpression(i)){i.properties.forEach((e=>{if(e&&e.kind==ts.SyntaxKind.PropertyAssignment){let s=e;t.options.push(s)}}))}}}return t}}function fetchVueComponentInfo(e){if(!fs.existsSync(e))return;let t=(0,vscode_html_languageservice_1.getLanguageService)(),s=vscode_languageserver_textdocument_1.TextDocument.create(e,"html",1,fs.readFileSync(e).toString()),i=parseVuePageInstanceOptions(s,t.parseHTMLDocument(s));if(i){let t=new Map,s=new Map,n={filePath:e,properties:[],events:[]};if(i.options.length>0){let e=i.options.find((e=>{var t;return ts.isIdentifier(e.name)?"props"===e.name.escapedText:"props"===(null===(t=e.name)||void 0===t?void 0:t.getText())}));if(e){let s=e.initializer;if(ts.isObjectLiteralExpression(s)){s.properties.forEach((e=>{var s;let i=null===(s=e.name)||void 0===s?void 0:s.getText();if(i){let s=e.initializer,n="";if(ts.isIdentifier(s))n=s.getText();else if(ts.isObjectLiteralExpression(s)){let e=s.properties.find((e=>{var t;return"type"===(null===(t=e.name)||void 0===t?void 0:t.getText())}));e&&(n=e.initializer.getText())}t.set(i,{name:i,type:n})}}))}}let n=i.options.find((e=>{var t;return ts.isIdentifier(e.name)?"emits"===e.name.escapedText:"emits"===(null===(t=e.name)||void 0===t?void 0:t.getText())}));if(n){let e=n.initializer;if(e&&ts.isArrayLiteralExpression(e)){e.elements.forEach((e=>{if(ts.isStringLiteral(e)){let t=e.text;s.set(t,{name:t,description:""})}}))}}}let o=i.vuedoc;if(o){let e,i,r=o.comment;if(o.tags){let n;for(let a of o.tags){let o=a.tagName.getText();if("description"!==o){if("tutorial"===o)e=a.comment;else if("property"===o){let e=a.comment;if(e){let s=/\s*{(.*)}\s+(\w+)\s*=\s*\[(.*)\]\s+(.*)/.exec(e);if(s){let e=s[1],i=s[2],o=s[3],r=s[4],a=new Map;o.split("|").forEach((e=>{a.set(e,{value:e})})),t.set(i,{name:i,type:e,description:r,values:a}),n=i}else{let s=/\s*{(.*)}\s+(\w+)\s+(.*)/.exec(e);if(s){let e=s[1],i=s[2],o=s[3];t.set(i,{name:i,type:e,description:o}),n=i}}}}else if("value"===o){let e=a.comment;if(e&&n&&t.has(n)){let s=/\s*(\w+)\s+(.*)/.exec(e);if(s){let e=s[1],i=s[2],o=t.get(n);o.values||(o.values=new Map),o.values.set(e,{value:e,description:i})}}}else if("event"===o){let e=a.comment;if(e){let t=/\s*{(.*)}\s+(\w+)\s+(.*)/.exec(e);if(t){t[1];let e=t[2],i=t[3];s.set(e,{name:e,description:i})}}}else"example"===o&&(i=a.comment);"property"!=o&&"value"!=o&&(n=void 0)}else r=a.comment}}n.description=r,n.example=i,n.tutorial=e}return t.forEach((e=>{var t;null===(t=n.properties)||void 0===t||t.push(e)})),s.forEach((e=>{var t;null===(t=n.events)||void 0===t||t.push(e)})),n}}exports.findEasycomByTag=findEasycomByTag,exports.findImportComponents=findImportComponents,exports.collectEasycoms=collectEasycoms,exports.fetchVueComponentInfo=fetchVueComponentInfo;