import cron from "node-cron";
import fs from "fs";
import path from "path";
import getProblemMappings from "./allQuestions.js";
import dailyQuestionModel from "../models/dailyQuestion.js";

const CACHE_PATH = path.join(process.cwd(), "src", "cache", "leetcode.json");
cron.schedule("0 0 1 * *", async () => {
  try {
    console.log("Running monthly LeetCode fetch job...");

    const problems = await getProblemMappings();
    if (!problems || Object.keys(problems).length === 0) {
      console.log("No problems fetched from LeetCode API.");
      return;
    }

    const dir = path.dirname(CACHE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(CACHE_PATH, JSON.stringify(problems, null, 2), "utf-8");
    console.log(`Saved problems to ${CACHE_PATH}`);
  } catch (error) {
    console.error("Error in monthly LeetCode fetch job:", error);
  }
});


cron.schedule("2 0 * * *", async () => {
  try {

    console.log("Daily questions getting updated :");
    const rawData = fs.readFileSync(CACHE_PATH, "utf-8");
    const problems = JSON.parse(rawData);

    if (!Array.isArray(problems)) {
      console.log("JSON is not an array, type:", typeof problems);
      return;
    }

    console.log("Total problems:", problems.length);

    const len = problems.length;
    const todayQuestions = [];
    const usedIndexes = new Set();

    while (todayQuestions.length < 3 && todayQuestions.length < len) {
      const idx = Math.floor(Math.random() * len);
      const prob = problems[idx];

      if (!usedIndexes.has(idx) && !prob.paidOnly) {
        usedIndexes.add(idx);

        prob.link = prob.link || `https://leetcode.com/problems/${prob.titleSlug}/`;

        todayQuestions.push({
          title: prob.title,
          difficulty:
            prob.difficulty === 1
              ? "Easy"
              : prob.difficulty === 2
              ? "Medium"
              : "Hard",
          titleSlug: prob.titleSlug,
          link: prob.link
        });
      }
    }
    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, "0")}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${now.getFullYear()}`;

    const existing = await dailyQuestionModel.findOne({ date: dateStr });
    if (existing) {
      console.log("Today's questions already exist in DB. Skipping insert.");
      return;
    }

    await dailyQuestionModel.create({
      date: dateStr,
      questions: todayQuestions,
    });

    console.log("Added today's random 3 questions!");
  } catch (err) {
    console.error("Error in cron job:", err instanceof Error ? err.message : err);
  }
});


export default cron;
