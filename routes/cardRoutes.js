import express from "express";
import {
  createCard,
  deleteCard,
  getCardById,
  getCardsByProcessId,
  updateCard,
} from "../controllers/cardControllers.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/process/:processId", authenticateToken, getCardsByProcessId);
router.get("/:cardId", authenticateToken, getCardById);
router.post("/", authenticateToken, createCard);
router.delete("/:cardId", authenticateToken, deleteCard);
router.put("/:cardId", authenticateToken, updateCard);

export default router;
