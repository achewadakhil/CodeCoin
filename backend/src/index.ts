import express from "express";
import type { Request, Response } from "express";
import authRouter from "./routes/authRoutes.js";


const app = express();

app.use(express.json());

app.use("/auth",authRouter);



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});