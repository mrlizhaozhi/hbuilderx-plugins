const hx = require('hbuilderx')

async function runOrDebugLocalCloudFunctionOrObject(){
    let tipText1 = "当前操作依赖插件【unicloud】，请安装后再试";
    let msgBoxBtnInstall = "安装(&O)"
    let msgBoxBtnCancel = "取消(&C)"
    
    let res = await hx.extensions.existsPlugin("unicloud");
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
                let installRes = await hx.extensions.installPlugin("unicloud")
            }
        }
    }
}

// 该方法将在插件激活的时候调用
function activate(context) {
    hx.workspace.registerWorkspaceFolderLauncher("unicloud.launcher.runLocalCloudObject.proxy", async function(session) {
        runOrDebugLocalCloudFunctionOrObject(session)
    });
    hx.workspace.registerWorkspaceFolderLauncher("unicloud.launcher.debugLocalCloudObject.proxy", async function(session) {
        runOrDebugLocalCloudFunctionOrObject(session)
    });    
    hx.workspace.registerWorkspaceFolderLauncher("unicloud.launcher.runLocalCloudFunction.proxy", async function(session) {
        runOrDebugLocalCloudFunctionOrObject(session)
    });
    hx.workspace.registerWorkspaceFolderLauncher("unicloud.launcher.debugLocalCloudFunction.proxy", async function(session) {
        runOrDebugLocalCloudFunctionOrObject(session)
    });
    // 上传并运行云函数(cmd+r触发)
    hx.workspace.registerWorkspaceFolderLauncher("unicloud.launcher.uploadAndExecFunction.proxy", async function(session) {
        runOrDebugLocalCloudFunctionOrObject(session)
    });
    // 上传并运行云对象(cmd+r触发)
    hx.workspace.registerWorkspaceFolderLauncher("unicloud.launcher.uploadAndExecObject.proxy", async function(session) {
        runOrDebugLocalCloudFunctionOrObject(session)
    });
    // 配置运行测试参数
    hx.workspace.registerWorkspaceFolderLauncher("unicloud.launcher.configureRunTestParam.proxy", async function(session) {
        runOrDebugLocalCloudFunctionOrObject(session)
    });
    
}
// 该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
    activate,
    deactivate
}
