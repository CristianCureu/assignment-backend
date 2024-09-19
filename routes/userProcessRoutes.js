import express from "express";
import {
  getProcessesForUser,
  assignUserToProcess,
  getUsersForProcess,
  removeUserFromProcess,
} from "../controllers/userProcessControllers.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/process/:userId", authenticateToken, getProcessesForUser);
router.get("/user/:processId", authenticateToken, getUsersForProcess);
router.post("/", authenticateToken, assignUserToProcess);
router.delete("/", authenticateToken, removeUserFromProcess);

export default router;
