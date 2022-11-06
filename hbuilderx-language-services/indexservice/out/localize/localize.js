"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.loadMessageBundle=void 0;const path=require("path"),fs=require("fs"),rootDir_1=require("../rootDir");let options={};const toString=Object.prototype.toString;function isString(e){return"[object String]"===toString.call(e)}let resolvedMessages={};function initializeSettings(){if(process.env.VSCODE_NLS_CONFIG)try{let e=JSON.parse(process.env.VSCODE_NLS_CONFIG);isString(e.locale)&&(options.locale=e.locale.toLowerCase()),options.language=options.locale}catch(e){}}function format(e,t){let o="";return o=0===t.length?e:e.replace(/\{(\d+)\}/g,(function(e,o){var n=o[0],r=t[n],i=e;return"string"==typeof r?i=r:"number"!=typeof r&&"boolean"!=typeof r&&null!=r||(i=String(r)),i})),o}function localize(e,t,...o){return format(t,o)}function createScopedLocalizeFunction(e){return function(t,o,...n){return e.has(t)?format(e.get(t),n):format(o,n)}}function resolveLanguage(e){var t;let o=path.relative(rootDir_1.sourceRoot,e),n=null!==(t=options.language)&&void 0!==t?t:null,r="";for(;n;){let e=`i18n/${n}/${o}.i18n.json`,t=path.resolve(rootDir_1.extensionRoot,e);if(fs.existsSync(t)){r=t;break}{let e=n.lastIndexOf("-");n=e>0?n.substring(0,e):null}}return r}function loadMessageBundle(e){if(!e)return localize;const t=path.extname(e);t&&(e=e.slice(0,e.length-t.length));path.basename(e);let o=resolvedMessages[e];if(o)return createScopedLocalizeFunction(o);try{let t=resolveLanguage(e);if(t){o=new Map;const n=JSON.parse(fs.readFileSync(t,"utf8"));for(let e in n)o.set(e,n[e]);return resolvedMessages[e]=o,createScopedLocalizeFunction(o)}}catch(e){}return localize}initializeSettings(),exports.loadMessageBundle=loadMessageBundle;