import type { Request, Response } from "express";
import UserModel from "../models/userModel.js";
import fetch from "node-fetch";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

 async function getUserLeetCodeRating(username: string) {
  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query getUserRating($username: String!) {
            userContestRanking(username: $username) {
              rating
            }
          }
        `,
        variables: { username },
      }),
    });

    const json = await response.json() as { data?: { userContestRanking?: { rating?: number } } };

    const rating = json?.data?.userContestRanking?.rating ?? null;

    return rating; 
  } catch (error) {
    console.error("Error fetching rating:", error);
    return null;
  }
}


async function computeRating(username : string, score : number) {
  try {
    if (typeof username !== "string") {
      return 0;
    }
    const lc_rating = await getUserLeetCodeRating(username);
    // console.log(lc_rating);
    // console.log(score);

    const externalRating = Number(lc_rating ?? 0);

    const Rmin = 1000;
    const Rmax = 3000; 
    const beta = 0.5; 
    const gamma = 20; 

    let r_norm = 0;
    if (!Number.isNaN(externalRating) && Rmax > Rmin) {
      r_norm = (externalRating - Rmin) / (Rmax - Rmin);
      r_norm = clamp(r_norm, 0, 1);
    }

    const xp = score * (1 + beta * r_norm) + gamma * r_norm;
    return xp;
  } catch (err) {
    console.error("Error in computeRating:", err);
  }
}

export default async function getData(req : Request, res: Response){

    const foundUser = await UserModel.findById(req.user.userId);
    const username = foundUser?.username;
    const score = foundUser?.xp;
    if(typeof username != "string"|| typeof score != "number"){
        return res.json({
            message : "Invalid input"
        });
    }
    const rating = await computeRating(username, score);

    return res.json({
        name : foundUser?.name,
        rating : rating,
        totalProblems : foundUser?.totalSolved,
    });
}
