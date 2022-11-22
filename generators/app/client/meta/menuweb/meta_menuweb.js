(function() {
    var MetaData = window.appMeta.MetaData;
    var getData = window.appMeta.getData;
    var getDataUtils = window.appMeta.getDataUtils;
    var Deferred = window.appMeta.Deferred;
    var q = window.jsDataQuery;
    function meta_menuweb() {
        MetaData.apply(this, ["menuweb"]);
        this.name = 'meta_menuweb';
    }

    meta_menuweb.prototype = _.extend(
        new MetaData(),
        {
            constructor: meta_menuweb,

            superClass: MetaData.prototype,

            /**
             * @method describeColumns
             * @public
             * @description SYNC
             * Describes a listing type (captions, column order, formulas, column formats and so on)
             * @param {DataTable} table
             * @param {string} listType
             * @returns {Deferred}
             */
            describeTree: function (table, listType) {
                var def = Deferred("meta_upb-describeTree");

                /* CASO OK prendo describe tree dal server
                // lato server torna rootcondition e poi vedremo cosa altro
                var resDef = getData.describeTree(table.name, listType)
                // N.B: ----> quando ritorno al treeview chiamante, torno le proprietà cusotm che si aspetta.
                // il default si aspetta solo  "rootCondition"
                    .then(function (res) {
                        
                        var rootCondition = getDataUtils.getJsDataQueryFromJson(res.rootCondition);

                        // instanzio il dispatcher giusto
                        var nodedispatcher = new appMeta.Menuweb_TreeNode_Dispatcher("label", "idmenuweb");

                        // torno al treeviewManger che ha invocato la resove con i prm attesi, che sono tutti e solo quelli che utilizza
                        def.resolve({
                            rootCondition:rootCondition,
                            nodeDispatcher: nodedispatcher
                        })
                    });
                 return def.from(resDef).promise();
                 */

                // CASO Describe tree su meta_dato client
                // instanzio il dispatcher giusto
                var nodedispatcher = new appMeta.Menuweb_TreeNode_Dispatcher("label", "idmenuweb");
                var rootCondition = q.eq("idmenuweb", 1);
                return def.resolve({
                    rootCondition:rootCondition,
                    nodeDispatcher: nodedispatcher
                })

               
            }
        });

    window.appMeta.addMeta('menuweb', new meta_menuweb('menuweb'));
}());
