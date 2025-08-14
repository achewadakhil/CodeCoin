import UserSignup, { UserLogin } from "../controllers/authControllers.js";
import express from "express";

import { Router } from "express";

const authRouter = Router();

authRouter.post("/signup",UserSignup);

authRouter.post("/login",UserLogin)

export default authRouter;
