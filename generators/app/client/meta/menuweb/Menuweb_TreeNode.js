(function() {
    var TreeNodeUnLeveled = window.appMeta.TreeNodeUnLeveled;

    function Menuweb_TreeNode(childRow, descrField, codeString) {
        TreeNodeUnLeveled.apply(this, [childRow, descrField, codeString]);
    }

    Menuweb_TreeNode.prototype = _.extend(
        new TreeNodeUnLeveled(),
        {
            constructor: Menuweb_TreeNode,

            superClass: TreeNodeUnLeveled.prototype
            
        });

    appMeta.Menuweb_TreeNode = Menuweb_TreeNode;
}());
