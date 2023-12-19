/* global expect,describe,beforeEach,afterEach,it,fit,appMeta,beforeAll */

let cfg = jasmine.getEnv().configuration();
cfg.random=false;
jasmine.getEnv().configure(cfg);


describe('mandate_default_e2e', function() {
    var timeout  = 60000;
    //let appMeta = window.appMeta;
    var stabilize = window.appMeta.stabilize;
    var stabilizeToCurrent = window.appMeta.stabilizeToCurrent;
    var stabilizeToLevel = window.appMeta.stabilizeToLevel;
    //var logger = appMeta.logger;
    var logType = window.appMeta.logTypeEnum;
    var testHelper = window.appMeta.testHelper;
    let Deferred = $.Deferred;
    var common = window.appMeta.common;
    let appMeta;

    describe("Basic checks on mandate default",
        function() {
            beforeEach(function (done) {
                appMeta = window.appMeta;
                appMeta.logger.setLogLevel(logType.INFO);
                testHelper.initAppTestProduction("main");
                appMeta = window.appMeta;

                appMeta.authManager.login("e2euser", "e2epwd", new Date())
                .then(function (res) {
                    expect(res).toBe(true);
                    done();
                });
            });

            afterEach(function () {
                expect(appMeta.Stabilizer.nesting).toBe(0);
                if (appMeta.Stabilizer.nesting > 0) {
                    appMeta.Stabilizer.showDeferred();
                }
            });

            it('1 Opening and closing form',
                function(done) {
                    // var ausiliaria per distinguere le varie configurazione sul file registry.anagrafica
                    appMeta.testCaseNumber = 1;
                    // Evento di attesa pagina caricata
                    testHelper = window.appMeta.testHelper;
                    testHelper.waitEvent(appMeta.EventEnum.showPage)
                        .then(function(metaPage) {
                            // TEST GENERICO DA INVOCARE per testare inizializzazione di qualsiasi MetaPage
                            testHelper.testMetaPageInitialization(metaPage, "mandate", "default");

                            // esempio per verificare presenza di un elemento su html
                            testHelper.htmlNodeByTagExists('mandate.idman');
                            testHelper.htmlNodeByTagNotFilled('mandate.idman');

                            // premo bottone di "Chiudi"
                            testHelper.clickButtonByTag('mainclose');
                            return stabilize();
                        })
                        .then(function () {
                            expect(appMeta.currApp.currentMetaPage).toBeNull();
                            done();
                        });


                    // Apro la pagina
                    appMeta.currApp.callPage("mandate", "default", false);

                });

            it('2 creating a new row',
                function(done) {
                    // var ausiliaria per distinguere le varie configurazione sul file registry.anagrafica
                    appMeta.testCaseNumber = 1;
                    // Evento di attesa pagina caricata
                    testHelper = window.appMeta.testHelper;
                    let _metaPage;
                    testHelper.waitEvent(appMeta.EventEnum.showPage).then(function(metaPage) {
                        _metaPage= metaPage;
                        // TEST GENERICO DA INVOCARE per testare inizializzazione di qualsiasi MetaPage
                        testHelper.testMetaPageInitialization(metaPage, "mandate", "default");

                        let s = stabilizeToLevel(1); // testHelper.waitEvent(appMeta.EventEnum.commandEnd);
                            //common.pageEventWaiter(metaPage, appMeta.EventEnum.stopMainRowSelectionEvent);
                        // premo bottone di "Chiudi"
                        testHelper.clickButtonByTag('maininsert');
                        return s;
                    })
                    .then(function (){
                        expect(appMeta.Stabilizer.nesting).toBe(1);

                        expect(appMeta.currApp.currentMetaPage.state.isInsertState()).toBe(true);
                        testHelper.setInputByTag("mandate.idman", 1);

                        let ctrl = $('#idmankind').data("customController");
                        if (ctrl){
                            ctrl.fillControl(null,"NOFATT");
                        }


                        return _metaPage.helpForm.fillControl(testHelper.getInputByTag("mandate.idmankind"), "NOFATT");
                    })
                    .then(()=>{
                        //testHelper.setInputByTag("mandate.idmankind","NOFATT");
                        expect($("select[data-tag='mandate.idmankind']").val()).toBe("NOFATT");
                        testHelper.setInputByTag("mandate.description","Nice Mandate");
                        expect(testHelper.getInputByTag("mandate.nman").val()).toBe("990001");
                        expect(testHelper.getInputByTag("mandate.yman").val()).toBe(new Date().getFullYear().toString());
                        let s = testHelper.waitEvent(appMeta.EventEnum.buttonClickEnd);
                        // premo bottone di "Chiudi"
                        testHelper.clickButtonByTag('mainsave');
                        return s;
                    })
                    .then(function () {
                        expect(appMeta.currApp.currentMetaPage.state.isEditState()).toBe(true);
                        expect(testHelper.getInputByTag("mandate.nman").val()).toBe("1");

                        let s = stabilizeToCurrent(); //testHelper.waitEvent(appMeta.EventEnum.commandEnd);
                        // premo bottone di "Chiudi"
                        testHelper.clickButtonByTag('mainsetsearch');
                        return s;
                    })
                    .then(function () {
                        expect(appMeta.currApp.currentMetaPage.state.isSearchState()).toBe(true);
                        let s = stabilize(); //testHelper.waitEvent(appMeta.EventEnum.commandEnd);
                        // premo bottone di "Chiudi"
                        testHelper.clickButtonByTag('mainclose');
                        return s;
                    })
                    .then(function () {
                            expect(appMeta.currApp.currentMetaPage).toBeNull();
                            done();
                    });

                    // Apro la pagina
                    appMeta.currApp.callPage("mandate", "default", false);

                });

            it('3 searching the row',
                function(done) {
                    // var ausiliaria per distinguere le varie configurazione sul file registry.anagrafica
                    appMeta.testCaseNumber = 1;
                    // Evento di attesa pagina caricata
                    testHelper = window.appMeta.testHelper;
                    let _metaPage;
                    testHelper.waitEvent(appMeta.EventEnum.showPage).then(function(metaPage) {
                        _metaPage= metaPage;
                        // TEST GENERICO DA INVOCARE per testare inizializzazione di qualsiasi MetaPage
                        testHelper.testMetaPageInitialization(metaPage, "mandate", "default");

                        testHelper.setInputByTag("mandate.idman", 1);
                        testHelper.setInputByTag("mandate.nman", 1);
                        testHelper.setInputByTag("mandate.yman",new Date().getFullYear());
                        return _metaPage.helpForm.fillControl(testHelper.getInputByTag("mandate.idmankind"), "NOFATT");
                    })
                    .then(()=>{
                        //common.pageEventWaiter(metaPage, appMeta.EventEnum.stopMainRowSelectionEvent);
                        // premo bottone di "Chiudi"
                        let r = stabilizeToLevel(1);
                        testHelper.clickButtonByTag('maindosearch');
                        return r;
                    })
                    .then(function (){
                        expect(appMeta.Stabilizer.nesting).toBe(1);
                        expect(appMeta.currApp.currentMetaPage.state.isEditState()).toBe(true);
                        expect(testHelper.getInputByTag("mandate.description").val()).toBe("Nice Mandate");
                        expect(testHelper.getInputByTag("mandate.idman").val()).toBe("1");
                        expect(testHelper.getInputByTag("mandate.nman").val()).toBe("1");
                        expect(testHelper.getInputByTag("mandate.yman").val()).toBe(
                                        new Date().getFullYear().toString());

                        // premo bottone di "Chiudi"
                        let r = stabilize();
                        testHelper.clickButtonByTag('mainclose');
                        return  r;
                    })
                    .then(function () {
                        expect(appMeta.currApp.currentMetaPage).toBeNull();
                        done();
                    });

                    // Apro la pagina
                    appMeta.currApp.callPage("mandate", "default", false);
                });

            it('4 adding a detail',
                function(done) {
                    // var ausiliaria per distinguere le varie configurazione sul file registry.anagrafica
                    appMeta.testCaseNumber = 1;
                    // Evento di attesa pagina caricata
                    testHelper = window.appMeta.testHelper;
                    let _metaPage;
                    let _metaPageDetail;
                    testHelper.waitEvent(appMeta.EventEnum.showPage).
                    then(function(metaPage) {
                        _metaPage= metaPage;
                        // TEST GENERICO DA INVOCARE per testare inizializzazione di qualsiasi MetaPage
                        testHelper.testMetaPageInitialization(metaPage, "mandate", "default");

                        testHelper.setInputByTag("mandate.idman", 1);
                        testHelper.setInputByTag("mandate.nman", 1);
                        testHelper.setInputByTag("mandate.yman",new Date().getFullYear());
                        return _metaPage.helpForm.fillControl(testHelper.getInputByTag("mandate.idmankind"), "NOFATT");
                    })
                    .then(()=>{
                        //common.pageEventWaiter(metaPage, appMeta.EventEnum.stopMainRowSelectionEvent);
                        // premo bottone di "Chiudi"
                        let r = stabilizeToLevel(1);
                        testHelper.clickButtonByTag('maindosearch');
                        return r;
                    })
                    .then(function (){
                        expect(appMeta.Stabilizer.nesting).toBe(1);
                        expect(appMeta.currApp.currentMetaPage.state.isEditState()).toBe(true);
                        //press grid insert button
                        let detailAppear = testHelper.waitEvent(appMeta.EventEnum.showPage);
                        $("[data-insert]")[0].click();
                        return detailAppear;
                    })
                    .then(function (metaPageDetail){
                            _metaPageDetail = metaPageDetail;
                            testHelper.testMetaPageInitialization(metaPageDetail, "mandatedetail", "detail");

                            expect(testHelper.getInputByTag("mandatedetail.idmankind").val()).toBe("NOFATT");
                            let txtTaxable = testHelper.getInputByTag("mandatedetail.taxable.fixed.5...1");
                            txtTaxable[0].focus();
                            txtTaxable.val("200");

                            let waitForBlur = Deferred();
                            txtTaxable.one( "blur", function() {
                                waitForBlur.resolve(txtTaxable);
                            });
                            txtTaxable[0].blur();
                            return waitForBlur.promise();
                        }
                    ).then ((txtTaxable)=>{
                        let newTaxable= txtTaxable.val();
                        expect(newTaxable).toBe("200,00000");

                        //testHelper.setInputByTag("mandatedetail.taxable.fixed.5...1", "13,00000");
                        testHelper.setInputByTag("mandatedetail.number.n", "12");
                        testHelper.setInputByTag("mandatedetail.discount.fixed.4..%.100", "10,00000 %");

                        let taxrate = $("#taxrate");
                        taxrate.focus();
                        taxrate.val("20");

                        let waitForBlur = Deferred();
                        taxrate.one( "blur", function() {
                            waitForBlur.resolve(taxrate);
                        });
                        taxrate[0].blur();
                        return waitForBlur.promise();

                    }).then ((taxrate)=>{
                        expect($("#total").val()).toBe("€ 2.592,00");
                        let res = stabilizeToLevel(1);
                        testHelper.clickButtonByTag('maindelete');
                        return res;
                    })
                    .then(function (){
                        // premo bottone di "Chiudi"
                        let r = stabilize();
                        testHelper.clickButtonByTag('mainclose');
                        return  r;
                    })
                    .then(function () {
                        expect(appMeta.currApp.currentMetaPage).toBeNull();
                        done();
                    });

                    // Apro la pagina
                    appMeta.currApp.callPage("mandate", "default", false);
                });


            it('5 deleting the row',
                function(done) {
                    // var ausiliaria per distinguere le varie configurazione sul file registry.anagrafica
                    appMeta.testCaseNumber = 1;
                    // Evento di attesa pagina caricata
                    testHelper = window.appMeta.testHelper;
                    let bottonClicked=false;
                    let _metaPage;
                    testHelper.waitEvent(appMeta.EventEnum.showPage).
                    then(function(metaPage) {
                        _metaPage= metaPage;
                        // TEST GENERICO DA INVOCARE per testare inizializzazione di qualsiasi MetaPage
                        testHelper.testMetaPageInitialization(metaPage, "mandate", "default");

                        testHelper.setInputByTag("mandate.idman", 1);
                        testHelper.setInputByTag("mandate.nman", 1);
                        testHelper.setInputByTag("mandate.yman",new Date().getFullYear());
                        return _metaPage.helpForm.fillControl(testHelper.getInputByTag("mandate.idmankind"), "NOFATT");
                    })
                    .then(()=>{
                        //let s = stabilizeToLevel(1); //testHelper.waitEvent(appMeta.EventEnum.buttonClickEnd);
                        //  testHelper.waitEvent(appMeta.EventEnum.commandEnd);
                        //common.pageEventWaiter(metaPage, appMeta.EventEnum.stopMainRowSelectionEvent);
                        // premo bottone di "Chiudi"
                        testHelper.clickButtonByTag('maindosearch');
                        return stabilizeToLevel(1);
                    })
                    .then(function (){
                        expect(appMeta.Stabilizer.nesting).toBe(1);
                        expect(appMeta.currApp.currentMetaPage.state.isEditState()).toBe(true);
                        expect(testHelper.getInputByTag("mandate.description").val()).toBe("Nice Mandate");

                        common.pageEventWaiter(_metaPage, appMeta.EventEnum.showModalWindow)
                        .then(function () {
                            expect($(".modal").find("button").eq(1).html()).toBe("Ok");
                            expect($(".modal").find("button").eq(2).html()).toBe("Annulla");
                            //appMeta.logger.setLogLevel(appMeta.logTypeEnum.INFO);
                            bottonClicked=true;
                            $(".modal").find("button").eq(1).click();
                        });

                        //let s = ;// stabilizeToCurrent(); //testHelper.waitEvent(appMeta.EventEnum.buttonClickEnd);
                                    // testHelper.waitEvent(appMeta.EventEnum.commandEnd);
                        testHelper.clickButtonByTag('maindelete');
                        return stabilizeToLevel(1);
                    })
                    .then(()=>{
                        expect(bottonClicked).toBeTrue();
                        expect(appMeta.currApp.currentMetaPage.state.isSearchState()).toBe(true);
                        let s = stabilize();
                        // premo bottone di "Chiudi"
                        testHelper.clickButtonByTag('mainclose');
                        return s;
                    })
                    .then(function () {
                        expect(appMeta.currApp.currentMetaPage).toBeNull();
                        done();
                    });

                    // Apro la pagina
                    appMeta.currApp.callPage("mandate", "default", false);
                });

            it('6 searching the row after it has been deleted',
                function(done) {
                    // var ausiliaria per distinguere le varie configurazione sul file registry.anagrafica
                    appMeta.testCaseNumber = 1;
                    // Evento di attesa pagina caricata
                    testHelper = window.appMeta.testHelper;
                    let _metaPage;
                    let clicked=false;
                    testHelper.waitEvent(appMeta.EventEnum.showPage).then(function(metaPage) {
                        _metaPage= metaPage;
                        // TEST GENERICO DA INVOCARE per testare inizializzazione di qualsiasi MetaPage
                        testHelper.testMetaPageInitialization(metaPage, "mandate", "default");

                        testHelper.setInputByTag("mandate.idman", 1);
                        testHelper.setInputByTag("mandate.nman", 1);
                        testHelper.setInputByTag("mandate.yman",new Date().getFullYear());
                        return _metaPage.helpForm.fillControl(testHelper.getInputByTag("mandate.idmankind"), "NOFATT");
                    })
                    .then(()=>{
                        //let s = ; //testHelper.waitEvent(appMeta.EventEnum.buttonClickEnd);
                        // premo bottone di "Chiudi"

                        common.pageEventWaiter(_metaPage, appMeta.EventEnum.showModalWindow)
                        .then(function () {
                            expect($(".modal").find("button").eq(1).html()).toBe("Ok");
                            expect($(".modal").find("button").eq(2).html()).toBe("Dettagli");
                            //appMeta.logger.setLogLevel(appMeta.logTypeEnum.INFO);
                            clicked=true;
                            $(".modal").find("button").eq(1).click();

                        });

                        testHelper.clickButtonByTag('maindosearch');
                        return stabilizeToLevel(1);
                    })
                    .then(function (){
                        expect(appMeta.Stabilizer.nesting).toBe(1);
                        expect(clicked).toBeTrue("Button has been clicked");
                        expect(appMeta.currApp.currentMetaPage.state.isSearchState()).toBe(true);
                        // premo bottone di "Chiudi"
                        testHelper.clickButtonByTag('mainclose');
                        return stabilize();
                    })
                    .then(function () {
                        expect(appMeta.currApp.currentMetaPage).toBeNull();
                        done();
                    });

                    // Apro la pagina
                    appMeta.currApp.callPage("mandate", "default", false);
                });

        });
});