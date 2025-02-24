import express from "express";
import { authMiddleware } from "../controllers/authController";
import { addTask, deleteTask, getTasks, updateTask } from "../controllers/taskController";

const router = express.Router();
router.post("", authMiddleware, addTask);
router.get("", authMiddleware, getTasks);
router.put("/:id", authMiddleware, updateTask)
router.delete("/:id", authMiddleware, deleteTask)
export default router;