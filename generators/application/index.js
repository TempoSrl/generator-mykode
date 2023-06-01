const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs');
const _ = require("lodash");


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


module.exports = class extends Generator{
    // The name `constructor` is important here
    constructor(args, opts){
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

        // Next, add your custom code

    }

    init(){

    }

    //Add configuration for a new application route, linked to a specified database
    async prompting(){
        this.answers = await this.prompt([
            {
                type: "input",
                name: "dbCode",
                message: "Code for database (it will be used as a db reference)",
                default: "main"
            },
            {
                type: "input",
                name: "route",
                message: "route prefix to access application instance (delete to delete the db linked route)",
                default: "/main"
            },

        ]);
    }

    //Creates the route or deletes the route for the specified database
    createAppRoute(){
        let appListFileName = path.join("config","appList.json");
        let appListContent = fs.readFileSync(
            appListFileName,
            {encoding: 'utf-8'}).toString();
        let appList = JSON.parse(appListContent);

        let exist = _.find(appList,{dbCode:this.answers.dbCode});
        if (exist) {
            if (this.answers.route!=='delete'){
                exist.route = this.answers.route;
                this.log("Route update for "+exist.dbCode);
            }
            else {
                appList.del(exist);
                this.log("Route for "+exist.dbCode+" has been deleted");
            }
        }
        else {
            appList.push({
                dbCode: this.answers.dbCode,
                route: this.answers.route,
                metaPath:"./../../meta",
                dsPath:"./client/dataset/"

            });
            this.log("Route for "+this.answers.dbCode+" has been created.");
        }
        appListContent = JSON.stringify(appList,null,4);
        fs.writeFileSync(appListFileName,
            new Buffer(appListContent), {encoding: 'utf-8'});
    }

    //Eventually creates a configuration for the database
    async createDbData(){
        let dbListFileName = path.join("config","dbList.json");
        let dbListContent = fs.readFileSync(
            dbListFileName,
            {encoding: 'utf-8'}).toString();
        let dbList = JSON.parse(dbListContent);

        let exist = dbList[this.answers.dbCode];
        if (exist) {
            console.log("createDbData: "+this.answers.dbCode+ " already has a configuration.");
            return;
        }

        this.dbAnswers = await this.prompt([
            {
                type: "input",
                name: "server",
                message: "server name or ip"
            },
            {
                type: "input",
                name: "database",
                message: "database name"
            },
            {
                type: "input",
                name: "user",
                message: "user name to access db (leave blank for using trusted connections) "
            },
            {
                type: "input",
                name: "password",
                message: "password to access db (leave blank for using trusted connections)"
            },
            {
                type: "input",
                name: "defaultSchema",
                message: "Default Schema (when available)",
                default:"DBO"
            },
            {
                type: "input",
                name: "schema",
                message: "schema to use",
            },
            {
                type: "list",
                name: "driver",
                message: "Driver for the database",
                choices:['jsMySqlDriver',"jsSqlServerDriver","jsOracleDriver"]
            },
        ]);
        let useTrustedConnection= (!this.dbAnswers.user && !this.dbAnswers.password);

        dbList[this.answers.dbCode]={
            server:this.dbAnswers.server,
            database:this.dbAnswers.database,
            useTrustedConnection:useTrustedConnection,
            user:this.dbAnswers.user,
            pwd:this.dbAnswers.pwd,
            sqlModule:this.dbAnswers.driver,
            defaultSchema:this.dbAnswers.defaultSchema,
        };

        this.log("Database for "+this.answers.dbCode+" has been created.");

        dbListContent = JSON.stringify(dbList,null,4);
        fs.writeFileSync(dbListFileName,
            new Buffer(dbListContent), {encoding: 'utf-8'});
    }



};