import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../../db/db";
import dotenv from "dotenv";

dotenv.config();

export interface AuthenticatedRequest extends Request {
    user?: { id: number };
}

const generateToken = (id: number) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1h" })
}

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
        `INSERT INTO users (username, password) VALUES ($1, $2) 
        ON CONFLICT DO NOTHING
        RETURNING id`,
        [username, hashed]
    );

    if (result.rowCount === 0) {
        res.status(400).json({ message: "username already taken"});
        return;
    }

    const token = generateToken(result.rows[0].id);
    res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ token: token, username: username});
}

export const login = async (req: Request, res: Response): Promise<void> => {
    // query the database by given credentials 
    const { username, password } = req.body 
    const result = await pool.query(
        'SELECT * from users WHERE username = $1',
        [username]
    );

    if (result.rowCount === 0) {
        res.status(400).json({ message: "Invalid username or password" })
        return;
    }; 

    // check if credentials are valid
    const match = await bcrypt.compare(password, result.rows[0].password);
    if (!match) {
        res.status(400).json({ message: "Invalid username or password" }); 
        return;
    } 

    // generate token
    const token = generateToken(result.rows[0].id);
    res.cookie("jwt", token, { httpOnly: true, secure: true, sameSite: "strict" });
    res.json({ token: token, username: result.rows[0].username});
}

export const getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(403).json({ message: "unauthorized" });
        return;
    } 
    const result = await pool.query(
        'SELECT username, id FROM users WHERE id = $1',
        [userId]
    )
    res.json(result.rows[0]);
}

export const logout = (req: Request, res: Response) => {
    res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).json({ message: "Logged out successfully" });
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Try to extract token from cookies 
        // if token doesn't exist, return status 401
    // Verify that the JWT is valid, decode and set req.user 
        // else return return status 401
    const token = req.cookies.jwt
    if (!token) {
        res.status(401).json({ message: "you are not real!" });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
        req.user = decoded as {id: number};
        next();
    } catch {
        res.status(403).json({ message: "unauthorized"});
    }
    
}

