
import type { Request, Response, NextFunction } from "express";
import {z} from "zod";
import checkLeetCodeUser from "../utils/isValidUser.js";

export async function signUpValidation(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6).max(100),
        username: z.string().min(3).max(100)
    });

    try {
        const validator = schema.safeParse(req.body);
        if (!validator.success) {
            return res.status(400).json({ message: "Invalid input data" });
        }
        const {username} = req.body;
        const isValid = await checkLeetCodeUser(username);

        if (!isValid) {
            return res.status(400).json({ message: "Invalid LeetCode username" });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid input data" });
    }
}

export async function signInValidation(req: Request, res: Response, next: NextFunction) {
    const schema = z.object({
        email: z.string().email({ message: "Invalid email format" }),
        password: z.string().min(6).max(100)
    });

    try {
        const validator = schema.safeParse(req.body);
        if (!validator.success) {
            return res.status(400).json({ message: "Invalid input data" });
        }
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid input data" });
    }
}