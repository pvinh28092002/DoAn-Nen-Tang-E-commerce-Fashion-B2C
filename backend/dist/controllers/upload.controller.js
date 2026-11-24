import { generateImageKitAuth } from "../services/imagekit.service.js";
export function handleGetImageKitAuth(req, res, next) {
    try {
        const authParams = generateImageKitAuth();
        res.status(200).json({
            success: true,
            data: authParams,
        });
    }
    catch (error) {
        next(error);
    }
}
//# sourceMappingURL=upload.controller.js.map