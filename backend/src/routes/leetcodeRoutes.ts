import express from "express";
import getUserLeetCode from "../controllers/leetcodeControllers.js";

const codeRouter = express.Router();

//useful in leaderBoard not we dont hace much use with this

codeRouter.get("/getUserLeetCode", getUserLeetCode);


export default codeRouter;