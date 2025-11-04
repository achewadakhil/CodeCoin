import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel.js";

// Modify this function 
export default async function getDetails(req: Request, res: Response) {
  const token = req.headers.token as string;
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");

    const userId = decoded.userId;
    const foundUser = await UserModel.findById(userId).select("-password -_id");

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user: foundUser });

  } catch (error) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}
