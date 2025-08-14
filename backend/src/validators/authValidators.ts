
import type { Request, Response, NextFunction } from "express";
import {z} from "zod";
import jwt from "jsonwebtoken";

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});


export default function validateUser(req: Request, res: Response, next: NextFunction) {
  const result = userSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
        error: "Invalid user data",
        errors: result.error.flatten().fieldErrors
    });
  }
  const {email} = req.body;
  const token = jwt.sign({ email }, process.env.JWT_SECRET || "Hello");
  res.setHeader("token", token);
  next();
}