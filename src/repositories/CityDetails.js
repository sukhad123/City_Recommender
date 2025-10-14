"use server";

import { prisma } from "../db/prisma";

/**
 * Small local helper so this repo works standalone.
 * If you prefer, move this to: src/utils/slugify.js and import it.
 */
function slugifyCity(name) {
  return (name || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Get a city's full details by its slug (fast path).
 * Example: slug "toronto"
 */
export async function getCityDetailsBySlug(slug) {
  if (!slug) return null;
  return prisma.cityDetails.findUnique({
    where: { slug },
  });
}

/**
 * Get a city's full details by (city, province).
 * Province is recommended to disambiguate (e.g., London, ON).
 * Case-insensitive city match.
 */
export async function getCityDetailsByName(city, province) {
  if (!city) return null;

  const where = {
    city: { equals: city, mode: "insensitive" },
    ...(province ? { province } : {}),
  };

  return prisma.cityDetails.findFirst({ where });
}

/**
 * Convenience: try slug first, then fall back to (city, province) match.
 * Use this when you only have a city name from the URL (e.g., /city/[name]).
 */
export async function getCityDetailsBySlugOrName(rawName, province) {
  if (!rawName) return null;

  // 1) try slug
  const slug = slugifyCity(rawName);
  const bySlug = await prisma.cityDetails.findUnique({ where: { slug } });
  if (bySlug) return bySlug;

  // 2) fallback to case-insensitive city match (with optional province)
  return getCityDetailsByName(rawName, province);
}

/**
 * Lightweight list for dropdowns / selectors.
 * Returns minimal fields: city, province, slug, imageKey.
 */
export async function listCityBasics() {
  return prisma.cityDetails.findMany({
    select: { city: true, province: true, slug: true, imageKey: true },
    orderBy: [{ province: "asc" }, { city: "asc" }],
  });
}

/**
 * Simple text search by city name (case-insensitive "contains").
 * Good for "Find City" autocomplete.
 */
export async function searchCitiesByName(query, limit = 10) {
  if (!query) return [];
  return prisma.cityDetails.findMany({
    where: {
      city: { contains: query, mode: "insensitive" },
    },
    select: { city: true, province: true, slug: true, imageKey: true },
    take: limit,
    orderBy: [{ city: "asc" }],
  });
}

/**
 * Fetch only the heavy JSON sections for the City Info page.
 * Use this if you want to reduce payload when rendering many cards elsewhere.
 */
export async function getCitySectionsBySlug(slug) {
  if (!slug) return null;
  return prisma.cityDetails.findUnique({
    where: { slug },
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
}

/**
 * Batch-lookup details for a set of { city, province } pairs.
 * Useful if you want to enrich recommendation cards with imageKey/galleries.
 */
export async function getDetailsForPairs(pairs) {
  if (!Array.isArray(pairs) || pairs.length === 0) return [];

  return prisma.cityDetails.findMany({
    where: {
      OR: pairs.map((p) => ({
        city: { equals: p.city, mode: "insensitive" },
        province: p.province,
      })),
    },
    select: {
      city: true,
      province: true,
      slug: true,
      imageKey: true,
      gallery: true,
    },
  });
}
