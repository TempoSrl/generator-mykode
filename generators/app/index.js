const Generator = require('yeoman-generator');
const fs = require("fs");

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.log(args);
        this.log(opts);
    }
    async installingJsMetaBackend() {
        await this.addDependencies(['jsmetabackend'], { 'save-dev': true });
    }
    _checkCreateFolder(folderName){
        if (!fs.existsSync(folderName)){
            fs.mkdirSync(folderName);
            this.log(folderName+' folder created');
        }
        else {
            this.log(folderName+' folder already exists');
        }
    }

    init() {
        const folders=["client",
            "client/components",
            "client/datasets"];
        folders.forEach(f=> this._checkCreateFolder(f));
    }


};