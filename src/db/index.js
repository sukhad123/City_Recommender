//ALL DB EXPORED FROM HERE FOR OTHER FOLDERS
import dbConnect from "./connect.js";
import User from "./models/User.js";
import Review from "./models/Review.js";
//connect the db
await dbConnect();
export { User, Review };
