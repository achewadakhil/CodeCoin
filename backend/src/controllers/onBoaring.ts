import type { Request,Response } from "express";
import UserModel from "../models/userModel.js";


export default async function onBoarding(req : Request, res : Response){
    const {name , bio, onboardedAt} = req.body;
    try{
        const updateOne = await UserModel.findByIdAndUpdate(
            req.user.userId,
            {$set : {name, bio : bio, onboardedAt}},
            {new : true, runValidators : true}
        );
        // console.log(updateOne);
        res.json({
            updateOne
        })
    }catch(err){
        console.log("Error in onBoarding backend");
        res.json({
            message : "There is an error in auth/onBoarding"
        })
    }
}