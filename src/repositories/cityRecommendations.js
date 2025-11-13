"use server";
import { prisma } from "../db/prisma";

export async function saveCityRecommendations(userEmail, raw) {
  console.log("raw:",raw);
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });
  if (!user) throw new Error(`User with email ${userEmail} not found`);
  const userId = user.id;

  
  const items = [...(raw ?? [])]
    .filter((r) => r?.city && typeof r.score === "number")
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({
      userId,
      city: r.city,       
      province: r.province ?? null,
      score: r.score,
      rank: i + 1,
    }));

  await prisma.$transaction([
    prisma.cityRecommendation.deleteMany({ where: { userId } }),
    ...(items.length
      ? [prisma.cityRecommendation.createMany({ data: items })]
      : []),
  ]);

  return items.length;
}

export async function getCityRecommendationsForUser(userEmail) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });
  if (!user) throw new Error(`User with email ${userEmail} not found`);

  return prisma.cityRecommendation.findMany({
    where: { userId: user.id },
    orderBy: { rank: "asc" },
    select: { city: true, province: true, score: true, rank: true },
  });
}

export async function clearCityRecommendations(userEmail) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true },
  });
  if (!user) return 0;

  const res = await prisma.cityRecommendation.deleteMany({
    where: { userId: user.id },
  });
  return res.count;
}
