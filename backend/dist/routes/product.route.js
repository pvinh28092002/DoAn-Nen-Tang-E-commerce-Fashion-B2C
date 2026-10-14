// src/routes/product.route.ts
import { Router } from "express";
import { handleGetProducts, handleGetProductById, handleCreateProduct, handleUpdateProduct, handleDeleteProduct, handleGetVariantsByProductId, } from "../controllers/product.controller.js";
const router = Router();
router.get("/", handleGetProducts);
router.get("/:id/variants", handleGetVariantsByProductId);
router.get("/:id", handleGetProductById);
router.post("/", handleCreateProduct);
router.put("/:id", handleUpdateProduct);
router.delete("/:id", handleDeleteProduct);
export default router;
//# sourceMappingURL=product.route.js.map