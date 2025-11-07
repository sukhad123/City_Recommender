//all review model related db goes here
"use server";
import { prisma } from "../db/prisma";
export async function createReview(comment, city, userEmail ) {
  // 1. Find the user by email
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    throw new Error(`User with email ${userEmail} not found`);
  }

  console.log(user);
  // 2. Create review with userId
  return await prisma.review.create({
    data: {
      comment,
      city,
      userId: user.id,
    },
    include: { user: true },
  });
}

export async function getAllReviews() {
  return await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      city: true,
      comment: true,
      id:true,
      createdAt: true,
      user: true,
    }
  });
}

export async function deleteReviewsByEmail(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.warn(`⚠️ No user found with email: ${email}`);
      return false;
    }
    const result = await prisma.review.deleteMany({ where: { userId: user.id } });
    console.log(`✅ Deleted ${result.count} review(s) for user: ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error deleting reviews:", error);
    return false;
  }
}

// Fetch reviews for a specific user by email
export async function getReviewsByUserEmail(userEmail) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });
  if (!user) {
    throw new Error(`User with email ${userEmail} not found`);
  }
  return prisma.review.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

// Update a review by review ID and new data (comment, city)
export async function updateReview(id, { comment, city }) {
  return prisma.review.update({
    where: { id },
    data: { comment, city },
  });
}

// Delete a single review by its ID
export async function deleteReview(id) {
  return prisma.review.delete({
    where: { id },
  });
}
