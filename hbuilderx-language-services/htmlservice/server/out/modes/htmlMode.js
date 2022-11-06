"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getHTMLMode=void 0;const out_1=require("../../../../utils/out"),htmlModeExtentsion_1=require("../modes-ext/htmlModeExtentsion"),idClassCompletion_1=require("../modes-ext/idClassCompletion"),PathCompletionParticipant_1=require("../modes-ext/PathCompletionParticipant"),documentContext_1=require("../utils/documentContext");function getHTMLMode(e,t,o,n){let i=(0,htmlModeExtentsion_1.getHtmlModeExt)(t,o,n),s=[];return s.push(new idClassCompletion_1.IdClassCompletionParticipant),e.fileSystemProvider&&e.fileSystemProvider.readDirectory&&s.push(new PathCompletionParticipant_1.PathCompletionParticipant(e.fileSystemProvider.readDirectory)),t.setCompletionParticipants(s),{getId:()=>"html",getSelectionRange:async(e,o)=>t.getSelectionRanges(e,[o])[0],async doComplete(e,r,a,l=n.settings){let d=l&&l.html&&l.html.suggest;l&&l.html&&l.html.autoClosingTags&&(d.hideAutoCompleteProposals=!0);let m=(0,documentContext_1.getRootFolder)(e.uri,n.folders);const c=o.get(e);return await i.doComplete(e,r,c,(async o=>{var n;s.forEach((e=>{var t;null===(t=e.beginCompletion)||void 0===t||t.call(e,{workspaceFolder:m})}));let i=await t.doComplete2(e,r,c,a,o);for(let t=0;t<s.length;t++){const o=s[t];let r=await o.computeCompletions(e,c,a);i.items.push(...r.items),i.isIncomplete=i.isIncomplete||r.isIncomplete,null===(n=o.endCompletion)||void 0===n||n.call(o)}return i}),d)},doHover:async(e,n)=>t.doHover(e,n,o.get(e)),findDocumentHighlight:async(e,n)=>t.findDocumentHighlights(e,n,o.get(e)),findDocumentLinks:async(e,o)=>t.findDocumentLinks(e,o),findDocumentSymbols:async e=>(await t.findDocumentSymbols(e,o.get(e))).map((e=>{let t={...e};return t.hxKind=out_1.HxIconKind[out_1.HxIconKind.ELEMENT],t})),async format(e,o,i,s=n.settings){let r=s&&s.html&&s.html.format;return r=r?merge(r,{}):{},r.contentUnformatted?r.contentUnformatted=r.contentUnformatted+",script":r.contentUnformatted="script",r=merge(i,r),t.format(e,o,r)},getFoldingRanges:async e=>t.getFoldingRanges(e),async doAutoClose(e,n){let i=e.offsetAt(n),s=e.getText();return i>0&&s.charAt(i-1).match(/[>\/]/g)?t.doTagComplete(e,n,o.get(e)):null},async doRename(e,n,i){const s=o.get(e);return t.doRename(e,n,i,s)},async onDocumentRemoved(e){o.onDocumentRemoved(e)},async findMatchingTagPosition(e,n){const i=o.get(e);return t.findMatchingTagPosition(e,n,i)},async doOnTypeRename(e,n){const i=o.get(e);return t.findOnTypeRenameRanges(e,n,i)},async findDefinition(e,t){const n=o.get(e);return i.findDefinition(e,t,n)},updateDataProviders(e){i.updateDataProviders(e)},dispose(){o.dispose()}}}function merge(e,t){for(const o in e)e.hasOwnProperty(o)&&(t[o]=e[o]);return t}exports.getHTMLMode=getHTMLMode;