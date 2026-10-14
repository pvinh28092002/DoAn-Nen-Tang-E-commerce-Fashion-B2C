// src/routes/order.route.ts
import { Router } from "express";
import {
  handleCreateOrder,
  handleGetOrders,
  handleGetOrderById,
  handleCancelOrder,
  handleGetAllOrdersAdmin,
  handleUpdateOrderStatusAdmin,
} from "../controllers/order.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

router.use(authenticate);
// User routes
router.post("/checkout", handleCreateOrder);
router.get("/", handleGetOrders);
router.get("/:orderId", handleGetOrderById);
router.post("/:orderId/cancel", handleCancelOrder);

//Admin routes

router.use(requireRole("ADMIN"));
router.get("/admin/all", handleGetAllOrdersAdmin);
router.patch("/admin/:orderId/status", handleUpdateOrderStatusAdmin);
export default router;
