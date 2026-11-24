import { Router } from "express";
import { handleGetImageKitAuth } from "../controllers/upload.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
const router = Router();
router.use(authenticate);
router.use(requireRole("ADMIN"));
router.get("/imagekit-auth", handleGetImageKitAuth);
export default router;
//# sourceMappingURL=upload.route.js.map