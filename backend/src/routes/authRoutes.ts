import { UserLogin, UserSignup } from "../controllers/authControllers.js";
// import express from "express";

import { Router } from "express";
import { signInValidation, signUpValidation, validateUser } from "../validators/authValidators.js";
import getDetails from "../controllers/getUserDetails.js";

const authRouter = Router();

authRouter.post("/signup", signUpValidation, UserSignup);

authRouter.post("/login", signInValidation, UserLogin);

authRouter.get("/profile", validateUser, getDetails);

export default authRouter;
