"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,n,i){void 0===i&&(i=n),Object.defineProperty(e,i,{enumerable:!0,get:function(){return t[n]}})}:function(e,t,n,i){void 0===i&&(i=n),e[i]=t[n]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)"default"!==n&&Object.prototype.hasOwnProperty.call(e,n)&&__createBinding(t,e,n);return __setModuleDefault(t,e),t};Object.defineProperty(exports,"__esModule",{value:!0});const SourceMaps=__importStar(require("../../../source-map"));function default_1(){return{getEmbeddedFilesCount:(e,t)=>2,getEmbeddedFile(e,t,n){const i=0===n?t.script:t.scriptSetup;if(!i)return;const r={fileName:e+".__VLS_script.format."+i.lang,content:i.content,capabilities:{diagnostics:!1,foldingRanges:!0,formatting:!0,documentSymbol:!0,codeActions:!1,inlayHints:!1},isTsHostFile:!1,mappings:[]};return r.mappings.push({data:{vueTag:i.tag,capabilities:{}},mode:SourceMaps.Mode.Offset,sourceRange:{start:0,end:i.content.length},mappedRange:{start:0,end:i.content.length}}),r}}}exports.default=default_1;