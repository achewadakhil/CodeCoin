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

    const json = (await response.json()) as { data?: { userContestRanking?: { rating?: number } } };
    const rating = json?.data?.userContestRanking?.rating ?? null;
    return rating;
  } catch (error) {
    console.error("Error fetching rating:", error);
    return null;
  }
}

function getLevelFromRating(rating: number) {
  if (!Number.isFinite(rating) || rating <= 0) return { level: "Unrated", tier: "unrated" };

  if (rating < 500) return { level: "Newbie", tier: "newbie" };
  if (rating < 1000) return { level: "Beginner", tier: "beginner" };
  if (rating < 1500) return { level: "Intermediate", tier: "intermediate" };
  if (rating < 2000) return { level: "Advanced", tier: "advanced" };
  if (rating < 2500) return { level: "Pro", tier: "pro" };
  if (rating < 3000) return { level: "Expert", tier: "expert" };
  if (rating < 4000) return { level: "Master", tier: "master" };
  return { level: "Grandmaster", tier: "grandmaster" };
}


async function computeRating(username: string, score: number) {
  try {
    if (typeof username !== "string") return { xp: 0, rawXp: 0, r_norm: 0, externalRating: 0 };

    const lc_rating = await getUserLeetCodeRating(username);
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

    const numericScore = Number.isFinite(score) ? Number(score) : 0;
    const rawXp = numericScore * (1 + beta * r_norm) + gamma * r_norm;
    const xp = Math.round(rawXp);

    console.log("[computeRating]", { username, numericScore, externalRating, r_norm, rawXp, xp });

    return { xp, rawXp, r_norm, externalRating };
  } catch (err) {
    console.error("Error in computeRating:", err);
    return { xp: 0, rawXp: 0, r_norm: 0, externalRating: 0 };
  }
}

export default async function getData(req: Request, res: Response) {
  try {
    const foundUser = await UserModel.findById(req.user.userId);
    const username = typeof foundUser?.username === "string" ? foundUser.username : null;
    const scoreRaw = foundUser?.xp;
    const score = Number.isFinite(Number(scoreRaw)) ? Number(scoreRaw) : NaN;

    if (typeof username !== "string" || Number.isNaN(score)) {
      return res.status(400).json({
        message: "Invalid input",
        debug: { username: foundUser?.username, scoreRaw },
      });
    }

    const computeResult = await computeRating(username, score);

    const ratingForLevel = computeResult.xp;
    const levelInfo = getLevelFromRating(ratingForLevel);

    return res.json({
      name: foundUser?.name,
      rating: {
        computedXP: computeResult.xp,
        external: computeResult.externalRating,
      },
      level: levelInfo.level,
      totalProblems: foundUser?.totalSolved,
    });
  } catch (err) {
    console.error("Error in getData:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
