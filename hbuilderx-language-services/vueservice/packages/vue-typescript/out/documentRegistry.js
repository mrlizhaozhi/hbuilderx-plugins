"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(e,t,r,a){void 0===a&&(a=r),Object.defineProperty(e,a,{enumerable:!0,get:function(){return t[r]}})}:function(e,t,r,a){void 0===a&&(a=r),e[a]=t[r]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t}),__importStar=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)"default"!==r&&Object.prototype.hasOwnProperty.call(e,r)&&__createBinding(t,e,r);return __setModuleDefault(t,e),t};Object.defineProperty(exports,"__esModule",{value:!0}),exports.createDocumentRegistry=void 0;const reactivity_1=require("@vue/reactivity"),path=__importStar(require("path")),localTypes=__importStar(require("./utils/localTypes")),untrack_1=require("./utils/untrack");function createDocumentRegistry(){return createDocumentRegistryBase()}function createDocumentRegistryBase(){const e=(0,reactivity_1.shallowReactive)({}),t=(0,reactivity_1.computed)((()=>Object.values(e))),r=(0,reactivity_1.computed)((()=>t.value.map((e=>e.fileName)))),a=(0,reactivity_1.computed)((()=>{const e=new WeakMap;for(const r of t.value)for(const t of r.getAllEmbeddeds())e.set(t.file,r);return e})),o=(0,reactivity_1.computed)((()=>{const e=new Map;for(const r of t.value)for(const t of r.getAllEmbeddeds())e.set(t.file.fileName.toLowerCase(),{vueFile:r,embedded:t});return e})),n=(0,reactivity_1.computed)((()=>{const t=new Map;for(const r in e){const a=e[r];for(const e of a.getAllEmbeddeds())e.teleport&&t.set(e.file.fileName.toLowerCase(),e.teleport)}return t})),u=(0,reactivity_1.computed)((()=>[...new Set(r.value.map(path.dirname))]));return{get:(0,untrack_1.untrack)((t=>e[t.toLowerCase()])),delete:(0,untrack_1.untrack)((t=>delete e[t.toLowerCase()])),has:(0,untrack_1.untrack)((t=>!!e[t.toLowerCase()])),set:(0,untrack_1.untrack)(((t,r)=>e[t.toLowerCase()]=r)),getFileNames:(0,untrack_1.untrack)((()=>r.value)),getDirs:(0,untrack_1.untrack)((()=>u.value)),getAll:(0,untrack_1.untrack)((()=>t.value)),getTeleport:(0,untrack_1.untrack)((e=>n.value.get(e.toLowerCase()))),getAllEmbeddeds:(0,untrack_1.untrack)((function*(){for(const e of o.value)yield e[1]})),fromEmbeddedLocation:(0,untrack_1.untrack)((function*(e,t,r,a,n){if(e.endsWith(`/${localTypes.typesFileName}`))return;void 0===r&&(r=t);const u=o.value.get(e.toLowerCase());if(u){if(n&&!n(u.embedded.sourceMap))return;for(const e of u.embedded.sourceMap.getSourceRanges(t,r,a))yield{fileName:u.vueFile.fileName,range:e[0],mapped:u,data:e[1]}}else yield{fileName:e,range:{start:t,end:r}}})),fromEmbeddedFile:(0,untrack_1.untrack)((function(e){return a.value.get(e)})),fromEmbeddedFileName:(0,untrack_1.untrack)((function(e){return o.value.get(e.toLowerCase())}))}}exports.createDocumentRegistry=createDocumentRegistry;