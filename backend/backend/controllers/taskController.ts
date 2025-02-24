import { Response } from "express";
import pool from "../../db/db";
import { AuthenticatedRequest } from "./authController";

export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    const result = await pool.query(
        `SELECT * FROM tasks 
        WHERE userId = $1`,
        [id]
    );
    res.send(result.rows);
}

export const addTask = async (req: AuthenticatedRequest, res: Response) => {
    const id = req.user?.id;
    const { title, description, isComplete } = req.body;
    const result = await pool.query(
        `INSERT INTO tasks (title, description, isComplete, userId)
        VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [title, description, isComplete, id]
    )
    const task = result.rows[0]
    res.send({id: task.id, title: task.title, description: task.description, isComplete: task.iscomplete})
}

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
    const taskId = req.params.id;
    const { title, description, isComplete } = req.body;
    const result = await pool.query(
        `UPDATE tasks
        SET (title, description, isComplete) = ($1, $2, $3)
        WHERE id = $4
        RETURNING *`,
        [title, description, isComplete, taskId]
    );
    const task = result.rows[0]
    res.send({id: task.id, title: task.title, description: task.description, isComplete: task.iscomplete})
}

export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
    const taskId = req.params.id;
    const result = await pool.query(
        `DELETE FROM tasks 
        WHERE id = $1
        RETURNING *`,
        [taskId]
    )
    res.send(result.rows[0])
}