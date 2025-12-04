"use server";

import "server-only";
import { prisma } from "../db/prisma";

/**
 * Shape expected from your housing normalizer (Apify Realtor):
 * { id, title, address, city, province, price, priceText, beds, baths, type, url, image }
 */

export async function saveHousingForUser(listing, userEmail) {
  if (!userEmail || !listing?.id) return { ok: false, error: "Missing input" };

  try {
    const rec = await prisma.savedHousing.upsert({
      where: {
        userEmail_externalId: { userEmail, externalId: String(listing.id) },
      },
      update: {
        title: listing.title ?? "Listing",
        address: listing.address ?? null,
        city: listing.city ?? null,
        province: listing.province ?? null,
        priceText: listing.priceText ?? null,
        url: listing.url ?? "#",
        image: listing.image ?? null,
        beds: Number.isFinite(listing.beds) ? listing.beds : null,
        baths: Number.isFinite(listing.baths) ? listing.baths : null,
        type: listing.type ?? null,
        data: listing,
      },
      create: {
        userEmail,
        externalId: String(listing.id),
        title: listing.title ?? "Listing",
        address: listing.address ?? null,
        city: listing.city ?? null,
        province: listing.province ?? null,
        priceText: listing.priceText ?? null,
        url: listing.url ?? "#",
        image: listing.image ?? null,
        beds: Number.isFinite(listing.beds) ? listing.beds : null,
        baths: Number.isFinite(listing.baths) ? listing.baths : null,
        type: listing.type ?? null,
        data: listing,
      },
    });

    return { ok: true, id: rec.id };
  } catch (e) {
    console.error("[saveHousingForUser] failed", e);
    return { ok: false, error: "DB error" };
  }
}

export async function listSavedHousing(userEmail) {
  if (!userEmail) return [];
  const rows = await prisma.savedHousing.findMany({
    where: { userEmail },
    orderBy: { createdAt: "desc" },
  });
  return rows;
}

export async function deleteSavedHousing(id, userEmail) {
  if (!id || !userEmail) return { ok: false, error: "Missing" };
  try {
    await prisma.savedHousing.delete({
      where: { id },
    });
    return { ok: true };
  } catch (e) {
    console.error("[deleteSavedHousing] failed", e);
    return { ok: false, error: "DB error" };
  }
}
