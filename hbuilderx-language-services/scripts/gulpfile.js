const gulp=require("gulp"),del=require("del"),rename=require("gulp-rename"),es=require("event-stream"),nls=require("vscode-nls-dev"),ts=require("gulp-typescript"),sourcemaps=require("gulp-sourcemaps"),typescript=require("typescript"),tsProject=ts.createProject("./tsconfig.json",{typescript:typescript}),inlineMap=!0,inlineSource=!1,languages=[{folderName:"zh-cn",id:"zh-cn"}],cleanTask=function(){return del(["out/**","package.nls.*.json"])},sourcesNsl=function(){var e=tsProject.src().pipe(sourcemaps.init()).pipe(tsProject()).js.pipe(nls.rewriteLocalizeCalls()).pipe(nls.createAdditionalLanguageFiles(languages,"i18n","")).pipe(nls.bundleMetaDataFiles("hx-ts-nls-sample","")).pipe(nls.bundleLanguageFiles());return(e=e.pipe(sourcemaps.write("../out",{includeContent:false,sourceRoot:"../src"}))).pipe(gulp.dest("out"))},packageNls=function(){return gulp.src(["package.nls.json"],{allowEmpty:!0}).pipe(nls.createAdditionalLanguageFiles(languages,"i18n")).pipe(gulp.dest("."))},nlsTask=gulp.series(cleanTask,sourcesNsl,packageNls);gulp.task("clean",cleanTask),gulp.task("nls",nlsTask);const sourcesMsg=function(){const e=".i18n.json";return tsProject.src().pipe(sourcemaps.init()).pipe(tsProject()).js.pipe(nls.rewriteLocalizeCalls()).pipe(nls.createKeyValuePairFile()).pipe(es.through((function(s){-1!==s.path.indexOf(e,s.path.length-e.length)&&this.queue(s)}))).pipe(gulp.dest("./i18n/base"))},packageMsg=function(){return gulp.src(["package.nls.json"]).pipe(rename({basename:"package",suffix:".i18n"})).pipe(gulp.dest("./i18n/base"))},messageTask=gulp.series(sourcesMsg,packageMsg);gulp.task("message",messageTask);