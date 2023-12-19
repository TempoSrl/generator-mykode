-- Impostazione dell'opzione NOCOUNT --
SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
SET time_zone = '+00:00';



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

-- Cancella i dati dalla tabella web_listredir --
DELETE FROM web_listredir;

-- Inserisce dati nella tabella web_listredir --
INSERT INTO web_listredir (tablename, listtype, newtablename, newlisttype, ct, cu, lt, lu)
VALUES ('mandate', 'on_view', 'mandateview', 'default', NOW(), 'nino', NOW(), 'nino');

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

-- Cancella i dati dalla tabella customuser --
DELETE FROM customuser;



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

-- Cancella i dati dalla tabella flowchart --
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

GO


-- Cancella i dati dalla tabella flowchartuser --
DELETE FROM flowchartuser;

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

-- Cancella i dati dalla tabella menu --
DELETE FROM menu;

GO


-- Cancella i dati dalla tabella flowchartuser --
DELETE FROM flowchartuser;

GO

delete from customgroup;

GO

delete from customusergroup;


-- FINE GENERAZIONE SCRIPT --
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
CREATE TABLE  IF NOT EXISTS  sp_tmp_output (
	id char(36) null,
    tablename VARCHAR(100) NULL,
    edit_type varchar(100) NULL
);



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

GO

DROP PROCEDURE IF EXISTS compute_allowform;


DELIMITER //
CREATE PROCEDURE `compute_allowform` (
    IN ayear INT,
    IN iduser VARCHAR(10),
    IN idflowchart VARCHAR(34),
    IN varname VARCHAR(30),
    IN guid char(36)
)
sp_exit:
BEGIN
    DECLARE tablename VARCHAR(100);

    CREATE TEMPORARY TABLE outtable (
        tablename VARCHAR(100)
    );

    IF (idflowchart IS NULL) THEN
        INSERT INTO outtable
        SELECT metadata
        FROM menu
        WHERE metadata IS NOT NULL;

        SELECT tablename FROM outtable WHERE tablename <> 'no_table';

        if guid is not null then
          insert into sp_tmp_output(id,tablename) select guid, tablename from outtable ORDER BY tablename;
        end if;

        DROP TEMPORARY TABLE IF EXISTS outtable;

        LEAVE sp_exit;
    end if;

	-- example:
    -- INSERT INTO outtable VALUES ('resultparameter');
    -- INSERT INTO outtable VALUES ('export');

	-- ... custom code ...


    IF ((SELECT COUNT(*) FROM outtable) > 0) THEN
		if guid is not null then
          insert into sp_tmp_output(id,tablename) select guid, tablename from outtable ORDER BY tablename;
        end if;

        SELECT DISTINCT tablename FROM outtable WHERE tablename <> 'no_table' ORDER BY tablename;
        DROP TEMPORARY TABLE IF EXISTS outtable;
        LEAVE sp_exit;
    END IF;

    INSERT INTO outtable VALUES ('dummy');

     if guid is not null then
          insert into sp_tmp_output(id,tablename) select guid, tablename from outtable ORDER BY tablename;
     end if;

    SELECT DISTINCT tablename FROM outtable ORDER BY tablename;
    DROP TEMPORARY TABLE IF EXISTS outtable;


END //
DELIMITER ;

GO

DELIMITER //

CREATE PROCEDURE compute_notable (
    IN ayear INT,
    IN iduser VARCHAR(10),
    IN idflowchart VARCHAR(34),
    IN varname VARCHAR(30),
    IN guid char(36)
)
sp_exit: BEGIN
    DECLARE exit_proc BOOLEAN DEFAULT FALSE;

    CREATE TEMPORARY TABLE outtable (
        edittype VARCHAR(100)
    );

    IF (idflowchart IS NULL) THEN
        INSERT INTO outtable
        SELECT DISTINCT edittype
        FROM menu
        WHERE metadata = 'no_table';

		if guid is not null then
          insert into sp_tmp_output(id,edit_type) select guid, edittype from outtable ORDER BY edittype;
        end if;

        SELECT edittype FROM outtable;
        DROP TEMPORARY TABLE IF EXISTS outtable;
        leave sp_exit; -- Uscire immediatamente dalla stored procedure
    END IF;

	-- ... custom code ...


    IF ((SELECT COUNT(*) FROM outtable) > 0) THEN
		if guid is not null then
          insert into sp_tmp_output(id,edit_type) select guid, edittype from outtable ORDER BY edittype;
        end if;

        SELECT DISTINCT edittype FROM outtable ORDER BY edittype;
        DROP TEMPORARY TABLE IF EXISTS outtable;
        leave sp_exit; -- Uscire immediatamente dalla stored procedure
    END IF;

    INSERT INTO outtable VALUES ('dummy');

    if guid is not null then
          insert into sp_tmp_output(id,edit_type) select guid, edittype from outtable ORDER BY edittype;
	end if;
    SELECT edittype FROM outtable ORDER BY edittype;
    DROP TEMPORARY TABLE IF EXISTS outtable;
END //

DELIMITER ;

GO

DROP PROCEDURE IF EXISTS compute_environment;

DELIMITER //
CREATE PROCEDURE compute_environment(
    IN ayear INT,
    IN idcustomuser VARCHAR(50),
    IN idflowchart VARCHAR(34) ,
    IN ndetail INT
)
sp_exit: BEGIN
    DECLARE noflowchart CHAR(1);
    DECLARE codeflowchart VARCHAR(100);
	DECLARE my_uuid CHAR(36);
    DECLARE allvar VARCHAR(30);
    DECLARE withchilds CHAR(1);
    DECLARE all_value CHAR(1);
    DECLARE cond VARCHAR(1000);
    DECLARE idvar VARCHAR(30);
    DECLARE idlist VARCHAR(4000);


    IF (idflowchart IS NULL) THEN
        SELECT FU.idflowchart, FU.ndetail INTO idflowchart, ndetail
        FROM flowchart F
        JOIN flowchartuser FU ON F.idflowchart = FU.idflowchart
        WHERE FU.idcustomuser = idcustomuser AND
            (FU.start IS NULL OR FU.start <= CURDATE()) AND
            (FU.stop IS NULL OR FU.stop >= CURDATE()) AND
            (F.ayear = ayear)
        ORDER BY FU.flagdefault DESC;
    END IF;


    IF (idflowchart IS NOT NULL AND ndetail IS NULL) THEN
        SELECT FU.ndetail INTO ndetail
        FROM flowchart F
        JOIN flowchartuser FU ON F.idflowchart = idflowchart
        WHERE FU.idcustomuser = idcustomuser AND
            (FU.start IS NULL OR FU.start <= CURDATE()) AND
            (FU.stop IS NULL OR FU.stop >= CURDATE()) AND
            (F.ayear = ayear)
        ORDER BY FU.flagdefault DESC;
    END IF;


    SELECT codeflowchart INTO codeflowchart FROM flowchart WHERE idflowchart = idflowchart;


    SET allvar = NULL;
    SET withchilds = 'N';
    SET all_value = 'N';
    SET cond = '';
    SET idlist = '';

    CREATE TEMPORARY TABLE myouttable (
        variablename VARCHAR(200),
        kind CHAR(1),
        mustquote CHAR(1),
        value TEXT
    );

    SET noflowchart = 'N';

    IF (ndetail IS NULL OR ndetail = 0) THEN
        SET noflowchart = 'S';
        SELECT 'il flowchart non esiste' AS message;
    END IF;

    IF (noflowchart = 'S') THEN
        SELECT * FROM myouttable;
        DROP TEMPORARY TABLE myouttable;
        LEAVE sp_exit;
    END IF;

    INSERT INTO myouttable (variablename, kind, value)
        SELECT variablename, kind, value
        FROM userenvironment
        WHERE idcustomuser = idcustomuser AND kind = 'K';
    -- le costanti sono già a posto (kind=K)

    -- kind=S sono le stored procedures, distinguiamo le compute_set dalla compute_set_withndet
    INSERT INTO myouttable (variablename, kind, value, mustquote)
    SELECT
        variablename,
        kind,
        CASE
            WHEN EXISTS (
                SELECT *
                FROM flowchartrestrictedfunction FF
                JOIN restrictedfunction RF ON RF.idrestrictedfunction = FF.idrestrictedfunction
                WHERE FF.idflowchart = idflowchart AND RF.variablename = userenvironment.variablename
            ) THEN 'S'
            ELSE 'N'
        END AS mustquote
    FROM userenvironment
    WHERE idcustomuser = idcustomuser AND kind = 'S' AND value LIKE 'compute_set';

    -- Fare gestione idsor01-05
    SET @allvar = NULL;
    SET @all_value = 'N';
    SET @withchilds = 'N';

    CREATE TEMPORARY TABLE tab_allowform (tablename VARCHAR(100));

	select tempID = UUID();
    call compute_allowform (@ayear, @idcustomuser,@idflowchart, 'menu', tempID);
    insert into tab_allowform(tablename) select tablename from sp_tmp_output where id = tempID;
    delete from sp_tmp_output where id=tempID;
    -- INSERT INTO tab_allowform  EXEC compute_allowform(@ayear, @idcustomuser, @idflowchart, 'menu');

    -- menu  compute_allowform
    SET @idlist = '';
    SELECT GROUP_CONCAT(QUOTE(tablename)) INTO @idlist FROM tab_allowform;
    -- SELECT @idlist := CONCAT(@idlist, ',', QUOTE(tablename))  FROM tab_allowform;

    INSERT INTO myouttable (variablename, kind, value, mustquote) VALUES ('menu', 'S', SUBSTRING(@idlist, 2), 'N');
    DROP TEMPORARY TABLE tab_allowform;

    -- Notable compute_notable
    SET @idlist = '';
    CREATE TEMPORARY TABLE tab_notable (edittype VARCHAR(100));
    call compute_notable(@ayear, @idcustomuser, @idflowchart, 'notable', tempID);
    insert into tab_notable(edittype) select edittype from sp_tmp_output where id = tempID;
    delete from sp_tmp_output where id=tempID;

    -- SELECT @idlist := CONCAT(@idlist, ',', QUOTE(edittype))  FROM tab_notable;
	SELECT GROUP_CONCAT(QUOTE(edittype)) INTO @idlist FROM tab_notable;
    INSERT INTO myouttable (variablename, kind, value, mustquote)VALUES ('notable', 'S', SUBSTRING(@idlist, 2), 'N');
    DROP TEMPORARY TABLE tab_notable;

    SELECT * FROM myouttable;

    DROP TEMPORARY TABLE myouttable;


END //
DELIMITER ;
