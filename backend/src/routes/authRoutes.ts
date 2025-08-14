import UserSignup, { UserLogin } from "../controllers/authControllers.js";
import express from "express";

import { Router } from "express";
import validateUser from "../validators/authValidators.js";

const authRouter = Router();

authRouter.post("/signup",validateUser,UserSignup);

authRouter.post("/login",validateUser,UserLogin);

export default authRouter;
