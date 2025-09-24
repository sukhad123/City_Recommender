import {Review} from "./index.js"
//import User from "./models/User.js"
async function run() {
 const review = await Review.create({
      comment: "This is a test review",
      city: "Toronto", // ✅ valid enum
      user: "68d42e22843248e1696c6d7c",
    });
    console.log("review", review)
}
run();