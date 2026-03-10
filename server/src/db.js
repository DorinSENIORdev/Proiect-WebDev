import sql from "mssql";
import { config } from "./config.js";

let poolPromise;

export async function getPool() {
  if (!config.db.user || !config.db.password) {
    throw new Error("Config lipsa: seteaza DB_USER si DB_PASSWORD in server/.env.");
  }

  if (!poolPromise) {
    poolPromise = sql.connect(config.db).catch((error) => {
      poolPromise = undefined;
      throw error;
    });
  }
  return poolPromise;
}

export { sql };
