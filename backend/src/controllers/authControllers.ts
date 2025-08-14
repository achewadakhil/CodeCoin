
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

export default async function UserSignup(req: Request, res: Response) {
    const {email , password} = req.body;
    try{
        await UserModel.create({
            email,
            password : await bcrypt.hash(password, 10)
        });
        
        res.status(201).json({
            message: "User created successfully",
        });
    }catch(err) {
        res.status(500).json({
            message: "Error creating user"
        });
    }

}

export async function UserLogin(req: Request, res: Response) {
    const { email, password } = req.body;

    try{
        const foundUser = await UserModel.findOne({email});
        if(!foundUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }
    }catch(err) {
        res.status(500).json({
            message: "Error logging in user"
        });
    }

    res.status(200).json({
        message: "User logged in successfully",
        user: {
        },
    });
}