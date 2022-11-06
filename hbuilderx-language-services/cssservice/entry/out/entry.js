"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getCurrentWorkspaceFolder=exports.getExtraServer=void 0;const cssExtraServer_1=require("./cssExtraServer"),lessExtraServer_1=require("./lessExtraServer"),scssExtraServer_1=require("./scssExtraServer"),languageIndex={};function getExtraServer(e){let r;return r="string"==typeof e?languageIndex[e]:languageIndex[e.languageId],r||(r=languageIndex.css),r}function getCurrentWorkspaceFolder(e,r){let s=[];for(const t of e)r.uri.startsWith(t.uri)&&s.push(t);return s.sort(((e,r)=>e.uri.length-r.uri.length)),s}languageIndex.css=new cssExtraServer_1.CssExtraServer,languageIndex.scss=new scssExtraServer_1.ScssExtraServer,languageIndex.less=new lessExtraServer_1.LessExtraServer,exports.getExtraServer=getExtraServer,exports.getCurrentWorkspaceFolder=getCurrentWorkspaceFolder;