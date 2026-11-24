// src/routes/product-variant.route.ts
import { Router } from "express";
import { handleGetVariantById, handleGetVariantsBySku, handleCreateVariant, handleUpdateVariant, } from "../controllers/product-variant.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/sku/:sku", handleGetVariantsBySku);
router.get("/:id", handleGetVariantById);
router.use(authenticate);
router.use(requireRole("ADMIN"));
router.post("/", handleCreateVariant);
router.put("/:id", handleUpdateVariant);
export default router;
//# sourceMappingURL=product-variant.route.js.map