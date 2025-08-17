
import type { Request, Response } from "express";
import UserModel from "../models/userModel.js";


export async function submitQuestion(req : Request, res: Response) {
    const { questionId , titleSlug} = req.body;
    const user = await UserModel.findById(req.user?.userId);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }


    // Here you would typically save the submission to a database
    // For demonstration, we will just return the received data
    res.status(200).json({
        message: "Question submitted successfully",
        data: {
            questionId,
            titleSlug,
            userId: user._id,
            status: "submitted"
        }
    });
}