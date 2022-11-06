"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.filterIdData=exports.filterClassData=void 0;const indexlib_1=require("../../../../indexlib");function filterClassData(e,t,a=!1){return getDataFromIndex(e,t,indexlib_1.IndexDataCategory.CLASS,a)}function filterIdData(e,t,a=!1){return getDataFromIndex(e,t,indexlib_1.IndexDataCategory.ID,a)}function getDataFromIndex(e,t,a,r=!1){var l;let i=new Set,n=[];const s=indexlib_1.IndexDataStore.load(e).allIndexData();let o=new Set,f=[t.uri];const d=e=>{let t=new Set;r&&(t=i);let a=[];return e.forEach((e=>{t.has(e.label)||(a.push(e.label),t.add(e.label))})),a};for(;f.length>0;){let e=f.shift();if(!o.has(e)){let t=s.get(e);if(o.add(e),t){let r=null!==(l=t[a])&&void 0!==l?l:[];if(r.length>0){let a=d(r);a.length>0&&n.push({uri:e,names:a}),t.references.forEach((t=>{o.has(t.uri)||f.unshift(e)}))}}}}let u=[];return s.forEach(((e,r)=>{var l;if(!o.has(r)){let i=null!==(l=e[a])&&void 0!==l?l:[];if(i.length>0){let a=d(i);if(a.length>0){e.references.some((e=>e.uri==t.uri))?u.unshift({uri:r,names:a}):u.push({uri:r,names:a})}}}})),n.push(...u),n}exports.filterClassData=filterClassData,exports.filterIdData=filterIdData;