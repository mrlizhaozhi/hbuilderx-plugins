"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.TsVueAdditionalCompletionHandle=void 0;const server_1=require("../../../htmlservice/server"),ScriptAttributeList=["is","key","lang","ref","setup"],StyleAttributeList=["is","key","lang","module","ref","scoped"];class TsVueAdditionalCompletionHandle{constructor(t,e,i){this.ls=t,this.allInfo=e,this.dataProviders=i}doExtraCompletion(t,e,i,l){let r=this.ls.getLocationInfoAtPosition(e,i,l);if(!r)return t;if(r.kind===server_1.LocationInfoKind.AttributeName)t=this.deleteGlobalAttribute(t,r);return t}deleteGlobalAttribute(t,e){if("script"!==e.activeTag&&"style"!==e.activeTag)return t;let i=ScriptAttributeList;"style"===e.activeTag&&(i=StyleAttributeList);let l=t.items.filter((t=>{if(i.includes(t.label))return t}));return t.items=l,t}}exports.TsVueAdditionalCompletionHandle=TsVueAdditionalCompletionHandle;class TsHtmlAdditionalResolveHandle{doExtraResolve(t,e,i,l){return t.data,t}}