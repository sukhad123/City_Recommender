"use server";
import "server-only";

/**
 * PROVIDERS
 * - "apify" -> Apify (Realtor Canada actor)
 * - "mock"  -> returns static sample data
 */
const PROVIDER = process.env.HOUSING_PROVIDER || "apify";

// Province code -> full name (for UI display only)
const PROVINCE_MAP = {
  AB: "Alberta",
  BC: "British Columbia",
  MB: "Manitoba",
  NB: "New Brunswick",
  NL: "Newfoundland and Labrador",
  NS: "Nova Scotia",
  ON: "Ontario",
  PE: "Prince Edward Island",
  QC: "Quebec",
  SK: "Saskatchewan",
};

// ---------------- Apify (Realtor Canada actor) adapter ----------------
async function apifyRealtorSearch({ city, listingType, bedrooms, bathrooms }) {
  const token = process.env.APIFY_TOKEN;
  const actorId = process.env.APIFY_REALTOR_ACTOR_ID; // e.g., "username~realtor-canada"

  if (!token || !actorId) {
    console.warn("[Housing] Apify env vars missing -> mock fallback");
    return MOCK_LISTINGS;
  }

  // Actor input. Do NOT send price fields.
  // Docs example fields supported by many Realtor actors:
  // - city (string), country ("Canada"), listing_type ("for_sale" | "for_rent")
  // - bedrooms ("2-0"), bathrooms ("1-0"), days, zoom, delay, frompage
  const input = {
    city: city, // REQUIRED for the actor to focus area
    country: "Canada",
    listing_type: listingType, // "for_sale" | "for_rent"
    bedrooms: bedrooms || undefined, // "2-0"
    bathrooms: bathrooms || undefined, // "1-0"
    days: 7,
    zoom: 11,
    delay: 2,
  };

  // 1) Start actor run and wait up to 120s
  const runUrl = `https://api.apify.com/v2/acts/${encodeURIComponent(
    actorId
  )}/runs?token=${encodeURIComponent(token)}&waitForFinish=120`;

  let run;
  try {
    const runRes = await fetch(runUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
      next: { revalidate: 0 },
    });

    if (!runRes.ok) {
      const t = await runRes.text();
      console.error("[Housing Apify] run start failed", runRes.status, t);
      return MOCK_LISTINGS;
    }
    run = await runRes.json();
  } catch (err) {
    console.error("[Housing Apify] run start error", err);
    return MOCK_LISTINGS;
  }

  // 2) Fetch dataset items
  const runData = run?.data || run;
  const datasetId =
    runData?.defaultDatasetId ||
    runData?.data?.defaultDatasetId ||
    runData?.data?.datasetId;

  if (!datasetId) {
    console.warn("[Housing Apify] No datasetId on run:", runData?.status);
    return MOCK_LISTINGS;
  }

  const itemsUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${encodeURIComponent(
    token
  )}&clean=true`;

  let items = [];
  try {
    const itemsRes = await fetch(itemsUrl, { next: { revalidate: 0 } });
    if (!itemsRes.ok) {
      const t = await itemsRes.text();
      console.error("[Housing Apify] items fetch failed", itemsRes.status, t);
      return MOCK_LISTINGS;
    }
    items = await itemsRes.json();
  } catch (err) {
    console.error("[Housing Apify] items fetch error", err);
    return MOCK_LISTINGS;
  }

  return items.map((it, idx) => {
    // ---- IDs & URL ----
    const id = String(
      it?.MlsNumber ??
        it?.MLS?.Number ??
        it?.ListingID ??
        it?.Id ??
        it?.id ??
        `apify-${idx}`
    );

    const relUrl =
      it?.RelativeDetailsURL ??
      it?.RelativeURLEn ??
      it?.RelativeURLFr ??
      it?.PermalinkUrl ??
      it?.Url ??
      it?.Link ??
      null;

    const absoluteUrl = relUrl
      ? relUrl.startsWith("http")
        ? relUrl
        : `https://www.realtor.ca${relUrl}`
      : "#";

    // ---- Address / City / Province ----
    const addrObj = it?.Property?.Address || it?.Address || null;
    const addressText =
      addrObj?.AddressText ??
      it?.Address?.AddressText ??
      it?.AddressText ??
      it?.location ??
      "—";

    const cityGuess =
      addrObj?.AddressText?.split("|")[1]?.split(",")[0]?.trim() ||
      addrObj?.AddressText?.split(",")[0]?.trim() ||
      addrObj?.City ||
      "";

    const provinceGuess =
      addrObj?.AddressText?.split("|")[1]
        ?.split(",")[1]
        ?.trim()
        ?.split(" ")[0] ||
      addrObj?.Province ||
      "";

    // ---- Price (string + numeric) ----
    // Prefer pretty string; support rentals (LeaseRent) and sales (Price)
    const priceTextRaw =
      it?.Property?.Price ??
      it?.Property?.LeaseRent ??
      it?.Price ??
      it?.LeaseRent ??
      it?.RentPrice ??
      null;

    // Try to get numeric too, from common unformatted fields (varies by actor)
    const priceNumericRaw =
      it?.Property?.PriceUnformattedValue ??
      it?.Property?.LeaseRentUnformattedValue ??
      it?.PriceUnformattedValue ??
      it?.LeasePrice ??
      it?.RentPriceUnformattedValue ??
      null;

    const priceNumeric =
      typeof priceNumericRaw === "number"
        ? priceNumericRaw
        : Number(String(priceNumericRaw ?? "").replace(/[^\d.]/g, "")) || null;

    // ---- Beds / Baths ----
    const beds =
      it?.Building?.Bedrooms ?? it?.Bedrooms ?? it?.Property?.Bedrooms ?? null;

    const baths =
      it?.Building?.BathroomTotal ??
      it?.Bathrooms ??
      it?.Property?.BathroomTotal ??
      null;

    // ---- Type ----
    const type =
      it?.Property?.Type ??
      it?.Building?.Type ??
      it?.PropertyType ??
      it?.Type ??
      "—";

    // ---- Photos ----
    const photos =
      it?.Property?.Photo ??
      it?.Photos ??
      it?.Images ??
      it?.PropertyImages ??
      [];
    const firstImage =
      Array.isArray(photos) && photos.length
        ? photos[0]?.HighResPath ||
          photos[0]?.MedResPath ||
          photos[0]?.LowResPath ||
          photos[0]?.Url ||
          photos[0]?.Link ||
          photos[0]
        : null;

    // ---- Title ----
    const title =
      it?.PublicRemarks ?? it?.Title ?? type ?? addressText ?? "Listing";

    return {
      id,
      title,
      address: typeof addressText === "string" ? addressText : "—",
      city: cityGuess || "",
      province: provinceGuess || "",
      price: priceNumeric, // numeric if available
      priceText: priceTextRaw || null, // pretty string ("$2,600/Monthly" or "$499,900")
      beds,
      baths,
      type,
      url: absoluteUrl,
      image:
        firstImage || "https://source.unsplash.com/featured/?apartment,canada",
    };
  });
}

/**
 * Mock data (fallback)
 */
const MOCK_LISTINGS = [
  {
    id: "mock-apt-1",
    title: "2 Bed Condo – Downtown",
    address: "123 King St W, Toronto, ON",
    city: "Toronto",
    province: "ON",
    priceText: "$2,850",
    beds: 2,
    baths: 2,
    type: "Condo",
    url: "#",
    image: "https://source.unsplash.com/featured/?condo,toronto",
  },
  {
    id: "mock-apt-2",
    title: "1 Bed Basement – Quiet Area",
    address: "45 Oak Ave, Mississauga, ON",
    city: "Mississauga",
    province: "ON",
    priceText: "$1,500",
    beds: 1,
    baths: 1,
    type: "Basement",
    url: "#",
    image: "https://source.unsplash.com/featured/?basement,interior",
  },
];

/**
 * Public API
 * Input: { city (required), listingType, bedrooms?, bathrooms? }
 */
export async function searchHousing(params) {
  if (PROVIDER === "apify") {
    return apifyRealtorSearch(params);
  }
  return MOCK_LISTINGS;
}
