// src/routes/products.route.ts
import { Router } from "express";
import { handleGetActiveProducts, handleGetProductsAdmin, handleGetProductById, handleGetProductByIdAdmin, handleCreateProduct, handleUpdateProduct, handleGetVariantsByProductId, } from "../controllers/product.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/", handleGetActiveProducts);
router.get("/:id/variants", handleGetVariantsByProductId);
router.get("/:id", handleGetProductById);
router.use(authenticate);
router.use(requireRole("ADMIN"));
router.get("/admin/all", handleGetProductsAdmin);
router.get("/admin/:id", handleGetProductByIdAdmin);
router.post("/", handleCreateProduct);
router.put("/:id", handleUpdateProduct);
export default router;
//# sourceMappingURL=product.route.js.map