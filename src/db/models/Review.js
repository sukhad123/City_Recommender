import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
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
    _id: {
      type: String, // store UUID as string
      default: uuidv4, // auto-generate unique UUID
    },
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
    userId: {
      type: String,
    },
    //fk referencing user
    user: { type: String, ref: "User", required: true },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
    versionKey: false, // optional: removes __v field
  }
);

export default mongoose.model("Review", reviewSchema);
// enum canadianCities
