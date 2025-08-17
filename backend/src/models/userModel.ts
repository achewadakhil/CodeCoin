
import mongoose from "mongoose";
import {Schema} from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  todaySolved: { type: Number, default: 0 },
  solvedThisWeek: { type: Number, default: 0 },
  solvedThisMonth: { type: Number, default: 0 },
  totalSolved: { type: Number, default: 0 }
});

const UserModel = mongoose.model("Users", userSchema);

export default UserModel;
