import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/auth",authRouter);

(async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable is not defined.");
  }
  await mongoose.connect(mongoUri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
})();

