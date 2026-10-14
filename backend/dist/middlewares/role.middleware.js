import { AppError } from "../errors/app-error.js";
export function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            next(new AppError(401, "Authentication required"));
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            next(new AppError(403, "You do not have permission to access this resource"));
            return;
        }
        next();
    };
}
//# sourceMappingURL=role.middleware.js.map