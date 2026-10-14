// src/routes/auth.route.ts
import { Router } from "express";
import {
  handleRegister,
  handleLogin,
  handleLogout,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
const router = Router();

router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", authenticate, handleLogout);
router.get("/test", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

export default router;
