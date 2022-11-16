const Generator = require('yeoman-generator');
let fs = require('fs');
const path = require('path');

module.exports = class extends Generator {
    // The name `constructor` is important here
    constructor(args, opts) {
        // Calling the super constructor is important so our generator is correctly set up
        super(args, opts);

    }

    async main_prompting(){
        this.mainConfirm = await this.prompt([
            {
                type: "confirm",
                name: "confirm",
                message: "To activate myKode internal test you must supply access to two empties databases"+
                    "\nDo you wanto to continue?",
                choices:["S","N"]
            }
        ]);
    }

    async mySqlConfig(){
        if (!this.mainConfirm.confirm){
            return;
        }
        let sqlConfig = await this.prompt([
            {
                type: "input",
                name: "server",
                message: "mySql Server name"
            },
            {
                type: "input",
                name: "database",
                message: "mySql DB name"
            },
            {
                type: "input",
                name: "user",
                message: "mySql user name"
            },
            {
                type: "input",
                name: "pwd",
                message: "mySql pwd"
            },
        ]);

        let mySqlDbString = JSON.stringify(sqlConfig,null,4);

        fs.writeFileSync(path.join("test","dbMySql.json"),
            new Buffer(mySqlDbString), {encoding: 'utf-8'});
    }

    async sqlServerConfig(){
        if (!this.mainConfirm.confirm){
            return;
        }
        let sqlConfig = await this.prompt([
            {
                type: "input",
                name: "server",
                message: "sqlServer Server name"
            },
            {
                type: "input",
                name: "database",
                message: "sqlServer DB name"
            },
            {
                type: "input",
                name: "user",
                message: "sqlServer user name"
            },
            {
                type: "input",
                name: "pwd",
                message: "sqlServer pwd"
            },
        ]);

        let sqlServerDbString = JSON.stringify(sqlConfig,null,4);

        fs.writeFileSync(path.join("test","dbSqlServer.json"),
            new Buffer(sqlServerDbString), {encoding: 'utf-8'});

        sqlConfig.test=true;
        sqlConfig.defaultSchema="amministrazione";
        sqlConfig.EnableSSORegistration=true;
        sqlConfig.userkindSSO=5;
        sqlConfig.userkindUserPassw = 3;

        let dbListFileName = path.join("config","dbList.json");
        let dbListContent = fs.readFileSync(
            dbListFileName,
            {encoding: 'utf-8'}).toString();
        let dbList = JSON.parse(dbListContent);

        let appListFileName = path.join("config","appList.json");
        let appListContent = fs.readFileSync(
            appListFileName,
            {encoding: 'utf-8'}).toString();
        let appList = JSON.parse(appListContent);



        let exist1 = dbList.test_sqlServer;
        if (!exist1) {
            dbList.test_sqlServer=Object.assign({}, sqlConfig);
            appList.push( {"dbCode":"test_sqlServer",
                "route":"/test"
            });

        }

        let exist2 = dbList["test_sqlServer_anonymous"];
        if (!exist2) {
            sqlConfig.test=false;
            dbList.test_sqlServer_anonymous=Object.assign({}, sqlConfig);
            appList.push( {"dbCode":"test_sqlServer_anonymous",
                "route":"/testanonymous"
            });
        }
        if (!exist1 || !exist2){
            dbListContent = JSON.stringify(dbList, null, 4);
            fs.writeFileSync(dbListFileName,
                new Buffer(dbListContent), {encoding: 'utf-8'});

            appListContent = JSON.stringify(appList, null, 4);
            fs.writeFileSync(appListFileName,
                new Buffer(appListContent), {encoding: 'utf-8'});
        }

    }
};