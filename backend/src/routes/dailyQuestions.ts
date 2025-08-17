import express from "express";
import { Router } from "express";
import { submitQuestion } from "../controllers/dailyquestControllers.js";
import { validateUser } from "../validators/authValidators.js";

const dailyQuestionRouter = Router();

dailyQuestionRouter.post("/submit", validateUser, submitQuestion);

export default dailyQuestionRouter;
