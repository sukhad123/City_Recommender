"use client";
import { CircleMarker, Tooltip } from "react-leaflet";

function radiusFrom(pop) {
  if (!pop || pop <= 0) return 6;
  return Math.max(6, Math.min(24, Math.sqrt(pop) / 80));
}
function colorFrom(pop) {
  if (!pop) return "#4B5563";
  if (pop > 2_000_000) return "#B91C1C";
  if (pop > 500_000) return "#DC2626";
  if (pop > 100_000) return "#F97316";
  return "#059669";
}
const cad = (n) =>
  typeof n === "number"
    ? n.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 })
    : "—";

export default function CityMarkersLayer({ points, onMarkerClick }) {
  if (!points?.length) return null;

  return (
    <>
      {points.map((p, i) => {
        const r = radiusFrom(p.population);
        const color = colorFrom(p.population);
        const single = p.costOfLiving?.singleMonthly;

        return (
          <CircleMarker
            key={`${p.city}-${p.province ?? ""}-${i}`}
            center={[Number(p.lat), Number(p.lng)]}
            radius={r}
            pathOptions={{ color, weight: 1, fillOpacity: 0.5 }}
            eventHandlers={{ click: () => onMarkerClick?.(p) }}
          >
            <Tooltip direction="top" offset={[0, -2]} opacity={1}>
              <div className="text-xs">
                <div className="font-semibold">
                  {p.city}{p.province ? `, ${p.province}` : ""}
                </div>
                {p.population != null && (
                  <div>Population: {p.population.toLocaleString()}</div>
                )}
                <div>Single / mo: {cad(single)}</div>
                {p.jobs?.topIndustries?.length ? (
                  <div>Top: {p.jobs.topIndustries.slice(0,2).join(", ")}</div>
                ) : null}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}
