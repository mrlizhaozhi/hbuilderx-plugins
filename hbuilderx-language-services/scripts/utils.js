const fs=require("fs-extra"),path=require("path"),chalk=require("chalk"),execa=require("execa"),targets=[],rootDir=path.resolve(__dirname,"../");targets.push(rootDir);let compileDirs=["utils","indexlib","serverinterface","indexservice","cssservice/entry","cssservice/client","cssservice/server","htmlservice/entry","htmlservice/index","htmlservice/client","htmlservice/server","jsservice","jsservice/src/tsplugins/node_modules/dcloudio","stylusservice"];function load(e,s){let t=s,o=[];const r=fs.readdirSync(e);for(let s=0;s<r.length;s++){const l=r[s];fs.lstatSync(resolve(e,l)).isDirectory()?o=o.concat(load(resolve(e,l),t)):t.test(l)&&o.push(resolve(e,l))}return o}function loadFile(e,s){let t=[];const o=fs.readdirSync(e);for(let r=0;r<o.length;r++){const l=o[r];fs.lstatSync(resolve(e,l)).isDirectory()||s.test(l)&&t.push(resolve(e,l))}return t}compileDirs.forEach((e=>{targets.push(e)})),exports.targets=targets,exports.fuzzyMatchTarget=(e,s)=>{const t=[];if(e.forEach((e=>{for(const o of targets)if(o.match(e)&&(t.push(o),!s))break})),t.length)return t.sort(((e,s)=>priority[s]-priority[e]));console.log(),console.error(`  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(`Target ${chalk.underline(e)} not found!`)}`),console.log(),process.exit(1)},exports.copyResource=(e,s)=>{console.log(`\n${chalk.blueBright(chalk.bold("Start Copy File!"))}`);let t=["builtin-dts","frameworkdts"];console.log(`${e} - ${s}`);try{t.forEach((t=>{let o=path.join(e,t),r=path.join(s,t);fs.copySync(o,r),console.log(`copy ${o} to ${r}`)}))}catch(e){console.error(`copy resource ${e}`)}console.log(`${chalk.blueBright(chalk.bold("Copy File Ends!"))}\n`)},exports.checkBuildFile=()=>{console.log(`\n${chalk.blueBright(chalk.bold("Start Check File!"))}`);let e=/^.*(tsconfig.json)$/,s=load(__dirname.substring(0,__dirname.length-7),e),t=[];for(const o of s)if(e=/^.*(node_modules).*$/,!e.test(o)){let e=o.substring(0,o.length-13);fs.existsSync(e)&&t.push(o.substring(0,o.length-13))}let o=[];for(const e of t){fs.lstatSync(e).isDirectory()&&o.push(e)}let r=[],l=[];for(const e of o){let s=/^.*(.ts)$/,t=loadFile(e,s),o=load(path.join(e,"\\src"),s);r.push(...t),r.push(...o)}let c=/^.*(d.ts)$/;for(const s of r)e=/^.*(node_modules).*$/,e.test(s)||c.test(s)||l.push(s);let n=[],i="";for(const e of l)i=e.replace("src","out"),i=i.replace(".ts",".js"),n.push(i);for(const e of n)fs.existsSync(e)||(console.log(`\n${chalk.redBright(chalk.bold("File Is NoExistent"))}`),console.log(`${chalk.greenBright(chalk.bold(`File Path: ${e}`))}\n`));console.log(`${chalk.blueBright(chalk.bold("Check File Ends!"))}\n`)};