"use strict";var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});const code_gen_1=require("../../../code-gen"),string_prototype_matchall_1=__importDefault(require("string.prototype.matchall"));function default_1(){return{compileFileToVue(e,t){if(e.endsWith(".html")){let e=t,s=!1;const n=/\<(script|style)[\s\S]*?\>([\s\S]*?)\<\/\1\>/g,r=new code_gen_1.CodeGen;let i=(0,string_prototype_matchall_1.default)(t,n);for(const t of i)if(void 0!==t.index){const n=t[0];n.startsWith("<script")&&n.indexOf("src=")>=0?e=e.substring(0,t.index)+" ".repeat(n.length)+e.substring(t.index+n.length):n.startsWith("<style")&&(r.addCode2(n,t.index,void 0),r.addText("\n\n"),e=e.substring(0,t.index)+" ".repeat(n.length)+e.substring(t.index+n.length)),n.startsWith("<script")&&(n.indexOf('lang="ts"')>=0||n.indexOf('lang="tsx"')>=0)&&(s=!0)}return e=e.replace(/<script[\s\S]*?>/g,(e=>`<vls-sr${" ".repeat(e.length-"<script>".length)}>`)),e=e.replace(/<\/script>/g,"</vls-sr>"),r.addText("<template>\n"),r.addCode2(e,0,void 0),r.addText("\n</template>"),s&&r.addText('\n<script setup lang="ts"><\/script>'),{vue:r.getText(),mappings:r.getMappings().map((e=>({fileOffset:e.sourceRange.start,vueOffset:e.mappedRange.start,length:e.mappedRange.end-e.mappedRange.start})))}}}}}exports.default=default_1;