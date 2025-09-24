<<<<<<< HEAD
import mongoose, { Schema, models } from "mongoose";
import { v4 as uuidv4 } from "uuid";
=======
import mongoose from "mongoose";
>>>>>>> dev
const CanadianCities = [
  "Toronto",
  "Montreal",
  "Vancouver",
  "Calgary",
  "Edmonton",
  "Ottawa",
  "Winnipeg",
  "Quebec City",
  "Hamilton",
  "Kitchener",
  "London",
  "Victoria",
  "Halifax",
  "Oshawa",
  "Windsor",
  "Saskatoon",
  "Regina",
  "St. John's",
  "Kelowna",
];
const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      enum: CanadianCities,
      required: true,
      trim: true,
    },
<<<<<<< HEAD
    rating: {
      type:String,
    },
    userId: {
      type: String,
    },
=======
>>>>>>> dev
    //fk referencing user
    user: { type: String, ref: "User", required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    versionKey: false, // optional: removes __v field
  }
);
const Review = models.Review || mongoose.model("Review", reviewSchema);

<<<<<<< HEAD
export default Review;
=======
export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
>>>>>>> dev
// enum canadianCities
