var hx = require("hbuilderx");
const validate = require("./validate.js");

function activate(context) {
    return{
        verify:validate.verify
    }
}

function deactivate() {

}

module.exports = {
	activate,
	deactivate
}