(function() {
    var MetaPage = window.appMeta.MetaPage;
   
    function metaPage_menuweb() {
        MetaPage.apply(this, arguments);
        this.name = 'Menu web';
        this.isList = true;
        this.isTree = true;

        // this.mainSelectionEnabled = true;
    }

    metaPage_menuweb.prototype = _.extend(
        new MetaPage('menuweb', 'tree', false),
        {
            constructor: metaPage_menuweb,

            superClass: MetaPage.prototype
        }
    );

    window.appMeta.addMetaPage('menuweb', 'tree', metaPage_menuweb);
}());
