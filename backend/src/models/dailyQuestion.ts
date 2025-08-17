import mongoose from "mongoose";
import { Schema } from "mongoose";

const dailyQuestionSchema = new Schema({
    sluges : {type: [String], required: true},
});

const dailyQuestionModel = mongoose.model("TodayQuestions", dailyQuestionSchema);

export default dailyQuestionModel;
