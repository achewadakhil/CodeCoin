import mongoose from "mongoose";
const { Schema } = mongoose;

//Storing date here (2025-11-11) as 20251111
const dailySolvedSchema = new Schema(
  {
    date: { type: Number, required: true },
    titleSlug: { type: String, required: true },
  },
  { _id: false }
);

//Storing date here (2025-11-11) as 20251111
const dailyPointsSchema = new Schema(
  {
    date: { type: Number, required: true }, 
    points: { type: Number, default: 0 },
  },
  { _id: false }
);

dailyPointsSchema.index({ date: 1 }, { unique: false });

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },

  totalSolved: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },

  dailySolved: [dailySolvedSchema],
  dailyPoints: [dailyPointsSchema],
});

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;
