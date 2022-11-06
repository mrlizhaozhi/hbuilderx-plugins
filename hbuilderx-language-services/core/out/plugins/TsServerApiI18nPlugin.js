"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TsServerApiI18nPlugin=void 0;const utils_1=require("./utils");function create(t){const e=t.languageService,n=Object.create(null);for(let t of Object.keys(e)){const i=e[t];n[t]=(...t)=>i.apply(e,t)}return n.getCompletionsAtPosition=function(t,n,i){return e.getCompletionsAtPosition(t,n,i)},n.getCompletionEntryDetails=function(n,i,o,r,s,u,l){let a=e.getCompletionEntryDetails(n,i,o,r,s,u,l);if(!a)return;let c=t.ts.displayPartsToString(a.documentation);return a.documentation=[{kind:"text",text:(0,utils_1.translateText)(c)}],a},n.getQuickInfoAtPosition=function(n,i){let o=e.getQuickInfoAtPosition(n,i);if(!o)return;let r=t.ts.displayPartsToString(o.documentation);return o.documentation=[{kind:"text",text:(0,utils_1.translateText)(r)}],o},n}exports.TsServerApiI18nPlugin={create:create};