import cron from "node-cron";
import getProblemMappings from "./allQuestions.js";
import { setQuestions } from "../cache/questionCache.js";
import getSet from "./todayQuestions.js";



cron.schedule("* * * * *", async () => {
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

cron.schedule("*/2 * * * *", async () => {
    console.log("Checking for updated problem mappings...");
 
    const todaySet = await getSet();
    if (todaySet instanceof Set) {
        for (let item of todaySet) {
            console.log("Today's question:", item);
        }
    } else {
        console.log("No questions available for today.");
    }
});
