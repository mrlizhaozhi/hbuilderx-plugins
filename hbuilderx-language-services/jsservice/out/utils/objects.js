"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.equals=void 0;const array=require("./arrays");function equals(r,e){if(r===e)return!0;if(null==r||null==e)return!1;if(typeof r!=typeof e)return!1;if("object"!=typeof r)return!1;if(Array.isArray(r)!==Array.isArray(e))return!1;if(Array.isArray(r))return array.equals(r,e,equals);{const s=[];for(const e in r)s.push(e);s.sort();const t=[];for(const r in e)t.push(r);return t.sort(),!!array.equals(s,t)&&s.every((s=>equals(r[s],e[s])))}}exports.equals=equals;