"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ConfigurePluginCommand=void 0;class ConfigurePluginCommand{constructor(e){this.pluginManager=e,this.id="_typescript.configurePlugin"}execute(e,i){this.pluginManager.setConfiguration(e,i)}}exports.ConfigurePluginCommand=ConfigurePluginCommand;