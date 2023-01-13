const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const _ = require("lodash");
const crypto = require("crypto");

function allFile(f){
    if (fs.lstatSync(f).isDirectory()) {
        return false;
    }
    return true;
}
function filterFile(extensions){
    if (extensions===undefined){
        return undefined;
    }
    if (extensions.length===0){
        return undefined;
    }
    const filter = function(f)  {
        if (fs.lstatSync(f).isDirectory()) {
            return true;
        }
        //console.log("comparing "+path.extname(f)+" with "+extensions)
        return extensions.includes(path.extname(f).substr(1));
    };
    return filter;
}

/**
 * Copy an folder with all subfolders
 * @param source
 * @param dest
 * @param allowedExtensions
 */
function copyFolder(source,dest,allowedExtensions){
    console.log("Copying from "+source+" to "+dest);
    fs.cpSync(source,dest,
        {recursive: true,
            filter: filterFile(allowedExtensions),
            force:false
        },
        (err) => {if (err) {console.error(err);}
        });
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function pathJoin(basePath, subfolders){
    if(typeof subfolders==="string") {
        subfolders=[subfolders];
    }
    if(subfolders ===undefined || subfolders.length===0){
        return basePath;
    }
    return path.join.apply(path,[basePath].concat(subfolders));
}

function appPath(subfolders){
    const generatorPackagePath = path.dirname(require.resolve("generator-mykode/package.json"));
    let basePath=path.join(generatorPackagePath,"generators","app");
    return pathJoin(basePath, subfolders);
}

function backendPath(subfolders){
    const basePath=  path.dirname(require.resolve("jsmetabackend/package.json"));
    return pathJoin(basePath, subfolders);
}

function frontendPath(subfolders){
    const basePath=  path.dirname(require.resolve("mykode_frontend/package.json"));
    return pathJoin(basePath, subfolders);
}

const secretJs="const Crypto = require('crypto-js');\n" +
    "module.exports = {\n" +
    "    key: Crypto.enc.Hex.parse('<key>'),\n" +
    "    iv: Crypto.enc.Hex.parse('<iv>'),\n" +
    "    pwd: '<pwd>'\n" +
    "}";

module.exports = class extends Generator{
    // The name `constructor` is important here
    constructor(args, opts){
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code
        //this.log(args);
        //this.log(opts);
    }

    async prompting(){
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Your project name (must follow identifiers name rules)",
                default: this.appname // Default to current folder name
            },

        ]);

        this.log("app name", this.answers.name);
        this.metaName = "Meta" + capitalizeFirstLetter(this.answers.name) + "Data";
        this.metaPageName = "Meta" + capitalizeFirstLetter(this.answers.name) + "Page";
        this.metaAppName = "Meta" + capitalizeFirstLetter(this.answers.name) + "App";
    }

    updateNodeDependencies(){
        const pkgJson = {
            name: this.answers.name,
            dependencies: {
                "async": "^3.2.3",
                "body-parser": "^1.19.0",
                "crypto-js": "^4.1.1",
                "edge-db": "github:gaelazzo/edge-db",
                "express": "^4.17.1",
                "express-async-handler": "^1.1.4",
                "express-fileupload": "^1.2.1",
                "express-jwt": "^6.0.0",
                "JQDeferred": "^2.1.0",
                "jsonwebtoken": "^8.5.1",
                "lodash": "latest",
                "morgan": "^1.10.0",
                "multer": "^1.4.3",
                "request": "^2.88.2",
                "uuid": "^8.3.2"
            },
            devDependencies: {
                "generator-mykode": "latest",
                "jsmetabackend": "latest",
                "async-exec-cmd": "^2.0.2",
                "browserify": "^17.0.0",
                "edge-js": "github:agracio/edge-js",
                "glob": "^8.0.3",
                "grunt": "^1.5.3",
                "grunt-contrib-watch": "^1.1.0",
                "grunt-jsdoc": "^2.4.1",
                "grunt-karma": "^4.0.2",
                "grunt-keepalive": "^1.0.0",
                "grunt-open": "^0.2.4",
                "grunt-shell": "^3.0.1",
                "grunt-wiredep": "^3.0.1",
                "jasmine": "^4.5.0",
                "jasmine-console-reporter": "^3.1.0",
                "jasmine-core": "3.6.0",
                "jasmine-node": "^3.0.0",
                "jasmine-spec-reporter": "^7.0.0",
                "jasmine-collection-matchers":"*",
                "jquery": "^3.6.0",
                "jsdoc": "^3.6.10",
                "jsdoc-summarize2": "^0.1.4",
                "jsdoc-to-markdown": "^7.1.1",
                "karma": "^6.3.20",
                "karma-browserify": "^8.1.0",
                "karma-chrome-launcher": "3.1.0",
                "karma-firefox-launcher": "^1.3.0",
                "karma-ie-launcher": "^1.0.0",
                "karma-jasmine": "4.0.1",
                "karma-jasmine-html-reporter": "1.5.4",
                "karma-junit-reporter": "2.0.1",
                "karma-phantomjs-launcher": "^1.0.4",
                "karma-sauce-launcher": "^1.2.0",
                "karma-spec-reporter": "0.0.32",
                "load-grunt-tasks": "^5.1.0",
                "node-fetch": "^2.6.7",
                "time-grunt": "^1.4.0",
                "watchify": "^4.0.0"
            }
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON('package.json', pkgJson);
    }

    updateBrowserDependencies(){
        const bowerJson = {
            name: this.answers.name,
            dependencies: {
                "bootstrap": "4.6.2",
                "font-awesome": "^5.1.1",
                "jquery": "3.6.1",
                "jquery-ui": "1.12.1",
                "jstree": "~3.3.6",
                "json3": "~3.3.1",
                "es5-shim": "~3.0.1",
                "lodash": "~4.17.21",
                "observe-js": "~0.5.7",
                "fullcalendar": "^3.9.0",
                "jqueryui-timepicker-addon": "^1.6.3"
            },
            "devDependencies": {
                "jasmine-core": "~2.2.1",
                "jasmine-jquery": "^2.1.1"
            },
        };

        // Extend or create package.json file in destination path
        this.fs.extendJSON(path.join("client", 'bower.json'), bowerJson);
    }

    //
    // async installingJsMetaBackend() {
    //     await this.addDependencies(['jsmetabackend'], { 'save-dev': true });
    // }

    _checkCreateFolder(folderName){
        if (!fs.existsSync(folderName)){
            fs.mkdirSync(folderName);
            this.log(folderName + ' folder created');
        }
        else{
            this.log(folderName + ' folder already exists');
        }
    }

    init(){
        const folders = [
            "client",
            "client/components",
            "client/dataset",
            "client/config",
            "client/pages", //metapages html & js
            "client/meta",
            "client/assets",
            "client/metadata",
            "config",
            "Uploads"
            //"routes",
            //"src",
            //"meta"
            //"test"
        ];
        folders.forEach(f => this._checkCreateFolder(f));

        // _.extend(Generator.prototype, require('yeoman-generator/lib/actions/install'));
        //
        // this.installDependencies({
        //     bower: true,
        //     npm: true
        // });
        //Server folders
        ["routes", "client", "src", "test"].forEach(folder => {
            copyFolder(backendPath(folder), folder, ["json", "js", "html", "sql","txt"]);
        });

        //Meta folder in client, MetaXData will be successively customized
        copyFolder(appPath(["client", "meta"]), path.join("client","meta"), ["js", "html", "txt"]);

        //Pages folder in client, MetaXPage will be successively customized
        copyFolder(appPath(["client", "pages"]), path.join("client","pages"), ["js", "html", "txt"]);

        //copyFolder(appPath(["_config"]), "config", ["js", "json"]);

        ["anonymousPermissions.js","appList.json", "dbList.json","tokenConfig.js"].forEach((f)=>{
            fs.copyFileSync(path.join(appPath(["_config",f])),
                path.join("config",f));
        });

        copyFolder(appPath(["client", "config"]),path.join("client", "config"), ["js", "json"]);
        copyFolder(appPath(["client", "assets"]),path.join("client", "assets"), ["js", "json"]);

        //
        ["metadata", "styles", "template", "utility","userTemplate"].forEach(folder => {
            copyFolder(frontendPath(["components", folder]),
                path.join("client", "components", folder));
        });

        //Copy test folders
        ["app", "common", "spec", "spec_midway"].forEach(folder => {
            copyFolder(frontendPath(["test", folder]), path.join("test", "client", folder));
        });

        //Copy everything under app/app (file and folders, included MetaXApp
        ["app"].forEach(folder => {
            copyFolder(appPath([folder]),"client");
        });

        fs.cpSync(frontendPath(["test"]), path.join("test", "client"),
            {
                recursive: false,
                force: false,
                filter: allFile
            },
            (err) => {
                if (err){
                    console.error(err);
                }
            }
        );
        ["Gruntfile.js","server.js"].forEach(
            (f)=>{
                fs.copyFileSync(appPath(f),f);
            }
        );
    }

    customizeMetaXData(){
        let generatorPackagePath = path.dirname(require.resolve("generator-mykode/package.json"));

        //generatorPackagePath,"generators","app",
        let oldFileName = path.join("client","meta", "MetaXData.js");
        let newFileName = path.join("client","meta", capitalizeFirstLetter(this.metaName + ".js"));

        //console.log("renaming " + oldFileName + " to " + newFileName);
        fs.renameSync(oldFileName, newFileName);
        //console.log("reading from ",oldFileName)
        let metaContent = fs.readFileSync(newFileName, {encoding: 'utf-8'}).toString();
        metaContent = metaContent.replaceAll("MetaXData", this.metaName);
        //console.log("writing to ",newFileName)
        fs.writeFileSync(newFileName, new Buffer(metaContent), {encoding: 'utf-8'});

    }

    customizeMetaXPage(){
        let generatorPackagePath = path.dirname(require.resolve("generator-mykode/package.json"));

        //generatorPackagePath,"generators","app",
        let oldFileName = path.join("client","pages", "MetaXPage.js");
        let newFileName = path.join("client","pages", capitalizeFirstLetter(this.metaPageName + ".js"));

        //console.log("renaming " + oldFileName + " to " + newFileName);
        fs.renameSync(oldFileName, newFileName);
        //console.log("reading from ",oldFileName)
        let metaPageContent = fs.readFileSync(newFileName, {encoding: 'utf-8'}).toString();
        metaPageContent = metaPageContent.replaceAll("MetaXPage", this.metaPageName);
        //console.log("writing to ",newFileName)
        fs.writeFileSync(newFileName, new Buffer(metaPageContent), {encoding: 'utf-8'});
    }

    _customizeXApp(oldFileName, newFileName, oldText,newText){
        let generatorPackagePath = path.dirname(require.resolve("generator-mykode/package.json"));

        //console.log("renaming " + oldFileName + " to " + newFileName);
        if (oldFileName!== newFileName){
            fs.renameSync(oldFileName, newFileName);
        }
        //console.log("reading from ",oldFileName)
        let fileContent = fs.readFileSync(newFileName, {encoding: 'utf-8'}).toString();
        fileContent = fileContent.replaceAll(oldText, newText);
        //console.log("writing to ",newFileName)
        fs.writeFileSync(newFileName, new Buffer(fileContent), {encoding: 'utf-8'});
    }

    customizeXApp(){
        this._customizeXApp(
            path.join( "client", "MetaXApp.js"),
            path.join("client", capitalizeFirstLetter(this.metaAppName + ".js")),
            "MetaXApp",this.metaAppName);
        this._customizeXApp(path.join( "client", "indexTemplate.html"),
            path.join("client", "indexTemplate.html"),
            "XXXApp",this.answers.name);
        this._customizeXApp(path.join( "client", "indexDebugTemplate.html"),
            path.join("client", "indexDebugTemplate.html"),
            "XXXApp",this.answers.name);
    }


    runBower(){
        let oldPath=process.cwd();
        let clientPath= path.join(oldPath, "client");
        console.log(clientPath);
        //process.chdir(clientPath)
        const Generator = require('yeoman-generator');
        _.extend(Generator.prototype, require('yeoman-generator/lib/actions/install'));
        //this.bowerInstall()
        //this.spawnCommand("bower install client/bower.json");

        this.bowerInstall([], {}, { cwd: this.destinationPath('client') });

        //process.chdir(oldPath)
    }



    async createSecret(){
        let secretFileName= path.join("config","secret.js");
        if (fs.existsSync(secretFileName)){
            console.log("createSecret: "+ secretFileName+" already exists.");
            return;
        }
        let key = crypto.randomBytes(8);
        let secret = secretJs.replace("<key>",key.toString("hex"));
        let iv = crypto.randomBytes(8);
        secret = secret.replace("<iv>",iv.toString("hex"));

        this.pwdResp = await this.prompt([
            {
                type: "input",
                name: "pwd",
                message: "Enter a strong password, it will be used to crypt some application file",
            },
        ]);


        secret = secret.replace("<pwd>",this.pwdResp.pwd);

        fs.writeFileSync(secretFileName, new Buffer(secret), {encoding: 'utf-8'});
        console.log(secretFileName+ " created.");

        //Write to tokenConfig
        let tokenConfigFileName = path.join("config","tokenConfig.js");
        let tokenConfigContent = fs.readFileSync(
            tokenConfigFileName,
            {encoding: 'utf-8'}).toString();
        tokenConfigContent = tokenConfigContent.replace("<issuer>",this.answers.name);
        let anonymousToken= "Anonymous"+crypto.randomBytes(10).toString("hex");
        tokenConfigContent = tokenConfigContent.replace("<token>",anonymousToken);
        fs.writeFileSync(tokenConfigFileName,
            new Buffer(tokenConfigContent), {encoding: 'utf-8'});


        //Write to Connection.js
        let connectionFileName = path.join("client","components","metadata","Connection.js");
        let connectionContent = fs.readFileSync(connectionFileName,
            {encoding: 'utf-8'}).toString();
        connectionContent = connectionContent.replace(
            "AnonymousToken123456789",anonymousToken);
        fs.writeFileSync(connectionFileName,
            new Buffer(connectionContent), {encoding: 'utf-8'});

        //Write to ConnWebService.js
        let webServiceFileName = path.join("client","components","metadata","ConnWebService.js");
        let webServiceContent = fs.readFileSync(webServiceFileName,
            {encoding: 'utf-8'}).toString();
        webServiceContent = webServiceContent.replace(
            "AnonymousToken123456789",anonymousToken);
        fs.writeFileSync(webServiceFileName,
            new Buffer(webServiceContent), {encoding: 'utf-8'});
    }
    generateMasterKey(){
        let JsToken= require("./../../../../src/jsToken.js");
        JsToken.assureMasterKey();
    }

};