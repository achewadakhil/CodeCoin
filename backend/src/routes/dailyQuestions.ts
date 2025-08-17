import express from "express";
import { Router } from "express";
import { submitQuestion } from "../controllers/dailyquestControllers.js";
// import isValidUser from "../validators/isValidUser.js";

const dailyQuestionRouter = Router();

// dailyQuestionRouter.post("/submit", isValidUser , submitQuestion);

export default dailyQuestionRouter;
