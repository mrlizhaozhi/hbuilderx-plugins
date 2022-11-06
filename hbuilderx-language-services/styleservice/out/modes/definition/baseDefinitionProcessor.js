"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.BaseDefinitionProcessor=void 0;const vscode_css_languageservice_1=require("vscode-css-languageservice"),vscode_languageserver_1=require("vscode-languageserver"),vscode_uri_1=require("vscode-uri"),core_1=require("../../../../core"),node_1=require("../../../../htmlservice/entry/out/node"),node_2=require("../../../../indexlib/out/node"),node_3=require("../../../../serverinterface/out/node"),utils_1=require("../../../../utils"),baseIndexProcessor_1=require("../index/baseIndexProcessor"),util_1=require("../utils/util");class BaseDefinitionProcessor{locationToLocationLink(e,t){if(e.length<=0)return[];let o=[];for(const r of e)o.push(vscode_languageserver_1.LocationLink.create(r.uri,r.range,r.range,t));return o}doExtraDefinition(e,t,o,r,i){let n={uri:vscode_uri_1.URI.parse(e.sourceRoot).toString(),name:e.sourceRoot};return this.getDefinitionDataFromID(n,t,o,r,i)}getDefinitionDataFromID(e,t,o,r,i){let n=[],s=[];i&&n.unshift(i);const a=(0,util_1.getLocationFromPosition)(t,r,o);if(!a)return this.locationToLocationLink(n);if("css"!==t.languageId)return this.locationToLocationLink(n,a.range);const c=t.getText(a.range);if(!c.startsWith("#"))return this.getDefinitionDataFromAtPath(e,t,o,r,i);if(!e)return this.locationToLocationLink(n,a.range);let u={text:c.substring(1),type:node_3.SymbolType.ElementId},g=(0,node_1.getLanguageServerExt)();if(!g||!g.findSymbol)return this.locationToLocationLink(n,a.range);let l=g.findSymbol(t,u,e);return s.push(...l instanceof Array?l:[l]),s.length>0&&n.unshift(...s),this.locationToLocationLink(n,a.range)}getDefinitionDataFromAtPath(e,t,o,r,i){let n=[];i&&n.unshift(i);const s=t.offsetAt(o),a=(0,util_1.styleGetNodeAtOffset)(r,s),c=(0,util_1.getLocationFromPosition)(t,r,o);if(!c)return this.locationToLocationLink(n);const u=t.getText(c.range).replace(/'/g,"").replace(/"/g,"");if(!c)return this.locationToLocationLink(n);if(!e)return this.locationToLocationLink(n,c.range);if(u.startsWith("@")&&a.parent.nodeType===core_1.NodeType.URILiteral){let t=vscode_uri_1.URI.parse(e.uri).fsPath,o=u.replace("@",t).replace(/\\/g,"/");n.unshift({uri:utils_1.hx.toNormalizedUri(o),range:{start:vscode_languageserver_1.Position.create(0,0),end:vscode_languageserver_1.Position.create(0,0)}})}return this.locationToLocationLink(n,c.range)}getDefinedListFromIndexFile(e,t){let o=[];if(e.length<=0)return o;let r=core_1.NodeType.ClassSelector;for(const i of e){let e=i.lastIndexOf("."),n=i.substring(e+1),s=(0,core_1.createDocument)(i,n),a=(0,util_1.createAstNode)(s,n),c=(0,util_1.getLocationFromText)(s,a,r,"."+t.text);0!==c.length&&o.push(...c)}return o}getDefinitionFromClass(e,t,o){if(void 0===e)return[];if(o.type!==node_3.SymbolType.StyleClass)return[];if(!o.sourceDocument)return[];let r,i=node_2.ReferenceFileType.CSS;r=(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(t),"scss"===t.languageId?r=(0,vscode_css_languageservice_1.getSCSSLanguageService)().parseStylesheet(t):"less"===t.languageId&&(r=(0,vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(t));let n=[];if(r.accept((e=>{if(e.type===core_1.NodeType.ClassSelector){if(o.text===e.getText().replace(".","")){let o=t.positionAt(e.offset),r=t.positionAt(e.offset+e.getText().length),i=vscode_languageserver_1.Range.create(o,r);n.push(vscode_languageserver_1.Location.create(t.uri,i))}if(n.length>0)return!1}return!0})),n.length>0)return n;let s=(new baseIndexProcessor_1.BaseIndexProcessor).getIndexDataFromFile(e,o.sourceDocument.uri),a=[];for(const e of s)for(const t of e.references)t.type===i&&a.push(t.uri);return n=this.getDefinedListFromIndexFile(a,o),n}async getBaseLocationLink(e,t,o,r,i){let n=[];r=(0,vscode_css_languageservice_1.getCSSLanguageService)().parseStylesheet(t),"scss"===t.languageId?r=(0,vscode_css_languageservice_1.getSCSSLanguageService)().parseStylesheet(t):"less"===t.languageId&&(r=(0,vscode_css_languageservice_1.getLESSLanguageService)().parseStylesheet(t)),i&&n.unshift(i);if(!(0,util_1.getLocationFromPosition)(t,r,o))return this.locationToLocationLink(n);return this.getDefinitionDataFromAtPath(e,t,o,r,i)}}exports.BaseDefinitionProcessor=BaseDefinitionProcessor;