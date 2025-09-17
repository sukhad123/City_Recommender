import {Review} from "./index.js"

const review = await Review.create({
  comment: "Amazing service!",
  city: "Halifax",
  user:"647f2aae-e8ae-4452-9ba1-1c6a7ba52c42"   // 👈 pass the user's UUID here
});

console.log("Review created:", review);

 
