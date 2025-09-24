import mongoose from "mongoose";
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    }
  },
  { timestamps: true }
); //adds created at updated at
UserSchema.virtual("reviews", {
  ref: "Review", // model to reference
  localField: "_id", // User._id
  foreignField: "_id", // Review.id
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
