import fetch from "node-fetch";
import fs from "fs";
import path from "path";

export default async function getAllLeetCodeProblems() {
  try {
    console.log("Fetching all LeetCode problems at once...");

    const response = await fetch("https://leetcode.com/api/problems/all/", {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const data: any = await response.json();
    const problems = Array.isArray(data?.stat_status_pairs)
      ? data.stat_status_pairs.map((item: any) => ({
          questionId: item.stat.question_id,
          questionFrontendId: item.stat.frontend_question_id,
          title: item.stat.question__title,
          titleSlug: item.stat.question__title_slug,
          difficulty: item.difficulty?.level,
          paidOnly: item.paid_only,
        }))
      : [];
    const filePath = path.join(process.cwd(), "src", "cache", "leetcode.json");
    fs.writeFileSync(filePath, JSON.stringify(problems, null, 2));

    console.log(`Successfully fetched ${problems.length} problems.`);
    console.log(`Saved to: ${filePath}`);

    return problems;
  } catch (error) {
    console.error("Failed to fetch LeetCode problems:", error);
    return null;
  }
}
