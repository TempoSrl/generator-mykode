/* globals window,BaseMetaApp,_,appMeta */

(function () {

    // Deriva da MetaApp
    const MetaApp = BaseMetaApp;

    function MetaXApp() {
        MetaApp.apply(this, arguments);
    }

    MetaXApp.prototype = _.extend(
        new MetaApp(),
        {
            constructor: MetaXApp,
            superClass: MetaApp.prototype,

            getMetaDataPath: function (tableName) {
                if (appMeta.config.env === appMeta.config.envEnum.PROD) {
                    return this.basePathMetadata ? this.basePathMetadata : this.basePath;
                }
                return this.superClass.getMetaDataPath.call(this, tableName);
            }

        });

    window.appMeta = new MetaXApp();

}());
