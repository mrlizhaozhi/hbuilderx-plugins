"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getExtensionApi=void 0;class ApiV0{constructor(e,t){this.onCompletionAccepted=e,this._pluginManager=t}configurePlugin(e,t){this._pluginManager.setConfiguration(e,t)}}function getExtensionApi(e,t){return{getAPI(i){if(0===i)return new ApiV0(e,t)}}}exports.getExtensionApi=getExtensionApi;