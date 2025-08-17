
type QuestionType = {
    record : Record<string, string>,
    len: number
}

let questions : QuestionType = {
    record: {},
    len: 0
};

export function setQuestions(newSet : Record<string, string>) {
    questions.record = newSet;
    questions.len = Object.keys(newSet).length;
}

export function getQuestions()  : QuestionType {
    return questions;
}
