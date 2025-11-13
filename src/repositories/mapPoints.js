import "server-only";
import { getUserRecommendationsByEmail } from "./recommendations";
import { getCityDetailsByName } from "./cityDetails";

/**
 * Geocode a city/province using OpenStreetMap Nominatim
 * Returns { lat, lng } or null if not found / error.
 */
async function geocodeCity(city, province) {
  if (!city) return null;

  const queryParts = [city, province, "Canada"].filter(Boolean);
  const params = new URLSearchParams({
    q: queryParts.join(", "),
    format: "json",
    limit: "1",
    addressdetails: "1",
    countrycodes: "ca", 
  });

  const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "CityRecommender/1.0 (contact@example.com)",
      },
    });

    if (!res.ok) {
      console.warn("Nominatim geocode error status:", res.status);
      return null;
    }

    const data = await res.json();
    const place = data?.[0];
    if (!place?.lat || !place?.lon) {
      console.warn("Nominatim: no results for query:", queryParts);
      return null;
    }

    const lat = Number(place.lat);
    const lng = Number(place.lon);
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      console.warn("Nominatim: invalid coords for query:", queryParts, place);
      return null;
    }

    return { lat, lng };
  } catch (err) {
    console.error("Nominatim geocode error:", err);
    return null;
  }
}

export async function getUserMapPointsByEmail(email) {
  const normEmail = (email || "").trim().toLowerCase();
  console.log("mapPoints for:", normEmail);

  const recs = await getUserRecommendationsByEmail(normEmail);
  console.log(recs);
  console.log("recs count:", recs?.length, "sample:", recs?.slice?.(0, 3));

  const detailsList = await Promise.all(
    (recs || []).map(async (r, i) => {
      const city = r.city || r.name || r.cityName;
      const province = r.province || r.provinceCode || r.prov || null;
      console.log(`[${i}] try details for`, { city, province });

      const d = await getCityDetailsByName(city, province);

      // Default mock fallback if no details found
      const details = d || {
        city: city || "Unknown City",
        province: province || "ON",
        latitude: 43.65 + Math.random() * 0.3, 
        longitude: -79.38 + Math.random() * 0.3,
        demographics: {
          population: 100000 + Math.floor(Math.random() * 900000),
        },
        costOfLiving: {
          singleMonthly: 2000 + Math.floor(Math.random() * 1000),
          familyMonthly: 4500 + Math.floor(Math.random() * 1500),
          currency: "CAD",
        },
        jobOpportunities: {
          topIndustries: ["Tech", "Healthcare", "Education"],
          growingSectors: ["AI", "Green Energy", "Tourism"],
          demandByField: {
            tech: 8.2,
            healthcare: 7.5,
            education: 6.9,
            finance: 6.2,
          },
        },
      };

      let lat = details.coords?.lat ?? details.latitude ?? null;
      let lng = details.coords?.lng ?? details.longitude ?? null;

      // If coords missing, try geocoding 
      if ((lat == null || lng == null) && city) {
        console.log(`[${i}] missing coords, geocoding`, { city, province });
        const geo = await geocodeCity(city, province);
        if (geo) {
          lat = geo.lat;
          lng = geo.lng;
        }
      }

      if (lat == null || lng == null) {
        console.log(
          `[${i}] still missing coords for`,
          details.city,
          details.province
        );
        return null;
      }

      return {
        city: details.city ?? city,
        province: details.province ?? province,
        lat: Number(lat),
        lng: Number(lng),
        population: details.demographics?.population ?? null,
        costOfLiving: {
          singleMonthly: details.costOfLiving?.singleMonthly ?? null,
          familyMonthly: details.costOfLiving?.familyMonthly ?? null,
          currency: details.costOfLiving?.currency ?? "CAD",
        },
        jobs: {
          topIndustries: Array.isArray(details.jobOpportunities?.topIndustrities)
            ? details.jobOpportunities.topIndustries.slice(0, 5)
            : Array.isArray(details.jobOpportunities?.topIndustries)
            ? details.jobOpportunities.topIndustries.slice(0, 5)
            : [],
          growingSectors: Array.isArray(details.jobOpportunities?.growingSectors)
            ? details.jobOpportunities.growingSectors.slice(0, 5)
            : [],
          demandByField: details.jobOpportunities?.demandByField ?? {},
        },
      };
    })
  );

  let points = (detailsList || []).filter(Boolean);

  // If still empty (no recommendations or all nulls), inject 3 demo markers
  if (points.length === 0) {
    console.log("⚙️ Using mock demo points...");
    points = [
      {
        city: "Toronto",
        province: "ON",
        lat: 43.6532,
        lng: -79.3832,
        population: 2930000,
        costOfLiving: {
          singleMonthly: 2500,
          familyMonthly: 5200,
          currency: "CAD",
        },
        jobs: {
          topIndustries: ["Tech", "Finance", "Education"],
          growingSectors: ["AI", "Startups"],
          demandByField: { tech: 8.7 },
        },
      },
      {
        city: "Vancouver",
        province: "BC",
        lat: 49.2827,
        lng: -123.1207,
        population: 675000,
        costOfLiving: {
          singleMonthly: 2700,
          familyMonthly: 5400,
          currency: "CAD",
        },
        jobs: {
          topIndustries: ["Film", "Tech", "Tourism"],
          growingSectors: ["Green Energy"],
          demandByField: { film: 7.1 },
        },
      },
      {
        city: "Montreal",
        province: "QC",
        lat: 45.5017,
        lng: -73.5673,
        population: 1780000,
        costOfLiving: {
          singleMonthly: 1900,
          familyMonthly: 4100,
          currency: "CAD",
        },
        jobs: {
          topIndustries: ["Design", "Healthcare"],
          growingSectors: ["AI", "Biotech"],
          demandByField: { design: 6.5 },
        },
      },
    ];
  }

  console.log("points out:", points.length, "sample:", points.slice(0, 2));
  return points;
}
