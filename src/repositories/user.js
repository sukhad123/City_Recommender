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

export async function updateUserNameByEmail(email, newName) {
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { name: newName },
    });
    return user;
  } catch (error) {
    console.error("Error updating user name in DB:", error);
  }
}

export async function getUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { name: true, profileImageUrl: true },
    });

    if (!user) {
      console.warn(`⚠️ No user found with email: ${email}`);
      return null;
    }
    return user;
  } catch (error) {
    console.error("❌ Error fetching user name:", error);
    return null;
  }
}

export async function deleteUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`⚠️ No user found with email: ${email}`);
      return false;
    }
    await prisma.user.delete({ where: { email } });
    console.log(`✅ User and related reviews deleted for email: ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return false;
  }
}

export async function updateProfileImageByEmail(email, profileImage) {
  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { profileImageUrl: profileImage },
    });
    return user;
  } catch (error) {
    console.error("Error updating profile image url in DB:", error);
  }
}