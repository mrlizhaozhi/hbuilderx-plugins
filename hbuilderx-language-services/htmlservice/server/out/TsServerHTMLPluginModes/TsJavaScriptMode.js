"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.JavaScriptEmbedMode=void 0;class JavaScriptEmbedMode{constructor(e,t){this.info=e,this.htmlCachesInProjectScope=t}getCompletionsAtPosition(e,t,n,i){return e.getCompletionsAtPosition(t,n,i)}getCompletionEntryDetails(e,t,n,i,o,r,s,a){return e.getCompletionEntryDetails(t,n,i,o,r,s,a)}getQuickInfoAtPosition(e,t,n){return e.getQuickInfoAtPosition(t,n)}getSignatureHelpItems(e,t,n,i){return e.getSignatureHelpItems(t,n,i)}getDefinitionAndBoundSpan(e,t,n){return e.getDefinitionAndBoundSpan(t,n)}getNavigationTree(e,t){return e.getNavigationTree(t)}findReferences(e,t,n){return e.findReferences(t,n)}}exports.JavaScriptEmbedMode=JavaScriptEmbedMode;