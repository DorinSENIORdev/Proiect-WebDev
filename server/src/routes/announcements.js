import express from "express";
import { isAnnouncementLikesEnabled } from "../bootstrap.js";
import { getPool, sql } from "../db.js";
import { optionalAuth } from "../middleware/optionalAuth.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

function getAuthenticatedUserId(req) {
  const userId = Number(req.user?.sub);
  return Number.isInteger(userId) ? userId : null;
}

async function fetchAnnouncements({ category = "", q = "", viewerId = null } = {}) {
  const pool = await getPool();
  const request = pool.request();
  const filters = [];

  let query = "";

  if (isAnnouncementLikesEnabled()) {
    request.input("viewerId", sql.Int, viewerId);
    query = `
      SELECT
        a.id,
        a.title,
        CONVERT(varchar(32), a.price) AS price,
        a.category,
        a.location,
        a.contact,
        a.description,
        a.imageUrl,
        a.createdAt,
        a.userId,
        u.name AS ownerName,
        COUNT(al.id) AS likeCount,
        CAST(MAX(CASE WHEN viewerLike.userId IS NULL THEN 0 ELSE 1 END) AS bit) AS isLiked
      FROM dbo.Announcements a
      INNER JOIN dbo.Users u ON u.id = a.userId
      LEFT JOIN dbo.AnnouncementLikes al ON al.announcementId = a.id
      LEFT JOIN dbo.AnnouncementLikes viewerLike
        ON viewerLike.announcementId = a.id
        AND viewerLike.userId = @viewerId
    `;
  } else {
    query = `
      SELECT
        a.id,
        a.title,
        CONVERT(varchar(32), a.price) AS price,
        a.category,
        a.location,
        a.contact,
        a.description,
        a.imageUrl,
        a.createdAt,
        a.userId,
        u.name AS ownerName,
        CAST(0 AS int) AS likeCount,
        CAST(0 AS bit) AS isLiked
      FROM dbo.Announcements a
      INNER JOIN dbo.Users u ON u.id = a.userId
    `;
  }

  if (category) {
    filters.push("a.category = @category");
    request.input("category", sql.NVarChar(120), category);
  }

  if (q) {
    filters.push("(a.title LIKE @query OR a.location LIKE @query OR a.description LIKE @query)");
    request.input("query", sql.NVarChar(260), `%${q}%`);
  }

  if (filters.length > 0) {
    query += ` WHERE ${filters.join(" AND ")}`;
  }

  if (isAnnouncementLikesEnabled()) {
    query += `
      GROUP BY
        a.id,
        a.title,
        a.price,
        a.category,
        a.location,
        a.contact,
        a.description,
        a.imageUrl,
        a.createdAt,
        a.userId,
        u.name
      ORDER BY a.createdAt DESC;
    `;
  } else {
    query += " ORDER BY a.createdAt DESC;";
  }

  const result = await request.query(query);
  return result.recordset;
}

router.get("/", optionalAuth, async (req, res, next) => {
  try {
    const category = String(req.query.category ?? "").trim();
    const q = String(req.query.q ?? "").trim();
    const viewerId = getAuthenticatedUserId(req);
    const items = await fetchAnnouncements({ category, q, viewerId });

    return res.json(items);
  } catch (error) {
    return next(error);
  }
});

router.get("/notifications", requireAuth, async (req, res, next) => {
  try {
    if (!isAnnouncementLikesEnabled()) {
      return res.json([]);
    }

    const userId = getAuthenticatedUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Token invalid." });
    }

    const pool = await getPool();
    const result = await pool.request().input("userId", sql.Int, userId).query(`
      SELECT
        al.id,
        al.createdAt,
        liker.id AS likerId,
        liker.name AS likerName,
        a.id AS announcementId,
        a.title AS announcementTitle,
        a.category,
        a.location
      FROM dbo.AnnouncementLikes al
      INNER JOIN dbo.Announcements a ON a.id = al.announcementId
      INNER JOIN dbo.Users liker ON liker.id = al.userId
      WHERE a.userId = @userId AND al.userId <> @userId
      ORDER BY al.createdAt DESC;
    `);

    return res.json(result.recordset);
  } catch (error) {
    return next(error);
  }
});

router.post("/:id/likes", requireAuth, async (req, res, next) => {
  try {
    if (!isAnnouncementLikesEnabled()) {
      return res.status(503).json({
        message: "Like-urile nu sunt disponibile pana cand tabela AnnouncementLikes este creata.",
      });
    }

    const userId = getAuthenticatedUserId(req);
    const announcementId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Token invalid." });
    }

    if (!Number.isInteger(announcementId)) {
      return res.status(400).json({ message: "Anunt invalid." });
    }

    const pool = await getPool();
    const ownerResult = await pool.request().input("id", sql.Int, announcementId).query(`
      SELECT TOP 1 userId
      FROM dbo.Announcements
      WHERE id = @id;
    `);

    const announcement = ownerResult.recordset[0];
    if (!announcement) {
      return res.status(404).json({ message: "Anuntul nu exista." });
    }

    if (announcement.userId === userId) {
      return res.status(400).json({ message: "Nu poti da like propriului anunt." });
    }

    await pool
      .request()
      .input("announcementId", sql.Int, announcementId)
      .input("userId", sql.Int, userId)
      .query(`
        IF NOT EXISTS (
          SELECT 1
          FROM dbo.AnnouncementLikes
          WHERE announcementId = @announcementId AND userId = @userId
        )
        BEGIN
          INSERT INTO dbo.AnnouncementLikes (announcementId, userId)
          VALUES (@announcementId, @userId);
        END;
      `);

    return res.json({ announcementId, isLiked: true });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id/likes", requireAuth, async (req, res, next) => {
  try {
    if (!isAnnouncementLikesEnabled()) {
      return res.status(503).json({
        message: "Like-urile nu sunt disponibile pana cand tabela AnnouncementLikes este creata.",
      });
    }

    const userId = getAuthenticatedUserId(req);
    const announcementId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ message: "Token invalid." });
    }

    if (!Number.isInteger(announcementId)) {
      return res.status(400).json({ message: "Anunt invalid." });
    }

    const pool = await getPool();
    await pool
      .request()
      .input("announcementId", sql.Int, announcementId)
      .input("userId", sql.Int, userId)
      .query(`
        DELETE FROM dbo.AnnouncementLikes
        WHERE announcementId = @announcementId AND userId = @userId;
      `);

    return res.json({ announcementId, isLiked: false });
  } catch (error) {
    return next(error);
  }
});

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const userId = Number(req.user?.sub);
    const title = String(req.body?.title ?? "").trim();
    const category = String(req.body?.category ?? "").trim();
    const priceRaw = String(req.body?.price ?? "0").trim();
    const location = String(req.body?.location ?? "").trim() || "Nespecificat";
    const contact = String(req.body?.contact ?? "").trim() || "Anonim";
    const description = String(req.body?.description ?? "").trim() || "Fara descriere.";
    const imageUrl = String(req.body?.imageUrl ?? "").trim();

    if (!Number.isInteger(userId)) {
      return res.status(401).json({ message: "Token invalid." });
    }

    if (!title || !category) {
      return res.status(400).json({ message: "Titlul si categoria sunt obligatorii." });
    }

    if (imageUrl.length > 2_000_000) {
      return res.status(400).json({ message: "Imaginea este prea mare." });
    }

    const parsedPrice = Number(priceRaw.replace(",", "."));
    const price = Number.isFinite(parsedPrice) ? parsedPrice : 0;

    const pool = await getPool();
    const result = await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("title", sql.NVarChar(180), title)
      .input("price", sql.Decimal(12, 2), price)
      .input("category", sql.NVarChar(120), category)
      .input("location", sql.NVarChar(120), location)
      .input("contact", sql.NVarChar(120), contact)
      .input("description", sql.NVarChar(sql.MAX), description)
      .input("imageUrl", sql.NVarChar(sql.MAX), imageUrl || null)
      .query(`
        INSERT INTO dbo.Announcements (
          userId, title, price, category, location, contact, description, imageUrl
        )
        OUTPUT
          inserted.id,
          inserted.title,
          CONVERT(varchar(32), inserted.price) AS price,
          inserted.category,
          inserted.location,
          inserted.contact,
          inserted.description,
          inserted.imageUrl,
          inserted.createdAt,
          inserted.userId
        VALUES (
          @userId, @title, @price, @category, @location, @contact, @description, @imageUrl
        );
      `);

    return res.status(201).json({
      ...result.recordset[0],
      ownerName: req.user?.name ?? "Contul meu",
      likeCount: 0,
      isLiked: false,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
