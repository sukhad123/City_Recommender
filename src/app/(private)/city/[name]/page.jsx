"use client";

import { useParams } from "next/navigation";

/**
 * Reusable City Information page
 * - Used by: Recommendations list click
 * - Future: Also used by a "Find City" flow (choose from dropdown)
 */
export default function CityInfoPage() {
  const params = useParams();
  const rawName = Array.isArray(params?.name) ? params.name[0] : params?.name;
  const cityName = decodeURIComponent(rawName || "").replace(/_/g, " ");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">{cityName}</h1>
      <p className="text-gray-500">
        City information UI placeholder. We’ll populate all sections (jobs, COL,
        weather, rent, real estate, quality of life, education, healthcare,
        community, immigration support, safety, transit, internet/tech, outdoor
        & lifestyle, demographics) once the City details schema/API is ready.
      </p>
    </div>
  );
}
