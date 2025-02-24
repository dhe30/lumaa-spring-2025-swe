import express from "express";
import { register, login, getProfile, authMiddleware, logout } from "../controllers/authController.ts";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authMiddleware, getProfile);

export default router;