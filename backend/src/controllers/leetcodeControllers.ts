import type { Request, Response } from "express";
import fetch from "node-fetch";

type ContestHistory = {
  attended: boolean;
  rating: number;
  contest: {
    title: string;
    startTime: number;
  };
};

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
            userContestRankingHistory(username: $username) {
              attended
              rating
              contest {
                title
                startTime
              }
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

    const json = (await response.json()) as {
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
        userContestRankingHistory: ContestHistory[];
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

    // ---- Calculate this week's rating change ----
    const attended: ContestHistory[] = (json.data.userContestRankingHistory || []).filter(
      (h) => h.attended
    );

    let latest: ContestHistory | null = null;
    let prev: ContestHistory | null = null;

    for (const contest of attended) {
      if (!latest || contest.contest.startTime > latest.contest.startTime) {
        prev = latest;
        latest = contest;
      } else if (!prev || contest.contest.startTime > prev.contest.startTime) {
        prev = contest;
      }
    }

    let weeklyRatingChange = 0;
    let latestContestInfo: { title: string; date: string } | null = null;

    if (latest && prev) {
      const contestDate = new Date(latest.contest.startTime * 1000);
      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);

      if (contestDate >= weekAgo) {
        weeklyRatingChange = latest.rating - prev.rating;
        latestContestInfo = {
          title: latest.contest.title,
          date: contestDate.toISOString().split("T")[0] ?? "",
        };
      }
    }

    // ---- Filter today's submissions ----
    const today = new Date().toISOString().split("T")[0];
    const todaysSubmissions = recentSubmissions.filter(
      (sub) =>
        new Date(parseInt(sub.timestamp) * 1000).toISOString().split("T")[0] === today
    );

    res.json({
      username,
      contestRating: contest?.rating ?? null,
      weeklyRatingChange,
      latestContest: latestContestInfo,
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