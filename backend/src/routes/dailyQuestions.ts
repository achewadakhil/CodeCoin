import express from "express";
import { Router } from "express";
import { submitQuestion } from "../controllers/dailyquestControllers.js";
import { validateUser } from "../validators/authValidators.js";

const dailyQuestionRouter = Router();

//when a user submits a question (button) checking in leetcode for last 24 hours
dailyQuestionRouter.post("/submit", validateUser, submitQuestion);

export default dailyQuestionRouter;
