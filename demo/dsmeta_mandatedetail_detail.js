const jsDataSet = require("./../components/metadata/jsDataSet");
let ds = new jsDataSet.DataSet("mandatedetail_detail");
const Deferred = require("JQDeferred");

function create(dbDescriptor){
    let def = Deferred();
    let tableNames=["mandatedetail","mandatekind"];
    //We create all the tables dynamically
    let tables= tableNames.map(tName=>{return dbDescriptor.createTable(tName);});
    Deferred.when.apply(Deferred,tables).then(function (){
        const tt = Array.prototype.slice.call(arguments);
        tt.map(t=>{
            ds.addTable(t); //we add the table to the dataset
        });

        //We add the dataset relations
        ds.newRelation("mandatekind_mandatedetail","mandatekind",null,"mandatedetail");
        def.resolve(ds);
    });
    return def.promise();
}


module.exports = create;