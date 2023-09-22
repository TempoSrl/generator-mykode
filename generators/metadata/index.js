const Generator = require('yeoman-generator');
var fs = require('fs');
const path = require("path");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

    }

    async prompting(){
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "Nome della tabella o vista del metadato"
            },
            {
                type: "input",
                name: "tableName",
                message: "Nome della tabella se il metadato si riferisce ad una vista, o niente se non è una vista"
            },
            {
                type: "input",
                name: "title",
                message: "Nome descrittivo dell'oggetto della tabella"
            },
            {
                type: "input",
                name: "keys",
                message: "Nomi dei campi della chiave separati da virgole"
            }

        ]);

        this.log("name", this.answers.name);
        this.log("table name", this.answers.tableName);
        if (!this.answers.tableName) {
            this.answers.tableName=  this.answers.name;
        }
        this.name = this.answers.name;
        this.tableName = this.answers.tableName;
        this.metaDataName = "Meta_"+capitalizeFirstLetter(this.name)+"Data";
    }


    //Creates MetaXXData with actual tablename in the meta/table/directory
    customizeMetaXXData(){
        let generatorPackagePath = path.dirname(require.resolve("generator-mykode/package.json"));

        //generatorPackagePath,"generators","app",
        let oldFileName = path.join("client", "meta", "MetaXXData.js");


        let metaPath = path.join("client", "metadata", this.tableName);
        if (!fs.existsSync(metaPath)){
            this.log(`The folder '${metaPath}' has been created.`);
            fs.mkdirSync(metaPath, {recursive: true});
        }

        let metaContent = fs.readFileSync(oldFileName, {encoding: 'utf-8'}).toString();
        metaContent = metaContent.replaceAll("Meta_XXData", this.metaDataName);
        metaContent = metaContent.replaceAll("xxTitle", this.answers.title);

        let keys = this.answers.keys.split(',').map((key) => '"'+key.trim()+'"').join(',');
        metaContent = metaContent.replaceAll('"idxx"', keys);

        let newFileName = path.join(metaPath, this.metaDataName.toLowerCase() + ".js");


        if (this.fs.exists(newFileName)){
            const overwritePrompt = [
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: `A file named '${newFileName}' already exists. Do you want to overwrite it?`,
                    default: false,
                },
            ];

            return this.prompt(overwritePrompt).then((answers) => {
                if (answers.overwrite){
                    // Sovrascrivi il file
                    fs.writeFileSync(newFileName, new Buffer(metaContent), {encoding: 'utf-8'});
                    this.log(`File '${newFileName}' has been overwritten.`);
                }
                else{
                    this.log(`File '${newFileName}' has not been overwritten.`);
                }
            });
        }
        else{
            // Crea il file
            fs.writeFileSync(newFileName, new Buffer(metaContent), {encoding: 'utf-8'});
            this.log(`File '${newFileName}' has been created.`);
        }



    }

};


