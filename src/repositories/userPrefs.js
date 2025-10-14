"use server";

import { prisma } from "../db/prisma";


export async function upsertUserPreferences(userEmail, data) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error(`User with email ${userEmail} not found`);

  return prisma.userPreferences.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: { ...data },
  });
}


export async function getUserPreferences(userEmail) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error(`User with email ${userEmail} not found`);

  return prisma.userPreferences.findUnique({
    where: { userId: user.id },
  });
}

export async function updateUserPreferences(userEmail, partial) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error(`User with email ${userEmail} not found`);

  return prisma.userPreferences.update({
    where: { userId: user.id },
    data: partial,
  });
}

export async function deleteUserPreferences(userEmail) {
  const user = await prisma.user.findUnique({ where: { email: userEmail } });
  if (!user) throw new Error(`User with email ${userEmail} not found`);

  return prisma.userPreferences.delete({
    where: { userId: user.id },
  });
}
