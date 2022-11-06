var util = require("./util.js")
var fs = require("fs")
var admZip = require("adm-zip")
var hx = require("hbuilderx");
var pathUtil = require("path")
var spawnSync = require("child_process").spawnSync;
var iconvlite = require("iconv-lite");

function platformIos(params) {
    if (!params) return false;

    if (params.toUpperCase() == "IOS" || params.toUpperCase() == "ALL") {
        return true;
    }
    return false;
}

function platformAndroid(params) {
    if (!params) return false;
    
    if (params.toUpperCase() == "ANDROID" || params.toUpperCase() == "ALL") {
        return true;
    }
    return false;
}

function platformNone(params) {
    if (!params) return false;
    if (params.toUpperCase() == "NONE") {
        return true;
    }
    return false;
}

function isUniAppVue(project)
{
    if ( project && project.nature == "UniApp_Vue") {
        return true;
    }
    return false;
}

function isWap2AppProject(project)
{
    if ( project && project.nature == "Wap2App") {
        return true;
    }
    
    return false;
}

let isPack;
async function verifyManifast(request) {
    let platform = "All";
    isPack = true;
    if (request.iosEnable && !request.androidEnable) {
        platform = "IOS";
    } else if (!request.iosEnable && request.androidEnable) {
        platform = "ANDROID";
    } else if (!request.iosEnable && !request.androidEnable) {
        isPack = false;
    }
    
    if (request.iosEnable) {
        let plus = request.manifast.plus;
        if (!plus) {
            plus = {};
            request.manifast.plus = plus;
        }
        let distribute = plus.distribute;
        if (!distribute) {
            distribute = {};
            plus.distribute = distribute;
        }
        let apple = distribute.apple;
        if (!apple) {
            apple = {};
            distribute.apple = apple;
        }
        if (request.iphoneEnable && !request.ipadEnable) {
            apple.devices = "iphone";
        } else if (!request.iphoneEnable && request.ipadEnable) {
            apple.devices = "ipad";
        } else if (request.iphoneEnable && request.ipadEnable) {
            apple.devices = "universal";
        }
    }

    let project = {
        project:request.project,
        nature:request.projectNature
    };
    
    var errorMap = verify(request.manifast,project,platform,true);
    let errorObj = {};
    errorMap.forEach((value,key)=>{
        errorObj[key] = value;
    })
    if(request.iosEnable && request.iosCertEnable){
        var ioserrors = await checkAppleCert(request);
        if(ioserrors){
            ioserrors.forEach((value,key)=>{
                errorObj[key] = value;
            })
        }   
    }
    
    if(request.androidEnable && request.androidCertEnable){
       var androiderrors = await checkAndroidCert(request);
       if(androiderrors){
           androiderrors.forEach((value,key)=>{
               errorObj[key] = value;
           })
       }
    }
    
    let ret = {
        "result":errorObj
    };
    return ret;
}

var appleCertError ={
    passwordError:{"manifest.plus.distribute.apple.password":"私钥密码不正确"},
    errorP12:{"manifest.plus.distribute.apple.p12":"私钥证书不是有效的p12文件"},
    errorProvision:{"manifest.plus.distribute.apple.mobileprovision":"profile文件不是有效的mobileprovision文件"},
    errorAppid:{"manifest.plus.distribute.apple.appid":"AppID与profile文件不匹配, profile文件中AppID为 "},
    p12Expired:{"manifest.plus.distribute.apple.p12":"证书文件已过期，请重新生成证书"},
    p12Noteffective:{"manifest.plus.distribute.apple.p12":"证书文件尚未生效"},
    p12Mismatch:{"manifest.plus.distribute.apple.p12":"profile文件与私钥证书文件不匹配"},
    mobileprovisionMismatch:{"manifest.plus.distribute.apple.mobileprovision":"profile文件与私钥证书文件不匹配"}
}

async function checkAppleCert(request){
    var appid = request.iosAppID;
    var password = request.iosCertPassword;
    var profileFile = request.iosProfile;
    var certFile = request.iosCertfile;
    var java = await  hx.util.getProgram("java");
    if(util.isStringEmpty(java)){
        return;
    }
    
    var jarPath = pathUtil.join(hx.env.appRoot,"plugins");
    jarPath = pathUtil.join(jarPath,"app-safe-pack");
    jarPath = pathUtil.join(jarPath,"CertParser.jar");
    
    var cmdArray = [];
    cmdArray.push("-jar");
    cmdArray.push(jarPath);
    cmdArray.push("-type");
    cmdArray.push("checkAppleCert");
    cmdArray.push("-iosProfile");
    cmdArray.push(profileFile);
    cmdArray.push("-iosCertfile");
    cmdArray.push(certFile);
    cmdArray.push("-iosCertPassword");
    cmdArray.push(password);
    cmdArray.push("-iosAppID");
    cmdArray.push(appid);
    var result = spawnSync(java, cmdArray);
    var gbkStr = iconvlite.decode(result.stdout,"gbk");
    var str = gbkStr.toString();
    if(str  && str.indexOf("startoutput:") > -1 && str.indexOf("endoutput") >-1){
         var content = str.substring(str.indexOf("startoutput:") + "startoutput:".length,str.indexOf("endoutput"));
         var json  = JSON.parse(content);
         var appconfig =  request.manifast
         let map = new Map();
         for(var key in json){
             if(key == "supportApsEnvironment")
             {
				 if( appconfig && appconfig.permissions && appconfig.permissions.Push){
					 map.set("manifest.plus.distribute.apple.mobileprovision","profile文件不支持推通知功能，但manifest.json中选择了Push(消息推送)模块，请重新生成profile文件或去除Push模块");
				}
             }
             else{
                 //map.set(key, json[key]);
                 if(appleCertError.hasOwnProperty(key)){
                     var errJson = appleCertError[key];
                     for(var errorKey in errJson){
                         var msgs = errJson[errorKey];
                         if(key == "errorAppid"){
                             msgs = msgs + json[key];
                        }
                         map.set(errorKey,msgs);
                     }
                 }
             }
         }
         return map;
    }
    return;
}

var androidCertError ={
    passwordError:{"manifest.plus.distribute.google.password":"私钥密码不正确"},
    Invalidkeystore:{"manifest.plus.distribute.google.keystore":"证书文件不是有效的keystore文件"},
    aliasnameError:{"manifest.plus.distribute.google.aliasname":"证书别名不正确"},
    keystoreExpired:{"manifest.plus.distribute.google.keystore":"证书文件已过期，请重新生成证书"},
    keystoreNoteffective:{"manifest.plus.distribute.google.keystore":"证书文件尚未生效"}
}

async function checkAndroidCert(request){
    var alias = request.androidCertAlias;
    var password = request.androidCertPassword;
    var certFile = request.androidCertfile;
    var java = await hx.util.getProgram("java");
    if(util.isStringEmpty(java)){
        return;
    }
    
    var jarPath = pathUtil.join(hx.env.appRoot,"plugins");
    jarPath = pathUtil.join(jarPath,"app-safe-pack");
    jarPath = pathUtil.join(jarPath,"CertParser.jar");
    
    var cmdArray = [];
    cmdArray.push("-jar");
    cmdArray.push(jarPath);
    cmdArray.push("-type");
    cmdArray.push("checkAndroidCert");
    cmdArray.push("-androidCertAlias");
    cmdArray.push(alias);
    cmdArray.push("-androidCertfile");
    cmdArray.push(certFile);
    cmdArray.push("-androidCertPassword");
    cmdArray.push(password);
    var result = spawnSync(java, cmdArray);
    var gbkStr = iconvlite.decode(result.stdout,"gbk");
    var str = gbkStr.toString();
    if(str  && str.indexOf("startoutput:") > -1 && str.indexOf("endoutput") >-1){
         var content = str.substring(str.indexOf("startoutput:") + "startoutput:".length,str.indexOf("endoutput"));
         var json  = JSON.parse(content);
         let map = new Map();
         for(var key in json){
             if(androidCertError.hasOwnProperty(key)){
                 var errJson = androidCertError[key];
                 for(var errorKey  in errJson){}{
                     map.set(errorKey,errJson[errorKey]);
                 }
             }
         }
         return map;
    }
    
    return;
}

const orientationDefault = ["portrait-primary","portrait-secondary","landscape-primary","landscape-secondary"];

function verify(config, project, platform, checkPlugin) {
    let markIconSplashChanged = false;
    if (!config) return;
    let isStream = false; 
    if (platform.toUpperCase() == "STREAM") {
        isStream = true;
        platform = "ANDROID";
    }

    let map = new Map();
    try{
        let isWap2App = isWap2AppProject(project);
        let appid = config.id;
        if (util.isStringEmpty(appid)) {
            map.set("manifest.id", "");
        } else if (appid.length > 100) {
            map.set("manifest.id", "长度必须在100个字符内");
        } else if (!appid.match(/^[0-9a-zA-Z\-_\.]*$/)) {
            map.set("manifest.id", "只能包含数字、字母、点、下划线、中划线");
        } else if (isWap2App && config && config.launch_path) {
            try {
                var host = new URL(config.launch_path).host;
                var id = "__W2A__" + host;
                if (!config.wap2AppDev && appid.toLowerCase() != id.toLowerCase()) {
                    map.set("manifest.id", "appid必须由 (\"__W2A__\" wap站首页域名)组成，当前应为" + id);
                }
            } catch (e) {
                map.set("manifest.launch_path", "不是合法的wap站首页地址");
            }
        }

        if (util.isStringEmpty(config.name)) {
            map.set("manifest.name", "");
        }

        var version = config.version;
        if (!version || util.isStringEmpty(version.name)) {
            map.set("manifest.version.name", "");
        }

        if (!version || !util.isStringEmpty(version.code) &&
            !version.code.match(/^[0-9]+$/)) {
            map.set("manifest.version.code", "必须是整数");
        }

        if (isStream && util.isStringEmpty(config.description)) {
            map.set("manifest.description", "流应用的应用描述不能为空");
        }
        
        var launchPath = config.launch_path;
        if (util.isStringEmpty(launchPath)) {
            map.set("manifest.launch_path", "不能为空");
        }else if(!isWap2App && !isUniAppVue(project)) {
            if (!launchPath.toLowerCase().startsWith("http://") //允许使用网络地址
                            && !launchPath.toLowerCase().startsWith("https://")
                            && !util.getFileExists(project.project,launchPath)) {
                map.set("manifest.launch_path", "项目下不存在此文件或网络地址不合法");
            }
        }
        
        if(config.icons) {
            var icon = config.icons["_48"];
            if(!util.isStringEmpty(icon) 
                && !util.getFileExists(project.project, icon)) {
                    map.set("manifest.icons.48", "文件不存在");
            }
        }
        if(!config.developer){
            config.developer = {};
        }
        
        var module = config.permissions;
        var plus = config.plus;
        
        if(plus && plus.splashscreen){
            var delay = plus.splashscreen.delay;
            if(!util.isStringEmpty(delay) && !delay.match(/^[0-9]+$/)) {
                map.set("manifest.plus.splashscreen.delay", "必须是整数");
            }
        }
        
        var distribute;
        if(plus){
            distribute = plus.distribute;
        }
        if(!distribute || !distribute.orientation ){
            distribute.orientation = orientationDefault;
        }
        if(!distribute || !distribute.orientation || distribute.orientation.length < 1){
             map.set("manifest.plus.distribute.orientation", "至少选择一个");
        }else {
            var orientations = distribute.orientation; 
            for (var i = 0; i < orientations.length; i++) {
                var orientation = orientations[i];
                if (i < 4 && orientationDefault.indexOf(orientation) < 0) {
                    map.set("manifest.plus.distribute.orientation", "格式不正确");
                    break;
                }
                if (i >= 4) {
                    map.set("manifest.plus.distribute.orientation", "数目超出了4个，请删除多余的内容");
                    break;
                }
            }
        }
        
        var icons;
        if(distribute){
            icons = distribute.icons;
        }
        
        var splashScreen;
        if(distribute){
            splashScreen = distribute.splashscreen;
        }

        var isIPhone = false;
        var isIPad = false;

        if(platformIos(platform)){
            var appleProfile;
            if(distribute){
                appleProfile = distribute.apple;
            }
            if(!appleProfile){
                map.set("manifest.plus.distribute.apple","");
            }else{
                if(!appleProfile.hasOwnProperty("devices")){
                    appleProfile.devices = "universal";
                }
                var devices = appleProfile.devices;
                if(util.isStringEmpty(devices)) {
                    map.set("manifest.plus.distribute.apple.devices", null);
                }else{
                    isIPhone = "iphone" == devices.toLowerCase() || "universal" == devices.toLowerCase();
                    isIPad = "ipad" == devices.toLowerCase() || "universal" == devices.toLowerCase();
                    if(!isIPhone && !isIPad) {
                        map.set("manifest.plus.distribute.apple.devices", "必须是 iphone、ipad 或 universal");
                    }
                }
            }
            
            var kernel = plus.kernel;
            if(kernel && kernel.length > 0 && kernel.indexOf(ios) >-1){
                var value = kernel.ios;
                if("UIWebview" ==  value ) {
                    if(!module || !module.uiWebview) { //permissions中没有配置以下UIWebview模块
                        map.set("manifest.permissions.UIWebview", "应用配置默认使用UIWebview内核，需在“模块权限配置”页中勾选“iOS UIWebview”模块");
                    }
                }
            }
            
            var iOSIcon ;
            if(icons){
                iOSIcon = icons.ios;
            }
            if(iOSIcon){
                var prerendered = iOSIcon.prerendered;
                if(prerendered && typeof(prerendered) == 'string' &&  prerendered.toLowerCase() == "true" && prerendered.toLowerCase() == "false"){
                    iOSIcon.prerendered = "false";
                }
                
                if(!util.isStringEmpty(iOSIcon.appstore)){
                    checkPNGFile(map, iOSIcon.appstore, project, "manifest.plus.distribute.icons.ios.appstore", markIconSplashChanged);
                }
                if(isIPhone) {
					var iphoneIconcheckArr = ["app@2x","app@3x","spotlight@2x",
					"spotlight@3x","settings@2x","settings@3x","notification@2x","notification@3x"];
                    checkPNGFileOfFileds(map, iOSIcon.iphone, "manifest.plus.distribute.icons.ios.iphone.", project, markIconSplashChanged,iphoneIconcheckArr);
                }
                if(isIPad){
					var ipadIconcheckArr = ["app","app@2x","proapp@2x","spotlight",
					"spotlight@2x","settings","settings@2x","notification","notification@2x"]
                    checkPNGFileOfFileds(map, iOSIcon.ipad, "manifest.plus.distribute.icons.ios.ipad.", project, markIconSplashChanged,ipadIconcheckArr);
                }
            }        
            
            var iOSSplashScreen;
            if(splashScreen){
                iOSSplashScreen = splashScreen.ios;
            }
            
            var iosStyle;
            if(splashScreen){
                iosStyle = splashScreen.iosStyle;
            }
            
            if(iOSSplashScreen && iosStyle){
                if("default" == iosStyle.toLowerCase() || util.isStringEmpty(iosStyle)) {
                    if(isIPhone) {
                        checkPNGFileOfFileds(map, iOSSplashScreen.iphone, "manifest.plus.distribute.splashscreen.ios.iphone.", project, markIconSplashChanged);
                    }
                    if(isIPad) {
                        checkPNGFileOfFileds(map, iOSSplashScreen.ipad, "manifest.plus.distribute.splashscreen.ios.ipad.", project, markIconSplashChanged);
                    }
                }
                
                if("storyboard"== iosStyle.toLowerCase()) {
                    var storyboard = iOSSplashScreen.storyboard;
                    checkStoryboardFile(map, storyboard, project, "manifest.plus.distribute.splashscreen.ios.storyboard");
                }
            }
           
        }

        if(platformAndroid(platform)){
            var androidIcon;
            if(icons){
                androidIcon = icons.android;
            }
            if(androidIcon){
				var androidIconcheckArr = ["hdpi","xhdpi","xxhdpi","xxxhdpi"];
                checkPNGFileOfFileds(map, androidIcon, "manifest.plus.distribute.icons.android.", project, markIconSplashChanged,androidIconcheckArr);
            }
            
            var androidSplashScreen;
            if(splashScreen){
                androidSplashScreen = splashScreen.android;
            }
            var androidStyle;
            if(splashScreen){
                androidStyle = splashScreen.androidStyle;
            }
            
            if(androidSplashScreen && androidStyle) {
                if("default" == androidStyle || util.isStringEmpty(androidStyle)) {
                    checkPNGFileOfFileds(map, androidSplashScreen, "manifest.plus.distribute.splashscreen.android.", project, markIconSplashChanged);
                }
            }
        }
        
        if(!platform){
            map.set(iconsplashchanged, "true");
        }
        
        if(checkPlugin){
            var plugins;
            if(distribute)
            {
                plugins = distribute.plugins;
            }
            if(plugins){
                let allSdkProperties = new Map();
                let sdkpropsValidateRules = new Map();
                sdkpropsValidateRules.set(".baidu.appkey_ios", "百度地图、百度定位的appkey_ios必须一致");
                sdkpropsValidateRules.set(".baidu.appkey_android", "百度地图、百度定位的appkey_android必须一致");
                sdkpropsValidateRules.set(".amap.appkey_ios", "高德地图、高德定位的appkey_ios必须一致");
                sdkpropsValidateRules.set(".amap.appkey_android", "高德地图、高德定位的appkey_android必须一致");
                sdkpropsValidateRules.set(".weixin.appid", "微信登录、微信支付、微信分享的appid必须一致");
                sdkpropsValidateRules.set(".weixin.appsecret", "微信登录、微信支付、微信分享的appsecret必须一致");
                sdkpropsValidateRules.set(".weixin.UniversalLinks", "微信登录、微信支付、微信分享的UniversalLinks必须一致");
                sdkpropsValidateRules.set(".qq.appid", "QQ登录、QQ分享的appid必须一致");
                sdkpropsValidateRules.set(".sina.appkey", "新浪微博登录、新浪微博分享的appkey必须一致");
                
                sdkpropsValidateRules.forEach(function(value,key){
                    allSdkProperties.set(key,new Map());
                });
                
                var maps = plugins.maps;
                let hasModule = false;
                if(module && module.Maps){
                    hasModule = true;
                }
                
                if(hasModule){
                    checkPluginOfFileds(map, maps, "manifest.plus.distribute.plugins.maps", "地图SDK", 
                                                "manifest.permissions.Maps",true,true, false, platform, allSdkProperties);
                }
                
                var geolocation = plugins.geolocation;
                hasModule = false;
                if(module && module.Geolocation){
                    hasModule = true;
                }
                
                if(hasModule){
                    checkPluginOfFileds(map, geolocation, "manifest.plus.distribute.plugins.geolocation", "定位SDK", 
                                                "manifest.permissions.Geolocation",true,false, false, platform, allSdkProperties);
                }
                
                var oauth = plugins.oauth;
                hasModule = false;
                if(module && module.OAuth){
                    hasModule = true;
                }
                
                if(hasModule){
                    checkPluginOfFileds(map, oauth, "manifest.plus.distribute.plugins.oauth", "登录鉴权", 
                                                "manifest.permissions.OAuth",true,false, false, platform, allSdkProperties);
                }
            
                var payment = plugins.payment;
                hasModule = false;
                if(module && module.Payment){
                    hasModule = true;
                }
                
                if(hasModule){
                    checkPluginOfFileds(map, payment, "manifest.plus.distribute.plugins.payment", "支付SDK", 
                                                "manifest.permissions.Payment",true,false, false, platform, allSdkProperties);
                }
                
                var push = plugins.push;
                hasModule = false;
                if(module && module.Push){
                    hasModule = true;
                }
                
                if(hasModule){
                    checkPluginOfFileds(map, push, "manifest.plus.distribute.plugins.push", "推送SDK", 
                                                "manifest.permissions.Push",true,false, false, platform, allSdkProperties);
                }
                
                var share = plugins.share;
                hasModule = false;
                if(module && module.Share){
                    hasModule = true;
                }
                
                if(hasModule){
                    checkPluginOfFileds(map, share, "manifest.plus.distribute.plugins.share", "分享SDK", 
                                                "manifest.permissions.Share",true,false, false, platform, allSdkProperties);
                }
                
                var speech = plugins.speech;
                hasModule = false;
                if(module && module.Speech){
                    hasModule = true;
                }
                
                if(hasModule){
                    checkPluginOfFileds(map, speech, "manifest.plus.distribute.plugins.speech", "语音SDK", 
                                                "manifest.permissions.Speech",true,false, false, platform, allSdkProperties);
                }
                
                var statics = plugins.statics;
                hasModule = false;
                if(module && module.Statistic){
                    hasModule = true;
                }
                var hasgoogleStatics = false;
                var googleStaticsiosConfig;
                var googleStaticsandroidConfig;
                
                if(hasModule){
                    checkPluginOfFileds(map, statics, "manifest.plus.distribute.plugins.statics", "统计SDK", 
                                                "manifest.permissions.Statistic",true,false, false, platform, allSdkProperties);
                    var googleStatics;
                    if(statics){
                        googleStatics = statics.google;
                    }
                    if(googleStatics){
                        hasgoogleStatics = true;
                        googleStaticsiosConfig = googleStatics.config_ios;
                        googleStaticsandroidConfig = googleStatics.config_android;
                    }
                }
                
                allSdkProperties.forEach(function(value,key){
                    checkEquals(value, sdkpropsValidateRules.get(key), map);
                });            
                
                if(platformAndroid(platform)){
                    if(hasgoogleStatics && util.isStringEmpty(googleStaticsandroidConfig)){
                        map.set("manifest.plus.distribute.statics.google.config_android", "Google Analytics for Firebase的config_android不能为空");
                    }
                }
                
                if(platformIos(platform)){
                    if(hasgoogleStatics && util.isStringEmpty(googleStaticsiosConfig)){
                        map.set("manifest.plus.distribute.statics.google.config_ios", "Google Analytics for Firebase的config_ios不能为空");
                    }
                }
            }
        }
    }catch(e){
        console.error(e)
    }
    
    return map;
}

function checkEquals(appidMap,error,errorMap){
    if(appidMap && appidMap.size > 1){
        var jsonValue = {};
        var jsonKey = {};
        appidMap.forEach(function(value,key){
            //errorMap.set(key,error);
            var valueKey = "key"+value;
            jsonValue[valueKey] = {};
            jsonKey[key] = {};
        });
        
        var len = Object.keys(jsonValue).length;
        if(Object.keys(jsonValue).length > 1){
            for(var data in jsonKey){
                errorMap.set(data,error);
            }
        }
    }
}

function checkPluginOfFileds(errors,sdkObject,sdkNodes,sdkName,moduleNodes,hasModule,checkUniqueness,checkMissPlugin,platform,sdkProperties){
    var pluginsNodes = [];
    if(sdkObject){
        filterFields(sdkObject,sdkNodes,function(pluginNodes,pluginObject){
           try{
                if(pluginObject && typeof(pluginObject) != 'string' ){
                    pluginsNodes.push(pluginNodes);
                    var platFormkey = "__platform__";
                    var supportPlatforms = [];
                    if(pluginObject.hasOwnProperty(platFormkey)){
                        var platforms = pluginObject[platFormkey];
                        if(platforms){
                            if(Array.isArray(platforms)){
                                supportPlatforms = platforms;
                            }
                        }
                    }
                    
                    if(supportPlatforms.length < 1 ){
                        supportPlatforms = ["android","ios"];
                    }
                    
                    filterFields(pluginObject,pluginNodes,function(fieldNodes,fieldValue){
                        if(fieldNodes.endsWith(".description") || fieldNodes.endsWith("__platform__")){
                                return;
                        }else if(fieldNodes.endsWith("_ios") && (platform.toUpperCase() == "ANDROID")){
                            //android平台不校验ios相关属性
                            return;
                        }else if(fieldNodes.endsWith("_android") && platform.toUpperCase() == "IOS"){
                            //ios平台不校验android相关属性
                            return;
                        }else if(util.isStringEmpty(fieldValue)){
                            if(supportPlatforms.indexOf("ios") > -1 && fieldNodes.endsWith(".payment.stripe.returnURL_ios")){
                                errors.set(fieldNodes, "");
                            }
                            
                            if(supportPlatforms.indexOf("ios") > -1 && fieldNodes.endsWith(".payment.paypal.returnURL_ios")){
                                 errors.set(fieldNodes, "");
                            }
                            
                            if(supportPlatforms.indexOf("android") > -1 && fieldNodes.endsWith(".payment.paypal.returnURL_android")){
                               errors.set(fieldNodes, ""); 
                            }
                            
                            if(!fieldNodeNullable(fieldNodes,platform,supportPlatforms)) {
                                // 不能为空的校验
                                errors.set(fieldNodes, "");
                            } 
                        }else if(fieldNodes.endsWith(".UniversalLinks")) {
                            if(!fieldValue) {
//											errors.set(fieldNodes, null);
                            }else {
                                if(!fieldValue.startsWith("https://")) {
                                    errors.set(fieldNodes, "通用链接格式不合法");
                                }
                            }
                        }
                        
                        if(supportPlatforms.indexOf("android") < 0) {
                            if(fieldNodes.endsWith(".geolocation.baidu.appkey_android")
                                    ||fieldNodes.endsWith(".geolocation.amap.appkey_android")) {
                                return ;
                            }
                        }
                        if(supportPlatforms.indexOf("ios") < 0) {
                            if(fieldNodes.endsWith(".geolocation.baidu.appkey_ios")
                                    ||fieldNodes.endsWith(".geolocation.amap.appkey_ios")) {
                                return ;
                            }
                        }
                        
                        sdkProperties.forEach(function(value,key){
                            if(fieldNodes.endsWith(key)) {
                               sdkProperties.get(key).set(fieldNodes,fieldValue);
                            }
                        });
                    });
                }
           }catch(e){
             console.error(e);  
           }
        });
    }          
    if(!hasModule && !pluginsNodes.length < 1){
        errors.set(moduleNodes, sdkName + "需要使用此模块，如不选择此模块，会导致某些功能不可使用");
    }
    
    //校验插件唯一性
    if(checkUniqueness && pluginsNodes.length >1){
        for(var pluginNodes in pluginsNodes){
            errors.set(pluginNodes, "不能同时选择多个" + sdkName);
        }
    }
    //验证模块对插件的依赖
    if(checkMissPlugin && hasModule && pluginsNodes.length < 1) {
        errors.set(moduleNodes, "选择此模块需要配置" + sdkName);
    }
}

function fieldNodeNullable(fieldNodes,platform,supportPlatforms){
    if(fieldNodes.endsWith(".igexin.icons")
        || fieldNodes.endsWith(".payment.paypal.returnURL_ios")
        || fieldNodes.endsWith(".payment.paypal.returnURL_android")
        || fieldNodes.endsWith(".payment.stripe.returnURL_ios")
        || fieldNodes.endsWith(".unipush.icons")
        || fieldNodes.endsWith(".weixin.appsecret")
        || fieldNodes.endsWith(".sina.appsecret")) {
            return true;
            }
        if( supportPlatforms.indexOf("android") > -1) {
            if(fieldNodes.endsWith(".geolocation.baidu.appkey_android")
                    ||fieldNodes.endsWith(".geolocation.amap.appkey_android")) {
                return true;
            }
        }
        if(supportPlatforms.indexOf("ios") > -1) {
            if(fieldNodes.endsWith(".geolocation.baidu.appkey_ios")
                    ||fieldNodes.endsWith(".geolocation.amap.appkey_ios")) {
                return true;
            }
        }
        
        if(fieldNodes.endsWith(".UniversalLinks")) {
            if(!isPack || platform.toUpperCase() == "ANDROID") {
                return true;
            }
        }
        
        if(platformAndroid(platform)){
            if(fieldNodes.endsWith(".statics.umeng.appkey_android")
            || fieldNodes.endsWith(".statics.umeng.channelid_android")) {
                return true;
            }
         }
            
        if(platformIos(platform)){
            if(fieldNodes.endsWith(".statics.umeng.appkey_ios")
            || fieldNodes.endsWith(".statics.umeng.channelid_ios")) {
                return true;
            }
        }
        
        return false;
}

function checkStoryboardFile(errors,filePath,project,fieldPath){
    try{
         var file =  util.getFileExists(project.project,filePath);
         if(!file){
             errors.set(fieldPath, "文件不存在");
         }else if(fs.statSync(file).size ==0){
             errors.set(fieldPath, "不是合法的storyboard文件，请检查是否为空白文件");
         }else{
             try{
                 var zip = new admZip(file);
                 let hasStoryboardFile = false;
                 zip.getEntries().forEach(function(entry){
                     let entryName = entry.entryName;
                     if(util.isStringEmpty(entryName)) {
                         return;
                     }
                     if(entryName.startsWith("__MACOSX") || entryName.startsWith(".git") ||entryName.startsWith(".svn")){
                         return;
                     }
                     let splitStr = entryName.split("/");
                     if(splitStr.length - 1 > 1){
                         return;
                     }
                     if(entryName.endsWith(".storyboard")){
                         hasStoryboardFile = true;
                     }
                 });
                 
                 if(!hasStoryboardFile){
                     errors.set(fieldPath, "不是合法的storyboard文件，请确保选择的zip包内存在storyboard文件,如何制作storyboard请参考<a style='color:#298bdb' href='https://ask.dcloud.net.cn/article/37475'>文档</a>");
                }
             }catch(e){
                errors.set(fieldPath, "不是合法的storyboard文件，选择得压缩文件格式未知或者数据已经被损坏");
            }
         }
    }catch(e){
        console.error(e);
    }
}

function checkPNGFileOfFileds(errors,parent,parentNodes,project,markIconSplashChanged,checkArr){
    filterFields(parent,parentNodes,function(fieldNodes,filedValue){
		checkPNGFile(errors,filedValue,project,fieldNodes,markIconSplashChanged);
    },checkArr);
}

function filterFields(parent,parentNodes,fieldChecker,checkArr){
    if(!parent) return;
    if(!parentNodes.endsWith(".")){
        parentNodes = parentNodes + '.';
    }
    
    for(var filed in parent){
        if(!util.isStringEmpty(filed)){
            try{
				if( checkArr && Array.isArray(checkArr) && checkArr.length >0){
					let index =checkArr.indexOf(filed);
					if(checkArr.indexOf(filed) < 0 ){
						continue;
					}
				}
				
                fieldChecker(parentNodes + filed, parent[filed]);
            }
            catch(e){
                console.error(e);
            }
        }
    }
}

function checkPNGFile(errors,filePath,project,fieldNodes,markIconSplashChanged){
    try{
        if(util.isStringEmpty(filePath)) return;
        var file = util.getFileExists(project.project,filePath);
        if(!file){
            errors.set(fieldNodes, "文件不存在");
        }else if(fs.statSync(file).size == 0){
            errors.set(fieldNodes, "不是合法的png文件，请检查是否为空白文件");
        }else{
            var byte = Buffer.alloc(8);
            let fd = fs.openSync(file,'r');
            let newByte = fs.readSync(fd,byte,{offset:0,length:8});
            if(fd > 0)
            {
                fs.closeSync(fd);
                var pngbyte = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
                if(Buffer.compare(byte,pngbyte) != 0 )
                {
                    errors.set(fieldNodes, "不是合法的png文件,请检查是否为后缀名修改为.png的非png文件")
                }
                else if(markIconSplashChanged){
                    errors.set("iconsplashchanged", "true");
                }
            }
        }
    }catch(e){   
         console.error(e);
    }
}

module.exports = {
    verify: verifyManifast
}