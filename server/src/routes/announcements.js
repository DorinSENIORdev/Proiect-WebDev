import express from "express";
import { getPool, sql } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const category = String(req.query.category ?? "").trim();
    const q = String(req.query.q ?? "").trim();

    const pool = await getPool();
    const request = pool.request();
    const filters = [];

    let query = `
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
        u.name AS ownerName
      FROM dbo.Announcements a
      INNER JOIN dbo.Users u ON u.id = a.userId
    `;

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

    query += " ORDER BY a.createdAt DESC;";

    const result = await request.query(query);
    return res.json(result.recordset);
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

    return res.status(201).json(result.recordset[0]);
  } catch (error) {
    return next(error);
  }
});

export default router;
