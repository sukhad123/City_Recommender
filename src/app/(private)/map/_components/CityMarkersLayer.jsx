"use client";
import { CircleMarker, Tooltip } from "react-leaflet";
import { distanceKm } from "./distance";  

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
    ? n.toLocaleString("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0,
      })
    : "—";

export default function CityMarkersLayer({
  points,
  onMarkerClick,
  selectedCity,
  radiusKm,
}) {
  if (!points?.length) return null;

  const highlightEnabled = !!selectedCity && radiusKm > 0;

  return (
    <>
      {points.map((p, i) => {
        const baseRadius = radiusFrom(p.population);
        const baseColor = colorFrom(p.population);
        const single = p.costOfLiving?.singleMonthly;

        const lat = Number(p.lat);
        const lng = Number(p.lng);

        const isSelected =
          selectedCity &&
          selectedCity.city === p.city &&
          (selectedCity.province ?? null) === (p.province ?? null);

        let isNearby = false;
        let distanceFromSelected = null;

        if (highlightEnabled) {
          distanceFromSelected = distanceKm(
            Number(selectedCity.lat),
            Number(selectedCity.lng),
            lat,
            lng
          );
        }

        if (highlightEnabled && !isSelected && distanceFromSelected != null) {
          isNearby = distanceFromSelected <= radiusKm;
        }

        // styling
        let strokeColor = baseColor;
        let fillColor = baseColor;
        let radius = baseRadius;
        let weight = 1;
        let fillOpacity = 0.5;

        if (isSelected) {
          strokeColor = "#1D4ED8";
          fillColor = "#3B82F6";
          radius = baseRadius + 4;
          weight = 3;
          fillOpacity = 0.9;
        } else if (isNearby) {
          strokeColor = "#cfc80eff";
          fillColor = "#fafa05ff";
          radius = baseRadius + 2;
          weight = 2;
          fillOpacity = 0.8;
        }

        const showDistance =
          highlightEnabled && !isSelected && distanceFromSelected != null;

        return (
          <CircleMarker
            key={`${p.city}-${p.province ?? ""}-${i}`}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              color: strokeColor,
              weight,
              fillColor,
              fillOpacity,
            }}
            eventHandlers={{ click: () => onMarkerClick?.(p) }}
          >
            <Tooltip direction="top" offset={[0, -2]} opacity={1}>
              <div className="text-xs">
                <div className="font-semibold">
                  {p.city}
                  {p.province ? `, ${p.province}` : ""}
                </div>
                {p.population != null && (
                  <div>Population: {p.population.toLocaleString()}</div>
                )}
                <div>Single / mo: {cad(single)}</div>
                {p.jobs?.topIndustries?.length ? (
                  <div>
                    Top: {p.jobs.topIndustries.slice(0, 2).join(", ")}
                  </div>
                ) : null}
                {showDistance && (
                  <div>
                    Distance from {selectedCity.city}:{" "}
                    {Math.round(distanceFromSelected)} km
                  </div>
                )}
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}
