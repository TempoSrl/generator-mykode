(function(MetaData, Deferred) {

        /** Detect free variable `global` from Node.js. */
        let freeGlobal = typeof global === 'object' && global && global.Object === Object && global;
        /** Detect free variable `self`. */
        let freeSelf = typeof self === 'object' && self && self.Object === Object && self;
        /** Used as a reference to the global object. */
        let root = freeGlobal || freeSelf || Function('return this')();
        /** Detect free variable `exports`. */
        let freeExports = typeof exports === 'object' && exports && !exports.nodeType && exports;
        /** Detect free variable `module`. */
        let freeModule = freeExports && typeof module === 'object' && module && !module.nodeType && module;


        //noinspection JSUnresolvedVariable
        /** Detect free variable `global` from Node.js or Browserified code and use it as `root`. (thanks lodash)*/
        let moduleExports = freeModule && freeModule.exports === freeExports;


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
                    var q = window.jsDataQuery;

                    // CASO Describe tree su meta_dato client
                    // instanzio il dispatcher giusto
                    var nodedispatcher = new appMeta.Menuweb_TreeNode_Dispatcher("label", "idmenuweb");
                    var rootCondition = q.eq("idmenuweb", 1);
                    return def.resolve({
                        rootCondition:rootCondition,
                        nodeDispatcher: nodedispatcher
                    });


                }
            });


        if (freeExports && freeModule) {
            if (moduleExports) { // Export for Node.js or RingoJS.
                (freeModule.exports = meta_menuweb).meta_menuweb = meta_menuweb;
            } else { // Export for Narwhal or Rhino -require.
                freeExports.meta_menuweb = meta_menuweb;
            }
        } else {
            // Export for a browser or Rhino.
            if (root.appMeta){
                //root.appMeta.meta = meta_attach;
                appMeta.addMeta('menuweb', new meta_menuweb('menuweb'));
            } else {
                root.meta_menuweb = meta_menuweb;
            }
        }

    }(  (typeof appMeta === 'undefined') ? require('../components/metadata/MetaData') : appMeta.MetaData,
        (typeof appMeta === 'undefined') ? require('../components/metadata/EventManager').Deferred : appMeta.Deferred,
    )
);
