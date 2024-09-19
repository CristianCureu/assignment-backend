import express from "express";
import { createProcess, getAllProcesses } from "../controllers/processControllers.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllProcesses);
router.post("/", authenticateToken, createProcess);

export default router;
