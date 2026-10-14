// src/routes/product-variant.route.ts
import { Router } from "express";
import {
  handleGetVariantById,
  handleGetVariantsBySku,
  handleCreateVariant,
  handleUpdateVariant,
  handleDeleteVariant,
} from "../controllers/product-variant.controller.js";

const router = Router();
router.get("/sku/:sku", handleGetVariantsBySku);
router.get("/:id", handleGetVariantById);
router.post("/", handleCreateVariant);
router.put("/:id", handleUpdateVariant);
router.delete("/:id", handleDeleteVariant);
export default router;
