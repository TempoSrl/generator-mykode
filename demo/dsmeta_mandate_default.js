const jsDataSet = require("./../components/metadata/jsDataSet");
let ds = new jsDataSet.DataSet("mandate_default");
const Deferred = require("JQDeferred");

function create(dbDescriptor){
    let def = Deferred();
    let tableNames=["mandate","mandatedetail","mandatekind"];
    //We create all the tables dynamically
    let tables= tableNames.map(tName=>{return dbDescriptor.createTable(tName);});
    Deferred.when.apply(Deferred,tables).then(function (){
        const tt = Array.prototype.slice.call(arguments);
        tt.map(t=>{
            ds.addTable(t); //we add the table to the dataset
        });
        ds.tables["mandatedetail"].setDataColumn("!mandatekind","String");

        //We add the dataset relations
        ds.newRelation("mandate_mandatedetail","mandate",null,"mandatedetail");
        ds.newRelation("mandatekind_mandate","mandatekind",null,"mandate");
        def.resolve(ds);
    });
    return def.promise();
}


module.exports = create;

