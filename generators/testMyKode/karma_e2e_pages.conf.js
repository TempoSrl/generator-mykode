// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-02-06 using
// generator-karma 0.9.0

module.exports = function(config) {
    'use strict';

    config.set({
        // enable / disable watching file and executing tests whenever any file changes
        //autoWatch: true,
        usePolling: true,

        //dots  progress  junit  growl  coverage kjhtml spec
        reporters: ['spec'],


        // base path, that will be used to resolve files and exclude
        basePath: '../',

        // testing framework to use (jasmine/mocha/qunit/...)
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        xxfiles: [
            //'client/bower_components/jquery/dist/jquery.js',
            //'client/bower_components/jquery-ui/jquery-ui.min.js',
            //'node_modules/jasmine-collection-matchers/index.js',
            //'client/bower_components/lodash/lodash.js',
            'client/bower_components/observe-js/src/observe.js',
            //'client/components/metadata/jsDataQuery.js',
            //'client/bower_components/jasmine-jquery/lib/jasmine-jquery.js',
            //'client/components/metadata/jsDataSet.js',
            'client/bower_components/jstree/dist/jstree.js',
            'client/components/utility/select2.min.js',
            //'client/components/metadata/MetaApp.js',
            'client/components/metadata/Enum.js',
            //'client/components/metadata/Config.js',
            //'client/components/metadata/ConfigDev.js',
            //'client/components/metadata/LocalResource.js',
            //'client/components/metadata/Logger.js',
            //'client/components/metadata/EventManager.js',
            //'client/components/metadata/Routing.js',
            'client/components/metadata/DbProcedureMessage.js',
            'client/components/metadata/ConnWebService.js',
            'client/components/metadata/ConnWebSocket.js',
            'client/components/metadata/Connection.js',
            //'client/components/metadata/Utils.js',
            'client/components/metadata/Security.js',
            'client/components/metadata/AuthManager.js',
            'client/components/metadata/TypedObject.js',
            'client/components/metadata/GetDataUtils.js',
            // ////////'client/components/metadata/GetDataUtilsNode.js',
            'client/components/metadata/MetaModel.js',
            'client/components/metadata/GetData.js',
            'client/components/metadata/PostData.js',
            'client/components/i18n/*.js',
            'client/Localization.js',
            'client/assets/i18n/LocalResourceIt.js',

            'client/components/metadata/LoaderControl.js',
            'client/components/metadata/ModalLoaderControl.js',
            'client/components/metadata/MetaData.js',
            'client/components/metadata/CssDefault.js',
            'client/components/metadata/HelpForm.js',
            'client/components/metadata/MetaPageState.js',
            //'client/components/metadata/BootstrapModal.js',
            'client/components/metadata/TreeNode.js',
            'client/components/metadata/TreeNode_Dispatcher.js',
            'client/components/metadata/TreeNodeLeveled.js',
            'client/components/metadata/TreeNodeLeveled_Dispatcher.js',
            'client/components/metadata/TreeNodeUnLeveled.js',
            'client/components/metadata/TreeNodeUnLeveled_Dispatcher.js',
            'client/components/metadata/TreeViewManager.js',
            'client/components/metadata/ModalForm.js',
            'client/components/metadata/GridControl.js',
            'client/components/metadata/GridControlX.js',
            'client/components/metadata/ListManager.js',
            'client/components/metadata/ListManagerCalendar.js',
            'client/components/metadata/MainToolBarManager.js',
            'client/components/metadata/MetaPage.js',
            'client/components/metadata/ComboManager.js',
            'client/components/metadata/FormProcedureMessages.js',
            'client/components/metadata/GridMultiSelectControl.js',
            'client/components/metadata/MultiSelectControl.js',
            'client/components/styles/*.css',

            'client/styles/italia/*.css',
            'client/styles/*.css',

            'test/client/common/common.js',
            //'test/client/common/TestHelperPages.js',
            //'client/MetaTest3App.js',
            /////////'test/client/common/*.js',
            'client/pages/MetaTest3Page.js',
            //'client/index.html',

            'client/components/template/*.html',
         	'client/bower_components/bootstrap/dist/css/bootstrap.css',
            'client/bower_components/bootstrap/dist/js/bootstrap.bundle.js',
            //'test/client/pages_e2e/**/*_Spec.js',
            'client/meta/MetaTest3Data.js',  ///DA CUSTOMIZZARE
            { pattern: 'client/meta/meta_*.js', included: false, served: true},
            //{ pattern: 'client/metadata/**/*.js', included: true, served: true},
            //{ pattern: 'client/metadata/**/*.html', included: false, served: true},
            { pattern: 'client/pages/*.js', included: true, served: true},
            { pattern: 'client/pages/*.html', included: false, served: true},
            { pattern: 'client/components/userTemplate/*.html', included: true, served: true},
        ],
        files : [
             'client/bower_components/jquery/dist/jquery.js',  //necessary for eventManager
            // 'client/bower_components/jquery-ui/jquery-ui.min.js',
            // 'node_modules/jasmine-collection-matchers/index.js',
             'client/bower_components/lodash/lodash.js', //necessary for eventManager
             'client/components/metadata/jsDataQuery.js', // necessary for jsDataSet
             'client/bower_components/jasmine-jquery/lib/jasmine-jquery.js', //necessary for testHelper (getFixtures)
             'client/components/metadata/jsDataSet.js',  //necessary for eventManager
             'client/components/metadata/MetaApp.js',
            // 'client/components/metadata/LocalResource.js',
             'client/components/metadata/Logger.js', //necessary for mandate_default_Spec
            'client/components/metadata/EventManager.js',
             'client/components/metadata/Utils.js',
             'client/components/metadata/Config.js', //necessary for testHelperPages
            // 'client/components/metadata/ConfigDev.js',
             'client/components/metadata/Routing.js', //necessary for testHelperPages
             'client/components/metadata/BootstrapModal.js', //necessary for testHelperPages ($().modal)
            // 'client/MetaTest3App.js',
            'test/client/common/common.js',
            'test/client/common/TestHelperPages.js',
            'test/client/pages_e2e/**/*_Spec.js',
            //'client/index.html'
        ],

        // list of files / patterns to exclude
        exclude: [
        ],
        proxies:{
                "/":"http://localhost:54471/"
        },
        proxiesXX: {
             '/base/bower_components/': 'http://localhost:54471/client/bower_components/',
            '/client/components/userTemplate/': 'http://localhost:54471/client/components/userTemplate/',
            //'/base/components/': 'http://localhost:54471/client/components/',
            '/main/': 'http://localhost:54471/main/',
            '/client/data/': 'http://localhost:54471/client/data/',
            '/base/client/auth/': 'http://localhost:54471/client/auth/',
            '/base/client/data/': 'http://localhost:54471/client/data/',
        },

        // web server port
        port: 9876,
        browserNoActivityTimeout: 60000, // timeout se Karma non riceve messaggi dal browser entro un certo tempo. aumentato in test ceh richeidono query pesanti
        browserDisconnectTimeout: 30000,
        captureTimeout: 60000,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: [
            'ChromeDebugging' //'ChromeDebugging' // 'ChromeHeadless'  //
        ],

        customLaunchers: {
            ChromeDebugging: {
                base: 'Chrome',
                flags: ['--remote-debugging-port=9333']
            }
        },

        // Which plugins to enable
        plugins: [
            'karma-phantomjs-launcher', 'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-chrome-launcher',
            'karma-junit-reporter',
            'karma-spec-reporter'
        ],

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        //singleRun: false,

        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // Uncomment the following lines if you are using grunt's server to run the tests
        // proxies: {
        //   '/': 'http://localhost:9000/'
        // },
        // URL root prevent conflicts with the site root
        urlRoot: 'main',

        // Allow remote debugging when using PhantomJS
        // uncomment to karma debug on:
        // http://localhost:9876/debug.html
        // , customLaunchers: {
        //     'PhantomJS_custom': {
        //         base: 'PhantomJS',
        //         debug: true,
        //     }
        // }

    });
};
