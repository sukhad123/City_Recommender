"use server";

import { prisma } from "../db/prisma";

// Helper: handle “table missing” gracefully so UI can show placeholders
function isMissingTable(err) {
  return err?.code === "P2021" || /does not exist/i.test(String(err?.message));
}

/**
 * Get full details by city + (optional) province.
 * If province is omitted and multiple matches exist across provinces,
 * we return the first (alphabetical by province).
 */
export async function getCityDetailsByName(city, province) {
  if (!city) return null;
  const where = {
    city: { equals: city, mode: "insensitive" },
    ...(province ? { province } : {}),
  };
  try {
    if (province) {
      // unique on (city, province) → use findFirst with both
      return await prisma.cityDetails.findFirst({ where });
    }
    // no province: pick a deterministic first
    return await prisma.cityDetails.findFirst({
      where,
      orderBy: [{ province: "asc" }, { city: "asc" }],
    });
  } catch (err) {
    if (isMissingTable(err)) return null;
    throw err;
  }
}

/**
 * Select heavy JSON sections only (for the City page), by city + (optional) province.
 */
export async function getCitySectionsByName(city, province) {
  if (!city) return null;
  const where = {
    city: { equals: city, mode: "insensitive" },
    ...(province ? { province } : {}),
  };
  try {
    return await prisma.cityDetails.findFirst({
      where,
      orderBy: province ? undefined : [{ province: "asc" }, { city: "asc" }],
      select: {
        city: true,
        province: true,
        imageKey: true,
        gallery: true,
        jobOpportunities: true,
        costOfLiving: true,
        weather: true,
        rent: true,
        realEstate: true,
        qualityOfLife: true,
        education: true,
        healthcare: true,
        communityIntegration: true,
        immigrationSupport: true,
        safetyCrime: true,
        transportation: true,
        internetTech: true,
        outdoorLifestyle: true,
        demographics: true,
        updatedAt: true,
      },
    });
  } catch (err) {
    if (isMissingTable(err)) return null;
    throw err;
  }
}

/** Minimal list for dropdowns/autocomplete (no slug). */
export async function listCityBasics() {
  try {
    return await prisma.cityDetails.findMany({
      select: { city: true, province: true, imageKey: true },
      orderBy: [{ province: "asc" }, { city: "asc" }],
    });
  } catch (err) {
    if (isMissingTable(err)) return [];
    throw err;
  }
}

/** Simple search by city name (case-insensitive). */
export async function searchCitiesByName(query, limit = 10) {
  if (!query) return [];
  try {
    return await prisma.cityDetails.findMany({
      where: { city: { contains: query, mode: "insensitive" } },
      select: { city: true, province: true, imageKey: true },
      take: limit,
      orderBy: [{ city: "asc" }, { province: "asc" }],
    });
  } catch (err) {
    if (isMissingTable(err)) return [];
    throw err;
  }
}
