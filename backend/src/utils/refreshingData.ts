import cron from "node-cron";
import getProblemMappings from "./allQuestions.js";
import { setQuestions } from "../cache/questionCache.js";

cron.schedule("0 0 1 * *", async () => {
    let mapping;
    while(!mapping){
        mapping = await getProblemMappings();
    }
    setQuestions(mapping);
});
