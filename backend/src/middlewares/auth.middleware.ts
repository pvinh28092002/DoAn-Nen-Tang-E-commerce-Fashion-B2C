import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { AppError } from "../errors/app-error.js";

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const token = req.cookies.token;
    if (!token) {
      next(new AppError(401, "Authentication required"));
      return;
    }

    const payload = verifyToken(token);
    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }

    next(new AppError(401, "Invalid or expired token"));
  }
}
