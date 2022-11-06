const hx = require('hbuilderx');
function runOrDebugLocalCloudFunctionOrObject(){
   return new Promise(async (resolve, reject) => {
	   let tipText1 = "当前操作依赖插件【javascript运行调试】，请安装后再试";
	   let msgBoxBtnInstall = "安装(&O)"
	   let msgBoxBtnCancel = "取消(&C)"
	   
	   let res = await hx.extensions.existsPlugin("hbuilderx-node-debug");
	   if (res.code === 0) {
	       // console.log("unicloud exists",res)
	       // 判断插件是否存在
	       if (!res.exists) {
	           // 弹出提示框
	           let result = await hx.window.showMessageBox({
	               type: 'warning',
	               title: '',
	               text: tipText1,
	               buttons: [msgBoxBtnInstall, msgBoxBtnCancel]
	           });
	           // 安装插件
	           if (result == msgBoxBtnInstall) {
	               let installRes = await hx.extensions.installPlugin("hbuilderx-node-debug")
				   resolve({code: 2, exists: true});
	           }else{
				   resolve({code: 1, exists: false});
			   }
	       }else{
			   resolve(res);
		   }
	   }
   })
}

//该方法将在插件激活的时候调用
function activate(context) {
	hx.workspace.registerWorkspaceFolderLauncher('development.run.node.proxy', () => {
		runOrDebugLocalCloudFunctionOrObject();
	})
	hx.workspace.registerWorkspaceFolderLauncher('development.debug.node.proxy', () => {
		runOrDebugLocalCloudFunctionOrObject();
	})
	hx.workspace.registerWorkspaceFolderLauncher('node.proxy', () => {
		runOrDebugLocalCloudFunctionOrObject();
	})
	let createLaunch = hx.workspace.registerWorkspaceFolderLauncher('create.launch.proxy', () => {
		runOrDebugLocalCloudFunctionOrObject();
	})
	
	hx.workspace.registerWorkspaceFolderLauncher('config.node.path.proxy', () => {
		runOrDebugLocalCloudFunctionOrObject();
	})
	
	context.subscriptions.push(createLaunch);
}

//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}