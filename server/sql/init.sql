IF DB_ID(N'EasySell') IS NULL
BEGIN
  CREATE DATABASE [EasySell];
END;
GO

USE [EasySell];
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Users (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    name NVARCHAR(120) NOT NULL,
    email NVARCHAR(320) NOT NULL,
    passwordHash NVARCHAR(255) NOT NULL,
    createdAt DATETIME2(0) NOT NULL CONSTRAINT DF_Users_CreatedAt DEFAULT SYSUTCDATETIME()
  );

  CREATE UNIQUE INDEX UX_Users_Email ON dbo.Users(email);
END;
GO

IF OBJECT_ID(N'dbo.Announcements', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.Announcements (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    userId INT NOT NULL,
    title NVARCHAR(180) NOT NULL,
    price DECIMAL(12, 2) NOT NULL CONSTRAINT DF_Announcements_Price DEFAULT 0,
    category NVARCHAR(120) NOT NULL,
    location NVARCHAR(120) NOT NULL,
    contact NVARCHAR(120) NOT NULL,
    description NVARCHAR(MAX) NOT NULL,
    imageUrl NVARCHAR(MAX) NULL,
    createdAt DATETIME2(0) NOT NULL CONSTRAINT DF_Announcements_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Announcements_Users FOREIGN KEY (userId) REFERENCES dbo.Users(id) ON DELETE CASCADE
  );

  CREATE INDEX IX_Announcements_Category ON dbo.Announcements(category);
  CREATE INDEX IX_Announcements_CreatedAt ON dbo.Announcements(createdAt DESC);
END;
GO

IF OBJECT_ID(N'dbo.AnnouncementLikes', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.AnnouncementLikes (
    id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    announcementId INT NOT NULL,
    userId INT NOT NULL,
    createdAt DATETIME2(0) NOT NULL CONSTRAINT DF_AnnouncementLikes_CreatedAt DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_AnnouncementLikes_Announcements
      FOREIGN KEY (announcementId) REFERENCES dbo.Announcements(id) ON DELETE CASCADE,
    CONSTRAINT FK_AnnouncementLikes_Users
      FOREIGN KEY (userId) REFERENCES dbo.Users(id)
  );

  CREATE UNIQUE INDEX UX_AnnouncementLikes_AnnouncementUser
    ON dbo.AnnouncementLikes(announcementId, userId);
  CREATE INDEX IX_AnnouncementLikes_UserId
    ON dbo.AnnouncementLikes(userId, createdAt DESC);
  CREATE INDEX IX_AnnouncementLikes_AnnouncementId
    ON dbo.AnnouncementLikes(announcementId, createdAt DESC);
END;
GO
