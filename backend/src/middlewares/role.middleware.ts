import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app-error.js";
import { UserRole } from "../generated/prisma/enums.js";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, "Authentication required"));
      return;
    }
    if (!allowedRoles.includes(req.user.role)) {
      next(
        new AppError(403, "You do not have permission to access this resource"),
      );
      return;
    }

    next();
  };
}
