"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.CssExtraServer=void 0;const cssCompletionProcessor_1=require("../completion/cssCompletionProcessor"),baseExtraServer_1=require("./baseExtraServer");class CssExtraServer extends baseExtraServer_1.BaseExtraServer{constructor(){super(...arguments),this.completionProcessor=new cssCompletionProcessor_1.CssCompletionProcessor,this.doExtraCompletion=this.completionProcessor.doExtraCompletion.bind(this.completionProcessor)}}exports.CssExtraServer=CssExtraServer;