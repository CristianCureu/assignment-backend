import express from "express";
import {
  getAllUsers,
  getUserById,
  updateUserById,
} from "../controllers/userControllers.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllUsers);
router.get("/:userId", authenticateToken, getUserById);
router.put("/:userId", authenticateToken, updateUserById);

export default router;
