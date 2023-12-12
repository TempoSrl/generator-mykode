[![it](https://img.shields.io/badge/lang-it-green.svg)](https://github.com/TempoSrl/generator-mykode/blob/master/readme.it.md)

# myKode generator

This generator is designed to assist in creating an application using the myKode framework.

## Requirements:
- Node version 16-19
- npm
- Currently, Windows is required for the edge-js dependency, but support for Linux machines will be available soon.
- An SQL Server, MySQL, or Oracle database
- Visual Studio and the hdsgene tool for visually editing datasets
- Yeoman (run `npm install --global yo`)

## Creating an empty solution
> Create a new folder (e.g., test)
> Run `npm init`

If Yeoman is not already installed on your system, run:
> `npm install --global yo`

> `npm install generator-mykode`

## Creating the application skeleton (`yo mykode`)

This step needs to be done only once.

To create the program, type the following in the terminal:

Answer the questions, for example:
>? Your project name (must follow identifier name rules) (test3)

Enter the project name; the default is the name of the solution from `package.json`.

>? Enter a strong password, it will be used to crypt some application file
> 
>? Overwrite client\package.json? (ynarxdeiH)  digitare y per modificare package.json  ove lo chieda
> 
>? Overwrite client\bower.json? (ynarxdeiH)  digitare y per modificare bower ove lo chieda

At this point, an empty program skeleton has been created, with the following folders:

- `client`: all files that will potentially be downloaded by clients
- `client\assets\i18n`: resources necessary for creating a multilingual program, to be integrated based on your needs
- `client\components`: framework files
- `client\config`: configuration files
- `client\dataset`: mask datasets; those for testing are in the subfolder `test`
- `menubuilder`: files for menu management
- `client\metadata\"table name"`: `meta_tabella.js` and `metapage` related to the "table name"

## Creating top-level routes (`yo mykode:application`)

Now we need to create one or more routes to connect to the application. Each route will be associated 
with a different database, but it's necessary for each database to have the same table structure.

In essence, it's possible to use different databases for various instances of the applications,
but they cannot have a different structure: tables, views, keys must be identical.

We need to create an empty database and create an administrator user for use in the next step.

Later, we'll add some tables and a view as an example; you can skip running individual scripts 
if you execute the `setup.sql` file directly in the `test/jsApplication` folder, which will be 
created in the "testMyKode" installation step.

> yo mykode:application
> 
> ? Code for database (it will be used as a db reference) (main)

It is a symbolic and unique code that we associate with the database to which we will connect.

> ? route prefix to access application instance (delete to delete the db linked route) (/main)

Route to access the database from the base path; by default, it has the same value as the database code.

> ? server name or ip

Address of the database to connect to.
> ? database name (nome del database)
>
>? user name to access db (leave blank for using trusted connections)  sa
> 
> ? password to access db (leave blank for using trusted connections) xxx
> ? Default Schema (when available) 

DB schema di default per l'utente specificato sopra, di default è DBO
> ? schema to use (DBO)

Default database schema for the user specified above; by default, it is set to DBO.

> ? Driver for the database jsSqlServerDriver 

(Select the appropriate driver for the chosen database)
> Database entry for main has been created.

At this point, the appList.json file under \config will have been updated, where there are dbCode, 
route, metaPath= ./../../meta, and dsPath = ./client/dataset/

metaPath is the relative path to the meta folder starting from the client/components/metadata folder, 
where the GetMeta class makes use of this information. It should not be necessary to modify it 
unless the location of the meta is changed.

Similarly, ./client/dataset

This step (mykode:application) can be repeated whenever you want to add other databases under other 
    main routes.

### Caution
For each created database, it is necessary to execute the setup_mysql.sql or setup_sqlserver.sql 
scripts present in the main folder. The setup_oracle.sql will be available shortly.


## Running Framework Tests

If you want to modify framework files and rerun tests on the framework, you can do so with:
> `yo mykode:testMyKode`

At this point, it will be necessary to specify the access details for 3 empty databases, respectively,
one for SQL Server, one for Oracle, and one for MySQL:

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

This step will create .json files under the test folder, one for each type of database, which will be 
used in the myKode framework tests provided in the grunt tasks in the main folder. 

This way, if you modify framework files, you can rerun the tests to be relatively certain that you 
haven't introduced errors.

## Adding Users to the Database and Authentication

The myKode backend in its basic form bases authentication on some tables, but it is easily possible 
to modify its operation.

Authentication is not strictly part of the framework; one is included only to facilitate the
implementation of a custom one.

In particular, there is the existence of a `virtualuser` table, which associates user logins with
virtual users in the database, and `customuser`, which associates logins of virtual users with their security profiles.

To add a user easily, just to get started, there is also a grunt task (`add user`) that asks for the 
ID of an organizational chart entry (enter a code that starts with the last two digits of the current
year, for example, 23001 if it is 2023), the user login, and the password.


### Example of Creating Some Tables

In this example, we will use SQL Server as the database.

Let's add three tables to our database: `mandate`, `mandatedetail`, and `mandatekind`.
Create the `mandate` table with the following SQL statement:

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

#### Optimistic Locking
Note

It can be noticed that there are 4 fields `ct`, `cu`, `lt`, `lu` in the table. These are used to manage,
    respectively:

- `ct` (creation timestamp) and `cu` (user login who created the row) are filled in by the `PostData` class at the time of saving.
- `lt/lu`: the timestamp of the last modification and the user of the last modification, used for optimistic locking in transactions.

The value of the `lu` and `cu` fields will be taken from the environment (`Environment` class) associated with the 
user who is saving the data.

It is possible to change these fields by acting on the methods `createPostData`, `getAnonymousEnvironment`, and 
`createEnvironment` of the `jsApplication` class located in `src/jsApplication.js`. 
For example, the `createEnvironment` method is as follows:
```js
createEnvironment: function(identity, conn){
    let e = new Environment(identity);
    //Sets field for optimistic locking
    e.field("lu",identity.name);
    e.field("cu",identity.name);
    return e;
}
```
And the `createPostData` method is:

```js
createPostData: function(ctx){
    let p =  new BusinessPostData(ctx);
    p.setOptimisticLocking( new OptimisticLocking(['lt', 'lu'], ['ct', 'cu', 'lt', 'lu']));
    return p;
}
```

The default behavior for optimistic locking fields will be to take the values for the data to be saved from the 
variables in the environment with the same name as their respective fields. This is done by invoking the 
`field(key[, value])` method of the `Environment` class.

For this reason, it is also necessary to inform the `Environment` class about the timestamp fields that should
be calculated each time they are requested. This is done by redefining the `getStampFields` method of the `Environment` class, which is initially given by:

```js
Environment.prototype.getStampFields =function(){
    return  {ct:true,lt:true};
};
```

Our advice is to leave everything as it is and add the aforementioned 4 fields to all tables. This ensures safe 
operation in concurrent save environments.

We can create the other necessary tables and views for the example using the `setup_demo` script in the demo 
folder on GitHub.

## Creating a New Metadata

To create new metadata, for the `mandate` table in this case, you can invoke:

> yo mykode:metadata
> 
> ? Name of the physical table or view mandate
> 
> ? Name of the main table of the view, or nothing

In the case of views, it is necessary to specify the main table to which the view refers. 
This choice determines the folder in which the metadata file will be saved.

> ? Descriptive name of the table Contratto passivo
> 
> ? Key fields separated by commas idmankind,yman,nman
> 
> name mandate
> table name mandate
> The folder 'client\metadata\mandate' has been created.
> File 'client\metadata\mandate\meta_mandate.js' has been created.


You will notice that the created metadata is derived from the Meta[Application Name]Data metadata, in this case,
MetaTest3Data, created with `yo:myKode`. The created metadata is intended to be used by all applications configured
in this project (with `yo mykode:application`).

At this point, if we want the `nman` field to be automatically calculated in an incremental way, starting from 1
every time `idmankind/yman` take different values, we modify the `getNewRow` method of the `meta_mandate` class 
as follows:

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

In practice, we have uncommented the line
```js
//dt.autoIncrement('idxx', { minimum: 990000 });
```
and modified it by replacing `idxx` with the name of the field we want to automatically calculate and 
then adding the selectors for that field.

If we want the new rows of the `mandate` table to have default values, we modify the `setDefaults` method of 
the metadata, for example, in this way:

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
In this case, we have established that the `yman` field will have the default value "esercizio" taken from 
the environment, the `active` field will have the default value "S", and finally, the `adate` field will have 
the current date as the default.

Finally, it is possible to define the labels that the fields of this table will have if they appear in lists. 
It is possible to skip this step if you are content with seeing the field names as they are present in the database. 
The definition of the lists is done by redefining the `describeColumns` method of the metadata:

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
This way, we have assigned a label and a position for the "default" list of this table. It is possible to define
multiple lists on the same table, associating them with different `listType` (in this case, "default"),
which represents the symbolic name of that list for that table.

If we connect to the program, we can enter some data and then perform a list.

We can proceed to create a detail table of the passive contract; in this case, we call it `mandatedetail`:
(it is not necessary to run the script if `setup_demo` has been executed previously)

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

Let's create the metadata:
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

Similarly, let's define the `rownum` field as an auto-increment when the fields `idmankind`, `yman`, `nman` are 
    the same, changing the `getNewRow` method by adding:

```js
    dt.autoIncrement('rownum', { minimum: 990000,
                                 selector:["idmankind","yman","nman"]
    });
```

And since this table will appear in a detail grid in the `mandate` form, let's define the "default" list for this table, similarly to what we did for `mandate`, by modifying the `describeColumns` method and adding:

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

Let's proceed with the mandatekind table:


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

`Mandatekind` will serve as the parent table of the `mandate` table, where the `idmankind` field of `mandate` is a 
    foreign key for `mandatekind`.

`Mandatekind` is created in the database by executing this script:
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
In the `mandatekind` table, let's define the "default" list, which will be used if you want to select the type 
of a contract from a list rather than a regular dropdown:

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

This has the disadvantage of displaying the `idmankind` field in the list, which is an integer not meaningful 
    to the user. We will see shortly how to overcome such issues.

Now, let's create a view on the `mandate` table and call it `mandateview`.

We can create the `mandateview` view with this script:

```sql
CREATE VIEW mandateview
AS SELECT
    mandate.* ,
    mandatekind.description as mandatekind
    from mandate
    JOIN mandatekind (NOLOCK)
        ON mandate.idmankind = mandatekind.idmankind
```

Let's create the metadata for it with:

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

In this case, we have specified `mandate` as the main table for the view, and as the key, we have included the 
same key as `mandate`. It is a way to communicate to the framework which fields are necessary to uniquely identify 
a row in the view, considering that a view does not physically have a key.

To ensure that the list of the `mandate` table displays the rows of `mandateview`, add a row to the `web_listredir` 
table in this way (this is also already in `setup_demo`):

```sql
insert into web_listredir(tablename,listtype, newtablename, newlisttype, ct,cu,lt,lu)
        values('mandate','on_view','mandateview','default',getdate(),'nino',getdate(),'nino')
```

and then redefine the `describeColumns` method of `meta_mandateview` as follows:

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

This way, in the list, we will see not the `idmankind` field but the corresponding description in the `mandatekind` 
table. Similarly, you can do this with more complex views to have descriptive lists.

## Creating HTML Pages (`yo:metapage`)

The creation of HTML pages is the responsibility of the developer; however, it is possible to create an "empty" 
schema for the metapage with the generator:

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

Let's insert the following fragment into `mandate_default.html`:

```html
<div class='container'>
    <div>  Contratto passivo
        <br>
        <h3>Campi su tabella  mandate</h3>
        <br>mandate-idman: <input type="text" id="idman" data-tag="mandate.idman">



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

which is used to display and modify some fields of `mandate`, the field is specified in the data-tag.
Further explanations on how to write HTML can be found in the
[MetaPage Html](https://github.com/TempoSrl/myKode_Frontend/blob/master/MetaPageHtml.md).

By commenting the section with `data-tag="mandateidmankind"` and uncommenting one of the other two, 
it is possible to try different ways to display and edit the `idmankind` field (which is the foreign key to a 
parent table of `mandate`).

To make a menu item that points to this page appear, execute (already done in `setup_demo`):

Add a menu item by modifying the database creation script, adding three lines to the database in the
`menuweb` table:

```sql
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
values(2,null, 1, 1, null, 'Finanziario')
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
values(3,null, 2, 2, null, 'Uscite')
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
values(4,'default', 3, 1, 'mandate', 'Contratti Passivi')
``` 
This is because the version provided as a demo uses the `menuweb` table for the menu, and this requires three levels 
of nesting. However, it is certainly possible to use other tools to display your menu that may not involve the 
database.

The menu, like authentication, is not part of the framework.

The JavaScript code below the page has been created in the `mandate_default.js` file and does not require any
intervention since we do not want to implement any particular functionality on this page beyond the normal 
display/edit/etc. cycle.

However, for this page to work, it is necessary to create its dataset, and we can do this with Visual Studio 
and then create a JSON from the XML created with the HDSGene tool. In particular, drag the three tables `mandatekind`,
`mandate`, and `mandatedetail` into the dataset and create the two relationships: from `mandatekind` to `mandate` 
on the `idmankind` field, and from `mandate` to `mandatedetail` on the fields `idmankind`, `yman`, `nman`. 

The resulting JSON is as follows:

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

This and another dataset (the one for `mandatedetail`) are present in the demo folder and it is necessary to copy them 
to the `client\dataset` folder to display the pages of this example.

Similarly, let's create the page for the passive contract detail:


> ? Title of page to be created Passive contract detail
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



Let's insert the following fragment into `mandatedetail_detail.html`:

```html
<div class='container'>

    <select id="mandatedetail_idmankind1" class="form-control"
            data-tag="mandatedetail.idmankind"
            data-source-name="mandatekind" data-value-member="idmankind" data-display-member="description">
    </select>

    <br />
    Unit Taxable Amount: <input id="taxable" type="text" data-tag="mandatedetail.taxable.fixed.5...1" />
    <br />
    Quantity: <input id="number" type="text" data-tag="mandatedetail.number.n" />
    <br />
    Discount: <input id="discount" type="text" data-tag="mandatedetail.discount.fixed.4..%.100" />
    <br />
    Total Taxable Amount: <input id="taxabletotal" type="text" class="alignNumericColumn" readonly />
    <br />
    VAT Rate: <input id="taxrate" type="text" data-tag="mandatedetail.taxrate.fixed.2..%.100" />
    <br />
    VAT: <input id="tax" type="text" data-tag="mandatedetail.tax.c" readonly/>
    <br />
    Total: <input id="total" type="text" class="alignNumericColumn" readonly />
    <br />
</div>
```

For `mandatedetail` as well, it is necessary to create a dataset and generate the JSON.

In this case, you just need to add the `mandatedetail` table and its parent `mandatekind` to the dataset,
in case you need the fields of `mandatekind` in the form. The file generated by HDSGene is present in the demo 
folder and should be copied to `client\dataset`.

In this form, we want to insert dependencies between some fields, i.e., formulas that will be automatically
applied when the data in the form is modified.

In particular, the total taxable amount should be equal to `unit_taxable_amount * quantity * (1.0 - discount)`.

To achieve this, add dependencies in the `afterLink` method:

```js
    this.registerFormula($("#taxabletotal"),this.evaluateTaxableTotal.bind(this));
    this.addDependencies([$("#taxable"),$("#number"),$("#discount")],$("#taxabletotal"));
```
With the first instruction, we have registered a formula that calculates `taxabletotal`, and with the second, we have
    established that every time the fields `taxable`, `number`, and `discount` are modified, this formula should be 
    re-executed.

All that remains is to write the formula:

```js
evaluateTaxableTotal:function(r){
    if (!r){
        $("#total").val("");
        return 0;
    }
    let taxable = r.taxable != null ? r.taxable : 0.0;
    let number = r.number != null ? r.number : 0.0;
    let discount = r.discount != null ? r.discount : 0.0;

    let taxabletotal = Math.round(taxable*number*(1.0-discount)*100)/100;
    let tot = new appMeta.TypedObject("Decimal",taxabletotal,"x.y.c");
    $("#taxabletotal").val(tot.stringValue("x.y.c"));
    return taxabletotal;
}
```

which, if it has a row as input, performs the desired calculations and displays the result; otherwise, it clears the 
field.

The calculation is carried out in such a way that the result has only two decimal places.

This function will be a method of the recently created `metaPage_mandatedetail` class.

Similarly, we want the tax to be calculated as `total_taxable * tax_rate`, so we write the following method for
`metaPage_mandatedetail`:

```js
evaluateTax: function (r) {
    if (!r) {
        $("#tax").val("");
        return 0;
    }
    let taxRate = r.taxrate != null ? r.taxrate : 0.0;
    let taxableTotal = this.evaluateTaxableTotal(r);
    let taxAmount = Math.round((taxableTotal * taxRate) * 100) / 100;
    let tax = new appMeta.TypedObject("Decimal", taxAmount, "x.y.c");
    $("#tax").val(tax.stringValue("x.y.c"));
    return taxAmount;
}
```

and we establish the dependency of `tax` on `taxrate` and `total_taxable` (which in turn depends on other factors)
by adding the following lines to the `afterLink` method:


```js
    this.registerFormula($("#tax"),this.evaluateTax.bind(this));
    this.addDependencies([$("#taxabletotal"),$("#taxrate")],$("#tax"));
```

Finally, we want to calculate the total row as `total_taxable + tax`, and we write the method:

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

and we add:


```js
this.registerFormula($("#total"),this.evaluateTotal.bind(this));
this.addDependencies([$("#taxabletotal"),$("#tax")],$("#total"));	
```

to the `afterLink` method.

With just a few instructions, we have activated cascading calculations on the page, and we could similarly
add many others, of any complexity, as if it were an Excel sheet. Keep in mind that fields with a `data-tag` 
will be stored in the row's fields, while others are purely visual, as we just saw with `taxabletotal` and `total`.


### Running the application

To see the application in action, you can invoke the "publish" task of Grunt and then run the `server.js` file 
in the main folder. The program will listen on all routes registered with `mykode:application`.


### Testing the Pages

To perform end-to-end tests on the newly created pages, we can create a folder named `pages_e2e` in 
    `test/client` and copy the `mandate_default_Spec.js` file from the demo folder into it.

Then, you can run the `client pages e2e` task, which is already configured for this purpose.

In the Grunt tasks, you will find other client and server test tasks at various levels for the components 
of the library.

