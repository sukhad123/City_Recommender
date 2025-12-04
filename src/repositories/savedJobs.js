"use server";

import "server-only";
import { prisma } from "../db/prisma";

/**
 * Shape expected from your jobs normalizer:
 * { id, title, company, location, url, salary, created, snippet }
 */

export async function saveJobForUser(job, userEmail) {
  if (!userEmail || !job?.id) return { ok: false, error: "Missing input" };

  try {
    const rec = await prisma.savedJob.upsert({
      where: {
        userEmail_externalId: { userEmail, externalId: String(job.id) },
      },
      update: {
        title: job.title ?? "Untitled",
        company: job.company ?? null,
        location: job.location ?? null,
        url: job.url ?? "#",
        salary: job.salary ?? null,
        data: job, // keep full payload for future
      },
      create: {
        userEmail,
        externalId: String(job.id),
        title: job.title ?? "Untitled",
        company: job.company ?? null,
        location: job.location ?? null,
        url: job.url ?? "#",
        salary: job.salary ?? null,
        data: job,
      },
    });

    return { ok: true, id: rec.id };
  } catch (e) {
    console.error("[saveJobForUser] failed", e);
    return { ok: false, error: "DB error" };
  }
}

export async function listSavedJobs(userEmail) {
  if (!userEmail) return [];
  const rows = await prisma.savedJob.findMany({
    where: { userEmail },
    orderBy: { createdAt: "desc" },
  });
  return rows;
}

export async function deleteSavedJob(id, userEmail) {
  if (!id || !userEmail) return { ok: false, error: "Missing" };
  try {
    await prisma.savedJob.delete({
      where: { id },
    });
    return { ok: true };
  } catch (e) {
    console.error("[deleteSavedJob] failed", e);
    return { ok: false, error: "DB error" };
  }
}
