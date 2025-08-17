
import type { Request, Response, NextFunction } from "express";
import {z} from "zod";
import jwt from "jsonwebtoken";
import checkLeetCodeUser from "../utils/isValidUser.js";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

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

export function signInValidation(req: Request, res: Response, next: NextFunction) {
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

export function validateUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["token"] as string;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = decoded;
    console.log("User validated:", req.user);
    next();
  });
}