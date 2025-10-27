import type { Request, Response } from "express";
import dailyQuestionModel from "../models/dailyQuestion.js";


export default async function getTodayQuestions(req: Request, res: Response) {
  try {
    const date = new Date();
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = date.getFullYear();
    const formattedDate = `${dd}-${mm}-${yy}`;

    const todayQuestions = await dailyQuestionModel.findOne({ date: formattedDate });

    if (!todayQuestions) {
      return res.status(404).json({
        message: "No questions found for today",
      });
    }

    res.status(200).json(todayQuestions);
  } catch (err) {
    console.error("Error in getTodayQuestions:", err);
    res.status(500).json({
      message: "Error in getDailyQuestions",
    });
  }
}
