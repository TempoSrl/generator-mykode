(function () {

    var MetaPage = window.appMeta.MetaXPage;

    function metaPage_xxx() {
        MetaPage.apply(this, ['xxxTable', 'yyyEditType', isDetailXXX]);

        this.name = 'xxxTitle';
        this.defaultListType = 'yyyEditType';
        //pageHeaderDeclaration
    }

    metaPage_xxx.prototype = _.extend(
        new MetaPage(),
        {
            constructor: metaPage_xxx,
            superClass: MetaPage.prototype,

            //isValidFunction

            //afterGetFormData

            //beforeFill

            //afterClear

            //afterFill

            //afterLink

            //afterRowSelect(t, r)

            //afterActivation

            //rowSelected(r)

            //buttonClickEnd(currMetaPage, cmd)

            //insertClick(that, grid)

            //beforePost

            //buttons
        });

    window.appMeta.addMetaPage('xxxTable', 'yyyEditType', metaPage_xxx);

}());
