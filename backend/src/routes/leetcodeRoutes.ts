import express from "express";
import getUserLeetCode from "../controllers/leetcodeControllers.js";

const codeRouter = express.Router();

codeRouter.get("/getUserLeetCode", getUserLeetCode);


export default codeRouter;