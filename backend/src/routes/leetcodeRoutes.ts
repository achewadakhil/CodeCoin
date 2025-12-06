import express from "express";
import { validateUser } from "../validators/authValidators.js";
import getData from "../controllers/computeRating.js";

const codeRouter = express.Router();

//useful in leaderBoard not we dont hace much use with this
//give the username as query param
codeRouter.get("/getUserLeetCode", validateUser, getData);


export default codeRouter;