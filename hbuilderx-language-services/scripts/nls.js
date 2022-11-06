const ts=require("gulp-typescript"),sourcemaps=require("gulp-sourcemaps"),typescript=require("typescript"),gulp=require("gulp"),es=require("event-stream"),path=require("path"),fs=require("fs"),nls=require("vscode-nls-dev");var File=require("vinyl");const languages=[{folderName:"zh-cn",id:"zh-cn"},{folderName:"en",id:"en"}],extensionRoot=path.resolve(__dirname,"../");function collectProject(e){let t=[];return function e(r){if(t.findIndex((e=>e.dir==r))>=0)return;let s=path.join(r,"tsconfig.json");if(fs.existsSync(s)){const t=ts.createProject(s,{typescript:typescript});t.projectReferences&&t.projectReferences.forEach((t=>{e(t.path)}))}t.push({dir:r})}(e),t}function createNLSTasks(e){return e.map((e=>{return t=e,()=>{let e=t.dir;const r="hbuilderx."+path.relative(extensionRoot,e).replace(/\//g,"-");let s=path.join(e,"tsconfig.json");const i=ts.createProject(s,{typescript:typescript}),n=i.options.rootDir||"",p=i.options.outDir;if(!p)return console.error("compile option must specify outDir: "+s),null;let o=i.src().pipe(sourcemaps.init()).pipe(i()).js.pipe(nls.rewriteLocalizeCalls()).pipe(nls.createAdditionalLanguageFiles(languages,path.join(e,"i18n"),"")).pipe(nls.bundleMetaDataFiles(r,"")).pipe(nls.bundleLanguageFiles());return o=o.pipe(sourcemaps.write(p,{sourceRoot:n})),o.pipe(gulp.dest(p))};var t})).filter((e=>!!e))}function createMessageTask(e){return e.map((e=>{return t=e,()=>{let e=t.dir;const r=".i18n.json";let s=path.join(e,"tsconfig.json");const i=ts.createProject(s,{typescript:typescript}),n=path.resolve(e,"i18n/base");let p=i.src().pipe(i()).js.pipe(nls.rewriteLocalizeCalls()).pipe(nls.createKeyValuePairFile()).pipe(es.through((function(e){-1!==e.path.indexOf(r,e.path.length-r.length)&&this.queue(e)})));return p.pipe(gulp.dest(n)),p};var t})).filter((e=>!!e))}const projects=collectProject(path.dirname(__dirname)).filter((e=>"indexservice"==path.basename(e.dir)));gulp.task("nls",gulp.series(createNLSTasks(projects))),gulp.task("message",gulp.series(createMessageTask(projects)));