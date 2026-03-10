USE [master];
GO

IF NOT EXISTS (SELECT 1 FROM sys.sql_logins WHERE [name] = N'easysell_user')
BEGIN
  CREATE LOGIN [easysell_user]
    WITH PASSWORD = N'Usarb1234',
         CHECK_POLICY = ON,
         CHECK_EXPIRATION = OFF;
END;
GO

USE [EasySell];
GO

IF NOT EXISTS (SELECT 1 FROM sys.database_principals WHERE [name] = N'easysell_user')
BEGIN
  CREATE USER [easysell_user] FOR LOGIN [easysell_user];
END;
GO

ALTER ROLE db_datareader ADD MEMBER [easysell_user];
ALTER ROLE db_datawriter ADD MEMBER [easysell_user];
GO
