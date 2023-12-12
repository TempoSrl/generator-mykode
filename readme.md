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


Possiamo creare le altre tabelle e viste necessari per l'esempio con lo script setup presente nella cartella demo presente 
 su github