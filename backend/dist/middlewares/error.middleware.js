import { AppError } from "../errors/app-error.js";
export function errorMiddleware(err, req, res, next) {
    console.error(err);
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: "Internal server error.",
    });
}
//# sourceMappingURL=error.middleware.js.map