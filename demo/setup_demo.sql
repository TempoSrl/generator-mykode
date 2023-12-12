
delete from web_listredir
GO

insert into web_listredir(tablename,listtype, newtablename, newlisttype, ct,cu,lt,lu)
    values('mandate','on_view','mandateview','default',getdate(),'nino',getdate(),'nino')

GO


-- GENERAZIONE DATI PER customgroup --


delete from menuweb
GO

insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
    values(2,null, 1, 1, null, 'Finanziario')
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
    values(3,null, 2, 2, null, 'Uscite')
--insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label) values(4,null, 3, 1, null, 'Contratti')
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
    values(4,'default', 3, 1, 'mandate', 'Contratti Passivi')

/*
insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
        values(5,"default1", 4, 2, "mandate", "Contratto Passivo 1")

insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
        values(6,"default2", 4, 3, "mandate", "Contratto Passivo 2")

insert into [menuweb] (idmenuweb, edittype, idmenuwebparent, sort,tablename, label)
        values(7,"default3", 4, 4, "mandate", "Contratto Passivo 3")
*/

GO

IF NOT EXISTS(select * from sysobjects where id = object_id(N'[mandate]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
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
GO

DELETE FROM MANDATE

GO



-- CREAZIONE TABELLA mandatekind --
IF NOT EXISTS(select * from sysobjects where id = object_id(N'[mandatekind]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
CREATE TABLE [mandatekind] (
idmankind varchar(20) NOT NULL,
active char(1) NULL,
description varchar(150) NOT NULL,
header varchar(150) NULL,
ct datetime NOT NULL,
cu varchar(64) NOT NULL,
lt datetime NOT NULL,
lu varchar(64) NOT NULL
 CONSTRAINT xpkmandatekind PRIMARY KEY (idmankind
)
)
END
GO

DELETE FROM MANDATEKIND
GO

-- GENERAZIONE DATI PER mandatekind --
INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)
    VALUES ('CICCIO-CP','S',{ts '2013-03-12 10:24:04.593'},'sa',
            'Contratto Ciccio', 'BL0001',{ts '2018-02-08 12:22:35.623'},'assistenza')

INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)
    VALUES ('CICCIO-CP_PCC','S',{ts '2013-03-12 10:24:04.593'},'sa',
            'Contratto CP_PCC', 'BL0002',{ts '2018-02-08 12:22:35.623'},'assistenza')


INSERT INTO [mandatekind]  (idmankind,active,ct,cu,description,header,lt,lu) VALUES
    ('CP_PCC','S',{ts '2014-12-30 15:54:59.757'},'assistenza',
     'Documento equivalente di pagamento','123456',{ts '2019-09-03 16:15:19.927'},'nino')

INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)  VALUES
    ('GENERALE','S',{ts '2006-01-31 17:12:09.953'},'sa',
        'Tipo ordine GENERALE','Intestazione da mandatekind.',{ts '2023-06-07 12:43:03.250'},'assistenza')
INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)  VALUES
    ('GIURprova','S',{ts '2015-09-03 16:30:43.140'},'assistenza',
    'GIUR - Convenzione passiva (Non soggetta ad IVA)',null,{ts '2018-02-12 17:37:44.830'},'assistenza')
INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)  VALUES
    ('NOFATT','S',{ts '2010-03-22 09:35:53.937'},'SARA',
            'Contratto Passivo  collegabile a Fattura','86',{ts '2016-06-01 14:13:03.877'},'assistenza')
INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)  VALUES
    ('NOFATTURA','S',{ts '2010-06-25 16:06:41.547'},'SA',
        'Contratto passivo SENZA FATTURA','4',{ts '2010-10-15 13:10:04.573'},'sa')
INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)  VALUES
    ('PRIMO','S',{ts '2006-08-03 10:47:12.703'},'sa',
        'Tipo ordine test','3654',{ts '2014-03-07 16:07:42.423'},'nino')
INSERT INTO [mandatekind] (idmankind,active,ct,cu,description,header,lt,lu)   VALUES
        ('PROVA',null,{ts '2007-11-06 13:53:55.933'},'NINO',
            'prova','prova',{ts '2014-03-07 16:07:20.283'},'nino')
GO

-- FINE GENERAZIONE SCRIPT --


-- CREAZIONE VISTA mandateview
IF EXISTS(select * from sysobjects where id = object_id(N'[mandateview]') and OBJECTPROPERTY(id, N'IsView') = 1)
DROP VIEW [mandateview]
GO


CREATE VIEW mandateview
	AS SELECT
	mandate.* ,
	mandatekind.description as mandatekind
	from mandate
	JOIN mandatekind (NOLOCK)
	ON mandate.idmankind = mandatekind.idmankind
GO



-- CREAZIONE TABELLA mandatedetail --

-- CREAZIONE TABELLA mandatedetail --
IF NOT EXISTS(select * from sysobjects where id = object_id(N'[mandatedetail]') and OBJECTPROPERTY(id, N'IsUserTable') = 1)
BEGIN
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
GO

delete from mandatedetail
GO

