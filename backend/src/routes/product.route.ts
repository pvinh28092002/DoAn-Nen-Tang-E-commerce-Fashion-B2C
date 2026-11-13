// src/routes/products.route.ts
import { Router } from "express";
import {
  handleGetProducts,
  handleGetProductById,
  handleCreateProduct,
  handleUpdateProduct,
  handleDeleteProduct,
  handleGetVariantsByProductId,
} from "../controllers/product.controller.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", handleGetProducts);
router.get("/:id/variants", handleGetVariantsByProductId);
router.get("/:id", handleGetProductById);

router.use(requireRole("ADMIN"));
router.post("/", handleCreateProduct);
router.put("/:id", handleUpdateProduct);
router.delete("/:id", handleDeleteProduct);

export default router;
