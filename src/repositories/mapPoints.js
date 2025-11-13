import "server-only";
import { getUserRecommendationsByEmail } from "./recommendations";
import { getCityDetailsByName } from "./cityDetails";

export async function getUserMapPointsByEmail(email) {
  const normEmail = (email || "").trim().toLowerCase();
  console.log("mapPoints for:", normEmail);

  const recs = await getUserRecommendationsByEmail(normEmail);
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
        latitude: 43.65 + Math.random() * 0.3, // small spread around Toronto coords
        longitude: -79.38 + Math.random() * 0.3,
        demographics: { population: 100000 + Math.floor(Math.random() * 900000) },
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

      const lat = details.coords?.lat ?? details.latitude ?? null;
      const lng = details.coords?.lng ?? details.longitude ?? null;
      if (lat == null || lng == null) {
        console.log(`[${i}] missing coords for`, details.city, details.province);
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
          topIndustries: Array.isArray(details.jobOpportunities?.topIndustries)
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
        costOfLiving: { singleMonthly: 2500, familyMonthly: 5200, currency: "CAD" },
        jobs: { topIndustries: ["Tech", "Finance", "Education"], growingSectors: ["AI", "Startups"], demandByField: { tech: 8.7 } },
      },
      {
        city: "Vancouver",
        province: "BC",
        lat: 49.2827,
        lng: -123.1207,
        population: 675000,
        costOfLiving: { singleMonthly: 2700, familyMonthly: 5400, currency: "CAD" },
        jobs: { topIndustries: ["Film", "Tech", "Tourism"], growingSectors: ["Green Energy"], demandByField: { film: 7.1 } },
      },
      {
        city: "Montreal",
        province: "QC",
        lat: 45.5017,
        lng: -73.5673,
        population: 1780000,
        costOfLiving: { singleMonthly: 1900, familyMonthly: 4100, currency: "CAD" },
        jobs: { topIndustries: ["Design", "Healthcare"], growingSectors: ["AI", "Biotech"], demandByField: { design: 6.5 } },
      },
    ];
  }

  console.log("points out:", points.length, "sample:", points.slice(0, 2));
  return points;
}
