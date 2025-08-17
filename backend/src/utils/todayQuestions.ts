import { getQuestions } from "../cache/questionCache.js";


interface QuestionInfo {
    title: string;
    titleSlug: string;
    difficulty: string;
    acRate: number;
    link: string;
}

async function getQuestionInfo(slug: string): Promise<QuestionInfo | null> {
    const query = `
        query getQuestion($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                title
                titleSlug
                difficulty
                acRate
            }
        }
    `;

    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "User-Agent": "Mozilla/5.0"
            },
            body: JSON.stringify({ query, variables: { titleSlug: slug } }),
        });

        const json = await response.json();

        const question = json?.data?.question;
        if (!question) return null;

        return {
            title: question.title,
            titleSlug: question.titleSlug,
            difficulty: question.difficulty,
            acRate: question.acRate,
            link: `https://leetcode.com/problems/${question.titleSlug}/`,
        };
    } catch (error) {
        console.error("GraphQL fetch error:", error);
        return null;
    }
}


export default async function getSet(){

    const records = getQuestions().record;
    const len = getQuestions().len;
    if(!records || len === 0) return 0;
    const todaySet = new Set();
    while (todaySet.size < 3) {
        const randIdx = Math.floor(Math.random() * len) + 1;
        if(records[randIdx]) {
            const questionInfo = await getQuestionInfo(records[randIdx]);
            todaySet.add(questionInfo);
        }
    }
    return todaySet;
}