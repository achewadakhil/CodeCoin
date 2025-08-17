import mongoose from "mongoose";
import { Schema } from "mongoose";

const questionSchema = new Schema({
    title: { type: String, required: true },
    difficulty: { type: String, required: true },
    titleSlug: { type: String, required: true },
    link: { type: String, required: true },
    acRate: { type: Number, required: true },
},{ _id : false });

const dailyQuestionSchema = new Schema({
    date: { type: Date, required: true },
    questions: [questionSchema],
});

const dailyQuestionModel = mongoose.model("TodayQuestions", dailyQuestionSchema);

export default dailyQuestionModel;
