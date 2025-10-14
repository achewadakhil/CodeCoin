import express from "express";
import { Router } from "express";
import { getLeaderBoard } from "../controllers/leaderBoardControllers.js";
import { validateUser } from "../validators/authValidators.js";

const leaderBoardRouter = Router();

// Placeholder route for leaderboard
leaderBoardRouter.get("/", validateUser, getLeaderBoard);

export default leaderBoardRouter;