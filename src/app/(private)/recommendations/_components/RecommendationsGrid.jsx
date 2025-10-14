"use client";

import RecommendationCard from "./RecommendationCard";

export default function RecommendationsGrid({
  recs,
  onCityClick,
  getImageUrl,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {recs.map((r) => (
        <RecommendationCard
          key={`${r.rank}-${r.city}`}
          city={r.city}
          province={r.province}
          score={r.score}
          rank={r.rank}
          imageUrl={getImageUrl(r.city, r.province)}
          onPress={() => onCityClick({ city: r.city, province: r.province })}
        />
      ))}
    </div>
  );
}
