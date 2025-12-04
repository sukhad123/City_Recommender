"use client";

import HousingCard from "./HousingCard";

export default function HousingList({ listings, loading }) {
  if (loading) {
    return <p className="text-gray-500">Searching listings…</p>;
  }
  if (!listings || listings.length === 0) {
    return (
      <p className="text-gray-500">No results. Try another city or filters.</p>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Object.values(
        listings.reduce((acc, it) => {
          const key = `${it.id}-${it.url}`;
          if (!acc[key]) acc[key] = it;
          return acc;
        }, {})
      ).map((it) => (
        <HousingCard key={`${it.id}-${it.url}`} listing={it} />
      ))}
    </div>
  );
}
