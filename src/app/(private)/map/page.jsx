"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthInfo } from "../../auth/utils/getCurrentUserDetails";
import CitySidePanel from "./_components/CitySidePanel";

const MapView = dynamic(() => import("./_components/MapView"), { ssr: false });

export default function MapPage() {
  const user = useAuthInfo();                
  const router = useRouter();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!user?.email) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/map-points", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
          cache: "no-store",
        });
        const json = await res.json();
        setPoints(Array.isArray(json.points) ? json.points : []);
      } catch (e) {
        console.error("Map points fetch failed:", e);
        setPoints([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.email]);

  const openCity = (p) => {
    const q = p.province ? `?province=${encodeURIComponent(p.province)}` : "";
    router.push(`/city/${encodeURIComponent(p.city)}${q}`);
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full relative">
      <div className="absolute inset-0">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            Loading map…
          </div>
        ) : (
          <MapView
            center={[56.1304, -106.3468]} // Canada
            zoom={4}
            points={points}
            onMarkerClick={setSelected}
          />
        )}
      </div>

      <CitySidePanel
        city={selected}
        onClose={() => setSelected(null)}
        onOpenCity={() => selected && openCity(selected)}
      />
    </div>
  );
}
