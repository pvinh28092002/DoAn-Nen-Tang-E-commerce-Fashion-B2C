import jwt from "jsonwebtoken";
import { UserRole } from "../generated/prisma/browser.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in .env");
}

export interface TokenPayload {
  sub: string;
  role: UserRole;
}

export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ??
      "15m") as jwt.SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload {
  // Throws if the signature is wrong OR the token is expired
  return jwt.verify(token, JWT_SECRET!) as TokenPayload;
}
