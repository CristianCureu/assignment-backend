import express from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import {
  createMultipleTasks,
  createTask,
  getAllTasks,
  updateTask,
} from "../controllers/taskControllers.js";

const router = express.Router();

router.get("/", authenticateToken, getAllTasks);
router.post("/", authenticateToken, createTask);
router.put("/:id", authenticateToken, updateTask);
router.post("/multiple", authenticateToken, createMultipleTasks);

export default router;
