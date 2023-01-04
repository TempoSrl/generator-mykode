/* globals window,BaseMetaApp,_,appMeta */

(function () {

    // Deriva da MetaApp
    const MetaApp =  appMeta.MetaApp;

    function MetaXApp() {
        MetaApp.apply(this, arguments);
    }

    MetaXApp.prototype = _.extend(
        new MetaApp(),
        {
            constructor: MetaXApp,
            superClass: MetaApp.prototype,

        });
    appMeta.currApp = new MetaXApp();

    //We save the original getMetaDataPath function
    let baseGetPageDataPath = appMeta.getMetaPagePath;

    appMeta.getMetaPagePath = function (tableName) {
        if (appMeta.config.env === appMeta.config.envEnum.PROD) {
            return this.basePathMetadata ? this.basePathMetadata : this.basePath;
        }
        //We invoke the original function
        return baseGetPageDataPath.call(this, tableName);
    }

    appMeta.callWebService = function (method, prms) {
        return appMeta.currApp.callWebService(method,prms);
    }


}());
