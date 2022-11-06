"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.BaseExtraServer=void 0;const baseCompletionProcessor_1=require("./completion/baseCompletionProcessor"),baseDefinitionProcessor_1=require("./definition/baseDefinitionProcessor"),formatProcessor_1=require("./format/formatProcessor"),baseSymbolProcessor_1=require("./symbol/baseSymbolProcessor");class BaseExtraServer{constructor(){this.completionProcessor=new baseCompletionProcessor_1.BaseCompletionProcessor,this.definitionProcessor=new baseDefinitionProcessor_1.BaseDefinitionProcessor,this.symbolProcessor=new baseSymbolProcessor_1.BaseSymbolProcessor,this.doExtraCompletion=this.completionProcessor.doExtraCompletion.bind(this.completionProcessor),this.doDefinition=this.definitionProcessor.getDefinitionDataFromID.bind(this.definitionProcessor),this.doFormatting=formatProcessor_1.getFormattingData,this.doDocumentSymbol=this.symbolProcessor.getHxKindConvertedSymbolsData.bind(this.symbolProcessor)}getLanguageServiceExt(){}}exports.BaseExtraServer=BaseExtraServer;