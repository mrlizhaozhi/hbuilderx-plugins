"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.HtmlTsDefinitionSourceMap=void 0;class HtmlTsDefinitionSourceMap{constructor(e,t){this.info=e,this.htmlCachesInProjectScope=t}isEmbedFile(e){return this.htmlCachesInProjectScope.fileInCache(e)}getTextSpan(e,t){let o=this.htmlCachesInProjectScope.getSourceFileFromEmbeddedFileName(e);if(o)return{start:o.offsetAt(t.start),length:o.offsetAt(t.end)-o.offsetAt(t.start)}}}exports.HtmlTsDefinitionSourceMap=HtmlTsDefinitionSourceMap;