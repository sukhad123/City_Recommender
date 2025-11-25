"use server";

import { prisma } from "../db/prisma";

export async function getUserRecommendationsByEmail(email) {
  if (!email) return [];

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (!user) return [];

  // Optional: guard in case client wasn’t regenerated
  if (!prisma.cityRecommendation) {
    throw new Error(
      "Prisma client does not have cityRecommendation. Did you run `prisma generate` and restart the server?"
    );
  }

  const recs = await prisma.cityRecommendation.findMany({
    where: { userId: user.id },
    orderBy: [{ rank: "asc" }, { score: "desc" }],
    select: {
      city: true,
      province: true,
      score: true,
      rank: true,
      generatedAt: true,
    },
  });

  console.log("📦 recs:", recs);

  return recs;
}

{/**Save recommendation */}
export async function save_recommendation(recommendations, userEmail){
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error(`User with email ${userEmail} not found`);
console.log("REcommendation",recommendations)
for (const rec of recommendations) {
  await prisma.cityRecommendation.create({data:{
    user: {
      connect: { id: user.id }
    },
    score:0,
    rank:0,
    city: rec,
    province:"Test",
  }})
}

} 

{/**Delete Old */}
export async function delete_rec(userEmail)
{
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error(`User with email ${userEmail} not found`);
  const deleteCities = await prisma.cityRecommendation.deleteMany({
  where: {
    userId: {
      contains:user.id,
    },
  },
})
return deleteCities

}