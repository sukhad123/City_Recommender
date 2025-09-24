//all the user related crud operation goes here
import { User } from "../db/index";
{
  /**Create a user table */
}
export async function createUser(email) {
  try {
    const user = await User.create({ email });
    console.log("User Created", user);
  } catch (error) {
    console.log("Error", error);
  }
}

{
  /**Find user by email if exists */
}
export async function findUser(email) {
  try {
    const user = User.findOne({ email });
    return user;
  } catch (error) {
    console.log("Error", error);
    return null;
  }
}
