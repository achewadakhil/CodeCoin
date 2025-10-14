import express from "express";
import getUserLeetCode from "../controllers/leetcodeControllers.js";

const codeRouter = express.Router();

//useful in leaderBoard not we dont hace much use with this
//give the username as query param
codeRouter.get("/getUserLeetCode", getUserLeetCode);


export default codeRouter;