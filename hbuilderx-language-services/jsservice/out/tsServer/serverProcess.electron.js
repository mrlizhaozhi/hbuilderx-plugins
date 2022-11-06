"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ChildServerProcess=void 0;const child_process=require("child_process"),fs=require("fs"),path=require("path"),vscode=require("vscode"),nls=require("vscode-nls"),dispose_1=require("../utils/dispose"),localize=nls.loadMessageBundle(),defaultSize=8192,contentLength="Content-Length: ",contentLengthSize=Buffer.byteLength(contentLength,"utf8"),blank=Buffer.from(" ","utf8")[0],backslashR=Buffer.from("\r","utf8")[0],backslashN=Buffer.from("\n","utf8")[0];class ProtocolBuffer{constructor(){this.index=0,this.buffer=Buffer.allocUnsafe(8192)}append(e){let t=null;if(t=Buffer.isBuffer(e)?e:Buffer.from(e,"utf8"),this.buffer.length-this.index>=t.length)t.copy(this.buffer,this.index,0,t.length);else{let e=8192*(Math.ceil((this.index+t.length)/8192)+1);0===this.index?(this.buffer=Buffer.allocUnsafe(e),t.copy(this.buffer,0,0,t.length)):this.buffer=Buffer.concat([this.buffer.slice(0,this.index),t],e)}this.index+=t.length}tryReadContentLength(){let e=-1,t=0;for(;t<this.index&&(this.buffer[t]===blank||this.buffer[t]===backslashR||this.buffer[t]===backslashN);)t++;if(this.index<t+contentLengthSize)return e;t+=contentLengthSize;let s=t;for(;t<this.index&&this.buffer[t]!==backslashR;)t++;if(t+3>=this.index||this.buffer[t+1]!==backslashN||this.buffer[t+2]!==backslashR||this.buffer[t+3]!==backslashN)return e;let r=this.buffer.toString("utf8",s,t);return e=parseInt(r),this.buffer=this.buffer.slice(t+4),this.index=this.index-(t+4),e}tryReadContent(e){if(this.index<e)return null;let t=this.buffer.toString("utf8",0,e),s=e;for(;s<this.index&&(this.buffer[s]===backslashR||this.buffer[s]===backslashN);)s++;return this.buffer.copy(this.buffer,0,s),this.index=this.index-s,t}}class Reader extends dispose_1.Disposable{constructor(e){super(),this.buffer=new ProtocolBuffer,this.nextMessageLength=-1,this._onError=this._register(new vscode.EventEmitter),this.onError=this._onError.event,this._onData=this._register(new vscode.EventEmitter),this.onData=this._onData.event,e.on("data",(e=>this.onLengthData(e)))}onLengthData(e){if(!this.isDisposed)try{for(this.buffer.append(e);;){if(-1===this.nextMessageLength&&(this.nextMessageLength=this.buffer.tryReadContentLength(),-1===this.nextMessageLength))return;const e=this.buffer.tryReadContent(this.nextMessageLength);if(null===e)return;this.nextMessageLength=-1;const t=JSON.parse(e);this._onData.fire(t)}}catch(e){this._onError.fire(e)}}}class ChildServerProcess extends dispose_1.Disposable{constructor(e){super(),this._process=e,this._reader=this._register(new Reader(this._process.stdout))}static fork(e,t,s,r,i){fs.existsSync(e)||(vscode.window.showWarningMessage(localize("noServerFound","The path {0} doesn't point to a valid tsserver install. Falling back to bundled TypeScript version.",e)),i.reset(),e=i.currentVersion.tsServerPath);const n=child_process.fork(e,t,{silent:!0,cwd:void 0,env:this.generatePatchedEnv(process.env,e),execArgv:this.getExecArgv(s,r)});return new ChildServerProcess(n)}static generatePatchedEnv(e,t){const s=Object.assign({},e);return s.ELECTRON_RUN_AS_NODE="1",s.NODE_PATH=path.join(t,"..","..",".."),s.PATH=s.PATH||process.env.PATH,s}static getExecArgv(e,t){const s=[],r=this.getDebugPort(e);if(r){const e=ChildServerProcess.getTssDebugBrk()?"--inspect-brk":"--inspect";s.push(`${e}=${r}`)}return t.maxTsServerMemory&&s.push(`--max-old-space-size=${t.maxTsServerMemory}`),s}static getDebugPort(e){if("syntax"===e)return;const t=ChildServerProcess.getTssDebugBrk()||ChildServerProcess.getTssDebug();if(t){const e=parseInt(t);if(!isNaN(e))return e}else if(ChildServerProcess.inServerDebugMode)return 12345}static getTssDebug(){return process.env[vscode.env.remoteName?"TSS_REMOTE_DEBUG":"TSS_DEBUG"]}static getTssDebugBrk(){return process.env[vscode.env.remoteName?"TSS_REMOTE_DEBUG_BRK":"TSS_DEBUG_BRK"]}write(e){this._process.stdin.write(JSON.stringify(e)+"\r\n","utf8")}onData(e){this._reader.onData(e)}onExit(e){this._process.on("exit",e)}onError(e){this._process.on("error",e),this._reader.onError(e)}kill(){this._process.kill(),this._reader.dispose()}}exports.ChildServerProcess=ChildServerProcess;