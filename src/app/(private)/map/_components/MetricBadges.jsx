"use client";
export default function MetricBadges({ city }) {
  const items = [
    city.population != null && { label: "Crowdedness", value: tagCrowded(city.population) },
    typeof city.affordabilityMonthly === "number" && {
      label: "Affordability",
      value: affordabilityScore(city.affordabilityMonthly),
    },
    city.employmentRate != null && { label: "Jobs", value: jobsTag(city.employmentRate) },
  ].filter(Boolean);

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((it, i) => (
        <span key={i} className="px-3 py-1 rounded-full bg-gray-100 text-xs">
          <span className="font-semibold">{it.label}:</span> {it.value}
        </span>
      ))}
    </div>
  );
}

function tagCrowded(pop) {
  if (pop > 2_000_000) return "Very High";
  if (pop > 500_000) return "High";
  if (pop > 100_000) return "Medium";
  return "Low";
}
function affordabilityScore(monthly) {
  const min = 1200, max = 4800;
  const clamp = Math.max(min, Math.min(max, monthly));
  const score = Math.round(100 - ((clamp - min) / (max - min)) * 100);
  return `${score}/100`;
}
function jobsTag(rate) {
  if (rate >= 80) return "Excellent";
  if (rate >= 70) return "Good";
  if (rate >= 60) return "Fair";
  return "Low";
}
