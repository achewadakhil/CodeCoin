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

export async function submitQuestion(req: Request, res: Response) {
  const { titleSlug , difficulty} = req.body;
  console.log("submitQuestion called with:", { titleSlug , difficulty});

  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "Unauthorized in submitQuestions" });
    }
    
    const foundUser = await UserModel.findById(req.user.userId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const username = foundUser.username;
    console.log("Checking submissions for LeetCode user:", username);

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

    const today = new Date().toLocaleDateString();
    // console.log(`today : ${today}`);
    const solvedToday = submissions.some((sub) => {
      const subDate = new Date(sub.timestamp * 1000).toLocaleDateString();
      // console.log("subDate :",subDate);
      return sub.titleSlug === titleSlug && subDate === today;
    });


    if(solvedToday){
      const isAlreadySolved = foundUser.dailySolved.some((entry)=>{
        return (entry.titleSlug === titleSlug && entry.date === today);
      });
      if(!isAlreadySolved){

        let xpGained = 0;

        if(difficulty === 'Easy')  xpGained = 10;
        else if(difficulty === 'Medium')  xpGained = 20;
        else  xpGained = 30;

        foundUser.dailySolved.push({
          date : today,
          titleSlug
        });

        foundUser.totalSolved += 1;

        foundUser.xp += xpGained;

        await foundUser.save();

        return res.status(200).json({
          message: "Solution validated and added",
          data: {
            titleSlug,
            userId: foundUser._id,
            solvedToday,
            xp : foundUser.xp
          },
        });
      }else{
        return res.status(200).json({
          message: "Solution already exists",
          data: {
            titleSlug,
            userId: foundUser._id,
            solvedToday,
            xp : foundUser.xp
          },
        });
      }
    }
  } catch (err) {
    console.error("Error in submitQuestion:", err);
    return res.status(500).json({ message: "Failed to check submission" });
  }
}
