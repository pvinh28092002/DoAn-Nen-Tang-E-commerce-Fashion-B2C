// src/routes/products.route.ts
import { Router } from "express";
import { handleGetActiveProducts, handleGetProductsAdmin, handleGetProductById, handleGetProductByIdAdmin, handleCreateProduct, handleUpdateProduct, handleGetVariantsByProductId, } from "../controllers/product.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/", handleGetActiveProducts);
router.get("/admin/all", authenticate, requireRole("ADMIN"), handleGetProductsAdmin);
router.get("/admin/:id", authenticate, requireRole("ADMIN"), handleGetProductByIdAdmin);
router.get("/:id/variants", handleGetVariantsByProductId);
router.get("/:id", handleGetProductById);
router.use(authenticate);
router.use(requireRole("ADMIN"));
router.post("/", handleCreateProduct);
router.put("/:id", handleUpdateProduct);
export default router;
//# sourceMappingURL=product.route.js.map