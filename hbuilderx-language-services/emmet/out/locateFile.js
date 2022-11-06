"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.locateFile=void 0;const path=require("path"),fs=require("fs"),reAbsolutePosix=/^\/+/,reAbsoluteWin32=/^\\+/,reAbsolute="/"===path.sep?reAbsolutePosix:reAbsoluteWin32;function locateFile(e,t){return/^\w+:/.test(t)?Promise.resolve(t):(t=path.normalize(t),reAbsolute.test(t)?resolveAbsolute(e,t):resolveRelative(e,t))}function resolveRelative(e,t){return tryFile(path.resolve(e,t))}function resolveAbsolute(e,t){return new Promise(((r,o)=>{t=t.replace(reAbsolute,"");const s=e=>{tryFile(path.resolve(e,t)).then(r,(()=>{const r=path.dirname(e);if(!r||r===e)return o(`Unable to locate absolute file ${t}`);s(r)}))};s(e)}))}function tryFile(e){return new Promise(((t,r)=>{fs.stat(e,((o,s)=>o?r(o):s.isFile()?void t(e):r(new Error(`${e} is not a file`))))}))}exports.locateFile=locateFile;