// src/routes/category.route.ts
import { Router } from "express";
import { handleCreateCategory, handleGetCategories, handleGetCategoryTree, handleUpdateCategory, handleGetCategoryById, handleDeleteCategory, } from "../controllers/category.controller.js";
const router = Router();
router.get("/", handleGetCategories);
router.get("/tree", handleGetCategoryTree);
router.get("/:id", handleGetCategoryById);
router.post("/", handleCreateCategory);
router.put("/:id", handleUpdateCategory);
router.delete("/:id", handleDeleteCategory);
export default router;
//# sourceMappingURL=category.route.js.map