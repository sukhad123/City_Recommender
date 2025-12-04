"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import CitySidePanel from "./_components/CitySidePanel";
import { distanceKm } from "./_components/distance"; // ⬅ NEW

const MapView = dynamic(() => import("./_components/MapView"), { ssr: false });

export default function MapPage() {
  const user = useAuthInfo();
  const router = useRouter();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [radiusKm, setRadiusKm] = useState(0);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!user?.email) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const key = `mapPoints:${user.email}`;
    let usedCache = false;

    // 1) Try to load from localStorage
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const cachedPoints = parsed.points;
          const ts = parsed.ts;
          const maxAgeMs = 1000 * 60 * 60 * 24; // 24h, tweak if you want

          if (
            Array.isArray(cachedPoints) &&
            (!ts || Date.now() - ts < maxAgeMs)
          ) {
            setPoints(cachedPoints);
            setLoading(false); // show map immediately with cached data
            usedCache = true;
          }
        } catch {
          // ignore bad cache
        }
      }
    }

    // 2) Always revalidate from server (but don't block UI if we had cache)
    (async () => {
      if (!usedCache) setLoading(true);
      try {
        const res = await fetch("/api/map-points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
          cache: "no-store",
        });
        const json = await res.json();
        const freshPoints = Array.isArray(json.points) ? json.points : [];
        setPoints(freshPoints);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            key,
            JSON.stringify({ points: freshPoints, ts: Date.now() })
          );
        }
      } catch (e) {
        console.error("Map points fetch failed:", e);
        if (!usedCache) setPoints([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.email]);

  const handleMarkerClick = (p) => setSelected(p);

  const handleRadiusChange = (e) => setRadiusKm(Number(e.target.value) || 0);

  const radiusLabel =
    radiusKm === 0
      ? "Nearby cities highlight: Off"
      : `Highlight within ${radiusKm} km`;

  // Open a city page; works for selected or a passed-in city
  const handleOpenCity = (p) => {
    const city = p ?? selected;
    if (!city) return;
    const q = city.province
      ? `?province=${encodeURIComponent(city.province)}`
      : "";
    router.push(`/city/${encodeURIComponent(city.city)}${q}`);
  };

  // Nearby cities list (for side panel)
  const nearbyCities = useMemo(() => {
    if (!selected || radiusKm <= 0 || !points?.length) return [];

    const sLat = Number(selected.lat);
    const sLng = Number(selected.lng);

    return points
      .filter(
        (p) =>
          !(
            p.city === selected.city &&
            (p.province ?? null) === (selected.province ?? null)
          )
      )
      .map((p) => {
        const d = distanceKm(sLat, sLng, Number(p.lat), Number(p.lng));
        return { ...p, distanceKm: d };
      })
      .filter((p) => p.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [points, selected, radiusKm]);

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
    {/* Slider overlay */}
<div className="absolute z-[5100] bottom-4 left-4 w-64 sm:w-72
  bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-700
  rounded-xl px-4 py-3 shadow-md text-xs sm:text-sm">
  <div className="font-semibold mb-1 text-gray-900 dark:text-gray-100">
    Nearby Cities Radius
  </div>

<div className="flex items-center gap-3">
  <input
    type="range"
    min={0}
    max={200}
    step={20}
    value={radiusKm}
    onChange={handleRadiusChange}
    className="flex-1"   
  />
  <span
    className="w-16 text-right whitespace-nowrap text-gray-700 dark:text-gray-200"
  >
    {radiusKm === 0 ? "Off" : `${radiusKm} km`}
  </span>
</div>

  <div className="text-[11px] text-gray-500 dark:text-gray-400">
    {selected && radiusKm > 0 ? (
      `${nearbyCities.length} cities within ${radiusKm} km`
    ) : (
     
      <span className="opacity-0">placeholder</span>
    )}
  </div>
</div>


      {/* Map */}
      <div className="absolute inset-0">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading map…
          </div>
        ) : (
          <MapView
            center={[56.1304, -106.3468]}
            zoom={4}
            points={points}
            onMarkerClick={handleMarkerClick}
            selectedCity={selected}
            radiusKm={radiusKm}
          />
        )}
      </div>

      <CitySidePanel
        city={selected}
        nearbyCities={nearbyCities}
        radiusKm={radiusKm}
        onClose={() => setSelected(null)}
        onOpenCity={handleOpenCity}
      />
    </div>
  );
}
