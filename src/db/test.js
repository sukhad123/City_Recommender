import dbConnect from "./mongo.js";
import User from "./models/db.js"  
 
export async function addUser(userData) {
  try {
    // Connect to DB
    await dbConnect();

    // Create a new user
    const user = await User.create(userData);

    console.log("✅ User added:", user);
    return user;
  } catch (error) {
    console.error("❌ Error adding user:", error.message);
    throw error; // re-throw for API routes if needed
  }
}
async function main() {
  const newUser = {
    name: "Sukhad Adhikari",
    email: "sukhad@example.com",
    age: 22,
  };

  const user = await addUser(newUser);
  console.log(user);
}

main();
