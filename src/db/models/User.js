import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
const UserSchema = new mongoose.Schema(
  {
    id: {
      type: String, // store UUID as string
      default: uuidv4, // auto-generate UUI
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); //adds created at updated at
UserSchema.virtual("reviews", {
  ref: "Review", // model to reference
  localField: "id", // User._id
  foreignField: "id", // Review.id
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
