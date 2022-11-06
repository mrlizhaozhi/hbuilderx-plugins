"use strict";var __decorate=this&&this.__decorate||function(e,t,r,o){var c,i=arguments.length,s=i<3?t:null===o?o=Object.getOwnPropertyDescriptor(t,r):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,o);else for(var n=e.length-1;n>=0;n--)(c=e[n])&&(s=(i<3?c(s):i>3?c(t,r,s):c(t,r))||s);return i>3&&s&&Object.defineProperty(t,r,s),s};Object.defineProperty(exports,"__esModule",{value:!0}),exports.NodeLogDirectoryProvider=void 0;const fs=require("fs"),path=require("path"),memoize_1=require("../utils/memoize");class NodeLogDirectoryProvider{constructor(e){this.context=e}getNewLogDirectory(){const e=this.logDirectory();if(e)try{return fs.mkdtempSync(path.join(e,"tsserver-log-"))}catch(e){return}}logDirectory(){try{const e=this.context.logPath;return fs.existsSync(e)||fs.mkdirSync(e),this.context.logPath}catch(e){return}}}__decorate([memoize_1.memoize],NodeLogDirectoryProvider.prototype,"logDirectory",null),exports.NodeLogDirectoryProvider=NodeLogDirectoryProvider;