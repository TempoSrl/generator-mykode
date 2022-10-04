const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const _ = require("lodash");

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        this.log(args);
        this.log(opts);
    }

    updateDependencies(){
        const pkgJson = {
            dependencies: {
                "jsmetabackend":"latest",
            },
            devdependencies: {
                "jasmine-core": "~2.2.1"
            }
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    }

    //
    // async installingJsMetaBackend() {
    //     await this.addDependencies(['jsmetabackend'], { 'save-dev': true });
    // }

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
            "client/dataset",
            "routes"];
        folders.forEach(f=> this._checkCreateFolder(f));

        // _.extend(Generator.prototype, require('yeoman-generator/lib/actions/install'));
        //
        // this.installDependencies({
        //     bower: true,
        //     npm: true
        // });


        let packagePath = path.dirname(require.resolve("jsmetabackend/package.json"));
        console.log("Copying from "+path.join(packagePath,"routes","spec","src"));
        ["routes","client"].forEach(folder => {
            fs.cp(path.join(packagePath, folder), folder,
                {
                    recursive: true,
                    filter: f => {
                        if (fs.lstatSync(f).isDirectory()) {
                            return true;
                        }
                        if (path.extname(f) === ".js") return true;
                        if (path.extname(f) === ".html") return true;
                    }
                },
                (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
        })
    }


};
