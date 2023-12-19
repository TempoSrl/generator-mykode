/*   SETUP DATA DEMO */

-- CREAZIONE TABELLA web_listredir --
CREATE TABLE IF NOT EXISTS web_listredir (
    tablename VARCHAR(50) NOT NULL,
    listtype VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    newlisttype VARCHAR(50) NULL,
    newtablename VARCHAR(50) NULL,
    PRIMARY KEY (tablename, listtype)
);

-- Elimina i dati dalla tabella web_listredir
DELETE FROM web_listredir;

GO

-- CREAZIONE TABELLA customuser --
CREATE TABLE IF NOT EXISTS customuser (
    idcustomuser VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (idcustomuser)
);

-- Elimina i dati dalla tabella customuser
DELETE FROM customuser;
GO


-- CREAZIONE TABELLA customgroup --
CREATE TABLE IF NOT EXISTS customgroup (
    idcustomgroup VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    description VARCHAR(200) NULL,
    groupname VARCHAR(80) NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    PRIMARY KEY (idcustomgroup)
);

-- Elimina i dati dalla tabella customgroup
DELETE FROM customgroup;

GO

-- CREAZIONE TABELLA customusergroup --
CREATE TABLE IF NOT EXISTS customusergroup (
    idcustomgroup VARCHAR(50) NOT NULL,
    idcustomuser VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    PRIMARY KEY (idcustomgroup, idcustomuser)
);

-- Elimina i dati dalla tabella customusergroup
DELETE FROM customusergroup;

GO
-- CREAZIONE TABELLA customgroupoperation --
CREATE TABLE IF NOT EXISTS customgroupoperation (
    idgroup VARCHAR(50) NOT NULL,
    operation CHAR(1) NOT NULL,
    tablename VARCHAR(50) NOT NULL,
    allowcondition TEXT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    defaultisdeny CHAR(1) NOT NULL,
    denycondition TEXT NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    PRIMARY KEY (idgroup, operation, tablename)
);

-- Elimina i dati dalla tabella customgroupoperation
DELETE FROM customgroupoperation;

GO

-- CREAZIONE TABELLA flowchart --
CREATE TABLE IF NOT EXISTS flowchart (
    idflowchart VARCHAR(34) NOT NULL,
    address VARCHAR(100) NULL,
    ayear INT NULL,
    cap VARCHAR(20) NULL,
    codeflowchart VARCHAR(50) NOT NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    fax VARCHAR(75) NULL,
    idcity INT NULL,
    idsor1 INT NULL,
    idsor2 INT NULL,
    idsor3 INT NULL,
    location VARCHAR(50) NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    nlevel INT NOT NULL,
    paridflowchart VARCHAR(34) NOT NULL,
    phone VARCHAR(55) NULL,
    printingorder VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    PRIMARY KEY (idflowchart)
);

-- Elimina i dati dalla tabella flowchart
DELETE FROM flowchart;


GO

-- CREAZIONE TABELLA flowchartuser --
CREATE TABLE IF NOT EXISTS flowchartuser (
    idflowchart VARCHAR(34) NOT NULL,
    ndetail INT NOT NULL,
    idcustomuser VARCHAR(50) NOT NULL,
    all_sorkind01 CHAR(1) NULL,
    all_sorkind02 CHAR(1) NULL,
    all_sorkind03 CHAR(1) NULL,
    all_sorkind04 CHAR(1) NULL,
    all_sorkind05 CHAR(1) NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    flagdefault CHAR(1) NOT NULL,
    idsor01 INT NULL,
    idsor02 INT NULL,
    idsor03 INT NULL,
    idsor04 INT NULL,
    idsor05 INT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    sorkind01_withchilds CHAR(1) NULL,
    sorkind02_withchilds CHAR(1) NULL,
    sorkind03_withchilds CHAR(1) NULL,
    sorkind04_withchilds CHAR(1) NULL,
    sorkind05_withchilds CHAR(1) NULL,
    start DATE NULL,
    stop DATE NULL,
    title VARCHAR(150) NULL,
    PRIMARY KEY (idflowchart, ndetail, idcustomuser)
);

-- Elimina i dati dalla tabella flowchartuser
DELETE FROM flowchartuser;

GO

-- CREAZIONE TABELLA menu --
CREATE TABLE IF NOT EXISTS menu (
    idmenu INT NOT NULL,
    edittype VARCHAR(60) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    menucode VARCHAR(80) NULL,
    metadata VARCHAR(60) NULL,
    modal CHAR(1) NULL,
    ordernumber INT NULL,
    parameter VARCHAR(80) NULL,
    paridmenu INT NULL,
    title VARCHAR(80) NOT NULL,
    userid VARCHAR(80) NULL,
    PRIMARY KEY (idmenu)
);

-- Elimina i dati dalla tabella menu
DELETE FROM menu;

GO

-- Elimina i dati dalla tabella flowchartuser
DELETE FROM flowchartuser;

-- CREAZIONE TABELLA userenvironment --
CREATE TABLE IF NOT EXISTS userenvironment (
    idcustomuser VARCHAR(50) NOT NULL,
    variablename VARCHAR(50) NOT NULL,
    flagadmin CHAR(1) NULL,
    kind CHAR(1) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    value TEXT NULL,
    PRIMARY KEY (idcustomuser, variablename)
);

-- CREAZIONE TABELLA flowchartrestrictedfunction --
CREATE TABLE IF NOT EXISTS flowchartrestrictedfunction (
    idflowchart VARCHAR(34) NOT NULL,
    idrestrictedfunction INT NOT NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    PRIMARY KEY (idflowchart, idrestrictedfunction)
);

-- CREAZIONE TABELLA restrictedfunction --
CREATE TABLE IF NOT EXISTS restrictedfunction (
    idrestrictedfunction INT NOT NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    description VARCHAR(100) NOT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    variablename VARCHAR(50) NOT NULL,
    PRIMARY KEY (idrestrictedfunction)
);

-- Elimina i dati dalla tabella restrictedfunction
DELETE FROM restrictedfunction;

GO

-- CREAZIONE PROCEDURA compute_environment
DELIMITER //
CREATE PROCEDURE compute_environment(
    IN ayear INT,
    IN idcustomuser VARCHAR(50),
    IN idflowchart VARCHAR(34) DEFAULT NULL,
    IN ndetail INT DEFAULT NULL
)
BEGIN
    DECLARE noflowchart CHAR(1) DEFAULT 'N';

    IF (idflowchart IS NULL) THEN
        SELECT idflowchart, ndetail
        INTO idflowchart, ndetail
        FROM flowchart F
        JOIN flowchartuser FU ON F.idflowchart = FU.idflowchart
        WHERE FU.idcustomuser = idcustomuser
            AND (FU.start IS NULL OR FU.start <= NOW())
            AND (FU.stop IS NULL OR FU.stop >= NOW())
            AND F.ayear = ayear
        ORDER BY FU.flagdefault DESC;

        SELECT idflowchart, ndetail;
    END IF;

    IF (idflowchart IS NOT NULL AND ndetail IS NULL) THEN
        SELECT ndetail
        INTO ndetail
        FROM flowchart F
        JOIN flowchartuser FU ON F.idflowchart = idflowchart
        WHERE FU.idcustomuser = idcustomuser
            AND (FU.start IS NULL OR FU.start <= NOW())
            AND (FU.stop IS NULL OR FU.stop >= NOW())
            AND F.ayear = ayear
        ORDER BY FU.flagdefault DESC;

        SELECT idflowchart, ndetail;
    END IF;

    DECLARE codeflowchart VARCHAR(100);
    SELECT codeflowchart INTO codeflowchart FROM flowchart WHERE idflowchart = idflowchart;

    SELECT idflowchart, ndetail, codeflowchart;

    DECLARE allvar VARCHAR(30);
    SET allvar = NULL;

    DECLARE withchilds CHAR(1);
    SET withchilds = 'N';

    DECLARE all_value CHAR(1);
    SET all_value = 'N';

    DECLARE cond VARCHAR(1000);
    SET cond = '';

    DECLARE idvar VARCHAR(30);

    DECLARE idlist VARCHAR(MAX);
    SET idlist = '';

    CREATE TEMPORARY TABLE myouttable (
        variablename VARCHAR(200),
        kind CHAR(1),
        mustquote CHAR(1),
        value TEXT
    );

    -- Esegui il resto del codice...
END //
DELIMITER ;

GO

-- CREAZIONE PROCEDURA compute_allowform
DELIMITER //
CREATE PROCEDURE compute_allowform(
    IN ayear INT,
    IN iduser VARCHAR(10),
    IN idflowchart VARCHAR(34),
    IN varname VARCHAR(30) DEFAULT NULL
)
BEGIN
    -- Esegui il corpo della procedura...
END //
DELIMITER ;

-- CREAZIONE PROCEDURA compute_notable
DELIMITER //
CREATE PROCEDURE compute_notable(
    IN ayear INT,
    IN iduser VARCHAR(10),
    IN idflowchart VARCHAR(34),
    IN varname VARCHAR(30) DEFAULT NULL
)
BEGIN
    -- Esegui il corpo della procedura...
END //
DELIMITER ;

GO

-- CREAZIONE PROCEDURA compute_roles
DELIMITER //
CREATE PROCEDURE compute_roles(
    IN currdate DATE,
    IN idcustomuser VARCHAR(50)
)
BEGIN
    -- Esegui il corpo della procedura...
END //
DELIMITER ;

-- CREAZIONE TABELLA audit --
CREATE TABLE IF NOT EXISTS audit (
    idaudit VARCHAR(30) NOT NULL,
    consequence TEXT NULL,
    flagsystem CHAR(1) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    severity CHAR(1) NOT NULL,
    title VARCHAR(128) NOT NULL,
    PRIMARY KEY (idaudit)
);

-- Elimina i dati dalla tabella audit
DELETE FROM audit;

GO

-- CREAZIONE TABELLA auditparameter --
CREATE TABLE IF NOT EXISTS auditparameter (
    tablename VARCHAR(150) NOT NULL,
    opkind CHAR(1) NOT NULL,
    isprecheck CHAR(1) NOT NULL,
    parameterid SMALLINT NOT NULL,
    flagoldvalue CHAR(1) NULL,
    paramcolumn VARCHAR(150) NULL,
    paramtable VARCHAR(150) NULL,
    PRIMARY KEY (tablename, opkind, isprecheck, parameterid)
);

-- Elimina i dati dalla tabella auditparameter
DELETE FROM auditparameter;

GO
-- CREAZIONE TABELLA auditcheck --
CREATE TABLE IF NOT EXISTS auditcheck (
    tablename VARCHAR(150) NOT NULL,
    opkind CHAR(1) NOT NULL,
    idaudit VARCHAR(30) NOT NULL,
    idcheck SMALLINT NOT NULL,
    flag_both CHAR(1) NULL,
    flag_cash CHAR(1) NULL,
    flag_comp CHAR(1) NULL,
    flag_credit CHAR(1) NULL,
    flag_proceeds CHAR(1) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    message VARCHAR(1000) NULL,
    precheck CHAR(1) NULL,
    sqlcmd VARCHAR(6000) NULL,
    PRIMARY KEY (tablename, opkind, idaudit, idcheck)
);

-- Elimina i dati dalla tabella auditcheck
DELETE FROM auditcheck;

GO

-- CREAZIONE TABELLA web_listredir --
CREATE TABLE IF NOT EXISTS web_listredir (
    tablename VARCHAR(50) NOT NULL,
    listtype VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    newlisttype VARCHAR(50) NULL,
    newtablename VARCHAR(50) NULL,
    PRIMARY KEY (tablename, listtype)
);

-- Elimina i dati dalla tabella web_listredir
DELETE FROM web_listredir;

GO

-- CREAZIONE TABELLA customuser --
CREATE TABLE IF NOT EXISTS customuser (
    idcustomuser VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    username VARCHAR(50) NOT NULL,
    PRIMARY KEY (idcustomuser)
);

-- Elimina i dati dalla tabella customuser
DELETE FROM customuser;

GO

-- CREAZIONE TABELLA customgroup --
CREATE TABLE IF NOT EXISTS customgroup (
    idcustomgroup VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    description VARCHAR(200) NULL,
    groupname VARCHAR(80) NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    PRIMARY KEY (idcustomgroup)
);

-- Elimina i dati dalla tabella customgroup
DELETE FROM customgroup;

GO

-- CREAZIONE TABELLA customusergroup --
CREATE TABLE IF NOT EXISTS customusergroup (
    idcustomgroup VARCHAR(50) NOT NULL,
    idcustomuser VARCHAR(50) NOT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    PRIMARY KEY (idcustomgroup, idcustomuser)
);

-- Elimina i dati dalla tabella customusergroup
DELETE FROM customusergroup;

GO

-- CREAZIONE TABELLA customgroupoperation --
CREATE TABLE IF NOT EXISTS customgroupoperation (
    idgroup VARCHAR(50) NOT NULL,
    operation CHAR(1) NOT NULL,
    tablename VARCHAR(50) NOT NULL,
    allowcondition TEXT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    defaultisdeny CHAR(1) NOT NULL,
    denycondition TEXT NULL,
    lastmodtimestamp DATETIME NULL,
    lastmoduser VARCHAR(64) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    PRIMARY KEY (idgroup, operation, tablename)
);

-- Elimina i dati dalla tabella customgroupoperation
DELETE FROM customgroupoperation;

GO

-- CREAZIONE TABELLA flowchart --
CREATE TABLE IF NOT EXISTS flowchart (
    idflowchart VARCHAR(34) NOT NULL,
    address VARCHAR(100) NULL,
    ayear INT NULL,
    cap VARCHAR(20) NULL,
    codeflowchart VARCHAR(50) NOT NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    fax VARCHAR(75) NULL,
    idcity INT NULL,
    idsor1 INT NULL,
    idsor2 INT NULL,
    idsor3 INT NULL,
    location VARCHAR(50) NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    nlevel INT NOT NULL,
    paridflowchart VARCHAR(34) NOT NULL,
    phone VARCHAR(55) NULL,
    printingorder VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    PRIMARY KEY (idflowchart)
);

-- Elimina i dati dalla tabella flowchart
DELETE FROM flowchart;

GO

-- CREAZIONE TABELLA flowchartuser --
CREATE TABLE IF NOT EXISTS flowchartuser (
    idflowchart VARCHAR(34) NOT NULL,
    ndetail INT NOT NULL,
    idcustomuser VARCHAR(50) NOT NULL,
    all_sorkind01 CHAR(1) NULL,
    all_sorkind02 CHAR(1) NULL,
    all_sorkind03 CHAR(1) NULL,
    all_sorkind04 CHAR(1) NULL,
    all_sorkind05 CHAR(1) NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    flagdefault CHAR(1) NOT NULL,
    idsor01 INT NULL,
    idsor02 INT NULL,
    idsor03 INT NULL,
    idsor04 INT NULL,
    idsor05 INT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    sorkind01_withchilds CHAR(1) NULL,
    sorkind02_withchilds CHAR(1) NULL,
    sorkind03_withchilds CHAR(1) NULL,
    sorkind04_withchilds CHAR(1) NULL,
    sorkind05_withchilds CHAR(1) NULL,
    start DATE NULL,
    stop DATE NULL,
    title VARCHAR(150) NULL,
    PRIMARY KEY (idflowchart, ndetail, idcustomuser)
);

-- Elimina i dati dalla tabella flowchartuser
DELETE FROM flowchartuser;

GO

-- CREAZIONE TABELLA menu --
CREATE TABLE IF NOT EXISTS menu (
    idmenu INT NOT NULL,
    edittype VARCHAR(60) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    menucode VARCHAR(80) NULL,
    metadata VARCHAR(60) NULL,
    modal CHAR(1) NULL,
    ordernumber INT NULL,
    parameter VARCHAR(80) NULL,
    paridmenu INT NULL,
    title VARCHAR(80) NOT NULL,
    userid VARCHAR(80) NULL,
    PRIMARY KEY (idmenu)
);

-- Elimina i dati dalla tabella menu
DELETE FROM menu;

GO

-- Elimina i dati dalla tabella flowchartuser
DELETE FROM flowchartuser;

-- CREAZIONE TABELLA userenvironment --
CREATE TABLE IF NOT EXISTS userenvironment (
    idcustomuser VARCHAR(50) NOT NULL,
    variablename VARCHAR(50) NOT NULL,
    flagadmin CHAR(1) NULL,
    kind CHAR(1) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    value TEXT NULL,
    PRIMARY KEY (idcustomuser, variablename)
);

GO

-- CREAZIONE TABELLA flowchartrestrictedfunction --
CREATE TABLE IF NOT EXISTS flowchartrestrictedfunction (
    idflowchart VARCHAR(34) NOT NULL,
    idrestrictedfunction INT NOT NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    PRIMARY KEY (idflowchart, idrestrictedfunction)
);

GO

-- CREAZIONE TABELLA restrictedfunction --
CREATE TABLE IF NOT EXISTS restrictedfunction (
    idrestrictedfunction INT NOT NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    description VARCHAR(100) NOT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    variablename VARCHAR(50) NOT NULL,
    PRIMARY KEY (idrestrictedfunction)
);

-- Elimina i dati dalla tabella restrictedfunction
DELETE FROM restrictedfunction;
GO

-- CREAZIONE PROCEDURA compute_environment
DELIMITER //
CREATE PROCEDURE compute_environment(
    IN ayear INT,
    IN idcustomuser VARCHAR(50),
    IN idflowchart VARCHAR(34) DEFAULT NULL,
    IN ndetail INT DEFAULT NULL
)
BEGIN
    DECLARE noflowchart CHAR(1) DEFAULT 'N';

    IF (idflowchart IS NULL) THEN
        SELECT idflowchart, ndetail
        INTO idflowchart, ndetail
        FROM flowchart F
        JOIN flowchartuser FU ON F.idflowchart = FU.idflowchart
        WHERE FU.idcustomuser = idcustomuser
            AND (FU.start IS NULL OR FU.start <= NOW())
            AND (FU.stop IS NULL OR FU.stop >= NOW())
            AND F.ayear = ayear
        ORDER BY FU.flagdefault DESC;

        SELECT idflowchart, ndetail;
    END IF;

    IF (idflowchart IS NOT NULL AND ndetail IS NULL) THEN
        SELECT ndetail
        INTO ndetail
        FROM flowchart F
        JOIN flowchartuser FU ON F.idflowchart = idflowchart
        WHERE FU.idcustomuser = idcustomuser
            AND (FU.start IS NULL OR FU.start <= NOW())
            AND (FU.stop IS NULL OR FU.stop >= NOW())
            AND F.ayear = ayear
        ORDER BY FU.flagdefault DESC;

        SELECT idflowchart, ndetail;
    END IF;

    DECLARE codeflowchart VARCHAR(100);
    SELECT codeflowchart INTO codeflowchart FROM flowchart WHERE idflowchart = idflowchart;

    SELECT idflowchart, ndetail, codeflowchart;

    DECLARE allvar VARCHAR(30);
    SET allvar = NULL;

    DECLARE withchilds CHAR(1);
    SET withchilds = 'N';

    DECLARE all_value CHAR(1);
    SET all_value = 'N';

    DECLARE cond VARCHAR(1000);
    SET cond = '';

    DECLARE idvar VARCHAR(30);

    DECLARE idlist VARCHAR(MAX);
    SET idlist = '';

    CREATE TEMPORARY TABLE myouttable (
        variablename VARCHAR(200),
        kind CHAR(1),
        mustquote CHAR(1),
        value TEXT
    );

    -- Esegui il resto del codice...
END //
DELIMITER ;

GO

-- CREAZIONE PROCEDURA compute_allowform
DELIMITER //
CREATE PROCEDURE compute_allowform(
    IN ayear INT,
    IN iduser VARCHAR(10),
    IN idflowchart VARCHAR(34),
    IN varname VARCHAR(30) DEFAULT NULL
)
BEGIN
    -- Esegui il corpo della procedura...
END //
DELIMITER ;

GO

-- CREAZIONE PROCEDURA compute_notable
DELIMITER //
CREATE PROCEDURE compute_notable(
    IN ayear INT,
    IN iduser VARCHAR(10),
    IN idflowchart VARCHAR(34),
    IN varname VARCHAR(30) DEFAULT NULL
)
BEGIN
    -- Esegui il corpo della procedura...
END //
DELIMITER ;

-- CREAZIONE PROCEDURA compute_roles
DELIMITER //
CREATE PROCEDURE compute_roles(
    IN currdate DATE,
    IN idcustomuser VARCHAR(50)
)
BEGIN
    -- Esegui il corpo della procedura...
END //
DELIMITER ;

GO

-- CREAZIONE TABELLA audit --
CREATE TABLE IF NOT EXISTS audit (
    idaudit VARCHAR(30) NOT NULL,
    consequence TEXT NULL,
    flagsystem CHAR(1) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    severity CHAR(1) NOT NULL,
    title VARCHAR(128) NOT NULL,
    PRIMARY KEY (idaudit)
);

-- Elimina i dati dalla tabella audit
DELETE FROM audit;

GO

-- CREAZIONE TABELLA auditparameter --
CREATE TABLE IF NOT EXISTS auditparameter (
    tablename VARCHAR(150) NOT NULL,
    opkind CHAR(1) NOT NULL,
    isprecheck CHAR(1) NOT NULL,
    parameterid SMALLINT NOT NULL,
    flagoldvalue CHAR(1) NULL,
    paramcolumn VARCHAR(150) NULL,
    paramtable VARCHAR(150) NULL,
    PRIMARY KEY (tablename, opkind, isprecheck, parameterid)
);

-- Elimina i dati dalla tabella auditparameter
DELETE FROM auditparameter;

GO

-- CREAZIONE TABELLA auditcheck --
CREATE TABLE IF NOT EXISTS auditcheck (
    tablename VARCHAR(150) NOT NULL,
    opkind CHAR(1) NOT NULL,
    idaudit VARCHAR(30) NOT NULL,
    idcheck SMALLINT NOT NULL,
    flag_both CHAR(1) NULL,
    flag_cash CHAR(1) NULL,
    flag_comp CHAR(1) NULL,
    flag_credit CHAR(1) NULL,
    flag_proceeds CHAR(1) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    message VARCHAR(1000) NULL,
    precheck CHAR(1) NULL,
    sqlcmd VARCHAR(6000) NULL,
    PRIMARY KEY (tablename, opkind, idaudit, idcheck)
);

-- Elimina i dati dalla tabella auditcheck
DELETE FROM auditcheck;




GO

-- CREAZIONE TABELLA registryreference --
CREATE TABLE IF NOT EXISTS registryreference (
    idreg INT NOT NULL,
    idregistryreference INT NOT NULL,
    activeweb CHAR(1) NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    email VARCHAR(200) NULL,
    faxnumber VARCHAR(50) NULL,
    flagdefault CHAR(1) NULL,
    iterweb INT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    mobilenumber VARCHAR(20) NULL,
    msnnumber VARCHAR(50) NULL,
    passwordweb VARCHAR(40) NULL,
    pec VARCHAR(200) NULL,
    phonenumber VARCHAR(50) NULL,
    referencename VARCHAR(50) NOT NULL,
    registryreferencerole VARCHAR(50) NULL,
    rtf MEDIUMBLOB NULL,
    saltweb VARCHAR(20) NULL,
    skypenumber VARCHAR(50) NULL,
    txt TEXT NULL,
    userweb VARCHAR(40) NULL,
    website VARCHAR(512) NULL,
    PRIMARY KEY (idreg, idregistryreference)
);

-- Elimina i dati dalla tabella registryreference
DELETE FROM registryreference;
GO

-- CREAZIONE TABELLA registryaddress --
CREATE TABLE IF NOT EXISTS registryaddress (
    idreg INT NOT NULL,
    start DATE NOT NULL,
    idaddresskind INT NOT NULL,
    active CHAR(1) NULL,
    address VARCHAR(100) NULL,
    annotations VARCHAR(400) NULL,
    cap VARCHAR(20) NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    flagforeign CHAR(1) NULL,
    idcity INT NULL,
    idnation INT NULL,
    location VARCHAR(50) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    officename VARCHAR(50) NULL,
    recipientagency VARCHAR(50) NULL,
    stop DATE NULL,
    PRIMARY KEY (idreg, start, idaddresskind)
);

-- Elimina i dati dalla tabella registryaddress
DELETE FROM registryaddress;

GO

-- CREAZIONE TABELLA attach --
CREATE TABLE IF NOT EXISTS attach (
    idattach INT NOT NULL,
    attachment MEDIUMBLOB NULL,
    counter INT NULL,
    ct DATETIME NULL,
    cu VARCHAR(64) NULL,
    filename VARCHAR(512) NULL,
    hash VARCHAR(MAX) NULL,
    lt DATETIME NULL,
    lu VARCHAR(64) NULL,
    size BIGINT NULL,
    PRIMARY KEY (idattach)
);

-- Elimina i dati dalla tabella attach
DELETE FROM attach;

GO


--[DBO]--
-- CREAZIONE TABELLA menuweb --
CREATE TABLE IF NOT EXISTS menuweb (
    idmenuweb INT NOT NULL,
    editType NVARCHAR(60) NULL,
    idmenuwebparent INT NULL,
    label NVARCHAR(250) NOT NULL,
    link NVARCHAR(250) NULL,
    sort INT NULL,
    tableName NVARCHAR(60) NULL,
    PRIMARY KEY (idmenuweb)
);

-- Elimina i dati dalla tabella menuweb
DELETE FROM menuweb;

-- Inserisci dati nella tabella menuweb
INSERT INTO menuweb (idmenuweb, editType, idmenuwebparent, label, sort, tableName)
VALUES
    (2, NULL, 1, 'Livello 1', 1, NULL),
    (3, NULL, 2, 'Livello 2', 2, NULL),
    (4, 'edit_type', 3, 'Nome maschera', 1, 'tablenane');



-- Inserisci dati nella tabella web_listredir
INSERT INTO web_listredir (tablename, listtype, newtablename, newlisttype, ct, cu, lt, lu)
VALUES ('mandate', 'on_view', 'mandateview', 'default', NOW(), 'nino', NOW(), 'nino');

-- CREAZIONE TABELLA mandate
CREATE TABLE IF NOT EXISTS mandate (
    idmankind VARCHAR(20) NOT NULL,
    yman SMALLINT NOT NULL,
    nman INT NOT NULL,
    active CHAR(1) NULL,
    adate DATE NOT NULL,
    description VARCHAR(150) NOT NULL,
    idman INT NULL,
    idreg INT NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    rtf MEDIUMBLOB NULL,
    PRIMARY KEY (idmankind, yman, nman)
);

-- Elimina i dati dalla tabella mandate
DELETE FROM mandate;

GO


-- CREAZIONE TABELLA mandatekind
CREATE TABLE IF NOT EXISTS mandatekind (
    idmankind VARCHAR(20) NOT NULL,
    active CHAR(1) NULL,
    description VARCHAR(150) NOT NULL,
    header VARCHAR(150) NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    PRIMARY KEY (idmankind)
);

-- Elimina i dati dalla tabella mandatekind
DELETE FROM mandatekind;
GO

-- GENERAZIONE DATI PER mandatekind
INSERT INTO mandatekind (idmankind, active, ct, cu, description, header, lt, lu)
VALUES ('CICCIO-CP', 'S', NOW(), 'sa', 'Contratto Ciccio', 'BL0001', NOW(), 'assistenza'),
       ('CICCIO-CP_PCC', 'S', NOW(), 'sa', 'Contratto CP_PCC', 'BL0002', NOW(), 'assistenza'),
       ('CP_PCC', 'S', NOW(), 'assistenza', 'Documento equivalente di pagamento', '123456', NOW(), 'nino'),
       ('GENERALE', 'S', NOW(), 'sa', 'Tipo ordine GENERALE', 'Intestazione da mandatekind.', NOW(), 'assistenza'),
       ('GIURprova', 'S', NOW(), 'assistenza', 'GIUR - Convenzione passiva (Non soggetta ad IVA)', NULL, NOW(), 'assistenza'),
       ('NOFATT', 'S', NOW(), 'SARA', 'Contratto Passivo collegabile a Fattura', '86', NOW(), 'assistenza'),
       ('NOFATTURA', 'S', NOW(), 'SA', 'Contratto passivo SENZA FATTURA', '4', NOW(), 'sa'),
       ('PRIMO', 'S', NOW(), 'sa', 'Tipo ordine test', '3654', NOW(), 'nino'),
       ('PROVA', NULL, NOW(), 'NINO', 'prova', 'prova', NOW(), 'nino');

GO


-- CREAZIONE VISTA mandateview
CREATE VIEW mandateview AS
    SELECT mandate.*, mandatekind.description AS mandatekind
    FROM mandate
    JOIN mandatekind ON mandate.idmankind = mandatekind.idmankind;


GO

-- CREAZIONE TABELLA mandatedetail
CREATE TABLE IF NOT EXISTS DBO.mandatedetail (
    idmankind VARCHAR(20) NOT NULL,
    yman SMALLINT NOT NULL,
    nman INT NOT NULL,
    rownum INT NOT NULL,
    detaildescription VARCHAR(150) NULL,
    discount DOUBLE NULL,
    number DECIMAL(19,2) NULL,
    tax DECIMAL(19,2) NULL,
    taxable DECIMAL(19,5) NULL,
    taxrate DOUBLE NULL,
    ct DATETIME NOT NULL,
    cu VARCHAR(64) NOT NULL,
    lt DATETIME NOT NULL,
    lu VARCHAR(64) NOT NULL,
    PRIMARY KEY (idmankind, yman, nman, rownum)
);

-- Elimina i dati dalla tabella mandatedetail
DELETE FROM mandatedetail;





