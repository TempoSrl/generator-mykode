/**
 * @class localization
 * @description
 * Contains the logic for the localization
 */
(function () {

    /**
     * @constructor localization
     * @description
     */
    function Localization() {
        this.defaultLanguage = 'it';
        this.currLanguage = this.defaultLanguage;
        this.supportedLanguage  = [this.defaultLanguage, 'en'];
        this.setLanguage(this.defaultLanguage);
    }

    Localization.prototype = {
        constructor: Localization,

        /**
         * 1. gets correct lang
         * 2. sets the lang forthe framewrok mdl
         * 3. set sthe lang for the html+js of the app. in this[key] I will find the translated string for the kye
         * @param {string} lang
         */
        setLanguage:function (lang) {
            // bonifico il linguaggio, per esser sicuro che esista tra quelli supportati
            this.currLanguage = this.getAppLanguage(lang);

            // --> set lingua del framework
            appMeta.localResource.setLanguage(this.currLanguage);

            // --> set lingua del main della app specifica. Recupero file di localizzazione
            var lbnSuffix = this.currLanguage.charAt(0).toUpperCase() + this.currLanguage.slice(1).toLowerCase();
            let lngPrototype = appMeta["Loc" + lbnSuffix].prototype;
            _.extend(this, lngPrototype);

            // localizza gli oggetti esterni che gestiscono i controlli data
            this.localizeDatePicker(this.currLanguage);

            // localizza stringhe presenti sul main, custom dell'applicativo
            this.localizeCustomMain();

            // localizza voci di menù
            this.localizeMenuOnTheFly();

            // localizzo pagina corrente. controlli standard (tab, label, nomi colonna...)
            if (appMeta.currApp.currentMetaPage){
                this.localizePage(appMeta.currApp.currentMetaPage);
            }

        },

        /**
         * localizes date picker
         * @param {string} lng
         */
        localizeDatePicker:function (lng) {
            $.datepicker.setDefaults({
                changeMonth: true,
                changeYear: true,
                yearRange: "1920:2030"
            });
            $.timepicker.setDefaults({
                changeMonth: true,
                changeYear: true,
                yearRange: "1920:2030"
            });
            $.datepicker.setDefaults($.datepicker.regional[lng]);
            $.timepicker.setDefaults($.timepicker.regional[lng]);
        },

        /**
         * Clean eventually the lang, and if it is not supported return default lang
         * @param {string} lang
         * @returns string
         */
        getAppLanguage:function (lang) {
            if (lang) {
                // non supporto specifica cultura
                if (lang.length > 2) lang = lang.substring(0, 2);
                // metto lingua di default se non presente la traduzione
                if (!_.includes(this.supportedLanguage, lang)) {
                    console.log("Language " + lang + " not supported. Used default " + this.defaultLanguage);
                    lang = this.defaultLanguage;
                }
            } else {
                lang = this.defaultLanguage;
            }
            return lang;
        },

        /**
         * Returns the lang of the browser, or  default if it no supported in the localizatio
         * @returns {string}. 'it' default, or any supoported lang, for example 'en', 'fr' etc..
         */
        getBrowserLanguage:function () {
            // cerca di recuperare le info sulla lingia dal browser
            var lang = window.navigator.userLanguage || window.navigator.language;
            return this.getAppLanguage(lang)
        },

        /**
         * Translates the metapage html linked + js variables
         * @param {MetaPage} metapage
         */
        localizePage:function (metapage) {
            if (!metapage) return console.log("localizePage: no metapage to localize");
            // 1. label: for
            this.labelPageLocalize(metapage);
            // 2. tab: data-target
            this.tabLocalize(metapage);
            // 3. contenuto div qualsiasi
            this.divGeneralLocalize(metapage);
            // 4. localizzo titolo, il name della metapage
            this.metaPageNameLocalize(metapage);
            // 5. localizzo nomi colonna "grid_<tableName>_<editType>_<columnName>"
            this.gridColumnsLocalize(metapage);
        },

        /**
         * titolo metapage
         * @param {MetaPage} metapage
         */
        metaPageNameLocalize:function(metapage) {
            var nameKey = metapage.primaryTableName.toLowerCase() + "_" + metapage.editType.toLowerCase();
            var valueTranslated = this[nameKey];
            metapage.name = valueTranslated || metapage.name;
        },

        /**
         * contenuto di qualsiasi div immerso
         * @param {MetaPage} metapage
         */
        divGeneralLocalize:function(metapage) {
            var self = this;
            $(metapage.rootElement)
            .find('.custom_lng_div')
            .each(function () {
                // recupero chiave
                var lockey = $(this).data('langkey');
                // prendo valore della traduzione
                var valueTranslated = self[lockey];
                if(valueTranslated !== null && valueTranslated !== undefined) $(this).html(valueTranslated);
            });
        },

        /**
         * etichetta dei tab
         * @param {MetaPage} metapage
         */
        tabLocalize:function(metapage) {
            var self = this;
            $(metapage.rootElement)
            .find('.nav-link')
            .each(function () {
                // recupero chiave
                var lockey = $(this).data('target');
                // prendo valore della traduzione
                var valueTranslated = self[lockey];

                if(valueTranslated !== null && valueTranslated !== undefined){
                    // prendo il 3o elemento poichè il primo è svg, il 2o tag "i" commentato, terzo il testo del tab
                    if ( $(this).contents().get(2)) {
                        $(this).contents().get(2).nodeValue = valueTranslated;
                    }
                }
            });
        },

        /**
         * etichette controlli
         * @param {MetaPage} metapage
         */
        labelPageLocalize:function(metapage) {
            var self = this;
            $(metapage.rootElement)
            .find('label')
            .each(function () {
                // recupero chiave
                var lockey = $(this).attr('for');
                // prendo valore della traduzione
                var valueTranslated = self[lockey];
                if(valueTranslated !== null && valueTranslated !== undefined) $(this).text(valueTranslated);
            });
        },


        /**
         * nomi colonne. il pattern è "grid_" + tname + "_" + edittype + "_" + cname
         * @param {MetaPage} metapage
         */
        gridColumnsLocalize:function(metapage) {
            var self = this;
            _.forEach($("[data-custom-control=gridx]"), function (grid) {
                // recupero info di che tabella si tratti dal tag
                var eltag = $(grid).data("tag");
                var tagArray = eltag.split(".");
                var tname = tagArray[0];
                var edittype = tagArray[2];
                $(grid).find('th').each(function () {
                    // scorro le celle e recupero quella in cui la colonna è quella corrente sotto esame
                    var cname = $(this).data("mdlcolumnname");
                    if (cname) {
                        var nameKey = "grid_" + tname + "_" + edittype + "_" + cname;
                        var valueTranslated = self[nameKey];
                        $(this).text(valueTranslated);
                    }
                });
            });
        },

        /**
         * Loops on menu rows, and localizes the label
         * columns: idmenuweb,idmenuwebparent,tableName,editType,label
         * @param {DataTable} dt. dt with the rows of the menu
         */
        localizeMenu:function (dt) {
            var self = this;
            _.forEach(dt.rows, function (rowitem) {
                // le chiavi nel file di risorse, o sono "tableName_editType" oppure "idmenuwebxxx" se non presenti
                var lockey = "idmenuweb" + rowitem.idmenuweb;
                if (rowitem.tableName && rowitem.editType) lockey = rowitem.tableName.toLowerCase() + "_" + rowitem.editType.toLowerCase();
                var valueTranslated = self[lockey];
                rowitem.label = valueTranslated || rowitem.label ;
            })
        },

        /**
         *
         */
        localizeMenuOnTheFly:function () {
            // localizzo voci di menù
            this.menuLocalize();
            // localizza le root del menù
            this.menuRootLocalize();
        },

        /**
         *
         */
        menuLocalize:function() {
            var self = this;
            $("#menu")
            .find('.nav-link > span')
            .each(function () {
                // recupero chiave
                var lockey = $(this).attr('id');
                // prendo valore della traduzione
                var valueTranslated = self[lockey];
                if(valueTranslated !== null && valueTranslated !== undefined){
                    $(this).text(valueTranslated);
                }
            });
        },

        /**
         * Localozza le voci root non cliccabili del menu
         */
        menuRootLocalize:function() {
            var self = this;
            $("#menu")
            .find('.nav-item')
            .each(function () {
                // recupero chiave
                var lockey = $(this).attr('id');
                // prendo valore della traduzione
                var valueTranslated = self[lockey];
                if(valueTranslated !== null && valueTranslated !== undefined){
                    $(this).find(".mdl_title_class").text(valueTranslated);
                }
            });
        },

        /**
         * Localizes html label and appMain string
         */
        localizeCustomMain:function () {
            // inseriamo qui la localizzazione dei controlli esterni al framework. Custom dell'index dell'applicazione
            $("#menu_search_btn_id").text(this["menu_search_btn_id"]);
            $("#menu_guide_btn_id").text(this["menu_guide_btn_id"]);
            $("#menu_info_btn_id").text(this["menu_info_btn_id"]);

            $('#logoutButton').text(this["logoutButton"]);
            $('#welcome_lbl_id').text(this["welcome_lbl_id"]);
            $('#loginButton').text(this["loginButton"]);
            $('#gotoLogin_id').text(this["gotoLogin_id"]);
            $('#gotoRegister_id').text(this["gotoRegister_id"]);
        },

        /**
         * TODO. Continuare nel caso si traducano tutte le pagine della app in maniera statica  all'inizio
         */
        translateApp:function () {
            // Esempio di chiamata a metodo custom
            var def = appMeta.Deferred("translateApp");

            appMeta.getData.launchCustomServerMethod("getAllFilesToTranslate")
            .then(function (res) {
                alert(res);
                def.resolve();
            });

            return def.promise();
        },

        getLogSchedulerMaxHourPerDay:function (currday, maxTotPerDay, role) {
            return appMeta.localResource.replaceWordsInPhrase({
                currday : currday,
                maxTotPerDay: maxTotPerDay,
                role: role
            }, this.schedulerSkypDay);
        },


        getLogSchedulerMaxHourPerDayDiff:function (currday, maxTotPerDay, hoursSameDay, hoursToAdd, hoursWouldAdd, role) {
            return appMeta.localResource.replaceWordsInPhrase({
                currday : currday,
                maxTotPerDay: maxTotPerDay,
                hoursSameDay: hoursSameDay,
                hoursToAdd: hoursToAdd,
                hoursWouldAdd: hoursWouldAdd,
                role: role
            }, this.schedulerLogMaxHourPerDay);
        },

        getLogSchedulerLastDay:function (currday, maxTotPerDay) {
            return appMeta.localResource.replaceWordsInPhrase({
                currday : currday,
                maxTotPerDay: maxTotPerDay
            }, this.schedulerLastDay);
        },

        getLogSchedulerTooManyHours: function(remaininghours, endDate) {
            return appMeta.localResource.replaceWordsInPhrase({
                remaininghours : remaininghours,
                endDate: endDate
            }, this.schedulerTooManyHours);
        },

        getSospDay:function (currday) {
            return appMeta.localResource.replaceWordsInPhrase({
                currday : currday
            }, this.schedulerSospDay);
        }

    };

    appMeta.localization = new Localization();
}());
