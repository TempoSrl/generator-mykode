[![en](https://img.shields.io/badge/lang-en-green.svg)](https://github.com/TempoSrl/generator-mykode/blob/master/readme.md)


# myKode generator

Questo generatore serve ad aiutare a creare un'applicazione con il framework myKode.


## Requisiti: 
- node version 16-19
- npm 
- al momento windows per la dipendenza edge-js ma prossimamente sarà disponibile anche su macchine linux
- un database sql server o mysql o oracle
- visual studio ed il tool hdsgene per editare visualmente i dataset
- yeoman (eseguire npm install --global yo)

## Creazione solution vuota
> creare nuova cartella (es.test)
> npm init

Se non è presente yeoman nel sistema è necessario eseguire:
>npm install --global yo

> npm install generator-mykode

## Creazione scheletro applicazione (yo mykode)

Questo passo si effettua una volta sola

Per creare il programma digitare nel terminal:
> yo mykode

Rispondere alle domande, ad esempio:
>? Your project name (must follow identifiers name rules) (test3)

Inserire il nome del progetto, il default è il nome della solution da package.json

>? Enter a strong password, it will be used to crypt some application file
> 
>? Overwrite client\package.json? (ynarxdeiH)  digitare y per modificare package.json  ove lo chieda
> 
>? Overwrite client\bower.json? (ynarxdeiH)  digitare y per modificare bower ove lo chieda
> 

A questo punto è stato creato uno scheletro vuoto del programma, con le cartelle

- client : tutti i file che saranno scaricati eventualmente dai client

- client\assets\i18n : le risorse necessarie per avere un programma multilingua, sarà poi da integrare in base alle 
   proprie esigenze

- client\components : i file del framework

- client\config :  i file di configurazione

- client\dataset : i dataset delle maschere, quelle dei test sono nella sottocartella test

- menubuilder: dei file per la gestione del menu

- client\metadata\"nome tabella"\: meta_tabella.js e metapage relativi alla tabella "nome tabella"



## Creazione routes di primo livello (yo mykode:application)

Ora dobbiamo creare una o più route per collegarsi all'applicazione, ogni route sarà associata ad un diverso db,
però è necessario che ogni db debba avere la stessa struttura di tabelle.

In sostanza è si possibile utilizzare db diversi per le varie istanze delle applicazioni, ma non possono avere una struttura diversa: tabelle,
viste, chiavi, devono essere identiche.

Dobbiamo creare un database vuoto, e creare un utente amministratore da usare nel prossimo passo.

In seguito aggiungeremo alcune tabelle ed una vista come esempio; possiamo evitare di eseguire i singoli script se 
eseguiamo direttamente il file setup.sql presente nella cartella test/jsApplication che sarà creata nel passo d' 
installazione "testMyKode"

> yo mykode:application
> 
> ? Code for database (it will be used as a db reference) (main)

è un codice simbolico e univoco che associamo al database cui ci collegheremo

> ? route prefix to access application instance (delete to delete the db linked route) (/main)
 
route per accedere al db dal percorso di base, di default ha lo stesso valore del codice db

> ? server name or ip

indirizzo del db a cui collegarsi
> ? database name (nome del database)
>
>? user name to access db (leave blank for using trusted connections)  sa
> 
> ? password to access db (leave blank for using trusted connections) xxx
> ? Default Schema (when available) 

DB schema di default per l'utente specificato sopra, di default è DBO
> ? schema to use (DBO)
 
schema da usare per i dati, ove diverso da quello di default

> ? Driver for the database jsSqlServerDriver 

(selezionare il driver adatto al db selezionato)
> Database entry for main has been created.

A questo punto sarà stato aggiornato il file appList.json sotto \config ove ci sono dbCode, route, metaPath= ./../../meta
e dsPath = ./client/dataset/ 

metaPath è il percorso relativo per la cartella meta a partire dalla cartella client/components/metadata, ove c'è la classe GetMeta che fa uso di questa informazione. 
Non dovrebbe essere necessario modificarlo se non si cambia la posizione dei meta.

Similmente ./client/dataset  

Questo passo (mykode:application) lo si può ripetere quando si vuole al fine di aggiungere altri database 
sotto altre routes principali

### Attenzione
È necessario per ogni database creato eseguire lo script  setup_mysql.sql o setup_sqlserver.sql presenti 
 nella cartella principale. A breve sarà disponibile anche setup_oracle.sql.


## Esecuzione test del framework

Se si vogliono modificare i file del framework e rieseguire i test sul framework, è possibile farlo con:
> yo mykode:testMyKode

sarà a questo punto necessario specificare le coordinate di accesso a 3 db vuoti, rispettivamente uno Sql Server,
uno Oracle e uno mySql:

>? To activate myKode internal test you must supply access to three empties databases
> 
> Do you want to continue? Yes
> 
> ? mySql Server name localhost
> 
> ? mySql DB name test
> 
> ? mySql user name user1
> 
> ? mySql pwd user1user1
> 
> ? sqlServer Server name 127.0.0.1
> 
> ? sqlServer DB name test
> 
> ? sqlServer user name amministrazione
> 
> ? sqlServer pwd user1user1
> 
> ? oracle Server name localhost
> 
> ? oracle DB name test
> 
> ? oracle user name user1
> 
> ? oracle pwd new_password
> 
> ? port (usually 1521)

Questo passo creerà dei file .json sotto test, uno per ogni tipo di database, che saranno usati nei test del 
 framework myKode, presenti nei task di grunt fornito nella cartella principale.
In questo modo è possibile, ove si modifichino i file del framework, rieseguirne i test per essere relativamente certi
di non aver introdotto errori.

## Aggiunta utenti al database e autenticazione

myKode backend nella forma base basa l'autenticazione su alcune tabelle, ma è facilmente possibile modificarne 
il funzionamento.

L'autenticazione infatti non fa propriamente parte del framework, ne è inserita una solo ai fini di agevolare l'
implementazione di una propria.

In particolare è prevista l'esistenza di una tabella virtualuser, che serve ad associare le login utente a utenti
virtuali del database, customuser, che associa le login degli utenti virtuali ai loro profili di sicurezza.

Per aggiungere un utente in modo semplice, giusto per iniziare, è anche previsto un task di grunt (add user), che 
 
chiede l'id una voce di organigramma (inserire un codice a piacere che inizia con le ultime due cifre dell'anno corrente, 
 ad esempio 23001 se siamo nel 2023), la login utente e la password.


### Esempio di creazione di qualche tabella

In questo esempio useremo sql server come database

Aggiungiamo al nostro database tre tabelle: mandate, mandatedetail e mandatekind.
Creiamo la tabella mandate con la seguente istruzione SQL: 

```sql
CREATE TABLE [mandate] (
    idmankind varchar(20) NOT NULL,
    yman smallint NOT NULL,
    nman int NOT NULL,
    active char(1) NULL,
    adate date NOT NULL,
    description varchar(150) NOT NULL,
    idman int NULL,
    idreg int NULL,
    ct datetime NOT NULL,
    cu varchar(64) NOT NULL,
    lt datetime NOT NULL,
    lu varchar(64) NOT NULL,
    rtf image NULL,
    CONSTRAINT xpkmandate PRIMARY KEY (idmankind,yman,nman)
)
END
```

#### Optimistic locking
Nota

Si può notare come nella tabella ci siano 4 campi ct,cu,lt,lu,  Questi sono usati per gestire, rispettivamente:

- ct (time stamp creazione) e cu (login utente che ha creato la riga) sono compilati dalla classe PostData al momento del salvataggio
- lt/lu: il timestamp di ultima modifica e l'utente di ultima modifica, usate per l'optimistic locking nelle transazioni

Il valore dei campi lu e cu sarà preso dall'environment (classe Environment) associato all'utente che sta salvando i dati.

E' possibile cambiare questi campi agendo sui metodi createPostData,getAnonymousEnvironment e createEnvironment della classe
    jsApplication che sta in src/jsApplication.js. Ad esempio il metodo createEnvironment è il seguente:

```js
createEnvironment: function(identity, conn){
    let e = new Environment(identity);
    //Sets field for optimistic locking
    e.field("lu",identity.name);
    e.field("cu",identity.name);
    return e;
}
```

ed il metodo createPostData è

```js
createPostData: function(ctx){
    let p =  new BusinessPostData(ctx);
    p.setOptimisticLocking( new OptimisticLocking(['lt', 'lu'], ['ct', 'cu', 'lt', 'lu']));
    return p;
}
```


Il comportamento di default per i campi di optimistic locking sarà di prendere i valori per i dati da salvare dalle 
    variabili dall'environment aventi lo stesso nome del rispettivo campo, questo invocando il metodo field(key[,value])
 della classe Environment.

Per questo motivo è anche necessario indicare alla classe Environment quali sono i campi timestamp, che dovranno essere 
da essa calcolati di volta in volta quando le vengono richiesti, e questo lo si fa ridefinendo il metodo getStampFields 
della classe Environment, che inizialmente è dato da:

```js
Environment.prototype.getStampFields =function(){
    return  {ct:true,lt:true};
};
```

Il nostro consiglio è lasciare tutto com'è e aggiungere a tutte le tabelle i 4 campi suddetti, per operare in ambienti 
di salvataggi concorrenti in piena sicurezza.


Possiamo creare le altre tabelle e viste necessari per l'esempio con lo script setup_demo presente nella cartella demo presente 
 nella cartella demo su github


## Creazione nuovo metadato


Per creare un nuovo metadato, della tabella mandate in questo caso, si può invocare:

> yo mykode:metadata
> 
> ? Name of the physical table or view mandate
> 
> ? Name of the main table of the view, or nothing
> 
Nel caso di viste è necessario specificare la tabella principale a cui si riferisce la vista. Questa scelta
 determina la cartella in cui sarà salvato il file del metadato.

> ? Descriptive name of the table Contratto passivo
> 
> ? Key fields separated by commas idmankind,yman,nman
> 
> name mandate
> table name mandate
> The folder 'client\metadata\mandate' has been created.
> File 'client\metadata\mandate\meta_mandate.js' has been created.


Si noterà che il metadato creato deriva dal metadato Meta[Nome applicazione]Data, in questo caso MetaTest3Data, creato con yo:myKode
Il metadato creato si intende essere usato da tutte le applicazioni configurate in questo progetto (con yo mykode:application)

A questo punto se vogliamo che nman sia calcolato in automatico in modo incrementale, partendo da 1 ogni volta che idmankind/yman assumono valori diversi, modifichiamo il metodo getNewRow della classe meta_mandate come segue:

```js
getNewRow: function(parentRow, dt, editType) {
        let def = Deferred("getNewRow-Meta_Mandate");
        dt.autoIncrement('nman', { minimum: 990000, selector:["idmankind","yman"]});

		return this.superClass.getNewRow(parentRow, dt, editType)
					.then(function (dtRow) {
						return def.resolve(dtRow);
					});
}
```

In pratica abbiamo decommentato la riga
```js
    //dt.autoIncrement('idxx', { minimum: 990000 });
```
e l'abbiamo modificata sostituendo a idxx il nome del campo che vogliamo calcolare in automatico,
    e poi aggiungendo i selettori di tale campo.

Se vogliamo che le nuove righe della tabella mandate abbiano dei valori di default, modifichiamo 
    il metodo setDefaults del metadato, ad esempio in questo modo:

```js
setDefaults: function(table) {
    table.defaults({
    "yman":this.security.sys("esercizio"),
    "active":"S",
    "adate":new Date(new Date().setHours(0,0,0,0))
    });
    this.superClass.setDefaults(table);
}
```
				
In questo caso abbiamo stabilito che  il campo yman avrà come default il valore "esercizio" preso dall'
    environment, il campo active avrà come default "S" ed infine il campo adate la data odierna. 

Infine è possibile definire le etichette che avranno i campi di questa tabella qualora compaiano in degli elenchi. E' possibile evitare questo passo qualora ci si accontenti di vedere i nomi dei campi cosi come sono presenti nel database.
La definizione degli elenchi si effettua ridefinendo il metodo describeColumns del metadato:

```js
describeColumns: function(table, listType) {
    let def = Deferred("describeColumns");
    if (listType==="default"){
    for (colName in table.columns){
        this.describeAColumn(table, colName,"",null,-1);
    }
    this.describeAColumn(table, "idmankind","#Tipo", null, 1, null);
    this.describeAColumn(table, "yman","Anno", null, 2, null);
    this.describeAColumn(table, "nman","N.", null, 3, null);
    this.describeAColumn(table, "adate","Data", "d", 4, null);
    this.describeAColumn(table, "description","Descrizione", null, 5, null);
}
return def.resolve(table).promise();
}
```

In questo modo abbiamo attribuito un'etichetta e una posizione per l'elenco "default" di questa tabella. 
E' possibile definire più elenchi su una stessa tabella, associandoli a diversi listType (in questo caso 
"default"), che rappresenta il nome simbolico di quell'elenco, per quella tabella.

Se ci colleghiamo al programma possiamo inserire alcuni dati e poi effettuare un elenco.

Possiamo procedere a creare una tabella di dettaglio del contratto passivo, in questo caso la chiamiamo mandatedetail:
(non è necessario eseguire lo script se si è eseguito setup_demo in precedenza)

```sql
CREATE TABLE [mandatedetail] (
    idmankind varchar(20) NOT NULL,
    yman smallint NOT NULL,
    nman int NOT NULL,
    rownum int NOT NULL,
    detaildescription varchar(150) NULL,
    discount float NULL,
    number decimal(19,2) NULL,
    tax decimal(19,2) NULL,
    taxable decimal(19,5) NULL,
    taxrate float NULL,
    ct datetime NOT NULL,
    cu varchar(64) NOT NULL,
    lt datetime NOT NULL,
    lu varchar(64) NOT NULL,
    CONSTRAINT xpkmandatedetail PRIMARY KEY (idmankind,yman,nman,rownum)
)
END
```

Creiamo il metadato:
> yo mykode:metadata
> 
> ? Name of the physical table or view mandatedetail
> 
> ? Name of the main table of the view, or nothing
> 
> ? Descriptive name of the table Dettaglio contratto
> 
> ? Key fields separated by commas idmankind,yman,nman,rownum
> 
> name mandatedetail
> 
> table name mandatedetail
> 
> The folder 'client\metadata\mandatedetail' has been created.
> 
> File 'client\metadata\mandatedetail\meta_mandatedetail.js' has been created.

Similmente, definiamo il campo rownum come ad autoincremento a parità di campi idmankind, yman, nman, 
    cambiando il metodo getNewRow aggiungendo:

```js
		dt.autoIncrement('rownum', { minimum: 990000,
												 selector:["idmankind","yman","nman"]
					});
```

e  poiché questa tabella comparirà in un grid di dettaglio nella maschera di mandate, 
    definiamo l'elenco "default" per questa tabella, analogamente a come abbiamo fatto per mandate, 
modificando il metodo describeColumns aggiungendo:

```js
    if (listType==="default"){
    for (colName in table.columns){
        this.describeAColumn(table, colName,"",null,-1);
    }
    let n=1;
    this.describeAColumn(table, "rownum","#", null, n++, null);
    this.describeAColumn(table, "!mandatekind","Tipo", null, n++, null);
    table.columns["!mandatekind"].expression="mandatekind.description";
    this.describeAColumn(table, "detaildescription","Descrizione", null,n++);
    this.describeAColumn(table,"number","Quantità",null,n++);
    this.describeAColumn(table,"taxable","Imponibile","d",n++);
    this.describeAColumn(table,"tax","Iva","d",n++);
    this.describeAColumn(table,"taxrate","aliquota","x.y.fixed.2..%.100",n++);
    //table.field.fixed.pos_decimali.prefix.suffix.scale
```


Procediamo con la tabella mandatekind:

Stessa cosa per mandatekind:

> yo mykode:metadata
> 
> ? Name of the physical table or view mandatekind
> 
> ? Name of the main table of the view, or nothing
> 
> ? Descriptive name of the table Tipo contratto
> 
> ? Key fields separated by commas idmankind
> 
> name mandatekind
> 
> table name mandatekind
> 
> The folder 'client\metadata\mandatekind' has been created.
> 
> File 'client\metadata\mandatekind\meta_mandatekind.js' has been created.


Mandatekind servirà come parent table della tabella mandate, ove il campo idmankind di mandate è una chiave
    esterna per mandatekind.

mandatekind è creata sul db eseguendo questo script:

```sql
CREATE TABLE [mandatekind] (
    idmankind varchar(20) NOT NULL,
    active char(1) NULL,
    description varchar(150) NOT NULL,
    header varchar(150) NULL,
    ct datetime NOT NULL,
    cu varchar(64) NOT NULL,
    lt datetime NOT NULL,
    lu varchar(64) NOT NULL
    CONSTRAINT xpkmandatekind PRIMARY KEY (idmankind)
)
```

Nella tabella mandatekind definiamo l'elenco "default", che servirà qualora si voglia selezionare il tipo di un contratto da un elenco anziché da una normale tendina:

```js
describeColumns: function (table, listType) {
        let def = Deferred("describeColumns");
        if (listType==="default"){
            for (colName in table.columns){
            this.describeAColumn(table, colName,"",null,-1);
            }
            this.describeAColumn(table, "idmankind","#Tipo", null, 1, null);
            this.describeAColumn(table, "description","Descrizione", null, 2, null);
            this.describeAColumn(table, "active","Attivo", null, 3, null);
            this.describeAColumn(table, "header","Intestazione", null, 4, null);
        
        }
        return def.resolve(table).promise();
}
```

				
Questo ha lo svantaggio di vedere nell'elenco il campo idmankind, che è un intero non significativo 
per l'utente. Vedremo tra poco come ovviare a problemi del genere.


Creiamo ora una vista sulla tabella mandate e la chiamiamo mandateview. 

Possiamo creare la vista mandateview con questo script:

```sql
CREATE VIEW mandateview
AS SELECT
    mandate.* ,
    mandatekind.description as mandatekind
    from mandate
    JOIN mandatekind (NOLOCK)
        ON mandate.idmankind = mandatekind.idmankind
```


Ne creiamo il metadato con:

> yo mykode:metadata
> 
> ? Name of the physical table or view mandateview
> 
> ? Name of the main table of the view, or nothing mandate
> 
> ? Descriptive name of the table Elenco contratti
> 
> ? Key fields separated by commas idmankind,yman,nman
> 
> name mandateview
> 
> table name mandate
> 
> File 'client\metadata\mandate\meta_mandateview.js' has been created.

In questo caso abbiamo specificato mandate come tabella principale per la vista, e come chiave abbiamo
 inserito la stessa di mandate. E' un modo di comunicare al framework quali sono i campi necessari per 
 identificare univocamente una riga della vista, considerato che una vista non ha fisicamente una chiave.



Per fare in modo tale che l'elenco della tabella mandate visualizzi le righe di mandateview aggiungiamo
    una riga alla tabella web_listredir in questo modo (anche questo è già in setup_demo):

```sql
insert into web_listredir(tablename,listtype, newtablename, newlisttype, ct,cu,lt,lu)
        values('mandate','on_view','mandateview','default',getdate(),'nino',getdate(),'nino')
```


e poi ridefiniamo il metodo describeColumns di meta_mandateview come segue:
```js
describeColumns: function(table, listType) {
    let def = Deferred("describeColumns");
    if (listType==="default"){
        for (colName in table.columns){
            this.describeAColumn(table, colName,"",null,-1);
        }
        this.describeAColumn(table, "mandatekind","#Tipo", null, 1, null);
        this.describeAColumn(table, "yman","Anno", null, 2, null);
        this.describeAColumn(table, "nman","N.", null, 3, null);
        this.describeAColumn(table, "adate","Data", "d", 4, null);
        this.describeAColumn(table, "description","Descrizione", null, 5, null);
    
    }
    return def.resolve(table).promise();
}
```

In questo modo nell'elenco vedremo comparire non il campo idmankind ma la descrizione corrispondente
nella tabella mandatekind. Similmente si può fare con viste più complesse per avere elenchi descrittivi.

## Creazione Pagine HTML (mykode:metapage)

La creazione delle pagine html è a carico dello sviluppatore, tuttavia è possibile creare uno schema "vuoto"
 per la metapage con il generatore:

> yo mykode:metapage
> 
> ? Title of page to be created Contratto passivo
> 
> ? Table or view name mandate
> 
> ? Main table (table, not view) mandate
> 
> ? symbolic name for the page (editType) default
> 
> ? it is a detail page (Y) or a main page (N) No
> 
> File 'client\metadata\mandate\mandate_default.js' has been created.
> 
> File 'client\metadata\mandate\mandate_default.html' has been created.

Inseriamo ora in  mandate_default.html il seguente frammento:

Inseriamo in mandate_default.html, il seguente frammento:
<div class='container'>
    <div>  Contratto passivo
        <br>
        <h3>Campi su tabella  mandate</h3>
        <br>mandate-idman: <input type="text" id="idman" data-tag="mandate.idman">


```html
        <br><div><button data-tag="choose.mandatekind.default">Scegli Tipo contratto</button>
            <select id="idmankind"  class="form-control"
                    data-tag="mandate.idmankind" data-custom-control="combo"
                    data-source-name="mandatekind" data-value-member="idmankind" data-display-member="description">
            </select>

            <!--div>
                <input id="idmankind" name="mandate_idmankind" type="text" data-listtype="default"
                       class="form-control" data-minchar="2" data-tag="mandatekind.description"
                       data-custom-control="dropdowngrid" autocomplete="off" placeholder="..." data-mandatory />
            </div-->

            <!--div>
            mandate-idmankind: <input id="idmankind"  type="text" data-tag="mandate.idmankind">
            </div-->
            <br />mandate-yman: <input type="text" data-tag="mandate.yman" />
            <br />mandate-nman: <input type="text" data-tag="mandate.nman" />
            <br /><br />mandate-description: <input type="text" data-tag="mandate.description">
            <br />
        </div>

        <label class="col-form-label col-md-12" for="mandate_adate">mandate-adate</label>
        <input id="mandate_adate" type="text" class="form-control"
               data-tag="mandate.adate"  data-datePickerFormat="dd/mm/yy" />
        <br><div class="gridx" id="grid_mandatedetail" data-tag="mandatedetail.default.detail" data-custom-control="gridx"
             data-mdlbuttoninsert data-mdlbuttonedit data-mdlbuttondelete></div>
    </div>
</div>
```

che serve a visualizzare e modificare alcuni campi di mandate, il campo è specificato nel data-tag.
Ulteriori spiegazioni su come scrivere l'html si possono trovare in
[MetaPage Html](https://github.com/TempoSrl/myKode_Frontend/blob/master/MetaPageHtml.md).

commentando la sezione su che ha data-tag="mandateidmankind" e decommentando una delle altre due è possibile 
provare diversi modi di visualizzare ed editare il campo idmankind (che è la chiave esterna su una tabella 
parent di mandate)

Per fare apparire una voce di menu che punti a questa pagina, eseguiamo (già fatto in setup_demo):

Aggiungiamo una voce di menu modificando lo script di creazione del database aggiungendo tre righe al database, nella tabella menuweb:

```sql
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
values(2,null, 1, 1, null, 'Finanziario')
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
values(3,null, 2, 2, null, 'Uscite')
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
values(4,'default', 3, 1, 'mandate', 'Contratti Passivi')
``` 

questo perché la versione fornita come demo utilizza la tabella menuweb per il menu, e questa richiede tre livelli 
 di annidamento. Però è certamente possibile utilizzare altri strumenti per visualizzare il proprio menu,
e che eventualmente non coinvolgano il database. 

Il menu, come l'autenticazione, non fa parte del framework.


Il codice javascript sottostante alla pagina è stato creato nel file mandate_default.js e non richiede
alcun intervento poiché non vogliamo implementare particolari funzionalità in questa pagina oltre al
normale ciclo di visualizzazione/modifica/etc



Affinché questa  pagina funzioni è tuttavia creare il suo dataset, e lo possiamo fare con visual studio 
    e poi creando un json a partire dall'xml creato con il tool HDSGene.
In particolare trasciniamo nel dataset le tre tabelle mandatekind, mandate e mandatedetail e creiamo
le due relazioni: da mandatekind a mandate sul campo idmankind, e da mandate a mandatedetail sui campi
idmankind, yman, nman.
Il json risultante è questo:

```json 
{
    "name": "dsmeta_mandate_default",
    "relations": {
        "mandatekind_mandate": {
        "parentTable": "mandatekind",
        "parentCols": "idmankind",
        "childTable": "mandate"
    },
    "mandate_mandatedetail": {
        "parentTable": "mandate",
        "parentCols": "idmankind,yman,nman",
        "childTable": "mandatedetail"
    }
    },
    "tables": {
        "mandate": {
            "key": "idmankind,nman,yman",
            "rows": [],
            "columns": {
            "idmankind": {
                "ctype": "String",
                "allowNull": false
            },
            "nman": {
                "ctype": "Int32",
                "allowNull": false
            },
            "yman": {
                "ctype": "Int16",
                "allowNull": false
            },
            "active": {
                "ctype": "String"
            },
            "adate": {
                "ctype": "DateTime",
                "allowNull": false
            },
            "ct": {
                "ctype": "DateTime",
                "allowNull": false
            },
            "cu": {
                "ctype": "String",
                "allowNull": false
            },
            "description": {
                "ctype": "String",
                "allowNull": false
            },
            "idreg": {
                "ctype": "Int32"
            },
            "lt": {
                "ctype": "DateTime",
                "allowNull": false
            },
            "lu": {
                "ctype": "String",
                "allowNull": false
            },
            "idman": {
                "ctype": "Int32"
            }
          },
    
          "skipSecurity": true
        },
    "mandatekind": {
      "key": "idmankind",
      "rows": [],
      "columns": {
        "idmankind": {
          "ctype": "String",
          "allowNull": false
        },
        "active": {
          "ctype": "String"
        },
        "ct": {
          "ctype": "DateTime",
          "allowNull": false
        },
        "cu": {
          "ctype": "String",
          "allowNull": false
        },
        "description": {
          "ctype": "String",
          "allowNull": false
        },
        "lt": {
          "ctype": "DateTime",
          "allowNull": false
        },
        "lu": {
          "ctype": "String",
          "allowNull": false
        },
        "header": {
          "ctype": "String"
        }
      }
    },
    "mandatedetail": {
      "key": "idmankind,yman,nman,rownum",
      "rows": [],
      "columns": {
        "!mandatekind": {
          "ctype": "String"
        },
        "idmankind": {
          "ctype": "String",
          "allowNull": false
        },
        "yman": {
          "ctype": "Int16",
          "allowNull": false
        },
        "nman": {
          "ctype": "Int32",
          "allowNull": false
        },
        "rownum": {
          "ctype": "Int32",
          "allowNull": false
        },
        "ct": {
          "ctype": "DateTime",
          "allowNull": false
        },
        "cu": {
          "ctype": "String",
          "allowNull": false
        },
        "detaildescription": {
          "ctype": "String"
        },
        "discount": {
          "ctype": "Double"
        },
        "lt": {
          "ctype": "DateTime",
          "allowNull": false
        },
        "lu": {
          "ctype": "String",
          "allowNull": false
        },
        "number": {
          "ctype": "Decimal"
        },
        "tax": {
          "ctype": "Decimal"
        },
        "taxable": {
          "ctype": "Decimal"
        },
        "taxrate": {
          "ctype": "Double"
        }
      }
    }
}
}
```

questo e un altro dataset (quello di mandatedetail) sono presenti nella cartella demo ed è necessario 
copiarli nella cartella client\dataset per visualizzare le pagine di questo esempio.

Analogamente creiamo la pagina del dettaglio contratto passivo:

> ? Title of page to be created Dettaglio contratto passivo
> 
> ? Table or view name mandatedetail
> 
> ? Main table (table, not view), leave blank if same as tableName
> 
> ? symbolic name for the page (editType) detail
> 
> ? it is a detail page (Y) or a main page (N) Yes
> 
> File 'client\metadata\mandatedetail\mandatedetail_detail.js' has been created.
> 
> File 'client\metadata\mandatedetail\mandatedetail_detail.html' has been created.


Nel file mandatedetail_detail.html inseriamo questo frammento:

```html 
<div class='container'>

    <select id="mandatedetail_idmankind1"  class="form-control"
            data-tag="mandatedetail.idmankind"
            data-source-name="mandatekind" data-value-member="idmankind" data-display-member="description" >
    </select>

    <br />
    Imponibile unitario: <input id ="taxable"  type="text" data-tag="mandatedetail.taxable.fixed.5...1" />
    <br />
    Quantità: <input id = "number" type="text" data-tag="mandatedetail.number.n" />
    <br />
    Sconto: <input id ="discount"  type="text" data-tag="mandatedetail.discount.fixed.4..%.100" />
    <br />
    Totale imponibile: <input id= "taxabletotal" type="text" class="alignNumericColumn" readonly />
    <br />
    aliquota iva: <input id ="taxrate"  type="text" data-tag="mandatedetail.taxrate.fixed.2..%.100" />
    <br />
    Iva: <input id ="tax"  type="text" data-tag="mandatedetail.tax.c" readonly/>

    <br />
    Totale: <input id= "total" type="text" class="alignNumericColumn" readonly />
    <br />
</div>
```

Anche per il mandatedetail è necessario creare un dataset, e generare il json. 

In questo caso basterà aggiungere al dataset la tabella mandatedetail e la sua parent mandatekind, 
qualora ci servissero i campi di mandatekind nella maschera. Il file generato da HDSGene è presente nella 
cartella demo e va copiato in client\dataset.


In questa maschera vogliamo inserire delle dipendenze tra alcuni campi, ossia delle formule che saranno 
applicate automaticamente quando sarannno modificati i dati nella maschera.
In particolare, l'imponibile totale deve essere pari a imponibile_unitario*quantita*(1.0-sconto)

a tal fine aggiungiamo delle dipendenze nel metodo afterLink:

```js
    this.registerFormula($("#taxabletotal"),this.evaluateTaxableTotal.bind(this));
    this.addDependencies([$("#taxable"),$("#number"),$("#discount")],$("#taxabletotal"));
```

con la prima istruzione abbiamo registrato una formula che serve a calcolare taxabletotal, e 
    con la seconda abbiamo stabilito che ogni volta che sono modificati i campi taxable, number, 
discount, questa sia rieseguita. 

Non ci resta che scrivere la formula :

```js
evaluateTaxableTotal:function(r){
    if (!r){
        $("#totale").val("");
        return 0;
    }
    let imponibile = r.taxable != null ? r.taxable : 0.0;
    let quantita = r.number != null ? r.number : 0.0;
    let sconto = r.discount != null ? r.discount : 0.0;

    let imponibiletot = Math.round(imponibile*quantita*(1.0-sconto)*100)/100;
    let tot = new appMeta.TypedObject("Decimal",imponibiletot,"x.y.c");
    $("#taxabletotal").val(tot.stringValue("x.y.c"));
    return imponibiletot;
}
```

che se ha in input una riga effettua i calcoli desiderati e visualizza il risultato, altrimenti svuota
il campo.

Il calcolo è effettuato in modo tale che il risultato abbia solo due cifre decimali. 

Questa funzione sarà un metodo della classe metaPage_mandatedetail appena creata.

Similmente, vogliano che l'imposta tax sia calcolata come: imponibiletot * taxrate,
scriviamo quindi il seguente metodo di metaPage_mandatedetail:

```js
evaluateTax:function(r){
    if (!r){
        $("#tax").val("");
        return 0;
    }
    let aliquota = r.taxrate !=null? r.taxrate: 0.0;
    let taxable = this.evaluateTaxableTotal(r);
    let iva = Math.round((taxable * aliquota)*100)/100;
    let tax = new appMeta.TypedObject("Decimal",iva,"x.y.c");
    $("#tax").val(tax.stringValue("x.y.c"));
    return iva;
}
```

e stabiliamo la dipendenza di tax da taxrate e imponibiletot (che a sua volta dipende da altri fattori) 
    aggiungendo le seguenti righe al metodo afterLink:

```js
    this.registerFormula($("#tax"),this.evaluateTax.bind(this));
    this.addDependencies([$("#taxabletotal"),$("#taxrate")],$("#tax"));
```

Infine vogliamo calcolare il totale riga come imponibile totale + imposta e scriviamo il metodo:

```js
evaluateTotal:function(r){
    if (!r){
        $("#total").val("");
        return 0;
    }

    let taxable = this.evaluateTaxableTotal(this.state.currentRow);
    let tax = this.evaluateTax(this.state.currentRow);
    let total = new appMeta.TypedObject("Decimal",taxable+tax,"x.y.c");
    $("#total").val(total.stringValue("x.y.c"));
    return total;
}
```

e aggiungiamo

```js
this.registerFormula($("#total"),this.evaluateTotal.bind(this));
this.addDependencies([$("#taxabletotal"),$("#tax")],$("#total"));	
```

al metodo afterLink.



Vediamo come con poche istruzioni abbiamo attivato dei calcoli in cascata sulla pagina, e potremmo 
    allo stesso modo aggiungerne molti altri, di qualsiasi complessità, come se fosse un foglio di excel,
tenendo conto che i campi dotati di un data-tag saranno poi memorizzati nei campi della riga, 
mentre gli altri sono puramente visuali, come abbiamo appena visto con taxabletotal e total.


###  test delle pagine 
TODO

