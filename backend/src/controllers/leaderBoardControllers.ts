
import type { Request, Response } from "express";
import { get } from "http";
import fetch from "node-fetch";
import getUserLeetCode from "./leetcodeControllers.js";



export async function getLeaderBoard(req: Request, res: Response) {

    // in this we need to fetch the ratings of the users from diff platforms like leetcode, codeforces, atcoder etc and then sort them based on their ratings and also should have like how many problems from the site they have solved.
    // lets fetch from leetcode first
    try{

    }catch(err){
        console.log(err);  
        return res.status(500).json({message: "Internal server error in getLeaderBoard"});
    }
}