const{targets:allTargets,fuzzyMatchTarget:fuzzyMatchTarget,copyResource:copyResource,checkBuildFile:checkBuildFile}=require("./utils"),args=require("minimist")(process.argv.slice(2)),targets=args._,devOnly=args.devOnly||args.d,buildAllMatching=args.all||args.a;async function run(){checkBuildFile()}run();