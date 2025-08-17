import cron from "node-cron";
import getProblemMappings from "./allQuestions.js";
import { setQuestions } from "../cache/questionCache.js";
import getSet from "./todayQuestions.js";
import dailyQuestionModel from "../models/dailyQuestion.js";

//refreshing data every month on the 1st
cron.schedule("0 0 1 * *", async () => {
    try{
        let mapping;
        console.log("Fetching problem mappings...");
        while(!mapping){
            mapping = await getProblemMappings();
        }
        setQuestions(mapping);
        console.log("Done");
    } catch (error) {
        console.error("Error fetching problem mappings:", error);
    }
});


// Refreshing daily questions at 0:02
cron.schedule("2 0 * * *", async () => {
    console.log("Checking for updated problem mappings...");
    const todaySet = await getSet();
    if (todaySet instanceof Set) {
        for (let item of todaySet) {
            // await dailyQuestionModel.create({ question: item });
            console.log("Today's question:", item);
        }
        await dailyQuestionModel.create({
            date: new Date(),
            questions: Array.from(todaySet)
        });
    } else {
        console.log("No questions available for today.");
    }
});
