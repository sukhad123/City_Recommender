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