"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.doHover=exports.findDefinition=exports.doCompletion2=void 0;const fs=require("fs"),path=require("path"),ts=require("typescript"),vscode_languageserver_1=require("vscode-languageserver"),vscode_languageserver_textdocument_1=require("vscode-languageserver-textdocument"),vscode_uri_1=require("vscode-uri"),utils_1=require("../../../../utils"),javascriptMode_1=require("../modes/javascriptMode"),strings_1=require("../utils/strings"),generateInterpolationScript_1=require("./generateInterpolationScript"),vueScanner_1=require("./vueScanner");let documentRegs={version:100,documents:new Map},documentProvider={get version(){return""+documentRegs.version},get documents(){let e=[];return documentRegs.documents.forEach(((t,n)=>{e.push(n)})),e},compilerOptions:{allowNonTsExtensions:!0,allowJs:!0,lib:["lib.esnext.d.ts"],target:ts.ScriptTarget.Latest,moduleResolution:ts.ModuleResolutionKind.Classic,experimentalDecorators:!1},getDocumentSnapshot(e){let t="";return documentRegs.documents.has(e)&&(t=documentRegs.documents.get(e).getText()),{getText:(e,n)=>t.substring(e,n),getLength:()=>t.length,getChangeRange:()=>{}}},hasDocument:e=>documentRegs.documents.has(e),getDocumentVersion:e=>""+documentRegs.documents.get(e).version};const vforExpRe=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,iteratorReg=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,parensReg=/^\(|\)$/g;function getLanguageService(e,t,n){for(let t of e)documentRegs.documents.set(t.uri,t);let r=utils_1.hx.getProject(t);if(r)return r.createTSLanguageService(documentProvider)}function getTagAttributeValueOffset(e,t,n){let r=(0,vueScanner_1.createScanner)(e,t+1,vueScanner_1.ScannerState.WithinTag),o=r.scan(),i=!1;for(;o!=vueScanner_1.TokenType.EOS;){if(o===vueScanner_1.TokenType.AttributeName)i=r.getTokenText()===n;else if(o===vueScanner_1.TokenType.AttributeValue){if(i)return r.getTokenOffset()}else if(o===vueScanner_1.TokenType.StartTagClose||o===vueScanner_1.TokenType.EndTagOpen||o===vueScanner_1.TokenType.EndTagClose||o===vueScanner_1.TokenType.EndTag||o===vueScanner_1.TokenType.StartTag)break;o=r.scan()}return-1}function getTagAttributesValueOffset(e,t){let n=(0,vueScanner_1.createScanner)(e,t+1,vueScanner_1.ScannerState.WithinTag),r=n.scan(),o={},i="";for(;r!=vueScanner_1.TokenType.EOS;){if(r===vueScanner_1.TokenType.AttributeName)i=n.getTokenText();else if(r===vueScanner_1.TokenType.AttributeValue)i&&(o[i]=n.getTokenOffset());else if(r===vueScanner_1.TokenType.StartTagClose||r===vueScanner_1.TokenType.EndTagOpen||r===vueScanner_1.TokenType.EndTagClose||r===vueScanner_1.TokenType.EndTag||r===vueScanner_1.TokenType.StartTag)break;r=n.scan()}return o}function getHtmlNodeText(e,t){var n;let r=e.positionAt(t.startTagEnd),o=e.positionAt(null!==(n=t.endTagStart)&&void 0!==n?n:t.end);return e.getText({start:r,end:o})}function getVForAlias(e){let t=e.match(vforExpRe);if(!t)return;let n=t[2].trim(),r=t[1].trim().replace(parensReg,"").trim(),o=e.indexOf(r),i={name:r,offset:o},s={variable:{name:n,offset:e.lastIndexOf(n)},item:i},a=r.match(iteratorReg);if(a){i.name=r.slice(0,r.indexOf(",")).trim();let e=a[1].trim(),t=a[2]?a[2].trim():"";t.length>0&&([e,t]=[t,e]),s.index={name:e,offset:o+r.lastIndexOf(e)},t&&(s.key={name:t,offset:o+r.indexOf(t)})}return s}function convertComponentToScript(e,t,n,r,o){var i,s,a;let l=e.getText(n),u=e.offsetAt(r),c=vscode_uri_1.URI.parse(o.uri).fsPath,g=u-e.offsetAt(n.start),p=t.findNodeAt(u),f=!0;for(;p;){p.startTagEnd?p.startTagEnd:p.end;if(!f&&"unicloud-db"==p.tag&&p.attributes){if(p.attributes["v-slot:default"]&&p.attributes.collection){let e=new utils_1.JSClientDBNode(c),t=(0,strings_1.stripQuotes)(p.attributes.collection).split(",").map((e=>e.trim())),n=(0,strings_1.stripQuotes)(null!==(i=p.attributes.field)&&void 0!==i?i:"").trim();e.setVslot((0,strings_1.stripQuotes)(p.attributes["v-slot:default"])),e.setCollections(t),e.setFields((0,strings_1.stripQuotes)(n)),e.setGetone("true"===(0,strings_1.stripQuotes)(null!==(s=p.attributes.getone)&&void 0!==s?s:""));let r=e.computeVSlotDefaults(),o=[],a=[];r.forEach(((e,t)=>{o.push(t),a.push(t+":"+e)}));let u=`let {${o.join(",")}} = {${a.join(",")}}\n`;g+=u.length,l=u+l}}else{let e=null===(a=p.attributes)||void 0===a?void 0:a["v-for"];if(e){e=(0,strings_1.stripQuotes)(e);let t=e.match(vforExpRe);if(t){let e=t[2].trim(),n=t[1].trim().replace(parensReg,""),r=n,o=n.match(iteratorReg),i="";o&&o[2]&&(r=n.substring(0,n.indexOf(",")).trim(),r=r+","+o[2].trim(),i=o[1].trim(),i=`let ${i}:string=''; `);let s=`Object.values(${e}).forEach((${r})=>{\n ${i}`;l=s+l+";\n});",g+=s.length}}}p=p.parent,f=!1}return{text:l,offset:g}}function parseComponentSymbols(e,t,n,r,o){var i,s,a,l,u;const c=e.getText();let g=e.getText(n),p=e.offsetAt(r),f=(vscode_uri_1.URI.parse(o.uri).fsPath,p-e.offsetAt(n.start)),d=t.findNodeAt(p),v=!0,m=[];for(;d;)if(d.attributes){if("unicloud-db"==d.tag){if(v){if(d.attributes["v-slot:default"]&&d.attributes.collection){let e=null!==(u=getTagAttributesValueOffset(c,d.start).collection)&&void 0!==u?u:-1,t=d.attributes.collection;if(e>0&&p>=e&&p<e+t.length){let n="const db = uniCloud.database();\r\ndb.collection(";f=p-e+n.length,n+=t+");",g=n,m=[];break}}}else if(d.attributes["v-slot:default"]&&d.attributes.collection){let e=getTagAttributesValueOffset(c,d.start),t=null!==(i=e["v-slot:default"])&&void 0!==i?i:-1;if(t>0){let n=[],r="const db = uniCloud.database();\r\n",o=d.attributes.collection,i=d.attributes.field,u="true"==(0,strings_1.stripQuotes)(null!==(s=d.attributes.getone)&&void 0!==s?s:""),c=d.attributes["v-slot:default"],p=(0,strings_1.stripQuotes)(c);t+=c.length!=p.length?1:0,r+="const ",n.push({offset:r.length,length:p.length,alias:{name:p,offset:t}}),r+=`${p} = await db.collection(`;let v=null!==(a=e.collection)&&void 0!==a?a:-1;if(n.push({offset:r.length,length:o.length,alias:{name:o,offset:v}}),r+=o+")",i){let t=null!==(l=e.field)&&void 0!==l?l:-1;n.push({offset:r.length,length:i.length,alias:{name:i,offset:t}}),r+=i+")"}r+=u?".limit(1).get();":".get();\r\n",f+=r.length,g=r+g,m.forEach((e=>{e.offset+=r.length})),m.push(...n)}}}else if(d.attributes["v-for"]){let e=getTagAttributeValueOffset(c,d.start,"v-for"),t=d.attributes["v-for"];if(e>=0&&t){let n=(0,strings_1.stripQuotes)(t);e+=n.length!=t.length?1:0,t=n;let r=getVForAlias(t);if(r){let t=[];Object.values(r).forEach((t=>{t.offset=e+t.offset}));let n=r.variable.name,o=r.item.name,i=`Object.values(${n}).forEach((`;if(t.push({offset:i.length,length:o.length,alias:r.item}),i+=o,r.index){i+=",";let e=r.index.name;t.push({offset:i.length,length:e.length,alias:r.index}),i+=e}if(i+=")=>{\n",r.key){i+="let ";let e=r.key.name;t.push({offset:i.length,length:e.length,alias:r.key}),i+=`${e}:string='';\n`}g=i+g+";\n});",f+=i.length,m.forEach((e=>{e.offset+=i.length})),m.push(...t)}}}d=d.parent,v=!1}else d=d.parent,v=!1;return m.sort(((e,t)=>e.offset-t.offset)),{text:g,offset:f,symboles:m}}async function findDefinition(e,t,n,r,o){var i,s;if(!t)return Promise.resolve(null);let a=t.roots.find((e=>"script"===e.tag));if(!a||null==a.startTagEnd)return Promise.resolve(null);let l=a.attributes&&void 0!==a.attributes.setup,u=parseComponentSymbols(e,t,n,r,o);e.getText();let c=u.offset,g=u.text,p=u.symboles,f=vscode_uri_1.URI.parse(o.uri).fsPath+"/",d=path.dirname(vscode_uri_1.URI.parse(e.uri).fsPath),v=e.positionAt(a.startTagEnd),m=e.positionAt(null!==(i=a.endTagStart)&&void 0!==i?i:a.end),_=e.getText({start:v,end:m});documentRegs.version++;let h="",T=[];const S=vscode_uri_1.URI.file(path.join(d,"__virtual-script.vue.ts")).toString();let x=-1;if(l)h=_+"\r\n"+g;else{let I=vscode_languageserver_textdocument_1.TextDocument.create(S,"typescript",e.version,_);T=[I];let O="\n\t\timport vue from './__virtual-script.vue';\n        import Vue from 'vue';\n\t\tlet $$_dataType = vue.data();\n\t\tlet $$_setupType = vue.setup();\n\t\tlet $$_methods = vue.methods;\n\t\tlet $$_props = vue.props;\n\t\tlet $$_computed = vue.computed;\n        let $$_vue = new Vue();\n\t",D=vscode_uri_1.URI.file(path.join(d,"@v-inferrer-type-helper.vue.ts")).toString(),C=vscode_languageserver_textdocument_1.TextDocument.create(D,"typescript",documentRegs.version,O),P=getLanguageService([I,C],f,e);if(!P)return Promise.resolve(null);h=(0,generateInterpolationScript_1.generateInterpolationScript)(P,C)+g,x=O.length}documentRegs.version++;let b=h.length-g.length,R=b+c,y=vscode_uri_1.URI.file(path.join(d,"@v-interpolation-script.vue")).toString(),$=vscode_languageserver_textdocument_1.TextDocument.create(y,"typescript",documentRegs.version,h),A=getLanguageService([...T,$],f,e);if(!A)return Promise.resolve(null);let k=A.getDefinitionAndBoundSpan($.uri,R),E=null!==(s=null==k?void 0:k.definitions)&&void 0!==s?s:[];if(E.length>0){let U=[];for(E.forEach((e=>U.push(e)));U.length>0;){let V=U.pop(),N=!1;if(V.fileName==$.uri){let j=V.contextSpan?V.contextSpan.start:-1,q=V.kind==ts.ScriptElementKind.letElement||V.kind==ts.ScriptElementKind.functionElement;if(!l&&q&&j>=x&&j<b){let L=A.getDefinitionAtPosition($.uri,V.contextSpan.start+V.contextSpan.length-1);L&&L.length>0&&L.forEach((e=>U.push(e)))}else if(V.textSpan.start>=b)for(let Q=0;Q<p.length;Q++){const w=p[Q],H=w.offset+b;if(H>V.textSpan.start)break;if(H+w.length>V.textSpan.start){let M=V.textSpan.start-H+w.alias.offset,F=e.positionAt(M),K=e.positionAt(M+V.textSpan.length);return{uri:e.uri,range:{start:F,end:K}}}}else l&&(N=!0)}else l||V.fileName!=S||(N=!0);if(N){let W={uri:e.uri,range:{start:e.positionAt(V.textSpan.start+e.offsetAt(v)),end:e.positionAt(V.textSpan.start+V.textSpan.length+e.offsetAt(v))}};return Promise.resolve(W)}}}if(E.length>0){const z=E[0],{line:B,character:J}=A.toLineColumnOffset(z.fileName,z.textSpan.start);let G={start:{line:B,character:J},end:{line:B,character:J+z.textSpan.length}};return[{targetUri:utils_1.hx.toNormalizedUri(z.fileName),targetRange:G,targetSelectionRange:G}]}if(k){function X(e,t,n){let r=t-1;const o=e.getText();let i=' \t\n\r":{[()]},*>+'+n;for(n||(i=' \t\n\r":{[()]},*>+');r>=0&&-1===i.indexOf(o.charAt(r));)r--;let s=o.substring(r+1,t),a=vscode_languageserver_1.Range.create(e.positionAt(r+1),e.positionAt(t)),l=t;for(;l!=o.length&&-1===i.indexOf(o.charAt(l));)l++;let u=o.substring(t,l),c=vscode_languageserver_1.Range.create(e.positionAt(t),e.positionAt(l));return{context:s+u,leftText:s,rightText:u,contextRange:vscode_languageserver_1.Range.create(e.positionAt(r+1),e.positionAt(l)),leftRange:a,rightRange:c}}const Y=k;let Z=Y[0].fileName;if(Z&&Z.includes("locale")&&Z.endsWith(".json")){let ee=fs.readFileSync(Z),te=vscode_languageserver_textdocument_1.TextDocument.create(Z,"json",1,ee.toString()),ne=te.positionAt(Y[0].textSpan.start),re=te.positionAt(Y[0].textSpan.start);re.character=re.character+Y[0].textSpan.length;let oe=vscode_languageserver_1.Range.create(ne,re),ie=X(e,e.offsetAt(r),"'");return[{targetUri:utils_1.hx.toNormalizedUri(Z),targetRange:oe,targetSelectionRange:oe,originSelectionRange:ie.contextRange}]}}return Promise.resolve(null)}async function doCompletion2(e,t,n,r,o){const i={isIncomplete:!1,items:[]};if(!t)return i;let s=t.roots.find((e=>"script"===e.tag));if(!s||null==s.startTagEnd)return i;let a=s.attributes&&void 0!==s.attributes.setup,l=convertComponentToScript(e,t,n,r,o),u=l.text,c=l.offset,g=vscode_uri_1.URI.parse(o.uri).fsPath+"/",p=path.dirname(e.uri),f=getHtmlNodeText(e,s);documentRegs.version++;let d="",v=[];if(a)d=f+"\r\n"+u;else{let t=vscode_uri_1.URI.parse(p+"/__virtual-script.vue.ts").toString(),n=vscode_languageserver_textdocument_1.TextDocument.create(t,"typescript",e.version,f);v=[n];let r="\n\t\timport vue from './__virtual-script.vue';\n\t\timport Vue from 'vue';\n\t\tlet $$_dataType = vue.data();\n\t\tlet $$_setupType = vue.setup();\n\t\tlet $$_methods = vue.methods;\n\t\tlet $$_props = vue.props;\n\t\tlet $$_computed = vue.computed;\n\t\tlet $$_vue = new Vue();\n\t\t";t=vscode_uri_1.URI.parse(p+"/@v-inferrer-type-helper.vue.ts").toString();let o=vscode_languageserver_textdocument_1.TextDocument.create(t,"typescript",documentRegs.version,r),s=getLanguageService([n,o],g,e);if(!s)return i;d=(0,generateInterpolationScript_1.generateInterpolationScript)(s,o)+u}documentRegs.version++;let m=d.length-u.length+c,_=vscode_uri_1.URI.parse(p+"/@v-interpolation-script.ts").toString(),h=vscode_languageserver_textdocument_1.TextDocument.create(_,"typescript",documentRegs.version,d),T=getLanguageService([...v,h],g,e);if(!T)return i;let S=T.getCompletionsAtPosition(h.uri,m,void 0);if(S){let t=S.entries.filter((e=>"keyword"!=e.kind)).map((t=>{let n=t;return{uri:h.uri,position:r,label:t.name,detail:n.detail,documentation:n.documentation,sortText:t.sortText,kind:(0,javascriptMode_1.convertKind)(t.kind),data:{kind:"vue-mustache",languageId:"vue-template",uri:e.uri}}}));i.items=t.filter((e=>!e.label.startsWith("$$_")))}return i.isIncomplete=!0,Promise.resolve(i)}async function doHover(e,t,n,r,o){const i={contents:[]};if(!t)return i;let s=t.roots.find((e=>"script"===e.tag));if(!s||null==s.startTagEnd)return i;let a=s.attributes&&void 0!==s.attributes.setup,l=convertComponentToScript(e,t,n,r,o),u=l.text,c=l.offset,g=vscode_uri_1.URI.parse(o.uri).fsPath+"/",p=path.dirname(e.uri),f=getHtmlNodeText(e,s);documentRegs.version++;let d="",v=[];if(a)d=f+"\r\n"+u;else{let t=vscode_uri_1.URI.parse(p+"/__virtual-script.vue.ts").toString(),n=vscode_languageserver_textdocument_1.TextDocument.create(t,"typescript",e.version,f);v=[n];let r="\n\t\timport vue from './__virtual-script.vue';\n\t\timport Vue from 'vue';\n\t\tlet $$_dataType = vue.data();\n\t\tlet $$_setupType = vue.setup();\n\t\tlet $$_methods = vue.methods;\n\t\tlet $$_props = vue.props;\n\t\tlet $$_computed = vue.computed;\n\t\tlet $$_vue = new Vue();\n\t\t";t=vscode_uri_1.URI.parse(p+"/@v-inferrer-type-helper.vue.ts").toString();let o=vscode_languageserver_textdocument_1.TextDocument.create(t,"typescript",documentRegs.version,r),s=getLanguageService([n,o],g,e);if(!s)return i;d=(0,generateInterpolationScript_1.generateInterpolationScript)(s,o)+u}documentRegs.version++;let m=d.length-u.length+c,_=vscode_uri_1.URI.parse(p+"/@v-interpolation-script.ts").toString(),h=vscode_languageserver_textdocument_1.TextDocument.create(_,"typescript",documentRegs.version,d),T=getLanguageService([...v,h],g,e);if(!T)return i;let S=T.getQuickInfoAtPosition(h.uri,m);if(!S||!S.documentation)return i;let x=[];for(const e of S.documentation)x.push(e.text);return i.contents=x,Promise.resolve(i)}exports.findDefinition=findDefinition,exports.doCompletion2=doCompletion2,exports.doHover=doHover;