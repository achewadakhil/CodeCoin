
let questions : Record<string, string> = {};

export function setQuestions(newSet : Record<string, string>) {
    questions = newSet;
    console.log(questions);
}

export function getQuestions() {
    return questions;
}
