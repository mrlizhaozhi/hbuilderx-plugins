const fs = require("fs")
const path = require("path")

function isStringEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj === "") {
        return true;
    }
    return false;
}

function getFileExists(projectPath, filePath) {
    if (isStringEmpty(filePath)) return;
    if (fs.existsSync(path.join(projectPath,filePath))) {
        return path.join(projectPath,filePath);
    }else if (fs.existsSync(filePath)) {
        return filePath;
    }
    return;
}

function isEmptyObject(obj) {
    if (!obj) return true;
    for (var key in obj) {
        return false;
    };
    return true;
}

module.exports = {
    isStringEmpty: isStringEmpty,
    isEmptyObject: isEmptyObject,
    getFileExists:getFileExists
}