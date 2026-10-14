// src/routes/user.route.ts
import { Router } from "express";
import {
  handleGetUsers,
  handleGetUserById,
  handleUpdateUser,
  handleDeleteUser,
  handleGetUserAddresses,
  handleCreateUserAddress,
  handleUpdateUserAddress,
  handleDeleteUserAddress,
  handleGetUserProfile,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = Router();

//Profile routes

router.get("/me", authenticate, handleGetUserProfile);

//address routes
router.get("/me/addresses", authenticate, handleGetUserAddresses);
router.post("/me/addresses", authenticate, handleCreateUserAddress);
router.put("/me/addresses/:addressId", authenticate, handleUpdateUserAddress);
router.delete(
  "/me/addresses/:addressId",
  authenticate,
  handleDeleteUserAddress,
);
//User routes

router.get("/", authenticate, requireRole("ADMIN"), handleGetUsers);
router.get("/:id", authenticate, requireRole("ADMIN"), handleGetUserById);
router.put("/:id", authenticate, requireRole("ADMIN"), handleUpdateUser);
router.delete("/:id", authenticate, requireRole("ADMIN"), handleDeleteUser);

export default router;
