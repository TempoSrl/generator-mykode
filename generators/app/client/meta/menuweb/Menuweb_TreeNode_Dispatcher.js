(function() {
    var TreeNodeUnLeveled_Dispatcher = window.appMeta.TreeNodeUnLeveled_Dispatcher;
    var Deferred = appMeta.Deferred;
    var TreeNodeUnLeveled = appMeta.TreeNodeUnLeveled;
    function Menuweb_TreeNode_Dispatcher(descrField, codeString) {
        TreeNodeUnLeveled_Dispatcher.apply(this, arguments);
        this.descrField = descrField;
        this.codeString = codeString;
    }

    Menuweb_TreeNode_Dispatcher.prototype = _.extend(
        new TreeNodeUnLeveled_Dispatcher(),
        {
            constructor: Menuweb_TreeNode_Dispatcher,

            superClass: TreeNodeUnLeveled_Dispatcher.prototype,

            /**
             * 
             */
            getNode:function (parentRow, childRow) {
                var def = Deferred("TreeNodeLeveled_Dispatcher-getNode");

                return def.resolve(new TreeNodeUnLeveled(childRow, this.descrField, this.codeString) );
            }

        });
    
    appMeta.Menuweb_TreeNode_Dispatcher = Menuweb_TreeNode_Dispatcher;

}());
