(function() {
    var TreeViewManager = window.appMeta.TreeViewManager;

    function Menuweb_TreeViewManager() {
        TreeViewManager.apply(this, arguments);
        this.doubleClickForSelect = false;
    }

    Menuweb_TreeViewManager.prototype = _.extend(
        new TreeViewManager(),
        {
            constructor: Menuweb_TreeViewManager,

            superClass: TreeViewManager.prototype

        });

    appMeta.CustomControl("treeMenuweb", Menuweb_TreeViewManager);
    appMeta.Upb_TreeViewManager = Menuweb_TreeViewManager;
}());
