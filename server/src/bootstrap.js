import { getPool } from "./db.js";

let announcementLikesEnabled = false;

export function isAnnouncementLikesEnabled() {
  return announcementLikesEnabled;
}

export async function ensureSchema() {
  const pool = await getPool();
  const existingTable = await pool.request().query(`
    SELECT OBJECT_ID(N'dbo.AnnouncementLikes', N'U') AS tableId;
  `);

  if (existingTable.recordset[0]?.tableId) {
    announcementLikesEnabled = true;
    return;
  }

  try {
    await pool.request().query(`
      CREATE TABLE dbo.AnnouncementLikes (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        announcementId INT NOT NULL,
        userId INT NOT NULL,
        createdAt DATETIME2(0) NOT NULL
          CONSTRAINT DF_AnnouncementLikes_CreatedAt DEFAULT SYSUTCDATETIME(),
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
    `);

    announcementLikesEnabled = true;
  } catch (error) {
    if (error?.number === 262) {
      announcementLikesEnabled = false;
      console.warn(
        "AnnouncementLikes table is missing and could not be created with the current DB user. Likes and notifications are disabled until the migration is applied manually."
      );
      return;
    }

    throw error;
  }
}
