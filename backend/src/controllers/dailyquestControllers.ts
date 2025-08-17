
import type { Request, Response } from "express";


export async function submitQuestion(req : Request, res: Response) {
    
    res.json({ message: "Question submitted successfully" });
}