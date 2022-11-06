"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PathCompletionParticipant=void 0;const jsonc_1=require("jsonc"),vscode_html_languageservice_1=require("vscode-html-languageservice"),vscode_uri_1=require("vscode-uri"),utils_1=require("../../../../utils"),strings_1=require("../utils/strings"),imageSuffix=utils_1.DefaultFileExtensions.image,mediaSuffix=utils_1.DefaultFileExtensions.media,jsSuffix=utils_1.DefaultFileExtensions.js,cssSuffix=utils_1.DefaultFileExtensions.css,htmlSuffix=utils_1.DefaultFileExtensions.html,pathLeftBorder=["/".charCodeAt(0),"'".charCodeAt(0),'"'.charCodeAt(0)],pathRightBorder=pathLeftBorder.slice(1);class PathCompletionParticipant{constructor(e){this.readDirectory=e,this.attributeCompletions=[]}onHtmlAttributeValue(e){isPathAttribute(e.tag,e.attribute)&&this.attributeCompletions.push(e)}beginCompletion(e){this.attributeCompletions=[],this.workspaceFolder=null==e?void 0:e.workspaceFolder}async computeCompletions(e,t,i){const s={items:[],isIncomplete:!1};for(const t of this.attributeCompletions){const i=stripQuotes(e.getText(t.range));if(isCompletablePath(i))if("."===i||".."===i)s.isIncomplete=!0;else{let i=await this.collectWorkspaceFileCompletion(e,t);s.isIncomplete=i.isIncomplete||s.isIncomplete,i.items.length>0&&s.items.push(...i.items)}}return s}async providePathSuggestions(e,t,i,s,r){const o=e.substring(0,e.lastIndexOf("/")+1);let a=s.resolveReference(o||".",i.uri);if(a)try{const e=[],i=await this.readDirectory(a);for(const[s,o]of i)if(s.charCodeAt(0)!==CharCode_dot){if(o==vscode_html_languageservice_1.FileType.File&&r.includes(s))continue;e.push(createCompletionItem(s,o===vscode_html_languageservice_1.FileType.Directory,t))}return e}catch(e){}return[]}async collectWorkspaceFileCompletion(e,t){var i;let s={isIncomplete:!1,items:[]};const r=e.getText(t.range),o=t.value.lastIndexOf("/"),a=o>=0?t.value.slice(o+1):"";if(s.isIncomplete="."==a||".."==a||!t.value,this.workspaceFolder){const o=t.value;let a=t.range,n=e.offsetAt(t.position),l=e.offsetAt(a.start),c=n-l,u=c;for(;u>0&&!pathLeftBorder.includes(r.charCodeAt(u-1));)u--;let f=e.offsetAt(a.end)-l;for(;f>c&&pathRightBorder.includes(r.charCodeAt(f-1));)f--;let g=getFileSuffixFilter(t.tag,t.attribute);a={start:e.positionAt(u+l),end:e.positionAt(f+l)};let m={extensionFilters:g.filters,prefixPath:o,timeout:300,withCurrentLevelFolder:!0,withAllCurrentLevelFiles:!1};if("navigator"===t.tag&&"url"===t.attribute){getPagesData(this.workspaceFolder).forEach((e=>{s.items.push({label:"/"+e,kind:vscode_html_languageservice_1.CompletionItemKind.File,textEdit:vscode_html_languageservice_1.TextEdit.replace(a,"/"+e),sortText:"aa",data:{isPathCompletion:!0}})}))}else{let t=(0,utils_1.getCompletionFiles)(this.workspaceFolder,m,e.uri);null===(i=await t)||void 0===i||i.files.forEach((e=>{s.items.push({label:e.relative,kind:e.isDir?vscode_html_languageservice_1.CompletionItemKind.Folder:vscode_html_languageservice_1.CompletionItemKind.File,textEdit:vscode_html_languageservice_1.TextEdit.replace(a,e.relative),sortText:e.isDir?"bb":"aa",data:{isPathCompletion:!0,imageUri:g.isImage?vscode_uri_1.URI.file(e.file).toString():void 0}})}))}}return s}}exports.PathCompletionParticipant=PathCompletionParticipant;const CharCode_dot=".".charCodeAt(0);function stripQuotes(e){return(0,strings_1.startsWith)(e,"'")||(0,strings_1.startsWith)(e,'"')?e.slice(1,-1):e}function isCompletablePath(e){return!((0,strings_1.startsWith)(e,"http")||(0,strings_1.startsWith)(e,"https")||(0,strings_1.startsWith)(e,"//"))}function isPathAttribute(e,t){const i=PATH_TAG_AND_ATTR[e];return!!i&&("string"==typeof i?i===t:-1!==i.indexOf(t))}function isImageAttribute(e,t){return("image"==e||"img"==e)&&"src"==t}function getFileSuffixFilter(e,t){if(("image"==e||"img"==e)&&"src"==t)return{filters:imageSuffix,isImage:!0};if("body"==e&&"background"==t)return{filters:imageSuffix,isImage:!0};if("a"==e&&"href"==t)return{filters:htmlSuffix,isImage:!1};if(("source"==e||"video"==e||"track"==e||"audio"==e)&&"src"==t)return{filters:mediaSuffix,isImage:!1};if("link"==e&&"href"==t)return{filters:cssSuffix,isImage:!1};if("script"==e&&"src"==t)return{filters:jsSuffix,isImage:!1};if("frame"==e&&("src"==t||"longdesc"==t))return{filters:htmlSuffix,isImage:!1};if("input"==e||"button"==e){if("src"==t)return{filters:imageSuffix,isImage:!0};if("formaction"==t)return{filters:htmlSuffix,isImage:!1}}return{filters:[],isImage:!1}}function pathToReplaceRange(e,t,i){let s;const r=e.lastIndexOf("/");if(-1===r)s=shiftRange(i,1,-1);else{const e=t.slice(r+1),o=shiftPosition(i.end,-1-e.length),a=e.indexOf("");let n;n=-1!==a?shiftPosition(o,a):shiftPosition(i.end,-1),s=vscode_html_languageservice_1.Range.create(o,n)}return s}function createCompletionItem(e,t,i){return t?{label:e+="/",kind:vscode_html_languageservice_1.CompletionItemKind.Folder,textEdit:vscode_html_languageservice_1.TextEdit.replace(i,e),command:{title:"Suggest",command:"editor.action.triggerSuggest"},sortText:"zz"}:{label:e,kind:vscode_html_languageservice_1.CompletionItemKind.File,textEdit:vscode_html_languageservice_1.TextEdit.replace(i,e),sortText:"zz"}}function shiftPosition(e,t){return vscode_html_languageservice_1.Position.create(e.line,e.character+t)}function shiftRange(e,t,i){const s=shiftPosition(e.start,t),r=shiftPosition(e.end,i);return vscode_html_languageservice_1.Range.create(s,r)}function getPagesData(e){let t=[],i=vscode_uri_1.URI.parse(e.uri).fsPath.replace(/\\/g,"/")+"/pages.json",s=jsonc_1.jsonc.readSync(i);return s.pages?(s.pages.forEach((e=>{e.path&&t.push(e.path)})),t):t}const PATH_TAG_AND_ATTR={a:"href",area:"href",body:"background",del:"cite",form:"action",frame:["src","longdesc"],img:["src","longdesc"],ins:"cite",link:"href",object:"data",q:"cite",script:"src",audio:"src",button:"formaction",embed:"src",html:"manifest",input:["src","formaction"],source:"src",track:"src",video:["src","poster"],image:["src"],navigator:["url"]};