import mongoose from "mongoose";
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
