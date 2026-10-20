// src/routes/cart.route.ts
import { Router } from "express";
import { handleGetCart, handleCreateCartItem, handleUpdateCartItem, handleDeleteCartItem, handleClearCart, } from "../controllers/cart.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
const router = Router();
router.get("/", handleGetCart);
router.post("/items", authenticate, handleCreateCartItem);
router.put("/items/:variantId", authenticate, handleUpdateCartItem);
router.delete("/items/:variantId", authenticate, handleDeleteCartItem);
router.delete("/items", authenticate, handleClearCart);
export default router;
//# sourceMappingURL=cart.route.js.map