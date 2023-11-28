const Generator = require('yeoman-generator');
let fs = require('fs');
const path = require("path");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);
        const packageJsonPath = this.destinationPath('package.json');
        const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        const packageJson = JSON.parse(packageJsonContent);
        const appName = packageJson.name;
        //console.log(this.packageJson);
        this.metaPageName = "Meta" + capitalizeFirstLetter(appName) + "Page";
    }


    async _writeFileWithCheck( content, fileName){
        if (fs.existsSync(fileName)){
            const overwritePrompt = [
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `A file named '${fileName}' already exists. Do you want to overwrite it?`,
                    default: false,
                },
            ];
            const answers = await this.prompt(overwritePrompt);
            if (answers.overwrite){
                // Sovrascrivi il file
                fs.writeFileSync(fileName, new Buffer(content), {encoding: 'utf-8'});
                this.log(`File '${fileName}' has been overwritten.`);
            }
            else{
                this.log(`File '${fileName}' has not been overwritten.`);
            }

        }
        else{
            // Crea il file
            fs.writeFileSync(fileName, new Buffer(content), {encoding: 'utf-8'});
            this.log(`File '${fileName}' has been created.`);
        }
    }

    async prompting(){
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Title of page to be created"
            },
            {
                type: "input",
                name: "tableName",
                message: "Table or view name"
            },
            {
                type: 'input',
                name: 'mainTable',
                message: 'Main table (table, not view), leave blank if same as tableName'
            },
            {
                type: "input",
                name: "editType",
                message: "symbolic name for the page (editType)"
            },
            {
                type: 'confirm',
                name: "isDetail",
                message: "it is a detail page (Y) or a main page (N)",
                default: false,
            }
        ]);

    }


    //Creates MetaXXData with actual tablename in the meta/table/directory
    async createPage(){
        if (!this.answers.mainTable) {
            this.answers.mainTable = this.answers.tableName;
        }
        let derivedMetaPageClassName = "metaPage_"+ this.answers.tableName;
        let generatorPackagePath = path.dirname(require.resolve("generator-mykode/package.json"));

        //generatorPackagePath,"generators","app",
        let templateMetaPageJsFileName = path.join(generatorPackagePath,"generators", "metapage", "page.js");

        let destPath = path.join("client", "metadata", this.answers.mainTable);
        let destJsName =  this.answers.tableName+"_"+this.answers.editType+".js";

        if (!fs.existsSync(destPath)){
            this.log(`The folder '${destPath}' has been created.`);
            fs.mkdirSync(destPath, {recursive: true});
        }

        let jsContent = fs.readFileSync(templateMetaPageJsFileName, {encoding: 'utf-8'}).toString();
        jsContent = jsContent.replaceAll("xxxTitle", this.answers.name);
        jsContent = jsContent.replaceAll("MetaXPage", this.metaPageName);
        jsContent = jsContent.replaceAll("metaPage_xxx", derivedMetaPageClassName);
        jsContent = jsContent.replaceAll("xxxTable", this.answers.tableName);
        jsContent = jsContent.replaceAll("yyyEditType", this.answers.editType);
        jsContent = jsContent.replaceAll("isDetailXXX", this.answers.isDetail);

        let newJsFileName = path.join(destPath, destJsName);
        await this._writeFileWithCheck(jsContent, newJsFileName);

        let templateMetaPageHtmlFileName = path.join(generatorPackagePath,"generators", "metapage", "page.html");
        let destHtmlName =  this.answers.tableName+"_"+this.answers.editType+".html";
        let htmlContent = fs.readFileSync(templateMetaPageHtmlFileName, {encoding: 'utf-8'}).toString();

        let newHtmlFileName = path.join(destPath, destHtmlName);
        await this._writeFileWithCheck(htmlContent, newHtmlFileName);
    }

};
