import jwt from "jsonwebtoken";
import { config } from "../config.js";

export function optionalAuth(req, _res, next) {
  const authHeader = req.headers.authorization ?? "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next();
  }

  try {
    req.user = jwt.verify(token, config.jwtSecret);
  } catch (_error) {
    req.user = null;
  }

  return next();
}
