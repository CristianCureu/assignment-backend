import express from "express";
import { login, refreshToken, register } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/token/refresh", refreshToken);

export default router;
