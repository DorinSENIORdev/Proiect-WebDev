import cors from "cors";
import express from "express";
import { ensureSchema } from "./bootstrap.js";
import authRoutes from "./routes/auth.js";
import announcementRoutes from "./routes/announcements.js";
import { config } from "./config.js";
import { getPool } from "./db.js";

const app = express();
const localDevOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/;

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (origin === config.clientOrigin || localDevOriginPattern.test(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json({ limit: "3mb" }));

app.get("/api/health", async (_req, res) => {
  try {
    const pool = await getPool();
    await pool.request().query("SELECT 1 AS ok;");
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/announcements", announcementRoutes);

app.use((error, _req, res, _next) => {
  console.error(error);
  return res.status(500).json({ message: "Eroare interna pe server." });
});

async function startServer() {
  await ensureSchema();

  app.listen(config.port, () => {
    console.log(`API server running on http://localhost:${config.port}`);
  });
}

startServer().catch((error) => {
  console.error("Server startup failed:", error);
  process.exit(1);
});
