"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.UnicloudDbTypeCheckerPlugin=void 0;const dbShema_1=require("../utils/dbShema");class UnicloudDbTypeCheckerPlugin{constructor(e){this.info=e}checkExpression(e,t,i,n,l,s){var a;const o=n.getText();if(-1!=o.indexOf("__VLS_useCollection")&&-1!=n.parent.parent.getText().indexOf("data:`__VLS_useCollection")){let e=!1,n=[],l=new Set,s=new Map;try{let t=o.match(/(?<=__VLS_useCollection\()[\S\s]*((?=\)))/g)[0],i=JSON.parse(t);if(i){if(i.getone&&!i.getone.isDynamic&&i.getone.value)try{e=JSON.parse(i.getone.value)}catch(e){}if(i.collection&&!i.collection.isDynamic&&i.collection.value){n=i.collection.value.split(",").filter((e=>""!==e))}if(i.field&&!i.field.isDynamic&&i.field.value){const e=require("../../../lib/jql");if(e&&e.parseField){let t=e.parseField(i.field.value),n=function(e){if("Program"===e.type)n(e.body[0]);else if("ExpressionStatement"===e.type)n(e.expression);else if("SequenceExpression"===e.type)e.expressions.forEach((e=>{n(e)}));else if("JQLAsExpression"===e.type){let t=e.field,i=e.alias;if("Identifier"===t.type&&"Identifier"===i.type){if("✖"===t.name||"✖"===i.name)return;l.add(t.name),s.set(t.name,i.name)}else if("CallExpression"===t.type&&"Identifier"===i.type){if("✖"===i.name)return;let e="CallExpression-"+t.callee.name;l.add(e),s.set(e,i.name)}}else"Identifier"===e.type&&l.add(e.name)};n(t)}}}}catch(e){}let r="",c=(0,dbShema_1.getDbSchemaFields)(this.info.project,n,0===l.size?void 0:l),d=new Set(l);c.forEach((e=>{0!==e.fields.length&&(r+=""!==r?"&":"",r+="{",e.fields.forEach((e=>{d.has(e.name)&&d.delete(e.name),r+=`\n/**\n * ${e.description}\n */\n${s.has(e.name)?s.get(e.name):e.name}:${e.type};`})),r+="\n}")})),0!==d.size&&(r+=""!==r?"&":"",r+="{",d.forEach((e=>{r+=`${s.has(e)?s.get(e):e}:any;`})),r+="}");let f="";f+=(e?`declare var schema:${r}`:`declare var schema:${r}[]`)+"\n",f+="export default schema";let p=this.info.ts.createSourceFile("",f,this.info.ts.ScriptTarget.Latest);i.bindSourceFile(p,t);const u=i.getSymbolOfNode(p);if(u){const e=i.resolveExternalModuleSymbol(u);if(e){const t=null===(a=e.exports)||void 0===a?void 0:a.get("default");if(t)return i.getTypeOfSymbol(t)}}}}}exports.UnicloudDbTypeCheckerPlugin=UnicloudDbTypeCheckerPlugin;