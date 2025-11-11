import type { Request, Response } from "express";
import UserModel from "../models/userModel.js";
import fetch from "node-fetch";

interface RecentSubmission {
  id: number;
  title: string;
  titleSlug: string;
  timestamp: number;
  statusDisplay: string;
  lang: string;
}

function getDateNumber(date = new Date()): number {
  return (
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()
  );
}

export async function submitQuestion(req: Request, res: Response) {
  const { titleSlug, difficulty } = req.body;
  console.log("submitQuestion called with:", { titleSlug, difficulty });

  try {
    if (!req.user?.userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized in submitQuestions" });
    }

    const foundUser = await UserModel.findById(req.user.userId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const username = foundUser.username;

    const query = `
      query recentAcSubmissions($username: String!, $limit: Int) {
        recentAcSubmissionList(username: $username, limit: $limit) {
          id
          title
          titleSlug
          timestamp
          statusDisplay
          lang
        }
      }
    `;
    const variables = { username, limit: 50 };

    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error("LeetCode API error:", response.statusText);
      return res.status(502).json({ message: "Failed to fetch from LeetCode" });
    }

    const json = (await response.json()) as {
      data?: { recentAcSubmissionList?: RecentSubmission[] };
      errors?: any;
    };

    if (json.errors) {
      console.error("LeetCode GraphQL errors:", json.errors);
      return res.status(400).json({ message: "LeetCode API returned errors" });
    }

    const submissions = json.data?.recentAcSubmissionList ?? [];

    const todayNum = getDateNumber();

    const solvedToday = submissions.some((sub) => {
      const subDateNum = getDateNumber(new Date(sub.timestamp * 1000));
      return sub.titleSlug === titleSlug && subDateNum === todayNum;
    });

    if (!solvedToday) {
      return res.status(200).json({
        message: "No matching submission found for today.",
        data: { titleSlug, solvedToday: false },
      });
    }

    let xpGained = 0;
    if (difficulty === "Easy") xpGained = 10;
    else if (difficulty === "Medium") xpGained = 20;
    else xpGained = 30;

    const isAlreadySolved = foundUser.dailySolved.some(
      (entry) => entry.titleSlug === titleSlug && entry.date === todayNum
    );

    if (isAlreadySolved) {
      return res.status(200).json({
        message: "Solution already exists for today.",
        data: {
          titleSlug,
          userId: foundUser._id,
          solvedToday,
          xp: foundUser.xp,
        },
      });
    }

    const updateExisting = await UserModel.updateOne(
      {
        _id: foundUser._id,
        "dailyPoints.date": todayNum,
      },
      {
        $inc: {
          "dailyPoints.$.points": xpGained,
          xp: xpGained,
          totalSolved: 1,
        },
        $push: { dailySolved: { date: todayNum, titleSlug } },
      }
    );

    if (updateExisting.modifiedCount === 0) {
      await UserModel.updateOne(
        {
          _id: foundUser._id,
          "dailyPoints.date": { $ne: todayNum },
        },
        {
          $push: {
            dailyPoints: { date: todayNum, points: xpGained },
            dailySolved: { date: todayNum, titleSlug },
          },
          $inc: { xp: xpGained, totalSolved: 1 },
        }
      );
    }

    const updatedUser = await UserModel.findById(foundUser._id);

    return res.status(200).json({
      message: "Solution validated and added",
      data: {
        titleSlug,
        userId: foundUser._id,
        solvedToday: true,
        xp: updatedUser?.xp,
      },
    });
  } catch (err) {
    console.error("Error in submitQuestion:", err);
    return res.status(500).json({ message: "Failed to check submission" });
  }
}
