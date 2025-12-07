import { UserLogin, UserSignup } from "../controllers/authControllers.js";
// import express from "express";

import { Router } from "express";
import { signInValidation, signUpValidation, validateUser } from "../validators/authValidators.js";
// import getDetails from "../controllers/getUserDetails.js";
import onBoarding from "../controllers/onBoaring.js";
import getData from "../controllers/computeRating.js";

const authRouter = Router();

authRouter.post("/signup", signUpValidation, UserSignup);

authRouter.post("/login", signInValidation, UserLogin);

authRouter.get("/profile", validateUser, getData);

authRouter.post("/onBoarding",validateUser,onBoarding);


export default authRouter;
