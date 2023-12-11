(function() {
    var q = window.jsDataQuery;

    /**
     * Builds automatically a menu starting form a rows collection, read from "menuweb" DB table
     */
    function menuBuilder() {
        this.init();
    }

    menuBuilder.prototype = {
        constructor: menuBuilder,

        /**
         * Initializes the App that uses "MDWL" library
         */
        init:function () {
            // numero di colonne in cui sono distribuiti gli item di 1o livello è parametrico
            this.numberOfColumns = 4;
            // id del root parent.
            this.rootMenuWebId = 1;

            this.html_menuid = "#mdl_mainmenu_id"; // id div principale menu
            this.html_menu_loader = "#mdl_menuloader_id"; // id del loader che poi nascondo al termine
            this.html_main_menu_title_class = "mdl_title_class"; // classe del titolo di menu di 1o livello.rimpiazzo quello del template
            this.html_mdl_itemtable_class = "mdl_itemtable_class"; // tag dove appendo la tabella bootstrap per menu di 1o e 2o livello

            this.opened = false;  // serve per gestire il bubbling, non posso stoppare eprchè poi non si chiude da sola la window
            this.menu = $( this.html_menuid );

        },

        /**
         * Sorts on sort property. if it is null it consider it as 99. so append at the end
         * @param {DataRow[]} rowsRoot
         */
        sortRows:function(rowsRoot){
            var rowsSorted = _.sortBy(
                // se proprietà sort è null considero come se fosse 99. lo inserirà alla fine
                _.map(rowsRoot, function (root) {
                    if (!root.sort) root.sort = 99;
                    // cambio proprietà se è null e ritorno stesso oggetto
                    return root;
                }),  'sort' );

            return rowsSorted;
        },

        getPrivilegeOk:function(idmenuweb){

            return true; // --> COMMENTARE QUANDO SI ABILITA
            // var menukeyW = "mw_" + idmenuweb;
            // var menukeyR = "mr_" + idmenuweb;
            // var privilegeW = appMeta.security.usrEnv[menukeyW];
            // var privilegeR = appMeta.security.usrEnv[menukeyR];
            // if ((privilegeW && privilegeW === "'S'") ||
            //     (privilegeR && privilegeR === "'S'")){
            //     return true;
            // }
            // return false;
        },

        clearMenu: function() {
            this.menu.empty();
        },
        
        /**
         * Initializes the menù items. Attaches the click events to the menù items
         */
        buildMenu:function (dt) {
            // loop su array di configurazione del menù
            var self = this;


            // eseguo per sicurezza sort su id, almeno quelli con id precednete che possono essere padri vengono creati prima
            var sortedRows = _.sortBy(dt.rows, function (row) {
                return row.idmenuwebparent;
            });

              // 1. metto i parent di primo livello
            var rootRows = dt.select(q.eq("idmenuwebparent", this.rootMenuWebId));
            // ordino su campo sort.
            var sortedRoots = this.sortRows(rootRows);

            // 1o loop sui root
            _.forEach(sortedRoots, function (rootItem) {

                var currId = "idmenuweb" + rootItem.idmenuweb;
                // inserisco template del nodo root
                var menuFirstlevel = appMeta.getData.cachedSyncGetHtml('menubuilder/MainItem_template.html');
                menuFirstlevel = menuFirstlevel.replace("ID_PLACE_HOLDER", currId); // assegno un id, rimpiazzando il place holder nella stringa html, altrimenti non esiste ancora l'id no  posso recuperarlo con jquery
                if (self.getPrivilegeOk(rootItem.idmenuweb)) {
                    self.menu.append(menuFirstlevel);
                }
                // rimpiazzo elementi necessari nel template
                $("#" + currId + " ." + self.html_main_menu_title_class).text(rootItem.label);

                // 2. conto figli e ordino
                var childsLev1 = self.sortRows(_.filter(sortedRows, {idmenuwebparent: rootItem.idmenuweb}));
                // calcolo numero di righe in base al totale degli item che devo inserire diviso il num di colonne che ho configurato
                var countChildsLev1 = childsLev1.length;
                var numCols = self.numberOfColumns;
                var numRows = Math.ceil(countChildsLev1 / numCols);

                // contatore di child di primo livello. serve per recuperare da array di input l'item
                var countCurrChild = 0;

                // 2. calcolo e disegno righe  e colonne html. per menù di primo livello
                for (var i = 0; i < numRows; i++) {

                    // nuova riga
                    var currRowid = "row_" + currId + "_" + i;
                    var currrow = $('<div class="row" id="' + currRowid + '">');
                    // appendo alla classe del template
                    $("#" + currId + " ." + self.html_mdl_itemtable_class).append(currrow);

                    // calcolo colonne e allo stesso tempo inserisco item li
                    for (var j = 0; j < numCols; j++) {

                        // ovviamente non popolo tutte le celle calcolate, ma mi fermo quando li ho inseriti tuti
                        if (countCurrChild < countChildsLev1){
                            // creo colonna
                            let currColId = currRowid + "_col_" + currId + "_" + j;
                            let currcol = $('<div class="' + self.getColTag() + '" id="' + currColId + '">');
                            let currul = $('<ul class="nav flex-column">');
                            let currItemFirstLev = childsLev1[countCurrChild];

                            // creo <li> e assegno eventuali eventi
                            let idforloc = (currItemFirstLev.tableName && currItemFirstLev.editType) ? (currItemFirstLev.tableName + "_"  + currItemFirstLev.editType) : "idmenuweb" + currItemFirstLev.idmenuweb;

                            // creo <li> e assegno eventuali eventi
                            let liFirstLev = $('<li class="nav-item"><a id="' + currItemFirstLev.idmenuweb + '" class="nav-link" href="#"><span id="' + idforloc + '">' + currItemFirstLev.label + '</span></a></li>');
                            if (currItemFirstLev.tableName && currItemFirstLev.editType){
                                liFirstLev.on("click", _.partial(self.openPage, self, currItemFirstLev.tableName, currItemFirstLev.editType ));
                            } else if (currItemFirstLev.link){
                                liFirstLev.on("click", _.partial(self.openWWWPage, self, currItemFirstLev.link ));
                            }

                            // elemento <ul> su cui appenderò gli item di 2o livello.il margin serve per allinearli un po' a destra ruspetto al parent
                            let ul = $('<ul class="nav flex-column" style="margin-left: 30px"></ul>');

                            // appendo gli elementi row e col html, in cui immediatamente inserisco anche il link dell'item di primo livello
                            currrow.append(currcol);
                            currcol.append(currul);

                            if (self.getPrivilegeOk(currItemFirstLev.idmenuweb)) {
                                currul.append(liFirstLev);
                            }

                            // appendo elemento <ul> a tale item così permetto l'append dei child di secondo livello
                            liFirstLev.append(ul);

                            // filtra su quelli di 2o livello che hanno parent l'id del1o livello corrente ovviamente
                            let secondLevChilds =  self.sortRows(_.filter(sortedRows, {idmenuwebparent: currItemFirstLev.idmenuweb}));

                            // 3. ciclo sui child di secondo livello e li appendo al corrente item di primo livello
                            _.forEach(secondLevChilds, function (currItemsecondLev) {
                                // creo <li> e assegno eventuali eventi
                                let idforloc = (currItemsecondLev.tableName && currItemsecondLev.editType) ? (currItemsecondLev.tableName + "_"  + currItemsecondLev.editType) : "idmenuweb" + currItemsecondLev.idmenuweb;
                                let liSecondLev = $('<li class="nav-item" style="padding-left: 15px"><a id="' + currItemsecondLev.idmenuweb + '" class="nav-link" href="#"><span id="' + idforloc + '">' + currItemsecondLev.label + '</span></a></li>');
                                if (currItemsecondLev.tableName && currItemsecondLev.editType) {
                                    liSecondLev.on("click", _.partial(self.openPage, self, currItemsecondLev.tableName, currItemsecondLev.editType ));
                                } else if (currItemsecondLev.link){
                                    liSecondLev.on("click", _.partial(self.openWWWPage, self, currItemsecondLev.link ));
                                }
                                if (self.getPrivilegeOk(currItemsecondLev.idmenuweb)) {
                                    ul.append(liSecondLev);
                                }
                            });

                            // prossimo childdi primo livello
                            countCurrChild++;
                        }

                    } // chiude for colonne
                } // chiude for righe
            }); //chiude forEach sui root

            // al termine nascondo loader
            $(this.html_menu_loader).hide();

        },
        
        
        /**
         * Retruns the bootstrap class of column object.
         */
        getColTag:function () {
            switch (this.numberOfColumns){
                case 1: return "col-md-12";
                case 2: return "col-md-6";
                case 3: return "col-md-4";
                case 4: return "col-md-3";
                case 6: return "col-md-2";
                case 12: return "col-md-1";
                default: return "col-md-4"; // il default è 3 colonne
            }
        },

        /**
         *
         * @param {menuBuilder} that
         * @param {string} link
         */
        openWWWPage:function(that, link) {
            event.stopPropagation();
            var win = window.open(link, '_blank');
            win.focus();
        },

        /**
         * Opens a metaPage based on "tableName" and "editType".
         * On ".then" callback it manages the closing of the page
         * @param {appMain} that
         * @param {string} tableName
         * @param {string} editType
         */
        openPage:function(that, tableName, editType){
            // apre la pagina richiamando il metodo del framework "callPage"
            // nella then attende il deferred risolto nella chiusura
            //event.stopPropagation(); // evito ilbubblign delle'evento
            if (!that.opened){
                // se uso stopPropagation per evitare il bubbling e quindi poer evitare che scatti 2 volte su item padre
                // metto boolenao, di cui eseguo reset dopo un secodno
                that.opened = true; // non esegue l'evento bubblato
                appMeta.currApp.callPage(tableName, editType, false)
                    .then(function (p) {
                        that.afterPageClose(p);
                    });
                setTimeout(function () {that.opened = false;}, 1000)
            }
        },

        /**
         * Manages the actions after the metaPage closing
         * @param {object} {primaryTableName, editType} p
         */
        afterPageClose:function (p) {
           // console.log("DEBUG: Pagina chiusa " + p.primaryTableName + " "  + p.editType);
           // this.enableAllTabs();
        },

        /**
         * Disables all the tabs
         */
        disableMenu:function () {
            $("#menu .navbar").css("background-color", "lightgrey");
            $("#menu").find("li").hide();
        },

        /**
         * Enables all the tabs
         */
        enableMenu:function () {
            $("#menu .navbar").css("background-color","");
            $("#menu").find("li").show();
        }

    };

    appMeta.menuBuilder =  menuBuilder;

}());
