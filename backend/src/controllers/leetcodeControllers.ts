import type { Request, Response } from "express";
import fetch from "node-fetch";

export default async function getUserLeetCode(req: Request, res: Response) {
  const { username } = req.query;

  try {
    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              profile {
                ranking
                reputation
                userAvatar
              }
              submitStats {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
            }
            userContestRanking(username: $username) {
              rating
              attendedContestsCount
              globalRanking
              totalParticipants
              topPercentage
            }
            recentSubmissionList(username: $username, limit: 20) {
              title
              titleSlug
              statusDisplay
              lang
              timestamp
            }
          }
        `,
        variables: { username },
      }),
    });

    const json = await response.json() as {
      data: {
        matchedUser?: {
          profile: {
            ranking: number;
            reputation: number;
            userAvatar: string;
          };
          submitStats: {
            acSubmissionNum: Array<{
              difficulty: string;
              count: number;
            }>;
          };
        };
        userContestRanking?: {
          rating: number;
          attendedContestsCount: number;
          globalRanking: number;
          totalParticipants: number;
          topPercentage: number;
        } | null;
        recentSubmissionList: Array<{
          title: string;
          titleSlug: string;
          statusDisplay: string;
          lang: string;
          timestamp: string;
        }>;
      };
    };

    if (!json.data.matchedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const profile = json.data.matchedUser.profile;
    const stats = json.data.matchedUser.submitStats.acSubmissionNum;
    const contest = json.data.userContestRanking;
    const recentSubmissions = json.data.recentSubmissionList || [];
    const today = new Date().toISOString().split("T")[0];
    const todaysSubmissions = recentSubmissions.filter(
      (sub) =>
        new Date(parseInt(sub.timestamp) * 1000).toISOString().split("T")[0] === today
    );

    res.json({
      username,
      contestRating: contest?.rating ?? null,
      reputation: profile.reputation,
      solvedProblems: stats.find((d) => d.difficulty === "All")?.count || 0,
      breakdown: stats,
      todaysSubmissions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}

