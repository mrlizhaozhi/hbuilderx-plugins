"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getDocumentContext=void 0;const strings_1=require("../utils/strings"),requests_1=require("../requests");function getDocumentContext(e,t){return{resolveReference:(r,s=e)=>{if("/"===r[0]){let s=function(){for(let r of t){let t=r.uri;if((0,strings_1.endsWith)(t,"/")||(t+="/"),(0,strings_1.startsWith)(e,t))return t}}();if(s)return s+r.substr(1)}return s=s.substr(0,s.lastIndexOf("/")+1),(0,requests_1.resolvePath)(s,r)}}}exports.getDocumentContext=getDocumentContext;