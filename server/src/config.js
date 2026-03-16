import dotenv from "dotenv";

dotenv.config();

function readBool(value, defaultValue) {
  if (typeof value === "undefined") {
    return defaultValue;
  }
  return String(value).toLowerCase() === "true";
}

const dbOptions = {
  encrypt: readBool(process.env.DB_ENCRYPT, true),
  trustServerCertificate: readBool(process.env.DB_TRUST_SERVER_CERTIFICATE, true),
};


if (process.env.DB_INSTANCE && !process.env.DB_PORT) {
  dbOptions.instanceName = process.env.DB_INSTANCE;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET ?? "dev_secret_change_me",
  db: {
    server: process.env.DB_SERVER ?? "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    database: process.env.DB_DATABASE ?? "EasySell",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: dbOptions,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  },
};
