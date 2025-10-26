import { UserLogin, UserSignup } from "../controllers/authControllers.js";
// import express from "express";

import { Router } from "express";
import { signInValidation, signUpValidation } from "../validators/authValidators.js";

const authRouter = Router();

authRouter.post("/signup", signUpValidation, UserSignup);

authRouter.post("/login", signInValidation, UserLogin);

export default authRouter;
