import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { getPool, sql } from "../db.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
    },
    config.jwtSecret,
    { expiresIn: "7d" }
  );
}

router.post("/register", async (req, res, next) => {
  try {
    const name = String(req.body?.name ?? "").trim();
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Completeaza toate campurile." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Parola trebuie sa aiba minim 6 caractere." });
    }

    const pool = await getPool();
    const existing = await pool
      .request()
      .input("email", sql.NVarChar(320), email)
      .query("SELECT TOP 1 id FROM dbo.Users WHERE email = @email;");

    if (existing.recordset.length > 0) {
      return res.status(409).json({ message: "Exista deja un cont cu acest email." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const inserted = await pool
      .request()
      .input("name", sql.NVarChar(120), name)
      .input("email", sql.NVarChar(320), email)
      .input("passwordHash", sql.NVarChar(255), passwordHash)
      .query(`
        INSERT INTO dbo.Users (name, email, passwordHash)
        OUTPUT inserted.id, inserted.name, inserted.email
        VALUES (@name, @email, @passwordHash);
      `);

    const user = inserted.recordset[0];
    const token = createToken(user);

    return res.status(201).json({
      token,
      user,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email si parola sunt obligatorii." });
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("email", sql.NVarChar(320), email)
      .query(`
        SELECT TOP 1 id, name, email, passwordHash
        FROM dbo.Users
        WHERE email = @email;
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(401).json({ message: "Date invalide." });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Date invalide." });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = Number(req.user?.sub);
    if (!Number.isInteger(userId)) {
      return res.status(401).json({ message: "Token invalid." });
    }

    const pool = await getPool();
    const result = await pool
      .request()
      .input("id", sql.Int, userId)
      .query("SELECT id, name, email FROM dbo.Users WHERE id = @id;");

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu exista." });
    }

    return res.json(user);
  } catch (error) {
    return next(error);
  }
});

export default router;
