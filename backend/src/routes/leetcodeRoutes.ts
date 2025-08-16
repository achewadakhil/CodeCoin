import express from "express";
import getUserLeetCode from "../controllers/leetcodeControllers.js";
import getProblemMappings from "../utils/allQuestions.js";

const codeRouter = express.Router();

codeRouter.get("/getUserLeetCode", getUserLeetCode);
codeRouter.get("/dailyQuestions", getProblemMappings);


export default codeRouter;