// repositories/jobs.js
"use server";
import "server-only";

const ADZUNA_BASE = "https://api.adzuna.com/v1/api/jobs/ca/search/1";

// Normalize "where"
function buildWhere({ city, province }) {
  // Province may come as code ("ON") or name ("Ontario")
  // Prefer full province name in "where", because Adzuna responds better to names.
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

  const provName = PROVINCE_MAP[province] || province || ""; // allow full name too
  if (city && provName) return `${city}, ${provName}`;
  if (provName) return provName;
  if (city) return city; // last resort
  return ""; // national search
}

function buildAdzunaUrl({ title, city, province }) {
  const app_id = process.env.NEXT_PUBLIC_ADZUNA_APP_ID;
  const app_key = process.env.ADZUNA_APP_KEY;

  const params = new URLSearchParams({
    app_id,
    app_key,
    results_per_page: "25",
    sort_by: "relevance",
  });

  const what = (title || "").trim();
  const where = buildWhere({
    city: (city || "").trim(),
    province: (province || "").trim(),
  });

  if (what) params.set("what", what);
  if (where) params.set("where", where);

  return `${ADZUNA_BASE}?${params.toString()}`;
}

const MOCK_JOBS = [
  {
    id: "mock-1",
    title: "Software Engineer (Mock)",
    company: "ExampleTech",
    location: "Toronto, ON",
    url: "https://example.com/jobs/1",
    salary: "$90,000–$120,000",
    created: new Date().toISOString(),
    snippet: "Build and ship features in a modern stack. (Mock listing)",
  },
];

export async function searchJobs({ title, city, province }) {
  const url = buildAdzunaUrl({ title, city, province });
  if (process.env.NODE_ENV !== "production") {
    console.log("[Adzuna URL]", url.replace(/(app_key=)[^&]+/, "$1****"));
  }

  try {
    const res = await fetch(url, {
      next: { revalidate: 120 },
      headers: { "User-Agent": "City-Recommender/1.0" },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Adzuna error:", res.status, errText.slice(0, 300));
      return MOCK_JOBS; // fallback so UI still works
    }

    const data = await res.json();
    const hits = Array.isArray(data.results) ? data.results : [];
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Adzuna results] count=${hits.length}`);
    }

    if (hits.length === 0) return []; // no mock if API responded OK but empty

    return hits.map((r) => ({
      id: String(r.id ?? r.redirect_url),
      title: r.title || "Untitled",
      company: r.company?.display_name || "—",
      location:
        [r.location?.area?.at?.(-1), r.location?.area?.at?.(-2)]
          .filter(Boolean)
          .join(", ") ||
        r.location?.display_name ||
        "—",
      url: r.redirect_url || "#",
      salary:
        r.salary_min && r.salary_max
          ? `$${Math.round(r.salary_min).toLocaleString()}–$${Math.round(
              r.salary_max
            ).toLocaleString()}`
          : r.salary_min
          ? `$${Math.round(r.salary_min).toLocaleString()}+`
          : "—",
      created: r.created ?? r.created_at ?? null,
      snippet: r.description
        ? r.description.replace(/\s+/g, " ").slice(0, 200) + "…"
        : "",
    }));
  } catch (e) {
    console.error("Adzuna fetch failed:", e);
    return MOCK_JOBS;
  }
}

//----------------------------------------------------------------------------------------------------------
