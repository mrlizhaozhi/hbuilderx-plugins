"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.locationToLocationLink=exports.styleEnablePluginProxy=void 0;const vscode_css_languageservice_1=require("vscode-css-languageservice");function locationToLocationLink(e,n){if(e.length<=0)return[];let o=[];for(const t of e)o.push(vscode_css_languageservice_1.LocationLink.create(t.uri,t.range,t.range,n));return o}function styleEnablePluginProxy(e){let n=new Map,o=e.styleLanguageServiceList.keys();for(let t of o){let o=e.styleLanguageServiceList.get(t);o.doResolve=function(e,n,o,t){return e},o.tsFindDefinition=function(e,n,t){let i=o.findDefinition(e,n,t);if(null!==i)return locationToLocationLink([i])},n.set(t,o)}return n}exports.locationToLocationLink=locationToLocationLink,exports.styleEnablePluginProxy=styleEnablePluginProxy;