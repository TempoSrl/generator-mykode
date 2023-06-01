const Generator = require('yeoman-generator');
var fs = require('fs');
const path = require("path");

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Deve mettere i file nella cartella client/metadata/tableName

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
                message: "Nome della route da creare"
            },
            {
                type: "input",
                name: "folder",
                message: "Folder della route da creare (es. data, auth, file)"
            },
            {
                type: "list",
                name: "kind",
                message: "Service type",
                choices:['GET','POST']
            },
            {
                type: 'confirm',
                name: 'multipleResult',
                message: 'Il servizio funziona in modalità web socket con risultati multipli?',
                default: false,
            },
            {
                type: 'confirm',
                name: 'authRequired',
                message: 'Il servizio necessita di un utente autenticato?',
                default: true,
            },
        ]);

    }


    //Creates MetaXXData with actual tablename in the meta/table/directory
    createRoute(){
        let generatorPackagePath = path.dirname(require.resolve("generator-mykode/package.json"));

        //generatorPackagePath,"generators","app",
        let oldFileName = path.join(generatorPackagePath,"generators", "route", "route.js");


        let routePath = path.join("routes", this.answers.folder);
        if (!fs.existsSync(routePath)){
            this.log(`The folder '${routePath}' has been created.`);
            fs.mkdirSync(routePath, {recursive: true});
        }

        let routeContent = fs.readFileSync(oldFileName, {encoding: 'utf-8'}).toString();
        routeContent = routeContent.replaceAll("xxxmethod", this.answers.kind.toLowerCase());
        routeContent = routeContent.replaceAll("xxx", this.answers.name);


        let newFileName = path.join(routePath, this.answers.name + ".js");

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
                    fs.writeFileSync(newFileName, new Buffer(routeContent), {encoding: 'utf-8'});
                    this.log(`File '${newFileName}' has been overwritten.`);
                }
                else{
                    this.log(`File '${newFileName}' has not been overwritten.`);
                }
            });
        }
        else{
            // Crea il file
            fs.writeFileSync(newFileName, new Buffer(routeContent), {encoding: 'utf-8'});
            this.log(`File '${newFileName}' has been created.`);
        }

        let routeFileName = path.join("client","components", "metadata", "Routing.js");
        let routeFileContent = fs.readFileSync(routeFileName, {encoding: 'utf-8'}).toString();

        if (routeFileContent.indexOf('this.registerService(methodEnum.'+this.answers.name)<0){
            routeFileContent = routeFileContent.replace(
                "            //end custom routes",
                "            this.registerService(methodEnum." + this.answers.name + ", '" +
                this.answers.kind + "', '" + this.answers.folder + "', " +
                this.answers.multipleResult + ", " +
                this.answers.authRequired + ");\r\n" +
                "            //end custom routes"
            );

            routeFileContent = routeFileContent.replace(
                "        //end custom methods",
                "        " + this.answers.name + ': "' + this.answers.name + '",\r\n'+
                "        //end custom methods"
            );

            fs.writeFileSync(routeFileName, new Buffer(routeFileContent), {encoding: 'utf-8'});
            this.log(`File '${routeFileName}' has not been updated.`);
        }


    }

};


