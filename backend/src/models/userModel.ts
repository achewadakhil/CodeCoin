import mongoose from "mongoose";
const { Schema } = mongoose;

const dailySolvedSchema = new Schema({
  date: { type: String, required: true },
  titleSlug: { type: String, required: true }
},{ _id : false});

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  
  totalSolved: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  dailySolved: [dailySolvedSchema] 
});

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;
