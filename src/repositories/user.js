"use server"
import {prisma} from "../db/prisma"

// CREATE USER
export async function createUser(email, name) {
  try {
    const user = await prisma.user.create({
      data: { email, name },
    });
    console.log("✅ User created:", user);
    if(!user)
    {
      return null;
    }
    return user;
  
  } catch (error) {
    console.log(error);
   return null;
}}

// FIND USER BY EMAIL
export async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { reviews: true }, // optional: include related reviews
    });

    if (!user) {
      console.warn(`⚠️ No user found with email: ${email}`);
      return false;
    }

    console.log("📋 User found:", user);
    return true;
  } catch (error) {
    console.error("❌ Error finding user:", error);
  }

}