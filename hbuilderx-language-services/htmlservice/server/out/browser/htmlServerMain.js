"use strict";Object.defineProperty(exports,"__esModule",{value:!0});const browser_1=require("vscode-languageserver/browser"),htmlServer_1=require("../htmlServer"),messageReader=new browser_1.BrowserMessageReader(self),messageWriter=new browser_1.BrowserMessageWriter(self),connection=(0,browser_1.createConnection)(messageReader,messageWriter);(0,htmlServer_1.startServer)(connection,{});